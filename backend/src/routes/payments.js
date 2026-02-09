const express = require('express');
const Stripe = require('stripe');
const { pool } = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY not set');
  return new Stripe(key, { apiVersion: '2024-06-20' });
}

// Create Stripe checkout session for a cart. Login required.
router.post('/create-checkout-session', requireAuth, async (req, res) => {
  const { items, shippingAddress, phone } = req.body || {};
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'items are required' });
  }
  const productIds = items.map(i => Number(i.productId)).filter(n => Number.isFinite(n));
  if (productIds.length !== items.length) {
    return res.status(400).json({ error: 'Invalid productId' });
  }

  try {
    const stripe = getStripe();

    const productsRes = await pool.query(
      `SELECT id, name, price, stock
       FROM products
       WHERE id = ANY($1::int[]) AND is_active = TRUE`,
      [productIds]
    );
    const products = new Map(productsRes.rows.map(p => [p.id, p]));
    if (products.size !== productIds.length) {
      return res.status(400).json({ error: 'One or more products are unavailable' });
    }

    let subtotal = 0;
    const lineItems = items.map(i => {
      const pid = Number(i.productId);
      const qty = Math.max(1, Number(i.qty || 1));
      const p = products.get(pid);
      if (!p) throw new Error('Product missing');
      if (p.stock < qty) {
        const e = new Error(`Insufficient stock for ${p.name}`);
        e.code = 'STOCK';
        throw e;
      }
      const unit = Number(p.price);
      subtotal += unit * qty;
      return {
        price_data: {
          currency: 'usd',
          product_data: { name: p.name },
          unit_amount: Math.round(unit * 100),
        },
        quantity: qty,
        // Keep a small trace, useful for reconciliation
        adjustable_quantity: { enabled: false },
      };
    });
    const total = subtotal;

    await pool.query('BEGIN');
    const orderRes = await pool.query(
      `INSERT INTO orders (user_id, email, phone, shipping_address, subtotal, total, currency, status, payment_method, payment_status)
       VALUES ($1,$2,$3,$4::jsonb,$5,$6,'usd','pending','card','pending')
       RETURNING id`,
      [req.user.id, req.user.email, phone || req.user.phone || null, JSON.stringify(shippingAddress || {}), subtotal, total]
    );
    const orderId = orderRes.rows[0].id;

    for (let idx = 0; idx < items.length; idx++) {
      const pid = Number(items[idx].productId);
      const qty = Math.max(1, Number(items[idx].qty || 1));
      const p = products.get(pid);
      const unit = Number(p.price);
      const line = unit * qty;
      await pool.query(
        `INSERT INTO order_items (order_id, product_id, qty, unit_price, line_total)
         VALUES ($1,$2,$3,$4,$5)`,
        [orderId, pid, qty, unit, line]
      );
    }

    const successUrl = process.env.STRIPE_SUCCESS_URL || 'http://localhost:5173/payment/success?session_id={CHECKOUT_SESSION_ID}';
    const cancelUrl = process.env.STRIPE_CANCEL_URL || 'http://localhost:5173/payment/cancel';

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: req.user.email,
      metadata: { orderId: String(orderId), userId: String(req.user.id) },
    });

    await pool.query('UPDATE orders SET stripe_session_id = $1 WHERE id = $2', [session.id, orderId]);
    await pool.query('COMMIT');

    return res.json({ url: session.url, sessionId: session.id, orderId });
  } catch (err) {
    try { await pool.query('ROLLBACK'); } catch {}
    if (err.code === 'STOCK') return res.status(409).json({ error: err.message });
    console.error(err);
    return res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Verify session and mark order as paid (login required).
router.get('/verify', requireAuth, async (req, res) => {
  const { session_id } = req.query;
  if (!session_id) return res.status(400).json({ error: 'session_id is required' });
  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(String(session_id));
    if (!session) return res.status(404).json({ error: 'Session not found' });

    const orderId = Number(session.metadata?.orderId);
    if (!orderId) return res.status(400).json({ error: 'Order not linked' });

    // Ensure order belongs to user
    const orderRes = await pool.query('SELECT * FROM orders WHERE id = $1 AND user_id = $2', [orderId, req.user.id]);
    if (orderRes.rows.length === 0) return res.status(403).json({ error: 'Forbidden' });
    const orderRow = orderRes.rows[0];

    if (session.payment_status !== 'paid') {
      return res.json({ ok: false, paymentStatus: session.payment_status });
    }

    await pool.query('BEGIN');
    // Mark paid
    await pool.query(
      `UPDATE orders
       SET payment_status = 'paid', status = 'processing', stripe_payment_intent_id = $1, updated_at = NOW()
       WHERE id = $2`,
      [session.payment_intent || null, orderId]
    );

    // Deduct inventory only once
    if (!orderRow.inventory_deducted) {
      const itemsRes = await pool.query('SELECT product_id, qty FROM order_items WHERE order_id = $1', [orderId]);
      for (const it of itemsRes.rows) {
        await pool.query('UPDATE products SET stock = GREATEST(stock - $1, 0) WHERE id = $2', [it.qty, it.product_id]);
      }
      await pool.query('UPDATE orders SET inventory_deducted = TRUE WHERE id = $1', [orderId]);
    }

    await pool.query('COMMIT');

    return res.json({ ok: true, orderId });
  } catch (err) {
    try { await pool.query('ROLLBACK'); } catch {}
    console.error(err);
    return res.status(500).json({ error: 'Verify failed' });
  }
});

module.exports = router;

const express = require('express');
const { pool } = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Logged-in user's orders
router.get('/mine', requireAuth, async (req, res) => {
  try {
    const ordersRes = await pool.query(
      `SELECT id, subtotal, total, currency, status, payment_method, payment_status, created_at
       FROM orders WHERE user_id = $1 ORDER BY id DESC`,
      [req.user.id]
    );
    return res.json(ordersRes.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Create a COD order (login required)
router.post('/', requireAuth, async (req, res) => {
  const { items, shippingAddress, phone } = req.body || {};
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'items are required' });
  }

  // Fetch products + compute totals server-side
  const productIds = items.map(i => Number(i.productId)).filter(n => Number.isFinite(n));
  if (productIds.length !== items.length) {
    return res.status(400).json({ error: 'Invalid productId' });
  }

  try {
    const productsRes = await pool.query(
      `SELECT id, price, stock, name
       FROM products
       WHERE id = ANY($1::int[]) AND is_active = TRUE`,
      [productIds]
    );
    const products = new Map(productsRes.rows.map(p => [p.id, p]));
    if (products.size !== productIds.length) {
      return res.status(400).json({ error: 'One or more products are unavailable' });
    }

    let subtotal = 0;
    const lines = items.map(i => {
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
      const line = unit * qty;
      subtotal += line;
      return { product_id: pid, qty, unit_price: unit, line_total: line };
    });

    const total = subtotal; // add shipping/tax later if needed

    // Transaction
    await pool.query('BEGIN');
    const orderRes = await pool.query(
      `INSERT INTO orders (user_id, email, phone, shipping_address, subtotal, total, currency, status, payment_method, payment_status)
       VALUES ($1,$2,$3,$4::jsonb,$5,$6,'usd','pending','cod','unpaid')
       RETURNING id, total, currency, status, payment_method, payment_status`,
      [req.user.id, req.user.email, phone || req.user.phone || null, JSON.stringify(shippingAddress || {}), subtotal, total]
    );
    const order = orderRes.rows[0];

    for (const l of lines) {
      await pool.query(
        `INSERT INTO order_items (order_id, product_id, qty, unit_price, line_total)
         VALUES ($1,$2,$3,$4,$5)`,
        [order.id, l.product_id, l.qty, l.unit_price, l.line_total]
      );
      await pool.query('UPDATE products SET stock = stock - $1 WHERE id = $2', [l.qty, l.product_id]);
    }

    await pool.query('COMMIT');
    return res.status(201).json({ orderId: order.id });
  } catch (err) {
    try { await pool.query('ROLLBACK'); } catch {}
    if (err.code === 'STOCK') {
      return res.status(409).json({ error: err.message });
    }
    console.error(err);
    return res.status(500).json({ error: 'Failed to create order' });
  }
});

module.exports = router;

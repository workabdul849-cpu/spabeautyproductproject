const express = require('express');
const { pool } = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Return already-booked time slots for a given staff member and date.
// Public endpoint (booking page uses it) but works best with an explicit staffId.
router.get('/slots', async (req, res) => {
  const { date, staffId } = req.query;
  if (!date || !staffId) {
    return res.status(400).json({ error: 'date and staffId are required' });
  }
  try {
    const result = await pool.query(
      `SELECT time
       FROM bookings
       WHERE staff_id = $1 AND date = $2 AND status <> 'cancelled'`,
      [Number(staffId), date]
    );
    return res.json({ booked: result.rows.map(r => r.time) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch slots' });
  }
});

// Logged-in user's bookings
router.get('/mine', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT b.id, b.date, b.time, b.status, b.notes, b.rating, b.feedback,
              s.id AS service_id, s.name AS service_name, s.duration, s.price,
              st.id AS staff_id, st.name AS staff_name
       FROM bookings b
       JOIN services s ON s.id = b.service_id
       LEFT JOIN staff st ON st.id = b.staff_id
       WHERE b.user_id = $1
       ORDER BY b.date DESC, b.time DESC`,
      [req.user.id]
    );
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Create booking (login required)
router.post('/', requireAuth, async (req, res) => {
  const { serviceId, staffId, date, time, notes } = req.body || {};
  if (!serviceId || !date || !time) {
    return res.status(400).json({ error: 'serviceId, date, time are required' });
  }
  try {
    // Ensure service exists
    const svc = await pool.query('SELECT id FROM services WHERE id = $1', [Number(serviceId)]);
    if (svc.rows.length === 0) return res.status(400).json({ error: 'Invalid serviceId' });

    // If staffId provided, verify.
    let chosenStaff = staffId ? Number(staffId) : null;
    if (chosenStaff) {
      const st = await pool.query('SELECT id FROM staff WHERE id = $1', [chosenStaff]);
      if (st.rows.length === 0) return res.status(400).json({ error: 'Invalid staffId' });
    }

    // Insert booking. Unique partial index prevents double-booking if staff chosen.
    const result = await pool.query(
      `INSERT INTO bookings (user_id, service_id, staff_id, date, time, notes)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING *`,
      [req.user.id, Number(serviceId), chosenStaff, date, time, notes || null]
    );

    // Loyalty points: 1 point per $10 of service price
    try {
      const priceRes = await pool.query('SELECT price FROM services WHERE id = $1', [Number(serviceId)]);
      const price = Number(priceRes.rows[0]?.price || 0);
      const points = Math.floor(price / 10);
      if (points > 0) {
        await pool.query('UPDATE users SET loyalty_points = loyalty_points + $1 WHERE id = $2', [points, req.user.id]);
      }
    } catch (e) {
      // do not fail booking if points update fails
    }

    return res.status(201).json(result.rows[0]);
  } catch (err) {
    // Handle unique constraint violation for double booking
    if (String(err.code) === '23505') {
      return res.status(409).json({ error: 'This time slot is already booked' });
    }
    console.error(err);
    return res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Cancel booking (login required)
router.put('/:id/cancel', requireAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `UPDATE bookings
       SET status = 'cancelled'
       WHERE id = $1 AND user_id = $2
       RETURNING id, status`,
      [Number(id), req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Booking not found' });
    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

// Submit feedback (login required)
router.put('/:id/feedback', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { rating, feedback } = req.body || {};
  try {
    const result = await pool.query(
      `UPDATE bookings
       SET rating = $1, feedback = $2
       WHERE id = $3 AND user_id = $4
       RETURNING id, rating, feedback`,
      [rating ?? null, feedback ?? null, Number(id), req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Booking not found' });
    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

module.exports = router;

const express = require('express');
const { pool } = require('../db');
const { requirePermission } = require('../middleware/auth');

const router = express.Router();

// NOTE: Client records are sensitive (PII). Keep this locked to admin/staff with explicit permission.

// Get all clients (camelCase response for the front-end)
router.get('/', requirePermission('clients', 'read'), async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, phone, bookings, loyalty_points AS "loyaltyPoints" FROM clients ORDER BY id'
    );
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch clients' });
  }
});

// Create a client
router.post('/', requirePermission('clients', 'write'), async (req, res) => {
  const { name, email, phone, bookings, loyaltyPoints } = req.body || {};
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO clients (name, email, phone, bookings, loyalty_points) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, phone, bookings, loyalty_points AS "loyaltyPoints"',
      [
        name,
        email || null,
        phone || null,
        Number.isFinite(Number(bookings)) ? Number(bookings) : 0,
        Number.isFinite(Number(loyaltyPoints)) ? Number(loyaltyPoints) : 0,
      ]
    );
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to create client' });
  }
});

// Update a client
router.put('/:id', requirePermission('clients', 'write'), async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, bookings, loyaltyPoints } = req.body || {};
  try {
    const result = await pool.query(
      'UPDATE clients SET name = $1, email = $2, phone = $3, bookings = $4, loyalty_points = $5 WHERE id = $6 RETURNING id, name, email, phone, bookings, loyalty_points AS "loyaltyPoints"',
      [
        name,
        email || null,
        phone || null,
        Number.isFinite(Number(bookings)) ? Number(bookings) : 0,
        Number.isFinite(Number(loyaltyPoints)) ? Number(loyaltyPoints) : 0,
        id,
      ]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }
    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to update client' });
  }
});

// Delete a client
router.delete('/:id', requirePermission('clients', 'write'), async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM clients WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }
    return res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to delete client' });
  }
});

module.exports = router;

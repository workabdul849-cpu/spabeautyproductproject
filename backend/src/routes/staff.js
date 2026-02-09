const express = require('express');
const { pool } = require('../db');
const { requirePermission } = require('../middleware/auth');
const router = express.Router();

// Get all staff members
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, role, availability, image_url FROM staff ORDER BY id');
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch staff' });
  }
});

// Create staff member (admin/staff with permission)
router.post('/', requirePermission('staff', 'write'), async (req, res) => {
  const { name, role, availability, imageUrl } = req.body;
  if (!name || !role) {
    return res.status(400).json({ error: 'Name and role are required' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO staff (name, role, availability, image_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, role, availability || null, imageUrl || null]
    );
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to create staff' });
  }
});

// Update staff member (admin/staff with permission)
router.put('/:id', requirePermission('staff', 'write'), async (req, res) => {
  const { id } = req.params;
  const { name, role, availability, imageUrl } = req.body;
  try {
    const result = await pool.query(
      'UPDATE staff SET name = $1, role = $2, availability = $3, image_url = $4 WHERE id = $5 RETURNING *',
      [name, role, availability || null, imageUrl || null, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Staff member not found' });
    }
    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to update staff' });
  }
});

// Delete staff member (admin/staff with permission)
router.delete('/:id', requirePermission('staff', 'write'), async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM staff WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Staff member not found' });
    }
    return res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to delete staff' });
  }
});

module.exports = router;
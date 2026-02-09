const express = require('express');
const { pool } = require('../db');
const { requirePermission } = require('../middleware/auth');
const router = express.Router();

// Fetch all services
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, category, duration, price, description, image_url FROM services ORDER BY id'
    );
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// Fetch single service
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT id, name, category, duration, price, description, image_url FROM services WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Service not found' });
    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch service' });
  }
});

// Create a new service
router.post('/', requirePermission('services', 'write'), async (req, res) => {
  const { name, category, duration, price, description, imageUrl } = req.body;
  if (!name || !category || !duration || price === undefined || price === null) {
    return res.status(400).json({ error: 'Name, category, duration and price are required' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO services (name, category, duration, price, description, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, category, duration, price, description || null, imageUrl || null]
    );
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to create service' });
  }
});

// Update a service
router.put('/:id', requirePermission('services', 'write'), async (req, res) => {
  const { id } = req.params;
  const { name, category, duration, price, description, imageUrl } = req.body;
  try {
    const result = await pool.query(
      'UPDATE services SET name = $1, category = $2, duration = $3, price = $4, description = $5, image_url = $6 WHERE id = $7 RETURNING *',
      [name, category, duration, price, description || null, imageUrl || null, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }
    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to update service' });
  }
});

// Delete a service
router.delete('/:id', requirePermission('services', 'write'), async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM services WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }
    return res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to delete service' });
  }
});

module.exports = router;
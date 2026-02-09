const express = require('express');
const { pool } = require('../db');
const { requirePermission } = require('../middleware/auth');

const router = express.Router();

// Get all products (public)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, category, price, original_price, stock, description, image_url, rating, reviews
       FROM products
       ORDER BY id`
    );
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get single product (public)
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT id, name, category, price, original_price, stock, description, image_url, rating, reviews
       FROM products WHERE id = $1`,
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Create a product (admin/staff with permission)
router.post('/', requirePermission('products', 'write'), async (req, res) => {
  const { name, category, price, stock, description, imageUrl, originalPrice, rating, reviews } = req.body;
  if (!name || !category || price === undefined || price === null) {
    return res.status(400).json({ error: 'Name, category and price are required' });
  }
  try {
    const result = await pool.query(
      `INSERT INTO products (name, category, price, stock, description, image_url, original_price, rating, reviews)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING *`,
      [
        name,
        category,
        price,
        Number(stock || 0),
        description || null,
        imageUrl || null,
        originalPrice ?? null,
        rating ?? null,
        reviews ?? null,
      ]
    );
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update a product
router.put('/:id', requirePermission('products', 'write'), async (req, res) => {
  const { id } = req.params;
  const { name, category, price, stock, description, imageUrl, originalPrice, rating, reviews } = req.body;
  try {
    const result = await pool.query(
      `UPDATE products
       SET name = $1,
           category = $2,
           price = $3,
           stock = $4,
           description = $5,
           image_url = $6,
           original_price = $7,
           rating = $8,
           reviews = $9
       WHERE id = $10
       RETURNING *`,
      [name, category, price, stock, description || null, imageUrl || null, originalPrice ?? null, rating ?? null, reviews ?? null, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete a product
router.delete('/:id', requirePermission('products', 'write'), async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    return res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;

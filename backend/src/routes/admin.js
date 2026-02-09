const express = require('express');
const { pool } = require('../db');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Admin-only: list staff users (role=staff) with their permissions
router.get('/staff', requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, email, first_name, last_name, phone, role, admin_permissions
       FROM users
       WHERE role = 'staff'
       ORDER BY id`
    );
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to load staff users' });
  }
});

// Admin-only: set staff permissions
router.put('/staff/:id/permissions', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { permissions } = req.body || {};

  if (!permissions || typeof permissions !== 'object') {
    return res.status(400).json({ error: 'permissions object is required' });
  }

  try {
    const result = await pool.query(
      `UPDATE users
       SET admin_permissions = $1::jsonb
       WHERE id = $2 AND role = 'staff'
       RETURNING id, email, first_name, last_name, phone, role, admin_permissions`,
      [JSON.stringify(permissions), id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Staff user not found' });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to update permissions' });
  }
});

module.exports = router;

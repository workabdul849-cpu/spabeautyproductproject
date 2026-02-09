const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Register a new user. Passwords are hashed before being stored. In a real
// implementation you would add validations and error handling. The users table
// should exist in your database with columns: id (serial primary key), email,
// password, first_name, last_name, phone, role.
router.post('/register', async (req, res) => {
  const { email, password, firstName, lastName, phone } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (email, password, first_name, last_name, phone, role, loyalty_points, referral_code, favorites, preferences, admin_permissions)
       VALUES ($1,$2,$3,$4,$5,'user', 0, NULL, '[]'::jsonb, '{}'::jsonb, '{}'::jsonb)
       RETURNING id, email, first_name, last_name, phone, role, loyalty_points, referral_code, favorites, preferences, admin_permissions`,
      [email.toLowerCase(), hashedPassword, firstName || null, lastName || null, phone || null]
    );
    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id, role: user.role || 'user' }, process.env.JWT_SECRET, {
      expiresIn: '8h',
    });
    return res.status(201).json({ token, user: mapUser(user) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Registration failed' });
  }
});

// Authenticate a user and return a JWT. The client should store this token and
// include it in the Authorization header ("Bearer <token>") for protected
// routes. Note that this simple example does not implement refresh tokens or
// account locking.
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [String(email).toLowerCase()]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user.id, role: user.role || 'user' }, process.env.JWT_SECRET, {
      expiresIn: '8h',
    });
    return res.json({ token, user: mapUser(user) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Login failed' });
  }
});

router.get('/me', requireAuth, async (req, res) => {
  // requireAuth already loaded req.user via loadUser in index.js
  return res.json({ user: mapUser(req.user) });
});

router.put('/me', requireAuth, async (req, res) => {
  const { firstName, lastName, phone, favorites, preferences } = req.body || {};
  try {
    const result = await pool.query(
      `UPDATE users
       SET first_name = COALESCE($1, first_name),
           last_name = COALESCE($2, last_name),
           phone = COALESCE($3, phone),
           favorites = COALESCE($4::jsonb, favorites),
           preferences = COALESCE($5::jsonb, preferences)
       WHERE id = $6
       RETURNING id, email, first_name, last_name, phone, role, loyalty_points, referral_code, favorites, preferences, admin_permissions`,
      [firstName ?? null, lastName ?? null, phone ?? null, favorites ? JSON.stringify(favorites) : null, preferences ? JSON.stringify(preferences) : null, req.user.id]
    );
    return res.json({ user: mapUser(result.rows[0]) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Profile update failed' });
  }
});

function mapUser(u) {
  return {
    id: String(u.id),
    email: u.email,
    firstName: u.first_name || '',
    lastName: u.last_name || '',
    phone: u.phone || '',
    role: u.role || 'user',
    loyaltyPoints: Number(u.loyalty_points || 0),
    referralCode: u.referral_code || '',
    favorites: Array.isArray(u.favorites) ? u.favorites : (u.favorites || []),
    preferences: u.preferences || {},
    adminPermissions: u.admin_permissions || {},
  };
}

module.exports = router;
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const servicesRoutes = require('./routes/services');
const staffRoutes = require('./routes/staff');
const clientsRoutes = require('./routes/clients');
const productsRoutes = require('./routes/products');
const notificationsRoutes = require('./routes/notifications');
const bookingsRoutes = require('./routes/bookings');
const ordersRoutes = require('./routes/orders');
const paymentsRoutes = require('./routes/payments');
const adminRoutes = require('./routes/admin');

const { loadUser } = require('./middleware/auth');
const { rateLimit } = require('./middleware/rateLimit');

const app = express();
const port = process.env.PORT || 4000;

// Basic hardening
app.set('trust proxy', 1);
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  next();
});

// CORS
const origins = (process.env.CORS_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (origins.includes(origin)) return cb(null, true);
      return cb(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

// body (Stripe webhook would need raw; we're not using webhook in this build)
app.use(express.json({ limit: process.env.BODY_LIMIT || '1mb' }));

// Global mild rate limit
app.use(rateLimit({ windowMs: 60_000, max: 300 }));

// Attach user if token exists
app.use(loadUser);

// Routes
app.use('/auth', rateLimit({ windowMs: 60_000, max: 30 }), authRoutes);
app.use('/services', servicesRoutes);
app.use('/staff', staffRoutes);
app.use('/clients', clientsRoutes);
app.use('/products', productsRoutes);
app.use('/notifications', rateLimit({ windowMs: 60_000, max: 20 }), notificationsRoutes);
app.use('/bookings', bookingsRoutes);
app.use('/orders', ordersRoutes);
app.use('/payments', paymentsRoutes);
app.use('/admin', adminRoutes);

app.get('/health', (req, res) => res.json({ ok: true, service: 'rjbl-backend' }));
app.get('/', (req, res) => res.json({ message: 'RJBL backend API is running' }));

// Helpful DB check
const { pool } = require('./db');
app.get('/db-test', async (req, res) => {
  try {
    const r = await pool.query('SELECT NOW() as now');
    res.json({ ok: true, now: r.rows[0].now });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// Error handler
app.use((err, req, res, next) => {
  if (!err) return next();
  const msg = err.message || 'Server error';
  return res.status(500).json({ error: msg });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

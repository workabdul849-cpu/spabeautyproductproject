const { Pool } = require('pg');

/**
 * Single shared Postgres pool.
 *
 * - Works locally with plain DATABASE_URL
 * - Works on managed Postgres (Render/Supabase/etc.) where SSL is required
 */
const isProd = process.env.NODE_ENV === 'production';
const needsSSL = isProd || String(process.env.PG_SSL || '').toLowerCase() === 'true';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: Number(process.env.PG_POOL_MAX || 20),
  idleTimeoutMillis: Number(process.env.PG_POOL_IDLE_MS || 30_000),
  connectionTimeoutMillis: Number(process.env.PG_POOL_CONN_TIMEOUT_MS || 2_000),
  ssl: needsSSL ? { rejectUnauthorized: false } : undefined,
});

module.exports = { pool };

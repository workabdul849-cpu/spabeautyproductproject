const jwt = require('jsonwebtoken');
const { pool } = require('../db');

function getTokenFromReq(req) {
  const h = req.headers.authorization || '';
  if (!h.toLowerCase().startsWith('bearer ')) return null;
  return h.slice(7).trim();
}

async function loadUser(req, res, next) {
  const token = getTokenFromReq(req);
  if (!token) {
    req.user = null;
    return next();
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const result = await pool.query(
      'SELECT id, email, first_name, last_name, phone, role, loyalty_points, referral_code, favorites, preferences, admin_permissions FROM users WHERE id = $1',
      [payload.userId]
    );
    req.user = result.rows[0] || null;
    return next();
  } catch (e) {
    req.user = null;
    return next();
  }
}

function requireAuth(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  return next();
}

function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  if ((req.user.role || 'user') !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  return next();
}

// Allow admin OR staff (blocks normal users). Useful for admin panel routes
// where staff access is permitted but still permission-checked via
// requirePermission().
function requireAdminOrStaff(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  const role = req.user.role || 'user';
  if (role === 'admin' || role === 'staff') return next();
  return res.status(403).json({ error: 'Forbidden' });
}

function requirePermission(moduleKey, action /* read|write */) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const role = req.user.role || 'user';
    if (role === 'admin') return next();
    if (role !== 'staff') return res.status(403).json({ error: 'Forbidden' });
    const perms = req.user.admin_permissions || {};
    const mod = perms[moduleKey] || {};
    if (mod[action] === true) return next();
    return res.status(403).json({ error: 'Forbidden' });
  };
}

module.exports = {
  loadUser,
  requireAuth,
  requireAdmin,
  requireAdminOrStaff,
  requirePermission,
};

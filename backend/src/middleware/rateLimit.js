const buckets = new Map();

function nowMs() {
  return Date.now();
}

function keyFromReq(req) {
  // Prefer real IP behind proxy (trust proxy enabled)
  const ip = req.ip || req.connection?.remoteAddress || 'unknown';
  const route = req.baseUrl + req.path;
  return `${ip}:${route}`;
}

/**
 * Simple in-memory rate limiter (no deps).
 * Good enough for demo / small deploy.
 * For production at scale, use Redis.
 */
function rateLimit({ windowMs = 60_000, max = 60 } = {}) {
  return (req, res, next) => {
    const key = keyFromReq(req);
    const t = nowMs();

    const entry = buckets.get(key) || { count: 0, start: t };
    if (t - entry.start > windowMs) {
      entry.count = 0;
      entry.start = t;
    }

    entry.count += 1;
    buckets.set(key, entry);

    res.setHeader('X-RateLimit-Limit', String(max));
    res.setHeader('X-RateLimit-Remaining', String(Math.max(0, max - entry.count)));

    if (entry.count > max) {
      return res.status(429).json({ error: 'Too many requests. Please slow down.' });
    }

    return next();
  };
}

module.exports = { rateLimit };

// api/gifts.js — persists which gifts have been opened, in Vercel KV (Upstash Redis).
// No npm packages needed — talks to Upstash over its REST API.
//
// GET  /api/gifts            -> { opened: ["spacex", ...], db: true }
// POST /api/gifts?gift=spacex -> marks a gift opened, returns updated { opened }
//
// Vercel injects the env vars below when you connect a KV / Upstash database
// to the project (Storage tab). Works with either naming scheme.

const REDIS_URL =
  process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN =
  process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

const KEY = 'gift_opened';
const VALID = ['spacex', 'zomato', 'bms'];

async function redis(command) {
  const r = await fetch(REDIS_URL, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + REDIS_TOKEN,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
  });
  const j = await r.json();
  return j.result;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store');

  // If no database is connected yet, fail soft so the page still works.
  if (!REDIS_URL || !REDIS_TOKEN) {
    return res.status(200).json({ opened: [], db: false });
  }

  try {
    if (req.method === 'POST') {
      const gift = String((req.query && req.query.gift) || '')
        .toLowerCase()
        .replace(/[^a-z]/g, '')
        .slice(0, 20);
      if (VALID.includes(gift)) await redis(['SADD', KEY, gift]); // permanent
    }
    const opened = (await redis(['SMEMBERS', KEY])) || [];
    return res.status(200).json({ opened, db: true });
  } catch (e) {
    return res.status(200).json({ opened: [], db: false, error: 'redis_failed' });
  }
};

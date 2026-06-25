// api/claim.js — saves "sell / claim" payout details (UPI or bank) to Vercel KV (Upstash Redis).
// No npm packages needed — talks to Upstash over its REST API.
//
// POST /api/claim   body: { "details": "...", "price": 155.18 }   -> { ok: true }
// GET  /api/claim?key=YOUR_SECRET                                 -> { claims: [...] }
//      (reading is LOCKED behind a secret so the details stay private)

function pickEnv(test) {
  for (const k of Object.keys(process.env)) {
    if (test(k) && process.env[k]) return process.env[k];
  }
  return undefined;
}
const REDIS_URL =
  pickEnv(function (k) { return /(KV|UPSTASH|REDIS).*REST.*URL$/i.test(k); }) ||
  pickEnv(function (k) { return /REST_API_URL$/i.test(k); });
const REDIS_TOKEN =
  pickEnv(function (k) { return /(KV|UPSTASH|REDIS).*REST.*TOKEN$/i.test(k) && !/READ.?ONLY/i.test(k); }) ||
  pickEnv(function (k) { return /REST_API_TOKEN$/i.test(k) && !/READ.?ONLY/i.test(k); });

// CHANGE THIS, or set a CLAIM_SECRET env var in Vercel. Needed to read claims back.
const SECRET = process.env.CLAIM_SECRET || 'change-me-please';
const LISTKEY = 'claims';

async function redis(command) {
  const r = await fetch(REDIS_URL, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + REDIS_TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify(command),
  });
  const j = await r.json();
  return j.result;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store');

  if (!REDIS_URL || !REDIS_TOKEN) {
    return res.status(200).json({ ok: false, db: false });
  }

  try {
    if (req.method === 'POST') {
      let body = req.body;
      if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
      body = body || {};
      const details = String(body.details || '').trim().slice(0, 500);
      const price = body.price != null ? String(body.price).slice(0, 24) : '';
      if (!details) return res.status(400).json({ ok: false, error: 'empty' });

      const entry = { details: details, price: price, gift: 'spacex', at: new Date().toISOString() };
      await redis(['LPUSH', LISTKEY, JSON.stringify(entry)]);
      return res.status(200).json({ ok: true });
    }

    if (req.method === 'GET') {
      const key = (req.query && req.query.key) || '';
      if (key !== SECRET) return res.status(403).json({ error: 'forbidden' });
      const raw = (await redis(['LRANGE', LISTKEY, '0', '200'])) || [];
      const claims = raw.map(function (s) { try { return JSON.parse(s); } catch (e) { return { raw: s }; } });
      return res.status(200).json({ count: claims.length, claims: claims });
    }

    return res.status(405).json({ error: 'method_not_allowed' });
  } catch (e) {
    return res.status(200).json({ ok: false, error: String((e && e.message) || e) });
  }
};

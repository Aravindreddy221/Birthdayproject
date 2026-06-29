// api/gifts.js — persists which gifts have been opened, in Vercel KV (Upstash Redis).
// No npm packages needed — talks to Upstash over its REST API.
//
// GET  /api/gifts              -> { opened: [...], db: true, hasUrl, hasToken }
// POST /api/gifts?gift=spacex   -> marks a gift opened
// GET  /api/gifts?reset=SECRET  -> deletes ALL saved data (reset the green marks)

// 🔑 Change this to your own secret word. To wipe the data, visit:
//    https://YOUR-SITE.vercel.app/api/gifts?reset=mounika28
const RESET_SECRET = process.env.RESET_SECRET || 'mounika28';

// Auto-detect the DB credentials Vercel injects, across naming variants.
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

const KEY = 'gift_opened';
const VALID = ['spacex', 'swiggy', 'bms'];

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

  const hasUrl = !!REDIS_URL, hasToken = !!REDIS_TOKEN;
  if (!hasUrl || !hasToken) {
    return res.status(200).json({ opened: [], db: false, hasUrl: hasUrl, hasToken: hasToken });
  }

  try {
    // ── reset / delete all saved data ──
    if (req.query && req.query.reset !== undefined) {
      if (String(req.query.reset) === RESET_SECRET) {
        await redis(['DEL', KEY]);
        return res.status(200).json({ cleared: true, opened: [], db: true });
      }
      return res.status(403).json({ error: 'wrong reset secret' });
    }

    // ── mark a gift opened ──
    if (req.method === 'POST') {
      const gift = String((req.query && req.query.gift) || '')
        .toLowerCase().replace(/[^a-z]/g, '').slice(0, 20);
      if (VALID.indexOf(gift) !== -1) await redis(['SADD', KEY, gift]);
    }

    const opened = (await redis(['SMEMBERS', KEY])) || [];
    return res.status(200).json({ opened: opened, db: true, hasUrl: hasUrl, hasToken: hasToken });
  } catch (e) {
    return res.status(200).json({ opened: [], db: false, hasUrl: hasUrl, hasToken: hasToken, error: String((e && e.message) || e) });
  }
};

// api/quote.js — Vercel serverless function (fast, server-side stock quote)
// Deploy: just put this file at /api/quote.js in your repo root.
// Vercel auto-detects the /api folder — no config needed.
// Call it from the page as: /api/quote?ticker=SPCX

module.exports = async (req, res) => {
  const raw = (req.query && req.query.ticker) ? String(req.query.ticker) : 'SPCX';
  const ticker = (raw.toUpperCase().replace(/[^A-Z0-9.\-]/g, '').slice(0, 12)) || 'SPCX';

  res.setHeader('Access-Control-Allow-Origin', '*');
  // edge-cache the answer for 2s so rapid polling stays fast and doesn't hammer upstream
  res.setHeader('Cache-Control', 's-maxage=2, stale-while-revalidate=8');

  try {
    const url = 'https://query1.finance.yahoo.com/v8/finance/chart/' + ticker + '?interval=1d&range=1d';
    const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!r.ok) return res.status(502).json({ error: 'upstream', status: r.status });

    const j = await r.json();
    const m = j.chart.result[0].meta;
    const price = m.regularMarketPrice;
    const prev = (m.chartPreviousClose != null) ? m.chartPreviousClose
               : (m.previousClose != null ? m.previousClose : price);

    return res.status(200).json({ ticker, price, prev, live: true });
  } catch (e) {
    return res.status(502).json({ error: 'fetch_failed' });
  }
};

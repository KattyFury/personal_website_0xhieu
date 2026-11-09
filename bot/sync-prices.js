// Bot fetching daily prices for the Valuation tab.
//
//   CoinGecko  → atm · ath · athDate · atl · atlDate    for ALL projects
//   Binance / Gate / Bybit → preAth (low BEFORE the ATH), asked in turn until found
//
// DISTINGUISH THE 2 LOW NUMBERS (don't confuse them, it happened once):
//   atl     = the token's TRUE low, literally all-time low. From CoinGecko.
//   preAth  = low within [listing → ATH date]. NOT the historical low:
//             it's the depth before the token bounced to its peak. Shown in the same cell
//             as ×ATH like "1.62 → 19.80".
//
// ⚠️ Do NOT touch `priceTGE`. The TGE price is a historical fact with ONE value,
//    entered by the site owner in key `val-projects`. The bot only writes `val-prices`.
//
// ⚠️ Call Binance by DIRECT REST fetch, NOT `binance-cli`: verified the CLI ignores
//    --start-time so it can't get history (see HANDOFF, Failed Approaches).
//
// ⚠️ Binance returns HTTP 451 to servers in some countries (Apps Script was hit). That's
//    why the bot runs on a VPS with Docker rather than a Cloudflare Worker.
//
// Write results by 2 routes, picking whichever is configured:
//   1. POST /api/val  (needs ADMIN_PASS)              standard route, through the server whitelist
//   2. Write KV directly (needs CLOUDFLARE_API_TOKEN) fallback, no password

const SITE = process.env.SITE_URL || 'https://0xhieu.xyz';
const KV_NS = process.env.KV_NAMESPACE_ID || 'b8fab2f8a83f45f0a023d2ba3ce78cde';
const ADMIN_PASS = process.env.ADMIN_PASS || '';
const CF_ACCOUNT = process.env.CLOUDFLARE_ACCOUNT_ID || '';
const CF_TOKEN = process.env.CLOUDFLARE_API_TOKEN || '';
const RUN_AT_HOUR = Number(process.env.RUN_AT_HOUR ?? 2);   // daily run hour (machine time)
const ONCE = process.env.RUN_ONCE === 'true';

const log = (...a) => console.log(new Date().toISOString().slice(0, 19).replace('T', ' '), ...a);
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function getJson(url, tries = 3) {
  for (let i = 1; i <= tries; i++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(30000) });
      if (res.status === 451) throw new Error('HTTP 451 — Binance chặn IP/quốc gia này');
      if (res.status === 429) { await sleep(20000 * i); continue; }   // rate limited → wait and retry
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return await res.json();
    } catch (e) {
      if (i === tries) throw e;
      await sleep(2000 * i);
    }
  }
}

// ── 1. Get the project list from the site itself ────────────────────────────
async function loadProjects() {
  const d = await getJson(`${SITE}/api/val`);
  if (!d.ok) throw new Error('api/val trả lỗi: ' + d.error);
  return d.projects || [];
}

// ── 2. CoinGecko: current price + ATH + ATH date ─────────────────────
// One call for up to 250 ids (enough for 78 projects), avoiding free tier rate limits.
async function fetchCoinGecko(projects) {
  const ids = [...new Set(projects.map(p => p.cgId).filter(Boolean))];
  const out = {};
  for (let i = 0; i < ids.length; i += 250) {
    const chunk = ids.slice(i, i + 250);
    const url = 'https://api.coingecko.com/api/v3/coins/markets'
      + '?vs_currency=usd&per_page=250&sparkline=false&ids=' + chunk.join(',');
    const rows = await getJson(url);
    for (const r of rows) {
      out[r.id] = {
        atm: r.current_price ?? null,
        ath: r.ath ?? null,
        athDate: r.ath_date ? r.ath_date.slice(0, 10) : null,
        atl: r.atl ?? null,                                   // TRUE low, literally all-time low
        atlDate: r.atl_date ? r.atl_date.slice(0, 10) : null,
      };
    }
    if (i + 250 < ids.length) await sleep(15000);
  }
  return out;
}

// ── 3. Low BEFORE the ATH: ask 3 exchanges in turn ───────────────────
//
// WHY MULTIPLE EXCHANGES: Binance often lists a token LATER than its ATH date
// (PLUME, NEWT are real examples), so it has no candles before the peak and returns
// empty. Exchanges listing earlier do. Ask in turn and take the first
// result.
//
// Drop each exchange's FIRST CANDLE because the trading-open wick isn't a
// tradable price. This is NOT the all-time low, see the note at the top.

const sec = ms => Math.floor(ms / 1000);

// Each exchange returns candles with different column order → normalize to {t, low}.
const EXCHANGES = [
  {
    name: 'binance',
    // Binance paginates by startTime; pull until past the ATH date.
    async candles(sym, fromMs, toMs) {
      for (const base of ['https://api.binance.com/api/v3', 'https://fapi.binance.com/fapi/v1']) {
        let out = [], cursor = 0;
        try {
          for (let page = 0; page < 5; page++) {
            const k = await getJson(`${base}/klines?symbol=${sym}&interval=1d&startTime=${cursor}&limit=1000`, 2);
            if (!k.length) break;
            out = out.concat(k.map(c => ({ t: c[0], low: parseFloat(c[3]) })));
            if (k[k.length - 1][0] >= toMs || k.length < 1000) break;
            cursor = k[k.length - 1][0] + 86400000;
            await sleep(150);
          }
        } catch { continue; }
        if (out.length) return out;
      }
      return [];
    },
  },
  {
    name: 'gate',
    // Gate takes a from/to window directly (seconds). Columns: [ts, vol, close, high, low, open]
    async candles(sym, fromMs, toMs) {
      const pair = sym.replace(/USDT$/, '') + '_USDT';
      const url = 'https://api.gateio.ws/api/v4/spot/candlesticks'
        + `?currency_pair=${pair}&interval=1d&from=${sec(fromMs)}&to=${sec(toMs)}&limit=1000`;
      const k = await getJson(url, 2).catch(() => null);
      if (!Array.isArray(k)) return [];
      return k.map(c => ({ t: Number(c[0]) * 1000, low: parseFloat(c[4]) }));
    },
  },
  {
    name: 'bybit',
    // Bybit returns DESCENDING. Columns: [start, open, high, low, close, ...]
    async candles(sym, fromMs, toMs) {
      const url = 'https://api.bybit.com/v5/market/kline'
        + `?category=spot&symbol=${sym}&interval=D&start=${fromMs}&end=${toMs}&limit=1000`;
      const d = await getJson(url, 2).catch(() => null);
      const k = d && d.result && d.result.list;
      if (!Array.isArray(k) || !k.length) return [];
      return k.map(c => ({ t: Number(c[0]), low: parseFloat(c[3]) })).sort((a, b) => a.t - b.t);
    },
  },
];

async function fetchPreAth(symbol, tgeDate, athDate) {
  if (!symbol || !athDate) return null;
  const athMs = Date.parse(athDate + 'T23:59:59Z');
  const tgeMs = Date.parse((tgeDate || '1970-01-01') + 'T00:00:00Z');
  if (!Number.isFinite(athMs)) return null;

  let listedSomewhere = false;   // does any exchange really list this token

  for (const ex of EXCHANGES) {
    let rows;
    try { rows = await ex.candles(symbol, tgeMs, athMs); } catch { continue; }
    if (!rows || !rows.length) continue;
    listedSomewhere = true;

    const win = rows.slice(1).filter(c => c.t < athMs && c.low > 0);   // drop the trading-open candle
    if (!win.length) continue;                                          // this exchange listed after the ATH → try the next

    let lo = Infinity, loAt = null;
    for (const c of win) if (c.low < lo) { lo = c.low; loAt = c.t; }
    if (!Number.isFinite(lo)) continue;
    return { preAth: lo, preAthDate: new Date(loAt).toISOString().slice(0, 10), src: ex.name };
  }

  // An exchange lists it but NONE has candles before the ATH → the token only began trading
  // on the peak day. That's a listing wick, not a true peak, even when the
  // stored TGE date is a month away (NEWT: TGE 05/08, listed 06/24 = ATH date).
  if (listedSomewhere) return { athWick: true };
  return null;   // no exchange lists it → no conclusion, leave the ATH as is
}

// ── 4. Write results ──────────────────────────────────────────────────
async function writePrices(prices) {
  if (ADMIN_PASS) {
    const res = await fetch(`${SITE}/api/val`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ pass: ADMIN_PASS, action: 'prices', prices }),
      signal: AbortSignal.timeout(30000),
    });
    const d = await res.json().catch(() => ({}));
    if (!d.ok) throw new Error('POST /api/val hỏng: ' + (d.error || res.status));
    return `POST /api/val — ${d.count} dự án`;
  }
  if (CF_TOKEN && CF_ACCOUNT) {
    const url = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT}`
      + `/storage/kv/namespaces/${KV_NS}/values/val-prices`;
    const res = await fetch(url, {
      method: 'PUT',
      headers: { Authorization: 'Bearer ' + CF_TOKEN, 'content-type': 'text/plain' },
      body: JSON.stringify(prices),
      signal: AbortSignal.timeout(30000),
    });
    const d = await res.json().catch(() => ({}));
    if (!d.success) throw new Error('Ghi KV hỏng: ' + JSON.stringify(d.errors || res.status));
    return `ghi thẳng KV — ${Object.keys(prices).length} dự án`;
  }
  throw new Error('Chưa có ADMIN_PASS lẫn CLOUDFLARE_API_TOKEN — không biết ghi vào đâu');
}

// ── One run ───────────────────────────────────────────────────
async function runOnce() {
  const t0 = Date.now();
  const projects = await loadProjects();
  log(`nạp ${projects.length} dự án từ ${SITE}/api/val`);

  const cg = await fetchCoinGecko(projects);
  log(`CoinGecko trả ${Object.keys(cg).length} / ${projects.length}`);

  const prices = {};
  let nPre = 0, nSkip = 0, nWick = 0;
  const bySrc = {};
  for (const p of projects) {
    const row = {};
    const c = p.cgId ? cg[p.cgId] : null;
    if (c) {
      if (c.atm != null) row.atm = c.atm;
      if (c.ath != null) row.ath = c.ath;
      if (c.athDate) row.athDate = c.athDate;
      if (c.atl != null) row.atl = c.atl;                    // true low
      if (c.atlDate) row.atlDate = c.atlDate;
    }
    // Low before the ATH is meaningful only when the ATH is more than 1 week after TGE; within a week
    // that "peak" is a listing wick, not a true peak (see the rule in index.html).
    // Low before the ATH is meaningful only when the ATH is more than 1 week after TGE; within a week
    // that "peak" is a wick from the first listing days, not a true peak.
    // Without binanceSymbol still try: guess the pair from the ticker for Gate/Bybit.
    if (row.athDate && p.tgeDate
        && Date.parse(row.athDate) - Date.parse(p.tgeDate) > 7 * 86400000) {
      const sym = p.binanceSymbol || (p.ticker + 'USDT');
      const a = await fetchPreAth(sym, p.tgeDate, row.athDate);
      if (a && a.athWick) {
        row.athWick = true;                      // ATH on the trading open date → client hides ×ATH
        nWick++;
      } else if (a) {
        row.preAth = a.preAth; row.preAthDate = a.preAthDate;
        nPre++; bySrc[a.src] = (bySrc[a.src] || 0) + 1;
      } else nSkip++;
      await sleep(120);
    }
    if (Object.keys(row).length) {
      row.updatedAt = new Date().toISOString();
      prices[p.ticker] = row;
    }
  }

  const nAtl = Object.values(prices).filter(v => v.atl != null).length;
  const srcs = Object.entries(bySrc).map(([k, v]) => `${k} ${v}`).join(' · ') || 'không có';
  log(`có giá: ${Object.keys(prices).length} · có ATL: ${nAtl} · có đáy-trước-ATH: ${nPre} (${srcs})`
    + ` · ATH là râu nến listing: ${nWick} · không sàn nào list: ${nSkip}`);
  log('đã ghi:', await writePrices(prices));
  log(`xong sau ${Math.round((Date.now() - t0) / 1000)}s`);
}

// ── Schedule: run one round now, then daily at RUN_AT_HOUR ──────
function msUntilNextRun() {
  const now = new Date();
  const next = new Date(now);
  next.setHours(RUN_AT_HOUR, 0, 0, 0);
  if (next <= now) next.setDate(next.getDate() + 1);
  return next - now;
}

async function main() {
  log(`bot khởi động · site=${SITE} · ghi bằng ${ADMIN_PASS ? 'ADMIN_PASS' : 'Cloudflare API'}`);
  try { await runOnce(); } catch (e) { log('LỖI:', e.message); }
  if (ONCE) return;
  for (;;) {
    const wait = msUntilNextRun();
    log(`lượt sau sau ${Math.round(wait / 60000)} phút (${RUN_AT_HOUR}h)`);
    await sleep(wait);
    try { await runOnce(); } catch (e) { log('LỖI:', e.message); }
  }
}

main();

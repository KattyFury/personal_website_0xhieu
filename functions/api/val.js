// Valuation tab data store, fully replacing Google Sheet (since 2026-09-22).
//
//   GET  /api/val   → public, NO password (data for visitors)
//   POST /api/val   → add / edit / delete projects, password REQUIRED, checked ON THE SERVER
//                     action 'prices' is for the daily price job (also needs the password)
//
//   KV binding : WORK         (SHARED store with Work to Earn + AI, only keys differ)
//   Secret     : ADMIN_PASS   (SAME password as /api/private and /api/ai)
//
// TWO SEPARATE KEYS ON PURPOSE:
//   val-projects → source data, admin writes ONLY
//   val-prices   → prices, job writes ONLY
// Separated, admin edits and the price job never touch the same key,
// so neither side can overwrite the other's changes.
//
// NO multiples are stored (×TGE, ×ATL, ×ATH, ×ATM): all computed by the client at
// render, one source. An older version stored ×TGE in the Sheet and mixed it
// with client-computed numbers; the two silently diverged.

import { adminVia } from '../_lib/admin-auth.mjs';

const KEY_PROJECTS = 'val-projects';
const KEY_PRICES   = 'val-prices';

const json = (obj, status = 200) => new Response(JSON.stringify(obj), {
  status,
  headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
});

const clean = (v, max) => String(v ?? '').replace(/[<>]/g, '').trim().slice(0, max);

// 17 settled narratives. Unknown values → empty string so the admin sees and fixes them,
// NEVER forced into an arbitrary group (that would skew the Narrative box median).
const NARRATIVES = [
  'stablechain', 'layer-1', 'infra', 'ai', 'layer-2',
  'prediction', 'trading', 'bitcoin', 'payment', 'defi',
  'identity', 'privacy', 'game', 'social', 'desci', 'rwa', 'zk',
];
const cleanNarrative = v => {
  const t = clean(v, 40).toLowerCase();
  return NARRATIVES.includes(t) ? t : '';
};

const num = v => {
  const n = typeof v === 'number' ? v : parseFloat(String(v ?? '').replace(/[^0-9.\-]/g, ''));
  return Number.isFinite(n) ? n : null;
};

const cleanDate = v => /^\d{4}-\d{2}-\d{2}$/.test(String(v ?? '')) ? String(v) : '';

// 7 REQUIRED fields: missing any leaves all 4 multiple columns of that row
// as dashes, a project in the table saying nothing, so it's blocked at save.
// cgId and binanceSymbol MAY be empty, to enter projects not yet listed.
function sanitize(p) {
  return {
    ticker:        clean(p.ticker, 20).replace(/^\$/, '').toUpperCase(),
    tgeDate:       cleanDate(p.tgeDate),
    narrative:     cleanNarrative(p.narrative),
    fundraising:   num(p.fundraising),
    vcAlloc:       num(p.vcAlloc),
    totalSupply:   num(p.totalSupply),
    priceTGE:      num(p.priceTGE),
    cgId:          clean(p.cgId, 60).toLowerCase(),
    binanceSymbol: clean(p.binanceSymbol, 20).toUpperCase(),
  };
}

function missingFields(p) {
  const need = ['ticker', 'tgeDate', 'narrative', 'fundraising', 'vcAlloc', 'totalSupply', 'priceTGE'];
  return need.filter(k => p[k] === null || p[k] === '' || p[k] === undefined);
}

const readJson = async (kv, key, fallback) => {
  try { return JSON.parse(await kv.get(key) || JSON.stringify(fallback)); } catch { return fallback; }
};

export async function onRequestGet({ env }) {
  if (!env.WORK) return json({ ok: false, error: 'Chưa gắn KV binding WORK trên Cloudflare' }, 500);
  const [projects, prices] = await Promise.all([
    readJson(env.WORK, KEY_PROJECTS, []),
    readJson(env.WORK, KEY_PRICES, {}),
  ]);
  return json({ ok: true, projects, prices });
}

export async function onRequestPost({ request, env }) {
  if (!env.ADMIN_PASS) return json({ ok: false, error: 'Chưa cấu hình biến ADMIN_PASS trên Cloudflare' }, 500);
  if (!env.WORK)       return json({ ok: false, error: 'Chưa gắn KV binding WORK trên Cloudflare' }, 500);

  let body;
  try { body = await request.json(); } catch { return json({ ok: false, error: 'bad-json' }, 400); }

  if (!await adminVia(request, body, env)) {
    await new Promise(r => setTimeout(r, 400));   // slow down bulk password guessing
    return json({ ok: false, error: 'wrong-pass' }, 401);
  }

  const kv = env.WORK;

  // The daily price job writes to a SEPARATE key, leaving manual data alone.
  //
  // ⚠️ `priceTGE` is NOT in this list and must never be:
  // the TGE price is a historical fact with ONE value, entered by the site owner
  // and stored in val-projects. The job only takes what changes daily.
  // Whitelist filter so even a sloppy job can't overwrite manual data.
  const PRICE_FIELDS = ['atm', 'ath', 'athDate', 'atl', 'atlDate',
                       'preAth', 'preAthDate', 'athWick', 'updatedAt'];
  if (body.action === 'prices') {
    if (!body.prices || typeof body.prices !== 'object') {
      return json({ ok: false, error: 'bad-prices' }, 400);
    }
    const clean_ = {};
    for (const [ticker, v] of Object.entries(body.prices)) {
      if (!v || typeof v !== 'object') continue;
      const row = {};
      for (const f of PRICE_FIELDS) if (v[f] !== undefined) row[f] = v[f];
      if (Object.keys(row).length) clean_[clean(ticker, 20).toUpperCase()] = row;
    }
    await kv.put(KEY_PRICES, JSON.stringify(clean_));
    return json({ ok: true, count: Object.keys(clean_).length });
  }

  const projects = await readJson(kv, KEY_PROJECTS, []);
  const write = list => kv.put(KEY_PROJECTS, JSON.stringify(list));

  // Narrative-only migration: validate the entire batch before writing and
  // preserve all other fields exactly, including legacy bot hints.
  if (body.action === 'narratives') {
    if (!Array.isArray(body.changes) || !body.changes.length) return json({ ok: false, error: 'bad-changes' }, 400);
    const seen = new Set();
    for (const change of body.changes) {
      if (!change || !NARRATIVES.includes(change.narrative) || seen.has(change.ticker)) return json({ ok: false, error: 'bad-changes' }, 400);
      seen.add(change.ticker);
      const existing = projects.find(p => p.ticker === change.ticker);
      if (!existing || existing.narrative !== change.expectedNarrative || existing.cgId !== change.expectedCgId) return json({ ok: false, error: 'conflict', ticker: change.ticker }, 409);
    }
    const updates = new Map(body.changes.map(c => [c.ticker, c.narrative]));
    await write(projects.map(p => updates.has(p.ticker) ? { ...p, narrative: updates.get(p.ticker) } : p));
    return json({ ok: true, count: updates.size });
  }

  if (body.action === 'add' || body.action === 'update') {
    const p = sanitize(body.project || {});
    const missing = missingFields(p);
    if (missing.length) return json({ ok: false, error: 'missing', fields: missing }, 400);

    const i = projects.findIndex(x => x.ticker === (body.ticker || p.ticker));
    if (body.action === 'add') {
      if (i >= 0) return json({ ok: false, error: 'duplicate-ticker' }, 409);
      projects.push(p);
    } else {
      if (i < 0) return json({ ok: false, error: 'not-found' }, 404);
      // Legacy bot hint is no longer an input. Preserve existing records on edit.
      if (body.project?.binanceSymbol === undefined) p.binanceSymbol = projects[i].binanceSymbol || '';
      projects[i] = p;
    }
    await write(projects);
    return json({ ok: true, projects });
  }

  if (body.action === 'delete') {
    const t = clean(body.ticker, 20).toUpperCase();
    await write(projects.filter(x => x.ticker !== t));
    return json({ ok: true, projects: projects.filter(x => x.ticker !== t) });
  }

  // Bulk import, only for the Google Sheet to KV migration
  if (body.action === 'import') {
    if (!Array.isArray(body.projects)) return json({ ok: false, error: 'bad-projects' }, 400);
    const list = body.projects.map(sanitize);
    await write(list);
    return json({ ok: true, count: list.length });
  }

  return json({ ok: false, error: 'unknown-action' }, 400);
}

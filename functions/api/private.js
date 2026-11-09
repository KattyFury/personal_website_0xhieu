// Private gateway for Airdrop → Work: personal tasks stored in Cloudflare KV.
// The password is checked ON THE SERVER: not in index.html, not discoverable with F12.
//
//   KV binding : WORK          (Cloudflare Pages → Settings → Bindings)
//   Secret     : ADMIN_PASS    (Cloudflare Pages → Settings → Environment variables, choose "Encrypt")
//
// Wrong password → 401 and NO data returned.

import { adminVia, rememberDevice } from '../_lib/admin-auth.mjs';

const KEY = 'personal-tasks';

const json = (obj, status = 200) => new Response(JSON.stringify(obj), {
  status,
  headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
});

// Limit length + strip < > so content can't break HTML rendered with innerHTML
const clean = (v, max) => String(v ?? '').replace(/[<>]/g, '').trim().slice(0, max);
// Accept only http/https links, blocking javascript: in href
// Missing https:// (e.g. "binance.com", "x.com/binance") is added; anything not link-like is dropped
const cleanLink = v => {
  let s = clean(v, 500);
  if (s && !/^[a-z][a-z0-9+.-]*:/i.test(s) && /^[^\s/]+\.[^\s]+$/.test(s)) s = 'https://' + s;
  return /^https?:\/\/\S+$/i.test(s) ? s : '';
};
// Each Get Started / Daily / Weekly section is a list of {text, link}; the form adds rows with +.
// Rows with no text are dropped; capped at 20 rows so one request can't stuff KV.
// Schedule (optional), stored in GMT+7: "HH:MM" 24h · days = weekdays, 1 = Monday … 7 = Sunday.
// `dow` (single weekday) is an old field, converted to days.
const cleanTime = v => /^([01]\d|2[0-3]):[0-5]\d$/.test(String(v ?? '')) ? String(v) : '';
const cleanDow  = v => { const n = Number(v); return Number.isInteger(n) && n >= 1 && n <= 7 ? n : 0; };
const cleanDays = it => [...new Set((Array.isArray(it?.days) ? it.days : [it?.dow]).map(cleanDow).filter(Boolean))].sort((a, b) => a - b);
const itemList = v => (Array.isArray(v) ? v : [])
  .slice(0, 20)
  .map(it => {
    const out = { text: clean(it?.text, 500), link: cleanLink(it?.link) };
    const time = cleanTime(it?.time), days = cleanDays(it);
    if (time) out.time = time;
    if (days.length) out.days = days;
    return out;
  })
  .filter(it => it.text);

// rank/visibility accept only valid values; wrong or missing fall back to a safe default
// NOTE: matches WTE_RANKS in index.html (section "AIRDROP — Work to Earn"); changing the rank scale
// means editing both places, not only the client.
const RANKS = ['S', 'A', 'B', 'C'];
// Categories with their own group and no rank; matches WTE_TYPE_GROUP in index.html
const TYPE_GROUPS = ['Learn-to-Grow', 'Work-to-Earn'];
const cleanRank = v => RANKS.includes(v) ? v : 'C';
// Potential 2 levels 'high' | 'low' ('' = unset). Old star-scale numbers 1-3 map to
// ≥2 = high, 1 = low, matching potLevel in index.html.
const cleanPotential = v => {
  if (v === 'high' || v === 'low') return v;
  const n = parseInt(v, 10) || 0;
  return n >= 2 ? 'high' : n === 1 ? 'low' : '';
};
const cleanVisibility = v => v === 'public' ? 'public' : 'personal';

// Sanitize user inputs, shared by add and update (only id isn't taken from the client)
const sanitize = t => ({
  name:       clean(t.name, 120) || 'Không tên',
  twitter:    cleanLink(t.twitter),
  discord:    cleanLink(t.discord),
  website:    cleanLink(t.website),
  potential:  cleanPotential(t.potential),
  type:       clean(t.type, 60),
  rank:       TYPE_GROUPS.includes(t.type) ? '' : cleanRank(t.rank),   // $ group has no rank (WTE_INCOME_TYPE)
  visibility: cleanVisibility(t.visibility),
  getStarted: itemList(t.getStarted),
  daily:      itemList(t.daily),
  weekly:     itemList(t.weekly),
});

const readTasks  = async kv => { try { return JSON.parse(await kv.get(KEY) || '[]'); } catch { return []; } };
const writeTasks = (kv, tasks) => kv.put(KEY, JSON.stringify(tasks));

export async function onRequestPost({ request, env }) {
  if (!env.ADMIN_PASS) return json({ ok: false, error: 'Chưa cấu hình biến ADMIN_PASS trên Cloudflare' }, 500);
  if (!env.WORK)       return json({ ok: false, error: 'Chưa gắn KV binding WORK trên Cloudflare' }, 500);

  let body;
  try { body = await request.json(); } catch { return json({ ok: false, error: 'bad-json' }, 400); }

  const via = await adminVia(request, body, env);
  if (!via) {
    await new Promise(r => setTimeout(r, 400));   // slow down bulk password guessing
    return json({ ok: false, error: 'wrong-pass' }, 401);
  }

  const kv = env.WORK;

  if (body.action === 'list') {
    const res = json({ ok: true, tasks: await readTasks(kv) });
    // Issue a token only right after a correct password; remembered machines can't mint more
    if (body.rememberDevice && via === 'pass') res.headers.append('set-cookie', await rememberDevice(request, env));
    return res;
  }

  if (body.action === 'add') {
    const tasks = await readTasks(kv);
    tasks.push({
      id: crypto.randomUUID(),
      ...sanitize(body.task || {}),
    });
    await writeTasks(kv, tasks);
    return json({ ok: true, tasks });
  }

  if (body.action === 'update') {
    const id = String(body.id ?? '');
    const tasks = await readTasks(kv);
    const i = tasks.findIndex(t => t.id === id);
    if (i < 0) return json({ ok: false, error: 'not-found' }, 404);
    tasks[i] = { ...tasks[i], ...sanitize(body.task || {}) };   // only keep the id
    await writeTasks(kv, tasks);
    return json({ ok: true, tasks });
  }

  if (body.action === 'delete') {
    const id = String(body.id ?? '');
    const tasks = (await readTasks(kv)).filter(t => t.id !== id);
    await writeTasks(kv, tasks);
    return json({ ok: true, tasks });
  }

  return json({ ok: false, error: 'unknown-action' }, 400);
}

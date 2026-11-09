// Reads the public project list of Airdrop → Work to Earn.
// Data shares the KV store with personal tasks (see functions/api/private.js);
// each task has visibility: "public" | "personal", and this endpoint returns only "public".
// No password since this is public data (previously read from Google Sheet).

const KEY = 'personal-tasks';

export async function onRequestGet({ env }) {
  const json = (obj, status = 200) => new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });

  if (!env.WORK) return json({ ok: false, error: 'Chưa gắn KV binding WORK trên Cloudflare' }, 500);

  let tasks = [];
  try { tasks = JSON.parse(await env.WORK.get(KEY) || '[]'); } catch { tasks = []; }

  return json({ ok: true, projects: tasks.filter(t => t.visibility === 'public') });
}

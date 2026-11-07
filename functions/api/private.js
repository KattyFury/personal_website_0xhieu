// Cổng riêng tư cho Airdrop → Work: task cá nhân lưu trong Cloudflare KV.
// Mật khẩu được kiểm tra Ở SERVER — không nằm trong index.html, không dò được bằng F12.
//
//   KV binding : WORK          (Cloudflare Pages → Settings → Bindings)
//   Secret     : ADMIN_PASS    (Cloudflare Pages → Settings → Environment variables, chọn "Encrypt")
//
// Sai mật khẩu → trả 401 và KHÔNG trả về bất kỳ dữ liệu nào.

import { adminVia, rememberDevice } from '../_lib/admin-auth.mjs';

const KEY = 'personal-tasks';

const json = (obj, status = 200) => new Response(JSON.stringify(obj), {
  status,
  headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
});

// Cắt độ dài + bỏ < > để nội dung không phá HTML khi render bằng innerHTML
const clean = (v, max) => String(v ?? '').replace(/[<>]/g, '').trim().slice(0, max);
// Chỉ nhận link http/https — chặn javascript: nhét vào thuộc tính href
// Gõ thiếu https:// (VD "binance.com", "x.com/binance") thì tự thêm; không giống link thì bỏ
const cleanLink = v => {
  let s = clean(v, 500);
  if (s && !/^[a-z][a-z0-9+.-]*:/i.test(s) && /^[^\s/]+\.[^\s]+$/.test(s)) s = 'https://' + s;
  return /^https?:\/\/\S+$/i.test(s) ? s : '';
};
// Mỗi mục Get Started / Daily / Weekly là danh sách {text, link} — form cho thêm dòng bằng nút +.
// Dòng không có chữ thì bỏ; cắt tối đa 20 dòng để 1 request không nhồi được data khổng lồ vào KV.
const itemList = v => (Array.isArray(v) ? v : [])
  .slice(0, 20)
  .map(it => ({ text: clean(it?.text, 500), link: cleanLink(it?.link) }))
  .filter(it => it.text);

// rank/visibility chỉ nhận đúng giá trị hợp lệ, sai hoặc thiếu thì rơi về mặc định an toàn
// LƯU Ý: khớp WTE_RANKS trong index.html (mục "AIRDROP — Work to Earn") — đổi thang rank
// thì sửa cả 2 chỗ, không chỉ client.
const RANKS = ['S', 'A', 'B', 'C'];
// Phân loại có nhóm riêng, không có rank — khớp WTE_TYPE_GROUP trong index.html
const TYPE_GROUPS = ['Learn-to-Grow', 'Work-to-Earn'];
const cleanRank = v => RANKS.includes(v) ? v : 'C';
// Tiềm năng 2 mức 'high' | 'low' ('' = chưa điền). Số 1-3 của thang sao cũ quy đổi
// ≥2 = high, 1 = low — khớp potLevel trong index.html.
const cleanPotential = v => {
  if (v === 'high' || v === 'low') return v;
  const n = parseInt(v, 10) || 0;
  return n >= 2 ? 'high' : n === 1 ? 'low' : '';
};
const cleanVisibility = v => v === 'public' ? 'public' : 'personal';

// Làm sạch các ô người dùng nhập — dùng chung cho add và update (chỉ id là không lấy từ client)
const sanitize = t => ({
  name:       clean(t.name, 120) || 'Không tên',
  twitter:    cleanLink(t.twitter),
  discord:    cleanLink(t.discord),
  website:    cleanLink(t.website),
  potential:  cleanPotential(t.potential),
  type:       clean(t.type, 60),
  rank:       TYPE_GROUPS.includes(t.type) ? '' : cleanRank(t.rank),   // nhóm $ không có rank (WTE_INCOME_TYPE)
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
    await new Promise(r => setTimeout(r, 400));   // làm chậm việc dò mật khẩu hàng loạt
    return json({ ok: false, error: 'wrong-pass' }, 401);
  }

  const kv = env.WORK;

  if (body.action === 'list') {
    const res = json({ ok: true, tasks: await readTasks(kv) });
    // Chỉ cấp token khi vừa gõ đúng mật khẩu — máy đã nhớ không tự đẻ thêm token được
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
    tasks[i] = { ...tasks[i], ...sanitize(body.task || {}) };   // chỉ giữ nguyên id
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

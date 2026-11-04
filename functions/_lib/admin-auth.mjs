// Quyền admin dùng chung cho /api/private, /api/val, /api/val-fetch. Có 2 đường vào:
//   1. Mật khẩu ADMIN_PASS trong body (ô nhập tay + bot giá trên VPS).
//   2. Token của máy đã tick "Nhớ máy này": cookie HttpOnly, JS trên trang không đọc được.
//
// KV chỉ lưu hash của token, lộ KV cũng không dùng được. Hash trộn cả ADMIN_PASS nên
// đổi ADMIN_PASS là mọi máy đã nhớ mất quyền cùng lúc.
// Thu hồi 1 máy: xoá key `admin-device:<hash>` trong KV WORK (metadata ghi máy + ngày tạo).

const COOKIE = 'cvAdminDevice';
const COOKIE_MAX_AGE = 400 * 24 * 60 * 60;   // 400 ngày — mức tối đa Chrome cho phép
const hex = bytes => [...new Uint8Array(bytes)].map(b => b.toString(16).padStart(2, '0')).join('');

// So sánh không rò rỉ thời gian (chống dò mật khẩu bằng cách đo độ trễ)
function safeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

const deviceKey = async (token, env) => 'admin-device:' +
  hex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${token}:${env.ADMIN_PASS}`)));

// 'pass' = đúng mật khẩu · 'device' = máy đã nhớ · null = không có quyền
export async function adminVia(request, body, env) {
  if (!env.ADMIN_PASS) return null;
  if (safeEqual(String(body.pass ?? ''), String(env.ADMIN_PASS))) return 'pass';
  const token = (request.headers.get('cookie') || '').match(new RegExp(`(?:^|;\\s*)${COOKIE}=([a-f0-9]{64})(?:;|$)`))?.[1];
  if (!token || !env.WORK) return null;
  return await env.WORK.get(await deviceKey(token, env)) ? 'device' : null;
}

// Cấp token mới cho máy này, trả về giá trị header Set-Cookie
export async function rememberDevice(request, env) {
  const token = hex(crypto.getRandomValues(new Uint8Array(32)));
  await env.WORK.put(await deviceKey(token, env), '1', {
    metadata: { device: (request.headers.get('user-agent') || '').slice(0, 200), createdAt: new Date().toISOString() },
  });
  return `${COOKIE}=${token}; Path=/api; Max-Age=${COOKIE_MAX_AGE}; HttpOnly; Secure; SameSite=Strict`;
}

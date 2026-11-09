// Admin rights shared by /api/private, /api/val, /api/val-fetch. Two ways in:
//   1. ADMIN_PASS in the body (manual input + price bot on the VPS).
//   2. Token of a machine with "Nhớ máy này" ticked: HttpOnly cookie, unreadable by page JS.
//
// KV stores only the token's hash, so a KV leak is useless. The hash mixes in ADMIN_PASS, so
// changing ADMIN_PASS revokes every remembered machine at once.
// Revoke one machine: delete key `admin-device:<hash>` in KV WORK (metadata records machine + creation date).

const COOKIE = 'cvAdminDevice';
const COOKIE_MAX_AGE = 400 * 24 * 60 * 60;   // 400 days, the maximum Chrome allows
const hex = bytes => [...new Uint8Array(bytes)].map(b => b.toString(16).padStart(2, '0')).join('');

// Constant-time comparison (prevents guessing the password by timing)
function safeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

const deviceKey = async (token, env) => 'admin-device:' +
  hex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${token}:${env.ADMIN_PASS}`)));

// 'pass' = correct password · 'device' = remembered machine · null = no access
export async function adminVia(request, body, env) {
  if (!env.ADMIN_PASS) return null;
  if (safeEqual(String(body.pass ?? ''), String(env.ADMIN_PASS))) return 'pass';
  const token = (request.headers.get('cookie') || '').match(new RegExp(`(?:^|;\\s*)${COOKIE}=([a-f0-9]{64})(?:;|$)`))?.[1];
  if (!token || !env.WORK) return null;
  return await env.WORK.get(await deviceKey(token, env)) ? 'device' : null;
}

// Issue a new token for this machine, return the Set-Cookie header value
export async function rememberDevice(request, env) {
  const token = hex(crypto.getRandomValues(new Uint8Array(32)));
  await env.WORK.put(await deviceKey(token, env), '1', {
    metadata: { device: (request.headers.get('user-agent') || '').slice(0, 200), createdAt: new Date().toISOString() },
  });
  return `${COOKIE}=${token}; Path=/api; Max-Age=${COOKIE_MAX_AGE}; HttpOnly; Secure; SameSite=Strict`;
}

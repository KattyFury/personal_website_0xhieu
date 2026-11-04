import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const lib = new URL('../functions/_lib/admin-auth.mjs', import.meta.url).href;
const source = readFileSync(new URL('../functions/api/private.js', import.meta.url), 'utf8').replace('../_lib/admin-auth.mjs', lib);
const { onRequestPost } = await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));

function fakeKV() {
  const data = new Map();
  return { data, get: async k => data.get(k) ?? null, put: async (k, v) => { data.set(k, v); } };
}
const envOf = (kv, pass = 'test-password') => ({ ADMIN_PASS: pass, WORK: kv });
const call = (env, body, cookie) => onRequestPost({ env, request: new Request('https://example.com/api/private', {
  method: 'POST', body: JSON.stringify({ action: 'list', ...body }), headers: cookie ? { cookie } : {},
}) });
const cookieOf = res => res.headers.get('set-cookie')?.split(';')[0];

test('wrong password + rememberDevice issues nothing', async () => {
  const kv = fakeKV();
  const res = await call(envOf(kv), { pass: 'wrong', rememberDevice: true });
  assert.equal(res.status, 401);
  assert.equal(res.headers.get('set-cookie'), null);
  assert.equal(kv.data.size, 0);
});

test('password without the checkbox does not remember the machine', async () => {
  const kv = fakeKV();
  const res = await call(envOf(kv), { pass: 'test-password' });
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('set-cookie'), null);
  assert.equal(kv.data.size, 0);
});

test('remembered machine gets in with no password, and KV never holds the raw token', async () => {
  const kv = fakeKV();
  const env = envOf(kv);
  const first = await call(env, { pass: 'test-password', rememberDevice: true });
  const header = first.headers.get('set-cookie');
  for (const flag of ['HttpOnly', 'Secure', 'SameSite=Strict', 'Path=/api']) assert.ok(header.includes(flag), flag);
  const cookie = cookieOf(first);
  assert.ok(![...kv.data.keys()].some(k => k.includes(cookie.split('=')[1])));
  assert.equal((await call(env, {}, cookie)).status, 200);
  assert.equal((await call(env, {}, 'other=1; ' + cookie)).status, 200);
});

test('a remembered machine cannot mint more tokens', async () => {
  const kv = fakeKV();
  const env = envOf(kv);
  const cookie = cookieOf(await call(env, { pass: 'test-password', rememberDevice: true }));
  const res = await call(env, { rememberDevice: true }, cookie);
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('set-cookie'), null);
  assert.equal(kv.data.size, 1);
});

test('forged, revoked and pre-rotation tokens are rejected; password still works', async () => {
  const kv = fakeKV();
  const env = envOf(kv);
  const cookie = cookieOf(await call(env, { pass: 'test-password', rememberDevice: true }));
  assert.equal((await call(env, {}, 'cvAdminDevice=' + 'a'.repeat(64))).status, 401);
  assert.equal((await call(env, {}, 'cvAdminDevice=not-hex')).status, 401);
  assert.equal((await call(envOf(kv, 'rotated-password'), {}, cookie)).status, 401);
  kv.data.clear();
  assert.equal((await call(env, {}, cookie)).status, 401);
  assert.equal((await call(env, { pass: 'test-password' })).status, 200);
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const source = readFileSync(new URL('../functions/api/val-fetch.js', import.meta.url), 'utf8')
  .replace('../_lib/admin-auth.mjs', new URL('../functions/_lib/admin-auth.mjs', import.meta.url).href);
const { onRequestPost } = await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));
const originalFetch = globalThis.fetch;
const fixtures = () => ({
  search: { data: [{ id: 'ena-id', name: 'Ethena', symbol: 'ENA' }], meta: {} },
  detail: { data: { overview: { id: 'ena-id', name: 'Ethena', token_symbol: 'ENA', tags: ['Privacy'] },
    token_info: { symbol: 'ENA', total_supply: 15000000000 },
    tge_status: { current_status: 'post', last_event_time: Date.parse('2024-04-02') / 1000 },
    funding: { rounds: [{ date: '2023-07-17', amount: 6500000 }, { date: '2024-02-16', amount: 14000000 },
      { date: '2025-02-24', amount: 100000000 }] } } },
  coins: { coins: [{ id: 'ethena', name: 'Ethena', symbol: 'ena' }] },
  coin: { id: 'ethena', name: 'Ethena', symbol: 'ena', genesis_date: '2024-04-02', market_data: { total_supply: 15000000000 } },
});
async function call(f = fixtures(), body = {}, env = { ADMIN_PASS: 'test-password', SURF_API_KEY: 'test-surf' }) {
  let calls = 0;
  globalThis.fetch = async input => {
    calls++;
    const url = new URL(input);
    const payload = url.pathname.endsWith('/search/project') ? f.search : url.pathname.endsWith('/project/detail') ? f.detail
      : url.pathname.endsWith('/search') ? f.coins : f.coin;
    return new Response(JSON.stringify(payload));
  };
  try {
    const response = await onRequestPost({ env, request: new Request('https://example.com/api/val-fetch', {
      method: 'POST', body: JSON.stringify({ ticker: 'ENA', pass: 'test-password', ...body }),
    }) });
    return { status: response.status, result: await response.json(), calls };
  } finally { globalThis.fetch = originalFetch; }
}
test('authorized read fills sourced data, excludes future funding, never invents VC allocation/TGE price', async () => {
  const { result } = await call();
  assert.equal(result.ok, true);
  assert.deepEqual(result.fields, { cgId: 'ethena', totalSupply: 15000000000, narrative: 'privacy', tgeDate: '2024-04-02', fundraising: 20500000 });
  assert(!('vcAlloc' in result.fields)); assert(!('priceTGE' in result.fields));
  assert(Object.keys(result.fields).every(k => result.evidence[k].length));
});
test('wrong admin password cannot spend provider credits', async () => {
  const r = await call(fixtures(), { pass: 'wrong' }); assert.equal(r.status, 401); assert.equal(r.calls, 0);
});
test('duplicate tickers and incomplete search never silently choose a candidate', async () => {
  const f = fixtures(); f.search.data.push({ id: 'other', symbol: 'ENA' });
  assert.equal((await call(f)).result.error, 'ambiguous-ticker');
  f.search.data.pop(); f.search.meta.has_more = true;
  assert.equal((await call(f)).result.error, 'ambiguous-ticker');
});
test('mismatched identities do not fill any fields', async () => {
  const f = fixtures(); f.detail.data.token_info.symbol = 'OTHER';
  assert.equal((await call(f)).result.error, 'identity-mismatch');
});
test('disputed supply, differing genesis/TGE and undisclosed pre-TGE funding remain blank', async () => {
  const f = fixtures(); f.coin.market_data.total_supply = 100; f.coin.genesis_date = '2024-04-01';
  f.detail.data.funding.rounds[0].amount = null;
  const r = (await call(f, { tgeDate: '2024-04-02' })).result;
  assert.equal(r.ok, true); assert(!('totalSupply' in r.fields)); assert(!('tgeDate' in r.fields)); assert(!('fundraising' in r.fields));
});
test('malformed ticker is rejected before source calls', async () => {
  const r = await call(fixtures(), { ticker: 'A/B?<>' }); assert.equal(r.status, 400); assert.equal(r.calls, 0);
});

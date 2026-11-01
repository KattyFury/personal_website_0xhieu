// Read-only admin lookup. Fetch never writes KV or changes valuation rules.
const respond = (value, status = 200) => new Response(JSON.stringify(value), {
  status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
});
const equal = (a, b) => {
  if (a.length !== b.length) return false;
  let diff = 0; for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
};
const normalized = value => String(value || '').normalize('NFKD').replace(/[^a-z0-9]/gi, '').toLowerCase();
const dateOnly = value => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ''))) return '';
  const date = new Date(value + 'T00:00:00Z');
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value ? value : '';
};
const positive = value => typeof value === 'number' && Number.isFinite(value) && value > 0;

async function json(url, headers = {}) {
  const res = await fetch(url, { headers: { accept: 'application/json', ...headers }, signal: AbortSignal.timeout(12000) });
  if (!res.ok) throw new Error(res.status === 429 ? 'rate-limit' : 'source-unavailable');
  return res.json();
}

export async function onRequestPost({ request, env }) {
  let body; try { body = await request.json(); } catch { return respond({ ok: false, error: 'bad-request' }, 400); }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return respond({ ok: false, error: 'bad-request' }, 400);
  if (!env.ADMIN_PASS || !equal(String(body.pass || ''), String(env.ADMIN_PASS))) {
    return respond({ ok: false, error: 'wrong-pass' }, 401);
  }
  const ticker = String(body.ticker || '').trim().replace(/^\$/, '').toUpperCase();
  if (!/^[A-Z0-9][A-Z0-9.-]{0,19}$/.test(ticker)) return respond({ ok: false, error: 'bad-ticker' }, 400);
  if (!env.SURF_API_KEY) return respond({ ok: false, error: 'surf-not-configured' }, 503);
  const surf = (path, params) => json('https://api.asksurf.ai/gateway/v1' + path + '?' + new URLSearchParams(params), {
    Authorization: 'Bearer ' + env.SURF_API_KEY,
  });
  const cg = path => json('https://api.coingecko.com/api/v3' + path,
    env.COINGECKO_API_KEY ? { 'x-cg-demo-api-key': env.COINGECKO_API_KEY } : {});
  try {
    const found = await surf('/search/project', { q: ticker, limit: '100' });
    const matches = (found.data || []).filter(p => String(p.symbol || '').toUpperCase() === ticker);
    // Never resolve a duplicate ticker by ranking or silently use a truncated result.
    if (found.meta?.has_more || matches.length !== 1) return respond({ ok: false,
      error: matches.length || found.meta?.has_more ? 'ambiguous-ticker' : 'not-found' }, 422);
    const candidate = matches[0];
    const detail = (await surf('/project/detail', { id: candidate.id, fields: 'overview,token_info,funding,tge_status' })).data;
    if (!detail?.overview || detail.overview.id !== candidate.id ||
        String(detail.overview.token_symbol || '').toUpperCase() !== ticker ||
        String(detail.token_info?.symbol || '').toUpperCase() !== ticker) {
      return respond({ ok: false, error: 'identity-mismatch' }, 422);
    }
    const fields = {}, evidence = {}, warnings = [];
    const add = (key, value, sources) => { fields[key] = value; evidence[key] = sources; };
    let coin;
    try {
      const search = await cg('/search?query=' + encodeURIComponent(ticker));
      const coins = (search.coins || []).filter(c => String(c.symbol || '').toUpperCase() === ticker &&
        normalized(c.name) === normalized(detail.overview.name));
      if (coins.length === 1) {
        coin = await cg('/coins/' + encodeURIComponent(coins[0].id) +
          '?localization=false&tickers=false&community_data=false&developer_data=false');
        if (String(coin.symbol || '').toUpperCase() !== ticker || normalized(coin.name) !== normalized(detail.overview.name)) coin = null;
        else add('cgId', coin.id, ['SURF', 'CoinGecko']);
      } else warnings.push('Chưa đối chiếu được định danh CoinGecko duy nhất.');
    } catch { warnings.push('CoinGecko chưa phản hồi; không điền các trường cần đối chiếu.'); }
    const supply = detail.token_info.total_supply;
    if (positive(supply) && coin?.market_data?.total_supply === supply) add('totalSupply', supply, ['SURF', 'CoinGecko']);
    else if (positive(supply)) warnings.push('Total supply chưa được hai nguồn xác nhận cùng giá trị.');

    // Only map an explicit, unambiguous classification to this site's existing taxonomy.
    const mapping = { 'layer1':'layer-1', 'layer2':'layer-2', 'artificialintelligence':'ai', 'ai':'ai',
      'predictionmarkets':'prediction', 'privacy':'privacy', 'gaming':'game', 'desci':'desci',
      'decentralizedscience':'desci', 'identity':'identity', 'socialfi':'social', 'payments':'payment',
      'stablechain':'stablechain', 'infrastructure':'infra' };
    const narratives = [...new Set((detail.overview.tags || []).map(t => mapping[normalized(t)]).filter(Boolean))];
    if (narratives.length === 1) add('narrative', narratives[0], ['SURF']);

    // Genesis is not assumed to mean TGE; require independent agreement with Surf's post-TGE event.
    const genesis = coin?.genesis_date && dateOnly(coin.genesis_date);
    const tge = detail.tge_status;
    let confirmedTge = '';
    if (genesis && tge?.current_status === 'post' && Number.isFinite(tge.last_event_time)) {
      const eventDate = new Date(tge.last_event_time * 1000).toISOString().slice(0, 10);
      if (eventDate === genesis) { confirmedTge = genesis; add('tgeDate', genesis, ['SURF', 'CoinGecko']); }
    }
    const cutoff = dateOnly(body.tgeDate) || confirmedTge;
    const rounds = detail.funding?.rounds;
    if (cutoff && Array.isArray(rounds) && rounds.length && rounds.every(r => dateOnly(r.date))) {
      const before = rounds.filter(r => r.date <= cutoff);
      if (before.length && before.every(r => positive(r.amount))) {
        const total = before.reduce((n, r) => n + r.amount, 0);
        if (Number.isFinite(total)) add('fundraising', total, ['SURF — các vòng gọi vốn đến ngày TGE']);
      } else warnings.push('Gọi vốn trước TGE có vòng chưa công bố số tiền; không tự cộng thành tổng.');
    }
    // No direct verified VC allocation or historical TGE price in these endpoints: leave blank.
    return respond({ ok: true, ticker, project: { id: candidate.id, name: detail.overview.name },
      fields, evidence, warnings, fetchedAt: new Date().toISOString() });
  } catch (error) {
    return respond({ ok: false, error: error.message === 'rate-limit' ? 'rate-limit' : 'lookup-failed' }, 502);
  }
}

// /valuation: pre-fill numbers into HTML so AI/bots reading the page get them immediately
// (normally the table + "Recent TGE multiples" box are drawn by JS after load, so AI sees only "—").
//
// Only READS KV (val-projects + val-prices), writes nothing, doesn't change the UI:
// the browser still runs JS and redraws these same cells with the same numbers.
//
// ⚠️ The formulas below are COPIED from index.html (multiple · xMult · renderAnalysis · renderTable).
// Change a formula in index.html and you must change it here, or AI reads different numbers from the page.
// Numbers print in EN style (decimal point) because the static HTML labels are English.

const readJson = async (kv, key, fallback) => {
  try { return JSON.parse(await kv.get(key) || JSON.stringify(fallback)); } catch { return fallback; }
};

const median = arr => {
  if (!arr.length) return null;
  const s = [...arr].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

const vcFDVof   = e => e.fundraising / (e.vcAlloc / 100);
const vcPrice   = e => (!e.vcAlloc || !e.totalSupply) ? 0 : vcFDVof(e) / e.totalSupply;
const xMult     = (price, e) => { const vc = vcPrice(e); return vc > 0 && price > 0 ? price / vc : null; };
const multiple  = e => { const v = vcFDVof(e); return v > 0 ? (e.priceTGE * e.totalSupply) / v : 0; };
const fmtMult   = (n, dp = 2) => n > 0 ? n.toFixed(dp) : '—';
const fmtDate   = s => { if (!s) return '—'; const [y, m, d] = s.split('-'); return `${d}/${m}/${y.slice(2)}`; };
const esc       = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function compute(projects, prices) {
  const entries = projects
    .filter(p => p.ticker && p.tgeDate && p.fundraising > 0)
    .map(p => {
      const px = prices[p.ticker] || {};
      return { ...p, ath: px.ath || 0, athDate: px.athDate || '', preAth: px.preAth || 0,
               athWick: !!px.athWick, atl: px.atl || 0, currentPrice: px.atm || 0 };
    });

  // Market condition: 6 latest TGE deals (all groups combined)
  const newest = [...entries].sort((a, b) => new Date(b.tgeDate) - new Date(a.tgeDate));
  const recent6 = newest.map(e => multiple(e)).filter(m => isFinite(m) && m > 0).slice(0, 6);
  const med = median(recent6);
  const condition = recent6.length ? (med >= 13 ? 'Strong' : med >= 4.3 ? 'Normal' : 'Weak') : '—';

  // High-FDV penalty by current conditions (matches fdvPenalty() in index.html): each TGE gets a condition
  // = median of the previous 6 TGEs; Weak separate, Normal+Strong combined; each ≥300M project divided by the small-project
  // median of the same condition, k = median of the ratios; needs ≥ 5 large projects
  const SPLIT = 300e6;
  const lvlOf = m => m >= 13 ? 'Strong' : m >= 4.3 ? 'Normal' : 'Weak';
  const grp = condition === 'Weak' ? ['Weak'] : ['Normal', 'Strong'];
  const chrono = entries.map(e => ({ hi: vcFDVof(e) >= SPLIT, m: multiple(e), date: e.tgeDate }))
    .filter(x => isFinite(x.m) && x.m > 0).sort((a, b) => new Date(a.date) - new Date(b.date));
  chrono.forEach((x, i) => { if (i >= 6) x.lvl = lvlOf(median(chrono.slice(i - 6, i).map(y => y.m))); });
  const pool = chrono.filter(x => grp.includes(x.lvl) && x.m < 1000);
  const loMed = {};
  grp.forEach(l => { loMed[l] = median(pool.filter(x => !x.hi && x.lvl === l).map(x => x.m)); });
  const ratios = pool.filter(x => x.hi && loMed[x.lvl]).map(x => x.m / loMed[x.lvl]);
  const k = ratios.length >= 5 ? median(ratios) : null;
  const penalty = k ? `×${k.toFixed(2)}` : '—';

  // TGE coefficient: 6 latest deals (if the 6th is >60 days old use 4), high-FDV projects divided by k
  const norm = newest.map(e => ({ m: k && vcFDVof(e) >= SPLIT ? multiple(e) / k : multiple(e), date: e.tgeDate }))
    .filter(x => isFinite(x.m) && x.m > 0);
  let n = Math.min(6, norm.length);
  if (norm.length >= 6 && (new Date(norm[0].date) - new Date(norm[5].date)) / 86400000 > 60) n = 4;
  const coefM = norm.slice(0, n).map(x => x.m);
  const coef = coefM.length ? `×${median(coefM).toFixed(2)}` : '—';

  // Table: old → new, same columns as the page
  const rows = [...entries].sort((a, b) => new Date(a.tgeDate) - new Date(b.tgeDate)).map(e => {
    const athTooEarly = e.athWick || !e.athDate || !e.tgeDate ||
      (new Date(e.athDate) - new Date(e.tgeDate)) <= 7 * 86400000;
    const xATH = athTooEarly ? 0 : xMult(e.ath, e);
    const xPre = e.preAth ? xMult(e.preAth, e) : null;
    const xTGE = multiple(e), xATM = xMult(e.currentPrice, e);
    // First-week ATH still shows ×TGE → ×ATH: black numbers, only (×N) orange via shared CSS.
    const athEarly = athTooEarly && e.ath > 0 && (e.athWick || (e.athDate && e.tgeDate));
    const athGain = (start, end) => start > 0 && end > 0 && Number.isFinite(end / start)
      ? `<span class="ath-gain">(×${fmtMult(end / start)})</span>` : '';
    const athCell = xATH > 0 ? (xPre > 0 ? `<span class="ath-pre">${fmtMult(xPre)}</span> <span class="ath-arrow">→</span> ${fmtMult(xATH)}${athGain(xPre, xATH)}` : fmtMult(xATH))
      : athEarly ? `<span class="ath-early">${fmtMult(xTGE)}</span> <span class="ath-arrow">→</span> <span class="ath-early">${fmtMult(xMult(e.ath, e))}</span>${athGain(xTGE, xMult(e.ath, e))}`
      : '—';
    const tgeCls = xTGE >= 13 ? 'm-hot' : '';
    const atmCls = xATM >= 15 ? 'm-danger' : (xATM > 0 && xATM < 1 ? 'm-low' : '');
    const wrap = (cls, txt) => cls ? `<span class="${cls}">${txt}</span>` : txt;
    const hi = vcFDVof(e) >= SPLIT ? ' fdv-hi' : '';
    return `<tr data-ticker="${esc(e.ticker)}">
      <td class="td-ticker${hi}"><span class="ck">${esc(e.ticker)}</span></td>
      <td class="td-narrative"><span class="ck">${esc(e.narrative || '—')}</span></td>
      <td class="td-date"><span class="ck">${fmtDate(e.tgeDate)}</span></td>
      <td class="td-multi"><span class="ck">${wrap(tgeCls, fmtMult(xTGE))}</span></td>
      <td class="td-multi td-ath"><span class="ck">${athCell}</span></td>
      <td class="td-multi td-atl"><span class="ck">${fmtMult(e.atl ? xMult(e.atl, e) : null)}</span></td>
      <td class="td-multi"><span class="ck">${wrap(atmCls, fmtMult(xATM, 3))}</span></td>
    </tr>`;
  }).join('');

  return { coef, penalty, condition, rows };
}

export async function onRequestGet({ request, env }) {
  const page = await env.ASSETS.fetch(new URL('/', request.url));
  if (!env.WORK) return page;

  let data;
  try {
    const [projects, prices] = await Promise.all([
      readJson(env.WORK, 'val-projects', []),
      readJson(env.WORK, 'val-prices', {}),
    ]);
    data = compute(projects, prices);
  } catch {
    return page;   // on error return the original page; JS draws as before
  }

  return new HTMLRewriter()
    .on('#tge-coef',             { element: el => el.setInnerContent(data.coef) })
    .on('#tge-penalty',          { element: el => el.setInnerContent(data.penalty) })
    .on('#market-condition-lvl', { element: el => el.setInnerContent(data.condition) })
    .on('#tge-tbody',            { element: el => el.setInnerContent(data.rows, { html: true }) })
    .transform(page);
}

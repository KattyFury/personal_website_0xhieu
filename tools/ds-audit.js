// Gác cổng design system: đo computed style MỌI phần tử hiển thị ở 3 tab × desktop 1440 / mobile 390 (+ 3 popup Valuation),
// so với DESIGN_SYSTEM.md: CV spacious (nhịp 8); Valuation/Work/popup compact (nhịp 4, radius 8/16, ô nhập 40).
//   node tools/ds-audit.js http://127.0.0.1:8787      (server local có SPA fallback + /api proxy)
//   node tools/ds-audit.js https://0xhieu.xyz
// Kết quả đúng: TỔNG 0 (margin căn giữa tự động đã được bỏ qua). Mọi dòng in ra = lỗi phải sửa.
// Chưa đo được: pseudo-element (::before/::after) và trạng thái hover — soát tay.
const { spawn } = require('child_process');
const fs = require('fs'), os = require('os'), path = require('path');
const BASE = process.argv[2] || 'http://127.0.0.1:8787';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9400 + Math.floor(Math.random() * 300);
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'audit-'));
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, 'about:blank']);
const sleep = ms => new Promise(r => setTimeout(r, ms));

// Chạy trong trang: trả về danh sách vi phạm
const PROBE = `(() => {
  const ALLOWED_COLORS = {
    '0,0,0':'ink','255,255,255':'ground','82,82,82':'grey/muted','229,229,229':'surface','163,163,163':'line',
    '255,190,92':'accent-orange',
    '196,43,63':'red-text','253,232,235':'red-soft'
  };
  const TYPE = { 14:[20], 16:[24], 18:[28], 20:[28], 24:[32], 32:[40], 40:[48] };   // cỡ → line-height hợp lệ
  const TRACK = { 14:-0.006, 16:-0.011, 18:-0.014, 20:-0.017, 24:-0.019, 32:-0.022, 40:-0.022 };
  const out = [];
  const name = el => el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (el.classList.length ? '.' + [...el.classList].join('.') : '');
  const rgb = c => { const m = c.match(/rgba?\\(([^)]+)\\)/); if (!m) return null; const p = m[1].split(/[ ,\\/]+/).filter(Boolean).map(Number); return { k: p.slice(0,3).join(','), a: p.length > 3 ? p[3] : 1 }; };
  const bad = (el, what) => out.push(name(el) + ' :: ' + what);
  const px = v => parseFloat(v) || 0;
  const ok8 = v => { const n = Math.round(px(v) * 100) / 100; return n === 0 || n % 8 === 0; };
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    const cs = getComputedStyle(el);
    const compact = !!el.closest('#valuation-view, #airdrop-view, .wl-modal-backdrop, #rank-filter-float');
    if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) continue;
    if (['svg','path','circle','rect','polyline','line','img','br','script','style','table','thead','tbody','tr','colgroup','col'].includes(el.tagName.toLowerCase())) continue;
    const hasText = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
    // màu chữ
    if (hasText) {
      const c = rgb(cs.color); if (c && !ALLOWED_COLORS[c.k]) bad(el, 'màu chữ lạ rgb(' + c.k + ')');
      const fs = Math.round(px(cs.fontSize));
      if (!TYPE[fs]) bad(el, 'cỡ chữ ' + fs + ' không có trong DS');
      else {
        const lh = cs.lineHeight === 'normal' ? 'normal' : Math.round(px(cs.lineHeight));
        if (!TYPE[fs].includes(lh) && !(el.closest('.val-intro') )) bad(el, 'line-height ' + lh + ' sai (cỡ ' + fs + ' phải ' + TYPE[fs] + ')');
        const ls = Math.round(px(cs.letterSpacing) / fs * 1000) / 1000;
        if (Math.abs(ls - TRACK[fs]) > 0.002) bad(el, 'letter-spacing ' + ls + 'em sai (cỡ ' + fs + ' phải ' + TRACK[fs] + ')');
        const w = +cs.fontWeight;
        if (![400, 600, 700].includes(w)) bad(el, 'font-weight ' + w);
        if (w === 700 && fs < 32) bad(el, 'đậm 700 ở cỡ ' + fs + ' (DS: 700 chỉ cho ≥32, còn lại 400/600)');
      }
      if (cs.textTransform === 'uppercase') bad(el, 'VIẾT HOA bằng CSS');
    }
    // nền
    const bg = rgb(cs.backgroundColor);
    if (bg && bg.a > 0 && !ALLOWED_COLORS[bg.k]) bad(el, 'màu nền lạ rgb(' + bg.k + ') a=' + bg.a);
    // viền
    for (const side of ['Top','Right','Bottom','Left']) {
      if (px(cs['border' + side + 'Width']) > 0 && cs['border' + side + 'Style'] !== 'none') {
        const bc = rgb(cs['border' + side + 'Color']); if (bc && !ALLOWED_COLORS[bc.k]) bad(el, 'màu viền lạ rgb(' + bc.k + ')');
      }
    }
    // khoảng cách
    for (const p of ['paddingTop','paddingRight','paddingBottom','paddingLeft','marginTop','marginRight','marginBottom','marginLeft','rowGap','columnGap']) {
      const v = cs[p]; if (!v || v === 'normal' || (compact ? px(v) % 4 === 0 : ok8(v))) continue;
      // đệm phải của header bảng = đúng bề rộng thanh cuộn thân bảng, để cột thẳng hàng; không phải spacing thiết kế
      if (p === 'paddingRight' && el.matches('#tge-head-wrap, .tge-modal-head')) continue;
      // margin 2 bên bằng nhau = căn giữa tự động (margin: auto) → không phải lỗi
      const pair = { marginLeft: 'marginRight', marginRight: 'marginLeft', marginTop: 'marginBottom', marginBottom: 'marginTop' }[p];
      if (pair && cs[pair] === v) continue;
      bad(el, p + ' ' + v + ' sai nhịp ' + (compact ? 4 : 8));
    }
    // bo góc
    const rad = px(cs.borderTopLeftRadius);
    if (rad && rad !== 16 && rad !== 8 && !(rad >= r.height / 2 - 0.5) && cs.borderTopLeftRadius.indexOf('%') < 0) bad(el, 'radius ' + rad + ' sai component');
    // bóng
    if (cs.boxShadow !== 'none') {
      const s = cs.boxShadow.replace(/\\s+/g, ' ');
      if (!/^rgba\\(0, 0, 0, 0\\.32\\) 0px 2px 8px 0px$/.test(s) && !/inset/.test(s)) bad(el, 'shadow lạ: ' + s);
    }
    // nút & ô nhập: kích thước chuẩn
    const tag = el.tagName.toLowerCase();
    const isBtn = tag === 'button' || (tag === 'a' && /btn/.test(el.className));
    if (isBtn && !el.closest('nav') && !el.classList.contains('box-title-btn')) {
      const h = Math.round(r.height);
      if (!(compact ? [32, 40, 44, 48] : [40, 48]).includes(h)) bad(el, 'nút cao ' + h + ' sai profile');
    }
    if ((tag === 'input' || tag === 'select') && !(compact ? [40, 44] : [48]).includes(Math.round(r.height))) bad(el, 'ô nhập cao ' + Math.round(r.height));
  }
  return out;
})()`;

(async () => {
  let t; for (let i = 0; i < 60; i++) { try { t = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json(); break; } catch { await sleep(250); } }
  const ws = new WebSocket(t.find(x => x.type === 'page').webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener('open', r));
  let id = 0; const pend = new Map();
  ws.addEventListener('message', ev => { const m = JSON.parse(ev.data); if (m.id && pend.has(m.id)) { pend.get(m.id)(m.result); pend.delete(m.id); } });
  const send = (method, params = {}) => new Promise(res => { const i = ++id; pend.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
  const evalJs = async e => (await send('Runtime.evaluate', { expression: e, returnByValue: true })).result.value;
  await send('Page.enable');
  const all = new Map();
  const add = (ctx, list) => list.forEach(v => { if (!all.has(v)) all.set(v, new Set()); all.get(v).add(ctx); });
  const runs = [
    ['/', 'cv'], ['/valuation', 'val'], ['/work', 'work'],
    ['/valuation', 'val+popup FDV', '#predict-open-btn'], ['/valuation', 'val+popup info', '#danger-title-text'], ['/valuation', 'val+popup bảng', '#tge-intro'],
  ];
  for (const [w, h, mob] of [[1440, 900, false], [390, 844, true]]) {
    await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: mob });
    for (const [u, ctx, click] of runs) {
      await send('Page.navigate', { url: BASE + u }); await sleep(6000);
      if (click) { await evalJs(`document.querySelector('${click}')?.click()`); await sleep(800); }
      add(`${ctx}@${w}`, await evalJs(PROBE));
    }
  }
  const lines = [...all.entries()].map(([v, c]) => `${v}   [${[...c].join(', ')}]`).sort();
  console.log(lines.join('\n')); console.log('\nTỔNG:', lines.length);
  chrome.kill(); process.exit(lines.length ? 1 : 0);
})();

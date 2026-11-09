"""Sinh 3 mockup redesign (v1 Editorial, v2 Bento, v3 Yellow Block) từ dữ liệu thật.
Chạy: python build.py  → v1.html v2.html v3.html (mỗi file 3 màn: #cv #val #work, rộng 390)."""
import json, html
from pathlib import Path

D = Path(__file__).parent
VAL = json.loads((D / 'val.json').read_text(encoding='utf-8'))
WORK = json.loads((D / 'work.json').read_text(encoding='utf-8'))
e = html.escape

# ── CV content (verbatim from the site) ─────────────────────────────
EXP = [
    ('2026', 'Community Builder & Builder', [
        'Grew a Telegram community from 0 to 500+ members in Q1 2026',
        "Helped grow Arc's community through ELI12-style content & Arc meetups",
        'Built products on Arc: github.com/KattyFury']),
    ('2025', 'Content Creator & Contributor', [
        'Ambassador: $RECALL. Top Yapper: $NEWT, $RECALL, $MIRA, $RLS, $SENT, $ZAMA',
        'OG Contributor: $SOMI, $RECALL, $RLS, $SENT, $ZAMA']),
    ('2023–24', 'Investment Analyst', [
        'Analyzed crypto markets to support spot investment decisions for a small fund']),
    ('2022', 'Entered Crypto Markets', ['Tried every kind of analysis, then kept what actually worked']),
    ('Pre-2022', 'Graphic Designer', ['Branding & layout for HangFashion and Vietnamour']),
]
HL = [('assets/2.webp', 'Recall Ambassador & top Yapper'), ('assets/4.webp', 'Telegram community, 0 → 500+'),
      ('assets/5.webp', "Growing Arc's Vietnam community"), ('assets/1.webp', 'Graphic Designer before 2022')]
AVAIL = ['Ambassador', 'Community Building & Moderation', 'Content Collaborations']
STATS = [('500+', 'Telegram members'), ('6', 'Top Yapper projects'), ('4 yrs', 'in crypto')]

# ── Valuation ─────────────────────────────────────────────────
NARR = [('stablechain', 75.3, 2), ('layer-2', 5.8, 3), ('ai', 4.2, 13), ('defi', 4.1, 4), ('layer-1', 3.9, 9)]
HERO = [('ENA', '02/04/24', 30.4), ('STABLE', '08/12/25', 22.3)]
f2 = lambda x: f'{x:.2f}'

# ── Work: gather DAILY at the top ───────────────────────────────────
ORDER = {'LEARN': 0, 'INCOME': 1, 'S': 2, 'A': 3, 'B': 4, 'C': 5}
def grp(p):
    if p['type'] == 'Learn-to-Grow': return 'LEARN'
    if p['type'] == 'Work-to-Earn': return 'INCOME'
    return p['rank'] or 'C'
LABEL = {'LEARN': 'l2g', 'INCOME': 'w2e', 'S': 'S', 'A': 'A', 'B': 'B', 'C': 'C'}
GNAME = {'LEARN': 'learn-to-grow', 'INCOME': 'work-to-earn', 'S': 'Rank S', 'A': 'Rank A', 'B': 'Rank B', 'C': 'Rank C'}
projects = [{'name': 'English (ví dụ)', 'type': 'Learn-to-Grow', 'rank': '', 'pot': 'high', 'tw': '',
             'daily': ['Học 20 từ mới + nghe 1 podcast'], 'weekly': []}] + WORK
for p in projects: p['g'] = grp(p)
projects.sort(key=lambda p: (ORDER[p['g']], p['pot'] != 'high'))
DAILY = [(p, t) for p in projects for t in p['daily']]
IDLE = [p for p in projects if not p['daily']]

def handle(p):
    t = p['tw'] or ''
    for k in ('twitter.com/', 'x.com/'):
        if k in t: t = t.split(k)[1]
    return t.strip('@/ ').split('?')[0]
def logo(p, cls='lg'):
    h = handle(p)
    if h: return f'<img class="{cls}" src="https://unavatar.io/twitter/{h}" alt="">'
    return f'<span class="{cls} lg-txt">{e(p["name"][0])}</span>'

ICON = {
    'x': '<path d="M4 4l11.7 16H20L8.3 4z"/><path d="M4 20l6.8-6.8M13.2 10.8L20 4"/>',
    'tg': '<path d="M21.5 4.5 2.5 11.8l6 2.2 2.3 6.5 3.4-4.2 4.8 3.6z"/><path d="m8.5 14 13-9.5"/>',
    'mail': '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    'pin': '<path d="M20 10c0 5-8 12-8 12s-8-7-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
    'arrow': '<path d="M7 17 17 7M8 7h9v9"/>', 'chev': '<path d="m9 6 6 6-6 6"/>',
    'fire': '<path d="M12 22c4 0 7-3 7-7 0-5-5-7-5-12-3 2-6 5-6 9-1-1-2-2-2-4-2 2-1 5-1 7 0 4 3 7 7 7z"/>',
    'chart': '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>', 'alert': '<path d="M12 3 2 21h20z"/><path d="M12 10v5M12 18h.01"/>',
    'check': '<path d="m5 12 5 5 9-10"/>', 'cam': '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
}
def ic(k, s=16): return (f'<svg width="{s}" height="{s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
                         f'stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">{ICON[k]}</svg>')

def nav(active, cls='nav'):
    tabs = ''.join(f'<a class="{"on" if t == active else ""}">{t}</a>' for t in ('CV', 'Valuation', 'Work'))
    return f'<header class="{cls}"><span class="brand"><img src="assets/icon.png" alt="">0xhieu.xyz</span><nav>{tabs}</nav></header>'

FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?'
         'family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&family=Space+Grotesk:wght@500;700'
         '&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">')
BASE = """
*{box-sizing:border-box;margin:0;padding:0}body{background:#ddd;font-family:Inter,system-ui,sans-serif;color:#0A0A0A;
-webkit-font-smoothing:antialiased;display:flex;gap:40px;padding:40px;align-items:flex-start}
.screen{width:390px;flex:none;overflow:hidden;position:relative}a{color:inherit;text-decoration:none}
img{display:block}.num{font-variant-numeric:tabular-nums}
"""
def page(title, css, cv, val, work):
    return (f'<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>{title}</title>{FONTS}'
            f'<style>{BASE}{css}</style></head><body><section class="screen" id="cv">{cv}</section>'
            f'<section class="screen" id="val">{val}</section><section class="screen" id="work">{work}</section></body></html>')

# ═════════════════════════════════════════════════════════════
# V1 EDITORIAL: white, large type, one column reading like a magazine
# ═════════════════════════════════════════════════════════════
V1CSS = """
.screen{background:#fff;padding-bottom:40px}
.nav{display:flex;justify-content:space-between;align-items:center;padding:14px 20px;border-bottom:1px solid #EDEDED}
.brand{display:flex;gap:8px;align-items:center;font-weight:700;font-size:15px}.brand img{width:28px;height:28px;border-radius:6px}
.nav nav{display:flex;gap:16px;font-size:14px;color:#737373}.nav nav a.on{color:#0A0A0A;font-weight:600;box-shadow:inset 0 -2px #F5B301;padding-bottom:4px}
.wrap{padding:0 20px}
.kicker{font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#737373;font-weight:600}
.hero{padding:40px 20px 32px}.hero .row{display:flex;align-items:center;gap:12px;margin-bottom:28px}
.hero .row img{width:56px;height:56px;border-radius:50%;object-fit:cover}
.hero .who b{display:block;font-size:17px}.hero .who span{font-size:13px;color:#737373;display:flex;gap:4px;align-items:center}
.hero h1{font-family:'Instrument Serif',serif;font-weight:400;font-size:52px;line-height:1;letter-spacing:-.02em}
.hero h1 i{background:linear-gradient(transparent 58%,#F5B301 58%,#F5B301 92%,transparent 92%)}
.hero p{margin-top:18px;font-size:16px;line-height:1.55;color:#404040}
.cta{display:flex;gap:8px;margin-top:24px}.cta a{flex:1;display:flex;gap:6px;align-items:center;justify-content:center;height:44px;
border:1px solid #D4D4D4;border-radius:999px;font-size:14px;font-weight:600}.cta a.pri{background:#F5B301;border-color:#F5B301}
.stats{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid #EDEDED;border-bottom:1px solid #EDEDED;margin:0 20px}
.stats div{padding:16px 0}.stats div+div{border-left:1px solid #EDEDED;padding-left:14px}
.stats b{font-family:'Instrument Serif',serif;font-size:32px;font-weight:400;display:block;line-height:1}.stats span{font-size:12px;color:#737373}
.sec{padding:36px 20px 0}.sec h2{font-family:'Instrument Serif',serif;font-weight:400;font-size:32px;margin:6px 0 16px}
.job{display:grid;grid-template-columns:72px 1fr;gap:12px;padding:16px 0;border-top:1px solid #EDEDED}
.job .y{font-size:13px;color:#737373;font-weight:600;padding-top:2px}.job b{font-size:16px;display:block;margin-bottom:6px}
.job li{list-style:none;font-size:14px;line-height:1.5;color:#404040;padding-left:12px;position:relative;margin-top:4px}
.job li:before{content:'';position:absolute;left:0;top:9px;width:4px;height:4px;background:#A3A3A3;border-radius:50%}
.rail{display:flex;gap:12px;overflow:hidden;margin-right:-20px}.rail figure{width:240px;flex:none}
.rail img{width:240px;height:160px;object-fit:cover;border-radius:12px}.rail figcaption{font-size:13px;color:#525252;margin-top:8px}
.chips{display:flex;flex-wrap:wrap;gap:8px}.chips span{border:1px solid #D4D4D4;border-radius:999px;padding:8px 14px;font-size:14px}
/* valuation */
.ph{padding:28px 20px 16px;display:flex;justify-content:space-between;align-items:flex-end}
.ph h1{font-family:'Instrument Serif',serif;font-weight:400;font-size:40px;line-height:1}
.seg{display:flex;border:1px solid #D4D4D4;border-radius:999px;padding:3px;font-size:12px;font-weight:600}
.seg span{padding:5px 10px;border-radius:999px;color:#737373}.seg span.on{background:#0A0A0A;color:#fff}
.kpis{display:grid;grid-template-columns:repeat(3,1fr);margin:0 20px;border:1px solid #EDEDED;border-radius:16px}
.kpis div{padding:14px 12px}.kpis div+div{border-left:1px solid #EDEDED}.kpis span{font-size:11px;color:#737373;display:block;margin-bottom:6px}
.kpis b{font-size:22px;font-weight:700}.kpis b.hi{background:#F5B301;padding:0 4px}
.btn{display:flex;justify-content:center;align-items:center;height:48px;margin:12px 20px 0;background:#F5B301;border-radius:999px;font-weight:600;font-size:15px}
.tbl{margin:28px 0 0}.tbl .h{display:flex;justify-content:space-between;align-items:baseline;padding:0 20px 10px}
.tbl .h b{font-size:17px}.tbl .h span{font-size:12px;color:#737373}
table{width:100%;border-collapse:collapse;font-size:14px}th{font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:#737373;
font-weight:600;text-align:right;padding:8px 0;border-bottom:1px solid #0A0A0A}th:first-child,td:first-child{text-align:left;padding-left:20px}
th:last-child,td:last-child{padding-right:20px}td{padding:12px 0;text-align:right;border-bottom:1px solid #EDEDED}
td b{font-weight:600}td small{display:block;font-size:11px;color:#737373;font-weight:400}.mk{background:#F5B301;padding:0 4px;font-weight:600}
.bars{padding:0 20px}.bar{display:grid;grid-template-columns:92px 1fr 52px;gap:10px;align-items:center;padding:8px 0;font-size:14px}
.bar i{height:10px;background:#F5B301;border-radius:999px;display:block}.bar small{color:#737373}.bar b{text-align:right}
.hz{margin:0 20px;border-top:1px solid #EDEDED}.hz div{display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid #EDEDED;font-size:15px}
.hz small{color:#737373;font-size:12px;margin-left:8px}
/* work */
.today{margin:0 20px;border:1px solid #EDEDED;border-radius:16px;overflow:hidden}
.today .th{display:flex;justify-content:space-between;align-items:center;padding:14px 16px;background:#FAFAFA;border-bottom:1px solid #EDEDED}
.today .th b{font-size:15px}.prog{font-size:12px;color:#525252;display:flex;gap:8px;align-items:center}
.prog i{width:64px;height:6px;border-radius:9px;background:#EDEDED;position:relative;overflow:hidden}.prog i:after{content:'';position:absolute;inset:0 70% 0 0;background:#F5B301}
.task{display:grid;grid-template-columns:22px 1fr;gap:12px;padding:12px 16px;border-bottom:1px solid #F2F2F2;font-size:14px;line-height:1.45}
.task .cb{width:20px;height:20px;border:1.5px solid #A3A3A3;border-radius:6px;margin-top:1px;display:grid;place-items:center}
.task.done .cb{background:#F5B301;border-color:#F5B301}.task.done p{color:#A3A3A3;text-decoration:line-through}
.task small{display:flex;gap:6px;align-items:center;font-size:12px;color:#737373;margin-top:4px}
.tag{font-size:11px;font-weight:600;border-radius:4px;padding:1px 6px;border:1px solid #D4D4D4;color:#404040}.tag.k{background:#0A0A0A;color:#fff;border-color:#0A0A0A}
.lg{width:16px;height:16px;border-radius:50%;object-fit:cover;flex:none}.lg-txt{display:grid;place-items:center;background:#EDEDED;font-size:10px;font-weight:700}
.plist{margin:0 20px}.pg{font-size:12px;font-weight:600;color:#737373;padding:16px 0 6px;text-transform:uppercase;letter-spacing:.08em}
.prow{display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid #F2F2F2;font-size:15px}
.prow .lg{width:28px;height:28px}.prow span.n{flex:1;font-weight:600}.prow svg{color:#A3A3A3}
"""
def v1():
    cv = nav('CV') + f'''
<div class="hero"><div class="row"><img src="assets/pfp.png" alt=""><div class="who"><b>Hieu Nguyen</b><span>{ic('pin',13)}Hanoi, Vietnam</span></div></div>
<div class="kicker">Crypto · AI · Community</div>
<h1 style="margin-top:10px">Sharing <i>POVs</i> on Crypto and AI</h1>
<p>I believe AI is the future of knowledge work, robots are the future of manual labor, and crypto is the future of money.</p>
<div class="cta"><a class="pri">{ic('x')}Follow</a><a>{ic('tg')}Telegram</a><a>{ic('mail')}Email</a></div></div>
<div class="stats">{''.join(f'<div><b>{a}</b><span>{b}</span></div>' for a, b in STATS)}</div>
<div class="sec"><div class="kicker">01 — Experience</div><h2>What I've done</h2>
{''.join(f'<div class="job"><div class="y">{y}</div><div><b>{e(r)}</b><ul>{"".join(f"<li>{e(x)}</li>" for x in L)}</ul></div></div>' for y, r, L in EXP[:3])}</div>
<div class="sec"><div class="kicker">02 — Highlights</div><h2>Proof of work</h2>
<div class="rail">{''.join(f'<figure><img src="{s}" alt=""><figcaption>{e(c)}</figcaption></figure>' for s, c in HL[:2])}</div></div>
<div class="sec"><div class="kicker">03 — Available for</div><h2 style="margin-bottom:12px">Let's work</h2><div class="chips">{''.join(f'<span>{a}</span>' for a in AVAIL)}</div></div>'''
    rows = ''.join(f'<tr><td><b>{r["t"]}</b><small>{r["n"]}</small></td><td class="num">{f2(r["tge"])}</td>'
                   f'<td class="num">{f2(r["ath"])} <span class="mk">×{f2(r["ath"]/r["tge"])}</span></td><td class="num">{f2(r["atm"])}</td></tr>'
                   for r in reversed(VAL))
    mx = NARR[0][1]
    val = nav('Valuation') + f'''
<div class="ph"><div><div class="kicker">Altcoin watch</div><h1 style="margin-top:6px">Valuation</h1></div><div class="seg"><span class="on">VI</span><span>EN</span></div></div>
<div class="kpis"><div><span>Thị trường</span><b class="hi">Bình thường</b></div><div><span>Hệ số TGE</span><b class="num">×5.22</b></div><div><span>Phạt FDV≥300M</span><b class="num">×0.60</b></div></div>
<a class="btn">Dự đoán FDV TGE</a>
<div class="tbl"><div class="h"><b>8 TGE mới nhất</b><span>×VC FDV · mới → cũ</span></div>
<table><tr><th>Ticker</th><th>×TGE</th><th>×ATH</th><th>×Now</th></tr>{rows}</table></div>
<div class="sec"><div class="kicker">{ic('fire',12)} Narrative đang hot</div><h2 style="font-size:26px">Median ×TGE</h2></div>
<div class="bars">{''.join(f'<div class="bar"><span>{n}<br><small>{c} dự án</small></span><i style="width:{max(8, (x/mx)**.5*100):.0f}%"></i><b class="num">×{x}</b></div>' for n, x, c in NARR)}</div>
<div class="sec"><div class="kicker">{ic('alert',12)} Hero or Zero</div><h2 style="font-size:26px">×Now ≥ 15</h2></div>
<div class="hz">{''.join(f'<div><span><b>{t}</b><small>TGE {d}</small></span><span class="mk num">×{x}</span></div>' for t, d, x in HERO)}</div>'''
    tasks = ''.join(f'''<div class="task{' done' if i < 2 else ''}"><span class="cb">{ic('check',14) if i < 2 else ''}</span><div><p>{e(t)}</p>
<small>{logo(p)}{e(p["name"])} <span class="tag{' k' if p['g'] in ('LEARN','INCOME','S') else ''}">{LABEL[p['g']]}</span></small></div></div>'''
                    for i, (p, t) in enumerate(DAILY[:9]))
    groups = ''
    for g in ('S', 'A', 'B'):
        ps = [p for p in IDLE if p['g'] == g][:3]
        if ps: groups += f'<div class="pg">{GNAME[g]}</div>' + ''.join(f'<div class="prow">{logo(p)}<span class="n">{e(p["name"])}</span><span class="tag">{e(p["type"].lower())}</span>{ic("chev")}</div>' for p in ps)
    work = nav('Work') + f'''
<div class="ph"><div><div class="kicker">Thứ Bảy, 07/11</div><h1 style="margin-top:6px">Hôm nay</h1></div><div class="seg"><span class="on">VI</span><span>EN</span></div></div>
<div class="today"><div class="th"><b>Việc hằng ngày · {len(DAILY)}</b><span class="prog">2/{len(DAILY)}<i></i></span></div>{tasks}</div>
<div class="sec" style="padding-top:28px"><div class="kicker">Đang theo dõi</div><h2 style="font-size:26px;margin-bottom:4px">Dự án</h2></div>
<div class="plist">{groups}</div>'''
    return page('V1 Editorial', V1CSS, cv, val, work)

# ═════════════════════════════════════════════════════════════
# V2 BENTO: light grey background, white tiles radius 20, yellow accent tile
# ═════════════════════════════════════════════════════════════
V2CSS = """
.screen{background:#F2F2F0;padding:0 12px 32px}
.nav{display:flex;justify-content:space-between;align-items:center;margin:12px 0;padding:8px 8px 8px 12px;background:#fff;border-radius:999px}
.brand{display:flex;gap:8px;align-items:center;font-weight:700;font-size:15px}.brand img{width:28px;height:28px;border-radius:50%}
.nav nav{display:flex;background:#F2F2F0;border-radius:999px;padding:3px;font-size:13px;font-weight:600}
.nav nav a{padding:6px 11px;border-radius:999px;color:#737373}.nav nav a.on{background:#F5B301;color:#0A0A0A}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.t{background:#fff;border-radius:20px;padding:16px;position:relative;overflow:hidden}
.t.w{grid-column:span 2}.t.y{background:#F5B301}.t.k{background:#1A1A1A;color:#fff}
.lbl{font-size:12px;font-weight:600;color:#737373;display:flex;gap:6px;align-items:center;margin-bottom:10px}.t.y .lbl{color:#0A0A0A;opacity:.7}
.me{display:flex;gap:14px;align-items:center}.me img{width:64px;height:64px;border-radius:18px;object-fit:cover}
.me b{font-size:22px;display:block;letter-spacing:-.02em}.me span{font-size:13px;color:#737373;display:flex;gap:4px;align-items:center}
.tag-l{font-size:26px;font-weight:800;letter-spacing:-.03em;line-height:1.1;margin-top:14px}
.bio{font-size:14px;line-height:1.5;color:#525252;margin-top:8px}
.big{font-size:40px;font-weight:800;letter-spacing:-.04em;line-height:1}.cap{font-size:13px;margin-top:6px;line-height:1.35}
.soc{display:flex;flex-direction:column;gap:8px}.soc a{display:flex;gap:8px;align-items:center;font-size:14px;font-weight:600;padding:9px 12px;background:#F2F2F0;border-radius:12px}
.yr{display:flex;gap:10px;padding:10px 0;border-top:1px solid #F0F0F0}.yr:first-of-type{border:0;padding-top:0}
.yr span{font-size:12px;font-weight:700;background:#F2F2F0;border-radius:6px;padding:3px 7px;height:fit-content;white-space:nowrap}
.yr b{font-size:15px;display:block}.yr p{font-size:13px;color:#525252;margin-top:3px;line-height:1.4}
.ph{width:100%;height:150px;object-fit:cover;border-radius:12px;margin-bottom:8px}.phc{font-size:13px;font-weight:600}
.pill{display:inline-block;font-size:13px;font-weight:600;background:#F2F2F0;border-radius:999px;padding:7px 12px;margin:0 6px 6px 0}
/* val */
.hd{display:flex;justify-content:space-between;align-items:center;margin:4px 4px 12px}.hd h1{font-size:28px;font-weight:800;letter-spacing:-.03em}
.sw{display:flex;background:#fff;border-radius:999px;padding:3px;font-size:12px;font-weight:700}.sw span{padding:6px 10px;border-radius:999px;color:#737373}.sw .on{background:#0A0A0A;color:#fff}
.reg{font-size:22px;font-weight:800}.mini{display:flex;justify-content:space-between;font-size:13px;padding:6px 0;border-top:1px solid rgba(0,0,0,.12)}
.go{display:flex;justify-content:space-between;align-items:center;font-weight:700;font-size:15px}
.row{display:grid;grid-template-columns:64px 1fr 56px 56px;align-items:center;padding:10px 0;border-top:1px solid #F0F0F0;font-size:14px}
.row.h{border:0;font-size:11px;font-weight:600;color:#737373;padding-top:0}.row>:not(:first-child){text-align:right}
.row b{font-weight:700}.sp{display:flex;align-items:center;gap:6px;justify-content:flex-end}.sp i{display:block;height:6px;border-radius:9px;background:#F5B301}
.nr{display:flex;justify-content:space-between;align-items:baseline;padding:7px 0}.nr span{font-size:14px}.nr small{color:#737373;font-size:12px}.nr b{font-size:16px}
.hz b{font-size:30px;font-weight:800;letter-spacing:-.03em;display:block}.hz span{font-size:12px;opacity:.7}
/* work */
.ring{width:84px;height:84px;border-radius:50%;background:conic-gradient(#0A0A0A 0 22%,rgba(0,0,0,.15) 0);display:grid;place-items:center;position:absolute;right:16px;top:16px}
.ring:after{content:var(--c);background:#F5B301;width:64px;height:64px;border-radius:50%;display:grid;place-items:center;font-weight:800;font-size:18px}
.task{display:flex;gap:10px;align-items:flex-start;padding:10px 0;border-top:1px solid #F0F0F0;}.t .task:first-child{border:0;padding-top:0}.task{font-size:14px;line-height:1.4}
.cb{width:22px;height:22px;border-radius:50%;border:2px solid #D4D4D4;flex:none;display:grid;place-items:center}.done .cb{background:#0A0A0A;border-color:#0A0A0A;color:#F5B301}
.done p{color:#A3A3A3;text-decoration:line-through}.task small{font-size:12px;color:#737373;display:flex;gap:5px;align-items:center;margin-top:3px}
.lg{width:16px;height:16px;border-radius:50%;object-fit:cover;flex:none}.lg-txt{display:grid;place-items:center;background:#E5E5E5;font-size:10px;font-weight:700}
.chip{font-size:11px;font-weight:700;border-radius:6px;padding:1px 6px;background:#F2F2F0;color:#404040}.chip.k{background:#0A0A0A;color:#F5B301}
.pj{display:flex;flex-direction:column;gap:8px}.pj .lg{width:36px;height:36px;border-radius:10px}.pj b{font-size:15px}.pj small{font-size:12px;color:#737373}
.rk{position:absolute;top:14px;right:14px;font-size:12px;font-weight:800;background:#F2F2F0;border-radius:8px;padding:3px 8px}.rk.k{background:#0A0A0A;color:#fff}
"""
def v2():
    cv = nav('CV') + f'''<div class="grid">
<div class="t w"><div class="me"><img src="assets/pfp.png" alt=""><div><b>Hieu Nguyen</b><span>{ic('pin',13)}Hanoi, Vietnam</span></div></div>
<div class="tag-l">Sharing POVs on Crypto and AI</div><p class="bio">I believe AI is the future of knowledge work, robots are the future of manual labor, and crypto is the future of money.</p></div>
<div class="t y"><div class="lbl">Community</div><div class="big">500+</div><div class="cap">Telegram members grown from 0 in Q1 2026</div></div>
<div class="t"><div class="lbl">Say hi</div><div class="soc"><a>{ic('x')}Twitter</a><a>{ic('tg')}Telegram</a><a>{ic('mail')}Email</a></div></div>
<div class="t w"><div class="lbl">Experience</div>{''.join(f'<div class="yr"><span>{y}</span><div><b>{e(r)}</b><p>{e(L[0])}</p></div></div>' for y, r, L in EXP)}</div>
<div class="t"><img class="ph" src="{HL[0][0]}" alt=""><div class="phc">{HL[0][1]}</div></div>
<div class="t"><img class="ph" src="{HL[1][0]}" alt=""><div class="phc">{HL[1][1]}</div></div>
<div class="t w"><div class="lbl">Available for</div>{''.join(f'<span class="pill">{a}</span>' for a in AVAIL)}</div></div>'''
    mx = max(r['ath'] / r['tge'] for r in VAL)
    rows = ''.join(f'<div class="row"><b>{r["t"]}</b><span class="sp num">×{f2(r["ath"]/r["tge"])}<i style="width:{r["ath"]/r["tge"]/mx*60:.0f}px"></i></span>'
                   f'<span class="num">{f2(r["tge"])}</span><span class="num">{f2(r["atm"])}</span></div>' for r in reversed(VAL))
    val = nav('Valuation') + f'''<div class="hd"><h1>Valuation</h1><div class="sw"><span class="on">VI</span><span>EN</span></div></div><div class="grid">
<div class="t y"><div class="lbl">{ic('chart',13)}Thị trường</div><div class="reg">Bình thường</div><div style="margin-top:10px">
<div class="mini"><span>Hệ số TGE</span><b class="num">×5.22</b></div><div class="mini"><span>Phạt FDV≥300M</span><b class="num">×0.60</b></div></div></div>
<div class="t k"><div class="lbl" style="color:#A3A3A3">{ic('alert',13)}Hero or Zero</div>{''.join(f'<div class="hz" style="margin-bottom:10px"><b style="color:#F5B301">×{x}</b><span>{t} · TGE {d}</span></div>' for t, d, x in HERO)}</div>
<div class="t w"><div class="go"><span>Dự đoán FDV TGE</span><span class="chip k">{ic('arrow',14)}</span></div></div>
<div class="t w"><div class="lbl">8 TGE mới nhất</div><div class="row h"><span>Ticker</span><span>ATH / TGE</span><span>×TGE</span><span>×Now</span></div>{rows}</div>
<div class="t w"><div class="lbl">{ic('fire',13)}Narrative đang hot</div>{''.join(f'<div class="nr"><span>{n} <small>· {c} dự án</small></span><b class="num">×{x}</b></div>' for n, x, c in NARR)}</div></div>'''
    tasks = ''.join(f'''<div class="task{' done' if i < 2 else ''}"><span class="cb">{ic('check',12) if i < 2 else ''}</span><div><p>{e(t)}</p>
<small>{logo(p)}{e(p["name"])} <span class="chip{' k' if p['g'] in ('LEARN','INCOME','S') else ''}">{LABEL[p['g']]}</span></small></div></div>''' for i, (p, t) in enumerate(DAILY[:7]))
    pj = ''.join(f'<div class="t pj">{logo(p)}<span class="rk{" k" if p["g"]=="S" else ""}">{LABEL[p["g"]]}</span><b>{e(p["name"])}</b><small>{e(p["type"].lower())} · {"high" if p["pot"]=="high" else "low"}</small></div>'
                 for p in [x for x in IDLE if x['g'] in 'SABC'][:4])
    work = nav('Work') + f'''<div class="hd"><h1>Hôm nay</h1><div class="sw"><span class="on">VI</span><span>EN</span></div></div><div class="grid">
<div class="t w y" style="min-height:116px"><div class="lbl">Thứ Bảy · 07/11</div><div class="big" style="font-size:30px">{len(DAILY)} việc<br>hằng ngày</div><div class="ring" style="--c:'2/{len(DAILY)}'"></div></div>
<div class="t w">{tasks}</div>{pj}</div>'''
    return page('V2 Bento', V2CSS, cv, val, work)

# ═════════════════════════════════════════════════════════════
# V3 YELLOW BLOCK: yellow block behind black text, 2 px black border, hard shadow
# ═════════════════════════════════════════════════════════════
V3CSS = """
.screen{background:#FFFDF7;padding-bottom:32px;font-family:Inter,sans-serif}
h1,h2,.sg{font-family:'Space Grotesk',sans-serif}
.nav{display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-bottom:2px solid #0A0A0A;background:#fff}
.brand{display:flex;gap:8px;align-items:center;font-weight:700;font-family:'Space Grotesk';font-size:16px}.brand img{width:30px;height:30px;border:2px solid #0A0A0A;border-radius:8px}
.nav nav{display:flex;gap:4px;font-size:13px;font-weight:700}.nav nav a{padding:6px 9px;border:2px solid transparent;border-radius:8px}
.nav nav a.on{background:#F5B301;border-color:#0A0A0A}
.box{border:2px solid #0A0A0A;border-radius:14px;background:#fff;box-shadow:4px 4px 0 #0A0A0A;margin:16px 16px 0;overflow:hidden}
.y{background:#F5B301}.pad{padding:16px}
.hero{padding:20px 16px 18px}.hero .top{display:flex;justify-content:space-between;align-items:flex-start}
.hero img.p{width:76px;height:76px;border-radius:50%;border:2px solid #0A0A0A;object-fit:cover}
.badge{font-size:12px;font-weight:700;border:2px solid #0A0A0A;border-radius:999px;padding:4px 10px;background:#fff;display:flex;gap:4px;align-items:center}
.hero h1{font-size:40px;line-height:1;letter-spacing:-.03em;margin-top:14px}.hero h2{font-size:22px;margin-top:10px;line-height:1.15}
.hero p{font-size:14px;line-height:1.5;margin-top:8px}
.soc{display:grid;grid-template-columns:repeat(3,1fr);border-top:2px solid #0A0A0A}.soc a{display:flex;gap:6px;justify-content:center;align-items:center;
height:48px;font-weight:700;font-size:14px;background:#fff}.soc a+a{border-left:2px solid #0A0A0A}
.st{display:flex;align-items:center;gap:8px;margin:28px 16px 0;font-size:22px;font-weight:700}.st em{font-style:normal;background:#0A0A0A;color:#F5B301;font-size:13px;padding:2px 8px;border-radius:6px}
.job{padding:14px 16px;border-top:2px solid #0A0A0A}.job:first-child{border:0}.job .y2{display:inline-block;background:#F5B301;border:2px solid #0A0A0A;
border-radius:6px;font-size:12px;font-weight:700;padding:1px 7px;margin-bottom:6px}.job b{display:block;font-size:16px;font-family:'Space Grotesk'}
.job p{font-size:14px;line-height:1.45;margin-top:4px;color:#262626}
.hl{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:16px 16px 0}.hl .box{margin:0}.hl img{width:100%;height:110px;object-fit:cover;border-bottom:2px solid #0A0A0A}
.hl p{font-size:12px;font-weight:600;padding:8px 10px;line-height:1.35}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin:14px 16px 0}.chips span{border:2px solid #0A0A0A;border-radius:999px;padding:7px 12px;font-size:13px;font-weight:700;background:#fff;box-shadow:2px 2px 0 #0A0A0A}
/* val */
.ph{display:flex;justify-content:space-between;align-items:center;margin:20px 16px 0}.ph h1{font-size:30px;letter-spacing:-.02em}
.sw{display:flex;border:2px solid #0A0A0A;border-radius:10px;overflow:hidden;font-weight:700;font-size:13px}.sw span{padding:6px 10px;background:#fff}.sw .on{background:#F5B301}.sw span+span{border-left:2px solid #0A0A0A}
.kp{display:grid;grid-template-columns:1fr 1fr 1fr}.kp div{padding:12px}.kp div+div{border-left:2px solid #0A0A0A}.kp span{font-size:11px;font-weight:600;display:block}
.kp b{font-family:'Space Grotesk';font-size:22px}
.cta{display:flex;justify-content:space-between;align-items:center;padding:14px 16px;border-top:2px solid #0A0A0A;background:#0A0A0A;color:#F5B301;font-weight:700;font-family:'Space Grotesk';font-size:16px}
table{width:100%;border-collapse:collapse;font-size:14px}th{background:#F5B301;font-size:12px;font-weight:700;padding:10px 8px;text-align:right;border-bottom:2px solid #0A0A0A}
td{padding:10px 8px;text-align:right;border-bottom:1px solid #E5E5E5}th:first-child,td:first-child{text-align:left;padding-left:14px}tr:last-child td{border:0}
td b{font-family:'Space Grotesk'}.mk{background:#F5B301;font-weight:700;padding:0 4px}
.nb{display:flex;align-items:center;gap:10px;padding:9px 14px;border-top:1px solid #E5E5E5;font-size:14px}.nb:first-of-type{border:0}
.nb .r{width:24px;height:24px;border:2px solid #0A0A0A;border-radius:6px;display:grid;place-items:center;font-weight:700;font-size:12px}.nb .r.y{background:#F5B301}
.nb span{flex:1}.nb span.r{flex:none}.nb small{color:#737373}.nb b{font-family:'Space Grotesk'}
.hh{padding:12px 14px;border-top:2px solid #0A0A0A;display:flex;justify-content:space-between;align-items:center}.hh:first-of-type{border:0}
.hh b{font-family:'Space Grotesk';font-size:18px}.hh small{display:block;font-size:12px;color:#525252}.hh .x{font-family:'Space Grotesk';font-size:22px;font-weight:700}
.bh{padding:10px 14px;border-bottom:2px solid #0A0A0A;font-weight:700;display:flex;gap:6px;align-items:center;font-size:14px}
/* work */
.task{display:flex;gap:10px;padding:11px 14px;border-top:1px solid #E5E5E5;font-size:14px;line-height:1.4}
.cb{width:22px;height:22px;border:2px solid #0A0A0A;border-radius:6px;flex:none;display:grid;place-items:center;background:#fff}.done .cb{background:#F5B301}
.done p{text-decoration:line-through;color:#737373}.task small{display:flex;gap:5px;align-items:center;font-size:12px;font-weight:600;margin-top:3px}
.lg{width:16px;height:16px;border-radius:50%;border:1.5px solid #0A0A0A;object-fit:cover;flex:none}.lg-txt{display:grid;place-items:center;background:#fff;font-size:9px;font-weight:700}
.chip{font-size:11px;font-weight:700;border:1.5px solid #0A0A0A;border-radius:5px;padding:0 5px}.chip.k{background:#0A0A0A;color:#F5B301}
.bar{height:12px;border:2px solid #0A0A0A;border-radius:99px;background:#fff;overflow:hidden;margin-top:10px}.bar i{display:block;height:100%;width:22%;background:#0A0A0A}
.rk{display:flex;gap:6px;margin:16px 16px 0}.rk span{flex:1;text-align:center;border:2px solid #0A0A0A;border-radius:8px;padding:6px 0;font-weight:700;font-size:13px;background:#fff}.rk .on{background:#F5B301;box-shadow:2px 2px 0 #0A0A0A}
.pr{display:flex;align-items:center;gap:10px;padding:10px 14px;border-top:1px solid #E5E5E5}.pr:first-of-type{border:0}.pr .lg{width:30px;height:30px;border-width:2px}
.pr b{flex:1;font-size:15px;font-family:'Space Grotesk'}
"""
def v3():
    cv = nav('CV') + f'''
<div class="box y"><div class="hero"><div class="top"><img class="p" src="assets/pfp.png" alt=""><span class="badge">{ic('pin',13)}Hanoi, VN</span></div>
<h1>Hieu Nguyen</h1><h2>Sharing POVs on Crypto and AI</h2>
<p>I believe AI is the future of knowledge work, robots are the future of manual labor, and crypto is the future of money.</p></div>
<div class="soc"><a>{ic('x')}X</a><a>{ic('tg')}Telegram</a><a>{ic('mail')}Email</a></div></div>
<div class="st">Experience <em>5</em></div>
<div class="box">{''.join(f'<div class="job"><span class="y2">{y}</span><b>{e(r)}</b><p>{e(L[0])}</p></div>' for y, r, L in EXP[:4])}</div>
<div class="st">Highlights <em>6</em></div>
<div class="hl">{''.join(f'<div class="box"><img src="{s}" alt=""><p>{e(c)}</p></div>' for s, c in HL[:2])}</div>
<div class="st">Available for</div><div class="chips">{''.join(f'<span>{a}</span>' for a in AVAIL)}</div>'''
    rows = ''.join(f'<tr><td><b>{r["t"]}</b></td><td class="num">{f2(r["tge"])}</td><td class="num"><span class="mk">×{f2(r["ath"]/r["tge"])}</span></td><td class="num">{f2(r["atm"])}</td></tr>' for r in reversed(VAL))
    val = nav('Valuation') + f'''<div class="ph"><h1>Altcoin watch</h1><div class="sw"><span class="on">VI</span><span>EN</span></div></div>
<div class="box"><div class="bh y">{ic('chart',15)}Mặt bằng định giá</div><div class="kp"><div class="y"><span>Thị trường</span><b>Normal</b></div><div><span>Hệ số TGE</span><b class="num">×5.22</b></div><div><span>Phạt FDV</span><b class="num">×0.60</b></div></div>
<div class="cta"><span>Dự đoán FDV TGE</span>{ic('arrow',18)}</div></div>
<div class="box"><table><tr><th>Ticker</th><th>×TGE</th><th>ATH/TGE</th><th>×Now</th></tr>{rows}</table></div>
<div class="box"><div class="bh">{ic('alert',15)}Hero or Zero</div>{''.join(f'<div class="hh"><div><b>{t}</b><small>TGE {d}</small></div><span class="x mk">×{x}</span></div>' for t, d, x in HERO)}</div>
<div class="box"><div class="bh">{ic('fire',15)}Narrative đang hot</div>{''.join(f'<div class="nb"><span class="r{" y" if i==0 else ""}">{i+1}</span><span>{n} <small>· {c}</small></span><b class="num">×{x}</b></div>' for i, (n, x, c) in enumerate(NARR))}</div>'''
    tasks = ''.join(f'''<div class="task{' done' if i < 2 else ''}"><span class="cb">{ic('check',13) if i < 2 else ''}</span><div><p>{e(t)}</p>
<small>{logo(p)}{e(p["name"])} <span class="chip{' k' if p['g'] in ('LEARN','INCOME','S') else ''}">{LABEL[p['g']]}</span></small></div></div>''' for i, (p, t) in enumerate(DAILY[:7]))
    prs = ''.join(f'<div class="pr">{logo(p)}<b>{e(p["name"])}</b><span class="chip">{e(p["type"].lower())}</span><span class="chip k">{LABEL[p["g"]]}</span></div>' for p in [x for x in IDLE if x['g'] in 'SA'][:4])
    work = nav('Work') + f'''<div class="ph"><h1>Hôm nay</h1><div class="sw"><span class="on">VI</span><span>EN</span></div></div>
<div class="box y"><div class="pad"><div class="sg" style="font-size:13px;font-weight:700">THỨ BẢY 07/11</div><div class="sg" style="font-size:28px;font-weight:700;line-height:1.1;margin-top:4px">2 / {len(DAILY)} việc xong</div><div class="bar"><i></i></div></div></div>
<div class="box"><div class="bh y">Việc hằng ngày</div>{tasks}</div>
<div class="rk">{''.join(f'<span class="{"on" if g=="S" else ""}">{LABEL[g]}</span>' for g in ORDER)}</div>
<div class="box">{prs}</div>'''
    return page('V3 Yellow Block', V3CSS, cv, val, work)

for name, fn in (('v1', v1), ('v2', v2), ('v3', v3)):
    (D / f'{name}.html').write_text(fn(), encoding='utf-8')
print('built v1 v2 v3')

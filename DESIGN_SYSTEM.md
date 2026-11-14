# 0xhieu.xyz design rules (Bento v4)

Source: `repo_personal_design/tokens.json` → `export_web.py` → `web.css` → `design-tokens.css`. Product rules below were chosen by the owner and override the shared profile.

## Bento
- Canvas `#F2F2F0`. Tiles white, radius 20, no border, no shadow, gap 12 (mobile 10). Hairlines inside tiles `--hair #ECECEA`. Dark tile `#161616`. Accent `#F5B301`, never tinted.
- Each screen has at most 1 yellow tile and 1 dark tile. Radius only 20 / 10 / pill.
- Shadow only on floating things: navbar, toolbar buttons, cat button, popups. Buttons inside tiles and forms are flat.
- Navbar: floating white pill, active tab yellow. VI/EN: white track, black thumb, white text. Page title row sits directly on the canvas.
- Tile label: 14/600 grey + icon 16, no grey header strip.

## Type
Use `--ds-type-<name>-size/line/tracking` (`display`, `page`, `header`, `content`, `secondary`, `data`, `label`, `button`, `note`, `input`, `hero`). Never hand-write font-size px or override sizes in media queries; mobile (≤640) changes through the variables. Weights 400/600/700. Numbers tabular.

## Color roles
- Black: normal content. Muted text: `#525252`. No blue-tinted greys.
- Accent only for buttons, active controls, highlights; text on accent is black.
- Marker highlight (black 600 on accent, 4px side padding, square): ATH ratio, ticker with VC FDV ≥ 300M, ×TGE ≥ 13, main number in the Valuation boxes.
- Hover: text links get the marker; buttons turn accent with black text. Not for selected toggles or destructive buttons. Never bold-only.
- Red only for danger and destructive actions. Banned: `#B84A0C`, `#FEF5D9` (`tools/ds-audit.js` flags them).
- Disabled uses a lighter color, never opacity.

## CV
English only, tagline verbatim. 4-column grid desktop, 2 columns ≤1024: hero (span 2), yellow "500+ Community", "Say hi", Experience, Highlights (one tile per image), Available for.

## Valuation
- 3 boxes above the table: Valuation baseline = yellow, Hero or Zero = dark, Narrative = white. Box height 328; desktop 3 columns, tablet/mobile 2 equal columns; label left, value right; long bodies scroll inside.
- Table in a white tile, 8 rows visible, header 56, row 40. Keep TGE order old→new and auto-scroll the table (not the page) to the newest on open.
- Mobile never scrolls sideways: hide Narrative/TGE/ATL, ×ATH keeps only `peak (×N)`.
- ATH `start → end (×N)` on one line; N = end/start rounded to 2, same on client and server.
- One main narrative per project from: stablechain, layer-1, layer-2, infra, ai, zk, privacy, identity, rwa, defi, trading, payment, bitcoin, prediction, game, social, desci.
- Form: Fetch left, Save right, Delete separate. Fetch fills only empty fields with evidence, never writes KV.
- Toolbar stays on one row.

## Work
- Title `work-to-earn`. `work-to-earn` is lowercase; `grow-to-KOL` keeps KOL uppercase (2026-11-14).
- Full-width left/right toggle under the title, styled like VI/EN (white track, black selected, flat). Left "Projects & how to join" is the default; right "Task checklist".
- Projects: one white tile each, 2 columns (1 at ≤900): logo, name, potential + narrative tags, Website / X / Discord / Telegram chips, then Get started, Daily, Weekly. No logo → cat face.
- Checklist: yellow tile (date, count, ring), one list of today's tasks, then "Today's schedule". Row: 32px circle ticks; the rest of the row opens the link.
- Task form: 7 day pills (selected = accent); all form buttons flat.

## Layout
Frame max 1280 including padding (24 desktop, 16 mobile). Popup radius 16, inputs white.

## Checks
`python export_web.py` (design repo) → `python tools/sync-design-system.py` → `python tools/check-design-system.py --source D:/Files/Claude/repo_personal_design` → `node tools/ds-audit.js <url>`. The audit still reports many pre-Bento warnings; compare against production rather than expecting 0.

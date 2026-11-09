# HANDOFF: 0xhieu.xyz

Current state as of 2026-11-09. History: git and `docs/handoff-history-through-2026-11-02.md` (don't load by default).

## Ops
- Local `D:/Files/Claude/website_personal_0xhieu`, GitHub `KattyFury/website_personal_0xhieu`, branch `main`. Production https://0xhieu.xyz (Cloudflare Pages `0xhieu-xyz`, auto-deploys main). Push, then verify production.
- Pages: CV `/` (English only), Valuation `/valuation`, Work `/work` (VI/EN). `/airdrop` redirects to `/work`.
- `index.html`: UI/CSS/JS. `functions/api/`: `val.js` (Valuation), `val-fetch.js` (SURF/CoinGecko fetch), `private.js` (Work CRUD), `wte.js` (Work public). `functions/valuation.js`: SSR from KV for crawlers; formulas and markup must match the client.
- Design source: `D:/Files/Claude/repo_personal_design`; Figma https://www.figma.com/design/V0GuQUwipow6yFqNi4y7qg/hieu. Keep repo and Figma in sync. Rules: `DESIGN_SYSTEM.md`.
- Secrets: `D:/Files/Claude/.secrets/keys.env`; production uses encrypted bindings. `ADMIN_PASS`; SURF key is `SURF_API` locally, `SURF_API_KEY` at runtime. Never print or commit.
- Don't message anyone or send notifications to outside services.
- Don't add wrangler.toml (it would override dashboard bindings).

## Rules
- Requested changes: ship and QA production, no preview approval unless asked. New design directions: show options first.
- Don't change Valuation formulas for features or UI.

## Work
- Title `work-to-earn`. Full-width toggle: left Projects (default), right Checklist. State lives in `wteView`.
- **Projects:** groups Personal (l2g first, then w2e, S…C) → work-to-earn → Rank S…C. Each project is a tile: logo, name, potential tag (VI `Tiềm năng`/`Tiềm năng thấp`, EN `High/Low potential`), narrative, Website/X/Discord, then Get started, Daily, Weekly. Logo from unavatar with `?fallback=false`; missing or failed → `icon.png`. `TYPE_GROUPS` in `private.js` must match `WTE_TYPE_GROUP` in `index.html`.
- **Checklist:** one list of what falls on today, order l2g → personal → w2e → S…C; weekly rows carry a `weekly` tag. No days chosen: daily = every day, weekly = Mon + Tue. Circle ticks; rest of the row opens the link. Daily ticks reset daily, weekly ticks last the week. Ticks are in localStorage (`wte-done`, `wte-done-week`, last 2 periods), this device only; no cross-device sync.
- **Schedule:** each task has optional `days` (1=Mon … 7=Sun) + `time` (HH:MM), **always stored in GMT+7**. Legacy `dow` is read and becomes `days` on save. VI shows and edits GMT+7, EN shows and edits UTC; crossing midnight shifts the weekday. "Today" follows the viewer's language clock, not the machine. "Today's schedule" lists today's timed tasks: next = yellow, overdue = red, done = struck. Web only, no Telegram/push.
- **Form:** potential and type required. KV stores `Learn-to-Grow`/`Work-to-Earn`, display is lowercase.
- l2g: type `Learn-to-Grow`, no rank, defaults to personal.

## Valuation
- Formulas: `vcFDV = fundraising / (vcAlloc/100)`; `×TGE = priceTGE × totalSupply / vcFDV`; `×ATM = currentPrice / (vcFDV/totalSupply)`.
- **Valuation baseline:** market condition = median of the 6 latest raw ×TGE (Weak <4.3, Normal 4.3–<13, Strong ≥13). Coefficient = median of the 6 latest normalized for high FDV; if the 6th TGE is >60 days from the 1st, use 4. FDV ≥ $300M penalty: Weak separate, Normal + Strong together; tag history by the previous 6 TGEs; high-FDV divided by low-FDV median of the same regime; k = median ratio, needs ≥5 high-FDV. Don't change thresholds or windows. Calculator keeps `predictFDV()` Model D.
- **Hero or Zero:** ×ATM ≥ 15, newest TGE first. Never claim VC/team is selling. TGE < 30 days badge is only a time fact.
- **Trending Narratives:** median raw ×TGE by main narrative, TGE ≥ 2025-02-01, no sample filter.
- Camera (html2canvas-pro, don't revert) captures title + 3 boxes only.
- Fetch fills only empty fields with evidence, never auto-saves, never guesses VC allocation or priceTGE. POST `narratives` validates the whole batch and changes only narrative.
- KV `WORK`: `val-projects` (admin), `val-prices` (bot), `personal-tasks`. Project fields: ticker/tgeDate/narrative/fundraising/vcAlloc/totalSupply/priceTGE/cgId/binanceSymbol.
- Price bot: Docker on `ssh vps`, `/opt/val-price-bot`, container `val-price-bot`. Pushing the site does not update it. It must not touch priceTGE. See `bot/README.md`.

## Admin
"Remember this device" issues a 400-day HttpOnly cookie token (`cvAdminDevice`), hash stored at KV `admin-device:<hash>` (`functions/_lib/admin-auth.mjs`). Revoke one device: delete its key. Revoke all: change `ADMIN_PASS` and update the bot on the VPS. Bot keeps using `ADMIN_PASS`.

## Testing
- `node --test tests/*.mjs`; design checks in `DESIGN_SYSTEM.md`.
- Admin flows locally only: `npx wrangler@4 pages dev . --port <free> --kv WORK --binding ADMIN_PASS=test --persist-to <temp dir>`. On Windows, stopping the shell leaves wrangler/workerd alive and they respawn: stop them by command line, parents first.

## Open
- Font: proposed loading Inter so all devices match; owner hasn't answered.
- Pre-TGE airdrop dashboard: discussion only, see `docs/SURF_PRE_TGE_DASHBOARD.md`. Don't build without a decision.
- Admin popups have not been visually reviewed since the 11-04 tone change.
- unavatar sometimes fails for projects that have an X logo, so those show the cat; cause not confirmed.

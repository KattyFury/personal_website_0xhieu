# CLAUDE.md

Personal site 0xhieu.xyz (repo `website_personal_0xhieu`). Current state: `HANDOFF.md`. Design rules: `DESIGN_SYSTEM.md`.

## Positioning (use verbatim, never translate or rewrite)

> ### Sharing POVs on Crypto and AI

Applies to `.hero-tagline`, meta description, `og:title` / `og:description` / `og:image:alt`, JSON-LD `description`, `og.png`, and any other profile. The CV tab and meta tags are always English. Vietnamese appears only on tabs with a VI/EN toggle (Valuation, Work).

## Owner

Vietnamese vibecoder, not a programmer; builds by handing off to AI. Learns by building, decides fast, pushes back fast. Other projects (ezwallet, bots) live in separate repos: never pull their assets, code or secrets here.

## Stack

- `index.html`: HTML + component CSS + inline JS. `design-tokens.css` is generated from `repo_personal_design`.
- Cloudflare Pages project `0xhieu-xyz`, auto-deploys `main`. No smart contracts.
- Backend is only the Pages Functions in `functions/api/`, sharing KV binding `WORK` and `ADMIN_PASS` (Cloudflare Dashboard, never in the repo). Reads are public; writes need the password or a remembered-device token.
- `bot/`: Node job in Docker on the VPS (`/opt/val-price-bot`), writes daily prices to KV.
- Calculation logic lives in `index.html` JS; KV keeps raw data only.
- A new API key or backend for a public feature is almost certainly a misunderstanding.
- Look at real data before writing code that reads it (`curl https://0xhieu.xyz/api/val`).

## Working with me

- Reply in English, short, no filler. Explain jargon inline. Multiple approaches: show options. Not sure: say so.
- State assumptions first. Stay in scope; every changed line traces to the request. Don't refactor working code or delete unrelated dead code; remove orphans you create.
- Ask before big refactors or architecture changes. Simplest code first.
- Verify for real (real data, open the page). When I ask for a change, ship it and QA production; don't ask me to review a preview unless I ask for one.
- New layout or design directions: show options first.
- No secrets in the repo. Keep `HANDOFF.md` current after each session and delete what is stale.

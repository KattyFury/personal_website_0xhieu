# HANDOFF — 0xhieu.xyz (repo `website_personal_0xhieu`, tên cũ `cv`)

**Chốt trạng thái:** 2026-11-01

Work là thẻ độc lập theo hướng Linear đã duyệt, desktop2/mobile1 (≤900px), DAILY nền vàng nhạt, viền cam4px + nhãn/task cam đậm600; giữ nội dung/link/admin. Valuation/Work dùng chung token workspace: radius8, header cam #FFA111/chữ đen/viền line, thân box xám #ECF0F8, padding ngang12/section dọc8/khe12. Chữ thường đen, chữ phụ xám, chữ quan trọng cam đậm #B84A0C/600; nút dùng cam thường. Tone xanh cũ đã bị user rút lại. CV/Valuation/Work/navbar/footer cùng max-width1280px gồm padding. Các thay đổi bố cục/kích thước tiếp theo phải trình user duyệt trước; user không muốn duyệt preview, cần kiểm tra trang thật.

CV cũng dùng component chung: social buttons trắng, Highlights và nhãn Available-for xám, cùng radius8/viền line; bỏ vòng màu avatar và đường kẻ dài tiêu đề section. Giữ profile spacious: hero top96/48, section gap64/32, body16/24; không áp density của Work vào CV. Available-for được wrap để không tràn320px.

**Bóng đã được user chốt lại:** nút/action icon bấm được dùng `0 2px 8px rgba(0,0,0,.32)` trên cả3 trang. Thẻ/nhãn chỉ đọc, tooltip, ảnh lightbox, popup content và nút disabled không bóng. Tab nav/link chữ giữ kiểu text. CSS chung hiện là `button:not(.nav-btn), .social-btn, .wte-social`; không khôi phục rule `box-shadow:none` ghi đè nút. Nguồn nằm tại `products.0xhieu-xyz.sharedComponents`; quy tắc overlay-only cũ đã bị thay thế.

**Mốc bàn giao production:** website `06e334f` (shadow), trước đó `6160b7c` (CV), `60c914f` (shared workspace). Repo design system `D:\Files\Claude\repo_personal_design`, main `20f2bee`; đã push cả hai repo. Không còn thay đổi giao diện chưa deploy hay server/script/ảnh QA tạm cần giữ.

**Kiểm chứng đã hoàn tất:** Work/Valuation12 trạng thái browser320–1920 (radius8/header trắng/padding12/frame1280; Valuation8 hàng/panel328; Work desktop2/mobile1). CV9 chiều rộng320–1920 (đủ nội dung/4 section/3 social links, spacing spacious, không clipping/page overflow). Audit3 trang và popup:0 lỗi. Production Chrome1440/390 xác nhận cả3 trang dùng shared component; sau bản shadow, QA9 trạng thái local của3 trang ở1440/390/320 kiểm đúng bóng trên nút và không bóng trên read-only/disabled, gồm nút popup; HTML production đã xác nhận rule shadow mới. Không gọi POST ghi dữ liệu hay thay backend/công thức.

**Cách làm tiếp:** không yêu cầu user xem preview để xác nhận kết quả; tự kiểm tra browser thật và production sau deploy. Không tự sáng tác bố cục/kích thước mới: thay đổi hướng thiết kế phải trình phương án cho user chốt trước. Khi đã được yêu cầu sửa/deploy, thực hiện hết phạm vi được duyệt, không để sót CV rồi báo đã chuẩn hóa toàn site.

Design system v3: nguồn repo_personal_design → design-tokens.css có hash, sync/check bằng tools/sync-design-system.py và tools/check-design-system.py. CV editorial/spacious; Valuation data/compact; Work task/compact tại /work (/airdrop301). Valuation giữ8 token mọi màn hình, header chung56, row40, cộng viền/scrollbar; ba box cố định328, mobile2 cột bằng nhau; ATH một hàng; nhãn trái/số phải. Quy tắc đầy đủ ở DESIGN_SYSTEM.md, không dùng các log thiết kế cũ để ghi đè hiện trạng.
**Repo:** https://github.com/KattyFury/website_personal_0xhieu · **Local:** `D:\Files\Claude\website_personal_0xhieu` (thư mục đổi tên từ `cv` 10-05; máy khác còn tên cũ thì đổi theo)
**Live:** Cloudflare Pages, project **`0xhieu-xyz`** (khác tên repo) — auto-deploy từ `main`.

> File này chỉ ghi **sự thật hiện tại** + **luật/bẫy còn hiệu lực**. Lịch sử cũ (log quyết định từ 06/2026) nằm trong git history của file này, trước commit dọn repo 2026-09-24.
> Sửa code xong: cập nhật đúng mục liên quan + thêm 1 dòng vào **Nhật ký** cuối file. Không thêm mục "HANDOFF mới nhất" kể lể.

---

## 1. Repo có gì

```
index.html            — HTML + component CSS + JS inline; token CSS dùng design-tokens.css
functions/api/        — Cloudflare Pages Functions, backend DUY NHẤT
  val.js              — GET công khai / POST cần ADMIN_PASS: dự án Valuation (+ giá từ bot)
  wte.js              — GET công khai: card Work to Earn đang public
  private.js          — POST cần ADMIN_PASS: CRUD card Work (cá nhân + public)
functions/valuation.js — route /valuation: điền sẵn Low/High ×N, Market condition + bảng altcoin vào HTML
                       (chỉ đọc KV) để AI/bot tải trang là đọc được. Công thức CHÉP từ index.html — sửa bên này phải sửa bên kia
bot/                  — job lấy giá hằng ngày, chạy Docker trên VPS `/opt/val-price-bot` (xem bot/README.md)
_redirects            — SPA fallback: /* → /index.html
design-tokens.css     — bản CSS export v3 từ repo_personal_design, sync bằng tools/sync-design-system.py
tools/ds-audit.js     — gác cổng design system (xem §7)
tools/og-gen.html     — nguồn vẽ og.png (ảnh preview khi share link)
DESIGN_SYSTEM.md      — luật thiết kế (màu, chữ, lưới, thành phần). ĐỌC trước khi đụng giao diện
highlights.txt + highlights/   — ảnh + caption mục Highlights ở CV
icon.png              — favicon + nút mèo + logo navbar
pfp.png · og.png      — avatar hero · ảnh preview khi share link (1200×630)
camera.svg · plus.svg — 2 icon Lucide tô bằng CSS mask (nút chụp ảnh, nút thêm dự án)
html2canvas-pro.min.js — DOM→PNG cho nút camera (fork html2canvas, đọc được color-mix/color(); bản gốc 1.4.1 lỗi). Để trong repo, không CDN, lazy-load khi bấm. Mobile → bảng chia sẻ (Lưu vào Ảnh), desktop → hộp thoại lưu mở ở Desktop
```

Secret: `ADMIN_PASS` đặt ở Cloudflare Dashboard; bot dùng `bot/.env` (gitignore). **Không có secret nào trong repo.**

## 2. Ba tab

| Tab (nav) | Route | Nội dung | Ngôn ngữ |
|---|---|---|---|
| CV | `/` | Hero · Experience (timeline) · Highlights · Available for | **Tiếng Anh cố định** |
| Valuation | `/valuation` | Tiêu đề "Quan sát altcoin" (EN "Altcoin watch") · Bảng altcoin 7 cột + 3 box phân tích | Toggle VI/EN, mặc định VI |
| Work | `/work` | Tiêu đề "Danh sách công việc" (EN "Task list") · card theo nhóm work-to-earn / rank + thanh lọc `$ S A B C` | Toggle VI/EN |

Nút mèo góc dưới phải (cả 3 tab) = **Agent**, mới có vỏ ("coming soon"). Agent là dự án riêng, sẽ ở chung repo với bot.

## 3. Data

```
Cloudflare KV `WORK` (namespace b8fab2f8a83f45f0a023d2ba3ce78cde)
  ├─ val-projects    ← admin (POST /api/val)      data nhập tay
  ├─ val-prices      ← bot   (chỉ trường giá)     atm · ath · athDate · atl · atlDate
  ├─ personal-tasks  ← admin tab Work
  └─ ai-posts        ← data cũ của tab AI (đã bỏ tab 10-23, key còn nằm đó, không ai đọc)
```

- Cả 3 endpoint dùng **chung KV `WORK`** và **chung 1 mật khẩu `ADMIN_PASS`**, kiểm tra ở server. Mở khoá ở tab nào thì cả 2 tab admin (Valuation · Work) cùng mở; mật khẩu giữ trong `sessionStorage`. Mở khoá xong, nút Admin ở cả 2 tab đổi thành nút [+] (class `is-plus`, icon `plus.svg`) — Valuation: mở danh sách dự án · Work: thêm task.
- **Không còn đọc Google Sheet ở đâu cả** (từ 2026-09-22).
- Nguồn ngoài còn lại, gọi thẳng từ client, không key: **Google Translate gtx** (dịch VI→EN tab Work) · **unavatar.io** (logo card Work).

### `val-projects` — 1 dự án

`ticker` (khoá chính, viết hoa) · `tgeDate` · `narrative` (1 trong 15 slug) · `fundraising` (USD) · `vcAlloc` (%) · `totalSupply` · `priceTGE` · `cgId` · `binanceSymbol`. **7 trường đầu bắt buộc**, thiếu thì server chặn lưu.

### Luật của `val.js`

- **Không lưu bội số nào** (×TGE, ×ATL, ×ATH, ×ATM) — client tự tính lúc render, một nguồn duy nhất.
- **`priceTGE` không bao giờ bị bot ghi.** Action `prices` có whitelist: chỉ nhận `atm · ath · athDate · atl · atlDate · updatedAt`.
- Narrative lạ → để trống cho admin sửa, không nhét bừa vào nhóm (lệch median box Narrative).

### Bot (`bot/`)

Chạy 1 lượt lúc khởi động, rồi mỗi ngày lúc `RUN_AT_HOUR` (mặc định 2h VN). CoinGecko → `atm/ath/athDate`; Binance klines → `atl` = đáy thấp nhất trong **[ngày lên sàn → ngày ATH]**, đã bỏ nến ngày lên sàn. Chạy trên **VPS Vietnix 103.90.224.64** (`ssh vps`), container `val-price-bot`, thư mục `/opt/val-price-bot` (từ 2026-10-15; trước đó ở PC nhà). Không chạy trên Cloudflare Worker/Apps Script vì **Binance trả HTTP 451** cho server một số nước — IP VPS VN gọi Binance spot+futures OK.

- **Ghi bằng `ADMIN_PASS`** (`/opt/val-price-bot/.env`, quyền 600; trên VPS không có token Cloudflare). Đổi mật khẩu admin trên Cloudflare → phải sửa cả file secret chung lẫn `.env` VPS rồi `docker compose up -d --force-recreate` (`restart` không nạp lại `.env`).
- **Dự án mới thiếu ×ATH/×ATL/×ATM (hiện "—")** → xem `updatedAt` trong `/api/val` trước, đừng nghi logic trang. Bot chỉ có giá cho dự án đã tồn tại lúc nó chạy; muốn có ngay: `ssh vps 'cd /opt/val-price-bot && docker compose restart'` (khởi động là chạy 1 lượt). Log: `ssh vps docker logs --tail 20 val-price-bot`.
- Push GitHub **không** cập nhật bot trên VPS — xem `bot/README.md`.

## 4. Valuation — công thức

```
vcPrice = fundraising / (vcAlloc/100) / totalSupply
×TGE = priceTGE / vcPrice      ×ATM = atm / vcPrice
×ATH = ath / vcPrice           → ATH trong vòng 7 ngày sau TGE (hoặc bot đặt cờ athWick) = ca ĐẶC BIỆT:
                                 hiện "×TGE → ×ATH", 2 số tô cam (.ath-early). Thiếu ngày/ath → "—"
×ATL = atl / vcPrice           (đáy trước ATH, hiện trong ô ×ATH dạng "đáy → đỉnh")
vcFDV = fundraising / (vcAlloc/100)
```

- **Bảng 7 cột:** Ticker · Narrative · TGE · ×TGE · ×ATH · ×ATL · ×ATM. Ticker **đậm = vcFDV ≥ $300M**. Ô số bỏ dấu `×`, dấu thập phân theo ngôn ngữ; ×ATM 3 số lẻ, còn lại 2.
- **Cột 176 + khe 16 nhét trong padding ô** (184 · 192×5 · 184 = 1328), khai bằng % để co theo màn. Đừng chia đều 1328/7, đừng kéo giãn cột.
- Bấm tiêu đề màn → popup bảng dài (clone thead/tbody của bảng). JS đo `--ck1..7` để mỗi cột trong popup thẳng mép trái.
- **Box "Hệ số TGE gần đây"** (chốt 2026-10-27, bỏ 2 dòng FDV thấp/cao): 4 ô = **Hệ số TGE** · **Phạt FDV ≥ $300M** · Điều kiện thị trường · nút Dự đoán.
  - **Mức phạt k đi theo điều kiện thị trường HIỆN TẠI** (`fdvPenalty(entries, level)`). Data toàn lịch sử: TGE lúc Weak phạt ×0.25 (10 dự án lớn), Normal ×0.61 (4), Strong ×0.60 (3) → Weak 1 nhóm, **Normal + Strong gộp**. Mỗi TGE gắn điều kiện lúc nó ra = median ×TGE 6 TGE ngay trước (cùng luật box). Mỗi dự án lớn chia median dự án nhỏ **cùng điều kiện** (Strong mặt bằng ×13, Normal ×4.7 — gộp thô rồi chia sẽ ra ×0.28, sai), k = median các tỉ số. Dùng **toàn bộ lịch sử** (Normal/Strong chủ yếu 2023–2024). Cần ≥ 5 dự án lớn (`PENALTY_MIN_HIGH`), thiếu → "—", không phạt. 10-27: thị trường Normal → ×0.60 (7 dự án: SEI, STRK, EIGEN, SCR, IP, BABY, SENT).
  - **Đừng quay lại 1 k gộp từ 2025** (bản đầu 10-27, ra ×0.38): 10/13 dự án lớn từ 2025 TGE lúc Weak → phạt quá nặng khi thị trường đã Normal (user bắt lỗi). **Đừng dùng cửa sổ trượt** (6 gần nhất / từng nửa năm): dự án lớn hiếm dần, 0–5 mẫu mỗi nửa năm → k nhảy lung tung. **Đừng phạt trơn theo log FDV:** dưới $300M ×TGE phẳng (~×4 cho cả $50M lẫn $250M), chỉ tụt ở ngưỡng $300M.
  - **Hệ số TGE** = median 6 TGE gần nhất (thứ 6 cách >60 ngày → 4), ×TGE dự án FDV cao chia k trước (`normMultiple()`) để không kéo tụt hệ số chung.
  - Market condition = median ×TGE **thô** của 6 deal gần nhất: Weak <4.3 · Normal 4.3–13 · Strong ≥13.
- **Dự đoán FDV TGE:** `predictFDV()` lấy mọi dự án với ×TGE đã quy chuẩn như trên; dự án đang đoán có vcFDV ≥ $300M → nhân k (theo điều kiện đang hiện trên box) vào kết quả (VD 10-27: $66.7M ×4.83, $299M ×4.85, $400M ×2.88).
- **Vùng nguy hiểm:** ×ATM ≥ 15, TGE mới nhất lên đầu; TGE < 30 ngày → badge "⚠ FAKE PUMP".
- **Narrative đang hot:** mọi narrative có data từ 02/2025, xếp theo **median ×TGE** (không dùng ×ATH — 1 coin pump muộn kéo cả nhóm), kèm `SL:nn` số deal.
- 3 box = dòng danh sách nhãn trái · giá trị phải (`.list-row`). Vùng nguy hiểm/Narrative luôn vẽ đủ 4 dòng (`padRows()`), thừa thì cuộn. Tiêu đề box kiêm nút mở popup giải thích.
- **Admin:** nút Admin (đã mở khoá = [+]) mở danh sách dự án (chỉ data nguồn); bấm dòng danh sách hoặc dòng bảng → form sửa. `ticker` khoá khi sửa. Ô vốn/supply nhận viết tắt `6.8M` / `10B` (`parseSupply()`). Xoá hỏi lại 1 nhịp ("Chắc chưa?" 4 giây).

## 5. Work — luật rank

- Card có `twitter` + `discord` + `website` (link http/https, `private.js` lọc, gõ thiếu `https://` thì tự thêm). Header: icon X/Discord bên phải hàng 1; dự án chưa nhập Discord thì ẩn icon. **Bấm tên dự án → `website`** (không phải X); chưa nhập Link dự án thì tên không bấm được. Nhập ở popup admin task.
- Chữ task (`.wte-task-text`) luôn hiện đủ, xuống dòng bao nhiêu cũng được — **cấm cắt "…"** (user chốt 10-28).

- **Form task (admin):** ô Rank bắt buộc trừ Work-to-Earn — dòng đầu chỉ là gợi ý "Chọn rank" (không chọn được, KHÔNG có lựa chọn "—"); chọn phân loại Work-to-Earn thì ô Rank ẩn hẳn. Card Work-to-Earn không hiện thẻ rank.
- Thang: **`$` (INCOME) · S · A · B · C**. `$` không phải rank — suy từ thẻ `Work-to-Earn` qua `groupOf()`. `groupOf()` còn map rank cũ `SS` → `S`.
- Khai **1 chỗ**: `WTE_GROUPS` · `WTE_RANKS` · `RANK_LABEL` (mục "AIRDROP — Work to Earn" trong `index.html`). Dropdown admin đổ bằng JS từ đó.
- `WTE_TYPES` là nguồn duy nhất cho thẻ phân loại: vừa là dropdown admin, vừa là thứ tự card trong mỗi nhóm (`typeOrder()`).
- Card cùng rank dàn 2 cột, khác rank cách 48. Mỗi nhóm có tiêu đề (không kẻ mảnh): "work-to-earn" (nhóm $) · "Rank: S/A/B/C" (`groupLabel()`). KV lưu `potential` 1–3, client quy đổi `≥2 = high-potential`.

## 6. Luật bắt buộc

- **Ngôn ngữ:** tiếng Việt CHỈ ở tab có toggle (Valuation · Work) + tài liệu nội bộ. Tab CV + mọi thẻ meta/og/JSON-LD luôn tiếng Anh. Dịch nhãn UI tĩnh (`VAL_HEAD_LABELS` · `VAL_PLACEHOLDERS` · `VAL_TITLES`), **không dịch data** (ticker, narrative, số). Tab Work bản EN: dịch (Google gtx, `translateToEN()`) nội dung task của card public **và** task cá nhân, cùng tên card nếu tên có dấu tiếng Việt (tên dự án giữ nguyên); Google lỗi thì không đánh dấu đã dịch → bấm EN lần sau dịch lại.
- **Châm ngôn, nguyên văn mọi nơi:** `Sharing POVs on Crypto and AI`. Câu niềm tin có **2 bản cố ý**: bản dài 3 vế ở hero CV, bản ngắn *"AI is the future. Crypto is the money of the future."* ở meta/og/JSON-LD/`og.png`. `jobTitle` JSON-LD giữ "Builder + Contributor".
- **Đổi `og.png` phải bump `?v=`** (đang `?v=7`) — X/Telegram cache theo URL. Nguồn vẽ: `tools/og-gen.html` (1200×630) — render bằng Chrome headless đúng 1200×630 (vd script `C:\tmp\cvshot\shot.js file:///D:/Files/Claude/website_personal_0xhieu/tools/og-gen.html og.png 1200 630`).
- **Client ↔ server phải khớp:** `WTE_RANKS` ↔ `RANKS` (`private.js`). Lệch là server âm thầm ép về mặc định.
- **Hàng đầu mỗi tab:** tiêu đề TRÁI, nút PHẢI (flex). Riêng Valuation trên mobile ≤ 640: tiêu đề trọn hàng trên, cụm nút xuống hàng dưới canh phải. Không quay lại kiểu tiêu đề canh giữa + nút absolute. Tiêu đề dài thì cho xuống 2 dòng, đừng rút ngắn câu. **Mobile: KHÔNG cắt "…"** — `fitIntroTitles()` thu nhỏ chữ từng 1px (sàn 10px) cho vừa 2 dòng; chạy lại khi đổi ngôn ngữ + khi bề ngang `.val-intro` đổi (ResizeObserver).
- **Popup + ô nhập trên mobile (sửa 2026-10-24, user báo "bể khung, nhảy chữ"):** mở popup phải khoá cuộn trang nền (`html:has(.wl-modal-backdrop.open)`); nền mờ `overflow-y: auto`, popup `margin: auto` (đừng quay lại `align-items: center` — popup dài lòi khỏi mép trên khi bàn phím bật); chiều cao trong popup dùng `svh`; viewport có `interactive-widget=resizes-content`; không đặt `scroll-behavior: smooth` cho cả trang. Kiểm bằng script đo popup ở 390×844 và 390×460 (giả lập bàn phím).
- **Thanh cuộn:** mọi vùng cuộn dùng `.thin-scroll`. **Không set `scrollbar-width`/`scrollbar-color` cho Chromium** — từ bản 121 chúng tắt hết `::-webkit-scrollbar`.
- **Icon tô bằng CSS mask → mask đặt ở `::before`**, không trên nút (Chromium hit-test theo vùng mask). Icon mới thì dùng SVG inline (`wteIcon()`), không dùng mask.
- **Nút camera dùng `html2canvas-pro`, ĐỪNG quay về html2canvas gốc** — bản 1.4.1 ném "unsupported color function color" vì CSS có `color-mix()` (nút hỏng hẳn tới 10-05). Lưu ảnh: mobile (`pointer: coarse`) → `navigator.share` (Lưu vào Ảnh); mất user-gesture → popup `#shot-modal` bấm thêm 1 lần. Desktop → `showSaveFilePicker({startIn:'desktop'})` mở NGAY lúc bấm, trước khi vẽ; không có API đó → tải về.
- **html2canvas không vẽ được CSS mask.** Nút camera chụp `.val-wrap` và bỏ qua `.val-head-ctrl` (chỗ duy nhất có mask). Thêm mask vào vùng chụp là ra ô đặc.
- **Không dùng `wrangler.toml`** — nó khoá dashboard thành chỉ-đọc, rủi ro mất `ADMIN_PASS`.

## 7. Kiểm tra trước khi push

- **Giao diện: chạy `node tools/ds-audit.js <url>`** — đo computed style mọi phần tử 3 tab × desktop/mobile + popup, so với DESIGN_SYSTEM.md. Kết quả đúng là `TỔNG: 0`. Đừng soát design system bằng mắt (đã sót nhiều lần, 2026-10-24).
- JS: tách script inline ra rồi `node --check`. JSON-LD: `json.loads`.
- CV: regex dấu tiếng Việt trên vùng `#cv-view` phải ra 0.
- Giao diện: chụp thật. **`chrome --headless --window-size=390,...` KHÔNG ra mobile thật** (Windows không cho cửa sổ < ~500px, ảnh bị cắt trông như tràn ngang) → dùng puppeteer `setViewport` hoặc nhét trang vào iframe rộng 390.
- `python -m http.server` không có SPA fallback (`/valuation` → 404). Dùng server có fallback, hoặc chụp production sau deploy.
- Test có KV + mật khẩu thật: `npx wrangler pages dev . --kv WORK --binding ADMIN_PASS=...`

## 8. Cloudflare

Account `f9df99b7751b7dc3c80a22b6911c6f2b`, project Pages `0xhieu-xyz`. API token (Pages · KV · DNS · Cache) = `CF_API_TOKEN` trong file secret chung `D:\Files\Claude\.secrets\keys.env` (không in ra). Env var + binding chỉ ăn từ **lần deploy kế tiếp**.

## 9. Việc còn treo

1. **Agent (nút mèo)** — mới có vỏ.
2. **`potential` trong KV vẫn là số 1–3** — nên migrate sang `high`/`low` cho đúng kho.
3. **Rank `SS` còn sót trong KV** — đang hiện ở nhóm S nhờ `groupOf()`; sửa tay qua popup admin rồi bỏ shim.
4. **Làm tab Valuation dễ hiểu cho số đông** (hướng đã chốt: diễn giải ngay trong box — con số nói gì, ngưỡng nào tốt/xấu). Chưa làm.
5. Ảnh mới cho Highlights: nén WebP ~750×500, dưới ~150KB, tên khớp `highlights.txt`.

---

## Nhật ký

- 2026-11-01: **User đổi lại đen–cam, DAILY và toggle:** cam đậm#B84A0C cho text quan trọng, cam thường#FFA111 cho nút/header chữ đen; thân box xám. DAILY nền vàng nhạt, viền trái cam4px, task chữ cam đậm600, giữ căn trục bằng padding. VI/EN Work/Valuation thay2 nút tròn bằng1 native button role=switch, aria-checked, thumb trượt; click/Space/Enter, shadow1control, desktop80×40/mobile64×32. Logic dịch giữ nguyên; rank filter không đổi. Tone xanh và log hai nút trước đó hết hiệu lực.

- 2026-11-01: **Tone xanh–trắng–đen–xám theo user:** thân box mist, header cobalt/chữ trắng; chữ thường đen, phụ xám, quan trọng blue-strong/600. DAILY xanh nhạt; primary/selected xanh trắng; hover header giữ trắng. Thay alias amber bằng accent, audit loại cam/vàng khỏi palette UI. Giữ đỏ cho danger/destructive, geometry/data/framework/Fetch/shadow không đổi. Các log cam/header trắng trước đó hết hiệu lực.

- 2026-11-01: **Fetch production:** bổ sung `COINGECKO_API_KEY` demo dưới dạng secret_text vì public CoinGecko từ Cloudflare bị giới hạn. Key chỉ gửi server-to-server qua header; không ra frontend. SURF_API_KEY và các env/KV binding hiện có được giữ nguyên. Không cấu hình key cho preview.
- 2026-11-01: **Fetch dự án + màu user chốt:** form Valuation có Fetch trái/Lưu phải, bỏ input Cặp Binance, Xoá riêng phía dưới khi sửa. `/api/val-fetch` POST cần ADMIN_PASS, chỉ đọc SURF/CoinGecko, không ghi KV. Ticker phải khớp duy nhất/id/symbol; nguồn bất đồng hoặc thiếu thì không điền. Chỉ điền ô trống, giữ dữ liệu đang nhập, hủy/loại phản hồi form cũ, không làm tròn số đã fetch. Source hiện hỗ trợ cgId/totalSupply được đối chiếu, narrative ánh xạ tag rõ ràng, TGE chỉ khi hai nguồn đồng ngày, funding chỉ các vòng công bố đủ số tiền tới TGE; không đoán VC Alloc/giá TGE. SURF_API_KEY đã cấu hình secret_text production; không có key trong frontend/repo. Legacy binanceSymbol giữ nguyên khi sửa bản cũ; bot chưa được đổi nguồn/deploy. Header box/bảng Work/Valuation cam #FFA111/chữ đen; accent text cùng #FFA111 đậm600, bỏ cam đất. ATH hai số đen, chỉ tỷ số cam, giữ một hàng; không đổi công thức.
- 2026-11-01: **Khôi phục drop shadow cho nút theo user:** CV/Valuation/Work dùng chung bóng0 2px 8px đen32% trên nút/action icon, gồm social/Admin/camera/VI-EN/rank/action popup. Thẻ/nhãn chỉ đọc, popup content/tooltip/image và disabled không bóng; nav/link chữ giữ kiểu text. Cập nhật quy tắc tại repo nguồn, không còn giới hạn shadow chỉ cho overlay.
- 2026-11-01: **Hoàn thiện CV theo shared component system:** repo nguồn có `sharedComponents` cho cả3 trang; social buttons/Highlights/Available-for cùng radius8, trắng/viền line như Work/Valuation; bỏ vòng vàng avatar, đường kẻ section và nhãn Available dạng pill xám/chấm vàng. CV giữ spacious/type/body/content. Browser9 chiều rộng320–1920 đạt: không tràn/cắt chữ, đủ4 section/3 social links, hero96/48 và section64/32. Kiểm tra lại cả3 trang trước deploy.
- 2026-11-01: **Chuẩn hóa Valuation/Work theo yêu cầu user:** thêm token workspace chung tại repo nguồn và exporter, sync website; bỏ radius16/header vàng riêng của Valuation, dùng radius8/header trắng/padding12/8/gap12 như Work. Giữ Valuation8 hàng/header56/panel328/mobile2 box; Work2 desktop/1 mobile và DAILY vàng. Browser12 trạng thái320–1920 đạt, xem ảnh desktop/mobile.
- 2026-11-01: **Build Work theo bản Linear user duyệt:** thẻ độc lập desktop2/mobile1, DAILY vàng nhạt/nhãn cam, khung ba trang/header/footer1280. Browser QA30 trạng thái (3 trang × 10 chiều rộng320–1920), giữ18 thẻ/toàn bộ task và link, không tràn trang; đã xem ảnh1440/390. Bản local, chưa push/deploy.
- 2026-11-01: **Redesign toàn site theo design system v3:** repo nguồn có README viết lại, tokens v3, CSS exporter và pattern có nguồn Radix/shadcn/Carbon; website sync local design-tokens.css có hash kiểm tra. CV editorial (portrait112/72, CTA/photo frame), Valuation flat/shared tokens giữ8 dòng/panel328/ATH inline, Work danh sách nhóm project + phase/task thay grid card. Navbar theo profile. Đổi route chính /work, /airdrop301 và fallback client. Giữ nguyên palette/nội dung/link/backend/công thức.
- 2026-11-01: **Rà toàn thiết kế theo user:** thống nhất header Valuation/bảng/popup/3 box qua token dùng chung: cao 56, desktop chữ16/24, mobile14/20, đậm600; bảng header56 + 8 dòng40. Work giảm cardgap8/groupgap16, headerpadding4/8, sectionpadding4/8, bỏ đệm nhãn dư; tên/tag dài hiện đủ. Chừa vùng cuối Work96 cho filter cố định. QA 35 trạng thái 3 trang/7 chiều rộng/VI-EN, touch44 + popup, xem ảnh cả desktop/mobile.
- 2026-11-01: **ATH một hàng theo user:** cặp số và `(×N)` inline, đo độ rộng nội dung từng cột cho bảng chính/popup; bỏ tỷ lệ % cũ. Mobile giữ 4 cột, màn hẹp cuộn ngang nội bộ, header đồng bộ và bù scrollbar để đủ 8 dòng. QA 18 trạng thái VI/EN 320–1920px + popup: không tràn ô, ATH một dòng, header thẳng cột và cuộn đồng bộ.
- 2026-11-01: **Ticker/ATH/căn dòng theo user:** mọi ticker đậm; FDV VC <300M đen, ≥300M cam. Cặp ×ATH thêm tỷ số cuối/đầu `(×N)` cam đậm, dùng giá trị gốc, mirror client/server. Dòng trong ba box tối thiểu 56; mobile nhãn/tên trái, số phải, không xếp dọc hay chừa 3 dòng. Box vẫn cố định 328px, bảng 8 token mọi màn hình.
- 2026-11-01: **Sửa sai theo user:** 8 token/khung trên CẢ desktop và mobile. Ba box phụ cố định cùng chiều cao 328px (header 56 + thân còn lại), nội dung dài cuộn bên trong. Ngoại lệ product này ưu tiên hơn mặc định compact cao theo nội dung. Giữ lưới mobile 2 cột và không chấm cam.
- 2026-11-01: **Điều chỉnh theo user:** bảng desktop 8 token/khung (360px), mobile giữ 5; bỏ chấm cam FDV cao, giữ chữ đậm; bỏ ngoại lệ Hệ số TGE full-width, cả ba box mobile dùng cùng lưới 2 cột. QA data thật 7 kích thước × VI/EN: đúng số dòng, không tràn chữ, box cùng chiều rộng, ticker FDV cao đậm và không có pseudo-dot.
- 2026-11-01: **Áp hai profile design system v2**: CV spacious (hero 96/48, khối cách 64/32); Valuation/Work compact (nhịp 4, đệm 8/12, dòng bảng 40, task 40/44, panel cao theo nội dung, bỏ padRows). Giữ bộ màu và mọi công thức/dữ liệu. Cập nhật audit theo profile. QA 40 trạng thái trang/chiều rộng/ngôn ngữ với data thật: không tràn chữ/ngang, đủ 5 token, không lỗi JS.
- 2026-11-01: **Header Valuation mobile luôn 1 hàng** theo yêu cầu user: bỏ wrap/basis 100%, thu gọn nút còn 32px, tự co chữ tiêu đề để hiện đủ. Đã đo Chrome 280/320/360/375/390/430/640px × VI/EN × Admin khóa/mở: 28 trạng thái cùng hàng, không tràn. Quy định cũ cho phép xuống hàng đã bị thay thế.
- 2026-10-31: **Bảng Quan sát altcoin hiện 5 token mỗi khung**: giảm chiều cao tối đa 440 → 328px (header 48 + 5 dòng × 56), giữ cuộn để xem toàn bộ token; 3 box phân tích bên dưới lên cao hơn 112px.
- 2026-10-28: **Task tab Work luôn hiện đủ chữ** (user: "buộc phải hiển thị đủ, mở box ra là được"). Trước: desktop ép 1 dòng + "…". Nay hàng cao theo chữ ở mọi màn. Cùng ngày: **thêm trường `website` (ô "Link dự án" trong popup Sửa task)** — bấm tên dự án mở link này thay vì X; `cleanLink` trong `private.js` tự thêm `https://` khi gõ thiếu (trước đó bỏ âm thầm, VD "x.com/binance" bị mất). Data cũ chưa có `website` → phải nhập tay. Verify: chụp `/airdrop` desktop + mobile 0 dòng bị cắt, form 2 cột đúng; ds-audit TỔNG 0; chưa test lưu thật (local không có KV).

- 2026-10-27: **Mức phạt FDV cao đổi sang theo điều kiện thị trường** (user: "market khởi sắc rồi, đâu thể lấy thời WEAK để đo khi hiện tại là NORMAL" — đúng). Đo: k lúc Weak ×0.25, Normal ×0.61, Strong ×0.60 → Weak riêng, Normal+Strong gộp, toàn lịch sử, so với dự án nhỏ cùng điều kiện. Hiện tại Normal → ×0.38 thành **×0.60**. Sửa `fdvPenalty()` + popup (ghi nhóm điều kiện) ở `index.html`, mirror ở `functions/valuation.js`. Verify: server data thật ×4.06 / ×0.60 / Normal (hệ số ×5.22 → ×4.06 là do user vừa nhập RITUAL ×1.18, không phải do sửa); ds-audit TỔNG 0; popup VI/EN đúng; không lỗi JS.

- 2026-10-27: **Box Hệ số TGE: bỏ "FDV thấp / FDV cao" → 1 hệ số + phạt FDV ≥ $300M** (user: web3 hết gọi vốn khủng, out meta). Thống kê 62 TGE từ 2025: < $300M median ×3.92, ≥ $300M ×1.49 → k = ×0.38. User hỏi "dự án lớn ngày càng ít, phạt vậy chuẩn không" → chốt gộp từ mốc cố định 01/2025 + ngưỡng tối thiểu 8 mẫu (lý do ở §4). Sửa `index.html` (box, nhãn VI/EN, popup giải thích, `renderAnalysis`, `predictFDV`) + `functions/valuation.js` (id mới `#tge-coef` · `#tge-penalty`). Verify: server compute data thật ra ×5.22 / ×0.38 / Normal; ds-audit TỔNG 0; popup VI/EN + dự đoán 3 mức FDV đúng; không lỗi JS.

- 2026-10-24: **Work bản EN dịch đủ** (user: "EN chưa dịch task"). Lỗi cũ: task cá nhân bị cố ý không dịch; tên card tiếng Việt không dịch; Google lỗi 1 lượt là kẹt tiếng Việt tới khi tải lại trang; bấm EN trước khi data về thì dịch xong không vẽ lại. Sửa trong `translateToEN()` (+ `personalTasksEN`). Test: bấm EN lúc 7s và 0.4s sau khi mở trang → 18/18 card không còn chữ có dấu.
- 2026-10-24: Work bỏ kẻ mảnh cạnh tiêu đề nhóm; nhóm $ đổi tên "work-to-earn"; tiêu đề tab Work "Work to Earn" → **"Danh sách công việc"** (EN "Task list", đổi theo toggle trong `renderWTE()`); tiêu đề tab Valuation → **"Quan sát altcoin"** (EN "Altcoin watch").
- 2026-10-25: **Hover thêm đậm 700** (user: cam chưa đủ nổi). Nút xã hội + link trong đoạn văn đậm bằng `-webkit-text-stroke` vì đậm thật làm nút/dòng nhích 3px — đã đo vị trí trước/sau hover, không còn nhích.
- 2026-10-25: **Hover đổi từ gạch chân vàng → chữ cam** `--amber-text` (cả site, kể cả link timeline/popup; link vẫn giữ gạch chân lúc thường). Nút nền đen (nút chính, nút VI/EN đang chọn, Retry, predict-link) → chữ vàng `--amber`. Đã đo computed style ở trạng thái hover bằng Chrome headless.
- 2026-10-24: **Work: tiêu đề từng nhóm** ("Work to Earn" · "Rank: S"…) + **form task bỏ lựa chọn rank "—"** (rank bắt buộc nên "—" vô nghĩa → gợi ý "Chọn rank" không chọn được; Work-to-Earn thì ẩn ô Rank; lỗi "Chọn rank" tự tắt khi đổi phân loại; rank cũ `SS` hiện thành S). **Hover đồng bộ cả site:** mọi thứ bấm được có chữ → gạch chân vàng 2px; bỏ hết hover đổi màu nền box (dòng task, nút phụ, Admin, nút xã hội, danh sách admin) + bỏ nhích card + bỏ màu tự pha `#262626` ở nút chính.
- 2026-10-24: **Dọn việc treo theo user:** bỏ "test điện thoại thật" (lỗi thì user tự báo) + "nhập Discord" (Discord là OPTIONAL). Hết 2 ngoại lệ design system: dòng bảng altcoin 40 → **56** (bảng cao tối đa 440 = header 48 + 7 dòng), popup giải thích bỏ emoji 1️⃣ 👉 → "1." "2." + câu chốt đậm (`.info-key`). Mobile: tiêu đề Valuation chiếm trọn hàng trên (cụm nút xuống hàng dưới canh phải) → giữ cỡ 24, không bị ép xuống 14.
- 2026-10-24: **Sửa ô nhập trên mobile bể khung/nhảy** — đo được: trang nền không khoá cuộn khi mở popup (trình duyệt cuộn nền khi chạm ô nhập → popup giật), popup căn giữa cứng không cuộn được (bàn phím bật → "Sửa dự án" lòi khỏi mép trên 66px), max-height theo `vh` co giãn khi bàn phím bật/tắt, `scroll-behavior: smooth` làm cú cuộn giật. Sửa: khoá cuộn bằng `html:has(.open)`, nền mờ cuộn được + popup `margin: auto`, `svh`, `interactive-widget=resizes-content`, bỏ smooth toàn trang, ô nhập `appearance: none`, ô số `inputmode="decimal"`. Cỡ chữ ô nhập vốn đã 16 (không phải lỗi iPhone tự zoom). Cùng ngày: **card work-to-earn không hiện thẻ rank** (user chốt). `tools/ds-audit.js` bỏ qua margin căn giữa tự động → kết quả đúng là TỔNG 0.
- 2026-10-24: Sửa nút "Dự đoán FDV TGE" cách dòng 3 thành 16 (margin-top 8 cộng margin-bottom 8 của dòng trên) làm box Hệ số TGE tràn → bỏ margin-top. Đo lại: 3 box đều 4 ô 56, khe 8, không tràn.
- 2026-10-24: **Nút "Dự đoán FDV TGE" chiếm đúng ô dòng thứ 4** của box Hệ số TGE (rộng hết, cao 56, cách 8) cho đồng bộ với 3 dòng trên — user chốt. `tools/ds-audit.js` cho phép riêng nút này cao 56.
- 2026-10-24: **Soát toàn bộ bằng script `tools/ds-audit.js`** (78 chỗ lệch → 0, trừ margin auto). Sửa: nền vàng nhạt tự pha `#FFF1DB` → `yellow-soft #FEF5D9`; hover/link không còn chữ cam (đen + gạch chân vàng); đậm 700 ở chữ nhỏ → 600; line-height/giãn chữ đúng cặp DS (bảng, tab nav mobile, nút, label form); icon ký tự ✕ ⋮ + → SVG Lucide trong nút icon 40×40; vòng ảnh đại diện/chấm timeline dùng outline thay shadow; lightbox dùng scrim + shadow Y2; nút mèo 48. **`og.png` vẽ lại** theo design system (nền trắng, chữ đen, vàng mắt mèo, Inter, ảnh đại diện mới) → `?v=7`; nguồn `tools/og-gen.html`.
- 2026-10-24: **Chữ cam đổi `#965E00` → `#B84A0C` = `orange-text` của design system.** `#965E00` là màu tự pha (không có trong guideline), user chê xấu. Bài học: màu chữ/nền phải lấy đúng token design system, không tự pha.
- 2026-10-24: **Valuation thêm lại cam** (user: chỉ đen + xám thì flat): ×TGE ≥ 13, ×ATH tuần đầu, và giá trị bên phải mọi dòng trong 3 box = cam sẫm `--amber-text` đậm 700. Đỏ vẫn chỉ cho nguy hiểm.
- 2026-10-24: **Valuation: cách hiện + màu số liệu theo design system** (user: "lệch system"). 3 box thành dòng danh sách nhãn trái · giá trị phải (bỏ kiểu căn giữa, bỏ `SL:02` → "12 dự án", bỏ dấu `:`), Hệ số TGE tách FDV thấp / FDV cao / Điều kiện thành 3 dòng, box cao 328 hiện 4 dòng. Số liệu bỏ tô vàng: nhấn = đậm 700 ink; nguy hiểm (×ATM ≥ 15, badge FAKE PUMP) = đỏ design system (`--red-text`/`--red-soft`) — tổng màu đi kèm/màn: vàng (thiết kế) + đỏ (ngữ nghĩa). `pad3()` → `padRows()` (4 dòng). `functions/valuation.js` không phải sửa (chỉ điền id + class bảng, CSS tự đổi).
- 2026-10-24: **Rà lại cho đúng design system** (user hỏi "có chắc áp dụng đúng chưa" — chưa). Sửa: khoảng cách gọn theo 16 (đệm box 16, navbar → nội dung 16, mục CV 48; bỏ bảng "Website 1440" 96/64/32 của design system theo chốt của user) · xám/mist/line về đúng mã design system, chữ vàng sẫm `#965E00` (đạt 4.5:1 trên mist) · rank Work bỏ màu riêng (≤ 2 màu đi kèm/màn): thẻ rank đen, card $ nền vàng nhạt, card S/A/B/C nền mist · dòng danh sách 56 bo 16 · bỏ hết khe 2/4/6/12 · bỏ radius 8/4 · chữ mobile chỉ dùng style design system, bảng altcoin mobile 14 (ẩn thêm ×ATL) · `fitIntroTitles()` lùi theo thang 24→20→18→16→14 · nút đứng một mình mobile 296.
- 2026-10-24: **Header card Work làm lại** (narrative bị cắt "…" vì potential + narrative chung nửa header): hàng 1 = logo + tên trái · icon X + Discord phải; hàng 2 = thẻ potential · narrative · rank. Thêm trường **`discord`** (form admin + `private.js` sanitize) — data cũ chưa có, phải nhập tay qua popup admin.
- 2026-10-24: **Redesign cả site theo design system nguyen0xhieu**, biến thể riêng: ĐEN thay 0x Blue (mèo đen), nền TRẮNG, **vàng mắt mèo `#FFA111`** (đúng mã trong `icon.png` → hết lệch màu mắt mèo vs cam thương hiệu) + vàng sẫm `#9C6200` cho chữ. Chữ số chẵn ≥14 (bảng altcoin mobile 12 là ngoại lệ), lưới 1200/rãnh 24, bo 16 + pill, 1 shadow Y2, icon Lucide 1.59.0, nút 48/40. Bỏ `--font-c`, bỏ VIẾT HOA giãn chữ, bỏ opacity khi tắt. Rank A đổi xanh dương → cyan-text `#087089`, rank `$` chữ đen trên vàng. Chỉ đổi CSS + SVG icon, không đụng JS/logic/data. Luật mới ở DESIGN_SYSTEM.md (viết lại toàn bộ). Cùng ngày thu khoảng cách navbar → nội dung (CV 48, Valuation/Work 32) theo góp ý user.
- 2026-10-23: **Bỏ hẳn tab AI.** Nav còn CV · Valuation · Work. Xoá view/CSS/JS/2 popup admin của AI trong `index.html` + `functions/api/ai.js`. `/ai` giờ rơi về trang CV. Key KV `ai-posts` (6 bài) KHÔNG xoá — muốn dựng lại thì data vẫn còn. Meta/og đổi "Valuation · AI · Work." → "Valuation · Work." (châm ngôn giữ nguyên).
- 2026-10-15: **Dời bot giá từ PC nhà lên VPS** `/opt/val-price-bot` (chép `bot/` bằng scp, `.env` quyền 600 — ban đầu dùng token Cloudflare, cùng ngày đổi sang **`ADMIN_PASS`** (lấy từ file secret chung, đi qua whitelist của `/api/val`; trên VPS không còn token Cloudflare), `docker compose up -d --build`). Lượt đầu 79/79 có giá. Docker bật cùng VPS + `restart: unless-stopped`. Sửa `sync-prices.js` thì phải scp lại + `docker compose up -d --build` trên VPS — **push GitHub không tự cập nhật bot**.
- 2026-10-15: **CT thiếu ×ATH/×ATL/×ATM — không phải lỗi logic trang.** Bot giá (Docker PC nhà) ngừng chạy từ lượt 2026-10-01; CT thêm sau đó nên `val-prices` không có key `CT` → 3 cột "—" (×TGE vẫn có vì `priceTGE` nhập tay). Đã chạy bot 1 lượt từ máy Dell (`RUN_ONCE=true node sync-prices.js`, ghi thẳng KV bằng `CF_API_TOKEN`) → 79/79 có giá. Cùng ngày dời bot lên VPS (xem dòng trên).
- 2026-10-05: **Nút chụp ảnh Valuation sửa xong** (trước đó lỗi 100%): đổi `html2canvas.min.js` → `html2canvas-pro.min.js` 2.5.1 (npm, MIT). Mobile lưu vào Ảnh qua bảng chia sẻ, desktop mở hộp thoại lưu ở Desktop. Đã test headless (vẽ OK, nhánh tải về + popup mobile OK); CHƯA test trên điện thoại thật + hộp thoại lưu thật.
- 2026-10-05: **×ATH ca list sàn tạo ATH trong 1 tuần**: trước hiện "—", giờ hiện `×TGE → ×ATH` tô cam (VD ACE 69,56 → 83,84). Sửa ở cả `index.html` lẫn `functions/valuation.js`.
- 2026-10-05: **Tiêu đề Valuation trên mobile** hết bị cắt "…" — thu nhỏ chữ cho vừa 2 dòng (375px ≈ 13px; 320px chạm sàn 10px và xuống 3 dòng).
- 2026-10-05: CV Experience 2026: "Community Builder" → "Community Builder & Builder". Repo GitHub + thư mục local đổi tên `cv` → `website_personal_0xhieu`.
- 2026-10-02: **Hover tên website + chữ navbar → cam `--amber`** (trước: logo đen→xám, nav xám→đen). Tab đang chọn vẫn đen + gạch dưới khi không hover.
- 2026-10-05: **Đồng bộ nút Admin 3 tab.** Trước: Valuation có icon + riêng cạnh camera và nút Admin đổi chữ "Đã mở"; AI/Work đổi chữ nút thành ký tự "+" thô. Nay cả 3: mở khoá → nút Admin thành [+] dùng icon `plus.svg` 24px (class `.lang-dd-btn.is-plus`); bỏ `#val-add-btn` + CSS `.add-btn`.
- 2026-10-02: **Cam thương hiệu đổi sang cam sẫm `#B35C00`** (bỏ cam sáng `#FFA111`). `--amber` = `#B35C00`, `--amber-ink` giờ = `var(--amber)` → cả site 1 màu cam, dùng được làm nền solid + chữ trắng (tương phản 4.7:1). Rank `$` (badge + nút lọc) đổi chữ đen → trắng. Tint `--head-bg`/`--amber-soft` tự đi theo → nền header thành be ngả nâu.
- 2026-10-02: **CV timeline bỏ hết chữ đậm** trong bullet (Ambassador/Top Yapper/OG Contributor, tên brand, link) — user thấy bold vô duyên. Link vẫn phân biệt bằng màu cam + gạch chân. Gỡ luôn CSS `.tl-bullets strong`.
- 2026-10-02: **Tab AI:** tiêu đề bài dài xuống tối đa 2 dòng (quá 2 dòng mới "…"), hàng cao theo. 4 hub giữ 2 cột tới mobile (≤ 640) mới 1 cột — trước đây ≤ 1024 đã 1 cột, thu nhỏ cửa sổ chút đã xấu.
- 2026-10-02: **Cả site đậm lên + cam điểm xuyết (phương án B).** User: "1 màu, mờ nhạt, data rối mắt; box xám quá nhạt; cam phải tối đi cho dễ đọc". Đậm token xám chung (`--chip` EBEBEB · `--w-line` DCDCDC · `--w-mute` 616161 · `--w-dim` 8C8C8C · `--head-bg` cam 20%), thêm `--amber-ink #B35C00` (chữ cam) · `--amber-soft` · `--zebra`. Bảng altcoin xám phân tầng + cam theo nghĩa (×TGE ≥ 13, ×ATM ≥ 15, chấm FDV ≥ 300M) — `functions/valuation.js` cũng in cùng class. Chi tiết luật ở DESIGN_SYSTEM.md §2. User chọn B từ 4 bản mock (hiện tại / A chỉ xám / B xám+cam nghĩa / C heatmap).
- 2026-10-02: **AI đọc được tab Valuation.** Thêm `functions/valuation.js`: khi tải `/valuation`, server đọc KV, tính đúng như JS trang rồi điền vào `#baseline-low` · `#baseline-high` · `#market-condition-lvl` · `#tge-tbody` (HTMLRewriter). Trước đó AI chỉ thấy "—" vì số do JS vẽ. Giao diện không đổi, JS vẫn vẽ đè cùng số. Số in kiểu EN (dấu chấm). Function route nên `_redirects` không áp cho `/valuation` (docs Cloudflare). Data thô vẫn ở `/api/val`.
- 2026-09-25: **Đổi màu chủ đạo sang đen (tiết chế) + trắng + xám trung tính; cam chỉ còn là màu rank `$`**, gọi lại tím S · xanh dương A · xanh lá B (C xám) — chỉ ở ô rank + thanh lọc. User: "trắng xám và cam vốn không cùng nhau". Xám đổi từ tông ngả vàng (stone) sang trung tính. Box bo góc 8 → **16** (chip giữ 8). **Sửa lỗi DAILY không cách lề 16**: commit `b7b598d` cho `.wte-section--daily` `margin: 0 -16px`, nhưng card không có đệm ngang (đệm nằm ở từng section) nên margin âm kéo chữ + chip dính sát mép — bỏ margin âm, dải nền vẫn tràn 2 mép vì section vốn rộng bằng card.
- 2026-09-24: **Dọn repo, chốt trạng thái.** CSS 4 lớp đè nhau (bản gốc → Valuation mới → bản sang → bản sáng) viết lại thành 1 stylesheet theo thành phần (2363 → ~760 dòng; index.html 252KB → 166KB); verify bằng so computed style của mọi phần tử ở 72 trạng thái (4 tab × desktop/mobile × admin, hover, 12 popup). Gỡ JS chết: bộ đọc CSV Google Sheet, `capLabel()`/`CAP_*` (nhãn S/M đã bỏ), `onclone` mũi tên Watchlist. Xoá `arrow.svg` · `info.svg` · `right2.svg` (không còn dùng), `REBUILD_SPEC.md` + `REBUILD_SPEC_V3_VALUATION.md` (đã build xong, luật còn hiệu lực chuyển vào đây). HANDOFF viết lại chỉ còn hiện trạng.
- 2026-09-24: **Bản sáng.** Desktop Roboto, Condensed chỉ cho bảng altcoin + toàn site trên mobile. Chữ mobile ≥14 (trừ bảng altcoin). Navbar/header/nút bỏ nền đen → trắng/ngà, nút chính amber. Navbar → nội dung 24 (bỏ hàng trống 48).
- 2026-09-24: **Bản sang** cho tab Work rồi áp cả site: icon SVG, tiêu đề card canh trái + icon, chip `#F5F5F4`, bóng mềm 2 lớp, viền 1px.
- 2026-09-24: Nav tab (CV/Valuation/AI/Work) bỏ ô rộng cố định 88px canh giữa, chuyển sang rộng theo chữ + khoảng cách đều 16px. Icon `low-potential` đổi từ 1 gạch ngang phẳng sang mũi tên giảm (mirror icon `high-potential`, cùng kiểu trending). Thêm điểm nhấn cam nhạt (`rgba(255,161,17,.06–.08)`) cho header card Work (`.wte-card-head`) và nhóm Daily (`.wte-section--daily`, viền trên/dưới amber nhạt) — ngoại lệ so với `--head-bg` trắng ngà chung trong DESIGN_SYSTEM.md §3.

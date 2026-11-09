# HANDOFF — 0xhieu.xyz

Chốt bàn giao: 09/11/2026 (Asia/Saigon). Code đang live: commit mới nhất trên main (09/11: gộp checklist theo ngày, chọn nhiều ngày + giờ kiểu iPhone; 08/11: Bento + kiểu chữ theo chức năng, box dự án hiện sẵn link + Hướng dẫn tham gia). Handoff này thay các mô tả cũ; lịch sử ở git và [docs/handoff-history-through-2026-11-02.md](docs/handoff-history-through-2026-11-02.md)

Chốt bàn giao: 06/11/2026 (Asia/Saigon). Code đang live: commit mới nhất trên main (06/11: xám trung tính, bút dạ, thẻ Work đen/trắng). Handoff này thay các mô tả cũ; lịch sử được giữ ở [docs/handoff-history-through-2026-11-02.md](docs/handoff-history-through-2026-11-02.md).

## Repo và vận hành

- Local: `D:/Files/Claude/website_personal_0xhieu`. GitHub: https://github.com/KattyFury/website_personal_0xhieu, nhánh main.
- Production: https://0xhieu.xyz. Cloudflare Pages project `0xhieu-xyz`, auto-deploy main. Push GitHub rồi xác minh production.
- Design source: `D:/Files/Claude/repo_personal_design` (design system **v4 Bento**, main `9ad5b8a`). Figma: https://www.figma.com/design/V0GuQUwipow6yFqNi4y7qg/hieu. `tokens.json` → `export_web.py` → `web.css`; website dùng CSS sinh ra `design-tokens.css` có hash.
- Trang: CV `/`, Valuation `/valuation`, Work `/work`. `/airdrop` redirect sang `/work`. CV tiếng Anh cố định; Valuation/Work có VI/EN.
- `index.html`: giao diện/CSS component/JS. `functions/api/val.js`: dữ liệu Valuation. `functions/api/val-fetch.js`: Fetch SURF/CoinGecko. `functions/api/private.js`: CRUD Work. `functions/api/wte.js`: Work public.
- `functions/valuation.js`: SSR đọc KV, điền hệ số/market/table để crawler đọc được. Công thức và markup phải khớp client nếu sau này sửa.

## Luật làm việc đã chốt

- Khi anh yêu cầu sửa/deploy, làm xong và deploy, không đòi duyệt preview. Tự QA browser thật và production.
- Hướng thiết kế/bố cục mới phải đưa phương án để anh chốt; không tự sáng tác thay framework. Thay đổi nội dung/nút/màu đã yêu cầu thì triển khai đủ phạm vi.
- Không sửa công thức Valuation chỉ để thêm tính năng hoặc làm UI. Ngày02/11 anh xác nhận dữ liệu và logic3 box legit, giữ nguyên.
- Không in/commit secret. Secret chung: `D:/Files/Claude/.secrets/keys.env`; production dùng encrypted bindings. Admin credential `ADMIN_PASS`; key SURF local tên `SURF_API`, runtime `SURF_API_KEY`. Không ghi giá trị vào handoff/chat/script args.
- Không nhắn người khác hoặc tự gửi thông báo ra dịch vụ ngoài.

## Design đang dùng (08/11/2026)

Nguồn sự thật:
- `repo_personal_design`: README mục "Bento v4" và "Kiểu chữ — đặt tên theo chức năng", cùng `tokens.json`.
- Trong repo này: mục đầu `DESIGN_SYSTEM.md`.

Mọi gạch đầu dòng cũ bên dưới file đó (header xám, viền, radius 8, Work 2 thẻ/hàng, thanh rank…) đã hết hiệu lực.

**Phong cách chung**
- **Bento:** nền canvas `#F2F2F0`, tile trắng bo 20, không viền, không bóng. Đường kẻ hair `#ECECEA`. Tile tối `#161616`. Accent `#F5B301`, để đậm hết mức, không làm nhạt.
- **Giới hạn màu:** mỗi màn tối đa 1 tile vàng và 1 tile đen.
- **Bo góc:** chỉ 3 mức, 20 / 10 / pill.
- **Bóng:** chỉ cho thứ nổi: navbar, nút trên toolbar, nút mèo, popup.
- **Navbar:** viên trắng nổi, tab đang mở nền vàng.
- **Hàng tiêu đề trang:** nằm thẳng trên canvas, không có dải trắng.

**Chữ**
- Kiểu chữ đặt tên theo chức năng, gọi bằng biến `--ds-type-<tên>-size/line/tracking`.
- Các kiểu: display = Tiêu đề lớn, page, header, content, secondary, data, label, button, note, input, hero.
- **Cấm gõ font-size px tay**, cấm viết đè cỡ chữ trong media query. Mobile (≤640) tự đổi cỡ qua biến.
- Mobile nhỏ và thoáng; desktop to, chụp ra làm banner được. Độ đậm chỉ 400 / 600 / 700.
- Bảng cỡ chi tiết nằm trong README của repo design. Lần sau anh chỉnh kiểu nào thì sửa `tokens.json` (`bento.type`) → `python export_web.py` → `python tools/sync-design-system.py` ở repo này.
- Font: site dùng font hệ thống (iPhone/Mac là SF Pro, Windows là Segoe UI), Figma dùng Inter. Anh đã hỏi font chính là gì; tôi đề xuất tải Inter cho site để mọi máy giống nhau, **anh chưa trả lời**.

**Icon trên site:** vẫn là SVG nội tuyến trong `WTE_ICON`.

**App icon / favicon:** mèo bo góc (góc trong suốt), cache `?v=4`.

## Work (09/11/2026)

**Tiêu đề trang:** "work-to-earn" (cả VI và EN). `learn-to-grow` / `work-to-earn` chỉ có 1 cách viết là viết thường, ở tiêu đề, nhãn nhóm, thẻ và dropdown form; giá trị lưu trong KV vẫn là `Learn-to-Grow` / `Work-to-Earn`.

**Thứ tự trên trang:** dropdown "Dự án & hướng dẫn tham gia" → checklist Hôm nay → ô Lịch hôm nay.

**Dropdown "Dự án & hướng dẫn tham gia"**
- Mặc định gập; đổi ngôn ngữ thì giữ nguyên trạng thái mở/gập.
- Bên trong chia nhóm: **Cá nhân → Work-to-earn → Rank S…C**. Việc Learn-to-grow là việc cá nhân: nằm trong nhóm Cá nhân, xếp trên cùng; trong nhóm Cá nhân thứ tự là l2g → w2e → S…C (anh chốt 08/11, thay quy tắc cũ "l2g có nhóm riêng").
- Mỗi dự án KHÔNG gập: logo · tên · thẻ tiềm năng (VI `Tiềm năng`/`Tiềm năng thấp`, EN `High potential`/`Low potential`) + narrative · ⋮ (admin). Dự án không có X hoặc unavatar không có ảnh thì logo là mặt mèo `icon.png` (unavatar gọi kèm `?fallback=false` để trả 404 thay vì ảnh mặt cười mặc định).
- Ngay dưới là 1 hàng chip cao 30: Website · X (icon) · Discord (icon) · **Hướng dẫn tham gia**.
  - Chip Hướng dẫn tham gia nền đen chữ vàng, mở bài đăng X.
  - Link lấy từ Get Started: ưu tiên mục có chữ hướng dẫn/tham gia; không có thì lấy link đầu tiên.
- Mobile: hàng chip bỏ thụt trái để nằm 1 dòng.

**Checklist Hôm nay (anh chốt 09/11, thay 2 checklist ngày/tuần riêng)**
- Một ô vàng (ngày, số việc, vòng tiến độ) + một danh sách gộp mọi việc rơi vào hôm nay. Thứ tự l2g → cá nhân → w2e → S…C. Việc tuần có thêm thẻ `tuần`/`weekly`.
- Form vẫn tách Daily task và Weekly task. Không chọn ngày: việc ngày hiện mọi ngày, việc tuần hiện thứ Hai + thứ Ba.
- Ô tick to 32 (vùng bấm 44): bấm ô mới gạch việc; bấm phần còn lại của hàng mở link công việc ở tab mới. Việc không có link thì hàng không bấm được.
- Tick việc ngày về 0 mỗi ngày; tick việc tuần giữ đến hết tuần (thứ Hai về 0), nên tick việc tuần rồi thì các ngày khác trong tuần nó vẫn đã tick.
- Tick lưu localStorage `wte-done` / `wte-done-week`, **chỉ trên máy đang dùng**, giữ 2 kỳ gần nhất. Đồng bộ tick giữa các máy qua KV chưa làm.

**Lịch của việc (tuỳ chọn)**
- Form kiểu iPhone: 7 nút ngày chọn nhiều + giờ 24h bấm ra bánh xe cuộn, có "Bỏ giờ". Dùng cho cả việc ngày và việc tuần.
- Dữ liệu: `days` (mảng, 1 = T2 … 7 = CN) + `time` (HH:MM), **luôn lưu theo GMT+7**. Field cũ `dow` vẫn đọc được, lưu lại sẽ thành `days`.
- VI xem và nhập theo GMT+7, EN xem và nhập theo UTC. Giờ đổi qua nửa đêm thì thứ đổi theo (T5 03:00 GMT+7 = T4 20:00 UTC). "Hôm nay", tick và Lịch hôm nay đều theo đồng hồ của ngôn ngữ đang xem, không theo giờ máy.
- Ô "Lịch hôm nay" gồm các việc của hôm nay có giờ.
  - Việc kế tiếp = chip vàng "Sắp tới"; quá giờ chưa tick = đỏ "Quá giờ"; đã tick = gạch ngang.
  - Tự cập nhật mỗi phút. Không có việc hẹn hôm nay thì ô không hiện.
- **Chỉ báo trên web.** Anh chọn không dùng Telegram hay push.

**Form:** Tiềm năng và Phân loại bắt buộc chọn, không còn lựa chọn "—". Các nút trong form (+, x, ngày, giờ, Xoá task) phẳng, không bóng.

**Đã bỏ:** thanh kéo chọn rank l2g/w2e/S/A/B/C (anh nói không cần nữa).

**Learn-to-grow (l2g):** phân loại `Learn-to-Grow`, không có rank, mặc định Personal. Việc l2g cá nhân nằm trong nhóm Cá nhân, xếp trên cùng; checklist cũng đặt l2g lên đầu. `TYPE_GROUPS` trong `private.js` phải khớp `WTE_TYPE_GROUP` trong `index.html`.

## Figma + design system (08/11/2026)

**File Figma:** https://www.figma.com/design/V0GuQUwipow6yFqNi4y7qg/hieu, 4 page Cover / Foundations / Components / Icons.
- **Variables:**
  - `Primitives`: 16 họ màu × 11 sắc độ + neutral.
  - `Bento`: 22 màu ngữ nghĩa, Light/Dark.
  - `Spacing & Radius`.
- **Style:** 24 text style `Mobile/<Kiểu>` và `Desktop/<Kiểu>`, font Inter; effect style `Shadow/Floating`.
- **Components:** Button, Tag, Link chip, Checkbox, Stat tile, Task row, Project row, Dropdown tile, Navbar. Tất cả gắn biến màu và text style.
- **Icons:**
  - 328 icon Lucide 1.59.0, component `Icon/<tên>`, chia 9 nhóm.
  - Nhóm Brand: `Brand/x`, `Brand/discord`, `Brand/telegram`, `Brand/github`. Lucide 1.x đã bỏ logo thương hiệu nên vẽ thêm, nét stroke 2, dùng đúng hình vẽ X/Discord của site.

**Repo `repo_personal_design`**
- `tokens.json` có thêm `palette` (bảng màu mở rộng) và `figma` (link, cấu trúc file). Export ra `--ds-palette-<họ>-<sắc độ>`.
- Repo và Figma phải khớp nhau. Sửa token thì nhớ cập nhật cả Figma, hoặc báo anh.

## Valuation: UI và dữ liệu

- Bảng 7 cột, hiện 8 hàng. Header 56, hàng 40; cuộn dọc trong bảng.
- Mobile **không kéo ngang**: ẩn Narrative/TGE/ATL, và ô ×ATH bỏ phần "đáy →" (class `.ath-from`), chỉ còn `đỉnh (×N)`. Cột đo bằng `--ck5m` (anh chốt 07/11).
- Bố cục Bento: 3 ô (Mặt bằng định giá = ô vàng, Hero or Zero = ô đen, Narrative = ô trắng) nằm TRÊN bảng.
- Nút camera chỉ chụp tiêu đề + 3 ô, không chụp bảng (cắt chiều cao ngay dưới `.val-boxes`).
- Giữ thứ tự ngày TGE cũ→mới. Mỗi lần mở Valuation tự cuộn bảng tới cuối (dự án mới nhất), kể cả tải data chậm; không cuộn page, không ép xuống cuối khi chỉ đổi ngôn ngữ/render khác.
-3 box phụ cao cố định328: desktop3 cột, tablet/mobile2 cột bằng nhau. Nhãn trái, giá trị phải; thân dài thì cuộn.
- ATH `đầu → cuối (×N)` trên1 dòng: hai số đen600, tỷ số bút dạ. Ticker VC FDV<300M đen đậm, ≥300M bút dạ, không chấm cam. Số chính cả 3 box cũng bút dạ, kể cả Hero or Zero (anh bỏ chữ đỏ ở box này 06/11, thấy đỏ lẻ loi).
- Toolbar Valuation luôn1 hàng trên mobile: co chữ/nút khi thiếu diện tích, không bẻ dòng.
-81 dự án tại lúc bàn giao. Một narrative chính/dự án trong17 slug: stablechain, layer-1, layer-2, infra, ai, zk, privacy, identity, rwa, defi, trading, payment, bitcoin, prediction, game, social, desci.
- Đã rà SURF và đổi19 narrative,62 giữ nguyên. ROBO/BASED giữ nguyên vì chưa xác minh đúng dự án. Không tự lấy tất cả tag SURF để nhân mẫu.
- POST action `narratives` kiểm tra toàn bộ batch/expectedNarrative/expectedCgId trước khi ghi; chỉ thay narrative, giữ nguyên mọi trường khác. Không dùng import để migration narrative.

## Ba box: công thức và tên đã duyệt

`vcFDV = fundraising / (vcAlloc/100)`; `×TGE = priceTGE × totalSupply / vcFDV`; `×ATM = currentPrice / (vcFDV/totalSupply)`.

1. **Mặt bằng định giá / Valuation baseline**. Thứ tự: Điều kiện thị trường → Hệ số TGE → Phạt FDV≥$300M → nút dự đoán.
   - Market condition: median6 ×TGE thô mới nhất; Weak<4.3, Normal4.3–<13, Strong≥13.
   - Hệ số: median6 mới nhất đã chuẩn hóa dự án FDV cao; nếu TGE thứ6 cách thứ1>60 ngày thì lấy4.
   - Phạt: Weak riêng, Normal+Strong gộp; gắn regime lịch sử theo6 TGE trước; high-FDV chia median low-FDV cùng regime; k=median tỷ số, cần≥5 high-FDV. Không tự đổi threshold/window.
   - Snapshot audit02/11: Normal, hệ số5.22434, k0.597375/7 mẫu;4 dự án gần nhất AXIS/DNA/CT/TMX. Đây là snapshot, không hardcode UI.
   - Calculator giữ `predictFDV()` Model D hiện tại; không thay bằng phép nhân thẳng hệ số box.
2. **Hero or Zero** (cảVI/EN). Lọc ×ATM≥15, TGE mới nhất trước. Dự án có thể giữ vững định giá cao hoặc chạm đỉnh rồi sụp đổ; không khẳng định VC/team đang bán. Badge TGE<30 ngày là dữ kiện thời gian, không còn Fake Pump.
3. **Narrative đang hot / Trending Narratives**. Median ×TGE thô theo narrative chính; chỉ TGE≥2025-02-01; không lọc số mẫu/threshold. Đếm số dự án trong cửa sổ và narrative chính, không đếm mọi tag SURF. Layer-2 hiện SOPH/BLEND/MEGA; OP/ARB/MANTA/STRK/SCR trước cutoff; nhiều dự án có tag L2 nhưng narrative chính khác. Anh đã chấp nhận phạm vi này.

Ghi chú3 box VI/EN đã rút gọn và kiểm đúng ý. Narrative note nói rõ đây là định giá lúc TGE, không phải sức nóng giá hiện tại. Popup title phải khớp box.

## Fetch và nguồn dữ liệu

- Fetch trái/Lưu phải, Xóa riêng dưới khi sửa. Không có input Cặp Binance. Legacy `binanceSymbol` giữ khi sửa.
- Fetch chỉ điền ô trống có bằng chứng, không tự lưu, không đè edits giữa request. SURF search/detail và CoinGecko; ticker trùng/chưa chắc thì dừng.
- Hỗ trợ cgId/totalSupply đối chiếu, narrative có ánh xạ duy nhất, TGE khi nguồn khớp, funding đến TGE khi đủ amount từng vòng. Không đoán VC allocation/priceTGE.
- KV `WORK`: `val-projects` (admin), `val-prices` (bot), `personal-tasks`, `ai-posts` legacy không dùng. Project fields: ticker/tgeDate/narrative/fundraising/vcAlloc/totalSupply/priceTGE/cgId/binanceSymbol.
- Bot giá Docker trên VPS `ssh vps`, `/opt/val-price-bot`, container `val-price-bot`; push website không update bot. Bot dùng admin API, không được đụng priceTGE. Xem `bot/README.md` trước khi vận hành; phạm vi đa sàn chưa được thay thế hoàn chỉnh trong phiên này.
- Không dùng wrangler.toml ghi đè Cloudflare dashboard/bindings. Cẩn thận SSR/client nếu thay công thức.
- Camera dùng html2canvas-pro; không đổi lại bản html2canvas gốc (không đọc color-mix). HTML mask không render đúng trong ảnh; loại toolbar khỏi capture. Mobile share/save vẫn cần QA thiết bị thật nếu sửa.

## Quyền admin theo máy (04/11/2026)

- Anh chốt phương án token lưu trên máy, vẫn giữ ô nhập tay. Popup Admin có ô "Nhớ máy này": đúng pass + tick thì server cấp token 400 ngày trong cookie HttpOnly (`cvAdminDevice`, Path=/api, Secure, SameSite=Strict). Không tick thì giữ nguyên kiểu cũ, đóng trình duyệt là mất quyền.
- Code chung: `functions/_lib/admin-auth.mjs`, dùng cho `private.js`, `val.js`, `val-fetch.js`. Bot giá vẫn dùng `ADMIN_PASS`, không phải đổi. Cờ `cvAdminDevice` trong localStorage chỉ để khách thường không gọi `/api/private` khi tải trang; nó không phải quyền.
- KV `WORK` chỉ lưu hash: `admin-device:<hash>`, metadata ghi trình duyệt + ngày tạo. Không có nút quản lý trên site (anh muốn ít nút).
- Thu hồi 1 máy: xoá đúng key đó trong KV (hiệu lực có thể trễ tới khoảng 60 giây do cache KV). Thu hồi tất cả: đổi `ADMIN_PASS`, nhưng phải đổi luôn cho bot trên VPS.
- Hết 400 ngày thì nhập pass + tick lại một lần; token không tự gia hạn.

## Xác minh / trạng thái bàn giao

- Workspace sạch trước khi viết handoff; mọi thay đổi giao diện/dữ liệu đã deploy.
- 14 test backend (`node --test tests/*.mjs`, gồm `admin-auth`) đã pass 04/11; narrative-only migration giữ nguyên trường khác.
- Đã QA Chrome production:3 info popups×VI/EN×1440/390, calculator CTA; auto-scroll direct/reopen/back×1440/390; frame3 routes×1920/1440/1024/768/390/320; rank drag/keyboard/scroll spy×1440/390/320.
- Design audit gần nhất 06/11 (local trước deploy + production sau deploy): 0 lỗi; `tools/ds-audit.js` đã đổi màu được phép mist → surface `229,229,229`. Thay spacing/component mới phải chạy lại phù hợp. Audit không mở popup cần đăng nhập admin.
- QA tone 04/11: local cả 3 trang × 1920/1440/1024/768/640/390/360/320 không tràn ngang, không còn màu cấm; production cả 3 trang × 1440/390 cùng kết quả, header và thân bảng thẳng cột.
- QA "Nhớ máy này" 04/11: Chrome thật + server local 17/17, production bằng script API 10/10. Token thử trên production đã xoá; lúc đó chưa có máy nào được nhớ, anh tự tick trên từng máy.
- CHƯA xem bằng mắt sau đổi tone: popup cần admin (danh sách dự án, form sửa có nút Xoá, form task). Cổng 8787 trên máy Dell có thể đang bị app khác chiếm; xem thử local thì dùng cổng khác, đừng tắt app đó.
- Commands: `python tools/sync-design-system.py`; `python tools/check-design-system.py --source D:/Files/Claude/repo_personal_design`; `node tools/ds-audit.js <local-or-live-url>`.
- Secret không ở repo. Artifacts/backup narrative ở `C:/Users/Dell/.codex/visualizations/2026/10/31/01a19278-d691-7691-916e-ee30f78c4e30`, không coi là dữ liệu live.

## Đã chốt 06/11 (3 câu hỏi của 04/11)

- Số nhấn: bút dạ (chữ đen trên nền cam). Số đỏ Hero or Zero: lúc đầu giữ đỏ, sau anh đổi sang bút dạ như các số khác. Badge đỏ ×ATM≥15 trong bảng chính vẫn giữ. Xám: trung tính `#E5E5E5`, đậm hơn mist một chút.

## Công việc tiếp theo (chỉ thảo luận)

Anh đề xuất dashboard quan sát dự án chưa TGE để tham gia airdrop: tên/X/Discord/narrative/TGE/hướng tham gia/hoạt động X. Chưa chốt UI, route, kiến trúc, chưa cho phép thay Work hoặc Valuation để nhét dashboard. Đã thăm dò SURF API, phương án ở `docs/SURF_PRE_TGE_DASHBOARD.md`. Không tự build/deploy dashboard mới khi mới đang bàn ý tưởng.

## Nhật ký bàn giao

- **09/11/2026:** Work gộp checklist ngày và tuần thành 1 danh sách theo ngày; lịch chọn nhiều ngày + giờ bánh xe, GMT+7 cho VI và UTC cho EN; thẻ tiềm năng tiếng Việt; logo mặt mèo; learn-to-grow/work-to-earn viết thường; bỏ "—" trong form; bỏ bóng nút trong form. QA: Chrome local với KV giả, đồng hồ giả từ T2 đến CN, VI/EN, 1440/390, 38/38 đạt.
- **08/11/2026:**
  - Design system v4 Bento, kiểu chữ đặt tên theo chức năng; site bỏ mọi cỡ px viết tay.
  - App icon bo góc.
  - Box dự án hiện sẵn link + Hướng dẫn tham gia; High/Low potential; nhãn nhóm viết hoa.
  - Chép design system sang Figma: biến, style, component, 328 icon Lucide + Brand.
- **07/11/2026:**
  - Giao diện Bento V2, l2g.
  - Hôm nay / Tuần này / Lịch hôm nay, giờ báo tuỳ chọn.
  - Bỏ thanh rank.
  - Bảng TGE mobile không kéo ngang; camera chỉ chụp 3 ô.
  - Brand `#F5B301`.

- 06/11/2026: xám trung tính `#E5E5E5` thay mist (design system `47fc26f`); số nhấn kiểu bút dạ; thẻ Work đen/trắng theo rank/potential/narrative top 5 (ban đầu top 4, anh đổi thành 5 cùng ngày). Ảnh QA ở Desktop `0xhieu-2026-11-06`. Chụp headless Chrome ở 390 bị cắt mép phải cả production — là giới hạn của headless, không phải lỗi trang.

- 04/11/2026: DAILY đổi sang nền xám, bỏ chữ đậm sẵn và viền cam; nhãn rank `$` đổi thành `w2e`.
- 04/11/2026: thêm "Nhớ máy này" (`55bb10d`); đổi tone trắng-xám-đen, bỏ cam đất + nền kem, sửa lệch compact và dải hở header bảng (`8659563`, `cfec72c`; design system `9280adc`).
-02/11/2026: chốt lại tài liệu theo code live80cbc37; lưu handoff cũ vào docs lịch sử; bắt đầu nghiên cứu dashboard pre-TGE, không thay code hoặc data live.

# HANDOFF — 0xhieu.xyz

Chốt bàn giao: 06/11/2026 (Asia/Saigon). Code đang live: commit mới nhất trên main (06/11: xám trung tính, bút dạ, thẻ Work đen/trắng). Handoff này thay các mô tả cũ; lịch sử được giữ ở [docs/handoff-history-through-2026-11-02.md](docs/handoff-history-through-2026-11-02.md).

## Repo và vận hành

- Local: `D:/Files/Claude/website_personal_0xhieu`. GitHub: https://github.com/KattyFury/website_personal_0xhieu, nhánh main.
- Production: https://0xhieu.xyz. Cloudflare Pages project `0xhieu-xyz`, auto-deploy main. Push GitHub rồi xác minh production.
- Design source: `D:/Files/Claude/repo_personal_design`, main `fd14198`. `tokens.json` → `export_web.py` → `web.css`; website dùng CSS sinh ra `design-tokens.css` có hash.
- Trang: CV `/`, Valuation `/valuation`, Work `/work`. `/airdrop` redirect sang `/work`. CV tiếng Anh cố định; Valuation/Work có VI/EN.
- `index.html`: giao diện/CSS component/JS. `functions/api/val.js`: dữ liệu Valuation. `functions/api/val-fetch.js`: Fetch SURF/CoinGecko. `functions/api/private.js`: CRUD Work. `functions/api/wte.js`: Work public.
- `functions/valuation.js`: SSR đọc KV, điền hệ số/market/table để crawler đọc được. Công thức và markup phải khớp client nếu sau này sửa.

## Luật làm việc đã chốt

- Khi anh yêu cầu sửa/deploy, làm xong và deploy, không đòi duyệt preview. Tự QA browser thật và production.
- Hướng thiết kế/bố cục mới phải đưa phương án để anh chốt; không tự sáng tác thay framework. Thay đổi nội dung/nút/màu đã yêu cầu thì triển khai đủ phạm vi.
- Không sửa công thức Valuation chỉ để thêm tính năng hoặc làm UI. Ngày02/11 anh xác nhận dữ liệu và logic3 box legit, giữ nguyên.
- Không in/commit secret. Secret chung: `D:/Files/Claude/.secrets/keys.env`; production dùng encrypted bindings. Admin credential `ADMIN_PASS`; key SURF local tên `SURF_API`, runtime `SURF_API_KEY`. Không ghi giá trị vào handoff/chat/script args.
- Không nhắn người khác hoặc tự gửi thông báo ra dịch vụ ngoài.

## Design đang dùng

Chi tiết chuẩn tại [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md), ưu tiên hiện trạng này hơn các log cũ.

- Tone trắng-xám-đen (anh chốt 04/11/2026). Text thường đen; phụ xám; cam `#FFA111` chỉ cho nút, control đang chọn và highlight. Highlight = bút dạ: chữ đen đậm600 trên nền cam (06/11). CẤM cam đất `#B84A0C` và nền kem `#FEF5D9`.
- Header box/bảng nền xám trung tính `#E5E5E5` (token product `--ds-color-surface`, 06/11 thay mist `#ECF0F8`), chữ đen. Thân box trắng. Popup xám, ô nhập trắng, focus đen. Trong CSS site `--mist` giờ trỏ vào token này (khai trên body). Không đổi lại cam đặc/cam đất/kem/xanh.
- Cả3 trang/navbar/footer chung frame border-box max1280, inset24 desktop/16 mobile. CV spacious chỉ khác khoảng dọc/nội bộ, không khác trục ngang.
- Work/Valuation compact: card paddingX12, sectionY8, gap12; header16/24/600; body14/20. Card/control/badge radius8, popup16.
- Nút/action icon bấm được có shadow `0 2px 8px rgba(0,0,0,.32)`; card/chip/read-only/disabled không bóng. Tab nav/link chữ giữ kiểu text.
- VI/EN: một native button role=switch, một thumb trượt, không phải2 nút tròn. Desktop80×40/mobile64×32. Shadow trên control tổng.
- Thẻ trong header card Work (06/11): nền đen chữ trắng cho rank S, nhãn work-to-earn (thay rank w2e), high-potential, narrative top 5 của box Narrative đang hot (lấy `narrativeRanking()` lúc render, tự đổi theo data). Còn lại trắng viền chữ đen; không còn chữ xám trên thẻ.
- Work mỗi dự án một thẻ: desktop2/hàng, ≤900px1/hàng. DAILY nền xám trung tính, không viền cam; task đen đậm400, rê chuột mới đậm600. Task không cắt chữ.
- Rank Work: một thanh liền248×48 với vùng cam trượt qua w2e/S/A/B/C (`$` trông giống `S` nên đã đổi). Kéo/click/phím và scroll spy. Pointer move/up theo window để cuộn không làm mất thao tác. Nhãn rank trong card nền trắng/viền/chữ xám, đồng cấp nhãn phân loại.
- CV hero top96/48, section gap64/32, body16/24. Giữ nội dung và tagline `Sharing POVs on Crypto and AI`.

## Valuation: UI và dữ liệu

- Bảng7 cột,8 hàng hiện trên desktop/mobile. Header56, row40; cuộn trong bảng, không tràn page. Mobile ẩn Narrative/TGE/ATL.
- Giữ thứ tự ngày TGE cũ→mới. Mỗi lần mở Valuation tự cuộn bảng tới cuối (dự án mới nhất), kể cả tải data chậm; không cuộn page, không ép xuống cuối khi chỉ đổi ngôn ngữ/render khác.
-3 box phụ cao cố định328: desktop3 cột, tablet/mobile2 cột bằng nhau. Nhãn trái, giá trị phải; thân dài thì cuộn.
- ATH `đầu → cuối (×N)` trên1 dòng: hai số đen600, tỷ số bút dạ. Ticker VC FDV<300M đen đậm, ≥300M bút dạ, không chấm cam. Số chính 3 box cũng bút dạ, trừ Hero or Zero giữ chữ đỏ.
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

- Số nhấn: bút dạ (chữ đen trên nền cam). Số đỏ Hero or Zero: giữ đỏ. Xám: trung tính `#E5E5E5`, đậm hơn mist một chút.

## Công việc tiếp theo (chỉ thảo luận)

Anh đề xuất dashboard quan sát dự án chưa TGE để tham gia airdrop: tên/X/Discord/narrative/TGE/hướng tham gia/hoạt động X. Chưa chốt UI, route, kiến trúc, chưa cho phép thay Work hoặc Valuation để nhét dashboard. Đã thăm dò SURF API, phương án ở `docs/SURF_PRE_TGE_DASHBOARD.md`. Không tự build/deploy dashboard mới khi mới đang bàn ý tưởng.

## Nhật ký bàn giao

- 06/11/2026: xám trung tính `#E5E5E5` thay mist (design system `47fc26f`); số nhấn kiểu bút dạ; thẻ Work đen/trắng theo rank/potential/narrative top 5 (ban đầu top 4, anh đổi thành 5 cùng ngày). Ảnh QA ở Desktop `0xhieu-2026-11-06`. Chụp headless Chrome ở 390 bị cắt mép phải cả production — là giới hạn của headless, không phải lỗi trang.

- 04/11/2026: DAILY đổi sang nền xám, bỏ chữ đậm sẵn và viền cam; nhãn rank `$` đổi thành `w2e`.
- 04/11/2026: thêm "Nhớ máy này" (`55bb10d`); đổi tone trắng-xám-đen, bỏ cam đất + nền kem, sửa lệch compact và dải hở header bảng (`8659563`, `cfec72c`; design system `9280adc`).
-02/11/2026: chốt lại tài liệu theo code live80cbc37; lưu handoff cũ vào docs lịch sử; bắt đầu nghiên cứu dashboard pre-TGE, không thay code hoặc data live.

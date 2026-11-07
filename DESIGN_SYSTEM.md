# 0xhieu.xyz — Design system v3

Nguồn: repo_personal_design/tokens.json → export_web.py → web.css → design-tokens.css. Quy tắc product 0xhieu-xyz được user chốt 2026-11-01, ưu tiên hơn profile chung và mọi log màu cũ.

## Bento V2 — user chốt 07/11/2026 (ƯU TIÊN hơn mọi mục bên dưới nếu mâu thuẫn)

- Nền trang canvas `#F2F2F0`; mọi khối là ô (tile) trắng bo 20, không viền, không bóng; ô cách nhau 12 (mobile 10). Kẻ mảnh trong ô `--hair #ECECEA` (thay `--line` trong bảng/danh sách/task).
- Navbar: viên trắng nổi, tab là viên, tab đang chọn nền vàng `#F5B301` chữ đen. VI/EN: máng trắng, thumb đen chữ trắng.
- Nhãn đầu ô: chữ 14/600 xám + icon 16, không còn dải header xám.
- CV: lưới 4 cột desktop / 2 cột ≤1024 — hero (span 2) · ô VÀNG "500+ Community" · ô "Say hi" (nút nền canvas, phẳng) · Experience (chip năm + nội dung) · Highlights (mỗi ảnh một ô) · Available for (viên canvas).
- Valuation: 3 ô trên bảng — Mặt bằng định giá = ô VÀNG (số không bút dạ, nút Dự đoán nền đen chữ vàng), Hero or Zero = ô ĐEN `#161616` (số giữ bút dạ), Narrative = ô trắng. Bảng nằm trong ô trắng bên dưới, header nền trắng chữ xám. Công thức/SSR không đổi.
- Work (user chốt 07/11): tiêu đề trang "Work-to-earn" (cả VI/EN); thứ tự **Box "Dự án & hướng dẫn tham gia" → checklist Hôm nay → checklist Tuần này**. Box dự án = 1 dropdown `<details>` mặc định GẬP (chỉ hàng tiêu đề + số dự án + mũi tên), nhóm theo l2g/cá nhân/w2e/S…C, mỗi dự án 1 hàng `<details>` gập: logo 36 · tên · thẻ · ⋮ (admin) · mũi tên; mở ra = link Website/X/Discord + Get Started. Checklist ngày = ô vàng + danh sách mọi DAILY; checklist tuần = ô đen (vòng vàng) + mọi WEEKLY; thứ tự l2g → cá nhân → w2e → S…C. Tick lưu localStorage (`wte-done` theo ngày, `wte-done-week` theo tuần từ thứ Hai), chỉ trên máy đang dùng. Daily/Weekly không lặp trong hàng dự án. Hàng tiêu đề trang nằm thẳng trên nền canvas, không có nền trắng; nút + là viên tròn trắng không viền.
- Bảng TGE mobile: thiếu chỗ thì BỎ BỚT yếu tố, không bắt kéo ngang — ẩn Narrative/TGE/ATL, ô ×ATH bỏ phần "đáy →" chỉ còn "đỉnh (×N)" (`.ath-from`, cột đo bằng `--ck5m`).
- Nút liên hệ, link trong ô, nút Dự đoán: phẳng. Nút điều khiển nổi (Admin, camera, mèo) giữ bóng. Đã BỎ thanh kéo chọn rank (user chốt 07/11).

## Phân vai màu hiện hành

- Tone trắng-xám-đen (user chốt 04/11/2026). Trang và thân box trắng #FFFFFF; header box/bảng, popup và DAILY xám trung tính #E5E5E5 (token product `--ds-color-surface`, user chốt 06/11/2026 thay mist #ECF0F8 ngả xanh); viền line #DCE3EE.
- Đen #000000: nội dung thường và hai số đầu/cuối ATH. Chữ phụ, metadata, caption: MỘT màu xám trung tính #525252 (grey = muted, user chốt 06/11/2026, bỏ xám ngả xanh #4B5568/#8B95A8).
- Đường kẻ, viền (`--line`): mỏng 1px, xám trung tính #A3A3A3 — đậm hơn nền header #E5E5E5, nhạt hơn chữ phụ #525252 (user chốt 06/11/2026; bỏ #DCE3EE ngả xanh, user không nhận đen). Không bao giờ 2 đường kẻ chồng nhau thành 2px. Nền ô/nút bị vô hiệu dùng xám surface, không dùng `--line`.
- Cam #F5B301 CHỈ cho nút, control đang chọn và highlight; chữ trên nền cam là đen. Không dùng cam cho chi tiết trang trí (chấm timeline màu đen).
- Header box/bảng: nền xám trung tính, chữ đen; không dùng cam hay kem cho mảng lớn.
- Chữ nhấn kiểu bút dạ (user chốt 06/11/2026): chữ đen đậm600 trên nền cam #F5B301, đệm ngang4, không bo; gồm tỷ số ATH, ticker VC FDV≥300M, ×TGE≥13 và số chính cả 3 box, kể cả Hero or Zero (user bỏ chữ đỏ ở đây 06/11). Không tô toàn bộ ô ATH cam; không còn chữ cam trên nền trắng. CẤM cam đất #B84A0C và nền kem #FEF5D9 trên site này; `tools/ds-audit.js` báo lỗi nếu chúng quay lại.
- DAILY nền xám trung tính, không viền cam; nhãn/icon đen; task text đen đậm400, rê chuột mới đậm600 như mọi thứ bấm được. Không đổi nội dung/thứ tự/link hay số cột.
- Đỏ chỉ dành cho nguy hiểm và thao tác phá hủy. Theme xanh trước đây hết hiệu lực; global palette của sản phẩm khác không đổi.
- Hover nút cam chuyển nền đen/chữ trắng. Hover chữ giữ màu đen. Header link giữ chữ đen và underline. Input focus viền đen.

## Component chung, hai profile density

Cả3 trang dùng cùng token product: card/control/badge radius8, viền line, cùng font hệ thống và palette. Popup radius16; avatar/language switch tròn. Thẻ/nhãn chỉ đọc không bóng. Nút và icon control bấm được có shadow0 2px 8px rgba(0,0,0,.32); disabled không bóng. Link chữ/tab nav giữ kiểu text. Popup xám với ô nhập trắng, focus cam.

- CV spacious: hero top96/48, section gap64/32, body16/24, caption/nhãn padding16. Không ép spacing Work vào CV.
- Valuation/Work compact: padding ngang thẻ12, section dọc8, khe12. Nội dung/task14/20; không giảm dưới14 để nhét dữ liệu. Header16/24 600, Valuation mobile14/20 600. Chữ dài được wrap, không cắt task/tên/tag.
- Khung CV/Valuation/Work/navbar/footer max1280px gồm padding, căn giữa. Cả ba trang và navbar/footer dùng cùng padding ngang24 desktop/16 mobile; spacious/compact chỉ khác spacing bên trong. Không quay lại fluid không giới hạn.
- Cỡ chữ theo token; 400/600, 700 dành cho tiêu đề lớn. Số tabular-nums. Mọi thay đổi bố cục/kích thước mới phải được user chốt; user không muốn duyệt preview, cần tự QA trang thật.

## CV

Giữ nội dung tiếng Anh và tagline Sharing POVs on Crypto and AI. Hero portrait112/72, mobile chuyển phần giới thiệu xuống dưới. Avatar viền line, không vòng vàng. Tiêu đề section icon/chữ, không đường kẻ trang trí kéo dài. Nội dung CV đen; địa điểm, năm và caption xám. Social buttons có shadow, Highlights/Available-for nền xám/viền/radius8 không shadow. Mobile ba social CTA cùng hàng, cao48, chữ14/icon16; Available-for wrap nếu thiếu chỗ.

## Valuation

- Khi mở tab Valuation, bảng giữ thứ tự TGE cũ→mới và tự cuộn dọc tới cuối để thấy dự án mới nhất; chờ dữ liệu tải xong nếu cần. Chỉ cuộn bảng, không cuộn page; các lần render khác không ép người dùng về cuối.
- Narrative dùng đúng một nhóm chính/dự án trong17 nhóm: stablechain, layer-1, layer-2, infra, ai, zk, privacy, identity, rwa, defi, trading, payment, bitcoin, prediction, game, social, desci. Chọn theo tag và mô tả SURF; ZK proving khác Privacy. Không nhân một dự án vào nhiều nhóm khi tính trung vị.
- Bảng hiện8 token trên desktop và mobile, hàng40, header56. Tổng cao56+8×40+viền2+scrollbar. Cột đo theo content, header/body cùng cột và cuộn đồng bộ. Mobile ẩn Narrative/TGE/ATL và phần "đáy →" của ×ATH để vừa khung, không kéo ngang.
- ATH `đầu → cuối (×N)` một hàng: hai số đen đậm600; chỉ `(×N)` cam #F5B301 đậm600, cả bảng chính/popup và ATH tuần đầu. N=cuối/đầu từ số gốc, làm tròn2; client/server cùng công thức.
- Ticker dưới VC FDV300M đen đậm; từ300M cam #F5B301 đậm; không chấm màu.
- Ba box phụ cố định328, nội dung dài cuộn trong thân. Desktop3 cột, tablet2, mobile2 cột bằng nhau; không box nào tự span cả hàng. Nhãn/tên trái, số phải; hàng min56 để hiện đủ dữ liệu.
- Toolbar luôn1 hàng, chữ co20/18/16/14 và control mobile32 theo yêu cầu product đã chốt.
- Form thêm/sửa: Fetch trái/Lưu phải, Xoá riêng dưới khi sửa; không input Cặp Binance. Fetch chỉ điền ô trống có bằng chứng, không ghi KV, không làm tròn số fetch, không ghi đè edits trong lúc request. Key SURF/CoinGecko chỉ trên server. Không đổi framework/hệ số/priceTGE để phục vụ tính năng hay giao diện.

## Work

Thứ tự thẻ trong mỗi rank (user chốt 06/11/2026): high-potential trước, rồi narrative đang hot (top 5 Narrative của Valuation), rồi thứ tự thẻ phân loại WTE_TYPES.

Thẻ trong header card (user chốt 06/11/2026): thẻ quan trọng nền đen chữ trắng — rank S, nhãn work-to-earn (đóng vai rank w2e), high-potential, narrative nằm trong top 5 box Narrative đang hot của Valuation (so tên không phân biệt hoa thường, tự đổi theo data). Còn lại (rank A/B/C, low-potential, narrative khác) nền trắng viền line chữ đen.

Tham khảo Linear Board theo user chọn. Mỗi công việc/dự án là thẻ độc lập. Desktop2 thẻ/hàng; ≤900px1 thẻ/hàng. Gap12, căn đầu, cao theo nội dung. Header padding12; các section Get Started/DAILY/Weekly có nhãn trên, task dưới. DAILY nhấn bằng nền xám trung tính; nhãn, icon và nội dung task đen, task chỉ đậm khi rê chuột. Task min40 desktop/44 mobile hoặc touch. Giữ đủ nội dung/link/admin. Rank là một thanh liền248×48 với một vùng cam trượt qua w2e/S/A/B/C; kéo/click/phím mũi tên để tới nhóm, cuộn trang đồng bộ vị trí sáng. Không dùng5 nút tròn. Filter cuối trang chừa96 để không che task cuối. Route/work; /airdrop301 và client fallback giữ query/hash.

## Đồng bộ và kiểm tra

1. Repo nguồn: python export_web.py.
2. Website: python tools/sync-design-system.py.
3. python tools/check-design-system.py --source D:/Files/Claude/repo_personal_design.
4. node tools/ds-audit.js <url>; node --test tests/val-fetch.test.mjs nếu sửa Fetch.
5. Browser320–1920px, desktop/touch, ba trang và popup, header/text/hover, overflow,8 hàng/panel328/Work2-1, nguồn dữ liệu không đổi. Kiểm tra lại production sau deploy.

Tham khảo: [Linear Board](https://linear.app/docs/board-layout), [Radix spacing](https://www.radix-ui.com/themes/docs/theme/spacing), [Radix Table](https://github.com/radix-ui/themes/blob/main/packages/radix-ui-themes/src/components/table.css), [Carbon Table](https://www.carbondesignsystem.com/building-blocks/core/components/data-table/guidelines). Số cột, khung1280, panel328/header56 và palette product là quyết định riêng đã được user duyệt, không gán cho thư viện.

## VI/EN

Work và Valuation dùng đúng một native button role=switch, aria-checked false=VI/true=EN, với hai nhãn và một thumb trượt. Chỉ control tổng thể có shadow; không có hai nút tròn hoặc shadow riêng cho từng nhãn. Desktop80×40, mobile64×32, giữ toolbar một hàng. Click/Space/Enter chuyển trạng thái; animation180ms và tắt khi prefers-reduced-motion. Rank filter dùng component riêng, không đổi hành vi.

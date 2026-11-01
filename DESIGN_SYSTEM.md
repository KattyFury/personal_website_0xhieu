# 0xhieu.xyz — Design system v3

Nguồn: repo_personal_design/tokens.json → export_web.py → web.css → design-tokens.css. Quy tắc product 0xhieu-xyz được user chốt 2026-11-01, ưu tiên hơn profile chung và mọi log màu cũ.

## Phân vai màu hiện hành

- Trang trắng #FFFFFF; thân box xám mist #ECF0F8; viền line #DCE3EE.
- Đen #000000: nội dung thường, tên, hai số đầu/cuối ATH. Xám #4B5568: nhãn phụ, metadata, caption; muted #8B95A8 dành cho metadata nhẹ.
- Xanh cobalt #1E6DF7: primary action, selected state, header box/bảng, dấu mốc timeline. Header/nút nền xanh dùng chữ trắng.
- Xanh đậm cùng tone #0F3DB2: chữ quan trọng trên nền xám hoặc xanh nhạt, đậm600. Ví dụ tỷ số ATH, ticker VC FDV≥300M, số liệu cần nhấn. Không tô toàn bộ dòng dữ liệu xanh.
- DAILY nền blue-soft #E8F0FE, nhãn/icon xanh đậm. Đỏ #C42B3F/red-soft chỉ dành cho nguy hiểm và thao tác phá hủy; không làm màu trang trí.
- Bỏ cam/vàng/cam đất khỏi palette giao diện. Không suy diễn việc đổi palette thành sửa màu ảnh/logo bên ngoài.
- Hover trên nền xanh giữ chữ trắng và underline tên/link header; nút chính chuyển blue-strong, không để chữ xanh chìm vào nền xanh.

## Component chung, hai profile density

Cả3 trang dùng cùng token product: card/control/badge radius8, viền line, cùng font hệ thống và palette. Popup radius16; avatar/language switch tròn. Thẻ/nhãn chỉ đọc không bóng. Nút và icon control bấm được có shadow0 2px 8px rgba(0,0,0,.32); disabled không bóng. Link chữ/tab nav giữ kiểu text. Popup xám với ô nhập trắng, focus xanh.

- CV spacious: hero top96/48, section gap64/32, body16/24, caption/nhãn padding16. Không ép spacing Work vào CV.
- Valuation/Work compact: padding ngang thẻ12, section dọc8, khe12. Nội dung/task14/20; không giảm dưới14 để nhét dữ liệu. Header16/24 600, Valuation mobile14/20 600. Chữ dài được wrap, không cắt task/tên/tag.
- Khung CV/Valuation/Work/navbar/footer max1280px gồm padding, căn giữa. CV padding48 desktop/16 mobile; workspace24/16. Không quay lại fluid không giới hạn.
- Cỡ chữ theo token; 400/600, 700 dành cho tiêu đề lớn. Số tabular-nums. Mọi thay đổi bố cục/kích thước mới phải được user chốt; user không muốn duyệt preview, cần tự QA trang thật.

## CV

Giữ nội dung tiếng Anh và tagline Sharing POVs on Crypto and AI. Hero portrait112/72, mobile chuyển phần giới thiệu xuống dưới. Avatar viền line, không vòng vàng. Tiêu đề section icon/chữ, không đường kẻ trang trí kéo dài. Nội dung CV đen; địa điểm, năm và caption xám. Social buttons có shadow, Highlights/Available-for nền xám/viền/radius8 không shadow. Mobile ba social CTA cùng hàng, cao48, chữ14/icon16; Available-for wrap nếu thiếu chỗ.

## Valuation

- Bảng hiện8 token trên desktop và mobile, hàng40, header56. Tổng cao56+8×40+viền2+scrollbar. Cột đo theo content, header/body cùng cột và cuộn đồng bộ. Mobile ẩn Narrative/TGE/ATL; thiếu chỗ cuộn trong bảng, không tràn page.
- ATH `đầu → cuối (×N)` một hàng: hai số đen đậm600; chỉ `(×N)` xanh đậm600, cả bảng chính/popup và ATH tuần đầu. N=cuối/đầu từ số gốc, làm tròn2; client/server cùng công thức.
- Ticker dưới VC FDV300M đen đậm; từ300M xanh đậm; không chấm màu.
- Ba box phụ cố định328, nội dung dài cuộn trong thân. Desktop3 cột, tablet2, mobile2 cột bằng nhau; không box nào tự span cả hàng. Nhãn/tên trái, số phải; hàng min56 để hiện đủ dữ liệu.
- Toolbar luôn1 hàng, chữ co20/18/16/14 và control mobile32 theo yêu cầu product đã chốt.
- Form thêm/sửa: Fetch trái/Lưu phải, Xoá riêng dưới khi sửa; không input Cặp Binance. Fetch chỉ điền ô trống có bằng chứng, không ghi KV, không làm tròn số fetch, không ghi đè edits trong lúc request. Key SURF/CoinGecko chỉ trên server. Không đổi framework/hệ số/priceTGE để phục vụ tính năng hay giao diện.

## Work

Tham khảo Linear Board theo user chọn. Mỗi công việc/dự án là thẻ độc lập. Desktop2 thẻ/hàng; ≤900px1 thẻ/hàng. Gap12, căn đầu, cao theo nội dung. Header padding12; các section Get Started/DAILY/Weekly có nhãn trên, task dưới. Task min40 desktop/44 mobile hoặc touch. Giữ đủ nội dung/link/admin. Filter rank có chức năng cũ, cuối trang chừa96 để không che task cuối. Route/work; /airdrop301 và client fallback giữ query/hash.

## Đồng bộ và kiểm tra

1. Repo nguồn: python export_web.py.
2. Website: python tools/sync-design-system.py.
3. python tools/check-design-system.py --source D:/Files/Claude/repo_personal_design.
4. node tools/ds-audit.js <url>; node --test tests/val-fetch.test.mjs nếu sửa Fetch.
5. Browser320–1920px, desktop/touch, ba trang và popup, header/text/hover, overflow,8 hàng/panel328/Work2-1, nguồn dữ liệu không đổi. Kiểm tra lại production sau deploy.

Tham khảo: [Linear Board](https://linear.app/docs/board-layout), [Radix spacing](https://www.radix-ui.com/themes/docs/theme/spacing), [Radix Table](https://github.com/radix-ui/themes/blob/main/packages/radix-ui-themes/src/components/table.css), [Carbon Table](https://www.carbondesignsystem.com/building-blocks/core/components/data-table/guidelines). Số cột, khung1280, panel328/header56 và palette product là quyết định riêng đã được user duyệt, không gán cho thư viện.

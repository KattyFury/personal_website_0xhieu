# 0xhieu.xyz — Design system v3

Nguồn chung: [repo_personal_design](https://github.com/KattyFury/repo_personal_design), `README.md`, `tokens.json` v3 và `web.css` xuất từ token. Chốt 2026-11-01. Website dùng bản local `design-tokens.css`, không tải remote CSS runtime.

## Thứ tự ưu tiên

1. Yêu cầu người dùng cho website và `tokens.json → products.0xhieu-xyz`.
2. Pattern/component trong design system v3.
3. Profile `spacious` hoặc `compact` của trang/vùng.

Không tự tạo ngoại lệ trong CSS rồi ghi ngược thành chuẩn. Sửa token trước nếu đó là giá trị shared; ngoại lệ product phải có tên/phạm vi. Figma cũ chưa đồng bộ v3.

## Nguồn tham khảo

- [Radix spacing](https://www.radix-ui.com/themes/docs/theme/spacing): scale 4/8/12/16, density điều chỉnh theo component.
- [Radix Table CSS](https://github.com/radix-ui/themes/blob/main/packages/radix-ui-themes/src/components/table.css): padding cell 8, phân tách bằng line.
- [shadcn Tasks](https://github.com/shadcn-ui/ui/blob/main/apps/v4/app/%28app%29/examples/tasks/components/data-table.tsx): một workspace theo dòng, không lồng card/nhãn/bề mặt.
- [Carbon table](https://www.carbondesignsystem.com/building-blocks/core/components/data-table/guidelines): row32 dense desktop/40 mặc định. Header56 và panel328 là yêu cầu riêng của user, không gán cho Carbon.
- [Linear Board](https://linear.app/docs/board-layout): hướng tham khảo thẻ Work đã được user chọn; số cột, DAILY và màu giữ theo bản duyệt riêng của website.

## Màu và typography

Giữ nguyên màu website: ground trắng, ink đen, grey #4B5568, muted #8B95A8, mist #ECF0F8, line #DCE3EE, vàng mắt mèo #FFA111, chữ cam orange-text #B84A0C, yellow-soft #FEF5D9, red-text #C42B3F và red-soft #FDE8EB. Các alias lấy từ CSS token export; palette global 0x Blue không bị đổi.

Font hệ thống theo token. Nội dung16/24, dữ liệu/task14/20, nhãn14/20 600, panel16/24 600, tiêu đề màn24/32; mobile toolbar20/18/16/14 theo chỗ. Số dùng tabular-nums. Không thu dữ liệu dưới14. Không cắt task/tên/tag. Hover chỉ đổi màu, không thay độ rộng chữ hay nâng card.

Cả CV/Valuation/Work dùng chung `--ds-product-card-radius`, `--ds-product-control-radius`, `--ds-product-badge-radius` =8 từ `products.0xhieu-xyz.sharedComponents`. Valuation/Work dùng thêm token density `--ds-workspace-*`: header trắng, padding ngang12, section dọc8, khe12. Popup radius16; dòng dữ liệu0, avatar/language switch tròn. Nút và icon control bấm được có drop shadow chung `0 2px 8px rgba(0,0,0,.32)`; disabled, thẻ/nhãn/nội dung chỉ đọc không có bóng. Tab điều hướng và link văn bản giữ kiểu chữ. Không đổ bóng lên cả wrapper toolbar/popup thay cho nút. Focus2px/offset2. Không invent màu/gradient hay điểm số trang trí.

## Trang CV `/` — spacious/editorial

- Khung tối đa1280px gồm padding, căn giữa cho CV, Valuation, Work và navbar. CV padding48 desktop/16 mobile; workspace24/16.
- Hero editorial: portrait112 desktop, tên/thông điệp cùng trục bên cạnh; mobile portrait72, thông điệp xuống dưới. Hero top96/48; section gap64/32.
- Giữ nguyên nội dung CV tiếng Anh và tagline **Sharing POVs on Crypto and AI**.
- CTA xã hội, thẻ ảnh Highlights và nhãn Available-for dùng component chung của product: radius8, nền trắng, viền line. CTA bấm được có shadow; thẻ/nhãn chỉ đọc không bóng. CTA cao48 theo spacious; caption/nhãn giữ padding16. Mobile ba CTA cùng hàng, chữ14/icon16, chiều cao48. Available-for được xuống dòng để không tràn màn320px.
- Avatar giữ hình tròn với viền line; không vòng vàng trang trí. Tiêu đề section icon + chữ, không đường kẻ kéo dài. Màu vàng của timeline thể hiện mốc thời gian.
- Body đọc tối đa680; timeline và ảnh/caption giữ nội dung hiện có. Không áp spacing landing vào hai workspace.

## Valuation `/valuation` — compact/data workspace

- Header bảng chính/popup/ba box dùng chung `--val-header-*` từ token: cao56; desktop16/24 600, mobile14/20 600; nền trắng và viền line theo header thẻ Work. Vàng nhạt là highlight có ý nghĩa (DAILY), không phải màu mặc định mọi header.
- Bảng hiện8 token trên cả desktop/mobile, dòng40. Cao nội dung56 + 8×40; cộng viền2 và scrollbar nếu có. Tất cả ô đo theo content; header/body cùng cột và cuộn đồng bộ. Mobile ẩn Narrative, TGE, ATL; màn thiếu chỗ cuộn ngang trong bảng, không ép ATH xuống dòng hay giảm chữ.
- ATH `đầu → cuối (×N)` một hàng, N=cuối/đầu từ số gốc, làm tròn2; tỷ số cam đậm. Client/server cùng công thức. Ticker đậm600: FDV VC dưới300M đen, từ300M cam, không chấm.
- Ba box phụ cố định328. Nhãn/tên trái, giá trị phải; mỗi dòng min56 và được tăng để hiện đủ nội dung. Nội dung dài cuộn trong thân. Không thêm dòng trống.
- Desktop3 cột (tablet2), mobile2 cột bằng nhau; không tự cho box nào span cả hàng. Khe12 dùng chung với Work.
- Header màn luôn một hàng; mobile control nhìn thấy32 là ngoại lệ đã duyệt. Title co20/18/16/14; không làm mất nút.

## Work `/work` — compact/task workspace

- `/airdrop` và `/airdrop/` chuyển301 sang `/work`; client fallback giữ query/hash. Audit và nav dùng `/work`.
- User duyệt hướng Linear: mỗi công việc/dự án một thẻ độc lập, viền line, radius8, không gộp thành bề mặt chung.
- Desktop2 thẻ mỗi hàng; màn≤900px chỉ1 thẻ mỗi hàng. Khe12. Các thẻ căn đầu, chiều cao theo nội dung.
- Header thẻ padding12; từng phần Get Started/DAILY/Weekly nằm dưới, nhãn trên và nội dung dưới. DAILY nền yellow-soft, nhãn/icon orange-text đậm; header giữ nền trắng.
- Section padding8px 12px; task min40 desktop/44 mobile hoặc touch; chữ14/20, giữ đầy đủ nội dung và link. Group gap16. Metadata/tag được xuống dòng.
- Toàn bộ field/link/admin vẫn hoạt động. Rank filter nổi giữ chức năng, cuối trang chừa96 cho vùng toolbar, không dùng khoảng này giữa dự án.

## Component và responsive

Navbar và nội dung đều có max-width1280px, gồm padding; spacious dùng padding48/16, compact24/16. Body dùng `data-ds-product` và `data-ds-profile` để đổi geometry, không gắn global48 vào workspace. Thay đổi bố cục/kích thước tiếp theo phải được user duyệt trước.

Popup/input/button dùng component compact; input mobile16, vùng thao tác chính tối thiểu44 touch. Popup có khóa nền, cuộn và Escape theo hành vi hiện tại. Form đang nhập không tự mất do backdrop.

## Đồng bộ và kiểm tra

1. Trong repo design system: `python export_web.py`.
2. Trong website: `python tools/sync-design-system.py --source <repo_personal_design>`.
3. `python tools/check-design-system.py --source <repo_personal_design>` kiểm hash bản xuất và thiếu token.
4. `node tools/ds-audit.js <url>` kiểm màu/type/spacing/radius/control theo profile.
5. Kiểm browser320/360/390/430/640/768/1024/1440, VI/EN, touch, data dài/rỗng, popup, nav/back/forward, link cũ301. Chụp và xem ảnh thật cả3 trang.

Mọi sửa hình học của Valuation phải giữ8 dòng, header đồng nhất, panel328 và ATH một hàng. Mọi sửa Work phải giữ nguyên nội dung/link. Không đổi backend/data hay công thức định giá chỉ để phục vụ layout.

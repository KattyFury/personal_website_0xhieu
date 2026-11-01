# Luật thiết kế — 0xhieu.xyz

> Chốt 2026-10-24. Site theo **design system nguyen0xhieu** (Figma `hieu` `IPyKVg7ylGw1mjMRyYVrL7` · bản đọc nhanh: Design System artifact), với 1 biến thể riêng cho site này:
> **ĐEN thay vai trò 0x Blue** (iconic là mèo đen) · **nền TRẮNG** (mắt kính trắng của mèo) · **VÀNG MẮT MÈO** cho chi tiết thiết kế.
> Code ở khối `<style>` duy nhất trong `index.html`, viết theo thành phần, cùng thứ tự các mục dưới đây. Mọi luật ở design system gốc mà file này không nhắc → làm theo gốc.
> **Mật độ:** CV dùng spacious; Valuation/Work/popup dùng compact theo repo design system v2, chi tiết ở §2. Luật gọn theo 16 trước đây đã được thay thế.

---

## 1. Màu

| Token | Mã | Dùng cho |
|---|---|---|
| `--ground` | `#FFFFFF` | Nền trang |
| `--ink` | `#000000` | Màu chủ đạo: chữ chính · icon · **nút chính** (nền đen chữ trắng) · toggle đang chọn · thẻ rank S/A/B/C · viền focus 2px |
| `--grey` | `#4B5568` | Chữ phụ (mô tả, bullet, nhãn) — mã design system, 7.5:1 |
| `--muted` | `#8B95A8` | Meta, placeholder, ngày, chữ tắt. **Không** dùng cho chữ cần đọc để làm theo |
| `--mist` | `#ECF0F8` | Box phẳng · dòng danh sách · ô nhập · header card Work rank S/A/B/C · hover dòng bảng |
| `--line` | `#DCE3EE` | Kẻ mảnh · viền ô nhập · **nền nút tắt** |
| `--amber` | `#FFA111` | **Vàng mắt mèo** (lấy đúng từ `icon.png`): khối, chấm, vạch. **Chữ trên nền vàng luôn đen** (10.4:1), không bao giờ trắng |
| `--amber-text` | `#B84A0C` | **CHỈ cho số liệu Valuation.** Chữ cam = **`orange-text` của design system**: 5.2:1 trên trắng · 4.6:1 trên mist · 4.8:1 trên `--amber-soft`. Vàng mắt mèo `#FFA111` không làm chữ được (2:1) |
| `--amber-soft` | `#FEF5D9` | = **`yellow-soft` của design system** (gần hue mắt mèo nhất): header card · header bảng · ô kết quả · nền hover nút phụ/dòng |
| `--red-text` / `--red-soft` | `#C42B3F` / `#FDE8EB` | Đỏ design system: nguy hiểm, lỗi, xoá |
| `--scrim` | `rgba(0,0,0,.48)` | Nền mờ sau popup + lightbox |

> **Mọi mã màu phải là token của design system** (trừ vàng mắt mèo `#FFA111` do user chốt). Không tự pha màu, kể cả màu hover. `tools/ds-audit.js` sẽ báo màu lạ.

- Chỉ 3 cấp chữ: `ink` · `grey` · `muted`. Không thêm cấp xám thứ 4.
- Tắt (disabled): nền `--line`, chữ `--muted`, bỏ shadow. **Không giảm opacity.**
- Không gradient (solid là mặc định của design system; nếu sau này thêm thì tối đa 1 vùng/màn).
- **Tối đa 2 màu đi kèm/màn:** vàng mắt mèo (màu THIẾT KẾ) + đỏ (màu NGỮ NGHĨA duy nhất: nguy hiểm, lỗi, xoá — `--red-text #C42B3F` chữ, `--red-soft #FDE8EB` nền badge/ô). Rank Work **không** tô mỗi rank 1 màu — rank phân biệt bằng chữ.
- **Số liệu:** số chính/cần chú ý = **chữ cam `--amber-text` (orange-text) đậm 600** (user: chỉ đen + xám thì flat); số nguy hiểm = đỏ; còn lại ink/grey.

**Vàng mắt mèo xuất hiện ở đâu** (chỉ chỗ mang nghĩa hoặc nhận diện, không rải trang trí):
- Vạch dưới tab nav đang chọn · vòng quanh ảnh đại diện · chấm timeline · chấm "Available for".
- Nền `--amber-soft`: header box Valuation, header bảng altcoin, header + dải Daily của card `$`.
- **HOVER ĐỒNG BỘ (chốt 2026-10-25): mọi thứ bấm được có chữ → chữ đổi cam `--amber-text` #B84A0C + đậm 700, KHÔNG gạch chân** (chữ rộng tự do — nút xã hội, link giữa đoạn văn — đậm bằng `-webkit-text-stroke: .6px` để không nhích) (nút nền đen: chữ trắng → vàng mắt mèo `--amber`, vì cam đậm trên đen không đủ tương phản) — tab nav, tên site, tiêu đề màn/box, tên dự án, nút chính/phụ/Admin/VI-EN, nút xã hội, dòng task Work, dòng danh sách admin, dòng bảng sửa được. **KHÔNG đổi màu nền box, KHÔNG nhích box** (user chê "đổi màu box xấu"). Card không bấm được thì không phản ứng hover. Nút chỉ có icon (không chữ) → nền `--mist` (trắng nếu nằm trên nền màu).
- Link chữ (timeline, popup) lúc thường đã gạch chân vàng (giữ để biết là link); hover → chữ cam `--amber-text` + đậm (text-stroke).
- Viên `--amber` chữ đen: nút `$` đang chọn ở thanh lọc.

**Số liệu Valuation:** số thường ink 400 · ×TGE ≥ 13, ×ATH tuần đầu (`×TGE → ×ATH`) = **chữ cam đậm 600** · giá trị bên phải mọi dòng box (Hệ số TGE, Phạt FDV ≥ $300M, Điều kiện thị trường, median narrative) = **chữ cam đậm 600** · ×ATM ≥ 15 trong bảng = viên `--red-soft` chữ `--red-text` · ×ATM trong box Vùng nguy hiểm = chữ đỏ · badge FAKE PUMP/PUMP LÁO = viên `--red-soft` chữ đỏ · ×ATM < 1, ×ATL, đáy-trước-đỉnh = grey · ngày TGE = muted (meta).
- Chấm `--amber` 8px cạnh ticker có vcFDV ≥ $300M.

**Rank (Work):** card `$` (work-to-earn) = header + Daily nền `--amber-soft`, **không có thẻ rank**. Card S/A/B/C = header + Daily nền `--mist`, thẻ `rank: S` nền đen chữ trắng. Thanh lọc: nút đang chọn đen chữ trắng (`$` vàng chữ đen).

## 2. Hai profile web — 2026-11-01

Nguồn chung: [repo_personal_design](https://github.com/KattyFury/repo_personal_design), `README.md` và `tokens.json → webProfiles` phiên bản 2. Website giữ nguyên bộ màu mèo đen/vàng đã chốt ở §1; profile chỉ đổi mật độ và hình học.

| Phần | Profile | Quy tắc hiện tại |
|---|---|---|
| CV `/` | `spacious` | Nội dung tối đa 1200, lề theo lưới cũ; hero đệm trên 96 desktop / 48 mobile; các section cách 64 / 32; nút xã hội 48. CV dạng portfolio dùng h2 24 và tên 40/32 theo nội dung, không bắt buộc hero marketing 72 |
| Valuation `/valuation` | `compact` | Khung co giãn, lề desktop 24/mobile 16; đệm panel 12 (panel nhỏ mobile 8); khe panel 16/12 |
| Work `/airdrop` | `compact` | Nhóm cách 24, tiêu đề nhóm → card 12; card desktop 2 cột khe 16, mobile 1 cột khe 12; header/thân đệm 12; task tối thiểu 40, vùng chạm 44 trên thiết bị cảm ứng, tự cao theo chữ |
| Popup thao tác | `compact` | Ô nhập 40 (touch tối thiểu 44), chữ input mobile vẫn 16; nút chính 40/44; radius control 8; popup giữ radius 16 và shadow Y2 |

### Chữ dùng chung

Font hệ thống Apple như token cũ. Dữ liệu và metadata 14/20, nhãn 14/20 600; thân bài 16/24; tiêu đề panel compact 16/24 600; tiêu đề màn 24/32 desktop, mobile co theo 20/28 → 18/28 → 16/28 → 14/28 để giữ toolbar một hàng (line-height 28 là ngoại lệ toolbar). Các cỡ giữ letter-spacing theo token: 14 −.006em; 16 −.011em; 18 −.014em; 20 −.017em; 24 −.019em; 32+ −.022em. Số dùng `tabular-nums`; nhãn trái, số phải; mobile panel hẹp được xếp nhãn trên/số dưới.

Chữ nội dung không dưới 14. Task không cắt chữ, được tự xuống dòng. Compact giảm đệm và khung trước khi giảm chữ.

### Valuation

- Bảng header 40 + 5 token × 40 = **240px**; danh sách token còn lại cuộn. Giữ cách ẩn cột trên mobile và công thức hiện có.
- Header màn **luôn một hàng**, không wrap/cắt chữ. Mobile nút camera/Admin/VI-EN 32 theo yêu cầu riêng đã duyệt; tiêu đề tự co theo thang 20/18/16/14. Đây là ngoại lệ product cho toolbar, không là chuẩn vùng chạm chung.
- Panel cao theo nội dung, không ép bằng nhau. Hệ số TGE: 3 dòng tối thiểu 32 + nút dự đoán tối thiểu 40, cách 12. Mỗi dòng dùng kẻ `line`, bỏ ô nền/radius và khe riêng.
- Vùng nguy hiểm/Narrative: dòng desktop tối thiểu 48 (tên, metadata); danh sách giới hạn cao 264 và cuộn khi dài. Không thêm dòng rỗng `padRows()`.
- Mobile: Hệ số TGE rộng cả hàng, hai panel nhỏ nằm cạnh nhau khe 12; header tối thiểu 40 (tăng theo chữ), chữ 14/20; dòng tối thiểu 60 để chứa nhãn + metadata + giá trị. Hai box không bắt buộc cao bằng nhau.
- Outer panel bo 16, viền `line`, không shadow; bảng chính giữ shadow hiện có làm vùng dữ liệu chính nổi.

### Work và thao tác

- Task dùng dòng kẻ mảnh, không thẻ bo 16 cho mỗi dòng. Chữ 14/20, không cắt hoặc ép một dòng. Bỏ khe 8 giữa task; nhóm nội dung vẫn có nhãn và khoảng đệm để phân biệt.
- Tiêu đề dự án 16/24; giữ đủ trường và liên kết. Header card vẫn hai hàng để tên/social và nhãn phân loại có chỗ riêng.
- Control nhỏ bo 8; thẻ ngoài bo 16; pill giữ nguyên. Nút toolbar bớt shadow, dùng viền. Native-app button rộng 296 không áp vào nút dự đoán trong panel.
- Thiết bị cảm ứng: task liên kết, nút social/admin card có vùng chạm tối thiểu 44; form/nút chính tối thiểu 44.

## 3. Spacing và kiểm tra

- Spacious dùng nhịp 8; compact dùng nhịp **4**, cho phép 4/8/12/16/24. Mọi màu và shadow vẫn dùng token cũ.
- Không tạo box/biểu đồ/dòng rỗng để lấp chỗ. Chỉ vùng danh sách dài mới có giới hạn chiều cao có chủ đích.
- `tools/ds-audit.js` phân biệt CV spacious và Valuation/Work/popup compact. Không quay lại gác cổng 56px cho mọi dòng hoặc cấm spacing 4/12 và radius 8 ở compact.
- Kiểm tra 320/360/390/430/640/768/1024/1440px, VI/EN, dữ liệu thật, task dài; header Valuation không vỡ; vẫn đủ 5 token/khung; popup mở/đóng được.
- Figma gốc chưa đồng bộ hai profile; nguồn quy tắc mới là repo design system, không coi khung Figma cũ là lệnh ghi đè compact.

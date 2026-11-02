# Đề xuất thảo luận — Pre-TGE Radar

Ngày khảo sát:02/11/2026. Chưa chốt thiết kế/route, chưa triển khai dashboard. Không thay Work/Valuation.

## Mục đích

Trả lời nhanh: dự án này làm gì, còn tham gia được không, làm gì, cần tiền/thời gian bao nhiêu, điều gì vừa thay đổi? Điểm nhấn thị giác dùng dữ kiện có nguồn, không dùng điểm tiềm năng airdrop do AI bịa.

## Bảng chính đề xuất

| Cột | Nội dung | Mục đích |
|---|---|---|
| Dự án | Tên/logo + mô tả1 câu; click website | Nhận diện nhanh |
| X / Discord | Link riêng; thiếu dữ liệu hiện chưa có | Đi đúng cộng đồng |
| Narrative | Một nhóm chính, có thể xem tag SURF gốc | Lọc theo năng lực/sở thích |
| TGE | Chưa TGE đã xác minh / Có lịch (ngày+nguồn) / Đã TGE / Chưa rõ | Tránh nhầm airdrop lifecycle thành token lifecycle |
| Cách tham gia | Testnet, dùng app/mainnet, social, role, ambassador, node…; ưu tiên task thực sự OPEN | Biết phải làm gì |
| Cơ hội đang mở | Tên campaign, points/airdrop/role, deadline và link nguồn | Vào làm được ngay |
| Nguồn lực | Ước tính chi phí/thời gian theo nguồn; điều kiện vốn/thiết bị nếu xác nhận | Lọc việc phù hợp |
| Hoạt động gần đây | Bài X mới nhất / số bài7d khi lấy được; nếu chưa có nguồn thì “Chưa kiểm tra” | Nhìn thấy dự án còn cập nhật |

Vốn gọi, quỹ dẫn vòng, gọi vốn gần nhất, cập nhật nguồn và ghi chú cá nhân đặt ở hàng chi tiết hoặc popup. Có thể đưa tổng raise thành cột nếu anh ưu tiên; tránh dồn mọi dữ kiện thành12–15 cột. Đây là đề xuất, chưa duyệt layout.

## Phần bổ sung có ích

- “Task mới”, “Sắp đóng”, “Mới gọi vốn”, “Có role”, “Có points”, “Không cần vốn” khi có dữ kiện xác nhận. Không tự thêm nhãn “sắp airdrop”.
- Cột chi phí bằng0 trong API chưa đủ chứng minh hoàn toàn miễn phí; phải biết task có phí/gas/deposit hay không. Chưa xác định đơn vị của trường `cost` thì không tự thêm dấuUSD.
- “Potential” và “Confirmed” giữ nghĩa của lifecycle airdrop, không chuyển thành chắc chắn được nhận tiền.
- Hướng có task hiện hữu khác với hướng AI gợi ý. Ví dụ có Discord chỉ đủ để link cộng đồng, không đủ để ghi có ambassador/OG role. Gợi ý phải có nhãn riêng và nguồn chương trình.
- X có bài thường xuyên không chứng minh dự án tốt; X ít bài không tự động là dead. Hiển thị thời gian/số bài gốc trước khi đặt ngưỡng nhãn.
- Workflow cá nhân tùy chọn: Theo dõi / Đang làm / Bỏ qua, pin việc; chỉ thêm sau khi anh thấy cần. Không tự biến thành bộ quản lý task trùng Work.

## API đã đọc và đã thử

Nguồn chính thức:

- [Airdrop Search](https://agents.asksurf.ai/docs/data-api/search/airdrop)
- [Project Detail](https://agents.asksurf.ai/docs/data-api/project/detail)
- [Project Events](https://agents.asksurf.ai/docs/data-api/search/events)
- [API Overview / pricing / limits](https://agents.asksurf.ai/docs/data-api/overview)

Thử thực tế3 request bằng key đã có: một search/airdrop limit5 (2credits),2 project/detail (1credit mỗi request). Không gọi Research Chat, không nạp tiền hoặc thanh toán. Kết quả gốc ở artifact `surf-pre-tge-api-probe-2026-11-02.json`.

`GET /v1/search/airdrop?phase=active&has_open=true&include_tasks=true&sort_by=last_status_update&order=desc&limit=5`

- Có project_name, reward_type, status, task_summary, tasks (title/type/status/link/open/close/cost/time), total_raise, xscore, last_status_update.
-3/5 mẫu có project_id;2/5 thiếu, cần resolver theo tên/website trước khi ghép profile. Không tự gán UUID theo ticker.
- Trường followers_count trong cả5 mẫu đều0; profile QFEX/Spicenet lại có x_followers khác0. Không hiển thị0 thành tài khoản không có follower; dùng profile hoặc ghi chưa có dữ liệu.
- Một hành động có thể lặp theo nhiều task_type: Metric “Swaps and Liquidity Pools” xuất hiện ở liquidity/mainnet/trading; Loaf Testnet ở testnet/trading. Khi đếm “việc cần làm”, gom theo action/source và giữ nhiều tag, không cộng trùng chi phí/thời gian. Tránh gom những task cùng tên nhưng khác chain/campaign/điều kiện.
- Link nguồn có referral/tracking của bên cung cấp. Không tự nhận đó là referral của app; xác minh domain và tách link canonical khi có căn cứ.

`GET /v1/project/detail?id=<UUID>&fields=overview,social,tge_status,funding`

- Có mô tả/tags, X handle/followers, funding rounds/investors; social có thể có Discord/website/GitHub.
- Cả2 mẫu QFEX và Spicenet trả tge_status rỗng. Vì vậy `phase=active` KHÔNG đủ để xác nhận pre-TGE. Cần nguồn TGE rõ ràng hoặc nhãn chưa rõ; không suy từ thiếu giá/ticker.
- TGE date và reward date là hai loại ngày khác nhau. Không lấy last_status_update/last_event_time thành lịch TGE nếu chưa xác minh loại sự kiện.

Ví dụ dữ liệu thật trong mẫu (không phải danh sách khuyến nghị đầu tư, không khẳng định chưa TGE):

| Dự án | Raise | Task OPEN theo SURF | Dạng reward | X profile | TGE |
|---|---:|---|---|---|---|
| QFEX | $9.5M | Discord role / trading | Potential airdrop | Có handle | Chưa có dữ liệu trạng thái |
| Spicenet | $8.4M | Point Farming/social | Points, Confirmed | Có handle | Chưa có dữ liệu trạng thái |

## Phần chưa kiểm chứng, không hứa sẵn

- Chưa xác nhận endpoint ổn định cho latest X posts / timeline / posting frequency. Profile/followers/xscore không phải bằng chứng X đang hoạt động. Có tài liệu social cũ còn được search index, nhưng không coi là capability live nếu chưa gọi thành công.
- Discord link có thể lấy từ social hoặc task, nhưng số thành viên/độ hoạt động server/invite còn hạn phải có nguồn riêng. Không giả lập số online.
- Events đã đọc docs, chưa thử trả về lịch TGE thật cho mẫu trên.
- Airdrop search không bao phủ mọi dự án chưa token, và cũng có campaign của dự án đã TGE. Danh sách discovery và danh sách pre-TGE đã xác minh cần phân biệt.

## Cách build nếu anh duyệt tiếp

Đề xuất bắt đầu bằng watchlist được chọn, dùng SURF bổ sung profile/campaign. Lưu Surf project_id thay vì khóa ticker (pre-TGE có thể chưa có ticker). Giữ trạng thái token và campaign tách nhau. Có source link + fetchedAt cho dữ kiện, không trả “Không có” khi API lỗi.

Proxy ở server, không lộ key; đồng bộ có cache và giới hạn số dự án. Profile ít đổi cập nhật thưa hơn task/deadline. Không gọi Chat API cho mỗi page view. Chưa định ngân sách refresh trước khi đo coverage/cost và chốt quy mô. Chưa hứa refresh realtime.

UI nếu đặt cùng hệ app phải dùng frame1280/inset24–16, compact tokens, nền header DAILY, shadow chỉ control bấm được. Chưa chốt desktop table/mobile card hay route; đưa ví dụ bố cục trước khi code theo yêu cầu đã có.

Bước tiếp theo hợp lý: chọn10 dự án anh thực sự cân nhắc làm; điền thử các cột trên và đo tỷ lệ dữ kiện có nguồn, đặc biệt TGE/X activity. Nếu bảng giúp chọn việc nhanh hơn thì mới chốt UI và build.

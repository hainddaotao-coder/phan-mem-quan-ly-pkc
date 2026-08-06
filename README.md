# PKC Work Management v3

Phần mềm quản lý dự án cho Nhà thuốc Việt Bảo, PKC Pet Center và PKC Equine Center.

## Chức năng

- Đăng nhập Supabase và phân quyền Admin, Manager, Observer, Leader.
- Tổng quan, lọc và tìm kiếm dự án.
- Tạo, chỉnh sửa dự án; cập nhật trạng thái, tiến độ, khó khăn và đề nghị hỗ trợ.
- Quản lý đầu việc, đánh dấu hoàn thành và phân công nhân sự.
- Nhật ký cập nhật, bình luận, ý kiến chỉ đạo và link tài liệu.
- Màn hình công việc, lịch deadline, báo cáo và danh sách nhân sự.
- Responsive cho máy tính, máy tính bảng và điện thoại.

## Chạy dự án

1. Sao chép `.env.example` thành `.env.local`.
2. Chạy `npm install`.
3. Chạy `npm run dev`.

Khi triển khai Vercel, thêm `NEXT_PUBLIC_SUPABASE_URL` và `NEXT_PUBLIC_SUPABASE_ANON_KEY` trong Environment Variables. Chỉ dùng publishable/anon key; không dùng `service_role` hoặc secret key trong trình duyệt.

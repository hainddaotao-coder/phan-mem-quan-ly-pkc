# PKC Work Management v5

Phần mềm quản lý dự án cho Nhà thuốc Việt Bảo, PKC Pet Center và PKC Equine Center.

## Chức năng

- Đăng nhập Supabase và phân quyền Admin, Manager, Observer, Leader.
- Tổng quan, lọc và tìm kiếm dự án.
- Tạo, chỉnh sửa dự án; cập nhật trạng thái, tiến độ, khó khăn và đề nghị hỗ trợ.
- Quản lý đầu việc, đánh dấu hoàn thành và phân công nhân sự.
- Nhật ký cập nhật, bình luận, ý kiến chỉ đạo và link tài liệu.
- Màn hình công việc, lịch deadline, báo cáo và danh sách nhân sự.
- Responsive cho máy tính, máy tính bảng và điện thoại.
- Tách quyền theo từng hành động: mọi tài khoản đều xem đủ các màn hình; người
  được giao việc cập nhật việc của mình; mọi thành viên trong phạm vi dự án được
  trao đổi và gắn tài liệu; quyền sửa dự án, chỉ đạo và quản trị vẫn theo vai trò.

## Cập nhật quyền Supabase

Sau khi triển khai mã nguồn, chạy một lần nội dung file
`supabase/complete-account-capabilities.sql` trong Supabase SQL Editor. Phần này
đồng bộ RLS với các nút cộng tác mới trên giao diện.

## Chạy dự án

1. Sao chép `.env.example` thành `.env.local`.
2. Chạy `npm install`.
3. Chạy `npm run dev`.

Khi triển khai Vercel, thêm `NEXT_PUBLIC_SUPABASE_URL` và `NEXT_PUBLIC_SUPABASE_ANON_KEY` trong Environment Variables. Chỉ dùng publishable/anon key; không dùng `service_role` hoặc secret key trong trình duyệt.

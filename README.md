# PKC Work Management

Phần mềm quản lý dự án cho Nhà thuốc Việt Bảo, PKC Pet Center và PKC Equine Center.

## Chạy thử

1. Sao chép `.env.example` thành `.env.local`.
2. Dự án đã có sẵn Project URL và Publishable key trong `.env.example`.
   Khi triển khai Vercel, thêm hai biến này vào Project Settings → Environment Variables.
3. Chạy `npm install`, sau đó `npm run dev`.

Nếu chưa có `.env.local`, ứng dụng tự mở chế độ xem thử với dữ liệu mẫu. Không dùng `service_role` hoặc secret key trong ứng dụng.

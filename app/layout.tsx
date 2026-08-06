import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {title:"PKC Work | Quản lý công việc",description:"Hệ thống quản lý dự án Việt Bảo và PKC"};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="vi"><body>{children}</body></html>;
}

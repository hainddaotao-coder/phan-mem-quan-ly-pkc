import type { Project } from "./types";

export const demoProjects: Project[] = [
  {id:"1",project_code:"PET-2026-014",name:"Chuẩn hóa quy trình chăm sóc khách hàng",description:"Thống nhất quy trình tiếp nhận, chăm sóc và theo dõi khách hàng.",brand:"pkc-pet",owner:"Trang",status:"in_progress",priority:"high",progress:68,due_date:"2026-08-18",task_done:7,task_total:10,latest_result:"Đã hoàn thiện biểu mẫu tiếp nhận tại cơ sở Văn Giang."},
  {id:"2",project_code:"EQUINE-2026-008",name:"Mở rộng dịch vụ đào tạo cưỡi ngựa",description:"Hoàn thiện chương trình, nhân sự và kế hoạch vận hành.",brand:"pkc-equine",owner:"Quốc Anh",status:"at_risk",priority:"urgent",progress:42,due_date:"2026-08-11",task_done:4,task_total:11,latest_result:"Đã chốt khung chương trình; còn thiếu lịch huấn luyện viên."},
  {id:"3",project_code:"VB-2026-021",name:"Kiểm soát tồn kho quầy thuốc",description:"Chuẩn hóa kiểm kê và cảnh báo hạn dùng theo tuần.",brand:"viet-bao",owner:"Lê Thị Hà",status:"in_progress",priority:"high",progress:76,due_date:"2026-08-15",task_done:8,task_total:10,latest_result:"Đã đối soát 76% danh mục hàng hóa."},
  {id:"4",project_code:"PET-2026-019",name:"Kế hoạch truyền thông tháng 8",description:"Tăng nhận diện dịch vụ khám và grooming tại Ecopark.",brand:"pkc-pet",owner:"Hiếu",status:"planning",priority:"medium",progress:20,due_date:"2026-08-28",task_done:2,task_total:9,latest_result:"Đã xây dựng nhóm nội dung theo dịch vụ."},
  {id:"5",project_code:"EQUINE-2026-005",name:"Bảo trì khu chuồng ngựa",description:"Kiểm tra cơ sở vật chất và xử lý các hạng mục ưu tiên.",brand:"pkc-equine",owner:"Toản",status:"completed",priority:"medium",progress:100,due_date:"2026-08-04",task_done:8,task_total:8,latest_result:"Hoàn thành nghiệm thu toàn bộ hạng mục."},
];

export const brandMeta = {
  "viet-bao": {name:"Nhà thuốc Việt Bảo",logo:"/brands/viet-bao.jpg",color:"#0b918e",soft:"#e9f7f6"},
  "pkc-pet": {name:"PKC Pet Center",logo:"/brands/pkc-pet.png",color:"#dc9b00",soft:"#fff6d7"},
  "pkc-equine": {name:"PKC Equine Center",logo:"/brands/pkc-equine.jpg",color:"#22262b",soft:"#fff4c7"},
} as const;

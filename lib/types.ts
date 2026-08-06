export type BrandCode = "viet-bao" | "pkc-pet" | "pkc-equine";
export type ProjectStatus = "planning" | "in_progress" | "at_risk" | "completed" | "on_hold";

export interface Project {
  id: string;
  project_code: string;
  name: string;
  description: string;
  brand: BrandCode;
  owner: string;
  status: ProjectStatus;
  priority: "low" | "medium" | "high" | "urgent";
  progress: number;
  due_date: string;
  task_done: number;
  task_total: number;
  latest_result: string;
}

export interface UserProfile {
  id: string;
  full_name: string;
  job_title: string;
  role: "admin" | "manager" | "observer" | "leader";
}

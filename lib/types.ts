export type BrandCode = "viet-bao" | "pkc-pet" | "pkc-equine";
export type UserRole = "admin" | "manager" | "observer" | "leader";
export type ProjectStatus = "planning" | "in_progress" | "at_risk" | "completed" | "on_hold";
export type TaskStatus = "not_started" | "in_progress" | "completed" | "blocked";

export interface Brand { id:string; code:BrandCode; name:string }
export interface UserProfile { id:string; full_name:string; email?:string; job_title:string; role:UserRole; is_active?:boolean }
export interface Project {
  id:string; project_code:string; name:string; description:string; expected_result?:string; brand_id?:string; brand:BrandCode;
  owner_id?:string; owner:string; created_by?:string; status:ProjectStatus; priority:"low"|"medium"|"high"|"urgent";
  progress:number; start_date?:string; due_date:string; latest_result:string; current_difficulty?:string; support_request?:string;
  task_done:number; task_total:number; created_at?:string; updated_at?:string;
}
export interface Task { id:string; project_id:string; title:string; description?:string; expected_result?:string; assigned_to?:string|null; assignee?:string; created_by?:string; status:TaskStatus; progress:number; start_date?:string; due_date?:string; sort_order?:number }
export interface ProjectUpdate { id:string; project_id:string; author_id:string; author?:string; content?:string; result?:string; difficulty?:string; support_request?:string; progress?:number; created_at:string }
export interface Comment { id:string; project_id:string; author_id:string; author?:string; content:string; is_directive:boolean; created_at:string }
export interface DocumentLink { id:string; project_id:string; title:string; url:string; added_by:string; created_at?:string }

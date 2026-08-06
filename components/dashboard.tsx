"use client";

import Image from "next/image";
import {useEffect,useMemo,useState} from "react";
import {AlertTriangle,BarChart3,CalendarDays,CheckCircle2,ChevronDown,FolderKanban,LayoutDashboard,LogOut,Menu,Plus,Search,Settings,Users,X} from "lucide-react";
import {brandMeta,demoProjects} from "@/lib/demo-data";
import type {BrandCode,Project,ProjectStatus,UserProfile} from "@/lib/types";
import {getSupabase} from "@/lib/supabase";

const statusLabel:Record<ProjectStatus,string>={planning:"Lập kế hoạch",in_progress:"Đang thực hiện",at_risk:"Có rủi ro",completed:"Hoàn thành",on_hold:"Tạm dừng"};
const priorityLabel={low:"Thấp",medium:"Trung bình",high:"Cao",urgent:"Khẩn cấp"};

export default function Dashboard({configured}:{configured:boolean}){
  const [loggedIn,setLoggedIn]=useState(!configured);
  const [loading,setLoading]=useState(false);
  const [dataLoading,setDataLoading]=useState(configured);
  const [error,setError]=useState("");
  const [profile,setProfile]=useState<UserProfile|null>(null);
  const [liveProjects,setLiveProjects]=useState<Project[]>([]);
  const [brand,setBrand]=useState<"all"|BrandCode>("all");
  const [query,setQuery]=useState("");
  const [menu,setMenu]=useState(false);
  const [selected,setSelected]=useState<Project|null>(null);
  const sourceProjects=configured?liveProjects:demoProjects;
  const projects=useMemo(()=>sourceProjects.filter(p=>(brand==="all"||p.brand===brand)&&(`${p.name} ${p.project_code} ${p.owner}`.toLowerCase().includes(query.toLowerCase()))),[brand,query,sourceProjects]);
  const average=sourceProjects.length?Math.round(sourceProjects.reduce((s,p)=>s+p.progress,0)/sourceProjects.length):0;
  const activeCount=sourceProjects.filter(p=>p.status!=="completed"&&p.status!=="on_hold").length;
  const riskCount=sourceProjects.filter(p=>p.status==="at_risk").length;
  const soonCount=sourceProjects.filter(p=>{const days=(new Date(p.due_date+"T00:00:00").getTime()-Date.now())/86400000;return days>=0&&days<=7&&p.status!=="completed";}).length;

  useEffect(()=>{
    if(!configured)return;
    const supabase=getSupabase();
    if(!supabase)return;
    supabase.auth.getSession().then(({data})=>{
      setLoggedIn(Boolean(data.session));
      if(data.session)loadData(data.session.user.id);
      else setDataLoading(false);
    });
    const {data:listener}=supabase.auth.onAuthStateChange((_event,session)=>{
      setLoggedIn(Boolean(session));
      if(session)loadData(session.user.id);
      else {setProfile(null);setLiveProjects([]);setDataLoading(false);}
    });
    return ()=>listener.subscription.unsubscribe();
  },[configured]);

  async function loadData(userId:string){
    const supabase=getSupabase();if(!supabase)return;
    setDataLoading(true);setError("");
    const [profileResult,projectsResult,brandsResult,tasksResult]=await Promise.all([
      supabase.from("profiles").select("id,full_name,job_title,role").eq("id",userId).single(),
      supabase.from("projects").select("id,project_code,name,description,brand_id,owner_id,status,priority,progress,due_date,latest_result").order("due_date"),
      supabase.from("brands").select("id,code,name"),
      supabase.from("tasks").select("id,project_id,status")
    ]);
    const firstError=profileResult.error||projectsResult.error||brandsResult.error||tasksResult.error;
    if(firstError){setError(`Không tải được dữ liệu: ${firstError.message}`);setDataLoading(false);return;}
    const rows=projectsResult.data??[];
    const ownerIds=[...new Set(rows.map(p=>p.owner_id).filter(Boolean))];
    const ownersResult=ownerIds.length?await supabase.from("profiles").select("id,full_name").in("id",ownerIds):{data:[],error:null};
    if(ownersResult.error){setError(`Không tải được người phụ trách: ${ownersResult.error.message}`);setDataLoading(false);return;}
    const brands=new Map((brandsResult.data??[]).map(b=>[b.id,b.code as BrandCode]));
    const owners=new Map((ownersResult.data??[]).map(o=>[o.id,o.full_name]));
    const tasks=tasksResult.data??[];
    setProfile(profileResult.data as UserProfile);
    setLiveProjects(rows.flatMap(p=>{
      const brandCode=brands.get(p.brand_id);
      if(!brandCode||!(brandCode in brandMeta))return [];
      const projectTasks=tasks.filter(t=>t.project_id===p.id);
      return [{...p,description:p.description??"",brand:brandCode,owner:owners.get(p.owner_id)??"Chưa phân công",progress:p.progress??0,due_date:p.due_date??new Date().toISOString().slice(0,10),task_done:projectTasks.filter(t=>t.status==="completed").length,task_total:projectTasks.length,latest_result:p.latest_result??"Chưa có cập nhật."} as Project];
    }));
    setDataLoading(false);
  }

  async function login(e:React.FormEvent<HTMLFormElement>){e.preventDefault();setLoading(true);setError("");const form=new FormData(e.currentTarget);const supabase=getSupabase();if(!supabase){setLoggedIn(true);setLoading(false);return;}const {data,error}=await supabase.auth.signInWithPassword({email:String(form.get("email")),password:String(form.get("password"))});if(error)setError("Email hoặc mật khẩu chưa đúng.");else if(data.user)await loadData(data.user.id);setLoading(false);}
  async function logout(){await getSupabase()?.auth.signOut();setLoggedIn(false);}
  if(!loggedIn)return <Login onSubmit={login} loading={loading} error={error}/>;

  return <div className="shell">
    <aside className={menu?"sidebar open":"sidebar"}>
      <button className="close-mobile" onClick={()=>setMenu(false)} aria-label="Đóng menu"><X/></button>
      <div className="identity"><div className="identity-mark">P</div><div><strong>PKC WORK</strong><span>Quản lý công việc</span></div></div>
      <nav>
        <a className="active"><LayoutDashboard/>Tổng quan</a><a><FolderKanban/>Dự án</a><a><CheckCircle2/>Công việc</a><a><CalendarDays/>Lịch tiến độ</a><a><BarChart3/>Báo cáo</a><a><Users/>Nhân sự</a>
      </nav>
      <div className="sidebar-foot"><a><Settings/>Cài đặt</a><button onClick={logout}><LogOut/>Đăng xuất</button></div>
    </aside>
    <main>
      <header className="topbar"><button className="menu-button" onClick={()=>setMenu(true)}><Menu/></button><div><h1>Tổng quan điều hành</h1><p>{new Intl.DateTimeFormat("vi-VN",{weekday:"long",day:"2-digit",month:"2-digit",year:"numeric"}).format(new Date())}</p></div><div className="user"><div className="avatar">{initials(profile?.full_name??"PKC")}</div><div><strong>{profile?.full_name??"Người dùng"}</strong><span>{profile?.job_title??"Đang tải..."}</span></div><ChevronDown/></div></header>
      <div className="content">
        {!configured&&<div className="demo-note"><strong>Chế độ xem thử</strong><span>Thêm thông tin Supabase vào tệp môi trường để dùng dữ liệu thật.</span></div>}
        <section className="brand-strip">
          {(Object.entries(brandMeta) as [BrandCode,(typeof brandMeta)[BrandCode]][]).map(([code,item])=><button key={code} className={brand===code?"brand-card selected":"brand-card"} onClick={()=>setBrand(brand===code?"all":code)} style={{"--brand":item.color,"--soft":item.soft} as React.CSSProperties}><Image src={item.logo} alt={item.name} width={74} height={50}/><span><small>THƯƠNG HIỆU</small><strong>{item.name}</strong></span></button>)}
        </section>
        {error&&<div className="form-error">{error}</div>}
        <section className="stats">
          <Stat label="Tổng dự án" value={String(sourceProjects.length)} hint={`${activeCount} đang triển khai`} type="blue" icon={<FolderKanban/>}/><Stat label="Tiến độ trung bình" value={`${average}%`} hint="Theo phạm vi được xem" type="green" icon={<BarChart3/>}/><Stat label="Sắp đến hạn" value={String(soonCount)} hint="Trong 7 ngày tới" type="orange" icon={<CalendarDays/>}/><Stat label="Cần chú ý" value={String(riskCount)} hint="Dự án có rủi ro" type="red" icon={<AlertTriangle/>}/>
        </section>
        <section className="panel">
          <div className="panel-head"><div><h2>Dự án đang theo dõi</h2><p>Tổng hợp tiến độ theo phạm vi quyền được phân công</p></div><button className="primary"><Plus/>Tạo dự án</button></div>
          <div className="tools"><div className="search"><Search/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Tìm theo tên, mã hoặc người phụ trách"/></div><select value={brand} onChange={e=>setBrand(e.target.value as typeof brand)}><option value="all">Tất cả thương hiệu</option>{Object.entries(brandMeta).map(([k,v])=><option value={k} key={k}>{v.name}</option>)}</select></div>
          <div className="table-wrap"><table><thead><tr><th>Dự án</th><th>Thương hiệu</th><th>Phụ trách</th><th>Trạng thái</th><th>Tiến độ</th><th>Hạn hoàn thành</th></tr></thead><tbody>{dataLoading?<tr><td colSpan={6}>Đang tải dữ liệu...</td></tr>:projects.length===0?<tr><td colSpan={6}>Chưa có dự án trong phạm vi được xem.</td></tr>:projects.map(p=><tr key={p.id} onClick={()=>setSelected(p)}><td><strong>{p.name}</strong><small>{p.project_code}</small></td><td><span className="brand-pill" style={{background:brandMeta[p.brand].soft,color:brandMeta[p.brand].color}}>{brandMeta[p.brand].name}</span></td><td>{p.owner}</td><td><span className={`status ${p.status}`}>{statusLabel[p.status]}</span></td><td><div className="progress-row"><div className="progress"><i style={{width:`${p.progress}%`}}/></div><b>{p.progress}%</b></div><small>{p.task_done}/{p.task_total} đầu việc</small></td><td>{new Date(p.due_date+"T00:00:00").toLocaleDateString("vi-VN")}</td></tr>)}</tbody></table></div>
        </section>
      </div>
    </main>
    {selected&&<div className="modal-backdrop" onClick={()=>setSelected(null)}><article className="drawer" onClick={e=>e.stopPropagation()}><button className="drawer-close" onClick={()=>setSelected(null)}><X/></button><small>{selected.project_code}</small><h2>{selected.name}</h2><p>{selected.description}</p><div className="drawer-grid"><label>Thương hiệu<strong>{brandMeta[selected.brand].name}</strong></label><label>Người phụ trách<strong>{selected.owner}</strong></label><label>Ưu tiên<strong>{priorityLabel[selected.priority]}</strong></label><label>Hạn hoàn thành<strong>{new Date(selected.due_date+"T00:00:00").toLocaleDateString("vi-VN")}</strong></label></div><h3>Tiến độ dự án</h3><div className="big-progress"><i style={{width:`${selected.progress}%`}}/></div><div className="progress-caption"><span>{selected.task_done}/{selected.task_total} đầu việc hoàn thành</span><strong>{selected.progress}%</strong></div><h3>Kết quả cập nhật gần nhất</h3><div className="update-box">{selected.latest_result}</div><button className="primary full">Xem chi tiết dự án</button></article></div>}
  </div>;
}

function initials(name:string){return name.trim().split(/\s+/).slice(-2).map(part=>part[0]).join("").toUpperCase();}

function Login({onSubmit,loading,error}:{onSubmit:(e:React.FormEvent<HTMLFormElement>)=>void;loading:boolean;error:string}){return <div className="login-page"><div className="login-brand"><div className="login-copy"><span>HỆ THỐNG QUẢN TRỊ TẬP TRUNG</span><h1>Mỗi dự án rõ người,<br/>rõ việc, rõ tiến độ.</h1><p>Không gian điều hành chung cho Nhà thuốc Việt Bảo, PKC Pet Center và PKC Equine Center.</p><div className="login-logos">{Object.entries(brandMeta).map(([code,b])=><div key={code}><Image src={b.logo} alt={b.name} width={104} height={66}/></div>)}</div></div></div><form onSubmit={onSubmit} className="login-card"><div className="identity center"><div className="identity-mark">P</div><div><strong>PKC WORK</strong><span>Quản lý công việc</span></div></div><h2>Đăng nhập hệ thống</h2><p>Sử dụng tài khoản đã được cấp để tiếp tục.</p><label>Email<input name="email" type="email" required placeholder="email@pkc.vn"/></label><label>Mật khẩu<input name="password" type="password" required placeholder="Nhập mật khẩu"/></label>{error&&<div className="form-error">{error}</div>}<button className="primary full" disabled={loading}>{loading?"Đang đăng nhập...":"Đăng nhập"}</button><small>Liên hệ quản trị viên nếu anh/chị chưa có tài khoản.</small></form></div>}
function Stat({label,value,hint,type,icon}:{label:string;value:string;hint:string;type:string;icon:React.ReactNode}){return <div className="stat"><div className={`stat-icon ${type}`}>{icon}</div><div><span>{label}</span><strong>{value}</strong><small>{hint}</small></div></div>}

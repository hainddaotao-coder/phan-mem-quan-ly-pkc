import { hasSupabaseConfig } from "@/lib/supabase";
import Dashboard from "@/components/dashboard";
export default function Page(){return <Dashboard configured={hasSupabaseConfig()}/>;}

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables");
  console.log("URL:", supabaseUrl ? "Found" : "Missing");
  console.log("Key:", supabaseAnonKey ? "Found" : "Missing");
}

export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "");

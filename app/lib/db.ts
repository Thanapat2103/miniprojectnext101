import { createClient } from '@supabase/supabase-js';

// ค่าเหล่านี้จะถูกดึงจาก Environment Variables ใน Vercel
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/db';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .single();

    if (error || !user) {
      return NextResponse.json({ error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" }, { status: 401 });
    }

    return NextResponse.json({ 
      success: true, 
      id: user.id, 
      username: user.username 
    });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
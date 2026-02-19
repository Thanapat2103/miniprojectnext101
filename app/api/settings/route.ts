import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/db';

export async function POST(req: Request) {
  try {
    const { username, password, userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "ไม่พบ User ID" }, { status: 400 });
    }

    // อัปเดตข้อมูลผู้ใช้ใน Supabase โดยอ้างอิงจาก ID
    const { error } = await supabase
      .from('users')
      .update({ username, password })
      .eq('id', userId);

    if (error) throw error;

    return NextResponse.json({ message: "อัปเดตข้อมูลสำเร็จ" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
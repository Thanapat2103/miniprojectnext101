import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/db';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" }, { status: 400 });
    }

    // บันทึก User ใหม่ลง Supabase
    const { data, error } = await supabase
      .from('users')
      .insert([{ username, password }])
      .select();

    if (error) {
      if (error.code === '23505') { // รหัส Error สำหรับ Unique Violation (ชื่อซ้ำ)
        return NextResponse.json({ error: "ชื่อผู้ใช้งานนี้ถูกใช้ไปแล้ว" }, { status: 400 });
      }
      throw error;
    }

    return NextResponse.json({ message: "ลงทะเบียนสำเร็จ" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" }, { status: 500 });
  }
}
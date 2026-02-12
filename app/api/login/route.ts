import { NextResponse } from 'next/server';
import db from '@/app/lib/db';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    const user = db.prepare("SELECT * FROM users WHERE username = ? AND password = ?").get(username, password) as any;

    if (user) {
      return NextResponse.json({ 
        success: true, 
        id: user.id, // ส่ง ID กลับไปเก็บที่ localStorage
        username: user.username 
      });
    } else {
      return NextResponse.json({ error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
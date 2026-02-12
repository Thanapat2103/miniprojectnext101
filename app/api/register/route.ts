import { NextResponse } from 'next/server';
import db from '@/app/lib/db';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" }, { status: 400 });
    }

    // ตรวจสอบว่ามี Username นี้หรือยัง
    const existingUser = db.prepare("SELECT * FROM users WHERE username = ?").get(username);
    if (existingUser) {
      return NextResponse.json({ error: "ชื่อผู้ใช้งานนี้ถูกใช้ไปแล้ว" }, { status: 400 });
    }

    // บันทึก User ใหม่ลง Database
    // หมายเหตุ: ในงานจริงควรใช้ bcryptjs hash รหัสผ่านก่อนบันทึก
    const statement = db.prepare("INSERT INTO users (username, password) VALUES (?, ?)");
    statement.run(username, password);

    return NextResponse.json({ message: "ลงทะเบียนสำเร็จ" }, { status: 201 });
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" }, { status: 500 });
  }
}
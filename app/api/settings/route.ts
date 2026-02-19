import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/db';

export async function PATCH(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username) {
      return NextResponse.json({ error: "กรุณาระบุชื่อผู้ใช้" }, { status: 400 });
    }

    // อัปเดตชื่อและรหัสผ่านของผู้ใช้คนแรก (id: 1)
    const stmt = db.prepare('UPDATE users SET username = ?, password = ? WHERE id = 1');
    const info = stmt.run(username, password);

    if (info.changes > 0) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "ไม่พบข้อมูลผู้ใช้" }, { status: 404 });
    }
  } catch (error) {
    console.error("Settings API Error:", error);
    return NextResponse.json({ error: "เซิร์ฟเวอร์ขัดข้อง" }, { status: 500 });
  }
}
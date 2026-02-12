import { NextResponse } from 'next/server';
import db from '@/app/lib/db'; 

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId'); // รับ userId มาจากหน้าบ้าน

    const tasks = db.prepare('SELECT * FROM tasks WHERE user_id = ? ORDER BY id DESC').all(userId);
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json({ error: "ดึงข้อมูลล้มเหลว" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title, due_date, user_id } = await req.json();
    
    if (!title || !user_id) {
      return NextResponse.json({ error: "ข้อมูลไม่ครบถ้วน" }, { status: 400 });
    }

    const stmt = db.prepare('INSERT INTO tasks (title, status, due_date, user_id) VALUES (?, ?, ?, ?)');
    const info = stmt.run(title, 'To Do', due_date, user_id);
    
    return NextResponse.json({ id: info.lastInsertRowid, title, status: 'To Do', due_date });
  } catch (error) {
    return NextResponse.json({ error: "เพิ่มงานล้มเหลว" }, { status: 500 });
  }
}

// PATCH และ DELETE ใช้ของเดิมได้เลย
export async function PATCH(req: Request) {
  const { id, status } = await req.json();
  db.prepare('UPDATE tasks SET status = ? WHERE id = ?').run(status, id);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
  return NextResponse.json({ success: true });
}
import { NextResponse } from 'next/server';
import db from '@/app/lib/db'; 

// 1. ดึงงาน (ต้องเอา due_date ออกมาด้วย)
export async function GET() {
  try {
    const tasks = db.prepare('SELECT * FROM tasks ORDER BY id DESC').all();
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json({ error: "ดึงข้อมูลล้มเหลว" }, { status: 500 });
  }
}

// 2. เพิ่มงาน (ต้องเพิ่มช่องสำหรับรับและบันทึก due_date)
export async function POST(req: Request) {
  try {
    const { title, due_date } = await req.json();
    
    if (!title) {
      return NextResponse.json({ error: "กรุณาใส่ชื่องาน" }, { status: 400 });
    }

    // แก้ไข INSERT ให้บันทึก 3 ค่า: title, status, และ due_date
    const stmt = db.prepare('INSERT INTO tasks (title, status, due_date) VALUES (?, ?, ?)');
    const info = stmt.run(title, 'To Do', due_date);
    
    return NextResponse.json({ 
      id: info.lastInsertRowid, 
      title, 
      status: 'To Do',
      due_date: due_date 
    });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ error: "เพิ่มงานล้มเหลว" }, { status: 500 });
  }
}

// 3. แก้ไขสถานะ
export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();
    const stmt = db.prepare('UPDATE tasks SET status = ? WHERE id = ?');
    stmt.run(status, id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "อัปเดตล้มเหลว" }, { status: 500 });
  }
}

// 4. ลบงาน
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    const stmt = db.prepare('DELETE FROM tasks WHERE id = ?');
    stmt.run(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "ลบงานล้มเหลว" }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import db from '@/app/lib/db'; // เรียกใช้ตัวเชื่อมต่อ SQLite ที่เราสร้างไว้ใน lib/db.ts

// 1. ดึงข้อมูลงานทั้งหมด (GET)
// ฟังก์ชันนี้จะทำงานตอนที่หน้า Task Board โหลดขึ้นมา
export async function GET() {
  try {
    // ดึงงานทั้งหมด เรียงจากใหม่ไปเก่า
    const tasks = db.prepare('SELECT * FROM tasks ORDER BY id DESC').all();
    return NextResponse.json(tasks);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "ดึงข้อมูลล้มเหลว" }, { status: 500 });
  }
}

// 2. เพิ่มงานใหม่ (POST)
// ฟังก์ชันนี้จะทำงานตอนที่คุณกดปุ่ม "+ Add Task"
export async function POST(req: Request) {
  try {
    const { title } = await req.json();
    
    if (!title) {
      return NextResponse.json({ error: "กรุณาใส่ชื่องาน" }, { status: 400 });
    }

    const stmt = db.prepare('INSERT INTO tasks (title, status) VALUES (?, ?)');
    const info = stmt.run(title, 'To Do');
    
    // ส่งข้อมูลที่เพิ่งบันทึกสำเร็จกลับไปให้หน้าจอแสดงผล
    return NextResponse.json({ 
      id: info.lastInsertRowid, 
      title, 
      status: 'To Do' 
    });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ error: "เพิ่มงานล้มเหลว" }, { status: 500 });
  }
}

// 3. อัปเดตสถานะ Done / To Do (PATCH)
// ฟังก์ชันนี้ทำงานตอนกดปุ่มเปลี่ยนสถานะงาน
export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();
    const stmt = db.prepare('UPDATE tasks SET status = ? WHERE id = ?');
    stmt.run(status, id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH Error:", error);
    return NextResponse.json({ error: "อัปเดตสถานะล้มเหลว" }, { status: 500 });
  }
}

// 4. ลบงาน (DELETE)
// ฟังก์ชันนี้ทำงานตอนกดปุ่มกากบาท (X)
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    const stmt = db.prepare('DELETE FROM tasks WHERE id = ?');
    stmt.run(id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: "ลบงานล้มเหลว" }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/db';

export async function GET() {
  try {
    // 1. นับ To Do
    const todo = db.prepare("SELECT COUNT(*) as count FROM tasks WHERE status = 'To Do'").get() as { count: number };
    
    // 2. นับ In Progress (เช็คตัวสะกด เว้นวรรค และตัวใหญ่ตัวเล็กให้ตรงกับ DB)
    const inProgress = db.prepare("SELECT COUNT(*) as count FROM tasks WHERE status = 'In Progress'").get() as { count: number };
    
    // 3. นับ Done
    const done = db.prepare("SELECT COUNT(*) as count FROM tasks WHERE status = 'Done'").get() as { count: number };

    // ส่งค่ากลับไปให้หน้า Dashboard (Frontend)
    return NextResponse.json({
      todo: todo?.count || 0,
      inProgress: inProgress?.count || 0,
      done: done?.count || 0
    });
  } catch (error) {
    console.error("Stats API Error:", error);
    return NextResponse.json({ todo: 0, inProgress: 0, done: 0 }, { status: 500 });
  }
}
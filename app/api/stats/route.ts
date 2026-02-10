import { NextResponse } from 'next/server';
import db from '@/app/lib/db';

export async function GET() {
  try {
    // ดึงจำนวนงานที่ต้องทำ (To Do)
    const todoRow = db.prepare("SELECT COUNT(*) as count FROM tasks WHERE status = 'To Do'").get() as { count: number };
    
    // ดึงจำนวนงานที่เสร็จแล้ว (Done)
    const doneRow = db.prepare("SELECT COUNT(*) as count FROM tasks WHERE status = 'Done'").get() as { count: number };

    return NextResponse.json({
      todo: todoRow.count,
      done: doneRow.count
    });
  } catch (error) {
    console.error("Stats API Error:", error);
    return NextResponse.json({ todo: 0, done: 0 }, { status: 500 });
  }
}
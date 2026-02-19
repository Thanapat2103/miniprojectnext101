import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    // ถ้าไม่มี userId ส่งมา ให้คืนค่า 0 ทั้งหมดเพื่อป้องกัน Error
    if (!userId) {
      return NextResponse.json({ todo: 0, inProgress: 0, done: 0 });
    }

    // 1. นับ To Do ด้วย Supabase
    const { count: todoCount } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'To Do');

    // 2. นับ In Progress ด้วย Supabase
    const { count: inProgressCount } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'In Progress');

    // 3. นับ Done ด้วย Supabase
    const { count: doneCount } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'Done');

    return NextResponse.json({
      todo: todoCount || 0,
      inProgress: inProgressCount || 0,
      done: doneCount || 0
    });
  } catch (error) {
    console.error("Stats API Error:", error);
    return NextResponse.json({ todo: 0, inProgress: 0, done: 0 }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/db';

// 1. ดึงงาน
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  const { data: tasks, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .order('id', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(tasks);
}

// 2. เพิ่มงาน
export async function POST(req: Request) {
  const { title, due_date, user_id } = await req.json();
  
  const { data, error } = await supabase
    .from('tasks')
    .insert([{ title, due_date, user_id, status: 'To Do' }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// 3. แก้ไขสถานะ
export async function PATCH(req: Request) {
  const { id, status } = await req.json();
  const { error } = await supabase
    .from('tasks')
    .update({ status })
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

// 4. ลบงาน
export async function DELETE(req: Request) {
  const { id } = await req.json();
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
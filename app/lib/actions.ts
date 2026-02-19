'use server';

import { supabase } from './db';
import { revalidatePath } from 'next/cache';

export async function createTask(formData: FormData) {
  const title = formData.get('title');
  
  if (!title) return;

  // คำสั่งยัดข้อมูลลง SQLite
  const stmt = db.prepare('INSERT INTO tasks (title, status) VALUES (?, ?)');
  stmt.run(title.toString(), 'To Do');

  revalidatePath('/taskboard');
}
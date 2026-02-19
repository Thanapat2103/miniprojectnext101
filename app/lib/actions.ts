'use server';

import { supabase } from './db';
import { revalidatePath } from 'next/cache';

export async function createTask(formData: FormData) {
  const title = formData.get('title');
  const userId = formData.get('userId'); // ตรวจสอบว่าใน Form มีการส่ง userId มาด้วย
  
  if (!title || !userId) return;

  // บันทึกข้อมูลลงใน Supabase แทน SQLite
  const { error } = await supabase
    .from('tasks')
    .insert([
      { 
        title: title.toString(), 
        status: 'To Do', 
        user_id: userId 
      }
    ]);

  if (error) {
    console.error('Error creating task:', error.message);
    return;
  }

  revalidatePath('/taskboard');
}
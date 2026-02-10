import Database from 'better-sqlite3';
import path from 'path';

// สร้างหรือเปิดไฟล์ฐานข้อมูลชื่อ database.sqlite
const db = new Database(path.join(process.cwd(), 'database.sqlite'));

// ใช้คำสั่ง SQL เพื่อสร้างตาราง
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    status TEXT DEFAULT 'To Do',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export default db;
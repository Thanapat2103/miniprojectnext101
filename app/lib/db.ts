import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(process.cwd(), 'database.sqlite'));

// เปิดใช้งาน Foreign Key Support (ปกติ SQLite ปิดไว้ ต้องเปิดเพื่อให้ user_id ทำงานได้จริง)
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP -- เก็บเวลาสมัครสมาชิก (ไทยจะดูเวลาจากตรงนี้ได้)
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    status TEXT CHECK( status IN ('To Do','In Progress','Done') ) DEFAULT 'To Do',
    due_date TEXT, -- แนะนำให้เก็บเป็น TEXT เพื่อให้รองรับ ISO String จาก Frontend (เวลาไทย) ได้แม่นยำที่สุด
    user_id INTEGER,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

export default db;
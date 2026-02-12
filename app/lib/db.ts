import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(process.cwd(), 'database.sqlite'));

// เปิดใช้งาน Foreign Key Support
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    status TEXT CHECK( status IN ('To Do','In Progress','Done') ) DEFAULT 'To Do',
    due_date TEXT,
    user_id INTEGER,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

export default db;
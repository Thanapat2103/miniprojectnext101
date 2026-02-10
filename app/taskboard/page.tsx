"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TaskBoard() {
  const [tasks, setTasks] = useState<{ id: number; title: string; status: string }[]>([]);
  const [newTask, setNewTask] = useState("");
  const [name, setName] = useState("Sirapat"); // เปลี่ยนเป็นชื่อคุณเป็นค่าเริ่มต้นได้เลย
  const [searchQuery, setSearchQuery] = useState(""); 

  // เช็ค Login และดึงข้อมูลงาน
  useEffect(() => {
    const auth = localStorage.getItem("isLoggedIn");
    if (!auth) {
      window.location.href = "/login";
      return;
    }

    fetchTasks();
    const savedName = localStorage.getItem("username");
    if (savedName) setName(savedName);
  }, []);

  // ดึงข้อมูลจาก API (ที่เชื่อมกับ SQLite ในเครื่อง)
  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      if (Array.isArray(data)) setTasks(data);
    } catch (error) {
      console.error("Fetch tasks failed", error);
    }
  };

  // เพิ่มงานใหม่
  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTask }),
    });
    
    if (response.ok) {
      const savedTask = await response.json();
      // อัปเดตรายการงานหน้าจอทันที
      setTasks([savedTask, ...tasks]);
      setNewTask("");
    }
  };

  // เปลี่ยนสถานะ Done / To Do
  const toggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "To Do" ? "Done" : "To Do";
    
    const response = await fetch('/api/tasks', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus }),
    });

    if (response.ok) {
      setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
    }
  };

  // ลบงาน
  const deleteTask = async (id: number) => {
    if (!confirm("คุณแน่ใจนะว่าต้องการลบงานนี้?")) return;

    const response = await fetch('/api/tasks', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (response.ok) {
      setTasks(tasks.filter(task => task.id !== id));
    }
  };

  // ฟิลเตอร์ค้นหา
  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#FFF5EE]">
      {/* Sidebar - พื้นหลังส้ม ตัวหนังสือขาว */}
      <aside className="w-72 bg-[#FF8C42] p-8 text-white flex flex-col justify-between shadow-xl">
        <div>
          <div className="text-2xl font-black mb-12 italic tracking-tighter">✔️ TaskBoardApp</div>
          <nav className="space-y-3 font-bold">
            <Link href="/" className="block p-4 rounded-2xl hover:bg-white/10 transition-all">🏠 Dashboard</Link>
            <Link href="/taskboard" className="block bg-white/20 p-4 rounded-2xl shadow-md">📋 Task Board</Link>
            <Link href="/settings" className="block p-4 rounded-2xl hover:bg-white/10 transition-all">⚙️ Settings</Link>
          </nav>
        </div>
        
        {/* ชื่อ Sirapat มุมล่าง - ปรับให้เข้มขึ้นชัดขึ้น */}
        <div className="bg-white/10 p-4 rounded-[25px] flex items-center gap-3 border border-white/10">
          <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center text-[#FF8C42] font-black text-xl uppercase shadow-inner">
            {name[0]}
          </div>
          <div className="overflow-hidden">
            <p className="font-black text-sm truncate text-white">{name}</p>
            <p className="text-xs text-orange-100/70 font-bold">Online Now</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12">
        <header className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-black text-gray-800 tracking-tight">Task Board</h1>
            <p className="text-gray-500 mt-2 font-medium italic">จัดการงานของ {name} ในเครื่อง MacBook</p>
          </div>
          
          <div className="w-80 relative">
            <input 
              type="text" 
              placeholder="🔍 ค้นหางานที่นี่..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-4 pl-6 bg-white rounded-full shadow-sm border border-orange-50 outline-none focus:ring-2 focus:ring-[#FF8C42] transition-all text-sm font-bold text-gray-800 placeholder:text-gray-400"
            />
          </div>
        </header>

        {/* ฟอร์มเพิ่มงาน */}
        <form onSubmit={addTask} className="bg-white p-8 rounded-[40px] shadow-sm border border-orange-50 mb-10 flex gap-4 focus-within:shadow-md transition-shadow">
          <input 
            type="text" 
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="เพิ่มงานใหม่ที่คุณต้องทำวันนี้..." 
            className="flex-1 p-5 bg-orange-50 rounded-[25px] outline-none focus:ring-2 focus:ring-[#FF8C42] font-bold text-gray-800 placeholder:text-gray-400"
          />
          <button type="submit" className="bg-[#FF8C42] text-white px-10 py-5 rounded-[25px] font-black text-lg hover:bg-[#e67635] shadow-lg transition-all active:scale-95">
            + Add Task
          </button>
        </form>

        {/* รายการงาน */}
        <div className="space-y-4">
          {filteredTasks.length > 0 ? filteredTasks.map((task) => (
            <div key={task.id} className="bg-white p-6 rounded-[30px] shadow-sm flex justify-between items-center border border-orange-50 hover:border-orange-200 transition-all group">
              <div className="flex items-center gap-4">
                <div className={`w-3 h-12 rounded-full transition-colors ${task.status === "Done" ? "bg-green-400" : "bg-[#FF8C42]"}`}></div>
                
                {/* ชื่อ Task: ปรับสีเทาให้เข้มขึ้น (gray-500) เพื่อให้อ่านออกเวลาขีดฆ่า */}
                <span className={`text-xl font-bold transition-all ${
                  task.status === "Done" 
                    ? "text-gray-500 line-through decoration-2" 
                    : "text-gray-800"
                }`}>
                  {task.title}
                </span>
              </div>
              
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => toggleStatus(task.id, task.status)}
                  className={`px-6 py-2 rounded-2xl text-[10px] font-black tracking-widest uppercase transition-all shadow-sm hover:scale-110 active:scale-90
                    ${task.status === "Done" 
                      ? "bg-green-500 text-white shadow-green-100" 
                      : "bg-orange-100 text-[#FF8C42]"}`}
                >
                  {task.status}
                </button>
                
                <button 
                  onClick={() => deleteTask(task.id)} 
                  className="text-red-300 hover:text-red-500 font-bold p-2 text-xl transition-colors transform hover:rotate-90 duration-200"
                >
                  ✕
                </button>
              </div>
            </div>
          )) : (
            <div className="text-center py-24 bg-white/50 rounded-[40px] border-2 border-dashed border-orange-100">
              <p className="text-gray-400 font-black text-xl">
                {searchQuery ? "ไม่พบงานที่ค้นหา 🔎" : "ยังไม่มีรายการงานในขณะนี้ เริ่มเพิ่มงานแรกกันเลย! 🚀"}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TaskBoard() {
  const getCurrentThaiTime = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    return new Date(now.getTime() - offset).toISOString().slice(0, 16);
  };

  const [tasks, setTasks] = useState<{ id: number; title: string; status: string; due_date?: string }[]>([]);
  const [newTask, setNewTask] = useState("");
  const [dueDate, setDueDate] = useState(getCurrentThaiTime()); 
  const [name, setName] = useState("Sirapat");
  const [searchQuery, setSearchQuery] = useState(""); 

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

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      if (Array.isArray(data)) setTasks(data);
    } catch (error) {
      console.error("Fetch tasks failed", error);
    }
  };

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTask, due_date: dueDate }),
    });
    
    if (response.ok) {
      const savedTask = await response.json();
      setTasks([savedTask, ...tasks]);
      setNewTask("");
      setDueDate(getCurrentThaiTime()); 
    }
  };

  const toggleStatus = async (id: number, currentStatus: string) => {
    let newStatus = currentStatus === "To Do" ? "In Progress" : currentStatus === "In Progress" ? "Done" : "To Do";
    const response = await fetch('/api/tasks', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus }),
    });
    if (response.ok) {
      setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
    }
  };

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

  const isOverdue = (dateString?: string, status?: string) => {
    if (!dateString || status === "Done") return false;
    const now = new Date().getTime();
    const deadline = new Date(dateString).getTime();
    return deadline < now;
  };

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#FFF5EE]">
      {/* Sidebar - เอาปุ่ม Logout ออกแล้ว */}
      <aside className="w-72 bg-[#FF8C42] p-8 text-white flex flex-col justify-between shadow-xl fixed h-full">
        <div>
          <div className="text-2xl font-black mb-12 italic tracking-tighter">✔️ TaskBoardApp</div>
          <nav className="space-y-3 font-bold">
            <Link href="/" className="block p-4 rounded-2xl hover:bg-white/10 transition-all">🏠 Dashboard</Link>
            <Link href="/taskboard" className="block bg-white/20 p-4 rounded-2xl shadow-md">📋 Task Board</Link>
            <Link href="/settings" className="block p-4 rounded-2xl hover:bg-white/10 transition-all">⚙️ Settings</Link>
          </nav>
        </div>

        <div className="space-y-4">
          <div className="bg-white/10 p-4 rounded-[25px] flex items-center gap-3 border border-white/10">
            <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center text-[#FF8C42] font-black text-xl uppercase shadow-inner">
              {name[0]}
            </div>
            <div className="overflow-hidden">
              <p className="font-black text-sm truncate text-white">{name}</p>
              <p className="text-xs text-orange-100/70 font-bold">Online Now</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-12 ml-72">
        <header className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-black text-gray-800 tracking-tight">Task Board</h1>
            <p className="text-gray-500 mt-2 font-medium italic">จัดการงานและกำหนดเวลาของ {name}</p>
          </div>
          <div className="w-80 relative">
            <input 
              type="text" 
              placeholder="🔍 ค้นหางาน..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-4 pl-6 bg-white rounded-full shadow-sm border border-orange-50 outline-none focus:ring-2 focus:ring-[#FF8C42] text-sm font-bold text-gray-800"
            />
          </div>
        </header>

        <form onSubmit={addTask} className="bg-white p-8 rounded-[40px] shadow-sm border border-orange-50 mb-10 flex flex-col gap-4">
          <input 
            type="text" 
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="เพิ่มงานใหม่ที่คุณต้องทำวันนี้..." 
            className="w-full p-5 bg-orange-50 rounded-[25px] outline-none focus:ring-2 focus:ring-[#FF8C42] font-bold text-gray-800"
          />
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <span className="absolute left-5 top-2 text-[10px] font-black text-[#FF8C42] uppercase tracking-widest">Due Date (กำหนดส่ง)</span>
              <input 
                type="datetime-local" 
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full p-5 pt-7 bg-orange-50 rounded-[25px] outline-none focus:ring-2 focus:ring-[#FF8C42] font-bold text-gray-600 text-sm"
              />
            </div>
            <button type="submit" className="bg-[#FF8C42] text-white px-10 py-5 rounded-[25px] font-black text-lg hover:bg-[#e67635] shadow-lg active:scale-95 transition-all">
              + Add Task
            </button>
          </div>
        </form>

        <div className="space-y-4">
          {filteredTasks.length > 0 ? filteredTasks.map((task) => {
            const overdue = isOverdue(task.due_date, task.status);
            return (
              <div key={task.id} className={`bg-white p-6 rounded-[30px] shadow-sm flex justify-between items-center border transition-all ${overdue ? "border-red-300 bg-red-50" : "border-orange-50"}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-12 rounded-full ${
                    overdue ? "bg-red-500 animate-pulse" : (task.status === "Done" ? "bg-green-400" : task.status === "In Progress" ? "bg-blue-400" : "bg-[#FF8C42]")
                  }`}></div>
                  
                  <div>
                    <span className={`text-xl font-bold block ${
                      overdue ? "text-red-600" : (task.status === "Done" ? "text-gray-400 line-through" : "text-gray-800")
                    }`}>
                      {task.title} {overdue && "⚠️"}
                    </span>
                    {task.due_date && (
                      <span className={`text-[10px] font-black px-3 py-1 rounded-full mt-1 inline-block uppercase tracking-wider ${
                        overdue ? "bg-red-600 text-white shadow-md" : "bg-orange-50 text-gray-400"
                      }`}>
                        📅 {overdue ? "เลยกำหนดส่ง: " : "กำหนดส่ง: "} 
                        {new Date(task.due_date).toLocaleString('th-TH', {
                          year: 'numeric', month: 'long', day: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <button 
                    onClick={() => toggleStatus(task.id, task.status)}
                    className={`px-6 py-2 rounded-2xl text-[10px] font-black tracking-widest uppercase transition-all shadow-sm
                      ${task.status === "Done" ? "bg-green-500 text-white" : 
                        task.status === "In Progress" ? "bg-blue-500 text-white" : 
                        "bg-orange-100 text-[#FF8C42]"}`}
                  >
                    {task.status}
                  </button>
                  <button onClick={() => deleteTask(task.id)} className="text-red-200 hover:text-red-500 font-bold p-2 text-xl transition-colors">✕</button>
                </div>
              </div>
            );
          }) : (
            <div className="text-center py-24 font-black text-gray-400 text-xl">ยังไม่มีงานในขณะนี้ 🚀</div>
          )}
        </div>
      </main>
    </div>
  );
}
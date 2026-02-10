"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Settings() {
  const [newName, setNewName] = useState("");
  const [currentName, setCurrentName] = useState("User");

  useEffect(() => {
    // ดึงชื่อจาก LocalStorage มาแสดง
    const savedName = localStorage.getItem("username");
    if (savedName) {
      setNewName(savedName);
      setCurrentName(savedName);
    }
  }, []);

  const saveSettings = () => {
    if (!newName.trim()) return alert("กรุณาระบุชื่อผู้ใช้งาน");
    localStorage.setItem("username", newName); // บันทึกชื่อใหม่
    alert("บันทึกการตั้งค่าเรียบร้อย! ✨");
    window.location.reload(); // รีโหลดเพื่อให้ Sidebar อัปเดตชื่อ
  };

  return (
    <div className="flex min-h-screen bg-[#FFF5EE]">
      {/* Sidebar - ปรับให้เหมือนหน้า Dashboard และ Task Board */}
      <aside className="w-72 bg-[#FF8C42] p-8 text-white flex flex-col justify-between shadow-xl">
        <div>
          <div className="text-2xl font-black mb-12 italic tracking-tighter">✔️ TaskBoardApp</div>
          <nav className="space-y-3 font-bold">
            <Link href="/" className="block p-4 rounded-2xl hover:bg-white/10 transition-all">🏠 Dashboard</Link>
            <Link href="/taskboard" className="block p-4 rounded-2xl hover:bg-white/10 transition-all">📋 Task Board</Link>
            <Link href="/settings" className="block bg-white/20 p-4 rounded-2xl shadow-md">⚙️ Settings</Link>
          </nav>
        </div>
        
        {/* Profile Section ใน Sidebar */}
        <div className="bg-white/10 p-4 rounded-[25px] flex items-center gap-3 border border-white/10">
          <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center text-[#FF8C42] font-bold text-xl uppercase shadow-inner">
            {currentName[0]}
          </div>
          <div className="overflow-hidden">
            <p className="font-bold text-sm truncate">{currentName}</p>
            <p className="text-xs text-orange-100/70">Online Now</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12">
        <header className="mb-10">
          <h1 className="text-4xl font-black text-gray-800 tracking-tight">Settings</h1>
          <p className="text-gray-500 mt-2 font-medium">จัดการข้อมูลส่วนตัวและรูปแบบการใช้งาน</p>
        </header>

        <div className="bg-white p-10 rounded-[40px] shadow-sm max-w-2xl border border-orange-50">
          <div className="mb-8">
            <label className="block text-sm font-black text-gray-400 uppercase mb-4 tracking-widest">
              Your Display Name
            </label>
            {/* แก้ไขสีตัวอักษรเป็น text-gray-800 ให้เห็นชัดเจน */}
            <input 
              type="text" 
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="ระบุชื่อผู้ใช้งานใหม่..."
              className="w-full p-5 bg-orange-50 rounded-[25px] outline-none border-2 border-transparent focus:border-[#FF8C42] font-bold text-gray-800 transition-all"
            />
            <p className="mt-3 text-xs text-gray-400 italic">* ชื่อนี้จะไปปรากฏบน Dashboard และ Sidebar ของคุณ</p>
          </div>

          <button 
            onClick={saveSettings}
            className="w-full sm:w-auto bg-[#FF8C42] text-white px-12 py-5 rounded-[25px] font-black text-lg hover:bg-[#e67635] transition-all shadow-lg shadow-orange-100 active:scale-95"
          >
            Save Changes
          </button>
        </div>

        {/* Info Card เพิ่มเติม */}
        <div className="mt-8 bg-white/50 p-8 rounded-[40px] max-w-2xl border border-dashed border-orange-200">
          <h3 className="font-bold text-gray-800">App Version</h3>
          <p className="text-gray-400 text-sm">v1.0.4 - System is up to date.</p>
        </div>
      </main>
    </div>
  );
}
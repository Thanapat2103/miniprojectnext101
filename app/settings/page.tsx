"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Settings() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    const savedName = localStorage.getItem("username");
    if (savedName) setUsername(savedName);
  }, []);

  const handleLogout = () => {
    if (confirm("คุณต้องการออกจากระบบใช่หรือไม่?")) {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("username");
      window.location.href = "/login";
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });
    
    if (password !== confirmPassword) {
      setMessage({ text: "รหัสผ่านไม่ตรงกัน!", type: "error" });
      return;
    }

    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        localStorage.setItem("username", username);
        setMessage({ text: "อัปเดตข้อมูลสำเร็จแล้ว ✨", type: "success" });
        setPassword("");
        setConfirmPassword("");
        setTimeout(() => window.location.reload(), 1000);
      } else {
        setMessage({ text: "เกิดข้อผิดพลาดในการอัปเดต", type: "error" });
      }
    } catch (error) {
      setMessage({ text: "เชื่อมต่อเซิร์ฟเวอร์ไม่ได้", type: "error" });
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FFF5EE]">
      {/* Sidebar - (ลบปุ่ม Logout ออกจากที่นี่แล้ว) */}
      <aside className="w-72 bg-[#FF8C42] p-8 text-white flex flex-col justify-between shadow-xl fixed h-full">
        <div>
          <div className="text-2xl font-black mb-12 italic tracking-tighter">✔️ TaskBoardApp</div>
          <nav className="space-y-3 font-bold">
            <Link href="/" className="block p-4 rounded-2xl hover:bg-white/10 transition-all">🏠 Dashboard</Link>
            <Link href="/taskboard" className="block p-4 rounded-2xl hover:bg-white/10 transition-all">📋 Task Board</Link>
            <Link href="/settings" className="block bg-white/20 p-4 rounded-2xl shadow-md">⚙️ Settings</Link>
          </nav>
        </div>

        <div className="bg-white/10 p-4 rounded-[25px] flex items-center gap-3 border border-white/10">
          <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center text-[#FF8C42] font-black text-xl uppercase shadow-inner">
            {username ? username[0] : "U"}
          </div>
          <div className="overflow-hidden">
            <p className="font-black text-sm truncate text-white">{username || "User"}</p>
            <p className="text-xs text-orange-100/70 font-bold">Online Now</p>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-12 flex justify-center items-start ml-72">
        <div className="max-w-md w-full bg-white p-10 rounded-[40px] shadow-sm border border-orange-50 mt-10">
          <h1 className="text-3xl font-black text-gray-800 mb-2">Settings</h1>
          <p className="text-gray-500 mb-8 font-medium">จัดการข้อมูลส่วนตัวของคุณ</p>

          <form onSubmit={handleUpdate} className="space-y-5">
            <div>
              <label className="block text-xs font-black text-[#FF8C42] uppercase tracking-widest mb-2 ml-1">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-4 bg-orange-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#FF8C42] font-bold text-gray-800"
              />
            </div>

            <div className="pt-4 border-t border-orange-100">
              <label className="block text-xs font-black text-[#FF8C42] uppercase tracking-widest mb-2 ml-1">New Password</label>
              <input 
                type="password" 
                placeholder="กรอกรหัสผ่านใหม่"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 bg-orange-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#FF8C42] font-bold text-gray-800"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-[#FF8C42] uppercase tracking-widest mb-2 ml-1">Confirm Password</label>
              <input 
                type="password" 
                placeholder="ยืนยันรหัสผ่านใหม่"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-4 bg-orange-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#FF8C42] font-bold text-gray-800"
              />
            </div>

            {message.text && (
              <p className={`text-center font-bold text-sm p-3 rounded-xl ${message.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {message.text}
              </p>
            )}

            <button type="submit" className="w-full bg-[#FF8C42] text-white py-4 rounded-2xl font-black text-lg hover:bg-[#e67635] shadow-lg transition-all active:scale-95 mt-4">
              Save Changes
            </button>
          </form>

          {/* --- ปุ่ม Log Out อยู่ที่นี่ครับ --- */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <button 
              onClick={handleLogout}
              className="w-full bg-gray-50 text-red-500 py-4 rounded-2xl font-black text-lg hover:bg-red-50 transition-all active:scale-95 border border-red-100 flex items-center justify-center gap-2"
            >
              🚪 Log Out from System
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
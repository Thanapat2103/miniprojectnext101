"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return alert("กรุณากรอกข้อมูลให้ครบถ้วน");

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        alert("ลงทะเบียนสำเร็จ! 🎉");
        router.push("/login"); // สมัครเสร็จแล้วส่งไปหน้า Login
      } else {
        const error = await res.json();
        alert(error.error || "เกิดข้อผิดพลาด");
      }
    } catch (err) {
      alert("ไม่สามารถติดต่อเซิร์ฟเวอร์ได้");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FFF5EE]">
      <form 
        onSubmit={handleRegister} 
        className="bg-white p-12 rounded-[40px] shadow-2xl text-center w-full max-w-md border border-orange-50"
      >
        <div className="mb-8">
          <div className="text-5xl mb-4">📝</div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">Register</h1>
          <p className="text-gray-400 mt-2 font-medium">สร้างบัญชีใหม่เพื่อเริ่มใช้งาน</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-left text-xs font-black text-gray-400 uppercase ml-5 mb-2 tracking-widest">Username</label>
            <input 
              type="text" 
              placeholder="ตั้งชื่อผู้ใช้งาน..." 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              // เพิ่ม text-gray-800 ให้เห็นตัวอักษรชัดเจน
              className="w-full p-5 bg-orange-50 rounded-2xl outline-none border-2 border-transparent focus:border-[#FF8C42] font-bold text-gray-800 placeholder:text-gray-300 transition-all"
            />
          </div>

          <div>
            <label className="block text-left text-xs font-black text-gray-400 uppercase ml-5 mb-2 tracking-widest">Password</label>
            <input 
              type="password" 
              placeholder="ตั้งรหัสผ่านของคุณ..." 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              // เพิ่ม text-gray-800 ให้เห็นตัวอักษรชัดเจน
              className="w-full p-5 bg-orange-50 rounded-2xl outline-none border-2 border-transparent focus:border-[#FF8C42] font-bold text-gray-800 placeholder:text-gray-300 transition-all"
            />
          </div>
        </div>

        <button 
          type="submit"
          className="w-full bg-[#FF8C42] text-white py-5 rounded-2xl font-black text-lg mt-8 hover:bg-[#e67635] hover:shadow-lg transition-all active:scale-95"
        >
          CREATE ACCOUNT
        </button>

        <p className="mt-6 text-sm font-bold text-gray-400">
          มีบัญชีอยู่แล้ว? <Link href="/login" className="text-[#FF8C42] hover:underline">เข้าสู่ระบบที่นี่</Link>
        </p>
      </form>
    </div>
  );
}
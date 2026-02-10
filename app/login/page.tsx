"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "1234") { // รหัสผ่านสำหรับเข้าสู่ระบบ
      localStorage.setItem("isLoggedIn", "true"); // บันทึกสถานะการล็อกอินลงในเครื่อง
      router.push("/"); // พาไปหน้า Dashboard
    } else {
      alert("รหัสผ่านไม่ถูกต้อง!"); // แจ้งเตือนเมื่อรหัสผิด
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FFF5EE]">
      <form 
        onSubmit={handleLogin} 
        className="bg-white p-12 rounded-[40px] shadow-2xl text-center w-full max-w-md border border-orange-50"
      >
        <div className="mb-8">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">Login</h1>
          <p className="text-gray-400 mt-2 font-medium">กรุณาใส่รหัสผ่านเพื่อเข้าใช้งาน</p>
        </div>

        <input 
          type="password" 
          placeholder="Enter Password (1234)" 
          // เพิ่ม text-gray-800 เพื่อให้มองเห็นตัวอักษรที่พิมพ์ชัดเจน
          className="w-full p-5 bg-orange-50 rounded-2xl mb-6 outline-none border-2 border-transparent focus:border-[#FF8C42] text-center font-bold text-gray-800 placeholder:text-gray-300 transition-all"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button 
          type="submit"
          className="w-full bg-[#FF8C42] text-white py-5 rounded-2xl font-black text-lg hover:bg-[#e67635] hover:shadow-lg hover:shadow-orange-200 transition-all active:scale-95"
        >
          ENTER SYSTEM
        </button>
        
        <p className="mt-8 text-[10px] text-gray-300 uppercase tracking-[0.2em] font-bold">
          Protected by TaskBoard Security
        </p>
      </form>
    </div>
  );
}
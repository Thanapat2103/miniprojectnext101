"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // 1. เก็บสถานะว่า Login แล้วลงในเครื่อง
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", data.username); // เก็บชื่อจริงจาก DB
        
        alert("ยินดีต้อนรับเข้าสู่ระบบ! 🚀");
        router.push("/"); // ส่งไปหน้า Dashboard
      } else {
        alert(data.error || "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
      }
    } catch (err) {
      alert("ไม่สามารถติดต่อเซิร์ฟเวอร์ได้");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FFF5EE]">
      <form 
        onSubmit={handleLogin} 
        className="bg-white p-12 rounded-[40px] shadow-2xl text-center w-full max-w-md border border-orange-50"
      >
        <div className="mb-8">
          <div className="text-5xl mb-4">🔐</div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">Login</h1>
          <p className="text-gray-400 mt-2 font-medium">เข้าสู่ระบบเพื่อจัดการงานของคุณ</p>
        </div>

        <div className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase ml-5 mb-2 tracking-widest">Username</label>
            <input 
              type="text" 
              placeholder="ชื่อผู้ใช้งานของคุณ..." 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-5 bg-orange-50 rounded-2xl outline-none border-2 border-transparent focus:border-[#FF8C42] font-bold text-gray-800 placeholder:text-gray-300 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase ml-5 mb-2 tracking-widest">Password</label>
            <input 
              type="password" 
              placeholder="รหัสผ่านของคุณ..." 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-5 bg-orange-50 rounded-2xl outline-none border-2 border-transparent focus:border-[#FF8C42] font-bold text-gray-800 placeholder:text-gray-300 transition-all"
            />
          </div>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className={`w-full bg-[#FF8C42] text-white py-5 rounded-2xl font-black text-lg mt-8 hover:bg-[#e67635] hover:shadow-lg transition-all active:scale-95 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? "CHECKING..." : "SIGN IN"}
        </button>

        <p className="mt-6 text-sm font-bold text-gray-400">
          ยังไม่มีบัญชี? <Link href="/register" className="text-[#FF8C42] hover:underline">สมัครสมาชิกที่นี่</Link>
        </p>
      </form>
    </div>
  );
}
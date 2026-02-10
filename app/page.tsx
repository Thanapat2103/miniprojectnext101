"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Dashboard() {
  const [name, setName] = useState("User");
  const [stats, setStats] = useState({ todo: 0, done: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // ระบบ Search
  const router = useRouter();

  useEffect(() => {
    // 1. ระบบ Login Check
    const auth = localStorage.getItem("isLoggedIn");
    if (!auth) {
      router.push("/login");
      return;
    }

    // 2. ดึงชื่อที่ตั้งไว้จากหน้า Settings (ถ้ามี)
    const savedName = localStorage.getItem("username");
    if (savedName) setName(savedName);

    // 3. ดึงตัวเลขจริงจาก API Stats
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats');
        if (res.ok) {
          const data = await res.json();
          setStats({
            todo: data.todo || 0,
            done: data.done || 0
          });
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    router.push("/login");
  };

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-[#FFF5EE]">
      <div className="animate-bounce font-black text-[#FF8C42] text-xl">🚀 กำลังโหลดข้อมูล...</div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#FFF5EE]">
      {/* Sidebar */}
      <aside className="w-72 bg-[#FF8C42] p-8 text-white flex flex-col justify-between shadow-xl">
        <div>
          <div className="text-2xl font-black mb-12 italic tracking-tighter">✔️ TaskBoardApp</div>
          <nav className="space-y-3 font-bold">
            <Link href="/" className="block bg-white/20 p-4 rounded-2xl shadow-md cursor-pointer">
              🏠 Dashboard
            </Link>
            <Link href="/taskboard" className="block p-4 rounded-2xl hover:bg-white/10 transition-all cursor-pointer">
              📋 Task Board
            </Link>
            <Link href="/settings" className="block p-4 rounded-2xl hover:bg-white/10 transition-all cursor-pointer">
              ⚙️ Settings
            </Link>
          </nav>
        </div>
        
        <div className="space-y-4">
          <div className="bg-white/10 p-4 rounded-[25px] flex items-center gap-3 border border-white/10">
            <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center text-[#FF8C42] font-bold text-xl uppercase shadow-inner">
              {name[0]}
            </div>
            <div className="overflow-hidden">
              <p className="font-bold text-sm truncate">{name}</p>
              <p className="text-xs text-orange-100/70">Online Now</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full py-3 rounded-2xl bg-black/10 hover:bg-black/20 text-xs font-black uppercase tracking-widest transition-all"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black text-gray-800 tracking-tight">Dashboard</h1>
            <p className="text-gray-500 mt-1 font-medium italic">ยินดีต้อนรับกลับมา, {name} ✨</p>
          </div>
          
          {/* ระบบ Search Tasks */}
          <div className="relative">
            <input 
              type="text"
              placeholder="🔍 Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white p-4 px-6 rounded-full shadow-sm text-gray-700 border border-orange-50 w-80 outline-none focus:ring-2 focus:ring-[#FF8C42] transition-all"
            />
            {searchQuery && (
              <div className="absolute top-16 w-full bg-white rounded-2xl shadow-xl border border-orange-50 p-4 z-10 text-sm font-bold text-gray-400">
                กำลังค้นหา: "{searchQuery}"... 
                <p className="text-[10px] font-normal italic mt-1 text-gray-400">*ระบบจะกรองในหน้า Task Board</p>
              </div>
            )}
          </div>
        </header>

        {/* Status Cards */}
        <div className="grid grid-cols-3 gap-8">
          <div className="bg-white p-10 rounded-[40px] shadow-sm border-b-[10px] border-[#FF8C42] hover:translate-y-[-5px] transition-all group">
            <p className="text-[#FF8C42] font-black text-xs uppercase tracking-widest">To Do</p>
            <p className="text-7xl font-black mt-3 text-gray-800 group-hover:scale-110 transition-transform origin-left">
              {stats.todo}
            </p>
          </div>
          
          <div className="bg-white p-10 rounded-[40px] shadow-sm border-b-[10px] border-green-400 hover:translate-y-[-5px] transition-all group">
            <p className="text-green-500 font-black text-xs uppercase tracking-widest">Done</p>
            <p className="text-7xl font-black mt-3 text-gray-800 group-hover:scale-110 transition-transform origin-left">
              {stats.done}
            </p>
          </div>

          <div className="bg-white p-10 rounded-[40px] shadow-sm border-b-[10px] border-orange-200 hover:translate-y-[-5px] transition-all group">
            <p className="text-orange-300 font-black text-xs uppercase tracking-widest">Total Tasks</p>
            <p className="text-7xl font-black mt-3 text-gray-800 group-hover:scale-110 transition-transform origin-left">
              {stats.todo + stats.done}
            </p>
          </div>
        </div>

        {/* Shortcut Section */}
        <div className="mt-12 bg-[#FF8C42]/5 p-10 rounded-[40px] border-2 border-dashed border-[#FF8C42]/20 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-gray-800">พร้อมจะลุยงานต่อหรือยัง?</h3>
            <p className="text-gray-500">คุณสามารถเพิ่มงานใหม่ หรือจัดการงานเดิมได้ที่ Task Board</p>
          </div>
          <Link href="/taskboard" className="bg-[#FF8C42] text-white px-10 py-5 rounded-[25px] font-black text-lg hover:shadow-xl hover:bg-[#e67635] transition-all active:scale-95 shadow-lg shadow-orange-100">
            Go to Task Board →
          </Link>
        </div>
      </main>
    </div>
  );
}
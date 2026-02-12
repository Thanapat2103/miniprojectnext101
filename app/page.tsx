"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// ต้องติดตั้ง npm install recharts ก่อนใช้งาน
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export default function Dashboard() {
  const [name, setName] = useState("Sirapat");
  const [stats, setStats] = useState({ todo: 0, inProgress: 0, done: 0 });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 1. ระบบเช็ค Login: ถ้าไม่มีค่าใน localStorage ให้เด้งไปหน้า Register ทันที
    const auth = localStorage.getItem("isLoggedIn");
    if (!auth) {
      router.push("/register"); 
      return;
    }

    // 2. ดึงชื่อผู้ใช้งานที่บันทึกไว้
    const savedName = localStorage.getItem("username");
    if (savedName) setName(savedName);

    // 3. ดึงข้อมูลสถิติจาก API มาแสดงใน Card และ กราฟ
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats');
        if (res.ok) {
          const data = await res.json();
          setStats({
            todo: data.todo || 0,
            inProgress: data.inProgress || 0,
            done: data.done || 0
          });
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [router]);

  // ข้อมูลสำหรับวาดกราฟวงกลม
  const chartData = [
    { name: 'To Do', value: stats.todo, color: '#FF8C42' },
    { name: 'In Progress', value: stats.inProgress, color: '#3B82F6' },
    { name: 'Done', value: stats.done, color: '#4ADE80' },
  ];

  // ถ้ายังโหลดไม่เสร็จ ให้แสดง Loading เพื่อป้องกันหน้าจอขาว
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
        
        <div className="bg-white/10 p-4 rounded-[25px] flex items-center gap-3 border border-white/10">
          <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center text-[#FF8C42] font-bold text-xl uppercase shadow-inner">
            {name[0]}
          </div>
          <div className="overflow-hidden">
            <p className="font-bold text-sm truncate">{name}</p>
            <p className="text-xs text-orange-100/70">Online Now</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12 overflow-y-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-black text-gray-800 tracking-tight">Dashboard</h1>
          <p className="text-gray-500 mt-1 font-medium italic">ยินดีต้อนรับกลับมา, {name} ✨</p>
        </header>

        {/* Status Cards 4 อันตามโจทย์ (To Do, In Progress, Done, Total) */}
        <div className="grid grid-cols-4 gap-6 mb-10">
          <StatCard title="To Do" value={stats.todo} color="border-[#FF8C42]" />
          <StatCard title="In Progress" value={stats.inProgress} color="border-blue-500" />
          <StatCard title="Done" value={stats.done} color="border-green-400" />
          <StatCard title="Total Tasks" value={stats.todo + stats.inProgress + stats.done} color="border-gray-800" />
        </div>

        {/* กราฟวงกลมแสดงสัดส่วนงาน (Pie Chart) */}
        <div className="bg-white p-10 rounded-[40px] shadow-sm border border-orange-50 h-[450px] flex flex-col items-center">
          <h3 className="text-xl font-bold mb-5 text-gray-700">Task Overview (100%)</h3>
          <div className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={chartData} 
                  innerRadius={80} 
                  outerRadius={120} 
                  paddingAngle={8} 
                  dataKey="value"
                  animationDuration={1000}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
}

// Component ย่อยสำหรับ Card สถิติ
function StatCard({ title, value, color }: { title: string; value: number; color: string }) {
  return (
    <div className={`bg-white p-8 rounded-[35px] shadow-sm border-b-[8px] ${color} hover:translate-y-[-5px] transition-all`}>
      <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{title}</p>
      <p className="text-5xl font-black mt-2 text-gray-800">{value}</p>
    </div>
  );
}
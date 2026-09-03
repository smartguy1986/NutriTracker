import { BarChart, Bar, XAxis, Tooltip, Cell, ResponsiveContainer, PieChart, Pie } from 'recharts';
import { useNutrition } from '../context/NutritionContext';
import { BottomNav } from '../components/BottomNav';
import { ChevronLeftIcon, ChevronRightIcon, PencilIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

export function Stats() {
  const { selectedDateLog: dailyLog, selectedDate, setSelectedDate, weeklyData } = useNutrition();

  const macroData = [
  { name: "Protein", value: Math.round(dailyLog.totalProtein), color: "#3b82f6" },
  { name: "Carbs", value: Math.round(dailyLog.totalCarbs), color: "#f97316" },
  { name: "Fat", value: Math.round(dailyLog.totalFat), color: "#ec4899" },
  ];

  const totalMacros = macroData.reduce((acc, curr) => acc + curr.value, 0);
  const pieData = totalMacros === 0 
    ? [{ name: "Empty", value: 1, color: "rgba(128, 128, 128, 0.15)" }] 
    : macroData;

  const sortedMeals = dailyLog.meals;

  const dateObj = new Date(selectedDate + "T12:00:00");
  const formattedDate = dateObj.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const isToday = new Date().toISOString().split('T')[0] === selectedDate;

  const changeDate = (days: number) => {
    const d = new Date(selectedDate + "T12:00:00");
    d.setDate(d.getDate() + days);
    const newDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    setSelectedDate(newDate);
  };

  return (
  <div className="font-sans pb-32 min-h-screen text-brand-text transition-colors duration-300">
  <div className="max-w-md mx-auto pt-12 px-5 pb-5 glass-card border-b border-brand-border/10 rounded-b-3xl">
    <h2 className="text-brand-text text-2xl font-extrabold mb-4">Daily Progress</h2>
    <div className="flex items-center justify-between">
      <button onClick={() => changeDate(-1)} className="p-2 rounded-xl bg-brand-surfaceLight hover:bg-brand-border/20 transition-colors">
        <ChevronLeftIcon className="w-5 h-5 text-brand-text" />
      </button>
      <div className="text-center relative">
        <p className="text-brand-textMuted text-sm font-medium">{formattedDate}{isToday && ' (Today)'}</p>
        <input 
          type="date" 
          value={selectedDate} 
          onChange={(e) => { if(e.target.value) setSelectedDate(e.target.value); }} 
          className="absolute inset-0 opacity-0 cursor-pointer w-full" 
        />
      </div>
      <button onClick={() => changeDate(1)} className="p-2 rounded-xl bg-brand-surfaceLight hover:bg-brand-border/20 transition-colors">
        <ChevronRightIcon className="w-5 h-5 text-brand-text" />
      </button>
    </div>
  </div>

 <div className="max-w-md mx-auto p-5">
 {/* Week bar chart */}
 <div className="glass-card rounded-[24px] p-5 mb-5 border border-brand-border/10">
 <p className="text-brand-textMuted text-xs uppercase tracking-widest font-semibold mb-4">Weekly Overview</p>
 <ResponsiveContainer width="100%" height={140}>
 <BarChart data={weeklyData} barSize={28}>
 <XAxis dataKey="day" tick={{ fill: "var(--color-text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
 <Tooltip
 contentStyle={{ background: "rgb(var(--color-surface))", border: "1px solid rgba(var(--color-border), 0.1)", borderRadius: 12, color: "rgb(var(--color-text))", fontSize: 13, fontWeight: 'bold' }}
 cursor={false}
 />
 <Bar dataKey="calories" fill="rgb(var(--color-accent))" radius={[8, 8, 0, 0]} background={{ fill: 'rgba(128, 128, 128, 0.1)', radius: 8 }}>
 {weeklyData.map((d, i) => (
 <Cell key={i} fill={d.day === "Sun" ? "rgb(var(--color-accent))" : "rgba(var(--color-accent), 0.2)"} />
 ))}
 </Bar>
 </BarChart>
 </ResponsiveContainer>
 </div>

 {/* Macro donut */}
 <div className="glass-card rounded-[24px] p-5 mb-6 border border-brand-border/10 flex items-center gap-6">
 <ResponsiveContainer width={120} height={120}>
 <PieChart>
 <Pie data={pieData} cx="50%" cy="50%" innerRadius={36} outerRadius={55} dataKey="value" strokeWidth={0}>
 {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
 </Pie>
 </PieChart>
 </ResponsiveContainer>
 <div className="flex-1">
 <p className="text-brand-text font-bold text-[15px] mb-3">Macro Split</p>
 {macroData.map((m) => (
 <div key={m.name} className="flex items-center gap-2.5 mb-2">
 <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.color }} />
 <span className="flex-1 text-brand-textMuted text-[13px] font-medium">{m.name}</span>
 <span className="text-brand-text font-extrabold text-[14px] font-mono">{m.value}g</span>
 </div>
 ))}
 </div>
 </div>

 {/* Logged Items */}
 <p className="text-brand-textMuted text-xs uppercase tracking-widest font-semibold mb-3">Logged Items</p>
 <div className="flex flex-col gap-3">
 {sortedMeals.length === 0 ? (
 <div className="glass-card rounded-[20px] p-8 text-center border border-brand-border/10">
 <p className="text-brand-textMuted text-sm font-medium">No logs for today</p>
 </div>
 ) : (
 sortedMeals.map((meal) => {
  const dateObj = new Date(meal.timestamp);
  const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr = dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' });
 return (
 <Link key={meal.id} to={`/edit-meal/${meal.id}`} className="glass-card rounded-[20px] p-4 flex items-center justify-between gap-4 border border-brand-border/10 hover:border-brand-accent/30 transition-colors cursor-pointer group">
 <div className="flex-1">
 <div className="flex items-center gap-2">
 <p className="text-brand-text font-bold text-[15px]">{meal.foodName}</p>
 <PencilIcon className="w-3.5 h-3.5 text-brand-textMuted opacity-0 group-hover:opacity-100 transition-opacity" />
 </div>
 <p className="text-brand-textMuted text-xs font-medium mt-0.5">{dateStr}, {timeStr} · {meal.quantity} {meal.unit}</p>
 <div className="flex gap-3 mt-2">
 <span className="text-xs text-blue-500 font-extrabold font-mono">{Math.round(meal.protein)}g P</span>
 <span className="text-xs text-orange-500 font-extrabold font-mono">{Math.round(meal.carbs)}g C</span>
 <span className="text-xs text-pink-500 font-extrabold font-mono">{Math.round(meal.fat)}g F</span>
 </div>
 </div>
 <div className="text-right">
 <p className="text-brand-accent font-extrabold text-xl font-mono leading-none">
 {Math.round(meal.calories)}
 </p>
 <p className="text-brand-textMuted text-[11px] font-medium mt-1">kcal</p>
 </div>
 </Link>
 );
 })
 )}
 </div>
 </div>
 <BottomNav />
 </div>
 );
}

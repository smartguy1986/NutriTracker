import { BellIcon, FireIcon, BeakerIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';
import { CircularProgress } from '../components/CircularProgress';
import { BottomNav } from '../components/BottomNav';
import { useNutrition } from '../context/NutritionContext';
import { useAuth } from '../context/AuthContext';

export function Home() {
 const { dailyLog, settings, todayWaterMl, updateWater } = useNutrition();
 const { user } = useAuth();

 const remaining = settings.calorieGoal - dailyLog.totalCalories;
 const pctCal = Math.min(dailyLog.totalCalories / settings.calorieGoal, 1);

 const macros = [
 { label: "Protein", value: dailyLog.totalProtein, goal: settings.proteinGoal, colorClass: "text-blue-500", bgClass: "bg-blue-500", unit: "g" },
 { label: "Carbs", value: dailyLog.totalCarbs, goal: settings.carbsGoal, colorClass: "text-orange-500", bgClass: "bg-orange-500", unit: "g" },
 { label: "Fat", value: dailyLog.totalFat, goal: settings.fatGoal, colorClass: "text-pink-500", bgClass: "bg-pink-500", unit: "g" },
 ];

 // Sort meals chronologically (latest first or oldest first? timeline usually newest top)
 const timelineMeals = [...dailyLog.meals].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

 // Function to get computed accent color (to pass to CircularProgress if it needs a string, or modify CircularProgress to accept classes)
 // Since CircularProgress takes a string color, we might need a workaround or just pass the CSS variable
 const accentColorValue = "rgb(var(--color-accent))";

 return (
 <div className="font-sans pb-32 min-h-screen text-brand-text transition-colors duration-300">
 {/* Header */}
 <div className="max-w-md mx-auto pt-12 px-5 pb-5 glass-card border-b border-brand-border/10 rounded-b-3xl ">
 <div className="flex justify-between items-start mb-6">
 <div>
 <p className="text-brand-textMuted text-sm mb-1">Good morning 👋</p>
 <h2 className="text-brand-text text-2xl font-extrabold">{user?.name || "User"}</h2>
 </div>
 {user?.picture ? (
 <img src={user.picture} alt="Profile" referrerPolicy="no-referrer" className="w-11 h-11 rounded-xl object-cover " />
 ) : (
 <div className="w-11 h-11 rounded-xl bg-brand-accent/20 flex items-center justify-center">
 <BellIcon className="w-5 h-5 text-brand-accent" />
 </div>
 )}
 </div>

 {/* Main calorie ring */}
 <div className="flex items-center gap-6 bg-brand-surfaceLight rounded-[24px] p-6 border border-brand-border/20">
 <CircularProgress 
 value={dailyLog.totalCalories} 
 max={settings.calorieGoal} 
 size={120} 
 strokeWidth={10} 
 color={accentColorValue}
 label={Math.round(dailyLog.totalCalories).toString()} 
 sublabel="kcal eaten" 
 />
 <div className="flex-1">
 <div className="mb-4">
 <p className="text-brand-textMuted text-xs uppercase tracking-widest mb-1 font-semibold">Remaining</p>
 <p className={`font-mono text-3xl font-extrabold ${remaining >= 0 ? 'text-brand-accent' : 'text-red-500'}`}>
 {Math.abs(Math.round(remaining))} <span className="text-sm font-sans font-medium text-brand-textMuted">kcal</span>
 </p>
 <p className="text-brand-textMuted text-xs mt-1">{remaining >= 0 ? "left to eat" : "over goal"}</p>
 </div>
 <div className=" rounded-full h-2 overflow-hidden shadow-inner">
 <div 
 className={`h-full rounded-full transition-all duration-700 ease-out ${pctCal >= 1 ? 'bg-red-500' : 'bg-brand-accent'}`} 
 style={{ width: `${pctCal * 100}%` }} 
 />
 </div>
 <div className="flex justify-between mt-1">
 <span className="text-[10px] text-brand-textMuted font-mono">0</span>
 <span className="text-[10px] text-brand-textMuted font-mono">{settings.calorieGoal} kcal</span>
 </div>
 </div>
 </div>
 </div>

 <div className="max-w-md mx-auto p-5">
 {/* Macro cards */}
 <p className="text-brand-textMuted text-xs uppercase tracking-widest font-semibold mb-3 mt-2">Macronutrients</p>
 <div className="grid grid-cols-3 gap-3 mb-6">
 {macros.map((m) => (
 <div key={m.label} className="glass-card rounded-2xl p-4 border border-brand-border/10">
 <div className="flex items-center gap-2 mb-2">
 <div className={`w-2 h-2 rounded-full ${m.bgClass}`} />
 <span className="text-xs text-brand-textMuted font-semibold">{m.label}</span>
 </div>
 <p className="font-mono text-xl font-extrabold text-brand-text mb-1">
 {Math.round(m.value)}<span className="font-sans text-xs font-medium text-brand-textMuted ml-0.5">{m.unit}</span>
 </p>
 <div className="bg-brand-surfaceLight rounded-full h-1.5 overflow-hidden">
 <div 
 className={`h-full rounded-full transition-all duration-700 ${m.bgClass}`} 
 style={{ width: `${Math.min(m.value / m.goal, 1) * 100}%` }} 
 />
 </div>
 <p className="font-mono text-[10px] text-brand-textMuted mt-1.5">{m.goal}{m.unit} <span className="font-sans">goal</span></p>
 </div>
 ))}
 </div>

 {/* Quick stats */}
 <div className="grid grid-cols-2 gap-3 mb-6">
 <div className="glass-card rounded-2xl p-4 flex items-center gap-3 border border-brand-border/10">
 <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
 <FireIcon className="w-5 h-5 text-orange-500" />
 </div>
 <div>
 <p className="font-mono text-lg font-extrabold text-brand-text">562</p>
 <p className="text-xs text-brand-textMuted">kcal burned</p>
 </div>
 </div>
  <div className="glass-card rounded-2xl p-4 flex items-center justify-between gap-3 border border-brand-border/10">
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
    <BeakerIcon className="w-5 h-5 text-blue-500" />
    </div>
    <div>
    <p className="font-mono text-lg font-extrabold text-brand-text">{Math.round(todayWaterMl / 250)}<span className="font-sans text-xs font-medium text-brand-textMuted">/16</span></p>
    <p className="text-xs text-brand-textMuted">glasses water</p>
    </div>
  </div>
  <div className="flex flex-col gap-1">
    <button onClick={() => updateWater(250)} className="w-6 h-6 rounded-md bg-blue-500/20 text-blue-500 flex items-center justify-center hover:bg-blue-500/30 transition-colors">
      <PlusIcon className="w-4 h-4" />
    </button>
    <button onClick={() => updateWater(-250)} className="w-6 h-6 rounded-md bg-brand-surfaceLight text-brand-textMuted flex items-center justify-center hover:bg-brand-border/20 transition-colors" disabled={todayWaterMl <= 0}>
      <MinusIcon className="w-4 h-4" />
    </button>
  </div>
  </div>
 </div>

 {/* Today's meals timeline */}
 <div className="flex justify-between items-center mb-4 mt-2">
 <p className="text-brand-textMuted text-xs uppercase tracking-widest font-semibold">Timeline</p>
 </div>

 {timelineMeals.length === 0 ? (
 <div className="glass-card rounded-2xl p-8 text-center border border-brand-border/10">
 <p className="text-brand-textMuted text-sm">Nothing logged yet today</p>
 </div>
 ) : (
 <div className="flex flex-col gap-3 relative">
 {/* Timeline line */}
 <div className="absolute left-[19px] top-5 bottom-5 w-0.5 bg-brand-surfaceLight" />
 
 {timelineMeals.map((meal) => {
 const timeStr = new Date(meal.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
 return (
 <div key={meal.id} className="flex gap-4 relative z-10">
 <div className="w-10 h-10 rounded-full glass-card border-[3px] border-brand-bg flex items-center justify-center shrink-0 ">
 <span className="text-base">🍔</span>
 </div>
 <div className="flex-1 glass-card rounded-2xl p-4 border border-brand-border/10 hover:border-brand-accent/30 transition-colors">
 <div className="flex justify-between items-start mb-1">
 <p className="text-brand-text font-bold text-sm">{meal.foodName}</p>
 <span className="text-brand-textMuted text-xs">{timeStr}</span>
 </div>
 <p className="text-brand-textMuted text-xs mb-3">{meal.quantity} {meal.unit}</p>
 <div className="flex gap-4">
 <p className="text-brand-accent font-extrabold text-sm font-mono">
 {Math.round(meal.calories)} <span className="font-sans text-[10px] text-brand-textMuted font-medium">kcal</span>
 </p>
 <p className="text-blue-500 font-extrabold text-sm font-mono">
 {Math.round(meal.protein)} <span className="font-sans text-[10px] text-brand-textMuted font-medium">g pro</span>
 </p>
 </div>
 </div>
 </div>
 );
 })}
 </div>
 )}
 </div>

 <BottomNav />
 </div>
 );
}

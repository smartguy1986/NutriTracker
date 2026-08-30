import { BellIcon, FireIcon, BeakerIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';
import { CircularProgress } from '../components/CircularProgress';
import { BottomNav } from '../components/BottomNav';
import { useNutrition } from '../context/NutritionContext';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export function Home() {
 const { user } = useAuth();
 const { dailyLog, settings, todayWaterMl, todayCaloriesBurned, updateWater, updateCaloriesBurned } = useNutrition();


 const remaining = settings.calorieGoal - dailyLog.totalCalories;
 const pctCal = Math.min(dailyLog.totalCalories / settings.calorieGoal, 1);

 const macros = [
 { label: "Protein", value: dailyLog.totalProtein, goal: settings.proteinGoal, colorClass: "text-blue-500", bgClass: "bg-blue-500", unit: "g" },
 { label: "Carbs", value: dailyLog.totalCarbs, goal: settings.carbsGoal, colorClass: "text-orange-500", bgClass: "bg-orange-500", unit: "g" },
 { label: "Fat", value: dailyLog.totalFat, goal: settings.fatGoal, colorClass: "text-pink-500", bgClass: "bg-pink-500", unit: "g" },
 ];

  const [showStepsModal, setShowStepsModal] = useState(false);
  const [showWaterModal, setShowWaterModal] = useState(false);
  const [stepInput, setStepInput] = useState("");
  const [waterInput, setWaterInput] = useState("250");

 // Sort meals chronologically (latest first or oldest first? timeline usually newest top)
 const timelineMeals = [...dailyLog.meals].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

 const currentHour = new Date().getHours();
 let greeting = 'Good morning';
 let emoji = '👋';
 if (currentHour >= 12 && currentHour < 17) {
   greeting = 'Good afternoon';
   emoji = '☀️';
 } else if (currentHour >= 17) {
   greeting = 'Good evening';
   emoji = '🌙';
 }

 // Function to get computed accent color (to pass to CircularProgress if it needs a string, or modify CircularProgress to accept classes)
 // Since CircularProgress takes a string color, we might need a workaround or just pass the CSS variable
 const accentColorValue = "rgb(var(--color-accent))";

 return (
 <div className="font-sans pb-32 min-h-screen text-brand-text transition-colors duration-300">
 {/* Header */}
 <div className="max-w-md mx-auto pt-12 px-5 pb-5 glass-card border-b border-brand-border/10 rounded-b-3xl ">
 <div className="flex justify-between items-start mb-6">
 <div>
 <p className="text-brand-textMuted text-sm mb-1">{greeting} {emoji}</p>
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
 <p className={`text-xs uppercase tracking-widest mb-1 font-semibold ${remaining >= 0 ? 'text-brand-textMuted' : 'text-red-500/80'}`}>
   {remaining >= 0 ? "Remaining" : "Excess"}
 </p>
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
  {macros.map((m) => {
    const isExcess = m.value > m.goal;
    const diff = Math.abs(m.value - m.goal);
    return (
      <div key={m.label} className="glass-card rounded-2xl p-4 border border-brand-border/10">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-2 h-2 rounded-full ${isExcess ? 'bg-red-500' : m.bgClass}`} />
          <span className="text-xs text-brand-textMuted font-semibold">{m.label}</span>
        </div>
        <p className="font-mono text-xl font-extrabold text-brand-text mb-1">
          {Math.round(m.value)}<span className="font-sans text-xs font-medium text-brand-textMuted ml-0.5">{m.unit}</span>
        </p>
        <div className="bg-brand-surfaceLight rounded-full h-1.5 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-700 ${isExcess ? 'bg-red-500' : m.bgClass}`} 
            style={{ width: `${Math.min(m.value / m.goal, 1) * 100}%` }} 
          />
        </div>
        <div className="flex justify-between items-center mt-1.5">
          <p className="font-mono text-[10px] text-brand-textMuted">{m.goal}{m.unit} <span className="font-sans">goal</span></p>
          {isExcess && (
            <p className="font-mono text-[10px] text-red-500">+{Math.round(diff)}{m.unit} <span className="font-sans">excess</span></p>
          )}
        </div>
      </div>
    );
  })}
 </div>

 {/* Quick stats */}
 <div className="grid grid-cols-2 gap-3 mb-6">
  <button onClick={() => { setStepInput(Math.round(todayCaloriesBurned / 0.04).toString()); setShowStepsModal(true); }} className="glass-card rounded-2xl p-4 flex items-center gap-3 border border-brand-border/10 text-left hover:bg-brand-surfaceLight transition-colors">
  <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
  <FireIcon className="w-5 h-5 text-orange-500" />
  </div>
  <div>
  <p className="font-mono text-lg font-extrabold text-brand-text">{todayCaloriesBurned}</p>
  <p className="text-xs text-brand-textMuted">kcal burned</p>
  <p className="text-[10px] text-orange-500/80 font-medium mt-0.5">~{Math.round(todayCaloriesBurned / 0.04)} steps</p>
  </div>
  </button>
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
    <button onClick={() => setShowWaterModal(true)} className="w-6 h-6 rounded-md bg-blue-500/20 text-blue-500 flex items-center justify-center hover:bg-blue-500/30 transition-colors">
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

  {/* Modals */}
  {showStepsModal && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-brand-surface border border-brand-border/10 rounded-3xl p-6 w-full max-w-sm shadow-2xl">
        <h3 className="text-xl font-bold mb-4 text-brand-text">Log Steps</h3>
        <input 
          type="number" 
          value={stepInput}
          onChange={e => setStepInput(e.target.value)}
          placeholder="e.g. 5000"
          className="w-full bg-brand-surfaceLight text-brand-text border border-brand-border/20 rounded-xl px-4 py-3 mb-4 outline-none focus:ring-2 focus:ring-orange-500 transition-all"
        />
        <div className="flex gap-3">
          <button onClick={() => setShowStepsModal(false)} className="flex-1 py-3 rounded-xl font-semibold bg-brand-surfaceLight text-brand-text hover:bg-brand-border/20 transition-colors">Cancel</button>
          <button onClick={() => {
            const steps = parseInt(stepInput, 10);
            if (!isNaN(steps)) {
              updateCaloriesBurned(Math.round(steps * 0.04));
            }
            setShowStepsModal(false);
          }} className="flex-1 py-3 rounded-xl font-semibold bg-orange-500 text-white hover:bg-orange-600 transition-colors">Save</button>
        </div>
      </div>
    </div>
  )}

  {showWaterModal && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-brand-surface border border-brand-border/10 rounded-3xl p-6 w-full max-w-sm shadow-2xl">
        <h3 className="text-xl font-bold mb-4 text-brand-text">Log Water</h3>
        <div className="grid grid-cols-3 gap-2 mb-4">
          <button onClick={() => setWaterInput('150')} className={`py-2 rounded-lg text-sm font-medium transition-colors ${waterInput === '150' ? 'bg-blue-500 text-white' : 'bg-brand-surfaceLight text-brand-text hover:bg-brand-border/20'}`}>150 ml</button>
          <button onClick={() => setWaterInput('250')} className={`py-2 rounded-lg text-sm font-medium transition-colors ${waterInput === '250' ? 'bg-blue-500 text-white' : 'bg-brand-surfaceLight text-brand-text hover:bg-brand-border/20'}`}>250 ml</button>
          <button onClick={() => setWaterInput('500')} className={`py-2 rounded-lg text-sm font-medium transition-colors ${waterInput === '500' ? 'bg-blue-500 text-white' : 'bg-brand-surfaceLight text-brand-text hover:bg-brand-border/20'}`}>500 ml</button>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <input 
            type="number" 
            value={waterInput}
            onChange={e => setWaterInput(e.target.value)}
            placeholder="Custom amount"
            className="flex-1 bg-brand-surfaceLight text-brand-text border border-brand-border/20 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <span className="text-brand-textMuted font-medium">ml</span>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowWaterModal(false)} className="flex-1 py-3 rounded-xl font-semibold bg-brand-surfaceLight text-brand-text hover:bg-brand-border/20 transition-colors">Cancel</button>
          <button onClick={() => {
            const ml = parseInt(waterInput, 10);
            if (!isNaN(ml)) {
              updateWater(ml);
            }
            setShowWaterModal(false);
          }} className="flex-1 py-3 rounded-xl font-semibold bg-blue-500 text-white hover:bg-blue-600 transition-colors">Add Water</button>
        </div>
      </div>
    </div>
  )}

 </div>
 );
}

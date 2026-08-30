import { CheckIcon, PencilIcon } from '@heroicons/react/24/outline';
import { BottomNav } from '../components/BottomNav';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useNutrition } from '../context/NutritionContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export function Profile() {
  const { user } = useAuth();
  const { weeklyData, achievements: userAchievements, settings, updateSettings } = useNutrition();
  const navigate = useNavigate();
  const heightM = (user?.height || 175) / 100;
  const bmi = ((user?.weight || 72) / (heightM * heightM)).toFixed(1);

  const [isEditingGoals, setIsEditingGoals] = useState(false);

  const [goals, setGoals] = useState({
    calorieGoal: settings.calorieGoal,
    proteinGoal: settings.proteinGoal,
    carbsGoal: settings.carbsGoal,
    fatGoal: settings.fatGoal
  });

  const handleGoalChange = (field: keyof typeof goals, value: string) => {
    setGoals(prev => ({ ...prev, [field]: Number(value) || 0 }));
  };

  const saveGoals = () => {
    updateSettings({ ...settings, ...goals });
  };

  const stats = [
  { label: "Current Weight", value: `${user?.weight || 72} kg`, icon: "⚖️" },
  { label: "Height", value: `${user?.height || 175} cm`, icon: "📏" },
  { label: "BMI", value: bmi, icon: "📊" },
  { label: "Goal", value: user?.goal ? user.goal.charAt(0).toUpperCase() + user.goal.slice(1) : "Maintain", icon: "🎯" },
  ];

  const achievementsList = [
  { label: "7-day streak", icon: "🔥", desc: "Logged meals 7 days in a row", earned: userAchievements.sevenDayStreak },
  { label: "Protein Pro", icon: "💪", desc: "Hit protein goal at least once", earned: userAchievements.proteinPro },
  { label: "Hydrated", icon: "💧", desc: "Drank 16 glasses of water in a day", earned: userAchievements.hydrated },
  ];

 return (
 <div className="font-sans pb-32 min-h-screen text-brand-text transition-colors duration-300">
 <div className="max-w-md mx-auto pt-12 px-5 pb-5 glass-card border-b border-brand-border/10 rounded-b-3xl">
 <div className="flex items-center gap-4">
 {user?.picture ? (
 <img src={user.picture} alt="Profile" referrerPolicy="no-referrer" className="w-[68px] h-[68px] rounded-[20px] object-cover " />
 ) : (
 <div className="w-[68px] h-[68px] rounded-[20px] bg-brand-accent flex items-center justify-center text-3xl text-white font-extrabold ">
 AR
 </div>
 )}
 <div className="flex-1">
 <h2 className="text-brand-text text-[22px] font-extrabold">{user?.name || "User"}</h2>
 <p className="text-brand-textMuted text-[13px] mt-0.5">{user?.email || "user@example.com"}</p>
 <div className="flex items-center gap-1.5 mt-2">
 <div className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
 <span className="text-brand-accent text-xs font-bold">Active plan</span>
 </div>
 </div>
 <button onClick={() => navigate('/edit-profile')} className="ml-auto bg-brand-surfaceLight border-none rounded-xl p-2.5 cursor-pointer hover:bg-brand-border/20 transition-colors">
 <PencilIcon className="w-5 h-5 text-brand-textMuted" />
 </button>
 </div>
 </div>

 <div className="max-w-md mx-auto p-5">
 <div className="grid grid-cols-2 gap-3 mb-5">
 {stats.map((s) => (
 <div key={s.label} className="glass-card rounded-[20px] p-4 border border-brand-border/10">
 <span className="text-[22px] leading-none block mb-2">{s.icon}</span>
 <p className="text-brand-text font-extrabold text-xl font-mono leading-tight">{s.value}</p>
 <p className="text-brand-textMuted text-xs mt-1 font-medium">{s.label}</p>
 </div>
 ))}
 </div>

  {/* Nutrition Goals Section */}
  <div className="mb-5">
  <div className="flex justify-between items-center mb-3">
    <p className="text-brand-textMuted text-xs uppercase tracking-widest font-semibold">Nutrition Goals</p>
    {!isEditingGoals && (
      <button onClick={() => setIsEditingGoals(true)} className="text-brand-accent hover:bg-brand-accent/10 p-1.5 rounded-md transition-colors">
        <PencilIcon className="w-4 h-4" />
      </button>
    )}
  </div>
  <div className="glass-card rounded-[24px] overflow-hidden border border-brand-border/10 p-5 space-y-4">
    <div className="flex items-center justify-between">
      <span className="text-[15px] font-bold text-brand-text">Calories (kcal)</span>
      {isEditingGoals ? (
        <input 
          type="number" 
          value={goals.calorieGoal} 
          onChange={(e) => handleGoalChange('calorieGoal', e.target.value)}
          className="w-24 bg-brand-surfaceLight text-brand-text font-mono font-bold border border-brand-border/20 rounded-xl px-3 py-2 text-right outline-none focus:ring-1 focus:ring-brand-accent transition-all"
        />
      ) : (
        <span className="font-mono font-extrabold text-brand-text text-lg">{goals.calorieGoal}</span>
      )}
    </div>
    <div className="flex items-center justify-between">
      <span className="text-[15px] font-bold text-brand-text">Protein (g)</span>
      {isEditingGoals ? (
        <input 
          type="number" 
          value={goals.proteinGoal} 
          onChange={(e) => handleGoalChange('proteinGoal', e.target.value)}
          className="w-24 bg-brand-surfaceLight text-brand-text font-mono font-bold border border-brand-border/20 rounded-xl px-3 py-2 text-right outline-none focus:ring-1 focus:ring-brand-accent transition-all"
        />
      ) : (
        <span className="font-mono font-extrabold text-brand-text text-lg">{goals.proteinGoal}</span>
      )}
    </div>
    <div className="flex items-center justify-between">
      <span className="text-[15px] font-bold text-brand-text">Carbs (g)</span>
      {isEditingGoals ? (
        <input 
          type="number" 
          value={goals.carbsGoal} 
          onChange={(e) => handleGoalChange('carbsGoal', e.target.value)}
          className="w-24 bg-brand-surfaceLight text-brand-text font-mono font-bold border border-brand-border/20 rounded-xl px-3 py-2 text-right outline-none focus:ring-1 focus:ring-brand-accent transition-all"
        />
      ) : (
        <span className="font-mono font-extrabold text-brand-text text-lg">{goals.carbsGoal}</span>
      )}
    </div>
    <div className="flex items-center justify-between">
      <span className="text-[15px] font-bold text-brand-text">Fat (g)</span>
      {isEditingGoals ? (
        <input 
          type="number" 
          value={goals.fatGoal} 
          onChange={(e) => handleGoalChange('fatGoal', e.target.value)}
          className="w-24 bg-brand-surfaceLight text-brand-text font-mono font-bold border border-brand-border/20 rounded-xl px-3 py-2 text-right outline-none focus:ring-1 focus:ring-brand-accent transition-all"
        />
      ) : (
        <span className="font-mono font-extrabold text-brand-text text-lg">{goals.fatGoal}</span>
      )}
    </div>

    {isEditingGoals && (
      <button 
        onClick={() => {
          saveGoals();
          setIsEditingGoals(false);
        }} 
        className="w-full mt-4 py-3 rounded-xl bg-brand-accent text-white font-bold transition-colors hover:bg-brand-accentHover"
      >
        Update Goals
      </button>
    )}
  </div>
  </div>

 <div className="glass-card rounded-[24px] p-5 mb-5 border border-brand-border/10">
 <div className="flex justify-between items-center mb-4">
 <p className="text-brand-text font-bold text-[15px]">Weekly Activity</p>
 <div className="flex gap-2">
 <div className="flex items-center gap-1.5">
 <div className="w-2 h-2 rounded-[3px] bg-brand-accent" />
 <span className="text-brand-textMuted text-[10px] font-bold uppercase tracking-wider">Calories</span>
 </div>
 </div>
 </div>
 <ResponsiveContainer width="100%" height={120}>
 <BarChart data={weeklyData} barSize={20}>
 <XAxis dataKey="day" tick={{ fill: "var(--color-text-muted)", fontSize: 10 }} axisLine={false} tickLine={false} />
 <Tooltip contentStyle={{ background: "rgb(var(--color-surface))", border: "1px solid rgba(var(--color-border),0.1)", borderRadius: 12, color: "rgb(var(--color-text))", fontSize: 12, fontWeight: 'bold' }} cursor={{fill: "rgba(var(--color-text-muted), 0.1)"}} />
 <Bar dataKey="calories" fill="rgb(var(--color-accent))" radius={[6, 6, 0, 0]} fillOpacity={0.85} />
 </BarChart>
 </ResponsiveContainer>
 </div>

 <p className="text-brand-textMuted text-xs uppercase tracking-widest font-semibold mb-3">Achievements</p>
 <div className="flex flex-col gap-2.5">
  {achievementsList.map((a) => (
  <div key={a.label} className={`glass-card rounded-[20px] p-4 flex items-center gap-4 border border-brand-border/10 transition-all ${a.earned ? '' : 'opacity-40 grayscale'}`}>
  <span className="text-3xl leading-none">{a.icon}</span>
  <div className="flex-1">
  <p className="text-brand-text font-bold text-[15px]">{a.label}</p>
  <p className="text-brand-textMuted text-[13px] mt-0.5">{a.desc}</p>
  </div>
  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${a.earned ? 'bg-brand-accent/20' : 'bg-brand-surfaceLight'}`}>
  {a.earned && <CheckIcon className="w-4 h-4 text-brand-accent stroke-[3px]" />}
  </div>
  </div>
  ))}
 </div>
 </div>
 <BottomNav />
 </div>
 );
}

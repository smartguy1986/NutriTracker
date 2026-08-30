import { useState } from 'react';
import { BottomNav } from '../components/BottomNav';
import { 
 BellIcon, 
 MoonIcon, 
 ClockIcon, 
 ShieldCheckIcon, 
 QuestionMarkCircleIcon, 
 ArrowRightOnRectangleIcon,
 ChevronRightIcon,
 SwatchIcon
} from '@heroicons/react/24/outline';

import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNutrition } from '../context/NutritionContext';
import { useNavigate } from 'react-router-dom';

export function Settings() {
 const [notifications, setNotifications] = useState(true);
 const [reminders, setReminders] = useState(true);
 
 const { logout } = useAuth();
 const navigate = useNavigate();
 const { theme, setTheme, accentColor, setAccentColor } = useTheme();
 const { settings, updateSettings } = useNutrition();

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

 const handleLogout = () => {
 logout();
 navigate('/login');
 };

 const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
 <button
 onClick={onChange}
 className={`w-12 h-7 rounded-full relative transition-colors duration-200 ${value ? 'bg-brand-accent' : 'bg-brand-surfaceLight'}`}
 >
 <div 
 className={`absolute top-1 w-5 h-5 rounded-full transition-all duration-200 ${value ? 'left-[22px] bg-white' : 'left-1 bg-brand-gray'}`} 
 />
 </button>
 );

 return (
 <div className="font-sans pb-32 min-h-screen text-brand-text transition-colors duration-300">
 <div className="max-w-md mx-auto pt-12 px-5 pb-5 glass-card border-b border-brand-border/10">
 <h2 className="text-2xl font-extrabold mb-1">Settings</h2>
 <p className="text-brand-textMuted text-sm">Manage your preferences</p>
 </div>

 <div className="max-w-md mx-auto p-5">
 
 {/* Nutrition Goals Section */}
 <div className="mb-6">
 <p className="text-brand-textMuted text-xs uppercase tracking-widest font-semibold mb-3">Nutrition Goals</p>
 <div className="glass-card rounded-2xl overflow-hidden border border-brand-border/10 p-4 space-y-4">
   <div className="flex items-center justify-between">
     <span className="text-sm font-medium">Calories (kcal)</span>
     <input 
       type="number" 
       value={goals.calorieGoal} 
       onChange={(e) => handleGoalChange('calorieGoal', e.target.value)}
       onBlur={saveGoals}
       className="w-20 bg-brand-surfaceLight border border-brand-border/20 rounded-lg px-2 py-1 text-right text-sm outline-none focus:ring-1 focus:ring-brand-accent transition-all"
     />
   </div>
   <div className="flex items-center justify-between">
     <span className="text-sm font-medium">Protein (g)</span>
     <input 
       type="number" 
       value={goals.proteinGoal} 
       onChange={(e) => handleGoalChange('proteinGoal', e.target.value)}
       onBlur={saveGoals}
       className="w-20 bg-brand-surfaceLight border border-brand-border/20 rounded-lg px-2 py-1 text-right text-sm outline-none focus:ring-1 focus:ring-brand-accent transition-all"
     />
   </div>
   <div className="flex items-center justify-between">
     <span className="text-sm font-medium">Carbs (g)</span>
     <input 
       type="number" 
       value={goals.carbsGoal} 
       onChange={(e) => handleGoalChange('carbsGoal', e.target.value)}
       onBlur={saveGoals}
       className="w-20 bg-brand-surfaceLight border border-brand-border/20 rounded-lg px-2 py-1 text-right text-sm outline-none focus:ring-1 focus:ring-brand-accent transition-all"
     />
   </div>
   <div className="flex items-center justify-between">
     <span className="text-sm font-medium">Fat (g)</span>
     <input 
       type="number" 
       value={goals.fatGoal} 
       onChange={(e) => handleGoalChange('fatGoal', e.target.value)}
       onBlur={saveGoals}
       className="w-20 bg-brand-surfaceLight border border-brand-border/20 rounded-lg px-2 py-1 text-right text-sm outline-none focus:ring-1 focus:ring-brand-accent transition-all"
     />
   </div>
 </div>
 </div>
 
 {/* Appearance Section */}
 <div className="mb-6">
 <p className="text-brand-textMuted text-xs uppercase tracking-widest font-semibold mb-3">Appearance</p>
 <div className="glass-card rounded-2xl overflow-hidden border border-brand-border/10">
 <div className="flex items-center gap-3 p-4 border-b border-brand-border/10">
 <div className="w-9 h-9 rounded-xl bg-brand-surfaceLight flex items-center justify-center">
 <MoonIcon className="w-5 h-5 text-brand-gray" />
 </div>
 <span className="flex-1 text-sm font-medium">Dark Mode</span>
 <Toggle value={theme === 'dark'} onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />
 </div>
 
 <div className="flex items-center gap-3 p-4">
 <div className="w-9 h-9 rounded-xl bg-brand-surfaceLight flex items-center justify-center">
 <SwatchIcon className="w-5 h-5 text-brand-gray" />
 </div>
 <span className="flex-1 text-sm font-medium">Accent Color</span>
 <div className="flex gap-2">
 {(['green', 'blue', 'purple', 'orange', 'rose'] as const).map(color => (
 <button
 key={color}
 onClick={() => setAccentColor(color)}
 className={`w-6 h-6 rounded-full transition-transform ${accentColor === color ? 'scale-110 ring-2 ring-brand-text ring-offset-1 ring-offset-brand-surface' : 'opacity-70 hover:opacity-100'}`}
 >
 <div className={`w-full h-full rounded-full ${color === 'green' ? 'bg-green-500' : color === 'blue' ? 'bg-blue-500' : color === 'purple' ? 'bg-purple-500' : color === 'orange' ? 'bg-orange-500' : 'bg-rose-500'}`} />
 </button>
 ))}
 </div>
 </div>
 </div>
 </div>

 {/* Preferences Section */}
 <div className="mb-6">
 <p className="text-brand-textMuted text-xs uppercase tracking-widest font-semibold mb-3">Preferences</p>
 <div className="glass-card rounded-2xl overflow-hidden border border-brand-border/10">
 <div className="flex items-center gap-3 p-4 border-b border-brand-border/10">
 <div className="w-9 h-9 rounded-xl bg-brand-surfaceLight flex items-center justify-center">
 <BellIcon className="w-5 h-5 text-brand-gray" />
 </div>
 <span className="flex-1 text-sm font-medium">Push Notifications</span>
 <Toggle value={notifications} onChange={() => setNotifications(!notifications)} />
 </div>
 <div className="flex items-center gap-3 p-4">
 <div className="w-9 h-9 rounded-xl bg-brand-surfaceLight flex items-center justify-center">
 <ClockIcon className="w-5 h-5 text-brand-gray" />
 </div>
 <span className="flex-1 text-sm font-medium">Meal Reminders</span>
 <Toggle value={reminders} onChange={() => setReminders(!reminders)} />
 </div>
 </div>
 </div>

 {/* Account Section */}
 <div className="mb-6">
 <p className="text-brand-textMuted text-xs uppercase tracking-widest font-semibold mb-3">Account</p>
 <div className="glass-card rounded-2xl overflow-hidden border border-brand-border/10">
 <div className="flex items-center gap-3 p-4 border-b border-brand-border/10 cursor-pointer hover:bg-brand-surfaceLight transition-colors">
 <div className="w-9 h-9 rounded-xl bg-brand-surfaceLight flex items-center justify-center">
 <ShieldCheckIcon className="w-5 h-5 text-brand-gray" />
 </div>
 <span className="flex-1 text-sm font-medium">Privacy & Security</span>
 <ChevronRightIcon className="w-5 h-5 text-brand-gray" />
 </div>
 <div className="flex items-center gap-3 p-4 cursor-pointer hover:bg-brand-surfaceLight transition-colors">
 <div className="w-9 h-9 rounded-xl bg-brand-surfaceLight flex items-center justify-center">
 <QuestionMarkCircleIcon className="w-5 h-5 text-brand-gray" />
 </div>
 <span className="flex-1 text-sm font-medium">Help & Support</span>
 <ChevronRightIcon className="w-5 h-5 text-brand-gray" />
 </div>
 </div>
 </div>

 <button
 onClick={handleLogout}
 className="w-full p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 font-bold text-sm flex items-center justify-center gap-2 transition-colors hover:bg-red-500/20"
 >
 <ArrowRightOnRectangleIcon className="w-5 h-5" />
 Sign Out
 </button>

 <p className="text-center text-brand-textMuted text-xs mt-6">NutriTrack v1.0.0</p>
 </div>
 <BottomNav />
 </div>
 );
}

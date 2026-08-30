import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { useNutrition } from '../context/NutritionContext';

export function EditProfile() {
 const navigate = useNavigate();
 const { login, user } = useAuth();
 const { updateSettings } = useNutrition();

 const [data, setData] = useState({
 age: 30, // Default if we don't store age yet (can add later if needed)
 sex: 'Male',
 height: user?.height || 175,
 weight: user?.weight || 72,
 targetWeight: user?.target_weight || 70,
 activity: user?.activity || 'active',
 goal: user?.goal || 'maintain',
 rate: user?.rate || 0.5,
 diet: user?.diet || ([] as string[]),
 });

 const handleSave = async () => {
 // Calculate BMR and TDEE based on inputs
 // Mifflin-St Jeor Equation
 let bmr = 10 * data.weight + 6.25 * data.height - 5 * data.age;
 bmr += data.sex === 'Male' ? 5 : -161;

 let multiplier = 1.2;
 if (data.activity === 'active') multiplier = 1.55;
 if (data.activity === 'very_active') multiplier = 1.725;

 let tdee = bmr * multiplier;

 // Adjust for goal
 let targetCalories = tdee;
 if (data.goal === 'lose') {
 targetCalories -= (data.rate * 1000); // approx 1000 cal deficit for 1kg/week
 } else if (data.goal === 'gain') {
 targetCalories += (data.rate * 1000);
 }

 // Save settings
 updateSettings({
 calorieGoal: Math.round(targetCalories),
 proteinGoal: Math.round((targetCalories * 0.3) / 4), // 30% protein
 carbsGoal: Math.round((targetCalories * 0.4) / 4), // 40% carbs
 fatGoal: Math.round((targetCalories * 0.3) / 9), // 30% fat
 });

 // Save profile to DB and update AuthContext
 if (user) {
 await login({ 
 ...user, 
 weight: data.weight,
 height: data.height,
 target_weight: data.targetWeight,
 activity: data.activity,
 goal: data.goal,
 rate: data.rate,
 diet: data.diet,
 calorie_goal: Math.round(targetCalories),
 });
 }
 
 navigate('/profile');
 };

 return (
 <div className="font-sans pb-32 min-h-screen text-brand-text transition-colors duration-300">
 <div className="max-w-md mx-auto pt-12 px-5 pb-5 glass-card border-b border-brand-border/10 sticky top-0 z-10 rounded-b-3xl">
 <div className="flex items-center gap-4 mb-2">
 <button onClick={() => navigate('/profile')} className="text-brand-textMuted p-2 -ml-2 rounded-full hover:bg-brand-border/10 transition-colors">
 <ChevronLeftIcon className="w-6 h-6" />
 </button>
 <h2 className="text-brand-text text-2xl font-extrabold">Edit Profile</h2>
 </div>
 </div>

 <div className="max-w-md mx-auto p-5 space-y-8">
 
 {/* Body Metrics */}
 <section className="space-y-4">
 <h3 className="text-[11px] font-bold text-brand-textMuted uppercase tracking-widest">Body Metrics</h3>
 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="text-[10px] text-brand-textMuted font-bold uppercase tracking-wider mb-2 block">Height (cm)</label>
 <input type="number" value={data.height} onChange={e => setData({...data, height: Number(e.target.value)})} className="w-full glass-card border border-brand-border/20 rounded-2xl px-5 py-4 text-brand-text text-lg font-bold font-mono outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/50 transition-all " />
 </div>
 <div>
 <label className="text-[10px] text-brand-textMuted font-bold uppercase tracking-wider mb-2 block">Weight (kg)</label>
 <input type="number" value={data.weight} onChange={e => setData({...data, weight: Number(e.target.value)})} className="w-full glass-card border border-brand-border/20 rounded-2xl px-5 py-4 text-brand-text text-lg font-bold font-mono outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/50 transition-all " />
 </div>
 </div>
 </section>

 {/* Activity Level */}
 <section className="space-y-4">
 <h3 className="text-[11px] font-bold text-brand-textMuted uppercase tracking-widest">Activity Level</h3>
 <div className="space-y-3">
 {[
 { id: 'desk', title: 'Sedentary', desc: 'Desk job, little to no exercise' },
 { id: 'active', title: 'Moderately Active', desc: 'Workout 3-4x/week, active hobbies' },
 { id: 'very_active', title: 'Highly Active', desc: 'Daily intense training, physical job' },
 ].map(opt => (
 <button
 key={opt.id}
 onClick={() => setData({...data, activity: opt.id})}
 className={`w-full text-left p-5 rounded-2xl border transition-all ${data.activity === opt.id ? 'border-brand-accent bg-brand-accent/10' : 'border-brand-border/10 glass-card hover:border-brand-accent/30'}`}
 >
 <div className={`font-bold text-lg mb-1 ${data.activity === opt.id ? 'text-brand-accent' : 'text-brand-text'}`}>{opt.title}</div>
 <div className="text-brand-textMuted text-sm font-medium">{opt.desc}</div>
 </button>
 ))}
 </div>
 </section>

 {/* Goals */}
 <section className="space-y-4">
 <h3 className="text-[11px] font-bold text-brand-textMuted uppercase tracking-widest">Goal Trajectory</h3>
 <div className="flex glass-card border border-brand-border/10 rounded-2xl p-1.5 ">
 {['lose', 'maintain', 'gain'].map(g => (
 <button
 key={g}
 onClick={() => setData({...data, goal: g})}
 className={`flex-1 py-3 text-[15px] font-bold rounded-xl capitalize transition-all ${data.goal === g ? 'bg-brand-accent text-white shadow-md' : 'text-brand-textMuted hover:bg-brand-surfaceLight'}`}
 >
 {g}
 </button>
 ))}
 </div>
 {data.goal !== 'maintain' && (
 <div className="glass-card p-5 rounded-2xl mt-4 border border-brand-border/10">
 <label className="text-xs text-brand-text font-bold uppercase tracking-wider mb-5 block text-center">
 Target: <span className="text-brand-accent">{data.goal === 'lose' ? 'Lose' : 'Gain'} {data.rate} kg</span> per week
 </label>
 <input
 type="range"
 min="0.1" max="1.0" step="0.1"
 value={data.rate}
 onChange={e => setData({...data, rate: Number(e.target.value)})}
 className="w-full accent-brand-accent"
 />
 </div>
 )}
 </section>

 {/* Dietary Preferences */}
 <section className="space-y-4">
 <h3 className="text-[11px] font-bold text-brand-textMuted uppercase tracking-widest">Dietary Preferences</h3>
 <div className="grid grid-cols-2 gap-3">
 {['Vegan', 'Vegetarian', 'Keto', 'Paleo', 'Mediterranean', 'Gluten-Free', 'Dairy-Free'].map(diet => {
 const selected = data.diet.includes(diet);
 return (
 <button
 key={diet}
 onClick={() => {
 if (selected) setData({...data, diet: data.diet.filter(d => d !== diet)});
 else setData({...data, diet: [...data.diet, diet]});
 }}
 className={`p-4 rounded-xl border text-center transition-all ${selected ? 'border-brand-accent bg-brand-accent/10 text-brand-accent' : 'border-brand-border/10 glass-card text-brand-textMuted hover:border-brand-accent/30 hover:text-brand-text'}`}
 >
 <div className="font-bold text-[15px]">{diet}</div>
 </button>
 )
 })}
 </div>
 </section>

 <button
 onClick={handleSave}
 className="w-full bg-brand-accent text-white font-extrabold text-[17px] py-4 rounded-2xl mt-8 mb-4 flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg shadow-brand-accent/25 hover:bg-brand-accentHover"
 >
 <CheckIcon className="w-6 h-6 stroke-[3px]" />
 Save Changes
 </button>

 </div>
 </div>
 );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { useNutrition } from '../context/NutritionContext';

export function Onboarding() {
 const navigate = useNavigate();
 const { login, user } = useAuth();
 const { updateSettings } = useNutrition();

 const [step, setStep] = useState(1);
 const [data, setData] = useState({
 age: 30,
 sex: 'Male',
 height: 175,
 weight: 75,
 targetWeight: 70,
 activity: 'desk',
 goal: 'lose',
 rate: 0.5,
 diet: [] as string[],
 });

 const handleNext = () => {
 if (step < 4) {
 setStep(step + 1);
 } else {
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

 // Mark as onboarded in AuthContext
 if (user) {
 login({ ...user, onboarded: true });
 }
 navigate('/');
 }
 };

 return (
 <div className="min-h-screen flex flex-col font-sans text-brand-text transition-colors duration-300">
 <div className="flex-1 flex flex-col px-6 pt-16 pb-8 max-w-md mx-auto w-full">
 <div className="flex items-center gap-4 mb-8">
 {step > 1 && (
 <button onClick={() => setStep(step - 1)} className="text-brand-textMuted hover:text-brand-text transition-colors">
 <ChevronLeftIcon className="w-6 h-6" />
 </button>
 )}
 <div className="flex-1 flex gap-2">
 {[1, 2, 3, 4].map(s => (
 <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${s <= step ? 'bg-brand-accent shadow-brand-accent/30' : 'bg-brand-surfaceLight'}`} />
 ))}
 </div>
 </div>

 {step === 1 && (
 <div className="space-y-6 flex-1">
 <h1 className="text-3xl font-extrabold text-brand-text mb-2">Metabolic Setup</h1>
 <p className="text-brand-textMuted text-sm mb-8 font-medium">Let's calculate your baseline.</p>
 
 <div className="space-y-4">
 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="text-[10px] text-brand-textMuted font-bold uppercase tracking-wider mb-2 block">Age</label>
 <input type="number" value={data.age} onChange={e => setData({...data, age: Number(e.target.value)})} className="w-full glass-card border border-brand-border/20 rounded-2xl px-5 py-4 text-brand-text font-bold font-mono text-lg outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/50 transition-all " />
 </div>
 <div>
 <label className="text-[10px] text-brand-textMuted font-bold uppercase tracking-wider mb-2 block">Sex</label>
 <select value={data.sex} onChange={e => setData({...data, sex: e.target.value})} className="w-full glass-card border border-brand-border/20 rounded-2xl px-5 py-4 text-brand-text font-bold text-lg outline-none appearance-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/50 transition-all ">
 <option>Male</option>
 <option>Female</option>
 </select>
 </div>
 </div>
 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="text-[10px] text-brand-textMuted font-bold uppercase tracking-wider mb-2 block">Height (cm)</label>
 <input type="number" value={data.height} onChange={e => setData({...data, height: Number(e.target.value)})} className="w-full glass-card border border-brand-border/20 rounded-2xl px-5 py-4 text-brand-text font-bold font-mono text-lg outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/50 transition-all " />
 </div>
 <div>
 <label className="text-[10px] text-brand-textMuted font-bold uppercase tracking-wider mb-2 block">Weight (kg)</label>
 <input type="number" value={data.weight} onChange={e => setData({...data, weight: Number(e.target.value)})} className="w-full glass-card border border-brand-border/20 rounded-2xl px-5 py-4 text-brand-text font-bold font-mono text-lg outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/50 transition-all " />
 </div>
 </div>
 </div>
 </div>
 )}

 {step === 2 && (
 <div className="space-y-6 flex-1">
 <h1 className="text-3xl font-extrabold text-brand-text mb-2">Activity Level</h1>
 <p className="text-brand-textMuted text-sm mb-8 font-medium">How active is your daily life?</p>
 
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
 </div>
 )}

 {step === 3 && (
 <div className="space-y-6 flex-1">
 <h1 className="text-3xl font-extrabold text-brand-text mb-2">Goal Trajectory</h1>
 <p className="text-brand-textMuted text-sm mb-8 font-medium">What are we aiming for?</p>
 
 <div className="flex glass-card border border-brand-border/10 rounded-2xl p-1.5 mb-8 ">
 {['lose', 'maintain', 'gain'].map(g => (
 <button
 key={g}
 onClick={() => setData({...data, goal: g})}
 className={`flex-1 py-3.5 text-[15px] font-bold rounded-xl capitalize transition-all ${data.goal === g ? 'bg-brand-accent text-white shadow-md' : 'text-brand-textMuted hover:bg-brand-surfaceLight'}`}
 >
 {g}
 </button>
 ))}
 </div>

 {data.goal !== 'maintain' && (
 <div className="glass-card p-6 rounded-2xl border border-brand-border/10">
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
 </div>
 )}

 {step === 4 && (
 <div className="space-y-6 flex-1">
 <h1 className="text-3xl font-extrabold text-brand-text mb-2">Dietary Preferences</h1>
 <p className="text-brand-textMuted text-sm mb-8 font-medium">Select any that apply to you.</p>
 
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
 </div>
 )}

 <button
 onClick={handleNext}
 className="w-full bg-brand-accent text-white font-extrabold text-[17px] py-4 rounded-2xl mt-8 flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg shadow-brand-accent/25 hover:bg-brand-accentHover"
 >
 {step === 4 ? 'Complete Setup' : 'Continue'}
 <ChevronRightIcon className="w-5 h-5 stroke-[3px]" />
 </button>
 </div>
 </div>
 );
}

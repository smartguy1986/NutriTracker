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
    <div className="min-h-screen bg-brand-bg flex flex-col font-sans text-brand-text">
      <div className="flex-1 flex flex-col px-6 pt-16 pb-8 max-w-md mx-auto w-full">
        <div className="flex items-center gap-4 mb-8">
          {step > 1 && (
            <button onClick={() => setStep(step - 1)} className="text-brand-gray">
              <ChevronLeftIcon className="w-6 h-6" />
            </button>
          )}
          <div className="flex-1 flex gap-2">
            {[1, 2, 3, 4].map(s => (
              <div key={s} className={`h-1 flex-1 rounded-full ${s <= step ? 'bg-brand-green' : 'bg-white/10'}`} />
            ))}
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-6 flex-1">
            <h1 className="text-3xl font-extrabold text-white mb-2">Metabolic Setup</h1>
            <p className="text-brand-gray text-sm mb-8">Let's calculate your baseline.</p>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-brand-gray font-bold uppercase tracking-wider mb-2 block">Age</label>
                  <input type="number" value={data.age} onChange={e => setData({...data, age: Number(e.target.value)})} className="w-full bg-[#161921] border border-white/5 rounded-xl px-4 py-3 text-white outline-none" />
                </div>
                <div>
                  <label className="text-xs text-brand-gray font-bold uppercase tracking-wider mb-2 block">Sex</label>
                  <select value={data.sex} onChange={e => setData({...data, sex: e.target.value})} className="w-full bg-[#161921] border border-white/5 rounded-xl px-4 py-3 text-white outline-none appearance-none">
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-brand-gray font-bold uppercase tracking-wider mb-2 block">Height (cm)</label>
                  <input type="number" value={data.height} onChange={e => setData({...data, height: Number(e.target.value)})} className="w-full bg-[#161921] border border-white/5 rounded-xl px-4 py-3 text-white outline-none" />
                </div>
                <div>
                  <label className="text-xs text-brand-gray font-bold uppercase tracking-wider mb-2 block">Weight (kg)</label>
                  <input type="number" value={data.weight} onChange={e => setData({...data, weight: Number(e.target.value)})} className="w-full bg-[#161921] border border-white/5 rounded-xl px-4 py-3 text-white outline-none" />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 flex-1">
            <h1 className="text-3xl font-extrabold text-white mb-2">Activity Level</h1>
            <p className="text-brand-gray text-sm mb-8">How active is your daily life?</p>
            
            <div className="space-y-3">
              {[
                { id: 'desk', title: 'Sedentary', desc: 'Desk job, little to no exercise' },
                { id: 'active', title: 'Moderately Active', desc: 'Workout 3-4x/week, active hobbies' },
                { id: 'very_active', title: 'Highly Active', desc: 'Daily intense training, physical job' },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setData({...data, activity: opt.id})}
                  className={`w-full text-left p-4 rounded-2xl border transition-all ${data.activity === opt.id ? 'border-brand-green bg-brand-green/10' : 'border-white/5 bg-[#161921]'}`}
                >
                  <div className="text-white font-bold text-lg mb-1">{opt.title}</div>
                  <div className="text-brand-gray text-sm">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 flex-1">
            <h1 className="text-3xl font-extrabold text-white mb-2">Goal Trajectory</h1>
            <p className="text-brand-gray text-sm mb-8">What are we aiming for?</p>
            
            <div className="flex bg-[#161921] rounded-2xl p-1 mb-8">
              {['lose', 'maintain', 'gain'].map(g => (
                <button
                  key={g}
                  onClick={() => setData({...data, goal: g})}
                  className={`flex-1 py-3 text-sm font-bold rounded-xl capitalize transition-all ${data.goal === g ? 'bg-white text-black' : 'text-brand-gray'}`}
                >
                  {g}
                </button>
              ))}
            </div>

            {data.goal !== 'maintain' && (
              <div>
                <label className="text-xs text-brand-gray font-bold uppercase tracking-wider mb-4 block text-center">
                  Target: {data.goal === 'lose' ? 'Lose' : 'Gain'} {data.rate} kg per week
                </label>
                <input
                  type="range"
                  min="0.1" max="1.0" step="0.1"
                  value={data.rate}
                  onChange={e => setData({...data, rate: Number(e.target.value)})}
                  className="w-full accent-brand-green"
                />
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 flex-1">
            <h1 className="text-3xl font-extrabold text-white mb-2">Dietary Preferences</h1>
            <p className="text-brand-gray text-sm mb-8">Select any that apply to you.</p>
            
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
                    className={`p-4 rounded-2xl border text-center transition-all ${selected ? 'border-brand-green bg-brand-green/10 text-brand-green' : 'border-white/5 bg-[#161921] text-brand-gray'}`}
                  >
                    <div className="font-bold">{diet}</div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <button
          onClick={handleNext}
          className="w-full bg-brand-green text-black font-extrabold text-lg py-4 rounded-2xl mt-8 flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          {step === 4 ? 'Complete Setup' : 'Continue'}
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

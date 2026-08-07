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
    <div className="font-sans pb-32 bg-brand-bg min-h-screen text-brand-text">
      <div style={{ padding: "52px 20px 20px", background: "#0f1320" }} className="max-w-md mx-auto sticky top-0 z-10">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => navigate('/profile')} className="text-brand-gray p-2 -ml-2 rounded-full hover:bg-white/5">
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          <h2 style={{ color: "#f0f2f5", fontSize: 22, fontWeight: 800 }}>Edit Profile</h2>
        </div>
      </div>

      <div className="max-w-md mx-auto p-5 space-y-8">
        
        {/* Body Metrics */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-brand-gray uppercase tracking-wider">Body Metrics</h3>
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
        </section>

        {/* Activity Level */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-brand-gray uppercase tracking-wider">Activity Level</h3>
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
        </section>

        {/* Goals */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-brand-gray uppercase tracking-wider">Goal Trajectory</h3>
          <div className="flex bg-[#161921] rounded-2xl p-1">
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
            <div className="bg-[#161921] p-4 rounded-2xl mt-4">
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
        </section>

        {/* Dietary Preferences */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-brand-gray uppercase tracking-wider">Dietary Preferences</h3>
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
                  className={`p-3 rounded-xl border text-center transition-all ${selected ? 'border-brand-green bg-brand-green/10 text-brand-green' : 'border-white/5 bg-[#161921] text-brand-gray'}`}
                >
                  <div className="font-bold text-sm">{diet}</div>
                </button>
              )
            })}
          </div>
        </section>

        <button
          onClick={handleSave}
          className="w-full bg-brand-green text-black font-extrabold text-lg py-4 rounded-2xl mt-8 flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <CheckIcon className="w-6 h-6 stroke-[3px]" />
          Save Changes
        </button>

      </div>
    </div>
  );
}

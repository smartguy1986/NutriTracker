import { BellIcon, FireIcon, BeakerIcon } from '@heroicons/react/24/outline';
import { CircularProgress } from '../components/CircularProgress';
import { BottomNav } from '../components/BottomNav';
import { useNutrition } from '../context/NutritionContext';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const MEAL_CATEGORIES = [
  { id: "Breakfast", label: "Breakfast", icon: "🌅" },
  { id: "Lunch", label: "Lunch", icon: "☀️" },
  { id: "Snack", label: "Snacks", icon: "🍎" },
  { id: "Dinner", label: "Dinner", icon: "🌙" },
];

export function Home() {
  const { dailyLog, settings } = useNutrition();
  const { user } = useAuth();
  const navigate = useNavigate();

  const remaining = settings.calorieGoal - dailyLog.totalCalories;
  const pctCal = Math.min(dailyLog.totalCalories / settings.calorieGoal, 1);

  const macros = [
    { label: "Protein", value: dailyLog.totalProtein, goal: settings.proteinGoal, color: "#60a5fa", unit: "g" },
    { label: "Carbs", value: dailyLog.totalCarbs, goal: settings.carbsGoal, color: "#fb923c", unit: "g" },
    { label: "Fat", value: dailyLog.totalFat, goal: settings.fatGoal, color: "#f472b6", unit: "g" },
  ];

  const todayMeals = MEAL_CATEGORIES.map((cat) => {
    const items = dailyLog.meals.filter((m) => m.mealType === cat.id);
    const cal = items.reduce((a, m) => a + m.calories, 0);
    return { ...cat, items, cal };
  }).filter((c) => c.items.length > 0);

  return (
    <div className="font-sans pb-32 bg-brand-bg min-h-screen text-brand-text">
      {/* Header */}
      <div style={{ padding: "52px 20px 20px", background: "linear-gradient(180deg, #0f1320 0%, #0d0f14 100%)" }} className="max-w-md mx-auto">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <p style={{ color: "#6b7585", fontSize: 13, marginBottom: 4 }}>Good morning 👋</p>
            <h2 style={{ color: "#f0f2f5", fontSize: 22, fontWeight: 800 }}>{user?.name || "Akshay Rajput"}</h2>
          </div>
          {user?.picture ? (
            <img src={user.picture} alt="Profile" referrerPolicy="no-referrer" style={{ width: 42, height: 42, borderRadius: 12, objectFit: 'cover' }} />
          ) : (
            <div style={{ width: 42, height: 42, borderRadius: 12, background: "#4ade80", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BellIcon className="w-5 h-5 text-brand-bg" />
            </div>
          )}
        </div>

        {/* Main calorie ring */}
        <div style={{ display: "flex", alignItems: "center", gap: 24, background: "#161921", borderRadius: 20, padding: "24px 24px" }}>
          <CircularProgress 
            value={dailyLog.totalCalories} 
            max={settings.calorieGoal} 
            size={130} 
            strokeWidth={11} 
            color="#4ade80"
            label={Math.round(dailyLog.totalCalories).toString()} 
            sublabel="kcal eaten" 
          />
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: 16 }}>
              <p style={{ color: "#6b7585", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Remaining</p>
              <p style={{ color: remaining >= 0 ? "#4ade80" : "#ef4444", fontSize: 26, fontWeight: 800 }} className="font-mono">
                {Math.abs(Math.round(remaining))} <span className="text-sm">kcal</span>
              </p>
              <p style={{ color: "#6b7585", fontSize: 11 }}>{remaining >= 0 ? "left to eat" : "over goal"}</p>
            </div>
            <div style={{ background: "#1a1e28", borderRadius: 8, height: 6, overflow: "hidden" }}>
              <div style={{ width: `${pctCal * 100}%`, height: "100%", background: pctCal >= 1 ? "#ef4444" : "#4ade80", borderRadius: 8, transition: "width 0.6s ease" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
              <span style={{ fontSize: 10, color: "#6b7585" }} className="font-mono">0</span>
              <span style={{ fontSize: 10, color: "#6b7585" }} className="font-mono">{settings.calorieGoal} kcal</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: "16px 20px" }} className="max-w-md mx-auto">
        {/* Macro cards */}
        <p style={{ color: "#6b7585", fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 600, marginBottom: 12 }}>Macronutrients</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 24 }}>
          {macros.map((m) => (
            <div key={m.label} style={{ background: "#161921", borderRadius: 16, padding: "14px 12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: m.color }} />
                <span style={{ fontSize: 11, color: "#6b7585", fontWeight: 600 }}>{m.label}</span>
              </div>
              <p style={{ fontSize: 18, fontWeight: 800, color: "#f0f2f5", marginBottom: 2 }} className="font-mono">
                {Math.round(m.value)}<span style={{ fontSize: 11, fontWeight: 500, color: "#6b7585", fontFamily: "Plus Jakarta Sans" }}>{m.unit}</span>
              </p>
              <div style={{ background: "#1a1e28", borderRadius: 4, height: 4, overflow: "hidden" }}>
                <div style={{ width: `${Math.min(m.value / m.goal, 1) * 100}%`, height: "100%", background: m.color, borderRadius: 4 }} />
              </div>
              <p style={{ fontSize: 10, color: "#6b7585", marginTop: 4 }} className="font-mono">{m.goal}{m.unit} <span className="font-sans">goal</span></p>
            </div>
          ))}
        </div>

        {/* Quick stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
          <div style={{ background: "#161921", borderRadius: 16, padding: 16, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(251,146,60,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FireIcon className="w-5 h-5 text-brand-orange" />
            </div>
            <div>
              <p style={{ fontSize: 18, fontWeight: 800, color: "#f0f2f5" }} className="font-mono">562</p>
              <p style={{ fontSize: 11, color: "#6b7585" }}>kcal burned</p>
            </div>
          </div>
          <div style={{ background: "#161921", borderRadius: 16, padding: 16, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(96,165,250,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BeakerIcon className="w-5 h-5 text-brand-blue" />
            </div>
            <div>
              <p style={{ fontSize: 18, fontWeight: 800, color: "#f0f2f5" }} className="font-mono">5<span style={{ fontSize: 11, fontWeight: 500, color: "#6b7585", fontFamily: "Plus Jakarta Sans" }}>/8 glasses</span></p>
              <p style={{ fontSize: 11, color: "#6b7585" }}>water intake</p>
            </div>
          </div>
        </div>

        {/* Today's meals */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <p style={{ color: "#6b7585", fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 600 }}>Today's Meals</p>
          <button style={{ fontSize: 12, color: "#4ade80", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
            See all →
          </button>
        </div>

        {todayMeals.length === 0 ? (
          <div style={{ background: "#161921", borderRadius: 16, padding: 24, textAlign: "center" }}>
            <p style={{ color: "#6b7585", fontSize: 14 }}>No meals logged today</p>
            <button onClick={() => navigate('/add-meal')} style={{ marginTop: 12, color: "#4ade80", background: "rgba(74,222,128,0.1)", border: "none", borderRadius: 10, padding: "10px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              + Log a meal
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {todayMeals.map((cat) => (
              <div key={cat.id} style={{ background: "#161921", borderRadius: 16, padding: "14px 16px", display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ fontSize: 24 }}>{cat.icon}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ color: "#f0f2f5", fontWeight: 700, fontSize: 14 }}>{cat.label}</p>
                  <p style={{ color: "#6b7585", fontSize: 12 }}>{cat.items.length} items</p>
                </div>
                <p style={{ color: "#4ade80", fontWeight: 800, fontSize: 16 }} className="font-mono">
                  {Math.round(cat.cal)} <span style={{ fontSize: 11, color: "#6b7585", fontWeight: 400, fontFamily: "Plus Jakarta Sans" }}>kcal</span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}

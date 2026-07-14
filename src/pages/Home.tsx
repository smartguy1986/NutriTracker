import { BellIcon, FireIcon, BeakerIcon } from '@heroicons/react/24/outline';
import { CircularProgress } from '../components/CircularProgress';
import { BottomNav } from '../components/BottomNav';
import { useNutrition } from '../context/NutritionContext';

import { useAuth } from '../context/AuthContext';

export function Home() {
  const { dailyLog, settings } = useNutrition();
  const { user } = useAuth();

  const remaining = settings.calorieGoal - dailyLog.totalCalories;
  const pctCal = Math.min(dailyLog.totalCalories / settings.calorieGoal, 1);

  const macros = [
    { label: "Protein", value: dailyLog.totalProtein, goal: settings.proteinGoal, color: "#60a5fa", unit: "g" },
    { label: "Carbs", value: dailyLog.totalCarbs, goal: settings.carbsGoal, color: "#fb923c", unit: "g" },
    { label: "Fat", value: dailyLog.totalFat, goal: settings.fatGoal, color: "#f472b6", unit: "g" },
  ];

  // Sort meals chronologically (latest first or oldest first? timeline usually newest top)
  const timelineMeals = [...dailyLog.meals].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

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

        {/* Today's meals timeline */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <p style={{ color: "#6b7585", fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 600 }}>Timeline</p>
        </div>

        {timelineMeals.length === 0 ? (
          <div style={{ background: "#161921", borderRadius: 16, padding: 24, textAlign: "center" }}>
            <p style={{ color: "#6b7585", fontSize: 14 }}>Nothing logged yet today</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, position: "relative" }}>
            {/* Timeline line */}
            <div style={{ position: "absolute", left: 19, top: 20, bottom: 20, width: 2, background: "#1e2230" }} />
            
            {timelineMeals.map((meal) => {
              const timeStr = new Date(meal.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              return (
                <div key={meal.id} style={{ display: "flex", gap: 16, position: "relative", zIndex: 1 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 20, background: "#1a1e28", border: "2px solid #0d0f14", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 16 }}>🍔</span>
                  </div>
                  <div style={{ flex: 1, background: "#161921", borderRadius: 16, padding: "14px 16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                      <p style={{ color: "#f0f2f5", fontWeight: 700, fontSize: 15 }}>{meal.foodName}</p>
                      <span style={{ color: "#6b7585", fontSize: 11 }}>{timeStr}</span>
                    </div>
                    <p style={{ color: "#6b7585", fontSize: 13, marginBottom: 8 }}>{meal.quantity} {meal.unit}</p>
                    <div style={{ display: "flex", gap: 12 }}>
                      <p style={{ color: "#4ade80", fontWeight: 800, fontSize: 14 }} className="font-mono">
                        {Math.round(meal.calories)} <span style={{ fontSize: 10, color: "#6b7585", fontWeight: 400, fontFamily: "Plus Jakarta Sans" }}>kcal</span>
                      </p>
                      <p style={{ color: "#60a5fa", fontWeight: 800, fontSize: 14 }} className="font-mono">
                        {Math.round(meal.protein)} <span style={{ fontSize: 10, color: "#6b7585", fontWeight: 400, fontFamily: "Plus Jakarta Sans" }}>g pro</span>
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

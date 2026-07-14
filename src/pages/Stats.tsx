import { BarChart, Bar, XAxis, Tooltip, Cell, ResponsiveContainer, PieChart, Pie } from 'recharts';
import { useNutrition } from '../context/NutritionContext';
import { BottomNav } from '../components/BottomNav';

const WEEK_DATA = [
  { day: "Mon", calories: 1820 },
  { day: "Tue", calories: 2100 },
  { day: "Wed", calories: 1950 },
  { day: "Thu", calories: 2200 },
  { day: "Fri", calories: 1780 },
  { day: "Sat", calories: 2350 },
  { day: "Sun", calories: 783 },
];

export function Stats() {
  const { dailyLog } = useNutrition();

  const macroData = [
    { name: "Protein", value: Math.round(dailyLog.totalProtein), color: "#60a5fa" },
    { name: "Carbs", value: Math.round(dailyLog.totalCarbs), color: "#fb923c" },
    { name: "Fat", value: Math.round(dailyLog.totalFat), color: "#f472b6" },
  ];

  const sortedMeals = [...dailyLog.meals].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="font-sans pb-32 bg-brand-bg min-h-screen text-brand-text">
      <div style={{ padding: "52px 20px 20px", background: "#0f1320" }} className="max-w-md mx-auto">
        <h2 style={{ color: "#f0f2f5", fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Daily Progress</h2>
        <p style={{ color: "#6b7585", fontSize: 13 }}>{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
      </div>

      <div style={{ padding: "16px 20px" }} className="max-w-md mx-auto">
        {/* Week bar chart */}
        <div style={{ background: "#161921", borderRadius: 20, padding: 20, marginBottom: 16 }}>
          <p style={{ color: "#6b7585", fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 600, marginBottom: 16 }}>Weekly Overview</p>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={WEEK_DATA} barSize={24}>
              <XAxis dataKey="day" tick={{ fill: "#6b7585", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "#1e2230", border: "none", borderRadius: 10, color: "#f0f2f5", fontSize: 12 }}
                cursor={{ fill: "rgba(255,255,255,0.03)" }}
              />
              <Bar dataKey="calories" fill="#4ade80" radius={[6, 6, 0, 0]}>
                {WEEK_DATA.map((d, i) => (
                  <Cell key={i} fill={d.day === "Sun" ? "#4ade80" : "#1e2230"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Macro donut */}
        <div style={{ background: "#161921", borderRadius: 20, padding: 20, marginBottom: 16, display: "flex", alignItems: "center", gap: 20 }}>
          <ResponsiveContainer width={120} height={120}>
            <PieChart>
              <Pie data={macroData} cx="50%" cy="50%" innerRadius={36} outerRadius={55} dataKey="value" strokeWidth={0}>
                {macroData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div style={{ flex: 1 }}>
            <p style={{ color: "#f0f2f5", fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Macro Split</p>
            {macroData.map((m) => (
              <div key={m.name} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: m.color }} />
                <span style={{ flex: 1, color: "#6b7585", fontSize: 12 }}>{m.name}</span>
                <span style={{ color: "#f0f2f5", fontWeight: 700, fontSize: 13 }} className="font-mono">{m.value}g</span>
              </div>
            ))}
          </div>
        </div>

        {/* Logged Items */}
        <p style={{ color: "#6b7585", fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 600, marginBottom: 12 }}>Logged Items</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {sortedMeals.length === 0 ? (
            <div style={{ background: "#161921", borderRadius: 16, padding: 24, textAlign: "center" }}>
              <p style={{ color: "#6b7585", fontSize: 14 }}>No logs for today</p>
            </div>
          ) : (
            sortedMeals.map((meal) => {
              const timeStr = new Date(meal.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              return (
                <div key={meal.id} style={{ background: "#161921", borderRadius: 18, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14 }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: "#f0f2f5", fontWeight: 700, fontSize: 15 }}>{meal.foodName}</p>
                    <p style={{ color: "#6b7585", fontSize: 12, marginTop: 2 }}>{timeStr} · {meal.quantity} {meal.unit}</p>
                    <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
                      <span style={{ fontSize: 11, color: "#60a5fa" }} className="font-mono">{Math.round(meal.protein)}g P</span>
                      <span style={{ fontSize: 11, color: "#fb923c" }} className="font-mono">{Math.round(meal.carbs)}g C</span>
                      <span style={{ fontSize: 11, color: "#f472b6" }} className="font-mono">{Math.round(meal.fat)}g F</span>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ color: "#4ade80", fontWeight: 800, fontSize: 18 }} className="font-mono">
                      {Math.round(meal.calories)}
                    </p>
                    <p style={{ color: "#6b7585", fontSize: 11 }}>kcal</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

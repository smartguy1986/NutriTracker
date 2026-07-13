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

const MEAL_CATEGORIES = [
  { id: "Breakfast", label: "Breakfast", icon: "🌅", time: "7:00 – 9:00 AM" },
  { id: "Lunch", label: "Lunch", icon: "☀️", time: "12:00 – 2:00 PM" },
  { id: "Snack", label: "Snacks", icon: "🍎", time: "3:00 – 4:00 PM" },
  { id: "Dinner", label: "Dinner", icon: "🌙", time: "7:00 – 9:00 PM" },
];

export function Stats() {
  const { dailyLog } = useNutrition();

  const macroData = [
    { name: "Protein", value: Math.round(dailyLog.totalProtein), color: "#60a5fa" },
    { name: "Carbs", value: Math.round(dailyLog.totalCarbs), color: "#fb923c" },
    { name: "Fat", value: Math.round(dailyLog.totalFat), color: "#f472b6" },
  ];

  const mealBreakdown = MEAL_CATEGORIES.map((cat) => {
    const items = dailyLog.meals.filter((m) => m.mealType === cat.id);
    const cal = items.reduce((a, m) => a + m.calories, 0);
    const prot = items.reduce((a, m) => a + m.protein, 0);
    return { ...cat, items, cal, prot };
  });

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

        {/* Meal-by-meal */}
        <p style={{ color: "#6b7585", fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 600, marginBottom: 12 }}>Meal Breakdown</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {mealBreakdown.map((cat) => (
            <div key={cat.id} style={{ background: "#161921", borderRadius: 18, overflow: "hidden" }}>
              <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ fontSize: 24 }}>{cat.icon}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ color: "#f0f2f5", fontWeight: 700, fontSize: 15 }}>{cat.label}</p>
                  <p style={{ color: "#6b7585", fontSize: 12 }}>{cat.time}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ color: cat.cal > 0 ? "#4ade80" : "#6b7585", fontWeight: 800, fontSize: 16 }} className="font-mono">
                    {Math.round(cat.cal)} <span style={{ fontSize: 11, color: "#6b7585", fontWeight: 400, fontFamily: "Plus Jakarta Sans" }}>kcal</span>
                  </p>
                  <p style={{ color: "#6b7585", fontSize: 11 }}>{cat.items.length} items</p>
                </div>
              </div>
              {cat.items.length > 0 && (
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "12px 20px", display: "flex", flexDirection: "column", gap: 8 }}>
                  {cat.items.map((item) => (
                    <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", flexShrink: 0 }} />
                      <p style={{ flex: 1, color: "#a8b0c0", fontSize: 13 }}>{item.foodName} <span style={{ color: "#6b7585" }}>× {item.quantity}</span></p>
                      <p style={{ color: "#6b7585", fontSize: 12 }} className="font-mono">{Math.round(item.calories)} kcal</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

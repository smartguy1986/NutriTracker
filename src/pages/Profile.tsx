import { CheckIcon, PencilIcon } from '@heroicons/react/24/outline';
import { BottomNav } from '../components/BottomNav';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';

export function Profile() {
  const { user } = useAuth();
  const stats = [
    { label: "Current Weight", value: "72 kg", icon: "⚖️" },
    { label: "Height", value: "175 cm", icon: "📏" },
    { label: "BMI", value: "23.5", icon: "📊" },
    { label: "Goal", value: "Maintain", icon: "🎯" },
  ];

  const activityData = [
    { day: "Mon", steps: 8200, cal: 320 },
    { day: "Tue", steps: 10500, cal: 420 },
    { day: "Wed", steps: 6800, cal: 270 },
    { day: "Thu", steps: 12000, cal: 480 },
    { day: "Fri", steps: 9400, cal: 376 },
    { day: "Sat", steps: 14200, cal: 562 },
    { day: "Sun", steps: 4100, cal: 164 },
  ];

  const achievements = [
    { label: "7-day streak", icon: "🔥", desc: "Logged meals 7 days in a row" },
    { label: "Protein Pro", icon: "💪", desc: "Hit protein goal 5 times" },
    { label: "Hydrated", icon: "💧", desc: "Met water goal for a week" },
  ];

  return (
    <div className="font-sans pb-32 bg-brand-bg min-h-screen text-brand-text">
      <div style={{ padding: "52px 20px 20px", background: "#0f1320" }} className="max-w-md mx-auto">
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {user?.picture ? (
            <img src={user.picture} alt="Profile" referrerPolicy="no-referrer" style={{ width: 68, height: 68, borderRadius: 20, objectFit: 'cover' }} />
          ) : (
            <div style={{ width: 68, height: 68, borderRadius: 20, background: "linear-gradient(135deg, #4ade80, #22c55e)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, color: "#0d1a0f", fontWeight: 800 }}>
              AR
            </div>
          )}
          <div>
            <h2 style={{ color: "#f0f2f5", fontSize: 22, fontWeight: 800 }}>{user?.name || "Akshay Rajput"}</h2>
            <p style={{ color: "#6b7585", fontSize: 13 }}>{user?.email || "+91 98765 43210"}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80" }} />
              <span style={{ color: "#4ade80", fontSize: 12, fontWeight: 600 }}>Active plan</span>
            </div>
          </div>
          <button style={{ marginLeft: "auto", background: "#1e2230", border: "none", borderRadius: 10, padding: 10, cursor: "pointer" }}>
            <PencilIcon className="w-5 h-5 text-brand-gray" />
          </button>
        </div>
      </div>

      <div style={{ padding: "16px 20px" }} className="max-w-md mx-auto">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10, marginBottom: 20 }}>
          {stats.map((s) => (
            <div key={s.label} style={{ background: "#161921", borderRadius: 16, padding: "16px 16px" }}>
              <span style={{ fontSize: 20 }}>{s.icon}</span>
              <p style={{ color: "#f0f2f5", fontWeight: 800, fontSize: 20, marginTop: 8 }} className="font-mono">{s.value}</p>
              <p style={{ color: "#6b7585", fontSize: 12 }}>{s.label}</p>
            </div>
          ))}
        </div>

        <div style={{ background: "#161921", borderRadius: 20, padding: 20, marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <p style={{ color: "#f0f2f5", fontWeight: 700, fontSize: 14 }}>Weekly Activity</p>
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: "#4ade80" }} />
                <span style={{ color: "#6b7585", fontSize: 10 }}>Steps</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={100}>
            <BarChart data={activityData} barSize={20}>
              <XAxis dataKey="day" tick={{ fill: "#6b7585", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#1e2230", border: "none", borderRadius: 10, color: "#f0f2f5", fontSize: 11 }} cursor={false} />
              <Bar dataKey="steps" fill="#4ade80" radius={[4, 4, 0, 0]} fillOpacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <p style={{ color: "#6b7585", fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 600, marginBottom: 12 }}>Achievements</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {achievements.map((a) => (
            <div key={a.label} style={{ background: "#161921", borderRadius: 16, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 28 }}>{a.icon}</span>
              <div>
                <p style={{ color: "#f0f2f5", fontWeight: 700, fontSize: 14 }}>{a.label}</p>
                <p style={{ color: "#6b7585", fontSize: 12 }}>{a.desc}</p>
              </div>
              <div style={{ marginLeft: "auto", width: 28, height: 28, borderRadius: 8, background: "rgba(74,222,128,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CheckIcon className="w-4 h-4 text-brand-green stroke-[3px]" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

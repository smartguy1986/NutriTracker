import { useState } from 'react';
import { BottomNav } from '../components/BottomNav';
import { 
  BellIcon, 
  MoonIcon, 
  ClockIcon, 
  ArrowTrendingUpIcon, 
  ShieldCheckIcon, 
  QuestionMarkCircleIcon, 
  ArrowRightOnRectangleIcon,
  CheckBadgeIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [reminders, setReminders] = useState(true);
  
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      style={{
        width: 48, height: 28, borderRadius: 14, background: value ? "#4ade80" : "#2e3548",
        border: "none", cursor: "pointer", position: "relative", transition: "background 0.2s",
      }}
    >
      <div style={{
        position: "absolute", top: 4, left: value ? 24 : 4, width: 20, height: 20,
        borderRadius: "50%", background: value ? "#0d1a0f" : "#6b7585",
        transition: "left 0.2s, background 0.2s",
      }} />
    </button>
  );

  const sections = [
    {
      title: "Preferences",
      items: [
        { icon: BellIcon, label: "Push Notifications", toggle: true, value: notifications, onChange: () => setNotifications(!notifications) },
        { icon: MoonIcon, label: "Dark Mode", toggle: true, value: darkMode, onChange: () => setDarkMode(!darkMode) },
        { icon: ClockIcon, label: "Meal Reminders", toggle: true, value: reminders, onChange: () => setReminders(!reminders) },
      ],
    },
    {
      title: "Goals",
      items: [
        { icon: CheckBadgeIcon, label: "Daily Calorie Goal", value2: "2,000 kcal" },
        { icon: ArrowTrendingUpIcon, label: "Activity Level", value2: "Moderate" },
        { icon: ArrowTrendingUpIcon, label: "Weekly Goal", value2: "Maintain weight" },
      ],
    },
    {
      title: "Account",
      items: [
        { icon: ShieldCheckIcon, label: "Privacy & Security" },
        { icon: QuestionMarkCircleIcon, label: "Help & Support" },
      ],
    },
  ];

  return (
    <div className="font-sans pb-32 bg-brand-bg min-h-screen text-brand-text">
      <div style={{ padding: "52px 20px 20px", background: "#0f1320" }} className="max-w-md mx-auto">
        <h2 style={{ color: "#f0f2f5", fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Settings</h2>
        <p style={{ color: "#6b7585", fontSize: 13 }}>Manage your preferences</p>
      </div>

      <div style={{ padding: "16px 20px" }} className="max-w-md mx-auto">
        {sections.map((section) => (
          <div key={section.title} style={{ marginBottom: 24 }}>
            <p style={{ color: "#6b7585", fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 600, marginBottom: 10 }}>{section.title}</p>
            <div style={{ background: "#161921", borderRadius: 18, overflow: "hidden" }}>
              {section.items.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    style={{
                      display: "flex", alignItems: "center", gap: 14, padding: "16px 18px",
                      borderTop: i > 0 ? "1px solid rgba(255,255,255,0.05)" : "none",
                    }}
                  >
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: "#1e2230", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon className="w-5 h-5 text-brand-gray" />
                    </div>
                    <span style={{ flex: 1, color: "#f0f2f5", fontSize: 14, fontWeight: 500 }}>{item.label}</span>
                    {"toggle" in item && item.toggle ? (
                      <Toggle value={item.value!} onChange={item.onChange!} />
                    ) : "value2" in item && item.value2 ? (
                      <span style={{ color: "#6b7585", fontSize: 13 }}>{item.value2}</span>
                    ) : (
                      <ChevronRightIcon className="w-5 h-5 text-brand-gray" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <button
          onClick={handleLogout}
          style={{
            width: "100%", padding: 16, borderRadius: 14, background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", fontWeight: 700, fontSize: 15,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          }}
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5 text-brand-red" />
          Sign Out
        </button>

        <p style={{ textAlign: "center", color: "#6b7585", fontSize: 12, marginTop: 24 }}>NutriTrack v1.0.0</p>
      </div>
      <BottomNav />
    </div>
  );
}

import { useState, useEffect } from "react";
import {
  Home,
  Plus,
  BarChart2,
  User,
  Settings,
  ChevronRight,
  Check,
  X,
  Flame,
  Droplets,
  Zap,
  Apple,
  Clock,
  ChevronLeft,
  Bell,
  Moon,
  Shield,
  HelpCircle,
  LogOut,
  Activity,
  Target,
  TrendingUp,
  Edit3,
} from "lucide-react";
import { RadialBarChart, RadialBar, PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

type Screen = "login" | "otp" | "dashboard" | "add-food" | "daily-progress" | "profile" | "settings";

type MealCategory = "breakfast" | "lunch" | "snacks" | "dinner" | "evening-snack";

interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  quantity: number;
  unit: string;
  category: MealCategory;
  time: string;
}

interface DailyGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number;
}

const FONT_STYLE = { fontFamily: "'Plus Jakarta Sans', sans-serif" };

const MEAL_CATEGORIES: { id: MealCategory; label: string; icon: string; time: string }[] = [
  { id: "breakfast", label: "Breakfast", icon: "🌅", time: "7:00 – 9:00 AM" },
  { id: "lunch", label: "Lunch", icon: "☀️", time: "12:00 – 2:00 PM" },
  { id: "snacks", label: "Snacks", icon: "🍎", time: "3:00 – 4:00 PM" },
  { id: "dinner", label: "Dinner", icon: "🌙", time: "7:00 – 9:00 PM" },
  { id: "evening-snack", label: "Evening Snack", icon: "🌆", time: "5:00 – 6:00 PM" },
];

const FOOD_DATABASE: Omit<FoodItem, "id" | "category" | "time" | "quantity">[] = [
  { name: "Oatmeal", calories: 150, protein: 5, carbs: 27, fat: 2.5, unit: "bowl" },
  { name: "Banana", calories: 89, protein: 1.1, carbs: 23, fat: 0.3, unit: "piece" },
  { name: "Eggs (boiled)", calories: 78, protein: 6, carbs: 0.6, fat: 5, unit: "piece" },
  { name: "Whole Wheat Bread", calories: 69, protein: 3.6, carbs: 12, fat: 1, unit: "slice" },
  { name: "Greek Yogurt", calories: 100, protein: 17, carbs: 6, fat: 0.7, unit: "cup" },
  { name: "Chicken Breast", calories: 165, protein: 31, carbs: 0, fat: 3.6, unit: "100g" },
  { name: "Brown Rice", calories: 215, protein: 5, carbs: 45, fat: 1.8, unit: "cup" },
  { name: "Salmon", calories: 208, protein: 20, carbs: 0, fat: 13, unit: "100g" },
  { name: "Broccoli", calories: 55, protein: 3.7, carbs: 11, fat: 0.6, unit: "cup" },
  { name: "Almonds", calories: 164, protein: 6, carbs: 6, fat: 14, unit: "28g" },
  { name: "Avocado", calories: 240, protein: 3, carbs: 13, fat: 22, unit: "whole" },
  { name: "Sweet Potato", calories: 130, protein: 3, carbs: 30, fat: 0.1, unit: "medium" },
  { name: "Paneer", calories: 265, protein: 18, carbs: 1.2, fat: 21, unit: "100g" },
  { name: "Dal (Lentils)", calories: 230, protein: 18, carbs: 40, fat: 0.9, unit: "cup" },
  { name: "Mixed Nuts", calories: 180, protein: 5, carbs: 8, fat: 16, unit: "30g" },
  { name: "Protein Shake", calories: 120, protein: 25, carbs: 5, fat: 2, unit: "scoop" },
  { name: "Apple", calories: 95, protein: 0.5, carbs: 25, fat: 0.3, unit: "medium" },
  { name: "Idli", calories: 58, protein: 2, carbs: 12, fat: 0.4, unit: "piece" },
  { name: "Dosa", calories: 133, protein: 3, carbs: 23, fat: 2.7, unit: "piece" },
  { name: "Chapati", calories: 120, protein: 3, carbs: 20, fat: 3.7, unit: "piece" },
];

const INITIAL_GOALS: DailyGoals = { calories: 2000, protein: 150, carbs: 250, fat: 65, water: 8 };

const INITIAL_MEALS: FoodItem[] = [
  { id: "1", name: "Oatmeal", calories: 150, protein: 5, carbs: 27, fat: 2.5, quantity: 1, unit: "bowl", category: "breakfast", time: "7:32 AM" },
  { id: "2", name: "Banana", calories: 89, protein: 1.1, carbs: 23, fat: 0.3, quantity: 1, unit: "piece", category: "breakfast", time: "7:35 AM" },
  { id: "3", name: "Chicken Breast", calories: 165, protein: 31, carbs: 0, fat: 3.6, quantity: 1, unit: "100g", category: "lunch", time: "12:45 PM" },
  { id: "4", name: "Brown Rice", calories: 215, protein: 5, carbs: 45, fat: 1.8, quantity: 1, unit: "cup", category: "lunch", time: "12:45 PM" },
  { id: "5", name: "Almonds", calories: 164, protein: 6, carbs: 6, fat: 14, quantity: 1, unit: "28g", category: "snacks", time: "3:15 PM" },
];

const WEEK_DATA = [
  { day: "Mon", calories: 1820 },
  { day: "Tue", calories: 2100 },
  { day: "Wed", calories: 1950 },
  { day: "Thu", calories: 2200 },
  { day: "Fri", calories: 1780 },
  { day: "Sat", calories: 2350 },
  { day: "Sun", calories: 783 },
];

function formatTime() {
  return new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

function CircularProgress({ value, max, size = 120, strokeWidth = 10, color = "#4ade80", bg = "#1a1e28", label, sublabel }: {
  value: number; max: number; size?: number; strokeWidth?: number; color?: string; bg?: string; label?: string; sublabel?: string;
}) {
  const r = (size - strokeWidth * 2) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(value / max, 1);
  const dash = pct * circ;
  const cx = size / 2;

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={cx} cy={cx} r={r} fill="none" stroke={bg} strokeWidth={strokeWidth} />
        <circle
          cx={cx} cy={cx} r={r} fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.6s ease" }}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        {label && <span style={{ fontSize: size * 0.16, fontWeight: 700, color: "#f0f2f5", lineHeight: 1 }}>{label}</span>}
        {sublabel && <span style={{ fontSize: size * 0.1, color: "#6b7585", marginTop: 2 }}>{sublabel}</span>}
      </div>
    </div>
  );
}

function LoginScreen({ onLogin }: { onLogin: (phone: string) => void }) {
  const [phone, setPhone] = useState("");
  const [focused, setFocused] = useState(false);

  const valid = phone.replace(/\D/g, "").length >= 10;

  return (
    <div style={FONT_STYLE} className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex flex-col justify-center px-6 pt-16 pb-8">
        <div className="mb-12">
          <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mb-6">
            <Flame size={28} className="text-primary" />
          </div>
          <h1 className="text-3xl font-extrabold text-foreground mb-2">Track your<br />nutrition.</h1>
          <p className="text-muted-foreground text-sm">Enter your phone number to get started with your personalized calorie journey.</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-xs font-semibold text-muted-foreground tracking-widest uppercase mb-3 block">Phone Number</label>
            <div
              style={{
                display: "flex", alignItems: "center", background: "#1e2230",
                borderRadius: 14, border: `1.5px solid ${focused ? "#4ade80" : "rgba(255,255,255,0.08)"}`,
                transition: "border-color 0.2s", padding: "0 16px",
              }}
            >
              <span style={{ color: "#6b7585", fontSize: 15, marginRight: 8, fontWeight: 500 }}>+91</span>
              <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.1)", marginRight: 12 }} />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="98765 43210"
                maxLength={15}
                style={{
                  flex: 1, background: "none", border: "none", outline: "none",
                  color: "#f0f2f5", fontSize: 17, fontFamily: "'DM Mono', monospace",
                  padding: "16px 0", letterSpacing: 1,
                }}
              />
            </div>
          </div>

          <button
            onClick={() => valid && onLogin(phone)}
            disabled={!valid}
            style={{
              width: "100%", padding: "16px", borderRadius: 14,
              background: valid ? "#4ade80" : "#1e2230",
              color: valid ? "#0d1a0f" : "#6b7585",
              fontWeight: 700, fontSize: 16, border: "none", cursor: valid ? "pointer" : "default",
              transition: "all 0.2s", fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Continue →
          </button>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-8 leading-relaxed">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>

      <div className="px-6 pb-12 grid grid-cols-3 gap-4">
        {[
          { label: "Calories", value: "2,000", unit: "daily goal" },
          { label: "Meals", value: "5", unit: "categories" },
          { label: "Users", value: "50K+", unit: "tracking" },
        ].map((s) => (
          <div key={s.label} style={{ background: "#1a1e28", borderRadius: 14, padding: "14px 12px" }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#f0f2f5" }}>{s.value}</div>
            <div style={{ fontSize: 10, color: "#6b7585", marginTop: 2 }}>{s.unit}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OTPScreen({ phone, onVerify, onBack }: { phone: string; onVerify: () => void; onBack: () => void }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [sent, setSent] = useState(true);
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    if (timer > 0) {
      const t = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [timer]);

  const handleInput = (val: string, idx: number) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) {
      const el = document.getElementById(`otp-${idx + 1}`);
      el?.focus();
    }
  };

  const handleKey = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      document.getElementById(`otp-${idx - 1}`)?.focus();
    }
  };

  const filled = otp.every((d) => d !== "");

  return (
    <div style={FONT_STYLE} className="min-h-screen bg-background flex flex-col px-6 pt-14 pb-8">
      <button onClick={onBack} className="flex items-center gap-2 text-muted-foreground mb-10 w-fit">
        <ChevronLeft size={18} />
        <span className="text-sm">Back</span>
      </button>

      <div className="mb-10">
        <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mb-6">
          <Shield size={26} className="text-primary" />
        </div>
        <h2 className="text-2xl font-extrabold text-foreground mb-2">Verify your<br />number</h2>
        <p className="text-sm text-muted-foreground">
          We sent a 6-digit code to <span style={{ color: "#4ade80", fontFamily: "'DM Mono', monospace" }}>{phone}</span>
        </p>
      </div>

      <div className="flex gap-3 mb-8">
        {otp.map((digit, i) => (
          <input
            key={i}
            id={`otp-${i}`}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleInput(e.target.value, i)}
            onKeyDown={(e) => handleKey(e, i)}
            style={{
              flex: 1, height: 56, textAlign: "center", fontSize: 22, fontWeight: 700,
              background: "#1e2230", borderRadius: 12,
              border: `1.5px solid ${digit ? "#4ade80" : "rgba(255,255,255,0.08)"}`,
              color: "#f0f2f5", outline: "none", fontFamily: "'DM Mono', monospace",
              transition: "border-color 0.2s",
            }}
          />
        ))}
      </div>

      <button
        onClick={() => filled && onVerify()}
        disabled={!filled}
        style={{
          width: "100%", padding: 16, borderRadius: 14,
          background: filled ? "#4ade80" : "#1e2230",
          color: filled ? "#0d1a0f" : "#6b7585",
          fontWeight: 700, fontSize: 16, border: "none", cursor: filled ? "pointer" : "default",
          transition: "all 0.2s", fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 20,
        }}
      >
        Verify & Continue
      </button>

      <div className="text-center">
        {timer > 0 ? (
          <p className="text-sm text-muted-foreground">Resend code in <span style={{ color: "#4ade80", fontFamily: "'DM Mono', monospace" }}>{timer}s</span></p>
        ) : (
          <button onClick={() => { setTimer(30); setSent(true); }} className="text-sm text-primary font-semibold">
            Resend OTP
          </button>
        )}
      </div>

      <div style={{ marginTop: "auto", background: "#1a1e28", borderRadius: 16, padding: 16 }}>
        <p style={{ fontSize: 12, color: "#6b7585", textAlign: "center" }}>
          For demo purposes, any 6-digit code works
        </p>
      </div>
    </div>
  );
}

function BottomNav({ active, onNavigate }: { active: Screen; onNavigate: (s: Screen) => void }) {
  const items = [
    { id: "dashboard" as Screen, icon: Home, label: "Home" },
    { id: "daily-progress" as Screen, icon: BarChart2, label: "Progress" },
    { id: "add-food" as Screen, icon: Plus, label: "Add" },
    { id: "profile" as Screen, icon: User, label: "Profile" },
    { id: "settings" as Screen, icon: Settings, label: "Settings" },
  ];

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, maxWidth: 480, margin: "0 auto",
      background: "#161921", borderTop: "1px solid rgba(255,255,255,0.06)",
      display: "flex", alignItems: "center", padding: "8px 16px 24px",
      zIndex: 100,
    }}>
      {items.map((item) => {
        const isAdd = item.id === "add-food";
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            style={{
              flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
              gap: 4, border: "none", background: "none", cursor: "pointer",
              padding: isAdd ? "0" : "8px 4px",
            }}
          >
            {isAdd ? (
              <div style={{
                width: 52, height: 52, borderRadius: 16, background: "#4ade80",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 20px rgba(74, 222, 128, 0.4)",
                transform: "translateY(-8px)",
              }}>
                <Plus size={24} color="#0d1a0f" strokeWidth={2.5} />
              </div>
            ) : (
              <>
                <item.icon size={20} color={isActive ? "#4ade80" : "#6b7585"} />
                <span style={{ fontSize: 10, color: isActive ? "#4ade80" : "#6b7585", fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500 }}>
                  {item.label}
                </span>
              </>
            )}
          </button>
        );
      })}
    </div>
  );
}

function DashboardScreen({ meals, goals, onNavigate }: { meals: FoodItem[]; goals: DailyGoals; onNavigate: (s: Screen) => void }) {
  const totals = meals.reduce((acc, m) => ({
    calories: acc.calories + m.calories * m.quantity,
    protein: acc.protein + m.protein * m.quantity,
    carbs: acc.carbs + m.carbs * m.quantity,
    fat: acc.fat + m.fat * m.quantity,
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const remaining = goals.calories - totals.calories;
  const pctCal = Math.min(totals.calories / goals.calories, 1);

  const macros = [
    { label: "Protein", value: totals.protein, goal: goals.protein, color: "#60a5fa", unit: "g" },
    { label: "Carbs", value: totals.carbs, goal: goals.carbs, color: "#fb923c", unit: "g" },
    { label: "Fat", value: totals.fat, goal: goals.fat, color: "#f472b6", unit: "g" },
  ];

  const todayMeals = MEAL_CATEGORIES.map((cat) => {
    const items = meals.filter((m) => m.category === cat.id);
    const cal = items.reduce((a, m) => a + m.calories * m.quantity, 0);
    return { ...cat, items, cal };
  }).filter((c) => c.items.length > 0);

  return (
    <div style={{ ...FONT_STYLE, paddingBottom: 90 }}>
      {/* Header */}
      <div style={{ padding: "52px 20px 20px", background: "linear-gradient(180deg, #0f1320 0%, #0d0f14 100%)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <p style={{ color: "#6b7585", fontSize: 13, marginBottom: 4 }}>Good morning 👋</p>
            <h2 style={{ color: "#f0f2f5", fontSize: 22, fontWeight: 800 }}>Rahul Sharma</h2>
          </div>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: "#4ade80", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Bell size={18} color="#0d1a0f" />
          </div>
        </div>

        {/* Main calorie ring */}
        <div style={{ display: "flex", alignItems: "center", gap: 24, background: "#161921", borderRadius: 20, padding: "24px 24px" }}>
          <CircularProgress value={totals.calories} max={goals.calories} size={130} strokeWidth={11} color="#4ade80"
            label={Math.round(totals.calories).toString()} sublabel="kcal eaten" />
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: 16 }}>
              <p style={{ color: "#6b7585", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Remaining</p>
              <p style={{ color: remaining >= 0 ? "#4ade80" : "#ef4444", fontSize: 26, fontWeight: 800 }}>
                {Math.abs(Math.round(remaining))} kcal
              </p>
              <p style={{ color: "#6b7585", fontSize: 11 }}>{remaining >= 0 ? "left to eat" : "over goal"}</p>
            </div>
            <div style={{ background: "#1a1e28", borderRadius: 8, height: 6, overflow: "hidden" }}>
              <div style={{ width: `${pctCal * 100}%`, height: "100%", background: pctCal >= 1 ? "#ef4444" : "#4ade80", borderRadius: 8, transition: "width 0.6s ease" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
              <span style={{ fontSize: 10, color: "#6b7585" }}>0</span>
              <span style={{ fontSize: 10, color: "#6b7585" }}>{goals.calories} kcal</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: "16px 20px" }}>
        {/* Macro cards */}
        <p style={{ color: "#6b7585", fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 600, marginBottom: 12 }}>Macronutrients</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 24 }}>
          {macros.map((m) => (
            <div key={m.label} style={{ background: "#161921", borderRadius: 16, padding: "14px 12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: m.color }} />
                <span style={{ fontSize: 11, color: "#6b7585", fontWeight: 600 }}>{m.label}</span>
              </div>
              <p style={{ fontSize: 18, fontWeight: 800, color: "#f0f2f5", marginBottom: 2 }}>
                {Math.round(m.value)}<span style={{ fontSize: 11, fontWeight: 500, color: "#6b7585" }}>{m.unit}</span>
              </p>
              <div style={{ background: "#1a1e28", borderRadius: 4, height: 4, overflow: "hidden" }}>
                <div style={{ width: `${Math.min(m.value / m.goal, 1) * 100}%`, height: "100%", background: m.color, borderRadius: 4 }} />
              </div>
              <p style={{ fontSize: 10, color: "#6b7585", marginTop: 4 }}>{m.goal}{m.unit} goal</p>
            </div>
          ))}
        </div>

        {/* Quick stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
          <div style={{ background: "#161921", borderRadius: 16, padding: 16, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(251,146,60,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Flame size={18} color="#fb923c" />
            </div>
            <div>
              <p style={{ fontSize: 18, fontWeight: 800, color: "#f0f2f5" }}>562</p>
              <p style={{ fontSize: 11, color: "#6b7585" }}>kcal burned</p>
            </div>
          </div>
          <div style={{ background: "#161921", borderRadius: 16, padding: 16, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(96,165,250,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Droplets size={18} color="#60a5fa" />
            </div>
            <div>
              <p style={{ fontSize: 18, fontWeight: 800, color: "#f0f2f5" }}>5<span style={{ fontSize: 11, fontWeight: 500, color: "#6b7585" }}>/{goals.water} glasses</span></p>
              <p style={{ fontSize: 11, color: "#6b7585" }}>water intake</p>
            </div>
          </div>
        </div>

        {/* Today's meals */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <p style={{ color: "#6b7585", fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 600 }}>Today's Meals</p>
          <button onClick={() => onNavigate("daily-progress")} style={{ fontSize: 12, color: "#4ade80", background: "none", border: "none", cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>
            See all →
          </button>
        </div>

        {todayMeals.length === 0 ? (
          <div style={{ background: "#161921", borderRadius: 16, padding: 24, textAlign: "center" }}>
            <p style={{ color: "#6b7585", fontSize: 14 }}>No meals logged today</p>
            <button onClick={() => onNavigate("add-food")} style={{ marginTop: 12, color: "#4ade80", background: "rgba(74,222,128,0.1)", border: "none", borderRadius: 10, padding: "10px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
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
                <p style={{ color: "#4ade80", fontWeight: 800, fontSize: 16, fontFamily: "'DM Mono', monospace" }}>
                  {Math.round(cat.cal)} <span style={{ fontSize: 11, color: "#6b7585", fontWeight: 400 }}>kcal</span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AddFoodScreen({ onAdd }: { onAdd: (item: FoodItem) => void }) {
  const [step, setStep] = useState<"category" | "food" | "quantity">("category");
  const [selectedCat, setSelectedCat] = useState<MealCategory | null>(null);
  const [search, setSearch] = useState("");
  const [selectedFood, setSelectedFood] = useState<(typeof FOOD_DATABASE)[0] | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showConfirm, setShowConfirm] = useState(false);

  const filtered = FOOD_DATABASE.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()));

  const handleConfirm = () => {
    if (!selectedFood || !selectedCat) return;
    onAdd({
      id: Date.now().toString(),
      ...selectedFood,
      quantity,
      category: selectedCat,
      time: formatTime(),
    });
    setShowConfirm(false);
    setStep("category");
    setSelectedCat(null);
    setSelectedFood(null);
    setQuantity(1);
    setSearch("");
  };

  return (
    <div style={{ ...FONT_STYLE, paddingBottom: 90 }}>
      <div style={{ padding: "52px 20px 20px", background: "#0f1320" }}>
        <h2 style={{ color: "#f0f2f5", fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Log Food</h2>
        <p style={{ color: "#6b7585", fontSize: 13 }}>
          {step === "category" ? "Choose a meal category" : step === "food" ? `Adding to ${selectedCat?.replace("-", " ")}` : `Set quantity for ${selectedFood?.name}`}
        </p>
        {step !== "category" && (
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            {["category", "food", "quantity"].map((s, i) => (
              <div key={s} style={{
                height: 3, borderRadius: 4, flex: 1,
                background: ["category", "food", "quantity"].indexOf(step) >= i ? "#4ade80" : "#1e2230",
                transition: "background 0.3s",
              }} />
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: "20px" }}>
        {step === "category" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {MEAL_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setSelectedCat(cat.id); setStep("food"); }}
                style={{
                  background: "#161921", borderRadius: 18, padding: "18px 20px",
                  display: "flex", alignItems: "center", gap: 16, border: "none", cursor: "pointer", textAlign: "left", width: "100%",
                }}
              >
                <span style={{ fontSize: 30 }}>{cat.icon}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ color: "#f0f2f5", fontWeight: 700, fontSize: 15, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{cat.label}</p>
                  <p style={{ color: "#6b7585", fontSize: 12, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{cat.time}</p>
                </div>
                <ChevronRight size={18} color="#6b7585" />
              </button>
            ))}
          </div>
        )}

        {step === "food" && (
          <div>
            <button onClick={() => setStep("category")} style={{ display: "flex", alignItems: "center", gap: 6, color: "#6b7585", background: "none", border: "none", cursor: "pointer", marginBottom: 16, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              <ChevronLeft size={16} /> Back
            </button>
            <div style={{ position: "relative", marginBottom: 16 }}>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search foods..."
                style={{
                  width: "100%", background: "#1e2230", borderRadius: 12, border: "1.5px solid rgba(255,255,255,0.08)",
                  color: "#f0f2f5", fontSize: 14, padding: "14px 16px", outline: "none",
                  fontFamily: "'Plus Jakarta Sans', sans-serif", boxSizing: "border-box",
                }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {filtered.map((food) => (
                <button
                  key={food.name}
                  onClick={() => { setSelectedFood(food); setStep("quantity"); }}
                  style={{
                    background: "#161921", borderRadius: 14, padding: "14px 16px",
                    display: "flex", alignItems: "center", gap: 12, border: "none", cursor: "pointer", textAlign: "left", width: "100%",
                  }}
                >
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(74,222,128,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Apple size={18} color="#4ade80" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: "#f0f2f5", fontWeight: 600, fontSize: 14, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{food.name}</p>
                    <p style={{ color: "#6b7585", fontSize: 11, fontFamily: "'DM Mono', monospace" }}>P: {food.protein}g · C: {food.carbs}g · F: {food.fat}g</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ color: "#4ade80", fontWeight: 800, fontSize: 15, fontFamily: "'DM Mono', monospace" }}>{food.calories}</p>
                    <p style={{ color: "#6b7585", fontSize: 10 }}>per {food.unit}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "quantity" && selectedFood && (
          <div>
            <button onClick={() => setStep("food")} style={{ display: "flex", alignItems: "center", gap: 6, color: "#6b7585", background: "none", border: "none", cursor: "pointer", marginBottom: 20, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              <ChevronLeft size={16} /> Back
            </button>

            <div style={{ background: "#161921", borderRadius: 20, padding: 24, marginBottom: 24 }}>
              <p style={{ color: "#4ade80", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>{selectedCat?.replace("-", " ")}</p>
              <h3 style={{ color: "#f0f2f5", fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{selectedFood.name}</h3>
              <p style={{ color: "#6b7585", fontSize: 13 }}>per {selectedFood.unit}</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginTop: 20 }}>
                {[
                  { label: "Calories", value: Math.round(selectedFood.calories * quantity), color: "#4ade80", unit: "kcal" },
                  { label: "Protein", value: Math.round(selectedFood.protein * quantity), color: "#60a5fa", unit: "g" },
                  { label: "Carbs", value: Math.round(selectedFood.carbs * quantity), color: "#fb923c", unit: "g" },
                  { label: "Fat", value: Math.round(selectedFood.fat * quantity), color: "#f472b6", unit: "g" },
                ].map((n) => (
                  <div key={n.label} style={{ textAlign: "center" }}>
                    <p style={{ color: n.color, fontSize: 18, fontWeight: 800, fontFamily: "'DM Mono', monospace" }}>{n.value}<span style={{ fontSize: 10 }}>{n.unit}</span></p>
                    <p style={{ color: "#6b7585", fontSize: 10 }}>{n.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "#161921", borderRadius: 20, padding: 24, marginBottom: 24 }}>
              <p style={{ color: "#f0f2f5", fontWeight: 700, marginBottom: 16 }}>Quantity ({selectedFood.unit})</p>
              <div style={{ display: "flex", alignItems: "center", gap: 20, justifyContent: "center" }}>
                <button
                  onClick={() => setQuantity(Math.max(0.5, quantity - (quantity <= 1 ? 0.5 : 1)))}
                  style={{ width: 48, height: 48, borderRadius: 14, background: "#1e2230", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <span style={{ color: "#f0f2f5", fontSize: 22, fontWeight: 700, lineHeight: 1 }}>−</span>
                </button>
                <div style={{ textAlign: "center", minWidth: 80 }}>
                  <p style={{ color: "#f0f2f5", fontSize: 36, fontWeight: 800, fontFamily: "'DM Mono', monospace" }}>{quantity}</p>
                  <p style={{ color: "#6b7585", fontSize: 12 }}>{selectedFood.unit}{quantity !== 1 ? "s" : ""}</p>
                </div>
                <button
                  onClick={() => setQuantity(quantity + (quantity < 1 ? 0.5 : 1))}
                  style={{ width: 48, height: 48, borderRadius: 14, background: "#4ade80", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <span style={{ color: "#0d1a0f", fontSize: 22, fontWeight: 700, lineHeight: 1 }}>+</span>
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowConfirm(true)}
              style={{
                width: "100%", padding: 16, borderRadius: 14, background: "#4ade80",
                color: "#0d1a0f", fontWeight: 700, fontSize: 16, border: "none", cursor: "pointer",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              Add to {selectedCat?.replace("-", " ")} →
            </button>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirm && selectedFood && selectedCat && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 200,
          display: "flex", alignItems: "flex-end", justifyContent: "center",
          backdropFilter: "blur(4px)",
        }}>
          <div style={{
            width: "100%", maxWidth: 480, background: "#1e2230",
            borderRadius: "24px 24px 0 0", padding: "32px 24px 48px",
          }}>
            <div style={{ width: 40, height: 4, background: "#2e3548", borderRadius: 4, margin: "0 auto 24px" }} />
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{ width: 64, height: 64, borderRadius: 20, background: "rgba(74,222,128,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <Check size={30} color="#4ade80" />
              </div>
              <h3 style={{ color: "#f0f2f5", fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Confirm Food Log</h3>
              <p style={{ color: "#6b7585", fontSize: 14 }}>Adding to your {selectedCat.replace("-", " ")}</p>
            </div>

            <div style={{ background: "#161921", borderRadius: 16, padding: 20, marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div>
                  <p style={{ color: "#f0f2f5", fontWeight: 700, fontSize: 16 }}>{selectedFood.name}</p>
                  <p style={{ color: "#6b7585", fontSize: 13 }}>{quantity} {selectedFood.unit}{quantity !== 1 ? "s" : ""}</p>
                </div>
                <p style={{ color: "#4ade80", fontWeight: 800, fontSize: 22, fontFamily: "'DM Mono', monospace" }}>
                  {Math.round(selectedFood.calories * quantity)} <span style={{ fontSize: 12, color: "#6b7585" }}>kcal</span>
                </p>
              </div>
              <div style={{ display: "flex", gap: 16 }}>
                {[
                  { l: "Protein", v: Math.round(selectedFood.protein * quantity), c: "#60a5fa" },
                  { l: "Carbs", v: Math.round(selectedFood.carbs * quantity), c: "#fb923c" },
                  { l: "Fat", v: Math.round(selectedFood.fat * quantity), c: "#f472b6" },
                ].map((n) => (
                  <div key={n.l} style={{ flex: 1, textAlign: "center", background: "#1e2230", borderRadius: 10, padding: "8px 4px" }}>
                    <p style={{ color: n.c, fontWeight: 700, fontSize: 14, fontFamily: "'DM Mono', monospace" }}>{n.v}g</p>
                    <p style={{ color: "#6b7585", fontSize: 10 }}>{n.l}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => setShowConfirm(false)}
                style={{
                  flex: 1, padding: 16, borderRadius: 14, background: "#1a1e28", border: "none",
                  color: "#6b7585", fontWeight: 700, fontSize: 15, cursor: "pointer",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                style={{
                  flex: 2, padding: 16, borderRadius: 14, background: "#4ade80", border: "none",
                  color: "#0d1a0f", fontWeight: 700, fontSize: 15, cursor: "pointer",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                ✓ Confirm & Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DailyProgressScreen({ meals, goals }: { meals: FoodItem[]; goals: DailyGoals }) {
  const totals = meals.reduce((acc, m) => ({
    calories: acc.calories + m.calories * m.quantity,
    protein: acc.protein + m.protein * m.quantity,
    carbs: acc.carbs + m.carbs * m.quantity,
    fat: acc.fat + m.fat * m.quantity,
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const macroData = [
    { name: "Protein", value: Math.round(totals.protein), color: "#60a5fa" },
    { name: "Carbs", value: Math.round(totals.carbs), color: "#fb923c" },
    { name: "Fat", value: Math.round(totals.fat), color: "#f472b6" },
  ];

  const mealBreakdown = MEAL_CATEGORIES.map((cat) => {
    const items = meals.filter((m) => m.category === cat.id);
    const cal = items.reduce((a, m) => a + m.calories * m.quantity, 0);
    const prot = items.reduce((a, m) => a + m.protein * m.quantity, 0);
    return { ...cat, items, cal, prot };
  });

  return (
    <div style={{ ...FONT_STYLE, paddingBottom: 90 }}>
      <div style={{ padding: "52px 20px 20px", background: "#0f1320" }}>
        <h2 style={{ color: "#f0f2f5", fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Daily Progress</h2>
        <p style={{ color: "#6b7585", fontSize: 13 }}>{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
      </div>

      <div style={{ padding: "16px 20px" }}>
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
                <span style={{ color: "#f0f2f5", fontWeight: 700, fontSize: 13, fontFamily: "'DM Mono', monospace" }}>{m.value}g</span>
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
                  <p style={{ color: cat.cal > 0 ? "#4ade80" : "#6b7585", fontWeight: 800, fontSize: 16, fontFamily: "'DM Mono', monospace" }}>
                    {Math.round(cat.cal)} <span style={{ fontSize: 11, color: "#6b7585", fontWeight: 400 }}>kcal</span>
                  </p>
                  <p style={{ color: "#6b7585", fontSize: 11 }}>{cat.items.length} items</p>
                </div>
              </div>
              {cat.items.length > 0 && (
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "12px 20px", display: "flex", flexDirection: "column", gap: 8 }}>
                  {cat.items.map((item) => (
                    <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", flexShrink: 0 }} />
                      <p style={{ flex: 1, color: "#a8b0c0", fontSize: 13 }}>{item.name} <span style={{ color: "#6b7585" }}>× {item.quantity}</span></p>
                      <p style={{ color: "#6b7585", fontSize: 12, fontFamily: "'DM Mono', monospace" }}>{Math.round(item.calories * item.quantity)} kcal</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProfileScreen() {
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
    <div style={{ ...FONT_STYLE, paddingBottom: 90 }}>
      <div style={{ padding: "52px 20px 20px", background: "#0f1320" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 68, height: 68, borderRadius: 20, background: "linear-gradient(135deg, #4ade80, #22c55e)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>
            RS
          </div>
          <div>
            <h2 style={{ color: "#f0f2f5", fontSize: 22, fontWeight: 800 }}>Rahul Sharma</h2>
            <p style={{ color: "#6b7585", fontSize: 13 }}>+91 98765 43210</p>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80" }} />
              <span style={{ color: "#4ade80", fontSize: 12, fontWeight: 600 }}>Active plan</span>
            </div>
          </div>
          <button style={{ marginLeft: "auto", background: "#1e2230", border: "none", borderRadius: 10, padding: 10, cursor: "pointer" }}>
            <Edit3 size={16} color="#6b7585" />
          </button>
        </div>
      </div>

      <div style={{ padding: "16px 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10, marginBottom: 20 }}>
          {stats.map((s) => (
            <div key={s.label} style={{ background: "#161921", borderRadius: 16, padding: "16px 16px" }}>
              <span style={{ fontSize: 20 }}>{s.icon}</span>
              <p style={{ color: "#f0f2f5", fontWeight: 800, fontSize: 20, marginTop: 8, fontFamily: "'DM Mono', monospace" }}>{s.value}</p>
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
              <Bar dataKey="steps" fill="#4ade80" radius={[4, 4, 0, 0]} opacity={0.85} />
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
                <Check size={14} color="#4ade80" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SettingsScreen({ onLogout }: { onLogout: () => void }) {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [reminders, setReminders] = useState(true);

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
        { icon: Bell, label: "Push Notifications", toggle: true, value: notifications, onChange: () => setNotifications(!notifications) },
        { icon: Moon, label: "Dark Mode", toggle: true, value: darkMode, onChange: () => setDarkMode(!darkMode) },
        { icon: Clock, label: "Meal Reminders", toggle: true, value: reminders, onChange: () => setReminders(!reminders) },
      ],
    },
    {
      title: "Goals",
      items: [
        { icon: Target, label: "Daily Calorie Goal", value2: "2,000 kcal" },
        { icon: Activity, label: "Activity Level", value2: "Moderate" },
        { icon: TrendingUp, label: "Weekly Goal", value2: "Maintain weight" },
      ],
    },
    {
      title: "Account",
      items: [
        { icon: Shield, label: "Privacy & Security" },
        { icon: HelpCircle, label: "Help & Support" },
      ],
    },
  ];

  return (
    <div style={{ ...FONT_STYLE, paddingBottom: 90 }}>
      <div style={{ padding: "52px 20px 20px", background: "#0f1320" }}>
        <h2 style={{ color: "#f0f2f5", fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Settings</h2>
        <p style={{ color: "#6b7585", fontSize: 13 }}>Manage your preferences</p>
      </div>

      <div style={{ padding: "16px 20px" }}>
        {sections.map((section) => (
          <div key={section.title} style={{ marginBottom: 24 }}>
            <p style={{ color: "#6b7585", fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 600, marginBottom: 10 }}>{section.title}</p>
            <div style={{ background: "#161921", borderRadius: 18, overflow: "hidden" }}>
              {section.items.map((item, i) => (
                <div
                  key={item.label}
                  style={{
                    display: "flex", alignItems: "center", gap: 14, padding: "16px 18px",
                    borderTop: i > 0 ? "1px solid rgba(255,255,255,0.05)" : "none",
                  }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "#1e2230", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <item.icon size={16} color="#6b7585" />
                  </div>
                  <span style={{ flex: 1, color: "#f0f2f5", fontSize: 14, fontWeight: 500 }}>{item.label}</span>
                  {"toggle" in item && item.toggle ? (
                    <Toggle value={item.value!} onChange={item.onChange!} />
                  ) : "value2" in item && item.value2 ? (
                    <span style={{ color: "#6b7585", fontSize: 13 }}>{item.value2}</span>
                  ) : (
                    <ChevronRight size={16} color="#6b7585" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <button
          onClick={onLogout}
          style={{
            width: "100%", padding: 16, borderRadius: 14, background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", fontWeight: 700, fontSize: 15,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          <LogOut size={18} color="#ef4444" />
          Sign Out
        </button>

        <p style={{ textAlign: "center", color: "#6b7585", fontSize: 12, marginTop: 24 }}>NutriTrack v1.0.0</p>
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("login");
  const [phone, setPhone] = useState("");
  const [meals, setMeals] = useState<FoodItem[]>(INITIAL_MEALS);
  const [goals] = useState<DailyGoals>(INITIAL_GOALS);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const appScreens: Screen[] = ["dashboard", "daily-progress", "add-food", "profile", "settings"];
  const isApp = appScreens.includes(screen);

  const handleLogin = (p: string) => {
    setPhone(p);
    setScreen("otp");
  };

  const handleVerify = () => {
    setScreen("dashboard");
  };

  const handleAddFood = (item: FoodItem) => {
    setMeals((prev) => [...prev, item]);
    setSuccessToast(`${item.name} added to ${item.category.replace("-", " ")}!`);
    setTimeout(() => setSuccessToast(null), 3000);
    setScreen("daily-progress");
  };

  const handleLogout = () => {
    setScreen("login");
    setPhone("");
    setMeals(INITIAL_MEALS);
  };

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", minHeight: "100vh", background: "#0d0f14", position: "relative", overflowX: "hidden" }}>
      {screen === "login" && <LoginScreen onLogin={handleLogin} />}
      {screen === "otp" && <OTPScreen phone={phone} onVerify={handleVerify} onBack={() => setScreen("login")} />}

      {isApp && (
        <>
          {screen === "dashboard" && <DashboardScreen meals={meals} goals={goals} onNavigate={setScreen} />}
          {screen === "add-food" && <AddFoodScreen onAdd={handleAddFood} />}
          {screen === "daily-progress" && <DailyProgressScreen meals={meals} goals={goals} />}
          {screen === "profile" && <ProfileScreen />}
          {screen === "settings" && <SettingsScreen onLogout={handleLogout} />}
          <BottomNav active={screen} onNavigate={setScreen} />
        </>
      )}

      {successToast && (
        <div style={{
          position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)",
          background: "#4ade80", color: "#0d1a0f", borderRadius: 12, padding: "12px 20px",
          fontWeight: 700, fontSize: 14, zIndex: 500, boxShadow: "0 8px 30px rgba(74,222,128,0.4)",
          whiteSpace: "nowrap", fontFamily: "'Plus Jakarta Sans', sans-serif",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <Check size={16} /> {successToast}
        </div>
      )}
    </div>
  );
}

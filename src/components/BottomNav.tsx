import { HomeIcon, ChartBarIcon, PlusIcon, UserIcon, Cog8ToothIcon } from '@heroicons/react/24/outline';
import { HomeIcon as HomeSolid, ChartBarIcon as ChartSolid, UserIcon as UserSolid, Cog8ToothIcon as CogSolid } from '@heroicons/react/24/solid';
import { useNavigate, useLocation } from 'react-router-dom';

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const active = location.pathname;

  const items = [
    { id: "/", icon: HomeIcon, activeIcon: HomeSolid, label: "Home" },
    { id: "/stats", icon: ChartBarIcon, activeIcon: ChartSolid, label: "Progress" },
    { id: "/add-meal", icon: PlusIcon, activeIcon: PlusIcon, label: "Add" },
    { id: "/profile", icon: UserIcon, activeIcon: UserSolid, label: "Profile" },
    { id: "/settings", icon: Cog8ToothIcon, activeIcon: CogSolid, label: "Settings" },
  ];

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, margin: "0 auto",
      background: "#161921", borderTop: "1px solid rgba(255,255,255,0.06)",
      display: "flex", alignItems: "center", padding: "8px 16px 24px",
      zIndex: 100,
    }}>
      {items.map((item) => {
        const isAdd = item.id === "/add-meal";
        const isActive = active === item.id;
        const Icon = isActive && item.activeIcon ? item.activeIcon : item.icon;
        return (
          <button
            key={item.id}
            onClick={() => navigate(item.id)}
            style={{
              flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
              gap: 4, border: "none", background: "none", cursor: "pointer",
              padding: isAdd ? "0" : "8px 4px",
            }}
            className="group"
          >
            {isAdd ? (
              <div style={{
                width: 52, height: 52, borderRadius: 16, background: "#4ade80",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 20px rgba(74, 222, 128, 0.4)",
                transform: "translateY(-8px)",
              }} className="transition-transform group-active:scale-95 group-hover:scale-105">
                <Icon className="w-6 h-6 text-brand-bg stroke-[2.5px]" />
              </div>
            ) : (
              <>
                <Icon className={`w-5 h-5 transition-colors group-hover:text-brand-green ${isActive ? 'text-brand-green' : 'text-brand-gray'}`} />
                <span style={{ fontSize: 10, color: isActive ? "#4ade80" : "#6b7585", fontWeight: 500 }} className="transition-colors group-hover:text-brand-green font-sans">
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

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
 <div className="fixed bottom-0 left-0 right-0 mx-auto max-w-md bg-white/40 dark:bg-black/30 backdrop-blur-3xl backdrop-filter backdrop-saturate-150 border-t border-white/40 dark:border-white/10 flex items-center px-4 pb-6 pt-2 z-50 transition-colors duration-300 shadow-glass dark:shadow-glass-dark">
 {items.map((item) => {
 const isAdd = item.id === "/add-meal";
 const isActive = active === item.id;
 const Icon = isActive && item.activeIcon ? item.activeIcon : item.icon;
 
 return (
 <button
 key={item.id}
 onClick={() => navigate(item.id)}
 className={`flex-1 flex flex-col items-center gap-1 border-none bg-transparent cursor-pointer group ${isAdd ? 'p-0' : 'px-1 py-2'}`}
 >
 {isAdd ? (
 <div className="w-14 h-14 rounded-2xl bg-brand-accent flex items-center justify-center shadow-lg shadow-brand-accent/40 -translate-y-2 transition-transform group-active:scale-95 group-hover:scale-105">
 <Icon className="w-6 h-6 text-white stroke-[3px]" />
 </div>
 ) : (
 <>
 <Icon className={`w-[22px] h-[22px] transition-colors group-hover:text-brand-accent ${isActive ? 'text-brand-accent' : 'text-brand-textMuted'}`} />
 <span className={`text-[10px] font-medium font-sans transition-colors group-hover:text-brand-accent ${isActive ? 'text-brand-accent' : 'text-brand-textMuted'}`}>
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

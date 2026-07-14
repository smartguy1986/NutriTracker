import { createContext, useContext, useState, ReactNode } from 'react';
import { DailyLog, MealRecord, UserSettings } from '../types';
import { getDailyLog, addMealToLog, getTodayDateString } from '../storage/localStore';

interface NutritionContextType {
  dailyLog: DailyLog;
  settings: UserSettings;
  addMeal: (meal: MealRecord) => void;
  updateSettings: (settings: UserSettings) => void;
}

const defaultSettings: UserSettings = {
  calorieGoal: 2400,
  proteinGoal: 160,
  carbsGoal: 250,
  fatGoal: 65,
};

const NutritionContext = createContext<NutritionContextType | undefined>(undefined);

export function NutritionProvider({ children }: { children: ReactNode }) {
  const today = getTodayDateString();
  const [dailyLog, setDailyLog] = useState<DailyLog>(() => getDailyLog(today));
  
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('user_settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const addMeal = (meal: MealRecord) => {
    const updatedLog = addMealToLog(today, meal);
    setDailyLog({ ...updatedLog }); // Trigger re-render
  };

  const updateSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    localStorage.setItem('user_settings', JSON.stringify(newSettings));
  };

  return (
    <NutritionContext.Provider value={{ dailyLog, settings, addMeal, updateSettings }}>
      {children}
    </NutritionContext.Provider>
  );
}

export function useNutrition() {
  const context = useContext(NutritionContext);
  if (context === undefined) {
    throw new Error('useNutrition must be used within a NutritionProvider');
  }
  return context;
}

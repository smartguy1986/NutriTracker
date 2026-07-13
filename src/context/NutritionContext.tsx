import React, { createContext, useContext, useState, ReactNode } from 'react';
import { DailyLog, MealRecord, UserSettings } from '../types';
import { getDailyLog, addMealToLog, getTodayDateString } from '../storage/localStore';

interface NutritionContextType {
  dailyLog: DailyLog;
  settings: UserSettings;
  addMeal: (meal: MealRecord) => void;
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
  
  // We can also load settings from local storage in the future
  const [settings] = useState<UserSettings>(defaultSettings);

  const addMeal = (meal: MealRecord) => {
    const updatedLog = addMealToLog(today, meal);
    setDailyLog({ ...updatedLog }); // Trigger re-render
  };

  return (
    <NutritionContext.Provider value={{ dailyLog, settings, addMeal }}>
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

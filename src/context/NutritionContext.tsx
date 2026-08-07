import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { DailyLog, MealRecord, UserSettings } from '../types';
import { useAuth } from './AuthContext';
import { fetchMeals, createMeal } from '../services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const d = new Date();
  const todayDateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('user_settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const { data: allMeals = [] } = useQuery({
    queryKey: ['meals'],
    queryFn: fetchMeals,
    enabled: !!user?.id,
  });

  // Filter meals for the logged in user and today, and map them to MealRecord type
  const todaysMeals: MealRecord[] = allMeals
    .filter((m: any) => m.user_id === user?.id && m.logged_date === todayDateStr)
    .map((m: any) => ({
      id: m.id,
      foodId: m.food_id,
      foodName: m.food_name,
      quantity: Number(m.quantity),
      unit: m.unit as any,
      calories: Number(m.calories),
      protein: Number(m.protein),
      carbs: Number(m.carbs),
      fat: Number(m.fat),
      timestamp: m.created_at,
    }));

  const dailyLog: DailyLog = {
    date: todayDateStr,
    meals: todaysMeals,
    totalCalories: todaysMeals.reduce((sum: number, m: any) => sum + Number(m.calories), 0),
    totalProtein: todaysMeals.reduce((sum: number, m: any) => sum + Number(m.protein), 0),
    totalCarbs: todaysMeals.reduce((sum: number, m: any) => sum + Number(m.carbs), 0),
    totalFat: todaysMeals.reduce((sum: number, m: any) => sum + Number(m.fat), 0),
  };

  const addMealMutation = useMutation({
    mutationFn: (meal: Omit<MealRecord, 'id' | 'created_at'>) => createMeal(meal),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
    },
  });

  const addMeal = (meal: MealRecord) => {
    if (!user?.id) {
      console.error("User not fully loaded, cannot add meal");
      return;
    }
    
    // The Netlify API expects food_name, etc. but MealRecord has different keys?
    // Let's ensure the payload matches the DB schema.
    const dbMealPayload = {
      user_id: user.id,
      food_id: meal.foodId,
      food_name: meal.foodName,
      meal_type: 'Snack', // Defaulting to Snack as the frontend doesn't specify it yet
      quantity: meal.quantity.toString(),
      unit: meal.unit,
      calories: meal.calories.toString(),
      protein: meal.protein.toString(),
      carbs: meal.carbs.toString(),
      fat: meal.fat.toString(),
      logged_date: todayDateStr,
    };
    
    addMealMutation.mutate(dbMealPayload as any);
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

import { createContext, useContext, useState, ReactNode } from 'react';
import { DailyLog, MealRecord, UserSettings } from '../types';
import { useAuth } from './AuthContext';
import { fetchMeals, createMeal, updateMeal, deleteMeal, fetchActivity, createActivity, updateActivity, fetchGoals } from '../services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Achievements {
  sevenDayStreak: boolean;
  proteinPro: boolean;
  hydrated: boolean;
}

interface NutritionContextType {
  dailyLog: DailyLog;
  selectedDateLog: DailyLog;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  weeklyData: { day: string, calories: number }[];
  todayWaterMl: number;
  todayCaloriesBurned: number;
  updateWater: (ml: number) => void;
  updateCaloriesBurned: (calories: number) => void;
  achievements: Achievements;
  settings: UserSettings;
  addMeal: (meal: MealRecord) => void;
  updateMeal: (id: string, updates: Partial<MealRecord>) => void;
  deleteMeal: (id: string) => void;
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

  const [selectedDate, setSelectedDate] = useState<string>(todayDateStr);

  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('user_settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const { data: allMeals = [] } = useQuery({
    queryKey: ['meals'],
    queryFn: fetchMeals,
    enabled: !!user?.id,
  });

  const { data: allActivity = [] } = useQuery({
    queryKey: ['activity'],
    queryFn: fetchActivity,
    enabled: !!user?.id,
  });

  const { data: allGoals = [] } = useQuery({
    queryKey: ['goals'],
    queryFn: fetchGoals,
    enabled: !!user?.id,
  });

  const getMealsForDate = (dateStr: string): MealRecord[] => {
    return allMeals
      .filter((m: any) => m.user_id === user?.id && m.logged_date === dateStr)
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
      }))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const todaysMeals = getMealsForDate(todayDateStr);
  const dailyLog: DailyLog = {
    date: todayDateStr,
    meals: todaysMeals,
    totalCalories: todaysMeals.reduce((sum: number, m: any) => sum + m.calories, 0),
    totalProtein: todaysMeals.reduce((sum: number, m: any) => sum + m.protein, 0),
    totalCarbs: todaysMeals.reduce((sum: number, m: any) => sum + m.carbs, 0),
    totalFat: todaysMeals.reduce((sum: number, m: any) => sum + m.fat, 0),
  };

  const selectedMeals = getMealsForDate(selectedDate);
  const selectedDateLog: DailyLog = {
    date: selectedDate,
    meals: selectedMeals,
    totalCalories: selectedMeals.reduce((sum: number, m: any) => sum + m.calories, 0),
    totalProtein: selectedMeals.reduce((sum: number, m: any) => sum + m.protein, 0),
    totalCarbs: selectedMeals.reduce((sum: number, m: any) => sum + m.carbs, 0),
    totalFat: selectedMeals.reduce((sum: number, m: any) => sum + m.fat, 0),
  };

  const getWeeklyData = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      
      const dayMeals = getMealsForDate(dateStr);
      const totalCals = dayMeals.reduce((sum, m) => sum + m.calories, 0);
      data.push({ day: dayName, calories: Math.round(totalCals) });
    }
    return data;
  };
  const weeklyData = getWeeklyData();

  // --- Water / Activity Logic ---
  const todayActivity = allActivity.find((a: any) => a.user_id === user?.id && a.logged_date === todayDateStr);
  const todayWaterMl = todayActivity ? Number(todayActivity.water_ml) : 0;

  const updateActivityMutation = useMutation({
    mutationFn: async (payload: any) => {
      if (payload.id) return updateActivity(payload);
      return createActivity(payload);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['activity'] })
  });

  const updateWater = (ml: number) => {
    if (!user?.id) return;
    if (todayActivity) {
      updateActivityMutation.mutate({
        ...todayActivity,
        water_ml: (Number(todayActivity.water_ml) || 0) + ml
      });
    } else {
      updateActivityMutation.mutate({
        user_id: user.id,
        logged_date: todayDateStr,
        water_ml: ml,
        calories_burned: 0
      });
    }
  };

  const todayCaloriesBurned = todayActivity ? Number(todayActivity.calories_burned) : 0;
  
  const updateCaloriesBurned = (calories: number) => {
    if (!user?.id) return;
    if (todayActivity) {
      updateActivityMutation.mutate({
        ...todayActivity,
        calories_burned: calories
      });
    } else {
      updateActivityMutation.mutate({
        user_id: user.id,
        logged_date: todayDateStr,
        water_ml: 0,
        calories_burned: calories
      });
    }
  };

  // --- Achievements Logic ---
  const calcAchievements = (): Achievements => {
    // 7-day streak
    const uniqueDates = Array.from(new Set(allMeals.filter((m: any) => m.user_id === user?.id).map((m: any) => m.logged_date))).sort((a: any, b: any) => b.localeCompare(a)) as string[];
    let streak = 0;
    let currentDate = new Date(todayDateStr);
    for (const dStr of uniqueDates) {
      const msDiff = currentDate.getTime() - new Date(dStr).getTime();
      const dayDiff = Math.round(msDiff / (1000 * 3600 * 24));
      if (dayDiff === 0 || (streak === 0 && dayDiff === 1)) {
        streak++;
        currentDate = new Date(dStr);
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    const sevenDayStreak = streak >= 7;

    // Protein Pro
    let proteinPro = false;
    const userGoal = allGoals.find((g: any) => g.user_id === user?.id) || { protein_goal: settings.proteinGoal };
    const targetProtein = Number(userGoal.protein_goal);
    for (const d of uniqueDates) {
      const p = getMealsForDate(d).reduce((sum, m) => sum + m.protein, 0);
      if (p >= targetProtein && targetProtein > 0) {
        proteinPro = true;
        break;
      }
    }

    // Hydrated (4 liters = 4000ml)
    const hydrated = allActivity.some((a: any) => a.user_id === user?.id && Number(a.water_ml) >= 4000);

    return { sevenDayStreak, proteinPro, hydrated };
  };
  const achievements = calcAchievements();

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
    
    const mealDate = new Date(meal.timestamp);
    const loggedDateStr = `${mealDate.getFullYear()}-${String(mealDate.getMonth() + 1).padStart(2, '0')}-${String(mealDate.getDate()).padStart(2, '0')}`;

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
      logged_date: loggedDateStr,
      created_at: meal.timestamp,
    };
    
    addMealMutation.mutate(dbMealPayload as any);
  };

  const updateMealMutation = useMutation({
    mutationFn: (meal: any) => updateMeal(meal),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
    },
  });

  const deleteMealMutation = useMutation({
    mutationFn: (id: string) => deleteMeal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
    },
  });

  const updateMealContext = (id: string, updates: Partial<MealRecord>) => {
    if (!user?.id) return;
    const dbPayload: any = { id };
    if (updates.quantity !== undefined) dbPayload.quantity = updates.quantity.toString();
    if (updates.calories !== undefined) dbPayload.calories = updates.calories.toString();
    if (updates.protein !== undefined) dbPayload.protein = updates.protein.toString();
    if (updates.carbs !== undefined) dbPayload.carbs = updates.carbs.toString();
    if (updates.fat !== undefined) dbPayload.fat = updates.fat.toString();
    if (updates.timestamp !== undefined) {
      dbPayload.created_at = updates.timestamp;
      const mealDate = new Date(updates.timestamp);
      dbPayload.logged_date = `${mealDate.getFullYear()}-${String(mealDate.getMonth() + 1).padStart(2, '0')}-${String(mealDate.getDate()).padStart(2, '0')}`;
    }
    updateMealMutation.mutate(dbPayload);
  };

  const deleteMealContext = (id: string) => {
    deleteMealMutation.mutate(id);
  };

  const updateSettings = async (newSettings: UserSettings) => {
    setSettings(newSettings);
    localStorage.setItem('user_settings', JSON.stringify(newSettings));
    
    if (user?.id) {
      try {
        await fetch('/api/profiles', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: user.id, calorie_goal: newSettings.calorieGoal })
        });
        
        // Find existing user goals id to PUT
        const userGoal = allGoals.find((g: any) => g.user_id === user.id);
        if (userGoal) {
          await fetch('/api/goals', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              id: userGoal.id, 
              protein_goal: newSettings.proteinGoal,
              carbs_goal: newSettings.carbsGoal,
              fat_goal: newSettings.fatGoal
            })
          });
        } else {
          await fetch('/api/goals', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              user_id: user.id,
              protein_goal: newSettings.proteinGoal,
              carbs_goal: newSettings.carbsGoal,
              fat_goal: newSettings.fatGoal
            })
          });
        }
      } catch (err) {
        console.error("Failed to sync settings to database", err);
      }
    }
  };

  return (
    <NutritionContext.Provider value={{
        dailyLog,
        selectedDateLog,
        selectedDate,
        setSelectedDate,
        weeklyData,
        todayWaterMl,
        todayCaloriesBurned,
        updateWater,
        updateCaloriesBurned,
        achievements,
        settings,
        addMeal,
        updateMeal: updateMealContext,
        deleteMeal: deleteMealContext,
        updateSettings
      }}>
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

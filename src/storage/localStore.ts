import { DailyLog, MealRecord } from '../types';

const STORAGE_KEY = 'calorietracker_data';

export const getTodayDateString = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const getDailyLog = (dateStr: string): DailyLog => {
  const data = localStorage.getItem(`${STORAGE_KEY}_${dateStr}`);
  if (data) {
    return JSON.parse(data);
  }
  return {
    date: dateStr,
    meals: [],
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0,
  };
};

export const saveDailyLog = (log: DailyLog) => {
  localStorage.setItem(`${STORAGE_KEY}_${log.date}`, JSON.stringify(log));
};

export const addMealToLog = (dateStr: string, meal: MealRecord): DailyLog => {
  const log = getDailyLog(dateStr);
  log.meals.push(meal);
  
  // Recalculate totals
  log.totalCalories = log.meals.reduce((sum, m) => sum + m.calories, 0);
  log.totalProtein = log.meals.reduce((sum, m) => sum + m.protein, 0);
  log.totalCarbs = log.meals.reduce((sum, m) => sum + m.carbs, 0);
  log.totalFat = log.meals.reduce((sum, m) => sum + m.fat, 0);
  
  saveDailyLog(log);
  return log;
};

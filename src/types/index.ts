export type MealType = 'Breakfast' | 'Lunch' | 'Snack' | 'Dinner' | 'Post Workout';
export type UnitType = 'grams' | 'pieces' | 'bowls' | 'cups';

export interface Food {
  id: string;
  name: string;
  calories: number; // per default unit
  protein: number;
  carbs: number;
  fat: number;
  unit: UnitType;
  baseQuantity: number;
}

export interface MealRecord {
  id: string;
  foodId: string;
  foodName: string;
  mealType: MealType;
  quantity: number;
  unit: UnitType;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  timestamp: string; // ISO string
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  meals: MealRecord[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

export interface UserSettings {
  calorieGoal: number;
  proteinGoal: number;
  carbsGoal: number;
  fatGoal: number;
}

import { MealRecord } from '../types';

export const fetchMeals = async (): Promise<MealRecord[]> => {
  const response = await fetch('/api/meals');
  if (!response.ok) {
    throw new Error('Failed to fetch meals');
  }
  return response.json();
};

export const createMeal = async (meal: Omit<MealRecord, 'id' | 'created_at'>): Promise<MealRecord> => {
  const response = await fetch('/api/meals', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(meal),
  });
  if (!response.ok) {
    throw new Error('Failed to create meal');
  }
  return response.json();
};

export const fetchProfiles = async () => {
  const response = await fetch('/api/profiles');
  if (!response.ok) {
    throw new Error('Failed to fetch profiles');
  }
  return response.json();
};

export const createProfile = async (profile: { name: string; calorie_goal: number }) => {
  const response = await fetch('/api/profiles', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profile),
  });
  if (!response.ok) {
    throw new Error('Failed to create profile');
  }
  return response.json();
};

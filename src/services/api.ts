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

export const fetchGoals = async () => {
  const response = await fetch('/api/goals');
  if (!response.ok) {
    throw new Error('Failed to fetch goals');
  }
  return response.json();
};

export const createGoal = async (goal: any) => {
  const response = await fetch('/api/goals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(goal),
  });
  if (!response.ok) throw new Error('Failed to create goal');
  return response.json();
};

export const updateGoal = async (goal: any) => {
  const response = await fetch('/api/goals', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(goal),
  });
  if (!response.ok) throw new Error('Failed to update goal');
  return response.json();
};

export const fetchActivity = async () => {
  const response = await fetch('/api/activity');
  if (!response.ok) {
    throw new Error('Failed to fetch activity');
  }
  return response.json();
};

export const createActivity = async (activity: any) => {
  const response = await fetch('/api/activity', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(activity),
  });
  if (!response.ok) throw new Error('Failed to create activity');
  return response.json();
};

export const updateActivity = async (activity: any) => {
  const response = await fetch('/api/activity', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(activity),
  });
  if (!response.ok) throw new Error('Failed to update activity');
  return response.json();
};

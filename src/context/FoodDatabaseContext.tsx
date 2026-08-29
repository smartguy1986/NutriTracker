import React, { createContext, useContext, useState } from 'react';

export interface FoodItem {
  id: string;
  name: string;
  calories: number; // per 100g
  protein: number;  // per 100g
  carbs: number;    // per 100g
  fat: number;      // per 100g
  piece_weight?: number;
  piece_unit?: string;
}

interface FoodDatabaseContextType {
  db: FoodItem[];
  loading: boolean;
  searchFood: (query: string) => Promise<FoodItem[]>;
}

const FoodDatabaseContext = createContext<FoodDatabaseContextType | undefined>(undefined);

export function FoodDatabaseProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);

  const searchFood = async (query: string): Promise<FoodItem[]> => {
    if (!query || query.trim().length < 2) return [];
    
    setLoading(true);
    try {
      const res = await fetch(`/api/foods?query=${encodeURIComponent(query.trim())}`);
      if (!res.ok) throw new Error("Failed to search foods");
      const data = await res.json();
      return data;
    } catch (err) {
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return (
    <FoodDatabaseContext.Provider value={{ db: [], loading, searchFood: searchFood as any }}>
      {children}
    </FoodDatabaseContext.Provider>
  );
}

export function useFoodDatabase() {
  const context = useContext(FoodDatabaseContext);
  if (context === undefined) {
    throw new Error('useFoodDatabase must be used within a FoodDatabaseProvider');
  }
  return context;
}

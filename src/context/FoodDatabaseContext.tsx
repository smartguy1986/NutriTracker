import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

export interface FoodItem {
  id: string;
  name: string;
  calories: number; // per 100g
  protein: number;  // per 100g
  carbs: number;    // per 100g
  fat: number;      // per 100g
}

interface FoodDatabaseContextType {
  db: FoodItem[];
  loading: boolean;
  searchFood: (query: string) => FoodItem[];
}

const FoodDatabaseContext = createContext<FoodDatabaseContextType | undefined>(undefined);

export function FoodDatabaseProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the JSON database generated from the Excel file
    fetch('/food_db.json')
      .then(res => {
        if (!res.ok) throw new Error('Database not found');
        return res.json();
      })
      .then((data: FoodItem[]) => {
        setDb(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load food database:", err);
        setLoading(false);
      });
  }, []);

  const searchFood = useMemo(() => (query: string) => {
    if (!query || query.trim().length < 2) return [];
    
    const searchTerms = query.toLowerCase().split(' ').filter(Boolean);
    
    // Sort results by relevance (how early the search terms appear in the string)
    return db
      .filter(item => {
        const lowerName = item.name.toLowerCase();
        return searchTerms.every(term => lowerName.includes(term));
      })
      .sort((a, b) => {
        const aLower = a.name.toLowerCase();
        const bLower = b.name.toLowerCase();
        const aIndex = aLower.indexOf(searchTerms[0]);
        const bIndex = bLower.indexOf(searchTerms[0]);
        return aIndex - bIndex;
      })
      .slice(0, 50); // Limit to top 50 matches for performance
  }, [db]);

  return (
    <FoodDatabaseContext.Provider value={{ db, loading, searchFood }}>
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

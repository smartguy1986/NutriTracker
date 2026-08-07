import React, { createContext, useContext, useState } from 'react';

export interface UserProfile {
  id?: string;
  name: string;
  email?: string;
  picture?: string;
  onboarded?: boolean;
  calorie_goal?: number;
  weight?: number;
  height?: number;
  target_weight?: number;
  activity?: string;
  goal?: string;
  rate?: number;
  diet?: string[];
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  login: (userProfile?: UserProfile) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('nutri_auth') === 'true';
  });
  
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('nutri_user');
    const parsedUser = saved ? JSON.parse(saved) : null;
    
    // Ensure that if this device has onboarded in the past, it reflects on page reload
    if (parsedUser && !parsedUser.onboarded && localStorage.getItem('nutri_onboarded') === 'true') {
      parsedUser.onboarded = true;
    }
    
    return parsedUser;
  });

  React.useEffect(() => {
    if (user && !user.id) {
      // Sync missing ID on page load if they were already logged in locally
      const syncProfile = async () => {
        try {
          const res = await fetch('/api/profiles');
          const profiles = await res.json();
          let dbProfile = profiles.find((p: any) => p.name === user.name);
          
          const payload = {
            name: user.name,
            email: user.email,
            avatar_url: user.picture,
            onboarded: user.onboarded ? 1 : 0,
            weight: user.weight,
            height: user.height,
            target_weight: user.target_weight,
            activity: user.activity,
            goal: user.goal,
            rate: user.rate,
            diet: user.diet ? JSON.stringify(user.diet) : null
          };

          const savedSettings = localStorage.getItem('user_settings');
          const calorie_goal = user.calorie_goal || (savedSettings ? JSON.parse(savedSettings).calorieGoal : 2400);

          if (!dbProfile) {
            const createRes = await fetch('/api/profiles', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...payload, calorie_goal })
            });
            dbProfile = await createRes.json();
          } else {
            const updateRes = await fetch('/api/profiles', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...payload, calorie_goal, id: dbProfile.id })
            });
            dbProfile = await updateRes.json();
          }
          const updatedUser = { 
            ...user, 
            id: dbProfile.id,
            weight: dbProfile.weight ? Number(dbProfile.weight) : undefined,
            height: dbProfile.height ? Number(dbProfile.height) : undefined,
            target_weight: dbProfile.target_weight ? Number(dbProfile.target_weight) : undefined,
            activity: dbProfile.activity || undefined,
            goal: dbProfile.goal || undefined,
            rate: dbProfile.rate ? Number(dbProfile.rate) : undefined,
            diet: dbProfile.diet ? JSON.parse(dbProfile.diet) : undefined,
            calorie_goal: dbProfile.calorie_goal
          };
          setUser(updatedUser);
          localStorage.setItem('nutri_user', JSON.stringify(updatedUser));
        } catch (err) {
          console.error("Failed to sync profile ID on load", err);
        }
      };
      syncProfile();
    }
  }, [user?.id, user?.name, user?.email, user?.picture, user?.onboarded]);

  const login = async (userProfile?: UserProfile) => {
    setIsAuthenticated(true);
    localStorage.setItem('nutri_auth', 'true');

    const hasOnboardedLocally = localStorage.getItem('nutri_onboarded') === 'true';
    let finalProfile = userProfile 
      ? { ...userProfile, onboarded: userProfile.onboarded || hasOnboardedLocally }
      : { name: "Demo User", onboarded: hasOnboardedLocally };

    try {
      // Check if profile exists in DB
      const res = await fetch('/api/profiles');
      const profiles = await res.json();
      let dbProfile = profiles.find((p: any) => p.name === finalProfile.name);
      
      const payload = {
        name: finalProfile.name,
        email: finalProfile.email,
        avatar_url: finalProfile.picture,
        onboarded: finalProfile.onboarded ? 1 : 0,
        weight: finalProfile.weight,
        height: finalProfile.height,
        target_weight: finalProfile.target_weight,
        activity: finalProfile.activity,
        goal: finalProfile.goal,
        rate: finalProfile.rate,
        diet: finalProfile.diet ? JSON.stringify(finalProfile.diet) : null
      };
      
      const savedSettings = localStorage.getItem('user_settings');
      const calorie_goal = finalProfile.calorie_goal || (savedSettings ? JSON.parse(savedSettings).calorieGoal : 2400);

      if (!dbProfile) {
        // Create it
        const createRes = await fetch('/api/profiles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, calorie_goal })
        });
        dbProfile = await createRes.json();
      } else {
        // Update it
        const updateRes = await fetch('/api/profiles', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, calorie_goal, id: dbProfile.id })
        });
        dbProfile = await updateRes.json();
      }
      
      finalProfile.id = dbProfile.id;
      finalProfile.weight = dbProfile.weight ? Number(dbProfile.weight) : undefined;
      finalProfile.height = dbProfile.height ? Number(dbProfile.height) : undefined;
      finalProfile.target_weight = dbProfile.target_weight ? Number(dbProfile.target_weight) : undefined;
      finalProfile.activity = dbProfile.activity || undefined;
      finalProfile.goal = dbProfile.goal || undefined;
      finalProfile.rate = dbProfile.rate ? Number(dbProfile.rate) : undefined;
      finalProfile.diet = dbProfile.diet ? JSON.parse(dbProfile.diet) : undefined;
      finalProfile.calorie_goal = dbProfile.calorie_goal;
    } catch (err) {
      console.error("Failed to sync profile with database", err);
    }

    setUser(finalProfile);
    localStorage.setItem('nutri_user', JSON.stringify(finalProfile));
    if (finalProfile.onboarded) {
      localStorage.setItem('nutri_onboarded', 'true');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('nutri_auth');
    localStorage.removeItem('nutri_user');
    // We explicitly do NOT remove 'nutri_onboarded' so that data stored on the device
    // remains valid for the next login as per user request.
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

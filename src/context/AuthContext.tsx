import React, { createContext, useContext, useState } from 'react';

export interface UserProfile {
  id?: string;
  name: string;
  email?: string;
  picture?: string;
  onboarded?: boolean;
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
          if (!dbProfile) {
            const createRes = await fetch('/api/profiles', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: user.name, calorie_goal: 2400 })
            });
            dbProfile = await createRes.json();
          }
          const updatedUser = { ...user, id: dbProfile.id };
          setUser(updatedUser);
          localStorage.setItem('nutri_user', JSON.stringify(updatedUser));
        } catch (err) {
          console.error("Failed to sync profile ID on load", err);
        }
      };
      syncProfile();
    }
  }, [user?.id, user?.name]);

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
      
      if (!dbProfile) {
        // Create it
        const createRes = await fetch('/api/profiles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: finalProfile.name, calorie_goal: 2400 })
        });
        dbProfile = await createRes.json();
      }
      
      finalProfile.id = dbProfile.id;
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

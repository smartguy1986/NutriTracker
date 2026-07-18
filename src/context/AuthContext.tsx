import React, { createContext, useContext, useState } from 'react';

export interface UserProfile {
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

  const login = (userProfile?: UserProfile) => {
    setIsAuthenticated(true);
    localStorage.setItem('nutri_auth', 'true');

    const hasOnboardedLocally = localStorage.getItem('nutri_onboarded') === 'true';

    if (userProfile) {
      const finalProfile = { ...userProfile, onboarded: userProfile.onboarded || hasOnboardedLocally };
      setUser(finalProfile);
      localStorage.setItem('nutri_user', JSON.stringify(finalProfile));
      if (finalProfile.onboarded) {
        localStorage.setItem('nutri_onboarded', 'true');
      }
    } else {
      const defaultUser = { name: "Demo User", onboarded: hasOnboardedLocally };
      setUser(defaultUser);
      localStorage.setItem('nutri_user', JSON.stringify(defaultUser));
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

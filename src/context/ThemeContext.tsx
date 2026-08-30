import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

type Theme = 'light' | 'dark' | 'system';
type AccentColor = 'green' | 'blue' | 'purple' | 'orange' | 'rose';

interface ThemeContextType {
  theme: Theme;
  accentColor: AccentColor;
  setTheme: (theme: Theme) => void;
  setAccentColor: (color: AccentColor) => void;
  isLoading: boolean;
}

const ACCENT_COLORS: Record<AccentColor, { main: string, hover: string }> = {
  green: { main: '34 197 94', hover: '22 163 74' },
  blue: { main: '59 130 246', hover: '37 99 235' },
  purple: { main: '168 85 247', hover: '147 51 234' },
  orange: { main: '249 115 22', hover: '234 88 12' },
  rose: { main: '244 63 94', hover: '225 29 72' },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [theme, setThemeState] = useState<Theme>('dark');
  const [accentColor, setAccentColorState] = useState<AccentColor>('green');
  const [isLoading, setIsLoading] = useState(true);

  // Load from Supabase on user login
  useEffect(() => {
    async function loadPreferences() {
      // Use local storage
      const savedTheme = localStorage.getItem('theme') as Theme;
      const savedAccent = localStorage.getItem('accentColor') as AccentColor;
      if (savedTheme) setThemeState(savedTheme);
      if (savedAccent) setAccentColorState(savedAccent);
      
      if (!user) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch('/api/profiles');
        const profiles = await res.json();
        const dbProfile = profiles.find((p: any) => p.name === user.name);

        if (dbProfile) {
          if (dbProfile.theme) {
            setThemeState(dbProfile.theme as Theme);
            localStorage.setItem('theme', dbProfile.theme);
          }
          if (dbProfile.accent_color) {
            setAccentColorState(dbProfile.accent_color as AccentColor);
            localStorage.setItem('accentColor', dbProfile.accent_color);
          }
        }
      } catch (e) {
        console.error('Failed to load theme preferences from db', e);
      }
      setIsLoading(false);
    }

    loadPreferences();
  }, [user]);

  // Apply Theme class
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  // Apply Accent Color CSS variables
  useEffect(() => {
    const root = window.document.documentElement;
    const colors = ACCENT_COLORS[accentColor] || ACCENT_COLORS.green;
    
    root.style.setProperty('--color-accent', colors.main);
    root.style.setProperty('--color-accent-hover', colors.hover);
  }, [accentColor]);

  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    if (user && user.id) {
      try {
        // Just a basic attempt to update, if the API supports partial updates
        await fetch('/api/profiles', {
           method: 'PUT',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ id: user.id, name: user.name, theme: newTheme })
        });
      } catch (e) {}
    }
  };

  const setAccentColor = async (newColor: AccentColor) => {
    setAccentColorState(newColor);
    localStorage.setItem('accentColor', newColor);
    if (user && user.id) {
      try {
        await fetch('/api/profiles', {
           method: 'PUT',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ id: user.id, name: user.name, accent_color: newColor })
        });
      } catch (e) {}
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, accentColor, setTheme, setAccentColor, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

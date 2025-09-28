import { useAtom } from 'jotai';
import { themeAtom } from '@/store/atoms';
import { useEffect } from 'react';

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceSecondary: string;
  text: string;
  textSecondary: string;
  border: string;
  primary: string;
  success: string;
  warning: string;
  error: string;
  chart: {
    grid: string;
    axis: string;
    primary: string;
    secondary: string;
    accent: string;
  };
}

export const lightTheme: ThemeColors = {
  background: '#f8fafc',
  surface: '#ffffff',
  surfaceSecondary: '#f1f5f9',
  text: '#0f172a',
  textSecondary: '#64748b',
  border: '#e2e8f0',
  primary: '#10b981',
  success: '#059669',
  warning: '#f59e0b',
  error: '#dc2626',
  chart: {
    grid: '#f1f5f9',
    axis: '#64748b',
    primary: '#10b981',
    secondary: '#3b82f6',
    accent: '#8b5cf6',
  },
};

export const darkTheme: ThemeColors = {
  background: '#0f172a',
  surface: '#1e293b',
  surfaceSecondary: '#334155',
  text: '#f8fafc',
  textSecondary: '#cbd5e1',
  border: '#475569',
  primary: '#10b981',
  success: '#059669',
  warning: '#f59e0b',
  error: '#ef4444',
  chart: {
    grid: '#475569',
    axis: '#cbd5e1',
    primary: '#10b981',
    secondary: '#3b82f6',
    accent: '#8b5cf6',
  },
};

export const useTheme = () => {
  const [theme, setTheme] = useAtom(themeAtom);

  const colors = theme === 'dark' ? darkTheme : lightTheme;

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Apply theme to document body
  useEffect(() => {
    document.body.style.backgroundColor = colors.background;
    document.body.style.color = colors.text;
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
  }, [colors.background, colors.text]);

  return {
    theme,
    colors,
    toggleTheme,
    isDark: theme === 'dark',
  };
};
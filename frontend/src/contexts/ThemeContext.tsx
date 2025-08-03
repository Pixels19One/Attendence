import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Theme } from '../types';

const lightTheme: Theme = {
  mode: 'light',
  colors: {
    primary: '#667eea',
    secondary: '#764ba2',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    surface: '#ffffff',
    text: '#2d3748',
    textSecondary: '#718096',
    border: '#e2e8f0',
    success: '#48bb78',
    warning: '#ed8936',
    error: '#f56565',
  },
};

const darkTheme: Theme = {
  mode: 'dark',
  colors: {
    primary: '#667eea',
    secondary: '#764ba2',
    background: 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)',
    surface: '#2d3748',
    text: '#f7fafc',
    textSecondary: '#a0aec0',
    border: '#4a5568',
    success: '#68d391',
    warning: '#fbb359',
    error: '#fc8181',
  },
};

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(lightTheme);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setTheme(darkTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme.mode === 'light' ? darkTheme : lightTheme;
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme.mode);
  };

  const value: ThemeContextType = {
    theme,
    toggleTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
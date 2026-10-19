import { useContext } from 'react';
import { ThemeContext, type ThemeContextType } from './ThemeContext';

/**
 * Custom hook useTheme (Yêu cầu kỹ thuật 4)
 */
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme phải được sử dụng bên trong ThemeProvider');
  }
  return context;
}

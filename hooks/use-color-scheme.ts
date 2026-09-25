import { useTheme } from '@/context/theme-context';

export function useColorScheme(): 'light' | 'dark' {
  const { activeTheme } = useTheme();
  return activeTheme;
}


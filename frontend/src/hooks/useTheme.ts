import { useColorScheme } from 'react-native';
import { Colors, ThemeColors } from '../constants/theme';
import { useAppStore } from '../store/appStore';

export const useTheme = (): { colors: ThemeColors; mode: 'dark' | 'light'; isDark: boolean } => {
  const systemScheme = useColorScheme();
  const themePreference = useAppStore((s) => s.themeMode);

  const mode: 'dark' | 'light' =
    themePreference === 'system'
      ? (systemScheme === 'dark' ? 'dark' : 'light')
      : themePreference === 'dark' ? 'dark' : 'light';

  return {
    colors: Colors[mode],
    mode,
    isDark: mode === 'dark',
  };
};

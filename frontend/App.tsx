import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useAppStore } from './src/store/appStore';
import { Colors } from './src/constants/theme';
import { useColorScheme } from 'react-native';

const FitAIDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: Colors.dark.background,
    card: Colors.dark.surface,
    text: Colors.dark.text,
    primary: Colors.dark.primary,
    border: Colors.dark.border,
  },
};

const FitAILightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Colors.light.background,
    card: Colors.light.surface,
    text: Colors.light.text,
    primary: Colors.light.primary,
    border: Colors.light.border,
  },
};

export default function App() {
  const themeMode = useAppStore((s) => s.themeMode);
  const systemScheme = useColorScheme();

  const isDark =
    themeMode === 'system'
      ? systemScheme === 'dark'
      : themeMode === 'dark';

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer theme={isDark ? FitAIDarkTheme : FitAILightTheme}>
          <StatusBar style={isDark ? 'light' : 'dark'} />
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

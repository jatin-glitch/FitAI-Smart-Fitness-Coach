import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, withSpring, useSharedValue } from 'react-native-reanimated';
import { useTheme } from '../hooks/useTheme';
import { useAppStore } from '../store/appStore';

// Screens
import { OnboardingScreen } from '../screens/Onboarding/OnboardingScreen';
import { LoginScreen, RegisterScreen } from '../screens/Auth/AuthScreens';
import { DashboardScreen } from '../screens/Dashboard/DashboardScreen';
import { WorkoutListScreen, WorkoutDetailScreen } from '../screens/Workouts/WorkoutScreens';
import { PostureScreen } from '../screens/Posture/PostureScreen';
import { CalorieTrackerScreen } from '../screens/Calories/CalorieScreen';
import { ProgressScreen } from '../screens/Progress/ProgressScreen';
import { VoiceCoachScreen } from '../screens/VoiceCoach/VoiceCoachScreen';
import { ProfileScreen } from '../screens/Profile/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabIcon = ({ name, focused, color }: { name: string; focused: boolean; color: string }) => {
  return (
    <View style={styles.tabIconContainer}>
      {focused && (
        <View style={[styles.tabDot, { backgroundColor: color }]} />
      )}
      <Ionicons name={name as any} size={focused ? 26 : 22} color={color} />
    </View>
  );
};

const MainTabs = () => {
  const { colors, isDark } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: -2,
        },
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: isDark ? colors.tabBar + 'F0' : colors.tabBar + 'F5',
          borderTopColor: colors.border,
          borderTopWidth: 0.5,
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
          elevation: 0,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name={focused ? 'home' : 'home-outline'} focused={focused} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Workouts"
        component={WorkoutListScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name={focused ? 'barbell' : 'barbell-outline'} focused={focused} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Calories"
        component={CalorieTrackerScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name={focused ? 'nutrition' : 'nutrition-outline'} focused={focused} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name={focused ? 'stats-chart' : 'stats-chart-outline'} focused={focused} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name={focused ? 'person' : 'person-outline'} focused={focused} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  const { colors } = useTheme();
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const hasCompletedOnboarding = useAppStore((s) => s.hasCompletedOnboarding);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      {!isAuthenticated ? (
        <>
          {!hasCompletedOnboarding && (
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          )}
          <Stack.Screen name="Auth" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen
            name="WorkoutDetail"
            component={WorkoutDetailScreen}
            options={{ animation: 'slide_from_bottom' }}
          />
          <Stack.Screen
            name="Posture"
            component={PostureScreen}
            options={{ animation: 'slide_from_bottom' }}
          />
          <Stack.Screen
            name="VoiceCoach"
            component={VoiceCoachScreen}
            options={{ animation: 'slide_from_bottom' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    position: 'absolute',
    top: -6,
  },
});

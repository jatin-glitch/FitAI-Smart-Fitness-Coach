import { create } from 'zustand';

type ThemeMode = 'dark' | 'light' | 'system';

interface UserProfile {
  height: number | null;
  weight: number | null;
  age: number | null;
  gender: string | null;
  activityLevel: string;
  fitnessGoal: string;
  dailyCalorieGoal: number;
  dailyStepGoal: number;
  weeklyWorkoutGoal: number;
}

interface User {
  _id: string;
  email: string;
  name: string;
  avatar: string | null;
  profile: UserProfile;
  preferences: {
    theme: ThemeMode;
    voiceCoachEnabled: boolean;
    notificationsEnabled: boolean;
    hapticFeedback: boolean;
  };
  streak: {
    current: number;
    longest: number;
    lastActiveDate: string | null;
  };
  onboardingCompleted: boolean;
}

interface DailyStats {
  calories: { consumed: number; burned: number; goal: number };
  steps: { count: number; goal: number };
  water: { glasses: number; goal: number };
  workoutsCompleted: number;
  activeMinutes: number;
}

interface AppState {
  // Auth
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Theme
  themeMode: ThemeMode;

  // Daily stats
  dailyStats: DailyStats;

  // Onboarding
  hasCompletedOnboarding: boolean;

  // Active workout
  activeWorkoutId: string | null;
  workoutStartTime: number | null;
  workoutTimer: number;
  isWorkoutActive: boolean;

  // Actions
  setAuth: (token: string, user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setTheme: (mode: ThemeMode) => void;
  setDailyStats: (stats: Partial<DailyStats>) => void;
  setOnboarding: (completed: boolean) => void;
  startWorkout: (workoutId: string) => void;
  endWorkout: () => void;
  setWorkoutTimer: (seconds: number) => void;
  setLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: false,

  themeMode: 'dark',

  dailyStats: {
    calories: { consumed: 0, burned: 0, goal: 2000 },
    steps: { count: 0, goal: 10000 },
    water: { glasses: 0, goal: 8 },
    workoutsCompleted: 0,
    activeMinutes: 0,
  },

  hasCompletedOnboarding: false,

  activeWorkoutId: null,
  workoutStartTime: null,
  workoutTimer: 0,
  isWorkoutActive: false,

  setAuth: (token, user) =>
    set({ token, user, isAuthenticated: true, themeMode: user.preferences?.theme || 'dark' }),

  logout: () =>
    set({ token: null, user: null, isAuthenticated: false }),

  setUser: (user) => set({ user }),

  setTheme: (mode) => set({ themeMode: mode }),

  setDailyStats: (stats) =>
    set((state) => ({ dailyStats: { ...state.dailyStats, ...stats } })),

  setOnboarding: (completed) => set({ hasCompletedOnboarding: completed }),

  startWorkout: (workoutId) =>
    set({
      activeWorkoutId: workoutId,
      workoutStartTime: Date.now(),
      workoutTimer: 0,
      isWorkoutActive: true,
    }),

  endWorkout: () =>
    set({
      activeWorkoutId: null,
      workoutStartTime: null,
      workoutTimer: 0,
      isWorkoutActive: false,
    }),

  setWorkoutTimer: (seconds) => set({ workoutTimer: seconds }),

  setLoading: (loading) => set({ isLoading: loading }),
}));

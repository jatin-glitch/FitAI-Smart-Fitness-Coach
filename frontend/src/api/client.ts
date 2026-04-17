import axios from 'axios';
import { useAppStore } from '../store/appStore';

// Change this to your backend URL
const BASE_URL = 'http://192.168.100.7:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Inject token into requests
api.interceptors.request.use((config) => {
  const token = useAppStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAppStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  register: (data: { email: string; password: string; name: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
  updatePreferences: (data: any) => api.put('/auth/preferences', data),
  completeOnboarding: () => api.post('/auth/onboarding/complete'),
};

// Workouts
export const workoutAPI = {
  getExercises: (params?: any) => api.get('/workouts/exercises', { params }),
  getExercise: (id: string) => api.get(`/workouts/exercises/${id}`),
  getPlans: (params?: any) => api.get('/workouts/plans', { params }),
  getPlan: (id: string) => api.get(`/workouts/plans/${id}`),
  createPlan: (data: any) => api.post('/workouts/plans', data),
  updatePlan: (id: string, data: any) => api.put(`/workouts/plans/${id}`, data),
  deletePlan: (id: string) => api.delete(`/workouts/plans/${id}`),
  startWorkout: (workoutPlanId?: string) => api.post('/workouts/start', { workoutPlanId }),
  completeWorkout: (logId: string, data: any) => api.put(`/workouts/complete/${logId}`, data),
  getHistory: (params?: any) => api.get('/workouts/history', { params }),
  getSuggestions: () => api.get('/workouts/suggestions'),
};

// Calories
export const calorieAPI = {
  searchFoods: (params?: any) => api.get('/calories/foods', { params }),
  getCategories: () => api.get('/calories/foods/categories'),
  logMeal: (data: any) => api.post('/calories/meals', data),
  getMeals: (date: string) => api.get(`/calories/meals/${date}`),
  deleteMeal: (id: string) => api.delete(`/calories/meals/${id}`),
  getSuggestions: (mealType: string) => api.get(`/calories/suggestions/${mealType}`),
};

// Progress
export const progressAPI = {
  getDailyLog: (date?: string) => api.get(`/progress/daily/${date || ''}`),
  updateDailyLog: (date: string, data: any) => api.put(`/progress/daily/${date}`, data),
  getWeeklyStats: () => api.get('/progress/weekly'),
  getMonthlyStats: (month?: number, year?: number) =>
    api.get('/progress/monthly', { params: { month, year } }),
  getStreak: () => api.get('/progress/streak'),
  getInsights: () => api.get('/progress/insights'),
};

// Posture
export const postureAPI = {
  analyze: (data: { keypoints: any[]; exerciseType?: string }) =>
    api.post('/posture/analyze', data),
};

// Notifications
export const notificationAPI = {
  getAll: (params?: any) => api.get('/notifications', { params }),
  markRead: (id: string) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
  delete: (id: string) => api.delete(`/notifications/${id}`),
};

export default api;

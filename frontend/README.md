# 📱 FitAI – Smart Fitness Coach (Frontend)

Premium React Native (Expo) mobile application for AI-powered fitness coaching.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native (Expo SDK 54) + TypeScript |
| Navigation | React Navigation 7 (Stack + Bottom Tabs) |
| State | Zustand |
| Animations | React Native Reanimated 4 + Lottie |
| Gestures | React Native Gesture Handler |
| UI | Expo Linear Gradient, Expo Blur, React Native SVG |
| Storage | AsyncStorage |
| Speech | Expo Speech |
| Haptics | Expo Haptics |

## Getting Started

### Prerequisites
- **Node.js** 18+
- **Expo CLI**: `npm install -g expo-cli`
- **Expo Go** app on your device (Android/iOS) OR an emulator

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure API URL  
Edit `src/api/client.ts` and change `BASE_URL` to your backend URL:
```typescript
const BASE_URL = 'http://YOUR_BACKEND_IP:5000/api';
// For Android emulator: http://10.0.2.2:5000/api
// For iOS simulator:    http://localhost:5000/api
// For physical device:  http://YOUR_COMPUTER_IP:5000/api
```

### 3. Start the App
```bash
npx expo start
```
Then:
- Press `a` for Android emulator
- Press `i` for iOS simulator
- Scan QR code with **Expo Go** app for physical device

---

## Screens & Features

### 🎯 Onboarding
- Animated swipeable slides with feature highlights
- Pagination dots with spring animation
- Skip / Get Started flow

### 🔐 Authentication
- Login & Register forms with validation
- JWT token stored in Zustand state
- Auto-redirect based on auth state

### 🏠 Dashboard
- Personalized greeting + motivational quote of the day
- Animated progress rings (Calories, Steps, Water)
- Quick stats: Workouts, Active Minutes, Calories Burned
- **AI Features**: Posture Check + Voice Coach entry cards
- Weekly calorie bar chart
- AI Insights cards (rule-based insights from backend)
- Pull-to-refresh

### 💪 Workouts
- Category filter chips (All, Strength, Cardio, HIIT, etc.)
- Workout cards with gradient headers + difficulty badge
- AI smart suggestions (neglected muscle groups)
- **Workout Detail**: exercises list, live timer, exercise-by-exercise progression
- Haptic feedback on interactions

### 🍎 Calorie Tracker
- Daily calorie ring with animated progress
- Macro breakdown (Protein / Carbs / Fat)
- Meal type selector (Breakfast, Lunch, Dinner, Snack)
- AI meal suggestions per meal type
- Manual food entry + one-tap add from suggestions

### 🤸 AI Posture Detection
- Simulated posture analysis with progressive feedback
- Exercise type selector (Standing, Squat, Plank, Push-up)
- Animated posture score ring
- Color-coded feedback (success/warning/correction)
- Skeleton keypoint overlay visualization

### 📊 Progress
- Weekly / Monthly toggle
- Streak tracking (current + best)
- Summary stats grid (Workouts, Steps, Minutes, Avg Calories)
- Animated bar charts for calories and steps

### 🎙️ Voice Coach
- Real-time audio coaching via Expo Speech
- Motivational prompts on interval during workouts
- Volume control (25% / 50% / 75% / 100%)
- Animated pulse effect when active

### 👤 Profile & Settings
- User avatar + fitness goal display
- Body stats editor (Height, Weight, Age)
- Theme switcher: Dark / Light / System
- Toggle: Notifications, Voice Coach, Haptic Feedback
- Sign Out

---

## Project Structure
```
frontend/
├── src/
│   ├── api/            # Axios API client + typed endpoints
│   ├── components/
│   │   ├── charts/     # AnimatedBarChart
│   │   └── common/     # GlassCard, GradientButton, ProgressRing, Skeleton
│   ├── constants/      # theme.ts (colors, spacing, typography)
│   ├── hooks/          # useTheme
│   ├── navigation/     # AppNavigator (Stack + Bottom Tabs)
│   ├── screens/        # All 9 feature screens
│   ├── store/          # Zustand app store
│   └── types/          # Shared TypeScript types
├── App.tsx             # Root component with providers
├── app.json            # Expo config
└── tsconfig.json
```

## Building for Production

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build for Android (APK)
eas build --platform android --profile preview

# Build for iOS
eas build --platform ios
```

## Theme System

The app supports **Dark**, **Light**, and **System** themes:
- Defined in `src/constants/theme.ts`
- Applied via `src/hooks/useTheme.ts`
- Persisted in Zustand store and synced to user preferences on the backend

# 🏋️ FitAI – Smart Fitness Coach

A production-ready, full-stack fitness app with AI-powered features.

## Project Structure

```
FitAi/
├── backend/     # Node.js + Express + MongoDB REST API
└── frontend/    # React Native (Expo) mobile app
```

## Quick Start

### Backend
```bash
cd backend
npm install
cp .env.example .env   # Configure MongoDB URI and JWT secret
npm run seed           # Seed database with exercises, plans, food items
npm run dev            # Start dev server on port 5000
```

### Frontend
```bash
cd frontend
npm install
# Edit src/api/client.ts → set BASE_URL to your backend URL
npx expo start         # Start Expo dev server
```

---

## Features at a Glance

| Feature | Status |
|---------|--------|
| Animated Onboarding | ✅ |
| JWT Authentication | ✅ |
| Dashboard with AI Insights | ✅ |
| Animated Progress Rings & Charts | ✅ |
| 6 Workout Plans + Exercise DB | ✅ |
| Live Workout Timer | ✅ |
| AI Posture Analysis | ✅ |
| Calorie Tracker + AI Suggestions | ✅ |
| Voice Coach (Expo Speech) | ✅ |
| Weekly/Monthly Progress Stats | ✅ |
| Streak Tracking | ✅ |
| Dark / Light / System Theme | ✅ |
| Haptic Feedback | ✅ |
| Glassmorphism UI | ✅ |

## Tech Stack

**Frontend:** React Native · Expo SDK 54 · TypeScript · Zustand · Reanimated 4 · React Navigation 7

**Backend:** Node.js · Express · MongoDB · Mongoose · JWT · bcryptjs · Zod · Helmet

## Documentation

- 📱 [Frontend README](./frontend/README.md)
- ⚙️ [Backend README](./backend/README.md)

# 🏋️ FitAI – Smart Fitness Coach (Backend)

Production-ready Node.js/Express REST API for the FitAI fitness application.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 18+ |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Validation | Zod |
| Security | Helmet, express-rate-limit |
| Testing | Jest + Supertest |

## Getting Started

### Prerequisites
- **Node.js** 18+
- **MongoDB** running locally OR a MongoDB Atlas URI

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

### 3. Seed the Database  
Populate exercises, workout plans, and food items:
```bash
npm run seed
```

### 4. Start Development Server
```bash
npm run dev      # nodemon with auto-reload
# or
npm start        # production mode
```

Server runs at: `http://localhost:5000`

---

## API Endpoints

### Auth  `POST /api/auth/`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | ❌ | Register new user |
| POST | `/login` | ❌ | Login + get JWT token |
| GET | `/profile` | ✅ | Get user profile |
| PUT | `/profile` | ✅ | Update height/weight/age/goal |
| PUT | `/preferences` | ✅ | Update theme/notifications |

### Workouts  `GET /api/workouts/`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/exercises` | List all exercises (paginated, filterable) |
| GET | `/plans` | List workout plans (filter by category/difficulty) |
| GET | `/plans/:id` | Get single workout plan with exercises |
| POST | `/plans` | Create custom workout plan |
| POST | `/start` | Start a workout session (creates log) |
| PUT | `/complete/:logId` | Mark workout as completed |
| GET | `/history` | Get user's workout history |
| GET | `/suggestions` | AI-powered smart suggestions |

### Calories  `GET /api/calories/`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/foods` | Search food database |
| GET | `/foods/categories` | Get food categories |
| POST | `/meals` | Log a meal |
| GET | `/meals/:date` | Get meals for a date (YYYY-MM-DD) |
| DELETE | `/meals/:id` | Delete a meal log |
| GET | `/suggestions/:mealType` | Get AI meal suggestions |

### Progress  `GET /api/progress/`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/daily/:date?` | Get daily log |
| PUT | `/daily/:date` | Update daily activity |
| GET | `/weekly` | 7-day summary + chart data |
| GET | `/monthly` | Monthly overview |
| GET | `/streak` | Current/longest streak |
| GET | `/insights` | AI-generated insights |

### Posture  `POST /api/posture/`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/analyze` | Analyze keypoints, return posture score + feedback |

---

## Running Tests
```bash
npm test
# or with coverage:
npm test -- --coverage
```
> **Note:** Tests require MongoDB to be running. Set `MONGODB_URI` in `.env` to a test database.

---

## Project Structure
```
backend/
├── src/
│   ├── config/         # DB connection, env config
│   ├── controllers/    # Route handlers (thin layer)
│   ├── middleware/     # Auth, error handler, validation
│   ├── models/         # Mongoose schemas
│   ├── routes/         # Express routers
│   ├── seeds/          # Database seeder
│   ├── services/       # Business logic
│   ├── utils/          # JWT helpers, BMR/TDEE calc
│   └── server.js       # App entry point
└── tests/              # Integration tests (Jest + Supertest)
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `5000` | Server port |
| `MONGODB_URI` | `mongodb://localhost:27017/fitai` | MongoDB connection |
| `JWT_SECRET` | (required in prod) | JWT signing secret |
| `JWT_EXPIRES_IN` | `7d` | Token expiry |
| `NODE_ENV` | `development` | Environment |

## Deployment (Render / Railway)

1. Set all env vars in your platform's dashboard
2. Set Build Command: `npm install`
3. Set Start Command: `npm start`
4. Use **MongoDB Atlas** for the database URI

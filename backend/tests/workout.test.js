const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/server');

let authToken = '';
let userId = '';
let workoutLogId = '';

const TEST_USER = {
    name: 'Workout Tester',
    email: `workout_test_${Date.now()}@fitai.com`,
    password: 'Test@1234',
};

beforeAll(async () => {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/fitai_test';
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(uri);
    }

    // Register and login to get token
    const res = await request(app)
        .post('/api/auth/register')
        .send(TEST_USER);

    authToken = res.body.token;
    userId = res.body.user._id;
});

afterAll(async () => {
    await mongoose.connection.collection('users').deleteMany({ email: TEST_USER.email });
    await mongoose.connection.collection('workoutlogs').deleteMany({ user: new mongoose.Types.ObjectId(userId) });
    await mongoose.disconnect();
});

describe('GET /api/workouts/plans', () => {
    it('should return workout plans array', async () => {
        const res = await request(app)
            .get('/api/workouts/plans')
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200);

        expect(res.body).toHaveProperty('plans');
        expect(Array.isArray(res.body.plans)).toBe(true);
    });

    it('should filter plans by category', async () => {
        const res = await request(app)
            .get('/api/workouts/plans?category=strength')
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200);

        expect(res.body).toHaveProperty('plans');
    });

    it('should require authentication', async () => {
        await request(app).get('/api/workouts/plans').expect(401);
    });
});

describe('GET /api/workouts/exercises', () => {
    it('should return exercises list', async () => {
        const res = await request(app)
            .get('/api/workouts/exercises')
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200);

        expect(res.body).toHaveProperty('exercises');
        expect(Array.isArray(res.body.exercises)).toBe(true);
    });
});

describe('POST /api/workouts/start', () => {
    it('should start a workout and return log', async () => {
        const res = await request(app)
            .post('/api/workouts/start')
            .set('Authorization', `Bearer ${authToken}`)
            .send({})
            .expect(201);

        expect(res.body).toHaveProperty('log');
        expect(res.body.log).toHaveProperty('_id');
        workoutLogId = res.body.log._id;
    });
});

describe('PUT /api/workouts/complete/:logId', () => {
    it('should complete a workout log', async () => {
        if (!workoutLogId) return;

        const res = await request(app)
            .put(`/api/workouts/complete/${workoutLogId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({ caloriesBurned: 300, rating: 5 })
            .expect(200);

        expect(res.body).toHaveProperty('log');
        expect(res.body.log.completed).toBe(true);
    });
});

describe('GET /api/workouts/suggestions', () => {
    it('should return AI workout suggestions', async () => {
        const res = await request(app)
            .get('/api/workouts/suggestions')
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200);

        expect(res.body).toHaveProperty('neglectedMuscles');
        expect(res.body).toHaveProperty('suggestedPlans');
    });
});

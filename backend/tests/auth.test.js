const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/server');

const TEST_USER = {
    name: 'Test User',
    email: `test_${Date.now()}@fitai.com`,
    password: 'Test@1234',
};

let authToken = '';

beforeAll(async () => {
    // Use test DB
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/fitai_test';
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(uri);
    }
});

afterAll(async () => {
    // Clean up test user
    await mongoose.connection.collection('users').deleteMany({ email: TEST_USER.email });
    await mongoose.disconnect();
});

describe('POST /api/auth/register', () => {
    it('should register a new user and return token', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send(TEST_USER)
            .expect(201);

        expect(res.body).toHaveProperty('token');
        expect(res.body).toHaveProperty('user');
        expect(res.body.user.email).toBe(TEST_USER.email);
        expect(res.body.user).not.toHaveProperty('password');
        authToken = res.body.token;
    });

    it('should reject duplicate email registration', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send(TEST_USER)
            .expect(409);

        expect(res.body).toHaveProperty('error');
    });

    it('should reject registration with missing fields', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ email: 'incomplete@example.com' })
            .expect(400);

        expect(res.body).toHaveProperty('error');
    });
});

describe('POST /api/auth/login', () => {
    it('should login with correct credentials', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: TEST_USER.email, password: TEST_USER.password })
            .expect(200);

        expect(res.body).toHaveProperty('token');
        expect(res.body.user.email).toBe(TEST_USER.email);
    });

    it('should reject wrong password', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: TEST_USER.email, password: 'wrongpassword' })
            .expect(401);

        expect(res.body).toHaveProperty('error');
    });

    it('should reject non-existent email', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'ghost@example.com', password: 'password123' })
            .expect(401);

        expect(res.body).toHaveProperty('error');
    });
});

describe('GET /api/auth/profile', () => {
    it('should return user profile with valid token', async () => {
        const res = await request(app)
            .get('/api/auth/profile')
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200);

        expect(res.body).toHaveProperty('user');
        expect(res.body.user.email).toBe(TEST_USER.email);
    });

    it('should reject request without token', async () => {
        await request(app).get('/api/auth/profile').expect(401);
    });

    it('should reject request with invalid token', async () => {
        await request(app)
            .get('/api/auth/profile')
            .set('Authorization', 'Bearer invalidtoken')
            .expect(401);
    });
});

describe('GET /api/health', () => {
    it('should return health check OK', async () => {
        const res = await request(app).get('/api/health').expect(200);
        expect(res.body.status).toBe('OK');
    });
});

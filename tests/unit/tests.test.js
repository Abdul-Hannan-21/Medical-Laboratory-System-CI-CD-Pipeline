const request = require('supertest');
const app = require('../../server');

describe('Tests API (test results)', () => {
  beforeEach(() => {
    process.env.NODE_ENV = 'test';
    const testsRoute = require('../../src/routes/tests');
    if (testsRoute.reset) {
      testsRoute.reset();
    }
  });

  test('GET /api/tests should return empty list initially', async () => {
    const res = await request(app).get('/api/tests').expect(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBe(0);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('POST /api/tests should create a new test result', async () => {
    const payload = {
      bookingId: 1,
      testType: 'blood_test',
      result: 'All parameters normal',
      status: 'normal',
      labTechnician: 'Alice Smith'
    };

    const res = await request(app).post('/api/tests').send(payload).expect(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.bookingId).toBe(payload.bookingId);
  });

  test('POST /api/tests should validate input and reject invalid payloads', async () => {
    const bad = {
      bookingId: -1,
      testType: '',
      result: '',
      status: 'unknown',
      labTechnician: 'Al'
    };

    const res = await request(app).post('/api/tests').send(bad).expect(400);
    expect(res.body.success).toBe(false);
    expect(res.body).toHaveProperty('error');
  });

  test('GET /api/tests/:id returns 404 for missing id', async () => {
    const res = await request(app).get('/api/tests/999').expect(404);
    expect(res.body.success).toBe(false);
  });

  test('PUT /api/tests/:id updates an existing test result', async () => {
    // create
    const payload = {
      bookingId: 2,
      testType: 'xray',
      result: 'No issues found',
      status: 'normal',
      labTechnician: 'Bob Jones'
    };
    const create = await request(app).post('/api/tests').send(payload).expect(201);
    const id = create.body.data.id;

    const update = {
      bookingId: 2,
      testType: 'xray',
      result: 'Minor irregularity',
      status: 'abnormal',
      labTechnician: 'Bob Jones'
    };

    const res = await request(app).put(`/api/tests/${id}`).send(update).expect(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('abnormal');
  });

  test('GET /api/tests supports filtering by bookingId and status', async () => {
    const a = { bookingId: 10, testType: 'blood', result: 'r', status: 'normal', labTechnician: 'Tech A' };
    const b = { bookingId: 11, testType: 'blood', result: 'r', status: 'abnormal', labTechnician: 'Tech B' };
    await request(app).post('/api/tests').send(a).expect(201);
    await request(app).post('/api/tests').send(b).expect(201);

    const res1 = await request(app).get('/api/tests').query({ bookingId: 10 }).expect(200);
    expect(res1.body.count).toBe(1);

    const res2 = await request(app).get('/api/tests').query({ status: 'abnormal' }).expect(200);
    expect(res2.body.count).toBe(1);
  });
});

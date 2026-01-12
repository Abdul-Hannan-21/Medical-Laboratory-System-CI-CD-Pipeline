const request = require('supertest');
const app = require('../../server');

describe('Health Check API', () => {
  test('GET /health should return 200 and health status', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);

    expect(response.body).toHaveProperty('status');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('uptime');
    expect(response.body).toHaveProperty('services');
    expect(['healthy', 'degraded']).toContain(response.body.status);
  });

  test('GET /health should include service status', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);

    expect(response.body.services).toHaveProperty('database');
    expect(response.body.services).toHaveProperty('redis');
  });
});


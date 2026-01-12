const request = require('supertest');
const app = require('../../server');

describe('Integration Tests - Complete Booking Flow', () => {
  beforeEach(() => {
    // Reset state before each test
    process.env.NODE_ENV = 'test';
    const bookingsRoute = require('../../src/routes/bookings');
    const testsRoute = require('../../src/routes/tests');
    if (bookingsRoute.reset) {
      bookingsRoute.reset();
    }
    if (testsRoute.reset) {
      testsRoute.reset();
    }
  });

  test('Complete workflow: Create booking -> Add test result -> Retrieve', async () => {
    // Step 1: Create a booking
    const booking = {
      patientName: 'Integration Test Patient',
      patientEmail: 'integration@test.com',
      patientPhone: '+1234567890',
      testType: 'blood_test',
      appointmentDate: new Date(Date.now() + 86400000).toISOString(),
      notes: 'Integration test booking'
    };

    const bookingResponse = await request(app)
      .post('/api/bookings')
      .send(booking)
      .expect(201);

    expect(bookingResponse.body.success).toBe(true);
    const bookingId = bookingResponse.body.data.id;

    // Step 2: Confirm the booking
    await request(app)
      .patch(`/api/bookings/${bookingId}/status`)
      .send({ status: 'confirmed' })
      .expect(200);

    // Step 3: Add test result
    const testResult = {
      bookingId: bookingId,
      testType: 'blood_test',
      result: 'All values within normal range',
      status: 'normal',
      notes: 'Patient completed test successfully',
      labTechnician: 'Dr. Smith'
    };

    const resultResponse = await request(app)
      .post('/api/tests')
      .send(testResult)
      .expect(201);

    expect(resultResponse.body.success).toBe(true);
    const resultId = resultResponse.body.data.id;

    // Step 4: Retrieve booking with result
    const bookingGetResponse = await request(app)
      .get(`/api/bookings/${bookingId}`)
      .expect(200);

    expect(bookingGetResponse.body.data.status).toBe('confirmed');

    // Step 5: Retrieve test result
    const resultGetResponse = await request(app)
      .get(`/api/tests/${resultId}`)
      .expect(200);

    expect(resultGetResponse.body.data.bookingId).toBe(bookingId);
    expect(resultGetResponse.body.data.status).toBe('normal');
  });

  test('API should handle multiple bookings', async () => {
    const bookings = [
      {
        patientName: 'Patient 1',
        patientEmail: 'patient1@test.com',
        patientPhone: '+1111111111',
        testType: 'xray',
        appointmentDate: new Date(Date.now() + 86400000).toISOString()
      },
      {
        patientName: 'Patient 2',
        patientEmail: 'patient2@test.com',
        patientPhone: '+2222222222',
        testType: 'mri',
        appointmentDate: new Date(Date.now() + 172800000).toISOString()
      }
    ];

    // Create multiple bookings
    const createdBookings = [];
    for (const booking of bookings) {
      const response = await request(app)
        .post('/api/bookings')
        .send(booking)
        .expect(201);
      createdBookings.push(response.body.data);
    }

    // Retrieve all bookings
    const allBookingsResponse = await request(app)
      .get('/api/bookings')
      .expect(200);

    expect(allBookingsResponse.body.count).toBe(2);
    expect(allBookingsResponse.body.data.length).toBe(2);
  });

  test('Health endpoint should work alongside API', async () => {
    // Check health before operations
    const healthBefore = await request(app)
      .get('/health')
      .expect(200);

    expect(healthBefore.body.status).toBeDefined();

    // Perform some API operations
    await request(app)
      .get('/api/bookings')
      .expect(200);

    // Check health after operations
    const healthAfter = await request(app)
      .get('/health')
      .expect(200);

    expect(healthAfter.body.uptime).toBeGreaterThanOrEqual(healthBefore.body.uptime);
  });
});


const request = require('supertest');
const app = require('../../server');

describe('Bookings API', () => {
  beforeEach(() => {
    // Reset bookings before each test
    process.env.NODE_ENV = 'test';
    const bookingsRoute = require('../../src/routes/bookings');
    if (bookingsRoute.reset) {
      bookingsRoute.reset();
    }
  });

  test('GET /api/bookings should return empty array initially', async () => {
    const response = await request(app)
      .get('/api/bookings')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.count).toBe(0);
    expect(response.body.data).toEqual([]);
  });

  test('POST /api/bookings should create a new booking', async () => {
    const newBooking = {
      patientName: 'John Doe',
      patientEmail: 'john.doe@example.com',
      patientPhone: '+1234567890',
      testType: 'blood_test',
      appointmentDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      notes: 'Fasting required'
    };

    const response = await request(app)
      .post('/api/bookings')
      .send(newBooking)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data.patientName).toBe(newBooking.patientName);
    expect(response.body.data.status).toBe('pending');
  });

  test('POST /api/bookings should reject invalid data', async () => {
    const invalidBooking = {
      patientName: 'Jo', // Too short
      patientEmail: 'invalid-email', // Invalid email
      testType: 'blood_test'
    };

    const response = await request(app)
      .post('/api/bookings')
      .send(invalidBooking)
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body).toHaveProperty('error');
  });

  test('GET /api/bookings/:id should return a specific booking', async () => {
    // First create a booking
    const newBooking = {
      patientName: 'Jane Doe',
      patientEmail: 'jane.doe@example.com',
      patientPhone: '+1234567890',
      testType: 'xray',
      appointmentDate: new Date(Date.now() + 86400000).toISOString()
    };

    const createResponse = await request(app)
      .post('/api/bookings')
      .send(newBooking)
      .expect(201);

    const bookingId = createResponse.body.data.id;

    // Then retrieve it
    const getResponse = await request(app)
      .get(`/api/bookings/${bookingId}`)
      .expect(200);

    expect(getResponse.body.success).toBe(true);
    expect(getResponse.body.data.id).toBe(bookingId);
    expect(getResponse.body.data.patientName).toBe(newBooking.patientName);
  });

  test('PATCH /api/bookings/:id/status should update booking status', async () => {
    // Create a booking
    const newBooking = {
      patientName: 'Test Patient',
      patientEmail: 'test@example.com',
      patientPhone: '+1234567890',
      testType: 'blood_test',
      appointmentDate: new Date(Date.now() + 86400000).toISOString()
    };

    const createResponse = await request(app)
      .post('/api/bookings')
      .send(newBooking)
      .expect(201);

    const bookingId = createResponse.body.data.id;

    // Update status
    const updateResponse = await request(app)
      .patch(`/api/bookings/${bookingId}/status`)
      .send({ status: 'confirmed' })
      .expect(200);

    expect(updateResponse.body.success).toBe(true);
    expect(updateResponse.body.data.status).toBe('confirmed');
  });
});


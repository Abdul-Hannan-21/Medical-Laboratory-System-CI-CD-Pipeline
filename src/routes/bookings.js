const express = require('express');
const router = express.Router();
const Joi = require('joi');

// In-memory storage for demo (replace with database in production)
let bookings = [];
let bookingIdCounter = 1;

// Export for testing purposes
if (process.env.NODE_ENV === 'test') {
  module.exports.bookings = bookings;
  module.exports.bookingIdCounter = bookingIdCounter;
}

// Validation schema
const bookingSchema = Joi.object({
  patientName: Joi.string().min(3).max(100).required(),
  patientEmail: Joi.string().email().required(),
  patientPhone: Joi.string().pattern(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/).required(),
  testType: Joi.string().valid(
    'blood_test',
    'urine_test',
    'xray',
    'mri',
    'ct_scan',
    'ultrasound',
    'biopsy'
  ).required(),
  appointmentDate: Joi.date().greater('now').required(),
  notes: Joi.string().max(500).optional()
});

/**
 * Get all bookings
 * GET /api/bookings
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    count: bookings.length,
    data: bookings
  });
});

/**
 * Get booking by ID
 * GET /api/bookings/:id
 */
router.get('/:id', (req, res) => {
  const booking = bookings.find(b => b.id === parseInt(req.params.id));
  
  if (!booking) {
    return res.status(404).json({
      success: false,
      error: 'Booking not found'
    });
  }

  res.json({
    success: true,
    data: booking
  });
});

/**
 * Create new booking
 * POST /api/bookings
 */
router.post('/', (req, res) => {
  const { error, value } = bookingSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message
    });
  }

  const booking = {
    id: bookingIdCounter++,
    ...value,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  bookings.push(booking);

  res.status(201).json({
    success: true,
    message: 'Booking created successfully',
    data: booking
  });
});

/**
 * Update booking status
 * PATCH /api/bookings/:id/status
 */
router.patch('/:id/status', (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
  
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      error: `Status must be one of: ${validStatuses.join(', ')}`
    });
  }

  const booking = bookings.find(b => b.id === parseInt(req.params.id));
  
  if (!booking) {
    return res.status(404).json({
      success: false,
      error: 'Booking not found'
    });
  }

  booking.status = status;
  booking.updatedAt = new Date().toISOString();

  res.json({
    success: true,
    message: 'Booking status updated',
    data: booking
  });
});

/**
 * Delete booking
 * DELETE /api/bookings/:id
 */
router.delete('/:id', (req, res) => {
  const index = bookings.findIndex(b => b.id === parseInt(req.params.id));
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: 'Booking not found'
    });
  }

  bookings.splice(index, 1);

  res.json({
    success: true,
    message: 'Booking deleted successfully'
  });
});

module.exports = router;

// Export storage for testing
if (process.env.NODE_ENV === 'test') {
  module.exports.bookings = bookings;
  module.exports.bookingIdCounter = bookingIdCounter;
  
  // Reset function for tests
  module.exports.reset = function() {
    bookings = [];
    bookingIdCounter = 1;
    module.exports.bookings = bookings;
    module.exports.bookingIdCounter = bookingIdCounter;
  };
}


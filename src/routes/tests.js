const express = require('express');
const router = express.Router();
const Joi = require('joi');

// In-memory storage for demo (replace with database in production)
let testResults = [];
let resultIdCounter = 1;

// Export for testing purposes
if (process.env.NODE_ENV === 'test') {
  module.exports.testResults = testResults;
  module.exports.resultIdCounter = resultIdCounter;
}

// Validation schema
const resultSchema = Joi.object({
  bookingId: Joi.number().integer().positive().required(),
  testType: Joi.string().required(),
  result: Joi.string().required(),
  status: Joi.string().valid('normal', 'abnormal', 'critical').required(),
  notes: Joi.string().max(1000).optional(),
  labTechnician: Joi.string().min(3).max(100).required()
});

/**
 * Get all test results
 * GET /api/tests
 */
router.get('/', (req, res) => {
  const { bookingId, status } = req.query;
  
  let filtered = testResults;
  
  if (bookingId) {
    filtered = filtered.filter(t => t.bookingId === parseInt(bookingId));
  }
  
  if (status) {
    filtered = filtered.filter(t => t.status === status);
  }

  res.json({
    success: true,
    count: filtered.length,
    data: filtered
  });
});

/**
 * Get test result by ID
 * GET /api/tests/:id
 */
router.get('/:id', (req, res) => {
  const result = testResults.find(t => t.id === parseInt(req.params.id));
  
  if (!result) {
    return res.status(404).json({
      success: false,
      error: 'Test result not found'
    });
  }

  res.json({
    success: true,
    data: result
  });
});

/**
 * Create new test result
 * POST /api/tests
 */
router.post('/', (req, res) => {
  const { error, value } = resultSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message
    });
  }

  const testResult = {
    id: resultIdCounter++,
    ...value,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  testResults.push(testResult);

  res.status(201).json({
    success: true,
    message: 'Test result created successfully',
    data: testResult
  });
});

/**
 * Update test result
 * PUT /api/tests/:id
 */
router.put('/:id', (req, res) => {
  const { error, value } = resultSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message
    });
  }

  const index = testResults.findIndex(t => t.id === parseInt(req.params.id));
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: 'Test result not found'
    });
  }

  testResults[index] = {
    ...testResults[index],
    ...value,
    id: testResults[index].id,
    updatedAt: new Date().toISOString()
  };

  res.json({
    success: true,
    message: 'Test result updated successfully',
    data: testResults[index]
  });
});

module.exports = router;

// Export storage for testing
if (process.env.NODE_ENV === 'test') {
  module.exports.testResults = testResults;
  module.exports.resultIdCounter = resultIdCounter;
  
  // Reset function for tests
  module.exports.reset = function() {
    testResults = [];
    resultIdCounter = 1;
    module.exports.testResults = testResults;
    module.exports.resultIdCounter = resultIdCounter;
  };
}


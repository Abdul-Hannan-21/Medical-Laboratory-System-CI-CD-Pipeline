module.exports = {
  ...require('./jest.config.js'),
  testMatch: [
    '**/tests/integration/**/*.test.js'
  ],
  testTimeout: 10000
};


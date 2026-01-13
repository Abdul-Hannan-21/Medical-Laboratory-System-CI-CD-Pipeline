module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    'server.js',
    '!src/**/*.test.js',
    '!**/node_modules/**'
  ],
  coverageThreshold: {
    global: {
      branches: 33,
      functions: 33,
      lines: 62,
      statements: 60
    }
  },
  testMatch: [
    '**/tests/unit/**/*.test.js'
  ],
  verbose: true,
  // Avoid forcing exit; use detectOpenHandles to surface async handles instead
  forceExit: false,
  detectOpenHandles: true,
  testTimeout: 10000,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  setupFiles: ['<rootDir>/tests/setup.js']
};


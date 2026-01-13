require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const app = express();
const PORT = process.env.PORT || 3000;

// Import routes
const healthRoutes = require('./src/routes/health');
const bookingRoutes = require('./src/routes/bookings');
const testRoutes = require('./src/routes/tests');
const ciStatusRoutes = require('./src/routes/ci-status');

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);

// Routes
app.use('/health', healthRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/ci-status', ciStatusRoutes);

// Serve static UI assets (dashboard) from public/
app.use(express.static('public'));

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Medical Laboratory Test Booking and Result Management System API',
    version: '1.0.0',
    documentation: '/api/docs'
  });
});

// Redirect to CI dashboard served by the Python preview server.
// Behavior:
// - inside compose (when PREVIEW_INTERNAL=true) the preview service hostname is `preview:8000` so
//   we redirect internally to that host so the app container can proxy/redirect traffic to it.
// - when running on the host, redirect to localhost:8000 so the browser opens the preview page.
app.get('/dashboard', (req, res) => {
  const useInternal = process.env.PREVIEW_INTERNAL === 'true';
  const internalUrl = 'http://preview:8000';
  const hostUrl = 'http://localhost:8000';
  const target = useInternal ? internalUrl : hostUrl;
  return res.redirect(target);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found'
  });
});

// Error handler
app.use((err, req, res, _next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Medical Laboratory System running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

module.exports = app;


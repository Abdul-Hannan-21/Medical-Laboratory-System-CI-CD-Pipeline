const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const redis = require('redis');

// Initialize database connection (if available)
let dbPool = null;
if (process.env.DATABASE_URL) {
  dbPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });
}

// Initialize Redis connection (if available)
let redisClient = null;
if (process.env.REDIS_URL) {
  redisClient = redis.createClient({
    url: process.env.REDIS_URL
  });
  redisClient.on('error', (err) => console.log('Redis Client Error', err));
  if (redisClient && !redisClient.isOpen) {
    redisClient.connect().catch(console.error);
  }
}

/**
 * Health check endpoint
 * GET /health
 */
router.get('/', async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    services: {}
  };

  // Check database connection
  if (dbPool) {
    try {
      await dbPool.query('SELECT NOW()');
      health.services.database = 'connected';
    } catch (error) {
      health.services.database = 'disconnected';
      health.status = 'degraded';
    }
  } else {
    health.services.database = 'not_configured';
  }

  // Check Redis connection
  if (redisClient) {
    try {
      if (redisClient.isOpen) {
        await redisClient.ping();
        health.services.redis = 'connected';
      } else {
        health.services.redis = 'disconnected';
        health.status = 'degraded';
      }
    } catch (error) {
      health.services.redis = 'disconnected';
      health.status = 'degraded';
    }
  } else {
    health.services.redis = 'not_configured';
  }

  const statusCode = health.status === 'healthy' ? 200 : 503;
  res.status(statusCode).json(health);
});

module.exports = router;


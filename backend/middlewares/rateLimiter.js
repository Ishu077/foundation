import { rateLimit } from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { redisClient, isRedisAvailable } from '../config/redis.js';


/**
 * Create rate limiter with Redis store (falls back to memory if Redis unavailable)

 */

export const createRateLimiter = (options = {}) => {
  const defaultOptions = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: 'draft-8',
    legacyHeaders: false,
  };

  const limiterOptions = { ...defaultOptions, ...options };

  // Use Redis store if available, otherwise fall back to memory store
  if (isRedisAvailable()) {
    console.log('✅ Rate limiter: Using Redis store');
    limiterOptions.store = new RedisStore({
      // @ts-expect-error - Known issue: the `call` function is not present in @types/node-redis
      sendCommand: (...args) => redisClient.sendCommand(args),
      prefix: 'rl:', // Rate limit key prefix
    });
  } else {
    console.log('⚠️  Rate limiter: Using memory store (Redis not available)');
  }

  return rateLimit(limiterOptions);
};

// General API rate limiter
export const generalLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // 100 requests per 15 minutes
  message: 'Too many requests, please try again later.',
});

// Strict rate limiter for AI operations (more restrictive)
export const aiLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 20, // 20 AI requests per hour
  message: 'Too many AI summary requests. Please try again later.',
  skipSuccessfulRequests: false, // Count all requests
});

// Auth rate limiter (for login/signup)
export const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5, // 5 attempts per 15 minutes
  message: 'Too many authentication attempts, please try again later.',
  skipSuccessfulRequests: true, // Only count failed requests
});

export default {
  createRateLimiter,
  generalLimiter,
  aiLimiter,
  authLimiter,
};


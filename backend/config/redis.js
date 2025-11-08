import { createClient } from 'redis';
import dotenv from 'dotenv';

// Only load .env if not in Docker
if (process.env.NODE_ENV !== 'production' && !process.env.DOCKER_ENV) {
  dotenv.config();
}

// Build Redis URL based on environment
let redisUrl;

if (process.env.REDIS_PASSWORD) {
  // Production: with password
  redisUrl = `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`;
} else {
  // Local development: without password
  redisUrl = `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`;
}

// Create Redis client with configuration
const redisClient = createClient({
  url: process.env.REDIS_URL || redisUrl,
  socket: {
    reconnectStrategy: (retries) => {  //stratergy to reconnect
      if (retries > 10) {
        console.error('Redis: Too many reconnection attempts. Giving up.');
        return new Error('Redis reconnection failed');
      }
      // Exponential backoff: wait longer between each retry
      const delay = Math.min(retries * 100, 3000);
      console.log(`Redis: Reconnecting in ${delay}ms...`);
      return delay;
    },
    connectTimeout: 10000, // 10 seconds
  },
  // Gracefully handle errors
  legacyMode: false,  // donefor better better performance  and compatibility with nre redis feature
});

// Event handlers for Redis connection
redisClient.on('connect', () => {
  console.log('✅ Redis: Connecting...');
});

redisClient.on('ready', () => {
  console.log('✅ Redis: Client is ready and connected');
});

redisClient.on('error', (err) => {
  console.error('❌ Redis Error:', err.message);
});

redisClient.on('reconnecting', () => {
  console.log('🔄 Redis: Reconnecting...');
});

redisClient.on('end', () => {
  console.log('⚠️  Redis: Connection closed');
});

// Connect to Redis
const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
      console.log('✅ Redis: Successfully connected');
    }
  } catch (error) {
    console.error('❌ Redis: Failed to connect:', error.message);
    console.log('⚠️  Application will continue without Redis caching');
  }
};

// Graceful shutdown
const disconnectRedis = async () => {
  try {
    if (redisClient.isOpen) {
      await redisClient.quit();
      console.log('✅ Redis: Disconnected gracefully');
    }
  } catch (error) {
    console.error('❌ Redis: Error during disconnect:', error.message);
  }
};

// Helper function to check if Redis is available
const isRedisAvailable = () => {
  return redisClient.isOpen && redisClient.isReady;
};

export { redisClient, connectRedis, disconnectRedis, isRedisAvailable };


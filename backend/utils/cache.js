//redis caching utility module-->

import { redisClient, isRedisAvailable } from '../config/redis.js';
import crypto from 'crypto';

//  cases for handling why the redis unavailable case and printing in the temrinal of vascode for error
/**
 * Generate a cache key with optional prefix
 * @param {string} prefix - Cache key prefix (e.g., 'summary', 'user')
 * @param {string|object} identifier - Unique identifier or object to hash
 * @returns {string} - Generated cache key
 */

export const generateCacheKey = (prefix, identifier) => {
  if (typeof identifier === 'object') {
    // Create a hash for object identifiers (useful for caching based on content)
    const hash = crypto
      .createHash('md5')
      .update(JSON.stringify(identifier))
      .digest('hex');
    return `${prefix}:${hash}`;
  }
  return `${prefix}:${identifier}`;
};

/**
 * Get data from cache
 * @param {string} key - Cache key
 * @returns {Promise<any|null>} - Cached data or null if not found/error
 */
export const getCache = async (key) => {
  try {
    if (!isRedisAvailable()) {
      console.log('⚠️  Redis not available, skipping cache read');
      return null;
    }

    const data = await redisClient.get(key);
    if (data) {
      console.log(`✅ Cache HIT: ${key}`);
      return JSON.parse(data);
    }
    console.log(`❌ Cache MISS: ${key}`);
    return null;
  } catch (error) {
    console.error(`❌ Cache GET error for key ${key}:`, error.message);
    return null;
  }
};

/**
 * Set data in cache with optional TTL
 * @param {string} key - Cache key
 * @param {any} value - Data to cache
 * @param {number} ttl - Time to live in seconds (default: 1 hour)
 * @returns {Promise<boolean>} - Success status
 */
export const setCache = async (key, value, ttl = 3600) => {
  try {
    if (!isRedisAvailable()) {
      console.log('⚠️  Redis not available, skipping cache write');
      return false;
    }

    const serialized = JSON.stringify(value);
    await redisClient.setEx(key, ttl, serialized);
    console.log(`✅ Cache SET: ${key} (TTL: ${ttl}s)`);
    return true;
  } catch (error) {
    console.error(`❌ Cache SET error for key ${key}:`, error.message);
    return false;
  }
};

/**
 * Delete data from cache
 * @param {string} key - Cache key or pattern
 * @returns {Promise<boolean>} - Success status
 */
export const deleteCache = async (key) => {
  try {
    if (!isRedisAvailable()) {
      console.log('⚠️  Redis not available, skipping cache delete');
      return false;
    }

    await redisClient.del(key);
    console.log(`✅ Cache DELETE: ${key}`);
    return true;
  } catch (error) {
    console.error(`❌ Cache DELETE error for key ${key}:`, error.message);
    return false;
  }
};

/**
 * Delete multiple keys matching a pattern
 * @param {string} pattern - Pattern to match (e.g., 'user:123:*')
 * @returns {Promise<number>} - Number of keys deleted
 */
export const deleteCachePattern = async (pattern) => {
  try {
    if (!isRedisAvailable()) {
      console.log('⚠️  Redis not available, skipping pattern delete');
      return 0;
    }

    const keys = await redisClient.keys(pattern);
    if (keys.length === 0) {
      console.log(`⚠️  No keys found matching pattern: ${pattern}`);
      return 0;
    }

    await redisClient.del(keys);   //from dcumentation!
    console.log(`✅ Cache DELETE PATTERN: ${pattern} (${keys.length} keys)`);
    return keys.length;
  } catch (error) {
    console.error(`❌ Cache DELETE PATTERN error for ${pattern}:`, error.message);
    return 0;
  }
};

/**
 * Check if a key exists in cache
 * @param {string} key - Cache key
 * @returns {Promise<boolean>} - True if exists
 */
export const existsCache = async (key) => {
  try {
    if (!isRedisAvailable()) {
      return false;
    }

    const exists = await redisClient.exists(key);
    return exists === 1;
  } catch (error) {
    console.error(`❌ Cache EXISTS error for key ${key}:`, error.message);
    return false;
  }
};

/**
 * Get remaining TTL for a key
 * @param {string} key - Cache key
 * @returns {Promise<number>} - TTL in seconds (-1 if no expiry, -2 if not exists)
 */
export const getTTL = async (key) => {
  try {
    if (!isRedisAvailable()) {
      return -2;
    }

    return await redisClient.ttl(key);
  } catch (error) {
    console.error(`❌ Cache TTL error for key ${key}:`, error.message);
    return -2;
  }
};

/**
 * Increment a counter in cache
 * @param {string} key - Cache key
 * @param {number} increment - Amount to increment (default: 1)
 * @returns {Promise<number|null>} - New value or null on error
 */
export const incrementCache = async (key, increment = 1) => {
  try {
    if (!isRedisAvailable()) {
      return null;
    }

    const newValue = await redisClient.incrBy(key, increment);
    console.log(`✅ Cache INCREMENT: ${key} by ${increment} = ${newValue}`);
    return newValue;
  } catch (error) {
    console.error(`❌ Cache INCREMENT error for key ${key}:`, error.message);
    return null;
  }
};

/**
 * Cache wrapper function - get from cache or execute function and cache result
 * @param {string} key - Cache key
 * @param {Function} fn - Async function to execute if cache miss
 * @param {number} ttl -   Time to live in seconds
 * @returns {Promise<any>} - Cached or fresh data
 */
export const cacheWrapper = async (key, fn, ttl = 3600) => {
  try {
    // Try to get from cache first
    const cached = await getCache(key);
    if (cached !== null) {
      return cached;
    }

    // Cache miss - execute function
    console.log(`⚙️  Executing function for cache key: ${key}`);
    const result = await fn();

    // Cache the result
    await setCache(key, result, ttl);

    return result;
  } catch (error) {
    console.error(`❌ Cache wrapper error for key ${key}:`, error.message);
    // On error, just execute the function without caching
    return await fn();
  }
};

/**
 * Invalidate all caches for a specific user
 * @param {string} userId - User ID
 * @returns {Promise<number>} - Number of keys deleted
 */
export const invalidateUserCache = async (userId) => {
  const patterns = [
    `user:${userId}:*`,
    `summaries:${userId}`,
  ];

  let totalDeleted = 0;
  for (const pattern of patterns) {
    const deleted = await deleteCachePattern(pattern);
    totalDeleted += deleted;
  }

  console.log(`✅ Invalidated ${totalDeleted} cache entries for user ${userId}`);
  return totalDeleted;
};

export default {
  generateCacheKey,
  getCache,
  setCache,
  deleteCache,
  deleteCachePattern,
  existsCache,
  getTTL,
  incrementCache,
  cacheWrapper,
  invalidateUserCache,
};


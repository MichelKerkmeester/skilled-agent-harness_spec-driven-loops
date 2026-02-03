// ───────────────────────────────────────────────────────────────
// CACHE: TOOL OUTPUT CACHE
// ───────────────────────────────────────────────────────────────
'use strict';

const crypto = require('crypto');

/* ─────────────────────────────────────────────────────────────
   1. CONFIGURATION
────────────────────────────────────────────────────────────────*/

const TOOL_CACHE_CONFIG = {
  enabled: process.env.ENABLE_TOOL_CACHE !== 'false',
  defaultTtlMs: parseInt(process.env.TOOL_CACHE_TTL_MS, 10) || 60000,  // 60s TTL
  maxEntries: parseInt(process.env.TOOL_CACHE_MAX_ENTRIES, 10) || 1000,
  cleanupIntervalMs: parseInt(process.env.TOOL_CACHE_CLEANUP_INTERVAL_MS, 10) || 30000,
};

/* ─────────────────────────────────────────────────────────────
   2. STATE
────────────────────────────────────────────────────────────────*/

/**
 * In-memory cache storage
 * Map<string, CacheEntry>
 *
 * CacheEntry = {
 *   value: any,
 *   expiresAt: number,  // Unix timestamp in ms
 *   toolName: string,
 *   createdAt: number
 * }
 */
const cache = new Map();

// Statistics for monitoring
const stats = {
  hits: 0,
  misses: 0,
  evictions: 0,
  invalidations: 0,
};

// Cleanup interval reference
let cleanup_interval = null;

/* ─────────────────────────────────────────────────────────────
   3. CACHE KEY GENERATION
────────────────────────────────────────────────────────────────*/

/**
 * Generate a deterministic cache key from tool name and arguments.
 * Uses SHA-256 hash of canonicalized JSON to ensure consistency.
 *
 * @param {string} tool_name - Name of the tool/operation
 * @param {Object} args - Tool arguments (will be JSON-stringified)
 * @returns {string} Cache key (hex string)
 */
function generate_cache_key(tool_name, args) {
  if (!tool_name || typeof tool_name !== 'string') {
    throw new Error('[tool-cache] tool_name must be a non-empty string');
  }

  // Canonicalize arguments by sorting keys and handling undefined/null
  const canonical_args = canonicalize_args(args);

  // Create deterministic string
  const key_string = `${tool_name}:${canonical_args}`;

  // Hash for fixed-length key
  return crypto.createHash('sha256').update(key_string).digest('hex');
}

/**
 * Canonicalize arguments for consistent cache keys.
 * Sorts object keys recursively and handles special values.
 *
 * @param {any} args - Arguments to canonicalize
 * @returns {string} Canonical JSON string
 */
function canonicalize_args(args) {
  if (args === undefined || args === null) {
    return 'null';
  }

  if (typeof args !== 'object') {
    return JSON.stringify(args);
  }

  if (Array.isArray(args)) {
    return JSON.stringify(args.map(canonicalize_args));
  }

  // Sort object keys for deterministic ordering
  const sorted_keys = Object.keys(args).sort();
  const sorted_obj = {};

  for (const key of sorted_keys) {
    const value = args[key];
    // Skip undefined values (they don't affect cache key)
    if (value !== undefined) {
      sorted_obj[key] = typeof value === 'object' ? canonicalize_args(value) : value;
    }
  }

  return JSON.stringify(sorted_obj);
}

/* ─────────────────────────────────────────────────────────────
   4. CORE CACHE OPERATIONS
────────────────────────────────────────────────────────────────*/

/**
 * Get a value from the cache.
 *
 * @param {string} key - Cache key
 * @returns {Object|null} Cached value or null if not found/expired
 */
function get(key) {
  if (!TOOL_CACHE_CONFIG.enabled) {
    return null;
  }

  const entry = cache.get(key);

  if (!entry) {
    stats.misses++;
    return null;
  }

  // Check expiration
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    stats.misses++;
    stats.evictions++;
    return null;
  }

  stats.hits++;
  return entry.value;
}

/**
 * Store a value in the cache.
 *
 * @param {string} key - Cache key
 * @param {any} value - Value to cache
 * @param {Object} options - Cache options
 * @param {string} options.toolName - Name of the tool (for tracking)
 * @param {number} [options.ttlMs] - TTL in milliseconds (default: config value)
 * @returns {boolean} True if cached successfully
 */
function set(key, value, options = {}) {
  if (!TOOL_CACHE_CONFIG.enabled) {
    return false;
  }

  const { toolName = 'unknown', ttlMs = TOOL_CACHE_CONFIG.defaultTtlMs } = options;
  const now = Date.now();

  // Enforce max entries limit
  if (cache.size >= TOOL_CACHE_CONFIG.maxEntries) {
    evict_oldest();
  }

  const entry = {
    value,
    expiresAt: now + ttlMs,
    toolName,
    createdAt: now,
  };

  cache.set(key, entry);
  return true;
}

/**
 * Check if a key exists and is not expired.
 *
 * @param {string} key - Cache key
 * @returns {boolean} True if key exists and is valid
 */
function has(key) {
  if (!TOOL_CACHE_CONFIG.enabled) {
    return false;
  }

  const entry = cache.get(key);
  if (!entry) {
    return false;
  }

  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    stats.evictions++;
    return false;
  }

  return true;
}

/**
 * Delete a specific key from the cache.
 *
 * @param {string} key - Cache key to delete
 * @returns {boolean} True if key was deleted
 */
function del(key) {
  const deleted = cache.delete(key);
  if (deleted) {
    stats.invalidations++;
  }
  return deleted;
}

/* ─────────────────────────────────────────────────────────────
   5. CACHE INVALIDATION
────────────────────────────────────────────────────────────────*/

/**
 * Invalidate all cache entries for a specific tool.
 * Used when write operations occur that affect tool results.
 *
 * @param {string} tool_name - Tool name to invalidate
 * @returns {number} Number of entries invalidated
 */
function invalidate_by_tool(tool_name) {
  let count = 0;

  for (const [key, entry] of cache.entries()) {
    if (entry.toolName === tool_name) {
      cache.delete(key);
      count++;
      stats.invalidations++;
    }
  }

  return count;
}

/**
 * Invalidate all cache entries matching a pattern.
 * Used for broader invalidation on data changes.
 *
 * @param {RegExp|string} pattern - Pattern to match tool names
 * @returns {number} Number of entries invalidated
 */
function invalidate_by_pattern(pattern) {
  const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
  let count = 0;

  for (const [key, entry] of cache.entries()) {
    if (regex.test(entry.toolName)) {
      cache.delete(key);
      count++;
      stats.invalidations++;
    }
  }

  return count;
}

/**
 * Clear all cache entries.
 * Used for complete cache reset (e.g., after bulk writes).
 *
 * @returns {number} Number of entries cleared
 */
function clear() {
  const count = cache.size;
  cache.clear();
  stats.invalidations += count;
  return count;
}

/**
 * Invalidate cache entries affected by write operations.
 * Call this after any memory_save, memory_update, memory_delete operations.
 *
 * @param {string} operation - Type of write operation ('save', 'update', 'delete', 'index')
 * @param {Object} context - Operation context (specFolder, filePath, etc.)
 * @returns {number} Number of entries invalidated
 */
function invalidate_on_write(operation, context = {}) {
  // Write operations affect search results, so invalidate search-related caches
  const affected_tools = [
    'memory_search',
    'memory_match_triggers',
    'memory_list_folders',
    'memory_read',
  ];

  let total_invalidated = 0;

  for (const tool of affected_tools) {
    total_invalidated += invalidate_by_tool(tool);
  }

  // Log for debugging
  if (total_invalidated > 0) {
    console.log(`[tool-cache] Invalidated ${total_invalidated} entries after ${operation}`);
  }

  return total_invalidated;
}

/* ─────────────────────────────────────────────────────────────
   6. EVICTION & CLEANUP
────────────────────────────────────────────────────────────────*/

/**
 * Evict the oldest entry from cache.
 * Called when max entries limit is reached.
 */
function evict_oldest() {
  let oldest_key = null;
  let oldest_time = Infinity;

  for (const [key, entry] of cache.entries()) {
    if (entry.createdAt < oldest_time) {
      oldest_time = entry.createdAt;
      oldest_key = key;
    }
  }

  if (oldest_key) {
    cache.delete(oldest_key);
    stats.evictions++;
  }
}

/**
 * Remove all expired entries from cache.
 * Called periodically by cleanup interval.
 *
 * @returns {number} Number of entries removed
 */
function cleanup_expired() {
  const now = Date.now();
  let count = 0;

  for (const [key, entry] of cache.entries()) {
    if (now > entry.expiresAt) {
      cache.delete(key);
      count++;
      stats.evictions++;
    }
  }

  return count;
}

/**
 * Start the automatic cleanup interval.
 */
function start_cleanup_interval() {
  if (cleanup_interval) {
    return; // Already running
  }

  cleanup_interval = setInterval(() => {
    cleanup_expired();
  }, TOOL_CACHE_CONFIG.cleanupIntervalMs);

  // Allow process to exit even if interval is running
  if (cleanup_interval.unref) {
    cleanup_interval.unref();
  }
}

/**
 * Stop the automatic cleanup interval.
 */
function stop_cleanup_interval() {
  if (cleanup_interval) {
    clearInterval(cleanup_interval);
    cleanup_interval = null;
  }
}

/* ─────────────────────────────────────────────────────────────
   7. HIGH-LEVEL WRAPPER
────────────────────────────────────────────────────────────────*/

/**
 * Execute a function with caching.
 * If cached result exists and is valid, return it.
 * Otherwise, execute the function and cache the result.
 *
 * @param {string} tool_name - Tool name for cache key and tracking
 * @param {Object} args - Tool arguments for cache key
 * @param {Function} fn - Function to execute if cache miss
 * @param {Object} options - Cache options
 * @param {boolean} [options.bypassCache=false] - Skip cache lookup
 * @param {number} [options.ttlMs] - Custom TTL for this entry
 * @returns {Promise<any>} Cached or fresh result
 */
async function with_cache(tool_name, args, fn, options = {}) {
  const { bypassCache = false, ttlMs } = options;

  // Early return if caching disabled or bypassed
  if (!TOOL_CACHE_CONFIG.enabled || bypassCache) {
    return await fn();
  }

  // Generate cache key
  const key = generate_cache_key(tool_name, args);

  // Check cache
  const cached = get(key);
  if (cached !== null) {
    return cached;
  }

  // Execute function
  const result = await fn();

  // Cache result
  set(key, result, { toolName: tool_name, ttlMs });

  return result;
}

/* ─────────────────────────────────────────────────────────────
   8. STATISTICS & MONITORING
────────────────────────────────────────────────────────────────*/

/**
 * Get cache statistics.
 *
 * @returns {Object} Cache statistics
 */
function get_stats() {
  const total_requests = stats.hits + stats.misses;
  const hit_rate = total_requests > 0 ? (stats.hits / total_requests) * 100 : 0;

  return {
    hits: stats.hits,
    misses: stats.misses,
    evictions: stats.evictions,
    invalidations: stats.invalidations,
    hitRate: hit_rate.toFixed(2) + '%',
    currentSize: cache.size,
    maxSize: TOOL_CACHE_CONFIG.maxEntries,
  };
}

/**
 * Reset statistics counters.
 */
function reset_stats() {
  stats.hits = 0;
  stats.misses = 0;
  stats.evictions = 0;
  stats.invalidations = 0;
}

/**
 * Get current configuration.
 *
 * @returns {Object} Configuration values
 */
function get_config() {
  return { ...TOOL_CACHE_CONFIG };
}

/**
 * Check if caching is enabled.
 *
 * @returns {boolean} True if caching is enabled
 */
function is_enabled() {
  return TOOL_CACHE_CONFIG.enabled;
}

/* ─────────────────────────────────────────────────────────────
   9. INITIALIZATION
────────────────────────────────────────────────────────────────*/

/**
 * Initialize the cache module.
 * Starts the cleanup interval.
 */
function init() {
  start_cleanup_interval();
  console.log(`[tool-cache] Initialized with ${TOOL_CACHE_CONFIG.defaultTtlMs}ms TTL, max ${TOOL_CACHE_CONFIG.maxEntries} entries`);
}

/**
 * Shutdown the cache module.
 * Clears all entries and stops cleanup interval.
 */
function shutdown() {
  stop_cleanup_interval();
  clear();
  reset_stats();
  console.log('[tool-cache] Shutdown complete');
}

// Auto-initialize on module load
if (TOOL_CACHE_CONFIG.enabled) {
  start_cleanup_interval();
}

/* ─────────────────────────────────────────────────────────────
   10. EXPORTS
────────────────────────────────────────────────────────────────*/

module.exports = {
  // Core operations
  get,
  set,
  has,
  del,

  // Key generation
  generateCacheKey: generate_cache_key,

  // Invalidation
  invalidateByTool: invalidate_by_tool,
  invalidateByPattern: invalidate_by_pattern,
  invalidateOnWrite: invalidate_on_write,
  clear,

  // High-level wrapper
  withCache: with_cache,

  // Eviction & cleanup
  evictOldest: evict_oldest,
  cleanupExpired: cleanup_expired,
  startCleanupInterval: start_cleanup_interval,
  stopCleanupInterval: stop_cleanup_interval,

  // Statistics & monitoring
  getStats: get_stats,
  resetStats: reset_stats,
  getConfig: get_config,
  isEnabled: is_enabled,

  // Lifecycle
  init,
  shutdown,

  // Configuration (read-only)
  CONFIG: { ...TOOL_CACHE_CONFIG },
};

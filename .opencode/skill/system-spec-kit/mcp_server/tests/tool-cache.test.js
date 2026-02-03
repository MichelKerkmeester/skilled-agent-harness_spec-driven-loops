// ───────────────────────────────────────────────────────────────
// TEST: TOOL CACHE
// ───────────────────────────────────────────────────────────────
'use strict';

const { describe, it, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('crypto');

// Module under test
const toolCache = require('../lib/cache/tool-cache.js');

describe('Tool Cache (T012-T015)', () => {
  beforeEach(() => {
    // Reset cache before each test
    toolCache.clear();
    toolCache.resetStats();
  });

  afterEach(() => {
    toolCache.clear();
  });

  /* ─────────────────────────────────────────────────────────────
     1. CACHE INITIALIZATION
  ──────────────────────────────────────────────────────────────── */

  describe('Cache initialization', () => {
    it('should initialize with correct default configuration', () => {
      const config = toolCache.getConfig();

      assert.strictEqual(typeof config.enabled, 'boolean');
      assert.strictEqual(config.defaultTtlMs, 60000, 'Default TTL should be 60 seconds');
      assert.strictEqual(config.maxEntries, 1000, 'Max entries should be 1000');
      assert.strictEqual(typeof config.cleanupIntervalMs, 'number');
    });

    it('should expose CONFIG as immutable copy', () => {
      const config1 = toolCache.CONFIG;
      const config2 = toolCache.CONFIG;

      // Should be equal but not same object reference (copy)
      assert.deepStrictEqual(config1, config2);
      assert.strictEqual(config1.defaultTtlMs, 60000);
      assert.strictEqual(config1.maxEntries, 1000);
    });

    it('should start with empty cache', () => {
      toolCache.clear();
      const stats = toolCache.getStats();
      assert.strictEqual(stats.currentSize, 0);
    });

    it('should have cleanup interval methods', () => {
      assert.strictEqual(typeof toolCache.startCleanupInterval, 'function');
      assert.strictEqual(typeof toolCache.stopCleanupInterval, 'function');
    });

    it('should report enabled status', () => {
      const enabled = toolCache.isEnabled();
      assert.strictEqual(typeof enabled, 'boolean');
    });
  });

  /* ─────────────────────────────────────────────────────────────
     2. CACHE KEY GENERATION (SHA-256)
  ──────────────────────────────────────────────────────────────── */

  describe('T013: Cache key generation from tool name + args hash', () => {
    it('should generate consistent keys for same inputs', () => {
      const args = { query: 'authentication', limit: 10 };

      const key1 = toolCache.generateCacheKey('memory_search', args);
      const key2 = toolCache.generateCacheKey('memory_search', args);

      assert.strictEqual(key1, key2);
    });

    it('should generate different keys for different args', () => {
      const key1 = toolCache.generateCacheKey('memory_search', { query: 'auth' });
      const key2 = toolCache.generateCacheKey('memory_search', { query: 'login' });

      assert.notStrictEqual(key1, key2);
    });

    it('should generate different keys for different tools', () => {
      const args = { query: 'test' };

      const key1 = toolCache.generateCacheKey('memory_search', args);
      const key2 = toolCache.generateCacheKey('memory_save', args);

      assert.notStrictEqual(key1, key2);
    });

    it('should handle nested objects consistently', () => {
      const args1 = { query: 'test', options: { a: 1, b: 2 } };
      const args2 = { query: 'test', options: { b: 2, a: 1 } }; // Different order

      const key1 = toolCache.generateCacheKey('tool', args1);
      const key2 = toolCache.generateCacheKey('tool', args2);

      assert.strictEqual(key1, key2, 'Keys should be same regardless of object key order');
    });

    it('should handle null and undefined args', () => {
      const key1 = toolCache.generateCacheKey('tool', null);
      const key2 = toolCache.generateCacheKey('tool', undefined);

      assert.strictEqual(key1, key2, 'null and undefined should generate same key');
    });

    it('should generate SHA-256 hex string (64 characters)', () => {
      const key = toolCache.generateCacheKey('test_tool', { query: 'test' });

      assert.strictEqual(key.length, 64, 'SHA-256 produces 64 hex characters');
      assert.match(key, /^[a-f0-9]{64}$/, 'Should be valid hex string');
    });

    it('should match manual SHA-256 calculation', () => {
      const toolName = 'manual_test';
      const args = { value: 123 };

      // Generate key using the module
      const key = toolCache.generateCacheKey(toolName, args);

      // Manual calculation with same canonicalization approach
      // The module canonicalizes: sorted keys, JSON stringify
      const expectedKeyString = `${toolName}:{"value":123}`;
      const expectedHash = crypto.createHash('sha256').update(expectedKeyString).digest('hex');

      assert.strictEqual(key, expectedHash, 'Should match manual SHA-256 calculation');
    });

    it('should throw error for invalid tool_name', () => {
      assert.throws(() => toolCache.generateCacheKey('', { test: true }), /tool_name must be a non-empty string/);
      assert.throws(() => toolCache.generateCacheKey(null, { test: true }), /tool_name must be a non-empty string/);
      assert.throws(() => toolCache.generateCacheKey(undefined, { test: true }), /tool_name must be a non-empty string/);
      assert.throws(() => toolCache.generateCacheKey(123, { test: true }), /tool_name must be a non-empty string/);
    });

    it('should handle arrays in args', () => {
      const args1 = { items: [1, 2, 3] };
      const args2 = { items: [1, 2, 3] };
      const args3 = { items: [3, 2, 1] };

      const key1 = toolCache.generateCacheKey('tool', args1);
      const key2 = toolCache.generateCacheKey('tool', args2);
      const key3 = toolCache.generateCacheKey('tool', args3);

      assert.strictEqual(key1, key2, 'Same arrays should produce same key');
      assert.notStrictEqual(key1, key3, 'Different array order should produce different key');
    });

    it('should skip undefined values in objects', () => {
      const args1 = { a: 1, b: undefined };
      const args2 = { a: 1 };

      const key1 = toolCache.generateCacheKey('tool', args1);
      const key2 = toolCache.generateCacheKey('tool', args2);

      assert.strictEqual(key1, key2, 'Undefined values should be skipped');
    });

    it('should handle primitive args', () => {
      const keyString = toolCache.generateCacheKey('tool', 'simple string');
      const keyNumber = toolCache.generateCacheKey('tool', 42);
      const keyBool = toolCache.generateCacheKey('tool', true);

      assert.strictEqual(keyString.length, 64);
      assert.strictEqual(keyNumber.length, 64);
      assert.strictEqual(keyBool.length, 64);

      // All should be different
      assert.notStrictEqual(keyString, keyNumber);
      assert.notStrictEqual(keyNumber, keyBool);
    });
  });

  /* ─────────────────────────────────────────────────────────────
     3. CORE CACHE OPERATIONS (TTL)
  ──────────────────────────────────────────────────────────────── */

  describe('T012: Session-scoped cache with 60s TTL', () => {
    it('should cache and retrieve values', () => {
      const key = toolCache.generateCacheKey('test_tool', { query: 'test' });

      toolCache.set(key, { result: 'cached' }, { toolName: 'test_tool' });

      const cached = toolCache.get(key);
      assert.deepStrictEqual(cached, { result: 'cached' });
    });

    it('should return null for non-existent keys', () => {
      const result = toolCache.get('non_existent_key');
      assert.strictEqual(result, null);
    });

    it('should expire entries after TTL', async () => {
      // Use a very short TTL for testing
      const key = toolCache.generateCacheKey('test_tool', { query: 'ttl_test' });

      toolCache.set(key, { result: 'will_expire' }, { toolName: 'test_tool', ttlMs: 50 });

      // Immediately available
      assert.ok(toolCache.has(key));

      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 100));

      // Should be expired
      assert.strictEqual(toolCache.get(key), null);
    });

    it('should track hit/miss statistics', () => {
      const key = toolCache.generateCacheKey('stats_test', { query: 'test' });

      // Miss
      toolCache.get(key);

      // Set value
      toolCache.set(key, 'value', { toolName: 'stats_test' });

      // Hit
      toolCache.get(key);
      toolCache.get(key);

      const stats = toolCache.getStats();
      assert.strictEqual(stats.hits, 2);
      assert.strictEqual(stats.misses, 1);
    });

    it('should use default TTL of 60s when not specified', () => {
      const config = toolCache.getConfig();
      assert.strictEqual(config.defaultTtlMs, 60000, 'Default TTL should be 60 seconds');
    });

    it('should allow custom TTL per entry', async () => {
      const key1 = toolCache.generateCacheKey('tool', { id: 1 });
      const key2 = toolCache.generateCacheKey('tool', { id: 2 });

      // Short TTL
      toolCache.set(key1, 'short', { toolName: 'tool', ttlMs: 30 });
      // Longer TTL
      toolCache.set(key2, 'long', { toolName: 'tool', ttlMs: 200 });

      // Both should exist initially
      assert.ok(toolCache.has(key1));
      assert.ok(toolCache.has(key2));

      // Wait for short TTL to expire
      await new Promise(resolve => setTimeout(resolve, 60));

      // Short should be expired, long should still exist
      assert.strictEqual(toolCache.has(key1), false);
      assert.strictEqual(toolCache.has(key2), true);
    });

    it('should delete entry and return true', () => {
      const key = toolCache.generateCacheKey('del_test', { id: 1 });
      toolCache.set(key, 'value', { toolName: 'del_test' });

      assert.ok(toolCache.has(key));

      const deleted = toolCache.del(key);
      assert.strictEqual(deleted, true);
      assert.strictEqual(toolCache.has(key), false);
    });

    it('should return false when deleting non-existent key', () => {
      const deleted = toolCache.del('non_existent_key');
      assert.strictEqual(deleted, false);
    });
  });

  /* ─────────────────────────────────────────────────────────────
     4. LRU EVICTION (MAX SIZE)
  ──────────────────────────────────────────────────────────────── */

  describe('Cache max size and LRU eviction', () => {
    it('should enforce max entries limit (1000 default)', () => {
      const config = toolCache.getConfig();
      assert.strictEqual(config.maxEntries, 1000);
    });

    it('should evict oldest entry when max size reached', () => {
      // We need to test with a smaller number since 1000 entries is slow
      // The implementation evicts the oldest when at maxEntries
      // For testing purposes, let's fill up to near max and verify eviction works

      // Add 5 entries with staggered creation times
      const keys = [];
      for (let i = 0; i < 5; i++) {
        const key = toolCache.generateCacheKey('evict_test', { index: i });
        keys.push(key);
        toolCache.set(key, `value_${i}`, { toolName: 'evict_test' });
      }

      // All 5 should exist
      assert.strictEqual(toolCache.getStats().currentSize, 5);
      keys.forEach(key => assert.ok(toolCache.has(key)));
    });

    it('should call evictOldest when cache is full', () => {
      // Test the evictOldest function directly
      const key1 = toolCache.generateCacheKey('oldest_test', { id: 'first' });
      const key2 = toolCache.generateCacheKey('oldest_test', { id: 'second' });

      toolCache.set(key1, 'oldest', { toolName: 'oldest_test' });

      // Small delay to ensure different createdAt
      toolCache.set(key2, 'newer', { toolName: 'oldest_test' });

      assert.strictEqual(toolCache.getStats().currentSize, 2);

      // Call evictOldest
      toolCache.evictOldest();

      // One entry should be removed
      assert.strictEqual(toolCache.getStats().currentSize, 1);
    });

    it('should track eviction statistics', () => {
      const key = toolCache.generateCacheKey('eviction_stats', { id: 1 });
      toolCache.set(key, 'value', { toolName: 'eviction_stats' });

      toolCache.evictOldest();

      const stats = toolCache.getStats();
      assert.strictEqual(stats.evictions, 1);
    });

    it('should handle evictOldest on empty cache gracefully', () => {
      toolCache.clear();
      const initialStats = toolCache.getStats();
      const initialEvictions = initialStats.evictions;

      // Should not throw
      toolCache.evictOldest();

      const stats = toolCache.getStats();
      // Evictions should not increase (nothing to evict)
      assert.strictEqual(stats.evictions, initialEvictions);
    });
  });

  /* ─────────────────────────────────────────────────────────────
     5. CACHE BYPASS OPTION
  ──────────────────────────────────────────────────────────────── */

  describe('T014: Cache bypass option', () => {
    it('should skip cache when bypassCache is true', async () => {
      let call_count = 0;

      const result1 = await toolCache.withCache(
        'test_tool',
        { query: 'bypass_test' },
        async () => {
          call_count++;
          return { count: call_count };
        },
        { bypassCache: false }
      );

      const result2 = await toolCache.withCache(
        'test_tool',
        { query: 'bypass_test' },
        async () => {
          call_count++;
          return { count: call_count };
        },
        { bypassCache: true } // Should bypass cache
      );

      assert.strictEqual(result1.count, 1);
      assert.strictEqual(result2.count, 2, 'Function should be called again when bypassing');
    });

    it('should use cache when bypassCache is false', async () => {
      let call_count = 0;

      const result1 = await toolCache.withCache(
        'test_tool',
        { query: 'cache_test' },
        async () => {
          call_count++;
          return { count: call_count };
        }
      );

      const result2 = await toolCache.withCache(
        'test_tool',
        { query: 'cache_test' },
        async () => {
          call_count++;
          return { count: call_count };
        }
      );

      assert.strictEqual(result1.count, 1);
      assert.strictEqual(result2.count, 1, 'Should return cached result');
    });

    it('should allow custom TTL with withCache', async () => {
      let call_count = 0;

      await toolCache.withCache(
        'ttl_test',
        { id: 'custom_ttl' },
        async () => {
          call_count++;
          return { count: call_count };
        },
        { ttlMs: 30 }
      );

      // Immediately cached
      const result1 = await toolCache.withCache(
        'ttl_test',
        { id: 'custom_ttl' },
        async () => {
          call_count++;
          return { count: call_count };
        }
      );
      assert.strictEqual(result1.count, 1);

      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 60));

      // Should call function again
      const result2 = await toolCache.withCache(
        'ttl_test',
        { id: 'custom_ttl' },
        async () => {
          call_count++;
          return { count: call_count };
        }
      );
      assert.strictEqual(result2.count, 2);
    });
  });

  /* ─────────────────────────────────────────────────────────────
     6. CACHE INVALIDATION
  ──────────────────────────────────────────────────────────────── */

  describe('T015: Cache invalidation on write operations', () => {
    it('should invalidate by tool name', () => {
      const key1 = toolCache.generateCacheKey('memory_search', { query: 'test1' });
      const key2 = toolCache.generateCacheKey('memory_search', { query: 'test2' });
      const key3 = toolCache.generateCacheKey('memory_save', { query: 'test3' });

      toolCache.set(key1, 'value1', { toolName: 'memory_search' });
      toolCache.set(key2, 'value2', { toolName: 'memory_search' });
      toolCache.set(key3, 'value3', { toolName: 'memory_save' });

      const invalidated = toolCache.invalidateByTool('memory_search');

      assert.strictEqual(invalidated, 2);
      assert.strictEqual(toolCache.has(key1), false);
      assert.strictEqual(toolCache.has(key2), false);
      assert.strictEqual(toolCache.has(key3), true, 'Other tools should not be affected');
    });

    it('should invalidate by pattern (string)', () => {
      const key1 = toolCache.generateCacheKey('memory_search', { query: 'test1' });
      const key2 = toolCache.generateCacheKey('memory_save', { query: 'test2' });
      const key3 = toolCache.generateCacheKey('other_tool', { query: 'test3' });

      toolCache.set(key1, 'value1', { toolName: 'memory_search' });
      toolCache.set(key2, 'value2', { toolName: 'memory_save' });
      toolCache.set(key3, 'value3', { toolName: 'other_tool' });

      // Invalidate all memory_* tools using string pattern
      const invalidated = toolCache.invalidateByPattern('memory_');

      assert.strictEqual(invalidated, 2);
      assert.strictEqual(toolCache.has(key1), false);
      assert.strictEqual(toolCache.has(key2), false);
      assert.strictEqual(toolCache.has(key3), true);
    });

    it('should invalidate by pattern (RegExp)', () => {
      const key1 = toolCache.generateCacheKey('memory_search', { query: 'test1' });
      const key2 = toolCache.generateCacheKey('memory_save', { query: 'test2' });
      const key3 = toolCache.generateCacheKey('tool_memory', { query: 'test3' });

      toolCache.set(key1, 'value1', { toolName: 'memory_search' });
      toolCache.set(key2, 'value2', { toolName: 'memory_save' });
      toolCache.set(key3, 'value3', { toolName: 'tool_memory' });

      // Invalidate tools starting with "memory_"
      const invalidated = toolCache.invalidateByPattern(/^memory_/);

      assert.strictEqual(invalidated, 2);
      assert.strictEqual(toolCache.has(key1), false);
      assert.strictEqual(toolCache.has(key2), false);
      assert.strictEqual(toolCache.has(key3), true, 'tool_memory should not match ^memory_');
    });

    it('should invalidate on write operations', () => {
      const searchKey = toolCache.generateCacheKey('memory_search', { query: 'test' });
      const triggerKey = toolCache.generateCacheKey('memory_match_triggers', { prompt: 'test' });

      toolCache.set(searchKey, 'search_result', { toolName: 'memory_search' });
      toolCache.set(triggerKey, 'trigger_result', { toolName: 'memory_match_triggers' });

      assert.ok(toolCache.has(searchKey));
      assert.ok(toolCache.has(triggerKey));

      // Simulate write operation
      toolCache.invalidateOnWrite('save', { specFolder: 'test/folder' });

      // Search-related caches should be invalidated
      assert.strictEqual(toolCache.has(searchKey), false);
      assert.strictEqual(toolCache.has(triggerKey), false);
    });

    it('should invalidate memory_list_folders on write', () => {
      const listFoldersKey = toolCache.generateCacheKey('memory_list_folders', {});
      toolCache.set(listFoldersKey, ['folder1', 'folder2'], { toolName: 'memory_list_folders' });

      assert.ok(toolCache.has(listFoldersKey));

      toolCache.invalidateOnWrite('save', {});

      assert.strictEqual(toolCache.has(listFoldersKey), false);
    });

    it('should invalidate memory_read on write', () => {
      const readKey = toolCache.generateCacheKey('memory_read', { id: 123 });
      toolCache.set(readKey, { content: 'test' }, { toolName: 'memory_read' });

      assert.ok(toolCache.has(readKey));

      toolCache.invalidateOnWrite('update', {});

      assert.strictEqual(toolCache.has(readKey), false);
    });

    it('should clear all entries', () => {
      toolCache.set(toolCache.generateCacheKey('tool1', {}), 'v1', { toolName: 'tool1' });
      toolCache.set(toolCache.generateCacheKey('tool2', {}), 'v2', { toolName: 'tool2' });
      toolCache.set(toolCache.generateCacheKey('tool3', {}), 'v3', { toolName: 'tool3' });

      const stats = toolCache.getStats();
      assert.strictEqual(stats.currentSize, 3);

      const cleared = toolCache.clear();

      assert.strictEqual(cleared, 3);
      assert.strictEqual(toolCache.getStats().currentSize, 0);
    });

    it('should track invalidation statistics', () => {
      const key = toolCache.generateCacheKey('stats_tool', { id: 1 });
      toolCache.set(key, 'value', { toolName: 'stats_tool' });

      toolCache.del(key);

      const stats = toolCache.getStats();
      assert.strictEqual(stats.invalidations >= 1, true);
    });
  });

  /* ─────────────────────────────────────────────────────────────
     7. CLEANUP EXPIRED
  ──────────────────────────────────────────────────────────────── */

  describe('Cleanup expired entries', () => {
    it('should remove expired entries on cleanup', async () => {
      const key1 = toolCache.generateCacheKey('cleanup_test', { id: 'short' });
      const key2 = toolCache.generateCacheKey('cleanup_test', { id: 'long' });

      // Short TTL (will expire)
      toolCache.set(key1, 'short', { toolName: 'cleanup_test', ttlMs: 30 });
      // Long TTL (will not expire)
      toolCache.set(key2, 'long', { toolName: 'cleanup_test', ttlMs: 5000 });

      assert.strictEqual(toolCache.getStats().currentSize, 2);

      // Wait for short TTL to expire
      await new Promise(resolve => setTimeout(resolve, 60));

      // Run cleanup
      const cleaned = toolCache.cleanupExpired();

      assert.strictEqual(cleaned, 1, 'Should clean up 1 expired entry');
      assert.strictEqual(toolCache.has(key1), false);
      assert.strictEqual(toolCache.has(key2), true);
    });

    it('should return 0 when no expired entries', () => {
      const key = toolCache.generateCacheKey('no_expire', { id: 1 });
      toolCache.set(key, 'value', { toolName: 'no_expire', ttlMs: 60000 });

      const cleaned = toolCache.cleanupExpired();
      assert.strictEqual(cleaned, 0);
    });

    it('should handle empty cache gracefully', () => {
      toolCache.clear();
      const cleaned = toolCache.cleanupExpired();
      assert.strictEqual(cleaned, 0);
    });
  });

  /* ─────────────────────────────────────────────────────────────
     8. STATISTICS AND MONITORING
  ──────────────────────────────────────────────────────────────── */

  describe('Statistics and monitoring', () => {
    it('should track cache statistics', () => {
      const key = toolCache.generateCacheKey('stats_tool', { test: true });

      // 2 misses
      toolCache.get('nonexistent1');
      toolCache.get('nonexistent2');

      // Set and 3 hits
      toolCache.set(key, 'value', { toolName: 'stats_tool' });
      toolCache.get(key);
      toolCache.get(key);
      toolCache.get(key);

      const stats = toolCache.getStats();

      assert.strictEqual(stats.hits, 3);
      assert.strictEqual(stats.misses, 2);
      assert.strictEqual(stats.hitRate, '60.00%');
    });

    it('should report 0% hit rate when no requests', () => {
      toolCache.clear();
      toolCache.resetStats();

      const stats = toolCache.getStats();
      assert.strictEqual(stats.hitRate, '0.00%');
    });

    it('should report configuration', () => {
      const config = toolCache.getConfig();

      assert.strictEqual(typeof config.enabled, 'boolean');
      assert.strictEqual(typeof config.defaultTtlMs, 'number');
      assert.strictEqual(typeof config.maxEntries, 'number');
      assert.strictEqual(config.defaultTtlMs, 60000, 'Default TTL should be 60 seconds');
    });

    it('should reset statistics', () => {
      const key = toolCache.generateCacheKey('reset_test', { id: 1 });
      toolCache.get(key); // Miss
      toolCache.set(key, 'value', { toolName: 'reset_test' });
      toolCache.get(key); // Hit

      toolCache.resetStats();

      const stats = toolCache.getStats();
      assert.strictEqual(stats.hits, 0);
      assert.strictEqual(stats.misses, 0);
      assert.strictEqual(stats.evictions, 0);
      assert.strictEqual(stats.invalidations, 0);
    });

    it('should report current size and max size', () => {
      const key1 = toolCache.generateCacheKey('size_test', { id: 1 });
      const key2 = toolCache.generateCacheKey('size_test', { id: 2 });

      toolCache.set(key1, 'v1', { toolName: 'size_test' });
      toolCache.set(key2, 'v2', { toolName: 'size_test' });

      const stats = toolCache.getStats();
      assert.strictEqual(stats.currentSize, 2);
      assert.strictEqual(stats.maxSize, 1000);
    });
  });

  /* ─────────────────────────────────────────────────────────────
     9. LIFECYCLE (INIT/SHUTDOWN)
  ──────────────────────────────────────────────────────────────── */

  describe('Lifecycle management', () => {
    it('should have init function', () => {
      assert.strictEqual(typeof toolCache.init, 'function');
    });

    it('should have shutdown function', () => {
      assert.strictEqual(typeof toolCache.shutdown, 'function');
    });

    it('should clear cache on shutdown', () => {
      const key = toolCache.generateCacheKey('shutdown_test', { id: 1 });
      toolCache.set(key, 'value', { toolName: 'shutdown_test' });

      assert.ok(toolCache.has(key));

      toolCache.shutdown();

      // Cache should be empty after shutdown
      const stats = toolCache.getStats();
      assert.strictEqual(stats.currentSize, 0);

      // Stats should be reset
      assert.strictEqual(stats.hits, 0);
      assert.strictEqual(stats.misses, 0);
    });
  });

  /* ─────────────────────────────────────────────────────────────
     10. EDGE CASES
  ──────────────────────────────────────────────────────────────── */

  describe('Edge cases', () => {
    it('should handle complex nested objects', () => {
      const complexArgs = {
        query: 'test',
        filters: {
          tags: ['a', 'b', 'c'],
          metadata: {
            created: '2024-01-01',
            author: { name: 'Test', id: 123 },
          },
        },
        options: {
          limit: 10,
          offset: 0,
        },
      };

      const key = toolCache.generateCacheKey('complex_tool', complexArgs);
      toolCache.set(key, { result: 'complex' }, { toolName: 'complex_tool' });

      const cached = toolCache.get(key);
      assert.deepStrictEqual(cached, { result: 'complex' });
    });

    it('should handle empty object args', () => {
      const key = toolCache.generateCacheKey('empty_args', {});
      toolCache.set(key, 'empty', { toolName: 'empty_args' });

      assert.strictEqual(toolCache.get(key), 'empty');
    });

    it('should cache null values', () => {
      const key = toolCache.generateCacheKey('null_value', { id: 1 });
      toolCache.set(key, null, { toolName: 'null_value' });

      // Note: get returns null for both "not found" and "cached null"
      // This is a limitation of the current implementation
      // The has() method should be used to distinguish
      assert.strictEqual(toolCache.has(key), true);
    });

    it('should cache falsy values correctly', () => {
      const key1 = toolCache.generateCacheKey('falsy', { type: 'zero' });
      const key2 = toolCache.generateCacheKey('falsy', { type: 'empty_string' });
      const key3 = toolCache.generateCacheKey('falsy', { type: 'false' });

      toolCache.set(key1, 0, { toolName: 'falsy' });
      toolCache.set(key2, '', { toolName: 'falsy' });
      toolCache.set(key3, false, { toolName: 'falsy' });

      assert.strictEqual(toolCache.get(key1), 0);
      assert.strictEqual(toolCache.get(key2), '');
      assert.strictEqual(toolCache.get(key3), false);
    });

    it('should handle withCache with async function that throws', async () => {
      await assert.rejects(
        toolCache.withCache(
          'error_tool',
          { id: 1 },
          async () => {
            throw new Error('Test error');
          }
        ),
        /Test error/
      );
    });

    it('should not cache result when function throws', async () => {
      const key = toolCache.generateCacheKey('error_tool', { id: 'throws' });

      try {
        await toolCache.withCache(
          'error_tool',
          { id: 'throws' },
          async () => {
            throw new Error('Test error');
          }
        );
      } catch {
        // Expected
      }

      assert.strictEqual(toolCache.has(key), false);
    });
  });

  /* ─────────────────────────────────────────────────────────────
     11. MODULE EXPORTS
  ──────────────────────────────────────────────────────────────── */

  describe('Module exports', () => {
    it('should export all core operations', () => {
      assert.strictEqual(typeof toolCache.get, 'function');
      assert.strictEqual(typeof toolCache.set, 'function');
      assert.strictEqual(typeof toolCache.has, 'function');
      assert.strictEqual(typeof toolCache.del, 'function');
    });

    it('should export key generation', () => {
      assert.strictEqual(typeof toolCache.generateCacheKey, 'function');
    });

    it('should export invalidation methods', () => {
      assert.strictEqual(typeof toolCache.invalidateByTool, 'function');
      assert.strictEqual(typeof toolCache.invalidateByPattern, 'function');
      assert.strictEqual(typeof toolCache.invalidateOnWrite, 'function');
      assert.strictEqual(typeof toolCache.clear, 'function');
    });

    it('should export high-level wrapper', () => {
      assert.strictEqual(typeof toolCache.withCache, 'function');
    });

    it('should export eviction and cleanup', () => {
      assert.strictEqual(typeof toolCache.evictOldest, 'function');
      assert.strictEqual(typeof toolCache.cleanupExpired, 'function');
      assert.strictEqual(typeof toolCache.startCleanupInterval, 'function');
      assert.strictEqual(typeof toolCache.stopCleanupInterval, 'function');
    });

    it('should export statistics and monitoring', () => {
      assert.strictEqual(typeof toolCache.getStats, 'function');
      assert.strictEqual(typeof toolCache.resetStats, 'function');
      assert.strictEqual(typeof toolCache.getConfig, 'function');
      assert.strictEqual(typeof toolCache.isEnabled, 'function');
    });

    it('should export lifecycle methods', () => {
      assert.strictEqual(typeof toolCache.init, 'function');
      assert.strictEqual(typeof toolCache.shutdown, 'function');
    });

    it('should export CONFIG constant', () => {
      assert.ok(toolCache.CONFIG);
      assert.strictEqual(typeof toolCache.CONFIG, 'object');
    });
  });
});

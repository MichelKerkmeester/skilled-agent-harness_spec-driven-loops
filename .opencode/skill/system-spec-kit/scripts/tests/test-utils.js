// ───────────────────────────────────────────────────────────────
// TEST: UTILITIES
// ───────────────────────────────────────────────────────────────

(() => {
  'use strict';

  const path = require('path');
  const fs = require('fs');

  /* ─────────────────────────────────────────────────────────────
     1. CONFIGURATION
  ──────────────────────────────────────────────────────────────── */

  const FIXTURES_DIR = path.join(__dirname, '..', 'test-fixtures');
  const MEMORY_DIR = path.join(__dirname, '..', 'memory');
  const DATABASE_DIR = path.join(__dirname, '..', '..', 'mcp_server', 'database');

  /* ─────────────────────────────────────────────────────────────
     2. TEST DATA CREATION
  ──────────────────────────────────────────────────────────────── */

  /**
   * Create a test memory object with defaults
   * @param {Object} overrides - Properties to override defaults
   * @returns {Object} Memory object
   */
  function create_test_memory(overrides = {}) {
    const defaults = {
      id: Date.now(),
      content: 'Test memory content',
      summary: 'Test summary',
      importance: 3,
      stability: 1.0,
      difficulty: 5.0,
      retrievability: 1.0,
      last_review: new Date().toISOString(),
      next_review: new Date(Date.now() + 86400000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      spec_folder: 'test-spec',
      anchor: null,
      embedding: null
    };

    return { ...defaults, ...overrides };
  }

  /**
   * Create a mock database for testing
   * @returns {Object} Mock database interface
   */
  function mock_database() {
    const memories = new Map();
    let next_id = 1;

    return {
      memories,

      /**
       * Insert a memory
       * @param {Object} memory - Memory to insert
       * @returns {number} Inserted memory ID
       */
      insert(memory) {
        const id = memory.id || next_id++;
        memories.set(id, { ...memory, id });
        return id;
      },

      /**
       * Get a memory by ID
       * @param {number} id - Memory ID
       * @returns {Object|null} Memory or null
       */
      get(id) {
        return memories.get(id) || null;
      },

      /**
       * Update a memory
       * @param {number} id - Memory ID
       * @param {Object} updates - Properties to update
       * @returns {boolean} Whether update succeeded
       */
      update(id, updates) {
        const memory = memories.get(id);
        if (!memory) return false;
        memories.set(id, { ...memory, ...updates, updated_at: new Date().toISOString() });
        return true;
      },

      /**
       * Delete a memory
       * @param {number} id - Memory ID
       * @returns {boolean} Whether delete succeeded
       */
      delete(id) {
        return memories.delete(id);
      },

      /**
       * Query memories
       * @param {Function} predicate - Filter function
       * @returns {Array} Matching memories
       */
      query(predicate) {
        return Array.from(memories.values()).filter(predicate);
      },

      /**
       * Get all memories
       * @returns {Array} All memories
       */
      all() {
        return Array.from(memories.values());
      },

      /**
       * Clear all memories
       */
      clear() {
        memories.clear();
        next_id = 1;
      },

      /**
       * Get count of memories
       * @returns {number} Memory count
       */
      count() {
        return memories.size;
      }
    };
  }

  /**
   * Mock embedding function for testing
   * Generates deterministic pseudo-embeddings based on content hash
   * @param {string} text - Text to embed
   * @returns {Array} 384-dimensional embedding vector
   */
  function mock_embedding(text) {
    const DIMENSIONS = 384;
    const embedding = new Array(DIMENSIONS);

    // Simple hash-based pseudo-embedding
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = ((hash << 5) - hash) + text.charCodeAt(i);
      hash = hash & hash; // Convert to 32bit integer
    }

    // Generate deterministic values
    for (let i = 0; i < DIMENSIONS; i++) {
      const seed = (hash * (i + 1)) % 1000000;
      embedding[i] = (Math.sin(seed) + 1) / 2; // Normalize to [0, 1]
    }

    // Normalize to unit vector
    const magnitude = Math.sqrt(embedding.reduce((sum, v) => sum + v * v, 0));
    return embedding.map(v => v / magnitude);
  }

  /* ─────────────────────────────────────────────────────────────
     3. ASSERTIONS
  ──────────────────────────────────────────────────────────────── */

  /**
   * Assert a condition is true
   * @param {boolean} condition - Condition to check
   * @param {string} message - Error message if condition is false
   * @throws {Error} If condition is false
   */
  function assert(condition, message = 'Assertion failed') {
    if (!condition) {
      throw new Error(message);
    }
  }

  /**
   * Assert two numbers are approximately equal
   * @param {number} actual - Actual value
   * @param {number} expected - Expected value
   * @param {number} epsilon - Tolerance (default 0.001)
   * @throws {Error} If values differ by more than epsilon
   */
  function assert_approx_equal(actual, expected, epsilon = 0.001) {
    const diff = Math.abs(actual - expected);
    if (diff > epsilon) {
      throw new Error(
        `Values not approximately equal: ` +
        `actual=${actual}, expected=${expected}, diff=${diff}, epsilon=${epsilon}`
      );
    }
  }

  /**
   * Assert a value is within a range
   * @param {number} value - Value to check
   * @param {number} min - Minimum expected value
   * @param {number} max - Maximum expected value
   * @throws {Error} If value is outside range
   */
  function assert_in_range(value, min, max) {
    if (value < min || value > max) {
      throw new Error(
        `Value ${value} is outside expected range [${min}, ${max}]`
      );
    }
  }

  /**
   * Assert two arrays are equal
   * @param {Array} actual - Actual array
   * @param {Array} expected - Expected array
   * @throws {Error} If arrays differ
   */
  function assert_array_equal(actual, expected) {
    if (actual.length !== expected.length) {
      throw new Error(
        `Array lengths differ: actual=${actual.length}, expected=${expected.length}`
      );
    }

    for (let i = 0; i < actual.length; i++) {
      if (actual[i] !== expected[i]) {
        throw new Error(
          `Arrays differ at index ${i}: actual=${actual[i]}, expected=${expected[i]}`
        );
      }
    }
  }

  /**
   * Assert a function throws an error
   * @param {Function} fn - Function to call
   * @param {string|RegExp} expected_message - Expected error message pattern
   * @throws {Error} If function doesn't throw or message doesn't match
   */
  function assert_throws(fn, expected_message = null) {
    let threw = false;
    let error = null;

    try {
      fn();
    } catch (e) {
      threw = true;
      error = e;
    }

    if (!threw) {
      throw new Error('Expected function to throw, but it did not');
    }

    if (expected_message) {
      const matches = expected_message instanceof RegExp
        ? expected_message.test(error.message)
        : error.message.includes(expected_message);

      if (!matches) {
        throw new Error(
          `Error message "${error.message}" does not match expected "${expected_message}"`
        );
      }
    }
  }

  /* ─────────────────────────────────────────────────────────────
     4. TEST INFRASTRUCTURE
  ──────────────────────────────────────────────────────────────── */

  /**
   * Create a test runner for a module
   * @param {string} module_name - Name of the module being tested
   * @returns {Object} Test runner interface
   */
  function create_test_runner(module_name) {
    const tests = [];
    let passed = 0;
    let failed = 0;

    return {
      /**
       * Register a test
       * @param {string} name - Test name
       * @param {Function} fn - Test function
       */
      test(name, fn) {
        tests.push({ name, fn });
      },

      /**
       * Run all registered tests
       */
      async run() {
        console.log(`\n=== Testing: ${module_name} ===\n`);

        for (const { name, fn } of tests) {
          try {
            await fn();
            passed++;
            console.log(`  ✓ ${name}`);
          } catch (error) {
            failed++;
            console.log(`  ✗ ${name}`);
            console.log(`    Error: ${error.message}`);
          }
        }

        console.log(`\n${module_name}: ${passed} passed, ${failed} failed\n`);

        return { passed, failed, total: tests.length };
      }
    };
  }

  /**
   * Load a fixture file
   * @param {string} filename - Fixture filename
   * @returns {Object} Parsed fixture data
   */
  function load_fixture(filename) {
    const filepath = path.join(FIXTURES_DIR, filename);
    const content = fs.readFileSync(filepath, 'utf8');
    return JSON.parse(content);
  }

  /**
   * Create a temporary test directory
   * @param {string} prefix - Directory name prefix
   * @returns {string} Path to temporary directory
   */
  function create_temp_dir(prefix = 'test') {
    const tmp_dir = path.join(FIXTURES_DIR, `${prefix}-${Date.now()}`);
    fs.mkdirSync(tmp_dir, { recursive: true });
    return tmp_dir;
  }

  /**
   * Clean up a temporary directory
   * @param {string} dir_path - Directory to remove
   */
  function cleanup_temp_dir(dir_path) {
    if (fs.existsSync(dir_path)) {
      fs.rmSync(dir_path, { recursive: true, force: true });
    }
  }

  /* ─────────────────────────────────────────────────────────────
     5. UTILITIES
  ──────────────────────────────────────────────────────────────── */

  /**
   * Wait for a specified duration
   * @param {number} ms - Milliseconds to wait
   * @returns {Promise} Resolves after duration
   */
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Generate a random string
   * @param {number} length - String length
   * @returns {string} Random string
   */
  function random_string(length = 8) {
    const CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
    }
    return result;
  }

  /**
   * Calculate cosine similarity between two vectors
   * @param {Array} a - First vector
   * @param {Array} b - Second vector
   * @returns {number} Cosine similarity [-1, 1]
   */
  function cosine_similarity(a, b) {
    if (a.length !== b.length) {
      throw new Error('Vectors must have same length');
    }

    let dot_product = 0;
    let magnitude_a = 0;
    let magnitude_b = 0;

    for (let i = 0; i < a.length; i++) {
      dot_product += a[i] * b[i];
      magnitude_a += a[i] * a[i];
      magnitude_b += b[i] * b[i];
    }

    magnitude_a = Math.sqrt(magnitude_a);
    magnitude_b = Math.sqrt(magnitude_b);

    if (magnitude_a === 0 || magnitude_b === 0) return 0;

    return dot_product / (magnitude_a * magnitude_b);
  }

  /* ─────────────────────────────────────────────────────────────
     6. EXPORTS
  ──────────────────────────────────────────────────────────────── */

  module.exports = {
    // Paths
    FIXTURES_DIR,
    MEMORY_DIR,
    DATABASE_DIR,

    // Test data creation
    create_test_memory,
    mock_database,
    mock_embedding,

    // Assertions
    assert,
    assert_approx_equal,
    assert_in_range,
    assert_array_equal,
    assert_throws,

    // Test infrastructure
    create_test_runner,
    load_fixture,
    create_temp_dir,
    cleanup_temp_dir,

    // Utilities
    sleep,
    random_string,
    cosine_similarity
  };
})();

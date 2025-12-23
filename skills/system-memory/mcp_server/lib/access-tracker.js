/**
 * Access Tracker Module - Frequency-based importance boosting
 *
 * Tracks memory access patterns with batched updates to minimize I/O.
 * Uses an in-memory accumulator that flushes to the database after
 * reaching a threshold, reducing write operations while maintaining
 * accurate access statistics.
 *
 * @module lib/access-tracker
 * @version 11.0.0
 */

'use strict';

// =============================================================================
// Constants
// =============================================================================

/**
 * Accumulator threshold - batch updates to reduce I/O
 * Flushes after 5 accesses (0.1 * 5 = 0.5)
 * @constant {number}
 */
const ACCUMULATOR_THRESHOLD = 0.5;

/**
 * Value to increment accumulator by on each access
 * @constant {number}
 */
const INCREMENT_VALUE = 0.1;

// =============================================================================
// State
// =============================================================================

/**
 * In-memory accumulator for batching access counts
 * Maps memory ID to accumulated access value
 * @type {Map<number, number>}
 */
const accessAccumulator = new Map();

/**
 * Reference to better-sqlite3 database instance
 * Set via init()
 * @type {Object|null}
 */
let db = null;

/**
 * Cached prepared statements for performance (P1 optimization)
 * @type {Object}
 */
let stmtCache = {
  updateAccess: null,
  updateAccessBatch: null
};

// =============================================================================
// Initialization
// =============================================================================

/**
 * Initialize access tracker with database reference
 * Must be called before any tracking operations
 *
 * @param {Object} database - better-sqlite3 instance
 * @throws {Error} If database is null/undefined
 *
 * @example
 * const Database = require('better-sqlite3');
 * const accessTracker = require('./lib/access-tracker');
 *
 * const db = new Database('memories.db');
 * accessTracker.init(db);
 */
function init(database) {
  if (!database) {
    throw new Error('Database instance is required for initialization');
  }
  db = database;

  // Pre-compile prepared statements for performance
  stmtCache.updateAccess = db.prepare(`
    UPDATE memory_index
    SET access_count = access_count + 1, last_accessed = ?
    WHERE id = ?
  `);
  stmtCache.updateAccessBatch = db.prepare(`
    UPDATE memory_index
    SET access_count = access_count + ?, last_accessed = ?
    WHERE id = ?
  `);
}

// =============================================================================
// Access Tracking
// =============================================================================

/**
 * Track a memory access (batched)
 *
 * Increments the in-memory accumulator for the given memory ID.
 * When the accumulator reaches the threshold, it flushes to the database
 * and resets. This batching reduces I/O while still tracking access patterns.
 *
 * @param {number} id - Memory row ID to track
 * @throws {Error} If access tracker not initialized via init()
 *
 * @example
 * // Track a single memory access
 * accessTracker.trackAccess(42);
 *
 * // After 5 accesses (0.1 * 5 = 0.5 threshold), database is updated
 */
function trackAccess(id) {
  if (!db) {
    throw new Error('Access tracker not initialized - call init(db) first');
  }

  const current = accessAccumulator.get(id) || 0;
  const newValue = current + INCREMENT_VALUE;

  if (newValue >= ACCUMULATOR_THRESHOLD) {
    // Flush to database - update access_count and last_accessed timestamp
    // Use cached prepared statement for performance
    stmtCache.updateAccess.run(Date.now(), id);

    // Clear accumulator for this ID
    accessAccumulator.delete(id);
  } else {
    // Store updated value in accumulator
    accessAccumulator.set(id, newValue);
  }
}

/**
 * Track multiple accesses (for search results)
 *
 * Convenience method to track accesses for an array of memory IDs,
 * typically used after a search returns multiple results.
 *
 * @param {Array<number>} ids - Array of memory IDs to track
 *
 * @example
 * // After search returns results
 * const searchResults = [{ id: 1 }, { id: 5 }, { id: 12 }];
 * accessTracker.trackMultipleAccesses(searchResults.map(r => r.id));
 */
function trackMultipleAccesses(ids) {
  if (!Array.isArray(ids)) {
    return;
  }

  for (const id of ids) {
    if (typeof id === 'number' && Number.isInteger(id)) {
      trackAccess(id);
    }
  }
}

// =============================================================================
// Flush Operations
// =============================================================================

/**
 * Flush all accumulated access counts to database
 *
 * Writes all pending access counts to the database in a single transaction.
 * Call this on shutdown, before closing the database, or periodically
 * to ensure data integrity.
 *
 * @example
 * // On application shutdown
 * accessTracker.flushAccessCounts();
 * db.close();
 */
function flushAccessCounts() {
  if (!db || accessAccumulator.size === 0) {
    return;
  }

  const tx = db.transaction(() => {
    const now = Date.now();

    for (const [id, count] of accessAccumulator.entries()) {
      if (count > 0) {
        // Convert accumulated value back to access count
        // e.g., 0.3 / 0.1 = 3 accesses, ceil handles partial values
        const incrementBy = Math.ceil(count / INCREMENT_VALUE);

        // Use cached prepared statement for performance
        stmtCache.updateAccessBatch.run(incrementBy, now, id);
      }
    }
  });

  // Execute transaction
  tx();

  // Clear the accumulator
  accessAccumulator.clear();
}

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Get current accumulator state (for debugging)
 *
 * Returns a snapshot of the current in-memory accumulator state,
 * useful for debugging and testing.
 *
 * @returns {Object} Map entries as plain object { id: accumulatedValue }
 *
 * @example
 * // Check pending accesses
 * console.log(accessTracker.getAccumulatorState());
 * // Output: { 42: 0.3, 17: 0.1 }
 */
function getAccumulatorState() {
  return Object.fromEntries(accessAccumulator);
}

/**
 * Calculate popularity score from access count (logarithmic)
 *
 * Converts raw access count to a normalized 0-1 score using
 * logarithmic scaling. This prevents frequently accessed memories
 * from dominating while still giving them a boost.
 *
 * Scale: log10(accessCount + 1) / 3
 * - 1 access = 0.1
 * - 10 accesses = 0.33
 * - 100 accesses = 0.67
 * - 1000+ accesses = 1.0 (capped)
 *
 * @param {number} accessCount - Raw access count from database
 * @returns {number} Normalized score between 0 and 1
 *
 * @example
 * const score = accessTracker.calculatePopularityScore(50);
 * // Returns ~0.57
 *
 * const maxScore = accessTracker.calculatePopularityScore(10000);
 * // Returns 1.0 (capped)
 */
function calculatePopularityScore(accessCount) {
  // Log scale capped at 3 orders of magnitude (1000 accesses = 1.0)
  // Adding 1 to avoid log(0) = -Infinity
  return Math.min(1, Math.log10((accessCount || 0) + 1) / 3);
}

/**
 * Reset the tracker state (for testing)
 *
 * Clears the accumulator without flushing to database.
 * Primarily used in test environments.
 */
function reset() {
  accessAccumulator.clear();
  db = null;
  stmtCache = { updateAccess: null, updateAccessBatch: null };
}

// =============================================================================
// Process Exit Handler
// =============================================================================

/**
 * Cleanup on process exit
 * Attempts to flush any pending access counts to database
 */
process.on('exit', () => {
  try {
    flushAccessCounts();
  } catch (e) {
    console.error('[access-tracker] Error flushing on exit:', e.message);
  }
});

// Handle other termination signals
process.on('SIGINT', () => {
  try {
    flushAccessCounts();
  } catch (e) {
    // Silently fail during signal handling
  }
});

process.on('SIGTERM', () => {
  try {
    flushAccessCounts();
  } catch (e) {
    // Silently fail during signal handling
  }
});

// =============================================================================
// Module Exports
// =============================================================================

module.exports = {
  // Initialization
  init,

  // Core tracking
  trackAccess,
  trackMultipleAccesses,

  // Flush operations
  flushAccessCounts,

  // Utilities
  getAccumulatorState,
  calculatePopularityScore,
  reset,

  // Constants (exported for testing)
  ACCUMULATOR_THRESHOLD,
  INCREMENT_VALUE
};

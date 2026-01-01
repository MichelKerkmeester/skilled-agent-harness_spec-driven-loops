// ───────────────────────────────────────────────────────────────
// ACCESS-TRACKER: Memory access pattern tracking with batched I/O
// ───────────────────────────────────────────────────────────────
'use strict';

// Tracks memory access patterns with batched updates to minimize I/O.
// Uses an in-memory accumulator that flushes after reaching threshold.

/* ───────────────────────────────────────────────────────────────
   1. CONSTANTS
   ─────────────────────────────────────────────────────────────── */

// Flushes after 5 accesses (0.1 * 5 = 0.5)
const ACCUMULATOR_THRESHOLD = 0.5;
const INCREMENT_VALUE = 0.1;

/* ───────────────────────────────────────────────────────────────
   2. STATE
   ─────────────────────────────────────────────────────────────── */

const access_accumulator = new Map();
let db = null;
let stmt_cache = { update_access: null, update_access_batch: null };

/* ───────────────────────────────────────────────────────────────
   3. INITIALIZATION
   ─────────────────────────────────────────────────────────────── */

function init(database) {
  if (!database) {
    throw new Error('Database instance is required for initialization');
  }
  db = database;

  stmt_cache.update_access = db.prepare(`
    UPDATE memory_index
    SET access_count = access_count + 1, last_accessed = ?
    WHERE id = ?
  `);
  stmt_cache.update_access_batch = db.prepare(`
    UPDATE memory_index
    SET access_count = access_count + ?, last_accessed = ?
    WHERE id = ?
  `);
}

/* ───────────────────────────────────────────────────────────────
   4. ACCESS TRACKING
   ─────────────────────────────────────────────────────────────── */

function track_access(id) {
  if (!db) {
    throw new Error('Access tracker not initialized - call init(db) first');
  }

  const current = access_accumulator.get(id) || 0;
  const new_value = current + INCREMENT_VALUE;

  if (new_value >= ACCUMULATOR_THRESHOLD) {
    stmt_cache.update_access.run(Date.now(), id);
    access_accumulator.delete(id);
  } else {
    access_accumulator.set(id, new_value);
  }
}

function track_multiple_accesses(ids) {
  if (!Array.isArray(ids)) return;

  for (const id of ids) {
    if (typeof id === 'number' && Number.isInteger(id)) {
      track_access(id);
    }
  }
}

/* ───────────────────────────────────────────────────────────────
   5. FLUSH OPERATIONS
   ─────────────────────────────────────────────────────────────── */

function flush_access_counts() {
  if (!db || access_accumulator.size === 0) return;

  const tx = db.transaction(() => {
    const now = Date.now();

    for (const [id, count] of access_accumulator.entries()) {
      if (count > 0) {
        const increment_by = Math.ceil(count / INCREMENT_VALUE);
        stmt_cache.update_access_batch.run(increment_by, now, id);
      }
    }
  });

  tx();
  access_accumulator.clear();
}

/* ───────────────────────────────────────────────────────────────
   6. UTILITY FUNCTIONS
   ─────────────────────────────────────────────────────────────── */

function get_accumulator_state() {
  return Object.fromEntries(access_accumulator);
}

// Logarithmic scale: log10(count + 1) / 3
// 1 access = 0.1, 10 = 0.33, 100 = 0.67, 1000+ = 1.0 (capped)
function calculate_popularity_score(access_count) {
  return Math.min(1, Math.log10((access_count || 0) + 1) / 3);
}

function reset() {
  access_accumulator.clear();
  db = null;
  stmt_cache = { update_access: null, update_access_batch: null };
}

/* ───────────────────────────────────────────────────────────────
   7. PROCESS EXIT HANDLERS
   ─────────────────────────────────────────────────────────────── */

process.on('exit', () => {
  try { flush_access_counts(); } catch (e) {
    console.error('[access-tracker] Error flushing on exit:', e.message);
  }
});

process.on('SIGINT', () => {
  try { flush_access_counts(); } catch (e) { /* silent */ }
});

process.on('SIGTERM', () => {
  try { flush_access_counts(); } catch (e) { /* silent */ }
});

/* ───────────────────────────────────────────────────────────────
   8. EXPORTS
   ─────────────────────────────────────────────────────────────── */

module.exports = {
  init,
  track_access,
  track_multiple_accesses,
  flush_access_counts,
  get_accumulator_state,
  calculate_popularity_score,
  reset,
  ACCUMULATOR_THRESHOLD,
  INCREMENT_VALUE,
};

// ───────────────────────────────────────────────────────────────
// COGNITIVE: ATTENTION DECAY
// ───────────────────────────────────────────────────────────────
'use strict';

/**
 * Attention Decay Module
 * Manages memory attention scores using FSRS power-law decay
 */

/* ─────────────────────────────────────────────────────────────
   0. DEPENDENCIES
──────────────────────────────────────────────────────────────── */

const fsrsScheduler = require('./fsrs-scheduler');

/* ─────────────────────────────────────────────────────────────
   1. CONFIGURATION
──────────────────────────────────────────────────────────────── */

// Decay rates aligned with importance-tiers.js (ADR-061 Decision 1)
// Tiers with decay: false get rate 1.0 (no decay)
// Tiers with decay: true get reduced rates
const DECAY_CONFIG = {
  defaultDecayRate: 0.80,
  decayRateByTier: {
    constitutional: 1.0,  // decay: false - no decay
    critical: 1.0,        // decay: false - no decay
    important: 1.0,       // decay: false - no decay
    normal: 0.80,         // decay: true  - standard decay
    temporary: 0.60,      // decay: true  - fast decay
    deprecated: 1.0,      // decay: false - no decay (frozen state)
  },
  minScoreThreshold: 0.001, // Scores below this are treated as 0
};

/* ─────────────────────────────────────────────────────────────
   2. STATE
──────────────────────────────────────────────────────────────── */

// Database reference (initialized via init())
let db = null;

/* ─────────────────────────────────────────────────────────────
   3. INITIALIZATION
──────────────────────────────────────────────────────────────── */

/**
 * Initialize the attention decay module with a database reference
 * @param {Object} database - better-sqlite3 database instance
 */
function init(database) {
  if (!database) {
    throw new Error('[attention-decay] Database reference is required');
  }
  db = database;
}

/**
 * Get the current database reference (for testing)
 * @returns {Object|null} Database instance or null if not initialized
 */
function get_db() {
  return db;
}

/* ─────────────────────────────────────────────────────────────
   4. DECAY RATE FUNCTIONS
──────────────────────────────────────────────────────────────── */

/**
 * Get decay rate for a given importance tier
 * @param {string} importanceTier - Tier name (constitutional, critical, etc.)
 * @returns {number} Decay rate (0.0 to 1.0)
 */
function get_decay_rate(importanceTier) {
  if (!importanceTier || typeof importanceTier !== 'string') {
    return DECAY_CONFIG.defaultDecayRate;
  }

  const tier_lower = importanceTier.toLowerCase();
  const rate = DECAY_CONFIG.decayRateByTier[tier_lower];

  if (rate === undefined) {
    console.warn(`[attention-decay] Unknown tier "${importanceTier}", using default rate`);
    return DECAY_CONFIG.defaultDecayRate;
  }

  return rate;
}

/* ─────────────────────────────────────────────────────────────
   5. SCORE CALCULATION
──────────────────────────────────────────────────────────────── */

/**
 * Calculate decayed score (pure function)
 * @param {number} currentScore - Current attention score (0.0 to 1.0)
 * @param {number} turnsElapsed - Number of turns since last activation
 * @param {number} decayRate - Decay rate per turn (0.0 to 1.0)
 * @returns {number} New score after decay
 */
function calculate_decayed_score(currentScore, turnsElapsed, decayRate) {
  // Validate inputs
  if (typeof currentScore !== 'number' || isNaN(currentScore)) {
    return 0;
  }
  if (typeof turnsElapsed !== 'number' || isNaN(turnsElapsed) || turnsElapsed < 0) {
    return currentScore;
  }
  if (typeof decayRate !== 'number' || isNaN(decayRate) || decayRate < 0 || decayRate > 1) {
    decayRate = DECAY_CONFIG.defaultDecayRate;
  }

  // No decay for rate of 1.0 (constitutional memories)
  if (decayRate === 1.0) {
    return currentScore;
  }

  // Apply exponential decay: score * (rate ^ turns)
  const new_score = currentScore * Math.pow(decayRate, turnsElapsed);

  // Clamp to minimum threshold
  if (new_score < DECAY_CONFIG.minScoreThreshold) {
    return 0;
  }

  return new_score;
}

/**
 * Calculate decayed score using FSRS power-law formula (NEW)
 *
 * This is the preferred decay method, using research-backed FSRS algorithm.
 * Falls back to exponential decay if stability is not available.
 *
 * @param {Object} memory - Memory object with FSRS parameters
 * @param {number} memory.stability - Memory stability in days (default: 1.0)
 * @param {number} memory.attention_score - Current attention score
 * @param {string} memory.last_review - Last review date (ISO string)
 * @param {number} elapsed_days - Days since last review (calculated if not provided)
 * @returns {number} New attention score based on retrievability
 */
function calculate_retrievability_decay(memory, elapsed_days) {
  // Guard: validate memory object
  if (!memory || typeof memory !== 'object') {
    return 0;
  }

  // BUG-024 FIX: Properly handle stability=0 (instant decay)
  // Using || treats 0 as falsy, but 0 is a valid edge case meaning instant decay
  const stability = (typeof memory.stability === 'number' && memory.stability > 0)
    ? memory.stability
    : 1.0;

  // Calculate elapsed days if not provided
  if (typeof elapsed_days !== 'number' || elapsed_days < 0) {
    elapsed_days = fsrsScheduler.calculate_elapsed_days(memory.last_review);
  }

  // Calculate retrievability using FSRS power-law
  const retrievability = fsrsScheduler.calculate_retrievability(stability, elapsed_days);

  // Apply retrievability to current attention score
  const current_score = memory.attention_score || 1.0;
  const new_score = current_score * retrievability;

  // Clamp to minimum threshold
  if (new_score < DECAY_CONFIG.minScoreThreshold) {
    return 0;
  }

  return new_score;
}

/* ─────────────────────────────────────────────────────────────
   6. DECAY APPLICATION
──────────────────────────────────────────────────────────────── */

/**
 * Apply decay to ALL working memories for a session
 * @param {string} sessionId - Session identifier
 * @param {number} turnNumber - Current turn number
 * @returns {{decayedCount: number}} Object with count of memories decayed
 */
function apply_decay(sessionId, turnNumber) {
  if (!db) {
    console.warn('[attention-decay] Database not initialized');
    return { decayedCount: 0 };
  }

  if (!sessionId || typeof sessionId !== 'string') {
    console.warn('[attention-decay] Invalid sessionId');
    return { decayedCount: 0 };
  }

  if (typeof turnNumber !== 'number' || turnNumber < 0) {
    console.warn('[attention-decay] Invalid turnNumber');
    return { decayedCount: 0 };
  }

  try {
    // Get all working memories for this session with their importance tiers
    const memories = db.prepare(`
      SELECT
        wm.session_id,
        wm.memory_id,
        wm.attention_score,
        wm.last_mentioned_turn,
        mi.importance_tier
      FROM working_memory wm
      LEFT JOIN memory_index mi ON wm.memory_id = mi.id
      WHERE wm.session_id = ?
        AND wm.attention_score > 0
    `).all(sessionId);

    if (memories.length === 0) {
      return { decayedCount: 0 };
    }

    // Prepare update statement (use composite key)
    const update_stmt = db.prepare(`
      UPDATE working_memory
      SET attention_score = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE session_id = ? AND memory_id = ?
    `);

    let decayed_count = 0;

    // Apply decay to each memory
    for (const memory of memories) {
      const turns_elapsed = turnNumber - (memory.last_mentioned_turn || 0);

      // Skip if no turns have elapsed
      if (turns_elapsed <= 0) {
        continue;
      }

      const decay_rate = get_decay_rate(memory.importance_tier);
      const new_score = calculate_decayed_score(
        memory.attention_score,
        turns_elapsed,
        decay_rate
      );

      // BUG-025 FIX: Use tolerance for float comparison
      // Exact float comparison !== can trigger unnecessary updates due to precision
      if (Math.abs(new_score - memory.attention_score) > 0.0001) {
        update_stmt.run(new_score, memory.session_id, memory.memory_id);
        decayed_count++;
      }
    }

    return { decayedCount: decayed_count };
  } catch (error) {
    console.error(`[attention-decay] Error applying decay: ${error.message}`);
    return { decayedCount: 0 };
  }
}

/**
 * Apply FSRS power-law decay to ALL working memories for a session (NEW)
 *
 * This is the preferred decay method using the FSRS algorithm.
 * It reads stability from memory_index and calculates retrievability-based decay.
 *
 * @param {string} sessionId - Session identifier
 * @returns {{decayedCount: number, updated: Array}} Object with count and updated memories
 */
function apply_fsrs_decay(sessionId) {
  if (!db) {
    console.warn('[attention-decay] Database not initialized');
    return { decayedCount: 0, updated: [] };
  }

  if (!sessionId || typeof sessionId !== 'string') {
    console.warn('[attention-decay] Invalid sessionId');
    return { decayedCount: 0, updated: [] };
  }

  try {
    // Get all working memories with FSRS parameters from memory_index
    const memories = db.prepare(`
      SELECT
        wm.session_id,
        wm.memory_id,
        wm.attention_score,
        wm.last_mentioned_turn,
        mi.importance_tier,
        mi.stability,
        mi.difficulty,
        mi.last_review
      FROM working_memory wm
      LEFT JOIN memory_index mi ON wm.memory_id = mi.id
      WHERE wm.session_id = ?
        AND wm.attention_score > 0
    `).all(sessionId);

    if (memories.length === 0) {
      return { decayedCount: 0, updated: [] };
    }

    // Prepare update statement
    const update_stmt = db.prepare(`
      UPDATE working_memory
      SET attention_score = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE session_id = ? AND memory_id = ?
    `);

    let decayed_count = 0;
    const updated = [];

    // Apply FSRS decay to each memory
    for (const memory of memories) {
      // Skip constitutional/critical/important tiers (no decay)
      const decay_rate = get_decay_rate(memory.importance_tier);
      if (decay_rate === 1.0) {
        continue;
      }

      // Calculate elapsed days since last review
      const elapsed_days = fsrsScheduler.calculate_elapsed_days(memory.last_review);

      // Skip if no time has elapsed
      if (elapsed_days <= 0) {
        continue;
      }

      // Calculate new score using FSRS power-law decay
      const new_score = calculate_retrievability_decay(memory, elapsed_days);

      // Only update if score actually changed significantly (avoid floating point noise)
      if (Math.abs(new_score - memory.attention_score) > 0.001) {
        update_stmt.run(new_score, memory.session_id, memory.memory_id);
        decayed_count++;
        updated.push({
          memory_id: memory.memory_id,
          old_score: memory.attention_score,
          new_score: new_score,
          elapsed_days: elapsed_days,
          stability: memory.stability || 1.0,
        });
      }
    }

    return { decayedCount: decayed_count, updated: updated };
  } catch (error) {
    console.error(`[attention-decay] Error applying FSRS decay: ${error.message}`);
    return { decayedCount: 0, updated: [] };
  }
}

/* ─────────────────────────────────────────────────────────────
   7. MEMORY ACTIVATION
──────────────────────────────────────────────────────────────── */

/**
 * Activate a memory (set attention score to 1.0 when matched)
 * @param {string} sessionId - Session identifier
 * @param {number} memoryId - Memory identifier (integer)
 * @param {number} turnNumber - Current turn number
 * @returns {boolean} True if activation succeeded
 */
function activate_memory(sessionId, memoryId, turnNumber) {
  if (!db) {
    console.warn('[attention-decay] Database not initialized');
    return false;
  }

  if (!sessionId || typeof sessionId !== 'string') {
    console.warn('[attention-decay] Invalid sessionId');
    return false;
  }

  if (memoryId === undefined || memoryId === null) {
    console.warn('[attention-decay] Invalid memoryId');
    return false;
  }

  if (typeof turnNumber !== 'number' || turnNumber < 0) {
    console.warn('[attention-decay] Invalid turnNumber');
    return false;
  }

  try {
    // Check if memory exists in working memory for this session
    const existing = db.prepare(`
      SELECT session_id, memory_id FROM working_memory
      WHERE session_id = ? AND memory_id = ?
    `).get(sessionId, memoryId);

    if (existing) {
      // Update existing entry - reset score to 1.0
      db.prepare(`
        UPDATE working_memory
        SET attention_score = 1.0,
            last_mentioned_turn = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE session_id = ? AND memory_id = ?
      `).run(turnNumber, sessionId, memoryId);
    } else {
      // Insert new working memory entry
      db.prepare(`
        INSERT INTO working_memory (
          session_id,
          memory_id,
          attention_score,
          last_mentioned_turn,
          tier,
          created_at,
          updated_at
        ) VALUES (?, ?, 1.0, ?, 'HOT', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `).run(sessionId, memoryId, turnNumber);
    }

    return true;
  } catch (error) {
    console.error(`[attention-decay] Error activating memory: ${error.message}`);
    return false;
  }
}

/**
 * Activate a memory with FSRS testing effect (NEW)
 *
 * This enhanced activation:
 * 1. Sets attention score to 1.0 (standard activation)
 * 2. Updates stability using FSRS testing effect (harder recalls strengthen more)
 * 3. Updates last_review timestamp
 * 4. Increments review_count
 *
 * @param {string} sessionId - Session identifier
 * @param {number} memoryId - Memory identifier (integer)
 * @param {number} turnNumber - Current turn number
 * @param {Object} options - Optional parameters
 * @param {number} options.grade - FSRS grade (1-4, default: 3 for GOOD)
 * @param {number} options.similarity - Search similarity if applicable
 * @returns {{success: boolean, stability_updated: boolean, new_stability: number|null}} Activation result
 */
function activate_memory_with_fsrs(sessionId, memoryId, turnNumber, options = {}) {
  if (!db) {
    console.warn('[attention-decay] Database not initialized');
    return { success: false, stability_updated: false, new_stability: null };
  }

  if (!sessionId || typeof sessionId !== 'string') {
    console.warn('[attention-decay] Invalid sessionId');
    return { success: false, stability_updated: false, new_stability: null };
  }

  if (memoryId === undefined || memoryId === null) {
    console.warn('[attention-decay] Invalid memoryId');
    return { success: false, stability_updated: false, new_stability: null };
  }

  if (typeof turnNumber !== 'number' || turnNumber < 0) {
    console.warn('[attention-decay] Invalid turnNumber');
    return { success: false, stability_updated: false, new_stability: null };
  }

  try {
    // Get current FSRS parameters from memory_index
    const memory = db.prepare(`
      SELECT
        id,
        stability,
        difficulty,
        last_review,
        review_count
      FROM memory_index
      WHERE id = ?
    `).get(memoryId);

    // Standard activation in working memory
    const existing = db.prepare(`
      SELECT session_id, memory_id FROM working_memory
      WHERE session_id = ? AND memory_id = ?
    `).get(sessionId, memoryId);

    if (existing) {
      db.prepare(`
        UPDATE working_memory
        SET attention_score = 1.0,
            last_mentioned_turn = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE session_id = ? AND memory_id = ?
      `).run(turnNumber, sessionId, memoryId);
    } else {
      db.prepare(`
        INSERT INTO working_memory (
          session_id,
          memory_id,
          attention_score,
          last_mentioned_turn,
          tier,
          created_at,
          updated_at
        ) VALUES (?, ?, 1.0, ?, 'HOT', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `).run(sessionId, memoryId, turnNumber);
    }

    // If memory exists and has FSRS data, update stability (testing effect)
    let stability_updated = false;
    let new_stability = null;

    if (memory) {
      const current_stability = memory.stability || fsrsScheduler.DEFAULT_STABILITY;
      const current_difficulty = memory.difficulty || fsrsScheduler.DEFAULT_DIFFICULTY;

      // Calculate current retrievability
      const elapsed_days = fsrsScheduler.calculate_elapsed_days(memory.last_review);
      const retrievability = fsrsScheduler.calculate_retrievability(current_stability, elapsed_days);

      // Determine grade from options or default to GOOD
      let grade = options.grade;
      if (typeof grade !== 'number' || grade < 1 || grade > 4) {
        // Auto-determine grade from similarity if available
        if (typeof options.similarity === 'number') {
          if (options.similarity >= 0.95) {
            grade = fsrsScheduler.GRADE_EASY;
          } else if (options.similarity >= 0.80) {
            grade = fsrsScheduler.GRADE_GOOD;
          } else if (options.similarity >= 0.60) {
            grade = fsrsScheduler.GRADE_HARD;
          } else {
            grade = fsrsScheduler.GRADE_AGAIN;
          }
        } else {
          grade = fsrsScheduler.GRADE_GOOD; // Default to GOOD
        }
      }

      // Calculate new stability (testing effect)
      new_stability = fsrsScheduler.update_stability(
        current_stability,
        current_difficulty,
        retrievability,
        grade
      );

      // Update memory_index with new FSRS values
      const check_column = db.prepare(`
        SELECT COUNT(*) as count FROM pragma_table_info('memory_index')
        WHERE name = 'stability'
      `).get();

      if (check_column && check_column.count > 0) {
        db.prepare(`
          UPDATE memory_index
          SET stability = ?,
              last_review = CURRENT_TIMESTAMP,
              review_count = COALESCE(review_count, 0) + 1
          WHERE id = ?
        `).run(new_stability, memoryId);
        stability_updated = true;
      }
    }

    return {
      success: true,
      stability_updated: stability_updated,
      new_stability: new_stability,
    };
  } catch (error) {
    console.error(`[attention-decay] Error activating memory with FSRS: ${error.message}`);
    return { success: false, stability_updated: false, new_stability: null };
  }
}

/* ─────────────────────────────────────────────────────────────
   8. UTILITY FUNCTIONS
──────────────────────────────────────────────────────────────── */

/**
 * Get all active memories for a session (score > 0)
 * @param {string} sessionId - Session identifier
 * @returns {Array} Array of active memories with scores
 */
function get_active_memories(sessionId) {
  if (!db) {
    console.warn('[attention-decay] Database not initialized');
    return [];
  }

  if (!sessionId || typeof sessionId !== 'string') {
    return [];
  }

  try {
    return db.prepare(`
      SELECT
        wm.memory_id,
        wm.attention_score,
        wm.last_mentioned_turn,
        mi.title,
        mi.importance_tier
      FROM working_memory wm
      LEFT JOIN memory_index mi ON wm.memory_id = mi.id
      WHERE wm.session_id = ?
        AND wm.attention_score > 0
      ORDER BY wm.attention_score DESC
    `).all(sessionId);
  } catch (error) {
    console.error(`[attention-decay] Error getting active memories: ${error.message}`);
    return [];
  }
}

/**
 * Clear all working memories for a session
 * @param {string} sessionId - Session identifier
 * @returns {number} Count of memories cleared
 */
function clear_session(sessionId) {
  if (!db) {
    console.warn('[attention-decay] Database not initialized');
    return 0;
  }

  if (!sessionId || typeof sessionId !== 'string') {
    return 0;
  }

  try {
    const result = db.prepare(`
      DELETE FROM working_memory
      WHERE session_id = ?
    `).run(sessionId);

    return result.changes;
  } catch (error) {
    console.error(`[attention-decay] Error clearing session: ${error.message}`);
    return 0;
  }
}

/* ─────────────────────────────────────────────────────────────
   9. MODULE EXPORTS
──────────────────────────────────────────────────────────────── */

module.exports = {
  // Initialization
  init,
  getDb: get_db,

  // Core functions (legacy exponential decay - backward compatible)
  applyDecay: apply_decay,
  getDecayRate: get_decay_rate,
  activateMemory: activate_memory,
  calculateDecayedScore: calculate_decayed_score,

  // FSRS functions (new power-law decay)
  applyFsrsDecay: apply_fsrs_decay,
  calculateRetrievabilityDecay: calculate_retrievability_decay,
  activateMemoryWithFsrs: activate_memory_with_fsrs,

  // Snake_case aliases for FSRS functions (preferred style)
  apply_fsrs_decay,
  calculate_retrievability_decay,
  activate_memory_with_fsrs,

  // Utilities
  getActiveMemories: get_active_memories,
  clearSession: clear_session,

  // Configuration (exposed for testing)
  DECAY_CONFIG,

  // Re-export FSRS scheduler for convenience
  fsrsScheduler,
};

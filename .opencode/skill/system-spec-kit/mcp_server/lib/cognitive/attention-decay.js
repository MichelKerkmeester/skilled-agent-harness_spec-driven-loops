// ───────────────────────────────────────────────────────────────
// attention-decay.js: Cognitive attention decay for working memory
// ───────────────────────────────────────────────────────────────
'use strict';

/* ───────────────────────────────────────────────────────────────
   1. CONFIGURATION
   ─────────────────────────────────────────────────────────────── */

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

/* ───────────────────────────────────────────────────────────────
   2. STATE
   ─────────────────────────────────────────────────────────────── */

// Database reference (initialized via init())
let db = null;

/* ───────────────────────────────────────────────────────────────
   3. INITIALIZATION
   ─────────────────────────────────────────────────────────────── */

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

/* ───────────────────────────────────────────────────────────────
   4. DECAY RATE FUNCTIONS
   ─────────────────────────────────────────────────────────────── */

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

/* ───────────────────────────────────────────────────────────────
   5. SCORE CALCULATION
   ─────────────────────────────────────────────────────────────── */

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

/* ───────────────────────────────────────────────────────────────
   6. DECAY APPLICATION
   ─────────────────────────────────────────────────────────────── */

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

      // Only update if score actually changed
      if (new_score !== memory.attention_score) {
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

/* ───────────────────────────────────────────────────────────────
   7. MEMORY ACTIVATION
   ─────────────────────────────────────────────────────────────── */

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

/* ───────────────────────────────────────────────────────────────
   8. UTILITY FUNCTIONS
   ─────────────────────────────────────────────────────────────── */

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

/* ───────────────────────────────────────────────────────────────
   9. MODULE EXPORTS
   ─────────────────────────────────────────────────────────────── */

module.exports = {
  // Initialization
  init,
  getDb: get_db,

  // Core functions
  applyDecay: apply_decay,
  getDecayRate: get_decay_rate,
  activateMemory: activate_memory,
  calculateDecayedScore: calculate_decayed_score,

  // Utilities
  getActiveMemories: get_active_memories,
  clearSession: clear_session,

  // Configuration (exposed for testing)
  DECAY_CONFIG,
};

// ───────────────────────────────────────────────────────────────
// COGNITIVE: WORKING MEMORY
// ───────────────────────────────────────────────────────────────
'use strict';

/* ─────────────────────────────────────────────────────────────
   1. CONFIGURATION
──────────────────────────────────────────────────────────────── */

const WORKING_MEMORY_CONFIG = {
  enabled: process.env.ENABLE_WORKING_MEMORY !== 'false',
  maxWorkingMemories: 100,
  sessionTimeoutMinutes: 120,
};

/* ─────────────────────────────────────────────────────────────
   2. DATABASE REFERENCE
──────────────────────────────────────────────────────────────── */

let db = null;

/**
 * Initialize the working memory module with a database reference
 * @param {Object} database - better-sqlite3 database instance
 * @returns {Object} Schema creation result
 */
function init(database) {
  if (!database) {
    throw new Error('[working-memory] Database reference is required');
  }
  db = database;
  return ensure_schema();
}

/**
 * Get the current database reference (for testing)
 * @returns {Object|null} Database instance or null if not initialized
 */
function get_db() {
  return db;
}

/* ─────────────────────────────────────────────────────────────
   3. SCHEMA MANAGEMENT
──────────────────────────────────────────────────────────────── */

// SQL schema for working memory table
const SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS working_memory (
    session_id TEXT NOT NULL,
    memory_id INTEGER NOT NULL,
    attention_score REAL DEFAULT 0.0,
    last_mentioned_turn INTEGER DEFAULT 0,
    tier TEXT DEFAULT 'COLD',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (session_id, memory_id),
    FOREIGN KEY (memory_id) REFERENCES memory_index(id) ON DELETE CASCADE
  );
`;

const INDEX_SQL = [
  'CREATE INDEX IF NOT EXISTS idx_working_session ON working_memory(session_id);',
  'CREATE INDEX IF NOT EXISTS idx_working_tier ON working_memory(tier);',
  'CREATE INDEX IF NOT EXISTS idx_working_score ON working_memory(attention_score DESC);',
];

/**
 * Create working_memory table and indexes if they don't exist
 * @returns {Object} Result object with success status
 */
function ensure_schema() {
  if (!db) {
    throw new Error('[working-memory] Database not initialized. Call init() first.');
  }

  try {
    // Create table
    db.exec(SCHEMA_SQL);

    // Create indexes
    for (const index_sql of INDEX_SQL) {
      db.exec(index_sql);
    }

    return { success: true };
  } catch (error) {
    console.error(`[working-memory] Schema creation failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/* ─────────────────────────────────────────────────────────────
   4. SESSION MANAGEMENT
──────────────────────────────────────────────────────────────── */

/**
 * Get or create a working memory session
 * @param {string} session_id - Session identifier
 * @returns {Object} Session data with sessionId, memoryCount, isNew
 */
function get_or_create_session(session_id) {
  if (!db) {
    throw new Error('[working-memory] Database not initialized. Call init() first.');
  }

  if (!session_id || typeof session_id !== 'string') {
    throw new Error('[working-memory] Valid session_id is required');
  }

  try {
    // Get existing session memories count
    const count_stmt = db.prepare(`
      SELECT COUNT(*) as count
      FROM working_memory
      WHERE session_id = ?
    `);
    const result = count_stmt.get(session_id);

    return {
      sessionId: session_id,
      memoryCount: result ? result.count : 0,
      isNew: result ? result.count === 0 : true,
    };
  } catch (error) {
    console.error(`[working-memory] get_or_create_session failed: ${error.message}`);
    throw error;
  }
}

/**
 * Clear all working memory entries for a session
 * @param {string} session_id - Session identifier
 * @returns {Object} Result with success status and deletedCount
 */
function clear_session(session_id) {
  if (!db) {
    throw new Error('[working-memory] Database not initialized. Call init() first.');
  }

  if (!session_id || typeof session_id !== 'string') {
    throw new Error('[working-memory] Valid session_id is required');
  }

  try {
    const stmt = db.prepare(`
      DELETE FROM working_memory
      WHERE session_id = ?
    `);
    const result = stmt.run(session_id);

    return {
      success: true,
      deletedCount: result.changes,
    };
  } catch (error) {
    console.error(`[working-memory] clear_session failed: ${error.message}`);
    throw error;
  }
}

/**
 * Remove sessions older than the specified threshold
 * @param {number} max_age_minutes - Maximum session age in minutes (default: config value)
 * @returns {Object} Result with success status, deletedCount, and cutoffTime
 */
function cleanup_old_sessions(max_age_minutes = WORKING_MEMORY_CONFIG.sessionTimeoutMinutes) {
  if (!db) {
    throw new Error('[working-memory] Database not initialized. Call init() first.');
  }

  try {
    // Calculate cutoff timestamp
    const cutoff = new Date(Date.now() - max_age_minutes * 60 * 1000).toISOString();

    const stmt = db.prepare(`
      DELETE FROM working_memory
      WHERE updated_at < ?
    `);
    const result = stmt.run(cutoff);

    return {
      success: true,
      deletedCount: result.changes,
      cutoffTime: cutoff,
    };
  } catch (error) {
    console.error(`[working-memory] cleanup_old_sessions failed: ${error.message}`);
    throw error;
  }
}

/* ─────────────────────────────────────────────────────────────
   5. WORKING MEMORY OPERATIONS
──────────────────────────────────────────────────────────────── */

/**
 * Get a single working memory entry
 * @param {string} session_id - Session identifier
 * @param {number} memory_id - Memory identifier (integer)
 * @returns {Object|null} Working memory entry or null if not found
 */
function get_working_memory(session_id, memory_id) {
  if (!db) {
    throw new Error('[working-memory] Database not initialized. Call init() first.');
  }

  if (!session_id || typeof session_id !== 'string') {
    throw new Error('[working-memory] Valid session_id is required');
  }

  if (typeof memory_id !== 'number' || !Number.isInteger(memory_id)) {
    throw new Error('[working-memory] Valid memory_id (integer) is required');
  }

  try {
    const stmt = db.prepare(`
      SELECT session_id, memory_id, attention_score, last_mentioned_turn, tier, created_at, updated_at
      FROM working_memory
      WHERE session_id = ? AND memory_id = ?
    `);
    const row = stmt.get(session_id, memory_id);

    if (!row) {
      return null;
    }

    return {
      sessionId: row.session_id,
      memoryId: row.memory_id,
      attentionScore: row.attention_score,
      lastMentionedTurn: row.last_mentioned_turn,
      tier: row.tier,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  } catch (error) {
    console.error(`[working-memory] get_working_memory failed: ${error.message}`);
    throw error;
  }
}

/**
 * Get all working memories for a session
 * @param {string} session_id - Session identifier
 * @returns {Array<Object>} Array of working memory entries sorted by attention score
 */
function get_session_memories(session_id) {
  if (!db) {
    throw new Error('[working-memory] Database not initialized. Call init() first.');
  }

  if (!session_id || typeof session_id !== 'string') {
    throw new Error('[working-memory] Valid session_id is required');
  }

  try {
    const stmt = db.prepare(`
      SELECT session_id, memory_id, attention_score, last_mentioned_turn, tier, created_at, updated_at
      FROM working_memory
      WHERE session_id = ?
      ORDER BY attention_score DESC
    `);
    const rows = stmt.all(session_id);

    return rows.map(row => ({
      sessionId: row.session_id,
      memoryId: row.memory_id,
      attentionScore: row.attention_score,
      lastMentionedTurn: row.last_mentioned_turn,
      tier: row.tier,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  } catch (error) {
    console.error(`[working-memory] get_session_memories failed: ${error.message}`);
    throw error;
  }
}

/* ─────────────────────────────────────────────────────────────
   6. ATTENTION SCORE MANAGEMENT
──────────────────────────────────────────────────────────────── */

/**
 * Tier thresholds - configurable via environment variables
 * Must stay aligned with tier-classifier.js
 */
const HOT_THRESHOLD = parseFloat(process.env.HOT_THRESHOLD || '0.8');
const WARM_THRESHOLD = parseFloat(process.env.WARM_THRESHOLD || '0.25');

/**
 * Determine tier based on attention score
 * Thresholds aligned with tier-classifier.js (both read from same env vars)
 * @param {number} score - Attention score (0.0 to 1.0)
 * @returns {'HOT' | 'WARM' | 'COLD'} The tier classification
 */
function calculate_tier(score) {
  if (score >= HOT_THRESHOLD) {
    return 'HOT';
  }
  if (score >= WARM_THRESHOLD) {
    return 'WARM';
  }
  return 'COLD';
}

/**
 * Update attention score for a memory (upsert operation)
 * @param {string} session_id - Session identifier
 * @param {number} memory_id - Memory identifier (integer)
 * @param {number} score - Attention score (0.0 to 1.0)
 * @param {number} turn - Current turn number
 * @returns {Object} Result with success status and updated values
 */
function set_attention_score(session_id, memory_id, score, turn) {
  if (!db) {
    throw new Error('[working-memory] Database not initialized. Call init() first.');
  }

  if (!session_id || typeof session_id !== 'string') {
    throw new Error('[working-memory] Valid session_id is required');
  }

  if (typeof memory_id !== 'number' || !Number.isInteger(memory_id)) {
    throw new Error('[working-memory] Valid memory_id (integer) is required');
  }

  if (typeof score !== 'number' || score < 0 || score > 1) {
    throw new Error('[working-memory] Score must be a number between 0 and 1');
  }

  if (typeof turn !== 'number' || !Number.isInteger(turn) || turn < 0) {
    throw new Error('[working-memory] Turn must be a non-negative integer');
  }

  const tier = calculate_tier(score);
  const now = new Date().toISOString();

  try {
    // Use UPSERT (INSERT OR REPLACE) to handle both insert and update
    const stmt = db.prepare(`
      INSERT INTO working_memory (session_id, memory_id, attention_score, last_mentioned_turn, tier, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(session_id, memory_id) DO UPDATE SET
        attention_score = excluded.attention_score,
        last_mentioned_turn = excluded.last_mentioned_turn,
        tier = excluded.tier,
        updated_at = excluded.updated_at
    `);
    stmt.run(session_id, memory_id, score, turn, tier, now, now);

    // Enforce max working memories limit
    enforce_memory_limit(session_id);

    return {
      success: true,
      sessionId: session_id,
      memoryId: memory_id,
      attentionScore: score,
      tier: tier,
      lastMentionedTurn: turn,
    };
  } catch (error) {
    console.error(`[working-memory] set_attention_score failed: ${error.message}`);
    throw error;
  }
}

/**
 * Enforce the maximum number of working memories per session
 * Removes lowest scoring memories beyond the limit
 * @param {string} session_id - Session identifier
 */
function enforce_memory_limit(session_id) {
  if (!db) {
    return;
  }

  try {
    // Count current memories
    const count_stmt = db.prepare(`
      SELECT COUNT(*) as count FROM working_memory WHERE session_id = ?
    `);
    const result = count_stmt.get(session_id);

    if (result.count <= WORKING_MEMORY_CONFIG.maxWorkingMemories) {
      return;
    }

    // Delete lowest scoring memories beyond the limit
    const excess = result.count - WORKING_MEMORY_CONFIG.maxWorkingMemories;
    const delete_stmt = db.prepare(`
      DELETE FROM working_memory
      WHERE session_id = ? AND memory_id IN (
        SELECT memory_id FROM working_memory
        WHERE session_id = ?
        ORDER BY attention_score ASC, updated_at ASC
        LIMIT ?
      )
    `);
    delete_stmt.run(session_id, session_id, excess);
  } catch (error) {
    console.error(`[working-memory] enforce_memory_limit failed: ${error.message}`);
  }
}

/**
 * Batch update multiple attention scores (for decay operations)
 * @param {string} session_id - Session identifier
 * @param {Array<Object>} updates - Array of {memoryId, score} objects
 * @returns {Object} Result with success status and counts
 */
function batch_update_scores(session_id, updates) {
  if (!db) {
    throw new Error('[working-memory] Database not initialized. Call init() first.');
  }

  if (!session_id || typeof session_id !== 'string') {
    throw new Error('[working-memory] Valid session_id is required');
  }

  if (!Array.isArray(updates) || updates.length === 0) {
    throw new Error('[working-memory] Updates must be a non-empty array');
  }

  const now = new Date().toISOString();
  let successCount = 0;
  let errorCount = 0;

  try {
    const stmt = db.prepare(`
      UPDATE working_memory
      SET attention_score = ?, tier = ?, updated_at = ?
      WHERE session_id = ? AND memory_id = ?
    `);

    // Use a transaction for batch updates
    const run_batch = db.transaction(() => {
      for (const update of updates) {
        const { memoryId, score } = update;

        if (typeof memoryId !== 'number' || typeof score !== 'number') {
          errorCount++;
          continue;
        }

        const tier = calculate_tier(score);
        try {
          const result = stmt.run(score, tier, now, session_id, memoryId);
          if (result.changes > 0) {
            successCount++;
          }
        } catch {
          errorCount++;
        }
      }
    });

    run_batch();

    return {
      success: true,
      updatedCount: successCount,
      errorCount: errorCount,
      totalRequested: updates.length,
    };
  } catch (error) {
    console.error(`[working-memory] batch_update_scores failed: ${error.message}`);
    throw error;
  }
}

/* ─────────────────────────────────────────────────────────────
   7. UTILITY FUNCTIONS
──────────────────────────────────────────────────────────────── */

/**
 * Check if working memory feature is enabled
 * @returns {boolean} True if working memory is enabled
 */
function is_enabled() {
  return WORKING_MEMORY_CONFIG.enabled;
}

/**
 * Get current working memory configuration
 * @returns {Object} Copy of the configuration object
 */
function get_config() {
  return { ...WORKING_MEMORY_CONFIG };
}

/**
 * Get statistics for a working memory session
 * @param {string} session_id - Session identifier
 * @returns {Object} Session statistics including tier counts and scores
 */
function get_session_stats(session_id) {
  if (!db) {
    throw new Error('[working-memory] Database not initialized. Call init() first.');
  }

  if (!session_id || typeof session_id !== 'string') {
    throw new Error('[working-memory] Valid session_id is required');
  }

  try {
    const stats_stmt = db.prepare(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN tier = 'HOT' THEN 1 ELSE 0 END) as hot_count,
        SUM(CASE WHEN tier = 'WARM' THEN 1 ELSE 0 END) as warm_count,
        SUM(CASE WHEN tier = 'COLD' THEN 1 ELSE 0 END) as cold_count,
        AVG(attention_score) as avg_score,
        MAX(attention_score) as max_score,
        MIN(attention_score) as min_score,
        MAX(last_mentioned_turn) as latest_turn
      FROM working_memory
      WHERE session_id = ?
    `);
    const stats = stats_stmt.get(session_id);

    return {
      sessionId: session_id,
      totalMemories: stats.total || 0,
      tierCounts: {
        hot: stats.hot_count || 0,
        warm: stats.warm_count || 0,
        cold: stats.cold_count || 0,
      },
      scores: {
        average: stats.avg_score || 0,
        max: stats.max_score || 0,
        min: stats.min_score || 0,
      },
      latestTurn: stats.latest_turn || 0,
    };
  } catch (error) {
    console.error(`[working-memory] get_session_stats failed: ${error.message}`);
    throw error;
  }
}

/* ─────────────────────────────────────────────────────────────
   8. MODULE EXPORTS
──────────────────────────────────────────────────────────────── */

module.exports = {
  // Initialization
  init,
  ensureSchema: ensure_schema,

  // Session management
  getOrCreateSession: get_or_create_session,
  clearSession: clear_session,
  cleanupOldSessions: cleanup_old_sessions,

  // Working memory operations
  getWorkingMemory: get_working_memory,
  getSessionMemories: get_session_memories,

  // Attention score management
  setAttentionScore: set_attention_score,
  batchUpdateScores: batch_update_scores,

  // Utilities
  isEnabled: is_enabled,
  getConfig: get_config,
  getSessionStats: get_session_stats,

  // Expose internals for testing
  calculateTier: calculate_tier,
  getDb: get_db,

  // Configuration
  CONFIG: WORKING_MEMORY_CONFIG,
};

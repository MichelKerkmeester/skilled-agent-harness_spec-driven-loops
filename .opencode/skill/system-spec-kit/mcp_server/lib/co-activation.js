// ───────────────────────────────────────────────────────────────
// co-activation.js: Spreading activation for related memories
// ───────────────────────────────────────────────────────────────
'use strict';

const tierClassifier = require('./tier-classifier.js');

/* ───────────────────────────────────────────────────────────────
   1. CONFIGURATION
   ─────────────────────────────────────────────────────────────── */

const CO_ACTIVATION_CONFIG = {
  enabled: process.env.ENABLE_CO_ACTIVATION !== 'false',
  boostAmount: 0.35,      // How much to boost related memories
  maxRelatedMemories: 5,  // Max related memories to boost per activation
  maxScoreCap: 1.0        // Scores cannot exceed this
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
 * Initialize the co-activation module with a database reference
 * @param {Database} database - better-sqlite3 database instance
 * @throws {Error} If database is null or undefined (T016: consistent error handling)
 */
function init(database) {
  if (!database) {
    throw new Error('[co-activation] Database reference is required for initialization');
  }
  db = database;
  console.log('[co-activation] Initialized with database reference');
}

/**
 * Check if co-activation is enabled
 * @returns {boolean} - true if enabled and initialized
 */
function is_enabled() {
  return CO_ACTIVATION_CONFIG.enabled && db !== null;
}

/* ───────────────────────────────────────────────────────────────
   4. SCORE CALCULATIONS
   ─────────────────────────────────────────────────────────────── */

/**
 * Boost a score by a given amount, capping at maxScoreCap
 * @param {number} currentScore - Current attention score (0.0-1.0)
 * @param {number} boostAmount - Amount to boost (default: CONFIG.boostAmount)
 * @returns {number} New score capped at maxScoreCap
 */
function boost_score(currentScore, boostAmount = CO_ACTIVATION_CONFIG.boostAmount) {
  const score = typeof currentScore === 'number' ? currentScore : 0;
  const boost = typeof boostAmount === 'number' ? boostAmount : CO_ACTIVATION_CONFIG.boostAmount;
  return Math.min(score + boost, CO_ACTIVATION_CONFIG.maxScoreCap);
}

/* ───────────────────────────────────────────────────────────────
   5. RELATED MEMORIES
   ─────────────────────────────────────────────────────────────── */

/**
 * Get related memory IDs for a given memory
 * @param {number} memoryId - The primary memory ID
 * @returns {number[]} Array of related memory IDs
 */
function get_related_memories(memoryId) {
  if (!db) {
    console.warn('[co-activation] Database not initialized');
    return [];
  }

  if (typeof memoryId !== 'number' || memoryId <= 0) {
    console.warn('[co-activation] Invalid memoryId:', memoryId);
    return [];
  }

  try {
    const row = db.prepare(`
      SELECT related_memories
      FROM memory_index
      WHERE id = ?
    `).get(memoryId);

    if (!row || !row.related_memories) {
      return [];
    }

    // Parse JSON array of related memory IDs
    const related = JSON.parse(row.related_memories);

    if (!Array.isArray(related)) {
      return [];
    }

    // Filter to valid numeric IDs and limit to maxRelatedMemories
    return related
      .filter(id => typeof id === 'number' && id > 0 && id !== memoryId)
      .slice(0, CO_ACTIVATION_CONFIG.maxRelatedMemories);
  } catch (error) {
    console.warn(`[co-activation] Error getting related memories for ${memoryId}:`, error.message);
    return [];
  }
}

/**
 * Auto-populate related_memories using semantic similarity
 * Finds top N most similar memories (excluding self) and stores their IDs
 * @param {number} memoryId - The memory ID to populate related memories for
 * @param {Function} vectorSearch - Async function to perform vector similarity search
 * @returns {Promise<number[]>} Array of related memory IDs that were populated
 */
async function populate_related_memories(memoryId, vectorSearch) {
  if (!db) {
    console.warn('[co-activation] Database not initialized');
    return [];
  }

  if (typeof memoryId !== 'number' || memoryId <= 0) {
    console.warn('[co-activation] Invalid memoryId:', memoryId);
    return [];
  }

  if (typeof vectorSearch !== 'function') {
    console.warn('[co-activation] vectorSearch must be a function');
    return [];
  }

  try {
    // Get the source memory's content for similarity search
    const sourceMemory = db.prepare(`
      SELECT content, title, spec_folder
      FROM memory_index
      WHERE id = ?
    `).get(memoryId);

    if (!sourceMemory) {
      console.warn(`[co-activation] Memory ${memoryId} not found`);
      return [];
    }

    // Build query from title + first 500 chars of content
    const queryText = [
      sourceMemory.title || '',
      (sourceMemory.content || '').substring(0, 500)
    ].filter(Boolean).join(' ').trim();

    if (!queryText) {
      console.warn(`[co-activation] Memory ${memoryId} has no searchable content`);
      return [];
    }

    // Perform vector search to find similar memories
    // Request extra results since we'll exclude self
    const searchResults = await vectorSearch(queryText, {
      limit: CO_ACTIVATION_CONFIG.maxRelatedMemories + 1,
      excludeIds: [memoryId]
    });

    if (!Array.isArray(searchResults) || searchResults.length === 0) {
      return [];
    }

    // Extract memory IDs from search results
    const relatedIds = searchResults
      .filter(result => result && result.id && result.id !== memoryId)
      .map(result => result.id)
      .slice(0, CO_ACTIVATION_CONFIG.maxRelatedMemories);

    if (relatedIds.length === 0) {
      return [];
    }

    // Store in database
    const relatedJson = JSON.stringify(relatedIds);
    db.prepare(`
      UPDATE memory_index
      SET related_memories = ?
      WHERE id = ?
    `).run(relatedJson, memoryId);

    console.log(`[co-activation] Populated ${relatedIds.length} related memories for memory ${memoryId}`);
    return relatedIds;
  } catch (error) {
    console.warn(`[co-activation] Error populating related memories for ${memoryId}:`, error.message);
    return [];
  }
}

/* ───────────────────────────────────────────────────────────────
   6. SPREADING ACTIVATION
   ─────────────────────────────────────────────────────────────── */

/**
 * Spread activation from a primary memory to its related memories
 * Boosts attention scores of related memories in working_memory table
 *
 * @param {string} sessionId - Session identifier
 * @param {number} primaryMemoryId - The memory that was activated
 * @param {number} turnNumber - Current conversation turn number
 * @param {Set} [boostedThisTurn] - Track already-boosted memories (prevents circular boost)
 * @returns {Object[]} Array of {memoryId, oldScore, newScore, wasAdded} for boosted memories
 */
function spread_activation(sessionId, primaryMemoryId, turnNumber, boostedThisTurn = new Set()) {
  if (!CO_ACTIVATION_CONFIG.enabled) {
    return [];
  }

  if (!db) {
    console.warn('[co-activation] Database not initialized');
    return [];
  }

  if (!sessionId || typeof sessionId !== 'string') {
    console.warn('[co-activation] Invalid sessionId:', sessionId);
    return [];
  }

  if (typeof primaryMemoryId !== 'number' || primaryMemoryId <= 0) {
    console.warn('[co-activation] Invalid primaryMemoryId:', primaryMemoryId);
    return [];
  }

  // BUG-010 FIX: Generate unique key for this memory in this turn
  const turn = typeof turnNumber === 'number' ? turnNumber : 0;
  const boostKey = `${sessionId}:${primaryMemoryId}:${turn}`;

  // Skip if already boosted this call chain (prevents circular A↔B infinite boosting)
  if (boostedThisTurn.has(boostKey)) {
    return [];
  }
  boostedThisTurn.add(boostKey);

  const startTime = Date.now();
  const boostedMemories = [];

  try {
    // Get related memories for the primary memory
    const relatedIds = get_related_memories(primaryMemoryId);

    if (relatedIds.length === 0) {
      log_co_activation_event('spread_activation', {
        sessionId,
        primaryMemoryId,
        turnNumber: turn,
        relatedCount: 0,
        boostedCount: 0,
        durationMs: Date.now() - startTime
      });
      return [];
    }

    // Check if working_memory table exists
    const tableExists = db.prepare(`
      SELECT name FROM sqlite_master
      WHERE type='table' AND name='working_memory'
    `).get();

    if (!tableExists) {
      console.warn('[co-activation] working_memory table does not exist');
      return [];
    }

    // Process each related memory
    for (const relatedId of relatedIds) {
      // Check if related memory exists in working_memory for this session
      const existingEntry = db.prepare(`
        SELECT attention_score
        FROM working_memory
        WHERE session_id = ? AND memory_id = ?
      `).get(sessionId, relatedId);

      if (existingEntry) {
        // Boost existing entry
        const oldScore = existingEntry.attention_score || 0;
        const newScore = boost_score(oldScore);

        db.prepare(`
          UPDATE working_memory
          SET attention_score = ?,
              updated_at = CURRENT_TIMESTAMP
          WHERE session_id = ? AND memory_id = ?
        `).run(newScore, sessionId, relatedId);

        boostedMemories.push({
          memoryId: relatedId,
          oldScore,
          newScore,
          wasAdded: false
        });
      } else {
        // Add new entry with initial score = boostAmount
        const newScore = CO_ACTIVATION_CONFIG.boostAmount;
        // BUG-008 FIX: Use tier-classifier instead of hardcoded 'COLD'
        const tier = tierClassifier.classifyTier(newScore);

        db.prepare(`
          INSERT INTO working_memory (session_id, memory_id, attention_score, last_mentioned_turn, tier, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `).run(sessionId, relatedId, newScore, turn, tier);

        boostedMemories.push({
          memoryId: relatedId,
          oldScore: 0,
          newScore,
          wasAdded: true
        });
      }
    }

    const durationMs = Date.now() - startTime;
    log_co_activation_event('spread_activation', {
      sessionId,
      primaryMemoryId,
      turnNumber: turn,
      relatedCount: relatedIds.length,
      boostedCount: boostedMemories.length,
      addedCount: boostedMemories.filter(m => m.wasAdded).length,
      durationMs
    });

    return boostedMemories;
  } catch (error) {
    console.error(`[co-activation] Error spreading activation from memory ${primaryMemoryId}:`, error.message);
    return [];
  }
}

/* ───────────────────────────────────────────────────────────────
   7. LOGGING
   ─────────────────────────────────────────────────────────────── */

/**
 * Log co-activation events for debugging
 * @param {string} operation - Operation name
 * @param {Object} details - Event details
 */
function log_co_activation_event(operation, details = {}) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    operation,
    ...details
  };

  if (process.env.DEBUG_CO_ACTIVATION) {
    console.log(`[co-activation] ${operation}:`, JSON.stringify(logEntry, null, 2));
  } else if (details.durationMs >= 20) {
    // Warn if operation is slow (target <20ms per spec)
    console.warn(`[co-activation] ${operation}: ${details.durationMs}ms (target <20ms)`, details);
  }

  return logEntry;
}

/* ───────────────────────────────────────────────────────────────
   8. MODULE EXPORTS
   ─────────────────────────────────────────────────────────────── */

module.exports = {
  // Core functions
  init,
  isEnabled: is_enabled,
  spreadActivation: spread_activation,
  getRelatedMemories: get_related_memories,
  boostScore: boost_score,
  populateRelatedMemories: populate_related_memories,

  // Logging
  logCoActivationEvent: log_co_activation_event,

  // Configuration (for testing and debugging)
  CONFIG: CO_ACTIVATION_CONFIG
};

// ───────────────────────────────────────────────────────────────
// SESSION: SESSION MANAGER
// ───────────────────────────────────────────────────────────────
'use strict';

const crypto = require('crypto');

/* ─────────────────────────────────────────────────────────────
   1. CONFIGURATION
────────────────────────────────────────────────────────────────*/

/**
 * Session configuration with defaults from spec.md (R7 mitigation)
 * - Session TTL: 30 minutes
 * - Cap at 100 entries per session
 */
const SESSION_CONFIG = {
  /** Session timeout in minutes (default: 30min per R7 mitigation) */
  sessionTtlMinutes: parseInt(process.env.SESSION_TTL_MINUTES, 10) || 30,

  /** Maximum entries per session (cap at 100 per R7 mitigation) */
  maxEntriesPerSession: parseInt(process.env.SESSION_MAX_ENTRIES, 10) || 100,

  /** Enable session deduplication (can be disabled via env) */
  enabled: process.env.DISABLE_SESSION_DEDUP !== 'true',
};

/* ─────────────────────────────────────────────────────────────
   2. DATABASE REFERENCE
────────────────────────────────────────────────────────────────*/

/** @type {import('better-sqlite3').Database|null} */
let db = null;

/**
 * Initialize the session manager with a database reference
 * @param {import('better-sqlite3').Database} database - better-sqlite3 database instance
 * @returns {{success: boolean, error?: string}} Initialization result
 */
function init(database) {
  if (!database) {
    console.error('[session-manager] WARNING: init() called with null database');
    return { success: false, error: 'Database reference is required' };
  }
  db = database;

  // Ensure schema exists
  const schemaResult = ensure_schema();
  if (!schemaResult.success) {
    return schemaResult;
  }

  // Clean up expired sessions on init (seu-claude pattern)
  cleanup_expired_sessions();

  // Database initialization complete
  return { success: true };
}

/**
 * Get the current database reference
 * @returns {import('better-sqlite3').Database|null}
 */
function get_db() {
  return db;
}

/* ─────────────────────────────────────────────────────────────
   3. SCHEMA MANAGEMENT
────────────────────────────────────────────────────────────────*/

/**
 * SQL schema for session_sent_memories table
 * Tracks which memories have been sent to the client in each session
 * to prevent duplicate context injection (token savings)
 */
const SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS session_sent_memories (
    session_id TEXT NOT NULL,
    memory_hash TEXT NOT NULL,
    memory_id INTEGER,
    sent_at TEXT DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (session_id, memory_hash)
  );
`;

const INDEX_SQL = [
  'CREATE INDEX IF NOT EXISTS idx_session_sent_session ON session_sent_memories(session_id);',
  'CREATE INDEX IF NOT EXISTS idx_session_sent_time ON session_sent_memories(sent_at);',
];

/**
 * Create session_sent_memories table and indexes if they don't exist
 * @returns {{success: boolean, error?: string}}
 */
function ensure_schema() {
  if (!db) {
    return { success: false, error: 'Database not initialized' };
  }

  try {
    // Create table
    db.exec(SCHEMA_SQL);

    // Create indexes
    for (const indexSql of INDEX_SQL) {
      db.exec(indexSql);
    }

    return { success: true };
  } catch (error) {
    console.error(`[session-manager] Schema creation failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/* ─────────────────────────────────────────────────────────────
   4. HASH GENERATION
────────────────────────────────────────────────────────────────*/

/**
 * Generate a stable hash for memory content fingerprinting
 * Uses content + anchor_id for uniqueness (not just ID, to handle updates)
 *
 * @param {Object} memory - Memory object with content-related fields
 * @param {number} [memory.id] - Memory database ID
 * @param {string} [memory.file_path] - File path
 * @param {string} [memory.anchor_id] - Anchor identifier
 * @param {string} [memory.content_hash] - Existing content hash if available
 * @returns {string} SHA-256 hash (first 16 chars for efficiency)
 */
function generate_memory_hash(memory) {
  if (!memory) {
    throw new Error('Memory object is required for hash generation');
  }

  // Priority: use content_hash if available (most reliable)
  // Otherwise: combine id + anchor_id + file_path for uniqueness
  let hashInput;

  if (memory.content_hash) {
    // Content hash already computed during indexing - use it
    hashInput = memory.content_hash;
  } else if (memory.id !== undefined) {
    // Fallback: use id + anchor + path combination
    hashInput = `${memory.id}:${memory.anchor_id || ''}:${memory.file_path || ''}`;
  } else {
    // Emergency fallback: use whatever identifying info we have
    hashInput = JSON.stringify({
      anchor: memory.anchor_id,
      path: memory.file_path,
      title: memory.title
    });
  }

  // Generate SHA-256 and truncate to 16 chars (64 bits - sufficient for dedup)
  return crypto.createHash('sha256').update(hashInput).digest('hex').slice(0, 16);
}

/* ─────────────────────────────────────────────────────────────
   5. DEDUPLICATION METHODS
────────────────────────────────────────────────────────────────*/

/**
 * Check if a memory should be sent to the client
 * Returns true if NOT already sent in this session
 *
 * @param {string} sessionId - Session identifier
 * @param {Object|number} memory - Memory object or memory ID
 * @returns {boolean} True if memory should be sent (not a duplicate)
 */
function should_send_memory(sessionId, memory) {
  // Guard: disabled
  if (!SESSION_CONFIG.enabled) {
    return true;
  }

  // Guard: no database
  if (!db) {
    console.warn('[session-manager] Database not initialized, allowing memory');
    return true;
  }

  // Guard: invalid session
  if (!sessionId || typeof sessionId !== 'string') {
    return true;
  }

  try {
    // Generate hash from memory
    const memoryObj = typeof memory === 'number' ? { id: memory } : memory;
    const hash = generate_memory_hash(memoryObj);

    // Check if already sent
    const stmt = db.prepare(`
      SELECT 1 FROM session_sent_memories
      WHERE session_id = ? AND memory_hash = ?
      LIMIT 1
    `);
    const exists = stmt.get(sessionId, hash);

    return !exists;
  } catch (error) {
    console.warn(`[session-manager] shouldSendMemory check failed: ${error.message}`);
    return true; // Allow on error (fail open for usability)
  }
}

/**
 * Check multiple memories at once for efficiency
 * Returns array of booleans indicating which should be sent
 *
 * @param {string} sessionId - Session identifier
 * @param {Array<Object>} memories - Array of memory objects
 * @returns {Map<number, boolean>} Map of memory ID to shouldSend boolean
 */
function should_send_memories_batch(sessionId, memories) {
  const result = new Map();

  // Guard: disabled or invalid input
  if (!SESSION_CONFIG.enabled || !db || !sessionId || !Array.isArray(memories)) {
    memories.forEach(m => result.set(m.id, true));
    return result;
  }

  try {
    // Get all hashes for this session
    const existingStmt = db.prepare(`
      SELECT memory_hash FROM session_sent_memories WHERE session_id = ?
    `);
    const existingRows = existingStmt.all(sessionId);
    const existingHashes = new Set(existingRows.map(r => r.memory_hash));

    // Check each memory
    for (const memory of memories) {
      const hash = generate_memory_hash(memory);
      result.set(memory.id, !existingHashes.has(hash));
    }

    return result;
  } catch (error) {
    console.warn(`[session-manager] shouldSendMemoriesBatch failed: ${error.message}`);
    memories.forEach(m => result.set(m.id, true));
    return result;
  }
}

/**
 * Mark a memory as sent to the client
 * Persists immediately to SQLite for crash recovery (seu-claude pattern)
 *
 * @param {string} sessionId - Session identifier
 * @param {Object|number} memory - Memory object or memory ID
 * @returns {{success: boolean, hash?: string, error?: string}}
 */
function mark_memory_sent(sessionId, memory) {
  // Guard: disabled
  if (!SESSION_CONFIG.enabled) {
    return { success: true, skipped: true };
  }

  // Guard: no database
  if (!db) {
    return { success: false, error: 'Database not initialized' };
  }

  // Guard: invalid session
  if (!sessionId || typeof sessionId !== 'string') {
    return { success: false, error: 'Valid sessionId is required' };
  }

  try {
    const memoryObj = typeof memory === 'number' ? { id: memory } : memory;
    const hash = generate_memory_hash(memoryObj);
    const memoryId = memoryObj.id || null;

    // Immediate SQLite save (seu-claude crash recovery pattern)
    const stmt = db.prepare(`
      INSERT OR IGNORE INTO session_sent_memories (session_id, memory_hash, memory_id, sent_at)
      VALUES (?, ?, ?, ?)
    `);
    stmt.run(sessionId, hash, memoryId, new Date().toISOString());

    // Enforce entry limit per session (R7 mitigation)
    enforce_entry_limit(sessionId);

    return { success: true, hash };
  } catch (error) {
    console.error(`[session-manager] markMemorySent failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Mark multiple memories as sent (batch operation)
 * Uses transaction for atomicity
 *
 * @param {string} sessionId - Session identifier
 * @param {Array<Object>} memories - Array of memory objects
 * @returns {{success: boolean, markedCount: number, error?: string}}
 */
function mark_memories_sent_batch(sessionId, memories) {
  // Guard: disabled
  if (!SESSION_CONFIG.enabled) {
    return { success: true, markedCount: 0, skipped: true };
  }

  // Guard: no database
  if (!db) {
    return { success: false, markedCount: 0, error: 'Database not initialized' };
  }

  // Guard: invalid input
  if (!sessionId || !Array.isArray(memories) || memories.length === 0) {
    return { success: false, markedCount: 0, error: 'Valid sessionId and memories array required' };
  }

  try {
    const now = new Date().toISOString();
    let markedCount = 0;

    const insertStmt = db.prepare(`
      INSERT OR IGNORE INTO session_sent_memories (session_id, memory_hash, memory_id, sent_at)
      VALUES (?, ?, ?, ?)
    `);

    // Use transaction for atomicity
    const runBatch = db.transaction(() => {
      for (const memory of memories) {
        const hash = generate_memory_hash(memory);
        const result = insertStmt.run(sessionId, hash, memory.id || null, now);
        if (result.changes > 0) {
          markedCount++;
        }
      }
    });

    runBatch();

    // Enforce entry limit after batch
    enforce_entry_limit(sessionId);

    return { success: true, markedCount };
  } catch (error) {
    console.error(`[session-manager] markMemoriesSentBatch failed: ${error.message}`);
    return { success: false, markedCount: 0, error: error.message };
  }
}

/* ─────────────────────────────────────────────────────────────
   6. SESSION PERSISTENCE
────────────────────────────────────────────────────────────────*/

/**
 * Enforce maximum entries per session (R7 mitigation: cap at 100)
 * Removes oldest entries when limit exceeded
 *
 * @param {string} sessionId - Session identifier
 */
function enforce_entry_limit(sessionId) {
  if (!db || !sessionId) return;

  try {
    // Count current entries
    const countStmt = db.prepare(`
      SELECT COUNT(*) as count FROM session_sent_memories WHERE session_id = ?
    `);
    const { count } = countStmt.get(sessionId);

    if (count <= SESSION_CONFIG.maxEntriesPerSession) {
      return;
    }

    // Delete oldest entries to stay within limit
    const excess = count - SESSION_CONFIG.maxEntriesPerSession;
    const deleteStmt = db.prepare(`
      DELETE FROM session_sent_memories
      WHERE session_id = ? AND rowid IN (
        SELECT rowid FROM session_sent_memories
        WHERE session_id = ?
        ORDER BY sent_at ASC
        LIMIT ?
      )
    `);
    deleteStmt.run(sessionId, sessionId, excess);
  } catch (error) {
    console.warn(`[session-manager] enforce_entry_limit failed: ${error.message}`);
  }
}

/**
 * Cleanup expired sessions (older than TTL)
 * Called on init and periodically for crash recovery
 *
 * @returns {{success: boolean, deletedCount: number}}
 */
function cleanup_expired_sessions() {
  if (!db) {
    return { success: false, deletedCount: 0 };
  }

  try {
    // Calculate cutoff timestamp
    const cutoffMs = Date.now() - (SESSION_CONFIG.sessionTtlMinutes * 60 * 1000);
    const cutoffIso = new Date(cutoffMs).toISOString();

    const stmt = db.prepare(`
      DELETE FROM session_sent_memories WHERE sent_at < ?
    `);
    const result = stmt.run(cutoffIso);

    // Expired entries cleaned up silently

    return { success: true, deletedCount: result.changes };
  } catch (error) {
    console.error(`[session-manager] cleanup_expired_sessions failed: ${error.message}`);
    return { success: false, deletedCount: 0 };
  }
}

/**
 * Clear all entries for a specific session
 * Used when explicitly ending a session
 *
 * @param {string} sessionId - Session identifier
 * @returns {{success: boolean, deletedCount: number}}
 */
function clear_session(sessionId) {
  if (!db || !sessionId) {
    return { success: false, deletedCount: 0 };
  }

  try {
    const stmt = db.prepare(`
      DELETE FROM session_sent_memories WHERE session_id = ?
    `);
    const result = stmt.run(sessionId);

    return { success: true, deletedCount: result.changes };
  } catch (error) {
    console.error(`[session-manager] clear_session failed: ${error.message}`);
    return { success: false, deletedCount: 0 };
  }
}

/**
 * Get session statistics
 *
 * @param {string} sessionId - Session identifier
 * @returns {{totalSent: number, oldestEntry: string|null, newestEntry: string|null}}
 */
function get_session_stats(sessionId) {
  if (!db || !sessionId) {
    return { totalSent: 0, oldestEntry: null, newestEntry: null };
  }

  try {
    const stmt = db.prepare(`
      SELECT
        COUNT(*) as total_sent,
        MIN(sent_at) as oldest_entry,
        MAX(sent_at) as newest_entry
      FROM session_sent_memories
      WHERE session_id = ?
    `);
    const row = stmt.get(sessionId);

    return {
      totalSent: row.total_sent || 0,
      oldestEntry: row.oldest_entry || null,
      newestEntry: row.newest_entry || null,
    };
  } catch (error) {
    console.warn(`[session-manager] get_session_stats failed: ${error.message}`);
    return { totalSent: 0, oldestEntry: null, newestEntry: null };
  }
}

/* ─────────────────────────────────────────────────────────────
   7. INTEGRATION HELPERS
────────────────────────────────────────────────────────────────*/

/**
 * Filter search results to exclude already-sent memories
 * Primary integration point for memory_search handler
 *
 * @param {string} sessionId - Session identifier
 * @param {Array<Object>} results - Search results array
 * @returns {{filtered: Array<Object>, dedupStats: Object}}
 */
function filter_search_results(sessionId, results) {
  if (!SESSION_CONFIG.enabled || !sessionId || !Array.isArray(results)) {
    return {
      filtered: results || [],
      dedupStats: { enabled: false, filtered: 0, total: results?.length || 0 }
    };
  }

  // Check which memories should be sent
  const shouldSendMap = should_send_memories_batch(sessionId, results);

  // Filter results
  const filtered = results.filter(r => shouldSendMap.get(r.id) !== false);
  const filteredCount = results.length - filtered.length;

  return {
    filtered,
    dedupStats: {
      enabled: true,
      filtered: filteredCount,
      total: results.length,
      tokenSavingsEstimate: filteredCount > 0 ? `~${filteredCount * 200} tokens` : '0'
    }
  };
}

/**
 * Mark search results as sent after successful response
 * Call this after returning results to the client
 *
 * @param {string} sessionId - Session identifier
 * @param {Array<Object>} results - Results that were sent to client
 * @returns {{success: boolean, markedCount: number}}
 */
function mark_results_sent(sessionId, results) {
  if (!SESSION_CONFIG.enabled || !sessionId || !Array.isArray(results) || results.length === 0) {
    return { success: true, markedCount: 0 };
  }

  return mark_memories_sent_batch(sessionId, results);
}

/**
 * Check if session deduplication is enabled
 * @returns {boolean}
 */
function is_enabled() {
  return SESSION_CONFIG.enabled;
}

/**
 * Get current configuration
 * @returns {Object}
 */
function get_config() {
  return { ...SESSION_CONFIG };
}

/* ─────────────────────────────────────────────────────────────
   8. SESSION STATE MANAGEMENT
────────────────────────────────────────────────────────────────*/

/**
 * SQL schema for session_state table
 * Tracks active sessions for crash recovery (REQ-016)
 */
const SESSION_STATE_SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS session_state (
    session_id TEXT PRIMARY KEY,
    status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'completed', 'interrupted')),
    spec_folder TEXT,
    current_task TEXT,
    last_action TEXT,
    context_summary TEXT,
    pending_work TEXT,
    state_data TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`;

const SESSION_STATE_INDEX_SQL = [
  'CREATE INDEX IF NOT EXISTS idx_session_state_status ON session_state(status);',
  'CREATE INDEX IF NOT EXISTS idx_session_state_updated ON session_state(updated_at);',
];

/**
 * Ensure session_state table exists
 * @returns {{success: boolean, error?: string}}
 */
function ensure_session_state_schema() {
  if (!db) {
    return { success: false, error: 'Database not initialized' };
  }

  try {
    db.exec(SESSION_STATE_SCHEMA_SQL);
    for (const indexSql of SESSION_STATE_INDEX_SQL) {
      db.exec(indexSql);
    }
    return { success: true };
  } catch (error) {
    console.error(`[session-manager] Session state schema creation failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Save session state immediately to SQLite (seu-claude pattern)
 * Immediate persistence ensures zero data loss on crash (REQ-016)
 *
 * @param {string} sessionId - Session identifier
 * @param {Object} state - Session state to persist
 * @param {string} [state.specFolder] - Spec folder being worked on
 * @param {string} [state.currentTask] - Current task ID (e.g., "T071")
 * @param {string} [state.lastAction] - Last completed action
 * @param {string} [state.contextSummary] - Summary of current context
 * @param {string} [state.pendingWork] - Description of pending work
 * @param {Object} [state.data] - Additional state data (JSON serialized)
 * @returns {{success: boolean, error?: string}}
 */
function save_session_state(sessionId, state = {}) {
  if (!db) {
    return { success: false, error: 'Database not initialized' };
  }

  if (!sessionId || typeof sessionId !== 'string') {
    return { success: false, error: 'Valid sessionId is required' };
  }

  try {
    // Ensure schema exists
    ensure_session_state_schema();

    const now = new Date().toISOString();
    const stateData = state.data ? JSON.stringify(state.data) : null;

    const stmt = db.prepare(`
      INSERT INTO session_state (
        session_id, status, spec_folder, current_task, last_action,
        context_summary, pending_work, state_data, created_at, updated_at
      )
      VALUES (?, 'active', ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(session_id) DO UPDATE SET
        status = 'active',
        spec_folder = COALESCE(excluded.spec_folder, session_state.spec_folder),
        current_task = COALESCE(excluded.current_task, session_state.current_task),
        last_action = COALESCE(excluded.last_action, session_state.last_action),
        context_summary = COALESCE(excluded.context_summary, session_state.context_summary),
        pending_work = COALESCE(excluded.pending_work, session_state.pending_work),
        state_data = COALESCE(excluded.state_data, session_state.state_data),
        updated_at = excluded.updated_at
    `);

    stmt.run(
      sessionId,
      state.specFolder || null,
      state.currentTask || null,
      state.lastAction || null,
      state.contextSummary || null,
      state.pendingWork || null,
      stateData,
      now,
      now
    );

    return { success: true };
  } catch (error) {
    console.error(`[session-manager] save_session_state failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Mark session as completed
 *
 * @param {string} sessionId - Session identifier
 * @returns {{success: boolean, error?: string}}
 */
function complete_session(sessionId) {
  if (!db || !sessionId) {
    return { success: false, error: 'Database or sessionId not available' };
  }

  try {
    const stmt = db.prepare(`
      UPDATE session_state
      SET status = 'completed', updated_at = ?
      WHERE session_id = ?
    `);
    stmt.run(new Date().toISOString(), sessionId);
    return { success: true };
  } catch (error) {
    console.error(`[session-manager] complete_session failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Reset all active sessions to interrupted status on startup (T074)
 * Called during server initialization to handle crash recovery (REQ-016)
 *
 * @returns {{success: boolean, interruptedCount: number, error?: string}}
 */
function reset_interrupted_sessions() {
  if (!db) {
    return { success: false, interruptedCount: 0, error: 'Database not initialized' };
  }

  try {
    // Ensure schema exists
    ensure_session_state_schema();

    const stmt = db.prepare(`
      UPDATE session_state
      SET status = 'interrupted', updated_at = ?
      WHERE status = 'active'
    `);
    const result = stmt.run(new Date().toISOString());

    // Active sessions marked as interrupted for crash recovery

    return { success: true, interruptedCount: result.changes };
  } catch (error) {
    console.error(`[session-manager] reset_interrupted_sessions failed: ${error.message}`);
    return { success: false, interruptedCount: 0, error: error.message };
  }
}

/**
 * Recover session state with _recovered flag (T075)
 * Returns session data with _recovered: true if session was interrupted
 *
 * @param {string} sessionId - Session identifier
 * @returns {{success: boolean, state?: Object, _recovered?: boolean, error?: string}}
 */
function recover_state(sessionId) {
  if (!db) {
    return { success: false, error: 'Database not initialized' };
  }

  if (!sessionId || typeof sessionId !== 'string') {
    return { success: false, error: 'Valid sessionId is required' };
  }

  try {
    // Ensure schema exists before querying
    ensure_session_state_schema();

    const stmt = db.prepare(`
      SELECT session_id, status, spec_folder, current_task, last_action,
             context_summary, pending_work, state_data, created_at, updated_at
      FROM session_state
      WHERE session_id = ?
    `);
    const row = stmt.get(sessionId);

    if (!row) {
      return { success: true, state: null, _recovered: false };
    }

    const state = {
      sessionId: row.session_id,
      status: row.status,
      specFolder: row.spec_folder,
      currentTask: row.current_task,
      lastAction: row.last_action,
      contextSummary: row.context_summary,
      pendingWork: row.pending_work,
      data: row.state_data ? JSON.parse(row.state_data) : null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      _recovered: row.status === 'interrupted',
    };

    // If recovering from interrupted state, mark as active again
    if (row.status === 'interrupted') {
      const updateStmt = db.prepare(`
        UPDATE session_state
        SET status = 'active', updated_at = ?
        WHERE session_id = ?
      `);
      updateStmt.run(new Date().toISOString(), sessionId);
      // Interrupted session recovered
    }

    return { success: true, state, _recovered: state._recovered };
  } catch (error) {
    console.error(`[session-manager] recover_state failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Get all interrupted sessions (for recovery UI/logging)
 *
 * @returns {{success: boolean, sessions?: Array, error?: string}}
 */
function get_interrupted_sessions() {
  if (!db) {
    return { success: false, sessions: [], error: 'Database not initialized' };
  }

  try {
    // Ensure schema exists
    ensure_session_state_schema();

    const stmt = db.prepare(`
      SELECT session_id, spec_folder, current_task, last_action,
             context_summary, pending_work, updated_at
      FROM session_state
      WHERE status = 'interrupted'
      ORDER BY updated_at DESC
    `);
    const rows = stmt.all();

    return {
      success: true,
      sessions: rows.map(row => ({
        sessionId: row.session_id,
        specFolder: row.spec_folder,
        currentTask: row.current_task,
        lastAction: row.last_action,
        contextSummary: row.context_summary,
        pendingWork: row.pending_work,
        updatedAt: row.updated_at,
      })),
    };
  } catch (error) {
    console.error(`[session-manager] get_interrupted_sessions failed: ${error.message}`);
    return { success: false, sessions: [], error: error.message };
  }
}

/* ─────────────────────────────────────────────────────────────
   9. CONTINUE SESSION GENERATION
────────────────────────────────────────────────────────────────*/

const fs = require('fs');
const path = require('path');

/**
 * Generate CONTINUE_SESSION.md content for human-readable recovery (T071)
 * Contains session state, context summary, pending work, and resume command
 *
 * @param {Object} sessionState - Session state object
 * @param {string} sessionState.sessionId - Session identifier
 * @param {string} [sessionState.specFolder] - Spec folder path
 * @param {string} [sessionState.currentTask] - Current task ID
 * @param {string} [sessionState.lastAction] - Last completed action
 * @param {string} [sessionState.contextSummary] - Summary of context
 * @param {string} [sessionState.pendingWork] - Pending work description
 * @param {Object} [sessionState.data] - Additional state data
 * @returns {string} Markdown content for CONTINUE_SESSION.md
 */
function generate_continue_session_md(sessionState) {
  const {
    sessionId,
    specFolder,
    currentTask,
    lastAction,
    contextSummary,
    pendingWork,
    data,
  } = sessionState;

  const timestamp = new Date().toISOString();
  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Build resume command
  const resumeCommand = specFolder
    ? `/spec_kit:resume ${specFolder}`
    : sessionId
      ? `memory_search({ sessionId: "${sessionId}" })`
      : 'memory_search({ query: "last session" })';

  const content = `# CONTINUE SESSION

> **Generated:** ${dateStr}
> **Purpose:** Enable seamless session recovery after context compaction, crashes, or breaks.
> **Pattern Source:** Adopted from seu-claude's CONTINUE_SESSION.md approach.

---

## Session State

| Field | Value |
|-------|-------|
| **Session ID** | \`${sessionId || 'N/A'}\` |
| **Spec Folder** | ${specFolder || 'N/A'} |
| **Current Task** | ${currentTask || 'N/A'} |
| **Last Action** | ${lastAction || 'N/A'} |
| **Status** | Active |
| **Updated** | ${timestamp} |

---

## Context Summary

${contextSummary || '_No context summary available._'}

---

## Pending Work

${pendingWork || '_No pending work recorded._'}

---

## Quick Resume

To continue this session, use:

\`\`\`
${resumeCommand}
\`\`\`

${data ? `
---

## Additional State Data

\`\`\`json
${JSON.stringify(data, null, 2)}
\`\`\`
` : ''}
---

*This file is auto-generated on session checkpoint. It provides a human-readable recovery mechanism alongside SQLite persistence.*
`;

  return content;
}

/**
 * Write CONTINUE_SESSION.md to spec folder (T072)
 * Called on session checkpoint for human-readable recovery
 *
 * @param {string} sessionId - Session identifier
 * @param {string} specFolderPath - Absolute path to spec folder
 * @returns {{success: boolean, filePath?: string, error?: string}}
 */
function write_continue_session_md(sessionId, specFolderPath) {
  if (!sessionId || !specFolderPath) {
    return { success: false, error: 'sessionId and specFolderPath are required' };
  }

  try {
    // Get current session state from database
    const recoverResult = recover_state(sessionId);
    if (!recoverResult.success || !recoverResult.state) {
      // Create minimal state if not in database
      const minimalState = {
        sessionId,
        specFolder: specFolderPath,
      };
      const content = generate_continue_session_md(minimalState);
      const filePath = path.join(specFolderPath, 'CONTINUE_SESSION.md');
      fs.writeFileSync(filePath, content, 'utf8');
      return { success: true, filePath };
    }

    // Generate content from database state
    const content = generate_continue_session_md(recoverResult.state);
    const filePath = path.join(specFolderPath, 'CONTINUE_SESSION.md');
    fs.writeFileSync(filePath, content, 'utf8');

    // CONTINUE_SESSION.md written successfully
    return { success: true, filePath };
  } catch (error) {
    console.error(`[session-manager] write_continue_session_md failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Session checkpoint: save state and generate CONTINUE_SESSION.md (T072)
 * Combines immediate SQLite save with human-readable file generation
 *
 * @param {string} sessionId - Session identifier
 * @param {Object} state - Session state to persist
 * @param {string} [specFolderPath] - Path to spec folder (optional, uses state.specFolder if not provided)
 * @returns {{success: boolean, filePath?: string, error?: string}}
 */
function checkpoint_session(sessionId, state, specFolderPath = null) {
  // Step 1: Save state to SQLite immediately (crash resilience)
  const saveResult = save_session_state(sessionId, state);
  if (!saveResult.success) {
    return saveResult;
  }

  // Step 2: Generate CONTINUE_SESSION.md if spec folder is available
  const folderPath = specFolderPath || state.specFolder;
  if (folderPath && fs.existsSync(folderPath)) {
    return write_continue_session_md(sessionId, folderPath);
  }

  return { success: true, note: 'State saved to SQLite, no spec folder for CONTINUE_SESSION.md' };
}

/* ─────────────────────────────────────────────────────────────
   10. MODULE EXPORTS
────────────────────────────────────────────────────────────────*/

module.exports = {
  // Initialization
  init,
  ensureSchema: ensure_schema,
  getDb: get_db,

  // Hash generation
  generateMemoryHash: generate_memory_hash,

  // Deduplication methods (T002)
  shouldSendMemory: should_send_memory,
  shouldSendMemoriesBatch: should_send_memories_batch,
  markMemorySent: mark_memory_sent,
  markMemoriesSentBatch: mark_memories_sent_batch,

  // Session persistence (T003)
  cleanupExpiredSessions: cleanup_expired_sessions,
  clearSession: clear_session,
  getSessionStats: get_session_stats,

  // Integration helpers (T004)
  filterSearchResults: filter_search_results,
  markResultsSent: mark_results_sent,

  // Session State Management (T073: Crash Recovery)
  ensureSessionStateSchema: ensure_session_state_schema,
  saveSessionState: save_session_state,
  completeSession: complete_session,

  // Crash Recovery (T074-T075)
  resetInterruptedSessions: reset_interrupted_sessions,
  recoverState: recover_state,
  getInterruptedSessions: get_interrupted_sessions,

  // CONTINUE_SESSION.md Generation (T071-T072)
  generateContinueSessionMd: generate_continue_session_md,
  writeContinueSessionMd: write_continue_session_md,
  checkpointSession: checkpoint_session,

  // Configuration
  isEnabled: is_enabled,
  getConfig: get_config,
  CONFIG: SESSION_CONFIG,
};

// ---------------------------------------------------------------
// MODULE: Working Memory
// Session-based attention management
// DECAY STRATEGY (ADR-004): This module handles SESSION-SCOPED decay
// only (minute-scale linear: score * 0.95 per tick). It operates on
// the working_memory table, NOT memory_index. This is intentionally
// independent of FSRS long-term decay — different time scale, different
// domain (ephemeral session attention vs persistent memory scoring).
// The T214 decay/delete race fix (floor=0.05, deleteThreshold=0.01)
// ensures stable resting state for session memories.
// ---------------------------------------------------------------

import type Database from 'better-sqlite3';

/* -------------------------------------------------------------
   1. CONFIGURATION
----------------------------------------------------------------*/

interface WorkingMemoryConfigType {
  enabled: boolean;
  maxCapacity: number;
  sessionTimeoutMs: number;
  decayInterval: number;
  attentionDecayRate: number;
  minAttentionScore: number;
}

const WORKING_MEMORY_CONFIG: WorkingMemoryConfigType = {
  enabled: process.env.SPECKIT_WORKING_MEMORY !== 'false',
  maxCapacity: 7, // Miller's Law: 7 +/- 2
  sessionTimeoutMs: 1800000, // 30 minutes
  decayInterval: 60000, // 1 minute
  attentionDecayRate: 0.95,
  minAttentionScore: 0.1,
  // T302: Removed dead cleanupIntervalMs (GAP 3) — was never wired to a timer
};

/* -------------------------------------------------------------
   2. SCHEMA SQL
----------------------------------------------------------------*/

const SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS working_memory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    memory_id INTEGER NOT NULL,
    attention_score REAL DEFAULT 1.0,
    added_at TEXT DEFAULT CURRENT_TIMESTAMP,
    last_focused TEXT DEFAULT CURRENT_TIMESTAMP,
    focus_count INTEGER DEFAULT 1,
    UNIQUE(session_id, memory_id),
    FOREIGN KEY (memory_id) REFERENCES memory_index(id) ON DELETE CASCADE
  )
`;

const INDEX_SQL = `
  CREATE INDEX IF NOT EXISTS idx_wm_session ON working_memory(session_id);
  CREATE INDEX IF NOT EXISTS idx_wm_attention ON working_memory(session_id, attention_score DESC);
  CREATE INDEX IF NOT EXISTS idx_wm_added ON working_memory(added_at)
`;

/* -------------------------------------------------------------
   3. INTERFACES
----------------------------------------------------------------*/

interface WorkingMemoryEntry {
  id: number;
  session_id: string;
  memory_id: number;
  attention_score: number;
  added_at: string;
  last_focused: string;
  focus_count: number;
}

interface SessionInfo {
  sessionId: string;
  memoryCount: number;
  avgAttention: number;
  createdAt: string;
  lastActivity: string;
}

interface SessionStats {
  sessionId: string;
  totalEntries: number;
  avgAttention: number;
  maxAttention: number;
  minAttention: number;
  totalFocusEvents: number;
}

/* -------------------------------------------------------------
   4. MODULE STATE
----------------------------------------------------------------*/

let db: Database.Database | null = null;
let schemaEnsured = false;

/* -------------------------------------------------------------
   5. INITIALIZATION
----------------------------------------------------------------*/

function init(database: Database.Database): void {
  db = database;
  schemaEnsured = false;
  ensureSchema();
}

function ensureSchema(): void {
  if (!db || schemaEnsured) return;

  try {
    db.exec(SCHEMA_SQL);
    db.exec(INDEX_SQL);
    schemaEnsured = true;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[working-memory] Schema creation failed: ${msg}`);
  }
}

/* -------------------------------------------------------------
   6. SESSION MANAGEMENT
----------------------------------------------------------------*/

function getOrCreateSession(sessionId: string | null = null): string {
  if (sessionId) return sessionId;

  // Generate a new session ID
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `wm-${timestamp}-${random}`;
}

function clearSession(sessionId: string): number {
  if (!db) return 0;
  ensureSchema();

  try {
    const result = (db.prepare(
      'DELETE FROM working_memory WHERE session_id = ?'
    ) as Database.Statement).run(sessionId);
    return (result as { changes: number }).changes;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[working-memory] clearSession error: ${msg}`);
    return 0;
  }
}

function cleanupOldSessions(): number {
  if (!db) return 0;
  ensureSchema();

  try {
    const cutoff = new Date(Date.now() - WORKING_MEMORY_CONFIG.sessionTimeoutMs).toISOString();
    const result = (db.prepare(
      'DELETE FROM working_memory WHERE last_focused < ?'
    ) as Database.Statement).run(cutoff);
    return (result as { changes: number }).changes;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[working-memory] cleanupOldSessions error: ${msg}`);
    return 0;
  }
}

/* -------------------------------------------------------------
   7. WORKING MEMORY OPERATIONS
----------------------------------------------------------------*/

function getWorkingMemory(sessionId: string): WorkingMemoryEntry[] {
  if (!db) return [];
  ensureSchema();

  try {
    return (db.prepare(`
      SELECT * FROM working_memory
      WHERE session_id = ?
      ORDER BY attention_score DESC
    `) as Database.Statement).all(sessionId) as WorkingMemoryEntry[];
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[working-memory] getWorkingMemory error: ${msg}`);
    return [];
  }
}

function getSessionMemories(sessionId: string): Array<Record<string, unknown>> {
  if (!db) return [];
  ensureSchema();

  try {
    return (db.prepare(`
      SELECT m.*, wm.attention_score, wm.focus_count, wm.last_focused
      FROM working_memory wm
      JOIN memory_index m ON wm.memory_id = m.id
      WHERE wm.session_id = ?
      ORDER BY wm.attention_score DESC
    `) as Database.Statement).all(sessionId) as Array<Record<string, unknown>>;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[working-memory] getSessionMemories error: ${msg}`);
    return [];
  }
}

/**
 * Calculate attention tier for an entry.
 */
function calculateTier(attentionScore: number): string {
  if (attentionScore >= 0.8) return 'focused';
  if (attentionScore >= 0.5) return 'active';
  if (attentionScore >= 0.2) return 'peripheral';
  return 'fading';
}

/**
 * Set or update the attention score for a memory in working memory.
 */
function setAttentionScore(
  sessionId: string,
  memoryId: number,
  score: number
): boolean {
  if (!db) return false;
  ensureSchema();

  const clampedScore = Math.max(0, Math.min(1, score));

  try {
    const existing = (db.prepare(
      'SELECT id FROM working_memory WHERE session_id = ? AND memory_id = ?'
    ) as Database.Statement).get(sessionId, memoryId) as { id: number } | undefined;

    if (existing) {
      (db.prepare(`
        UPDATE working_memory
        SET attention_score = ?,
            last_focused = CURRENT_TIMESTAMP,
            focus_count = focus_count + 1
        WHERE session_id = ? AND memory_id = ?
      `) as Database.Statement).run(clampedScore, sessionId, memoryId);
    } else {
      // Check capacity
      enforceMemoryLimit(sessionId);

      (db.prepare(`
        INSERT INTO working_memory (session_id, memory_id, attention_score)
        VALUES (?, ?, ?)
      `) as Database.Statement).run(sessionId, memoryId, clampedScore);
    }

    return true;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[working-memory] setAttentionScore error: ${msg}`);
    return false;
  }
}

/**
 * Enforce working memory capacity limit by removing lowest-attention items.
 */
function enforceMemoryLimit(sessionId: string): number {
  if (!db) return 0;

  try {
    const count = (db.prepare(
      'SELECT COUNT(*) as count FROM working_memory WHERE session_id = ?'
    ) as Database.Statement).get(sessionId) as { count: number };

    if (count.count < WORKING_MEMORY_CONFIG.maxCapacity) return 0;

    const excess = count.count - WORKING_MEMORY_CONFIG.maxCapacity + 1;
    const result = (db.prepare(`
      DELETE FROM working_memory
      WHERE id IN (
        SELECT id FROM working_memory
        WHERE session_id = ?
        ORDER BY attention_score ASC
        LIMIT ?
      )
    `) as Database.Statement).run(sessionId, excess);

    return (result as { changes: number }).changes;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[working-memory] enforceMemoryLimit error: ${msg}`);
    return 0;
  }
}

/**
 * Batch update attention scores with decay.
 *
 * Separates the decay floor from the delete threshold to prevent the
 * decay/delete race condition:
 *   - decayFloor (0.05): scores are clamped here, never decay below this
 *   - deleteThreshold (0.01): only entries below this are pruned
 * This gives floored memories a stable resting state instead of immediate
 * deletion. Entries can only reach below deleteThreshold through explicit
 * score-setting or extended inactivity cleanup.
 */
function batchUpdateScores(sessionId: string): number {
  if (!db) return 0;
  ensureSchema();

  const decayFloor = WORKING_MEMORY_CONFIG.minAttentionScore * 0.5;    // 0.05
  const deleteThreshold = WORKING_MEMORY_CONFIG.minAttentionScore * 0.1; // 0.01

  try {
    const result = (db.prepare(`
      UPDATE working_memory
      SET attention_score = MAX(?, attention_score * ?)
      WHERE session_id = ?
    `) as Database.Statement).run(
      decayFloor,
      WORKING_MEMORY_CONFIG.attentionDecayRate,
      sessionId
    );

    // Only delete entries that have dropped below the delete threshold.
    // Since decay clamps at decayFloor (0.05), normal decay alone will
    // never reach deleteThreshold (0.01) — only explicit score changes
    // or extended inactivity cleanup can push entries below it.
    (db.prepare(`
      DELETE FROM working_memory
      WHERE session_id = ? AND attention_score < ?
    `) as Database.Statement).run(sessionId, deleteThreshold);

    return (result as { changes: number }).changes;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[working-memory] batchUpdateScores error: ${msg}`);
    return 0;
  }
}

/* -------------------------------------------------------------
   8. UTILITY FUNCTIONS
----------------------------------------------------------------*/

function isEnabled(): boolean {
  return WORKING_MEMORY_CONFIG.enabled;
}

function getConfig(): WorkingMemoryConfigType {
  return { ...WORKING_MEMORY_CONFIG };
}

function getSessionStats(sessionId: string): SessionStats | null {
  if (!db) return null;
  ensureSchema();

  try {
    const stats = (db.prepare(`
      SELECT
        COUNT(*) as totalEntries,
        AVG(attention_score) as avgAttention,
        MAX(attention_score) as maxAttention,
        MIN(attention_score) as minAttention,
        SUM(focus_count) as totalFocusEvents
      FROM working_memory
      WHERE session_id = ?
    `) as Database.Statement).get(sessionId) as {
      totalEntries: number;
      avgAttention: number;
      maxAttention: number;
      minAttention: number;
      totalFocusEvents: number;
    } | undefined;

    if (!stats || stats.totalEntries === 0) return null;

    return {
      sessionId,
      totalEntries: stats.totalEntries,
      avgAttention: Math.round((stats.avgAttention || 0) * 100) / 100,
      maxAttention: stats.maxAttention || 0,
      minAttention: stats.minAttention || 0,
      totalFocusEvents: stats.totalFocusEvents || 0,
    };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[working-memory] getSessionStats error: ${msg}`);
    return null;
  }
}

/* -------------------------------------------------------------
   9. EXPORTS
----------------------------------------------------------------*/

export {
  WORKING_MEMORY_CONFIG,
  SCHEMA_SQL,
  INDEX_SQL,

  // Initialization
  init,
  ensureSchema,

  // Session management
  getOrCreateSession,
  clearSession,
  cleanupOldSessions,

  // Working memory operations
  getWorkingMemory,
  getSessionMemories,
  calculateTier,
  setAttentionScore,
  enforceMemoryLimit,
  batchUpdateScores,

  // Utilities
  isEnabled,
  getConfig,
  getSessionStats,
};

export type {
  WorkingMemoryConfigType,
  WorkingMemoryEntry,
  SessionInfo,
  SessionStats,
};

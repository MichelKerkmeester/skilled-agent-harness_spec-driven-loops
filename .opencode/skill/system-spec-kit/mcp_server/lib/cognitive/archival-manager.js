// ───────────────────────────────────────────────────────────────
// COGNITIVE: ARCHIVAL MANAGER
// ───────────────────────────────────────────────────────────────
'use strict';

const tierClassifier = require('./tier-classifier.js');

/* ─────────────────────────────────────────────────────────────
   1. CONFIGURATION
────────────────────────────────────────────────────────────────*/

// Parse environment variable with validation
function parse_interval(envVar, defaultVal) {
  const parsed = parseInt(process.env[envVar], 10);
  return !isNaN(parsed) && parsed > 0 ? parsed : defaultVal;
}

function parse_bool(envVar, defaultVal) {
  const val = process.env[envVar];
  if (val === undefined || val === '') return defaultVal;
  return val === 'true' || val === '1';
}

const ARCHIVAL_CONFIG = {
  // Archival scan interval (default: 1 hour = 3600000ms)
  scanIntervalMs: parse_interval('ARCHIVAL_SCAN_INTERVAL_MS', 3600000),
  // Maximum memories to process per scan (prevents blocking)
  batchSize: parse_interval('ARCHIVAL_BATCH_SIZE', 50),
  // Enable archival background job (default: true)
  enabled: parse_bool('ARCHIVAL_ENABLED', true),
  // Valid values: 'mark', 'soft_delete', 'log_only'
  archiveAction: process.env.ARCHIVAL_ACTION || 'mark',
  // Days threshold (aligns with tier-classifier ARCHIVED_DAYS_THRESHOLD)
  daysThreshold: tierClassifier.ARCHIVED_DAYS_THRESHOLD || 90,
};

/* ─────────────────────────────────────────────────────────────
   2. STATE
────────────────────────────────────────────────────────────────*/

let db = null;
let archival_interval = null;
let is_running = false;
let stmt_cache = {
  get_candidates: null,
  mark_archived: null,
  soft_delete: null,
  get_archived_count: null,
};

// Archival statistics
const archival_stats = {
  scans_completed: 0,
  total_archived: 0,
  last_scan_at: null,
  last_scan_duration_ms: 0,
  last_batch_count: 0,
  errors: [],
};

/* ─────────────────────────────────────────────────────────────
   3. INITIALIZATION
────────────────────────────────────────────────────────────────*/

/**
 * Initialize the archival manager with a database reference.
 * Also ensures the is_archived column exists in the schema.
 *
 * @param {Object} database - better-sqlite3 database instance
 * @returns {{ success: boolean, error?: string }}
 */
function init(database) {
  if (!database) {
    return { success: false, error: 'Database instance is required' };
  }

  db = database;

  try {
    // Ensure is_archived column exists (schema migration)
    ensure_archived_column();

    // Prepare statements
    stmt_cache.get_candidates = db.prepare(`
      SELECT id, spec_folder, file_path, title, last_accessed, created_at,
             importance_tier, is_archived
      FROM memory_index
      WHERE (is_archived IS NULL OR is_archived = 0)
        AND importance_tier NOT IN ('constitutional', 'critical')
      ORDER BY last_accessed ASC, created_at ASC
      LIMIT ?
    `);

    stmt_cache.mark_archived = db.prepare(`
      UPDATE memory_index
      SET is_archived = 1, archived_at = ?
      WHERE id = ?
    `);

    stmt_cache.soft_delete = db.prepare(`
      UPDATE memory_index
      SET is_archived = 2, archived_at = ?
      WHERE id = ?
    `);

    stmt_cache.get_archived_count = db.prepare(`
      SELECT COUNT(*) as count FROM memory_index WHERE is_archived > 0
    `);

    console.warn('[archival-manager] Initialized successfully');
    return { success: true };
  } catch (error) {
    console.error('[archival-manager] Initialization failed:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Ensure is_archived column exists in memory_index table.
 * Migration adds:
 * - is_archived: INTEGER (0=active, 1=archived, 2=soft_deleted)
 * - archived_at: TEXT (ISO timestamp when archived)
 */
function ensure_archived_column() {
  if (!db) return;

  // Check if column exists
  const table_info = db.prepare(`PRAGMA table_info(memory_index)`).all();
  const column_names = table_info.map(col => col.name);

  if (!column_names.includes('is_archived')) {
    try {
      db.exec(`ALTER TABLE memory_index ADD COLUMN is_archived INTEGER DEFAULT 0`);
      console.warn('[archival-manager] Migration: Added is_archived column');
    } catch (e) {
      if (!e.message.includes('duplicate column')) throw e;
    }
  }

  if (!column_names.includes('archived_at')) {
    try {
      db.exec(`ALTER TABLE memory_index ADD COLUMN archived_at TEXT`);
      console.warn('[archival-manager] Migration: Added archived_at column');
    } catch (e) {
      if (!e.message.includes('duplicate column')) throw e;
    }
  }

  // Create index for archived queries
  try {
    db.exec(`CREATE INDEX IF NOT EXISTS idx_memory_archived ON memory_index(is_archived)`);
  } catch {
    // Ignore if index already exists
  }
}

/* ─────────────────────────────────────────────────────────────
   4. ARCHIVAL DETECTION
────────────────────────────────────────────────────────────────*/

/**
 * Get memories that should be archived (90+ days inactive).
 * Excludes constitutional and critical tier memories.
 *
 * @param {number} limit - Maximum candidates to return
 * @returns {Array} Array of memory objects that should be archived
 */
function get_archival_candidates(limit = ARCHIVAL_CONFIG.batchSize) {
  if (!db || !stmt_cache.get_candidates) {
    return [];
  }

  try {
    const candidates = stmt_cache.get_candidates.all(limit);

    // Filter using shouldArchive from tier-classifier
    return candidates.filter(memory => {
      // Map database fields to memory object format
      const mem = {
        id: memory.id,
        lastAccess: memory.last_accessed
          ? new Date(memory.last_accessed).toISOString()
          : null,
        last_access: memory.last_accessed,
        created_at: memory.created_at,
        importance_tier: memory.importance_tier,
      };

      return tierClassifier.shouldArchive(mem);
    });
  } catch (error) {
    console.error('[archival-manager] Error getting candidates:', error.message);
    archival_stats.errors.push({ time: Date.now(), error: error.message });
    return [];
  }
}

/**
 * Check if a specific memory should be archived.
 *
 * @param {number} memoryId - Memory ID to check
 * @returns {{ shouldArchive: boolean, memory: Object|null, reason: string }}
 */
function check_memory_archival_status(memoryId) {
  if (!db) {
    return { shouldArchive: false, memory: null, reason: 'Database not initialized' };
  }

  try {
    const memory = db.prepare(`
      SELECT id, spec_folder, file_path, title, last_accessed, created_at,
             importance_tier, is_archived
      FROM memory_index
      WHERE id = ?
    `).get(memoryId);

    if (!memory) {
      return { shouldArchive: false, memory: null, reason: 'Memory not found' };
    }

    if (memory.is_archived > 0) {
      return { shouldArchive: false, memory, reason: 'Already archived' };
    }

    if (['constitutional', 'critical'].includes(memory.importance_tier)) {
      return { shouldArchive: false, memory, reason: 'Protected tier' };
    }

    const mem = {
      lastAccess: memory.last_accessed
        ? new Date(memory.last_accessed).toISOString()
        : null,
      created_at: memory.created_at,
    };

    const should = tierClassifier.shouldArchive(mem);
    const daysSince = tierClassifier.calculateDaysSince(
      mem.lastAccess || memory.created_at
    );

    return {
      shouldArchive: should,
      memory,
      reason: should
        ? `Inactive for ${Math.floor(daysSince)} days (threshold: ${ARCHIVAL_CONFIG.daysThreshold})`
        : `Active within threshold (${Math.floor(daysSince)} days)`,
    };
  } catch (error) {
    return { shouldArchive: false, memory: null, reason: error.message };
  }
}

/* ─────────────────────────────────────────────────────────────
   5. ARCHIVAL ACTIONS
────────────────────────────────────────────────────────────────*/

/**
 * Archive a single memory by marking it in the database.
 *
 * @param {number} memoryId - Memory ID to archive
 * @param {string} action - Archive action: 'mark' or 'soft_delete'
 * @returns {{ success: boolean, action: string, error?: string }}
 */
function archive_memory(memoryId, action = ARCHIVAL_CONFIG.archiveAction) {
  if (!db) {
    return { success: false, action, error: 'Database not initialized' };
  }

  try {
    const now = new Date().toISOString();

    switch (action) {
      case 'mark':
        stmt_cache.mark_archived.run(now, memoryId);
        break;
      case 'soft_delete':
        stmt_cache.soft_delete.run(now, memoryId);
        break;
      case 'log_only':
        // Just log, don't modify database
        console.warn(`[archival-manager] Would archive memory ${memoryId} (log_only mode)`);
        return { success: true, action: 'log_only' };
      default:
        return { success: false, action, error: `Unknown action: ${action}` };
    }

    return { success: true, action };
  } catch (error) {
    return { success: false, action, error: error.message };
  }
}

/**
 * Archive a batch of memories.
 *
 * @param {Array<number>} memoryIds - Array of memory IDs to archive
 * @param {string} action - Archive action
 * @returns {{ archived: number, failed: number, results: Array }}
 */
function archive_batch(memoryIds, action = ARCHIVAL_CONFIG.archiveAction) {
  if (!db || !Array.isArray(memoryIds)) {
    return { archived: 0, failed: 0, results: [] };
  }

  const results = [];
  let archived = 0;
  let failed = 0;

  const tx = db.transaction(() => {
    for (const id of memoryIds) {
      const result = archive_memory(id, action);
      results.push({ id, ...result });
      if (result.success) {
        archived++;
      } else {
        failed++;
      }
    }
  });

  try {
    tx();
  } catch (error) {
    console.error('[archival-manager] Batch transaction failed:', error.message);
    return { archived: 0, failed: memoryIds.length, results: [], error: error.message };
  }

  return { archived, failed, results };
}

/**
 * Unarchive a memory (restore from archived state).
 *
 * @param {number} memoryId - Memory ID to restore
 * @returns {{ success: boolean, error?: string }}
 */
function unarchive_memory(memoryId) {
  if (!db) {
    return { success: false, error: 'Database not initialized' };
  }

  try {
    db.prepare(`
      UPDATE memory_index
      SET is_archived = 0, archived_at = NULL, last_accessed = ?
      WHERE id = ?
    `).run(Date.now(), memoryId);

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/* ─────────────────────────────────────────────────────────────
   6. BACKGROUND JOB
────────────────────────────────────────────────────────────────*/

/**
 * Run a single archival scan.
 * Detects and archives memories that have been inactive 90+ days.
 *
 * @returns {{ scanned: number, archived: number, failed: number, duration_ms: number }}
 */
function run_archival_scan() {
  if (!db) {
    return { scanned: 0, archived: 0, failed: 0, duration_ms: 0, error: 'Not initialized' };
  }

  if (is_running) {
    return { scanned: 0, archived: 0, failed: 0, duration_ms: 0, skipped: 'Already running' };
  }

  is_running = true;
  const start_time = Date.now();

  try {
    // Get candidates
    const candidates = get_archival_candidates(ARCHIVAL_CONFIG.batchSize);

    if (candidates.length === 0) {
      archival_stats.scans_completed++;
      archival_stats.last_scan_at = new Date().toISOString();
      archival_stats.last_scan_duration_ms = Date.now() - start_time;
      archival_stats.last_batch_count = 0;
      return { scanned: 0, archived: 0, failed: 0, duration_ms: archival_stats.last_scan_duration_ms };
    }

    // Archive candidates
    const ids = candidates.map(c => c.id);
    const result = archive_batch(ids, ARCHIVAL_CONFIG.archiveAction);

    // Update stats
    archival_stats.scans_completed++;
    archival_stats.total_archived += result.archived;
    archival_stats.last_scan_at = new Date().toISOString();
    archival_stats.last_scan_duration_ms = Date.now() - start_time;
    archival_stats.last_batch_count = candidates.length;

    if (result.archived > 0) {
      console.warn(`[archival-manager] Archived ${result.archived} memories (${result.failed} failed)`);
    }

    return {
      scanned: candidates.length,
      archived: result.archived,
      failed: result.failed,
      duration_ms: archival_stats.last_scan_duration_ms,
    };
  } catch (error) {
    console.error('[archival-manager] Scan error:', error.message);
    archival_stats.errors.push({ time: Date.now(), error: error.message });
    return { scanned: 0, archived: 0, failed: 0, duration_ms: Date.now() - start_time, error: error.message };
  } finally {
    is_running = false;
  }
}

/**
 * Start the background archival job.
 * Runs at configured interval (default: 1 hour).
 *
 * @returns {{ started: boolean, interval_ms: number }}
 */
function start_background_job() {
  if (!ARCHIVAL_CONFIG.enabled) {
    console.warn('[archival-manager] Background job disabled (ARCHIVAL_ENABLED=false)');
    return { started: false, interval_ms: 0, reason: 'Disabled' };
  }

  if (archival_interval) {
    return { started: false, interval_ms: ARCHIVAL_CONFIG.scanIntervalMs, reason: 'Already running' };
  }

  // Run initial scan after short delay
  setTimeout(() => {
    console.warn('[archival-manager] Running initial archival scan...');
    run_archival_scan();
  }, 5000);

  // Start periodic scanning
  archival_interval = setInterval(() => {
    run_archival_scan();
  }, ARCHIVAL_CONFIG.scanIntervalMs);

  console.warn(`[archival-manager] Background job started (interval: ${ARCHIVAL_CONFIG.scanIntervalMs}ms)`);
  return { started: true, interval_ms: ARCHIVAL_CONFIG.scanIntervalMs };
}

/**
 * Stop the background archival job.
 *
 * @returns {{ stopped: boolean }}
 */
function stop_background_job() {
  if (archival_interval) {
    clearInterval(archival_interval);
    archival_interval = null;
    console.warn('[archival-manager] Background job stopped');
    return { stopped: true };
  }
  return { stopped: false };
}

/**
 * Check if the background job is running.
 *
 * @returns {boolean}
 */
function is_background_job_running() {
  return archival_interval !== null;
}

/* ─────────────────────────────────────────────────────────────
   7. STATISTICS & DIAGNOSTICS
────────────────────────────────────────────────────────────────*/

/**
 * Get archival statistics.
 *
 * @returns {Object} Archival statistics
 */
function get_stats() {
  const archived_count = stmt_cache.get_archived_count
    ? stmt_cache.get_archived_count.get()?.count || 0
    : 0;

  return {
    ...archival_stats,
    current_archived_count: archived_count,
    is_running,
    background_job_active: archival_interval !== null,
    config: {
      enabled: ARCHIVAL_CONFIG.enabled,
      scan_interval_ms: ARCHIVAL_CONFIG.scanIntervalMs,
      batch_size: ARCHIVAL_CONFIG.batchSize,
      archive_action: ARCHIVAL_CONFIG.archiveAction,
      days_threshold: ARCHIVAL_CONFIG.daysThreshold,
    },
  };
}

/**
 * Get recent errors from archival operations.
 *
 * @param {number} limit - Maximum errors to return
 * @returns {Array} Recent errors
 */
function get_recent_errors(limit = 10) {
  return archival_stats.errors.slice(-limit);
}

/**
 * Reset archival statistics.
 */
function reset_stats() {
  archival_stats.scans_completed = 0;
  archival_stats.total_archived = 0;
  archival_stats.last_scan_at = null;
  archival_stats.last_scan_duration_ms = 0;
  archival_stats.last_batch_count = 0;
  archival_stats.errors = [];
}

/* ─────────────────────────────────────────────────────────────
   8. CLEANUP
────────────────────────────────────────────────────────────────*/

/**
 * Clean up resources (call on shutdown).
 */
function cleanup() {
  stop_background_job();
  db = null;
  stmt_cache = {
    get_candidates: null,
    mark_archived: null,
    soft_delete: null,
    get_archived_count: null,
  };
  console.warn('[archival-manager] Cleaned up');
}

/* ─────────────────────────────────────────────────────────────
   9. MODULE EXPORTS
────────────────────────────────────────────────────────────────*/

module.exports = {
  // Initialization
  init,
  cleanup,

  // Detection
  get_archival_candidates,
  check_memory_archival_status,

  // Actions
  archive_memory,
  archive_batch,
  unarchive_memory,

  // Background job
  run_archival_scan,
  start_background_job,
  stop_background_job,
  is_background_job_running,

  // Statistics
  get_stats,
  get_recent_errors,
  reset_stats,

  // Configuration (exposed for testing)
  ARCHIVAL_CONFIG,

  // Aliases (camelCase for consistency with other modules)
  getArchivalCandidates: get_archival_candidates,
  checkMemoryArchivalStatus: check_memory_archival_status,
  archiveMemory: archive_memory,
  archiveBatch: archive_batch,
  unarchiveMemory: unarchive_memory,
  runArchivalScan: run_archival_scan,
  startBackgroundJob: start_background_job,
  stopBackgroundJob: stop_background_job,
  isBackgroundJobRunning: is_background_job_running,
  getStats: get_stats,
  getRecentErrors: get_recent_errors,
  resetStats: reset_stats,
};

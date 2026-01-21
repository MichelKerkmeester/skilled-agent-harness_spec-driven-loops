// ───────────────────────────────────────────────────────────────
// CORE: DATABASE STATE
// ───────────────────────────────────────────────────────────────
'use strict';

const fs = require('fs');
const path = require('path');
const { DB_UPDATED_FILE } = require('./config');

/* ─────────────────────────────────────────────────────────────
   1. STATE VARIABLES
──────────────────────────────────────────────────────────────── */

/**
 * Timestamp of the last database check for external updates
 * @type {number}
 */
let last_db_check = 0;

/**
 * HIGH-002 FIX: Mutex for database reinitialization
 * Prevents race condition when multiple concurrent requests trigger reinitialize_database()
 * @type {Promise<void>|null}
 */
let reinitialize_mutex = null;

/**
 * Flag indicating if the embedding model has been warmed up
 * @type {boolean}
 */
let embedding_model_ready = false;

/**
 * Cache for constitutional memories
 * @type {Array|null}
 */
let constitutional_cache = null;

/**
 * Timestamp of constitutional cache creation
 * @type {number}
 */
let constitutional_cache_time = 0;

/* ─────────────────────────────────────────────────────────────
   2. VECTORINDEX MODULE REFERENCE
──────────────────────────────────────────────────────────────── */

let vector_index = null;
let checkpoints = null;
let access_tracker = null;
let hybrid_search = null;

/**
 * Initialize the db-state module with required dependencies
 * Must be called before using any database functions
 * @param {Object} deps - Dependencies object
 * @param {Object} deps.vectorIndex - Vector index module
 * @param {Object} deps.checkpoints - Checkpoints module
 * @param {Object} deps.accessTracker - Access tracker module
 * @param {Object} deps.hybridSearch - Hybrid search module
 */
function init(deps) {
  if (deps.vectorIndex) vector_index = deps.vectorIndex;
  if (deps.checkpoints) checkpoints = deps.checkpoints;
  if (deps.accessTracker) access_tracker = deps.accessTracker;
  if (deps.hybridSearch) hybrid_search = deps.hybridSearch;
}

/* ─────────────────────────────────────────────────────────────
   3. DATABASE CHANGE NOTIFICATION
──────────────────────────────────────────────────────────────── */

/**
 * Check if the database was updated externally (e.g., by generate-context.js)
 * and reinitialize the connection if needed.
 * BUG-001: Fixes race condition where MCP server misses external DB changes.
 * @returns {Promise<boolean>} True if database was reinitialized
 */
async function check_database_updated() {
  try {
    if (fs.existsSync(DB_UPDATED_FILE)) {
      const update_time = parseInt(fs.readFileSync(DB_UPDATED_FILE, 'utf8'), 10);
      if (update_time > last_db_check) {
        console.log('[db-state] Database updated externally, reinitializing connection...');
        last_db_check = update_time;
        // Reinitialize the database connection
        await reinitialize_database();
        return true;
      }
    }
  } catch (e) {
    // Ignore errors reading notification file
  }
  return false;
}

/**
 * Reinitialize the database connection after external changes
 * BUG-001: Closes and reopens DB to pick up external modifications.
 * HIGH-002 FIX: Uses mutex to prevent race condition with concurrent requests.
 */
async function reinitialize_database() {
  if (!vector_index) {
    throw new Error('db-state not initialized: vector_index is null');
  }

  // HIGH-002 FIX: If reinitialization is already in progress, wait for it to complete
  if (reinitialize_mutex) {
    console.log('[db-state] Reinitialization already in progress, waiting...');
    await reinitialize_mutex;
    return;
  }

  // HIGH-002 FIX: Create mutex promise to block concurrent reinitializations
  let resolve_mutex;
  reinitialize_mutex = new Promise(resolve => {
    resolve_mutex = resolve;
  });

  try {
    // Clear constitutional cache on reinitialize to prevent stale data
    constitutional_cache = null;
    constitutional_cache_time = 0;

    if (typeof vector_index.closeDb === 'function') {
      vector_index.closeDb();
    }
    // Database will be reinitialized on next access via initializeDb()
    vector_index.initializeDb();

    // Reinitialize dependent modules with new connection
    const database = vector_index.getDb();
    if (checkpoints) checkpoints.init(database);
    if (access_tracker) access_tracker.init(database);
    if (hybrid_search) hybrid_search.init(database, vector_index.vectorSearch);
    console.log('[db-state] Database connection reinitialized');
  } finally {
    // HIGH-002 FIX: Release mutex regardless of success/failure
    reinitialize_mutex = null;
    resolve_mutex();
  }
}

/* ─────────────────────────────────────────────────────────────
   4. PERSISTENT RATE LIMITING
──────────────────────────────────────────────────────────────── */

/**
 * Get the last index scan time from database config table
 * BUG-005: Persists rate limit state across server restarts.
 * @returns {Promise<number>} Unix timestamp of last scan, or 0 if never run
 */
async function get_last_scan_time() {
  if (!vector_index) {
    throw new Error('db-state not initialized: vector_index is null');
  }

  try {
    const db = vector_index.getDb();
    // Ensure config table exists
    db.exec(`
      CREATE TABLE IF NOT EXISTS config (
        key TEXT PRIMARY KEY,
        value TEXT
      )
    `);
    const row = db.prepare('SELECT value FROM config WHERE key = ?').get('last_index_scan');
    return row ? parseInt(row.value, 10) : 0;
  } catch (e) {
    console.error('[db-state] Error getting last scan time:', e.message);
    return 0;
  }
}

/**
 * Set the last index scan time in database config table
 * BUG-005: Persists rate limit state across server restarts.
 * @param {number} time - Unix timestamp to store
 */
async function set_last_scan_time(time) {
  if (!vector_index) {
    throw new Error('db-state not initialized: vector_index is null');
  }

  try {
    const db = vector_index.getDb();
    // Ensure config table exists
    db.exec(`
      CREATE TABLE IF NOT EXISTS config (
        key TEXT PRIMARY KEY,
        value TEXT
      )
    `);
    db.prepare('INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)').run('last_index_scan', time.toString());
  } catch (e) {
    console.error('[db-state] Error setting last scan time:', e.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   5. EMBEDDING MODEL READINESS
──────────────────────────────────────────────────────────────── */

/**
 * Check if the embedding model has been warmed up and is ready
 * @returns {boolean} True if embedding model is ready for use
 */
function is_embedding_model_ready() {
  return embedding_model_ready;
}

/**
 * Set the embedding model readiness state
 * @param {boolean} ready - Whether the model is ready
 */
function set_embedding_model_ready(ready) {
  embedding_model_ready = ready;
}

/**
 * Wait for embedding model to be ready with timeout
 * Prevents race conditions where startup scan tries to generate embeddings
 * before the model is fully loaded.
 * @param {number} timeout_ms - Maximum time to wait (default: 30 seconds)
 * @returns {Promise<boolean>} True if model ready, false if timeout
 */
async function wait_for_embedding_model(timeout_ms = 30000) {
  const start_time = Date.now();
  const check_interval = 500; // Check every 500ms

  while (!embedding_model_ready) {
    if (Date.now() - start_time > timeout_ms) {
      console.error('[db-state] Embedding model warmup timeout');
      return false;
    }
    await new Promise(resolve => setTimeout(resolve, check_interval));
  }
  return true;
}

/* ─────────────────────────────────────────────────────────────
   6. CONSTITUTIONAL CACHE ACCESSORS
──────────────────────────────────────────────────────────────── */

/**
 * Get the constitutional cache
 * @returns {Array|null} Cached constitutional memories or null
 */
function get_constitutional_cache() {
  return constitutional_cache;
}

/**
 * Set the constitutional cache
 * @param {Array} cache - Constitutional memories to cache
 */
function set_constitutional_cache(cache) {
  constitutional_cache = cache;
  constitutional_cache_time = Date.now();
}

/**
 * Get the constitutional cache timestamp
 * @returns {number} Timestamp of cache creation
 */
function get_constitutional_cache_time() {
  return constitutional_cache_time;
}

/**
 * Clear the constitutional cache
 */
function clear_constitutional_cache() {
  constitutional_cache = null;
  constitutional_cache_time = 0;
}

/* ─────────────────────────────────────────────────────────────
   7. EXPORTS
──────────────────────────────────────────────────────────────── */

module.exports = {
  // Initialization
  init,

  // BUG-001: External update detection
  check_database_updated,
  reinitialize_database,

  // BUG-005: Persistent rate limiting
  get_last_scan_time,
  set_last_scan_time,

  // Embedding model readiness
  is_embedding_model_ready,
  set_embedding_model_ready,
  wait_for_embedding_model,

  // Constitutional cache
  get_constitutional_cache,
  set_constitutional_cache,
  get_constitutional_cache_time,
  clear_constitutional_cache,

  // Backward compatibility aliases (camelCase → snake_case transition)
  checkDatabaseUpdated: check_database_updated,
  reinitializeDatabase: reinitialize_database,
  getLastScanTime: get_last_scan_time,
  setLastScanTime: set_last_scan_time,
  isEmbeddingModelReady: is_embedding_model_ready,
  setEmbeddingModelReady: set_embedding_model_ready,
  waitForEmbeddingModel: wait_for_embedding_model,
  getConstitutionalCache: get_constitutional_cache,
  setConstitutionalCache: set_constitutional_cache,
  getConstitutionalCacheTime: get_constitutional_cache_time,
  clearConstitutionalCache: clear_constitutional_cache
};

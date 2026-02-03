// ───────────────────────────────────────────────────────────────
// CORE: DATABASE STATE
// ───────────────────────────────────────────────────────────────
'use strict';

const fs = require('fs');
const path = require('path');
const { DB_UPDATED_FILE } = require('./config');

/* ─────────────────────────────────────────────────────────────
   1. STATE VARIABLES
────────────────────────────────────────────────────────────────*/

let last_db_check = 0;
let reinitialize_mutex = null;
let embedding_model_ready = false;
let constitutional_cache = null;
let constitutional_cache_time = 0;

/* ─────────────────────────────────────────────────────────────
   2. MODULE REFERENCES
────────────────────────────────────────────────────────────────*/

let vector_index = null;
let checkpoints = null;
let access_tracker = null;
let hybrid_search = null;

function init(deps) {
  if (deps.vectorIndex) vector_index = deps.vectorIndex;
  if (deps.checkpoints) checkpoints = deps.checkpoints;
  if (deps.accessTracker) access_tracker = deps.accessTracker;
  if (deps.hybridSearch) hybrid_search = deps.hybridSearch;
}

/* ─────────────────────────────────────────────────────────────
   3. DATABASE CHANGE NOTIFICATION
────────────────────────────────────────────────────────────────*/

async function check_database_updated() {
  try {
    if (fs.existsSync(DB_UPDATED_FILE)) {
      const update_time = parseInt(fs.readFileSync(DB_UPDATED_FILE, 'utf8'), 10);
      if (update_time > last_db_check) {
        console.log('[db-state] Database updated externally, reinitializing connection...');
        last_db_check = update_time;
        await reinitialize_database();
        return true;
      }
    }
  } catch (e) {
    // Ignore errors reading notification file
  }
  return false;
}

async function reinitialize_database() {
  if (!vector_index) {
    throw new Error('db-state not initialized: vector_index is null');
  }

  // If reinitialization is already in progress, wait for it
  if (reinitialize_mutex) {
    console.log('[db-state] Reinitialization already in progress, waiting...');
    await reinitialize_mutex;
    return;
  }

  let resolve_mutex;
  reinitialize_mutex = new Promise(resolve => {
    resolve_mutex = resolve;
  });

  try {
    constitutional_cache = null;
    constitutional_cache_time = 0;

    if (typeof vector_index.closeDb === 'function') {
      vector_index.closeDb();
    }
    vector_index.initializeDb();

    const database = vector_index.getDb();
    if (checkpoints) checkpoints.init(database);
    if (access_tracker) access_tracker.init(database);
    if (hybrid_search) hybrid_search.init(database, vector_index.vectorSearch);
    console.log('[db-state] Database connection reinitialized');
  } finally {
    reinitialize_mutex = null;
    resolve_mutex();
  }
}

/* ─────────────────────────────────────────────────────────────
   4. PERSISTENT RATE LIMITING
────────────────────────────────────────────────────────────────*/

async function get_last_scan_time() {
  if (!vector_index) {
    throw new Error('db-state not initialized: vector_index is null');
  }

  try {
    const db = vector_index.getDb();
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

async function set_last_scan_time(time) {
  if (!vector_index) {
    throw new Error('db-state not initialized: vector_index is null');
  }

  try {
    const db = vector_index.getDb();
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
────────────────────────────────────────────────────────────────*/

function is_embedding_model_ready() {
  return embedding_model_ready;
}

function set_embedding_model_ready(ready) {
  embedding_model_ready = ready;
}

async function wait_for_embedding_model(timeout_ms = 30000) {
  const start_time = Date.now();
  const check_interval = 500;

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
────────────────────────────────────────────────────────────────*/

function get_constitutional_cache() {
  return constitutional_cache;
}

function set_constitutional_cache(cache) {
  constitutional_cache = cache;
  constitutional_cache_time = Date.now();
}

function get_constitutional_cache_time() {
  return constitutional_cache_time;
}

function clear_constitutional_cache() {
  constitutional_cache = null;
  constitutional_cache_time = 0;
}

/* ─────────────────────────────────────────────────────────────
   7. EXPORTS
────────────────────────────────────────────────────────────────*/

module.exports = {
  // Initialization
  init,

  // External update detection
  check_database_updated,
  reinitialize_database,

  // Persistent rate limiting
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

  // Backward compatibility aliases
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

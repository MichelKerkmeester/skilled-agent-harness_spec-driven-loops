// ───────────────────────────────────────────────────────────────
// vector-index.js: Vector database for semantic memory search
// ───────────────────────────────────────────────────────────────
'use strict';

const Database = require('better-sqlite3');
const sqliteVec = require('sqlite-vec');
const path = require('path');
const os = require('os');
const fs = require('fs');
const crypto = require('crypto');
const { format_age_string } = require('./utils/format-helpers');
const { validate_file_path: validateFilePath } = require('../../shared/utils');

// Load search weights from config for configurable limits
const search_weights = require('../configs/search-weights.json');
const MAX_TRIGGERS_PER_MEMORY = search_weights.maxTriggersPerMemory || 10;

// Convert Float32Array to Buffer for sqlite-vec
function to_embedding_buffer(embedding) {
  return Buffer.from(embedding.buffer, embedding.byteOffset, embedding.byteLength);
}

// Lazy-load embeddings module to avoid circular dependencies
let embeddings_module = null;
function get_embeddings_module() {
  if (!embeddings_module) {
    embeddings_module = require('./embeddings');
  }
  return embeddings_module;
}

/* ───────────────────────────────────────────────────────────────
   1. CONFIGURATION
   ─────────────────────────────────────────────────────────────── */

const EMBEDDING_DIM = 768; // Legacy default - actual dim comes from provider profile

// Get embedding dimension from active profile
function get_embedding_dim() {
  try {
    const embeddings = get_embeddings_module();
    const profile = embeddings.getEmbeddingProfile();
    if (profile && profile.dim) {
      return profile.dim;
    }
    // Profile not initialized - check environment for Voyage (most common case)
    if (process.env.VOYAGE_API_KEY || process.env.EMBEDDINGS_PROVIDER === 'voyage') {
      console.log('[vector-index] Voyage detected but provider not warmed up - using 1024 dimensions');
      return 1024;
    }
    if (process.env.OPENAI_API_KEY || process.env.EMBEDDINGS_PROVIDER === 'openai') {
      console.log('[vector-index] OpenAI detected but provider not warmed up - using 1536 dimensions');
      return 1536;
    }
  } catch (e) {
    console.warn('[vector-index] Could not get embedding dimension from profile:', e.message);
  }
  console.warn('[vector-index] Using legacy 768 dimensions - ensure this matches your embedding provider');
  return EMBEDDING_DIM;
}

// Get confirmed embedding dimension with timeout
async function get_confirmed_embedding_dimension(timeout_ms = 5000) {
  const start = Date.now();
  while (Date.now() - start < timeout_ms) {
    const dim = get_embedding_dim();
    if (dim !== 768 || process.env.EMBEDDING_DIM === '768') {
      return dim;
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  console.warn('[vector-index] Using default dimension 768 after timeout');
  return 768;
}

// Track schema initialization state
let schema_initialized = false;

// Project-local database for memory storage
const DEFAULT_DB_DIR = process.env.MEMORY_DB_DIR ||
  path.resolve(__dirname, '../../database');
const DEFAULT_DB_PATH = process.env.MEMORY_DB_PATH || 
  path.join(DEFAULT_DB_DIR, 'context-index.sqlite');
const DB_PERMISSIONS = 0o600; // Owner read/write only

// Resolve database path based on embedding profile
function resolve_database_path() {
  if (process.env.MEMORY_DB_PATH) {
    return process.env.MEMORY_DB_PATH;
  }

  const embeddings = get_embeddings_module();
  const profile = embeddings.getEmbeddingProfile();
  
  if (!profile) {
    return DEFAULT_DB_PATH;
  }

  return profile.get_database_path(DEFAULT_DB_DIR);
}

// Schema version for migration tracking
const SCHEMA_VERSION = 3;

/* ───────────────────────────────────────────────────────────────
   2. SECURITY HELPERS (CWE-22, CWE-502 mitigations)
   ─────────────────────────────────────────────────────────────── */

// Allowed base directories for file reads
const ALLOWED_BASE_PATHS = [
  path.join(process.cwd(), 'specs'),
  path.join(process.cwd(), '.opencode'),
  ...(process.env.MEMORY_ALLOWED_PATHS ? process.env.MEMORY_ALLOWED_PATHS.split(':') : [])
].filter(Boolean);

// Local wrapper for shared validateFilePath
function validate_file_path_local(file_path) {
  return validateFilePath(file_path, ALLOWED_BASE_PATHS);
}

// Safely read file content with path validation
function safe_read_file(file_path) {
  const valid_path = validate_file_path_local(file_path);
  if (!valid_path) {
    return '';
  }

  try {
    if (fs.existsSync(valid_path)) {
      return fs.readFileSync(valid_path, 'utf-8');
    }
  } catch (err) {
    console.warn(`[vector-index] Could not read file ${valid_path}: ${err.message}`);
  }
  return '';
}

// Safely parse JSON with validation (CWE-502: Deserialization mitigation)
function safe_parse_json(json_string, default_value = []) {
  if (!json_string || typeof json_string !== 'string') {
    return default_value;
  }

  try {
    const parsed = JSON.parse(json_string);
    
    if (Array.isArray(parsed)) {
      return parsed.filter(item => 
        item && typeof item === 'object' && 
        !Array.isArray(item) &&
        !('__proto__' in item) && 
        !('constructor' in item) &&
        !('prototype' in item)
      );
    }
    
    if (typeof parsed === 'object' && parsed !== null) {
      if ('__proto__' in parsed || 'constructor' in parsed || 'prototype' in parsed) {
        console.warn('[vector-index] Blocked potential prototype pollution in JSON');
        return default_value;
      }
    }
    
    return parsed;
  } catch (err) {
    console.warn(`[vector-index] JSON parse error: ${err.message}`);
    return default_value;
  }
}

/* ───────────────────────────────────────────────────────────────
   3. DATABASE SINGLETON
   ─────────────────────────────────────────────────────────────── */

let db = null;
let db_path = DEFAULT_DB_PATH;
let sqlite_vec_available = true;
let shutting_down = false;

// Constitutional memory caching to avoid repeated DB queries
let constitutional_cache = new Map();
const CONSTITUTIONAL_CACHE_TTL = 300000; // 5 minute TTL

// Track database file modification time for cache invalidation
let last_db_mod_time = 0;

// Check if constitutional cache is valid considering external DB edits
function is_constitutional_cache_valid() {
  if (constitutional_cache.size === 0) return false;
  
  try {
    const current_db_path = resolve_database_path();
    if (fs.existsSync(current_db_path)) {
      const stats = fs.statSync(current_db_path);
      if (stats.mtimeMs > last_db_mod_time) {
        last_db_mod_time = stats.mtimeMs;
        return false;
      }
    }
  } catch (e) {
    // If we can't check, assume cache is valid
  }
  
  return true;
}

/* ───────────────────────────────────────────────────────────────
   4. PREPARED STATEMENT CACHING (PERF-1)
   ─────────────────────────────────────────────────────────────── */

let prepared_statements = null;

// Initialize and cache prepared statements for common queries
function init_prepared_statements(database) {
  if (prepared_statements) return prepared_statements;
  
  prepared_statements = {
    count_all: database.prepare('SELECT COUNT(*) as count FROM memory_index'),
    count_by_folder: database.prepare('SELECT COUNT(*) as count FROM memory_index WHERE spec_folder = ?'),
    get_by_id: database.prepare('SELECT * FROM memory_index WHERE id = ?'),
    get_by_path: database.prepare('SELECT * FROM memory_index WHERE file_path = ?'),
    get_by_folder_and_path: database.prepare('SELECT id FROM memory_index WHERE spec_folder = ? AND file_path = ? AND (anchor_id = ? OR (anchor_id IS NULL AND ? IS NULL))'),
    get_stats: database.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN embedding_status = 'success' THEN 1 ELSE 0 END) as complete,
        SUM(CASE WHEN embedding_status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN embedding_status = 'failed' THEN 1 ELSE 0 END) as failed
      FROM memory_index
    `),
    list_base: database.prepare('SELECT * FROM memory_index ORDER BY created_at DESC LIMIT ? OFFSET ?')
  };
  
  return prepared_statements;
}

// Clear prepared statements cache (call when database is reset)
function clear_prepared_statements() {
  prepared_statements = null;
}

// Get cached constitutional memories or fetch from database
// BUG-004: Now checks for external database modifications before using cache
function get_constitutional_memories(database, spec_folder = null) {
  const cache_key = spec_folder || 'global';
  const now = Date.now();
  const cached = constitutional_cache.get(cache_key);
  
  // BUG-004: Check both TTL and external DB modifications
  if (cached && (now - cached.timestamp) < CONSTITUTIONAL_CACHE_TTL && is_constitutional_cache_valid()) {
    return cached.data;
  }
  
  // Fetch from database
  const constitutional_sql = `
    SELECT m.*, 100.0 as similarity, 1.0 as effective_importance,
           'constitutional' as source_type
    FROM memory_index m
    WHERE m.importance_tier = 'constitutional'
      AND m.embedding_status = 'success'
      ${spec_folder ? 'AND m.spec_folder = ?' : ''}
    ORDER BY m.importance_weight DESC, m.created_at DESC
  `;
  
  const params = spec_folder ? [spec_folder] : [];
  let results = database.prepare(constitutional_sql).all(...params);
  
  // Limit constitutional results to ~2000 tokens (~8000 chars, ~20 memories avg)
  const MAX_CONSTITUTIONAL_TOKENS = 2000;
  const TOKENS_PER_MEMORY = 100;
  const max_constitutional_count = Math.floor(MAX_CONSTITUTIONAL_TOKENS / TOKENS_PER_MEMORY);
  results = results.slice(0, max_constitutional_count);
  
  // Mark as constitutional for client identification
  results = results.map(row => {
    if (row.trigger_phrases) {
      row.trigger_phrases = JSON.parse(row.trigger_phrases);
    }
    row.isConstitutional = true;
    return row;
  });
  
  // Cache the results
  constitutional_cache.set(cache_key, { data: results, timestamp: now });
  
  return results;
}

// Clear constitutional cache (call when tier changes)
function clear_constitutional_cache(spec_folder = null) {
  if (spec_folder) {
    constitutional_cache.delete(spec_folder);
  } else {
    constitutional_cache.clear();
  }
}

/* ───────────────────────────────────────────────────────────────
   5. SCHEMA VERSION TRACKING (M19 fix)
   ─────────────────────────────────────────────────────────────── */

// Run schema migrations from one version to another
// Each migration is idempotent - safe to run multiple times
function run_migrations(database, from_version, to_version) {
  const migrations = {
    1: () => {
      // v0 -> v1: Initial schema (already exists via create_schema)
    },
    2: () => {
      // v1 -> v2: Add idx_history_timestamp index
      try {
        database.exec('CREATE INDEX IF NOT EXISTS idx_history_timestamp ON memory_history(timestamp DESC)');
        console.log('[VectorIndex] Migration v2: Created idx_history_timestamp index');
      } catch (e) {
        if (!e.message.includes('already exists')) {
          console.warn('[VectorIndex] Migration v2 warning:', e.message);
        }
      }
    },
    3: () => {
      // v2 -> v3: Add related_memories column
      try {
        database.exec('ALTER TABLE memory_index ADD COLUMN related_memories TEXT');
        console.log('[VectorIndex] Migration v3: Added related_memories column');
      } catch (e) {
        if (!e.message.includes('duplicate column')) {
          console.warn('[VectorIndex] Migration v3 warning:', e.message);
        }
      }
    }
  };

  for (let v = from_version + 1; v <= to_version; v++) {
    if (migrations[v]) {
      console.log(`[VectorIndex] Running migration v${v}`);
      migrations[v]();
    }
  }
}

// Ensure schema version table exists and run any pending migrations
function ensure_schema_version(database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS schema_version (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      version INTEGER NOT NULL,
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);

  const row = database.prepare('SELECT version FROM schema_version WHERE id = 1').get();
  const current_version = row ? row.version : 0;

  if (current_version < SCHEMA_VERSION) {
    console.log(`[VectorIndex] Migrating schema from v${current_version} to v${SCHEMA_VERSION}`);
    run_migrations(database, current_version, SCHEMA_VERSION);

    database.prepare(`
      INSERT OR REPLACE INTO schema_version (id, version, updated_at)
      VALUES (1, ?, datetime('now'))
    `).run(SCHEMA_VERSION);
    
    console.log(`[VectorIndex] Schema migration complete: v${SCHEMA_VERSION}`);
  }

  return current_version;
}

// Initialize or get database connection. Creates schema on first use.
function initialize_db(custom_path = null) {
  if (db && !custom_path) {
    return db;
  }

  const target_path = custom_path || resolve_database_path();

  // Ensure directory exists
  const dir = path.dirname(target_path);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
  }

  // Open database
  db = new Database(target_path);

  // Load sqlite-vec extension with graceful degradation (NFR-R01, CHK123)
  try {
    sqliteVec.load(db);
    sqlite_vec_available = true;
  } catch (vec_error) {
    sqlite_vec_available = false;
    console.warn(`[vector-index] sqlite-vec extension not available: ${vec_error.message}`);
    console.warn('[vector-index] Falling back to anchor-only mode (no vector search)');
    console.warn('[vector-index] Install sqlite-vec: brew install sqlite-vec (macOS)');
  }

  // Enable WAL mode for concurrent access (FR-010b)
  db.pragma('journal_mode = WAL');

  // Enable foreign key enforcement (P0-004: Database integrity)
  db.pragma('foreign_keys = ON');

  // Performance pragmas (P1 optimization - 20-50% faster queries/writes)
  db.pragma('cache_size = -64000');
  db.pragma('mmap_size = 268435456');
  db.pragma('synchronous = NORMAL');
  db.pragma('temp_store = MEMORY');

  // Create schema if needed
  create_schema(db);

  // Run schema migrations (M19 fix - version-tracked migrations)
  ensure_schema_version(db);

  // Set file permissions (T021)
  if (!custom_path) {
    try {
      fs.chmodSync(target_path, DB_PERMISSIONS);
    } catch (err) {
      console.warn(`[vector-index] Could not set permissions on ${target_path}: ${err.message}`);
    }
  }

  db_path = target_path;
  return db;
}

// Migrate existing database to add confidence tracking columns
// Wraps ALTER TABLE in try-catch to handle concurrent migrations (P1-010)
function migrate_confidence_columns(database) {
  const columns = database.prepare(`PRAGMA table_info(memory_index)`).all();
  const column_names = columns.map(c => c.name);

  if (!column_names.includes('confidence')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN confidence REAL DEFAULT 0.5`);
      console.warn('[vector-index] Migration: Added confidence column');
    } catch (e) {
      if (!e.message.includes('duplicate column')) throw e;
    }
  }

  if (!column_names.includes('validation_count')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN validation_count INTEGER DEFAULT 0`);
      console.warn('[vector-index] Migration: Added validation_count column');
    } catch (e) {
      if (!e.message.includes('duplicate column')) throw e;
    }
  }

  if (!column_names.includes('importance_tier')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN importance_tier TEXT DEFAULT 'normal'`);
      console.warn('[vector-index] Migration: Added importance_tier column');
    } catch (e) {
      if (!e.message.includes('duplicate column')) throw e;
    }
    try {
      database.exec(`CREATE INDEX IF NOT EXISTS idx_importance_tier ON memory_index(importance_tier)`);
      console.warn('[vector-index] Migration: Created idx_importance_tier index');
    } catch (e) {
      // Index might already exist
    }
  }

  if (!column_names.includes('context_type')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN context_type TEXT DEFAULT 'general'`);
      console.warn('[vector-index] Migration: Added context_type column');
    } catch (e) {
      if (!e.message.includes('duplicate column')) throw e;
    }
  }

  if (!column_names.includes('content_hash')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN content_hash TEXT`);
      console.warn('[vector-index] Migration: Added content_hash column');
    } catch (e) {
      if (!e.message.includes('duplicate column')) throw e;
    }
  }

  if (!column_names.includes('channel')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN channel TEXT DEFAULT 'default'`);
      console.warn('[vector-index] Migration: Added channel column');
    } catch (e) {
      if (!e.message.includes('duplicate column')) throw e;
    }
  }

  if (!column_names.includes('session_id')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN session_id TEXT`);
      console.warn('[vector-index] Migration: Added session_id column');
    } catch (e) {
      if (!e.message.includes('duplicate column')) throw e;
    }
  }

  if (!column_names.includes('base_importance')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN base_importance REAL DEFAULT 0.5`);
      console.warn('[vector-index] Migration: Added base_importance column');
    } catch (e) {
      if (!e.message.includes('duplicate column')) throw e;
    }
  }

  if (!column_names.includes('decay_half_life_days')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN decay_half_life_days REAL DEFAULT 90.0`);
      console.warn('[vector-index] Migration: Added decay_half_life_days column');
    } catch (e) {
      if (!e.message.includes('duplicate column')) throw e;
    }
  }

  if (!column_names.includes('is_pinned')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN is_pinned INTEGER DEFAULT 0`);
      console.warn('[vector-index] Migration: Added is_pinned column');
    } catch (e) {
      if (!e.message.includes('duplicate column')) throw e;
    }
  }

  if (!column_names.includes('last_accessed')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN last_accessed INTEGER DEFAULT 0`);
      console.warn('[vector-index] Migration: Added last_accessed column');
    } catch (e) {
      if (!e.message.includes('duplicate column')) throw e;
    }
  }

  if (!column_names.includes('expires_at')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN expires_at DATETIME`);
      console.warn('[vector-index] Migration: Added expires_at column');
    } catch (e) {
      if (!e.message.includes('duplicate column')) throw e;
    }
  }

  // P0-005: Add related_memories column
  if (!column_names.includes('related_memories')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN related_memories TEXT`);
      console.warn('[vector-index] Migration: Added related_memories column');
    } catch (e) {
      if (!e.message.includes('duplicate column')) throw e;
    }
  }
}

// Migrate existing database to support constitutional tier
function migrate_constitutional_tier(database) {
  const table_info = database.prepare(`
    SELECT sql FROM sqlite_master
    WHERE type='table' AND name='memory_index'
  `).get();

  if (table_info && table_info.sql) {
    if (table_info.sql.includes("'constitutional'")) {
      return;
    }

    const constitutional_count = database.prepare(`
      SELECT COUNT(*) as count FROM memory_index
      WHERE importance_tier = 'constitutional'
    `).get().count;

    if (constitutional_count > 0) {
      console.warn(`[vector-index] Found ${constitutional_count} constitutional memories`);
    }

    console.warn('[vector-index] Migration: Constitutional tier available');
    console.warn('[vector-index] Note: For existing databases, constitutional tier may require manual schema update');
    console.warn('[vector-index] New databases will have the updated constraint automatically');
  }
}

/**
 * TIMESTAMP FORMAT NOTES (P2-002):
 * 
 * The database uses INTENTIONALLY mixed timestamp formats for different purposes:
 * 
 * | Column                | Type     | Format              | Purpose                    |
 * |-----------------------|----------|---------------------|----------------------------|
 * | created_at            | TEXT     | ISO 8601 string     | Human-readable audit trail |
 * | updated_at            | TEXT     | ISO 8601 string     | Human-readable audit trail |
 * | last_accessed         | INTEGER  | Unix timestamp (ms) | Performance sorting/decay  |
 * | embedding_generated_at| TEXT     | ISO 8601 string     | Audit trail                |
 * | last_retry_at         | TEXT     | ISO 8601 string     | Retry scheduling           |
 * | expires_at            | DATETIME | SQLite native       | Expiry comparisons         |
 * 
 * DESIGN RATIONALE:
 * - TEXT (ISO 8601) for columns primarily used for display/logging
 * - INTEGER (Unix timestamp) for columns used in calculations (decay, sorting)
 * - This is NOT a duplicate column issue - it's intentional optimization
 * 
 * CLARIFICATION (L11 Bug Report - INVALID):
 * There is NO "last_accessed_at" column. Only "last_accessed" (INTEGER) exists.
 * The bug report claiming duplicate columns was based on a misreading.
 * See: recordAccess() at line ~2500 for usage of last_accessed.
 * 
 * Future consideration: If standardization is desired, prefer TEXT ISO format
 * for consistency, but this would require migration and performance testing.
 */

// P2-001: Create indexes for commonly queried columns
function create_common_indexes(database) {
  try {
    database.exec(`CREATE INDEX IF NOT EXISTS idx_file_path ON memory_index(file_path)`);
    console.log('[vector-index] Created idx_file_path index');
  } catch (err) {
    // Index may already exist
  }

  try {
    database.exec(`CREATE INDEX IF NOT EXISTS idx_content_hash ON memory_index(content_hash)`);
    console.log('[vector-index] Created idx_content_hash index');
  } catch (err) {
    // Index may already exist
  }

  try {
    database.exec(`CREATE INDEX IF NOT EXISTS idx_last_accessed ON memory_index(last_accessed DESC)`);
    console.log('[vector-index] Created idx_last_accessed index');
  } catch (err) {
    // Index may already exist
  }

  try {
    database.exec(`CREATE INDEX IF NOT EXISTS idx_importance_tier ON memory_index(importance_tier)`);
    console.log('[vector-index] Created idx_importance_tier index');
  } catch (err) {
    // Index may already exist
  }

  // H5 FIX: Add idx_history_timestamp index for memory_history table
  try {
    database.exec(`CREATE INDEX IF NOT EXISTS idx_history_timestamp ON memory_history(timestamp DESC)`);
    console.log('[vector-index] Created idx_history_timestamp index');
  } catch (err) {
    if (!err.message.includes('already exists')) {
      console.warn('[vector-index] Failed to create idx_history_timestamp:', err.message);
    }
  }
}

// Create database schema
function create_schema(database) {
  const table_exists = database.prepare(`
    SELECT name FROM sqlite_master
    WHERE type='table' AND name='memory_index'
  `).get();

  if (table_exists) {
    migrate_confidence_columns(database);
    migrate_constitutional_tier(database);
    create_common_indexes(database);
    return;
  }

  // Create memory_index table (metadata only)
  database.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY,
      spec_folder TEXT NOT NULL,
      file_path TEXT NOT NULL,
      anchor_id TEXT,
      title TEXT,
      trigger_phrases TEXT,
      importance_weight REAL DEFAULT 0.5,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      embedding_model TEXT,
      embedding_generated_at TEXT,
      embedding_status TEXT DEFAULT 'pending' CHECK(embedding_status IN ('pending', 'success', 'failed', 'retry')),
      retry_count INTEGER DEFAULT 0,
      last_retry_at TEXT,
      failure_reason TEXT,
      base_importance REAL DEFAULT 0.5,
      decay_half_life_days REAL DEFAULT 90.0,
      is_pinned INTEGER DEFAULT 0,
      access_count INTEGER DEFAULT 0,
      last_accessed INTEGER DEFAULT 0,
      importance_tier TEXT DEFAULT 'normal' CHECK(importance_tier IN ('constitutional', 'critical', 'important', 'normal', 'temporary', 'deprecated')),
      session_id TEXT,
      context_type TEXT DEFAULT 'general' CHECK(context_type IN ('research', 'implementation', 'decision', 'discovery', 'general')),
      channel TEXT DEFAULT 'default',
      content_hash TEXT,
      expires_at DATETIME,
      confidence REAL DEFAULT 0.5,
      validation_count INTEGER DEFAULT 0,
      UNIQUE(spec_folder, file_path, anchor_id)
    )
  `);

  // Create vec_memories virtual table (only if sqlite-vec is available)
  if (sqlite_vec_available) {
    const embedding_dim = get_embedding_dim();
    database.exec(`
      CREATE VIRTUAL TABLE vec_memories USING vec0(
        embedding FLOAT[${embedding_dim}]
      )
    `);
  }

  // Create FTS5 virtual table
  database.exec(`
    CREATE VIRTUAL TABLE IF NOT EXISTS memory_fts USING fts5(
      title, trigger_phrases, file_path,
      content='memory_index', content_rowid='id'
    )
  `);

  // Create FTS5 sync triggers
  database.exec(`
    CREATE TRIGGER IF NOT EXISTS memory_fts_insert AFTER INSERT ON memory_index BEGIN
      INSERT INTO memory_fts(rowid, title, trigger_phrases, file_path)
      VALUES (new.id, new.title, new.trigger_phrases, new.file_path);
    END
  `);

  database.exec(`
    CREATE TRIGGER IF NOT EXISTS memory_fts_update AFTER UPDATE ON memory_index BEGIN
      INSERT INTO memory_fts(memory_fts, rowid, title, trigger_phrases, file_path)
      VALUES ('delete', old.id, old.title, old.trigger_phrases, old.file_path);
      INSERT INTO memory_fts(rowid, title, trigger_phrases, file_path)
      VALUES (new.id, new.title, new.trigger_phrases, new.file_path);
    END
  `);

  database.exec(`
    CREATE TRIGGER IF NOT EXISTS memory_fts_delete AFTER DELETE ON memory_index BEGIN
      INSERT INTO memory_fts(memory_fts, rowid, title, trigger_phrases, file_path)
      VALUES ('delete', old.id, old.title, old.trigger_phrases, old.file_path);
    END
  `);

  // Create memory_history and checkpoints tables
  database.exec(`
    CREATE TABLE IF NOT EXISTS memory_history (
      id TEXT PRIMARY KEY,
      memory_id INTEGER NOT NULL,
      prev_value TEXT,
      new_value TEXT,
      event TEXT NOT NULL CHECK(event IN ('ADD', 'UPDATE', 'DELETE')),
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      is_deleted INTEGER DEFAULT 0,
      actor TEXT DEFAULT 'system',
      FOREIGN KEY (memory_id) REFERENCES memory_index(id)
    )
  `);

  database.exec(`
    CREATE TABLE IF NOT EXISTS checkpoints (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL,
      spec_folder TEXT,
      git_branch TEXT,
      memory_snapshot BLOB,
      file_snapshot BLOB,
      metadata TEXT
    )
  `);

  // Create indexes
  database.exec(`
    CREATE INDEX idx_spec_folder ON memory_index(spec_folder);
    CREATE INDEX idx_created_at ON memory_index(created_at);
    CREATE INDEX idx_importance ON memory_index(importance_weight DESC);
    CREATE INDEX idx_embedding_status ON memory_index(embedding_status);
    CREATE INDEX idx_retry_eligible ON memory_index(embedding_status, retry_count, last_retry_at)
  `);

  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_importance_tier ON memory_index(importance_tier);
    CREATE INDEX IF NOT EXISTS idx_access_importance ON memory_index(access_count DESC, importance_weight DESC);
    CREATE INDEX IF NOT EXISTS idx_memories_scope ON memory_index(spec_folder, session_id, context_type);
    CREATE INDEX IF NOT EXISTS idx_channel ON memory_index(channel);
    CREATE INDEX IF NOT EXISTS idx_history_memory ON memory_history(memory_id, timestamp);
    CREATE INDEX IF NOT EXISTS idx_history_timestamp ON memory_history(timestamp DESC);
    CREATE INDEX IF NOT EXISTS idx_checkpoints_spec ON checkpoints(spec_folder);
  `);

  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_file_path ON memory_index(file_path);
    CREATE INDEX IF NOT EXISTS idx_content_hash ON memory_index(content_hash);
    CREATE INDEX IF NOT EXISTS idx_last_accessed ON memory_index(last_accessed DESC);
  `);

  console.warn('[vector-index] Schema created successfully');
}

/* ───────────────────────────────────────────────────────────────
   6. CORE OPERATIONS
   ─────────────────────────────────────────────────────────────── */

// Index a memory with its embedding (synchronized INSERT)
function index_memory(params) {
  const database = initialize_db();

  const {
    specFolder,
    filePath,
    anchorId = null,
    title = null,
    triggerPhrases = [],
    importanceWeight = 0.5,
    embedding
  } = params;

  if (!embedding) {
    throw new Error('Embedding is required');
  }
  
  const expected_dim = get_embedding_dim();
  if (embedding.length !== expected_dim) {
    console.warn(`[vector-index] Embedding dimension mismatch: expected ${expected_dim}, got ${embedding.length}`);
    throw new Error(`Embedding must be ${expected_dim} dimensions, got ${embedding.length}`);
  }

  const now = new Date().toISOString();
  const triggers_json = JSON.stringify(triggerPhrases);
  const embedding_buffer = to_embedding_buffer(embedding);

  // Check for existing entry (PERF-1: use cached prepared statement)
  const stmts = init_prepared_statements(database);
  const existing = stmts.get_by_folder_and_path.get(specFolder, filePath, anchorId, anchorId);

  if (existing) {
    return update_memory({
      id: existing.id,
      title,
      triggerPhrases,
      importanceWeight,
      embedding
    });
  }

  // BUG-002 + BUG-057: Use database.transaction() wrapper for proper nested transaction support
  const index_memory_tx = database.transaction(() => {
    const embedding_status = sqlite_vec_available ? 'success' : 'pending';

    const result = database.prepare(`
      INSERT INTO memory_index (
        spec_folder, file_path, anchor_id, title, trigger_phrases,
        importance_weight, created_at, updated_at, embedding_model,
        embedding_generated_at, embedding_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      specFolder, filePath, anchorId, title, triggers_json,
      importanceWeight, now, now, get_embeddings_module().get_model_name(), now, embedding_status
    );

    const row_id = BigInt(result.lastInsertRowid);
    const metadata_id = Number(row_id);

    if (sqlite_vec_available) {
      database.prepare(`
        INSERT INTO vec_memories (rowid, embedding) VALUES (?, ?)
      `).run(row_id, embedding_buffer);
    }

    return metadata_id;
  });

  return index_memory_tx();
}

// Update an existing memory entry
function update_memory(params) {
  const database = initialize_db();

  const { id, title, triggerPhrases, importanceWeight, importanceTier, embedding } = params;

  const now = new Date().toISOString();

  const update_memory_tx = database.transaction(() => {
    const updates = ['updated_at = ?'];
    const values = [now];

    if (title !== undefined) {
      updates.push('title = ?');
      values.push(title);
    }
    if (triggerPhrases !== undefined) {
      updates.push('trigger_phrases = ?');
      values.push(JSON.stringify(triggerPhrases));
    }
    if (importanceWeight !== undefined) {
      updates.push('importance_weight = ?');
      values.push(importanceWeight);
    }
    if (importanceTier !== undefined) {
      updates.push('importance_tier = ?');
      values.push(importanceTier);
      clear_constitutional_cache();
    }
    if (embedding) {
      updates.push('embedding_model = ?');
      updates.push('embedding_generated_at = ?');
      updates.push('embedding_status = ?');
      values.push(get_embeddings_module().get_model_name(), now, 'success');
    }

    values.push(id);

    database.prepare(`
      UPDATE memory_index SET ${updates.join(', ')} WHERE id = ?
    `).run(...values);

    if (embedding && sqlite_vec_available) {
      const expected_dim = get_embedding_dim();
      if (embedding.length !== expected_dim) {
        console.warn(`[vector-index] Embedding dimension mismatch in update: expected ${expected_dim}, got ${embedding.length}`);
        throw new Error(`Embedding must be ${expected_dim} dimensions, got ${embedding.length}`);
      }
      
      const embedding_buffer = to_embedding_buffer(embedding);
      database.prepare('DELETE FROM vec_memories WHERE rowid = ?').run(BigInt(id));
      database.prepare(`
        INSERT INTO vec_memories (rowid, embedding) VALUES (?, ?)
      `).run(BigInt(id), embedding_buffer);
    }

    return id;
  });

  return update_memory_tx();
}

// Delete a memory entry (synchronized DELETE with cascade)
function delete_memory(id) {
  const database = initialize_db();

  const delete_memory_tx = database.transaction(() => {
    database.prepare('DELETE FROM memory_history WHERE memory_id = ?').run(id);

    if (sqlite_vec_available) {
      try {
        database.prepare('DELETE FROM vec_memories WHERE rowid = ?').run(BigInt(id));
      } catch (e) {
        // Vector may not exist for this memory
      }
    }

    const result = database.prepare('DELETE FROM memory_index WHERE id = ?').run(id);

    clear_search_cache();
    clear_constitutional_cache();

    return result.changes > 0;
  });

  return delete_memory_tx();
}

// Delete memory by spec folder and file path
function delete_memory_by_path(spec_folder, file_path, anchor_id = null) {
  const database = initialize_db();

  const row = database.prepare(`
    SELECT id FROM memory_index
    WHERE spec_folder = ? AND file_path = ? AND (anchor_id = ? OR (anchor_id IS NULL AND ? IS NULL))
  `).get(spec_folder, file_path, anchor_id, anchor_id);

  if (row) {
    return delete_memory(row.id);
  }
  return false;
}

// Get memory by ID
function get_memory(id) {
  const database = initialize_db();

  const stmts = init_prepared_statements(database);
  const row = stmts.get_by_id.get(id);

  if (row) {
    if (row.trigger_phrases) {
      row.trigger_phrases = JSON.parse(row.trigger_phrases);
    }
    row.isConstitutional = row.importance_tier === 'constitutional';
  }

  return row || null;
}

// Get all memories for a spec folder
function get_memories_by_folder(spec_folder) {
  const database = initialize_db();

  const rows = database.prepare(`
    SELECT * FROM memory_index WHERE spec_folder = ? ORDER BY created_at DESC
  `).all(spec_folder);

  return rows.map(row => {
    if (row.trigger_phrases) {
      row.trigger_phrases = JSON.parse(row.trigger_phrases);
    }
    row.isConstitutional = row.importance_tier === 'constitutional';
    return row;
  });
}

// Get total memory count
function get_memory_count() {
  const database = initialize_db();
  const stmts = init_prepared_statements(database);
  const result = stmts.count_all.get();
  return result.count;
}

// Get count by embedding status
function get_status_counts() {
  const database = initialize_db();

  const rows = database.prepare(`
    SELECT embedding_status, COUNT(*) as count
    FROM memory_index
    GROUP BY embedding_status
  `).all();

  const counts = { pending: 0, success: 0, failed: 0, retry: 0 };
  for (const row of rows) {
    counts[row.embedding_status] = row.count;
  }

  return counts;
}

// Get overall statistics for the memory index
function get_stats() {
  const counts = get_status_counts();
  const total = counts.pending + counts.success + counts.failed + counts.retry;

  return {
    total,
    ...counts
  };
}

/* ───────────────────────────────────────────────────────────────
   7. VECTOR SEARCH
   ─────────────────────────────────────────────────────────────── */

// Search memories by vector similarity
// Constitutional tier memories are ALWAYS included at top of results
function vector_search(query_embedding, options = {}) {
  if (!sqlite_vec_available) {
    console.warn('[vector-index] Vector search unavailable - sqlite-vec not loaded');
    return [];
  }

  const database = initialize_db();

  const {
    limit = 10,
    specFolder = null,
    minSimilarity = 0,
    useDecay = true,
    tier = null,
    contextType = null,
    includeConstitutional = true
  } = options;

  const query_buffer = to_embedding_buffer(query_embedding);
  const max_distance = 2 * (1 - minSimilarity / 100);

  const decay_expr = useDecay
    ? `CASE WHEN m.is_pinned = 1 THEN m.importance_weight
        ELSE m.importance_weight * POWER(0.5, (julianday('now') - julianday(m.updated_at)) / COALESCE(NULLIF(m.decay_half_life_days, 0), 90.0))
       END`
    : 'm.importance_weight';

  // Constitutional memories: Always surface at top
  let constitutional_results = [];

  if (includeConstitutional && tier !== 'constitutional') {
    constitutional_results = get_constitutional_memories(database, specFolder);
  }

  // Regular vector search
  const where_clauses = ['m.embedding_status = \'success\''];
  const params = [query_buffer];

  where_clauses.push('(m.expires_at IS NULL OR m.expires_at > datetime(\'now\'))');

  if (tier === 'deprecated') {
    where_clauses.push('m.importance_tier = ?');
    params.push('deprecated');
  } else if (tier === 'constitutional') {
    where_clauses.push('m.importance_tier = ?');
    params.push('constitutional');
  } else if (tier) {
    where_clauses.push('m.importance_tier = ?');
    params.push(tier);
  } else {
    where_clauses.push('(m.importance_tier IS NULL OR m.importance_tier NOT IN (\'deprecated\', \'constitutional\'))');
  }

  if (specFolder) {
    where_clauses.push('m.spec_folder = ?');
    params.push(specFolder);
  }

  if (contextType) {
    where_clauses.push('m.context_type = ?');
    params.push(contextType);
  }

  const adjusted_limit = Math.max(1, limit - constitutional_results.length);
  params.push(max_distance, adjusted_limit);

  const sql = `
    SELECT sub.*,
           ROUND((1 - sub.distance / 2) * 100, 2) as similarity
    FROM (
      SELECT m.*, vec_distance_cosine(v.embedding, ?) as distance,
             ${decay_expr} as effective_importance
      FROM memory_index m
      JOIN vec_memories v ON m.id = v.rowid
      WHERE ${where_clauses.join(' AND ')}
    ) sub
    WHERE sub.distance <= ?
    ORDER BY (sub.distance - (sub.effective_importance * 0.1)) ASC
    LIMIT ?
  `;

  const rows = database.prepare(sql).all(...params);

  const regular_results = rows.map(row => {
    if (row.trigger_phrases) {
      row.trigger_phrases = JSON.parse(row.trigger_phrases);
    }
    row.isConstitutional = row.importance_tier === 'constitutional';
    return row;
  });

  return [...constitutional_results, ...regular_results];
}

// Get all constitutional tier memories (public API wrapper)
function get_constitutional_memories_public(options = {}) {
  const database = initialize_db();
  const { specFolder = null, maxTokens = 2000 } = options;

  let results = get_constitutional_memories(database, specFolder);

  const TOKENS_PER_MEMORY = 100;
  const max_count = Math.floor(maxTokens / TOKENS_PER_MEMORY);
  if (results.length > max_count) {
    results = results.slice(0, max_count);
  }

  return results;
}

// Multi-concept AND search - finds memories matching ALL concepts
function multi_concept_search(concept_embeddings, options = {}) {
  if (!sqlite_vec_available) {
    console.warn('[vector-index] Multi-concept search unavailable - sqlite-vec not loaded');
    return [];
  }

  const database = initialize_db();

  const concepts = concept_embeddings;
  if (!Array.isArray(concepts) || concepts.length < 2 || concepts.length > 5) {
    throw new Error('Multi-concept search requires 2-5 concepts');
  }

  const expected_dim = get_embedding_dim();
  for (const emb of concepts) {
    if (!emb || emb.length !== expected_dim) {
      throw new Error(`Invalid embedding dimension: expected ${expected_dim}, got ${emb?.length}`);
    }
  }

  const { limit = 10, specFolder = null, minSimilarity = 50 } = options;

  const concept_buffers = concepts.map(c => to_embedding_buffer(c));
  const max_distance = 2 * (1 - minSimilarity / 100);

  const distance_expressions = concept_buffers.map((_, i) =>
    `vec_distance_cosine(v.embedding, ?) as dist_${i}`
  ).join(', ');

  const distance_filters = concept_buffers.map((_, i) =>
    `vec_distance_cosine(v.embedding, ?) <= ?`
  ).join(' AND ');

  const folder_filter = specFolder ? 'AND m.spec_folder = ?' : '';

  const similarity_select = concept_buffers.map((_, i) =>
    `ROUND((1 - sub.dist_${i} / 2) * 100, 2) as similarity_${i}`
  ).join(', ');

  const avg_distance_expr = concept_buffers.map((_, i) => `sub.dist_${i}`).join(' + ');

  const sql = `
    SELECT
      sub.*,
      ${similarity_select},
      (${avg_distance_expr}) / ${concepts.length} as avg_distance
    FROM (
      SELECT
        m.*,
        ${distance_expressions}
      FROM memory_index m
      JOIN vec_memories v ON m.id = v.rowid
      WHERE m.embedding_status = 'success'
        ${folder_filter}
        AND ${distance_filters}
    ) sub
    ORDER BY avg_distance ASC
    LIMIT ?
  `;

  const params = [
    ...concept_buffers,
    ...(specFolder ? [specFolder] : []),
    ...concept_buffers.flatMap(b => [b, max_distance]),
    limit
  ];

  const rows = database.prepare(sql).all(...params);

  return rows.map(row => {
    if (row.trigger_phrases) {
      row.trigger_phrases = JSON.parse(row.trigger_phrases);
    }
    row.concept_similarities = concept_buffers.map((_, i) => row[`similarity_${i}`]);
    row.avg_similarity = row.concept_similarities.reduce((a, b) => a + b, 0) / concepts.length;
    row.isConstitutional = row.importance_tier === 'constitutional';
    return row;
  });
}

/* ───────────────────────────────────────────────────────────────
   8. CONTENT EXTRACTION HELPERS
   ─────────────────────────────────────────────────────────────── */

// Extract title from memory file content
function extract_title(content, filename) {
  if (!content || typeof content !== 'string') {
    return filename ? path.basename(filename, path.extname(filename)) : 'Untitled';
  }

  const h1_match = content.match(/^#\s+(.+)$/m);
  if (h1_match && h1_match[1]) {
    return h1_match[1].trim();
  }

  const h2_match = content.match(/^##\s+(.+)$/m);
  if (h2_match && h2_match[1]) {
    return h2_match[1].trim();
  }

  const yaml_match = content.match(/^---[\s\S]*?^title:\s*(.+)$/m);
  if (yaml_match && yaml_match[1]) {
    return yaml_match[1].trim().replace(/^["']|["']$/g, '');
  }

  const lines = content.split('\n').filter(l => l.trim().length > 0);
  if (lines.length > 0) {
    const first_line = lines[0].trim();
    return first_line.replace(/^#+\s*/, '').substring(0, 100);
  }

  return filename ? path.basename(filename, path.extname(filename)) : 'Untitled';
}

// Extract snippet from memory content
function extract_snippet(content, max_length = 200) {
  if (!content || typeof content !== 'string') {
    return '';
  }

  let text = content.replace(/^---[\s\S]*?---\n*/m, '');
  const lines = text.split('\n');
  const snippet_lines = [];

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || /^#+\s/.test(trimmed)) {
      if (snippet_lines.length > 0) {
        break;
      }
      continue;
    }

    if (/^[a-z_-]+:\s/i.test(trimmed) && snippet_lines.length === 0) {
      continue;
    }

    snippet_lines.push(trimmed);

    const current_length = snippet_lines.join(' ').length;
    if (current_length >= max_length) {
      break;
    }
  }

  let snippet = snippet_lines.join(' ');

  if (snippet.length > max_length) {
    snippet = snippet.substring(0, max_length);
    const last_space = snippet.lastIndexOf(' ');
    if (last_space > max_length * 0.7) {
      snippet = snippet.substring(0, last_space);
    }
    snippet += '...';
  }

  return snippet;
}

// Extract tags from memory content
function extract_tags(content) {
  if (!content || typeof content !== 'string') {
    return [];
  }

  const tags = new Set();

  const yaml_tags_match = content.match(/^---[\s\S]*?^tags:\s*\[([^\]]+)\]/m);
  if (yaml_tags_match && yaml_tags_match[1]) {
    yaml_tags_match[1].split(',').forEach(tag => {
      const cleaned = tag.trim().replace(/^["']|["']$/g, '');
      if (cleaned) tags.add(cleaned.toLowerCase());
    });
  }

  const yaml_list_match = content.match(/^---[\s\S]*?^tags:\s*\n((?:\s*-\s*.+\n?)+)/m);
  if (yaml_list_match && yaml_list_match[1]) {
    yaml_list_match[1].match(/-\s*(.+)/g)?.forEach(match => {
      const tag = match.replace(/^-\s*/, '').trim().replace(/^["']|["']$/g, '');
      if (tag) tags.add(tag.toLowerCase());
    });
  }

  const hashtag_matches = content.match(/(?:^|\s)#([a-zA-Z][a-zA-Z0-9_-]*)/g);
  if (hashtag_matches) {
    hashtag_matches.forEach(match => {
      const tag = match.trim().replace(/^#/, '');
      if (tag && !tag.match(/^[0-9]+$/)) {
        tags.add(tag.toLowerCase());
      }
    });
  }

  return Array.from(tags);
}

// Extract date from memory file
function extract_date(content, file_path) {
  if (content && typeof content === 'string') {
    const date_match = content.match(/^---[\s\S]*?^date:\s*(.+)$/m);
    if (date_match && date_match[1]) {
      const date_str = date_match[1].trim().replace(/^["']|["']$/g, '');
      try {
        const parsed = new Date(date_str);
        if (!isNaN(parsed.getTime())) {
          return parsed.toISOString().split('T')[0];
        }
      } catch (e) {
        // Continue to filename parsing
      }
    }
  }

  if (file_path) {
    const filename = path.basename(file_path);

    const iso_match = filename.match(/(\d{4}-\d{2}-\d{2})/);
    if (iso_match) {
      return iso_match[1];
    }

    const ddmmyy_match = filename.match(/(\d{2})-(\d{2})-(\d{2})/);
    if (ddmmyy_match) {
      const [, day, month, year] = ddmmyy_match;
      const full_year = parseInt(year) > 50 ? `19${year}` : `20${year}`;
      return `${full_year}-${month}-${day}`;
    }
  }

  return null;
}

/* ───────────────────────────────────────────────────────────────
   9. EMBEDDING GENERATION WRAPPER
   ─────────────────────────────────────────────────────────────── */

// Generate embedding for a query string with error handling
async function generate_query_embedding(query) {
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    console.warn('[vector-index] Empty query provided for embedding');
    return null;
  }

  try {
    const embeddings = get_embeddings_module();
    const embedding = await embeddings.generateQueryEmbedding(query.trim());
    return embedding;
  } catch (error) {
    console.warn(`[vector-index] Query embedding failed: ${error.message}`);
    return null;
  }
}

/* ───────────────────────────────────────────────────────────────
   10. KEYWORD SEARCH FALLBACK
   ─────────────────────────────────────────────────────────────── */

// Fallback keyword search when vector search unavailable
function keyword_search(query, options = {}) {
  const database = initialize_db();
  const { limit = 20, specFolder = null } = options;

  if (!query || typeof query !== 'string') {
    return [];
  }

  const search_terms = query.toLowerCase().trim().split(/\s+/).filter(t => t.length >= 2);
  if (search_terms.length === 0) {
    return [];
  }

  let where_clause = '1=1';
  const params = [];

  if (specFolder) {
    where_clause += ' AND spec_folder = ?';
    params.push(specFolder);
  }

  const sql = `
    SELECT * FROM memory_index
    WHERE ${where_clause}
    ORDER BY importance_weight DESC, created_at DESC
  `;

  const rows = database.prepare(sql).all(...params);

  const scored = rows.map(row => {
    let score = 0;
    const searchable_text = [
      row.title || '',
      row.trigger_phrases || '',
      row.spec_folder || '',
      row.file_path || ''
    ].join(' ').toLowerCase();

    for (const term of search_terms) {
      if (searchable_text.includes(term)) {
        score += 1;
        if ((row.title || '').toLowerCase().includes(term)) {
          score += 2;
        }
        if ((row.trigger_phrases || '').toLowerCase().includes(term)) {
          score += 1.5;
        }
      }
    }

    score *= (0.5 + row.importance_weight);
    return { ...row, keyword_score: score };
  });

  const filtered = scored
    .filter(row => row.keyword_score > 0)
    .sort((a, b) => b.keyword_score - a.keyword_score)
    .slice(0, limit);

  return filtered.map(row => {
    if (row.trigger_phrases) {
      try {
        row.trigger_phrases = JSON.parse(row.trigger_phrases);
      } catch (e) {
        row.trigger_phrases = [];
      }
    }
    row.isConstitutional = row.importance_tier === 'constitutional';
    return row;
  });
}

/* ───────────────────────────────────────────────────────────────
   11. ENRICHED VECTOR SEARCH
   ─────────────────────────────────────────────────────────────── */

// Search memories with enriched results including full metadata
async function vector_search_enriched(query, limit = 20, options = {}) {
  const start_time = Date.now();
  const { specFolder = null, minSimilarity = 30 } = options;

  const query_embedding = await generate_query_embedding(query);

  let raw_results;
  let search_method = 'vector';

  if (query_embedding && sqlite_vec_available) {
    raw_results = vector_search(query_embedding, {
      limit,
      specFolder,
      minSimilarity
    });
  } else {
    console.warn('[vector-index] Falling back to keyword search');
    search_method = 'keyword';
    raw_results = keyword_search(query, { limit, specFolder });
  }

  const enriched_results = [];

  for (let i = 0; i < raw_results.length; i++) {
    const row = raw_results[i];
    const content = safe_read_file(row.file_path);

    const title = row.title || extract_title(content, row.file_path);
    const snippet = extract_snippet(content);
    const tags = extract_tags(content);
    const date = extract_date(content, row.file_path) || row.created_at?.split('T')[0] || null;

    let similarity;
    if (search_method === 'vector') {
      similarity = row.similarity || 0;
    } else {
      similarity = Math.min(100, (row.keyword_score || 0) * 20);
    }

    enriched_results.push({
      rank: i + 1,
      similarity: Math.round(similarity * 100) / 100,
      title,
      specFolder: row.spec_folder,
      filePath: row.file_path,
      date,
      tags,
      snippet,
      id: row.id,
      importanceWeight: row.importance_weight,
      searchMethod: search_method,
      isConstitutional: row.isConstitutional || row.importance_tier === 'constitutional'
    });
  }

  const elapsed = Date.now() - start_time;
  if (elapsed > 500) {
    console.warn(`[vector-index] Enriched search took ${elapsed}ms (target <500ms)`);
  }

  return enriched_results;
}

/* ───────────────────────────────────────────────────────────────
   12. MULTI-CONCEPT SEARCH (ENHANCED)
   ─────────────────────────────────────────────────────────────── */

// Search with multiple concepts using AND logic
async function multi_concept_search_enriched(concepts, limit = 20, options = {}) {
  const start_time = Date.now();

  if (!Array.isArray(concepts) || concepts.length < 2 || concepts.length > 5) {
    throw new Error('Multi-concept search requires 2-5 concepts');
  }

  const { specFolder = null, minSimilarity = 50 } = options;

  const concept_embeddings = [];
  for (const concept of concepts) {
    if (typeof concept === 'string') {
      const embedding = await generate_query_embedding(concept);
      if (!embedding) {
        console.warn(`[vector-index] Failed to embed concept: "${concept}"`);
        return multi_concept_keyword_search(concepts.filter(c => typeof c === 'string'), limit, options);
      }
      concept_embeddings.push(embedding);
    } else {
      concept_embeddings.push(concept);
    }
  }

  if (!sqlite_vec_available) {
    console.warn('[vector-index] Falling back to keyword multi-concept search');
    return multi_concept_keyword_search(concepts.filter(c => typeof c === 'string'), limit, options);
  }

  const raw_results = multi_concept_search(concept_embeddings, { limit, specFolder, minSimilarity });
  const enriched_results = [];

  for (let i = 0; i < raw_results.length; i++) {
    const row = raw_results[i];
    const content = safe_read_file(row.file_path);

    const title = row.title || extract_title(content, row.file_path);
    const snippet = extract_snippet(content);
    const tags = extract_tags(content);
    const date = extract_date(content, row.file_path) || row.created_at?.split('T')[0] || null;

    enriched_results.push({
      rank: i + 1,
      avgSimilarity: Math.round((row.avg_similarity || 0) * 100) / 100,
      conceptSimilarities: row.concept_similarities || [],
      title,
      specFolder: row.spec_folder,
      filePath: row.file_path,
      date,
      tags,
      snippet,
      id: row.id,
      importanceWeight: row.importance_weight,
      isConstitutional: row.isConstitutional || row.importance_tier === 'constitutional'
    });
  }

  const elapsed = Date.now() - start_time;
  if (elapsed > 500) {
    console.warn(`[vector-index] Multi-concept search took ${elapsed}ms (target <500ms)`);
  }

  return enriched_results;
}

// Keyword-based multi-concept search (fallback)
function multi_concept_keyword_search(concepts, limit = 20, options = {}) {
  const database = initialize_db();
  const { specFolder = null } = options;

  if (!concepts.length) return [];

  const concept_results = concepts.map(concept =>
    keyword_search(concept, { limit: 100, specFolder })
  );

  const id_counts = new Map();
  const id_to_row = new Map();

  for (const results of concept_results) {
    for (const row of results) {
      const count = id_counts.get(row.id) || 0;
      id_counts.set(row.id, count + 1);
      if (!id_to_row.has(row.id)) {
        id_to_row.set(row.id, row);
      }
    }
  }

  const matching_ids = [];
  for (const [id, count] of id_counts) {
    if (count === concepts.length) {
      matching_ids.push(id);
    }
  }

  const enriched_results = [];
  for (let i = 0; i < Math.min(matching_ids.length, limit); i++) {
    const id = matching_ids[i];
    const row = id_to_row.get(id);
    const content = safe_read_file(row.file_path);

    const title = row.title || extract_title(content, row.file_path);
    const snippet = extract_snippet(content);
    const tags = extract_tags(content);
    const date = extract_date(content, row.file_path) || row.created_at?.split('T')[0] || null;

    enriched_results.push({
      rank: i + 1,
      avgSimilarity: Math.min(100, (row.keyword_score || 1) * 15),
      conceptSimilarities: concepts.map(() => row.keyword_score || 1),
      title,
      specFolder: row.spec_folder,
      filePath: row.file_path,
      date,
      tags,
      snippet,
      id: row.id,
      importanceWeight: row.importance_weight,
      searchMethod: 'keyword',
      isConstitutional: row.importance_tier === 'constitutional'
    });
  }

  return enriched_results;
}

// Parse quoted terms from a search query
// Parse quoted terms from search query (e.g., '"memory system" "vector search"' => ['memory system', 'vector search'])
function parse_quoted_terms(query) {
  if (!query || typeof query !== 'string') {
    return [];
  }

  const quoted = [];
  const regex = /"([^"]+)"/g;
  let match;

  while ((match = regex.exec(query)) !== null) {
    if (match[1] && match[1].trim()) {
      quoted.push(match[1].trim());
    }
  }

  return quoted;
}

/* ───────────────────────────────────────────────────────────────
   13. SMART RANKING AND DIVERSITY
   ─────────────────────────────────────────────────────────────── */

// Apply smart ranking to search results using composite score (similarity + recency + usage)
// BUG-012: Weights read from config instead of hardcoded
function apply_smart_ranking(results) {
  if (!results || results.length === 0) return results;

  // BUG-012: Use config values instead of hardcoded magic numbers
  const recency_weight = search_weights.smartRanking?.recencyWeight || 0.3;
  const access_weight = search_weights.smartRanking?.accessWeight || 0.2;
  const relevance_weight = search_weights.smartRanking?.relevanceWeight || 0.5;

  const now = Date.now();
  const week_ms = 7 * 24 * 60 * 60 * 1000;
  const month_ms = 30 * 24 * 60 * 60 * 1000;

  return results.map(r => {
    // Calculate recency factor based on created_at
    const created_at = r.created_at ? new Date(r.created_at).getTime() : now;
    const age = now - created_at;
    let recency_factor;
    if (age < week_ms) {
      recency_factor = 1.0;  // Full boost for last week
    } else if (age < month_ms) {
      recency_factor = 0.8;  // 80% for last month
    } else {
      recency_factor = 0.5;  // 50% for older
    }

    // Calculate usage factor (capped at 10 accesses for normalization)
    const usage_factor = Math.min(1.0, (r.access_count || 0) / 10);

    // Normalize similarity to 0-1 (it comes as 0-100)
    const similarity_factor = (r.similarity || 0) / 100;

    // Composite score using configurable weights
    r.smartScore = (similarity_factor * relevance_weight) + (recency_factor * recency_weight) + (usage_factor * access_weight);
    r.smartScore = Math.round(r.smartScore * 100) / 100;  // Round to 2 decimals

    return r;
  }).sort((a, b) => b.smartScore - a.smartScore);
}

// Apply diversity filtering using MMR (Maximal Marginal Relevance)
// Reduces redundancy by penalizing items too similar to already-selected items
function apply_diversity(results, diversity_factor = 0.3) {
  if (!results || results.length <= 3) return results;  // Don't diversify tiny result sets

  const selected = [results[0]];  // Always include top result
  const remaining = [...results.slice(1)];

  while (selected.length < results.length && remaining.length > 0) {
    let best_idx = 0;
    let best_score = -Infinity;

    for (let i = 0; i < remaining.length; i++) {
      const candidate = remaining[i];
      const relevance = candidate.smartScore || (candidate.similarity / 100) || 0;

      // Find max similarity to already selected items
      // Use spec folder and date as proxies for similarity
      let max_similarity_to_selected = 0;
      for (const sel of selected) {
        // Same spec folder = high similarity (likely related content)
        if (sel.specFolder === candidate.specFolder || sel.spec_folder === candidate.spec_folder) {
          max_similarity_to_selected = Math.max(max_similarity_to_selected, 0.8);
        }
        // Same date = moderate similarity (likely same session)
        if (sel.date === candidate.date) {
          max_similarity_to_selected = Math.max(max_similarity_to_selected, 0.5);
        }
      }

      // MMR score: relevance - lambda * maxSimilarity
      const mmr_score = relevance - (diversity_factor * max_similarity_to_selected);

      if (mmr_score > best_score) {
        best_score = mmr_score;
        best_idx = i;
      }
    }

    selected.push(remaining.splice(best_idx, 1)[0]);
  }

  return selected;
}

// Learn trigger phrases from user search behavior
// Called when user selects a search result; extracts meaningful terms and adds as trigger phrases
function learn_from_selection(search_query, selected_memory_id) {
  if (!search_query || !selected_memory_id) return false;

  const database = initialize_db();

  // Get current triggers
  let memory;
  try {
    memory = database.prepare(
      'SELECT trigger_phrases FROM memory_index WHERE id = ?'
    ).get(selected_memory_id);
  } catch (e) {
    console.warn(`[vector-index] learn_from_selection query error: ${e.message}`);
    return false;
  }

  if (!memory) return false;

  let existing = [];
  try {
    existing = JSON.parse(memory.trigger_phrases || '[]');
  } catch (e) {
    existing = [];
  }

  // Stop words to exclude from learning
  const stop_words = [
    'that', 'this', 'what', 'where', 'when', 'which', 'with', 'from',
    'have', 'been', 'were', 'being', 'about', 'into', 'through', 'during',
    'before', 'after', 'above', 'below', 'between', 'under', 'again',
    'further', 'then', 'once', 'here', 'there', 'each', 'some', 'other'
  ];

  // Extract meaningful terms from query
  const new_terms = search_query
    .toLowerCase()
    .split(/\s+/)
    .filter(term => {
      // Must be at least 4 chars
      if (term.length < 4) return false;
      // Skip common words
      if (stop_words.includes(term)) return false;
      // Skip if already exists (case-insensitive)
      if (existing.some(e => e.toLowerCase() === term)) return false;
      // Skip pure numbers
      if (/^\d+$/.test(term)) return false;
      return true;
    })
    .slice(0, 3);  // Max 3 new triggers per search

  if (new_terms.length === 0) return false;

  // BUG-010: Cap total triggers using config value instead of hardcoded 10
  const updated = [...existing, ...new_terms].slice(0, MAX_TRIGGERS_PER_MEMORY);

  try {
    database.prepare(
      'UPDATE memory_index SET trigger_phrases = ? WHERE id = ?'
    ).run(JSON.stringify(updated), selected_memory_id);
    return true;
  } catch (e) {
    console.warn(`[vector-index] learn_from_selection update error: ${e.message}`);
    return false;
  }
}

// Enhanced search with smart ranking and diversity
// Wraps vector_search_enriched with additional processing: 2x fetch, smart rank, diversity filter
async function enhanced_search(query, limit = 20, options = {}) {
  const start_time = Date.now();

  // Get more results than needed for diversity filtering
  const fetch_limit = Math.min(limit * 2, 100);

  // Get base results
  const results = await vector_search_enriched(query, fetch_limit, {
    specFolder: options.specFolder,
    minSimilarity: options.minSimilarity || 30
  });

  // Apply smart ranking
  const ranked = apply_smart_ranking(results);

  // Apply diversity (optional, default on)
  const diversity_factor = options.diversityFactor !== undefined ? options.diversityFactor : 0.3;
  const diverse = options.noDiversity ? ranked : apply_diversity(ranked, diversity_factor);

  // Trim to requested limit
  const final_results = diverse.slice(0, limit);

  const elapsed = Date.now() - start_time;
  if (elapsed > 600) {
    console.warn(`[vector-index] Enhanced search took ${elapsed}ms (target <600ms)`);
  }

  return final_results;
}

/* ───────────────────────────────────────────────────────────────
   14. RELATED MEMORIES & USAGE TRACKING
   ─────────────────────────────────────────────────────────────── */

// LRU Cache with O(1) eviction using doubly-linked list (M5 fix)
class LRUCache {
  constructor(max_size, ttl_ms) {
    this.max_size = max_size;
    this.ttl_ms = ttl_ms;
    this.cache = new Map();
    this.head = { prev: null, next: null };
    this.tail = { prev: this.head, next: null };
    this.head.next = this.tail;
  }

  get(key) {
    const node = this.cache.get(key);
    if (!node) return null;
    if (Date.now() - node.timestamp > this.ttl_ms) {
      this._remove(node);
      this.cache.delete(key);
      return null;
    }
    this._move_to_front(node);
    return node.value;
  }

  set(key, value) {
    let node = this.cache.get(key);
    if (node) {
      node.value = value;
      node.timestamp = Date.now();
      this._move_to_front(node);
    } else {
      node = { key, value, timestamp: Date.now(), prev: null, next: null };
      this._add_to_front(node);
      this.cache.set(key, node);
      if (this.cache.size > this.max_size) {
        const oldest = this.tail.prev;
        this._remove(oldest);
        this.cache.delete(oldest.key);
      }
    }
  }

  _add_to_front(node) {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next.prev = node;
    this.head.next = node;
  }

  _remove(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  _move_to_front(node) {
    this._remove(node);
    this._add_to_front(node);
  }

  clear() {
    this.cache.clear();
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  get size() { return this.cache.size; }
}

// LRU Cache instance for search queries
let query_cache = null;

// Get or initialize the query cache (O(1) LRU with doubly-linked list)
function get_query_cache() {
  if (!query_cache) {
    query_cache = new LRUCache(500, 15 * 60 * 1000); // 500 entries, 15 min TTL
  }
  return query_cache;
}

// Find and link related memories when saving a new memory (T1.3)
// Discovers semantically similar memories using vector search
async function link_related_on_save(new_memory_id, content) {
  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    return;
  }

  try {
    // Generate embedding for the content (first 1000 chars for efficiency)
    const embedding = await generate_query_embedding(content.substring(0, 1000));
    if (!embedding) {
      console.warn(`[vector-index] Could not generate embedding for memory ${new_memory_id}`);
      return;
    }

    // Find similar memories (75% threshold as specified)
    const similar = vector_search(embedding, {
      limit: 6,  // Get 6 to allow for filtering out self
      minSimilarity: 75
    });

    // Filter out self and limit to 5 related memories
    const related = similar
      .filter(r => r.id !== new_memory_id)
      .slice(0, 5)
      .map(r => ({ id: r.id, similarity: r.similarity }));

    if (related.length > 0) {
      const database = initialize_db();
      database.prepare(`
        UPDATE memory_index
        SET related_memories = ?
        WHERE id = ?
      `).run(JSON.stringify(related), new_memory_id);
    }
  } catch (error) {
    console.warn(`[vector-index] Failed to link related memories for ${new_memory_id}: ${error.message}`);
  }
}

// Record memory access for usage tracking (T3.2)
// Increments access_count and updates last_accessed timestamp (H6 fix: Unix timestamp)
function record_access(memory_id) {
  try {
    const database = initialize_db();
    // H6 fix: Use Unix timestamp (INTEGER) instead of ISO string
    const now = Date.now();

    const result = database.prepare(`
      UPDATE memory_index
      SET access_count = access_count + 1,
          last_accessed = ?
      WHERE id = ?
    `).run(now, memory_id);

    return result.changes > 0;
  } catch (error) {
    console.warn(`[vector-index] Failed to record access for memory ${memory_id}: ${error.message}`);
    return false;
  }
}

// BUG-009: Generate collision-resistant cache key using SHA256 hash
function get_cache_key(query, limit, options) {
  const hash = crypto.createHash('sha256');
  hash.update(JSON.stringify({ query, limit, options }));
  return hash.digest('hex').substring(0, 16);
}

// Cached version of vector_search_enriched (T3.4)
// Wraps with LRU cache (500 entries, 15 min TTL, SHA256 key - BUG-009 fix)
async function cached_search(query, limit = 20, options = {}) {
  const cache = get_query_cache();
  const key = get_cache_key(query, limit, options); // BUG-009: Use SHA256 hash instead of string concatenation

  // M5 fix: LRUCache.get() handles TTL expiry and LRU ordering internally (O(1))
  const cached = cache.get(key);
  if (cached) {
    return cached.results;
  }

  // Perform actual search
  const results = await vector_search_enriched(query, limit, options);

  // M5 fix: LRUCache.set() handles eviction internally using O(1) doubly-linked list
  cache.set(key, { results });

  return results;
}

// Clear search cache with optional granular invalidation (L14)
function clear_search_cache(spec_folder = null) {
  if (!query_cache) {
    return 0;
  }

  if (spec_folder) {
    // Granular invalidation: only clear entries containing this spec folder
    let cleared = 0;
    for (const [key, node] of query_cache.cache) {
      if (key.includes(spec_folder)) {
        query_cache.cache.delete(key);
        // Also remove from linked list
        query_cache._remove(node);
        cleared++;
      }
    }
    return cleared;
  } else {
    // Clear entire cache
    const size = query_cache.size;
    query_cache.clear();
    return size;
  }
}

// Get related memories for a given memory ID (T1.3 helper)
// Returns pre-computed related memories stored during save with full metadata
function get_related_memories(memory_id) {
  try {
    const database = initialize_db();

    const memory = database.prepare(`
      SELECT related_memories FROM memory_index WHERE id = ?
    `).get(memory_id);

    if (!memory || !memory.related_memories) {
      return [];
    }

    const related = safe_parse_json(memory.related_memories, []);

    // Fetch full metadata for each related memory
    return related.map(rel => {
      const full_memory = get_memory(rel.id);
      if (full_memory) {
        return {
          ...full_memory,
          relationSimilarity: rel.similarity
        };
      }
      return null;
    }).filter(Boolean);
  } catch (error) {
    console.warn(`[vector-index] Failed to get related memories for ${memory_id}: ${error.message}`);
    return [];
  }
}

// Get usage statistics for memories (T3.2 analytics helper)
// Returns memories sorted by access count or last accessed time
function get_usage_stats(options = {}) {
  const {
    sortBy = 'access_count',
    order = 'DESC',
    limit = 20
  } = options;

  // Validate sortBy to prevent SQL injection
  const valid_sort_fields = ['access_count', 'last_accessed', 'confidence'];
  const sort_field = valid_sort_fields.includes(sortBy) ? sortBy : 'access_count';
  const sort_order = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  const database = initialize_db();

  const rows = database.prepare(`
    SELECT id, title, spec_folder, file_path, access_count,
           last_accessed, confidence, created_at
    FROM memory_index
    WHERE access_count > 0
    ORDER BY ${sort_field} ${sort_order}
    LIMIT ?
  `).all(limit);

  return rows;
}

// Update embedding status for a memory (M9 fix)
// Valid statuses: 'pending', 'success', 'failed', 'retry'
function update_embedding_status(id, status) {
  const valid_statuses = ['pending', 'success', 'failed', 'retry'];
  if (!valid_statuses.includes(status)) {
    console.warn(`[vector-index] Invalid embedding status: ${status}`);
    return false;
  }

  try {
    const database = initialize_db();
    const result = database.prepare(`
      UPDATE memory_index 
      SET embedding_status = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(status, id);

    return result.changes > 0;
  } catch (error) {
    console.warn(`[vector-index] Failed to update embedding status for ${id}: ${error.message}`);
    return false;
  }
}

// Update confidence score for a memory (0.0 to 1.0)
function update_confidence(memory_id, confidence) {
  if (typeof confidence !== 'number' || confidence < 0 || confidence > 1) {
    console.warn(`[vector-index] Invalid confidence value: ${confidence}`);
    return false;
  }

  try {
    const database = initialize_db();
    const result = database.prepare(`
      UPDATE memory_index
      SET confidence = ?
      WHERE id = ?
    `).run(confidence, memory_id);

    return result.changes > 0;
  } catch (error) {
    console.warn(`[vector-index] Failed to update confidence for ${memory_id}: ${error.message}`);
    return false;
  }
}

/* ───────────────────────────────────────────────────────────────
   15. CLEANUP FUNCTIONS
   ─────────────────────────────────────────────────────────────── */

// Find memories that may be candidates for cleanup (smart defaults: 90 days, <3 accesses, <0.4 confidence)
function find_cleanup_candidates(options = {}) {
  const database = initialize_db();

  const {
    maxAgeDays = 90,
    maxAccessCount = 2,
    maxConfidence = 0.4,
    limit = 50
  } = options;

  // Calculate cutoff date
  const cutoff_date = new Date();
  cutoff_date.setDate(cutoff_date.getDate() - maxAgeDays);
  const cutoff_iso = cutoff_date.toISOString();

  // Query for candidates - meeting ANY criteria
  const sql = `
    SELECT
      id,
      spec_folder,
      file_path,
      title,
      created_at,
      last_accessed,
      access_count,
      confidence,
      importance_weight
    FROM memory_index
    WHERE
      created_at < ?
      OR access_count <= ?
      OR confidence <= ?
      OR (last_accessed IS NULL AND created_at < ?)
    ORDER BY
      last_accessed ASC NULLS FIRST,
      access_count ASC,
      confidence ASC
    LIMIT ?
  `;

  let rows;
  try {
    rows = database.prepare(sql).all(
      cutoff_iso,
      maxAccessCount,
      maxConfidence,
      cutoff_iso,
      limit
    );
  } catch (e) {
    console.warn(`[vector-index] find_cleanup_candidates error: ${e.message}`);
    return [];
  }

  // Enrich with human-readable age
  return rows.map(row => {
    const age_string = format_age_string(row.created_at);
    const last_access_string = format_age_string(row.last_accessed);

    // Determine why this is a candidate
    const reasons = [];
    if (row.created_at && new Date(row.created_at) < cutoff_date) {
      reasons.push(`created ${age_string}`);
    }
    if ((row.access_count || 0) <= maxAccessCount) {
      const count = row.access_count || 0;
      reasons.push(`accessed ${count} time${count !== 1 ? 's' : ''}`);
    }
    if ((row.confidence || 0.5) <= maxConfidence) {
      reasons.push(`low importance (${Math.round((row.confidence || 0.5) * 100)}%)`);
    }

    return {
      id: row.id,
      specFolder: row.spec_folder,
      filePath: row.file_path,
      title: row.title || 'Untitled',
      createdAt: row.created_at,
      lastAccessedAt: row.last_accessed,
      accessCount: row.access_count || 0,
      confidence: row.confidence || 0.5,
      ageString: age_string,
      lastAccessString: last_access_string,
      reasons
    };
  });
}

// Delete multiple memories by ID (batch operations for cleanup command)
function delete_memories(memory_ids) {
  if (!memory_ids || memory_ids.length === 0) {
    return { deleted: 0, failed: 0 };
  }

  const database = initialize_db();
  let deleted = 0;
  let failed = 0;

  const delete_transaction = database.transaction(() => {
    for (const id of memory_ids) {
      try {
        // T105 FIX: Delete from memory_history first (referential integrity)
        database.prepare('DELETE FROM memory_history WHERE memory_id = ?').run(id);

        // Delete from vec_memories second (if it exists and sqlite-vec is available)
        // NOTE: vec_memories is a sqlite-vec virtual table - no FK CASCADE support
        if (sqlite_vec_available) {
          try {
            database.prepare('DELETE FROM vec_memories WHERE rowid = ?').run(BigInt(id));
          } catch (vec_error) {
            // M14 fix: Log vector deletion errors instead of swallowing silently
            console.warn(`[VectorIndex] Failed to delete vector for memory ${id}: ${vec_error.message}`);
            // Continue - vector may not exist
          }
        }

        // Delete from memory_index last
        const result = database.prepare('DELETE FROM memory_index WHERE id = ?').run(id);
        if (result.changes > 0) {
          deleted++;
        } else {
          failed++;
        }
      } catch (e) {
        console.warn(`[vector-index] Failed to delete memory ${id}: ${e.message}`);
        failed++;
      }
    }
  });

  try {
    delete_transaction();
    // M10 fix: Clear constitutional cache after batch delete
    // (some deleted memories may have been constitutional tier)
    if (deleted > 0) {
      clear_constitutional_cache();
      clear_search_cache();
    }
  } catch (e) {
    console.warn(`[vector-index] delete_memories transaction error: ${e.message}`);
  }

  return { deleted, failed };
}

// Get a preview of memory content for the cleanup [v]iew option
function get_memory_preview(memory_id, max_lines = 50) {
  const database = initialize_db();

  let memory;
  try {
    memory = database.prepare(`
      SELECT * FROM memory_index WHERE id = ?
    `).get(memory_id);
  } catch (e) {
    console.warn(`[vector-index] get_memory_preview query error: ${e.message}`);
    return null;
  }

  if (!memory) return null;

  let content = '';
  try {
    // SEC-002: Validate DB-stored file paths before reading (CWE-22 defense-in-depth)
    if (memory.file_path) {
      const valid_path = validate_file_path_local(memory.file_path);
      if (valid_path && fs.existsSync(valid_path)) {
        const full_content = fs.readFileSync(valid_path, 'utf-8');
        const lines = full_content.split('\n');
        content = lines.slice(0, max_lines).join('\n');
        if (lines.length > max_lines) {
          content += `\n... (${lines.length - max_lines} more lines)`;
        }
      }
    }
  } catch (e) {
    content = '(Unable to read file content)';
  }

  return {
    id: memory.id,
    specFolder: memory.spec_folder,
    filePath: memory.file_path,
    title: memory.title || 'Untitled',
    createdAt: memory.created_at,
    lastAccessedAt: memory.last_accessed,
    accessCount: memory.access_count || 0,
    confidence: memory.confidence || 0.5,
    ageString: format_age_string(memory.created_at),
    lastAccessString: format_age_string(memory.last_accessed),
    content
  };
}

/* ───────────────────────────────────────────────────────────────
   16. DATABASE UTILITIES
   ─────────────────────────────────────────────────────────────── */

// Close database connection (BUG-006: clears prepared statement cache first)
function close_db() {
  clear_prepared_statements(); // BUG-006: Clear prepared statements before closing
  if (db) {
    db.close();
    db = null;
  }
}

// Get database path
function get_db_path() {
  return db_path;
}

// Get raw database instance (for advanced queries)
function get_db() {
  return initialize_db();
}

// Verify database integrity: orphaned vectors, missing vectors, orphaned files (C2 fix)
// BUG-013: Added autoClean option for automatic orphan cleanup
function verify_integrity(options = {}) {
  const { autoClean = false } = options;
  const database = initialize_db();

  // BUG-013: Helper to find orphaned vector rowids
  const find_orphaned_vector_ids = () => {
    if (!sqlite_vec_available) return [];
    try {
      return database.prepare(`
        SELECT v.rowid FROM vec_memories v
        WHERE NOT EXISTS (SELECT 1 FROM memory_index m WHERE m.id = v.rowid)
      `).all().map(r => r.rowid);
    } catch (e) {
      console.warn('[vector-index] Could not query orphaned vectors:', e.message);
      return [];
    }
  };

  const orphaned_vector_ids = find_orphaned_vector_ids();
  const orphaned_vectors = orphaned_vector_ids.length;

  // BUG-013: Auto-clean orphaned vectors if requested
  let cleaned_vectors = 0;
  if (autoClean && orphaned_vectors > 0 && sqlite_vec_available) {
    console.log(`[vector-index] Auto-cleaning ${orphaned_vectors} orphaned vectors...`);
    const delete_stmt = database.prepare('DELETE FROM vec_memories WHERE rowid = ?');
    for (const rowid of orphaned_vector_ids) {
      try {
        delete_stmt.run(BigInt(rowid));
        cleaned_vectors++;
      } catch (e) {
        console.warn(`[vector-index] Failed to clean orphaned vector ${rowid}: ${e.message}`);
      }
    }
    console.log(`[vector-index] Cleaned ${cleaned_vectors} orphaned vectors`);
  }

  const missing_vectors = database.prepare(`
    SELECT COUNT(*) as count FROM memory_index m
    WHERE m.embedding_status = 'success'
    AND NOT EXISTS (SELECT 1 FROM vec_memories v WHERE v.rowid = m.id)
  `).get().count;

  const total_memories = database.prepare('SELECT COUNT(*) as count FROM memory_index').get().count;
  const total_vectors = database.prepare('SELECT COUNT(*) as count FROM vec_memories').get().count;

  // C2 FIX: Check for orphaned files (memory entries pointing to non-existent files)
  const check_orphaned_files = () => {
    const memories = database.prepare('SELECT id, file_path FROM memory_index').all();
    const orphaned = [];
    
    for (const memory of memories) {
      if (memory.file_path && !fs.existsSync(memory.file_path)) {
        orphaned.push({
          id: memory.id,
          file_path: memory.file_path,
          reason: 'File no longer exists on filesystem'
        });
      }
    }
    
    return orphaned;
  };

  const orphaned_files = check_orphaned_files();

  return {
    totalMemories: total_memories,
    totalVectors: total_vectors,
    orphanedVectors: autoClean ? orphaned_vectors - cleaned_vectors : orphaned_vectors,
    missingVectors: missing_vectors,
    orphanedFiles: orphaned_files,
    isConsistent: (orphaned_vectors - cleaned_vectors) === 0 && missing_vectors === 0 && orphaned_files.length === 0,
    // BUG-013: Include cleanup stats
    cleaned: autoClean && cleaned_vectors > 0 ? { vectors: cleaned_vectors } : undefined
  };
}

/* ───────────────────────────────────────────────────────────────
   17. MODULE EXPORTS
   ─────────────────────────────────────────────────────────────── */

// Check if vector search is available (sqlite-vec loaded)
function is_vector_search_available() {
  return sqlite_vec_available;
}

module.exports = {
  // Initialization
  initializeDb: initialize_db,
  closeDb: close_db,
  getDb: get_db,
  getDbPath: get_db_path,

  // Core operations
  indexMemory: index_memory,
  updateMemory: update_memory,
  deleteMemory: delete_memory,
  deleteMemoryByPath: delete_memory_by_path,

  // Queries
  getMemory: get_memory,
  getMemoriesByFolder: get_memories_by_folder,
  getMemoryCount: get_memory_count,
  getStatusCounts: get_status_counts,
  getStats: get_stats,
  verifyIntegrity: verify_integrity,

  // Search - Basic
  vectorSearch: vector_search,
  getConstitutionalMemories: get_constitutional_memories_public, // P0-001: Export public wrapper
  clearConstitutionalCache: clear_constitutional_cache,
  multiConceptSearch: multi_concept_search,
  isVectorSearchAvailable: is_vector_search_available,

  // Search - Enriched (US1, US8)
  vectorSearchEnriched: vector_search_enriched,
  multiConceptSearchEnriched: multi_concept_search_enriched,
  keywordSearch: keyword_search,
  multiConceptKeywordSearch: multi_concept_keyword_search,

  // Search - Cached (T3.4)
  cachedSearch: cached_search,
  clearSearchCache: clear_search_cache,

  // Smart Ranking & Diversity (T3.5, T3.6, T3.7)
  applySmartRanking: apply_smart_ranking,
  applyDiversity: apply_diversity,
  learnFromSelection: learn_from_selection,
  enhancedSearch: enhanced_search,

  // Related Memories (T1.3)
  linkRelatedOnSave: link_related_on_save,
  getRelatedMemories: get_related_memories,

  // Usage Tracking (T3.2)
  recordAccess: record_access,
  getUsageStats: get_usage_stats,
  updateConfidence: update_confidence,

  // Embedding Status (M9)
  updateEmbeddingStatus: update_embedding_status,

  // Cleanup Functions (T2.2)
  findCleanupCandidates: find_cleanup_candidates,
  deleteMemories: delete_memories,
  getMemoryPreview: get_memory_preview,

  // Content Extraction Helpers
  extractTitle: extract_title,
  extractSnippet: extract_snippet,
  extractTags: extract_tags,
  extractDate: extract_date,

  // Query Utilities
  generateQueryEmbedding: generate_query_embedding,
  parseQuotedTerms: parse_quoted_terms,

  // Security Utilities (SEC-002)
  validateFilePath: validate_file_path_local,

  // Embedding Dimension (BUG-003)
  getConfirmedEmbeddingDimension: get_confirmed_embedding_dimension,
  getEmbeddingDim: get_embedding_dim,

  // Cache Utilities (BUG-009)
  getCacheKey: get_cache_key,

  // Constants
  EMBEDDING_DIM,
  DEFAULT_DB_PATH
};

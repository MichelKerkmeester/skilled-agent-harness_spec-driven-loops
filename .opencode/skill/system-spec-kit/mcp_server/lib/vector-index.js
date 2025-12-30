/**
 * Vector Index Module - sqlite-vec based vector storage
 *
 * Provides persistent vector storage for memory embeddings using
 * sqlite-vec extension. Supports cross-spec-folder search with
 * synchronized rowid linkage between metadata and vectors.
 *
 * UPGRADE NOTE (2025-12-09):
 * - Changed from 384-dim to 768-dim vectors (nomic-embed-text-v1.5)
 * - Requires database migration: run migrate-to-nomic.js
 * - Uses task-specific prefixes via embeddings.js
 *
 * Phase 1 & 3 enhancements:
 * - T1.3: linkRelatedOnSave - auto-links related memories on save
 * - T3.2: recordAccess - tracks memory usage for analytics
 * - T3.4: cachedSearch - LRU-cached search for performance
 * - getRelatedMemories - retrieves pre-computed related memories
 *
 * @module vector-index
 * @version 11.0.0
 */

'use strict';

const Database = require('better-sqlite3');
const sqliteVec = require('sqlite-vec');
const path = require('path');
const os = require('os');
const fs = require('fs');
const { formatAgeString } = require('./utils/format-helpers');

/**
 * Convert Float32Array to Buffer for sqlite-vec
 * Ensures proper byte offset and length
 */
function toEmbeddingBuffer(embedding) {
  return Buffer.from(embedding.buffer, embedding.byteOffset, embedding.byteLength);
}

// Lazy-load embeddings module to avoid circular dependencies
let embeddingsModule = null;
function getEmbeddingsModule() {
  if (!embeddingsModule) {
    embeddingsModule = require('./embeddings');
  }
  return embeddingsModule;
}

// ───────────────────────────────────────────────────────────────
// CONFIGURATION
// ───────────────────────────────────────────────────────────────

const EMBEDDING_DIM = 768; // nomic-embed-text-v1.5
// Project-local database for memory storage
// V12.1: Updated path after consolidation to skill/system-spec-kit/
const DEFAULT_DB_PATH = process.env.MEMORY_DB_PATH || 
  path.resolve(__dirname, '../../database/context-index.sqlite');
const DB_PERMISSIONS = 0o600; // Owner read/write only

// Schema version for migration tracking (M19 fix)
// Increment this when schema changes are made
const SCHEMA_VERSION = 3;

// ───────────────────────────────────────────────────────────────
// SECURITY HELPERS (CWE-22, CWE-502 mitigations)
// ───────────────────────────────────────────────────────────────

/**
 * Allowed base directories for file reads
 * Paths from DB must resolve within one of these directories
 * @constant {string[]}
 */
const ALLOWED_BASE_PATHS = [
  path.join(process.cwd(), 'specs'),
  path.join(process.cwd(), '.opencode'),
  // Support explicit MEMORY_ALLOWED_PATHS env var for testing/extension
  ...(process.env.MEMORY_ALLOWED_PATHS ? process.env.MEMORY_ALLOWED_PATHS.split(':') : [])
].filter(Boolean);

/**
 * Validate file path is within allowed directories (CWE-22: Path Traversal mitigation)
 * 
 * Prevents directory traversal attacks by ensuring resolved paths
 * stay within allowed base directories.
 * 
 * @param {string} filePath - Path to validate (from database)
 * @returns {string|null} Validated absolute path or null if invalid
 */
function validateFilePath(filePath) {
  if (!filePath || typeof filePath !== 'string') {
    return null;
  }

  try {
    // Resolve to absolute path (handles .., symlinks, etc.)
    const resolved = path.resolve(filePath);
    
    // Security: Use path.relative() containment check instead of startsWith()
    // This prevents path confusion attacks (CWE-22)
    // See: specs/003-memory-and-spec-kit/038-post-merge-refinement-3
    const isAllowed = ALLOWED_BASE_PATHS.some(basePath => {
      try {
        const normalizedBase = path.resolve(basePath);
        const relative = path.relative(normalizedBase, resolved);
        // Secure: relative path must not start with '..' and must not be absolute
        return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
      } catch {
        return false;
      }
    });

    if (!isAllowed) {
      console.warn(`[vector-index] Path traversal blocked: ${filePath} -> ${resolved}`);
      return null;
    }

    return resolved;
  } catch (err) {
    console.warn(`[vector-index] Path validation error: ${err.message}`);
    return null;
  }
}

/**
 * Safely read file content with path validation
 * 
 * Combines path validation with file reading. Returns empty string
 * for invalid paths or read errors (fail-safe default).
 * 
 * @param {string} filePath - Path from database
 * @returns {string} File content or empty string
 */
function safeReadFile(filePath) {
  const validPath = validateFilePath(filePath);
  if (!validPath) {
    return '';
  }

  try {
    if (fs.existsSync(validPath)) {
      return fs.readFileSync(validPath, 'utf-8');
    }
  } catch (err) {
    console.warn(`[vector-index] Could not read file ${validPath}: ${err.message}`);
  }
  return '';
}

/**
 * Safely parse JSON with validation (CWE-502: Deserialization mitigation)
 * 
 * Validates JSON structure before parsing to prevent prototype pollution
 * or unexpected object shapes from corrupted data.
 * 
 * @param {string} jsonString - JSON string to parse
 * @param {*} [defaultValue=[]] - Default value if parsing fails
 * @returns {*} Parsed value or default
 */
function safeParseJSON(jsonString, defaultValue = []) {
  if (!jsonString || typeof jsonString !== 'string') {
    return defaultValue;
  }

  try {
    const parsed = JSON.parse(jsonString);
    
    // For related_memories, expect array of objects with id and similarity
    if (Array.isArray(parsed)) {
      return parsed.filter(item => 
        item && typeof item === 'object' && 
        !Array.isArray(item) &&
        // Reject any __proto__ or constructor pollution attempts
        !('__proto__' in item) && 
        !('constructor' in item) &&
        !('prototype' in item)
      );
    }
    
    // For non-array, return default if object has dangerous keys
    if (typeof parsed === 'object' && parsed !== null) {
      if ('__proto__' in parsed || 'constructor' in parsed || 'prototype' in parsed) {
        console.warn('[vector-index] Blocked potential prototype pollution in JSON');
        return defaultValue;
      }
    }
    
    return parsed;
  } catch (err) {
    console.warn(`[vector-index] JSON parse error: ${err.message}`);
    return defaultValue;
  }
}

// ───────────────────────────────────────────────────────────────
// DATABASE SINGLETON
// ───────────────────────────────────────────────────────────────

let db = null;
let dbPath = DEFAULT_DB_PATH;
let sqliteVecAvailable = true; // Track if sqlite-vec is available (NFR-R01)
let shuttingDown = false;

// P1-CODE-004: Constitutional memory caching to avoid repeated DB queries
// Cache key includes specFolder to support folder-scoped queries
let constitutionalCache = new Map(); // Map<specFolder|'global', {data, timestamp}>
const CONSTITUTIONAL_CACHE_TTL = 300000; // 5 minute TTL - constitutional memories rarely change

// ───────────────────────────────────────────────────────────────
// PREPARED STATEMENT CACHING (PERF-1)
// ───────────────────────────────────────────────────────────────
// Cache common prepared statements to avoid ~0.1-0.5ms overhead per query

let preparedStatements = null;

/**
 * Initialize and cache prepared statements for common queries
 * @param {Object} database - better-sqlite3 instance
 * @returns {Object} Cached prepared statements
 */
function initPreparedStatements(database) {
  if (preparedStatements) return preparedStatements;
  
  preparedStatements = {
    // Count queries
    countAll: database.prepare('SELECT COUNT(*) as count FROM memory_index'),
    countByFolder: database.prepare('SELECT COUNT(*) as count FROM memory_index WHERE spec_folder = ?'),
    
    // Common lookups
    getById: database.prepare('SELECT * FROM memory_index WHERE id = ?'),
    getByPath: database.prepare('SELECT * FROM memory_index WHERE file_path = ?'),
    getByFolderAndPath: database.prepare('SELECT id FROM memory_index WHERE spec_folder = ? AND file_path = ? AND (anchor_id = ? OR (anchor_id IS NULL AND ? IS NULL))'),
    
    // Stats queries
    getStats: database.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN embedding_status = 'success' THEN 1 ELSE 0 END) as complete,
        SUM(CASE WHEN embedding_status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN embedding_status = 'failed' THEN 1 ELSE 0 END) as failed
      FROM memory_index
    `),
    
    // List query (without dynamic parts)
    listBase: database.prepare('SELECT * FROM memory_index ORDER BY created_at DESC LIMIT ? OFFSET ?')
  };
  
  return preparedStatements;
}

/**
 * Clear prepared statements cache (call when database is reset)
 */
function clearPreparedStatements() {
  preparedStatements = null;
}

/**
 * Get cached constitutional memories or fetch from database
 * @param {Object} database - Database connection
 * @param {string|null} specFolder - Optional spec folder filter
 * @returns {Object[]} Constitutional memory results
 */
function getConstitutionalMemories(database, specFolder = null) {
  const cacheKey = specFolder || 'global';
  const now = Date.now();
  const cached = constitutionalCache.get(cacheKey);
  
  if (cached && (now - cached.timestamp) < CONSTITUTIONAL_CACHE_TTL) {
    return cached.data;
  }
  
  // Fetch from database
  const constitutionalSql = `
    SELECT m.*, 100.0 as similarity, 1.0 as effective_importance,
           'constitutional' as source_type
    FROM memory_index m
    WHERE m.importance_tier = 'constitutional'
      AND m.embedding_status = 'success'
      ${specFolder ? 'AND m.spec_folder = ?' : ''}
    ORDER BY m.importance_weight DESC, m.created_at DESC
  `;
  
  const params = specFolder ? [specFolder] : [];
  let results = database.prepare(constitutionalSql).all(...params);
  
  // Limit constitutional results to ~2000 tokens (~8000 chars, ~20 memories avg)
  const MAX_CONSTITUTIONAL_TOKENS = 2000;
  const TOKENS_PER_MEMORY = 100;
  const maxConstitutionalCount = Math.floor(MAX_CONSTITUTIONAL_TOKENS / TOKENS_PER_MEMORY);
  results = results.slice(0, maxConstitutionalCount);
  
  // Mark as constitutional for client identification
  results = results.map(row => {
    if (row.trigger_phrases) {
      row.trigger_phrases = JSON.parse(row.trigger_phrases);
    }
    row.isConstitutional = true;
    return row;
  });
  
  // Cache the results
  constitutionalCache.set(cacheKey, { data: results, timestamp: now });
  
  return results;
}

/**
 * Clear constitutional cache (call when tier changes)
 * @param {string|null} specFolder - Clear specific folder or all if null
 */
function clearConstitutionalCache(specFolder = null) {
  if (specFolder) {
    constitutionalCache.delete(specFolder);
  } else {
    constitutionalCache.clear();
  }
}

// ───────────────────────────────────────────────────────────────
// SCHEMA VERSION TRACKING (M19 fix)
// ───────────────────────────────────────────────────────────────

/**
 * Run schema migrations from one version to another
 * 
 * Each migration is idempotent - safe to run multiple times.
 * Migrations are numbered and run in sequence.
 * 
 * @param {Object} database - better-sqlite3 instance
 * @param {number} fromVersion - Current schema version
 * @param {number} toVersion - Target schema version
 */
function runMigrations(database, fromVersion, toVersion) {
  const migrations = {
    1: () => {
      // v0 -> v1: Initial schema (already exists via createSchema)
      // No action needed - createSchema handles initial setup
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

  for (let v = fromVersion + 1; v <= toVersion; v++) {
    if (migrations[v]) {
      console.log(`[VectorIndex] Running migration v${v}`);
      migrations[v]();
    }
  }
}

/**
 * Ensure schema version table exists and run any pending migrations
 * 
 * Creates schema_version table if not exists, checks current version,
 * and runs any migrations needed to reach SCHEMA_VERSION.
 * 
 * @param {Object} database - better-sqlite3 instance
 * @returns {number} Previous schema version (before migration)
 */
function ensureSchemaVersion(database) {
  // Create schema_version table if not exists
  database.exec(`
    CREATE TABLE IF NOT EXISTS schema_version (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      version INTEGER NOT NULL,
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);

  // Get current version
  const row = database.prepare('SELECT version FROM schema_version WHERE id = 1').get();
  const currentVersion = row ? row.version : 0;

  if (currentVersion < SCHEMA_VERSION) {
    console.log(`[VectorIndex] Migrating schema from v${currentVersion} to v${SCHEMA_VERSION}`);
    runMigrations(database, currentVersion, SCHEMA_VERSION);

    // Update version
    database.prepare(`
      INSERT OR REPLACE INTO schema_version (id, version, updated_at)
      VALUES (1, ?, datetime('now'))
    `).run(SCHEMA_VERSION);
    
    console.log(`[VectorIndex] Schema migration complete: v${SCHEMA_VERSION}`);
  }

  return currentVersion;
}

/**
 * Initialize or get database connection
 * Creates schema on first use
 *
 * @param {string} [customPath] - Override default database path (for testing)
 * @returns {Object} better-sqlite3 database instance
 */
function initializeDb(customPath = null) {
  if (db && !customPath) {
    return db;
  }

  const targetPath = customPath || dbPath;

  // Ensure directory exists
  const dir = path.dirname(targetPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
  }

  // Open database
  db = new Database(targetPath);

  // Load sqlite-vec extension with graceful degradation (NFR-R01, CHK123)
  try {
    sqliteVec.load(db);
    sqliteVecAvailable = true;
  } catch (vecError) {
    sqliteVecAvailable = false;
    console.warn(`[vector-index] sqlite-vec extension not available: ${vecError.message}`);
    console.warn('[vector-index] Falling back to anchor-only mode (no vector search)');
    console.warn('[vector-index] Install sqlite-vec: brew install sqlite-vec (macOS)');
  }

  // Enable WAL mode for concurrent access (FR-010b)
  db.pragma('journal_mode = WAL');

  // Enable foreign key enforcement (P0-004: Database integrity)
  db.pragma('foreign_keys = ON');

  // Performance pragmas (P1 optimization - 20-50% faster queries/writes)
  db.pragma('cache_size = -64000');       // 64MB cache (negative = KB)
  db.pragma('mmap_size = 268435456');     // 256MB memory-mapped I/O
  db.pragma('synchronous = NORMAL');      // Balanced durability/speed
  db.pragma('temp_store = MEMORY');       // Use RAM for temp tables

  // Create schema if needed
  createSchema(db);

  // Run schema migrations (M19 fix - version-tracked migrations)
  ensureSchemaVersion(db);

  // Set file permissions (T021)
  if (!customPath) {
    try {
      fs.chmodSync(targetPath, DB_PERMISSIONS);
    } catch (err) {
      console.warn(`[vector-index] Could not set permissions on ${targetPath}: ${err.message}`);
    }
  }

  dbPath = targetPath;
  return db;
}

/**
 * Migrate existing database to add confidence tracking columns
 * Wraps ALTER TABLE in try-catch to handle concurrent migrations (P1-010)
 * @param {Object} database - better-sqlite3 instance
 */
function migrateConfidenceColumns(database) {
  // Check if confidence column exists
  const columns = database.prepare(`PRAGMA table_info(memory_index)`).all();
  const columnNames = columns.map(c => c.name);

  // P1-010: Wrap each ALTER TABLE in try-catch to handle concurrent migrations
  if (!columnNames.includes('confidence')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN confidence REAL DEFAULT 0.5`);
      console.warn('[vector-index] Migration: Added confidence column');
    } catch (e) {
      if (!e.message.includes('duplicate column')) throw e;
    }
  }

  if (!columnNames.includes('validation_count')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN validation_count INTEGER DEFAULT 0`);
      console.warn('[vector-index] Migration: Added validation_count column');
    } catch (e) {
      if (!e.message.includes('duplicate column')) throw e;
    }
  }

  // Add importance_tier column if missing (v11.1 feature)
  if (!columnNames.includes('importance_tier')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN importance_tier TEXT DEFAULT 'normal'`);
      console.warn('[vector-index] Migration: Added importance_tier column');
    } catch (e) {
      if (!e.message.includes('duplicate column')) throw e;
    }
    // Create index for efficient tier-based queries
    try {
      database.exec(`CREATE INDEX IF NOT EXISTS idx_importance_tier ON memory_index(importance_tier)`);
      console.warn('[vector-index] Migration: Created idx_importance_tier index');
    } catch (e) {
      // Index might already exist, ignore
    }
  }

  // Add context_type column if missing
  if (!columnNames.includes('context_type')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN context_type TEXT DEFAULT 'general'`);
      console.warn('[vector-index] Migration: Added context_type column');
    } catch (e) {
      if (!e.message.includes('duplicate column')) throw e;
    }
  }

  // Add content_hash column if missing (for change detection)
  if (!columnNames.includes('content_hash')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN content_hash TEXT`);
      console.warn('[vector-index] Migration: Added content_hash column');
    } catch (e) {
      if (!e.message.includes('duplicate column')) throw e;
    }
  }

  // Add channel column if missing
  if (!columnNames.includes('channel')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN channel TEXT DEFAULT 'default'`);
      console.warn('[vector-index] Migration: Added channel column');
    } catch (e) {
      if (!e.message.includes('duplicate column')) throw e;
    }
  }

  // Add session_id column if missing
  if (!columnNames.includes('session_id')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN session_id TEXT`);
      console.warn('[vector-index] Migration: Added session_id column');
    } catch (e) {
      if (!e.message.includes('duplicate column')) throw e;
    }
  }

  // Add decay-related columns if missing
  if (!columnNames.includes('base_importance')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN base_importance REAL DEFAULT 0.5`);
      console.warn('[vector-index] Migration: Added base_importance column');
    } catch (e) {
      if (!e.message.includes('duplicate column')) throw e;
    }
  }

  if (!columnNames.includes('decay_half_life_days')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN decay_half_life_days REAL DEFAULT 90.0`);
      console.warn('[vector-index] Migration: Added decay_half_life_days column');
    } catch (e) {
      if (!e.message.includes('duplicate column')) throw e;
    }
  }

  if (!columnNames.includes('is_pinned')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN is_pinned INTEGER DEFAULT 0`);
      console.warn('[vector-index] Migration: Added is_pinned column');
    } catch (e) {
      if (!e.message.includes('duplicate column')) throw e;
    }
  }

  if (!columnNames.includes('last_accessed')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN last_accessed INTEGER DEFAULT 0`);
      console.warn('[vector-index] Migration: Added last_accessed column');
    } catch (e) {
      if (!e.message.includes('duplicate column')) throw e;
    }
  }

  if (!columnNames.includes('expires_at')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN expires_at DATETIME`);
      console.warn('[vector-index] Migration: Added expires_at column');
    } catch (e) {
      if (!e.message.includes('duplicate column')) throw e;
    }
  }

  // P0-005: Add related_memories column for linkRelatedOnSave() and getRelatedMemories()
  if (!columnNames.includes('related_memories')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN related_memories TEXT`);
      console.warn('[vector-index] Migration: Added related_memories column');
    } catch (e) {
      if (!e.message.includes('duplicate column')) throw e;
    }
  }
}

/**
 * Migrate existing database to support constitutional tier
 *
 * Note: SQLite CHECK constraints cannot be modified after table creation.
 * For existing databases, the 'constitutional' value will be accepted
 * because SQLite's CHECK constraint only validates on INSERT/UPDATE.
 * New databases get the updated constraint automatically.
 *
 * @param {Object} database - better-sqlite3 instance
 */
function migrateConstitutionalTier(database) {
  // Check the current CHECK constraint by examining table schema
  const tableInfo = database.prepare(`
    SELECT sql FROM sqlite_master
    WHERE type='table' AND name='memory_index'
  `).get();

  if (tableInfo && tableInfo.sql) {
    // Check if constitutional is already in the constraint
    if (tableInfo.sql.includes("'constitutional'")) {
      return; // Already migrated
    }

    // Note: We can't ALTER the CHECK constraint in SQLite
    // The new tier will work because:
    // 1. SQLite allows any value if you disable constraint checking
    // 2. New inserts with 'constitutional' will fail on old schema
    // Solution: We'll recreate the table with the new constraint

    // Check if there are constitutional memories that need to be preserved
    // (in case someone already inserted them with constraint checking disabled)
    const constitutionalCount = database.prepare(`
      SELECT COUNT(*) as count FROM memory_index
      WHERE importance_tier = 'constitutional'
    `).get().count;

    if (constitutionalCount > 0) {
      console.warn(`[vector-index] Found ${constitutionalCount} constitutional memories`);
    }

    // For production safety, we don't automatically migrate the table
    // Instead, we log a warning and the new constraint applies to new databases only
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

/**
 * P2-001: Create indexes for commonly queried columns
 * Called during schema creation and migration to ensure indexes exist.
 * Uses IF NOT EXISTS for idempotency.
 * 
 * @param {Object} database - better-sqlite3 instance
 */
function createCommonIndexes(database) {
  // Create indexes for common query patterns
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
  // This index was defined in createSchema() but not applied to existing databases
  try {
    database.exec(`CREATE INDEX IF NOT EXISTS idx_history_timestamp ON memory_history(timestamp DESC)`);
    console.log('[vector-index] Created idx_history_timestamp index');
  } catch (err) {
    if (!err.message.includes('already exists')) {
      console.warn('[vector-index] Failed to create idx_history_timestamp:', err.message);
    }
  }
}

/**
 * Create database schema
 * @param {Object} database - better-sqlite3 instance
 */
function createSchema(database) {
  // Check if tables exist
  const tableExists = database.prepare(`
    SELECT name FROM sqlite_master
    WHERE type='table' AND name='memory_index'
  `).get();

  if (tableExists) {
    // Migrations for existing databases
    migrateConfidenceColumns(database);
    migrateConstitutionalTier(database);
    
    // P2-001: Create indexes for common query patterns (idempotent)
    createCommonIndexes(database);
    
    return; // Schema already exists
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
  if (sqliteVecAvailable) {
    database.exec(`
      CREATE VIRTUAL TABLE vec_memories USING vec0(
        embedding FLOAT[${EMBEDDING_DIM}]
      )
    `);
  }

  // Create FTS5 virtual table
  // NOTE: FTS5 indexes title, trigger_phrases, file_path only.
  // context_type and channel are NOT included in full-text search.
  // Use SQL filters for those columns.
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

  // Additional indexes for new features
  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_importance_tier ON memory_index(importance_tier);
    CREATE INDEX IF NOT EXISTS idx_access_importance ON memory_index(access_count DESC, importance_weight DESC);
    CREATE INDEX IF NOT EXISTS idx_memories_scope ON memory_index(spec_folder, session_id, context_type);
    CREATE INDEX IF NOT EXISTS idx_channel ON memory_index(channel);
    CREATE INDEX IF NOT EXISTS idx_history_memory ON memory_history(memory_id, timestamp);
    CREATE INDEX IF NOT EXISTS idx_history_timestamp ON memory_history(timestamp DESC);
    CREATE INDEX IF NOT EXISTS idx_checkpoints_spec ON checkpoints(spec_folder);
  `);

  // P2-001: Additional indexes for commonly queried columns
  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_file_path ON memory_index(file_path);
    CREATE INDEX IF NOT EXISTS idx_content_hash ON memory_index(content_hash);
    CREATE INDEX IF NOT EXISTS idx_last_accessed ON memory_index(last_accessed DESC);
  `);

  console.warn('[vector-index] Schema created successfully');
}

// Note: Timestamp format documentation is at line ~616 (P2-002)
// Removed duplicate comment block here to maintain single source of truth

// ───────────────────────────────────────────────────────────────
// CORE OPERATIONS
// ───────────────────────────────────────────────────────────────

/**
 * Index a memory with its embedding (synchronized INSERT)
 *
 * @param {Object} params - Memory parameters
 * @param {string} params.specFolder - Spec folder name
 * @param {string} params.filePath - Full path to memory file
 * @param {string} [params.anchorId] - Optional anchor ID
 * @param {string} [params.title] - Memory title
 * @param {string[]} [params.triggerPhrases] - Trigger phrases array
 * @param {number} [params.importanceWeight=0.5] - Importance score 0-1
 * @param {Float32Array} params.embedding - 384-dim embedding vector
 * @returns {number} Inserted row ID
 */
function indexMemory(params) {
  const database = initializeDb();

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
  
  // Validate embedding dimension
  if (embedding.length !== EMBEDDING_DIM) {
    console.warn(`[vector-index] Embedding dimension mismatch: expected ${EMBEDDING_DIM}, got ${embedding.length}`);
    throw new Error(`Embedding must be ${EMBEDDING_DIM} dimensions, got ${embedding.length}`);
  }

  const now = new Date().toISOString();
  const triggersJson = JSON.stringify(triggerPhrases);
  const embeddingBuffer = toEmbeddingBuffer(embedding);

  // Check for existing entry (PERF-1: use cached prepared statement)
  const stmts = initPreparedStatements(database);
  const existing = stmts.getByFolderAndPath.get(specFolder, filePath, anchorId, anchorId);

  if (existing) {
    // Update existing entry
    return updateMemory({
      id: existing.id,
      title,
      triggerPhrases,
      importanceWeight,
      embedding
    });
  }

  // Synchronized INSERT in transaction
  const insertMemory = database.transaction(() => {
    // Determine status based on sqlite-vec availability
    const embeddingStatus = sqliteVecAvailable ? 'success' : 'pending';

    // Step 1: Insert metadata
    // Note: We use MODEL_NAME from config which is 'nomic-ai/nomic-embed-text-v1.5'
    const result = database.prepare(`
      INSERT INTO memory_index (
        spec_folder, file_path, anchor_id, title, trigger_phrases,
        importance_weight, created_at, updated_at, embedding_model,
        embedding_generated_at, embedding_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      specFolder, filePath, anchorId, title, triggersJson,
      importanceWeight, now, now, 'nomic-ai/nomic-embed-text-v1.5', now, embeddingStatus
    );

    // sqlite-vec requires BigInt for explicit rowid insertion
    const rowId = BigInt(result.lastInsertRowid);

    // Step 2: Insert embedding with synchronized rowid (only if sqlite-vec available)
    if (sqliteVecAvailable) {
      database.prepare(`
        INSERT INTO vec_memories (rowid, embedding) VALUES (?, ?)
      `).run(rowId, embeddingBuffer);
    }

    return Number(rowId);
  });

  return insertMemory();
}

/**
 * Update an existing memory entry
 *
 * @param {Object} params - Update parameters
 * @param {number} params.id - Row ID to update
 * @param {string} [params.title] - New title
 * @param {string[]} [params.triggerPhrases] - New trigger phrases
 * @param {number} [params.importanceWeight] - New importance
 * @param {string} [params.importanceTier] - New importance tier (constitutional, critical, important, normal, temporary, deprecated)
 * @param {Float32Array} [params.embedding] - New embedding
 * @returns {number} Updated row ID
 */
function updateMemory(params) {
  const database = initializeDb();

  const { id, title, triggerPhrases, importanceWeight, importanceTier, embedding } = params;

  const now = new Date().toISOString();

  const updateMemoryTx = database.transaction(() => {
    // Build dynamic update
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
      // P1-CODE-004: Clear constitutional cache when tier changes
      clearConstitutionalCache();
    }
    if (embedding) {
      updates.push('embedding_model = ?');
      updates.push('embedding_generated_at = ?');
      updates.push('embedding_status = ?');
      values.push('nomic-ai/nomic-embed-text-v1.5', now, 'success');
    }

    values.push(id);

    database.prepare(`
      UPDATE memory_index SET ${updates.join(', ')} WHERE id = ?
    `).run(...values);

    // Update embedding if provided (only if sqlite-vec available)
    if (embedding && sqliteVecAvailable) {
      // Validate embedding dimension before processing
      if (embedding.length !== EMBEDDING_DIM) {
        console.warn(`[vector-index] Embedding dimension mismatch in update: expected ${EMBEDDING_DIM}, got ${embedding.length}`);
        throw new Error(`Embedding must be ${EMBEDDING_DIM} dimensions, got ${embedding.length}`);
      }
      
      const embeddingBuffer = toEmbeddingBuffer(embedding);

      // Delete old vector (BigInt for vec_memories rowid)
      database.prepare('DELETE FROM vec_memories WHERE rowid = ?').run(BigInt(id));

      // Insert new vector (BigInt required for explicit rowid)
      database.prepare(`
        INSERT INTO vec_memories (rowid, embedding) VALUES (?, ?)
      `).run(BigInt(id), embeddingBuffer);
    }

    return id;
  });

  // Execute transaction (better-sqlite3 uses BEGIN IMMEDIATE by default)
  return updateMemoryTx();
}

/**
 * Delete a memory entry (synchronized DELETE with cascade)
 *
 * Deletes in order:
 * 1. memory_history entries (cascade - H7 fix)
 * 2. vec_memories vector (if sqlite-vec available)
 * 3. memory_index metadata
 *
 * Also clears search and constitutional caches to ensure fresh results.
 *
 * @param {number} id - Row ID to delete
 * @returns {boolean} True if deleted
 */
function deleteMemory(id) {
  const database = initializeDb();

  const deleteMemoryTx = database.transaction(() => {
    // 1. Delete history entries first (cascade - H7 fix)
    database.prepare('DELETE FROM memory_history WHERE memory_id = ?').run(id);

    // 2. Delete from vec_memories (only if sqlite-vec available)
    if (sqliteVecAvailable) {
      try {
        database.prepare('DELETE FROM vec_memories WHERE rowid = ?').run(BigInt(id));
      } catch (e) {
        // Vector may not exist for this memory, continue
      }
    }

    // 3. Delete from memory_index
    const result = database.prepare('DELETE FROM memory_index WHERE id = ?').run(id);

    // 4. Clear caches to ensure fresh results
    clearSearchCache();
    clearConstitutionalCache();

    return result.changes > 0;
  });

  return deleteMemoryTx();
}

/**
 * Delete memory by spec folder and file path
 *
 * @param {string} specFolder - Spec folder name
 * @param {string} filePath - File path
 * @param {string} [anchorId] - Optional anchor ID
 * @returns {boolean} True if deleted
 */
function deleteMemoryByPath(specFolder, filePath, anchorId = null) {
  const database = initializeDb();

  const row = database.prepare(`
    SELECT id FROM memory_index
    WHERE spec_folder = ? AND file_path = ? AND (anchor_id = ? OR (anchor_id IS NULL AND ? IS NULL))
  `).get(specFolder, filePath, anchorId, anchorId);

  if (row) {
    return deleteMemory(row.id);
  }
  return false;
}

/**
 * Get memory by ID
 *
 * @param {number} id - Row ID
 * @returns {Object|null} Memory metadata or null
 */
function getMemory(id) {
  const database = initializeDb();

  // PERF-1: use cached prepared statement
  const stmts = initPreparedStatements(database);
  const row = stmts.getById.get(id);

  if (row) {
    if (row.trigger_phrases) {
      row.trigger_phrases = JSON.parse(row.trigger_phrases);
    }
    // Set isConstitutional based on actual tier
    row.isConstitutional = row.importance_tier === 'constitutional';
  }

  return row || null;
}

/**
 * Get all memories for a spec folder
 *
 * @param {string} specFolder - Spec folder name
 * @returns {Object[]} Array of memory metadata
 */
function getMemoriesByFolder(specFolder) {
  const database = initializeDb();

  const rows = database.prepare(`
    SELECT * FROM memory_index WHERE spec_folder = ? ORDER BY created_at DESC
  `).all(specFolder);

  return rows.map(row => {
    if (row.trigger_phrases) {
      row.trigger_phrases = JSON.parse(row.trigger_phrases);
    }
    // Set isConstitutional based on actual tier
    row.isConstitutional = row.importance_tier === 'constitutional';
    return row;
  });
}

/**
 * Get total memory count
 *
 * @returns {number} Total number of indexed memories
 */
function getMemoryCount() {
  const database = initializeDb();
  // PERF-1: use cached prepared statement
  const stmts = initPreparedStatements(database);
  const result = stmts.countAll.get();
  return result.count;
}

/**
 * Get count by embedding status
 *
 * @returns {Object} Counts by status
 */
function getStatusCounts() {
  const database = initializeDb();

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

/**
 * Get overall statistics for the memory index
 * @returns {Object} Stats including total, success, pending, etc.
 */
function getStats() {
  const counts = getStatusCounts();
  const total = counts.pending + counts.success + counts.failed + counts.retry;

  return {
    total,
    ...counts
  };
}

// ───────────────────────────────────────────────────────────────
// VECTOR SEARCH
// ───────────────────────────────────────────────────────────────

/**
 * Search memories by vector similarity
 *
 * Constitutional tier memories are ALWAYS included at the top of results,
 * regardless of query, limited to ~2000 tokens worth of content.
 *
 * @param {Float32Array|Buffer} queryEmbedding - Query vector (768-dim)
 * @param {Object} [options] - Search options
 * @param {number} [options.limit=10] - Maximum results
 * @param {string} [options.specFolder] - Filter by spec folder
 * @param {number} [options.minSimilarity=0] - Minimum similarity (0-100)
 * @param {boolean} [options.useDecay=true] - Apply time-based decay to importance
 * @param {string} [options.tier] - Filter by importance tier (constitutional, critical, important, normal, temporary)
 * @param {string} [options.contextType] - Filter by context type (research, implementation, decision, discovery, general)
 * @param {boolean} [options.includeConstitutional=true] - Include constitutional memories at top
 * @returns {Object[]} Ranked results with similarity scores
 */
function vectorSearch(queryEmbedding, options = {}) {
  // Check if sqlite-vec is available (NFR-R01 graceful degradation)
  if (!sqliteVecAvailable) {
    console.warn('[vector-index] Vector search unavailable - sqlite-vec not loaded');
    return [];
  }

  const database = initializeDb();

  const {
    limit = 10,
    specFolder = null,
    minSimilarity = 0,
    useDecay = true,
    tier = null,
    contextType = null,
    includeConstitutional = true
  } = options;

  // Convert to Buffer using toEmbeddingBuffer for proper byteOffset handling
  const queryBuffer = toEmbeddingBuffer(queryEmbedding);

  // Convert minSimilarity (0-100) to max distance (0-2 for cosine)
  // similarity = (1 - distance/2) * 100, so distance = 2 * (1 - similarity/100)
  const maxDistance = 2 * (1 - minSimilarity / 100);

  // Build decay expression: importance * (0.5 ^ (days_since_update / half_life))
  // For pinned items, decay is disabled (multiplier = 1.0)
  // NULLIF prevents division by zero when decay_half_life_days is 0
  const decayExpr = useDecay
    ? `CASE WHEN m.is_pinned = 1 THEN m.importance_weight
        ELSE m.importance_weight * POWER(0.5, (julianday('now') - julianday(m.updated_at)) / COALESCE(NULLIF(m.decay_half_life_days, 0), 90.0))
       END`
    : 'm.importance_weight';

  // ─────────────────────────────────────────────────────────────────
  // CONSTITUTIONAL MEMORIES: Always surface at top (unless filtering by tier)
  // P1-CODE-004: Use cached constitutional memories to avoid repeated DB queries
  // ─────────────────────────────────────────────────────────────────
  let constitutionalResults = [];

  // Only fetch constitutional if not filtering by constitutional tier specifically and includeConstitutional is true
  if (includeConstitutional && tier !== 'constitutional') {
    constitutionalResults = getConstitutionalMemories(database, specFolder);
  }

  // ─────────────────────────────────────────────────────────────────
  // REGULAR VECTOR SEARCH
  // ─────────────────────────────────────────────────────────────────
  // Build dynamic WHERE clauses for tier and contextType filtering
  const whereClauses = ['m.embedding_status = \'success\''];
  const params = [queryBuffer];

  // P2-006: Filter out expired memories
  whereClauses.push('(m.expires_at IS NULL OR m.expires_at > datetime(\'now\'))');

  // Exclude deprecated and constitutional tier from regular search (constitutional already surfaced)
  if (tier === 'deprecated') {
    whereClauses.push('m.importance_tier = ?');
    params.push('deprecated');
  } else if (tier === 'constitutional') {
    whereClauses.push('m.importance_tier = ?');
    params.push('constitutional');
  } else if (tier) {
    whereClauses.push('m.importance_tier = ?');
    params.push(tier);
  } else {
    // Exclude both deprecated and constitutional from regular results (constitutional already at top)
    whereClauses.push('(m.importance_tier IS NULL OR m.importance_tier NOT IN (\'deprecated\', \'constitutional\'))');
  }

  if (specFolder) {
    whereClauses.push('m.spec_folder = ?');
    params.push(specFolder);
  }

  if (contextType) {
    whereClauses.push('m.context_type = ?');
    params.push(contextType);
  }

  // Adjust limit to account for constitutional results
  const adjustedLimit = Math.max(1, limit - constitutionalResults.length);
  params.push(maxDistance, adjustedLimit);

  // Refactored to compute distance only once using subquery pattern
  const sql = `
    SELECT sub.*,
           ROUND((1 - sub.distance / 2) * 100, 2) as similarity
    FROM (
      SELECT m.*, vec_distance_cosine(v.embedding, ?) as distance,
             ${decayExpr} as effective_importance
      FROM memory_index m
      JOIN vec_memories v ON m.id = v.rowid
      WHERE ${whereClauses.join(' AND ')}
    ) sub
    WHERE sub.distance <= ?
    ORDER BY (sub.distance - (sub.effective_importance * 0.1)) ASC
    LIMIT ?
  `;

  const rows = database.prepare(sql).all(...params);

  const regularResults = rows.map(row => {
    if (row.trigger_phrases) {
      row.trigger_phrases = JSON.parse(row.trigger_phrases);
    }
    // Set isConstitutional based on actual tier, not search path
    row.isConstitutional = row.importance_tier === 'constitutional';
    return row;
  });

  // Combine: constitutional first, then regular results
  return [...constitutionalResults, ...regularResults];
}

/**
 * Get all constitutional tier memories (public API wrapper)
 *
 * Returns constitutional memories without requiring a query embedding.
 * Useful for always-surfacing core rules regardless of search context.
 *
 * Note: This is a public API wrapper that delegates to the internal
 * cached getConstitutionalMemories(database, specFolder) function.
 *
 * @param {Object} [options] - Options
 * @param {string} [options.specFolder] - Filter by spec folder
 * @param {number} [options.maxTokens=2000] - Maximum tokens worth of results
 * @returns {Object[]} Constitutional memories sorted by importance
 */
function getConstitutionalMemoriesPublic(options = {}) {
  const database = initializeDb();
  const { specFolder = null, maxTokens = 2000 } = options;

  // Delegate to cached internal function
  let results = getConstitutionalMemories(database, specFolder);

  // Apply token budget limit if different from default
  const TOKENS_PER_MEMORY = 100;
  const maxCount = Math.floor(maxTokens / TOKENS_PER_MEMORY);
  if (results.length > maxCount) {
    results = results.slice(0, maxCount);
  }

  return results;
}

/**
 * Multi-concept AND search - finds memories matching ALL concepts
 *
 * @param {Array<Float32Array|Buffer>} conceptEmbeddings - Array of concept vectors (2-5)
 * @param {Object} [options] - Search options
 * @param {number} [options.limit=10] - Maximum results
 * @param {string} [options.specFolder] - Filter by spec folder
 * @param {number} [options.minSimilarity=50] - Minimum similarity per concept (0-100)
 * @returns {Object[]} Results matching ALL concepts with per-concept scores
 */
function multiConceptSearch(conceptEmbeddings, options = {}) {
  // Check if sqlite-vec is available (NFR-R01 graceful degradation)
  if (!sqliteVecAvailable) {
    console.warn('[vector-index] Multi-concept search unavailable - sqlite-vec not loaded');
    return [];
  }

  const database = initializeDb();

  const concepts = conceptEmbeddings;
  if (!Array.isArray(concepts) || concepts.length < 2 || concepts.length > 5) {
    throw new Error('Multi-concept search requires 2-5 concepts');
  }

  // Validate embedding dimensions before search
  for (const emb of concepts) {
    if (!emb || emb.length !== EMBEDDING_DIM) {
      throw new Error(`Invalid embedding dimension: expected ${EMBEDDING_DIM}, got ${emb?.length}`);
    }
  }

  const { limit = 10, specFolder = null, minSimilarity = 50 } = options;

  // Convert to Buffers using toEmbeddingBuffer for proper byteOffset handling
  const conceptBuffers = concepts.map(c => toEmbeddingBuffer(c));

  // Convert minSimilarity to max distance
  const maxDistance = 2 * (1 - minSimilarity / 100);

  // Build subquery with distances, then calculate similarities and averages in outer query
  const distanceExpressions = conceptBuffers.map((_, i) =>
    `vec_distance_cosine(v.embedding, ?) as dist_${i}`
  ).join(', ');

  const distanceFilters = conceptBuffers.map((_, i) =>
    `vec_distance_cosine(v.embedding, ?) <= ?`
  ).join(' AND ');

  const folderFilter = specFolder ? 'AND m.spec_folder = ?' : '';

  // Outer query expressions using the computed distances
  const similaritySelect = conceptBuffers.map((_, i) =>
    `ROUND((1 - sub.dist_${i} / 2) * 100, 2) as similarity_${i}`
  ).join(', ');

  const avgDistanceExpr = conceptBuffers.map((_, i) => `sub.dist_${i}`).join(' + ');

  // Build SQL with subquery pattern
  const sql = `
    SELECT
      sub.*,
      ${similaritySelect},
      (${avgDistanceExpr}) / ${concepts.length} as avg_distance
    FROM (
      SELECT
        m.*,
        ${distanceExpressions}
      FROM memory_index m
      JOIN vec_memories v ON m.id = v.rowid
      WHERE m.embedding_status = 'success'
        ${folderFilter}
        AND ${distanceFilters}
    ) sub
    ORDER BY avg_distance ASC
    LIMIT ?
  `;

  // Build params: distances in subquery, folder?, filters, limit
  const params = [
    ...conceptBuffers,                              // for distance expressions
    ...(specFolder ? [specFolder] : []),            // folder filter
    ...conceptBuffers.flatMap(b => [b, maxDistance]), // for distance filter conditions
    limit
  ];

  const rows = database.prepare(sql).all(...params);

  return rows.map(row => {
    if (row.trigger_phrases) {
      row.trigger_phrases = JSON.parse(row.trigger_phrases);
    }
    // Add concept_similarities array and calculate average
    row.concept_similarities = conceptBuffers.map((_, i) => row[`similarity_${i}`]);
    row.avg_similarity = row.concept_similarities.reduce((a, b) => a + b, 0) / concepts.length;
    // Set isConstitutional based on actual tier, not search path
    row.isConstitutional = row.importance_tier === 'constitutional';
    return row;
  });
}

// ───────────────────────────────────────────────────────────────
// CONTENT EXTRACTION HELPERS
// ───────────────────────────────────────────────────────────────

/**
 * Extract title from memory file content
 *
 * Tries in order:
 * 1. First markdown h1 heading (# Title)
 * 2. First markdown h2 heading (## Title)
 * 3. YAML frontmatter title field
 * 4. First non-empty line
 * 5. Filename without extension (fallback)
 *
 * @param {string} content - Full markdown content
 * @param {string} filename - Fallback filename
 * @returns {string} Extracted title
 */
function extractTitle(content, filename) {
  if (!content || typeof content !== 'string') {
    return filename ? path.basename(filename, path.extname(filename)) : 'Untitled';
  }

  // Try H1 heading: # Title
  const h1Match = content.match(/^#\s+(.+)$/m);
  if (h1Match && h1Match[1]) {
    return h1Match[1].trim();
  }

  // Try H2 heading: ## Title
  const h2Match = content.match(/^##\s+(.+)$/m);
  if (h2Match && h2Match[1]) {
    return h2Match[1].trim();
  }

  // Try YAML frontmatter title
  const yamlMatch = content.match(/^---[\s\S]*?^title:\s*(.+)$/m);
  if (yamlMatch && yamlMatch[1]) {
    return yamlMatch[1].trim().replace(/^["']|["']$/g, '');
  }

  // Try first non-empty line
  const lines = content.split('\n').filter(l => l.trim().length > 0);
  if (lines.length > 0) {
    const firstLine = lines[0].trim();
    // Clean up markdown formatting
    return firstLine.replace(/^#+\s*/, '').substring(0, 100);
  }

  // Fallback to filename
  return filename ? path.basename(filename, path.extname(filename)) : 'Untitled';
}

/**
 * Extract snippet from memory content
 *
 * Returns the first meaningful paragraph or sentence, excluding:
 * - YAML frontmatter
 * - Headings
 * - Empty lines
 *
 * @param {string} content - Full markdown content
 * @param {number} [maxLength=200] - Maximum snippet length
 * @returns {string} First paragraph/sentence as snippet
 */
function extractSnippet(content, maxLength = 200) {
  if (!content || typeof content !== 'string') {
    return '';
  }

  // Remove YAML frontmatter
  let text = content.replace(/^---[\s\S]*?---\n*/m, '');

  // Split into lines
  const lines = text.split('\n');
  const snippetLines = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip empty lines and headings
    if (!trimmed || /^#+\s/.test(trimmed)) {
      // If we already have content, stop at first break
      if (snippetLines.length > 0) {
        break;
      }
      continue;
    }

    // Skip metadata-like lines (key: value at start)
    if (/^[a-z_-]+:\s/i.test(trimmed) && snippetLines.length === 0) {
      continue;
    }

    snippetLines.push(trimmed);

    // Check if we have enough content
    const currentLength = snippetLines.join(' ').length;
    if (currentLength >= maxLength) {
      break;
    }
  }

  let snippet = snippetLines.join(' ');

  // Truncate if too long, break at word boundary
  if (snippet.length > maxLength) {
    snippet = snippet.substring(0, maxLength);
    const lastSpace = snippet.lastIndexOf(' ');
    if (lastSpace > maxLength * 0.7) {
      snippet = snippet.substring(0, lastSpace);
    }
    snippet += '...';
  }

  return snippet;
}

/**
 * Extract tags from memory content
 *
 * Looks for:
 * 1. YAML frontmatter tags field
 * 2. Inline hashtags (#tag)
 *
 * @param {string} content - Full markdown content
 * @returns {string[]} Array of unique tags
 */
function extractTags(content) {
  if (!content || typeof content !== 'string') {
    return [];
  }

  const tags = new Set();

  // Try YAML frontmatter tags
  const yamlTagsMatch = content.match(/^---[\s\S]*?^tags:\s*\[([^\]]+)\]/m);
  if (yamlTagsMatch && yamlTagsMatch[1]) {
    yamlTagsMatch[1].split(',').forEach(tag => {
      const cleaned = tag.trim().replace(/^["']|["']$/g, '');
      if (cleaned) tags.add(cleaned.toLowerCase());
    });
  }

  // Also try YAML list format
  const yamlListMatch = content.match(/^---[\s\S]*?^tags:\s*\n((?:\s*-\s*.+\n?)+)/m);
  if (yamlListMatch && yamlListMatch[1]) {
    yamlListMatch[1].match(/-\s*(.+)/g)?.forEach(match => {
      const tag = match.replace(/^-\s*/, '').trim().replace(/^["']|["']$/g, '');
      if (tag) tags.add(tag.toLowerCase());
    });
  }

  // Find inline hashtags (excluding headings)
  const hashtagMatches = content.match(/(?:^|\s)#([a-zA-Z][a-zA-Z0-9_-]*)/g);
  if (hashtagMatches) {
    hashtagMatches.forEach(match => {
      const tag = match.trim().replace(/^#/, '');
      if (tag && !tag.match(/^[0-9]+$/)) { // Skip pure numbers
        tags.add(tag.toLowerCase());
      }
    });
  }

  return Array.from(tags);
}

/**
 * Extract date from memory file
 *
 * Tries in order:
 * 1. YAML frontmatter date field
 * 2. Date pattern in filename (YYYY-MM-DD or DD-MM-YY)
 * 3. null if not found
 *
 * @param {string} content - Full markdown content
 * @param {string} filePath - File path for filename parsing
 * @returns {string|null} ISO date string or null
 */
function extractDate(content, filePath) {
  if (content && typeof content === 'string') {
    // Try YAML frontmatter date
    const dateMatch = content.match(/^---[\s\S]*?^date:\s*(.+)$/m);
    if (dateMatch && dateMatch[1]) {
      const dateStr = dateMatch[1].trim().replace(/^["']|["']$/g, '');
      try {
        const parsed = new Date(dateStr);
        if (!isNaN(parsed.getTime())) {
          return parsed.toISOString().split('T')[0];
        }
      } catch (e) {
        // Continue to filename parsing
      }
    }
  }

  if (filePath) {
    const filename = path.basename(filePath);

    // Try YYYY-MM-DD format
    const isoMatch = filename.match(/(\d{4}-\d{2}-\d{2})/);
    if (isoMatch) {
      return isoMatch[1];
    }

    // Try DD-MM-YY format
    const ddmmyyMatch = filename.match(/(\d{2})-(\d{2})-(\d{2})/);
    if (ddmmyyMatch) {
      const [, day, month, year] = ddmmyyMatch;
      const fullYear = parseInt(year) > 50 ? `19${year}` : `20${year}`;
      return `${fullYear}-${month}-${day}`;
    }
  }

  return null;
}

// ───────────────────────────────────────────────────────────────
// EMBEDDING GENERATION WRAPPER
// ───────────────────────────────────────────────────────────────

/**
 * Generate embedding for a query string with error handling
 *
 * Uses the task-specific generateQueryEmbedding from embeddings.js
 * which applies the "search_query: " prefix required by nomic-embed-text-v1.5.
 *
 * Wraps the embeddings module with graceful error handling.
 * Returns null on failure instead of throwing.
 *
 * @param {string} query - Query text to embed
 * @returns {Promise<Float32Array|null>} Embedding vector or null on failure
 */
async function generateQueryEmbedding(query) {
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    console.warn('[vector-index] Empty query provided for embedding');
    return null;
  }

  try {
    const embeddings = getEmbeddingsModule();
    // Use task-specific function that adds "search_query: " prefix
    const embedding = await embeddings.generateQueryEmbedding(query.trim());
    return embedding;
  } catch (error) {
    console.warn(`[vector-index] Query embedding failed: ${error.message}`);
    return null;
  }
}

// ───────────────────────────────────────────────────────────────
// KEYWORD SEARCH FALLBACK
// ───────────────────────────────────────────────────────────────

/**
 * Fallback keyword search when vector search unavailable
 *
 * Performs case-insensitive substring matching on:
 * - Title
 * - Trigger phrases
 * - Spec folder name
 *
 * @param {string} query - Search query
 * @param {Object} [options] - Search options
 * @param {number} [options.limit=20] - Maximum results
 * @param {string} [options.specFolder] - Filter by spec folder
 * @returns {Object[]} Matched results with basic scoring
 */
function keywordSearch(query, options = {}) {
  const database = initializeDb();
  const { limit = 20, specFolder = null } = options;

  if (!query || typeof query !== 'string') {
    return [];
  }

  const searchTerms = query.toLowerCase().trim().split(/\s+/).filter(t => t.length >= 2);
  if (searchTerms.length === 0) {
    return [];
  }

  // Build WHERE clause
  let whereClause = '1=1';
  const params = [];

  if (specFolder) {
    whereClause += ' AND spec_folder = ?';
    params.push(specFolder);
  }

  // Get all potential matches
  const sql = `
    SELECT * FROM memory_index
    WHERE ${whereClause}
    ORDER BY importance_weight DESC, created_at DESC
  `;

  const rows = database.prepare(sql).all(...params);

  // Score each row based on keyword matches
  const scored = rows.map(row => {
    let score = 0;
    const searchableText = [
      row.title || '',
      row.trigger_phrases || '',
      row.spec_folder || '',
      row.file_path || ''
    ].join(' ').toLowerCase();

    for (const term of searchTerms) {
      if (searchableText.includes(term)) {
        score += 1;

        // Bonus for title match
        if ((row.title || '').toLowerCase().includes(term)) {
          score += 2;
        }

        // Bonus for trigger phrase match
        if ((row.trigger_phrases || '').toLowerCase().includes(term)) {
          score += 1.5;
        }
      }
    }

    // Apply importance weight
    score *= (0.5 + row.importance_weight);

    return { ...row, keyword_score: score };
  });

  // Filter and sort by score
  const filtered = scored
    .filter(row => row.keyword_score > 0)
    .sort((a, b) => b.keyword_score - a.keyword_score)
    .slice(0, limit);

  // Parse trigger_phrases JSON
  return filtered.map(row => {
    if (row.trigger_phrases) {
      try {
        row.trigger_phrases = JSON.parse(row.trigger_phrases);
      } catch (e) {
        row.trigger_phrases = [];
      }
    }
    // Set isConstitutional based on actual tier
    row.isConstitutional = row.importance_tier === 'constitutional';
    return row;
  });
}

// ───────────────────────────────────────────────────────────────
// ENRICHED VECTOR SEARCH
// ───────────────────────────────────────────────────────────────

/**
 * Search memories with enriched results including full metadata
 *
 * Returns complete search results with:
 * - Ranked results with similarity scores
 * - Extracted titles and snippets from file content
 * - Tags parsed from content
 * - Date extracted from content/filename
 *
 * Automatically falls back to keyword search if:
 * - sqlite-vec is not available
 * - Embedding generation fails
 *
 * @param {string} query - Search query (natural language)
 * @param {number} [limit=20] - Maximum results
 * @param {Object} [options] - Additional options
 * @param {string} [options.specFolder] - Filter by spec folder
 * @param {number} [options.minSimilarity=30] - Minimum similarity threshold (0-100)
 * @returns {Promise<Array<{
 *   rank: number,
 *   similarity: number,
 *   title: string,
 *   specFolder: string,
 *   filePath: string,
 *   date: string|null,
 *   tags: string[],
 *   snippet: string,
 *   id: number,
 *   importanceWeight: number,
 *   searchMethod: 'vector'|'keyword'
 * }>>} Enriched search results
 */
async function vectorSearchEnriched(query, limit = 20, options = {}) {
  const startTime = Date.now();
  const { specFolder = null, minSimilarity = 30 } = options;

  // Try to generate query embedding
  const queryEmbedding = await generateQueryEmbedding(query);

  let rawResults;
  let searchMethod = 'vector';

  if (queryEmbedding && sqliteVecAvailable) {
    // Use vector search
    rawResults = vectorSearch(queryEmbedding, {
      limit,
      specFolder,
      minSimilarity
    });
  } else {
    // Fallback to keyword search
    console.warn('[vector-index] Falling back to keyword search');
    searchMethod = 'keyword';
    rawResults = keywordSearch(query, { limit, specFolder });
  }

  // Enrich results with content extraction
  const enrichedResults = [];

  for (let i = 0; i < rawResults.length; i++) {
    const row = rawResults[i];

    // Read file content for extraction (with path validation - CWE-22)
    const content = safeReadFile(row.file_path);

    // Extract metadata from content
    const title = row.title || extractTitle(content, row.file_path);
    const snippet = extractSnippet(content);
    const tags = extractTags(content);
    const date = extractDate(content, row.file_path) || row.created_at?.split('T')[0] || null;

    // Calculate similarity score
    let similarity;
    if (searchMethod === 'vector') {
      similarity = row.similarity || 0;
    } else {
      // Normalize keyword score to 0-100 scale
      similarity = Math.min(100, (row.keyword_score || 0) * 20);
    }

    enrichedResults.push({
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
      searchMethod,
      // Preserve isConstitutional from raw results
      isConstitutional: row.isConstitutional || row.importance_tier === 'constitutional'
    });
  }

  const elapsed = Date.now() - startTime;
  if (elapsed > 500) {
    console.warn(`[vector-index] Enriched search took ${elapsed}ms (target <500ms)`);
  }

  return enrichedResults;
}

// ───────────────────────────────────────────────────────────────
// MULTI-CONCEPT SEARCH (ENHANCED)
// ───────────────────────────────────────────────────────────────

/**
 * Search with multiple concepts using AND logic
 *
 * Accepts either:
 * - Array of pre-computed embeddings (Float32Array/Buffer)
 * - Array of string concepts (will generate embeddings)
 *
 * Returns memories that match ALL concepts above the threshold.
 *
 * @param {Array<string|Float32Array|Buffer>} concepts - Array of concepts (2-5)
 * @param {number} [limit=20] - Maximum results
 * @param {Object} [options] - Search options
 * @param {string} [options.specFolder] - Filter by spec folder
 * @param {number} [options.minSimilarity=50] - Minimum similarity per concept (0-100)
 * @returns {Promise<Array<{
 *   rank: number,
 *   avgSimilarity: number,
 *   conceptSimilarities: number[],
 *   title: string,
 *   specFolder: string,
 *   filePath: string,
 *   date: string|null,
 *   tags: string[],
 *   snippet: string,
 *   id: number
 * }>>} Results matching ALL concepts with per-concept scores
 */
async function multiConceptSearchEnriched(concepts, limit = 20, options = {}) {
  const startTime = Date.now();

  if (!Array.isArray(concepts) || concepts.length < 2 || concepts.length > 5) {
    throw new Error('Multi-concept search requires 2-5 concepts');
  }

  const { specFolder = null, minSimilarity = 50 } = options;

  // Convert string concepts to embeddings
  const conceptEmbeddings = [];
  for (const concept of concepts) {
    if (typeof concept === 'string') {
      const embedding = await generateQueryEmbedding(concept);
      if (!embedding) {
        console.warn(`[vector-index] Failed to embed concept: "${concept}"`);
        // Fall back to keyword intersection
        return multiConceptKeywordSearch(concepts.filter(c => typeof c === 'string'), limit, options);
      }
      conceptEmbeddings.push(embedding);
    } else {
      // Assume it's already an embedding
      conceptEmbeddings.push(concept);
    }
  }

  // Check if vector search is available
  if (!sqliteVecAvailable) {
    console.warn('[vector-index] Falling back to keyword multi-concept search');
    return multiConceptKeywordSearch(concepts.filter(c => typeof c === 'string'), limit, options);
  }

  // Use existing multiConceptSearch for vector-based search
  const rawResults = multiConceptSearch(conceptEmbeddings, { limit, specFolder, minSimilarity });

  // Enrich results
  const enrichedResults = [];

  for (let i = 0; i < rawResults.length; i++) {
    const row = rawResults[i];

    // Read file content (with path validation - CWE-22)
    const content = safeReadFile(row.file_path);

    const title = row.title || extractTitle(content, row.file_path);
    const snippet = extractSnippet(content);
    const tags = extractTags(content);
    const date = extractDate(content, row.file_path) || row.created_at?.split('T')[0] || null;

    enrichedResults.push({
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
      // Preserve isConstitutional from raw results
      isConstitutional: row.isConstitutional || row.importance_tier === 'constitutional'
    });
  }

  const elapsed = Date.now() - startTime;
  if (elapsed > 500) {
    console.warn(`[vector-index] Multi-concept search took ${elapsed}ms (target <500ms)`);
  }

  return enrichedResults;
}

/**
 * Keyword-based multi-concept search (fallback)
 *
 * Uses intersection of keyword matches for AND logic.
 *
 * @param {string[]} concepts - Array of search terms
 * @param {number} limit - Maximum results
 * @param {Object} options - Search options
 * @returns {Array} Results matching ALL concepts
 */
function multiConceptKeywordSearch(concepts, limit = 20, options = {}) {
  const database = initializeDb();
  const { specFolder = null } = options;

  if (!concepts.length) return [];

  // Get keyword results for each concept
  const conceptResults = concepts.map(concept =>
    keywordSearch(concept, { limit: 100, specFolder })
  );

  // Find intersection - memories that appear in ALL concept results
  const idCounts = new Map();
  const idToRow = new Map();

  for (const results of conceptResults) {
    for (const row of results) {
      const count = idCounts.get(row.id) || 0;
      idCounts.set(row.id, count + 1);
      if (!idToRow.has(row.id)) {
        idToRow.set(row.id, row);
      }
    }
  }

  // Filter to only those appearing in all concept results
  const matchingIds = [];
  for (const [id, count] of idCounts) {
    if (count === concepts.length) {
      matchingIds.push(id);
    }
  }

  // Build enriched results
  const enrichedResults = [];
  for (let i = 0; i < Math.min(matchingIds.length, limit); i++) {
    const id = matchingIds[i];
    const row = idToRow.get(id);

    // Read file content (with path validation - CWE-22)
    const content = safeReadFile(row.file_path);

    const title = row.title || extractTitle(content, row.file_path);
    const snippet = extractSnippet(content);
    const tags = extractTags(content);
    const date = extractDate(content, row.file_path) || row.created_at?.split('T')[0] || null;

    enrichedResults.push({
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
      // Set isConstitutional based on actual tier
      isConstitutional: row.importance_tier === 'constitutional'
    });
  }

  return enrichedResults;
}

/**
 * Parse quoted terms from a search query
 *
 * Extracts multiple quoted terms for AND search.
 * Example: '"memory system" "vector search"' => ['memory system', 'vector search']
 *
 * @param {string} query - Search query with quoted terms
 * @returns {string[]} Array of extracted terms
 */
function parseQuotedTerms(query) {
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

// ───────────────────────────────────────────────────────────────
// SMART RANKING AND DIVERSITY (T3.5, T3.6, T3.7)
// ───────────────────────────────────────────────────────────────

/**
 * Apply smart ranking to search results
 *
 * Re-ranks results based on a composite score combining:
 * - Similarity: 50% weight (semantic relevance)
 * - Recency: 30% weight (newer = higher)
 * - Usage: 20% weight (more accessed = higher)
 *
 * This is "invisible magic" - users experience better results
 * without knowing the mechanism.
 *
 * @param {Array} results - Raw search results with similarity scores
 * @returns {Array} Re-ranked results with composite smartScore
 */
function applySmartRanking(results) {
  if (!results || results.length === 0) return results;

  const now = Date.now();
  const WEEK = 7 * 24 * 60 * 60 * 1000;
  const MONTH = 30 * 24 * 60 * 60 * 1000;

  return results.map(r => {
    // Calculate recency factor based on created_at
    const createdAt = r.created_at ? new Date(r.created_at).getTime() : now;
    const age = now - createdAt;
    let recencyFactor;
    if (age < WEEK) {
      recencyFactor = 1.0;  // Full boost for last week
    } else if (age < MONTH) {
      recencyFactor = 0.8;  // 80% for last month
    } else {
      recencyFactor = 0.5;  // 50% for older
    }

    // Calculate usage factor (capped at 10 accesses for normalization)
    const usageFactor = Math.min(1.0, (r.access_count || 0) / 10);

    // Normalize similarity to 0-1 (it comes as 0-100)
    const similarityFactor = (r.similarity || 0) / 100;

    // Composite score: 50% similarity, 30% recency, 20% usage
    r.smartScore = (similarityFactor * 0.5) + (recencyFactor * 0.3) + (usageFactor * 0.2);
    r.smartScore = Math.round(r.smartScore * 100) / 100;  // Round to 2 decimals

    return r;
  }).sort((a, b) => b.smartScore - a.smartScore);
}

/**
 * Apply diversity filtering using MMR (Maximal Marginal Relevance)
 *
 * Reduces redundancy in search results by penalizing items that are
 * too similar to already-selected items. Uses spec folder and date
 * as proxies for content similarity.
 *
 * MMR formula: score = relevance - lambda * maxSimilarityToSelected
 *
 * @param {Array} results - Search results (should have smartScore or similarity)
 * @param {number} [diversityFactor=0.3] - Lambda: how much to penalize similarity (0-1)
 * @returns {Array} Diversified results maintaining relevance
 */
function applyDiversity(results, diversityFactor = 0.3) {
  if (!results || results.length <= 3) return results;  // Don't diversify tiny result sets

  const selected = [results[0]];  // Always include top result
  const remaining = [...results.slice(1)];

  while (selected.length < results.length && remaining.length > 0) {
    let bestIdx = 0;
    let bestScore = -Infinity;

    for (let i = 0; i < remaining.length; i++) {
      const candidate = remaining[i];
      const relevance = candidate.smartScore || (candidate.similarity / 100) || 0;

      // Find max similarity to already selected items
      // Use spec folder and date as proxies for similarity
      let maxSimilarityToSelected = 0;
      for (const sel of selected) {
        // Same spec folder = high similarity (likely related content)
        if (sel.specFolder === candidate.specFolder || sel.spec_folder === candidate.spec_folder) {
          maxSimilarityToSelected = Math.max(maxSimilarityToSelected, 0.8);
        }
        // Same date = moderate similarity (likely same session)
        if (sel.date === candidate.date) {
          maxSimilarityToSelected = Math.max(maxSimilarityToSelected, 0.5);
        }
      }

      // MMR score: relevance - lambda * maxSimilarity
      const mmrScore = relevance - (diversityFactor * maxSimilarityToSelected);

      if (mmrScore > bestScore) {
        bestScore = mmrScore;
        bestIdx = i;
      }
    }

    selected.push(remaining.splice(bestIdx, 1)[0]);
  }

  return selected;
}

/**
 * Learn trigger phrases from user search behavior
 *
 * Called when user selects a search result. Extracts meaningful
 * terms from the search query and adds them as trigger phrases
 * for future searches.
 *
 * Learning rules:
 * - Terms must be at least 4 characters
 * - Common stop words are excluded
 * - Max 3 new triggers per search
 * - Max 10 total triggers per memory
 *
 * @param {string} searchQuery - The query user searched for
 * @param {number} selectedMemoryId - ID of the memory user selected
 * @returns {boolean} True if triggers were updated
 */
function learnFromSelection(searchQuery, selectedMemoryId) {
  if (!searchQuery || !selectedMemoryId) return false;

  const database = initializeDb();

  // Get current triggers
  let memory;
  try {
    memory = database.prepare(
      'SELECT trigger_phrases FROM memory_index WHERE id = ?'
    ).get(selectedMemoryId);
  } catch (e) {
    console.warn(`[vector-index] learnFromSelection query error: ${e.message}`);
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
  const stopWords = [
    'that', 'this', 'what', 'where', 'when', 'which', 'with', 'from',
    'have', 'been', 'were', 'being', 'about', 'into', 'through', 'during',
    'before', 'after', 'above', 'below', 'between', 'under', 'again',
    'further', 'then', 'once', 'here', 'there', 'each', 'some', 'other'
  ];

  // Extract meaningful terms from query
  const newTerms = searchQuery
    .toLowerCase()
    .split(/\s+/)
    .filter(term => {
      // Must be at least 4 chars
      if (term.length < 4) return false;
      // Skip common words
      if (stopWords.includes(term)) return false;
      // Skip if already exists (case-insensitive)
      if (existing.some(e => e.toLowerCase() === term)) return false;
      // Skip pure numbers
      if (/^\d+$/.test(term)) return false;
      return true;
    })
    .slice(0, 3);  // Max 3 new triggers per search

  if (newTerms.length === 0) return false;

  // Cap total triggers at 10 per memory
  const updated = [...existing, ...newTerms].slice(0, 10);

  try {
    database.prepare(
      'UPDATE memory_index SET trigger_phrases = ? WHERE id = ?'
    ).run(JSON.stringify(updated), selectedMemoryId);
    return true;
  } catch (e) {
    console.warn(`[vector-index] learnFromSelection update error: ${e.message}`);
    return false;
  }
}

/**
 * Enhanced search with smart ranking and diversity
 *
 * Wraps vectorSearchEnriched with additional processing:
 * 1. Fetches more results than requested (2x limit)
 * 2. Applies smart ranking (similarity + recency + usage)
 * 3. Applies diversity filtering (MMR algorithm)
 * 4. Trims to requested limit
 *
 * @param {string} query - Search query
 * @param {number} [limit=20] - Max results to return
 * @param {Object} [options] - Search options
 * @param {string} [options.specFolder] - Filter by spec folder
 * @param {number} [options.minSimilarity=30] - Minimum similarity threshold
 * @param {boolean} [options.noDiversity=false] - Skip diversity filtering
 * @param {number} [options.diversityFactor=0.3] - MMR lambda (0-1)
 * @returns {Promise<Array>} Enhanced search results with smartScore
 */
async function enhancedSearch(query, limit = 20, options = {}) {
  const startTime = Date.now();

  // Get more results than needed for diversity filtering
  const fetchLimit = Math.min(limit * 2, 100);

  // Get base results
  const results = await vectorSearchEnriched(query, fetchLimit, {
    specFolder: options.specFolder,
    minSimilarity: options.minSimilarity || 30
  });

  // Apply smart ranking
  const ranked = applySmartRanking(results);

  // Apply diversity (optional, default on)
  const diversityFactor = options.diversityFactor !== undefined ? options.diversityFactor : 0.3;
  const diverse = options.noDiversity ? ranked : applyDiversity(ranked, diversityFactor);

  // Trim to requested limit
  const finalResults = diverse.slice(0, limit);

  const elapsed = Date.now() - startTime;
  if (elapsed > 600) {
    console.warn(`[vector-index] Enhanced search took ${elapsed}ms (target <600ms)`);
  }

  return finalResults;
}

// ───────────────────────────────────────────────────────────────
// RELATED MEMORIES & USAGE TRACKING (Phase 1 & 3)
// ───────────────────────────────────────────────────────────────

/**
 * LRU Cache with O(1) eviction using doubly-linked list
 * M5 fix: Replaces O(n) iteration-based eviction
 */
class LRUCache {
  constructor(maxSize, ttlMs) {
    this.maxSize = maxSize;
    this.ttlMs = ttlMs;
    this.cache = new Map();
    this.head = { prev: null, next: null };
    this.tail = { prev: this.head, next: null };
    this.head.next = this.tail;
  }

  get(key) {
    const node = this.cache.get(key);
    if (!node) return null;
    if (Date.now() - node.timestamp > this.ttlMs) {
      this._remove(node);
      this.cache.delete(key);
      return null;
    }
    this._moveToFront(node);
    return node.value;
  }

  set(key, value) {
    let node = this.cache.get(key);
    if (node) {
      node.value = value;
      node.timestamp = Date.now();
      this._moveToFront(node);
    } else {
      node = { key, value, timestamp: Date.now(), prev: null, next: null };
      this._addToFront(node);
      this.cache.set(key, node);
      if (this.cache.size > this.maxSize) {
        const oldest = this.tail.prev;
        this._remove(oldest);
        this.cache.delete(oldest.key);
      }
    }
  }

  _addToFront(node) {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next.prev = node;
    this.head.next = node;
  }

  _remove(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  _moveToFront(node) {
    this._remove(node);
    this._addToFront(node);
  }

  clear() {
    this.cache.clear();
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  get size() { return this.cache.size; }
}

/**
 * LRU Cache instance for search queries
 */
let queryCache = null;

/**
 * Get or initialize the query cache
 * Uses O(1) LRU implementation with doubly-linked list
 *
 * @returns {LRUCache} LRU cache instance
 */
function getQueryCache() {
  if (!queryCache) {
    queryCache = new LRUCache(500, 15 * 60 * 1000); // 500 entries, 15 min TTL
  }
  return queryCache;
}

/**
 * Find and link related memories when saving a new memory (T1.3)
 *
 * Automatically discovers semantically similar memories using vector search
 * and stores their IDs with similarity scores in the related_memories field.
 *
 * @param {number} newMemoryId - ID of the newly saved memory
 * @param {string} content - Content of the memory (for embedding generation)
 * @returns {Promise<void>}
 *
 * @example
 * // After indexing a new memory
 * const memoryId = indexMemory({ specFolder, filePath, embedding, ... });
 * await linkRelatedOnSave(memoryId, fileContent);
 */
async function linkRelatedOnSave(newMemoryId, content) {
  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    return;
  }

  try {
    // Generate embedding for the content (first 1000 chars for efficiency)
    const embedding = await generateQueryEmbedding(content.substring(0, 1000));
    if (!embedding) {
      console.warn(`[vector-index] Could not generate embedding for memory ${newMemoryId}`);
      return;
    }

    // Find similar memories (75% threshold as specified)
    const similar = vectorSearch(embedding, {
      limit: 6,  // Get 6 to allow for filtering out self
      minSimilarity: 75
    });

    // Filter out self and limit to 5 related memories
    const related = similar
      .filter(r => r.id !== newMemoryId)
      .slice(0, 5)
      .map(r => ({ id: r.id, similarity: r.similarity }));

    if (related.length > 0) {
      const database = initializeDb();
      database.prepare(`
        UPDATE memory_index
        SET related_memories = ?
        WHERE id = ?
      `).run(JSON.stringify(related), newMemoryId);
    }
  } catch (error) {
    console.warn(`[vector-index] Failed to link related memories for ${newMemoryId}: ${error.message}`);
  }
}

/**
 * Record that a memory was accessed for usage tracking (T3.2)
 *
 * Increments access_count and updates last_accessed timestamp.
 * Used for analytics and potential cleanup of rarely-accessed memories.
 *
 * H6 fix: last_accessed column is INTEGER type (Unix timestamp).
 * We store Unix timestamp in milliseconds for precision and efficient sorting.
 *
 * @param {number} memoryId - ID of the accessed memory
 * @returns {boolean} True if access was recorded, false if memory not found
 *
 * @example
 * // When displaying a memory to the user
 * recordAccess(memory.id);
 */
function recordAccess(memoryId) {
  try {
    const database = initializeDb();
    // H6 fix: Use Unix timestamp (INTEGER) instead of ISO string
    const now = Date.now();

    const result = database.prepare(`
      UPDATE memory_index
      SET access_count = access_count + 1,
          last_accessed = ?
      WHERE id = ?
    `).run(now, memoryId);

    return result.changes > 0;
  } catch (error) {
    console.warn(`[vector-index] Failed to record access for memory ${memoryId}: ${error.message}`);
    return false;
  }
}

/**
 * Cached version of vectorSearchEnriched (T3.4)
 *
 * Wraps vectorSearchEnriched with a simple LRU cache to avoid
 * repeated embedding generation and database queries for identical searches.
 *
 * Cache settings:
 * - Max entries: 500
 * - TTL: 15 minutes
 * - Key format: query:limit:JSON(options)
 *
 * @param {string} query - Search query (natural language)
 * @param {number} [limit=20] - Maximum results
 * @param {Object} [options] - Search options (specFolder, minSimilarity)
 * @returns {Promise<Array>} Cached or fresh search results
 *
 * @example
 * // Use instead of vectorSearchEnriched for repeated queries
 * const results = await cachedSearch('authentication flow', 10);
 */
async function cachedSearch(query, limit = 20, options = {}) {
  const cache = getQueryCache();
  const key = `${query}:${limit}:${JSON.stringify(options)}`;

  // M5 fix: LRUCache.get() handles TTL expiry and LRU ordering internally (O(1))
  const cached = cache.get(key);
  if (cached) {
    return cached.results;
  }

  // Perform actual search
  const results = await vectorSearchEnriched(query, limit, options);

  // M5 fix: LRUCache.set() handles eviction internally using O(1) doubly-linked list
  cache.set(key, { results });

  return results;
}

/**
 * Clear the search cache with optional granular invalidation (L14)
 *
 * Use when memories are updated/deleted to ensure fresh results.
 * Supports selective cache clearing by spec folder for efficiency.
 *
 * @param {string} [specFolder=null] - Optional spec folder to clear (null clears entire cache)
 * @returns {number} Number of cache entries cleared
 *
 * @example
 * // Clear entire cache
 * clearSearchCache();
 *
 * @example
 * // Clear only entries for a specific spec folder
 * clearSearchCache('005-memory');
 */
function clearSearchCache(specFolder = null) {
  if (!queryCache) {
    return 0;
  }

  if (specFolder) {
    // Granular invalidation: only clear entries containing this spec folder
    let cleared = 0;
    for (const [key, node] of queryCache.cache) {
      if (key.includes(specFolder)) {
        queryCache.cache.delete(key);
        // Also remove from linked list
        queryCache._remove(node);
        cleared++;
      }
    }
    return cleared;
  } else {
    // Clear entire cache
    const size = queryCache.size;
    queryCache.clear();
    return size;
  }
}

/**
 * Get related memories for a given memory ID (T1.3 helper)
 *
 * Retrieves the pre-computed related memories stored during save,
 * with full metadata for each related memory.
 *
 * @param {number} memoryId - Memory ID to get related memories for
 * @returns {Array<Object>} Related memories with metadata and relationSimilarity
 *
 * @example
 * const related = getRelatedMemories(currentMemory.id);
 * // Returns: [{ id, title, specFolder, ..., relationSimilarity: 82.5 }, ...]
 */
function getRelatedMemories(memoryId) {
  try {
    const database = initializeDb();

    const memory = database.prepare(`
      SELECT related_memories FROM memory_index WHERE id = ?
    `).get(memoryId);

    if (!memory || !memory.related_memories) {
      return [];
    }

    const related = safeParseJSON(memory.related_memories, []);

    // Fetch full metadata for each related memory
    return related.map(rel => {
      const fullMemory = getMemory(rel.id);
      if (fullMemory) {
        return {
          ...fullMemory,
          relationSimilarity: rel.similarity
        };
      }
      return null;
    }).filter(Boolean);
  } catch (error) {
    console.warn(`[vector-index] Failed to get related memories for ${memoryId}: ${error.message}`);
    return [];
  }
}

/**
 * Get usage statistics for memories (T3.2 analytics helper)
 *
 * Returns memories sorted by access count or last accessed time.
 * Useful for identifying frequently used vs stale memories.
 *
 * @param {Object} [options] - Query options
 * @param {string} [options.sortBy='access_count'] - Sort by 'access_count' or 'last_accessed'
 * @param {string} [options.order='DESC'] - Sort order 'ASC' or 'DESC'
 * @param {number} [options.limit=20] - Maximum results
 * @returns {Array<Object>} Memories with usage stats
 */
function getUsageStats(options = {}) {
  const {
    sortBy = 'access_count',
    order = 'DESC',
    limit = 20
  } = options;

  // Validate sortBy to prevent SQL injection
  const validSortFields = ['access_count', 'last_accessed', 'confidence'];
  const sortField = validSortFields.includes(sortBy) ? sortBy : 'access_count';
  const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  const database = initializeDb();

  const rows = database.prepare(`
    SELECT id, title, spec_folder, file_path, access_count,
           last_accessed, confidence, created_at
    FROM memory_index
    WHERE access_count > 0
    ORDER BY ${sortField} ${sortOrder}
    LIMIT ?
  `).all(limit);

  return rows;
}

/**
 * Update embedding status for a memory (M9 fix)
 *
 * Used to mark memories for re-embedding when embedding regeneration fails
 * but we still want to proceed with metadata updates (partial update mode).
 *
 * Valid statuses:
 * - 'pending': Needs embedding generation
 * - 'success': Embedding generated successfully
 * - 'failed': Embedding generation failed
 * - 'retry': Scheduled for retry
 *
 * @param {number} id - Memory ID to update
 * @param {string} status - New embedding status ('pending', 'success', 'failed', 'retry')
 * @returns {boolean} True if updated successfully
 */
function updateEmbeddingStatus(id, status) {
  const validStatuses = ['pending', 'success', 'failed', 'retry'];
  if (!validStatuses.includes(status)) {
    console.warn(`[vector-index] Invalid embedding status: ${status}`);
    return false;
  }

  try {
    const database = initializeDb();
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

/**
 * Update confidence score for a memory
 *
 * @param {number} memoryId - Memory ID to update
 * @param {number} confidence - New confidence score (0.0 to 1.0)
 * @returns {boolean} True if updated successfully
 */
function updateConfidence(memoryId, confidence) {
  if (typeof confidence !== 'number' || confidence < 0 || confidence > 1) {
    console.warn(`[vector-index] Invalid confidence value: ${confidence}`);
    return false;
  }

  try {
    const database = initializeDb();
    const result = database.prepare(`
      UPDATE memory_index
      SET confidence = ?
      WHERE id = ?
    `).run(confidence, memoryId);

    return result.changes > 0;
  } catch (error) {
    console.warn(`[vector-index] Failed to update confidence for ${memoryId}: ${error.message}`);
    return false;
  }
}

// ───────────────────────────────────────────────────────────────
// CLEANUP FUNCTIONS (T2.2)
// ───────────────────────────────────────────────────────────────

/**
 * Find memories that may be candidates for cleanup
 * Uses smart defaults - users don't configure this
 *
 * Smart defaults (internal):
 * - maxAgeDays: 90 (older than 3 months)
 * - maxAccessCount: 2 (accessed less than 3 times)
 * - maxConfidence: 0.4 (low importance score)
 *
 * A memory is a candidate if it meets ANY of these criteria
 *
 * @param {Object} options - Override defaults for testing
 * @param {number} options.maxAgeDays - Max age in days (default: 90)
 * @param {number} options.maxAccessCount - Max access count (default: 2)
 * @param {number} options.maxConfidence - Max confidence (default: 0.4)
 * @param {number} options.limit - Max candidates to return (default: 50)
 * @returns {Array<Object>} Cleanup candidates with metadata
 */
function findCleanupCandidates(options = {}) {
  const database = initializeDb();

  const {
    maxAgeDays = 90,
    maxAccessCount = 2,
    maxConfidence = 0.4,
    limit = 50
  } = options;

  // Calculate cutoff date
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - maxAgeDays);
  const cutoffIso = cutoffDate.toISOString();

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
      cutoffIso,
      maxAccessCount,
      maxConfidence,
      cutoffIso,
      limit
    );
  } catch (e) {
    console.warn(`[vector-index] findCleanupCandidates error: ${e.message}`);
    return [];
  }

  // Enrich with human-readable age
  return rows.map(row => {
    const ageString = formatAgeString(row.created_at);
    const lastAccessString = formatAgeString(row.last_accessed);

    // Determine why this is a candidate
    const reasons = [];
    if (row.created_at && new Date(row.created_at) < cutoffDate) {
      reasons.push(`created ${ageString}`);
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
      ageString,
      lastAccessString,
      reasons
    };
  });
}

/**
 * Delete multiple memories by ID
 * Used by cleanup command for batch operations
 *
 * @param {number[]} memoryIds - Array of memory IDs to delete
 * @returns {Object} Result with counts
 */
function deleteMemories(memoryIds) {
  if (!memoryIds || memoryIds.length === 0) {
    return { deleted: 0, failed: 0 };
  }

  const database = initializeDb();
  let deleted = 0;
  let failed = 0;

  const deleteTransaction = database.transaction(() => {
    for (const id of memoryIds) {
      try {
        // Delete from vec_memories first (if it exists and sqlite-vec is available)
        if (sqliteVecAvailable) {
          try {
            database.prepare('DELETE FROM vec_memories WHERE rowid = ?').run(BigInt(id));
          } catch (vecError) {
            // M14 fix: Log vector deletion errors instead of swallowing silently
            console.warn(`[VectorIndex] Failed to delete vector for memory ${id}: ${vecError.message}`);
            // Continue - vector may not exist
          }
        }

        // Delete from memory_index
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
    deleteTransaction();
    // M10 fix: Clear constitutional cache after batch delete
    // (some deleted memories may have been constitutional tier)
    if (deleted > 0) {
      clearConstitutionalCache();
      clearSearchCache();
    }
  } catch (e) {
    console.warn(`[vector-index] deleteMemories transaction error: ${e.message}`);
  }

  return { deleted, failed };
}

/**
 * Get a preview of memory content for the cleanup [v]iew option
 *
 * @param {number} memoryId - Memory ID
 * @param {number} maxLines - Maximum lines to return (default: 50)
 * @returns {Object|null} Memory preview with content
 */
function getMemoryPreview(memoryId, maxLines = 50) {
  const database = initializeDb();

  let memory;
  try {
    memory = database.prepare(`
      SELECT * FROM memory_index WHERE id = ?
    `).get(memoryId);
  } catch (e) {
    console.warn(`[vector-index] getMemoryPreview query error: ${e.message}`);
    return null;
  }

  if (!memory) return null;

  let content = '';
  try {
    if (memory.file_path && fs.existsSync(memory.file_path)) {
      const fullContent = fs.readFileSync(memory.file_path, 'utf-8');
      const lines = fullContent.split('\n');
      content = lines.slice(0, maxLines).join('\n');
      if (lines.length > maxLines) {
        content += `\n... (${lines.length - maxLines} more lines)`;
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
    ageString: formatAgeString(memory.created_at),
    lastAccessString: formatAgeString(memory.last_accessed),
    content
  };
}

// ───────────────────────────────────────────────────────────────
// DATABASE UTILITIES
// ───────────────────────────────────────────────────────────────

/**
 * Close database connection
 */
function closeDb() {
  if (db) {
    db.close();
    db = null;
  }
}

/**
 * Get database path
 * @returns {string} Current database path
 */
function getDbPath() {
  return dbPath;
}

/**
 * Get raw database instance (for advanced queries)
 * @returns {Object} better-sqlite3 instance
 */
function getDb() {
  return initializeDb();
}

/**
 * Verify database integrity
 *
 * Checks for:
 * 1. Orphaned vectors (vectors without matching memory_index entries)
 * 2. Missing vectors (memory_index entries marked success but no vector)
 * 3. Orphaned files (memory_index entries pointing to non-existent files) [C2 fix]
 *
 * @returns {Object} Integrity check results
 */
function verifyIntegrity() {
  const database = initializeDb();

  // Count mismatched rowids
  const orphanedVectors = database.prepare(`
    SELECT COUNT(*) as count FROM vec_memories v
    WHERE NOT EXISTS (SELECT 1 FROM memory_index m WHERE m.id = v.rowid)
  `).get().count;

  const missingVectors = database.prepare(`
    SELECT COUNT(*) as count FROM memory_index m
    WHERE m.embedding_status = 'success'
    AND NOT EXISTS (SELECT 1 FROM vec_memories v WHERE v.rowid = m.id)
  `).get().count;

  const totalMemories = database.prepare('SELECT COUNT(*) as count FROM memory_index').get().count;
  const totalVectors = database.prepare('SELECT COUNT(*) as count FROM vec_memories').get().count;

  // C2 FIX: Check for orphaned files (memory entries pointing to non-existent files)
  const checkOrphanedFiles = () => {
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

  const orphanedFiles = checkOrphanedFiles();

  return {
    totalMemories,
    totalVectors,
    orphanedVectors,
    missingVectors,
    orphanedFiles,
    isConsistent: orphanedVectors === 0 && missingVectors === 0 && orphanedFiles.length === 0
  };
}

// ───────────────────────────────────────────────────────────────
// MODULE EXPORTS
// ───────────────────────────────────────────────────────────────

/**
 * Check if vector search is available (sqlite-vec loaded)
 * @returns {boolean} True if vector search is available
 */
function isVectorSearchAvailable() {
  return sqliteVecAvailable;
}

module.exports = {
  // Initialization
  initializeDb,
  closeDb,
  getDb,
  getDbPath,

  // Core operations
  indexMemory,
  updateMemory,
  deleteMemory,
  deleteMemoryByPath,

  // Queries
  getMemory,
  getMemoriesByFolder,
  getMemoryCount,
  getStatusCounts,
  getStats,
  verifyIntegrity,

  // Search - Basic
  vectorSearch,
  getConstitutionalMemories: getConstitutionalMemoriesPublic, // P0-001: Export public wrapper, internal cached version used internally
  clearConstitutionalCache,
  multiConceptSearch,
  isVectorSearchAvailable,

  // Search - Enriched (US1, US8)
  vectorSearchEnriched,
  multiConceptSearchEnriched,
  keywordSearch,
  multiConceptKeywordSearch,

  // Search - Cached (T3.4)
  cachedSearch,
  clearSearchCache,

  // Smart Ranking & Diversity (T3.5, T3.6, T3.7)
  applySmartRanking,
  applyDiversity,
  learnFromSelection,
  enhancedSearch,

  // Related Memories (T1.3)
  linkRelatedOnSave,
  getRelatedMemories,

  // Usage Tracking (T3.2)
  recordAccess,
  getUsageStats,
  updateConfidence,

  // Embedding Status (M9)
  updateEmbeddingStatus,

  // Cleanup Functions (T2.2)
  findCleanupCandidates,
  deleteMemories,
  getMemoryPreview,

  // Content Extraction Helpers
  extractTitle,
  extractSnippet,
  extractTags,
  extractDate,

  // Query Utilities
  generateQueryEmbedding,
  parseQuotedTerms,

  // Constants
  EMBEDDING_DIM,
  DEFAULT_DB_PATH
};

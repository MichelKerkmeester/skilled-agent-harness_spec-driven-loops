/**
 * Vector Index Module - sqlite-vec based vector storage
 *
 * Provides persistent vector storage for memory embeddings using
 * sqlite-vec extension. Supports cross-spec-folder search with
 * synchronized rowid linkage between metadata and vectors.
 *
 * @module vector-index
 * @version 12.0.0
 */

'use strict';

const Database = require('better-sqlite3');
const sqliteVec = require('sqlite-vec');
const path = require('path');
const os = require('os');
const fs = require('fs');

// ───────────────────────────────────────────────────────────────
// CONFIGURATION
// ───────────────────────────────────────────────────────────────

const EMBEDDING_DIM = 768;
const MODEL_NAME = 'nomic-ai/nomic-embed-text-v1.5';

/**
 * Convert various embedding types to Buffer for sqlite-vec
 * Handles Float32Array, Buffer, plain arrays, and other TypedArrays
 * 
 * @param {Float32Array|Buffer|Array|TypedArray} embedding - Input embedding
 * @returns {Buffer|null} Buffer suitable for sqlite-vec, or null if invalid
 * @throws {Error} If embedding type is not recognized
 */
function toEmbeddingBuffer(embedding) {
  if (!embedding) return null;
  if (Buffer.isBuffer(embedding)) {
    return embedding;
  }
  if (embedding instanceof Float32Array) {
    return Buffer.from(embedding.buffer, embedding.byteOffset, embedding.byteLength);
  }
  if (Array.isArray(embedding)) {
    return Buffer.from(new Float32Array(embedding).buffer);
  }
  // If it has a buffer property (TypedArray) - handle byteOffset for views
  if (embedding.buffer && embedding.byteOffset !== undefined) {
    return Buffer.from(embedding.buffer, embedding.byteOffset, embedding.byteLength);
  }
  throw new Error('Invalid embedding type: expected Float32Array, Buffer, Array, or TypedArray');
}
// Project-local database - works for both Claude Code and Opencode
// V12.1: Support MEMORY_DB_PATH environment variable for custom database locations
// Default: {cwd}/.opencode/skill/system-memory/database/memory-index.sqlite
const DEFAULT_DB_PATH = process.env.MEMORY_DB_PATH || 
  path.join(process.cwd(), '.opencode', 'skill', 'system-memory', 'database', 'memory-index.sqlite');
const DB_PERMISSIONS = 0o600; // Owner read/write only

// ───────────────────────────────────────────────────────────────
// DATABASE SINGLETON
// ───────────────────────────────────────────────────────────────

let db = null;
let dbPath = DEFAULT_DB_PATH;
let sqliteVecAvailable = true; // Track if sqlite-vec is available (NFR-R01)
let shuttingDown = false;

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

  console.warn('[vector-index] Schema created successfully');
}

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

  // Check for existing entry
  const existing = database.prepare(`
    SELECT id FROM memory_index
    WHERE spec_folder = ? AND file_path = ? AND (anchor_id = ? OR (anchor_id IS NULL AND ? IS NULL))
  `).get(specFolder, filePath, anchorId, anchorId);

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
    const result = database.prepare(`
      INSERT INTO memory_index (
        spec_folder, file_path, anchor_id, title, trigger_phrases,
        importance_weight, created_at, updated_at, embedding_model,
        embedding_generated_at, embedding_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      specFolder, filePath, anchorId, title, triggersJson,
      importanceWeight, now, now, MODEL_NAME, now, embeddingStatus
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
    }
    if (embedding) {
      updates.push('embedding_model = ?');
      updates.push('embedding_generated_at = ?');
      updates.push('embedding_status = ?');
      values.push(MODEL_NAME, now, 'success');
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
 * Delete a memory entry (synchronized DELETE)
 *
 * @param {number} id - Row ID to delete
 * @returns {boolean} True if deleted
 */
function deleteMemory(id) {
  const database = initializeDb();

  const deleteMemoryTx = database.transaction(() => {
    // Delete from vec_memories first (only if sqlite-vec available)
    if (sqliteVecAvailable) {
      database.prepare('DELETE FROM vec_memories WHERE rowid = ?').run(BigInt(id));
    }

    // Delete from memory_index
    const result = database.prepare('DELETE FROM memory_index WHERE id = ?').run(id);

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

  const row = database.prepare('SELECT * FROM memory_index WHERE id = ?').get(id);

  if (row && row.trigger_phrases) {
    row.trigger_phrases = JSON.parse(row.trigger_phrases);
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
  const result = database.prepare('SELECT COUNT(*) as count FROM memory_index').get();
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
 * regardless of query, limited to ~500 tokens worth of content.
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
  // ─────────────────────────────────────────────────────────────────
  let constitutionalResults = [];

  // Only fetch constitutional if not filtering by constitutional tier specifically and includeConstitutional is true
  if (includeConstitutional && tier !== 'constitutional') {
    const constitutionalSql = `
      SELECT m.*, 100.0 as similarity, 1.0 as effective_importance,
             'constitutional' as source_type
      FROM memory_index m
      WHERE m.importance_tier = 'constitutional'
        AND m.embedding_status = 'success'
        ${specFolder ? 'AND m.spec_folder = ?' : ''}
      ORDER BY m.importance_weight DESC, m.created_at DESC
    `;

    const constitutionalParams = specFolder ? [specFolder] : [];
    constitutionalResults = database.prepare(constitutionalSql).all(...constitutionalParams);

    // Limit constitutional results to ~500 tokens (~2000 chars, ~5 memories avg)
    // LIMITATION: This uses a fixed estimate of ~100 tokens per memory.
    // For more accurate token counting, consider implementing dynamic calculation
    // based on actual content length (title + trigger_phrases). Current approach
    // prioritizes performance over precision - acceptable for constitutional tier
    // which typically has few, high-importance entries.
    const MAX_CONSTITUTIONAL_TOKENS = 500;
    const TOKENS_PER_MEMORY = 100; // Conservative fixed estimate (~4 chars/token)
    const maxConstitutionalCount = Math.floor(MAX_CONSTITUTIONAL_TOKENS / TOKENS_PER_MEMORY);
    constitutionalResults = constitutionalResults.slice(0, maxConstitutionalCount);

    // Mark as constitutional for client identification
    constitutionalResults = constitutionalResults.map(row => {
      if (row.trigger_phrases) {
        row.trigger_phrases = JSON.parse(row.trigger_phrases);
      }
      row.isConstitutional = true;
      return row;
    });
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
    row.isConstitutional = false;
    return row;
  });

  // Combine: constitutional first, then regular results
  return [...constitutionalResults, ...regularResults];
}

/**
 * Get all constitutional tier memories
 *
 * Returns constitutional memories without requiring a query embedding.
 * Useful for always-surfacing core rules regardless of search context.
 *
 * @param {Object} [options] - Options
 * @param {string} [options.specFolder] - Filter by spec folder
 * @param {number} [options.maxTokens=500] - Maximum tokens worth of results
 * @returns {Object[]} Constitutional memories sorted by importance
 */
function getConstitutionalMemories(options = {}) {
  const database = initializeDb();

  const { specFolder = null, maxTokens = 500 } = options;

  const sql = `
    SELECT m.*, 100.0 as similarity, 1.0 as effective_importance
    FROM memory_index m
    WHERE m.importance_tier = 'constitutional'
      AND m.embedding_status = 'success'
      ${specFolder ? 'AND m.spec_folder = ?' : ''}
    ORDER BY m.importance_weight DESC, m.created_at DESC
  `;

  const params = specFolder ? [specFolder] : [];
  let results = database.prepare(sql).all(...params);

  // Limit to token budget (~100 tokens per memory avg)
  const TOKENS_PER_MEMORY = 100;
  const maxCount = Math.floor(maxTokens / TOKENS_PER_MEMORY);
  results = results.slice(0, maxCount);

  return results.map(row => {
    if (row.trigger_phrases) {
      row.trigger_phrases = JSON.parse(row.trigger_phrases);
    }
    row.isConstitutional = true;
    return row;
  });
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
    return row;
  });
}

// ───────────────────────────────────────────────────────────────
// DATABASE UTILITIES
// ───────────────────────────────────────────────────────────────

/**
 * Close database connection safely
 */
function safeClose() {
  if (shuttingDown) return;
  shuttingDown = true;
  closeDb();
}

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
 * @returns {Object} Integrity check results
 */
function verifyIntegrity() {
  if (!sqliteVecAvailable) {
    return {
      isConsistent: false,
      error: 'Vector search unavailable - sqlite-vec extension not loaded',
      totalMemories: 0,
      memoriesWithEmbeddings: 0,
      orphanedVectors: 0,
      missingVectors: 0
    };
  }

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

  return {
    totalMemories,
    totalVectors,
    orphanedVectors,
    missingVectors,
    isConsistent: orphanedVectors === 0 && missingVectors === 0
  };
}

/**
 * Verify database integrity with file existence check
 * Checks that all indexed memory files actually exist on disk.
 *
 * @param {string} basePath - Base path for resolving relative file paths
 * @returns {Object} Detailed integrity report
 */
function verifyIntegrityWithPaths(basePath) {
  const database = initializeDb();
  const entries = database.prepare('SELECT * FROM memory_index').all();

  const orphaned = [];
  const valid = [];

  for (const entry of entries) {
    // Resolve relative path against base
    const fullPath = entry.file_path.startsWith('/')
      ? entry.file_path
      : path.join(basePath, entry.file_path);

    if (fs.existsSync(fullPath)) {
      valid.push(entry);
    } else {
      orphaned.push({
        id: entry.id,
        specFolder: entry.spec_folder,
        filePath: entry.file_path,
        resolvedPath: fullPath
      });
    }
  }

  return {
    total: entries.length,
    validCount: valid.length,
    orphanedCount: orphaned.length,
    orphanedEntries: orphaned,
    isConsistent: orphaned.length === 0
  };
}

/**
 * Remove orphaned entries (missing files) from database
 * Uses transaction for atomic deletion from both tables.
 *
 * @param {string} basePath - Base path for resolving relative file paths
 * @returns {Object} Cleanup results with before/after counts
 */
function cleanupOrphans(basePath) {
  const database = initializeDb();

  // First, get integrity report
  const report = verifyIntegrityWithPaths(basePath);

  if (report.orphanedCount === 0) {
    console.warn('[vector-index] No orphaned entries found');
    return { removed: 0, before: report.total, after: report.total, message: 'No orphaned entries found' };
  }

   console.error(`[vector-index] Found ${report.orphanedCount} orphaned entries, starting cleanup...`);

  // Cleanup in transaction
  const cleanupTx = database.transaction(() => {
    for (const orphan of report.orphanedEntries) {
      // Delete from vec_memories first (if sqlite-vec available)
      if (sqliteVecAvailable) {
        database.prepare('DELETE FROM vec_memories WHERE rowid = ?')
          .run(BigInt(orphan.id));
      }
      // Delete from memory_index
      database.prepare('DELETE FROM memory_index WHERE id = ?')
        .run(orphan.id);
    }
    return report.orphanedCount;
  });

  const removed = cleanupTx();

  console.error(`[vector-index] Cleanup complete: removed ${removed} orphaned entries`);
  console.error(`[vector-index] Database: ${report.total} -> ${report.total - removed} entries`);

  return {
    removed,
    before: report.total,
    after: report.total - removed,
    entries: report.orphanedEntries.map(e => e.specFolder)
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

/**
 * Check if FTS5 full-text search is available
 * @returns {boolean} True if FTS5 is available and memory_fts table exists
 */
function isFtsAvailable() {
  if (!db) return false;
  try {
    db.prepare("SELECT 1 FROM memory_fts LIMIT 1").get();
    return true;
  } catch (e) {
    if (e.message && e.message.includes('no such table')) {
      return false;
    }
    console.error('[vector-index] FTS check error:', e.message);
    return false;
  }
}

module.exports = {
  // Initialization
  initializeDb,
  closeDb,
  safeClose,
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
  verifyIntegrityWithPaths,
  cleanupOrphans,

  // Search
  vectorSearch,
  multiConceptSearch,
  getConstitutionalMemories,
  isVectorSearchAvailable,
  isFtsAvailable,

  // Constants
  EMBEDDING_DIM,
  DEFAULT_DB_PATH
};

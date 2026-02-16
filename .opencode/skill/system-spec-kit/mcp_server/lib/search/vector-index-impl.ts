// Vector Index Implementation - TypeScript type checking enabled
// ───────────────────────────────────────────────────────────────
// SEARCH: VECTOR INDEX — converted from JS
// Type checking enabled - catch blocks use `: any` annotation
//
// DECAY STRATEGY (ADR-004): Search-time temporal decay uses an
// FSRS-preferred strategy. Memories with FSRS review data (last_review
// IS NOT NULL, review_count > 0) use the FSRS v4 power-law formula:
//   R(t) = (1 + 0.2346 * t / S)^(-0.5)
// Memories without review data fall back to half-life exponential:
//   weight * 0.5^(days / half_life_days)
// This ensures backward compatibility while aligning reviewed
// memories with the canonical FSRS algorithm.
// ───────────────────────────────────────────────────────────────

import Database from 'better-sqlite3';
import * as sqliteVec from 'sqlite-vec';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';
import * as crypto from 'crypto';
import { formatAgeString as format_age_string } from '../utils/format-helpers';
import { validateFilePath } from '../utils/path-security';
import { createLogger } from '../utils/logger';
import { SERVER_DIR } from '../../core/config';
import { IVectorStore } from '../interfaces/vector-store';
import * as embeddingsProvider from '../providers/embeddings';

// MCP-safe logger — all output goes to stderr (stdout reserved for JSON-RPC)
const logger = createLogger('VectorIndex');

const search_weights_path = path.join(SERVER_DIR, 'configs', 'search-weights.json');
const search_weights: any = JSON.parse(fs.readFileSync(search_weights_path, 'utf-8'));
const MAX_TRIGGERS_PER_MEMORY = search_weights.maxTriggersPerMemory || 10;

function to_embedding_buffer(embedding: any) {
  if (embedding instanceof Float32Array) {
    return Buffer.from(embedding.buffer, embedding.byteOffset, embedding.byteLength);
  }
  if (Array.isArray(embedding)) {
    return Buffer.from(new Float32Array(embedding).buffer);
  }
  return Buffer.from(embedding.buffer, embedding.byteOffset, embedding.byteLength);
}

/* ─────────────────────────────────────────────────────────────
   1. CONFIGURATION
────────────────────────────────────────────────────────────────*/

const EMBEDDING_DIM = 768;

/**
 * Get embedding dimension from active profile.
 * T019: Updated to work with lazy provider pattern - uses environment
 * detection when provider not yet initialized.
 */
function get_embedding_dim() {
  try {
    const embeddings = embeddingsProvider;

    if (embeddings.isProviderInitialized && embeddings.isProviderInitialized()) {
      const profile = embeddings.getEmbeddingProfile();
      if (profile && profile.dim) {
        return profile.dim;
      }
    }

    if (process.env.VOYAGE_API_KEY || process.env.EMBEDDINGS_PROVIDER === 'voyage') {
      return 1024;
    }
    if (process.env.OPENAI_API_KEY || process.env.EMBEDDINGS_PROVIDER === 'openai') {
      return 1536;
    }
  } catch (e: any) {
    console.warn('[vector-index] Could not get embedding dimension from profile:', e.message);
  }
  return EMBEDDING_DIM;
}

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

/**
 * Validate that current embedding dimension matches stored dimension.
 * Detect dimension mismatch that could cause vector search failures.
 * Returns {valid: boolean, stored: number, current: number, warning?: string}
 */
function validate_embedding_dimension() {
  if (!db || !sqlite_vec_available) {
    return { valid: true, stored: null, current: null, reason: 'No database or sqlite-vec unavailable' };
  }

  try {
    // Check if vec_metadata table exists
    const meta_table = db.prepare(`
      SELECT name FROM sqlite_master WHERE type='table' AND name='vec_metadata'
    `).get();

    if (!meta_table) {
      // Legacy database without metadata - can't validate
      return { valid: true, stored: null, current: get_embedding_dim(), reason: 'No metadata table (legacy DB)' };
    }

    const stored_row = db.prepare(`
      SELECT value FROM vec_metadata WHERE key = 'embedding_dim'
    `).get();

    if (!stored_row) {
      return { valid: true, stored: null, current: get_embedding_dim(), reason: 'No stored dimension' };
    }

    const stored_dim = parseInt(stored_row.value, 10);
    const current_dim = get_embedding_dim();

    if (stored_dim !== current_dim) {
      const warning = `DIMENSION MISMATCH: Database has ${stored_dim}-dim vectors, but provider expects ${current_dim}. ` +
        `Vector search will fail. Solutions: 1) Delete database and re-index, 2) Set EMBEDDINGS_PROVIDER to match original, ` +
        `3) Use MEMORY_DB_PATH for provider-specific databases.`;
      console.error(`[vector-index] WARNING: ${warning}`);
      return { valid: false, stored: stored_dim, current: current_dim, warning };
    }

    return { valid: true, stored: stored_dim, current: current_dim };
  } catch (e: any) {
    console.warn('[vector-index] Dimension validation error:', e.message);
    return { valid: true, stored: null, current: get_embedding_dim(), reason: e.message };
  }
}

let schema_initialized = false;

// P1-05 FIX: Unified env var precedence — SPEC_KIT_DB_DIR (canonical) > MEMORY_DB_DIR (legacy)
const DEFAULT_DB_DIR = process.env.SPEC_KIT_DB_DIR ||
  process.env.MEMORY_DB_DIR ||
  path.resolve(__dirname, '../../database');
const DEFAULT_DB_PATH = process.env.MEMORY_DB_PATH || 
  path.join(DEFAULT_DB_DIR, 'context-index.sqlite');
const DB_PERMISSIONS = 0o600;

function resolve_database_path() {
  if (process.env.MEMORY_DB_PATH) {
    return process.env.MEMORY_DB_PATH;
  }

  const embeddings = embeddingsProvider;
  const profile = embeddings.getEmbeddingProfile();
  
  if (!profile || !('getDatabasePath' in profile)) {
    return DEFAULT_DB_PATH;
  }

  return (profile as { getDatabasePath: (dir: string) => string }).getDatabasePath(DEFAULT_DB_DIR);
}

// Schema version for migration tracking
// v5: Added memory_type column for type-specific half-lives (REQ-002)
// v6: Added file_mtime_ms for incremental indexing fast-path (REQ-023, T064-T066)
// v7: Added 'partial' embedding_status for deferred indexing (REQ-031, T096)
// v8: Added causal_edges table for Causal Memory Graph (REQ-012, T043-T047)
// v9: Added memory_corrections table for learning from corrections (REQ-015, REQ-026, T052-T055)
// v10: Schema consolidation and index optimization
// v11: Error code deduplication and validation improvements
// v12: Unified memory_conflicts DDL (KL-1 Schema Unification)
// v13: Add document_type and spec_level columns for full spec folder document indexing (Spec 126)
// v14: Add content_text column + FTS5 rebuild for BM25 full-text search across restarts
const SCHEMA_VERSION = 14;

/* ─────────────────────────────────────────────────────────────
   2. SECURITY HELPERS
────────────────────────────────────────────────────────────────*/

// P1-06 FIX: Unified allowed paths — includes specs, .opencode, homedir/.claude, cwd, and env overrides
const ALLOWED_BASE_PATHS = [
  path.join(process.cwd(), 'specs'),
  path.join(process.cwd(), '.opencode'),
  path.join(os.homedir(), '.claude'),
  process.cwd(),
  ...(process.env.MEMORY_ALLOWED_PATHS ? process.env.MEMORY_ALLOWED_PATHS.split(':') : [])
].filter(Boolean).map(p => path.resolve(p));

function validate_file_path_local(file_path: any) {
  return validateFilePath(file_path, ALLOWED_BASE_PATHS);
}

function safe_read_file(file_path: any) {
  const valid_path = validate_file_path_local(file_path);
  if (!valid_path) {
    return '';
  }

  try {
    if (fs.existsSync(valid_path)) {
      return fs.readFileSync(valid_path, 'utf-8');
    }
  } catch (err: any) {
    console.warn(`[vector-index] Could not read file ${valid_path}: ${err.message}`);
  }
  return '';
}

// HIGH-004 FIX: Async version for non-blocking concurrent file reads
async function safe_read_file_async(file_path: any) {
  const valid_path = validate_file_path_local(file_path);
  if (!valid_path) {
    return '';
  }

  try {
    return await fs.promises.readFile(valid_path, 'utf-8');
  } catch (err: any) {
    // ENOENT is expected for missing files, only warn on other errors
    if (err.code !== 'ENOENT') {
      console.warn(`[vector-index] Could not read file ${valid_path}: ${err.message}`);
    }
    return '';
  }
}

// Safely parse JSON with validation (CWE-502: Deserialization mitigation)
function safe_parse_json(json_string: any, default_value = []) {
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
  } catch (err: any) {
    console.warn(`[vector-index] JSON parse error: ${err.message}`);
    return default_value;
  }
}

/* ─────────────────────────────────────────────────────────────
   3. DATABASE SINGLETON
────────────────────────────────────────────────────────────────*/

let db: any = null;
let db_path = DEFAULT_DB_PATH;
let sqlite_vec_available = true;
let shutting_down = false;

let constitutional_cache = new Map();
const CONSTITUTIONAL_CACHE_TTL = 300000;

// BUG-012 FIX: Track which cache keys are currently being loaded
// This prevents thundering herd when multiple concurrent calls hit cache expiry
let constitutional_cache_loading = new Map();

let last_db_mod_time = 0;

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
  } catch (e: any) {
    console.warn('[vector-index] Cache validation error:', e instanceof Error ? e.message : String(e));
  }

  return true;
}

/* ─────────────────────────────────────────────────────────────
   4. PREPARED STATEMENT CACHING
────────────────────────────────────────────────────────────────*/

let prepared_statements: any = null;

function init_prepared_statements(database: any) {
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

function clear_prepared_statements() {
  prepared_statements = null;
}

// BUG-004 FIX: Checks external DB modifications before using cache
// BUG-012 FIX: Prevent thundering herd when cache expires
function get_constitutional_memories(database: any, spec_folder = null, includeArchived = false) {
  const cache_key = spec_folder || 'global';
  const now = Date.now();
  const cached = constitutional_cache.get(cache_key);

  if (cached && (now - cached.timestamp) < CONSTITUTIONAL_CACHE_TTL && is_constitutional_cache_valid()) {
    return cached.data;
  }

  if (constitutional_cache_loading.get(cache_key)) {
    return cached?.data || [];
  }

  constitutional_cache_loading.set(cache_key, true);

  try {
    const constitutional_sql = `
      SELECT m.*, 100.0 as similarity, 1.0 as effective_importance,
             'constitutional' as source_type
      FROM memory_index m
      WHERE m.importance_tier = 'constitutional'
        AND m.embedding_status = 'success'
        ${!includeArchived ? 'AND (m.is_archived IS NULL OR m.is_archived = 0)' : ''}
        ${spec_folder ? 'AND m.spec_folder = ?' : ''}
      ORDER BY m.importance_weight DESC, m.created_at DESC
    `;

    const params = spec_folder ? [spec_folder] : [];
    let results = database.prepare(constitutional_sql).all(...params);

    const MAX_CONSTITUTIONAL_TOKENS = 2000;
    const TOKENS_PER_MEMORY = 100;
    const max_constitutional_count = Math.floor(MAX_CONSTITUTIONAL_TOKENS / TOKENS_PER_MEMORY);
    results = results.slice(0, max_constitutional_count);

    results = results.map((row: any) => {
      if (row.trigger_phrases) {
        row.trigger_phrases = JSON.parse(row.trigger_phrases);
      }
      row.isConstitutional = true;
      return row;
    });

    constitutional_cache.set(cache_key, { data: results, timestamp: now });

    return results;
  } finally {
    constitutional_cache_loading.delete(cache_key);
  }
}

function clear_constitutional_cache(spec_folder = null) {
  if (spec_folder) {
    constitutional_cache.delete(spec_folder);
  } else {
    constitutional_cache.clear();
  }
}

/* ─────────────────────────────────────────────────────────────
   5. SCHEMA VERSION TRACKING
────────────────────────────────────────────────────────────────*/

// Run schema migrations from one version to another
// Each migration is idempotent - safe to run multiple times
// BUG-019 FIX: Wrap migrations in transaction for atomicity
function run_migrations(database: any, from_version: any, to_version: any) {
  const migrations = {
    1: () => {
      // v0 -> v1: Initial schema (already exists via create_schema)
    },
    2: () => {
      // v1 -> v2: Add idx_history_timestamp index
      try {
        database.exec('CREATE INDEX IF NOT EXISTS idx_history_timestamp ON memory_history(timestamp DESC)');
        logger.info('Migration v2: Created idx_history_timestamp index');
      } catch (e: any) {
        if (!e.message.includes('already exists')) {
          console.warn('[VectorIndex] Migration v2 warning:', e.message);
        }
      }
    },
    3: () => {
      // v2 -> v3: Add related_memories column
      try {
        database.exec('ALTER TABLE memory_index ADD COLUMN related_memories TEXT');
        logger.info('Migration v3: Added related_memories column');
      } catch (e: any) {
        if (!e.message.includes('duplicate column')) {
          console.warn('[VectorIndex] Migration v3 warning:', e.message);
        }
      }
    },
    4: () => {
      // v3 -> v4: Add FSRS (Free Spaced Repetition Scheduler) columns for cognitive memory
      // These columns enable spaced repetition-based memory retrieval prioritization
      const fsrs_columns = [
        { name: 'stability', sql: 'ALTER TABLE memory_index ADD COLUMN stability REAL DEFAULT 1.0' },
        { name: 'difficulty', sql: 'ALTER TABLE memory_index ADD COLUMN difficulty REAL DEFAULT 5.0' },
        { name: 'last_review', sql: 'ALTER TABLE memory_index ADD COLUMN last_review TEXT' },
        { name: 'review_count', sql: 'ALTER TABLE memory_index ADD COLUMN review_count INTEGER DEFAULT 0' }
      ];

      for (const col of fsrs_columns) {
        try {
          database.exec(col.sql);
          logger.info(`Migration v4: Added ${col.name} column (FSRS)`);
        } catch (e: any) {
          if (!e.message.includes('duplicate column')) {
            console.warn(`[VectorIndex] Migration v4 warning (${col.name}):`, e.message);
          }
        }
      }

      // Create memory_conflicts table for prediction error gating audit
      try {
        database.exec(`
          CREATE TABLE IF NOT EXISTS memory_conflicts (
            id INTEGER PRIMARY KEY,
            timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
            new_memory_hash TEXT NOT NULL,
            existing_memory_id INTEGER,
            similarity_score REAL,
            action TEXT CHECK(action IN ('CREATE', 'CREATE_LINKED', 'UPDATE', 'SUPERSEDE', 'REINFORCE')),
            contradiction_detected INTEGER DEFAULT 0,
            notes TEXT,
            FOREIGN KEY (existing_memory_id) REFERENCES memory_index(id) ON DELETE SET NULL
          )
        `);
        logger.info('Migration v4: Created memory_conflicts table');
      } catch (e: any) {
        if (!e.message.includes('already exists')) {
          console.warn('[VectorIndex] Migration v4 warning (memory_conflicts):', e.message);
        }
      }

      // Create indexes for FSRS columns
      try {
        database.exec('CREATE INDEX IF NOT EXISTS idx_stability ON memory_index(stability DESC)');
        database.exec('CREATE INDEX IF NOT EXISTS idx_last_review ON memory_index(last_review)');
        database.exec('CREATE INDEX IF NOT EXISTS idx_fsrs_retrieval ON memory_index(stability, difficulty, last_review)');
        logger.info('Migration v4: Created FSRS indexes');
      } catch (e: any) {
        console.warn('[VectorIndex] Migration v4 warning (indexes):', e.message);
      }
    },
    5: () => {
      // v4 -> v5: Add memory_type column for type-specific half-lives (REQ-002, T006)
      // This enables 9 cognitive memory types with distinct decay rates
      // Types: working, episodic, prospective, implicit, declarative, procedural,
      //        semantic, autobiographical, meta-cognitive
      try {
        database.exec(`
          ALTER TABLE memory_index ADD COLUMN memory_type TEXT DEFAULT 'declarative'
            CHECK(memory_type IN (
              'working', 'episodic', 'prospective', 'implicit', 'declarative',
              'procedural', 'semantic', 'autobiographical', 'meta-cognitive'
            ))
        `);
        logger.info('Migration v5: Added memory_type column');
      } catch (e: any) {
        if (!e.message.includes('duplicate column')) {
          console.warn('[VectorIndex] Migration v5 warning (memory_type):', e.message);
        }
      }

      // Add half_life_days column to override type defaults
      try {
        database.exec('ALTER TABLE memory_index ADD COLUMN half_life_days REAL');
        logger.info('Migration v5: Added half_life_days column');
      } catch (e: any) {
        if (!e.message.includes('duplicate column')) {
          console.warn('[VectorIndex] Migration v5 warning (half_life_days):', e.message);
        }
      }

      // Add type_inference_source to track how type was determined
      try {
        database.exec(`
          ALTER TABLE memory_index ADD COLUMN type_inference_source TEXT DEFAULT 'default'
            CHECK(type_inference_source IN (
              'frontmatter_explicit', 'importance_tier', 'file_path', 'keywords', 'default', 'manual'
            ))
        `);
        logger.info('Migration v5: Added type_inference_source column');
      } catch (e: any) {
        if (!e.message.includes('duplicate column')) {
          console.warn('[VectorIndex] Migration v5 warning (type_inference_source):', e.message);
        }
      }

      // Create index for memory_type queries
      try {
        database.exec('CREATE INDEX IF NOT EXISTS idx_memory_type ON memory_index(memory_type)');
        database.exec('CREATE INDEX IF NOT EXISTS idx_memory_type_decay ON memory_index(memory_type, half_life_days)');
        logger.info('Migration v5: Created memory_type indexes');
      } catch (e: any) {
        console.warn('[VectorIndex] Migration v5 warning (indexes):', e.message);
      }

      // Backfill existing memories with inferred types
      // This is done in a separate pass to avoid blocking the migration
      logger.info('Migration v5: Type inference backfill will run on next index scan');
    },
    6: () => {
      // v5 -> v6: Add file_mtime_ms for incremental indexing (REQ-023, T064-T066)
      // This enables 10-100x faster re-indexing by skipping unchanged files
      // via mtime fast-path check before expensive content hash computation
      try {
        database.exec('ALTER TABLE memory_index ADD COLUMN file_mtime_ms INTEGER');
        logger.info('Migration v6: Added file_mtime_ms column for incremental indexing');
      } catch (e: any) {
        if (!e.message.includes('duplicate column')) {
          console.warn('[VectorIndex] Migration v6 warning (file_mtime_ms):', e.message);
        }
      }

      // Create index for fast mtime lookups
      try {
        database.exec('CREATE INDEX IF NOT EXISTS idx_file_mtime ON memory_index(file_mtime_ms)');
        logger.info('Migration v6: Created file_mtime index');
      } catch (e: any) {
        console.warn('[VectorIndex] Migration v6 warning (idx_file_mtime):', e.message);
      }
    },
    7: () => {
      // v6 -> v7: Add 'partial' embedding_status for deferred indexing (REQ-031, T096)
      // 'partial' status indicates some chunks were embedded, some are pending
      // This enables graceful degradation when embedding fails mid-document
      //
      // Note: SQLite CHECK constraints cannot be modified in-place.
      // The 'partial' value is now accepted by application logic; existing CHECK
      // constraint will reject strict validation but application handles it.
      //
      // For new databases, the CHECK is updated in create_schema().
      // For existing databases, we add an index for efficient pending/partial queries.
      try {
        database.exec(`
          CREATE INDEX IF NOT EXISTS idx_embedding_pending
          ON memory_index(embedding_status)
          WHERE embedding_status IN ('pending', 'partial', 'retry')
        `);
        logger.info('Migration v7: Created idx_embedding_pending partial index');
      } catch (e: any) {
        console.warn('[VectorIndex] Migration v7 warning (idx_embedding_pending):', e.message);
      }

      // Add index for BM25/FTS5 fallback search on pending memories (CHK-178)
      try {
        database.exec(`
          CREATE INDEX IF NOT EXISTS idx_fts_fallback
          ON memory_index(spec_folder, embedding_status, importance_tier)
          WHERE embedding_status IN ('pending', 'partial')
        `);
        logger.info('Migration v7: Created idx_fts_fallback index for deferred indexing');
      } catch (e: any) {
        console.warn('[VectorIndex] Migration v7 warning (idx_fts_fallback):', e.message);
      }
    },
    8: () => {
      // v7 -> v8: Create causal_edges table for Causal Memory Graph (REQ-012, T043-T047)
      // This enables decision lineage tracking and "why" queries
      // 6 relationship types: caused, enabled, supersedes, contradicts, derived_from, supports
      // CHK-060: Create table with proper schema
      // CHK-061: 6 relationship types via CHECK constraint
      // CHK-062: Indexes on source_id and target_id for bidirectional traversal
      try {
        database.exec(`
          CREATE TABLE IF NOT EXISTS causal_edges (
            id INTEGER PRIMARY KEY,
            source_id TEXT NOT NULL,
            target_id TEXT NOT NULL,
            relation TEXT NOT NULL CHECK(relation IN (
              'caused', 'enabled', 'supersedes', 'contradicts', 'derived_from', 'supports'
            )),
            strength REAL DEFAULT 1.0 CHECK(strength >= 0.0 AND strength <= 1.0),
            evidence TEXT,
            extracted_at TEXT DEFAULT (datetime('now')),
            UNIQUE(source_id, target_id, relation)
          )
        `);
        logger.info('Migration v8: Created causal_edges table');
      } catch (e: any) {
        if (!e.message.includes('already exists')) {
          console.warn('[VectorIndex] Migration v8 warning (causal_edges):', e.message);
        }
      }

      // Create indexes for efficient graph traversal (CHK-062)
      try {
        database.exec('CREATE INDEX IF NOT EXISTS idx_causal_source ON causal_edges(source_id)');
        database.exec('CREATE INDEX IF NOT EXISTS idx_causal_target ON causal_edges(target_id)');
        database.exec('CREATE INDEX IF NOT EXISTS idx_causal_relation ON causal_edges(relation)');
        database.exec('CREATE INDEX IF NOT EXISTS idx_causal_strength ON causal_edges(strength DESC)');
        logger.info('Migration v8: Created causal_edges indexes');
      } catch (e: any) {
        console.warn('[VectorIndex] Migration v8 warning (indexes):', e.message);
      }
    },
    9: () => {
      // v8 -> v9: Create memory_corrections table for Learning from Corrections (REQ-015, REQ-026, T052-T055)
      // This enables tracking of memory corrections with stability penalty/boost
      // CHK-066: memory_corrections table tracks original vs correction
      // CHK-067: 0.5x stability penalty applied to corrected memories
      // CHK-068: Correction types: superseded, deprecated, refined, merged
      // CHK-069: Feature flag SPECKIT_RELATIONS controls activation
      // CHK-070: Undo capability for learning reversals via is_undone flag
      try {
        database.exec(`
          CREATE TABLE IF NOT EXISTS memory_corrections (
            id INTEGER PRIMARY KEY AUTOINCREMENT,

            -- Original memory that was corrected
            original_memory_id INTEGER NOT NULL,

            -- Replacement/correction memory (null for deprecated)
            correction_memory_id INTEGER,

            -- Type of correction: superseded, deprecated, refined, merged
            correction_type TEXT NOT NULL CHECK(correction_type IN (
              'superseded', 'deprecated', 'refined', 'merged'
            )),

            -- Stability values at time of correction (for undo)
            original_stability_before REAL,
            original_stability_after REAL,
            correction_stability_before REAL,
            correction_stability_after REAL,

            -- Metadata
            reason TEXT,
            corrected_by TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,

            -- Undo tracking (CHK-070)
            is_undone INTEGER DEFAULT 0,
            undone_at TEXT,

            -- Foreign keys
            FOREIGN KEY (original_memory_id) REFERENCES memory_index(id) ON DELETE CASCADE,
            FOREIGN KEY (correction_memory_id) REFERENCES memory_index(id) ON DELETE SET NULL
          )
        `);
        logger.info('Migration v9: Created memory_corrections table');
      } catch (e: any) {
        if (!e.message.includes('already exists')) {
          console.warn('[VectorIndex] Migration v9 warning (memory_corrections):', e.message);
        }
      }

      // Create indexes for efficient correction lookups
      try {
        database.exec('CREATE INDEX IF NOT EXISTS idx_corrections_original ON memory_corrections(original_memory_id)');
        database.exec('CREATE INDEX IF NOT EXISTS idx_corrections_correction ON memory_corrections(correction_memory_id)');
        database.exec('CREATE INDEX IF NOT EXISTS idx_corrections_type ON memory_corrections(correction_type)');
        database.exec('CREATE INDEX IF NOT EXISTS idx_corrections_created ON memory_corrections(created_at DESC)');
        // Partial index for active (non-undone) corrections
        database.exec('CREATE INDEX IF NOT EXISTS idx_corrections_active ON memory_corrections(original_memory_id, is_undone) WHERE is_undone = 0');
        logger.info('Migration v9: Created memory_corrections indexes');
      } catch (e: any) {
        console.warn('[VectorIndex] Migration v9 warning (indexes):', e.message);
      }
    },
    12: () => {
      // v11 -> v12: Unify memory_conflicts DDL (KL-1 Schema Unification)
      // Three conflicting DDL definitions existed; this migration drops and recreates
      // with the canonical unified schema that all INSERT statements will target.
      try {
        database.exec(`
          DROP TABLE IF EXISTS memory_conflicts;
          CREATE TABLE IF NOT EXISTS memory_conflicts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
            action TEXT CHECK(action IN ('CREATE', 'CREATE_LINKED', 'UPDATE', 'SUPERSEDE', 'REINFORCE')),
            new_memory_hash TEXT,
            new_memory_id INTEGER,
            existing_memory_id INTEGER,
            similarity REAL,
            reason TEXT,
            new_content_preview TEXT,
            existing_content_preview TEXT,
            contradiction_detected INTEGER DEFAULT 0,
            contradiction_type TEXT,
            spec_folder TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (existing_memory_id) REFERENCES memory_index(id) ON DELETE SET NULL
          )
        `);
        logger.info('Migration v12: Unified memory_conflicts table (KL-1)');
      } catch (e: any) {
        console.warn('[VectorIndex] Migration v12 warning (memory_conflicts):', e.message);
      }

      // Recreate indexes for the unified table
      try {
        database.exec('CREATE INDEX IF NOT EXISTS idx_conflicts_memory ON memory_conflicts(existing_memory_id)');
        database.exec('CREATE INDEX IF NOT EXISTS idx_conflicts_timestamp ON memory_conflicts(timestamp DESC)');
        logger.info('Migration v12: Created memory_conflicts indexes');
      } catch (e: any) {
        console.warn('[VectorIndex] Migration v12 warning (indexes):', e.message);
      }
    },
    13: () => {
      // v12 -> v13: Add document_type and spec_level for full spec folder document indexing (Spec 126)
      // document_type: structural role in spec lifecycle (spec, plan, tasks, etc.)
      // spec_level: spec documentation level (1, 2, 3, 4 for 3+)
      try {
        database.exec("ALTER TABLE memory_index ADD COLUMN document_type TEXT DEFAULT 'memory'");
        logger.info('Migration v13: Added document_type column');
      } catch (e: any) {
        if (!e.message.includes('duplicate column')) {
          console.warn('[VectorIndex] Migration v13 warning (document_type):', e.message);
        }
      }

      try {
        database.exec('ALTER TABLE memory_index ADD COLUMN spec_level INTEGER');
        logger.info('Migration v13: Added spec_level column');
      } catch (e: any) {
        if (!e.message.includes('duplicate column')) {
          console.warn('[VectorIndex] Migration v13 warning (spec_level):', e.message);
        }
      }

      // Create indexes for efficient document type queries
      try {
        database.exec('CREATE INDEX IF NOT EXISTS idx_document_type ON memory_index(document_type)');
        database.exec('CREATE INDEX IF NOT EXISTS idx_doc_type_folder ON memory_index(document_type, spec_folder)');
        logger.info('Migration v13: Created document_type indexes');
      } catch (e: any) {
        console.warn('[VectorIndex] Migration v13 warning (indexes):', e.message);
      }

      // Backfill existing rows: constitutional files -> 'constitutional', readme files -> 'readme'
      try {
        database.exec(`
          UPDATE memory_index SET document_type = 'constitutional'
          WHERE document_type = 'memory'
            AND importance_tier = 'constitutional'
        `);
        database.exec(`
          UPDATE memory_index SET document_type = 'readme'
          WHERE document_type = 'memory'
            AND (
              LOWER(file_path) LIKE '%readme.md'
              OR LOWER(file_path) LIKE '%readme.txt'
            )
        `);
        logger.info('Migration v13: Backfilled document_type for constitutional and readme files');
      } catch (e: any) {
        console.warn('[VectorIndex] Migration v13 warning (backfill):', e.message);
      }
    },

    // ── Migration v14: Add content_text column for BM25 full-text search ──
    14: () => {
      // 1. Add content_text column to memory_index
      try {
        database.exec('ALTER TABLE memory_index ADD COLUMN content_text TEXT');
        logger.info('Migration v14: Added content_text column');
      } catch (e: any) {
        if (!e.message.includes('duplicate column')) {
          console.warn('[VectorIndex] Migration v14 warning (content_text):', e.message);
        }
      }

      // 2. Rebuild FTS5 with content_text included
      try {
        // Drop existing triggers
        database.exec('DROP TRIGGER IF EXISTS memory_fts_insert');
        database.exec('DROP TRIGGER IF EXISTS memory_fts_update');
        database.exec('DROP TRIGGER IF EXISTS memory_fts_delete');

        // Drop and recreate FTS5 table with content_text
        database.exec('DROP TABLE IF EXISTS memory_fts');
        database.exec(`
          CREATE VIRTUAL TABLE memory_fts USING fts5(
            title, trigger_phrases, file_path, content_text,
            content='memory_index', content_rowid='id'
          )
        `);

        // Recreate triggers including content_text
        database.exec(`
          CREATE TRIGGER memory_fts_insert AFTER INSERT ON memory_index BEGIN
            INSERT INTO memory_fts(rowid, title, trigger_phrases, file_path, content_text)
            VALUES (new.id, new.title, new.trigger_phrases, new.file_path, new.content_text);
          END
        `);
        database.exec(`
          CREATE TRIGGER memory_fts_update AFTER UPDATE ON memory_index BEGIN
            INSERT INTO memory_fts(memory_fts, rowid, title, trigger_phrases, file_path, content_text)
            VALUES ('delete', old.id, old.title, old.trigger_phrases, old.file_path, old.content_text);
            INSERT INTO memory_fts(rowid, title, trigger_phrases, file_path, content_text)
            VALUES (new.id, new.title, new.trigger_phrases, new.file_path, new.content_text);
          END
        `);
        database.exec(`
          CREATE TRIGGER memory_fts_delete AFTER DELETE ON memory_index BEGIN
            INSERT INTO memory_fts(memory_fts, rowid, title, trigger_phrases, file_path, content_text)
            VALUES ('delete', old.id, old.title, old.trigger_phrases, old.file_path, old.content_text);
          END
        `);
        logger.info('Migration v14: Rebuilt FTS5 table with content_text');
      } catch (e: any) {
        console.warn('[VectorIndex] Migration v14 warning (FTS5 rebuild):', e.message);
      }

      // 3. Backfill existing rows from disk
      try {
        const rows = database.prepare(
          'SELECT id, file_path FROM memory_index WHERE content_text IS NULL'
        ).all() as Array<{ id: number; file_path: string }>;

        let backfilled = 0;
        const updateStmt = database.prepare(
          'UPDATE memory_index SET content_text = ? WHERE id = ?'
        );

        for (const row of rows) {
          try {
            if (row.file_path && fs.existsSync(row.file_path)) {
              const content = fs.readFileSync(row.file_path, 'utf-8');
              updateStmt.run(content, row.id);
              backfilled++;
            }
          } catch (_: any) {
            // Skip files that can't be read
          }
        }

        // Rebuild FTS5 index after backfill
        if (backfilled > 0) {
          database.exec("INSERT INTO memory_fts(memory_fts) VALUES('rebuild')");
        }

        logger.info(`Migration v14: Backfilled content_text for ${backfilled}/${rows.length} rows`);
      } catch (e: any) {
        console.warn('[VectorIndex] Migration v14 warning (backfill):', e.message);
      }
    }
  };

  // BUG-019 FIX: Wrap all migrations in a transaction for atomicity
  // If any migration fails, all changes are rolled back preventing partial schema corruption
  const run_all_migrations = database.transaction(() => {
    for (let v = from_version + 1; v <= to_version; v++) {
      if ((migrations as any)[v]) {
        logger.info(`Running migration v${v}`);
        (migrations as any)[v]();
      }
    }
  });

  try {
    run_all_migrations();
  } catch (err: any) {
    console.error('[VectorIndex] Migration failed, rolled back:', err.message);
    throw err;
  }
}

// Ensure schema version table exists and run any pending migrations
function ensure_schema_version(database: any) {
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
    logger.info(`Migrating schema from v${current_version} to v${SCHEMA_VERSION}`);
    run_migrations(database, current_version, SCHEMA_VERSION);

    database.prepare(`
      INSERT OR REPLACE INTO schema_version (id, version, updated_at)
      VALUES (1, ?, datetime('now'))
    `).run(SCHEMA_VERSION);
    
    logger.info(`Schema migration complete: v${SCHEMA_VERSION}`);
  }

  return current_version;
}

// Initialize or get database connection. Creates schema on first use.
function initialize_db(custom_path = null) {
  if (db && !custom_path) {
    return db;
  }

  const target_path = custom_path || resolve_database_path();

  const dir = path.dirname(target_path);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
  }

  try {
    db = new Database(target_path);
  } catch (db_error: any) {
    const errMsg = db_error instanceof Error ? db_error.message : String(db_error);
    const errCode = db_error?.code;
    if (errCode === 'ERR_DLOPEN_FAILED' || errMsg.includes('NODE_MODULE_VERSION') || errMsg.includes('was compiled against a different Node.js version')) {
      console.error('[vector-index] FATAL: better-sqlite3 native module failed to load');
      console.error(`[vector-index] ${errMsg}`);
      console.error(`[vector-index] Running: Node ${process.version} (MODULE_VERSION ${process.versions.modules})`);
      try {
        const marker_path = path.resolve(__dirname, '../../../.node-version-marker');
        if (fs.existsSync(marker_path)) {
          const marker = JSON.parse(fs.readFileSync(marker_path, 'utf8'));
          console.error(`[vector-index] Marker recorded: Node ${marker.nodeVersion} (MODULE_VERSION ${marker.moduleVersion})`);
        }
      } catch (_: any) { /* ignore marker read errors */ }
      console.error('[vector-index] This usually means Node.js was updated without rebuilding native modules.');
      console.error('[vector-index] Fix: Run \'bash scripts/setup/rebuild-native-modules.sh\' from the spec-kit root');
      console.error('[vector-index] Or manually: npm rebuild better-sqlite3');
    }
    throw db_error;
  }

  try {
    sqliteVec.load(db);
    sqlite_vec_available = true;
  } catch (vec_error: any) {
    sqlite_vec_available = false;
    console.warn(`[vector-index] sqlite-vec extension not available: ${vec_error.message}`);
    console.warn('[vector-index] Falling back to anchor-only mode (no vector search)');
    console.warn('[vector-index] Install sqlite-vec: brew install sqlite-vec (macOS)');
  }

  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  db.pragma('cache_size = -64000');
  db.pragma('mmap_size = 268435456');
  db.pragma('synchronous = NORMAL');
  db.pragma('temp_store = MEMORY');

  create_schema(db);
  ensure_schema_version(db);

  if (!custom_path) {
    try {
      fs.chmodSync(target_path, DB_PERMISSIONS);
    } catch (err: any) {
      console.warn(`[vector-index] Could not set permissions on ${target_path}: ${err.message}`);
    }
  }

  db_path = target_path;
  return db;
}

function migrate_confidence_columns(database: any) {
  const columns = database.prepare(`PRAGMA table_info(memory_index)`).all();
  const column_names = columns.map((c: any) => c.name);

  if (!column_names.includes('confidence')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN confidence REAL DEFAULT 0.5`);
      console.warn('[vector-index] Migration: Added confidence column');
    } catch (e: any) {
      if (!e.message.includes('duplicate column')) throw e;
    }
  }

  if (!column_names.includes('validation_count')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN validation_count INTEGER DEFAULT 0`);
      console.warn('[vector-index] Migration: Added validation_count column');
    } catch (e: any) {
      if (!e.message.includes('duplicate column')) throw e;
    }
  }

  if (!column_names.includes('importance_tier')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN importance_tier TEXT DEFAULT 'normal'`);
      console.warn('[vector-index] Migration: Added importance_tier column');
    } catch (e: any) {
      if (!e.message.includes('duplicate column')) throw e;
    }
    try {
      database.exec(`CREATE INDEX IF NOT EXISTS idx_importance_tier ON memory_index(importance_tier)`);
      console.warn('[vector-index] Migration: Created idx_importance_tier index');
    } catch (e: any) {
    }
  }

  if (!column_names.includes('context_type')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN context_type TEXT DEFAULT 'general'`);
      console.warn('[vector-index] Migration: Added context_type column');
    } catch (e: any) {
      if (!e.message.includes('duplicate column')) throw e;
    }
  }

  if (!column_names.includes('content_hash')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN content_hash TEXT`);
      console.warn('[vector-index] Migration: Added content_hash column');
    } catch (e: any) {
      if (!e.message.includes('duplicate column')) throw e;
    }
  }

  if (!column_names.includes('channel')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN channel TEXT DEFAULT 'default'`);
      console.warn('[vector-index] Migration: Added channel column');
    } catch (e: any) {
      if (!e.message.includes('duplicate column')) throw e;
    }
  }

  if (!column_names.includes('session_id')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN session_id TEXT`);
      console.warn('[vector-index] Migration: Added session_id column');
    } catch (e: any) {
      if (!e.message.includes('duplicate column')) throw e;
    }
  }

  if (!column_names.includes('base_importance')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN base_importance REAL DEFAULT 0.5`);
      console.warn('[vector-index] Migration: Added base_importance column');
    } catch (e: any) {
      if (!e.message.includes('duplicate column')) throw e;
    }
  }

  if (!column_names.includes('decay_half_life_days')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN decay_half_life_days REAL DEFAULT 90.0`);
      console.warn('[vector-index] Migration: Added decay_half_life_days column');
    } catch (e: any) {
      if (!e.message.includes('duplicate column')) throw e;
    }
  }

  if (!column_names.includes('is_pinned')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN is_pinned INTEGER DEFAULT 0`);
      console.warn('[vector-index] Migration: Added is_pinned column');
    } catch (e: any) {
      if (!e.message.includes('duplicate column')) throw e;
    }
  }

  if (!column_names.includes('last_accessed')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN last_accessed INTEGER DEFAULT 0`);
      console.warn('[vector-index] Migration: Added last_accessed column');
    } catch (e: any) {
      if (!e.message.includes('duplicate column')) throw e;
    }
  }

  if (!column_names.includes('expires_at')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN expires_at DATETIME`);
      console.warn('[vector-index] Migration: Added expires_at column');
    } catch (e: any) {
      if (!e.message.includes('duplicate column')) throw e;
    }
  }

  if (!column_names.includes('related_memories')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN related_memories TEXT`);
      console.warn('[vector-index] Migration: Added related_memories column');
    } catch (e: any) {
      if (!e.message.includes('duplicate column')) throw e;
    }
  }

  if (!column_names.includes('stability')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN stability REAL DEFAULT 1.0`);
      console.warn('[vector-index] Migration: Added stability column (FSRS)');
    } catch (e: any) {
      if (!e.message.includes('duplicate column')) throw e;
    }
  }

  if (!column_names.includes('difficulty')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN difficulty REAL DEFAULT 5.0`);
      console.warn('[vector-index] Migration: Added difficulty column (FSRS)');
    } catch (e: any) {
      if (!e.message.includes('duplicate column')) throw e;
    }
  }

  if (!column_names.includes('last_review')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN last_review TEXT`);
      console.warn('[vector-index] Migration: Added last_review column (FSRS)');
    } catch (e: any) {
      if (!e.message.includes('duplicate column')) throw e;
    }
  }

  if (!column_names.includes('review_count')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN review_count INTEGER DEFAULT 0`);
      console.warn('[vector-index] Migration: Added review_count column (FSRS)');
    } catch (e: any) {
      if (!e.message.includes('duplicate column')) throw e;
    }
  }
}

// Migrate existing database to support constitutional tier
function migrate_constitutional_tier(database: any) {
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
function create_common_indexes(database: any) {
  try {
    database.exec(`CREATE INDEX IF NOT EXISTS idx_file_path ON memory_index(file_path)`);
    logger.info('Created idx_file_path index');
  } catch (err: any) {
    // Index may already exist
  }

  try {
    database.exec(`CREATE INDEX IF NOT EXISTS idx_content_hash ON memory_index(content_hash)`);
    logger.info('Created idx_content_hash index');
  } catch (err: any) {
    // Index may already exist
  }

  try {
    database.exec(`CREATE INDEX IF NOT EXISTS idx_last_accessed ON memory_index(last_accessed DESC)`);
    logger.info('Created idx_last_accessed index');
  } catch (err: any) {
    // Index may already exist
  }

  try {
    database.exec(`CREATE INDEX IF NOT EXISTS idx_importance_tier ON memory_index(importance_tier)`);
    logger.info('Created idx_importance_tier index');
  } catch (err: any) {
    // Index may already exist
  }

  // H5 FIX: Add idx_history_timestamp index for memory_history table
  try {
    database.exec(`CREATE INDEX IF NOT EXISTS idx_history_timestamp ON memory_history(timestamp DESC)`);
    logger.info('Created idx_history_timestamp index');
  } catch (err: any) {
    if (!err.message.includes('already exists')) {
      console.warn('[vector-index] Failed to create idx_history_timestamp:', err.message);
    }
  }
}

// Create database schema
function create_schema(database: any) {
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
      embedding_status TEXT DEFAULT 'pending' CHECK(embedding_status IN ('pending', 'success', 'failed', 'retry', 'partial')),
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
      -- FSRS (Free Spaced Repetition Scheduler) columns for cognitive memory
      stability REAL DEFAULT 1.0,
      difficulty REAL DEFAULT 5.0,
      last_review TEXT,
      review_count INTEGER DEFAULT 0,
      file_mtime_ms INTEGER,
      is_archived INTEGER DEFAULT 0,
      document_type TEXT DEFAULT 'memory',
      spec_level INTEGER,
      content_text TEXT,
      UNIQUE(spec_folder, file_path, anchor_id)
    )
  `);

  // Create vec_memories virtual table (only if sqlite-vec is available)
  // Store embedding dimension at creation time for validation
  if (sqlite_vec_available) {
    const embedding_dim = get_embedding_dim();
    database.exec(`
      CREATE VIRTUAL TABLE vec_memories USING vec0(
        embedding FLOAT[${embedding_dim}]
      )
    `);
    // Store the dimension used to create the table for later validation
    database.exec(`
      CREATE TABLE IF NOT EXISTS vec_metadata (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        created_at TEXT DEFAULT (datetime('now'))
      )
    `);
    database.prepare(`
      INSERT OR REPLACE INTO vec_metadata (key, value) VALUES ('embedding_dim', ?)
    `).run(String(embedding_dim));
    logger.info(`Created vec_memories table with dimension ${embedding_dim}`);
  }

  // Create FTS5 virtual table (includes content_text for full-text search)
  database.exec(`
    CREATE VIRTUAL TABLE IF NOT EXISTS memory_fts USING fts5(
      title, trigger_phrases, file_path, content_text,
      content='memory_index', content_rowid='id'
    )
  `);

  // Create FTS5 sync triggers (includes content_text)
  database.exec(`
    CREATE TRIGGER IF NOT EXISTS memory_fts_insert AFTER INSERT ON memory_index BEGIN
      INSERT INTO memory_fts(rowid, title, trigger_phrases, file_path, content_text)
      VALUES (new.id, new.title, new.trigger_phrases, new.file_path, new.content_text);
    END
  `);

  database.exec(`
    CREATE TRIGGER IF NOT EXISTS memory_fts_update AFTER UPDATE ON memory_index BEGIN
      INSERT INTO memory_fts(memory_fts, rowid, title, trigger_phrases, file_path, content_text)
      VALUES ('delete', old.id, old.title, old.trigger_phrases, old.file_path, old.content_text);
      INSERT INTO memory_fts(rowid, title, trigger_phrases, file_path, content_text)
      VALUES (new.id, new.title, new.trigger_phrases, new.file_path, new.content_text);
    END
  `);

  database.exec(`
    CREATE TRIGGER IF NOT EXISTS memory_fts_delete AFTER DELETE ON memory_index BEGIN
      INSERT INTO memory_fts(memory_fts, rowid, title, trigger_phrases, file_path, content_text)
      VALUES ('delete', old.id, old.title, old.trigger_phrases, old.file_path, old.content_text);
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

  // Create memory_conflicts table for prediction error gating audit (cognitive memory)
  // KL-1: Unified DDL — matches migration v12 and all INSERT statements
  database.exec(`
    CREATE TABLE IF NOT EXISTS memory_conflicts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
      action TEXT CHECK(action IN ('CREATE', 'CREATE_LINKED', 'UPDATE', 'SUPERSEDE', 'REINFORCE')),
      new_memory_hash TEXT,
      new_memory_id INTEGER,
      existing_memory_id INTEGER,
      similarity REAL,
      reason TEXT,
      new_content_preview TEXT,
      existing_content_preview TEXT,
      contradiction_detected INTEGER DEFAULT 0,
      contradiction_type TEXT,
      spec_folder TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (existing_memory_id) REFERENCES memory_index(id) ON DELETE SET NULL
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
    CREATE INDEX IF NOT EXISTS idx_file_mtime ON memory_index(file_mtime_ms);
    CREATE INDEX IF NOT EXISTS idx_document_type ON memory_index(document_type);
    CREATE INDEX IF NOT EXISTS idx_doc_type_folder ON memory_index(document_type, spec_folder);
  `);

  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_stability ON memory_index(stability DESC);
    CREATE INDEX IF NOT EXISTS idx_last_review ON memory_index(last_review);
    CREATE INDEX IF NOT EXISTS idx_fsrs_retrieval ON memory_index(stability, difficulty, last_review);
    CREATE INDEX IF NOT EXISTS idx_conflicts_memory ON memory_conflicts(existing_memory_id);
    CREATE INDEX IF NOT EXISTS idx_conflicts_timestamp ON memory_conflicts(timestamp DESC);
  `);

  console.warn('[vector-index] Schema created successfully');
}

/* ─────────────────────────────────────────────────────────────
   6. CORE OPERATIONS
────────────────────────────────────────────────────────────────*/

function index_memory(params: any) {
  const database = initialize_db();

  const {
    specFolder,
    filePath,
    anchorId = null,
    title = null,
    triggerPhrases = [],
    importanceWeight = 0.5,
    embedding,
    documentType = 'memory',
    specLevel = null,
    contentText = null
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

  const stmts = init_prepared_statements(database);
  const existing = stmts.get_by_folder_and_path.get(specFolder, filePath, anchorId, anchorId);

  if (existing) {
    return update_memory({
      id: existing.id,
      title,
      triggerPhrases,
      importanceWeight,
      embedding,
      contentText
    });
  }

  const index_memory_tx = database.transaction(() => {
    const embedding_status = sqlite_vec_available ? 'success' : 'pending';

    const result = database.prepare(`
      INSERT INTO memory_index (
        spec_folder, file_path, anchor_id, title, trigger_phrases,
        importance_weight, created_at, updated_at, embedding_model,
        embedding_generated_at, embedding_status, document_type, spec_level,
        content_text
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      specFolder, filePath, anchorId, title, triggers_json,
      importanceWeight, now, now, embeddingsProvider.getModelName(), now, embedding_status,
      documentType, specLevel, contentText
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

// REQ-031: Deferred indexing - entry searchable via BM25/FTS5 only
function index_memory_deferred(params: any) {
  const database = initialize_db();

  const {
    specFolder,
    filePath,
    anchorId = null,
    title = null,
    triggerPhrases = [],
    importanceWeight = 0.5,
    failureReason = null,
    documentType = 'memory',
    specLevel = null,
    contentText = null
  } = params;

  const now = new Date().toISOString();
  const triggers_json = JSON.stringify(triggerPhrases);

  const stmts = init_prepared_statements(database);
  const existing = stmts.get_by_folder_and_path.get(specFolder, filePath, anchorId, anchorId);

  if (existing) {
    database.prepare(`
      UPDATE memory_index
      SET title = ?,
          trigger_phrases = ?,
          importance_weight = ?,
          embedding_status = 'pending',
          failure_reason = ?,
          updated_at = ?,
          document_type = ?,
          spec_level = ?,
          content_text = ?
      WHERE id = ?
    `).run(title, triggers_json, importanceWeight, failureReason, now, documentType, specLevel, contentText, existing.id);
    return existing.id;
  }

  const result = database.prepare(`
    INSERT INTO memory_index (
      spec_folder, file_path, anchor_id, title, trigger_phrases,
      importance_weight, created_at, updated_at, embedding_status,
      failure_reason, retry_count, document_type, spec_level,
      content_text
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, 0, ?, ?, ?)
  `).run(
    specFolder, filePath, anchorId, title, triggers_json,
    importanceWeight, now, now, failureReason, documentType, specLevel, contentText
  );

  const row_id = BigInt(result.lastInsertRowid);
  logger.info(`Deferred indexing: Memory ${Number(row_id)} saved without embedding (BM25/FTS5 searchable)`);

  return Number(row_id);
}

function update_memory(params: any) {
  const database = initialize_db();

  const {
    id,
    title,
    triggerPhrases,
    importanceWeight,
    importanceTier,
    embedding,
    documentType,
    specLevel,
    contentText,
  } = params;

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
    if (documentType !== undefined) {
      updates.push('document_type = ?');
      values.push(documentType);
    }
    if (specLevel !== undefined) {
      updates.push('spec_level = ?');
      values.push(specLevel);
    }
    if (contentText !== undefined) {
      updates.push('content_text = ?');
      values.push(contentText);
    }
    if (embedding) {
      updates.push('embedding_model = ?');
      updates.push('embedding_generated_at = ?');
      updates.push('embedding_status = ?');
      values.push(embeddingsProvider.getModelName(), now, 'success');
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

function delete_memory(id: any) {
  const database = initialize_db();

  const delete_memory_tx = database.transaction(() => {
    database.prepare('DELETE FROM memory_history WHERE memory_id = ?').run(id);

    if (sqlite_vec_available) {
      try {
        database.prepare('DELETE FROM vec_memories WHERE rowid = ?').run(BigInt(id));
      } catch (e: any) {
        console.warn(`[vector-index] Vector deletion failed for memory ${id}: ${e.message}`);
      }
    }

    const result = database.prepare('DELETE FROM memory_index WHERE id = ?').run(id);

    clear_search_cache();
    clear_constitutional_cache();

    return result.changes > 0;
  });

  return delete_memory_tx();
}

function delete_memory_by_path(spec_folder: any, file_path: any, anchor_id = null) {
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

function get_memory(id: any) {
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

function get_memories_by_folder(spec_folder: any) {
  const database = initialize_db();

  const rows = database.prepare(`
    SELECT * FROM memory_index WHERE spec_folder = ? ORDER BY created_at DESC
  `).all(spec_folder);

  return rows.map((row: any) => {
    if (row.trigger_phrases) {
      row.trigger_phrases = JSON.parse(row.trigger_phrases);
    }
    row.isConstitutional = row.importance_tier === 'constitutional';
    return row;
  });
}

function get_memory_count() {
  const database = initialize_db();
  const stmts = init_prepared_statements(database);
  const result = stmts.count_all.get();
  return result.count;
}

function get_status_counts() {
  const database = initialize_db();

  const rows = database.prepare(`
    SELECT embedding_status, COUNT(*) as count
    FROM memory_index
    GROUP BY embedding_status
  `).all();

  const counts = { pending: 0, success: 0, failed: 0, retry: 0 };
  for (const row of rows) {
    (counts as any)[row.embedding_status] = row.count;
  }

  return counts;
}

function get_stats() {
  const counts = get_status_counts();
  const total = counts.pending + counts.success + counts.failed + counts.retry;

  return {
    total,
    ...counts
  };
}

/* ─────────────────────────────────────────────────────────────
   7. VECTOR SEARCH
────────────────────────────────────────────────────────────────*/

function vector_search(query_embedding: any, options: any = {}) {
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
    includeConstitutional = true,
    includeArchived = false
  } = options;

  const query_buffer = to_embedding_buffer(query_embedding);
  const max_distance = 2 * (1 - minSimilarity / 100);

  // ADR-004: FSRS-preferred decay with half-life fallback
  // T301: Source of truth for FSRS constants: lib/cognitive/fsrs-scheduler.ts
  //   FSRS_FACTOR = 19/81 ≈ 0.2346, FSRS_DECAY = -0.5
  //   These are inlined in SQL below because JS cannot import TypeScript directly.
  // Memories with FSRS review data use power-law: R(t) = (1 + 0.2346*t/S)^(-0.5)
  // Memories without review data use legacy half-life: weight * 0.5^(days/halfLife)
  const decay_expr = useDecay
    ? `CASE
         WHEN m.is_pinned = 1 THEN m.importance_weight
         WHEN m.last_review IS NOT NULL AND m.review_count > 0 THEN
           m.importance_weight * POWER(
             1.0 + (19.0/81.0) * (julianday('now') - julianday(m.last_review)) / COALESCE(NULLIF(m.stability, 0), 1.0),
             -0.5
           )
         ELSE m.importance_weight * POWER(0.5, (julianday('now') - julianday(m.updated_at)) / COALESCE(NULLIF(m.decay_half_life_days, 0), 90.0))
       END`
    : 'm.importance_weight';

  let constitutional_results = [];

  if (includeConstitutional && tier !== 'constitutional') {
    constitutional_results = get_constitutional_memories(database, specFolder, includeArchived);
  }

  const where_clauses = ['m.embedding_status = \'success\''];
  const params: any[] = [query_buffer];

  where_clauses.push('(m.expires_at IS NULL OR m.expires_at > datetime(\'now\'))');

  // REQ-206: Filter out archived memories unless explicitly included
  if (!includeArchived) {
    where_clauses.push('(m.is_archived IS NULL OR m.is_archived = 0)');
  }
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

  const regular_results = rows.map((row: any) => {
    if (row.trigger_phrases) {
      row.trigger_phrases = JSON.parse(row.trigger_phrases);
    }
    row.isConstitutional = row.importance_tier === 'constitutional';
    return row;
  });

  return [...constitutional_results, ...regular_results];
}

function get_constitutional_memories_public(options: any = {}) {
  const database = initialize_db();
  const { specFolder = null, maxTokens = 2000, includeArchived = false } = options;

  let results = get_constitutional_memories(database, specFolder, includeArchived);

  const TOKENS_PER_MEMORY = 100;
  const max_count = Math.floor(maxTokens / TOKENS_PER_MEMORY);
  if (results.length > max_count) {
    results = results.slice(0, max_count);
  }

  return results;
}

function multi_concept_search(concept_embeddings: any, options: any = {}) {
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

  const { limit = 10, specFolder = null, minSimilarity = 50, includeArchived = false } = options;

  const concept_buffers = concepts.map(c => to_embedding_buffer(c));
  const max_distance = 2 * (1 - minSimilarity / 100);

  const distance_expressions = concept_buffers.map((_, i) =>
    `vec_distance_cosine(v.embedding, ?) as dist_${i}`
  ).join(', ');

  const distance_filters = concept_buffers.map((_, i) =>
    `vec_distance_cosine(v.embedding, ?) <= ?`
  ).join(' AND ');

  const folder_filter = specFolder ? 'AND m.spec_folder = ?' : '';
  const archival_filter = !includeArchived ? 'AND (m.is_archived IS NULL OR m.is_archived = 0)' : '';

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
        ${archival_filter}
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

  return rows.map((row: any) => {
    if (row.trigger_phrases) {
      row.trigger_phrases = JSON.parse(row.trigger_phrases);
    }
    row.concept_similarities = concept_buffers.map((_: any, i: any) => row[`similarity_${i}`]);
    row.avg_similarity = row.concept_similarities.reduce((a: any, b: any) => a + b, 0) / concepts.length;
    row.isConstitutional = row.importance_tier === 'constitutional';
    return row;
  });
}

/* ─────────────────────────────────────────────────────────────
   8. CONTENT EXTRACTION HELPERS
────────────────────────────────────────────────────────────────*/

function extract_title(content: any, filename: any) {
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

function extract_snippet(content: any, max_length = 200) {
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

function extract_tags(content: any) {
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

function extract_date(content: any, file_path: any) {
  if (content && typeof content === 'string') {
    const date_match = content.match(/^---[\s\S]*?^date:\s*(.+)$/m);
    if (date_match && date_match[1]) {
      const date_str = date_match[1].trim().replace(/^["']|["']$/g, '');
      try {
        const parsed = new Date(date_str);
        if (!isNaN(parsed.getTime())) {
          return parsed.toISOString().split('T')[0];
        }
      } catch (e: any) {
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

/* ─────────────────────────────────────────────────────────────
   9. EMBEDDING GENERATION WRAPPER
────────────────────────────────────────────────────────────────*/

async function generate_query_embedding(query: any) {
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    console.warn('[vector-index] Empty query provided for embedding');
    return null;
  }

  try {
    const embeddings = embeddingsProvider;
    const embedding = await embeddings.generateQueryEmbedding(query.trim());
    return embedding;
  } catch (error: any) {
    console.warn(`[vector-index] Query embedding failed: ${error.message}`);
    return null;
  }
}

/* ─────────────────────────────────────────────────────────────
   10. KEYWORD SEARCH FALLBACK
────────────────────────────────────────────────────────────────*/

function keyword_search(query: any, options: any = {}) {
  const database = initialize_db();
  const { limit = 20, specFolder = null, includeArchived = false } = options;

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

  // REQ-206: Filter out archived memories unless explicitly included
  if (!includeArchived) {
    where_clause += ' AND (is_archived IS NULL OR is_archived = 0)';
  }

  const sql = `
    SELECT * FROM memory_index
    WHERE ${where_clause}
    ORDER BY importance_weight DESC, created_at DESC
  `;

  const rows = database.prepare(sql).all(...params);

  const scored = rows.map((row: any) => {
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
    .filter((row: any) => row.keyword_score > 0)
    .sort((a: any, b: any) => b.keyword_score - a.keyword_score)
    .slice(0, limit);

  return filtered.map((row: any) => {
    if (row.trigger_phrases) {
      try {
        row.trigger_phrases = JSON.parse(row.trigger_phrases);
      } catch (e: any) {
        row.trigger_phrases = [];
      }
    }
    row.isConstitutional = row.importance_tier === 'constitutional';
    return row;
  });
}

/* ─────────────────────────────────────────────────────────────
   11. ENRICHED VECTOR SEARCH
────────────────────────────────────────────────────────────────*/

async function vector_search_enriched(query: any, limit = 20, options: any = {}) {
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

  // HIGH-004 FIX: Read all files concurrently to avoid blocking event loop
  const file_contents = await Promise.all(
    raw_results.map((row: any) => safe_read_file_async(row.file_path))
  );

  const enriched_results = raw_results.map((row: any, i: any) => {
    const content = file_contents[i];
    const title = row.title || extract_title(content, row.file_path);
    const snippet = extract_snippet(content);
    const tags = extract_tags(content);
    const date = extract_date(content, row.file_path) || row.created_at?.split('T')[0] || null;

    const similarity = search_method === 'vector'
      ? (row.similarity || 0)
      : Math.min(100, (row.keyword_score || 0) * 20);

    return {
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
    };
  });

  const elapsed = Date.now() - start_time;
  if (elapsed > 500) {
    console.warn(`[vector-index] Enriched search took ${elapsed}ms (target <500ms)`);
  }

  return enriched_results;
}

/* ─────────────────────────────────────────────────────────────
   12. MULTI-CONCEPT SEARCH
────────────────────────────────────────────────────────────────*/

async function multi_concept_search_enriched(concepts: any, limit = 20, options: any = {}) {
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
        return await multi_concept_keyword_search(concepts.filter(c => typeof c === 'string'), limit, options);
      }
      concept_embeddings.push(embedding);
    } else {
      concept_embeddings.push(concept);
    }
  }

  if (!sqlite_vec_available) {
    console.warn('[vector-index] Falling back to keyword multi-concept search');
    return await multi_concept_keyword_search(concepts.filter(c => typeof c === 'string'), limit, options);
  }

  const raw_results = multi_concept_search(concept_embeddings, { limit, specFolder, minSimilarity });

  const file_contents = await Promise.all(
    raw_results.map((row: any) => safe_read_file_async(row.file_path))
  );

  const enriched_results = raw_results.map((row: any, i: any) => {
    const content = file_contents[i];
    const title = row.title || extract_title(content, row.file_path);
    const snippet = extract_snippet(content);
    const tags = extract_tags(content);
    const date = extract_date(content, row.file_path) || row.created_at?.split('T')[0] || null;

    return {
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
    };
  });

  const elapsed = Date.now() - start_time;
  if (elapsed > 500) {
    console.warn(`[vector-index] Multi-concept search took ${elapsed}ms (target <500ms)`);
  }

  return enriched_results;
}

async function multi_concept_keyword_search(concepts: any, limit = 20, options: any = {}) {
  const database = initialize_db();
  const { specFolder = null } = options;

  if (!concepts.length) return [];

  const concept_results = concepts.map((concept: any) =>
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

  const limited_ids = matching_ids.slice(0, limit);
  const rows = limited_ids.map(id => id_to_row.get(id));

  const file_contents = await Promise.all(
    rows.map(row => safe_read_file_async(row.file_path))
  );

  const enriched_results = rows.map((row, i) => {
    const content = file_contents[i];
    const title = row.title || extract_title(content, row.file_path);
    const snippet = extract_snippet(content);
    const tags = extract_tags(content);
    const date = extract_date(content, row.file_path) || row.created_at?.split('T')[0] || null;

    return {
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
    };
  });

  return enriched_results;
}

function parse_quoted_terms(query: any) {
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

/* ─────────────────────────────────────────────────────────────
   13. SMART RANKING AND DIVERSITY
────────────────────────────────────────────────────────────────*/

// BUG-012 FIX: Weights read from config instead of hardcoded
function apply_smart_ranking(results: any) {
  if (!results || results.length === 0) return results;

  const recency_weight = search_weights.smartRanking?.recencyWeight || 0.3;
  const access_weight = search_weights.smartRanking?.accessWeight || 0.2;
  const relevance_weight = search_weights.smartRanking?.relevanceWeight || 0.5;

  const now = Date.now();
  const week_ms = 7 * 24 * 60 * 60 * 1000;
  const month_ms = 30 * 24 * 60 * 60 * 1000;

  return results.map((r: any) => {
    const created_at = r.created_at ? new Date(r.created_at).getTime() : now;
    const age = now - created_at;
    let recency_factor;
    if (age < week_ms) {
      recency_factor = 1.0;
    } else if (age < month_ms) {
      recency_factor = 0.8;
    } else {
      recency_factor = 0.5;
    }

    const usage_factor = Math.min(1.0, (r.access_count || 0) / 10);
    const similarity_factor = (r.similarity || 0) / 100;

    r.smartScore = (similarity_factor * relevance_weight) + (recency_factor * recency_weight) + (usage_factor * access_weight);
    r.smartScore = Math.round(r.smartScore * 100) / 100;

    return r;
  }).sort((a: any, b: any) => b.smartScore - a.smartScore);
}

// Apply diversity filtering using MMR (Maximal Marginal Relevance)
// Reduces redundancy by penalizing items too similar to already-selected items
function apply_diversity(results: any, diversity_factor = 0.3) {
  if (!results || results.length <= 3) return results;

  const selected = [results[0]];
  const remaining = [...results.slice(1)];

  while (selected.length < results.length && remaining.length > 0) {
    let best_idx = 0;
    let best_score = -Infinity;

    for (let i = 0; i < remaining.length; i++) {
      const candidate = remaining[i];
      const relevance = candidate.smartScore || (candidate.similarity / 100) || 0;

      let max_similarity_to_selected = 0;
      for (const sel of selected) {
        if (sel.specFolder === candidate.specFolder || sel.spec_folder === candidate.spec_folder) {
          max_similarity_to_selected = Math.max(max_similarity_to_selected, 0.8);
        }
        if (sel.date === candidate.date) {
          max_similarity_to_selected = Math.max(max_similarity_to_selected, 0.5);
        }
      }

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

function learn_from_selection(search_query: any, selected_memory_id: any) {
  if (!search_query || !selected_memory_id) return false;

  const database = initialize_db();

  let memory;
  try {
    memory = database.prepare(
      'SELECT trigger_phrases FROM memory_index WHERE id = ?'
    ).get(selected_memory_id);
  } catch (e: any) {
    console.warn(`[vector-index] learn_from_selection query error: ${e.message}`);
    return false;
  }

  if (!memory) return false;

  let existing = [];
  try {
    existing = JSON.parse(memory.trigger_phrases || '[]');
  } catch (e: any) {
    existing = [];
  }

  const stop_words = [
    'that', 'this', 'what', 'where', 'when', 'which', 'with', 'from',
    'have', 'been', 'were', 'being', 'about', 'into', 'through', 'during',
    'before', 'after', 'above', 'below', 'between', 'under', 'again',
    'further', 'then', 'once', 'here', 'there', 'each', 'some', 'other'
  ];

  const new_terms = search_query
    .toLowerCase()
    .split(/\s+/)
    .filter((term: any) => {
      if (term.length < 4) return false;
      if (stop_words.includes(term)) return false;
      if (existing.some((e: any) => e.toLowerCase() === term)) return false;
      if (/^\d+$/.test(term)) return false;
      return true;
    })
    .slice(0, 3);

  if (new_terms.length === 0) return false;

  const updated = [...existing, ...new_terms].slice(0, MAX_TRIGGERS_PER_MEMORY);

  try {
    database.prepare(
      'UPDATE memory_index SET trigger_phrases = ? WHERE id = ?'
    ).run(JSON.stringify(updated), selected_memory_id);
    return true;
  } catch (e: any) {
    console.warn(`[vector-index] learn_from_selection update error: ${e.message}`);
    return false;
  }
}

async function enhanced_search(query: any, limit = 20, options: any = {}) {
  const start_time = Date.now();

  const fetch_limit = Math.min(limit * 2, 100);

  const results = await vector_search_enriched(query, fetch_limit, {
    specFolder: options.specFolder,
    minSimilarity: options.minSimilarity || 30
  });

  const ranked = apply_smart_ranking(results);

  const diversity_factor = options.diversityFactor !== undefined ? options.diversityFactor : 0.3;
  const diverse = options.noDiversity ? ranked : apply_diversity(ranked, diversity_factor);

  const final_results = diverse.slice(0, limit);

  const elapsed = Date.now() - start_time;
  if (elapsed > 600) {
    console.warn(`[vector-index] Enhanced search took ${elapsed}ms (target <600ms)`);
  }

  return final_results;
}

/* ─────────────────────────────────────────────────────────────
   14. RELATED MEMORIES AND USAGE TRACKING
────────────────────────────────────────────────────────────────*/

// LRU Cache with O(1) eviction using doubly-linked list
class LRUCache {
  max_size: any;
  ttl_ms: any;
  cache: any;
  head: any;
  tail: any;

  constructor(max_size: any, ttl_ms: any) {
    this.max_size = max_size;
    this.ttl_ms = ttl_ms;
    this.cache = new Map();
    this.head = { prev: null, next: null };
    this.tail = { prev: this.head, next: null };
    this.head.next = this.tail;
  }

  get(key: any) {
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

  set(key: any, value: any) {
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

  _add_to_front(node: any) {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next.prev = node;
    this.head.next = node;
  }

  _remove(node: any) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  _move_to_front(node: any) {
    this._remove(node);
    this._add_to_front(node);
  }

  clear() {
    this.cache.clear();
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  keys() {
    return this.cache.keys();
  }

  delete(key: any) {
    const node = this.cache.get(key);
    if (node) {
      this._remove(node);
      this.cache.delete(key);
      return true;
    }
    return false;
  }

  get size() { return this.cache.size; }
}

// LRU Cache instance for search queries
let query_cache: any = null;

function get_query_cache() {
  if (!query_cache) {
    query_cache = new LRUCache(500, 15 * 60 * 1000);
  }
  return query_cache;
}

// Find and link related memories when saving a new memory
async function link_related_on_save(new_memory_id: any, content: any) {
  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    return;
  }

  try {
    const embedding = await generate_query_embedding(content.substring(0, 1000));
    if (!embedding) {
      console.warn(`[vector-index] Could not generate embedding for memory ${new_memory_id}`);
      return;
    }

    const similar = vector_search(embedding, {
      limit: 6,
      minSimilarity: 75
    });

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
  } catch (error: any) {
    console.warn(`[vector-index] Failed to link related memories for ${new_memory_id}: ${error.message}`);
  }
}

// Record memory access for usage tracking
function record_access(memory_id: any) {
  try {
    const database = initialize_db();
    const now = Date.now();

    const result = database.prepare(`
      UPDATE memory_index
      SET access_count = access_count + 1,
          last_accessed = ?
      WHERE id = ?
    `).run(now, memory_id);

    return result.changes > 0;
  } catch (error: any) {
    console.warn(`[vector-index] Failed to record access for memory ${memory_id}: ${error.message}`);
    return false;
  }
}

function get_cache_key(query: any, limit: any, options: any) {
  const hash = crypto.createHash('sha256');
  hash.update(JSON.stringify({ query, limit, options }));
  return hash.digest('hex').substring(0, 16);
}

// Cached version of vector_search_enriched with LRU cache
async function cached_search(query: any, limit = 20, options = {}) {
  const cache = get_query_cache();
  const key = get_cache_key(query, limit, options);

  const cached = cache.get(key);
  if (cached) {
    return cached.results;
  }

  const results = await vector_search_enriched(query, limit, options);

  cache.set(key, { results });

  return results;
}

function clear_search_cache(spec_folder = null) {
  if (!query_cache) {
    return 0;
  }

  if (spec_folder) {
    const keys_to_delete = [];
    for (const key of query_cache.keys()) {
      if (key.includes(spec_folder)) {
        keys_to_delete.push(key);
      }
    }
    for (const key of keys_to_delete) {
      query_cache.delete(key);
    }
    return keys_to_delete.length;
  } else {
    const size = query_cache.size;
    query_cache.clear();
    return size;
  }
}

// Returns pre-computed related memories stored during save with full metadata
function get_related_memories(memory_id: any) {
  try {
    const database = initialize_db();

    const memory = database.prepare(`
      SELECT related_memories FROM memory_index WHERE id = ?
    `).get(memory_id);

    if (!memory || !memory.related_memories) {
      return [];
    }

    const related = safe_parse_json(memory.related_memories, []);

    return related.map((rel: any) => {
      const full_memory = get_memory(rel.id);
      if (full_memory) {
        return {
          ...full_memory,
          relationSimilarity: rel.similarity
        };
      }
      return null;
    }).filter(Boolean);
  } catch (error: any) {
    console.warn(`[vector-index] Failed to get related memories for ${memory_id}: ${error.message}`);
    return [];
  }
}

// Returns memories sorted by access count or last accessed time
function get_usage_stats(options: any = {}) {
  const {
    sortBy = 'access_count',
    order = 'DESC',
    limit = 20
  } = options;

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

// Valid statuses: 'pending', 'success', 'failed', 'retry', 'partial'
function update_embedding_status(id: any, status: any) {
  const valid_statuses = ['pending', 'success', 'failed', 'retry', 'partial'];
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
  } catch (error: any) {
    console.warn(`[vector-index] Failed to update embedding status for ${id}: ${error.message}`);
    return false;
  }
}

function update_confidence(memory_id: any, confidence: any) {
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
  } catch (error: any) {
    console.warn(`[vector-index] Failed to update confidence for ${memory_id}: ${error.message}`);
    return false;
  }
}

/* ─────────────────────────────────────────────────────────────
   15. CLEANUP FUNCTIONS
────────────────────────────────────────────────────────────────*/

function find_cleanup_candidates(options: any = {}) {
  const database = initialize_db();

  const {
    maxAgeDays = 90,
    maxAccessCount = 2,
    maxConfidence = 0.4,
    limit = 50
  } = options;

  const cutoff_date = new Date();
  cutoff_date.setDate(cutoff_date.getDate() - maxAgeDays);
  const cutoff_iso = cutoff_date.toISOString();

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
  } catch (e: any) {
    console.warn(`[vector-index] find_cleanup_candidates error: ${e.message}`);
    return [];
  }

  return rows.map((row: any) => {
    const age_string = format_age_string(row.created_at);
    const last_access_string = format_age_string(row.last_accessed);

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

function delete_memories(memory_ids: any) {
  if (!memory_ids || memory_ids.length === 0) {
    return { deleted: 0, failed: 0 };
  }

  const database = initialize_db();
  let deleted = 0;
  let failed = 0;

  const failed_ids: any[] = [];

  const delete_transaction = database.transaction(() => {
    for (const id of memory_ids) {
      try {
        database.prepare('DELETE FROM memory_history WHERE memory_id = ?').run(id);

        if (sqlite_vec_available) {
          try {
            database.prepare('DELETE FROM vec_memories WHERE rowid = ?').run(BigInt(id));
          } catch (vec_error: any) {
            console.warn(`[VectorIndex] Failed to delete vector for memory ${id}: ${vec_error.message}`);
          }
        }

        const result = database.prepare('DELETE FROM memory_index WHERE id = ?').run(id);
        if (result.changes > 0) {
          deleted++;
        } else {
          failed++;
          failed_ids.push(id);
        }
      } catch (e: any) {
        console.warn(`[vector-index] Failed to delete memory ${id}: ${e.message}`);
        failed++;
        failed_ids.push(id);
      }
    }

    if (failed_ids.length > 0) {
      throw new Error(`Failed to delete memories: ${failed_ids.join(', ')}. Transaction rolled back.`);
    }
  });

  try {
    delete_transaction();
    if (deleted > 0) {
      clear_constitutional_cache();
      clear_search_cache();
    }
  } catch (e: any) {
    console.warn(`[vector-index] delete_memories transaction error: ${e.message}`);
  }

  return { deleted, failed };
}

function get_memory_preview(memory_id: any, max_lines = 50) {
  const database = initialize_db();

  let memory;
  try {
    memory = database.prepare(`
      SELECT * FROM memory_index WHERE id = ?
    `).get(memory_id);
  } catch (e: any) {
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
  } catch (e: any) {
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

/* ─────────────────────────────────────────────────────────────
   16. DATABASE UTILITIES
────────────────────────────────────────────────────────────────*/

function close_db() {
  clear_prepared_statements();
  if (db) {
    db.close();
    db = null;
  }
}

function get_db_path() {
  return db_path;
}

function get_db() {
  return initialize_db();
}

// BUG-013 FIX: Added autoClean option for automatic orphan cleanup
function verify_integrity(options: any = {}) {
  const { autoClean = false } = options;
  const database = initialize_db();

  const find_orphaned_vector_ids = () => {
    if (!sqlite_vec_available) return [];
    try {
      return database.prepare(`
        SELECT v.rowid FROM vec_memories v
        WHERE NOT EXISTS (SELECT 1 FROM memory_index m WHERE m.id = v.rowid)
      `).all().map((r: any) => r.rowid);
    } catch (e: any) {
      console.warn('[vector-index] Could not query orphaned vectors:', e.message);
      return [];
    }
  };

  const orphaned_vector_ids = find_orphaned_vector_ids();
  const orphaned_vectors = orphaned_vector_ids.length;

  let cleaned_vectors = 0;
  if (autoClean && orphaned_vectors > 0 && sqlite_vec_available) {
    logger.info(`Auto-cleaning ${orphaned_vectors} orphaned vectors...`);
    const delete_stmt = database.prepare('DELETE FROM vec_memories WHERE rowid = ?');
    for (const rowid of orphaned_vector_ids) {
      try {
        delete_stmt.run(BigInt(rowid));
        cleaned_vectors++;
      } catch (e: any) {
        console.warn(`[vector-index] Failed to clean orphaned vector ${rowid}: ${e.message}`);
      }
    }
    logger.info(`Cleaned ${cleaned_vectors} orphaned vectors`);
  }

  const missing_vectors = database.prepare(`
    SELECT COUNT(*) as count FROM memory_index m
    WHERE m.embedding_status = 'success'
    AND NOT EXISTS (SELECT 1 FROM vec_memories v WHERE v.rowid = m.id)
  `).get().count;

  const total_memories = database.prepare('SELECT COUNT(*) as count FROM memory_index').get().count;
  const total_vectors = database.prepare('SELECT COUNT(*) as count FROM vec_memories').get().count;

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
    cleaned: autoClean && cleaned_vectors > 0 ? { vectors: cleaned_vectors } : undefined
  };
}

/* ─────────────────────────────────────────────────────────────
   17. IVECTORSTORE IMPLEMENTATION
────────────────────────────────────────────────────────────────*/

// IVectorStore already imported at top of file (line 26)

/**
 * SQLiteVectorStore - IVectorStore implementation using SQLite + sqlite-vec
 *
 * This class adapts the existing vector-index.js functions to the IVectorStore
 * interface, enabling protocol-based dependency injection and testability.
 *
 * Design Decision (ADR-001):
 * Protocol-based DI at integration boundary. This adapter wraps existing
 * functions rather than refactoring them, minimizing risk while adding
 * interface compliance.
 *
 * @implements {IVectorStore}
 */
class SQLiteVectorStore extends IVectorStore {
  dbPath: any;
  _initialized: any;

  /**
   * Create a new SQLiteVectorStore instance.
   *
   * @param {Object} [options={}] - Configuration options
   * @param {string} [options.dbPath] - Custom database path
   */
  constructor(options: any = {}) {
    super();
    this.dbPath = options.dbPath || null;
    this._initialized = false;
  }

  /**
   * Initialize the database connection.
   * Safe to call multiple times.
   * @private
   */
  _ensureInitialized() {
    if (!this._initialized) {
      initialize_db(this.dbPath);
      this._initialized = true;
    }
  }

  /**
   * Search for similar vectors.
   *
   * @param {Float32Array} embedding - Query embedding vector
   * @param {number} topK - Maximum number of results
   * @param {Object} [options={}] - Search options
   * @returns {Promise<Array>} Array of search results sorted by similarity
   */
  async search(embedding: any, topK: any, options: any = {}) {
    this._ensureInitialized();

    // Validate embedding
    const expected_dim = get_embedding_dim();
    if (!embedding || embedding.length !== expected_dim) {
      throw new Error(`Invalid embedding dimension: expected ${expected_dim}, got ${embedding?.length}`);
    }

    // Map interface options to vector_search options
    const search_options = {
      limit: topK,
      specFolder: options.specFolder,
      minSimilarity: options.minSimilarity || 0,
      useDecay: options.useDecay !== false,
      tier: options.tier,
      contextType: options.contextType,
      includeConstitutional: options.includeConstitutional !== false
    };

    // vector_search is synchronous
    return vector_search(embedding, search_options);
  }

  /**
   * Insert or update a vector with metadata.
   *
   * @param {string} id - Unique identifier (not used, derived from metadata)
   * @param {Float32Array} embedding - Vector embedding
   * @param {Object} metadata - Associated metadata
   * @returns {Promise<number>} The ID of the inserted/updated record
   */
  async upsert(id: any, embedding: any, metadata: any) {
    this._ensureInitialized();

    // Validate embedding
    const expected_dim = get_embedding_dim();
    if (!embedding || embedding.length !== expected_dim) {
      throw new Error(`Embedding dimension mismatch: expected ${expected_dim}, got ${embedding?.length}`);
    }

    // Map metadata to index_memory params
    const params = {
      specFolder: metadata.spec_folder || metadata.specFolder,
      filePath: metadata.file_path || metadata.filePath,
      anchorId: metadata.anchor_id || metadata.anchorId || null,
      title: metadata.title || null,
      triggerPhrases: metadata.trigger_phrases || metadata.triggerPhrases || [],
      importanceWeight: metadata.importance_weight || metadata.importanceWeight || 0.5,
      embedding: embedding
    };

    if (!params.specFolder || !params.filePath) {
      throw new Error('metadata must include spec_folder and file_path');
    }

    // index_memory handles upsert logic internally
    return index_memory(params);
  }

  /**
   * Delete a vector by ID.
   *
   * @param {number} id - Record ID to delete
   * @returns {Promise<boolean>} True if deleted, false if not found
   */
  async delete(id: any) {
    this._ensureInitialized();
    return delete_memory(id);
  }

  /**
   * Get a vector by ID.
   *
   * @param {number} id - Record ID
   * @returns {Promise<Object|null>} The record or null if not found
   */
  async get(id: any) {
    this._ensureInitialized();
    return get_memory(id);
  }

  /**
   * Get statistics about the vector store.
   *
   * @returns {Promise<Object>} Statistics object with counts and status
   */
  async getStats() {
    this._ensureInitialized();
    return get_stats();
  }

  /**
   * Check if the vector store is available and operational.
   *
   * @returns {Promise<boolean>} True if operational
   */
  isAvailable(): boolean {
    return sqlite_vec_available;
  }

  /**
   * Get the expected embedding dimension.
   *
   * @returns {number} Embedding dimension
   */
  getEmbeddingDimension() {
    return get_embedding_dim();
  }

  /**
   * Close the vector store connection and release resources.
   *
   * @returns {Promise<void>}
   */
  async close() {
    if (this._initialized) {
      close_db();
      this._initialized = false;
    }
  }

  // ─────────────────────────────────────────────────────────────
  // Extended Methods (beyond IVectorStore interface)
  // ─────────────────────────────────────────────────────────────

  /**
   * Delete memory by spec folder and file path.
   *
   * @param {string} specFolder - Spec folder path
   * @param {string} filePath - File path
   * @param {string} [anchorId=null] - Anchor ID
   * @returns {Promise<boolean>} True if deleted
   */
  async deleteByPath(specFolder: any, filePath: any, anchorId = null) {
    this._ensureInitialized();
    return delete_memory_by_path(specFolder, filePath, anchorId);
  }

  /**
   * Get all memories for a spec folder.
   *
   * @param {string} specFolder - Spec folder path
   * @returns {Promise<Array>} Array of memories
   */
  async getByFolder(specFolder: any) {
    this._ensureInitialized();
    return get_memories_by_folder(specFolder);
  }

  /**
   * Perform enriched vector search with content loading.
   *
   * @param {Float32Array} embedding - Query embedding
   * @param {Object} [options={}] - Search options
   * @returns {Promise<Array>} Enriched search results
   */
  async searchEnriched(embedding: any, options: any = {}) {
    this._ensureInitialized();
    return vector_search_enriched(embedding, undefined, options);
  }

  /**
   * Perform enhanced search with smart ranking and diversity.
   *
   * @param {Float32Array} embedding - Query embedding
   * @param {Object} [options={}] - Search options
   * @returns {Promise<Array>} Enhanced search results
   */
  async enhancedSearch(embedding: any, options: any = {}) {
    this._ensureInitialized();
    return enhanced_search(embedding, undefined, options);
  }

  /**
   * Get constitutional memories.
   *
   * @param {Object} [options={}] - Options
   * @returns {Promise<Array>} Constitutional memories
   */
  async getConstitutionalMemories(options: any = {}) {
    this._ensureInitialized();
    return get_constitutional_memories_public(options);
  }

  /**
   * Verify database integrity.
   *
   * @param {Object} [options={}] - Options
   * @returns {Promise<Object>} Integrity report
   */
  async verifyIntegrity(options: any = {}) {
    this._ensureInitialized();
    return verify_integrity(options);
  }
}

/* ─────────────────────────────────────────────────────────────
   18. EXPORTS
────────────────────────────────────────────────────────────────*/

// Check if vector search is available (sqlite-vec loaded)
function is_vector_search_available() {
  return sqlite_vec_available;
}

// Initialization
export { initialize_db as initializeDb };
export { close_db as closeDb };
export { get_db as getDb };
export { get_db_path as getDbPath };

// Core operations
export { index_memory as indexMemory };
export { index_memory_deferred as indexMemoryDeferred };  // REQ-031, T096: Deferred indexing
export { update_memory as updateMemory };
export { delete_memory as deleteMemory };
export { delete_memory_by_path as deleteMemoryByPath };

// Queries
export { get_memory as getMemory };
export { get_memories_by_folder as getMemoriesByFolder };
export { get_memory_count as getMemoryCount };
export { get_status_counts as getStatusCounts };
export { get_stats as getStats };
export { verify_integrity as verifyIntegrity };

// Search - Basic
export { vector_search as vectorSearch };
export { get_constitutional_memories_public as getConstitutionalMemories }; // P0-001: Export public wrapper
export { clear_constitutional_cache as clearConstitutionalCache };
export { multi_concept_search as multiConceptSearch };
export { is_vector_search_available as isVectorSearchAvailable };

// Search - Enriched (US1, US8)
export { vector_search_enriched as vectorSearchEnriched };
export { multi_concept_search_enriched as multiConceptSearchEnriched };
export { keyword_search as keywordSearch };
export { multi_concept_keyword_search as multiConceptKeywordSearch };

// Search - Cached (T3.4)
export { cached_search as cachedSearch };
export { clear_search_cache as clearSearchCache };

// Smart Ranking & Diversity (T3.5, T3.6, T3.7)
export { apply_smart_ranking as applySmartRanking };
export { apply_diversity as applyDiversity };
export { learn_from_selection as learnFromSelection };
export { enhanced_search as enhancedSearch };

// Related Memories (T1.3)
export { link_related_on_save as linkRelatedOnSave };
export { get_related_memories as getRelatedMemories };

// Usage Tracking (T3.2)
export { record_access as recordAccess };
export { get_usage_stats as getUsageStats };
export { update_confidence as updateConfidence };

// Embedding Status (M9)
export { update_embedding_status as updateEmbeddingStatus };

// Cleanup Functions (T2.2)
export { find_cleanup_candidates as findCleanupCandidates };
export { delete_memories as deleteMemories };
export { get_memory_preview as getMemoryPreview };

// Content Extraction Helpers
export { extract_title as extractTitle };
export { extract_snippet as extractSnippet };
export { extract_tags as extractTags };
export { extract_date as extractDate };

// Query Utilities
export { generate_query_embedding as generateQueryEmbedding };
export { parse_quoted_terms as parseQuotedTerms };

// Security Utilities (SEC-002)
export { validate_file_path_local as validateFilePath };

// Embedding Dimension (BUG-003)
export { get_confirmed_embedding_dimension as getConfirmedEmbeddingDimension };
export { get_embedding_dim as getEmbeddingDim };
export { validate_embedding_dimension as validateEmbeddingDimension };

// Cache Utilities (BUG-009)
export { get_cache_key as getCacheKey };

// Constants
export { EMBEDDING_DIM };
export { DEFAULT_DB_PATH };

// Protocol Abstractions (T086, REQ-021)
export { SQLiteVectorStore };

// Snake_case aliases for backward compatibility (084-fix)
// Used by retry-manager.js and other internal scripts
export { initialize_db };
export { get_db };
export { get_memory };
export { get_db_path };

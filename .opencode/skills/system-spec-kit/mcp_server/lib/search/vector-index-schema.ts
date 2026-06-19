// ───────────────────────────────────────────────────────────────
// MODULE: Vector Index Schema
// ───────────────────────────────────────────────────────────────
// Split from vector-index-store.ts — contains ALL schema creation,
// Migration, and companion-table logic.

import Database from 'better-sqlite3';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { validateFilePath } from '@spec-kit/shared/utils/path-security';
import { getCanonicalPathKey } from '../utils/canonical-path.js';
import { extractSpecFolder } from '../parsing/memory-parser.js';
import { createLogger } from '../utils/logger.js';
import { initEmbeddingCache } from '../cache/embedding-cache.js';
import {
  LEGACY_DERIVED_CAUSAL_EDGE_RULE_VERSION,
  deriveCausalEdgeDerivedId,
} from '../content-id.js';
import {
  get_error_message,
} from './vector-index-types.js';
import { init as initHistory } from '../storage/history.js';
import { getSpecsBasePaths } from './folder-discovery.js';
import { ensureCausalEdgeTombstoneSchema } from '../causal/sweep.js';

// Feature catalog: Database and schema safety
// Feature catalog: Lineage state active projection and asOf resolution
// Feature catalog: Per-memory history log


const logger = createLogger('VectorIndex');

interface SchemaCompatibilityReport {
  compatible: boolean;
  schemaVersion: number | null;
  missingTables: string[];
  missingColumns: Record<string, string[]>;
  missingIndexes: string[];
  constraintMismatches: string[];
  warnings: string[];
}

interface LineageSchemaReport {
  compatible: boolean;
  schemaVersion: number | null;
  missingTables: string[];
  missingColumns: Record<string, string[]>;
  warnings: string[];
}

const MEMORY_LINEAGE_TABLE = 'memory_lineage';
const ACTIVE_MEMORY_PROJECTION_TABLE = 'active_memory_projection';
const LEGACY_MEMORY_LINEAGE_TABLE = 'hydra_memory_lineage';
const LEGACY_ACTIVE_MEMORY_PROJECTION_TABLE = 'hydra_active_memory_projection';
const REQUIRED_TABLES: readonly string[] = [
  'memory_index',
  'schema_version',
  'causal_edge_tombstones',
  'memory_trigger_embeddings',
  'memory_idempotency_receipts',
  'edge_vector_embeddings',
];
const REQUIRED_INDEXES_BY_TABLE: Readonly<Record<string, readonly string[]>> = {
  memory_index: [
    'idx_stability',
    'idx_last_review',
    'idx_fsrs_retrieval',
    'idx_document_type',
    'idx_doc_type_folder',
    'idx_quality_score',
    'idx_post_insert_enrichment_incomplete',
    'idx_save_parent_content_hash_scope',
    'idx_save_parent_canonical_path',
    'idx_memory_chunk_identity',
    'idx_memory_chunk_fingerprint',
    'idx_memory_active_recall',
    'idx_memory_purgeable_retention',
    // Active-row uniqueness guard: every v30+ DB builds this unique index. Listing it
    // here lets the compatibility check detect a DB whose guard was dropped or never
    // built, instead of silently passing a database with a broken active-row invariant.
    'idx_memory_logical_key_active_unique',
  ],
  memory_conflicts: [
    'idx_conflicts_memory',
    'idx_conflicts_timestamp',
  ],
  causal_edge_tombstones: [
    'idx_causal_edge_tombstones_identity',
    'idx_causal_edge_tombstones_tombstoned_at',
    'idx_causal_edge_tombstones_reason',
  ],
  causal_edges: [
    'idx_causal_edges_derived_id',
    'idx_causal_edges_retention_incoming',
  ],
  edge_vector_embeddings: [
    'idx_edge_vector_embeddings_status',
    'idx_edge_vector_embeddings_edge',
  ],
  memory_trigger_embeddings: [
    'idx_memory_trigger_embeddings_status',
  ],
  memory_idempotency_receipts: [
    'idx_memory_idempotency_receipts_operation',
  ],
};
const REQUIRED_MEMORY_INDEX_COLUMNS: readonly string[] = [
  'id',
  'spec_folder',
  'file_path',
  'importance_tier',
  'context_type',
  'session_id',
  'created_at',
  'updated_at',
  'post_insert_enrichment_status',
  'post_insert_enrichment_state',
  'post_insert_enrichment_completed_at',
  'post_insert_enrichment_version',
  'near_duplicate_of',
  'last_dedup_checked_at',
  'source_kind',
  'delete_after',
  'deleted_at',
  'retention_trust_score',
  'chunk_id',
  'chunk_fingerprint',
  'chunk_kind',
  'chunk_start_line',
  'chunk_end_line',
];
const REQUIRED_MEMORY_CONFLICT_COLUMNS: readonly string[] = [
  'id',
  'timestamp',
  'action',
  'new_memory_hash',
  'new_memory_id',
  'existing_memory_id',
  'similarity',
  'reason',
  'new_content_preview',
  'existing_content_preview',
  'contradiction_detected',
  'contradiction_type',
  'spec_folder',
  'created_at',
];
const REQUIRED_CAUSAL_EDGE_COLUMNS: readonly string[] = [
  'id',
  'source_id',
  'target_id',
  'relation',
  'fact_text',
];
const REQUIRED_CAUSAL_EDGE_TOMBSTONE_COLUMNS: readonly string[] = [
  'id',
  'source_id',
  'target_id',
  'relation',
  'tombstoned_at',
  'reason',
  'lifecycle_generation',
  'restore_metadata',
];
const REQUIRED_TRIGGER_EMBEDDING_COLUMNS: readonly string[] = [
  'memory_id',
  'phrase_hash',
  'profile_key',
  'input_kind',
  'model_id',
  'dimensions',
  'embedding_status',
  'failure_reason',
  'created_at',
  'updated_at',
];
const REQUIRED_IDEMPOTENCY_RECEIPT_COLUMNS: readonly string[] = [
  'receipt_key',
  'operation',
  'content_hash',
  'request_fingerprint',
  'payload_hash',
  'response_payload',
  'memory_id',
  'created_at',
  'updated_at',
];
const REQUIRED_EDGE_VECTOR_EMBEDDING_COLUMNS: readonly string[] = [
  'edge_id',
  'profile_key',
  'input_kind',
  'model_id',
  'dimensions',
  'embedding',
  'embedding_status',
  'failure_reason',
  'fact_hash',
  'created_at',
  'updated_at',
];
const CAUSAL_EDGE_PROVENANCE_COLUMNS: ReadonlyArray<{ name: string; sql: string }> = [
  { name: 'confidence', sql: 'ALTER TABLE causal_edges ADD COLUMN confidence REAL DEFAULT 1.0' },
  { name: 'extraction_method', sql: "ALTER TABLE causal_edges ADD COLUMN extraction_method TEXT DEFAULT 'manual'" },
];
const REQUIRED_LINEAGE_TABLES: readonly string[] = [
  MEMORY_LINEAGE_TABLE,
  ACTIVE_MEMORY_PROJECTION_TABLE,
];
const REQUIRED_LINEAGE_COLUMNS: Readonly<Record<string, readonly string[]>> = {
  [MEMORY_LINEAGE_TABLE]: [
    'memory_id',
    'logical_key',
    'version_number',
    'root_memory_id',
    'predecessor_memory_id',
    'superseded_by_memory_id',
    'valid_from',
    'valid_to',
    'ingested_at',
    'expired_at',
    'transition_event',
    'actor',
    'metadata',
    'created_at',
  ],
  [ACTIVE_MEMORY_PROJECTION_TABLE]: [
    'logical_key',
    'root_memory_id',
    'active_memory_id',
    'updated_at',
  ],
};
const SAVE_PARENT_CONTENT_HASH_SCOPE_INDEX_SQL = `
  CREATE INDEX IF NOT EXISTS idx_save_parent_content_hash_scope
  ON memory_index(
    spec_folder,
    content_hash,
    embedding_status,
    tenant_id,
    user_id,
    agent_id,
    session_id,
    id DESC
  )
  WHERE parent_id IS NULL
`;
const SAVE_PARENT_CANONICAL_PATH_INDEX_SQL = `
  CREATE INDEX IF NOT EXISTS idx_save_parent_canonical_path
  ON memory_index(spec_folder, canonical_file_path, id DESC)
  WHERE parent_id IS NULL
`;
const POST_INSERT_ENRICHMENT_INCOMPLETE_INDEX_SQL = `
  CREATE INDEX IF NOT EXISTS idx_post_insert_enrichment_incomplete
  ON memory_index(post_insert_enrichment_status, id)
  WHERE post_insert_enrichment_status != 'complete'
`;
const MEMORY_CHUNK_IDENTITY_INDEX_SQL = `
  CREATE INDEX IF NOT EXISTS idx_memory_chunk_identity
  ON memory_index(file_path, chunk_id)
  WHERE chunk_id IS NOT NULL
`;
const MEMORY_CHUNK_FINGERPRINT_INDEX_SQL = `
  CREATE INDEX IF NOT EXISTS idx_memory_chunk_fingerprint
  ON memory_index(chunk_fingerprint)
  WHERE chunk_fingerprint IS NOT NULL
`;
const MEMORY_ACTIVE_RECALL_INDEX_SQL = `
  CREATE INDEX IF NOT EXISTS idx_memory_active_recall
  ON memory_index(spec_folder, document_type, updated_at DESC, id DESC)
  WHERE deleted_at IS NULL
`;
const MEMORY_PURGEABLE_RETENTION_INDEX_SQL = `
  CREATE INDEX IF NOT EXISTS idx_memory_purgeable_retention
  ON memory_index(delete_after, deleted_at, id)
  WHERE deleted_at IS NOT NULL
`;
const MEMORY_TRIGGER_EMBEDDINGS_STATUS_INDEX_SQL = `
  CREATE INDEX IF NOT EXISTS idx_memory_trigger_embeddings_status
  ON memory_trigger_embeddings(embedding_status, updated_at)
`;

function hasTable(database: Database.Database, tableName: string): boolean {
  const row = database.prepare(
    "SELECT 1 AS present FROM sqlite_master WHERE type='table' AND name = ?"
  ).get(tableName) as { present?: number } | undefined;

  return row?.present === 1;
}

function hasIndex(database: Database.Database, indexName: string): boolean {
  const row = database.prepare(
    "SELECT 1 AS present FROM sqlite_master WHERE type='index' AND name = ?"
  ).get(indexName) as { present?: number } | undefined;

  return row?.present === 1;
}

function getTableColumns(database: Database.Database, tableName: string): string[] {
  return (database.prepare(`PRAGMA table_info(${tableName})`).all() as Array<{ name: string }>)
    .map((column) => column.name)
    .filter((columnName) => typeof columnName === 'string' && columnName.length > 0);
}

function getTableSql(database: Database.Database, tableName: string): string | null {
  const row = database.prepare(
    "SELECT sql FROM sqlite_master WHERE type='table' AND name = ?"
  ).get(tableName) as { sql?: string } | undefined;

  return typeof row?.sql === 'string' ? row.sql : null;
}

function hasEmbeddingCacheDimensionsPrimaryKey(database: Database.Database): boolean {
  const tableSql = getTableSql(database, 'embedding_cache');
  if (typeof tableSql !== 'string') {
    return false;
  }

  return /PRIMARY\s+KEY\s*\(\s*content_hash\s*,\s*model_id\s*,\s*dimensions\s*\)/i.test(tableSql)
    || /PRIMARY\s+KEY\s*\(\s*content_hash\s*,\s*profile_key\s*,\s*input_kind\s*,\s*model_id\s*,\s*dimensions\s*\)/i.test(tableSql);
}

function ensureEmbeddingCacheSchema(database: Database.Database): void {
  if (!hasTable(database, 'embedding_cache')) {
    initEmbeddingCache(database);
    return;
  }

  if (hasEmbeddingCacheDimensionsPrimaryKey(database)) {
    return;
  }

  logger.info('Migrating embedding_cache primary key to include dimensions');
  database.exec(`
    ALTER TABLE embedding_cache RENAME TO embedding_cache_legacy_dimensions;
  `);
  initEmbeddingCache(database);
  database.exec(`
    INSERT OR REPLACE INTO embedding_cache (
      content_hash,
      model_id,
      embedding,
      dimensions,
      created_at,
      last_used_at
    )
    SELECT
      content_hash,
      model_id,
      embedding,
      dimensions,
      created_at,
      last_used_at
    FROM embedding_cache_legacy_dimensions
  `);
  database.exec('DROP TABLE embedding_cache_legacy_dimensions');
}

function hasConstitutionalTierConstraint(database: Database.Database): boolean {
  const tableSql = getTableSql(database, 'memory_index');
  return typeof tableSql === 'string' && tableSql.includes("'constitutional'");
}

function createRequiredIndex(
  database: Database.Database,
  indexName: string,
  sql: string,
  context: string,
): void {
  try {
    database.exec(sql);
  } catch (error: unknown) {
    if (hasIndex(database, indexName)) {
      logger.warn(`${context}: reusing existing index after DDL warning`, {
        indexName,
        error: get_error_message(error),
      });
      return;
    }
    throw error;
  }

  if (!hasIndex(database, indexName)) {
    throw new Error(`${context}: expected index "${indexName}" to exist after migration`);
  }
}

function createMemoryConflictsTable(database: Database.Database): void {
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
}

function createMemoryConflictIndexes(
  database: Database.Database,
  context: string,
): void {
  createRequiredIndex(
    database,
    'idx_conflicts_memory',
    'CREATE INDEX IF NOT EXISTS idx_conflicts_memory ON memory_conflicts(existing_memory_id)',
    context,
  );
  createRequiredIndex(
    database,
    'idx_conflicts_timestamp',
    'CREATE INDEX IF NOT EXISTS idx_conflicts_timestamp ON memory_conflicts(timestamp DESC)',
    context,
  );
}

function getFirstAvailableColumnExpression(
  availableColumns: Set<string>,
  candidates: string[],
  fallback: string,
): string {
  for (const candidate of candidates) {
    if (availableColumns.has(candidate)) {
      return candidate;
    }
  }
  return fallback;
}

function hasUnifiedMemoryConflictsTable(database: Database.Database): boolean {
  if (!hasTable(database, 'memory_conflicts')) {
    return false;
  }

  const columns = new Set(getTableColumns(database, 'memory_conflicts'));
  return REQUIRED_MEMORY_CONFLICT_COLUMNS.every((columnName) => columns.has(columnName));
}

function migrateMemoryConflictsTable(database: Database.Database): void {
  if (!hasTable(database, 'memory_conflicts')) {
    createMemoryConflictsTable(database);
    return;
  }

  if (hasUnifiedMemoryConflictsTable(database)) {
    return;
  }

  database.exec('ALTER TABLE memory_conflicts RENAME TO memory_conflicts_legacy');
  createMemoryConflictsTable(database);

  const legacyColumns = new Set(getTableColumns(database, 'memory_conflicts_legacy'));
  database.exec(`
    INSERT INTO memory_conflicts (
      id,
      timestamp,
      action,
      new_memory_hash,
      new_memory_id,
      existing_memory_id,
      similarity,
      reason,
      new_content_preview,
      existing_content_preview,
      contradiction_detected,
      contradiction_type,
      spec_folder,
      created_at
    )
    SELECT
      ${getFirstAvailableColumnExpression(legacyColumns, ['id'], 'NULL')},
      ${getFirstAvailableColumnExpression(legacyColumns, ['timestamp', 'created_at'], 'CURRENT_TIMESTAMP')},
      ${getFirstAvailableColumnExpression(legacyColumns, ['action'], 'NULL')},
      ${getFirstAvailableColumnExpression(legacyColumns, ['new_memory_hash'], 'NULL')},
      ${getFirstAvailableColumnExpression(legacyColumns, ['new_memory_id'], 'NULL')},
      ${getFirstAvailableColumnExpression(legacyColumns, ['existing_memory_id'], 'NULL')},
      ${getFirstAvailableColumnExpression(legacyColumns, ['similarity', 'similarity_score'], 'NULL')},
      ${getFirstAvailableColumnExpression(legacyColumns, ['reason', 'notes'], 'NULL')},
      ${getFirstAvailableColumnExpression(legacyColumns, ['new_content_preview'], 'NULL')},
      ${getFirstAvailableColumnExpression(legacyColumns, ['existing_content_preview'], 'NULL')},
      ${getFirstAvailableColumnExpression(legacyColumns, ['contradiction_detected'], '0')},
      ${getFirstAvailableColumnExpression(legacyColumns, ['contradiction_type'], 'NULL')},
      ${getFirstAvailableColumnExpression(legacyColumns, ['spec_folder'], 'NULL')},
      ${getFirstAvailableColumnExpression(legacyColumns, ['created_at', 'timestamp'], 'CURRENT_TIMESTAMP')}
    FROM memory_conflicts_legacy
  `);
  database.exec('DROP TABLE memory_conflicts_legacy');

  if (!hasUnifiedMemoryConflictsTable(database)) {
    throw new Error('Migration v12: memory_conflicts table is still missing unified columns after rebuild');
  }
}

function summarizeCompatibilityFailures(report: SchemaCompatibilityReport): string {
  const details: string[] = [];

  if (report.missingTables.length > 0) {
    details.push(`missing tables: ${report.missingTables.join(', ')}`);
  }
  if (Object.keys(report.missingColumns).length > 0) {
    const missingColumns = Object.entries(report.missingColumns)
      .map(([tableName, columns]) => `${tableName}[${columns.join(', ')}]`)
      .join('; ');
    details.push(`missing columns: ${missingColumns}`);
  }
  if (report.missingIndexes.length > 0) {
    details.push(`missing indexes: ${report.missingIndexes.join(', ')}`);
  }
  if (report.constraintMismatches.length > 0) {
    details.push(`constraint mismatches: ${report.constraintMismatches.join(', ')}`);
  }

  return details.join(' | ');
}

function logDuplicateColumnMigrationSkip(columnName: string, error: unknown): void {
  logger.warn(`Migration skipped existing ${columnName} column`, {
    error: error instanceof Error ? error.message : String(error),
  });
}

function ensureIncrementalIndexFoundationSchema(database: Database.Database, context: string): void {
  database.exec(`
    CREATE TABLE IF NOT EXISTS memoization_records (
      component_path TEXT NOT NULL,
      input_fingerprint TEXT NOT NULL,
      code_hash TEXT NOT NULL,
      output_blob TEXT NOT NULL,
      computed_at TEXT NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (component_path, input_fingerprint, code_hash)
    )
  `);

  database.exec(`
    CREATE TABLE IF NOT EXISTS dependency_edges (
      parent_path TEXT NOT NULL,
      child_path TEXT NOT NULL,
      kind TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (parent_path, child_path, kind),
      CHECK(parent_path != child_path)
    )
  `);

  createRequiredIndex(
    database,
    'idx_memoization_records_component',
    'CREATE INDEX IF NOT EXISTS idx_memoization_records_component ON memoization_records(component_path)',
    context,
  );
  createRequiredIndex(
    database,
    'idx_dependency_edges_parent',
    'CREATE INDEX IF NOT EXISTS idx_dependency_edges_parent ON dependency_edges(parent_path)',
    context,
  );
  createRequiredIndex(
    database,
    'idx_dependency_edges_child',
    'CREATE INDEX IF NOT EXISTS idx_dependency_edges_child ON dependency_edges(child_path)',
    context,
  );
  createRequiredIndex(
    database,
    'idx_dependency_edges_kind',
    'CREATE INDEX IF NOT EXISTS idx_dependency_edges_kind ON dependency_edges(kind)',
    context,
  );
}

function ensureMemoryChunkMetadataColumns(database: Database.Database, context: string): void {
  if (!hasTable(database, 'memory_index')) {
    logger.warn(`${context}: memory_index missing; skipping chunk metadata columns`);
    return;
  }

  const columns = new Set(getTableColumns(database, 'memory_index'));
  const chunkColumns: Array<{ name: string; sql: string }> = [
    { name: 'chunk_id', sql: 'ALTER TABLE memory_index ADD COLUMN chunk_id TEXT' },
    { name: 'chunk_fingerprint', sql: 'ALTER TABLE memory_index ADD COLUMN chunk_fingerprint TEXT' },
    { name: 'chunk_kind', sql: 'ALTER TABLE memory_index ADD COLUMN chunk_kind TEXT' },
    { name: 'chunk_start_line', sql: 'ALTER TABLE memory_index ADD COLUMN chunk_start_line INTEGER' },
    { name: 'chunk_end_line', sql: 'ALTER TABLE memory_index ADD COLUMN chunk_end_line INTEGER' },
  ];

  for (const column of chunkColumns) {
    if (columns.has(column.name)) {
      continue;
    }
    try {
      database.exec(column.sql);
      columns.add(column.name);
      logger.info(`${context}: Added memory_index.${column.name}`);
    } catch (error: unknown) {
      if (!get_error_message(error).includes('duplicate column')) {
        throw error;
      }
      logDuplicateColumnMigrationSkip(column.name, error);
    }
  }

  createRequiredIndex(database, 'idx_memory_chunk_identity', MEMORY_CHUNK_IDENTITY_INDEX_SQL, context);
  createRequiredIndex(database, 'idx_memory_chunk_fingerprint', MEMORY_CHUNK_FINGERPRINT_INDEX_SQL, context);
}

function getMigrationAllowedBasePaths(): string[] {
  const workspaceRoot = process.cwd();
  const envPaths = process.env.MEMORY_ALLOWED_PATHS
    ? process.env.MEMORY_ALLOWED_PATHS.split(path.delimiter)
    : [];

  return Array.from(new Set([
    ...getSpecsBasePaths(workspaceRoot),
    path.join(workspaceRoot, '.opencode'),
    path.join(os.homedir(), '.claude'),
    workspaceRoot,
    ...envPaths,
  ].filter(Boolean).map((basePath) => path.resolve(basePath))));
}

// Schema version for migration tracking
// Added memory_type column for type-specific half-lives
// Added file_mtime_ms for incremental indexing fast-path
// Added 'partial' embedding_status for deferred indexing
// Added causal_edges table for Causal Memory Graph
// Added memory_corrections table for learning from corrections
// V10: Schema consolidation and index optimization
// V11: Error code deduplication and validation improvements
// V12: Unified memory_conflicts DDL
// V13: Add document_type and spec_level columns for full spec folder document indexing
// V14: Add content_text column + FTS5 rebuild for BM25 full-text search across restarts
// V15: Add quality_score and quality_flags columns for memory quality gates
// V16: Add parent_id column for chunked indexing of large files
// V17: Add interference_score column
// V18: the rollout — weight_history table + causal_edges provenance + encoding_intent column
// V19: degree_snapshots + community_assignments (N2 graph centrality)
// V20: memory_summaries + memory_entities + entity_catalog
// V21: Add learned_triggers column (learned feedback)
// V22: Step 2 memory lineage tables + active projection support
// V23: One-time spec_folder re-canonicalization + session_state migration
// V24: Add trigger-cache source and temporal contiguity indexes
// V30: Add post-insert enrichment completion markers
// V31: Add incremental-index memo tables and chunk metadata
// V32: Add causal edge tombstone audit table
// V33: Add generated causal-edge provenance columns
// V34: Add derived trigger embedding status table
// V35: Add server-derived write provenance kind
// V36: Add idempotency receipts and near-duplicate markers
// V37: Add tombstone column and active/purgeable memory partitions
// V38: Add bi-temporal window columns for causal edges and memory lineage
// V39: Add causal-edge closure-provenance marker (open-edge index ensured at runtime)
// V40: Add content-addressed generated causal-edge identity
// V41: Add retention-forgetting and semantic-edge substrate support
/** Current schema version for vector-index migrations. */
export const SCHEMA_VERSION = 41;

const SOURCE_KIND_COLUMN_SQL = "ALTER TABLE memory_index ADD COLUMN source_kind TEXT NOT NULL DEFAULT 'system' CHECK(source_kind IN ('human', 'agent', 'system', 'import', 'feedback'))";
const MEMORY_IDEMPOTENCY_RECEIPTS_OPERATION_INDEX_SQL = `
  CREATE INDEX IF NOT EXISTS idx_memory_idempotency_receipts_operation
  ON memory_idempotency_receipts(operation, created_at DESC)
`;

const CAUSAL_EDGE_BITEMPORAL_COLUMNS: ReadonlyArray<{ name: string; sql: string }> = [
  { name: 'valid_from', sql: 'ALTER TABLE causal_edges ADD COLUMN valid_from TEXT' },
  { name: 'valid_to', sql: 'ALTER TABLE causal_edges ADD COLUMN valid_to TEXT' },
  { name: 'ingested_at', sql: 'ALTER TABLE causal_edges ADD COLUMN ingested_at TEXT' },
  { name: 'expired_at', sql: 'ALTER TABLE causal_edges ADD COLUMN expired_at TEXT' },
];
const MEMORY_LINEAGE_BITEMPORAL_COLUMNS: ReadonlyArray<{ name: string; sql: string }> = [
  { name: 'ingested_at', sql: 'ALTER TABLE memory_lineage ADD COLUMN ingested_at TEXT' },
  { name: 'expired_at', sql: 'ALTER TABLE memory_lineage ADD COLUMN expired_at TEXT' },
];

// Records how a causal edge was retired so the lineage canonical supersede
// writer and the derived causal projection reconcile to one source of truth
// instead of forking: 'lineage' (canonical), 'direct' (local close, e.g.
// contradiction auto-invalidation), or 'legacy' (closed before this marker).
// NULL on open edges, so the marker always agrees with edge presence.
const CAUSAL_EDGE_CURRENTNESS_COLUMN: { name: string; sql: string } = {
  name: 'invalidation_source',
  sql: 'ALTER TABLE causal_edges ADD COLUMN invalidation_source TEXT',
};
// The open-edge currentness index is created at runtime by temporal-edges,
// where invalid_at is guaranteed present; the migration teardown drops it by
// name so a rollback leaves no trace of the currentness feature.
const CAUSAL_EDGE_OPEN_CURRENTNESS_INDEX = 'idx_causal_edges_open_currentness';
const CAUSAL_EDGE_DERIVED_ID_COLUMN: { name: string; sql: string } = {
  name: 'derived_id',
  sql: 'ALTER TABLE causal_edges ADD COLUMN derived_id TEXT',
};
const CAUSAL_EDGE_DERIVED_ID_INDEX = 'idx_causal_edges_derived_id';
const CAUSAL_EDGE_DERIVED_ID_INDEX_SQL = `
  CREATE UNIQUE INDEX IF NOT EXISTS idx_causal_edges_derived_id
  ON causal_edges(derived_id)
  WHERE derived_id IS NOT NULL
`;
const CAUSAL_EDGE_RETENTION_INCOMING_INDEX = 'idx_causal_edges_retention_incoming';
const CAUSAL_EDGE_RETENTION_INCOMING_INDEX_SQL = `
  CREATE INDEX IF NOT EXISTS idx_causal_edges_retention_incoming
  ON causal_edges(target_id, relation, source_id)
`;
const RETENTION_TRUST_SCORE_COLUMN: { name: string; sql: string } = {
  name: 'retention_trust_score',
  sql: 'ALTER TABLE memory_index ADD COLUMN retention_trust_score REAL',
};
const CAUSAL_EDGE_FACT_TEXT_COLUMN: { name: string; sql: string } = {
  name: 'fact_text',
  sql: 'ALTER TABLE causal_edges ADD COLUMN fact_text TEXT',
};
const EDGE_VECTOR_EMBEDDINGS_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS edge_vector_embeddings (
    edge_id INTEGER NOT NULL,
    profile_key TEXT NOT NULL DEFAULT 'default',
    input_kind TEXT NOT NULL DEFAULT 'edge' CHECK(input_kind IN ('edge')),
    model_id TEXT NOT NULL,
    dimensions INTEGER NOT NULL,
    embedding BLOB,
    embedding_status TEXT NOT NULL DEFAULT 'pending' CHECK(embedding_status IN ('pending', 'ready', 'failed')),
    failure_reason TEXT,
    fact_hash TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (edge_id, profile_key, input_kind, model_id, dimensions),
    FOREIGN KEY(edge_id) REFERENCES causal_edges(id) ON DELETE CASCADE
  )
`;
const EDGE_VECTOR_EMBEDDINGS_STATUS_INDEX = 'idx_edge_vector_embeddings_status';
const EDGE_VECTOR_EMBEDDINGS_STATUS_INDEX_SQL = `
  CREATE INDEX IF NOT EXISTS idx_edge_vector_embeddings_status
  ON edge_vector_embeddings(embedding_status, updated_at)
`;
const EDGE_VECTOR_EMBEDDINGS_EDGE_INDEX = 'idx_edge_vector_embeddings_edge';
const EDGE_VECTOR_EMBEDDINGS_EDGE_INDEX_SQL = `
  CREATE INDEX IF NOT EXISTS idx_edge_vector_embeddings_edge
  ON edge_vector_embeddings(edge_id)
`;

function addColumnIfMissing(
  database: Database.Database,
  tableName: string,
  columns: Set<string>,
  column: { name: string; sql: string },
  context: string,
): void {
  if (columns.has(column.name)) {
    return;
  }
  try {
    database.exec(column.sql);
    columns.add(column.name);
    logger.info(`${context}: Added ${tableName}.${column.name}`);
  } catch (error: unknown) {
    if (!get_error_message(error).includes('duplicate column')) {
      throw error;
    }
    logDuplicateColumnMigrationSkip(column.name, error);
  }
}

export function ensureIdempotencyReceiptSchema(database: Database.Database, context: string): void {
  database.exec(`
    CREATE TABLE IF NOT EXISTS memory_idempotency_receipts (
      receipt_key TEXT PRIMARY KEY,
      operation TEXT NOT NULL,
      content_hash TEXT,
      request_fingerprint TEXT NOT NULL,
      payload_hash TEXT NOT NULL,
      response_payload TEXT NOT NULL,
      memory_id INTEGER,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (memory_id) REFERENCES memory_index(id) ON DELETE SET NULL
    )
  `);
  createRequiredIndex(
    database,
    'idx_memory_idempotency_receipts_operation',
    MEMORY_IDEMPOTENCY_RECEIPTS_OPERATION_INDEX_SQL,
    context,
  );

  if (!hasTable(database, 'memory_index')) {
    logger.warn(`${context}: memory_index missing; skipping near-duplicate columns`);
    return;
  }

  const columns = new Set(getTableColumns(database, 'memory_index'));
  addColumnIfMissing(
    database,
    'memory_index',
    columns,
    { name: 'delete_after', sql: 'ALTER TABLE memory_index ADD COLUMN delete_after TEXT' },
    context,
  );
  addColumnIfMissing(
    database,
    'memory_index',
    columns,
    { name: 'near_duplicate_of', sql: 'ALTER TABLE memory_index ADD COLUMN near_duplicate_of TEXT' },
    context,
  );
  addColumnIfMissing(
    database,
    'memory_index',
    columns,
    { name: 'last_dedup_checked_at', sql: 'ALTER TABLE memory_index ADD COLUMN last_dedup_checked_at TEXT' },
    context,
  );
}

export function ensureMemoryIndexTombstonePartitions(database: Database.Database, context: string): void {
  if (!hasTable(database, 'memory_index')) {
    logger.warn(`${context}: memory_index missing; skipping tombstone partitions`);
    return;
  }

  const columns = new Set(getTableColumns(database, 'memory_index'));
  addColumnIfMissing(
    database,
    'memory_index',
    columns,
    { name: 'deleted_at', sql: 'ALTER TABLE memory_index ADD COLUMN deleted_at TEXT' },
    context,
  );
  createRequiredIndex(database, 'idx_memory_active_recall', MEMORY_ACTIVE_RECALL_INDEX_SQL, context);
  createRequiredIndex(database, 'idx_memory_purgeable_retention', MEMORY_PURGEABLE_RETENTION_INDEX_SQL, context);
}

function requireTableForMigration(database: Database.Database, tableName: string, context: string): void {
  if (!hasTable(database, tableName)) {
    throw new Error(`${context}: required table "${tableName}" is missing`);
  }
}

function requireColumnsForMigration(
  database: Database.Database,
  tableName: string,
  requiredColumns: readonly string[],
  context: string,
): void {
  const columns = new Set(getTableColumns(database, tableName));
  const missing = requiredColumns.filter((columnName) => !columns.has(columnName));
  if (missing.length > 0) {
    throw new Error(`${context}: ${tableName} missing required column(s): ${missing.join(', ')}`);
  }
}

function dropColumnIfPresent(
  database: Database.Database,
  tableName: string,
  columnName: string,
  context: string,
): void {
  if (!hasTable(database, tableName)) {
    return;
  }
  const columns = new Set(getTableColumns(database, tableName));
  if (!columns.has(columnName)) {
    return;
  }
  database.exec(`ALTER TABLE ${tableName} DROP COLUMN ${columnName}`);
  if (getTableColumns(database, tableName).includes(columnName)) {
    throw new Error(`${context}: ${tableName}.${columnName} still exists after rollback`);
  }
}

/**
 * Backfill the event-time and transaction-time windows from legacy timestamps.
 */
export function backfillBitemporalWindow(database: Database.Database, context: string = 'bitemporal window backfill'): void {
  requireTableForMigration(database, 'causal_edges', context);
  requireTableForMigration(database, MEMORY_LINEAGE_TABLE, context);
  requireColumnsForMigration(
    database,
    'causal_edges',
    ['valid_from', 'valid_to', 'ingested_at', 'expired_at', 'extracted_at'],
    context,
  );
  requireColumnsForMigration(
    database,
    MEMORY_LINEAGE_TABLE,
    ['valid_from', 'valid_to', 'ingested_at', 'expired_at', 'created_at'],
    context,
  );

  const causalColumns = new Set(getTableColumns(database, 'causal_edges'));
  const causalValidFromExpr = causalColumns.has('valid_at')
    ? "COALESCE(valid_from, valid_at, extracted_at, datetime('now'))"
    : "COALESCE(valid_from, extracted_at, datetime('now'))";
  const causalValidToExpr = causalColumns.has('invalid_at')
    ? 'COALESCE(valid_to, invalid_at)'
    : 'valid_to';
  const causalExpiredAtExpr = causalColumns.has('invalid_at')
    ? 'COALESCE(expired_at, invalid_at)'
    : 'expired_at';
  const causalInvalidatedWhere = causalColumns.has('invalid_at')
    ? ' OR (valid_to IS NULL AND invalid_at IS NOT NULL) OR (expired_at IS NULL AND invalid_at IS NOT NULL)'
    : '';

  database.exec(`
    UPDATE causal_edges
    SET valid_from = ${causalValidFromExpr},
        valid_to = ${causalValidToExpr},
        ingested_at = COALESCE(ingested_at, extracted_at, datetime('now')),
        expired_at = ${causalExpiredAtExpr}
    WHERE valid_from IS NULL
       OR ingested_at IS NULL
       ${causalInvalidatedWhere}
  `);

  database.exec(`
    UPDATE memory_lineage
    SET ingested_at = COALESCE(ingested_at, created_at, valid_from, datetime('now')),
        expired_at = COALESCE(expired_at, valid_to)
    WHERE ingested_at IS NULL
       OR (expired_at IS NULL AND valid_to IS NOT NULL)
  `);
}

/**
 * Add the shared four-timestamp window and backfill legacy rows.
 */
export function ensureBitemporalWindowSchema(database: Database.Database, context: string): void {
  requireTableForMigration(database, 'causal_edges', context);
  ensureLineageTables(database);

  const causalColumns = new Set(getTableColumns(database, 'causal_edges'));
  for (const column of CAUSAL_EDGE_BITEMPORAL_COLUMNS) {
    addColumnIfMissing(database, 'causal_edges', causalColumns, column, context);
  }

  const lineageColumns = new Set(getTableColumns(database, MEMORY_LINEAGE_TABLE));
  for (const column of MEMORY_LINEAGE_BITEMPORAL_COLUMNS) {
    addColumnIfMissing(database, MEMORY_LINEAGE_TABLE, lineageColumns, column, context);
  }

  backfillBitemporalWindow(database, context);
}

/**
 * Roll back only the four columns introduced by the bi-temporal window migration.
 */
export function rollbackBitemporalWindowSchema(database: Database.Database, context: string = 'bitemporal window rollback'): void {
  for (const column of ['expired_at', 'ingested_at', 'valid_to', 'valid_from']) {
    dropColumnIfPresent(database, 'causal_edges', column, context);
  }
  for (const column of ['expired_at', 'ingested_at']) {
    dropColumnIfPresent(database, MEMORY_LINEAGE_TABLE, column, context);
  }
}

/**
 * Backfill closure provenance for causal edges retired before the marker
 * existed. A closed edge (invalid_at present) with no marker is stamped
 * 'legacy' — its original provenance (lineage canonical vs a direct local
 * close) cannot be recovered after the fact — while open edges keep a NULL
 * marker so the marker always agrees with edge presence. A no-op until the
 * retirement column (invalid_at) is present, since temporal edges add it at
 * runtime; without it there is no closed-edge concept to reconcile.
 */
export function backfillEdgePresenceCurrentness(
  database: Database.Database,
  context: string = 'edge-presence currentness backfill',
): void {
  requireTableForMigration(database, 'causal_edges', context);
  requireColumnsForMigration(database, 'causal_edges', ['invalidation_source'], context);

  const causalColumns = new Set(getTableColumns(database, 'causal_edges'));
  if (!causalColumns.has('invalid_at')) {
    return;
  }

  database.exec(`
    UPDATE causal_edges
    SET invalidation_source = 'legacy'
    WHERE invalid_at IS NOT NULL AND invalidation_source IS NULL
  `);
}

/**
 * Add the causal-edge closure-provenance marker, then backfill legacy closures.
 * Additive and idempotent. The supporting open-edge index is owned by the
 * temporal-edges runtime convergence (where invalid_at is guaranteed present),
 * so a fresh database — which has no invalid_at column when this migration runs
 * — does not attempt to build a partial index over a missing column.
 */
export function ensureEdgePresenceCurrentnessSchema(database: Database.Database, context: string): void {
  requireTableForMigration(database, 'causal_edges', context);

  const causalColumns = new Set(getTableColumns(database, 'causal_edges'));
  addColumnIfMissing(database, 'causal_edges', causalColumns, CAUSAL_EDGE_CURRENTNESS_COLUMN, context);

  backfillEdgePresenceCurrentness(database, context);
}

/**
 * Roll back the closure-provenance marker and its supporting open-edge index,
 * preserving the v38 window columns and legacy valid_at/invalid_at.
 */
export function rollbackEdgePresenceCurrentnessSchema(
  database: Database.Database,
  context: string = 'edge-presence currentness rollback',
): void {
  database.exec(`DROP INDEX IF EXISTS ${CAUSAL_EDGE_OPEN_CURRENTNESS_INDEX}`);
  dropColumnIfPresent(database, 'causal_edges', 'invalidation_source', context);
}

interface DerivedCausalEdgeRow {
  id: number;
  source_id: string;
  target_id: string;
  source_anchor: string | null;
  target_anchor: string | null;
  relation: string;
  created_by: string | null;
  extraction_method: string | null;
}

export interface DerivedIdProvenanceBackfillResult {
  scanned: number;
  backfilled: number;
  duplicatesSkipped: number;
}

function normalizeDerivedEdgeSource(row: Pick<DerivedCausalEdgeRow, 'created_by' | 'extraction_method'>): string {
  const extractionMethod = typeof row.extraction_method === 'string' ? row.extraction_method.trim() : '';
  const createdBy = typeof row.created_by === 'string' ? row.created_by.trim() : '';
  if (extractionMethod.length > 0 && extractionMethod !== 'manual') {
    return extractionMethod;
  }
  return createdBy.length > 0 ? createdBy : 'auto';
}

function selectDerivedCausalEdges(database: Database.Database, columns: Set<string>): DerivedCausalEdgeRow[] {
  const optionalColumn = (columnName: string): string => (
    columns.has(columnName) ? columnName : `NULL AS ${columnName}`
  );

  return database.prepare(`
    SELECT
      id,
      source_id,
      target_id,
      ${optionalColumn('source_anchor')},
      ${optionalColumn('target_anchor')},
      relation,
      created_by,
      ${optionalColumn('extraction_method')}
    FROM causal_edges
    WHERE derived_id IS NULL
      AND (created_by = 'auto' OR created_by LIKE 'auto-%')
    ORDER BY id ASC
  `).all() as DerivedCausalEdgeRow[];
}

function clearDuplicateDerivedIdsBeforeUniqueIndex(database: Database.Database, context: string): void {
  const result = database.prepare(`
    UPDATE causal_edges
    SET derived_id = NULL
    WHERE id IN (
      SELECT id FROM (
        SELECT id,
               ROW_NUMBER() OVER (
                 PARTITION BY derived_id
                 ORDER BY id ASC
               ) AS rn
        FROM causal_edges
        WHERE derived_id IS NOT NULL AND TRIM(derived_id) != ''
      )
      WHERE rn > 1
    )
  `).run() as { changes: number };

  if (result.changes > 0) {
    logger.warn(`${context}: cleared ${result.changes} duplicate generated causal-edge derived id(s) before building the unique index`);
  }
}

/**
 * Backfill generated causal-edge identities from already-stored canonical fields.
 */
export function backfillDerivedCausalEdgeIds(
  database: Database.Database,
  context: string = 'derived-id provenance backfill',
): DerivedIdProvenanceBackfillResult {
  requireTableForMigration(database, 'causal_edges', context);
  requireColumnsForMigration(database, 'causal_edges', ['derived_id', 'source_id', 'target_id', 'relation'], context);

  const columns = new Set(getTableColumns(database, 'causal_edges'));
  if (!columns.has('created_by')) {
    return { scanned: 0, backfilled: 0, duplicatesSkipped: 0 };
  }

  const existingDerivedIds = new Set(
    (database.prepare(`
      SELECT derived_id
      FROM causal_edges
      WHERE derived_id IS NOT NULL AND TRIM(derived_id) != ''
    `).all() as Array<{ derived_id: string }>)
      .map((row) => row.derived_id),
  );
  const update = database.prepare('UPDATE causal_edges SET derived_id = ? WHERE id = ? AND derived_id IS NULL');
  let backfilled = 0;
  let duplicatesSkipped = 0;
  const rows = selectDerivedCausalEdges(database, columns);

  for (const row of rows) {
    const derivedId = deriveCausalEdgeDerivedId({
      sourceId: row.source_id,
      targetId: row.target_id,
      relation: row.relation,
      sourceAnchor: row.source_anchor,
      targetAnchor: row.target_anchor,
      source: normalizeDerivedEdgeSource(row),
      ruleVersion: LEGACY_DERIVED_CAUSAL_EDGE_RULE_VERSION,
    });

    if (existingDerivedIds.has(derivedId)) {
      duplicatesSkipped++;
      continue;
    }

    const result = update.run(derivedId, row.id) as { changes: number };
    if (result.changes > 0) {
      backfilled++;
      existingDerivedIds.add(derivedId);
    }
  }

  if (duplicatesSkipped > 0) {
    logger.warn(`${context}: left ${duplicatesSkipped} duplicate generated causal-edge row(s) without derived_id`);
  }

  return { scanned: rows.length, backfilled, duplicatesSkipped };
}

/**
 * Add generated causal-edge identity storage and its uniqueness guard.
 */
export function ensureDerivedIdProvenanceSchema(database: Database.Database, context: string): DerivedIdProvenanceBackfillResult {
  requireTableForMigration(database, 'causal_edges', context);

  const causalColumns = new Set(getTableColumns(database, 'causal_edges'));
  addColumnIfMissing(database, 'causal_edges', causalColumns, CAUSAL_EDGE_DERIVED_ID_COLUMN, context);

  const result = backfillDerivedCausalEdgeIds(database, context);
  clearDuplicateDerivedIdsBeforeUniqueIndex(database, context);
  createRequiredIndex(
    database,
    CAUSAL_EDGE_DERIVED_ID_INDEX,
    CAUSAL_EDGE_DERIVED_ID_INDEX_SQL,
    context,
  );
  return result;
}

/**
 * Roll back only the generated causal-edge identity column and unique index.
 */
export function rollbackDerivedIdProvenanceSchema(
  database: Database.Database,
  context: string = 'derived-id provenance rollback',
): void {
  database.exec(`DROP INDEX IF EXISTS ${CAUSAL_EDGE_DERIVED_ID_INDEX}`);
  dropColumnIfPresent(database, 'causal_edges', 'derived_id', context);
}

export function backfillRetentionTrustScores(
  database: Database.Database,
  context: string = 'retention trust backfill',
): number {
  requireTableForMigration(database, 'memory_index', context);
  requireColumnsForMigration(database, 'memory_index', ['retention_trust_score', 'quality_score'], context);

  const result = database.prepare(`
    UPDATE memory_index
    SET retention_trust_score = quality_score
    WHERE retention_trust_score IS NULL
      AND quality_score IS NOT NULL
      AND typeof(quality_score) IN ('integer', 'real')
  `).run();
  return result.changes;
}

export function ensureRetentionForgettingSchema(database: Database.Database, context: string): void {
  if (hasTable(database, 'memory_index')) {
    const columns = new Set(getTableColumns(database, 'memory_index'));
    addColumnIfMissing(database, 'memory_index', columns, RETENTION_TRUST_SCORE_COLUMN, context);
    if (columns.has('quality_score')) {
      const backfilled = backfillRetentionTrustScores(database, context);
      if (backfilled > 0) {
        logger.info(`${context}: Backfilled retention trust score for ${backfilled} memory row(s)`);
      }
    }
  }

  if (hasTable(database, 'causal_edges')) {
    createRequiredIndex(
      database,
      CAUSAL_EDGE_RETENTION_INCOMING_INDEX,
      CAUSAL_EDGE_RETENTION_INCOMING_INDEX_SQL,
      context,
    );
  }
}

export function rollbackRetentionForgettingSchema(
  database: Database.Database,
  context: string = 'retention forgetting rollback',
): void {
  if (hasTable(database, 'causal_edges')) {
    database.exec(`DROP INDEX IF EXISTS ${CAUSAL_EDGE_RETENTION_INCOMING_INDEX}`);
  }
  if (hasTable(database, 'memory_index')) {
    dropColumnIfPresent(database, 'memory_index', 'retention_trust_score', context);
  }
}

export function backfillCausalEdgeFactText(
  database: Database.Database,
  context: string = 'semantic edge fact-text backfill',
): number {
  requireTableForMigration(database, 'causal_edges', context);
  requireColumnsForMigration(database, 'causal_edges', ['fact_text', 'source_id', 'target_id', 'relation'], context);

  const hasEvidence = getTableColumns(database, 'causal_edges').includes('evidence');
  const factExpression = hasEvidence
    ? "COALESCE(NULLIF(TRIM(CAST(evidence AS text)), ''), source_id || ' ' || relation || ' ' || target_id)"
    : "source_id || ' ' || relation || ' ' || target_id";
  const result = database.prepare(`
    UPDATE causal_edges
    SET fact_text = ${factExpression}
    WHERE fact_text IS NULL OR TRIM(CAST(fact_text AS text)) = ''
  `).run();
  return result.changes;
}

export function ensureSemanticEdgeLayerSchema(database: Database.Database, context: string): void {
  if (hasTable(database, 'causal_edges')) {
    const columns = new Set(getTableColumns(database, 'causal_edges'));
    addColumnIfMissing(database, 'causal_edges', columns, CAUSAL_EDGE_FACT_TEXT_COLUMN, context);
    const backfilled = backfillCausalEdgeFactText(database, context);
    if (backfilled > 0) {
      logger.info(`${context}: Backfilled fact text for ${backfilled} causal edge row(s)`);
    }

    database.exec(EDGE_VECTOR_EMBEDDINGS_TABLE_SQL);
    createRequiredIndex(
      database,
      EDGE_VECTOR_EMBEDDINGS_STATUS_INDEX,
      EDGE_VECTOR_EMBEDDINGS_STATUS_INDEX_SQL,
      context,
    );
    createRequiredIndex(
      database,
      EDGE_VECTOR_EMBEDDINGS_EDGE_INDEX,
      EDGE_VECTOR_EMBEDDINGS_EDGE_INDEX_SQL,
      context,
    );
  }
}

export function rollbackSemanticEdgeLayerSchema(
  database: Database.Database,
  context: string = 'semantic edge layer rollback',
): void {
  database.exec('DROP TABLE IF EXISTS edge_vector_embeddings');
  if (hasTable(database, 'causal_edges')) {
    dropColumnIfPresent(database, 'causal_edges', 'fact_text', context);
  }
}

function sourceKindFromProvenanceSource(value: unknown): 'human' | 'agent' | 'system' | 'import' | 'feedback' {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return 'system';
  }

  const normalized = value.trim().toLowerCase();
  if (/\b(human|manual|user|operator|author)\b/.test(normalized)) {
    return 'human';
  }
  if (normalized.includes('feedback') || normalized.includes('validate') || normalized.includes('validation')) {
    return 'feedback';
  }
  if (normalized.includes('import') || normalized.includes('ingest') || normalized.includes('scan') || normalized.includes('index')) {
    return 'import';
  }
  if (/\b(agent|assistant|claude|codex|opencode|automation|bot)\b/.test(normalized)) {
    return 'agent';
  }
  return 'system';
}

function ensureMemoryIndexSourceKindColumn(database: Database.Database, context: string): void {
  if (!hasTable(database, 'memory_index')) {
    logger.warn(`${context}: memory_index missing; skipping source_kind column`);
    return;
  }

  const columns = new Set(getTableColumns(database, 'memory_index'));
  if (!columns.has('source_kind')) {
    try {
      database.exec(SOURCE_KIND_COLUMN_SQL);
      columns.add('source_kind');
      logger.info(`${context}: Added memory_index.source_kind`);
    } catch (error: unknown) {
      if (!get_error_message(error).includes('duplicate column')) {
        throw error;
      }
      logDuplicateColumnMigrationSkip('source_kind', error);
    }
  }

  if (columns.has('provenance_source')) {
    const rows = database.prepare(`
      SELECT id, provenance_source
      FROM memory_index
      WHERE source_kind IS NULL OR TRIM(source_kind) = ''
        OR source_kind NOT IN ('human', 'agent', 'system', 'import', 'feedback')
        OR (source_kind = 'system' AND provenance_source IS NOT NULL AND TRIM(provenance_source) != '')
    `).all() as Array<{ id: number; provenance_source: string | null }>;
    const update = database.prepare('UPDATE memory_index SET source_kind = ? WHERE id = ?');
    for (const row of rows) {
      update.run(sourceKindFromProvenanceSource(row.provenance_source), row.id);
    }
  } else {
    database.prepare(`
      UPDATE memory_index
      SET source_kind = 'system'
      WHERE source_kind IS NULL OR TRIM(source_kind) = ''
        OR source_kind NOT IN ('human', 'agent', 'system', 'import', 'feedback')
    `).run();
  }
}

function ensureCausalEdgeProvenanceColumns(database: Database.Database, context: string): void {
  if (!hasTable(database, 'causal_edges')) {
    logger.warn(`${context}: causal_edges missing; skipping generated-edge provenance columns`);
    return;
  }

  const columns = new Set(getTableColumns(database, 'causal_edges'));
  for (const column of CAUSAL_EDGE_PROVENANCE_COLUMNS) {
    if (columns.has(column.name)) {
      continue;
    }
    try {
      database.exec(column.sql);
      columns.add(column.name);
      logger.info(`${context}: Added causal_edges.${column.name}`);
    } catch (error: unknown) {
      if (!get_error_message(error).includes('duplicate column')) {
        throw error;
      }
      logDuplicateColumnMigrationSkip(column.name, error);
    }
  }
}

export function ensureMemoryTriggerEmbeddingsSchema(database: Database.Database, context: string): void {
  database.exec(`
    CREATE TABLE IF NOT EXISTS memory_trigger_embeddings (
      memory_id INTEGER NOT NULL,
      phrase_hash TEXT NOT NULL,
      profile_key TEXT NOT NULL,
      input_kind TEXT NOT NULL DEFAULT 'document' CHECK(input_kind IN ('document', 'query')),
      model_id TEXT NOT NULL,
      dimensions INTEGER NOT NULL,
      embedding_status TEXT NOT NULL DEFAULT 'pending' CHECK(embedding_status IN ('pending', 'ready', 'failed')),
      failure_reason TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (memory_id, phrase_hash, profile_key, input_kind),
      FOREIGN KEY (memory_id) REFERENCES memory_index(id) ON DELETE CASCADE
    )
  `);

  createRequiredIndex(
    database,
    'idx_memory_trigger_embeddings_status',
    MEMORY_TRIGGER_EMBEDDINGS_STATUS_INDEX_SQL,
    context,
  );
}

/**
 * Deprecate-before-create pre-pass for the active-row logical-key unique index.
 *
 * A pre-existing database can already hold duplicate active rows for one logical key
 * (e.g. created before the supersede-on-reindex guard existed). Creating the UNIQUE
 * index over those rows throws, and since all migrations share one transaction, the
 * whole upgrade batch rolls back and the schema wedges. To advance safely we retire the
 * duplicates first — deprecate, never delete — by setting the losers' importance_tier to
 * 'deprecated' (the same retirement the runtime reindex guard uses), which removes them
 * from the partial index predicate so the UNIQUE index can be built. Within each duplicate
 * group the winner is the highest importance tier, then the most recently updated row.
 *
 * Grouping mirrors the index exactly. Tolerant when a scope/anchor column is absent on an
 * older schema (the group key falls back to the empty string for the missing column, the
 * same as the index's COALESCE), and a no-op when the table or needed columns are missing.
 */
function deprecateDuplicateActiveLogicalKeysBeforeUniqueIndex(database: Database.Database): void {
  if (!hasTable(database, 'memory_index')) {
    return;
  }

  const columns = new Set(getTableColumns(database, 'memory_index'));
  // canonical_file_path / file_path and importance_tier are required to form the key and
  // pick a winner; without them this DB predates the guarded schema and there is nothing
  // to reconcile here.
  if (!columns.has('importance_tier') || (!columns.has('canonical_file_path') && !columns.has('file_path'))) {
    return;
  }

  // Build per-column key fragments that match the index's COALESCE expressions, degrading
  // to a literal '' for columns this older schema does not have (so the key shape is stable).
  const pathExpr = columns.has('canonical_file_path')
    ? "COALESCE(NULLIF(canonical_file_path, ''), file_path)"
    : 'file_path';
  const anchorExpr = columns.has('anchor_id')
    ? "COALESCE(NULLIF(TRIM(anchor_id), ''), '_')"
    : "'_'";
  const scopeExpr = (col: string): string => (columns.has(col) ? `COALESCE(${col}, '')` : "''");

  const keyExpr = [
    'spec_folder',
    pathExpr,
    anchorExpr,
    scopeExpr('tenant_id'),
    scopeExpr('user_id'),
    scopeExpr('agent_id'),
    scopeExpr('session_id'),
  ].join(" || '\\u0000' || ");

  // Active = the same predicate the unique index uses (excludes constitutional + deprecated).
  const activePredicate = "COALESCE(importance_tier, 'normal') NOT IN ('constitutional', 'deprecated')";

  // Tier rank mirrors IMPORTANCE_TIERS values so the highest-priority active row wins.
  const tierRankExpr = `CASE COALESCE(importance_tier, 'normal')
        WHEN 'critical' THEN 5
        WHEN 'important' THEN 4
        WHEN 'normal' THEN 3
        WHEN 'temporary' THEN 2
        ELSE 1
      END`;

  // Find groups with more than one active row, then deprecate every row except the winner
  // (highest tier rank, then most recently updated, then highest id as a stable tiebreak).
  const retireStmt = database.prepare(`
    UPDATE memory_index
    SET importance_tier = 'deprecated',
        updated_at = datetime('now')
    WHERE id IN (
      SELECT id FROM (
        SELECT id,
               (${keyExpr}) AS logical_key,
               ROW_NUMBER() OVER (
                 PARTITION BY (${keyExpr})
                 ORDER BY ${tierRankExpr} DESC, updated_at DESC, id DESC
               ) AS rn
        FROM memory_index
        WHERE ${activePredicate}
      )
      WHERE rn > 1
    )
  `);

  const result = retireStmt.run() as { changes: number };
  if (result.changes > 0) {
    logger.warn(
      `Migration v28: deprecated ${result.changes} duplicate active row(s) before building idx_memory_logical_key_active_unique`,
    );
  }
}

// Run schema migrations from one version to another
// Each migration is idempotent - safe to run multiple times
// Wrap migrations in transaction for atomicity
/**
 * Runs schema migrations between two schema versions.
 * @param database - The database connection to migrate.
 * @param from_version - The current schema version.
 * @param to_version - The target schema version.
 * @returns Nothing.
 */
export function run_migrations(database: Database.Database, from_version: number, to_version: number): void {
  const migrations: Record<number, () => void> = {
    1: () => {
      // V0 -> v1: Initial schema (already exists via create_schema)
    },
    2: () => {
      // V1 -> v2: Add idx_history_timestamp index
      try {
        database.exec('CREATE INDEX IF NOT EXISTS idx_history_timestamp ON memory_history(timestamp DESC)');
        logger.info('Migration v2: Created idx_history_timestamp index');
      } catch (e: unknown) {
        if (!get_error_message(e).includes('already exists')) {
          console.warn('[VectorIndex] Migration v2 warning:', get_error_message(e));
        }
      }
    },
    3: () => {
      // V2 -> v3: Add related_memories column
      try {
        database.exec('ALTER TABLE memory_index ADD COLUMN related_memories TEXT');
        logger.info('Migration v3: Added related_memories column');
      } catch (e: unknown) {
        if (!get_error_message(e).includes('duplicate column')) {
          console.warn('[VectorIndex] Migration v3 warning:', get_error_message(e));
        }
      }
    },
    4: () => {
      // V3 -> v4: Add FSRS (Free Spaced Repetition Scheduler) columns for cognitive memory
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
        } catch (e: unknown) {
          if (!get_error_message(e).includes('duplicate column')) {
            console.warn(`[VectorIndex] Migration v4 warning (${col.name}):`, get_error_message(e));
          }
        }
      }

      // Use the canonical helper so later schema refinements only update one DDL definition.
      createMemoryConflictsTable(database);
      logger.info('Migration v4: Ensured memory_conflicts table');

      // Create indexes for FSRS columns
      createRequiredIndex(
        database,
        'idx_stability',
        'CREATE INDEX IF NOT EXISTS idx_stability ON memory_index(stability DESC)',
        'Migration v4',
      );
      createRequiredIndex(
        database,
        'idx_last_review',
        'CREATE INDEX IF NOT EXISTS idx_last_review ON memory_index(last_review)',
        'Migration v4',
      );
      createRequiredIndex(
        database,
        'idx_fsrs_retrieval',
        'CREATE INDEX IF NOT EXISTS idx_fsrs_retrieval ON memory_index(stability, difficulty, last_review)',
        'Migration v4',
      );
      logger.info('Migration v4: Created FSRS indexes');
    },
    5: () => {
      // V4 -> v5: Add memory_type column for type-specific half-lives
      try {
        database.exec(`
          ALTER TABLE memory_index ADD COLUMN memory_type TEXT DEFAULT 'declarative'
            CHECK(memory_type IN (
              'working', 'episodic', 'prospective', 'implicit', 'declarative',
              'procedural', 'semantic', 'autobiographical', 'meta-cognitive'
            ))
        `);
        logger.info('Migration v5: Added memory_type column');
      } catch (e: unknown) {
        if (!get_error_message(e).includes('duplicate column')) {
          console.warn('[VectorIndex] Migration v5 warning (memory_type):', get_error_message(e));
        }
      }

      try {
        database.exec('ALTER TABLE memory_index ADD COLUMN half_life_days REAL');
        logger.info('Migration v5: Added half_life_days column');
      } catch (e: unknown) {
        if (!get_error_message(e).includes('duplicate column')) {
          console.warn('[VectorIndex] Migration v5 warning (half_life_days):', get_error_message(e));
        }
      }

      try {
        database.exec(`
          ALTER TABLE memory_index ADD COLUMN type_inference_source TEXT DEFAULT 'default'
            CHECK(type_inference_source IN (
              'frontmatter_explicit', 'importance_tier', 'file_path', 'keywords', 'default', 'manual'
            ))
        `);
        logger.info('Migration v5: Added type_inference_source column');
      } catch (e: unknown) {
        if (!get_error_message(e).includes('duplicate column')) {
          console.warn('[VectorIndex] Migration v5 warning (type_inference_source):', get_error_message(e));
        }
      }

      try {
        database.exec('CREATE INDEX IF NOT EXISTS idx_memory_type ON memory_index(memory_type)');
        database.exec('CREATE INDEX IF NOT EXISTS idx_memory_type_decay ON memory_index(memory_type, half_life_days)');
        logger.info('Migration v5: Created memory_type indexes');
      } catch (e: unknown) {
        console.warn('[VectorIndex] Migration v5 warning (indexes):', get_error_message(e));
      }

      logger.info('Migration v5: Type inference backfill will run on next index scan');
    },
    6: () => {
      // V5 -> v6: Add file_mtime_ms for incremental indexing
      try {
        database.exec('ALTER TABLE memory_index ADD COLUMN file_mtime_ms INTEGER');
        logger.info('Migration v6: Added file_mtime_ms column for incremental indexing');
      } catch (e: unknown) {
        if (!get_error_message(e).includes('duplicate column')) {
          console.warn('[VectorIndex] Migration v6 warning (file_mtime_ms):', get_error_message(e));
        }
      }

      try {
        database.exec('CREATE INDEX IF NOT EXISTS idx_file_mtime ON memory_index(file_mtime_ms)');
        logger.info('Migration v6: Created file_mtime index');
      } catch (e: unknown) {
        console.warn('[VectorIndex] Migration v6 warning (idx_file_mtime):', get_error_message(e));
      }
    },
    7: () => {
      // V6 -> v7: Add 'partial' embedding_status for deferred indexing
      try {
        database.exec(`
          CREATE INDEX IF NOT EXISTS idx_embedding_pending
          ON memory_index(embedding_status)
          WHERE embedding_status IN ('pending', 'partial', 'retry')
        `);
        logger.info('Migration v7: Created idx_embedding_pending partial index');
      } catch (e: unknown) {
        console.warn('[VectorIndex] Migration v7 warning (idx_embedding_pending):', get_error_message(e));
      }

      try {
        database.exec(`
          CREATE INDEX IF NOT EXISTS idx_fts_fallback
          ON memory_index(spec_folder, embedding_status, importance_tier)
          WHERE embedding_status IN ('pending', 'partial')
        `);
        logger.info('Migration v7: Created idx_fts_fallback index for deferred indexing');
      } catch (e: unknown) {
        console.warn('[VectorIndex] Migration v7 warning (idx_fts_fallback):', get_error_message(e));
      }
    },
    8: () => {
      // V7 -> v8: Create causal_edges table for Causal Memory Graph
      try {
        database.exec(`
          CREATE TABLE IF NOT EXISTS causal_edges (
            id INTEGER PRIMARY KEY,
            source_id TEXT NOT NULL,
            target_id TEXT NOT NULL,
            source_anchor TEXT,
            target_anchor TEXT,
            relation TEXT NOT NULL CHECK(relation IN (
              'caused', 'enabled', 'supersedes', 'contradicts', 'derived_from', 'supports'
            )),
            strength REAL DEFAULT 1.0 CHECK(strength >= 0.0 AND strength <= 1.0),
            evidence TEXT,
            extracted_at TEXT DEFAULT (datetime('now')),
            created_by TEXT DEFAULT 'manual',
            last_accessed TEXT,
            UNIQUE(source_id, target_id, relation, source_anchor, target_anchor)
          )
        `);
        logger.info('Migration v8: Created causal_edges table');
      } catch (e: unknown) {
        if (!get_error_message(e).includes('already exists')) {
          console.warn('[VectorIndex] Migration v8 warning (causal_edges):', get_error_message(e));
        }
      }

      try {
        database.exec('CREATE INDEX IF NOT EXISTS idx_causal_source ON causal_edges(source_id)');
        database.exec('CREATE INDEX IF NOT EXISTS idx_causal_target ON causal_edges(target_id)');
        database.exec('CREATE INDEX IF NOT EXISTS idx_causal_relation ON causal_edges(relation)');
        database.exec('CREATE INDEX IF NOT EXISTS idx_causal_strength ON causal_edges(strength DESC)');
        database.exec('CREATE INDEX IF NOT EXISTS idx_causal_edges_source_anchor ON causal_edges(source_anchor)');
        database.exec('CREATE INDEX IF NOT EXISTS idx_causal_edges_target_anchor ON causal_edges(target_anchor)');
        logger.info('Migration v8: Created causal_edges indexes');
      } catch (e: unknown) {
        console.warn('[VectorIndex] Migration v8 warning (indexes):', get_error_message(e));
      }
    },
    9: () => {
      // V8 -> v9: Create memory_corrections table for Learning from Corrections
      try {
        database.exec(`
          CREATE TABLE IF NOT EXISTS memory_corrections (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            original_memory_id INTEGER NOT NULL,
            correction_memory_id INTEGER,
            correction_type TEXT NOT NULL CHECK(correction_type IN (
              'superseded', 'deprecated', 'refined', 'merged'
            )),
            original_stability_before REAL,
            original_stability_after REAL,
            correction_stability_before REAL,
            correction_stability_after REAL,
            reason TEXT,
            corrected_by TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            is_undone INTEGER DEFAULT 0,
            undone_at TEXT,
            FOREIGN KEY (original_memory_id) REFERENCES memory_index(id) ON DELETE CASCADE,
            FOREIGN KEY (correction_memory_id) REFERENCES memory_index(id) ON DELETE SET NULL
          )
        `);
        logger.info('Migration v9: Created memory_corrections table');
      } catch (e: unknown) {
        if (!get_error_message(e).includes('already exists')) {
          console.warn('[VectorIndex] Migration v9 warning (memory_corrections):', get_error_message(e));
        }
      }

      try {
        database.exec('CREATE INDEX IF NOT EXISTS idx_corrections_original ON memory_corrections(original_memory_id)');
        database.exec('CREATE INDEX IF NOT EXISTS idx_corrections_correction ON memory_corrections(correction_memory_id)');
        database.exec('CREATE INDEX IF NOT EXISTS idx_corrections_type ON memory_corrections(correction_type)');
        database.exec('CREATE INDEX IF NOT EXISTS idx_corrections_created ON memory_corrections(created_at DESC)');
        database.exec('CREATE INDEX IF NOT EXISTS idx_corrections_active ON memory_corrections(original_memory_id, is_undone) WHERE is_undone = 0');
        logger.info('Migration v9: Created memory_corrections indexes');
      } catch (e: unknown) {
        console.warn('[VectorIndex] Migration v9 warning (indexes):', get_error_message(e));
      }
    },
    12: () => {
      // V11 -> v12: Unify memory_conflicts DDL
      migrateMemoryConflictsTable(database);
      logger.info('Migration v12: Unified memory_conflicts table (KL-1)');

      createMemoryConflictIndexes(database, 'Migration v12');
      logger.info('Migration v12: Created memory_conflicts indexes');
    },
    13: () => {
      // V12 -> v13: Add document_type and spec_level for full spec folder document indexing
      try {
        database.exec("ALTER TABLE memory_index ADD COLUMN document_type TEXT DEFAULT 'memory'");
        logger.info('Migration v13: Added document_type column');
      } catch (e: unknown) {
        if (!get_error_message(e).includes('duplicate column')) {
          console.warn('[VectorIndex] Migration v13 warning (document_type):', get_error_message(e));
        }
      }

      try {
        database.exec('ALTER TABLE memory_index ADD COLUMN spec_level INTEGER');
        logger.info('Migration v13: Added spec_level column');
      } catch (e: unknown) {
        if (!get_error_message(e).includes('duplicate column')) {
          console.warn('[VectorIndex] Migration v13 warning (spec_level):', get_error_message(e));
        }
      }

      createRequiredIndex(
        database,
        'idx_document_type',
        'CREATE INDEX IF NOT EXISTS idx_document_type ON memory_index(document_type)',
        'Migration v13',
      );
      createRequiredIndex(
        database,
        'idx_doc_type_folder',
        'CREATE INDEX IF NOT EXISTS idx_doc_type_folder ON memory_index(document_type, spec_folder)',
        'Migration v13',
      );
      logger.info('Migration v13: Created document_type indexes');

      try {
        database.exec(`
          UPDATE memory_index SET document_type = 'constitutional'
          WHERE document_type = 'memory'
            AND importance_tier = 'constitutional'
        `);
        logger.info('Migration v13: Backfilled document_type for constitutional files');
      } catch (e: unknown) {
        console.warn('[VectorIndex] Migration v13 warning (backfill):', get_error_message(e));
      }
    },

    14: () => {
      try {
        database.exec('ALTER TABLE memory_index ADD COLUMN content_text TEXT');
        logger.info('Migration v14: Added content_text column');
      } catch (e: unknown) {
        if (!get_error_message(e).includes('duplicate column')) {
          console.warn('[VectorIndex] Migration v14 warning (content_text):', get_error_message(e));
        }
      }

      try {
        database.exec('DROP TRIGGER IF EXISTS memory_fts_insert');
        database.exec('DROP TRIGGER IF EXISTS memory_fts_update');
        database.exec('DROP TRIGGER IF EXISTS memory_fts_delete');

        database.exec('DROP TABLE IF EXISTS memory_fts');
        database.exec(`
          CREATE VIRTUAL TABLE memory_fts USING fts5(
            title, trigger_phrases, file_path, content_text,
            content='memory_index', content_rowid='id'
          )
        `);

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
      } catch (e: unknown) {
        console.warn('[VectorIndex] Migration v14 warning (FTS5 rebuild):', get_error_message(e));
      }

      try {
        const rows = database.prepare(
          'SELECT id, file_path FROM memory_index WHERE content_text IS NULL'
        ).all() as Array<{ id: number; file_path: string }>;

        let backfilled = 0;
        const allowedBasePaths = getMigrationAllowedBasePaths();
        const updateStmt = database.prepare(
          'UPDATE memory_index SET content_text = ? WHERE id = ?'
        );

        for (const row of rows) {
          try {
            const validatedPath = validateFilePath(row.file_path, allowedBasePaths);
            if (!validatedPath) {
              console.warn('[VectorIndex] Migration v14 skipped content_text backfill for disallowed path', {
                operation: 'migration_v14_backfill',
                memoryId: row.id,
                filePath: row.file_path,
              });
              continue;
            }

            if (fs.existsSync(validatedPath)) {
              const content = fs.readFileSync(validatedPath, 'utf-8');
              updateStmt.run(content, row.id);
              backfilled++;
            }
          } catch (rowError: unknown) {
            console.warn('[VectorIndex] Migration v14 skipped unreadable file during content_text backfill', {
              operation: 'migration_v14_backfill',
              memoryId: row.id,
              filePath: row.file_path,
              error: get_error_message(rowError),
            });
          }
        }

        if (backfilled > 0) {
          database.exec("INSERT INTO memory_fts(memory_fts) VALUES('rebuild')");
        }

        logger.info(`Migration v14: Backfilled content_text for ${backfilled}/${rows.length} rows`);
      } catch (e: unknown) {
        console.warn('[VectorIndex] Migration v14 warning (backfill):', get_error_message(e));
      }
    },

    15: () => {
      try {
        database.exec('ALTER TABLE memory_index ADD COLUMN quality_score REAL DEFAULT 0');
        logger.info('Migration v15: Added quality_score column');
      } catch (e: unknown) {
        if (!get_error_message(e).includes('duplicate column')) {
          console.warn('[VectorIndex] Migration v15 warning (quality_score):', get_error_message(e));
        }
      }

      try {
        database.exec('ALTER TABLE memory_index ADD COLUMN quality_flags TEXT');
        logger.info('Migration v15: Added quality_flags column');
      } catch (e: unknown) {
        if (!get_error_message(e).includes('duplicate column')) {
          console.warn('[VectorIndex] Migration v15 warning (quality_flags):', get_error_message(e));
        }
      }

      createRequiredIndex(
        database,
        'idx_quality_score',
        'CREATE INDEX IF NOT EXISTS idx_quality_score ON memory_index(quality_score)',
        'Migration v15',
      );
      logger.info('Migration v15: Created quality score index');
    },

    16: () => {
      try {
        database.exec('ALTER TABLE memory_index ADD COLUMN parent_id INTEGER REFERENCES memory_index(id) ON DELETE CASCADE');
        logger.info('Migration v16: Added parent_id column for chunked indexing');
      } catch (e: unknown) {
        if (!get_error_message(e).includes('duplicate column')) {
          console.warn('[VectorIndex] Migration v16 warning (parent_id):', get_error_message(e));
        }
      }

      try {
        database.exec('ALTER TABLE memory_index ADD COLUMN chunk_index INTEGER');
        logger.info('Migration v16: Added chunk_index column');
      } catch (e: unknown) {
        if (!get_error_message(e).includes('duplicate column')) {
          console.warn('[VectorIndex] Migration v16 warning (chunk_index):', get_error_message(e));
        }
      }

      try {
        database.exec('ALTER TABLE memory_index ADD COLUMN chunk_label TEXT');
        logger.info('Migration v16: Added chunk_label column');
      } catch (e: unknown) {
        if (!get_error_message(e).includes('duplicate column')) {
          console.warn('[VectorIndex] Migration v16 warning (chunk_label):', get_error_message(e));
        }
      }

      try {
        database.exec('CREATE INDEX IF NOT EXISTS idx_parent_id ON memory_index(parent_id)');
        database.exec('CREATE INDEX IF NOT EXISTS idx_parent_chunk ON memory_index(parent_id, chunk_index)');
        logger.info('Migration v16: Created parent_id indexes');
      } catch (e: unknown) {
        console.warn('[VectorIndex] Migration v16 warning (indexes):', get_error_message(e));
      }
    },

    17: () => {
      try {
        database.exec('ALTER TABLE memory_index ADD COLUMN interference_score REAL DEFAULT 0');
        logger.info('Migration v17: Added interference_score column (TM-01)');
      } catch (e: unknown) {
        if (!get_error_message(e).includes('duplicate column')) {
          console.warn('[VectorIndex] Migration v17 warning (interference_score):', get_error_message(e));
        }
      }

      try {
        database.exec('CREATE INDEX IF NOT EXISTS idx_interference_score ON memory_index(interference_score)');
        logger.info('Migration v17: Created interference_score index');
      } catch (e: unknown) {
        console.warn('[VectorIndex] Migration v17 warning (idx_interference_score):', get_error_message(e));
      }
    },

    18: () => {
      try {
        database.exec(`
          CREATE TABLE IF NOT EXISTS weight_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            edge_id INTEGER NOT NULL REFERENCES causal_edges(id) ON DELETE CASCADE,
            old_strength REAL NOT NULL,
            new_strength REAL NOT NULL,
            changed_by TEXT DEFAULT 'manual',
            changed_at TEXT DEFAULT (datetime('now')),
            reason TEXT
          )
        `);
        database.exec('CREATE INDEX IF NOT EXISTS idx_weight_history_edge ON weight_history(edge_id)');
        database.exec('CREATE INDEX IF NOT EXISTS idx_weight_history_time ON weight_history(changed_at DESC)');
        logger.info('Migration v18: Created weight_history table (T001d)');
      } catch (e: unknown) {
        if (!get_error_message(e).includes('already exists')) {
          console.warn('[VectorIndex] Migration v18 warning (weight_history):', get_error_message(e));
        }
      }

      try {
        database.exec("ALTER TABLE causal_edges ADD COLUMN created_by TEXT DEFAULT 'manual'");
        logger.info('Migration v18: Added created_by column to causal_edges');
      } catch (e: unknown) {
        if (!get_error_message(e).includes('duplicate column')) {
          console.warn('[VectorIndex] Migration v18 warning (created_by):', get_error_message(e));
        }
      }
      try {
        database.exec('ALTER TABLE causal_edges ADD COLUMN last_accessed TEXT');
        logger.info('Migration v18: Added last_accessed column to causal_edges');
      } catch (e: unknown) {
        if (!get_error_message(e).includes('duplicate column')) {
          console.warn('[VectorIndex] Migration v18 warning (last_accessed):', get_error_message(e));
        }
      }

      try {
        database.exec("ALTER TABLE memory_index ADD COLUMN encoding_intent TEXT DEFAULT 'document'");
        database.exec('CREATE INDEX IF NOT EXISTS idx_encoding_intent ON memory_index(encoding_intent)');
        logger.info('Migration v18: Added encoding_intent column to memory_index (R16)');
      } catch (e: unknown) {
        if (!get_error_message(e).includes('duplicate column')) {
          console.warn('[VectorIndex] Migration v18 warning (encoding_intent):', get_error_message(e));
        }
      }
    },

    19: () => {
      try {
        database.exec(`
          CREATE TABLE IF NOT EXISTS degree_snapshots (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            memory_id INTEGER NOT NULL,
            degree_count INTEGER NOT NULL DEFAULT 0,
            snapshot_date TEXT NOT NULL DEFAULT (date('now')),
            UNIQUE(memory_id, snapshot_date)
          )
        `);
        database.exec('CREATE INDEX IF NOT EXISTS idx_degree_snapshots_memory ON degree_snapshots(memory_id)');
        database.exec('CREATE INDEX IF NOT EXISTS idx_degree_snapshots_date ON degree_snapshots(snapshot_date DESC)');
        logger.info('Migration v19: Created degree_snapshots table (N2a)');
      } catch (e: unknown) {
        if (!get_error_message(e).includes('already exists')) {
          console.warn('[VectorIndex] Migration v19 warning (degree_snapshots):', get_error_message(e));
        }
      }

      try {
        database.exec(`
          CREATE TABLE IF NOT EXISTS community_assignments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            memory_id INTEGER NOT NULL UNIQUE,
            community_id INTEGER NOT NULL,
            algorithm TEXT NOT NULL DEFAULT 'bfs',
            computed_at TEXT DEFAULT (datetime('now'))
          )
        `);
        database.exec('CREATE INDEX IF NOT EXISTS idx_community_assignments_community ON community_assignments(community_id)');
        logger.info('Migration v19: Created community_assignments table (N2c)');
      } catch (e: unknown) {
        if (!get_error_message(e).includes('already exists')) {
          console.warn('[VectorIndex] Migration v19 warning (community_assignments):', get_error_message(e));
        }
      }
    },

    20: () => {
      try {
        database.exec(`
          CREATE TABLE IF NOT EXISTS memory_summaries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            memory_id INTEGER NOT NULL UNIQUE,
            summary_text TEXT NOT NULL,
            summary_embedding BLOB,
            key_sentences TEXT DEFAULT '[]',
            created_at TEXT DEFAULT (datetime('now')),
            updated_at TEXT DEFAULT (datetime('now'))
          )
        `);
        database.exec('CREATE INDEX IF NOT EXISTS idx_memory_summaries_memory ON memory_summaries(memory_id)');
        logger.info('Migration v20: Created memory_summaries table (R8)');
      } catch (e: unknown) {
        if (!get_error_message(e).includes('already exists')) {
          console.warn('[VectorIndex] Migration v20 warning (memory_summaries):', get_error_message(e));
        }
      }

      try {
        database.exec(`
          CREATE TABLE IF NOT EXISTS memory_entities (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            memory_id INTEGER NOT NULL,
            entity_text TEXT NOT NULL,
            entity_type TEXT NOT NULL DEFAULT 'noun_phrase',
            frequency INTEGER NOT NULL DEFAULT 1,
            created_by TEXT NOT NULL DEFAULT 'entity_extractor',
            created_at TEXT DEFAULT (datetime('now')),
            UNIQUE(memory_id, entity_text)
          )
        `);
        database.exec('CREATE INDEX IF NOT EXISTS idx_memory_entities_memory ON memory_entities(memory_id)');
        database.exec('CREATE INDEX IF NOT EXISTS idx_memory_entities_text ON memory_entities(entity_text)');
        logger.info('Migration v20: Created memory_entities table (R10)');
      } catch (e: unknown) {
        if (!get_error_message(e).includes('already exists')) {
          console.warn('[VectorIndex] Migration v20 warning (memory_entities):', get_error_message(e));
        }
      }

      try {
        database.exec(`
          CREATE TABLE IF NOT EXISTS entity_catalog (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            canonical_name TEXT NOT NULL UNIQUE,
            aliases TEXT DEFAULT '[]',
            entity_type TEXT NOT NULL DEFAULT 'noun_phrase',
            memory_count INTEGER NOT NULL DEFAULT 0,
            created_at TEXT DEFAULT (datetime('now'))
          )
        `);
        database.exec('CREATE INDEX IF NOT EXISTS idx_entity_catalog_name ON entity_catalog(canonical_name)');
        logger.info('Migration v20: Created entity_catalog table (S5)');
      } catch (e: unknown) {
        if (!get_error_message(e).includes('already exists')) {
          console.warn('[VectorIndex] Migration v20 warning (entity_catalog):', get_error_message(e));
        }
      }
    }
  };

  // V20 -> v21: Add learned_triggers column (learned feedback)
  migrations[21] = () => {
    try {
      database.exec("ALTER TABLE memory_index ADD COLUMN learned_triggers TEXT DEFAULT '[]'");
      logger.info('Migration v21: Added learned_triggers column (R11)');
    } catch (e: unknown) {
      if (!get_error_message(e).includes('duplicate column') && !get_error_message(e).includes('already exists')) {
        console.warn('[VectorIndex] Migration v21 warning (learned_triggers):', get_error_message(e));
      }
    }
  };

  migrations[22] = () => {
    try {
      ensureLineageTables(database);
      logger.info('Migration v22: Created memory lineage tables and indexes');
    } catch (e: unknown) {
      if (!get_error_message(e).includes('already exists')) {
        console.warn('[VectorIndex] Migration v22 warning (memory lineage):', get_error_message(e));
      }
    }
  };

  // V22 -> V23: One-time re-canonicalization of spec_folder values
  migrations[23] = () => {
    const rows = database.prepare(`
      SELECT id, file_path, spec_folder FROM memory_index
      WHERE file_path IS NOT NULL AND file_path != ''
    `).all() as Array<{ id: number; file_path: string; spec_folder: string }>;

    // Filter in JS with normalized separators (not SQL LIKE)
    const specRows = rows.filter(row => {
      const normalized = row.file_path.replace(/\\/g, '/');
      return normalized.includes('/specs/') || normalized.startsWith('specs/');
    });

    const updates: Array<{ id: number; canonical: string; oldSpecFolder: string }> = [];
    for (const row of specRows) {
      try {
        const canonical = extractSpecFolder(row.file_path);
        if (canonical !== row.spec_folder) {
          updates.push({ id: row.id, canonical, oldSpecFolder: row.spec_folder });
        }
      } catch {
        logger.warn(`Migration v23: Skipping row ${row.id} — canonicalization failed`);
      }
    }

    if (updates.length > 0) {
      const updateStmt = database.prepare(
        'UPDATE memory_index SET spec_folder = ? WHERE id = ? AND spec_folder = ?'
      );
      for (const u of updates) {
        updateStmt.run(u.canonical, u.id, u.oldSpecFolder);
      }
      logger.info(`Migration v23: Re-canonicalized spec_folder for ${updates.length} memory rows`);
    }

    // Migrate session_state.spec_folder using old→new mapping
    migrateSessionStateSpecFolders(database, updates);
    migrateHistorySpecFolders(database, updates);
  };

  migrations[24] = () => {
    createRequiredIndex(
      database,
      'idx_trigger_cache_source',
      `CREATE INDEX IF NOT EXISTS idx_trigger_cache_source
       ON memory_index(embedding_status, id)
       WHERE embedding_status = 'success'
         AND trigger_phrases IS NOT NULL
         AND trigger_phrases != '[]'
         AND trigger_phrases != ''`,
      'Migration v24',
    );
    createRequiredIndex(
      database,
      'idx_spec_folder_created_at',
      'CREATE INDEX IF NOT EXISTS idx_spec_folder_created_at ON memory_index(spec_folder, created_at DESC)',
      'Migration v24',
    );
    logger.info('Migration v24: Created trigger-cache source and temporal contiguity indexes');
  };

  migrations[25] = () => {
    // Normalize legacy context_type values and rebuild CHECK constraint.
    // Step 1: UPDATE legacy values to canonical forms
    const updated = database.prepare(`
      UPDATE memory_index SET context_type = 'planning' WHERE context_type = 'decision'
    `).run();
    const updatedDiscovery = database.prepare(`
      UPDATE memory_index SET context_type = 'general' WHERE context_type = 'discovery'
    `).run();
    logger.info(`Migration v25: Normalized context_type values (${updated.changes} decision→planning, ${updatedDiscovery.changes} discovery→general)`);

    // Step 2: Rebuild table with strict CHECK constraint (canonical types only).
    // SQLite doesn't support ALTER CONSTRAINT, so we rebuild the table.
    const hasContextTypeColumn = database.prepare(
      `SELECT COUNT(*) as cnt FROM pragma_table_info('memory_index') WHERE name = 'context_type'`
    ).get() as { cnt: number };

    if (hasContextTypeColumn.cnt > 0) {
      // Get current table SQL to check if CHECK constraint needs updating
      const tableInfo = database.prepare(
        `SELECT sql FROM sqlite_master WHERE type='table' AND name='memory_index'`
      ).get() as { sql: string } | undefined;

      if (tableInfo?.sql && !tableInfo.sql.includes("context_type IN ('research', 'implementation', 'planning', 'general')")) {
        // Table needs rebuilding — current CHECK is either missing or includes legacy values
        // Get all column names from the existing table
        const columns = database.prepare(`PRAGMA table_info(memory_index)`).all() as Array<{ name: string }>;
        const columnNames = columns.map(c => c.name).join(', ');

        // Get all indexes to recreate after rebuild
        const indexes = database.prepare(
          `SELECT sql FROM sqlite_master WHERE type='index' AND tbl_name='memory_index' AND sql IS NOT NULL`
        ).all() as Array<{ sql: string }>;

        // Rebuild: rename → create new → copy → drop old
        database.exec(`ALTER TABLE memory_index RENAME TO memory_index_v24_backup`);

        // Get the CREATE TABLE statement and replace the CHECK constraint
        let createSql = tableInfo.sql;
        // Replace any existing CHECK on context_type with strict canonical-only constraint
        createSql = createSql.replace(
          /CHECK\s*\(\s*context_type\s+IN\s*\([^)]+\)\s*\)/i,
          "CHECK(context_type IN ('research', 'implementation', 'planning', 'general'))"
        );
        // If no CHECK existed (column added via ALTER TABLE), add one
        if (!createSql.includes('CHECK(context_type')) {
          createSql = createSql.replace(
            /context_type\s+TEXT\s+DEFAULT\s+'general'/i,
            "context_type TEXT DEFAULT 'general' CHECK(context_type IN ('research', 'implementation', 'planning', 'general'))"
          );
        }
        database.exec(createSql);

        // Copy data
        database.exec(`INSERT INTO memory_index SELECT ${columnNames} FROM memory_index_v24_backup`);
        database.exec(`DROP TABLE memory_index_v24_backup`);

        // Recreate indexes
        for (const idx of indexes) {
          try {
            database.exec(idx.sql);
          } catch {
            // Index may already exist or reference dropped columns — skip
          }
        }

        logger.info('Migration v25: Rebuilt memory_index with strict CHECK(context_type) — canonical types only');
      } else {
        logger.info('Migration v25: CHECK constraint already correct, skipping table rebuild');
      }
    }
  };

  migrations[26] = () => {
    try {
      database.exec('ALTER TABLE causal_edges ADD COLUMN source_anchor TEXT');
      logger.info('Migration v26: Added source_anchor column to causal_edges');
    } catch (e: unknown) {
      if (!get_error_message(e).includes('duplicate column')) {
        console.warn('[VectorIndex] Migration v26 warning (source_anchor):', get_error_message(e));
      }
    }

    try {
      database.exec('ALTER TABLE causal_edges ADD COLUMN target_anchor TEXT');
      logger.info('Migration v26: Added target_anchor column to causal_edges');
    } catch (e: unknown) {
      if (!get_error_message(e).includes('duplicate column')) {
        console.warn('[VectorIndex] Migration v26 warning (target_anchor):', get_error_message(e));
      }
    }

    try {
      database.exec('CREATE INDEX IF NOT EXISTS idx_causal_edges_source_anchor ON causal_edges(source_anchor)');
      database.exec('CREATE INDEX IF NOT EXISTS idx_causal_edges_target_anchor ON causal_edges(target_anchor)');
      logger.info('Migration v26: Created causal_edges anchor indexes');
    } catch (e: unknown) {
      console.warn('[VectorIndex] Migration v26 warning (anchor indexes):', get_error_message(e));
    }
  };

  migrations[27] = () => {
    const tableInfo = database.prepare(
      "SELECT sql FROM sqlite_master WHERE type='table' AND name='causal_edges'"
    ).get() as { sql?: string } | undefined;
    const expectedConstraint = 'UNIQUE(source_id, target_id, relation, source_anchor, target_anchor)';
    if (!tableInfo?.sql || tableInfo.sql.includes(expectedConstraint)) {
      logger.info('Migration v27: causal_edges uniqueness already anchor-aware, skipping rebuild');
      return;
    }

    const columnNames = getTableColumns(database, 'causal_edges');
    const hasValidAt = columnNames.includes('valid_at');
    const hasInvalidAt = columnNames.includes('invalid_at');
    const indexes = database.prepare(
      "SELECT sql FROM sqlite_master WHERE type='index' AND tbl_name='causal_edges' AND sql IS NOT NULL"
    ).all() as Array<{ sql: string }>;

    database.exec('ALTER TABLE causal_edges RENAME TO causal_edges_v27_backup');
    database.exec(`
      CREATE TABLE causal_edges (
        id INTEGER PRIMARY KEY,
        source_id TEXT NOT NULL,
        target_id TEXT NOT NULL,
        source_anchor TEXT,
        target_anchor TEXT,
        relation TEXT NOT NULL CHECK(relation IN (
          'caused', 'enabled', 'supersedes', 'contradicts', 'derived_from', 'supports'
        )),
        strength REAL DEFAULT 1.0 CHECK(strength >= 0.0 AND strength <= 1.0),
        evidence TEXT,
        extracted_at TEXT DEFAULT (datetime('now')),
        created_by TEXT DEFAULT 'manual',
        last_accessed TEXT${hasValidAt ? ',\n        valid_at TEXT' : ''}${hasInvalidAt ? ',\n        invalid_at TEXT' : ''},
        UNIQUE(source_id, target_id, relation, source_anchor, target_anchor)
      )
    `);

    const copyColumns = [
      'id',
      'source_id',
      'target_id',
      'source_anchor',
      'target_anchor',
      'relation',
      'strength',
      'evidence',
      'extracted_at',
      'created_by',
      'last_accessed',
      ...(hasValidAt ? ['valid_at'] : []),
      ...(hasInvalidAt ? ['invalid_at'] : []),
    ].join(', ');
    database.exec(`INSERT INTO causal_edges (${copyColumns}) SELECT ${copyColumns} FROM causal_edges_v27_backup`);
    database.exec('DROP TABLE causal_edges_v27_backup');

    for (const index of indexes) {
      try {
        database.exec(index.sql);
      } catch {
        // Index may already exist after rebuild or reference legacy structure.
      }
    }

    database.exec('CREATE INDEX IF NOT EXISTS idx_causal_edges_source_anchor ON causal_edges(source_anchor)');
    database.exec('CREATE INDEX IF NOT EXISTS idx_causal_edges_target_anchor ON causal_edges(target_anchor)');
    logger.info('Migration v27: Rebuilt causal_edges with anchor-aware uniqueness');
  };

  migrations[28] = () => {
    // Active-row uniqueness guard: at most one non-deprecated, non-constitutional
    // row per logical key (spec_folder + canonical_file_path + anchor + scope, where
    // scope is the tenant/user/agent/session tuple the lineage logical key also
    // isolates on — so distinct-scope rows for one path stay independent). Deprecated
    // predecessors are excluded so supersede-on-reindex retires the prior version by
    // tier rather than by deletion, and constitutional rows are exempt so always-
    // surfaced rules can carry intentional duplicates. COALESCE keeps NULL-tier rows
    // (treated as active everywhere else) inside the guard and groups unscoped rows
    // together. A pre-existing DB may already hold duplicate active logical keys (created
    // before this guard existed). The pre-pass below retires those duplicates first —
    // deprecate, never delete — so the UNIQUE index can be built; otherwise the CREATE
    // would throw and roll back the whole shared migration transaction, wedging the upgrade.
    deprecateDuplicateActiveLogicalKeysBeforeUniqueIndex(database);
    createRequiredIndex(
      database,
      'idx_memory_logical_key_active_unique',
      `CREATE UNIQUE INDEX IF NOT EXISTS idx_memory_logical_key_active_unique
         ON memory_index (
           spec_folder,
           COALESCE(NULLIF(canonical_file_path, ''), file_path),
           COALESCE(NULLIF(TRIM(anchor_id), ''), '_'),
           COALESCE(tenant_id, ''),
           COALESCE(user_id, ''),
           COALESCE(agent_id, ''),
           COALESCE(session_id, '')
         )
         WHERE COALESCE(importance_tier, 'normal') NOT IN ('constitutional', 'deprecated')`,
      'Migration v28',
    );
    logger.info('Migration v28: Created active-row logical-key unique index');
  };

  migrations[29] = () => {
    if (!hasTable(database, 'checkpoints')) {
      ensureCompanionTables(database);
      logger.info('Migration v29: Created checkpoints table with snapshot columns');
      return;
    }

    const columns = new Set(getTableColumns(database, 'checkpoints'));
    if (!columns.has('snapshot_format')) {
      database.exec("ALTER TABLE checkpoints ADD COLUMN snapshot_format TEXT DEFAULT 'v1'");
      logger.info('Migration v29: Added checkpoints.snapshot_format column');
    }
    if (!columns.has('snapshot_path')) {
      database.exec('ALTER TABLE checkpoints ADD COLUMN snapshot_path TEXT');
      logger.info('Migration v29: Added checkpoints.snapshot_path column');
    }
  };

  migrations[30] = () => {
    if (!hasTable(database, 'memory_index')) {
      logger.warn('Migration v30: memory_index missing; skipping enrichment marker migration');
      return;
    }

    const columns = new Set(getTableColumns(database, 'memory_index'));
    const markerColumns: Array<{ name: string; sql: string }> = [
      {
        name: 'post_insert_enrichment_status',
        sql: "ALTER TABLE memory_index ADD COLUMN post_insert_enrichment_status TEXT NOT NULL DEFAULT 'complete'",
      },
      {
        name: 'post_insert_enrichment_state',
        sql: 'ALTER TABLE memory_index ADD COLUMN post_insert_enrichment_state TEXT',
      },
      {
        name: 'post_insert_enrichment_completed_at',
        sql: 'ALTER TABLE memory_index ADD COLUMN post_insert_enrichment_completed_at TEXT',
      },
      {
        name: 'post_insert_enrichment_version',
        sql: 'ALTER TABLE memory_index ADD COLUMN post_insert_enrichment_version INTEGER',
      },
    ];

    for (const column of markerColumns) {
      if (columns.has(column.name)) {
        continue;
      }

      try {
        database.exec(column.sql);
        columns.add(column.name);
        logger.info(`Migration v30: Added memory_index.${column.name}`);
      } catch (error: unknown) {
        if (!get_error_message(error).includes('duplicate column')) {
          throw error;
        }
        logDuplicateColumnMigrationSkip(column.name, error);
      }
    }

    createRequiredIndex(
      database,
      'idx_post_insert_enrichment_incomplete',
      POST_INSERT_ENRICHMENT_INCOMPLETE_INDEX_SQL,
      'Migration v30',
    );
    logger.info('Migration v30: Created post-insert enrichment repair index');
  };

  migrations[31] = () => {
    ensureIncrementalIndexFoundationSchema(database, 'Migration v31');
    ensureMemoryChunkMetadataColumns(database, 'Migration v31');
    logger.info('Migration v31: Created incremental-index foundation schema');
  };

  migrations[32] = () => {
    ensureCausalEdgeTombstoneSchema(database, 'Migration v32');
    logger.info('Migration v32: Created causal edge tombstone schema');
  };

  migrations[33] = () => {
    ensureCausalEdgeProvenanceColumns(database, 'Migration v33');
    logger.info('Migration v33: Added generated causal-edge provenance columns');
  };

  migrations[34] = () => {
    ensureMemoryTriggerEmbeddingsSchema(database, 'Migration v34');
    logger.info('Migration v34: Created trigger embedding schema');
  };

  migrations[35] = () => {
    ensureMemoryIndexSourceKindColumn(database, 'Migration v35');
    logger.info('Migration v35: Added memory_index.source_kind provenance backfill');
  };

  migrations[36] = () => {
    ensureIdempotencyReceiptSchema(database, 'Migration v36');
    logger.info('Migration v36: Added idempotency receipts and near-duplicate markers');
  };

  migrations[37] = () => {
    ensureMemoryIndexTombstonePartitions(database, 'Migration v37');
    logger.info('Migration v37: Added tombstone active and purgeable partitions');
  };

  migrations[38] = () => {
    ensureBitemporalWindowSchema(database, 'Migration v38');
    logger.info('Migration v38: Added bi-temporal validity windows');
  };

  migrations[39] = () => {
    ensureEdgePresenceCurrentnessSchema(database, 'Migration v39');
    logger.info('Migration v39: Added causal-edge closure-provenance marker');
  };

  migrations[40] = () => {
    const result = ensureDerivedIdProvenanceSchema(database, 'Migration v40');
    logger.info(`Migration v40: Added generated causal-edge derived identity (${result.backfilled}/${result.scanned} backfilled)`);
  };

  migrations[41] = () => {
    ensureRetentionForgettingSchema(database, 'Migration v41');
    ensureSemanticEdgeLayerSchema(database, 'Migration v41');
    logger.info('Migration v41: Added retention-forgetting and semantic-edge schema support');
  };

  // Wrap all migrations in a transaction for atomicity
  const run_all_migrations = database.transaction(() => {
    for (let v = from_version + 1; v <= to_version; v++) {
      if (migrations[v]) {
        logger.info(`Running migration v${v}`);
        migrations[v]();
      }
    }
  });

  try {
    run_all_migrations();
  } catch (err: unknown) {
    console.error('[VectorIndex] Migration failed, rolled back:', get_error_message(err));
    throw err;
  }
}

// Ensure schema version table exists and run any pending migrations
/**
 * Ensures the schema version table is current.
 * @param database - The database connection to check.
 * @returns The previous schema version.
 */
export function ensure_schema_version(database: Database.Database): number {
  database.exec(`
    CREATE TABLE IF NOT EXISTS schema_version (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      version INTEGER NOT NULL,
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);

  const row = database.prepare('SELECT version FROM schema_version WHERE id = 1').get() as { version: number } | undefined;
  const current_version = row ? row.version : 0;
  let compatibility = validate_backward_compatibility(database);

  if (current_version < SCHEMA_VERSION) {
    logger.info(`Migrating schema from v${current_version} to v${SCHEMA_VERSION}`);
    run_migrations(database, current_version, SCHEMA_VERSION);

    compatibility = validate_backward_compatibility(database);
    if (!compatibility.compatible) {
      throw new Error(`Schema migration compatibility check failed: ${summarizeCompatibilityFailures(compatibility)}`);
    }

    database.prepare(`
      INSERT OR REPLACE INTO schema_version (id, version, updated_at)
      VALUES (1, ?, datetime('now'))
    `).run(SCHEMA_VERSION);

    logger.info(`Schema migration complete: v${SCHEMA_VERSION}`);
  }

  if (!compatibility.compatible) {
    logger.warn(
      'Backward-compatibility validation detected schema gaps',
      compatibility as unknown as Record<string, unknown>
    );
  }

  initHistory(database);

  return current_version;
}

export function ensureLineageTables(database: Database.Database): void {
  database.exec(`
    CREATE TABLE IF NOT EXISTS memory_lineage (
      memory_id INTEGER PRIMARY KEY,
      logical_key TEXT NOT NULL,
      version_number INTEGER NOT NULL,
      root_memory_id INTEGER NOT NULL,
      predecessor_memory_id INTEGER,
      superseded_by_memory_id INTEGER,
      valid_from TEXT NOT NULL,
      valid_to TEXT,
      transition_event TEXT NOT NULL CHECK(transition_event IN ('CREATE', 'UPDATE', 'SUPERSEDE', 'BACKFILL')),
      actor TEXT DEFAULT 'system',
      metadata TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(logical_key, version_number)
    )
  `);

  const lineageTableInfo = database.prepare(
    "SELECT sql FROM sqlite_master WHERE type='table' AND name='memory_lineage'"
  ).get() as { sql?: string } | undefined;
  if (lineageTableInfo?.sql && (!lineageTableInfo.sql.includes("'UPDATE'") || lineageTableInfo.sql.includes('FOREIGN KEY'))) {
    database.exec(`
      ALTER TABLE memory_lineage RENAME TO memory_lineage_old;
      CREATE TABLE memory_lineage (
        memory_id INTEGER PRIMARY KEY,
        logical_key TEXT NOT NULL,
        version_number INTEGER NOT NULL,
        root_memory_id INTEGER NOT NULL,
        predecessor_memory_id INTEGER,
        superseded_by_memory_id INTEGER,
        valid_from TEXT NOT NULL,
        valid_to TEXT,
        transition_event TEXT NOT NULL CHECK(transition_event IN ('CREATE', 'UPDATE', 'SUPERSEDE', 'BACKFILL')),
        actor TEXT DEFAULT 'system',
        metadata TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(logical_key, version_number)
      );
      INSERT INTO memory_lineage (
        memory_id, logical_key, version_number, root_memory_id, predecessor_memory_id,
        superseded_by_memory_id, valid_from, valid_to, transition_event, actor, metadata, created_at
      )
      SELECT
        memory_id, logical_key, version_number, root_memory_id, predecessor_memory_id,
        superseded_by_memory_id, valid_from, valid_to, transition_event, actor, metadata, created_at
      FROM memory_lineage_old;
      DROP TABLE memory_lineage_old;
    `);
  }

  if (hasTable(database, LEGACY_MEMORY_LINEAGE_TABLE)) {
    database.exec(`
      INSERT OR IGNORE INTO memory_lineage (
        memory_id, logical_key, version_number, root_memory_id, predecessor_memory_id,
        superseded_by_memory_id, valid_from, valid_to, transition_event, actor, metadata, created_at
      )
      SELECT
        memory_id, logical_key, version_number, root_memory_id, predecessor_memory_id,
        superseded_by_memory_id, valid_from, valid_to, transition_event, actor, metadata, created_at
      FROM hydra_memory_lineage
    `);
  }

  const lineageColumns = new Set(getTableColumns(database, MEMORY_LINEAGE_TABLE));
  for (const column of MEMORY_LINEAGE_BITEMPORAL_COLUMNS) {
    addColumnIfMissing(database, MEMORY_LINEAGE_TABLE, lineageColumns, column, 'ensureLineageTables');
  }
  database.exec(`
    UPDATE memory_lineage
    SET ingested_at = COALESCE(ingested_at, created_at, valid_from, datetime('now')),
        expired_at = COALESCE(expired_at, valid_to)
    WHERE ingested_at IS NULL
       OR (expired_at IS NULL AND valid_to IS NOT NULL)
  `);

  database.exec(`
    CREATE TABLE IF NOT EXISTS active_memory_projection (
      logical_key TEXT PRIMARY KEY,
      root_memory_id INTEGER NOT NULL,
      active_memory_id INTEGER NOT NULL UNIQUE,
      updated_at TEXT NOT NULL
    )
  `);

  const projectionTableInfo = database.prepare(
    "SELECT sql FROM sqlite_master WHERE type='table' AND name='active_memory_projection'"
  ).get() as { sql?: string } | undefined;
  if (projectionTableInfo?.sql && projectionTableInfo.sql.includes('FOREIGN KEY')) {
    database.exec(`
      ALTER TABLE active_memory_projection RENAME TO active_memory_projection_old;
      CREATE TABLE active_memory_projection (
        logical_key TEXT PRIMARY KEY,
        root_memory_id INTEGER NOT NULL,
        active_memory_id INTEGER NOT NULL UNIQUE,
        updated_at TEXT NOT NULL
      );
      INSERT INTO active_memory_projection (logical_key, root_memory_id, active_memory_id, updated_at)
      SELECT logical_key, root_memory_id, active_memory_id, updated_at
      FROM active_memory_projection_old;
      DROP TABLE active_memory_projection_old;
    `);
  }

  if (hasTable(database, LEGACY_ACTIVE_MEMORY_PROJECTION_TABLE)) {
    database.exec(`
      INSERT OR IGNORE INTO active_memory_projection (logical_key, root_memory_id, active_memory_id, updated_at)
      SELECT logical_key, root_memory_id, active_memory_id, updated_at
      FROM hydra_active_memory_projection
    `);
  }

  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_memory_lineage_logical_key
      ON memory_lineage(logical_key, version_number DESC);
    CREATE INDEX IF NOT EXISTS idx_memory_lineage_predecessor
      ON memory_lineage(predecessor_memory_id);
    CREATE INDEX IF NOT EXISTS idx_memory_lineage_root
      ON memory_lineage(root_memory_id, version_number ASC);
    CREATE INDEX IF NOT EXISTS idx_memory_lineage_valid_from
      ON memory_lineage(logical_key, valid_from DESC);
    CREATE INDEX IF NOT EXISTS idx_active_memory_projection_active
      ON active_memory_projection(active_memory_id);
  `);
}

function ensureMemoryIndexGovernanceColumns(database: Database.Database): void {
  if (!hasTable(database, 'memory_index')) {
    return;
  }

  const columnNames = getTableColumns(database, 'memory_index');

  const governanceColumns: Array<{ name: string; sql: string }> = [
    { name: 'tenant_id', sql: 'ALTER TABLE memory_index ADD COLUMN tenant_id TEXT' },
    { name: 'user_id', sql: 'ALTER TABLE memory_index ADD COLUMN user_id TEXT' },
    { name: 'agent_id', sql: 'ALTER TABLE memory_index ADD COLUMN agent_id TEXT' },
    { name: 'provenance_source', sql: 'ALTER TABLE memory_index ADD COLUMN provenance_source TEXT' },
    { name: 'provenance_actor', sql: 'ALTER TABLE memory_index ADD COLUMN provenance_actor TEXT' },
    { name: 'source_kind', sql: SOURCE_KIND_COLUMN_SQL },
    { name: 'governed_at', sql: 'ALTER TABLE memory_index ADD COLUMN governed_at TEXT' },
    { name: 'retention_policy', sql: "ALTER TABLE memory_index ADD COLUMN retention_policy TEXT DEFAULT 'keep'" },
    { name: 'delete_after', sql: 'ALTER TABLE memory_index ADD COLUMN delete_after TEXT' },
    { name: 'governance_metadata', sql: 'ALTER TABLE memory_index ADD COLUMN governance_metadata TEXT' },
  ];

  for (const column of governanceColumns) {
    if (columnNames.includes(column.name)) continue;
    try {
      database.exec(column.sql);
    } catch (error: unknown) {
      logDuplicateColumnMigrationSkip(column.name, error);
    }
  }

  ensureMemoryIndexSourceKindColumn(database, 'governance bootstrap');
}

// Idempotent: runs on every startup. If the column is gone we return without
// touching the database. If DROP COLUMN throws (older SQLite), we swallow the
// error and leave the orphan column in place; the runtime never reads or
// writes it either way.
function dropDeprecatedSharedSpaceColumn(database: Database.Database): void {
  if (!hasTable(database, 'memory_index')) return;
  const columnNames = getTableColumns(database, 'memory_index');
  if (!columnNames.includes('shared_space_id')) return;
  try {
    database.exec('ALTER TABLE memory_index DROP COLUMN shared_space_id');
  } catch {
    // Older SQLite without DROP COLUMN support: leave the column in place.
  }
}

export function ensureGovernanceTables(database: Database.Database): void {
  ensureMemoryIndexGovernanceColumns(database);
  dropDeprecatedSharedSpaceColumn(database);

  database.exec(`
    CREATE TABLE IF NOT EXISTS governance_audit (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL,
      decision TEXT NOT NULL,
      memory_id INTEGER,
      logical_key TEXT,
      tenant_id TEXT,
      user_id TEXT,
      agent_id TEXT,
      session_id TEXT,
      reason TEXT,
      metadata TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_governance_audit_action
      ON governance_audit(action, decision, created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_governance_audit_scope
      ON governance_audit(tenant_id, user_id, agent_id, session_id);
  `);

  if (hasTable(database, 'memory_index')) {
    database.exec(`
      CREATE INDEX IF NOT EXISTS idx_memory_scope_hierarchy
        ON memory_index(tenant_id, user_id, agent_id, session_id);
      CREATE INDEX IF NOT EXISTS idx_memory_retention_delete_after
        ON memory_index(delete_after);
    `);
  }
}

/**
 * Validates backward compatibility expectations for the current schema.
 * Never throws; returns compatibility details for logging and rollout gates.
 */
export function validate_backward_compatibility(database: Database.Database): SchemaCompatibilityReport {
  try {
    const missingTables = REQUIRED_TABLES.filter((tableName) => !hasTable(database, tableName));
    const missingColumns: Record<string, string[]> = {};
    const missingIndexes: string[] = [];
    const constraintMismatches: string[] = [];
    const warnings: string[] = [];

    if (hasTable(database, 'memory_index')) {
      const existingColumns = new Set(getTableColumns(database, 'memory_index'));
      const absentColumns = REQUIRED_MEMORY_INDEX_COLUMNS.filter((columnName) => !existingColumns.has(columnName));
      if (absentColumns.length > 0) {
        missingColumns.memory_index = absentColumns;
      }
      if (!hasConstitutionalTierConstraint(database)) {
        constraintMismatches.push('memory_index.importance_tier CHECK constraint is missing constitutional support');
      }
    } else {
      missingColumns.memory_index = [...REQUIRED_MEMORY_INDEX_COLUMNS];
    }

    if (hasTable(database, 'memory_conflicts')) {
      const existingColumns = new Set(getTableColumns(database, 'memory_conflicts'));
      const absentColumns = REQUIRED_MEMORY_CONFLICT_COLUMNS.filter((columnName) => !existingColumns.has(columnName));
      if (absentColumns.length > 0) {
        missingColumns.memory_conflicts = absentColumns;
      }
    }

    if (hasTable(database, 'causal_edges')) {
      const existingColumns = new Set(getTableColumns(database, 'causal_edges'));
      const absentColumns = REQUIRED_CAUSAL_EDGE_COLUMNS.filter((columnName) => !existingColumns.has(columnName));
      if (absentColumns.length > 0) {
        missingColumns.causal_edges = absentColumns;
      }
    } else {
      missingColumns.causal_edges = [...REQUIRED_CAUSAL_EDGE_COLUMNS];
    }

    if (hasTable(database, 'causal_edge_tombstones')) {
      const existingColumns = new Set(getTableColumns(database, 'causal_edge_tombstones'));
      const absentColumns = REQUIRED_CAUSAL_EDGE_TOMBSTONE_COLUMNS.filter((columnName) => !existingColumns.has(columnName));
      if (absentColumns.length > 0) {
        missingColumns.causal_edge_tombstones = absentColumns;
      }
    } else {
      missingColumns.causal_edge_tombstones = [...REQUIRED_CAUSAL_EDGE_TOMBSTONE_COLUMNS];
    }

    if (hasTable(database, 'memory_trigger_embeddings')) {
      const existingColumns = new Set(getTableColumns(database, 'memory_trigger_embeddings'));
      const absentColumns = REQUIRED_TRIGGER_EMBEDDING_COLUMNS.filter((columnName) => !existingColumns.has(columnName));
      if (absentColumns.length > 0) {
        missingColumns.memory_trigger_embeddings = absentColumns;
      }
    } else {
      missingColumns.memory_trigger_embeddings = [...REQUIRED_TRIGGER_EMBEDDING_COLUMNS];
    }

    if (hasTable(database, 'memory_idempotency_receipts')) {
      const existingColumns = new Set(getTableColumns(database, 'memory_idempotency_receipts'));
      const absentColumns = REQUIRED_IDEMPOTENCY_RECEIPT_COLUMNS.filter((columnName) => !existingColumns.has(columnName));
      if (absentColumns.length > 0) {
        missingColumns.memory_idempotency_receipts = absentColumns;
      }
    } else {
      missingColumns.memory_idempotency_receipts = [...REQUIRED_IDEMPOTENCY_RECEIPT_COLUMNS];
    }

    if (hasTable(database, 'edge_vector_embeddings')) {
      const existingColumns = new Set(getTableColumns(database, 'edge_vector_embeddings'));
      const absentColumns = REQUIRED_EDGE_VECTOR_EMBEDDING_COLUMNS.filter((columnName) => !existingColumns.has(columnName));
      if (absentColumns.length > 0) {
        missingColumns.edge_vector_embeddings = absentColumns;
      }
    } else {
      missingColumns.edge_vector_embeddings = [...REQUIRED_EDGE_VECTOR_EMBEDDING_COLUMNS];
    }

    for (const [tableName, requiredIndexes] of Object.entries(REQUIRED_INDEXES_BY_TABLE)) {
      if (!hasTable(database, tableName)) {
        continue;
      }
      for (const indexName of requiredIndexes) {
        if (!hasIndex(database, indexName)) {
          missingIndexes.push(indexName);
        }
      }
    }

    if (!hasTable(database, 'memory_history')) {
      warnings.push('memory_history table missing; historical replay functionality may be degraded.');
    }
    if (!hasTable(database, 'checkpoints')) {
      warnings.push('checkpoints table missing; migration checkpoint tooling may be unavailable.');
    }
    if (!hasTable(database, 'memory_conflicts')) {
      warnings.push('memory_conflicts table missing; conflict audit trail may be incomplete.');
    }

    const schemaVersion = safe_get_schema_version(database);
    return {
      compatible: (
        missingTables.length === 0
        && Object.keys(missingColumns).length === 0
        && missingIndexes.length === 0
        && constraintMismatches.length === 0
      ),
      schemaVersion,
      missingTables,
      missingColumns,
      missingIndexes,
      constraintMismatches,
      warnings,
    };
  } catch (error: unknown) {
    return {
      compatible: false,
      schemaVersion: null,
      missingTables: [...REQUIRED_TABLES],
      missingColumns: {
        memory_index: [...REQUIRED_MEMORY_INDEX_COLUMNS],
        memory_trigger_embeddings: [...REQUIRED_TRIGGER_EMBEDDING_COLUMNS],
      },
      missingIndexes: [],
      constraintMismatches: ['compatibility inspection failed before constraint verification'],
      warnings: [
        `Compatibility check failed: ${error instanceof Error ? error.message : String(error)}`,
      ],
    };
  }
}

export function validateLineageSchemaSupport(database: Database.Database): LineageSchemaReport {
  try {
    const missingTables = REQUIRED_LINEAGE_TABLES.filter((tableName) => !hasTable(database, tableName));
    const missingColumns: Record<string, string[]> = {};
    const warnings: string[] = [];

    for (const [tableName, requiredColumns] of Object.entries(REQUIRED_LINEAGE_COLUMNS)) {
      if (!hasTable(database, tableName)) {
        missingColumns[tableName] = [...requiredColumns];
        continue;
      }

      const existingColumns = new Set(getTableColumns(database, tableName));
      const absentColumns = requiredColumns.filter((columnName) => !existingColumns.has(columnName));
      if (absentColumns.length > 0) {
        missingColumns[tableName] = [...absentColumns];
      }
    }

    if (!hasTable(database, 'checkpoints')) {
      warnings.push('checkpoints table missing; rollback drills cannot be validated safely.');
    }
    if (!hasTable(database, 'memory_history')) {
      warnings.push('memory_history table missing; lineage bridge metadata will be incomplete.');
    }

    return {
      compatible: missingTables.length === 0 && Object.keys(missingColumns).length === 0,
      schemaVersion: safe_get_schema_version(database),
      missingTables,
      missingColumns,
      warnings,
    };
  } catch (error: unknown) {
    const missingColumns: Record<string, string[]> = {};
    for (const [tableName, requiredColumns] of Object.entries(REQUIRED_LINEAGE_COLUMNS)) {
      missingColumns[tableName] = [...requiredColumns];
    }
    return {
      compatible: false,
      schemaVersion: null,
      missingTables: [...REQUIRED_LINEAGE_TABLES],
      missingColumns,
      warnings: [
        `Lineage compatibility check failed: ${error instanceof Error ? error.message : String(error)}`,
      ],
    };
  }
}

function safe_get_schema_version(database: Database.Database): number | null {
  try {
    if (!hasTable(database, 'schema_version')) {
      return null;
    }
    const row = database.prepare('SELECT version FROM schema_version WHERE id = 1').get() as { version?: number } | undefined;
    if (typeof row?.version === 'number' && Number.isFinite(row.version)) {
      return row.version;
    }
    return null;
  } catch (_error: unknown) {
    return null;
  }
}

/**
 * Adds legacy confidence-related columns when needed.
 * @param database - The database connection to migrate.
 * @returns Nothing.
 */
export function migrate_confidence_columns(database: Database.Database): void {
  const columns = database.prepare(`PRAGMA table_info(memory_index)`).all() as Array<{ name: string }>;
  const column_names = columns.map((c) => c.name);

  if (!column_names.includes('confidence')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN confidence REAL DEFAULT 0.5`);
      console.warn('[vector-index] Migration: Added confidence column');
    } catch (error: unknown) {
      if (!get_error_message(error).includes('duplicate column')) {
        throw error;
      }
      logDuplicateColumnMigrationSkip('confidence', error);
    }
  }

  if (!column_names.includes('validation_count')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN validation_count INTEGER DEFAULT 0`);
      console.warn('[vector-index] Migration: Added validation_count column');
    } catch (error: unknown) {
      if (!get_error_message(error).includes('duplicate column')) {
        throw error;
      }
      logDuplicateColumnMigrationSkip('validation_count', error);
    }
  }

  if (!column_names.includes('importance_tier')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN importance_tier TEXT DEFAULT 'normal'`);
      console.warn('[vector-index] Migration: Added importance_tier column');
    } catch (error: unknown) {
      if (!get_error_message(error).includes('duplicate column')) {
        throw error;
      }
      logDuplicateColumnMigrationSkip('importance_tier', error);
    }
    try {
      database.exec(`CREATE INDEX IF NOT EXISTS idx_importance_tier ON memory_index(importance_tier)`);
      console.warn('[vector-index] Migration: Created idx_importance_tier index');
    } catch (error: unknown) {
      logger.warn('Index creation failed (non-critical)', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  if (!column_names.includes('context_type')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN context_type TEXT DEFAULT 'general'`);
      console.warn('[vector-index] Migration: Added context_type column');
    } catch (error: unknown) {
      if (!get_error_message(error).includes('duplicate column')) {
        throw error;
      }
      logDuplicateColumnMigrationSkip('context_type', error);
    }
  }

  if (!column_names.includes('content_hash')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN content_hash TEXT`);
      console.warn('[vector-index] Migration: Added content_hash column');
    } catch (error: unknown) {
      if (!get_error_message(error).includes('duplicate column')) {
        throw error;
      }
      logDuplicateColumnMigrationSkip('content_hash', error);
    }
  }

  if (!column_names.includes('channel')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN channel TEXT DEFAULT 'default'`);
      console.warn('[vector-index] Migration: Added channel column');
    } catch (error: unknown) {
      if (!get_error_message(error).includes('duplicate column')) {
        throw error;
      }
      logDuplicateColumnMigrationSkip('channel', error);
    }
  }

  if (!column_names.includes('session_id')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN session_id TEXT`);
      console.warn('[vector-index] Migration: Added session_id column');
    } catch (error: unknown) {
      if (!get_error_message(error).includes('duplicate column')) {
        throw error;
      }
      logDuplicateColumnMigrationSkip('session_id', error);
    }
  }

  if (!column_names.includes('base_importance')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN base_importance REAL DEFAULT 0.5`);
      console.warn('[vector-index] Migration: Added base_importance column');
    } catch (error: unknown) {
      if (!get_error_message(error).includes('duplicate column')) {
        throw error;
      }
      logDuplicateColumnMigrationSkip('base_importance', error);
    }
  }

  if (!column_names.includes('decay_half_life_days')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN decay_half_life_days REAL DEFAULT 90.0`);
      console.warn('[vector-index] Migration: Added decay_half_life_days column');
    } catch (error: unknown) {
      if (!get_error_message(error).includes('duplicate column')) {
        throw error;
      }
      logDuplicateColumnMigrationSkip('decay_half_life_days', error);
    }
  }

  if (!column_names.includes('is_pinned')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN is_pinned INTEGER DEFAULT 0`);
      console.warn('[vector-index] Migration: Added is_pinned column');
    } catch (error: unknown) {
      if (!get_error_message(error).includes('duplicate column')) {
        throw error;
      }
      logDuplicateColumnMigrationSkip('is_pinned', error);
    }
  }

  if (!column_names.includes('last_accessed')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN last_accessed INTEGER DEFAULT 0`);
      console.warn('[vector-index] Migration: Added last_accessed column');
    } catch (error: unknown) {
      if (!get_error_message(error).includes('duplicate column')) {
        throw error;
      }
      logDuplicateColumnMigrationSkip('last_accessed', error);
    }
  }

  if (!column_names.includes('expires_at')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN expires_at DATETIME`);
      console.warn('[vector-index] Migration: Added expires_at column');
    } catch (error: unknown) {
      if (!get_error_message(error).includes('duplicate column')) {
        throw error;
      }
      logDuplicateColumnMigrationSkip('expires_at', error);
    }
  }

  if (!column_names.includes('related_memories')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN related_memories TEXT`);
      console.warn('[vector-index] Migration: Added related_memories column');
    } catch (error: unknown) {
      if (!get_error_message(error).includes('duplicate column')) {
        throw error;
      }
      logDuplicateColumnMigrationSkip('related_memories', error);
    }
  }

  if (!column_names.includes('stability')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN stability REAL DEFAULT 1.0`);
      console.warn('[vector-index] Migration: Added stability column (FSRS)');
    } catch (error: unknown) {
      if (!get_error_message(error).includes('duplicate column')) {
        throw error;
      }
      logDuplicateColumnMigrationSkip('stability', error);
    }
  }

  if (!column_names.includes('difficulty')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN difficulty REAL DEFAULT 5.0`);
      console.warn('[vector-index] Migration: Added difficulty column (FSRS)');
    } catch (error: unknown) {
      if (!get_error_message(error).includes('duplicate column')) {
        throw error;
      }
      logDuplicateColumnMigrationSkip('difficulty', error);
    }
  }

  if (!column_names.includes('last_review')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN last_review TEXT`);
      console.warn('[vector-index] Migration: Added last_review column (FSRS)');
    } catch (error: unknown) {
      if (!get_error_message(error).includes('duplicate column')) {
        throw error;
      }
      logDuplicateColumnMigrationSkip('last_review', error);
    }
  }

  if (!column_names.includes('review_count')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN review_count INTEGER DEFAULT 0`);
      console.warn('[vector-index] Migration: Added review_count column (FSRS)');
    } catch (error: unknown) {
      if (!get_error_message(error).includes('duplicate column')) {
        throw error;
      }
      logDuplicateColumnMigrationSkip('review_count', error);
    }
  }
}

/**
 * Ensures canonical file path columns and indexes exist.
 * @param database - The database connection to migrate.
 * @returns Nothing.
 */
export function ensure_canonical_file_path_support(database: Database.Database): void {
  const columns = database.prepare('PRAGMA table_info(memory_index)').all() as Array<{ name: string }>;
  const hasCanonicalColumn = columns.some((column) => column.name === 'canonical_file_path');

  if (!hasCanonicalColumn) {
    try {
      database.exec('ALTER TABLE memory_index ADD COLUMN canonical_file_path TEXT');
      console.warn('[vector-index] Migration: Added canonical_file_path column');
    } catch (error: unknown) {
      if (!get_error_message(error).includes('duplicate column')) {
        throw error;
      }
      logDuplicateColumnMigrationSkip('canonical_file_path', error);
    }
  }

  try {
    database.exec('CREATE INDEX IF NOT EXISTS idx_canonical_file_path ON memory_index(canonical_file_path)');
    database.exec('CREATE INDEX IF NOT EXISTS idx_spec_canonical_path ON memory_index(spec_folder, canonical_file_path)');
    createRequiredIndex(
      database,
      'idx_save_parent_canonical_path',
      SAVE_PARENT_CANONICAL_PATH_INDEX_SQL,
      'ensure_canonical_file_path_support',
    );
  } catch (e: unknown) {
    console.warn('[vector-index] Canonical path index warning:', get_error_message(e));
  }

  const rowsNeedingBackfill = database.prepare(`
    SELECT id, file_path
    FROM memory_index
    WHERE canonical_file_path IS NULL OR canonical_file_path = ''
  `).all() as Array<{ id: number; file_path: string | null }>;

  if (rowsNeedingBackfill.length === 0) {
    return;
  }

  const updateCanonicalPath = database.prepare(`
    UPDATE memory_index
    SET canonical_file_path = ?
    WHERE id = ?
  `);

  let updated = 0;
  const backfillTx = database.transaction((rows: Array<{ id: number; file_path: string | null }>) => {
    for (const row of rows) {
      if (!row.file_path) {
        continue;
      }

      updateCanonicalPath.run(getCanonicalPathKey(row.file_path), row.id);
      updated++;
    }
  });

  backfillTx(rowsNeedingBackfill);

  if (updated > 0) {
    logger.info(`Migration: Backfilled canonical_file_path for ${updated} memory rows`);
  }
}

// Migrate existing database to support constitutional tier
/**
 * Checks legacy databases for constitutional tier support.
 * @param database - The database connection to inspect.
 * @returns Nothing.
 */
export function migrate_constitutional_tier(database: Database.Database): void {
  const tableSql = getTableSql(database, 'memory_index');

  if (tableSql) {
    if (tableSql.includes("'constitutional'")) {
      return;
    }

    const constitutionalCount = (database.prepare(`
      SELECT COUNT(*) as count FROM memory_index
      WHERE importance_tier = 'constitutional'
    `).get() as { count: number }).count;

    throw new Error(
      constitutionalCount > 0
        ? `Legacy memory_index importance_tier constraint is missing constitutional support and blocks ${constitutionalCount} constitutional memories`
        : 'Legacy memory_index importance_tier constraint is missing constitutional support and requires a table rebuild before startup can continue'
    );
  }
}

// Create indexes for commonly queried columns
/**
 * Creates common indexes used by vector-index queries.
 * @param database - The database connection to update.
 * @returns Nothing.
 */
export function create_common_indexes(database: Database.Database): void {
  try {
    database.exec(`CREATE INDEX IF NOT EXISTS idx_file_path ON memory_index(file_path)`);
    logger.info('Created idx_file_path index');
  } catch (err: unknown) {
    console.warn('[vector-index] Failed to create index', {
      operation: 'create_common_indexes',
      index: 'idx_file_path',
      error: get_error_message(err),
    });
  }

  try {
    database.exec('CREATE INDEX IF NOT EXISTS idx_canonical_file_path ON memory_index(canonical_file_path)');
    database.exec('CREATE INDEX IF NOT EXISTS idx_spec_canonical_path ON memory_index(spec_folder, canonical_file_path)');
    createRequiredIndex(
      database,
      'idx_save_parent_canonical_path',
      SAVE_PARENT_CANONICAL_PATH_INDEX_SQL,
      'create_common_indexes',
    );
  } catch (err: unknown) {
    console.warn('[vector-index] Failed to create canonical path indexes', {
      operation: 'create_common_indexes',
      indexes: ['idx_canonical_file_path', 'idx_spec_canonical_path', 'idx_save_parent_canonical_path'],
      error: get_error_message(err),
    });
  }

  try {
    database.exec(`CREATE INDEX IF NOT EXISTS idx_content_hash ON memory_index(content_hash)`);
    createRequiredIndex(
      database,
      'idx_save_parent_content_hash_scope',
      SAVE_PARENT_CONTENT_HASH_SCOPE_INDEX_SQL,
      'create_common_indexes',
    );
    logger.info('Created idx_content_hash index');
  } catch (err: unknown) {
    console.warn('[vector-index] Failed to create index', {
      operation: 'create_common_indexes',
      index: 'idx_content_hash/idx_save_parent_content_hash_scope',
      error: get_error_message(err),
    });
  }

  try {
    database.exec(`CREATE INDEX IF NOT EXISTS idx_last_accessed ON memory_index(last_accessed DESC)`);
    logger.info('Created idx_last_accessed index');
  } catch (err: unknown) {
    console.warn('[vector-index] Failed to create index', {
      operation: 'create_common_indexes',
      index: 'idx_last_accessed',
      error: get_error_message(err),
    });
  }

  try {
    database.exec(`CREATE INDEX IF NOT EXISTS idx_importance_tier ON memory_index(importance_tier)`);
    logger.info('Created idx_importance_tier index');
  } catch (err: unknown) {
    console.warn('[vector-index] Failed to create index', {
      operation: 'create_common_indexes',
      index: 'idx_importance_tier',
      error: get_error_message(err),
    });
  }

  try {
    database.exec(`
      CREATE INDEX IF NOT EXISTS idx_trigger_cache_source
      ON memory_index(embedding_status, id)
      WHERE embedding_status = 'success'
        AND trigger_phrases IS NOT NULL
        AND trigger_phrases != '[]'
        AND trigger_phrases != ''
    `);
    logger.info('Created idx_trigger_cache_source index');
  } catch (err: unknown) {
    console.warn('[vector-index] Failed to create idx_trigger_cache_source', {
      operation: 'create_common_indexes',
      index: 'idx_trigger_cache_source',
      error: get_error_message(err),
    });
  }

  try {
    database.exec('CREATE INDEX IF NOT EXISTS idx_spec_folder_created_at ON memory_index(spec_folder, created_at DESC)');
    logger.info('Created idx_spec_folder_created_at index');
  } catch (err: unknown) {
    console.warn('[vector-index] Failed to create idx_spec_folder_created_at', {
      operation: 'create_common_indexes',
      index: 'idx_spec_folder_created_at',
      error: get_error_message(err),
    });
  }

  if (getTableColumns(database, 'memory_index').includes('post_insert_enrichment_status')) {
    try {
      createRequiredIndex(
        database,
        'idx_post_insert_enrichment_incomplete',
        POST_INSERT_ENRICHMENT_INCOMPLETE_INDEX_SQL,
        'create_common_indexes',
      );
      logger.info('Created idx_post_insert_enrichment_incomplete index');
    } catch (err: unknown) {
      console.warn('[vector-index] Failed to create idx_post_insert_enrichment_incomplete', {
        operation: 'create_common_indexes',
        index: 'idx_post_insert_enrichment_incomplete',
        error: get_error_message(err),
      });
    }
  }

  try {
    ensureMemoryIndexTombstonePartitions(database, 'create_common_indexes');
  } catch (err: unknown) {
    console.warn('[vector-index] Failed to create tombstone partition indexes', {
      operation: 'create_common_indexes',
      indexes: ['idx_memory_active_recall', 'idx_memory_purgeable_retention'],
      error: get_error_message(err),
    });
  }

  // Add idx_history_timestamp index for memory_history table
  try {
    database.exec(`CREATE INDEX IF NOT EXISTS idx_history_timestamp ON memory_history(timestamp DESC)`);
    logger.info('Created idx_history_timestamp index');
  } catch (err: unknown) {
    if (!get_error_message(err).includes('already exists')) {
      console.warn('[vector-index] Failed to create idx_history_timestamp:', get_error_message(err));
    }
  }
}

/**
 * Ensure companion tables exist alongside memory_index.
 */
export function ensureCompanionTables(database: Database.Database): void {
  database.exec(`
    CREATE TABLE IF NOT EXISTS memory_history (
      id TEXT PRIMARY KEY,
      memory_id INTEGER NOT NULL,
      prev_value TEXT,
      new_value TEXT,
      event TEXT NOT NULL CHECK(event IN ('ADD', 'UPDATE', 'DELETE')),
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      is_deleted INTEGER DEFAULT 0,
      actor TEXT DEFAULT 'system'
    )
  `);

  // Migration: rebuild table when legacy constraints are detected.
  const tableInfo = database.prepare(
    "SELECT sql FROM sqlite_master WHERE type='table' AND name='memory_history'"
  ).get() as { sql: string } | undefined;
  if (tableInfo?.sql && (tableInfo.sql.includes('CHECK(actor IN') || tableInfo.sql.includes('FOREIGN KEY'))) {
    database.exec(`
      ALTER TABLE memory_history RENAME TO memory_history_old;
      CREATE TABLE memory_history (
        id TEXT PRIMARY KEY,
        memory_id INTEGER NOT NULL,
        prev_value TEXT,
        new_value TEXT,
        event TEXT NOT NULL CHECK(event IN ('ADD', 'UPDATE', 'DELETE')),
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_deleted INTEGER DEFAULT 0,
        actor TEXT DEFAULT 'system'
      );
      INSERT INTO memory_history SELECT * FROM memory_history_old;
      DROP TABLE memory_history_old;
    `);
  }

  database.exec(`
    CREATE TABLE IF NOT EXISTS checkpoints (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL,
      spec_folder TEXT,
      git_branch TEXT,
      memory_snapshot BLOB,
      file_snapshot BLOB,
      snapshot_format TEXT DEFAULT 'v1',
      snapshot_path TEXT,
      metadata TEXT
    )
  `);

  createMemoryConflictsTable(database);

  // Companion table indexes
  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_history_memory ON memory_history(memory_id, timestamp);
    CREATE INDEX IF NOT EXISTS idx_history_timestamp ON memory_history(timestamp DESC);
    CREATE INDEX IF NOT EXISTS idx_checkpoints_spec ON checkpoints(spec_folder);
  `);
  createMemoryConflictIndexes(database, 'ensureCompanionTables');
}

/**
 * Migrate session_state.spec_folder values using the old→new mapping
 * produced by the memory_index re-canonicalization in migration v23.
 */
function migrateSessionStateSpecFolders(
  database: Database.Database,
  updates: Array<{ canonical: string; oldSpecFolder: string }>
): void {
  if (!hasTable(database, 'session_state')) return;
  if (updates.length === 0) return;

  // Build old→new mapping, keep only unambiguous 1:1 mappings
  const mapping = new Map<string, Set<string>>();
  for (const u of updates) {
    if (!mapping.has(u.oldSpecFolder)) mapping.set(u.oldSpecFolder, new Set());
    mapping.get(u.oldSpecFolder)!.add(u.canonical);
  }

  const updateStmt = database.prepare(
    'UPDATE session_state SET spec_folder = ? WHERE session_id = ? AND spec_folder = ?'
  );

  const sessionRows = database.prepare(
    `SELECT session_id, spec_folder FROM session_state WHERE spec_folder IS NOT NULL`
  ).all() as Array<{ session_id: string; spec_folder: string }>;

  let updated = 0;
  for (const row of sessionRows) {
    const targets = mapping.get(row.spec_folder);
    if (targets && targets.size === 1) {
      const canonical = [...targets][0];
      updateStmt.run(canonical, row.session_id, row.spec_folder);
      updated++;
    } else if (targets && targets.size > 1) {
      logger.warn(`Migration v23: Ambiguous session_state mapping for "${row.spec_folder}". Skipping.`);
    }
  }

  if (updated > 0) {
    logger.info(`Migration v23: Updated spec_folder for ${updated} session_state rows`);
  }
}

function migrateHistorySpecFolders(
  database: Database.Database,
  updates: Array<{ canonical: string; oldSpecFolder: string }>
): void {
  if (!hasTable(database, 'memory_history')) return;
  if (!getTableColumns(database, 'memory_history').includes('spec_folder')) return;
  if (updates.length === 0) return;

  const mapping = new Map<string, Set<string>>();
  for (const update of updates) {
    if (!mapping.has(update.oldSpecFolder)) {
      mapping.set(update.oldSpecFolder, new Set());
    }
    mapping.get(update.oldSpecFolder)!.add(update.canonical);
  }

  const updateStmt = database.prepare(
    'UPDATE memory_history SET spec_folder = ? WHERE rowid = ? AND spec_folder = ?'
  );
  const historyRows = database.prepare(`
    SELECT rowid AS history_rowid, spec_folder
    FROM memory_history
    WHERE spec_folder IS NOT NULL
      AND trim(spec_folder) <> ''
  `).all() as Array<{ history_rowid: number; spec_folder: string }>;

  let updatedRows = 0;
  for (const row of historyRows) {
    const targets = mapping.get(row.spec_folder);
    if (targets && targets.size === 1) {
      const canonical = [...targets][0];
      updateStmt.run(canonical, row.history_rowid, row.spec_folder);
      updatedRows++;
    } else if (targets && targets.size > 1) {
      logger.warn(`Migration v23: Ambiguous memory_history mapping for "${row.spec_folder}". Skipping.`);
    }
  }

  if (updatedRows > 0) {
    logger.info(`Migration v23: Updated spec_folder for ${updatedRows} memory_history rows`);
  }
}

// Create database schema
/**
 * Creates or upgrades the vector-index schema.
 * @param database - The database connection to initialize.
 * @param options - Schema creation options.
 * @returns Nothing.
 */
export function create_schema(
  database: Database.Database,
  options: { sqlite_vec_available: boolean; get_embedding_dim: () => number }
): void {
  const { sqlite_vec_available, get_embedding_dim } = options;

  const table_exists = database.prepare(`
    SELECT name FROM sqlite_master
    WHERE type='table' AND name='memory_index'
  `).get();

  if (table_exists) {
    migrate_confidence_columns(database);
    migrate_constitutional_tier(database);
    ensure_canonical_file_path_support(database);
    create_common_indexes(database);
    ensureCompanionTables(database);
    ensureLineageTables(database);
    ensureGovernanceTables(database);
    ensureCausalEdgeTombstoneSchema(database, 'create_schema');
    ensureMemoryTriggerEmbeddingsSchema(database, 'create_schema');
    if (hasTable(database, 'causal_edges')) {
      ensureDerivedIdProvenanceSchema(database, 'create_schema');
    }
    ensureRetentionForgettingSchema(database, 'create_schema');
    ensureSemanticEdgeLayerSchema(database, 'create_schema');
    const compatibility = validate_backward_compatibility(database);
    if (!compatibility.compatible) {
      logger.warn(
        'Existing schema is not fully backward-compatible after bootstrap',
        compatibility as unknown as Record<string, unknown>
      );
    }
    // the rollout — embedding cache table must exist before any
    // Save/index operation so lookupEmbedding() can skip redundant provider calls.
    ensureEmbeddingCacheSchema(database);
    return;
  }

  // Create memory_index table (metadata only)
  database.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY,
      spec_folder TEXT NOT NULL,
      file_path TEXT NOT NULL,
      canonical_file_path TEXT,
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
      tenant_id TEXT,
      user_id TEXT,
      agent_id TEXT,
      session_id TEXT,
      context_type TEXT DEFAULT 'general' CHECK(context_type IN ('research', 'implementation', 'planning', 'general')),
      channel TEXT DEFAULT 'default',
      content_hash TEXT,
      provenance_source TEXT,
      provenance_actor TEXT,
      source_kind TEXT NOT NULL DEFAULT 'system' CHECK(source_kind IN ('human', 'agent', 'system', 'import', 'feedback')),
      governed_at TEXT,
      retention_policy TEXT DEFAULT 'keep',
      delete_after TEXT,
      deleted_at TEXT,
      retention_trust_score REAL,
      governance_metadata TEXT,
      expires_at DATETIME,
      confidence REAL DEFAULT 0.5,
      validation_count INTEGER DEFAULT 0,
      -- FSRS (Free Spaced Repetition Scheduler) columns for cognitive memory
      stability REAL DEFAULT 1.0,
      difficulty REAL DEFAULT 5.0,
      last_review TEXT,
      review_count INTEGER DEFAULT 0,
      file_mtime_ms INTEGER,
      -- DEPRECATED post-026.018 cleanup: archived-tier removed. Column kept to
      -- DEPRECATED schema stability: new rows always have is_archived = 0 and
      -- query paths must not branch on this column.
      is_archived INTEGER DEFAULT 0, -- DEPRECATED schema stability
      document_type TEXT DEFAULT 'memory',
      spec_level INTEGER,
      content_text TEXT,
      quality_score REAL DEFAULT 0,
      quality_flags TEXT,
      parent_id INTEGER REFERENCES memory_index(id) ON DELETE CASCADE,
      chunk_index INTEGER,
      chunk_label TEXT,
      chunk_id TEXT,
      chunk_fingerprint TEXT,
      chunk_kind TEXT,
      chunk_start_line INTEGER,
      chunk_end_line INTEGER,
      encoding_intent TEXT DEFAULT 'document',
      learned_triggers TEXT DEFAULT '[]',
      interference_score REAL DEFAULT 0,
      post_insert_enrichment_status TEXT NOT NULL DEFAULT 'complete',
      post_insert_enrichment_state TEXT,
      post_insert_enrichment_completed_at TEXT,
      post_insert_enrichment_version INTEGER,
      near_duplicate_of TEXT,
      last_dedup_checked_at TEXT
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

  // Create companion tables
  ensureCompanionTables(database);
  ensureLineageTables(database);
  ensureGovernanceTables(database);
  ensureIncrementalIndexFoundationSchema(database, 'create_schema');
  ensureCausalEdgeTombstoneSchema(database, 'create_schema');
  ensureMemoryTriggerEmbeddingsSchema(database, 'create_schema');
  ensureIdempotencyReceiptSchema(database, 'create_schema');
  ensureRetentionForgettingSchema(database, 'create_schema');
  ensureSemanticEdgeLayerSchema(database, 'create_schema');

  // the rollout — create embedding_cache table
  ensureEmbeddingCacheSchema(database);

  // Create memory_index-specific indexes (not IF NOT EXISTS because this is a fresh DB)
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
    CREATE INDEX IF NOT EXISTS idx_memories_governed_scope ON memory_index(tenant_id, user_id, agent_id, session_id);
    CREATE INDEX IF NOT EXISTS idx_channel ON memory_index(channel);
    CREATE INDEX IF NOT EXISTS idx_spec_folder_created_at ON memory_index(spec_folder, created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_trigger_cache_source
      ON memory_index(embedding_status, id)
      WHERE embedding_status = 'success'
        AND trigger_phrases IS NOT NULL
        AND trigger_phrases != '[]'
        AND trigger_phrases != '';
  `);

  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_file_path ON memory_index(file_path);
    CREATE INDEX IF NOT EXISTS idx_canonical_file_path ON memory_index(canonical_file_path);
    CREATE INDEX IF NOT EXISTS idx_spec_canonical_path ON memory_index(spec_folder, canonical_file_path);
    CREATE INDEX IF NOT EXISTS idx_save_parent_canonical_path ON memory_index(spec_folder, canonical_file_path, id DESC)
      WHERE parent_id IS NULL;
    CREATE INDEX IF NOT EXISTS idx_content_hash ON memory_index(content_hash);
    CREATE INDEX IF NOT EXISTS idx_save_parent_content_hash_scope ON memory_index(
      spec_folder,
      content_hash,
      embedding_status,
      tenant_id,
      user_id,
      agent_id,
      session_id,
      id DESC
    )
      WHERE parent_id IS NULL;
    CREATE INDEX IF NOT EXISTS idx_last_accessed ON memory_index(last_accessed DESC);
    CREATE INDEX IF NOT EXISTS idx_file_mtime ON memory_index(file_mtime_ms);
    CREATE INDEX IF NOT EXISTS idx_document_type ON memory_index(document_type);
    CREATE INDEX IF NOT EXISTS idx_doc_type_folder ON memory_index(document_type, spec_folder);
    CREATE INDEX IF NOT EXISTS idx_quality_score ON memory_index(quality_score);
    CREATE INDEX IF NOT EXISTS idx_post_insert_enrichment_incomplete
      ON memory_index(post_insert_enrichment_status, id)
      WHERE post_insert_enrichment_status != 'complete';
    CREATE INDEX IF NOT EXISTS idx_memory_chunk_identity
      ON memory_index(file_path, chunk_id)
      WHERE chunk_id IS NOT NULL;
    CREATE INDEX IF NOT EXISTS idx_memory_chunk_fingerprint
      ON memory_index(chunk_fingerprint)
      WHERE chunk_fingerprint IS NOT NULL;
    CREATE INDEX IF NOT EXISTS idx_memory_active_recall
      ON memory_index(spec_folder, document_type, updated_at DESC, id DESC)
      WHERE deleted_at IS NULL;
    CREATE INDEX IF NOT EXISTS idx_memory_purgeable_retention
      ON memory_index(delete_after, deleted_at, id)
      WHERE deleted_at IS NOT NULL;
  `);

  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_stability ON memory_index(stability DESC);
    CREATE INDEX IF NOT EXISTS idx_last_review ON memory_index(last_review);
    CREATE INDEX IF NOT EXISTS idx_fsrs_retrieval ON memory_index(stability, difficulty, last_review);
  `);

  console.warn('[vector-index] Schema created successfully');
}

// CamelCase aliases for backward compatibility
export { ensure_schema_version as ensureSchemaVersion };
export { run_migrations as runMigrations };
export { create_schema as createSchema };
export { create_common_indexes as createCommonIndexes };
export { migrate_confidence_columns as migrateConfidenceColumns };
export { ensure_canonical_file_path_support as ensureCanonicalFilePathSupport };
export { migrate_constitutional_tier as migrateConstitutionalTier };
export { validate_backward_compatibility as validateBackwardCompatibility };
export { ensureMemoryTriggerEmbeddingsSchema as ensureMemoryTriggerEmbeddingsSchemaForTests };
export { ensureIdempotencyReceiptSchema as ensureIdempotencyReceiptSchemaForTests };

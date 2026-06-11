// ───────────────────────────────────────────────────────────────
// MODULE: Vector Index Store
// ───────────────────────────────────────────────────────────────
// Feature catalog: Hybrid search pipeline
// SEARCH: VECTOR INDEX
// TypeScript port of the vector index implementation.
// DECAY STRATEGY: Search-time temporal decay uses an
// FSRS-preferred strategy. Memories with FSRS review data (last_review
// IS NOT NULL, review_count > 0) use the FSRS v4 power-law formula:
// R(t) = (1 + 0.2346 * t / S)^(-0.5)
// Memories without review data fall back to half-life exponential:
// Weight * 0.5^(days / half_life_days)
// This ensures backward compatibility while aligning reviewed
// Memories with the canonical FSRS algorithm.

import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

import Database from 'better-sqlite3';
import * as sqliteVec from 'sqlite-vec';

import { getEmbeddingDimension } from '@spec-kit/shared/embeddings';
import {
  EmbeddingProfile,
} from '@spec-kit/shared/embeddings/profile';
import { getStartupEmbeddingProfile } from '@spec-kit/shared/embeddings/factory';

import { resolveDatabasePaths, SERVER_DIR } from '../../core/config.js';
import { computeInterferenceScoresBatch } from '../scoring/interference-scoring.js';
import { DEFAULT_ACTIVE_EMBEDDER, getActiveEmbedder } from '../embedders/schema.js';
import {
  recordVectorShardProbeFailure,
  recordVectorShardQuarantined,
  recordVectorShardRebuildFailed,
} from '../observability/retrieval-observability.js';
import { validateFilePath } from '../utils/path-security.js';
import {
  get_error_code,
  get_error_message,
  parse_trigger_phrases,
  VectorIndexError,
  VectorIndexErrorCode,
} from './vector-index-types.js';
import {
  create_schema,
  ensure_schema_version,
} from './vector-index-schema.js';
import { migrateLegacySingleDbToShardSync } from './db-shard-migration.js';
import type { MemoryRow } from './vector-index-types.js';

type SearchWeightsConfig = {
  maxTriggersPerMemory?: number;
  smartRanking?: {
    recencyWeight?: number;
    accessWeight?: number;
    relevanceWeight?: number;
  };
};

type RestoreJournalPhase = 'swap-pending' | 'swap-done';

type RestoreJournalFile = {
  formatVersion: 1;
  phase: RestoreJournalPhase;
  createdAt: string;
  checkpointName: string;
  liveMainPath: string;
  backupMainPath: string;
  snapshotMainPath: string;
  liveShardPath: string | null;
  backupShardPath: string | null;
  snapshotVecPath: string | null;
  shouldRestoreVec: boolean;
  liveShardPreexisted: boolean;
};

type VectorShardRepairPendingSentinelFile = {
  formatVersion: 1;
  createdAt: string;
  source: 'vector_shard_quarantine';
  reason: string;
  shardPath: string;
  quarantinePath: string;
  profile: {
    provider: string;
    model: string;
    dim: number;
    dtype: string | null;
  };
};

type VectorShardRepairPendingSentinel = {
  reason: string;
  quarantinePath: string | null;
};

type VectorShardRepairStateAssessment = {
  sentinel: VectorShardRepairPendingSentinel | null;
  shardComplete: boolean;
  orphanQuarantine: boolean;
};

type InitializeDbOptions = {
  skipRestoreRecovery?: boolean;
};

const RESTORE_JOURNAL_NAME = '.restore-journal.json';
const NEEDS_REBUILD_SENTINEL_NAME = '.needs-rebuild';
const VECTOR_SHARD_REPAIR_PENDING_SENTINEL_SUFFIX = '.repair-pending';

function loadSearchWeights(): SearchWeightsConfig {
  // SERVER_DIR points to dist/ at runtime; configs/ lives at the package root (dist/..)
  const candidates = [
    path.join(SERVER_DIR, 'configs', 'search-weights.json'),
    path.join(SERVER_DIR, '..', 'configs', 'search-weights.json'),
  ];
  for (const candidate of candidates) {
    try {
      return JSON.parse(fs.readFileSync(candidate, 'utf-8')) as SearchWeightsConfig;
    } catch {
      // Try next candidate
    }
  }
  return {};
}

let _search_weights: SearchWeightsConfig | null = null;

function getSearchWeights(): SearchWeightsConfig {
  if (_search_weights === null) {
    _search_weights = loadSearchWeights();
  }
  return _search_weights;
}

/** Loaded search weight configuration for vector-index ranking (lazy-loaded). */
export const search_weights: SearchWeightsConfig = {
  get maxTriggersPerMemory() {
    return getSearchWeights().maxTriggersPerMemory;
  },
  get smartRanking() {
    return getSearchWeights().smartRanking;
  },
};

/* ───────────────────────────────────────────────────────────────
   1. CONFIGURATION — Embedding Dimension
----------------------------------------------------------------*/

/** Default embedding dimension used by the vector index. */
export const EMBEDDING_DIM = getEmbeddingDimension();

/**
 * Gets the active embedding dimension for the current provider.
 * @returns The embedding dimension.
 */
export function get_embedding_dim(): number {
  return getEmbeddingDimension();
}

/**
 * Waits for the embedding provider to report a stable dimension.
 * @param timeout_ms - The maximum time to wait in milliseconds.
 * @returns A promise that resolves to the confirmed embedding dimension.
 */
export async function get_confirmed_embedding_dimension(timeout_ms = 5000): Promise<number> {
  const start = Date.now();
  while (Date.now() - start < timeout_ms) {
    const dim = get_embedding_dim();
    if (Number.isFinite(dim) && dim > 0) {
      return dim;
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  const fallbackDim = get_embedding_dim();
  console.warn(`[vector-index] Using embedding dimension ${fallbackDim} after timeout`);
  return fallbackDim;
}

type EmbeddingDimensionValidation = {
  valid: boolean;
  stored: number | null;
  current: number | null;
  reason?: string;
  warning?: string;
};

type StoredEmbeddingDimension = {
  existing_db: boolean;
  stored_dim: number | null;
  source: 'vec_metadata' | 'active_embedder_profile' | 'startup_profile' | 'vec_memories' | null;
  reason?: string;
};

function get_existing_embedding_dimension(
  database: Database.Database,
  options: { allowProfileFallback?: boolean } = {},
): StoredEmbeddingDimension {
  const allowProfileFallback = options.allowProfileFallback !== false;
  const schema_row = database.prepare(`
    SELECT name FROM sqlite_master WHERE type='table' AND name='memory_index'
  `).get();

  if (!schema_row) {
    return {
      existing_db: false,
      stored_dim: null,
      source: null,
      reason: 'No existing schema',
    };
  }

  const attached = database.prepare('PRAGMA database_list').all() as Array<{ name?: string }>;
  if (attached.some((entry) => entry.name === ACTIVE_VECTOR_SCHEMA)) {
    const shard_metadata_table = database.prepare(`
      SELECT name FROM ${ACTIVE_VECTOR_SCHEMA}.sqlite_master WHERE type='table' AND name='vec_metadata'
    `).get();

    if (shard_metadata_table) {
      const stored_row = database.prepare(`
        SELECT value FROM ${ACTIVE_VECTOR_SCHEMA}.vec_metadata WHERE key IN ('embedding_dim', 'dim')
        ORDER BY CASE key WHEN 'embedding_dim' THEN 0 ELSE 1 END
        LIMIT 1
      `).get() as { value: string } | undefined;

      if (stored_row) {
        const stored_dim = parseInt(stored_row.value, 10);
        if (Number.isFinite(stored_dim) && stored_dim > 0) {
          return {
            existing_db: true,
            stored_dim,
            source: 'vec_metadata',
          };
        }
      }
    }
  }

  const metadata_table = database.prepare(`
    SELECT name FROM sqlite_master WHERE type='table' AND name='vec_metadata'
  `).get();

  if (metadata_table) {
    const stored_row = database.prepare(`
      SELECT key, value FROM vec_metadata WHERE key IN ('embedding_dim', 'dim', 'active_embedder_dim')
      ORDER BY CASE key WHEN 'embedding_dim' THEN 0 WHEN 'dim' THEN 1 ELSE 2 END
      LIMIT 1
    `).get() as { key: string; value: string } | undefined;

    if (stored_row) {
      const stored_dim = parseInt(stored_row.value, 10);
      if (Number.isFinite(stored_dim) && stored_dim > 0) {
        return {
          existing_db: true,
          stored_dim,
          source: stored_row.key === 'active_embedder_dim' ? 'active_embedder_profile' : 'vec_metadata',
        };
      }
    }
  }

  if (allowProfileFallback) {
    const active = getActiveEmbedder(database);
    if (active.name !== DEFAULT_ACTIVE_EMBEDDER.name && active.dim > 0) {
      return {
        existing_db: true,
        stored_dim: active.dim,
        source: 'active_embedder_profile',
      };
    }

    const startupProfile = getStartupEmbeddingProfile();
    if (Number.isInteger(startupProfile.dim) && startupProfile.dim > 0) {
      return {
        existing_db: true,
        stored_dim: startupProfile.dim,
        source: 'startup_profile',
      };
    }
  }

  const vec_table = database.prepare(`
    SELECT sql FROM sqlite_master WHERE name='vec_memories'
  `).get() as { sql: string | null } | undefined;
  const vec_sql = typeof vec_table?.sql === 'string' ? vec_table.sql : null;
  const match = vec_sql?.match(/FLOAT\[(\d+)\]/i);

  if (match) {
    const stored_dim = parseInt(match[1], 10);
    if (Number.isFinite(stored_dim) && stored_dim > 0) {
      console.warn('[vector-index] Falling back to vec_memories schema text for embedding dimension; configure an active embedder profile to make dimension discovery authoritative.');
      return {
        existing_db: true,
        stored_dim,
        source: 'vec_memories',
      };
    }
  }

  return {
    existing_db: true,
    stored_dim: null,
    source: null,
    reason: 'No stored vector dimension found for existing schema',
  };
}

function validate_embedding_dimension_for_connection(
  database: Database.Database | null,
  _sqlite_vec_available: boolean,
): EmbeddingDimensionValidation {
  if (!database) {
    return { valid: true, stored: null, current: null, reason: 'No database' };
  }

  try {
    const active = getActiveEmbedder(database);
    const current_dim = active.name !== DEFAULT_ACTIVE_EMBEDDER.name && active.dim > 0
      ? active.dim
      : get_embedding_dim();
    const existing = get_existing_embedding_dimension(database);

    if (!existing.existing_db) {
      return { valid: true, stored: null, current: current_dim, reason: existing.reason };
    }

    if (existing.stored_dim == null) {
      return { valid: true, stored: null, current: current_dim, reason: existing.reason || 'No stored dimension' };
    }

    if (existing.stored_dim !== current_dim) {
      const SOURCE_LABELS = {
        vec_metadata: 'vec_metadata',
        active_embedder_profile: 'active embedder profile',
        startup_profile: 'startup embedding profile',
        vec_memories: 'vec_memories schema',
      };
      const source_label = existing.source ? SOURCE_LABELS[existing.source] : 'vec_memories schema';
      const warning = `EMBEDDING DIMENSION MISMATCH: Existing database stores ${existing.stored_dim}-dim vectors (${source_label}), ` +
        `but the active embedding configuration resolves to ${current_dim}. Refusing to bootstrap because vector search would fail. ` +
        `Solutions: 1) Delete database and re-index, 2) Set EMBEDDINGS_PROVIDER to match original, ` +
        `3) Let SPEC_KIT_DB_DIR auto-derive a profile-specific database, or set MEMORY_DB_PATH only for an intentional file override.`;
      console.error(`[vector-index] WARNING: ${warning}`);
      return { valid: false, stored: existing.stored_dim, current: current_dim, warning };
    }

    return { valid: true, stored: existing.stored_dim, current: current_dim };
  } catch (e: unknown) {
    console.warn('[vector-index] Dimension validation error:', get_error_message(e));
    return { valid: true, stored: null, current: get_embedding_dim(), reason: get_error_message(e) };
  }
}

/**
 * Validates that stored vector dimensions match the provider.
 * @returns The validation result.
 */
export function validate_embedding_dimension(): { valid: boolean; stored: number | null; current: number | null; reason?: string; warning?: string } {
  return validate_embedding_dimension_for_connection(db, sqlite_vec_available_flag);
}

/* ───────────────────────────────────────────────────────────────
   2. DATABASE PATH AND SECURITY
----------------------------------------------------------------*/

function get_default_db_path(): string {
  return process.env.MEMORY_DB_PATH || resolveDatabasePaths().databasePath;
}

/** Default path for the vector-index database file. */
export const DEFAULT_DB_PATH = process.env.MEMORY_DB_PATH
  || get_default_db_path();
const DB_PERMISSIONS = 0o600;

function resolve_database_path() {
  return process.env.MEMORY_DB_PATH || get_default_db_path();
}

export const ACTIVE_VECTOR_SCHEMA = 'active_vec';

type ActiveVectorSourceTelemetry = {
  canonical_path: string;
  shard_path: string;
  attached: boolean;
  profile: {
    provider: string;
    model: string;
    dim: number;
    dtype: string | null;
  };
};

function quote_sql_string(value: string): string {
  return `'${value.replace(/'/g, "''")}'`;
}

function quote_identifier(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

function get_database_file_path(database: Database.Database): string {
  const row = database.prepare('PRAGMA database_list').all()
    .find((entry: unknown) => (entry as { name?: string }).name === 'main') as { file?: string } | undefined;
  return row?.file && row.file.length > 0 ? row.file : db_path;
}

function resolve_database_base_dir(database: Database.Database): string {
  const filePath = get_database_file_path(database);
  if (!filePath || filePath === ':memory:') {
    return resolveDatabasePaths().databaseDir;
  }
  return path.dirname(filePath);
}

function legacy_profile_database_path(profile: EmbeddingProfile, baseDir: string): string {
  return path.join(baseDir, `context-index__${profile.slug}.sqlite`);
}

function get_vector_shard_path(profile: EmbeddingProfile, baseDir: string): string {
  const vectorDir = path.join(baseDir, 'vectors');
  if (!fs.existsSync(vectorDir)) {
    fs.mkdirSync(vectorDir, { recursive: true, mode: 0o700 });
  }
  return path.join(vectorDir, `context-vectors__${profile.slug}.sqlite`);
}

function resolve_profile_for_active_embedder(database: Database.Database): EmbeddingProfile {
  const active = getActiveEmbedder(database);
  if (active.name !== DEFAULT_ACTIVE_EMBEDDER.name && active.dim > 0) {
    const startup = getStartupEmbeddingProfile();
    return new EmbeddingProfile({
      provider: active.provider ?? startup.provider,
      model: active.name,
      dim: active.dim,
      dtype: null,
      baseUrl: startup.baseUrl,
    });
  }
  return getStartupEmbeddingProfile();
}

function vector_table_name_for_profile(profile: EmbeddingProfile): string {
  return `vec_${profile.dim}`;
}

function active_schema_table(tableName: string): string {
  return `${ACTIVE_VECTOR_SCHEMA}.${tableName}`;
}

export function activeVectorSource(tableName?: string): string {
  return tableName ? active_schema_table(tableName) : ACTIVE_VECTOR_SCHEMA;
}

function get_attached_vector_path(database: Database.Database): string | null {
  const attached = database.prepare('PRAGMA database_list').all() as Array<{ name?: string; file?: string }>;
  const row = attached.find((entry) => entry.name === ACTIVE_VECTOR_SCHEMA);
  return row?.file ? path.resolve(row.file) : null;
}

function table_exists_in_schema(database: Database.Database, schema: string, tableName: string): boolean {
  const row = database.prepare(`
    SELECT 1 AS found
    FROM ${quote_identifier(schema)}.sqlite_master
    WHERE type IN ('table', 'view') AND name = ?
    LIMIT 1
  `).get(tableName) as { found?: number } | undefined;
  return row?.found === 1;
}

type VectorShardIntegrityProbeResult =
  | { ok: true }
  | { ok: false; reason: string };

function quick_check_verdict(database: Database.Database, schema?: string): string {
  const rows = schema
    ? database.pragma(`${schema}.quick_check(1)`) as Array<Record<string, unknown>>
    : database.pragma('quick_check(1)') as Array<Record<string, unknown>>;
  const first = rows?.[0] ? Object.values(rows[0])[0] : undefined;
  return typeof first === 'string' ? first : 'quick_check returned no verdict';
}

function required_vector_shard_tables(profile: EmbeddingProfile, vecAvailable: boolean): string[] {
  return [
    'vec_metadata',
    'embedding_cache',
    vector_table_name_for_profile(profile),
    ...(vecAvailable ? ['vec_memories'] : []),
  ];
}

function run_attached_vector_shard_integrity_probe(
  database: Database.Database,
  profile: EmbeddingProfile,
  vecAvailable: boolean,
): VectorShardIntegrityProbeResult {
  try {
    const verdict = quick_check_verdict(database, ACTIVE_VECTOR_SCHEMA);
    if (verdict !== 'ok') {
      return { ok: false, reason: `quick_check failed: ${verdict}` };
    }
    for (const tableName of required_vector_shard_tables(profile, vecAvailable)) {
      if (!table_exists_in_schema(database, ACTIVE_VECTOR_SCHEMA, tableName)) {
        return { ok: false, reason: `required table missing: ${tableName}` };
      }
    }
    return { ok: true };
  } catch (error: unknown) {
    return { ok: false, reason: get_error_message(error) };
  }
}

function run_vector_shard_integrity_probe_at_path(
  shardPath: string,
  profile: EmbeddingProfile,
  vecAvailable: boolean,
): VectorShardIntegrityProbeResult {
  if (!fs.existsSync(shardPath)) {
    return { ok: true };
  }

  let shard: Database.Database | null = null;
  try {
    shard = new Database(shardPath, { readonly: true, fileMustExist: true });
    if (vecAvailable) {
      sqliteVec.load(shard);
    }
    const verdict = quick_check_verdict(shard);
    if (verdict !== 'ok') {
      return { ok: false, reason: `quick_check failed: ${verdict}` };
    }
    for (const tableName of required_vector_shard_tables(profile, vecAvailable)) {
      const row = shard.prepare(`
        SELECT 1 AS found
        FROM sqlite_master
        WHERE type IN ('table', 'view') AND name = ?
        LIMIT 1
      `).get(tableName) as { found?: number } | undefined;
      if (row?.found !== 1) {
        return { ok: false, reason: `required table missing: ${tableName}` };
      }
    }
    return { ok: true };
  } catch (error: unknown) {
    return { ok: false, reason: get_error_message(error) };
  } finally {
    if (shard) {
      try { shard.close(); } catch (_error: unknown) { /* best-effort */ }
    }
  }
}

function count_successful_embedding_rows(database: Database.Database): number {
  try {
    const row = database.prepare(`
      SELECT COUNT(*) AS count
      FROM memory_index
      WHERE embedding_status = 'success'
    `).get() as { count?: number } | undefined;
    return Math.max(0, Number(row?.count ?? 0));
  } catch (_error: unknown) {
    return 0;
  }
}

function count_attached_vector_rows(database: Database.Database, profile: EmbeddingProfile): number {
  const tableName = vector_table_name_for_profile(profile);
  if (!table_exists_in_schema(database, ACTIVE_VECTOR_SCHEMA, tableName)) {
    return 0;
  }
  try {
    const row = database.prepare(`
      SELECT COUNT(*) AS count
      FROM ${ACTIVE_VECTOR_SCHEMA}.${quote_identifier(tableName)}
    `).get() as { count?: number } | undefined;
    return Math.max(0, Number(row?.count ?? 0));
  } catch (_error: unknown) {
    return 0;
  }
}

function count_vector_rows_at_path(shardPath: string, profile: EmbeddingProfile): number {
  if (!fs.existsSync(shardPath)) {
    return 0;
  }

  const tableName = vector_table_name_for_profile(profile);
  let shard: Database.Database | null = null;
  try {
    shard = new Database(shardPath, { readonly: true, fileMustExist: true });
    const table = shard.prepare(`
      SELECT 1 AS found
      FROM sqlite_master
      WHERE type IN ('table', 'view') AND name = ?
      LIMIT 1
    `).get(tableName) as { found?: number } | undefined;
    if (table?.found !== 1) {
      return 0;
    }
    const row = shard.prepare(`
      SELECT COUNT(*) AS count
      FROM ${quote_identifier(tableName)}
    `).get() as { count?: number } | undefined;
    return Math.max(0, Number(row?.count ?? 0));
  } catch (_error: unknown) {
    return 0;
  } finally {
    if (shard) {
      try { shard.close(); } catch (_error: unknown) { /* best-effort */ }
    }
  }
}

function has_orphan_vector_shard_quarantine(shardPath: string): boolean {
  try {
    const shardDir = path.dirname(shardPath);
    const quarantinePrefix = `${path.basename(shardPath)}.quarantined-`;
    return fs.readdirSync(shardDir).some((name) => name.startsWith(quarantinePrefix));
  } catch (_error: unknown) {
    return false;
  }
}

function assess_vector_shard_repair_state(
  database: Database.Database,
  profile: EmbeddingProfile,
  shardPath: string,
): VectorShardRepairStateAssessment {
  const sentinel = read_vector_shard_repair_pending_sentinel(shardPath);
  const attachedPath = get_attached_vector_path(database);
  const attached = attachedPath === path.resolve(shardPath);
  const probe = attached
    ? run_attached_vector_shard_integrity_probe(database, profile, sqlite_vec_available_flag)
    : run_vector_shard_integrity_probe_at_path(shardPath, profile, sqlite_vec_available_flag);
  const expected = count_successful_embedding_rows(database);
  const vecRows = probe.ok
    ? attached
      ? count_attached_vector_rows(database, profile)
      : count_vector_rows_at_path(shardPath, profile)
    : 0;
  const shardComplete = probe.ok && (expected === 0 || vecRows >= expected);
  const orphanQuarantine = !shardComplete && !sentinel && has_orphan_vector_shard_quarantine(shardPath);

  return { sentinel, shardComplete, orphanQuarantine };
}

function build_vector_shard_quarantine_path(shardPath: string): string {
  const stamp = new Date().toISOString().replace(/[^0-9A-Za-z]/g, '');
  return `${shardPath}.quarantined-${stamp}-${process.pid}`;
}

function quarantine_vector_shard(
  shardPath: string,
  reason: string,
  quarantinePath = build_vector_shard_quarantine_path(shardPath),
  sentinelPersisted = true,
): string {
  for (const suffix of ['', '-wal', '-shm']) {
    const source = `${shardPath}${suffix}`;
    if (!fs.existsSync(source)) {
      continue;
    }
    fs.renameSync(source, `${quarantinePath}${suffix}`);
  }
  fsync_file_if_possible(quarantinePath);
  fsync_directory_if_possible(path.dirname(shardPath));
  recordVectorShardQuarantined({ shardPath, quarantinePath, reason, sentinelPersisted });
  return quarantinePath;
}

function handle_vector_shard_repair_assessment(
  database: Database.Database,
  profile: EmbeddingProfile,
  shardPath: string,
  assessment: VectorShardRepairStateAssessment,
): void {
  if (assessment.sentinel) {
    if (assessment.shardComplete) {
      clear_vector_shard_repair_pending_sentinel(shardPath);
      console.warn('[vector-index] Cleared stale vector shard repair sentinel after shard completeness check');
      return;
    }
    resume_vector_shard_repair_from_sentinel(database, profile, shardPath, assessment.sentinel);
    return;
  }

  if (assessment.orphanQuarantine) {
    const reason = 'orphan quarantine artifacts without sentinel';
    console.warn(`[vector-index] Scheduling vector shard repair: ${reason}`);
    schedule_vector_shard_rebuild(database, profile, shardPath, reason);
  }
}

function schedule_vector_shard_rebuild(
  database: Database.Database,
  profile: EmbeddingProfile,
  shardPath: string,
  reason: string,
): void {
  setImmediate(() => {
    void import('../embedders/reindex.js')
      .then(({ startVectorShardRepairReindex }) => {
        startVectorShardRepairReindex(profile, { db: database, reason, shardPath });
      })
      .catch((error: unknown) => {
        recordVectorShardRebuildFailed({
          jobId: 'not-started',
          shardPath,
          reason: get_error_message(error),
        });
      });
  });
}

function quarantine_and_rebuild_vector_shard(
  database: Database.Database,
  profile: EmbeddingProfile,
  shardPath: string,
  reason: string,
): void {
  let effectiveReason = reason;
  recordVectorShardProbeFailure({ shardPath, reason: effectiveReason });
  const quarantinePath = build_vector_shard_quarantine_path(shardPath);
  const sentinelPersisted = write_vector_shard_repair_pending_sentinel(shardPath, profile, reason, quarantinePath);
  if (!sentinelPersisted) {
    effectiveReason = `${reason}; repair sentinel write FAILED - restart durability at risk`;
    console.error(`[vector-index] Vector shard repair sentinel write failed for ${path.basename(shardPath)}; restart durability at risk`);
  }
  quarantine_vector_shard(shardPath, effectiveReason, quarantinePath, sentinelPersisted);
  schedule_vector_shard_rebuild(database, profile, shardPath, `${effectiveReason}; quarantined as ${path.basename(quarantinePath)}`);
}

function write_shard_metadata(database: Database.Database, profile: EmbeddingProfile): void {
  database.exec(`
    CREATE TABLE IF NOT EXISTS ${ACTIVE_VECTOR_SCHEMA}.vec_metadata (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  const rows = database.prepare(`
    SELECT key, value
    FROM ${ACTIVE_VECTOR_SCHEMA}.vec_metadata
    WHERE key IN ('provider', 'model', 'dim', 'embedding_dim')
  `).all() as Array<{ key: string; value: string }>;
  const metadata = new Map(rows.map((row) => [row.key, row.value]));
  const mismatches = [
    ['provider', profile.provider],
    ['model', profile.model],
    ['dim', String(profile.dim)],
    ['embedding_dim', String(profile.dim)],
  ].filter(([key, expected]) => {
    const actual = metadata.get(key);
    return actual != null && actual.length > 0 && actual !== expected;
  });

  if (mismatches.length > 0) {
    const detail = mismatches.map(([key, expected]) => `${key}: expected ${expected}, got ${metadata.get(key)}`).join('; ');
    throw new VectorIndexError(
      `Attached vector shard metadata mismatch (${detail})`,
      VectorIndexErrorCode.INTEGRITY_ERROR,
    );
  }

  const upsert = database.prepare(`
    INSERT OR REPLACE INTO ${ACTIVE_VECTOR_SCHEMA}.vec_metadata (key, value)
    VALUES (?, ?)
  `);
  upsert.run('provider', profile.provider);
  upsert.run('model', profile.model);
  upsert.run('dim', String(profile.dim));
  upsert.run('embedding_dim', String(profile.dim));
}

function ensure_embedding_cache_table(database: Database.Database): void {
  database.exec(`
    CREATE TABLE IF NOT EXISTS ${ACTIVE_VECTOR_SCHEMA}.embedding_cache (
      content_hash TEXT NOT NULL,
      profile_key TEXT NOT NULL DEFAULT '',
      input_kind TEXT NOT NULL DEFAULT 'document' CHECK (input_kind IN ('document', 'query')),
      model_id TEXT NOT NULL,
      embedding BLOB NOT NULL,
      dimensions INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      last_used_at TEXT NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (content_hash, profile_key, input_kind, model_id, dimensions)
    )
  `);
}

function ensure_vector_shard_schema(database: Database.Database, profile: EmbeddingProfile): void {
  database.pragma(`${ACTIVE_VECTOR_SCHEMA}.journal_mode = WAL`);
  database.pragma(`${ACTIVE_VECTOR_SCHEMA}.cache_size = -8192`);
  database.pragma(`${ACTIVE_VECTOR_SCHEMA}.mmap_size = 33554432`);
  database.pragma(`${ACTIVE_VECTOR_SCHEMA}.temp_store = DEFAULT`);
  database.pragma(`${ACTIVE_VECTOR_SCHEMA}.wal_autocheckpoint = 256`);

  write_shard_metadata(database, profile);
  ensure_embedding_cache_table(database);

  const dimTableName = vector_table_name_for_profile(profile);
  database.exec(`
    CREATE TABLE IF NOT EXISTS ${ACTIVE_VECTOR_SCHEMA}.${quote_identifier(dimTableName)} (
      id INTEGER PRIMARY KEY,
      vec BLOB NOT NULL
    )
  `);

  if (sqlite_vec_available_flag && !table_exists_in_schema(database, ACTIVE_VECTOR_SCHEMA, 'vec_memories')) {
    database.exec(`
      CREATE VIRTUAL TABLE ${ACTIVE_VECTOR_SCHEMA}.vec_memories USING vec0(
        embedding FLOAT[${profile.dim}]
      )
    `);
  }
}

function drop_canonical_vector_payload_tables(database: Database.Database): void {
  for (const tableName of ['embedding_cache', 'vec_memories']) {
    try {
      database.exec(`DROP TABLE IF EXISTS main.${quote_identifier(tableName)}`);
    } catch (_error: unknown) {
      // Existing legacy virtual/shadow tables are migrated before this cleanup; failures are non-fatal.
    }
  }
  const rows = database.prepare(`
    SELECT name
    FROM main.sqlite_master
    WHERE type='table'
      AND (name LIKE 'vec\\_%' ESCAPE '\\' OR name LIKE 'vec_memories\\_%' ESCAPE '\\')
  `).all() as Array<{ name: string }>;
  for (const row of rows) {
    if (row.name === 'vec_metadata') {
      continue;
    }
    try {
      database.exec(`DROP TABLE IF EXISTS main.${quote_identifier(row.name)}`);
    } catch (_error: unknown) {
      // Best-effort canonical slimming. Query paths use active_vec after attach.
    }
  }
}

function create_legacy_temp_aliases(database: Database.Database, profile: EmbeddingProfile): void {
  const dimTableName = vector_table_name_for_profile(profile);
  try {
    database.exec(`
      DROP VIEW IF EXISTS temp.vec_memories;
      DROP TRIGGER IF EXISTS temp.vec_memories_insert;
      DROP TRIGGER IF EXISTS temp.vec_memories_delete;
      CREATE TEMP VIEW vec_memories AS
        SELECT rowid, embedding FROM ${ACTIVE_VECTOR_SCHEMA}.vec_memories;
      CREATE TEMP TRIGGER vec_memories_insert
      INSTEAD OF INSERT ON vec_memories
      BEGIN
        INSERT INTO ${ACTIVE_VECTOR_SCHEMA}.vec_memories(rowid, embedding)
        VALUES (CAST(new.rowid AS INTEGER), new.embedding);
      END;
      CREATE TEMP TRIGGER vec_memories_delete
      INSTEAD OF DELETE ON vec_memories
      BEGIN
        DELETE FROM ${ACTIVE_VECTOR_SCHEMA}.vec_memories WHERE rowid = old.rowid;
      END;
      DROP VIEW IF EXISTS temp.${quote_identifier(dimTableName)};
      DROP TRIGGER IF EXISTS temp.${quote_identifier(`${dimTableName}_insert`)};
      DROP TRIGGER IF EXISTS temp.${quote_identifier(`${dimTableName}_delete`)};
      CREATE TEMP VIEW ${quote_identifier(dimTableName)} AS
        SELECT id, vec FROM ${ACTIVE_VECTOR_SCHEMA}.${quote_identifier(dimTableName)};
      CREATE TEMP TRIGGER ${quote_identifier(`${dimTableName}_insert`)}
      INSTEAD OF INSERT ON ${quote_identifier(dimTableName)}
      BEGIN
        INSERT OR REPLACE INTO ${ACTIVE_VECTOR_SCHEMA}.${quote_identifier(dimTableName)}(id, vec)
        VALUES (new.id, new.vec);
      END;
      CREATE TEMP TRIGGER ${quote_identifier(`${dimTableName}_delete`)}
      INSTEAD OF DELETE ON ${quote_identifier(dimTableName)}
      BEGIN
        DELETE FROM ${ACTIVE_VECTOR_SCHEMA}.${quote_identifier(dimTableName)} WHERE id = old.id;
      END;
    `);
  } catch (error: unknown) {
    console.warn(`[vector-index] Could not create legacy vector temp aliases: ${get_error_message(error)}`);
  }
}

function drop_legacy_temp_aliases(database: Database.Database): void {
  try {
    const rows = database.prepare(`
      SELECT type, name
      FROM temp.sqlite_master
      WHERE name = 'vec_memories'
         OR name LIKE 'vec_memories\\_%' ESCAPE '\\'
         OR name LIKE 'vec\\_%' ESCAPE '\\'
    `).all() as Array<{ type: string; name: string }>;

    for (const row of rows) {
      if (row.type !== 'view' && row.type !== 'trigger') {
        continue;
      }
      database.exec(`DROP ${row.type.toUpperCase()} IF EXISTS temp.${quote_identifier(row.name)}`);
    }
  } catch (_error: unknown) {
    // Best-effort cleanup only.
  }
}

// Unified allowed paths
const ALLOWED_BASE_PATHS = [
  path.join(process.cwd(), 'specs'),
  path.join(process.cwd(), '.opencode'),
  path.join(os.homedir(), '.claude'),
  process.cwd(),
  ...(process.env.MEMORY_ALLOWED_PATHS ? process.env.MEMORY_ALLOWED_PATHS.split(path.delimiter) : [])
].filter(Boolean).map(p => path.resolve(p));

/**
 * Validates a file path against allowed local base paths.
 * @param file_path - The file path to validate.
 * @returns The validated file path, if allowed.
 */
export function validate_file_path_local(file_path: unknown): string | null {
  if (typeof file_path !== 'string') {
    return null;
  }

  return validateFilePath(file_path, ALLOWED_BASE_PATHS);
}

// Async version for non-blocking concurrent file reads
/**
 * Reads a file asynchronously after validating the path.
 * @param file_path - The file path to read.
 * @returns A promise that resolves to the file contents or an empty string.
 */
export async function safe_read_file_async(file_path: unknown): Promise<string> {
  const valid_path = validate_file_path_local(file_path);
  if (!valid_path) {
    return '';
  }

  try {
    return await fs.promises.readFile(valid_path, 'utf-8');
  } catch (err: unknown) {
    if (!(err instanceof Error && 'code' in err && get_error_code(err) === 'ENOENT')) {
      console.warn(`[vector-index] Could not read file ${valid_path}: ${get_error_message(err)}`);
    }
    return '';
  }
}

// Safely parse JSON with validation (CWE-502: Deserialization mitigation)
/**
 * Parses JSON with prototype-pollution safeguards.
 * @param json_string - The JSON string to parse.
 * @param default_value - The fallback value to return on failure.
 * @returns The parsed JSON value or the fallback.
 */
export function safe_parse_json(json_string: unknown, default_value = []): unknown {
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
  } catch (err: unknown) {
    console.warn(`[vector-index] JSON parse error: ${get_error_message(err)}`);
    return default_value;
  }
}

/* ───────────────────────────────────────────────────────────────
   3. DATABASE SINGLETON
----------------------------------------------------------------*/

let db: Database.Database | null = null;
let db_path = resolve_database_path();
let sqlite_vec_available_flag = true;
let active_vector_source: ActiveVectorSourceTelemetry | null = null;
// C1 FIX: Key connections by resolved DB path to prevent cross-store data corruption
const db_connections = new Map<string, Database.Database>();
const UNCLEAN_SHUTDOWN_MARKER = '.unclean-shutdown';
type DatabaseConnectionListener = (
  database: Database.Database,
  change: {
    previousDb: Database.Database | null;
    previousPath: string;
    nextPath: string;
  },
) => boolean | void;
const database_connection_listeners = new Set<DatabaseConnectionListener>();

function set_active_database_connection(
  connection: Database.Database,
  target_path: string,
  vec_available: boolean,
): void {
  const previousDb = db;
  const previousPath = db_path;
  db = connection;
  db_path = target_path;
  sqlite_vec_available_flag = vec_available;

  if (previousDb !== connection || previousPath !== target_path) {
    clear_constitutional_cache();

    const listenerErrors: string[] = [];
    for (const listener of database_connection_listeners) {
      try {
        const listenerResult = listener(connection, {
          previousDb,
          previousPath,
          nextPath: target_path,
        });
        if (listenerResult === false) {
          listenerErrors.push('listener returned false');
        }
      } catch (error: unknown) {
        const message = get_error_message(error);
        listenerErrors.push(message);
        console.warn(`[vector-index] Database connection listener failed: ${message}`);
      }
    }
    if (listenerErrors.length > 0) {
      throw new Error(`Database connection listener rebind failed: ${listenerErrors.join('; ')}`);
    }
  }

  if (target_path === ':memory:') {
    return;
  }

  try {
    fs.chmodSync(target_path, DB_PERMISSIONS);
  } catch (err: unknown) {
    console.warn(`[vector-index] Could not set permissions on ${target_path}: ${get_error_message(err)}`);
  }
}

function get_unclean_shutdown_marker_path(target_path: string): string | null {
  if (target_path === ':memory:') {
    return null;
  }
  return path.join(path.dirname(target_path), UNCLEAN_SHUTDOWN_MARKER);
}

function write_unclean_shutdown_marker(target_path: string): void {
  const marker_path = get_unclean_shutdown_marker_path(target_path);
  if (!marker_path) {
    return;
  }

  try {
    fs.writeFileSync(marker_path, `${JSON.stringify({
      pid: process.pid,
      databasePath: target_path,
      startedAt: new Date().toISOString(),
    })}\n`, { mode: 0o600 });
  } catch (_error: unknown) {
    // Best-effort: marker failure must not block DB startup.
  }
}

function remove_unclean_shutdown_marker(target_path: string): void {
  const marker_path = get_unclean_shutdown_marker_path(target_path);
  if (!marker_path) {
    return;
  }

  try {
    fs.rmSync(marker_path, { force: true });
  } catch (_error: unknown) {
    // Best-effort: marker cleanup must not block DB close.
  }
}

function remove_sqlite_sidecars(database_path: string): void {
  for (const sidecar_path of [`${database_path}-wal`, `${database_path}-shm`]) {
    fs.rmSync(sidecar_path, { force: true });
  }
}

function fsync_file_if_possible(file_path: string): void {
  let fd: number | null = null;
  try {
    fd = fs.openSync(file_path, 'r');
    fs.fsyncSync(fd);
  } catch (_error: unknown) {
    // Recovery remains journal-driven when the platform cannot flush explicitly.
  } finally {
    if (fd !== null) {
      try { fs.closeSync(fd); } catch (_error: unknown) { /* best-effort */ }
    }
  }
}

function fsync_directory_if_possible(dir_path: string): void {
  let fd: number | null = null;
  try {
    fd = fs.openSync(dir_path, 'r');
    fs.fsyncSync(fd);
  } catch (_error: unknown) {
    // Directory fsync is unavailable on some platforms/filesystems.
  } finally {
    if (fd !== null) {
      try { fs.closeSync(fd); } catch (_error: unknown) { /* best-effort */ }
    }
  }
}

function get_restore_journal_path(target_path: string): string | null {
  if (target_path === ':memory:') {
    return null;
  }
  return path.join(path.dirname(target_path), 'checkpoints', RESTORE_JOURNAL_NAME);
}

function get_needs_rebuild_sentinel_path(target_path: string): string | null {
  if (target_path === ':memory:') {
    return null;
  }
  return path.join(path.dirname(target_path), 'checkpoints', NEEDS_REBUILD_SENTINEL_NAME);
}

function get_vector_shard_repair_pending_sentinel_path(shardPath: string): string | null {
  if (shardPath === ':memory:') {
    return null;
  }
  const shardDir = path.dirname(shardPath);
  const baseDir = path.basename(shardDir) === 'vectors' ? path.dirname(shardDir) : shardDir;
  return path.join(
    baseDir,
    'checkpoints',
    `.${path.basename(shardPath)}${VECTOR_SHARD_REPAIR_PENDING_SENTINEL_SUFFIX}`,
  );
}

function write_vector_shard_repair_pending_sentinel(
  shardPath: string,
  profile: EmbeddingProfile,
  reason: string,
  quarantinePath: string,
): boolean {
  const sentinelPath = get_vector_shard_repair_pending_sentinel_path(shardPath);
  if (!sentinelPath) {
    return true;
  }
  try {
    const sentinelDir = path.dirname(sentinelPath);
    fs.mkdirSync(sentinelDir, { recursive: true, mode: 0o700 });
    const tempSentinelPath = `${sentinelPath}.tmp.${process.pid}`;
    fs.writeFileSync(tempSentinelPath, `${JSON.stringify({
      formatVersion: 1,
      createdAt: new Date().toISOString(),
      source: 'vector_shard_quarantine',
      reason,
      shardPath,
      quarantinePath,
      profile: {
        provider: profile.provider,
        model: profile.model,
        dim: profile.dim,
        dtype: profile.dtype,
      },
    } satisfies VectorShardRepairPendingSentinelFile, null, 2)}\n`, { mode: 0o600 });
    fsync_file_if_possible(tempSentinelPath);
    fs.renameSync(tempSentinelPath, sentinelPath);
    fsync_directory_if_possible(sentinelDir);
    return true;
  } catch (error: unknown) {
    console.warn(`[vector-index] Failed to write vector shard repair sentinel: ${get_error_message(error)}`);
    return false;
  }
}

function read_vector_shard_repair_pending_sentinel(
  shardPath: string,
): VectorShardRepairPendingSentinel | null {
  const sentinelPath = get_vector_shard_repair_pending_sentinel_path(shardPath);
  if (!sentinelPath || !fs.existsSync(sentinelPath)) {
    return null;
  }
  try {
    const parsed = JSON.parse(fs.readFileSync(sentinelPath, 'utf-8')) as Partial<VectorShardRepairPendingSentinelFile>;
    return {
      reason: typeof parsed.reason === 'string' && parsed.reason.length > 0
        ? parsed.reason
        : 'pending vector shard repair sentinel',
      quarantinePath: typeof parsed.quarantinePath === 'string' && parsed.quarantinePath.length > 0
        ? parsed.quarantinePath
        : null,
    };
  } catch (error: unknown) {
    console.warn(`[vector-index] Ignoring unreadable vector shard repair sentinel: ${get_error_message(error)}`);
    return { reason: 'unreadable vector shard repair sentinel', quarantinePath: null };
  }
}

export function clear_vector_shard_repair_pending_sentinel(shardPath: string): void {
  const sentinelPath = get_vector_shard_repair_pending_sentinel_path(shardPath);
  if (!sentinelPath || !fs.existsSync(sentinelPath)) {
    return;
  }
  try {
    fs.unlinkSync(sentinelPath);
    fsync_directory_if_possible(path.dirname(sentinelPath));
  } catch (error: unknown) {
    console.warn(`[vector-index] Failed to clear vector shard repair sentinel: ${get_error_message(error)}`);
  }
}

function resume_vector_shard_repair_from_sentinel(
  database: Database.Database,
  profile: EmbeddingProfile,
  shardPath: string,
  sentinel: { reason: string; quarantinePath: string | null },
): void {
  const reason = `${sentinel.reason}; pending vector shard repair sentinel`;
  recordVectorShardQuarantined({
    shardPath,
    quarantinePath: sentinel.quarantinePath ?? shardPath,
    reason,
    sentinelPersisted: true,
  });
  schedule_vector_shard_rebuild(database, profile, shardPath, reason);
}

function write_needs_rebuild_sentinel_for_recovered_restore(target_path: string, checkpoint_name: string): void {
  const sentinel_path = get_needs_rebuild_sentinel_path(target_path);
  if (!sentinel_path || fs.existsSync(sentinel_path)) {
    return;
  }

  try {
    const sentinel_dir = path.dirname(sentinel_path);
    const temp_sentinel_path = `${sentinel_path}.tmp`;
    fs.mkdirSync(sentinel_dir, { recursive: true, mode: 0o700 });
    fs.writeFileSync(temp_sentinel_path, `${JSON.stringify({
      formatVersion: 1,
      createdAt: new Date().toISOString(),
      source: 'swap_done_recovery',
      reason: 'completed restore journal recovered without derived rebuild evidence',
      checkpointName: checkpoint_name,
    }, null, 2)}\n`, { mode: 0o600 });
    fsync_file_if_possible(temp_sentinel_path);
    fs.renameSync(temp_sentinel_path, sentinel_path);
    fsync_directory_if_possible(sentinel_dir);
  } catch (error: unknown) {
    console.warn(`[vector-index] Failed to write checkpoint needs-rebuild sentinel during recovery: ${get_error_message(error)}`);
  }
}

function write_needs_rebuild_sentinel_for_corruption(target_path: string, detail: string): void {
  // Same atomic temp+rename discipline as the restore-recovery writer: a crash
  // mid-write must never leave a torn sentinel that half-triggers a rebuild.
  const sentinel_path = get_needs_rebuild_sentinel_path(target_path);
  if (!sentinel_path) {
    return;
  }
  try {
    const sentinel_dir = path.dirname(sentinel_path);
    fs.mkdirSync(sentinel_dir, { recursive: true });
    const temp_sentinel_path = `${sentinel_path}.tmp.${process.pid}`;
    fs.writeFileSync(temp_sentinel_path, `${JSON.stringify({
      formatVersion: 1,
      createdAt: new Date().toISOString(),
      source: 'post_crash_integrity_probe',
      reason: detail,
    }, null, 2)}\n`, { mode: 0o600 });
    fsync_file_if_possible(temp_sentinel_path);
    fs.renameSync(temp_sentinel_path, sentinel_path);
    fsync_directory_if_possible(sentinel_dir);
  } catch (error: unknown) {
    console.warn(`[vector-index] Failed to write needs-rebuild sentinel after integrity probe: ${get_error_message(error)}`);
  }
}

function read_restore_journal(journal_path: string): RestoreJournalFile | null {
  try {
    const parsed = JSON.parse(fs.readFileSync(journal_path, 'utf-8')) as Partial<RestoreJournalFile>;
    const phase = parsed.phase === 'swap-done' ? 'swap-done' : 'swap-pending';
    if (
      parsed.formatVersion !== 1
      || typeof parsed.createdAt !== 'string'
      || typeof parsed.checkpointName !== 'string'
      || typeof parsed.liveMainPath !== 'string'
      || typeof parsed.backupMainPath !== 'string'
      || typeof parsed.snapshotMainPath !== 'string'
      || (parsed.liveShardPath !== null && typeof parsed.liveShardPath !== 'string')
      || (parsed.backupShardPath !== null && typeof parsed.backupShardPath !== 'string')
      || (parsed.snapshotVecPath !== null && typeof parsed.snapshotVecPath !== 'string')
      || typeof parsed.shouldRestoreVec !== 'boolean'
      || (
        parsed.liveShardPreexisted !== undefined
        && typeof parsed.liveShardPreexisted !== 'boolean'
      )
    ) {
      throw new Error('restore journal shape is invalid');
    }
    return {
      ...parsed,
      phase,
      liveShardPreexisted: parsed.liveShardPreexisted
        ?? (parsed.shouldRestoreVec && typeof parsed.backupShardPath === 'string' && fs.existsSync(parsed.backupShardPath)),
    } as RestoreJournalFile;
  } catch (error: unknown) {
    console.warn(`[vector-index] Ignoring unreadable checkpoint restore journal: ${get_error_message(error)}`);
    return null;
  }
}

function merge_checkpoint_catalog_from_backup(live_main_path: string, backup_main_path: string): void {
  // A swap-done crash happens after the snapshot DB is in place but before the live
  // catalog rows (captured from the pre-swap DB) are re-merged in-process. The snapshot's
  // checkpoints table only reflects state at snapshot time, so post-snapshot catalog rows
  // would be lost when boot recovery deletes the .bak. Re-merge them here, reading the BLOB
  // payloads directly from the .bak so v1 inline snapshots keep full fidelity. Best-effort:
  // recovery must finalize even if the merge cannot run.
  if (!fs.existsSync(backup_main_path)) {
    return;
  }
  let live_db: Database.Database | null = null;
  let backup_db: Database.Database | null = null;
  try {
    backup_db = new Database(backup_main_path, { readonly: true });
    const catalog_exists = backup_db.prepare(
      "SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'checkpoints'",
    ).get() as { 1?: number } | undefined;
    if (!catalog_exists) {
      return;
    }
    const backup_rows = backup_db.prepare('SELECT * FROM checkpoints ORDER BY id ASC').all() as Array<Record<string, unknown>>;
    if (backup_rows.length === 0) {
      return;
    }

    live_db = new Database(live_main_path);
    const live_catalog_exists = live_db.prepare(
      "SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'checkpoints'",
    ).get() as { 1?: number } | undefined;
    if (!live_catalog_exists) {
      return;
    }
    const target_columns = new Set(
      (live_db.prepare('PRAGMA table_info("checkpoints")').all() as Array<{ name?: unknown }>)
        .map((column) => column.name)
        .filter((name): name is string => typeof name === 'string' && name.length > 0),
    );

    const merge = live_db.transaction((rows: Array<Record<string, unknown>>) => {
      for (const row of rows) {
        const name = row.name;
        if (typeof name !== 'string' || name.length === 0) {
          continue;
        }
        const existing_by_name = (live_db as Database.Database).prepare('SELECT id FROM checkpoints WHERE name = ?').get(name) as { id?: number } | undefined;
        if (existing_by_name?.id) {
          continue;
        }

        let columns = Object.keys(row).filter((column) => target_columns.has(column));
        const id = row.id;
        if (typeof id === 'number') {
          const existing_by_id = (live_db as Database.Database).prepare('SELECT name FROM checkpoints WHERE id = ?').get(id) as { name?: string } | undefined;
          if (existing_by_id?.name && existing_by_id.name !== name) {
            columns = columns.filter((column) => column !== 'id');
          }
        }
        if (columns.length === 0) {
          continue;
        }

        const placeholders = columns.map(() => '?').join(', ');
        (live_db as Database.Database).prepare(`
          INSERT OR IGNORE INTO checkpoints (${columns.join(', ')})
          VALUES (${placeholders})
        `).run(...columns.map((column) => row[column]));
      }
    });
    merge(backup_rows);
  } catch (error: unknown) {
    console.warn(`[vector-index] Failed to re-merge checkpoint catalog during swap-done recovery (non-fatal): ${get_error_message(error)}`);
  } finally {
    if (backup_db) {
      try { backup_db.close(); } catch (_error: unknown) { /* best-effort */ }
    }
    if (live_db) {
      try { live_db.close(); } catch (_error: unknown) { /* best-effort */ }
    }
  }
}

export function recover_interrupted_checkpoint_restore(target_path: string): boolean {
  const journal_path = get_restore_journal_path(target_path);
  if (!journal_path || !fs.existsSync(journal_path)) {
    return false;
  }

  const journal = read_restore_journal(journal_path);
  if (!journal) {
    return false;
  }

  if (journal.phase === 'swap-done') {
    // Re-merge any post-snapshot catalog rows from the .bak before deleting it; the
    // crashed in-process restore would have done this merge had it not been interrupted.
    merge_checkpoint_catalog_from_backup(journal.liveMainPath, journal.backupMainPath);
    fs.rmSync(journal.backupMainPath, { force: true });
    fsync_directory_if_possible(path.dirname(journal.backupMainPath));
    if (journal.shouldRestoreVec && journal.backupShardPath) {
      fs.rmSync(journal.backupShardPath, { force: true });
      fsync_directory_if_possible(path.dirname(journal.backupShardPath));
    }
    write_needs_rebuild_sentinel_for_recovered_restore(journal.liveMainPath, journal.checkpointName);
    fs.rmSync(journal_path, { force: true });
    fsync_directory_if_possible(path.dirname(journal_path));
    console.warn('[vector-index] Finalized completed checkpoint restore from rollback journal');
    return true;
  }

  remove_sqlite_sidecars(journal.liveMainPath);
  if (fs.existsSync(journal.backupMainPath)) {
    fs.rmSync(journal.liveMainPath, { force: true });
    fs.renameSync(journal.backupMainPath, journal.liveMainPath);
    fsync_file_if_possible(journal.liveMainPath);
    fsync_directory_if_possible(path.dirname(journal.liveMainPath));
  }

  if (journal.shouldRestoreVec && journal.liveShardPath) {
    remove_sqlite_sidecars(journal.liveShardPath);
    if (journal.liveShardPreexisted && journal.backupShardPath && fs.existsSync(journal.backupShardPath)) {
      fs.rmSync(journal.liveShardPath, { force: true });
      fs.renameSync(journal.backupShardPath, journal.liveShardPath);
      fsync_file_if_possible(journal.liveShardPath);
      fsync_directory_if_possible(path.dirname(journal.liveShardPath));
    } else if (!journal.liveShardPreexisted) {
      fs.rmSync(journal.liveShardPath, { force: true });
      fsync_directory_if_possible(path.dirname(journal.liveShardPath));
    }
  }

  fs.rmSync(journal_path, { force: true });
  fsync_directory_if_possible(path.dirname(journal_path));
  console.warn('[vector-index] Recovered interrupted checkpoint restore from rollback journal');
  return true;
}

export function migrate_active_legacy_profile_database(
  canonicalPath: string,
  profile: EmbeddingProfile,
): void {
  if (canonicalPath === ':memory:') {
    return;
  }

  const baseDir = path.dirname(canonicalPath);
  const shardPath = get_vector_shard_path(profile, baseDir);
  const legacyPath = legacy_profile_database_path(profile, baseDir);
  if (path.resolve(legacyPath) === path.resolve(canonicalPath)) {
    return;
  }

  migrateLegacySingleDbToShardSync(legacyPath, canonicalPath, shardPath, profile);
}

export function attachActiveVectorShard(database: Database.Database, profile: EmbeddingProfile): void {
  try {
    sqliteVec.load(database);
    sqlite_vec_available_flag = true;
  } catch (_error: unknown) {
    sqlite_vec_available_flag = false;
  }
  database.pragma('journal_mode = WAL');
  const canonicalPath = get_database_file_path(database);
  const baseDir = resolve_database_base_dir(database);
  const shardPath = get_vector_shard_path(profile, baseDir);
  const attachedPath = get_attached_vector_path(database);

  if (attachedPath && attachedPath !== path.resolve(shardPath)) {
    drop_legacy_temp_aliases(database);
    database.exec(`DETACH DATABASE ${ACTIVE_VECTOR_SCHEMA}`);
  } else if (attachedPath === path.resolve(shardPath)) {
    const probe = run_attached_vector_shard_integrity_probe(database, profile, sqlite_vec_available_flag);
    if (!probe.ok) {
      drop_legacy_temp_aliases(database);
      database.exec(`DETACH DATABASE ${ACTIVE_VECTOR_SCHEMA}`);
      quarantine_and_rebuild_vector_shard(database, profile, shardPath, probe.reason);
      database.exec(`ATTACH DATABASE ${quote_sql_string(shardPath)} AS ${ACTIVE_VECTOR_SCHEMA}`);
      ensure_vector_shard_schema(database, profile);
      drop_canonical_vector_payload_tables(database);
      create_legacy_temp_aliases(database, profile);
      active_vector_source = {
        canonical_path: canonicalPath,
        shard_path: shardPath,
        attached: true,
        profile: {
          provider: profile.provider,
          model: profile.model,
          dim: profile.dim,
          dtype: profile.dtype,
        },
      };
      return;
    }
    handle_vector_shard_repair_assessment(
      database,
      profile,
      shardPath,
      assess_vector_shard_repair_state(database, profile, shardPath),
    );
    ensure_vector_shard_schema(database, profile);
    drop_canonical_vector_payload_tables(database);
    create_legacy_temp_aliases(database, profile);
    active_vector_source = {
      canonical_path: canonicalPath,
      shard_path: shardPath,
      attached: true,
      profile: {
        provider: profile.provider,
        model: profile.model,
        dim: profile.dim,
        dtype: profile.dtype,
      },
    };
    return;
  }

  const shardExistedBeforeAttach = fs.existsSync(shardPath);
  const preAttachProbe = run_vector_shard_integrity_probe_at_path(shardPath, profile, sqlite_vec_available_flag);
  let needsPostAttachProbe = shardExistedBeforeAttach && preAttachProbe.ok;
  if (!preAttachProbe.ok) {
    quarantine_and_rebuild_vector_shard(database, profile, shardPath, preAttachProbe.reason);
    needsPostAttachProbe = false;
  } else {
    handle_vector_shard_repair_assessment(
      database,
      profile,
      shardPath,
      assess_vector_shard_repair_state(database, profile, shardPath),
    );
  }

  try {
    database.exec(`ATTACH DATABASE ${quote_sql_string(shardPath)} AS ${ACTIVE_VECTOR_SCHEMA}`);
  } catch (attachError: unknown) {
    const reason = get_error_message(attachError);
    if (!fs.existsSync(shardPath)) {
      throw attachError;
    }
    quarantine_and_rebuild_vector_shard(database, profile, shardPath, reason);
    needsPostAttachProbe = false;
    database.exec(`ATTACH DATABASE ${quote_sql_string(shardPath)} AS ${ACTIVE_VECTOR_SCHEMA}`);
  }

  if (needsPostAttachProbe) {
    const attachedProbe = run_attached_vector_shard_integrity_probe(database, profile, sqlite_vec_available_flag);
    if (!attachedProbe.ok) {
      drop_legacy_temp_aliases(database);
      database.exec(`DETACH DATABASE ${ACTIVE_VECTOR_SCHEMA}`);
      quarantine_and_rebuild_vector_shard(database, profile, shardPath, attachedProbe.reason);
      database.exec(`ATTACH DATABASE ${quote_sql_string(shardPath)} AS ${ACTIVE_VECTOR_SCHEMA}`);
    }
  }
  ensure_vector_shard_schema(database, profile);
  drop_canonical_vector_payload_tables(database);
  create_legacy_temp_aliases(database, profile);
  active_vector_source = {
    canonical_path: canonicalPath,
    shard_path: shardPath,
    attached: true,
    profile: {
      provider: profile.provider,
      model: profile.model,
      dim: profile.dim,
      dtype: profile.dtype,
    },
  };
}

export function attachActiveVectorShardForActiveProfile(database: Database.Database): void {
  attachActiveVectorShard(database, resolve_profile_for_active_embedder(database));
}

export function detachActiveVectorShard(database: Database.Database): void {
  drop_legacy_temp_aliases(database);

  if (get_attached_vector_path(database)) {
    database.exec(`DETACH DATABASE ${ACTIVE_VECTOR_SCHEMA}`);
  }

  if (active_vector_source) {
    active_vector_source = { ...active_vector_source, attached: false };
  }
}

export function getActiveVectorSource(): ActiveVectorSourceTelemetry {
  if (db) {
    const profile = resolve_profile_for_active_embedder(db);
    const canonicalPath = get_database_file_path(db);
    const baseDir = resolve_database_base_dir(db);
    const shardPath = get_vector_shard_path(profile, baseDir);
    const attached = get_attached_vector_path(db) === path.resolve(shardPath);
    active_vector_source = {
      canonical_path: canonicalPath,
      shard_path: shardPath,
      attached,
      profile: {
        provider: profile.provider,
        model: profile.model,
        dim: profile.dim,
        dtype: profile.dtype,
      },
    };
  }

  return active_vector_source ?? {
    canonical_path: db_path,
    shard_path: '',
    attached: false,
    profile: {
      provider: '',
      model: '',
      dim: get_embedding_dim(),
      dtype: null,
    },
  };
}

/** Accessor for sqlite_vec_available (used by other modules) */
export function sqlite_vec_available(): boolean {
  return sqlite_vec_available_flag;
}

export function on_database_connection_change(listener: DatabaseConnectionListener): () => void {
  database_connection_listeners.add(listener);
  return () => {
    database_connection_listeners.delete(listener);
  };
}

const constitutional_cache = new Map<string, { data: MemoryRow[]; timestamp: number }>();
const CONSTITUTIONAL_CACHE_TTL = 300000;
const CONSTITUTIONAL_CACHE_MAX_KEYS = 50;

// Track which cache keys are currently being loaded
const constitutional_cache_loading = new Map<string, boolean>();

let last_db_mod_time = 0;
let last_constitutional_cache_db_path: string | null = null;

function get_constitutional_cache_db_scope(): string {
  if (db_path === ':memory:') {
    return db_path;
  }

  return path.resolve(db_path);
}

function build_constitutional_cache_key(
  spec_folder: string | null,
  includeArchived: boolean,
): string {
  const db_scope = get_constitutional_cache_db_scope();
  return `${db_scope}::${spec_folder || 'global'}:${includeArchived ? 'arch' : 'noarch'}`;
}

function refresh_constitutional_cache_db_state(): void {
  const current_db_path = get_constitutional_cache_db_scope();
  last_constitutional_cache_db_path = current_db_path;

  if (current_db_path === ':memory:' || !fs.existsSync(current_db_path)) {
    last_db_mod_time = 0;
    return;
  }

  last_db_mod_time = fs.statSync(current_db_path).mtimeMs;
}

function is_constitutional_cache_valid() {
  if (constitutional_cache.size === 0) return false;

  try {
    const current_db_path = get_constitutional_cache_db_scope();
    if (
      last_constitutional_cache_db_path &&
      last_constitutional_cache_db_path !== current_db_path
    ) {
      return false;
    }

    if (current_db_path !== ':memory:' && fs.existsSync(current_db_path)) {
      const stats = fs.statSync(current_db_path);
      if (stats.mtimeMs > last_db_mod_time) {
        last_db_mod_time = stats.mtimeMs;
        return false;
      }
    }
  } catch (e: unknown) {
    console.warn('[vector-index] Cache validation error:', get_error_message(e));
  }

  return true;
}

/* ───────────────────────────────────────────────────────────────
   4. PREPARED STATEMENT CACHING
----------------------------------------------------------------*/

type PreparedStatements = {
  count_all: Database.Statement<[], { count: number }>;
  count_by_folder: Database.Statement<[string], { count: number }>;
  get_by_id: Database.Statement<[number], MemoryRow | undefined>;
  get_by_path: Database.Statement<[string], MemoryRow | undefined>;
  get_by_folder_and_path: Database.Statement<[
    string,
    string,
    string,
    string | null,
    string | null,
    string | null,
    string | null,
    string | null,
  ], { id: number } | undefined>;
  get_stats: Database.Statement<[], { total: number; complete: number; pending: number; failed: number }>;
  list_base: Database.Statement<[number, number], MemoryRow[]>;
};
// Scope prepared statements per Database instance via WeakMap.
// The old global singleton would return stale statements from a prior DB connection
// When called with a different database, executing queries against the wrong connection.
const prepared_statements_cache = new WeakMap<Database.Database, PreparedStatements>();

/**
 * Initializes cached prepared statements for common queries.
 * @param database - The database connection to prepare against.
 * @returns The prepared statements cache.
 */
export function init_prepared_statements(database: Database.Database): PreparedStatements {
  const cached = prepared_statements_cache.get(database);
  if (cached) return cached;

  const prepared_statements: PreparedStatements = {
    count_all: database.prepare(`
      SELECT COUNT(*) as count
      FROM memory_index m
      JOIN active_memory_projection p ON p.active_memory_id = m.id
    `),
    count_by_folder: database.prepare(`
      SELECT COUNT(*) as count
      FROM memory_index m
      JOIN active_memory_projection p ON p.active_memory_id = m.id
      WHERE m.spec_folder = ?
    `),
    get_by_id: database.prepare('SELECT * FROM memory_index WHERE id = ?'),
    get_by_path: database.prepare(`
      SELECT m.*
      FROM memory_index m
      JOIN active_memory_projection p ON p.active_memory_id = m.id
      WHERE m.file_path = ?
    `),
    get_by_folder_and_path: database.prepare(`
      SELECT m.id
      FROM memory_index m
      JOIN active_memory_projection p ON p.active_memory_id = m.id
      WHERE m.spec_folder = ?
        AND (m.canonical_file_path = ? OR m.file_path = ?)
        AND COALESCE(NULLIF(TRIM(m.anchor_id), ''), '_') = COALESCE(NULLIF(TRIM(?), ''), '_')
        AND COALESCE(m.tenant_id,'') = COALESCE(?, '')
        AND COALESCE(m.user_id,'') = COALESCE(?, '')
        AND COALESCE(m.agent_id,'') = COALESCE(?, '')
        AND COALESCE(m.session_id,'') = COALESCE(?, '')
      ORDER BY m.id DESC
      LIMIT 1
    `),
    get_stats: database.prepare(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN embedding_status = 'success' THEN 1 ELSE 0 END) as complete,
        SUM(CASE WHEN embedding_status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN embedding_status = 'failed' THEN 1 ELSE 0 END) as failed
      FROM memory_index m
      JOIN active_memory_projection p ON p.active_memory_id = m.id
    `),
    list_base: database.prepare(`
      SELECT m.*
      FROM memory_index m
      JOIN active_memory_projection p ON p.active_memory_id = m.id
      ORDER BY m.created_at DESC
      LIMIT ? OFFSET ?
    `)
  };

  prepared_statements_cache.set(database, prepared_statements);
  return prepared_statements;
}

/**
 * Clears cached prepared statements for a specific database or all databases.
 * @param database - Optional: clear only for this database. If omitted, the
 *   WeakMap self-cleans when the Database object is GC'd, so this is a no-op.
 * @returns Nothing.
 */
export function clear_prepared_statements(database?: Database.Database): void {
  if (database) {
    prepared_statements_cache.delete(database);
  }
  // WeakMap entries are automatically cleared when the Database key is GC'd.
}

/* ───────────────────────────────────────────────────────────────
   5. CONSTITUTIONAL MEMORIES CACHE
----------------------------------------------------------------*/

// Checks external DB modifications before using cache
// Prevent thundering herd when cache expires
/**
 * Gets cached constitutional memories from the index.
 * @param database - The database connection to query.
 * @param spec_folder - The optional spec folder filter.
 * @param includeArchived - Whether archived memories should be included.
 * @returns The constitutional memory rows.
 */
export function get_constitutional_memories(
  database: Database.Database,
  spec_folder: string | null = null,
  includeArchived = false
): MemoryRow[] {
  // Scope cache entries to the active DB path as well as the archived filter.
  const cache_key = build_constitutional_cache_key(spec_folder, includeArchived);
  const now = Date.now();
  const cached = constitutional_cache.get(cache_key);

  if (cached && (now - cached.timestamp) < CONSTITUTIONAL_CACHE_TTL && is_constitutional_cache_valid()) {
    return cached.data;
  }

  if (constitutional_cache_loading.get(cache_key) && cached) {
    return cached.data;
  }

  constitutional_cache_loading.set(cache_key, true);

  try {
    const constitutional_sql = `
      SELECT m.*, 100.0 as similarity, 1.0 as effective_importance,
             'constitutional' as source_type
      FROM memory_index m
      JOIN active_memory_projection p ON p.active_memory_id = m.id
      WHERE m.importance_tier = 'constitutional'
        AND m.embedding_status = 'success'
        ${spec_folder ? 'AND (m.spec_folder = ? OR m.spec_folder LIKE ?)' : ''}
      ORDER BY m.importance_weight DESC, m.created_at DESC
    `;

    const params = spec_folder ? [spec_folder, `${spec_folder}/%`] : [];
    let results = database.prepare(constitutional_sql).all(...params) as MemoryRow[];

    const MAX_CONSTITUTIONAL_TOKENS = 2000;
    const TOKENS_PER_MEMORY = 100;
    const max_constitutional_count = Math.floor(MAX_CONSTITUTIONAL_TOKENS / TOKENS_PER_MEMORY);
    results = results.slice(0, max_constitutional_count);

    results = results.map((row: MemoryRow) => {
      row.trigger_phrases = parse_trigger_phrases(row.trigger_phrases);
      row.isConstitutional = true;
      return row;
    });

    if (constitutional_cache.size >= CONSTITUTIONAL_CACHE_MAX_KEYS) {
      const oldestKey = constitutional_cache.keys().next().value;
      if (oldestKey !== undefined) {
        constitutional_cache.delete(oldestKey);
      }
    }

    refresh_constitutional_cache_db_state();
    constitutional_cache.set(cache_key, { data: results, timestamp: now });

    return results;
  } finally {
    constitutional_cache_loading.delete(cache_key);
  }
}

/**
 * Clears cached constitutional memories.
 * @param spec_folder - The optional spec folder cache key to clear.
 * @returns Nothing.
 */
export function clear_constitutional_cache(spec_folder: string | null = null): void {
  if (spec_folder) {
    const scoped_suffix_archived = `::${spec_folder}:arch`;
    const scoped_suffix_live = `::${spec_folder}:noarch`;
    for (const key of [...constitutional_cache.keys()]) {
      if (key.endsWith(scoped_suffix_archived) || key.endsWith(scoped_suffix_live)) {
        constitutional_cache.delete(key);
      }
    }
    for (const key of [...constitutional_cache_loading.keys()]) {
      if (key.endsWith(scoped_suffix_archived) || key.endsWith(scoped_suffix_live)) {
        constitutional_cache_loading.delete(key);
      }
    }
  } else {
    constitutional_cache.clear();
    constitutional_cache_loading.clear();
    last_db_mod_time = 0;
    last_constitutional_cache_db_path = null;
  }
}

/**
 * Refreshes interference scores for memories in a folder.
 * @param database - The database connection to update.
 * @param specFolder - The spec folder whose scores should be refreshed.
 * @returns Nothing.
 */
export function refresh_interference_scores_for_folder(database: Database.Database, specFolder: string): void {
  if (!specFolder) return;

  try {
    const rows = database.prepare(
      `SELECT m.id
       FROM memory_index m
       JOIN active_memory_projection p ON p.active_memory_id = m.id
       WHERE m.spec_folder = ?
         AND m.parent_id IS NULL
         AND COALESCE(m.importance_tier, 'normal') != 'deprecated'`
    ).all(specFolder) as Array<{ id: number }>;

    if (rows.length === 0) return;

    const memoryIds = rows.map(r => r.id);
    const scores = computeInterferenceScoresBatch(database, memoryIds);
    const updateStmt = database.prepare('UPDATE memory_index SET interference_score = ? WHERE id = ?');
    for (const id of memoryIds) {
      updateStmt.run(scores.get(id) ?? 0, id);
    }
  } catch (error: unknown) {
    console.warn(`[vector-index] interference score refresh failed for '${specFolder}': ${get_error_message(error)}`);
  }
}

/* ───────────────────────────────────────────────────────────────
   6. DATABASE INITIALIZATION
----------------------------------------------------------------*/

/**
 * Initializes the vector-index database connection.
 * @param custom_path - An optional database path override.
 * @returns The initialized database connection.
 * @throws {VectorIndexError} When database integrity validation fails during initialization.
 * @example
 * ```ts
 * const database = initialize_db();
 * ```
 */
export function initialize_db(custom_path: string | null = null, options: InitializeDbOptions = {}): Database.Database {
  if (db && !custom_path) {
    return db;
  }

  const target_path = custom_path || resolve_database_path();
  const startupProfile = getStartupEmbeddingProfile();
  if (target_path !== ':memory:') {
    if (!options.skipRestoreRecovery) {
      recover_interrupted_checkpoint_restore(target_path);
    }
    migrate_active_legacy_profile_database(target_path, startupProfile);
  }

  // C1 FIX: Check connection map for existing connection to this path
  const resolved_target = path.resolve(target_path);
  const cached_conn = db_connections.get(resolved_target);
  if (cached_conn) {
    set_active_database_connection(cached_conn, target_path, sqlite_vec_available_flag);
    return cached_conn;
  }

  const dir = path.dirname(target_path);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
  }

  let new_db: Database.Database;
  try {
    new_db = new Database(target_path);
  } catch (db_error: unknown) {
    const errMsg = get_error_message(db_error);
    const errCode = get_error_code(db_error);
    if (errCode === 'ERR_DLOPEN_FAILED' || errMsg.includes('NODE_MODULE_VERSION') || errMsg.includes('was compiled against a different Node.js version')) {
      console.error('[vector-index] FATAL: better-sqlite3 native module failed to load');
      console.error(`[vector-index] ${errMsg}`);
      console.error(`[vector-index] Running: Node ${process.version} (MODULE_VERSION ${process.versions.modules})`);
      try {
        const marker_path = path.resolve(import.meta.dirname, '../../../.node-version-marker');
        if (fs.existsSync(marker_path)) {
          const marker = JSON.parse(fs.readFileSync(marker_path, 'utf8'));
          console.error(`[vector-index] Marker recorded: Node ${marker.nodeVersion} (MODULE_VERSION ${marker.moduleVersion})`);
        }
      } catch (_: unknown) {
        // IGNORE MARKER READ ERRORS BECAUSE THE DIAGNOSTIC FILE IS OPTIONAL.
      }
      console.error('[vector-index] This usually means Node.js was updated without rebuilding native modules.');
      console.error('[vector-index] Fix: Run \'bash scripts/setup/rebuild-native-modules.sh\' from the spec-kit root');
      console.error('[vector-index] Or manually: npm rebuild better-sqlite3');
    }
    throw db_error;
  }

  let vec_available = true;
  try {
    sqliteVec.load(new_db);
  } catch (vec_error: unknown) {
    vec_available = false;
    console.warn(`[vector-index] sqlite-vec extension not available: ${get_error_message(vec_error)}`);
    console.warn('[vector-index] Falling back to anchor-only mode (no vector search)');
    console.warn('[vector-index] Install sqlite-vec: brew install sqlite-vec (macOS)');
  }

  new_db.pragma('journal_mode = WAL');
  new_db.pragma('busy_timeout = 10000');
  new_db.pragma('foreign_keys = ON');
  new_db.pragma('cache_size = -64000');
  new_db.pragma('mmap_size = 268435456');
  new_db.pragma('synchronous = NORMAL');
  new_db.pragma('wal_autocheckpoint = 256');
  new_db.pragma('temp_store = MEMORY');

  // A marker still present at open means the previous holder died without a
  // clean close — the one window where on-disk corruption (torn WAL, partial
  // page) is plausible. Probe integrity ONLY in that window so clean boots pay
  // nothing, and fail fast onto the checkpoint rebuild path rather than serve
  // a malformed database to every connected session.
  if (target_path !== ':memory:') {
    const prior_marker_path = get_unclean_shutdown_marker_path(target_path);
    if (prior_marker_path && fs.existsSync(prior_marker_path)) {
      let probe_verdict = 'ok';
      try {
        const rows = new_db.pragma('quick_check(1)') as Array<Record<string, unknown>>;
        const first = rows?.[0] ? Object.values(rows[0])[0] : undefined;
        probe_verdict = typeof first === 'string' ? first : 'quick_check returned no verdict';
      } catch (probe_error: unknown) {
        probe_verdict = get_error_message(probe_error);
      }
      if (probe_verdict !== 'ok') {
        const msg = `post-crash integrity probe failed: ${probe_verdict}`;
        console.error(`[vector-index] FATAL: ${msg}`);
        console.error('[vector-index] Wrote checkpoint needs-rebuild sentinel; the next boot rebuilds cleanly instead of serving corrupted data.');
        write_needs_rebuild_sentinel_for_corruption(target_path, probe_verdict);
        try { new_db.close(); } catch (_: unknown) { /* best-effort */ }
        throw new VectorIndexError(msg, VectorIndexErrorCode.INTEGRITY_ERROR);
      }
    }
  }

  write_unclean_shutdown_marker(target_path);

  if (target_path !== ':memory:') {
    const startupShardPath = get_vector_shard_path(startupProfile, path.dirname(target_path));
    if (!fs.existsSync(startupShardPath)) {
      const canonicalDimCheck = validate_embedding_dimension_for_connection(new_db, vec_available);
      if (!canonicalDimCheck.valid && canonicalDimCheck.stored != null) {
        const msg = canonicalDimCheck.warning ||
          `Embedding dimension mismatch: DB=${canonicalDimCheck.stored}, provider=${canonicalDimCheck.current}`;
        console.error(`[vector-index] FATAL: ${msg}`);
        try { new_db.close(); } catch (_: unknown) { /* best-effort */ }
        throw new VectorIndexError(msg, VectorIndexErrorCode.INTEGRITY_ERROR);
      }
    }
  }

  attachActiveVectorShard(new_db, startupProfile);

  const preBootstrapDimCheck = validate_embedding_dimension_for_connection(new_db, vec_available);
  if (!preBootstrapDimCheck.valid && preBootstrapDimCheck.stored != null) {
    const msg = preBootstrapDimCheck.warning ||
      `Embedding dimension mismatch: DB=${preBootstrapDimCheck.stored}, provider=${preBootstrapDimCheck.current}`;
    console.error(`[vector-index] FATAL: ${msg}`);
    try { new_db.close(); } catch (_: unknown) { /* best-effort */ }
    throw new VectorIndexError(msg, VectorIndexErrorCode.INTEGRITY_ERROR);
  }

  create_schema(new_db, { sqlite_vec_available: vec_available, get_embedding_dim });
  ensure_schema_version(new_db);
  drop_canonical_vector_payload_tables(new_db);

  const dimCheck = validate_embedding_dimension_for_connection(new_db, vec_available);
  if (!dimCheck.valid && dimCheck.stored != null) {
    const msg = dimCheck.warning || `Dimension mismatch: DB=${dimCheck.stored}, provider=${dimCheck.current}`;
    console.error(`[vector-index] FATAL: ${msg}`);
    try { new_db.close(); } catch (_: unknown) { /* best-effort */ }
    throw new VectorIndexError(msg, VectorIndexErrorCode.INTEGRITY_ERROR);
  }

  set_active_database_connection(new_db, target_path, vec_available);

  // C1 FIX: Only cache in connection map after all validation passes
  db_connections.set(resolved_target, new_db);

  return new_db;
}

/* ───────────────────────────────────────────────────────────────
   7. DATABASE UTILITIES
----------------------------------------------------------------*/

/**
 * Closes the shared vector-index database connection.
 * @returns Nothing.
 */
export function close_db(): void {
  clear_prepared_statements();
  // C1 FIX: Close all tracked connections
  for (const [, conn] of db_connections) {
    try {
      if (conn !== db) {
        // Non-active tracked connections must also flush + TRUNCATE their
        // WAL before close, exactly like the active db below — otherwise a non-active connection
        // closes with only better-sqlite3's passive checkpoint and can leave un-checkpointed
        // frames that an abrupt later kill could corrupt (the corruption window).
        // Checkpoint BEFORE detaching the shard (the shard schema must still be attached).
        try { conn.pragma(`${ACTIVE_VECTOR_SCHEMA}.wal_checkpoint(TRUNCATE)`); } catch (_: unknown) { /* best-effort: shard may not be attached on this conn */ }
        try { conn.pragma('wal_checkpoint(TRUNCATE)'); } catch (_: unknown) { /* best-effort */ }
        detachActiveVectorShard(conn);
        conn.close();
      }
    } catch (_: unknown) { /* ignore close errors */ }
  }
  db_connections.clear();
  if (db) {
    const closing_db_path = db_path;
    // FTS-corruption prevention: flush + TRUNCATE the
    // WAL before close so context-index.sqlite is consistent at rest with an empty
    // WAL. better-sqlite3 `.close()` only does a passive checkpoint and can leave
    // un-checkpointed frames; an explicit TRUNCATE shrinks the window that an
    // abrupt later kill (e.g. SIGKILL on MCP reconnect) could corrupt — notably
    // FTS5 segment writes. Best-effort: a checkpoint failure must never block close.
    try { db.pragma(`${ACTIVE_VECTOR_SCHEMA}.wal_checkpoint(TRUNCATE)`); } catch (_: unknown) { /* best-effort */ }
    let main_checkpoint_succeeded = false;
    try {
      db.pragma('wal_checkpoint(TRUNCATE)');
      main_checkpoint_succeeded = true;
    } catch (_: unknown) { /* best-effort */ }
    // The clean-shutdown marker semantic is "present == dirty" (it is written
    // on every open in initialize_db and removed only on a clean close). It must be
    // deleted ONLY after a confirmed-successful close. detachActiveVectorShard() and
    // db.close() can both throw; if the marker were removed before they ran (the prior
    // ordering) and one of them threw, the marker would be gone while the DB did NOT
    // close cleanly — so the next open would wrongly trust a dirty DB. Detach + close
    // first (if either throws we never reach the removal, so the marker survives), then
    // remove the marker inside the checkpoint-success guard.
    detachActiveVectorShard(db);
    db.close();
    if (main_checkpoint_succeeded) {
      remove_unclean_shutdown_marker(closing_db_path);
    }
    db = null;
  }
}

/**
 * Reopens the active database around a caller-owned on-disk file swap.
 *
 * @param targetMainPath - Main SQLite database file to reopen after the swap.
 * @param swapFn - Synchronous file swap that must run with no open connection.
 * @returns The reopened active database handle.
 */
export function reopenActiveDatabase(targetMainPath: string, swapFn: () => void): Database.Database {
  const currentDb = db ?? db_connections.get(path.resolve(targetMainPath)) ?? null;

  if (currentDb) {
    try { currentDb.pragma(`${ACTIVE_VECTOR_SCHEMA}.wal_checkpoint(TRUNCATE)`); } catch (_: unknown) { /* best-effort */ }
    try { currentDb.pragma('wal_checkpoint(TRUNCATE)'); } catch (_: unknown) { /* best-effort */ }
    detachActiveVectorShard(currentDb);
  }

  close_db();
  swapFn();
  return initialize_db(targetMainPath, { skipRestoreRecovery: true });
}

export function checkpointAllWal(): void {
  if (!db) return;
  try { db.pragma(`${ACTIVE_VECTOR_SCHEMA}.wal_checkpoint(TRUNCATE)`); } catch { /* best-effort */ }
  try { db.pragma('wal_checkpoint(TRUNCATE)'); } catch { /* best-effort */ }
}

/**
 * Gets the active vector-index database path.
 * @returns The database path.
 */
export function get_db_path(): string {
  return db_path;
}

/**
 * Gets the shared vector-index database connection.
 * @returns The database connection.
 */
export function get_db(): Database.Database {
  return initialize_db();
}

/**
 * Returns the active vector-index database connection if it has already been
 * initialized. This accessor never opens SQLite or creates schema.
 */
export function try_get_db(): Database.Database | null {
  return db;
}

// Check if vector search is available (sqlite-vec loaded)
/**
 * Reports whether sqlite-vec vector search is available.
 * @returns True when vector search is available.
 */
export function is_vector_search_available(): boolean {
  return sqlite_vec_available_flag;
}

export const __testables = {
  get_existing_embedding_dimension,
  run_vector_shard_integrity_probe_at_path,
};

export { BetterSqliteVectorStore as SQLiteVectorStore } from '../storage/ports/vector-store.js';

/* ───────────────────────────────────────────────────────────────
   9. CAMELCASE ALIASES
----------------------------------------------------------------*/

// CamelCase aliases for backward compatibility (functions already exported above)
export { initialize_db as initializeDb };
export { close_db as closeDb };
export { reopenActiveDatabase as reopen_active_database };
export { recover_interrupted_checkpoint_restore as recoverInterruptedCheckpointRestore };
export { get_db as getDb };
export { try_get_db as tryGetDb };
export { get_db_path as getDbPath };
export { get_confirmed_embedding_dimension as getConfirmedEmbeddingDimension };
export { get_embedding_dim as getEmbeddingDim };
export { validate_embedding_dimension as validateEmbeddingDimension };
export { validate_file_path_local as validateFilePath };
export { clear_constitutional_cache as clearConstitutionalCache };
export { is_vector_search_available as isVectorSearchAvailable };
export { on_database_connection_change as onDatabaseConnectionChange };
export { activeVectorSource as active_vector_source };
export { attachActiveVectorShard as attach_active_vector_shard };
export { detachActiveVectorShard as detach_active_vector_shard };
export { getActiveVectorSource as get_active_vector_source };
export { attachActiveVectorShardForActiveProfile as attach_active_vector_shard_for_active_profile };

// ───────────────────────────────────────────────────────────────
// MODULE: Embedding Cache
// ───────────────────────────────────────────────────────────────
import { createHash } from 'crypto';
import type Database from 'better-sqlite3';

// Feature catalog: Embedding cache


/* --- 1. INTERFACES --- */

interface EmbeddingCacheEntry {
  contentHash: string;
  profileKey: string;
  inputKind: EmbeddingInputKind;
  modelId: string;
  embedding: Buffer;
  dimensions: number;
  createdAt: string;
  lastUsedAt: string;
}

type EmbeddingInputKind = 'document' | 'query';

interface EmbeddingCacheKeyOptions {
  profileKey?: string;
  inputKind?: EmbeddingInputKind;
}

interface EmbeddingCacheStats {
  totalEntries: number;
  totalSizeBytes: number;
  oldestEntry: string | null;
  newestEntry: string | null;
}

interface EmbeddingCacheHitStats {
  hits: number;
  misses: number;
  hitRate: number;
}

interface EmbeddingCacheByteEstimate {
  entries: number;
  approxBytes: number;
}

interface EmbeddingCacheKindStats {
  entries: number;
  bytes: number;
}

interface EmbeddingCacheProfileStats {
  entries: number;
  bytes: number;
  by_kind: Record<EmbeddingInputKind, EmbeddingCacheKindStats>;
}

let cacheHits = 0;
let cacheMisses = 0;

const ROW_OVERHEAD_BYTES = 40;
const DEFAULT_MAX_CACHE_BYTES = 100 * 1024 * 1024;
const DEFAULT_PROFILE_MAX_CACHE_BYTES = 50 * 1024 * 1024;
const DEFAULT_QUERY_MAX_CACHE_BYTES = 25 * 1024 * 1024;
const DEFAULT_MAX_ENTRIES_PER_PROFILE = 50_000;
const BYTE_ESTIMATE_SQL = `
  LENGTH(embedding)
  + LENGTH(content_hash)
  + LENGTH(model_id)
  + LENGTH(profile_key)
  + LENGTH(input_kind)
  + ${ROW_OVERHEAD_BYTES}
`;

/* --- 2. HELPERS --- */

function readPositiveIntegerEnv(name: string, fallback: number): number {
  const raw = process.env[name]?.trim();
  if (!raw) {
    return fallback;
  }

  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function getCacheBudgetConfig(): {
  maxBytes: number;
  profileMaxBytes: number;
  queryMaxBytes: number;
  maxEntriesPerProfile: number;
} {
  return {
    maxBytes: readPositiveIntegerEnv('SPECKIT_EMBED_CACHE_MAX_BYTES', DEFAULT_MAX_CACHE_BYTES),
    profileMaxBytes: readPositiveIntegerEnv('SPECKIT_EMBED_CACHE_PROFILE_MAX_BYTES', DEFAULT_PROFILE_MAX_CACHE_BYTES),
    queryMaxBytes: readPositiveIntegerEnv('SPECKIT_QUERY_EMBED_CACHE_MAX_BYTES', DEFAULT_QUERY_MAX_CACHE_BYTES),
    maxEntriesPerProfile: readPositiveIntegerEnv(
      'SPECKIT_EMBED_CACHE_MAX_ENTRIES_PER_PROFILE',
      DEFAULT_MAX_ENTRIES_PER_PROFILE,
    ),
  };
}

function normalizeProfileKey(profileKey: string | undefined): string {
  return typeof profileKey === 'string' ? profileKey.trim() : '';
}

function normalizeInputKind(inputKind: EmbeddingInputKind | undefined): EmbeddingInputKind {
  return inputKind === 'query' ? 'query' : 'document';
}

function tableExists(db: Database.Database, tableName: string): boolean {
  const row = (db.prepare(
    "SELECT 1 AS present FROM sqlite_master WHERE type = 'table' AND name = ?",
  ) as Database.Statement).get(tableName) as { present?: number } | undefined;

  return row?.present === 1;
}

function getTableColumns(db: Database.Database, tableName: string): Set<string> {
  return new Set(
    ((db.prepare(`PRAGMA table_info(${tableName})`) as Database.Statement).all() as Array<{ name: string }>)
      .map((column) => column.name)
      .filter((columnName) => typeof columnName === 'string' && columnName.length > 0),
  );
}

function createEmbeddingCacheTable(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS embedding_cache (
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

function readVecMetadataValue(db: Database.Database, key: string): string | null {
  if (!tableExists(db, 'vec_metadata')) {
    return null;
  }

  const row = (db.prepare('SELECT value FROM vec_metadata WHERE key = ?') as Database.Statement)
    .get(key) as { value?: string } | undefined;
  const value = row?.value?.trim();
  return value ? value : null;
}

function readActiveProfileKeyFromMetadata(db: Database.Database): string {
  const name = readVecMetadataValue(db, 'active_embedder_name');
  const dim = readVecMetadataValue(db, 'active_embedder_dim');
  if (!name || !dim) {
    return '';
  }

  const provider = readVecMetadataValue(db, 'active_embedder_provider');
  return provider ? `${provider}:${name}:${dim}` : `${name}:${dim}`;
}

function backfillActiveProfileKey(db: Database.Database): void {
  const profileKey = readActiveProfileKeyFromMetadata(db);
  if (!profileKey) {
    return;
  }

  (db.prepare(
    "UPDATE embedding_cache SET profile_key = ? WHERE profile_key = ''",
  ) as Database.Statement).run(profileKey);
}

function migrateEmbeddingCacheSchema(db: Database.Database): void {
  if (!tableExists(db, 'embedding_cache')) {
    createEmbeddingCacheTable(db);
    return;
  }

  const columns = getTableColumns(db, 'embedding_cache');
  if (!columns.has('profile_key')) {
    db.exec('ALTER TABLE embedding_cache RENAME TO embedding_cache_legacy_profile');
    createEmbeddingCacheTable(db);
    db.exec(`
      INSERT OR REPLACE INTO embedding_cache (
        content_hash,
        profile_key,
        input_kind,
        model_id,
        embedding,
        dimensions,
        created_at,
        last_used_at
      )
      SELECT
        content_hash,
        '',
        'document',
        model_id,
        embedding,
        dimensions,
        created_at,
        last_used_at
      FROM embedding_cache_legacy_profile
    `);
    db.exec('DROP TABLE embedding_cache_legacy_profile');
    backfillActiveProfileKey(db);
    return;
  }

  if (!columns.has('input_kind')) {
    db.exec("ALTER TABLE embedding_cache ADD COLUMN input_kind TEXT NOT NULL DEFAULT 'document'");
  }

  backfillActiveProfileKey(db);
}

function estimateRowBytes(row: {
  embedding?: Buffer;
  content_hash: string;
  model_id: string;
  profile_key?: string;
  input_kind?: string;
}): number {
  return (
    (row.embedding?.length ?? 0)
    + row.content_hash.length
    + row.model_id.length
    + (row.profile_key?.length ?? 0)
    + (row.input_kind?.length ?? 0)
    + ROW_OVERHEAD_BYTES
  );
}

function rowIdDeleteSql(rowIds: number[]): string {
  return `DELETE FROM embedding_cache WHERE rowid IN (${rowIds.map(() => '?').join(', ')})`;
}

function deleteRowsById(db: Database.Database, rowIds: number[]): number {
  let deleted = 0;
  for (let index = 0; index < rowIds.length; index += 500) {
    const chunk = rowIds.slice(index, index + 500);
    const result = (db.prepare(rowIdDeleteSql(chunk)) as Database.Statement).run(...chunk);
    deleted += (result as { changes: number }).changes;
  }

  return deleted;
}

function evictLruUntilUnderBudget(
  db: Database.Database,
  whereClause: string,
  params: unknown[],
  maxBytes: number,
): number {
  const totalRow = (db.prepare(`
    SELECT COALESCE(SUM(${BYTE_ESTIMATE_SQL}), 0) AS bytes
    FROM embedding_cache
    WHERE ${whereClause}
  `) as Database.Statement).get(...params) as { bytes: number };

  let runningBytes = totalRow.bytes;
  if (runningBytes <= maxBytes) {
    return 0;
  }

  const rows = (db.prepare(`
    SELECT rowid, ${BYTE_ESTIMATE_SQL} AS bytes
    FROM embedding_cache
    WHERE ${whereClause}
    ORDER BY last_used_at ASC, created_at ASC, rowid ASC
  `) as Database.Statement).all(...params) as Array<{ rowid: number; bytes: number }>;

  const rowIds: number[] = [];
  for (const row of rows) {
    if (runningBytes <= maxBytes) {
      break;
    }

    rowIds.push(row.rowid);
    runningBytes -= row.bytes;
  }

  return deleteRowsById(db, rowIds);
}

function evictProfileEntryOverflow(db: Database.Database, maxEntriesPerProfile: number): number {
  const rows = (db.prepare(`
    SELECT profile_key, COUNT(*) AS entries
    FROM embedding_cache
    GROUP BY profile_key
    HAVING COUNT(*) > ?
  `) as Database.Statement).all(maxEntriesPerProfile) as Array<{ profile_key: string; entries: number }>;

  let deleted = 0;
  for (const row of rows) {
    const excess = row.entries - maxEntriesPerProfile;
    const result = (db.prepare(`
      DELETE FROM embedding_cache
      WHERE rowid IN (
        SELECT rowid
        FROM embedding_cache
        WHERE profile_key = ?
        ORDER BY last_used_at ASC, created_at ASC, rowid ASC
        LIMIT ?
      )
    `) as Database.Statement).run(row.profile_key, excess);
    deleted += (result as { changes: number }).changes;
  }

  return deleted;
}

function shrinkSqliteMemory(db: Database.Database): void {
  try {
    db.pragma('shrink_memory');
  } catch {
    // Cache eviction must not fail the write path on older/test SQLite bindings.
  }
}

/* --- 3. TABLE INITIALIZATION --- */

/**
 * Create the embedding_cache table if it does not exist.
 * Idempotent — safe to call on every startup.
 *
 * @param db - better-sqlite3 database instance
 */
function initEmbeddingCache(db: Database.Database): void {
  migrateEmbeddingCacheSchema(db);
}

/* --- 4. CACHE LOOKUP --- */

/**
 * Look up a cached embedding by content hash, model ID, and embedding dimension.
 * On hit: updates last_used_at and returns the embedding Buffer.
 * On miss: returns null.
 *
 * @param db - better-sqlite3 database instance
 * @param contentHash - SHA-256 hex digest of the content
 * @param modelId - Embedding model identifier
 * @param dimensions - Expected embedding dimensions for this lookup
 * @returns Embedding buffer on cache hit, null on miss
 */
function lookupEmbedding(
  db: Database.Database,
  contentHash: string,
  modelId: string,
  dimensions: number,
  options: EmbeddingCacheKeyOptions = {},
): Buffer | null {
  const profileKey = normalizeProfileKey(options.profileKey);
  const inputKind = normalizeInputKind(options.inputKind);
  const hasScopedLookup = options.profileKey !== undefined || options.inputKind !== undefined;
  const row = hasScopedLookup
    ? (db.prepare(
      `SELECT rowid, embedding
       FROM embedding_cache
       WHERE content_hash = ?
         AND profile_key = ?
         AND input_kind = ?
         AND model_id = ?
         AND dimensions = ?`,
    ) as Database.Statement).get(contentHash, profileKey, inputKind, modelId, dimensions) as
      | { rowid: number; embedding: Buffer }
      | undefined
    : (db.prepare(
      `SELECT rowid, embedding
       FROM embedding_cache
       WHERE content_hash = ?
         AND model_id = ?
         AND dimensions = ?
       ORDER BY
         CASE WHEN profile_key = '' AND input_kind = 'document' THEN 0 ELSE 1 END,
         last_used_at DESC
       LIMIT 1`,
    ) as Database.Statement).get(contentHash, modelId, dimensions) as
      | { rowid: number; embedding: Buffer }
      | undefined;

  if (!row) {
    cacheMisses += 1;
    return null;
  }

  cacheHits += 1;

  // Update last_used_at on cache hit
  (db.prepare(
    "UPDATE embedding_cache SET last_used_at = datetime('now') WHERE rowid = ?",
  ) as Database.Statement).run(row.rowid);

  return row.embedding;
}

/* --- 5. CACHE STORE --- */

/**
 * Store an embedding in the cache.
 * Uses INSERT OR REPLACE so duplicate (content_hash, model_id, dimensions)
 * rows are overwritten with the latest embedding, while allowing multiple
 * dimension variants to coexist for the same content/model pair.
 *
 * NOTE: The count-then-delete below is a non-transactional read-then-update
 * pattern. Under concurrent writers the cache may briefly exceed
 * MAX_CACHE_ENTRIES, but this is acceptable for a performance cache — the
 * next store call will trim the overshoot.
 *
 * @param db - better-sqlite3 database instance
 * @param contentHash - SHA-256 hex digest of the content
 * @param modelId - Embedding model identifier
 * @param embedding - Raw embedding buffer
 * @param dimensions - Number of embedding dimensions
 */
function storeEmbedding(
  db: Database.Database,
  contentHash: string,
  modelId: string,
  embedding: Buffer,
  dimensions: number,
  options: EmbeddingCacheKeyOptions = {},
): void {
  const profileKey = normalizeProfileKey(options.profileKey);
  const inputKind = normalizeInputKind(options.inputKind);

  (db.prepare(
    `INSERT INTO embedding_cache
       (content_hash, profile_key, input_kind, model_id, embedding, dimensions, last_used_at)
     VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
     ON CONFLICT(content_hash, profile_key, input_kind, model_id, dimensions)
     DO UPDATE SET
       embedding = excluded.embedding,
       last_used_at = datetime('now')`,
  ) as Database.Statement).run(contentHash, profileKey, inputKind, modelId, embedding, dimensions);

  evictIfOverBudget(db);
}

/* --- 6. LRU EVICTION --- */

/**
 * Evict rows until byte and secondary entry budgets are satisfied.
 *
 * @param db - better-sqlite3 database instance
 * @returns Number of evicted rows
 */
function evictIfOverBudget(db: Database.Database): number {
  const budgets = getCacheBudgetConfig();
  let deleted = 0;

  deleted += evictLruUntilUnderBudget(db, '1 = 1', [], budgets.maxBytes);

  const profileRows = (db.prepare(`
    SELECT profile_key, COALESCE(SUM(${BYTE_ESTIMATE_SQL}), 0) AS bytes
    FROM embedding_cache
    GROUP BY profile_key
    HAVING COALESCE(SUM(${BYTE_ESTIMATE_SQL}), 0) > ?
  `) as Database.Statement).all(budgets.profileMaxBytes) as Array<{ profile_key: string; bytes: number }>;
  for (const row of profileRows) {
    deleted += evictLruUntilUnderBudget(
      db,
      'profile_key = ?',
      [row.profile_key],
      budgets.profileMaxBytes,
    );
  }

  deleted += evictLruUntilUnderBudget(
    db,
    "input_kind = 'query'",
    [],
    budgets.queryMaxBytes,
  );
  deleted += evictProfileEntryOverflow(db, budgets.maxEntriesPerProfile);

  if (deleted > 0) {
    shrinkSqliteMemory(db);
  }

  return deleted;
}

/**
 * Evict cache entries whose last_used_at is older than maxAgeDays.
 *
 * @param db - better-sqlite3 database instance
 * @param maxAgeDays - Maximum age in days before eviction
 * @returns Number of evicted entries
 */
function evictOldEntries(db: Database.Database, maxAgeDays: number): number {
  const result = (db.prepare(
    `DELETE FROM embedding_cache
     WHERE last_used_at < datetime('now', ? || ' days')`,
  ) as Database.Statement).run(`-${maxAgeDays}`);

  return (result as { changes: number }).changes;
}

/* --- 7. STATISTICS --- */

/**
 * Return runtime hit/miss statistics for the embedding cache.
 *
 * @returns Cache hit/miss counters and derived hit rate
 */
function getCacheStats(): EmbeddingCacheHitStats;

/**
 * Return aggregate statistics about the embedding cache.
 *
 * @param db - better-sqlite3 database instance
 * @returns Cache statistics including total entries, size, oldest/newest timestamps
 */
function getCacheStats(db: Database.Database): EmbeddingCacheStats;
function getCacheStats(db?: Database.Database): EmbeddingCacheStats | EmbeddingCacheHitStats {
  if (!db) {
    const totalLookups = cacheHits + cacheMisses;

    return {
      hits: cacheHits,
      misses: cacheMisses,
      hitRate: totalLookups > 0 ? cacheHits / totalLookups : 0,
    };
  }

  const row = (db.prepare(`
    SELECT
      COUNT(*) AS total_entries,
      COALESCE(SUM(${BYTE_ESTIMATE_SQL}), 0) AS total_size_bytes,
      MIN(last_used_at) AS oldest_entry,
      MAX(last_used_at) AS newest_entry
    FROM embedding_cache
  `) as Database.Statement).get() as {
    total_entries: number;
    total_size_bytes: number;
    oldest_entry: string | null;
    newest_entry: string | null;
  };

  return {
    totalEntries: row.total_entries,
    totalSizeBytes: row.total_size_bytes,
    oldestEntry: row.oldest_entry,
    newestEntry: row.newest_entry,
  };
}

function getByteEstimate(db: Database.Database): EmbeddingCacheByteEstimate {
  const row = (db.prepare(`
    SELECT
      COUNT(*) AS entries,
      COALESCE(SUM(${BYTE_ESTIMATE_SQL}), 0) AS approx_bytes
    FROM embedding_cache
  `) as Database.Statement).get() as {
    entries: number;
    approx_bytes: number;
  };

  return {
    entries: row.entries,
    approxBytes: row.approx_bytes,
  };
}

function getEmbeddingCacheByProfileStats(
  db: Database.Database,
): Record<string, EmbeddingCacheProfileStats> {
  const rows = (db.prepare(`
    SELECT
      profile_key,
      input_kind,
      COUNT(*) AS entries,
      COALESCE(SUM(${BYTE_ESTIMATE_SQL}), 0) AS bytes
    FROM embedding_cache
    GROUP BY profile_key, input_kind
  `) as Database.Statement).all() as Array<{
    profile_key: string;
    input_kind: EmbeddingInputKind;
    entries: number;
    bytes: number;
  }>;

  const profiles: Record<string, EmbeddingCacheProfileStats> = {};
  for (const row of rows) {
    const profileKey = row.profile_key;
    profiles[profileKey] ??= {
      entries: 0,
      bytes: 0,
      by_kind: {
        document: { entries: 0, bytes: 0 },
        query: { entries: 0, bytes: 0 },
      },
    };

    const inputKind = normalizeInputKind(row.input_kind);
    profiles[profileKey].entries += row.entries;
    profiles[profileKey].bytes += row.bytes;
    profiles[profileKey].by_kind[inputKind] = {
      entries: row.entries,
      bytes: row.bytes,
    };
  }

  return profiles;
}

/* --- 8. CLEAR --- */

/**
 * Remove all entries from the embedding cache.
 *
 * @param db - better-sqlite3 database instance
 */
function clearCache(db: Database.Database): void {
  db.exec('DELETE FROM embedding_cache');
}

/**
 * Remove all cached embedding variants for a content hash.
 *
 * Retention sweeps use this to delete derived semantic cache data alongside
 * the source memory row. The cache is content-addressed rather than row-bound,
 * so this intentionally removes all model/dimension variants for the content.
 *
 * @param db - better-sqlite3 database instance
 * @param contentHash - SHA-256 hex digest of the deleted content
 * @returns Number of deleted cache rows
 */
function deleteByContentHash(db: Database.Database, contentHash: string): number {
  const result = (db.prepare(
    'DELETE FROM embedding_cache WHERE content_hash = ?',
  ) as Database.Statement).run(contentHash);

  return (result as { changes: number }).changes;
}

/* --- 9. CONTENT HASHING --- */

/**
 * Compute a SHA-256 hex digest of the given content string.
 * Matches the pattern used elsewhere in the codebase
 * (e.g. memory-parser.ts computeContentHash).
 *
 * @param content - Raw content string to hash
 * @returns SHA-256 hex digest
 */
function computeContentHash(content: string): string {
  return createHash('sha256').update(content, 'utf-8').digest('hex');
}

function getActiveEmbeddingProfileKey(
  db: Database.Database,
  fallbackModelId = '',
  fallbackDimensions = 0,
): string {
  const metadataProfileKey = readActiveProfileKeyFromMetadata(db);
  if (metadataProfileKey) {
    return metadataProfileKey;
  }

  const normalizedModelId = fallbackModelId.trim();
  return normalizedModelId && fallbackDimensions > 0
    ? `${normalizedModelId}:${fallbackDimensions}`
    : '';
}

/* --- 10. EXPORTS --- */

export {
  initEmbeddingCache,
  lookupEmbedding,
  storeEmbedding,
  evictIfOverBudget,
  evictOldEntries,
  getCacheStats,
  getByteEstimate,
  getEmbeddingCacheByProfileStats,
  clearCache,
  deleteByContentHash,
  computeContentHash,
  getActiveEmbeddingProfileKey,
};

/**
 * Re-exports related public types.
 */
export type {
  EmbeddingCacheEntry,
  EmbeddingInputKind,
  EmbeddingCacheKeyOptions,
  EmbeddingCacheStats,
  EmbeddingCacheHitStats,
  EmbeddingCacheByteEstimate,
  EmbeddingCacheKindStats,
  EmbeddingCacheProfileStats,
};

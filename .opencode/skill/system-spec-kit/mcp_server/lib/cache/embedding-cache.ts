// ---------------------------------------------------------------
// MODULE: Embedding Cache
// SQLite-backed LRU cache for computed embeddings
// ---------------------------------------------------------------

import { createHash } from 'crypto';
import type Database from 'better-sqlite3';

/* -------------------------------------------------------------
   1. INTERFACES
----------------------------------------------------------------*/

interface EmbeddingCacheEntry {
  contentHash: string;
  modelId: string;
  embedding: Buffer;
  dimensions: number;
  createdAt: string;
  lastUsedAt: string;
}

interface EmbeddingCacheStats {
  totalEntries: number;
  totalSizeBytes: number;
  oldestEntry: string | null;
  newestEntry: string | null;
}

/* -------------------------------------------------------------
   2. TABLE INITIALIZATION
----------------------------------------------------------------*/

/**
 * Create the embedding_cache table if it does not exist.
 * Idempotent — safe to call on every startup.
 */
function initEmbeddingCache(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS embedding_cache (
      content_hash TEXT NOT NULL,
      model_id TEXT NOT NULL,
      embedding BLOB NOT NULL,
      dimensions INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      last_used_at TEXT NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (content_hash, model_id)
    )
  `);
}

/* -------------------------------------------------------------
   3. CACHE LOOKUP
----------------------------------------------------------------*/

/**
 * Look up a cached embedding by content hash and model ID.
 * On hit: updates last_used_at and returns the embedding Buffer.
 * On miss: returns null.
 */
function lookupEmbedding(
  db: Database.Database,
  contentHash: string,
  modelId: string,
): Buffer | null {
  const row = (db.prepare(
    'SELECT embedding, dimensions FROM embedding_cache WHERE content_hash = ? AND model_id = ?',
  ) as Database.Statement).get(contentHash, modelId) as
    | { embedding: Buffer; dimensions: number }
    | undefined;

  if (!row) return null;

  // Update last_used_at on cache hit
  (db.prepare(
    "UPDATE embedding_cache SET last_used_at = datetime('now') WHERE content_hash = ? AND model_id = ?",
  ) as Database.Statement).run(contentHash, modelId);

  return row.embedding;
}

/* -------------------------------------------------------------
   4. CACHE STORE
----------------------------------------------------------------*/

/**
 * Store an embedding in the cache.
 * Uses INSERT OR REPLACE so duplicate (content_hash, model_id) pairs
 * are overwritten with the latest embedding.
 */
function storeEmbedding(
  db: Database.Database,
  contentHash: string,
  modelId: string,
  embedding: Buffer,
  dimensions: number,
): void {
  (db.prepare(
    `INSERT OR REPLACE INTO embedding_cache
       (content_hash, model_id, embedding, dimensions, last_used_at)
     VALUES (?, ?, ?, ?, datetime('now'))`,
  ) as Database.Statement).run(contentHash, modelId, embedding, dimensions);
}

/* -------------------------------------------------------------
   5. LRU EVICTION
----------------------------------------------------------------*/

/**
 * Evict cache entries whose last_used_at is older than maxAgeDays.
 * Returns the number of evicted entries.
 */
function evictOldEntries(db: Database.Database, maxAgeDays: number): number {
  const result = (db.prepare(
    `DELETE FROM embedding_cache
     WHERE last_used_at < datetime('now', ? || ' days')`,
  ) as Database.Statement).run(`-${maxAgeDays}`);

  return (result as { changes: number }).changes;
}

/* -------------------------------------------------------------
   6. STATISTICS
----------------------------------------------------------------*/

/**
 * Return aggregate statistics about the embedding cache.
 */
function getCacheStats(db: Database.Database): EmbeddingCacheStats {
  const row = (db.prepare(`
    SELECT
      COUNT(*) AS total_entries,
      COALESCE(SUM(LENGTH(embedding)), 0) AS total_size_bytes,
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

/* -------------------------------------------------------------
   7. CLEAR
----------------------------------------------------------------*/

/**
 * Remove all entries from the embedding cache.
 */
function clearCache(db: Database.Database): void {
  db.exec('DELETE FROM embedding_cache');
}

/* -------------------------------------------------------------
   8. CONTENT HASHING
----------------------------------------------------------------*/

/**
 * Compute a SHA-256 hex digest of the given content string.
 * Matches the pattern used elsewhere in the codebase
 * (e.g. memory-parser.ts computeContentHash).
 */
function computeContentHash(content: string): string {
  return createHash('sha256').update(content, 'utf-8').digest('hex');
}

/* -------------------------------------------------------------
   9. EXPORTS
----------------------------------------------------------------*/

export {
  initEmbeddingCache,
  lookupEmbedding,
  storeEmbedding,
  evictOldEntries,
  getCacheStats,
  clearCache,
  computeContentHash,
};

export type {
  EmbeddingCacheEntry,
  EmbeddingCacheStats,
};

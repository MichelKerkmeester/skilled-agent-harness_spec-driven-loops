// ───────────────────────────────────────────────────────────────
// TEST — BYTE-BOUNDED EMBEDDING CACHE
// ───────────────────────────────────────────────────────────────
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Database from 'better-sqlite3';

import {
  computeContentHash,
  getByteEstimate,
  getEmbeddingCacheByProfileStats,
  initEmbeddingCache,
  lookupEmbedding,
  storeEmbedding,
} from '../lib/cache/embedding-cache';

let db: InstanceType<typeof Database>;
let envSnapshot: NodeJS.ProcessEnv;

function makeBuffer(bytes: number, fill = 1): Buffer {
  return Buffer.alloc(bytes, fill);
}

function setActiveEmbedder(
  database: Database.Database,
  name: string,
  dim: number,
  provider: string,
): void {
  database.exec(`
    CREATE TABLE IF NOT EXISTS vec_metadata (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);
  const stmt = database.prepare(`
    INSERT OR REPLACE INTO vec_metadata (key, value)
    VALUES (?, ?)
  `);
  stmt.run('active_embedder_name', name);
  stmt.run('active_embedder_dim', String(dim));
  stmt.run('active_embedder_provider', provider);
}

function createLegacyEmbeddingCache(database: Database.Database): void {
  database.exec(`
    CREATE TABLE embedding_cache (
      content_hash TEXT NOT NULL,
      model_id TEXT NOT NULL,
      embedding BLOB NOT NULL,
      dimensions INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      last_used_at TEXT NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (content_hash, model_id, dimensions)
    )
  `);
}

function countRows(database: Database.Database, where = '1 = 1', ...params: unknown[]): number {
  const row = database.prepare(`SELECT COUNT(*) AS count FROM embedding_cache WHERE ${where}`)
    .get(...params) as { count: number };
  return row.count;
}

describe('byte-bounded embedding cache', () => {
  beforeEach(() => {
    envSnapshot = { ...process.env };
    db = new Database(':memory:');
  });

  afterEach(() => {
    process.env = envSnapshot;
    try {
      db.close();
    } catch {
      // ignore cleanup failures
    }
  });

  it('creates fresh schema with profile_key and input_kind columns', () => {
    initEmbeddingCache(db);

    const columns = db.prepare('PRAGMA table_info(embedding_cache)').all() as Array<{ name: string }>;
    expect(columns.map((column) => column.name)).toEqual(expect.arrayContaining([
      'content_hash',
      'profile_key',
      'input_kind',
      'model_id',
      'dimensions',
    ]));
  });

  it('migrates a legacy table, backfills the active profile, and is idempotent', () => {
    createLegacyEmbeddingCache(db);
    setActiveEmbedder(db, 'jina-embeddings-v3', 1024, 'ollama');
    const hash = computeContentHash('legacy document');
    db.prepare(`
      INSERT INTO embedding_cache (content_hash, model_id, embedding, dimensions)
      VALUES (?, ?, ?, ?)
    `).run(hash, 'jina-embeddings-v3', makeBuffer(32), 1024);

    initEmbeddingCache(db);
    initEmbeddingCache(db);

    const row = db.prepare(`
      SELECT profile_key, input_kind
      FROM embedding_cache
      WHERE content_hash = ?
    `).get(hash) as { profile_key: string; input_kind: string };
    expect(row).toEqual({
      profile_key: 'ollama:jina-embeddings-v3:1024',
      input_kind: 'document',
    });
    expect(lookupEmbedding(db, hash, 'jina-embeddings-v3', 1024)).not.toBeNull();
  });

  it('stores profile-keyed document embeddings', () => {
    initEmbeddingCache(db);
    const hash = computeContentHash('profile document');
    const embedding = makeBuffer(64);

    storeEmbedding(db, hash, 'jina-embeddings-v3', embedding, 1024, {
      profileKey: 'jina-v3',
      inputKind: 'document',
    });

    const row = db.prepare(`
      SELECT profile_key, input_kind
      FROM embedding_cache
      WHERE content_hash = ?
    `).get(hash) as { profile_key: string; input_kind: string };
    expect(row.profile_key).toBe('jina-v3');
    expect(row.input_kind).toBe('document');
    expect(lookupEmbedding(db, hash, 'jina-embeddings-v3', 1024, {
      profileKey: 'jina-v3',
      inputKind: 'document',
    })).not.toBeNull();
  });

  it('allows two profiles to cache the same content hash', () => {
    initEmbeddingCache(db);
    const hash = computeContentHash('same content');

    storeEmbedding(db, hash, 'model', makeBuffer(32, 1), 4, {
      profileKey: 'jina-v3',
      inputKind: 'document',
    });
    storeEmbedding(db, hash, 'model', makeBuffer(32, 2), 4, {
      profileKey: 'voyage-code',
      inputKind: 'document',
    });

    expect(countRows(db, 'content_hash = ?', hash)).toBe(2);
  });

  it('allows document and query rows for the same content hash', () => {
    initEmbeddingCache(db);
    const hash = computeContentHash('same text');

    storeEmbedding(db, hash, 'model', makeBuffer(32, 1), 4, {
      profileKey: 'jina-v3',
      inputKind: 'document',
    });
    storeEmbedding(db, hash, 'model', makeBuffer(32, 2), 4, {
      profileKey: 'jina-v3',
      inputKind: 'query',
    });

    expect(countRows(db, 'content_hash = ?', hash)).toBe(2);
  });

  it('evicts LRU rows when the global byte cap is exceeded', () => {
    process.env.SPECKIT_EMBED_CACHE_MAX_BYTES = String(50 * 1024 * 1024);
    process.env.SPECKIT_EMBED_CACHE_PROFILE_MAX_BYTES = String(100 * 1024 * 1024);
    process.env.SPECKIT_QUERY_EMBED_CACHE_MAX_BYTES = String(100 * 1024 * 1024);
    initEmbeddingCache(db);

    for (let index = 0; index < 60; index++) {
      storeEmbedding(db, computeContentHash(`global-${index}`), 'model', makeBuffer(1024 * 1024, index), 256, {
        profileKey: index < 30 ? 'jina-v3' : 'voyage-code',
        inputKind: 'document',
      });
    }

    expect(getByteEstimate(db).approxBytes).toBeLessThanOrEqual(50 * 1024 * 1024);
  });

  it('evicts only the profile that exceeds the per-profile byte cap', () => {
    process.env.SPECKIT_EMBED_CACHE_MAX_BYTES = String(100 * 1024 * 1024);
    process.env.SPECKIT_EMBED_CACHE_PROFILE_MAX_BYTES = String(25 * 1024 * 1024);
    process.env.SPECKIT_QUERY_EMBED_CACHE_MAX_BYTES = String(100 * 1024 * 1024);
    initEmbeddingCache(db);

    for (let index = 0; index < 30; index++) {
      storeEmbedding(db, computeContentHash(`profile-a-${index}`), 'model', makeBuffer(1024 * 1024, index), 256, {
        profileKey: 'jina-v3',
        inputKind: 'document',
      });
    }
    for (let index = 0; index < 10; index++) {
      storeEmbedding(db, computeContentHash(`profile-b-${index}`), 'model', makeBuffer(1024 * 1024, index), 256, {
        profileKey: 'voyage-code',
        inputKind: 'document',
      });
    }

    const byProfile = getEmbeddingCacheByProfileStats(db);
    expect(byProfile['jina-v3'].bytes).toBeLessThanOrEqual(25 * 1024 * 1024);
    expect(byProfile['voyage-code'].entries).toBe(10);
  });

  it('evicts query rows when the query byte cap is exceeded', () => {
    process.env.SPECKIT_EMBED_CACHE_MAX_BYTES = String(100 * 1024 * 1024);
    process.env.SPECKIT_EMBED_CACHE_PROFILE_MAX_BYTES = String(100 * 1024 * 1024);
    process.env.SPECKIT_QUERY_EMBED_CACHE_MAX_BYTES = String(25 * 1024 * 1024);
    initEmbeddingCache(db);

    for (let index = 0; index < 30; index++) {
      storeEmbedding(db, computeContentHash(`query-${index}`), 'model', makeBuffer(1024 * 1024, index), 256, {
        profileKey: 'jina-v3',
        inputKind: 'query',
      });
    }

    const byProfile = getEmbeddingCacheByProfileStats(db);
    expect(byProfile['jina-v3'].by_kind.query.bytes).toBeLessThanOrEqual(25 * 1024 * 1024);
  });

  it('calls PRAGMA shrink_memory when eviction deletes rows', () => {
    process.env.SPECKIT_EMBED_CACHE_MAX_BYTES = String(1024 * 1024);
    process.env.SPECKIT_EMBED_CACHE_PROFILE_MAX_BYTES = String(1024 * 1024);
    process.env.SPECKIT_QUERY_EMBED_CACHE_MAX_BYTES = String(1024 * 1024);
    initEmbeddingCache(db);
    const pragmaSpy = vi.spyOn(db, 'pragma');

    storeEmbedding(db, computeContentHash('first'), 'model', makeBuffer(900 * 1024), 256, {
      profileKey: 'jina-v3',
      inputKind: 'document',
    });
    storeEmbedding(db, computeContentHash('second'), 'model', makeBuffer(900 * 1024), 256, {
      profileKey: 'jina-v3',
      inputKind: 'document',
    });

    expect(pragmaSpy).toHaveBeenCalledWith('shrink_memory');
  });

  it('keeps legacy lookup calls working without profile or input kind', () => {
    initEmbeddingCache(db);
    const hash = computeContentHash('legacy lookup');
    const embedding = makeBuffer(64);
    storeEmbedding(db, hash, 'model', embedding, 16, {
      profileKey: 'jina-v3',
      inputKind: 'document',
    });

    const cached = lookupEmbedding(db, hash, 'model', 16);
    expect(cached).not.toBeNull();
    expect(Buffer.compare(cached!, embedding)).toBe(0);
  });
});

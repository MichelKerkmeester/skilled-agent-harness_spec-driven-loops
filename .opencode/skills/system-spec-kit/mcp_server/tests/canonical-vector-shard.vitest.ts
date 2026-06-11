import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

import Database from 'better-sqlite3';
import * as sqliteVec from 'sqlite-vec';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { getEmbeddingDimension } from '@spec-kit/shared/embeddings';
import { EmbeddingProfile } from '@spec-kit/shared/embeddings/profile';
import {
  ACTIVE_VECTOR_SCHEMA,
  activeVectorSource,
  attachActiveVectorShard,
  detachActiveVectorShard,
  getActiveVectorSource,
} from '../lib/search/vector-index-store';
import { setActiveEmbedder } from '../lib/embedders/schema';
import { create_schema, ensure_schema_version } from '../lib/search/vector-index-schema';
import { migrateLegacySingleDbToShardSync } from '../lib/search/db-shard-migration';
import { index_memory } from '../lib/search/vector-index-mutations';
import { vector_search } from '../lib/search/vector-index-queries';
import {
  clearCache,
  initEmbeddingCache,
  lookupEmbedding,
  storeEmbedding,
} from '../lib/cache/embedding-cache';
import * as checkpoints from '../lib/storage/checkpoints';

const DIM = getEmbeddingDimension();

function makeProfile(model = 'jina-embeddings-v3', dim = DIM): EmbeddingProfile {
  return new EmbeddingProfile({
    provider: 'ollama',
    model,
    dim,
    dtype: null,
    baseUrl: null,
  });
}

function makeEmbedding(value = 1, dim = DIM): Float32Array {
  const vector = new Float32Array(dim);
  vector[0] = value;
  return vector;
}

function makeEmbeddingBuffer(value = 1, dim = DIM): Buffer {
  return Buffer.from(makeEmbedding(value, dim).buffer);
}

function tableExists(db: Database.Database, schema: string, tableName: string): boolean {
  const row = db.prepare(`
    SELECT 1 AS found
    FROM ${schema}.sqlite_master
    WHERE type IN ('table', 'view') AND name = ?
    LIMIT 1
  `).get(tableName) as { found?: number } | undefined;
  return row?.found === 1;
}

function attachedSchemas(db: Database.Database): string[] {
  return (db.prepare('PRAGMA database_list').all() as Array<{ name: string }>)
    .map((row) => row.name);
}

function openCanonical(dir: string, profile = makeProfile()): Database.Database {
  const db = new Database(path.join(dir, 'context-index.sqlite'));
  sqliteVec.load(db);
  attachActiveVectorShard(db, profile);
  return db;
}

function createSchemaBackedDb(dir: string, profile = makeProfile()): Database.Database {
  const db = openCanonical(dir, profile);
  create_schema(db, {
    sqlite_vec_available: true,
    get_embedding_dim: () => profile.dim,
  });
  ensure_schema_version(db);
  attachActiveVectorShard(db, profile);
  return db;
}

function createLegacySingleDb(legacyPath: string, profile = makeProfile()): void {
  fs.mkdirSync(path.dirname(legacyPath), { recursive: true });
  const db = new Database(legacyPath);
  sqliteVec.load(db);
  db.pragma('journal_mode = WAL');
  db.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY,
      spec_folder TEXT,
      file_path TEXT,
      title TEXT,
      content_text TEXT,
      importance_tier TEXT DEFAULT 'normal',
      parent_id INTEGER,
      embedding_status TEXT DEFAULT 'success',
      trigger_phrases TEXT DEFAULT '[]',
      importance_weight REAL DEFAULT 0.5,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE vec_metadata (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
    CREATE TABLE embedding_cache (
      content_hash TEXT NOT NULL,
      profile_key TEXT NOT NULL DEFAULT '',
      input_kind TEXT NOT NULL DEFAULT 'document',
      model_id TEXT NOT NULL,
      embedding BLOB NOT NULL,
      dimensions INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      last_used_at TEXT NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (content_hash, profile_key, input_kind, model_id, dimensions)
    );
    CREATE TABLE vec_${profile.dim} (
      id INTEGER PRIMARY KEY,
      vec BLOB NOT NULL
    );
    CREATE VIRTUAL TABLE vec_memories USING vec0(
      embedding FLOAT[${profile.dim}]
    );
  `);
  db.prepare('INSERT INTO memory_index (id, spec_folder, file_path, title, content_text) VALUES (1, ?, ?, ?, ?)')
    .run('specs/demo', 'spec.md', 'Demo', 'legacy memory');
  db.prepare('INSERT INTO vec_metadata (key, value) VALUES (?, ?)')
    .run('active_embedder_name', profile.model);
  db.prepare('INSERT INTO vec_metadata (key, value) VALUES (?, ?)')
    .run('active_embedder_provider', profile.provider);
  db.prepare('INSERT INTO vec_metadata (key, value) VALUES (?, ?)')
    .run('active_embedder_dim', String(profile.dim));
  db.prepare('INSERT INTO vec_metadata (key, value) VALUES (?, ?)')
    .run('embedding_dim', String(profile.dim));
  db.prepare('INSERT INTO vec_memories(rowid, embedding) VALUES (?, ?)')
    .run(BigInt(1), makeEmbeddingBuffer());
  db.prepare(`INSERT INTO vec_${profile.dim} (id, vec) VALUES (?, ?)`)
    .run(1, makeEmbeddingBuffer());
  db.prepare(`
    INSERT INTO embedding_cache (content_hash, profile_key, input_kind, model_id, embedding, dimensions)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run('hash-1', `${profile.provider}:${profile.model}:${profile.dim}`, 'document', profile.model, makeEmbeddingBuffer(), profile.dim);
  db.close();
}

describe('canonical metadata DB + active vector shard split', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'canonical-vector-shard-'));
  });

  afterEach(() => {
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch {
      // ignore cleanup failures
    }
  });

  it('derives stable canonical and profile-specific shard paths', () => {
    const profile = makeProfile();

    expect(profile.getCanonicalDatabasePath(tempDir)).toBe(path.join(tempDir, 'context-index.sqlite'));
    expect(profile.getDatabasePath(tempDir)).toBe(profile.getCanonicalDatabasePath(tempDir));
    expect(profile.getVectorShardPath(tempDir)).toBe(
      path.join(tempDir, 'vectors', `context-vectors__${profile.slug}.sqlite`),
    );
    expect(fs.existsSync(path.join(tempDir, 'vectors'))).toBe(true);
  });

  it('creates canonical and shard files from a fresh store', () => {
    const profile = makeProfile();
    const db = openCanonical(tempDir, profile);

    expect(fs.existsSync(path.join(tempDir, 'context-index.sqlite'))).toBe(true);
    expect(fs.existsSync(profile.getVectorShardPath(tempDir))).toBe(true);
    expect(tableExists(db, ACTIVE_VECTOR_SCHEMA, 'vec_memories')).toBe(true);
    expect(tableExists(db, ACTIVE_VECTOR_SCHEMA, 'embedding_cache')).toBe(true);
    expect(tableExists(db, ACTIVE_VECTOR_SCHEMA, `vec_${profile.dim}`)).toBe(true);

    detachActiveVectorShard(db);
    db.close();
  });

  it('uses WAL for both canonical and shard databases', () => {
    const db = openCanonical(tempDir);

    expect(String(db.pragma('journal_mode', { simple: true }))).toBe('wal');
    expect(String(db.pragma(`${ACTIVE_VECTOR_SCHEMA}.journal_mode`, { simple: true }))).toBe('wal');

    detachActiveVectorShard(db);
    db.close();
  });

  it('attaches idempotently and exposes active source telemetry', () => {
    const profile = makeProfile();
    const db = openCanonical(tempDir, profile);
    attachActiveVectorShard(db, profile);

    const source = getActiveVectorSource();
    expect(source.attached).toBe(true);
    expect(source.profile.model).toBe(profile.model);
    expect(fs.realpathSync(source.shard_path)).toBe(fs.realpathSync(profile.getVectorShardPath(tempDir)));
    expect(attachedSchemas(db)).toContain(ACTIVE_VECTOR_SCHEMA);

    detachActiveVectorShard(db);
    db.close();
  });

  it('detaches and reattaches a different profile shard for profile swaps', () => {
    const first = makeProfile('jina-embeddings-v3');
    const second = makeProfile('mxbai-embed-large-v1');
    const db = openCanonical(tempDir, first);

    storeEmbedding(db, 'hash-a', first.model, makeEmbeddingBuffer(), first.dim, {
      profileKey: `${first.provider}:${first.model}:${first.dim}`,
    });
    attachActiveVectorShard(db, second);
    initEmbeddingCache(db);

    expect(lookupEmbedding(db, 'hash-a', first.model, first.dim, {
      profileKey: `${first.provider}:${first.model}:${first.dim}`,
    })).toBeNull();
    expect(fs.realpathSync(getActiveVectorSource().shard_path)).toBe(fs.realpathSync(second.getVectorShardPath(tempDir)));
    expect(attachedSchemas(db)).toContain(ACTIVE_VECTOR_SCHEMA);

    detachActiveVectorShard(db);
    db.close();
  });

  it('writes embedding_cache rows into the shard, not canonical', () => {
    const profile = makeProfile();
    const db = openCanonical(tempDir, profile);

    storeEmbedding(db, 'hash-cache', profile.model, makeEmbeddingBuffer(), profile.dim, {
      profileKey: `${profile.provider}:${profile.model}:${profile.dim}`,
      inputKind: 'query',
    });

    expect(tableExists(db, ACTIVE_VECTOR_SCHEMA, 'embedding_cache')).toBe(true);
    expect(tableExists(db, 'main', 'embedding_cache')).toBe(false);
    expect(lookupEmbedding(db, 'hash-cache', profile.model, profile.dim, {
      profileKey: `${profile.provider}:${profile.model}:${profile.dim}`,
      inputKind: 'query',
    })).toBeInstanceOf(Buffer);

    clearCache(db);
    detachActiveVectorShard(db);
    db.close();
  });

  it('indexes active embedder vector mutations into both shard payload tables', () => {
    const profile = makeProfile();
    const db = createSchemaBackedDb(tempDir, profile);
    setActiveEmbedder(db, profile.model, profile.dim, profile.provider);

    const id = index_memory({
      specFolder: 'specs/demo',
      filePath: 'spec.md',
      title: 'Shard write',
      triggerPhrases: ['shard'],
      importanceWeight: 0.5,
      embedding: makeEmbedding(),
      contentText: 'shard mutation writes land in the attached vector DB',
    }, db);

    const shardCount = db.prepare(`SELECT COUNT(*) AS count FROM ${activeVectorSource('vec_memories')} WHERE rowid = ?`)
      .get(id) as { count: number };
    expect(shardCount.count).toBe(1);
    const dimCount = db.prepare(`SELECT COUNT(*) AS count FROM ${activeVectorSource(`vec_${profile.dim}`)} WHERE id = ?`)
      .get(id) as { count: number };
    expect(dimCount.count).toBe(1);
    expect(vector_search(makeEmbedding(), { limit: 5, includeConstitutional: false }, db).map((row) => row.id))
      .toContain(id);
    expect(tableExists(db, 'main', 'vec_memories')).toBe(false);

    detachActiveVectorShard(db);
    db.close();
  });

  it('queries vectors through active_vec with the same row ordering as an unqualified legacy table', () => {
    const db = openCanonical(tempDir);
    const insert = db.prepare(`INSERT INTO ${activeVectorSource('vec_memories')} (rowid, embedding) VALUES (?, ?)`);
    insert.run(BigInt(1), makeEmbeddingBuffer(1));
    insert.run(BigInt(2), makeEmbeddingBuffer(0.5));

    const activeRows = db.prepare(`
      SELECT rowid
      FROM ${activeVectorSource('vec_memories')}
      ORDER BY vec_distance_cosine(embedding, ?) ASC
    `).all(makeEmbeddingBuffer(1)) as Array<{ rowid: number }>;
    const legacyRows = db.prepare(`
      SELECT rowid
      FROM vec_memories
      ORDER BY vec_distance_cosine(embedding, ?) ASC
    `).all(makeEmbeddingBuffer(1)) as Array<{ rowid: number }>;

    expect(activeRows.map((row) => row.rowid)).toEqual(legacyRows.map((row) => row.rowid));

    detachActiveVectorShard(db);
    db.close();
  });

  it('runs vector_search against active_vec.vec_memories', () => {
    const profile = makeProfile();
    const db = createSchemaBackedDb(tempDir, profile);
    const id = index_memory({
      specFolder: 'specs/demo',
      filePath: 'search.md',
      title: 'Searchable shard row',
      triggerPhrases: ['active_vec'],
      importanceWeight: 0.5,
      embedding: makeEmbedding(),
      contentText: 'query should join through active_vec vec_memories',
    }, db);

    const results = vector_search(makeEmbedding(), { limit: 5, includeConstitutional: false }, db);

    expect(results.map((row) => row.id)).toContain(id);
    detachActiveVectorShard(db);
    db.close();
  });

  it('migrates a legacy single DB into canonical metadata and vector shard files', () => {
    const profile = makeProfile();
    const legacyPath = path.join(tempDir, `context-index__${profile.slug}.sqlite`);
    const canonicalPath = profile.getCanonicalDatabasePath(tempDir);
    const shardPath = profile.getVectorShardPath(tempDir);
    createLegacySingleDb(legacyPath, profile);

    migrateLegacySingleDbToShardSync(legacyPath, canonicalPath, shardPath, profile);

    expect(fs.existsSync(canonicalPath)).toBe(true);
    expect(fs.existsSync(shardPath)).toBe(true);
    expect(fs.existsSync(legacyPath)).toBe(false);
    expect(fs.readdirSync(path.join(tempDir, 'migrations')).some((name) => name.endsWith('.sqlite.bak'))).toBe(true);

    const canonical = new Database(canonicalPath);
    canonical.exec(`ATTACH DATABASE '${shardPath.replace(/'/g, "''")}' AS ${ACTIVE_VECTOR_SCHEMA}`);
    expect(tableExists(canonical, 'main', 'memory_index')).toBe(true);
    expect(tableExists(canonical, 'main', 'embedding_cache')).toBe(false);
    expect(tableExists(canonical, ACTIVE_VECTOR_SCHEMA, 'embedding_cache')).toBe(true);
    expect(tableExists(canonical, ACTIVE_VECTOR_SCHEMA, 'vec_memories')).toBe(true);
    canonical.close();
  });

  it('skips migration idempotently once canonical and shard exist', () => {
    const profile = makeProfile();
    const legacyPath = path.join(tempDir, `context-index__${profile.slug}.sqlite`);
    const canonicalPath = profile.getCanonicalDatabasePath(tempDir);
    const shardPath = profile.getVectorShardPath(tempDir);
    createLegacySingleDb(legacyPath, profile);

    migrateLegacySingleDbToShardSync(legacyPath, canonicalPath, shardPath, profile);
    expect(() => migrateLegacySingleDbToShardSync(legacyPath, canonicalPath, shardPath, profile)).not.toThrow();
  });

  it('refuses to attach a shard whose metadata does not match the active profile', () => {
    const profile = makeProfile();
    const db = openCanonical(tempDir, profile);
    detachActiveVectorShard(db);
    const shard = new Database(profile.getVectorShardPath(tempDir));
    shard.prepare("UPDATE vec_metadata SET value = 'wrong-model' WHERE key = 'model'").run();
    shard.close();

    expect(() => attachActiveVectorShard(db, profile)).toThrow(/metadata mismatch/i);
    db.close();
  });

  it('keeps checkpoint state in canonical DB while snapshotting shard vectors through the alias', () => {
    const profile = makeProfile();
    const db = createSchemaBackedDb(tempDir, profile);
    const id = index_memory({
      specFolder: 'specs/demo',
      filePath: 'checkpoint.md',
      title: 'Checkpoint shard row',
      triggerPhrases: ['checkpoint'],
      importanceWeight: 0.5,
      embedding: makeEmbedding(),
      contentText: 'checkpoint tables remain canonical',
    }, db);

    checkpoints.init(db);
    const checkpoint = checkpoints.createCheckpoint({ name: 'split-checkpoint', includeEmbeddings: true });

    expect(tableExists(db, 'main', 'checkpoints')).toBe(true);
    expect(checkpoint?.name).toBe('split-checkpoint');
    expect(db.prepare('SELECT COUNT(*) AS count FROM checkpoints').get()).toMatchObject({ count: 1 });
    expect(db.prepare(`SELECT COUNT(*) AS count FROM ${activeVectorSource('vec_memories')} WHERE rowid = ?`).get(id))
      .toMatchObject({ count: 1 });

    detachActiveVectorShard(db);
    db.close();
  });
});

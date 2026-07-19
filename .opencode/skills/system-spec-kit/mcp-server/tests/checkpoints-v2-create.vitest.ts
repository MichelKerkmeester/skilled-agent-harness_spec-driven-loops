import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import Database from 'better-sqlite3';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import * as checkpoints from '../lib/storage/checkpoints';
import { SCHEMA_VERSION } from '../lib/search/vector-index-schema';

let tempDir = '';
let dbPath = '';
let database: Database.Database;

function initializeDatabase(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS schema_version (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      version INTEGER NOT NULL
    );
    INSERT OR REPLACE INTO schema_version (id, version) VALUES (1, ${SCHEMA_VERSION});

    CREATE TABLE IF NOT EXISTS memory_index (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      spec_folder TEXT NOT NULL,
      file_path TEXT NOT NULL,
      anchor_id TEXT,
      title TEXT,
      trigger_phrases TEXT,
      importance_weight REAL DEFAULT 0.5,
      created_at TEXT NOT NULL,
      updated_at TEXT,
      embedding_model TEXT,
      embedding_generated_at TEXT,
      embedding_status TEXT DEFAULT 'success',
      importance_tier TEXT DEFAULT 'normal',
      confidence REAL DEFAULT 0.5,
      stability REAL DEFAULT 1.0,
      difficulty REAL DEFAULT 5.0,
      last_review TEXT,
      review_count INTEGER DEFAULT 0,
      post_insert_enrichment_status TEXT NOT NULL DEFAULT 'complete',
      post_insert_enrichment_state TEXT,
      post_insert_enrichment_completed_at TEXT,
      post_insert_enrichment_version INTEGER
    );

    CREATE TABLE IF NOT EXISTS checkpoints (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      created_at TEXT NOT NULL,
      spec_folder TEXT,
      git_branch TEXT,
      memory_snapshot BLOB,
      file_snapshot BLOB,
      metadata TEXT,
      snapshot_format TEXT DEFAULT 'v1',
      snapshot_path TEXT
    );

    CREATE TABLE IF NOT EXISTS working_memory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT NOT NULL,
      value TEXT,
      created_at TEXT
    );

    CREATE TABLE IF NOT EXISTS causal_edges (
      id INTEGER PRIMARY KEY,
      source_id TEXT NOT NULL,
      target_id TEXT NOT NULL,
      relation TEXT NOT NULL,
      strength REAL DEFAULT 1.0,
      evidence TEXT,
      extracted_at TEXT DEFAULT CURRENT_TIMESTAMP,
      created_by TEXT DEFAULT 'manual',
      last_accessed TEXT,
      UNIQUE(source_id, target_id, relation)
    );
  `);

  const now = new Date().toISOString();
  db.prepare(`
    INSERT INTO memory_index (spec_folder, file_path, title, created_at, importance_tier)
    VALUES (?, ?, ?, ?, ?), (?, ?, ?, ?, ?)
  `).run(
    'test-spec', '/tmp/memory-a.md', 'Memory A', now, 'normal',
    'other-spec', '/tmp/memory-b.md', 'Memory B', now, 'important',
  );
}

function manifestFor(name: string): Record<string, unknown> {
  return JSON.parse(fs.readFileSync(path.join(tempDir, 'checkpoints', name, 'manifest.json'), 'utf-8')) as Record<string, unknown>;
}

beforeEach(() => {
  tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'checkpoints-v2-create-'));
  dbPath = path.join(tempDir, 'memory.sqlite');
  database = new Database(dbPath);
  initializeDatabase(database);
  checkpoints.init(database);
});

afterEach(() => {
  try { database.close(); } catch {}
  fs.rmSync(tempDir, { recursive: true, force: true });
});

describe('checkpoint v2 create', () => {
  it('creates a file-backed full database checkpoint', () => {
    const checkpoint = checkpoints.createCheckpoint({ name: 'full-db' });
    const snapshotDir = path.join(tempDir, 'checkpoints', 'full-db');
    const row = database.prepare(`
      SELECT snapshot_format, snapshot_path, memory_snapshot
      FROM checkpoints
      WHERE name = ?
    `).get('full-db') as { snapshot_format: string; snapshot_path: string; memory_snapshot: Buffer | null };
    const manifest = manifestFor('full-db');

    expect(fs.existsSync(path.join(snapshotDir, 'snapshot-main.sqlite'))).toBe(true);
    expect(fs.existsSync(path.join(snapshotDir, 'manifest.json'))).toBe(true);
    expect(row.snapshot_format).toBe('v2');
    expect(row.snapshot_path).toBe(fs.realpathSync(snapshotDir));
    expect(row.memory_snapshot).toBeNull();
    expect(checkpoint.snapshotSize).toBe((manifest.mainBytes as number) + (manifest.vecBytes as number));
    expect(manifest).toMatchObject({
      formatVersion: 2,
      specFolder: null,
      includeEmbeddings: true,
      schemaVersion: SCHEMA_VERSION,
      memoryCount: 2,
    });
  });

  it('selects v2 when main retains the vec_metadata config table (daemon post-slim state)', () => {
    // The shard-attach slimming drops vec_memories from main but intentionally
    // keeps the small vec_metadata config table as a dimension fallback. v2
    // selection must not treat that retained config table as vector payload in
    // main, or full-DB create regresses to the v1 string-ceiling path on every
    // sharded production runtime.
    database.exec(`
      CREATE TABLE IF NOT EXISTS vec_metadata (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        created_at TEXT DEFAULT (datetime('now'))
      );
      INSERT OR REPLACE INTO vec_metadata (key, value) VALUES ('embedding_dim', '768'), ('dim', '768');
    `);

    checkpoints.createCheckpoint({ name: 'v2-with-main-vec-metadata' });
    const row = database.prepare(`
      SELECT snapshot_format, snapshot_path
      FROM checkpoints
      WHERE name = ?
    `).get('v2-with-main-vec-metadata') as { snapshot_format: string; snapshot_path: string | null };

    expect(row.snapshot_format).toBe('v2');
    expect(row.snapshot_path).not.toBeNull();
  });

  it('skips vector snapshot files when embeddings are excluded or no shard is attached', () => {
    checkpoints.createCheckpoint({ name: 'no-embeddings', includeEmbeddings: false });
    const snapshotDir = path.join(tempDir, 'checkpoints', 'no-embeddings');
    const manifest = manifestFor('no-embeddings');

    expect(fs.existsSync(path.join(snapshotDir, 'snapshot-main.sqlite'))).toBe(true);
    expect(fs.existsSync(path.join(snapshotDir, 'snapshot-vec.sqlite'))).toBe(false);
    expect(manifest.vecTables).toEqual([]);
    expect(manifest.includeEmbeddings).toBe(false);
    // The attached-shard branch requires sqlite-vec and is exercised in live verification.
    expect(manifest.embedderSlug).toBeNull();
  });

  it('keeps scoped checkpoint creation on the v1 JSON path', () => {
    checkpoints.createCheckpoint({ name: 'scoped-v1', specFolder: 'test-spec' });
    const row = database.prepare(`
      SELECT snapshot_format, snapshot_path, memory_snapshot
      FROM checkpoints
      WHERE name = ?
    `).get('scoped-v1') as { snapshot_format: string; snapshot_path: string | null; memory_snapshot: Buffer | null };

    expect(row.snapshot_format).toBe('v1');
    expect(row.snapshot_path).toBeNull();
    expect(row.memory_snapshot).toBeInstanceOf(Buffer);
    expect(fs.existsSync(path.join(tempDir, 'checkpoints', 'scoped-v1'))).toBe(false);
  });

  it('prunes the oldest v2 checkpoint row and directory after the checkpoint limit', () => {
    const oldestDir = path.join(tempDir, 'checkpoints', 'v2-prune-0');

    for (let i = 0; i < checkpoints.MAX_CHECKPOINTS + 1; i += 1) {
      checkpoints.createCheckpoint({ name: `v2-prune-${i}` });
    }

    const remaining = checkpoints.listCheckpoints(null, checkpoints.MAX_CHECKPOINTS + 5);
    expect(remaining).toHaveLength(checkpoints.MAX_CHECKPOINTS);
    expect(remaining.some((checkpoint) => checkpoint.name === 'v2-prune-0')).toBe(false);
    expect(fs.existsSync(oldestDir)).toBe(false);
  });

  it('removes a v2 snapshot directory when deleting the checkpoint', () => {
    checkpoints.createCheckpoint({ name: 'delete-v2' });
    const snapshotDir = path.join(tempDir, 'checkpoints', 'delete-v2');

    expect(fs.existsSync(snapshotDir)).toBe(true);
    expect(checkpoints.deleteCheckpoint('delete-v2')).toBe(true);
    expect(fs.existsSync(snapshotDir)).toBe(false);
  });

  it('rejects unsafe checkpoint names', () => {
    expect(() => checkpoints.createCheckpoint({ name: '../evil' })).toThrow(checkpoints.CheckpointCreateError);
  });

  it('removes the published snapshot dir when the catalog INSERT fails so same-name re-creates succeed', () => {
    const finalDir = path.join(tempDir, 'checkpoints', 'insert-fail');
    // Fail the catalog INSERT (which runs AFTER the snapshot dir is published) while
    // leaving the duplicate-name SELECT working, simulating a post-publish failure.
    database.exec(`
      CREATE TRIGGER reject_checkpoint_insert
      BEFORE INSERT ON checkpoints
      WHEN NEW.name = 'insert-fail'
      BEGIN
        SELECT RAISE(ABORT, 'forced catalog insert failure');
      END;
    `);

    expect(() => checkpoints.createCheckpoint({ name: 'insert-fail' })).toThrow(checkpoints.CheckpointCreateError);
    // The orphaned published dir must be swept; otherwise a same-name re-create hits
    // ENOTEMPTY on the rename into finalDir and never recovers.
    expect(fs.existsSync(finalDir)).toBe(false);

    database.exec('DROP TRIGGER reject_checkpoint_insert');
    const recreated = checkpoints.createCheckpoint({ name: 'insert-fail' });
    expect(recreated.snapshotFormat).toBe('v2');
    expect(fs.existsSync(path.join(finalDir, 'snapshot-main.sqlite'))).toBe(true);
  });

  it('sweeps orphan snapshot directories that no catalog row references on the next create', () => {
    // A legitimate, catalog-referenced snapshot must survive the sweep.
    checkpoints.createCheckpoint({ name: 'keeper' });
    const keeperDir = path.join(tempDir, 'checkpoints', 'keeper');
    expect(fs.existsSync(keeperDir)).toBe(true);

    // Simulate the prune-after-commit leak: a snapshot dir whose catalog row was already
    // deleted, but whose directory removal never ran (crash between commit and rmSync).
    const orphanDir = path.join(tempDir, 'checkpoints', 'orphan-leaked');
    fs.mkdirSync(orphanDir, { recursive: true, mode: 0o700 });
    fs.writeFileSync(path.join(orphanDir, 'snapshot-main.sqlite'), 'leaked');
    expect(fs.existsSync(orphanDir)).toBe(true);

    // The next create runs the orphan sweep during its maintenance window.
    checkpoints.createCheckpoint({ name: 'after-orphan' });

    expect(fs.existsSync(orphanDir)).toBe(false);
    expect(fs.existsSync(keeperDir)).toBe(true);
    expect(fs.existsSync(path.join(tempDir, 'checkpoints', 'after-orphan', 'snapshot-main.sqlite'))).toBe(true);
  });

  it('sweeps stale temporary checkpoint directories before creating a new snapshot', () => {
    const staleDir = path.join(tempDir, 'checkpoints', 'orphan.tmp-12345');
    fs.mkdirSync(staleDir, { recursive: true, mode: 0o700 });
    fs.writeFileSync(path.join(staleDir, 'partial'), 'stale');

    checkpoints.createCheckpoint({ name: 'after-stale' });

    expect(fs.existsSync(staleDir)).toBe(false);
    expect(fs.existsSync(path.join(tempDir, 'checkpoints', 'after-stale', 'snapshot-main.sqlite'))).toBe(true);
  });
});

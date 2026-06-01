import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import Database from 'better-sqlite3';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import * as checkpoints from '../lib/storage/checkpoints';

let tempDir = '';
let dbPath = '';
let database: Database.Database;

function initializeDatabase(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS schema_version (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      version INTEGER NOT NULL
    );
    INSERT OR REPLACE INTO schema_version (id, version) VALUES (1, 29);

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
      review_count INTEGER DEFAULT 0
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
    INSERT INTO memory_index (id, spec_folder, file_path, title, created_at, importance_tier)
    VALUES (?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?)
  `).run(
    1, 'test-spec', '/tmp/memory-a.md', 'Memory A', now, 'normal',
    2, 'test-spec', '/tmp/memory-b.md', 'Memory B', now, 'important',
  );
}

function captureMemories(db: Database.Database): Array<Record<string, unknown>> {
  return db.prepare(`
    SELECT id, spec_folder, file_path, title, importance_tier
    FROM memory_index
    ORDER BY id
  `).all() as Array<Record<string, unknown>>;
}

function flatReopen(targetPath: string, swapFn: () => void): Database.Database {
  try { database.close(); } catch {}
  swapFn();
  database = new Database(targetPath);
  checkpoints.init(database);
  return database;
}

function readManifest(name: string): Record<string, unknown> {
  return JSON.parse(fs.readFileSync(path.join(tempDir, 'checkpoints', name, 'manifest.json'), 'utf-8')) as Record<string, unknown>;
}

function writeManifest(name: string, manifest: Record<string, unknown>): void {
  fs.writeFileSync(
    path.join(tempDir, 'checkpoints', name, 'manifest.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );
}

beforeEach(() => {
  tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'checkpoints-v2-restore-'));
  dbPath = path.join(tempDir, 'memory.sqlite');
  database = new Database(dbPath);
  initializeDatabase(database);
  checkpoints.init(database);
});

afterEach(() => {
  checkpoints.setRestoreBarrierHooks(null);
  try { database.close(); } catch {}
  fs.rmSync(tempDir, { recursive: true, force: true });
});

describe('checkpoint v2 restore', () => {
  it('restores a v2 file snapshot by swapping the database file', () => {
    const baseline = captureMemories(database);
    checkpoints.createCheckpoint({ name: 'v2-roundtrip', includeEmbeddings: false });

    database.prepare('UPDATE memory_index SET title = ? WHERE id = ?').run('Memory A mutated', 1);
    database.prepare(`
      INSERT INTO memory_index (id, spec_folder, file_path, title, created_at, importance_tier)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(3, 'test-spec', '/tmp/memory-c.md', 'Memory C', new Date().toISOString(), 'normal');

    const result = checkpoints.restoreCheckpoint('v2-roundtrip', false, {}, { reopen: flatReopen });

    expect(result.errors).toEqual([]);
    expect(result.restored).toBe(2);
    expect(captureMemories(database)).toEqual(baseline);
    expect(fs.existsSync(`${dbPath}.bak`)).toBe(false);
    expect(checkpoints.isRestoreInProgress()).toBe(false);
  });

  it('rolls back .bak files when reopen fails after the swap', () => {
    checkpoints.createCheckpoint({ name: 'v2-rollback', includeEmbeddings: false });
    database.prepare('UPDATE memory_index SET title = ? WHERE id = ?').run('Live mutation survives rollback', 1);

    let reopenCalls = 0;
    const failingReopen = (targetPath: string, swapFn: () => void): Database.Database => {
      try { database.close(); } catch {}
      swapFn();
      reopenCalls += 1;
      if (reopenCalls === 1) {
        throw new Error('forced reopen failure');
      }
      database = new Database(targetPath);
      checkpoints.init(database);
      return database;
    };

    const result = checkpoints.restoreCheckpoint('v2-rollback', false, {}, { reopen: failingReopen });

    expect(result.errors.join('\n')).toContain('CHECKPOINT_RESTORE_SWAP_FAILED');
    expect(captureMemories(database)[0]?.title).toBe('Live mutation survives rollback');
    expect(fs.existsSync(`${dbPath}.bak`)).toBe(false);
    expect(checkpoints.isRestoreInProgress()).toBe(false);
  });

  it('keeps v1 checkpoint rows on the JSON restore path', () => {
    checkpoints.createCheckpoint({ name: 'scoped-v1', specFolder: 'test-spec' });
    database.prepare('UPDATE memory_index SET title = ? WHERE id = ?').run('Memory A mutated', 1);

    const result = checkpoints.restoreCheckpoint('scoped-v1', true, {}, {
      reopen: () => {
        throw new Error('v1 must not use the v2 reopen hook');
      },
    });

    expect(result.errors).toEqual([]);
    expect(captureMemories(database)[0]?.title).toBe('Memory A');
    expect(checkpoints.isRestoreInProgress()).toBe(false);
  });

  it('refuses manifests from a newer schema version', () => {
    checkpoints.createCheckpoint({ name: 'future-schema', includeEmbeddings: false });
    const manifest = readManifest('future-schema');
    writeManifest('future-schema', { ...manifest, schemaVersion: 30 });

    const result = checkpoints.restoreCheckpoint('future-schema', false, {}, { reopen: flatReopen });

    expect(result.errors.join('\n')).toContain('CHECKPOINT_RESTORE_DOWNGRADE_UNSAFE');
    expect(checkpoints.isRestoreInProgress()).toBe(false);
  });

  it('refuses manifests with an embedder slug mismatch', () => {
    checkpoints.createCheckpoint({ name: 'embedder-mismatch', includeEmbeddings: false });
    const manifest = readManifest('embedder-mismatch');
    writeManifest('embedder-mismatch', { ...manifest, embedderSlug: 'other-provider__other-model__4' });

    const result = checkpoints.restoreCheckpoint('embedder-mismatch', false, {}, { reopen: flatReopen });

    expect(result.errors.join('\n')).toContain('CHECKPOINT_RESTORE_EMBEDDER_MISMATCH');
    expect(checkpoints.isRestoreInProgress()).toBe(false);
  });
});

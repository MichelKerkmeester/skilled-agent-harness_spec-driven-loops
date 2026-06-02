import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import Database from 'better-sqlite3';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import * as checkpoints from '../lib/storage/checkpoints';
import { closeDb, initializeDb, recoverInterruptedCheckpointRestore } from '../lib/search/vector-index-store';

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

function getRestoreJournalPath(): string {
  return path.join(tempDir, 'checkpoints', '.restore-journal.json');
}

function getNeedsRebuildSentinelPath(): string {
  return path.join(tempDir, 'checkpoints', '.needs-rebuild');
}

function createMarkerDatabase(targetPath: string, value: string): void {
  const markerDb = new Database(targetPath);
  markerDb.exec('CREATE TABLE marker (value TEXT NOT NULL)');
  markerDb.prepare('INSERT INTO marker (value) VALUES (?)').run(value);
  markerDb.close();
}

function readMarkerValue(targetPath: string): string {
  const markerDb = new Database(targetPath, { readonly: true });
  try {
    return (markerDb.prepare('SELECT value FROM marker').get() as { value: string }).value;
  } finally {
    markerDb.close();
  }
}

function writeRestoreJournal(name: string, backupMainPath: string): void {
  writeRestoreJournalForPath(name, dbPath, backupMainPath, getRestoreJournalPath());
}

function writeRestoreJournalForPath(
  name: string,
  liveMainPath: string,
  backupMainPath: string,
  journalPath: string,
  overrides: Partial<{
    phase: 'swap-pending' | 'swap-done';
    liveShardPath: string | null;
    backupShardPath: string | null;
    snapshotVecPath: string | null;
    shouldRestoreVec: boolean;
    liveShardPreexisted: boolean;
  }> = {},
): void {
  fs.mkdirSync(path.dirname(journalPath), { recursive: true, mode: 0o700 });
  fs.writeFileSync(journalPath, `${JSON.stringify({
    formatVersion: 1,
    phase: overrides.phase ?? 'swap-pending',
    createdAt: new Date().toISOString(),
    checkpointName: name,
    liveMainPath,
    backupMainPath,
    snapshotMainPath: path.join(path.dirname(journalPath), name, 'snapshot-main.sqlite'),
    liveShardPath: overrides.liveShardPath ?? null,
    backupShardPath: overrides.backupShardPath ?? null,
    snapshotVecPath: overrides.snapshotVecPath ?? null,
    shouldRestoreVec: overrides.shouldRestoreVec ?? false,
    liveShardPreexisted: overrides.liveShardPreexisted ?? false,
  }, null, 2)}\n`);
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
  closeDb();
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

  it('writes a needs-rebuild sentinel when post-restore derived rebuild fails but restore succeeds', () => {
    database.exec('ALTER TABLE memory_index ADD COLUMN parent_id INTEGER');
    checkpoints.createCheckpoint({ name: 'v2-rebuild-failure', includeEmbeddings: false });
    database.prepare('UPDATE memory_index SET title = ? WHERE id = ?').run('Memory A mutated', 1);

    const result = checkpoints.restoreCheckpoint('v2-rebuild-failure', false, {}, { reopen: flatReopen });
    const sentinelPath = getNeedsRebuildSentinelPath();
    const sentinel = JSON.parse(fs.readFileSync(sentinelPath, 'utf-8')) as {
      rebuildSummary?: {
        failed?: Array<{ name?: string }>;
        skipped?: Array<{ name?: string }>;
      };
    };

    expect(result.errors).toEqual([]);
    expect(result.restored).toBe(2);
    expect(fs.existsSync(sentinelPath)).toBe(true);
    expect(sentinel.rebuildSummary?.failed?.some((entry) => entry.name === 'auto-entities')).toBe(true);
    expect(sentinel.rebuildSummary?.skipped?.some((entry) => entry.name === 'fts-rebuild')).toBe(true);
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

  it('recovers an interrupted v2 restore from the boot journal', () => {
    checkpoints.createCheckpoint({ name: 'restore-crash', includeEmbeddings: false });
    database.prepare('UPDATE memory_index SET title = ? WHERE id = ?').run('Live mutation before crash', 1);
    database.close();

    const checkpointDir = path.join(tempDir, 'checkpoints', 'restore-crash');
    const snapshotMainPath = path.join(checkpointDir, 'snapshot-main.sqlite');
    const journalPath = getRestoreJournalPath();
    const backupMainPath = `${dbPath}.bak`;

    writeRestoreJournal('restore-crash', backupMainPath);
    fs.renameSync(dbPath, backupMainPath);
    fs.copyFileSync(snapshotMainPath, dbPath);

    expect(recoverInterruptedCheckpointRestore(dbPath)).toBe(true);
    database = new Database(dbPath);
    checkpoints.init(database);

    expect(captureMemories(database)[0]?.title).toBe('Live mutation before crash');
    expect(fs.existsSync(journalPath)).toBe(false);
    expect(fs.existsSync(backupMainPath)).toBe(false);
  });

  it('keeps the restored database for a swap-done restore journal', () => {
    database.close();
    const backupMainPath = `${dbPath}.bak`;
    const journalPath = getRestoreJournalPath();
    fs.rmSync(dbPath, { force: true });
    createMarkerDatabase(dbPath, 'restored-live');
    createMarkerDatabase(backupMainPath, 'original-live');
    writeRestoreJournalForPath('swap-done-recovery', dbPath, backupMainPath, journalPath, {
      phase: 'swap-done',
    });

    expect(recoverInterruptedCheckpointRestore(dbPath)).toBe(true);

    expect(readMarkerValue(dbPath)).toBe('restored-live');
    expect(fs.existsSync(journalPath)).toBe(false);
    expect(fs.existsSync(getNeedsRebuildSentinelPath())).toBe(true);
    expect(fs.existsSync(backupMainPath)).toBe(false);
  });

  it('rolls back the database for a swap-pending restore journal', () => {
    database.close();
    const backupMainPath = `${dbPath}.bak`;
    const journalPath = getRestoreJournalPath();
    fs.rmSync(dbPath, { force: true });
    createMarkerDatabase(dbPath, 'snapshot-live');
    createMarkerDatabase(backupMainPath, 'original-live');
    writeRestoreJournalForPath('swap-pending-recovery', dbPath, backupMainPath, journalPath, {
      phase: 'swap-pending',
    });

    expect(recoverInterruptedCheckpointRestore(dbPath)).toBe(true);

    expect(readMarkerValue(dbPath)).toBe('original-live');
    expect(fs.existsSync(journalPath)).toBe(false);
    expect(fs.existsSync(backupMainPath)).toBe(false);
  });

  it('does not touch a stale shard backup when embeddings were not restored', () => {
    database.close();
    const backupMainPath = `${dbPath}.bak`;
    const journalPath = getRestoreJournalPath();
    const liveShardPath = path.join(tempDir, 'vectors', 'context-vectors__test.sqlite');
    const staleShardBackupPath = `${liveShardPath}.bak`;
    fs.mkdirSync(path.dirname(liveShardPath), { recursive: true, mode: 0o700 });
    fs.rmSync(dbPath, { force: true });
    createMarkerDatabase(dbPath, 'snapshot-live');
    createMarkerDatabase(backupMainPath, 'original-live');
    createMarkerDatabase(liveShardPath, 'current-shard');
    createMarkerDatabase(staleShardBackupPath, 'stale-shard');
    writeRestoreJournalForPath('main-only-recovery', dbPath, backupMainPath, journalPath, {
      phase: 'swap-pending',
      shouldRestoreVec: false,
      liveShardPath: null,
      backupShardPath: null,
      snapshotVecPath: null,
      liveShardPreexisted: false,
    });

    expect(recoverInterruptedCheckpointRestore(dbPath)).toBe(true);

    expect(readMarkerValue(dbPath)).toBe('original-live');
    expect(readMarkerValue(liveShardPath)).toBe('current-shard');
    expect(readMarkerValue(staleShardBackupPath)).toBe('stale-shard');
  });

  it('removes a restored shard on rollback when no live shard preexisted', () => {
    database.close();
    const backupMainPath = `${dbPath}.bak`;
    const journalPath = getRestoreJournalPath();
    const liveShardPath = path.join(tempDir, 'vectors', 'context-vectors__test.sqlite');
    const backupShardPath = `${liveShardPath}.bak`;
    fs.mkdirSync(path.dirname(liveShardPath), { recursive: true, mode: 0o700 });
    fs.rmSync(dbPath, { force: true });
    createMarkerDatabase(dbPath, 'snapshot-live');
    createMarkerDatabase(backupMainPath, 'original-live');
    createMarkerDatabase(liveShardPath, 'snapshot-shard');
    writeRestoreJournalForPath('new-shard-rollback', dbPath, backupMainPath, journalPath, {
      phase: 'swap-pending',
      shouldRestoreVec: true,
      liveShardPath,
      backupShardPath,
      snapshotVecPath: path.join(tempDir, 'checkpoints', 'new-shard-rollback', 'snapshot-vec.sqlite'),
      liveShardPreexisted: false,
    });

    expect(recoverInterruptedCheckpointRestore(dbPath)).toBe(true);

    expect(readMarkerValue(dbPath)).toBe('original-live');
    expect(fs.existsSync(liveShardPath)).toBe(false);
    expect(fs.existsSync(backupShardPath)).toBe(false);
  });

  it('skips boot restore recovery only for the intentional reopen path', () => {
    database.close();
    const restoreDbPath = path.join(tempDir, 'restore-skip.sqlite');
    const backupMainPath = `${restoreDbPath}.bak`;
    const journalPath = path.join(tempDir, 'checkpoints', '.restore-journal.json');
    for (const [targetPath, value] of [[restoreDbPath, 'snapshot-live'], [backupMainPath, 'backup-original']] as const) {
      createMarkerDatabase(targetPath, value);
    }
    writeRestoreJournalForPath('skip-recovery', restoreDbPath, backupMainPath, journalPath);

    database = initializeDb(restoreDbPath, { skipRestoreRecovery: true });
    expect((database.prepare('SELECT value FROM marker').get() as { value: string }).value).toBe('snapshot-live');
    expect(fs.existsSync(journalPath)).toBe(true);
    expect(fs.existsSync(backupMainPath)).toBe(true);

    closeDb();
    database = initializeDb(restoreDbPath);

    expect((database.prepare('SELECT value FROM marker').get() as { value: string }).value).toBe('backup-original');
    expect(fs.existsSync(journalPath)).toBe(false);
    expect(fs.existsSync(backupMainPath)).toBe(false);
  });

  it('clears the restore journal before best-effort backup cleanup', () => {
    checkpoints.createCheckpoint({ name: 'cleanup-order', includeEmbeddings: false });
    database.prepare('UPDATE memory_index SET title = ? WHERE id = ?').run('Memory A mutated', 1);
    const backupMainPath = `${dbPath}.bak`;
    const cleanupFailingReopen = (targetPath: string, swapFn: () => void): Database.Database => {
      try { database.close(); } catch {}
      swapFn();
      fs.unlinkSync(backupMainPath);
      fs.mkdirSync(backupMainPath, { mode: 0o700 });
      database = new Database(targetPath);
      checkpoints.init(database);
      return database;
    };

    const result = checkpoints.restoreCheckpoint('cleanup-order', false, {}, { reopen: cleanupFailingReopen });

    expect(result.errors).toEqual([]);
    expect(captureMemories(database)[0]?.title).toBe('Memory A');
    expect(fs.existsSync(getRestoreJournalPath())).toBe(false);
    expect(fs.existsSync(backupMainPath)).toBe(true);
    expect(recoverInterruptedCheckpointRestore(dbPath)).toBe(false);
    expect(captureMemories(database)[0]?.title).toBe('Memory A');
  });

  it('writes the restore journal atomically and clears it after success', () => {
    checkpoints.createCheckpoint({ name: 'atomic-journal', includeEmbeddings: false });
    database.prepare('UPDATE memory_index SET title = ? WHERE id = ?').run('Memory A mutated', 1);
    const journalPath = getRestoreJournalPath();
    let inspectedJournal = false;
    const inspectingReopen = (targetPath: string, swapFn: () => void): Database.Database => {
      try { database.close(); } catch {}
      swapFn();
      const parsed = JSON.parse(fs.readFileSync(journalPath, 'utf-8')) as Record<string, unknown>;
      expect(parsed.formatVersion).toBe(1);
      expect(fs.realpathSync(parsed.liveMainPath as string)).toBe(fs.realpathSync(dbPath));
      expect(fs.existsSync(`${journalPath}.tmp`)).toBe(false);
      inspectedJournal = true;
      database = new Database(targetPath);
      checkpoints.init(database);
      return database;
    };

    const result = checkpoints.restoreCheckpoint('atomic-journal', false, {}, { reopen: inspectingReopen });

    expect(result.errors).toEqual([]);
    expect(inspectedJournal).toBe(true);
    expect(fs.existsSync(journalPath)).toBe(false);
  });

  it('ignores malformed or temporary restore journals during recovery', () => {
    const journalPath = getRestoreJournalPath();
    fs.mkdirSync(path.dirname(journalPath), { recursive: true, mode: 0o700 });
    fs.writeFileSync(`${journalPath}.tmp`, '{"formatVersion":1');

    expect(recoverInterruptedCheckpointRestore(dbPath)).toBe(false);

    fs.writeFileSync(journalPath, '{"formatVersion":');

    expect(() => recoverInterruptedCheckpointRestore(dbPath)).not.toThrow();
    expect(recoverInterruptedCheckpointRestore(dbPath)).toBe(false);
    expect(fs.existsSync(journalPath)).toBe(true);
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
    writeManifest('future-schema', { ...manifest, schemaVersion: 9999 });

    const result = checkpoints.restoreCheckpoint('future-schema', false, {}, { reopen: flatReopen });

    expect(result.errors.join('\n')).toContain('CHECKPOINT_RESTORE_DOWNGRADE_UNSAFE');
    expect(checkpoints.isRestoreInProgress()).toBe(false);
  });

  it('refuses manifests with a missing schema version', () => {
    checkpoints.createCheckpoint({ name: 'missing-schema', includeEmbeddings: false });
    const manifest = readManifest('missing-schema');
    const withoutSchemaVersion = { ...manifest };
    delete withoutSchemaVersion.schemaVersion;
    writeManifest('missing-schema', withoutSchemaVersion);

    const result = checkpoints.restoreCheckpoint('missing-schema', false, {}, { reopen: flatReopen });

    expect(result.errors.join('\n')).toContain('CHECKPOINT_RESTORE_MANIFEST_INVALID');
    expect(checkpoints.isRestoreInProgress()).toBe(false);
  });

  it('preserves the restored checkpoint catalog row after v2 restore', () => {
    const checkpointInfo = checkpoints.createCheckpoint({ name: 'catalog-preserved', includeEmbeddings: false });
    database.prepare('UPDATE memory_index SET title = ? WHERE id = ?').run('Memory A mutated', 1);

    const result = checkpoints.restoreCheckpoint('catalog-preserved', false, {}, { reopen: flatReopen });

    expect(result.errors).toEqual([]);
    expect(checkpoints.listCheckpoints().some((checkpoint) => checkpoint.name === 'catalog-preserved')).toBe(true);
    expect(typeof checkpointInfo.snapshotPath).toBe('string');
    expect(fs.existsSync(checkpointInfo.snapshotPath as string)).toBe(true);
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

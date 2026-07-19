import Database from 'better-sqlite3';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { afterEach, describe, expect, it } from 'vitest';

import {
  createSchema,
  ensureSchemaVersion,
  runMigrations,
  SCHEMA_VERSION,
} from '../lib/search/vector-index-schema';
import * as checkpoints from '../lib/storage/checkpoints';

const openDatabases = new Set<Database.Database>();
const dbPaths = new Set<string>();

function createTestDb(): { database: Database.Database; dbPath: string } {
  const dbPath = path.join(os.tmpdir(), `checkpoints-schema-v29-${Date.now()}-${Math.random().toString(36).slice(2)}.db`);
  const database = new Database(dbPath);
  openDatabases.add(database);
  dbPaths.add(dbPath);
  return { database, dbPath };
}

function initializeDatabase(database: Database.Database): void {
  createSchema(database, {
    sqlite_vec_available: false,
    get_embedding_dim: () => 4,
  });
  ensureSchemaVersion(database);
}

function checkpointColumns(database: Database.Database): string[] {
  return (database.prepare('PRAGMA table_info(checkpoints)').all() as Array<{ name: string }>)
    .map((column) => column.name);
}

function rebuildCheckpointsAsV28(database: Database.Database): void {
  database.exec(`
    ALTER TABLE checkpoints RENAME TO checkpoints_v28_backup;
    CREATE TABLE checkpoints (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL,
      spec_folder TEXT,
      git_branch TEXT,
      memory_snapshot BLOB,
      file_snapshot BLOB,
      metadata TEXT
    );
    INSERT INTO checkpoints (id, name, created_at, spec_folder, git_branch, memory_snapshot, file_snapshot, metadata)
    SELECT id, name, created_at, spec_folder, git_branch, memory_snapshot, file_snapshot, metadata
    FROM checkpoints_v28_backup;
    DROP TABLE checkpoints_v28_backup;
  `);
}

describe('checkpoints schema v29', () => {
  afterEach(() => {
    for (const database of openDatabases) {
      try { database.close(); } catch {}
      openDatabases.delete(database);
    }
    for (const dbPath of dbPaths) {
      if (fs.existsSync(dbPath)) {
        try { fs.unlinkSync(dbPath); } catch {}
      }
      dbPaths.delete(dbPath);
    }
  });

  it('initializes fresh databases with checkpoint snapshot columns', () => {
    const { database } = createTestDb();

    initializeDatabase(database);

    const version = database.prepare('SELECT version FROM schema_version WHERE id = 1').get() as { version: number };
    expect(SCHEMA_VERSION).toBeGreaterThanOrEqual(29);
    expect(version.version).toBe(SCHEMA_VERSION);
    expect(checkpointColumns(database)).toEqual(expect.arrayContaining([
      'snapshot_format',
      'snapshot_path',
    ]));
  });

  it('migrates existing checkpoint rows with snapshot_format defaulting to v1', () => {
    const { database } = createTestDb();
    initializeDatabase(database);
    rebuildCheckpointsAsV28(database);
    database.prepare('UPDATE schema_version SET version = 28 WHERE id = 1').run();
    database.prepare(`
      INSERT INTO checkpoints (name, created_at, spec_folder, git_branch, memory_snapshot, file_snapshot, metadata)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run('legacy-checkpoint', '2026-06-01T00:00:00.000Z', null, null, Buffer.from('snapshot'), null, '{}');

    ensureSchemaVersion(database);
    runMigrations(database, 28, 29);
    checkpoints.init(database);

    const columns = checkpointColumns(database);
    const version = database.prepare('SELECT version FROM schema_version WHERE id = 1').get() as { version: number };
    const row = database.prepare('SELECT snapshot_format, snapshot_path FROM checkpoints WHERE name = ?').get('legacy-checkpoint') as {
      snapshot_format: string;
      snapshot_path: string | null;
    };
    const listed = checkpoints.listCheckpoints(null, 10);

    expect(version.version).toBe(SCHEMA_VERSION);
    expect(columns).toEqual(expect.arrayContaining(['snapshot_format', 'snapshot_path']));
    expect(row).toEqual({ snapshot_format: 'v1', snapshot_path: null });
    expect(listed[0]).toMatchObject({
      name: 'legacy-checkpoint',
      snapshotFormat: 'v1',
      snapshotPath: null,
    });
  });
});

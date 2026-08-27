import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  ACTIVE_VECTOR_SCHEMA,
  __testables,
  checkpointAllWal,
  close_db,
  initializeDb,
} from '../lib/search/vector-index-store';

const skillRoot = path.resolve(import.meta.dirname, '..', '..');

function createTempDbPath(label: string): { dir: string; dbPath: string } {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), `${label}-`));
  return {
    dir,
    dbPath: path.join(dir, `${label}.sqlite`),
  };
}

function removeTempDir(dir: string): void {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

function insertTestMemory(
  db: ReturnType<typeof initializeDb>,
  specFolder: string,
  id: number,
  title: string,
  filePath: string,
): void {
  const now = new Date().toISOString();
  db.prepare(`
    INSERT INTO memory_index (
      id, spec_folder, file_path, title, trigger_phrases,
      importance_tier, importance_weight, created_at, updated_at, embedding_status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    specFolder,
    filePath,
    title,
    '["rule"]',
    'normal',
    1,
    now,
    now,
    'success',
  );
  db.prepare(`
    INSERT INTO active_memory_projection (logical_key, root_memory_id, active_memory_id, updated_at)
    VALUES (?, ?, ?, ?)
  `).run(`${specFolder}::${id}`, id, id, now);
}

describe('vector shard base directory diagnostics', () => {
  it('warns when an invocation resolves the database base to the skill root', () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    __testables.warn_if_skill_root_vector_base_dir(skillRoot);

    expect(warning).toHaveBeenCalledWith(expect.stringContaining('misconfigured'));
    expect(warning).toHaveBeenCalledWith(expect.stringContaining(skillRoot));
    warning.mockClear();

    __testables.warn_if_skill_root_vector_base_dir(os.tmpdir());

    expect(warning).not.toHaveBeenCalled();
  });
});

describe('close_db WAL checkpoint (FTS-corruption prevention, bug 026/004/012)', () => {
  afterEach(() => {
    close_db();
  });

  it('runs wal_checkpoint(TRUNCATE) before closing the main DB', () => {
    const { dir, dbPath } = createTempDbPath('close-db-wal');
    try {
      const db = initializeDb(dbPath);
      const pragmaSpy = vi.spyOn(db, 'pragma');
      close_db();
      expect(pragmaSpy).toHaveBeenCalledWith('wal_checkpoint(TRUNCATE)');
    } finally {
      removeTempDir(dir);
    }
  });

  it('checkpoints the active vector shard before detaching it on close', () => {
    const { dir, dbPath } = createTempDbPath('close-db-shard-wal');
    try {
      const db = initializeDb(dbPath);
      const pragmaSpy = vi.spyOn(db, 'pragma');
      const execSpy = vi.spyOn(db, 'exec');

      close_db();

      const shardCheckpointIndex = pragmaSpy.mock.calls.findIndex(
        ([statement]) => statement === `${ACTIVE_VECTOR_SCHEMA}.wal_checkpoint(TRUNCATE)`,
      );
      const detachIndex = execSpy.mock.calls.findIndex(
        ([statement]) => typeof statement === 'string' && statement.includes(`DETACH DATABASE ${ACTIVE_VECTOR_SCHEMA}`),
      );

      expect(shardCheckpointIndex).toBeGreaterThanOrEqual(0);
      expect(detachIndex).toBeGreaterThanOrEqual(0);
      expect(pragmaSpy.mock.invocationCallOrder[shardCheckpointIndex]).toBeLessThan(
        execSpy.mock.invocationCallOrder[detachIndex],
      );
    } finally {
      removeTempDir(dir);
    }
  });

  it('checkpointAllWal checkpoints the active vector shard and main DB', () => {
    const { dir, dbPath } = createTempDbPath('periodic-wal-checkpoint');
    try {
      const db = initializeDb(dbPath);
      const pragmaSpy = vi.spyOn(db, 'pragma');

      checkpointAllWal();

      expect(pragmaSpy).toHaveBeenCalledWith(`${ACTIVE_VECTOR_SCHEMA}.wal_checkpoint(TRUNCATE)`);
      expect(pragmaSpy).toHaveBeenCalledWith('wal_checkpoint(TRUNCATE)');
    } finally {
      removeTempDir(dir);
    }
  });

  it('leaves the WAL truncated and data durable at rest', () => {
    const { dir, dbPath } = createTempDbPath('close-db-wal-rest');
    try {
      const db = initializeDb(dbPath);
      insertTestMemory(db, '026-004-012/test', 1, 'Rule', '/tmp/rule.md');
      close_db();
      const walPath = `${dbPath}-wal`;
      const walSize = fs.existsSync(walPath) ? fs.statSync(walPath).size : 0;
      expect(walSize).toBe(0);
      const reopened = initializeDb(dbPath);
      const row = reopened.prepare('SELECT COUNT(*) AS c FROM memory_index').get() as { c: number };
      expect(row.c).toBe(1);
    } finally {
      removeTempDir(dir);
    }
  });
});

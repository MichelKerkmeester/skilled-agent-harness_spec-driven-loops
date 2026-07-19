import { execFileSync } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import Database from 'better-sqlite3';
import { describe, expect, it } from 'vitest';

describe('z_archive archived-tier migration harness', () => {
  it('defaults to dry-run count-only against a fixture database', () => {
    const dir = mkdtempSync(join(tmpdir(), 'z-archive-migration-'));
    const dbPath = join(dir, 'fixture.sqlite');
    const db = new Database(dbPath);
    db.exec(`
      CREATE TABLE memory_index (
        id INTEGER PRIMARY KEY,
        file_path TEXT,
        canonical_file_path TEXT,
        importance_tier TEXT,
        is_archived INTEGER DEFAULT 0,
        updated_at TEXT
      );
      INSERT INTO memory_index (id, file_path, importance_tier) VALUES
        (1, 'specs/z_archive/old.md', 'critical'),
        (2, 'specs/live/current.md', 'important'),
        (3, 'nested/z_archive/old-plan.md', 'important');
    `);
    db.close();

    const output = execFileSync('node', [
      'scripts/migrations/mark-z-archive-rows-archived.mjs',
      '--db',
      dbPath,
    ], {
      cwd: process.cwd(),
      encoding: 'utf8',
    });
    const result = JSON.parse(output) as Record<string, unknown>;

    expect(result).toMatchObject({
      script: 'mark-z-archive-rows-archived',
      mode: 'dry-run',
      archiveRows: 2,
      criticalRows: 1,
      importantRows: 1,
      updated: 0,
    });
  });

  it('restores prior tiers from audit rows in rollback mode', () => {
    const dir = mkdtempSync(join(tmpdir(), 'z-archive-migration-rollback-'));
    const dbPath = join(dir, 'fixture.sqlite');
    const db = new Database(dbPath);
    db.exec(`
      CREATE TABLE memory_index (
        id INTEGER PRIMARY KEY,
        file_path TEXT,
        canonical_file_path TEXT,
        importance_tier TEXT,
        is_archived INTEGER DEFAULT 0,
        updated_at TEXT
      );
      INSERT INTO memory_index (id, file_path, importance_tier) VALUES
        (1, 'specs/z_archive/old.md', 'critical'),
        (2, 'nested/z_archive/old-plan.md', 'important');
    `);
    db.close();

    execFileSync('node', [
      'scripts/migrations/mark-z-archive-rows-archived.mjs',
      '--db',
      dbPath,
      '--apply',
      '--baseline-count',
      '2',
    ], {
      cwd: process.cwd(),
      encoding: 'utf8',
    });

    const output = execFileSync('node', [
      'scripts/migrations/mark-z-archive-rows-archived.mjs',
      '--db',
      dbPath,
      '--rollback',
      '--baseline-count',
      '2',
    ], {
      cwd: process.cwd(),
      encoding: 'utf8',
    });
    const result = JSON.parse(output) as Record<string, unknown>;

    const verifyDb = new Database(dbPath, { readonly: true });
    const rows = verifyDb.prepare('SELECT id, importance_tier, is_archived FROM memory_index ORDER BY id').all() as Array<Record<string, unknown>>;
    verifyDb.close();

    expect(result).toMatchObject({
      script: 'mark-z-archive-rows-archived',
      mode: 'rollback',
      restored: 2,
      rollbackAuditRows: 2,
    });
    expect(rows).toEqual([
      { id: 1, importance_tier: 'critical', is_archived: 0 },
      { id: 2, importance_tier: 'important', is_archived: 0 },
    ]);
  });
});

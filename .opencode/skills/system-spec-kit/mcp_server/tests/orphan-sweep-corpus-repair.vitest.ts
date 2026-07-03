import { afterEach, describe, expect, it } from 'vitest';
import Database from 'better-sqlite3';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { readOrphanSweepCursor, writeOrphanSweepCursor } from '../handlers/memory-index';
import { init, reconcileMoves, sweepOrphanIndexRows } from '../lib/storage/incremental-index';
import { parseNearDuplicateHint, stringifyNearDuplicateHint } from '../lib/storage/near-duplicate';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mcpRoot = path.resolve(__dirname, '..');
const tempRoots: string[] = [];

function tempRoot(prefix: string): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  tempRoots.push(root);
  return root;
}

function createIndexSchema(db: Database.Database): void {
  db.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY,
      spec_folder TEXT,
      file_path TEXT,
      canonical_file_path TEXT,
      document_type TEXT,
      anchor_id TEXT,
      tenant_id TEXT,
      user_id TEXT,
      agent_id TEXT,
      session_id TEXT,
      embedding_status TEXT,
      file_mtime_ms REAL,
      updated_at TEXT,
      importance_tier TEXT,
      content_hash TEXT,
      near_duplicate_of TEXT
    );
  `);
}

function createProjectionSchema(db: Database.Database): void {
  db.exec(`
    CREATE TABLE active_memory_projection (
      logical_key TEXT PRIMARY KEY,
      root_memory_id INTEGER NOT NULL,
      active_memory_id INTEGER NOT NULL UNIQUE,
      updated_at TEXT NOT NULL
    );
  `);
}

afterEach(() => {
  for (const root of tempRoots.splice(0)) {
    try {
      fs.rmSync(root, { recursive: true, force: true });
    } catch (_error: unknown) {
      // Best-effort cleanup for temporary test directories.
    }
  }
});

describe('orphan sweep cursor and corpus repair', () => {
  it('persists the orphan sweep cursor in the config table and normalizes wraparound to zero', () => {
    const db = new Database(':memory:');
    try {
      expect(readOrphanSweepCursor(db)).toBe(0);
      writeOrphanSweepCursor(db, 240);
      expect(readOrphanSweepCursor(db)).toBe(240);
      writeOrphanSweepCursor(db, null);
      expect(readOrphanSweepCursor(db)).toBe(0);
    } finally {
      db.close();
    }
  });

  it('resolves relative orphan paths against the base and does not sweep renamed-track targets', () => {
    const root = tempRoot('orphan-sweep-');
    const base = path.join(root, 'workspace');
    fs.mkdirSync(path.join(base, 'docs'), { recursive: true });
    fs.writeFileSync(path.join(base, 'docs', 'live.md'), 'live');
    fs.writeFileSync(path.join(root, 'outside.md'), 'outside');
    const renamedTarget = path.join(base, '.opencode', 'specs', 'system-speckit', '028-demo', 'spec.md');
    fs.mkdirSync(path.dirname(renamedTarget), { recursive: true });
    fs.writeFileSync(renamedTarget, 'renamed');

    const db = new Database(':memory:');
    try {
      createIndexSchema(db);
      db.prepare(`
        INSERT INTO memory_index (id, spec_folder, file_path, canonical_file_path, embedding_status)
        VALUES (?, ?, ?, ?, ?)
      `).run(1, 'system-speckit/relative', 'docs/live.md', null, 'success');
      db.prepare(`
        INSERT INTO memory_index (id, spec_folder, file_path, canonical_file_path, embedding_status)
        VALUES (?, ?, ?, ?, ?)
      `).run(2, 'system-speckit/outside', '../outside.md', null, 'success');
      db.prepare(`
        INSERT INTO memory_index (id, spec_folder, file_path, canonical_file_path, embedding_status)
        VALUES (?, ?, ?, ?, ?)
      `).run(3, 'system-spec-kit/028-demo', path.join(base, '.opencode', 'specs', 'system-spec-kit', '028-demo', 'spec.md'), null, 'success');
      db.prepare(`
        INSERT INTO memory_index (id, spec_folder, file_path, canonical_file_path, embedding_status)
        VALUES (?, ?, ?, ?, ?)
      `).run(4, 'system-speckit/missing', 'docs/missing.md', null, 'success');
      init(db);

      const first = sweepOrphanIndexRows({ limit: 3, cursor: 0, basePath: base });
      expect(first.scannedRows).toBe(3);
      expect(first.nextCursor).toBe(3);
      expect(first.orphanRecordIds).toEqual([2]);

      const second = sweepOrphanIndexRows({ limit: 3, cursor: first.nextCursor ?? 0, basePath: base });
      expect(second.nextCursor).toBe(0);
      expect(second.orphanRecordIds).toEqual([4]);
    } finally {
      db.close();
    }
  });

  it('reconciles failed-embedding moved rows and repoints active projection', () => {
    const root = tempRoot('move-reconcile-');
    const oldPath = path.join(root, '.opencode', 'specs', 'system-spec-kit', '028-demo', 'spec.md');
    const newPath = path.join(root, '.opencode', 'specs', 'system-speckit', '028-demo', 'spec.md');
    fs.mkdirSync(path.dirname(newPath), { recursive: true });
    fs.writeFileSync(newPath, 'moved');
    fs.writeFileSync(path.join(path.dirname(newPath), 'graph-metadata.json'), JSON.stringify({ packet_id: '028-demo' }));

    const db = new Database(':memory:');
    try {
      createIndexSchema(db);
      createProjectionSchema(db);
      db.prepare(`
        INSERT INTO memory_index (id, spec_folder, file_path, canonical_file_path, document_type, embedding_status, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
      `).run(10, 'system-spec-kit/028-demo', oldPath, oldPath, 'spec', 'failed');
      db.prepare(`
        INSERT INTO active_memory_projection (logical_key, root_memory_id, active_memory_id, updated_at)
        VALUES (?, ?, ?, datetime('now'))
      `).run('old-key', 10, 10);
      init(db);

      const result = reconcileMoves([oldPath], [newPath]);
      expect(result.reconciled).toHaveLength(1);
      expect(result.filteredToDelete).toEqual([]);
      expect(result.filteredToIndex).toEqual([]);
      const row = db.prepare('SELECT spec_folder, file_path, canonical_file_path FROM memory_index WHERE id = 10').get() as Record<string, string>;
      expect(row.spec_folder).toBe('system-speckit/028-demo');
      expect(row.file_path).toBe(newPath);
      const projection = db.prepare('SELECT logical_key, active_memory_id FROM active_memory_projection WHERE active_memory_id = 10').get() as Record<string, string | number>;
      expect(projection.logical_key).toContain('system-speckit/028-demo');
      expect(projection.logical_key).toContain(newPath);
    } finally {
      db.close();
    }
  });

  it('serializes near-duplicate hints in the active JSON shape', () => {
    const raw = stringifyNearDuplicateHint({ id: 42, similarity: 1, threshold: 1 });
    expect(raw).toBe('{"id":42,"similarity":1,"threshold":1}');
    expect(parseNearDuplicateHint(raw)).toEqual({ id: 42, similarity: 1, threshold: 1 });
    expect(parseNearDuplicateHint('42')).toBeNull();
  });

  it('runs corpus repair migration scripts in dry-run mode against a fixture DB', () => {
    const root = tempRoot('corpus-migrations-');
    const dbPath = path.join(root, 'fixture.sqlite');
    const base = path.join(root, 'workspace');
    const soloCurrent = path.join(base, '.opencode', 'specs', 'system-speckit', '029-solo', 'spec.md');
    const dupeCurrent = path.join(base, '.opencode', 'specs', 'system-speckit', '030-dupe', 'spec.md');
    fs.mkdirSync(path.dirname(soloCurrent), { recursive: true });
    fs.mkdirSync(path.dirname(dupeCurrent), { recursive: true });
    fs.writeFileSync(soloCurrent, 'solo');
    fs.writeFileSync(dupeCurrent, 'dupe');

    const db = new Database(dbPath);
    try {
      createIndexSchema(db);
      const insert = db.prepare(`
        INSERT INTO memory_index (id, spec_folder, file_path, canonical_file_path, embedding_status, importance_tier, content_hash)
        VALUES (?, ?, ?, ?, 'success', 'important', ?)
      `);
      insert.run(1, 'system-speckit/dead', path.join(base, 'missing.md'), path.join(base, 'missing.md'), 'dead');
      insert.run(2, 'system-spec-kit/029-solo', path.join(base, '.opencode', 'specs', 'system-spec-kit', '029-solo', 'spec.md'), path.join(base, '.opencode', 'specs', 'system-spec-kit', '029-solo', 'spec.md'), 'solo');
      insert.run(3, 'system-speckit/030-dupe', dupeCurrent, dupeCurrent, 'same-content');
      insert.run(4, 'system-spec-kit/030-dupe', path.join(base, '.opencode', 'specs', 'system-spec-kit', '030-dupe', 'spec.md'), path.join(base, '.opencode', 'specs', 'system-spec-kit', '030-dupe', 'spec.md'), 'same-content');
    } finally {
      db.close();
    }

    const runScript = (name: string) => JSON.parse(execFileSync('node', [
      path.join(mcpRoot, 'scripts', 'migrations', name),
      '--db', dbPath,
      '--base', base,
    ], { cwd: mcpRoot, encoding: 'utf8' }));

    expect(runScript('drain-file-absent-dead-path-rows.mjs')).toMatchObject({ mode: 'dry-run', absentRows: 1, deleted: 0 });
    expect(runScript('heal-system-speckit-track-identity.mjs')).toMatchObject({ mode: 'dry-run', repointable: 1, collisions: 1, updated: 0 });
    expect(runScript('collapse-duplicate-content-rows.mjs')).toMatchObject({ mode: 'dry-run', duplicateGroups: 1, losers: 1, deprecated: 0 });
  });
});

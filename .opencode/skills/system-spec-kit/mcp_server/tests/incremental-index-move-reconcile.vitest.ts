// TEST: INCREMENTAL INDEX — MOVE RECONCILIATION (Phase 3)
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as path from 'node:path';
import Database from 'better-sqlite3';

// ───────────────────────────────────────────────────────────────
// fs mock — controls which graph-metadata.json files "exist"
// ───────────────────────────────────────────────────────────────
const mockFsState: Record<string, string | null> = {};

vi.mock('fs', async (importOriginal) => {
  const real = await importOriginal<typeof import('fs')>();
  return {
    ...real,
    existsSync: (p: string) => p in mockFsState && mockFsState[p] !== null,
    readFileSync: (p: string, _enc?: BufferEncoding) => {
      if (!(p in mockFsState) || mockFsState[p] === null) {
        const err = Object.assign(new Error(`ENOENT: no such file: ${p}`), { code: 'ENOENT' });
        throw err;
      }
      return mockFsState[p] as string;
    },
    statSync: (p: string) => {
      if (p.endsWith('.md')) {
        return { mtimeMs: 1700000000000 };
      }
      const err = Object.assign(new Error(`ENOENT: no such file: ${p}`), { code: 'ENOENT' });
      throw err;
    },
  };
});

vi.mock('../lib/utils/canonical-path.js', () => ({
  getCanonicalPathKey: (p: string) => path.resolve(p),
}));

// ───────────────────────────────────────────────────────────────
// Module under test — imported AFTER mocks
// ───────────────────────────────────────────────────────────────
import * as incrementalIndex from '../lib/storage/incremental-index';

// ───────────────────────────────────────────────────────────────
// Helpers
// ───────────────────────────────────────────────────────────────
function makeTestDb(): Database.Database {
  const db = new Database(':memory:');
  db.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      spec_folder TEXT NOT NULL,
      file_path TEXT NOT NULL,
      canonical_file_path TEXT,
      file_mtime_ms REAL,
      content_hash TEXT,
      embedding_status TEXT DEFAULT 'success',
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
  return db;
}

// ───────────────────────────────────────────────────────────────
// TESTS
// ───────────────────────────────────────────────────────────────
describe('reconcileMoves', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    for (const key of Object.keys(mockFsState)) {
      delete mockFsState[key];
    }
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('updates file_path in place for a uniquely matched packet_id', () => {
    const db = makeTestDb();
    const oldPath = '/workspace/specs/old-name/spec.md';
    const newPath = '/workspace/specs/new-name/spec.md';
    const packetId = 'pkt-abc-001';

    db.prepare(
      'INSERT INTO memory_index (spec_folder, file_path, canonical_file_path, embedding_status) VALUES (?, ?, ?, ?)'
    ).run('/workspace/specs/old-name', oldPath, path.resolve(oldPath), 'success');

    // Old folder is gone; new folder has graph-metadata with packet_id
    mockFsState['/workspace/specs/old-name/graph-metadata.json'] = null;
    mockFsState['/workspace/specs/new-name/graph-metadata.json'] = JSON.stringify({ packet_id: packetId });

    incrementalIndex.init(db);

    const result = incrementalIndex.reconcileMoves([oldPath], [newPath]);

    expect(result.reconciled).toHaveLength(1);
    expect(result.reconciled[0].oldPath).toBe(oldPath);
    expect(result.reconciled[0].newPath).toBe(newPath);
    expect(result.reconciled[0].docType).toBe('spec');
    expect(result.filteredToDelete).toHaveLength(0);
    expect(result.filteredToIndex).toHaveLength(0);

    const updatedRow = db.prepare('SELECT file_path FROM memory_index WHERE id = ?')
      .get(result.reconciled[0].rowId) as { file_path: string } | undefined;
    expect(updatedRow?.file_path).toBe(newPath);

    db.close();
  });

  it('skips update when multiple rows match the same old path (non-unique guard)', () => {
    const db = makeTestDb();
    const oldPath = '/workspace/specs/old-dupe/spec.md';
    const newPath = '/workspace/specs/new-dupe/spec.md';
    const packetId = 'pkt-dupe-002';

    // Two rows at the same path — uniqueness guard should fire
    db.prepare(
      'INSERT INTO memory_index (spec_folder, file_path, canonical_file_path, embedding_status) VALUES (?, ?, ?, ?)'
    ).run('/workspace/specs/old-dupe', oldPath, path.resolve(oldPath), 'success');
    db.prepare(
      'INSERT INTO memory_index (spec_folder, file_path, canonical_file_path, embedding_status) VALUES (?, ?, ?, ?)'
    ).run('/workspace/specs/old-dupe', oldPath, path.resolve(oldPath), 'success');

    mockFsState['/workspace/specs/old-dupe/graph-metadata.json'] = JSON.stringify({ packet_id: packetId });
    mockFsState['/workspace/specs/new-dupe/graph-metadata.json'] = JSON.stringify({ packet_id: packetId });

    incrementalIndex.init(db);

    const result = incrementalIndex.reconcileMoves([oldPath], [newPath]);

    expect(result.reconciled).toHaveLength(0);
    expect(result.filteredToDelete).toContain(oldPath);
    expect(result.filteredToIndex).toContain(newPath);

    db.close();
  });
});

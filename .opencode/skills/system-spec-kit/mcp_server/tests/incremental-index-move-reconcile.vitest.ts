// TEST: INCREMENTAL INDEX — MOVE RECONCILIATION (Phase 3)
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as path from 'node:path';
import Database from 'better-sqlite3';

// ───────────────────────────────────────────────────────────────
// fs mock — controls which graph-metadata.json files "exist".
// vi.hoisted keeps the state binding initialized before the hoisted
// mock factory can run: a module-level const sits in the temporal
// dead zone when an import chain triggers existsSync during mock
// setup, throwing "Cannot access before initialization".
// ───────────────────────────────────────────────────────────────
const mockFsState = vi.hoisted(() => ({}) as Record<string, string | null>);

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

vi.mock('../lib/utils/canonical-path.js', async (importOriginal) => {
  const real = await importOriginal<typeof import('../lib/utils/canonical-path.js')>();
  return {
    ...real,
    getCanonicalPathKey: (p: string) => path.resolve(p),
  };
});

// ───────────────────────────────────────────────────────────────
// Module under test — imported AFTER mocks
// ───────────────────────────────────────────────────────────────
import * as incrementalIndex from '../lib/storage/incremental-index';
import { extractSpecFolder, extractDocumentType as extractDocumentTypeForTest } from '../lib/parsing/memory-parser.js';

// ───────────────────────────────────────────────────────────────
// Helpers
// ───────────────────────────────────────────────────────────────
function makeTestDb(opts?: { withDocumentType?: boolean }): Database.Database {
  const db = new Database(':memory:');
  const docTypeCol = opts?.withDocumentType ? "document_type TEXT DEFAULT 'memory'," : '';
  db.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      spec_folder TEXT NOT NULL,
      file_path TEXT NOT NULL,
      canonical_file_path TEXT,
      ${docTypeCol}
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

  it('repoints spec_folder to the new folder after a sibling rename', () => {
    const db = makeTestDb();
    const oldPath = '/workspace/specs/old-name/spec.md';
    const newPath = '/workspace/specs/new-name/spec.md';
    const packetId = 'pkt-folder-003';

    // Stale spec_folder reflecting the OLD folder name.
    db.prepare(
      'INSERT INTO memory_index (spec_folder, file_path, canonical_file_path, embedding_status) VALUES (?, ?, ?, ?)'
    ).run('old-name', oldPath, path.resolve(oldPath), 'success');

    mockFsState['/workspace/specs/old-name/graph-metadata.json'] = null;
    mockFsState['/workspace/specs/new-name/graph-metadata.json'] = JSON.stringify({ packet_id: packetId });

    incrementalIndex.init(db);

    const result = incrementalIndex.reconcileMoves([oldPath], [newPath]);
    expect(result.reconciled).toHaveLength(1);

    const expectedSpecFolder = extractSpecFolder(newPath);
    const updatedRow = db.prepare('SELECT spec_folder, file_path FROM memory_index WHERE id = ?')
      .get(result.reconciled[0].rowId) as { spec_folder: string; file_path: string } | undefined;

    // spec_folder must be repointed off the stale old value to match the new path.
    expect(updatedRow?.file_path).toBe(newPath);
    expect(updatedRow?.spec_folder).toBe(expectedSpecFolder);
    expect(updatedRow?.spec_folder).not.toBe('old-name');

    db.close();
  });

  it('skips repoint when stored document_type diverges from the new path doc kind', () => {
    const db = makeTestDb({ withDocumentType: true });
    // Numeric spec-leaf folders so the new path classifies as a 'spec' document.
    const oldPath = '/workspace/specs/012-old-mismatch/spec.md';
    const newPath = '/workspace/specs/012-new-mismatch/spec.md';
    const packetId = 'pkt-mismatch-004';
    expect(extractDocumentTypeForTest(newPath)).toBe('spec'); // guard the fixture assumption

    // Row at a spec.md path but stored as a generic 'memory' doc kind — must NOT be repointed.
    db.prepare(
      "INSERT INTO memory_index (spec_folder, file_path, canonical_file_path, document_type, embedding_status) VALUES (?, ?, ?, 'memory', 'success')"
    ).run('012-old-mismatch', oldPath, path.resolve(oldPath));

    mockFsState['/workspace/specs/012-old-mismatch/graph-metadata.json'] = null;
    mockFsState['/workspace/specs/012-new-mismatch/graph-metadata.json'] = JSON.stringify({ packet_id: packetId });

    incrementalIndex.init(db);

    const result = incrementalIndex.reconcileMoves([oldPath], [newPath]);
    expect(result.reconciled).toHaveLength(0);
    expect(result.filteredToDelete).toContain(oldPath);
    expect(result.filteredToIndex).toContain(newPath);

    db.close();
  });

  it('repoints when stored document_type matches the new path doc kind', () => {
    const db = makeTestDb({ withDocumentType: true });
    const oldPath = '/workspace/specs/012-old-match/spec.md';
    const newPath = '/workspace/specs/012-new-match/spec.md';
    const packetId = 'pkt-match-005';
    expect(extractDocumentTypeForTest(newPath)).toBe('spec'); // guard the fixture assumption

    db.prepare(
      "INSERT INTO memory_index (spec_folder, file_path, canonical_file_path, document_type, embedding_status) VALUES (?, ?, ?, 'spec', 'success')"
    ).run('012-old-match', oldPath, path.resolve(oldPath));

    mockFsState['/workspace/specs/012-old-match/graph-metadata.json'] = null;
    mockFsState['/workspace/specs/012-new-match/graph-metadata.json'] = JSON.stringify({ packet_id: packetId });

    incrementalIndex.init(db);

    const result = incrementalIndex.reconcileMoves([oldPath], [newPath]);
    expect(result.reconciled).toHaveLength(1);

    const updatedRow = db.prepare('SELECT spec_folder, file_path FROM memory_index WHERE id = ?')
      .get(result.reconciled[0].rowId) as { spec_folder: string; file_path: string } | undefined;
    expect(updatedRow?.file_path).toBe(newPath);
    expect(updatedRow?.spec_folder).toBe(extractSpecFolder(newPath));

    db.close();
  });
});

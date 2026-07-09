import Database from 'better-sqlite3';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { appendMemoryDriftSuspects, readMemoryDriftSuspects } from '../lib/storage/memory-drift-healing.js';

// Provides a mutable database connection to the mocked `requireDb()` below, so
// each test can point the code under test at its own on-disk fixture without
// touching the real `vector-index-store.ts` boot path (acquiring the real
// process-wide instance lock is unnecessary here and would conflict with the
// two-connection contention setup this suite deliberately creates).
let currentDb: Database.Database | null = null;

vi.mock('../utils/index.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../utils/index.js')>();
  return {
    ...actual,
    requireDb: () => {
      if (!currentDb) {
        throw new Error('test database not configured');
      }
      return currentDb;
    },
  };
});

// Imported after the mock above so `handlers/memory-search.ts` picks up the
// mocked `requireDb`.
const { __testables: searchTestables } = await import('../handlers/memory-search.js');

const tempRoots: string[] = [];

function tempRoot(prefix: string): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  tempRoots.push(root);
  return root;
}

describe('F8: bounded drift-suspect write timeout under lock contention', () => {
  let dbDir: string;
  let dbPath: string;
  // connA mirrors a separate concurrent writer holding a write lock on the same
  // on-disk database file (a reindex, a save, or another CLI front-door process).
  // Two independent better-sqlite3 connections to the same on-disk file exhibit
  // real SQLite lock contention even within a single test process -- this is the
  // same two-connection convention already established by this codebase's own
  // n3lite-consolidation.vitest.ts ("mirrors a separate CLI front-door process").
  let connA: Database.Database;
  // connB is the server's own write connection (what the mocked requireDb() returns).
  let connB: Database.Database;

  beforeEach(() => {
    dbDir = fs.mkdtempSync(path.join(os.tmpdir(), 'drift-suspect-timeout-'));
    dbPath = path.join(dbDir, 'context-index.sqlite');
    connA = new Database(dbPath);
    connA.pragma('busy_timeout = 10000');
    connB = new Database(dbPath);
    // Matches the production default set in vector-index-store.ts on every real connection.
    connB.pragma('busy_timeout = 10000');
    currentDb = connB;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    try { connA.exec('ROLLBACK'); } catch { /* no open transaction to roll back */ }
    connA.close();
    connB.close();
    currentDb = null;
    fs.rmSync(dbDir, { recursive: true, force: true });
    for (const root of tempRoots.splice(0)) {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });

  it('BASELINE: without the fast-fail bound, a write blocked by a held lock waits out the full connection busy_timeout instead of failing fast', () => {
    connA.exec('BEGIN IMMEDIATE');
    // Shortened only for test speed; proves the pre-fix *mechanism* (the write
    // blocks for ~busy_timeout under contention with no fast-fail bound applied),
    // matching the ~10,293ms real-world measurement against the production
    // 10,000ms busy_timeout at a scale a unit test can run in well under a second.
    connB.pragma('busy_timeout = 300');
    const start = Date.now();
    let threw = false;
    try {
      appendMemoryDriftSuspects(connB, [4242]);
    } catch (error: unknown) {
      threw = true;
      expect((error as { code?: string }).code).toBe('SQLITE_BUSY');
    }
    const elapsed = Date.now() - start;
    expect(threw).toBe(true);
    expect(elapsed).toBeGreaterThanOrEqual(280);
    connB.pragma('busy_timeout = 10000');
  });

  it('REQ-001: under a held write lock, the fixed suspect-write path fails in under 100ms and the filtered result set is returned unaffected', () => {
    const root = tempRoot('existence-filter-');
    const existingPath = path.join(root, 'spec.md');
    fs.writeFileSync(existingPath, '# spec');
    const missingPath = path.join(root, 'plan.md');
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    connA.exec('BEGIN IMMEDIATE');

    const start = Date.now();
    const filtered = searchTestables.applyQueryTimeExistenceFilter([
      { id: 1, file_path: existingPath, score: 1 },
      { id: 4242, file_path: missingPath, score: 0.9 },
    ]);
    const elapsed = Date.now() - start;

    expect(elapsed).toBeLessThan(100);
    // The search response itself (the filtered result set) is not delayed or
    // altered by the contended best-effort write.
    expect(filtered.results.map((result) => result.id)).toEqual([1]);
    expect(filtered.stats).toMatchObject({ checked: 2, excluded: 1, suspectIds: [4242] });
    // Existing best-effort contract preserved: no throw, degrade-and-log instead.
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('[memory-search] Could not queue drift suspect rows'));
  });

  it('the connection busy_timeout is restored to its pre-call value after the fast-fail path, verified via a subsequent unrelated query', () => {
    const root = tempRoot('existence-filter-restore-');
    const missingPath = path.join(root, 'plan.md');
    vi.spyOn(console, 'warn').mockImplementation(() => {});

    connA.exec('BEGIN IMMEDIATE');
    searchTestables.applyQueryTimeExistenceFilter([
      { id: 4243, file_path: missingPath, score: 0.9 },
    ]);

    expect(connB.pragma('busy_timeout', { simple: true })).toBe(10000);

    connA.exec('COMMIT');
    // A subsequent unrelated query on the same connection must observe the
    // restored default, not the shortened fast-fail window.
    const row = connB.prepare('SELECT 1 as one').get() as { one: number };
    expect(row.one).toBe(1);
    expect(connB.pragma('busy_timeout', { simple: true })).toBe(10000);
  });

  it('a normal (non-contended) write still succeeds and the suspect queue reflects the new ids, unchanged from today', () => {
    const root = tempRoot('existence-filter-normal-');
    const missingPath = path.join(root, 'plan.md');
    vi.spyOn(console, 'warn').mockImplementation(() => {});

    const filtered = searchTestables.applyQueryTimeExistenceFilter([
      { id: 4244, file_path: missingPath, score: 0.9 },
    ]);

    expect(filtered.stats.suspectIds).toEqual([4244]);
    expect(readMemoryDriftSuspects(connB).map((suspect) => suspect.id)).toEqual([4244]);
  });

  it('a non-timeout failure from the suspect-write call is still caught by the existing outer try/catch, unchanged from today', () => {
    const root = tempRoot('existence-filter-nontimeout-');
    const missingPath = path.join(root, 'plan.md');
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    // Force a non-lock-related failure (closed connection) rather than SQLITE_BUSY.
    connB.close();

    expect(() => searchTestables.applyQueryTimeExistenceFilter([
      { id: 4245, file_path: missingPath, score: 0.9 },
    ])).not.toThrow();
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('[memory-search] Could not queue drift suspect rows'));

    // Prevent the afterEach hook from re-closing an already-closed connection.
    connB = new Database(dbPath);
    currentDb = connB;
  });
});

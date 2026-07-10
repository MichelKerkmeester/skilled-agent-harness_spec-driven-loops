// ───────────────────────────────────────────────────────────────
// TEST: DEFERRED DRIFT-SUSPECT WRITES
// ───────────────────────────────────────────────────────────────
import Database from 'better-sqlite3';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { readMemoryDriftSuspects } from '../lib/storage/memory-drift-healing.js';

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

describe('deferred drift-suspect writes', () => {
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
    searchTestables.resetDeferredSearchWriteDiagnosticsForTests();
  });

  afterEach(async () => {
    await searchTestables.waitForDeferredSearchWritesForTests();
    searchTestables.resetDeferredSearchWriteDiagnosticsForTests();
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

  it('returns the filtered result before the copied suspect batch is appended', async () => {
    const root = tempRoot('existence-filter-');
    const existingPath = path.join(root, 'spec.md');
    fs.writeFileSync(existingPath, '# spec');
    const missingPath = path.join(root, 'plan.md');

    connA.exec('BEGIN IMMEDIATE');

    const start = Date.now();
    const filtered = searchTestables.applyQueryTimeExistenceFilter([
      { id: 1, file_path: existingPath, score: 1 },
      { id: 4242, file_path: missingPath, score: 0.9 },
    ]);
    const elapsed = Date.now() - start;

    expect(elapsed).toBeLessThan(100);
    expect(filtered.results.map((result) => result.id)).toEqual([1]);
    expect(filtered.stats).toMatchObject({ checked: 2, excluded: 1, suspectIds: [4242] });
    expect(searchTestables.getDeferredSearchWriteDiagnostics().queued).toBe(0);

    expect(searchTestables.enqueueDeferredDriftSuspects(filtered.stats.suspectIds)).toBe(true);
    expect(connB.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'config'").get()).toBeUndefined();
    connA.exec('COMMIT');
    await searchTestables.waitForDeferredSearchWritesForTests();

    expect(readMemoryDriftSuspects(connB).map((suspect) => suspect.id)).toEqual([4242]);
  });

  it('retries lock contention within a bounded window and reports the final loss counter', async () => {
    const root = tempRoot('existence-filter-contention-');
    const missingPath = path.join(root, 'plan.md');
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    connA.exec('BEGIN IMMEDIATE');
    const filtered = searchTestables.applyQueryTimeExistenceFilter([
      { id: 4244, file_path: missingPath, score: 0.9 },
    ]);
    const start = Date.now();
    searchTestables.enqueueDeferredDriftSuspects(filtered.stats.suspectIds);
    await searchTestables.waitForDeferredSearchWritesForTests();
    const elapsed = Date.now() - start;

    expect(elapsed).toBeLessThan(250);
    expect(searchTestables.getDeferredSearchWriteDiagnostics()).toMatchObject({
      queued: 0,
      retryTotal: 2,
      failureTotal: 1,
    });
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('failures=1'));
    connA.exec('COMMIT');
    expect(readMemoryDriftSuspects(connB)).toEqual([]);
  });

  it('guards a busy_timeout restoration failure and marks the connection unhealthy', async () => {
    const root = tempRoot('existence-filter-restore-');
    const missingPath = path.join(root, 'plan.md');
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const originalPragma = connB.pragma.bind(connB);
    let shortened = false;
    vi.spyOn(connB, 'pragma').mockImplementation(((source: string, options?: { simple?: boolean }) => {
      if (source === 'busy_timeout = 25') {
        shortened = true;
      } else if (shortened && source === 'busy_timeout = 10000') {
        throw new Error('forced restore failure');
      }
      return originalPragma(source, options as never);
    }) as typeof connB.pragma);

    const filtered = searchTestables.applyQueryTimeExistenceFilter([
      { id: 4245, file_path: missingPath, score: 0.9 },
    ]);
    searchTestables.enqueueDeferredDriftSuspects(filtered.stats.suspectIds);
    await searchTestables.waitForDeferredSearchWritesForTests();

    expect(readMemoryDriftSuspects(connB).map((suspect) => suspect.id)).toEqual([4245]);
    expect(searchTestables.getDeferredSearchWriteDiagnostics()).toMatchObject({
      failureTotal: 0,
      restoreFailureTotal: 1,
    });
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('connection marked unhealthy'));
  });
});

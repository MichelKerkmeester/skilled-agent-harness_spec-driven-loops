// ───────────────────────────────────────────────────────────────
// DR-011 (DEEP-1) — Clean-shutdown marker durability on close
// ───────────────────────────────────────────────────────────────
// Harness B (durability): assert close_db() deletes the clean-shutdown
// marker ONLY after a confirmed-successful close. The marker semantic is
// "present == dirty" — it is written on every open (initialize_db) and must
// survive a thrown detach/close so the next open correctly treats the DB as
// dirty. Regression for finding DR-011: previously the marker removal ran
// BEFORE detachActiveVectorShard() + db.close(), so a throwing close left the
// marker deleted while the DB had NOT closed cleanly.
//
// Determinism: no sleeps, no real WAL/process race. The close failure is
// injected by patching the live better-sqlite3 handle's `close` method to
// throw, obtained via try_get_db(). The marker is a plain file on disk in an
// isolated tmp dir, so the assertions are fully deterministic.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  closeDb,
  initializeDb,
  try_get_db,
} from '../lib/search/vector-index-store.js';

const UNCLEAN_SHUTDOWN_MARKER = '.unclean-shutdown';
const tmpDirs: string[] = [];

function makeTmpDir(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'dr011-'));
  tmpDirs.push(dir);
  return dir;
}

function markerPathFor(dbPath: string): string {
  return path.join(path.dirname(dbPath), UNCLEAN_SHUTDOWN_MARKER);
}

afterEach(() => {
  // Best-effort: ensure the singleton is closed even if a test left it open.
  try {
    closeDb();
  } catch {
    // ignore — a test may have intentionally broken close()
  }
  for (const dir of tmpDirs.splice(0)) {
    try {
      fs.rmSync(dir, { recursive: true, force: true });
    } catch {
      // ignore cleanup failures
    }
  }
  delete process.env.MEMORY_DB_PATH;
});

describe('DR-011: clean-shutdown marker durability on close_db', () => {
  it('writes the clean-shutdown marker on open (present == dirty)', () => {
    const dir = makeTmpDir();
    const dbPath = path.join(dir, 'context-index.sqlite');
    process.env.MEMORY_DB_PATH = dbPath;

    initializeDb(dbPath);

    // initialize_db() calls write_unclean_shutdown_marker — the marker must exist
    // while the DB is open.
    expect(fs.existsSync(markerPathFor(dbPath))).toBe(true);
  });

  it('removes the clean-shutdown marker after a confirmed-successful close', () => {
    const dir = makeTmpDir();
    const dbPath = path.join(dir, 'context-index.sqlite');
    process.env.MEMORY_DB_PATH = dbPath;

    initializeDb(dbPath);
    expect(fs.existsSync(markerPathFor(dbPath))).toBe(true);

    // Clean close: checkpoint + detach + close all succeed, so the marker is removed.
    closeDb();

    expect(fs.existsSync(markerPathFor(dbPath))).toBe(false);
  });

  it('keeps the clean-shutdown marker when db.close() throws (marker survives a failed close)', () => {
    const dir = makeTmpDir();
    const dbPath = path.join(dir, 'context-index.sqlite');
    process.env.MEMORY_DB_PATH = dbPath;

    initializeDb(dbPath);
    const marker = markerPathFor(dbPath);
    expect(fs.existsSync(marker)).toBe(true);

    // Inject a failing close on the live handle. close_db() runs the WAL
    // checkpoints first (those succeed), then detach + close. With the DR-011
    // fix, marker removal is sequenced AFTER db.close(); a throwing close means
    // the removal line is never reached, so the marker survives.
    //
    // Pre-fix behavior (RED): remove_unclean_shutdown_marker ran BEFORE close,
    // so the marker was already deleted by the time close() threw — leaving a
    // dirty DB that the next open would wrongly trust.
    const handle = try_get_db();
    expect(handle).not.toBeNull();
    const closeError = new Error('injected close failure');
    handle!.close = () => {
      throw closeError;
    };

    expect(() => closeDb()).toThrow(closeError);

    // The DB did NOT close cleanly, so the "present == dirty" marker MUST remain.
    expect(fs.existsSync(marker)).toBe(true);
  });
});

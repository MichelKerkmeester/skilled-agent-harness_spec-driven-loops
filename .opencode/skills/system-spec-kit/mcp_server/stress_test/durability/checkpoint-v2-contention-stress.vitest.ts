// ───────────────────────────────────────────────────────────────
// STRESS: Checkpoint-v2 create -> restore round-trip under contention
// ───────────────────────────────────────────────────────────────
//
// Load-tests the file-based full-DB checkpoint path (VACUUM INTO main, atomic
// tmp-dir rename, schema-v2 restore via an injectable reopen) against a single
// throwaway database driven by many interleaved create/restore round-trips. The
// durability assertions are integrity-focused: every restored snapshot must put
// the memory_index back to a known baseline, no orphaned snapshot directories
// may survive prune/delete, and the catalog must stay bounded at MAX_CHECKPOINTS.
//
// ISOLATION: a per-test mkdtemp directory holds the DB and the checkpoints/ tree.
// The injectable `reopen` hook does an in-process close/swap/open against that
// temp DB, so nothing touches the production DB at ~/.mk-spec-memory or the live
// daemon socket. afterEach rm -rf's the temp tree.

import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import Database from 'better-sqlite3';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import * as checkpoints from '../../lib/storage/checkpoints';

const ROUND_TRIPS = 40;

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
  const insert = db.prepare(`
    INSERT INTO memory_index (id, spec_folder, file_path, title, created_at, importance_tier)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  // 64 baseline rows so each VACUUM INTO copies a non-trivial main DB.
  const seed = db.transaction(() => {
    for (let i = 1; i <= 64; i += 1) {
      insert.run(i, `spec-${i % 4}`, `/tmp/memory-${i}.md`, `Memory ${i}`, now, i % 3 === 0 ? 'important' : 'normal');
    }
  });
  seed();
}

function captureBaseline(db: Database.Database): Array<Record<string, unknown>> {
  return db.prepare(`
    SELECT id, spec_folder, file_path, title, importance_tier
    FROM memory_index
    ORDER BY id
  `).all() as Array<Record<string, unknown>>;
}

// In-process reopen: close the live handle, run the file swap, reopen against the
// (now snapshot-backed) temp DB and re-init the checkpoints module — exactly the
// flatReopen pattern the v2 restore unit tests use, but driven repeatedly here.
function inProcessReopen(targetPath: string, swapFn: () => void): Database.Database {
  try { database.close(); } catch { /* already closed */ }
  swapFn();
  database = new Database(targetPath);
  checkpoints.init(database);
  return database;
}

function snapshotDirsOnDisk(): string[] {
  const root = path.join(tempDir, 'checkpoints');
  if (!fs.existsSync(root)) return [];
  return fs.readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

beforeEach(() => {
  tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'durability-ckpt-contention-'));
  dbPath = path.join(tempDir, 'memory.sqlite');
  database = new Database(dbPath);
  initializeDatabase(database);
  checkpoints.init(database);
});

afterEach(() => {
  checkpoints.setRestoreBarrierHooks(null);
  try { database.close(); } catch { /* ignore */ }
  fs.rmSync(tempDir, { recursive: true, force: true });
});

describe('durability: checkpoint-v2 create/restore round-trip under contention', () => {
  it('keeps memory consistent across many interleaved create+restore cycles with no orphaned snapshot dirs', () => {
    const baseline = captureBaseline(database);
    let restores = 0;

    for (let cycle = 0; cycle < ROUND_TRIPS; cycle += 1) {
      const name = `rt-${cycle}`;
      const created = checkpoints.createCheckpoint({ name, includeEmbeddings: false });
      expect(created.snapshotFormat).toBe('v2');

      // Mutate the live DB so a restore has something to roll back.
      database.prepare('UPDATE memory_index SET title = ? WHERE id = ?')
        .run(`mutated-${cycle}`, (cycle % 64) + 1);
      database.prepare(`
        INSERT INTO memory_index (spec_folder, file_path, title, created_at, importance_tier)
        VALUES (?, ?, ?, ?, ?)
      `).run('scratch', `/tmp/scratch-${cycle}.md`, `Scratch ${cycle}`, new Date().toISOString(), 'normal');

      const result = checkpoints.restoreCheckpoint(name, false, {}, { reopen: inProcessReopen });
      expect(result.errors, `cycle ${cycle} restore errors`).toEqual([]);
      restores += 1;

      // After every restore the DB must equal the original baseline (snapshot
      // round-trips are lossless), and no stray .bak file may survive.
      expect(captureBaseline(database)).toEqual(baseline);
      expect(fs.existsSync(`${dbPath}.bak`)).toBe(false);
      expect(checkpoints.isRestoreInProgress()).toBe(false);
    }

    expect(restores).toBe(ROUND_TRIPS);

    // On-disk integrity is the durability property under contention: every
    // snapshot directory on disk must be referenced by a live catalog row, so
    // create-time pruning never leaks disk. (Catalog rows may outnumber on-disk
    // dirs because a v2 restore merges the snapshot's older catalog back in — a
    // missing dir simply means that older checkpoint was already pruned; what
    // must never happen is a dir with no catalog row pointing at it.)
    const catalog = checkpoints.listCheckpoints(null, ROUND_TRIPS + 64);
    const liveNames = new Set(catalog.map((entry) => entry.name));
    const orphanDirs = snapshotDirsOnDisk().filter(
      (dir) => !dir.includes('.tmp-') && !liveNames.has(dir),
    );
    expect(orphanDirs, `orphaned snapshot dirs: ${JSON.stringify(orphanDirs)}`).toEqual([]);

    // The live on-disk snapshot directory set stays bounded by the create-time
    // MAX_CHECKPOINTS prune — it must never grow without bound across 40 cycles.
    const liveDirs = snapshotDirsOnDisk().filter((dir) => !dir.includes('.tmp-'));
    expect(liveDirs.length).toBeLessThanOrEqual(checkpoints.MAX_CHECKPOINTS);

    // No half-written tmp dirs may linger after the final atomic rename.
    expect(snapshotDirsOnDisk().filter((dir) => dir.includes('.tmp-'))).toEqual([]);
  });

  it('exposes the E_RESTORE_IN_PROGRESS barrier during the swap window so mutating handlers back off', () => {
    checkpoints.createCheckpoint({ name: 'barrier-probe', includeEmbeddings: false });
    database.prepare('UPDATE memory_index SET title = ? WHERE id = ?').run('barrier-mutation', 1);

    // The mutating handlers (memory_save, memory_index scan, memory_bulk_delete)
    // gate on getRestoreBarrierStatus(): while a restore is swapping files the
    // status must be the terminal E_RESTORE_IN_PROGRESS code so concurrent writes
    // are refused, and it must clear to null after the restore finishes.
    let barrierPresentDuringSwap = false;
    let barrierCodeDuringSwap: string | null = null;
    const observingReopen = (targetPath: string, swapFn: () => void): Database.Database => {
      try { database.close(); } catch { /* ignore */ }
      swapFn();
      expect(checkpoints.isRestoreInProgress()).toBe(true);
      const status = checkpoints.getRestoreBarrierStatus();
      barrierPresentDuringSwap = status !== null;
      barrierCodeDuringSwap = status?.code ?? null;
      database = new Database(targetPath);
      checkpoints.init(database);
      return database;
    };

    // Before any restore the barrier is clear.
    expect(checkpoints.getRestoreBarrierStatus()).toBeNull();

    const result = checkpoints.restoreCheckpoint('barrier-probe', false, {}, { reopen: observingReopen });

    expect(result.errors).toEqual([]);
    expect(barrierPresentDuringSwap).toBe(true);
    expect(barrierCodeDuringSwap).toBe(checkpoints.RESTORE_IN_PROGRESS_ERROR_CODE);
    // The barrier is released in a finally, even across the file swap.
    expect(checkpoints.isRestoreInProgress()).toBe(false);
    expect(checkpoints.getRestoreBarrierStatus()).toBeNull();
  });
});

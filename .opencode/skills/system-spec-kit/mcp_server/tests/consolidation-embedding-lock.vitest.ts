// ───────────────────────────────────────────────────────────────
// MODULE: Consolidation Embedding Lock + Lease Tests
// ───────────────────────────────────────────────────────────────
// The semantic-edge embedding pass loops synchronous provider calls. It must run
// OUTSIDE the consolidation BEGIN IMMEDIATE write lock (or it blocks writers) and
// must hold a refreshed maintenance lease (or a competing launcher reaps the
// daemon mid-write). These tests pin both invariants.
import Database from 'better-sqlite3';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { runConsolidationCycleIfEnabled } from '../lib/storage/consolidation';
import * as causalEdges from '../lib/storage/causal-edges';
import { __resetMaintenanceMarkerForTest } from '../lib/storage/maintenance-marker';
import { resolveDatabasePaths } from '../core/config';

const MARKER_FILE = '.maintenance-active.json';

let tmpDir: string;
const originalSpecKitDbDir = process.env.SPEC_KIT_DB_DIR;
const originalSpeckitDbDir = process.env.SPECKIT_DB_DIR;

function markerPath(): string {
  return path.join(tmpDir, MARKER_FILE);
}

function applyEdgeSchema(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS memory_index (
      id INTEGER PRIMARY KEY,
      title TEXT,
      importance_tier TEXT DEFAULT 'normal',
      parent_id INTEGER,
      content_text TEXT
    );
    CREATE TABLE IF NOT EXISTS causal_edges (
      id INTEGER PRIMARY KEY,
      source_id TEXT NOT NULL,
      target_id TEXT NOT NULL,
      source_anchor TEXT,
      target_anchor TEXT,
      relation TEXT NOT NULL,
      strength REAL DEFAULT 1.0,
      evidence TEXT,
      extracted_at TEXT DEFAULT (datetime('now')),
      created_by TEXT DEFAULT 'manual',
      last_accessed TEXT,
      fact_text TEXT
    );
    CREATE TABLE IF NOT EXISTS weight_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      edge_id INTEGER NOT NULL,
      old_strength REAL NOT NULL,
      new_strength REAL NOT NULL,
      changed_by TEXT DEFAULT 'manual',
      changed_at TEXT DEFAULT (datetime('now')),
      reason TEXT
    );
    CREATE TABLE IF NOT EXISTS probe_writes (id INTEGER PRIMARY KEY);
  `);
}

beforeEach(() => {
  // Redirect DATABASE_DIR so the marker module writes into a throwaway dir we can
  // observe, never a live database. The marker reads DATABASE_DIR as a live ESM
  // binding, so resolveDatabasePaths() redirects subsequent writes.
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'consolidation-embed-lock.'));
  process.env.SPEC_KIT_DB_DIR = tmpDir;
  delete process.env.SPECKIT_DB_DIR;
  resolveDatabasePaths();
});

afterEach(() => {
  __resetMaintenanceMarkerForTest();
  vi.unstubAllEnvs();
  try {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  } catch {
    // Best-effort cleanup
  }
  if (originalSpecKitDbDir === undefined) delete process.env.SPEC_KIT_DB_DIR;
  else process.env.SPEC_KIT_DB_DIR = originalSpecKitDbDir;
  if (originalSpeckitDbDir === undefined) delete process.env.SPECKIT_DB_DIR;
  else process.env.SPECKIT_DB_DIR = originalSpeckitDbDir;
  resolveDatabasePaths();
});

describe('consolidation semantic-edge embedding: lock + lease', () => {
  it('embeds OUTSIDE the write lock and keeps the maintenance lease fresh', () => {
    vi.stubEnv('SPECKIT_CONSOLIDATION', 'true');
    vi.stubEnv('SPECKIT_SEMANTIC_EDGE_LAYER', 'true');

    const dbPath = path.join(tmpDir, 'graph.db');
    // connA drives the cycle; connB is an independent writer sharing the on-disk
    // DB (mirrors a separate CLI front-door). busy_timeout=0 fails fast on lock
    // contention instead of blocking the test.
    const connA = new Database(dbPath);
    const connB = new Database(dbPath);
    connB.pragma('busy_timeout = 0');

    try {
      applyEdgeSchema(connA);
      connA.prepare(`
        INSERT INTO causal_edges (id, source_id, target_id, relation, fact_text, last_accessed)
        VALUES (1, '10', '20', 'supports', 'alpha relationship', datetime('now'))
      `).run();
      causalEdges.init(connA);

      let embedCalls = 0;
      let inTransactionDuringEmbed: boolean | null = null;
      let markerPresentDuringEmbed: boolean | null = null;
      let concurrentWriteSucceeded = false;
      let concurrentWriteError: string | null = null;

      const provider = {
        modelId: 'unit',
        profileKey: 'default',
        embedEdgeText: (_text: string): number[] => {
          embedCalls += 1;
          if (embedCalls === 1) {
            // Out of the lock: connA holds no transaction during the embed loop.
            inTransactionDuringEmbed = connA.inTransaction;
            // Lease held: the marker was refreshed at this row boundary.
            markerPresentDuringEmbed = fs.existsSync(markerPath());
            // A competing writer is not blocked while the slow embed runs.
            try {
              connB.prepare('INSERT INTO probe_writes (id) VALUES (1)').run();
              concurrentWriteSucceeded = true;
            } catch (err) {
              concurrentWriteError = err instanceof Error ? err.message : String(err);
            }
          }
          return [1, 0];
        },
      };

      const result = runConsolidationCycleIfEnabled(connA, { edgeEmbeddingProvider: provider });

      expect(result).not.toBeNull();
      expect(embedCalls).toBe(1);
      // RED on the old ordering (embed inside BEGIN IMMEDIATE): inTransaction true.
      expect(inTransactionDuringEmbed).toBe(false);
      // RED if the long phase never opens a maintenance handle: marker absent.
      expect(markerPresentDuringEmbed).toBe(true);
      // RED on the old ordering: connB blocked with SQLITE_BUSY during the embed.
      expect(concurrentWriteError).toBeNull();
      expect(concurrentWriteSucceeded).toBe(true);

      expect(result!.semanticEdges).toEqual({
        attempted: 1,
        embedded: 1,
        skipped: 0,
        failed: 0,
        providerAvailable: true,
      });

      // The handle is released once the pass ends — the lease does not leak.
      expect(fs.existsSync(markerPath())).toBe(false);
      // The concurrent write is durable.
      expect((connA.prepare('SELECT COUNT(*) AS c FROM probe_writes').get() as { c: number }).c).toBe(1);
    } finally {
      connA.close();
      connB.close();
    }
  });

  it('opens no maintenance handle when the semantic-edge layer is flag-off', () => {
    vi.stubEnv('SPECKIT_CONSOLIDATION', 'true');
    // SPECKIT_SEMANTIC_EDGE_LAYER intentionally left unset (default-off).

    const db = new Database(':memory:');
    try {
      applyEdgeSchema(db);
      db.prepare(`
        INSERT INTO causal_edges (id, source_id, target_id, relation, fact_text, last_accessed)
        VALUES (1, '10', '20', 'supports', 'alpha relationship', datetime('now'))
      `).run();
      causalEdges.init(db);

      const provider = {
        modelId: 'unit',
        embedEdgeText: vi.fn((): number[] => [1, 0]),
      };

      const result = runConsolidationCycleIfEnabled(db, { edgeEmbeddingProvider: provider });

      expect(result).not.toBeNull();
      // Flag-off path is unchanged: no embedding, no marker write.
      expect(provider.embedEdgeText).not.toHaveBeenCalled();
      expect(result!.semanticEdges).toBeUndefined();
      expect(fs.existsSync(markerPath())).toBe(false);
    } finally {
      db.close();
    }
  });
});

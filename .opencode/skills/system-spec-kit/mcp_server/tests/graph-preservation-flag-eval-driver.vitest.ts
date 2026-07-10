// ───────────────────────────────────────────────────────────────
// 1. TEST — GRAPH PRESERVATION FLAG-EVAL DRIVER
// ───────────────────────────────────────────────────────────────
//
// Guards the two pre-flight contracts this sibling driver adds on top
// of the reused run-retrieval-flag-eval.mjs machinery: refusing to benchmark
// against a non-quiescent source database, and refusing to treat a path
// outside the eval temp root as a safe-to-mutate snapshot (the guard against
// shared/paths.ts's workspace-boundary fallback silently redirecting a write
// at the canonical checkout).

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import Database from 'better-sqlite3';
import { describe, it, expect, afterEach } from 'vitest';

import {
  assertSourceQuiescent,
  assertWithinEvalRoot,
  groupBySlice,
  CONTROL_SLICE_NOISE_BAND,
  FLAG_SPECS,
} from '../scripts/evals/run-graph-preservation-flag-eval.mjs';

function makeQuiescentDb(dbPath: string): Database.Database {
  const db = new Database(dbPath);
  db.exec(`
    CREATE TABLE config (key TEXT PRIMARY KEY, value TEXT);
    CREATE TABLE memory_index (id INTEGER PRIMARY KEY, embedding_status TEXT);
  `);
  return db;
}

describe('graph-preservation flag-eval driver — REQ-003 pre-flight', () => {
  let tempDbPaths: string[] = [];

  afterEach(() => {
    for (const dbPath of tempDbPaths) {
      for (const suffix of ['', '-wal', '-shm']) {
        fs.rmSync(`${dbPath}${suffix}`, { force: true });
      }
    }
    tempDbPaths = [];
  });

  function tempDbPath(): string {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'graph-preservation-driver-test-'));
    const dbPath = path.join(dir, 'source.sqlite');
    tempDbPaths.push(dbPath);
    return dbPath;
  }

  describe('assertSourceQuiescent', () => {
    it('reports quiescent when there are no pending/retry/failed embeddings and no active jobs', () => {
      const dbPath = tempDbPath();
      const db = makeQuiescentDb(dbPath);
      db.close();

      const result = assertSourceQuiescent(dbPath);
      expect(result.quiescent).toBe(true);
      expect(result.blockers).toEqual([]);
    });

    it('refuses when there are pending embeddings', () => {
      const dbPath = tempDbPath();
      const db = makeQuiescentDb(dbPath);
      db.prepare('INSERT INTO memory_index (id, embedding_status) VALUES (1, ?)').run('pending');
      db.close();

      const result = assertSourceQuiescent(dbPath);
      expect(result.quiescent).toBe(false);
      expect(result.blockers.join(' ')).toMatch(/pending embedding/);
    });

    it('refuses when there are failed embeddings', () => {
      const dbPath = tempDbPath();
      const db = makeQuiescentDb(dbPath);
      db.prepare('INSERT INTO memory_index (id, embedding_status) VALUES (1, ?)').run('failed');
      db.close();

      const result = assertSourceQuiescent(dbPath);
      expect(result.quiescent).toBe(false);
      expect(result.blockers.join(' ')).toMatch(/failed embedding/);
    });

    it('refuses when a scan job started recently (within the lease window)', () => {
      const dbPath = tempDbPath();
      const db = makeQuiescentDb(dbPath);
      db.prepare('INSERT INTO config (key, value) VALUES (?, ?)').run('scan_started_at', String(Date.now()));
      db.close();

      const result = assertSourceQuiescent(dbPath);
      expect(result.quiescent).toBe(false);
      expect(result.activeScanJob).toBe(true);
    });

    it('does not treat a stale (expired-lease) scan_started_at as an active scan job', () => {
      const dbPath = tempDbPath();
      const db = makeQuiescentDb(dbPath);
      db.prepare('INSERT INTO config (key, value) VALUES (?, ?)').run('scan_started_at', String(Date.now() - 10 * 60_000));
      db.close();

      const result = assertSourceQuiescent(dbPath);
      expect(result.activeScanJob).toBe(false);
    });

    it('refuses when an embedder_jobs row is queued or running', () => {
      const dbPath = tempDbPath();
      const db = makeQuiescentDb(dbPath);
      db.exec('CREATE TABLE embedder_jobs (id INTEGER PRIMARY KEY, status TEXT)');
      db.prepare('INSERT INTO embedder_jobs (id, status) VALUES (1, ?)').run('running');
      db.close();

      const result = assertSourceQuiescent(dbPath);
      expect(result.quiescent).toBe(false);
      expect(result.activeEmbedderJob).toBe(true);
    });
  });

  describe('assertWithinEvalRoot', () => {
    it('does not throw for a path under the eval root', () => {
      expect(() => assertWithinEvalRoot('test', '/tmp/eval-root/context-index.sqlite', '/tmp/eval-root')).not.toThrow();
    });

    it('does not throw when the path equals the eval root', () => {
      expect(() => assertWithinEvalRoot('test', '/tmp/eval-root', '/tmp/eval-root')).not.toThrow();
    });

    it('throws for a path outside the eval root (guards the canonical-checkout fallback)', () => {
      expect(() => assertWithinEvalRoot('test', '/some/other/place/db.sqlite', '/tmp/eval-root')).toThrow(
        /does not resolve under the eval temp root/,
      );
    });

    it('throws for a sibling directory that merely shares a path prefix', () => {
      expect(() => assertWithinEvalRoot('test', '/tmp/eval-root-other/db.sqlite', '/tmp/eval-root')).toThrow();
    });
  });

  describe('groupBySlice', () => {
    it('buckets queries into the three fixed slices plus any unexpected slice value', () => {
      const groups = groupBySlice([
        { id: 1, slice: 'content_rich_short' },
        { id: 2, slice: 'content_rich_short' },
        { id: 3, slice: 'single_hop' },
        { id: 4, slice: 'control' },
      ] as Array<{ id: number; slice: string }>);

      expect(groups.get('content_rich_short')).toHaveLength(2);
      expect(groups.get('single_hop')).toHaveLength(1);
      expect(groups.get('control')).toHaveLength(1);
    });

    it('always includes all three slice keys even when a slice has zero queries', () => {
      const groups = groupBySlice([] as Array<{ id: number; slice: string }>);
      expect([...groups.keys()]).toEqual(['content_rich_short', 'single_hop', 'control']);
      expect(groups.get('control')).toHaveLength(0);
    });
  });

  describe('flag configuration', () => {
    it('targets exactly the two graph-preservation flags, both default-off', () => {
      const envs = FLAG_SPECS.map((flag: { env: string }) => flag.env);
      expect(envs).toContain('SPECKIT_RETRIEVAL_CLASS_ROUTING');
      expect(envs).toContain('SPECKIT_CONTENT_RICH_SHORT_QUERY_GRAPH_PRESERVATION');
      for (const flag of FLAG_SPECS as Array<{ currentDefault: string }>) {
        expect(flag.currentDefault).toBe('off');
      }
    });

    it('documents an explicit, non-zero control-slice noise band (REQ-008)', () => {
      expect(CONTROL_SLICE_NOISE_BAND).toBeGreaterThan(0);
      expect(CONTROL_SLICE_NOISE_BAND).toBeLessThan(0.2);
    });
  });
});

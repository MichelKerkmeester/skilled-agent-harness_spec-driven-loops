// ───────────────────────────────────────────────────────────────
// TEST: TEMPORAL RECALL FLAG — ON-PATH BEHAVIOR
// ───────────────────────────────────────────────────────────────
// Companion to the run-edge-recall-eval.mjs driver. Every assertion here is an
// ON-path assertion: it proves a flag turned ON CHANGES edge behavior and the new
// contract holds, rather than the weaker flag-OFF byte-identity guarantee the
// existing edge tests cover. The flag under test gates a path outside
// hybridSearchEnhanced, so it is graded by the gated primitive's own behavior:
//   - SPECKIT_TEMPORAL_EDGES        -> valid-edge reads return rows ON, none OFF
// Plus the driver's pure metric helpers, exercised against a real edge graph.
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import Database from 'better-sqlite3';

import {
  ensureTemporalColumns,
  getValidEdges,
  invalidateEdge,
} from '../lib/graph/temporal-edges.js';
import {
  buildEdgeRecallSearchOptions,
  computeEdgeRecall,
} from '../scripts/evals/run-edge-recall-eval.mjs';

type SqliteDatabase = InstanceType<typeof Database>;

const FLAG_ENVS = [
  'SPECKIT_TEMPORAL_EDGES',
] as const;

const SAVED_ENV: Partial<Record<(typeof FLAG_ENVS)[number], string | undefined>> = {};

function saveEnv(): void {
  for (const key of FLAG_ENVS) SAVED_ENV[key] = process.env[key];
}

function restoreEnv(): void {
  for (const key of FLAG_ENVS) {
    const value = SAVED_ENV[key];
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
}

function createEdgeDb(): SqliteDatabase {
  const db = new Database(':memory:');
  db.exec(`
    CREATE TABLE causal_edges (
      id INTEGER PRIMARY KEY,
      source_id TEXT NOT NULL,
      target_id TEXT NOT NULL,
      relation TEXT NOT NULL,
      strength REAL DEFAULT 1.0,
      evidence TEXT,
      fact_text TEXT,
      invalid_at TEXT DEFAULT NULL,
      invalidation_source TEXT DEFAULT NULL,
      UNIQUE(source_id, target_id, relation)
    )
  `);
  db.exec(`
    INSERT INTO causal_edges (id, source_id, target_id, relation, strength)
    VALUES
      (1, '100', '200', 'supports', 0.9),
      (2, '100', '300', 'caused', 0.8)
  `);
  return db;
}

describe('Temporal recall flag — ON-path behavior', () => {
  beforeEach(() => {
    saveEnv();
    for (const key of FLAG_ENVS) delete process.env[key];
  });
  afterEach(() => {
    restoreEnv();
  });

  it('SPECKIT_TEMPORAL_EDGES ON makes valid-edge reads return rows; OFF returns none', () => {
    const db = createEdgeDb();
    try {
      process.env.SPECKIT_TEMPORAL_EDGES = 'false';
      expect(getValidEdges(db, 100)).toHaveLength(0);

      process.env.SPECKIT_TEMPORAL_EDGES = 'true';
      const edgesOn = getValidEdges(db, 100);
      expect(edgesOn.length).toBeGreaterThan(0);
      // ON-path contract: every returned edge is genuinely open (invalid_at null)
      // and touches the queried node — not a byte-identity claim.
      for (const edge of edgesOn) {
        expect(edge.invalidAt).toBeNull();
        expect([edge.sourceId, edge.targetId]).toContain(100);
      }
    } finally {
      db.close();
    }
  });

  it('SPECKIT_TEMPORAL_EDGES ON honors invalidation — closed edges drop out of valid reads', () => {
    const db = createEdgeDb();
    try {
      process.env.SPECKIT_TEMPORAL_EDGES = 'true';
      ensureTemporalColumns(db);
      const before = getValidEdges(db, 100).length;
      invalidateEdge(db, 100, 200, 'test close', 'supports');
      const after = getValidEdges(db, 100).length;
      // ON-path behavior change: invalidating an open edge reduces the valid set.
      expect(after).toBe(before - 1);
    } finally {
      db.close();
    }
  });

  it('driver metric: buildEdgeRecallSearchOptions drives the DEFAULT path, never forceAllChannels', () => {
    const options = buildEdgeRecallSearchOptions(20);
    expect(options.useGraph).toBe(true);
    expect(options.limit).toBe(20);
    // The recall metric must reflect production default routing; forcing every
    // channel would manufacture an unreal lane mix.
    expect('forceAllChannels' in options).toBe(false);
  });

  it('driver metric: computeEdgeRecall counts edge-neighbor hits within K', () => {
    const golden = [
      { id: 'a', expectedTargetMemoryId: 200 },
      { id: 'b', expectedTargetMemoryId: 300 },
      { id: 'c', expectedTargetMemoryId: 999 },
    ];
    const resultIds = new Map<string, number[]>([
      ['a', [200, 5, 6]],   // recalled
      ['b', [7, 8, 9]],     // not recalled
      ['c', [10, 11]],      // not recalled
    ]);
    const result = computeEdgeRecall(golden, resultIds, 20);
    expect(result.evaluatedQueries).toBe(3);
    expect(result.hits).toBe(1);
    expect(result.recall).toBeCloseTo(1 / 3, 6);
  });
});

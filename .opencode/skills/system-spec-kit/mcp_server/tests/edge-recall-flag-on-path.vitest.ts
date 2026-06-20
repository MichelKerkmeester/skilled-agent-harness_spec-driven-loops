// ───────────────────────────────────────────────────────────────
// TEST: EDGE / TEMPORAL RECALL FLAGS — ON-PATH BEHAVIOR
// ───────────────────────────────────────────────────────────────
// Companion to the run-edge-recall-eval.mjs driver. Every assertion here is an
// ON-path assertion: it proves a flag turned ON CHANGES edge behavior and the new
// contract holds, rather than the weaker flag-OFF byte-identity guarantee the
// existing edge tests cover. The flags under test gate paths outside
// hybridSearchEnhanced, so they are graded by the gated primitive's own behavior:
//   - SPECKIT_TEMPORAL_EDGES        -> valid-edge reads return rows ON, none OFF
//   - SPECKIT_EDGE_PRESENCE_CURRENTNESS -> reconciliation runs + repairs rows ON
//   - SPECKIT_EDGE_VECTOR_INDEX     -> semantic nearest-edge lookup reachable ON
//   - SPECKIT_EDGE_TRIPLET_SEARCH   -> edge-aware triplet ranking emits ON
// Plus the driver's pure metric helpers, exercised against a real edge graph.
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import Database from 'better-sqlite3';

import {
  ensureTemporalColumns,
  getValidEdges,
  invalidateEdge,
  reconcileEdgePresenceCurrentness,
} from '../lib/graph/temporal-edges.js';
import {
  findSemanticEdges,
  rankEdgeTripletCandidates,
} from '../lib/graph/edge-semantic-retrieval.js';
import { upsertEdgeVector } from '../lib/storage/edge-vector-store.js';
import {
  buildEdgeRecallSearchOptions,
  computeEdgeRecall,
} from '../scripts/evals/run-edge-recall-eval.mjs';

type SqliteDatabase = InstanceType<typeof Database>;

const FLAG_ENVS = [
  'SPECKIT_TEMPORAL_EDGES',
  'SPECKIT_EDGE_PRESENCE_CURRENTNESS',
  'SPECKIT_EDGE_VECTOR_INDEX',
  'SPECKIT_EDGE_TRIPLET_SEARCH',
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

describe('Edge/temporal recall flags — ON-path behavior', () => {
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

  it('SPECKIT_EDGE_PRESENCE_CURRENTNESS ON runs reconciliation and repairs stray markers; OFF is inert', () => {
    const db = createEdgeDb();
    try {
      process.env.SPECKIT_TEMPORAL_EDGES = 'true';
      ensureTemporalColumns(db);
      // Seed the two stray states the reconciliation must repair.
      db.exec(`
        UPDATE causal_edges SET invalidation_source = 'direct' WHERE id = 1;
        UPDATE causal_edges SET invalid_at = '2026-01-01T00:00:00Z', invalidation_source = NULL WHERE id = 2;
      `);

      process.env.SPECKIT_EDGE_PRESENCE_CURRENTNESS = 'false';
      const off = reconcileEdgePresenceCurrentness(db);
      expect(off.enabled).toBe(false);

      process.env.SPECKIT_EDGE_PRESENCE_CURRENTNESS = 'true';
      const on = reconcileEdgePresenceCurrentness(db);
      // ON-path contract: pass runs (enabled) AND actually repairs both stray rows.
      expect(on.enabled).toBe(true);
      expect(on.clearedOpenMarkers).toBe(1);
      expect(on.markedLegacyClosures).toBe(1);

      const openMarker = db.prepare("SELECT invalidation_source FROM causal_edges WHERE id = 1").get() as { invalidation_source: string | null };
      const closedMarker = db.prepare("SELECT invalidation_source FROM causal_edges WHERE id = 2").get() as { invalidation_source: string | null };
      expect(openMarker.invalidation_source).toBeNull();
      expect(closedMarker.invalidation_source).toBe('legacy');
    } finally {
      db.close();
    }
  });

  it('SPECKIT_EDGE_VECTOR_INDEX ON makes semantic nearest-edge lookup reachable; OFF returns empty', () => {
    const db = createEdgeDb();
    try {
      db.exec('ALTER TABLE causal_edges ADD COLUMN source_anchor TEXT');
      db.exec('ALTER TABLE causal_edges ADD COLUMN target_anchor TEXT');
      const dim = 8;
      const embedding = new Array(dim).fill(0);
      embedding[0] = 1;
      upsertEdgeVector(db, {
        edgeId: 1,
        profileKey: 'test__profile',
        inputKind: 'edge',
        modelId: 'test-model',
        dimensions: dim,
        embedding: Float32Array.from(embedding),
        factHash: 'hash-1',
        embeddingStatus: 'ready',
      });

      const probe = new Array(dim).fill(0);
      probe[0] = 1;

      process.env.SPECKIT_EDGE_VECTOR_INDEX = 'false';
      expect(findSemanticEdges(db, probe, { limit: 5 })).toHaveLength(0);

      process.env.SPECKIT_EDGE_VECTOR_INDEX = 'true';
      const hitsOn = findSemanticEdges(db, probe, { limit: 5 });
      // ON-path contract: the flag exposes a live semantic edge hit for the seeded edge.
      expect(hitsOn.length).toBeGreaterThan(0);
      expect(hitsOn[0].edgeId).toBe(1);
      expect(hitsOn[0].score).toBeGreaterThan(0);
    } finally {
      db.close();
    }
  });

  it('SPECKIT_EDGE_TRIPLET_SEARCH ON emits ranked triplet candidates; OFF returns empty', () => {
    const candidates = [
      { edgeId: 1, sourceId: '100', targetId: '200', relation: 'supports', strength: 1, factText: null, score: 0.9, modelId: 'm', profileKey: 'p', sourceScore: 0.8, targetScore: 0.7 },
      { edgeId: 2, sourceId: '100', targetId: '300', relation: 'caused', strength: 1, factText: null, score: 0.5, modelId: 'm', profileKey: 'p', sourceScore: 0.4, targetScore: 0.3 },
    ];

    process.env.SPECKIT_EDGE_TRIPLET_SEARCH = 'false';
    expect(rankEdgeTripletCandidates(candidates)).toHaveLength(0);

    process.env.SPECKIT_EDGE_TRIPLET_SEARCH = 'true';
    const rankedOn = rankEdgeTripletCandidates(candidates);
    // ON-path contract: ranking emits a tripletScore and orders the stronger edge first.
    expect(rankedOn.length).toBe(2);
    expect(rankedOn[0].tripletScore).toBeGreaterThan(rankedOn[1].tripletScore);
    expect(rankedOn[0].edgeId).toBe(1);
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

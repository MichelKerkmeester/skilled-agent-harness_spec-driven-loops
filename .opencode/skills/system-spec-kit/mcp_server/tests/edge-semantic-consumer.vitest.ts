// ───────────────────────────────────────────────────────────────
// TEST: EDGE SEMANTIC PRODUCER + CONSUMER — ON-PATH BEHAVIOR
// ───────────────────────────────────────────────────────────────
// Covers the two pieces wiring the semantic-edge layer end to end:
//   - createPrecomputedEdgeEmbeddingProvider: the sync provider that bridges the
//     async daemon embedder to runSemanticEdgeEmbeddingPass's sync contract.
//   - findSemanticEdgeNeighborCandidates: the query-time consumer that folds
//     edge-neighbor candidates into the graph lane through the additive slot.
// Every assertion is an ON-path assertion: it proves the flag turned ON changes
// behavior and the new contract holds, not just the flag-OFF no-op.
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import Database from 'better-sqlite3';

import { createPrecomputedEdgeEmbeddingProvider } from '../lib/storage/edge-embedding-provider.js';
import {
  ensureEdgeVectorStoreSchema,
  upsertEdgeVector,
} from '../lib/storage/edge-vector-store.js';
import { findSemanticEdgeNeighborCandidates } from '../lib/graph/edge-semantic-retrieval.js';

type SqliteDatabase = InstanceType<typeof Database>;

const FLAG_ENVS = ['SPECKIT_EDGE_VECTOR_INDEX', 'SPECKIT_EDGE_TRIPLET_SEARCH'] as const;
const DIM = 4;

function unitVector(index: number): Float32Array {
  const vector = new Float32Array(DIM);
  vector[index % DIM] = 1;
  return vector;
}

function seedEdgeGraph(db: SqliteDatabase): void {
  db.exec(`
    CREATE TABLE causal_edges (
      id INTEGER PRIMARY KEY,
      source_id TEXT NOT NULL,
      target_id TEXT NOT NULL,
      relation TEXT NOT NULL,
      strength REAL,
      fact_text TEXT
    )
  `);
  ensureEdgeVectorStoreSchema(db);
  const insert = db.prepare(
    'INSERT INTO causal_edges (id, source_id, target_id, relation, strength, fact_text) VALUES (?, ?, ?, ?, ?, ?)',
  );
  // The caused edge endpoints point along the first basis axis; the supports
  // edge endpoints point along the second. A query along the first basis axis
  // therefore ranks the caused edge ahead of the supports edge.
  insert.run(1, '100', '200', 'caused', 1, 'edge one fact');
  insert.run(2, '300', '400', 'supports', 1, 'edge two fact');
  upsertEdgeVector(db, { edgeId: 1, embedding: unitVector(0), factText: 'edge one fact', modelId: 'm', profileKey: 'p' });
  upsertEdgeVector(db, { edgeId: 2, embedding: unitVector(1), factText: 'edge two fact', modelId: 'm', profileKey: 'p' });
}

describe('createPrecomputedEdgeEmbeddingProvider', () => {
  it('resolves a vector for known text and null for misses', () => {
    const map = new Map<string, Float32Array>([['known fact', unitVector(0)]]);
    const provider = createPrecomputedEdgeEmbeddingProvider(map, { modelId: 'm', profileKey: 'p' });

    expect(provider.modelId).toBe('m');
    expect(provider.profileKey).toBe('p');
    expect(provider.embedEdgeText('known fact')).toBeInstanceOf(Float32Array);
    // trim-normalized lookup so whitespace variants resolve to the same vector
    expect(provider.embedEdgeText('  known fact  ')).toBeInstanceOf(Float32Array);
    expect(provider.embedEdgeText('unknown fact')).toBeNull();
    expect(provider.embedEdgeText('   ')).toBeNull();
  });
});

describe('findSemanticEdgeNeighborCandidates', () => {
  let db: SqliteDatabase;
  let envSnapshot: Record<string, string | undefined>;

  beforeEach(() => {
    envSnapshot = Object.fromEntries(FLAG_ENVS.map((name) => [name, process.env[name]]));
    db = new Database(':memory:');
    seedEdgeGraph(db);
  });

  afterEach(() => {
    db.close();
    for (const name of FLAG_ENVS) {
      if (envSnapshot[name] === undefined) delete process.env[name];
      else process.env[name] = envSnapshot[name];
    }
  });

  it('returns [] when the vector-index flag is off (strict no-op)', () => {
    delete process.env.SPECKIT_EDGE_VECTOR_INDEX;
    const candidates = findSemanticEdgeNeighborCandidates(db, unitVector(0), { limit: 20 });
    expect(candidates).toEqual([]);
  });

  it('surfaces BOTH endpoint memories of the nearest edge as graph-family candidates when on', () => {
    process.env.SPECKIT_EDGE_VECTOR_INDEX = 'true';
    delete process.env.SPECKIT_EDGE_TRIPLET_SEARCH;
    const candidates = findSemanticEdgeNeighborCandidates(db, unitVector(0), { limit: 20 });

    const ids = candidates.map((candidate) => candidate.id).sort((a, b) => a - b);
    expect(ids).toContain(100);
    expect(ids).toContain(200);
    for (const candidate of candidates) {
      expect(candidate.source).toBe('graph');
      expect(candidate.via).toBe('edge-semantic');
      expect(Number.isInteger(candidate.id)).toBe(true);
    }
    // The axis-0 edge (1) ranks ahead of the axis-1 edge (2): its endpoints lead.
    expect(candidates[0].edgeId).toBe(1);
  });

  it('applies relation-aware triplet scoring when triplet search is co-enabled', () => {
    process.env.SPECKIT_EDGE_VECTOR_INDEX = 'true';
    process.env.SPECKIT_EDGE_TRIPLET_SEARCH = 'true';
    const candidates = findSemanticEdgeNeighborCandidates(db, unitVector(0), { limit: 20 });
    expect(candidates.length).toBeGreaterThan(0);
    // Triplet scoring stays in [0,1]; the nearest edge's endpoints still lead.
    for (const candidate of candidates) {
      expect(candidate.score).toBeGreaterThanOrEqual(0);
      expect(candidate.score).toBeLessThanOrEqual(1);
    }
    expect(candidates[0].edgeId).toBe(1);
  });
});

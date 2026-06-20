import Database from 'better-sqlite3';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  findSemanticEdges,
  rankEdgeTripletCandidates,
  scoreEdgeAwareTriplet,
} from '../lib/graph/edge-semantic-retrieval';
import {
  getEdgeVector,
  markEdgeVectorFailed,
  nearestEdgeVectors,
  upsertEdgeVector,
} from '../lib/storage/edge-vector-store';
import { runConsolidationCycle } from '../lib/storage/consolidation';
import * as causalEdges from '../lib/storage/causal-edges';

function createEdgeDb(): Database.Database {
  const db = new Database(':memory:');
  db.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY,
      title TEXT,
      importance_tier TEXT DEFAULT 'normal',
      parent_id INTEGER,
      content_text TEXT
    );
    CREATE TABLE causal_edges (
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
  `);
  return db;
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('semantic edge layer', () => {
  it('writes passive fact text without changing public edge reads', () => {
    const db = createEdgeDb();
    causalEdges.init(db);

    const edgeId = causalEdges.insertEdge(
      '10',
      '20',
      'supports',
      0.8,
      'evidence text',
      true,
      'manual',
      {},
      { factText: 'custom relationship fact' },
    );

    expect(edgeId).toBe(1);
    const stored = db.prepare('SELECT fact_text AS factText FROM causal_edges WHERE id = ?')
      .get(edgeId) as { factText: string };
    expect(stored.factText).toBe('custom relationship fact');
    const publicEdge = causalEdges.getEdgesFrom('10')[0] as Record<string, unknown>;
    expect(publicEdge).toMatchObject({
      id: 1,
      source_id: '10',
      target_id: '20',
      relation: 'supports',
      evidence: 'evidence text',
    });
    expect(publicEdge).not.toHaveProperty('factText');
    expect(publicEdge).not.toHaveProperty('fact_text');
  });

  it('stores edge vectors and retrieves nearest edges deterministically', () => {
    const db = createEdgeDb();
    db.prepare(`
      INSERT INTO causal_edges (id, source_id, target_id, relation, fact_text)
      VALUES
        (1, '10', '20', 'supports', 'alpha relationship'),
        (2, '30', '40', 'supports', 'beta relationship')
    `).run();
    upsertEdgeVector(db, {
      edgeId: 1,
      embedding: [1, 0],
      factText: 'alpha relationship',
      modelId: 'unit',
    });
    upsertEdgeVector(db, {
      edgeId: 2,
      embedding: [0, 1],
      factText: 'beta relationship',
      modelId: 'unit',
    });

    const hits = nearestEdgeVectors(db, [0.95, 0.05], { limit: 2, modelId: 'unit' });

    expect(hits.map((hit) => hit.edgeId)).toEqual([1, 2]);
    expect(hits[0].score).toBeGreaterThan(hits[1].score);
    expect(getEdgeVector(db, 1, { modelId: 'unit' })?.dimensions).toBe(2);
  });

  it('resolves a failed marker on retry without leaving a dimensions=0 orphan', () => {
    const db = createEdgeDb();
    db.prepare(`
      INSERT INTO causal_edges (id, source_id, target_id, relation, fact_text)
      VALUES (1, '10', '20', 'supports', 'alpha relationship')
    `).run();

    const rowsForEdge = (): Array<{ embedding_status: string; dimensions: number }> =>
      db.prepare(`
        SELECT embedding_status, dimensions
        FROM edge_vector_embeddings
        WHERE edge_id = 1 AND profile_key = 'default' AND input_kind = 'edge' AND model_id = 'unit'
        ORDER BY dimensions ASC
      `).all() as Array<{ embedding_status: string; dimensions: number }>;

    // Provider failure records a marker before any embedding dimension is known.
    markEdgeVectorFailed(db, 1, 'provider boom', { modelId: 'unit', profileKey: 'default' });
    expect(rowsForEdge()).toEqual([{ embedding_status: 'failed', dimensions: 0 }]);

    // Retry succeeds at the real dimension. The failed marker lands on a
    // different PK slot (dimensions=0), so without cleanup it would orphan
    // beside the ready row and the marker would never clear.
    upsertEdgeVector(db, {
      edgeId: 1,
      embedding: [1, 0, 0.5],
      factText: 'alpha relationship',
      modelId: 'unit',
      profileKey: 'default',
    });

    expect(rowsForEdge()).toEqual([{ embedding_status: 'ready', dimensions: 3 }]);
    expect(getEdgeVector(db, 1, { modelId: 'unit' })?.status).toBe('ready');

    // A second fail->retry cycle must not accumulate orphans either.
    markEdgeVectorFailed(db, 1, 'provider boom again', { modelId: 'unit', profileKey: 'default' });
    upsertEdgeVector(db, {
      edgeId: 1,
      embedding: [0, 1, 0.25],
      factText: 'alpha relationship',
      modelId: 'unit',
      profileKey: 'default',
    });
    expect(rowsForEdge()).toEqual([{ embedding_status: 'ready', dimensions: 3 }]);
  });

  it('keeps semantic edge lookup flag-off until the shadow flag is enabled', () => {
    const db = createEdgeDb();
    db.prepare(`
      INSERT INTO causal_edges (id, source_id, target_id, relation, fact_text)
      VALUES (1, '10', '20', 'supports', 'alpha relationship')
    `).run();
    upsertEdgeVector(db, {
      edgeId: 1,
      embedding: [1, 0],
      factText: 'alpha relationship',
      modelId: 'unit',
    });

    expect(findSemanticEdges(db, [1, 0], { limit: 1, modelId: 'unit' })).toEqual([]);

    vi.stubEnv('SPECKIT_EDGE_VECTOR_INDEX', 'true');
    expect(findSemanticEdges(db, [1, 0], { limit: 1, modelId: 'unit' })).toEqual([
      expect.objectContaining({
        edgeId: 1,
        sourceId: '10',
        targetId: '20',
        relation: 'supports',
        factText: 'alpha relationship',
      }),
    ]);
  });

  it('scores triplet candidates only when the triplet shadow flag is enabled', () => {
    const score = scoreEdgeAwareTriplet({
      sourceScore: 0.9,
      edgeScore: 0.8,
      targetScore: 0.7,
      edgeWeight: 2,
    });
    expect(score).toBeCloseTo(0.8, 5);

    const candidate = {
      edgeId: 1,
      sourceId: '10',
      targetId: '20',
      relation: 'supports',
      strength: 1,
      factText: 'alpha relationship',
      score: 0.8,
      modelId: 'unit',
      profileKey: 'default',
      sourceScore: 0.9,
      targetScore: 0.7,
    };

    expect(rankEdgeTripletCandidates([candidate])).toEqual([]);
    vi.stubEnv('SPECKIT_EDGE_TRIPLET_SEARCH', 'true');
    expect(rankEdgeTripletCandidates([candidate])).toEqual([
      expect.objectContaining({ edgeId: 1, tripletScore: score }),
    ]);
  });

  it('runs the consolidation-time edge embedder only behind the substrate flag', () => {
    const db = createEdgeDb();
    db.prepare(`
      INSERT INTO causal_edges (id, source_id, target_id, relation, fact_text)
      VALUES
        (1, '10', '20', 'supports', 'alpha relationship'),
        (2, '30', '40', 'supports', 'beta relationship')
    `).run();
    const provider = {
      modelId: 'unit',
      profileKey: 'default',
      embedEdgeText: vi.fn((text: string) => (text.startsWith('alpha') ? [1, 0] : [0, 1])),
    };

    const offResult = runConsolidationCycle(db, { edgeEmbeddingProvider: provider });
    expect(offResult.semanticEdges).toBeUndefined();
    expect(provider.embedEdgeText).not.toHaveBeenCalled();

    vi.stubEnv('SPECKIT_SEMANTIC_EDGE_LAYER', 'true');
    const onResult = runConsolidationCycle(db, { edgeEmbeddingProvider: provider });

    expect(onResult.semanticEdges).toEqual({
      attempted: 2,
      embedded: 2,
      skipped: 0,
      failed: 0,
      providerAvailable: true,
    });
    expect(provider.embedEdgeText).toHaveBeenCalledTimes(2);
    expect(nearestEdgeVectors(db, [1, 0], { limit: 1, modelId: 'unit' })[0].edgeId).toBe(1);
  });

  it('records edge embedding failures without failing consolidation', () => {
    const db = createEdgeDb();
    db.prepare(`
      INSERT INTO causal_edges (id, source_id, target_id, relation, fact_text)
      VALUES (1, '10', '20', 'supports', 'alpha relationship')
    `).run();
    vi.stubEnv('SPECKIT_SEMANTIC_EDGE_LAYER', 'true');

    const result = runConsolidationCycle(db, {
      edgeEmbeddingProvider: {
        modelId: 'unit',
        embedEdgeText: () => {
          throw new Error('provider unavailable');
        },
      },
    });

    expect(result.semanticEdges).toEqual({
      attempted: 1,
      embedded: 0,
      skipped: 0,
      failed: 1,
      providerAvailable: true,
    });
    const failed = db.prepare(`
      SELECT embedding_status AS status, failure_reason AS reason
      FROM edge_vector_embeddings
      WHERE edge_id = 1
    `).get() as { status: string; reason: string };
    expect(failed).toEqual({
      status: 'failed',
      reason: 'provider unavailable',
    });
  });
});

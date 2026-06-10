import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { formatSearchResults } from '../formatters/search-results.js';
import { handleMemoryHealth } from '../handlers/memory-crud-health.js';
import {
  buildVectorDegradationSignal,
  buildWhyRankedTrace,
  getMaintenanceObservabilitySnapshot,
  recordMaintenanceRun,
} from '../lib/observability/retrieval-observability.js';
import * as core from '../core/index.js';
import * as vectorIndex from '../lib/search/vector-index.js';

function parseResponse(response: { content: Array<{ text: string }> }): Record<string, unknown> {
  return JSON.parse(response.content[0]?.text ?? '{}') as Record<string, unknown>;
}

function dataFrom(response: { content: Array<{ text: string }> }): Record<string, unknown> {
  return parseResponse(response).data as Record<string, unknown>;
}

describe('OpenLTM retrieval observability', () => {
  beforeAll(() => {
    vectorIndex.closeDb();
    vectorIndex.initializeDb(':memory:');
  });

  beforeEach(() => {
    vi.spyOn(core, 'checkDatabaseUpdated').mockResolvedValue(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  afterAll(() => {
    vectorIndex.closeDb();
  });

  it('derives why_ranked from ranker intermediates without recomputing a display formula', async () => {
    const rows = [
      {
        id: 11,
        file_path: '/tmp/doc-a.md',
        anchor_id: 'summary',
        title: 'Doc A',
        spec_folder: 'specs/test',
        rrfScore: 0.91,
        score: 0.91,
        sourceScores: { vector: 0.8, fts: 0.2, bm25: 0.1, graph: 0.4, trigger: 0.6 },
        importance_weight: 0.7,
      },
      {
        id: 12,
        file_path: '/tmp/doc-b.md',
        anchor_id: 'decision',
        title: 'Doc B',
        spec_folder: 'specs/test',
        rrfScore: 0.52,
        score: 0.52,
        sourceScores: { vector: 0.1, fts: 0.7, bm25: 0.3, graph: 0.1, trigger: 0.0 },
        importance_weight: 0.4,
      },
    ];

    const response = await formatSearchResults(rows, 'hybrid', false, null, null, null, {}, true);
    const results = dataFrom(response).results as Array<Record<string, unknown>>;
    const whyA = results[0].why_ranked as Record<string, unknown>;
    const channelsA = whyA.channels as Record<string, number>;

    expect(results.map((row) => row.filePath)).toEqual(['/tmp/doc-a.md', '/tmp/doc-b.md']);
    expect(whyA).toMatchObject({
      rank: 1,
      effectiveScore: 0.91,
      scoreSource: 'fusion',
      source: 'ranker_intermediates',
      document: { path: '/tmp/doc-a.md', anchor: 'summary' },
    });
    expect(channelsA).toMatchObject(rows[0].sourceScores);
    expect(
      Object.values(channelsA).reduce((sum, value) => sum + value, 0),
    ).toBeGreaterThan(
      Object.values((results[1].why_ranked as Record<string, unknown>).channels as Record<string, number>)
        .reduce((sum, value) => sum + value, 0),
    );
  });

  it('surfaces one inline warning for a returned contradicts or supersedes pair', async () => {
    const db = vectorIndex.getDb();
    db.prepare(`
      INSERT INTO causal_edges(source_id, target_id, relation, strength, evidence)
      VALUES (?, ?, 'contradicts', 1, ?)
    `).run('21', '22', 'test edge');

    const response = await formatSearchResults([
      { id: 21, file_path: '/tmp/source.md', anchor_id: 'state', title: 'Source', spec_folder: 'specs/test', rrfScore: 0.8 },
      { id: 22, file_path: '/tmp/target.md', anchor_id: 'state', title: 'Target', spec_folder: 'specs/test', rrfScore: 0.7 },
    ], 'hybrid', false, null, null, null, {}, true);
    const data = dataFrom(response);
    const warnings = data.inlineWarnings as Array<Record<string, unknown>>;

    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toMatchObject({
      type: 'verify_before_applying',
      relation: 'contradicts',
    });
    expect(warnings[0].documents).toEqual([
      { path: '/tmp/source.md', anchor: 'state' },
      { path: '/tmp/target.md', anchor: 'state' },
    ]);
  });

  it('reports degraded-vector state in trace helpers and memory_health', async () => {
    expect(buildVectorDegradationSignal(false)).toMatchObject({
      degraded: true,
      vectorSearchAvailable: false,
      mode: 'lexical_only',
      reason: 'vector_search_unavailable',
    });

    vi.spyOn(vectorIndex, 'isVectorSearchAvailable').mockReturnValue(false);
    const response = await handleMemoryHealth({});
    const data = dataFrom(response);

    expect(data.vectorSearchAvailable).toBe(false);
    expect(data.recallDegradation).toMatchObject({
      degraded: true,
      mode: 'lexical_only',
      reason: 'vector_search_unavailable',
    });
  });

  it('reports maintenance last-run counters and stale-candidate totals via memory_health', async () => {
    recordMaintenanceRun('memory_index_scan', {
      status: 'success',
      counts: { scanned: 5, indexed: 2, staleDeleted: 1 },
      staleCandidates: 3,
    });
    recordMaintenanceRun('memory_embedding_reconcile', {
      status: 'success',
      counts: { vectorPresentStatusStale: 4, missingActiveVectorRetryEligible: 1 },
      staleCandidates: 5,
    });
    recordMaintenanceRun('memory_retention_sweep', {
      status: 'success',
      counts: { candidates: 2, swept: 2 },
      staleCandidates: 2,
    });

    const response = await handleMemoryHealth({});
    const maintenance = dataFrom(response).maintenance as ReturnType<typeof getMaintenanceObservabilitySnapshot>;

    expect(maintenance.memory_index_scan.counts.scanned).toBe(5);
    expect(maintenance.memory_index_scan.staleCandidates).toBe(3);
    expect(maintenance.memory_embedding_reconcile.counts.vectorPresentStatusStale).toBe(4);
    expect(maintenance.memory_embedding_reconcile.staleCandidates).toBe(5);
    expect(maintenance.memory_retention_sweep.counts.swept).toBe(2);
    expect(maintenance.memory_retention_sweep.staleCandidates).toBe(2);
  });

  it('does not alter ranking, decay fields, or persisted state when observability is enabled', async () => {
    const rows = [
      { id: 31, file_path: '/tmp/a.md', anchor_id: 'a', title: 'A', spec_folder: 'specs/test', rrfScore: 0.6, attentionScore: 0.2 },
      { id: 32, file_path: '/tmp/b.md', anchor_id: 'b', title: 'B', spec_folder: 'specs/test', rrfScore: 0.5, attentionScore: 0.1 },
    ];
    const beforeRows = JSON.stringify(rows);
    const db = vectorIndex.getDb();
    const beforeEdges = (db.prepare('SELECT COUNT(*) AS count FROM causal_edges').get() as { count: number }).count;

    const plain = await formatSearchResults(rows, 'hybrid', false, null, null, null, {}, false);
    const traced = await formatSearchResults(rows, 'hybrid', false, null, null, null, {}, true);
    const plainResults = dataFrom(plain).results as Array<Record<string, unknown>>;
    const tracedResults = dataFrom(traced).results as Array<Record<string, unknown>>;
    const afterEdges = (db.prepare('SELECT COUNT(*) AS count FROM causal_edges').get() as { count: number }).count;

    expect(tracedResults.map((row) => row.filePath)).toEqual(plainResults.map((row) => row.filePath));
    expect(JSON.stringify(rows)).toBe(beforeRows);
    expect(afterEdges).toBe(beforeEdges);
  });
});

describe('retrieval observability helper shape', () => {
  it('keys why_ranked to document path and anchor, not the row identifier', () => {
    const why = buildWhyRankedTrace({ id: 99, file_path: '/tmp/keyed.md', anchor_id: 'anchor', rrfScore: 0.7 }, 1);

    expect(why.document).toEqual({ path: '/tmp/keyed.md', anchor: 'anchor' });
    expect(JSON.stringify(why)).not.toContain('99');
  });
});

// ───────────────────────────────────────────────────────────────
// 1. TEST — GRAPH ADDITIVE RECALL
// ───────────────────────────────────────────────────────────────
// Graph edge lane additivity (SPECKIT_TEMPORAL_EDGES)
//
// Coverage:
// flag ON  → graph-only candidates reserved to the tail; no baseline eviction
// flag ON  → baseline top-K order preserved exactly
// flag ON  → multi-source (graph + vector) candidates stay baseline-protected
// flag ON  → graph-only candidate recalled (additive) within an extended window
// flag OFF → list returned byte-identical (same reference, untouched order)
// no graph-only candidates → active path is a no-op
//
// Core invariant: a graph-only candidate can never evict a baseline hit from
// the top-K window. The reordered top-K is a superset-or-equal of the baseline
// top-K — recall can only grow.

import { describe, expect, it } from 'vitest';
import {
  applyGraphAdditiveRecall,
  type AttributedResult,
} from '../lib/search/graph-additive-recall';

/* ───────────────────────────────────────────────────────────────
   HELPERS
   ──────────────────────────────────────────────────────────────── */

function make(
  id: string,
  score: number,
  sources: string[],
): AttributedResult {
  return { id, score, source: sources[0], sources };
}

function ids(results: AttributedResult[], k?: number): Array<string | number> {
  return (k === undefined ? results : results.slice(0, k)).map((r) => r.id);
}

/* ───────────────────────────────────────────────────────────────
   TESTS
   ──────────────────────────────────────────────────────────────── */

describe('Graph Additive Recall (SPECKIT_TEMPORAL_EDGES)', () => {
  it('reserves graph-only candidates to the tail without evicting baseline top-K', () => {
    const LIMIT = 3;
    // Fused order interleaves a graph-only candidate (g1) ahead of a baseline
    // hit (v3). Competitively, g1 sits at position 2 and pushes v3 out of the
    // top-3 window. Additivity must defer g1 below every baseline hit.
    const fused: AttributedResult[] = [
      make('v1', 0.90, ['vector']),
      make('g1', 0.80, ['graph']),
      make('v2', 0.70, ['fts']),
      make('v3', 0.60, ['vector']),
    ];

    const { results, graphAdditive } = applyGraphAdditiveRecall(fused, true);

    expect(graphAdditive.applied).toBe(true);
    expect(graphAdditive.reservedCount).toBe(1);
    expect(graphAdditive.baselineCount).toBe(3);

    // Baseline hits keep their exact incoming order ahead of any graph-only.
    expect(ids(results)).toEqual(['v1', 'v2', 'v3', 'g1']);

    // The top-K window no longer trades the recalled baseline hit (v3) for the
    // graph-only candidate — v3 stays inside the window.
    expect(ids(results, LIMIT)).toEqual(['v1', 'v2', 'v3']);
  });

  it('never drops a baseline id from the top-K window relative to a graph-stripped baseline', () => {
    const LIMIT = 3;
    const fused: AttributedResult[] = [
      make('g0', 0.95, ['graph']),
      make('v1', 0.90, ['vector']),
      make('g1', 0.80, ['graph']),
      make('v2', 0.70, ['fts']),
      make('v3', 0.60, ['bm25']),
    ];

    const { results } = applyGraphAdditiveRecall(fused, true);

    // The baseline-only top-K that recall is graded against.
    const baselineTopK = fused
      .filter((r) => !(r.sources ?? []).every((s) => s === 'graph'))
      .slice(0, LIMIT)
      .map((r) => r.id);

    const reorderedTopK = ids(results, LIMIT);

    // Every baseline id that was recalled before the graph lane is still
    // present in the reordered top-K — zero displacement.
    for (const baselineId of baselineTopK) {
      expect(reorderedTopK).toContain(baselineId);
    }
  });

  it('treats graph + degree as graph-family and reserves it (the live corpus case)', () => {
    const LIMIT = 3;
    // Mirrors the live edge-recall corpus: graph-family candidates carry
    // ["graph","degree"] (degree is the causal-connectivity re-rank channel,
    // not a baseline recall channel). Such a candidate must be reserved so it
    // cannot evict a lexically recalled baseline hit (v3) sitting at the tail
    // of the window.
    const fused: AttributedResult[] = [
      make('v1', 0.90, ['keyword', 'fts', 'bm25']),
      make('gd1', 0.85, ['graph', 'degree']),
      make('v2', 0.70, ['keyword', 'fts', 'bm25']),
      make('v3', 0.60, ['keyword', 'fts', 'bm25']),
    ];

    const { results, graphAdditive } = applyGraphAdditiveRecall(fused, true);

    expect(graphAdditive.reservedCount).toBe(1);
    expect(ids(results)).toEqual(['v1', 'v2', 'v3', 'gd1']);
    expect(ids(results, LIMIT)).toEqual(['v1', 'v2', 'v3']);
  });

  it('keeps a candidate carrying any baseline source alongside graph/degree protected', () => {
    const fused: AttributedResult[] = [
      make('v1', 0.90, ['vector']),
      // graph + degree + fts: a real lexical channel surfaced it too, so it is
      // baseline-protected and keeps its slot.
      make('mix', 0.85, ['keyword', 'graph', 'degree', 'fts', 'bm25']),
      make('gd1', 0.80, ['graph', 'degree']),
    ];

    const { results, graphAdditive } = applyGraphAdditiveRecall(fused, true);

    expect(graphAdditive.reservedCount).toBe(1);
    expect(ids(results)).toEqual(['v1', 'mix', 'gd1']);
  });

  it('keeps multi-source (graph + vector) candidates baseline-protected', () => {
    const fused: AttributedResult[] = [
      make('v1', 0.90, ['vector']),
      make('m1', 0.85, ['graph', 'vector']),
      make('g1', 0.80, ['graph']),
    ];

    const { results, graphAdditive } = applyGraphAdditiveRecall(fused, true);

    // Only g1 is graph-only; m1 earned its slot via vector too, so it stays.
    expect(graphAdditive.reservedCount).toBe(1);
    expect(ids(results)).toEqual(['v1', 'm1', 'g1']);
  });

  it('still recalls the graph-only candidate when the window extends past baseline', () => {
    const LIMIT = 5;
    const fused: AttributedResult[] = [
      make('v1', 0.90, ['vector']),
      make('g1', 0.80, ['graph']),
      make('v2', 0.70, ['fts']),
    ];

    const { results } = applyGraphAdditiveRecall(fused, true);

    // Additive, not subtractive: g1 is still recalled inside a window that has
    // room for it after the baseline hits.
    expect(ids(results, LIMIT)).toContain('g1');
    expect(results).toHaveLength(3);
  });

  it('flag OFF returns the list untouched (same reference, byte-identical order)', () => {
    const fused: AttributedResult[] = [
      make('v1', 0.90, ['vector']),
      make('g1', 0.80, ['graph']),
      make('v2', 0.70, ['fts']),
    ];

    const { results, graphAdditive } = applyGraphAdditiveRecall(fused, false);

    expect(graphAdditive.applied).toBe(false);
    // Same array reference — no reallocation on the disabled path.
    expect(results).toBe(fused);
    expect(ids(results)).toEqual(['v1', 'g1', 'v2']);
  });

  it('is a no-op when there are no graph-only candidates', () => {
    const fused: AttributedResult[] = [
      make('v1', 0.90, ['vector']),
      make('m1', 0.85, ['graph', 'vector']),
      make('v2', 0.70, ['fts']),
    ];

    const { results, graphAdditive } = applyGraphAdditiveRecall(fused, true);

    expect(graphAdditive.applied).toBe(true);
    expect(graphAdditive.reservedCount).toBe(0);
    expect(results).toBe(fused);
  });

  it('handles an empty list without crashing', () => {
    const { results, graphAdditive } = applyGraphAdditiveRecall([], true);
    expect(results).toEqual([]);
    expect(graphAdditive.reservedCount).toBe(0);
    expect(graphAdditive.baselineCount).toBe(0);
  });
});

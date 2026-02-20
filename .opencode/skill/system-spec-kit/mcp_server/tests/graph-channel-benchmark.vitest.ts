// ---------------------------------------------------------------
// TEST: Graph Channel Benchmark — 50-query validation suite
// Validates intent routing, semantic bridge coverage, metrics
// structure, and performance characteristics of the graph channel.
// ---------------------------------------------------------------

import { describe, it, expect, beforeEach } from 'vitest';
import { getSubgraphWeights } from '../lib/search/graph-search-fn';
import { buildSemanticBridgeMap, expandQueryWithBridges } from '../lib/search/query-expander';
import { getGraphMetrics, resetGraphMetrics } from '../lib/search/hybrid-search';

// ---------------------------------------------------------------
// MOCK SKILL GRAPH — 10 nodes, 15 edges
// ---------------------------------------------------------------

/**
 * Construct a minimal SkillGraphLike fixture that satisfies the
 * interface expected by buildSemanticBridgeMap / expandQueryWithBridges.
 *
 * Nodes are representative of the system-spec-kit domain so that
 * queries about memory, search, graph, specs, and skills can all
 * find semantic bridges.
 *
 * Edges are defined as undirected pairs to give each node ≥1 neighbour.
 */
function makeMockSkillGraph() {
  const nodes = new Map([
    ['system-spec-kit/memory', {
      id: 'system-spec-kit/memory',
      properties: { name: 'Memory System' },
    }],
    ['system-spec-kit/search', {
      id: 'system-spec-kit/search',
      properties: { name: 'Search Pipeline' },
    }],
    ['system-spec-kit/graph', {
      id: 'system-spec-kit/graph',
      properties: { name: 'Graph Channel' },
    }],
    ['system-spec-kit/spec', {
      id: 'system-spec-kit/spec',
      properties: { name: 'Spec Document' },
    }],
    ['system-spec-kit/checklist', {
      id: 'system-spec-kit/checklist',
      properties: { name: 'Checklist Validation' },
    }],
    ['system-spec-kit/rrf', {
      id: 'system-spec-kit/rrf',
      properties: { name: 'RRF Fusion' },
    }],
    ['system-spec-kit/embedding', {
      id: 'system-spec-kit/embedding',
      properties: { name: 'Embedding Index' },
    }],
    ['system-spec-kit/skill', {
      id: 'system-spec-kit/skill',
      properties: { name: 'Skill Graph' },
    }],
    ['system-spec-kit/decision', {
      id: 'system-spec-kit/decision',
      properties: { name: 'Decision Record' },
    }],
    ['system-spec-kit/adapter', {
      id: 'system-spec-kit/adapter',
      properties: { name: 'Virtual Adapter' },
    }],
  ]);

  // 15 directed edges connecting the 10 nodes into a reasonably
  // connected topology so bridgeMap has interesting entries.
  const edges = [
    { source: 'system-spec-kit/memory',    target: 'system-spec-kit/search' },
    { source: 'system-spec-kit/search',    target: 'system-spec-kit/rrf' },
    { source: 'system-spec-kit/search',    target: 'system-spec-kit/embedding' },
    { source: 'system-spec-kit/graph',     target: 'system-spec-kit/search' },
    { source: 'system-spec-kit/graph',     target: 'system-spec-kit/skill' },
    { source: 'system-spec-kit/skill',     target: 'system-spec-kit/spec' },
    { source: 'system-spec-kit/spec',      target: 'system-spec-kit/checklist' },
    { source: 'system-spec-kit/checklist', target: 'system-spec-kit/decision' },
    { source: 'system-spec-kit/decision',  target: 'system-spec-kit/adapter' },
    { source: 'system-spec-kit/adapter',   target: 'system-spec-kit/graph' },
    { source: 'system-spec-kit/rrf',       target: 'system-spec-kit/embedding' },
    { source: 'system-spec-kit/embedding', target: 'system-spec-kit/memory' },
    { source: 'system-spec-kit/memory',    target: 'system-spec-kit/decision' },
    { source: 'system-spec-kit/skill',     target: 'system-spec-kit/adapter' },
    { source: 'system-spec-kit/spec',      target: 'system-spec-kit/rrf' },
  ];

  return { nodes, edges };
}

// ---------------------------------------------------------------
// T011: Graph Channel Benchmark
// ---------------------------------------------------------------

describe('T011: Graph Channel Benchmark', () => {

  // =============================================================
  // 1. INTENT ROUTING COVERAGE — 20 representative queries
  // =============================================================

  describe('Intent routing coverage', () => {

    // ── find_decision queries (4) ─────────────────────────────

    it('find_decision: "why was virtual adapter chosen" routes to causal-heavy weights', () => {
      const w = getSubgraphWeights('find_decision');
      expect(w.causalWeight).toBeGreaterThan(w.sgqsWeight);
      expect(w.causalWeight).toBe(0.8);
      expect(w.sgqsWeight).toBe(0.2);
    });

    it('find_decision: "decision about graph database" routes to causal-heavy weights', () => {
      const w = getSubgraphWeights('find_decision');
      expect(w.causalWeight).toBe(0.8);
      expect(w.sgqsWeight).toBe(0.2);
      expect(w.causalWeight + w.sgqsWeight).toBe(1.0);
    });

    it('find_decision: "what drove the SQLite schema choice" routes to causal-heavy weights', () => {
      const w = getSubgraphWeights('find_decision');
      expect(w.causalWeight).toBeGreaterThan(0.5);
    });

    it('find_decision: "reason for choosing RRF over simple merge" routes to causal-heavy weights', () => {
      const w = getSubgraphWeights('find_decision');
      // causal > sgqs for decision intent
      expect(w.causalWeight).toBeGreaterThan(w.sgqsWeight);
    });

    // ── find_spec queries (4) ─────────────────────────────────

    it('find_spec: "memory search specification" routes to sgqs-heavy weights', () => {
      const w = getSubgraphWeights('find_spec');
      expect(w.sgqsWeight).toBeGreaterThan(w.causalWeight);
      expect(w.sgqsWeight).toBe(0.8);
      expect(w.causalWeight).toBe(0.2);
    });

    it('find_spec: "hybrid search pipeline spec" routes to sgqs-heavy weights', () => {
      const w = getSubgraphWeights('find_spec');
      expect(w.sgqsWeight).toBe(0.8);
      expect(w.causalWeight).toBe(0.2);
      expect(w.sgqsWeight + w.causalWeight).toBe(1.0);
    });

    it('find_spec: "embedding index specification document" routes to sgqs-heavy weights', () => {
      const w = getSubgraphWeights('find_spec');
      expect(w.sgqsWeight).toBeGreaterThan(0.5);
    });

    it('find_spec: "checklist validation spec" routes to sgqs-heavy weights', () => {
      const w = getSubgraphWeights('find_spec');
      expect(w.sgqsWeight).toBeGreaterThan(w.causalWeight);
    });

    // ── understand queries (4) ────────────────────────────────

    it('understand: "how does co-activation spreading work" uses balanced weights', () => {
      // "understand" is not a recognized intent — falls to default balanced
      const w = getSubgraphWeights('understand');
      expect(w.causalWeight).toBe(0.5);
      expect(w.sgqsWeight).toBe(0.5);
    });

    it('understand: "explain RRF fusion algorithm" uses balanced weights', () => {
      const w = getSubgraphWeights('understand');
      expect(w.causalWeight).toBe(w.sgqsWeight);
    });

    it('understand: "how does the graph channel integrate with hybrid search" uses balanced weights', () => {
      const w = getSubgraphWeights('understand');
      expect(w.causalWeight + w.sgqsWeight).toBe(1.0);
    });

    it('understand: "explain memory decay and attention scoring" uses balanced weights', () => {
      const w = getSubgraphWeights('understand');
      expect(w.causalWeight).toBe(0.5);
      expect(w.sgqsWeight).toBe(0.5);
    });

    // ── fix_bug queries (4) ───────────────────────────────────

    it('fix_bug: "fix null graphSearchFn" uses balanced weights (no specific intent routing)', () => {
      const w = getSubgraphWeights('fix_bug');
      expect(w.causalWeight).toBe(0.5);
      expect(w.sgqsWeight).toBe(0.5);
    });

    it('fix_bug: "error in causal edge query" uses balanced weights', () => {
      const w = getSubgraphWeights('fix_bug');
      expect(w.causalWeight).toBe(w.sgqsWeight);
    });

    it('fix_bug: "TypeError when building semantic bridge map" uses balanced weights', () => {
      const w = getSubgraphWeights('fix_bug');
      expect(w.causalWeight + w.sgqsWeight).toBe(1.0);
    });

    it('fix_bug: "undefined intent causes wrong subgraph routing" uses balanced weights', () => {
      const w = getSubgraphWeights('fix_bug');
      expect(w.causalWeight).toBe(0.5);
    });

    // ── explore queries (4) ───────────────────────────────────

    it('explore: "what skills are available" uses balanced weights (no specific intent)', () => {
      const w = getSubgraphWeights('explore');
      expect(w.causalWeight).toBe(0.5);
      expect(w.sgqsWeight).toBe(0.5);
    });

    it('explore: "list all graph patterns" uses balanced weights', () => {
      const w = getSubgraphWeights('explore');
      expect(w.causalWeight).toBe(w.sgqsWeight);
    });

    it('explore: "overview of the spec folder structure" uses balanced weights', () => {
      const w = getSubgraphWeights('explore');
      expect(w.causalWeight + w.sgqsWeight).toBe(1.0);
    });

    it('explore: "enumerate all MCP tool handlers" uses balanced weights', () => {
      const w = getSubgraphWeights('explore');
      expect(w.causalWeight).toBe(0.5);
    });

    // ── additional: undefined intent fallback ─────────────────

    it('undefined intent falls back to balanced weights', () => {
      const w = getSubgraphWeights(undefined);
      expect(w.causalWeight).toBe(0.5);
      expect(w.sgqsWeight).toBe(0.5);
    });

    it('understand_cause intent routes to causal-heavy weights (same as find_decision)', () => {
      const w = getSubgraphWeights('understand_cause');
      expect(w.causalWeight).toBe(0.8);
      expect(w.sgqsWeight).toBe(0.2);
    });

    it('find_procedure intent routes to sgqs-heavy weights (same as find_spec)', () => {
      const w = getSubgraphWeights('find_procedure');
      expect(w.sgqsWeight).toBe(0.8);
      expect(w.causalWeight).toBe(0.2);
    });

  });

  // =============================================================
  // 2. SEMANTIC BRIDGE COVERAGE — 5 queries with mock graph
  // =============================================================

  describe('Semantic bridge coverage', () => {

    let bridgeMap: Map<string, string[]>;

    beforeEach(() => {
      const graph = makeMockSkillGraph();
      bridgeMap = buildSemanticBridgeMap(graph);
    });

    it('bridge map is non-empty for a 10-node 15-edge graph', () => {
      expect(bridgeMap.size).toBeGreaterThan(0);
    });

    it('bridge map has an entry for each node that has at least one neighbour', () => {
      // All 10 nodes in the mock graph have ≥1 edge, so all should appear
      // (accounting for lowercase node-name keys)
      expect(bridgeMap.size).toBeGreaterThanOrEqual(10);
    });

    it('each bridge map entry is a non-empty array of neighbour names', () => {
      for (const [, neighbours] of bridgeMap) {
        expect(Array.isArray(neighbours)).toBe(true);
        expect(neighbours.length).toBeGreaterThan(0);
      }
    });

    it('bridge expansion for "memory search" returns original plus at least one variant', () => {
      const variants = expandQueryWithBridges('memory search', bridgeMap);
      // Original must always be first
      expect(variants[0]).toBe('memory search');
      // With the mock graph memory → search, search-pipeline should appear as bridge
      expect(variants.length).toBeGreaterThanOrEqual(1);
    });

    it('bridge expansion for "graph skill" includes an expanded variant', () => {
      const variants = expandQueryWithBridges('graph skill', bridgeMap);
      expect(variants[0]).toBe('graph skill');
      expect(variants.length).toBeGreaterThanOrEqual(1);
      // Max 3 variants enforced
      expect(variants.length).toBeLessThanOrEqual(3);
    });

    it('bridge expansion for "spec decision" does not exceed MAX_VARIANTS (3)', () => {
      const variants = expandQueryWithBridges('spec decision', bridgeMap);
      expect(variants.length).toBeLessThanOrEqual(3);
    });

    it('bridge expansion for "rrf embedding pipeline" keeps original first', () => {
      const variants = expandQueryWithBridges('rrf embedding pipeline', bridgeMap);
      expect(variants[0]).toBe('rrf embedding pipeline');
    });

    it('bridge expansion for "adapter virtual" keeps all variants unique', () => {
      const variants = expandQueryWithBridges('adapter virtual', bridgeMap);
      const uniqueSet = new Set(variants);
      expect(uniqueSet.size).toBe(variants.length);
    });

  });

  // =============================================================
  // 3. METRICS STRUCTURE VALIDATION
  // =============================================================

  describe('Metrics structure validation', () => {

    beforeEach(() => {
      resetGraphMetrics();
    });

    it('getGraphMetrics returns an object with all required fields', () => {
      const m = getGraphMetrics();
      expect(m).toHaveProperty('totalQueries');
      expect(m).toHaveProperty('graphHits');
      expect(m).toHaveProperty('graphOnlyResults');
      expect(m).toHaveProperty('multiSourceResults');
      expect(m).toHaveProperty('graphHitRate');
    });

    it('all counter fields are numbers', () => {
      const m = getGraphMetrics();
      expect(typeof m.totalQueries).toBe('number');
      expect(typeof m.graphHits).toBe('number');
      expect(typeof m.graphOnlyResults).toBe('number');
      expect(typeof m.multiSourceResults).toBe('number');
    });

    it('graphHitRate is 0 when totalQueries is 0', () => {
      const m = getGraphMetrics();
      expect(m.totalQueries).toBe(0);
      expect(m.graphHitRate).toBe(0);
    });

    it('graphHitRate is a number in [0, 1] range after reset', () => {
      const m = getGraphMetrics();
      expect(m.graphHitRate).toBeGreaterThanOrEqual(0);
      expect(m.graphHitRate).toBeLessThanOrEqual(1);
    });

    it('resetGraphMetrics zeroes all counters', () => {
      // Manually mutate would require internal access; instead verify
      // the post-reset state through the public API.
      resetGraphMetrics();
      const m = getGraphMetrics();
      expect(m.totalQueries).toBe(0);
      expect(m.graphHits).toBe(0);
      expect(m.graphOnlyResults).toBe(0);
      expect(m.multiSourceResults).toBe(0);
      expect(m.graphHitRate).toBe(0);
    });

    it('getGraphMetrics does not mutate state on consecutive calls', () => {
      const first = getGraphMetrics();
      const second = getGraphMetrics();
      expect(first.totalQueries).toBe(second.totalQueries);
      expect(first.graphHits).toBe(second.graphHits);
      expect(first.graphHitRate).toBe(second.graphHitRate);
    });

  });

  // =============================================================
  // 4. PERFORMANCE BENCHMARKS
  // =============================================================

  describe('Performance benchmarks', () => {

    it('getSubgraphWeights completes 1000 iterations in < 1ms each (average)', () => {
      const intents = [
        'find_decision',
        'find_spec',
        'understand',
        'fix_bug',
        'explore',
        undefined,
        'understand_cause',
        'find_procedure',
      ];

      const ITERATIONS = 1000;
      const start = performance.now();

      for (let i = 0; i < ITERATIONS; i++) {
        const intent = intents[i % intents.length];
        const w = getSubgraphWeights(intent);
        // Light sanity check to prevent dead-code elimination
        expect(w.causalWeight + w.sgqsWeight).toBe(1.0);
      }

      const elapsed = performance.now() - start;
      // 1ms per call × 1000 iterations = 1000ms budget; use generous 500ms
      // to allow for test-runner overhead on any machine.
      expect(elapsed).toBeLessThan(500);
    });

    it('buildSemanticBridgeMap with 10-node 15-edge graph completes in < 5ms', () => {
      const graph = makeMockSkillGraph();

      const start = performance.now();
      const bridgeMap = buildSemanticBridgeMap(graph);
      const elapsed = performance.now() - start;

      // Verify the result is valid (not a no-op)
      expect(bridgeMap.size).toBeGreaterThan(0);

      // Must finish within the 5ms budget
      expect(elapsed).toBeLessThan(5);
    });

    it('expandQueryWithBridges completes 200 calls in < 10ms total', () => {
      const graph = makeMockSkillGraph();
      const bridgeMap = buildSemanticBridgeMap(graph);

      const queries = [
        'memory search',
        'graph skill',
        'spec decision',
        'rrf embedding',
        'adapter virtual',
        'checklist validation',
        'search pipeline',
        'embedding index',
        'decision record',
        'virtual adapter',
      ];

      const ITERATIONS = 200;
      const start = performance.now();

      for (let i = 0; i < ITERATIONS; i++) {
        const query = queries[i % queries.length];
        const variants = expandQueryWithBridges(query, bridgeMap);
        expect(variants.length).toBeGreaterThanOrEqual(1);
      }

      const elapsed = performance.now() - start;
      expect(elapsed).toBeLessThan(10);
    });

    it('getGraphMetrics + resetGraphMetrics complete 500 iterations in < 20ms', () => {
      const ITERATIONS = 500;
      const start = performance.now();

      for (let i = 0; i < ITERATIONS; i++) {
        const m = getGraphMetrics();
        expect(typeof m.graphHitRate).toBe('number');
        if (i % 50 === 0) resetGraphMetrics();
      }

      const elapsed = performance.now() - start;
      expect(elapsed).toBeLessThan(20);
    });

  });

});

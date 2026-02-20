// ---------------------------------------------------------------
// TEST: Semantic Bridge Discovery (C138 T010 — Pattern 4)
// buildSemanticBridgeMap and expandQueryWithBridges from query-expander
// ---------------------------------------------------------------

import { describe, it, expect } from 'vitest';
import {
  buildSemanticBridgeMap,
  expandQueryWithBridges,
} from '../lib/search/query-expander';

/* ---------------------------------------------------------------
   HELPERS
   --------------------------------------------------------------- */

/**
 * Builds a small test graph with 3 nodes and 2 edges:
 *   memory-system → retrieval-pipeline → search-index
 */
function createTestGraph() {
  const nodes = new Map([
    ['memory-system', {
      id: 'memory-system',
      properties: { name: 'Memory System' },
    }],
    ['retrieval-pipeline', {
      id: 'retrieval-pipeline',
      properties: { name: 'Retrieval Pipeline' },
    }],
    ['search-index', {
      id: 'search-index',
      properties: { name: 'Search Index' },
    }],
  ]);

  const edges = [
    { source: 'memory-system', target: 'retrieval-pipeline' },
    { source: 'retrieval-pipeline', target: 'search-index' },
  ];

  return { nodes, edges };
}

/* ---------------------------------------------------------------
   TESTS: buildSemanticBridgeMap
   --------------------------------------------------------------- */

describe('buildSemanticBridgeMap', () => {

  // ---- T1: Connected nodes produce bridge entries for both ends ----
  it('T1: two connected nodes return bridge entries for both', () => {
    const graph = createTestGraph();
    const bridgeMap = buildSemanticBridgeMap(graph);

    // memory-system is connected to retrieval-pipeline
    expect(bridgeMap.has('memory system')).toBe(true);
    expect(bridgeMap.get('memory system')).toContain('retrieval pipeline');

    // retrieval-pipeline is connected to both memory-system and search-index
    expect(bridgeMap.has('retrieval pipeline')).toBe(true);
    const retrievalBridges = bridgeMap.get('retrieval pipeline')!;
    expect(retrievalBridges).toContain('memory system');
    expect(retrievalBridges).toContain('search index');
  });

  // ---- T2: Isolated node (no edges) does not appear in bridge map ----
  it('T2: isolated node with no edges returns empty map', () => {
    const nodes = new Map([
      ['isolated-node', {
        id: 'isolated-node',
        properties: { name: 'Isolated Node' },
      }],
    ]);
    const graph = { nodes, edges: [] };

    const bridgeMap = buildSemanticBridgeMap(graph);

    expect(bridgeMap.size).toBe(0);
  });

  // ---- T3: Empty graph returns empty map ----
  it('T3: empty graph returns empty map', () => {
    const graph = { nodes: new Map(), edges: [] };

    const bridgeMap = buildSemanticBridgeMap(graph);

    expect(bridgeMap.size).toBe(0);
  });

});

/* ---------------------------------------------------------------
   TESTS: expandQueryWithBridges
   --------------------------------------------------------------- */

describe('expandQueryWithBridges', () => {

  // ---- T4: Query word matching a bridge entry is replaced with the first synonym ----
  it('T4: replaces matching word with first bridge synonym', () => {
    // expandQueryWithBridges tokenises the query into individual words and looks
    // up each word as a key in bridgeMap.  Supply single-word keys so the lookup
    // actually hits.
    const bridgeMap = new Map<string, string[]>([
      ['memory',    ['retrieval', 'search-index']],
      ['retrieval', ['memory', 'search-index']],
    ]);

    const variants = expandQueryWithBridges('memory retrieval', bridgeMap);

    // Original query is always first
    expect(variants[0]).toBe('memory retrieval');
    // At least one variant should differ from the original
    expect(variants.length).toBeGreaterThan(1);
    // The first expansion should replace "memory" with its first synonym "retrieval"
    expect(variants).toContain('retrieval retrieval');
  });

  // ---- T5: Query with no matching bridges returns only the original ----
  it('T5: no matching bridges returns only original query', () => {
    const bridgeMap = new Map<string, string[]>([
      ['memory system', ['retrieval pipeline']],
    ]);

    const variants = expandQueryWithBridges('deploy configuration settings', bridgeMap);

    expect(variants).toHaveLength(1);
    expect(variants[0]).toBe('deploy configuration settings');
  });

  // ---- T6: Returns at most 3 variants regardless of how many bridges match ----
  it('T6: returns at most 3 variants', () => {
    // Build a bridge map where every word in the query has a bridge
    const bridgeMap = new Map<string, string[]>([
      ['alpha', ['a-bridge']],
      ['beta',  ['b-bridge']],
      ['gamma', ['c-bridge']],
      ['delta', ['d-bridge']],
    ]);

    const variants = expandQueryWithBridges('alpha beta gamma delta', bridgeMap);

    expect(variants.length).toBeLessThanOrEqual(3);
  });

});

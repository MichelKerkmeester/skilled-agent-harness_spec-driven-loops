// @ts-nocheck
// ---------------------------------------------------------------
// TEST: Pattern Implementations (Phase 2+)
// T012 Graph-Guided MMR
// T013 Structural Authority
// T014 Evidence Gap Prevention
// T015 Context Budget
// T016 Temporal-Structural Coherence
// ---------------------------------------------------------------

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// ===============================================================
// SECTION 1: GRAPH-GUIDED MMR (T012) — mmr-reranker.ts
// ===============================================================

describe('T012: Graph-Guided MMR (mmr-reranker)', () => {
  // ─────────────────────────────────────────────────────────
  // Helpers
  // ─────────────────────────────────────────────────────────

  function makeGraph(edges: Array<[string, string]>) {
    const outbound = new Map<string, string[]>();
    const nodes = new Map<string, any>();

    // Collect all node ids from edges
    for (const [src, tgt] of edges) {
      if (!nodes.has(src)) nodes.set(src, { id: src, labels: [], properties: {}, path: src });
      if (!nodes.has(tgt)) nodes.set(tgt, { id: tgt, labels: [], properties: {}, path: tgt });
      if (!outbound.has(src)) outbound.set(src, []);
      outbound.get(src)!.push(tgt);
    }

    return { nodes, edges: edges.map(([s, t]) => ({ source: s, target: t })), outbound };
  }

  function makeEmbedding(values: number[]): Float32Array {
    return new Float32Array(values);
  }

  function makeCandidate(id: string, score: number, embedding: number[]): any {
    return { id, score, embedding: makeEmbedding(embedding) };
  }

  // ─────────────────────────────────────────────────────────
  // computeGraphDistance tests
  // ─────────────────────────────────────────────────────────

  describe('computeGraphDistance', () => {
    let computeGraphDistance: typeof import('../lib/search/mmr-reranker').computeGraphDistance;
    let MAX_DIST: number;

    beforeEach(async () => {
      const mod = await import('../lib/search/mmr-reranker');
      computeGraphDistance = mod.computeGraphDistance;
      MAX_DIST = mod.MAX_DIST;
    });

    it('returns 0 when source and target are the same node', () => {
      const graph = makeGraph([['A', 'B']]);
      expect(computeGraphDistance(graph, 'A', 'A')).toBe(0);
    });

    it('returns 1 for directly connected nodes', () => {
      // A -> B
      const graph = makeGraph([['A', 'B']]);
      expect(computeGraphDistance(graph, 'A', 'B')).toBe(1);
    });

    it('returns correct BFS shortest path: 2 hops (A->B->C)', () => {
      // A -> B -> C
      const graph = makeGraph([['A', 'B'], ['B', 'C']]);
      expect(computeGraphDistance(graph, 'A', 'C')).toBe(2);
    });

    it('returns correct BFS shortest path via multiple routes (picks shortest)', () => {
      // A -> B -> D  (length 2)
      // A -> C -> D  (length 2)
      // Direct A -> D would be length 1 if added; here we only have indirect
      const graph = makeGraph([['A', 'B'], ['A', 'C'], ['B', 'D'], ['C', 'D']]);
      expect(computeGraphDistance(graph, 'A', 'D')).toBe(2);
    });

    it('returns MAX_DIST for disconnected nodes (no path)', () => {
      // A -> B, but C is isolated
      const graph = makeGraph([['A', 'B']]);
      // Add isolated node C manually
      graph.nodes.set('C', { id: 'C', labels: [], properties: {}, path: 'C' });
      expect(computeGraphDistance(graph, 'A', 'C')).toBe(MAX_DIST);
    });

    it('returns MAX_DIST when source node does not exist in graph', () => {
      const graph = makeGraph([['A', 'B']]);
      expect(computeGraphDistance(graph, 'MISSING', 'B')).toBe(MAX_DIST);
    });

    it('returns MAX_DIST for reverse-direction in directed graph (no back edge)', () => {
      // A -> B but B has no outbound to A
      const graph = makeGraph([['A', 'B']]);
      expect(computeGraphDistance(graph, 'B', 'A')).toBe(MAX_DIST);
    });

    it('MAX_DIST exported constant is 10', () => {
      expect(MAX_DIST).toBe(10);
    });
  });

  // ─────────────────────────────────────────────────────────
  // applyMMR tests
  // ─────────────────────────────────────────────────────────

  describe('applyMMR', () => {
    let applyMMR: typeof import('../lib/search/mmr-reranker').applyMMR;

    beforeEach(async () => {
      // Reset env flag
      delete process.env.SPECKIT_GRAPH_MMR;
      vi.resetModules();
      const mod = await import('../lib/search/mmr-reranker');
      applyMMR = mod.applyMMR;
    });

    afterEach(() => {
      delete process.env.SPECKIT_GRAPH_MMR;
      vi.resetModules();
    });

    it('returns empty array when candidates is empty', () => {
      const result = applyMMR([], { lambda: 0.5, limit: 5 });
      expect(result).toEqual([]);
    });

    it('first selected result is always the highest-scoring candidate', () => {
      const candidates = [
        makeCandidate('low', 0.3, [1, 0, 0]),
        makeCandidate('high', 0.9, [0, 1, 0]),
        makeCandidate('mid', 0.6, [0, 0, 1]),
      ];
      const result = applyMMR(candidates, { lambda: 0.5, limit: 3 });
      expect(result[0].id).toBe('high');
    });

    it('respects the limit parameter', () => {
      const candidates = [
        makeCandidate('a', 0.9, [1, 0, 0]),
        makeCandidate('b', 0.8, [0, 1, 0]),
        makeCandidate('c', 0.7, [0, 0, 1]),
        makeCandidate('d', 0.6, [1, 1, 0]),
      ];
      const result = applyMMR(candidates, { lambda: 0.5, limit: 2 });
      expect(result.length).toBe(2);
    });

    it('with pure cosine (no graphDistanceFn): selects diverse results over redundant', () => {
      // Two nearly identical candidates (high cosine sim) plus one orthogonal
      // lambda=0.5 encourages diversity selection
      const candidates = [
        makeCandidate('topSimilar',  0.9, [1, 0, 0]),
        makeCandidate('similar',     0.85, [0.99, 0.01, 0]),  // very similar to topSimilar
        makeCandidate('diverse',     0.80, [0, 1, 0]),        // orthogonal to topSimilar
      ];
      // With lambda=0.5 the diverse candidate should beat similar
      const result = applyMMR(candidates, { lambda: 0.5, limit: 2 });
      expect(result[0].id).toBe('topSimilar');
      expect(result[1].id).toBe('diverse');
    });

    it('with graphDistanceFn and SPECKIT_GRAPH_MMR=true: uses graph diversity', async () => {
      process.env.SPECKIT_GRAPH_MMR = 'true';
      vi.resetModules();
      const freshMod = await import('../lib/search/mmr-reranker');
      const applyMMRFresh = freshMod.applyMMR;

      // A and B are adjacent (dist=1), A and C are far (dist=10)
      const graphDistanceFn = (idA: string, idB: string) => {
        if ((idA === 'a' && idB === 'b') || (idA === 'b' && idB === 'a')) return 1;
        return 10;
      };

      const candidates = [
        makeCandidate('a', 0.9, [1, 0, 0]),
        makeCandidate('b', 0.85, [0.98, 0.02, 0]), // very similar embedding, close in graph
        makeCandidate('c', 0.80, [0.01, 0.99, 0]), // different embedding, far in graph
      ];

      const result = applyMMRFresh(candidates, {
        lambda: 0.5,
        limit: 2,
        graphDistanceFn,
        graphAlpha: 0.5,
      });

      // 'a' is top pick, then 'c' should be preferred over 'b' because
      // graph distance (b is near a) increases diversity penalty
      expect(result[0].id).toBe('a');
      expect(result[1].id).toBe('c');
    });

    it('without graphDistanceFn: graph MMR is not active even if flag is true', async () => {
      process.env.SPECKIT_GRAPH_MMR = 'true';
      vi.resetModules();
      const freshMod = await import('../lib/search/mmr-reranker');
      const applyMMRFresh = freshMod.applyMMR;

      const candidates = [
        makeCandidate('a', 0.9, [1, 0, 0]),
        makeCandidate('b', 0.85, [0.99, 0, 0]),
        makeCandidate('c', 0.80, [0, 1, 0]),
      ];

      // No graphDistanceFn supplied → pure cosine MMR
      const result = applyMMRFresh(candidates, {
        lambda: 0.5,
        limit: 2,
        // graphDistanceFn deliberately absent
      });

      expect(result[0].id).toBe('a');
      expect(result.length).toBe(2);
    });

    it('maxCandidates cap limits the candidate pool', () => {
      const candidates = Array.from({ length: 25 }, (_, i) =>
        makeCandidate(`c${i}`, 1 - i * 0.01, [i % 2, (i + 1) % 2, 0])
      );
      // Default maxCandidates=20 → only top 20 are processed
      const result = applyMMR(candidates, { lambda: 0.8, limit: 25 });
      // Can return at most 20 (the maxCandidates cap)
      expect(result.length).toBeLessThanOrEqual(20);
    });
  });
});

// ===============================================================
// SECTION 2: STRUCTURAL AUTHORITY (T013) — graph-search-fn.ts
// ===============================================================

describe('T013: Structural Authority (computeAuthorityScores)', () => {
  let computeAuthorityScores: typeof import('../lib/search/graph-search-fn').computeAuthorityScores;

  function makeSkillGraph(
    nodeList: Array<{ id: string; labels: string[] }>,
    inboundMap: Record<string, string[]> = {}
  ): any {
    const nodes = new Map<string, any>();
    for (const n of nodeList) {
      nodes.set(n.id, {
        id: n.id,
        labels: n.labels,
        properties: {},
        skill: 'test',
        path: n.id,
      });
    }
    const inbound = new Map<string, string[]>(Object.entries(inboundMap));
    const outbound = new Map<string, string[]>();
    const edges: any[] = [];
    return { nodes, edges, outbound, inbound };
  }

  beforeEach(async () => {
    vi.mock('../lib/search/skill-graph-cache', () => ({
      skillGraphCache: { get: vi.fn().mockResolvedValue(null) },
    }));
    const mod = await import('../lib/search/graph-search-fn');
    computeAuthorityScores = mod.computeAuthorityScores;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns empty Map for empty graph', () => {
    const graph = makeSkillGraph([]);
    const result = computeAuthorityScores(graph);
    expect(result.size).toBe(0);
  });

  it(':Index nodes get 3.0x multiplier applied to authority score', () => {
    // Two nodes with equal in-degree; one is :Index, one is :Asset
    // Both have 1 inbound edge → normalized in-degree = 1/1 = 1
    const graph = makeSkillGraph(
      [
        { id: 'index-node', labels: [':Index'] },
        { id: 'asset-node', labels: [':Asset'] },
      ],
      {
        'index-node': ['some-parent'],
        'asset-node': ['some-parent'],
      }
    );

    const scores = computeAuthorityScores(graph);
    const indexScore = scores.get('index-node') ?? 0;
    const assetScore = scores.get('asset-node') ?? 0;

    // :Index multiplier = 3.0, :Asset multiplier = 0.3
    // With equal in-degree, :Index score should be exactly 10x :Asset score
    expect(indexScore).toBeGreaterThan(assetScore);
    if (assetScore > 0) {
      expect(indexScore / assetScore).toBeCloseTo(3.0 / 0.3, 5);
    }
  });

  it(':Asset nodes get 0.3x multiplier (lower than default 1.0)', () => {
    const graph = makeSkillGraph(
      [
        { id: 'asset-node', labels: [':Asset'] },
        { id: 'plain-node', labels: [':Node'] },
      ],
      {
        'asset-node': ['p1'],
        'plain-node': ['p2'],
      }
    );

    const scores = computeAuthorityScores(graph);
    const assetScore = scores.get('asset-node') ?? 0;
    const plainScore = scores.get('plain-node') ?? 0;

    expect(assetScore).toBeLessThan(plainScore);
  });

  it('higher in-degree gives higher authority score for same label type', () => {
    // Both are :Node but one has more inbound edges
    const graph = makeSkillGraph(
      [
        { id: 'hub', labels: [':Node'] },
        { id: 'leaf', labels: [':Node'] },
      ],
      {
        'hub':  ['a', 'b', 'c'],  // 3 inbound
        'leaf': ['a'],             // 1 inbound
      }
    );

    const scores = computeAuthorityScores(graph);
    const hubScore = scores.get('hub') ?? 0;
    const leafScore = scores.get('leaf') ?? 0;

    expect(hubScore).toBeGreaterThan(leafScore);
  });

  it('node with zero in-degree has authority score of 0', () => {
    // maxInDegree from the other node = 2; this node has 0
    const graph = makeSkillGraph(
      [
        { id: 'no-edges', labels: [':Node'] },
        { id: 'has-edges', labels: [':Node'] },
      ],
      {
        'has-edges': ['x', 'y'],
        // 'no-edges' deliberately absent from inboundMap
      }
    );

    const scores = computeAuthorityScores(graph);
    const zeroScore = scores.get('no-edges') ?? -1;

    expect(zeroScore).toBe(0);
  });

  it(':Entrypoint label gets 2.5x multiplier, which is between :Index (3.0) and :Node (1.0)', () => {
    const graph = makeSkillGraph(
      [
        { id: 'index-n',      labels: [':Index'] },
        { id: 'entrypoint-n', labels: [':Entrypoint'] },
        { id: 'plain-n',      labels: [':Node'] },
      ],
      {
        'index-n':      ['a', 'b', 'c'],
        'entrypoint-n': ['a', 'b', 'c'],
        'plain-n':      ['a', 'b', 'c'],
      }
    );

    const scores = computeAuthorityScores(graph);
    const indexS      = scores.get('index-n') ?? 0;
    const entryS      = scores.get('entrypoint-n') ?? 0;
    const plainS      = scores.get('plain-n') ?? 0;

    expect(indexS).toBeGreaterThan(entryS);
    expect(entryS).toBeGreaterThan(plainS);
  });

  it('handles nodes with unrecognised labels by using default 1.0 multiplier', () => {
    const graph = makeSkillGraph(
      [
        { id: 'unknown-label', labels: [':SomeRandomLabel'] },
        { id: 'known-node',    labels: [':Node'] },
      ],
      {
        'unknown-label': ['a'],
        'known-node':    ['a'],
      }
    );

    const scores = computeAuthorityScores(graph);
    // Both get multiplier 1.0, same in-degree → scores should be equal
    expect(scores.get('unknown-label')).toBeCloseTo(scores.get('known-node') ?? -1, 10);
  });
});

// ===============================================================
// SECTION 3: EVIDENCE GAP PREVENTION (T014) — evidence-gap-detector.ts
// ===============================================================

describe('T014: Evidence Gap Prevention (predictGraphCoverage)', () => {
  let predictGraphCoverage: typeof import('../lib/search/evidence-gap-detector').predictGraphCoverage;

  function makeEvidenceGraph(
    nodeList: Array<{ id: string; labels: string[] }>,
    inboundMap: Record<string, string[]> = {}
  ): any {
    const nodes = new Map<string, any>();
    for (const n of nodeList) {
      nodes.set(n.id, { id: n.id, labels: n.labels, properties: {} });
    }
    const inbound = new Map<string, string[]>(Object.entries(inboundMap));
    return { nodes, inbound };
  }

  beforeEach(async () => {
    delete process.env.SPECKIT_GRAPH_UNIFIED;
    vi.resetModules();
    const mod = await import('../lib/search/evidence-gap-detector');
    predictGraphCoverage = mod.predictGraphCoverage;
  });

  afterEach(() => {
    delete process.env.SPECKIT_GRAPH_UNIFIED;
    vi.resetModules();
  });

  it('returns safe default { earlyGap: false, connectedNodes: 0 } when flag is off', async () => {
    // Explicitly disable the flag (default is now enabled)
    process.env.SPECKIT_GRAPH_UNIFIED = 'false';
    vi.resetModules();
    const freshMod = await import('../lib/search/evidence-gap-detector');
    const fn = freshMod.predictGraphCoverage;
    const graph = makeEvidenceGraph([{ id: 'alpha', labels: [':Node'] }]);
    const result = fn('alpha query', graph);
    expect(result).toEqual({ earlyGap: false, connectedNodes: 0 });
  });

  it('returns earlyGap: true when flag is on but <3 connected memory nodes', async () => {
    process.env.SPECKIT_GRAPH_UNIFIED = 'true';
    vi.resetModules();
    const freshMod = await import('../lib/search/evidence-gap-detector');
    const fn = freshMod.predictGraphCoverage;

    // Node id matches query token "alpha"; it has 2 inbound memory nodes
    const graph = makeEvidenceGraph(
      [{ id: 'alpha', labels: [] }],
      { 'alpha': ['mem1', 'mem2'] }  // only 2 < MIN_GRAPH_MEMORY_NODES (3)
    );

    const result = fn('alpha', graph);
    expect(result.earlyGap).toBe(true);
    expect(result.connectedNodes).toBe(2);
  });

  it('returns earlyGap: false when flag is on and >=3 connected memory nodes', async () => {
    process.env.SPECKIT_GRAPH_UNIFIED = 'true';
    vi.resetModules();
    const freshMod = await import('../lib/search/evidence-gap-detector');
    const fn = freshMod.predictGraphCoverage;

    // Node id matches query token; it has 3 inbound memory nodes
    const graph = makeEvidenceGraph(
      [{ id: 'beta', labels: [] }],
      { 'beta': ['mem1', 'mem2', 'mem3'] }  // 3 == MIN_GRAPH_MEMORY_NODES
    );

    const result = fn('beta', graph);
    expect(result.earlyGap).toBe(false);
    expect(result.connectedNodes).toBe(3);
  });

  it('returns earlyGap: true for empty query when flag is on', async () => {
    process.env.SPECKIT_GRAPH_UNIFIED = 'true';
    vi.resetModules();
    const freshMod = await import('../lib/search/evidence-gap-detector');
    const fn = freshMod.predictGraphCoverage;

    const graph = makeEvidenceGraph([{ id: 'node1', labels: [] }]);
    const result = fn('', graph);
    expect(result.earlyGap).toBe(true);
    expect(result.connectedNodes).toBe(0);
  });

  it('returns earlyGap: true when no graph nodes match any query token', async () => {
    process.env.SPECKIT_GRAPH_UNIFIED = 'true';
    vi.resetModules();
    const freshMod = await import('../lib/search/evidence-gap-detector');
    const fn = freshMod.predictGraphCoverage;

    const graph = makeEvidenceGraph(
      [{ id: 'totally-unrelated', labels: [] }],
      { 'totally-unrelated': ['m1', 'm2', 'm3', 'm4'] }
    );

    const result = fn('zzz-no-match-xyz', graph);
    expect(result.earlyGap).toBe(true);
    expect(result.connectedNodes).toBe(0);
  });

  it('matches nodes by label token as well as id token', async () => {
    process.env.SPECKIT_GRAPH_UNIFIED = 'true';
    vi.resetModules();
    const freshMod = await import('../lib/search/evidence-gap-detector');
    const fn = freshMod.predictGraphCoverage;

    // Node id doesn't match but the label "workflow" matches the query
    const graph = makeEvidenceGraph(
      [{ id: 'node-xyz', labels: ['workflow'] }],
      { 'node-xyz': ['m1', 'm2', 'm3'] }
    );

    const result = fn('workflow steps', graph);
    expect(result.earlyGap).toBe(false);
    expect(result.connectedNodes).toBe(3);
  });

  it('correctly deduplicates connected memory nodes across multiple matched graph nodes', async () => {
    process.env.SPECKIT_GRAPH_UNIFIED = 'true';
    vi.resetModules();
    const freshMod = await import('../lib/search/evidence-gap-detector');
    const fn = freshMod.predictGraphCoverage;

    // Both node-a and node-b match the query; they share memory node m1
    const graph = makeEvidenceGraph(
      [
        { id: 'node-a', labels: [] },
        { id: 'node-b', labels: [] },
      ],
      {
        'node-a': ['m1', 'm2'],
        'node-b': ['m1', 'm3'],  // m1 is shared
      }
    );

    // "node" matches both node-a and node-b
    const result = fn('node', graph);
    // Distinct memory nodes: m1, m2, m3 = 3
    expect(result.connectedNodes).toBe(3);
    expect(result.earlyGap).toBe(false);
  });
});

// ===============================================================
// SECTION 4: CONTEXT BUDGET (T015) — context-budget.ts
// ===============================================================

describe('T015: Context Budget (estimateTokens + optimizeContextBudget)', () => {
  let estimateTokens: typeof import('../lib/search/context-budget').estimateTokens;
  let optimizeContextBudget: typeof import('../lib/search/context-budget').optimizeContextBudget;

  beforeEach(async () => {
    const mod = await import('../lib/search/context-budget');
    estimateTokens = mod.estimateTokens;
    optimizeContextBudget = mod.optimizeContextBudget;
  });

  // ─────────────────────────────────────────────────────────
  // estimateTokens
  // ─────────────────────────────────────────────────────────

  describe('estimateTokens', () => {
    it('returns 0 for undefined', () => {
      expect(estimateTokens(undefined)).toBe(0);
    });

    it('returns 0 for empty string', () => {
      expect(estimateTokens('')).toBe(0);
    });

    it('returns ceil(length / 4) for short string', () => {
      // "test" = 4 chars → 4/4 = 1 token
      expect(estimateTokens('test')).toBe(1);
    });

    it('returns ceil(5 / 4) = 2 for 5-char string', () => {
      expect(estimateTokens('hello')).toBe(2);
    });

    it('returns ceil(12 / 4) = 3 for 12-char string', () => {
      expect(estimateTokens('abcdefghijkl')).toBe(3);
    });

    it('returns ceil(13 / 4) = 4 for 13-char string (round up)', () => {
      expect(estimateTokens('abcdefghijklm')).toBe(4);
    });

    it('correctly handles exactly 100 chars', () => {
      const s = 'a'.repeat(100);
      expect(estimateTokens(s)).toBe(25); // 100/4 = 25 exactly
    });

    it('rounds up for non-divisible lengths', () => {
      const s = 'a'.repeat(101);
      expect(estimateTokens(s)).toBe(26); // ceil(101/4) = 26
    });
  });

  // ─────────────────────────────────────────────────────────
  // optimizeContextBudget
  // ─────────────────────────────────────────────────────────

  describe('optimizeContextBudget', () => {
    it('returns empty array for empty input', () => {
      expect(optimizeContextBudget([])).toEqual([]);
    });

    it('falls back to score-only when no result has graphRegion', () => {
      const results = [
        { id: 'a', score: 0.9, tokens: 10 },
        { id: 'b', score: 0.8, tokens: 10 },
        { id: 'c', score: 0.7, tokens: 10 },
      ];
      const selected = optimizeContextBudget(results, 25);
      // Score-sorted: a(10), b(10) = 20 tokens used; c(10) would hit 30 > 25
      expect(selected.map(r => r.id)).toEqual(['a', 'b']);
    });

    it('respects token budget limit and stops before exceeding it', () => {
      const results = [
        { id: 'big', score: 0.9, tokens: 1800 },
        { id: 'small', score: 0.8, tokens: 100 },
      ];
      const selected = optimizeContextBudget(results, 2000);
      const usedTokens = selected.reduce((sum, r) => sum + (r.tokens ?? 0), 0);
      expect(usedTokens).toBeLessThanOrEqual(2000);
    });

    it('prefers unseen-region result over already-seen-region result when score is above threshold', () => {
      // region-A already seen (top scorer), then we have two remaining:
      //   region-A duplicate (score 0.85) and region-B new (score 0.80)
      // REGION_DIVERSITY_THRESHOLD = 0.5; 0.80 > 0.85 * 0.5 = 0.425 → unseen preferred
      const results = [
        { id: 'a1', score: 0.90, tokens: 10, graphRegion: 'region-A' },
        { id: 'a2', score: 0.85, tokens: 10, graphRegion: 'region-A' },
        { id: 'b1', score: 0.80, tokens: 10, graphRegion: 'region-B' },
      ];
      const selected = optimizeContextBudget(results, 50);
      const ids = selected.map(r => r.id);

      // a1 is first (highest score); b1 (unseen region) should come before a2
      expect(ids[0]).toBe('a1');
      expect(ids.indexOf('b1')).toBeLessThan(ids.indexOf('a2'));
    });

    it('does not prefer unseen region result when its score is below diversity threshold', () => {
      // region-A already seen; region-B candidate score (0.1) is well below threshold
      // 0.1 < 0.8 * 0.5 = 0.4 → score fallback takes a2 first
      const results = [
        { id: 'a1', score: 0.90, tokens: 10, graphRegion: 'region-A' },
        { id: 'a2', score: 0.80, tokens: 10, graphRegion: 'region-A' },
        { id: 'b1', score: 0.10, tokens: 10, graphRegion: 'region-B' },
      ];
      const selected = optimizeContextBudget(results, 50);
      const ids = selected.map(r => r.id);

      expect(ids[0]).toBe('a1');
      // a2's score (0.80) greatly exceeds threshold over b1; a2 comes second
      expect(ids[1]).toBe('a2');
    });

    it('uses estimateTokens from content when tokens field is absent', () => {
      const content = 'a'.repeat(400); // 400 chars = 100 tokens
      const results = [
        { id: 'a', score: 0.9, content },  // 100 tokens
        { id: 'b', score: 0.8, content },  // 100 tokens
      ];
      const selected = optimizeContextBudget(results, 150); // fits 1 item (100 tokens)
      expect(selected.length).toBe(1);
      expect(selected[0].id).toBe('a');
    });

    it('single result that exceeds budget is excluded', () => {
      const results = [
        { id: 'a', score: 0.9, tokens: 2001 },
      ];
      const selected = optimizeContextBudget(results, 2000);
      expect(selected).toEqual([]);
    });

    it('selects distinct regions when multiple regions are available within budget', () => {
      const results = [
        { id: 'r1', score: 0.9,  tokens: 5, graphRegion: 'region-1' },
        { id: 'r2', score: 0.88, tokens: 5, graphRegion: 'region-2' },
        { id: 'r3', score: 0.86, tokens: 5, graphRegion: 'region-3' },
        { id: 'r4', score: 0.85, tokens: 5, graphRegion: 'region-1' }, // duplicate region
      ];
      const selected = optimizeContextBudget(results, 30); // budget for 6 items
      const regions = selected.map(r => r.graphRegion);
      // All 4 fit within budget; all 3 distinct regions should be represented
      const uniqueRegions = new Set(regions);
      expect(uniqueRegions.size).toBeGreaterThanOrEqual(3);
    });
  });
});

// ===============================================================
// SECTION 5: TEMPORAL-STRUCTURAL COHERENCE (T016) — fsrs.ts
// ===============================================================

describe('T016: Temporal-Structural Coherence (computeStructuralFreshness + computeGraphCentrality)', () => {
  let computeStructuralFreshness: typeof import('../lib/search/fsrs').computeStructuralFreshness;
  let computeGraphCentrality: typeof import('../lib/search/fsrs').computeGraphCentrality;

  function makeGraph(
    nodeIds: string[],
    inboundMap: Record<string, string[]> = {},
    outboundMap: Record<string, string[]> = {}
  ): any {
    const nodes = new Map<string, unknown>();
    for (const id of nodeIds) {
      nodes.set(id, { id });
    }
    const inbound  = new Map<string, string[]>(Object.entries(inboundMap));
    const outbound = new Map<string, string[]>(Object.entries(outboundMap));
    return { nodes, inbound, outbound };
  }

  beforeEach(async () => {
    const mod = await import('../lib/search/fsrs');
    computeStructuralFreshness = mod.computeStructuralFreshness;
    computeGraphCentrality    = mod.computeGraphCentrality;
  });

  // ─────────────────────────────────────────────────────────
  // computeStructuralFreshness
  // ─────────────────────────────────────────────────────────

  describe('computeStructuralFreshness', () => {
    it('computeStructuralFreshness(1.0, 1.0) = 1.0', () => {
      expect(computeStructuralFreshness(1.0, 1.0)).toBe(1.0);
    });

    it('computeStructuralFreshness(0.5, 0.5) = 0.25', () => {
      expect(computeStructuralFreshness(0.5, 0.5)).toBe(0.25);
    });

    it('computeStructuralFreshness(0.0, 1.0) = 0.0', () => {
      expect(computeStructuralFreshness(0.0, 1.0)).toBe(0.0);
    });

    it('computeStructuralFreshness(1.0, 0.0) = 0.0', () => {
      expect(computeStructuralFreshness(1.0, 0.0)).toBe(0.0);
    });

    it('clamps stability > 1 to 1.0', () => {
      // stability=2.0 clamped to 1.0; centrality=0.5 → 1.0 * 0.5 = 0.5
      expect(computeStructuralFreshness(2.0, 0.5)).toBeCloseTo(0.5);
    });

    it('clamps centrality > 1 to 1.0', () => {
      // stability=0.5; centrality=5.0 clamped to 1.0 → 0.5 * 1.0 = 0.5
      expect(computeStructuralFreshness(0.5, 5.0)).toBeCloseTo(0.5);
    });

    it('clamps negative stability to 0', () => {
      expect(computeStructuralFreshness(-0.5, 0.8)).toBe(0.0);
    });

    it('clamps negative centrality to 0', () => {
      expect(computeStructuralFreshness(0.8, -0.5)).toBe(0.0);
    });

    it('result is always in [0, 1]', () => {
      const pairs = [[0.3, 0.7], [0.9, 0.2], [0.1, 0.1], [1.0, 1.0], [0.0, 0.0]];
      for (const [s, c] of pairs) {
        const result = computeStructuralFreshness(s, c);
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThanOrEqual(1);
      }
    });
  });

  // ─────────────────────────────────────────────────────────
  // computeGraphCentrality
  // ─────────────────────────────────────────────────────────

  describe('computeGraphCentrality', () => {
    it('returns 0 for unknown node id', () => {
      const graph = makeGraph(['A', 'B', 'C']);
      expect(computeGraphCentrality('MISSING', graph)).toBe(0);
    });

    it('returns 0 when graph has fewer than 2 nodes', () => {
      const graph = makeGraph(['A']);
      expect(computeGraphCentrality('A', graph)).toBe(0);
    });

    it('returns 0 for isolated node (no inbound or outbound edges)', () => {
      // A, B, C all exist; A has no edges
      const graph = makeGraph(['A', 'B', 'C']);
      expect(computeGraphCentrality('A', graph)).toBe(0);
    });

    it('returns correct normalized centrality for node with edges', () => {
      // 4 nodes: A, B, C, D
      // A has inDegree=2 (B→A, C→A) and outDegree=1 (A→D)
      // degree_centrality = (2+1) / (2*(4-1)) = 3/6 = 0.5
      const graph = makeGraph(
        ['A', 'B', 'C', 'D'],
        { 'A': ['B', 'C'] },        // B and C point into A
        { 'A': ['D'] }               // A points to D
      );
      expect(computeGraphCentrality('A', graph)).toBeCloseTo(0.5, 5);
    });

    it('central hub node has higher centrality than leaf node', () => {
      // Hub A connects to/from B, C, D; Leaf B only connects to A
      const graph = makeGraph(
        ['A', 'B', 'C', 'D'],
        { 'A': ['B', 'C', 'D'] },  // B, C, D all point into A
        { 'A': ['B', 'C', 'D'] }   // A also points to B, C, D
      );

      const hubCentrality  = computeGraphCentrality('A', graph);
      const leafCentrality = computeGraphCentrality('B', graph);

      expect(hubCentrality).toBeGreaterThan(leafCentrality);
    });

    it('result is clamped to [0, 1]', () => {
      // Even with many edges the result should stay ≤ 1
      const nodeIds = Array.from({ length: 5 }, (_, i) => `n${i}`);
      const inbound: Record<string, string[]>  = { n0: ['n1', 'n2', 'n3', 'n4'] };
      const outbound: Record<string, string[]> = { n0: ['n1', 'n2', 'n3', 'n4'] };
      const graph = makeGraph(nodeIds, inbound, outbound);
      const centrality = computeGraphCentrality('n0', graph);
      expect(centrality).toBeGreaterThanOrEqual(0);
      expect(centrality).toBeLessThanOrEqual(1);
    });

    it('two-node graph: node with 1 in + 1 out = centrality 1.0', () => {
      // 2 nodes, A<->B
      // inDegree(A)=1, outDegree(A)=1
      // centrality = (1+1) / (2*(2-1)) = 2/2 = 1.0
      const graph = makeGraph(
        ['A', 'B'],
        { 'A': ['B'] },
        { 'A': ['B'] }
      );
      expect(computeGraphCentrality('A', graph)).toBeCloseTo(1.0, 5);
    });
  });
});

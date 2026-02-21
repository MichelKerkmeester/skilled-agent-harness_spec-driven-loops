// ---------------------------------------------------------------
// TEST: UNIFIED GRAPH SEARCH FUNCTION
// ---------------------------------------------------------------

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { SkillGraph } from '../../../scripts/sgqs/types';

/* ─────────────────────────────────────────────────────────────
   MOCK: SKILL GRAPH CACHE
──────────────────────────────────────────────────────────────── */

const MOCK_GRAPH: SkillGraph = {
  nodes: new Map([
    ['system-spec-kit/memory', {
      id: 'system-spec-kit/memory',
      labels: [':Node'],
      properties: { name: 'Memory System' },
      skill: 'system-spec-kit',
      path: 'system-spec-kit/memory',
    }],
    ['sk-git/commit', {
      id: 'sk-git/commit',
      labels: [':Node'],
      properties: { name: 'Git Commit' },
      skill: 'sk-git',
      path: 'sk-git/commit',
    }],
    ['system-spec-kit/checklist', {
      id: 'system-spec-kit/checklist',
      labels: [':Node'],
      properties: { name: 'Checklist Validation' },
      skill: 'system-spec-kit',
      path: 'system-spec-kit/checklist',
    }],
  ]),
  edges: [],
  edgeById: new Map(),
  outbound: new Map(),
  inbound: new Map(),
};

vi.mock('../lib/search/skill-graph-cache', () => ({
  skillGraphCache: {
    get: vi.fn().mockResolvedValue(MOCK_GRAPH),
  },
}));

/* ─────────────────────────────────────────────────────────────
   MOCK: SQLITE DATABASE
──────────────────────────────────────────────────────────────── */

const mockAll = vi.fn();
const mockStatement = { all: mockAll };
const mockPrepare = vi.fn().mockReturnValue(mockStatement);
const mockDb = {
  prepare: mockPrepare,
} as unknown as import('better-sqlite3').Database;

/* ─────────────────────────────────────────────────────────────
   HELPERS
──────────────────────────────────────────────────────────────── */

function makeCausalRow(overrides: Partial<{
  id: string;
  source_id: string;
  target_id: string;
  relation: string;
  strength: number;
}> = {}) {
  return {
    id: 'edge-001',
    source_id: 'mem-alpha',
    target_id: 'mem-beta',
    relation: 'causes',
    strength: 0.85,
    ...overrides,
  };
}

/* ─────────────────────────────────────────────────────────────
   TESTS
──────────────────────────────────────────────────────────────── */

describe('createUnifiedGraphSearchFn', () => {
  let createUnifiedGraphSearchFn: typeof import('../lib/search/graph-search-fn').createUnifiedGraphSearchFn;
  let skillGraphCache: { get: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    vi.clearAllMocks();
    mockPrepare.mockReturnValue(mockStatement);

    // Re-import after mocks are reset so the module picks up fresh mock state
    const mod = await import('../lib/search/graph-search-fn');
    createUnifiedGraphSearchFn = mod.createUnifiedGraphSearchFn;

    const cacheModule = await import('../lib/search/skill-graph-cache');
    skillGraphCache = cacheModule.skillGraphCache as unknown as { get: ReturnType<typeof vi.fn> };

    // Ensure the mock graph resolves immediately for warm-load
    skillGraphCache.get.mockResolvedValue(MOCK_GRAPH);
  });

  // ----------------------------------------------------------------
  // 1. CAUSAL EDGE RESULTS
  // ----------------------------------------------------------------
  it('returns results with mem: prefix IDs when causal edges match', async () => {
    const row = makeCausalRow({ id: 'edge-001', strength: 0.9 });
    mockAll.mockReturnValue([row]);

    const searchFn = createUnifiedGraphSearchFn(mockDb, '/skills');

    // Let the warm-load promise settle so cachedGraph is populated
    await new Promise(r => setTimeout(r, 0));

    const results = searchFn('nonexistent-query-zzz', { limit: 5 });
    const causalResult = results.find(r => String(r['id']).startsWith('mem:'));

    expect(causalResult).toBeDefined();
    expect(causalResult!['id']).toBe('mem:edge-001');
    expect(causalResult!['source']).toBe('graph');
  });

  it('uses memory_index content_text lookup in causal query SQL', async () => {
    mockAll.mockReturnValue([]);

    const searchFn = createUnifiedGraphSearchFn(mockDb, '/skills');
    await new Promise(r => setTimeout(r, 0));

    searchFn('spec', { limit: 5 });

    const sql = String(mockPrepare.mock.calls[0]?.[0] ?? '');
    expect(sql).toContain('FROM memory_index');
    expect(sql).toContain('COALESCE(content_text, title');
  });

  // ----------------------------------------------------------------
  // 2. SGQS SKILL GRAPH RESULTS
  // ----------------------------------------------------------------
  it('returns results with skill: prefix IDs when nodes match query', async () => {
    // No causal edges
    mockAll.mockReturnValue([]);

    const searchFn = createUnifiedGraphSearchFn(mockDb, '/skills');

    // Allow warm-load to populate cachedGraph
    await new Promise(r => setTimeout(r, 0));

    const results = searchFn('memory system', { limit: 10 });
    const skillResult = results.find(r => String(r['id']).startsWith('skill:'));

    expect(skillResult).toBeDefined();
    expect(skillResult!['id']).toBe('skill:system-spec-kit/memory');
    expect(skillResult!['source']).toBe('graph');
  });

  // ----------------------------------------------------------------
  // 3. MERGED RESULTS
  // ----------------------------------------------------------------
  it('merges and sorts results from both channels by score descending', async () => {
    const causalRow = makeCausalRow({ id: 'edge-merge', strength: 0.6 });
    mockAll.mockReturnValue([causalRow]);

    const searchFn = createUnifiedGraphSearchFn(mockDb, '/skills');
    await new Promise(r => setTimeout(r, 0));

    // "memory" matches the SGQS node with score 1.0 (single token, exact match in id)
    const results = searchFn('memory', { limit: 10 });

    expect(results.length).toBeGreaterThan(1);

    // Verify scores are in descending order
    for (let i = 0; i < results.length - 1; i++) {
      const scoreA = typeof results[i]!['score'] === 'number' ? (results[i]!['score'] as number) : 0;
      const scoreB = typeof results[i + 1]!['score'] === 'number' ? (results[i + 1]!['score'] as number) : 0;
      expect(scoreA).toBeGreaterThanOrEqual(scoreB);
    }

    // Expect both namespace prefixes present
    const ids = results.map(r => String(r['id']));
    expect(ids.some(id => id.startsWith('mem:'))).toBe(true);
    expect(ids.some(id => id.startsWith('skill:'))).toBe(true);
  });

  // ----------------------------------------------------------------
  // 4. EMPTY RESULTS FROM ONE CHANNEL
  // ----------------------------------------------------------------
  it('returns SGQS results when causal edge query fails', async () => {
    // Simulate a DB error
    mockPrepare.mockImplementation(() => {
      throw new Error('DB connection lost');
    });

    const searchFn = createUnifiedGraphSearchFn(mockDb, '/skills');
    await new Promise(r => setTimeout(r, 0));

    const results = searchFn('memory', { limit: 10 });

    // Causal channel failed gracefully; SGQS channel still returns results
    expect(results.length).toBeGreaterThan(0);
    expect(results.every(r => String(r['id']).startsWith('skill:'))).toBe(true);
  });

  // ----------------------------------------------------------------
  // 5. EMPTY RESULTS FROM BOTH CHANNELS
  // ----------------------------------------------------------------
  it('returns empty array without throwing when both channels return nothing', async () => {
    mockAll.mockReturnValue([]);

    const searchFn = createUnifiedGraphSearchFn(mockDb, '/skills');
    await new Promise(r => setTimeout(r, 0));

    // Query that matches no node IDs or names
    const results = searchFn('zzz-no-match-xyz', { limit: 10 });

    expect(results).toEqual([]);
  });

  // ----------------------------------------------------------------
  // 6. SCORE NORMALIZATION
  // ----------------------------------------------------------------
  it('returns all scores within the [0, 1] range', async () => {
    // Provide an out-of-range strength to test clamping
    const rows = [
      makeCausalRow({ id: 'edge-high', strength: 1.5 }),
      makeCausalRow({ id: 'edge-low', strength: -0.2 }),
      makeCausalRow({ id: 'edge-normal', strength: 0.7 }),
    ];
    mockAll.mockReturnValue(rows);

    const searchFn = createUnifiedGraphSearchFn(mockDb, '/skills');
    await new Promise(r => setTimeout(r, 0));

    const results = searchFn('memory', { limit: 20 });

    expect(results.length).toBeGreaterThan(0);
    for (const result of results) {
      const score = result['score'] as number;
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(1);
    }
  });

  // ----------------------------------------------------------------
  // 7. NAMESPACE PREFIXING
  // ----------------------------------------------------------------
  it('prefixes causal edge IDs with mem: and skill graph IDs with skill:', async () => {
    const row = makeCausalRow({ id: 'causal-ns-test', strength: 0.5 });
    mockAll.mockReturnValue([row]);

    const searchFn = createUnifiedGraphSearchFn(mockDb, '/skills');
    await new Promise(r => setTimeout(r, 0));

    // "checklist" matches skill node "system-spec-kit/checklist"
    const results = searchFn('checklist memory', { limit: 20 });

    const causalIds = results
      .map(r => String(r['id']))
      .filter(id => id.startsWith('mem:'));

    const skillIds = results
      .map(r => String(r['id']))
      .filter(id => id.startsWith('skill:'));

    expect(causalIds).toContain('mem:causal-ns-test');
    expect(skillIds.some(id => id.startsWith('skill:system-spec-kit/'))).toBe(true);

    // No result should lack a recognised namespace prefix
    for (const result of results) {
      const id = String(result['id']);
      expect(id.startsWith('mem:') || id.startsWith('skill:')).toBe(true);
    }
  });
});

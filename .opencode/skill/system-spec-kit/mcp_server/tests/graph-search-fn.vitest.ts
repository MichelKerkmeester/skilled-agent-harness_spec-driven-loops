// ---------------------------------------------------------------
// TEST: UNIFIED GRAPH SEARCH FUNCTION
// Causal edge channel only
// ---------------------------------------------------------------

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createUnifiedGraphSearchFn, getSubgraphWeights } from '../lib/search/graph-search-fn';

const mockAll = vi.fn();
const mockStatement = { all: mockAll };
const mockPrepare = vi.fn().mockReturnValue(mockStatement);
const mockDb = {
  prepare: mockPrepare,
} as unknown as import('better-sqlite3').Database;

function makeCausalRow(
  overrides: Partial<{
    id: string;
    source_id: string;
    target_id: string;
    relation: string;
    strength: number;
  }> = {}
) {
  return {
    id: 'edge-001',
    source_id: 'mem-alpha',
    target_id: 'mem-beta',
    relation: 'causes',
    strength: 0.85,
    ...overrides,
  };
}

describe('createUnifiedGraphSearchFn', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPrepare.mockReturnValue(mockStatement);
  });

  it('returns mem-prefixed graph results for causal matches', () => {
    mockAll.mockReturnValue([makeCausalRow({ id: 'edge-001', strength: 0.9 })]);

    const searchFn = createUnifiedGraphSearchFn(mockDb);
    const results = searchFn('memory', { limit: 5 });

    expect(results).toHaveLength(1);
    expect(results[0]!['id']).toBe('mem:edge-001');
    expect(results[0]!['source']).toBe('graph');
  });

  it('uses memory_index content_text lookup in causal SQL', () => {
    mockAll.mockReturnValue([]);

    const searchFn = createUnifiedGraphSearchFn(mockDb);
    searchFn('spec', { limit: 5 });

    const sql = String(mockPrepare.mock.calls[0]?.[0] ?? '');
    expect(sql).toContain('FROM memory_index');
    expect(sql).toContain('COALESCE(content_text, title');
  });

  it('returns empty array when causal query throws', () => {
    mockPrepare.mockImplementation(() => {
      throw new Error('DB connection lost');
    });

    const searchFn = createUnifiedGraphSearchFn(mockDb);
    expect(searchFn('memory', { limit: 10 })).toEqual([]);
  });

  it('sorts results by score descending and clamps scores to [0, 1]', () => {
    mockAll.mockReturnValue([
      makeCausalRow({ id: 'edge-high', strength: 1.5 }),
      makeCausalRow({ id: 'edge-low', strength: -0.2 }),
      makeCausalRow({ id: 'edge-mid', strength: 0.7 }),
    ]);

    const searchFn = createUnifiedGraphSearchFn(mockDb);
    const results = searchFn('memory', { limit: 20 });

    const scores = results.map(r => (typeof r['score'] === 'number' ? r['score'] : 0));
    expect(scores).toEqual([1, 0.7, 0]);
  });
});

describe('getSubgraphWeights', () => {
  it('returns causal-only weighting', () => {
    const weights = getSubgraphWeights('anything');
    expect(weights).toEqual({ causalWeight: 1 });
  });
});

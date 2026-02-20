// @ts-nocheck
// ───────────────────────────────────────────────────────────────
// TEST: RRF FUSION (vitest migration POC)
// Converted from: unit-rrf-fusion.test.ts (custom runner)
// ───────────────────────────────────────────────────────────────

import { describe, it, expect } from 'vitest';
import { fuseResults, fuseResultsMulti, SOURCE_TYPES } from '../lib/search/rrf-fusion';

describe('RRF Fusion (T001-T006)', () => {
  it('T001: Fuses results from multiple sources', () => {
    const vectorResults = [
      { id: 1, title: 'Memory A' },
      { id: 2, title: 'Memory B' },
      { id: 3, title: 'Memory C' },
    ];
    const bm25Results = [
      { id: 2, title: 'Memory B' },
      { id: 4, title: 'Memory D' },
      { id: 1, title: 'Memory A' },
    ];

    const fused = fuseResultsMulti([
      { source: SOURCE_TYPES.VECTOR, results: vectorResults },
      { source: SOURCE_TYPES.BM25, results: bm25Results },
    ]);

    expect(fused).toBeInstanceOf(Array);
    const ids = fused.map((r: any) => r.id).sort();
    expect(ids).toHaveLength(4);
    expect(ids).toEqual([1, 2, 3, 4]);

    for (const r of fused) {
      expect(r.rrfScore).toEqual(expect.any(Number));
      expect(r.sources).toBeInstanceOf(Array);
    }
  });

  it('T002: Higher-ranked results get higher RRF scores', () => {
    const results = [
      { id: 'first', title: 'First' },
      { id: 'second', title: 'Second' },
      { id: 'third', title: 'Third' },
    ];

    const fused = fuseResultsMulti([
      { source: SOURCE_TYPES.VECTOR, results },
    ]);

    const scoreMap: Record<string, number> = {};
    for (const r of fused) {
      scoreMap[r.id] = r.rrfScore;
    }

    expect(scoreMap['first']).toBeGreaterThan(scoreMap['second']);
    expect(scoreMap['second']).toBeGreaterThan(scoreMap['third']);
  });

  it('T003: Results appearing in multiple sources get boosted', () => {
    const vectorResults = [
      { id: 'shared', title: 'Shared Result' },
      { id: 'vector-only', title: 'Vector Only' },
    ];
    const bm25Results = [
      { id: 'shared', title: 'Shared Result' },
      { id: 'bm25-only', title: 'BM25 Only' },
    ];

    const fused = fuseResultsMulti([
      { source: SOURCE_TYPES.VECTOR, results: vectorResults },
      { source: SOURCE_TYPES.BM25, results: bm25Results },
    ]);

    const shared = fused.find((r: any) => r.id === 'shared');
    const vectorOnly = fused.find((r: any) => r.id === 'vector-only');
    const bm25Only = fused.find((r: any) => r.id === 'bm25-only');

    expect(shared).toBeDefined();
    expect(vectorOnly).toBeDefined();
    expect(bm25Only).toBeDefined();

    expect(shared.rrfScore).toBeGreaterThan(vectorOnly.rrfScore);
    expect(shared.rrfScore).toBeGreaterThan(bm25Only.rrfScore);
    expect(shared.sources).toHaveLength(2);
    expect(shared.convergenceBonus).toBeGreaterThan(0);
  });

  it('T004: Empty input returns empty output', () => {
    expect(fuseResultsMulti([])).toEqual([]);
    expect(fuseResultsMulti([
      { source: SOURCE_TYPES.VECTOR, results: [] },
      { source: SOURCE_TYPES.BM25, results: [] },
    ])).toEqual([]);
    expect(fuseResults([], [])).toEqual([]);
  });

  it('T005: Single source returns ranked results', () => {
    const singleList = [
      { id: 'a', title: 'Alpha' },
      { id: 'b', title: 'Beta' },
      { id: 'c', title: 'Gamma' },
    ];

    const fused = fuseResultsMulti([
      { source: SOURCE_TYPES.VECTOR, results: singleList },
    ]);

    expect(fused).toHaveLength(3);

    // Results sorted by rrfScore descending
    for (let i = 0; i < fused.length - 1; i++) {
      expect(fused[i].rrfScore).toBeGreaterThanOrEqual(fused[i + 1].rrfScore);
    }

    // Each result has exactly 1 source, no convergence bonus
    for (const r of fused) {
      expect(r.sources).toHaveLength(1);
      expect(r.convergenceBonus).toBe(0);
    }
  });

  it('T006: Results tagged with correct source type', () => {
    const vectorResults = [
      { id: 'v1', title: 'Vector Result 1' },
      { id: 'shared', title: 'Shared' },
    ];
    const bm25Results = [
      { id: 'b1', title: 'BM25 Result 1' },
      { id: 'shared', title: 'Shared' },
    ];

    const fused = fuseResultsMulti([
      { source: SOURCE_TYPES.VECTOR, results: vectorResults },
      { source: SOURCE_TYPES.BM25, results: bm25Results },
    ]);

    const v1 = fused.find((r: any) => r.id === 'v1');
    expect(v1.sources).toContain(SOURCE_TYPES.VECTOR);
    expect(v1.sources).toHaveLength(1);

    const b1 = fused.find((r: any) => r.id === 'b1');
    expect(b1.sources).toContain(SOURCE_TYPES.BM25);
    expect(b1.sources).toHaveLength(1);

    const shared = fused.find((r: any) => r.id === 'shared');
    expect(shared.sources).toContain(SOURCE_TYPES.VECTOR);
    expect(shared.sources).toContain(SOURCE_TYPES.BM25);
    expect(shared.sources).toHaveLength(2);
    expect(shared.sourceScores).toHaveProperty(SOURCE_TYPES.BM25);
    expect(shared.sourceScores[SOURCE_TYPES.BM25]).toEqual(expect.any(Number));
  });
});

describe('C138: Cross-Variant RRF (Multi-Query)', () => {
  it('C138-T1: multi-source fusion with 3+ sources works', () => {
    const vectorResults = [{ id: 'shared', title: 'Shared' }, { id: 'v-only', title: 'V' }];
    const bm25Results = [{ id: 'shared', title: 'Shared' }, { id: 'b-only', title: 'B' }];
    const graphResults = [{ id: 'shared', title: 'Shared' }, { id: 'g-only', title: 'G' }];

    const fused = fuseResultsMulti([
      { source: SOURCE_TYPES.VECTOR, results: vectorResults },
      { source: SOURCE_TYPES.BM25, results: bm25Results },
      { source: 'graph', results: graphResults },
    ]);

    const shared = fused.find(r => r.id === 'shared');
    expect(shared).toBeDefined();
    expect(shared.sources).toHaveLength(3);
    // 3-source convergence should give bonus
    expect(shared.convergenceBonus).toBeGreaterThan(0);
  });

  it('C138-T2: convergence bonus is exactly 0.10 per additional source', () => {
    const resultsA = [{ id: 'x', title: 'X' }];
    const resultsB = [{ id: 'x', title: 'X' }];

    const fused = fuseResultsMulti([
      { source: SOURCE_TYPES.VECTOR, results: resultsA },
      { source: SOURCE_TYPES.BM25, results: resultsB },
    ]);

    const x = fused.find(r => r.id === 'x');
    expect(x.convergenceBonus).toBeCloseTo(0.10, 2);
  });

  it('C138-T3: single-variant input behaves identically to standard', () => {
    const results = [{ id: 'a', title: 'A' }, { id: 'b', title: 'B' }];

    const fused = fuseResultsMulti([
      { source: SOURCE_TYPES.VECTOR, results },
    ]);

    const standard = fuseResults(results, []);
    // Single-source: no convergence bonus
    for (const r of fused) {
      expect(r.convergenceBonus).toBe(0);
    }
  });
});

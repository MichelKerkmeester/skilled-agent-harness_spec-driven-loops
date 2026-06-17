// ───────────────────────────────────────────────────────────────
// TEST — TOKEN BUDGET: SKIP-AND-CONTINUE + DETAILED-COUNT FLOOR
// ───────────────────────────────────────────────────────────────
// Proves the budget truncator no longer collapses a populated search to a
// single result: a too-large top result is skipped (not hard-stopped) so
// smaller lower-ranked results still fit, and the detailed count is floored
// at min(limit, 3) by promoting overflow as token-cheap summaries — even when
// includeContent is false (the common metadata-only call).

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  estimateResultTokens,
  truncateToBudget,
} from '../lib/search/hybrid-search';
import type { HybridSearchResult } from '../lib/search/hybrid-search';

/** Helper: minimal result with optional content. */
function makeResult(
  overrides: Partial<HybridSearchResult> & { id: number; score: number },
): HybridSearchResult {
  return { source: 'test', ...overrides };
}

describe('truncateToBudget — skip-and-continue + floor', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('keeps smaller fitting results when the top result overflows (no hard break)', () => {
    const huge = makeResult({
      id: 1,
      score: 0.95,
      title: 'Huge top match',
      content: 'x'.repeat(40000),
    });
    const small2 = makeResult({ id: 2, score: 0.8, title: 'Small B' });
    const small3 = makeResult({ id: 3, score: 0.7, title: 'Small C' });
    const small4 = makeResult({ id: 4, score: 0.6, title: 'Small D' });

    // Budget fits the three small results but not the huge one.
    const budget =
      estimateResultTokens(small2) +
      estimateResultTokens(small3) +
      estimateResultTokens(small4) +
      5;

    const { results, truncated } = truncateToBudget(
      [huge, small2, small3, small4],
      budget,
      { includeContent: false, queryId: 'skip-test', limit: 10 },
    );

    expect(truncated).toBe(true);
    // The headline bug: a single large top memory must NOT starve the tail.
    // All three smaller results survive at full detail.
    const ids = results.map((r) => r.id);
    expect(ids).toContain(2);
    expect(ids).toContain(3);
    expect(ids).toContain(4);
    expect(results.length).toBeGreaterThanOrEqual(3);
    // Output stays highest-score-first.
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1]!.score).toBeGreaterThanOrEqual(results[i]!.score);
    }
  });

  it('floors the detailed count at min(limit, 3) by promoting summaries, even when includeContent=false', () => {
    // Five results that each individually fit, but only one fits the budget at
    // full detail. Without the floor this collapses toward one result.
    const big = makeResult({
      id: 1,
      score: 0.95,
      title: 'Big A',
      content: 'a'.repeat(2400),
    });
    const rest = [2, 3, 4, 5].map((id) =>
      makeResult({
        id,
        score: 1 - id * 0.1,
        title: `Doc ${id}`,
        content: 'b'.repeat(2400),
      }),
    );

    const budget = estimateResultTokens(big) + 10;

    const { results, truncated, progressive } = truncateToBudget(
      [big, ...rest],
      budget,
      { includeContent: false, queryId: 'floor-test', limit: 10 },
    );

    expect(truncated).toBe(true);
    // Floor honored: at least 3 results returned despite the tight budget.
    expect(results.length).toBeGreaterThanOrEqual(3);
    // The promoted results are token-cheap summaries (summary-first applies
    // regardless of includeContent).
    const summarized = results.filter((r) => r['_summarized'] === true);
    expect(summarized.length).toBeGreaterThanOrEqual(2);
    // Whatever did not fit the floor is routed to progressive disclosure, not
    // discarded.
    expect(progressive).toBeDefined();
    expect(progressive!.summaryLayer.count).toBeGreaterThan(0);
  });

  it('honors a small explicit limit as the floor (min(limit, 3))', () => {
    const a = makeResult({ id: 1, score: 0.9, title: 'A', content: 'x'.repeat(8000) });
    const b = makeResult({ id: 2, score: 0.8, title: 'B', content: 'x'.repeat(8000) });
    const c = makeResult({ id: 3, score: 0.7, title: 'C', content: 'x'.repeat(8000) });

    const { results } = truncateToBudget([a, b, c], 50, {
      includeContent: false,
      limit: 2,
    });

    // limit=2 → floor is min(2, 3) = 2, not 3.
    expect(results).toHaveLength(2);
    expect(results.map((r) => r.id)).toEqual([1, 2]);
  });
});

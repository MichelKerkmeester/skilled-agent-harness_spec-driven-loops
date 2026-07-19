// ───────────────────────────────────────────────────────────────────
// MODULE: Query Expansion Bound Stress tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import {
  buildBoundedCombinedQuery,
  COMBINED_QUERY_CHAR_BUDGET,
} from '../../lib/search/embedding-expansion';

describe('query expansion bound stress', () => {
  it('keeps 100 expand-eligible queries within COMBINED_QUERY_CHAR_BUDGET', () => {
    for (let i = 0; i < 100; i += 1) {
      const baseQuery = `find substrate evidence for repair wave packet ${i}`;
      const expansions = Array.from(
        { length: 12 },
        (_value, j) => `expansion-fragment-${i}-${j} ${'lorem '.repeat(40)}`,
      );

      const combined = buildBoundedCombinedQuery(baseQuery, expansions);

      expect(combined.length).toBeLessThanOrEqual(COMBINED_QUERY_CHAR_BUDGET);
      expect(combined.startsWith(baseQuery)).toBe(true);
    }
  });

  it('returns the base query unchanged when expansions are empty', () => {
    expect(buildBoundedCombinedQuery('hello', [])).toBe('hello');
  });

  it('preserves an over-budget base query for worker-side token preflight', () => {
    const huge = 'x'.repeat(COMBINED_QUERY_CHAR_BUDGET + 1000);

    const result = buildBoundedCombinedQuery(huge, ['extra']);

    expect(result).toBe(huge);
    expect(result.length).toBeGreaterThan(COMBINED_QUERY_CHAR_BUDGET);
  });
});

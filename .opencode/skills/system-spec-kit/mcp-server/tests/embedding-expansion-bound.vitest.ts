// TEST: 034 Query Expansion Context Size
//
// Verifies consumer-side bounding of combinedQuery before the query is sent
// through the embedding provider's worker-side token preflight.
import { describe, expect, it } from 'vitest';
import {
  buildBoundedCombinedQuery,
  COMBINED_QUERY_CHAR_BUDGET,
} from '../lib/search/embedding-expansion';

describe('034: bounded embedding expansion combinedQuery', () => {
  it('T034-01: preserves short query plus short expansion terms unchanged', () => {
    const query = '0123456789';
    const terms = ['aa', 'bb', 'cc', 'dd', 'ee', 'ff', 'gg', 'hh'];

    const combined = buildBoundedCombinedQuery(query, terms);

    expect(combined).toBe(`${query} ${terms.join(' ')}`);
    expect(combined.length).toBeLessThan(COMBINED_QUERY_CHAR_BUDGET);
  });

  it('T034-02: drops low-priority long expansion terms to stay under the cap', () => {
    const query = '0123456789';
    const terms = Array.from({ length: 8 }, (_, i) => String(i).repeat(1000));

    const combined = buildBoundedCombinedQuery(query, terms);

    expect(combined.startsWith(query)).toBe(true);
    expect(combined.length).toBeLessThanOrEqual(COMBINED_QUERY_CHAR_BUDGET);
    expect(combined).toContain(terms[0]);
    expect(combined).toContain(terms[5]);
    expect(combined).not.toContain(terms[6]);
    expect(combined).not.toContain(terms[7]);
  });

  it('T034-03: preserves an over-budget base query for worker-side truncation', () => {
    const query = 'q'.repeat(7000);

    const combined = buildBoundedCombinedQuery(query, []);

    expect(combined).toBe(query);
    expect(combined.length).toBeGreaterThan(COMBINED_QUERY_CHAR_BUDGET);
  });
});

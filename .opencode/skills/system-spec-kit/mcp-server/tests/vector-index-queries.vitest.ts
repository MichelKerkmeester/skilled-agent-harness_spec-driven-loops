import { describe, expect, it } from 'vitest';

import { __testables } from '../lib/search/vector-index-queries';
import type { MemoryRow } from '../lib/search/vector-index-types';

describe('vector index query helpers', () => {
  it('hydrates multi-concept rows with score and similarity aliases', () => {
    const row = __testables.hydrateMultiConceptRow({
      id: 1,
      spec_folder: 'specs/query',
      file_path: '/repo/specs/query/spec.md',
      importance_tier: 'constitutional',
      trigger_phrases: '["query expansion"]',
      similarity_0: 80,
      similarity_1: 60,
    } as MemoryRow, 2);

    expect(row.concept_similarities).toEqual([80, 60]);
    expect(row.avg_similarity).toBe(70);
    expect(row.similarity).toBe(70);
    expect(row.score).toBe(0.7);
    expect(row.isConstitutional).toBe(true);
    expect(row.trigger_phrases).toEqual(['query expansion']);
  });
});

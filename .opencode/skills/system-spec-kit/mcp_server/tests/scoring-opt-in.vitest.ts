import { describe, expect, it } from 'vitest';
import {
  assessRequestQuality,
  computeResultConfidence,
  type ScoredResult,
} from '../lib/search/confidence-scoring';

function makeRetrievalQualityResults(): ScoredResult[] {
  return [
    {
      id: 1,
      score: 0.82,
      sources: ['semantic', 'bm25'],
      anchorMetadata: [{ id: 'summary' }, { id: 'decision' }, { id: 'evidence' }],
    },
    {
      id: 2,
      score: 0.54,
      sources: ['semantic', 'bm25'],
      anchorMetadata: [{ id: 'summary' }, { id: 'decision' }],
    },
    {
      id: 3,
      score: 0.48,
      sources: ['semantic'],
      anchorMetadata: [{ id: 'summary' }],
    },
  ];
}

describe('result confidence retrieval-quality semantics', () => {
  it('does not make retrieval-quality results weak without reranker signals', () => {
    const results = makeRetrievalQualityResults();
    const confidences = computeResultConfidence(results);
    const { requestQuality } = assessRequestQuality(results, confidences);

    expect(confidences[0].confidence.label).not.toBe('low');
    expect(requestQuality.label).toBe('good');
  });
});

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  assessRequestQuality,
  computeResultConfidence,
  type ScoredResult,
} from '../lib/search/confidence-scoring';

const ENV_KEYS = [
  'SPECKIT_CROSS_ENCODER',
  'RERANKER_LOCAL',
  'VOYAGE_API_KEY',
  'COHERE_API_KEY',
] as const;

let originalEnv: Partial<Record<typeof ENV_KEYS[number], string | undefined>> = {};

function resetRerankerEnv(): void {
  for (const key of ENV_KEYS) {
    delete process.env[key];
  }
}

function restoreRerankerEnv(): void {
  for (const key of ENV_KEYS) {
    if (originalEnv[key] === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = originalEnv[key];
    }
  }
}

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

function topConfidenceValue(results: ScoredResult[]): number {
  const [top] = computeResultConfidence(results);
  return top.confidence.value;
}

describe('scoring opt-in reranker semantics', () => {
  beforeEach(() => {
    originalEnv = {};
    for (const key of ENV_KEYS) {
      originalEnv[key] = process.env[key];
    }
  });

  afterEach(() => {
    restoreRerankerEnv();
  });

  it('does not make retrieval-quality results weak when reranking is not opted in', () => {
    resetRerankerEnv();

    const results = makeRetrievalQualityResults();
    const confidences = computeResultConfidence(results);
    const { requestQuality } = assessRequestQuality(results, confidences);

    expect(confidences[0].confidence.label).not.toBe('low');
    expect(requestQuality.label).toBe('good');
  });

  it('applies the existing missing-reranker confidence gap when local rerank is opted in', () => {
    resetRerankerEnv();
    process.env.SPECKIT_CROSS_ENCODER = 'true';

    const withoutReranker = makeRetrievalQualityResults();
    const withReranker = makeRetrievalQualityResults().map((result) => ({
      ...result,
      rerankerScore: 0.9,
      rerankerApplied: true,
    }));

    expect(topConfidenceValue(withoutReranker)).toBeLessThan(topConfidenceValue(withReranker));
  });

  it('applies the existing missing-reranker confidence gap when cloud rerank is configured', () => {
    resetRerankerEnv();
    process.env.VOYAGE_API_KEY = 'fake-voyage-key-XXXXXXXXXXXXX'; // >= 20 chars per looksLikeValidApiKey() contract

    const withoutReranker = makeRetrievalQualityResults();
    const withReranker = makeRetrievalQualityResults().map((result) => ({
      ...result,
      rerankerScore: 0.9,
      rerankerApplied: true,
    }));

    expect(topConfidenceValue(withoutReranker)).toBeLessThan(topConfidenceValue(withReranker));
  });
});

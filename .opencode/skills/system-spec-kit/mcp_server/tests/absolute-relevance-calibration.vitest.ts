import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  computeResultConfidence,
  assessRequestQuality,
  type ScoredResult,
} from '../lib/search/confidence-scoring';
import { resolveAbsoluteRelevance, resolveEffectiveScore } from '../lib/search/pipeline/types';

// Regression coverage for the RRF-vs-cosine calibration bug: a strong cosine
// match (similarity 72 → 0.72) carries a tiny RRF fusion magnitude (~0.03). When
// confidence/request-quality read that RRF magnitude as an absolute 0–1 quality,
// the 0.7/0.4 thresholds become unreachable and every hybrid query collapses to
// "weak"/"gap". The absolute-relevance calibration reads cosine instead.

const FLAG = 'SPECKIT_ABSOLUTE_RELEVANCE_CALIBRATION';

// Two strong cosine hits that agree across channels but sit next to each other in
// rank — exactly the shape that produced a "weak" verdict before the fix.
function strongCosineResults(): ScoredResult[] {
  return [
    {
      id: 1,
      similarity: 73,
      rrfScore: 0.033,
      sources: ['vector', 'fts'],
      anchorMetadata: [{ id: 'a' }, { id: 'b' }],
    },
    {
      id: 2,
      similarity: 71,
      rrfScore: 0.031,
      sources: ['vector', 'bm25'],
      anchorMetadata: [{ id: 'a' }, { id: 'b' }],
    },
  ];
}

describe('resolveAbsoluteRelevance', () => {
  it('prefers cosine similarity over the RRF fusion magnitude', () => {
    const row = { id: 1, similarity: 72, rrfScore: 0.03 } as never;
    expect(resolveAbsoluteRelevance(row)).toBeCloseTo(0.72, 5);
    // The ordering score still resolves to the RRF magnitude — ordering is untouched.
    expect(resolveEffectiveScore(row)).toBeCloseTo(0.03, 5);
  });

  it('normalizes a 0–100 cosine and passes through a 0–1 cosine', () => {
    expect(resolveAbsoluteRelevance({ id: 1, similarity: 90 } as never)).toBeCloseTo(0.9, 5);
    expect(resolveAbsoluteRelevance({ id: 1, similarity: 0.9 } as never)).toBeCloseTo(0.9, 5);
  });

  it('falls back to the effective score for lexical-only hits with no cosine', () => {
    const row = { id: 1, rrfScore: 0.04 } as never;
    expect(resolveAbsoluteRelevance(row)).toBeCloseTo(resolveEffectiveScore(row), 5);
  });
});

describe('confidence calibration (flag ON, default)', () => {
  beforeEach(() => {
    delete process.env[FLAG]; // default-ON
  });

  it('rates strong cosine matches as confident, not low', () => {
    const confidences = computeResultConfidence(strongCosineResults());
    expect(confidences).toHaveLength(2);
    for (const c of confidences) {
      expect(c.confidence.label).not.toBe('low');
      expect(c.confidence.value).toBeGreaterThanOrEqual(0.4);
    }
  });

  it('assesses request quality as good (was weak/gap before the fix)', () => {
    const results = strongCosineResults();
    const confidences = computeResultConfidence(results);
    const quality = assessRequestQuality(results, confidences);
    expect(quality.requestQuality.label).toBe('good');
  });
});

describe('confidence calibration (flag OFF reverts)', () => {
  beforeEach(() => {
    process.env[FLAG] = 'false';
  });
  afterEach(() => {
    delete process.env[FLAG];
  });

  it('collapses the same strong matches back to a non-good verdict on the RRF scale', () => {
    const results = strongCosineResults();
    const confidences = computeResultConfidence(results);
    const quality = assessRequestQuality(results, confidences);
    expect(quality.requestQuality.label).not.toBe('good');
  });
});

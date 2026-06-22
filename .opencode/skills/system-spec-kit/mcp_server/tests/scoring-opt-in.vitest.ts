import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  assessRequestQuality,
  computeResultConfidence,
  type ScoredResult,
} from '../lib/search/confidence-scoring';

// This file asserts the legacy retrieval-quality band on a strong top score with
// no reranker signals. Three graduated defaults now reshape that read: the
// isotonic confidence-calibration model caps the rebalance value, the
// lexical-grounding floor denies good to a hit with no lexical signal and no
// query, and the noise-floor subtraction lowers the banded relevance below the
// good thresholds. Pin all three OFF so the rebalance subject stays visible.
// Their default-on behavior is covered in the grounding and calibration suites.
const PINNED_OFF_FLAGS = [
  'SPECKIT_CONFIDENCE_CALIBRATION',
  'SPECKIT_LEXICAL_GROUNDING_V1',
  'SPECKIT_NOISE_FLOOR_SUBTRACTION_V1',
] as const;
const savedFlagValues = new Map<string, string | undefined>();

beforeEach(() => {
  for (const flag of PINNED_OFF_FLAGS) {
    savedFlagValues.set(flag, process.env[flag]);
    process.env[flag] = 'false';
  }
});

afterEach(() => {
  for (const flag of PINNED_OFF_FLAGS) {
    const saved = savedFlagValues.get(flag);
    if (saved === undefined) {
      delete process.env[flag];
    } else {
      process.env[flag] = saved;
    }
  }
});

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

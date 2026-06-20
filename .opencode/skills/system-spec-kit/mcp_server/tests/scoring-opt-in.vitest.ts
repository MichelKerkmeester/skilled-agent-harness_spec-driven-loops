import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  assessRequestQuality,
  computeResultConfidence,
  type ScoredResult,
} from '../lib/search/confidence-scoring';

// This file asserts uncalibrated retrieval-quality semantics. The isotonic
// confidence-calibration model now applies by default and would cap the value
// under test; pin it OFF so the rebalance subject stays visible. Isotonic
// default-on is covered in confidence-calibration*.vitest.ts.
const CONFIDENCE_CALIBRATION_FLAG = 'SPECKIT_CONFIDENCE_CALIBRATION';
let savedConfidenceCalibration: string | undefined;

beforeEach(() => {
  savedConfidenceCalibration = process.env[CONFIDENCE_CALIBRATION_FLAG];
  process.env[CONFIDENCE_CALIBRATION_FLAG] = 'false';
});

afterEach(() => {
  if (savedConfidenceCalibration === undefined) {
    delete process.env[CONFIDENCE_CALIBRATION_FLAG];
  } else {
    process.env[CONFIDENCE_CALIBRATION_FLAG] = savedConfidenceCalibration;
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

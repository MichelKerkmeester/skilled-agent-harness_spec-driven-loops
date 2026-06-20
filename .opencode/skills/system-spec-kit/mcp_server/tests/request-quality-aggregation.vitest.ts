// ───────────────────────────────────────────────────────────────
// TEST: Request-Quality Aggregation — top-dominant + margin-aware
// ───────────────────────────────────────────────────────────────
// Covers the "good" rule that lets a strong, well-separated top hit be citable
// even when the tail is weak, and that caps the quality ratio at the head of the
// ranking so recall expansion does not mechanically depress the verdict.
// The weak/gap safety net for genuinely low-signal sets must stay intact.

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  computeResultConfidence,
  assessRequestQuality,
  type ScoredResult,
} from '../lib/search/confidence-scoring';

const CALIBRATION_FLAG = 'SPECKIT_ABSOLUTE_RELEVANCE_CALIBRATION';

// This file asserts request-quality verdicts that depend on the uncalibrated
// rebalance confidence labels. The isotonic confidence-calibration model now
// applies by default and would cap those values; pin it OFF so the aggregation
// subject stays visible. Isotonic default-on is covered separately.
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

// Cosine similarity (0–100) drives the absolute relevance that topScore reads.
function strong(id: number, similarity: number): ScoredResult {
  return {
    id,
    similarity,
    sources: ['vector', 'fts'],
    anchorMetadata: [{ id: 'a' }, { id: 'b' }],
  };
}

function weak(id: number, similarity: number): ScoredResult {
  return { id, similarity };
}

function assess(results: ScoredResult[]) {
  return assessRequestQuality(results, computeResultConfidence(results)).requestQuality.label;
}

describe('assessRequestQuality — top-dominant + margin-aware (calibration ON)', () => {
  beforeEach(() => {
    delete process.env[CALIBRATION_FLAG]; // default-ON
  });

  it('reads "good" via margin: a strong top (0.78) clearly beats a weak tail', () => {
    // qualityRatio stays below 0.6 (only the top hit is confident), so the
    // margin disjunct — not the ratio — is what carries the verdict to "good".
    const results = [strong(1, 78), weak(2, 50), weak(3, 49), weak(4, 48), weak(5, 47)];
    const confidences = computeResultConfidence(results);
    const highOrMedium = confidences.filter(
      (c) => c.confidence.label !== 'low',
    ).length;
    expect(highOrMedium / 5).toBeLessThan(0.6);
    expect(assess(results)).toBe('good');
  });

  it('reads "good" top-dominant: a 0.81 top wins despite small margin and weak tail', () => {
    // Margin to #2 is only 0.06 (< 0.15) and the head is not mostly confident,
    // so only the top-dominant rule (>= 0.8) can yield "good".
    const results = [strong(1, 81), weak(2, 75)];
    expect(assess(results)).toBe('good');
  });

  it('does not let recall expansion depress a confident head (quality ratio capped at the head)', () => {
    // First five are confident; six weak tail candidates would drag a whole-set
    // ratio to ~0.45. Margins are tiny (< 0.15), so without the head cap this
    // would collapse to "weak".
    const head = [strong(1, 78), strong(2, 77), strong(3, 76), strong(4, 75), strong(5, 74)];
    const tail = [weak(6, 45), weak(7, 44), weak(8, 43), weak(9, 42), weak(10, 41), weak(11, 40)];
    const results = [...head, ...tail];
    const confidences = computeResultConfidence(results);
    const wholeSetRatio =
      confidences.filter((c) => c.confidence.label !== 'low').length / results.length;
    expect(wholeSetRatio).toBeLessThan(0.6);
    expect(assess(results)).toBe('good');
  });

  it('keeps a genuinely mediocre set at "weak"', () => {
    const results = [weak(1, 55), weak(2, 52), weak(3, 50)];
    expect(assess(results)).toBe('weak');
  });

  it('keeps a genuinely low-signal set at "gap" (do-not-cite safety net)', () => {
    const results = [weak(1, 10), weak(2, 8), weak(3, 5)];
    expect(assess(results)).toBe('gap');
  });

  it('returns "gap" for an empty result set', () => {
    expect(assessRequestQuality([], []).requestQuality.label).toBe('gap');
  });

  it('degrades to "gap" when the confidences array is not parallel to results', () => {
    // results/confidences are a parallel pair; a length mismatch would pair a
    // result with an unrelated confidence head. A would-be "good" set must not
    // emit a quality label off misaligned arrays — it falls back to do-not-cite.
    const results = [strong(1, 81), weak(2, 75)];
    const fullConfidences = computeResultConfidence(results);
    expect(assessRequestQuality(results, fullConfidences).requestQuality.label).toBe('good');
    // Drop one confidence so the arrays desync.
    const shortConfidences = fullConfidences.slice(0, 1);
    expect(assessRequestQuality(results, shortConfidences).requestQuality.label).toBe('gap');
  });
});

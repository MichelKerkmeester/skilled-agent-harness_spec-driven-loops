// ───────────────────────────────────────────────────────────────────
// MODULE: Evaluation Non-inferiority Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import { evaluateDimensionNonInferiority } from '../../src/evaluation/index.js';

describe('paired non-inferiority decision', () => {
  it('passes only when the two-sided 95 percent lower bound clears the margin', () => {
    const result = evaluateDimensionNonInferiority({
      dimension: 'directness',
      pairedDifferences: Array.from({ length: 30 }, () => 0),
      evidenceClass: 'human',
      margin: -0.2,
      requiredSampleSize: 30,
      sampleCap: 30,
    });

    expect(result).toMatchObject({
      status: 'pass',
      reasonCode: 'lower-bound-clears-margin',
      sampleCount: 30,
      meanDifference: 0,
      margin: -0.2,
      releaseGatePass: true,
    });
    expect(result.confidenceInterval?.lowerBound).toBe(0);
  });

  it('fails when the complete interval is below the margin', () => {
    const result = evaluateDimensionNonInferiority({
      dimension: 'fluency',
      pairedDifferences: Array.from({ length: 30 }, () => -0.5),
      evidenceClass: 'human',
      margin: -0.2,
      requiredSampleSize: 30,
      sampleCap: 30,
    });

    expect(result).toMatchObject({
      status: 'fail',
      reasonCode: 'inferior',
      releaseGatePass: false,
    });
    expect(result.confidenceInterval?.upperBound).toBeLessThan(-0.2);
  });

  it('remains inconclusive below the cap and converts cap-inconclusive to failure', () => {
    const alternating = (count: number): number[] => Array.from(
      { length: count },
      (_, index) => index % 2 === 0 ? 0.9 : -1.1,
    );
    const interim = evaluateDimensionNonInferiority({
      dimension: 'reference-likeness',
      pairedDifferences: alternating(30),
      evidenceClass: 'human',
      margin: -0.2,
      requiredSampleSize: 30,
      sampleCap: 100,
    });
    const capped = evaluateDimensionNonInferiority({
      dimension: 'reference-likeness',
      pairedDifferences: alternating(100),
      evidenceClass: 'human',
      margin: -0.2,
      requiredSampleSize: 30,
      sampleCap: 100,
    });

    expect(interim).toMatchObject({
      status: 'inconclusive',
      reasonCode: 'confidence-interval-crosses-margin',
      releaseGatePass: false,
    });
    expect(capped).toMatchObject({
      status: 'fail',
      reasonCode: 'inconclusive-at-sample-cap',
      releaseGatePass: false,
    });
  });
});

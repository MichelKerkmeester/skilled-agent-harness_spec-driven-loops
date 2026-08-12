// ───────────────────────────────────────────────────────────────────
// MODULE: Evaluation Power Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import { calculatePoweredSampleSize } from '../../src/evaluation/index.js';

describe('paired-rating power plan', () => {
  it('computes a deterministic powered count within the frozen bounds', () => {
    const input = {
      standardDeviation: 1,
      minimumDetectableDifference: 0.4,
      alpha: 0.05,
      targetPower: 0.8,
    } as const;

    const first = calculatePoweredSampleSize(input);
    const second = calculatePoweredSampleSize(input);

    expect(first).toEqual(second);
    expect(first.pairedRatingsPerStratum).toBeGreaterThanOrEqual(30);
    expect(first.pairedRatingsPerStratum).toBeLessThanOrEqual(100);
    expect(first.achievedPower).toBeGreaterThanOrEqual(0.8);
    expect(first.meetsTargetPower).toBe(true);
  });

  it('clamps low estimates to 30 and reports an unachievable high estimate at 100', () => {
    const low = calculatePoweredSampleSize({
      standardDeviation: 0.1,
      minimumDetectableDifference: 1,
      alpha: 0.05,
      targetPower: 0.8,
    });
    const high = calculatePoweredSampleSize({
      standardDeviation: 5,
      minimumDetectableDifference: 0.1,
      alpha: 0.05,
      targetPower: 0.8,
    });

    expect(low).toMatchObject({ pairedRatingsPerStratum: 30, clamped: true });
    expect(high).toMatchObject({
      pairedRatingsPerStratum: 100,
      clamped: true,
      meetsTargetPower: false,
    });
    expect(high.unboundedPairedRatings).toBeGreaterThan(100);
  });
});

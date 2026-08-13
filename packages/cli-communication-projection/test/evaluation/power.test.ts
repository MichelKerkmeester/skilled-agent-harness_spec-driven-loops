// ───────────────────────────────────────────────────────────────────
// MODULE: Evaluation Power Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import { calculatePoweredSampleSize } from '../../src/evaluation/index.js';

describe('paired-rating power plan', () => {
  it('computes a deterministic powered count within the frozen bounds', () => {
    const input = {
      standardDeviation: 1,
      nonInferiorityMargin: -0.4,
      alpha: 0.05,
      targetPower: 0.8,
    } as const;

    const first = calculatePoweredSampleSize(input);
    const second = calculatePoweredSampleSize(input);

    expect(first).toEqual(second);
    expect(first.unboundedPairedRatings).toBe(39);
    expect(first.pairedRatingsPerStratum).toBe(39);
    expect(first.achievedPower).toBeGreaterThanOrEqual(0.8);
    expect(first.meetsTargetPower).toBe(true);
  });

  it('reports non-inferiority power at the floor without overstating it', () => {
    const low = calculatePoweredSampleSize({
      standardDeviation: 1,
      nonInferiorityMargin: -0.5,
      alpha: 0.05,
      targetPower: 0.8,
    });

    expect(low).toMatchObject({ pairedRatingsPerStratum: 30, clamped: true });
    expect(low.achievedPower).toBeGreaterThan(0.8);
    expect(low.achievedPower).toBeLessThan(0.9);
  });

  it('caps a tiny-margin plan and reports power below the target', () => {
    const high = calculatePoweredSampleSize({
      standardDeviation: 1,
      nonInferiorityMargin: -0.05,
      alpha: 0.05,
      targetPower: 0.8,
    });

    expect(high).toMatchObject({
      pairedRatingsPerStratum: 100,
      clamped: true,
      meetsTargetPower: false,
    });
    expect(high.unboundedPairedRatings).toBeGreaterThan(100);
    expect(high.achievedPower).toBeLessThan(0.2);
  });
});

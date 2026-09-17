import { describe, expect, it } from 'vitest';

import { computeScore, shouldDemote } from '../../lib/deep-loop/bayesian-scorer';

describe('bayesian-scorer', () => {
  it('returns the neutral Laplace-smoothed score for zero calls', () => {
    expect(computeScore(0, 0)).toBe(0.5);
  });

  it('computes a single-success score above the demotion threshold', () => {
    const score = computeScore(1, 1);

    expect(score).toBeCloseTo(2 / 3);
    expect(shouldDemote(score, 1)).toBe(false);
  });

  it('demotes a tool below 50 percent after at least 3 calls', () => {
    const score = computeScore(0, 3);

    expect(score).toBeCloseTo(0.2);
    expect(shouldDemote(score, 3)).toBe(true);
  });

  it('does not demote exactly at 50 percent', () => {
    expect(shouldDemote(0.5, 3)).toBe(false);
  });

  it('does not demote below-threshold scores before 3 calls', () => {
    const score = computeScore(0, 2);

    expect(score).toBe(0.25);
    expect(shouldDemote(score, 2)).toBe(false);
  });

  it('rejects impossible success totals', () => {
    expect(() => computeScore(2, 1)).toThrow(RangeError);
  });
});

import { describe, expect, it } from 'vitest';

import {
  computeProceduralReliabilityMultiplier,
  computeWeightedReliability,
} from '../lib/scoring/bayesian-scorer.js';

describe('bounded beta reliability scoring', () => {
  it('returns a neutral prior without evidence', () => {
    expect(computeWeightedReliability(0, 0)).toBe(0.5);
  });

  it('keeps a single success bounded by the prior', () => {
    expect(computeWeightedReliability(1, 0)).toBeCloseTo(2 / 3, 12);
  });

  it('floors negative counts at zero', () => {
    expect(computeWeightedReliability(-2, -3)).toBe(0.5);
  });

  it('accepts fractional evidence without integer coercion', () => {
    expect(computeWeightedReliability(0.5, 0.25)).toBeCloseTo(1.5 / 2.75, 12);
  });

  it('rejects invalid priors and non-finite counts', () => {
    expect(() => computeWeightedReliability(Number.NaN, 0)).toThrow('successes must be finite');
    expect(() => computeWeightedReliability(0, 0, { alphaPrior: 0 })).toThrow(
      'alphaPrior must be finite and greater than zero',
    );
  });

  it('exposes the same posterior as a procedural recall multiplier', () => {
    expect(computeProceduralReliabilityMultiplier({ successes: 3, failures: 1 })).toBeCloseTo(4 / 6, 12);
  });
});

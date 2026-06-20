import { describe, expect, it } from 'vitest';

import {
  computeCenteredReliabilityEvidence,
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

describe('prior-centered reliability delta sign contract', () => {
  // Mirror the production delta: strength and score are positive scalars, so the
  // sign of the score delta is the sign of (centered * evidenceWeight).
  const STRENGTH = 0.08;
  const SCORE = 0.5;
  const reliabilityDelta = (successes: number, failures: number): number => {
    const evidence = computeCenteredReliabilityEvidence({ successes, failures });
    return STRENGTH * evidence.centered * evidence.evidenceWeight * SCORE;
  };

  it('promotes when the posterior mean beats the prior mean (mean > mu0)', () => {
    const evidence = computeCenteredReliabilityEvidence({ successes: 3, failures: 0 });
    expect(evidence.mean).toBeGreaterThan(evidence.priorMean);
    expect(reliabilityDelta(3, 0)).toBeGreaterThan(0);
  });

  it('demotes when the posterior mean trails the prior mean (mean < mu0)', () => {
    const evidence = computeCenteredReliabilityEvidence({ successes: 0, failures: 3 });
    expect(evidence.mean).toBeLessThan(evidence.priorMean);
    expect(reliabilityDelta(0, 3)).toBeLessThan(0);
  });

  it('stays neutral when balanced evidence equals the prior mean (mean == mu0)', () => {
    const evidence = computeCenteredReliabilityEvidence({ successes: 2, failures: 2 });
    expect(evidence.mean).toBe(evidence.priorMean);
    expect(evidence.centered).toBe(0);
    expect(reliabilityDelta(2, 2)).toBe(0);
  });

  it('stays neutral with no evidence (n == 0)', () => {
    const evidence = computeCenteredReliabilityEvidence({ successes: 0, failures: 0 });
    expect(evidence.evidenceCount).toBe(0);
    expect(evidence.evidenceWeight).toBe(0);
    expect(reliabilityDelta(0, 0)).toBe(0);
  });

  it('shrinks thin evidence toward neutral relative to dense evidence', () => {
    const thin = computeCenteredReliabilityEvidence({ successes: 1, failures: 0 });
    const dense = computeCenteredReliabilityEvidence({ successes: 100, failures: 0 });
    expect(dense.evidenceWeight).toBeGreaterThan(thin.evidenceWeight);
    expect(Math.abs(reliabilityDelta(100, 0))).toBeGreaterThan(Math.abs(reliabilityDelta(1, 0)));
  });
});

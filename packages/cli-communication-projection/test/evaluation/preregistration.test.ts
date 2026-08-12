// ───────────────────────────────────────────────────────────────────
// MODULE: Evaluation Pre-registration Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import {
  assertFrozenPreRegistration,
  calculatePoweredSampleSize,
  freezePreRegistration,
} from '../../src/evaluation/index.js';

import type {
  CreatePreRegistrationInput,
  ReviewerAssignment,
} from '../../src/evaluation/index.js';

const stratum = {
  stratumId: 'stratum-full-codex',
  providerId: 'provider-a',
  modelId: 'model-a',
  promptProfileId: 'profile-a',
  runtimeId: 'codex',
  presentationTier: 'full-projection',
} as const;

const powerInput = {
  standardDeviation: 0.1,
  minimumDetectableDifference: 1,
  alpha: 0.05,
  targetPower: 0.8,
} as const;

function assignments(count: number): readonly ReviewerAssignment[] {
  const result: ReviewerAssignment[] = [];
  let remaining = count;
  let comparisonIndex = 0;
  while (remaining > 0) {
    const reviewerCount = remaining === 4 ? 4 : 3;
    result.push({
      stratumId: stratum.stratumId,
      comparisonId: `comparison-${comparisonIndex}`,
      reviewerIds: Array.from(
        { length: reviewerCount },
        (_, reviewerIndex) => `reviewer-${reviewerIndex}`,
      ),
    });
    remaining -= reviewerCount;
    comparisonIndex += 1;
  }
  return result;
}

function input(): CreatePreRegistrationInput {
  const powered = calculatePoweredSampleSize(powerInput);
  return {
    frozenAt: '2026-08-12T08:00:00.000Z',
    strata: [stratum],
    samplePlanInputs: [{ stratumId: stratum.stratumId, power: powerInput }],
    reviewerAssignments: assignments(powered.pairedRatingsPerStratum),
    randomizationSeed: 'synthetic-blind-seed',
    nonInferiorityMargins: {
      directness: -0.2,
      fluency: -0.2,
      'meaning-preservation': -0.1,
      'reference-likeness': -0.25,
    },
    stopRules: {
      minimumPairedRatings: 30,
      maximumPairedRatings: 100,
      allowEarlyPass: false,
      fidelityFailure: 'fail-release',
      inconclusiveAtSampleCap: 'fail-release',
    },
  };
}

function freezeRecursively<TValue>(value: TValue): TValue {
  if (typeof value !== 'object' || value === null || Object.isFrozen(value)) {
    return value;
  }
  for (const child of Object.values(value)) {
    freezeRecursively(child);
  }
  return Object.freeze(value);
}

describe('immutable evaluation pre-registration', () => {
  it('freezes every scoring choice and stamps a content-free digest', () => {
    const record = freezePreRegistration(input());

    expect(record.status).toBe('frozen');
    expect(record.preRegistrationDigest).toMatch(/^sha256:[a-f0-9]{64}$/u);
    expect(record.samplePlans[0]).toMatchObject({
      stratumId: stratum.stratumId,
      pairedRatingsPerStratum: 30,
      alpha: 0.05,
      targetPower: 0.8,
    });
    expect(Object.isFrozen(record)).toBe(true);
    expect(Object.isFrozen(record.nonInferiorityMargins)).toBe(true);
    expect(() => assertFrozenPreRegistration(record)).not.toThrow();
    expect(JSON.stringify(record)).not.toContain('candidateText');
    expect(JSON.stringify(record)).not.toContain('rawPrompt');
  });

  it('refuses an unfrozen copy or a digest-changing mutation before scoring', () => {
    const record = freezePreRegistration(input());
    const unfrozen = structuredClone(record);
    const tampered = structuredClone(record) as {
      nonInferiorityMargins: { directness: number };
    };
    tampered.nonInferiorityMargins.directness = -0.5;

    expect(() => assertFrozenPreRegistration(unfrozen)).toThrow('not deeply frozen');
    Object.freeze(unfrozen);
    expect(() => assertFrozenPreRegistration(unfrozen)).toThrow('not deeply frozen');
    freezeRecursively(tampered);
    expect(() => assertFrozenPreRegistration(tampered))
      .toThrow('changed after freezing');
  });

  it('rejects reviewer assignments with fewer than three independent reviewers', () => {
    const invalid = input();
    const first = invalid.reviewerAssignments[0];
    if (first === undefined) {
      throw new Error('Expected a reviewer assignment fixture.');
    }

    expect(() => freezePreRegistration({
      ...invalid,
      reviewerAssignments: [
        { ...first, reviewerIds: ['reviewer-0', 'reviewer-1'] },
        ...invalid.reviewerAssignments.slice(1),
      ],
    })).toThrow('at least three independent reviewers');
  });
});

// ───────────────────────────────────────────────────────────────────
// MODULE: Evaluation Release Gate Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import { createExactOriginalRecord } from '../../src/contracts/index.js';
import {
  calculatePoweredSampleSize,
  evaluateFidelityVeto,
  evaluateReleaseGate,
  freezePreRegistration,
} from '../../src/evaluation/index.js';
import { protectMarkdown } from '../../src/fidelity/index.js';

import type {
  BlindReviewerRating,
  CreatePreRegistrationInput,
  EvaluationFidelityVetoDecision,
  EvaluationStratum,
  ReviewerAssignment,
} from '../../src/evaluation/index.js';
import type { ProtectedDocument } from '../../src/fidelity/index.js';

const powerInput = {
  standardDeviation: 0.1,
  nonInferiorityMargin: -1,
  alpha: 0.05,
  targetPower: 0.8,
} as const;

const fullStratum: EvaluationStratum = {
  stratumId: 'full-stratum',
  providerId: 'provider-a',
  modelId: 'model-a',
  promptProfileId: 'profile-a',
  runtimeId: 'codex',
  presentationTier: 'full-projection',
};

const safeStratum: EvaluationStratum = {
  ...fullStratum,
  stratumId: 'safe-stratum',
  presentationTier: 'safe-native',
};

function assignments(stratumId: string, count: number): readonly ReviewerAssignment[] {
  const result: ReviewerAssignment[] = [];
  let remaining = count;
  let comparisonIndex = 0;
  while (remaining > 0) {
    const reviewerCount = remaining === 4 ? 4 : 3;
    result.push({
      stratumId,
      comparisonId: `${stratumId}-comparison-${comparisonIndex}`,
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

function preRegistration(strata: readonly EvaluationStratum[]) {
  const count = calculatePoweredSampleSize(powerInput).pairedRatingsPerStratum;
  const input: CreatePreRegistrationInput = {
    frozenAt: '2026-08-12T08:00:00.000Z',
    strata,
    samplePlanInputs: strata.map((entry) => ({
      stratumId: entry.stratumId,
      power: powerInput,
    })),
    reviewerAssignments: strata.flatMap((entry) => assignments(entry.stratumId, count)),
    randomizationSeed: 'gate-seed',
    nonInferiorityMargins: {
      directness: -0.2,
      fluency: -0.2,
      'meaning-preservation': -0.2,
      'reference-likeness': -0.2,
    },
    stopRules: {
      minimumPairedRatings: 30,
      maximumPairedRatings: 100,
      allowEarlyPass: false,
      fidelityFailure: 'fail-release',
      inconclusiveAtSampleCap: 'fail-release',
    },
  };
  return freezePreRegistration(input);
}

function document(): ProtectedDocument {
  const source = 'Keep `syntheticValue` unchanged.';
  const exactOriginal = createExactOriginalRecord(
    'synthetic-original',
    new TextEncoder().encode(source),
    'text/markdown; charset=utf-8',
    {
      sourceFamily: 'synthetic-gate-test',
      sourceVersion: '1.0.0',
      captureMethod: 'synthetic',
      sanitizationStatus: 'synthetic',
      capturedAt: '2026-08-12T00:00:00.000Z',
    },
  );
  const result = protectMarkdown({ sourceText: source, exactOriginal });
  if (result.status !== 'protected') {
    throw new Error('Expected protected synthetic gate fixture.');
  }
  return result.document;
}

function ratings(
  reviewerAssignments: readonly ReviewerAssignment[],
  candidateScore = 5,
  referenceScore = 4,
): readonly BlindReviewerRating[] {
  return reviewerAssignments.flatMap((assignment) =>
    assignment.reviewerIds.map((reviewerId) => ({
      comparisonId: assignment.comparisonId,
      reviewerId,
      evidenceClass: 'human',
      candidateScores: {
        directness: candidateScore,
        fluency: candidateScore,
        'meaning-preservation': candidateScore,
        'reference-likeness': candidateScore,
      },
      referenceScores: {
        directness: referenceScore,
        fluency: referenceScore,
        'meaning-preservation': referenceScore,
        'reference-likeness': referenceScore,
      },
    })));
}

async function fidelityDecisions(
  reviewerAssignments: readonly ReviewerAssignment[],
  stratumId: string,
  vetoFirst = false,
): Promise<readonly EvaluationFidelityVetoDecision[]> {
  const protectedDocument = document();
  return Promise.all(reviewerAssignments.map((assignment, index) =>
    evaluateFidelityVeto({
      comparisonId: assignment.comparisonId,
      stratumId,
      validation: {
        protection: protectedDocument,
        candidateText: vetoFirst && index === 0
          ? 'Keep the protected value changed.'
          : protectedDocument.encodedText,
        providerTerminal: 'success',
        allPartsComplete: true,
        currentSourceSha256: protectedDocument.sourceSha256,
      },
    })));
}

describe('stratified release gate', () => {
  it('makes deterministic fidelity an absolute veto over passing style ratings', async () => {
    const registration = preRegistration([fullStratum]);
    const reviewerAssignments = registration.reviewerAssignments;
    const decision = evaluateReleaseGate({
      preRegistration: registration,
      claimTier: 'full-projection',
      strata: [{
        stratumId: fullStratum.stratumId,
        fidelityVetoes: await fidelityDecisions(
          reviewerAssignments,
          fullStratum.stratumId,
          true,
        ),
        ratings: ratings(reviewerAssignments),
      }],
      diagnosticMetrics: [{ metricId: 'synthetic-style-similarity', value: 1 }],
    });

    expect(decision).toMatchObject({
      status: 'fail',
      releaseApproved: false,
      reasonCode: 'fidelity-veto',
      diagnosticMetricCount: 1,
    });
  });

  it('passes complete human and fidelity evidence for the requested tier', async () => {
    const registration = preRegistration([fullStratum]);
    const reviewerAssignments = registration.reviewerAssignments;
    const decision = evaluateReleaseGate({
      preRegistration: registration,
      claimTier: 'full-projection',
      strata: [{
        stratumId: fullStratum.stratumId,
        fidelityVetoes: await fidelityDecisions(
          reviewerAssignments,
          fullStratum.stratumId,
        ),
        ratings: ratings(reviewerAssignments),
      }],
    });

    expect(decision.status).toBe('pass');
    expect(decision.releaseApproved).toBe(true);
    expect(decision.strata[0]?.dimensions.every((entry) => entry.status === 'pass'))
      .toBe(true);
  });

  it('keeps automated metrics diagnostic when human ratings are absent', async () => {
    const registration = preRegistration([fullStratum]);
    const reviewerAssignments = registration.reviewerAssignments;
    const decision = evaluateReleaseGate({
      preRegistration: registration,
      claimTier: 'full-projection',
      strata: [{
        stratumId: fullStratum.stratumId,
        fidelityVetoes: await fidelityDecisions(
          reviewerAssignments,
          fullStratum.stratumId,
        ),
        ratings: [],
      }],
      diagnosticMetrics: [{ metricId: 'synthetic-perfect-score', value: 1 }],
    });

    expect(decision).toMatchObject({
      status: 'inconclusive',
      releaseApproved: false,
      reasonCode: 'incomplete-evidence',
      diagnosticMetricCount: 1,
    });
  });

  it('never lets safe-native evidence satisfy a full-projection claim', async () => {
    const registration = preRegistration([fullStratum, safeStratum]);
    const safeAssignments = registration.reviewerAssignments
      .filter((entry) => entry.stratumId === safeStratum.stratumId);
    const decision = evaluateReleaseGate({
      preRegistration: registration,
      claimTier: 'full-projection',
      strata: [{
        stratumId: safeStratum.stratumId,
        fidelityVetoes: await fidelityDecisions(
          safeAssignments,
          safeStratum.stratumId,
        ),
        ratings: ratings(safeAssignments),
      }],
    });

    expect(decision).toMatchObject({
      status: 'fail',
      releaseApproved: false,
      reasonCode: 'missing-stratum-evidence',
    });
    expect(decision.strata).toEqual([
      expect.objectContaining({
        stratumId: fullStratum.stratumId,
        presentationTier: 'full-projection',
        status: 'fail',
      }),
    ]);
  });
});

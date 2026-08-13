// ───────────────────────────────────────────────────────────────────
// MODULE: Proxy Judge Provenance Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import {
  assertHumanCertifiable,
  buildMaskedReviewPacket,
  calculatePoweredSampleSize,
  createReleaseReport,
  evaluateReleaseGate,
  freezePreRegistration,
  runProxyReviewers,
} from '../../src/evaluation/index.js';
import { aggregateLifecycleEvents } from '../../src/observability/index.js';

import type {
  BlindReviewerRating,
  CreatePreRegistrationInput,
  EvaluationFidelityVetoDecision,
  EvaluationStratum,
  MaskedReviewBundle,
  MaskedReviewPacket,
  ProxyPerDimensionScores,
  ReleaseGateDecision,
  ReviewerAssignment,
} from '../../src/evaluation/index.js';

const POWER_INPUT = {
  standardDeviation: 0.1,
  nonInferiorityMargin: -1,
  alpha: 0.05,
  targetPower: 0.8,
} as const;

const PROXY_REVIEWER_IDS = [
  'llm-proxy-1',
  'llm-proxy-2',
  'llm-proxy-3',
] as const;

const STRATUM: EvaluationStratum = {
  stratumId: 'proxy-demo-stratum',
  providerId: 'provider-proxy',
  modelId: 'model-proxy',
  promptProfileId: 'profile-proxy',
  runtimeId: 'codex',
  presentationTier: 'full-projection',
};

function registration() {
  const ratingCount = calculatePoweredSampleSize(POWER_INPUT).pairedRatingsPerStratum;
  const comparisonCount = ratingCount / PROXY_REVIEWER_IDS.length;
  const reviewerAssignments: ReviewerAssignment[] = Array.from(
    { length: comparisonCount },
    (_, index) => ({
      stratumId: STRATUM.stratumId,
      comparisonId: `proxy-comparison-${index}`,
      reviewerIds: PROXY_REVIEWER_IDS,
    }),
  );
  const input: CreatePreRegistrationInput = {
    frozenAt: '2026-08-12T08:00:00.000Z',
    strata: [STRATUM],
    samplePlanInputs: [{
      stratumId: STRATUM.stratumId,
      power: POWER_INPUT,
    }],
    reviewerAssignments,
    randomizationSeed: 'proxy-demo-seed',
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

function maskedBundles(
  reviewerAssignments: readonly ReviewerAssignment[],
): readonly MaskedReviewBundle[] {
  return reviewerAssignments.map((assignment) => buildMaskedReviewPacket({
    comparisonId: assignment.comparisonId,
    stratumId: assignment.stratumId,
    providerId: STRATUM.providerId,
    modelId: STRATUM.modelId,
    promptProfileId: STRATUM.promptProfileId,
    runtimeId: STRATUM.runtimeId,
    presentationTier: STRATUM.presentationTier,
    candidateArtifactId: `${assignment.comparisonId}-candidate`,
    referenceArtifactId: `${assignment.comparisonId}-reference`,
  }, 'proxy-demo-seed'));
}

async function deterministicScorer(
  _packet: MaskedReviewPacket,
): Promise<ProxyPerDimensionScores> {
  return {
    directness: { A: 4, B: 4 },
    fluency: { A: 4, B: 4 },
    'meaning-preservation': { A: 4, B: 4 },
    'reference-likeness': { A: 4, B: 4 },
  };
}

function fidelityDecisions(
  reviewerAssignments: readonly ReviewerAssignment[],
): readonly EvaluationFidelityVetoDecision[] {
  return reviewerAssignments.map((assignment) => ({
    decisionVersion: 'evaluation-fidelity-veto/1.0.0',
    comparisonId: assignment.comparisonId,
    stratumId: assignment.stratumId,
    status: 'passed',
    reasonCode: 'accepted',
    absoluteVeto: false,
    checkCount: 1,
  }));
}

function gate(
  preRegistration: ReturnType<typeof registration>,
  ratings: readonly BlindReviewerRating[],
  fidelityVetoes: readonly EvaluationFidelityVetoDecision[],
): ReleaseGateDecision {
  return evaluateReleaseGate({
    preRegistration,
    claimTier: STRATUM.presentationTier,
    strata: [{
      stratumId: STRATUM.stratumId,
      fidelityVetoes,
      ratings,
    }],
  });
}

function report(
  preRegistration: ReturnType<typeof registration>,
  gateDecision: ReleaseGateDecision,
  fidelityVetoes: readonly EvaluationFidelityVetoDecision[],
) {
  return createReleaseReport({
    preRegistration,
    gateDecisions: [gateDecision],
    fidelityDecisions: fidelityVetoes,
    operationalMetrics: [{
      stratumId: STRATUM.stratumId,
      latencyMs: [1, 2, 3],
      providerCostUsd: 0,
      aggregate: aggregateLifecycleEvents([]),
    }],
  });
}

function numericDecision(
  decision: ReleaseGateDecision,
): readonly object[] {
  return decision.strata.flatMap((stratum) => stratum.dimensions.map((dimension) => ({
    dimension: dimension.dimension,
    status: dimension.status,
    reasonCode: dimension.reasonCode,
    sampleCount: dimension.sampleCount,
    meanDifference: dimension.meanDifference,
    standardDeviation: dimension.standardDeviation,
    standardError: dimension.standardError,
    confidenceInterval: dimension.confidenceInterval,
    margin: dimension.margin,
    requiredSampleSize: dimension.requiredSampleSize,
    sampleCap: dimension.sampleCap,
    releaseGatePass: dimension.releaseGatePass,
  })));
}

describe('LLM proxy reviewer provenance', () => {
  it('marks an automated end-to-end gate as provisional without changing its statistics', async () => {
    const preRegistration = registration();
    const proxyRatings = await runProxyReviewers(
      maskedBundles(preRegistration.reviewerAssignments),
      PROXY_REVIEWER_IDS.length,
      deterministicScorer,
    );
    const humanRatings = proxyRatings.map((rating): BlindReviewerRating => ({
      ...rating,
      evidenceClass: 'human',
    }));
    const mixedRatings = proxyRatings.map((rating, index): BlindReviewerRating => ({
      ...rating,
      evidenceClass: index === 0 ? 'llm-proxy' : 'human',
    }));
    const fidelityVetoes = fidelityDecisions(preRegistration.reviewerAssignments);
    const proxyGate = gate(preRegistration, proxyRatings, fidelityVetoes);
    const humanGate = gate(preRegistration, humanRatings, fidelityVetoes);
    const mixedGate = gate(preRegistration, mixedRatings, fidelityVetoes);
    const proxyReport = report(preRegistration, proxyGate, fidelityVetoes);
    const humanReport = report(preRegistration, humanGate, fidelityVetoes);

    expect(proxyRatings.length).toBeGreaterThanOrEqual(3);
    expect(new Set(proxyRatings.map((rating) => rating.reviewerId)))
      .toEqual(new Set(PROXY_REVIEWER_IDS));
    expect(proxyRatings.every((rating) => rating.evidenceClass === 'llm-proxy'))
      .toBe(true);
    expect(proxyGate).toMatchObject({
      status: 'pass',
      evidenceClass: 'llm-proxy',
      isProvisional: true,
    });
    expect(mixedGate).toMatchObject({
      evidenceClass: 'llm-proxy',
      isProvisional: true,
    });
    expect(proxyReport).toMatchObject({
      evidenceClass: 'llm-proxy',
      isProvisional: true,
    });
    expect(proxyReport.claims[0]).toMatchObject({
      evidenceClass: 'llm-proxy',
      isProvisional: true,
    });
    expect(numericDecision(proxyGate)).toEqual(numericDecision(humanGate));
    expect(() => assertHumanCertifiable(proxyGate)).toThrow(/LLM proxy/u);
    expect(() => assertHumanCertifiable(proxyReport)).toThrow(/LLM proxy/u);
    expect(() => assertHumanCertifiable(humanGate)).not.toThrow();
    expect(() => assertHumanCertifiable(humanReport)).not.toThrow();
  });
});

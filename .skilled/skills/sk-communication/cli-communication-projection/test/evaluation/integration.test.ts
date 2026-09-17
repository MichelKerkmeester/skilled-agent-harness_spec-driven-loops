// ───────────────────────────────────────────────────────────────────
// MODULE: Deterministic Evaluation Integration Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import { createExactOriginalRecord } from '../../src/contracts/index.js';
import {
  buildMaskedReviewPacket,
  calculatePoweredSampleSize,
  createReleaseReport,
  evaluateFidelityVeto,
  evaluateReleaseGate,
  freezePreRegistration,
  loadEvaluationCorpus,
  runVariancePilot,
  verifyMaskedReviewPacket,
} from '../../src/evaluation/index.js';
import { protectMarkdown } from '../../src/fidelity/index.js';
import {
  REDACTION_CANARIES,
  aggregateLifecycleEvents,
  scanForRedactionCanaries,
} from '../../src/observability/index.js';

import type {
  BlindReviewerRating,
  CreatePreRegistrationInput,
  EvaluationFidelityVetoDecision,
  EvaluationStratum,
  ReviewerAssignment,
} from '../../src/evaluation/index.js';
import type { RuntimeTelemetryRecord } from '../../src/runtimes/index.js';

const POWER_INPUT = {
  standardDeviation: 0.1,
  nonInferiorityMargin: -1,
  alpha: 0.05,
  targetPower: 0.8,
} as const;

const PASSING_STRATUM: EvaluationStratum = {
  stratumId: 'provider-a-model-a-profile-a-codex-full',
  providerId: 'provider-a',
  modelId: 'model-a',
  promptProfileId: 'profile-a',
  runtimeId: 'codex',
  presentationTier: 'full-projection',
};

const INCONCLUSIVE_STRATUM: EvaluationStratum = {
  stratumId: 'provider-b-model-b-profile-b-pi-full',
  providerId: 'provider-b',
  modelId: 'model-b',
  promptProfileId: 'profile-b',
  runtimeId: 'pi',
  presentationTier: 'full-projection',
};

const VETOED_STRATUM: EvaluationStratum = {
  stratumId: 'provider-c-model-c-profile-c-cursor-safe',
  providerId: 'provider-c',
  modelId: 'model-c',
  promptProfileId: 'profile-c',
  runtimeId: 'cursor',
  presentationTier: 'safe-native',
};

const STRATA = [
  PASSING_STRATUM,
  INCONCLUSIVE_STRATUM,
  VETOED_STRATUM,
] as const;

function assignments(stratumId: string, count: number): readonly ReviewerAssignment[] {
  return Array.from({ length: count / 3 }, (_, comparisonIndex) => ({
    stratumId,
    comparisonId: `${stratumId}-comparison-${comparisonIndex}`,
    reviewerIds: ['reviewer-0', 'reviewer-1', 'reviewer-2'],
  }));
}

function registration() {
  const count = calculatePoweredSampleSize(POWER_INPUT).pairedRatingsPerStratum;
  const input: CreatePreRegistrationInput = {
    frozenAt: '2026-08-12T08:00:00.000Z',
    strata: STRATA,
    samplePlanInputs: STRATA.map((stratum) => ({
      stratumId: stratum.stratumId,
      power: POWER_INPUT,
    })),
    reviewerAssignments: STRATA.flatMap((stratum) => assignments(stratum.stratumId, count)),
    randomizationSeed: 'integration-blind-seed',
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

function ratings(
  reviewerAssignments: readonly ReviewerAssignment[],
  difference: (index: number) => number,
): readonly BlindReviewerRating[] {
  let ratingIndex = 0;
  return reviewerAssignments.flatMap((assignment) =>
    assignment.reviewerIds.map((reviewerId) => {
      const candidateScore = difference(ratingIndex);
      ratingIndex += 1;
      return {
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
          directness: 0,
          fluency: 0,
          'meaning-preservation': 0,
          'reference-likeness': 0,
        },
      };
    }));
}

async function fidelityDecisions(
  reviewerAssignments: readonly ReviewerAssignment[],
  stratumId: string,
  vetoFirst: boolean,
): Promise<readonly EvaluationFidelityVetoDecision[]> {
  const corpus = loadEvaluationCorpus().cases;
  const secretCanary = REDACTION_CANARIES[0]?.value;
  if (secretCanary === undefined) {
    throw new Error('Expected a synthetic redaction canary.');
  }
  const decisions: EvaluationFidelityVetoDecision[] = [];
  for (const [index, assignment] of reviewerAssignments.entries()) {
    const evaluationCase = corpus[index % corpus.length];
    if (evaluationCase === undefined) {
      throw new Error('Expected a synthetic evaluation case.');
    }
    const source = `Keep \`${evaluationCase.id}\` and \`${secretCanary}\` unchanged.`;
    const exactOriginal = createExactOriginalRecord(
      `${assignment.comparisonId}-original`,
      new TextEncoder().encode(source),
      'text/markdown; charset=utf-8',
      {
        sourceFamily: 'synthetic-integration',
        sourceVersion: '1.0.0',
        captureMethod: 'synthetic',
        sanitizationStatus: 'synthetic',
        capturedAt: '2026-08-12T00:00:00.000Z',
      },
    );
    const protectedResult = protectMarkdown({ sourceText: source, exactOriginal });
    if (protectedResult.status !== 'protected') {
      throw new Error('Expected a protected synthetic document.');
    }
    decisions.push(await evaluateFidelityVeto({
      comparisonId: assignment.comparisonId,
      stratumId,
      validation: {
        protection: protectedResult.document,
        candidateText: vetoFirst && index === 0
          ? 'Keep the identifiers changed.'
          : protectedResult.document.encodedText,
        providerTerminal: 'success',
        allPartsComplete: true,
        currentSourceSha256: protectedResult.document.sourceSha256,
      },
    }));
  }
  return decisions;
}

function runtimeTelemetry(
  stratum: EvaluationStratum,
  status: RuntimeTelemetryRecord['status'],
  reasonCode: RuntimeTelemetryRecord['reasonCode'],
): RuntimeTelemetryRecord {
  return {
    telemetryVersion: 'runtime-telemetry/1.0.0',
    eventName: 'runtime-adapter-terminal',
    runtime: stratum.runtimeId,
    pathId: `${stratum.runtimeId}-synthetic-path`,
    presentationTier: stratum.presentationTier,
    status,
    reasonCode,
  };
}

describe('deterministic evaluation-to-report integration', () => {
  it('fails closed across statistical, fidelity, operational, and privacy boundaries', async () => {
    const corpus = loadEvaluationCorpus();
    const secretCanary = REDACTION_CANARIES[0]?.value;
    if (secretCanary === undefined) {
      throw new Error('Expected a synthetic redaction canary.');
    }
    const pilot = await runVariancePilot({
      corpus: corpus.cases,
      strata: STRATA.map(({ providerId, modelId, promptProfileId }) => ({
        providerId,
        modelId,
        promptProfileId,
      })),
      samplesPerStratum: corpus.cases.length,
      produceCandidate: ({ evaluationCase, sampleIndex }) =>
        `${secretCanary}:${evaluationCase.id}:${sampleIndex}`,
      scoreCandidate: ({ sampleIndex }) => sampleIndex + 1,
    });
    const preRegistration = registration();
    const assignmentsByStratum = new Map(STRATA.map((stratum) => [
      stratum.stratumId,
      preRegistration.reviewerAssignments.filter(
        (assignment) => assignment.stratumId === stratum.stratumId,
      ),
    ]));

    const maskedPackets = preRegistration.reviewerAssignments.map((assignment) => {
      const stratum = preRegistration.strata.find(
        (entry) => entry.stratumId === assignment.stratumId,
      );
      if (stratum === undefined) {
        throw new Error('Expected a registered synthetic stratum.');
      }
      const identity = {
        comparisonId: assignment.comparisonId,
        stratumId: stratum.stratumId,
        providerId: stratum.providerId,
        modelId: stratum.modelId,
        promptProfileId: stratum.promptProfileId,
        runtimeId: stratum.runtimeId,
        presentationTier: stratum.presentationTier,
        candidateArtifactId: `${assignment.comparisonId}-candidate`,
        referenceArtifactId: `${assignment.comparisonId}-reference`,
      };
      const bundle = buildMaskedReviewPacket(identity, preRegistration.randomizationSeed);
      expect(verifyMaskedReviewPacket(bundle.packet, identity)).toBe(true);
      return bundle.packet;
    });

    const passingAssignments = assignmentsByStratum.get(PASSING_STRATUM.stratumId) ?? [];
    const inconclusiveAssignments = assignmentsByStratum.get(INCONCLUSIVE_STRATUM.stratumId) ?? [];
    const vetoedAssignments = assignmentsByStratum.get(VETOED_STRATUM.stratumId) ?? [];
    const passingFidelity = await fidelityDecisions(
      passingAssignments,
      PASSING_STRATUM.stratumId,
      false,
    );
    const inconclusiveFidelity = await fidelityDecisions(
      inconclusiveAssignments,
      INCONCLUSIVE_STRATUM.stratumId,
      false,
    );
    const vetoedFidelity = await fidelityDecisions(
      vetoedAssignments,
      VETOED_STRATUM.stratumId,
      true,
    );
    const fullGate = evaluateReleaseGate({
      preRegistration,
      claimTier: 'full-projection',
      strata: [
        {
          stratumId: PASSING_STRATUM.stratumId,
          fidelityVetoes: passingFidelity,
          ratings: ratings(passingAssignments, () => 0),
        },
        {
          stratumId: INCONCLUSIVE_STRATUM.stratumId,
          fidelityVetoes: inconclusiveFidelity,
          ratings: ratings(
            inconclusiveAssignments,
            (index) => index % 2 === 0 ? 0.9 : -1.1,
          ),
        },
      ],
    });
    const safeGate = evaluateReleaseGate({
      preRegistration,
      claimTier: 'safe-native',
      strata: [{
        stratumId: VETOED_STRATUM.stratumId,
        fidelityVetoes: vetoedFidelity,
        ratings: ratings(vetoedAssignments, () => 1),
      }],
    });
    const aggregates = new Map(STRATA.map((stratum) => [
      stratum.stratumId,
      aggregateLifecycleEvents([
        runtimeTelemetry(stratum, 'projection', 'none'),
        runtimeTelemetry(stratum, 'exact-original', 'timeout'),
        runtimeTelemetry(stratum, 'degraded', 'atomic-replace-unavailable'),
      ]),
    ]));
    const report = createReleaseReport({
      preRegistration,
      gateDecisions: [safeGate, fullGate],
      fidelityDecisions: [
        ...vetoedFidelity,
        ...inconclusiveFidelity,
        ...passingFidelity,
      ],
      operationalMetrics: STRATA.map((stratum, index) => {
        const aggregate = aggregates.get(stratum.stratumId);
        if (aggregate === undefined) {
          throw new Error('Expected a synthetic observability aggregate.');
        }
        return {
          stratumId: stratum.stratumId,
          latencyMs: [index + 3, index + 1, index + 2],
          providerCostUsd: index / 100,
          aggregate,
        };
      }),
    });

    const passing = report.strata.find(
      (stratum) => stratum.stratumId === PASSING_STRATUM.stratumId,
    );
    const inconclusive = report.strata.find(
      (stratum) => stratum.stratumId === INCONCLUSIVE_STRATUM.stratumId,
    );
    const vetoed = report.strata.find(
      (stratum) => stratum.stratumId === VETOED_STRATUM.stratumId,
    );
    expect(pilot).toHaveLength(3);
    expect(pilot.every((estimate) =>
      new Set(estimate.samples.map((sample) => sample.caseId)).size === corpus.cases.length))
      .toBe(true);
    expect(maskedPackets).toHaveLength(preRegistration.reviewerAssignments.length);
    expect(passing?.gate.status).toBe('pass');
    expect(passing?.fidelity.passed).toBe(true);
    expect(inconclusive?.gate).toMatchObject({
      status: 'fail',
      reasonCode: 'noninferiority-fail',
    });
    expect(inconclusive?.gate.dimensions.every((dimension) =>
      dimension.reasonCode === 'inconclusive-at-sample-cap')).toBe(true);
    expect(vetoed?.gate).toMatchObject({
      status: 'fail',
      reasonCode: 'fidelity-veto',
    });
    expect(vetoed?.fidelity.vetoedCount).toBe(1);
    expect(report.claims.every((claim) => claim.releaseApproved === false)).toBe(true);
    expect(scanForRedactionCanaries([
      pilot,
      preRegistration,
      maskedPackets,
      passingFidelity,
      inconclusiveFidelity,
      vetoedFidelity,
      fullGate,
      safeGate,
      [...aggregates.values()],
      report,
    ])).toEqual([]);
    expect(JSON.stringify(report)).not.toContain(secretCanary);
  });
});

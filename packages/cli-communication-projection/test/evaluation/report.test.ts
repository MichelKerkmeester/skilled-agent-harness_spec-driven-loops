// ───────────────────────────────────────────────────────────────────
// MODULE: Evaluation Release Report Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import {
  calculatePoweredSampleSize,
  createReleaseReport,
  freezePreRegistration,
} from '../../src/evaluation/index.js';
import { aggregateLifecycleEvents } from '../../src/observability/index.js';

import type {
  CreatePreRegistrationInput,
  EvaluationFidelityVetoDecision,
  EvaluationStratum,
  ReleaseGateDecision,
  ReviewerAssignment,
} from '../../src/evaluation/index.js';

const POWER_INPUT = {
  standardDeviation: 0.1,
  nonInferiorityMargin: -1,
  alpha: 0.05,
  targetPower: 0.8,
} as const;

const STRATA: readonly EvaluationStratum[] = [
  {
    stratumId: 'z-safe-stratum',
    providerId: 'provider-z',
    modelId: 'model-z',
    promptProfileId: 'profile-z',
    runtimeId: 'pi',
    presentationTier: 'safe-native',
  },
  {
    stratumId: 'a-full-stratum',
    providerId: 'provider-a',
    modelId: 'model-a',
    promptProfileId: 'profile-a',
    runtimeId: 'codex',
    presentationTier: 'full-projection',
  },
];

function assignments(stratumId: string, count: number): readonly ReviewerAssignment[] {
  const result: ReviewerAssignment[] = [];
  for (let offset = 0; offset < count; offset += 3) {
    result.push({
      stratumId,
      comparisonId: `${stratumId}-comparison-${offset / 3}`,
      reviewerIds: ['reviewer-0', 'reviewer-1', 'reviewer-2'],
    });
  }
  return result;
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
    randomizationSeed: 'report-seed',
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

function gate(
  presentationTier: EvaluationStratum['presentationTier'],
  stratumId: string,
): ReleaseGateDecision {
  return {
    gateVersion: 'evaluation-release-gate/1.0.0',
    claimTier: presentationTier,
    status: 'pass',
    reasonCode: 'lower-bounds-clear-margins',
    releaseApproved: true,
    diagnosticMetricCount: 0,
    strata: [{
      stratumId,
      presentationTier,
      status: 'pass',
      reasonCode: 'lower-bounds-clear-margins',
      fidelityPassed: true,
      dimensions: [],
    }],
  };
}

function fidelity(stratumId: string): EvaluationFidelityVetoDecision {
  return {
    decisionVersion: 'evaluation-fidelity-veto/1.0.0',
    comparisonId: `${stratumId}-comparison-0`,
    stratumId,
    status: 'passed',
    reasonCode: 'accepted',
    absoluteVeto: false,
    checkCount: 4,
  };
}

function reportInput() {
  const preRegistration = registration();
  return {
    preRegistration,
    gateDecisions: [
      gate('safe-native', 'z-safe-stratum'),
      gate('full-projection', 'a-full-stratum'),
    ],
    fidelityDecisions: preRegistration.reviewerAssignments.map((assignment) => ({
      ...fidelity(assignment.stratumId),
      comparisonId: assignment.comparisonId,
    })),
    operationalMetrics: [
      {
        stratumId: 'z-safe-stratum',
        latencyMs: [9, 3, 7, 5],
        providerCostUsd: 0,
        aggregate: aggregateLifecycleEvents([]),
      },
      {
        stratumId: 'a-full-stratum',
        latencyMs: [40, 10, 30, 20],
        providerCostUsd: 0.125,
        aggregate: aggregateLifecycleEvents([]),
      },
    ],
  } as const;
}

describe('stratified release report', () => {
  it('is byte-reproducible and preserves every independent coordinate', () => {
    const input = reportInput();
    const first = Buffer.from(JSON.stringify(createReleaseReport(input)));
    const second = Buffer.from(JSON.stringify(createReleaseReport({
      ...input,
      gateDecisions: [...input.gateDecisions].reverse(),
      fidelityDecisions: [...input.fidelityDecisions].reverse(),
      operationalMetrics: [...input.operationalMetrics].reverse().map((entry) => ({
        ...entry,
        latencyMs: [...entry.latencyMs].reverse(),
      })),
    })));

    expect(first.equals(second)).toBe(true);
    const report = JSON.parse(first.toString('utf8')) as ReturnType<typeof createReleaseReport>;
    expect(report.reproducibilityDigest).toMatch(/^sha256:[a-f0-9]{64}$/u);
    expect(report.strata.map((stratum) => ({
      providerId: stratum.providerId,
      modelId: stratum.modelId,
      promptProfileId: stratum.promptProfileId,
      runtimeId: stratum.runtimeId,
      presentationTier: stratum.presentationTier,
    }))).toEqual([
      {
        providerId: 'provider-a',
        modelId: 'model-a',
        promptProfileId: 'profile-a',
        runtimeId: 'codex',
        presentationTier: 'full-projection',
      },
      {
        providerId: 'provider-z',
        modelId: 'model-z',
        promptProfileId: 'profile-z',
        runtimeId: 'pi',
        presentationTier: 'safe-native',
      },
    ]);
  });

  it('never lets a safe-native pass satisfy a full-projection claim', () => {
    const input = reportInput();
    const report = createReleaseReport({
      ...input,
      gateDecisions: [gate('safe-native', 'z-safe-stratum')],
    });

    expect(report.claims).toEqual([
      expect.objectContaining({
        presentationTier: 'full-projection',
        status: 'fail',
        releaseApproved: false,
        reasonCode: 'missing-gate-decision',
      }),
      expect.objectContaining({
        presentationTier: 'safe-native',
        status: 'pass',
        releaseApproved: true,
      }),
    ]);
  });

  it('includes latency, cost, rejection, fallback, timeout, and degraded rates', () => {
    const input = reportInput();
    const aggregate = {
      ...aggregateLifecycleEvents([]),
      eventCount: 10,
      counters: {
        accepted: 4,
        rejected: 2,
        timeout: 1,
        cancelled: 0,
        fallback: 3,
        degraded: 2,
      },
      rates: {
        accepted: 0.4,
        rejected: 0.2,
        timeout: 0.1,
        cancelled: 0,
        fallback: 0.3,
        degraded: 0.2,
      },
    } as const;
    const report = createReleaseReport({
      ...input,
      operationalMetrics: input.operationalMetrics.map((entry) =>
        entry.stratumId === 'a-full-stratum' ? { ...entry, aggregate } : entry),
    });

    expect(report.strata[0]?.operationalMetrics).toEqual({
      latencySampleCount: 4,
      p50LatencyMs: 20,
      p95LatencyMs: 40,
      providerCostUsd: 0.125,
      observabilityEventCount: 10,
      rejectionRate: 0.2,
      fallbackRate: 0.3,
      timeoutRate: 0.1,
      degradedRenderRate: 0.2,
    });
  });

  it('copies no prompts, candidates, protected spans, or canary content', () => {
    const input = reportInput();
    const report = createReleaseReport({
      ...input,
      gateDecisions: input.gateDecisions.map((decision) => ({
        ...decision,
        rawPrompt: 'RAW_PROMPT_CONTENT_CANARY',
        candidateText: 'RAW_CANDIDATE_CONTENT_CANARY',
        protectedSpans: ['RAW_PROTECTED_SPAN_CONTENT_CANARY'],
      })),
    });
    const serialized = JSON.stringify(report);

    expect(serialized).not.toContain('RAW_PROMPT_CONTENT_CANARY');
    expect(serialized).not.toContain('RAW_CANDIDATE_CONTENT_CANARY');
    expect(serialized).not.toContain('RAW_PROTECTED_SPAN_CONTENT_CANARY');
    expect(serialized).not.toContain('rawPrompt');
    expect(serialized).not.toContain('candidateText');
    expect(serialized).not.toContain('protectedSpans');
  });
});

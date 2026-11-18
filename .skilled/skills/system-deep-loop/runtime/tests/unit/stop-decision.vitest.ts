// ───────────────────────────────────────────────────────────────────
// MODULE: Stop Decision
// ───────────────────────────────────────────────────────────────────
import { describe, expect, it } from 'vitest';

import { createRequire } from 'node:module';

const requireCjs = createRequire(import.meta.url);

type LoopType = 'research' | 'review';
type GraphDecision = 'STOP_ALLOWED' | 'STOP_BLOCKED' | 'CONTINUE';

interface StopConfig {
  maxIterations: number;
  minIterations: number;
  convergenceThreshold: number;
  stopPolicy: string;
  stuckThreshold: number;
  convergenceMode: string;
  depthMode?: string;
}

interface IterationRecord {
  answeredQuestions?: string[];
  keyQuestions?: string[];
}

interface ResearchFacts {
  answeredCount: number;
  totalQuestions: number;
  answeredQuestionSourceCounts: Record<string, number> | null;
  iterationRecords: IterationRecord[];
  frontierOpen?: number;
}

interface ReviewApplicability {
  scopeClass: string;
  enforcement: string;
  evidenceRefs: unknown;
}

interface ReviewFacts {
  totalDimensions: number;
  missingDimensions: string[];
  coverageAge: number;
  traceabilityCovered: boolean;
  unfinishedCoreProtocols: string[];
  activeP0: number;
  activeP1: number;
  evidenceBackedP0P1: number;
  hotspotSaturated: boolean | null;
  lastClaimAdjudicationPassed: boolean | null;
  securitySensitiveFixScope: boolean;
  fixReplayRequiredRows: number;
  fixReplayPassingRows: number;
  reviewDepthSchemaVersion: number | null;
  reviewDepthApplicability: ReviewApplicability | null;
  searchDebt: unknown[];
  candidateCovered: string[];
  requiredBugClasses: string[];
  graphCoverageMode: 'graph' | 'graphless_fallback' | 'unavailable_blocked' | null;
  fallbackCoveredBugClasses: string[];
  frontierOpen?: number;
  frontierTotal?: number;
  frontierAnswered?: number;
}

interface StopDecisionInput {
  loopType: LoopType;
  iterationCount: number;
  stuckCount: number;
  consecutiveFailureCount?: number;
  config: StopConfig;
  ratios: number[];
  research: ResearchFacts | null;
  review: ReviewFacts | null;
  graphDecision: GraphDecision | null;
  graphBlockers: unknown[];
}

interface StopSignalCoverage {
  answered?: number;
  covered?: number;
  total: number;
  traceabilityCovered?: boolean;
  coverageAge?: number;
}

interface StopSignal {
  available: boolean;
  weight: number;
  value: number | null;
  stop: boolean;
}

interface StopSignalsResult {
  signals: Record<string, StopSignal>;
  weightedStopScore: number;
  stopCandidate: boolean;
  noProgress: boolean;
}

interface GuardResult {
  status: 'passed' | 'failed' | 'notEvaluated';
  passed: boolean;
  violations: string[];
}

interface QualityGuardsResult {
  passed: boolean;
  guards: Record<string, GuardResult>;
}

interface GateResult {
  pass: boolean;
  skipped: boolean;
  [key: string]: unknown;
}

interface LegalStopGatesResult {
  passed: boolean;
  gates: Record<string, GateResult>;
  failed: string[];
}

interface GraphCombination {
  decision: 'STOP' | 'BLOCKED' | 'CONTINUE';
  stopReason: string | null;
  reasonDetail: string;
  blockedBy: string[];
}

interface StopDecision {
  decision: 'STOP' | 'BLOCKED' | 'STUCK_RECOVERY' | 'CONTINUE';
  stopReason: string | null;
  reasonDetail: string;
  weightedStopScore: number;
  signals: Record<string, StopSignal>;
  gates: Record<string, unknown>;
  blockedBy: string[];
  graphDecision: GraphDecision | null;
  inputs: StopDecisionInput;
}

const {
  buildStopDecision,
  buildStopDecisionInput,
  combineGraphDecision,
  computeStopSignals,
  evaluateResearchQualityGuards,
  evaluateReviewLegalStopGates,
  mapReviewThresholds,
  reviewUnfinishedCoreProtocols,
} = requireCjs('../../scripts/convergence.cjs') as {
  buildStopDecision: (input: StopDecisionInput) => StopDecision;
  buildStopDecisionInput: (
    args: Record<string, unknown>,
    loopType: string,
    files: Record<string, unknown>,
    graph: Record<string, unknown>,
  ) => StopDecisionInput;
  combineGraphDecision: (
    candidate: { reasonDetail: string },
    graphDecision: GraphDecision | null | undefined,
    graphBlockers: unknown[],
  ) => GraphCombination;
  computeStopSignals: (args: {
    loopType: LoopType;
    ratios: number[];
    convergenceThreshold?: number;
    coverage: StopSignalCoverage;
  }) => StopSignalsResult;
  evaluateResearchQualityGuards: (args: {
    answeredQuestionSourceCounts: Record<string, number> | null;
    iterationRecords: IterationRecord[];
  }) => QualityGuardsResult;
  evaluateReviewLegalStopGates: (
    review: ReviewFacts,
    options: { weightedStopScore: number; hardStop: boolean },
  ) => LegalStopGatesResult;
  mapReviewThresholds: (convergenceThreshold?: number) => {
    convergenceThreshold: number;
    rollingAverageCutoff: number;
    noProgressCutoff: number;
  };
  reviewUnfinishedCoreProtocols: (
    config: { crossReference?: { core?: unknown[] } },
    registry: { traceability?: { results?: unknown[] } },
  ) => string[];
};

type InputOverrides = Partial<Omit<StopDecisionInput, 'config' | 'research' | 'review'>> & {
  config?: Partial<StopConfig>;
  research?: Partial<ResearchFacts> | null;
  review?: Partial<ReviewFacts> | null;
};

const researchBase = (): ResearchFacts => ({
  answeredCount: 4,
  totalQuestions: 4,
  answeredQuestionSourceCounts: { q1: 2 },
  iterationRecords: [{ answeredQuestions: ['q1'], keyQuestions: ['q1', 'q2'] }],
});

const reviewBase = (): ReviewFacts => ({
  totalDimensions: 4,
  missingDimensions: [],
  coverageAge: 1,
  traceabilityCovered: true,
  unfinishedCoreProtocols: [],
  activeP0: 0,
  activeP1: 0,
  evidenceBackedP0P1: 0,
  hotspotSaturated: true,
  lastClaimAdjudicationPassed: true,
  securitySensitiveFixScope: false,
  fixReplayRequiredRows: 0,
  fixReplayPassingRows: 0,
  reviewDepthSchemaVersion: null,
  reviewDepthApplicability: null,
  searchDebt: [],
  candidateCovered: [],
  requiredBugClasses: [],
  graphCoverageMode: null,
  fallbackCoveredBugClasses: [],
});

function mergeSection<T extends object>(
  base: T | null,
  patch: Partial<T> | null | undefined,
): T | null {
  if (patch === null || base === null) return null;
  if (patch === undefined) return base;
  return { ...base, ...patch };
}

function mergeInput(base: StopDecisionInput, overrides: InputOverrides): StopDecisionInput {
  const { config, research, review, ...rest } = overrides;
  return {
    ...base,
    ...rest,
    config: { ...base.config, ...(config ?? {}) },
    research: mergeSection(base.research, research),
    review: mergeSection(base.review, review),
  };
}

function researchInput(overrides: InputOverrides = {}): StopDecisionInput {
  return mergeInput(
    {
      loopType: 'research',
      iterationCount: 5,
      stuckCount: 0,
      config: {
        maxIterations: 10,
        minIterations: 3,
        convergenceThreshold: 0.05,
        stopPolicy: 'convergence',
        stuckThreshold: 3,
        convergenceMode: 'default',
      },
      ratios: [0.4, 0.3, 0.2],
      research: researchBase(),
      review: null,
      graphDecision: 'STOP_ALLOWED',
      graphBlockers: [],
    },
    overrides,
  );
}

function reviewInput(overrides: InputOverrides = {}): StopDecisionInput {
  return mergeInput(
    {
      loopType: 'review',
      iterationCount: 3,
      stuckCount: 0,
      config: {
        maxIterations: 7,
        minIterations: 0,
        convergenceThreshold: 0.1,
        stopPolicy: 'convergence',
        stuckThreshold: 2,
        convergenceMode: 'default',
      },
      ratios: [0.3, 0.2],
      research: null,
      review: reviewBase(),
      graphDecision: 'STOP_ALLOWED',
      graphBlockers: [],
    },
    overrides,
  );
}

const reviewFacts = (overrides: Partial<ReviewFacts> = {}): ReviewFacts => ({
  ...reviewBase(),
  ...overrides,
});

const legalGates = (
  review: Partial<ReviewFacts> = {},
  options: { hardStop?: boolean; weightedStopScore?: number } = {},
): LegalStopGatesResult =>
  evaluateReviewLegalStopGates(reviewFacts(review), {
    weightedStopScore: options.weightedStopScore ?? 0.75,
    hardStop: options.hardStop ?? true,
  });

const guardsFor = (
  overrides: {
    answeredQuestionSourceCounts?: Record<string, number> | null;
    iterationRecords?: IterationRecord[];
  } = {},
): QualityGuardsResult =>
  evaluateResearchQualityGuards({
    answeredQuestionSourceCounts: { q1: 2 },
    iterationRecords: [{ answeredQuestions: ['q1'], keyQuestions: ['q1', 'q2'] }],
    ...overrides,
  });

const FROZEN_STOP_REASONS = [
  'converged',
  'maxIterationsReached',
  'blockedStop',
  'stuckRecovery',
  'error',
  'manualStop',
  'userPaused',
  'maxDurationReached',
];

describe('thresholds', () => {
  it('defaults the cutoffs when the threshold is missing', () => {
    expect(mapReviewThresholds(undefined)).toEqual({
      convergenceThreshold: 0.1,
      rollingAverageCutoff: 0.08,
      noProgressCutoff: 0.05,
    });
  });

  it('maps a 0.10 threshold', () => {
    expect(mapReviewThresholds(0.1)).toEqual({
      convergenceThreshold: 0.1,
      rollingAverageCutoff: 0.08,
      noProgressCutoff: 0.05,
    });
  });

  it('maps a 0.20 threshold', () => {
    expect(mapReviewThresholds(0.2)).toEqual({
      convergenceThreshold: 0.2,
      rollingAverageCutoff: 0.16,
      noProgressCutoff: 0.1,
    });
  });
});

describe('signals', () => {
  it('marks every research signal unavailable when there is no data', () => {
    const result = computeStopSignals({
      loopType: 'research',
      ratios: [],
      convergenceThreshold: 0.05,
      coverage: { answered: 0, total: 0 },
    });

    expect(Object.keys(result.signals)).toEqual([
      'rollingAverage',
      'madNoiseFloor',
      'questionEntropy',
    ]);
    for (const signal of Object.values(result.signals)) {
      expect(signal.available).toBe(false);
      expect(signal.value).toBeNull();
      expect(signal.stop).toBe(false);
    }
    expect(result.weightedStopScore).toBe(0);
    expect(result.stopCandidate).toBe(false);
  });

  it('scores research convergence from three signals', () => {
    const result = computeStopSignals({
      loopType: 'research',
      ratios: [0.5, 0.01, 0.01, 0.01],
      convergenceThreshold: 0.05,
      coverage: { answered: 9, total: 10 },
    });

    expect(result.signals.rollingAverage.stop).toBe(true);
    expect(result.signals.madNoiseFloor.stop).toBe(false);
    expect(result.signals.questionEntropy.stop).toBe(true);
    expect(result.weightedStopScore).toBe(0.65);
    expect(result.stopCandidate).toBe(true);
  });

  it('redistributes weight across available research signals', () => {
    const result = computeStopSignals({
      loopType: 'research',
      ratios: [0.01, 0.01, 0.01],
      convergenceThreshold: 0.05,
      coverage: { answered: 0, total: 0 },
    });

    expect(result.signals.rollingAverage.available).toBe(true);
    expect(result.signals.madNoiseFloor.available).toBe(false);
    expect(result.signals.questionEntropy.available).toBe(false);
    expect(result.weightedStopScore).toBe(1);
    expect(result.stopCandidate).toBe(true);
  });

  it('scores review convergence with the mapped cutoffs', () => {
    const result = computeStopSignals({
      loopType: 'review',
      ratios: [0.5, 0.02, 0.02],
      convergenceThreshold: undefined,
      coverage: { covered: 4, total: 4, traceabilityCovered: true, coverageAge: 1 },
    });

    expect(result.signals.rollingAverage.stop).toBe(true);
    expect(result.signals.madNoiseFloor.stop).toBe(false);
    expect(result.signals.dimensionCoverage.stop).toBe(true);
    expect(result.weightedStopScore).toBe(0.75);
    expect(result.stopCandidate).toBe(true);
    expect(result.noProgress).toBe(true);
  });

  it('holds review below the cutoffs when the threshold is tight', () => {
    const result = computeStopSignals({
      loopType: 'review',
      ratios: [0.5, 0.02, 0.02],
      convergenceThreshold: 0.02,
      coverage: { covered: 3, total: 4, traceabilityCovered: true, coverageAge: 1 },
    });

    expect(result.signals.rollingAverage.stop).toBe(false);
    expect(result.signals.dimensionCoverage.stop).toBe(false);
    expect(result.weightedStopScore).toBe(0);
    expect(result.stopCandidate).toBe(false);
    expect(result.noProgress).toBe(false);
  });
});

describe('quality guards', () => {
  it('passes every guard on a focused, diversified record', () => {
    const result = guardsFor();

    expect(result.passed).toBe(true);
    expect(result.guards.sourceDiversity).toMatchObject({
      status: 'passed',
      passed: true,
      violations: [],
    });
    expect(result.guards.focusAlignment).toMatchObject({
      status: 'passed',
      passed: true,
      violations: [],
    });
    expect(result.guards.singleWeakSource).toMatchObject({
      status: 'notEvaluated',
      passed: true,
      violations: [],
    });
  });

  it('fails source diversity when a question has a single source', () => {
    const result = guardsFor({ answeredQuestionSourceCounts: { q1: 1, q2: 2 } });

    expect(result.passed).toBe(false);
    expect(result.guards.sourceDiversity).toMatchObject({
      status: 'failed',
      passed: false,
      violations: ['q1'],
    });
  });

  it('skips source diversity when no source counts are available', () => {
    const result = guardsFor({ answeredQuestionSourceCounts: null });

    expect(result.guards.sourceDiversity).toMatchObject({
      status: 'notEvaluated',
      passed: true,
      violations: [],
    });
    expect(result.passed).toBe(true);
  });

  it('fails focus alignment when an answered question is not a key question', () => {
    const result = guardsFor({
      iterationRecords: [{ answeredQuestions: ['q2'], keyQuestions: ['q1'] }],
    });

    expect(result.passed).toBe(false);
    expect(result.guards.focusAlignment).toMatchObject({
      status: 'failed',
      passed: false,
      violations: ['q2'],
    });
  });

  it('skips focus alignment when no record carries key questions', () => {
    const result = guardsFor({
      iterationRecords: [{ answeredQuestions: ['q1'] }, { keyQuestions: ['q1'] }],
    });

    expect(result.guards.focusAlignment).toMatchObject({
      status: 'notEvaluated',
      passed: true,
      violations: [],
    });
    expect(result.passed).toBe(true);
  });

  it('always leaves single weak source not evaluated', () => {
    const passing = guardsFor();
    const failing = guardsFor({ answeredQuestionSourceCounts: { q1: 1 } });

    expect(passing.guards.singleWeakSource).toMatchObject({
      status: 'notEvaluated',
      passed: true,
      violations: [],
    });
    expect(failing.guards.singleWeakSource).toMatchObject({
      status: 'notEvaluated',
      passed: true,
      violations: [],
    });
  });

  it('continues below the cap when a quality guard fails', () => {
    const decision = buildStopDecision(
      researchInput({
        research: { iterationRecords: [{ answeredQuestions: ['q9'], keyQuestions: ['q1'] }] },
      }),
    );

    expect(decision.decision).toBe('CONTINUE');
    expect(decision.stopReason).toBeNull();
    expect(decision.reasonDetail).toBe('qualityGuardFailed');
    expect(decision.blockedBy).toEqual(['focusAlignment']);

    const gates = decision.gates as { qualityGuards: QualityGuardsResult };
    expect(gates.qualityGuards.guards.focusAlignment.passed).toBe(false);
  });
});

describe('legal-stop gates', () => {
  it('passes the base review object with no failed gates', () => {
    const result = legalGates();

    expect(result.passed).toBe(true);
    expect(result.failed).toEqual([]);
    expect(Object.keys(result.gates)).toEqual([
      'convergenceGate',
      'dimensionCoverageGate',
      'p0ResolutionGate',
      'evidenceDensityGate',
      'hotspotSaturationGate',
      'claimAdjudicationGate',
      'fixCompletenessReplayGate',
      'candidateCoverageGate',
      'graphlessFallbackGate',
    ]);
  });

  it('fails only the convergence gate when the score is low and no hard stop applies', () => {
    const result = legalGates({}, { hardStop: false, weightedStopScore: 0.5 });

    expect(result.gates.convergenceGate).toMatchObject({ pass: false, skipped: false });
    expect(result.failed).toEqual(['convergenceGate']);
  });

  it('fails only the dimension coverage gate when a dimension is missing', () => {
    const result = legalGates({ missingDimensions: ['security'] });

    expect(result.gates.dimensionCoverageGate).toMatchObject({ pass: false, skipped: false });
    expect(result.failed).toEqual(['dimensionCoverageGate']);
  });

  it('fails only the P0 resolution gate when a P0 is active', () => {
    const result = legalGates({ activeP0: 1, evidenceBackedP0P1: 1 });

    expect(result.gates.p0ResolutionGate).toMatchObject({ pass: false, skipped: false });
    expect(result.gates.evidenceDensityGate.pass).toBe(true);
    expect(result.failed).toEqual(['p0ResolutionGate']);
  });

  it('fails only the evidence density gate when evidence does not cover active findings', () => {
    const result = legalGates({ activeP1: 1, evidenceBackedP0P1: 0 });

    expect(result.gates.evidenceDensityGate).toMatchObject({ pass: false, skipped: false });
    expect(result.failed).toEqual(['evidenceDensityGate']);
  });

  it('fails only the hotspot saturation gate when the hotspot is not saturated', () => {
    const result = legalGates({ hotspotSaturated: false });

    expect(result.gates.hotspotSaturationGate).toMatchObject({ pass: false, skipped: false });
    expect(result.failed).toEqual(['hotspotSaturationGate']);
  });

  it('fails only the claim adjudication gate when the last claim failed with active findings', () => {
    const result = legalGates({
      activeP1: 1,
      evidenceBackedP0P1: 1,
      lastClaimAdjudicationPassed: false,
    });

    expect(result.gates.claimAdjudicationGate).toMatchObject({ pass: false, skipped: false });
    expect(result.failed).toEqual(['claimAdjudicationGate']);
  });

  it('fails only the fix replay gate when a security sensitive fix lacks replay', () => {
    const result = legalGates({
      securitySensitiveFixScope: true,
      fixReplayRequiredRows: 2,
      fixReplayPassingRows: 1,
    });

    expect(result.gates.fixCompletenessReplayGate).toMatchObject({ pass: false, skipped: false });
    expect(result.failed).toEqual(['fixCompletenessReplayGate']);
  });

  it('fails only the candidate coverage gate when search debt remains and no class is covered', () => {
    const result = legalGates({
      reviewDepthSchemaVersion: 2,
      reviewDepthApplicability: {
        scopeClass: 'standard',
        enforcement: 'enforce',
        evidenceRefs: ['e1'],
      },
      searchDebt: ['unguarded-input'],
      requiredBugClasses: ['injection'],
      candidateCovered: [],
    });

    expect(result.gates.candidateCoverageGate).toMatchObject({ pass: false, skipped: false });
    expect(result.failed).toEqual(['candidateCoverageGate']);
  });

  it('fails only the graphless fallback gate on unavailable graph coverage', () => {
    const result = legalGates({
      reviewDepthSchemaVersion: 2,
      reviewDepthApplicability: {
        scopeClass: 'trivial',
        enforcement: 'skip',
        evidenceRefs: ['e1'],
      },
      graphCoverageMode: 'unavailable_blocked',
    });

    expect(result.gates.graphlessFallbackGate).toMatchObject({ pass: false, skipped: false });
    expect(result.gates.candidateCoverageGate.pass).toBe(true);
    expect(result.failed).toEqual(['graphlessFallbackGate']);
  });

  it('skips both schema dependent gates unless the review depth schema is version 2', () => {
    for (const reviewDepthSchemaVersion of [null, 1, 3]) {
      const result = legalGates({ reviewDepthSchemaVersion });

      expect(result.gates.candidateCoverageGate).toMatchObject({ pass: true, skipped: true });
      expect(result.gates.graphlessFallbackGate).toMatchObject({ pass: true, skipped: true });
      expect(result.failed).toEqual([]);
    }
  });

  it('passes candidate coverage on the trivial-scope rule even with search debt', () => {
    const result = legalGates({
      reviewDepthSchemaVersion: 2,
      reviewDepthApplicability: {
        scopeClass: 'trivial',
        enforcement: 'skip',
        evidenceRefs: ['e1'],
      },
      searchDebt: ['unguarded-input'],
      requiredBugClasses: ['injection'],
      candidateCovered: [],
    });

    expect(result.gates.candidateCoverageGate).toMatchObject({ pass: true, skipped: false });
    expect(result.failed).toEqual([]);
  });

  it('passes the graphless fallback gate when every required class is covered', () => {
    const result = legalGates({
      reviewDepthSchemaVersion: 2,
      reviewDepthApplicability: {
        scopeClass: 'trivial',
        enforcement: 'skip',
        evidenceRefs: ['e1'],
      },
      graphCoverageMode: 'graphless_fallback',
      requiredBugClasses: ['injection', 'xss'],
      fallbackCoveredBugClasses: ['injection', 'xss'],
    });

    expect(result.gates.graphlessFallbackGate).toMatchObject({ pass: true, skipped: false });
    expect(result.failed).toEqual([]);
  });

  it('blocks below the cap when the P0 resolution gate fails', () => {
    const decision = buildStopDecision(
      reviewInput({ review: { activeP0: 1, evidenceBackedP0P1: 1 } }),
    );

    expect(decision.decision).toBe('BLOCKED');
    expect(decision.stopReason).toBe('blockedStop');
    expect(decision.reasonDetail).toBe('p0ResolutionGate');
  });
});

describe('cap', () => {
  it('stops at the iteration cap for review and reports failed gates as evidence', () => {
    const decision = buildStopDecision(
      reviewInput({
        iterationCount: 7,
        review: { lastClaimAdjudicationPassed: false, activeP1: 1, evidenceBackedP0P1: 1 },
      }),
    );

    expect(decision.decision).toBe('STOP');
    expect(decision.stopReason).toBe('maxIterationsReached');
    expect(decision.blockedBy).toContain('claimAdjudicationGate');
  });

  it('stops at the iteration cap for research and reports failed guards as evidence', () => {
    const decision = buildStopDecision(
      researchInput({
        iterationCount: 10,
        research: { iterationRecords: [{ answeredQuestions: ['q9'], keyQuestions: ['q1'] }] },
      }),
    );

    expect(decision.decision).toBe('STOP');
    expect(decision.stopReason).toBe('maxIterationsReached');
    expect(decision.blockedBy).toContain('focusAlignment');
  });

  it('ignores the graph decision at the cap for both loop types', () => {
    const graphValues: Array<GraphDecision | null> = [
      'STOP_ALLOWED',
      'STOP_BLOCKED',
      'CONTINUE',
      null,
    ];

    for (const graphDecision of graphValues) {
      const research = buildStopDecision(researchInput({ iterationCount: 10, graphDecision }));
      expect(research.decision).toBe('STOP');
      expect(research.stopReason).toBe('maxIterationsReached');

      const review = buildStopDecision(reviewInput({ iterationCount: 7, graphDecision }));
      expect(review.decision).toBe('STOP');
      expect(review.stopReason).toBe('maxIterationsReached');
    }
  });

  it('applies the cap before stuck recovery', () => {
    const decision = buildStopDecision(researchInput({ iterationCount: 10, stuckCount: 9 }));

    expect(decision.decision).toBe('STOP');
    expect(decision.stopReason).toBe('maxIterationsReached');
  });
});

describe('graph', () => {
  const candidates: Array<[string, string, () => StopDecisionInput]> = [
    ['research', 'all_questions_answered', () => researchInput()],
    [
      'research',
      'composite_converged',
      () =>
        researchInput({
          ratios: [0.5, 0.01, 0.01, 0.01],
          research: { answeredCount: 9, totalQuestions: 10 },
        }),
    ],
    ['review', 'all_dimensions_clean', () => reviewInput()],
    [
      'review',
      'composite_converged',
      () =>
        reviewInput({
          ratios: [0.5, 0.02, 0.02],
          review: { activeP1: 1, evidenceBackedP0P1: 1 },
        }),
    ],
  ];

  for (const [loopType, candidateName, makeInput] of candidates) {
    it(`stops on ${candidateName} for ${loopType} when the graph allows it`, () => {
      const decision = buildStopDecision({ ...makeInput(), graphDecision: 'STOP_ALLOWED' });

      expect(decision.decision).toBe('STOP');
      expect(decision.stopReason).toBe('converged');
      expect(decision.reasonDetail).toBe(candidateName);
    });

    it(`blocks on ${candidateName} for ${loopType} when the graph blocks`, () => {
      const decision = buildStopDecision({
        ...makeInput(),
        graphDecision: 'STOP_BLOCKED',
        graphBlockers: [{ type: 'coverage_gap' }, 'x'],
      });

      expect(decision.decision).toBe('BLOCKED');
      expect(decision.stopReason).toBe('blockedStop');
      expect(decision.reasonDetail).toBe('graphStopBlocked');
      expect(decision.blockedBy).toEqual(['coverage_gap', 'x']);
    });

    it(`continues on ${candidateName} for ${loopType} when the graph says continue`, () => {
      const decision = buildStopDecision({ ...makeInput(), graphDecision: 'CONTINUE' });

      expect(decision.decision).toBe('CONTINUE');
      expect(decision.stopReason).toBeNull();
      expect(decision.reasonDetail).toBe('graph_convergence_continue');
    });

    it(`continues on ${candidateName} for ${loopType} when the graph decision is missing`, () => {
      const decision = buildStopDecision({ ...makeInput(), graphDecision: null });

      expect(decision.decision).toBe('CONTINUE');
      expect(decision.stopReason).toBeNull();
      expect(decision.reasonDetail).toBe('graphDecisionMissing');
    });
  }

  it('maps the four graph decisions directly', () => {
    const candidate = { reasonDetail: 'composite_converged' };

    expect(combineGraphDecision(candidate, 'STOP_ALLOWED', [])).toEqual({
      decision: 'STOP',
      stopReason: 'converged',
      reasonDetail: 'composite_converged',
      blockedBy: [],
    });
    expect(
      combineGraphDecision(candidate, 'STOP_BLOCKED', [{ type: 'coverage_gap' }, 'x']),
    ).toEqual({
      decision: 'BLOCKED',
      stopReason: 'blockedStop',
      reasonDetail: 'graphStopBlocked',
      blockedBy: ['coverage_gap', 'x'],
    });
    expect(combineGraphDecision(candidate, 'CONTINUE', [])).toEqual({
      decision: 'CONTINUE',
      stopReason: null,
      reasonDetail: 'graph_convergence_continue',
      blockedBy: [],
    });
    expect(combineGraphDecision(candidate, null, [])).toEqual({
      decision: 'CONTINUE',
      stopReason: null,
      reasonDetail: 'graphDecisionMissing',
      blockedBy: [],
    });
  });

  it('falls back to a placeholder blocker when the graph gives none', () => {
    expect(combineGraphDecision({ reasonDetail: 'x' }, 'STOP_BLOCKED', [])).toEqual({
      decision: 'BLOCKED',
      stopReason: 'blockedStop',
      reasonDetail: 'graphStopBlocked',
      blockedBy: ['graph_blocker'],
    });
  });
});

describe('order', () => {
  it('reports stuck recovery before any policy or candidate check', () => {
    const decision = buildStopDecision(researchInput({ stuckCount: 3 }));

    expect(decision.decision).toBe('STUCK_RECOVERY');
    expect(decision.stopReason).toBe('stuckRecovery');
    expect(decision.reasonDetail).toBe('stuckThresholdReached');
    expect(decision.gates.qualityGuards).toBeTruthy();
  });

  it('continues when the convergence mode is off', () => {
    const decision = buildStopDecision(researchInput({ config: { convergenceMode: 'off' } }));

    expect(decision.decision).toBe('CONTINUE');
    expect(decision.stopReason).toBeNull();
    expect(decision.reasonDetail).toBe('convergenceModeOff');
  });

  it('continues when the stop policy is max-iterations', () => {
    const decision = buildStopDecision(
      researchInput({ config: { stopPolicy: 'max-iterations' } }),
    );

    expect(decision.decision).toBe('CONTINUE');
    expect(decision.stopReason).toBeNull();
    expect(decision.reasonDetail).toBe('stopPolicyMaxIterations');
  });

  it('continues when no stop candidate is reached', () => {
    const decision = buildStopDecision(
      researchInput({ research: { answeredCount: 2, totalQuestions: 4 } }),
    );

    expect(decision.decision).toBe('CONTINUE');
    expect(decision.stopReason).toBeNull();
    expect(decision.reasonDetail).toBe('noStopCandidate');
  });

  it('applies the research iteration floor after the candidate check', () => {
    const decision = buildStopDecision(
      researchInput({ iterationCount: 2, config: { minIterations: 3 } }),
    );

    expect(decision.decision).toBe('CONTINUE');
    expect(decision.stopReason).toBeNull();
    expect(decision.reasonDetail).toBe('minIterationsNotReached');
  });

  it('applies the review iteration floor after the candidate check', () => {
    const decision = buildStopDecision(
      reviewInput({ iterationCount: 1, config: { minIterations: 3 } }),
    );

    expect(decision.decision).toBe('CONTINUE');
    expect(decision.stopReason).toBeNull();
    expect(decision.reasonDetail).toBe('minIterationsNotReached');
  });
});

describe('inputs', () => {
  it('echoes the input unchanged', () => {
    const input = researchInput();

    expect(buildStopDecision(input).inputs).toEqual(input);
  });

  it('returns the stop decision keys in contract order', () => {
    const decision = buildStopDecision(reviewInput());

    expect(Object.keys(decision)).toEqual([
      'decision',
      'stopReason',
      'reasonDetail',
      'weightedStopScore',
      'signals',
      'gates',
      'blockedBy',
      'graphDecision',
      'inputs',
    ]);
  });

  it('is deterministic for identical input', () => {
    const input = researchInput();

    expect(JSON.stringify(buildStopDecision(input))).toBe(
      JSON.stringify(buildStopDecision(input)),
    );
  });
});

describe('reviewUnfinishedCoreProtocols', () => {
  const coreConfig = { crossReference: { core: ['spec_code', 'checklist_evidence'] } };

  it('names the core protocols a partial result and a missing one leave open', () => {
    const unfinished = reviewUnfinishedCoreProtocols(coreConfig, {
      traceability: { results: [{ protocolId: 'spec_code', status: 'PARTIAL' }] },
    });

    expect(unfinished).toEqual(['spec_code', 'checklist_evidence']);
  });

  it('leaves a core protocol finished by pass or fail out of the list', () => {
    const unfinished = reviewUnfinishedCoreProtocols(coreConfig, {
      traceability: {
        results: [
          { protocolId: 'spec_code', status: 'pass' },
          { protocolId: 'checklist_evidence', status: 'fail' },
        ],
      },
    });

    expect(unfinished).toEqual([]);
  });

  it('lists nothing when the config names no core protocols', () => {
    expect(reviewUnfinishedCoreProtocols({}, { traceability: { results: [] } })).toEqual([]);
  });
});

describe('enum contract', () => {
  it('keeps stopReason null exactly for continue decisions', () => {
    const inputs: StopDecisionInput[] = [
      researchInput(),
      {
        ...researchInput(),
        graphDecision: 'STOP_BLOCKED',
        graphBlockers: [{ type: 'coverage_gap' }],
      },
      { ...researchInput(), graphDecision: 'CONTINUE' },
      { ...researchInput(), graphDecision: null },
      researchInput({
        ratios: [0.5, 0.01, 0.01, 0.01],
        research: { answeredCount: 9, totalQuestions: 10 },
      }),
      researchInput({ iterationCount: 10 }),
      researchInput({ stuckCount: 3 }),
      researchInput({ config: { convergenceMode: 'off' } }),
      researchInput({ config: { stopPolicy: 'max-iterations' } }),
      researchInput({ research: { answeredCount: 2, totalQuestions: 4 } }),
      researchInput({ iterationCount: 2 }),
      reviewInput(),
      { ...reviewInput(), graphDecision: 'STOP_BLOCKED', graphBlockers: ['graph_blocker'] },
      reviewInput({ iterationCount: 7 }),
      reviewInput({ stuckCount: 2 }),
      reviewInput({ config: { convergenceMode: 'off' } }),
      reviewInput({ review: { activeP0: 1, evidenceBackedP0P1: 1 } }),
    ];

    for (const input of inputs) {
      const decision = buildStopDecision(input);

      if (decision.decision === 'CONTINUE') {
        expect(decision.stopReason).toBeNull();
      } else {
        expect(FROZEN_STOP_REASONS).toContain(decision.stopReason);
      }
      expect(decision.stopReason === null).toBe(decision.decision === 'CONTINUE');
    }
  });
});

describe('frontierOpen veto', () => {
  const composite = (overrides: InputOverrides = {}) => researchInput({
    ratios: [0.5, 0.01, 0.01, 0.01],
    ...overrides,
    config: { depthMode: 'expansive', ...(overrides.config ?? {}) },
    research: { answeredCount: 9, totalQuestions: 10, frontierOpen: 2, ...(overrides.research ?? {}) },
  });

  const cases: Array<[string, InputOverrides, string, string]> = [
    ['open nodes veto the stop', {}, 'CONTINUE', 'frontierOpen'],
    ['an empty frontier lets the stop through', { research: { frontierOpen: 0 } }, 'STOP', 'composite_converged'],
    ['no depth mode leaves the veto off', { config: { depthMode: undefined } }, 'STOP', 'composite_converged'],
    ['the cap still wins', { iterationCount: 10 }, 'STOP', 'maxIterationsReached'],
    ['convergence mode off still wins', { config: { depthMode: 'expansive', convergenceMode: 'off' } }, 'CONTINUE', 'convergenceModeOff'],
    ['max-iterations policy still wins', { config: { depthMode: 'expansive', stopPolicy: 'max-iterations' } }, 'CONTINUE', 'stopPolicyMaxIterations'],
    ['the floor still comes first', { iterationCount: 2 }, 'CONTINUE', 'minIterationsNotReached'],
    ['stuck recovery still comes first', { stuckCount: 3 }, 'STUCK_RECOVERY', 'stuckThresholdReached'],
  ];

  it('the base fixture is a composite_converged stop without the veto', () => {
    const decision = buildStopDecision(composite({ research: { frontierOpen: 0 } }));

    expect(decision.reasonDetail).toBe('composite_converged');
  });

  it.each(cases)('expansive composite candidate: %s', (_label, overrides, decision, reasonDetail) => {
    const result = buildStopDecision(composite(overrides));

    expect(result.decision).toBe(decision);
    expect(result.reasonDetail).toBe(reasonDetail);
  });

  it('never vetoes the all_questions_answered hard path when the frontier is empty', () => {
    const decision = buildStopDecision(researchInput({
      config: { depthMode: 'expansive' },
      research: { frontierOpen: 0 },
    }));

    expect(decision.reasonDetail).toBe('all_questions_answered');
  });

  it('carries depthMode into the resolved config only for expansive runs', () => {
    const graph = { nodes: [], edges: [] };
    const files = { config: { maxIterations: 10 }, registry: {}, stateLogRows: [] };

    const defaultConfig = buildStopDecisionInput({ depthMode: 'default' }, 'research', files, graph).config;
    expect(Object.prototype.hasOwnProperty.call(defaultConfig, 'depthMode')).toBe(false);

    const flagConfig = buildStopDecisionInput({ depthMode: 'expansive' }, 'research', files, graph).config;
    expect(flagConfig.depthMode).toBe('expansive');

    const configConfig = buildStopDecisionInput({}, 'research', {
      config: { maxIterations: 10, antiConvergence: { depthMode: 'expansive' } },
      registry: {},
      stateLogRows: [],
    }, graph).config;
    expect(configConfig.depthMode).toBe('expansive');
  });

  it('projects the open and active frontier nodes into the research facts', () => {
    const graph = { nodes: [], edges: [] };

    const withFrontier = buildStopDecisionInput({ depthMode: 'expansive' }, 'research', {
      config: { maxIterations: 10 },
      registry: { frontier: { nodes: [{ status: 'open' }, { status: 'active' }, { status: 'exhausted' }] } },
      stateLogRows: [],
    }, graph);
    expect(withFrontier.research?.frontierOpen).toBe(2);

    const withoutFrontier = buildStopDecisionInput({ depthMode: 'expansive' }, 'research', {
      config: { maxIterations: 10 },
      registry: {},
      stateLogRows: [],
    }, graph);
    expect(Object.prototype.hasOwnProperty.call(withoutFrontier.research ?? {}, 'frontierOpen')).toBe(false);
  });

  describe('focusAlignment under expansive depth', () => {
    const offFocusRecords = [
      {
        answeredQuestions: ['Which caps does admission read?'],
        keyQuestions: ['What should be checked?'],
      },
    ];

    it('an off-focus frontier answer alone never stops the run', () => {
      const decision = buildStopDecision(
        composite({ research: { frontierOpen: 0, iterationRecords: offFocusRecords } }),
      );

      expect(decision.decision).toBe('CONTINUE');
      expect(decision.reasonDetail).toBe('qualityGuardFailed');
      expect(decision.blockedBy).toEqual(['focusAlignment']);
    });

    it('open frontier nodes continue before the guard is consulted', () => {
      const decision = buildStopDecision(
        composite({ research: { frontierOpen: 2, iterationRecords: offFocusRecords } }),
      );

      expect(decision.decision).toBe('CONTINUE');
      expect(decision.reasonDetail).toBe('frontierOpen');
    });

    it('a frontier answer listed in keyQuestions passes the guard', () => {
      const decision = buildStopDecision(
        composite({
          research: {
            frontierOpen: 0,
            iterationRecords: [
              {
                answeredQuestions: ['Which caps does admission read?'],
                keyQuestions: ['Which caps does admission read?', 'What should be checked?'],
              },
            ],
          },
        }),
      );

      expect(decision.decision).toBe('STOP');
      expect(decision.reasonDetail).toBe('composite_converged');
    });
  });
});

describe('review frontierOpen veto', () => {
  const clean = (overrides: InputOverrides = {}): StopDecisionInput => reviewInput({
    ...overrides,
    config: { depthMode: 'expansive', ...(overrides.config ?? {}) },
    review: { frontierOpen: 2, ...(overrides.review ?? {}) },
  });

  const composite = (overrides: InputOverrides = {}): StopDecisionInput => reviewInput({
    ratios: [0.5, 0.02, 0.02],
    ...overrides,
    config: { depthMode: 'expansive', ...(overrides.config ?? {}) },
    review: {
      activeP1: 1,
      evidenceBackedP0P1: 1,
      frontierOpen: 2,
      ...(overrides.review ?? {}),
    },
  });

  const withoutInputs = (decision: StopDecision): Partial<StopDecision> => {
    const copy: Partial<StopDecision> = { ...decision };
    delete copy.inputs;
    return copy;
  };

  const cases: Array<[string, InputOverrides, string, string]> = [
    ['open nodes veto the clean stop', {}, 'CONTINUE', 'frontierOpen'],
    ['an empty frontier lets the clean stop through', { review: { frontierOpen: 0 } }, 'STOP', 'all_dimensions_clean'],
    ['no depth mode leaves the veto off', { config: { depthMode: undefined } }, 'STOP', 'all_dimensions_clean'],
    ['the cap still wins', { iterationCount: 7 }, 'STOP', 'maxIterationsReached'],
    ['convergence mode off still wins', { config: { depthMode: 'expansive', convergenceMode: 'off' } }, 'CONTINUE', 'convergenceModeOff'],
    ['max-iterations policy still wins', { config: { depthMode: 'expansive', stopPolicy: 'max-iterations' } }, 'CONTINUE', 'stopPolicyMaxIterations'],
    ['the floor still comes first', { iterationCount: 1, config: { minIterations: 3 } }, 'CONTINUE', 'minIterationsNotReached'],
    ['stuck recovery still comes first', { stuckCount: 2 }, 'STUCK_RECOVERY', 'stuckThresholdReached'],
  ];

  it('the clean fixture stops on all_dimensions_clean without the veto', () => {
    const decision = buildStopDecision(clean({ review: { frontierOpen: 0 } }));

    expect(decision.decision).toBe('STOP');
    expect(decision.reasonDetail).toBe('all_dimensions_clean');
  });

  it.each(cases)('expansive review candidate: %s', (_label, overrides, decision, reasonDetail) => {
    const result = buildStopDecision(clean(overrides));

    expect(result.decision).toBe(decision);
    expect(result.reasonDetail).toBe(reasonDetail);
  });

  it('an empty frontier leaves the decision identical to a run without frontier facts', () => {
    const drained = buildStopDecision(clean({ review: { frontierOpen: 0 } }));
    const original = buildStopDecision(reviewInput());

    expect(withoutInputs(drained)).toEqual(withoutInputs(original));
  });

  it('vetoes a composite review stop while the frontier is open', () => {
    const vetoed = buildStopDecision(composite());
    expect(vetoed.decision).toBe('CONTINUE');
    expect(vetoed.reasonDetail).toBe('frontierOpen');

    const drained = buildStopDecision(composite({ review: { frontierOpen: 0 } }));
    expect(drained.decision).toBe('STOP');
    expect(drained.reasonDetail).toBe('composite_converged');
  });

  it('carries depthMode into the review config only for expansive runs', () => {
    const graph = { nodes: [], edges: [] };
    const files = {
      config: { maxIterations: 10 },
      registry: { frontier: { nodes: [{ status: 'open' }] } },
      stateLogRows: [],
    };

    const defaultInput = buildStopDecisionInput({ depthMode: 'default' }, 'review', files, graph);
    expect(Object.prototype.hasOwnProperty.call(defaultInput.config, 'depthMode')).toBe(false);
    expect(defaultInput.review?.frontierOpen).toBe(1);

    const expansiveInput = buildStopDecisionInput({ depthMode: 'expansive' }, 'review', files, graph);
    expect(expansiveInput.config.depthMode).toBe('expansive');
    expect(expansiveInput.review?.frontierOpen).toBe(1);

    const withoutFrontier = buildStopDecisionInput({ depthMode: 'expansive' }, 'review', {
      config: { maxIterations: 10 },
      registry: {},
      stateLogRows: [],
    }, graph);
    expect(Object.prototype.hasOwnProperty.call(withoutFrontier.review ?? {}, 'frontierOpen')).toBe(false);
  });

  it('leaves the review config echo unchanged for a default run', () => {
    const graph = { nodes: [], edges: [] };
    const files = { config: { maxIterations: 10 }, registry: {}, stateLogRows: [] };

    const flagged = buildStopDecisionInput({ depthMode: 'default' }, 'review', files, graph);
    const bare = buildStopDecisionInput({}, 'review', files, graph);

    expect(flagged.config).toEqual(bare.config);
  });
});

describe('review frontier_drained candidate', () => {
  // A drained lineage that neither clean nor composite would stop: one active P1
  // with file:line evidence keeps the clean candidate off, and ratios that are
  // still high keep the composite vote under its cutoff.
  const drained = (overrides: InputOverrides = {}): StopDecisionInput => reviewInput({
    ratios: [0.6, 0.5, 0.45],
    ...overrides,
    config: { depthMode: 'expansive', ...(overrides.config ?? {}) },
    review: {
      activeP1: 1,
      evidenceBackedP0P1: 1,
      frontierOpen: 0,
      frontierTotal: 3,
      frontierAnswered: 1,
      ...(overrides.review ?? {}),
    },
  });

  it('the fixture forms no other candidate', () => {
    const decision = buildStopDecision(drained({ config: { depthMode: undefined } }));
    expect(decision.decision).toBe('CONTINUE');
    expect(decision.reasonDetail).toBe('noStopCandidate');
  });

  it('stops a drained lineage whose gates all pass', () => {
    const decision = buildStopDecision(drained());
    expect(decision.graphDecision).toBe('STOP_ALLOWED');
    expect(decision.decision).toBe('STOP');
    expect(decision.stopReason).toBe('converged');
    expect(decision.reasonDetail).toBe('frontier_drained');
    expect(decision.blockedBy).toEqual([]);
  });

  const cases: Array<[string, InputOverrides, string, string]> = [
    ['a failed hotspot gate blocks it', { review: { hotspotSaturated: null } }, 'BLOCKED', 'hotspotSaturationGate'],
    ['an active P0 blocks it', { review: { activeP0: 1, evidenceBackedP0P1: 2 } }, 'BLOCKED', 'p0ResolutionGate'],
    ['unsettled traceability blocks it', { review: { traceabilityCovered: false } }, 'BLOCKED', 'dimensionCoverageGate'],
    ['an open node keeps the lineage running', { review: { frontierOpen: 1 } }, 'CONTINUE', 'noStopCandidate'],
    ['an empty partition forms no candidate', { review: { frontierTotal: 0 } }, 'CONTINUE', 'noStopCandidate'],
    ['a missing node count forms no candidate', { review: { frontierTotal: undefined } }, 'CONTINUE', 'noStopCandidate'],
    ['a frontier closed without an answered node forms no candidate', { review: { frontierAnswered: 0 } }, 'CONTINUE', 'noStopCandidate'],
    ['a missing answered count forms no candidate', { review: { frontierAnswered: undefined } }, 'CONTINUE', 'noStopCandidate'],
    ['consecutive failures still win', { consecutiveFailureCount: 3 }, 'STOP', 'consecutiveFailures'],
    ['a default run gets no candidate', { config: { depthMode: 'default' } }, 'CONTINUE', 'noStopCandidate'],
    ['a run without depth mode gets no candidate', { config: { depthMode: undefined } }, 'CONTINUE', 'noStopCandidate'],
    ['the cap still wins', { iterationCount: 7 }, 'STOP', 'maxIterationsReached'],
    ['the floor still comes first', { iterationCount: 1, config: { minIterations: 3 } }, 'CONTINUE', 'minIterationsNotReached'],
    ['stuck recovery still comes first', { stuckCount: 2 }, 'STUCK_RECOVERY', 'stuckThresholdReached'],
    ['convergence mode off still wins', { config: { convergenceMode: 'off' } }, 'CONTINUE', 'convergenceModeOff'],
    ['max-iterations policy still wins', { config: { stopPolicy: 'max-iterations' } }, 'CONTINUE', 'stopPolicyMaxIterations'],
    ['a continuing graph keeps the lineage running', { graphDecision: 'CONTINUE' }, 'CONTINUE', 'graph_convergence_continue'],
  ];

  it.each(cases)('%s', (_label, overrides, decision, reasonDetail) => {
    const result = buildStopDecision(drained(overrides));
    expect(result.decision).toBe(decision);
    expect(result.reasonDetail).toBe(reasonDetail);
  });

  it('ranks after the clean candidate', () => {
    const decision = buildStopDecision(drained({ review: { activeP1: 0, evidenceBackedP0P1: 0 } }));
    expect(decision.reasonDetail).toBe('all_dimensions_clean');
  });

  it('counts every frontier node as the partition size', () => {
    const graph = { nodes: [], edges: [] };
    const input = buildStopDecisionInput({ depthMode: 'expansive' }, 'review', {
      config: { maxIterations: 10 },
      registry: { frontier: { nodes: [{ status: 'answered' }, { status: 'pruned' }, { status: 'exhausted' }] } },
      stateLogRows: [],
    }, graph);
    expect(input.review?.frontierOpen).toBe(0);
    expect(input.review?.frontierTotal).toBe(3);
    expect(input.review?.frontierAnswered).toBe(1);

    const withoutFrontier = buildStopDecisionInput({ depthMode: 'expansive' }, 'review', {
      config: { maxIterations: 10 },
      registry: {},
      stateLogRows: [],
    }, graph);
    expect(Object.prototype.hasOwnProperty.call(withoutFrontier.review ?? {}, 'frontierTotal')).toBe(false);
  });
});

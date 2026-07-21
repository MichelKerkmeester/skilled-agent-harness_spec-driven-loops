// ──────────────────────────────────────────────────────────────────
// MODULE: Value of Computation Allocation Contract Tests
// ──────────────────────────────────────────────────────────────────

import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  AppendOnlyLedger,
  TransitionAuthorizationGateway,
  TransitionPolicyRegistry,
} from '../../lib/authorized-ledger/index.js';
import {
  buildFanInDecisionView,
  conditionalFanInPolicyDigest,
  defaultConditionalFanInPolicy,
  finalizeFanInDecisionCandidate,
  validateConditionalFanInPolicy,
} from '../../lib/conditional-fanin/index.js';
import {
  canonicalBytes,
  sha256Bytes,
} from '../../lib/event-envelope/index.js';
import {
  BudgetReasonCodes,
  HierarchicalBudgetAuthority,
  budgetEvidenceDigest,
  budgetVector,
  costBudget,
  createBudgetEventRegistry,
  iterationBudget,
  tokenBudget,
  wallTimeBudget,
  zeroBudgetVector,
} from '../../lib/hierarchical-budgets/index.js';
import {
  commitVocAllocationDecision,
  createVocAllocationEventRegistry,
  createVocAllocationPolicy,
  decodeVocAllocationDecisionPayload,
  executeVocAllocationShadow,
  planVocAllocation,
  vocCandidateId,
} from '../../lib/voc-allocation/index.js';

import type {
  AuthoritySnapshot,
  PolicyEvaluationInput,
  PolicyEvaluationResult,
  PolicyReference,
} from '../../lib/authorized-ledger/index.js';
import type {
  ConditionalFanInPolicy,
  FanInBudgetSnapshot,
  FanInEventCut,
  OutstandingBranchAtCut,
} from '../../lib/conditional-fanin/index.js';
import type {
  BudgetEnvelopeInput,
  BudgetEvidenceInput,
  BudgetProjection,
  BudgetReservationProjection,
  BudgetVector,
} from '../../lib/hierarchical-budgets/index.js';
import type {
  ExecuteVocAllocationInput,
  VocAllocationPolicy,
  VocAllocationPolicyInput,
  VocCandidateInput,
  VocReallocationTriggerType,
} from '../../lib/voc-allocation/index.js';

// ──────────────────────────────────────────────────────────────────
// 1. FIXTURES
// ──────────────────────────────────────────────────────────────────

const temporaryRoots: string[] = [];
const AUTHORITY: AuthoritySnapshot = Object.freeze({ state: 'shadowing', epoch: 1 });
const DEADLINE_MS = 10_000;
const DIGEST_A = 'a'.repeat(64);
const DIGEST_B = 'b'.repeat(64);
const EVENT_CUT: FanInEventCut = Object.freeze({
  ledgerId: 'fanin-domain',
  sequence: 10,
  recordHash: DIGEST_A,
  registryDigest: DIGEST_B,
});

interface BudgetHarness {
  readonly authority: HierarchicalBudgetAuthority;
  readonly ledger: AppendOnlyLedger;
  readonly pricingDigest: string;
  readonly replayFingerprint: string;
  readonly rootDirectory: string;
}

interface CandidateOptions {
  readonly benefit?: number;
  readonly confidenceBps?: number;
  readonly consecutiveSkips?: number;
  readonly diminishingReturnBps?: number;
  readonly fanInEligible?: boolean;
  readonly healthEligible?: boolean;
  readonly marginalCost?: BudgetVector;
  readonly modeId?: string;
  readonly observedValue?: number;
  readonly proxyCount?: number;
  readonly regionId?: string;
  readonly sampleCount?: number;
  readonly validThroughSequence?: number;
}

function temporaryRoot(prefix: string): string {
  const root = mkdtempSync(join(tmpdir(), prefix));
  temporaryRoots.push(root);
  return root;
}

function allowPolicy(input: Readonly<PolicyEvaluationInput>): PolicyEvaluationResult {
  return input.capabilityId.endsWith('-write')
    ? { verdict: 'allow', reasonCode: 'allowed', matchedRuleIds: ['write'] }
    : { verdict: 'deny', reasonCode: 'policy_denied', matchedRuleIds: ['write'] };
}

function policyRegistry(policyId: string): TransitionPolicyRegistry {
  return new TransitionPolicyRegistry([{
    policyId,
    policyVersion: 1,
    evaluatorVersion: '1',
    ruleIds: ['write'],
    evaluate: allowPolicy,
  }]);
}

function policyReference(
  policies: TransitionPolicyRegistry,
  policyId: string,
): PolicyReference {
  const policy = policies.resolve(policyId, 1);
  return {
    policyId: policy.policyId,
    policyVersion: policy.policyVersion,
    policyDigest: policy.digest,
  };
}

function createBudgetHarness(): BudgetHarness {
  const rootDirectory = temporaryRoot('voc-allocation-budget-');
  const registry = createBudgetEventRegistry();
  const policies = policyRegistry('budget-policy');
  const ledger = new AppendOnlyLedger({
    rootDirectory,
    ledgerId: 'budget-domain',
    auditLedgerId: 'budget-audit',
    authorityProvider: () => AUTHORITY,
    now: () => new Date('2026-07-21T12:00:00.000Z'),
  }, registry);
  const gateway = new TransitionAuthorizationGateway({
    rootDirectory,
    auditLedgerId: 'budget-audit',
    authorityProvider: () => AUTHORITY,
    now: () => new Date('2026-07-21T12:00:00.000Z'),
  }, ledger, policies);
  const replayFingerprint = sha256Bytes(canonicalBytes({ fixture: 'voc-budget' }));
  const pricingDigest = sha256Bytes(canonicalBytes({ pricing: 'voc-v1' }));
  return {
    ledger,
    pricingDigest,
    replayFingerprint,
    rootDirectory,
    authority: new HierarchicalBudgetAuthority({
      ledger,
      gateway,
      eventRegistry: registry,
      policy: policyReference(policies, 'budget-policy'),
      now: () => new Date('2026-07-21T12:00:00.000Z'),
      monotonicNow: () => 100,
    }),
  };
}

function vector(
  harness: BudgetHarness,
  tokens: number,
  cost = tokens * 10,
  attempts = Math.max(1, tokens),
  durationMs = tokens * 10,
): BudgetVector {
  return budgetVector({
    tokens: tokenBudget(tokens),
    cost: costBudget(cost, 'USD', 6, harness.pricingDigest),
    iterations: iterationBudget(attempts),
    wallTime: wallTimeBudget(durationMs, DEADLINE_MS),
  });
}

function budgetEvidence(
  harness: BudgetHarness,
  requestId: string,
): BudgetEvidenceInput {
  return {
    actorId: 'voc-test',
    authorityEpoch: 1,
    capabilityId: 'budget-write',
    causationId: null,
    correlationId: `correlation-${requestId}`,
    evidenceDigest: budgetEvidenceDigest({ requestId }),
    mode: 'research',
    replayFingerprint: harness.replayFingerprint,
    requestId,
  };
}

function envelope(
  harness: BudgetHarness,
  budgetId: string,
  kind: BudgetEnvelopeInput['scope']['kind'],
  scopeId: string,
  parentBudgetId: string | null,
  parentScopeId: string | null,
  limits: BudgetVector,
): BudgetEnvelopeInput {
  return {
    budgetId,
    createdAtMonotonicMs: 100,
    limits,
    parentBudgetId,
    policyVersion: 'budget-policy@1',
    replayFingerprint: harness.replayFingerprint,
    scope: { kind, parentScopeId, scopeId },
  };
}

async function createBudgetTree(
  harness: BudgetHarness,
  capacityTokens = 100,
): Promise<void> {
  const limits = vector(
    harness,
    capacityTokens,
    capacityTokens * 10,
    capacityTokens,
    DEADLINE_MS - 100,
  );
  expect((await harness.authority.createRoot({
    ...budgetEvidence(harness, 'create-program'),
    envelope: envelope(
      harness,
      'budget-program',
      'program',
      'program',
      null,
      null,
      limits,
    ),
  })).decision.status).toBe('created');
  expect((await harness.authority.allocateChild({
    ...budgetEvidence(harness, 'allocate-mode'),
    envelope: envelope(
      harness,
      'budget-mode',
      'mode',
      'mode',
      'budget-program',
      'program',
      limits,
    ),
  })).decision.status).toBe('allocated');
  expect((await harness.authority.allocateChild({
    ...budgetEvidence(harness, 'allocate-lineage'),
    envelope: envelope(
      harness,
      'budget-lineage',
      'lineage',
      'lineage',
      'budget-mode',
      'mode',
      limits,
    ),
  })).decision.status).toBe('allocated');
  expect((await harness.authority.allocateChild({
    ...budgetEvidence(harness, 'allocate-iteration'),
    envelope: envelope(
      harness,
      'budget-iteration',
      'iteration',
      'iteration',
      'budget-lineage',
      'lineage',
      limits,
    ),
  })).decision.status).toBe('allocated');
}

function allocationPolicy(
  harness: BudgetHarness,
  overrides: Partial<VocAllocationPolicyInput> = {},
): VocAllocationPolicy {
  return createVocAllocationPolicy({
    agingCreditCapBps: 2_000,
    agingCreditPerSkipBps: 500,
    benefitWeights: {
      blockerReductionBps: 10_000,
      contradictionResolutionBps: 10_000,
      uncertaintyReductionBps: 10_000,
      weightedCoverageBps: 10_000,
    },
    calibrationEpoch: 1,
    calibrationVersion: 'calibration-v1',
    candidateQuantumCeiling: 10,
    estimatorVersion: 'estimator-v1',
    explorationReserveQuanta: 0,
    kind: 'greedy',
    maximumConsecutiveSkips: 3,
    minimumConfidenceBps: 5_000,
    minimumServiceQuanta: 0,
    modeShareCeilingBps: 10_000,
    policyVersion: 1,
    pricingDigest: harness.pricingDigest,
    regionShareCeilingBps: 10_000,
    totalQuanta: 4,
    ...overrides,
  });
}

function candidate(
  harness: BudgetHarness,
  id: string,
  options: CandidateOptions = {},
): VocCandidateInput {
  const remainder = vector(harness, 100, 1_000, 100, 1_000);
  const scopePath = ['program', 'mode', 'lineage', 'iteration'] as const;
  return {
    budgetSnapshot: {
      authorizedRemainders: scopePath.map((scopeId) => ({
        remaining: remainder,
        scopeId,
      })),
      ledgerId: 'budget-domain',
      ledgerRecordHash: DIGEST_A,
      ledgerSequence: 4,
      projectionDigest: DIGEST_B,
      scopeId: 'iteration',
      scopePath,
    },
    confidence: {
      calibrationEpoch: 1,
      calibrationEvidenceIds: [`calibration-${id}`],
      calibrationVersion: 'calibration-v1',
      confidenceBps: options.confidenceBps ?? 9_000,
      lowerBoundValue: 0,
      observedAtSequence: options.observedValue === undefined ? null : 9,
      observedValue: options.observedValue ?? null,
      predictedValue: options.benefit ?? 10,
      priorSource: 'durable-calibration-ledger',
      sampleCount: options.sampleCount ?? 10,
      upperBoundValue: 1_000,
      validThroughSequence: options.validThroughSequence ?? EVENT_CUT.sequence,
    },
    consecutiveSkips: options.consecutiveSkips ?? 0,
    durableSignalEventIds: [`signal-${id}`],
    estimatorVersion: 'estimator-v1',
    eventCut: EVENT_CUT,
    evidenceSnapshotDigest: sha256Bytes(canonicalBytes({ evidence: id })),
    fanInEligible: options.fanInEligible ?? true,
    healthEligible: options.healthEligible ?? true,
    identity: {
      allocationQuantumId: `quantum-${id}`,
      focusId: `focus-${id}`,
      lineageId: 'lineage',
      logicalBranchId: `branch-${id}`,
      modeId: options.modeId ?? `mode-${id}`,
      regionId: options.regionId ?? `region-${id}`,
      runId: 'run-1',
      waveId: 'wave-1',
    },
    marginalBenefit: {
      blockerReductionValue: 0,
      contradictionResolutionImpact: 0,
      contradictionResolutionProbabilityBps: 0,
      diminishingReturnBps: options.diminishingReturnBps ?? 10_000,
      uncertaintyReductionValue: 0,
      weightedCoverageGain: options.benefit ?? 10,
    },
    marginalCost: options.marginalCost ?? vector(harness, 1, 10, 1, 10),
    proxyDiagnostics: {
      correlatedEvidenceCount: options.proxyCount ?? 0,
      duplicateEvidenceCount: options.proxyCount ?? 0,
      rawNoveltyCount: options.proxyCount ?? 0,
      rawOutputCount: options.proxyCount ?? 0,
    },
  };
}

function outstanding(
  id: string,
  partialFailureEligible = true,
): OutstandingBranchAtCut {
  return {
    branch: {
      registration: {
        logical_branch_id: `branch-${id}`,
        coordinate_key: `coordinate-${id}`,
        model_id: 'fixture-model',
        branch_id: `branch-${id}`,
        replica_ordinal: 0,
        derivation_version: 1,
        manifest_fingerprint: DIGEST_A,
        invocation_fingerprint: DIGEST_B,
        registration_key: `registration-${id}`,
        wave_id: 'wave-1',
        wave_ordinal: 0,
        wave_plan_fingerprint: DIGEST_A,
      },
      lifecycle: 'registered',
      lastStatus: null,
      lastAttemptId: null,
      acceptedResultDigest: null,
      acceptedSalvageDigest: null,
      terminalOutcome: null,
    },
    cancellable: false,
    dispatchId: null,
    eventSequence: 9,
    executionState: 'queued',
    lease: null,
    partialFailureEligible,
    reservationId: null,
  };
}

function baseline(harness: BudgetHarness): ExecuteVocAllocationInput['baseline'] {
  return {
    allocations: [],
    expectedEvidenceValue: 0,
    policyVersion: 'uniform-static-v1',
    starvedCandidateIds: [],
    typedSpend: zeroBudgetVector(vector(harness, 1, 10, 1, 10)),
  };
}

function executionInput(
  harness: BudgetHarness,
  candidates: readonly VocCandidateInput[],
  policy: VocAllocationPolicy,
  outstandingBranches = candidates.map((item) => outstanding(
    item.identity.logicalBranchId.replace(/^branch-/, ''),
  )),
): ExecuteVocAllocationInput {
  return {
    admissionEvidence: {
      actorId: 'voc-test',
      authorityEpoch: 1,
      capabilityId: 'budget-write',
      causationId: null,
      correlationId: 'voc-run-1',
      mode: 'research',
      replayFingerprint: harness.replayFingerprint,
    },
    authority: harness.authority,
    baseline: baseline(harness),
    candidates,
    eventCut: EVENT_CUT,
    leaseDurationMs: 1_000,
    outstandingBranches,
    policy,
    replayFingerprint: harness.replayFingerprint,
    runId: 'run-1',
    trigger: {
      eventId: 'coverage-transition-10',
      eventSequence: 10,
      eventType: 'coverage',
    },
  };
}

function projectionReservations(
  projection: Readonly<BudgetProjection>,
): Readonly<Record<string, BudgetReservationProjection>> {
  return projection.reservations as unknown as Readonly<
    Record<string, BudgetReservationProjection>
  >;
}

function fanInSnapshot(): FanInBudgetSnapshot {
  return {
    balances: {},
    ledgerId: 'budget-domain',
    ledgerRecordHash: DIGEST_A,
    ledgerSequence: 4,
    projectionDigest: DIGEST_B,
    reducerVersion: '1',
    scopeId: 'iteration',
    scopePath: ['program', 'mode', 'lineage', 'iteration'],
  };
}

function finalizedFanInDecision() {
  const policy = defaultConditionalFanInPolicy({
    minimumAcceptedCount: 2,
    minimumProvenanceGroups: 2,
    minimumSupportBasisPoints: 6_667,
    partialFailurePolicyReference: 'partial-failure@1',
  });
  const snapshot = fanInSnapshot();
  return finalizeFanInDecisionCandidate(buildFanInDecisionView({
    acceptedResults: [],
    anomalyCodes: [],
    budget: {
      after: snapshot,
      before: snapshot,
      decision: null,
      dispatchId: null,
      outcome: 'not-applicable',
      reasonCode: 'no-eligible-outstanding-branch',
      requested: null,
      reservationId: null,
      selectedBranchId: null,
    },
    cut: EVENT_CUT,
    outstandingBranches: [],
    partialFailurePolicyReference: policy.partialFailurePolicyReference,
    policy,
    policyDigest: conditionalFanInPolicyDigest(policy),
    replayFingerprint: DIGEST_A,
    runId: 'run-1',
    waveId: 'wave-1',
  }));
}

afterEach(() => {
  while (temporaryRoots.length > 0) {
    const root = temporaryRoots.pop();
    if (root) rmSync(root, { force: true, recursive: true });
  }
});

// ──────────────────────────────────────────────────────────────────
// 2. SCORING AND FAIR ALLOCATION
// ─────────────────────────────────────────────────────────────────

describe('VOC scoring and deterministic allocation', () => {
  it('selects the higher benefit when typed budget pressure is equal', () => {
    const harness = createBudgetHarness();
    const high = candidate(harness, 'high', { benefit: 20 });
    const low = candidate(harness, 'low', { benefit: 10 });
    const plan = planVocAllocation(
      [low, high],
      allocationPolicy(harness, { totalQuanta: 1 }),
      EVENT_CUT,
    );

    const highAssessment = plan.assessments.find(
      (assessment) => assessment.candidate.logicalBranchId === 'branch-high',
    );
    const lowAssessment = plan.assessments.find(
      (assessment) => assessment.candidate.logicalBranchId === 'branch-low',
    );
    expect(highAssessment?.budgetPressure).toEqual(lowAssessment?.budgetPressure);
    expect(highAssessment?.adjustedScore).toBeGreaterThan(lowAssessment?.adjustedScore ?? 0);
    expect(plan.allocations).toEqual([{ candidateId: vocCandidateId(high.identity), quanta: 1 }]);
  });

  it('redirects a later greedy quantum after deterministic diminishing returns', () => {
    const harness = createBudgetHarness();
    const initiallyHigh = candidate(harness, 'initially-high', {
      benefit: 300,
      diminishingReturnBps: 1_000,
    });
    const steady = candidate(harness, 'steady', {
      benefit: 20,
      diminishingReturnBps: 10_000,
    });
    const policy = allocationPolicy(harness, { totalQuanta: 2 });
    const left = planVocAllocation([initiallyHigh, steady], policy, EVENT_CUT);
    const replay = planVocAllocation([steady, initiallyHigh], policy, EVENT_CUT);

    expect(left.allocations).toEqual([
      { candidateId: vocCandidateId(initiallyHigh.identity), quanta: 1 },
      { candidateId: vocCandidateId(steady.identity), quanta: 1 },
    ]);
    expect(left.greedyTrace.map((entry) => entry.candidateId)).toEqual([
      vocCandidateId(initiallyHigh.identity),
      vocCandidateId(steady.identity),
    ]);
    expect(replay).toEqual(left);
  });

  it('forms only same-dimension ratios and governs by their maximum', () => {
    const harness = createBudgetHarness();
    const typed = candidate(harness, 'typed', {
      benefit: 20,
      marginalCost: vector(harness, 10, 500, 20, 200),
    });
    const assessment = planVocAllocation(
      [typed],
      allocationPolicy(harness, { totalQuanta: 1 }),
      EVENT_CUT,
    ).assessments[0];

    expect(assessment?.budgetPressure).toEqual({
      costBps: 5_000,
      governingDimension: 'cost',
      governingPressureBps: 5_000,
      iterationsBps: 2_000,
      tokensBps: 1_000,
      wallTimeBps: 2_000,
    });
  });

  it('bounds cold-start exploration and cannot manufacture positive value', () => {
    const harness = createBudgetHarness();
    const valuable = candidate(harness, 'valuable', { benefit: 100 });
    const cold = candidate(harness, 'cold', {
      benefit: 1,
      confidenceBps: 100,
      sampleCount: 0,
    });
    const valuelessAged = candidate(harness, 'valueless', {
      benefit: 0,
      confidenceBps: 100,
      consecutiveSkips: 100,
      sampleCount: 0,
    });
    const plan = planVocAllocation(
      [valuable, cold, valuelessAged],
      allocationPolicy(harness, {
        explorationReserveQuanta: 1,
        minimumServiceQuanta: 1,
        totalQuanta: 4,
      }),
      EVENT_CUT,
    );

    expect(plan.allocations).toContainEqual({
      candidateId: vocCandidateId(cold.identity),
      quanta: 1,
    });
    expect(plan.allocations).toContainEqual({
      candidateId: vocCandidateId(valuable.identity),
      quanta: 3,
    });
    expect(plan.allocations).not.toContainEqual(expect.objectContaining({
      candidateId: vocCandidateId(valuelessAged.identity),
    }));
    expect(plan.greedyTrace.filter((entry) => entry.reason === 'exploration-floor')).toHaveLength(1);
    expect(plan.assessments.find(
      (assessment) => assessment.candidate.logicalBranchId === 'branch-valueless',
    )).toMatchObject({ eligible: false, exclusionReasons: ['non-positive-value'] });
  });

  it('does not let aging or exploration rescue stale, unhealthy, or fan-in-ineligible work', () => {
    const harness = createBudgetHarness();
    const stale = candidate(harness, 'stale', {
      benefit: 100,
      confidenceBps: 100,
      consecutiveSkips: 100,
      sampleCount: 0,
      validThroughSequence: EVENT_CUT.sequence - 1,
    });
    const unhealthy = candidate(harness, 'unhealthy', {
      benefit: 100,
      confidenceBps: 100,
      consecutiveSkips: 100,
      healthEligible: false,
      sampleCount: 0,
    });
    const fanInExcluded = candidate(harness, 'fanin-excluded', {
      benefit: 100,
      confidenceBps: 100,
      consecutiveSkips: 100,
      fanInEligible: false,
      sampleCount: 0,
    });
    const plan = planVocAllocation(
      [stale, unhealthy, fanInExcluded],
      allocationPolicy(harness, {
        explorationReserveQuanta: 2,
        minimumServiceQuanta: 1,
        totalQuanta: 2,
      }),
      EVENT_CUT,
    );

    expect(plan.allocations).toEqual([]);
    expect(plan.assessments.map((assessment) => assessment.eligible)).toEqual([
      false,
      false,
      false,
    ]);
    expect(plan.assessments.flatMap((assessment) => assessment.exclusionReasons)).toEqual(
      expect.arrayContaining(['fan-in-ineligible', 'health-ineligible', 'stale-estimate']),
    );
    expect(plan.assessments.every(
      (assessment) => assessment.fairness.agingCreditBps === 2_000,
    )).toBe(true);
    const invalidIdentity = {
      ...candidate(harness, 'invalid-identity', {
        benefit: 100,
        confidenceBps: 100,
        consecutiveSkips: 100,
        sampleCount: 0,
      }),
      identity: {
        ...candidate(harness, 'invalid-identity').identity,
        logicalBranchId: '',
      },
    };
    expect(() => planVocAllocation(
      [invalidIdentity],
      allocationPolicy(harness, {
        explorationReserveQuanta: 1,
        minimumServiceQuanta: 1,
        totalQuanta: 1,
      }),
      EVENT_CUT,
    )).toThrow(/identity/);
  });

  it('does not score verbosity, novelty, duplication, or correlated output', () => {
    const harness = createBudgetHarness();
    const verboseProxy = candidate(harness, 'verbose', {
      benefit: 0,
      proxyCount: 1_000_000,
    });
    const conciseEvidence = candidate(harness, 'concise', {
      benefit: 1,
      proxyCount: 0,
    });
    const plan = planVocAllocation(
      [verboseProxy, conciseEvidence],
      allocationPolicy(harness, { totalQuanta: 1 }),
      EVENT_CUT,
    );

    expect(plan.allocations).toEqual([{
      candidateId: vocCandidateId(conciseEvidence.identity),
      quanta: 1,
    }]);
    expect(plan.assessments.find(
      (assessment) => assessment.candidate.logicalBranchId === 'branch-verbose',
    )).toMatchObject({
      eligible: false,
      marginalBenefit: {
        diminishedBenefitValue: 0,
        proxyDiagnostics: { rawOutputCount: 1_000_000 },
      },
      rawScore: 0,
    });
  });

  it('keeps greedy and largest-remainder proportional policies replay-stable', () => {
    const harness = createBudgetHarness();
    const candidates = [
      candidate(harness, 'alpha', { benefit: 30 }),
      candidate(harness, 'beta', { benefit: 10 }),
    ];
    const greedyPolicy = allocationPolicy(harness, { totalQuanta: 5 });
    const proportionalPolicy = allocationPolicy(harness, {
      kind: 'proportional',
      totalQuanta: 5,
    });
    const greedyLeft = planVocAllocation(candidates, greedyPolicy, EVENT_CUT);
    const greedyRight = planVocAllocation([...candidates].reverse(), greedyPolicy, EVENT_CUT);
    const proportionalLeft = planVocAllocation(candidates, proportionalPolicy, EVENT_CUT);
    const proportionalRight = planVocAllocation(
      [...candidates].reverse(),
      proportionalPolicy,
      EVENT_CUT,
    );

    expect(greedyRight).toEqual(greedyLeft);
    expect(proportionalRight).toEqual(proportionalLeft);
    expect(greedyLeft.allocations).not.toEqual(proportionalLeft.allocations);
    expect(sha256Bytes(canonicalBytes(greedyRight))).toBe(
      sha256Bytes(canonicalBytes(greedyLeft)),
    );
    expect(sha256Bytes(canonicalBytes(proportionalRight))).toBe(
      sha256Bytes(canonicalBytes(proportionalLeft)),
    );
  });

  it('redistributes proportional excess without crossing a mode share ceiling', () => {
    const harness = createBudgetHarness();
    const candidates = [
      candidate(harness, 'mode-a-one', { benefit: 40, modeId: 'mode-a' }),
      candidate(harness, 'mode-a-two', { benefit: 30, modeId: 'mode-a' }),
      candidate(harness, 'mode-b', { benefit: 5, modeId: 'mode-b' }),
    ];
    const plan = planVocAllocation(
      candidates,
      allocationPolicy(harness, {
        kind: 'proportional',
        modeShareCeilingBps: 5_000,
        totalQuanta: 4,
      }),
      EVENT_CUT,
    );
    const modeByCandidate = new Map(candidates.map((item) => [
      vocCandidateId(item.identity),
      item.identity.modeId,
    ]));
    const modeAQuanta = plan.allocations.reduce((total, allocation) => (
      total + (modeByCandidate.get(allocation.candidateId) === 'mode-a'
        ? allocation.quanta
        : 0)
    ), 0);

    expect(modeAQuanta).toBe(2);
    expect(plan.allocations.reduce(
      (total, allocation) => total + allocation.quanta,
      0,
    )).toBe(4);
  });
});

// ─────────────────────────────────────────────────────────────────
// 3. AUTHORITY, FAN-IN, AND REPLAY BOUNDARIES
// ──────────────────────────────────────────────────────────────────

describe('VOC authority and fan-in boundaries', () => {
  it('records budget denial without partial reservation or convergence', async () => {
    const harness = createBudgetHarness();
    await createBudgetTree(harness, 5);
    const expensive = candidate(harness, 'expensive', {
      benefit: 1_000,
      marginalCost: vector(harness, 10, 100, 10, 100),
    });
    const before = await harness.authority.readProjection();
    const result = await executeVocAllocationShadow(executionInput(
      harness,
      [expensive],
      allocationPolicy(harness, { totalQuanta: 1 }),
    ));
    const after = await harness.authority.readProjection();

    expect(result.decision).toMatchObject({
      authority: 'shadow',
      authoritativeDispatchMoved: false,
      converged: false,
      incomplete: true,
      status: 'shadow-incomplete-budget-exhausted',
    });
    expect(result.decision.admissions).toHaveLength(1);
    expect(result.decision.admissions[0]).toMatchObject({
      budgetAuthorityDispatchAllowed: false,
      converged: false,
      incomplete: true,
      reservationGranted: false,
      shadowDispatchAuthorized: false,
    });
    expect(result.decision.admissions[0]?.budgetDecision.reasonCode).toBe(
      BudgetReasonCodes.BUDGET_EXHAUSTED,
    );
    expect(projectionReservations(after.state)).toEqual(
      projectionReservations(before.state),
    );
  });

  it('populates only the frozen rank extension and leaves a finalized decision immutable', async () => {
    const harness = createBudgetHarness();
    await createBudgetTree(harness);
    const finalized = finalizedFanInDecision();
    const frozenBefore = JSON.stringify(finalized);
    const reducerInputDigest = finalized.reducerInputDigest;
    const decisionDigest = finalized.decisionDigest;
    const defaultPolicy = defaultConditionalFanInPolicy({
      minimumAcceptedCount: 2,
      minimumProvenanceGroups: 2,
      minimumSupportBasisPoints: 6_667,
      partialFailurePolicyReference: 'partial-failure@1',
    });
    const favorable = candidate(harness, 'favorable', { benefit: 100 });
    const ineligible = candidate(harness, 'ineligible', { benefit: 1_000 });
    const branches = [outstanding('favorable'), outstanding('ineligible', false)];
    const result = await executeVocAllocationShadow(executionInput(
      harness,
      [favorable, ineligible],
      allocationPolicy(harness, { totalQuanta: 1 }),
      branches,
    ));
    const rankedConditionalPolicy: ConditionalFanInPolicy = {
      ...defaultPolicy,
      valueOfComputation: result.decision.fanInHandoff.policy,
    };

    expect(JSON.stringify(finalized)).toBe(frozenBefore);
    expect(finalized.reducerInputDigest).toBe(reducerInputDigest);
    expect(finalized.decisionDigest).toBe(decisionDigest);
    expect(defaultPolicy.valueOfComputation).toEqual({
      kind: 'none',
      signalDigest: null,
      version: 1,
    });
    expect(validateConditionalFanInPolicy(rankedConditionalPolicy)).toBe(
      rankedConditionalPolicy,
    );
    expect(result.decision.fanInHandoff.policy).toMatchObject({
      kind: 'rank-only',
      version: 1,
    });
    expect(result.decision.fanInHandoff.policy.signalDigest).toMatch(/^[a-f0-9]{64}$/);
    expect(result.outstandingBranches[0]?.usefulnessRank).toBe(1);
    expect(result.outstandingBranches[1]?.usefulnessRank).toBeUndefined();
    expect(branches.every((branch) => branch.usefulnessRank === undefined)).toBe(true);
    expect(result.decision.admissions[0]).toMatchObject({
      budgetAuthorityDispatchAllowed: true,
      reservationGranted: true,
      shadowDispatchAuthorized: false,
    });
  });

  it('replays one durable trigger to identical eligibility, ordering, quanta, and digest', async () => {
    const harness = createBudgetHarness();
    await createBudgetTree(harness);
    const candidates = [
      candidate(harness, 'replay-a', { benefit: 40 }),
      candidate(harness, 'replay-b', { benefit: 20 }),
    ];
    const policy = allocationPolicy(harness, {
      kind: 'proportional',
      totalQuanta: 4,
    });
    const input = executionInput(harness, candidates, policy);
    const first = await executeVocAllocationShadow(input);
    const replay = await executeVocAllocationShadow({
      ...input,
      candidates: [...candidates].reverse(),
      outstandingBranches: [...input.outstandingBranches].reverse(),
    });
    const projection = await harness.authority.readProjection();

    expect(replay.decision.decisionDigest).toBe(first.decision.decisionDigest);
    expect(replay.decision.plan.assessments).toEqual(first.decision.plan.assessments);
    expect(replay.decision.plan.orderedCandidateIds).toEqual(
      first.decision.plan.orderedCandidateIds,
    );
    expect(replay.decision.plan.allocations).toEqual(first.decision.plan.allocations);
    expect(replay.decision.trigger).toEqual({
      eventId: 'coverage-transition-10',
      eventSequence: 10,
      eventType: 'coverage',
    });
    expect(Object.keys(projectionReservations(projection.state))).toHaveLength(2);
  });

  it('binds every reallocation cause to a durable trigger and explicit supersession chain', async () => {
    const harness = createBudgetHarness();
    const triggerTypes: readonly VocReallocationTriggerType[] = [
      'blocker',
      'budget-settlement',
      'contradiction',
      'coverage',
      'fan-in',
      'health',
      'result',
    ];
    let supersedesDecisionId: string | null = null;
    for (const eventType of triggerTypes) {
      const result = await executeVocAllocationShadow({
        ...executionInput(harness, [], allocationPolicy(harness, { totalQuanta: 1 })),
        supersedesDecisionId,
        trigger: {
          eventId: `${eventType}-event-10`,
          eventSequence: 10,
          eventType,
        },
      });
      expect(result.decision).toMatchObject({
        admissions: [],
        status: 'shadow-no-eligible-value',
        supersedesDecisionId,
        trigger: { eventType },
      });
      expect(JSON.stringify(result.decision)).not.toMatch(/recordedAt|occurredAt|wallClock/);
      supersedesDecisionId = result.decision.decisionId;
    }
  });

  it('serializes competing decisions so the final typed remainder is admitted once', async () => {
    const harness = createBudgetHarness();
    await createBudgetTree(harness, 1);
    const policy = allocationPolicy(harness, { totalQuanta: 1 });
    const [left, right] = await Promise.all([
      executeVocAllocationShadow(executionInput(
        harness,
        [candidate(harness, 'race-left', { benefit: 20 })],
        policy,
      )),
      executeVocAllocationShadow(executionInput(
        harness,
        [candidate(harness, 'race-right', { benefit: 20 })],
        policy,
      )),
    ]);
    const decisions = [left.decision, right.decision];
    const projection = await harness.authority.readProjection();

    expect(decisions.filter((decision) => decision.status === 'shadow-evaluated')).toHaveLength(1);
    expect(decisions.filter(
      (decision) => decision.status === 'shadow-incomplete-budget-exhausted',
    )).toHaveLength(1);
    expect(decisions.every((decision) => decision.converged === false)).toBe(true);
    expect(Object.keys(projectionReservations(projection.state))).toHaveLength(1);
  });

  it('ledgers a complete additive-dark decision with uniform/static authority retained', async () => {
    const harness = createBudgetHarness();
    await createBudgetTree(harness);
    const result = await executeVocAllocationShadow(executionInput(
      harness,
      [
        candidate(harness, 'ledgered-a', { benefit: 25, observedValue: 20 }),
        candidate(harness, 'ledgered-b', { benefit: 15 }),
      ],
      allocationPolicy(harness, { kind: 'proportional', totalQuanta: 2 }),
    ));
    const rootDirectory = temporaryRoot('voc-allocation-ledger-');
    const registry = createVocAllocationEventRegistry();
    const policies = policyRegistry('voc-policy');
    const ledger = new AppendOnlyLedger({
      rootDirectory,
      ledgerId: 'voc-domain',
      auditLedgerId: 'voc-audit',
      authorityProvider: () => AUTHORITY,
      now: () => new Date('2026-07-21T12:00:00.000Z'),
    }, registry);
    const gateway = new TransitionAuthorizationGateway({
      rootDirectory,
      auditLedgerId: 'voc-audit',
      authorityProvider: () => AUTHORITY,
      now: () => new Date('2026-07-21T12:00:00.000Z'),
    }, ledger, policies);
    const commitInput = {
      actorId: 'voc-test',
      authorityEpoch: 1,
      capabilityId: 'voc-write',
      causationId: 'coverage-transition-10',
      correlationId: 'run-1',
      decision: result.decision,
      gateway,
      ledger,
      mode: 'research',
      occurredAt: '2026-07-21T12:00:00.000Z',
      policy: policyReference(policies, 'voc-policy'),
      producer: { name: 'voc-allocation', version: '1' },
      recordedAt: '2026-07-21T12:00:00.000Z',
      registry,
      streamId: 'run-1',
    } as const;
    const receipt = await commitVocAllocationDecision(commitInput);
    const replayReceipt = await commitVocAllocationDecision(commitInput);
    const event = (await ledger.readVerifiedEvents())[0];

    expect(receipt.sequence).toBe(1);
    expect(replayReceipt).toEqual(receipt);
    expect(await ledger.readVerifiedEvents()).toHaveLength(1);
    expect(event?.event.effective.envelope.payload).toMatchObject({
      decision_codec: 'canonical-json+deflate-raw-fixed@1',
      decision_digest: result.decision.decisionDigest,
      decision_id: result.decision.decisionId,
    });
    const decoded = decodeVocAllocationDecisionPayload(
      event?.event.effective.envelope.payload as never,
    );
    expect(decoded).toEqual(result.decision);
    expect(Object.isFrozen(decoded)).toBe(true);
    expect(Object.isFrozen(decoded.plan.assessments[0])).toBe(true);
    expect(decoded).toMatchObject({
      authority: 'shadow',
      authoritativeAllocationPath: 'uniform-static',
      authoritativeDispatchMoved: false,
      converged: false,
      shadowComparison: {
        authoritativeDispatchMoved: false,
        uniformStaticBaseline: { policyVersion: 'uniform-static-v1' },
      },
    });
    expect(decoded.plan.assessments.find(
      (assessment) => assessment.candidate.logicalBranchId === 'branch-ledgered-a',
    )?.confidence).toMatchObject({
      observedAtSequence: 9,
      observedValue: 20,
      predictedValue: 25,
    });
  });
});

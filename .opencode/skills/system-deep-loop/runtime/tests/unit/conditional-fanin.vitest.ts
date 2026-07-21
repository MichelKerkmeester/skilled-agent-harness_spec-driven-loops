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
  applyOutstandingDispositions,
  bindReductionToDecision,
  buildFanInDecisionView,
  commitFanInDecision,
  conditionalFanInPolicyDigest,
  createConditionalFanInEventRegistry,
  defaultConditionalFanInPolicy,
  evaluateAwaitPredicate,
  evaluateConditionalFanInShadow,
  evaluateSufficiency,
  finalizeFanInDecisionCandidate,
  planOutstandingDispositions,
  recordLateResultForSalvage,
  reserveContinuationBudget,
} from '../../lib/conditional-fanin/index.js';
import {
  CURRENT_ENVELOPE_VERSION,
  canonicalBytes,
  prepareEventWrite,
  sha256Bytes,
} from '../../lib/event-envelope/index.js';
import {
  HierarchicalBudgetAuthority,
  budgetEvidenceDigest,
  budgetVector,
  costBudget,
  createBudgetEventRegistry,
  iterationBudget,
  tokenBudget,
  wallTimeBudget,
} from '../../lib/hierarchical-budgets/index.js';
import { buildLeafResultPayload } from '../../lib/result-envelopes/index.js';

import type {
  AuthoritySnapshot,
  PolicyEvaluationInput,
  PolicyEvaluationResult,
  PolicyReference,
} from '../../lib/authorized-ledger/index.js';
import type {
  AcceptedResultAtCut,
  ConditionalFanInPolicy,
  ContinuationBudgetEvidence,
  FanInBudgetSnapshot,
  FanInDecisionView,
  OutstandingBranchAtCut,
} from '../../lib/conditional-fanin/index.js';
import type {
  DispatchReceiptPayload,
} from '../../lib/dispatch-receipts/index.js';
import type {
  EventTypeDefinition,
  JsonObject,
} from '../../lib/event-envelope/index.js';
import type {
  BudgetEnvelopeInput,
  BudgetEvidenceInput,
  BudgetVector,
} from '../../lib/hierarchical-budgets/index.js';
import type { LeafResultPayload } from '../../lib/result-envelopes/index.js';

const roots: string[] = [];
const DIGEST_A = 'a'.repeat(64);
const DIGEST_B = 'b'.repeat(64);
const DEADLINE_MS = 10_000;
const AUTHORITY: AuthoritySnapshot = Object.freeze({ state: 'shadowing', epoch: 1 });

function temporaryRoot(prefix: string): string {
  const root = mkdtempSync(join(tmpdir(), prefix));
  roots.push(root);
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

function receipt(id: string, branchId: string): DispatchReceiptPayload {
  return {
    adapter_identity: 'fixture-adapter',
    adapter_version: '1',
    attempt_id: `attempt-${id}`,
    canonicalization_version: '1',
    capability_row_id: 'fixture-capability',
    dispatch_id: `dispatch-${id}`,
    effective_config_digest: DIGEST_A,
    event_name: 'dispatch-resolved',
    executable_identity: 'fixture',
    executable_version: '1',
    executor_kind: 'fixture',
    fingerprint_algorithm: 'sha256',
    fingerprint_namespace: 'fixture',
    fingerprint_version: 1,
    input_digest: DIGEST_A,
    invocation_fingerprint: `inv:${DIGEST_B}`,
    leaf_id: `leaf-${id}`,
    logical_branch_id: branchId,
    mac: null,
    mac_key_id: 'none',
    mac_key_provider_id: 'none',
    mac_scheme: 'none',
    mac_trust_scope: 'ledger-only',
    mac_verifier_version: '1',
    model: null,
    prompt_digest: DIGEST_A,
    reasoning_effort: null,
    receipt_id: `receipt-${id}`,
    run_id: 'run-1',
    search_policy: 'off',
    service_tier: null,
  };
}

function result(id: string, branchId: string, answer: string): LeafResultPayload {
  const parsedResult = { answer };
  return buildLeafResultPayload(receipt(id, branchId), {
    artifacts: [],
    completedAt: '2026-07-21T12:00:01.000Z',
    cost: { amount: 1, currency: 'USD', provenance: 'measured' },
    durationMs: 1_000,
    errorClassification: null,
    errorDigest: null,
    evidence: [],
    parsedResult,
    parsedResultDigest: sha256Bytes(canonicalBytes(parsedResult)),
    parsedResultReference: null,
    replayFingerprint: DIGEST_A,
    resultSchemaVersion: 1,
    salvageSummary: { disposition: 'none', fragment_count: 0 },
    startedAt: '2026-07-21T12:00:00.000Z',
    status: 'succeeded',
    usage: {
      input_tokens: 1,
      output_tokens: 1,
      provenance: 'measured',
      total_tokens: 2,
    },
  }, 1);
}

function accepted(
  id: string,
  sequence: number,
  agreementKey: string,
  provenanceGroupId: string,
  eligible = true,
): AcceptedResultAtCut {
  return {
    envelope: result(id, `branch-${id}`, agreementKey),
    ledgerSequence: sequence,
    agreementKey,
    provenanceGroupId,
    partialFailureEligible: eligible,
  };
}

function projectedBranch(id: string): OutstandingBranchAtCut['branch'] {
  return {
    registration: {
      logical_branch_id: id,
      coordinate_key: `coordinate-${id}`,
      model_id: 'fixture-model',
      branch_id: id,
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
  };
}

function outstanding(
  id: string,
  executionState: OutstandingBranchAtCut['executionState'],
  options: {
    cancellable?: boolean;
    reservationId?: string | null;
    usefulnessRank?: number;
  } = {},
): OutstandingBranchAtCut {
  const running = executionState === 'running';
  return {
    branch: projectedBranch(id),
    lease: running ? {
      logicalBranchId: id,
      waveId: 'wave-1',
      leaseId: `lease-${id}`,
      ownerId: 'worker-1',
      attemptId: `attempt-${id}`,
      fenceToken: 7,
      acquiredAt: '2026-07-21T12:00:00.000Z',
      renewedAt: '2026-07-21T12:00:00.000Z',
      expiresAt: '2026-07-21T12:10:00.000Z',
      status: 'active',
    } : null,
    eventSequence: 9,
    executionState,
    dispatchId: executionState === 'queued' ? null : `dispatch-${id}`,
    reservationId: options.reservationId ?? (
      executionState === 'queued' ? null : `reservation-${id}`
    ),
    cancellable: options.cancellable ?? false,
    partialFailureEligible: true,
    usefulnessRank: options.usefulnessRank,
  };
}

function snapshot(): FanInBudgetSnapshot {
  return {
    projectionDigest: DIGEST_A,
    reducerVersion: '1',
    ledgerId: 'budget-domain',
    ledgerSequence: 4,
    ledgerRecordHash: DIGEST_B,
    scopeId: 'iteration-b',
    scopePath: ['program', 'mode', 'lineage-b', 'iteration-b'],
    balances: {},
  };
}

function budgetEvidence(
  outcome: ContinuationBudgetEvidence['outcome'],
  reasonCode = 'allowed',
): ContinuationBudgetEvidence {
  const fixedSnapshot = snapshot();
  return {
    outcome,
    reasonCode,
    requested: null,
    reservationId: outcome === 'reserved' ? 'reservation-next' : null,
    dispatchId: outcome === 'reserved' ? 'dispatch-next' : null,
    selectedBranchId: outcome === 'reserved' ? 'branch-next' : null,
    decision: null,
    before: fixedSnapshot,
    after: fixedSnapshot,
  };
}

function standardPolicy(): ConditionalFanInPolicy {
  return defaultConditionalFanInPolicy({
    minimumAcceptedCount: 2,
    minimumSupportBasisPoints: 6_667,
    minimumProvenanceGroups: 2,
    partialFailurePolicyReference: 'partial-failure@1',
  });
}

function view(input: {
  acceptedResults?: readonly AcceptedResultAtCut[];
  outstandingBranches?: readonly OutstandingBranchAtCut[];
  budget?: ContinuationBudgetEvidence;
  policy?: ConditionalFanInPolicy;
  anomalyCodes?: readonly string[];
  cutSequence?: number;
} = {}): FanInDecisionView {
  const policy = input.policy ?? standardPolicy();
  return buildFanInDecisionView({
    runId: 'run-1',
    waveId: 'wave-1',
    replayFingerprint: DIGEST_A,
    policy,
    policyDigest: conditionalFanInPolicyDigest(policy),
    cut: {
      ledgerId: 'fanin-domain',
      sequence: input.cutSequence ?? 10,
      recordHash: DIGEST_B,
      registryDigest: DIGEST_A,
    },
    acceptedResults: input.acceptedResults ?? [],
    outstandingBranches: input.outstandingBranches ?? [],
    partialFailurePolicyReference: policy.partialFailurePolicyReference,
    budget: input.budget ?? budgetEvidence('not-applicable', 'no-eligible-outstanding-branch'),
    anomalyCodes: input.anomalyCodes ?? [],
  });
}

interface BudgetHarness {
  readonly rootDirectory: string;
  readonly ledger: AppendOnlyLedger;
  readonly authority: HierarchicalBudgetAuthority;
  readonly replayFingerprint: string;
  readonly pricingDigest: string;
}

function createBudgetHarness(): BudgetHarness {
  const rootDirectory = temporaryRoot('conditional-fanin-budget-');
  const eventRegistry = createBudgetEventRegistry();
  const policies = policyRegistry('budget-policy');
  const ledger = new AppendOnlyLedger({
    rootDirectory,
    ledgerId: 'budget-domain',
    auditLedgerId: 'budget-audit',
    authorityProvider: () => AUTHORITY,
    now: () => new Date('2026-07-21T12:00:00.000Z'),
  }, eventRegistry);
  const gateway = new TransitionAuthorizationGateway({
    rootDirectory,
    auditLedgerId: 'budget-audit',
    authorityProvider: () => AUTHORITY,
    now: () => new Date('2026-07-21T12:00:00.000Z'),
  }, ledger, policies);
  const replayFingerprint = sha256Bytes(canonicalBytes({ fixture: 'fanin-budget' }));
  const pricingDigest = sha256Bytes(canonicalBytes({ pricing: 'fanin-v1' }));
  return {
    rootDirectory,
    ledger,
    replayFingerprint,
    pricingDigest,
    authority: new HierarchicalBudgetAuthority({
      ledger,
      gateway,
      eventRegistry,
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
  attempts = 1,
  durationMs = tokens * 10,
): BudgetVector {
  return budgetVector({
    tokens: tokenBudget(tokens),
    cost: costBudget(cost, 'USD', 6, harness.pricingDigest),
    iterations: iterationBudget(attempts),
    wallTime: wallTimeBudget(durationMs, DEADLINE_MS),
  });
}

function budgetRequestEvidence(
  harness: BudgetHarness,
  requestId: string,
): BudgetEvidenceInput {
  return {
    requestId,
    mode: 'research',
    actorId: 'fanin-test',
    capabilityId: 'budget-write',
    authorityEpoch: 1,
    evidenceDigest: budgetEvidenceDigest({ requestId }),
    replayFingerprint: harness.replayFingerprint,
    correlationId: `correlation-${requestId}`,
    causationId: null,
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
    scope: { kind, scopeId, parentScopeId },
    parentBudgetId,
    policyVersion: 'budget-policy@1',
    replayFingerprint: harness.replayFingerprint,
    createdAtMonotonicMs: 100,
    limits,
  };
}

async function createAncestorBudgetTree(harness: BudgetHarness): Promise<void> {
  await harness.authority.createRoot({
    ...budgetRequestEvidence(harness, 'create-program'),
    envelope: envelope(
      harness, 'budget-program', 'program', 'program', null, null,
      vector(harness, 100, 1_000, 20, 9_900),
    ),
  });
  await harness.authority.allocateChild({
    ...budgetRequestEvidence(harness, 'allocate-mode'),
    envelope: envelope(
      harness, 'budget-mode', 'mode', 'mode', 'budget-program', 'program',
      vector(harness, 100, 1_000, 20, 9_900),
    ),
  });
  await harness.authority.allocateChild({
    ...budgetRequestEvidence(harness, 'allocate-lineage-b'),
    envelope: envelope(
      harness,
      'budget-lineage-b',
      'lineage',
      'lineage-b',
      'budget-mode',
      'mode',
      vector(harness, 100, 1_000, 20, 9_900),
    ),
  });
  await harness.authority.allocateChild({
    ...budgetRequestEvidence(harness, 'allocate-iteration-b'),
    envelope: envelope(
      harness,
      'budget-iteration-b',
      'iteration',
      'iteration-b',
      'budget-lineage-b',
      'lineage-b',
      vector(harness, 100, 1_000, 20, 9_900),
    ),
  });
}

const budgetDenialCases = (
  ['program', 'mode', 'lineage-b', 'iteration-b'] as const
).flatMap((scopeId) => (
  ['tokens', 'cost', 'iterations', 'wallTime'] as const
).map((dimension) => ({ scopeId, dimension })));

afterEach(() => {
  while (roots.length > 0) {
    const root = roots.pop();
    if (root) rmSync(root, { recursive: true, force: true });
  }
});

describe('conditional fan-in decision view and sufficiency', () => {
  it('binds decisions to an event cut rather than result arrival order', () => {
    const results = [
      accepted('one', 3, 'answer-a', 'provider-a'),
      accepted('two', 5, 'answer-a', 'provider-b'),
      accepted('three', 4, 'answer-b', 'provider-c'),
    ];
    const left = finalizeFanInDecisionCandidate(view({ acceptedResults: results }));
    const right = finalizeFanInDecisionCandidate(view({
      acceptedResults: [results[2], results[0], results[1]],
    }));

    expect(right).toEqual(left);
    expect(left.includedResultEnvelopeIds).toEqual([
      results[0].envelope.result_envelope_id,
      results[2].envelope.result_envelope_id,
      results[1].envelope.result_envelope_id,
    ]);
    expect(left.cut.sequence).toBe(10);
  });

  it('counts correlated lineage duplicates once and rejects incoherent lineage votes', () => {
    const policy = standardPolicy();
    const duplicates = [
      accepted('one', 1, 'answer-a', 'shared-lineage'),
      accepted('two', 2, 'answer-a', 'shared-lineage'),
      accepted('three', 3, 'answer-a', 'shared-lineage'),
    ];
    expect(evaluateSufficiency(duplicates, policy)).toMatchObject({
      acceptedEligibleCount: 3,
      distinctProvenanceGroups: 1,
      supportingProvenanceGroups: 1,
      diversitySatisfied: false,
      sufficient: false,
    });

    const conflicting = [
      accepted('four', 4, 'answer-a', 'provider-a'),
      accepted('five', 5, 'answer-b', 'provider-a'),
      accepted('six', 6, 'answer-a', 'provider-b'),
    ];
    expect(evaluateSufficiency(conflicting, policy)).toMatchObject({
      supportingProvenanceGroups: 1,
      supportBasisPoints: 5_000,
      supportSatisfied: false,
      sufficient: false,
    });
  });

  it('fails closed on stale-cut, policy, budget, and running-lease gaps', () => {
    const policy = standardPolicy();
    expect(() => buildFanInDecisionView({
      ...view({ policy }),
      policyDigest: DIGEST_B,
    })).toThrow(/policy digest/);
    expect(() => view({
      acceptedResults: [accepted('after-cut', 11, 'answer-a', 'provider-a')],
      cutSequence: 10,
    })).toThrow(/after its event cut/);
    expect(() => view({
      outstandingBranches: [{ ...outstanding('running', 'running'), lease: null }],
      budget: budgetEvidence('reserved'),
    })).toThrow(/active fenced lease/);
    expect(evaluateAwaitPredicate(view({
      outstandingBranches: [outstanding('queued', 'queued')],
      budget: budgetEvidence('not-applicable'),
    }))).toMatchObject({
      primary: 'fail-closed-anomaly',
      classification: 'incomplete-anomaly',
    });
  });

  it('keeps partial-failure policy variants behind one decision schema', () => {
    const decisions = ['strict', 'quorum', 'deadline', 'progressive'].map((variant) => {
      const policy: ConditionalFanInPolicy = {
        ...standardPolicy(),
        partialFailurePolicyReference: `${variant}@1`,
      };
      return finalizeFanInDecisionCandidate(view({ policy }));
    });

    expect(decisions.map((decision) => decision.decisionVersion)).toEqual([1, 1, 1, 1]);
    expect(decisions.map((decision) => decision.classification)).toEqual([
      'all-eligible-terminal',
      'all-eligible-terminal',
      'all-eligible-terminal',
      'all-eligible-terminal',
    ]);
  });
});

describe('typed continuation budget and trigger precedence', () => {
  it('denies one atomic continuation reservation when a shared ancestor is exhausted', async () => {
    const harness = createBudgetHarness();
    await createAncestorBudgetTree(harness);
    const first = await harness.authority.admit({
      ...budgetRequestEvidence(harness, 'consume-mode'),
      scopeId: 'mode',
      reservationId: 'reservation-mode',
      dispatchId: 'dispatch-mode',
      estimate: vector(harness, 60, 600, 1, 600),
      leaseDurationMs: 1_000,
    });
    expect(first.decision.status).toBe('granted');

    const policy = standardPolicy();
    const cut = {
      ledgerId: 'fanin-domain',
      sequence: 10,
      recordHash: DIGEST_B,
      registryDigest: DIGEST_A,
    };
    const continuation = await reserveContinuationBudget({
      authority: harness.authority,
      scopeId: 'iteration-b',
      cut,
      policy,
      policyDigest: conditionalFanInPolicyDigest(policy),
      outstandingBranches: [outstanding('next', 'queued')],
      nextResultEstimate: vector(harness, 50, 500, 1, 500),
      settlementMargin: vector(harness, 1, 10, 1, 10),
      leaseDurationMs: 1_000,
      evidence: {
        mode: 'research',
        actorId: 'fanin-test',
        capabilityId: 'budget-write',
        authorityEpoch: 1,
        replayFingerprint: harness.replayFingerprint,
        correlationId: 'fanin-continuation',
      },
    });
    const iterationB = continuation.before.balances['iteration-b'] as JsonObject;
    const program = continuation.before.balances.program as JsonObject;

    expect(iterationB.tokens).toMatchObject({ remaining: 100 });
    expect(program.tokens).toMatchObject({ remaining: 40 });
    expect(continuation).toMatchObject({
      outcome: 'budget-constrained',
      reasonCode: 'budget_exhausted',
      selectedBranchId: 'next',
    });
    expect(continuation.decision).toMatchObject({
      status: 'denied',
      converged: false,
      incomplete: true,
    });
  });

  it.each(budgetDenialCases)(
    'checks $dimension admission at the $scopeId scope in the ancestor path',
    async ({ scopeId, dimension }) => {
      const harness = createBudgetHarness();
      await createAncestorBudgetTree(harness);
      const consumed = {
        tokens: dimension === 'tokens' ? 99 : 1,
        cost: dimension === 'cost' ? 990 : 10,
        attempts: dimension === 'iterations' ? 19 : 1,
        duration: dimension === 'wallTime' ? 9_890 : 10,
      };
      const prior = await harness.authority.admit({
        ...budgetRequestEvidence(harness, `consume-${scopeId}-${dimension}`),
        scopeId,
        reservationId: `reservation-${scopeId}-${dimension}`,
        dispatchId: `dispatch-${scopeId}-${dimension}`,
        estimate: vector(
          harness,
          consumed.tokens,
          consumed.cost,
          consumed.attempts,
          consumed.duration,
        ),
        leaseDurationMs: 1_000,
      });
      expect(prior.decision.status).toBe('granted');

      const policy = standardPolicy();
      const continuation = await reserveContinuationBudget({
        authority: harness.authority,
        scopeId: 'iteration-b',
        cut: {
          ledgerId: 'fanin-domain',
          sequence: 10,
          recordHash: DIGEST_B,
          registryDigest: DIGEST_A,
        },
        policy,
        policyDigest: conditionalFanInPolicyDigest(policy),
        outstandingBranches: [outstanding('next', 'queued')],
        nextResultEstimate: vector(harness, 1, 10, 1, 10),
        settlementMargin: vector(harness, 1, 10, 1, 10),
        leaseDurationMs: 1_000,
        evidence: {
          mode: 'research',
          actorId: 'fanin-test',
          capabilityId: 'budget-write',
          authorityEpoch: 1,
          replayFingerprint: harness.replayFingerprint,
          correlationId: `fanin-${scopeId}-${dimension}`,
        },
      });

      expect(continuation).toMatchObject({
        outcome: 'budget-constrained',
        reasonCode: 'budget_exhausted',
      });
      expect(continuation.decision).toMatchObject({
        converged: false,
        incomplete: true,
      });
    },
  );

  it('records every simultaneous trigger and applies fail-closed fixed precedence', () => {
    const results = [
      accepted('one', 1, 'answer-a', 'provider-a'),
      accepted('two', 2, 'answer-a', 'provider-b'),
    ];
    const branch = outstanding('next', 'queued');
    const budgetFirst = evaluateAwaitPredicate(view({
      acceptedResults: results,
      outstandingBranches: [branch],
      budget: budgetEvidence('budget-constrained', 'budget_exhausted'),
    }));
    expect(budgetFirst.triggered).toEqual(['budget-floor', 'sufficiency']);
    expect(budgetFirst).toMatchObject({
      primary: 'budget-floor',
      classification: 'incomplete-budget-constrained',
      shouldAwait: false,
    });

    const anomalyFirst = evaluateAwaitPredicate(view({
      acceptedResults: results,
      outstandingBranches: [branch],
      budget: budgetEvidence('budget-constrained', 'budget_exhausted'),
      anomalyCodes: ['stale-pricing'],
    }));
    expect(anomalyFirst.triggered).toEqual([
      'fail-closed-anomaly',
      'budget-floor',
      'sufficiency',
    ]);
    expect(anomalyFirst.classification).toBe('incomplete-anomaly');
  });

  it('allows a value signal to rank only and never bypass budget denial', async () => {
    const harness = createBudgetHarness();
    await createAncestorBudgetTree(harness);
    await harness.authority.admit({
      ...budgetRequestEvidence(harness, 'consume-for-ranking'),
      scopeId: 'mode',
      reservationId: 'reservation-ranking',
      dispatchId: 'dispatch-ranking',
      estimate: vector(harness, 100, 1_000, 1, 100),
      leaseDurationMs: 1_000,
    });
    const policy: ConditionalFanInPolicy = {
      ...standardPolicy(),
      valueOfComputation: {
        kind: 'rank-only',
        version: 1,
        signalDigest: DIGEST_A,
      },
    };
    const continuation = await reserveContinuationBudget({
      authority: harness.authority,
      scopeId: 'iteration-b',
      cut: { ledgerId: 'fanin-domain', sequence: 10, recordHash: DIGEST_B, registryDigest: DIGEST_A },
      policy,
      policyDigest: conditionalFanInPolicyDigest(policy),
      outstandingBranches: [
        outstanding('lower', 'queued', { usefulnessRank: 1 }),
        outstanding('higher', 'queued', { usefulnessRank: 10 }),
      ],
      nextResultEstimate: vector(harness, 1, 10, 1, 10),
      settlementMargin: vector(harness, 1, 10, 1, 10),
      leaseDurationMs: 1_000,
      evidence: {
        mode: 'research',
        actorId: 'fanin-test',
        capabilityId: 'budget-write',
        authorityEpoch: 1,
        replayFingerprint: harness.replayFingerprint,
        correlationId: 'ranking',
      },
    });

    expect(continuation.selectedBranchId).toBe('higher');
    expect(continuation.outcome).toBe('budget-constrained');
  });
});

describe('outstanding disposition and frozen reduction', () => {
  it('plans stable state-specific disposition without releasing leases or spend', () => {
    const branches = [
      outstanding('queued', 'queued'),
      outstanding('reserved', 'reserved-not-started'),
      outstanding('cancellable', 'running', { cancellable: true }),
      outstanding('salvage', 'running', { cancellable: false }),
    ];
    const first = planOutstandingDispositions('decision-1', branches);
    const replay = planOutstandingDispositions('decision-1', [...branches].reverse());

    expect(replay).toEqual(first);
    expect(first.map((item) => item.kind)).toEqual([
      'fenced-cancel',
      'withdraw',
      'cancel-reservation',
      'detach-to-salvage',
    ]);
    expect(first[0]).toMatchObject({
      fenceToken: 7,
      retainLease: true,
      retainSpend: true,
      settleActualSpend: true,
    });
    expect(first[3]).toMatchObject({
      retainLease: true,
      retainSpend: true,
      settleActualSpend: true,
    });
  });

  it('cancels reserved-not-started capacity only through proof-backed budget authority', async () => {
    const harness = createBudgetHarness();
    await createAncestorBudgetTree(harness);
    await harness.authority.admit({
      ...budgetRequestEvidence(harness, 'reserve-unused'),
      scopeId: 'iteration-b',
      reservationId: 'reservation-unused',
      dispatchId: 'dispatch-unused',
      estimate: vector(harness, 5, 50, 1, 50),
      leaseDurationMs: 1_000,
    });
    const disposition = planOutstandingDispositions('decision-unused', [
      outstanding('unused', 'reserved-not-started', { reservationId: 'reservation-unused' }),
    ]);
    const proof = sha256Bytes(canonicalBytes({ no_dispatch: true }));
    const dispositionInput = {
      dispositions: disposition,
      budgetAuthority: harness.authority,
      ports: {
        withdrawQueued: async () => undefined,
        proveNoDispatch: async () => proof,
        cancelAndSettleActual: async () => undefined,
        detachToSalvage: async () => undefined,
      },
      budgetEvidence: () => ({
        mode: 'research',
        actorId: 'fanin-test',
        capabilityId: 'budget-write',
        authorityEpoch: 1,
        replayFingerprint: harness.replayFingerprint,
        correlationId: 'cancel-unused',
        causationId: null,
      }),
    } as const;
    const outcomes = await applyOutstandingDispositions(dispositionInput);
    const replay = await applyOutstandingDispositions(dispositionInput);

    expect(outcomes[0]?.decision.status).toBe('cancelled');
    expect(replay[0]?.isIdempotent).toBe(true);
    expect((await harness.authority.readScope('iteration-b')).remaining.tokens.count).toBe(100);
  });

  it('excludes late results from the frozen reducer digest and rejects reducer drift', () => {
    const first = accepted('one', 1, 'answer-a', 'provider-a');
    const second = accepted('two', 2, 'answer-a', 'provider-b');
    const decision = finalizeFanInDecisionCandidate(view({ acceptedResults: [first, second] }));
    const frozenDigest = decision.reducerInputDigest;
    const late = result('late', 'branch-late', 'answer-a');
    const salvage = recordLateResultForSalvage(decision, late, 11);

    expect(salvage.authoritativeForDecision).toBe(false);
    expect(decision.reducerInputDigest).toBe(frozenDigest);
    expect(decision.includedResultEnvelopeIds).not.toContain(late.result_envelope_id);
    expect(bindReductionToDecision(decision, [first.envelope, second.envelope])).toMatchObject({
      decisionId: decision.decisionId,
      reducerInputDigest: frozenDigest,
    });
    expect(() => bindReductionToDecision(
      decision,
      [second.envelope, first.envelope],
    )).toThrow(/identity, order, or digest/);
    expect(() => bindReductionToDecision(
      decision,
      [first.envelope, second.envelope, late],
    )).toThrow(/count/);
  });
});

interface FanInLedgerHarness {
  readonly ledger: AppendOnlyLedger;
  readonly gateway: TransitionAuthorizationGateway;
  readonly policy: PolicyReference;
  readonly registry: ReturnType<typeof createConditionalFanInEventRegistry>;
}

const TERMINAL_EVENT_TYPE = 'fanout.branch.terminal';

function terminalDefinition(): EventTypeDefinition {
  return {
    eventType: TERMINAL_EVENT_TYPE,
    currentVersion: 1,
    versions: [{
      version: 1,
      payload: {
        requiredFields: ['status'],
        optionalFields: [],
        validate: (payload) => payload.status === 'completed',
      },
    }],
    upcasters: [],
  };
}

function createFanInLedgerHarness(): FanInLedgerHarness {
  const rootDirectory = temporaryRoot('conditional-fanin-ledger-');
  const registry = createConditionalFanInEventRegistry([terminalDefinition()]);
  const policies = policyRegistry('fanin-policy');
  const ledger = new AppendOnlyLedger({
    rootDirectory,
    ledgerId: 'fanin-domain',
    auditLedgerId: 'fanin-audit',
    authorityProvider: () => AUTHORITY,
    now: () => new Date('2026-07-21T12:00:00.000Z'),
  }, registry);
  const gateway = new TransitionAuthorizationGateway({
    rootDirectory,
    auditLedgerId: 'fanin-audit',
    authorityProvider: () => AUTHORITY,
    now: () => new Date('2026-07-21T12:00:00.000Z'),
  }, ledger, policies);
  return {
    ledger,
    gateway,
    registry,
    policy: policyReference(policies, 'fanin-policy'),
  };
}

async function appendTerminal(harness: FanInLedgerHarness): Promise<void> {
  const priorHead = await harness.ledger.getVerifiedHead();
  const event = prepareEventWrite({
    envelope_version: CURRENT_ENVELOPE_VERSION,
    event_id: 'terminal-event-1',
    event_type: TERMINAL_EVENT_TYPE,
    event_version: 1,
    stream_id: 'run-1',
    stream_sequence: 1,
    occurred_at: '2026-07-21T12:00:00.000Z',
    recorded_at: '2026-07-21T12:00:00.000Z',
    producer: { name: 'fixture', version: '1' },
    authority_epoch: 1,
    correlation_id: 'run-1',
    causation_id: null,
    idempotency_key: 'terminal-event-1',
    payload: { status: 'completed' },
  }, harness.registry);
  const authorization = await harness.gateway.authorize({
    requestId: 'authorize-terminal-event-1',
    mode: 'research',
    event,
    priorHead,
    priorStateVersion: '1',
    priorStateFingerprint: DIGEST_A,
    actorId: 'fanin-test',
    capabilityId: 'fanin-write',
    authorityEpoch: 1,
    policy: harness.policy,
    evidenceDigest: DIGEST_B,
  });
  if (authorization.verdict !== 'allow') throw new Error('Fixture authorization failed');
  await harness.ledger.appendAuthorized(event, authorization.proof);
}

function genesisDecision(harness: FanInLedgerHarness) {
  const policy = standardPolicy();
  const decisionView = buildFanInDecisionView({
    runId: 'run-1',
    waveId: 'wave-1',
    replayFingerprint: DIGEST_A,
    policy,
    policyDigest: conditionalFanInPolicyDigest(policy),
    cut: {
      ledgerId: harness.ledger.ledgerId,
      sequence: 0,
      recordHash: '0'.repeat(64),
      registryDigest: harness.registry.digest,
    },
    acceptedResults: [],
    outstandingBranches: [],
    partialFailurePolicyReference: policy.partialFailurePolicyReference,
    budget: budgetEvidence('not-applicable', 'no-eligible-outstanding-branch'),
    anomalyCodes: [],
  });
  return finalizeFanInDecisionCandidate(decisionView);
}

describe('ledgered decision freeze and additive-dark boundary', () => {
  it('commits the complete frozen decision against the exact authorized event cut', async () => {
    const harness = createFanInLedgerHarness();
    const decision = genesisDecision(harness);
    const receipt = await commitFanInDecision({
      decision,
      ledger: harness.ledger,
      gateway: harness.gateway,
      policy: harness.policy,
      mode: 'research',
      actorId: 'fanin-test',
      capabilityId: 'fanin-write',
      streamId: 'run-1',
      streamSequence: 1,
      occurredAt: '2026-07-21T12:00:00.000Z',
      recordedAt: '2026-07-21T12:00:00.000Z',
      producer: { name: 'conditional-fanin', version: '1' },
      authorityEpoch: 1,
      correlationId: 'run-1',
      causationId: null,
      registry: harness.registry,
    });
    const event = (await harness.ledger.readVerifiedEvents())[0];

    expect(receipt.sequence).toBe(1);
    expect(event.event.effective.envelope.payload).toMatchObject({
      decision_id: decision.decisionId,
      event_cut_sequence: 0,
      reducer_input_digest: decision.reducerInputDigest,
      decision_digest: decision.decisionDigest,
    });
  });

  it('rejects a finalized cut when a terminal event wins the cancel-complete race', async () => {
    const harness = createFanInLedgerHarness();
    const decision = genesisDecision(harness);
    await appendTerminal(harness);

    await expect(commitFanInDecision({
      decision,
      ledger: harness.ledger,
      gateway: harness.gateway,
      policy: harness.policy,
      mode: 'research',
      actorId: 'fanin-test',
      capabilityId: 'fanin-write',
      streamId: 'run-1',
      streamSequence: 1,
      occurredAt: '2026-07-21T12:00:00.000Z',
      recordedAt: '2026-07-21T12:00:00.000Z',
      producer: { name: 'conditional-fanin', version: '1' },
      authorityEpoch: 1,
      correlationId: 'run-1',
      causationId: null,
      registry: harness.registry,
    })).rejects.toThrow(/cut is stale/);
    expect((await harness.ledger.readVerifiedEvents()).map(
      (event) => event.event.effective.envelope.event_type,
    )).toEqual([TERMINAL_EVENT_TYPE]);
  });

  it('keeps wait-for-all authoritative while emitting a shadow candidate only', () => {
    const evaluation = evaluateConditionalFanInShadow(view());
    expect(evaluation).toMatchObject({
      authority: 'shadow',
      legacyWaitForAllAuthoritative: true,
      candidateDecision: { classification: 'all-eligible-terminal' },
    });
  });
});

// ───────────────────────────────────────────────────────────────────
// TEST: Partial Failure Policy
// ───────────────────────────────────────────────────────────────────

import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  AppendOnlyLedger,
  TransitionAuthorizationGateway,
  TransitionPolicyRegistry,
} from '../../lib/authorized-ledger/index.js';
import { prepareLineageDispatchResolvedEvent } from '../../lib/dispatch-receipts/index.js';
import {
  canonicalBytes,
  sha256Bytes,
} from '../../lib/event-envelope/index.js';
import {
  AtomicityDomains,
  FencedLeaseCoordinator,
  FencedLedgerWriter,
  ProtectedResourceKinds,
} from '../../lib/locks-and-fencing/index.js';
import {
  ABORT_EVENT_NAME,
  DEFAULT_PARTIAL_FAILURE_POLICY_ID,
  FailureClassStage,
  MAX_DIAGNOSTIC_SUMMARY_LENGTH,
  PARTIAL_FAILURE_ABORT_EVENT_TYPE,
  POLICY_EVALUATION_EVENT_TYPE,
  POLICY_SHADOW_COMPARISON_EVENT_TYPE,
  TERMINAL_FAILURE_EVENT_TYPE,
  buildIntegrityFailureEnvelope,
  buildTerminalFailureEnvelope,
  createPartialFailurePolicyEventRegistry,
  defaultPartialFailurePolicy,
  evaluatePartialFailurePolicy,
  evaluatePartialFailurePolicyDark,
  freezeAdmittedSet,
  recordPartialFailureEvaluation,
  recordPolicyShadowComparison,
  replayPartialFailureLedger,
  requiredSuccessCount,
  toleratedFailureCeiling,
  validateAdmittedSet,
} from '../../lib/partial-failure-policy/index.js';
import { AuthorizedEvidenceWriter } from '../../lib/receipts-and-effect-recovery/index.js';
import { buildLeafResultPayload } from '../../lib/result-envelopes/index.js';

import type {
  AuthoritySnapshot,
  PolicyEvaluationInput,
  PolicyEvaluationResult,
} from '../../lib/authorized-ledger/index.js';
import type { FanInDecisionView } from '../../lib/conditional-fanin/index.js';
import type {
  DispatchReceiptPayload,
  VerifiedLaunchFacts,
} from '../../lib/dispatch-receipts/index.js';
import type { EventTypeRegistry } from '../../lib/event-envelope/index.js';
import type { FencedLease } from '../../lib/locks-and-fencing/index.js';
import type {
  DecisionEpoch,
  FrozenAdmittedSet,
  NotAwaitedLeaf,
  PartialFailureEvaluation,
  PartialFailureEventContext,
  PartialFailureMode,
  RetryDiagnostic,
  LeafFailureClass,
  TerminalFailureEnvelope,
} from '../../lib/partial-failure-policy/index.js';
import type {
  LeafResultFacts,
  LeafResultPayload,
} from '../../lib/result-envelopes/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. FIXTURES
// ───────────────────────────────────────────────────────────────────

const T0 = '2026-07-21T10:00:00.000Z';
const T1 = '2026-07-21T10:01:00.000Z';
const HASH_A = sha256Bytes(canonicalBytes({ fixture: 'a' }));
const HASH_B = sha256Bytes(canonicalBytes({ fixture: 'b' }));
const AUTHORITY: AuthoritySnapshot = Object.freeze({ state: 'shadowing', epoch: 1 });
const roots: string[] = [];

interface FixtureSet {
  readonly admittedSet: FrozenAdmittedSet;
  readonly receipts: DispatchReceiptPayload[];
}

interface EvaluationFixture extends FixtureSet {
  readonly evaluation: PartialFailureEvaluation;
  readonly failures: TerminalFailureEnvelope[];
  readonly successes: LeafResultPayload[];
}

interface LedgerHarness {
  readonly context: PartialFailureEventContext;
  readonly ledger: AppendOnlyLedger;
  readonly registry: EventTypeRegistry;
  readonly root: string;
  readonly writer: AuthorizedEvidenceWriter;
}

const launch: VerifiedLaunchFacts = Object.freeze({
  adapterIdentity: 'partial-failure-fixture',
  adapterVersion: '1',
  effectiveConfig: {
    executable: 'fixture-executor',
    executableVersion: 'sha256:fixture',
    kind: 'fixture',
    model: null,
    permissionMode: 'acceptEdits',
    reasoningEffort: null,
    sandboxMode: 'workspace-write',
    serviceTier: null,
    webSearch: 'off',
  },
  effectiveConfigDigest: HASH_A,
  inputDigest: HASH_A,
  invocationFingerprint: `inv:${HASH_B}`,
  promptDigest: HASH_B,
});

function allowPolicy(_input: Readonly<PolicyEvaluationInput>): PolicyEvaluationResult {
  return { verdict: 'allow', reasonCode: 'allowed', matchedRuleIds: ['partial-failure-write'] };
}

function registry(): EventTypeRegistry {
  return createPartialFailurePolicyEventRegistry();
}

function receipt(index: number, eventRegistry: EventTypeRegistry): DispatchReceiptPayload {
  const id = String(index).padStart(3, '0');
  const event = prepareLineageDispatchResolvedEvent({
    attemptId: `attempt-${id}`,
    authorityEpoch: 1,
    capabilityRowId: 'partial-failure-dark',
    causationId: null,
    correlationId: 'run-1',
    dispatchId: `dispatch-${id}`,
    leafId: `leaf-${id}`,
    logicalBranchId: `branch-${id}`,
    occurredAt: T0,
    producer: { name: 'partial-failure-tests', version: '1' },
    recordedAt: T0,
    runId: 'run-1',
    streamId: `dispatch-${id}`,
    streamSequence: 1,
  }, launch, eventRegistry);
  return event.envelope.payload as DispatchReceiptPayload;
}

function decisionView(
  receipts: readonly DispatchReceiptPayload[],
  mode: PartialFailureMode = 'quorum',
): FanInDecisionView {
  return {
    acceptedResults: [],
    anomalyCodes: [],
    budget: {},
    cut: {
      ledgerId: 'fanout-ledger',
      recordHash: HASH_A,
      registryDigest: HASH_B,
      sequence: 42,
    },
    outstandingBranches: receipts.map((dispatchReceipt) => ({
      branch: {
        registration: { logical_branch_id: dispatchReceipt.logical_branch_id },
      },
    })),
    partialFailurePolicyReference: `${DEFAULT_PARTIAL_FAILURE_POLICY_ID}@1`,
    policy: { mode },
    policyDigest: HASH_A,
    replayFingerprint: HASH_B,
    runId: 'run-1',
    waveId: 'wave-1',
  } as unknown as FanInDecisionView;
}

function fixtureSet(
  size: number,
  notAwaited: readonly NotAwaitedLeaf[] = [],
): FixtureSet {
  const eventRegistry = registry();
  const receipts = Array.from({ length: size }, (_, index) => receipt(index + 1, eventRegistry));
  return {
    admittedSet: freezeAdmittedSet({
      decisionView: decisionView(receipts),
      dispatchReceipts: receipts,
      notAwaited,
    }),
    receipts,
  };
}

function result(
  dispatchReceipt: DispatchReceiptPayload,
  suffix = '',
): LeafResultPayload {
  const parsedResult = { answer: `success-${dispatchReceipt.logical_branch_id}${suffix}` };
  const facts: LeafResultFacts = {
    artifacts: [],
    completedAt: T1,
    cost: { amount: 1, currency: 'USD', provenance: 'measured' },
    durationMs: 60_000,
    errorClassification: null,
    errorDigest: null,
    evidence: [],
    parsedResult,
    parsedResultDigest: sha256Bytes(canonicalBytes(parsedResult)),
    parsedResultReference: null,
    replayFingerprint: HASH_A,
    resultSchemaVersion: 1,
    salvageSummary: { disposition: 'none', fragment_count: 0 },
    startedAt: T0,
    status: 'succeeded',
    usage: {
      input_tokens: 10,
      output_tokens: 5,
      provenance: 'measured',
      total_tokens: 15,
    },
  };
  return buildLeafResultPayload(dispatchReceipt, facts, 1);
}

function failure(
  admittedSet: FrozenAdmittedSet,
  dispatchReceipt: DispatchReceiptPayload,
  attemptEventIds: readonly string[] = [],
  diagnosticSummary: string | null = null,
): TerminalFailureEnvelope {
  return buildTerminalFailureEnvelope(admittedSet, {
    attemptEventIds,
    attemptId: dispatchReceipt.attempt_id,
    completedAt: T1,
    diagnosticCode: 'executor_exit',
    diagnosticSummary,
    dispatchReceiptId: dispatchReceipt.receipt_id,
    failureClass: 'executor_exit',
    retryability: attemptEventIds.length > 0 ? 'exhausted' : 'non_retryable',
    startedAt: T0,
  });
}

function epoch(
  admittedSet: FrozenAdmittedSet,
  boundaryState: DecisionEpoch['boundaryState'] = 'terminal',
  emptyTickDeclared = false,
): DecisionEpoch {
  return {
    boundaryState,
    deadlineAt: boundaryState === 'deadline_expired' ? T1 : null,
    emptyTickDeclared,
    epochId: admittedSet.decisionEpochId,
    evaluatedAt: T1,
  };
}

function evaluateFixture(
  size: number,
  failedCount: number,
  mode: PartialFailureMode = 'quorum',
  boundaryState: DecisionEpoch['boundaryState'] = 'terminal',
  notAwaited: readonly NotAwaitedLeaf[] = [],
): EvaluationFixture {
  const fixture = fixtureSet(size, notAwaited);
  const successes = fixture.receipts
    .slice(0, size - failedCount)
    .map((dispatchReceipt) => result(dispatchReceipt));
  const failures = fixture.receipts
    .slice(size - failedCount)
    .map((dispatchReceipt) => failure(fixture.admittedSet, dispatchReceipt));
  const evaluation = evaluatePartialFailurePolicy({
    admittedSet: fixture.admittedSet,
    decisionEpoch: epoch(fixture.admittedSet, boundaryState),
    policy: defaultPartialFailurePolicy(mode),
    successfulResults: successes,
    terminalFailures: failures,
  });
  return { ...fixture, evaluation, failures, successes };
}

function temporaryRoot(): string {
  const root = mkdtempSync(join(tmpdir(), 'partial-failure-policy-'));
  roots.push(root);
  return root;
}

function ledgerHarness(): LedgerHarness {
  const root = temporaryRoot();
  const eventRegistry = registry();
  const policies = new TransitionPolicyRegistry([{
    policyId: 'partial-failure-shadow',
    policyVersion: 1,
    evaluatorVersion: '1',
    ruleIds: ['partial-failure-write'],
    evaluate: allowPolicy,
  }]);
  const ledger = new AppendOnlyLedger({
    rootDirectory: root,
    ledgerId: 'partial-failure-policy',
    auditLedgerId: 'partial-failure-policy-authorization',
    authorityProvider: () => AUTHORITY,
  }, eventRegistry);
  const gateway = new TransitionAuthorizationGateway({
    rootDirectory: root,
    auditLedgerId: 'partial-failure-policy-authorization',
    authorityProvider: () => AUTHORITY,
  }, ledger, policies);
  const coordinator = new FencedLeaseCoordinator({ rootDirectory: root, operationTimeoutMs: 5_000 });
  const lease: Promise<FencedLease> = coordinator.acquire({
    resource: {
      atomicityDomain: AtomicityDomains.SINGLE_HOST_FILESYSTEM,
      components: { ledgerId: ledger.ledgerId },
      kind: ProtectedResourceKinds.LEDGER,
    },
    ownerId: 'partial-failure-test-writer',
    correlationId: 'run-1',
    ttlMs: 300_000,
    acquireTimeoutMs: 5_000,
  });
  const writer = new AuthorizedEvidenceWriter({
    authorizationContext: (event) => ({
      actorId: 'partial-failure-service',
      authorityEpoch: event.identity.authorityEpoch,
      capabilityId: 'partial-failure-write',
      evidenceDigest: event.canonicalDigest,
      mode: 'research',
      policyId: 'partial-failure-shadow',
      policyVersion: 1,
      priorStateFingerprint: HASH_A,
      priorStateVersion: 'partial-failure-dark@1',
    }),
    gateway,
    ledger,
    ledgerFence: {
      currentLease: () => lease,
      writer: new FencedLedgerWriter(coordinator),
    },
    policies,
    registry: eventRegistry,
  });
  return {
    context: {
      authorityEpoch: 1,
      causationId: null,
      correlationId: 'run-1',
      producer: { name: 'partial-failure-tests', version: '1' },
      recordedAt: T1,
      streamId: 'partial-failure-run-1',
      streamSequence: 1,
    },
    ledger,
    registry: eventRegistry,
    root,
    writer,
  };
}

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

// ───────────────────────────────────────────────────────────────────
// 2. DENOMINATOR AND QUORUM
// ───────────────────────────────────────────────────────────────────

describe('immutable admitted denominator', () => {
  it('freezes child-004 await branches and keeps not-awaited leaves separate', () => {
    const notAwaited = [{
      evidenceId: 'budget-decision-1',
      leafId: 'leaf-not-awaited',
      logicalBranchId: 'branch-not-awaited',
      reasonCode: 'pre_admission_budget_rejected',
    }];
    const source = fixtureSet(3, notAwaited);
    const digest = source.admittedSet.admittedSetDigest;
    source.receipts.push(receipt(99, registry()));

    expect(source.admittedSet.branches).toHaveLength(3);
    expect(source.admittedSet.notAwaited).toEqual(notAwaited);
    expect(source.admittedSet.admittedSetDigest).toBe(digest);
    expect(Object.isFrozen(source.admittedSet)).toBe(true);
    expect(Object.isFrozen(source.admittedSet.branches)).toBe(true);
    expect(validateAdmittedSet(source.admittedSet)).toBe(source.admittedSet);
  });

  it('rejects branch-set drift and canonical receipt incompatibility', () => {
    const eventRegistry = registry();
    const receipts = [receipt(1, eventRegistry), receipt(2, eventRegistry)];
    expect(() => freezeAdmittedSet({
      decisionView: decisionView(receipts),
      dispatchReceipts: receipts.slice(0, 1),
    })).toThrow(/do not match/);

    const incompatible = { ...receipts[0], run_id: 'other-run' } as DispatchReceiptPayload;
    expect(() => freezeAdmittedSet({
      decisionView: decisionView(receipts),
      dispatchReceipts: [incompatible, receipts[1]],
    })).toThrow(/canonical|another run/);
  });
});

describe('exact default quorum', () => {
  it.each([
    [1, 0], [2, 0], [3, 1], [4, 1], [5, 1], [6, 2], [7, 2], [8, 2],
  ])('size %i tolerates exactly %i failures', (size, tolerated) => {
    const policy = defaultPartialFailurePolicy();
    expect(requiredSuccessCount(policy, size)).toBe(Math.ceil((2 * size) / 3));
    expect(toleratedFailureCeiling(policy, size)).toBe(tolerated);
    expect(evaluateFixture(size, tolerated).evaluation.verdict)
      .toBe(tolerated === 0 ? 'proceed' : 'proceed_degraded');
    if (tolerated < size) {
      expect(evaluateFixture(size, tolerated + 1).evaluation.verdict).toBe('abort');
    }
  });

  it.each([9, 10, 11, 12, 30, 100])(
    'applies both exact gates for large fan-out size %i',
    (size) => {
    const ceiling = Math.floor(size / 3);
    const passing = evaluateFixture(size, ceiling).evaluation;
    const failing = evaluateFixture(size, ceiling + 1).evaluation;
    expect(passing.policyEvaluationReceipt.required_success_count)
      .toBe(Math.ceil((2 * size) / 3));
    expect(passing.policyEvaluationReceipt.tolerated_failure_ceiling).toBe(ceiling);
    expect(passing.verdict).toBe('proceed_degraded');
    expect(failing.verdict).toBe('abort');
    },
  );
});

// ───────────────────────────────────────────────────────────────────
// 3. STATE MACHINE AND EVIDENCE
// ───────────────────────────────────────────────────────────────────

describe('four-verdict state machine', () => {
  it('emits await, proceed, proceed_degraded, and abort from one evaluator', () => {
    const open = fixtureSet(3);
    const awaiting = evaluatePartialFailurePolicy({
      admittedSet: open.admittedSet,
      decisionEpoch: epoch(open.admittedSet, 'open'),
      policy: defaultPartialFailurePolicy(),
      successfulResults: [result(open.receipts[0])],
      terminalFailures: [],
    });
    expect(awaiting.verdict).toBe('await');
    expect(evaluateFixture(3, 0).evaluation.verdict).toBe('proceed');
    expect(evaluateFixture(3, 1).evaluation.verdict).toBe('proceed_degraded');
    expect(evaluateFixture(3, 2).evaluation.verdict).toBe('abort');
  });

  it('keeps progressive quorum provisional until the boundary closes', () => {
    const fixture = fixtureSet(3);
    const successes = fixture.receipts.slice(0, 2).map((item) => result(item));
    const provisional = evaluatePartialFailurePolicy({
      admittedSet: fixture.admittedSet,
      decisionEpoch: epoch(fixture.admittedSet, 'open'),
      policy: defaultPartialFailurePolicy('progressive'),
      successfulResults: successes,
      terminalFailures: [],
    });
    expect(provisional.verdict).toBe('proceed_degraded');
    expect(provisional.finality).toBe('provisional');
    expect(provisional.degradedMarker).toBeNull();
    expect(provisional.reductionRequest).toBeNull();

    const final = evaluatePartialFailurePolicy({
      admittedSet: fixture.admittedSet,
      decisionEpoch: epoch(fixture.admittedSet),
      policy: defaultPartialFailurePolicy('progressive'),
      successfulResults: successes,
      terminalFailures: [failure(fixture.admittedSet, fixture.receipts[2])],
    });
    expect(final.verdict).toBe('proceed_degraded');
    expect(final.finality).toBe('final');
  });

  it('makes strict mode reject one failed leaf', () => {
    expect(evaluateFixture(8, 1, 'strict').evaluation.verdict).toBe('abort');
  });

  it('turns every unresolved admitted branch into one deadline failure', () => {
    const fixture = fixtureSet(5);
    const successes = fixture.receipts.slice(0, 4).map((item) => result(item));
    const evaluated = evaluatePartialFailurePolicy({
      admittedSet: fixture.admittedSet,
      decisionEpoch: epoch(fixture.admittedSet, 'deadline_expired'),
      policy: defaultPartialFailurePolicy('deadline'),
      successfulResults: successes,
      terminalFailures: [],
    });
    expect(evaluated.verdict).toBe('proceed_degraded');
    expect(evaluated.synthesizedFailures).toHaveLength(1);
    expect(evaluated.synthesizedFailures[0].failure_class).toBe('deadline_expired');
    expect(evaluated.policyEvaluationReceipt.pending).toBe(0);
  });
});

describe('retry and integrity precedence', () => {
  it.each([
    ['executor_exit', 'executor'],
    ['executor_signal', 'executor'],
    ['executor_timeout', 'executor'],
    ['deadline_expired', 'executor'],
    ['artifact_missing', 'artifact'],
    ['artifact_parse', 'artifact'],
    ['salvage_exhausted', 'salvage'],
    ['leaf_policy_violation', 'policy'],
    ['budget_rejected', 'budget'],
  ] as const)('classifies %s at the %s stage', (failureClass, stage) => {
    const fixture = fixtureSet(1);
    const envelope = buildTerminalFailureEnvelope(fixture.admittedSet, {
      attemptId: fixture.receipts[0].attempt_id,
      completedAt: T1,
      diagnosticCode: failureClass,
      dispatchReceiptId: fixture.receipts[0].receipt_id,
      failureClass,
      retryability: 'non_retryable',
      startedAt: T0,
    });
    expect(envelope.failure_class).toBe(failureClass as LeafFailureClass);
    expect(envelope.stage).toBe(stage);
    expect(FailureClassStage[failureClass]).toBe(stage);
  });

  it('links retries diagnostically and counts one terminal failed branch once', () => {
    const fixture = fixtureSet(3);
    const retries: RetryDiagnostic[] = [1, 2].map((attemptNumber) => ({
      attemptEventId: `retry-event-${attemptNumber}`,
      attemptId: `retry-attempt-${attemptNumber}`,
      attemptNumber,
      diagnosticCode: 'executor_exit',
      diagnosticSummary: null,
      logicalBranchId: fixture.receipts[2].logical_branch_id,
      occurredAt: T0,
      retryScheduled: true,
    }));
    const terminal = failure(
      fixture.admittedSet,
      fixture.receipts[2],
      retries.map((retry) => retry.attemptEventId),
    );
    const evaluated = evaluatePartialFailurePolicy({
      admittedSet: fixture.admittedSet,
      decisionEpoch: epoch(fixture.admittedSet),
      policy: defaultPartialFailurePolicy(),
      retryDiagnostics: [...retries, retries[0]],
      successfulResults: fixture.receipts.slice(0, 2).map((item) => result(item)),
      terminalFailures: [terminal, terminal],
    });
    expect(evaluated.policyEvaluationReceipt.failed).toBe(1);
    expect(evaluated.policyEvaluationReceipt.terminal_failure_ids).toEqual([terminal.failure_id]);
    expect(evaluated.policyEvaluationReceipt.retry_event_ids).toEqual([
      'retry-event-1',
      'retry-event-2',
    ]);
  });

  it('aborts on one run-fatal integrity record despite a passing 99-of-100 quorum', () => {
    const fixture = fixtureSet(100);
    const fatal = buildIntegrityFailureEnvelope({
      completedAt: T1,
      decisionEpochId: fixture.admittedSet.decisionEpochId,
      diagnosticCode: 'ledger_corruption',
      runId: fixture.admittedSet.runId,
    });
    const evaluated = evaluatePartialFailurePolicy({
      admittedSet: fixture.admittedSet,
      decisionEpoch: epoch(fixture.admittedSet),
      policy: defaultPartialFailurePolicy(),
      successfulResults: fixture.receipts.slice(0, 99).map((item) => result(item)),
      terminalFailures: [fatal],
    });
    expect(evaluated.verdict).toBe('abort');
    expect(evaluated.reductionRequest).toBeNull();
    expect(evaluated.policyEvaluationReceipt.reason_codes).toContain('orchestration_integrity');
  });

  it('turns a missing policy input into a run-fatal abort', () => {
    const fixture = fixtureSet(1);
    const evaluated = evaluatePartialFailurePolicy({
      admittedSet: fixture.admittedSet,
      decisionEpoch: epoch(fixture.admittedSet),
      policy: null,
      successfulResults: [result(fixture.receipts[0])],
      terminalFailures: [],
    });
    expect(evaluated.verdict).toBe('abort');
    expect(evaluated.synthesizedFailures.some(
      (item) => item.diagnostic_code === 'missing_policy_input',
    )).toBe(true);
  });
});

describe('degraded and zero-leaf contracts', () => {
  it('marks a sufficient partial result and hands off only validated successes', () => {
    const notAwaited = [{
      evidenceId: 'pre-admission-1',
      leafId: 'leaf-skipped',
      logicalBranchId: 'branch-skipped',
      reasonCode: 'not_selected',
    }];
    const fixture = evaluateFixture(5, 1, 'quorum', 'terminal', notAwaited);
    const marker = fixture.evaluation.degradedMarker;
    expect(marker).not.toBeNull();
    if (marker === null) throw new TypeError('Expected a final degraded marker');
    expect(marker).toMatchObject({
      admitted: 5,
      degraded: true,
      failed: 1,
      finality: 'final',
      marker_type: 'degraded',
      not_awaited: 1,
      policy_id: DEFAULT_PARTIAL_FAILURE_POLICY_ID,
      policy_version: 1,
      succeeded: 4,
      tolerated_failure_ceiling: 1,
    });
    expect(marker.policy_evaluation_receipt_id)
      .toBe(fixture.evaluation.policyEvaluationReceipt.receipt_id);
    expect(fixture.evaluation.reductionRequest?.successfulEnvelopes.map(
      (envelope) => envelope.result_envelope_id,
    )).toEqual(fixture.evaluation.policyEvaluationReceipt.successful_result_envelope_ids);
    expect(fixture.evaluation.reductionRequest?.successfulEnvelopes)
      .not.toContain(fixture.failures[0]);
  });

  it('keeps diagnostics bounded and secret-shaped material redacted', () => {
    const fixture = fixtureSet(1);
    const terminal = failure(
      fixture.admittedSet,
      fixture.receipts[0],
      [],
      `password=do-not-store ${'x'.repeat(2_000)}`,
    );
    expect(terminal.diagnostic_summary?.length).toBe(MAX_DIAGNOSTIC_SUMMARY_LENGTH);
    expect(terminal.diagnostic_summary).not.toContain('do-not-store');
  });

  it('distinguishes declared empty ticks from unexplained empty denominators', () => {
    const fixture = fixtureSet(0);
    const declared = evaluatePartialFailurePolicy({
      admittedSet: fixture.admittedSet,
      decisionEpoch: epoch(fixture.admittedSet, 'terminal', true),
      policy: defaultPartialFailurePolicy(),
      successfulResults: [],
      terminalFailures: [],
    });
    const unexplained = evaluatePartialFailurePolicy({
      admittedSet: fixture.admittedSet,
      decisionEpoch: epoch(fixture.admittedSet),
      policy: defaultPartialFailurePolicy(),
      successfulResults: [],
      terminalFailures: [],
    });
    expect(declared.applicability).toBe('not_applicable');
    expect(declared.verdict).toBeNull();
    expect(declared.degradedMarker).toBeNull();
    expect(unexplained.verdict).toBe('abort');
  });
});

// ───────────────────────────────────────────────────────────────────
// 4. LEDGER AND REPLAY
// ───────────────────────────────────────────────────────────────────

describe('append-only verdict replay', () => {
  it('keeps legacy status and exit authority while ledgering a known-defect difference', async () => {
    const fixture = evaluateFixture(3, 2);
    const legacyOutcome = {
      exitCode: 2 as const,
      status: 'partial' as const,
      value: { summary: 'legacy-authoritative' },
    };
    const dark = evaluatePartialFailurePolicyDark({
      admittedSet: fixture.admittedSet,
      decisionEpoch: epoch(fixture.admittedSet),
      policy: defaultPartialFailurePolicy(),
      successfulResults: fixture.successes,
      terminalFailures: fixture.failures,
    }, legacyOutcome, T1);
    expect(dark.authority).toBe('legacy-authoritative');
    expect(dark.legacyOutcome).toBe(legacyOutcome);
    expect(dark.shadowEvaluation.verdict).toBe('abort');
    expect(dark.comparison.classification).toBe('known_defect_difference');

    const harness = ledgerHarness();
    await recordPolicyShadowComparison(
      dark.comparison,
      harness.context,
      harness.registry,
      harness.writer,
    );
    const events = await harness.ledger.readVerifiedEvents();
    expect(events[0].event.effective.envelope.event_type)
      .toBe(POLICY_SHADOW_COMPARISON_EVENT_TYPE);
    expect(replayPartialFailureLedger(events).shadowComparisons)
      .toEqual([dark.comparison]);
  });

  it('replays the same final verdict after restart and excludes a late result', async () => {
    const harness = ledgerHarness();
    const fixture = evaluateFixture(3, 1);
    await recordPartialFailureEvaluation({
      context: harness.context,
      evaluation: fixture.evaluation,
      registry: harness.registry,
      terminalFailures: fixture.failures,
      writer: harness.writer,
    });
    const initialEvents = await harness.ledger.readVerifiedEvents();
    expect(initialEvents.map((event) => event.event.effective.envelope.event_type)).toEqual([
      TERMINAL_FAILURE_EVENT_TYPE,
      POLICY_EVALUATION_EVENT_TYPE,
      'orchestration.partial-failure.degraded-recorded',
    ]);

    const restartedLedger = new AppendOnlyLedger({
      rootDirectory: harness.root,
      ledgerId: 'partial-failure-policy',
      auditLedgerId: 'partial-failure-policy-authorization',
      authorityProvider: () => AUTHORITY,
    }, harness.registry);
    const restarted = replayPartialFailureLedger(
      await restartedLedger.readVerifiedEvents(),
      fixture.admittedSet.decisionEpochId,
    );
    expect(restarted.finalEvaluation?.receipt_id)
      .toBe(fixture.evaluation.policyEvaluationReceipt.receipt_id);
    expect(restarted.finalEvaluation?.verdict).toBe('proceed_degraded');

    const lateResult = result(fixture.receipts[2], '-late');
    const withLate = evaluatePartialFailurePolicy({
      admittedSet: fixture.admittedSet,
      closedEvaluation: fixture.evaluation,
      decisionEpoch: epoch(fixture.admittedSet),
      policy: defaultPartialFailurePolicy(),
      successfulResults: [lateResult, lateResult],
      terminalFailures: fixture.failures,
    });
    await recordPartialFailureEvaluation({
      context: harness.context,
      evaluation: withLate,
      registry: harness.registry,
      terminalFailures: fixture.failures,
      writer: harness.writer,
    });
    const replayed = replayPartialFailureLedger(
      await restartedLedger.readVerifiedEvents(),
      fixture.admittedSet.decisionEpochId,
    );
    expect(replayed.finalEvaluation?.receipt_id)
      .toBe(fixture.evaluation.policyEvaluationReceipt.receipt_id);
    expect(replayed.finalEvaluation?.verdict).toBe('proceed_degraded');
    expect(replayed.lateResults).toHaveLength(1);
    expect(replayed.lateResults[0]).toMatchObject({
      closed_policy_evaluation_receipt_id: fixture.evaluation.policyEvaluationReceipt.receipt_id,
      excluded: true,
      result_envelope_id: lateResult.result_envelope_id,
    });
  });

  it('collapses duplicate terminal event identity during replay', async () => {
    const harness = ledgerHarness();
    const fixture = evaluateFixture(3, 1);
    await recordPartialFailureEvaluation({
      context: harness.context,
      evaluation: fixture.evaluation,
      registry: harness.registry,
      terminalFailures: [fixture.failures[0], fixture.failures[0]],
      writer: harness.writer,
    });
    const events = await harness.ledger.readVerifiedEvents();
    const replayed = replayPartialFailureLedger([events[0], ...events]);
    expect(replayed.duplicateEventCount).toBe(1);
    expect(replayed.terminalFailures).toHaveLength(1);
    expect(replayed.finalEvaluation?.verdict).toBe('proceed_degraded');
  });

  it('ledgers abort without producing a reduction or degraded transition', async () => {
    const harness = ledgerHarness();
    const fixture = evaluateFixture(3, 2);
    expect(fixture.evaluation.policyEvaluationReceipt.event_name)
      .not.toBe(ABORT_EVENT_NAME);
    expect(fixture.evaluation.reductionRequest).toBeNull();
    await recordPartialFailureEvaluation({
      context: harness.context,
      evaluation: fixture.evaluation,
      registry: harness.registry,
      terminalFailures: fixture.failures,
      writer: harness.writer,
    });
    const eventTypes = (await harness.ledger.readVerifiedEvents()).map(
      (event) => event.event.effective.envelope.event_type,
    );
    expect(eventTypes.filter((eventType) => eventType === TERMINAL_FAILURE_EVENT_TYPE))
      .toHaveLength(2);
    expect(eventTypes).toContain(PARTIAL_FAILURE_ABORT_EVENT_TYPE);
    expect(eventTypes).not.toContain('orchestration.partial-failure.degraded-recorded');
  });
});

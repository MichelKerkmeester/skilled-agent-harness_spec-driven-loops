// ───────────────────────────────────────────────────────────────────
// MODULE: Hierarchical Budget Contract Tests
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
import { canonicalBytes, sha256Bytes } from '../../lib/event-envelope/index.js';
import {
  BudgetEventTypes,
  BudgetReasonCodes,
  FanOutBudgetShadowAdapter,
  HierarchicalBudgetAuthority,
  ValueOfComputationBudgetShadowAdapter,
  addBudgetValues,
  budgetEvidenceDigest,
  budgetVector,
  costBudget,
  createBudgetEnvelope,
  createBudgetEventRegistry,
  createBudgetReplayComponentRegistry,
  createBudgetReplayExecutionInput,
  evaluateLegacyCouncilGuard,
  evaluateLegacyFanOutAggregate,
  iterationBudget,
  tokenBudget,
  wallTimeBudget,
} from '../../lib/hierarchical-budgets/index.js';
import {
  createReplayFingerprintVersionRegistry,
  deriveReplayFingerprint,
} from '../../lib/replay-fingerprint/index.js';

import type {
  AuthoritySnapshot,
  PolicyEvaluationInput,
  PolicyEvaluationResult,
} from '../../lib/authorized-ledger/index.js';
import type { JsonObject } from '../../lib/event-envelope/index.js';
import type {
  BudgetEnvelopeInput,
  BudgetEvidenceInput,
  BudgetMutationResult,
  BudgetProjection,
  BudgetReservationProjection,
  BudgetScopeProjection,
  BudgetVector,
  NormalizedBudgetReceipt,
  ReserveBudgetInput,
} from '../../lib/hierarchical-budgets/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. FIXTURE TYPES
// ───────────────────────────────────────────────────────────────────

interface Harness {
  readonly rootDirectory: string;
  readonly ledger: AppendOnlyLedger;
  readonly authority: HierarchicalBudgetAuthority;
  readonly eventRegistry: ReturnType<typeof createBudgetEventRegistry>;
  readonly replayFingerprint: string;
  readonly pricingDigest: string;
  readonly clock: { monotonicMs: number };
  readonly failNextAppend: { value: boolean };
  readonly recreateAuthority: () => HierarchicalBudgetAuthority;
}

interface TreeOptions {
  readonly programTokens?: number;
  readonly modeTokens?: number;
  readonly lineageTokens?: number;
  readonly iterationTokens?: number;
}

// ───────────────────────────────────────────────────────────────────
// 2. FIXTURE HELPERS
// ───────────────────────────────────────────────────────────────────

const temporaryRoots: string[] = [];
const DEADLINE_MS = 10_000;
const AUTHORITY: AuthoritySnapshot = Object.freeze({ state: 'shadowing', epoch: 1 });

function temporaryRoot(): string {
  const root = mkdtempSync(join(tmpdir(), 'hierarchical-budgets-'));
  temporaryRoots.push(root);
  return root;
}

function evaluateBudgetPolicy(
  input: Readonly<PolicyEvaluationInput>,
): PolicyEvaluationResult {
  return input.capabilityId === 'budget-write'
    ? { verdict: 'allow', reasonCode: 'allowed', matchedRuleIds: ['budget-write'] }
    : { verdict: 'deny', reasonCode: 'policy_denied', matchedRuleIds: ['budget-write'] };
}

function createHarness(): Harness {
  const rootDirectory = temporaryRoot();
  const eventRegistry = createBudgetEventRegistry();
  const policies = new TransitionPolicyRegistry([{
    policyId: 'budget-policy',
    policyVersion: 1,
    evaluatorVersion: '1',
    ruleIds: ['budget-write'],
    evaluate: evaluateBudgetPolicy,
  }]);
  const authorityProvider = (): AuthoritySnapshot => AUTHORITY;
  const failNextAppend = { value: false };
  const ledger = new AppendOnlyLedger({
    rootDirectory,
    ledgerId: 'budget-domain',
    auditLedgerId: 'budget-authorization-audit',
    authorityProvider,
    now: () => new Date('2026-07-21T12:00:00.000Z'),
    faultInjection: {
      beforeDomainCommit: () => {
        if (!failNextAppend.value) return;
        failNextAppend.value = false;
        throw new Error('injected append failure');
      },
    },
  }, eventRegistry);
  const gateway = new TransitionAuthorizationGateway({
    rootDirectory,
    auditLedgerId: 'budget-authorization-audit',
    authorityProvider,
    now: () => new Date('2026-07-21T12:00:00.000Z'),
  }, ledger, policies);
  const policy = policies.resolve('budget-policy', 1);
  const replayFingerprint = sha256Bytes(canonicalBytes({ replay: 'budget-fixture' }));
  const pricingDigest = sha256Bytes(canonicalBytes({ pricing: 'fixture-v1' }));
  const clock = { monotonicMs: 100 };
  const recreateAuthority = (): HierarchicalBudgetAuthority => (
    new HierarchicalBudgetAuthority({
      ledger,
      gateway,
      eventRegistry,
      policy: {
        policyId: policy.policyId,
        policyVersion: policy.policyVersion,
        policyDigest: policy.digest,
      },
      now: () => new Date('2026-07-21T12:00:00.000Z'),
      monotonicNow: () => clock.monotonicMs,
    })
  );
  const authority = recreateAuthority();
  return {
    rootDirectory,
    ledger,
    authority,
    eventRegistry,
    replayFingerprint,
    pricingDigest,
    clock,
    failNextAppend,
    recreateAuthority,
  };
}

function evidence(harness: Harness, requestId: string): BudgetEvidenceInput {
  return {
    requestId,
    mode: 'research',
    actorId: 'budget-test',
    capabilityId: 'budget-write',
    authorityEpoch: 1,
    evidenceDigest: budgetEvidenceDigest({ requestId, fixture: true }),
    replayFingerprint: harness.replayFingerprint,
    correlationId: `correlation-${requestId}`,
    causationId: null,
  };
}

function vector(
  harness: Harness,
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

function envelope(
  harness: Harness,
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
    createdAtMonotonicMs: harness.clock.monotonicMs,
    limits,
  };
}

async function createTree(
  harness: Harness,
  options: TreeOptions = {},
): Promise<void> {
  const programTokens = options.programTokens ?? 100;
  const modeTokens = options.modeTokens ?? Math.min(80, programTokens);
  const lineageTokens = options.lineageTokens ?? Math.min(60, modeTokens);
  const iterationTokens = options.iterationTokens ?? Math.min(50, lineageTokens);
  const operations: Array<Promise<BudgetMutationResult>> = [];
  operations.push(harness.authority.createRoot({
    ...evidence(harness, 'create-program'),
    envelope: envelope(
      harness,
      'budget-program',
      'program',
      'program',
      null,
      null,
      vector(harness, programTokens, programTokens * 10, 20, 9_900),
    ),
  }));
  expect((await operations.shift())?.decision.status).toBe('created');
  expect((await harness.authority.allocateChild({
    ...evidence(harness, 'allocate-mode'),
    envelope: envelope(
      harness,
      'budget-mode',
      'mode',
      'mode',
      'budget-program',
      'program',
      vector(harness, modeTokens, modeTokens * 10, 16, 9_900),
    ),
  })).decision.status).toBe('allocated');
  expect((await harness.authority.allocateChild({
    ...evidence(harness, 'allocate-lineage'),
    envelope: envelope(
      harness,
      'budget-lineage',
      'lineage',
      'lineage',
      'budget-mode',
      'mode',
      vector(harness, lineageTokens, lineageTokens * 10, 12, 9_900),
    ),
  })).decision.status).toBe('allocated');
  expect((await harness.authority.allocateChild({
    ...evidence(harness, 'allocate-iteration'),
    envelope: envelope(
      harness,
      'budget-iteration',
      'iteration',
      'iteration',
      'budget-lineage',
      'lineage',
      vector(harness, iterationTokens, iterationTokens * 10, 10, 9_900),
    ),
  })).decision.status).toBe('allocated');
}

function reservation(
  harness: Harness,
  requestId: string,
  reservationId: string,
  estimate: BudgetVector,
  scopeId = 'iteration',
): ReserveBudgetInput {
  return {
    ...evidence(harness, requestId),
    scopeId,
    reservationId,
    dispatchId: `dispatch-${reservationId}`,
    estimate,
    leaseDurationMs: 1_000,
  };
}

function projectionScopes(
  projection: Readonly<BudgetProjection>,
): Readonly<Record<string, BudgetScopeProjection>> {
  return projection.scopes as unknown as Readonly<Record<string, BudgetScopeProjection>>;
}

function projectionReservations(
  projection: Readonly<BudgetProjection>,
): Readonly<Record<string, BudgetReservationProjection>> {
  return projection.reservations as unknown as Readonly<Record<string, BudgetReservationProjection>>;
}

function receipt(
  harness: Harness,
  reservationId: string,
  usage: BudgetVector,
  terminalStatus: NormalizedBudgetReceipt['terminalStatus'] = 'succeeded',
): NormalizedBudgetReceipt {
  return {
    receiptId: `receipt-${reservationId}`,
    dispatchId: `dispatch-${reservationId}`,
    replayFingerprint: harness.replayFingerprint,
    pricingDigest: harness.pricingDigest,
    terminalStatus,
    usage,
  };
}

afterEach(() => {
  while (temporaryRoots.length > 0) {
    const root = temporaryRoots.pop();
    if (root) rmSync(root, { recursive: true, force: true });
  }
});

// ───────────────────────────────────────────────────────────────────
// 3. TYPED VALUE AND SCOPE CONTRACT
// ───────────────────────────────────────────────────────────────────

describe('typed budget values and scope envelopes', () => {
  it('rejects cross-dimension arithmetic instead of coercing aliases', () => {
    expect(() => addBudgetValues(tokenBudget(1), iterationBudget(1))).toThrow(TypeError);
    expect(() => addBudgetValues(tokenBudget(1), costBudget(
      1,
      'USD',
      6,
      'a'.repeat(64),
    ))).toThrow(TypeError);
  });

  it('rejects negative, overflow, currency, and pricing mismatches', () => {
    expect(() => tokenBudget(-1)).toThrow(RangeError);
    expect(() => tokenBudget(Number.MAX_SAFE_INTEGER + 1)).toThrow(RangeError);
    expect(() => costBudget(1, 'usd', 6, 'a'.repeat(64))).toThrow(TypeError);
    expect(() => addBudgetValues(
      costBudget(1, 'USD', 6, 'a'.repeat(64)),
      costBudget(1, 'EUR', 6, 'b'.repeat(64)),
    )).toThrow(TypeError);
  });

  it('enforces the exact parent level, inherited replay identity, and narrowing rule', () => {
    const harness = createHarness();
    const root = createBudgetEnvelope(envelope(
      harness,
      'root',
      'program',
      'program',
      null,
      null,
      vector(harness, 10, 100, 5, 9_900),
    ));
    expect(() => createBudgetEnvelope(envelope(
      harness,
      'bad-level',
      'lineage',
      'lineage',
      'root',
      'program',
      vector(harness, 5, 50, 2, 9_900),
    ), root)).toThrow(TypeError);
    expect(() => createBudgetEnvelope(envelope(
      harness,
      'wider',
      'mode',
      'mode',
      'root',
      'program',
      vector(harness, 11, 110, 6, 9_900),
    ), root)).toThrow(RangeError);
  });
});

// ───────────────────────────────────────────────────────────────────
// 4. HIERARCHY AND ATOMIC ADMISSION
// ───────────────────────────────────────────────────────────────────

describe('hierarchical allocation and atomic admission', () => {
  it('rebuilds the complete program-to-iteration tree from authorized events', async () => {
    const harness = createHarness();
    await createTree(harness);
    const projection = await harness.authority.readProjection();

    expect(Object.keys(projectionScopes(projection.state))).toEqual([
      'iteration',
      'lineage',
      'mode',
      'program',
    ]);
    expect(projectionScopes(projection.state).program.childScopeIds).toEqual(['mode']);
    expect(projectionScopes(projection.state).iteration.balances.tokens.remaining).toBe(50);
  });

  it('rejects orphan and wrong-parent allocations without minting a scope', async () => {
    const harness = createHarness();
    const result = await harness.authority.allocateChild({
      ...evidence(harness, 'orphan'),
      envelope: envelope(
        harness,
        'orphan-budget',
        'mode',
        'orphan',
        'missing-budget',
        'missing-scope',
        vector(harness, 1),
      ),
    });

    expect(result.decision).toMatchObject({ status: 'denied', reasonCode: 'missing_scope' });
    expect((await harness.ledger.getVerifiedHead()).sequence).toBe(0);
  });

  it('reserves exact capacity across every ancestor in one ledger transition', async () => {
    const harness = createHarness();
    await createTree(harness);
    const result = await harness.authority.admit(reservation(
      harness,
      'reserve-exact',
      'exact',
      vector(harness, 50, 500, 1, 500),
    ));
    const projection = await harness.authority.readProjection();

    expect(result.decision).toMatchObject({ status: 'granted', dispatchAllowed: true });
    for (const scopeId of ['program', 'mode', 'lineage', 'iteration']) {
      expect(projectionScopes(projection.state)[scopeId].balances.tokens.reserved).toBe(50);
    }
  });

  it('records one typed exhaustion and leaves every dimension unchanged on failure', async () => {
    const harness = createHarness();
    await createTree(harness);
    const before = await harness.authority.readProjection();
    const result = await harness.authority.admit(reservation(
      harness,
      'reserve-over',
      'over',
      vector(harness, 51, 10, 1, 10),
    ));
    const after = await harness.authority.readProjection();
    const events = await harness.ledger.readVerifiedEvents();

    expect(result.decision).toMatchObject({ status: 'denied', reasonCode: 'budget_exhausted' });
    expect(projectionScopes(after.state).iteration.balances).toEqual(
      projectionScopes(before.state).iteration.balances,
    );
    expect(events.at(-1)?.event.effective.envelope.event_type).toBe(
      BudgetEventTypes.EXHAUSTION_RECORDED,
    );
  });

  it('serializes sibling races so only one request consumes the final remainder', async () => {
    const harness = createHarness();
    await createTree(harness, {
      programTokens: 10,
      modeTokens: 10,
      lineageTokens: 10,
      iterationTokens: 10,
    });
    const [left, right] = await Promise.all([
      harness.authority.admit(reservation(harness, 'race-left', 'race-left', vector(harness, 10))),
      harness.authority.admit(reservation(harness, 'race-right', 'race-right', vector(harness, 10))),
    ]);
    const projection = await harness.authority.readProjection();

    expect([left, right].filter((result) => result.decision.status === 'granted')).toHaveLength(1);
    expect([left, right].filter((result) => result.decision.status === 'denied')).toHaveLength(1);
    expect(projectionScopes(projection.state).program.balances.tokens.reserved).toBe(10);
    expect(projectionScopes(projection.state).program.balances.tokens.remaining).toBe(0);
  });

  it('returns the original logical outcome for a duplicate request without a second event', async () => {
    const harness = createHarness();
    await createTree(harness);
    const input = reservation(harness, 'reserve-idempotent', 'idempotent', vector(harness, 5));
    const first = await harness.authority.admit(input);
    const head = await harness.ledger.getVerifiedHead();
    const second = await harness.authority.admit(input);

    expect(second.decision).toEqual(first.decision);
    expect(second.isIdempotent).toBe(true);
    expect((await harness.ledger.getVerifiedHead()).sequence).toBe(head.sequence);
  });

  it('fails closed when one request identity is reused for another operation', async () => {
    const harness = createHarness();
    await createTree(harness);
    await harness.authority.admit(reservation(
      harness,
      'request-conflict',
      'request-conflict',
      vector(harness, 5),
    ));
    const result = await harness.authority.startAttempt({
      ...evidence(harness, 'request-conflict'),
      reservationId: 'request-conflict',
    });

    expect(result.decision).toMatchObject({ status: 'denied', reasonCode: 'request_conflict' });
  });
});

// ───────────────────────────────────────────────────────────────────
// 5. SETTLEMENT, EXPIRY, AND RECONCILIATION
// ───────────────────────────────────────────────────────────────────

describe('receipt-backed settlement and recovery', () => {
  it('charges retries at start and retains failed terminal spend', async () => {
    const harness = createHarness();
    await createTree(harness);
    await harness.authority.admit(reservation(
      harness,
      'reserve-retry',
      'retry',
      vector(harness, 10, 100, 2, 1_000),
    ));
    await harness.authority.startAttempt({ ...evidence(harness, 'start-retry-1'), reservationId: 'retry' });
    await harness.authority.startAttempt({ ...evidence(harness, 'start-retry-2'), reservationId: 'retry' });
    const settled = await harness.authority.settle({
      ...evidence(harness, 'settle-retry'),
      reservationId: 'retry',
      receipt: receipt(harness, 'retry', vector(harness, 8, 80, 2, 600), 'failed'),
    });
    const projection = await harness.authority.readProjection();

    expect(settled.decision.status).toBe('settled');
    expect(projectionScopes(projection.state).iteration.balances.iterations.committed).toBe(2);
    expect(projectionScopes(projection.state).iteration.balances.tokens.committed).toBe(8);
    expect(projectionScopes(projection.state).iteration.balances.tokens.released).toBe(2);
  });

  it('settles under-estimate usage and releases only the proven unused remainder', async () => {
    const harness = createHarness();
    await createTree(harness);
    await harness.authority.admit(reservation(
      harness,
      'reserve-under',
      'under',
      vector(harness, 10, 100, 1, 1_000),
    ));
    await harness.authority.startAttempt({ ...evidence(harness, 'start-under'), reservationId: 'under' });
    await harness.authority.settle({
      ...evidence(harness, 'settle-under'),
      reservationId: 'under',
      receipt: receipt(harness, 'under', vector(harness, 6, 70, 1, 400)),
    });
    const projection = await harness.authority.readProjection();
    const reservationState = projectionReservations(projection.state).under;

    expect(reservationState.status).toBe('settled');
    expect(projectionScopes(projection.state).iteration.balances.tokens).toMatchObject({
      reserved: 0,
      committed: 6,
      released: 4,
      remaining: 44,
    });
  });

  it('quarantines missing usage, blocks admission, and clears the block after reconciliation', async () => {
    const harness = createHarness();
    await createTree(harness);
    await harness.authority.admit(reservation(
      harness,
      'reserve-reconcile',
      'reconcile',
      vector(harness, 10, 100, 1, 1_000),
    ));
    await harness.authority.startAttempt({
      ...evidence(harness, 'start-reconcile'),
      reservationId: 'reconcile',
    });
    const missing = await harness.authority.settle({
      ...evidence(harness, 'settle-missing'),
      reservationId: 'reconcile',
      receipt: null,
    });
    const blocked = await harness.authority.admit(reservation(
      harness,
      'reserve-while-blocked',
      'blocked',
      vector(harness, 1),
    ));
    const reconciled = await harness.authority.reconcile({
      ...evidence(harness, 'reconcile-later'),
      reservationId: 'reconcile',
      receipt: receipt(harness, 'reconcile', vector(harness, 5, 50, 1, 300)),
    });
    const scope = await harness.authority.readScope('iteration');

    expect(missing.decision).toMatchObject({ status: 'anomaly', reasonCode: 'unknown_usage' });
    expect(blocked.decision).toMatchObject({ status: 'denied', reasonCode: 'scope_blocked' });
    expect(reconciled.decision.status).toBe('reconciled');
    expect(scope.unreconciledReservations).toBe(0);
    expect(scope.scope.blockedReason).toBeNull();
  });

  it('records over-estimate actual spend as unreconciled without negative balances', async () => {
    const harness = createHarness();
    await createTree(harness);
    await harness.authority.admit(reservation(
      harness,
      'reserve-over-actual',
      'over-actual',
      vector(harness, 5, 50, 1, 500),
    ));
    await harness.authority.startAttempt({
      ...evidence(harness, 'start-over-actual'),
      reservationId: 'over-actual',
    });
    const result = await harness.authority.settle({
      ...evidence(harness, 'settle-over-actual'),
      reservationId: 'over-actual',
      receipt: receipt(harness, 'over-actual', vector(harness, 6, 60, 1, 500)),
    });
    const projection = await harness.authority.readProjection();

    expect(result.decision).toMatchObject({
      status: 'anomaly',
      reasonCode: 'actual_exceeds_reservation',
    });
    expect(projectionReservations(projection.state)['over-actual'].status).toBe('unreconciled');
    expect(projectionScopes(projection.state).iteration.balances.tokens.remaining).toBeGreaterThanOrEqual(0);
  });

  it('releases an unstarted expired lease but refuses early expiry', async () => {
    const harness = createHarness();
    await createTree(harness);
    await harness.authority.admit(reservation(
      harness,
      'reserve-expire',
      'expire',
      vector(harness, 5),
    ));
    const early = await harness.authority.expire({
      ...evidence(harness, 'expire-early'),
      reservationId: 'expire',
    });
    harness.clock.monotonicMs = 1_101;
    const expired = await harness.authority.expire({
      ...evidence(harness, 'expire-final'),
      reservationId: 'expire',
    });
    const projection = await harness.authority.readProjection();

    expect(early.decision.reasonCode).toBe('not_yet_expired');
    expect(expired.decision.status).toBe('expired');
    expect(projectionReservations(projection.state).expire.status).toBe('expired');
    expect(projectionScopes(projection.state).iteration.balances.tokens.reserved).toBe(0);
  });

  it('requires no-dispatch evidence before cancellation releases capacity', async () => {
    const harness = createHarness();
    await createTree(harness);
    await harness.authority.admit(reservation(
      harness,
      'reserve-cancel',
      'cancel',
      vector(harness, 5),
    ));
    const result = await harness.authority.cancel({
      ...evidence(harness, 'cancel-without-proof'),
      reservationId: 'cancel',
      noDispatchEvidenceDigest: null,
    });

    expect(result.decision).toMatchObject({
      status: 'anomaly',
      reasonCode: 'no_dispatch_evidence_required',
    });
  });

  it('renews and partially releases one reservation idempotently', async () => {
    const harness = createHarness();
    await createTree(harness);
    await harness.authority.admit(reservation(
      harness,
      'reserve-partial',
      'partial',
      vector(harness, 10, 100, 2, 1_000),
    ));
    const renewed = await harness.authority.renew({
      ...evidence(harness, 'renew-partial'),
      reservationId: 'partial',
      leaseDurationMs: 2_000,
    });
    const releaseInput = {
      ...evidence(harness, 'release-partial'),
      reservationId: 'partial',
      release: vector(harness, 3, 30, 0, 300),
      unusedEvidenceDigest: budgetEvidenceDigest({ unused: 'partial' }),
    };
    const firstRelease = await harness.authority.release(releaseInput);
    const duplicateRelease = await harness.authority.release(releaseInput);
    const projection = await harness.authority.readProjection();
    const reservationState = projectionReservations(projection.state).partial;

    expect(renewed.decision.status).toBe('renewed');
    expect(firstRelease.decision.status).toBe('released');
    expect(duplicateRelease.isIdempotent).toBe(true);
    expect(reservationState.leaseExpiresAtMonotonicMs).toBe(2_100);
    expect(projectionScopes(projection.state).iteration.balances.tokens).toMatchObject({
      reserved: 7,
      released: 3,
    });
  });

  it('cancels an unstarted reservation when no-dispatch evidence is present', async () => {
    const harness = createHarness();
    await createTree(harness);
    await harness.authority.admit(reservation(
      harness,
      'reserve-cancel-safe',
      'cancel-safe',
      vector(harness, 5),
    ));
    const cancelled = await harness.authority.cancel({
      ...evidence(harness, 'cancel-safe'),
      reservationId: 'cancel-safe',
      noDispatchEvidenceDigest: budgetEvidenceDigest({ dispatch: 'absent' }),
    });
    const projection = await harness.authority.readProjection();

    expect(cancelled.decision.status).toBe('cancelled');
    expect(projectionReservations(projection.state)['cancel-safe'].status).toBe('cancelled');
    expect(projectionScopes(projection.state).iteration.balances.tokens.reserved).toBe(0);
  });

  it('resumes from ledger state after authority re-instantiation', async () => {
    const harness = createHarness();
    await createTree(harness);
    await harness.authority.admit(reservation(
      harness,
      'reserve-resume',
      'resume',
      vector(harness, 5, 50, 1, 500),
    ));
    await harness.authority.startAttempt({
      ...evidence(harness, 'start-resume'),
      reservationId: 'resume',
    });

    const resumed = harness.recreateAuthority();
    const settled = await resumed.settle({
      ...evidence(harness, 'settle-resume'),
      reservationId: 'resume',
      receipt: receipt(harness, 'resume', vector(harness, 4, 40, 1, 300)),
    });

    expect(settled.decision.status).toBe('settled');
    expect(projectionReservations((await resumed.readProjection()).state).resume.status).toBe('settled');
  });
});

// ───────────────────────────────────────────────────────────────────
// 6. FAIL-CLOSED EVIDENCE AND SHADOW MIGRATION
// ───────────────────────────────────────────────────────────────────

describe('fail-closed evidence and dark migration', () => {
  it('denies stale pricing and replay mismatch before a reservation exists', async () => {
    const harness = createHarness();
    await createTree(harness);
    const stale = vector(harness, 1);
    const stalePricing = budgetVector({
      ...stale,
      cost: costBudget(10, 'USD', 6, 'b'.repeat(64)),
    });
    const pricingResult = await harness.authority.admit(reservation(
      harness,
      'stale-pricing',
      'stale-pricing',
      stalePricing,
    ));
    const replayResult = await harness.authority.admit({
      ...reservation(harness, 'replay-mismatch', 'replay-mismatch', vector(harness, 1)),
      replayFingerprint: 'c'.repeat(64),
    });

    expect(pricingResult.decision.reasonCode).toBe('stale_pricing');
    expect(replayResult.decision.reasonCode).toBe('replay_mismatch');
  });

  it('denies child allocation after parent spend consumes the allocatable remainder', async () => {
    const harness = createHarness();
    expect((await harness.authority.createRoot({
      ...evidence(harness, 'create-tight-root'),
      envelope: envelope(
        harness,
        'tight-root',
        'program',
        'tight-program',
        null,
        null,
        vector(harness, 10, 100, 5, 9_900),
      ),
    })).decision.status).toBe('created');
    await harness.authority.admit(reservation(
      harness,
      'reserve-tight-root',
      'tight-root-use',
      vector(harness, 9, 90, 1, 100),
      'tight-program',
    ));
    const allocation = await harness.authority.allocateChild({
      ...evidence(harness, 'allocate-after-spend'),
      envelope: envelope(
        harness,
        'late-mode-budget',
        'mode',
        'late-mode',
        'tight-root',
        'tight-program',
        vector(harness, 2, 20, 1, 9_900),
      ),
    });

    expect(allocation.decision).toMatchObject({
      status: 'denied',
      reasonCode: 'budget_exhausted',
    });
  });

  it('denies admission after the monotonic scope deadline', async () => {
    const harness = createHarness();
    await createTree(harness);
    harness.clock.monotonicMs = DEADLINE_MS;
    const result = await harness.authority.admit(reservation(
      harness,
      'deadline-exhausted',
      'deadline-exhausted',
      vector(harness, 1),
    ));

    expect(result.decision).toMatchObject({
      status: 'denied',
      reasonCode: 'deadline_exhausted',
      dispatchAllowed: false,
    });
  });

  it('denies gateway authorization failure without appending a domain event', async () => {
    const harness = createHarness();
    await createTree(harness);
    const before = await harness.ledger.getVerifiedHead();
    const result = await harness.authority.admit({
      ...reservation(harness, 'authorization-denied', 'authorization-denied', vector(harness, 1)),
      capabilityId: 'read-only',
    });

    expect(result.decision).toMatchObject({
      status: 'denied',
      reasonCode: 'authorization_denied',
    });
    expect((await harness.ledger.getVerifiedHead()).sequence).toBe(before.sequence);
  });

  it('denies a ledger write failure and leaves no domain mutation', async () => {
    const harness = createHarness();
    await createTree(harness);
    const before = await harness.ledger.getVerifiedHead();
    harness.failNextAppend.value = true;
    const result = await harness.authority.admit(reservation(
      harness,
      'append-failure',
      'append-failure',
      vector(harness, 1),
    ));

    expect(result.decision).toMatchObject({ status: 'denied', reasonCode: 'ledger_write_failed' });
    expect((await harness.ledger.getVerifiedHead()).sequence).toBe(before.sequence);
  });

  it('derives byte-identical replay fingerprints from the authorized budget ledger', async () => {
    const harness = createHarness();
    await createTree(harness);
    await harness.authority.admit(reservation(
      harness,
      'fingerprint-reserve',
      'fingerprint',
      vector(harness, 2),
    ));
    const head = await harness.ledger.getVerifiedHead();
    const input = {
      ledger: harness.ledger,
      eventRegistry: harness.eventRegistry,
      versionRegistry: createReplayFingerprintVersionRegistry(),
      componentRegistry: createBudgetReplayComponentRegistry(),
      runId: 'budget-run',
      rangeStartSequence: 1,
      rangeEndSequence: head.sequence,
      replay: createBudgetReplayExecutionInput(),
    };
    const first = await deriveReplayFingerprint(input);
    const second = await deriveReplayFingerprint(input);

    expect(second.descriptor).toEqual(first.descriptor);
    expect(Buffer.from(second.descriptorBytes)).toEqual(Buffer.from(first.descriptorBytes));
  });

  it('pins the shipped council and aggregate fan-out baselines', () => {
    expect(evaluateLegacyCouncilGuard({})).toMatchObject({
      continue_allowed: true,
      stop_reasons: [],
      upper_bound: { max_rounds: 15, max_seat_outputs: 45 },
    });
    expect(evaluateLegacyFanOutAggregate({
      lineages: Array.from({ length: 5 }, (_, index) => ({ label: `lineage-${index + 1}` })),
      maxRetries: 5,
    })).toMatchObject({
      continue_allowed: false,
      stop_reasons: ['max_aggregate_cost_units'],
      upper_bound: { estimated_cost_units: 360, max_aggregate_cost_units: 288 },
    });
  });

  it('keeps legacy fan-out authoritative while exposing a typed accounting delta', async () => {
    const harness = createHarness();
    await createTree(harness, {
      programTokens: 2,
      modeTokens: 2,
      lineageTokens: 2,
      iterationTokens: 2,
    });
    const adapter = new FanOutBudgetShadowAdapter(harness.authority);
    const comparison = await adapter.admit({
      reservation: reservation(harness, 'fanout-shadow', 'fanout-shadow', vector(harness, 3)),
      lineage: { label: 'shadow', iterations: 1 },
      guards: { maxCostUnitsPerLineage: 72, costUnitsPerIteration: 1 },
      maxRetries: 0,
    });

    expect(comparison).toMatchObject({
      authority: 'legacy',
      authoritativeDispatchAllowed: true,
      parity: 'typed-accounting-delta',
      shadowStopReason: 'incomplete-budget-exhausted',
      converged: false,
    });
  });

  it('reports convergence budget exhaustion as incomplete without calling it converged', async () => {
    const harness = createHarness();
    await createTree(harness, {
      programTokens: 1,
      modeTokens: 1,
      lineageTokens: 1,
      iterationTokens: 1,
    });
    const adapter = new ValueOfComputationBudgetShadowAdapter(harness.authority);
    const comparison = await adapter.admit(
      true,
      reservation(harness, 'voc-shadow', 'voc-shadow', vector(harness, 2)),
    );

    expect(comparison).toMatchObject({
      authority: 'legacy',
      authoritativeSampleAllowed: true,
      shadowStopReason: 'incomplete-budget-exhausted',
      converged: false,
    });
  });

  it('exposes remaining capacity, reservation age, and settlement lag as read-only data', async () => {
    const harness = createHarness();
    await createTree(harness);
    await harness.authority.admit(reservation(
      harness,
      'read-model-reserve',
      'read-model',
      vector(harness, 5),
    ));
    harness.clock.monotonicMs = 500;
    const readModel = await harness.authority.readScope('iteration');

    expect(readModel).toMatchObject({
      openReservations: 1,
      unreconciledReservations: 0,
      oldestReservationAgeMs: 400,
      remaining: { tokens: { count: 45 } },
    });
  });
});

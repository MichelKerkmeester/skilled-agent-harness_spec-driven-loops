// ───────────────────────────────────────────────────────────────────
// MODULE: Partial Failure Policy and Admitted Set
// ───────────────────────────────────────────────────────────────────

import {
  canonicalBytes,
  sha256Bytes,
} from '../event-envelope/index.js';
import { isDispatchReceiptPayload } from '../dispatch-receipts/index.js';

import type {
  AdmittedBranch,
  CountFractionGate,
  FreezeAdmittedSetInput,
  FrozenAdmittedSet,
  NotAwaitedLeaf,
  PartialFailurePolicy,
  PartialFailurePolicyReference,
} from './types.js';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

export const DEFAULT_PARTIAL_FAILURE_POLICY_ID = 'durable-fanin-partial-failure';
export const DEFAULT_PARTIAL_FAILURE_POLICY_VERSION = 1;
export const PARTIAL_FAILURE_POLICY_SCHEMA_VERSION = 1;
export const MAX_ADMITTED_BRANCHES = 10_000;

const SAFE_IDENTIFIER_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:@/-]{0,255}$/;
const HASH_PATTERN = /^[a-f0-9]{64}$/;

// ───────────────────────────────────────────────────────────────────
// 2. HELPERS
// ───────────────────────────────────────────────────────────────────

function compareText(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function assertIdentifier(value: string, field: string): void {
  if (!SAFE_IDENTIFIER_PATTERN.test(value)) {
    throw new TypeError(`${field} must be a bounded stable identifier`);
  }
}

function assertGate(gate: CountFractionGate, name: string): void {
  if (
    !Number.isSafeInteger(gate.numerator)
    || !Number.isSafeInteger(gate.denominator)
    || gate.numerator < 0
    || gate.denominator <= 0
    || gate.numerator > gate.denominator
    || (gate.count !== null && (!Number.isSafeInteger(gate.count) || gate.count < 0))
  ) {
    throw new TypeError(`${name} must contain a valid bounded count and fraction`);
  }
}

function canonicalNotAwaited(leaves: readonly NotAwaitedLeaf[]): NotAwaitedLeaf[] {
  const seen = new Set<string>();
  return [...leaves]
    .map((leaf) => {
      assertIdentifier(leaf.logicalBranchId, 'notAwaited.logicalBranchId');
      assertIdentifier(leaf.leafId, 'notAwaited.leafId');
      assertIdentifier(leaf.evidenceId, 'notAwaited.evidenceId');
      assertIdentifier(leaf.reasonCode, 'notAwaited.reasonCode');
      if (seen.has(leaf.logicalBranchId)) {
        throw new TypeError('notAwaited contains a duplicate logical branch');
      }
      seen.add(leaf.logicalBranchId);
      return Object.freeze({ ...leaf });
    })
    .sort((left, right) => compareText(left.logicalBranchId, right.logicalBranchId));
}

function decisionAwaitSet(input: FreezeAdmittedSetInput): string[] {
  const accepted = input.decisionView.acceptedResults.map(
    (result) => result.envelope.logical_branch_id,
  );
  const outstanding = input.decisionView.outstandingBranches.map(
    (branch) => branch.branch.registration.logical_branch_id,
  );
  const combined = [...accepted, ...outstanding].sort(compareText);
  if (new Set(combined).size !== combined.length) {
    throw new TypeError('Fan-in decision contains a duplicate logical branch');
  }
  return combined;
}

function admittedBranches(input: FreezeAdmittedSetInput): AdmittedBranch[] {
  const expectedBranches = decisionAwaitSet(input);
  if (expectedBranches.length > MAX_ADMITTED_BRANCHES) {
    throw new TypeError('Admitted branch count exceeds the replay safety limit');
  }
  const receiptsByBranch = new Map<string, typeof input.dispatchReceipts[number][]>();
  const canonicalReceiptIds = new Map<string, string>();

  for (const receipt of input.dispatchReceipts) {
    if (!isDispatchReceiptPayload(receipt)) {
      throw new TypeError('Admitted set contains an incompatible canonical dispatch receipt');
    }
    if (receipt.run_id !== input.decisionView.runId) {
      throw new TypeError('Admitted dispatch receipt belongs to another run');
    }
    const canonicalDigest = sha256Bytes(canonicalBytes(receipt));
    const priorDigest = canonicalReceiptIds.get(receipt.receipt_id);
    if (priorDigest !== undefined && priorDigest !== canonicalDigest) {
      throw new TypeError('Dispatch receipt identity is bound to incompatible canonical facts');
    }
    if (priorDigest !== undefined) continue;
    canonicalReceiptIds.set(receipt.receipt_id, canonicalDigest);
    const receipts = receiptsByBranch.get(receipt.logical_branch_id) ?? [];
    receipts.push(receipt);
    receiptsByBranch.set(receipt.logical_branch_id, receipts);
  }

  const actualBranches = [...receiptsByBranch.keys()].sort(compareText);
  if (
    sha256Bytes(canonicalBytes(actualBranches))
    !== sha256Bytes(canonicalBytes(expectedBranches))
  ) {
    throw new TypeError('Admitted dispatch receipts do not match the frozen fan-in await set');
  }

  return expectedBranches.map((logicalBranchId) => {
    const receipts = [...(receiptsByBranch.get(logicalBranchId) ?? [])]
      .sort((left, right) => compareText(
        `${left.attempt_id}\u0000${left.receipt_id}`,
        `${right.attempt_id}\u0000${right.receipt_id}`,
      ));
    if (receipts.length === 0) {
      throw new TypeError('An admitted logical branch has no canonical dispatch receipt');
    }
    const leafIds = [...new Set(receipts.map((receipt) => receipt.leaf_id))];
    if (leafIds.length !== 1) {
      throw new TypeError('Logical branch identity collides across leaf identities');
    }
    const leafId = leafIds[0];
    if (leafId === undefined) {
      throw new TypeError('Logical branch has no stable leaf identity');
    }
    const attemptIds = receipts.map((receipt) => receipt.attempt_id);
    const dispatchIds = receipts.map((receipt) => receipt.dispatch_id);
    const dispatchReceiptIds = receipts.map((receipt) => receipt.receipt_id);
    const executorKinds = receipts.map((receipt) => receipt.executor_kind);
    Object.freeze(attemptIds);
    Object.freeze(dispatchIds);
    Object.freeze(dispatchReceiptIds);
    Object.freeze(executorKinds);
    return Object.freeze({
      attemptIds,
      dispatchIds,
      dispatchReceiptIds,
      executorKinds,
      leafId,
      logicalBranchId,
    }) as AdmittedBranch;
  });
}

function admittedSetDigestInput(admittedSet: Omit<FrozenAdmittedSet, 'admittedSetDigest'>) {
  return {
    branches: admittedSet.branches,
    decision_boundary: admittedSet.decisionBoundary,
    decision_epoch_id: admittedSet.decisionEpochId,
    not_awaited: admittedSet.notAwaited,
    partial_failure_policy_reference: admittedSet.partialFailurePolicyReference,
    replay_fingerprint: admittedSet.replayFingerprint,
    run_id: admittedSet.runId,
    schema_version: admittedSet.schemaVersion,
    wave_id: admittedSet.waveId,
  };
}

// ───────────────────────────────────────────────────────────────────
// 3. POLICY
// ───────────────────────────────────────────────────────────────────

/** Return the exact two-thirds quorum used when no named override is supplied. */
export function defaultPartialFailurePolicy(
  mode: PartialFailurePolicy['mode'] = 'quorum',
): PartialFailurePolicy {
  return Object.freeze({
    failureGate: Object.freeze({ count: null, denominator: 3, numerator: 1 }),
    mode,
    policyId: DEFAULT_PARTIAL_FAILURE_POLICY_ID,
    policyVersion: DEFAULT_PARTIAL_FAILURE_POLICY_VERSION,
    successGate: Object.freeze({ count: null, denominator: 3, numerator: 2 }),
  });
}

/** Validate a policy and return a frozen copy suitable for deterministic evaluation. */
export function validatePartialFailurePolicy(
  policy: PartialFailurePolicy,
): PartialFailurePolicy {
  assertIdentifier(policy.policyId, 'policyId');
  if (!Number.isSafeInteger(policy.policyVersion) || policy.policyVersion <= 0) {
    throw new TypeError('policyVersion must be a positive safe integer');
  }
  if (!['deadline', 'progressive', 'quorum', 'strict'].includes(policy.mode)) {
    throw new TypeError('mode must be one of the four supported policy modes');
  }
  assertGate(policy.successGate, 'successGate');
  assertGate(policy.failureGate, 'failureGate');
  return Object.freeze({
    ...policy,
    failureGate: Object.freeze({ ...policy.failureGate }),
    successGate: Object.freeze({ ...policy.successGate }),
  });
}

/** Hash the complete versioned policy so replay cannot silently change threshold arithmetic. */
export function partialFailurePolicyDigest(policy: PartialFailurePolicy): string {
  return sha256Bytes(canonicalBytes(validatePartialFailurePolicy(policy)));
}

/** Bind a validated policy to the immutable decision receipt. */
export function partialFailurePolicyReference(
  policy: PartialFailurePolicy,
): PartialFailurePolicyReference {
  const validated = validatePartialFailurePolicy(policy);
  return Object.freeze({
    policyDigest: partialFailurePolicyDigest(validated),
    policyId: validated.policyId,
    policyVersion: validated.policyVersion,
  });
}

/** Calculate the required success count using integer arithmetic only. */
export function requiredSuccessCount(
  policy: PartialFailurePolicy,
  admitted: number,
): number {
  if (!Number.isSafeInteger(admitted) || admitted < 0 || admitted > MAX_ADMITTED_BRANCHES) {
    throw new TypeError('admitted must be a bounded non-negative safe integer');
  }
  const validated = validatePartialFailurePolicy(policy);
  if (validated.mode === 'strict') return admitted;
  const fraction = Math.ceil(
    (validated.successGate.numerator * admitted) / validated.successGate.denominator,
  );
  return Math.max(fraction, validated.successGate.count ?? 0);
}

/** Calculate the tolerated failure ceiling using integer arithmetic only. */
export function toleratedFailureCeiling(
  policy: PartialFailurePolicy,
  admitted: number,
): number {
  if (!Number.isSafeInteger(admitted) || admitted < 0 || admitted > MAX_ADMITTED_BRANCHES) {
    throw new TypeError('admitted must be a bounded non-negative safe integer');
  }
  const validated = validatePartialFailurePolicy(policy);
  if (validated.mode === 'strict') return 0;
  const fraction = Math.floor(
    (validated.failureGate.numerator * admitted) / validated.failureGate.denominator,
  );
  return Math.min(fraction, validated.failureGate.count ?? admitted);
}

// ───────────────────────────────────────────────────────────────────
// 4. IMMUTABLE ADMITTED SET
// ───────────────────────────────────────────────────────────────────

/** Freeze child-004's await set and canonical dispatch receipts into a replayable denominator. */
export function freezeAdmittedSet(input: FreezeAdmittedSetInput): FrozenAdmittedSet {
  const branches = admittedBranches(input);
  const notAwaited = canonicalNotAwaited(input.notAwaited ?? []);
  const admittedIds = new Set(branches.map((branch) => branch.logicalBranchId));
  if (notAwaited.some((leaf) => admittedIds.has(leaf.logicalBranchId))) {
    throw new TypeError('A logical branch cannot be both admitted and not awaited');
  }
  if (!HASH_PATTERN.test(input.decisionView.replayFingerprint)) {
    throw new TypeError('Fan-in replay fingerprint is not a canonical digest');
  }
  const boundary = Object.freeze({
    ledgerId: input.decisionView.cut.ledgerId,
    recordHash: input.decisionView.cut.recordHash,
    registryDigest: input.decisionView.cut.registryDigest,
    sequence: input.decisionView.cut.sequence,
  });
  const decisionEpochId = `partial-failure-epoch:${sha256Bytes(canonicalBytes({
    boundary,
    run_id: input.decisionView.runId,
    wave_id: input.decisionView.waveId,
  }))}`;
  Object.freeze(branches);
  Object.freeze(notAwaited);
  const withoutDigest = {
    branches,
    decisionBoundary: boundary,
    decisionEpochId,
    notAwaited,
    partialFailurePolicyReference: input.decisionView.partialFailurePolicyReference,
    replayFingerprint: input.decisionView.replayFingerprint,
    runId: input.decisionView.runId,
    schemaVersion: PARTIAL_FAILURE_POLICY_SCHEMA_VERSION,
    waveId: input.decisionView.waveId,
  };
  return Object.freeze({
    admittedSetDigest: sha256Bytes(canonicalBytes(admittedSetDigestInput(withoutDigest))),
    ...withoutDigest,
  }) as FrozenAdmittedSet;
}

/** Recompute all denominator invariants before trusting a live or replayed admitted set. */
export function validateAdmittedSet(admittedSet: FrozenAdmittedSet): FrozenAdmittedSet {
  if (
    admittedSet.schemaVersion !== PARTIAL_FAILURE_POLICY_SCHEMA_VERSION
    || admittedSet.branches.length > MAX_ADMITTED_BRANCHES
    || !HASH_PATTERN.test(admittedSet.replayFingerprint)
    || !HASH_PATTERN.test(admittedSet.admittedSetDigest)
    || !HASH_PATTERN.test(admittedSet.decisionBoundary.recordHash)
    || !HASH_PATTERN.test(admittedSet.decisionBoundary.registryDigest)
    || !Number.isSafeInteger(admittedSet.decisionBoundary.sequence)
    || admittedSet.decisionBoundary.sequence < 0
    || !admittedSet.decisionEpochId.startsWith('partial-failure-epoch:')
  ) {
    throw new TypeError('Admitted set has an unsupported or unbounded shape');
  }
  assertIdentifier(admittedSet.runId, 'runId');
  assertIdentifier(admittedSet.waveId, 'waveId');
  assertIdentifier(admittedSet.decisionBoundary.ledgerId, 'decisionBoundary.ledgerId');
  const branchIds = admittedSet.branches.map((branch) => branch.logicalBranchId);
  if (
    new Set(branchIds).size !== branchIds.length
    || branchIds.some((branchId, index) => {
      const prior = branchIds[index - 1];
      return prior !== undefined && prior >= branchId;
    })
  ) {
    throw new TypeError('Admitted branches are duplicated or not canonically ordered');
  }
  for (const branch of admittedSet.branches) {
    assertIdentifier(branch.logicalBranchId, 'branch.logicalBranchId');
    assertIdentifier(branch.leafId, 'branch.leafId');
    const width = branch.dispatchReceiptIds.length;
    if (
      width === 0
      || branch.attemptIds.length !== width
      || branch.dispatchIds.length !== width
      || branch.executorKinds.length !== width
      || new Set(branch.dispatchReceiptIds).size !== width
    ) {
      throw new TypeError('Admitted branch receipt identities are incomplete or duplicated');
    }
    for (const value of [
      ...branch.attemptIds,
      ...branch.dispatchIds,
      ...branch.dispatchReceiptIds,
      ...branch.executorKinds,
    ]) {
      assertIdentifier(value, 'branch receipt identity');
    }
  }
  const notAwaitedIds = admittedSet.notAwaited.map((leaf) => leaf.logicalBranchId);
  if (
    new Set(notAwaitedIds).size !== notAwaitedIds.length
    || notAwaitedIds.some((branchId) => branchIds.includes(branchId))
  ) {
    throw new TypeError('Not-awaited leaves overlap or contain duplicate logical branches');
  }
  for (const leaf of admittedSet.notAwaited) {
    assertIdentifier(leaf.logicalBranchId, 'notAwaited.logicalBranchId');
    assertIdentifier(leaf.leafId, 'notAwaited.leafId');
    assertIdentifier(leaf.evidenceId, 'notAwaited.evidenceId');
    assertIdentifier(leaf.reasonCode, 'notAwaited.reasonCode');
  }
  const recomputed = sha256Bytes(canonicalBytes(admittedSetDigestInput(admittedSet)));
  if (recomputed !== admittedSet.admittedSetDigest) {
    throw new TypeError('Admitted set digest does not match its canonical denominator facts');
  }
  return admittedSet;
}

import {
  BudgetReasonCodes,
  addBudgetVectors,
  budgetScopePath,
  snapshotBudgetBalances,
} from '../hierarchical-budgets/index.js';
import {
  canonicalBytes,
  sha256Bytes,
} from '../event-envelope/index.js';

import type {
  BudgetEvidenceInput,
  BudgetVector,
  HierarchicalBudgetAuthority,
} from '../hierarchical-budgets/index.js';
import type {
  ConditionalFanInPolicy,
  ContinuationBudgetEvidence,
  FanInBudgetSnapshot,
  FanInEventCut,
  OutstandingBranchAtCut,
} from './types.js';

function branchId(branch: OutstandingBranchAtCut): string {
  return branch.branch.registration.logical_branch_id;
}

function rankEligibleBranches(
  branches: readonly OutstandingBranchAtCut[],
  policy: ConditionalFanInPolicy,
): readonly OutstandingBranchAtCut[] {
  const eligible = branches.filter((branch) => (
    branch.partialFailureEligible && branch.executionState !== 'terminal'
  ));
  return eligible.sort((left, right) => {
    if (policy.valueOfComputation.kind === 'rank-only') {
      const rankDifference = (right.usefulnessRank ?? 0) - (left.usefulnessRank ?? 0);
      if (rankDifference !== 0) return rankDifference;
    }
    return branchId(left).localeCompare(branchId(right));
  });
}

function requirePositiveCompleteVector(vector: BudgetVector): void {
  if (
    vector.tokens.count <= 0
    || vector.cost.minorUnits <= 0
    || vector.iterations.attempts <= 0
    || vector.wallTime.durationMs <= 0
  ) {
    throw new RangeError('Continuation reservation must cover every typed budget dimension');
  }
}

export async function captureFanInBudgetSnapshot(
  authority: HierarchicalBudgetAuthority,
  scopeId: string,
): Promise<FanInBudgetSnapshot> {
  const projection = await authority.readProjection();
  const scopePath = budgetScopePath(projection.state, scopeId);
  return Object.freeze({
    projectionDigest: projection.digest,
    reducerVersion: projection.reducerVersion,
    ledgerId: projection.ledgerHead.ledgerId,
    ledgerSequence: projection.ledgerHead.sequence,
    ledgerRecordHash: projection.ledgerHead.recordHash,
    scopeId,
    scopePath: Object.freeze([...scopePath]),
    balances: snapshotBudgetBalances(projection.state, scopePath),
  });
}

export interface ReserveContinuationBudgetInput {
  readonly authority: HierarchicalBudgetAuthority;
  readonly scopeId: string;
  readonly cut: FanInEventCut;
  readonly policy: ConditionalFanInPolicy;
  readonly policyDigest: string;
  readonly outstandingBranches: readonly OutstandingBranchAtCut[];
  readonly nextResultEstimate: BudgetVector;
  readonly settlementMargin: BudgetVector;
  readonly leaseDurationMs: number;
  readonly evidence: Omit<
    BudgetEvidenceInput,
    'requestId' | 'operationId' | 'evidenceDigest' | 'causationId'
  > & { readonly causationId?: string | null };
}

export async function reserveContinuationBudget(
  input: ReserveContinuationBudgetInput,
): Promise<ContinuationBudgetEvidence> {
  const before = await captureFanInBudgetSnapshot(input.authority, input.scopeId);
  const selected = rankEligibleBranches(input.outstandingBranches, input.policy)[0];
  if (!selected) {
    return Object.freeze({
      outcome: 'not-applicable',
      reasonCode: 'no-eligible-outstanding-branch',
      requested: null,
      reservationId: null,
      dispatchId: null,
      selectedBranchId: null,
      decision: null,
      before,
      after: before,
    });
  }

  const requested = addBudgetVectors(input.nextResultEstimate, input.settlementMargin);
  requirePositiveCompleteVector(input.nextResultEstimate);
  requirePositiveCompleteVector(input.settlementMargin);
  requirePositiveCompleteVector(requested);
  const selectedBranchId = branchId(selected);
  const identityDigest = sha256Bytes(canonicalBytes({
    run_id: selected.branch.registration.manifest_fingerprint,
    logical_branch_id: selectedBranchId,
    cut_ledger_id: input.cut.ledgerId,
    cut_sequence: input.cut.sequence,
    cut_record_hash: input.cut.recordHash,
    policy_digest: input.policyDigest,
    scope_id: input.scopeId,
    requested,
  }));
  const reservationId = `fanin-reservation:${identityDigest}`;
  const dispatchId = selected.dispatchId ?? `fanin-continuation:${selectedBranchId}`;
  const mutation = await input.authority.admit({
    ...input.evidence,
    requestId: `fanin-reserve:${identityDigest}`,
    operationId: `fanin-reserve:${identityDigest}`,
    evidenceDigest: identityDigest,
    causationId: input.evidence.causationId ?? null,
    scopeId: input.scopeId,
    reservationId,
    dispatchId,
    estimate: requested,
    leaseDurationMs: input.leaseDurationMs,
  });
  const after = await captureFanInBudgetSnapshot(input.authority, input.scopeId);
  const outcome = mutation.decision.status === 'granted'
    && mutation.decision.dispatchAllowed
    && mutation.decision.reasonCode === BudgetReasonCodes.ALLOWED
    ? 'reserved'
    : mutation.decision.reasonCode === BudgetReasonCodes.BUDGET_EXHAUSTED
      || mutation.decision.reasonCode === BudgetReasonCodes.DEADLINE_EXHAUSTED
      ? 'budget-constrained'
      : 'anomaly';

  return Object.freeze({
    outcome,
    reasonCode: mutation.decision.reasonCode,
    requested,
    reservationId,
    dispatchId,
    selectedBranchId,
    decision: mutation.decision,
    before,
    after,
  });
}

// ───────────────────────────────────────────────────────────────────
// MODULE: Partial Failure Verdict Evaluator
// ───────────────────────────────────────────────────────────────────

import {
  canonicalBytes,
  sha256Bytes,
} from '../event-envelope/index.js';
import { isLeafResultPayload } from '../result-envelopes/index.js';
import {
  buildDeadlineFailureEnvelope,
  buildIntegrityFailureEnvelope,
  isTerminalFailureEnvelope,
} from './failure.js';
import {
  defaultPartialFailurePolicy,
  partialFailurePolicyDigest,
  requiredSuccessCount,
  toleratedFailureCeiling,
  validateAdmittedSet,
  validatePartialFailurePolicy,
} from './policy.js';

import type { LeafResultPayload } from '../result-envelopes/index.js';
import type {
  AbortMarker,
  DegradedResultMarker,
  EvaluatePartialFailureInput,
  EvaluationFinality,
  FrozenAdmittedSet,
  LateResultRecord,
  PartialFailureEvaluation,
  PartialFailurePolicy,
  PartialFailureReductionRequest,
  PartialFailureVerdict,
  PolicyApplicability,
  PolicyEvaluationReceipt,
  RetryDiagnostic,
  TerminalFailureEnvelope,
} from './types.js';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

export const POLICY_EVALUATION_EVENT_NAME = 'orchestration.partial_failure_evaluated';
export const DEGRADED_RESULT_EVENT_NAME = 'orchestration.degraded_result_recorded';
export const ABORT_EVENT_NAME = 'orchestration.partial_failure_aborted';
export const LATE_RESULT_EVENT_NAME = 'orchestration.late_result_excluded';
export const MAX_RETRY_DIAGNOSTICS = 10_000;

const SAFE_DIAGNOSTIC_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;

interface EvidenceProjection {
  readonly failures: TerminalFailureEnvelope[];
  readonly integrityFailures: TerminalFailureEnvelope[];
  readonly retryEventIds: string[];
  readonly successes: LeafResultPayload[];
}

interface EvaluationDecision {
  readonly applicability: PolicyApplicability;
  readonly finality: EvaluationFinality;
  readonly reasonCodes: string[];
  readonly verdict: PartialFailureVerdict | null;
}

// ───────────────────────────────────────────────────────────────────
// 2. EVIDENCE PROJECTION
// ───────────────────────────────────────────────────────────────────

function compareText(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function uniqueSorted(values: readonly string[]): string[] {
  return [...new Set(values)].sort(compareText);
}

function integrityFailure(
  admittedSet: FrozenAdmittedSet,
  evaluatedAt: string,
  diagnosticCode: string,
  diagnosticSummary?: string,
): TerminalFailureEnvelope {
  return buildIntegrityFailureEnvelope({
    completedAt: evaluatedAt,
    decisionEpochId: admittedSet.decisionEpochId,
    diagnosticCode,
    diagnosticSummary,
    runId: admittedSet.runId,
  });
}

function validateRetryDiagnostics(
  admittedSet: FrozenAdmittedSet,
  diagnostics: readonly RetryDiagnostic[],
  evaluatedAt: string,
): { eventIds: string[]; integrityFailures: TerminalFailureEnvelope[] } {
  if (diagnostics.length > MAX_RETRY_DIAGNOSTICS) {
    return {
      eventIds: [],
      integrityFailures: [integrityFailure(
        admittedSet,
        evaluatedAt,
        'retry_diagnostics_limit_exceeded',
      )],
    };
  }
  const admittedIds = new Set(admittedSet.branches.map((branch) => branch.logicalBranchId));
  const eventDigests = new Map<string, string>();
  const integrityFailures: TerminalFailureEnvelope[] = [];
  for (const diagnostic of diagnostics) {
    const digest = sha256Bytes(canonicalBytes(diagnostic));
    const prior = eventDigests.get(diagnostic.attemptEventId);
    if (
      !SAFE_DIAGNOSTIC_PATTERN.test(diagnostic.attemptEventId)
      || !SAFE_DIAGNOSTIC_PATTERN.test(diagnostic.diagnosticCode)
      || !Number.isSafeInteger(diagnostic.attemptNumber)
      || diagnostic.attemptNumber <= 0
      || !admittedIds.has(diagnostic.logicalBranchId)
    ) {
      integrityFailures.push(integrityFailure(
        admittedSet,
        evaluatedAt,
        'invalid_retry_diagnostic',
      ));
      continue;
    }
    if (prior !== undefined && prior !== digest) {
      integrityFailures.push(integrityFailure(
        admittedSet,
        evaluatedAt,
        'retry_event_identity_collision',
      ));
      continue;
    }
    eventDigests.set(diagnostic.attemptEventId, digest);
  }
  return {
    eventIds: [...eventDigests.keys()].sort(compareText),
    integrityFailures,
  };
}

function projectEvidence(input: EvaluatePartialFailureInput): EvidenceProjection {
  const admittedSet = input.admittedSet;
  const evaluatedAt = input.decisionEpoch.evaluatedAt;
  const branches = new Map(admittedSet.branches.map((branch) => [branch.logicalBranchId, branch]));
  const successesById = new Map<string, LeafResultPayload>();
  const successByBranch = new Map<string, LeafResultPayload>();
  const failuresById = new Map<string, TerminalFailureEnvelope>();
  const failureByBranch = new Map<string, TerminalFailureEnvelope>();
  const integrityFailures: TerminalFailureEnvelope[] = [];

  for (const result of input.successfulResults) {
    if (!isLeafResultPayload(result)) {
      integrityFailures.push(integrityFailure(
        admittedSet,
        evaluatedAt,
        'incompatible_canonical_result_envelope',
      ));
      continue;
    }
    const branch = branches.get(result.logical_branch_id);
    if (
      result.result_status !== 'succeeded'
      || result.run_id !== admittedSet.runId
      || branch === undefined
      || !branch.dispatchReceiptIds.includes(result.dispatch_receipt_id)
    ) {
      integrityFailures.push(integrityFailure(
        admittedSet,
        evaluatedAt,
        'successful_result_binding_mismatch',
      ));
      continue;
    }
    const priorById = successesById.get(result.result_envelope_id);
    if (priorById !== undefined) {
      if (priorById.result_digest !== result.result_digest) {
        integrityFailures.push(integrityFailure(
          admittedSet,
          evaluatedAt,
          'result_event_identity_collision',
        ));
      }
      continue;
    }
    const priorByBranch = successByBranch.get(result.logical_branch_id);
    if (priorByBranch !== undefined) {
      integrityFailures.push(integrityFailure(
        admittedSet,
        evaluatedAt,
        'branch_terminal_identity_collision',
      ));
      continue;
    }
    successesById.set(result.result_envelope_id, result);
    successByBranch.set(result.logical_branch_id, result);
  }

  for (const failure of input.terminalFailures) {
    if (!isTerminalFailureEnvelope(failure)) {
      integrityFailures.push(integrityFailure(
        admittedSet,
        evaluatedAt,
        'incompatible_terminal_failure_envelope',
      ));
      continue;
    }
    const priorById = failuresById.get(failure.failure_id);
    if (priorById !== undefined) {
      if (
        sha256Bytes(canonicalBytes(priorById))
        !== sha256Bytes(canonicalBytes(failure))
      ) {
        integrityFailures.push(integrityFailure(
          admittedSet,
          evaluatedAt,
          'failure_event_identity_collision',
        ));
      }
      continue;
    }
    failuresById.set(failure.failure_id, failure);
    if (failure.failure_class === 'orchestration_integrity') {
      integrityFailures.push(failure);
      continue;
    }
    const branchId = failure.logical_branch_id;
    if (branchId === null) {
      integrityFailures.push(integrityFailure(
        admittedSet,
        evaluatedAt,
        'terminal_failure_binding_mismatch',
      ));
      continue;
    }
    const branch = branches.get(branchId);
    if (
      failure.run_id !== admittedSet.runId
      || failure.decision_epoch_id !== admittedSet.decisionEpochId
      || branch === undefined
      || failure.dispatch_receipt_id === null
      || !branch.dispatchReceiptIds.includes(failure.dispatch_receipt_id)
    ) {
      integrityFailures.push(integrityFailure(
        admittedSet,
        evaluatedAt,
        'terminal_failure_binding_mismatch',
      ));
      continue;
    }
    if (failureByBranch.has(branchId)) {
      integrityFailures.push(integrityFailure(
        admittedSet,
        evaluatedAt,
        'branch_terminal_identity_collision',
      ));
      continue;
    }
    failureByBranch.set(branchId, failure);
  }

  for (const branchId of successByBranch.keys()) {
    if (failureByBranch.has(branchId)) {
      integrityFailures.push(integrityFailure(
        admittedSet,
        evaluatedAt,
        'branch_success_failure_collision',
      ));
      successByBranch.delete(branchId);
    }
  }

  const retryProjection = validateRetryDiagnostics(
    admittedSet,
    input.retryDiagnostics ?? [],
    evaluatedAt,
  );
  integrityFailures.push(...retryProjection.integrityFailures);
  return {
    failures: [...failureByBranch.values()].sort(
      (left, right) => compareText(left.failure_id, right.failure_id),
    ),
    integrityFailures: [...new Map(integrityFailures.map(
      (failure) => [failure.failure_id, failure],
    )).values()].sort((left, right) => compareText(left.failure_id, right.failure_id)),
    retryEventIds: retryProjection.eventIds,
    successes: [...successByBranch.values()].sort(
      (left, right) => compareText(left.result_envelope_id, right.result_envelope_id),
    ),
  };
}

// ───────────────────────────────────────────────────────────────────
// 3. VERDICT STATE MACHINE
// ───────────────────────────────────────────────────────────────────

function decision(
  input: EvaluatePartialFailureInput,
  admitted: number,
  succeeded: number,
  failed: number,
  pending: number,
  requiredSuccesses: number,
  failureCeiling: number,
  hasIntegrityFailure: boolean,
): EvaluationDecision {
  const reasons: string[] = [];
  if (hasIntegrityFailure) reasons.push('orchestration_integrity');
  if (admitted === 0) {
    if (input.decisionEpoch.emptyTickDeclared && !hasIntegrityFailure) {
      return {
        applicability: 'not_applicable',
        finality: 'final',
        reasonCodes: ['empty_tick_declared'],
        verdict: null,
      };
    }
    return {
      applicability: 'applicable',
      finality: 'final',
      reasonCodes: uniqueSorted([...reasons, 'unexplained_empty_denominator']),
      verdict: 'abort',
    };
  }
  if (input.decisionEpoch.emptyTickDeclared) {
    return {
      applicability: 'applicable',
      finality: 'final',
      reasonCodes: uniqueSorted([...reasons, 'empty_tick_with_admitted_receipts']),
      verdict: 'abort',
    };
  }
  if (hasIntegrityFailure) {
    return {
      applicability: 'applicable',
      finality: 'final',
      reasonCodes: uniqueSorted(reasons),
      verdict: 'abort',
    };
  }
  if (input.decisionEpoch.boundaryState === 'open') {
    if (
      input.policy?.mode === 'progressive'
      && succeeded >= requiredSuccesses
      && failed <= failureCeiling
      && (failed > 0 || pending > 0)
    ) {
      return {
        applicability: 'applicable',
        finality: 'provisional',
        reasonCodes: ['progressive_quorum_snapshot'],
        verdict: 'proceed_degraded',
      };
    }
    return {
      applicability: 'applicable',
      finality: 'provisional',
      reasonCodes: ['decision_boundary_open'],
      verdict: 'await',
    };
  }
  if (pending > 0) {
    return {
      applicability: 'applicable',
      finality: 'final',
      reasonCodes: ['terminal_boundary_missing_evidence'],
      verdict: 'abort',
    };
  }
  if (succeeded === admitted && failed === 0) {
    return {
      applicability: 'applicable',
      finality: 'final',
      reasonCodes: ['all_admitted_succeeded'],
      verdict: 'proceed',
    };
  }
  if (succeeded >= requiredSuccesses && failed <= failureCeiling) {
    return {
      applicability: 'applicable',
      finality: 'final',
      reasonCodes: ['quorum_satisfied_with_failures'],
      verdict: 'proceed_degraded',
    };
  }
  if (succeeded < requiredSuccesses) reasons.push('success_quorum_not_met');
  if (failed > failureCeiling) reasons.push('failure_ceiling_exceeded');
  return {
    applicability: 'applicable',
    finality: 'final',
    reasonCodes: uniqueSorted(reasons),
    verdict: 'abort',
  };
}

// ───────────────────────────────────────────────────────────────────
// 4. RECEIPTS AND MARKERS
// ───────────────────────────────────────────────────────────────────

function buildReceipt(input: {
  readonly admittedSet: FrozenAdmittedSet;
  readonly applicability: PolicyApplicability;
  readonly boundaryState: PolicyEvaluationReceipt['boundary_state'];
  readonly evaluatedAt: string;
  readonly failedBranchIds: readonly string[];
  readonly failureIds: readonly string[];
  readonly finality: EvaluationFinality;
  readonly pending: number;
  readonly policy: PartialFailurePolicy;
  readonly reasonCodes: readonly string[];
  readonly requiredSuccesses: number;
  readonly retryEventIds: readonly string[];
  readonly successIds: readonly string[];
  readonly succeeded: number;
  readonly failureCeiling: number;
  readonly verdict: PartialFailureVerdict | null;
}): PolicyEvaluationReceipt {
  const policyDigest = partialFailurePolicyDigest(input.policy);
  const admittedReceiptIds = input.admittedSet.branches.flatMap(
    (branch) => branch.dispatchReceiptIds,
  );
  const orderedInputIds = [
    input.admittedSet.decisionBoundary.recordHash,
    ...admittedReceiptIds,
    ...input.admittedSet.notAwaited.map((leaf) => leaf.evidenceId),
    ...input.successIds,
    ...input.failureIds,
    ...input.retryEventIds,
  ];
  const replayFingerprint = sha256Bytes(canonicalBytes({
    admitted_set_digest: input.admittedSet.admittedSetDigest,
    boundary_state: input.boundaryState,
    ordered_input_ids: orderedInputIds,
    policy_digest: policyDigest,
    upstream_replay_fingerprint: input.admittedSet.replayFingerprint,
  }));
  const receiptFacts = {
    admitted: input.admittedSet.branches.length,
    admitted_set_digest: input.admittedSet.admittedSetDigest,
    applicability: input.applicability,
    boundary_state: input.boundaryState,
    decision_epoch_id: input.admittedSet.decisionEpochId,
    evaluated_at: input.evaluatedAt,
    event_name: POLICY_EVALUATION_EVENT_NAME,
    failed: input.failedBranchIds.length,
    failed_logical_branch_ids: [...input.failedBranchIds],
    finality: input.finality,
    not_awaited: input.admittedSet.notAwaited.length,
    ordered_input_ids: orderedInputIds,
    pending: input.pending,
    policy_digest: policyDigest,
    policy_id: input.policy.policyId,
    policy_mode: input.policy.mode,
    policy_version: input.policy.policyVersion,
    reason_codes: [...input.reasonCodes],
    replay_fingerprint: replayFingerprint,
    required_success_count: input.requiredSuccesses,
    retry_event_ids: [...input.retryEventIds],
    run_id: input.admittedSet.runId,
    success_fraction: {
      denominator: input.admittedSet.branches.length,
      numerator: input.succeeded,
    },
    succeeded: input.succeeded,
    successful_result_envelope_ids: [...input.successIds],
    terminal_failure_ids: [...input.failureIds],
    tolerated_failure_ceiling: input.failureCeiling,
    verdict: input.verdict,
  };
  const evaluationDigest = sha256Bytes(canonicalBytes(receiptFacts));
  return Object.freeze({
    ...receiptFacts,
    evaluation_digest: evaluationDigest,
    receipt_id: `policy-evaluation:${evaluationDigest}`,
  }) as PolicyEvaluationReceipt;
}

function buildDegradedMarker(receipt: PolicyEvaluationReceipt): DegradedResultMarker {
  const markerFacts = {
    admitted: receipt.admitted,
    degraded: true,
    failed: receipt.failed,
    failed_logical_branch_ids: receipt.failed_logical_branch_ids,
    finality: 'final',
    marker_type: 'degraded',
    not_awaited: receipt.not_awaited,
    policy_evaluation_receipt_id: receipt.receipt_id,
    policy_id: receipt.policy_id,
    policy_version: receipt.policy_version,
    reason_codes: receipt.reason_codes,
    success_fraction: receipt.success_fraction,
    succeeded: receipt.succeeded,
    tolerated_failure_ceiling: receipt.tolerated_failure_ceiling,
  };
  return Object.freeze({
    ...markerFacts,
    marker_id: `degraded-result:${sha256Bytes(canonicalBytes(markerFacts))}`,
  }) as DegradedResultMarker;
}

function buildAbortMarker(receipt: PolicyEvaluationReceipt): AbortMarker {
  const markerFacts = {
    decision_epoch_id: receipt.decision_epoch_id,
    failed_logical_branch_ids: receipt.failed_logical_branch_ids,
    marker_type: 'abort',
    policy_evaluation_receipt_id: receipt.receipt_id,
    reason_codes: receipt.reason_codes,
    run_id: receipt.run_id,
  };
  return Object.freeze({
    ...markerFacts,
    abort_id: `partial-failure-abort:${sha256Bytes(canonicalBytes(markerFacts))}`,
  }) as AbortMarker;
}

function reductionRequest(
  receipt: PolicyEvaluationReceipt,
  successes: readonly LeafResultPayload[],
  marker: DegradedResultMarker | null,
): PartialFailureReductionRequest | null {
  if (
    receipt.finality !== 'final'
    || (receipt.verdict !== 'proceed' && receipt.verdict !== 'proceed_degraded')
  ) {
    return null;
  }
  const expected = receipt.successful_result_envelope_ids;
  if (
    successes.length !== expected.length
    || successes.some((result, index) => result.result_envelope_id !== expected[index])
    || successes.some((result) => !isLeafResultPayload(result) || result.result_status !== 'succeeded')
  ) {
    return null;
  }
  return Object.freeze({
    degradedMarker: marker,
    policyEvaluationReceipt: receipt,
    successfulEnvelopes: Object.freeze([...successes]),
  });
}

function lateResultRecord(
  admittedSet: FrozenAdmittedSet,
  closed: PartialFailureEvaluation,
  result: LeafResultPayload,
  observedAt: string,
): LateResultRecord {
  const facts = {
    closed_policy_evaluation_receipt_id: closed.policyEvaluationReceipt.receipt_id,
    decision_epoch_id: admittedSet.decisionEpochId,
    event_name: LATE_RESULT_EVENT_NAME,
    excluded: true,
    logical_branch_id: result.logical_branch_id,
    observed_at: observedAt,
    reason_code: 'decision_epoch_closed',
    result_digest: result.result_digest,
    result_envelope_id: result.result_envelope_id,
    run_id: admittedSet.runId,
  };
  return Object.freeze({
    ...facts,
    late_result_id: `late-result:${sha256Bytes(canonicalBytes(facts))}`,
  }) as LateResultRecord;
}

function preserveClosedEvaluation(input: EvaluatePartialFailureInput): PartialFailureEvaluation {
  const closed = input.closedEvaluation;
  if (closed === undefined || closed === null) {
    throw new TypeError('closedEvaluation is required after a decision epoch closes');
  }
  if (
    closed.finality !== 'final'
    || closed.policyEvaluationReceipt.decision_epoch_id !== input.admittedSet.decisionEpochId
  ) {
    throw new TypeError('closedEvaluation must be a final receipt for the same decision epoch');
  }
  const knownIds = new Set(closed.policyEvaluationReceipt.successful_result_envelope_ids);
  const lateById = new Map(closed.lateResults.map((late) => [late.late_result_id, late]));
  for (const result of input.successfulResults) {
    if (
      !isLeafResultPayload(result)
      || result.run_id !== input.admittedSet.runId
      || knownIds.has(result.result_envelope_id)
    ) continue;
    const late = lateResultRecord(
      input.admittedSet,
      closed,
      result,
      input.decisionEpoch.evaluatedAt,
    );
    lateById.set(late.late_result_id, late);
  }
  return Object.freeze({
    ...closed,
    lateResults: Object.freeze([...lateById.values()].sort(
      (left, right) => compareText(left.late_result_id, right.late_result_id),
    )),
  });
}

// ───────────────────────────────────────────────────────────────────
// 5. PUBLIC EVALUATOR
// ───────────────────────────────────────────────────────────────────

/** Evaluate terminal evidence once without consulting mutable runtime gauges. */
export function evaluatePartialFailurePolicy(
  input: EvaluatePartialFailureInput,
): PartialFailureEvaluation {
  if (input.closedEvaluation !== undefined && input.closedEvaluation !== null) {
    return preserveClosedEvaluation(input);
  }
  const synthesizedFailures: TerminalFailureEnvelope[] = [];
  try {
    validateAdmittedSet(input.admittedSet);
  } catch (error: unknown) {
    synthesizedFailures.push(integrityFailure(
      input.admittedSet,
      input.decisionEpoch.evaluatedAt,
      'invalid_admitted_denominator',
      error instanceof Error ? error.message : undefined,
    ));
  }
  if (input.decisionEpoch.epochId !== input.admittedSet.decisionEpochId) {
    synthesizedFailures.push(integrityFailure(
      input.admittedSet,
      input.decisionEpoch.evaluatedAt,
      'decision_epoch_mismatch',
    ));
  }
  let policy = defaultPartialFailurePolicy();
  if (input.policy === null) {
    synthesizedFailures.push(integrityFailure(
      input.admittedSet,
      input.decisionEpoch.evaluatedAt,
      'missing_policy_input',
    ));
  } else {
    try {
      policy = validatePartialFailurePolicy(input.policy);
      const expectedReference = `${policy.policyId}@${policy.policyVersion}`;
      if (input.admittedSet.partialFailurePolicyReference !== expectedReference) {
        synthesizedFailures.push(integrityFailure(
          input.admittedSet,
          input.decisionEpoch.evaluatedAt,
          'policy_reference_mismatch',
        ));
      }
    } catch (error: unknown) {
      synthesizedFailures.push(integrityFailure(
        input.admittedSet,
        input.decisionEpoch.evaluatedAt,
        'invalid_policy_input',
        error instanceof Error ? error.message : undefined,
      ));
    }
  }

  const evidence = projectEvidence(input);
  synthesizedFailures.push(...evidence.integrityFailures);
  const terminalBranchIds = new Set([
    ...evidence.successes.map((result) => result.logical_branch_id),
    ...evidence.failures.flatMap(
      (failure) => failure.logical_branch_id === null ? [] : [failure.logical_branch_id],
    ),
  ]);
  if (input.decisionEpoch.boundaryState === 'deadline_expired') {
    for (const branch of input.admittedSet.branches) {
      if (!terminalBranchIds.has(branch.logicalBranchId)) {
        const deadlineFailure = buildDeadlineFailureEnvelope(
          input.admittedSet,
          branch.logicalBranchId,
          input.decisionEpoch.evaluatedAt,
        );
        synthesizedFailures.push(deadlineFailure);
        evidence.failures.push(deadlineFailure);
        terminalBranchIds.add(branch.logicalBranchId);
      }
    }
  } else if (
    input.decisionEpoch.boundaryState === 'terminal'
    && terminalBranchIds.size < input.admittedSet.branches.length
  ) {
    synthesizedFailures.push(integrityFailure(
      input.admittedSet,
      input.decisionEpoch.evaluatedAt,
      'terminal_boundary_missing_evidence',
    ));
  }
  const allFailures = [...new Map([
    ...evidence.failures,
    ...synthesizedFailures,
  ].map((failure) => [failure.failure_id, failure])).values()].sort(
    (left, right) => compareText(left.failure_id, right.failure_id),
  );
  const failedBranchIds = uniqueSorted(allFailures.flatMap(
    (failure) => failure.logical_branch_id === null ? [] : [failure.logical_branch_id],
  ));
  const admitted = input.admittedSet.branches.length;
  const succeeded = evidence.successes.length;
  const failed = failedBranchIds.length;
  const pending = Math.max(0, admitted - succeeded - failed);
  const requiredSuccesses = requiredSuccessCount(policy, admitted);
  const failureCeiling = toleratedFailureCeiling(policy, admitted);
  const hasIntegrityFailure = allFailures.some(
    (failure) => failure.failure_class === 'orchestration_integrity',
  );
  const outcome = decision(
    { ...input, policy },
    admitted,
    succeeded,
    failed,
    pending,
    requiredSuccesses,
    failureCeiling,
    hasIntegrityFailure,
  );
  const receipt = buildReceipt({
    admittedSet: input.admittedSet,
    applicability: outcome.applicability,
    boundaryState: input.decisionEpoch.boundaryState,
    evaluatedAt: input.decisionEpoch.evaluatedAt,
    failedBranchIds,
    failureCeiling,
    failureIds: allFailures.map((failure) => failure.failure_id),
    finality: outcome.finality,
    pending,
    policy,
    reasonCodes: uniqueSorted([
      ...outcome.reasonCodes,
      ...allFailures.map((failure) => failure.failure_class),
      ...allFailures
        .filter((failure) => failure.failure_class === 'orchestration_integrity')
        .map((failure) => failure.diagnostic_code),
    ]),
    requiredSuccesses,
    retryEventIds: evidence.retryEventIds,
    successIds: evidence.successes.map((result) => result.result_envelope_id),
    succeeded,
    verdict: outcome.verdict,
  });
  const degradedMarker = outcome.verdict === 'proceed_degraded' && outcome.finality === 'final'
    ? buildDegradedMarker(receipt)
    : null;
  const abortMarker = outcome.verdict === 'abort' ? buildAbortMarker(receipt) : null;
  return Object.freeze({
    abortMarker,
    applicability: outcome.applicability,
    degradedMarker,
    finality: outcome.finality,
    lateResults: Object.freeze([]),
    policyEvaluationReceipt: receipt,
    reductionRequest: reductionRequest(receipt, evidence.successes, degradedMarker),
    synthesizedFailures: Object.freeze(uniqueFailures(synthesizedFailures)),
    verdict: outcome.verdict,
  });
}

function uniqueFailures(
  failures: readonly TerminalFailureEnvelope[],
): TerminalFailureEnvelope[] {
  return [...new Map(failures.map((failure) => [failure.failure_id, failure])).values()]
    .sort((left, right) => compareText(left.failure_id, right.failure_id));
}

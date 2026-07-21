// ───────────────────────────────────────────────────────────────────
// MODULE: Partial Failure Taxonomy
// ───────────────────────────────────────────────────────────────────

import {
  canonicalBytes,
  sha256Bytes,
} from '../event-envelope/index.js';
import { isLeafResultPayload } from '../result-envelopes/index.js';

import type { LeafResultPayload } from '../result-envelopes/index.js';
import type {
  FailureStage,
  FrozenAdmittedSet,
  IntegrityFailureInput,
  LeafFailureClass,
  RetryDiagnostic,
  TerminalFailureEnvelope,
  TerminalFailureInput,
} from './types.js';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

export const TERMINAL_FAILURE_EVENT_NAME = 'orchestration.partial_failure_recorded';
export const MAX_DIAGNOSTIC_SUMMARY_LENGTH = 512;
export const MAX_ATTEMPT_EVENT_IDS = 64;
export const MAX_ARTIFACT_REFERENCES = 32;

const SAFE_CODE_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;
const SAFE_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:@/-]{0,511}$/;
const HASH_PATTERN = /^[a-f0-9]{64}$/;
const SAFE_REFERENCE_PATTERN = /^[A-Za-z][A-Za-z0-9+.-]*:\/\/[A-Za-z0-9][A-Za-z0-9._:@/-]{0,2047}$/;
const SECRET_PATTERN = /(?:(?:authorization|api[_-]?key|password|secret)\s*[:=]\s*\S+|bearer\s+\S+|(?:sk|ghp|xox[baprs])-[A-Za-z0-9_-]{8,})/gi;

export const FailureClassStage = Object.freeze({
  artifact_missing: 'artifact',
  artifact_parse: 'artifact',
  budget_rejected: 'budget',
  deadline_expired: 'executor',
  executor_exit: 'executor',
  executor_signal: 'executor',
  executor_timeout: 'executor',
  leaf_policy_violation: 'policy',
  orchestration_integrity: 'orchestration',
  salvage_exhausted: 'salvage',
} satisfies Record<LeafFailureClass, FailureStage>);

// ───────────────────────────────────────────────────────────────────
// 2. VALIDATION HELPERS
// ───────────────────────────────────────────────────────────────────

function timestamp(value: string, field: string): string {
  if (!value.endsWith('Z') || Number.isNaN(new Date(value).getTime())) {
    throw new TypeError(`${field} must be a valid UTC timestamp`);
  }
  return value;
}

function code(value: string, field: string): string {
  if (!SAFE_CODE_PATTERN.test(value)) {
    throw new TypeError(`${field} must be a bounded diagnostic code`);
  }
  return value;
}

function diagnosticSummary(value: string | null | undefined): string | null {
  if (value === null || value === undefined || value.trim() === '') return null;
  return value
    .replace(SECRET_PATTERN, '[redacted]')
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .slice(0, MAX_DIAGNOSTIC_SUMMARY_LENGTH);
}

function boundedUnique(
  values: readonly string[],
  maximum: number,
  field: string,
  pattern: RegExp,
): string[] {
  if (values.length > maximum) {
    throw new TypeError(`${field} exceeds its bounded evidence limit`);
  }
  const canonical = [...new Set(values)].sort();
  if (canonical.some((value) => !pattern.test(value))) {
    throw new TypeError(`${field} contains an invalid value`);
  }
  return canonical;
}

function failureId(facts: Record<string, unknown>): string {
  return `terminal-failure:${sha256Bytes(canonicalBytes(facts))}`;
}

function failureIdentityFacts(failure: Omit<TerminalFailureEnvelope, 'failure_id'>) {
  return {
    attempt_event_ids: failure.attempt_event_ids,
    attempt_id: failure.attempt_id,
    decision_epoch_id: failure.decision_epoch_id,
    diagnostic_code: failure.diagnostic_code,
    dispatch_id: failure.dispatch_id,
    dispatch_receipt_id: failure.dispatch_receipt_id,
    failure_class: failure.failure_class,
    logical_branch_id: failure.logical_branch_id,
    run_id: failure.run_id,
    source_result_envelope_id: failure.source_result_envelope_id,
  };
}

function branchForReceipt(admittedSet: FrozenAdmittedSet, receiptId: string) {
  return admittedSet.branches.find((branch) => branch.dispatchReceiptIds.includes(receiptId)) ?? null;
}

// ───────────────────────────────────────────────────────────────────
// 3. TERMINAL FAILURES
// ───────────────────────────────────────────────────────────────────

/** Build the single countable failure envelope for an admitted logical branch. */
export function buildTerminalFailureEnvelope(
  admittedSet: FrozenAdmittedSet,
  input: TerminalFailureInput,
): TerminalFailureEnvelope {
  const branch = branchForReceipt(admittedSet, input.dispatchReceiptId);
  if (branch === null) {
    throw new TypeError('Terminal failure does not reference an admitted dispatch receipt');
  }
  const receiptIndex = branch.dispatchReceiptIds.indexOf(input.dispatchReceiptId);
  if (branch.attemptIds[receiptIndex] !== input.attemptId) {
    throw new TypeError('Terminal failure attempt does not match its dispatch receipt');
  }
  const sourceResult = input.sourceResult ?? null;
  if (sourceResult !== null) {
    if (
      !isLeafResultPayload(sourceResult)
      || sourceResult.result_status === 'succeeded'
      || sourceResult.run_id !== admittedSet.runId
      || sourceResult.logical_branch_id !== branch.logicalBranchId
      || sourceResult.dispatch_receipt_id !== input.dispatchReceiptId
      || sourceResult.attempt_id !== input.attemptId
    ) {
      throw new TypeError('Terminal failure source result is incompatible with its admitted branch');
    }
  }
  const startedAt = timestamp(input.startedAt, 'startedAt');
  const completedAt = timestamp(input.completedAt, 'completedAt');
  if (new Date(completedAt).getTime() < new Date(startedAt).getTime()) {
    throw new TypeError('Terminal failure completion precedes its start');
  }
  const attemptEventIds = boundedUnique(
    input.attemptEventIds ?? [],
    MAX_ATTEMPT_EVENT_IDS,
    'attemptEventIds',
    SAFE_CODE_PATTERN,
  );
  const artifactReferences = boundedUnique(
    input.artifactReferences ?? [],
    MAX_ARTIFACT_REFERENCES,
    'artifactReferences',
    SAFE_REFERENCE_PATTERN,
  );
  const dispatchId = branch.dispatchIds[receiptIndex];
  const executorKind = branch.executorKinds[receiptIndex];
  if (dispatchId === undefined || executorKind === undefined) {
    throw new TypeError('Terminal failure receipt lacks immutable dispatch facts');
  }
  Object.freeze(artifactReferences);
  Object.freeze(attemptEventIds);
  const withoutId = {
    artifact_references: artifactReferences,
    attempt_event_ids: attemptEventIds,
    attempt_id: input.attemptId,
    completed_at: completedAt,
    decision_epoch_id: admittedSet.decisionEpochId,
    diagnostic_code: code(input.diagnosticCode, 'diagnosticCode'),
    diagnostic_summary: diagnosticSummary(input.diagnosticSummary),
    dispatch_id: dispatchId,
    dispatch_receipt_id: input.dispatchReceiptId,
    event_name: TERMINAL_FAILURE_EVENT_NAME,
    executor_kind: executorKind,
    failure_class: input.failureClass,
    impact: 'leaf_local',
    leaf_id: branch.leafId,
    logical_branch_id: branch.logicalBranchId,
    retryability: input.retryability,
    run_id: admittedSet.runId,
    source_result_digest: sourceResult?.result_digest ?? null,
    source_result_envelope_id: sourceResult?.result_envelope_id ?? null,
    stage: FailureClassStage[input.failureClass],
    started_at: startedAt,
    terminal: true,
  } as const;
  return Object.freeze({
    ...withoutId,
    failure_id: failureId(failureIdentityFacts(withoutId)),
  }) as TerminalFailureEnvelope;
}

/** Build a run-fatal record for corruption or unverifiable policy input. */
export function buildIntegrityFailureEnvelope(
  input: IntegrityFailureInput,
): TerminalFailureEnvelope {
  const completedAt = timestamp(input.completedAt, 'completedAt');
  const diagnosticCode = code(input.diagnosticCode, 'diagnosticCode');
  const artifactReferences: string[] = [];
  const attemptEventIds: string[] = [];
  Object.freeze(artifactReferences);
  Object.freeze(attemptEventIds);
  const withoutId = {
    artifact_references: artifactReferences,
    attempt_event_ids: attemptEventIds,
    attempt_id: null,
    completed_at: completedAt,
    decision_epoch_id: input.decisionEpochId,
    diagnostic_code: diagnosticCode,
    diagnostic_summary: diagnosticSummary(input.diagnosticSummary),
    dispatch_id: null,
    dispatch_receipt_id: null,
    event_name: TERMINAL_FAILURE_EVENT_NAME,
    executor_kind: null,
    failure_class: 'orchestration_integrity',
    impact: 'run_fatal',
    leaf_id: null,
    logical_branch_id: null,
    retryability: 'non_retryable',
    run_id: input.runId,
    source_result_digest: null,
    source_result_envelope_id: null,
    stage: 'orchestration',
    started_at: completedAt,
    terminal: true,
  } as const;
  return Object.freeze({
    ...withoutId,
    failure_id: failureId(failureIdentityFacts(withoutId)),
  }) as TerminalFailureEnvelope;
}

/** Validate the closed terminal failure schema and deterministic identity. */
export function isTerminalFailureEnvelope(value: unknown): value is TerminalFailureEnvelope {
  if (value === null || Array.isArray(value) || typeof value !== 'object') return false;
  const failure = value as TerminalFailureEnvelope;
  const expectedFields = new Set([
    'artifact_references', 'attempt_event_ids', 'attempt_id', 'completed_at',
    'decision_epoch_id', 'diagnostic_code', 'diagnostic_summary', 'dispatch_id',
    'dispatch_receipt_id', 'event_name', 'executor_kind', 'failure_class',
    'failure_id', 'impact', 'leaf_id', 'logical_branch_id', 'retryability',
    'run_id', 'source_result_digest', 'source_result_envelope_id', 'stage',
    'started_at', 'terminal',
  ]);
  if (
    Object.keys(failure).length !== expectedFields.size
    || Object.keys(failure).some((field) => !expectedFields.has(field))
    || failure.event_name !== TERMINAL_FAILURE_EVENT_NAME
    || failure.terminal !== true
    || FailureClassStage[failure.failure_class] !== failure.stage
    || !SAFE_CODE_PATTERN.test(failure.diagnostic_code)
    || (failure.diagnostic_summary !== null && typeof failure.diagnostic_summary !== 'string')
    || failure.diagnostic_summary !== diagnosticSummary(failure.diagnostic_summary)
    || !Array.isArray(failure.attempt_event_ids)
    || failure.attempt_event_ids.length > MAX_ATTEMPT_EVENT_IDS
    || failure.attempt_event_ids.some((eventId) => !SAFE_ID_PATTERN.test(eventId))
    || new Set(failure.attempt_event_ids).size !== failure.attempt_event_ids.length
    || !Array.isArray(failure.artifact_references)
    || failure.artifact_references.length > MAX_ARTIFACT_REFERENCES
    || failure.artifact_references.some((reference) => !SAFE_REFERENCE_PATTERN.test(reference))
    || new Set(failure.artifact_references).size !== failure.artifact_references.length
    || !SAFE_ID_PATTERN.test(failure.decision_epoch_id)
    || !SAFE_ID_PATTERN.test(failure.run_id)
    || !failure.failure_id.startsWith('terminal-failure:')
    || (failure.source_result_digest !== null && !HASH_PATTERN.test(failure.source_result_digest))
    || (failure.source_result_envelope_id !== null
      && !SAFE_ID_PATTERN.test(failure.source_result_envelope_id))
    || !failure.completed_at.endsWith('Z')
    || Number.isNaN(new Date(failure.completed_at).getTime())
    || !failure.started_at.endsWith('Z')
    || Number.isNaN(new Date(failure.started_at).getTime())
    || new Date(failure.completed_at).getTime() < new Date(failure.started_at).getTime()
    || !['exhausted', 'non_retryable'].includes(failure.retryability)
  ) {
    return false;
  }
  if (failure.failure_class === 'orchestration_integrity') {
    if (
      failure.impact !== 'run_fatal'
      || failure.logical_branch_id !== null
      || failure.dispatch_receipt_id !== null
      || failure.dispatch_id !== null
      || failure.attempt_id !== null
      || failure.executor_kind !== null
      || failure.leaf_id !== null
    ) return false;
  } else if (
    failure.impact !== 'leaf_local'
    || failure.logical_branch_id === null
    || failure.dispatch_receipt_id === null
    || failure.dispatch_id === null
    || failure.attempt_id === null
    || failure.executor_kind === null
    || failure.leaf_id === null
    || !SAFE_ID_PATTERN.test(failure.logical_branch_id)
    || !SAFE_ID_PATTERN.test(failure.dispatch_receipt_id)
    || !SAFE_ID_PATTERN.test(failure.dispatch_id)
    || !SAFE_ID_PATTERN.test(failure.attempt_id)
    || !SAFE_ID_PATTERN.test(failure.executor_kind)
    || !SAFE_ID_PATTERN.test(failure.leaf_id)
  ) {
    return false;
  }
  const { failure_id: ignored, ...withoutId } = failure;
  void ignored;
  return failure.failure_id === failureId(failureIdentityFacts(withoutId));
}

/** Convert one immutable non-success result envelope into its terminal typed class. */
export function classifyTerminalResultFailure(
  admittedSet: FrozenAdmittedSet,
  result: LeafResultPayload,
  retryDiagnostics: readonly RetryDiagnostic[] = [],
): TerminalFailureEnvelope {
  if (!isLeafResultPayload(result) || result.result_status === 'succeeded') {
    throw new TypeError('Only validated non-success result envelopes can be classified as failures');
  }
  const classification = result.error_classification?.toLowerCase() ?? '';
  let failureClass: TerminalFailureInput['failureClass'] = 'executor_exit';
  if (result.result_status === 'timed_out' || classification.includes('timeout')) {
    failureClass = 'executor_timeout';
  } else if (classification.includes('signal') || result.result_status === 'cancelled') {
    failureClass = 'executor_signal';
  } else if (classification.includes('artifact_missing')) {
    failureClass = 'artifact_missing';
  } else if (classification.includes('artifact_parse')) {
    failureClass = 'artifact_parse';
  } else if (classification.includes('salvage') || result.salvage_summary.disposition === 'failed') {
    failureClass = 'salvage_exhausted';
  } else if (classification.includes('policy')) {
    failureClass = 'leaf_policy_violation';
  } else if (classification.includes('budget')) {
    failureClass = 'budget_rejected';
  }
  const linkedAttempts = retryDiagnostics
    .filter((attempt) => attempt.logicalBranchId === result.logical_branch_id)
    .map((attempt) => attempt.attemptEventId);
  return buildTerminalFailureEnvelope(admittedSet, {
    artifactReferences: result.artifacts.map((artifact) => artifact.reference),
    attemptEventIds: linkedAttempts,
    attemptId: result.attempt_id,
    completedAt: result.completed_at,
    diagnosticCode: result.error_classification ?? failureClass,
    diagnosticSummary: null,
    dispatchReceiptId: result.dispatch_receipt_id,
    failureClass,
    retryability: linkedAttempts.length > 0 ? 'exhausted' : 'non_retryable',
    sourceResult: result,
    startedAt: result.started_at,
  });
}

/** Create a terminal deadline failure without inventing an executor result envelope. */
export function buildDeadlineFailureEnvelope(
  admittedSet: FrozenAdmittedSet,
  logicalBranchId: string,
  completedAt: string,
): TerminalFailureEnvelope {
  const branch = admittedSet.branches.find(
    (candidate) => candidate.logicalBranchId === logicalBranchId,
  );
  if (branch === undefined) {
    throw new TypeError('Deadline failure branch is not part of the admitted set');
  }
  const receiptIndex = branch.dispatchReceiptIds.length - 1;
  const attemptId = branch.attemptIds[receiptIndex];
  const dispatchReceiptId = branch.dispatchReceiptIds[receiptIndex];
  if (attemptId === undefined || dispatchReceiptId === undefined) {
    throw new TypeError('Deadline failure branch lacks a canonical dispatch attempt');
  }
  return buildTerminalFailureEnvelope(admittedSet, {
    attemptEventIds: [],
    attemptId,
    completedAt,
    diagnosticCode: 'deadline_expired',
    diagnosticSummary: null,
    dispatchReceiptId,
    failureClass: 'deadline_expired',
    retryability: 'exhausted',
    sourceResult: null,
    startedAt: completedAt,
  });
}

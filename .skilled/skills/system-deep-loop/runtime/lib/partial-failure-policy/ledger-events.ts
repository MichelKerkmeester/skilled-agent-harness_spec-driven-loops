// ───────────────────────────────────────────────────────────────────
// MODULE: Partial Failure Ledger Events
// ───────────────────────────────────────────────────────────────────

import {
  CURRENT_ENVELOPE_VERSION,
  prepareEventWrite,
  sha256Bytes,
  canonicalBytes,
} from '../event-envelope/index.js';
import { createResultEnvelopeEventRegistry } from '../result-envelopes/index.js';
import { isTerminalFailureEnvelope } from './failure.js';
import {
  ABORT_EVENT_NAME,
  DEGRADED_RESULT_EVENT_NAME,
  LATE_RESULT_EVENT_NAME,
  POLICY_EVALUATION_EVENT_NAME,
} from './evaluator.js';
import { POLICY_SHADOW_COMPARISON_EVENT_NAME } from './shadow.js';

import type {
  EventTypeDefinition,
  EventTypeRegistry,
  EventWritePreflight,
  JsonObject,
  JsonValue,
} from '../event-envelope/index.js';
import type {
  AuthorizedEvidenceAppendResult,
  AuthorizedEvidenceWriter,
} from '../receipts-and-effect-recovery/index.js';
import type {
  AbortMarker,
  DegradedResultMarker,
  LateResultRecord,
  PartialFailureEventContext,
  PolicyShadowComparisonReceipt,
  PolicyEvaluationReceipt,
  RecordedPartialFailureEvaluation,
  RecordPartialFailureEvaluationInput,
  TerminalFailureEnvelope,
} from './types.js';

// ───────────────────────────────────────────────────────────────────
// 1. EVENT CONTRACTS
// ───────────────────────────────────────────────────────────────────

export const TERMINAL_FAILURE_EVENT_TYPE = 'orchestration.partial-failure.terminal-recorded';
export const POLICY_EVALUATION_EVENT_TYPE = 'orchestration.partial-failure.policy-evaluated';
export const DEGRADED_RESULT_EVENT_TYPE = 'orchestration.partial-failure.degraded-recorded';
export const PARTIAL_FAILURE_ABORT_EVENT_TYPE = 'orchestration.partial-failure.abort-recorded';
export const LATE_RESULT_EXCLUDED_EVENT_TYPE = 'orchestration.partial-failure.late-excluded';
export const POLICY_SHADOW_COMPARISON_EVENT_TYPE = 'orchestration.partial-failure.shadow-compared';
export const PARTIAL_FAILURE_EVENT_VERSION = 1;

const TERMINAL_FAILURE_FIELDS = [
  'artifact_references', 'attempt_event_ids', 'attempt_id', 'completed_at',
  'decision_epoch_id', 'diagnostic_code', 'diagnostic_summary', 'dispatch_id',
  'dispatch_receipt_id', 'event_name', 'executor_kind', 'failure_class',
  'failure_id', 'impact', 'leaf_id', 'logical_branch_id', 'retryability',
  'run_id', 'source_result_digest', 'source_result_envelope_id', 'stage',
  'started_at', 'terminal',
] as const;

const POLICY_EVALUATION_FIELDS = [
  'admitted', 'admitted_set_digest', 'applicability', 'boundary_state',
  'decision_epoch_id', 'evaluated_at', 'evaluation_digest', 'event_name',
  'failed', 'failed_logical_branch_ids', 'finality', 'not_awaited',
  'ordered_input_ids', 'pending', 'policy_digest', 'policy_id', 'policy_mode',
  'policy_version', 'reason_codes', 'receipt_id', 'replay_fingerprint',
  'required_success_count', 'retry_event_ids', 'run_id', 'success_fraction',
  'succeeded', 'successful_result_envelope_ids', 'terminal_failure_ids',
  'tolerated_failure_ceiling', 'verdict',
] as const;

const DEGRADED_RESULT_FIELDS = [
  'admitted', 'degraded', 'failed', 'failed_logical_branch_ids', 'finality',
  'marker_id', 'marker_type', 'not_awaited', 'policy_evaluation_receipt_id',
  'policy_id', 'policy_version', 'reason_codes', 'success_fraction', 'succeeded',
  'tolerated_failure_ceiling',
] as const;

const ABORT_FIELDS = [
  'abort_id', 'decision_epoch_id', 'failed_logical_branch_ids', 'marker_type',
  'policy_evaluation_receipt_id', 'reason_codes', 'run_id',
] as const;

const LATE_RESULT_FIELDS = [
  'closed_policy_evaluation_receipt_id', 'decision_epoch_id', 'event_name',
  'excluded', 'late_result_id', 'logical_branch_id', 'observed_at', 'reason_code',
  'result_digest', 'result_envelope_id', 'run_id',
] as const;

const POLICY_SHADOW_COMPARISON_FIELDS = [
  'classification', 'compared_at', 'comparison_digest', 'comparison_id',
  'event_name', 'legacy_exit_code', 'legacy_status', 'policy_evaluation_receipt_id',
  'run_id', 'typed_applicability', 'typed_finality', 'typed_verdict',
] as const;

const HASH_PATTERN = /^[a-f0-9]{64}$/;
const ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:@/-]{0,511}$/;

function isRecord(value: unknown): value is Record<string, JsonValue> {
  return value !== null && !Array.isArray(value) && typeof value === 'object';
}

function exactFields(record: Record<string, JsonValue>, fields: readonly string[]): boolean {
  const fieldSet = new Set(fields);
  const keys = Object.keys(record);
  return keys.length === fieldSet.size && keys.every((field) => fieldSet.has(field));
}

function isNonNegativeInteger(value: JsonValue | undefined): value is number {
  return Number.isSafeInteger(value) && Number(value) >= 0;
}

function isIdentifier(value: JsonValue | undefined): value is string {
  return typeof value === 'string' && ID_PATTERN.test(value);
}

function isIdentifierArray(value: JsonValue | undefined): value is string[] {
  return Array.isArray(value) && value.length <= 20_000 && value.every(isIdentifier);
}

function isSortedUniqueIdentifiers(value: JsonValue | undefined): value is string[] {
  return isIdentifierArray(value)
    && value.every((entry, index) => {
      const prior = value[index - 1];
      return prior === undefined || prior < entry;
    });
}

function hasIdentity(
  record: Record<string, JsonValue>,
  idField: string,
  prefix: string,
): boolean {
  const identity = record[idField];
  if (typeof identity !== 'string' || !identity.startsWith(prefix)) return false;
  const { [idField]: ignored, ...facts } = record;
  void ignored;
  return identity === `${prefix}${sha256Bytes(canonicalBytes(facts))}`;
}

/** Validate the closed, replayable policy evaluation receipt. */
export function isPolicyEvaluationReceipt(value: unknown): value is PolicyEvaluationReceipt {
  if (!isRecord(value) || !exactFields(value, POLICY_EVALUATION_FIELDS)) return false;
  const receipt = value as unknown as PolicyEvaluationReceipt;
  const { evaluation_digest: ignoredDigest, receipt_id: ignoredId, ...facts } = receipt;
  void ignoredDigest;
  void ignoredId;
  const digest = sha256Bytes(canonicalBytes(facts));
  return receipt.event_name === POLICY_EVALUATION_EVENT_NAME
    && receipt.evaluation_digest === digest
    && receipt.receipt_id === `policy-evaluation:${digest}`
    && HASH_PATTERN.test(receipt.admitted_set_digest)
    && HASH_PATTERN.test(receipt.policy_digest)
    && HASH_PATTERN.test(receipt.replay_fingerprint)
    && isNonNegativeInteger(receipt.admitted)
    && isNonNegativeInteger(receipt.succeeded)
    && isNonNegativeInteger(receipt.failed)
    && isNonNegativeInteger(receipt.pending)
    && isNonNegativeInteger(receipt.not_awaited)
    && receipt.succeeded + receipt.failed + receipt.pending === receipt.admitted
    && isRecord(receipt.success_fraction)
    && exactFields(receipt.success_fraction, ['denominator', 'numerator'])
    && receipt.success_fraction.numerator === receipt.succeeded
    && receipt.success_fraction.denominator === receipt.admitted
    && isSortedUniqueIdentifiers(receipt.failed_logical_branch_ids)
    && receipt.failed_logical_branch_ids.length === receipt.failed
    && isIdentifierArray(receipt.ordered_input_ids)
    && isSortedUniqueIdentifiers(receipt.reason_codes)
    && isSortedUniqueIdentifiers(receipt.retry_event_ids)
    && isSortedUniqueIdentifiers(receipt.successful_result_envelope_ids)
    && receipt.successful_result_envelope_ids.length === receipt.succeeded
    && isSortedUniqueIdentifiers(receipt.terminal_failure_ids)
    && isNonNegativeInteger(receipt.required_success_count)
    && isNonNegativeInteger(receipt.tolerated_failure_ceiling)
    && Number.isSafeInteger(receipt.policy_version)
    && receipt.policy_version > 0
    && ['deadline', 'progressive', 'quorum', 'strict'].includes(receipt.policy_mode)
    && ['applicable', 'not_applicable'].includes(receipt.applicability)
    && ['deadline_expired', 'open', 'terminal'].includes(receipt.boundary_state)
    && ['final', 'provisional'].includes(receipt.finality)
    && receipt.evaluated_at.endsWith('Z')
    && !Number.isNaN(new Date(receipt.evaluated_at).getTime())
    && (receipt.verdict === null
      || ['abort', 'await', 'proceed', 'proceed_degraded'].includes(receipt.verdict))
    && (receipt.verdict !== 'await' || receipt.finality === 'provisional')
    && (receipt.verdict !== 'proceed'
      || (receipt.finality === 'final' && receipt.failed === 0 && receipt.pending === 0))
    && (receipt.verdict !== null
      || (receipt.applicability === 'not_applicable' && receipt.finality === 'final'));
}

/** Validate the canonical degraded-result marker and its deterministic identity. */
export function isDegradedResultMarker(value: unknown): value is DegradedResultMarker {
  return isRecord(value)
    && exactFields(value, DEGRADED_RESULT_FIELDS)
    && value.marker_type === 'degraded'
    && value.degraded === true
    && value.finality === 'final'
    && hasIdentity(value, 'marker_id', 'degraded-result:');
}

/** Validate the canonical abort marker and its deterministic identity. */
export function isAbortMarker(value: unknown): value is AbortMarker {
  return isRecord(value)
    && exactFields(value, ABORT_FIELDS)
    && value.marker_type === 'abort'
    && hasIdentity(value, 'abort_id', 'partial-failure-abort:');
}

/** Validate a closed-epoch late-result exclusion record. */
export function isLateResultRecord(value: unknown): value is LateResultRecord {
  return isRecord(value)
    && exactFields(value, LATE_RESULT_FIELDS)
    && value.event_name === LATE_RESULT_EVENT_NAME
    && value.excluded === true
    && value.reason_code === 'decision_epoch_closed'
    && typeof value.result_digest === 'string'
    && HASH_PATTERN.test(value.result_digest)
    && typeof value.observed_at === 'string'
    && value.observed_at.endsWith('Z')
    && !Number.isNaN(new Date(value.observed_at).getTime())
    && hasIdentity(value, 'late_result_id', 'late-result:');
}

/** Validate a deterministic dark comparison without granting it decision authority. */
export function isPolicyShadowComparisonReceipt(
  value: unknown,
): value is PolicyShadowComparisonReceipt {
  if (!isRecord(value) || !exactFields(value, POLICY_SHADOW_COMPARISON_FIELDS)) return false;
  const receipt = value as unknown as PolicyShadowComparisonReceipt;
  const { comparison_digest: ignoredDigest, comparison_id: ignoredId, ...facts } = receipt;
  void ignoredDigest;
  void ignoredId;
  const digest = sha256Bytes(canonicalBytes(facts));
  return receipt.event_name === POLICY_SHADOW_COMPARISON_EVENT_NAME
    && receipt.comparison_digest === digest
    && receipt.comparison_id === `partial-failure-shadow:${digest}`
    && ['aligned', 'known_defect_difference', 'not_applicable', 'unexpected_difference']
      .includes(receipt.classification)
    && ['ok', 'partial'].includes(receipt.legacy_status)
    && [0, 2, 3].includes(receipt.legacy_exit_code)
    && receipt.compared_at.endsWith('Z')
    && !Number.isNaN(new Date(receipt.compared_at).getTime());
}

function definition(
  eventType: string,
  fields: readonly string[],
  validate: (payload: Readonly<JsonObject>) => boolean,
): EventTypeDefinition {
  return {
    currentVersion: PARTIAL_FAILURE_EVENT_VERSION,
    eventType,
    upcasters: [],
    versions: [{
      payload: { requiredFields: fields, validate },
      version: PARTIAL_FAILURE_EVENT_VERSION,
    }],
  };
}

/** Return event definitions for terminal failures, verdicts, transitions, and late results. */
export function partialFailurePolicyEventDefinitions(): readonly EventTypeDefinition[] {
  return Object.freeze([
    definition(TERMINAL_FAILURE_EVENT_TYPE, TERMINAL_FAILURE_FIELDS, isTerminalFailureEnvelope),
    definition(POLICY_EVALUATION_EVENT_TYPE, POLICY_EVALUATION_FIELDS, isPolicyEvaluationReceipt),
    definition(DEGRADED_RESULT_EVENT_TYPE, DEGRADED_RESULT_FIELDS, isDegradedResultMarker),
    definition(PARTIAL_FAILURE_ABORT_EVENT_TYPE, ABORT_FIELDS, isAbortMarker),
    definition(LATE_RESULT_EXCLUDED_EVENT_TYPE, LATE_RESULT_FIELDS, isLateResultRecord),
    definition(
      POLICY_SHADOW_COMPARISON_EVENT_TYPE,
      POLICY_SHADOW_COMPARISON_FIELDS,
      isPolicyShadowComparisonReceipt,
    ),
  ]);
}

/** Compose partial-failure events with canonical dispatch and result envelope definitions. */
export function createPartialFailurePolicyEventRegistry(
  additionalDefinitions: readonly EventTypeDefinition[] = [],
): EventTypeRegistry {
  return createResultEnvelopeEventRegistry([
    ...additionalDefinitions,
    ...partialFailurePolicyEventDefinitions(),
  ]);
}

// ───────────────────────────────────────────────────────────────────
// 2. EVENT BUILDERS
// ───────────────────────────────────────────────────────────────────

function preparePolicyEvent(
  eventId: string,
  eventType: string,
  occurredAt: string,
  payload: JsonObject,
  context: PartialFailureEventContext,
  registry: EventTypeRegistry,
): EventWritePreflight {
  return prepareEventWrite({
    authority_epoch: context.authorityEpoch,
    causation_id: context.causationId,
    correlation_id: context.correlationId,
    envelope_version: CURRENT_ENVELOPE_VERSION,
    event_id: eventId,
    event_type: eventType,
    event_version: PARTIAL_FAILURE_EVENT_VERSION,
    idempotency_key: `partial-failure:${eventId}`,
    occurred_at: occurredAt,
    payload,
    producer: context.producer,
    recorded_at: context.recordedAt,
    stream_id: context.streamId,
    stream_sequence: context.streamSequence,
  }, registry);
}

/** Prepare one terminal failure event with deterministic identity. */
export function prepareTerminalFailureEvent(
  failure: TerminalFailureEnvelope,
  context: PartialFailureEventContext,
  registry: EventTypeRegistry,
): EventWritePreflight {
  return preparePolicyEvent(
    failure.failure_id,
    TERMINAL_FAILURE_EVENT_TYPE,
    failure.completed_at,
    failure,
    context,
    registry,
  );
}

/** Prepare the overall policy evaluation receipt event. */
export function preparePolicyEvaluationEvent(
  receipt: PolicyEvaluationReceipt,
  context: PartialFailureEventContext,
  registry: EventTypeRegistry,
): EventWritePreflight {
  return preparePolicyEvent(
    receipt.receipt_id,
    POLICY_EVALUATION_EVENT_TYPE,
    receipt.evaluated_at,
    receipt,
    context,
    registry,
  );
}

/** Prepare a non-authoritative legacy-versus-typed comparison receipt. */
export function preparePolicyShadowComparisonEvent(
  receipt: PolicyShadowComparisonReceipt,
  context: PartialFailureEventContext,
  registry: EventTypeRegistry,
): EventWritePreflight {
  return preparePolicyEvent(
    receipt.comparison_id,
    POLICY_SHADOW_COMPARISON_EVENT_TYPE,
    receipt.compared_at,
    receipt,
    context,
    registry,
  );
}

/** Append one dark comparison through the same authorized evidence boundary. */
export async function recordPolicyShadowComparison(
  receipt: PolicyShadowComparisonReceipt,
  context: PartialFailureEventContext,
  registry: EventTypeRegistry,
  writer: AuthorizedEvidenceWriter,
): Promise<AuthorizedEvidenceAppendResult> {
  return writer.append(preparePolicyShadowComparisonEvent(receipt, context, registry));
}

function nextContext(
  context: PartialFailureEventContext,
  offset: number,
): PartialFailureEventContext {
  return { ...context, streamSequence: context.streamSequence + offset };
}

// ───────────────────────────────────────────────────────────────────
// 3. AUTHORIZED APPEND
// ───────────────────────────────────────────────────────────────────

/** Append every countable failure, the evaluation, and its one final transition idempotently. */
export async function recordPartialFailureEvaluation(
  input: RecordPartialFailureEvaluationInput,
): Promise<RecordedPartialFailureEvaluation> {
  const failures = [...new Map([
    ...input.terminalFailures,
    ...input.evaluation.synthesizedFailures,
  ].map((failure) => [failure.failure_id, failure])).values()]
    .sort((left, right) => left.failure_id.localeCompare(right.failure_id));
  let offset = 0;
  const recordedFailures = [];
  for (const failure of failures) {
    recordedFailures.push(await input.writer.append(prepareTerminalFailureEvent(
      failure,
      nextContext(input.context, offset),
      input.registry,
    )));
    offset += 1;
  }
  const recordedEvaluation = await input.writer.append(preparePolicyEvaluationEvent(
    input.evaluation.policyEvaluationReceipt,
    nextContext(input.context, offset),
    input.registry,
  ));
  offset += 1;

  let transition = null;
  if (input.evaluation.degradedMarker !== null) {
    const marker = input.evaluation.degradedMarker;
    transition = await input.writer.append(preparePolicyEvent(
      marker.marker_id,
      DEGRADED_RESULT_EVENT_TYPE,
      input.evaluation.policyEvaluationReceipt.evaluated_at,
      marker,
      nextContext(input.context, offset),
      input.registry,
    ));
    offset += 1;
  } else if (input.evaluation.abortMarker !== null) {
    const marker = input.evaluation.abortMarker;
    transition = await input.writer.append(preparePolicyEvent(
      marker.abort_id,
      PARTIAL_FAILURE_ABORT_EVENT_TYPE,
      input.evaluation.policyEvaluationReceipt.evaluated_at,
      marker,
      nextContext(input.context, offset),
      input.registry,
    ));
    offset += 1;
  }

  const recordedLateResults = [];
  for (const late of input.evaluation.lateResults) {
    recordedLateResults.push(await input.writer.append(preparePolicyEvent(
      late.late_result_id,
      LATE_RESULT_EXCLUDED_EVENT_TYPE,
      late.observed_at,
      late,
      nextContext(input.context, offset),
      input.registry,
    )));
    offset += 1;
  }
  return Object.freeze({
    evaluation: recordedEvaluation,
    lateResults: Object.freeze(recordedLateResults),
    terminalFailures: Object.freeze(recordedFailures),
    transition,
  });
}

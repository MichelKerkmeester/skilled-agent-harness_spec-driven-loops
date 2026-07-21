// ────────────────────────────────────────────────────────────────────
// MODULE: Result, Salvage, and Recovery Event Contracts
// ───────────────────────────────────────────────────────────────────

import {
  CURRENT_ENVELOPE_VERSION,
  canonicalBytes,
  prepareEventWrite,
  sha256Bytes,
} from '../event-envelope/index.js';
import {
  lineageDispatchResolvedEventDefinition,
} from '../dispatch-receipts/index.js';
import {
  createEvidenceControlEventRegistry,
} from '../receipts-and-effect-recovery/index.js';
import {
  deriveRecoveryIdempotencyKey,
  deriveRecoveryLinkId,
  deriveResultEnvelopeId,
  deriveResultIdempotencyKey,
  deriveSalvageEventId,
  deriveSalvageIdempotencyKey,
} from './identity.js';

import type {
  DispatchReceiptPayload,
} from '../dispatch-receipts/index.js';
import type {
  EventTypeDefinition,
  EventTypeRegistry,
  EventWritePreflight,
  JsonObject,
  JsonValue,
} from '../event-envelope/index.js';
import type {
  DigestReference,
  LeafRecoveryPayload,
  LeafResultFacts,
  LeafResultPayload,
  ResultEventContext,
  SalvageFragmentFacts,
  SalvageFragmentPayload,
} from './types.js';

export const LEAF_RESULT_RECORDED_EVENT_NAME = 'orchestration.leaf_result_recorded';
export const LEAF_RESULT_RECORDED_EVENT_TYPE = 'orchestration.leaf.result-recorded';
export const LEAF_RESULT_RECORDED_EVENT_VERSION = 1;
export const LEAF_SALVAGE_RECORDED_EVENT_NAME = 'orchestration.leaf_salvage_recorded';
export const LEAF_SALVAGE_RECORDED_EVENT_TYPE = 'orchestration.leaf.salvage-recorded';
export const LEAF_SALVAGE_RECORDED_EVENT_VERSION = 1;
export const LEAF_RECOVERY_RECORDED_EVENT_NAME = 'orchestration.leaf_recovery_recorded';
export const LEAF_RECOVERY_RECORDED_EVENT_TYPE = 'orchestration.leaf.recovery-recorded';
export const LEAF_RECOVERY_RECORDED_EVENT_VERSION = 1;
export const RESULT_REDUCER_VERSION = 'result-resume-reducer@1';
export const RESULT_INLINE_MAX_BYTES = 16_384;

export const LEAF_RESULT_FIELDS = [
  'artifacts',
  'attempt_id',
  'authority_epoch',
  'completed_at',
  'cost',
  'dispatch_id',
  'dispatch_receipt_id',
  'duration_ms',
  'error_classification',
  'error_digest',
  'event_name',
  'evidence',
  'invocation_fingerprint',
  'leaf_id',
  'logical_branch_id',
  'parsed_result',
  'parsed_result_digest',
  'parsed_result_reference',
  'replay_fingerprint',
  'result_digest',
  'result_envelope_id',
  'result_schema_version',
  'result_status',
  'run_id',
  'salvage_summary',
  'started_at',
  'usage',
] as const;

export const LEAF_SALVAGE_FIELDS = [
  'authority_epoch',
  'byte_identical_original',
  'byte_length',
  'completeness',
  'confidence',
  'content_digest',
  'dispatch_receipt_id',
  'effective_status',
  'event_name',
  'failure_reason',
  'parser_name',
  'parser_version',
  'reconstructed',
  'recovered_scope',
  'replay_fingerprint',
  'result_envelope_id',
  'salvage_digest',
  'salvage_event_id',
  'schema_version',
  'source_digest',
  'source_kind',
  'source_reference',
  'verdict',
] as const;

export const LEAF_RECOVERY_FIELDS = [
  'attempt',
  'authority_epoch',
  'dispatch_receipt_id',
  'effect_evidence_digest',
  'event_name',
  'recovery_digest',
  'recovery_link_id',
  'replay_fingerprint',
  'retry_decision',
  'source_effect_event_digest',
  'source_effect_event_id',
  'terminal_status',
  'verdict',
] as const;

const RESULT_FIELD_SET = new Set<string>(LEAF_RESULT_FIELDS);
const SALVAGE_FIELD_SET = new Set<string>(LEAF_SALVAGE_FIELDS);
const RECOVERY_FIELD_SET = new Set<string>(LEAF_RECOVERY_FIELDS);
const HASH_PATTERN = /^[a-f0-9]{64}$/;
const INVOCATION_PATTERN = /^inv:[a-f0-9]{64}$/;
const CURRENCY_PATTERN = /^[A-Z]{3}$/;
const REFERENCE_PATTERN = /^(?:artifact|event|ledger):\/\/[A-Za-z0-9][A-Za-z0-9._:@/-]{0,2047}$/;
const SECRET_KEY_PATTERN = /(?:^|_)(?:access_token|api_key|authorization|credential|password|prompt|raw_output|refresh_token|secret|stderr|stdout)(?:$|_)/i;
const SECRET_VALUE_PATTERN = /(?:authorization\s*[:=]|bearer\s+|api[_-]?key\s*[:=]|password\s*[:=]|secret\s*[:=]|(?:sk|ghp|xox[baprs])-[A-Za-z0-9_-]{8,})/i;

function isRecord(value: unknown): value is Record<string, JsonValue> {
  return value !== null && !Array.isArray(value) && typeof value === 'object';
}

function exactFields(record: Record<string, JsonValue>, fields: ReadonlySet<string>): boolean {
  const keys = Object.keys(record);
  return keys.length === fields.size && keys.every((key) => fields.has(key));
}

function safeString(value: JsonValue | undefined, nullable = false): boolean {
  if (nullable && value === null) return true;
  return typeof value === 'string'
    && value.trim() !== ''
    && value.length <= 4_096
    && !SECRET_VALUE_PATTERN.test(value);
}

function isHash(value: JsonValue | undefined): value is string {
  return typeof value === 'string' && HASH_PATTERN.test(value);
}

function isTimestamp(value: JsonValue | undefined): value is string {
  return typeof value === 'string'
    && value.endsWith('Z')
    && !Number.isNaN(new Date(value).getTime());
}

function isNonNegativeInteger(value: JsonValue | undefined): value is number {
  return Number.isSafeInteger(value) && Number(value) >= 0;
}

function containsUnsafeMaterial(value: JsonValue, key = ''): boolean {
  if (SECRET_KEY_PATTERN.test(key)) return true;
  if (typeof value === 'string') return SECRET_VALUE_PATTERN.test(value);
  if (Array.isArray(value)) return value.some((entry) => containsUnsafeMaterial(entry));
  if (isRecord(value)) {
    return Object.entries(value).some(([childKey, child]) =>
      containsUnsafeMaterial(child, childKey));
  }
  return false;
}

function referenceSortKey(reference: DigestReference): string {
  return `${reference.kind}\u0000${reference.reference}\u0000${reference.digest}\u0000${reference.required}`;
}

export function canonicalizeReferences(
  references: readonly DigestReference[],
): DigestReference[] {
  return [...references]
    .map((reference) => ({ ...reference }))
    .sort((left, right) => {
      const a = referenceSortKey(left);
      const b = referenceSortKey(right);
      return a < b ? -1 : a > b ? 1 : 0;
    });
}

function isReference(value: JsonValue): value is DigestReference {
  if (!isRecord(value)) return false;
  const keys = Object.keys(value);
  return keys.length === 4
    && keys.every((key) => ['digest', 'kind', 'reference', 'required'].includes(key))
    && isHash(value.digest)
    && safeString(value.kind)
    && safeString(value.reference)
    && typeof value.reference === 'string'
    && REFERENCE_PATTERN.test(value.reference)
    && typeof value.required === 'boolean';
}

function isReferenceList(value: JsonValue | undefined): value is DigestReference[] {
  if (!Array.isArray(value) || !value.every(isReference)) return false;
  const keys = value.map(referenceSortKey);
  return new Set(keys).size === keys.length
    && keys.every((key, index) => index === 0 || keys[index - 1]! < key);
}

function isUsage(value: JsonValue | undefined): boolean {
  if (!isRecord(value) || !exactFields(value, new Set([
    'input_tokens', 'output_tokens', 'provenance', 'total_tokens',
  ]))) return false;
  if (value.provenance === 'unknown') {
    return value.input_tokens === null && value.output_tokens === null && value.total_tokens === null;
  }
  return (value.provenance === 'measured' || value.provenance === 'estimated')
    && isNonNegativeInteger(value.input_tokens)
    && isNonNegativeInteger(value.output_tokens)
    && isNonNegativeInteger(value.total_tokens)
    && value.total_tokens === value.input_tokens + value.output_tokens;
}

function isCost(value: JsonValue | undefined): boolean {
  if (!isRecord(value) || !exactFields(value, new Set(['amount', 'currency', 'provenance']))) {
    return false;
  }
  if (value.provenance === 'unknown') return value.amount === null && value.currency === null;
  return (value.provenance === 'measured' || value.provenance === 'estimated')
    && typeof value.amount === 'number'
    && Number.isFinite(value.amount)
    && value.amount >= 0
    && typeof value.currency === 'string'
    && CURRENCY_PATTERN.test(value.currency);
}

function isSalvageSummary(value: JsonValue | undefined): boolean {
  return isRecord(value)
    && exactFields(value, new Set(['disposition', 'fragment_count']))
    && (value.disposition === 'failed' || value.disposition === 'none' || value.disposition === 'partial')
    && isNonNegativeInteger(value.fragment_count)
    && (value.disposition !== 'none' || value.fragment_count === 0);
}

function resultDigestInput(payload: Readonly<JsonObject>): JsonObject {
  const { result_digest: ignored, ...facts } = payload;
  void ignored;
  return facts;
}

export function calculateResultDigest(payload: Readonly<JsonObject>): string {
  return sha256Bytes(canonicalBytes(resultDigestInput(payload)));
}

function salvageDigestInput(payload: Readonly<JsonObject>): JsonObject {
  const { salvage_digest: ignored, ...facts } = payload;
  void ignored;
  return facts;
}

export function calculateSalvageDigest(payload: Readonly<JsonObject>): string {
  return sha256Bytes(canonicalBytes(salvageDigestInput(payload)));
}

function recoveryDigestInput(payload: Readonly<JsonObject>): JsonObject {
  const { recovery_digest: ignored, ...facts } = payload;
  void ignored;
  return facts;
}

export function calculateRecoveryDigest(payload: Readonly<JsonObject>): string {
  return sha256Bytes(canonicalBytes(recoveryDigestInput(payload)));
}

export function isLeafResultPayload(payload: Readonly<JsonObject>): payload is LeafResultPayload {
  const value = payload as Record<string, JsonValue>;
  if (!exactFields(value, RESULT_FIELD_SET)) return false;
  if (
    value.event_name !== LEAF_RESULT_RECORDED_EVENT_NAME
    || !safeString(value.result_envelope_id)
    || !safeString(value.dispatch_receipt_id)
    || value.result_envelope_id !== deriveResultEnvelopeId(String(value.dispatch_receipt_id))
    || !safeString(value.dispatch_id)
    || !safeString(value.run_id)
    || !safeString(value.leaf_id)
    || !safeString(value.logical_branch_id)
    || !safeString(value.attempt_id)
    || typeof value.invocation_fingerprint !== 'string'
    || !INVOCATION_PATTERN.test(value.invocation_fingerprint)
    || !Number.isSafeInteger(value.result_schema_version)
    || Number(value.result_schema_version) <= 0
    || !['succeeded', 'partial', 'failed', 'cancelled', 'timed_out'].includes(String(value.result_status))
    || !isHash(value.parsed_result_digest)
    || !isHash(value.replay_fingerprint)
    || !isHash(value.result_digest)
    || !isTimestamp(value.started_at)
    || !isTimestamp(value.completed_at)
    || !isNonNegativeInteger(value.duration_ms)
    || !Number.isSafeInteger(value.authority_epoch)
    || Number(value.authority_epoch) <= 0
    || !isReferenceList(value.evidence)
    || !isReferenceList(value.artifacts)
    || !isUsage(value.usage)
    || !isCost(value.cost)
    || !isSalvageSummary(value.salvage_summary)
    || !safeString(value.error_classification, true)
    || (value.error_digest !== null && !isHash(value.error_digest))
  ) return false;
  if (new Date(String(value.completed_at)).getTime() - new Date(String(value.started_at)).getTime()
    !== value.duration_ms) return false;
  if (value.result_status === 'succeeded'
    && (value.error_classification !== null || value.error_digest !== null)) return false;
  if (containsUnsafeMaterial(value.parsed_result)) return false;
  if (canonicalBytes(value.parsed_result).length > RESULT_INLINE_MAX_BYTES) return false;
  if (value.parsed_result_reference !== null && !isReference(value.parsed_result_reference)) {
    return false;
  }
  if (value.parsed_result === null && value.parsed_result_reference === null) return false;
  if (value.parsed_result !== null && value.parsed_result_reference !== null) return false;
  if (value.parsed_result_reference !== null
    && value.parsed_result_reference.digest !== value.parsed_result_digest) return false;
  if (value.parsed_result !== null
    && value.parsed_result_digest !== sha256Bytes(canonicalBytes(value.parsed_result))) {
    return false;
  }
  return value.result_digest === calculateResultDigest(value);
}

export function asLeafResultPayload(payload: Readonly<JsonObject>): LeafResultPayload {
  if (!isLeafResultPayload(payload)) throw new TypeError('Invalid leaf result payload');
  return payload;
}

export function isSalvageFragmentPayload(
  payload: Readonly<JsonObject>,
): payload is SalvageFragmentPayload {
  const value = payload as Record<string, JsonValue>;
  if (!exactFields(value, SALVAGE_FIELD_SET)) return false;
  if (
    value.event_name !== LEAF_SALVAGE_RECORDED_EVENT_NAME
    || !safeString(value.salvage_event_id)
    || !safeString(value.dispatch_receipt_id)
    || !safeString(value.source_reference)
    || typeof value.source_reference !== 'string'
    || !REFERENCE_PATTERN.test(value.source_reference)
    || !safeString(value.parser_name)
    || !safeString(value.parser_version)
    || !isHash(value.source_digest)
    || !isHash(value.content_digest)
    || !isHash(value.replay_fingerprint)
    || !isHash(value.salvage_digest)
    || !isNonNegativeInteger(value.byte_length)
    || !Number.isSafeInteger(value.schema_version)
    || Number(value.schema_version) <= 0
    || !Number.isSafeInteger(value.authority_epoch)
    || Number(value.authority_epoch) <= 0
    || !isRecord(value.recovered_scope)
    || containsUnsafeMaterial(value.recovered_scope)
    || !['captured_stdout', 'future_typed_fragment', 'iteration_artifact', 'registry', 'state_event'].includes(String(value.source_kind))
    || !['complete', 'partial', 'unknown'].includes(String(value.completeness))
    || !['high', 'low', 'medium', 'unknown'].includes(String(value.confidence))
    || !['conflict', 'recovered', 'rejected', 'unrecoverable'].includes(String(value.verdict))
    || !['failed', 'partial'].includes(String(value.effective_status))
    || typeof value.reconstructed !== 'boolean'
    || typeof value.byte_identical_original !== 'boolean'
    || !safeString(value.failure_reason, true)
    || !safeString(value.result_envelope_id, true)
  ) return false;
  const derived = deriveSalvageEventId({
    dispatchReceiptId: String(value.dispatch_receipt_id),
    parserName: String(value.parser_name),
    parserVersion: String(value.parser_version),
    recoveredScope: value.recovered_scope,
    sourceKind: String(value.source_kind),
    sourceReference: String(value.source_reference),
  });
  if (value.salvage_event_id !== derived) return false;
  if (value.result_envelope_id !== null
    && value.result_envelope_id !== deriveResultEnvelopeId(String(value.dispatch_receipt_id))) {
    return false;
  }
  if (value.reconstructed === true
    && value.byte_identical_original !== false) return false;
  return value.salvage_digest === calculateSalvageDigest(value);
}

export function asSalvageFragmentPayload(payload: Readonly<JsonObject>): SalvageFragmentPayload {
  if (!isSalvageFragmentPayload(payload)) throw new TypeError('Invalid salvage fragment payload');
  return payload;
}

export function isLeafRecoveryPayload(payload: Readonly<JsonObject>): payload is LeafRecoveryPayload {
  const value = payload as Record<string, JsonValue>;
  if (!exactFields(value, RECOVERY_FIELD_SET)) return false;
  if (
    value.event_name !== LEAF_RECOVERY_RECORDED_EVENT_NAME
    || !safeString(value.recovery_link_id)
    || !safeString(value.dispatch_receipt_id)
    || !safeString(value.source_effect_event_id)
    || !isHash(value.source_effect_event_digest)
    || !isHash(value.effect_evidence_digest)
    || !isHash(value.replay_fingerprint)
    || !isHash(value.recovery_digest)
    || !Number.isSafeInteger(value.attempt)
    || Number(value.attempt) <= 0
    || !Number.isSafeInteger(value.authority_epoch)
    || Number(value.authority_epoch) <= 0
    || !['applied', 'conflict', 'in_doubt', 'not_applied'].includes(String(value.verdict))
    || !['execute_once', 'operator_required', 'reject', 'synthesize_confirmation'].includes(String(value.retry_decision))
    || !['confirmed', 'conflict', 'operator_required', 'retrying'].includes(String(value.terminal_status))
  ) return false;
  if (value.recovery_link_id !== deriveRecoveryLinkId(
    String(value.dispatch_receipt_id),
    String(value.source_effect_event_id),
  )) return false;
  return value.recovery_digest === calculateRecoveryDigest(value);
}

export function asLeafRecoveryPayload(payload: Readonly<JsonObject>): LeafRecoveryPayload {
  if (!isLeafRecoveryPayload(payload)) throw new TypeError('Invalid leaf recovery payload');
  return payload;
}

function definition(
  eventType: string,
  fields: readonly string[],
  validate: (payload: Readonly<JsonObject>) => boolean,
): EventTypeDefinition {
  return {
    eventType,
    currentVersion: 1,
    versions: [{ version: 1, payload: { requiredFields: fields, validate } }],
    upcasters: [],
  };
}

export function resultEnvelopeEventDefinitions(): readonly EventTypeDefinition[] {
  return Object.freeze([
    definition(LEAF_RESULT_RECORDED_EVENT_TYPE, LEAF_RESULT_FIELDS, isLeafResultPayload),
    definition(LEAF_SALVAGE_RECORDED_EVENT_TYPE, LEAF_SALVAGE_FIELDS, isSalvageFragmentPayload),
    definition(LEAF_RECOVERY_RECORDED_EVENT_TYPE, LEAF_RECOVERY_FIELDS, isLeafRecoveryPayload),
  ]);
}

export function createResultEnvelopeEventRegistry(
  additionalDefinitions: readonly EventTypeDefinition[] = [],
): EventTypeRegistry {
  return createEvidenceControlEventRegistry([
    ...additionalDefinitions,
    lineageDispatchResolvedEventDefinition(),
    ...resultEnvelopeEventDefinitions(),
  ]);
}

export function buildLeafResultPayload(
  receipt: DispatchReceiptPayload,
  facts: LeafResultFacts,
  authorityEpoch: number,
): LeafResultPayload {
  const payload: JsonObject = {
    event_name: LEAF_RESULT_RECORDED_EVENT_NAME,
    result_envelope_id: deriveResultEnvelopeId(receipt.receipt_id),
    dispatch_receipt_id: receipt.receipt_id,
    dispatch_id: receipt.dispatch_id,
    run_id: receipt.run_id,
    leaf_id: receipt.leaf_id,
    logical_branch_id: receipt.logical_branch_id,
    attempt_id: receipt.attempt_id,
    invocation_fingerprint: receipt.invocation_fingerprint,
    result_schema_version: facts.resultSchemaVersion,
    result_status: facts.status,
    parsed_result: facts.parsedResult,
    parsed_result_reference: facts.parsedResultReference === null
      ? null
      : { ...facts.parsedResultReference },
    parsed_result_digest: facts.parsedResultDigest,
    evidence: canonicalizeReferences(facts.evidence),
    artifacts: canonicalizeReferences(facts.artifacts),
    error_classification: facts.errorClassification,
    error_digest: facts.errorDigest,
    started_at: facts.startedAt,
    completed_at: facts.completedAt,
    duration_ms: facts.durationMs,
    usage: { ...facts.usage },
    cost: { ...facts.cost },
    salvage_summary: { ...facts.salvageSummary },
    replay_fingerprint: facts.replayFingerprint,
    authority_epoch: authorityEpoch,
    result_digest: '0'.repeat(64),
  };
  payload.result_digest = calculateResultDigest(payload);
  return asLeafResultPayload(payload);
}

export function prepareLeafResultEvent(
  receipt: DispatchReceiptPayload,
  facts: LeafResultFacts,
  context: ResultEventContext,
  correlationId: string,
  registry: EventTypeRegistry,
): EventWritePreflight {
  const payload = buildLeafResultPayload(receipt, facts, context.authorityEpoch);
  return prepareEventWrite({
    envelope_version: CURRENT_ENVELOPE_VERSION,
    event_id: payload.result_envelope_id,
    event_type: LEAF_RESULT_RECORDED_EVENT_TYPE,
    event_version: LEAF_RESULT_RECORDED_EVENT_VERSION,
    stream_id: context.streamId,
    stream_sequence: context.streamSequence,
    occurred_at: facts.completedAt,
    recorded_at: facts.completedAt,
    producer: context.producer,
    authority_epoch: context.authorityEpoch,
    correlation_id: correlationId,
    causation_id: receipt.receipt_id,
    idempotency_key: deriveResultIdempotencyKey(receipt.receipt_id),
    payload,
  }, registry);
}

export function buildSalvagePayload(
  dispatchReceiptId: string,
  facts: SalvageFragmentFacts,
  authorityEpoch: number,
): SalvageFragmentPayload {
  const salvageEventId = deriveSalvageEventId({
    dispatchReceiptId,
    parserName: facts.parserName,
    parserVersion: facts.parserVersion,
    recoveredScope: facts.recoveredScope,
    sourceKind: facts.sourceKind,
    sourceReference: facts.sourceReference,
  });
  const payload: JsonObject = {
    event_name: LEAF_SALVAGE_RECORDED_EVENT_NAME,
    salvage_event_id: salvageEventId,
    dispatch_receipt_id: dispatchReceiptId,
    result_envelope_id: facts.resultEnvelopeId,
    source_kind: facts.sourceKind,
    source_reference: facts.sourceReference,
    source_digest: facts.sourceDigest,
    content_digest: facts.contentDigest,
    byte_length: facts.byteLength,
    parser_name: facts.parserName,
    parser_version: facts.parserVersion,
    schema_version: facts.schemaVersion,
    recovered_scope: { ...facts.recoveredScope },
    completeness: facts.completeness,
    confidence: facts.confidence,
    verdict: facts.verdict,
    failure_reason: facts.failureReason,
    reconstructed: facts.reconstructed,
    byte_identical_original: facts.byteIdenticalOriginal,
    effective_status: facts.effectiveStatus,
    replay_fingerprint: facts.replayFingerprint,
    authority_epoch: authorityEpoch,
    salvage_digest: '0'.repeat(64),
  };
  payload.salvage_digest = calculateSalvageDigest(payload);
  return asSalvageFragmentPayload(payload);
}

export function prepareSalvageEvent(
  dispatchReceiptId: string,
  facts: SalvageFragmentFacts,
  context: ResultEventContext,
  correlationId: string,
  registry: EventTypeRegistry,
): EventWritePreflight {
  const payload = buildSalvagePayload(dispatchReceiptId, facts, context.authorityEpoch);
  return prepareEventWrite({
    envelope_version: CURRENT_ENVELOPE_VERSION,
    event_id: payload.salvage_event_id,
    event_type: LEAF_SALVAGE_RECORDED_EVENT_TYPE,
    event_version: LEAF_SALVAGE_RECORDED_EVENT_VERSION,
    stream_id: context.streamId,
    stream_sequence: context.streamSequence,
    occurred_at: facts.observedAt,
    recorded_at: facts.observedAt,
    producer: context.producer,
    authority_epoch: context.authorityEpoch,
    correlation_id: correlationId,
    causation_id: facts.resultEnvelopeId ?? dispatchReceiptId,
    idempotency_key: deriveSalvageIdempotencyKey(payload.salvage_event_id),
    payload,
  }, registry);
}

export function buildRecoveryPayload(
  dispatchReceiptId: string,
  source: Readonly<{
    attempt: number;
    evidenceDigest: string;
    eventDigest: string;
    eventId: string;
    retryDecision: LeafRecoveryPayload['retry_decision'];
    terminalStatus: LeafRecoveryPayload['terminal_status'];
    verdict: LeafRecoveryPayload['verdict'];
  }>,
  replayFingerprint: string,
  authorityEpoch: number,
): LeafRecoveryPayload {
  const recoveryLinkId = deriveRecoveryLinkId(dispatchReceiptId, source.eventId);
  const payload: JsonObject = {
    event_name: LEAF_RECOVERY_RECORDED_EVENT_NAME,
    recovery_link_id: recoveryLinkId,
    dispatch_receipt_id: dispatchReceiptId,
    source_effect_event_id: source.eventId,
    source_effect_event_digest: source.eventDigest,
    verdict: source.verdict,
    retry_decision: source.retryDecision,
    terminal_status: source.terminalStatus,
    effect_evidence_digest: source.evidenceDigest,
    attempt: source.attempt,
    replay_fingerprint: replayFingerprint,
    authority_epoch: authorityEpoch,
    recovery_digest: '0'.repeat(64),
  };
  payload.recovery_digest = calculateRecoveryDigest(payload);
  return asLeafRecoveryPayload(payload);
}

export function prepareRecoveryEvent(
  dispatchReceiptId: string,
  source: Parameters<typeof buildRecoveryPayload>[1] & { observedAt: string },
  replayFingerprint: string,
  context: ResultEventContext,
  correlationId: string,
  registry: EventTypeRegistry,
): EventWritePreflight {
  const payload = buildRecoveryPayload(
    dispatchReceiptId,
    source,
    replayFingerprint,
    context.authorityEpoch,
  );
  return prepareEventWrite({
    envelope_version: CURRENT_ENVELOPE_VERSION,
    event_id: payload.recovery_link_id,
    event_type: LEAF_RECOVERY_RECORDED_EVENT_TYPE,
    event_version: LEAF_RECOVERY_RECORDED_EVENT_VERSION,
    stream_id: context.streamId,
    stream_sequence: context.streamSequence,
    occurred_at: source.observedAt,
    recorded_at: source.observedAt,
    producer: context.producer,
    authority_epoch: context.authorityEpoch,
    correlation_id: correlationId,
    causation_id: source.eventId,
    idempotency_key: deriveRecoveryIdempotencyKey(payload.recovery_link_id),
    payload,
  }, registry);
}

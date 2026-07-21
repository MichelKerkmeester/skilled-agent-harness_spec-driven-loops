// ───────────────────────────────────────────────────────────────────
// MODULE: Lineage Dispatch Resolved Event
// ───────────────────────────────────────────────────────────────────

import {
  CURRENT_ENVELOPE_VERSION,
  EventTypeRegistry,
  prepareEventWrite,
} from '../event-envelope/index.js';
import {
  INVOCATION_FINGERPRINT_ALGORITHM,
  INVOCATION_FINGERPRINT_NAMESPACE,
  INVOCATION_FINGERPRINT_VERSION,
} from './fingerprint.js';
import {
  deriveDispatchIdempotencyKey,
  deriveDispatchReceiptId,
} from './identity.js';
import { attachDispatchReceiptIntegrity } from './integrity.js';

import type {
  EventTypeDefinition,
  EventWritePreflight,
  JsonObject,
  JsonValue,
} from '../event-envelope/index.js';
import type {
  DispatchReceiptEnvelopeInput,
  DispatchReceiptMacProvider,
  DispatchReceiptPayload,
  VerifiedLaunchFacts,
} from './types.js';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

export const LINEAGE_DISPATCH_RESOLVED_EVENT_NAME = 'lineage_dispatch_resolved';
export const LINEAGE_DISPATCH_RESOLVED_EVENT_TYPE = 'lineage.dispatch.resolved';
export const LINEAGE_DISPATCH_RESOLVED_EVENT_VERSION = 1;

export const LINEAGE_DISPATCH_RESOLVED_FIELDS = [
  'adapter_identity',
  'adapter_version',
  'attempt_id',
  'canonicalization_version',
  'capability_row_id',
  'dispatch_id',
  'effective_config_digest',
  'event_name',
  'executable_identity',
  'executable_version',
  'executor_kind',
  'fingerprint_algorithm',
  'fingerprint_namespace',
  'fingerprint_version',
  'input_digest',
  'invocation_fingerprint',
  'leaf_id',
  'logical_branch_id',
  'mac',
  'mac_key_id',
  'mac_key_provider_id',
  'mac_scheme',
  'mac_trust_scope',
  'mac_verifier_version',
  'model',
  'prompt_digest',
  'reasoning_effort',
  'receipt_id',
  'run_id',
  'search_policy',
  'service_tier',
] as const;

const FIELD_SET = new Set<string>(LINEAGE_DISPATCH_RESOLVED_FIELDS);
const HASH_PATTERN = /^[a-f0-9]{64}$/;
const INVOCATION_FINGERPRINT_PATTERN = /^inv:[a-f0-9]{64}$/;
const SECRET_SHAPE_PATTERN = /(?:api[_-]?key|authorization|bearer|credential|password|secret|token)[=:]/i;
const TOKEN_SHAPE_PATTERN = /^(?:sk|ghp|xox[baprs])-[A-Za-z0-9_-]{8,}$/;

// ───────────────────────────────────────────────────────────────────
// 2. VALIDATION
// ───────────────────────────────────────────────────────────────────

function isRecord(value: unknown): value is Record<string, JsonValue> {
  return value !== null && !Array.isArray(value) && typeof value === 'object';
}

function isSafePersistedString(value: JsonValue | undefined, nullable = false): boolean {
  if (nullable && value === null) return true;
  return typeof value === 'string'
    && value.trim() !== ''
    && value.length <= 4_096
    && !SECRET_SHAPE_PATTERN.test(value)
    && !TOKEN_SHAPE_PATTERN.test(value);
}

function isDigest(value: JsonValue | undefined): value is string {
  return typeof value === 'string' && HASH_PATTERN.test(value);
}

/** Return true only for the closed, secret-excluding version-one payload. */
export function isDispatchReceiptPayload(
  payload: Readonly<JsonObject>,
): payload is DispatchReceiptPayload {
  const record = payload as Record<string, JsonValue>;
  const fields = Object.keys(record);
  if (fields.length !== FIELD_SET.size || fields.some((field) => !FIELD_SET.has(field))) {
    return false;
  }
  const requiredStrings = [
    'adapter_identity',
    'adapter_version',
    'attempt_id',
    'canonicalization_version',
    'capability_row_id',
    'dispatch_id',
    'event_name',
    'executable_identity',
    'executable_version',
    'executor_kind',
    'fingerprint_algorithm',
    'fingerprint_namespace',
    'leaf_id',
    'logical_branch_id',
    'mac_key_id',
    'mac_key_provider_id',
    'mac_scheme',
    'mac_trust_scope',
    'mac_verifier_version',
    'receipt_id',
    'run_id',
    'search_policy',
  ];
  if (requiredStrings.some((field) => !isSafePersistedString(record[field]))) return false;
  if (
    !isSafePersistedString(record.model, true)
    || !isSafePersistedString(record.reasoning_effort, true)
    || !isSafePersistedString(record.service_tier, true)
  ) {
    return false;
  }
  if (
    record.event_name !== LINEAGE_DISPATCH_RESOLVED_EVENT_NAME
    || record.fingerprint_version !== INVOCATION_FINGERPRINT_VERSION
    || record.fingerprint_algorithm !== INVOCATION_FINGERPRINT_ALGORITHM
    || record.fingerprint_namespace !== INVOCATION_FINGERPRINT_NAMESPACE
    || typeof record.invocation_fingerprint !== 'string'
    || !INVOCATION_FINGERPRINT_PATTERN.test(record.invocation_fingerprint)
    || !isDigest(record.prompt_digest)
    || !isDigest(record.input_digest)
    || !isDigest(record.effective_config_digest)
  ) {
    return false;
  }
  if (
    record.receipt_id !== deriveDispatchReceiptId(String(record.dispatch_id))
    || (record.mac !== null && (typeof record.mac !== 'string' || !HASH_PATTERN.test(record.mac)))
  ) {
    return false;
  }
  if (record.mac_scheme === 'none') {
    return record.mac === null
      && record.mac_trust_scope === 'ledger-only'
      && record.mac_key_provider_id === 'none'
      && record.mac_key_id === 'none'
      && record.mac_verifier_version === 'none';
  }
  return record.mac_scheme === 'hmac-sha256'
    && record.mac !== null
    && (
      record.mac_trust_scope === 'process-local-advisory'
      || record.mac_trust_scope === 'durable-cross-resume'
    );
}

/** Narrow a verified envelope payload without inventing repair or fallback facts. */
export function asDispatchReceiptPayload(
  payload: Readonly<JsonObject>,
): DispatchReceiptPayload {
  if (!isDispatchReceiptPayload(payload)) {
    throw new TypeError('Dispatch receipt payload does not match the closed version-one schema');
  }
  return payload;
}

// ───────────────────────────────────────────────────────────────────
// 3. REGISTRY
// ───────────────────────────────────────────────────────────────────

/** Return the versioned definition callers add to the immutable startup registry. */
export function lineageDispatchResolvedEventDefinition(): EventTypeDefinition {
  return {
    eventType: LINEAGE_DISPATCH_RESOLVED_EVENT_TYPE,
    currentVersion: LINEAGE_DISPATCH_RESOLVED_EVENT_VERSION,
    versions: [{
      version: LINEAGE_DISPATCH_RESOLVED_EVENT_VERSION,
      payload: {
        requiredFields: LINEAGE_DISPATCH_RESOLVED_FIELDS,
        validate: isDispatchReceiptPayload,
      },
    }],
    upcasters: [],
  };
}

/** Construct a registry without mutating the stable envelope substrate. */
export function createDispatchReceiptEventRegistry(
  additionalDefinitions: readonly EventTypeDefinition[] = [],
): EventTypeRegistry {
  return new EventTypeRegistry([
    ...additionalDefinitions,
    lineageDispatchResolvedEventDefinition(),
  ]);
}

// ───────────────────────────────────────────────────────────────────
// 4. EVENT BUILDER
// ───────────────────────────────────────────────────────────────────

/** Build the canonical event only from independently verified post-resolution facts. */
export function prepareLineageDispatchResolvedEvent(
  envelope: DispatchReceiptEnvelopeInput,
  launch: VerifiedLaunchFacts,
  registry: EventTypeRegistry,
  macProvider?: DispatchReceiptMacProvider,
): EventWritePreflight {
  const receiptId = deriveDispatchReceiptId(envelope.dispatchId);
  const unsignedPayload: JsonObject = {
    event_name: LINEAGE_DISPATCH_RESOLVED_EVENT_NAME,
    receipt_id: receiptId,
    dispatch_id: envelope.dispatchId,
    run_id: envelope.runId,
    leaf_id: envelope.leafId,
    logical_branch_id: envelope.logicalBranchId,
    attempt_id: envelope.attemptId,
    executor_kind: launch.effectiveConfig.kind,
    model: launch.effectiveConfig.model,
    reasoning_effort: launch.effectiveConfig.reasoningEffort,
    service_tier: launch.effectiveConfig.serviceTier,
    search_policy: launch.effectiveConfig.webSearch,
    adapter_identity: launch.adapterIdentity,
    adapter_version: launch.adapterVersion,
    executable_identity: launch.effectiveConfig.executable,
    executable_version: launch.effectiveConfig.executableVersion,
    prompt_digest: launch.promptDigest,
    input_digest: launch.inputDigest,
    effective_config_digest: launch.effectiveConfigDigest,
    capability_row_id: envelope.capabilityRowId,
    invocation_fingerprint: launch.invocationFingerprint,
    fingerprint_version: INVOCATION_FINGERPRINT_VERSION,
    fingerprint_algorithm: INVOCATION_FINGERPRINT_ALGORITHM,
    fingerprint_namespace: INVOCATION_FINGERPRINT_NAMESPACE,
  };
  const payload = attachDispatchReceiptIntegrity(
    unsignedPayload,
    envelope.dispatchId,
    macProvider,
  );
  return prepareEventWrite({
    envelope_version: CURRENT_ENVELOPE_VERSION,
    event_id: receiptId,
    event_type: LINEAGE_DISPATCH_RESOLVED_EVENT_TYPE,
    event_version: LINEAGE_DISPATCH_RESOLVED_EVENT_VERSION,
    stream_id: envelope.streamId,
    stream_sequence: envelope.streamSequence,
    occurred_at: envelope.occurredAt,
    recorded_at: envelope.recordedAt,
    producer: envelope.producer,
    authority_epoch: envelope.authorityEpoch,
    correlation_id: envelope.correlationId,
    causation_id: envelope.causationId,
    idempotency_key: deriveDispatchIdempotencyKey(envelope.dispatchId),
    payload,
  }, registry);
}

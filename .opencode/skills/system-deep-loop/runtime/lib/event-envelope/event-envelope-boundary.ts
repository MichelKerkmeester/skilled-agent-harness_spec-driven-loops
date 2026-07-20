// ───────────────────────────────────────────────────────────────────
// MODULE: Event Envelope Boundaries
// ───────────────────────────────────────────────────────────────────

import {
  MAX_CANONICAL_BYTES,
  canonicalBytes as toCanonicalBytes,
  canonicalJson,
  immutableJsonClone,
  sha256Bytes,
} from './canonical-json.js';
import {
  EnvelopeValidationError,
  EventEnvelopeError,
  EventEnvelopeErrorCodes,
  EventReadError,
  EventUpcastError,
  EventWriteError,
} from './event-envelope-errors.js';
import { IMMUTABLE_ENVELOPE_FIELDS, validateEventEnvelope } from './event-envelope.js';
import { readBoundaryUpcasterChain } from './event-type-registry.js';

import type { CanonicalBytes, JsonObject, JsonValue } from './canonical-json.js';
import type { EventEnvelope } from './event-envelope.js';
import type {
  EventTypeRegistry,
  IntroducedFieldProvenance,
  RegisteredUpcaster,
  UpcastOutcome,
} from './event-type-registry.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

/** Validated event plus canonical bytes and digest. */
export interface CanonicalEventArtifact {
  readonly envelope: EventEnvelope;
  readonly canonicalBytes: CanonicalBytes;
  readonly canonicalDigest: string;
}

/** Exact identity tuple consumed by authorization and append boundaries. */
export interface EventAppendIdentity {
  readonly eventId: string;
  readonly eventType: string;
  readonly eventVersion: number;
  readonly streamId: string;
  readonly streamSequence: number;
  readonly authorityEpoch: number;
  readonly idempotencyKey: string;
}

/** Current-only write result ready for later gateway and ledger consumers. */
export interface EventWritePreflight extends CanonicalEventArtifact {
  readonly registryDigest: string;
  readonly identity: EventAppendIdentity;
}

/** Ordered auditable evidence for one validated adjacent upcast. */
export interface UpcastHopTrace {
  readonly identity: string;
  readonly implementationDigest: string;
  readonly fromVersion: number;
  readonly toVersion: number;
  readonly inputDigest: string;
  readonly outputDigest: string;
}

/** Immutable stored source evidence retained beside the effective event. */
export interface StoredEventEvidence {
  readonly bytes: CanonicalBytes;
  readonly byteLength: number;
  readonly digest: string;
  readonly envelope: EventEnvelope;
}

/** Read result separating untouched stored evidence from current effective form. */
export interface EventReadResult {
  readonly stored: StoredEventEvidence;
  readonly effective: CanonicalEventArtifact;
  readonly storedVersion: number;
  readonly effectiveVersion: number;
  readonly registryDigest: string;
  readonly chainIdentity: string;
  readonly hopTrace: readonly UpcastHopTrace[];
}

/** Accepted stored byte carriers; strings are encoded as UTF-8 once. */
export type StoredEventBytes = string | Uint8Array | readonly number[];

// ───────────────────────────────────────────────────────────────────
// 2. HELPERS
// ───────────────────────────────────────────────────────────────────

function canonicalArtifact(envelope: EventEnvelope): CanonicalEventArtifact {
  const canonicalBytes = toCanonicalBytes(envelope);
  return Object.freeze({
    envelope,
    canonicalBytes,
    canonicalDigest: sha256Bytes(canonicalBytes),
  });
}

function eventAppendIdentity(envelope: EventEnvelope): EventAppendIdentity {
  return Object.freeze({
    eventId: envelope.event_id,
    eventType: envelope.event_type,
    eventVersion: envelope.event_version,
    streamId: envelope.stream_id,
    streamSequence: envelope.stream_sequence,
    authorityEpoch: envelope.authority_epoch,
    idempotencyKey: envelope.idempotency_key,
  });
}

function storedByteArray(input: StoredEventBytes): CanonicalBytes {
  const bytes = typeof input === 'string' ? Buffer.from(input, 'utf8') : Uint8Array.from(input);
  if (bytes.byteLength === 0 || bytes.byteLength > MAX_CANONICAL_BYTES) {
    throw new EventReadError(
      EventEnvelopeErrorCodes.INPUT_LIMIT_EXCEEDED,
      'Stored event bytes are empty or exceed the read limit',
      { byteLength: bytes.byteLength, limit: MAX_CANONICAL_BYTES },
    );
  }
  return Object.freeze(Array.from(bytes));
}

function decodeStoredBytes(bytes: CanonicalBytes): string {
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(Uint8Array.from(bytes));
  } catch {
    throw new EventReadError(
      EventEnvelopeErrorCodes.INVALID_UNICODE,
      'Stored event is not valid UTF-8',
      { byteLength: bytes.length },
    );
  }
}

function parseStoredEnvelope(bytes: CanonicalBytes): EventEnvelope {
  let parsed: unknown;
  try {
    parsed = JSON.parse(decodeStoredBytes(bytes));
  } catch (error: unknown) {
    if (error instanceof EventEnvelopeError) throw error;
    throw new EventReadError(
      EventEnvelopeErrorCodes.ENVELOPE_PARSE_FAILED,
      'Stored event is not valid JSON',
      { byteLength: bytes.length },
    );
  }
  return validateEventEnvelope(parsed);
}

function assertImmutableIdentity(input: EventEnvelope, output: EventEnvelope): void {
  for (const field of IMMUTABLE_ENVELOPE_FIELDS) {
    if (canonicalJson(input[field] as JsonValue) !== canonicalJson(output[field] as JsonValue)) {
      throw new EventUpcastError(
        EventEnvelopeErrorCodes.UPCAST_IDENTITY_MUTATION,
        'Upcaster changed an immutable envelope field',
        { eventType: input.event_type, fromVersion: input.event_version, field },
      );
    }
  }
}

function assertIntroducedField(
  field: string,
  provenance: IntroducedFieldProvenance | undefined,
  event: EventEnvelope,
): void {
  if (
    !provenance
    || (provenance.kind !== 'default' && provenance.kind !== 'derived')
    || typeof provenance.provenance !== 'string'
    || provenance.provenance.trim() === ''
  ) {
    throw new EventUpcastError(
      EventEnvelopeErrorCodes.UPCAST_AMBIGUOUS_DEFAULT,
      'Introduced payload fields require explicit kind and provenance',
      { eventType: event.event_type, fromVersion: event.event_version, field },
    );
  }
}

function assertLosslessOutcome(input: EventEnvelope, outcome: UpcastOutcome): void {
  const sourceFields = Object.keys(input.payload).sort();
  const mapFields = Object.keys(outcome.sourceFieldMap).sort();
  if (canonicalJson(sourceFields) !== canonicalJson(mapFields)) {
    throw new EventUpcastError(
      EventEnvelopeErrorCodes.UPCAST_LOSSY_CONVERSION,
      'Upcaster must map every source payload field exactly once',
      { eventType: input.event_type, fromVersion: input.event_version },
    );
  }

  const targetFields = new Set<string>();
  for (const sourceField of sourceFields) {
    const targetField = outcome.sourceFieldMap[sourceField];
    if (
      typeof targetField !== 'string'
      || targetFields.has(targetField)
      || !Object.prototype.hasOwnProperty.call(outcome.envelope.payload, targetField)
      || canonicalJson(input.payload[sourceField]) !== canonicalJson(outcome.envelope.payload[targetField])
    ) {
      throw new EventUpcastError(
        EventEnvelopeErrorCodes.UPCAST_LOSSY_CONVERSION,
        'Upcaster did not preserve a source payload value',
        { eventType: input.event_type, fromVersion: input.event_version, field: sourceField },
      );
    }
    targetFields.add(targetField);
  }

  const introduced = outcome.introducedFields ?? {};
  for (const outputField of Object.keys(outcome.envelope.payload)) {
    if (!targetFields.has(outputField)) {
      assertIntroducedField(outputField, introduced[outputField], input);
    }
  }
  for (const field of Object.keys(introduced)) {
    if (targetFields.has(field) || !Object.prototype.hasOwnProperty.call(outcome.envelope.payload, field)) {
      throw new EventUpcastError(
        EventEnvelopeErrorCodes.UPCAST_INVALID_OUTPUT,
        'Introduced-field provenance does not match the output payload',
        { eventType: input.event_type, fromVersion: input.event_version, field },
      );
    }
  }
}

function executeUpcaster(
  event: EventEnvelope,
  upcaster: RegisteredUpcaster,
  registry: EventTypeRegistry,
): { readonly envelope: EventEnvelope; readonly trace: UpcastHopTrace } {
  let first: UpcastOutcome;
  let second: UpcastOutcome;
  try {
    first = upcaster.upcast(
      immutableJsonClone(event as unknown as JsonObject) as unknown as EventEnvelope,
    );
    second = upcaster.upcast(
      immutableJsonClone(event as unknown as JsonObject) as unknown as EventEnvelope,
    );
  } catch {
    throw new EventUpcastError(
      EventEnvelopeErrorCodes.UPCAST_EXECUTION_FAILED,
      'Upcaster threw while transforming a validated event',
      { eventType: event.event_type, fromVersion: upcaster.fromVersion },
    );
  }

  if (canonicalJson(first as unknown as JsonObject) !== canonicalJson(second as unknown as JsonObject)) {
    throw new EventUpcastError(
      EventEnvelopeErrorCodes.UPCAST_NON_DETERMINISTIC,
      'Repeated upcaster execution produced different output',
      { eventType: event.event_type, fromVersion: upcaster.fromVersion },
    );
  }

  let output: EventEnvelope;
  try {
    output = validateEventEnvelope(first.envelope);
  } catch (error: unknown) {
    throw new EventUpcastError(
      EventEnvelopeErrorCodes.UPCAST_INVALID_OUTPUT,
      'Upcaster output is not a valid event envelope',
      {
        eventType: event.event_type,
        fromVersion: upcaster.fromVersion,
        causeCode: error instanceof EventEnvelopeError ? error.code : 'UNEXPECTED_ERROR',
      },
    );
  }
  if (output.event_type !== event.event_type || output.event_version !== upcaster.toVersion) {
    throw new EventUpcastError(
      EventEnvelopeErrorCodes.UPCAST_INVALID_OUTPUT,
      'Upcaster output type or version does not match its adjacent edge',
      { eventType: event.event_type, fromVersion: upcaster.fromVersion, toVersion: upcaster.toVersion },
    );
  }
  assertImmutableIdentity(event, output);
  assertLosslessOutcome(event, { ...first, envelope: output });
  try {
    registry.validatePayload(output.event_type, output.event_version, output.payload);
  } catch (error: unknown) {
    throw new EventUpcastError(
      EventEnvelopeErrorCodes.UPCAST_INVALID_OUTPUT,
      'Upcaster output failed the target payload contract',
      {
        eventType: event.event_type,
        fromVersion: upcaster.fromVersion,
        causeCode: error instanceof EventEnvelopeError ? error.code : 'UNEXPECTED_ERROR',
      },
    );
  }

  const inputDigest = sha256Bytes(toCanonicalBytes(event));
  const outputDigest = sha256Bytes(toCanonicalBytes(output));
  return Object.freeze({
    envelope: output,
    trace: Object.freeze({
      identity: upcaster.identity,
      implementationDigest: upcaster.implementationDigest,
      fromVersion: upcaster.fromVersion,
      toVersion: upcaster.toVersion,
      inputDigest,
      outputDigest,
    }),
  });
}

// ───────────────────────────────────────────────────────────────────
// 3. WRITE BOUNDARY
// ───────────────────────────────────────────────────────────────────

/** Validate and canonicalize a current-version event without appending it. */
export function prepareEventWrite(
  input: unknown,
  registry: EventTypeRegistry,
): EventWritePreflight {
  const envelope = validateEventEnvelope(input);
  let definition;
  try {
    definition = registry.resolve(envelope.event_type);
  } catch {
    throw new EventWriteError(
      EventEnvelopeErrorCodes.REGISTRY_UNKNOWN_EVENT_TYPE,
      'Write request uses an unregistered event type',
      { eventType: envelope.event_type },
    );
  }
  if (envelope.event_version !== definition.currentVersion) {
    throw new EventWriteError(
      EventEnvelopeErrorCodes.WRITE_VERSION_NOT_CURRENT,
      'Writers may emit only the current registered event version',
      {
        eventType: envelope.event_type,
        eventVersion: envelope.event_version,
        currentVersion: definition.currentVersion,
      },
    );
  }
  registry.validatePayload(envelope.event_type, envelope.event_version, envelope.payload);
  const artifact = canonicalArtifact(envelope);
  return Object.freeze({
    ...artifact,
    registryDigest: registry.digest,
    identity: eventAppendIdentity(envelope),
  });
}

// ───────────────────────────────────────────────────────────────────
// 4. READ BOUNDARY
// ───────────────────────────────────────────────────────────────────

/** Parse stored bytes once and return only a fully validated current event. */
export function readEvent(
  input: StoredEventBytes,
  registry: EventTypeRegistry,
): EventReadResult {
  const storedBytes = storedByteArray(input);
  const storedEnvelope = parseStoredEnvelope(storedBytes);
  let definition;
  try {
    definition = registry.resolve(storedEnvelope.event_type);
  } catch {
    throw new EventReadError(
      EventEnvelopeErrorCodes.REGISTRY_UNKNOWN_EVENT_TYPE,
      'Stored event type is not registered',
      { eventType: storedEnvelope.event_type },
    );
  }
  if (storedEnvelope.event_version > definition.currentVersion) {
    throw new EventReadError(
      EventEnvelopeErrorCodes.READ_FUTURE_EVENT_VERSION,
      'Stored event version is newer than the current reader',
      {
        eventType: storedEnvelope.event_type,
        storedVersion: storedEnvelope.event_version,
        currentVersion: definition.currentVersion,
      },
    );
  }
  if (!definition.supportedVersions.includes(storedEnvelope.event_version)) {
    throw new EventReadError(
      EventEnvelopeErrorCodes.READ_UNSUPPORTED_EVENT_VERSION,
      'Stored event version is not supported by the registry',
      { eventType: storedEnvelope.event_type, storedVersion: storedEnvelope.event_version },
    );
  }
  registry.validatePayload(
    storedEnvelope.event_type,
    storedEnvelope.event_version,
    storedEnvelope.payload,
  );

  let effectiveEnvelope = storedEnvelope;
  const hopTrace: UpcastHopTrace[] = [];
  for (const upcaster of readBoundaryUpcasterChain(
    registry,
    storedEnvelope.event_type,
    storedEnvelope.event_version,
  )) {
    const result = executeUpcaster(effectiveEnvelope, upcaster, registry);
    effectiveEnvelope = result.envelope;
    hopTrace.push(result.trace);
  }

  const effective = canonicalArtifact(effectiveEnvelope);
  return Object.freeze({
    stored: Object.freeze({
      bytes: storedBytes,
      byteLength: storedBytes.length,
      digest: sha256Bytes(storedBytes),
      envelope: storedEnvelope,
    }),
    effective,
    storedVersion: storedEnvelope.event_version,
    effectiveVersion: effectiveEnvelope.event_version,
    registryDigest: registry.digest,
    chainIdentity: registry.chainIdentity(
      storedEnvelope.event_type,
      storedEnvelope.event_version,
    ),
    hopTrace: Object.freeze(hopTrace),
  });
}

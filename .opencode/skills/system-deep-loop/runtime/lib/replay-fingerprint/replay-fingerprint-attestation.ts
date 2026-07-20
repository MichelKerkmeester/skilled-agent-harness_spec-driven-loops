// ───────────────────────────────────────────────────────────────────
// MODULE: Replay Fingerprint Attestation
// ───────────────────────────────────────────────────────────────────

import {
  AppendOnlyLedger,
  AuthorizedLedgerError,
} from '../authorized-ledger/index.js';
import {
  CURRENT_ENVELOPE_VERSION,
  prepareEventWrite,
} from '../event-envelope/index.js';
import {
  parseReplayFingerprintDescriptor,
  replayFingerprintDescriptorJson,
} from './canonical-descriptor.js';
import {
  REPLAY_FINGERPRINT_ATTESTATION_EVENT_TYPE,
  ReplayFingerprintError,
  ReplayFingerprintErrorCodes,
} from './replay-fingerprint-types.js';

import type {
  DurableAppendReceipt,
  GatewayAllowProof,
  VerifiedLedgerEvent,
} from '../authorized-ledger/index.js';
import type {
  EventTypeDefinition,
  EventTypeRegistry,
  EventWritePreflight,
  JsonObject,
} from '../event-envelope/index.js';
import type { FingerprintVersionRegistry } from './fingerprint-version-registry.js';
import type {
  DerivedReplayFingerprint,
  FingerprintVersionDefinition,
  ReplayFingerprintAttestationEnvelopeInput,
  ReplayFingerprintAttestationPayload,
  ReplayFingerprintAttestationWriteResult,
  ReplayFingerprintDescriptor,
} from './replay-fingerprint-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. EVENT CONTRACT
// ───────────────────────────────────────────────────────────────────

const ATTESTATION_FIELDS = new Set([
  'fingerprint_version',
  'ledger_id',
  'run_id',
  'range_start_sequence',
  'range_end_sequence',
  'descriptor',
  'descriptor_bytes_base64',
  'final_digest',
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && !Array.isArray(value) && typeof value === 'object';
}

function isPositiveInteger(value: unknown): value is number {
  return Number.isSafeInteger(value) && (value as number) > 0;
}

function hasExactAttestationFields(value: Record<string, unknown>): boolean {
  const fields = Object.keys(value);
  return fields.length === ATTESTATION_FIELDS.size
    && fields.every((field) => ATTESTATION_FIELDS.has(field));
}

function validateReplayFingerprintAttestationPayload(
  payload: Readonly<JsonObject>,
): boolean {
  return hasExactAttestationFields(payload)
    && isPositiveInteger(payload.fingerprint_version)
    && typeof payload.ledger_id === 'string'
    && payload.ledger_id.length > 0
    && typeof payload.run_id === 'string'
    && payload.run_id.length > 0
    && isPositiveInteger(payload.range_start_sequence)
    && isPositiveInteger(payload.range_end_sequence)
    && isRecord(payload.descriptor)
    && typeof payload.descriptor_bytes_base64 === 'string'
    && payload.descriptor_bytes_base64.length > 0
    && typeof payload.final_digest === 'string';
}

/** Return the typed event definition callers add to their existing envelope registry. */
export function replayFingerprintAttestationEventDefinition(): EventTypeDefinition {
  return {
    eventType: REPLAY_FINGERPRINT_ATTESTATION_EVENT_TYPE,
    currentVersion: 1,
    versions: [{
      version: 1,
      payload: {
        requiredFields: Array.from(ATTESTATION_FIELDS),
        validate: validateReplayFingerprintAttestationPayload,
      },
    }],
    upcasters: [],
  };
}

// ───────────────────────────────────────────────────────────────────
// 2. PAYLOAD VALIDATION
// ───────────────────────────────────────────────────────────────────

function decodeCanonicalDescriptor(encoded: string): Uint8Array {
  const bytes = Buffer.from(encoded, 'base64');
  if (bytes.byteLength === 0 || bytes.toString('base64') !== encoded) {
    throw new ReplayFingerprintError(
      ReplayFingerprintErrorCodes.ATTESTATION_INVALID,
      'attestation',
      'Fingerprint attestation contains malformed descriptor bytes',
      { stage: 'descriptor-bytes' },
    );
  }
  return Uint8Array.from(bytes);
}

/** Parse a verified event payload under the selected fingerprint implementation. */
export function parseReplayFingerprintAttestationPayload(
  input: unknown,
  implementation: FingerprintVersionDefinition,
): {
  readonly payload: ReplayFingerprintAttestationPayload;
  readonly descriptor: ReplayFingerprintDescriptor;
  readonly descriptorBytes: Uint8Array;
} {
  if (!isRecord(input) || !hasExactAttestationFields(input)) {
    throw new ReplayFingerprintError(
      ReplayFingerprintErrorCodes.ATTESTATION_INVALID,
      'attestation',
      'Fingerprint attestation does not match the closed payload shape',
      { stage: 'attestation-shape' },
    );
  }
  if (input.fingerprint_version !== implementation.fingerprintVersion) {
    throw new ReplayFingerprintError(
      ReplayFingerprintErrorCodes.UNSUPPORTED_FINGERPRINT_VERSION,
      'fingerprint_version',
      'Attestation version does not match the selected fingerprint implementation',
      { stage: 'attestation-version' },
    );
  }
  const descriptor = parseReplayFingerprintDescriptor(
    input.descriptor,
    implementation,
  );
  const descriptorBytes = decodeCanonicalDescriptor(
    typeof input.descriptor_bytes_base64 === 'string'
      ? input.descriptor_bytes_base64
      : '',
  );
  const calculatedBytes = implementation.serializeDescriptor(descriptor, true);
  if (
    Buffer.compare(Buffer.from(descriptorBytes), Buffer.from(calculatedBytes)) !== 0
    || input.final_digest !== descriptor.final_digest
    || input.ledger_id !== descriptor.ledger_id
    || input.run_id !== descriptor.run_id
    || input.range_start_sequence !== descriptor.range_start_sequence
    || input.range_end_sequence !== descriptor.range_end_sequence
  ) {
    throw new ReplayFingerprintError(
      ReplayFingerprintErrorCodes.ATTESTATION_INVALID,
      'attestation',
      'Attestation metadata or bytes do not match its canonical descriptor',
      {
        expectedDigest: typeof input.final_digest === 'string' ? input.final_digest : null,
        actualDigest: descriptor.final_digest,
        stage: 'attestation-binding',
      },
    );
  }
  return Object.freeze({
    payload: Object.freeze({
      fingerprint_version: implementation.fingerprintVersion,
      ledger_id: descriptor.ledger_id,
      run_id: descriptor.run_id,
      range_start_sequence: descriptor.range_start_sequence,
      range_end_sequence: descriptor.range_end_sequence,
      descriptor: replayFingerprintDescriptorJson(descriptor),
      descriptor_bytes_base64: Buffer.from(descriptorBytes).toString('base64'),
      final_digest: descriptor.final_digest,
    }),
    descriptor,
    descriptorBytes,
  });
}

function attestationPayload<TState extends JsonObject>(
  derived: DerivedReplayFingerprint<TState>,
): ReplayFingerprintAttestationPayload {
  return Object.freeze({
    fingerprint_version: derived.descriptor.fingerprint_version,
    ledger_id: derived.descriptor.ledger_id,
    run_id: derived.descriptor.run_id,
    range_start_sequence: derived.descriptor.range_start_sequence,
    range_end_sequence: derived.descriptor.range_end_sequence,
    descriptor: replayFingerprintDescriptorJson(derived.descriptor),
    descriptor_bytes_base64: Buffer.from(derived.descriptorBytes).toString('base64'),
    final_digest: derived.descriptor.final_digest,
  });
}

function payloadKey(payload: unknown): string {
  const record = isRecord(payload) ? payload : {};
  return [
    String(record.ledger_id),
    String(record.run_id),
    String(record.range_start_sequence),
    String(record.range_end_sequence),
    String(record.fingerprint_version),
  ].join('\u0000');
}

function durableReceipt(verified: VerifiedLedgerEvent): DurableAppendReceipt {
  return Object.freeze({
    ...verified.frame.receipt,
    canonicalEventHash: verified.frame.canonical_event_hash,
    recordHash: verified.frame.record_hash,
    authorizationRef: verified.frame.authorization_ref,
  });
}

async function verifiedEvents(
  ledger: AppendOnlyLedger,
): Promise<readonly VerifiedLedgerEvent[]> {
  try {
    return await ledger.readVerifiedEvents();
  } catch (error: unknown) {
    if (error instanceof AuthorizedLedgerError) {
      throw new ReplayFingerprintError(
        ReplayFingerprintErrorCodes.LEDGER_CORRUPTION,
        'stored',
        'Ledger failed verification before attestation append',
        {
          sequence: typeof error.details.sequence === 'number'
            ? error.details.sequence
            : typeof error.details.expected === 'number'
              ? error.details.expected
              : typeof error.details.actual === 'number'
                ? error.details.actual
                : null,
          stage: error.phase,
        },
      );
    }
    throw error;
  }
}

// ───────────────────────────────────────────────────────────────────
// 3. AUTHORIZED WRITE SEAM
// ───────────────────────────────────────────────────────────────────

/** Build the current typed attestation event without bypassing envelope validation. */
export function prepareReplayFingerprintAttestation<TState extends JsonObject>(
  derived: DerivedReplayFingerprint<TState>,
  eventRegistry: EventTypeRegistry,
  versionRegistry: FingerprintVersionRegistry,
  envelope: ReplayFingerprintAttestationEnvelopeInput,
): EventWritePreflight {
  if (
    derived.descriptor.fingerprint_version !== versionRegistry.currentVersion
    || derived.descriptor.envelope_registry_digest !== eventRegistry.digest
  ) {
    throw new ReplayFingerprintError(
      ReplayFingerprintErrorCodes.CONTRACT_DRIFT,
      'fingerprint_version',
      'Attestation writers may emit only the current registered fingerprint contract',
      { stage: 'attestation-writer-version' },
    );
  }
  const payload = attestationPayload(derived);
  return prepareEventWrite({
    envelope_version: CURRENT_ENVELOPE_VERSION,
    event_id: envelope.eventId,
    event_type: REPLAY_FINGERPRINT_ATTESTATION_EVENT_TYPE,
    event_version: 1,
    stream_id: envelope.streamId,
    stream_sequence: envelope.streamSequence,
    occurred_at: envelope.occurredAt,
    recorded_at: envelope.recordedAt,
    producer: envelope.producer,
    authority_epoch: envelope.authorityEpoch,
    correlation_id: envelope.correlationId,
    causation_id: envelope.causationId,
    idempotency_key: envelope.idempotencyKey,
    payload: payload as unknown as JsonObject,
  }, eventRegistry);
}

/** Append after the covered range through the existing authorized ledger boundary. */
export async function recordReplayFingerprintAttestation<TState extends JsonObject>(
  ledger: AppendOnlyLedger,
  event: EventWritePreflight,
  proof: GatewayAllowProof,
  derived: DerivedReplayFingerprint<TState>,
  versionRegistry: FingerprintVersionRegistry,
): Promise<ReplayFingerprintAttestationWriteResult> {
  if (
    event.envelope.event_type !== REPLAY_FINGERPRINT_ATTESTATION_EVENT_TYPE
    || event.envelope.event_version !== 1
  ) {
    throw new ReplayFingerprintError(
      ReplayFingerprintErrorCodes.ATTESTATION_INVALID,
      'attestation',
      'Attestation append requires the registered typed fingerprint event',
      { stage: 'attestation-event-type' },
    );
  }
  const implementation = versionRegistry.current();
  const candidate = parseReplayFingerprintAttestationPayload(
    event.envelope.payload,
    implementation,
  );
  if (
    candidate.descriptor.final_digest !== derived.descriptor.final_digest
    || candidate.descriptor.ledger_id !== ledger.ledgerId
    || candidate.descriptor.fingerprint_version !== derived.descriptor.fingerprint_version
  ) {
    throw new ReplayFingerprintError(
      ReplayFingerprintErrorCodes.ATTESTATION_INVALID,
      'attestation',
      'Attestation event does not carry the supplied derived fingerprint',
      {
        expectedDigest: derived.descriptor.final_digest,
        actualDigest: candidate.descriptor.final_digest,
        stage: 'attestation-candidate',
      },
    );
  }

  const events = await verifiedEvents(ledger);
  const candidateKey = payloadKey(candidate.payload);
  for (const verified of events) {
    if (
      verified.event.effective.envelope.event_type
      !== REPLAY_FINGERPRINT_ATTESTATION_EVENT_TYPE
    ) {
      continue;
    }
    const payload = verified.event.effective.envelope.payload;
    if (payloadKey(payload) !== candidateKey) continue;
    const existing = parseReplayFingerprintAttestationPayload(payload, implementation);
    if (
      existing.descriptor.final_digest !== candidate.descriptor.final_digest
      || Buffer.compare(
        Buffer.from(existing.descriptorBytes),
        Buffer.from(candidate.descriptorBytes),
      ) !== 0
    ) {
      throw new ReplayFingerprintError(
        ReplayFingerprintErrorCodes.ATTESTATION_CONFLICT,
        'attestation',
        'Run, range, and fingerprint version are already bound to another digest',
        {
          expectedDigest: existing.descriptor.final_digest,
          actualDigest: candidate.descriptor.final_digest,
          sequence: verified.frame.sequence,
          stage: 'attestation-conflict',
        },
      );
    }
    return Object.freeze({
      status: 'idempotent',
      receipt: durableReceipt(verified),
      event,
    });
  }

  const nextSequence = events.length + 1;
  if (candidate.descriptor.range_end_sequence >= nextSequence) {
    throw new ReplayFingerprintError(
      ReplayFingerprintErrorCodes.ATTESTATION_SELF_INCLUDED,
      'range',
      'Attestation must be appended strictly after its closed covered range',
      {
        sequence: nextSequence,
        stage: 'attestation-after-range',
      },
    );
  }
  const receipt = await ledger.appendAuthorized(event, proof);
  if (receipt.sequence <= candidate.descriptor.range_end_sequence) {
    throw new ReplayFingerprintError(
      ReplayFingerprintErrorCodes.ATTESTATION_SELF_INCLUDED,
      'range',
      'Authorized ledger returned an attestation inside its covered range',
      {
        sequence: receipt.sequence,
        stage: 'attestation-receipt',
      },
    );
  }
  return Object.freeze({ status: 'appended', receipt, event });
}

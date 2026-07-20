// ───────────────────────────────────────────────────────────────────
// MODULE: Replay Fingerprint Verification
// ───────────────────────────────────────────────────────────────────

import {
  AuthorizedLedgerError,
} from '../authorized-ledger/index.js';
import {
  canonicalBytes,
  sha256Bytes,
} from '../event-envelope/index.js';
import { deriveReplayFingerprintAtVersion } from './derive-replay-fingerprint.js';
import { parseReplayFingerprintAttestationPayload } from './replay-fingerprint-attestation.js';
import {
  REPLAY_FINGERPRINT_ATTESTATION_EVENT_TYPE,
  ReplayFingerprintError,
  ReplayFingerprintErrorCodes,
} from './replay-fingerprint-types.js';

import type {
  AppendOnlyLedger,
  VerifiedLedgerEvent,
} from '../authorized-ledger/index.js';
import type {
  EventTypeRegistry,
  JsonObject,
  JsonValue,
} from '../event-envelope/index.js';
import type { FingerprintVersionRegistry } from './fingerprint-version-registry.js';
import type { ReplayComponentRegistry } from './replay-component-registry.js';
import type {
  FingerprintVersionDefinition,
  ReplayExecutionInput,
  ReplayFingerprintComponent,
  ReplayFingerprintConsumer,
  ReplayFingerprintDescriptor,
  ReplayFingerprintErrorCode,
  ReplayFingerprintFailure,
  ReplayFingerprintVerificationResult,
} from './replay-fingerprint-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. INPUT TYPES
// ───────────────────────────────────────────────────────────────────

/** One immutable attestation lookup plus the registered replay dependencies. */
export interface VerifyReplayFingerprintInput<TState extends JsonObject> {
  readonly ledger: AppendOnlyLedger;
  readonly eventRegistry: EventTypeRegistry;
  readonly versionRegistry: FingerprintVersionRegistry;
  readonly componentRegistry: ReplayComponentRegistry<TState>;
  readonly consumer: ReplayFingerprintConsumer;
  readonly fingerprintVersion: unknown;
  readonly runId: string;
  readonly rangeStartSequence: number;
  readonly rangeEndSequence: number;
  readonly replay: ReplayExecutionInput<TState>;
}

interface LocatedAttestation {
  readonly verified: VerifiedLedgerEvent;
  readonly descriptor: ReplayFingerprintDescriptor;
  readonly descriptorBytes: Uint8Array;
}

// ───────────────────────────────────────────────────────────────────
// 2. FAILURE HELPERS
// ───────────────────────────────────────────────────────────────────

function requestedVersion(value: unknown): number | null {
  return Number.isSafeInteger(value) && (value as number) > 0
    ? value as number
    : null;
}

function failureResult<TState extends JsonObject>(
  input: VerifyReplayFingerprintInput<TState>,
  error: ReplayFingerprintError,
): ReplayFingerprintVerificationResult<TState> {
  const failure: ReplayFingerprintFailure = Object.freeze({
    code: error.code,
    ledgerId: input.ledger.ledgerId,
    rangeStartSequence: input.rangeStartSequence,
    rangeEndSequence: input.rangeEndSequence,
    fingerprintVersion: requestedVersion(input.fingerprintVersion),
    component: error.component,
    expectedDigest: error.expectedDigest?.slice(0, 96) ?? null,
    actualDigest: error.actualDigest?.slice(0, 96) ?? null,
    earliestDivergence: Object.freeze({
      sequence: error.sequence,
      hop: error.hop,
      stage: error.stage,
    }),
    message: error.message,
  });
  return Object.freeze({
    ok: false,
    exitCode: 1,
    consumer: input.consumer,
    failure,
  });
}

function mismatch(
  code: ReplayFingerprintErrorCode,
  component: ReplayFingerprintComponent,
  message: string,
  expectedDigest: string,
  actualDigest: string,
  details: Readonly<{
    sequence?: number | null;
    hop?: number | null;
    stage?: string;
  }> = {},
): never {
  throw new ReplayFingerprintError(code, component, message, {
    expectedDigest,
    actualDigest,
    sequence: details.sequence,
    hop: details.hop,
    stage: details.stage,
  });
}

function componentDigest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value as JsonValue));
}

function valuesMatch(expected: unknown, actual: unknown): boolean {
  return componentDigest(expected) === componentDigest(actual);
}

// ───────────────────────────────────────────────────────────────────
// 3. ATTESTATION LOOKUP
// ───────────────────────────────────────────────────────────────────

async function readVerifiedEvents(
  ledger: AppendOnlyLedger,
): Promise<readonly VerifiedLedgerEvent[]> {
  try {
    return await ledger.readVerifiedEvents();
  } catch (error: unknown) {
    if (error instanceof AuthorizedLedgerError) {
      throw new ReplayFingerprintError(
        ReplayFingerprintErrorCodes.LEDGER_CORRUPTION,
        'stored',
        'Ledger corruption prevented fingerprint attestation lookup',
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
    throw new ReplayFingerprintError(
      ReplayFingerprintErrorCodes.LEDGER_CORRUPTION,
      'ledger',
      'Ledger reader failed before fingerprint attestation lookup',
      { stage: 'attestation-lookup' },
    );
  }
}

function sameAttestationIdentity(
  payload: Readonly<JsonObject>,
  ledgerId: string,
  runId: string,
): boolean {
  return payload.ledger_id === ledgerId && payload.run_id === runId;
}

function locateAttestation(
  events: readonly VerifiedLedgerEvent[],
  ledgerId: string,
  runId: string,
  startSequence: number,
  endSequence: number,
  implementation: FingerprintVersionDefinition,
): LocatedAttestation {
  const identityMatches: VerifiedLedgerEvent[] = [];
  const exactMatches: VerifiedLedgerEvent[] = [];
  for (const verified of events) {
    if (
      verified.event.effective.envelope.event_type
      !== REPLAY_FINGERPRINT_ATTESTATION_EVENT_TYPE
    ) {
      continue;
    }
    const payload = verified.event.effective.envelope.payload;
    if (!sameAttestationIdentity(payload, ledgerId, runId)) continue;
    identityMatches.push(verified);
    if (payload.fingerprint_version === undefined) {
      throw new ReplayFingerprintError(
        ReplayFingerprintErrorCodes.UNSUPPORTED_FINGERPRINT_VERSION,
        'fingerprint_version',
        'Fingerprint attestation is missing its independent version',
        { sequence: verified.frame.sequence, stage: 'attestation-version' },
      );
    }
    if (
      payload.fingerprint_version === implementation.fingerprintVersion
      && payload.range_start_sequence === startSequence
      && payload.range_end_sequence === endSequence
    ) {
      exactMatches.push(verified);
    }
  }

  if (exactMatches.length === 0) {
    const rangeDrift = identityMatches.find((verified) => (
      verified.event.effective.envelope.payload.fingerprint_version
      === implementation.fingerprintVersion
    ));
    if (rangeDrift) {
      const payload = rangeDrift.event.effective.envelope.payload;
      throw new ReplayFingerprintError(
        ReplayFingerprintErrorCodes.RANGE_DRIFT,
        'range',
        'Requested range differs from the immutable recorded attestation',
        {
          expectedDigest: componentDigest({
            start: payload.range_start_sequence as JsonValue,
            end: payload.range_end_sequence as JsonValue,
          }),
          actualDigest: componentDigest({ start: startSequence, end: endSequence }),
          sequence: rangeDrift.frame.sequence,
          stage: 'attested-range',
        },
      );
    }
    throw new ReplayFingerprintError(
      ReplayFingerprintErrorCodes.MISSING_ATTESTATION,
      'attestation',
      'No immutable fingerprint attestation exists for the requested run and range',
      { stage: 'missing-attestation' },
    );
  }

  let located: LocatedAttestation | null = null;
  for (const verified of exactMatches) {
    const parsed = parseReplayFingerprintAttestationPayload(
      verified.event.effective.envelope.payload,
      implementation,
    );
    if (verified.frame.sequence <= parsed.descriptor.range_end_sequence) {
      throw new ReplayFingerprintError(
        ReplayFingerprintErrorCodes.ATTESTATION_SELF_INCLUDED,
        'range',
        'Recorded fingerprint attestation is not strictly after its covered range',
        { sequence: verified.frame.sequence, stage: 'attestation-position' },
      );
    }
    if (
      located
      && (
        located.descriptor.final_digest !== parsed.descriptor.final_digest
        || Buffer.compare(
          Buffer.from(located.descriptorBytes),
          Buffer.from(parsed.descriptorBytes),
        ) !== 0
      )
    ) {
      throw new ReplayFingerprintError(
        ReplayFingerprintErrorCodes.ATTESTATION_CONFLICT,
        'attestation',
        'Conflicting attestations exist for one run, range, and fingerprint version',
        {
          expectedDigest: located.descriptor.final_digest,
          actualDigest: parsed.descriptor.final_digest,
          sequence: verified.frame.sequence,
          stage: 'attestation-conflict',
        },
      );
    }
    located = Object.freeze({
      verified,
      descriptor: parsed.descriptor,
      descriptorBytes: parsed.descriptorBytes,
    });
  }
  if (!located) {
    throw new ReplayFingerprintError(
      ReplayFingerprintErrorCodes.MISSING_ATTESTATION,
      'attestation',
      'Fingerprint attestation lookup produced no usable record',
      { stage: 'missing-attestation' },
    );
  }
  return located;
}

// ───────────────────────────────────────────────────────────────────
// 4. COMPONENT COMPARISON
// ───────────────────────────────────────────────────────────────────

function firstArrayDifference(
  expected: readonly string[],
  actual: readonly string[],
): number | null {
  const length = Math.max(expected.length, actual.length);
  for (let index = 0; index < length; index += 1) {
    if (expected[index] !== actual[index]) return index;
  }
  return null;
}

function chainLocation(entry: string | undefined): {
  readonly sequence: number | null;
  readonly hop: number | null;
} {
  if (!entry) return { sequence: null, hop: null };
  const sequenceMatch = /(?:^|\|)sequence=(\d+)(?:\||$)/.exec(entry);
  const hopMatch = /(?:^|\|)hop=(\d+)(?:\||$)/.exec(entry);
  return {
    sequence: sequenceMatch ? Number(sequenceMatch[1]) : null,
    hop: hopMatch ? Number(hopMatch[1]) : null,
  };
}

function compareDescriptors(
  expected: ReplayFingerprintDescriptor,
  actual: ReplayFingerprintDescriptor,
): void {
  if (
    expected.hash_algorithm !== actual.hash_algorithm
    || expected.canonicalization_algorithm !== actual.canonicalization_algorithm
  ) {
    mismatch(
      ReplayFingerprintErrorCodes.CONTRACT_DRIFT,
      'canonicalization',
      'Fingerprint hash or canonicalization algorithm drifted',
      componentDigest({
        hash: expected.hash_algorithm,
        canonicalization: expected.canonicalization_algorithm,
      }),
      componentDigest({
        hash: actual.hash_algorithm,
        canonicalization: actual.canonicalization_algorithm,
      }),
      { stage: 'canonicalization-contract' },
    );
  }
  if (
    expected.ledger_id !== actual.ledger_id
    || expected.range_start_sequence !== actual.range_start_sequence
    || expected.range_end_sequence !== actual.range_end_sequence
    || expected.event_count !== actual.event_count
  ) {
    mismatch(
      ReplayFingerprintErrorCodes.RANGE_DRIFT,
      'range',
      'Ledger identity or inclusive covered range drifted',
      componentDigest({
        ledger: expected.ledger_id,
        start: expected.range_start_sequence,
        end: expected.range_end_sequence,
        count: expected.event_count,
      }),
      componentDigest({
        ledger: actual.ledger_id,
        start: actual.range_start_sequence,
        end: actual.range_end_sequence,
        count: actual.event_count,
      }),
      { stage: 'range' },
    );
  }

  const recordDifference = firstArrayDifference(
    expected.ordered_record_hashes,
    actual.ordered_record_hashes,
  );
  if (
    expected.genesis_record_hash !== actual.genesis_record_hash
    || expected.terminal_head_hash !== actual.terminal_head_hash
    || recordDifference !== null
    || expected.stored_bytes_digest !== actual.stored_bytes_digest
    || expected.authorization_linkage_digest !== actual.authorization_linkage_digest
  ) {
    mismatch(
      ReplayFingerprintErrorCodes.STORED_MISMATCH,
      'stored',
      'Stored ledger sequence or authorization linkage differs from the attestation',
      componentDigest({
        genesis: expected.genesis_record_hash,
        head: expected.terminal_head_hash,
        records: expected.ordered_record_hashes,
        bytes: expected.stored_bytes_digest,
        authorization: expected.authorization_linkage_digest,
      }),
      componentDigest({
        genesis: actual.genesis_record_hash,
        head: actual.terminal_head_hash,
        records: actual.ordered_record_hashes,
        bytes: actual.stored_bytes_digest,
        authorization: actual.authorization_linkage_digest,
      }),
      {
        sequence: recordDifference === null
          ? null
          : expected.range_start_sequence + recordDifference,
        stage: 'stored-sequence',
      },
    );
  }

  if (expected.upcaster_registry_digest !== actual.upcaster_registry_digest) {
    mismatch(
      ReplayFingerprintErrorCodes.CONTRACT_DRIFT,
      'upcaster_registry',
      'Upcaster registry identity drifted',
      expected.upcaster_registry_digest,
      actual.upcaster_registry_digest,
      { stage: 'upcaster-registry' },
    );
  }
  if (expected.envelope_registry_digest !== actual.envelope_registry_digest) {
    mismatch(
      ReplayFingerprintErrorCodes.CONTRACT_DRIFT,
      'envelope_registry',
      'Envelope registry identity drifted',
      expected.envelope_registry_digest,
      actual.envelope_registry_digest,
      { stage: 'envelope-registry' },
    );
  }
  if (!valuesMatch(
    expected.observed_event_type_versions,
    actual.observed_event_type_versions,
  )) {
    mismatch(
      ReplayFingerprintErrorCodes.CONTRACT_DRIFT,
      'observed_event_versions',
      'Observed event type and stored-version set drifted',
      componentDigest(expected.observed_event_type_versions),
      componentDigest(actual.observed_event_type_versions),
      { stage: 'observed-event-versions' },
    );
  }

  const chainDifference = firstArrayDifference(
    expected.ordered_chain_identities,
    actual.ordered_chain_identities,
  );
  if (chainDifference !== null) {
    const location = chainLocation(
      actual.ordered_chain_identities[chainDifference]
      ?? expected.ordered_chain_identities[chainDifference],
    );
    mismatch(
      ReplayFingerprintErrorCodes.CONTRACT_DRIFT,
      'upcaster_chain',
      'Ordered upcaster chain identity drifted',
      componentDigest(expected.ordered_chain_identities),
      componentDigest(actual.ordered_chain_identities),
      {
        sequence: location.sequence,
        hop: location.hop,
        stage: 'upcaster-chain',
      },
    );
  }
  if (expected.effective_event_digest !== actual.effective_event_digest) {
    mismatch(
      ReplayFingerprintErrorCodes.EFFECTIVE_MISMATCH,
      'effective',
      'Effective post-upcast event bytes differ from the attestation',
      expected.effective_event_digest,
      actual.effective_event_digest,
      { stage: 'effective-sequence' },
    );
  }
  if (
    expected.reducer_id !== actual.reducer_id
    || expected.reducer_version !== actual.reducer_version
  ) {
    mismatch(
      ReplayFingerprintErrorCodes.CONTRACT_DRIFT,
      'reducer',
      'Reducer identity or version drifted',
      componentDigest({ id: expected.reducer_id, version: expected.reducer_version }),
      componentDigest({ id: actual.reducer_id, version: actual.reducer_version }),
      { stage: 'reducer' },
    );
  }
  if (expected.projection_schema_version !== actual.projection_schema_version) {
    mismatch(
      ReplayFingerprintErrorCodes.CONTRACT_DRIFT,
      'projection_schema',
      'Projection schema version drifted',
      componentDigest(expected.projection_schema_version),
      componentDigest(actual.projection_schema_version),
      { stage: 'projection-schema' },
    );
  }
  if (!valuesMatch(expected.replay_input_digests, actual.replay_input_digests)) {
    mismatch(
      ReplayFingerprintErrorCodes.CONTRACT_DRIFT,
      'replay_input',
      'Ledger-addressed replay input digests drifted',
      componentDigest(expected.replay_input_digests),
      componentDigest(actual.replay_input_digests),
      { stage: 'replay-inputs' },
    );
  }
  if (expected.projection_digest !== actual.projection_digest) {
    mismatch(
      ReplayFingerprintErrorCodes.PROJECTION_MISMATCH,
      'projection',
      'Canonical replay projection bytes differ from the attestation',
      expected.projection_digest,
      actual.projection_digest,
      { stage: 'projection' },
    );
  }
  if (expected.final_digest !== actual.final_digest) {
    mismatch(
      ReplayFingerprintErrorCodes.CONTRACT_DRIFT,
      'final_digest',
      'Final canonical descriptor commitment differs from the attestation',
      expected.final_digest,
      actual.final_digest,
      { stage: 'final-digest' },
    );
  }
}

// ───────────────────────────────────────────────────────────────────
// 5. SHARED CONSUMER GATE
// ───────────────────────────────────────────────────────────────────

/** Verify an immutable expected attestation without any baseline-minting path. */
export async function verifyReplayFingerprint<TState extends JsonObject>(
  input: VerifyReplayFingerprintInput<TState>,
): Promise<ReplayFingerprintVerificationResult<TState>> {
  try {
    const implementation = input.versionRegistry.resolve(input.fingerprintVersion);
    const events = await readVerifiedEvents(input.ledger);
    const attestation = locateAttestation(
      events,
      input.ledger.ledgerId,
      input.runId,
      input.rangeStartSequence,
      input.rangeEndSequence,
      implementation,
    );
    const actual = await deriveReplayFingerprintAtVersion({
      ledger: input.ledger,
      eventRegistry: input.eventRegistry,
      versionRegistry: input.versionRegistry,
      componentRegistry: input.componentRegistry,
      runId: input.runId,
      rangeStartSequence: input.rangeStartSequence,
      rangeEndSequence: input.rangeEndSequence,
      replay: input.replay,
      implementation,
    });
    compareDescriptors(attestation.descriptor, actual.descriptor);
    return Object.freeze({
      ok: true,
      exitCode: 0,
      consumer: input.consumer,
      verified: Object.freeze({
        descriptor: actual.descriptor,
        descriptorBytes: actual.descriptorBytes,
        attestationSequence: attestation.verified.frame.sequence,
        projection: actual.projection,
      }),
    });
  } catch (error: unknown) {
    if (error instanceof ReplayFingerprintError) {
      return failureResult(input, error);
    }
    return failureResult(input, new ReplayFingerprintError(
      ReplayFingerprintErrorCodes.LEDGER_CORRUPTION,
      'ledger',
      'Replay fingerprint verification failed without a trusted result',
      { stage: 'unexpected-verification-failure' },
    ));
  }
}

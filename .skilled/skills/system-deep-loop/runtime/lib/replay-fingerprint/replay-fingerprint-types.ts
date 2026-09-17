// ───────────────────────────────────────────────────────────────────
// MODULE: Replay Fingerprint Types
// ───────────────────────────────────────────────────────────────────

import type {
  DurableAppendReceipt,
  RebuiltProjection,
  TypedReducerRegistry,
} from '../authorized-ledger/index.js';
import type {
  EventProducer,
  EventWritePreflight,
  JsonObject,
  JsonValue,
} from '../event-envelope/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. DESCRIPTOR TYPES
// ───────────────────────────────────────────────────────────────────

/** Persisted replay contract with its final commitment omitted. */
export interface ReplayFingerprintDescriptorCore {
  readonly fingerprint_version: number;
  readonly hash_algorithm: 'sha256';
  readonly canonicalization_algorithm: string;
  readonly ledger_id: string;
  readonly run_id: string;
  readonly range_start_sequence: number;
  readonly range_end_sequence: number;
  readonly event_count: number;
  readonly genesis_record_hash: string;
  readonly terminal_head_hash: string;
  readonly ordered_record_hashes: readonly string[];
  readonly stored_bytes_digest: string;
  readonly authorization_linkage_digest: string;
  readonly envelope_registry_digest: string;
  readonly observed_event_type_versions: readonly string[];
  readonly upcaster_registry_digest: string;
  readonly ordered_chain_identities: readonly string[];
  readonly effective_event_digest: string;
  readonly reducer_id: string;
  readonly reducer_version: string;
  readonly projection_schema_version: string;
  readonly replay_input_digests: Record<string, string>;
  readonly projection_digest: string;
}

/** Complete persisted descriptor; final_digest commits the core fields only. */
export interface ReplayFingerprintDescriptor extends ReplayFingerprintDescriptorCore {
  readonly final_digest: string;
}

/** Recomputed descriptor bytes and the projection they attest. */
export interface DerivedReplayFingerprint<TState extends JsonObject> {
  readonly descriptor: ReplayFingerprintDescriptor;
  readonly descriptorBytes: Uint8Array;
  readonly commitmentBytes: Uint8Array;
  readonly projection: RebuiltProjection<TState>;
}

// ───────────────────────────────────────────────────────────────────
// 2. VERSION AND REPLAY COMPONENT REGISTRIES
// ───────────────────────────────────────────────────────────────────

/**
 * One immutable historical descriptor implementation.
 *
 * Registration derives an implementation identity and probes repeated bytes,
 * field coverage, final-commitment separation, and map-order neutrality. The
 * extension point remains controlled code: serializers must not consult I/O,
 * locale, timezone, process state, or mutable environment state because those
 * closure capabilities cannot be proven absent by JavaScript at runtime.
 */
export interface FingerprintVersionDefinition {
  readonly fingerprintVersion: number;
  readonly hashAlgorithm: 'sha256';
  readonly canonicalizationAlgorithm: string;
  readonly serializeDescriptor: (
    descriptor: ReplayFingerprintDescriptorCore | ReplayFingerprintDescriptor,
    includeFinalDigest: boolean,
  ) => Uint8Array;
}

/** Immutable inline content whose canonical bytes define its replay-input digest. */
export interface ContentAddressedReplayInputSource {
  readonly kind: 'content-addressed';
  readonly value: JsonValue;
}

/** Exact verified ledger payload field that supplies a replay input. */
export interface LedgerEventReplayInputSource {
  readonly kind: 'ledger-event';
  readonly sequence: number;
  readonly eventType: string;
  readonly payloadField: string;
}

/** Proven source forms from which derivation computes replay-input digests. */
export type ReplayInputSource =
  | ContentAddressedReplayInputSource
  | LedgerEventReplayInputSource;

/** Registered reducer identity and its exact replay-input contract. */
export interface ReplayComponentDefinition<TState extends JsonObject> {
  readonly reducerId: string;
  readonly reducerVersion: string;
  readonly projectionSchemaVersion: string;
  readonly requiredReplayInputKeys: readonly string[];
  readonly reducerRegistry: TypedReducerRegistry<TState>;
  readonly replayInputSources?: Readonly<Record<string, ReplayInputSource>>;
  /**
   * Construct reducers from the exact immutable values resolved by derivation.
   * Registered reducers must be pure functions of verified events and these
   * provided values. Unregistered closure state is a controlled-registration
   * and code-review trust boundary because JavaScript cannot inspect closures.
   */
  readonly bindReplayInputs?: (
    replayInputs: Readonly<Record<string, JsonValue>>,
  ) => TypedReducerRegistry<TState>;
}

/** Caller values accepted only after exact component-registry resolution. */
export interface ReplayExecutionInput<TState extends JsonObject> {
  readonly reducerId: string;
  readonly reducerVersion: string;
  readonly projectionSchemaVersion: string;
  readonly initialState: Readonly<TState>;
  readonly replayInputDigests: Readonly<Record<string, string>>;
}

// ───────────────────────────────────────────────────────────────────
// 3. ATTESTATION TYPES
// ───────────────────────────────────────────────────────────────────

export const REPLAY_FINGERPRINT_ATTESTATION_EVENT_TYPE =
  'deep-loop.replay.fingerprint-recorded';

/** Typed payload stored by deep-loop.replay.fingerprint-recorded. */
export interface ReplayFingerprintAttestationPayload {
  readonly fingerprint_version: number;
  readonly ledger_id: string;
  readonly run_id: string;
  readonly range_start_sequence: number;
  readonly range_end_sequence: number;
  readonly descriptor: JsonObject;
  readonly descriptor_bytes_base64: string;
  readonly final_digest: string;
}

/** Stable envelope metadata supplied outside fingerprint derivation. */
export interface ReplayFingerprintAttestationEnvelopeInput {
  readonly eventId: string;
  readonly streamId: string;
  readonly streamSequence: number;
  readonly occurredAt: string;
  readonly recordedAt: string;
  readonly producer: EventProducer;
  readonly authorityEpoch: number;
  readonly correlationId: string;
  readonly causationId: string | null;
  readonly idempotencyKey: string;
}

/** Result of the authorized attestation append seam. */
export interface ReplayFingerprintAttestationWriteResult {
  readonly status: 'appended' | 'idempotent';
  readonly receipt: DurableAppendReceipt;
  readonly event: EventWritePreflight;
}

// ───────────────────────────────────────────────────────────────────
// 4. VERIFICATION TYPES
// ───────────────────────────────────────────────────────────────────

/** Downstream gates permitted to consume the shared verified-result API. */
export type ReplayFingerprintConsumer =
  | 'shadow-parity'
  | 'whole-system-replay';

/** Closed diagnostic vocabulary for one failed comparison boundary. */
export type ReplayFingerprintComponent =
  | 'fingerprint_version'
  | 'canonicalization'
  | 'attestation'
  | 'ledger'
  | 'range'
  | 'stored'
  | 'authorization_linkage'
  | 'envelope_registry'
  | 'observed_event_versions'
  | 'upcaster_registry'
  | 'upcaster_chain'
  | 'effective'
  | 'reducer'
  | 'projection_schema'
  | 'replay_input'
  | 'projection'
  | 'final_digest';

export const ReplayFingerprintErrorCodes = {
  INVALID_INPUT: 'INVALID_INPUT',
  UNSUPPORTED_FINGERPRINT_VERSION: 'UNSUPPORTED_FINGERPRINT_VERSION',
  RANGE_NOT_CLOSED: 'RANGE_NOT_CLOSED',
  RANGE_DRIFT: 'RANGE_DRIFT',
  LEDGER_CORRUPTION: 'LEDGER_CORRUPTION',
  CONTRACT_DRIFT: 'CONTRACT_DRIFT',
  STORED_MISMATCH: 'STORED_MISMATCH',
  EFFECTIVE_MISMATCH: 'EFFECTIVE_MISMATCH',
  PROJECTION_MISMATCH: 'PROJECTION_MISMATCH',
  MISSING_ATTESTATION: 'MISSING_ATTESTATION',
  ATTESTATION_INVALID: 'ATTESTATION_INVALID',
  ATTESTATION_CONFLICT: 'ATTESTATION_CONFLICT',
  ATTESTATION_SELF_INCLUDED: 'ATTESTATION_SELF_INCLUDED',
  NONDETERMINISTIC_INPUT: 'NONDETERMINISTIC_INPUT',
  REPLAY_COMPONENT_UNREGISTERED: 'REPLAY_COMPONENT_UNREGISTERED',
} as const;

/** Programmatic non-zero replay verification error code. */
export type ReplayFingerprintErrorCode =
  typeof ReplayFingerprintErrorCodes[keyof typeof ReplayFingerprintErrorCodes];

/** Earliest location available without exposing event payloads. */
export interface ReplayFingerprintDivergence {
  readonly sequence: number | null;
  readonly hop: number | null;
  readonly stage: string;
}

/** Bounded typed failure that never contains a trusted projection. */
export interface ReplayFingerprintFailure {
  readonly code: ReplayFingerprintErrorCode;
  readonly ledgerId: string;
  readonly rangeStartSequence: number;
  readonly rangeEndSequence: number;
  readonly fingerprintVersion: number | null;
  readonly component: ReplayFingerprintComponent;
  readonly expectedDigest: string | null;
  readonly actualDigest: string | null;
  readonly earliestDivergence: ReplayFingerprintDivergence;
  readonly message: string;
}

/** Internal typed exception normalized by the public verifier. */
export class ReplayFingerprintError extends Error {
  public readonly code: ReplayFingerprintErrorCode;
  public readonly component: ReplayFingerprintComponent;
  public readonly expectedDigest: string | null;
  public readonly actualDigest: string | null;
  public readonly sequence: number | null;
  public readonly hop: number | null;
  public readonly stage: string;

  public constructor(
    code: ReplayFingerprintErrorCode,
    component: ReplayFingerprintComponent,
    message: string,
    details: Readonly<{
      expectedDigest?: string | null;
      actualDigest?: string | null;
      sequence?: number | null;
      hop?: number | null;
      stage?: string;
    }> = {},
  ) {
    super(message);
    this.name = 'ReplayFingerprintError';
    this.code = code;
    this.component = component;
    this.expectedDigest = details.expectedDigest ?? null;
    this.actualDigest = details.actualDigest ?? null;
    this.sequence = details.sequence ?? null;
    this.hop = details.hop ?? null;
    this.stage = details.stage ?? component;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/** Trusted data exists only on the successful branch. */
export interface VerifiedReplayFingerprint<TState extends JsonObject> {
  readonly descriptor: ReplayFingerprintDescriptor;
  readonly descriptorBytes: Uint8Array;
  readonly attestationSequence: number;
  readonly projection: RebuiltProjection<TState>;
}

export interface ReplayFingerprintVerificationSuccess<TState extends JsonObject> {
  readonly ok: true;
  readonly exitCode: 0;
  readonly consumer: ReplayFingerprintConsumer;
  readonly verified: VerifiedReplayFingerprint<TState>;
}

export interface ReplayFingerprintVerificationFailure {
  readonly ok: false;
  readonly exitCode: 1;
  readonly consumer: ReplayFingerprintConsumer;
  readonly failure: ReplayFingerprintFailure;
}

/** Failures have no trusted branch and therefore cannot carry projection evidence. */
export type ReplayFingerprintVerificationResult<TState extends JsonObject> =
  | ReplayFingerprintVerificationSuccess<TState>
  | ReplayFingerprintVerificationFailure;

// ───────────────────────────────────────────────────────────────────
// MODULE: Canonical Replay Fingerprint Descriptor
// ───────────────────────────────────────────────────────────────────

import { sha256Bytes } from '../event-envelope/index.js';

import {
  ReplayFingerprintError,
  ReplayFingerprintErrorCodes,
} from './replay-fingerprint-types.js';

import type { JsonObject } from '../event-envelope/index.js';
import type {
  FingerprintVersionDefinition,
  ReplayFingerprintDescriptor,
  ReplayFingerprintDescriptorCore,
} from './replay-fingerprint-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

export const FINGERPRINT_HASH_ALGORITHM = 'sha256';
export const FINGERPRINT_CANONICALIZATION_ALGORITHM =
  'deep-loop-length-delimited-v1';
export const INITIAL_STATE_REPLAY_INPUT = 'initial_state';

const MAX_DESCRIPTOR_BYTES = 1_048_576;
const MAX_COLLECTION_ITEMS = 100_000;
const HASH_PATTERN = /^[a-f0-9]{64}$/;
const STABLE_IDENTITY_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:@-]{0,255}$/;
const REPLAY_INPUT_KEY_PATTERN = /^[a-z][a-z0-9._-]{0,127}$/;
const NONDETERMINISTIC_INPUT_PATTERN =
  /(^|[._-])(cwd|discovery|env|environment|home|host|locale|path|pid|process|temp|time|timestamp|wall-clock)([._-]|$)/i;

const CORE_FIELD_ORDER = [
  'fingerprint_version',
  'hash_algorithm',
  'canonicalization_algorithm',
  'ledger_id',
  'run_id',
  'range_start_sequence',
  'range_end_sequence',
  'event_count',
  'genesis_record_hash',
  'terminal_head_hash',
  'ordered_record_hashes',
  'stored_bytes_digest',
  'authorization_linkage_digest',
  'envelope_registry_digest',
  'observed_event_type_versions',
  'upcaster_registry_digest',
  'ordered_chain_identities',
  'effective_event_digest',
  'reducer_id',
  'reducer_version',
  'projection_schema_version',
  'replay_input_digests',
  'projection_digest',
] as const;

const COMPLETE_FIELD_ORDER = [...CORE_FIELD_ORDER, 'final_digest'] as const;
const CORE_FIELD_SET = new Set<string>(CORE_FIELD_ORDER);
const COMPLETE_FIELD_SET = new Set<string>(COMPLETE_FIELD_ORDER);

type DescriptorField = typeof COMPLETE_FIELD_ORDER[number];
type CanonicalFieldValue =
  | number
  | string
  | readonly string[]
  | Readonly<Record<string, string>>;

// ───────────────────────────────────────────────────────────────────
// 2. BINARY SERIALIZER
// ───────────────────────────────────────────────────────────────────

function compareCodePoints(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function lengthPrefix(length: number): Buffer {
  if (!Number.isSafeInteger(length) || length < 0 || length > MAX_DESCRIPTOR_BYTES) {
    throw new ReplayFingerprintError(
      ReplayFingerprintErrorCodes.INVALID_INPUT,
      'canonicalization',
      'Canonical descriptor field exceeds the registered byte limit',
      { stage: 'length-prefix' },
    );
  }
  const prefix = Buffer.allocUnsafe(4);
  prefix.writeUInt32BE(length);
  return prefix;
}

function framed(tag: number, payload: Uint8Array): Buffer {
  return Buffer.concat([
    Buffer.from([tag]),
    lengthPrefix(payload.byteLength),
    Buffer.from(payload),
  ]);
}

function encodeString(value: string): Buffer {
  return framed(0x73, Buffer.from(value, 'utf8'));
}

function encodeInteger(value: number): Buffer {
  if (!Number.isSafeInteger(value)) {
    throw new ReplayFingerprintError(
      ReplayFingerprintErrorCodes.INVALID_INPUT,
      'canonicalization',
      'Canonical descriptor integers must be safe integers',
      { stage: 'integer' },
    );
  }
  return framed(0x69, Buffer.from(String(value), 'ascii'));
}

function encodeStringArray(values: readonly string[]): Buffer {
  if (values.length > MAX_COLLECTION_ITEMS) {
    throw new ReplayFingerprintError(
      ReplayFingerprintErrorCodes.INVALID_INPUT,
      'canonicalization',
      'Canonical descriptor array exceeds the registered item limit',
      { stage: 'array' },
    );
  }
  const encoded = values.map(encodeString);
  return framed(0x61, Buffer.concat([lengthPrefix(values.length), ...encoded]));
}

function encodeStringMap(values: Readonly<Record<string, string>>): Buffer {
  const entries = Object.entries(values).sort(([left], [right]) => compareCodePoints(left, right));
  if (entries.length > MAX_COLLECTION_ITEMS) {
    throw new ReplayFingerprintError(
      ReplayFingerprintErrorCodes.INVALID_INPUT,
      'canonicalization',
      'Canonical descriptor map exceeds the registered item limit',
      { stage: 'map' },
    );
  }
  const encoded = entries.flatMap(([key, value]) => [encodeString(key), encodeString(value)]);
  return framed(0x6d, Buffer.concat([lengthPrefix(entries.length), ...encoded]));
}

function encodeValue(value: CanonicalFieldValue): Buffer {
  if (typeof value === 'number') return encodeInteger(value);
  if (typeof value === 'string') return encodeString(value);
  if (Array.isArray(value)) return encodeStringArray(value);
  return encodeStringMap(value as Readonly<Record<string, string>>);
}

function descriptorValue(
  descriptor: ReplayFingerprintDescriptorCore | ReplayFingerprintDescriptor,
  field: DescriptorField,
): CanonicalFieldValue {
  return descriptor[field as keyof typeof descriptor] as CanonicalFieldValue;
}

/** Serialize the registered descriptor with explicit fields and binary lengths. */
export function serializeReplayFingerprintDescriptor(
  descriptor: ReplayFingerprintDescriptorCore | ReplayFingerprintDescriptor,
  includeFinalDigest: boolean,
): Uint8Array {
  const fields = includeFinalDigest ? COMPLETE_FIELD_ORDER : CORE_FIELD_ORDER;
  const encodedFields = fields.flatMap((field) => [
    encodeString(field),
    encodeValue(descriptorValue(descriptor, field)),
  ]);
  const bytes = Buffer.concat([
    Buffer.from('DLRF', 'ascii'),
    lengthPrefix(fields.length),
    ...encodedFields,
  ]);
  if (bytes.byteLength > MAX_DESCRIPTOR_BYTES) {
    throw new ReplayFingerprintError(
      ReplayFingerprintErrorCodes.INVALID_INPUT,
      'canonicalization',
      'Canonical replay fingerprint descriptor exceeds the registered byte limit',
      { stage: 'descriptor' },
    );
  }
  return Uint8Array.from(bytes);
}

/** Hash a registered canonical byte sequence. */
export function hashReplayFingerprintBytes(bytes: Uint8Array): string {
  return sha256Bytes(bytes);
}

// ───────────────────────────────────────────────────────────────────
// 3. VALIDATION
// ───────────────────────────────────────────────────────────────────

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && !Array.isArray(value) && typeof value === 'object';
}

function requireExactFields(
  value: Record<string, unknown>,
  expected: ReadonlySet<string>,
): void {
  const fields = Object.keys(value);
  if (fields.length !== expected.size || fields.some((field) => !expected.has(field))) {
    throw new ReplayFingerprintError(
      ReplayFingerprintErrorCodes.ATTESTATION_INVALID,
      'attestation',
      'Replay fingerprint descriptor does not match the closed registered shape',
      { stage: 'descriptor-shape' },
    );
  }
}

function requirePositiveInteger(value: unknown, field: string): number {
  if (!Number.isSafeInteger(value) || (value as number) <= 0) {
    throw new ReplayFingerprintError(
      ReplayFingerprintErrorCodes.INVALID_INPUT,
      field === 'fingerprint_version' ? 'fingerprint_version' : 'attestation',
      field + ' must be a positive safe integer',
      { stage: field },
    );
  }
  return value as number;
}

function requireString(value: unknown, field: string): string {
  if (typeof value !== 'string' || value.length === 0) {
    throw new ReplayFingerprintError(
      ReplayFingerprintErrorCodes.ATTESTATION_INVALID,
      'attestation',
      field + ' must be a non-empty string',
      { stage: field },
    );
  }
  return value;
}

function requireStableIdentity(value: unknown, field: string): string {
  const identity = requireString(value, field);
  if (!STABLE_IDENTITY_PATTERN.test(identity)) {
    throw new ReplayFingerprintError(
      ReplayFingerprintErrorCodes.NONDETERMINISTIC_INPUT,
      'replay_input',
      field + ' must be a registered identity rather than a host-derived value',
      { stage: field },
    );
  }
  return identity;
}

/** Require an identity that cannot encode host or filesystem discovery state. */
export function assertReplayFingerprintIdentity(value: unknown, field: string): string {
  return requireStableIdentity(value, field);
}

function requireHash(value: unknown, field: string): string {
  if (typeof value !== 'string' || !HASH_PATTERN.test(value)) {
    throw new ReplayFingerprintError(
      ReplayFingerprintErrorCodes.ATTESTATION_INVALID,
      'attestation',
      field + ' must be a lowercase SHA-256 digest',
      { stage: field },
    );
  }
  return value;
}

function requireStringArray(
  value: unknown,
  field: string,
  validateEntry: (entry: unknown, entryField: string) => string = requireString,
): readonly string[] {
  if (!Array.isArray(value) || value.length > MAX_COLLECTION_ITEMS) {
    throw new ReplayFingerprintError(
      ReplayFingerprintErrorCodes.ATTESTATION_INVALID,
      'attestation',
      field + ' must be a bounded array',
      { stage: field },
    );
  }
  return Object.freeze(value.map((entry, index) => validateEntry(entry, field + '[' + index + ']')));
}

function requireReplayInputDigests(value: unknown): Readonly<Record<string, string>> {
  if (!isRecord(value)) {
    throw new ReplayFingerprintError(
      ReplayFingerprintErrorCodes.NONDETERMINISTIC_INPUT,
      'replay_input',
      'Replay inputs must be an unordered map of immutable digests',
      { stage: 'replay-input-shape' },
    );
  }
  const normalized: Record<string, string> = Object.create(null);
  const keys = Object.keys(value).sort(compareCodePoints);
  for (const key of keys) {
    assertDeterministicReplayInputKey(key);
    normalized[key] = requireHash(value[key], 'replay_input_digests.' + key);
  }
  if (normalized[INITIAL_STATE_REPLAY_INPUT] === undefined) {
    throw new ReplayFingerprintError(
      ReplayFingerprintErrorCodes.NONDETERMINISTIC_INPUT,
      'replay_input',
      'Replay inputs must content-address the canonical initial state',
      { stage: 'initial-state-input' },
    );
  }
  return Object.freeze(normalized);
}

/** Reject replay-input names that could smuggle mutable host state into a digest. */
export function assertDeterministicReplayInputKey(key: string): void {
  if (
    !REPLAY_INPUT_KEY_PATTERN.test(key)
    || NONDETERMINISTIC_INPUT_PATTERN.test(key)
  ) {
    throw new ReplayFingerprintError(
      ReplayFingerprintErrorCodes.NONDETERMINISTIC_INPUT,
      'replay_input',
      'Replay input keys cannot name host, process, clock, locale, discovery, or environment state',
      { stage: 'replay-input-key' },
    );
  }
}

/** Parse and verify one complete descriptor under an exact historical implementation. */
export function parseReplayFingerprintDescriptor(
  input: unknown,
  implementation: FingerprintVersionDefinition,
): ReplayFingerprintDescriptor {
  if (!isRecord(input)) {
    throw new ReplayFingerprintError(
      ReplayFingerprintErrorCodes.ATTESTATION_INVALID,
      'attestation',
      'Replay fingerprint descriptor must be an object',
      { stage: 'descriptor' },
    );
  }
  requireExactFields(input, COMPLETE_FIELD_SET);
  const fingerprintVersion = requirePositiveInteger(
    input.fingerprint_version,
    'fingerprint_version',
  );
  if (fingerprintVersion !== implementation.fingerprintVersion) {
    throw new ReplayFingerprintError(
      ReplayFingerprintErrorCodes.UNSUPPORTED_FINGERPRINT_VERSION,
      'fingerprint_version',
      'Descriptor version does not match the resolved historical implementation',
      { stage: 'fingerprint-version' },
    );
  }
  if (
    input.hash_algorithm !== implementation.hashAlgorithm
    || input.canonicalization_algorithm !== implementation.canonicalizationAlgorithm
  ) {
    throw new ReplayFingerprintError(
      ReplayFingerprintErrorCodes.CONTRACT_DRIFT,
      'canonicalization',
      'Descriptor algorithms do not match the registered fingerprint version',
      { stage: 'algorithm-contract' },
    );
  }

  const rangeStartSequence = requirePositiveInteger(
    input.range_start_sequence,
    'range_start_sequence',
  );
  const rangeEndSequence = requirePositiveInteger(
    input.range_end_sequence,
    'range_end_sequence',
  );
  const eventCount = requirePositiveInteger(input.event_count, 'event_count');
  if (
    rangeEndSequence < rangeStartSequence
    || eventCount !== rangeEndSequence - rangeStartSequence + 1
  ) {
    throw new ReplayFingerprintError(
      ReplayFingerprintErrorCodes.RANGE_DRIFT,
      'range',
      'Descriptor range and event count do not identify one closed contiguous range',
      { stage: 'range' },
    );
  }

  const orderedRecordHashes = requireStringArray(
    input.ordered_record_hashes,
    'ordered_record_hashes',
    requireHash,
  );
  if (orderedRecordHashes.length !== eventCount) {
    throw new ReplayFingerprintError(
      ReplayFingerprintErrorCodes.RANGE_DRIFT,
      'range',
      'Ordered record hash count does not match the covered range',
      { stage: 'record-count' },
    );
  }

  const descriptor: ReplayFingerprintDescriptor = Object.freeze({
    fingerprint_version: fingerprintVersion,
    hash_algorithm: implementation.hashAlgorithm,
    canonicalization_algorithm: implementation.canonicalizationAlgorithm,
    ledger_id: requireStableIdentity(input.ledger_id, 'ledger_id'),
    run_id: requireStableIdentity(input.run_id, 'run_id'),
    range_start_sequence: rangeStartSequence,
    range_end_sequence: rangeEndSequence,
    event_count: eventCount,
    genesis_record_hash: requireHash(input.genesis_record_hash, 'genesis_record_hash'),
    terminal_head_hash: requireHash(input.terminal_head_hash, 'terminal_head_hash'),
    ordered_record_hashes: orderedRecordHashes,
    stored_bytes_digest: requireHash(input.stored_bytes_digest, 'stored_bytes_digest'),
    authorization_linkage_digest: requireHash(
      input.authorization_linkage_digest,
      'authorization_linkage_digest',
    ),
    envelope_registry_digest: requireHash(
      input.envelope_registry_digest,
      'envelope_registry_digest',
    ),
    observed_event_type_versions: requireStringArray(
      input.observed_event_type_versions,
      'observed_event_type_versions',
      requireStableIdentity,
    ),
    upcaster_registry_digest: requireHash(
      input.upcaster_registry_digest,
      'upcaster_registry_digest',
    ),
    ordered_chain_identities: requireStringArray(
      input.ordered_chain_identities,
      'ordered_chain_identities',
      requireString,
    ),
    effective_event_digest: requireHash(
      input.effective_event_digest,
      'effective_event_digest',
    ),
    reducer_id: requireStableIdentity(input.reducer_id, 'reducer_id'),
    reducer_version: requireStableIdentity(input.reducer_version, 'reducer_version'),
    projection_schema_version: requireStableIdentity(
      input.projection_schema_version,
      'projection_schema_version',
    ),
    replay_input_digests: requireReplayInputDigests(input.replay_input_digests),
    projection_digest: requireHash(input.projection_digest, 'projection_digest'),
    final_digest: requireHash(input.final_digest, 'final_digest'),
  });
  const calculatedFinalDigest = hashReplayFingerprintBytes(
    implementation.serializeDescriptor(descriptor, false),
  );
  if (descriptor.final_digest !== calculatedFinalDigest) {
    throw new ReplayFingerprintError(
      ReplayFingerprintErrorCodes.ATTESTATION_INVALID,
      'final_digest',
      'Descriptor final digest does not commit its canonical core bytes',
      {
        expectedDigest: descriptor.final_digest,
        actualDigest: calculatedFinalDigest,
        stage: 'final-digest',
      },
    );
  }
  return descriptor;
}

/** Convert a descriptor into the event-envelope JSON domain without changing order. */
export function replayFingerprintDescriptorJson(
  descriptor: ReplayFingerprintDescriptor,
): JsonObject {
  return {
    ...descriptor,
    ordered_record_hashes: [...descriptor.ordered_record_hashes],
    observed_event_type_versions: [...descriptor.observed_event_type_versions],
    ordered_chain_identities: [...descriptor.ordered_chain_identities],
    replay_input_digests: { ...descriptor.replay_input_digests },
  } as JsonObject;
}

/** Validate the core field set before a final digest is attached. */
export function assertReplayFingerprintCoreShape(
  descriptor: ReplayFingerprintDescriptorCore,
): void {
  requireExactFields(descriptor as unknown as Record<string, unknown>, CORE_FIELD_SET);
}

/** Expose deterministic code-point ordering without locale-sensitive comparison. */
export function compareReplayFingerprintKeys(left: string, right: string): number {
  return compareCodePoints(left, right);
}

/** Return true only for a bounded lowercase SHA-256 digest. */
export function isReplayFingerprintDigest(value: unknown): value is string {
  return typeof value === 'string' && HASH_PATTERN.test(value);
}

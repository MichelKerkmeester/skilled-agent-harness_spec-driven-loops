// ───────────────────────────────────────────────────────────────────
// MODULE: Replay Fingerprint Derivation
// ───────────────────────────────────────────────────────────────────

import { createHash } from 'node:crypto';

import {
  AppendOnlyLedger,
  AuthorizedLedgerError,
  rebuildProjection,
} from '../authorized-ledger/index.js';
import {
  canonicalBytes,
  sha256Bytes,
} from '../event-envelope/index.js';
import {
  INITIAL_STATE_REPLAY_INPUT,
  assertDeterministicReplayInputKey,
  assertReplayFingerprintCoreShape,
  assertReplayFingerprintIdentity,
  compareReplayFingerprintKeys,
  hashReplayFingerprintBytes,
  isReplayFingerprintDigest,
} from './canonical-descriptor.js';
import {
  REPLAY_FINGERPRINT_ATTESTATION_EVENT_TYPE,
  ReplayFingerprintError,
  ReplayFingerprintErrorCodes,
} from './replay-fingerprint-types.js';

import type { Hash } from 'node:crypto';
import type {
  LedgerHead,
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
  DerivedReplayFingerprint,
  FingerprintVersionDefinition,
  ReplayExecutionInput,
  ReplayFingerprintDescriptor,
  ReplayFingerprintDescriptorCore,
} from './replay-fingerprint-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. INPUT TYPES
// ───────────────────────────────────────────────────────────────────

/** Inputs whose mutable behavior is resolved through registered runtime components. */
export interface DeriveReplayFingerprintInput<TState extends JsonObject> {
  readonly ledger: AppendOnlyLedger;
  readonly eventRegistry: EventTypeRegistry;
  readonly versionRegistry: FingerprintVersionRegistry;
  readonly componentRegistry: ReplayComponentRegistry<TState>;
  readonly runId: string;
  readonly rangeStartSequence: number;
  readonly rangeEndSequence: number;
  readonly replay: ReplayExecutionInput<TState>;
}

interface HistoricalDerivationInput<TState extends JsonObject>
  extends DeriveReplayFingerprintInput<TState> {
  readonly implementation: FingerprintVersionDefinition;
}

// ───────────────────────────────────────────────────────────────────
// 2. STREAMING HELPERS
// ───────────────────────────────────────────────────────────────────

function lengthPrefix(length: number): Buffer {
  const prefix = Buffer.allocUnsafe(4);
  prefix.writeUInt32BE(length);
  return prefix;
}

function sequenceBytes(sequence: number): Buffer {
  const bytes = Buffer.allocUnsafe(8);
  bytes.writeBigUInt64BE(BigInt(sequence));
  return bytes;
}

function updateDelimited(hash: Hash, bytes: Uint8Array): void {
  hash.update(lengthPrefix(bytes.byteLength));
  hash.update(bytes);
}

function createComponentHash(domain: string): Hash {
  const hash = createHash('sha256');
  updateDelimited(hash, Buffer.from(domain, 'utf8'));
  return hash;
}

function updateSequencedBytes(
  hash: Hash,
  sequence: number,
  bytes: Uint8Array,
): void {
  updateDelimited(hash, sequenceBytes(sequence));
  updateDelimited(hash, bytes);
}

function ledgerFailure(error: unknown): ReplayFingerprintError {
  if (error instanceof ReplayFingerprintError) return error;
  if (error instanceof AuthorizedLedgerError) {
    const sequence = typeof error.details.sequence === 'number'
      ? error.details.sequence
      : typeof error.details.expected === 'number'
        ? error.details.expected
        : typeof error.details.actual === 'number'
          ? error.details.actual
          : null;
    return new ReplayFingerprintError(
      ReplayFingerprintErrorCodes.LEDGER_CORRUPTION,
      'stored',
      'Authorized ledger verification failed before fingerprint derivation',
      { sequence, stage: error.phase },
    );
  }
  return new ReplayFingerprintError(
    ReplayFingerprintErrorCodes.LEDGER_CORRUPTION,
    'ledger',
    'Ledger reader did not yield a fully verified sequence',
    { stage: 'ledger-reader' },
  );
}

async function readClosedRange(
  ledger: AppendOnlyLedger,
  startSequence: number,
  endSequence: number,
): Promise<readonly VerifiedLedgerEvent[]> {
  if (!(ledger instanceof AppendOnlyLedger)) {
    throw new ReplayFingerprintError(
      ReplayFingerprintErrorCodes.LEDGER_CORRUPTION,
      'ledger',
      'Fingerprint derivation accepts only the shipped authorized-ledger reader',
      { stage: 'reader-type' },
    );
  }
  if (
    !Number.isSafeInteger(startSequence)
    || startSequence <= 0
    || !Number.isSafeInteger(endSequence)
    || endSequence < startSequence
  ) {
    throw new ReplayFingerprintError(
      ReplayFingerprintErrorCodes.INVALID_INPUT,
      'range',
      'Fingerprint range must use positive inclusive sequence bounds',
      { stage: 'range-input' },
    );
  }

  let events: readonly VerifiedLedgerEvent[];
  try {
    events = await ledger.readVerifiedEvents();
  } catch (error: unknown) {
    throw ledgerFailure(error);
  }
  if (endSequence > events.length) {
    throw new ReplayFingerprintError(
      ReplayFingerprintErrorCodes.RANGE_NOT_CLOSED,
      'range',
      'Fingerprint range extends beyond the verified ledger head',
      { sequence: endSequence, stage: 'range-end' },
    );
  }
  const range = events.slice(startSequence - 1, endSequence);
  for (const [index, verified] of range.entries()) {
    const expectedSequence = startSequence + index;
    if (
      verified.frame.sequence !== expectedSequence
      || verified.frame.ledger_id !== ledger.ledgerId
    ) {
      throw new ReplayFingerprintError(
        ReplayFingerprintErrorCodes.LEDGER_CORRUPTION,
        'stored',
        'Verified ledger range is not a contiguous ascending sequence',
        { sequence: expectedSequence, stage: 'range-sequence' },
      );
    }
  }
  return Object.freeze(range);
}

function normalizedReplayInputs<TState extends JsonObject>(
  replay: ReplayExecutionInput<TState>,
  requiredKeys: readonly string[],
): Readonly<Record<string, string>> {
  const keys = Object.keys(replay.replayInputDigests).sort(compareReplayFingerprintKeys);
  keys.forEach(assertDeterministicReplayInputKey);
  const expectedKeys = [...requiredKeys].sort(compareReplayFingerprintKeys);
  if (
    keys.length !== expectedKeys.length
    || keys.some((key, index) => key !== expectedKeys[index])
  ) {
    throw new ReplayFingerprintError(
      ReplayFingerprintErrorCodes.NONDETERMINISTIC_INPUT,
      'replay_input',
      'Replay inputs must match the registered immutable input set exactly',
      { stage: 'replay-input-set' },
    );
  }
  const normalized: Record<string, string> = Object.create(null);
  for (const key of keys) {
    const digest = replay.replayInputDigests[key];
    if (!isReplayFingerprintDigest(digest)) {
      throw new ReplayFingerprintError(
        ReplayFingerprintErrorCodes.NONDETERMINISTIC_INPUT,
        'replay_input',
        'Replay inputs must contain immutable lowercase SHA-256 digests only',
        { stage: 'replay-input-digest' },
      );
    }
    normalized[key] = digest;
  }
  const initialStateDigest = sha256Bytes(canonicalBytes(replay.initialState));
  if (normalized[INITIAL_STATE_REPLAY_INPUT] !== initialStateDigest) {
    throw new ReplayFingerprintError(
      ReplayFingerprintErrorCodes.NONDETERMINISTIC_INPUT,
      'replay_input',
      'Initial state bytes do not match their registered replay-input digest',
      {
        expectedDigest: normalized[INITIAL_STATE_REPLAY_INPUT] ?? null,
        actualDigest: initialStateDigest,
        stage: 'initial-state-digest',
      },
    );
  }
  return Object.freeze(normalized);
}

function upcasterRegistryDigest(eventRegistry: EventTypeRegistry): string {
  const registry = eventRegistry.inspect()
    .map((entry) => ({
      eventType: entry.eventType,
      upcasters: entry.upcasters.map((upcaster) => ({
        identity: upcaster.identity,
        fromVersion: upcaster.fromVersion,
        toVersion: upcaster.toVersion,
        implementationDigest: upcaster.implementationDigest,
      })),
    }))
    .sort((left, right) => compareReplayFingerprintKeys(left.eventType, right.eventType));
  return sha256Bytes(canonicalBytes(registry as unknown as JsonValue));
}

function chainIdentities(verified: VerifiedLedgerEvent): readonly string[] {
  const sequence = String(verified.frame.sequence);
  const storedEnvelope = verified.event.stored.envelope;
  const prefix = [
    'sequence=' + sequence,
    'event=' + storedEnvelope.event_type + '@' + String(storedEnvelope.event_version),
    'chain=' + verified.event.chainIdentity,
  ].join('|');
  if (verified.event.hopTrace.length === 0) {
    return Object.freeze([prefix + '|hop=none']);
  }
  return Object.freeze(verified.event.hopTrace.map((hop, index) => [
    prefix,
    'hop=' + String(index),
    'identity=' + assertReplayFingerprintIdentity(
      hop.identity,
      'upcaster_identity',
    ),
    'implementation=' + hop.implementationDigest,
    'from=' + String(hop.fromVersion),
    'to=' + String(hop.toVersion),
  ].join('|')));
}

function containsOwnAttestation(
  verified: VerifiedLedgerEvent,
  input: HistoricalDerivationInput<JsonObject>,
): boolean {
  if (
    verified.event.effective.envelope.event_type
    !== REPLAY_FINGERPRINT_ATTESTATION_EVENT_TYPE
  ) {
    return false;
  }
  const payload = verified.event.effective.envelope.payload;
  return payload.run_id === input.runId
    && payload.ledger_id === input.ledger.ledgerId
    && payload.range_start_sequence === input.rangeStartSequence
    && payload.range_end_sequence === input.rangeEndSequence
    && payload.fingerprint_version === input.implementation.fingerprintVersion;
}

// ───────────────────────────────────────────────────────────────────
// 3. DERIVATION
// ───────────────────────────────────────────────────────────────────

/** Recompute one exact historical fingerprint for verification only. */
export async function deriveReplayFingerprintAtVersion<TState extends JsonObject>(
  input: HistoricalDerivationInput<TState>,
): Promise<DerivedReplayFingerprint<TState>> {
  const runId = assertReplayFingerprintIdentity(input.runId, 'run_id');
  const component = input.componentRegistry.resolve(
    input.replay.reducerId,
    input.replay.reducerVersion,
    input.replay.projectionSchemaVersion,
  );
  const replayInputDigests = normalizedReplayInputs(
    input.replay,
    component.requiredReplayInputKeys,
  );
  if (input.ledger.registryDigest !== input.eventRegistry.digest) {
    throw new ReplayFingerprintError(
      ReplayFingerprintErrorCodes.CONTRACT_DRIFT,
      'envelope_registry',
      'Ledger reader and supplied event registry do not share one exact digest',
      {
        expectedDigest: input.ledger.registryDigest,
        actualDigest: input.eventRegistry.digest,
        stage: 'event-registry-binding',
      },
    );
  }

  const range = await readClosedRange(
    input.ledger,
    input.rangeStartSequence,
    input.rangeEndSequence,
  );
  const storedHash = createComponentHash('deep-loop.replay.stored.v1');
  const authorizationHash = createComponentHash('deep-loop.replay.authorization.v1');
  const effectiveHash = createComponentHash('deep-loop.replay.effective.v1');
  const orderedRecordHashes: string[] = [];
  const observedEventTypeVersions = new Set<string>();
  const orderedChainIdentities: string[] = [];

  for (const verified of range) {
    if (containsOwnAttestation(
      verified,
      input as unknown as HistoricalDerivationInput<JsonObject>,
    )) {
      throw new ReplayFingerprintError(
        ReplayFingerprintErrorCodes.ATTESTATION_SELF_INCLUDED,
        'range',
        'Fingerprint attestation cannot occur inside the range it commits',
        { sequence: verified.frame.sequence, stage: 'attestation-self-inclusion' },
      );
    }
    if (verified.event.registryDigest !== input.eventRegistry.digest) {
      throw new ReplayFingerprintError(
        ReplayFingerprintErrorCodes.CONTRACT_DRIFT,
        'envelope_registry',
        'Verified event was decoded under a different envelope registry',
        { sequence: verified.frame.sequence, stage: 'event-registry' },
      );
    }
    orderedRecordHashes.push(verified.frame.record_hash);
    observedEventTypeVersions.add(
      verified.event.stored.envelope.event_type
      + '@'
      + String(verified.event.storedVersion),
    );
    orderedChainIdentities.push(...chainIdentities(verified));
    updateSequencedBytes(
      storedHash,
      verified.frame.sequence,
      Uint8Array.from(verified.event.stored.bytes),
    );
    updateSequencedBytes(
      authorizationHash,
      verified.frame.sequence,
      Uint8Array.from(canonicalBytes(
        verified.frame.authorization_ref as unknown as JsonObject,
      )),
    );
    updateSequencedBytes(
      effectiveHash,
      verified.frame.sequence,
      Uint8Array.from(verified.event.effective.canonicalBytes),
    );
  }

  const last = range[range.length - 1];
  const first = range[0];
  if (!first || !last) {
    throw new ReplayFingerprintError(
      ReplayFingerprintErrorCodes.RANGE_NOT_CLOSED,
      'range',
      'Fingerprint derivation requires at least one verified ledger event',
      { stage: 'empty-range' },
    );
  }
  const rangeHead: LedgerHead = Object.freeze({
    ledgerId: input.ledger.ledgerId,
    sequence: last.frame.sequence,
    recordHash: last.frame.record_hash,
  });

  let projection;
  try {
    projection = rebuildProjection(
      range,
      input.replay.initialState,
      component.reducerVersion,
      rangeHead,
      component.reducerRegistry,
    );
  } catch (error: unknown) {
    if (error instanceof AuthorizedLedgerError) {
      throw new ReplayFingerprintError(
        error.code === 'REDUCER_NON_DETERMINISTIC'
          ? ReplayFingerprintErrorCodes.NONDETERMINISTIC_INPUT
          : ReplayFingerprintErrorCodes.REPLAY_COMPONENT_UNREGISTERED,
        'reducer',
        'Registered replay reduction failed closed',
        { stage: error.code },
      );
    }
    throw error;
  }

  const descriptorCore: ReplayFingerprintDescriptorCore = Object.freeze({
    fingerprint_version: input.implementation.fingerprintVersion,
    hash_algorithm: input.implementation.hashAlgorithm,
    canonicalization_algorithm: input.implementation.canonicalizationAlgorithm,
    ledger_id: input.ledger.ledgerId,
    run_id: runId,
    range_start_sequence: input.rangeStartSequence,
    range_end_sequence: input.rangeEndSequence,
    event_count: range.length,
    genesis_record_hash: first.frame.prev_record_hash,
    terminal_head_hash: last.frame.record_hash,
    ordered_record_hashes: Object.freeze(orderedRecordHashes),
    stored_bytes_digest: storedHash.digest('hex'),
    authorization_linkage_digest: authorizationHash.digest('hex'),
    envelope_registry_digest: input.eventRegistry.digest,
    observed_event_type_versions: Object.freeze(
      Array.from(observedEventTypeVersions).sort(compareReplayFingerprintKeys),
    ),
    upcaster_registry_digest: upcasterRegistryDigest(input.eventRegistry),
    ordered_chain_identities: Object.freeze(orderedChainIdentities),
    effective_event_digest: effectiveHash.digest('hex'),
    reducer_id: component.reducerId,
    reducer_version: component.reducerVersion,
    projection_schema_version: component.projectionSchemaVersion,
    replay_input_digests: replayInputDigests,
    projection_digest: projection.digest,
  });
  assertReplayFingerprintCoreShape(descriptorCore);
  const commitmentBytes = input.implementation.serializeDescriptor(descriptorCore, false);
  const descriptor: ReplayFingerprintDescriptor = Object.freeze({
    ...descriptorCore,
    final_digest: hashReplayFingerprintBytes(commitmentBytes),
  });
  const descriptorBytes = input.implementation.serializeDescriptor(descriptor, true);
  return Object.freeze({
    descriptor,
    descriptorBytes,
    commitmentBytes,
    projection,
  });
}

/** Derive a new attestation candidate using only the current fingerprint version. */
export async function deriveReplayFingerprint<TState extends JsonObject>(
  input: DeriveReplayFingerprintInput<TState>,
): Promise<DerivedReplayFingerprint<TState>> {
  return deriveReplayFingerprintAtVersion({
    ...input,
    implementation: input.versionRegistry.current(),
  });
}

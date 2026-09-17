// ───────────────────────────────────────────────────────────────────
// MODULE: Legacy Projection Fold
// ───────────────────────────────────────────────────────────────────

import {
  canonicalBytes,
  sha256Bytes,
} from '../event-envelope/index.js';
import {
  INITIAL_STATE_REPLAY_INPUT,
  hashReplayFingerprintBytes,
  serializeReplayFingerprintDescriptor,
} from '../replay-fingerprint/index.js';
import {
  LegacyProjectionError,
  LegacyProjectionErrorCodes,
} from './legacy-projection-errors.js';
import { requireProjectableManifestEntry } from './legacy-projection-manifest.js';

import type {
  LedgerHead,
  LedgerRecordFrame,
  VerifiedLedgerEvent,
} from '../authorized-ledger/index.js';
import type {
  JsonObject,
  JsonValue,
} from '../event-envelope/index.js';
import type { DerivedReplayFingerprint } from '../replay-fingerprint/index.js';
import type {
  FoldedLegacyProjection,
  LegacyProjectionContract,
} from './legacy-projection-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const HASH_PATTERN = /^[a-f0-9]{64}$/u;
const GENESIS_RECORD_HASH = '0'.repeat(64);

interface ProjectionIdentity {
  readonly artifactId: string;
  readonly projectionVersion: string;
}

// ───────────────────────────────────────────────────────────────────
// 2. BYTE-FAITHFUL SERIALIZERS
// ───────────────────────────────────────────────────────────────────

/** Serialize the replace-style JSON contract with insertion order and terminal newline intact. */
export function serializeLegacyJson(value: JsonValue): Uint8Array {
  canonicalBytes(value);
  const serialized = JSON.stringify(value, null, 2);
  if (serialized === undefined) {
    throw new LegacyProjectionError(
      LegacyProjectionErrorCodes.INVALID_INPUT,
      'Legacy snapshot state is not JSON serializable',
      { invariant: 'legacy-json-serialization' },
    );
  }
  return Buffer.from(`${serialized}\n`, 'utf8');
}

/** Serialize JSONL rows without sorting keys, adding spaces, or changing row order. */
export function serializeLegacyJsonl(rows: readonly JsonValue[]): Uint8Array {
  const serializedRows = rows.map((row) => {
    canonicalBytes(row);
    const serialized = JSON.stringify(row);
    if (serialized === undefined) {
      throw new LegacyProjectionError(
        LegacyProjectionErrorCodes.INVALID_INPUT,
        'Legacy JSONL row is not JSON serializable',
        { invariant: 'legacy-jsonl-serialization' },
      );
    }
    return serialized;
  });
  return Buffer.from(serializedRows.length === 0 ? '' : `${serializedRows.join('\n')}\n`, 'utf8');
}

// ───────────────────────────────────────────────────────────────────
// 3. VALIDATION HELPERS
// ───────────────────────────────────────────────────────────────────

function projectionError(
  code: keyof typeof LegacyProjectionErrorCodes,
  contract: ProjectionIdentity,
  message: string,
  invariant: string,
  ledgerSequence: number | null,
  details: Readonly<Record<string, string | number | boolean | null>> = {},
): LegacyProjectionError {
  return new LegacyProjectionError(LegacyProjectionErrorCodes[code], message, {
    artifactId: contract.artifactId,
    ledgerSequence,
    projectionVersion: contract.projectionVersion,
    invariant,
    details,
  });
}

function deepFreeze<T extends JsonValue>(value: T): T {
  if (value !== null && typeof value === 'object') {
    Object.values(value).forEach((entry) => deepFreeze(entry));
    Object.freeze(value);
  }
  return value;
}

function cloneLegacyState<TState extends JsonObject>(state: Readonly<TState>): TState {
  canonicalBytes(state);
  const serialized = JSON.stringify(state);
  if (serialized === undefined) {
    throw new TypeError('Legacy projection state must serialize to JSON');
  }
  return deepFreeze(JSON.parse(serialized) as TState);
}

function outputBytes(value: Uint8Array | string): Uint8Array {
  return typeof value === 'string'
    ? Buffer.from(value, 'utf8')
    : Uint8Array.from(value);
}

function sameStrings(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function frameHash(frame: LedgerRecordFrame): string {
  const { record_hash: ignored, ...hashInput } = frame;
  void ignored;
  return sha256Bytes(canonicalBytes(hashInput as unknown as JsonObject));
}

function assertVerifiedPrefix(
  events: readonly VerifiedLedgerEvent[],
  head: LedgerHead,
  contract: ProjectionIdentity & { readonly ledgerId: string },
): void {
  if (
    head.ledgerId !== contract.ledgerId
    || !Number.isSafeInteger(head.sequence)
    || head.sequence < 0
    || !HASH_PATTERN.test(head.recordHash)
    || events.length !== head.sequence
  ) {
    throw projectionError(
      'LEDGER_HEAD_MISMATCH', contract,
      'Verified ledger head does not close the supplied event prefix',
      'closed-ledger-prefix', head.sequence,
      { eventCount: events.length, ledgerId: head.ledgerId },
    );
  }

  let priorHash = GENESIS_RECORD_HASH;
  for (const [index, verified] of events.entries()) {
    const expectedSequence = index + 1;
    const frame = verified.frame;
    const envelope = verified.event.effective.envelope;
    if (
      frame.ledger_id !== head.ledgerId
      || frame.sequence !== expectedSequence
      || frame.prev_record_hash !== priorHash
      || frame.record_hash !== frameHash(frame)
      || frame.receipt.ledger_id !== frame.ledger_id
      || frame.receipt.sequence !== frame.sequence
      || frame.receipt.event_id !== envelope.event_id
      || frame.receipt.event_type !== envelope.event_type
      || frame.receipt.event_version !== envelope.event_version
      || frame.receipt.stream_id !== envelope.stream_id
      || frame.receipt.stream_sequence !== envelope.stream_sequence
      || frame.canonical_event_hash !== verified.event.stored.digest
      || frame.authorization_ref.authority_epoch !== envelope.authority_epoch
    ) {
      throw projectionError(
        'LEDGER_INVALID', contract,
        'Ledger frame, receipt, authorization linkage, or event identity is inconsistent',
        'verified-ledger-frame', expectedSequence,
      );
    }
    priorHash = frame.record_hash;
  }
  if (priorHash !== head.recordHash) {
    throw projectionError(
      'LEDGER_HEAD_MISMATCH', contract,
      'Verified ledger terminal hash does not match the declared head',
      'terminal-ledger-hash', head.sequence,
    );
  }
}

function assertContract<TState extends JsonObject>(
  contract: LegacyProjectionContract<TState>,
  head: LedgerHead,
): void {
  const manifestEntry = requireProjectableManifestEntry(contract.censusSurfaceId);
  if (
    contract.artifactId.trim() === ''
    || contract.ledgerId.trim() === ''
    || contract.relativePath.trim() === ''
    || contract.streamIds.length === 0
    || new Set(contract.streamIds).size !== contract.streamIds.length
    || contract.foldId !== manifestEntry.foldId
    || contract.reducerId.trim() === ''
    || contract.projectionVersion.trim() === ''
    || contract.reducerVersion.trim() === ''
    || contract.serializerId !== manifestEntry.serializerId
    || contract.refreshBoundary !== manifestEntry.refreshBoundary
    || (manifestEntry.format !== 'mixed' && contract.format !== manifestEntry.format)
    || contract.legacyWriter !== manifestEntry.legacyWriter
    || !sameStrings(contract.readers, manifestEntry.readers)
    || Object.keys(contract.acceptedEventVersions).length === 0
  ) {
    throw projectionError(
      'INVALID_INPUT', contract,
      'Projection contract is incomplete or disagrees with its census manifest row',
      'closed-projection-contract', head.sequence,
    );
  }
  for (const [eventType, versions] of Object.entries(contract.acceptedEventVersions)) {
    if (
      eventType.trim() === ''
      || versions.length === 0
      || new Set(versions).size !== versions.length
      || versions.some((version) => !Number.isSafeInteger(version) || version < 1)
    ) {
      throw projectionError(
        'INVALID_INPUT', contract,
        'Projection contract has an invalid event type or version allowlist',
        'closed-event-version-contract', head.sequence,
        { eventType },
      );
    }
  }
}

function assertBase<TState extends JsonObject>(
  contract: LegacyProjectionContract<TState>,
  events: readonly VerifiedLedgerEvent[],
  head: LedgerHead,
): void {
  const base = contract.base;
  const calculatedBaseDigest = sha256Bytes(base.bytes);
  const serializedBase = outputBytes(contract.serialize(cloneLegacyState<TState>(base.state)));
  const baseHeadHash = base.ledgerHead.sequence === 0
    ? GENESIS_RECORD_HASH
    : events[base.ledgerHead.sequence - 1]?.frame.record_hash;
  if (
    base.baseSha.trim() === ''
    || base.baseDigest !== calculatedBaseDigest
    || base.ledgerHead.ledgerId !== contract.ledgerId
    || base.ledgerHead.sequence < 0
    || base.ledgerHead.sequence > head.sequence
    || base.ledgerHead.recordHash !== baseHeadHash
    || !Buffer.from(serializedBase).equals(Buffer.from(base.bytes))
  ) {
    throw projectionError(
      'BASE_MISMATCH', contract,
      'Projection BASE state, bytes, digest, or ledger anchor is inconsistent',
      'immutable-base-anchor', head.sequence,
    );
  }
}

function runFold<TState extends JsonObject>(
  contract: LegacyProjectionContract<TState>,
  events: readonly VerifiedLedgerEvent[],
): TState {
  const selectedStreams = new Set(contract.streamIds);
  let state: TState = cloneLegacyState<TState>(contract.base.state);
  for (const verified of events.slice(contract.base.ledgerHead.sequence)) {
    const envelope = verified.event.effective.envelope;
    if (!selectedStreams.has(envelope.stream_id)) continue;
    const acceptedVersions = contract.acceptedEventVersions[envelope.event_type];
    if (!acceptedVersions?.includes(envelope.event_version)) {
      throw projectionError(
        'EVENT_UNSUPPORTED', contract,
        'Projection stream contains an unknown event type or version',
        'registered-event-version', verified.frame.sequence,
        { eventType: envelope.event_type, eventVersion: envelope.event_version },
      );
    }
    state = cloneLegacyState<TState>(
      contract.reduce(cloneLegacyState<TState>(state), verified.event),
    );
  }
  return state;
}

function assertReplayFingerprint<TState extends JsonObject>(
  contract: LegacyProjectionContract<TState>,
  events: readonly VerifiedLedgerEvent[],
  head: LedgerHead,
  state: Readonly<TState>,
  fingerprint: DerivedReplayFingerprint<TState>,
): void {
  if (
    !fingerprint
    || typeof fingerprint !== 'object'
    || !fingerprint.descriptor
    || !fingerprint.projection
  ) {
    throw projectionError(
      'REPLAY_FINGERPRINT_MISMATCH', contract,
      'Projection requires a shared derived replay fingerprint',
      'shared-replay-fingerprint', head.sequence,
    );
  }
  const descriptor = fingerprint.descriptor;
  if (
    descriptor.reducer_id !== contract.reducerId
    || descriptor.reducer_version !== contract.reducerVersion
    || fingerprint.projection.reducerVersion !== contract.reducerVersion
  ) {
    throw projectionError(
      'REDUCER_VERSION_MISMATCH', contract,
      'Shared replay fingerprint is bound to a different reducer identity',
      'replay-reducer-identity', head.sequence,
    );
  }

  try {
    const range = events.slice(contract.base.ledgerHead.sequence);
    const orderedHashes = range.map((verified) => verified.frame.record_hash);
    const commitmentBytes = serializeReplayFingerprintDescriptor(descriptor, false);
    const descriptorBytes = serializeReplayFingerprintDescriptor(descriptor, true);
    const projectionDigest = sha256Bytes(canonicalBytes(state));
    const initialStateDigest = sha256Bytes(canonicalBytes(contract.base.state));
    const fingerprintHead = fingerprint.projection.ledgerHead;
    if (
      descriptor.ledger_id !== contract.ledgerId
      || descriptor.range_start_sequence !== contract.base.ledgerHead.sequence + 1
      || descriptor.range_end_sequence !== head.sequence
      || descriptor.event_count !== range.length
      || descriptor.genesis_record_hash !== contract.base.ledgerHead.recordHash
      || descriptor.terminal_head_hash !== head.recordHash
      || !sameStrings(descriptor.ordered_record_hashes, orderedHashes)
      || descriptor.projection_schema_version !== contract.projectionVersion
      || descriptor.replay_input_digests[INITIAL_STATE_REPLAY_INPUT] !== initialStateDigest
      || descriptor.projection_digest !== projectionDigest
      || descriptor.final_digest !== hashReplayFingerprintBytes(commitmentBytes)
      || !Buffer.from(fingerprint.commitmentBytes).equals(Buffer.from(commitmentBytes))
      || !Buffer.from(fingerprint.descriptorBytes).equals(Buffer.from(descriptorBytes))
      || fingerprintHead.ledgerId !== head.ledgerId
      || fingerprintHead.sequence !== head.sequence
      || fingerprintHead.recordHash !== head.recordHash
      || fingerprint.projection.digest !== projectionDigest
      || !Buffer.from(canonicalBytes(fingerprint.projection.state)).equals(
        Buffer.from(canonicalBytes(state)),
      )
    ) {
      throw new Error('shared replay fingerprint binding mismatch');
    }
  } catch (error: unknown) {
    throw projectionError(
      'REPLAY_FINGERPRINT_MISMATCH', contract,
      'Shared replay fingerprint does not bind the exact BASE, ledger range, reducer, and projection',
      'shared-replay-fingerprint-binding', head.sequence,
      { cause: error instanceof Error ? error.message.slice(0, 120) : 'invalid fingerprint' },
    );
  }
}

// ───────────────────────────────────────────────────────────────────
// 4. PURE FOLD
// ───────────────────────────────────────────────────────────────────

/** Fold a verified prefix twice and retain exact legacy bytes only when both runs agree. */
export function foldLegacyProjection<TState extends JsonObject>(
  contract: LegacyProjectionContract<TState>,
  events: readonly VerifiedLedgerEvent[],
  head: LedgerHead,
  replayFingerprint: DerivedReplayFingerprint<TState>,
): FoldedLegacyProjection<TState> {
  assertContract(contract, head);
  assertVerifiedPrefix(events, head, contract);
  assertBase(contract, events, head);
  const firstState = runFold(contract, events);
  const secondState = runFold(contract, events);
  if (!Buffer.from(canonicalBytes(firstState)).equals(Buffer.from(canonicalBytes(secondState)))) {
    throw projectionError(
      'REDUCER_NONDETERMINISTIC', contract,
      'Repeated projection folds produced different semantic state',
      'deterministic-reducer', head.sequence,
    );
  }
  assertReplayFingerprint(contract, events, head, firstState, replayFingerprint);
  const firstBytes = outputBytes(contract.serialize(firstState));
  const repeatedFirstBytes = outputBytes(
    contract.serialize(cloneLegacyState<TState>(firstState)),
  );
  if (!Buffer.from(firstBytes).equals(Buffer.from(repeatedFirstBytes))) {
    throw projectionError(
      'SERIALIZER_NONDETERMINISTIC', contract,
      'Legacy serializer changed bytes for the same folded state',
      'deterministic-legacy-serializer', head.sequence,
    );
  }
  const secondBytes = outputBytes(contract.serialize(secondState));
  if (!Buffer.from(firstBytes).equals(Buffer.from(secondBytes))) {
    throw projectionError(
      'REDUCER_NONDETERMINISTIC', contract,
      'Repeated projection folds changed insertion-ordered legacy bytes',
      'deterministic-legacy-insertion-order', head.sequence,
    );
  }

  return Object.freeze({
    artifactId: contract.artifactId,
    ledgerHead: Object.freeze({ ...head }),
    foldId: contract.foldId,
    projectionVersion: contract.projectionVersion,
    reducerVersion: contract.reducerVersion,
    serializerId: contract.serializerId,
    refreshBoundary: contract.refreshBoundary,
    replayFingerprint: replayFingerprint.descriptor.final_digest,
    state: cloneLegacyState<TState>(firstState),
    bytes: Uint8Array.from(firstBytes),
    digest: sha256Bytes(firstBytes),
  });
}

/** Compute the same raw SHA-256 form used by BASE and parity manifests. */
export function legacyProjectionDigest(bytes: Uint8Array | string): string {
  return sha256Bytes(outputBytes(bytes));
}

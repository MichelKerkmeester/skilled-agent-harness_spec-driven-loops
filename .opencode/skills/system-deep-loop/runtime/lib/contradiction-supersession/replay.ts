// ───────────────────────────────────────────────────────────────────
// MODULE: Contradiction and Supersession Replay
// ───────────────────────────────────────────────────────────────────

import {
  AuthorizedLedgerError,
  TypedReducerRegistry,
} from '../authorized-ledger/index.js';
import {
  canonicalBytes,
  sha256Bytes,
} from '../event-envelope/index.js';
import {
  INITIAL_STATE_REPLAY_INPUT,
  ReplayComponentRegistry,
  ReplayFingerprintError,
  createReplayFingerprintVersionRegistry,
  deriveReplayFingerprint,
} from '../replay-fingerprint/index.js';
import {
  ClaimRelationshipError,
  ClaimRelationshipErrorCodes,
} from './errors.js';
import {
  CLAIM_RELATIONSHIP_PROJECTION_SCHEMA_VERSION,
  CLAIM_RELATIONSHIP_REDUCER_ID,
  CLAIM_RELATIONSHIP_REDUCER_VERSION,
  RelationshipEventTypes,
  normalizeReferenceSnapshot,
} from './event-registry.js';
import {
  createEmptyClaimRelationshipProjection,
  foldVerifiedClaimRelationships,
  reduceClaimRelationshipEnvelope,
} from './projection.js';

import type {
  AppendOnlyLedger,
  TypedReducerDefinition,
} from '../authorized-ledger/index.js';
import type {
  EventTypeRegistry,
  JsonObject,
  JsonValue,
} from '../event-envelope/index.js';
import type {
  DerivedReplayFingerprint,
} from '../replay-fingerprint/index.js';
import type {
  ClaimRelationshipProjection,
  RelationshipReferenceSnapshot,
  RelationshipReplayFailureResult,
  RelationshipReplayResult,
} from './types.js';

// ───────────────────────────────────────────────────────────────────
// 1. REDUCER REGISTRATION
// ───────────────────────────────────────────────────────────────────

export const CLAIM_RELATIONSHIP_REFERENCE_REPLAY_INPUT = 'reference_snapshot';

/** Bind the status fold to one immutable reference snapshot. */
export function createClaimRelationshipReducerRegistry(
  snapshotInput: RelationshipReferenceSnapshot,
): TypedReducerRegistry<ClaimRelationshipProjection> {
  const snapshot = normalizeReferenceSnapshot(snapshotInput);
  const reduce: TypedReducerDefinition<ClaimRelationshipProjection>['reduce'] = (
    state,
    event,
  ) => reduceClaimRelationshipEnvelope(
    state,
    event.effective.envelope,
    event.effective.envelope.stream_sequence,
    snapshot,
  );
  return new TypedReducerRegistry([
    {
      eventType: RelationshipEventTypes.CONTRADICTION_RECORDED,
      reducerVersion: CLAIM_RELATIONSHIP_REDUCER_VERSION,
      reduce,
    },
    {
      eventType: RelationshipEventTypes.SUPERSESSION_RECORDED,
      reducerVersion: CLAIM_RELATIONSHIP_REDUCER_VERSION,
      reduce,
    },
  ]);
}

function asReferenceSnapshot(value: JsonValue): RelationshipReferenceSnapshot {
  if (value === null || Array.isArray(value) || typeof value !== 'object') {
    throw new ClaimRelationshipError(
      ClaimRelationshipErrorCodes.REPLAY_INVALID,
      'Replay reference snapshot is not a JSON object',
    );
  }
  return normalizeReferenceSnapshot(value as RelationshipReferenceSnapshot);
}

/** Register the exact reducer, schema, and content-addressed reference input. */
export function createClaimRelationshipReplayComponentRegistry(
  snapshotInput: RelationshipReferenceSnapshot,
): ReplayComponentRegistry<ClaimRelationshipProjection> {
  const snapshot = normalizeReferenceSnapshot(snapshotInput);
  return new ReplayComponentRegistry([{
    reducerId: CLAIM_RELATIONSHIP_REDUCER_ID,
    reducerVersion: CLAIM_RELATIONSHIP_REDUCER_VERSION,
    projectionSchemaVersion: CLAIM_RELATIONSHIP_PROJECTION_SCHEMA_VERSION,
    requiredReplayInputKeys: [
      INITIAL_STATE_REPLAY_INPUT,
      CLAIM_RELATIONSHIP_REFERENCE_REPLAY_INPUT,
    ],
    reducerRegistry: createClaimRelationshipReducerRegistry(snapshot),
    replayInputSources: {
      [CLAIM_RELATIONSHIP_REFERENCE_REPLAY_INPUT]: {
        kind: 'content-addressed',
        value: snapshot,
      },
    },
    bindReplayInputs: (inputs) => createClaimRelationshipReducerRegistry(
      asReferenceSnapshot(inputs[CLAIM_RELATIONSHIP_REFERENCE_REPLAY_INPUT]),
    ),
  }]);
}

// ───────────────────────────────────────────────────────────────────
// 2. FINGERPRINT DERIVATION
// ───────────────────────────────────────────────────────────────────

export interface DeriveClaimRelationshipReplayInput {
  readonly ledger: AppendOnlyLedger;
  readonly eventRegistry: EventTypeRegistry;
  readonly referenceSnapshot: RelationshipReferenceSnapshot;
  readonly runId: string;
  readonly rangeStartSequence?: number;
  readonly rangeEndSequence?: number;
}

/** Derive a replay fingerprint that commits ledger bytes, authorization, fold, and references. */
export async function deriveClaimRelationshipReplayFingerprint(
  input: DeriveClaimRelationshipReplayInput,
): Promise<DerivedReplayFingerprint<ClaimRelationshipProjection>> {
  const snapshot = normalizeReferenceSnapshot(input.referenceSnapshot);
  const initialState = createEmptyClaimRelationshipProjection(snapshot);
  const head = await input.ledger.getVerifiedHead();
  const rangeStartSequence = input.rangeStartSequence ?? 1;
  const rangeEndSequence = input.rangeEndSequence ?? head.sequence;
  if (rangeStartSequence !== 1 || rangeEndSequence !== head.sequence) {
    throw new ClaimRelationshipError(
      ClaimRelationshipErrorCodes.REPLAY_INVALID,
      'Trusted claim status replay requires the complete relationship history',
      {
        rangeStartSequence,
        rangeEndSequence,
        ledgerHeadSequence: head.sequence,
      },
    );
  }
  return deriveReplayFingerprint({
    ledger: input.ledger,
    eventRegistry: input.eventRegistry,
    versionRegistry: createReplayFingerprintVersionRegistry(),
    componentRegistry: createClaimRelationshipReplayComponentRegistry(snapshot),
    runId: input.runId,
    rangeStartSequence,
    rangeEndSequence,
    replay: {
      reducerId: CLAIM_RELATIONSHIP_REDUCER_ID,
      reducerVersion: CLAIM_RELATIONSHIP_REDUCER_VERSION,
      projectionSchemaVersion: CLAIM_RELATIONSHIP_PROJECTION_SCHEMA_VERSION,
      initialState,
      replayInputDigests: {
        [INITIAL_STATE_REPLAY_INPUT]: sha256Bytes(canonicalBytes(initialState)),
        [CLAIM_RELATIONSHIP_REFERENCE_REPLAY_INPUT]: sha256Bytes(canonicalBytes(snapshot)),
      },
    },
  });
}

// ───────────────────────────────────────────────────────────────────
// 3. FAIL-CLOSED REPLAY
// ───────────────────────────────────────────────────────────────────

export interface ReplayClaimRelationshipsInput
  extends DeriveClaimRelationshipReplayInput {
  readonly expectedFinalDigest?: string;
}

function failureResult(
  code: string,
  message: string,
  sequence: number | null,
  eventId: string | null,
): RelationshipReplayFailureResult {
  return Object.freeze({
    ok: false,
    trusted: false,
    projection: null,
    fingerprint: null,
    failure: Object.freeze({ code, sequence, eventId, message }),
  });
}

/** Replay in stored order and withhold every projection when any relation is undefined. */
export async function replayClaimRelationships(
  input: ReplayClaimRelationshipsInput,
): Promise<RelationshipReplayResult> {
  const snapshot = normalizeReferenceSnapshot(input.referenceSnapshot);
  let events;
  try {
    events = await input.ledger.readVerifiedEvents();
  } catch (error: unknown) {
    const sequence = error instanceof AuthorizedLedgerError
      && typeof error.details.sequence === 'number'
      ? error.details.sequence
      : null;
    return failureResult(
      error instanceof AuthorizedLedgerError ? error.code : ClaimRelationshipErrorCodes.REPLAY_INVALID,
      error instanceof Error ? error.message : 'Ledger verification failed',
      sequence,
      null,
    );
  }
  if (events.length === 0) {
    return failureResult(
      ClaimRelationshipErrorCodes.REPLAY_INVALID,
      'Trusted replay requires at least one durably appended relationship event',
      null,
      null,
    );
  }
  try {
    foldVerifiedClaimRelationships(events, snapshot);
  } catch (error: unknown) {
    if (error instanceof ClaimRelationshipError) {
      let earliestSequence: number | null = null;
      let earliestEventId: string | null = null;
      let state = createEmptyClaimRelationshipProjection(snapshot);
      for (const verified of events) {
        try {
          if (verified.event.effective.envelope.stream_sequence !== verified.frame.sequence) {
            throw new ClaimRelationshipError(
              ClaimRelationshipErrorCodes.REPLAY_INVALID,
              'Relationship stream sequence diverges from durable ledger order',
            );
          }
          state = reduceClaimRelationshipEnvelope(
            state,
            verified.event.effective.envelope,
            verified.frame.sequence,
            snapshot,
          );
        } catch {
          earliestSequence = verified.frame.sequence;
          earliestEventId = verified.event.effective.envelope.event_id;
          break;
        }
      }
      return failureResult(
        error.code,
        error.message,
        earliestSequence,
        earliestEventId,
      );
    }
    return failureResult(
      ClaimRelationshipErrorCodes.REPLAY_INVALID,
      error instanceof Error ? error.message : 'Relationship fold failed',
      null,
      null,
    );
  }
  try {
    const fingerprint = await deriveClaimRelationshipReplayFingerprint(input);
    if (
      input.expectedFinalDigest !== undefined
      && input.expectedFinalDigest !== fingerprint.descriptor.final_digest
    ) {
      return failureResult(
        ClaimRelationshipErrorCodes.FINGERPRINT_MISMATCH,
        'Recomputed relationship fingerprint does not match the expected commitment',
        fingerprint.descriptor.range_end_sequence,
        null,
      );
    }
    return Object.freeze({
      ok: true,
      trusted: true,
      projection: fingerprint.projection.state,
      fingerprint,
    });
  } catch (error: unknown) {
    if (error instanceof ReplayFingerprintError) {
      return failureResult(error.code, error.message, error.sequence, null);
    }
    if (error instanceof ClaimRelationshipError) {
      return failureResult(error.code, error.message, null, null);
    }
    return failureResult(
      ClaimRelationshipErrorCodes.REPLAY_INVALID,
      error instanceof Error ? error.message : 'Fingerprint derivation failed',
      null,
      null,
    );
  }
}

/** Narrow arbitrary JSON to the registered snapshot at replay bindings. */
export function claimRelationshipSnapshotFromJson(
  input: Readonly<JsonObject>,
): RelationshipReferenceSnapshot {
  return normalizeReferenceSnapshot(input as RelationshipReferenceSnapshot);
}

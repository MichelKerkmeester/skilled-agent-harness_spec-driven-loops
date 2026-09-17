// ───────────────────────────────────────────────────────────────────
// MODULE: Continuity Resume and Handover Frontier
// ───────────────────────────────────────────────────────────────────

import {
  INITIAL_STATE_REPLAY_INPUT,
  deriveReplayFingerprint,
} from '../../replay-fingerprint/index.js';
import {
  CONTINUITY_IDENTITY_SCHEMA_VERSION,
  ContinuityIdentityError,
  ContinuityIdentityErrorCodes,
  ContinuityIdentityKinds,
} from './continuity-identity-types.js';
import {
  CONTINUITY_PROJECTION_SCHEMA_VERSION,
  CONTINUITY_REDUCER_ID,
  CONTINUITY_REDUCER_VERSION,
  createContinuityFingerprintVersionRegistry,
  createContinuityReplayComponentRegistry,
  continuityInitialState,
} from './continuity-identity-events.js';
import {
  continuityDigest,
  hasExactFields,
  isHash,
  isPlainRecord,
  requireBoundedId,
  requireRegisteredIdentity,
  validateIdentityRef,
} from './continuity-identity-schema.js';

import type { AppendOnlyLedger } from '../../authorized-ledger/index.js';
import type { EventTypeRegistry, JsonObject } from '../../event-envelope/index.js';
import type {
  DerivedReplayFingerprint,
} from '../../replay-fingerprint/index.js';
import type {
  ContinuityFrontierAttempt,
  ContinuityIdentityFrontier,
  ContinuityIdentityRef,
  ContinuityIdentityState,
} from './continuity-identity-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────────

export interface CreateContinuityFrontierInput {
  readonly fingerprint: DerivedReplayFingerprint<ContinuityIdentityState>;
  readonly modeSessionRef: ContinuityIdentityRef;
  readonly lineageRefs: readonly ContinuityIdentityRef[];
  readonly activeClaimRefs: readonly ContinuityIdentityRef[];
  readonly activeCandidateRefs: readonly ContinuityIdentityRef[];
  readonly attempt: ContinuityFrontierAttempt;
}

export interface RestoredContinuityFrontier {
  readonly frontier: ContinuityIdentityFrontier;
  readonly state: Readonly<ContinuityIdentityState>;
  readonly fingerprint: DerivedReplayFingerprint<ContinuityIdentityState>;
}

// ───────────────────────────────────────────────────────────────────
// 2. REPLAY FINGERPRINT
// ───────────────────────────────────────────────────────────────────

/** Derive replay identity from the complete currently verified ledger prefix. */
export async function deriveContinuityReplayFingerprint(
  ledger: AppendOnlyLedger,
  eventRegistry: EventTypeRegistry,
  runId: string,
): Promise<DerivedReplayFingerprint<ContinuityIdentityState>> {
  const validatedRunId = requireBoundedId(runId, 'runId');
  const head = await ledger.getVerifiedHead();
  if (head.sequence === 0) {
    throw new ContinuityIdentityError(
      ContinuityIdentityErrorCodes.LEDGER_EMPTY,
      'Continuity replay fingerprint requires at least one verified event',
      { ledgerId: ledger.ledgerId },
    );
  }
  const initialState = continuityInitialState();
  return deriveReplayFingerprint({
    ledger,
    eventRegistry,
    versionRegistry: createContinuityFingerprintVersionRegistry(),
    componentRegistry: createContinuityReplayComponentRegistry(),
    runId: validatedRunId,
    rangeStartSequence: 1,
    rangeEndSequence: head.sequence,
    replay: {
      reducerId: CONTINUITY_REDUCER_ID,
      reducerVersion: CONTINUITY_REDUCER_VERSION,
      projectionSchemaVersion: CONTINUITY_PROJECTION_SCHEMA_VERSION,
      initialState,
      replayInputDigests: {
        [INITIAL_STATE_REPLAY_INPUT]: continuityDigest(initialState),
      },
    },
  });
}

// ───────────────────────────────────────────────────────────────────
// 3. FRONTIER CREATION
// ───────────────────────────────────────────────────────────────────

function sortedUniqueRefs(
  state: Readonly<ContinuityIdentityState>,
  refs: readonly ContinuityIdentityRef[],
  kind: ContinuityIdentityRef['kind'],
): ContinuityIdentityRef[] {
  const byId = new Map<string, ContinuityIdentityRef>();
  for (const candidate of refs) {
    const ref = requireRegisteredIdentity(state, candidate, kind);
    byId.set(ref.id, ref);
  }
  return [...byId.values()].sort((left, right) => left.id.localeCompare(right.id));
}

function frontierCore(
  frontier: Omit<ContinuityIdentityFrontier, 'frontier_digest'>,
): JsonObject {
  return frontier as JsonObject;
}

/** Build a canonical frontier whose active references all resolve at one ledger cursor. */
export function createContinuityFrontier(
  input: CreateContinuityFrontierInput,
): ContinuityIdentityFrontier {
  const descriptor = input.fingerprint.descriptor;
  const state = input.fingerprint.projection.state;
  const modeSessionRef = requireRegisteredIdentity(
    state,
    input.modeSessionRef,
    ContinuityIdentityKinds.MODE_SESSION,
  );
  const attempts = state.attempts[modeSessionRef.id] ?? [];
  const attemptId = requireBoundedId(input.attempt.attempt_id, 'attempt.attempt_id');
  if (
    !Number.isSafeInteger(input.attempt.attempt_number)
    || input.attempt.attempt_number <= 0
    || !attempts.some((attempt) => (
      attempt.attempt_id === attemptId
      && attempt.attempt_number === input.attempt.attempt_number
    ))
  ) {
    throw new ContinuityIdentityError(
      ContinuityIdentityErrorCodes.INVALID_FRONTIER,
      'Frontier attempt is absent from the verified mode-session history',
      { identityId: modeSessionRef.id },
    );
  }
  const core: Omit<ContinuityIdentityFrontier, 'frontier_digest'> = {
    schema_version: CONTINUITY_IDENTITY_SCHEMA_VERSION,
    mode_session_ref: modeSessionRef,
    lineage_refs: sortedUniqueRefs(state, input.lineageRefs, ContinuityIdentityKinds.LINEAGE),
    active_claim_refs: sortedUniqueRefs(state, input.activeClaimRefs, ContinuityIdentityKinds.CLAIM),
    active_candidate_refs: sortedUniqueRefs(
      state,
      input.activeCandidateRefs,
      ContinuityIdentityKinds.CANDIDATE,
    ),
    attempt: {
      attempt_id: attemptId,
      attempt_number: input.attempt.attempt_number,
    },
    ledger_cursor: {
      ledger_id: descriptor.ledger_id,
      sequence: descriptor.range_end_sequence,
      record_hash: descriptor.terminal_head_hash,
    },
    replay_fingerprint: {
      fingerprint_version: descriptor.fingerprint_version,
      run_id: descriptor.run_id,
      range_start_sequence: descriptor.range_start_sequence,
      range_end_sequence: descriptor.range_end_sequence,
      event_registry_digest: descriptor.envelope_registry_digest,
      projection_digest: descriptor.projection_digest,
      final_digest: descriptor.final_digest,
    },
  };
  const frontier = {
    ...core,
    frontier_digest: continuityDigest(frontierCore(core)),
  } as unknown as ContinuityIdentityFrontier;
  return Object.freeze(frontier);
}

// ───────────────────────────────────────────────────────────────────
// 4. FRONTIER RESTORATION
// ───────────────────────────────────────────────────────────────────

function validateFrontierShape(input: unknown): ContinuityIdentityFrontier {
  if (!isPlainRecord(input) || !hasExactFields(input, [
    'schema_version',
    'mode_session_ref',
    'lineage_refs',
    'active_claim_refs',
    'active_candidate_refs',
    'attempt',
    'ledger_cursor',
    'replay_fingerprint',
    'frontier_digest',
  ])) {
    throw new ContinuityIdentityError(
      ContinuityIdentityErrorCodes.INVALID_FRONTIER,
      'Resume frontier does not match the closed schema',
    );
  }
  if (
    input.schema_version !== CONTINUITY_IDENTITY_SCHEMA_VERSION
    || !Array.isArray(input.lineage_refs)
    || !Array.isArray(input.active_claim_refs)
    || !Array.isArray(input.active_candidate_refs)
    || !isPlainRecord(input.attempt)
    || !hasExactFields(input.attempt, ['attempt_id', 'attempt_number'])
    || !isPlainRecord(input.ledger_cursor)
    || !hasExactFields(input.ledger_cursor, ['ledger_id', 'sequence', 'record_hash'])
    || !isPlainRecord(input.replay_fingerprint)
    || !hasExactFields(input.replay_fingerprint, [
      'fingerprint_version',
      'run_id',
      'range_start_sequence',
      'range_end_sequence',
      'event_registry_digest',
      'projection_digest',
      'final_digest',
    ])
    || !isHash(input.frontier_digest)
  ) {
    throw new ContinuityIdentityError(
      ContinuityIdentityErrorCodes.INVALID_FRONTIER,
      'Resume frontier contains malformed version, cursor, attempt, or replay fields',
    );
  }
  const candidate = input as unknown as ContinuityIdentityFrontier;
  const { frontier_digest: ignored, ...core } = candidate;
  void ignored;
  if (continuityDigest(frontierCore(core)) !== candidate.frontier_digest) {
    throw new ContinuityIdentityError(
      ContinuityIdentityErrorCodes.INVALID_FRONTIER,
      'Resume frontier digest does not match its canonical fields',
    );
  }
  validateIdentityRef(candidate.mode_session_ref, ContinuityIdentityKinds.MODE_SESSION);
  candidate.lineage_refs.forEach((ref) => validateIdentityRef(ref, ContinuityIdentityKinds.LINEAGE));
  candidate.active_claim_refs.forEach((ref) => validateIdentityRef(ref, ContinuityIdentityKinds.CLAIM));
  candidate.active_candidate_refs.forEach(
    (ref) => validateIdentityRef(ref, ContinuityIdentityKinds.CANDIDATE),
  );
  return candidate;
}

/** Resolve a frontier against the exact current ledger before dispatch may begin. */
export async function restoreContinuityFrontier(
  input: unknown,
  ledger: AppendOnlyLedger,
  eventRegistry: EventTypeRegistry,
): Promise<RestoredContinuityFrontier> {
  const frontier = validateFrontierShape(input);
  const head = await ledger.getVerifiedHead();
  if (
    head.ledgerId !== frontier.ledger_cursor.ledger_id
    || head.sequence !== frontier.ledger_cursor.sequence
    || head.recordHash !== frontier.ledger_cursor.record_hash
    || frontier.replay_fingerprint.range_end_sequence !== head.sequence
  ) {
    throw new ContinuityIdentityError(
      ContinuityIdentityErrorCodes.STALE_FRONTIER,
      'Resume frontier cursor is missing, stale, or bound to another ledger',
      { ledgerId: ledger.ledgerId },
    );
  }
  const fingerprint = await deriveContinuityReplayFingerprint(
    ledger,
    eventRegistry,
    frontier.replay_fingerprint.run_id,
  );
  const descriptor = fingerprint.descriptor;
  if (
    descriptor.fingerprint_version !== frontier.replay_fingerprint.fingerprint_version
    || descriptor.range_start_sequence !== frontier.replay_fingerprint.range_start_sequence
    || descriptor.range_end_sequence !== frontier.replay_fingerprint.range_end_sequence
    || descriptor.envelope_registry_digest !== frontier.replay_fingerprint.event_registry_digest
    || descriptor.projection_digest !== frontier.replay_fingerprint.projection_digest
    || descriptor.final_digest !== frontier.replay_fingerprint.final_digest
  ) {
    throw new ContinuityIdentityError(
      ContinuityIdentityErrorCodes.REPLAY_MISMATCH,
      'Resume frontier replay fingerprint does not match verified ledger reconstruction',
      { ledgerId: ledger.ledgerId },
    );
  }
  const state = fingerprint.projection.state;
  requireRegisteredIdentity(
    state,
    frontier.mode_session_ref,
    ContinuityIdentityKinds.MODE_SESSION,
  );
  frontier.lineage_refs.forEach(
    (ref) => requireRegisteredIdentity(state, ref, ContinuityIdentityKinds.LINEAGE),
  );
  frontier.active_claim_refs.forEach(
    (ref) => requireRegisteredIdentity(state, ref, ContinuityIdentityKinds.CLAIM),
  );
  frontier.active_candidate_refs.forEach(
    (ref) => requireRegisteredIdentity(state, ref, ContinuityIdentityKinds.CANDIDATE),
  );
  const attempts = state.attempts[frontier.mode_session_ref.id] ?? [];
  if (!attempts.some((attempt) => (
    attempt.attempt_id === frontier.attempt.attempt_id
    && attempt.attempt_number === frontier.attempt.attempt_number
  ))) {
    throw new ContinuityIdentityError(
      ContinuityIdentityErrorCodes.INVALID_FRONTIER,
      'Resume frontier attempt is not present in verified history',
    );
  }
  return Object.freeze({ frontier, state, fingerprint });
}

// ───────────────────────────────────────────────────────────────────
// 5. DOWNSTREAM SUBJECT CONTRACT
// ───────────────────────────────────────────────────────────────────

/** Validate identity-bearing domain payload references before a consumer acts. */
export function validateIdentityBearingDomainPayload(
  payload: Readonly<JsonObject>,
  state: Readonly<ContinuityIdentityState>,
): readonly ContinuityIdentityRef[] {
  if (!Object.prototype.hasOwnProperty.call(payload, 'subject_ref')) {
    throw new ContinuityIdentityError(
      ContinuityIdentityErrorCodes.INVALID_IDENTITY,
      'Identity-bearing domain payload requires a typed subject_ref',
    );
  }
  const refs = [requireRegisteredIdentity(state, payload.subject_ref)];
  if (payload.lineage_ref !== undefined) {
    refs.push(requireRegisteredIdentity(
      state,
      payload.lineage_ref,
      ContinuityIdentityKinds.LINEAGE,
    ));
  }
  if (payload.mode_session_ref !== undefined) {
    refs.push(requireRegisteredIdentity(
      state,
      payload.mode_session_ref,
      ContinuityIdentityKinds.MODE_SESSION,
    ));
  }
  return Object.freeze(refs);
}

// ───────────────────────────────────────────────────────────────────
// MODULE: Blinded Adjudication Replay
// ───────────────────────────────────────────────────────────────────

import {
  TypedReducerRegistry,
} from '../authorized-ledger/index.js';
import {
  canonicalBytes,
  canonicalJson,
  sha256Bytes,
} from '../event-envelope/index.js';
import {
  ReplayComponentRegistry,
  createReplayFingerprintVersionRegistry,
  deriveReplayFingerprint,
} from '../replay-fingerprint/index.js';
import {
  ADJUDICATION_PROJECTION_SCHEMA_VERSION,
  ADJUDICATION_REDUCER_VERSION,
  AdjudicationError,
  AdjudicationErrorCodes,
} from './contracts.js';
import {
  AdjudicationEventTypes,
} from './event-registry.js';
import { reductionEventData } from './event-data.js';
import { reduceAdjudication } from './reducer.js';
import {
  isPlainRecord,
  validateAdjudicationRequest,
  validateJudgeProfile,
} from './validation.js';

import type {
  AppendOnlyLedger,
  VerifiedLedgerEvent,
} from '../authorized-ledger/index.js';
import type {
  EventReadResult,
  EventTypeRegistry,
  JsonObject,
} from '../event-envelope/index.js';
import type {
  DerivedReplayFingerprint,
  ReplayExecutionInput,
} from '../replay-fingerprint/index.js';
import type {
  AdjudicationReduction,
  AdjudicationRequest,
  CounterfactualResult,
  JudgeProfile,
  RawJudgment,
} from './contracts.js';
import type {
  AdjudicationEventPayload,
  AdjudicationEventType,
} from './event-registry.js';

// ───────────────────────────────────────────────────────────────────
// 1. REPLAY PROJECTION
// ───────────────────────────────────────────────────────────────────

export interface AdjudicationReplayProjection extends JsonObject {
  orderedEvidenceIds: string[];
  eventCounts: Record<string, number>;
  verdictStatusByAdjudication: Record<string, string>;
  invalidatedEvidenceIds: string[];
}

export const EMPTY_ADJUDICATION_REPLAY_PROJECTION: AdjudicationReplayProjection = Object.freeze({
  orderedEvidenceIds: Object.freeze([]) as unknown as string[],
  eventCounts: Object.freeze({}),
  verdictStatusByAdjudication: Object.freeze({}),
  invalidatedEvidenceIds: Object.freeze([]) as unknown as string[],
});

function reduceReplayProjection(
  state: Readonly<AdjudicationReplayProjection>,
  event: Readonly<EventReadResult>,
): AdjudicationReplayProjection {
  const envelope = event.effective.envelope;
  const payload = envelope.payload as AdjudicationEventPayload;
  const eventCounts = {
    ...state.eventCounts,
    [envelope.event_type]: (state.eventCounts[envelope.event_type] ?? 0) + 1,
  };
  const verdictStatusByAdjudication = { ...state.verdictStatusByAdjudication };
  const invalidatedEvidenceIds = [...state.invalidatedEvidenceIds];
  if (envelope.event_type === AdjudicationEventTypes.VERDICT_RECORDED) {
    verdictStatusByAdjudication[payload.adjudication_id] = String(payload.data.status);
  }
  if (envelope.event_type === AdjudicationEventTypes.VERDICT_INVALIDATED) {
    invalidatedEvidenceIds.push(String(payload.data.invalidated_evidence_id));
  }
  return {
    orderedEvidenceIds: [...state.orderedEvidenceIds, payload.evidence_id],
    eventCounts,
    verdictStatusByAdjudication,
    invalidatedEvidenceIds,
  };
}

/** Create exact-version reducers for every registered adjudication event. */
export function createAdjudicationReducerRegistry(): TypedReducerRegistry<AdjudicationReplayProjection> {
  return new TypedReducerRegistry(
    Object.values(AdjudicationEventTypes).map((eventType) => ({
      eventType,
      reducerVersion: ADJUDICATION_REDUCER_VERSION,
      reduce: reduceReplayProjection,
    })),
  );
}

/** Bind the adjudication reducer and schema to the shared fingerprint registry. */
export function createAdjudicationReplayComponentRegistry():
ReplayComponentRegistry<AdjudicationReplayProjection> {
  return new ReplayComponentRegistry([{
    reducerId: 'blinded-adjudication',
    reducerVersion: ADJUDICATION_REDUCER_VERSION,
    projectionSchemaVersion: ADJUDICATION_PROJECTION_SCHEMA_VERSION,
    requiredReplayInputKeys: ['initial_state'],
    reducerRegistry: createAdjudicationReducerRegistry(),
  }]);
}

/** Create the exact replay input whose initial state digest is independently checked. */
export function createAdjudicationReplayInput(): ReplayExecutionInput<AdjudicationReplayProjection> {
  return Object.freeze({
    reducerId: 'blinded-adjudication',
    reducerVersion: ADJUDICATION_REDUCER_VERSION,
    projectionSchemaVersion: ADJUDICATION_PROJECTION_SCHEMA_VERSION,
    initialState: EMPTY_ADJUDICATION_REPLAY_PROJECTION,
    replayInputDigests: Object.freeze({
      initial_state: sha256Bytes(canonicalBytes(EMPTY_ADJUDICATION_REPLAY_PROJECTION)),
    }),
  });
}

/** Derive shared replay-fingerprint evidence over a closed adjudication ledger range. */
export async function deriveAdjudicationReplayFingerprint(
  ledger: AppendOnlyLedger,
  eventRegistry: EventTypeRegistry,
  runId: string,
  rangeStartSequence = 1,
  rangeEndSequence?: number,
): Promise<DerivedReplayFingerprint<AdjudicationReplayProjection>> {
  const head = await ledger.getVerifiedHead();
  return deriveReplayFingerprint({
    ledger,
    eventRegistry,
    versionRegistry: createReplayFingerprintVersionRegistry(),
    componentRegistry: createAdjudicationReplayComponentRegistry(),
    runId,
    rangeStartSequence,
    rangeEndSequence: rangeEndSequence ?? head.sequence,
    replay: createAdjudicationReplayInput(),
  });
}

// ───────────────────────────────────────────────────────────────────
// 2. TYPED READER
// ───────────────────────────────────────────────────────────────────

export interface TypedAdjudicationEvent {
  readonly sequence: number;
  readonly eventType: AdjudicationEventType;
  readonly payload: AdjudicationEventPayload;
}

/** Read adjudication events only after ledger and envelope verification. */
export async function readAdjudicationEvents(
  ledger: AppendOnlyLedger,
): Promise<readonly TypedAdjudicationEvent[]> {
  const events = await ledger.readVerifiedEvents();
  return Object.freeze(events.map((verified) => typedEvent(verified)));
}

function typedEvent(verified: VerifiedLedgerEvent): TypedAdjudicationEvent {
  const eventType = verified.event.effective.envelope.event_type;
  if (!Object.values(AdjudicationEventTypes).includes(eventType as AdjudicationEventType)) {
    throw new AdjudicationError(
      AdjudicationErrorCodes.REPLAY_MISMATCH,
      'Verified ledger contains a non-adjudication event',
      { eventType },
    );
  }
  return Object.freeze({
    sequence: verified.frame.sequence,
    eventType: eventType as AdjudicationEventType,
    payload: verified.event.effective.envelope.payload as AdjudicationEventPayload,
  });
}

// ───────────────────────────────────────────────────────────────────
// 3. VERDICT REPLAY
// ───────────────────────────────────────────────────────────────────

function rawJudgmentFromPayload(payload: AdjudicationEventPayload): RawJudgment {
  const data = payload.data;
  const candidateDigests = data.candidate_digests as string[];
  return Object.freeze({
    judgmentId: String(data.judgment_id),
    adjudicationId: payload.adjudication_id,
    assignmentId: String(data.assignment_id),
    pairId: String(data.pair_id),
    judgeAssignmentId: String(payload.judge_assignment_id),
    judgeId: String(data.judge_id),
    order: data.order as RawJudgment['order'],
    counterfactualKind: data.counterfactual_kind as RawJudgment['counterfactualKind'],
    baselineAssignmentId: data.baseline_assignment_id as string | null,
    candidateDigests: [candidateDigests[0], candidateDigests[1]] as [string, string],
    outcome: data.outcome as RawJudgment['outcome'],
    preferredCandidateDigest: data.preferred_candidate_digest as string | null,
    rationale: String(data.rationale),
    evidenceLocators: Object.freeze([...(data.evidence_locators as string[])]),
    uncertainty: Number(data.uncertainty),
    hardVeto: Boolean(data.hard_veto),
    evidenceId: payload.evidence_id,
  });
}

function counterfactualFromPayload(payload: AdjudicationEventPayload): CounterfactualResult {
  const data = payload.data;
  return Object.freeze({
    probeId: String(data.probe_id),
    adjudicationId: payload.adjudication_id,
    pairId: String(data.pair_id),
    kind: data.kind as CounterfactualResult['kind'],
    baselineJudgmentId: String(data.baseline_judgment_id),
    interventionJudgmentId: String(data.intervention_judgment_id),
    outcome: data.outcome as CounterfactualResult['outcome'],
    evidenceId: payload.evidence_id,
  });
}

function requestFromEvent(event: TypedAdjudicationEvent): AdjudicationRequest {
  const request = event.payload.data.request;
  return validateAdjudicationRequest(request);
}

function profileFromEvent(event: TypedAdjudicationEvent): JudgeProfile {
  const profile = event.payload.data.judge_profile;
  return validateJudgeProfile(profile);
}

/** Recompute reduction from ordered raw events and compare recorded reduction bytes. */
export async function verifyAdjudicationVerdictReplay(
  ledger: AppendOnlyLedger,
  adjudicationId: string,
): Promise<AdjudicationReduction> {
  const events = (await readAdjudicationEvents(ledger))
    .filter((event) => event.payload.adjudication_id === adjudicationId);
  const requestEvents = events.filter((event) =>
    event.eventType === AdjudicationEventTypes.REQUEST_ACCEPTED);
  if (requestEvents.length !== 1) {
    throw new AdjudicationError(
      AdjudicationErrorCodes.REPLAY_MISMATCH,
      'Replay requires exactly one accepted request event',
    );
  }
  const request = requestFromEvent(requestEvents[0]);
  const scoreEvents = events.filter((event) =>
    event.eventType === AdjudicationEventTypes.SCORE_RECORDED);
  const judgments = scoreEvents.map((event) => rawJudgmentFromPayload(event.payload));
  const profilesById = new Map<string, JudgeProfile>();
  scoreEvents.forEach((event) => {
    const profile = profileFromEvent(event);
    const existing = profilesById.get(profile.judgeId);
    if (existing && canonicalJson(existing as unknown as JsonObject)
      !== canonicalJson(profile as unknown as JsonObject)) {
      throw new AdjudicationError(
        AdjudicationErrorCodes.REPLAY_MISMATCH,
        'Judge independence metadata changed within one adjudication',
      );
    }
    profilesById.set(profile.judgeId, profile);
  });
  const counterfactuals = events
    .filter((event) => event.eventType === AdjudicationEventTypes.COUNTERFACTUAL_EVALUATED)
    .map((event) => counterfactualFromPayload(event.payload));
  const computed = reduceAdjudication(
    adjudicationId,
    request,
    judgments,
    counterfactuals,
    Array.from(profilesById.values()),
  );
  const reductionEvents = events.filter((event) =>
    event.eventType === AdjudicationEventTypes.REDUCTION_COMPLETED);
  const verdictEvents = events.filter((event) =>
    event.eventType === AdjudicationEventTypes.VERDICT_RECORDED);
  if (reductionEvents.length !== 1 || verdictEvents.length !== 1) {
    throw new AdjudicationError(
      AdjudicationErrorCodes.REPLAY_MISMATCH,
      'Replay requires exactly one reduction and one verdict event',
    );
  }
  const recordedReduction = reductionEvents[0].payload.data;
  if (canonicalJson(recordedReduction) !== canonicalJson(reductionEventData(computed))) {
    throw new AdjudicationError(
      AdjudicationErrorCodes.REPLAY_MISMATCH,
      'Recorded reduction does not match raw-event replay',
    );
  }
  const verdict = verdictEvents[0].payload.data;
  if (
    verdict.status !== computed.status
    || verdict.preferred_candidate_digest !== computed.preferredCandidateDigest
    || verdict.reduction_evidence_id !== reductionEvents[0].payload.evidence_id
  ) {
    throw new AdjudicationError(
      AdjudicationErrorCodes.REPLAY_MISMATCH,
      'Recorded verdict does not match the replayed reduction',
    );
  }
  return computed;
}

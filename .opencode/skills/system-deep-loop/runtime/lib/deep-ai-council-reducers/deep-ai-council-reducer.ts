// ───────────────────────────────────────────────────────────────────
// MODULE: Deep AI Council Reducer
// ───────────────────────────────────────────────────────────────────

import {
  DeepAiCouncilEventStems,
  DeepAiCouncilWireEventTypes,
  createDeepAiCouncilEventRegistry,
  isDeepAiCouncilEventStem,
} from '../deep-ai-council-ledger-schema/index.js';
import {
  canonicalBytes,
  canonicalJson,
  readEvent,
  sha256Bytes,
} from '../event-envelope/index.js';
import {
  DeepAiCouncilReducerError,
  assertDeepAiCouncilLegacyProjection,
  assertDeepAiCouncilProjectionState,
  immutableProjectionClone,
  isDeepFrozenProjection,
} from './deep-ai-council-projection-schema.js';

import type { VerifiedLedgerEvent } from '../authorized-ledger/index.js';
import type {
  DeepAiCouncilEventEnvelope,
  DeepAiCouncilEventStem,
  DeepAiCouncilLedgerEvent,
  DeepAiCouncilLedgerPayload,
} from '../deep-ai-council-ledger-schema/index.js';
import type { JsonObject } from '../event-envelope/index.js';
import type {
  ModeContract,
  ModeReducerSet,
  ModeReductionResult,
} from '../mode-contracts/index.js';
import type {
  DeepAiCouncilAdjudicationRecord,
  DeepAiCouncilArtifactRecord,
  DeepAiCouncilArtifactsProjection,
  DeepAiCouncilBlindedAdjudicationProjection,
  DeepAiCouncilConvergenceProjection,
  DeepAiCouncilCritiqueProjection,
  DeepAiCouncilFoldOptions,
  DeepAiCouncilFoldResult,
  DeepAiCouncilLegacyProjection,
  DeepAiCouncilModeStatus,
  DeepAiCouncilPersistedField,
  DeepAiCouncilProposalRecord,
  DeepAiCouncilProjectedResult,
  DeepAiCouncilProjectionCheckpoint,
  DeepAiCouncilProjectionFieldOwnership,
  DeepAiCouncilProjectionState,
  DeepAiCouncilRebuildReasonCode,
  DeepAiCouncilRunProjection,
  DeepAiCouncilSeenEvent,
  DeepAiCouncilSeatsProjection,
  DeepAiCouncilStatusProjection,
  DeepAiCouncilStatusTransition,
  DeepAiCouncilTestGateProjection,
} from './deep-ai-council-projection-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. PUBLIC CONTRACT CONSTANTS
// ───────────────────────────────────────────────────────────────────

export const DEEP_AI_COUNCIL_PROJECTION_SCHEMA_VERSION =
  'deep-ai-council-projection@1' as const;
export const DEEP_AI_COUNCIL_REDUCER_VERSION = 'deep-ai-council-reducer@1' as const;
export const DEEP_AI_COUNCIL_PROJECTION_CODEC_VERSION = 'canonical-json@1' as const;
export const DEEP_AI_COUNCIL_ORDERING_POLICY_VERSION =
  'strict-ledger-order@1' as const;
export const DEEP_AI_COUNCIL_REDUCER_ID =
  'deep-ai-council:projection-fold' as const;

const ZERO_DIGEST = '0'.repeat(64);
const eventRegistry = createDeepAiCouncilEventRegistry();
type DeepAiCouncilModeContractState = DeepAiCouncilProjectionState & JsonObject;

const PERSISTED_FIELDS = Object.freeze([
  'schemaVersion',
  'reducerVersion',
  'codecVersion',
  'orderingPolicyVersion',
  'run',
  'councilSeats',
  'critique',
  'blindedAdjudication',
  'convergence',
  'artifacts',
  'testGate',
  'status',
  'cursors',
  'seenEvents',
] as const satisfies readonly DeepAiCouncilPersistedField[]);

type ProjectionPlane =
  | 'councilSeats'
  | 'critique'
  | 'blindedAdjudication'
  | 'convergence'
  | 'artifacts'
  | 'testGate'
  | 'status';

export const DEEP_AI_COUNCIL_EVENT_ROUTING = Object.freeze({
  'ai_council.run_initialized': Object.freeze(['status']),
  'ai_council.run_resumed': Object.freeze(['status']),
  'ai_council.run_restarted': Object.freeze(['status']),
  'ai_council.round_started': Object.freeze(['councilSeats', 'status']),
  'ai_council.seat_selected': Object.freeze(['councilSeats', 'status']),
  'ai_council.seat_dispatched': Object.freeze(['councilSeats', 'status']),
  'ai_council.proposal_observed': Object.freeze(['councilSeats', 'status']),
  'ai_council.seat_returned': Object.freeze(['councilSeats', 'status']),
  'ai_council.critique_round_started': Object.freeze(['critique', 'status']),
  'ai_council.critique_recorded': Object.freeze(['critique', 'status']),
  'ai_council.candidate_blinded': Object.freeze(['blindedAdjudication', 'status']),
  'ai_council.pairwise_judgment_recorded': Object.freeze([
    'blindedAdjudication', 'status',
  ]),
  'ai_council.bias_audit_recorded': Object.freeze(['blindedAdjudication', 'status']),
  'ai_council.adjudication_decision': Object.freeze([
    'blindedAdjudication', 'convergence', 'status',
  ]),
  'ai_council.stance_recorded': Object.freeze(['convergence', 'status']),
  'ai_council.stance_flipped': Object.freeze(['convergence', 'status']),
  'ai_council.deliberation_synthesized': Object.freeze(['convergence', 'status']),
  'ai_council.convergence_evaluated': Object.freeze(['convergence', 'status']),
  'ai_council.convergence_blocked': Object.freeze(['convergence', 'status']),
  'ai_council.round_ended': Object.freeze(['convergence', 'status']),
  'ai_council.artifact_committed': Object.freeze(['artifacts', 'status']),
  'ai_council.artifact_superseded': Object.freeze(['artifacts', 'status']),
  'ai_council.council_test_gate_evaluated': Object.freeze([
    'testGate', 'convergence', 'status',
  ]),
  'ai_council.rollback_recorded': Object.freeze(['status']),
  'ai_council.council_complete': Object.freeze(['status']),
} as const satisfies Readonly<
  Record<DeepAiCouncilEventStem, readonly ProjectionPlane[]>
>);

function stemsForPlane(plane: ProjectionPlane): readonly DeepAiCouncilEventStem[] {
  return Object.freeze(DeepAiCouncilEventStems.filter((stem) => (
    DEEP_AI_COUNCIL_EVENT_ROUTING[stem].includes(plane as never)
  )));
}

export const DEEP_AI_COUNCIL_PROJECTION_FIELD_OWNERSHIP = Object.freeze(
  PERSISTED_FIELDS.map((field): DeepAiCouncilProjectionFieldOwnership => ({
    field,
    ownerReducerId: DEEP_AI_COUNCIL_REDUCER_ID,
    inputStems: field === 'schemaVersion'
      || field === 'reducerVersion'
      || field === 'codecVersion'
      || field === 'orderingPolicyVersion'
      ? Object.freeze([])
      : field === 'run' || field === 'cursors' || field === 'seenEvents'
        ? DeepAiCouncilEventStems
        : stemsForPlane(field),
    foldAlgebra: field === 'schemaVersion'
      || field === 'reducerVersion'
      || field === 'codecVersion'
      || field === 'orderingPolicyVersion'
      ? 'constant'
      : field === 'seenEvents'
        ? 'insert-sorted'
        : 'insert-sorted-and-derive',
    immutableOutput: true,
  })),
);

export const DEEP_AI_COUNCIL_REDUCER_SET:
ModeReducerSet<DeepAiCouncilModeContractState> = Object.freeze({
  persistedFields: PERSISTED_FIELDS,
  definitions: Object.freeze([Object.freeze({
    reducerId: DEEP_AI_COUNCIL_REDUCER_ID,
    reducerVersion: DEEP_AI_COUNCIL_REDUCER_VERSION,
    stateVersion: DEEP_AI_COUNCIL_PROJECTION_SCHEMA_VERSION,
    ownedFields: PERSISTED_FIELDS,
    inputEventTypes: Object.freeze(
      DeepAiCouncilEventStems.map((stem) => DeepAiCouncilWireEventTypes[stem]),
    ),
    replaySource: 'verified-ledger-events-only',
    outputRule: 'immutable',
  })]),
});

// ───────────────────────────────────────────────────────────────────
// 2. GENERAL HELPERS
// ───────────────────────────────────────────────────────────────────

function compareString(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function compareNumber(left: number, right: number): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function sortStrings(values: readonly string[]): string[] {
  return [...new Set(values)].sort(compareString);
}

function sameCanonical(left: unknown, right: unknown): boolean {
  return canonicalJson(left) === canonicalJson(right);
}

function eventDigest(event: DeepAiCouncilLedgerEvent): string {
  return sha256Bytes(canonicalBytes(event));
}

function payloadFor<TStem extends DeepAiCouncilEventStem>(
  event: DeepAiCouncilLedgerEvent,
  stem: TStem,
): DeepAiCouncilLedgerPayload<TStem> {
  if (event.payload.stem !== stem) {
    throw new DeepAiCouncilReducerError(
      'event-not-deep-ai-council',
      `Expected ${stem}, received ${event.payload.stem}`,
      'payload.stem',
    );
  }
  return event.payload as DeepAiCouncilLedgerPayload<TStem>;
}

function assertNeverStem(stem: never): never {
  throw new DeepAiCouncilReducerError(
    'event-not-deep-ai-council',
    `Unhandled Deep AI Council event stem: ${String(stem)}`,
    'payload.stem',
  );
}

function validateTypedEvent(event: DeepAiCouncilLedgerEvent): DeepAiCouncilLedgerEvent {
  try {
    const read = readEvent(canonicalBytes(event), eventRegistry);
    const effective = read.effective.envelope;
    const payload = effective.payload;
    if (!isDeepAiCouncilEventStem(payload.stem)
      || effective.event_type !== DeepAiCouncilWireEventTypes[payload.stem]) {
      throw new DeepAiCouncilReducerError(
        'event-not-deep-ai-council',
        'Verified event does not carry a registered Deep AI Council stem',
        'event_type',
      );
    }
    return effective as DeepAiCouncilLedgerEvent;
  } catch (error: unknown) {
    if (error instanceof DeepAiCouncilReducerError) throw error;
    throw new DeepAiCouncilReducerError(
      'event-schema-invalid',
      'Deep AI Council event failed the landed typed-ledger registry',
      'event',
    );
  }
}

function typedEventFromVerified(verified: VerifiedLedgerEvent): DeepAiCouncilLedgerEvent {
  const envelope = verified.event.effective.envelope;
  const payload = envelope.payload;
  if (!isDeepAiCouncilEventStem(payload.stem)
    || envelope.event_type !== DeepAiCouncilWireEventTypes[payload.stem]) {
    throw new DeepAiCouncilReducerError(
      'event-not-deep-ai-council',
      'Mode reducer received a verified event outside the council union',
      'event_type',
    );
  }
  return validateTypedEvent(envelope as DeepAiCouncilLedgerEvent);
}

function asModeContractState(
  state: DeepAiCouncilProjectionState,
): DeepAiCouncilModeContractState {
  assertDeepAiCouncilProjectionState(state);
  return state as DeepAiCouncilModeContractState;
}

function topLevelChangedFields(
  before: DeepAiCouncilProjectionState,
  after: DeepAiCouncilProjectionState,
): DeepAiCouncilPersistedField[] {
  return PERSISTED_FIELDS.filter((field) => !sameCanonical(before[field], after[field]));
}

function insertUnique<T>(
  values: readonly T[],
  candidate: T,
  identity: (value: T) => string,
  field: string,
): T[] {
  const key = identity(candidate);
  const existing = values.find((value) => identity(value) === key);
  if (existing !== undefined && !sameCanonical(existing, candidate)) {
    throw new DeepAiCouncilReducerError(
      'projection-field-invalid',
      `Stable identity ${key} cannot resolve to conflicting projection data`,
      field,
    );
  }
  return existing === undefined ? [...values, candidate] : [...values];
}

function assertRunIdentity(
  run: DeepAiCouncilRunProjection,
  event: DeepAiCouncilLedgerEvent,
): void {
  if (run.runId === null && event.payload.stem !== 'ai_council.run_initialized') {
    throw new DeepAiCouncilReducerError(
      'run-not-initialized',
      'Run initialization must precede every council event',
      'run',
    );
  }
  if (run.runId !== null && run.runId !== event.payload.scope.runId) {
    throw new DeepAiCouncilReducerError(
      'run-identity-conflict',
      'One projection cannot fold events from different council runs',
      'run.runId',
    );
  }
}

// ───────────────────────────────────────────────────────────────────
// 3. INITIAL STATE
// ───────────────────────────────────────────────────────────────────

/** Create the immutable empty state accepted by the shared mode reducer contract. */
export function createDeepAiCouncilProjectionState(): DeepAiCouncilProjectionState {
  const state: DeepAiCouncilProjectionState = {
    schemaVersion: DEEP_AI_COUNCIL_PROJECTION_SCHEMA_VERSION,
    reducerVersion: DEEP_AI_COUNCIL_REDUCER_VERSION,
    codecVersion: DEEP_AI_COUNCIL_PROJECTION_CODEC_VERSION,
    orderingPolicyVersion: DEEP_AI_COUNCIL_ORDERING_POLICY_VERSION,
    run: {
      runId: null,
      roundId: null,
      generation: 0,
      target: null,
      targetDigest: null,
      configDigest: null,
      strategyDigest: null,
      convergencePolicyDigest: null,
      testGatePolicyDigest: null,
      maxRounds: 0,
      minSeatCount: 0,
      maxSeatCount: 0,
      planningOnly: true,
      initialReplayFingerprint: null,
      initializationEventId: null,
    },
    councilSeats: { rounds: [], seats: [], proposals: [] },
    critique: { rounds: [], critiques: [] },
    blindedAdjudication: {
      candidates: [],
      judgments: [],
      biasAudits: [],
      decisions: [],
    },
    convergence: {
      stances: [],
      deliberations: [],
      evaluations: [],
      outcome: 'active',
      eligible: false,
      blockerIds: [],
      hardVetoRefs: [],
      rawAgreement: 0,
      calibratedSupport: 0,
      effectiveSeatCount: 0,
      presentation: {
        kind: 'factual-posterior',
        selectedCandidateId: null,
        rawProposalEventIds: [],
        rawJudgmentEventIds: [],
        adjudicationEventIds: [],
        minorityRefs: [],
        contradictionRefs: [],
        vetoFindingRefs: [],
        unresolvedValueRefs: [],
        reopenConditionRefs: [],
      },
    },
    artifacts: { records: [] },
    testGate: { evaluations: [], verdict: 'unknown' },
    status: {
      state: 'planned',
      terminal: false,
      projectionHealth: 'healthy',
      admission: 'pending',
      shadowParity: 'not-run',
      modeGate: 'off',
      blockingReason: null,
      provenance: [],
    },
    cursors: {
      councilSeats: 0,
      critique: 0,
      blindedAdjudication: 0,
      convergence: 0,
      artifacts: 0,
      testGate: 0,
      status: 0,
    },
    seenEvents: [],
  };
  assertDeepAiCouncilProjectionState(state);
  return immutableProjectionClone(state) as DeepAiCouncilProjectionState;
}

// ───────────────────────────────────────────────────────────────────
// 4. RUN, SEAT, AND CRITIQUE FOLDS
// ───────────────────────────────────────────────────────────────────

function foldRun(
  run: DeepAiCouncilRunProjection,
  event: DeepAiCouncilLedgerEvent,
): DeepAiCouncilRunProjection {
  switch (event.payload.stem) {
    case 'ai_council.run_initialized': {
      const payload = payloadFor(event, 'ai_council.run_initialized');
      if (run.initializationEventId !== null && run.initializationEventId !== event.event_id) {
        throw new DeepAiCouncilReducerError(
          'duplicate-terminal-event',
          'A projection accepts exactly one run initialization',
          'run.initializationEventId',
        );
      }
      return {
        runId: payload.scope.runId,
        roundId: payload.scope.roundId,
        generation: 1,
        target: payload.data.target,
        targetDigest: payload.data.targetDigest,
        configDigest: payload.data.configDigest,
        strategyDigest: payload.data.strategyDigest,
        convergencePolicyDigest: payload.data.convergencePolicyDigest,
        testGatePolicyDigest: payload.data.testGatePolicyDigest,
        maxRounds: payload.data.maxRounds,
        minSeatCount: payload.data.minSeatCount,
        maxSeatCount: payload.data.maxSeatCount,
        planningOnly: true,
        initialReplayFingerprint: payload.data.initialReplayFingerprint,
        initializationEventId: event.event_id,
      };
    }
    case 'ai_council.run_resumed':
      return {
        ...run,
        roundId: event.payload.scope.roundId,
        generation: Math.max(
          run.generation,
          payloadFor(event, 'ai_council.run_resumed').data.generation,
        ),
      };
    case 'ai_council.run_restarted':
      return {
        ...run,
        roundId: event.payload.scope.roundId,
        generation: Math.max(
          run.generation,
          payloadFor(event, 'ai_council.run_restarted').data.generation,
        ),
      };
    default:
      return { ...run, roundId: event.payload.scope.roundId };
  }
}

function foldCouncilSeats(
  projection: DeepAiCouncilSeatsProjection,
  event: DeepAiCouncilLedgerEvent,
): DeepAiCouncilSeatsProjection {
  let rounds = [...projection.rounds];
  let seats = [...projection.seats];
  let proposals = [...projection.proposals];
  switch (event.payload.stem) {
    case 'ai_council.round_started': {
      const payload = payloadFor(event, 'ai_council.round_started');
      rounds = insertUnique(rounds, {
        roundId: payload.scope.roundId,
        roundNumber: payload.data.roundNumber,
        protocolVersion: payload.data.protocolVersion,
        exposurePolicyVersion: payload.data.exposurePolicyVersion,
        seatRosterDigest: payload.data.seatRosterDigest,
        promptPackDigest: payload.data.promptPackDigest,
        budgetRef: payload.data.budgetRef,
        priorRoundRef: payload.data.priorRoundRef,
        informationSurface: payload.data.informationSurface,
        producerEventId: event.event_id,
      }, (value) => value.roundId, 'councilSeats.rounds');
      break;
    }
    case 'ai_council.seat_selected': {
      const payload = payloadFor(event, 'ai_council.seat_selected');
      seats = insertUnique(seats, {
        roundId: payload.scope.roundId,
        seatId: payload.scope.seatId,
        strategyLens: payload.data.strategyLens,
        mandateDigest: payload.data.mandateDigest,
        vantageFingerprint: payload.data.vantageFingerprint,
        modelFingerprint: payload.data.modelFingerprint,
        independenceGroup: payload.data.independenceGroup,
        capabilityDigest: payload.data.capabilityDigest,
        promptDigest: payload.data.promptDigest,
        selectionUtility: payload.data.selectionUtility,
        selectionPolicyVersion: payload.data.selectionPolicyVersion,
        selectedEventId: event.event_id,
        dispatchEventId: null,
        dispatchReceiptRef: null,
        logicalBranchRef: null,
        attempt: 0,
        budgetLeaseRef: null,
      }, (value) => `${value.roundId}:${value.seatId}`, 'councilSeats.seats');
      break;
    }
    case 'ai_council.seat_dispatched': {
      const payload = payloadFor(event, 'ai_council.seat_dispatched');
      const index = seats.findIndex((seat) => (
        seat.roundId === payload.scope.roundId && seat.seatId === payload.scope.seatId
      ));
      if (index === -1) {
        throw new DeepAiCouncilReducerError(
          'phantom-source-reference',
          'A dispatch must reference a captured selected seat',
          'councilSeats.seats',
        );
      }
      if (seats[index].dispatchEventId !== null
        && seats[index].dispatchEventId !== event.event_id) {
        throw new DeepAiCouncilReducerError(
          'projection-field-invalid',
          'A selected seat cannot resolve to conflicting dispatches',
          'councilSeats.seats.dispatchEventId',
        );
      }
      seats[index] = {
        ...seats[index],
        dispatchEventId: event.event_id,
        dispatchReceiptRef: payload.data.dispatchReceiptRef,
        logicalBranchRef: payload.data.logicalBranchRef,
        attempt: payload.data.attempt,
        budgetLeaseRef: payload.data.budgetLeaseRef,
      };
      break;
    }
    case 'ai_council.proposal_observed':
    case 'ai_council.seat_returned': {
      const payload = event.payload.stem === 'ai_council.proposal_observed'
        ? payloadFor(event, 'ai_council.proposal_observed')
        : payloadFor(event, 'ai_council.seat_returned');
      if (!seats.some((seat) => (
        seat.roundId === payload.scope.roundId && seat.seatId === payload.scope.seatId
      ))) {
        throw new DeepAiCouncilReducerError(
          'phantom-source-reference',
          'A proposal must reference a captured selected seat',
          'councilSeats.proposals.seatId',
        );
      }
      const key = `${payload.scope.roundId}:${payload.scope.proposalId}`;
      const index = proposals.findIndex(
        (proposal) => `${proposal.roundId}:${proposal.proposalId}` === key,
      );
      const candidate: DeepAiCouncilProposalRecord = {
        roundId: payload.scope.roundId,
        seatId: payload.scope.seatId,
        proposalId: payload.scope.proposalId,
        targetVersion: payload.data.targetVersion,
        responseStatus: payload.data.responseStatus,
        proposalDigest: payload.data.proposalDigest,
        artifactRef: payload.data.artifactRef,
        artifactDigest: payload.data.artifactDigest,
        rawScores: payload.data.rawScores,
        rawConfidence: payload.data.rawConfidence,
        usage: payload.data.usage,
        evidenceRefs: sortStrings(payload.data.evidenceRefs),
        outputSchemaVersion: payload.data.outputSchemaVersion,
        observationDigest: payload.data.observationDigest,
        informationSurface: payload.data.informationSurface,
        failureReason: event.payload.stem === 'ai_council.seat_returned'
          ? payloadFor(event, 'ai_council.seat_returned').data.failureReason
          : null,
        timeoutReason: event.payload.stem === 'ai_council.seat_returned'
          ? payloadFor(event, 'ai_council.seat_returned').data.timeoutReason
          : null,
        observedEventId: event.payload.stem === 'ai_council.proposal_observed'
          ? event.event_id
          : event.event_id,
        returnedEventId: event.payload.stem === 'ai_council.seat_returned'
          ? event.event_id
          : null,
      };
      if (index === -1) {
        proposals.push(candidate);
      } else {
        const existing = proposals[index];
        const immutableCore = (value: typeof candidate): JsonObject => ({
          roundId: value.roundId,
          seatId: value.seatId,
          proposalId: value.proposalId,
          targetVersion: value.targetVersion,
          responseStatus: value.responseStatus,
          proposalDigest: value.proposalDigest,
          artifactRef: value.artifactRef,
          artifactDigest: value.artifactDigest,
          rawScores: value.rawScores,
          rawConfidence: value.rawConfidence,
          usage: value.usage,
          evidenceRefs: value.evidenceRefs,
          outputSchemaVersion: value.outputSchemaVersion,
          observationDigest: value.observationDigest,
          informationSurface: value.informationSurface,
        });
        if (!sameCanonical(immutableCore(existing), immutableCore(candidate))) {
          throw new DeepAiCouncilReducerError(
            'projection-field-invalid',
            'Proposal observation and return must preserve immutable proposal evidence',
            'councilSeats.proposals',
          );
        }
        proposals[index] = {
          ...existing,
          failureReason: candidate.failureReason,
          timeoutReason: candidate.timeoutReason,
          returnedEventId: candidate.returnedEventId ?? existing.returnedEventId,
        };
      }
      break;
    }
    default:
      break;
  }
  rounds.sort((left, right) => compareNumber(left.roundNumber, right.roundNumber));
  seats.sort((left, right) => (
    compareString(left.roundId, right.roundId) || compareString(left.seatId, right.seatId)
  ));
  proposals.sort((left, right) => (
    compareString(left.roundId, right.roundId)
      || compareString(left.proposalId, right.proposalId)
  ));
  return { rounds, seats, proposals };
}

function assertProposalReferences(
  proposals: DeepAiCouncilSeatsProjection['proposals'],
  proposalIds: readonly string[],
  field: string,
): void {
  const captured = new Set(proposals.map((proposal) => proposal.proposalId));
  if (proposalIds.some((proposalId) => !captured.has(proposalId))) {
    throw new DeepAiCouncilReducerError(
      'phantom-source-reference',
      'Council evidence must cite a proposal captured earlier in the ledger',
      field,
    );
  }
}

function foldCritique(
  projection: DeepAiCouncilCritiqueProjection,
  seats: DeepAiCouncilSeatsProjection,
  event: DeepAiCouncilLedgerEvent,
): DeepAiCouncilCritiqueProjection {
  let rounds = [...projection.rounds];
  let critiques = [...projection.critiques];
  if (event.payload.stem === 'ai_council.critique_round_started') {
    const payload = payloadFor(event, 'ai_council.critique_round_started');
    assertProposalReferences(
      seats.proposals,
      payload.data.sourceProposalIds,
      'critique.rounds.sourceProposalIds',
    );
    rounds = insertUnique(rounds, {
      roundId: payload.scope.roundId,
      critiqueRoundId: payload.scope.critiqueRoundId,
      seatId: payload.scope.seatId,
      sourceProposalIds: sortStrings(payload.data.sourceProposalIds),
      visibleInformationPolicyVersion: payload.data.visibleInformationPolicyVersion,
      inputDigest: payload.data.inputDigest,
      informationSurface: payload.data.informationSurface,
      producerEventId: event.event_id,
    }, (value) => `${value.roundId}:${value.critiqueRoundId}`, 'critique.rounds');
  }
  if (event.payload.stem === 'ai_council.critique_recorded') {
    const payload = payloadFor(event, 'ai_council.critique_recorded');
    assertProposalReferences(
      seats.proposals,
      payload.data.sourceProposalIds,
      'critique.critiques.sourceProposalIds',
    );
    if (!rounds.some((round) => (
      round.roundId === payload.scope.roundId
      && round.critiqueRoundId === payload.scope.critiqueRoundId
    ))) {
      throw new DeepAiCouncilReducerError(
        'phantom-source-reference',
        'A critique must reference a captured critique round',
        'critique.critiques.critiqueRoundId',
      );
    }
    critiques = insertUnique(critiques, {
      roundId: payload.scope.roundId,
      critiqueRoundId: payload.scope.critiqueRoundId,
      seatId: payload.scope.seatId,
      sourceProposalIds: sortStrings(payload.data.sourceProposalIds),
      critiqueArtifactRef: payload.data.critiqueArtifactRef,
      critiqueArtifactDigest: payload.data.critiqueArtifactDigest,
      referencedClaimRefs: sortStrings(payload.data.referencedClaimRefs),
      rawSeverity: payload.data.rawSeverity,
      rawConfidence: payload.data.rawConfidence,
      challengeDisposition: payload.data.challengeDisposition,
      causalProposalRefs: sortStrings(payload.data.causalProposalRefs),
      informationSurface: payload.data.informationSurface,
      producerEventId: event.event_id,
    }, (value) => value.producerEventId, 'critique.critiques');
  }
  rounds.sort((left, right) => compareString(left.critiqueRoundId, right.critiqueRoundId));
  critiques.sort((left, right) => compareString(left.producerEventId, right.producerEventId));
  return { rounds, critiques };
}

// ───────────────────────────────────────────────────────────────────
// 5. BLINDED ADJUDICATION FOLD
// ───────────────────────────────────────────────────────────────────

function foldBlindedAdjudication(
  projection: DeepAiCouncilBlindedAdjudicationProjection,
  seats: DeepAiCouncilSeatsProjection,
  event: DeepAiCouncilLedgerEvent,
): DeepAiCouncilBlindedAdjudicationProjection {
  let candidates = [...projection.candidates];
  let judgments = [...projection.judgments];
  let biasAudits = [...projection.biasAudits];
  let decisions = [...projection.decisions];
  switch (event.payload.stem) {
    case 'ai_council.candidate_blinded': {
      const payload = payloadFor(event, 'ai_council.candidate_blinded');
      assertProposalReferences(
        seats.proposals,
        payload.data.sourceProposalIds,
        'blindedAdjudication.candidates.sourceProposalIds',
      );
      candidates = insertUnique(candidates, {
        roundId: payload.scope.roundId,
        candidateId: payload.scope.candidateId,
        sourceProposalIds: sortStrings(payload.data.sourceProposalIds),
        candidateAliasDigest: payload.data.candidateAliasDigest,
        shuffleSeedDigest: payload.data.shuffleSeedDigest,
        visibleCandidateDigest: payload.data.visibleCandidateDigest,
        artifactRef: payload.data.artifactRef,
        artifactDigest: payload.data.artifactDigest,
        targetVersion: payload.data.targetVersion,
        redactionPolicyVersion: payload.data.redactionPolicyVersion,
        informationSurface: payload.data.informationSurface,
        producerEventId: event.event_id,
      }, (value) => `${value.roundId}:${value.candidateId}`,
      'blindedAdjudication.candidates');
      break;
    }
    case 'ai_council.pairwise_judgment_recorded': {
      const payload = payloadFor(event, 'ai_council.pairwise_judgment_recorded');
      const candidateIds = new Set(candidates.map((candidate) => candidate.candidateId));
      if (!candidateIds.has(payload.data.candidateAId)
        || !candidateIds.has(payload.data.candidateBId)) {
        throw new DeepAiCouncilReducerError(
          'phantom-source-reference',
          'A pairwise judgment must cite captured blinded candidates',
          'blindedAdjudication.judgments',
        );
      }
      judgments = insertUnique(judgments, {
        roundId: payload.scope.roundId,
        judgmentId: payload.scope.judgmentId,
        candidateAId: payload.data.candidateAId,
        candidateBId: payload.data.candidateBId,
        orderToken: payload.data.orderToken,
        judgeProfileFingerprint: payload.data.judgeProfileFingerprint,
        rawPreference: payload.data.rawPreference,
        rawConfidence: payload.data.rawConfidence,
        judgmentStatus: payload.data.judgmentStatus,
        inputDigest: payload.data.inputDigest,
        calibrationRef: payload.data.calibrationRef,
        informationSurface: payload.data.informationSurface,
        producerEventId: event.event_id,
      }, (value) => `${value.roundId}:${value.judgmentId}`,
      'blindedAdjudication.judgments');
      break;
    }
    case 'ai_council.bias_audit_recorded': {
      const payload = payloadFor(event, 'ai_council.bias_audit_recorded');
      const judgmentIds = new Set(judgments.map((judgment) => judgment.judgmentId));
      if (payload.data.pairedJudgmentIds.some((id) => !judgmentIds.has(id))) {
        throw new DeepAiCouncilReducerError(
          'phantom-source-reference',
          'A bias audit must cite captured pairwise judgments',
          'blindedAdjudication.biasAudits.pairedJudgmentIds',
        );
      }
      biasAudits = insertUnique(biasAudits, {
        roundId: payload.scope.roundId,
        judgmentId: payload.scope.judgmentId,
        candidateAId: payload.data.candidateAId,
        candidateBId: payload.data.candidateBId,
        pairedJudgmentIds: sortStrings(payload.data.pairedJudgmentIds),
        biasFeatureCodes: sortStrings(payload.data.biasFeatureCodes),
        detectorResult: payload.data.detectorResult,
        inconsistencyStatus: payload.data.inconsistencyStatus,
        rawBiasScore: payload.data.rawBiasScore,
        inputDigest: payload.data.inputDigest,
        detectorFingerprint: payload.data.detectorFingerprint,
        producerEventId: event.event_id,
      }, (value) => value.producerEventId, 'blindedAdjudication.biasAudits');
      break;
    }
    case 'ai_council.adjudication_decision': {
      const payload = payloadFor(event, 'ai_council.adjudication_decision');
      const judgmentIds = new Set(judgments.map((judgment) => judgment.judgmentId));
      if (payload.data.sourceJudgmentIds.some((id) => !judgmentIds.has(id))) {
        throw new DeepAiCouncilReducerError(
          'phantom-source-reference',
          'Adjudication must cite captured independent judgments',
          'blindedAdjudication.decisions.sourceJudgmentIds',
        );
      }
      if (payload.data.selectedCandidateId !== null
        && !candidates.some((candidate) => (
          candidate.candidateId === payload.data.selectedCandidateId
        ))) {
        throw new DeepAiCouncilReducerError(
          'phantom-source-reference',
          'Adjudication cannot select an uncaptured candidate',
          'blindedAdjudication.decisions.selectedCandidateId',
        );
      }
      const candidate: DeepAiCouncilAdjudicationRecord = {
        roundId: payload.scope.roundId,
        candidateSetDigest: payload.data.candidateSetDigest,
        protocolVersion: payload.data.protocolVersion,
        rubricVersion: payload.data.rubricVersion,
        rawScores: payload.data.rawScores,
        calibratedScores: payload.data.calibratedScores,
        supportMass: payload.data.supportMass,
        oppositionMass: payload.data.oppositionMass,
        independence: payload.data.independence,
        minorityRefs: sortStrings(payload.data.minorityRefs),
        contradictionRefs: sortStrings(payload.data.contradictionRefs),
        vetoFindingRefs: sortStrings(payload.data.vetoFindingRefs),
        disposition: payload.data.disposition,
        selectedCandidateId: payload.data.selectedCandidateId,
        evaluatorReceiptRef: payload.data.evaluatorReceiptRef,
        sourceJudgmentIds: sortStrings(payload.data.sourceJudgmentIds),
        producerEventId: event.event_id,
      };
      decisions = insertUnique(
        decisions,
        candidate,
        (value) => value.producerEventId,
        'blindedAdjudication.decisions',
      );
      break;
    }
    default:
      break;
  }
  candidates.sort((left, right) => compareString(left.candidateId, right.candidateId));
  judgments.sort((left, right) => compareString(left.judgmentId, right.judgmentId));
  biasAudits.sort((left, right) => compareString(left.producerEventId, right.producerEventId));
  decisions.sort((left, right) => compareString(left.producerEventId, right.producerEventId));
  return { candidates, judgments, biasAudits, decisions };
}

// ───────────────────────────────────────────────────────────────────
// 6. CONVERGENCE, ARTIFACT, AND GATE FOLDS
// ───────────────────────────────────────────────────────────────────

function assertEventRange(
  seenEvents: readonly DeepAiCouncilSeenEvent[],
  range: { readonly firstEventId: string; readonly lastEventId: string },
  field: string,
): void {
  const ids = new Set(seenEvents.map((event) => event.eventId));
  if (!ids.has(range.firstEventId) || !ids.has(range.lastEventId)) {
    throw new DeepAiCouncilReducerError(
      'phantom-source-reference',
      'A source event range must cite captured predecessor events',
      field,
    );
  }
}

function foldConvergenceEvidence(
  projection: DeepAiCouncilConvergenceProjection,
  seats: DeepAiCouncilSeatsProjection,
  critique: DeepAiCouncilCritiqueProjection,
  adjudication: DeepAiCouncilBlindedAdjudicationProjection,
  seenEvents: readonly DeepAiCouncilSeenEvent[],
  event: DeepAiCouncilLedgerEvent,
): DeepAiCouncilConvergenceProjection {
  let stances = [...projection.stances];
  let deliberations = [...projection.deliberations];
  let evaluations = [...projection.evaluations];
  if (event.payload.stem === 'ai_council.stance_recorded'
    || event.payload.stem === 'ai_council.stance_flipped') {
    const payload = event.payload.stem === 'ai_council.stance_recorded'
      ? payloadFor(event, 'ai_council.stance_recorded')
      : payloadFor(event, 'ai_council.stance_flipped');
    if (!adjudication.candidates.some(
      (candidate) => candidate.candidateId === payload.scope.candidateId,
    )) {
      throw new DeepAiCouncilReducerError(
        'phantom-source-reference',
        'A stance must cite a captured blinded candidate',
        'convergence.stances.candidateId',
      );
    }
    const evidenceRefs = new Set([
      ...seats.proposals.flatMap((proposal) => proposal.evidenceRefs),
      ...critique.critiques.flatMap((record) => [
        record.critiqueArtifactRef,
        ...record.referencedClaimRefs,
      ]),
    ]);
    if (!evidenceRefs.has(payload.data.evidenceRef)) {
      throw new DeepAiCouncilReducerError(
        'phantom-source-reference',
        'An admitted stance must cite captured proposal or critique evidence',
        'convergence.stances.evidenceRef',
      );
    }
    if (payload.data.priorStanceEventId !== null) {
      const prior = stances.find(
        (stance) => stance.producerEventId === payload.data.priorStanceEventId,
      );
      if (prior === undefined) {
        throw new DeepAiCouncilReducerError(
          'phantom-source-reference',
          'A stance revision must cite its captured predecessor',
          'convergence.stances.priorStanceEventId',
        );
      }
      if (event.payload.stem === 'ai_council.stance_flipped'
        && prior.currentStance !== payload.data.priorStance) {
        throw new DeepAiCouncilReducerError(
          'impossible-status-transition',
          'A stance flip must preserve the predecessor stance',
          'convergence.stances.priorStance',
        );
      }
    }
    stances = insertUnique(stances, {
      roundId: payload.scope.roundId,
      candidateId: payload.scope.candidateId,
      seatId: payload.scope.seatId,
      candidateOrPlanRef: payload.data.candidateOrPlanRef,
      priorStanceEventId: payload.data.priorStanceEventId,
      priorStance: event.payload.stem === 'ai_council.stance_flipped'
        ? payloadFor(event, 'ai_council.stance_flipped').data.priorStance
        : null,
      currentStance: payload.data.currentStance,
      flipDirection: event.payload.stem === 'ai_council.stance_flipped'
        ? payloadFor(event, 'ai_council.stance_flipped').data.flipDirection
        : null,
      rawRationaleDigest: payload.data.rawRationaleDigest,
      evidenceRef: payload.data.evidenceRef,
      influenceObservationDigest: payload.data.influenceObservationDigest,
      producerEventId: event.event_id,
    }, (value) => value.producerEventId, 'convergence.stances');
  }
  if (event.payload.stem === 'ai_council.deliberation_synthesized') {
    const payload = payloadFor(event, 'ai_council.deliberation_synthesized');
    assertEventRange(
      seenEvents,
      payload.data.inputEventRange,
      'convergence.deliberations.inputEventRange',
    );
    deliberations = insertUnique(deliberations, {
      roundId: payload.scope.roundId,
      inputEventRange: payload.data.inputEventRange,
      candidateSetDigest: payload.data.candidateSetDigest,
      planDisposition: payload.data.planDisposition,
      selectedPlanDigest: payload.data.selectedPlanDigest,
      disagreementRefs: sortStrings(payload.data.disagreementRefs),
      minorityRefs: sortStrings(payload.data.minorityRefs),
      synthesisPolicyFingerprint: payload.data.synthesisPolicyFingerprint,
      evaluatorFingerprint: payload.data.evaluatorFingerprint,
      reportDraftRef: payload.data.reportDraftRef,
      synthesisReceiptRef: payload.data.synthesisReceiptRef,
      producerEventId: event.event_id,
    }, (value) => value.producerEventId, 'convergence.deliberations');
  }
  if (event.payload.stem === 'ai_council.convergence_evaluated'
    || event.payload.stem === 'ai_council.convergence_blocked') {
    const payload = event.payload.stem === 'ai_council.convergence_evaluated'
      ? payloadFor(event, 'ai_council.convergence_evaluated')
      : payloadFor(event, 'ai_council.convergence_blocked');
    evaluations = insertUnique(evaluations, {
      roundId: payload.scope.roundId,
      decision: payload.data.decision,
      rawAgreement: payload.data.rawAgreement,
      rawStability: payload.data.rawStability,
      calibratedSupport: payload.data.calibratedSupport,
      effectiveSeatCount: payload.data.effectiveSeatCount,
      independence: payload.data.independence,
      judgeProfileRefs: sortStrings(payload.data.judgeProfileRefs),
      qualityWitnessRefs: sortStrings(payload.data.qualityWitnessRefs),
      invarianceWitnessRefs: sortStrings(payload.data.invarianceWitnessRefs),
      minorityRefs: sortStrings(payload.data.minorityRefs),
      contradictionRefs: sortStrings(payload.data.contradictionRefs),
      vetoFindingRefs: sortStrings(payload.data.vetoFindingRefs),
      requiredGateResultRefs: sortStrings(payload.data.requiredGateResultRefs),
      budgetStateRef: payload.data.budgetStateRef,
      coverageStateRef: payload.data.coverageStateRef,
      blockerIds: sortStrings(payload.data.blockerIds),
      recoveryOrEscalationReason: payload.data.recoveryOrEscalationReason,
      producerEventId: event.event_id,
    }, (value) => value.producerEventId, 'convergence.evaluations');
  }
  stances.sort((left, right) => compareString(left.producerEventId, right.producerEventId));
  deliberations.sort(
    (left, right) => compareString(left.producerEventId, right.producerEventId),
  );
  evaluations.sort(
    (left, right) => compareString(left.producerEventId, right.producerEventId),
  );
  return { ...projection, stances, deliberations, evaluations };
}

function refreshConvergence(
  projection: DeepAiCouncilConvergenceProjection,
  run: DeepAiCouncilRunProjection,
  seats: DeepAiCouncilSeatsProjection,
  adjudication: DeepAiCouncilBlindedAdjudicationProjection,
  testGate: DeepAiCouncilTestGateProjection,
): DeepAiCouncilConvergenceProjection {
  const latest = projection.evaluations.at(-1);
  const latestDecision = adjudication.decisions.at(-1);
  const latestDeliberation = projection.deliberations.at(-1);
  const blockerIds = sortStrings(latest?.blockerIds ?? []);
  const hardVetoRefs = sortStrings([
    ...(latest?.vetoFindingRefs ?? []),
    ...(latestDecision?.vetoFindingRefs ?? []),
    ...testGate.evaluations.flatMap((gate) => (
      gate.verdict === 'pass'
        ? gate.requiredCheckResults
          .filter((check) => check.status !== 'pass')
          .map((check) => check.checkId)
        : gate.criticalFailureRefs
    )),
  ]);
  const hasSelectedDecision = latestDecision?.disposition === 'selected'
    && latestDecision.selectedCandidateId !== null;
  const hasUnresolvedDecision = latestDecision?.disposition === 'unresolved'
    || latestDeliberation?.planDisposition === 'unresolved';
  const seatCoverage = seats.seats.length >= run.minSeatCount
    && seats.proposals.length >= run.minSeatCount;
  const hasWitnesses = (latest?.requiredGateResultRefs.length ?? 0) > 0;
  const hasIndependence = (latest?.effectiveSeatCount ?? 0) >= run.minSeatCount;
  const gatePasses = testGate.verdict === 'pass';
  const eligible = latest?.decision === 'converged'
    && blockerIds.length === 0
    && hardVetoRefs.length === 0
    && !hasUnresolvedDecision
    && hasSelectedDecision
    && seatCoverage
    && hasWitnesses
    && hasIndependence
    && gatePasses;
  const outcome = latest === undefined
    ? 'active' as const
    : latest.decision === 'converged'
      ? eligible ? 'converged' as const : 'blocked' as const
      : latest.decision === 'incomplete'
        ? 'incomplete' as const
        : latest.decision === 'non-converged'
          ? 'non-converged' as const
          : latest.decision === 'blocked'
            ? 'blocked' as const
            : 'active' as const;
  const minorityRefs = sortStrings([
    ...(latest?.minorityRefs ?? []),
    ...(latestDecision?.minorityRefs ?? []),
    ...(latestDeliberation?.minorityRefs ?? []),
  ]);
  const contradictionRefs = sortStrings([
    ...(latest?.contradictionRefs ?? []),
    ...(latestDecision?.contradictionRefs ?? []),
  ]);
  const presentationKind = hardVetoRefs.length > 0 || blockerIds.length > 0
    ? 'debate-escalation' as const
    : hasUnresolvedDecision || contradictionRefs.length > 0
      ? 'plural-value-disagreement' as const
      : hasSelectedDecision
        ? 'blinded-plan-posterior' as const
        : 'factual-posterior' as const;
  return {
    ...projection,
    outcome,
    eligible,
    blockerIds,
    hardVetoRefs,
    rawAgreement: latest?.rawAgreement ?? 0,
    calibratedSupport: latest?.calibratedSupport ?? 0,
    effectiveSeatCount: latest?.effectiveSeatCount ?? 0,
    presentation: {
      kind: presentationKind,
      selectedCandidateId: latestDecision?.selectedCandidateId ?? null,
      rawProposalEventIds: sortStrings(
        seats.proposals.map((proposal) => proposal.observedEventId),
      ),
      rawJudgmentEventIds: sortStrings(
        adjudication.judgments.map((judgment) => judgment.producerEventId),
      ),
      adjudicationEventIds: sortStrings(
        adjudication.decisions.map((decision) => decision.producerEventId),
      ),
      minorityRefs,
      contradictionRefs,
      vetoFindingRefs: hardVetoRefs,
      unresolvedValueRefs: hasUnresolvedDecision
        ? sortStrings([
          ...(latestDeliberation?.disagreementRefs ?? []),
          ...contradictionRefs,
        ])
        : [],
      reopenConditionRefs: sortStrings([
        ...blockerIds,
        ...hardVetoRefs,
        ...contradictionRefs,
      ]),
    },
  };
}

function foldArtifacts(
  projection: DeepAiCouncilArtifactsProjection,
  seenEvents: readonly DeepAiCouncilSeenEvent[],
  event: DeepAiCouncilLedgerEvent,
): DeepAiCouncilArtifactsProjection {
  let records = [...projection.records];
  if (event.payload.stem === 'ai_council.artifact_committed') {
    const payload = payloadFor(event, 'ai_council.artifact_committed');
    assertEventRange(
      seenEvents,
      payload.data.sourceEventRange,
      'artifacts.records.sourceEventRange',
    );
    records = insertUnique(records, {
      artifactId: payload.scope.artifactId,
      logicalArtifactId: `${payload.data.artifactKind}:${payload.data.safeRelativePath}`,
      roundId: payload.scope.roundId,
      artifactKind: payload.data.artifactKind,
      safeRelativePath: payload.data.safeRelativePath,
      schemaVersion: payload.data.schemaVersion,
      byteDigest: payload.data.byteDigest,
      contentDigest: payload.data.contentDigest,
      requiredSectionResults: [...payload.data.requiredSectionResults],
      sourceEventRange: payload.data.sourceEventRange,
      producerEventId: event.event_id,
      availability: 'available',
      supersedesArtifactIds: [],
      supersededByArtifactIds: [],
      rollbackRef: payload.data.rollbackRef,
    }, (value) => value.artifactId, 'artifacts.records');
  }
  if (event.payload.stem === 'ai_council.artifact_superseded') {
    const payload = payloadFor(event, 'ai_council.artifact_superseded');
    assertEventRange(
      seenEvents,
      payload.data.sourceEventRange,
      'artifacts.records.sourceEventRange',
    );
    const priorIndex = records.findIndex(
      (record) => record.artifactId === payload.data.priorArtifactId,
    );
    if (priorIndex === -1) {
      throw new DeepAiCouncilReducerError(
        'phantom-source-reference',
        'Artifact supersession must cite a captured predecessor artifact',
        'artifacts.records.supersedesArtifactIds',
      );
    }
    if (payload.scope.artifactId !== payload.data.successorArtifactId) {
      throw new DeepAiCouncilReducerError(
        'projection-field-invalid',
        'Successor artifact scope and payload identity must agree',
        'artifacts.records.artifactId',
      );
    }
    const successor: DeepAiCouncilArtifactRecord = {
      artifactId: payload.data.successorArtifactId,
      logicalArtifactId: `${payload.data.artifactKind}:${payload.data.safeRelativePath}`,
      roundId: payload.scope.roundId,
      artifactKind: payload.data.artifactKind,
      safeRelativePath: payload.data.safeRelativePath,
      schemaVersion: payload.data.schemaVersion,
      byteDigest: payload.data.byteDigest,
      contentDigest: payload.data.contentDigest,
      requiredSectionResults: [...payload.data.requiredSectionResults],
      sourceEventRange: payload.data.sourceEventRange,
      producerEventId: event.event_id,
      availability: 'available',
      supersedesArtifactIds: [payload.data.priorArtifactId],
      supersededByArtifactIds: [],
      rollbackRef: payload.data.rollbackRef,
    };
    records[priorIndex] = {
      ...records[priorIndex],
      availability: 'superseded',
      supersededByArtifactIds: sortStrings([
        ...records[priorIndex].supersededByArtifactIds,
        successor.artifactId,
      ]),
    };
    records = insertUnique(
      records,
      successor,
      (value) => value.artifactId,
      'artifacts.records',
    );
  }
  records.sort((left, right) => compareString(left.artifactId, right.artifactId));
  return { records };
}

function foldTestGate(
  projection: DeepAiCouncilTestGateProjection,
  event: DeepAiCouncilLedgerEvent,
): DeepAiCouncilTestGateProjection {
  if (event.payload.stem !== 'ai_council.council_test_gate_evaluated') {
    return projection;
  }
  const payload = payloadFor(event, 'ai_council.council_test_gate_evaluated');
  const evaluations = insertUnique(projection.evaluations, {
    gateId: payload.scope.gateId,
    roundId: payload.scope.roundId,
    testSuiteDigest: payload.data.testSuiteDigest,
    fixtureManifestDigest: payload.data.fixtureManifestDigest,
    baselineFingerprint: payload.data.baselineFingerprint,
    candidateFingerprint: payload.data.candidateFingerprint,
    requiredCheckResults: [...payload.data.requiredCheckResults],
    criticalFailureRefs: sortStrings(payload.data.criticalFailureRefs),
    metamorphicCheckDigest: payload.data.metamorphicCheckDigest,
    biasCheckDigest: payload.data.biasCheckDigest,
    artifactCompleteness: payload.data.artifactCompleteness,
    verdict: payload.data.verdict,
    gateReceiptRef: payload.data.gateReceiptRef,
    informationSurface: payload.data.informationSurface,
    producerEventId: event.event_id,
  }, (value) => `${value.roundId}:${value.gateId}`, 'testGate.evaluations');
  evaluations.sort((left, right) => compareString(left.producerEventId, right.producerEventId));
  return { evaluations, verdict: evaluations.at(-1)?.verdict ?? 'unknown' };
}

// ───────────────────────────────────────────────────────────────────
// 7. STATUS AND TERMINAL INVARIANTS
// ───────────────────────────────────────────────────────────────────

const TERMINAL_STATUSES = Object.freeze([
  'complete',
  'incomplete',
  'non-converged',
  'failed',
] as const satisfies readonly DeepAiCouncilModeStatus[]);

const STATUS_TRANSITIONS = Object.freeze({
  planned: Object.freeze(['planned', 'admitted']),
  admitted: Object.freeze(['admitted', 'deliberating', 'blocked']),
  deliberating: Object.freeze([
    'deliberating', 'critiquing', 'adjudicating', 'converging', 'blocked',
  ]),
  critiquing: Object.freeze(['critiquing', 'adjudicating', 'converging', 'blocked']),
  adjudicating: Object.freeze(['adjudicating', 'converging', 'blocked']),
  converging: Object.freeze(['converging', 'testing', 'blocked']),
  testing: Object.freeze(['testing', 'complete', 'incomplete', 'non-converged', 'blocked']),
  blocked: Object.freeze([
    'blocked', 'deliberating', 'critiquing', 'adjudicating', 'converging', 'testing',
    'incomplete', 'non-converged', 'failed',
  ]),
  complete: Object.freeze(['complete']),
  incomplete: Object.freeze(['incomplete']),
  'non-converged': Object.freeze(['non-converged']),
  failed: Object.freeze(['failed']),
} as const satisfies Readonly<
  Record<DeepAiCouncilModeStatus, readonly DeepAiCouncilModeStatus[]>
>);

function candidateStatus(
  event: DeepAiCouncilLedgerEvent,
  convergence: DeepAiCouncilConvergenceProjection,
  testGate: DeepAiCouncilTestGateProjection,
): { readonly state: DeepAiCouncilModeStatus; readonly blockingReason: string | null } | null {
  switch (event.payload.stem) {
    case 'ai_council.run_initialized':
      return { state: 'admitted', blockingReason: null };
    case 'ai_council.run_resumed':
    case 'ai_council.run_restarted':
    case 'ai_council.round_started':
    case 'ai_council.seat_selected':
    case 'ai_council.seat_dispatched':
    case 'ai_council.proposal_observed':
    case 'ai_council.seat_returned':
      return { state: 'deliberating', blockingReason: null };
    case 'ai_council.critique_round_started':
    case 'ai_council.critique_recorded':
      return { state: 'critiquing', blockingReason: null };
    case 'ai_council.candidate_blinded':
    case 'ai_council.pairwise_judgment_recorded':
    case 'ai_council.bias_audit_recorded':
    case 'ai_council.adjudication_decision':
    case 'ai_council.stance_recorded':
    case 'ai_council.stance_flipped':
      return { state: 'adjudicating', blockingReason: null };
    case 'ai_council.deliberation_synthesized':
      return { state: 'converging', blockingReason: null };
    case 'ai_council.convergence_evaluated':
    case 'ai_council.convergence_blocked':
      return convergence.outcome === 'blocked'
        ? {
          state: 'blocked',
          blockingReason: event.payload.data.recoveryOrEscalationReason
            ?? 'convergence-obligations-unresolved',
        }
        : { state: 'converging', blockingReason: null };
    case 'ai_council.round_ended':
      return null;
    case 'ai_council.artifact_committed':
    case 'ai_council.artifact_superseded':
      return null;
    case 'ai_council.council_test_gate_evaluated':
      return testGate.verdict === 'pass'
        ? { state: 'testing', blockingReason: null }
        : { state: 'blocked', blockingReason: 'council-test-gate-not-passing' };
    case 'ai_council.rollback_recorded':
      return { state: 'blocked', blockingReason: 'rollback-observed-outside-reducer-authority' };
    case 'ai_council.council_complete': {
      const terminal = payloadFor(event, 'ai_council.council_complete').data.terminalStatus;
      return {
        state: terminal === 'completed'
          ? 'complete'
          : terminal === 'incomplete'
            ? 'incomplete'
            : 'non-converged',
        blockingReason: terminal === 'completed' ? null : event.payload.data.terminalReason,
      };
    }
  }
  return assertNeverStem((event as DeepAiCouncilLedgerEvent).payload.stem as never);
}

function refreshStatus(
  projection: DeepAiCouncilStatusProjection,
  event: DeepAiCouncilLedgerEvent,
  convergence: DeepAiCouncilConvergenceProjection,
  testGate: DeepAiCouncilTestGateProjection,
): DeepAiCouncilStatusProjection {
  const candidate = candidateStatus(event, convergence, testGate);
  if (candidate === null) return projection;
  const allowed: readonly DeepAiCouncilModeStatus[] = STATUS_TRANSITIONS[projection.state];
  if (!allowed.includes(candidate.state)) {
    throw new DeepAiCouncilReducerError(
      'impossible-status-transition',
      `Status cannot transition from ${projection.state} to ${candidate.state}`,
      'status.provenance',
    );
  }
  const transition: DeepAiCouncilStatusTransition = {
    state: candidate.state,
    producerEventId: event.event_id,
    producerStem: event.payload.stem,
    streamSequence: event.stream_sequence,
    blockingReason: candidate.blockingReason,
  };
  const provenance = projection.provenance.some(
    (entry) => entry.producerEventId === event.event_id,
  )
    ? [...projection.provenance]
    : [...projection.provenance, transition];
  provenance.sort((left, right) => (
    compareNumber(left.streamSequence, right.streamSequence)
      || compareString(left.producerEventId, right.producerEventId)
  ));
  return {
    state: candidate.state,
    terminal: TERMINAL_STATUSES.includes(candidate.state as never),
    projectionHealth: candidate.state === 'blocked' || candidate.state === 'failed'
      ? 'blocked'
      : 'healthy',
    admission: candidate.state === 'planned' ? 'pending' : 'admitted',
    shadowParity: 'not-run',
    modeGate: 'off',
    blockingReason: candidate.blockingReason,
    provenance,
  };
}

function assertTerminalReferences(
  state: DeepAiCouncilProjectionState,
  event: DeepAiCouncilEventEnvelope<'ai_council.council_complete'>,
  predecessorDigest: string,
): void {
  const seenIds = new Set(state.seenEvents.map((seen) => seen.eventId));
  const references = [
    ['convergenceEventId', event.payload.data.convergenceEventId],
    ['finalDeliberationEventId', event.payload.data.finalDeliberationEventId],
    ['councilTestGateEventId', event.payload.data.councilTestGateEventId],
  ] as const;
  const missing = references.find(([, id]) => !seenIds.has(id));
  if (missing !== undefined) {
    throw new DeepAiCouncilReducerError(
      'phantom-source-reference',
      'Council completion must cite captured predecessor events',
      `status.${missing[0]}`,
    );
  }
  const wrongKind = [
    {
      field: 'convergenceEventId',
      matches: state.convergence.evaluations.some(
        (entry) => entry.producerEventId === event.payload.data.convergenceEventId,
      ),
    },
    {
      field: 'finalDeliberationEventId',
      matches: state.convergence.deliberations.some(
        (entry) => entry.producerEventId === event.payload.data.finalDeliberationEventId,
      ),
    },
    {
      field: 'councilTestGateEventId',
      matches: state.testGate.evaluations.some(
        (entry) => entry.producerEventId === event.payload.data.councilTestGateEventId,
      ),
    },
  ].find((reference) => !reference.matches);
  if (wrongKind !== undefined) {
    throw new DeepAiCouncilReducerError(
      'phantom-source-reference',
      'Council completion references must cite the required predecessor families',
      `status.${wrongKind.field}`,
    );
  }
  if (!state.artifacts.records.some((artifact) => (
    artifact.artifactId === event.payload.data.artifactManifestRef
    || artifact.logicalArtifactId === event.payload.data.artifactManifestRef
  ))) {
    throw new DeepAiCouncilReducerError(
      'phantom-source-reference',
      'Council completion must cite a captured artifact manifest',
      'status.artifactManifestRef',
    );
  }
  if (event.payload.data.finalLedgerTailDigest !== predecessorDigest) {
    throw new DeepAiCouncilReducerError(
      'tail-integrity-mismatch',
      'Council completion tail must match the captured predecessor digest',
      'status.finalLedgerTailDigest',
    );
  }
  if (event.payload.data.terminalStatus === 'completed' && (
    !state.convergence.eligible
    || state.convergence.outcome !== 'converged'
    || state.testGate.verdict !== 'pass'
    || state.convergence.hardVetoRefs.length > 0
    || state.convergence.blockerIds.length > 0
  )) {
    throw new DeepAiCouncilReducerError(
      'impossible-status-transition',
      'Completed council runs require eligible convergence, no hard veto, and a passing gate',
      'status',
    );
  }
}

function assertProjectionCrossFieldConsistency(
  state: DeepAiCouncilProjectionState,
): void {
  const proposalIds = new Set(
    state.councilSeats.proposals.map((proposal) => proposal.proposalId),
  );
  const candidateIds = new Set(
    state.blindedAdjudication.candidates.map((candidate) => candidate.candidateId),
  );
  const judgmentIds = new Set(
    state.blindedAdjudication.judgments.map((judgment) => judgment.judgmentId),
  );
  const stanceEventIds = new Set(
    state.convergence.stances.map((stance) => stance.producerEventId),
  );
  const seenEventIds = new Set(state.seenEvents.map((event) => event.eventId));
  const evidenceRefs = new Set([
    ...state.councilSeats.proposals.flatMap((proposal) => proposal.evidenceRefs),
    ...state.critique.critiques.flatMap((record) => [
      record.critiqueArtifactRef,
      ...record.referencedClaimRefs,
    ]),
  ]);
  const hasPhantomReference =
    state.critique.rounds.some(
      (round) => round.sourceProposalIds.some((id) => !proposalIds.has(id)),
    )
    || state.critique.critiques.some(
      (record) => record.sourceProposalIds.some((id) => !proposalIds.has(id)),
    )
    || state.blindedAdjudication.candidates.some(
      (candidate) => candidate.sourceProposalIds.some((id) => !proposalIds.has(id)),
    )
    || state.blindedAdjudication.judgments.some(
      (judgment) => !candidateIds.has(judgment.candidateAId)
        || !candidateIds.has(judgment.candidateBId),
    )
    || state.blindedAdjudication.biasAudits.some(
      (audit) => audit.pairedJudgmentIds.some((id) => !judgmentIds.has(id)),
    )
    || state.blindedAdjudication.decisions.some(
      (decision) => decision.sourceJudgmentIds.some((id) => !judgmentIds.has(id))
        || (
          decision.selectedCandidateId !== null
          && !candidateIds.has(decision.selectedCandidateId)
        ),
    )
    || state.convergence.stances.some(
      (stance) => !evidenceRefs.has(stance.evidenceRef)
        || (
          stance.priorStanceEventId !== null
          && !stanceEventIds.has(stance.priorStanceEventId)
        ),
    )
    || state.convergence.deliberations.some(
      (record) => !seenEventIds.has(record.inputEventRange.firstEventId)
        || !seenEventIds.has(record.inputEventRange.lastEventId),
    )
    || state.artifacts.records.some(
      (record) => !seenEventIds.has(record.sourceEventRange.firstEventId)
        || !seenEventIds.has(record.sourceEventRange.lastEventId),
    );
  if (hasPhantomReference) {
    throw new DeepAiCouncilReducerError(
      'phantom-source-reference',
      'Persisted council evidence must cite captured predecessor projections',
      'projection',
    );
  }
  let derivedState: DeepAiCouncilModeStatus = 'planned';
  for (const transition of state.status.provenance) {
    const allowed: readonly DeepAiCouncilModeStatus[] = STATUS_TRANSITIONS[derivedState];
    if (!allowed.includes(transition.state)) {
      throw new DeepAiCouncilReducerError(
        'impossible-status-transition',
        'Persisted status provenance contains an impossible transition',
        'status.provenance',
      );
    }
    derivedState = transition.state;
  }
  if (derivedState !== state.status.state
    || state.status.terminal !== TERMINAL_STATUSES.includes(derivedState as never)) {
    throw new DeepAiCouncilReducerError(
      'impossible-status-transition',
      'Persisted status must equal its ordered transition provenance',
      'status',
    );
  }
  if (state.status.state === 'complete' && (
    !state.convergence.eligible
    || state.convergence.outcome !== 'converged'
    || state.testGate.verdict !== 'pass'
    || state.convergence.hardVetoRefs.length > 0
    || state.convergence.blockerIds.length > 0
  )) {
    throw new DeepAiCouncilReducerError(
      'impossible-status-transition',
      'Complete status requires eligible convergence and a passing gate',
      'status.state',
    );
  }
}

// ───────────────────────────────────────────────────────────────────
// 8. EVENT APPLICATION
// ───────────────────────────────────────────────────────────────────

function appendSeenEvent(
  state: DeepAiCouncilProjectionState,
  event: DeepAiCouncilLedgerEvent,
): DeepAiCouncilSeenEvent[] | null {
  const digest = eventDigest(event);
  const existing = state.seenEvents.find((entry) => entry.eventId === event.event_id);
  if (existing !== undefined) {
    if (existing.eventDigest !== digest) {
      throw new DeepAiCouncilReducerError(
        'duplicate-event-conflict',
        'A persisted event identity cannot resolve to different canonical bytes',
        'seenEvents',
      );
    }
    return null;
  }
  return [...state.seenEvents, {
    eventId: event.event_id,
    eventDigest: digest,
    streamId: event.stream_id,
    streamSequence: event.stream_sequence,
    stem: event.payload.stem,
  }];
}

function advanceCursors(
  state: DeepAiCouncilProjectionState,
  event: DeepAiCouncilLedgerEvent,
): DeepAiCouncilProjectionState['cursors'] {
  const planes = DEEP_AI_COUNCIL_EVENT_ROUTING[event.payload.stem];
  const next = { ...state.cursors };
  for (const plane of planes) next[plane] = event.stream_sequence;
  return next;
}

function applyEvent(
  state: DeepAiCouncilProjectionState,
  event: DeepAiCouncilLedgerEvent,
): DeepAiCouncilProjectionState {
  const seenEvents = appendSeenEvent(state, event);
  if (seenEvents === null) return state;
  assertRunIdentity(state.run, event);
  if (state.status.terminal) {
    throw new DeepAiCouncilReducerError(
      'duplicate-terminal-event',
      'A terminal council projection accepts no additional events',
      'status.provenance',
    );
  }
  const predecessorDigest = state.seenEvents.at(-1)?.eventDigest ?? ZERO_DIGEST;
  let run = foldRun(state.run, event);
  let councilSeats = foldCouncilSeats(state.councilSeats, event);
  let critique = foldCritique(state.critique, councilSeats, event);
  let blindedAdjudication = foldBlindedAdjudication(
    state.blindedAdjudication,
    councilSeats,
    event,
  );
  let convergence = foldConvergenceEvidence(
    state.convergence,
    councilSeats,
    critique,
    blindedAdjudication,
    state.seenEvents,
    event,
  );
  const artifacts = foldArtifacts(state.artifacts, state.seenEvents, event);
  const testGate = foldTestGate(state.testGate, event);
  convergence = refreshConvergence(
    convergence,
    run,
    councilSeats,
    blindedAdjudication,
    testGate,
  );
  const interim: DeepAiCouncilProjectionState = {
    ...state,
    run,
    councilSeats,
    critique,
    blindedAdjudication,
    convergence,
    artifacts,
    testGate,
    cursors: advanceCursors(state, event),
    seenEvents,
  };
  if (event.payload.stem === 'ai_council.round_ended') {
    const payload = payloadFor(event, 'ai_council.round_ended');
    if (!state.seenEvents.some(
      (seen) => seen.eventId === payload.data.convergenceEventId,
    ) || !state.convergence.evaluations.some(
      (evaluation) => evaluation.producerEventId === payload.data.convergenceEventId,
    )) {
      throw new DeepAiCouncilReducerError(
        'phantom-source-reference',
        'A round end must cite a captured convergence event',
        'convergence.roundEnded.convergenceEventId',
      );
    }
    if (payload.data.finalRoundTailDigest !== predecessorDigest) {
      throw new DeepAiCouncilReducerError(
        'tail-integrity-mismatch',
        'Round-end tail must match the captured predecessor digest',
        'convergence.roundEnded.finalRoundTailDigest',
      );
    }
  }
  if (event.payload.stem === 'ai_council.council_complete') {
    assertTerminalReferences(
      interim,
      event as DeepAiCouncilEventEnvelope<'ai_council.council_complete'>,
      predecessorDigest,
    );
  }
  const next: DeepAiCouncilProjectionState = {
    ...interim,
    status: refreshStatus(state.status, event, convergence, testGate),
  };
  assertDeepAiCouncilProjectionState(next);
  return immutableProjectionClone(next) as DeepAiCouncilProjectionState;
}

// ───────────────────────────────────────────────────────────────────
// 9. MODE-CONTRACT REDUCER SURFACE
// ───────────────────────────────────────────────────────────────────

export type DeepAiCouncilReducerSurface = Pick<
  ModeContract<DeepAiCouncilModeContractState>,
  'reducers' | 'reduce'
>;

/** Apply one real verified-ledger event through the shared reducer signature. */
export function reduceDeepAiCouncilVerifiedEvent(
  verified: VerifiedLedgerEvent,
  state: Readonly<DeepAiCouncilModeContractState>,
): ModeReductionResult<DeepAiCouncilModeContractState> {
  assertDeepAiCouncilProjectionState(state);
  const event = typedEventFromVerified(verified);
  const next = applyEvent(state, event);
  return Object.freeze({
    reducerId: DEEP_AI_COUNCIL_REDUCER_ID,
    stateVersion: DEEP_AI_COUNCIL_PROJECTION_SCHEMA_VERSION,
    appliedEventId: event.event_id,
    state: asModeContractState(next),
  });
}

export const DEEP_AI_COUNCIL_REDUCER_SURFACE: DeepAiCouncilReducerSurface =
  Object.freeze({
    reducers: DEEP_AI_COUNCIL_REDUCER_SET,
    reduce: reduceDeepAiCouncilVerifiedEvent,
  });

function assertReducerOwnership(
  reducers: ModeReducerSet<DeepAiCouncilModeContractState>,
): void {
  if (!sameCanonical(
    [...reducers.persistedFields].sort(compareString),
    [...PERSISTED_FIELDS].sort(compareString),
  )) {
    throw new DeepAiCouncilReducerError(
      'projection-field-undeclared',
      'Persisted fields must equal the closed council projection field set',
      'reducers.persistedFields',
    );
  }
  const owners = new Map<string, string>();
  for (const definition of reducers.definitions) {
    for (const field of definition.ownedFields) {
      if (owners.has(field)) {
        throw new DeepAiCouncilReducerError(
          'duplicate-owner',
          `Projection field ${field} has more than one reducer owner`,
          field,
        );
      }
      owners.set(field, definition.reducerId);
    }
  }
  if (PERSISTED_FIELDS.some((field) => !owners.has(field))) {
    throw new DeepAiCouncilReducerError(
      'projection-field-undeclared',
      'Every persisted council field must have one reducer owner',
      'reducers.definitions',
    );
  }
}

/** Probe the real mode reducer for determinism, immutability, and closed ownership. */
export function verifyDeepAiCouncilReducerSurface(
  surface: DeepAiCouncilReducerSurface,
  event: VerifiedLedgerEvent,
  state: DeepAiCouncilProjectionState,
): void {
  assertReducerOwnership(surface.reducers);
  const firstInput = immutableProjectionClone(state) as DeepAiCouncilProjectionState;
  const secondInput = immutableProjectionClone(state) as DeepAiCouncilProjectionState;
  const initialDigest = canonicalJson(firstInput);
  const first = surface.reduce(event, asModeContractState(firstInput));
  const second = surface.reduce(event, asModeContractState(secondInput));
  assertDeepAiCouncilProjectionState(first.state);
  assertDeepAiCouncilProjectionState(second.state);
  if (!isDeepFrozenProjection(first.state) || !isDeepFrozenProjection(second.state)) {
    throw new DeepAiCouncilReducerError(
      'projection-not-frozen',
      'Mode reducer outputs must be recursively frozen',
      'state',
    );
  }
  if (canonicalJson(firstInput) !== initialDigest || canonicalJson(secondInput) !== initialDigest) {
    throw new DeepAiCouncilReducerError(
      'state-mutated',
      'Mode reducer mutated its frozen input state',
      'state',
    );
  }
  if (!sameCanonical(first, second)) {
    throw new DeepAiCouncilReducerError(
      'reducer-nondeterministic',
      'Mode reducer produced different canonical outputs for equal inputs',
      'state',
    );
  }
  const definition = surface.reducers.definitions.find(
    (candidate) => candidate.reducerId === first.reducerId,
  );
  if (definition === undefined) {
    throw new DeepAiCouncilReducerError(
      'reducer-output-unowned',
      'Mode reducer returned an undeclared reducer identity',
      'reducerId',
    );
  }
  const unowned = topLevelChangedFields(state, first.state).find(
    (field) => !definition.ownedFields.includes(field),
  );
  if (unowned !== undefined) {
    throw new DeepAiCouncilReducerError(
      'reducer-output-unowned',
      `Mode reducer wrote unowned projection field ${unowned}`,
      unowned,
    );
  }
}

// ───────────────────────────────────────────────────────────────────
// 10. FULL AND INCREMENTAL REPLAY
// ───────────────────────────────────────────────────────────────────

/** Derive the semantic projection fingerprint without self-reference. */
export function deepAiCouncilProjectionIntegrityDigest(
  projection: DeepAiCouncilProjectionState,
): string {
  assertDeepAiCouncilProjectionState(projection);
  return sha256Bytes(canonicalBytes({
    schemaVersion: DEEP_AI_COUNCIL_PROJECTION_SCHEMA_VERSION,
    reducerVersion: DEEP_AI_COUNCIL_REDUCER_VERSION,
    codecVersion: DEEP_AI_COUNCIL_PROJECTION_CODEC_VERSION,
    orderingPolicyVersion: DEEP_AI_COUNCIL_ORDERING_POLICY_VERSION,
    projection,
  }));
}

function checkpointIntegrityDigest(
  projection: DeepAiCouncilProjectionState,
  sourceTailSequence: number,
  sourceTailDigest: string,
): string {
  return sha256Bytes(canonicalBytes({
    projectionDigest: deepAiCouncilProjectionIntegrityDigest(projection),
    sourceTailSequence,
    sourceTailDigest,
  }));
}

function rebuildReasons(
  options: DeepAiCouncilFoldOptions,
): DeepAiCouncilRebuildReasonCode[] {
  const reasons: DeepAiCouncilRebuildReasonCode[] = [];
  if (options.expectedSchemaVersion !== undefined
    && options.expectedSchemaVersion !== DEEP_AI_COUNCIL_PROJECTION_SCHEMA_VERSION) {
    reasons.push('projection-schema-mismatch');
  }
  if (options.expectedReducerVersion !== undefined
    && options.expectedReducerVersion !== DEEP_AI_COUNCIL_REDUCER_VERSION) {
    reasons.push('reducer-version-mismatch');
  }
  if (options.expectedCodecVersion !== undefined
    && options.expectedCodecVersion !== DEEP_AI_COUNCIL_PROJECTION_CODEC_VERSION) {
    reasons.push('codec-version-mismatch');
  }
  if (options.expectedOrderingPolicyVersion !== undefined
    && options.expectedOrderingPolicyVersion !== DEEP_AI_COUNCIL_ORDERING_POLICY_VERSION) {
    reasons.push('ordering-policy-mismatch');
  }
  const checkpoint = options.checkpoint;
  if (checkpoint !== undefined) {
    try {
      assertDeepAiCouncilProjectionState(checkpoint.projection);
    } catch {
      reasons.push('projection-schema-mismatch');
      return reasons;
    }
    if (checkpoint.projection.schemaVersion !== DEEP_AI_COUNCIL_PROJECTION_SCHEMA_VERSION) {
      reasons.push('projection-schema-mismatch');
    }
    if (checkpoint.projection.reducerVersion !== DEEP_AI_COUNCIL_REDUCER_VERSION) {
      reasons.push('reducer-version-mismatch');
    }
    if (checkpoint.projection.codecVersion !== DEEP_AI_COUNCIL_PROJECTION_CODEC_VERSION) {
      reasons.push('codec-version-mismatch');
    }
    if (checkpoint.projection.orderingPolicyVersion
      !== DEEP_AI_COUNCIL_ORDERING_POLICY_VERSION) {
      reasons.push('ordering-policy-mismatch');
    }
    if (checkpointIntegrityDigest(
      checkpoint.projection,
      checkpoint.sourceTailSequence,
      checkpoint.sourceTailDigest,
    ) !== checkpoint.integrityDigest) {
      reasons.push('checkpoint-digest-mismatch');
    }
    if (options.sourceTailSequence !== undefined
      && options.sourceTailSequence < checkpoint.sourceTailSequence) {
      reasons.push('source-truncated');
    }
    if (options.sourceTailDigest !== undefined
      && options.sourceTailSequence === checkpoint.sourceTailSequence
      && options.sourceTailDigest !== checkpoint.sourceTailDigest) {
      reasons.push('source-truncated');
    }
  }
  return [...new Set(reasons)].sort(compareString);
}

function projectedResult(
  projection: DeepAiCouncilProjectionState,
  sourceTailSequence: number,
  sourceTailDigest: string,
): DeepAiCouncilProjectedResult {
  const integrityDigest = deepAiCouncilProjectionIntegrityDigest(projection);
  const checkpoint: DeepAiCouncilProjectionCheckpoint = {
    projection,
    integrityDigest: checkpointIntegrityDigest(
      projection,
      sourceTailSequence,
      sourceTailDigest,
    ),
    sourceTailSequence,
    sourceTailDigest,
  };
  return immutableProjectionClone({
    outcome: 'projected',
    projection,
    integrityDigest,
    checkpoint,
  }) as unknown as DeepAiCouncilProjectedResult;
}

function rebuild(reasonCode: DeepAiCouncilRebuildReasonCode): DeepAiCouncilFoldResult {
  return Object.freeze({
    outcome: 'rebuild_required',
    reasonCodes: Object.freeze([reasonCode]),
  });
}

/** Fold typed events in strict source order into frozen, checkpointable projections. */
export function foldDeepAiCouncilEvents(
  events: readonly DeepAiCouncilLedgerEvent[],
  options: DeepAiCouncilFoldOptions = {},
): DeepAiCouncilFoldResult {
  const reasons = rebuildReasons(options);
  if (reasons.length > 0) {
    return Object.freeze({ outcome: 'rebuild_required', reasonCodes: Object.freeze(reasons) });
  }
  const validated = events.map(validateTypedEvent);
  if (validated.some((event, index) => {
    if (index === 0) return false;
    const previous = validated[index - 1];
    if (event.stream_sequence < previous.stream_sequence) return true;
    return event.stream_sequence === previous.stream_sequence
      && (
        event.event_id !== previous.event_id
        || eventDigest(event) !== eventDigest(previous)
      );
  })) {
    return rebuild('event-order-invalid');
  }
  if (options.checkpoint !== undefined) {
    assertProjectionCrossFieldConsistency(options.checkpoint.projection);
    const checkpointTail = options.checkpoint.projection.seenEvents.at(-1);
    if ((checkpointTail?.streamSequence ?? 0) !== options.checkpoint.sourceTailSequence
      || (checkpointTail?.eventDigest ?? ZERO_DIGEST)
        !== options.checkpoint.sourceTailDigest) {
      return rebuild('checkpoint-digest-mismatch');
    }
  }
  let projection = options.checkpoint?.projection ?? createDeepAiCouncilProjectionState();
  let expectedSequence = (options.checkpoint?.sourceTailSequence ?? 0) + 1;
  let tailDigest = options.checkpoint?.sourceTailDigest ?? ZERO_DIGEST;
  const streamId = projection.seenEvents.at(-1)?.streamId ?? validated[0]?.stream_id ?? null;
  for (const event of validated) {
    const seen = projection.seenEvents.find((entry) => entry.eventId === event.event_id);
    if (seen !== undefined) {
      if (seen.eventDigest !== eventDigest(event)) {
        throw new DeepAiCouncilReducerError(
          'duplicate-event-conflict',
          'A duplicate event identity changed canonical bytes',
          'seenEvents',
        );
      }
      continue;
    }
    if (streamId !== null && event.stream_id !== streamId) {
      return rebuild('stream-identity-mismatch');
    }
    if (event.stream_sequence < expectedSequence) return rebuild('event-order-invalid');
    if (event.stream_sequence > expectedSequence
      && options.requireContiguousTail !== false) {
      return rebuild('cursor-gap');
    }
    if (event.payload.prevEventHash !== tailDigest) {
      return rebuild('predecessor-digest-mismatch');
    }
    projection = applyEvent(projection, event);
    tailDigest = eventDigest(event);
    expectedSequence = event.stream_sequence + 1;
  }
  const sourceTailSequence = projection.seenEvents.at(-1)?.streamSequence
    ?? options.checkpoint?.sourceTailSequence
    ?? 0;
  return projectedResult(projection, sourceTailSequence, tailDigest);
}

// ───────────────────────────────────────────────────────────────────
// 11. SHADOW-ONLY LEGACY VIEW
// ───────────────────────────────────────────────────────────────────

/** Project the complete canonical legacy comparison structure without authority. */
export function projectDeepAiCouncilLegacyView(
  projection: DeepAiCouncilProjectionState,
): DeepAiCouncilLegacyProjection {
  assertDeepAiCouncilProjectionState(projection);
  const legacy: DeepAiCouncilLegacyProjection = {
    authority: 'shadow-only',
    legacyAuthority: 'unchanged',
    roundId: projection.run.roundId,
    status: projection.status.state,
    seatCount: projection.councilSeats.seats.length,
    proposalCount: projection.councilSeats.proposals.length,
    selectedCandidateId: projection.convergence.presentation.selectedCandidateId,
    convergenceOutcome: projection.convergence.outcome,
    artifactIds: projection.artifacts.records.map((artifact) => artifact.artifactId),
    gateVerdict: projection.testGate.verdict,
    terminal: projection.status.terminal,
    lossyFields: [
      'private-seat-evidence',
      'raw-critique-signals',
      'raw-pairwise-ballots',
      'stance-lineage',
      'minority-and-veto-lineage',
    ],
  };
  assertDeepAiCouncilLegacyProjection(legacy);
  return immutableProjectionClone(legacy) as DeepAiCouncilLegacyProjection;
}

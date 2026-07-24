// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Review Reducer
// ───────────────────────────────────────────────────────────────────

import {
  DeepReviewEventStems,
  DeepReviewWireEventTypes,
  createDeepReviewEventRegistry,
  isDeepReviewEventStem,
} from '../deep-review-ledger-schema/index.js';
import {
  canonicalBytes,
  canonicalJson,
  readEvent,
  sha256Bytes,
} from '../event-envelope/index.js';
import {
  DeepReviewReducerError,
  assertDeepReviewLegacyProjection,
  assertDeepReviewProjectionState,
  immutableProjectionClone,
  isDeepFrozenProjection,
} from './deep-review-projection-schema.js';

import type { VerifiedLedgerEvent } from '../authorized-ledger/index.js';
import type {
  DeepReviewEventEnvelope,
  DeepReviewEventStem,
  DeepReviewLedgerEvent,
  DeepReviewLedgerPayload,
} from '../deep-review-ledger-schema/index.js';
import type { JsonObject } from '../event-envelope/index.js';
import type {
  ModeContract,
  ModeReducerSet,
  ModeReductionResult,
} from '../mode-contracts/index.js';
import type {
  DeepReviewArtifactRecord,
  DeepReviewConvergenceEvaluation,
  DeepReviewEvidenceRecord,
  DeepReviewFindingProjection,
  DeepReviewFindingRecord,
  DeepReviewFoldOptions,
  DeepReviewFoldResult,
  DeepReviewIterationConvergenceProjection,
  DeepReviewLegacyProjection,
  DeepReviewModeStatus,
  DeepReviewPersistedField,
  DeepReviewProjectedResult,
  DeepReviewProjectionCheckpoint,
  DeepReviewProjectionFieldOwnership,
  DeepReviewProjectionState,
  DeepReviewRebuildReasonCode,
  DeepReviewSeenEvent,
  DeepReviewStatusProjection,
  DeepReviewStatusTransition,
  SharedReviewLoopBackboneInput,
  SharedReviewLoopBackboneResult,
  SharedReviewLoopModeConfiguration,
} from './deep-review-projection-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. PUBLIC CONTRACT CONSTANTS
// ───────────────────────────────────────────────────────────────────

export const DEEP_REVIEW_PROJECTION_SCHEMA_VERSION = 'deep-review-projection@1' as const;
export const DEEP_REVIEW_REDUCER_VERSION = 'deep-review-reducer@1' as const;
export const DEEP_REVIEW_PROJECTION_CODEC_VERSION = 'canonical-json@1' as const;
export const DEEP_REVIEW_ORDERING_POLICY_VERSION = 'causal-input-order@1' as const;
export const DEEP_REVIEW_REDUCER_ID = 'deep-review:projection-fold' as const;

export const DEEP_REVIEW_SHARED_REVIEW_LOOP_CONFIGURATION: SharedReviewLoopModeConfiguration =
  Object.freeze({
    mode: 'review',
    requiredCoveragePolicy: 'all-required-cells',
    hardVetoClasses: Object.freeze(['build', 'regression', 'schema', 'security']),
    terminalDecisionPolicy: 'typed-transition-only',
  });

const eventRegistry = createDeepReviewEventRegistry();
const EMPTY_DIGEST = sha256Bytes(canonicalBytes([]));
const HARD_VETO_CLASS_SEPARATORS = '-._:/@';
type DeepReviewModeContractState = DeepReviewProjectionState & JsonObject;

const PERSISTED_FIELDS = Object.freeze([
  'schemaVersion',
  'reducerVersion',
  'codecVersion',
  'orderingPolicyVersion',
  'run',
  'reviewLoop',
  'findingLedger',
  'artifactIndex',
  'status',
  'cursors',
  'seenEvents',
] as const satisfies readonly DeepReviewPersistedField[]);

type ProjectionPlane = 'reviewLoop' | 'findings' | 'artifactIndex' | 'status';

export const DEEP_REVIEW_EVENT_ROUTING = Object.freeze({
  'deep_review.run_initialized': Object.freeze(['reviewLoop', 'status']),
  'deep_review.run_resumed': Object.freeze(['status']),
  'deep_review.run_restarted': Object.freeze(['status']),
  'deep_review.scope_resolved': Object.freeze(['reviewLoop', 'status']),
  'deep_review.dimension_ordered': Object.freeze(['reviewLoop', 'status']),
  'deep_review.protocol_plan_recorded': Object.freeze(['reviewLoop', 'status']),
  'deep_review.dimension_pass_started': Object.freeze(['reviewLoop', 'status']),
  'deep_review.dimension_pass_completed': Object.freeze(['reviewLoop', 'status']),
  'deep_review.finding_candidate_emitted': Object.freeze([
    'findings', 'artifactIndex', 'status',
  ]),
  'deep_review.evidence_observed': Object.freeze([
    'findings', 'artifactIndex', 'status',
  ]),
  'deep_review.evidence_reconciled': Object.freeze([
    'findings', 'artifactIndex', 'status',
  ]),
  'deep_review.claim_adjudication_recorded': Object.freeze([
    'findings', 'artifactIndex', 'status',
  ]),
  'deep_review.finding_lineage_recorded': Object.freeze(['findings', 'status']),
  'deep_review.finding_state_changed': Object.freeze(['findings', 'status']),
  'deep_review.review_depth_recorded': Object.freeze(['reviewLoop', 'status']),
  'deep_review.convergence_evaluated': Object.freeze(['reviewLoop', 'status']),
  'deep_review.graph_convergence_evaluated': Object.freeze(['reviewLoop', 'status']),
  'deep_review.blocked_stop_recorded': Object.freeze(['reviewLoop', 'status']),
  'deep_review.pause_recorded': Object.freeze(['reviewLoop', 'status']),
  'deep_review.recovery_started': Object.freeze(['reviewLoop', 'status']),
  'deep_review.synthesis_started': Object.freeze(['reviewLoop', 'status']),
  'deep_review.review_report_committed': Object.freeze(['artifactIndex', 'status']),
  'deep_review.continuity_save_requested': Object.freeze(['artifactIndex']),
  'deep_review.continuity_save_completed': Object.freeze(['artifactIndex']),
  'deep_review.continuity_save_failed': Object.freeze(['artifactIndex', 'status']),
  'deep_review.run_completed': Object.freeze(['reviewLoop', 'status']),
} as const satisfies Readonly<Record<DeepReviewEventStem, readonly ProjectionPlane[]>>);

function stemsForPlane(plane: ProjectionPlane): readonly DeepReviewEventStem[] {
  return Object.freeze(DeepReviewEventStems.filter((stem) => (
    DEEP_REVIEW_EVENT_ROUTING[stem].includes(plane as never)
  )));
}

export const DEEP_REVIEW_PROJECTION_FIELD_OWNERSHIP = Object.freeze([
  {
    field: 'schemaVersion', ownerReducerId: DEEP_REVIEW_REDUCER_ID,
    inputStems: Object.freeze([]), foldAlgebra: 'constant', immutableOutput: true,
  },
  {
    field: 'reducerVersion', ownerReducerId: DEEP_REVIEW_REDUCER_ID,
    inputStems: Object.freeze([]), foldAlgebra: 'constant', immutableOutput: true,
  },
  {
    field: 'codecVersion', ownerReducerId: DEEP_REVIEW_REDUCER_ID,
    inputStems: Object.freeze([]), foldAlgebra: 'constant', immutableOutput: true,
  },
  {
    field: 'orderingPolicyVersion', ownerReducerId: DEEP_REVIEW_REDUCER_ID,
    inputStems: Object.freeze([]), foldAlgebra: 'constant', immutableOutput: true,
  },
  {
    field: 'run', ownerReducerId: DEEP_REVIEW_REDUCER_ID,
    inputStems: stemsForPlane('reviewLoop'), foldAlgebra: 'insert-sorted-and-derive',
    immutableOutput: true,
  },
  {
    field: 'reviewLoop', ownerReducerId: DEEP_REVIEW_REDUCER_ID,
    inputStems: stemsForPlane('reviewLoop'), foldAlgebra: 'insert-sorted-and-derive',
    immutableOutput: true,
  },
  {
    field: 'findingLedger', ownerReducerId: DEEP_REVIEW_REDUCER_ID,
    inputStems: stemsForPlane('findings'), foldAlgebra: 'insert-sorted-and-derive',
    immutableOutput: true,
  },
  {
    field: 'artifactIndex', ownerReducerId: DEEP_REVIEW_REDUCER_ID,
    inputStems: stemsForPlane('artifactIndex'), foldAlgebra: 'insert-sorted-and-derive',
    immutableOutput: true,
  },
  {
    field: 'status', ownerReducerId: DEEP_REVIEW_REDUCER_ID,
    inputStems: stemsForPlane('status'), foldAlgebra: 'insert-sorted-and-derive',
    immutableOutput: true,
  },
  {
    field: 'cursors', ownerReducerId: DEEP_REVIEW_REDUCER_ID,
    inputStems: DeepReviewEventStems, foldAlgebra: 'insert-sorted-and-derive',
    immutableOutput: true,
  },
  {
    field: 'seenEvents', ownerReducerId: DEEP_REVIEW_REDUCER_ID,
    inputStems: DeepReviewEventStems, foldAlgebra: 'insert-sorted', immutableOutput: true,
  },
] as const satisfies readonly DeepReviewProjectionFieldOwnership[]);

export const DEEP_REVIEW_REDUCER_SET: ModeReducerSet<DeepReviewModeContractState> =
  Object.freeze({
    persistedFields: PERSISTED_FIELDS,
    definitions: Object.freeze([Object.freeze({
      reducerId: DEEP_REVIEW_REDUCER_ID,
      reducerVersion: DEEP_REVIEW_REDUCER_VERSION,
      stateVersion: DEEP_REVIEW_PROJECTION_SCHEMA_VERSION,
      ownedFields: PERSISTED_FIELDS,
      inputEventTypes: Object.freeze(
        DeepReviewEventStems.map((stem) => DeepReviewWireEventTypes[stem]),
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

function payloadFor<TStem extends DeepReviewEventStem>(
  event: DeepReviewLedgerEvent,
  stem: TStem,
): DeepReviewLedgerPayload<TStem> {
  if (event.payload.stem !== stem) {
    throw new DeepReviewReducerError(
      'event-not-deep-review',
      `Expected ${stem}, received ${event.payload.stem}`,
      'payload.stem',
    );
  }
  return event.payload as DeepReviewLedgerPayload<TStem>;
}

function assertNeverStem(stem: never): never {
  throw new DeepReviewReducerError(
    'event-not-deep-review',
    `Unhandled deep-review event stem: ${String(stem)}`,
    'payload.stem',
  );
}

function eventDigest(event: DeepReviewLedgerEvent): string {
  return sha256Bytes(canonicalBytes(event));
}

interface CanonicalEventPosition {
  readonly event_id: string;
  readonly causal_position: number;
}

function compareEvents(left: CanonicalEventPosition, right: CanonicalEventPosition): number {
  return compareNumber(left.causal_position, right.causal_position)
    || compareString(left.event_id, right.event_id);
}

function producerEventPosition(
  seenEvents: readonly DeepReviewSeenEvent[],
  producerEventId: string,
): CanonicalEventPosition {
  const causalPosition = seenEvents.findIndex((event) => event.eventId === producerEventId);
  if (causalPosition === -1) {
    throw new DeepReviewReducerError(
      'referential-integrity',
      'Temporal projection records require captured producer-event provenance',
      'seenEvents',
    );
  }
  return {
    event_id: producerEventId,
    causal_position: causalPosition,
  };
}

function compareProducerEvents(
  seenEvents: readonly DeepReviewSeenEvent[],
  leftEventId: string,
  rightEventId: string,
): number {
  return compareEvents(
    producerEventPosition(seenEvents, leftEventId),
    producerEventPosition(seenEvents, rightEventId),
  );
}

function establishedRunStreamId(
  run: DeepReviewProjectionState['run'],
  seenEvents: readonly DeepReviewSeenEvent[],
): string {
  const initialized = run.initializationEventId === null
    ? undefined
    : seenEvents.find((event) => event.eventId === run.initializationEventId);
  if (initialized === undefined || initialized.stem !== 'deep_review.run_initialized') {
    throw new DeepReviewReducerError(
      'referential-integrity',
      'Run stream identity requires its captured initialization event',
      'run.initializationEventId',
    );
  }
  return initialized.streamId;
}

function validateTypedEvent(event: DeepReviewLedgerEvent): DeepReviewLedgerEvent {
  try {
    const read = readEvent(canonicalBytes(event), eventRegistry);
    const effective = read.effective.envelope;
    const payload = effective.payload;
    if (!isDeepReviewEventStem(payload.stem)
      || effective.event_type !== DeepReviewWireEventTypes[payload.stem]) {
      throw new DeepReviewReducerError(
        'event-not-deep-review',
        'Verified event does not carry a registered deep-review stem',
        'event_type',
      );
    }
    return effective as DeepReviewLedgerEvent;
  } catch (error: unknown) {
    if (error instanceof DeepReviewReducerError) throw error;
    throw new DeepReviewReducerError(
      'event-schema-invalid',
      'Deep-review event failed the real typed-ledger registry',
      'event',
    );
  }
}

function typedEventFromVerified(verified: VerifiedLedgerEvent): DeepReviewLedgerEvent {
  const envelope = verified.event.effective.envelope;
  const payload = envelope.payload;
  if (!isDeepReviewEventStem(payload.stem)
    || envelope.event_type !== DeepReviewWireEventTypes[payload.stem]) {
    throw new DeepReviewReducerError(
      'event-not-deep-review',
      'Mode reducer received a verified event outside the deep-review union',
      'event_type',
    );
  }
  return validateTypedEvent(envelope as DeepReviewLedgerEvent);
}

function asModeContractState(state: DeepReviewProjectionState): DeepReviewModeContractState {
  assertDeepReviewProjectionState(state);
  return state as DeepReviewModeContractState;
}

function topLevelChangedFields(
  before: DeepReviewProjectionState,
  after: DeepReviewProjectionState,
): DeepReviewPersistedField[] {
  return PERSISTED_FIELDS.filter((field) => !sameCanonical(before[field], after[field]));
}

// ───────────────────────────────────────────────────────────────────
// 3. INITIAL STATE
// ───────────────────────────────────────────────────────────────────

/** Create the immutable empty state accepted by the shared mode reducer contract. */
export function createDeepReviewProjectionState(): DeepReviewProjectionState {
  const state: DeepReviewProjectionState = {
    schemaVersion: DEEP_REVIEW_PROJECTION_SCHEMA_VERSION,
    reducerVersion: DEEP_REVIEW_REDUCER_VERSION,
    codecVersion: DEEP_REVIEW_PROJECTION_CODEC_VERSION,
    orderingPolicyVersion: DEEP_REVIEW_ORDERING_POLICY_VERSION,
    run: {
      runId: null,
      sessionId: null,
      generation: 0,
      target: null,
      maxIterations: 0,
      convergencePolicyVersion: null,
      reviewModeContractDigest: null,
      initializationEventId: null,
    },
    reviewLoop: {
      configuration: DEEP_REVIEW_SHARED_REVIEW_LOOP_CONFIGURATION,
      scope: {
        targetSetDigest: null,
        scopeClass: null,
        targets: [],
        orderedDimensionIds: [],
        scopeEvidenceRefs: [],
        orderingPolicyVersion: null,
      },
      coverageCells: [],
      passes: [],
      obligations: [],
      evaluations: [],
      currentIterationId: null,
      eligibility: 'INDETERMINATE',
      outcome: 'active',
      terminalDecision: null,
      blockerIds: [],
      lastAppliedSequence: 0,
    },
    findingLedger: {
      findings: [],
      evidence: [],
      lineage: [],
      activeFindingIds: [],
      hardVetoFindingIds: [],
    },
    artifactIndex: { artifacts: [] },
    status: {
      state: 'planned',
      terminal: false,
      health: 'healthy',
      activeContractVersions: [],
      lastAppliedSequence: 0,
      blockingReason: null,
      shadowParityState: 'not-run',
      provenance: [],
    },
    cursors: { reviewLoop: 0, findings: 0, artifactIndex: 0, status: 0 },
    seenEvents: [],
  };
  assertDeepReviewProjectionState(state);
  return immutableProjectionClone(state) as DeepReviewProjectionState;
}

// ───────────────────────────────────────────────────────────────────
// 4. RUN AND SHARED REVIEW-LOOP FOLDS
// ───────────────────────────────────────────────────────────────────

function assertRunIdentity(
  state: DeepReviewProjectionState,
  event: DeepReviewLedgerEvent,
): void {
  if (state.run.runId === null && event.payload.stem !== 'deep_review.run_initialized') {
    throw new DeepReviewReducerError(
      'run-not-initialized',
      'A run-initialized event must precede every deep-review event',
      'run',
    );
  }
  if (state.run.runId !== null && (
    state.run.runId !== event.payload.scope.runId
    || state.run.sessionId !== event.payload.scope.sessionId
  )) {
    throw new DeepReviewReducerError(
      'run-identity-conflict',
      'One projection cannot fold events from different run or session identities',
      'run',
    );
  }
}

function foldRun(
  state: DeepReviewProjectionState,
  event: DeepReviewLedgerEvent,
): DeepReviewProjectionState['run'] {
  if (event.payload.stem === 'deep_review.run_initialized') {
    const payload = payloadFor(event, 'deep_review.run_initialized');
    if (state.run.initializationEventId !== null
      && state.run.initializationEventId !== event.event_id) {
      throw new DeepReviewReducerError(
        'duplicate-terminal-event',
        'A projection accepts exactly one run initialization',
        'run.initializationEventId',
      );
    }
    return {
      runId: payload.scope.runId,
      sessionId: payload.scope.sessionId,
      generation: payload.scope.generation,
      target: payload.data.target,
      maxIterations: payload.data.maxIterations,
      convergencePolicyVersion: payload.data.convergencePolicyVersion,
      reviewModeContractDigest: payload.data.reviewModeContractDigest,
      initializationEventId: event.event_id,
    };
  }
  if (event.payload.stem === 'deep_review.run_resumed'
    || event.payload.stem === 'deep_review.run_restarted') {
    return { ...state.run, generation: event.payload.scope.generation };
  }
  return state.run;
}

function upsertCoverageCell(
  reviewLoop: DeepReviewIterationConvergenceProjection,
  event: DeepReviewEventEnvelope<
    'deep_review.dimension_pass_started' | 'deep_review.dimension_pass_completed'
  >,
  seenEvents: readonly DeepReviewSeenEvent[],
): DeepReviewIterationConvergenceProjection {
  const payload = event.payload;
  const status = payload.data.passStatus;
  const candidate = {
    iterationId: payload.scope.iterationId,
    dimensionId: payload.scope.dimensionId,
    required: reviewLoop.scope.orderedDimensionIds.includes(payload.scope.dimensionId),
    status,
    passNumber: payload.data.passNumber,
    searchCoverageDigest: payload.data.searchCoverageDigest,
    producerEventId: event.event_id,
  };
  const cells = reviewLoop.coverageCells.filter((entry) => !(
    entry.iterationId === candidate.iterationId
    && entry.dimensionId === candidate.dimensionId
  ));
  cells.push(candidate);
  cells.sort((left, right) => (
    compareString(left.iterationId, right.iterationId)
      || compareString(left.dimensionId, right.dimensionId)
  ));
  const passes = [...reviewLoop.passes, {
    iterationId: payload.scope.iterationId,
    dimensionId: payload.scope.dimensionId,
    passNumber: payload.data.passNumber,
    targetRefs: sortStrings(payload.data.targetRefs),
    filesReviewed: sortStrings(payload.data.filesReviewed),
    searchCoverageDigest: payload.data.searchCoverageDigest,
    status,
    nextFocusRef: payload.data.nextFocusRef,
    producerEventId: event.event_id,
  }];
  passes.sort((left, right) => compareProducerEvents(
    seenEvents,
    left.producerEventId,
    right.producerEventId,
  ));
  return {
    ...reviewLoop,
    coverageCells: cells,
    passes,
    currentIterationId: payload.scope.iterationId,
  };
}

function upsertObligations(
  existing: DeepReviewIterationConvergenceProjection['obligations'],
  incoming: DeepReviewIterationConvergenceProjection['obligations'],
): DeepReviewIterationConvergenceProjection['obligations'] {
  const byId = new Map(existing.map((entry) => [entry.obligationId, entry]));
  for (const obligation of incoming) byId.set(obligation.obligationId, obligation);
  return [...byId.values()].sort(
    (left, right) => compareString(left.obligationId, right.obligationId),
  );
}

function foldReviewLoopEvent(
  reviewLoop: DeepReviewIterationConvergenceProjection,
  event: DeepReviewLedgerEvent,
  seenEvents: readonly DeepReviewSeenEvent[],
): DeepReviewIterationConvergenceProjection {
  switch (event.payload.stem) {
    case 'deep_review.scope_resolved': {
      const payload = payloadFor(event, 'deep_review.scope_resolved');
      return {
        ...reviewLoop,
        scope: {
          ...reviewLoop.scope,
          targetSetDigest: payload.data.targetSetDigest,
          scopeClass: payload.data.scopeClass,
          targets: [...payload.data.selectedTargets],
          scopeEvidenceRefs: sortStrings(payload.data.scopeEvidenceRefs),
        },
      };
    }
    case 'deep_review.dimension_ordered': {
      const payload = payloadFor(event, 'deep_review.dimension_ordered');
      return {
        ...reviewLoop,
        scope: {
          ...reviewLoop.scope,
          orderedDimensionIds: [...payload.data.orderedDimensionIds],
          scopeEvidenceRefs: sortStrings([
            ...reviewLoop.scope.scopeEvidenceRefs,
            ...payload.data.scopeEvidenceRefs,
          ]),
          orderingPolicyVersion: payload.data.orderingPolicyVersion,
        },
      };
    }
    case 'deep_review.protocol_plan_recorded': {
      const payload = payloadFor(event, 'deep_review.protocol_plan_recorded');
      if (payload.data.gateClass === 'informational'
        || payload.data.applicability === 'not-applicable') return reviewLoop;
      return {
        ...reviewLoop,
        obligations: upsertObligations(reviewLoop.obligations, [{
          obligationId: `protocol:${payload.scope.protocolId}`,
          kind: 'protocol',
          required: true,
          status: 'unresolved',
          producerEventId: event.event_id,
        }]),
      };
    }
    case 'deep_review.dimension_pass_started':
    case 'deep_review.dimension_pass_completed':
      return upsertCoverageCell(
        reviewLoop,
        event as DeepReviewEventEnvelope<
          'deep_review.dimension_pass_started' | 'deep_review.dimension_pass_completed'
        >,
        seenEvents,
      );
    case 'deep_review.review_depth_recorded': {
      const payload = payloadFor(event, 'deep_review.review_depth_recorded');
      const unresolved = new Set([
        ...payload.data.deferredBugClasses,
        ...payload.data.blockedBugClasses,
      ]);
      const completed = new Set([
        ...payload.data.coveredBugClasses,
        ...payload.data.ruledOutBugClasses,
      ]);
      const obligations = payload.data.requiredBugClasses.map((bugClass) => ({
        obligationId: `review-depth:${bugClass}`,
        kind: 'review-depth' as const,
        required: true,
        status: unresolved.has(bugClass)
          ? 'blocked' as const
          : completed.has(bugClass)
            ? 'resolved' as const
            : 'unresolved' as const,
        producerEventId: event.event_id,
      }));
      return {
        ...reviewLoop,
        obligations: upsertObligations(reviewLoop.obligations, obligations),
        currentIterationId: payload.scope.iterationId,
      };
    }
    case 'deep_review.blocked_stop_recorded': {
      const payload = payloadFor(event, 'deep_review.blocked_stop_recorded');
      const obligations = payload.data.blockedGateIds.map((gateId) => ({
        obligationId: `gate:${gateId}`,
        kind: 'coverage' as const,
        required: true,
        status: 'blocked' as const,
        producerEventId: event.event_id,
      }));
      return {
        ...reviewLoop,
        obligations: upsertObligations(reviewLoop.obligations, obligations),
        blockerIds: sortStrings([...reviewLoop.blockerIds, ...payload.data.blockedGateIds]),
        outcome: 'blocked',
      };
    }
    case 'deep_review.run_completed': {
      const payload = payloadFor(event, 'deep_review.run_completed');
      return {
        ...reviewLoop,
        terminalDecision: payload.data.verdict,
        outcome: payload.data.verdict === 'pass'
          ? 'converged'
          : payload.data.verdict === 'incomplete'
            ? 'incomplete'
            : 'blocked',
      };
    }
    case 'deep_review.run_initialized':
    case 'deep_review.run_resumed':
    case 'deep_review.run_restarted':
    case 'deep_review.pause_recorded':
    case 'deep_review.recovery_started':
    case 'deep_review.synthesis_started':
      return reviewLoop;
    case 'deep_review.convergence_evaluated':
    case 'deep_review.graph_convergence_evaluated':
    case 'deep_review.finding_candidate_emitted':
    case 'deep_review.evidence_observed':
    case 'deep_review.evidence_reconciled':
    case 'deep_review.claim_adjudication_recorded':
    case 'deep_review.finding_lineage_recorded':
    case 'deep_review.finding_state_changed':
    case 'deep_review.review_report_committed':
    case 'deep_review.continuity_save_requested':
    case 'deep_review.continuity_save_completed':
    case 'deep_review.continuity_save_failed':
      return reviewLoop;
  }
  return assertNeverStem((event as DeepReviewLedgerEvent).payload.stem as never);
}

// ───────────────────────────────────────────────────────────────────
// 5. FINDING AND EVIDENCE FOLDS
// ───────────────────────────────────────────────────────────────────

function isHardVetoClass(findingClass: string): boolean {
  const normalized = findingClass.toLowerCase();
  return DEEP_REVIEW_SHARED_REVIEW_LOOP_CONFIGURATION.hardVetoClasses.some(
    (veto) => normalized === veto || (
      normalized.startsWith(veto)
      && HARD_VETO_CLASS_SEPARATORS.includes(normalized.charAt(veto.length))
    ),
  );
}

function findingOwnedEventIds(
  ledger: DeepReviewFindingProjection,
  finding: DeepReviewFindingRecord,
): Set<string> {
  return new Set([
    finding.candidateEventId,
    ...(finding.adjudicationEventId === null ? [] : [finding.adjudicationEventId]),
    ...ledger.lineage
      .filter((entry) => entry.findingId === finding.findingId)
      .map((entry) => entry.producerEventId),
  ]);
}

function evidenceStrength(
  evidenceType: DeepReviewFindingRecord['evidenceType'],
  scope: DeepReviewFindingRecord['evidenceScope'],
): number {
  const typeStrength = evidenceType === 'runtime' || evidenceType === 'test'
    ? 1
    : evidenceType === 'inspection' ? 0.7 : 0.5;
  const scopeStrength = scope === 'direct' ? 1 : scope === 'indirect' ? 0.6 : 0.4;
  return Number((typeStrength * scopeStrength).toFixed(6));
}

function presentationSeverity(
  finding: Pick<
    DeepReviewFindingRecord,
    'adjudicationOutcome' | 'confidence' | 'hardVeto' | 'impact' | 'lifecycle'
  >,
): DeepReviewFindingRecord['presentationSeverity'] {
  if (finding.lifecycle === 'dismissed' || finding.lifecycle === 'fixed'
    || finding.adjudicationOutcome === 'disproved'
    || finding.adjudicationOutcome === 'rejected') return 'none';
  if (finding.hardVeto && finding.lifecycle === 'accepted') return 'P0';
  if (finding.lifecycle !== 'accepted') return 'none';
  if (finding.impact >= 0.8 && finding.confidence >= 0.6) return 'P1';
  return 'P2';
}

function foldCandidate(
  ledger: DeepReviewFindingProjection,
  state: DeepReviewProjectionState,
  event: DeepReviewEventEnvelope<'deep_review.finding_candidate_emitted'>,
): DeepReviewFindingProjection {
  const payload = event.payload;
  if (!state.reviewLoop.passes.some(
    (pass) => pass.producerEventId === payload.data.sourcePassEventId
      && pass.iterationId === payload.scope.iterationId
      && pass.dimensionId === payload.scope.dimensionId,
  )) {
    throw new DeepReviewReducerError(
      'referential-integrity',
      'Finding candidates must cite a pass from their own iteration and dimension',
      'findingLedger.findings.sourcePassEventId',
    );
  }
  if (payload.data.evidenceRefs.some((evidenceId) => ledger.evidence.some(
    (evidence) => evidence.evidenceId === evidenceId
      && evidence.candidateId !== payload.scope.candidateId,
  ))) {
    throw new DeepReviewReducerError(
      'referential-integrity',
      'Finding candidates cannot cite evidence owned by another candidate',
      'findingLedger.findings.evidenceRefs',
    );
  }
  const findingId = `candidate:${payload.scope.candidateId}`;
  const candidate: DeepReviewFindingRecord = {
    findingId,
    candidateId: payload.scope.candidateId,
    dimensionId: payload.scope.dimensionId,
    sourcePassEventId: payload.data.sourcePassEventId,
    claimDigest: payload.data.claimTextDigest,
    findingClass: payload.data.findingClass,
    evidenceRefs: sortStrings(payload.data.evidenceRefs),
    impact: payload.data.impact,
    confidence: payload.data.rawConfidence,
    reachability: payload.data.reachability,
    exploitability: payload.data.exploitability,
    evidenceStrength: evidenceStrength(payload.data.evidenceType, payload.data.evidenceScope),
    evidenceType: payload.data.evidenceType,
    evidenceScope: payload.data.evidenceScope,
    lifecycle: 'candidate',
    adjudicationOutcome: null,
    semanticFingerprint: payload.data.semanticFingerprint,
    hardVeto: isHardVetoClass(payload.data.findingClass),
    presentationSeverity: 'none',
    candidateEventId: event.event_id,
    adjudicationEventId: null,
    predecessorEventId: null,
  };
  const existing = ledger.findings.find((finding) => finding.candidateId === candidate.candidateId);
  if (existing !== undefined && !sameCanonical(existing, candidate)) {
    throw new DeepReviewReducerError(
      'projection-field-invalid',
      'A candidate identity cannot resolve to conflicting finding data',
      'findingLedger.findings',
    );
  }
  const findings = existing === undefined ? [...ledger.findings, candidate] : [...ledger.findings];
  findings.sort((left, right) => compareString(left.findingId, right.findingId));
  return { ...ledger, findings };
}

function foldEvidence(
  ledger: DeepReviewFindingProjection,
  event: DeepReviewEventEnvelope<
    'deep_review.evidence_observed' | 'deep_review.evidence_reconciled'
  >,
  seenEvents: readonly DeepReviewSeenEvent[],
): DeepReviewFindingProjection {
  const payload = event.payload;
  const owner = ledger.findings.find(
    (finding) => finding.candidateId === payload.scope.candidateId
      && finding.dimensionId === payload.scope.dimensionId,
  );
  if (owner === undefined) {
    throw new DeepReviewReducerError(
      'referential-integrity',
      'Evidence must belong to a captured candidate in the same dimension',
      'findingLedger.evidence.candidateId',
    );
  }
  const identityOwner = ledger.evidence.find(
    (evidence) => evidence.evidenceId === payload.scope.evidenceId,
  );
  if (identityOwner !== undefined
    && identityOwner.candidateId !== payload.scope.candidateId) {
    throw new DeepReviewReducerError(
      'referential-integrity',
      'An evidence identity cannot belong to more than one candidate',
      'findingLedger.evidence.evidenceId',
    );
  }
  if (ledger.findings.some(
    (finding) => finding.candidateId !== payload.scope.candidateId
      && finding.evidenceRefs.includes(payload.scope.evidenceId),
  )) {
    throw new DeepReviewReducerError(
      'referential-integrity',
      'Evidence identities cannot satisfy another candidate\'s references',
      'findingLedger.findings.evidenceRefs',
    );
  }
  const candidate: DeepReviewEvidenceRecord = {
    evidenceId: payload.scope.evidenceId,
    candidateId: payload.scope.candidateId,
    locator: payload.data.locator,
    observationKind: payload.data.observationKind,
    rawResultDigest: payload.data.rawResultDigest,
    sourceDigest: payload.data.sourceDigest,
    contentDigest: payload.data.contentDigest,
    independentEvidenceClass: payload.data.independentEvidenceClass,
    causalProximityStatus: payload.data.causalProximityStatus,
    stabilityStatus: payload.data.stabilityStatus,
    relevanceStatus: payload.data.relevanceStatus,
    supersedesEvidenceEventId: payload.data.supersedesEvidenceEventId,
    producerEventId: event.event_id,
  };
  if (candidate.supersedesEvidenceEventId !== null) {
    const predecessor = ledger.evidence.find(
      (evidence) => evidence.producerEventId === candidate.supersedesEvidenceEventId
        && evidence.candidateId === candidate.candidateId,
    );
    if (predecessor === undefined) {
      throw new DeepReviewReducerError(
        'referential-integrity',
        'Reconciled evidence must cite a producer owned by the same candidate',
        'findingLedger.evidence.supersedesEvidenceEventId',
      );
    }
    if (predecessor.evidenceId !== candidate.evidenceId) {
      throw new DeepReviewReducerError(
        'referential-integrity',
        'Evidence reconciliation must preserve its logical evidence identity',
        'findingLedger.evidence.evidenceId',
      );
    }
  }
  const sameProducer = ledger.evidence.find(
    (evidence) => evidence.producerEventId === candidate.producerEventId,
  );
  if (sameProducer !== undefined && !sameCanonical(sameProducer, candidate)) {
    throw new DeepReviewReducerError(
      'projection-field-invalid',
      'An evidence producer cannot resolve to conflicting immutable evidence',
      'findingLedger.evidence',
    );
  }
  const evidence = sameProducer === undefined
    ? [...ledger.evidence, candidate]
    : [...ledger.evidence];
  evidence.sort((left, right) => compareProducerEvents(
    seenEvents,
    left.producerEventId,
    right.producerEventId,
  ));
  return { ...ledger, evidence };
}

function foldAdjudication(
  ledger: DeepReviewFindingProjection,
  event: DeepReviewEventEnvelope<'deep_review.claim_adjudication_recorded'>,
): DeepReviewFindingProjection {
  const payload = event.payload;
  const index = ledger.findings.findIndex(
    (finding) => finding.candidateId === payload.scope.candidateId,
  );
  if (index === -1) {
    throw new DeepReviewReducerError(
      'referential-integrity',
      'Adjudication must cite a captured finding candidate',
      'findingLedger.findings.candidateId',
    );
  }
  const prior = ledger.findings[index];
  const identityOwner = ledger.findings.find(
    (finding) => finding.findingId === payload.scope.findingId,
  );
  if (identityOwner !== undefined
    && identityOwner.candidateId !== payload.scope.candidateId) {
    throw new DeepReviewReducerError(
      'referential-integrity',
      'A finding identity cannot belong to more than one candidate',
      'findingLedger.findings.findingId',
    );
  }
  if (prior.adjudicationEventId !== null
    && prior.findingId !== payload.scope.findingId) {
    throw new DeepReviewReducerError(
      'referential-integrity',
      'Re-adjudication must preserve the candidate finding identity',
      'findingLedger.findings.findingId',
    );
  }
  const evidenceIds = new Set(ledger.evidence
    .filter((evidence) => evidence.candidateId === prior.candidateId)
    .map((evidence) => evidence.evidenceId));
  if (payload.data.evidenceRefs.some((evidenceId) => !evidenceIds.has(evidenceId))) {
    throw new DeepReviewReducerError(
      'referential-integrity',
      'Adjudication must cite evidence owned by its candidate',
      'findingLedger.findings.evidenceRefs',
    );
  }
  if (prior.adjudicationEventId !== payload.data.predecessorAdjudicationEventId) {
    throw new DeepReviewReducerError(
      'referential-integrity',
      'Reaffirmed adjudication must cite the same finding\'s predecessor',
      'findingLedger.findings.predecessorEventId',
    );
  }
  const lifecycle = payload.data.adjudicationOutcome === 'accepted'
    ? 'accepted' as const
    : payload.data.adjudicationOutcome === 'deferred'
      ? 'adjudicated' as const
      : 'dismissed' as const;
  const next: DeepReviewFindingRecord = {
    ...prior,
    findingId: payload.scope.findingId,
    claimDigest: payload.data.claimDigest,
    evidenceRefs: sortStrings(payload.data.evidenceRefs),
    impact: payload.data.impact,
    confidence: payload.data.confidence,
    lifecycle,
    adjudicationOutcome: payload.data.adjudicationOutcome,
    adjudicationEventId: event.event_id,
    predecessorEventId: payload.data.predecessorAdjudicationEventId,
    presentationSeverity: 'none',
  };
  const withSeverity = { ...next, presentationSeverity: presentationSeverity(next) };
  const findings = [...ledger.findings];
  findings[index] = withSeverity;
  findings.sort((left, right) => compareString(left.findingId, right.findingId));
  return { ...ledger, findings };
}

function foldFindingLineage(
  ledger: DeepReviewFindingProjection,
  event: DeepReviewEventEnvelope<'deep_review.finding_lineage_recorded'>,
  seenEvents: readonly DeepReviewSeenEvent[],
): DeepReviewFindingProjection {
  const payload = event.payload;
  const owner = ledger.findings.find(
    (finding) => finding.findingId === payload.scope.findingId,
  );
  if (owner === undefined
    || !findingOwnedEventIds(ledger, owner).has(payload.data.predecessorEventRef)) {
    throw new DeepReviewReducerError(
      'referential-integrity',
      'Finding lineage must cite predecessor provenance owned by that finding',
      'findingLedger.lineage.predecessorEventId',
    );
  }
  const candidate = {
    findingId: payload.scope.findingId,
    priorFingerprint: payload.data.priorFingerprint,
    currentFingerprint: payload.data.currentFingerprint,
    relation: payload.data.lineageRelation,
    predecessorEventId: payload.data.predecessorEventRef,
    producerEventId: event.event_id,
  };
  const lineage = ledger.lineage.some(
    (entry) => entry.producerEventId === candidate.producerEventId,
  ) ? [...ledger.lineage] : [...ledger.lineage, candidate];
  lineage.sort((left, right) => compareProducerEvents(
    seenEvents,
    left.producerEventId,
    right.producerEventId,
  ));
  return { ...ledger, lineage };
}

function foldFindingState(
  ledger: DeepReviewFindingProjection,
  event: DeepReviewEventEnvelope<'deep_review.finding_state_changed'>,
): DeepReviewFindingProjection {
  const payload = event.payload;
  const index = ledger.findings.findIndex(
    (finding) => finding.findingId === payload.scope.findingId,
  );
  if (index === -1) {
    throw new DeepReviewReducerError(
      'referential-integrity',
      'Finding state changes require a captured finding',
      'findingLedger.findings.findingId',
    );
  }
  const prior = ledger.findings[index];
  if (prior.adjudicationEventId !== payload.data.adjudicationEventId) {
    throw new DeepReviewReducerError(
      'referential-integrity',
      'Finding state changes require the target finding\'s own adjudication',
      'findingLedger.findings.adjudicationEventId',
    );
  }
  if (!findingOwnedEventIds(ledger, prior).has(payload.data.predecessorEventRef)) {
    throw new DeepReviewReducerError(
      'referential-integrity',
      'Finding state changes require predecessor provenance owned by that finding',
      'findingLedger.findings.predecessorEventId',
    );
  }
  if (prior.lifecycle !== payload.data.priorState) {
    throw new DeepReviewReducerError(
      'projection-field-invalid',
      'Finding state changes must start from the projected lifecycle',
      'findingLedger.findings.lifecycle',
    );
  }
  const next: DeepReviewFindingRecord = {
    ...prior,
    lifecycle: payload.data.currentState,
    semanticFingerprint: payload.data.currentFingerprint,
    predecessorEventId: payload.data.predecessorEventRef,
    presentationSeverity: 'none',
  };
  const findings = [...ledger.findings];
  findings[index] = { ...next, presentationSeverity: presentationSeverity(next) };
  return { ...ledger, findings };
}

function refreshFindingProjection(
  ledger: DeepReviewFindingProjection,
): DeepReviewFindingProjection {
  const active = ledger.findings.filter(
    (finding) => finding.lifecycle === 'accepted' || finding.lifecycle === 'adjudicated',
  );
  const openHardVetoes = ledger.findings.filter(
    (finding) => finding.hardVeto
      && finding.lifecycle !== 'dismissed'
      && finding.lifecycle !== 'fixed',
  );
  return {
    ...ledger,
    activeFindingIds: sortStrings(active.map((finding) => finding.findingId)),
    hardVetoFindingIds: sortStrings(
      openHardVetoes.map((finding) => finding.findingId),
    ),
  };
}

// ───────────────────────────────────────────────────────────────────
// 6. CONVERGENCE AND ARTIFACT DERIVATION
// ───────────────────────────────────────────────────────────────────

function convergenceEvaluation(
  event: DeepReviewEventEnvelope<
    'deep_review.convergence_evaluated' | 'deep_review.graph_convergence_evaluated'
  >,
): DeepReviewConvergenceEvaluation {
  const payload = event.payload;
  const graphPayload = payload.stem === 'deep_review.graph_convergence_evaluated'
    ? (event as DeepReviewEventEnvelope<'deep_review.graph_convergence_evaluated'>).payload
    : null;
  return {
    iterationId: payload.scope.iterationId,
    decision: payload.data.decision,
    rawSignals: payload.data.rawSignals,
    weightedSignals: payload.data.weightedSignals,
    dimensionCoverageDigest: payload.data.dimensionCoverageDigest,
    protocolCoverageDigest: payload.data.protocolCoverageDigest,
    findingStability: payload.data.findingStability,
    p0p1ResolutionState: payload.data.p0p1ResolutionState,
    evidenceDensity: payload.data.evidenceDensity,
    hotspotSaturation: payload.data.hotspotSaturation,
    policyFingerprint: payload.data.policyFingerprint,
    blockerIds: sortStrings(payload.data.blockerIds),
    stopCandidate: payload.data.stopCandidate,
    graphDecision: graphPayload?.data.graphDecision ?? null,
    graphDigest: graphPayload?.data.graphDigest ?? null,
    producerEventId: event.event_id,
  };
}

function refreshConvergence(
  reviewLoop: DeepReviewIterationConvergenceProjection,
  findings: DeepReviewFindingProjection,
  evaluation: DeepReviewConvergenceEvaluation,
  seenEvents: readonly DeepReviewSeenEvent[],
  drivesRunState: boolean,
): DeepReviewIterationConvergenceProjection {
  const evaluations = [...reviewLoop.evaluations, evaluation];
  evaluations.sort((left, right) => compareProducerEvents(
    seenEvents,
    left.producerEventId,
    right.producerEventId,
  ));
  if (!drivesRunState) return { ...reviewLoop, evaluations };
  const obligations = reviewLoop.obligations.map((obligation) => (
    obligation.kind === 'protocol' && evaluation.p0p1ResolutionState === 'resolved'
      ? { ...obligation, status: 'resolved' as const }
      : obligation
  ));
  const currentReviewLoop = { ...reviewLoop, obligations };
  const backbone = deriveCurrentConvergenceBackbone(
    currentReviewLoop,
    findings,
    evaluation,
  );
  return {
    ...reviewLoop,
    obligations,
    evaluations,
    currentIterationId: evaluation.iterationId,
    eligibility: backbone.eligibility,
    outcome: backbone.outcome,
    blockerIds: backbone.blockerIds,
  };
}

function deriveCurrentConvergenceBackbone(
  reviewLoop: DeepReviewIterationConvergenceProjection,
  findings: DeepReviewFindingProjection,
  evaluation: DeepReviewConvergenceEvaluation,
): SharedReviewLoopBackboneResult {
  const requiredCells = reviewLoop.scope.orderedDimensionIds.map((dimensionId) => (
    reviewLoop.coverageCells.find((cell) => (
      cell.iterationId === evaluation.iterationId
      && cell.dimensionId === dimensionId
      && cell.status === 'complete'
    ))
  ));
  const unresolvedObligations = reviewLoop.obligations.filter(
    (obligation) => obligation.required && obligation.status !== 'resolved',
  ).map((obligation) => obligation.obligationId);
  const blockingFindingIds = findings.findings
    .filter((finding) => finding.lifecycle === 'accepted'
      && (finding.presentationSeverity === 'P0' || finding.presentationSeverity === 'P1'))
    .map((finding) => finding.findingId);
  return reduceSharedReviewLoopBackbone({
    requiredDimensionIds: reviewLoop.scope.orderedDimensionIds,
    completedDimensionIds: requiredCells
      .filter((cell) => cell !== undefined)
      .map((cell) => cell.dimensionId),
    unresolvedObligationIds: unresolvedObligations,
    explicitBlockerIds: evaluation.blockerIds,
    blockingFindingIds,
    hardVetoFindingIds: findings.hardVetoFindingIds,
    p0p1ResolutionState: evaluation.p0p1ResolutionState,
    findingStability: evaluation.findingStability,
    decision: evaluation.decision,
    stopCandidate: evaluation.stopCandidate,
    graphDecision: evaluation.graphDecision,
  });
}

/** Apply the shared coverage, obligation, finding, and veto convergence invariant. */
export function reduceSharedReviewLoopBackbone(
  input: SharedReviewLoopBackboneInput,
): SharedReviewLoopBackboneResult {
  const completed = new Set(input.completedDimensionIds);
  const unresolvedCells = input.requiredDimensionIds.filter(
    (dimensionId) => !completed.has(dimensionId),
  );
  const blockers = sortStrings([
    ...input.explicitBlockerIds,
    ...unresolvedCells.map((dimensionId) => `coverage:${dimensionId}`),
    ...input.unresolvedObligationIds,
    ...input.blockingFindingIds.map((findingId) => `blocking-finding:${findingId}`),
    ...input.hardVetoFindingIds.map((findingId) => `hard-veto:${findingId}`),
    ...(input.p0p1ResolutionState === 'resolved' ? [] : ['p0p1-resolution']),
    ...(input.findingStability === 'stable' ? [] : ['finding-stability']),
    ...(input.graphDecision === 'blocked' ? ['graph-decision'] : []),
  ]);
  const canStop = input.stopCandidate
    && input.decision === 'converged'
    && blockers.length === 0;
  return Object.freeze({
    eligibility: canStop
      ? 'STOP_ELIGIBLE'
      : input.decision === 'continue' || input.decision === 'recover'
        ? 'CONTINUE'
        : 'INDETERMINATE',
    outcome: canStop
      ? 'converged'
      : input.decision === 'incomplete' && blockers.length === 0
        ? 'incomplete'
        : blockers.length > 0 || input.decision === 'blocked'
          ? 'blocked'
          : 'active',
    blockerIds: Object.freeze(blockers),
  }) as SharedReviewLoopBackboneResult;
}

function artifactIdentity(kind: string, identity: string, digest: string): string {
  return `${kind}:${sha256Bytes(canonicalBytes(identity))}:${digest}`;
}

function entityArtifactLogicalIdentity(
  kind: string,
  owner: JsonObject,
): string {
  return `${kind}:${sha256Bytes(canonicalBytes(owner))}`;
}

function runArtifactLogicalIdentity(
  event: DeepReviewLedgerEvent,
  runStreamId: string,
  kind: string,
  owner: JsonObject,
): string {
  return `${kind}:${sha256Bytes(canonicalBytes({
    runId: event.payload.scope.runId,
    sessionId: event.payload.scope.sessionId,
    streamId: runStreamId,
    owner,
  }))}`;
}

function artifactFromEvent(
  event: DeepReviewLedgerEvent,
  runStreamId: string,
): DeepReviewArtifactRecord | null {
  switch (event.payload.stem) {
    case 'deep_review.finding_candidate_emitted': {
      const payload = payloadFor(event, 'deep_review.finding_candidate_emitted');
      return {
        artifactId: artifactIdentity('finding', payload.scope.candidateId, payload.data.claimTextDigest),
        logicalArtifactId: entityArtifactLogicalIdentity('finding', {
          candidateId: payload.scope.candidateId,
        }),
        artifactKind: 'raw-finding',
        producerEventId: event.event_id,
        reviewedInputIdentity: payload.data.sourcePassEventId,
        contentDigest: payload.data.claimTextDigest,
        availability: 'available',
        supersedesArtifactIds: [],
        supersededByArtifactIds: [],
      };
    }
    case 'deep_review.evidence_observed':
    case 'deep_review.evidence_reconciled': {
      const payload = event.payload.stem === 'deep_review.evidence_observed'
        ? payloadFor(event, 'deep_review.evidence_observed')
        : payloadFor(event, 'deep_review.evidence_reconciled');
      return {
        artifactId: artifactIdentity('evidence', event.event_id, payload.data.contentDigest),
        logicalArtifactId: entityArtifactLogicalIdentity('evidence', {
          evidenceId: payload.scope.evidenceId,
        }),
        artifactKind: payload.data.observationKind === 'test-result'
          ? 'verification-output'
          : 'evidence',
        producerEventId: event.event_id,
        reviewedInputIdentity: payload.data.locator.revision ?? payload.data.sourceDigest,
        contentDigest: payload.data.contentDigest,
        availability: payload.data.relevanceStatus === 'irrelevant'
          ? 'unavailable'
          : 'available',
        supersedesArtifactIds: [],
        supersededByArtifactIds: [],
      };
    }
    case 'deep_review.claim_adjudication_recorded': {
      const payload = payloadFor(event, 'deep_review.claim_adjudication_recorded');
      return {
        artifactId: artifactIdentity('adjudication', event.event_id, payload.data.claimDigest),
        logicalArtifactId: entityArtifactLogicalIdentity('adjudication', {
          findingId: payload.scope.findingId,
        }),
        artifactKind: 'adjudication',
        producerEventId: event.event_id,
        reviewedInputIdentity: payload.scope.candidateId,
        contentDigest: payload.data.claimDigest,
        availability: 'available',
        supersedesArtifactIds: [],
        supersededByArtifactIds: [],
      };
    }
    case 'deep_review.review_report_committed': {
      if (event.stream_id !== runStreamId) return null;
      const payload = payloadFor(event, 'deep_review.review_report_committed');
      return {
        artifactId: artifactIdentity('report', payload.scope.reportRevisionId, payload.data.reportDigest),
        logicalArtifactId: runArtifactLogicalIdentity(
          event,
          runStreamId,
          'review-report',
          {},
        ),
        artifactKind: 'review-report',
        producerEventId: event.event_id,
        reviewedInputIdentity: payload.data.findingRegistryInputDigest,
        contentDigest: payload.data.reportDigest,
        availability: 'available',
        supersedesArtifactIds: [],
        supersededByArtifactIds: [],
      };
    }
    case 'deep_review.continuity_save_requested':
    case 'deep_review.continuity_save_completed':
    case 'deep_review.continuity_save_failed': {
      if (event.stream_id !== runStreamId) return null;
      const payload = event.payload.stem === 'deep_review.continuity_save_requested'
        ? payloadFor(event, 'deep_review.continuity_save_requested')
        : event.payload.stem === 'deep_review.continuity_save_completed'
          ? payloadFor(event, 'deep_review.continuity_save_completed')
          : payloadFor(event, 'deep_review.continuity_save_failed');
      const digest = event.payload.stem === 'deep_review.continuity_save_completed'
        ? event.payload.data.continuityFingerprint
        : payload.data.continuityPayloadDigest;
      return {
        artifactId: artifactIdentity('continuity', event.event_id, digest),
        logicalArtifactId: runArtifactLogicalIdentity(
          event,
          runStreamId,
          'continuity-save',
          { targetPacket: payload.data.targetPacket },
        ),
        artifactKind: 'continuity-save',
        producerEventId: event.event_id,
        reviewedInputIdentity: payload.data.continuityPayloadDigest,
        contentDigest: digest,
        availability: event.payload.stem === 'deep_review.continuity_save_requested'
          ? 'pending'
          : event.payload.stem === 'deep_review.continuity_save_completed'
            ? 'available'
            : 'unavailable',
        supersedesArtifactIds: [],
        supersededByArtifactIds: [],
      };
    }
    case 'deep_review.run_initialized':
    case 'deep_review.run_resumed':
    case 'deep_review.run_restarted':
    case 'deep_review.scope_resolved':
    case 'deep_review.dimension_ordered':
    case 'deep_review.protocol_plan_recorded':
    case 'deep_review.dimension_pass_started':
    case 'deep_review.dimension_pass_completed':
    case 'deep_review.finding_lineage_recorded':
    case 'deep_review.finding_state_changed':
    case 'deep_review.review_depth_recorded':
    case 'deep_review.convergence_evaluated':
    case 'deep_review.graph_convergence_evaluated':
    case 'deep_review.blocked_stop_recorded':
    case 'deep_review.pause_recorded':
    case 'deep_review.recovery_started':
    case 'deep_review.synthesis_started':
    case 'deep_review.run_completed':
      return null;
  }
  return assertNeverStem((event as DeepReviewLedgerEvent).payload.stem as never);
}

function linkArtifactRevision(
  artifacts: readonly DeepReviewArtifactRecord[],
  predecessorEventId: string,
  successor: DeepReviewArtifactRecord,
): DeepReviewArtifactRecord[] {
  const predecessor = artifacts.find(
    (artifact) => artifact.producerEventId === predecessorEventId,
  );
  if (predecessor === undefined) {
    throw new DeepReviewReducerError(
      'referential-integrity',
      'Artifact supersession requires both immutable revisions',
      'artifactIndex.artifacts',
    );
  }
  return artifacts.map((artifact) => {
    if (artifact.artifactId === predecessor.artifactId) {
      return {
        ...artifact,
        availability: 'superseded' as const,
        supersededByArtifactIds: sortStrings([
          ...artifact.supersededByArtifactIds,
          successor.artifactId,
        ]),
      };
    }
    if (artifact.artifactId === successor.artifactId) {
      return {
        ...artifact,
        supersedesArtifactIds: sortStrings([
          ...artifact.supersedesArtifactIds,
          predecessor.artifactId,
        ]),
      };
    }
    return artifact;
  });
}

function refreshArtifacts(
  artifacts: readonly DeepReviewArtifactRecord[],
  candidate: DeepReviewArtifactRecord | null,
  event: DeepReviewLedgerEvent,
  seenEvents: readonly DeepReviewSeenEvent[],
): DeepReviewArtifactRecord[] {
  let next = candidate === null ? [...artifacts] : [...artifacts, candidate];
  if (event.payload.stem === 'deep_review.evidence_reconciled') {
    const payload = payloadFor(event, 'deep_review.evidence_reconciled');
    if (candidate === null) {
      throw new DeepReviewReducerError(
        'referential-integrity',
        'Evidence supersession requires both immutable artifact revisions',
        'artifactIndex.artifacts',
      );
    }
    next = linkArtifactRevision(
      next,
      payload.data.supersedesEvidenceEventId,
      candidate,
    );
  }
  if (event.payload.stem === 'deep_review.claim_adjudication_recorded') {
    const payload = payloadFor(event, 'deep_review.claim_adjudication_recorded');
    if (payload.data.predecessorAdjudicationEventId !== null) {
      if (candidate === null) {
        throw new DeepReviewReducerError(
          'referential-integrity',
          'Adjudication supersession requires both immutable artifact revisions',
          'artifactIndex.artifacts',
        );
      }
      next = linkArtifactRevision(
        next,
        payload.data.predecessorAdjudicationEventId,
        candidate,
      );
    }
  }
  const logicalGroups = new Map<string, DeepReviewArtifactRecord[]>();
  for (const artifact of next) {
    if (artifact.artifactKind !== 'review-report'
      && artifact.artifactKind !== 'continuity-save') continue;
    const group = logicalGroups.get(artifact.logicalArtifactId) ?? [];
    group.push(artifact);
    logicalGroups.set(artifact.logicalArtifactId, group);
  }
  for (const group of logicalGroups.values()) {
    group.sort((left, right) => compareProducerEvents(
      seenEvents,
      left.producerEventId,
      right.producerEventId,
    ));
  }
  next = next.map((artifact) => {
    if (artifact.artifactKind !== 'review-report'
      && artifact.artifactKind !== 'continuity-save') return artifact;
    const lineage = logicalGroups.get(artifact.logicalArtifactId) ?? [];
    const index = lineage.findIndex((candidateArtifact) => (
      candidateArtifact.artifactId === artifact.artifactId
    ));
    if (index === -1) return artifact;
    const earlier = lineage.slice(0, index).map((entry) => entry.artifactId);
    const later = lineage.slice(index + 1).map((entry) => entry.artifactId);
    return {
      ...artifact,
      availability: later.length > 0 ? 'superseded' as const : artifact.availability,
      supersedesArtifactIds: sortStrings(earlier),
      supersededByArtifactIds: sortStrings(later),
    };
  });
  const byIdentity = new Map<string, DeepReviewArtifactRecord>();
  for (const artifact of next) {
    const prior = byIdentity.get(artifact.artifactId);
    if (prior !== undefined && !sameCanonical(prior, artifact)) {
      throw new DeepReviewReducerError(
        'projection-field-invalid',
        'An artifact identity cannot resolve to conflicting immutable content',
        'artifactIndex.artifacts',
      );
    }
    byIdentity.set(artifact.artifactId, artifact);
  }
  return [...byIdentity.values()].sort((left, right) => (
    compareString(left.logicalArtifactId, right.logicalArtifactId)
      || compareProducerEvents(
        seenEvents,
        left.producerEventId,
        right.producerEventId,
      )
  ));
}

// ───────────────────────────────────────────────────────────────────
// 7. STATUS AND TERMINAL INVARIANTS
// ───────────────────────────────────────────────────────────────────

const TERMINAL_STATES = Object.freeze([
  'complete', 'incomplete', 'failed',
] as const satisfies readonly DeepReviewModeStatus[]);

const STATUS_TRANSITIONS = Object.freeze({
  planned: Object.freeze(['planned', 'active', 'blocked', 'failed']),
  active: Object.freeze([
    'active', 'paused', 'converging', 'complete', 'incomplete', 'blocked', 'failed',
  ]),
  paused: Object.freeze(['paused', 'active', 'blocked', 'incomplete', 'failed']),
  converging: Object.freeze(['converging', 'complete', 'incomplete', 'blocked', 'failed']),
  blocked: Object.freeze(['blocked', 'active', 'incomplete', 'failed']),
  complete: Object.freeze(['complete']),
  incomplete: Object.freeze(['incomplete']),
  failed: Object.freeze(['failed']),
} as const satisfies Readonly<Record<DeepReviewModeStatus, readonly DeepReviewModeStatus[]>>);

function transitionForEvent(
  event: DeepReviewLedgerEvent,
  reviewLoop: DeepReviewIterationConvergenceProjection,
): DeepReviewStatusTransition | null {
  const base = {
    producerEventId: event.event_id,
    producerStem: event.payload.stem,
    streamId: event.stream_id,
    logicalSequence: event.stream_sequence,
    blockingReason: null,
  };
  switch (event.payload.stem) {
    case 'deep_review.run_initialized':
      return { ...base, state: 'planned' };
    case 'deep_review.run_resumed':
    case 'deep_review.run_restarted':
    case 'deep_review.scope_resolved':
    case 'deep_review.dimension_ordered':
    case 'deep_review.protocol_plan_recorded':
    case 'deep_review.dimension_pass_started':
    case 'deep_review.dimension_pass_completed':
    case 'deep_review.finding_candidate_emitted':
    case 'deep_review.evidence_observed':
    case 'deep_review.evidence_reconciled':
    case 'deep_review.claim_adjudication_recorded':
    case 'deep_review.finding_lineage_recorded':
    case 'deep_review.finding_state_changed':
    case 'deep_review.review_depth_recorded':
    case 'deep_review.recovery_started':
      return { ...base, state: 'active' };
    case 'deep_review.convergence_evaluated':
    case 'deep_review.graph_convergence_evaluated':
      return reviewLoop.outcome === 'blocked'
        ? { ...base, state: 'blocked', blockingReason: 'convergence-blocked' }
        : { ...base, state: 'active' };
    case 'deep_review.blocked_stop_recorded':
      return { ...base, state: 'blocked', blockingReason: 'blocked-stop' };
    case 'deep_review.pause_recorded':
      return { ...base, state: 'paused' };
    case 'deep_review.synthesis_started':
      return { ...base, state: 'converging' };
    case 'deep_review.review_report_committed':
    case 'deep_review.continuity_save_requested':
    case 'deep_review.continuity_save_completed':
      return null;
    case 'deep_review.continuity_save_failed':
      return { ...base, state: 'blocked', blockingReason: 'continuity-save-failed' };
    case 'deep_review.run_completed': {
      const payload = payloadFor(event, 'deep_review.run_completed');
      if (payload.data.terminalStatus === 'completed') return { ...base, state: 'complete' };
      if (payload.data.terminalStatus === 'incomplete') return { ...base, state: 'incomplete' };
      return { ...base, state: 'failed', blockingReason: 'run-completed-blocked' };
    }
  }
  return assertNeverStem((event as DeepReviewLedgerEvent).payload.stem as never);
}

function deriveStatus(
  transitions: readonly DeepReviewStatusTransition[],
  contractVersions: readonly string[],
  lastAppliedSequence: number,
): DeepReviewStatusProjection {
  const provenance = [...transitions];
  let state: DeepReviewModeStatus = 'planned';
  for (const transition of provenance) {
    if (!STATUS_TRANSITIONS[state].includes(transition.state as never)) {
      throw new DeepReviewReducerError(
        'impossible-status-transition',
        `Status cannot transition from ${state} to ${transition.state}`,
        'status.provenance',
      );
    }
    state = transition.state;
  }
  const blockingReason = [...provenance].reverse().find(
    (transition) => transition.blockingReason !== null,
  )?.blockingReason ?? null;
  return {
    state,
    terminal: TERMINAL_STATES.includes(state as never),
    health: state === 'blocked' || state === 'failed' ? 'blocked' : 'healthy',
    activeContractVersions: sortStrings(contractVersions),
    lastAppliedSequence,
    blockingReason,
    shadowParityState: 'not-run',
    provenance,
  };
}

function latestConvergenceEvaluation(
  reviewLoop: DeepReviewIterationConvergenceProjection,
  seenEvents: readonly DeepReviewSeenEvent[],
  runStreamId: string,
): DeepReviewConvergenceEvaluation | undefined {
  const latestEventId = seenEvents.filter((seen) => (
    seen.streamId === runStreamId
    && (
      seen.stem === 'deep_review.convergence_evaluated'
      || seen.stem === 'deep_review.graph_convergence_evaluated'
    )
  )).at(-1)?.eventId;
  return reviewLoop.evaluations.find(
    (evaluation) => evaluation.producerEventId === latestEventId,
  );
}

function assertCompletionReferences(
  state: DeepReviewProjectionState,
  event: DeepReviewEventEnvelope<'deep_review.run_completed'>,
): void {
  const payload = event.payload;
  const runStreamId = establishedRunStreamId(state.run, state.seenEvents);
  if (event.stream_id !== runStreamId) {
    throw new DeepReviewReducerError(
      'referential-integrity',
      'Run completion must be recorded on the stream established at initialization',
      'reviewLoop.terminalDecision',
    );
  }
  const borrowedEvidence = state.findingLedger.findings.find((finding) => (
    finding.evidenceRefs.some((evidenceId) => !state.findingLedger.evidence.some(
      (evidence) => evidence.evidenceId === evidenceId
        && evidence.candidateId === finding.candidateId,
    ))
  ));
  if (borrowedEvidence !== undefined) {
    throw new DeepReviewReducerError(
      'referential-integrity',
      'Terminal findings must cite evidence owned by their candidate',
      'findingLedger.findings.evidenceRefs',
    );
  }
  if (payload.data.finalLedgerTailHash !== payload.prevEventHash) {
    throw new DeepReviewReducerError(
      'referential-integrity',
      'Terminal ledger-tail identity must equal the captured predecessor hash',
      'reviewLoop.terminalDecision',
    );
  }
  const required = [
    ['convergenceEventId', payload.data.convergenceEventId],
    ['synthesisEventId', payload.data.synthesisEventId],
    ['reportEventId', payload.data.reportEventId],
    ['continuityEventId', payload.data.continuityEventId],
  ] as const;
  const missing = required.find(([, eventId]) => !state.seenEvents.some(
    (seen) => seen.eventId === eventId && seen.streamId === runStreamId,
  ));
  if (missing !== undefined) {
    throw new DeepReviewReducerError(
      'referential-integrity',
      'Completion references must identify events captured by the fold',
      `reviewLoop.${missing[0]}`,
    );
  }
  if (payload.data.terminalStatus !== 'completed') return;
  const latestEvaluation = latestConvergenceEvaluation(
    state.reviewLoop,
    state.seenEvents,
    runStreamId,
  );
  const validConvergence = latestEvaluation !== undefined
    && latestEvaluation.producerEventId === payload.data.convergenceEventId
    && latestEvaluation.decision === 'converged'
    && latestEvaluation.stopCandidate
    && latestEvaluation.blockerIds.length === 0;
  const validSynthesis = state.seenEvents.some(
    (seen) => seen.eventId === payload.data.synthesisEventId
      && seen.streamId === runStreamId
      && seen.stem === 'deep_review.synthesis_started',
  );
  const validReport = state.artifactIndex.artifacts.some(
    (artifact) => artifact.producerEventId === payload.data.reportEventId
      && artifact.artifactKind === 'review-report'
      && artifact.availability === 'available',
  ) && state.seenEvents.some(
    (seen) => seen.eventId === payload.data.reportEventId
      && seen.streamId === runStreamId,
  );
  const validContinuity = state.artifactIndex.artifacts.some(
    (artifact) => artifact.producerEventId === payload.data.continuityEventId
      && artifact.artifactKind === 'continuity-save'
      && artifact.availability === 'available',
  ) && state.seenEvents.some(
    (seen) => seen.eventId === payload.data.continuityEventId
      && seen.streamId === runStreamId,
  );
  if (!validConvergence || !validSynthesis || !validReport || !validContinuity
    || state.reviewLoop.eligibility !== 'STOP_ELIGIBLE'
    || state.reviewLoop.blockerIds.length > 0) {
    throw new DeepReviewReducerError(
      'impossible-status-transition',
      'Completed review runs require stop eligibility and complete typed evidence',
      'status',
    );
  }
}

// ───────────────────────────────────────────────────────────────────
// 8. EVENT APPLICATION
// ───────────────────────────────────────────────────────────────────

function appendSeenEvent(
  state: DeepReviewProjectionState,
  event: DeepReviewLedgerEvent,
): DeepReviewSeenEvent[] | null {
  const digest = eventDigest(event);
  const existing = state.seenEvents.find((entry) => entry.eventId === event.event_id);
  if (existing !== undefined) {
    if (existing.eventDigest !== digest) {
      throw new DeepReviewReducerError(
        'duplicate-event-conflict',
        'A persisted event identity cannot resolve to different canonical bytes',
        'seenEvents',
      );
    }
    return null;
  }
  const seenEvents = [...state.seenEvents, {
    eventId: event.event_id,
    eventDigest: digest,
    stem: event.payload.stem,
    streamId: event.stream_id,
    streamSequence: event.stream_sequence,
  }];
  return seenEvents;
}

function advanceCursors(
  state: DeepReviewProjectionState,
  event: DeepReviewLedgerEvent,
): DeepReviewProjectionState['cursors'] {
  const planes = DEEP_REVIEW_EVENT_ROUTING[event.payload.stem];
  const sequence = event.stream_sequence;
  return {
    reviewLoop: planes.includes('reviewLoop' as never)
      ? Math.max(state.cursors.reviewLoop, sequence) : state.cursors.reviewLoop,
    findings: planes.includes('findings' as never)
      ? Math.max(state.cursors.findings, sequence) : state.cursors.findings,
    artifactIndex: planes.includes('artifactIndex' as never)
      ? Math.max(state.cursors.artifactIndex, sequence) : state.cursors.artifactIndex,
    status: planes.includes('status' as never)
      ? Math.max(state.cursors.status, sequence) : state.cursors.status,
  };
}

function applyEvent(
  state: DeepReviewProjectionState,
  event: DeepReviewLedgerEvent,
): DeepReviewProjectionState {
  const seenEvents = appendSeenEvent(state, event);
  if (seenEvents === null) return state;
  assertRunIdentity(state, event);
  if (state.status.terminal) {
    throw new DeepReviewReducerError(
      'duplicate-terminal-event',
      'A run accepts no events after its terminal transition',
      'status.provenance',
    );
  }

  const run = foldRun(state, event);
  let reviewLoop = foldReviewLoopEvent(state.reviewLoop, event, seenEvents);
  let findingLedger = state.findingLedger;
  const completion = event.payload.stem === 'deep_review.run_completed'
    ? payloadFor(event, 'deep_review.run_completed')
    : null;
  const isCompletedTerminal = completion?.data.terminalStatus === 'completed';

  switch (event.payload.stem) {
    case 'deep_review.finding_candidate_emitted':
      findingLedger = foldCandidate(
        findingLedger,
        { ...state, reviewLoop },
        event as DeepReviewEventEnvelope<'deep_review.finding_candidate_emitted'>,
      );
      break;
    case 'deep_review.evidence_observed':
    case 'deep_review.evidence_reconciled':
      findingLedger = foldEvidence(
        findingLedger,
        event as DeepReviewEventEnvelope<
          'deep_review.evidence_observed' | 'deep_review.evidence_reconciled'
        >,
        seenEvents,
      );
      break;
    case 'deep_review.claim_adjudication_recorded':
      findingLedger = foldAdjudication(
        findingLedger,
        event as DeepReviewEventEnvelope<'deep_review.claim_adjudication_recorded'>,
      );
      break;
    case 'deep_review.finding_lineage_recorded':
      findingLedger = foldFindingLineage(
        findingLedger,
        event as DeepReviewEventEnvelope<'deep_review.finding_lineage_recorded'>,
        seenEvents,
      );
      break;
    case 'deep_review.finding_state_changed':
      findingLedger = foldFindingState(
        findingLedger,
        event as DeepReviewEventEnvelope<'deep_review.finding_state_changed'>,
      );
      break;
    default:
      break;
  }
  findingLedger = refreshFindingProjection(findingLedger);

  if (event.payload.stem === 'deep_review.convergence_evaluated'
    || event.payload.stem === 'deep_review.graph_convergence_evaluated') {
    const runStreamId = establishedRunStreamId(run, seenEvents);
    reviewLoop = refreshConvergence(
      reviewLoop,
      findingLedger,
      convergenceEvaluation(event as DeepReviewEventEnvelope<
        'deep_review.convergence_evaluated' | 'deep_review.graph_convergence_evaluated'
      >),
      seenEvents,
      event.stream_id === runStreamId,
    );
  }
  if (completion !== null) {
    const latestEvaluation = latestConvergenceEvaluation(
      reviewLoop,
      seenEvents,
      establishedRunStreamId(run, seenEvents),
    );
    if (isCompletedTerminal && latestEvaluation !== undefined) {
      const backbone = deriveCurrentConvergenceBackbone(
        reviewLoop,
        findingLedger,
        latestEvaluation,
      );
      reviewLoop = {
        ...reviewLoop,
        eligibility: backbone.eligibility,
        outcome: backbone.outcome,
        blockerIds: backbone.blockerIds,
      };
    }
  }
  reviewLoop = { ...reviewLoop, lastAppliedSequence: seenEvents.length };

  const artifactCandidate = artifactFromEvent(
    event,
    establishedRunStreamId(run, seenEvents),
  );
  const artifacts = refreshArtifacts(
    state.artifactIndex.artifacts,
    artifactCandidate,
    event,
    seenEvents,
  );
  const interim: DeepReviewProjectionState = {
    ...state,
    run,
    reviewLoop,
    findingLedger,
    artifactIndex: { artifacts },
    cursors: advanceCursors(state, event),
    seenEvents,
    status: state.status,
  };
  if (completion !== null) {
    assertCompletionReferences(
      interim,
      event as DeepReviewEventEnvelope<'deep_review.run_completed'>,
    );
  }

  const transition = transitionForEvent(event, reviewLoop);
  const provenance = transition === null
    ? [...state.status.provenance]
    : [...state.status.provenance, transition];
  const contractVersions = [
    ...state.status.activeContractVersions,
    ...(run.convergencePolicyVersion === null ? [] : [run.convergencePolicyVersion]),
    ...(event.payload.stem === 'deep_review.protocol_plan_recorded'
      ? [payloadFor(event, 'deep_review.protocol_plan_recorded').data.contractVersion]
      : []),
  ];
  const status = deriveStatus(provenance, contractVersions, seenEvents.length);
  const next: DeepReviewProjectionState = { ...interim, status };
  if (isCompletedTerminal && (
    reviewLoop.eligibility !== 'STOP_ELIGIBLE'
    || reviewLoop.blockerIds.length > 0
    || findingLedger.hardVetoFindingIds.length > 0
  )) {
    throw new DeepReviewReducerError(
      'impossible-status-transition',
      'Complete status cannot override unresolved coverage, evidence, or hard vetoes',
      'status.state',
    );
  }
  assertDeepReviewProjectionState(next);
  return immutableProjectionClone(next) as DeepReviewProjectionState;
}

// ───────────────────────────────────────────────────────────────────
// 9. MODE-CONTRACT REDUCER SURFACE
// ───────────────────────────────────────────────────────────────────

export type DeepReviewReducerSurface = Pick<
  ModeContract<DeepReviewModeContractState>,
  'reducers' | 'reduce'
>;

/** Apply one real verified-ledger event through the shared reducer signature. */
export function reduceDeepReviewVerifiedEvent(
  verified: VerifiedLedgerEvent,
  state: Readonly<DeepReviewModeContractState>,
): ModeReductionResult<DeepReviewModeContractState> {
  assertDeepReviewProjectionState(state);
  const event = typedEventFromVerified(verified);
  const next = applyEvent(state, event);
  return Object.freeze({
    reducerId: DEEP_REVIEW_REDUCER_ID,
    stateVersion: DEEP_REVIEW_PROJECTION_SCHEMA_VERSION,
    appliedEventId: event.event_id,
    state: asModeContractState(next),
  });
}

export const DEEP_REVIEW_REDUCER_SURFACE: DeepReviewReducerSurface = Object.freeze({
  reducers: DEEP_REVIEW_REDUCER_SET,
  reduce: reduceDeepReviewVerifiedEvent,
});

function assertReducerOwnership(reducers: ModeReducerSet<DeepReviewModeContractState>): void {
  const declared = [...reducers.persistedFields].sort(compareString);
  const expected = [...PERSISTED_FIELDS].sort(compareString);
  if (!sameCanonical(declared, expected)) {
    throw new DeepReviewReducerError(
      'projection-field-undeclared',
      'Persisted fields must equal the closed deep-review projection field set',
      'reducers.persistedFields',
    );
  }
  const owners = new Map<string, string>();
  for (const definition of reducers.definitions) {
    for (const field of definition.ownedFields) {
      if (owners.has(field)) {
        throw new DeepReviewReducerError(
          'duplicate-owner',
          `Projection field ${field} has more than one reducer owner`,
          field,
        );
      }
      owners.set(field, definition.reducerId);
    }
  }
  for (const field of PERSISTED_FIELDS) {
    if (!owners.has(field)) {
      throw new DeepReviewReducerError(
        'projection-field-undeclared',
        `Projection field ${field} has no reducer owner`,
        field,
      );
    }
  }
}

/** Probe the shared reducer surface for ownership, purity, and determinism. */
export function verifyDeepReviewReducerSurface(
  surface: DeepReviewReducerSurface,
  event: VerifiedLedgerEvent,
  state: DeepReviewProjectionState,
): void {
  assertReducerOwnership(surface.reducers);
  const firstInput = immutableProjectionClone(state) as DeepReviewProjectionState;
  const secondInput = immutableProjectionClone(state) as DeepReviewProjectionState;
  const initial = canonicalJson(firstInput);
  const first = surface.reduce(event, asModeContractState(firstInput));
  const second = surface.reduce(event, asModeContractState(secondInput));
  assertDeepReviewProjectionState(first.state);
  assertDeepReviewProjectionState(second.state);
  if (!isDeepFrozenProjection(first.state) || !isDeepFrozenProjection(second.state)) {
    throw new DeepReviewReducerError(
      'projection-not-frozen',
      'Mode reducer outputs must be recursively frozen',
      'state',
    );
  }
  if (canonicalJson(firstInput) !== initial || canonicalJson(secondInput) !== initial) {
    throw new DeepReviewReducerError(
      'state-mutated',
      'Mode reducer mutated its frozen input',
      'state',
    );
  }
  if (!sameCanonical(first, second)) {
    throw new DeepReviewReducerError(
      'reducer-nondeterministic',
      'Mode reducer produced different outputs for equal inputs',
      'state',
    );
  }
  const definition = surface.reducers.definitions.find(
    (candidate) => candidate.reducerId === first.reducerId,
  );
  if (definition === undefined) {
    throw new DeepReviewReducerError(
      'reducer-output-unowned',
      'Mode reducer returned an undeclared reducer identity',
      'reducerId',
    );
  }
  const unowned = topLevelChangedFields(state, first.state).find(
    (field) => !definition.ownedFields.includes(field),
  );
  if (unowned !== undefined) {
    throw new DeepReviewReducerError(
      'reducer-output-unowned',
      `Mode reducer wrote unowned projection field ${unowned}`,
      unowned,
    );
  }
}

// ───────────────────────────────────────────────────────────────────
// 10. FULL AND INCREMENTAL REPLAY
// ───────────────────────────────────────────────────────────────────

/** Derive the deterministic projection integrity digest. */
export function deepReviewProjectionIntegrityDigest(
  projection: DeepReviewProjectionState,
): string {
  assertDeepReviewProjectionState(projection);
  return sha256Bytes(canonicalBytes({
    schemaVersion: DEEP_REVIEW_PROJECTION_SCHEMA_VERSION,
    reducerVersion: DEEP_REVIEW_REDUCER_VERSION,
    codecVersion: DEEP_REVIEW_PROJECTION_CODEC_VERSION,
    orderingPolicyVersion: DEEP_REVIEW_ORDERING_POLICY_VERSION,
    projection,
  }));
}

function deepReviewCheckpointIntegrityDigest(
  projection: DeepReviewProjectionState,
  sourceTailSequence: number,
  sourceTailEventDigest: string,
): string {
  return sha256Bytes(canonicalBytes({
    projectionDigest: deepReviewProjectionIntegrityDigest(projection),
    sourceTailSequence,
    sourceTailEventDigest,
  }));
}

function rebuildReasons(options: DeepReviewFoldOptions): DeepReviewRebuildReasonCode[] {
  const reasons: DeepReviewRebuildReasonCode[] = [];
  if (options.expectedSchemaVersion !== undefined
    && options.expectedSchemaVersion !== DEEP_REVIEW_PROJECTION_SCHEMA_VERSION) {
    reasons.push('projection-schema-mismatch');
  }
  if (options.expectedReducerVersion !== undefined
    && options.expectedReducerVersion !== DEEP_REVIEW_REDUCER_VERSION) {
    reasons.push('reducer-version-mismatch');
  }
  if (options.expectedCodecVersion !== undefined
    && options.expectedCodecVersion !== DEEP_REVIEW_PROJECTION_CODEC_VERSION) {
    reasons.push('codec-version-mismatch');
  }
  if (options.expectedOrderingPolicyVersion !== undefined
    && options.expectedOrderingPolicyVersion !== DEEP_REVIEW_ORDERING_POLICY_VERSION) {
    reasons.push('ordering-policy-mismatch');
  }
  const checkpoint = options.checkpoint;
  if (checkpoint !== undefined) {
    try {
      assertDeepReviewProjectionState(checkpoint.projection);
    } catch {
      reasons.push('projection-schema-mismatch');
      return sortStrings(reasons) as DeepReviewRebuildReasonCode[];
    }
    if (checkpoint.projection.schemaVersion !== DEEP_REVIEW_PROJECTION_SCHEMA_VERSION) {
      reasons.push('projection-schema-mismatch');
    }
    if (checkpoint.projection.reducerVersion !== DEEP_REVIEW_REDUCER_VERSION) {
      reasons.push('reducer-version-mismatch');
    }
    if (checkpoint.projection.codecVersion !== DEEP_REVIEW_PROJECTION_CODEC_VERSION) {
      reasons.push('codec-version-mismatch');
    }
    if (checkpoint.projection.orderingPolicyVersion !== DEEP_REVIEW_ORDERING_POLICY_VERSION) {
      reasons.push('ordering-policy-mismatch');
    }
    if (checkpoint.integrityDigest !== deepReviewCheckpointIntegrityDigest(
      checkpoint.projection,
      checkpoint.sourceTailSequence,
      checkpoint.sourceTailEventDigest,
    )) {
      reasons.push('checkpoint-digest-mismatch');
    }
    if (options.sourceTailSequence !== undefined
      && options.sourceTailSequence < checkpoint.sourceTailSequence) {
      reasons.push('source-truncated');
    }
  }
  return [...new Set(reasons)].sort(compareString) as DeepReviewRebuildReasonCode[];
}

function projectedResult(
  projection: DeepReviewProjectionState,
  sourceTailSequence: number,
  sourceTailEventDigest: string,
): DeepReviewProjectedResult {
  const checkpoint: DeepReviewProjectionCheckpoint = {
    projection,
    integrityDigest: deepReviewCheckpointIntegrityDigest(
      projection,
      sourceTailSequence,
      sourceTailEventDigest,
    ),
    sourceTailSequence,
    sourceTailEventDigest,
  };
  return immutableProjectionClone({
    outcome: 'projected',
    projection,
    integrityDigest: deepReviewProjectionIntegrityDigest(projection),
    checkpoint,
  }) as unknown as DeepReviewProjectedResult;
}

function hasSequenceGap(
  events: readonly DeepReviewLedgerEvent[],
  checkpoint: DeepReviewProjectionCheckpoint | undefined,
): boolean {
  const expectedByStream = new Map<string, number>();
  const checkpointEventIds = new Set<string>();
  for (const seen of checkpoint?.projection.seenEvents ?? []) {
    checkpointEventIds.add(seen.eventId);
    expectedByStream.set(
      seen.streamId,
      Math.max(expectedByStream.get(seen.streamId) ?? 0, seen.streamSequence),
    );
  }
  const eventIds = new Set<string>();
  for (const event of events) {
    if (checkpointEventIds.has(event.event_id) || eventIds.has(event.event_id)) continue;
    const expected = expectedByStream.get(event.stream_id) ?? 0;
    if (event.stream_sequence !== expected + 1) return true;
    expectedByStream.set(event.stream_id, event.stream_sequence);
    eventIds.add(event.event_id);
  }
  return false;
}

/** Fold real typed ledger events into frozen, checkpointable projections. */
export function foldDeepReviewEvents(
  events: readonly DeepReviewLedgerEvent[],
  options: DeepReviewFoldOptions = {},
): DeepReviewFoldResult {
  const reasons = rebuildReasons(options);
  if (reasons.length > 0) {
    return Object.freeze({ outcome: 'rebuild_required', reasonCodes: Object.freeze(reasons) });
  }
  const validated = events.map(validateTypedEvent);
  if (options.requireContiguousTail !== false && hasSequenceGap(validated, options.checkpoint)) {
    return Object.freeze({
      outcome: 'rebuild_required',
      reasonCodes: Object.freeze(['cursor-gap'] as const),
    });
  }
  let projection = options.checkpoint?.projection ?? createDeepReviewProjectionState();
  for (const event of validated) projection = applyEvent(projection, event);
  const sourceTailSequence = Math.max(
    options.sourceTailSequence ?? 0,
    projection.seenEvents.length,
    options.checkpoint?.sourceTailSequence ?? 0,
  );
  const sourceTailEventDigest = projection.seenEvents.at(-1)?.eventDigest
    ?? options.checkpoint?.sourceTailEventDigest
    ?? EMPTY_DIGEST;
  return projectedResult(projection, sourceTailSequence, sourceTailEventDigest);
}

// ───────────────────────────────────────────────────────────────────
// 11. SHADOW-ONLY LEGACY VIEW
// ───────────────────────────────────────────────────────────────────

/** Project the complete canonical comparison structure without subset parity. */
export function projectDeepReviewLegacyView(
  projection: DeepReviewProjectionState,
): DeepReviewLegacyProjection {
  assertDeepReviewProjectionState(projection);
  const canonicalStructure = {
    iteration: projection.reviewLoop.currentIterationId,
    status: projection.status.state,
    terminalDecision: projection.reviewLoop.terminalDecision,
    coverage: projection.reviewLoop.coverageCells,
    findings: projection.findingLedger.findings,
    artifacts: projection.artifactIndex.artifacts,
    projectionHealth: projection.status.health,
  };
  const legacy: DeepReviewLegacyProjection = {
    authority: 'shadow-only',
    legacyAuthority: 'unchanged',
    ...canonicalStructure,
    parityFingerprint: sha256Bytes(canonicalBytes(canonicalStructure)),
  };
  assertDeepReviewLegacyProjection(legacy);
  return immutableProjectionClone(legacy) as DeepReviewLegacyProjection;
}

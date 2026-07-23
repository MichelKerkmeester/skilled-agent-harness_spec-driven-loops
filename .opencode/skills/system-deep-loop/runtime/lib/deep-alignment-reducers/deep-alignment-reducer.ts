// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Alignment Reducer
// ───────────────────────────────────────────────────────────────────

import {
  DeepAlignmentEventStems,
  DeepAlignmentWireEventTypes,
  createDeepAlignmentEventRegistry,
  isDeepAlignmentEventStem,
} from '../deep-alignment-ledger-schema/index.js';
import { reduceSharedReviewLoopBackbone } from '../deep-review-reducers/index.js';
import {
  canonicalBytes,
  canonicalJson,
  readEvent,
  sha256Bytes,
} from '../event-envelope/index.js';
import {
  DeepAlignmentReducerError,
  assertDeepAlignmentLegacyProjection,
  assertDeepAlignmentProjectionState,
  immutableProjectionClone,
  isDeepFrozenProjection,
} from './deep-alignment-projection-schema.js';

import type { VerifiedLedgerEvent } from '../authorized-ledger/index.js';
import type {
  DeepAlignmentEventEnvelope,
  DeepAlignmentEventStem,
  DeepAlignmentLedgerEvent,
  DeepAlignmentLedgerPayload,
} from '../deep-alignment-ledger-schema/index.js';
import type { JsonObject } from '../event-envelope/index.js';
import type {
  ModeContract,
  ModeReducerSet,
  ModeReductionResult,
} from '../mode-contracts/index.js';
import type {
  DeepAlignmentAdjudication,
  DeepAlignmentApplicabilityDecision,
  DeepAlignmentApplicabilityCoverage,
  DeepAlignmentArtifactRecord,
  DeepAlignmentAuthorityCompatibility,
  DeepAlignmentAuthorityReference,
  DeepAlignmentAuthorityValidation,
  DeepAlignmentAuthorityWitnessReplay,
  DeepAlignmentConformanceAssessment,
  DeepAlignmentConvergenceEvaluation,
  DeepAlignmentEvidenceReceipt,
  DeepAlignmentFinding,
  DeepAlignmentFindingCandidate,
  DeepAlignmentFindingVerification,
  DeepAlignmentFoldOptions,
  DeepAlignmentFoldResult,
  DeepAlignmentKnownDeviation,
  DeepAlignmentLanePlan,
  DeepAlignmentLaneState,
  DeepAlignmentLaneVerdict,
  DeepAlignmentLegacyProjection,
  DeepAlignmentModeStatus,
  DeepAlignmentObservation,
  DeepAlignmentObservationReconciliation,
  DeepAlignmentPassOutcome,
  DeepAlignmentPersistedField,
  DeepAlignmentProjectedResult,
  DeepAlignmentProjectionCheckpoint,
  DeepAlignmentProjectionFieldOwnership,
  DeepAlignmentProjectionState,
  DeepAlignmentProofWitness,
  DeepAlignmentRebuildReasonCode,
  DeepAlignmentSeenEvent,
  DeepAlignmentStatusProjection,
  DeepAlignmentStatusTransition,
} from './deep-alignment-projection-types.js';
import type {
  SharedReviewLoopBackboneInput,
  SharedReviewLoopModeConfiguration,
} from '../deep-review-reducers/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. PUBLIC CONTRACT CONSTANTS
// ───────────────────────────────────────────────────────────────────

export const DEEP_ALIGNMENT_PROJECTION_SCHEMA_VERSION =
  'deep-alignment-projection@1' as const;
export const DEEP_ALIGNMENT_REDUCER_VERSION = 'deep-alignment-reducer@1' as const;
export const DEEP_ALIGNMENT_PROJECTION_CODEC_VERSION = 'canonical-json@1' as const;
export const DEEP_ALIGNMENT_ORDERING_POLICY_VERSION = 'causal-input-order@1' as const;
export const DEEP_ALIGNMENT_REDUCER_ID = 'deep-alignment:projection-fold' as const;

export const DEEP_ALIGNMENT_SHARED_REVIEW_LOOP_CONFIGURATION:
SharedReviewLoopModeConfiguration = Object.freeze({
  mode: 'alignment',
  requiredCoveragePolicy: 'all-required-cells',
  hardVetoClasses: Object.freeze(['build', 'regression', 'schema', 'security']),
  terminalDecisionPolicy: 'typed-transition-only',
});

const eventRegistry = createDeepAlignmentEventRegistry();
const EMPTY_DIGEST = sha256Bytes(canonicalBytes([]));
const HARD_VETO_CLASS_SEPARATORS = '-._:/@';
type DeepAlignmentModeContractState = DeepAlignmentProjectionState & JsonObject;

const PERSISTED_FIELDS = Object.freeze([
  'schemaVersion',
  'reducerVersion',
  'codecVersion',
  'orderingPolicyVersion',
  'run',
  'reviewLoop',
  'authorityAlignment',
  'lanePlan',
  'applicability',
  'conformance',
  'proofWitness',
  'artifactIndex',
  'status',
  'cursors',
  'seenEvents',
] as const satisfies readonly DeepAlignmentPersistedField[]);

type ProjectionPlane =
  | 'reviewLoop'
  | 'authorityAlignment'
  | 'lanePlan'
  | 'applicability'
  | 'conformance'
  | 'proofWitness'
  | 'artifactIndex'
  | 'status';

export const DEEP_ALIGNMENT_EVENT_ROUTING = Object.freeze({
  'deep_alignment.run_initialized': Object.freeze(['reviewLoop', 'status']),
  'deep_alignment.run_resumed': Object.freeze(['status']),
  'deep_alignment.run_restarted': Object.freeze(['status']),
  'deep_alignment.authority_reference_bound': Object.freeze([
    'authorityAlignment', 'artifactIndex', 'status',
  ]),
  'deep_alignment.authority_validation_recorded': Object.freeze([
    'authorityAlignment', 'status',
  ]),
  'deep_alignment.authority_epoch_compatibility_recorded': Object.freeze([
    'authorityAlignment', 'status',
  ]),
  'deep_alignment.scope_resolved': Object.freeze(['reviewLoop', 'status']),
  'deep_alignment.dimension_ordered': Object.freeze(['reviewLoop', 'status']),
  'deep_alignment.protocol_plan_recorded': Object.freeze(['reviewLoop', 'status']),
  'deep_alignment.lane_plan_recorded': Object.freeze([
    'lanePlan', 'reviewLoop', 'status',
  ]),
  'deep_alignment.lane_started': Object.freeze(['lanePlan', 'status']),
  'deep_alignment.subject_snapshot_bound': Object.freeze([
    'lanePlan', 'artifactIndex', 'status',
  ]),
  'deep_alignment.applicability_evaluated': Object.freeze([
    'applicability', 'reviewLoop', 'status',
  ]),
  'deep_alignment.dimension_pass_started': Object.freeze(['reviewLoop', 'status']),
  'deep_alignment.observation_recorded': Object.freeze([
    'conformance', 'artifactIndex', 'status',
  ]),
  'deep_alignment.evidence_receipt_bound': Object.freeze([
    'proofWitness', 'artifactIndex', 'status',
  ]),
  'deep_alignment.observation_reconciled': Object.freeze(['conformance', 'status']),
  'deep_alignment.finding_candidate_emitted': Object.freeze([
    'conformance', 'status',
  ]),
  'deep_alignment.finding_verification_recorded': Object.freeze([
    'conformance', 'artifactIndex', 'status',
  ]),
  'deep_alignment.proof_witness_recorded': Object.freeze([
    'proofWitness', 'artifactIndex', 'status',
  ]),
  'deep_alignment.claim_adjudication_recorded': Object.freeze([
    'conformance', 'artifactIndex', 'status',
  ]),
  'deep_alignment.conformance_assessment_recorded': Object.freeze([
    'conformance', 'artifactIndex', 'status',
  ]),
  'deep_alignment.finding_lineage_recorded': Object.freeze(['conformance', 'status']),
  'deep_alignment.finding_state_changed': Object.freeze(['conformance', 'status']),
  'deep_alignment.known_deviation_recorded': Object.freeze([
    'conformance', 'artifactIndex', 'status',
  ]),
  'deep_alignment.known_deviation_invalidated': Object.freeze([
    'conformance', 'status',
  ]),
  'deep_alignment.applicability_coverage_recorded': Object.freeze([
    'applicability', 'reviewLoop', 'status',
  ]),
  'deep_alignment.authority_witness_replayed': Object.freeze([
    'authorityAlignment', 'status',
  ]),
  'deep_alignment.dimension_pass_completed': Object.freeze(['reviewLoop', 'status']),
  'deep_alignment.lane_completed': Object.freeze([
    'lanePlan', 'reviewLoop', 'status',
  ]),
  'deep_alignment.convergence_evaluated': Object.freeze(['reviewLoop', 'status']),
  'deep_alignment.graph_convergence_evaluated': Object.freeze(['reviewLoop', 'status']),
  'deep_alignment.blocked_stop_recorded': Object.freeze(['reviewLoop', 'status']),
  'deep_alignment.pause_recorded': Object.freeze(['reviewLoop', 'status']),
  'deep_alignment.recovery_started': Object.freeze(['reviewLoop', 'status']),
  'deep_alignment.synthesis_started': Object.freeze(['reviewLoop', 'status']),
  'deep_alignment.review_report_committed': Object.freeze(['artifactIndex', 'status']),
  'deep_alignment.continuity_save_requested': Object.freeze(['artifactIndex']),
  'deep_alignment.continuity_save_completed': Object.freeze(['artifactIndex']),
  'deep_alignment.continuity_save_failed': Object.freeze(['artifactIndex', 'status']),
  'deep_alignment.run_completed': Object.freeze(['reviewLoop', 'status']),
} as const satisfies Readonly<
  Record<DeepAlignmentEventStem, readonly ProjectionPlane[]>
>);

function stemsForPlane(plane: ProjectionPlane): readonly DeepAlignmentEventStem[] {
  return Object.freeze(DeepAlignmentEventStems.filter((stem) => (
    DEEP_ALIGNMENT_EVENT_ROUTING[stem].includes(plane as never)
  )));
}

export const DEEP_ALIGNMENT_PROJECTION_FIELD_OWNERSHIP = Object.freeze(
  PERSISTED_FIELDS.map((field): DeepAlignmentProjectionFieldOwnership => ({
    field,
    ownerReducerId: DEEP_ALIGNMENT_REDUCER_ID,
    inputStems: field === 'schemaVersion'
      || field === 'reducerVersion'
      || field === 'codecVersion'
      || field === 'orderingPolicyVersion'
      ? Object.freeze([])
      : field === 'seenEvents' || field === 'cursors' || field === 'run'
        ? DeepAlignmentEventStems
        : stemsForPlane(field as ProjectionPlane),
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

export const DEEP_ALIGNMENT_REDUCER_SET:
ModeReducerSet<DeepAlignmentModeContractState> = Object.freeze({
  persistedFields: PERSISTED_FIELDS,
  definitions: Object.freeze([Object.freeze({
    reducerId: DEEP_ALIGNMENT_REDUCER_ID,
    reducerVersion: DEEP_ALIGNMENT_REDUCER_VERSION,
    stateVersion: DEEP_ALIGNMENT_PROJECTION_SCHEMA_VERSION,
    ownedFields: PERSISTED_FIELDS,
    inputEventTypes: Object.freeze(
      DeepAlignmentEventStems.map((stem) => DeepAlignmentWireEventTypes[stem]),
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

function sameCanonical(left: unknown, right: unknown): boolean {
  return canonicalJson(left) === canonicalJson(right);
}

function sortStrings(values: readonly string[]): string[] {
  return [...new Set(values)].sort(compareString);
}

function payloadFor<TStem extends DeepAlignmentEventStem>(
  event: DeepAlignmentLedgerEvent,
  stem: TStem,
): DeepAlignmentLedgerPayload<TStem> {
  if (event.payload.stem !== stem) {
    throw new DeepAlignmentReducerError(
      'event-not-deep-alignment',
      `Expected ${stem}, received ${event.payload.stem}`,
      'payload.stem',
    );
  }
  return event.payload as DeepAlignmentLedgerPayload<TStem>;
}

function assertNeverStem(stem: never): never {
  throw new DeepAlignmentReducerError(
    'event-not-deep-alignment',
    `Unhandled deep-alignment event stem: ${String(stem)}`,
    'payload.stem',
  );
}

function eventDigest(event: DeepAlignmentLedgerEvent): string {
  return sha256Bytes(canonicalBytes(event));
}

function producerPosition(
  seenEvents: readonly DeepAlignmentSeenEvent[],
  producerEventId: string,
): number {
  const position = seenEvents.findIndex((event) => event.eventId === producerEventId);
  if (position === -1) {
    throw new DeepAlignmentReducerError(
      'referential-integrity',
      'Temporal records require captured producer-event provenance',
      'seenEvents',
    );
  }
  return position;
}

function compareProducerEvents(
  seenEvents: readonly DeepAlignmentSeenEvent[],
  leftEventId: string,
  rightEventId: string,
): number {
  return producerPosition(seenEvents, leftEventId)
    - producerPosition(seenEvents, rightEventId)
    || compareString(leftEventId, rightEventId);
}

function sortByProducer<T extends { readonly producerEventId: string }>(
  values: readonly T[],
  seenEvents: readonly DeepAlignmentSeenEvent[],
): T[] {
  return [...values].sort((left, right) => compareProducerEvents(
    seenEvents,
    left.producerEventId,
    right.producerEventId,
  ));
}

function upsertStable<T>(
  values: readonly T[],
  candidate: T,
  identity: (value: T) => string,
  field: string,
): T[] {
  const key = identity(candidate);
  const prior = values.find((value) => identity(value) === key);
  if (prior !== undefined && !sameCanonical(prior, candidate)) {
    throw new DeepAlignmentReducerError(
      'identity-conflict',
      `Stable identity ${key} cannot resolve to conflicting content`,
      field,
    );
  }
  return prior === undefined ? [...values, candidate] : [...values];
}

function validateTypedEvent(event: DeepAlignmentLedgerEvent): DeepAlignmentLedgerEvent {
  try {
    const read = readEvent(canonicalBytes(event), eventRegistry);
    const effective = read.effective.envelope;
    const payload = effective.payload;
    if (!isDeepAlignmentEventStem(payload.stem)
      || effective.event_type !== DeepAlignmentWireEventTypes[payload.stem]) {
      throw new DeepAlignmentReducerError(
        'event-not-deep-alignment',
        'Verified event does not carry a registered deep-alignment stem',
        'event_type',
      );
    }
    return effective as DeepAlignmentLedgerEvent;
  } catch (error: unknown) {
    if (error instanceof DeepAlignmentReducerError) throw error;
    throw new DeepAlignmentReducerError(
      'event-schema-invalid',
      'Deep-alignment event failed the real typed-ledger registry',
      'event',
    );
  }
}

function typedEventFromVerified(verified: VerifiedLedgerEvent): DeepAlignmentLedgerEvent {
  const envelope = verified.event.effective.envelope;
  const payload = envelope.payload;
  if (!isDeepAlignmentEventStem(payload.stem)
    || envelope.event_type !== DeepAlignmentWireEventTypes[payload.stem]) {
    throw new DeepAlignmentReducerError(
      'event-not-deep-alignment',
      'Mode reducer received a verified event outside the deep-alignment union',
      'event_type',
    );
  }
  return validateTypedEvent(envelope as DeepAlignmentLedgerEvent);
}

function asModeContractState(
  state: DeepAlignmentProjectionState,
): DeepAlignmentModeContractState {
  assertDeepAlignmentProjectionState(state);
  return state as DeepAlignmentModeContractState;
}

function establishedRunStreamId(state: DeepAlignmentProjectionState): string {
  const initialized = state.run.initializationEventId === null
    ? undefined
    : state.seenEvents.find((event) => event.eventId === state.run.initializationEventId);
  if (initialized === undefined || initialized.stem !== 'deep_alignment.run_initialized') {
    throw new DeepAlignmentReducerError(
      'referential-integrity',
      'Run stream identity requires its captured initialization event',
      'run.initializationEventId',
    );
  }
  return initialized.streamId;
}

function isHardVetoClass(findingClass: string): boolean {
  const normalized = findingClass.toLowerCase();
  return DEEP_ALIGNMENT_SHARED_REVIEW_LOOP_CONFIGURATION.hardVetoClasses.some(
    (veto) => normalized === veto || (
      normalized.startsWith(veto)
      && HARD_VETO_CLASS_SEPARATORS.includes(normalized.charAt(veto.length))
    ),
  );
}

function derivedSeverity(
  findingClass: string,
  outcome: DeepAlignmentAdjudication['outcome'],
  impact: number,
  confidence: number,
): DeepAlignmentAdjudication['derivedSeverity'] {
  if (outcome !== 'accepted') return 'none';
  if (isHardVetoClass(findingClass)) return 'P0';
  if (impact >= 0.8 && confidence >= 0.6) return 'P1';
  return 'P2';
}

// ───────────────────────────────────────────────────────────────────
// 3. INITIAL STATE
// ───────────────────────────────────────────────────────────────────

/** Create the immutable empty state accepted by the shared mode reducer contract. */
export function createDeepAlignmentProjectionState(): DeepAlignmentProjectionState {
  const state: DeepAlignmentProjectionState = {
    schemaVersion: DEEP_ALIGNMENT_PROJECTION_SCHEMA_VERSION,
    reducerVersion: DEEP_ALIGNMENT_REDUCER_VERSION,
    codecVersion: DEEP_ALIGNMENT_PROJECTION_CODEC_VERSION,
    orderingPolicyVersion: DEEP_ALIGNMENT_ORDERING_POLICY_VERSION,
    run: {
      runId: null,
      sessionId: null,
      authorityEpochId: null,
      generation: 0,
      target: null,
      maxIterations: 0,
      convergencePolicyVersion: null,
      alignmentModeContractDigest: null,
      initializationEventId: null,
    },
    reviewLoop: {
      configuration: DEEP_ALIGNMENT_SHARED_REVIEW_LOOP_CONFIGURATION,
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
    authorityAlignment: {
      references: [],
      validations: [],
      compatibilities: [],
      witnessReplays: [],
      activeValidationEventId: null,
      status: 'missing',
    },
    lanePlan: { plans: [], subjects: [], lanes: [] },
    applicability: { decisions: [], coverage: [] },
    conformance: {
      observations: [],
      reconciliations: [],
      candidates: [],
      verifications: [],
      adjudications: [],
      findings: [],
      assessments: [],
      deviations: [],
      laneVerdicts: [],
      overallVerdict: 'INCONCLUSIVE',
      activeFindingIds: [],
      hardVetoFindingIds: [],
    },
    proofWitness: { evidenceReceipts: [], witnesses: [] },
    artifactIndex: { artifacts: [] },
    status: {
      state: 'planned',
      terminal: false,
      health: 'healthy',
      activeContractVersions: [],
      activeAuthorityEpochs: [],
      laneStatuses: [],
      lastAppliedSequence: 0,
      blockingReason: null,
      shadowParityState: 'not-run',
      provenance: [],
    },
    cursors: {
      reviewLoop: 0,
      authorityAlignment: 0,
      lanePlan: 0,
      applicability: 0,
      conformance: 0,
      proofWitness: 0,
      artifactIndex: 0,
      status: 0,
    },
    seenEvents: [],
  };
  assertDeepAlignmentProjectionState(state);
  return immutableProjectionClone(state) as DeepAlignmentProjectionState;
}

// ───────────────────────────────────────────────────────────────────
// 4. RUN, AUTHORITY, AND LANE FOLDS
// ───────────────────────────────────────────────────────────────────

function assertRunIdentity(
  state: DeepAlignmentProjectionState,
  event: DeepAlignmentLedgerEvent,
): void {
  if (state.run.runId === null && event.payload.stem !== 'deep_alignment.run_initialized') {
    throw new DeepAlignmentReducerError(
      'run-not-initialized',
      'A run-initialized event must be the causal genesis of deep-alignment replay',
      'run',
    );
  }
  if (state.run.runId !== null && (
    state.run.runId !== event.payload.scope.runId
    || state.run.sessionId !== event.payload.scope.sessionId
    || state.run.authorityEpochId !== event.payload.scope.authorityEpochId
  )) {
    throw new DeepAlignmentReducerError(
      'run-identity-conflict',
      'One projection cannot fold different run, session, or authority-epoch identities',
      'run',
    );
  }
}

function foldRun(
  state: DeepAlignmentProjectionState,
  event: DeepAlignmentLedgerEvent,
): DeepAlignmentProjectionState['run'] {
  if (event.payload.stem === 'deep_alignment.run_initialized') {
    const payload = payloadFor(event, 'deep_alignment.run_initialized');
    if (state.run.initializationEventId !== null
      && state.run.initializationEventId !== event.event_id) {
      throw new DeepAlignmentReducerError(
        'duplicate-terminal-event',
        'A projection accepts exactly one run initialization',
        'run.initializationEventId',
      );
    }
    return {
      runId: payload.scope.runId,
      sessionId: payload.scope.sessionId,
      authorityEpochId: payload.scope.authorityEpochId,
      generation: payload.scope.generation,
      target: payload.data.target,
      maxIterations: payload.data.maxIterations,
      convergencePolicyVersion: payload.data.convergencePolicyVersion,
      alignmentModeContractDigest: payload.data.reviewModeContractDigest,
      initializationEventId: event.event_id,
    };
  }
  if (event.payload.stem === 'deep_alignment.run_resumed'
    || event.payload.stem === 'deep_alignment.run_restarted') {
    return { ...state.run, generation: event.payload.scope.generation };
  }
  return state.run;
}

function foldAuthority(
  state: DeepAlignmentProjectionState,
  event: DeepAlignmentLedgerEvent,
): DeepAlignmentProjectionState['authorityAlignment'] {
  const projection = state.authorityAlignment;
  switch (event.payload.stem) {
    case 'deep_alignment.authority_reference_bound': {
      const payload = payloadFor(event, 'deep_alignment.authority_reference_bound');
      const candidate: DeepAlignmentAuthorityReference = {
        authorityEpochId: payload.scope.authorityEpochId,
        ...payload.data,
        producerEventId: event.event_id,
      };
      return {
        ...projection,
        references: upsertStable(
          projection.references,
          candidate,
          (value) => value.authorityEpochId,
          'authorityAlignment.references.authorityEpochId',
        ),
      };
    }
    case 'deep_alignment.authority_validation_recorded': {
      const payload = payloadFor(event, 'deep_alignment.authority_validation_recorded');
      const reference = projection.references.find(
        (candidate) => candidate.producerEventId === payload.data.authorityReferenceEventId
          && candidate.authorityEpochId === payload.scope.authorityEpochId,
      );
      if (reference === undefined) {
        throw new DeepAlignmentReducerError(
          'referential-integrity',
          'Authority validation must cite the bound reference for its own epoch',
          'authorityAlignment.validations.authorityReferenceEventId',
        );
      }
      const candidate: DeepAlignmentAuthorityValidation = {
        authorityEpochId: payload.scope.authorityEpochId,
        ...payload.data,
        validationReceiptRefs: sortStrings(payload.data.validationReceiptRefs),
        producerEventId: event.event_id,
      };
      const validations = upsertStable(
        projection.validations,
        candidate,
        (value) => value.producerEventId,
        'authorityAlignment.validations',
      );
      return {
        ...projection,
        validations,
        activeValidationEventId: event.event_id,
        status: candidate.authorityStatus === 'valid' ? 'valid' : 'invalid',
      };
    }
    case 'deep_alignment.authority_epoch_compatibility_recorded': {
      const payload = payloadFor(
        event,
        'deep_alignment.authority_epoch_compatibility_recorded',
      );
      const candidate: DeepAlignmentAuthorityCompatibility = {
        ...payload.data,
        affectedRuleIds: sortStrings(payload.data.affectedRuleIds),
        orderedUpcastPath: [...payload.data.orderedUpcastPath],
        producerEventId: event.event_id,
      };
      return {
        ...projection,
        compatibilities: upsertStable(
          projection.compatibilities,
          candidate,
          (value) => value.producerEventId,
          'authorityAlignment.compatibilities',
        ),
      };
    }
    case 'deep_alignment.authority_witness_replayed': {
      const payload = payloadFor(event, 'deep_alignment.authority_witness_replayed');
      const proof = state.proofWitness.witnesses.find(
        (candidate) => candidate.producerEventId === payload.data.witnessEventId
          && candidate.proofId === payload.scope.proofId
          && candidate.findingId === payload.scope.findingId,
      );
      const compatibility = projection.compatibilities.find(
        (candidate) => candidate.producerEventId
          === payload.data.compatibilityDecisionEventId
          && candidate.sourceAuthorityEpochId === payload.data.sourceAuthorityEpochId
          && candidate.targetAuthorityEpochId === payload.data.targetAuthorityEpochId,
      );
      if (proof === undefined || compatibility === undefined) {
        throw new DeepAlignmentReducerError(
          'referential-integrity',
          'Authority replay must cite its own proof and compatibility decision',
          'authorityAlignment.witnessReplays',
        );
      }
      const candidate: DeepAlignmentAuthorityWitnessReplay = {
        proofId: payload.scope.proofId,
        laneId: payload.scope.laneId,
        subjectId: payload.scope.subjectId,
        sourceAuthorityEpochId: payload.data.sourceAuthorityEpochId,
        targetAuthorityEpochId: payload.data.targetAuthorityEpochId,
        witnessEventId: payload.data.witnessEventId,
        compatibilityDecisionEventId: payload.data.compatibilityDecisionEventId,
        replayOutcome: payload.data.replayOutcome,
        replayDigest: payload.data.replayDigest,
        producerEventId: event.event_id,
      };
      return {
        ...projection,
        witnessReplays: upsertStable(
          projection.witnessReplays,
          candidate,
          (value) => value.producerEventId,
          'authorityAlignment.witnessReplays',
        ),
      };
    }
    default:
      return projection;
  }
}

function assertValidAuthority(
  state: DeepAlignmentProjectionState,
  validationEventId: string,
): DeepAlignmentAuthorityValidation {
  const validation = state.authorityAlignment.validations.find(
    (candidate) => candidate.producerEventId === validationEventId
      && candidate.authorityEpochId === state.run.authorityEpochId,
  );
  if (validation === undefined
    || validation.authorityStatus !== 'valid'
    || state.authorityAlignment.activeValidationEventId !== validationEventId
    || state.authorityAlignment.status !== 'valid') {
    throw new DeepAlignmentReducerError(
      'referential-integrity',
      'Alignment work requires a valid authority record from the run epoch',
      'authorityAlignment.activeValidationEventId',
    );
  }
  return validation;
}

function foldLanePlan(
  state: DeepAlignmentProjectionState,
  event: DeepAlignmentLedgerEvent,
): DeepAlignmentProjectionState['lanePlan'] {
  const projection = state.lanePlan;
  switch (event.payload.stem) {
    case 'deep_alignment.lane_plan_recorded': {
      const payload = payloadFor(event, 'deep_alignment.lane_plan_recorded');
      const reference = state.authorityAlignment.references.find(
        (candidate) => candidate.authorityEpochId === payload.scope.authorityEpochId,
      );
      if (reference === undefined || reference.ruleIrDigest !== payload.data.ruleIrDigest) {
        throw new DeepAlignmentReducerError(
          'referential-integrity',
          'Lane plans must bind the rule IR from their authority epoch',
          'lanePlan.plans.ruleIrDigest',
        );
      }
      const candidate: DeepAlignmentLanePlan = {
        laneId: payload.scope.laneId,
        iterationId: payload.scope.iterationId,
        authorityEpochId: payload.scope.authorityEpochId,
        ...payload.data,
        orderedRuleIds: [...payload.data.orderedRuleIds],
        requiredEvidenceClasses: sortStrings(payload.data.requiredEvidenceClasses),
        producerEventId: event.event_id,
      };
      const plans = upsertStable(
        projection.plans,
        candidate,
        (value) => value.laneId,
        'lanePlan.plans.laneId',
      );
      const lanes = upsertStable(
        projection.lanes,
        {
          laneId: candidate.laneId,
          iterationId: candidate.iterationId,
          lanePlanEventId: candidate.producerEventId,
          authorityValidationEventId: '',
          subjectSnapshotRef: '',
          subjectSnapshotDigest: EMPTY_DIGEST,
          status: 'planned',
          counts: null,
          applicabilityDecisionRefs: [],
          observationRefs: [],
          verificationRefs: [],
          completionDigest: null,
          blockedReasonCode: null,
          producerEventId: candidate.producerEventId,
        },
        (value) => value.laneId,
        'lanePlan.lanes.laneId',
      );
      return { ...projection, plans, lanes };
    }
    case 'deep_alignment.lane_started': {
      const payload = payloadFor(event, 'deep_alignment.lane_started');
      const plan = projection.plans.find(
        (candidate) => candidate.producerEventId === payload.data.lanePlanEventId
          && candidate.laneId === payload.scope.laneId,
      );
      assertValidAuthority(state, payload.data.authorityValidationEventId);
      if (plan === undefined) {
        throw new DeepAlignmentReducerError(
          'referential-integrity',
          'Lane start must cite its own immutable lane plan',
          'lanePlan.lanes.lanePlanEventId',
        );
      }
      const index = projection.lanes.findIndex((lane) => lane.laneId === plan.laneId);
      const prior = projection.lanes[index];
      if (prior.status !== 'planned') {
        throw new DeepAlignmentReducerError(
          'impossible-transition',
          'A lane can start only from planned state',
          'lanePlan.lanes.status',
        );
      }
      const lanes = [...projection.lanes];
      lanes[index] = {
        ...prior,
        authorityValidationEventId: payload.data.authorityValidationEventId,
        subjectSnapshotRef: payload.data.subjectSnapshotRef,
        subjectSnapshotDigest: payload.data.subjectSnapshotDigest,
        status: 'started',
        producerEventId: event.event_id,
      };
      return { ...projection, lanes };
    }
    case 'deep_alignment.subject_snapshot_bound': {
      const payload = payloadFor(event, 'deep_alignment.subject_snapshot_bound');
      const lane = projection.lanes.find(
        (candidate) => candidate.laneId === payload.scope.laneId
          && candidate.status === 'started',
      );
      if (lane === undefined
        || lane.subjectSnapshotRef !== payload.data.subjectSnapshotRef
        || lane.subjectSnapshotDigest !== payload.data.subjectDigest) {
        throw new DeepAlignmentReducerError(
          'referential-integrity',
          'Subject snapshots must be owned by the started lane that declared them',
          'lanePlan.subjects',
        );
      }
      const candidate = {
        subjectId: payload.scope.subjectId,
        laneId: payload.scope.laneId,
        ...payload.data,
        producerEventId: event.event_id,
      };
      return {
        ...projection,
        subjects: upsertStable(
          projection.subjects,
          candidate,
          (value) => value.subjectId,
          'lanePlan.subjects.subjectId',
        ),
      };
    }
    case 'deep_alignment.lane_completed':
      return foldLaneCompleted(
        state,
        event as DeepAlignmentEventEnvelope<'deep_alignment.lane_completed'>,
        projection,
      );
    default:
      return projection;
  }
}

function foldLaneCompleted(
  state: DeepAlignmentProjectionState,
  event: DeepAlignmentEventEnvelope<'deep_alignment.lane_completed'>,
  projection: DeepAlignmentProjectionState['lanePlan'],
): DeepAlignmentProjectionState['lanePlan'] {
  const payload = event.payload;
  const index = projection.lanes.findIndex(
    (lane) => lane.laneId === payload.scope.laneId,
  );
  if (index === -1 || projection.lanes[index].status !== 'started') {
    throw new DeepAlignmentReducerError(
      'impossible-transition',
      'Lane completion requires its own started lane',
      'lanePlan.lanes.status',
    );
  }
  const prior = projection.lanes[index];
  if (prior.lanePlanEventId !== payload.data.lanePlanEventId
    || prior.subjectSnapshotRef !== payload.data.subjectSnapshotRef
    || prior.subjectSnapshotDigest !== payload.data.subjectSnapshotDigest
    || prior.authorityValidationEventId !== payload.data.authorityValidationEventId) {
    throw new DeepAlignmentReducerError(
      'referential-integrity',
      'Lane completion cannot borrow plan, subject, or authority references',
      'lanePlan.lanes',
    );
  }
  const ownDecisions = new Set(state.applicability.decisions
    .filter((entry) => entry.laneId === prior.laneId)
    .map((entry) => entry.decisionId));
  const ownObservations = new Set(state.conformance.observations
    .filter((entry) => entry.laneId === prior.laneId)
    .flatMap((entry) => [entry.observationId, entry.producerEventId]));
  const ownVerifications = new Set(state.conformance.verifications
    .filter((entry) => state.conformance.candidates.some(
      (candidate) => candidate.candidateId === entry.candidateId
        && candidate.laneId === prior.laneId,
    ))
    .flatMap((entry) => [entry.verificationId, entry.producerEventId]));
  if (payload.data.applicabilityDecisionRefs.some((id) => !ownDecisions.has(id))
    || payload.data.observationRefs.some((id) => !ownObservations.has(id))
    || payload.data.verificationRefs.some((id) => !ownVerifications.has(id))) {
    throw new DeepAlignmentReducerError(
      'referential-integrity',
      'Lane completion references must be owned by that lane',
      'lanePlan.lanes',
    );
  }
  const lanes = [...projection.lanes];
  lanes[index] = {
    ...prior,
    status: payload.data.status,
    counts: payload.data.counts,
    applicabilityDecisionRefs: sortStrings(payload.data.applicabilityDecisionRefs),
    observationRefs: sortStrings(payload.data.observationRefs),
    verificationRefs: sortStrings(payload.data.verificationRefs),
    completionDigest: payload.data.completionDigest,
    blockedReasonCode: payload.data.blockedReasonCode,
    producerEventId: event.event_id,
  };
  return { ...projection, lanes };
}

// ───────────────────────────────────────────────────────────────────
// 5. APPLICABILITY AND PROOF FOLDS
// ───────────────────────────────────────────────────────────────────

function foldApplicability(
  state: DeepAlignmentProjectionState,
  event: DeepAlignmentLedgerEvent,
): DeepAlignmentProjectionState['applicability'] {
  const projection = state.applicability;
  if (event.payload.stem === 'deep_alignment.applicability_evaluated') {
    const payload = payloadFor(event, 'deep_alignment.applicability_evaluated');
    const plan = state.lanePlan.plans.find(
      (candidate) => candidate.laneId === payload.scope.laneId
        && candidate.orderedRuleIds.includes(payload.scope.ruleId),
    );
    const subject = state.lanePlan.subjects.find(
      (candidate) => candidate.subjectId === payload.scope.subjectId
        && candidate.laneId === payload.scope.laneId,
    );
    assertValidAuthority(state, payload.data.authorityValidationEventId);
    if (plan === undefined || subject === undefined) {
      throw new DeepAlignmentReducerError(
        'referential-integrity',
        'Applicability decisions require a rule and subject owned by their lane',
        'applicability.decisions',
      );
    }
    const candidate: DeepAlignmentApplicabilityDecision = {
      decisionId: event.event_id,
      laneId: payload.scope.laneId,
      subjectId: payload.scope.subjectId,
      ruleId: payload.scope.ruleId,
      authorityValidationEventId: payload.data.authorityValidationEventId,
      result: payload.data.result,
      predicateRef: payload.data.predicateRef,
      predicateDigest: payload.data.predicateDigest,
      targetFactRefs: sortStrings(payload.data.targetFactRefs),
      targetFactDigest: payload.data.targetFactDigest,
      evaluatorFingerprint: payload.data.evaluatorFingerprint,
      decisionDigest: payload.data.decisionDigest,
      reasonCode: payload.data.reasonCode,
      producerEventId: event.event_id,
    };
    const decisions = upsertStable(
      projection.decisions,
      candidate,
      (value) => `${value.laneId}:${value.subjectId}:${value.ruleId}`,
      'applicability.decisions',
    );
    return {
      ...projection,
      decisions: decisions.sort((left, right) => (
        compareString(left.laneId, right.laneId)
        || compareString(left.subjectId, right.subjectId)
        || compareString(left.ruleId, right.ruleId)
      )),
    };
  }
  if (event.payload.stem === 'deep_alignment.applicability_coverage_recorded') {
    const payload = payloadFor(event, 'deep_alignment.applicability_coverage_recorded');
    const plan = state.lanePlan.plans.find(
      (candidate) => candidate.laneId === payload.scope.laneId,
    );
    const subject = state.lanePlan.subjects.find(
      (candidate) => candidate.laneId === payload.scope.laneId
        && candidate.subjectDigest === payload.data.subjectSnapshotDigest,
    );
    assertValidAuthority(state, payload.data.authorityValidationEventId);
    const classified = sortStrings([
      ...payload.data.applicableRuleIds,
      ...payload.data.notApplicableRuleIds,
      ...payload.data.unresolvedRuleIds,
      ...payload.data.untestedRuleIds,
      ...payload.data.blockedRuleIds,
    ]);
    if (plan === undefined
      || subject === undefined
      || !sameCanonical(classified, sortStrings(plan.orderedRuleIds))) {
      throw new DeepAlignmentReducerError(
        'referential-integrity',
        'Applicability coverage must classify every rule in its own lane plan',
        'applicability.coverage',
      );
    }
    const candidate: DeepAlignmentApplicabilityCoverage = {
      laneId: payload.scope.laneId,
      authorityValidationEventId: payload.data.authorityValidationEventId,
      subjectSnapshotDigest: payload.data.subjectSnapshotDigest,
      declaredApplicabilityEdgeRefs: sortStrings(
        payload.data.declaredApplicabilityEdgeRefs,
      ),
      applicableRuleIds: sortStrings(payload.data.applicableRuleIds),
      notApplicableRuleIds: sortStrings(payload.data.notApplicableRuleIds),
      unresolvedRuleIds: sortStrings(payload.data.unresolvedRuleIds),
      untestedRuleIds: sortStrings(payload.data.untestedRuleIds),
      blockedRuleIds: sortStrings(payload.data.blockedRuleIds),
      coverageDigest: payload.data.coverageDigest,
      producerEventId: event.event_id,
    };
    return {
      ...projection,
      coverage: upsertStable(
        projection.coverage,
        candidate,
        (value) => value.laneId,
        'applicability.coverage.laneId',
      ).sort((left, right) => compareString(left.laneId, right.laneId)),
    };
  }
  return projection;
}

function foldEvidenceReceipt(
  state: DeepAlignmentProjectionState,
  event: DeepAlignmentEventEnvelope<'deep_alignment.evidence_receipt_bound'>,
): DeepAlignmentProjectionState['proofWitness'] {
  const payload = event.payload;
  const observation = state.conformance.observations.find(
    (candidate) => candidate.producerEventId === payload.data.observationEventId
      && candidate.observationId === payload.scope.observationId
      && candidate.laneId === payload.scope.laneId
      && candidate.subjectId === payload.scope.subjectId
      && candidate.ruleId === payload.scope.ruleId,
  );
  if (observation === undefined) {
    throw new DeepAlignmentReducerError(
      'referential-integrity',
      'Evidence receipts must cite an observation owned by the same rule subject',
      'proofWitness.evidenceReceipts.observationEventId',
    );
  }
  const candidate: DeepAlignmentEvidenceReceipt = {
    evidenceId: payload.scope.evidenceId,
    observationId: payload.scope.observationId,
    laneId: payload.scope.laneId,
    subjectId: payload.scope.subjectId,
    ruleId: payload.scope.ruleId,
    ...payload.data,
    producerEventId: event.event_id,
  };
  const receipts = upsertStable(
    state.proofWitness.evidenceReceipts,
    candidate,
    (value) => value.evidenceId,
    'proofWitness.evidenceReceipts.evidenceId',
  );
  return {
    ...state.proofWitness,
    evidenceReceipts: sortByProducer(receipts, state.seenEvents),
  };
}

function foldProofWitness(
  state: DeepAlignmentProjectionState,
  event: DeepAlignmentEventEnvelope<'deep_alignment.proof_witness_recorded'>,
): DeepAlignmentProjectionState['proofWitness'] {
  const payload = event.payload;
  const verification = state.conformance.verifications.find(
    (candidate) => candidate.producerEventId === payload.data.verificationEventId
      && candidate.verificationId === payload.scope.verificationId
      && candidate.findingId === payload.scope.findingId
      && candidate.candidateId === payload.scope.candidateId,
  );
  if (verification === undefined) {
    throw new DeepAlignmentReducerError(
      'referential-integrity',
      'Proof witnesses must cite verification owned by the same finding',
      'proofWitness.witnesses.verificationEventId',
    );
  }
  const ownedReceipts = new Set(state.proofWitness.evidenceReceipts
    .filter((receipt) => receipt.observationId === verification.observationId)
    .map((receipt) => receipt.receiptRef));
  if (payload.data.receiptRefs.some((receiptRef) => !ownedReceipts.has(receiptRef))) {
    throw new DeepAlignmentReducerError(
      'referential-integrity',
      'Proof witnesses cannot borrow receipts from another observation',
      'proofWitness.witnesses.receiptRefs',
    );
  }
  const candidate: DeepAlignmentProofWitness = {
    proofId: payload.scope.proofId,
    findingId: payload.scope.findingId,
    candidateId: payload.scope.candidateId,
    verificationId: payload.scope.verificationId,
    ...payload.data,
    receiptRefs: sortStrings(payload.data.receiptRefs),
    producerEventId: event.event_id,
  };
  const witnesses = upsertStable(
    state.proofWitness.witnesses,
    candidate,
    (value) => value.proofId,
    'proofWitness.witnesses.proofId',
  );
  return {
    ...state.proofWitness,
    witnesses: sortByProducer(witnesses, state.seenEvents),
  };
}

// ───────────────────────────────────────────────────────────────────
// 6. CONFORMANCE FOLDS
// ───────────────────────────────────────────────────────────────────

function findOwnedObservation(
  state: DeepAlignmentProjectionState,
  eventId: string,
  scope: {
    readonly laneId: string;
    readonly subjectId: string;
    readonly ruleId: string;
    readonly observationId: string;
  },
): DeepAlignmentObservation | undefined {
  return state.conformance.observations.find(
    (candidate) => candidate.producerEventId === eventId
      && candidate.observationId === scope.observationId
      && candidate.laneId === scope.laneId
      && candidate.subjectId === scope.subjectId
      && candidate.ruleId === scope.ruleId,
  );
}

function foldObservation(
  state: DeepAlignmentProjectionState,
  event: DeepAlignmentEventEnvelope<'deep_alignment.observation_recorded'>,
): DeepAlignmentProjectionState['conformance'] {
  const payload = event.payload;
  const decision = state.applicability.decisions.find(
    (candidate) => candidate.decisionId === payload.data.applicabilityDecisionId
      && candidate.laneId === payload.scope.laneId
      && candidate.subjectId === payload.scope.subjectId
      && candidate.ruleId === payload.scope.ruleId,
  );
  const subject = state.lanePlan.subjects.find(
    (candidate) => candidate.subjectId === payload.scope.subjectId
      && candidate.laneId === payload.scope.laneId
      && candidate.subjectSnapshotRef === payload.data.subjectSnapshotRef
      && candidate.subjectDigest === payload.data.subjectSnapshotDigest,
  );
  if (decision === undefined || decision.result !== 'applicable' || subject === undefined) {
    throw new DeepAlignmentReducerError(
      'referential-integrity',
      'Raw observations require an applicable rule and its own subject snapshot',
      'conformance.observations',
    );
  }
  const candidate: DeepAlignmentObservation = {
    observationId: payload.scope.observationId,
    laneId: payload.scope.laneId,
    subjectId: payload.scope.subjectId,
    ruleId: payload.scope.ruleId,
    ...payload.data,
    receiptRefs: sortStrings(payload.data.receiptRefs),
    producerEventId: event.event_id,
  };
  const observations = upsertStable(
    state.conformance.observations,
    candidate,
    (value) => value.observationId,
    'conformance.observations.observationId',
  );
  return {
    ...state.conformance,
    observations: sortByProducer(observations, state.seenEvents),
  };
}

function foldObservationReconciliation(
  state: DeepAlignmentProjectionState,
  event: DeepAlignmentEventEnvelope<'deep_alignment.observation_reconciled'>,
): DeepAlignmentProjectionState['conformance'] {
  const payload = event.payload;
  const observation = findOwnedObservation(
    state,
    payload.data.observationEventId,
    payload.scope,
  );
  const predecessorOwned = findOwnedObservation(
    state,
    payload.data.predecessorObservationEventId,
    payload.scope,
  ) !== undefined || state.conformance.reconciliations.some(
    (candidate) => candidate.producerEventId
      === payload.data.predecessorObservationEventId
      && candidate.observationId === payload.scope.observationId,
  );
  const receipts = new Set(state.proofWitness.evidenceReceipts
    .filter((entry) => entry.observationId === payload.scope.observationId)
    .map((entry) => entry.receiptRef));
  if (observation === undefined
    || !predecessorOwned
    || payload.data.evidenceReceiptRefs.some((ref) => !receipts.has(ref))) {
    throw new DeepAlignmentReducerError(
      'referential-integrity',
      'Observation reconciliation must retain observation ownership and evidence',
      'conformance.reconciliations',
    );
  }
  const candidate: DeepAlignmentObservationReconciliation = {
    observationId: payload.scope.observationId,
    observationEventId: payload.data.observationEventId,
    predecessorObservationEventId: payload.data.predecessorObservationEventId,
    evidenceReceiptRefs: sortStrings(payload.data.evidenceReceiptRefs),
    outcome: payload.data.reconciliationOutcome,
    evidenceSetDigest: payload.data.evidenceSetDigest,
    reconcilerFingerprint: payload.data.reconcilerFingerprint,
    reasonCode: payload.data.reasonCode,
    producerEventId: event.event_id,
  };
  const reconciliations = upsertStable(
    state.conformance.reconciliations,
    candidate,
    (value) => value.producerEventId,
    'conformance.reconciliations',
  );
  return {
    ...state.conformance,
    reconciliations: sortByProducer(reconciliations, state.seenEvents),
  };
}

function foldCandidate(
  state: DeepAlignmentProjectionState,
  event: DeepAlignmentEventEnvelope<'deep_alignment.finding_candidate_emitted'>,
): DeepAlignmentProjectionState['conformance'] {
  const payload = event.payload;
  const observation = findOwnedObservation(
    state,
    payload.data.observationEventId,
    payload.scope,
  );
  const decision = state.applicability.decisions.find(
    (candidate) => candidate.decisionId === payload.data.applicabilityDecisionId
      && candidate.laneId === payload.scope.laneId
      && candidate.subjectId === payload.scope.subjectId
      && candidate.ruleId === payload.scope.ruleId
      && candidate.result === 'applicable',
  );
  const receipts = new Set(state.proofWitness.evidenceReceipts
    .filter((entry) => entry.observationId === payload.scope.observationId)
    .map((entry) => entry.receiptRef));
  const sourcePass = state.reviewLoop.passes.find(
    (pass) => pass.producerEventId === payload.data.sourcePassEventId
      && pass.iterationId === payload.scope.iterationId,
  );
  if (observation === undefined
    || decision === undefined
    || sourcePass === undefined
    || payload.data.evidenceReceiptRefs.some((ref) => !receipts.has(ref))) {
    throw new DeepAlignmentReducerError(
      'referential-integrity',
      'Finding candidates require owned observation, applicability, receipts, and pass',
      'conformance.candidates',
    );
  }
  const candidate: DeepAlignmentFindingCandidate = {
    candidateId: payload.scope.candidateId,
    laneId: payload.scope.laneId,
    subjectId: payload.scope.subjectId,
    ruleId: payload.scope.ruleId,
    observationId: payload.scope.observationId,
    ...payload.data,
    evidenceReceiptRefs: sortStrings(payload.data.evidenceReceiptRefs),
    producerEventId: event.event_id,
  };
  const candidates = upsertStable(
    state.conformance.candidates,
    candidate,
    (value) => value.candidateId,
    'conformance.candidates.candidateId',
  );
  return {
    ...state.conformance,
    candidates: sortByProducer(candidates, state.seenEvents),
  };
}

function foldVerification(
  state: DeepAlignmentProjectionState,
  event: DeepAlignmentEventEnvelope<'deep_alignment.finding_verification_recorded'>,
): DeepAlignmentProjectionState['conformance'] {
  const payload = event.payload;
  const candidate = state.conformance.candidates.find(
    (entry) => entry.producerEventId === payload.data.candidateEventId
      && entry.candidateId === payload.scope.candidateId
      && entry.observationId === payload.scope.observationId
      && entry.laneId === payload.scope.laneId
      && entry.subjectId === payload.scope.subjectId
      && entry.ruleId === payload.scope.ruleId,
  );
  const observation = findOwnedObservation(
    state,
    payload.data.observationEventId,
    payload.scope,
  );
  const decision = state.applicability.decisions.find(
    (entry) => entry.decisionId === payload.data.applicabilityDecisionId
      && entry.laneId === payload.scope.laneId
      && entry.subjectId === payload.scope.subjectId
      && entry.ruleId === payload.scope.ruleId
      && entry.result === 'applicable',
  );
  assertValidAuthority(state, payload.data.authorityValidationEventId);
  const receipts = new Set(state.proofWitness.evidenceReceipts
    .filter((entry) => entry.observationId === payload.scope.observationId)
    .map((entry) => entry.receiptRef));
  if (candidate === undefined
    || observation === undefined
    || decision === undefined
    || payload.data.evidenceReceiptRefs.some((ref) => !receipts.has(ref))) {
    throw new DeepAlignmentReducerError(
      'referential-integrity',
      'Verification cannot borrow candidate, observation, applicability, or receipts',
      'conformance.verifications',
    );
  }
  const verification: DeepAlignmentFindingVerification = {
    verificationId: payload.scope.verificationId,
    findingId: payload.scope.findingId,
    candidateId: payload.scope.candidateId,
    observationId: payload.scope.observationId,
    ...payload.data,
    evidenceReceiptRefs: sortStrings(payload.data.evidenceReceiptRefs),
    proofWitnessRefs: sortStrings(payload.data.proofWitnessRefs),
    counterevidenceRefs: sortStrings(payload.data.counterevidenceRefs),
    producerEventId: event.event_id,
  };
  const verifications = upsertStable(
    state.conformance.verifications,
    verification,
    (value) => value.verificationId,
    'conformance.verifications.verificationId',
  );
  return {
    ...state.conformance,
    verifications: sortByProducer(verifications, state.seenEvents),
  };
}

function ownedReceiptRefs(
  state: DeepAlignmentProjectionState,
  observationId: string,
): Set<string> {
  return new Set(state.proofWitness.evidenceReceipts
    .filter((receipt) => receipt.observationId === observationId)
    .map((receipt) => receipt.receiptRef));
}

function ownedProofIds(
  state: DeepAlignmentProjectionState,
  verification: DeepAlignmentFindingVerification,
): Set<string> {
  return new Set(state.proofWitness.witnesses
    .filter((witness) => witness.verificationId === verification.verificationId
      && witness.candidateId === verification.candidateId
      && witness.findingId === verification.findingId)
    .map((witness) => witness.proofId));
}

function foldAdjudication(
  state: DeepAlignmentProjectionState,
  event: DeepAlignmentEventEnvelope<'deep_alignment.claim_adjudication_recorded'>,
): DeepAlignmentProjectionState['conformance'] {
  const payload = event.payload;
  const candidate = state.conformance.candidates.find(
    (entry) => entry.producerEventId === payload.data.candidateEventId
      && entry.candidateId === payload.scope.candidateId
      && entry.observationId === payload.scope.observationId,
  );
  const verification = state.conformance.verifications.find(
    (entry) => entry.producerEventId === payload.data.verificationEventId
      && entry.verificationId === payload.scope.verificationId
      && entry.findingId === payload.scope.findingId
      && entry.candidateId === payload.scope.candidateId,
  );
  const observation = findOwnedObservation(
    state,
    payload.data.observationEventId,
    payload.scope,
  );
  const decision = state.applicability.decisions.find(
    (entry) => entry.decisionId === payload.data.applicabilityDecisionId
      && entry.laneId === payload.scope.laneId
      && entry.subjectId === payload.scope.subjectId
      && entry.ruleId === payload.scope.ruleId
      && entry.result === 'applicable',
  );
  assertValidAuthority(state, payload.data.authorityValidationEventId);
  const requiresConfirmedVerification = payload.data.outcome === 'accepted'
    && payload.data.transition === 'candidate-to-finding';
  if (candidate === undefined
    || verification === undefined
    || observation === undefined
    || decision === undefined
    || (requiresConfirmedVerification && verification.result !== 'confirmed')) {
    throw new DeepAlignmentReducerError(
      'referential-integrity',
      'Verdict-bearing adjudication requires its own confirmed typed verification chain',
      'conformance.adjudications',
    );
  }
  const receiptRefs = ownedReceiptRefs(state, candidate.observationId);
  const proofIds = ownedProofIds(state, verification);
  if (payload.data.evidenceReceiptRefs.some((ref) => !receiptRefs.has(ref))
    || payload.data.proofWitnessRefs.some((ref) => !proofIds.has(ref))) {
    throw new DeepAlignmentReducerError(
      'referential-integrity',
      'Adjudication evidence and proof must be owned by its verified observation',
      'conformance.adjudications',
    );
  }
  const existingFinding = state.conformance.findings.find(
    (entry) => entry.candidateId === payload.scope.candidateId,
  );
  const findingOwner = state.conformance.findings.find(
    (entry) => entry.findingId === payload.scope.findingId,
  );
  if (findingOwner !== undefined
    && findingOwner.candidateId !== payload.scope.candidateId) {
    throw new DeepAlignmentReducerError(
      'identity-conflict',
      'A finding identity cannot cross candidate owners',
      'conformance.findings.findingId',
    );
  }
  if (existingFinding !== undefined
    && existingFinding.findingId !== payload.scope.findingId) {
    throw new DeepAlignmentReducerError(
      'identity-conflict',
      'Re-adjudication cannot rename the candidate finding identity',
      'conformance.findings.findingId',
    );
  }
  if ((existingFinding?.adjudicationEventId ?? null)
    !== payload.data.predecessorAdjudicationEventId) {
    throw new DeepAlignmentReducerError(
      'referential-integrity',
      'Re-adjudication must cite the current adjudication of the same finding',
      'conformance.adjudications.predecessorAdjudicationEventId',
    );
  }
  const severity = derivedSeverity(
    candidate.findingClass,
    payload.data.outcome,
    payload.data.impact,
    payload.data.confidence,
  );
  const adjudication: DeepAlignmentAdjudication = {
    findingId: payload.scope.findingId,
    candidateId: payload.scope.candidateId,
    verificationId: payload.scope.verificationId,
    observationId: payload.scope.observationId,
    candidateEventId: payload.data.candidateEventId,
    verificationEventId: payload.data.verificationEventId,
    observationEventId: payload.data.observationEventId,
    claimDigest: payload.data.claimDigest,
    evidenceReceiptRefs: sortStrings(payload.data.evidenceReceiptRefs),
    proofWitnessRefs: sortStrings(payload.data.proofWitnessRefs),
    counterevidenceRefs: sortStrings(payload.data.counterevidenceRefs),
    verifierFingerprint: payload.data.verifierFingerprint,
    assessorFingerprint: payload.data.assessorFingerprint,
    authorityValidationEventId: payload.data.authorityValidationEventId,
    applicabilityDecisionId: payload.data.applicabilityDecisionId,
    subjectSnapshotDigest: payload.data.subjectSnapshotDigest,
    impact: payload.data.impact,
    confidence: payload.data.confidence,
    outcome: payload.data.outcome,
    transition: payload.data.transition,
    adjudicationDigest: payload.data.adjudicationDigest,
    predecessorAdjudicationEventId: payload.data.predecessorAdjudicationEventId,
    derivedSeverity: severity,
    hardVeto: isHardVetoClass(candidate.findingClass),
    producerEventId: event.event_id,
  };
  const adjudications = upsertStable(
    state.conformance.adjudications,
    adjudication,
    (value) => value.producerEventId,
    'conformance.adjudications',
  );
  const lifecycle: DeepAlignmentFinding['lifecycle'] =
    payload.data.outcome === 'accepted'
      ? 'accepted'
      : payload.data.outcome === 'deferred' || payload.data.outcome === 'blocked'
        ? 'adjudicated'
        : 'dismissed';
  const finding: DeepAlignmentFinding = {
    findingId: payload.scope.findingId,
    candidateId: payload.scope.candidateId,
    laneId: payload.scope.laneId,
    subjectId: payload.scope.subjectId,
    ruleId: payload.scope.ruleId,
    observationId: payload.scope.observationId,
    findingClass: candidate.findingClass,
    lifecycle,
    adjudicationOutcome: payload.data.outcome,
    impact: payload.data.impact,
    confidence: payload.data.confidence,
    derivedSeverity: severity,
    hardVeto: adjudication.hardVeto,
    candidateEventId: candidate.producerEventId,
    verificationEventId: verification.producerEventId,
    adjudicationEventId: event.event_id,
    predecessorEventId: payload.data.predecessorAdjudicationEventId,
  };
  const findings = existingFinding === undefined
    ? [...state.conformance.findings, finding]
    : state.conformance.findings.map((entry) => (
      entry.candidateId === finding.candidateId ? finding : entry
    ));
  return {
    ...state.conformance,
    adjudications: sortByProducer(adjudications, state.seenEvents),
    findings: findings.sort((left, right) => compareString(
      left.findingId,
      right.findingId,
    )),
  };
}

function foldAssessment(
  state: DeepAlignmentProjectionState,
  event: DeepAlignmentEventEnvelope<'deep_alignment.conformance_assessment_recorded'>,
): DeepAlignmentProjectionState['conformance'] {
  const payload = event.payload;
  const adjudication = state.conformance.adjudications.find(
    (entry) => entry.producerEventId === payload.data.adjudicationEventId
      && entry.findingId === payload.scope.findingId
      && entry.candidateId === payload.scope.candidateId,
  );
  const verification = state.conformance.verifications.find(
    (entry) => entry.producerEventId === payload.data.verificationEventId
      && entry.verificationId === payload.scope.verificationId
      && entry.findingId === payload.scope.findingId,
  );
  const decision = state.applicability.decisions.find(
    (entry) => entry.decisionId === payload.data.applicabilityDecisionId
      && entry.laneId === payload.scope.laneId
      && entry.subjectId === payload.scope.subjectId
      && entry.ruleId === payload.scope.ruleId,
  );
  const validation = assertValidAuthority(
    state,
    payload.data.authorityValidationEventId,
  );
  const proofIds = verification === undefined
    ? new Set<string>()
    : ownedProofIds(state, verification);
  const receiptRefs = ownedReceiptRefs(state, payload.scope.observationId);
  if (adjudication === undefined
    || verification === undefined
    || decision === undefined
    || validation.validationDigest !== payload.data.authorityValidationDigest
    || adjudication.adjudicationDigest !== payload.data.adjudicationPayloadDigest
    || decision.result !== payload.data.applicabilityOutcome
    || payload.data.proofWitnessRefs.some((ref) => !proofIds.has(ref))
    || payload.data.evidenceReceiptRefs.some((ref) => !receiptRefs.has(ref))) {
    throw new DeepAlignmentReducerError(
      'referential-integrity',
      'Conformance assessment must retain its owned authority and adjudication chain',
      'conformance.assessments',
    );
  }
  const assessment: DeepAlignmentConformanceAssessment = {
    findingId: payload.scope.findingId,
    laneId: payload.scope.laneId,
    subjectId: payload.scope.subjectId,
    ruleId: payload.scope.ruleId,
    adjudicationEventId: payload.data.adjudicationEventId,
    verificationEventId: payload.data.verificationEventId,
    authorityValidationEventId: payload.data.authorityValidationEventId,
    applicabilityDecisionId: payload.data.applicabilityDecisionId,
    conformanceStatus: payload.data.conformanceStatus,
    rawImpact: payload.data.impact,
    rawConfidence: payload.data.confidence,
    verifierFingerprint: payload.data.verifierFingerprint,
    proofWitnessRefs: sortStrings(payload.data.proofWitnessRefs),
    evidenceReceiptRefs: sortStrings(payload.data.evidenceReceiptRefs),
    assessmentPolicyVersion: payload.data.assessmentPolicyVersion,
    assessmentDigest: payload.data.assessmentDigest,
    producerEventId: event.event_id,
  };
  const assessments = upsertStable(
    state.conformance.assessments,
    assessment,
    (value) => value.findingId,
    'conformance.assessments.findingId',
  );
  return {
    ...state.conformance,
    assessments: sortByProducer(assessments, state.seenEvents),
  };
}

function foldDeviation(
  state: DeepAlignmentProjectionState,
  event: DeepAlignmentEventEnvelope<
    'deep_alignment.known_deviation_recorded'
    | 'deep_alignment.known_deviation_invalidated'
  >,
): DeepAlignmentProjectionState['conformance'] {
  if (event.payload.stem === 'deep_alignment.known_deviation_recorded') {
    const payload = (
      event as DeepAlignmentEventEnvelope<'deep_alignment.known_deviation_recorded'>
    ).payload;
    const finding = state.conformance.findings.find(
      (entry) => entry.findingId === payload.scope.findingId
        && entry.adjudicationEventId === payload.data.originalFindingEventId,
    );
    const assessment = state.conformance.assessments.find(
      (entry) => entry.producerEventId
        === payload.data.conformanceAssessmentEventId
        && entry.findingId === payload.scope.findingId,
    );
    if (finding === undefined
      || assessment === undefined
      || payload.data.authorityEpochRef !== payload.scope.authorityEpochId
      || assessment.verifierFingerprint !== payload.data.verifierFingerprint) {
      throw new DeepAlignmentReducerError(
        'referential-integrity',
        'Known deviations must be scoped to their own finding, epoch, and verifier',
        'conformance.deviations',
      );
    }
    const deviation: DeepAlignmentKnownDeviation = {
      deviationId: payload.scope.deviationId,
      findingId: payload.scope.findingId,
      originalFindingEventId: payload.data.originalFindingEventId,
      conformanceAssessmentEventId: payload.data.conformanceAssessmentEventId,
      authorityEpochRef: payload.data.authorityEpochRef,
      verifierFingerprint: payload.data.verifierFingerprint,
      issuerId: payload.data.issuerId,
      rationale: payload.data.rationale,
      scopePredicateRef: payload.data.scopePredicateRef,
      scopePredicateDigest: payload.data.scopePredicateDigest,
      subjectSnapshotDigest: payload.data.subjectSnapshotDigest,
      expiresAt: payload.data.expiresAt,
      invalidationConditionRefs: sortStrings(payload.data.invalidationConditionRefs),
      status: 'active',
      invalidationEventId: null,
      producerEventId: event.event_id,
    };
    return {
      ...state.conformance,
      deviations: upsertStable(
        state.conformance.deviations,
        deviation,
        (value) => value.deviationId,
        'conformance.deviations.deviationId',
      ),
    };
  }
  const payload = (
    event as DeepAlignmentEventEnvelope<'deep_alignment.known_deviation_invalidated'>
  ).payload;
  const index = state.conformance.deviations.findIndex(
    (entry) => entry.deviationId === payload.scope.deviationId
      && entry.findingId === payload.scope.findingId
      && entry.producerEventId === payload.data.deviationEventId,
  );
  if (index === -1) {
    throw new DeepAlignmentReducerError(
      'referential-integrity',
      'Deviation invalidation must cite its own active deviation',
      'conformance.deviations',
    );
  }
  const prior = state.conformance.deviations[index];
  if (prior.status !== 'active'
    || prior.originalFindingEventId !== payload.data.originalFindingEventId
    || prior.authorityEpochRef !== payload.data.authorityEpochRef
    || prior.verifierFingerprint !== payload.data.verifierFingerprint
    || prior.subjectSnapshotDigest !== payload.data.subjectSnapshotDigest) {
    throw new DeepAlignmentReducerError(
      'impossible-transition',
      'Deviation invalidation cannot change owner or invalidate twice',
      'conformance.deviations.status',
    );
  }
  const deviations = [...state.conformance.deviations];
  deviations[index] = {
    ...prior,
    status: 'invalidated',
    invalidationEventId: event.event_id,
  };
  return { ...state.conformance, deviations };
}

function ownedFindingEventIds(
  state: DeepAlignmentProjectionState,
  finding: DeepAlignmentFinding,
): Set<string> {
  return new Set([
    finding.candidateEventId,
    ...(finding.verificationEventId === null ? [] : [finding.verificationEventId]),
    ...(finding.adjudicationEventId === null ? [] : [finding.adjudicationEventId]),
    ...(finding.predecessorEventId === null ? [] : [finding.predecessorEventId]),
  ]);
}

function foldFindingState(
  state: DeepAlignmentProjectionState,
  event: DeepAlignmentEventEnvelope<'deep_alignment.finding_state_changed'>,
): DeepAlignmentProjectionState['conformance'] {
  const payload = event.payload;
  const index = state.conformance.findings.findIndex(
    (entry) => entry.findingId === payload.scope.findingId,
  );
  if (index === -1) {
    throw new DeepAlignmentReducerError(
      'referential-integrity',
      'Finding state changes require a captured finding',
      'conformance.findings.findingId',
    );
  }
  const prior = state.conformance.findings[index];
  if (prior.adjudicationEventId !== payload.data.adjudicationEventId
    || !ownedFindingEventIds(state, prior).has(payload.data.predecessorEventRef)) {
    throw new DeepAlignmentReducerError(
      'referential-integrity',
      'Finding transitions require their own adjudication and predecessor',
      'conformance.findings.predecessorEventId',
    );
  }
  if (prior.lifecycle !== payload.data.priorState) {
    throw new DeepAlignmentReducerError(
      'impossible-transition',
      'Finding transition prior state must equal the projected lifecycle',
      'conformance.findings.lifecycle',
    );
  }
  const findings = [...state.conformance.findings];
  findings[index] = {
    ...prior,
    lifecycle: payload.data.currentState,
    predecessorEventId: payload.data.predecessorEventRef,
    derivedSeverity: payload.data.currentState === 'fixed'
      || payload.data.currentState === 'dismissed'
      ? 'none'
      : prior.derivedSeverity,
  };
  return { ...state.conformance, findings };
}

function assertFindingLineage(
  state: DeepAlignmentProjectionState,
  event: DeepAlignmentEventEnvelope<'deep_alignment.finding_lineage_recorded'>,
): void {
  const payload = event.payload;
  const finding = state.conformance.findings.find(
    (entry) => entry.findingId === payload.scope.findingId,
  );
  if (finding === undefined
    || !ownedFindingEventIds(state, finding).has(payload.data.predecessorEventRef)) {
    throw new DeepAlignmentReducerError(
      'referential-integrity',
      'Finding lineage cannot borrow another finding predecessor',
      'conformance.findings.predecessorEventId',
    );
  }
}

function verdictRank(verdict: DeepAlignmentLaneVerdict['verdict']): number {
  return {
    PASS: 0,
    NOT_APPLICABLE: 1,
    SKIP: 2,
    EXEMPT: 2,
    WARN: 3,
    INCONCLUSIVE: 4,
    FAIL: 5,
  }[verdict];
}

function refreshConformance(
  state: DeepAlignmentProjectionState,
  conformance: DeepAlignmentProjectionState['conformance'],
): DeepAlignmentProjectionState['conformance'] {
  const activeFindings = conformance.findings.filter(
    (finding) => finding.lifecycle === 'accepted'
      || finding.lifecycle === 'adjudicated',
  );
  const hardVetoes = conformance.findings.filter(
    (finding) => finding.hardVeto
      && finding.lifecycle !== 'dismissed'
      && finding.lifecycle !== 'fixed',
  );
  const laneVerdicts = state.lanePlan.plans.map((plan): DeepAlignmentLaneVerdict => {
    const coverage = state.applicability.coverage.find(
      (entry) => entry.laneId === plan.laneId,
    );
    const laneFindings = conformance.findings.filter(
      (finding) => finding.laneId === plan.laneId
        && finding.lifecycle !== 'dismissed'
        && finding.lifecycle !== 'fixed',
    );
    const activeDeviations = conformance.deviations.filter(
      (deviation) => deviation.status === 'active'
        && laneFindings.some((finding) => finding.findingId === deviation.findingId),
    );
    const unsuppressed = laneFindings.filter(
      (finding) => !activeDeviations.some(
        (deviation) => deviation.findingId === finding.findingId,
      ),
    );
    const blockers = sortStrings([
      ...(coverage === undefined ? ['coverage-missing'] : []),
      ...(coverage?.unresolvedRuleIds ?? []).map((id) => `unresolved:${id}`),
      ...(coverage?.untestedRuleIds ?? []).map((id) => `untested:${id}`),
      ...(coverage?.blockedRuleIds ?? []).map((id) => `blocked:${id}`),
      ...unsuppressed.filter((finding) => (
        finding.derivedSeverity === 'P0' || finding.derivedSeverity === 'P1'
      )).map((finding) => `finding:${finding.findingId}`),
    ]);
    let verdict: DeepAlignmentLaneVerdict['verdict'] = 'PASS';
    if (blockers.some((blocker) => blocker.startsWith('finding:'))) verdict = 'FAIL';
    else if (blockers.length > 0) verdict = 'INCONCLUSIVE';
    else if (activeDeviations.length > 0) verdict = 'EXEMPT';
    else if (coverage !== undefined
      && coverage.notApplicableRuleIds.length === plan.orderedRuleIds.length) {
      verdict = 'NOT_APPLICABLE';
    } else if (unsuppressed.some((finding) => finding.derivedSeverity === 'P2')) {
      verdict = 'WARN';
    }
    return {
      laneId: plan.laneId,
      verdict,
      blockerIds: blockers,
      findingIds: sortStrings(laneFindings.map((finding) => finding.findingId)),
    };
  }).sort((left, right) => compareString(left.laneId, right.laneId));
  const overallVerdict = laneVerdicts.length === 0
    ? 'INCONCLUSIVE' as const
    : [...laneVerdicts].sort(
      (left, right) => verdictRank(right.verdict) - verdictRank(left.verdict),
    )[0].verdict;
  return {
    ...conformance,
    laneVerdicts,
    overallVerdict,
    activeFindingIds: sortStrings(activeFindings.map((finding) => finding.findingId)),
    hardVetoFindingIds: sortStrings(hardVetoes.map((finding) => finding.findingId)),
  };
}

// ───────────────────────────────────────────────────────────────────
// 7. SHARED REVIEW-LOOP AND TERMINAL DERIVATION
// ───────────────────────────────────────────────────────────────────

function upsertObligations(
  existing: DeepAlignmentProjectionState['reviewLoop']['obligations'],
  incoming: DeepAlignmentProjectionState['reviewLoop']['obligations'],
): DeepAlignmentProjectionState['reviewLoop']['obligations'] {
  const byId = new Map(existing.map((entry) => [entry.obligationId, entry]));
  for (const obligation of incoming) byId.set(obligation.obligationId, obligation);
  return [...byId.values()].sort(
    (left, right) => compareString(left.obligationId, right.obligationId),
  );
}

function upsertPass(
  state: DeepAlignmentProjectionState,
  event: DeepAlignmentEventEnvelope<
    'deep_alignment.dimension_pass_started'
    | 'deep_alignment.dimension_pass_completed'
  >,
): DeepAlignmentProjectionState['reviewLoop'] {
  const payload = event.payload;
  const pass: DeepAlignmentPassOutcome = {
    iterationId: payload.scope.iterationId,
    dimensionId: payload.scope.dimensionId,
    passNumber: payload.data.passNumber,
    targetRefs: sortStrings(payload.data.targetRefs),
    filesReviewed: sortStrings(payload.data.filesReviewed),
    searchCoverageDigest: payload.data.searchCoverageDigest,
    status: payload.data.passStatus,
    nextFocusRef: payload.data.nextFocusRef,
    producerEventId: event.event_id,
  };
  const passes = sortByProducer([...state.reviewLoop.passes, pass], state.seenEvents);
  const cell = {
    iterationId: payload.scope.iterationId,
    dimensionId: payload.scope.dimensionId,
    required: state.reviewLoop.scope.orderedDimensionIds.includes(
      payload.scope.dimensionId,
    ),
    status: payload.data.passStatus,
    passNumber: payload.data.passNumber,
    searchCoverageDigest: payload.data.searchCoverageDigest,
    producerEventId: event.event_id,
  };
  const coverageCells = state.reviewLoop.coverageCells.filter((entry) => !(
    entry.iterationId === cell.iterationId
    && entry.dimensionId === cell.dimensionId
  ));
  coverageCells.push(cell);
  coverageCells.sort((left, right) => (
    compareString(left.iterationId, right.iterationId)
    || compareString(left.dimensionId, right.dimensionId)
  ));
  return {
    ...state.reviewLoop,
    passes,
    coverageCells,
    currentIterationId: payload.scope.iterationId,
  };
}

function convergenceEvaluation(
  event: DeepAlignmentEventEnvelope<
    'deep_alignment.convergence_evaluated'
    | 'deep_alignment.graph_convergence_evaluated'
  >,
): DeepAlignmentConvergenceEvaluation {
  const payload = event.payload;
  const graph = event.payload.stem === 'deep_alignment.graph_convergence_evaluated'
    ? event as DeepAlignmentEventEnvelope<
      'deep_alignment.graph_convergence_evaluated'
    >
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
    graphDecision: graph?.payload.data.graphDecision ?? null,
    graphDigest: graph?.payload.data.graphDigest ?? null,
    producerEventId: event.event_id,
    streamId: event.stream_id,
  };
}

function alignmentSpecificBlockers(state: DeepAlignmentProjectionState): string[] {
  return sortStrings([
    ...(state.authorityAlignment.status === 'valid' ? [] : ['authority-validity']),
    ...(state.lanePlan.plans.length > 0 ? [] : ['lane-plan-missing']),
    ...state.lanePlan.lanes.filter((lane) => lane.status !== 'complete').map(
      (lane) => `lane:${lane.laneId}:${lane.status}`,
    ),
    ...state.applicability.coverage.flatMap((coverage) => [
      ...coverage.unresolvedRuleIds.map((ruleId) => (
        `applicability:${coverage.laneId}:${ruleId}:unresolved`
      )),
      ...coverage.untestedRuleIds.map((ruleId) => (
        `applicability:${coverage.laneId}:${ruleId}:untested`
      )),
      ...coverage.blockedRuleIds.map((ruleId) => (
        `applicability:${coverage.laneId}:${ruleId}:blocked`
      )),
    ]),
    ...state.lanePlan.plans.filter((plan) => !state.applicability.coverage.some(
      (coverage) => coverage.laneId === plan.laneId,
    )).map((plan) => `applicability:${plan.laneId}:missing`),
    ...state.conformance.findings.filter((finding) => (
      finding.lifecycle === 'accepted'
      && (finding.derivedSeverity === 'P0' || finding.derivedSeverity === 'P1')
      && !state.conformance.deviations.some(
        (deviation) => deviation.findingId === finding.findingId
          && deviation.status === 'active',
      )
    )).map((finding) => `finding:${finding.findingId}`),
    ...state.conformance.candidates.filter((candidate) => !state.conformance.verifications.some(
      (verification) => verification.candidateId === candidate.candidateId,
    )).map((candidate) => `verification:${candidate.candidateId}:missing`),
    ...state.conformance.verifications.filter((verification) => (
      verification.result === 'confirmed'
      && !state.conformance.adjudications.some(
        (adjudication) => adjudication.verificationId === verification.verificationId,
      )
    )).map((verification) => `adjudication:${verification.candidateId}:missing`),
    ...state.conformance.adjudications.filter((adjudication) => (
      adjudication.outcome === 'accepted'
      && !state.conformance.assessments.some(
        (assessment) => assessment.findingId === adjudication.findingId,
      )
    )).map((adjudication) => `assessment:${adjudication.findingId}:missing`),
    ...state.conformance.hardVetoFindingIds.map((id) => `hard-veto:${id}`),
  ]);
}

function deriveBackbone(
  state: DeepAlignmentProjectionState,
  evaluation: DeepAlignmentConvergenceEvaluation,
): ReturnType<typeof reduceSharedReviewLoopBackbone> {
  const completedDimensionIds = state.reviewLoop.scope.orderedDimensionIds.filter(
    (dimensionId) => state.reviewLoop.coverageCells.some((cell) => (
      cell.iterationId === evaluation.iterationId
      && cell.dimensionId === dimensionId
      && cell.status === 'complete'
    )),
  );
  const unresolvedObligationIds = state.reviewLoop.obligations.filter(
    (obligation) => obligation.required && obligation.status !== 'resolved',
  ).map((obligation) => obligation.obligationId);
  const specificBlockers = alignmentSpecificBlockers(state);
  const input: SharedReviewLoopBackboneInput = {
    requiredDimensionIds: state.reviewLoop.scope.orderedDimensionIds,
    completedDimensionIds,
    unresolvedObligationIds,
    explicitBlockerIds: sortStrings([
      ...evaluation.blockerIds,
      ...specificBlockers,
    ]),
    blockingFindingIds: state.conformance.findings.filter((finding) => (
      finding.lifecycle === 'accepted'
      && (finding.derivedSeverity === 'P0' || finding.derivedSeverity === 'P1')
    )).map((finding) => finding.findingId),
    hardVetoFindingIds: state.conformance.hardVetoFindingIds,
    p0p1ResolutionState: evaluation.p0p1ResolutionState,
    findingStability: evaluation.findingStability,
    decision: evaluation.decision,
    stopCandidate: evaluation.stopCandidate,
    graphDecision: evaluation.graphDecision,
  };
  return reduceSharedReviewLoopBackbone(input);
}

function foldSharedReviewLoop(
  state: DeepAlignmentProjectionState,
  event: DeepAlignmentLedgerEvent,
): DeepAlignmentProjectionState['reviewLoop'] {
  const reviewLoop = state.reviewLoop;
  switch (event.payload.stem) {
    case 'deep_alignment.scope_resolved': {
      const payload = payloadFor(event, 'deep_alignment.scope_resolved');
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
    case 'deep_alignment.dimension_ordered': {
      const payload = payloadFor(event, 'deep_alignment.dimension_ordered');
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
    case 'deep_alignment.protocol_plan_recorded': {
      const payload = payloadFor(event, 'deep_alignment.protocol_plan_recorded');
      if (payload.data.gateClass === 'informational'
        || payload.data.applicability === 'not-applicable') return reviewLoop;
      return {
        ...reviewLoop,
        obligations: upsertObligations(reviewLoop.obligations, [{
          obligationId: `protocol:${payload.scope.protocolId}`,
          ownerLaneId: null,
          kind: 'protocol',
          required: true,
          status: 'unresolved',
          producerEventId: event.event_id,
        }]),
      };
    }
    case 'deep_alignment.lane_plan_recorded': {
      const payload = payloadFor(event, 'deep_alignment.lane_plan_recorded');
      return {
        ...reviewLoop,
        obligations: upsertObligations(reviewLoop.obligations, [{
          obligationId: `lane:${payload.scope.laneId}`,
          ownerLaneId: payload.scope.laneId,
          kind: 'coverage',
          required: true,
          status: 'unresolved',
          producerEventId: event.event_id,
        }]),
      };
    }
    case 'deep_alignment.applicability_evaluated': {
      const payload = payloadFor(event, 'deep_alignment.applicability_evaluated');
      const status = payload.data.result === 'applicable'
        || payload.data.result === 'not_applicable'
        ? 'resolved' as const
        : payload.data.result === 'blocked'
          ? 'blocked' as const
          : 'unresolved' as const;
      return {
        ...reviewLoop,
        obligations: upsertObligations(reviewLoop.obligations, [{
          obligationId: `applicability:${payload.scope.laneId}:${payload.scope.ruleId}`,
          ownerLaneId: payload.scope.laneId,
          kind: 'applicability',
          required: true,
          status,
          producerEventId: event.event_id,
        }]),
      };
    }
    case 'deep_alignment.dimension_pass_started':
    case 'deep_alignment.dimension_pass_completed':
      return upsertPass(
        state,
        event as DeepAlignmentEventEnvelope<
          'deep_alignment.dimension_pass_started'
          | 'deep_alignment.dimension_pass_completed'
        >,
      );
    case 'deep_alignment.applicability_coverage_recorded': {
      const payload = payloadFor(event, 'deep_alignment.applicability_coverage_recorded');
      return {
        ...reviewLoop,
        obligations: upsertObligations(
          reviewLoop.obligations,
          reviewLoop.obligations.map((obligation) => (
            obligation.ownerLaneId === payload.scope.laneId
              && obligation.kind === 'applicability'
              ? {
                ...obligation,
                status: payload.data.blockedRuleIds.some(
                  (id) => obligation.obligationId.endsWith(`:${id}`),
                )
                  ? 'blocked' as const
                  : payload.data.unresolvedRuleIds.some(
                    (id) => obligation.obligationId.endsWith(`:${id}`),
                  ) || payload.data.untestedRuleIds.some(
                    (id) => obligation.obligationId.endsWith(`:${id}`),
                  )
                    ? 'unresolved' as const
                    : 'resolved' as const,
                producerEventId: event.event_id,
              }
              : obligation
          )),
        ),
      };
    }
    case 'deep_alignment.lane_completed': {
      const payload = payloadFor(event, 'deep_alignment.lane_completed');
      return {
        ...reviewLoop,
        obligations: upsertObligations(
          reviewLoop.obligations,
          reviewLoop.obligations.map((obligation) => (
            obligation.obligationId === `lane:${payload.scope.laneId}`
              ? {
                ...obligation,
                status: payload.data.status === 'complete'
                  ? 'resolved' as const
                  : payload.data.status === 'blocked'
                    ? 'blocked' as const
                    : 'unresolved' as const,
                producerEventId: event.event_id,
              }
              : obligation
          )),
        ),
      };
    }
    case 'deep_alignment.blocked_stop_recorded': {
      const payload = payloadFor(event, 'deep_alignment.blocked_stop_recorded');
      return {
        ...reviewLoop,
        blockerIds: sortStrings([...reviewLoop.blockerIds, ...payload.data.blockedGateIds]),
        outcome: 'blocked',
      };
    }
    case 'deep_alignment.run_completed': {
      const payload = payloadFor(event, 'deep_alignment.run_completed');
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
    default:
      return reviewLoop;
  }
}

// ───────────────────────────────────────────────────────────────────
// 8. ARTIFACT AND STATUS DERIVATION
// ───────────────────────────────────────────────────────────────────

function artifactIdentity(kind: string, owner: JsonObject, digest: string): string {
  return `${kind}:${sha256Bytes(canonicalBytes(owner))}:${digest}`;
}

function logicalArtifactIdentity(kind: string, owner: JsonObject): string {
  return `${kind}:${sha256Bytes(canonicalBytes(owner))}`;
}

function runArtifactOwner(
  state: DeepAlignmentProjectionState,
  event: DeepAlignmentLedgerEvent,
  owner: JsonObject,
): JsonObject {
  return {
    runId: state.run.runId,
    sessionId: state.run.sessionId,
    streamId: establishedRunStreamId(state),
    ...owner,
  };
}

function artifactFromEvent(
  state: DeepAlignmentProjectionState,
  event: DeepAlignmentLedgerEvent,
): DeepAlignmentArtifactRecord | null {
  const base = {
    producerEventId: event.event_id,
    availability: 'available' as const,
    freshness: 'fresh' as const,
    authorityEpochId: event.payload.scope.authorityEpochId,
    verifierRevision: null,
    supersedesArtifactIds: [] as string[],
    supersededByArtifactIds: [] as string[],
  };
  switch (event.payload.stem) {
    case 'deep_alignment.authority_reference_bound': {
      const payload = payloadFor(event, 'deep_alignment.authority_reference_bound');
      const owner = { authorityEpochId: payload.scope.authorityEpochId };
      return {
        ...base,
        artifactId: artifactIdentity('authority', owner, payload.data.profileDigest),
        logicalArtifactId: logicalArtifactIdentity('authority', owner),
        artifactKind: 'authority-reference',
        ownerEntityId: payload.scope.authorityEpochId,
        reviewedInputIdentity: payload.data.authorityCapsuleRef,
        contentDigest: payload.data.profileDigest,
      };
    }
    case 'deep_alignment.subject_snapshot_bound': {
      const payload = payloadFor(event, 'deep_alignment.subject_snapshot_bound');
      const owner = {
        laneId: payload.scope.laneId,
        subjectId: payload.scope.subjectId,
      };
      return {
        ...base,
        artifactId: artifactIdentity('snapshot', owner, payload.data.subjectDigest),
        logicalArtifactId: logicalArtifactIdentity('snapshot', owner),
        artifactKind: 'subject-snapshot',
        ownerEntityId: payload.scope.subjectId,
        reviewedInputIdentity: payload.data.sourceVersionRef,
        contentDigest: payload.data.subjectDigest,
      };
    }
    case 'deep_alignment.observation_recorded': {
      const payload = payloadFor(event, 'deep_alignment.observation_recorded');
      const owner = {
        laneId: payload.scope.laneId,
        subjectId: payload.scope.subjectId,
        ruleId: payload.scope.ruleId,
        observationId: payload.scope.observationId,
      };
      return {
        ...base,
        artifactId: artifactIdentity('observation', owner, payload.data.contentDigest),
        logicalArtifactId: logicalArtifactIdentity('observation', owner),
        artifactKind: 'observation',
        ownerEntityId: payload.scope.observationId,
        reviewedInputIdentity: payload.data.subjectSnapshotRef,
        contentDigest: payload.data.contentDigest,
        freshness: payload.data.freshness,
      };
    }
    case 'deep_alignment.evidence_receipt_bound': {
      const payload = payloadFor(event, 'deep_alignment.evidence_receipt_bound');
      const owner = {
        observationId: payload.scope.observationId,
        evidenceId: payload.scope.evidenceId,
      };
      return {
        ...base,
        artifactId: artifactIdentity('receipt', owner, payload.data.receiptDigest),
        logicalArtifactId: logicalArtifactIdentity('receipt', owner),
        artifactKind: 'evidence-receipt',
        ownerEntityId: payload.scope.evidenceId,
        reviewedInputIdentity: payload.data.observationEventId,
        contentDigest: payload.data.receiptDigest,
        freshness: payload.data.freshness,
        verifierRevision: payload.data.toolFingerprint,
      };
    }
    case 'deep_alignment.finding_verification_recorded': {
      const payload = payloadFor(event, 'deep_alignment.finding_verification_recorded');
      const owner = {
        candidateId: payload.scope.candidateId,
        findingId: payload.scope.findingId,
        verificationId: payload.scope.verificationId,
      };
      return {
        ...base,
        artifactId: artifactIdentity('verification', owner, payload.data.verificationDigest),
        logicalArtifactId: logicalArtifactIdentity('verification', owner),
        artifactKind: 'verification',
        ownerEntityId: payload.scope.verificationId,
        reviewedInputIdentity: payload.data.candidateEventId,
        contentDigest: payload.data.verificationDigest,
        verifierRevision: payload.data.verifierFingerprint,
      };
    }
    case 'deep_alignment.proof_witness_recorded': {
      const payload = payloadFor(event, 'deep_alignment.proof_witness_recorded');
      const owner = {
        verificationId: payload.scope.verificationId,
        proofId: payload.scope.proofId,
      };
      return {
        ...base,
        artifactId: artifactIdentity('proof', owner, payload.data.witnessDigest),
        logicalArtifactId: logicalArtifactIdentity('proof', owner),
        artifactKind: 'proof-witness',
        ownerEntityId: payload.scope.proofId,
        reviewedInputIdentity: payload.data.verificationEventId,
        contentDigest: payload.data.witnessDigest,
        verifierRevision: payload.data.minimizerFingerprint,
      };
    }
    case 'deep_alignment.claim_adjudication_recorded': {
      const payload = payloadFor(event, 'deep_alignment.claim_adjudication_recorded');
      const owner = {
        candidateId: payload.scope.candidateId,
        findingId: payload.scope.findingId,
      };
      return {
        ...base,
        artifactId: artifactIdentity(
          'adjudication',
          { ...owner, eventId: event.event_id },
          payload.data.adjudicationDigest,
        ),
        logicalArtifactId: logicalArtifactIdentity('adjudication', owner),
        artifactKind: 'adjudication',
        ownerEntityId: payload.scope.findingId,
        reviewedInputIdentity: payload.data.verificationEventId,
        contentDigest: payload.data.adjudicationDigest,
        verifierRevision: payload.data.assessorFingerprint,
      };
    }
    case 'deep_alignment.conformance_assessment_recorded': {
      const payload = payloadFor(event, 'deep_alignment.conformance_assessment_recorded');
      const owner = { findingId: payload.scope.findingId };
      return {
        ...base,
        artifactId: artifactIdentity('assessment', owner, payload.data.assessmentDigest),
        logicalArtifactId: logicalArtifactIdentity('assessment', owner),
        artifactKind: 'conformance-assessment',
        ownerEntityId: payload.scope.findingId,
        reviewedInputIdentity: payload.data.adjudicationEventId,
        contentDigest: payload.data.assessmentDigest,
        verifierRevision: payload.data.verifierFingerprint,
      };
    }
    case 'deep_alignment.known_deviation_recorded': {
      const payload = payloadFor(event, 'deep_alignment.known_deviation_recorded');
      const owner = {
        findingId: payload.scope.findingId,
        deviationId: payload.scope.deviationId,
      };
      return {
        ...base,
        artifactId: artifactIdentity(
          'deviation',
          owner,
          payload.data.scopePredicateDigest,
        ),
        logicalArtifactId: logicalArtifactIdentity('deviation', owner),
        artifactKind: 'known-deviation',
        ownerEntityId: payload.scope.deviationId,
        reviewedInputIdentity: payload.data.originalFindingEventId,
        contentDigest: payload.data.scopePredicateDigest,
        verifierRevision: payload.data.verifierFingerprint,
      };
    }
    case 'deep_alignment.review_report_committed': {
      if (event.stream_id !== establishedRunStreamId(state)) return null;
      const payload = payloadFor(event, 'deep_alignment.review_report_committed');
      const owner = runArtifactOwner(state, event, {});
      return {
        ...base,
        artifactId: artifactIdentity('report', {
          ...owner,
          revisionId: payload.scope.reportRevisionId,
        }, payload.data.reportDigest),
        logicalArtifactId: logicalArtifactIdentity('report', owner),
        artifactKind: 'review-report',
        ownerEntityId: String(state.run.runId),
        reviewedInputIdentity: payload.data.findingRegistryInputDigest,
        contentDigest: payload.data.reportDigest,
      };
    }
    case 'deep_alignment.continuity_save_requested':
    case 'deep_alignment.continuity_save_completed':
    case 'deep_alignment.continuity_save_failed': {
      if (event.stream_id !== establishedRunStreamId(state)) return null;
      const payload = event.payload.stem === 'deep_alignment.continuity_save_requested'
        ? payloadFor(event, 'deep_alignment.continuity_save_requested')
        : event.payload.stem === 'deep_alignment.continuity_save_completed'
          ? payloadFor(event, 'deep_alignment.continuity_save_completed')
          : payloadFor(event, 'deep_alignment.continuity_save_failed');
      const digest = event.payload.stem === 'deep_alignment.continuity_save_completed'
        ? event.payload.data.continuityFingerprint
        : payload.data.continuityPayloadDigest;
      const owner = runArtifactOwner(state, event, {
        targetPacket: payload.data.targetPacket,
      });
      return {
        ...base,
        artifactId: artifactIdentity(
          'continuity',
          { ...owner, eventId: event.event_id },
          digest,
        ),
        logicalArtifactId: logicalArtifactIdentity('continuity', owner),
        artifactKind: 'continuity-save',
        ownerEntityId: String(state.run.runId),
        reviewedInputIdentity: payload.data.continuityPayloadDigest,
        contentDigest: digest,
        availability: event.payload.stem === 'deep_alignment.continuity_save_requested'
          ? 'pending'
          : event.payload.stem === 'deep_alignment.continuity_save_completed'
            ? 'available'
            : 'unavailable',
      };
    }
    default:
      return null;
  }
}

function refreshArtifacts(
  artifacts: readonly DeepAlignmentArtifactRecord[],
  candidate: DeepAlignmentArtifactRecord | null,
  seenEvents: readonly DeepAlignmentSeenEvent[],
): DeepAlignmentArtifactRecord[] {
  const next = candidate === null ? [...artifacts] : [...artifacts, candidate];
  const byArtifactId = new Map<string, DeepAlignmentArtifactRecord>();
  for (const artifact of next) {
    const prior = byArtifactId.get(artifact.artifactId);
    if (prior !== undefined && !sameCanonical(prior, artifact)) {
      throw new DeepAlignmentReducerError(
        'identity-conflict',
        'Artifact identity cannot resolve to conflicting immutable content',
        'artifactIndex.artifacts.artifactId',
      );
    }
    byArtifactId.set(artifact.artifactId, artifact);
  }
  const groups = new Map<string, DeepAlignmentArtifactRecord[]>();
  for (const artifact of byArtifactId.values()) {
    const group = groups.get(artifact.logicalArtifactId) ?? [];
    group.push(artifact);
    groups.set(artifact.logicalArtifactId, group);
  }
  const linked: DeepAlignmentArtifactRecord[] = [];
  for (const group of groups.values()) {
    const ordered = sortByProducer(group, seenEvents);
    ordered.forEach((artifact, index) => linked.push({
      ...artifact,
      availability: index < ordered.length - 1
        ? 'superseded'
        : artifact.availability,
      supersedesArtifactIds: sortStrings(
        ordered.slice(0, index).map((entry) => entry.artifactId),
      ),
      supersededByArtifactIds: sortStrings(
        ordered.slice(index + 1).map((entry) => entry.artifactId),
      ),
    }));
  }
  return linked.sort((left, right) => (
    compareString(left.logicalArtifactId, right.logicalArtifactId)
    || compareProducerEvents(seenEvents, left.producerEventId, right.producerEventId)
  ));
}

const TERMINAL_STATES = Object.freeze([
  'complete',
  'incomplete',
  'failed',
] as const satisfies readonly DeepAlignmentModeStatus[]);

const STATUS_TRANSITIONS = Object.freeze({
  planned: Object.freeze(['planned', 'active', 'blocked', 'failed']),
  active: Object.freeze([
    'active', 'paused', 'converging', 'complete', 'incomplete', 'blocked', 'failed',
  ]),
  paused: Object.freeze(['paused', 'active', 'blocked', 'incomplete', 'failed']),
  converging: Object.freeze([
    'converging', 'complete', 'incomplete', 'blocked', 'failed',
  ]),
  blocked: Object.freeze(['blocked', 'active', 'incomplete', 'failed']),
  complete: Object.freeze(['complete']),
  incomplete: Object.freeze(['incomplete']),
  failed: Object.freeze(['failed']),
} as const satisfies Readonly<
  Record<DeepAlignmentModeStatus, readonly DeepAlignmentModeStatus[]>
>);

function transitionForEvent(
  event: DeepAlignmentLedgerEvent,
  reviewLoop: DeepAlignmentProjectionState['reviewLoop'],
): DeepAlignmentStatusTransition | null {
  const base = {
    producerEventId: event.event_id,
    producerStem: event.payload.stem,
    streamId: event.stream_id,
    logicalSequence: event.stream_sequence,
    blockingReason: null,
  };
  switch (event.payload.stem) {
    case 'deep_alignment.run_initialized':
      return { ...base, state: 'planned' };
    case 'deep_alignment.pause_recorded':
      return { ...base, state: 'paused' };
    case 'deep_alignment.synthesis_started':
      return { ...base, state: 'converging' };
    case 'deep_alignment.blocked_stop_recorded':
      return { ...base, state: 'blocked', blockingReason: 'blocked-stop' };
    case 'deep_alignment.continuity_save_failed':
      return { ...base, state: 'blocked', blockingReason: 'continuity-save-failed' };
    case 'deep_alignment.authority_validation_recorded': {
      const payload = payloadFor(event, 'deep_alignment.authority_validation_recorded');
      return payload.data.authorityStatus === 'valid'
        ? { ...base, state: 'active' }
        : { ...base, state: 'blocked', blockingReason: 'authority-invalid' };
    }
    case 'deep_alignment.convergence_evaluated':
    case 'deep_alignment.graph_convergence_evaluated':
      return reviewLoop.outcome === 'blocked'
        ? { ...base, state: 'blocked', blockingReason: 'convergence-blocked' }
        : { ...base, state: 'active' };
    case 'deep_alignment.run_completed': {
      const payload = payloadFor(event, 'deep_alignment.run_completed');
      if (payload.data.terminalStatus === 'completed') return { ...base, state: 'complete' };
      if (payload.data.terminalStatus === 'incomplete') return { ...base, state: 'incomplete' };
      return { ...base, state: 'failed', blockingReason: 'run-completed-blocked' };
    }
    case 'deep_alignment.review_report_committed':
    case 'deep_alignment.continuity_save_requested':
    case 'deep_alignment.continuity_save_completed':
      return null;
    default:
      return { ...base, state: 'active' };
  }
}

function deriveStatus(
  transitions: readonly DeepAlignmentStatusTransition[],
  state: DeepAlignmentProjectionState,
): DeepAlignmentStatusProjection {
  let current: DeepAlignmentModeStatus = 'planned';
  for (const transition of transitions) {
    if (!STATUS_TRANSITIONS[current].includes(transition.state as never)) {
      throw new DeepAlignmentReducerError(
        'impossible-status-transition',
        `Status cannot transition from ${current} to ${transition.state}`,
        'status.provenance',
      );
    }
    current = transition.state;
  }
  const blockingReason = [...transitions].reverse().find(
    (transition) => transition.blockingReason !== null,
  )?.blockingReason ?? null;
  const contractVersions = sortStrings([
    ...(state.run.convergencePolicyVersion === null
      ? []
      : [state.run.convergencePolicyVersion]),
    ...state.lanePlan.plans.map((plan) => plan.verifierPolicyVersion),
    ...state.conformance.assessments.map((assessment) => (
      assessment.assessmentPolicyVersion
    )),
  ]);
  return {
    state: current,
    terminal: TERMINAL_STATES.includes(current as never),
    health: current === 'blocked' || current === 'failed' ? 'blocked' : 'healthy',
    activeContractVersions: contractVersions,
    activeAuthorityEpochs: state.run.authorityEpochId === null
      ? []
      : [state.run.authorityEpochId],
    laneStatuses: state.lanePlan.lanes.map((lane) => ({
      laneId: lane.laneId,
      status: lane.status,
    })).sort((left, right) => compareString(left.laneId, right.laneId)),
    lastAppliedSequence: state.seenEvents.length,
    blockingReason,
    shadowParityState: 'not-run',
    provenance: [...transitions],
  };
}

// ───────────────────────────────────────────────────────────────────
// 9. EVENT APPLICATION AND TERMINAL INVARIANTS
// ───────────────────────────────────────────────────────────────────

function appendSeenEvent(
  state: DeepAlignmentProjectionState,
  event: DeepAlignmentLedgerEvent,
): DeepAlignmentSeenEvent[] | null {
  const digest = eventDigest(event);
  const existing = state.seenEvents.find((entry) => entry.eventId === event.event_id);
  if (existing !== undefined) {
    if (existing.eventDigest !== digest) {
      throw new DeepAlignmentReducerError(
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
    stem: event.payload.stem,
    streamId: event.stream_id,
    streamSequence: event.stream_sequence,
  }];
}

function advanceCursors(
  state: DeepAlignmentProjectionState,
  event: DeepAlignmentLedgerEvent,
): DeepAlignmentProjectionState['cursors'] {
  const planes = DEEP_ALIGNMENT_EVENT_ROUTING[event.payload.stem];
  const next = { ...state.cursors };
  for (const plane of planes) {
    next[plane] = Math.max(next[plane], event.stream_sequence);
  }
  return next;
}

function foldConformanceEvent(
  state: DeepAlignmentProjectionState,
  event: DeepAlignmentLedgerEvent,
): DeepAlignmentProjectionState['conformance'] {
  switch (event.payload.stem) {
    case 'deep_alignment.observation_recorded':
      return foldObservation(
        state,
        event as DeepAlignmentEventEnvelope<'deep_alignment.observation_recorded'>,
      );
    case 'deep_alignment.observation_reconciled':
      return foldObservationReconciliation(
        state,
        event as DeepAlignmentEventEnvelope<'deep_alignment.observation_reconciled'>,
      );
    case 'deep_alignment.finding_candidate_emitted':
      return foldCandidate(
        state,
        event as DeepAlignmentEventEnvelope<'deep_alignment.finding_candidate_emitted'>,
      );
    case 'deep_alignment.finding_verification_recorded':
      return foldVerification(
        state,
        event as DeepAlignmentEventEnvelope<
          'deep_alignment.finding_verification_recorded'
        >,
      );
    case 'deep_alignment.claim_adjudication_recorded':
      return foldAdjudication(
        state,
        event as DeepAlignmentEventEnvelope<
          'deep_alignment.claim_adjudication_recorded'
        >,
      );
    case 'deep_alignment.conformance_assessment_recorded':
      return foldAssessment(
        state,
        event as DeepAlignmentEventEnvelope<
          'deep_alignment.conformance_assessment_recorded'
        >,
      );
    case 'deep_alignment.known_deviation_recorded':
    case 'deep_alignment.known_deviation_invalidated':
      return foldDeviation(
        state,
        event as DeepAlignmentEventEnvelope<
          'deep_alignment.known_deviation_recorded'
          | 'deep_alignment.known_deviation_invalidated'
        >,
      );
    case 'deep_alignment.finding_state_changed':
      return foldFindingState(
        state,
        event as DeepAlignmentEventEnvelope<'deep_alignment.finding_state_changed'>,
      );
    case 'deep_alignment.finding_lineage_recorded':
      assertFindingLineage(
        state,
        event as DeepAlignmentEventEnvelope<
          'deep_alignment.finding_lineage_recorded'
        >,
      );
      return state.conformance;
    default:
      return state.conformance;
  }
}

function latestRunConvergence(
  state: DeepAlignmentProjectionState,
): DeepAlignmentConvergenceEvaluation | undefined {
  const runStreamId = establishedRunStreamId(state);
  const latestEventId = state.seenEvents.filter((event) => (
    event.streamId === runStreamId
    && (
      event.stem === 'deep_alignment.convergence_evaluated'
      || event.stem === 'deep_alignment.graph_convergence_evaluated'
    )
  )).at(-1)?.eventId;
  return state.reviewLoop.evaluations.find(
    (evaluation) => evaluation.producerEventId === latestEventId,
  );
}

function assertCompletionReferences(
  state: DeepAlignmentProjectionState,
  event: DeepAlignmentEventEnvelope<'deep_alignment.run_completed'>,
): ReturnType<typeof reduceSharedReviewLoopBackbone> | null {
  const payload = event.payload;
  const runStreamId = establishedRunStreamId(state);
  if (event.stream_id !== runStreamId) {
    throw new DeepAlignmentReducerError(
      'referential-integrity',
      'Run completion must use the stream established by causal genesis',
      'reviewLoop.terminalDecision',
    );
  }
  if (payload.data.finalLedgerTailHash !== payload.prevEventHash) {
    throw new DeepAlignmentReducerError(
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
    throw new DeepAlignmentReducerError(
      'referential-integrity',
      'Completion references must identify events on the established run stream',
      `reviewLoop.${missing[0]}`,
    );
  }
  if (payload.data.terminalStatus !== 'completed') return null;
  const evaluation = latestRunConvergence(state);
  const validEvaluation = evaluation !== undefined
    && evaluation.producerEventId === payload.data.convergenceEventId
    && evaluation.decision === 'converged'
    && evaluation.stopCandidate;
  const validSynthesis = state.seenEvents.some((seen) => (
    seen.eventId === payload.data.synthesisEventId
    && seen.streamId === runStreamId
    && seen.stem === 'deep_alignment.synthesis_started'
  ));
  const validReport = state.artifactIndex.artifacts.some((artifact) => (
    artifact.producerEventId === payload.data.reportEventId
    && artifact.artifactKind === 'review-report'
    && artifact.availability === 'available'
  ));
  const validContinuity = state.artifactIndex.artifacts.some((artifact) => (
    artifact.producerEventId === payload.data.continuityEventId
    && artifact.artifactKind === 'continuity-save'
    && artifact.availability === 'available'
  ));
  if (!validEvaluation || !validSynthesis || !validReport || !validContinuity) {
    throw new DeepAlignmentReducerError(
      'impossible-status-transition',
      'Completed alignment requires the latest convergence and typed output evidence',
      'status',
    );
  }
  const backbone = deriveBackbone(state, evaluation);
  if (backbone.eligibility !== 'STOP_ELIGIBLE'
    || backbone.blockerIds.length > 0
    || state.conformance.hardVetoFindingIds.length > 0
    || payload.data.verdict !== 'pass') {
    throw new DeepAlignmentReducerError(
      'impossible-status-transition',
      'Completion cannot override current coverage, authority, evidence, or veto blockers',
      'status.state',
    );
  }
  return backbone;
}

function applyEvent(
  state: DeepAlignmentProjectionState,
  event: DeepAlignmentLedgerEvent,
): DeepAlignmentProjectionState {
  const seenEvents = appendSeenEvent(state, event);
  if (seenEvents === null) return state;
  assertRunIdentity(state, event);
  if (state.status.terminal) {
    throw new DeepAlignmentReducerError(
      'duplicate-terminal-event',
      'A run accepts no events after its terminal transition',
      'status.provenance',
    );
  }

  const run = foldRun(state, event);
  let working: DeepAlignmentProjectionState = {
    ...state,
    run,
    seenEvents,
    reviewLoop: { ...state.reviewLoop, lastAppliedSequence: seenEvents.length },
    cursors: advanceCursors(state, event),
  };
  working = { ...working, authorityAlignment: foldAuthority(working, event) };
  working = { ...working, lanePlan: foldLanePlan(working, event) };
  working = { ...working, applicability: foldApplicability(working, event) };
  working = { ...working, reviewLoop: foldSharedReviewLoop(working, event) };
  working = { ...working, conformance: foldConformanceEvent(working, event) };

  if (event.payload.stem === 'deep_alignment.evidence_receipt_bound') {
    working = {
      ...working,
      proofWitness: foldEvidenceReceipt(
        working,
        event as DeepAlignmentEventEnvelope<
          'deep_alignment.evidence_receipt_bound'
        >,
      ),
    };
  }
  if (event.payload.stem === 'deep_alignment.proof_witness_recorded') {
    working = {
      ...working,
      proofWitness: foldProofWitness(
        working,
        event as DeepAlignmentEventEnvelope<'deep_alignment.proof_witness_recorded'>,
      ),
    };
  }
  working = {
    ...working,
    conformance: refreshConformance(working, working.conformance),
  };

  if (event.payload.stem === 'deep_alignment.convergence_evaluated'
    || event.payload.stem === 'deep_alignment.graph_convergence_evaluated') {
    const evaluation = convergenceEvaluation(event as DeepAlignmentEventEnvelope<
      'deep_alignment.convergence_evaluated'
      | 'deep_alignment.graph_convergence_evaluated'
    >);
    const evaluations = sortByProducer(
      [...working.reviewLoop.evaluations, evaluation],
      working.seenEvents,
    );
    if (event.stream_id === establishedRunStreamId(working)) {
      const withEvaluation = {
        ...working,
        reviewLoop: { ...working.reviewLoop, evaluations },
      };
      const backbone = deriveBackbone(withEvaluation, evaluation);
      working = {
        ...withEvaluation,
        reviewLoop: {
          ...withEvaluation.reviewLoop,
          currentIterationId: evaluation.iterationId,
          eligibility: backbone.eligibility,
          outcome: backbone.outcome,
          blockerIds: [...backbone.blockerIds],
        },
      };
    } else {
      working = {
        ...working,
        reviewLoop: { ...working.reviewLoop, evaluations },
      };
    }
  }

  const artifact = artifactFromEvent(working, event);
  working = {
    ...working,
    artifactIndex: {
      artifacts: refreshArtifacts(
        working.artifactIndex.artifacts,
        artifact,
        working.seenEvents,
      ),
    },
  };

  let completionBackbone: ReturnType<typeof reduceSharedReviewLoopBackbone> | null = null;
  if (event.payload.stem === 'deep_alignment.run_completed') {
    completionBackbone = assertCompletionReferences(
      working,
      event as DeepAlignmentEventEnvelope<'deep_alignment.run_completed'>,
    );
    if (completionBackbone !== null) {
      working = {
        ...working,
        reviewLoop: {
          ...working.reviewLoop,
          eligibility: completionBackbone.eligibility,
          outcome: completionBackbone.outcome,
          blockerIds: [...completionBackbone.blockerIds],
        },
      };
    }
  }

  const transition = transitionForEvent(event, working.reviewLoop);
  const provenance = transition === null
    ? [...state.status.provenance]
    : [...state.status.provenance, transition];
  const status = deriveStatus(provenance, working);
  const next = { ...working, status };
  assertDeepAlignmentProjectionState(next);
  return immutableProjectionClone(next) as DeepAlignmentProjectionState;
}

// ───────────────────────────────────────────────────────────────────
// 10. MODE-CONTRACT REDUCER SURFACE
// ───────────────────────────────────────────────────────────────────

export type DeepAlignmentReducerSurface = Pick<
  ModeContract<DeepAlignmentModeContractState>,
  'reducers' | 'reduce'
>;

/** Apply one real verified-ledger event through the shared reducer signature. */
export function reduceDeepAlignmentVerifiedEvent(
  verified: VerifiedLedgerEvent,
  state: Readonly<DeepAlignmentModeContractState>,
): ModeReductionResult<DeepAlignmentModeContractState> {
  assertDeepAlignmentProjectionState(state);
  const event = typedEventFromVerified(verified);
  const next = applyEvent(state, event);
  return Object.freeze({
    reducerId: DEEP_ALIGNMENT_REDUCER_ID,
    stateVersion: DEEP_ALIGNMENT_PROJECTION_SCHEMA_VERSION,
    appliedEventId: event.event_id,
    state: asModeContractState(next),
  });
}

export const DEEP_ALIGNMENT_REDUCER_SURFACE:
DeepAlignmentReducerSurface = Object.freeze({
  reducers: DEEP_ALIGNMENT_REDUCER_SET,
  reduce: reduceDeepAlignmentVerifiedEvent,
});

function assertReducerOwnership(
  reducers: ModeReducerSet<DeepAlignmentModeContractState>,
): void {
  const declared = [...reducers.persistedFields].sort(compareString);
  const expected = [...PERSISTED_FIELDS].sort(compareString);
  if (!sameCanonical(declared, expected)) {
    throw new DeepAlignmentReducerError(
      'projection-field-undeclared',
      'Persisted fields must equal the closed deep-alignment projection field set',
      'reducers.persistedFields',
    );
  }
  const owners = new Map<string, string>();
  for (const definition of reducers.definitions) {
    for (const field of definition.ownedFields) {
      if (owners.has(field)) {
        throw new DeepAlignmentReducerError(
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
      throw new DeepAlignmentReducerError(
        'projection-field-undeclared',
        `Projection field ${field} has no reducer owner`,
        field,
      );
    }
  }
}

function topLevelChangedFields(
  before: DeepAlignmentProjectionState,
  after: DeepAlignmentProjectionState,
): DeepAlignmentPersistedField[] {
  return PERSISTED_FIELDS.filter((field) => !sameCanonical(before[field], after[field]));
}

/** Probe the shared reducer surface for ownership, purity, and determinism. */
export function verifyDeepAlignmentReducerSurface(
  surface: DeepAlignmentReducerSurface,
  event: VerifiedLedgerEvent,
  state: DeepAlignmentProjectionState,
): void {
  assertReducerOwnership(surface.reducers);
  const firstInput = immutableProjectionClone(state) as DeepAlignmentProjectionState;
  const secondInput = immutableProjectionClone(state) as DeepAlignmentProjectionState;
  const initial = canonicalJson(firstInput);
  const first = surface.reduce(event, asModeContractState(firstInput));
  const second = surface.reduce(event, asModeContractState(secondInput));
  assertDeepAlignmentProjectionState(first.state);
  assertDeepAlignmentProjectionState(second.state);
  if (!isDeepFrozenProjection(first.state) || !isDeepFrozenProjection(second.state)) {
    throw new DeepAlignmentReducerError(
      'projection-not-frozen',
      'Mode reducer outputs must be recursively frozen',
      'state',
    );
  }
  if (canonicalJson(firstInput) !== initial || canonicalJson(secondInput) !== initial) {
    throw new DeepAlignmentReducerError(
      'state-mutated',
      'Mode reducer mutated its frozen input',
      'state',
    );
  }
  if (!sameCanonical(first, second)) {
    throw new DeepAlignmentReducerError(
      'reducer-nondeterministic',
      'Mode reducer produced different outputs for equal inputs',
      'state',
    );
  }
  const definition = surface.reducers.definitions.find(
    (candidate) => candidate.reducerId === first.reducerId,
  );
  if (definition === undefined) {
    throw new DeepAlignmentReducerError(
      'reducer-output-unowned',
      'Mode reducer returned an undeclared reducer identity',
      'reducerId',
    );
  }
  const unowned = topLevelChangedFields(state, first.state).find(
    (field) => !definition.ownedFields.includes(field),
  );
  if (unowned !== undefined) {
    throw new DeepAlignmentReducerError(
      'reducer-output-unowned',
      `Mode reducer wrote unowned projection field ${unowned}`,
      unowned,
    );
  }
}

// ───────────────────────────────────────────────────────────────────
// 11. FULL AND INCREMENTAL REPLAY
// ───────────────────────────────────────────────────────────────────

/** Derive the deterministic projection integrity digest. */
export function deepAlignmentProjectionIntegrityDigest(
  projection: DeepAlignmentProjectionState,
): string {
  assertDeepAlignmentProjectionState(projection);
  return sha256Bytes(canonicalBytes({
    schemaVersion: DEEP_ALIGNMENT_PROJECTION_SCHEMA_VERSION,
    reducerVersion: DEEP_ALIGNMENT_REDUCER_VERSION,
    codecVersion: DEEP_ALIGNMENT_PROJECTION_CODEC_VERSION,
    orderingPolicyVersion: DEEP_ALIGNMENT_ORDERING_POLICY_VERSION,
    projection,
  }));
}

function checkpointIntegrityDigest(
  projection: DeepAlignmentProjectionState,
  sourceTailSequence: number,
  sourceTailEventDigest: string,
): string {
  return sha256Bytes(canonicalBytes({
    projectionDigest: deepAlignmentProjectionIntegrityDigest(projection),
    sourceTailSequence,
    sourceTailEventDigest,
  }));
}

function rebuildReasons(
  options: DeepAlignmentFoldOptions,
): DeepAlignmentRebuildReasonCode[] {
  const reasons: DeepAlignmentRebuildReasonCode[] = [];
  if (options.expectedSchemaVersion !== undefined
    && options.expectedSchemaVersion !== DEEP_ALIGNMENT_PROJECTION_SCHEMA_VERSION) {
    reasons.push('projection-schema-mismatch');
  }
  if (options.expectedReducerVersion !== undefined
    && options.expectedReducerVersion !== DEEP_ALIGNMENT_REDUCER_VERSION) {
    reasons.push('reducer-version-mismatch');
  }
  if (options.expectedCodecVersion !== undefined
    && options.expectedCodecVersion !== DEEP_ALIGNMENT_PROJECTION_CODEC_VERSION) {
    reasons.push('codec-version-mismatch');
  }
  if (options.expectedOrderingPolicyVersion !== undefined
    && options.expectedOrderingPolicyVersion !== DEEP_ALIGNMENT_ORDERING_POLICY_VERSION) {
    reasons.push('ordering-policy-mismatch');
  }
  const checkpoint = options.checkpoint;
  if (checkpoint !== undefined) {
    try {
      assertDeepAlignmentProjectionState(checkpoint.projection);
    } catch {
      reasons.push('projection-schema-mismatch');
      return sortStrings(reasons) as DeepAlignmentRebuildReasonCode[];
    }
    if (checkpoint.projection.schemaVersion
      !== DEEP_ALIGNMENT_PROJECTION_SCHEMA_VERSION) {
      reasons.push('projection-schema-mismatch');
    }
    if (checkpoint.projection.reducerVersion !== DEEP_ALIGNMENT_REDUCER_VERSION) {
      reasons.push('reducer-version-mismatch');
    }
    if (checkpoint.projection.codecVersion
      !== DEEP_ALIGNMENT_PROJECTION_CODEC_VERSION) {
      reasons.push('codec-version-mismatch');
    }
    if (checkpoint.projection.orderingPolicyVersion
      !== DEEP_ALIGNMENT_ORDERING_POLICY_VERSION) {
      reasons.push('ordering-policy-mismatch');
    }
    if (checkpoint.integrityDigest !== checkpointIntegrityDigest(
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
  return [...new Set(reasons)].sort(compareString) as DeepAlignmentRebuildReasonCode[];
}

function projectedResult(
  projection: DeepAlignmentProjectionState,
  sourceTailSequence: number,
  sourceTailEventDigest: string,
): DeepAlignmentProjectedResult {
  const checkpoint: DeepAlignmentProjectionCheckpoint = {
    projection,
    integrityDigest: checkpointIntegrityDigest(
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
    integrityDigest: deepAlignmentProjectionIntegrityDigest(projection),
    checkpoint,
  }) as unknown as DeepAlignmentProjectedResult;
}

function hasSequenceGap(
  events: readonly DeepAlignmentLedgerEvent[],
  checkpoint: DeepAlignmentProjectionCheckpoint | undefined,
): boolean {
  const expectedByStream = new Map<string, number>();
  const priorEventIds = new Set<string>();
  for (const seen of checkpoint?.projection.seenEvents ?? []) {
    priorEventIds.add(seen.eventId);
    expectedByStream.set(
      seen.streamId,
      Math.max(expectedByStream.get(seen.streamId) ?? 0, seen.streamSequence),
    );
  }
  const eventIds = new Set<string>();
  for (const event of events) {
    if (priorEventIds.has(event.event_id) || eventIds.has(event.event_id)) continue;
    const expected = expectedByStream.get(event.stream_id) ?? 0;
    if (event.stream_sequence !== expected + 1) return true;
    expectedByStream.set(event.stream_id, event.stream_sequence);
    eventIds.add(event.event_id);
  }
  return false;
}

/** Fold real typed ledger events into frozen, checkpointable projections. */
export function foldDeepAlignmentEvents(
  events: readonly DeepAlignmentLedgerEvent[],
  options: DeepAlignmentFoldOptions = {},
): DeepAlignmentFoldResult {
  const reasons = rebuildReasons(options);
  if (reasons.length > 0) {
    return Object.freeze({
      outcome: 'rebuild_required',
      reasonCodes: Object.freeze(reasons),
    });
  }
  const validated = events.map(validateTypedEvent);
  if (options.requireContiguousTail !== false
    && hasSequenceGap(validated, options.checkpoint)) {
    return Object.freeze({
      outcome: 'rebuild_required',
      reasonCodes: Object.freeze(['cursor-gap'] as const),
    });
  }
  let projection = options.checkpoint?.projection
    ?? createDeepAlignmentProjectionState();
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
// 12. SHADOW-ONLY LEGACY VIEW
// ───────────────────────────────────────────────────────────────────

/** Project the complete canonical comparison structure without subset parity. */
export function projectDeepAlignmentLegacyView(
  projection: DeepAlignmentProjectionState,
): DeepAlignmentLegacyProjection {
  assertDeepAlignmentProjectionState(projection);
  const canonicalStructure = {
    iteration: projection.reviewLoop.currentIterationId,
    status: projection.status.state,
    terminalDecision: projection.reviewLoop.terminalDecision,
    lanes: projection.lanePlan.lanes,
    applicability: projection.applicability.decisions,
    verdicts: projection.conformance.laneVerdicts,
    artifacts: projection.artifactIndex.artifacts,
    projectionHealth: projection.status.health,
  };
  const legacy: DeepAlignmentLegacyProjection = {
    authority: 'shadow-only',
    legacyAuthority: 'unchanged',
    ...canonicalStructure,
    parityFingerprint: sha256Bytes(canonicalBytes(canonicalStructure)),
  };
  assertDeepAlignmentLegacyProjection(legacy);
  return immutableProjectionClone(legacy) as DeepAlignmentLegacyProjection;
}

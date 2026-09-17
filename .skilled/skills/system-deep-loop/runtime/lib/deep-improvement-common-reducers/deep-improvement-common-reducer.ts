// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Improvement Common Reducer
// ───────────────────────────────────────────────────────────────────

import {
  DEEP_IMPROVEMENT_COMMON_SCORE_WRITE_BACKEND_REF,
  DeepImprovementCommonEventStems,
  DeepImprovementCommonWireEventTypes,
  createDeepImprovementCommonEventRegistry,
  isDeepImprovementCommonEventStem,
} from '../deep-improvement-common-ledger-schema/index.js';
import {
  canonicalBytes,
  canonicalJson,
  readEvent,
  sha256Bytes,
} from '../event-envelope/index.js';
import {
  DeepImprovementCommonReducerError,
  assertDeepImprovementCommonCandidateView,
  assertDeepImprovementCommonLegacyProjection,
  assertDeepImprovementCommonProjectionState,
  immutableProjectionClone,
  isDeepFrozenProjection,
} from './deep-improvement-common-projection-schema.js';

import type { VerifiedLedgerEvent } from '../authorized-ledger/index.js';
import type {
  DeepImprovementCommonEventEnvelope,
  DeepImprovementCommonEventStem,
  DeepImprovementCommonLedgerEvent,
  DeepImprovementCommonLedgerPayload,
  DeepImprovementVariant,
} from '../deep-improvement-common-ledger-schema/index.js';
import type { JsonObject } from '../event-envelope/index.js';
import type {
  ModeContract,
  ModeReducerSet,
  ModeReductionResult,
} from '../mode-contracts/index.js';
import type {
  DeepImprovementCommonArtifactIndexProjection,
  DeepImprovementCommonArtifactRecord,
  DeepImprovementCommonCandidateProgress,
  DeepImprovementCommonCandidateRecord,
  DeepImprovementCommonCandidateView,
  DeepImprovementCommonCanaryRecord,
  DeepImprovementCommonFoldOptions,
  DeepImprovementCommonFoldResult,
  DeepImprovementCommonHardVeto,
  DeepImprovementCommonLegacyProjection,
  DeepImprovementCommonModeState,
  DeepImprovementCommonModeStatus,
  DeepImprovementCommonPersistedField,
  DeepImprovementCommonProjectedResult,
  DeepImprovementCommonProjectionCheckpoint,
  DeepImprovementCommonProjectionFieldOwnership,
  DeepImprovementCommonProjectionState,
  DeepImprovementCommonPromotionRecord,
  DeepImprovementCommonRebuildReasonCode,
  DeepImprovementCommonSeenEvent,
  DeepImprovementCommonStatusTransition,
  DeepImprovementCommonWorkstream,
} from './deep-improvement-common-projection-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. PUBLIC CONTRACT CONSTANTS
// ───────────────────────────────────────────────────────────────────

export const DEEP_IMPROVEMENT_COMMON_PROJECTION_SCHEMA_VERSION =
  'deep-improvement-common-projection@1' as const;
export const DEEP_IMPROVEMENT_COMMON_REDUCER_VERSION =
  'deep-improvement-common-reducer@1' as const;
export const DEEP_IMPROVEMENT_COMMON_PROJECTION_CODEC_VERSION =
  'canonical-json@1' as const;
export const DEEP_IMPROVEMENT_COMMON_ORDERING_POLICY_VERSION =
  'strict-logical-stream-order@1' as const;
export const DEEP_IMPROVEMENT_COMMON_REDUCER_ID =
  'deep-improvement-common:projection-fold' as const;

const eventRegistry = createDeepImprovementCommonEventRegistry();
type DeepImprovementCommonModeContractState =
  DeepImprovementCommonProjectionState & JsonObject;

const PERSISTED_FIELDS = Object.freeze([
  'schemaVersion',
  'reducerVersion',
  'codecVersion',
  'orderingPolicyVersion',
  'run',
  'iterationConvergence',
  'artifactIndex',
  'modeStatus',
  'cursors',
  'seenEvents',
] as const satisfies readonly DeepImprovementCommonPersistedField[]);

type ProjectionPlane =
  | 'iterationConvergence'
  | 'artifactIndex'
  | 'modeStatus';

export const DEEP_IMPROVEMENT_COMMON_EVENT_ROUTING = Object.freeze({
  'deep_improvement_common.run_started': Object.freeze([
    'iterationConvergence', 'artifactIndex', 'modeStatus',
  ]),
  'deep_improvement_common.run_resumed': Object.freeze([
    'iterationConvergence', 'modeStatus',
  ]),
  'deep_improvement_common.run_paused': Object.freeze([
    'iterationConvergence', 'artifactIndex', 'modeStatus',
  ]),
  'deep_improvement_common.run_completed': Object.freeze([
    'iterationConvergence', 'modeStatus',
  ]),
  'deep_improvement_common.run_aborted': Object.freeze([
    'iterationConvergence', 'modeStatus',
  ]),
  'deep_improvement_common.run_quarantined': Object.freeze([
    'iterationConvergence', 'modeStatus',
  ]),
  'deep_improvement_common.candidate_proposed': Object.freeze([
    'iterationConvergence', 'artifactIndex', 'modeStatus',
  ]),
  'deep_improvement_common.candidate_generated': Object.freeze([
    'iterationConvergence', 'artifactIndex', 'modeStatus',
  ]),
  'deep_improvement_common.candidate_rejected': Object.freeze([
    'iterationConvergence', 'modeStatus',
  ]),
  'deep_improvement_common.candidate_lineage_attached': Object.freeze([
    'artifactIndex',
  ]),
  'deep_improvement_common.evaluation_epoch_sealed': Object.freeze([
    'iterationConvergence', 'artifactIndex', 'modeStatus',
  ]),
  'deep_improvement_common.evaluation_started': Object.freeze([
    'iterationConvergence', 'modeStatus',
  ]),
  'deep_improvement_common.evaluation_observation_recorded': Object.freeze([
    'artifactIndex', 'modeStatus',
  ]),
  'deep_improvement_common.evaluation_normalized': Object.freeze([
    'iterationConvergence', 'artifactIndex', 'modeStatus',
  ]),
  'deep_improvement_common.evaluation_verification_requested': Object.freeze([
    'artifactIndex', 'modeStatus',
  ]),
  'deep_improvement_common.evaluation_verification_recorded': Object.freeze([
    'iterationConvergence', 'artifactIndex', 'modeStatus',
  ]),
  'deep_improvement_common.evaluation_inconclusive': Object.freeze([
    'iterationConvergence', 'modeStatus',
  ]),
  'deep_improvement_common.evaluation_failed': Object.freeze([
    'iterationConvergence', 'modeStatus',
  ]),
  'deep_improvement_common.canary_suite_sealed': Object.freeze([
    'iterationConvergence', 'artifactIndex', 'modeStatus',
  ]),
  'deep_improvement_common.canary_executed': Object.freeze([
    'iterationConvergence', 'artifactIndex', 'modeStatus',
  ]),
  'deep_improvement_common.canary_leak_detected': Object.freeze([
    'iterationConvergence', 'modeStatus',
  ]),
  'deep_improvement_common.canary_drift_detected': Object.freeze([
    'iterationConvergence', 'modeStatus',
  ]),
  'deep_improvement_common.canary_invariant_failed': Object.freeze([
    'iterationConvergence', 'modeStatus',
  ]),
  'deep_improvement_common.canary_gate_passed': Object.freeze([
    'iterationConvergence', 'modeStatus',
  ]),
  'deep_improvement_common.canary_gate_failed': Object.freeze([
    'iterationConvergence', 'modeStatus',
  ]),
  'deep_improvement_common.canary_vetoed': Object.freeze([
    'iterationConvergence', 'modeStatus',
  ]),
  'deep_improvement_common.promotion_proposed': Object.freeze([
    'iterationConvergence', 'modeStatus',
  ]),
  'deep_improvement_common.promotion_authorized': Object.freeze([
    'iterationConvergence', 'artifactIndex', 'modeStatus',
  ]),
  'deep_improvement_common.promotion_denied': Object.freeze([
    'iterationConvergence', 'artifactIndex', 'modeStatus',
  ]),
  'deep_improvement_common.promotion_shadow_started': Object.freeze([
    'iterationConvergence', 'modeStatus',
  ]),
  'deep_improvement_common.promotion_canary_started': Object.freeze([
    'iterationConvergence', 'modeStatus',
  ]),
  'deep_improvement_common.promotion_paused': Object.freeze([
    'iterationConvergence', 'artifactIndex', 'modeStatus',
  ]),
  'deep_improvement_common.promotion_aborted': Object.freeze([
    'iterationConvergence', 'artifactIndex', 'modeStatus',
  ]),
  'deep_improvement_common.promotion_baseline_restored': Object.freeze([
    'iterationConvergence', 'artifactIndex', 'modeStatus',
  ]),
  'deep_improvement_common.promotion_completed': Object.freeze([
    'iterationConvergence', 'artifactIndex', 'modeStatus',
  ]),
} as const satisfies Readonly<
  Record<DeepImprovementCommonEventStem, readonly ProjectionPlane[]>
>);

function stemsForPlane(
  plane: ProjectionPlane,
): readonly DeepImprovementCommonEventStem[] {
  return Object.freeze(DeepImprovementCommonEventStems.filter((stem) => (
    DEEP_IMPROVEMENT_COMMON_EVENT_ROUTING[stem].includes(plane as never)
  )));
}

export const DEEP_IMPROVEMENT_COMMON_PROJECTION_FIELD_OWNERSHIP = Object.freeze([
  {
    field: 'schemaVersion',
    ownerReducerId: DEEP_IMPROVEMENT_COMMON_REDUCER_ID,
    inputStems: Object.freeze([]),
    foldAlgebra: 'constant',
    immutableOutput: true,
  },
  {
    field: 'reducerVersion',
    ownerReducerId: DEEP_IMPROVEMENT_COMMON_REDUCER_ID,
    inputStems: Object.freeze([]),
    foldAlgebra: 'constant',
    immutableOutput: true,
  },
  {
    field: 'codecVersion',
    ownerReducerId: DEEP_IMPROVEMENT_COMMON_REDUCER_ID,
    inputStems: Object.freeze([]),
    foldAlgebra: 'constant',
    immutableOutput: true,
  },
  {
    field: 'orderingPolicyVersion',
    ownerReducerId: DEEP_IMPROVEMENT_COMMON_REDUCER_ID,
    inputStems: Object.freeze([]),
    foldAlgebra: 'constant',
    immutableOutput: true,
  },
  {
    field: 'run',
    ownerReducerId: DEEP_IMPROVEMENT_COMMON_REDUCER_ID,
    inputStems: DeepImprovementCommonEventStems,
    foldAlgebra: 'insert-sorted-and-derive',
    immutableOutput: true,
  },
  {
    field: 'iterationConvergence',
    ownerReducerId: DEEP_IMPROVEMENT_COMMON_REDUCER_ID,
    inputStems: stemsForPlane('iterationConvergence'),
    foldAlgebra: 'insert-sorted-and-derive',
    immutableOutput: true,
  },
  {
    field: 'artifactIndex',
    ownerReducerId: DEEP_IMPROVEMENT_COMMON_REDUCER_ID,
    inputStems: stemsForPlane('artifactIndex'),
    foldAlgebra: 'insert-sorted-and-derive',
    immutableOutput: true,
  },
  {
    field: 'modeStatus',
    ownerReducerId: DEEP_IMPROVEMENT_COMMON_REDUCER_ID,
    inputStems: stemsForPlane('modeStatus'),
    foldAlgebra: 'insert-sorted-and-derive',
    immutableOutput: true,
  },
  {
    field: 'cursors',
    ownerReducerId: DEEP_IMPROVEMENT_COMMON_REDUCER_ID,
    inputStems: DeepImprovementCommonEventStems,
    foldAlgebra: 'insert-sorted-and-derive',
    immutableOutput: true,
  },
  {
    field: 'seenEvents',
    ownerReducerId: DEEP_IMPROVEMENT_COMMON_REDUCER_ID,
    inputStems: DeepImprovementCommonEventStems,
    foldAlgebra: 'insert-sorted',
    immutableOutput: true,
  },
] as const satisfies readonly DeepImprovementCommonProjectionFieldOwnership[]);

export const DEEP_IMPROVEMENT_COMMON_REDUCER_SET:
ModeReducerSet<DeepImprovementCommonModeContractState> = Object.freeze({
  persistedFields: PERSISTED_FIELDS,
  definitions: Object.freeze([Object.freeze({
    reducerId: DEEP_IMPROVEMENT_COMMON_REDUCER_ID,
    reducerVersion: DEEP_IMPROVEMENT_COMMON_REDUCER_VERSION,
    stateVersion: DEEP_IMPROVEMENT_COMMON_PROJECTION_SCHEMA_VERSION,
    ownedFields: PERSISTED_FIELDS,
    inputEventTypes: Object.freeze(
      DeepImprovementCommonEventStems.map(
        (stem) => DeepImprovementCommonWireEventTypes[stem],
      ),
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

function payloadFor<TStem extends DeepImprovementCommonEventStem>(
  event: DeepImprovementCommonLedgerEvent,
  stem: TStem,
): DeepImprovementCommonLedgerPayload<TStem> {
  if (event.payload.stem !== stem) {
    throw new DeepImprovementCommonReducerError(
      'event-not-deep-improvement-common',
      `Expected ${stem}, received ${event.payload.stem}`,
      'payload.stem',
    );
  }
  return event.payload as DeepImprovementCommonLedgerPayload<TStem>;
}

function eventDigest(event: DeepImprovementCommonLedgerEvent): string {
  return sha256Bytes(canonicalBytes(event));
}

function validateTypedEvent(
  event: DeepImprovementCommonLedgerEvent,
): DeepImprovementCommonLedgerEvent {
  try {
    const read = readEvent(canonicalBytes(event), eventRegistry);
    const effective = read.effective.envelope;
    const payload = effective.payload;
    if (!isDeepImprovementCommonEventStem(payload.stem)
      || effective.event_type !== DeepImprovementCommonWireEventTypes[payload.stem]) {
      throw new DeepImprovementCommonReducerError(
        'event-not-deep-improvement-common',
        'Verified event does not carry a registered common stem',
        'event_type',
      );
    }
    return effective as DeepImprovementCommonLedgerEvent;
  } catch (error: unknown) {
    if (error instanceof DeepImprovementCommonReducerError) throw error;
    throw new DeepImprovementCommonReducerError(
      'event-schema-invalid',
      'Common event failed the real typed-ledger registry',
      'event',
    );
  }
}

function typedEventFromVerified(
  verified: VerifiedLedgerEvent,
): DeepImprovementCommonLedgerEvent {
  const envelope = verified.event.effective.envelope;
  const payload = envelope.payload;
  if (!isDeepImprovementCommonEventStem(payload.stem)
    || envelope.event_type !== DeepImprovementCommonWireEventTypes[payload.stem]) {
    throw new DeepImprovementCommonReducerError(
      'event-not-deep-improvement-common',
      'Mode reducer received a verified event outside the common union',
      'event_type',
    );
  }
  return validateTypedEvent(envelope as DeepImprovementCommonLedgerEvent);
}

function asModeContractState(
  state: DeepImprovementCommonProjectionState,
): DeepImprovementCommonModeContractState {
  assertDeepImprovementCommonProjectionState(state);
  return state as DeepImprovementCommonModeContractState;
}

function topLevelChangedFields(
  before: DeepImprovementCommonProjectionState,
  after: DeepImprovementCommonProjectionState,
): DeepImprovementCommonPersistedField[] {
  return PERSISTED_FIELDS.filter(
    (field) => !sameCanonical(before[field], after[field]),
  );
}

function scopeCandidateId(event: DeepImprovementCommonLedgerEvent): string | null {
  return 'candidateId' in event.payload.scope
    ? String(event.payload.scope.candidateId)
    : null;
}

function scopeEvaluationEpochId(
  event: DeepImprovementCommonLedgerEvent,
): string | null {
  return 'evaluationEpochId' in event.payload.scope
    ? String(event.payload.scope.evaluationEpochId)
    : null;
}

function scopeCanaryEpochId(event: DeepImprovementCommonLedgerEvent): string | null {
  return 'canaryEpochId' in event.payload.scope
    ? String(event.payload.scope.canaryEpochId)
    : null;
}

function scopePromotionId(event: DeepImprovementCommonLedgerEvent): string | null {
  return 'promotionId' in event.payload.scope
    ? String(event.payload.scope.promotionId)
    : null;
}

function requireSeenEvent(
  state: DeepImprovementCommonProjectionState,
  eventId: string,
  stems: readonly DeepImprovementCommonEventStem[],
  payloadDigest?: string,
  candidateId?: string,
): DeepImprovementCommonSeenEvent {
  const referenced = state.seenEvents.find((event) => event.eventId === eventId);
  if (referenced === undefined
    || !stems.includes(referenced.stem)
    || (payloadDigest !== undefined && referenced.payloadDigest !== payloadDigest)
    || (candidateId !== undefined && referenced.candidateId !== candidateId)) {
    throw new DeepImprovementCommonReducerError(
      'referential-integrity',
      'Event reference must resolve to the expected captured producer and payload digest',
      'payload.data',
    );
  }
  return referenced;
}

function candidateProgress(
  state: DeepImprovementCommonProjectionState,
  candidateId: string,
): DeepImprovementCommonCandidateProgress {
  const candidate = state.iterationConvergence.candidates.find(
    (entry) => entry.candidateId === candidateId,
  );
  if (candidate === undefined) {
    throw new DeepImprovementCommonReducerError(
      'referential-integrity',
      'Candidate-scoped events require a candidate captured in the folded ledger',
      'payload.scope.candidateId',
    );
  }
  return candidate;
}

function candidateRecord(
  state: DeepImprovementCommonProjectionState,
  candidateId: string,
): DeepImprovementCommonCandidateRecord {
  const candidate = state.artifactIndex.candidates.find(
    (entry) => entry.candidateId === candidateId,
  );
  if (candidate === undefined) {
    throw new DeepImprovementCommonReducerError(
      'referential-integrity',
      'Candidate artifact history requires a captured proposal',
      'artifactIndex.candidates',
    );
  }
  return candidate;
}

function replaceCandidateProgress(
  values: readonly DeepImprovementCommonCandidateProgress[],
  next: DeepImprovementCommonCandidateProgress,
): DeepImprovementCommonCandidateProgress[] {
  const candidates = values.filter((entry) => entry.candidateId !== next.candidateId);
  candidates.push(next);
  candidates.sort((left, right) => compareString(left.candidateId, right.candidateId));
  return candidates;
}

function replaceCandidateRecord(
  values: readonly DeepImprovementCommonCandidateRecord[],
  next: DeepImprovementCommonCandidateRecord,
): DeepImprovementCommonCandidateRecord[] {
  const candidates = values.filter((entry) => entry.candidateId !== next.candidateId);
  candidates.push(next);
  candidates.sort((left, right) => compareString(left.candidateId, right.candidateId));
  return candidates;
}

function replaceCanary(
  values: readonly DeepImprovementCommonCanaryRecord[],
  next: DeepImprovementCommonCanaryRecord,
): DeepImprovementCommonCanaryRecord[] {
  const canaries = values.filter((entry) => (
    entry.candidateId !== next.candidateId
    || entry.canaryEpochId !== next.canaryEpochId
    || entry.canarySuiteId !== next.canarySuiteId
  ));
  canaries.push(next);
  canaries.sort((left, right) => (
    compareString(left.candidateId, right.candidateId)
      || compareString(left.canaryEpochId, right.canaryEpochId)
      || compareString(left.canarySuiteId, right.canarySuiteId)
  ));
  return canaries;
}

function replacePromotion(
  values: readonly DeepImprovementCommonPromotionRecord[],
  next: DeepImprovementCommonPromotionRecord,
): DeepImprovementCommonPromotionRecord[] {
  const promotions = values.filter((entry) => entry.promotionId !== next.promotionId);
  promotions.push(next);
  promotions.sort((left, right) => compareString(left.promotionId, right.promotionId));
  return promotions;
}

function latestForCandidate<T extends { readonly candidateId: string }>(
  values: readonly T[],
  candidateId: string,
): T | undefined {
  return [...values].reverse().find((entry) => entry.candidateId === candidateId);
}

function artifactIdentity(
  kind: string,
  logicalArtifactId: string,
  digest: string,
  producerEventId: string,
): string {
  return `artifact:${sha256Bytes(canonicalBytes({
    kind,
    logicalArtifactId,
    digest,
    producerEventId,
  }))}`;
}

function insertArtifact(
  artifacts: readonly DeepImprovementCommonArtifactRecord[],
  candidate: Omit<
    DeepImprovementCommonArtifactRecord,
    'artifactId' | 'supersedesArtifactIds' | 'supersededByArtifactIds'
  >,
): DeepImprovementCommonArtifactRecord[] {
  const artifactId = artifactIdentity(
    candidate.artifactKind,
    candidate.logicalArtifactId,
    candidate.digest,
    candidate.producerEventId,
  );
  const existing = artifacts.find((entry) => entry.artifactId === artifactId);
  if (existing !== undefined) return [...artifacts];
  const prior = artifacts.filter((entry) => (
    entry.logicalArtifactId === candidate.logicalArtifactId
    && entry.availability !== 'superseded'
  ));
  const priorIds = prior.map((entry) => entry.artifactId);
  const next = artifacts.map((entry) => (
    priorIds.includes(entry.artifactId)
      ? {
        ...entry,
        availability: 'superseded' as const,
        supersededByArtifactIds: sortStrings([
          ...entry.supersededByArtifactIds,
          artifactId,
        ]),
      }
      : entry
  ));
  next.push({
    ...candidate,
    artifactId,
    supersedesArtifactIds: sortStrings(priorIds),
    supersededByArtifactIds: [],
  });
  next.sort((left, right) => (
    compareString(left.logicalArtifactId, right.logicalArtifactId)
      || compareString(left.artifactId, right.artifactId)
  ));
  return next;
}

function addHardVeto(
  vetoes: readonly DeepImprovementCommonHardVeto[],
  veto: DeepImprovementCommonHardVeto,
): DeepImprovementCommonHardVeto[] {
  if (vetoes.some((entry) => (
    entry.producerEventId === veto.producerEventId
    && entry.vetoCode === veto.vetoCode
  ))) return [...vetoes];
  const next = [...vetoes, veto];
  next.sort((left, right) => (
    compareString(left.candidateId, right.candidateId)
      || compareString(left.vetoCode, right.vetoCode)
      || compareString(left.producerEventId, right.producerEventId)
  ));
  return next;
}

function candidateVetoes(
  state: DeepImprovementCommonProjectionState,
  candidateId: string,
): DeepImprovementCommonHardVeto[] {
  return state.iterationConvergence.hardVetoes.filter(
    (veto) => veto.candidateId === candidateId,
  );
}

// ───────────────────────────────────────────────────────────────────
// 3. INITIAL STATE
// ───────────────────────────────────────────────────────────────────

function emptyModeStatus(
  workstream: DeepImprovementCommonWorkstream,
): DeepImprovementCommonModeStatus {
  return {
    workstream,
    state: 'planned',
    evaluatorEpochId: null,
    activeProfileRef: null,
    currentIncumbentCandidateId: null,
    candidateStage: null,
    canaryStage: 'not-started',
    promotionStage: 'not-proposed',
    authorityState: 'legacy',
    rollbackTargetBaselineId: null,
    blockingVetoCodes: [],
    profileIncumbents: [],
    terminal: false,
    provenance: [],
  };
}

/** Create the immutable empty state consumed by common and downstream folds. */
export function createDeepImprovementCommonProjectionState():
DeepImprovementCommonProjectionState {
  const state: DeepImprovementCommonProjectionState = {
    schemaVersion: DEEP_IMPROVEMENT_COMMON_PROJECTION_SCHEMA_VERSION,
    reducerVersion: DEEP_IMPROVEMENT_COMMON_REDUCER_VERSION,
    codecVersion: DEEP_IMPROVEMENT_COMMON_PROJECTION_CODEC_VERSION,
    orderingPolicyVersion: DEEP_IMPROVEMENT_COMMON_ORDERING_POLICY_VERSION,
    run: {
      runId: null,
      lineageId: null,
      variant: null,
      generation: 0,
      charterDigest: null,
      configDigest: null,
      operatorRef: null,
      serviceContractVersion: null,
      replayFingerprint: null,
      maxIterations: 0,
      initializationEventId: null,
      state: 'planned',
    },
    iterationConvergence: {
      currentIteration: 0,
      evaluatorEpochs: [],
      candidates: [],
      canaries: [],
      promotions: [],
      evaluationBudgetRefs: [],
      unresolvedEvidenceRefs: [],
      hardVetoes: [],
      stopReason: null,
      sessionOutcome: null,
      convergenceDisposition: 'active',
    },
    artifactIndex: {
      candidates: [],
      artifacts: [],
      rawObservations: [],
      derivedScores: [],
    },
    modeStatus: {
      statuses: [
        emptyModeStatus('deep-improvement-common'),
        emptyModeStatus('agent-improvement'),
        emptyModeStatus('model-benchmark'),
        emptyModeStatus('skill-benchmark'),
      ],
    },
    cursors: {
      iterationConvergence: 0,
      artifactIndex: 0,
      modeStatus: 0,
    },
    seenEvents: [],
  };
  assertDeepImprovementCommonProjectionState(state);
  return immutableProjectionClone(state) as DeepImprovementCommonProjectionState;
}

// ───────────────────────────────────────────────────────────────────
// 4. RUN, CANDIDATE, AND EVALUATOR FOLDS
// ───────────────────────────────────────────────────────────────────

function assertRunIdentity(
  state: DeepImprovementCommonProjectionState,
  event: DeepImprovementCommonLedgerEvent,
): void {
  if (state.run.runId === null
    && event.payload.stem !== 'deep_improvement_common.run_started') {
    throw new DeepImprovementCommonReducerError(
      'run-not-initialized',
      'A run-started event must precede every common projection event',
      'run',
    );
  }
  if (state.run.runId !== null && (
    state.run.runId !== event.payload.scope.runId
    || state.run.lineageId !== event.payload.scope.lineageId
    || state.run.variant !== event.payload.scope.variant
  )) {
    throw new DeepImprovementCommonReducerError(
      'run-identity-conflict',
      'One projection cannot fold different run, lineage, or variant identities',
      'run',
    );
  }
}

function foldRun(
  state: DeepImprovementCommonProjectionState,
  event: DeepImprovementCommonLedgerEvent,
): DeepImprovementCommonProjectionState['run'] {
  switch (event.payload.stem) {
    case 'deep_improvement_common.run_started': {
      const payload = payloadFor(event, 'deep_improvement_common.run_started');
      if (state.run.initializationEventId !== null) {
        throw new DeepImprovementCommonReducerError(
          'impossible-status-transition',
          'A projection accepts exactly one run-started event',
          'run.initializationEventId',
        );
      }
      return {
        runId: payload.scope.runId,
        lineageId: payload.scope.lineageId,
        variant: payload.scope.variant,
        generation: payload.data.generation,
        charterDigest: payload.data.charterDigest,
        configDigest: payload.data.configDigest,
        operatorRef: payload.data.operatorRef,
        serviceContractVersion: payload.data.serviceContractVersion,
        replayFingerprint: payload.data.replayFingerprint,
        maxIterations: payload.data.maxIterations,
        initializationEventId: event.event_id,
        state: 'active',
      };
    }
    case 'deep_improvement_common.run_resumed': {
      const payload = payloadFor(event, 'deep_improvement_common.run_resumed');
      if (state.run.state !== 'paused'
        || payload.data.generation <= state.run.generation) {
        throw new DeepImprovementCommonReducerError(
          'impossible-status-transition',
          'Only a paused run can resume into a strictly newer generation',
          'run.state',
        );
      }
      return { ...state.run, generation: payload.data.generation, state: 'active' };
    }
    case 'deep_improvement_common.run_paused':
      if (state.run.state !== 'active') {
        throw new DeepImprovementCommonReducerError(
          'impossible-status-transition',
          'Only an active run can be paused',
          'run.state',
        );
      }
      return { ...state.run, state: 'paused' };
    case 'deep_improvement_common.run_completed':
      if (state.run.state !== 'active' && state.run.state !== 'paused') {
        throw new DeepImprovementCommonReducerError(
          'impossible-status-transition',
          'Only a live run can record terminal completion',
          'run.state',
        );
      }
      return { ...state.run, state: 'completed' };
    case 'deep_improvement_common.run_aborted':
      if (state.run.state !== 'active' && state.run.state !== 'paused') {
        throw new DeepImprovementCommonReducerError(
          'impossible-status-transition',
          'Only a live run can be aborted',
          'run.state',
        );
      }
      return { ...state.run, state: 'aborted' };
    case 'deep_improvement_common.run_quarantined':
      if (state.run.state !== 'active' && state.run.state !== 'paused') {
        throw new DeepImprovementCommonReducerError(
          'impossible-status-transition',
          'Only a live run can be quarantined',
          'run.state',
        );
      }
      return { ...state.run, state: 'quarantined' };
    default:
      return state.run;
  }
}

function foldCandidate(
  state: DeepImprovementCommonProjectionState,
  event: DeepImprovementCommonLedgerEvent,
): Pick<DeepImprovementCommonProjectionState, 'artifactIndex' | 'iterationConvergence'> {
  let artifactIndex = state.artifactIndex;
  let iterationConvergence = state.iterationConvergence;
  const candidateId = scopeCandidateId(event);
  if (candidateId === null) return { artifactIndex, iterationConvergence };

  switch (event.payload.stem) {
    case 'deep_improvement_common.candidate_proposed': {
      const payload = payloadFor(event, 'deep_improvement_common.candidate_proposed');
      if (artifactIndex.candidates.some((entry) => entry.candidateId === candidateId)) {
        throw new DeepImprovementCommonReducerError(
          'impossible-status-transition',
          'A candidate identity accepts exactly one proposal',
          'artifactIndex.candidates',
        );
      }
      if (payload.data.parentCandidateId !== null
        && !artifactIndex.candidates.some(
          (entry) => entry.candidateId === payload.data.parentCandidateId,
        )) {
        throw new DeepImprovementCommonReducerError(
          'referential-integrity',
          'Candidate lineage cannot name a parent absent from the folded ledger',
          'payload.data.parentCandidateId',
        );
      }
      const candidate: DeepImprovementCommonCandidateRecord = {
        candidateId,
        parentCandidateId: payload.data.parentCandidateId,
        proposalRef: payload.data.proposalRef,
        proposalDigest: payload.data.proposalDigest,
        targetRef: payload.data.targetRef,
        targetDigest: payload.data.targetDigest,
        mutationOperatorRef: payload.data.mutationOperatorRef,
        mutationOperatorVersion: payload.data.mutationOperatorVersion,
        proposalPolicyVersion: payload.data.proposalPolicyVersion,
        proposalEventId: event.event_id,
        candidateArtifactRef: null,
        candidateArtifactDigest: null,
        generationReceiptRef: null,
        generatedEventId: null,
        activeProfileRef: null,
      };
      let artifacts = insertArtifact(artifactIndex.artifacts, {
        logicalArtifactId: `proposal:${candidateId}`,
        artifactKind: 'proposal',
        reference: payload.data.proposalRef,
        digest: payload.data.proposalDigest,
        producerEventId: event.event_id,
        candidateId,
        evaluationEpochId: null,
        availability: 'available',
        receiptRefs: [],
      });
      artifactIndex = {
        ...artifactIndex,
        candidates: replaceCandidateRecord(artifactIndex.candidates, candidate),
        artifacts,
      };
      iterationConvergence = {
        ...iterationConvergence,
        currentIteration: iterationConvergence.currentIteration + 1,
        candidates: replaceCandidateProgress(iterationConvergence.candidates, {
          candidateId,
          stage: 'proposed',
          proposalEventId: event.event_id,
          generatedEventId: null,
          terminalEventId: null,
        }),
      };
      return { artifactIndex, iterationConvergence };
    }
    case 'deep_improvement_common.candidate_generated': {
      const payload = payloadFor(event, 'deep_improvement_common.candidate_generated');
      const progress = candidateProgress(state, candidateId);
      const record = candidateRecord(state, candidateId);
      if (progress.stage !== 'proposed') {
        throw new DeepImprovementCommonReducerError(
          'impossible-status-transition',
          'Only a proposed candidate can become generated',
          'iterationConvergence.candidates.stage',
        );
      }
      requireSeenEvent(
        state,
        payload.data.proposalEventId,
        ['deep_improvement_common.candidate_proposed'],
        payload.data.proposalPayloadDigest,
        candidateId,
      );
      const nextRecord: DeepImprovementCommonCandidateRecord = {
        ...record,
        candidateArtifactRef: payload.data.candidateArtifactRef,
        candidateArtifactDigest: payload.data.candidateArtifactDigest,
        generationReceiptRef: payload.data.generationReceiptRef,
        generatedEventId: event.event_id,
      };
      const artifacts = insertArtifact(artifactIndex.artifacts, {
        logicalArtifactId: `candidate:${candidateId}`,
        artifactKind: 'candidate',
        reference: payload.data.candidateArtifactRef,
        digest: payload.data.candidateArtifactDigest,
        producerEventId: event.event_id,
        candidateId,
        evaluationEpochId: null,
        availability: 'available',
        receiptRefs: [payload.data.generationReceiptRef],
      });
      artifactIndex = {
        ...artifactIndex,
        candidates: replaceCandidateRecord(artifactIndex.candidates, nextRecord),
        artifacts,
      };
      iterationConvergence = {
        ...iterationConvergence,
        candidates: replaceCandidateProgress(iterationConvergence.candidates, {
          ...progress,
          stage: 'generated',
          generatedEventId: event.event_id,
        }),
      };
      return { artifactIndex, iterationConvergence };
    }
    case 'deep_improvement_common.candidate_rejected': {
      const payload = payloadFor(event, 'deep_improvement_common.candidate_rejected');
      const progress = candidateProgress(state, candidateId);
      if (progress.stage === 'rejected') {
        throw new DeepImprovementCommonReducerError(
          'impossible-status-transition',
          'A rejected candidate cannot be rejected again',
          'iterationConvergence.candidates.stage',
        );
      }
      requireSeenEvent(
        state,
        payload.data.candidateEventId,
        [
          'deep_improvement_common.candidate_proposed',
          'deep_improvement_common.candidate_generated',
        ],
        payload.data.candidatePayloadDigest,
        candidateId,
      );
      iterationConvergence = {
        ...iterationConvergence,
        unresolvedEvidenceRefs: sortStrings([
          ...iterationConvergence.unresolvedEvidenceRefs,
          ...payload.data.evidenceRefs,
        ]),
        candidates: replaceCandidateProgress(iterationConvergence.candidates, {
          ...progress,
          stage: 'rejected',
          terminalEventId: event.event_id,
        }),
      };
      return { artifactIndex, iterationConvergence };
    }
    case 'deep_improvement_common.candidate_lineage_attached': {
      const payload = payloadFor(
        event,
        'deep_improvement_common.candidate_lineage_attached',
      );
      const record = candidateRecord(state, candidateId);
      if (!artifactIndex.candidates.some(
        (entry) => entry.candidateId === payload.data.parentCandidateId,
      )) {
        throw new DeepImprovementCommonReducerError(
          'referential-integrity',
          'A lineage edge cannot reference a parent absent from the folded ledger',
          'payload.data.parentCandidateId',
        );
      }
      artifactIndex = {
        ...artifactIndex,
        candidates: replaceCandidateRecord(artifactIndex.candidates, {
          ...record,
          parentCandidateId: payload.data.parentCandidateId,
        }),
      };
      return { artifactIndex, iterationConvergence };
    }
    default:
      return { artifactIndex, iterationConvergence };
  }
}

function foldEvaluation(
  state: DeepImprovementCommonProjectionState,
  event: DeepImprovementCommonLedgerEvent,
): Pick<DeepImprovementCommonProjectionState, 'artifactIndex' | 'iterationConvergence'> {
  let artifactIndex = state.artifactIndex;
  let iterationConvergence = state.iterationConvergence;
  const candidateId = scopeCandidateId(event);
  const evaluationEpochId = scopeEvaluationEpochId(event);
  if (candidateId === null || evaluationEpochId === null) {
    return { artifactIndex, iterationConvergence };
  }

  switch (event.payload.stem) {
    case 'deep_improvement_common.evaluation_epoch_sealed': {
      const payload = payloadFor(
        event,
        'deep_improvement_common.evaluation_epoch_sealed',
      );
      const progress = candidateProgress(state, candidateId);
      const record = candidateRecord(state, candidateId);
      if (progress.stage !== 'generated'
        && progress.stage !== 'scored'
        && progress.stage !== 'verified') {
        throw new DeepImprovementCommonReducerError(
          'impossible-status-transition',
          'Evaluator epochs can only bind generated or previously scored candidates',
          'iterationConvergence.candidates.stage',
        );
      }
      if (iterationConvergence.evaluatorEpochs.some(
        (epoch) => epoch.evaluationEpochId === evaluationEpochId,
      )) {
        throw new DeepImprovementCommonReducerError(
          'impossible-status-transition',
          'An evaluator epoch identity accepts exactly one sealed capsule',
          'iterationConvergence.evaluatorEpochs',
        );
      }
      const evaluatorEpochs = [...iterationConvergence.evaluatorEpochs, {
        evaluationEpochId,
        candidateId,
        evaluatorRef: payload.data.evaluatorRef,
        evaluatorCapsuleDigest: payload.data.evaluatorCapsuleDigest,
        fixtureSetRef: payload.data.fixtureSetRef,
        fixtureSetDigest: payload.data.fixtureSetDigest,
        scorePolicyVersion: payload.data.scorePolicyVersion,
        scoreWriteBackendRef: payload.data.scoreWriteBackendRef,
        evaluationBudgetRef: payload.data.evaluationBudgetRef,
        sealedEventId: event.event_id,
        startedEventId: null,
      }];
      evaluatorEpochs.sort((left, right) => (
        compareString(left.evaluationEpochId, right.evaluationEpochId)
      ));
      artifactIndex = {
        ...artifactIndex,
        candidates: replaceCandidateRecord(artifactIndex.candidates, {
          ...record,
          activeProfileRef: payload.data.fixtureSetRef,
        }),
      };
      iterationConvergence = {
        ...iterationConvergence,
        evaluatorEpochs,
        evaluationBudgetRefs: sortStrings([
          ...iterationConvergence.evaluationBudgetRefs,
          payload.data.evaluationBudgetRef,
        ]),
        candidates: replaceCandidateProgress(iterationConvergence.candidates, {
          ...progress,
          stage: 'evaluating',
        }),
      };
      return { artifactIndex, iterationConvergence };
    }
    case 'deep_improvement_common.evaluation_started': {
      const payload = payloadFor(event, 'deep_improvement_common.evaluation_started');
      const epoch = iterationConvergence.evaluatorEpochs.find(
        (entry) => entry.evaluationEpochId === evaluationEpochId,
      );
      if (epoch === undefined || epoch.startedEventId !== null) {
        throw new DeepImprovementCommonReducerError(
          'impossible-status-transition',
          'An evaluation must start exactly once after its epoch is sealed',
          'iterationConvergence.evaluatorEpochs.startedEventId',
        );
      }
      requireSeenEvent(
        state,
        payload.data.epochSealedEventId,
        ['deep_improvement_common.evaluation_epoch_sealed'],
        payload.data.epochPayloadDigest,
        candidateId,
      );
      const evaluatorEpochs = iterationConvergence.evaluatorEpochs.map((entry) => (
        entry.evaluationEpochId === evaluationEpochId
          ? { ...entry, startedEventId: event.event_id }
          : entry
      ));
      iterationConvergence = { ...iterationConvergence, evaluatorEpochs };
      return { artifactIndex, iterationConvergence };
    }
    case 'deep_improvement_common.evaluation_observation_recorded': {
      const payload = payloadFor(
        event,
        'deep_improvement_common.evaluation_observation_recorded',
      );
      requireSeenEvent(
        state,
        payload.data.evaluationStartedEventId,
        ['deep_improvement_common.evaluation_started'],
        undefined,
        candidateId,
      );
      const observation = {
        candidateId,
        evaluationEpochId,
        fixtureId: payload.scope.fixtureId,
        observationId: payload.scope.observationId,
        evaluatorRef: payload.data.evaluatorRef,
        fixtureRef: payload.data.fixtureRef,
        rawObservationRef: payload.data.rawObservationRef,
        rawObservationDigest: payload.data.rawObservationDigest,
        executionReceiptRef: payload.data.executionReceiptRef,
        observationOutcome: payload.data.observationOutcome,
        producerEventId: event.event_id,
      };
      if (artifactIndex.rawObservations.some(
        (entry) => entry.observationId === observation.observationId,
      )) {
        throw new DeepImprovementCommonReducerError(
          'impossible-status-transition',
          'An observation identity accepts exactly one raw observation',
          'artifactIndex.rawObservations',
        );
      }
      const rawObservations = [...artifactIndex.rawObservations, observation];
      rawObservations.sort((left, right) => (
        compareString(left.evaluationEpochId, right.evaluationEpochId)
          || compareString(left.fixtureId, right.fixtureId)
          || compareString(left.observationId, right.observationId)
      ));
      const artifacts = insertArtifact(artifactIndex.artifacts, {
        logicalArtifactId: `raw-observation:${evaluationEpochId}:${payload.scope.fixtureId}`,
        artifactKind: 'raw-observation',
        reference: payload.data.rawObservationRef,
        digest: payload.data.rawObservationDigest,
        producerEventId: event.event_id,
        candidateId,
        evaluationEpochId,
        availability: 'available',
        receiptRefs: [payload.data.executionReceiptRef],
      });
      artifactIndex = { ...artifactIndex, rawObservations, artifacts };
      return { artifactIndex, iterationConvergence };
    }
    case 'deep_improvement_common.evaluation_normalized': {
      const payload = payloadFor(
        event,
        'deep_improvement_common.evaluation_normalized',
      );
      const progress = candidateProgress(state, candidateId);
      if (payload.data.scoreWriteBackendRef
        !== DEEP_IMPROVEMENT_COMMON_SCORE_WRITE_BACKEND_REF) {
        throw new DeepImprovementCommonReducerError(
          'event-schema-invalid',
          'Normalized scores must use the pinned score-write backend',
          'payload.data.scoreWriteBackendRef',
        );
      }
      for (const observationEventId of payload.data.observationEventIds) {
        const observation = requireSeenEvent(
          state,
          observationEventId,
          ['deep_improvement_common.evaluation_observation_recorded'],
          undefined,
          candidateId,
        );
        if (observation.evaluationEpochId !== evaluationEpochId) {
          throw new DeepImprovementCommonReducerError(
            'referential-integrity',
            'Normalized scores cannot mix observations across evaluator epochs',
            'payload.data.observationEventIds',
          );
        }
      }
      const score = {
        candidateId,
        evaluationEpochId,
        observationEventIds: sortStrings(payload.data.observationEventIds),
        observationSetDigest: payload.data.observationSetDigest,
        scorePolicyVersion: payload.data.scorePolicyVersion,
        scorerFingerprint: payload.data.scorerFingerprint,
        scoreWriteBackendRef: payload.data.scoreWriteBackendRef,
        scoreVector: payload.data.scoreVector,
        normalizationReceiptRef: payload.data.normalizationReceiptRef,
        producerEventId: event.event_id,
      };
      const derivedScores = [...artifactIndex.derivedScores, score];
      derivedScores.sort((left, right) => (
        compareString(left.evaluationEpochId, right.evaluationEpochId)
          || compareString(left.scorePolicyVersion, right.scorePolicyVersion)
          || compareString(left.producerEventId, right.producerEventId)
      ));
      const artifacts = insertArtifact(artifactIndex.artifacts, {
        logicalArtifactId: `normalized-score:${evaluationEpochId}`,
        artifactKind: 'normalized-score',
        reference: payload.data.normalizationReceiptRef,
        digest: payload.data.observationSetDigest,
        producerEventId: event.event_id,
        candidateId,
        evaluationEpochId,
        availability: 'available',
        receiptRefs: [payload.data.normalizationReceiptRef],
      });
      artifactIndex = { ...artifactIndex, derivedScores, artifacts };
      iterationConvergence = {
        ...iterationConvergence,
        candidates: replaceCandidateProgress(iterationConvergence.candidates, {
          ...progress,
          stage: 'scored',
        }),
      };
      return { artifactIndex, iterationConvergence };
    }
    case 'deep_improvement_common.evaluation_verification_requested': {
      const payload = payloadFor(
        event,
        'deep_improvement_common.evaluation_verification_requested',
      );
      requireSeenEvent(
        state,
        payload.data.normalizedEventId,
        ['deep_improvement_common.evaluation_normalized'],
        payload.data.normalizedPayloadDigest,
        candidateId,
      );
      return { artifactIndex, iterationConvergence };
    }
    case 'deep_improvement_common.evaluation_verification_recorded': {
      const payload = payloadFor(
        event,
        'deep_improvement_common.evaluation_verification_recorded',
      );
      requireSeenEvent(
        state,
        payload.data.requestEventId,
        ['deep_improvement_common.evaluation_verification_requested'],
        undefined,
        candidateId,
      );
      const progress = candidateProgress(state, candidateId);
      let hardVetoes = iterationConvergence.hardVetoes;
      let unresolvedEvidenceRefs = iterationConvergence.unresolvedEvidenceRefs;
      if (payload.data.verificationOutcome === 'disputed') {
        hardVetoes = addHardVeto(hardVetoes, {
          candidateId,
          vetoCode: 'verification-disputed',
          source: 'verification',
          evidenceRef: payload.data.verificationEvidenceRef,
          evidenceDigest: payload.data.verificationEvidenceDigest,
          producerEventId: event.event_id,
        });
      } else if (payload.data.verificationOutcome === 'inconclusive') {
        unresolvedEvidenceRefs = sortStrings([
          ...unresolvedEvidenceRefs,
          payload.data.verificationEvidenceRef,
        ]);
      }
      const artifacts = insertArtifact(artifactIndex.artifacts, {
        logicalArtifactId: `verification:${evaluationEpochId}`,
        artifactKind: 'verification',
        reference: payload.data.verificationEvidenceRef,
        digest: payload.data.verificationEvidenceDigest,
        producerEventId: event.event_id,
        candidateId,
        evaluationEpochId,
        availability: payload.data.verificationOutcome === 'confirmed'
          ? 'available'
          : 'invalid',
        receiptRefs: [payload.data.verificationReceiptRef],
      });
      artifactIndex = { ...artifactIndex, artifacts };
      iterationConvergence = {
        ...iterationConvergence,
        hardVetoes,
        unresolvedEvidenceRefs,
        candidates: replaceCandidateProgress(iterationConvergence.candidates, {
          ...progress,
          stage: payload.data.verificationOutcome === 'confirmed'
            ? 'verified'
            : payload.data.verificationOutcome === 'inconclusive'
              ? 'inconclusive'
              : 'failed',
          terminalEventId: payload.data.verificationOutcome === 'confirmed'
            ? progress.terminalEventId
            : event.event_id,
        }),
        convergenceDisposition: payload.data.verificationOutcome === 'confirmed'
          ? iterationConvergence.convergenceDisposition
          : payload.data.verificationOutcome === 'inconclusive'
            ? 'inconclusive'
            : 'blocked',
      };
      return { artifactIndex, iterationConvergence };
    }
    case 'deep_improvement_common.evaluation_inconclusive': {
      const payload = payloadFor(
        event,
        'deep_improvement_common.evaluation_inconclusive',
      );
      payload.data.relatedEventIds.forEach((eventId) => {
        requireSeenEvent(state, eventId, [
          'deep_improvement_common.evaluation_observation_recorded',
          'deep_improvement_common.evaluation_normalized',
          'deep_improvement_common.evaluation_verification_requested',
          'deep_improvement_common.evaluation_verification_recorded',
        ], undefined, candidateId);
      });
      const progress = candidateProgress(state, candidateId);
      iterationConvergence = {
        ...iterationConvergence,
        unresolvedEvidenceRefs: sortStrings([
          ...iterationConvergence.unresolvedEvidenceRefs,
          ...payload.data.evidenceRefs,
        ]),
        hardVetoes: addHardVeto(iterationConvergence.hardVetoes, {
          candidateId,
          vetoCode: payload.data.reasonCode,
          source: 'evaluator-integrity',
          evidenceRef: payload.data.evidenceRefs[0] ?? 'evidence:inconclusive',
          evidenceDigest: payload.data.evidenceSetDigest,
          producerEventId: event.event_id,
        }),
        candidates: replaceCandidateProgress(iterationConvergence.candidates, {
          ...progress,
          stage: 'inconclusive',
          terminalEventId: event.event_id,
        }),
        convergenceDisposition: 'inconclusive',
      };
      return { artifactIndex, iterationConvergence };
    }
    case 'deep_improvement_common.evaluation_failed': {
      const payload = payloadFor(event, 'deep_improvement_common.evaluation_failed');
      requireSeenEvent(state, payload.data.failedEventId, [
        'deep_improvement_common.evaluation_epoch_sealed',
        'deep_improvement_common.evaluation_started',
        'deep_improvement_common.evaluation_observation_recorded',
        'deep_improvement_common.evaluation_normalized',
        'deep_improvement_common.evaluation_verification_requested',
      ], undefined, candidateId);
      const progress = candidateProgress(state, candidateId);
      iterationConvergence = {
        ...iterationConvergence,
        hardVetoes: addHardVeto(iterationConvergence.hardVetoes, {
          candidateId,
          vetoCode: payload.data.reasonCode,
          source: 'evaluator-integrity',
          evidenceRef: payload.data.failureReceiptRef,
          evidenceDigest: event.payload.payloadDigest,
          producerEventId: event.event_id,
        }),
        candidates: replaceCandidateProgress(iterationConvergence.candidates, {
          ...progress,
          stage: 'failed',
          terminalEventId: event.event_id,
        }),
        convergenceDisposition: 'blocked',
      };
      return { artifactIndex, iterationConvergence };
    }
    default:
      return { artifactIndex, iterationConvergence };
  }
}

// ───────────────────────────────────────────────────────────────────
// 5. CANARY AND PROMOTION FOLDS
// ───────────────────────────────────────────────────────────────────

function currentCanary(
  state: DeepImprovementCommonProjectionState,
  candidateId: string,
  canaryEpochId: string,
  canarySuiteId: string,
): DeepImprovementCommonCanaryRecord {
  const canary = state.iterationConvergence.canaries.find((entry) => (
    entry.candidateId === candidateId
    && entry.canaryEpochId === canaryEpochId
    && entry.canarySuiteId === canarySuiteId
  ));
  if (canary === undefined) {
    throw new DeepImprovementCommonReducerError(
      'referential-integrity',
      'Canary events require a captured sealed suite',
      'iterationConvergence.canaries',
    );
  }
  return canary;
}

function foldCanary(
  state: DeepImprovementCommonProjectionState,
  event: DeepImprovementCommonLedgerEvent,
): Pick<DeepImprovementCommonProjectionState, 'artifactIndex' | 'iterationConvergence'> {
  let artifactIndex = state.artifactIndex;
  let iterationConvergence = state.iterationConvergence;
  const candidateId = scopeCandidateId(event);
  const canaryEpochId = scopeCanaryEpochId(event);
  if (candidateId === null || canaryEpochId === null
    || !('canarySuiteId' in event.payload.scope)) {
    return { artifactIndex, iterationConvergence };
  }
  const canarySuiteId = String(event.payload.scope.canarySuiteId);

  switch (event.payload.stem) {
    case 'deep_improvement_common.canary_suite_sealed': {
      const payload = payloadFor(event, 'deep_improvement_common.canary_suite_sealed');
      candidateProgress(state, candidateId);
      if (!state.artifactIndex.derivedScores.some(
        (score) => score.candidateId === candidateId,
      )) {
        throw new DeepImprovementCommonReducerError(
          'impossible-status-transition',
          'Canary suites require retained derived score evidence',
          'artifactIndex.derivedScores',
        );
      }
      if (iterationConvergence.canaries.some((entry) => (
        entry.canaryEpochId === canaryEpochId
        && entry.canarySuiteId === canarySuiteId
      ))) {
        throw new DeepImprovementCommonReducerError(
          'impossible-status-transition',
          'A canary suite identity accepts exactly one sealed event',
          'iterationConvergence.canaries',
        );
      }
      iterationConvergence = {
        ...iterationConvergence,
        canaries: replaceCanary(iterationConvergence.canaries, {
          candidateId,
          canaryEpochId,
          canarySuiteId,
          stage: 'sealed',
          suiteEventId: event.event_id,
          executionEventIds: [],
          gateEventId: null,
        }),
      };
      const artifacts = insertArtifact(artifactIndex.artifacts, {
        logicalArtifactId: `canary-suite:${canaryEpochId}:${canarySuiteId}`,
        artifactKind: 'canary-suite',
        reference: payload.data.suiteRef,
        digest: payload.data.suiteDigest,
        producerEventId: event.event_id,
        candidateId,
        evaluationEpochId: null,
        availability: 'available',
        receiptRefs: [],
      });
      artifactIndex = { ...artifactIndex, artifacts };
      return { artifactIndex, iterationConvergence };
    }
    case 'deep_improvement_common.canary_executed': {
      const payload = payloadFor(event, 'deep_improvement_common.canary_executed');
      const canary = currentCanary(
        state,
        candidateId,
        canaryEpochId,
        canarySuiteId,
      );
      if (canary.stage !== 'sealed' && canary.stage !== 'executed') {
        throw new DeepImprovementCommonReducerError(
          'impossible-status-transition',
          'Canary execution requires a live sealed suite',
          'iterationConvergence.canaries.stage',
        );
      }
      requireSeenEvent(
        state,
        payload.data.suiteSealedEventId,
        ['deep_improvement_common.canary_suite_sealed'],
        payload.data.suitePayloadDigest,
        candidateId,
      );
      iterationConvergence = {
        ...iterationConvergence,
        canaries: replaceCanary(iterationConvergence.canaries, {
          ...canary,
          stage: 'executed',
          executionEventIds: sortStrings([
            ...canary.executionEventIds,
            event.event_id,
          ]),
        }),
      };
      const artifacts = insertArtifact(artifactIndex.artifacts, {
        logicalArtifactId: `canary-observation:${canaryEpochId}:${canarySuiteId}`,
        artifactKind: 'canary-observation',
        reference: payload.data.canaryObservationRef,
        digest: payload.data.canaryObservationDigest,
        producerEventId: event.event_id,
        candidateId,
        evaluationEpochId: null,
        availability: payload.data.outcome === 'pass' ? 'available' : 'invalid',
        receiptRefs: [payload.data.executionReceiptRef],
      });
      artifactIndex = { ...artifactIndex, artifacts };
      return { artifactIndex, iterationConvergence };
    }
    case 'deep_improvement_common.canary_leak_detected': {
      const payload = payloadFor(event, 'deep_improvement_common.canary_leak_detected');
      requireSeenEvent(
        state,
        payload.data.executionEventId,
        ['deep_improvement_common.canary_executed'],
        undefined,
        candidateId,
      );
      iterationConvergence = {
        ...iterationConvergence,
        hardVetoes: addHardVeto(iterationConvergence.hardVetoes, {
          candidateId,
          vetoCode: payload.data.reasonCode,
          source: 'canary',
          evidenceRef: payload.data.leakEvidenceRef,
          evidenceDigest: payload.data.leakEvidenceDigest,
          producerEventId: event.event_id,
        }),
        convergenceDisposition: 'blocked',
      };
      return { artifactIndex, iterationConvergence };
    }
    case 'deep_improvement_common.canary_drift_detected': {
      const payload = payloadFor(event, 'deep_improvement_common.canary_drift_detected');
      requireSeenEvent(
        state,
        payload.data.executionEventId,
        ['deep_improvement_common.canary_executed'],
        undefined,
        candidateId,
      );
      iterationConvergence = {
        ...iterationConvergence,
        hardVetoes: addHardVeto(iterationConvergence.hardVetoes, {
          candidateId,
          vetoCode: 'canary-drift',
          source: 'canary',
          evidenceRef: payload.data.driftEvidenceRef,
          evidenceDigest: payload.data.driftEvidenceDigest,
          producerEventId: event.event_id,
        }),
        convergenceDisposition: 'blocked',
      };
      return { artifactIndex, iterationConvergence };
    }
    case 'deep_improvement_common.canary_invariant_failed': {
      const payload = payloadFor(
        event,
        'deep_improvement_common.canary_invariant_failed',
      );
      requireSeenEvent(
        state,
        payload.data.executionEventId,
        ['deep_improvement_common.canary_executed'],
        undefined,
        candidateId,
      );
      iterationConvergence = {
        ...iterationConvergence,
        hardVetoes: addHardVeto(iterationConvergence.hardVetoes, {
          candidateId,
          vetoCode: payload.data.reasonCode,
          source: 'canary',
          evidenceRef: payload.data.evidenceRef,
          evidenceDigest: payload.data.evidenceDigest,
          producerEventId: event.event_id,
        }),
        convergenceDisposition: 'blocked',
      };
      return { artifactIndex, iterationConvergence };
    }
    case 'deep_improvement_common.canary_gate_passed': {
      const payload = payloadFor(event, 'deep_improvement_common.canary_gate_passed');
      const canary = currentCanary(
        state,
        candidateId,
        canaryEpochId,
        canarySuiteId,
      );
      payload.data.executionEventIds.forEach((eventId) => {
        requireSeenEvent(
          state,
          eventId,
          ['deep_improvement_common.canary_executed'],
          undefined,
          candidateId,
        );
      });
      if (candidateVetoes(state, candidateId).length > 0) {
        throw new DeepImprovementCommonReducerError(
          'impossible-status-transition',
          'A hard veto cannot be cleared by a canary gate aggregate',
          'iterationConvergence.hardVetoes',
        );
      }
      iterationConvergence = {
        ...iterationConvergence,
        canaries: replaceCanary(iterationConvergence.canaries, {
          ...canary,
          stage: 'passed',
          gateEventId: event.event_id,
        }),
      };
      return { artifactIndex, iterationConvergence };
    }
    case 'deep_improvement_common.canary_gate_failed': {
      const payload = payloadFor(event, 'deep_improvement_common.canary_gate_failed');
      const canary = currentCanary(
        state,
        candidateId,
        canaryEpochId,
        canarySuiteId,
      );
      payload.data.executionEventIds.forEach((eventId) => {
        requireSeenEvent(
          state,
          eventId,
          ['deep_improvement_common.canary_executed'],
          undefined,
          candidateId,
        );
      });
      let hardVetoes = iterationConvergence.hardVetoes;
      for (const failureClass of payload.data.failureClasses) {
        hardVetoes = addHardVeto(hardVetoes, {
          candidateId,
          vetoCode: failureClass,
          source: 'canary',
          evidenceRef: payload.data.decisionReceiptRef,
          evidenceDigest: payload.data.evidenceSetDigest,
          producerEventId: event.event_id,
        });
      }
      iterationConvergence = {
        ...iterationConvergence,
        hardVetoes,
        canaries: replaceCanary(iterationConvergence.canaries, {
          ...canary,
          stage: 'failed',
          gateEventId: event.event_id,
        }),
        convergenceDisposition: 'blocked',
      };
      return { artifactIndex, iterationConvergence };
    }
    case 'deep_improvement_common.canary_vetoed': {
      const payload = payloadFor(event, 'deep_improvement_common.canary_vetoed');
      const canary = currentCanary(
        state,
        candidateId,
        canaryEpochId,
        canarySuiteId,
      );
      requireSeenEvent(
        state,
        payload.data.gateEventId,
        [
          'deep_improvement_common.canary_gate_failed',
          'deep_improvement_common.canary_gate_passed',
        ],
        payload.data.gatePayloadDigest,
        candidateId,
      );
      iterationConvergence = {
        ...iterationConvergence,
        hardVetoes: addHardVeto(iterationConvergence.hardVetoes, {
          candidateId,
          vetoCode: payload.data.vetoReasonCode,
          source: 'canary',
          evidenceRef: payload.data.vetoEvidenceRef,
          evidenceDigest: payload.data.vetoEvidenceDigest,
          producerEventId: event.event_id,
        }),
        canaries: replaceCanary(iterationConvergence.canaries, {
          ...canary,
          stage: 'vetoed',
          gateEventId: payload.data.gateEventId,
        }),
        convergenceDisposition: 'quarantined',
      };
      return { artifactIndex, iterationConvergence };
    }
    default:
      return { artifactIndex, iterationConvergence };
  }
}

function currentPromotion(
  state: DeepImprovementCommonProjectionState,
  promotionId: string,
): DeepImprovementCommonPromotionRecord {
  const promotion = state.iterationConvergence.promotions.find(
    (entry) => entry.promotionId === promotionId,
  );
  if (promotion === undefined) {
    throw new DeepImprovementCommonReducerError(
      'referential-integrity',
      'Promotion events require a captured promotion proposal',
      'iterationConvergence.promotions',
    );
  }
  return promotion;
}

function foldPromotion(
  state: DeepImprovementCommonProjectionState,
  event: DeepImprovementCommonLedgerEvent,
): Pick<DeepImprovementCommonProjectionState, 'artifactIndex' | 'iterationConvergence'> {
  let artifactIndex = state.artifactIndex;
  let iterationConvergence = state.iterationConvergence;
  const candidateId = scopeCandidateId(event);
  const promotionId = scopePromotionId(event);
  if (candidateId === null || promotionId === null
    || !('baselineId' in event.payload.scope)) {
    return { artifactIndex, iterationConvergence };
  }
  const baselineId = String(event.payload.scope.baselineId);

  switch (event.payload.stem) {
    case 'deep_improvement_common.promotion_proposed': {
      const payload = payloadFor(event, 'deep_improvement_common.promotion_proposed');
      if (iterationConvergence.promotions.some(
        (entry) => entry.promotionId === promotionId,
      )) {
        throw new DeepImprovementCommonReducerError(
          'impossible-status-transition',
          'A promotion identity accepts exactly one proposal',
          'iterationConvergence.promotions',
        );
      }
      requireSeenEvent(
        state,
        payload.data.normalizedEventId,
        ['deep_improvement_common.evaluation_normalized'],
        payload.data.normalizedPayloadDigest,
        candidateId,
      );
      requireSeenEvent(
        state,
        payload.data.canaryGateEventId,
        ['deep_improvement_common.canary_gate_passed'],
        payload.data.canaryGatePayloadDigest,
        candidateId,
      );
      if (candidateVetoes(state, candidateId).length > 0) {
        throw new DeepImprovementCommonReducerError(
          'impossible-status-transition',
          'A hard veto blocks promotion regardless of aggregate score',
          'iterationConvergence.hardVetoes',
        );
      }
      iterationConvergence = {
        ...iterationConvergence,
        promotions: replacePromotion(iterationConvergence.promotions, {
          promotionId,
          candidateId,
          baselineId,
          stage: 'proposed',
          requestedRollout: payload.data.requestedRollout,
          proposalEventId: event.event_id,
          authorizationEventId: null,
          rolloutEventIds: [],
          terminalEventId: null,
        }),
      };
      return { artifactIndex, iterationConvergence };
    }
    case 'deep_improvement_common.promotion_authorized': {
      const payload = payloadFor(event, 'deep_improvement_common.promotion_authorized');
      const promotion = currentPromotion(state, promotionId);
      if (promotion.stage !== 'proposed') {
        throw new DeepImprovementCommonReducerError(
          'impossible-status-transition',
          'Only a proposed promotion can be authorized',
          'iterationConvergence.promotions.stage',
        );
      }
      requireSeenEvent(
        state,
        payload.data.proposalEventId,
        ['deep_improvement_common.promotion_proposed'],
        payload.data.proposalPayloadDigest,
        candidateId,
      );
      if (candidateVetoes(state, candidateId).length > 0) {
        throw new DeepImprovementCommonReducerError(
          'impossible-status-transition',
          'External authorization cannot override a hard veto',
          'iterationConvergence.hardVetoes',
        );
      }
      iterationConvergence = {
        ...iterationConvergence,
        promotions: replacePromotion(iterationConvergence.promotions, {
          ...promotion,
          stage: 'authorized',
          authorizationEventId: event.event_id,
        }),
      };
      const artifacts = insertArtifact(artifactIndex.artifacts, {
        logicalArtifactId: `promotion-authorization:${promotionId}`,
        artifactKind: 'promotion-receipt',
        reference: payload.data.authorizationReceiptRef,
        digest: payload.data.externalAuthorizationDigest,
        producerEventId: event.event_id,
        candidateId,
        evaluationEpochId: null,
        availability: 'available',
        receiptRefs: [payload.data.authorizationReceiptRef],
      });
      artifactIndex = { ...artifactIndex, artifacts };
      return { artifactIndex, iterationConvergence };
    }
    case 'deep_improvement_common.promotion_denied': {
      const payload = payloadFor(event, 'deep_improvement_common.promotion_denied');
      const promotion = currentPromotion(state, promotionId);
      if (promotion.stage !== 'proposed') {
        throw new DeepImprovementCommonReducerError(
          'impossible-status-transition',
          'Only a proposed promotion can be denied',
          'iterationConvergence.promotions.stage',
        );
      }
      requireSeenEvent(
        state,
        payload.data.proposalEventId,
        ['deep_improvement_common.promotion_proposed'],
        payload.data.proposalPayloadDigest,
        candidateId,
      );
      iterationConvergence = {
        ...iterationConvergence,
        promotions: replacePromotion(iterationConvergence.promotions, {
          ...promotion,
          stage: 'denied',
          terminalEventId: event.event_id,
        }),
      };
      const artifacts = insertArtifact(artifactIndex.artifacts, {
        logicalArtifactId: `promotion-decision:${promotionId}`,
        artifactKind: 'promotion-receipt',
        reference: payload.data.decisionReceiptRef,
        digest: payload.data.externalDecisionDigest,
        producerEventId: event.event_id,
        candidateId,
        evaluationEpochId: null,
        availability: 'invalid',
        receiptRefs: [payload.data.decisionReceiptRef],
      });
      artifactIndex = { ...artifactIndex, artifacts };
      return { artifactIndex, iterationConvergence };
    }
    case 'deep_improvement_common.promotion_shadow_started':
    case 'deep_improvement_common.promotion_canary_started': {
      const payload = event.payload.stem
        === 'deep_improvement_common.promotion_shadow_started'
        ? payloadFor(event, 'deep_improvement_common.promotion_shadow_started')
        : payloadFor(event, 'deep_improvement_common.promotion_canary_started');
      const promotion = currentPromotion(state, promotionId);
      if (promotion.stage !== 'authorized') {
        throw new DeepImprovementCommonReducerError(
          'impossible-status-transition',
          'Rollout requires a live external authorization',
          'iterationConvergence.promotions.stage',
        );
      }
      requireSeenEvent(
        state,
        payload.data.authorizationEventId,
        ['deep_improvement_common.promotion_authorized'],
        payload.data.authorizationPayloadDigest,
        candidateId,
      );
      iterationConvergence = {
        ...iterationConvergence,
        promotions: replacePromotion(iterationConvergence.promotions, {
          ...promotion,
          stage: event.payload.stem === 'deep_improvement_common.promotion_shadow_started'
            ? 'shadow'
            : 'canary',
          rolloutEventIds: sortStrings([
            ...promotion.rolloutEventIds,
            event.event_id,
          ]),
        }),
      };
      return { artifactIndex, iterationConvergence };
    }
    case 'deep_improvement_common.promotion_paused': {
      const payload = payloadFor(event, 'deep_improvement_common.promotion_paused');
      const promotion = currentPromotion(state, promotionId);
      if (promotion.stage !== 'shadow' && promotion.stage !== 'canary') {
        throw new DeepImprovementCommonReducerError(
          'impossible-status-transition',
          'Only an active rollout can be paused',
          'iterationConvergence.promotions.stage',
        );
      }
      requireSeenEvent(
        state,
        payload.data.activeRolloutEventId,
        [
          'deep_improvement_common.promotion_shadow_started',
          'deep_improvement_common.promotion_canary_started',
        ],
        undefined,
        candidateId,
      );
      iterationConvergence = {
        ...iterationConvergence,
        promotions: replacePromotion(iterationConvergence.promotions, {
          ...promotion,
          stage: 'paused',
        }),
      };
      const artifacts = insertArtifact(artifactIndex.artifacts, {
        logicalArtifactId: `promotion-checkpoint:${promotionId}`,
        artifactKind: 'run-checkpoint',
        reference: payload.data.checkpointRef,
        digest: payload.data.checkpointDigest,
        producerEventId: event.event_id,
        candidateId,
        evaluationEpochId: null,
        availability: 'available',
        receiptRefs: [],
      });
      artifactIndex = { ...artifactIndex, artifacts };
      return { artifactIndex, iterationConvergence };
    }
    case 'deep_improvement_common.promotion_aborted': {
      const payload = payloadFor(event, 'deep_improvement_common.promotion_aborted');
      const promotion = currentPromotion(state, promotionId);
      if (!['shadow', 'canary', 'paused'].includes(promotion.stage)) {
        throw new DeepImprovementCommonReducerError(
          'impossible-status-transition',
          'Only a started or paused rollout can be aborted',
          'iterationConvergence.promotions.stage',
        );
      }
      requireSeenEvent(
        state,
        payload.data.activeRolloutEventId,
        [
          'deep_improvement_common.promotion_shadow_started',
          'deep_improvement_common.promotion_canary_started',
        ],
        undefined,
        candidateId,
      );
      iterationConvergence = {
        ...iterationConvergence,
        promotions: replacePromotion(iterationConvergence.promotions, {
          ...promotion,
          stage: 'aborted',
          terminalEventId: event.event_id,
        }),
        hardVetoes: addHardVeto(iterationConvergence.hardVetoes, {
          candidateId,
          vetoCode: 'promotion-aborted',
          source: 'promotion',
          evidenceRef: payload.data.decisionReceiptRef,
          evidenceDigest: event.payload.payloadDigest,
          producerEventId: event.event_id,
        }),
        convergenceDisposition: 'blocked',
      };
      return { artifactIndex, iterationConvergence };
    }
    case 'deep_improvement_common.promotion_baseline_restored': {
      const payload = payloadFor(
        event,
        'deep_improvement_common.promotion_baseline_restored',
      );
      const promotion = currentPromotion(state, promotionId);
      if (promotion.stage !== 'aborted') {
        throw new DeepImprovementCommonReducerError(
          'impossible-status-transition',
          'Baseline restoration requires an aborted rollout',
          'iterationConvergence.promotions.stage',
        );
      }
      requireSeenEvent(
        state,
        payload.data.abortedEventId,
        ['deep_improvement_common.promotion_aborted'],
        undefined,
        candidateId,
      );
      iterationConvergence = {
        ...iterationConvergence,
        promotions: replacePromotion(iterationConvergence.promotions, {
          ...promotion,
          stage: 'rolled-back',
          terminalEventId: event.event_id,
        }),
      };
      const artifacts = insertArtifact(artifactIndex.artifacts, {
        logicalArtifactId: `rollback:${promotionId}`,
        artifactKind: 'rollback-receipt',
        reference: payload.data.restorationReceiptRef,
        digest: payload.data.baselineDigest,
        producerEventId: event.event_id,
        candidateId,
        evaluationEpochId: null,
        availability: 'available',
        receiptRefs: [payload.data.restorationReceiptRef],
      });
      artifactIndex = { ...artifactIndex, artifacts };
      return { artifactIndex, iterationConvergence };
    }
    case 'deep_improvement_common.promotion_completed': {
      const payload = payloadFor(event, 'deep_improvement_common.promotion_completed');
      const promotion = currentPromotion(state, promotionId);
      if (promotion.stage !== 'shadow' && promotion.stage !== 'canary') {
        throw new DeepImprovementCommonReducerError(
          'impossible-status-transition',
          'Promotion completion requires an active rollout',
          'iterationConvergence.promotions.stage',
        );
      }
      requireSeenEvent(
        state,
        payload.data.authorizationEventId,
        ['deep_improvement_common.promotion_authorized'],
        undefined,
        candidateId,
      );
      payload.data.rolloutEventIds.forEach((eventId) => {
        requireSeenEvent(state, eventId, [
          'deep_improvement_common.promotion_shadow_started',
          'deep_improvement_common.promotion_canary_started',
        ], undefined, candidateId);
      });
      if (candidateVetoes(state, candidateId).length > 0) {
        throw new DeepImprovementCommonReducerError(
          'impossible-status-transition',
          'Promotion completion cannot override a hard veto',
          'iterationConvergence.hardVetoes',
        );
      }
      iterationConvergence = {
        ...iterationConvergence,
        promotions: replacePromotion(iterationConvergence.promotions, {
          ...promotion,
          stage: 'shipped',
          rolloutEventIds: sortStrings(payload.data.rolloutEventIds),
          terminalEventId: event.event_id,
        }),
      };
      const artifacts = insertArtifact(artifactIndex.artifacts, {
        logicalArtifactId: `promotion-completion:${promotionId}`,
        artifactKind: 'promotion-receipt',
        reference: payload.data.completionReceiptRef,
        digest: payload.data.evidenceSetDigest,
        producerEventId: event.event_id,
        candidateId,
        evaluationEpochId: null,
        availability: 'available',
        receiptRefs: [payload.data.completionReceiptRef],
      });
      artifactIndex = { ...artifactIndex, artifacts };
      return { artifactIndex, iterationConvergence };
    }
    default:
      return { artifactIndex, iterationConvergence };
  }
}

// ───────────────────────────────────────────────────────────────────
// 6. STATUS AND TERMINAL CONSISTENCY
// ───────────────────────────────────────────────────────────────────

function transitionStateForEvent(
  event: DeepImprovementCommonLedgerEvent,
  state: DeepImprovementCommonProjectionState,
): DeepImprovementCommonModeState | null {
  const candidateId = scopeCandidateId(event);
  if (candidateId !== null
    && candidateVetoes(state, candidateId).length > 0
    && event.payload.stem !== 'deep_improvement_common.promotion_baseline_restored'
    && event.payload.stem !== 'deep_improvement_common.run_aborted'
    && event.payload.stem !== 'deep_improvement_common.run_completed'
    && event.payload.stem !== 'deep_improvement_common.run_quarantined'
    && event.payload.stem !== 'deep_improvement_common.canary_vetoed') {
    return 'blocked';
  }
  switch (event.payload.stem) {
    case 'deep_improvement_common.run_started':
    case 'deep_improvement_common.run_resumed':
    case 'deep_improvement_common.candidate_proposed':
    case 'deep_improvement_common.candidate_generated':
      return 'active';
    case 'deep_improvement_common.run_paused':
      return 'paused';
    case 'deep_improvement_common.run_completed':
      return 'completed';
    case 'deep_improvement_common.run_aborted':
      return 'aborted';
    case 'deep_improvement_common.run_quarantined':
    case 'deep_improvement_common.canary_vetoed':
      return 'quarantined';
    case 'deep_improvement_common.candidate_rejected':
    case 'deep_improvement_common.evaluation_failed':
    case 'deep_improvement_common.canary_gate_failed':
    case 'deep_improvement_common.canary_leak_detected':
    case 'deep_improvement_common.canary_drift_detected':
    case 'deep_improvement_common.canary_invariant_failed':
    case 'deep_improvement_common.promotion_aborted':
      return 'blocked';
    case 'deep_improvement_common.evaluation_epoch_sealed':
    case 'deep_improvement_common.evaluation_started':
    case 'deep_improvement_common.evaluation_observation_recorded':
    case 'deep_improvement_common.evaluation_normalized':
    case 'deep_improvement_common.evaluation_verification_requested':
      return 'awaiting-evaluation';
    case 'deep_improvement_common.evaluation_verification_recorded': {
      const payload = payloadFor(
        event,
        'deep_improvement_common.evaluation_verification_recorded',
      );
      return payload.data.verificationOutcome === 'confirmed'
        ? 'offline-accepted'
        : payload.data.verificationOutcome === 'inconclusive'
          ? 'inconclusive'
          : 'blocked';
    }
    case 'deep_improvement_common.evaluation_inconclusive':
      return 'inconclusive';
    case 'deep_improvement_common.canary_suite_sealed':
    case 'deep_improvement_common.canary_executed':
      return 'awaiting-canary';
    case 'deep_improvement_common.canary_gate_passed':
      return 'ship-eligible';
    case 'deep_improvement_common.promotion_proposed':
      return 'promotion-proposed';
    case 'deep_improvement_common.promotion_authorized':
      return 'ship-eligible';
    case 'deep_improvement_common.promotion_denied':
      return 'blocked';
    case 'deep_improvement_common.promotion_shadow_started':
      return 'shadow';
    case 'deep_improvement_common.promotion_canary_started':
      return 'canary';
    case 'deep_improvement_common.promotion_paused':
      return 'paused';
    case 'deep_improvement_common.promotion_baseline_restored':
      return 'rolled-back';
    case 'deep_improvement_common.promotion_completed':
      return 'shipped';
    case 'deep_improvement_common.candidate_lineage_attached':
      return null;
  }
}

const STATUS_TRANSITIONS = Object.freeze({
  planned: Object.freeze(['planned', 'active']),
  active: Object.freeze([
    'active', 'paused', 'awaiting-evaluation', 'blocked', 'quarantined',
    'aborted', 'completed',
  ]),
  paused: Object.freeze([
    'paused', 'active', 'aborted', 'quarantined', 'blocked', 'completed',
  ]),
  'awaiting-evaluation': Object.freeze([
    'awaiting-evaluation', 'offline-accepted', 'awaiting-canary',
    'inconclusive', 'blocked', 'paused', 'aborted', 'quarantined', 'completed',
  ]),
  'offline-accepted': Object.freeze([
    'offline-accepted', 'awaiting-canary', 'ship-eligible', 'blocked',
    'paused', 'aborted', 'quarantined', 'completed',
  ]),
  'awaiting-canary': Object.freeze([
    'awaiting-canary', 'ship-eligible', 'blocked', 'quarantined', 'paused',
    'aborted', 'completed',
  ]),
  'promotion-proposed': Object.freeze([
    'promotion-proposed', 'ship-eligible', 'blocked', 'aborted', 'quarantined',
  ]),
  'ship-eligible': Object.freeze([
    'ship-eligible', 'promotion-proposed', 'shadow', 'canary', 'blocked',
    'quarantined', 'aborted',
  ]),
  shadow: Object.freeze([
    'shadow', 'paused', 'shipped', 'blocked', 'quarantined', 'aborted',
  ]),
  canary: Object.freeze([
    'canary', 'paused', 'shipped', 'blocked', 'quarantined', 'aborted',
  ]),
  shipped: Object.freeze(['shipped', 'completed', 'quarantined']),
  inconclusive: Object.freeze([
    'inconclusive', 'awaiting-evaluation', 'blocked', 'aborted', 'quarantined',
    'completed',
  ]),
  blocked: Object.freeze([
    'blocked', 'active', 'paused', 'rolled-back', 'aborted', 'quarantined',
    'completed',
  ]),
  quarantined: Object.freeze(['quarantined']),
  aborted: Object.freeze(['aborted']),
  'rolled-back': Object.freeze(['rolled-back', 'completed']),
  completed: Object.freeze(['completed']),
  failed: Object.freeze(['failed']),
} as const satisfies Readonly<
  Record<DeepImprovementCommonModeState, readonly DeepImprovementCommonModeState[]>
>);

function deriveStatusDetails(
  status: DeepImprovementCommonModeStatus,
  state: DeepImprovementCommonProjectionState,
  event: DeepImprovementCommonLedgerEvent,
): DeepImprovementCommonModeStatus {
  const candidateId = scopeCandidateId(event)
    ?? state.iterationConvergence.candidates.at(-1)?.candidateId
    ?? null;
  const progress = candidateId === null
    ? undefined
    : latestForCandidate(state.iterationConvergence.candidates, candidateId);
  const epoch = candidateId === null
    ? undefined
    : latestForCandidate(state.iterationConvergence.evaluatorEpochs, candidateId);
  const canary = candidateId === null
    ? undefined
    : latestForCandidate(state.iterationConvergence.canaries, candidateId);
  const promotion = candidateId === null
    ? undefined
    : latestForCandidate(state.iterationConvergence.promotions, candidateId);
  const vetoCodes = candidateId === null
    ? sortStrings(state.iterationConvergence.hardVetoes.map((veto) => veto.vetoCode))
    : sortStrings(candidateVetoes(state, candidateId).map((veto) => veto.vetoCode));
  let authorityState = status.authorityState;
  if (promotion?.stage === 'proposed') authorityState = 'eligible';
  if (promotion?.stage === 'authorized') authorityState = 'authorized';
  if (promotion?.stage === 'shadow') authorityState = 'shadow';
  if (promotion?.stage === 'canary') authorityState = 'canary';
  if (promotion?.stage === 'denied') authorityState = 'denied';
  if (promotion?.stage === 'aborted') authorityState = 'rollback-required';
  if (promotion?.stage === 'rolled-back') authorityState = 'restored';
  if (promotion?.stage === 'shipped') authorityState = 'authoritative';
  let profileIncumbents = [...status.profileIncumbents];
  let currentIncumbentCandidateId = status.currentIncumbentCandidateId;
  if (event.payload.stem === 'deep_improvement_common.promotion_completed'
    && candidateId !== null
    && epoch !== undefined) {
    profileIncumbents = profileIncumbents.filter(
      (entry) => entry.profileRef !== epoch.fixtureSetRef,
    );
    profileIncumbents.push({
      profileRef: epoch.fixtureSetRef,
      candidateId,
      promotionEventId: event.event_id,
    });
    profileIncumbents.sort((left, right) => compareString(
      left.profileRef,
      right.profileRef,
    ));
    currentIncumbentCandidateId = candidateId;
  }
  return {
    ...status,
    evaluatorEpochId: epoch?.evaluationEpochId ?? status.evaluatorEpochId,
    activeProfileRef: epoch?.fixtureSetRef ?? status.activeProfileRef,
    currentIncumbentCandidateId,
    candidateStage: progress?.stage ?? status.candidateStage,
    canaryStage: canary?.stage ?? status.canaryStage,
    promotionStage: promotion?.stage ?? status.promotionStage,
    authorityState,
    rollbackTargetBaselineId: promotion?.baselineId
      ?? status.rollbackTargetBaselineId,
    blockingVetoCodes: vetoCodes,
    profileIncumbents,
  };
}

function refreshModeStatus(
  state: DeepImprovementCommonProjectionState,
  event: DeepImprovementCommonLedgerEvent,
): DeepImprovementCommonProjectionState['modeStatus'] {
  const transitionState = transitionStateForEvent(event, state);
  const targets = new Set<DeepImprovementCommonWorkstream>([
    'deep-improvement-common',
    event.payload.scope.variant,
  ]);
  const statuses = state.modeStatus.statuses.map((current) => {
    if (!targets.has(current.workstream)) return current;
    let next = deriveStatusDetails(current, state, event);
    if (transitionState !== null) {
      const allowed: readonly DeepImprovementCommonModeState[] =
        STATUS_TRANSITIONS[current.state];
      if (!allowed.includes(transitionState)) {
        throw new DeepImprovementCommonReducerError(
          'impossible-status-transition',
          `Status cannot transition from ${current.state} to ${transitionState}`,
          'modeStatus.statuses.provenance',
        );
      }
      const transition: DeepImprovementCommonStatusTransition = {
        state: transitionState,
        producerEventId: event.event_id,
        producerStem: event.payload.stem,
        logicalSequence: event.stream_sequence,
        transitionReason: null,
      };
      next = {
        ...next,
        state: transitionState,
        terminal: ['completed', 'aborted', 'quarantined', 'failed'].includes(
          transitionState,
        ),
        provenance: [...next.provenance, transition],
      };
    }
    return next;
  });
  statuses.sort((left, right) => compareString(left.workstream, right.workstream));
  return { statuses };
}

function assertTerminalConsistency(
  state: DeepImprovementCommonProjectionState,
  event: DeepImprovementCommonLedgerEvent,
): void {
  if (event.payload.stem === 'deep_improvement_common.run_paused') {
    const payload = payloadFor(event, 'deep_improvement_common.run_paused');
    if (payload.data.pendingCandidateIds.some(
      (candidateId) => !state.artifactIndex.candidates.some(
        (candidate) => candidate.candidateId === candidateId,
      ),
    )) {
      throw new DeepImprovementCommonReducerError(
        'referential-integrity',
        'Pause checkpoints cannot name candidates absent from the folded ledger',
        'payload.data.pendingCandidateIds',
      );
    }
  }
  if (event.payload.stem === 'deep_improvement_common.run_aborted') {
    const payload = payloadFor(event, 'deep_improvement_common.run_aborted');
    requireSeenEvent(
      state,
      payload.data.lastSafeEventId,
      DeepImprovementCommonEventStems,
    );
  }
  if (event.payload.stem === 'deep_improvement_common.run_quarantined') {
    const payload = payloadFor(event, 'deep_improvement_common.run_quarantined');
    if (payload.data.affectedCandidateIds.some(
      (candidateId) => !state.artifactIndex.candidates.some(
        (candidate) => candidate.candidateId === candidateId,
      ),
    )) {
      throw new DeepImprovementCommonReducerError(
        'referential-integrity',
        'Quarantine cannot name candidates absent from the folded ledger',
        'payload.data.affectedCandidateIds',
      );
    }
  }
  if (event.payload.stem !== 'deep_improvement_common.run_completed') return;
  const payload = payloadFor(event, 'deep_improvement_common.run_completed');
  if (payload.data.finalLedgerTailHash !== event.payload.prevEventHash) {
    throw new DeepImprovementCommonReducerError(
      'referential-integrity',
      'Run completion must bind the immediately preceding ledger tail',
      'payload.data.finalLedgerTailHash',
    );
  }
  const counts = {
    candidates: state.artifactIndex.candidates.length,
    evaluations: state.iterationConvergence.evaluatorEpochs.length,
    observations: state.artifactIndex.rawObservations.length,
    canaryRuns: state.iterationConvergence.canaries.reduce(
      (total, canary) => total + canary.executionEventIds.length,
      0,
    ),
    promotions: state.iterationConvergence.promotions.length,
  };
  if (!sameCanonical(counts, payload.data.counts)) {
    throw new DeepImprovementCommonReducerError(
      'impossible-status-transition',
      'Completion counts must equal the replayed common projection',
      'payload.data.counts',
    );
  }
  if (payload.data.sessionOutcome === 'promoted') {
    const shipped = state.iterationConvergence.promotions.some(
      (promotion) => promotion.stage === 'shipped',
    );
    if (!shipped || state.iterationConvergence.hardVetoes.length > 0) {
      throw new DeepImprovementCommonReducerError(
        'impossible-status-transition',
        'A promoted outcome requires shipped evidence and no hard veto',
        'payload.data.sessionOutcome',
      );
    }
  }
  if (payload.data.stopReason === 'converged'
    && state.iterationConvergence.hardVetoes.length > 0) {
    throw new DeepImprovementCommonReducerError(
      'impossible-status-transition',
      'Convergence cannot override unresolved hard vetoes',
      'payload.data.stopReason',
    );
  }
}

// ───────────────────────────────────────────────────────────────────
// 7. EVENT APPLICATION
// ───────────────────────────────────────────────────────────────────

function appendSeenEvent(
  state: DeepImprovementCommonProjectionState,
  event: DeepImprovementCommonLedgerEvent,
): DeepImprovementCommonSeenEvent[] | null {
  const digest = eventDigest(event);
  const existing = state.seenEvents.find((entry) => entry.eventId === event.event_id);
  if (existing !== undefined) {
    if (existing.eventDigest !== digest) {
      throw new DeepImprovementCommonReducerError(
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
    payloadDigest: event.payload.payloadDigest,
    stem: event.payload.stem,
    streamId: event.stream_id,
    streamSequence: event.stream_sequence,
    candidateId: scopeCandidateId(event),
    evaluationEpochId: scopeEvaluationEpochId(event),
    canaryEpochId: scopeCanaryEpochId(event),
    promotionId: scopePromotionId(event),
  }];
  seenEvents.sort((left, right) => (
    compareNumber(left.streamSequence, right.streamSequence)
      || compareString(left.eventId, right.eventId)
  ));
  return seenEvents;
}

function advanceCursors(
  state: DeepImprovementCommonProjectionState,
  event: DeepImprovementCommonLedgerEvent,
): DeepImprovementCommonProjectionState['cursors'] {
  const planes = DEEP_IMPROVEMENT_COMMON_EVENT_ROUTING[event.payload.stem];
  return {
    iterationConvergence: planes.includes('iterationConvergence' as never)
      ? Math.max(state.cursors.iterationConvergence, event.stream_sequence)
      : state.cursors.iterationConvergence,
    artifactIndex: planes.includes('artifactIndex' as never)
      ? Math.max(state.cursors.artifactIndex, event.stream_sequence)
      : state.cursors.artifactIndex,
    modeStatus: planes.includes('modeStatus' as never)
      ? Math.max(state.cursors.modeStatus, event.stream_sequence)
      : state.cursors.modeStatus,
  };
}

function applyEvent(
  state: DeepImprovementCommonProjectionState,
  event: DeepImprovementCommonLedgerEvent,
): DeepImprovementCommonProjectionState {
  const seenEvents = appendSeenEvent(state, event);
  if (seenEvents === null) return state;
  assertRunIdentity(state, event);
  if (state.run.state === 'completed'
    || state.run.state === 'aborted'
    || state.run.state === 'quarantined') {
    throw new DeepImprovementCommonReducerError(
      'impossible-status-transition',
      'Terminal runs accept no additional common events',
      'run.state',
    );
  }

  const candidateFold = foldCandidate(state, event);
  const candidateState: DeepImprovementCommonProjectionState = {
    ...state,
    ...candidateFold,
  };
  const evaluationFold = foldEvaluation(candidateState, event);
  const evaluationState: DeepImprovementCommonProjectionState = {
    ...candidateState,
    ...evaluationFold,
  };
  const canaryFold = foldCanary(evaluationState, event);
  const canaryState: DeepImprovementCommonProjectionState = {
    ...evaluationState,
    ...canaryFold,
  };
  const promotionFold = foldPromotion(canaryState, event);
  let iterationConvergence = promotionFold.iterationConvergence;
  if (event.payload.stem === 'deep_improvement_common.run_completed') {
    const payload = payloadFor(event, 'deep_improvement_common.run_completed');
    iterationConvergence = {
      ...iterationConvergence,
      stopReason: payload.data.stopReason,
      sessionOutcome: payload.data.sessionOutcome,
      convergenceDisposition: payload.data.stopReason === 'converged'
        ? 'converged'
        : payload.data.terminalOutcome === 'quarantined'
          ? 'quarantined'
          : 'aborted',
    };
  } else if (event.payload.stem === 'deep_improvement_common.run_aborted') {
    iterationConvergence = {
      ...iterationConvergence,
      convergenceDisposition: 'aborted',
    };
  } else if (event.payload.stem === 'deep_improvement_common.run_quarantined') {
    iterationConvergence = {
      ...iterationConvergence,
      convergenceDisposition: 'quarantined',
    };
  }
  const interim: DeepImprovementCommonProjectionState = {
    ...canaryState,
    artifactIndex: promotionFold.artifactIndex,
    iterationConvergence,
    run: foldRun(state, event),
    cursors: advanceCursors(state, event),
    seenEvents,
  };
  assertTerminalConsistency(interim, event);
  const next: DeepImprovementCommonProjectionState = {
    ...interim,
    modeStatus: refreshModeStatus(interim, event),
  };
  assertDeepImprovementCommonProjectionState(next);
  return immutableProjectionClone(next) as DeepImprovementCommonProjectionState;
}

// ───────────────────────────────────────────────────────────────────
// 8. MODE-CONTRACT AND EXTENSION SURFACES
// ───────────────────────────────────────────────────────────────────

export type DeepImprovementCommonReducerSurface = Pick<
  ModeContract<DeepImprovementCommonModeContractState>,
  'reducers' | 'reduce'
>;

/** Apply one real verified common event through the shared ModeContract signature. */
export function reduceDeepImprovementCommonVerifiedEvent(
  verified: VerifiedLedgerEvent,
  state: Readonly<DeepImprovementCommonModeContractState>,
): ModeReductionResult<DeepImprovementCommonModeContractState> {
  assertDeepImprovementCommonProjectionState(state);
  const event = typedEventFromVerified(verified);
  const next = applyEvent(state, event);
  return Object.freeze({
    reducerId: DEEP_IMPROVEMENT_COMMON_REDUCER_ID,
    stateVersion: DEEP_IMPROVEMENT_COMMON_PROJECTION_SCHEMA_VERSION,
    appliedEventId: event.event_id,
    state: asModeContractState(next),
  });
}

export const DEEP_IMPROVEMENT_COMMON_REDUCER_SURFACE:
DeepImprovementCommonReducerSurface = Object.freeze({
  reducers: DEEP_IMPROVEMENT_COMMON_REDUCER_SET,
  reduce: reduceDeepImprovementCommonVerifiedEvent,
});

export interface DeepImprovementCommonFoldBranch {
  readonly projectionKey: 'common';
  readonly eventStems: readonly DeepImprovementCommonEventStem[];
  readonly reducerSurface: DeepImprovementCommonReducerSurface;
  readonly createProjectionState: typeof createDeepImprovementCommonProjectionState;
}

/**
 * Downstream folds wrap this branch under a `common` key and own combined-stream
 * ordering before dispatching their namespaced events to sibling branches.
 */
export const DEEP_IMPROVEMENT_COMMON_FOLD_BRANCH:
DeepImprovementCommonFoldBranch = Object.freeze({
  projectionKey: 'common',
  eventStems: DeepImprovementCommonEventStems,
  reducerSurface: DEEP_IMPROVEMENT_COMMON_REDUCER_SURFACE,
  createProjectionState: createDeepImprovementCommonProjectionState,
});

function assertReducerOwnership(
  reducers: ModeReducerSet<DeepImprovementCommonModeContractState>,
): void {
  const declared = [...reducers.persistedFields].sort(compareString);
  const expected = [...PERSISTED_FIELDS].sort(compareString);
  if (!sameCanonical(declared, expected)) {
    throw new DeepImprovementCommonReducerError(
      'projection-field-undeclared',
      'Persisted fields must equal the closed common projection field set',
      'reducers.persistedFields',
    );
  }
  const owners = new Map<string, string>();
  for (const definition of reducers.definitions) {
    for (const field of definition.ownedFields) {
      const existing = owners.get(field);
      if (existing !== undefined) {
        throw new DeepImprovementCommonReducerError(
          'duplicate-owner',
          `Projection field ${field} is owned by both ${existing} and ${definition.reducerId}`,
          field,
        );
      }
      owners.set(field, definition.reducerId);
    }
  }
  for (const field of PERSISTED_FIELDS) {
    if (!owners.has(field)) {
      throw new DeepImprovementCommonReducerError(
        'projection-field-undeclared',
        `Projection field ${field} has no reducer owner`,
        field,
      );
    }
  }
}

/** Probe the real reducer signature for determinism, immutability, and ownership. */
export function verifyDeepImprovementCommonReducerSurface(
  surface: DeepImprovementCommonReducerSurface,
  event: VerifiedLedgerEvent,
  state: DeepImprovementCommonProjectionState,
): void {
  assertReducerOwnership(surface.reducers);
  assertDeepImprovementCommonProjectionState(state);
  const firstInput = immutableProjectionClone(
    state,
  ) as DeepImprovementCommonProjectionState;
  const secondInput = immutableProjectionClone(
    state,
  ) as DeepImprovementCommonProjectionState;
  const initialDigest = canonicalJson(firstInput);
  const first = surface.reduce(event, asModeContractState(firstInput));
  const second = surface.reduce(event, asModeContractState(secondInput));
  assertDeepImprovementCommonProjectionState(first.state);
  assertDeepImprovementCommonProjectionState(second.state);
  if (!isDeepFrozenProjection(first.state)
    || !isDeepFrozenProjection(second.state)) {
    throw new DeepImprovementCommonReducerError(
      'projection-not-frozen',
      'Mode reducer outputs must be recursively frozen',
      'state',
    );
  }
  if (canonicalJson(firstInput) !== initialDigest
    || canonicalJson(secondInput) !== initialDigest) {
    throw new DeepImprovementCommonReducerError(
      'state-mutated',
      'Mode reducer mutated its frozen input state',
      'state',
    );
  }
  if (!sameCanonical(first, second)) {
    throw new DeepImprovementCommonReducerError(
      'reducer-nondeterministic',
      'Mode reducer produced different outputs for equal inputs',
      'state',
    );
  }
  const definition = surface.reducers.definitions.find(
    (candidate) => candidate.reducerId === first.reducerId,
  );
  if (definition === undefined) {
    throw new DeepImprovementCommonReducerError(
      'reducer-output-unowned',
      'Mode reducer returned an undeclared reducer identity',
      'reducerId',
    );
  }
  const changedFields = topLevelChangedFields(state, first.state);
  const unowned = changedFields.find(
    (field) => !definition.ownedFields.includes(field),
  );
  if (unowned !== undefined) {
    throw new DeepImprovementCommonReducerError(
      'reducer-output-unowned',
      `Mode reducer wrote unowned projection field ${unowned}`,
      unowned,
    );
  }
}

// ───────────────────────────────────────────────────────────────────
// 9. FULL AND INCREMENTAL REPLAY
// ───────────────────────────────────────────────────────────────────

/** Derive a deterministic digest without feeding prior output into the fold. */
export function deepImprovementCommonProjectionIntegrityDigest(
  projection: DeepImprovementCommonProjectionState,
): string {
  assertDeepImprovementCommonProjectionState(projection);
  return sha256Bytes(canonicalBytes({
    schemaVersion: DEEP_IMPROVEMENT_COMMON_PROJECTION_SCHEMA_VERSION,
    reducerVersion: DEEP_IMPROVEMENT_COMMON_REDUCER_VERSION,
    codecVersion: DEEP_IMPROVEMENT_COMMON_PROJECTION_CODEC_VERSION,
    orderingPolicyVersion: DEEP_IMPROVEMENT_COMMON_ORDERING_POLICY_VERSION,
    projection,
  }));
}

function checkpointIntegrityDigest(
  projection: DeepImprovementCommonProjectionState,
  sourceTailSequence: number,
): string {
  return sha256Bytes(canonicalBytes({
    projectionDigest: deepImprovementCommonProjectionIntegrityDigest(projection),
    sourceTailSequence,
  }));
}

function rebuildReasons(
  options: DeepImprovementCommonFoldOptions,
): DeepImprovementCommonRebuildReasonCode[] {
  const reasons: DeepImprovementCommonRebuildReasonCode[] = [];
  if (options.expectedSchemaVersion !== undefined
    && options.expectedSchemaVersion
      !== DEEP_IMPROVEMENT_COMMON_PROJECTION_SCHEMA_VERSION) {
    reasons.push('projection-schema-mismatch');
  }
  if (options.expectedReducerVersion !== undefined
    && options.expectedReducerVersion !== DEEP_IMPROVEMENT_COMMON_REDUCER_VERSION) {
    reasons.push('reducer-version-mismatch');
  }
  if (options.expectedCodecVersion !== undefined
    && options.expectedCodecVersion
      !== DEEP_IMPROVEMENT_COMMON_PROJECTION_CODEC_VERSION) {
    reasons.push('codec-version-mismatch');
  }
  if (options.expectedOrderingPolicyVersion !== undefined
    && options.expectedOrderingPolicyVersion
      !== DEEP_IMPROVEMENT_COMMON_ORDERING_POLICY_VERSION) {
    reasons.push('ordering-policy-mismatch');
  }
  const checkpoint = options.checkpoint;
  if (checkpoint !== undefined) {
    try {
      assertDeepImprovementCommonProjectionState(checkpoint.projection);
    } catch {
      reasons.push('projection-schema-mismatch');
      return sortStrings(reasons) as DeepImprovementCommonRebuildReasonCode[];
    }
    if (checkpoint.projection.schemaVersion
      !== DEEP_IMPROVEMENT_COMMON_PROJECTION_SCHEMA_VERSION) {
      reasons.push('projection-schema-mismatch');
    }
    if (checkpoint.projection.reducerVersion
      !== DEEP_IMPROVEMENT_COMMON_REDUCER_VERSION) {
      reasons.push('reducer-version-mismatch');
    }
    if (checkpoint.projection.codecVersion
      !== DEEP_IMPROVEMENT_COMMON_PROJECTION_CODEC_VERSION) {
      reasons.push('codec-version-mismatch');
    }
    if (checkpoint.projection.orderingPolicyVersion
      !== DEEP_IMPROVEMENT_COMMON_ORDERING_POLICY_VERSION) {
      reasons.push('ordering-policy-mismatch');
    }
    if (checkpoint.integrityDigest !== checkpointIntegrityDigest(
      checkpoint.projection,
      checkpoint.sourceTailSequence,
    )) {
      reasons.push('checkpoint-digest-mismatch');
    }
    if (options.sourceTailSequence !== undefined
      && options.sourceTailSequence < checkpoint.sourceTailSequence) {
      reasons.push('source-truncated');
    }
  }
  return [...new Set(reasons)].sort(compareString);
}

function projectedResult(
  projection: DeepImprovementCommonProjectionState,
  sourceTailSequence: number,
): DeepImprovementCommonProjectedResult {
  const integrityDigest = deepImprovementCommonProjectionIntegrityDigest(projection);
  const checkpoint: DeepImprovementCommonProjectionCheckpoint = {
    projection,
    integrityDigest: checkpointIntegrityDigest(projection, sourceTailSequence),
    sourceTailSequence,
  };
  return immutableProjectionClone({
    outcome: 'projected',
    projection,
    integrityDigest,
    checkpoint,
  }) as unknown as DeepImprovementCommonProjectedResult;
}

function orderingFailure(
  events: readonly DeepImprovementCommonLedgerEvent[],
  checkpoint: DeepImprovementCommonProjectionCheckpoint | undefined,
): DeepImprovementCommonRebuildReasonCode | null {
  let tail = checkpoint?.sourceTailSequence ?? 0;
  const known = new Map(
    checkpoint?.projection.seenEvents.map((event) => [
      event.eventId,
      event.eventDigest,
    ]) ?? [],
  );
  for (const event of events) {
    const digest = eventDigest(event);
    const existing = known.get(event.event_id);
    if (existing !== undefined) {
      if (existing !== digest) return 'event-order-invalid';
      continue;
    }
    if (event.stream_sequence <= tail) return 'event-order-invalid';
    if (event.stream_sequence > tail + 1) return 'cursor-gap';
    tail = event.stream_sequence;
    known.set(event.event_id, digest);
  }
  return null;
}

/** Fold typed common events into frozen projections without repairing order. */
export function foldDeepImprovementCommonEvents(
  events: readonly DeepImprovementCommonLedgerEvent[],
  options: DeepImprovementCommonFoldOptions = {},
): DeepImprovementCommonFoldResult {
  const reasons = rebuildReasons(options);
  if (reasons.length > 0) {
    return Object.freeze({
      outcome: 'rebuild_required',
      reasonCodes: Object.freeze(reasons),
    });
  }
  const validated = events.map(validateTypedEvent);
  const orderingReason = orderingFailure(validated, options.checkpoint);
  if (orderingReason !== null) {
    return Object.freeze({
      outcome: 'rebuild_required',
      reasonCodes: Object.freeze([orderingReason]),
    });
  }
  let projection = options.checkpoint?.projection
    ?? createDeepImprovementCommonProjectionState();
  for (const event of validated) projection = applyEvent(projection, event);
  const eventTail = validated.reduce(
    (tail, event) => Math.max(tail, event.stream_sequence),
    options.checkpoint?.sourceTailSequence ?? 0,
  );
  const sourceTailSequence = Math.max(
    options.sourceTailSequence ?? 0,
    eventTail,
  );
  return projectedResult(projection, sourceTailSequence);
}

// ───────────────────────────────────────────────────────────────────
// 10. COMPLETE SHADOW-ONLY LEGACY VIEW
// ───────────────────────────────────────────────────────────────────

/** Project the common aggregate into a complete non-authoritative legacy view. */
export function projectDeepImprovementCommonLegacyView(
  projection: DeepImprovementCommonProjectionState,
): DeepImprovementCommonLegacyProjection {
  assertDeepImprovementCommonProjectionState(projection);
  const commonStatus = projection.modeStatus.statuses.find(
    (status) => status.workstream === 'deep-improvement-common',
  );
  if (commonStatus === undefined) {
    throw new DeepImprovementCommonReducerError(
      'projection-field-invalid',
      'Common status row is required for legacy projection',
      'modeStatus.statuses',
    );
  }
  const candidateId = projection.iterationConvergence.candidates.at(-1)?.candidateId
    ?? null;
  const latestScore = candidateId === null
    ? undefined
    : [...projection.artifactIndex.derivedScores].reverse().find(
      (score) => score.candidateId === candidateId,
    );
  const legacy: DeepImprovementCommonLegacyProjection = {
    authority: 'shadow-only',
    legacyAuthority: 'unchanged',
    variant: projection.run.variant,
    runState: projection.run.state,
    iteration: projection.iterationConvergence.currentIteration,
    candidateId,
    candidateStage: commonStatus.candidateStage,
    aggregateScore: latestScore?.scoreVector.aggregateScore ?? null,
    canaryStage: commonStatus.canaryStage,
    promotionStage: commonStatus.promotionStage,
    stopReason: projection.iterationConvergence.stopReason,
    sessionOutcome: projection.iterationConvergence.sessionOutcome,
    hardVetoCodes: [...commonStatus.blockingVetoCodes],
  };
  assertDeepImprovementCommonLegacyProjection(legacy);
  return immutableProjectionClone(legacy) as DeepImprovementCommonLegacyProjection;
}

/** Derive the candidate-safe presentation without evaluator or evidence internals. */
export function projectDeepImprovementCommonCandidateView(
  projection: DeepImprovementCommonProjectionState,
): DeepImprovementCommonCandidateView {
  assertDeepImprovementCommonProjectionState(projection);
  const commonStatus = projection.modeStatus.statuses.find(
    (status) => status.workstream === 'deep-improvement-common',
  );
  if (commonStatus === undefined) {
    throw new DeepImprovementCommonReducerError(
      'projection-field-invalid',
      'Common status row is required for candidate projection',
      'modeStatus.statuses',
    );
  }
  const decisionBand = commonStatus.blockingVetoCodes.length > 0
    ? 'blocked' as const
    : commonStatus.terminal
      ? 'terminal' as const
      : ['ship-eligible', 'shadow', 'canary', 'shipped'].includes(commonStatus.state)
        ? 'eligible' as const
        : 'pending' as const;
  const view: DeepImprovementCommonCandidateView = {
    authority: 'derived-redacted',
    workstream: 'deep-improvement-common',
    runState: projection.run.state,
    iteration: projection.iterationConvergence.currentIteration,
    candidateStage: commonStatus.candidateStage,
    canaryStage: commonStatus.canaryStage,
    promotionStage: commonStatus.promotionStage,
    decisionBand,
  };
  assertDeepImprovementCommonCandidateView(view);
  return immutableProjectionClone(view) as DeepImprovementCommonCandidateView;
}

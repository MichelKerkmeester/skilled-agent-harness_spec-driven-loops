// ───────────────────────────────────────────────────────────────────
// MODULE: Model Benchmark Reducer
// ───────────────────────────────────────────────────────────────────

import {
  DEEP_IMPROVEMENT_COMMON_FOLD_BRANCH,
  DEEP_IMPROVEMENT_COMMON_REDUCER_SURFACE,
  createDeepImprovementCommonProjectionState,
  projectDeepImprovementCommonLegacyView,
} from '../deep-improvement-common-reducers/index.js';
import {
  MODEL_BENCHMARK_SCORE_WRITE_BACKEND_REF,
  ModelBenchmarkEventStems,
  ModelBenchmarkSpecificEventStems,
  ModelBenchmarkWireEventTypes,
  createModelBenchmarkEventRegistry,
  isModelBenchmarkEventStem,
  isModelBenchmarkSpecificEventStem,
} from '../model-benchmark-ledger-schema/index.js';
import {
  canonicalBytes,
  canonicalJson,
  readEvent,
  sha256Bytes,
} from '../event-envelope/index.js';
import {
  ModelBenchmarkReducerError,
  assertModelBenchmarkLegacyProjection,
  assertModelBenchmarkProjectionState,
  immutableModelBenchmarkProjectionClone,
  isDeepFrozenModelBenchmarkProjection,
} from './model-benchmark-projection-schema.js';

import type { VerifiedLedgerEvent } from '../authorized-ledger/index.js';
import type {
  DeepImprovementCommonEventStem,
  DeepImprovementCommonLedgerEvent,
} from '../deep-improvement-common-ledger-schema/index.js';
import type { JsonObject } from '../event-envelope/index.js';
import type {
  ModeContract,
  ModeReducerSet,
  ModeReductionResult,
} from '../mode-contracts/index.js';
import type {
  ModelBenchmarkEventStem,
  ModelBenchmarkLedgerEvent,
  ModelBenchmarkLedgerPayload,
  ModelBenchmarkSpecificEventStem,
  TrialMatrixKey,
} from '../model-benchmark-ledger-schema/index.js';
import type {
  ModelBenchmarkArtifactRecord,
  ModelBenchmarkCaseLifecycleRecord,
  ModelBenchmarkCellRecord,
  ModelBenchmarkContaminationEvidenceRecord,
  ModelBenchmarkFoldBranch,
  ModelBenchmarkFoldOptions,
  ModelBenchmarkFoldResult,
  ModelBenchmarkJudgeObservationRecord,
  ModelBenchmarkLegacyProjection,
  ModelBenchmarkPairwiseComparisonResultRecord,
  ModelBenchmarkProjectedResult,
  ModelBenchmarkProjectionCheckpoint,
  ModelBenchmarkProjectionState,
  ModelBenchmarkRankingRecord,
  ModelBenchmarkRebuildReasonCode,
  ModelBenchmarkSeenEvent,
  ModelBenchmarkScoreRecord,
  ModelBenchmarkStreamFrontier,
  ModelBenchmarkVariantProjection,
} from './model-benchmark-projection-types.js';

export const MODEL_BENCHMARK_PROJECTION_SCHEMA_VERSION =
  'model-benchmark-projection@1' as const;
export const MODEL_BENCHMARK_REDUCER_VERSION =
  'model-benchmark-reducer@1' as const;
export const MODEL_BENCHMARK_PROJECTION_CODEC_VERSION =
  'canonical-json@1' as const;
export const MODEL_BENCHMARK_ORDERING_POLICY_VERSION =
  'strict-per-stream-order@1' as const;
export const MODEL_BENCHMARK_REDUCER_ID =
  'model-benchmark:projection-fold' as const;

export const MODEL_BENCHMARK_HANDLED_SPECIFIC_EVENT_STEMS = Object.freeze([
  'model_benchmark.run_declared',
  'model_benchmark.benchmark_capsule_sealed',
  'model_benchmark.workload_snapshot_sealed',
  'model_benchmark.run_started',
  'model_benchmark.run_paused',
  'model_benchmark.run_resumed',
  'model_benchmark.run_closed',
  'model_benchmark.benchmark_design_declared',
  'model_benchmark.trial_block_declared',
  'model_benchmark.trial_case_admitted',
  'model_benchmark.trial_case_rejected',
  'model_benchmark.trial_dispatched',
  'model_benchmark.trial_completed',
  'model_benchmark.trial_failed',
  'model_benchmark.trial_unknown',
  'model_benchmark.trial_invalidated',
  'model_benchmark.trial_observation_recorded',
  'model_benchmark.score_vector_observed',
  'model_benchmark.usage_observed',
  'model_benchmark.judge_observation_recorded',
  'model_benchmark.oracle_label_attested',
  'model_benchmark.contamination_evidence_recorded',
  'model_benchmark.exposure_recorded',
  'model_benchmark.case_disclosed',
  'model_benchmark.case_retired',
  'model_benchmark.case_replaced',
  'model_benchmark.judge_calibration_sealed',
  'model_benchmark.validity_plan_sealed',
  'model_benchmark.validity_card_derived',
  'model_benchmark.validity_unknown_recorded',
  'model_benchmark.selection_evidence_sealed',
  'model_benchmark.selection_reduction_requested',
] as const satisfies readonly ModelBenchmarkSpecificEventStem[]);

const eventRegistry = createModelBenchmarkEventRegistry();
type ModelBenchmarkModeContractState =
  ModelBenchmarkProjectionState & JsonObject;

const PERSISTED_FIELDS = Object.freeze([
  'schemaVersion',
  'reducerVersion',
  'codecVersion',
  'orderingPolicyVersion',
  'common',
  'modelBenchmark',
  'streamFrontiers',
  'seenEvents',
] as const);

function compareString(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function sameCanonical(left: unknown, right: unknown): boolean {
  return canonicalJson(left) === canonicalJson(right);
}

function payloadFor<TStem extends ModelBenchmarkEventStem>(
  event: ModelBenchmarkLedgerEvent,
  stem: TStem,
): ModelBenchmarkLedgerPayload<TStem> {
  if (event.payload.stem !== stem) {
    throw new ModelBenchmarkReducerError(
      'event-not-model-benchmark',
      `Expected ${stem}, received ${event.payload.stem}`,
      'payload.stem',
    );
  }
  return event.payload as ModelBenchmarkLedgerPayload<TStem>;
}

function eventDigest(event: ModelBenchmarkLedgerEvent): string {
  return sha256Bytes(canonicalBytes(event));
}

function validateTypedEvent(
  event: ModelBenchmarkLedgerEvent,
): ModelBenchmarkLedgerEvent {
  try {
    const effective = readEvent(canonicalBytes(event), eventRegistry)
      .effective.envelope;
    if (!isModelBenchmarkEventStem(effective.payload.stem)
      || effective.event_type
        !== ModelBenchmarkWireEventTypes[effective.payload.stem]) {
      throw new ModelBenchmarkReducerError(
        'event-not-model-benchmark',
        'Event is outside the registered model-benchmark union',
        'event_type',
      );
    }
    return effective as ModelBenchmarkLedgerEvent;
  } catch (error: unknown) {
    if (error instanceof ModelBenchmarkReducerError) throw error;
    throw new ModelBenchmarkReducerError(
      'event-schema-invalid',
      'Event failed the real model-benchmark typed-ledger registry',
      'event',
    );
  }
}

function typedEventFromVerified(
  verified: VerifiedLedgerEvent,
): ModelBenchmarkLedgerEvent {
  const envelope = verified.event.effective.envelope;
  if (!isModelBenchmarkEventStem(envelope.payload.stem)
    || envelope.event_type
      !== ModelBenchmarkWireEventTypes[envelope.payload.stem]) {
    throw new ModelBenchmarkReducerError(
      'event-not-model-benchmark',
      'Verified event is outside the model-benchmark union',
      'event_type',
    );
  }
  return validateTypedEvent(envelope as ModelBenchmarkLedgerEvent);
}

function emptyVariant(): ModelBenchmarkVariantProjection {
  return {
    run: {
      runId: null,
      lineageId: null,
      generation: null,
      state: 'not-started',
      declarationEventId: null,
      capsuleEventId: null,
      workloadEventId: null,
      terminalOutcome: null,
    },
    iterationConvergence: {
      designIds: [],
      trialBlockIds: [],
      cells: [],
      paused: false,
      unresolvedEvidenceRefs: [],
      stopSignals: [],
    },
    artifactIndex: { artifacts: [] },
    scoringMatrix: {
      rawObservations: [],
      scores: [],
      judgeObservations: [],
      pairwiseComparisonResults: [],
      costLatencySlices: [],
      oracleLabels: [],
      contaminationEvidence: [],
      exposures: [],
      caseLifecycle: [],
      validity: [],
      validityUnknowns: [],
      selectionEvidence: [],
      rankings: [],
    },
    modeStatus: {
      commonStatusWorkstream: 'model-benchmark',
      activeMatrixProfile: null,
      incumbentCandidateId: null,
      matrixCoverage: 0,
      rankingState: 'unranked',
      blockingCellKeys: [],
      blockingVetoCodes: [],
    },
  };
}

export function createModelBenchmarkProjectionState():
ModelBenchmarkProjectionState {
  return immutableModelBenchmarkProjectionClone({
    schemaVersion: MODEL_BENCHMARK_PROJECTION_SCHEMA_VERSION,
    reducerVersion: MODEL_BENCHMARK_REDUCER_VERSION,
    codecVersion: MODEL_BENCHMARK_PROJECTION_CODEC_VERSION,
    orderingPolicyVersion: MODEL_BENCHMARK_ORDERING_POLICY_VERSION,
    common: createDeepImprovementCommonProjectionState(),
    modelBenchmark: emptyVariant(),
    streamFrontiers: [],
    seenEvents: [],
  });
}

function matrixKey(key: TrialMatrixKey): string {
  return sha256Bytes(canonicalBytes(key));
}

function sortedUnique(values: readonly string[]): string[] {
  return [...new Set(values)].sort(compareString);
}

function unhandledRegisteredStems(): string[] {
  const handled = new Set<string>(
    MODEL_BENCHMARK_HANDLED_SPECIFIC_EVENT_STEMS,
  );
  return sortedUnique(ModelBenchmarkSpecificEventStems.filter(
    (stem) => !handled.has(stem),
  ));
}

function addArtifact(
  variant: ModelBenchmarkVariantProjection,
  artifact: ModelBenchmarkArtifactRecord,
): ModelBenchmarkVariantProjection {
  const artifacts = [
    ...variant.artifactIndex.artifacts.filter(
      (item) => item.artifactId !== artifact.artifactId,
    ),
    artifact,
  ].sort((left, right) => compareString(left.artifactId, right.artifactId));
  return { ...variant, artifactIndex: { artifacts } };
}

function updateCell(
  variant: ModelBenchmarkVariantProjection,
  event: ModelBenchmarkLedgerEvent,
  disposition: ModelBenchmarkCellRecord['disposition'],
): ModelBenchmarkVariantProjection {
  const scope = event.payload.scope;
  if (!('trialId' in scope) || !('trialMatrixKey' in event.payload.data)) {
    throw new ModelBenchmarkReducerError(
      'projection-field-invalid',
      'Trial cell event lacks its typed trial identity',
      'payload.scope.trialId',
    );
  }
  // Registry validation closes the data union before this property guard.
  const trialMatrixKey =
    event.payload.data.trialMatrixKey as TrialMatrixKey;
  const key = matrixKey(trialMatrixKey);
  const prior = variant.iterationConvergence.cells.find(
    (cell) => cell.cellKey === key,
  );
  const legalNext = {
    admitted: ['dispatched', 'invalid'],
    dispatched: ['completed', 'failed', 'invalid', 'unknown'],
    completed: ['observed', 'invalid'],
    observed: ['scored', 'invalid'],
    scored: ['invalid'],
    rejected: [],
    failed: ['invalid'],
    invalid: [],
    abstained: ['invalid'],
    unknown: ['invalid'],
  } satisfies Record<
    ModelBenchmarkCellRecord['disposition'],
    readonly ModelBenchmarkCellRecord['disposition'][]
  >;
  const isInitial = prior === undefined
    && (disposition === 'admitted' || disposition === 'rejected');
  const allowedNext: readonly ModelBenchmarkCellRecord['disposition'][] =
    prior === undefined ? [] : legalNext[prior.disposition];
  if (!isInitial
    && (prior === undefined
      || !allowedNext.includes(disposition))) {
    throw new ModelBenchmarkReducerError(
      'cell-transition-invalid',
      `Cell disposition cannot move from ${
        prior?.disposition ?? 'absent'
      } to ${disposition}`,
      `iterationConvergence.cells.${key}.disposition`,
    );
  }
  const cell: ModelBenchmarkCellRecord = {
    cellKey: key,
    trialId: String(scope.trialId),
    matrixKey: trialMatrixKey,
    disposition,
    sourceEventId: event.event_id,
    rawResultEventId: event.payload.stem === 'model_benchmark.trial_completed'
      ? event.event_id
      : prior?.rawResultEventId ?? null,
    rawObservationEventId:
      event.payload.stem === 'model_benchmark.trial_observation_recorded'
        ? event.event_id
        : prior?.rawObservationEventId ?? null,
    scoreEventId: event.payload.stem === 'model_benchmark.score_vector_observed'
      ? event.event_id
      : prior?.scoreEventId ?? null,
  };
  const cells = [
    ...variant.iterationConvergence.cells.filter(
      (item) => item.cellKey !== key,
    ),
    cell,
  ].sort((left, right) => compareString(left.cellKey, right.cellKey));
  return {
    ...variant,
    iterationConvergence: {
      ...variant.iterationConvergence,
      cells,
    },
  };
}

function assertSource(
  state: ModelBenchmarkProjectionState,
  eventId: string,
  expectedStems: readonly ModelBenchmarkEventStem[],
  payloadDigest: string | undefined,
  path: string,
): void {
  const source = state.seenEvents.find((item) => item.eventId === eventId);
  if (source === undefined
    || !expectedStems.includes(source.stem)
    || (payloadDigest !== undefined
      && source.payloadDigest !== payloadDigest)) {
    throw new ModelBenchmarkReducerError(
      'referential-integrity',
      'Referenced source event is absent, has the wrong type, or is digest-mismatched',
      path,
    );
  }
}

const TRIAL_INVALIDATION_SOURCE_STEMS = Object.freeze([
  'model_benchmark.trial_case_admitted',
  'model_benchmark.trial_dispatched',
  'model_benchmark.trial_completed',
  'model_benchmark.trial_failed',
  'model_benchmark.trial_unknown',
  'model_benchmark.trial_observation_recorded',
  'model_benchmark.score_vector_observed',
] as const satisfies readonly ModelBenchmarkEventStem[]);

const EXPOSURE_SOURCE_STEMS = Object.freeze([
  'model_benchmark.exposure_recorded',
  'model_benchmark.case_disclosed',
] as const satisfies readonly ModelBenchmarkEventStem[]);

const RANKING_EVIDENCE_SOURCE_STEMS = Object.freeze([
  'model_benchmark.score_vector_observed',
  'model_benchmark.usage_observed',
  'model_benchmark.judge_observation_recorded',
  'model_benchmark.oracle_label_attested',
  'model_benchmark.contamination_evidence_recorded',
  'model_benchmark.exposure_recorded',
  'model_benchmark.case_disclosed',
  'model_benchmark.case_retired',
  'model_benchmark.case_replaced',
] as const satisfies readonly ModelBenchmarkEventStem[]);

const VALIDITY_EVIDENCE_SOURCE_STEMS = Object.freeze([
  ...RANKING_EVIDENCE_SOURCE_STEMS,
  'model_benchmark.trial_observation_recorded',
  'model_benchmark.judge_calibration_sealed',
  'model_benchmark.validity_plan_sealed',
] as const satisfies readonly ModelBenchmarkEventStem[]);

function assertEventReferences(
  state: ModelBenchmarkProjectionState,
  event: ModelBenchmarkLedgerEvent,
): void {
  const data = event.payload.data;
  switch (event.payload.stem) {
    case 'model_benchmark.run_started': {
      const typed = payloadFor(event, event.payload.stem).data;
      assertSource(state, typed.declarationEventId,
        ['model_benchmark.run_declared'],
        typed.declarationPayloadDigest, 'data.declarationEventId');
      assertSource(state, typed.capsuleEventId,
        ['model_benchmark.benchmark_capsule_sealed'],
        typed.capsulePayloadDigest, 'data.capsuleEventId');
      assertSource(state, typed.workloadEventId,
        ['model_benchmark.workload_snapshot_sealed'],
        typed.workloadPayloadDigest, 'data.workloadEventId');
      break;
    }
    case 'model_benchmark.trial_completed': {
      const typed = payloadFor(event, event.payload.stem).data;
      assertSource(state, typed.dispatchedEventId,
        ['model_benchmark.trial_dispatched'],
        typed.dispatchedPayloadDigest, 'data.dispatchedEventId');
      break;
    }
    case 'model_benchmark.trial_failed':
    case 'model_benchmark.trial_unknown': {
      assertSource(state, String(data.dispatchedEventId),
        ['model_benchmark.trial_dispatched'], undefined,
        'data.dispatchedEventId');
      break;
    }
    case 'model_benchmark.trial_invalidated': {
      const typed = payloadFor(event, event.payload.stem).data;
      assertSource(state, typed.sourceEventId,
        TRIAL_INVALIDATION_SOURCE_STEMS,
        typed.sourcePayloadDigest, 'data.sourceEventId');
      break;
    }
    case 'model_benchmark.trial_observation_recorded': {
      const typed = payloadFor(event, event.payload.stem).data;
      assertSource(state, typed.completedEventId,
        ['model_benchmark.trial_completed'],
        typed.completedPayloadDigest, 'data.completedEventId');
      break;
    }
    case 'model_benchmark.score_vector_observed': {
      const typed = payloadFor(event, event.payload.stem).data;
      assertSource(state, typed.observationEventId,
        ['model_benchmark.trial_observation_recorded'],
        typed.observationPayloadDigest, 'data.observationEventId');
      if (typed.scoreWriteBackendRef
        !== MODEL_BENCHMARK_SCORE_WRITE_BACKEND_REF) {
        throw new ModelBenchmarkReducerError(
          'projection-field-invalid',
          'Score write backend must remain bound to the shared score service',
          'data.scoreWriteBackendRef',
        );
      }
      break;
    }
    case 'model_benchmark.usage_observed':
      assertSource(state, String(data.observationEventId),
        ['model_benchmark.trial_observation_recorded'], undefined,
        'data.observationEventId');
      break;
    case 'model_benchmark.judge_observation_recorded': {
      const typed = payloadFor(event, event.payload.stem).data;
      assertSource(state, typed.scoreEventId,
        ['model_benchmark.score_vector_observed'],
        typed.scorePayloadDigest, 'data.scoreEventId');
      break;
    }
    case 'model_benchmark.oracle_label_attested':
      if (data.priorAttestationEventId !== null) {
        assertSource(state, String(data.priorAttestationEventId),
          ['model_benchmark.oracle_label_attested'], undefined,
          'data.priorAttestationEventId');
      }
      break;
    case 'model_benchmark.contamination_evidence_recorded':
      for (const id of data.exposureEventIds as string[]) {
        assertSource(state, id, EXPOSURE_SOURCE_STEMS, undefined,
          'data.exposureEventIds');
      }
      break;
    case 'model_benchmark.validity_card_derived':
      for (const id of data.evidenceEventIds as string[]) {
        assertSource(state, id, VALIDITY_EVIDENCE_SOURCE_STEMS, undefined,
          'data.evidenceEventIds');
      }
      break;
    case 'model_benchmark.selection_evidence_sealed': {
      for (const id of data.evidenceEventIds as string[]) {
        assertSource(state, id, RANKING_EVIDENCE_SOURCE_STEMS, undefined,
          'data.evidenceEventIds');
      }
      for (const id of data.validityCardEventIds as string[]) {
        assertSource(state, id, ['model_benchmark.validity_card_derived'],
          undefined, 'data.validityCardEventIds');
      }
      break;
    }
    case 'model_benchmark.selection_reduction_requested': {
      const typed = payloadFor(event, event.payload.stem).data;
      assertSource(state, typed.sealedEvidenceEventId,
        ['model_benchmark.selection_evidence_sealed'],
        typed.sealedEvidencePayloadDigest, 'data.sealedEvidenceEventId');
      break;
    }
    case 'model_benchmark.run_closed':
      if (String(data.finalLedgerTailHash) !== event.payload.prevEventHash) {
        throw new ModelBenchmarkReducerError(
          'referential-integrity',
          'Run closure must bind the ledger tail immediately preceding it',
          'data.finalLedgerTailHash',
        );
      }
      break;
    default:
      break;
  }
}

function commonVetoes(state: ModelBenchmarkProjectionState): string[] {
  const status = state.common.modeStatus.statuses.find(
    (item) => item.workstream === 'model-benchmark',
  );
  return sortedUnique([
    ...(status?.blockingVetoCodes ?? []),
    ...state.common.iterationConvergence.hardVetoes.map(
      (veto) => veto.vetoCode,
    ),
  ]);
}

function cellTaskInstanceId(
  variant: ModelBenchmarkVariantProjection,
  cellKey: string,
): string | null {
  return variant.iterationConvergence.cells.find(
    (cell) => cell.cellKey === cellKey,
  )?.matrixKey.taskInstanceId ?? null;
}

function contaminationForTask(
  variant: ModelBenchmarkVariantProjection,
  taskInstanceId: string,
): Pick<
  ModelBenchmarkScoreRecord,
  'contaminationStatus' | 'contaminationEventIds'
> {
  const records = variant.scoringMatrix.contaminationEvidence.filter(
    (record) => record.taskInstanceId === taskInstanceId,
  );
  const priority = {
    confirmed: 4,
    suspected: 3,
    unknown: 2,
    clean: 1,
  } as const;
  const strongest = [...records].sort((left, right) =>
    priority[right.contaminationStatus]
      - priority[left.contaminationStatus]
    || compareString(
      left.contaminationEventId,
      right.contaminationEventId,
    ))[0];
  return {
    contaminationStatus: strongest?.contaminationStatus ?? 'not-observed',
    contaminationEventIds: records
      .map((record) => record.contaminationEventId)
      .sort(compareString),
  };
}

function caseEvidenceBlocks(
  state: ModelBenchmarkProjectionState,
  scores: readonly ModelBenchmarkScoreRecord[],
): string[] {
  const taskIds = new Set(scores.flatMap((score) => {
    const taskInstanceId = cellTaskInstanceId(
      state.modelBenchmark,
      score.cellKey,
    );
    return taskInstanceId === null ? [] : [taskInstanceId];
  }));
  const contaminationBlocks =
    state.modelBenchmark.scoringMatrix.contaminationEvidence.flatMap(
      (record) => taskIds.has(record.taskInstanceId)
        && record.contaminationStatus !== 'clean'
        ? [
          `contamination:${record.contaminationStatus}:${record.caseId}`,
        ]
        : [],
    );
  const lifecycleBlocks =
    state.modelBenchmark.scoringMatrix.caseLifecycle.flatMap((record) => {
      if (!taskIds.has(record.taskInstanceId)) return [];
      return [
        ...(record.disclosedEventId === null
          ? [] : [`case-disclosed:${record.caseId}`]),
        ...(record.retiredEventId === null
          ? [] : [`case-retired:${record.caseId}`]),
        ...(record.replacedEventId === null
          ? [] : [`case-replaced:${record.caseId}`]),
      ];
    });
  const exposureBlocks =
    state.modelBenchmark.scoringMatrix.exposures.flatMap(
      (record) => taskIds.has(record.taskInstanceId)
        ? [`case-exposed:${record.exposureClass}:${record.caseId}`]
        : [],
    );
  return sortedUnique([
    ...contaminationBlocks,
    ...lifecycleBlocks,
    ...exposureBlocks,
  ]);
}

function citedJudgeObservationBlocks(
  state: ModelBenchmarkProjectionState,
  evidenceEventIds: readonly string[],
  scores: readonly ModelBenchmarkScoreRecord[],
): string[] {
  const scoreEventIds = new Set(scores.map((score) => score.scoreEventId));
  const cited = state.modelBenchmark.scoringMatrix.judgeObservations.filter(
    (observation) =>
      evidenceEventIds.includes(observation.observationEventId)
      && scoreEventIds.has(observation.scoreEventId),
  );
  const latestByEvaluator = new Map<string, {
    readonly observation: ModelBenchmarkJudgeObservationRecord;
    readonly streamSequence: number;
  }>();
  for (const observation of cited) {
    const source = state.seenEvents.find(
      (event) => event.eventId === observation.observationEventId,
    );
    if (source === undefined) {
      return [`judge-observation:source-missing:${
        observation.observationEventId
      }`];
    }
    const evaluatorKey = canonicalJson({
      streamId: source.streamId,
      scoreEventId: observation.scoreEventId,
      blindedJudgeRef: observation.blindedJudgeRef,
      judgeFamilyCode: observation.judgeFamilyCode,
      judgeBuildFingerprint: observation.judgeBuildFingerprint,
      calibrationSliceId: observation.calibrationSliceId,
    });
    const prior = latestByEvaluator.get(evaluatorKey);
    if (prior === undefined || source.streamSequence > prior.streamSequence) {
      latestByEvaluator.set(evaluatorKey, {
        observation,
        streamSequence: source.streamSequence,
      });
    }
  }
  return sortedUnique([...latestByEvaluator.values()].flatMap(
    ({ observation }) => {
      if (observation.abstained) {
        return [
          `judge-observation:abstained:${observation.observationEventId}`,
        ];
      }
      if (observation.disagreementState === 'unknown'
        || observation.disagreementState === 'not-observed') {
        return [
          `judge-observation:inconclusive:${observation.observationEventId}`,
        ];
      }
      if (observation.confidence === 0) {
        return [
          `judge-observation:confidence-floor:${
            observation.observationEventId
          }`,
        ];
      }
      if (observation.uncertainty === 1) {
        return [
          `judge-observation:uncertainty-max:${
            observation.observationEventId
          }`,
        ];
      }
      return [];
    },
  ));
}

function deriveRankings(
  state: ModelBenchmarkProjectionState,
  evidenceSetId: string,
  requestEventId: string,
  reducerContractVersion: string,
): ModelBenchmarkRankingRecord[] {
  const sealed = state.modelBenchmark.scoringMatrix.selectionEvidence.find(
    (item) => item.evidenceSetId === evidenceSetId,
  );
  if (sealed === undefined) {
    throw new ModelBenchmarkReducerError(
      'referential-integrity',
      'Selection reduction requires captured sealed evidence',
      'data.sealedEvidenceEventId',
    );
  }
  const scores = state.modelBenchmark.scoringMatrix.scores.filter(
    (score) => sealed.evidenceEventIds.includes(score.scoreEventId),
  );
  const validity = state.modelBenchmark.scoringMatrix.validity.filter(
    (card) => sealed.validityCardEventIds.includes(card.validityEventId),
  );
  const validityPlanIds = new Set(
    validity.map((card) => card.validityPlanId),
  );
  const unresolvedValidityBlocks =
    state.modelBenchmark.scoringMatrix.validityUnknowns.flatMap((unknown) => (
      validityPlanIds.has(unknown.validityPlanId)
        ? [
          ...(unknown.blocker
            ? [`validity-unknown:${unknown.unknownCode}`]
            : []),
          ...unknown.requiredEvidenceRefs.map(
            (reference) => `validity-evidence-unresolved:${reference}`,
          ),
        ]
        : []
    ));
  const commonBlocks = commonVetoes(state);
  const candidates = sortedUnique(scores.map((score) => score.candidateId));
  const unranked = candidates.map((candidateId) => {
    const candidateScores = scores.filter(
      (score) => score.candidateId === candidateId,
    );
    const components = candidateScores.flatMap(
      (score) => score.scoreVector.components,
    );
    const blocking = sortedUnique([
      ...commonBlocks,
      ...caseEvidenceBlocks(state, candidateScores),
      ...citedJudgeObservationBlocks(
        state,
        sealed.evidenceEventIds,
        candidateScores,
      ),
      ...unresolvedValidityBlocks,
      ...validity.flatMap((card) => card.state === 'valid'
        ? []
        : card.blockerCodes.length > 0 ? card.blockerCodes : [card.state]),
      ...components.flatMap((component) =>
        component.hardFloorStatus !== 'pass'
          && component.hardFloorStatus !== 'not-applicable'
          ? [`hard-floor:${component.dimensionCode}`]
          : component.measurementStatus !== 'observed'
            ? [`measurement:${component.dimensionCode}`]
            : []),
    ]);
    const observed = components.filter(
      (component) => component.measurementStatus === 'observed',
    );
    const eligible = blocking.length === 0 && observed.length > 0;
    return {
      evidenceSetId,
      requestEventId,
      reducerContractVersion,
      candidateId,
      aggregateScore: eligible
        ? observed.reduce((total, component) => total + component.rawScore, 0)
          / observed.length
        : null,
      uncertainty: eligible
        ? observed.reduce(
          (total, component) => total + component.uncertainty,
          0,
        ) / observed.length
        : null,
      eligible,
      rank: null,
      blockingVetoCodes: blocking,
      sourceScoreEventIds: candidateScores
        .map((score) => score.scoreEventId)
        .sort(compareString),
    } satisfies ModelBenchmarkRankingRecord;
  });
  const orderedEligible = unranked
    .filter((item) => item.eligible)
    .sort((left, right) =>
      (right.aggregateScore ?? 0) - (left.aggregateScore ?? 0)
      || compareString(left.candidateId, right.candidateId));
  return unranked.map((item) => ({
    ...item,
    rank: item.eligible
      ? orderedEligible.findIndex(
        (candidate) => candidate.candidateId === item.candidateId,
      ) + 1
      : null,
  })).sort((left, right) => compareString(left.candidateId, right.candidateId));
}

function rederiveExistingRankings(
  state: ModelBenchmarkProjectionState,
  variant: ModelBenchmarkVariantProjection,
): ModelBenchmarkVariantProjection {
  const requests = new Map<string, ModelBenchmarkRankingRecord>();
  for (const ranking of variant.scoringMatrix.rankings) {
    if (!requests.has(ranking.evidenceSetId)) {
      requests.set(ranking.evidenceSetId, ranking);
    }
  }
  const staged = { ...state, modelBenchmark: variant };
  const rankings = [...requests.values()].flatMap((request) =>
    deriveRankings(
      staged,
      request.evidenceSetId,
      request.requestEventId,
      request.reducerContractVersion,
    ));
  return {
    ...variant,
    scoringMatrix: {
      ...variant.scoringMatrix,
      rankings: rankings.sort((left, right) =>
        compareString(
          `${left.evidenceSetId}:${left.candidateId}`,
          `${right.evidenceSetId}:${right.candidateId}`,
        )),
    },
  };
}

function upsertCaseLifecycle(
  variant: ModelBenchmarkVariantProjection,
  record: ModelBenchmarkCaseLifecycleRecord,
): ModelBenchmarkVariantProjection {
  return {
    ...variant,
    scoringMatrix: {
      ...variant.scoringMatrix,
      caseLifecycle: [
        ...variant.scoringMatrix.caseLifecycle.filter(
          (item) => item.caseId !== record.caseId,
        ),
        record,
      ].sort((left, right) => compareString(left.caseId, right.caseId)),
    },
  };
}

function caseLifecycleRecord(
  variant: ModelBenchmarkVariantProjection,
  caseId: string,
  taskInstanceId: string,
  taskFamilyId: string,
): ModelBenchmarkCaseLifecycleRecord {
  return variant.scoringMatrix.caseLifecycle.find(
    (record) => record.caseId === caseId,
  ) ?? {
    caseId,
    taskInstanceId,
    taskFamilyId,
    disclosedEventId: null,
    disclosedAt: null,
    disclosureRef: null,
    disclosureDigest: null,
    retiredEventId: null,
    retiredAt: null,
    retirementReasonCode: null,
    retirementEvidenceRef: null,
    retirementEvidenceDigest: null,
    replacedEventId: null,
    replacementCaseId: null,
    replacementCaseDigest: null,
    replacementReasonCode: null,
    lineageReceiptRef: null,
  };
}

function refreshStatus(
  state: ModelBenchmarkProjectionState,
  variant: ModelBenchmarkVariantProjection,
): ModelBenchmarkVariantProjection {
  const cells = variant.iterationConvergence.cells;
  const terminal = cells.filter((cell) => [
    'completed', 'failed', 'invalid', 'rejected', 'scored', 'unknown',
  ].includes(cell.disposition)).length;
  const rankings = variant.scoringMatrix.rankings;
  const blockingVetoCodes = commonVetoes({ ...state, modelBenchmark: variant });
  return {
    ...variant,
    modeStatus: {
      commonStatusWorkstream: 'model-benchmark',
      activeMatrixProfile:
        variant.artifactIndex.artifacts.find(
          (artifact) => artifact.artifactKind === 'design',
        )?.artifactId ?? null,
      incumbentCandidateId:
        rankings.find((ranking) => ranking.rank === 1)?.candidateId ?? null,
      matrixCoverage: cells.length === 0 ? 0 : terminal / cells.length,
      rankingState: blockingVetoCodes.length > 0
        || rankings.some((ranking) => !ranking.eligible)
        ? 'blocked'
        : rankings.length > 0 ? 'ranked' : 'unranked',
      blockingCellKeys: cells.filter((cell) => [
        'failed', 'invalid', 'unknown',
      ].includes(cell.disposition)).map((cell) => cell.cellKey).sort(compareString),
      blockingVetoCodes,
    },
  };
}

function applySpecificEvent(
  state: ModelBenchmarkProjectionState,
  event: ModelBenchmarkLedgerEvent,
): ModelBenchmarkVariantProjection {
  assertEventReferences(state, event);
  let variant = state.modelBenchmark;
  const scope = event.payload.scope;
  const data = event.payload.data;
  switch (event.payload.stem) {
    case 'model_benchmark.run_declared': {
      const typed = payloadFor(event, event.payload.stem);
      if (variant.run.runId !== null
        && (variant.run.runId !== typed.scope.runId
          || variant.run.lineageId !== typed.scope.lineageId)) {
        throw new ModelBenchmarkReducerError(
          'projection-field-invalid',
          'Run identity cannot change during replay',
          'payload.scope.runId',
        );
      }
      variant = {
        ...variant,
        run: {
          ...variant.run,
          runId: typed.scope.runId,
          lineageId: typed.scope.lineageId,
          generation: typed.data.generation,
          state: 'declared',
          declarationEventId: event.event_id,
        },
      };
      break;
    }
    case 'model_benchmark.benchmark_capsule_sealed':
      variant = {
        ...variant,
        run: { ...variant.run, capsuleEventId: event.event_id },
      };
      variant = addArtifact(variant, {
        artifactId: String(scope.capsuleId),
        artifactKind: 'benchmark-capsule',
        reference: String(data.capsuleRef),
        digest: String(data.capsuleDigest),
        producerEventId: event.event_id,
        sourceEventIds: [],
      });
      break;
    case 'model_benchmark.workload_snapshot_sealed':
      variant = {
        ...variant,
        run: { ...variant.run, workloadEventId: event.event_id },
      };
      variant = addArtifact(variant, {
        artifactId: String(scope.workloadSnapshotId),
        artifactKind: 'workload-snapshot',
        reference: String(data.workloadSnapshotRef),
        digest: String(data.workloadSnapshotDigest),
        producerEventId: event.event_id,
        sourceEventIds: [],
      });
      break;
    case 'model_benchmark.run_started':
      variant = { ...variant, run: { ...variant.run, state: 'running' } };
      break;
    case 'model_benchmark.run_paused':
      variant = {
        ...variant,
        run: { ...variant.run, state: 'paused' },
        iterationConvergence: {
          ...variant.iterationConvergence,
          paused: true,
        },
      };
      break;
    case 'model_benchmark.run_resumed':
      variant = {
        ...variant,
        run: { ...variant.run, state: 'running' },
        iterationConvergence: {
          ...variant.iterationConvergence,
          paused: false,
        },
      };
      break;
    case 'model_benchmark.run_closed':
      variant = {
        ...variant,
        run: {
          ...variant.run,
          state: 'closed',
          terminalOutcome: data.terminalOutcome as
            'aborted' | 'completed' | 'quarantined',
        },
      };
      break;
    case 'model_benchmark.benchmark_design_declared':
      variant = {
        ...variant,
        iterationConvergence: {
          ...variant.iterationConvergence,
          designIds: sortedUnique([
            ...variant.iterationConvergence.designIds,
            String(scope.designId),
          ]),
        },
      };
      variant = addArtifact(variant, {
        artifactId: String(scope.designId),
        artifactKind: 'design',
        reference: String(data.designRef),
        digest: String(data.designDigest),
        producerEventId: event.event_id,
        sourceEventIds: [],
      });
      break;
    case 'model_benchmark.trial_block_declared':
      variant = {
        ...variant,
        iterationConvergence: {
          ...variant.iterationConvergence,
          trialBlockIds: sortedUnique([
            ...variant.iterationConvergence.trialBlockIds,
            String(scope.trialBlockId),
          ]),
        },
      };
      break;
    case 'model_benchmark.trial_case_admitted':
      variant = updateCell(variant, event, 'admitted');
      break;
    case 'model_benchmark.trial_case_rejected':
      variant = updateCell(variant, event, 'rejected');
      break;
    case 'model_benchmark.trial_dispatched':
      variant = updateCell(variant, event, 'dispatched');
      break;
    case 'model_benchmark.trial_completed':
      variant = updateCell(variant, event, 'completed');
      variant = addArtifact(variant, {
        artifactId: event.event_id,
        artifactKind: 'raw-result',
        reference: String(data.rawResultRef),
        digest: String(data.rawResultDigest),
        producerEventId: event.event_id,
        sourceEventIds: [String(data.dispatchedEventId)],
      });
      break;
    case 'model_benchmark.trial_failed':
      variant = updateCell(variant, event, 'failed');
      break;
    case 'model_benchmark.trial_unknown':
      variant = updateCell(variant, event, 'unknown');
      break;
    case 'model_benchmark.trial_invalidated':
      variant = updateCell(variant, event, 'invalid');
      break;
    case 'model_benchmark.trial_observation_recorded': {
      const typed = payloadFor(event, event.payload.stem);
      variant = updateCell(variant, event, 'observed');
      variant = {
        ...variant,
        scoringMatrix: {
          ...variant.scoringMatrix,
          rawObservations: [
            ...variant.scoringMatrix.rawObservations,
            {
              trialId: typed.scope.trialId,
              cellKey: matrixKey(typed.data.trialMatrixKey),
              completedEventId: typed.data.completedEventId,
              observationEventId: event.event_id,
              rawOutputRef: typed.data.rawOutputRef,
              rawOutputDigest: typed.data.rawOutputDigest,
              evaluatorObservationRef: typed.data.evaluatorObservationRef,
              evaluatorObservationDigest:
                typed.data.evaluatorObservationDigest,
            },
          ].sort((left, right) =>
            compareString(left.observationEventId, right.observationEventId)),
        },
      };
      break;
    }
    case 'model_benchmark.score_vector_observed': {
      const typed = payloadFor(event, event.payload.stem);
      const contamination = contaminationForTask(
        variant,
        typed.scope.taskInstanceId,
      );
      variant = updateCell(variant, event, 'scored');
      variant = {
        ...variant,
        scoringMatrix: {
          ...variant.scoringMatrix,
          scores: [
            ...variant.scoringMatrix.scores,
            {
              trialId: typed.scope.trialId,
              candidateId: typed.scope.candidateId,
              cellKey: matrixKey(typed.data.trialMatrixKey),
              observationEventId: typed.data.observationEventId,
              scoreEventId: event.event_id,
              scorePolicyVersion: typed.data.scorePolicyVersion,
              scoreWriteBackendRef: typed.data.scoreWriteBackendRef,
              scoreVector: typed.data.scoreVector,
              ...contamination,
            },
          ].sort((left, right) =>
            compareString(left.scoreEventId, right.scoreEventId)),
        },
      };
      variant = addArtifact(variant, {
        artifactId: event.event_id,
        artifactKind: 'score-vector',
        reference: typed.data.scoringReceiptRef,
        digest: event.payload.payloadDigest,
        producerEventId: event.event_id,
        sourceEventIds: [typed.data.observationEventId],
      });
      break;
    }
    case 'model_benchmark.usage_observed': {
      const typed = payloadFor(event, event.payload.stem);
      variant = addArtifact(variant, {
        artifactId: event.event_id,
        artifactKind: 'usage',
        reference: typed.data.usageReceiptRef,
        digest: typed.data.usageReceiptDigest,
        producerEventId: event.event_id,
        sourceEventIds: [typed.data.observationEventId],
      });
      variant = {
        ...variant,
        scoringMatrix: {
          ...variant.scoringMatrix,
          costLatencySlices: [
            ...variant.scoringMatrix.costLatencySlices,
            {
              sliceId: event.event_id,
              trialId: typed.scope.trialId,
              candidateId: typed.scope.candidateId,
              cellKey: matrixKey(typed.data.trialMatrixKey),
              observationEventId: typed.data.observationEventId,
              usageEventId: event.event_id,
              usage: typed.data.usage,
              latency: typed.data.latency,
              usageReceiptRef: typed.data.usageReceiptRef,
              usageReceiptDigest: typed.data.usageReceiptDigest,
            },
          ].sort((left, right) =>
            compareString(left.sliceId, right.sliceId)),
        },
      };
      break;
    }
    case 'model_benchmark.judge_observation_recorded': {
      const typed = payloadFor(event, event.payload.stem);
      const contamination = contaminationForTask(
        variant,
        typed.scope.taskInstanceId,
      );
      const result: ModelBenchmarkPairwiseComparisonResultRecord['result'] =
        typed.data.abstained
        ? 'abstained'
        : typed.data.disagreementState === 'unknown'
          || typed.data.disagreementState === 'not-observed'
          ? 'inconclusive'
          : 'observed';
      variant = {
        ...variant,
        scoringMatrix: {
          ...variant.scoringMatrix,
          judgeObservations: [
            ...variant.scoringMatrix.judgeObservations,
            {
              observationEventId: event.event_id,
              trialId: typed.scope.trialId,
              candidateId: typed.scope.candidateId,
              cellKey: matrixKey(typed.data.trialMatrixKey),
              scoreEventId: typed.data.scoreEventId,
              blindedJudgeRef: typed.data.blindedJudgeRef,
              judgeFamilyCode: typed.data.judgeFamilyCode,
              judgeBuildFingerprint: typed.data.judgeBuildFingerprint,
              calibrationSliceId: typed.data.calibrationSliceId,
              orderProbeOutcome: typed.data.orderProbeOutcome,
              styleProbeOutcome: typed.data.styleProbeOutcome,
              confidence: typed.data.confidence,
              uncertainty: typed.data.uncertainty,
              abstained: typed.data.abstained,
              disagreementState: typed.data.disagreementState,
              observationRef: typed.data.observationRef,
              observationDigest: typed.data.observationDigest,
            },
          ].sort((left, right) =>
            compareString(left.observationEventId, right.observationEventId)),
          pairwiseComparisonResults: [
            ...variant.scoringMatrix.pairwiseComparisonResults,
            {
              comparisonResultId: event.event_id,
              pairedBlockId: typed.scope.pairedBlockId,
              trialId: typed.scope.trialId,
              candidateId: typed.scope.candidateId,
              cellKey: matrixKey(typed.data.trialMatrixKey),
              scoreEventId: typed.data.scoreEventId,
              judgeObservationEventId: event.event_id,
              result,
              confidence: typed.data.confidence,
              uncertainty: typed.data.uncertainty,
              ...contamination,
            },
          ].sort((left, right) =>
            compareString(
              left.comparisonResultId,
              right.comparisonResultId,
            )),
        },
      };
      break;
    }
    case 'model_benchmark.oracle_label_attested': {
      const typed = payloadFor(event, event.payload.stem);
      variant = {
        ...variant,
        scoringMatrix: {
          ...variant.scoringMatrix,
          oracleLabels: [
            ...variant.scoringMatrix.oracleLabels,
            {
              attestationEventId: event.event_id,
              caseId: typed.scope.caseId,
              taskInstanceId: typed.scope.taskInstanceId,
              taskFamilyId: typed.scope.taskFamilyId,
              oracleVersion: typed.data.oracleVersion,
              labelRef: typed.data.labelRef,
              labelDigest: typed.data.labelDigest,
              attestationStatus: typed.data.attestationStatus,
              confidence: typed.data.confidence,
              uncertainty: typed.data.uncertainty,
              priorAttestationEventId:
                typed.data.priorAttestationEventId,
              attestationReceiptRef: typed.data.attestationReceiptRef,
            },
          ].sort((left, right) =>
            compareString(
              left.attestationEventId,
              right.attestationEventId,
            )),
        },
      };
      break;
    }
    case 'model_benchmark.contamination_evidence_recorded': {
      const typed = payloadFor(event, event.payload.stem);
      const record: ModelBenchmarkContaminationEvidenceRecord = {
        contaminationEventId: event.event_id,
        caseId: typed.scope.caseId,
        taskInstanceId: typed.scope.taskInstanceId,
        taskFamilyId: typed.scope.taskFamilyId,
        contaminationStatus: typed.data.contaminationStatus,
        detectorFingerprint: typed.data.detectorFingerprint,
        evidenceRef: typed.data.evidenceRef,
        evidenceDigest: typed.data.evidenceDigest,
        exposureEventIds: [...typed.data.exposureEventIds].sort(compareString),
        reasonCode: typed.data.reasonCode,
      };
      variant = {
        ...variant,
        scoringMatrix: {
          ...variant.scoringMatrix,
          contaminationEvidence: [
            ...variant.scoringMatrix.contaminationEvidence,
            record,
          ].sort((left, right) => compareString(
            left.contaminationEventId,
            right.contaminationEventId,
          )),
        },
      };
      const contamination = contaminationForTask(
        variant,
        typed.scope.taskInstanceId,
      );
      variant = {
        ...variant,
        scoringMatrix: {
          ...variant.scoringMatrix,
          scores: variant.scoringMatrix.scores.map((score) =>
            cellTaskInstanceId(variant, score.cellKey)
              === typed.scope.taskInstanceId
              ? { ...score, ...contamination }
              : score),
          pairwiseComparisonResults:
            variant.scoringMatrix.pairwiseComparisonResults.map(
              (comparison) =>
                cellTaskInstanceId(variant, comparison.cellKey)
                  === typed.scope.taskInstanceId
                  ? { ...comparison, ...contamination }
                  : comparison,
            ),
        },
      };
      variant = rederiveExistingRankings(state, variant);
      break;
    }
    case 'model_benchmark.exposure_recorded': {
      const typed = payloadFor(event, event.payload.stem);
      variant = {
        ...variant,
        scoringMatrix: {
          ...variant.scoringMatrix,
          exposures: [
            ...variant.scoringMatrix.exposures,
            {
              exposureEventId: event.event_id,
              caseId: typed.scope.caseId,
              taskInstanceId: typed.scope.taskInstanceId,
              taskFamilyId: typed.scope.taskFamilyId,
              exposureClass: typed.data.exposureClass,
              exposedActorRef: typed.data.exposedActorRef,
              firstExposedAt: typed.data.firstExposedAt,
              evidenceRef: typed.data.evidenceRef,
              evidenceDigest: typed.data.evidenceDigest,
            },
          ].sort((left, right) =>
            compareString(left.exposureEventId, right.exposureEventId)),
        },
      };
      variant = rederiveExistingRankings(state, variant);
      break;
    }
    case 'model_benchmark.case_disclosed': {
      const typed = payloadFor(event, event.payload.stem);
      const prior = caseLifecycleRecord(
        variant,
        typed.scope.caseId,
        typed.scope.taskInstanceId,
        typed.scope.taskFamilyId,
      );
      variant = upsertCaseLifecycle(variant, {
        ...prior,
        disclosedEventId: event.event_id,
        disclosedAt: typed.data.disclosedAt,
        disclosureRef: typed.data.disclosureRef,
        disclosureDigest: typed.data.disclosureDigest,
      });
      variant = {
        ...variant,
        scoringMatrix: {
          ...variant.scoringMatrix,
          exposures: [
            ...variant.scoringMatrix.exposures,
            {
              exposureEventId: event.event_id,
              caseId: typed.scope.caseId,
              taskInstanceId: typed.scope.taskInstanceId,
              taskFamilyId: typed.scope.taskFamilyId,
              exposureClass: 'public' as const,
              exposedActorRef: 'public',
              firstExposedAt: typed.data.disclosedAt,
              evidenceRef: typed.data.disclosureRef,
              evidenceDigest: typed.data.disclosureDigest,
            },
          ].sort((left, right) =>
            compareString(left.exposureEventId, right.exposureEventId)),
        },
      };
      variant = rederiveExistingRankings(state, variant);
      break;
    }
    case 'model_benchmark.case_retired': {
      const typed = payloadFor(event, event.payload.stem);
      const prior = caseLifecycleRecord(
        variant,
        typed.scope.caseId,
        typed.scope.taskInstanceId,
        typed.scope.taskFamilyId,
      );
      variant = upsertCaseLifecycle(variant, {
        ...prior,
        retiredEventId: event.event_id,
        retiredAt: typed.data.retiredAt,
        retirementReasonCode: typed.data.retirementReasonCode,
        retirementEvidenceRef: typed.data.retirementEvidenceRef,
        retirementEvidenceDigest: typed.data.retirementEvidenceDigest,
      });
      variant = rederiveExistingRankings(state, variant);
      break;
    }
    case 'model_benchmark.case_replaced': {
      const typed = payloadFor(event, event.payload.stem);
      const prior = caseLifecycleRecord(
        variant,
        typed.scope.caseId,
        typed.scope.taskInstanceId,
        typed.scope.taskFamilyId,
      );
      variant = upsertCaseLifecycle(variant, {
        ...prior,
        replacedEventId: event.event_id,
        replacementCaseId: typed.data.replacementCaseId,
        replacementCaseDigest: typed.data.replacementCaseDigest,
        replacementReasonCode: typed.data.replacementReasonCode,
        lineageReceiptRef: typed.data.lineageReceiptRef,
      });
      variant = rederiveExistingRankings(state, variant);
      break;
    }
    case 'model_benchmark.judge_calibration_sealed':
      variant = addArtifact(variant, {
        artifactId: String(scope.judgeCalibrationId),
        artifactKind: 'judge-calibration',
        reference: String(data.calibrationRef),
        digest: String(data.calibrationDigest),
        producerEventId: event.event_id,
        sourceEventIds: [],
      });
      break;
    case 'model_benchmark.validity_plan_sealed':
      variant = addArtifact(variant, {
        artifactId: String(scope.validityPlanId),
        artifactKind: 'validity-plan',
        reference: String(data.validityPlanRef),
        digest: String(data.validityPlanDigest),
        producerEventId: event.event_id,
        sourceEventIds: [],
      });
      break;
    case 'model_benchmark.validity_card_derived': {
      const evidenceEventIds = data.evidenceEventIds as string[];
      const validityPlanId = String(scope.validityPlanId);
      const validityUnknowns =
        variant.scoringMatrix.validityUnknowns.flatMap((unknown) => {
          if (unknown.validityPlanId !== validityPlanId) return [unknown];
          const requiredEvidenceRefs = unknown.requiredEvidenceRefs.filter(
            (reference) => !evidenceEventIds.includes(reference),
          );
          return requiredEvidenceRefs.length === 0
            ? []
            : [{ ...unknown, requiredEvidenceRefs }];
        });
      variant = {
        ...variant,
        iterationConvergence: {
          ...variant.iterationConvergence,
          unresolvedEvidenceRefs: sortedUnique(
            validityUnknowns.flatMap(
              (unknown) => unknown.requiredEvidenceRefs,
            ),
          ),
        },
        scoringMatrix: {
          ...variant.scoringMatrix,
          validity: [
            ...variant.scoringMatrix.validity,
            {
              validityPlanId: String(scope.validityPlanId),
              validityEventId: event.event_id,
              state: data.state as 'invalid' | 'unknown' | 'valid',
              blockerCodes: [...data.blockerCodes as string[]].sort(compareString),
              uncertainty: Number(data.uncertainty),
            },
          ].sort((left, right) =>
            compareString(left.validityEventId, right.validityEventId)),
          validityUnknowns,
        },
      };
      variant = rederiveExistingRankings(state, variant);
      break;
    }
    case 'model_benchmark.validity_unknown_recorded': {
      const validityUnknowns = [
        ...variant.scoringMatrix.validityUnknowns,
        {
          validityPlanId: String(scope.validityPlanId),
          validityUnknownEventId: event.event_id,
          unknownCode: String(data.unknownCode),
          requiredEvidenceRefs:
            [...data.requiredEvidenceRefs as string[]].sort(compareString),
          blocker: Boolean(data.blocker),
        },
      ].sort((left, right) => compareString(
        left.validityUnknownEventId,
        right.validityUnknownEventId,
      ));
      variant = {
        ...variant,
        iterationConvergence: {
          ...variant.iterationConvergence,
          unresolvedEvidenceRefs: sortedUnique([
            ...variant.iterationConvergence.unresolvedEvidenceRefs,
            ...data.requiredEvidenceRefs as string[],
          ]),
        },
        scoringMatrix: {
          ...variant.scoringMatrix,
          validityUnknowns,
        },
      };
      variant = rederiveExistingRankings(state, variant);
      break;
    }
    case 'model_benchmark.selection_evidence_sealed':
      variant = {
        ...variant,
        scoringMatrix: {
          ...variant.scoringMatrix,
          selectionEvidence: [
            ...variant.scoringMatrix.selectionEvidence,
            {
              evidenceSetId: String(scope.evidenceSetId),
              sealedEventId: event.event_id,
              evidenceEventIds:
                [...data.evidenceEventIds as string[]].sort(compareString),
              validityCardEventIds:
                [...data.validityCardEventIds as string[]].sort(compareString),
              evidenceSetDigest: String(data.evidenceSetDigest),
            },
          ].sort((left, right) =>
            compareString(left.sealedEventId, right.sealedEventId)),
        },
      };
      variant = addArtifact(variant, {
        artifactId: String(scope.evidenceSetId),
        artifactKind: 'selection-evidence',
        reference: String(data.manifestRef),
        digest: String(data.manifestDigest),
        producerEventId: event.event_id,
        sourceEventIds: [...data.evidenceEventIds as string[]].sort(compareString),
      });
      break;
    case 'model_benchmark.selection_reduction_requested': {
      const typed = payloadFor(event, event.payload.stem);
      const rankings = deriveRankings(
        { ...state, modelBenchmark: variant },
        typed.scope.evidenceSetId,
        event.event_id,
        typed.data.reducerContractVersion,
      );
      variant = {
        ...variant,
        scoringMatrix: {
          ...variant.scoringMatrix,
          rankings: [
            ...variant.scoringMatrix.rankings.filter(
              (ranking) =>
                ranking.evidenceSetId !== typed.scope.evidenceSetId,
            ),
            ...rankings,
          ].sort((left, right) =>
            compareString(
              `${left.evidenceSetId}:${left.candidateId}`,
              `${right.evidenceSetId}:${right.candidateId}`,
            )),
        },
      };
      break;
    }
    default:
      throw new ModelBenchmarkReducerError(
        'unhandled-event-stem',
        `Registered model-benchmark event has no fold case: ${
          String(event.payload.stem)
        }`,
        'payload.stem',
      );
  }
  return refreshStatus(state, variant);
}

function advanceReplay(
  state: ModelBenchmarkProjectionState,
  event: ModelBenchmarkLedgerEvent,
): Pick<ModelBenchmarkProjectionState, 'seenEvents' | 'streamFrontiers'> {
  const seen: ModelBenchmarkSeenEvent = {
    eventId: event.event_id,
    eventDigest: eventDigest(event),
    payloadDigest: event.payload.payloadDigest,
    stem: event.payload.stem,
    streamId: event.stream_id,
    streamSequence: event.stream_sequence,
  };
  const seenEvents = [...state.seenEvents, seen].sort((left, right) =>
    compareString(left.streamId, right.streamId)
    || left.streamSequence - right.streamSequence
    || compareString(left.eventId, right.eventId));
  const streamFrontiers = [
    ...state.streamFrontiers.filter(
      (frontier) => frontier.streamId !== event.stream_id,
    ),
    { streamId: event.stream_id, lastSequence: event.stream_sequence },
  ].sort((left, right) => compareString(left.streamId, right.streamId));
  return { seenEvents, streamFrontiers };
}

function applyEvent(
  state: ModelBenchmarkProjectionState,
  event: ModelBenchmarkLedgerEvent,
): ModelBenchmarkProjectionState {
  const existing = state.seenEvents.find(
    (item) => item.eventId === event.event_id,
  );
  if (existing !== undefined) {
    if (existing.eventDigest !== eventDigest(event)) {
      throw new ModelBenchmarkReducerError(
        'duplicate-event-conflict',
        'Duplicate event ID carries different canonical bytes',
        'event_id',
      );
    }
    return state;
  }
  let common = state.common;
  let modelBenchmark = state.modelBenchmark;
  if (isModelBenchmarkSpecificEventStem(event.payload.stem)) {
    modelBenchmark = applySpecificEvent(state, event);
  } else {
    const verifiedBoundary = {
      event: { effective: { envelope: event } },
    };
    // The common surface revalidates the envelope; this cast only adapts the
    // already registry-validated event to the verified-ledger transport shape.
    const reduced = DEEP_IMPROVEMENT_COMMON_REDUCER_SURFACE.reduce(
      verifiedBoundary as unknown as VerifiedLedgerEvent,
      common as unknown as Parameters<
        typeof DEEP_IMPROVEMENT_COMMON_REDUCER_SURFACE.reduce
      >[1],
    );
    common = reduced.state as unknown as typeof common;
    modelBenchmark = refreshStatus(
      { ...state, common },
      modelBenchmark,
    );
  }
  const replay = advanceReplay(state, event);
  const next: ModelBenchmarkProjectionState = {
    ...state,
    common,
    modelBenchmark,
    ...replay,
  };
  assertModelBenchmarkProjectionState(next);
  return immutableModelBenchmarkProjectionClone(next);
}

export const MODEL_BENCHMARK_REDUCER_SET:
ModeReducerSet<ModelBenchmarkModeContractState> = Object.freeze({
  persistedFields: PERSISTED_FIELDS,
  definitions: Object.freeze([
    Object.freeze({
      reducerId: 'model-benchmark:common-delegate',
      reducerVersion: MODEL_BENCHMARK_REDUCER_VERSION,
      stateVersion: MODEL_BENCHMARK_PROJECTION_SCHEMA_VERSION,
      ownedFields: Object.freeze(['common'] as const),
      inputEventTypes: Object.freeze(
        DEEP_IMPROVEMENT_COMMON_FOLD_BRANCH.eventStems.map(
          (stem) => ModelBenchmarkWireEventTypes[
            stem as DeepImprovementCommonEventStem
          ],
        ),
      ),
      replaySource: 'verified-ledger-events-only',
      outputRule: 'immutable',
    }),
    Object.freeze({
      reducerId: MODEL_BENCHMARK_REDUCER_ID,
      reducerVersion: MODEL_BENCHMARK_REDUCER_VERSION,
      stateVersion: MODEL_BENCHMARK_PROJECTION_SCHEMA_VERSION,
      ownedFields: Object.freeze(PERSISTED_FIELDS.filter(
        (field) => field !== 'common',
      )),
      inputEventTypes: Object.freeze(
        ModelBenchmarkSpecificEventStems.map(
          (stem) => ModelBenchmarkWireEventTypes[stem],
        ),
      ),
      replaySource: 'verified-ledger-events-only',
      outputRule: 'immutable',
    }),
  ]),
});

export type ModelBenchmarkReducerSurface = Pick<
  ModeContract<ModelBenchmarkModeContractState>,
  'reducers' | 'reduce'
>;

export function reduceModelBenchmarkVerifiedEvent(
  verified: VerifiedLedgerEvent,
  state: Readonly<ModelBenchmarkModeContractState>,
): ModeReductionResult<ModelBenchmarkModeContractState> {
  assertModelBenchmarkProjectionState(state);
  const unhandled = unhandledRegisteredStems();
  if (unhandled.length > 0) {
    throw new ModelBenchmarkReducerError(
      'unhandled-event-stem',
      `Registered model-benchmark event stems lack fold cases: ${
        unhandled.join(', ')
      }`,
      'reducers.model-benchmark.inputEventTypes',
    );
  }
  const event = typedEventFromVerified(verified);
  return Object.freeze({
    reducerId: isModelBenchmarkSpecificEventStem(event.payload.stem)
      ? MODEL_BENCHMARK_REDUCER_ID
      : 'model-benchmark:common-delegate',
    stateVersion: MODEL_BENCHMARK_PROJECTION_SCHEMA_VERSION,
    appliedEventId: event.event_id,
    state: applyEvent(state, event) as ModelBenchmarkModeContractState,
  });
}

export const MODEL_BENCHMARK_REDUCER_SURFACE:
ModelBenchmarkReducerSurface = Object.freeze({
  reducers: MODEL_BENCHMARK_REDUCER_SET,
  reduce: reduceModelBenchmarkVerifiedEvent,
});

export function verifyModelBenchmarkReducerSurface(
  surface: ModelBenchmarkReducerSurface,
  event: VerifiedLedgerEvent,
  state: ModelBenchmarkProjectionState,
): void {
  assertModelBenchmarkProjectionState(state);
  const before = canonicalJson(state);
  const first = surface.reduce(
    event,
    immutableModelBenchmarkProjectionClone(state) as
      ModelBenchmarkModeContractState,
  );
  const second = surface.reduce(
    event,
    immutableModelBenchmarkProjectionClone(state) as
      ModelBenchmarkModeContractState,
  );
  if (!sameCanonical(first, second)) {
    throw new ModelBenchmarkReducerError(
      'reducer-nondeterministic',
      'Reducer surface produced different results for the same input',
      'state',
    );
  }
  if (canonicalJson(state) !== before) {
    throw new ModelBenchmarkReducerError(
      'state-mutated',
      'Reducer surface mutated its input',
      'state',
    );
  }
  if (!isDeepFrozenModelBenchmarkProjection(first.state)) {
    throw new ModelBenchmarkReducerError(
      'projection-not-frozen',
      'Reducer output must be recursively frozen',
      'state',
    );
  }
}

export const MODEL_BENCHMARK_FOLD_BRANCH:
ModelBenchmarkFoldBranch = Object.freeze({
  projectionKey: 'modelBenchmark',
  eventStems: ModelBenchmarkSpecificEventStems,
});

export const MODEL_BENCHMARK_FOLD_BRANCHES = Object.freeze([
  DEEP_IMPROVEMENT_COMMON_FOLD_BRANCH,
  MODEL_BENCHMARK_FOLD_BRANCH,
] as const);

export function modelBenchmarkProjectionIntegrityDigest(
  projection: ModelBenchmarkProjectionState,
): string {
  assertModelBenchmarkProjectionState(projection);
  return sha256Bytes(canonicalBytes({
    schemaVersion: MODEL_BENCHMARK_PROJECTION_SCHEMA_VERSION,
    reducerVersion: MODEL_BENCHMARK_REDUCER_VERSION,
    codecVersion: MODEL_BENCHMARK_PROJECTION_CODEC_VERSION,
    orderingPolicyVersion: MODEL_BENCHMARK_ORDERING_POLICY_VERSION,
    projection,
  }));
}

function checkpointDigest(
  projection: ModelBenchmarkProjectionState,
  sourceStreamTails: readonly ModelBenchmarkStreamFrontier[],
): string {
  return sha256Bytes(canonicalBytes({
    projectionDigest: modelBenchmarkProjectionIntegrityDigest(projection),
    sourceStreamTails,
  }));
}

function rebuildReasons(
  options: ModelBenchmarkFoldOptions,
): ModelBenchmarkRebuildReasonCode[] {
  const reasons: ModelBenchmarkRebuildReasonCode[] = [];
  if (options.expectedSchemaVersion !== undefined
    && options.expectedSchemaVersion
      !== MODEL_BENCHMARK_PROJECTION_SCHEMA_VERSION) {
    reasons.push('projection-schema-mismatch');
  }
  if (options.expectedReducerVersion !== undefined
    && options.expectedReducerVersion !== MODEL_BENCHMARK_REDUCER_VERSION) {
    reasons.push('reducer-version-mismatch');
  }
  if (options.expectedCodecVersion !== undefined
    && options.expectedCodecVersion
      !== MODEL_BENCHMARK_PROJECTION_CODEC_VERSION) {
    reasons.push('codec-version-mismatch');
  }
  if (options.expectedOrderingPolicyVersion !== undefined
    && options.expectedOrderingPolicyVersion
      !== MODEL_BENCHMARK_ORDERING_POLICY_VERSION) {
    reasons.push('ordering-policy-mismatch');
  }
  const checkpoint = options.checkpoint;
  if (checkpoint !== undefined) {
    const expected = checkpointDigest(
      checkpoint.projection,
      checkpoint.sourceStreamTails,
    );
    if (expected !== checkpoint.integrityDigest) {
      reasons.push('checkpoint-digest-mismatch');
    }
    if (!sameCanonical(
      checkpoint.sourceStreamTails,
      checkpoint.projection.streamFrontiers,
    )) {
      reasons.push('source-truncated');
    }
  }
  return sortedUnique(reasons) as ModelBenchmarkRebuildReasonCode[];
}

function orderingFailure(
  events: readonly ModelBenchmarkLedgerEvent[],
  checkpoint: ModelBenchmarkProjectionCheckpoint | undefined,
): ModelBenchmarkRebuildReasonCode | null {
  const tails = new Map(
    checkpoint?.sourceStreamTails.map(
      (frontier) => [frontier.streamId, frontier.lastSequence],
    ) ?? [],
  );
  const known = new Map(
    checkpoint?.projection.seenEvents.map(
      (seen) => [seen.eventId, seen.eventDigest],
    ) ?? [],
  );
  for (const event of events) {
    const digest = eventDigest(event);
    const existing = known.get(event.event_id);
    if (existing !== undefined) {
      if (existing !== digest) return 'event-order-invalid';
      continue;
    }
    const tail = tails.get(event.stream_id) ?? 0;
    if (event.stream_sequence <= tail) return 'event-order-invalid';
    if (event.stream_sequence > tail + 1) return 'cursor-gap';
    tails.set(event.stream_id, event.stream_sequence);
    known.set(event.event_id, digest);
  }
  return null;
}

function projectedResult(
  projection: ModelBenchmarkProjectionState,
): ModelBenchmarkProjectedResult {
  const sourceStreamTails = immutableModelBenchmarkProjectionClone(
    projection.streamFrontiers,
  );
  const checkpoint: ModelBenchmarkProjectionCheckpoint =
    immutableModelBenchmarkProjectionClone({
      projection,
      sourceStreamTails,
      integrityDigest: checkpointDigest(projection, sourceStreamTails),
    });
  return immutableModelBenchmarkProjectionClone({
    outcome: 'projected',
    projection,
    integrityDigest: modelBenchmarkProjectionIntegrityDigest(projection),
    checkpoint,
  });
}

export function foldModelBenchmarkEvents(
  events: readonly ModelBenchmarkLedgerEvent[],
  options: ModelBenchmarkFoldOptions = {},
): ModelBenchmarkFoldResult {
  if (unhandledRegisteredStems().length > 0) {
    return Object.freeze({
      outcome: 'rebuild_required',
      reasonCodes: Object.freeze([
        'unhandled-event-stem',
      ] as ModelBenchmarkRebuildReasonCode[]),
    });
  }
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
    ?? createModelBenchmarkProjectionState();
  for (const event of validated) projection = applyEvent(projection, event);
  return projectedResult(projection);
}

export function projectModelBenchmarkLegacyView(
  projection: ModelBenchmarkProjectionState,
): ModelBenchmarkLegacyProjection {
  assertModelBenchmarkProjectionState(projection);
  const legacy: ModelBenchmarkLegacyProjection = {
    authority: 'shadow-only',
    legacyAuthority: 'unchanged',
    common: projectDeepImprovementCommonLegacyView(projection.common),
    runState: projection.modelBenchmark.run.state,
    terminalOutcome: projection.modelBenchmark.run.terminalOutcome,
    rankingState: projection.modelBenchmark.modeStatus.rankingState,
    incumbentCandidateId:
      projection.modelBenchmark.modeStatus.incumbentCandidateId,
    blockingVetoCodes:
      [...projection.modelBenchmark.modeStatus.blockingVetoCodes],
  };
  assertModelBenchmarkLegacyProjection(legacy);
  return immutableModelBenchmarkProjectionClone(legacy);
}

// ───────────────────────────────────────────────────────────────────
// MODULE: Model Benchmark Reducer Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import type {
  LedgerRecordFrame,
  VerifiedLedgerEvent,
} from '../../lib/authorized-ledger/index.js';
import {
  foldDeepImprovementCommonEvents,
} from '../../lib/deep-improvement-common-reducers/index.js';
import {
  prepareDeepImprovementCommonEvent,
} from '../../lib/deep-improvement-common-ledger-schema/index.js';
import {
  MODEL_BENCHMARK_FOLD_BRANCHES,
  MODEL_BENCHMARK_HANDLED_SPECIFIC_EVENT_STEMS,
  MODEL_BENCHMARK_REDUCER_SURFACE,
  ModelBenchmarkReducerError,
  createModelBenchmarkProjectionState,
  foldModelBenchmarkEvents,
  verifyModelBenchmarkReducerSurface,
} from '../../lib/model-benchmark-reducers/index.js';
import {
  MODEL_BENCHMARK_SCORE_WRITE_BACKEND_REF,
  ModelBenchmarkSpecificEventStems,
  createModelBenchmarkEventRegistry,
  prepareModelBenchmarkEvent,
} from '../../lib/model-benchmark-ledger-schema/index.js';
import {
  canonicalBytes,
  canonicalJson,
  readEvent,
  sha256Bytes,
} from '../../lib/event-envelope/index.js';

import type {
  DeepImprovementCommonLedgerEvent,
} from '../../lib/deep-improvement-common-ledger-schema/index.js';
import type {
  ModelBenchmarkEventEnvelope,
  ModelBenchmarkEventInput,
  ModelBenchmarkLedgerEvent,
  ModelBenchmarkPayloadMap,
  ModelBenchmarkScopeMap,
  ModelBenchmarkSpecificEventStem,
  TaskLineage,
  TrialMatrixKey,
} from '../../lib/model-benchmark-ledger-schema/index.js';
import type { JsonObject } from '../../lib/event-envelope/index.js';

const TIMESTAMP = '2026-07-23T10:00:00.000Z';
const registry = createModelBenchmarkEventRegistry();
type JudgeObservationData = ModelBenchmarkPayloadMap[
  'model_benchmark.judge_observation_recorded'
];

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value as JsonObject));
}

function replay(label: string) {
  return {
    fingerprint_version: 1 as const,
    final_digest: digest(`replay:${label}`),
    replay_input_digests: {
      configuration: digest('configuration'),
      evaluator: digest('evaluator'),
    },
  };
}

function baseScope() {
  return {
    runId: 'run-1',
    lineageId: 'lineage-1',
    variant: 'model-benchmark' as const,
  };
}

function matrix(): TrialMatrixKey {
  return {
    candidateId: 'candidate-1',
    modelFingerprint: digest('model-1'),
    executionPath: 'provider/direct',
    taskInstanceId: 'task-1',
    taskFamilyId: 'family-1',
    pairedBlockId: 'pair-1',
    protocolVariant: 'standard',
    seed: 7,
    perturbationId: 'none',
    workloadProfileId: 'profile-1',
    promptRecipeFingerprint: digest('prompt-1'),
    routeFingerprint: digest('route-1'),
    frameworkFingerprint: digest('framework-1'),
    toolRecipeFingerprint: digest('tools-1'),
    attempt: 1,
  };
}

function lineage(): TaskLineage {
  return {
    sourceCutoffAt: TIMESTAMP,
    visibility: 'sealed',
    proposerVisibility: 'blind',
    oracleVisibility: 'blind',
    parentCaseId: null,
    firstExposureAt: null,
    disclosedAt: null,
    retiredAt: null,
    replacementCaseId: null,
  };
}

function trialScope() {
  const key = matrix();
  return {
    ...baseScope(),
    trialId: 'trial-1',
    taskInstanceId: key.taskInstanceId,
    taskFamilyId: key.taskFamilyId,
    candidateId: key.candidateId,
    modelFingerprint: key.modelFingerprint,
    executionPath: key.executionPath,
    pairedBlockId: key.pairedBlockId,
  };
}

function caseScope(caseId = 'case-1') {
  return {
    ...baseScope(),
    caseId,
    taskInstanceId: matrix().taskInstanceId,
    taskFamilyId: matrix().taskFamilyId,
  };
}

interface EventPosition {
  readonly streamId: string;
  readonly streamSequence: number;
  readonly ordinal: number;
}

function extensionPosition(
  events: readonly ModelBenchmarkLedgerEvent[],
  streamId: string,
): EventPosition {
  return {
    streamId,
    streamSequence: events
      .filter((event) => event.stream_id === streamId)
      .reduce((tail, event) => Math.max(tail, event.stream_sequence), 0) + 1,
    ordinal: events.length + 1,
  };
}

function makeEvent<TStem extends ModelBenchmarkSpecificEventStem>(
  stem: TStem,
  position: EventPosition,
  scope: ModelBenchmarkScopeMap[TStem],
  data: ModelBenchmarkPayloadMap[TStem],
): ModelBenchmarkEventEnvelope<TStem> {
  const input: ModelBenchmarkEventInput<TStem> = {
    stem,
    scope,
    data,
    prevEventHash: digest(`previous:${position.ordinal}`),
    replay: replay(`${stem}:${position.ordinal}`),
    eventId: `event-${position.ordinal}`,
    streamId: position.streamId,
    streamSequence: position.streamSequence,
    occurredAt: TIMESTAMP,
    recordedAt: TIMESTAMP,
    producer: { name: 'model-benchmark-reducer-test', version: '1' },
    authorityEpoch: 1,
    correlationId: 'run-1',
    causationId: position.ordinal === 1
      ? null
      : `event-${position.ordinal - 1}`,
    idempotencyKey: `event-${position.ordinal}`,
  };
  return prepareModelBenchmarkEvent(input, registry)
    .envelope as ModelBenchmarkEventEnvelope<TStem>;
}

function mainEvents(
  hardFloorStatus: 'fail' | 'not-applicable' | 'pass' | 'unknown' = 'pass',
): ModelBenchmarkLedgerEvent[] {
  let ordinal = 0;
  const tails = new Map<string, number>();
  const position = (streamId = 'model-main'): EventPosition => {
    ordinal += 1;
    const streamSequence = (tails.get(streamId) ?? 0) + 1;
    tails.set(streamId, streamSequence);
    return { streamId, streamSequence, ordinal };
  };
  const hash = digest('fixture');
  const events: ModelBenchmarkLedgerEvent[] = [];
  const declared = makeEvent(
    'model_benchmark.run_declared',
    position('model-main'),
    baseScope(),
    {
      generation: 1,
      benchmarkRecipeRef: 'benchmark-recipe:1',
      benchmarkRecipeDigest: hash,
      evaluatorServiceRef: 'service:evaluator',
      canaryServiceRef: 'service:canary',
      promotionServiceRef: 'service:promotion',
      sharedServiceContractVersion: 'deep-improvement-common@1',
      replayFingerprint: hash,
    },
  );
  events.push(declared);
  const capsule = makeEvent(
    'model_benchmark.benchmark_capsule_sealed',
    position('artifact-stream'),
    { ...baseScope(), capsuleId: 'capsule-1' },
    {
      capsuleRef: 'capsule:1',
      capsuleDigest: hash,
      taskSetDigest: hash,
      taskLineage: lineage(),
      canarySuiteRef: 'canary:1',
      canarySuiteDigest: hash,
      sealReceiptRef: 'receipt:capsule',
    },
  );
  events.push(capsule);
  const workload = makeEvent(
    'model_benchmark.workload_snapshot_sealed',
    position('artifact-stream'),
    { ...baseScope(), workloadSnapshotId: 'workload-1' },
    {
      workloadSnapshotRef: 'workload:1',
      workloadSnapshotDigest: hash,
      taskFamilyIds: ['family-1'],
      caseCount: 1,
      workloadProfileVersion: 'workload@1',
      snapshotAt: TIMESTAMP,
      sealReceiptRef: 'receipt:workload',
    },
  );
  events.push(workload);
  events.push(makeEvent(
    'model_benchmark.run_started',
    position('model-main'),
    baseScope(),
    {
      declarationEventId: declared.event_id,
      declarationPayloadDigest: declared.payload.payloadDigest,
      capsuleEventId: capsule.event_id,
      capsulePayloadDigest: capsule.payload.payloadDigest,
      workloadEventId: workload.event_id,
      workloadPayloadDigest: workload.payload.payloadDigest,
      executionReceiptRef: 'receipt:start',
      startedAt: TIMESTAMP,
    },
  ));
  events.push(makeEvent(
    'model_benchmark.benchmark_design_declared',
    position('model-main'),
    { ...baseScope(), designId: 'design-1' },
    {
      designRef: 'design:1',
      designDigest: hash,
      candidateIds: ['candidate-1'],
      taskFamilyIds: ['family-1'],
      pairedBlockIds: ['pair-1'],
      protocolVariants: ['standard'],
      familyQuotaPolicyVersion: 'quota@1',
      designPolicyVersion: 'design@1',
    },
  ));
  events.push(makeEvent(
    'model_benchmark.trial_block_declared',
    position('model-main'),
    { ...baseScope(), trialBlockId: 'block-1' },
    {
      taskFamilyId: 'family-1',
      candidateIds: ['candidate-1'],
      modelFingerprints: [matrix().modelFingerprint],
      executionPaths: [matrix().executionPath],
      pairedBlockIds: [matrix().pairedBlockId],
      protocolVariants: [matrix().protocolVariant],
      seed: matrix().seed,
      perturbationId: matrix().perturbationId,
      workloadProfileId: matrix().workloadProfileId,
      blockDigest: hash,
    },
  ));
  events.push(makeEvent(
    'model_benchmark.trial_case_admitted',
    position('trial-stream'),
    trialScope(),
    {
      trialMatrixKey: matrix(),
      caseRef: 'case:1',
      caseDigest: hash,
      taskLineage: lineage(),
      admissionPolicyVersion: 'admission@1',
      admissionReasonCode: 'eligible',
    },
  ));
  const dispatched = makeEvent(
    'model_benchmark.trial_dispatched',
    position('trial-stream'),
    trialScope(),
    {
      trialMatrixKey: matrix(),
      inputRef: 'input:1',
      inputDigest: hash,
      dispatchReceiptRef: 'receipt:dispatch',
      dispatchReceiptDigest: hash,
      dispatchedAt: TIMESTAMP,
    },
  );
  events.push(dispatched);
  const completed = makeEvent(
    'model_benchmark.trial_completed',
    position('trial-stream'),
    trialScope(),
    {
      trialMatrixKey: matrix(),
      dispatchedEventId: dispatched.event_id,
      dispatchedPayloadDigest: dispatched.payload.payloadDigest,
      rawResultRef: 'raw-result:1',
      rawResultDigest: digest('raw-result'),
      inputDigest: hash,
      outputDigest: digest('raw-output'),
      completionReceiptRef: 'receipt:complete',
      completedAt: TIMESTAMP,
    },
  );
  events.push(completed);
  const observation = makeEvent(
    'model_benchmark.trial_observation_recorded',
    position('trial-stream'),
    trialScope(),
    {
      trialMatrixKey: matrix(),
      completedEventId: completed.event_id,
      completedPayloadDigest: completed.payload.payloadDigest,
      inputDigest: hash,
      rawOutputRef: 'raw-output:1',
      rawOutputDigest: digest('raw-output'),
      evaluatorObservationRef: 'observation:1',
      evaluatorObservationDigest: digest('observation'),
      executionReceiptRef: 'receipt:observation',
    },
  );
  events.push(observation);
  const score = makeEvent(
    'model_benchmark.score_vector_observed',
    position('trial-stream'),
    trialScope(),
    {
      trialMatrixKey: matrix(),
      observationEventId: observation.event_id,
      observationPayloadDigest: observation.payload.payloadDigest,
      scorePolicyVersion: 'score@1',
      scoreWriteBackendRef: MODEL_BENCHMARK_SCORE_WRITE_BACKEND_REF,
      scoreVector: {
        components: [{
          dimensionCode: 'quality',
          rawScore: 0.95,
          hardFloorStatus,
          measurementStatus: 'observed',
          uncertainty: 0.05,
          observationRef: 'observation:quality',
          observationDigest: digest('quality'),
        }],
        evaluatorContractHash: digest('evaluator-contract'),
        evaluatorFingerprint: digest('evaluator'),
      },
      scoringReceiptRef: 'receipt:score',
    },
  );
  events.push(score);
  events.push(makeEvent(
    'model_benchmark.validity_plan_sealed',
    position('adjudication-stream'),
    { ...baseScope(), validityPlanId: 'validity-plan-1' },
    {
      validityPlanRef: 'validity-plan:1',
      validityPlanDigest: hash,
      requiredEvidenceCodes: ['score'],
      hardBlockerCodes: ['hard-floor'],
      validityPolicyVersion: 'validity@1',
      sealReceiptRef: 'receipt:validity-plan',
    },
  ));
  const validity = makeEvent(
    'model_benchmark.validity_card_derived',
    position('adjudication-stream'),
    { ...baseScope(), validityPlanId: 'validity-plan-1' },
    {
      state: 'valid',
      evidenceEventIds: [score.event_id],
      evidenceSetDigest: digest('validity-evidence'),
      blockerCodes: [],
      uncertainty: 0.05,
      derivationPolicyVersion: 'validity@1',
      derivationReceiptRef: 'receipt:validity',
    },
  );
  events.push(validity);
  const sealed = makeEvent(
    'model_benchmark.selection_evidence_sealed',
    position('adjudication-stream'),
    { ...baseScope(), evidenceSetId: 'evidence-set-1' },
    {
      evidenceEventIds: [score.event_id],
      evidenceSetDigest: digest('selection-evidence'),
      manifestRef: 'manifest:selection',
      manifestDigest: digest('selection-manifest'),
      validityCardEventIds: [validity.event_id],
      sealedAt: TIMESTAMP,
      sealReceiptRef: 'receipt:selection',
    },
  );
  events.push(sealed);
  events.push(makeEvent(
    'model_benchmark.selection_reduction_requested',
    position('adjudication-stream'),
    { ...baseScope(), evidenceSetId: 'evidence-set-1' },
    {
      sealedEvidenceEventId: sealed.event_id,
      sealedEvidencePayloadDigest: sealed.payload.payloadDigest,
      reducerContractVersion: 'model-benchmark-reducer@1',
      requestReceiptRef: 'receipt:reduction',
      requestedAt: TIMESTAMP,
    },
  ));
  return events;
}

function judgeObservationEvent(
  events: readonly ModelBenchmarkLedgerEvent[],
  overrides: Partial<JudgeObservationData> = {},
) {
  const score = events.find(
    (event) => event.payload.stem === 'model_benchmark.score_vector_observed',
  );
  if (score === undefined) throw new Error('Score fixture is missing');
  return makeEvent(
    'model_benchmark.judge_observation_recorded',
    extensionPosition(events, 'trial-stream'),
    trialScope(),
    {
      trialMatrixKey: matrix(),
      scoreEventId: score.event_id,
      scorePayloadDigest: score.payload.payloadDigest,
      blindedJudgeRef: 'judge:blind-1',
      judgeFamilyCode: 'quality',
      judgeBuildFingerprint: digest('judge-build'),
      promptDigest: digest('judge-prompt'),
      contextDigest: digest('judge-context'),
      toolDigest: digest('judge-tools'),
      calibrationSliceId: 'calibration-slice-1',
      orderProbeOutcome: 'pass',
      styleProbeOutcome: 'pass',
      confidence: 0.9,
      uncertainty: 0.1,
      abstained: false,
      disagreementState: 'resolved',
      observationRef: 'judge-observation:1',
      observationDigest: digest('judge-observation'),
      ...overrides,
    },
  );
}

function selectionWithJudgeEvidence(
  judgeOverrides: readonly Partial<JudgeObservationData>[],
): {
  readonly events: ModelBenchmarkLedgerEvent[];
  readonly judges: ModelBenchmarkEventEnvelope<
    'model_benchmark.judge_observation_recorded'
  >[];
} {
  const events = mainEvents().slice(0, 13);
  const score = events[10] as ModelBenchmarkEventEnvelope<
    'model_benchmark.score_vector_observed'
  >;
  const validity = events[12] as ModelBenchmarkEventEnvelope<
    'model_benchmark.validity_card_derived'
  >;
  const judges = judgeOverrides.map((overrides) => {
    const judge = judgeObservationEvent(events, overrides);
    events.push(judge);
    return judge;
  });
  const sealed = makeEvent(
    'model_benchmark.selection_evidence_sealed',
    extensionPosition(events, 'adjudication-stream'),
    { ...baseScope(), evidenceSetId: 'evidence-set-1' },
    {
      evidenceEventIds: [
        score.event_id,
        ...judges.map((judge) => judge.event_id),
      ],
      evidenceSetDigest: digest('judge-selection-evidence'),
      manifestRef: 'manifest:judge-selection',
      manifestDigest: digest('judge-selection-manifest'),
      validityCardEventIds: [validity.event_id],
      sealedAt: TIMESTAMP,
      sealReceiptRef: 'receipt:judge-selection',
    },
  );
  events.push(sealed);
  events.push(makeEvent(
    'model_benchmark.selection_reduction_requested',
    extensionPosition(events, 'adjudication-stream'),
    { ...baseScope(), evidenceSetId: 'evidence-set-1' },
    {
      sealedEvidenceEventId: sealed.event_id,
      sealedEvidencePayloadDigest: sealed.payload.payloadDigest,
      reducerContractVersion: 'model-benchmark-reducer@1',
      requestReceiptRef: 'receipt:judge-selection-reduction',
      requestedAt: TIMESTAMP,
    },
  ));
  return { events, judges };
}

function contaminationEvent(
  events: readonly ModelBenchmarkLedgerEvent[],
  contaminationStatus:
    'clean' | 'confirmed' | 'suspected' | 'unknown' = 'confirmed',
) {
  return makeEvent(
    'model_benchmark.contamination_evidence_recorded',
    extensionPosition(events, 'case-stream'),
    caseScope(),
    {
      contaminationStatus,
      detectorFingerprint: digest('contamination-detector'),
      evidenceRef: 'contamination-evidence:1',
      evidenceDigest: digest('contamination-evidence'),
      exposureEventIds: [],
      reasonCode: 'benchmark-leak',
    },
  );
}

interface ReferenceHistory {
  readonly name: string;
  readonly valid: ModelBenchmarkLedgerEvent[];
  readonly wrongKind: ModelBenchmarkLedgerEvent[];
}

function replacementPosition(
  event: Pick<ModelBenchmarkLedgerEvent, 'stream_id' | 'stream_sequence'>,
  ordinal: number,
): EventPosition {
  return {
    streamId: event.stream_id,
    streamSequence: event.stream_sequence,
    ordinal,
  };
}

function referenceHistories(): ReferenceHistory[] {
  const events = mainEvents();
  const declared = events[0] as ModelBenchmarkEventEnvelope<
    'model_benchmark.run_declared'
  >;
  const capsule = events[1] as ModelBenchmarkEventEnvelope<
    'model_benchmark.benchmark_capsule_sealed'
  >;
  const workload = events[2] as ModelBenchmarkEventEnvelope<
    'model_benchmark.workload_snapshot_sealed'
  >;
  const started = events[3] as ModelBenchmarkEventEnvelope<
    'model_benchmark.run_started'
  >;
  const dispatched = events[7] as ModelBenchmarkEventEnvelope<
    'model_benchmark.trial_dispatched'
  >;
  const completed = events[8] as ModelBenchmarkEventEnvelope<
    'model_benchmark.trial_completed'
  >;
  const observation = events[9] as ModelBenchmarkEventEnvelope<
    'model_benchmark.trial_observation_recorded'
  >;
  const score = events[10] as ModelBenchmarkEventEnvelope<
    'model_benchmark.score_vector_observed'
  >;
  const validity = events[12] as ModelBenchmarkEventEnvelope<
    'model_benchmark.validity_card_derived'
  >;
  const sealed = events[13] as ModelBenchmarkEventEnvelope<
    'model_benchmark.selection_evidence_sealed'
  >;
  const reduction = events[14] as ModelBenchmarkEventEnvelope<
    'model_benchmark.selection_reduction_requested'
  >;
  const histories: ReferenceHistory[] = [];
  const addReplacement = <TStem extends ModelBenchmarkSpecificEventStem>(
    name: string,
    index: number,
    original: ModelBenchmarkEventEnvelope<TStem>,
    data: ModelBenchmarkPayloadMap[TStem],
  ): void => {
    const replacement = makeEvent(
      original.payload.stem,
      replacementPosition(original, 100 + index),
      original.payload.scope,
      data,
    ) as ModelBenchmarkLedgerEvent;
    histories.push({
      name,
      valid: events.slice(0, index + 1),
      wrongKind: [
        ...events.slice(0, index),
        replacement,
      ],
    });
  };

  addReplacement('run_started.declarationEventId', 3, started, {
    ...started.payload.data,
    declarationEventId: capsule.event_id,
    declarationPayloadDigest: capsule.payload.payloadDigest,
  });
  addReplacement('run_started.capsuleEventId', 3, started, {
    ...started.payload.data,
    capsuleEventId: declared.event_id,
    capsulePayloadDigest: declared.payload.payloadDigest,
  });
  addReplacement('run_started.workloadEventId', 3, started, {
    ...started.payload.data,
    workloadEventId: declared.event_id,
    workloadPayloadDigest: declared.payload.payloadDigest,
  });
  addReplacement('trial_completed.dispatchedEventId', 8, completed, {
    ...completed.payload.data,
    dispatchedEventId: declared.event_id,
    dispatchedPayloadDigest: declared.payload.payloadDigest,
  });
  addReplacement('trial_observation_recorded.completedEventId', 9,
    observation, {
      ...observation.payload.data,
      completedEventId: declared.event_id,
      completedPayloadDigest: declared.payload.payloadDigest,
    });
  addReplacement('score_vector_observed.observationEventId', 10, score, {
    ...score.payload.data,
    observationEventId: declared.event_id,
    observationPayloadDigest: declared.payload.payloadDigest,
  });
  addReplacement('validity_card_derived.evidenceEventIds', 12, validity, {
    ...validity.payload.data,
    evidenceEventIds: [declared.event_id],
  });
  addReplacement('selection_evidence_sealed.evidenceEventIds', 13, sealed, {
    ...sealed.payload.data,
    evidenceEventIds: [declared.event_id],
  });
  addReplacement(
    'selection_evidence_sealed.validityCardEventIds',
    13,
    sealed,
    {
      ...sealed.payload.data,
      validityCardEventIds: [declared.event_id],
    },
  );
  addReplacement(
    'selection_reduction_requested.sealedEvidenceEventId',
    14,
    reduction,
    {
      ...reduction.payload.data,
      sealedEvidenceEventId: declared.event_id,
      sealedEvidencePayloadDigest: declared.payload.payloadDigest,
    },
  );

  const dispatchedPrefix = events.slice(0, 8);
  const failurePosition = extensionPosition(
    dispatchedPrefix,
    'trial-stream',
  );
  const failed = makeEvent(
    'model_benchmark.trial_failed',
    failurePosition,
    trialScope(),
    {
      trialMatrixKey: matrix(),
      dispatchedEventId: dispatched.event_id,
      failureStage: 'execution',
      reasonCode: 'provider-error',
      failureEvidenceRef: 'failure:1',
      failureEvidenceDigest: digest('failure'),
      failureReceiptRef: 'receipt:failure',
      retryable: false,
    },
  );
  const failedWrongKind = makeEvent(
    'model_benchmark.trial_failed',
    { ...failurePosition, ordinal: failurePosition.ordinal + 100 },
    trialScope(),
    { ...failed.payload.data, dispatchedEventId: declared.event_id },
  );
  histories.push({
    name: 'model_benchmark.trial_failed.dispatchedEventId',
    valid: [...dispatchedPrefix, failed],
    wrongKind: [...dispatchedPrefix, failedWrongKind],
  });

  const unknownPosition = extensionPosition(
    dispatchedPrefix,
    'trial-stream',
  );
  const unknown = makeEvent(
    'model_benchmark.trial_unknown',
    unknownPosition,
    trialScope(),
    {
      trialMatrixKey: matrix(),
      dispatchedEventId: dispatched.event_id,
      reasonCode: 'missing-receipt',
      lastReceiptRef: 'receipt:last',
      evidenceDigest: digest('unknown'),
      observedAt: TIMESTAMP,
    },
  );
  const unknownWrongKind = makeEvent(
    'model_benchmark.trial_unknown',
    { ...unknownPosition, ordinal: unknownPosition.ordinal + 100 },
    trialScope(),
    { ...unknown.payload.data, dispatchedEventId: declared.event_id },
  );
  histories.push({
    name: 'model_benchmark.trial_unknown.dispatchedEventId',
    valid: [...dispatchedPrefix, unknown],
    wrongKind: [...dispatchedPrefix, unknownWrongKind],
  });

  const completedPrefix = events.slice(0, 9);
  const invalidated = makeEvent(
    'model_benchmark.trial_invalidated',
    extensionPosition(completedPrefix, 'trial-stream'),
    trialScope(),
    {
      trialMatrixKey: matrix(),
      sourceEventId: completed.event_id,
      sourcePayloadDigest: completed.payload.payloadDigest,
      reasonCode: 'post-run-invalid',
      invalidationEvidenceRef: 'invalidation:1',
      invalidationEvidenceDigest: digest('invalidation'),
      invalidatedAt: TIMESTAMP,
    },
  );
  const invalidatedWrongKind = makeEvent(
    'model_benchmark.trial_invalidated',
    { ...extensionPosition(completedPrefix, 'trial-stream'), ordinal: 120 },
    trialScope(),
    {
      ...invalidated.payload.data,
      sourceEventId: declared.event_id,
      sourcePayloadDigest: declared.payload.payloadDigest,
    },
  );
  histories.push({
    name: 'trial_invalidated.sourceEventId',
    valid: [...completedPrefix, invalidated],
    wrongKind: [...completedPrefix, invalidatedWrongKind],
  });

  const usage = makeEvent(
    'model_benchmark.usage_observed',
    extensionPosition(events, 'trial-stream'),
    trialScope(),
    {
      trialMatrixKey: matrix(),
      observationEventId: observation.event_id,
      usage: {
        inputTokens: 1,
        outputTokens: 1,
        reasoningTokens: 0,
        cacheReadTokens: 0,
        cacheWriteTokens: 0,
        retryCount: 0,
        realizedCostMicrounits: 1,
        currencyCode: 'USD',
      },
      latency: {
        ttftMs: 1,
        interTokenP50Ms: 1,
        endToEndMs: 1,
        tailP95Ms: 1,
      },
      usageReceiptRef: 'receipt:usage-reference',
      usageReceiptDigest: digest('usage-reference'),
    },
  );
  const usageWrongKind = makeEvent(
    'model_benchmark.usage_observed',
    { ...extensionPosition(events, 'trial-stream'), ordinal: 121 },
    trialScope(),
    { ...usage.payload.data, observationEventId: declared.event_id },
  );
  histories.push({
    name: 'usage_observed.observationEventId',
    valid: [...events, usage],
    wrongKind: [...events, usageWrongKind],
  });

  const judge = judgeObservationEvent(events);
  const judgeWrongKind = makeEvent(
    'model_benchmark.judge_observation_recorded',
    { ...extensionPosition(events, 'trial-stream'), ordinal: 122 },
    trialScope(),
    {
      ...judge.payload.data,
      scoreEventId: declared.event_id,
      scorePayloadDigest: declared.payload.payloadDigest,
    },
  );
  histories.push({
    name: 'judge_observation_recorded.scoreEventId',
    valid: [...events, judge],
    wrongKind: [...events, judgeWrongKind],
  });

  const firstOracle = makeEvent(
    'model_benchmark.oracle_label_attested',
    extensionPosition(events, 'case-stream'),
    caseScope(),
    {
      oracleVersion: 'oracle@1',
      labelRef: 'oracle-label:reference',
      labelDigest: digest('oracle-label-reference'),
      attestationStatus: 'attested',
      confidence: 0.9,
      uncertainty: 0.1,
      priorAttestationEventId: null,
      attestationReceiptRef: 'receipt:oracle-reference',
    },
  );
  const oraclePrefix = [...events, firstOracle];
  const correctedOracle = makeEvent(
    'model_benchmark.oracle_label_attested',
    extensionPosition(oraclePrefix, 'case-stream'),
    caseScope(),
    {
      ...firstOracle.payload.data,
      attestationStatus: 'corrected',
      priorAttestationEventId: firstOracle.event_id,
    },
  );
  const oracleWrongKind = makeEvent(
    'model_benchmark.oracle_label_attested',
    { ...extensionPosition(oraclePrefix, 'case-stream'), ordinal: 123 },
    caseScope(),
    {
      ...correctedOracle.payload.data,
      priorAttestationEventId: declared.event_id,
    },
  );
  histories.push({
    name: 'oracle_label_attested.priorAttestationEventId',
    valid: [...oraclePrefix, correctedOracle],
    wrongKind: [...oraclePrefix, oracleWrongKind],
  });

  const exposure = makeEvent(
    'model_benchmark.exposure_recorded',
    extensionPosition(events, 'case-stream'),
    caseScope(),
    {
      exposureClass: 'candidate',
      exposedActorRef: 'candidate:candidate-1',
      firstExposedAt: TIMESTAMP,
      evidenceRef: 'exposure:reference',
      evidenceDigest: digest('exposure-reference'),
    },
  );
  const exposurePrefix = [...events, exposure];
  const contamination = makeEvent(
    'model_benchmark.contamination_evidence_recorded',
    extensionPosition(exposurePrefix, 'case-stream'),
    caseScope(),
    {
      contaminationStatus: 'confirmed',
      detectorFingerprint: digest('detector-reference'),
      evidenceRef: 'contamination:reference',
      evidenceDigest: digest('contamination-reference'),
      exposureEventIds: [exposure.event_id],
      reasonCode: 'known-exposure',
    },
  );
  const contaminationWrongKind = makeEvent(
    'model_benchmark.contamination_evidence_recorded',
    { ...extensionPosition(exposurePrefix, 'case-stream'), ordinal: 124 },
    caseScope(),
    {
      ...contamination.payload.data,
      exposureEventIds: [declared.event_id],
    },
  );
  histories.push({
    name: 'contamination_evidence_recorded.exposureEventIds',
    valid: [...exposurePrefix, contamination],
    wrongKind: [...exposurePrefix, contaminationWrongKind],
  });

  return histories;
}

function validityUnknownRankingEvents(): {
  readonly events: ModelBenchmarkLedgerEvent[];
  readonly resolution: ModelBenchmarkLedgerEvent;
  readonly requiredEvidenceRef: string;
} {
  const prefix = mainEvents().slice(0, 12);
  const score = prefix[10] as ModelBenchmarkEventEnvelope<
    'model_benchmark.score_vector_observed'
  >;
  const judge = judgeObservationEvent(prefix);
  const withJudge = [...prefix, judge];
  const unknown = makeEvent(
    'model_benchmark.validity_unknown_recorded',
    extensionPosition(withJudge, 'adjudication-stream'),
    { ...baseScope(), validityPlanId: 'validity-plan-1' },
    {
      unknownCode: 'insufficient-evidence',
      requiredEvidenceRefs: [score.event_id],
      evidenceSetDigest: digest('unresolved-validity'),
      blocker: true,
      recordedAt: TIMESTAMP,
    },
  );
  const withUnknown = [...withJudge, unknown];
  const validity = makeEvent(
    'model_benchmark.validity_card_derived',
    extensionPosition(withUnknown, 'adjudication-stream'),
    { ...baseScope(), validityPlanId: 'validity-plan-1' },
    {
      state: 'valid',
      evidenceEventIds: [judge.event_id],
      evidenceSetDigest: digest('initial-validity'),
      blockerCodes: [],
      uncertainty: 0.05,
      derivationPolicyVersion: 'validity@1',
      derivationReceiptRef: 'receipt:initial-validity',
    },
  );
  const withValidity = [...withUnknown, validity];
  const sealed = makeEvent(
    'model_benchmark.selection_evidence_sealed',
    extensionPosition(withValidity, 'adjudication-stream'),
    { ...baseScope(), evidenceSetId: 'evidence-set-1' },
    {
      evidenceEventIds: [score.event_id],
      evidenceSetDigest: digest('unknown-selection'),
      manifestRef: 'manifest:unknown-selection',
      manifestDigest: digest('unknown-selection-manifest'),
      validityCardEventIds: [validity.event_id],
      sealedAt: TIMESTAMP,
      sealReceiptRef: 'receipt:unknown-selection',
    },
  );
  const withSeal = [...withValidity, sealed];
  const reduction = makeEvent(
    'model_benchmark.selection_reduction_requested',
    extensionPosition(withSeal, 'adjudication-stream'),
    { ...baseScope(), evidenceSetId: 'evidence-set-1' },
    {
      sealedEvidenceEventId: sealed.event_id,
      sealedEvidencePayloadDigest: sealed.payload.payloadDigest,
      reducerContractVersion: 'model-benchmark-reducer@1',
      requestReceiptRef: 'receipt:unknown-reduction',
      requestedAt: TIMESTAMP,
    },
  );
  const events = [...withSeal, reduction];
  const resolution = makeEvent(
    'model_benchmark.validity_card_derived',
    extensionPosition(events, 'adjudication-stream'),
    { ...baseScope(), validityPlanId: 'validity-plan-1' },
    {
      state: 'valid',
      evidenceEventIds: [score.event_id],
      evidenceSetDigest: digest('resolved-validity'),
      blockerCodes: [],
      uncertainty: 0.02,
      derivationPolicyVersion: 'validity@1',
      derivationReceiptRef: 'receipt:resolved-validity',
    },
  );
  return { events, resolution, requiredEvidenceRef: score.event_id };
}

function projected(events: readonly ModelBenchmarkLedgerEvent[]) {
  const result = foldModelBenchmarkEvents(events);
  expect(result.outcome).toBe('projected');
  if (result.outcome !== 'projected') throw new Error('Expected projection');
  return result;
}

function verifiedEvent(event: ModelBenchmarkLedgerEvent): VerifiedLedgerEvent {
  const read = readEvent(canonicalBytes(event), registry);
  const hash = digest(`frame:${event.event_id}`);
  const frame: LedgerRecordFrame = {
    frame_version: 1,
    ledger_id: 'model-benchmark-shadow',
    sequence: event.stream_sequence,
    prev_record_hash: digest(`frame-prev:${event.event_id}`),
    canonical_event_hash: read.effective.canonicalDigest,
    authorization_ref: {
      audit_ledger_id: 'model-benchmark-shadow-authorization',
      audit_sequence: event.stream_sequence,
      audit_record_hash: hash,
      decision_id: `decision:${event.event_id}`,
      decision_digest: hash,
      request_digest: hash,
      policy_digest: hash,
      authority_epoch: 1,
    },
    receipt: {
      ledger_id: 'model-benchmark-shadow',
      sequence: event.stream_sequence,
      event_id: event.event_id,
      event_type: event.event_type,
      event_version: event.event_version,
      stream_id: event.stream_id,
      stream_sequence: event.stream_sequence,
      committed_at: TIMESTAMP,
    },
    canonical_event_bytes: Buffer.from(
      read.effective.canonicalBytes,
    ).toString('base64'),
    record_hash: hash,
  };
  return Object.freeze({ frame: Object.freeze(frame), event: read });
}

function reverseObjectKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(reverseObjectKeys);
  if (value === null || typeof value !== 'object') return value;
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .reverse()
      .map(([key, child]) => [key, reverseObjectKeys(child)]),
  );
}

describe('model-benchmark reducers', () => {
  it('is deterministic and canonical-key reordering is byte-identical', () => {
    const events = mainEvents();
    const first = projected(events);
    const second = projected(events);
    const reordered = events.map(
      (event) => reverseObjectKeys(event) as ModelBenchmarkLedgerEvent,
    );
    const third = projected(reordered);
    expect(canonicalJson(first)).toBe(canonicalJson(second));
    expect(canonicalJson(first)).toBe(canonicalJson(third));
  });

  it('uses an independent sequence baseline for every stream', () => {
    const result = projected(mainEvents());
    expect(result.projection.streamFrontiers).toEqual([
      { streamId: 'adjudication-stream', lastSequence: 4 },
      { streamId: 'artifact-stream', lastSequence: 2 },
      { streamId: 'model-main', lastSequence: 4 },
      { streamId: 'trial-stream', lastSequence: 5 },
    ]);
  });

  it('blocks a per-stream gap and out-of-order event', () => {
    const events = mainEvents();
    const gap = events.map((event, index) => index === 2
      ? { ...event, stream_sequence: 3 }
      : event) as ModelBenchmarkLedgerEvent[];
    expect(foldModelBenchmarkEvents(gap)).toMatchObject({
      outcome: 'rebuild_required',
      reasonCodes: ['cursor-gap'],
    });
    expect(foldModelBenchmarkEvents([events[2], events[1]])).toMatchObject({
      outcome: 'rebuild_required',
      reasonCodes: ['cursor-gap'],
    });
  });

  it('rejects a phantom source through the real fold', () => {
    const events = mainEvents();
    const completed = events[8] as ModelBenchmarkEventEnvelope<
      'model_benchmark.trial_completed'
    >;
    const forged = makeEvent(
      'model_benchmark.trial_completed',
      {
        streamId: completed.stream_id,
        streamSequence: completed.stream_sequence,
        ordinal: 99,
      },
      completed.payload.scope,
      {
        ...completed.payload.data,
        dispatchedEventId: 'phantom-dispatch',
      },
    );
    expect(() => foldModelBenchmarkEvents([
      ...events.slice(0, 8),
      forged,
    ])).toThrowError(ModelBenchmarkReducerError);
  });

  it('accepts the expected producer kind for every event reference', () => {
    const histories = referenceHistories();
    expect(histories).toHaveLength(17);
    for (const history of histories) {
      expect(
        () => foldModelBenchmarkEvents(history.valid),
        history.name,
      ).not.toThrow();
    }
  });

  it('rejects a real seen producer of the wrong kind for every reference', () => {
    const histories = referenceHistories();
    expect(histories).toHaveLength(17);
    for (const history of histories) {
      expect(
        () => foldModelBenchmarkEvents(history.wrongKind),
        history.name,
      ).toThrowError(ModelBenchmarkReducerError);
    }
  });

  it('rejects a forged checkpoint tail', () => {
    const prefix = projected(mainEvents().slice(0, 8));
    const forged = {
      ...prefix.checkpoint,
      sourceStreamTails: prefix.checkpoint.sourceStreamTails.map(
        (tail, index) => index === 0
          ? { ...tail, lastSequence: tail.lastSequence + 1 }
          : tail,
      ),
    };
    expect(foldModelBenchmarkEvents([], { checkpoint: forged })).toMatchObject({
      outcome: 'rebuild_required',
      reasonCodes: ['checkpoint-digest-mismatch', 'source-truncated'],
    });
  });

  it('fails closed for an unknown extension event', () => {
    const event = mainEvents()[0];
    const unknown = {
      ...event,
      event_type: 'deep-improvement.model-benchmark.unknown.v1',
      payload: { ...event.payload, stem: 'model_benchmark.unknown' },
    } as unknown as ModelBenchmarkLedgerEvent;
    expect(() => foldModelBenchmarkEvents([unknown]))
      .toThrowError(ModelBenchmarkReducerError);
  });

  it('keeps the registry and explicit fold-case inventory complete', () => {
    expect([...new Set(
      MODEL_BENCHMARK_HANDLED_SPECIFIC_EVENT_STEMS,
    )].sort()).toEqual([...new Set(
      ModelBenchmarkSpecificEventStems,
    )].sort());
  });

  it('projects judge observations as separate evidence records', () => {
    const events = mainEvents();
    const judge = judgeObservationEvent(events);
    const result = projected([...events, judge]);
    expect(result.projection.modelBenchmark.scoringMatrix.judgeObservations)
      .toEqual([
        expect.objectContaining({
          observationEventId: judge.event_id,
          scoreEventId: judge.payload.data.scoreEventId,
          abstained: false,
        }),
      ]);
  });

  it('projects oracle label attestations as separate case records', () => {
    const events = mainEvents();
    const oracle = makeEvent(
      'model_benchmark.oracle_label_attested',
      extensionPosition(events, 'case-stream'),
      caseScope(),
      {
        oracleVersion: 'oracle@1',
        labelRef: 'oracle-label:1',
        labelDigest: digest('oracle-label'),
        attestationStatus: 'attested',
        confidence: 0.98,
        uncertainty: 0.02,
        priorAttestationEventId: null,
        attestationReceiptRef: 'receipt:oracle-label',
      },
    );
    const result = projected([...events, oracle]);
    expect(result.projection.modelBenchmark.scoringMatrix.oracleLabels)
      .toEqual([
        expect.objectContaining({
          attestationEventId: oracle.event_id,
          caseId: 'case-1',
          attestationStatus: 'attested',
        }),
      ]);
  });

  it('projects contamination evidence and marks affected scores', () => {
    const events = mainEvents();
    const contamination = contaminationEvent(events);
    const result = projected([...events, contamination]);
    expect(result.projection.modelBenchmark.scoringMatrix
      .contaminationEvidence).toEqual([
      expect.objectContaining({
        contaminationEventId: contamination.event_id,
        caseId: 'case-1',
        contaminationStatus: 'confirmed',
      }),
    ]);
    expect(result.projection.modelBenchmark.scoringMatrix.scores[0])
      .toMatchObject({
        contaminationStatus: 'confirmed',
        contaminationEventIds: [contamination.event_id],
      });
  });

  it('projects case exposure as a separate addressable record', () => {
    const events = mainEvents();
    const exposure = makeEvent(
      'model_benchmark.exposure_recorded',
      extensionPosition(events, 'case-stream'),
      caseScope(),
      {
        exposureClass: 'candidate',
        exposedActorRef: 'candidate:candidate-1',
        firstExposedAt: TIMESTAMP,
        evidenceRef: 'exposure:1',
        evidenceDigest: digest('exposure'),
      },
    );
    const result = projected([...events, exposure]);
    expect(result.projection.modelBenchmark.scoringMatrix.exposures).toEqual([
      expect.objectContaining({
        exposureEventId: exposure.event_id,
        exposureClass: 'candidate',
        caseId: 'case-1',
      }),
    ]);
    expect(result.projection.modelBenchmark.scoringMatrix.rankings[0])
      .toMatchObject({ eligible: false, rank: null });
  });

  it('projects disclosure into case lifecycle and public exposure', () => {
    const events = mainEvents();
    const disclosed = makeEvent(
      'model_benchmark.case_disclosed',
      extensionPosition(events, 'case-stream'),
      caseScope(),
      {
        disclosureRef: 'disclosure:1',
        disclosureDigest: digest('disclosure'),
        disclosedAt: TIMESTAMP,
        disclosurePolicyVersion: 'disclosure@1',
      },
    );
    const result = projected([...events, disclosed]);
    expect(result.projection.modelBenchmark.scoringMatrix.caseLifecycle[0])
      .toMatchObject({
        caseId: 'case-1',
        disclosedEventId: disclosed.event_id,
        disclosedAt: TIMESTAMP,
      });
    expect(result.projection.modelBenchmark.scoringMatrix.exposures[0])
      .toMatchObject({
        exposureEventId: disclosed.event_id,
        exposureClass: 'public',
      });
    expect(result.projection.modelBenchmark.scoringMatrix.rankings[0])
      .toMatchObject({ eligible: false, rank: null });
  });

  it('projects retirement into the case lifecycle', () => {
    const events = mainEvents();
    const retired = makeEvent(
      'model_benchmark.case_retired',
      extensionPosition(events, 'case-stream'),
      caseScope(),
      {
        retirementReasonCode: 'stale-case',
        retirementEvidenceRef: 'retirement:1',
        retirementEvidenceDigest: digest('retirement'),
        retiredAt: TIMESTAMP,
      },
    );
    const result = projected([...events, retired]);
    expect(result.projection.modelBenchmark.scoringMatrix.caseLifecycle[0])
      .toMatchObject({
        caseId: 'case-1',
        retiredEventId: retired.event_id,
        retirementReasonCode: 'stale-case',
      });
    expect(result.projection.modelBenchmark.scoringMatrix.rankings[0])
      .toMatchObject({ eligible: false, rank: null });
  });

  it('projects replacement into the case lifecycle', () => {
    const events = mainEvents();
    const replaced = makeEvent(
      'model_benchmark.case_replaced',
      extensionPosition(events, 'case-stream'),
      caseScope(),
      {
        replacementCaseId: 'case-2',
        replacementCaseDigest: digest('case-2'),
        replacementReasonCode: 'corrected-case',
        lineageReceiptRef: 'receipt:case-replacement',
      },
    );
    const result = projected([...events, replaced]);
    expect(result.projection.modelBenchmark.scoringMatrix.caseLifecycle[0])
      .toMatchObject({
        caseId: 'case-1',
        replacedEventId: replaced.event_id,
        replacementCaseId: 'case-2',
      });
    expect(result.projection.modelBenchmark.scoringMatrix.rankings[0])
      .toMatchObject({ eligible: false, rank: null });
  });

  it('keeps raw measurements separate from derived rankings', () => {
    const events = mainEvents();
    const beforeSelection = projected(events.slice(0, 11));
    expect(beforeSelection.projection.modelBenchmark.scoringMatrix
      .rawObservations).toHaveLength(1);
    expect(beforeSelection.projection.modelBenchmark.scoringMatrix
      .scores).toHaveLength(1);
    expect(beforeSelection.projection.modelBenchmark.scoringMatrix
      .rankings).toHaveLength(0);
    const complete = projected(events);
    expect(complete.projection.modelBenchmark.scoringMatrix
      .rawObservations).toEqual(
      beforeSelection.projection.modelBenchmark.scoringMatrix.rawObservations,
    );
    expect(complete.projection.modelBenchmark.scoringMatrix.rankings)
      .toHaveLength(1);
  });

  it('does not let an aggregate override a hard floor veto', () => {
    const result = projected(mainEvents('fail'));
    const ranking = result.projection.modelBenchmark.scoringMatrix.rankings[0];
    expect(ranking.aggregateScore).toBeNull();
    expect(ranking.eligible).toBe(false);
    expect(ranking.rank).toBeNull();
    expect(ranking.blockingVetoCodes).toContain('hard-floor:quality');
  });

  it('blocks an unresolved hard floor instead of treating it as a pass', () => {
    const result = projected(mainEvents('unknown'));
    const ranking = result.projection.modelBenchmark.scoringMatrix.rankings[0];
    expect(ranking.aggregateScore).toBeNull();
    expect(ranking.eligible).toBe(false);
    expect(ranking.rank).toBeNull();
    expect(ranking.blockingVetoCodes).toContain('hard-floor:quality');
  });

  it('abstains for every invalid state in cited judge evidence', () => {
    const cases: readonly {
      readonly name: string;
      readonly overrides: Partial<JudgeObservationData>;
      readonly code: string;
    }[] = [
      {
        name: 'explicit abstention',
        overrides: { abstained: true },
        code: 'abstained',
      },
      {
        name: 'unknown disagreement',
        overrides: { disagreementState: 'unknown' },
        code: 'inconclusive',
      },
      {
        name: 'not-observed disagreement',
        overrides: { disagreementState: 'not-observed' },
        code: 'inconclusive',
      },
      {
        name: 'confidence floor',
        overrides: { confidence: 0 },
        code: 'confidence-floor',
      },
      {
        name: 'uncertainty maximum',
        overrides: { uncertainty: 1 },
        code: 'uncertainty-max',
      },
    ];
    for (const testCase of cases) {
      const fixture = selectionWithJudgeEvidence([testCase.overrides]);
      const ranking = projected(fixture.events)
        .projection.modelBenchmark.scoringMatrix.rankings[0];
      expect(ranking, testCase.name).toMatchObject({
        aggregateScore: null,
        eligible: false,
        rank: null,
      });
      expect(ranking.blockingVetoCodes, testCase.name).toContain(
        `judge-observation:${testCase.code}:${
          fixture.judges[0].event_id
        }`,
      );
    }
  });

  it('ranks genuine cited judge evidence when no judge abstained', () => {
    const fixture = selectionWithJudgeEvidence([{}]);
    const ranking = projected(fixture.events)
      .projection.modelBenchmark.scoringMatrix.rankings[0];
    expect(ranking).toMatchObject({
      aggregateScore: 0.95,
      eligible: true,
      rank: 1,
      blockingVetoCodes: [],
    });
  });

  it('ranks when a later cited observation supersedes an abstention', () => {
    const fixture = selectionWithJudgeEvidence([
      {
        confidence: 0,
        uncertainty: 1,
        abstained: true,
        disagreementState: 'unknown',
        observationRef: 'judge-observation:abstained',
        observationDigest: digest('judge-observation-abstained'),
      },
      {
        observationRef: 'judge-observation:resolved',
        observationDigest: digest('judge-observation-resolved'),
      },
    ]);
    const ranking = projected(fixture.events)
      .projection.modelBenchmark.scoringMatrix.rankings[0];
    expect(ranking).toMatchObject({
      aggregateScore: 0.95,
      eligible: true,
      rank: 1,
      blockingVetoCodes: [],
    });
  });

  it('abstains when blocking validity evidence remains unresolved', () => {
    const fixture = validityUnknownRankingEvents();
    const result = projected(fixture.events);
    const ranking = result.projection.modelBenchmark.scoringMatrix.rankings[0];
    expect(ranking).toMatchObject({
      aggregateScore: null,
      eligible: false,
      rank: null,
    });
    expect(ranking.blockingVetoCodes)
      .toContain('validity-unknown:insufficient-evidence');
    expect(ranking.blockingVetoCodes)
      .toContain(`validity-evidence-unresolved:${
        fixture.requiredEvidenceRef
      }`);
    expect(result.projection.modelBenchmark.iterationConvergence
      .unresolvedEvidenceRefs).toEqual([fixture.requiredEvidenceRef]);
  });

  it('re-ranks after later validity evidence resolves the blocker', () => {
    const fixture = validityUnknownRankingEvents();
    const result = projected([...fixture.events, fixture.resolution]);
    const ranking = result.projection.modelBenchmark.scoringMatrix.rankings[0];
    expect(ranking).toMatchObject({
      aggregateScore: 0.95,
      eligible: true,
      rank: 1,
    });
    expect(ranking.blockingVetoCodes).toEqual([]);
    expect(result.projection.modelBenchmark.iterationConvergence
      .unresolvedEvidenceRefs).toEqual([]);
    expect(result.projection.modelBenchmark.scoringMatrix.validityUnknowns)
      .toEqual([]);
  });

  it('invalidates an existing ranking when contamination is confirmed', () => {
    const events = mainEvents();
    const judge = judgeObservationEvent(events);
    const withJudge = [...events, judge];
    const contamination = contaminationEvent(withJudge);
    const result = projected([...withJudge, contamination]);
    const ranking = result.projection.modelBenchmark.scoringMatrix.rankings[0];
    expect(ranking.aggregateScore).toBeNull();
    expect(ranking.eligible).toBe(false);
    expect(ranking.rank).toBeNull();
    expect(ranking.blockingVetoCodes)
      .toContain('contamination:confirmed:case-1');
    expect(result.projection.modelBenchmark.modeStatus.rankingState)
      .toBe('blocked');
    expect(result.projection.modelBenchmark.scoringMatrix
      .pairwiseComparisonResults[0]).toMatchObject({
      contaminationStatus: 'confirmed',
      contaminationEventIds: [contamination.event_id],
    });
  });

  it('rejects a regressive cell transition without changing the cell', () => {
    const events = mainEvents().slice(0, 9);
    const before = projected(events);
    const admittedAgain = makeEvent(
      'model_benchmark.trial_case_admitted',
      extensionPosition(events, 'trial-stream'),
      trialScope(),
      {
        trialMatrixKey: matrix(),
        caseRef: 'case:1',
        caseDigest: digest('fixture'),
        taskLineage: lineage(),
        admissionPolicyVersion: 'admission@1',
        admissionReasonCode: 'eligible',
      },
    );
    expect(() => foldModelBenchmarkEvents([...events, admittedAgain]))
      .toThrowError(ModelBenchmarkReducerError);
    expect(before.projection.modelBenchmark.iterationConvergence
      .cells[0].disposition).toBe('completed');
  });

  it('accepts a legal forward cell transition from a checkpoint', () => {
    const events = mainEvents();
    const admitted = projected(events.slice(0, 7));
    const advanced = foldModelBenchmarkEvents([events[7]], {
      checkpoint: admitted.checkpoint,
    });
    expect(advanced.outcome).toBe('projected');
    if (advanced.outcome !== 'projected') {
      throw new Error('Expected legal transition');
    }
    expect(advanced.projection.modelBenchmark.iterationConvergence
      .cells[0].disposition).toBe('dispatched');
  });

  it('projects each judge result as an addressable pairwise comparison', () => {
    const events = mainEvents();
    const judge = judgeObservationEvent(events);
    const result = projected([...events, judge]);
    expect(result.projection.modelBenchmark.scoringMatrix
      .pairwiseComparisonResults).toEqual([
      expect.objectContaining({
        comparisonResultId: judge.event_id,
        pairedBlockId: matrix().pairedBlockId,
        result: 'observed',
        contaminationStatus: 'not-observed',
      }),
    ]);
  });

  it('projects usage and latency as an addressable operational slice', () => {
    const events = mainEvents();
    const observation = events.find(
      (event) =>
        event.payload.stem === 'model_benchmark.trial_observation_recorded',
    );
    if (observation === undefined) throw new Error('Observation is missing');
    const usage = makeEvent(
      'model_benchmark.usage_observed',
      extensionPosition(events, 'trial-stream'),
      trialScope(),
      {
        trialMatrixKey: matrix(),
        observationEventId: observation.event_id,
        usage: {
          inputTokens: 100,
          outputTokens: 50,
          reasoningTokens: 25,
          cacheReadTokens: 10,
          cacheWriteTokens: 5,
          retryCount: 0,
          realizedCostMicrounits: 1234,
          currencyCode: 'USD',
        },
        latency: {
          ttftMs: 100,
          interTokenP50Ms: 20,
          endToEndMs: 1000,
          tailP95Ms: 1200,
        },
        usageReceiptRef: 'receipt:usage',
        usageReceiptDigest: digest('usage'),
      },
    );
    const result = projected([...events, usage]);
    expect(result.projection.modelBenchmark.scoringMatrix.costLatencySlices)
      .toEqual([
        expect.objectContaining({
          sliceId: usage.event_id,
          usageEventId: usage.event_id,
          candidateId: 'candidate-1',
          usage: expect.objectContaining({
            realizedCostMicrounits: 1234,
          }),
          latency: expect.objectContaining({
            endToEndMs: 1000,
          }),
        }),
      ]);
  });

  it('matches full replay when resumed from a checkpoint', () => {
    const events = mainEvents();
    const split = 9;
    const prefix = projected(events.slice(0, split));
    const resumed = foldModelBenchmarkEvents(events.slice(split), {
      checkpoint: prefix.checkpoint,
    });
    expect(resumed.outcome).toBe('projected');
    if (resumed.outcome !== 'projected') throw new Error('Expected resumed');
    expect(canonicalJson(resumed.projection))
      .toBe(canonicalJson(projected(events).projection));
  });

  it('exposes common and model fold branches without widening common state', () => {
    expect(MODEL_BENCHMARK_FOLD_BRANCHES.map(
      (branch) => branch.projectionKey,
    )).toEqual(['common', 'modelBenchmark']);
    expect(Object.keys(createModelBenchmarkProjectionState().common))
      .not.toContain('modelBenchmark');
  });

  it('delegates shared events to the unchanged common fold semantics', () => {
    const hash = digest('common-run');
    const prepared = prepareDeepImprovementCommonEvent({
      stem: 'deep_improvement_common.run_started',
      scope: baseScope(),
      prevEventHash: hash,
      replay: replay('common-run'),
      data: {
        generation: 1,
        charterDigest: hash,
        configDigest: hash,
        operatorRef: 'operator:model-benchmark',
        serviceContractVersion: 'deep-improvement-common@1',
        replayFingerprint: hash,
        maxIterations: 4,
      },
      eventId: 'common-event-1',
      streamId: 'common-stream',
      streamSequence: 1,
      occurredAt: TIMESTAMP,
      recordedAt: TIMESTAMP,
      producer: { name: 'common-service', version: '1' },
      authorityEpoch: 1,
      correlationId: 'run-1',
      causationId: null,
      idempotencyKey: 'common-event-1',
    }, registry);
    const event = prepared.envelope as DeepImprovementCommonLedgerEvent;
    const composite = projected([event as ModelBenchmarkLedgerEvent]);
    const common = foldDeepImprovementCommonEvents([event]);
    expect(common.outcome).toBe('projected');
    if (common.outcome !== 'projected') throw new Error('Expected common fold');
    expect(canonicalJson(composite.projection.common))
      .toBe(canonicalJson(common.projection));
  });

  it('matches the fold oracle through the real verified mode surface', () => {
    const event = mainEvents()[0];
    const verified = verifiedEvent(event);
    const initial = createModelBenchmarkProjectionState();
    verifyModelBenchmarkReducerSurface(
      MODEL_BENCHMARK_REDUCER_SURFACE,
      verified,
      initial,
    );
    const reduced = MODEL_BENCHMARK_REDUCER_SURFACE.reduce(
      verified,
      initial as typeof initial & JsonObject,
    );
    expect(canonicalJson(reduced.state))
      .toBe(canonicalJson(projected([event]).projection));
  });
});

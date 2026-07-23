// ───────────────────────────────────────────────────────────────────
// MODULE: Model Benchmark Ledger Schema
// ───────────────────────────────────────────────────────────────────

import {
  DEEP_IMPROVEMENT_COMMON_MODE_PAYLOAD_FIELDS,
  DEEP_IMPROVEMENT_COMMON_SCORE_WRITE_BACKEND_REF,
  createDeepImprovementCommonLedgerPayload,
  deepImprovementCommonEventDefinitions,
  deepImprovementCommonPayloadDigest,
  isDeepImprovementCommonEventStem,
} from '../deep-improvement-common-ledger-schema/index.js';
import {
  CURRENT_ENVELOPE_VERSION,
  EVENT_ENVELOPE_FIELDS,
  EventTypeRegistry,
  canonicalBytes,
  prepareEventWrite,
  sha256Bytes,
} from '../event-envelope/index.js';
import {
  ModelBenchmarkEventStems,
  ModelBenchmarkSpecificEventStems,
  ModelBenchmarkSpecificWireEventTypes,
  ModelBenchmarkWireEventTypes,
} from './model-benchmark-ledger-types.js';

import type {
  DeepImprovementCommonEventStem,
  DeepImprovementCommonLedgerPayload,
  DeepImprovementCommonPayloadMap,
  DeepImprovementCommonReplayMetadata,
  DeepImprovementCommonScopeMap,
} from '../deep-improvement-common-ledger-schema/index.js';
import type {
  EventProducer,
  EventTypeDefinition,
  EventWritePreflight,
  JsonObject,
  JsonValue,
} from '../event-envelope/index.js';
import type {
  ModelBenchmarkEventEnvelope,
  ModelBenchmarkEventStem,
  ModelBenchmarkLedgerPayload,
  ModelBenchmarkPayloadMap,
  ModelBenchmarkReplayMetadata,
  ModelBenchmarkScopeMap,
  ModelBenchmarkSpecificEventStem,
  ModelBenchmarkSpecificPayloadMap,
  ModelBenchmarkSpecificScopeMap,
} from './model-benchmark-ledger-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. PUBLIC INPUTS
// ───────────────────────────────────────────────────────────────────

export interface ModelBenchmarkEventInput<
  TStem extends ModelBenchmarkEventStem,
> {
  readonly stem: TStem;
  readonly scope: ModelBenchmarkScopeMap[TStem];
  readonly prevEventHash: string;
  readonly replay: ModelBenchmarkReplayMetadata;
  readonly data: ModelBenchmarkPayloadMap[TStem];
  readonly eventId: string;
  readonly streamId: string;
  readonly streamSequence: number;
  readonly occurredAt: string;
  readonly recordedAt: string;
  readonly producer: EventProducer;
  readonly authorityEpoch: number;
  readonly correlationId: string;
  readonly causationId: string | null;
  readonly idempotencyKey: string;
  readonly prerequisiteEvent?: EventWritePreflight;
}

// ───────────────────────────────────────────────────────────────────
// 2. CONTRACT TABLES
// ───────────────────────────────────────────────────────────────────

export const MODEL_BENCHMARK_EVENT_VERSION = 1 as const;

export const MODEL_BENCHMARK_SCORE_WRITE_BACKEND_REF =
  DEEP_IMPROVEMENT_COMMON_SCORE_WRITE_BACKEND_REF;

export const MODEL_BENCHMARK_SHARED_ENVELOPE_FIELDS = Object.freeze([
  ...EVENT_ENVELOPE_FIELDS,
] as const);

export const MODEL_BENCHMARK_MODE_PAYLOAD_FIELDS =
  DEEP_IMPROVEMENT_COMMON_MODE_PAYLOAD_FIELDS;

type DataFieldKind =
  | 'boolean'
  | 'code'
  | 'code-array'
  | 'completion-counts'
  | 'digest'
  | 'digest-array'
  | 'identifier'
  | 'identifier-array'
  | 'latency-observation'
  | 'nonempty-code-array'
  | 'nonempty-identifier-array'
  | 'nonempty-reference-array'
  | 'nullable-identifier'
  | 'prose'
  | 'ratio'
  | 'reference'
  | 'reference-array'
  | 'score-observation'
  | 'task-lineage'
  | 'timestamp'
  | 'trial-matrix-key'
  | 'uint32'
  | 'usage-observation'
  | 'version';

interface EnumFieldRule {
  readonly kind: 'enum';
  readonly values: readonly string[];
}

type DataFieldRule = DataFieldKind | EnumFieldRule;

function enumRule(...values: readonly string[]): EnumFieldRule {
  return Object.freeze({ kind: 'enum', values: Object.freeze([...values]) });
}

const COMPATIBILITY_DECISION_RULE = enumRule(
  'blocked',
  'compatible',
  'exact',
  'migrate',
  'pin-old-runtime',
);
const SCORE_WRITE_BACKEND_RULE = enumRule(
  DEEP_IMPROVEMENT_COMMON_SCORE_WRITE_BACKEND_REF,
);

const DATA_FIELD_RULES = Object.freeze({
  'model_benchmark.run_declared': {
    generation: 'uint32',
    benchmarkRecipeRef: 'reference',
    benchmarkRecipeDigest: 'digest',
    evaluatorServiceRef: 'reference',
    canaryServiceRef: 'reference',
    promotionServiceRef: 'reference',
    sharedServiceContractVersion: 'version',
    replayFingerprint: 'digest',
  },
  'model_benchmark.benchmark_capsule_sealed': {
    capsuleRef: 'reference',
    capsuleDigest: 'digest',
    taskSetDigest: 'digest',
    taskLineage: 'task-lineage',
    canarySuiteRef: 'reference',
    canarySuiteDigest: 'digest',
    sealReceiptRef: 'reference',
  },
  'model_benchmark.workload_snapshot_sealed': {
    workloadSnapshotRef: 'reference',
    workloadSnapshotDigest: 'digest',
    taskFamilyIds: 'nonempty-identifier-array',
    caseCount: 'uint32',
    workloadProfileVersion: 'version',
    snapshotAt: 'timestamp',
    sealReceiptRef: 'reference',
  },
  'model_benchmark.run_started': {
    declarationEventId: 'identifier',
    declarationPayloadDigest: 'digest',
    capsuleEventId: 'identifier',
    capsulePayloadDigest: 'digest',
    workloadEventId: 'identifier',
    workloadPayloadDigest: 'digest',
    executionReceiptRef: 'reference',
    startedAt: 'timestamp',
  },
  'model_benchmark.run_paused': {
    pauseReason: 'prose',
    checkpointRef: 'reference',
    checkpointDigest: 'digest',
    pendingTrialIds: 'identifier-array',
    pausedAt: 'timestamp',
  },
  'model_benchmark.run_resumed': {
    priorTailDigest: 'digest',
    resumeReason: 'prose',
    compatibilityDecision: COMPATIBILITY_DECISION_RULE,
    recoveryReceiptRef: 'reference',
    resumedAt: 'timestamp',
  },
  'model_benchmark.run_closed': {
    terminalOutcome: enumRule('aborted', 'completed', 'quarantined'),
    finalLedgerTailHash: 'digest',
    counts: 'completion-counts',
    completionEvidenceRefs: 'reference-array',
    closedAt: 'timestamp',
  },
  'model_benchmark.benchmark_design_declared': {
    designRef: 'reference',
    designDigest: 'digest',
    candidateIds: 'nonempty-identifier-array',
    taskFamilyIds: 'nonempty-identifier-array',
    pairedBlockIds: 'nonempty-identifier-array',
    protocolVariants: 'nonempty-code-array',
    familyQuotaPolicyVersion: 'version',
    designPolicyVersion: 'version',
  },
  'model_benchmark.trial_block_declared': {
    taskFamilyId: 'identifier',
    candidateIds: 'nonempty-identifier-array',
    modelFingerprints: 'digest-array',
    executionPaths: 'nonempty-code-array',
    pairedBlockIds: 'nonempty-identifier-array',
    protocolVariants: 'nonempty-code-array',
    seed: 'uint32',
    perturbationId: 'identifier',
    workloadProfileId: 'identifier',
    blockDigest: 'digest',
  },
  'model_benchmark.trial_case_admitted': {
    trialMatrixKey: 'trial-matrix-key',
    caseRef: 'reference',
    caseDigest: 'digest',
    taskLineage: 'task-lineage',
    admissionPolicyVersion: 'version',
    admissionReasonCode: 'code',
  },
  'model_benchmark.trial_case_rejected': {
    trialMatrixKey: 'trial-matrix-key',
    caseRef: 'reference',
    caseDigest: 'digest',
    taskLineage: 'task-lineage',
    admissionPolicyVersion: 'version',
    admissionReasonCode: 'code',
    rejectionEvidenceRef: 'reference',
    rejectionEvidenceDigest: 'digest',
  },
  'model_benchmark.trial_dispatched': {
    trialMatrixKey: 'trial-matrix-key',
    inputRef: 'reference',
    inputDigest: 'digest',
    dispatchReceiptRef: 'reference',
    dispatchReceiptDigest: 'digest',
    dispatchedAt: 'timestamp',
  },
  'model_benchmark.trial_completed': {
    trialMatrixKey: 'trial-matrix-key',
    dispatchedEventId: 'identifier',
    dispatchedPayloadDigest: 'digest',
    rawResultRef: 'reference',
    rawResultDigest: 'digest',
    inputDigest: 'digest',
    outputDigest: 'digest',
    completionReceiptRef: 'reference',
    completedAt: 'timestamp',
  },
  'model_benchmark.trial_failed': {
    trialMatrixKey: 'trial-matrix-key',
    dispatchedEventId: 'identifier',
    failureStage: enumRule('dispatch', 'execution', 'provider', 'timeout'),
    reasonCode: 'code',
    failureEvidenceRef: 'reference',
    failureEvidenceDigest: 'digest',
    failureReceiptRef: 'reference',
    retryable: 'boolean',
  },
  'model_benchmark.trial_unknown': {
    trialMatrixKey: 'trial-matrix-key',
    dispatchedEventId: 'identifier',
    reasonCode: 'code',
    lastReceiptRef: 'reference',
    evidenceDigest: 'digest',
    observedAt: 'timestamp',
  },
  'model_benchmark.trial_invalidated': {
    trialMatrixKey: 'trial-matrix-key',
    sourceEventId: 'identifier',
    sourcePayloadDigest: 'digest',
    reasonCode: 'code',
    invalidationEvidenceRef: 'reference',
    invalidationEvidenceDigest: 'digest',
    invalidatedAt: 'timestamp',
  },
  'model_benchmark.trial_observation_recorded': {
    trialMatrixKey: 'trial-matrix-key',
    completedEventId: 'identifier',
    completedPayloadDigest: 'digest',
    inputDigest: 'digest',
    rawOutputRef: 'reference',
    rawOutputDigest: 'digest',
    evaluatorObservationRef: 'reference',
    evaluatorObservationDigest: 'digest',
    executionReceiptRef: 'reference',
  },
  'model_benchmark.score_vector_observed': {
    trialMatrixKey: 'trial-matrix-key',
    observationEventId: 'identifier',
    observationPayloadDigest: 'digest',
    scorePolicyVersion: 'version',
    scoreWriteBackendRef: SCORE_WRITE_BACKEND_RULE,
    scoreVector: 'score-observation',
    scoringReceiptRef: 'reference',
  },
  'model_benchmark.usage_observed': {
    trialMatrixKey: 'trial-matrix-key',
    observationEventId: 'identifier',
    usage: 'usage-observation',
    latency: 'latency-observation',
    usageReceiptRef: 'reference',
    usageReceiptDigest: 'digest',
  },
  'model_benchmark.judge_observation_recorded': {
    trialMatrixKey: 'trial-matrix-key',
    scoreEventId: 'identifier',
    scorePayloadDigest: 'digest',
    blindedJudgeRef: 'reference',
    judgeFamilyCode: 'code',
    judgeBuildFingerprint: 'digest',
    promptDigest: 'digest',
    contextDigest: 'digest',
    toolDigest: 'digest',
    calibrationSliceId: 'identifier',
    orderProbeOutcome: enumRule('fail', 'pass', 'unknown'),
    styleProbeOutcome: enumRule('fail', 'pass', 'unknown'),
    confidence: 'ratio',
    uncertainty: 'ratio',
    abstained: 'boolean',
    disagreementState: enumRule('disagreed', 'not-observed', 'resolved', 'unknown'),
    observationRef: 'reference',
    observationDigest: 'digest',
  },
  'model_benchmark.oracle_label_attested': {
    oracleVersion: 'version',
    labelRef: 'reference',
    labelDigest: 'digest',
    attestationStatus: enumRule('attested', 'corrected', 'unknown'),
    confidence: 'ratio',
    uncertainty: 'ratio',
    priorAttestationEventId: 'nullable-identifier',
    attestationReceiptRef: 'reference',
  },
  'model_benchmark.contamination_evidence_recorded': {
    contaminationStatus: enumRule('clean', 'confirmed', 'suspected', 'unknown'),
    detectorFingerprint: 'digest',
    evidenceRef: 'reference',
    evidenceDigest: 'digest',
    exposureEventIds: 'identifier-array',
    reasonCode: 'code',
  },
  'model_benchmark.exposure_recorded': {
    exposureClass: enumRule('candidate', 'judge', 'oracle', 'proposer', 'public'),
    exposedActorRef: 'reference',
    firstExposedAt: 'timestamp',
    evidenceRef: 'reference',
    evidenceDigest: 'digest',
  },
  'model_benchmark.case_disclosed': {
    disclosureRef: 'reference',
    disclosureDigest: 'digest',
    disclosedAt: 'timestamp',
    disclosurePolicyVersion: 'version',
  },
  'model_benchmark.case_retired': {
    retirementReasonCode: 'code',
    retirementEvidenceRef: 'reference',
    retirementEvidenceDigest: 'digest',
    retiredAt: 'timestamp',
  },
  'model_benchmark.case_replaced': {
    replacementCaseId: 'identifier',
    replacementCaseDigest: 'digest',
    replacementReasonCode: 'code',
    lineageReceiptRef: 'reference',
  },
  'model_benchmark.judge_calibration_sealed': {
    blindedJudgeRef: 'reference',
    judgeFamilyCode: 'code',
    judgeBuildFingerprint: 'digest',
    calibrationSliceId: 'identifier',
    calibrationRef: 'reference',
    calibrationDigest: 'digest',
    orderProbeDigest: 'digest',
    styleProbeDigest: 'digest',
    calibrationPolicyVersion: 'version',
    sealReceiptRef: 'reference',
  },
  'model_benchmark.validity_plan_sealed': {
    validityPlanRef: 'reference',
    validityPlanDigest: 'digest',
    requiredEvidenceCodes: 'nonempty-code-array',
    hardBlockerCodes: 'code-array',
    validityPolicyVersion: 'version',
    sealReceiptRef: 'reference',
  },
  'model_benchmark.validity_card_derived': {
    state: enumRule('invalid', 'unknown', 'valid'),
    evidenceEventIds: 'nonempty-identifier-array',
    evidenceSetDigest: 'digest',
    blockerCodes: 'code-array',
    uncertainty: 'ratio',
    derivationPolicyVersion: 'version',
    derivationReceiptRef: 'reference',
  },
  'model_benchmark.validity_unknown_recorded': {
    unknownCode: 'code',
    requiredEvidenceRefs: 'nonempty-reference-array',
    evidenceSetDigest: 'digest',
    blocker: 'boolean',
    recordedAt: 'timestamp',
  },
  'model_benchmark.selection_evidence_sealed': {
    evidenceEventIds: 'nonempty-identifier-array',
    evidenceSetDigest: 'digest',
    manifestRef: 'reference',
    manifestDigest: 'digest',
    validityCardEventIds: 'nonempty-identifier-array',
    sealedAt: 'timestamp',
    sealReceiptRef: 'reference',
  },
  'model_benchmark.selection_reduction_requested': {
    sealedEvidenceEventId: 'identifier',
    sealedEvidencePayloadDigest: 'digest',
    reducerContractVersion: 'version',
    requestReceiptRef: 'reference',
    requestedAt: 'timestamp',
  },
} as const satisfies Readonly<
  Record<ModelBenchmarkSpecificEventStem, Readonly<Record<string, DataFieldRule>>>
>);

const BASE_SCOPE_FIELDS = ['runId', 'lineageId', 'variant'] as const;
const SCOPE_FIELDS = Object.freeze({
  'model_benchmark.run_declared': BASE_SCOPE_FIELDS,
  'model_benchmark.benchmark_capsule_sealed': [
    ...BASE_SCOPE_FIELDS, 'capsuleId',
  ],
  'model_benchmark.workload_snapshot_sealed': [
    ...BASE_SCOPE_FIELDS, 'workloadSnapshotId',
  ],
  'model_benchmark.run_started': BASE_SCOPE_FIELDS,
  'model_benchmark.run_paused': BASE_SCOPE_FIELDS,
  'model_benchmark.run_resumed': BASE_SCOPE_FIELDS,
  'model_benchmark.run_closed': BASE_SCOPE_FIELDS,
  'model_benchmark.benchmark_design_declared': [
    ...BASE_SCOPE_FIELDS, 'designId',
  ],
  'model_benchmark.trial_block_declared': [
    ...BASE_SCOPE_FIELDS, 'trialBlockId',
  ],
  'model_benchmark.trial_case_admitted': [
    ...BASE_SCOPE_FIELDS,
    'trialId',
    'taskInstanceId',
    'taskFamilyId',
    'candidateId',
    'modelFingerprint',
    'executionPath',
    'pairedBlockId',
  ],
  'model_benchmark.trial_case_rejected': [
    ...BASE_SCOPE_FIELDS,
    'trialId',
    'taskInstanceId',
    'taskFamilyId',
    'candidateId',
    'modelFingerprint',
    'executionPath',
    'pairedBlockId',
  ],
  'model_benchmark.trial_dispatched': [
    ...BASE_SCOPE_FIELDS,
    'trialId',
    'taskInstanceId',
    'taskFamilyId',
    'candidateId',
    'modelFingerprint',
    'executionPath',
    'pairedBlockId',
  ],
  'model_benchmark.trial_completed': [
    ...BASE_SCOPE_FIELDS,
    'trialId',
    'taskInstanceId',
    'taskFamilyId',
    'candidateId',
    'modelFingerprint',
    'executionPath',
    'pairedBlockId',
  ],
  'model_benchmark.trial_failed': [
    ...BASE_SCOPE_FIELDS,
    'trialId',
    'taskInstanceId',
    'taskFamilyId',
    'candidateId',
    'modelFingerprint',
    'executionPath',
    'pairedBlockId',
  ],
  'model_benchmark.trial_unknown': [
    ...BASE_SCOPE_FIELDS,
    'trialId',
    'taskInstanceId',
    'taskFamilyId',
    'candidateId',
    'modelFingerprint',
    'executionPath',
    'pairedBlockId',
  ],
  'model_benchmark.trial_invalidated': [
    ...BASE_SCOPE_FIELDS,
    'trialId',
    'taskInstanceId',
    'taskFamilyId',
    'candidateId',
    'modelFingerprint',
    'executionPath',
    'pairedBlockId',
  ],
  'model_benchmark.trial_observation_recorded': [
    ...BASE_SCOPE_FIELDS,
    'trialId',
    'taskInstanceId',
    'taskFamilyId',
    'candidateId',
    'modelFingerprint',
    'executionPath',
    'pairedBlockId',
  ],
  'model_benchmark.score_vector_observed': [
    ...BASE_SCOPE_FIELDS,
    'trialId',
    'taskInstanceId',
    'taskFamilyId',
    'candidateId',
    'modelFingerprint',
    'executionPath',
    'pairedBlockId',
  ],
  'model_benchmark.usage_observed': [
    ...BASE_SCOPE_FIELDS,
    'trialId',
    'taskInstanceId',
    'taskFamilyId',
    'candidateId',
    'modelFingerprint',
    'executionPath',
    'pairedBlockId',
  ],
  'model_benchmark.judge_observation_recorded': [
    ...BASE_SCOPE_FIELDS,
    'trialId',
    'taskInstanceId',
    'taskFamilyId',
    'candidateId',
    'modelFingerprint',
    'executionPath',
    'pairedBlockId',
  ],
  'model_benchmark.oracle_label_attested': [
    ...BASE_SCOPE_FIELDS, 'caseId', 'taskInstanceId', 'taskFamilyId',
  ],
  'model_benchmark.contamination_evidence_recorded': [
    ...BASE_SCOPE_FIELDS, 'caseId', 'taskInstanceId', 'taskFamilyId',
  ],
  'model_benchmark.exposure_recorded': [
    ...BASE_SCOPE_FIELDS, 'caseId', 'taskInstanceId', 'taskFamilyId',
  ],
  'model_benchmark.case_disclosed': [
    ...BASE_SCOPE_FIELDS, 'caseId', 'taskInstanceId', 'taskFamilyId',
  ],
  'model_benchmark.case_retired': [
    ...BASE_SCOPE_FIELDS, 'caseId', 'taskInstanceId', 'taskFamilyId',
  ],
  'model_benchmark.case_replaced': [
    ...BASE_SCOPE_FIELDS, 'caseId', 'taskInstanceId', 'taskFamilyId',
  ],
  'model_benchmark.judge_calibration_sealed': [
    ...BASE_SCOPE_FIELDS, 'judgeCalibrationId',
  ],
  'model_benchmark.validity_plan_sealed': [
    ...BASE_SCOPE_FIELDS, 'validityPlanId',
  ],
  'model_benchmark.validity_card_derived': [
    ...BASE_SCOPE_FIELDS, 'validityPlanId',
  ],
  'model_benchmark.validity_unknown_recorded': [
    ...BASE_SCOPE_FIELDS, 'validityPlanId',
  ],
  'model_benchmark.selection_evidence_sealed': [
    ...BASE_SCOPE_FIELDS, 'evidenceSetId',
  ],
  'model_benchmark.selection_reduction_requested': [
    ...BASE_SCOPE_FIELDS, 'evidenceSetId',
  ],
} as const satisfies Readonly<
  Record<ModelBenchmarkSpecificEventStem, readonly string[]>
>);

const HASH_PATTERN = /^[a-f0-9]{64}$/;
const SYSTEM_TOKEN_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:/@-]{0,255}$/;
const CODE_TOKEN_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:/@-]{0,127}$/;
const MAX_PROSE_LENGTH = 4_096;
const MAX_SCORE_COMPONENTS = 64;
const MATRIX_KEY_FIELDS = Object.freeze([
  'candidateId',
  'modelFingerprint',
  'executionPath',
  'taskInstanceId',
  'taskFamilyId',
  'pairedBlockId',
  'protocolVariant',
  'seed',
  'perturbationId',
  'workloadProfileId',
  'promptRecipeFingerprint',
  'routeFingerprint',
  'frameworkFingerprint',
  'toolRecipeFingerprint',
  'attempt',
] as const);
const SCORE_OBSERVATION_FIELDS = Object.freeze([
  'components',
  'evaluatorContractHash',
  'evaluatorFingerprint',
] as const);
const SCORE_COMPONENT_FIELDS = Object.freeze([
  'dimensionCode',
  'rawScore',
  'hardFloorStatus',
  'measurementStatus',
  'uncertainty',
  'observationRef',
  'observationDigest',
] as const);
const USAGE_FIELDS = Object.freeze([
  'inputTokens',
  'outputTokens',
  'reasoningTokens',
  'cacheReadTokens',
  'cacheWriteTokens',
  'retryCount',
  'realizedCostMicrounits',
  'currencyCode',
] as const);
const LATENCY_FIELDS = Object.freeze([
  'ttftMs',
  'interTokenP50Ms',
  'endToEndMs',
  'tailP95Ms',
] as const);
const TASK_LINEAGE_FIELDS = Object.freeze([
  'sourceCutoffAt',
  'visibility',
  'proposerVisibility',
  'oracleVisibility',
  'parentCaseId',
  'firstExposureAt',
  'disclosedAt',
  'retiredAt',
  'replacementCaseId',
] as const);
const COMPLETION_COUNT_FIELDS = Object.freeze([
  'admittedTrials',
  'completedTrials',
  'failedTrials',
  'unknownTrials',
  'invalidatedTrials',
] as const);
const FORBIDDEN_MUTABLE_FIELDS = new Set([
  'body',
  'caseBody',
  'caseContents',
  'content',
  'evaluatorFeedback',
  'evidenceBlob',
  'goldContents',
  'judgePrompt',
  'outputBody',
  'promptBody',
  'rawBody',
  'rawEvidence',
  'rawOutput',
  'reportBody',
  'sourceText',
  'text',
  'transcript',
]);

// ───────────────────────────────────────────────────────────────────
// 3. CLOSED-SHAPE VALIDATION
// ───────────────────────────────────────────────────────────────────

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && !Array.isArray(value) && typeof value === 'object';
}

function isProse(value: unknown): value is string {
  return typeof value === 'string'
    && value.trim().length > 0
    && value.length <= MAX_PROSE_LENGTH;
}

function isSystemToken(value: unknown): value is string {
  return typeof value === 'string' && SYSTEM_TOKEN_PATTERN.test(value);
}

function isCodeToken(value: unknown): value is string {
  return typeof value === 'string' && CODE_TOKEN_PATTERN.test(value);
}

function isDigest(value: unknown): value is string {
  return typeof value === 'string' && HASH_PATTERN.test(value);
}

function isTimestamp(value: unknown): value is string {
  return typeof value === 'string'
    && value.length <= 64
    && !Number.isNaN(new Date(value).getTime());
}

function isNullableTimestamp(value: unknown): boolean {
  return value === null || isTimestamp(value);
}

function isUint32(value: unknown): value is number {
  return Number.isSafeInteger(value)
    && (value as number) >= 0
    && (value as number) <= 0xffff_ffff;
}

function isRatio(value: unknown): value is number {
  return typeof value === 'number'
    && Number.isFinite(value)
    && value >= 0
    && value <= 1;
}

function hasExactFields(
  value: Record<string, unknown>,
  fields: readonly string[],
): boolean {
  const keys = Object.keys(value).sort();
  const expected = [...fields].sort();
  return keys.length === expected.length
    && keys.every((key, index) => key === expected[index]);
}

function hasForbiddenMutableField(value: unknown): boolean {
  if (Array.isArray(value)) return value.some(hasForbiddenMutableField);
  if (!isObject(value)) return false;
  return Object.entries(value).some(([key, child]) => (
    FORBIDDEN_MUTABLE_FIELDS.has(key) || hasForbiddenMutableField(child)
  ));
}

function isTokenArray(
  value: unknown,
  validator: (candidate: unknown) => candidate is string,
  requireNonEmpty = false,
): value is string[] {
  return Array.isArray(value)
    && (!requireNonEmpty || value.length > 0)
    && value.every(validator);
}

function isTrialMatrixKey(value: unknown): boolean {
  if (!isObject(value) || !hasExactFields(value, MATRIX_KEY_FIELDS)) return false;
  return isSystemToken(value.candidateId)
    && isDigest(value.modelFingerprint)
    && isCodeToken(value.executionPath)
    && isSystemToken(value.taskInstanceId)
    && isSystemToken(value.taskFamilyId)
    && isSystemToken(value.pairedBlockId)
    && isCodeToken(value.protocolVariant)
    && isUint32(value.seed)
    && isSystemToken(value.perturbationId)
    && isSystemToken(value.workloadProfileId)
    && isDigest(value.promptRecipeFingerprint)
    && isDigest(value.routeFingerprint)
    && isDigest(value.frameworkFingerprint)
    && isDigest(value.toolRecipeFingerprint)
    && isUint32(value.attempt)
    && value.attempt !== 0;
}

function isScoreObservation(value: unknown): boolean {
  if (!isObject(value)
    || !hasExactFields(value, SCORE_OBSERVATION_FIELDS)
    || !Array.isArray(value.components)
    || value.components.length === 0
    || value.components.length > MAX_SCORE_COMPONENTS
    || !isDigest(value.evaluatorContractHash)
    || !isDigest(value.evaluatorFingerprint)) return false;
  const dimensions = new Set<string>();
  for (const component of value.components) {
    if (!isObject(component)
      || !hasExactFields(component, SCORE_COMPONENT_FIELDS)
      || !isCodeToken(component.dimensionCode)
      || !isRatio(component.rawScore)
      || !['fail', 'not-applicable', 'pass', 'unknown'].includes(
        String(component.hardFloorStatus),
      )
      || !['abstained', 'missing', 'observed'].includes(
        String(component.measurementStatus),
      )
      || !isRatio(component.uncertainty)
      || !isSystemToken(component.observationRef)
      || !isDigest(component.observationDigest)
      || dimensions.has(component.dimensionCode)) return false;
    dimensions.add(component.dimensionCode);
  }
  return true;
}

function isUsageObservation(value: unknown): boolean {
  if (!isObject(value) || !hasExactFields(value, USAGE_FIELDS)) return false;
  return USAGE_FIELDS.slice(0, 7).every((field) => isUint32(value[field]))
    && isCodeToken(value.currencyCode);
}

function isLatencyObservation(value: unknown): boolean {
  return isObject(value)
    && hasExactFields(value, LATENCY_FIELDS)
    && LATENCY_FIELDS.every((field) => isUint32(value[field]));
}

function isTaskLineage(value: unknown): boolean {
  return isObject(value)
    && hasExactFields(value, TASK_LINEAGE_FIELDS)
    && isTimestamp(value.sourceCutoffAt)
    && ['private', 'public', 'sealed'].includes(String(value.visibility))
    && ['blind', 'known'].includes(String(value.proposerVisibility))
    && ['blind', 'known'].includes(String(value.oracleVisibility))
    && (value.parentCaseId === null || isSystemToken(value.parentCaseId))
    && isNullableTimestamp(value.firstExposureAt)
    && isNullableTimestamp(value.disclosedAt)
    && isNullableTimestamp(value.retiredAt)
    && (value.replacementCaseId === null || isSystemToken(value.replacementCaseId));
}

function isReplayMetadata(value: unknown): boolean {
  if (!isObject(value) || !hasExactFields(
    value,
    ['fingerprint_version', 'final_digest', 'replay_input_digests'],
  )) return false;
  return Number.isSafeInteger(value.fingerprint_version)
    && (value.fingerprint_version as number) > 0
    && isDigest(value.final_digest)
    && isObject(value.replay_input_digests)
    && Object.entries(value.replay_input_digests).every(
      ([key, digest]) => isCodeToken(key) && isDigest(digest),
    );
}

function isScope(
  stem: ModelBenchmarkSpecificEventStem,
  value: unknown,
): boolean {
  if (!isObject(value)) return false;
  const required = SCOPE_FIELDS[stem];
  if (!hasExactFields(value, required) || value.variant !== 'model-benchmark') {
    return false;
  }
  for (const [field, candidate] of Object.entries(value)) {
    if (field === 'variant') continue;
    if (field === 'modelFingerprint') {
      if (!isDigest(candidate)) return false;
    } else if (field === 'executionPath') {
      if (!isCodeToken(candidate)) return false;
    } else if (!isSystemToken(candidate)) return false;
  }
  return true;
}

function isFieldValue(
  rule: DataFieldRule,
  value: unknown,
): value is JsonValue {
  if (typeof rule !== 'string') return rule.values.includes(String(value));
  switch (rule) {
    case 'boolean':
      return typeof value === 'boolean';
    case 'code':
      return isCodeToken(value);
    case 'code-array':
      return isTokenArray(value, isCodeToken);
    case 'completion-counts':
      return isObject(value)
        && hasExactFields(value, COMPLETION_COUNT_FIELDS)
        && Object.values(value).every(isUint32);
    case 'digest':
      return isDigest(value);
    case 'digest-array':
      return isTokenArray(value, isDigest, true);
    case 'identifier':
    case 'reference':
    case 'version':
      return isSystemToken(value);
    case 'identifier-array':
    case 'reference-array':
      return isTokenArray(value, isSystemToken);
    case 'latency-observation':
      return isLatencyObservation(value);
    case 'nonempty-code-array':
      return isTokenArray(value, isCodeToken, true);
    case 'nonempty-identifier-array':
    case 'nonempty-reference-array':
      return isTokenArray(value, isSystemToken, true);
    case 'nullable-identifier':
      return value === null || isSystemToken(value);
    case 'prose':
      return isProse(value);
    case 'ratio':
      return isRatio(value);
    case 'score-observation':
      return isScoreObservation(value);
    case 'task-lineage':
      return isTaskLineage(value);
    case 'timestamp':
      return isTimestamp(value);
    case 'trial-matrix-key':
      return isTrialMatrixKey(value);
    case 'uint32':
      return isUint32(value);
    case 'usage-observation':
      return isUsageObservation(value);
  }
}

function hasValidDataFields(
  rules: Readonly<Record<string, DataFieldRule>>,
  value: Record<string, unknown>,
): value is JsonObject {
  return Object.entries(rules).every(([field, rule]) => (
    isFieldValue(rule, value[field])
  ));
}

function matrixKeyMatchesScope(
  scope: Readonly<JsonObject>,
  key: Readonly<JsonObject>,
): boolean {
  return key.candidateId === scope.candidateId
    && key.modelFingerprint === scope.modelFingerprint
    && key.executionPath === scope.executionPath
    && key.taskInstanceId === scope.taskInstanceId
    && key.taskFamilyId === scope.taskFamilyId
    && key.pairedBlockId === scope.pairedBlockId;
}

function hasValidCrossFieldSemantics(
  stem: ModelBenchmarkSpecificEventStem,
  scope: Readonly<JsonObject>,
  data: Readonly<JsonObject>,
): boolean {
  if (isObject(data.trialMatrixKey)
    && !matrixKeyMatchesScope(scope, data.trialMatrixKey)) return false;
  if (stem === 'model_benchmark.case_replaced') {
    return data.replacementCaseId !== scope.caseId;
  }
  if (stem === 'model_benchmark.validity_card_derived') {
    if (data.state === 'valid') {
      return Array.isArray(data.blockerCodes) && data.blockerCodes.length === 0;
    }
    if (data.state === 'invalid') {
      return Array.isArray(data.blockerCodes) && data.blockerCodes.length > 0;
    }
  }
  return true;
}

function isData(
  stem: ModelBenchmarkSpecificEventStem,
  scope: Readonly<JsonObject>,
  value: unknown,
): boolean {
  if (!isObject(value) || hasForbiddenMutableField(value)) return false;
  const rules = DATA_FIELD_RULES[stem];
  if (!hasExactFields(value, Object.keys(rules))) return false;
  if (!hasValidDataFields(rules, value)) return false;
  return hasValidCrossFieldSemantics(stem, scope, value);
}

function digestSpecificPayloadInput(
  stem: ModelBenchmarkSpecificEventStem,
  scope: JsonObject,
  prevEventHash: string,
  replay: JsonObject,
  data: JsonObject,
): string {
  return sha256Bytes(canonicalBytes({
    stem,
    eventVersion: MODEL_BENCHMARK_EVENT_VERSION,
    scope,
    prevEventHash,
    replay,
    data,
  }));
}

function isSpecificPayload(
  stem: ModelBenchmarkSpecificEventStem,
  payload: Readonly<JsonObject>,
): boolean {
  if (!isModelBenchmarkSpecificEventStem(payload.stem)
    || payload.stem !== stem
    || payload.eventVersion !== MODEL_BENCHMARK_EVENT_VERSION) return false;
  if (!isScope(stem, payload.scope)
    || !isDigest(payload.prevEventHash)
    || !isReplayMetadata(payload.replay)) return false;
  if (!isData(
    stem,
    payload.scope as JsonObject,
    payload.data,
  )) return false;
  return payload.payloadDigest === digestSpecificPayloadInput(
    stem,
    payload.scope as JsonObject,
    payload.prevEventHash as string,
    payload.replay as JsonObject,
    payload.data as JsonObject,
  );
}

function requireModelBenchmarkCommonScope(
  scope: Readonly<JsonObject>,
): void {
  if (scope.variant !== 'model-benchmark') {
    throw new TypeError('Common event scope must be specialized to model-benchmark');
  }
}

function requireTypedScoringPrerequisite(
  input: ModelBenchmarkEventInput<ModelBenchmarkEventStem>,
  registry: EventTypeRegistry,
): void {
  if (input.stem !== 'deep_improvement_common.promotion_proposed') return;
  const prerequisite = input.prerequisiteEvent;
  const data = input.data as JsonObject;
  if (!prerequisite
    || prerequisite.registryDigest !== registry.digest
    || prerequisite.envelope.event_type
      !== ModelBenchmarkWireEventTypes[
        'deep_improvement_common.evaluation_normalized'
      ]
    || prerequisite.envelope.payload.stem
      !== 'deep_improvement_common.evaluation_normalized'
    || prerequisite.envelope.event_id !== data.normalizedEventId
    || prerequisite.envelope.payload.payloadDigest
      !== data.normalizedPayloadDigest) {
    throw new TypeError(
      'Promotion proposal requires a registry-validated normalized scoring event',
    );
  }
}

// ───────────────────────────────────────────────────────────────────
// 4. REGISTRY AND EVENT PREPARATION
// ───────────────────────────────────────────────────────────────────

function specificEventDefinition(
  stem: ModelBenchmarkSpecificEventStem,
): EventTypeDefinition {
  return {
    eventType: ModelBenchmarkSpecificWireEventTypes[stem],
    currentVersion: MODEL_BENCHMARK_EVENT_VERSION,
    versions: [{
      version: MODEL_BENCHMARK_EVENT_VERSION,
      payload: {
        requiredFields: MODEL_BENCHMARK_MODE_PAYLOAD_FIELDS,
        validate: (payload) => isSpecificPayload(stem, payload),
      },
    }],
    upcasters: [],
  };
}

function modelBenchmarkCommonEventDefinition(
  definition: EventTypeDefinition,
): EventTypeDefinition {
  return {
    ...definition,
    versions: definition.versions.map((version) => ({
      ...version,
      payload: {
        ...version.payload,
        validate: (payload) => {
          if (!isObject(payload.scope)) return false;
          requireModelBenchmarkCommonScope(payload.scope);
          return version.payload.validate(payload);
        },
      },
    })),
  };
}

export function modelBenchmarkEventDefinitions():
readonly EventTypeDefinition[] {
  return Object.freeze([
    ...deepImprovementCommonEventDefinitions().map(
      modelBenchmarkCommonEventDefinition,
    ),
    ...ModelBenchmarkSpecificEventStems.map(specificEventDefinition),
  ]);
}

export function createModelBenchmarkEventRegistry(): EventTypeRegistry {
  return new EventTypeRegistry(modelBenchmarkEventDefinitions());
}

export function createModelBenchmarkLedgerPayload<
  TStem extends ModelBenchmarkEventStem,
>(
  stem: TStem,
  scope: ModelBenchmarkScopeMap[TStem],
  prevEventHash: string,
  replay: ModelBenchmarkReplayMetadata,
  data: ModelBenchmarkPayloadMap[TStem],
): ModelBenchmarkLedgerPayload<TStem> {
  if (isDeepImprovementCommonEventStem(stem)) {
    requireModelBenchmarkCommonScope(scope);
    // The runtime stem guard guarantees common-stem values; TypeScript cannot narrow the generic from a value guard.
    return createDeepImprovementCommonLedgerPayload(
      stem,
      scope as unknown as DeepImprovementCommonScopeMap[typeof stem],
      prevEventHash,
      replay as DeepImprovementCommonReplayMetadata,
      data as unknown as DeepImprovementCommonPayloadMap[typeof stem],
    ) as unknown as ModelBenchmarkLedgerPayload<TStem>;
  }
  const specificStem = stem as ModelBenchmarkSpecificEventStem;
  const payloadDigest = digestSpecificPayloadInput(
    specificStem,
    scope,
    prevEventHash,
    replay,
    data,
  );
  return Object.freeze({
    stem,
    eventVersion: MODEL_BENCHMARK_EVENT_VERSION,
    scope,
    prevEventHash,
    payloadDigest,
    replay,
    data,
  }) as ModelBenchmarkLedgerPayload<TStem>;
}

export function prepareModelBenchmarkEvent<
  TStem extends ModelBenchmarkEventStem,
>(
  input: ModelBenchmarkEventInput<TStem>,
  registry: EventTypeRegistry,
): EventWritePreflight {
  requireTypedScoringPrerequisite(
    input as ModelBenchmarkEventInput<ModelBenchmarkEventStem>,
    registry,
  );
  const payload = createModelBenchmarkLedgerPayload(
    input.stem,
    input.scope,
    input.prevEventHash,
    input.replay,
    input.data,
  );
  const envelope: ModelBenchmarkEventEnvelope<TStem> = {
    envelope_version: CURRENT_ENVELOPE_VERSION,
    event_id: input.eventId,
    event_type: ModelBenchmarkWireEventTypes[input.stem],
    event_version: MODEL_BENCHMARK_EVENT_VERSION,
    stream_id: input.streamId,
    stream_sequence: input.streamSequence,
    occurred_at: input.occurredAt,
    recorded_at: input.recordedAt,
    producer: input.producer,
    authority_epoch: input.authorityEpoch,
    correlation_id: input.correlationId,
    causation_id: input.causationId,
    idempotency_key: input.idempotencyKey,
    payload,
  };
  return prepareEventWrite(envelope, registry);
}

export function modelBenchmarkPayloadDigest<
  TStem extends ModelBenchmarkEventStem,
>(
  payload: Readonly<{
    stem: TStem;
    eventVersion: 1;
    scope: ModelBenchmarkScopeMap[TStem];
    prevEventHash: string;
    replay: ModelBenchmarkReplayMetadata;
    data: ModelBenchmarkPayloadMap[TStem];
  }>,
): string {
  if (isDeepImprovementCommonEventStem(payload.stem)) {
    requireModelBenchmarkCommonScope(payload.scope);
    // The runtime stem guard guarantees a common-stem digest input; TypeScript cannot narrow the generic from a value guard.
    return deepImprovementCommonPayloadDigest(
      payload as unknown as Parameters<
        typeof deepImprovementCommonPayloadDigest
      >[0],
    );
  }
  return digestSpecificPayloadInput(
    payload.stem as ModelBenchmarkSpecificEventStem,
    payload.scope,
    payload.prevEventHash,
    payload.replay,
    payload.data,
  );
}

export function isModelBenchmarkSpecificEventStem(
  value: JsonValue,
): value is ModelBenchmarkSpecificEventStem {
  return typeof value === 'string'
    && (ModelBenchmarkSpecificEventStems as readonly string[]).includes(value);
}

export function isModelBenchmarkEventStem(
  value: JsonValue,
): value is ModelBenchmarkEventStem {
  return typeof value === 'string'
    && (ModelBenchmarkEventStems as readonly string[]).includes(value);
}

export type ModelBenchmarkCommonLedgerPayload<
  TStem extends DeepImprovementCommonEventStem,
> = DeepImprovementCommonLedgerPayload<TStem>;

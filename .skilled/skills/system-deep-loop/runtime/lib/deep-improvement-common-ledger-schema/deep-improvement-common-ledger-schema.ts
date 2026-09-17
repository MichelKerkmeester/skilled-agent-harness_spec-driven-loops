// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Improvement Common Ledger Schema
// ───────────────────────────────────────────────────────────────────

import {
  CURRENT_ENVELOPE_VERSION,
  EVENT_ENVELOPE_FIELDS,
  EventTypeRegistry,
  canonicalBytes,
  prepareEventWrite,
  sha256Bytes,
} from '../event-envelope/index.js';
import {
  DeepImprovementCommonEventStems,
  DeepImprovementCommonWireEventTypes,
} from './deep-improvement-common-ledger-types.js';

import type {
  EventProducer,
  EventTypeDefinition,
  EventWritePreflight,
  JsonObject,
  JsonValue,
} from '../event-envelope/index.js';
import type {
  DeepImprovementCommonEventEnvelope,
  DeepImprovementCommonEventStem,
  DeepImprovementCommonLedgerPayload,
  DeepImprovementCommonPayloadMap,
  DeepImprovementCommonReplayMetadata,
  DeepImprovementCommonScopeMap,
} from './deep-improvement-common-ledger-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. PUBLIC INPUTS
// ───────────────────────────────────────────────────────────────────

export interface DeepImprovementCommonEventInput<
  TStem extends DeepImprovementCommonEventStem,
> {
  readonly stem: TStem;
  readonly scope: DeepImprovementCommonScopeMap[TStem];
  readonly prevEventHash: string;
  readonly replay: DeepImprovementCommonReplayMetadata;
  readonly data: DeepImprovementCommonPayloadMap[TStem];
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
}

// ───────────────────────────────────────────────────────────────────
// 2. CONTRACT TABLES
// ───────────────────────────────────────────────────────────────────

export const DEEP_IMPROVEMENT_COMMON_EVENT_VERSION = 1 as const;

export const DEEP_IMPROVEMENT_COMMON_SCORE_WRITE_BACKEND_REF =
  'backend:deep-improvement-score' as const;

export const DEEP_IMPROVEMENT_COMMON_SHARED_ENVELOPE_FIELDS = Object.freeze([
  ...EVENT_ENVELOPE_FIELDS,
] as const);

export const DEEP_IMPROVEMENT_COMMON_MODE_PAYLOAD_FIELDS = Object.freeze([
  'stem',
  'eventVersion',
  'scope',
  'prevEventHash',
  'payloadDigest',
  'replay',
  'data',
] as const);

type DataFieldKind =
  | 'boolean'
  | 'code'
  | 'code-array'
  | 'completion-counts'
  | 'digest'
  | 'identifier'
  | 'identifier-array'
  | 'nonempty-code-array'
  | 'nonempty-identifier-array'
  | 'nonempty-reference-array'
  | 'nullable-identifier'
  | 'prose'
  | 'ratio'
  | 'reference'
  | 'reference-array'
  | 'score-vector'
  | 'timestamp'
  | 'transition-authorization-reference'
  | 'uint32'
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
  'deep_improvement_common.run_started': {
    generation: 'uint32',
    charterDigest: 'digest',
    configDigest: 'digest',
    operatorRef: 'reference',
    serviceContractVersion: 'version',
    replayFingerprint: 'digest',
    maxIterations: 'uint32',
  },
  'deep_improvement_common.run_resumed': {
    priorTailDigest: 'digest',
    sourceLineageId: 'identifier',
    resumeReason: 'prose',
    generation: 'uint32',
    compatibilityDecision: COMPATIBILITY_DECISION_RULE,
    recoveryReceiptRef: 'reference',
  },
  'deep_improvement_common.run_paused': {
    pauseReason: 'prose',
    checkpointRef: 'reference',
    checkpointDigest: 'digest',
    pendingCandidateIds: 'identifier-array',
    pausedAt: 'timestamp',
  },
  'deep_improvement_common.run_completed': {
    terminalOutcome: enumRule('aborted', 'completed', 'quarantined'),
    stopReason: enumRule(
      'blockedStop',
      'converged',
      'error',
      'manualStop',
      'maxIterationsReached',
      'stuckRecovery',
    ),
    sessionOutcome: enumRule(
      'advisoryOnly',
      'keptBaseline',
      'promoted',
      'rolledBack',
    ),
    finalLedgerTailHash: 'digest',
    counts: 'completion-counts',
    completionEvidenceRefs: 'reference-array',
  },
  'deep_improvement_common.run_aborted': {
    abortReason: 'prose',
    lastSafeEventId: 'identifier',
    evidenceRefs: 'reference-array',
    retryable: 'boolean',
  },
  'deep_improvement_common.run_quarantined': {
    quarantineReasonCode: 'code',
    quarantineEvidenceRef: 'reference',
    quarantineEvidenceDigest: 'digest',
    affectedCandidateIds: 'nonempty-identifier-array',
    policyVersion: 'version',
  },
  'deep_improvement_common.candidate_proposed': {
    proposalRef: 'reference',
    proposalDigest: 'digest',
    mutationOperatorRef: 'reference',
    mutationOperatorVersion: 'version',
    parentCandidateId: 'nullable-identifier',
    targetRef: 'reference',
    targetDigest: 'digest',
    proposalPolicyVersion: 'version',
  },
  'deep_improvement_common.candidate_generated': {
    proposalEventId: 'identifier',
    proposalPayloadDigest: 'digest',
    candidateArtifactRef: 'reference',
    candidateArtifactDigest: 'digest',
    generationReceiptRef: 'reference',
    mutationOperatorRef: 'reference',
    mutationOperatorVersion: 'version',
  },
  'deep_improvement_common.candidate_rejected': {
    candidateEventId: 'identifier',
    candidatePayloadDigest: 'digest',
    rejectionReasonCode: 'code',
    evidenceRefs: 'nonempty-reference-array',
    evidenceSetDigest: 'digest',
    policyVersion: 'version',
  },
  'deep_improvement_common.candidate_lineage_attached': {
    parentCandidateId: 'identifier',
    parentCandidateDigest: 'digest',
    lineageEdgeRef: 'reference',
    lineageEdgeDigest: 'digest',
    operatorRef: 'reference',
  },
  'deep_improvement_common.evaluation_epoch_sealed': {
    evaluatorRef: 'reference',
    evaluatorCapsuleDigest: 'digest',
    fixtureSetRef: 'reference',
    fixtureSetDigest: 'digest',
    scorePolicyVersion: 'version',
    scoreWriteBackendRef: SCORE_WRITE_BACKEND_RULE,
    evaluationBudgetRef: 'reference',
  },
  'deep_improvement_common.evaluation_started': {
    epochSealedEventId: 'identifier',
    epochPayloadDigest: 'digest',
    executionReceiptRef: 'reference',
    fixtureCount: 'uint32',
    evaluatorFingerprint: 'digest',
  },
  'deep_improvement_common.evaluation_observation_recorded': {
    evaluationStartedEventId: 'identifier',
    evaluatorRef: 'reference',
    fixtureRef: 'reference',
    rawObservationRef: 'reference',
    rawObservationDigest: 'digest',
    executionReceiptRef: 'reference',
    observationOutcome: enumRule('error', 'fail', 'pass', 'timeout'),
  },
  'deep_improvement_common.evaluation_normalized': {
    observationEventIds: 'nonempty-identifier-array',
    observationSetDigest: 'digest',
    scorePolicyVersion: 'version',
    scorerFingerprint: 'digest',
    scoreWriteBackendRef: SCORE_WRITE_BACKEND_RULE,
    scoreVector: 'score-vector',
    normalizationReceiptRef: 'reference',
  },
  'deep_improvement_common.evaluation_verification_requested': {
    normalizedEventId: 'identifier',
    normalizedPayloadDigest: 'digest',
    verificationPolicyVersion: 'version',
    verifierRef: 'reference',
    reasonCode: 'code',
  },
  'deep_improvement_common.evaluation_verification_recorded': {
    requestEventId: 'identifier',
    verifierRef: 'reference',
    verificationOutcome: enumRule('confirmed', 'disputed', 'inconclusive'),
    verificationEvidenceRef: 'reference',
    verificationEvidenceDigest: 'digest',
    verificationReceiptRef: 'reference',
  },
  'deep_improvement_common.evaluation_inconclusive': {
    relatedEventIds: 'nonempty-identifier-array',
    reasonCode: 'code',
    uncertainty: 'ratio',
    evidenceRefs: 'reference-array',
    evidenceSetDigest: 'digest',
  },
  'deep_improvement_common.evaluation_failed': {
    failedEventId: 'identifier',
    failureStage: enumRule('execution', 'fixture-load', 'normalization', 'verification'),
    reasonCode: 'code',
    failureReceiptRef: 'reference',
    retryable: 'boolean',
  },
  'deep_improvement_common.canary_suite_sealed': {
    suiteRef: 'reference',
    suiteDigest: 'digest',
    canaryPolicyVersion: 'version',
    fixtureCount: 'uint32',
    protectedMaterialRef: 'reference',
    protectedMaterialDigest: 'digest',
  },
  'deep_improvement_common.canary_executed': {
    suiteSealedEventId: 'identifier',
    suitePayloadDigest: 'digest',
    executionReceiptRef: 'reference',
    canaryObservationRef: 'reference',
    canaryObservationDigest: 'digest',
    outcome: enumRule('fail', 'inconclusive', 'pass'),
  },
  'deep_improvement_common.canary_leak_detected': {
    executionEventId: 'identifier',
    leakClass: enumRule('candidate-contamination', 'fixture-exposure', 'gold-exposure'),
    leakEvidenceRef: 'reference',
    leakEvidenceDigest: 'digest',
    detectorFingerprint: 'digest',
    reasonCode: 'code',
  },
  'deep_improvement_common.canary_drift_detected': {
    executionEventId: 'identifier',
    baselineRef: 'reference',
    baselineDigest: 'digest',
    driftEvidenceRef: 'reference',
    driftEvidenceDigest: 'digest',
    driftRatio: 'ratio',
    policyVersion: 'version',
  },
  'deep_improvement_common.canary_invariant_failed': {
    executionEventId: 'identifier',
    invariantCode: 'code',
    invariantVersion: 'version',
    evidenceRef: 'reference',
    evidenceDigest: 'digest',
    reasonCode: 'code',
  },
  'deep_improvement_common.canary_gate_passed': {
    executionEventIds: 'nonempty-identifier-array',
    evidenceSetDigest: 'digest',
    policyVersion: 'version',
    policyFingerprint: 'digest',
    decisionReceiptRef: 'reference',
  },
  'deep_improvement_common.canary_gate_failed': {
    executionEventIds: 'nonempty-identifier-array',
    failureClasses: 'nonempty-code-array',
    evidenceSetDigest: 'digest',
    policyVersion: 'version',
    policyFingerprint: 'digest',
    decisionReceiptRef: 'reference',
  },
  'deep_improvement_common.canary_vetoed': {
    gateEventId: 'identifier',
    gatePayloadDigest: 'digest',
    vetoReasonCode: 'code',
    vetoEvidenceRef: 'reference',
    vetoEvidenceDigest: 'digest',
    quarantineRef: 'reference',
  },
  'deep_improvement_common.promotion_proposed': {
    normalizedEventId: 'identifier',
    normalizedPayloadDigest: 'digest',
    canaryGateEventId: 'identifier',
    canaryGatePayloadDigest: 'digest',
    proposalPolicyVersion: 'version',
    requestedRollout: enumRule('canary', 'shadow'),
    evidenceSetDigest: 'digest',
  },
  'deep_improvement_common.promotion_authorized': {
    proposalEventId: 'identifier',
    proposalPayloadDigest: 'digest',
    externalAuthorizationRef: 'transition-authorization-reference',
    externalAuthorizationDigest: 'digest',
    authorizationPolicyVersion: 'version',
    authorizationReceiptRef: 'reference',
  },
  'deep_improvement_common.promotion_denied': {
    proposalEventId: 'identifier',
    proposalPayloadDigest: 'digest',
    externalDecisionRef: 'transition-authorization-reference',
    externalDecisionDigest: 'digest',
    denialReasonCode: 'code',
    decisionReceiptRef: 'reference',
  },
  'deep_improvement_common.promotion_shadow_started': {
    authorizationEventId: 'identifier',
    authorizationPayloadDigest: 'digest',
    rolloutRef: 'reference',
    rolloutDigest: 'digest',
    startedAt: 'timestamp',
  },
  'deep_improvement_common.promotion_canary_started': {
    authorizationEventId: 'identifier',
    authorizationPayloadDigest: 'digest',
    rolloutRef: 'reference',
    rolloutDigest: 'digest',
    startedAt: 'timestamp',
  },
  'deep_improvement_common.promotion_paused': {
    activeRolloutEventId: 'identifier',
    pauseReason: 'prose',
    checkpointRef: 'reference',
    checkpointDigest: 'digest',
  },
  'deep_improvement_common.promotion_aborted': {
    activeRolloutEventId: 'identifier',
    abortReason: 'prose',
    restorationRequired: 'boolean',
    decisionReceiptRef: 'reference',
  },
  'deep_improvement_common.promotion_baseline_restored': {
    abortedEventId: 'identifier',
    baselineRef: 'reference',
    baselineDigest: 'digest',
    restorationReceiptRef: 'reference',
    restoredAt: 'timestamp',
  },
  'deep_improvement_common.promotion_completed': {
    authorizationEventId: 'identifier',
    rolloutEventIds: 'nonempty-identifier-array',
    evidenceSetDigest: 'digest',
    completionReceiptRef: 'reference',
    completedAt: 'timestamp',
  },
} as const satisfies Readonly<
  Record<DeepImprovementCommonEventStem, Readonly<Record<string, DataFieldRule>>>
>);

const BASE_SCOPE_FIELDS = ['runId', 'lineageId', 'variant'] as const;
const CANDIDATE_SCOPE_FIELDS = [...BASE_SCOPE_FIELDS, 'candidateId'] as const;
const EVALUATION_SCOPE_FIELDS = [
  ...CANDIDATE_SCOPE_FIELDS,
  'evaluationEpochId',
] as const;
const OBSERVATION_SCOPE_FIELDS = [
  ...EVALUATION_SCOPE_FIELDS,
  'fixtureId',
  'observationId',
] as const;
const CANARY_SCOPE_FIELDS = [
  ...CANDIDATE_SCOPE_FIELDS,
  'canaryEpochId',
  'canarySuiteId',
] as const;
const PROMOTION_SCOPE_FIELDS = [
  ...CANDIDATE_SCOPE_FIELDS,
  'promotionId',
  'baselineId',
] as const;

const SCOPE_FIELDS = Object.freeze({
  'deep_improvement_common.run_started': BASE_SCOPE_FIELDS,
  'deep_improvement_common.run_resumed': BASE_SCOPE_FIELDS,
  'deep_improvement_common.run_paused': BASE_SCOPE_FIELDS,
  'deep_improvement_common.run_completed': BASE_SCOPE_FIELDS,
  'deep_improvement_common.run_aborted': BASE_SCOPE_FIELDS,
  'deep_improvement_common.run_quarantined': BASE_SCOPE_FIELDS,
  'deep_improvement_common.candidate_proposed': CANDIDATE_SCOPE_FIELDS,
  'deep_improvement_common.candidate_generated': CANDIDATE_SCOPE_FIELDS,
  'deep_improvement_common.candidate_rejected': CANDIDATE_SCOPE_FIELDS,
  'deep_improvement_common.candidate_lineage_attached': CANDIDATE_SCOPE_FIELDS,
  'deep_improvement_common.evaluation_epoch_sealed': EVALUATION_SCOPE_FIELDS,
  'deep_improvement_common.evaluation_started': EVALUATION_SCOPE_FIELDS,
  'deep_improvement_common.evaluation_observation_recorded': OBSERVATION_SCOPE_FIELDS,
  'deep_improvement_common.evaluation_normalized': EVALUATION_SCOPE_FIELDS,
  'deep_improvement_common.evaluation_verification_requested': EVALUATION_SCOPE_FIELDS,
  'deep_improvement_common.evaluation_verification_recorded': EVALUATION_SCOPE_FIELDS,
  'deep_improvement_common.evaluation_inconclusive': EVALUATION_SCOPE_FIELDS,
  'deep_improvement_common.evaluation_failed': EVALUATION_SCOPE_FIELDS,
  'deep_improvement_common.canary_suite_sealed': CANARY_SCOPE_FIELDS,
  'deep_improvement_common.canary_executed': CANARY_SCOPE_FIELDS,
  'deep_improvement_common.canary_leak_detected': CANARY_SCOPE_FIELDS,
  'deep_improvement_common.canary_drift_detected': CANARY_SCOPE_FIELDS,
  'deep_improvement_common.canary_invariant_failed': CANARY_SCOPE_FIELDS,
  'deep_improvement_common.canary_gate_passed': CANARY_SCOPE_FIELDS,
  'deep_improvement_common.canary_gate_failed': CANARY_SCOPE_FIELDS,
  'deep_improvement_common.canary_vetoed': CANARY_SCOPE_FIELDS,
  'deep_improvement_common.promotion_proposed': PROMOTION_SCOPE_FIELDS,
  'deep_improvement_common.promotion_authorized': PROMOTION_SCOPE_FIELDS,
  'deep_improvement_common.promotion_denied': PROMOTION_SCOPE_FIELDS,
  'deep_improvement_common.promotion_shadow_started': PROMOTION_SCOPE_FIELDS,
  'deep_improvement_common.promotion_canary_started': PROMOTION_SCOPE_FIELDS,
  'deep_improvement_common.promotion_paused': PROMOTION_SCOPE_FIELDS,
  'deep_improvement_common.promotion_aborted': PROMOTION_SCOPE_FIELDS,
  'deep_improvement_common.promotion_baseline_restored': PROMOTION_SCOPE_FIELDS,
  'deep_improvement_common.promotion_completed': PROMOTION_SCOPE_FIELDS,
} as const satisfies Readonly<
  Record<DeepImprovementCommonEventStem, readonly string[]>
>);

const HASH_PATTERN = /^[a-f0-9]{64}$/;
const SYSTEM_TOKEN_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:/@-]{0,255}$/;
const CODE_TOKEN_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:/@-]{0,127}$/;
const TRANSITION_AUTHORIZATION_REF_PATTERN =
  /^transition-authorization:[A-Za-z0-9][A-Za-z0-9._:/@-]{0,230}$/;
const MAX_PROSE_LENGTH = 4_096;
const MAX_SCORE_COMPONENTS = 64;
const COMPLETION_COUNT_FIELDS = Object.freeze([
  'candidates',
  'evaluations',
  'observations',
  'canaryRuns',
  'promotions',
] as const);
const SCORE_VECTOR_FIELDS = Object.freeze([
  'components',
  'aggregateScore',
  'uncertainty',
] as const);
const SCORE_COMPONENT_FIELDS = Object.freeze([
  'dimensionCode',
  'rawScore',
  'normalizedScore',
  'weight',
] as const);
const FORBIDDEN_MUTABLE_FIELDS = new Set([
  'body',
  'canaryBody',
  'canaryContents',
  'candidateBody',
  'content',
  'evaluatorFeedback',
  'evidenceBlob',
  'fixtureBody',
  'goldContents',
  'rawBody',
  'rawEvidence',
  'rawObservation',
  'reportBody',
  'sourceText',
  'text',
  'transcript',
]);
const VARIANTS = new Set([
  'agent-improvement',
  'model-benchmark',
  'skill-benchmark',
]);
const RUN_COMPLETION_TERMINAL_FACTS = new Set([
  'aborted:error',
  'aborted:manualStop',
  'completed:converged',
  'completed:maxIterationsReached',
  'quarantined:blockedStop',
  'quarantined:stuckRecovery',
]);

// ───────────────────────────────────────────────────────────────────
// 3. VALIDATION
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

function isTimestamp(value: unknown): value is string {
  return typeof value === 'string'
    && value.length <= 64
    && !Number.isNaN(new Date(value).getTime());
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

function isScoreVector(value: unknown): boolean {
  if (!isObject(value) || !hasExactFields(value, SCORE_VECTOR_FIELDS)) return false;
  if (!Array.isArray(value.components)
    || value.components.length === 0
    || value.components.length > MAX_SCORE_COMPONENTS
    || !isRatio(value.aggregateScore)
    || !isRatio(value.uncertainty)) return false;
  const dimensions = new Set<string>();
  for (const component of value.components) {
    if (!isObject(component)
      || !hasExactFields(component, SCORE_COMPONENT_FIELDS)
      || !isCodeToken(component.dimensionCode)
      || !isRatio(component.rawScore)
      || !isRatio(component.normalizedScore)
      || !isRatio(component.weight)
      || dimensions.has(component.dimensionCode)) return false;
    dimensions.add(component.dimensionCode);
  }
  return true;
}

function isReplayMetadata(value: unknown): boolean {
  if (!isObject(value) || !hasExactFields(
    value,
    ['fingerprint_version', 'final_digest', 'replay_input_digests'],
  )) return false;
  return Number.isSafeInteger(value.fingerprint_version)
    && (value.fingerprint_version as number) > 0
    && HASH_PATTERN.test(String(value.final_digest))
    && isObject(value.replay_input_digests)
    && Object.entries(value.replay_input_digests).every(
      ([key, digest]) => isCodeToken(key)
        && typeof digest === 'string'
        && HASH_PATTERN.test(digest),
    );
}

function isScope(stem: DeepImprovementCommonEventStem, value: unknown): boolean {
  if (!isObject(value)) return false;
  const required = SCOPE_FIELDS[stem];
  if (!hasExactFields(value, required)) return false;
  for (const [field, candidate] of Object.entries(value)) {
    if (field === 'variant') {
      if (!VARIANTS.has(String(candidate))) return false;
    } else if (!isSystemToken(candidate)) return false;
  }
  return true;
}

function isFieldValue(rule: DataFieldRule, value: unknown): boolean {
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
      return typeof value === 'string' && HASH_PATTERN.test(value);
    case 'identifier':
    case 'reference':
    case 'version':
      return isSystemToken(value);
    case 'identifier-array':
    case 'reference-array':
      return isTokenArray(value, isSystemToken);
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
    case 'score-vector':
      return isScoreVector(value);
    case 'timestamp':
      return isTimestamp(value);
    case 'transition-authorization-reference':
      return typeof value === 'string'
        && TRANSITION_AUTHORIZATION_REF_PATTERN.test(value);
    case 'uint32':
      return isUint32(value);
  }
}

function isData(
  stem: DeepImprovementCommonEventStem,
  value: unknown,
): boolean {
  if (!isObject(value) || hasForbiddenMutableField(value)) return false;
  const rules = DATA_FIELD_RULES[stem];
  if (!hasExactFields(value, Object.keys(rules))) return false;
  return Object.entries(rules).every(([field, rule]) => (
    isFieldValue(rule, value[field])
  ));
}

function digestPayloadInput(
  stem: DeepImprovementCommonEventStem,
  scope: JsonObject,
  prevEventHash: string,
  replay: JsonObject,
  data: JsonObject,
): string {
  return sha256Bytes(canonicalBytes({
    stem,
    eventVersion: DEEP_IMPROVEMENT_COMMON_EVENT_VERSION,
    scope,
    prevEventHash,
    replay,
    data,
  }));
}

function hasValidCrossFieldSemantics(
  stem: DeepImprovementCommonEventStem,
  scope: Readonly<JsonObject>,
  data: Readonly<JsonObject>,
): boolean {
  if (stem === 'deep_improvement_common.candidate_proposed') {
    return data.parentCandidateId === null
      || data.parentCandidateId !== scope.candidateId;
  }
  if (stem === 'deep_improvement_common.candidate_lineage_attached') {
    return data.parentCandidateId !== scope.candidateId;
  }
  if (stem === 'deep_improvement_common.run_completed') {
    return RUN_COMPLETION_TERMINAL_FACTS.has(
      `${String(data.terminalOutcome)}:${String(data.stopReason)}`,
    );
  }
  return true;
}

function isPayload(
  stem: DeepImprovementCommonEventStem,
  payload: Readonly<JsonObject>,
): boolean {
  if (!isDeepImprovementCommonEventStem(payload.stem)
    || payload.stem !== stem
    || payload.eventVersion !== DEEP_IMPROVEMENT_COMMON_EVENT_VERSION) return false;
  if (!isScope(stem, payload.scope)
    || !HASH_PATTERN.test(String(payload.prevEventHash))) return false;
  if (!isReplayMetadata(payload.replay) || !isData(stem, payload.data)) return false;
  if (!hasValidCrossFieldSemantics(
    stem,
    payload.scope as JsonObject,
    payload.data as JsonObject,
  )) return false;
  return payload.payloadDigest === digestPayloadInput(
    stem,
    payload.scope as JsonObject,
    payload.prevEventHash as string,
    payload.replay as JsonObject,
    payload.data as JsonObject,
  );
}

// ───────────────────────────────────────────────────────────────────
// 4. REGISTRY AND EVENT PREPARATION
// ───────────────────────────────────────────────────────────────────

function eventDefinition(
  stem: DeepImprovementCommonEventStem,
): EventTypeDefinition {
  return {
    eventType: DeepImprovementCommonWireEventTypes[stem],
    currentVersion: DEEP_IMPROVEMENT_COMMON_EVENT_VERSION,
    versions: [{
      version: DEEP_IMPROVEMENT_COMMON_EVENT_VERSION,
      payload: {
        requiredFields: DEEP_IMPROVEMENT_COMMON_MODE_PAYLOAD_FIELDS,
        validate: (payload) => isPayload(stem, payload),
      },
    }],
    upcasters: [],
  };
}

export function createDeepImprovementCommonEventRegistry(): EventTypeRegistry {
  return new EventTypeRegistry(
    DeepImprovementCommonEventStems.map(eventDefinition),
  );
}

export function createDeepImprovementCommonLedgerPayload<
  TStem extends DeepImprovementCommonEventStem,
>(
  stem: TStem,
  scope: DeepImprovementCommonScopeMap[TStem],
  prevEventHash: string,
  replay: DeepImprovementCommonReplayMetadata,
  data: DeepImprovementCommonPayloadMap[TStem],
): DeepImprovementCommonLedgerPayload<TStem> {
  const payloadDigest = digestPayloadInput(
    stem,
    scope,
    prevEventHash,
    replay,
    data,
  );
  return Object.freeze({
    stem,
    eventVersion: DEEP_IMPROVEMENT_COMMON_EVENT_VERSION,
    scope,
    prevEventHash,
    payloadDigest,
    replay,
    data,
  }) as DeepImprovementCommonLedgerPayload<TStem>;
}

export function prepareDeepImprovementCommonEvent<
  TStem extends DeepImprovementCommonEventStem,
>(
  input: DeepImprovementCommonEventInput<TStem>,
  registry: EventTypeRegistry,
): EventWritePreflight {
  const payload = createDeepImprovementCommonLedgerPayload(
    input.stem,
    input.scope,
    input.prevEventHash,
    input.replay,
    input.data,
  );
  const envelope: DeepImprovementCommonEventEnvelope<TStem> = {
    envelope_version: CURRENT_ENVELOPE_VERSION,
    event_id: input.eventId,
    event_type: DeepImprovementCommonWireEventTypes[input.stem],
    event_version: DEEP_IMPROVEMENT_COMMON_EVENT_VERSION,
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

export function deepImprovementCommonEventDefinitions():
readonly EventTypeDefinition[] {
  return Object.freeze(
    DeepImprovementCommonEventStems.map(eventDefinition),
  );
}

export function deepImprovementCommonPayloadDigest<
  TStem extends DeepImprovementCommonEventStem,
>(
  payload: Readonly<{
    stem: TStem;
    eventVersion: 1;
    scope: DeepImprovementCommonScopeMap[TStem];
    prevEventHash: string;
    replay: DeepImprovementCommonReplayMetadata;
    data: DeepImprovementCommonPayloadMap[TStem];
  }>,
): string {
  return digestPayloadInput(
    payload.stem,
    payload.scope,
    payload.prevEventHash,
    payload.replay,
    payload.data,
  );
}

export function isDeepImprovementCommonEventStem(
  value: JsonValue,
): value is DeepImprovementCommonEventStem {
  return typeof value === 'string'
    && (DeepImprovementCommonEventStems as readonly string[]).includes(value);
}

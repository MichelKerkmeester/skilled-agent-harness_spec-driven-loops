// ───────────────────────────────────────────────────────────────────
// MODULE: Skill Benchmark Ledger Schema
// ───────────────────────────────────────────────────────────────────

import {
  DEEP_IMPROVEMENT_COMMON_SCORE_WRITE_BACKEND_REF,
  createDeepImprovementCommonLedgerPayload,
  deepImprovementCommonEventDefinitions,
  deepImprovementCommonPayloadDigest,
  isDeepImprovementCommonEventStem,
  prepareDeepImprovementCommonEvent,
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
  SkillBenchmarkEventStems,
  SkillBenchmarkSpecificEventStems,
  SkillBenchmarkSpecificWireEventTypes,
  SkillBenchmarkWireEventTypes,
} from './skill-benchmark-ledger-types.js';

import type {
  DeepImprovementCommonEventInput,
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
  SkillBenchmarkEventEnvelope,
  SkillBenchmarkEventStem,
  SkillBenchmarkLedgerPayload,
  SkillBenchmarkPayloadMap,
  SkillBenchmarkReplayMetadata,
  SkillBenchmarkScopeMap,
  SkillBenchmarkSpecificEventStem,
  SkillBenchmarkSpecificPayloadMap,
  SkillBenchmarkSpecificScopeMap,
} from './skill-benchmark-ledger-types.js';

export interface SkillBenchmarkEventInput<
  TStem extends SkillBenchmarkEventStem,
> {
  readonly stem: TStem;
  readonly scope: SkillBenchmarkScopeMap[TStem];
  readonly prevEventHash: string;
  readonly replay: SkillBenchmarkReplayMetadata;
  readonly data: SkillBenchmarkPayloadMap[TStem];
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

export const SKILL_BENCHMARK_EVENT_VERSION = 1 as const;

export const SKILL_BENCHMARK_SCORE_WRITE_BACKEND_REF =
  DEEP_IMPROVEMENT_COMMON_SCORE_WRITE_BACKEND_REF;

export const SKILL_BENCHMARK_SHARED_ENVELOPE_FIELDS = Object.freeze([
  ...EVENT_ENVELOPE_FIELDS,
] as const);

export const SKILL_BENCHMARK_MODE_PAYLOAD_FIELDS = Object.freeze([
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
  | 'digest'
  | 'identifier'
  | 'identifier-array'
  | 'nonempty-code-array'
  | 'nonempty-identifier-array'
  | 'nonempty-raw-score-axes'
  | 'normalized-score-event-ref'
  | 'nullable-code'
  | 'nullable-normalized-score-event-ref'
  | 'ratio'
  | 'reference'
  | 'signed-ratio'
  | 'timestamp'
  | 'uint32'
  | 'validity-domain'
  | 'version';

interface EnumFieldRule {
  readonly kind: 'enum';
  readonly values: readonly string[];
}

type DataFieldRule = DataFieldKind | EnumFieldRule;

function enumRule(...values: readonly string[]): EnumFieldRule {
  return Object.freeze({ kind: 'enum', values: Object.freeze([...values]) });
}

const TREATMENT_ARM_RULE = enumRule(
  'auto-route',
  'compatibility-boundary',
  'component-ablation',
  'control',
  'distractor',
  'forced-activation',
  'no-skill',
  'placebo',
);
const GOLD_POLICY_RULE = enumRule(
  'negative',
  'pending',
  'scored',
  'structural-only',
);
const SCORE_BACKEND_RULE = enumRule(
  SKILL_BENCHMARK_SCORE_WRITE_BACKEND_REF,
);

const DATA_FIELD_RULES = Object.freeze({
  'skill_benchmark.run_planned': {
    designRef: 'reference',
    designDigest: 'digest',
    taskSetRef: 'reference',
    taskSetDigest: 'digest',
    skillBundleRef: 'reference',
    skillBundleDigest: 'digest',
    registryDigest: 'digest',
    executorDescriptorRef: 'reference',
    executorDescriptorDigest: 'digest',
    environmentDigest: 'digest',
    dependencyDigest: 'digest',
    workloadDigest: 'digest',
    randomizationSeed: 'uint32',
    replicateCount: 'uint32',
    designPolicyVersion: 'version',
  },
  'skill_benchmark.treatment_assigned': {
    designEventId: 'identifier',
    designPayloadDigest: 'digest',
    treatmentArm: TREATMENT_ARM_RULE,
    randomizationSeed: 'uint32',
    propensity: 'ratio',
    replicateIndex: 'uint32',
    pairedReplicateId: 'identifier',
    designCellId: 'identifier',
    taskRef: 'reference',
    taskDigest: 'digest',
    skillBundleRef: 'reference',
    skillBundleDigest: 'digest',
    executorDescriptorRef: 'reference',
    executorDescriptorDigest: 'digest',
    environmentDigest: 'digest',
    assignmentReceiptRef: 'reference',
  },
  'skill_benchmark.run_closed': {
    designEventId: 'identifier',
    scenarioTerminalEventIds: 'nonempty-identifier-array',
    terminalStatus: enumRule('aborted', 'closed', 'incomplete'),
    accountingRef: 'reference',
    accountingDigest: 'digest',
    closedAt: 'timestamp',
  },
  'skill_benchmark.scenario_started': {
    assignmentEventId: 'identifier',
    assignmentPayloadDigest: 'digest',
    taskRef: 'reference',
    taskDigest: 'digest',
    environmentRef: 'reference',
    environmentDigest: 'digest',
    executorDescriptorRef: 'reference',
    executorDescriptorDigest: 'digest',
    toolDigest: 'digest',
    permissionDigest: 'digest',
    dependencyDigest: 'digest',
    workloadDigest: 'digest',
    executionReceiptRef: 'reference',
    startedAt: 'timestamp',
  },
  'skill_benchmark.scenario_finished': {
    startedEventId: 'identifier',
    startedPayloadDigest: 'digest',
    outcomeRef: 'reference',
    outcomeDigest: 'digest',
    finalStateDigest: 'digest',
    executionReceiptRef: 'reference',
    terminalOutcome: enumRule('error', 'fail', 'pass', 'timeout'),
    finishedAt: 'timestamp',
  },
  'skill_benchmark.scenario_aborted': {
    startedEventId: 'identifier',
    startedPayloadDigest: 'digest',
    abortReasonCode: 'code',
    evidenceRef: 'reference',
    evidenceDigest: 'digest',
    executionReceiptRef: 'reference',
    retryable: 'boolean',
    abortedAt: 'timestamp',
  },
  'skill_benchmark.skill_discovered': {
    scenarioStartedEventId: 'identifier',
    skillBundleRef: 'reference',
    skillBundleDigest: 'digest',
    registryDigest: 'digest',
    discoveryMethod: enumRule('auto-route', 'forced', 'registry-query'),
    availabilityStatus: enumRule('available', 'missing', 'not-applicable'),
    discoveryEvidenceRef: 'reference',
    discoveryEvidenceDigest: 'digest',
  },
  'skill_benchmark.skill_loaded': {
    discoveredEventId: 'identifier',
    discoveredPayloadDigest: 'digest',
    disclosureStage: enumRule('full', 'instructions', 'metadata', 'resources'),
    skillBundleRef: 'reference',
    skillBundleDigest: 'digest',
    loadedResourceClasses: 'code-array',
    loaderReceiptRef: 'reference',
    loadStatus: enumRule('failed', 'loaded', 'partial'),
  },
  'skill_benchmark.skill_invoked': {
    loadedEventId: 'identifier',
    loadedPayloadDigest: 'digest',
    invocationMode: enumRule('auto', 'explicit', 'forced'),
    activationRef: 'reference',
    activationDigest: 'digest',
    invocationReceiptRef: 'reference',
    invocationStatus: enumRule('failed', 'invoked', 'not-invoked'),
    failureReasonCode: 'nullable-code',
  },
  'skill_benchmark.resource_exposed': {
    skillLoadedEventId: 'identifier',
    resourceRef: 'reference',
    resourceDigest: 'digest',
    resourceClass: enumRule('asset', 'instruction', 'reference', 'script', 'template'),
    exposureStage: enumRule('full', 'instructions', 'metadata', 'resources'),
    canaryRef: 'reference',
    canaryDigest: 'digest',
    exposureReceiptRef: 'reference',
    canaryStatus: enumRule('clean', 'not-applicable', 'triggered'),
  },
  'skill_benchmark.milestone_observed': {
    scenarioStartedEventId: 'identifier',
    milestoneCode: 'code',
    ordinal: 'uint32',
    milestoneState: enumRule('failed', 'reached', 'skipped'),
    observationRef: 'reference',
    observationDigest: 'digest',
    complianceStatus: enumRule('compliant', 'noncompliant', 'unknown'),
  },
  'skill_benchmark.trajectory_recorded': {
    scenarioStartedEventId: 'identifier',
    milestoneEventIds: 'identifier-array',
    orderedKeyPointCodes: 'nonempty-code-array',
    intermediateStateDigest: 'digest',
    traceRef: 'reference',
    traceDigest: 'digest',
    complianceObservationRef: 'reference',
    complianceObservationDigest: 'digest',
  },
  'skill_benchmark.outcome_recorded': {
    scenarioTerminalEventId: 'identifier',
    finalStateRef: 'reference',
    finalStateDigest: 'digest',
    deterministicCheckSetRef: 'reference',
    deterministicCheckSetDigest: 'digest',
    dynamicReferenceSetRef: 'reference',
    dynamicReferenceSetDigest: 'digest',
    constraintCoverageRef: 'reference',
    constraintCoverageDigest: 'digest',
    outcomeStatus: enumRule('error', 'fail', 'inconclusive', 'pass'),
  },
  'skill_benchmark.score_observed': {
    outcomeEventId: 'identifier',
    evaluatorRef: 'reference',
    evaluatorVersion: 'version',
    evaluatorFingerprint: 'digest',
    deterministicResultsRef: 'reference',
    deterministicResultsDigest: 'digest',
    dynamicReferenceResultsRef: 'reference',
    dynamicReferenceResultsDigest: 'digest',
    rawScoreAxes: 'nonempty-raw-score-axes',
    constraintCoverageRef: 'reference',
    constraintCoverageDigest: 'digest',
    tokenCount: 'uint32',
    latencyMs: 'uint32',
    costMicrounits: 'uint32',
    workloadDigest: 'digest',
    goldIntegrityEventId: 'identifier',
    goldIntegrityPayloadDigest: 'digest',
    goldPolicy: GOLD_POLICY_RULE,
    numeratorEligible: 'boolean',
    scoreWriteBackendRef: SCORE_BACKEND_RULE,
  },
  'skill_benchmark.gold_integrity_recorded': {
    goldRef: 'reference',
    goldDigest: 'digest',
    goldPolicy: GOLD_POLICY_RULE,
    provenanceRef: 'reference',
    provenanceDigest: 'digest',
    coverageRatio: 'ratio',
    integrityStatus: enumRule('accepted', 'blocked', 'pending'),
    reasonCode: 'code',
    evaluatorRef: 'reference',
    evaluatorFingerprint: 'digest',
  },
  'skill_benchmark.compatibility_observed': {
    scenarioStartedEventId: 'identifier',
    taskDigest: 'digest',
    skillBundleDigest: 'digest',
    registryDigest: 'digest',
    executorDigest: 'digest',
    toolDigest: 'digest',
    permissionDigest: 'digest',
    environmentDigest: 'digest',
    dependencyDigest: 'digest',
    workloadDigest: 'digest',
    compatibilityStatus: enumRule('compatible', 'incompatible', 'unknown'),
    evidenceRef: 'reference',
    evidenceDigest: 'digest',
  },
  'skill_benchmark.negative_transfer_observed': {
    baselineAssignmentEventId: 'identifier',
    treatedAssignmentEventId: 'identifier',
    baselineOutcomeEventId: 'identifier',
    treatedOutcomeEventId: 'identifier',
    axisCode: 'code',
    rawDelta: 'signed-ratio',
    transferStatus: enumRule(
      'inconclusive',
      'negative-transfer',
      'no-negative-transfer',
    ),
    evidenceRef: 'reference',
    evidenceDigest: 'digest',
  },
  'skill_benchmark.security_probe_recorded': {
    scenarioStartedEventId: 'identifier',
    probeRef: 'reference',
    probeDigest: 'digest',
    compositionPathDigest: 'digest',
    probeOutcome: enumRule('fail', 'inconclusive', 'pass'),
    evidenceRef: 'reference',
    evidenceDigest: 'digest',
    refusalObserved: 'boolean',
    policyVersion: 'version',
  },
  'skill_benchmark.effect_certificate_issued': {
    normalizedScoreEventRef: 'normalized-score-event-ref',
    normalizedScorePayloadDigest: 'digest',
    goldIntegrityEventId: 'identifier',
    evidenceEventIds: 'nonempty-identifier-array',
    evidenceSetDigest: 'digest',
    validityDomain: 'validity-domain',
    confidenceIntervalRef: 'reference',
    confidenceIntervalDigest: 'digest',
    componentAblationEventIds: 'identifier-array',
    compatibilityEventIds: 'identifier-array',
    issueReceiptRef: 'reference',
    issuedAt: 'timestamp',
    expiresAt: 'timestamp',
  },
  'skill_benchmark.effect_certificate_withheld': {
    normalizedScoreEventRef: 'nullable-normalized-score-event-ref',
    evidenceEventIds: 'nonempty-identifier-array',
    evidenceSetDigest: 'digest',
    validityDomain: 'validity-domain',
    withholdingReasonCode: 'code',
    decisionReceiptRef: 'reference',
    withheldAt: 'timestamp',
  },
  'skill_benchmark.effect_certificate_expired': {
    issuedEventId: 'identifier',
    issuedPayloadDigest: 'digest',
    expiryTrigger: enumRule(
      'bundle-drift',
      'dependency-drift',
      'environment-drift',
      'evaluator-drift',
      'registry-drift',
      'time-limit',
      'workload-drift',
    ),
    triggerEvidenceRef: 'reference',
    triggerEvidenceDigest: 'digest',
    expiredAt: 'timestamp',
  },
} as const satisfies Readonly<
  Record<
    SkillBenchmarkSpecificEventStem,
    Readonly<Record<string, DataFieldRule>>
  >
>);

const BASE_SCOPE_FIELDS = ['runId', 'lineageId', 'variant'] as const;
const DESIGN_SCOPE_FIELDS = [...BASE_SCOPE_FIELDS, 'benchmarkDesignId'] as const;
const TREATMENT_SCOPE_FIELDS = [
  ...DESIGN_SCOPE_FIELDS,
  'scenarioId',
  'assignmentId',
] as const;
const SCENARIO_SCOPE_FIELDS = [
  ...TREATMENT_SCOPE_FIELDS,
  'executionId',
] as const;
const SKILL_SCOPE_FIELDS = [
  ...SCENARIO_SCOPE_FIELDS,
  'skillBundleId',
] as const;
const RESOURCE_SCOPE_FIELDS = [...SKILL_SCOPE_FIELDS, 'resourceId'] as const;
const MILESTONE_SCOPE_FIELDS = [
  ...SCENARIO_SCOPE_FIELDS,
  'milestoneId',
] as const;
const OBSERVATION_SCOPE_FIELDS = [
  ...SCENARIO_SCOPE_FIELDS,
  'observationId',
] as const;
const CERTIFICATE_SCOPE_FIELDS = [
  ...BASE_SCOPE_FIELDS,
  'certificateId',
] as const;

const SCOPE_FIELDS = Object.freeze({
  'skill_benchmark.run_planned': DESIGN_SCOPE_FIELDS,
  'skill_benchmark.treatment_assigned': TREATMENT_SCOPE_FIELDS,
  'skill_benchmark.run_closed': DESIGN_SCOPE_FIELDS,
  'skill_benchmark.scenario_started': SCENARIO_SCOPE_FIELDS,
  'skill_benchmark.scenario_finished': SCENARIO_SCOPE_FIELDS,
  'skill_benchmark.scenario_aborted': SCENARIO_SCOPE_FIELDS,
  'skill_benchmark.skill_discovered': SKILL_SCOPE_FIELDS,
  'skill_benchmark.skill_loaded': SKILL_SCOPE_FIELDS,
  'skill_benchmark.skill_invoked': SKILL_SCOPE_FIELDS,
  'skill_benchmark.resource_exposed': RESOURCE_SCOPE_FIELDS,
  'skill_benchmark.milestone_observed': MILESTONE_SCOPE_FIELDS,
  'skill_benchmark.trajectory_recorded': SCENARIO_SCOPE_FIELDS,
  'skill_benchmark.outcome_recorded': OBSERVATION_SCOPE_FIELDS,
  'skill_benchmark.score_observed': OBSERVATION_SCOPE_FIELDS,
  'skill_benchmark.gold_integrity_recorded': OBSERVATION_SCOPE_FIELDS,
  'skill_benchmark.compatibility_observed': OBSERVATION_SCOPE_FIELDS,
  'skill_benchmark.negative_transfer_observed': OBSERVATION_SCOPE_FIELDS,
  'skill_benchmark.security_probe_recorded': OBSERVATION_SCOPE_FIELDS,
  'skill_benchmark.effect_certificate_issued': CERTIFICATE_SCOPE_FIELDS,
  'skill_benchmark.effect_certificate_withheld': CERTIFICATE_SCOPE_FIELDS,
  'skill_benchmark.effect_certificate_expired': CERTIFICATE_SCOPE_FIELDS,
} as const satisfies Readonly<
  Record<SkillBenchmarkSpecificEventStem, readonly string[]>
>);

const HASH_PATTERN = /^[a-f0-9]{64}$/;
const SYSTEM_TOKEN_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:/@-]{0,255}$/;
const CODE_TOKEN_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:/@-]{0,127}$/;
const NORMALIZED_SCORE_EVENT_REF_PATTERN =
  /^event:deep_improvement_common\.evaluation_normalized:[A-Za-z0-9][A-Za-z0-9._:@/-]{0,180}$/;
const RAW_SCORE_AXIS_FIELDS = Object.freeze([
  'dimensionCode',
  'rawScore',
  'measurementRef',
  'measurementDigest',
] as const);
const VALIDITY_DOMAIN_FIELDS = Object.freeze([
  'taskSetDigest',
  'skillBundleDigest',
  'registryDigest',
  'executorDigest',
  'environmentDigest',
  'dependencyDigest',
  'workloadDigest',
  'validityPolicyVersion',
] as const);
const FORBIDDEN_MUTABLE_FIELDS = new Set([
  'body',
  'content',
  'evaluatorFeedback',
  'evidenceBlob',
  'goldContents',
  'output',
  'outputBody',
  'rawBody',
  'rawEvidence',
  'reportBody',
  'sourceText',
  'text',
  'traceBody',
  'transcript',
]);

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && !Array.isArray(value) && typeof value === 'object';
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

function isSignedRatio(value: unknown): value is number {
  return typeof value === 'number'
    && Number.isFinite(value)
    && value >= -1
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

function isRawScoreAxes(value: unknown): boolean {
  if (!Array.isArray(value) || value.length === 0 || value.length > 64) {
    return false;
  }
  const dimensions = new Set<string>();
  return value.every((axis) => {
    if (!isObject(axis)
      || !hasExactFields(axis, RAW_SCORE_AXIS_FIELDS)
      || !isCodeToken(axis.dimensionCode)
      || !isRatio(axis.rawScore)
      || !isSystemToken(axis.measurementRef)
      || !isDigest(axis.measurementDigest)
      || dimensions.has(axis.dimensionCode)) return false;
    dimensions.add(axis.dimensionCode);
    return true;
  });
}

function isValidityDomain(value: unknown): boolean {
  if (!isObject(value) || !hasExactFields(value, VALIDITY_DOMAIN_FIELDS)) {
    return false;
  }
  return VALIDITY_DOMAIN_FIELDS.every((field) => (
    field === 'validityPolicyVersion'
      ? isSystemToken(value[field])
      : isDigest(value[field])
  ));
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

function isSpecificScope(
  stem: SkillBenchmarkSpecificEventStem,
  value: unknown,
): boolean {
  if (!isObject(value) || !hasExactFields(value, SCOPE_FIELDS[stem])) {
    return false;
  }
  return value.variant === 'skill-benchmark'
    && Object.entries(value).every(([field, candidate]) => (
      field === 'variant' || isSystemToken(candidate)
    ));
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
    case 'digest':
      return isDigest(value);
    case 'identifier':
    case 'reference':
    case 'version':
      return isSystemToken(value);
    case 'identifier-array':
      return isTokenArray(value, isSystemToken);
    case 'nonempty-code-array':
      return isTokenArray(value, isCodeToken, true);
    case 'nonempty-identifier-array':
      return isTokenArray(value, isSystemToken, true);
    case 'nonempty-raw-score-axes':
      return isRawScoreAxes(value);
    case 'normalized-score-event-ref':
      return typeof value === 'string'
        && NORMALIZED_SCORE_EVENT_REF_PATTERN.test(value);
    case 'nullable-code':
      return value === null || isCodeToken(value);
    case 'nullable-normalized-score-event-ref':
      return value === null
        || (typeof value === 'string'
          && NORMALIZED_SCORE_EVENT_REF_PATTERN.test(value));
    case 'ratio':
      return isRatio(value);
    case 'signed-ratio':
      return isSignedRatio(value);
    case 'timestamp':
      return isTimestamp(value);
    case 'uint32':
      return isUint32(value);
    case 'validity-domain':
      return isValidityDomain(value);
  }
}

function hasValidCrossFieldSemantics(
  stem: SkillBenchmarkSpecificEventStem,
  data: Readonly<JsonObject>,
): boolean {
  if (stem === 'skill_benchmark.run_planned') {
    return Number(data.replicateCount) > 0;
  }
  if (stem === 'skill_benchmark.treatment_assigned') {
    return Number(data.replicateIndex) > 0;
  }
  if (stem === 'skill_benchmark.milestone_observed') {
    return Number(data.ordinal) > 0;
  }
  if (stem === 'skill_benchmark.skill_invoked') {
    return (data.invocationStatus === 'failed')
      === (data.failureReasonCode !== null);
  }
  if (stem === 'skill_benchmark.gold_integrity_recorded') {
    if (data.goldPolicy === 'pending') {
      return data.integrityStatus === 'pending'
        && data.coverageRatio === 0;
    }
    if (data.goldPolicy === 'structural-only') {
      return data.integrityStatus === 'blocked';
    }
    return data.integrityStatus === 'accepted'
      && Number(data.coverageRatio) > 0;
  }
  if (stem === 'skill_benchmark.score_observed') {
    const eligiblePolicy = data.goldPolicy === 'scored'
      || data.goldPolicy === 'negative';
    return data.numeratorEligible === eligiblePolicy;
  }
  if (stem === 'skill_benchmark.effect_certificate_issued') {
    return new Date(String(data.expiresAt)).getTime()
      > new Date(String(data.issuedAt)).getTime();
  }
  if (stem === 'skill_benchmark.negative_transfer_observed') {
    return data.baselineAssignmentEventId !== data.treatedAssignmentEventId
      && data.baselineOutcomeEventId !== data.treatedOutcomeEventId;
  }
  return true;
}

function isSpecificData(
  stem: SkillBenchmarkSpecificEventStem,
  value: unknown,
): boolean {
  if (!isObject(value) || hasForbiddenMutableField(value)) return false;
  const rules = DATA_FIELD_RULES[stem];
  if (!hasExactFields(value, Object.keys(rules))) return false;
  if (!Object.entries(rules).every(([field, rule]) => (
    isFieldValue(rule, value[field])
  ))) return false;
  return hasValidCrossFieldSemantics(stem, value as JsonObject);
}

function digestSpecificPayloadInput(
  stem: SkillBenchmarkSpecificEventStem,
  scope: JsonObject,
  prevEventHash: string,
  replay: JsonObject,
  data: JsonObject,
): string {
  return sha256Bytes(canonicalBytes({
    stem,
    eventVersion: SKILL_BENCHMARK_EVENT_VERSION,
    scope,
    prevEventHash,
    replay,
    data,
  }));
}

function isSpecificPayload(
  stem: SkillBenchmarkSpecificEventStem,
  payload: Readonly<JsonObject>,
): boolean {
  if (!isSkillBenchmarkSpecificEventStem(payload.stem)
    || payload.stem !== stem
    || payload.eventVersion !== SKILL_BENCHMARK_EVENT_VERSION) return false;
  if (!isSpecificScope(stem, payload.scope)
    || !isDigest(payload.prevEventHash)
    || !isReplayMetadata(payload.replay)
    || !isSpecificData(stem, payload.data)) return false;
  return payload.payloadDigest === digestSpecificPayloadInput(
    stem,
    payload.scope as JsonObject,
    payload.prevEventHash as string,
    payload.replay as JsonObject,
    payload.data as JsonObject,
  );
}

function specificEventDefinition(
  stem: SkillBenchmarkSpecificEventStem,
): EventTypeDefinition {
  return {
    eventType: SkillBenchmarkSpecificWireEventTypes[stem],
    currentVersion: SKILL_BENCHMARK_EVENT_VERSION,
    versions: [{
      version: SKILL_BENCHMARK_EVENT_VERSION,
      payload: {
        requiredFields: SKILL_BENCHMARK_MODE_PAYLOAD_FIELDS,
        validate: (payload) => isSpecificPayload(stem, payload),
      },
    }],
    upcasters: [],
  };
}

function assertSkillBenchmarkVariant(
  scope: unknown,
): asserts scope is Readonly<JsonObject> {
  if (!isObject(scope) || scope.variant !== 'skill-benchmark') {
    throw new TypeError(
      'Skill Benchmark common events require variant skill-benchmark',
    );
  }
}

function narrowCommonEventDefinition(
  definition: EventTypeDefinition,
): EventTypeDefinition {
  return {
    ...definition,
    versions: definition.versions.map((version) => ({
      ...version,
      payload: {
        ...version.payload,
        validate: (payload) => {
          assertSkillBenchmarkVariant(payload.scope);
          return version.payload.validate(payload);
        },
      },
    })),
  };
}

function createSpecificLedgerPayload<
  TStem extends SkillBenchmarkSpecificEventStem,
>(
  stem: TStem,
  scope: SkillBenchmarkSpecificScopeMap[TStem],
  prevEventHash: string,
  replay: SkillBenchmarkReplayMetadata,
  data: SkillBenchmarkSpecificPayloadMap[TStem],
): SkillBenchmarkLedgerPayload<TStem> {
  const payloadDigest = digestSpecificPayloadInput(
    stem,
    scope,
    prevEventHash,
    replay,
    data,
  );
  return Object.freeze({
    stem,
    eventVersion: SKILL_BENCHMARK_EVENT_VERSION,
    scope,
    prevEventHash,
    payloadDigest,
    replay,
    data,
  }) as SkillBenchmarkLedgerPayload<TStem>;
}

function prepareSpecificEvent<
  TStem extends SkillBenchmarkSpecificEventStem,
>(
  input: SkillBenchmarkEventInput<TStem>,
  registry: EventTypeRegistry,
): EventWritePreflight {
  const payload = createSpecificLedgerPayload(
    input.stem,
    input.scope,
    input.prevEventHash,
    input.replay,
    input.data,
  );
  const envelope: SkillBenchmarkEventEnvelope<TStem> = {
    envelope_version: CURRENT_ENVELOPE_VERSION,
    event_id: input.eventId,
    event_type: SkillBenchmarkWireEventTypes[input.stem],
    event_version: SKILL_BENCHMARK_EVENT_VERSION,
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

export function skillBenchmarkEventDefinitions():
readonly EventTypeDefinition[] {
  return Object.freeze([
    ...deepImprovementCommonEventDefinitions().map(
      narrowCommonEventDefinition,
    ),
    ...SkillBenchmarkSpecificEventStems.map(specificEventDefinition),
  ]);
}

export function createSkillBenchmarkEventRegistry(): EventTypeRegistry {
  return new EventTypeRegistry(skillBenchmarkEventDefinitions());
}

export function createSkillBenchmarkLedgerPayload<
  TStem extends SkillBenchmarkEventStem,
>(
  stem: TStem,
  scope: SkillBenchmarkScopeMap[TStem],
  prevEventHash: string,
  replay: SkillBenchmarkReplayMetadata,
  data: SkillBenchmarkPayloadMap[TStem],
): SkillBenchmarkLedgerPayload<TStem> {
  if (isDeepImprovementCommonEventStem(stem)) {
    assertSkillBenchmarkVariant(scope);
    return createDeepImprovementCommonLedgerPayload(
      stem,
      scope as DeepImprovementCommonScopeMap[typeof stem],
      prevEventHash,
      replay as DeepImprovementCommonReplayMetadata,
      data as DeepImprovementCommonPayloadMap[typeof stem],
    ) as SkillBenchmarkLedgerPayload<TStem>;
  }
  return createSpecificLedgerPayload(
    stem as SkillBenchmarkSpecificEventStem,
    scope as SkillBenchmarkSpecificScopeMap[SkillBenchmarkSpecificEventStem],
    prevEventHash,
    replay,
    data as SkillBenchmarkSpecificPayloadMap[SkillBenchmarkSpecificEventStem],
  ) as SkillBenchmarkLedgerPayload<TStem>;
}

export function prepareSkillBenchmarkEvent<
  TStem extends SkillBenchmarkEventStem,
>(
  input: SkillBenchmarkEventInput<TStem>,
  registry: EventTypeRegistry,
): EventWritePreflight {
  if (isDeepImprovementCommonEventStem(input.stem)) {
    assertSkillBenchmarkVariant(input.scope);
    return prepareDeepImprovementCommonEvent(
      input as unknown as DeepImprovementCommonEventInput<
        DeepImprovementCommonEventStem
      >,
      registry,
    );
  }
  return prepareSpecificEvent(
    input as SkillBenchmarkEventInput<SkillBenchmarkSpecificEventStem>,
    registry,
  );
}

export function skillBenchmarkPayloadDigest<
  TStem extends SkillBenchmarkEventStem,
>(
  payload: Readonly<{
    stem: TStem;
    eventVersion: 1;
    scope: SkillBenchmarkScopeMap[TStem];
    prevEventHash: string;
    replay: SkillBenchmarkReplayMetadata;
    data: SkillBenchmarkPayloadMap[TStem];
  }>,
): string {
  if (isDeepImprovementCommonEventStem(payload.stem)) {
    assertSkillBenchmarkVariant(payload.scope);
    return deepImprovementCommonPayloadDigest(
      payload as unknown as DeepImprovementCommonLedgerPayload<
        DeepImprovementCommonEventStem
      >,
    );
  }
  return digestSpecificPayloadInput(
    payload.stem as SkillBenchmarkSpecificEventStem,
    payload.scope as JsonObject,
    payload.prevEventHash,
    payload.replay,
    payload.data as JsonObject,
  );
}

export function isSkillBenchmarkSpecificEventStem(
  value: JsonValue,
): value is SkillBenchmarkSpecificEventStem {
  return typeof value === 'string'
    && (SkillBenchmarkSpecificEventStems as readonly string[]).includes(value);
}

export function isSkillBenchmarkEventStem(
  value: JsonValue,
): value is SkillBenchmarkEventStem {
  return typeof value === 'string'
    && (SkillBenchmarkEventStems as readonly string[]).includes(value);
}

export function skillBenchmarkWireEventType(
  stem: SkillBenchmarkEventStem,
): string {
  return SkillBenchmarkWireEventTypes[stem];
}

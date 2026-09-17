// ───────────────────────────────────────────────────────────────────
// MODULE: Deep AI Council Ledger Schema
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
  DeepAiCouncilEventStems,
  DeepAiCouncilWireEventTypes,
} from './deep-ai-council-ledger-types.js';

import type {
  EventProducer,
  EventTypeDefinition,
  EventWritePreflight,
  JsonObject,
  JsonValue,
} from '../event-envelope/index.js';
import type {
  DeepAiCouncilEventEnvelope,
  DeepAiCouncilEventStem,
  DeepAiCouncilLedgerPayload,
  DeepAiCouncilPayloadMap,
  DeepAiCouncilReplayMetadata,
  DeepAiCouncilScopeMap,
} from './deep-ai-council-ledger-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. PUBLIC INPUTS
// ───────────────────────────────────────────────────────────────────

export interface DeepAiCouncilEventInput<TStem extends DeepAiCouncilEventStem> {
  readonly stem: TStem;
  readonly scope: DeepAiCouncilScopeMap[TStem];
  readonly prevEventHash: string;
  readonly replay: DeepAiCouncilReplayMetadata;
  readonly data: DeepAiCouncilPayloadMap[TStem];
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

export const DEEP_AI_COUNCIL_EVENT_VERSION = 1 as const;

export const DEEP_AI_COUNCIL_SHARED_ENVELOPE_FIELDS = Object.freeze([
  ...EVENT_ENVELOPE_FIELDS,
] as const);

export const DEEP_AI_COUNCIL_MODE_PAYLOAD_FIELDS = Object.freeze([
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
  | 'check-results'
  | 'code'
  | 'code-array'
  | 'completion-counts'
  | 'digest'
  | 'identifier'
  | 'identifier-array'
  | 'independence'
  | 'information-surface'
  | 'null'
  | 'nullable-identifier'
  | 'nullable-prose'
  | 'pairwise-vector'
  | 'path'
  | 'prose'
  | 'ratio'
  | 'raw-score-vector'
  | 'section-results'
  | 'seat-metric'
  | 'seat-counts'
  | 'source-event-range'
  | 'target-reference'
  | 'uint32'
  | 'usage-receipt'
  | 'version';

interface EnumFieldRule {
  readonly kind: 'enum';
  readonly values: readonly string[];
}

type DataFieldRule = DataFieldKind | EnumFieldRule;

const enumRule = <TValues extends readonly string[]>(...values: TValues): EnumFieldRule => ({
  kind: 'enum',
  values,
});

const COMPATIBILITY_RULE = enumRule(
  'blocked', 'compatible', 'exact', 'migrate', 'pin-old-runtime',
);
const RESPONSE_STATUS_RULE = enumRule('failed', 'partial', 'returned', 'timeout');
const STANCE_RULE = enumRule('abstain', 'oppose', 'support', 'uncertain');
const CONVERGENCE_RULE = enumRule(
  'blocked', 'continue', 'converged', 'incomplete', 'non-converged',
);

const DATA_FIELD_RULES = Object.freeze({
  'ai_council.run_initialized': {
    target: 'target-reference',
    targetDigest: 'digest',
    taskClass: 'code',
    configDigest: 'digest',
    strategyDigest: 'digest',
    convergencePolicyDigest: 'digest',
    testGatePolicyDigest: 'digest',
    maxRounds: 'uint32',
    minSeatCount: 'uint32',
    maxSeatCount: 'uint32',
    planningOnly: enumRule('true'),
    initialReplayFingerprint: 'digest',
  },
  'ai_council.run_resumed': {
    priorTailDigest: 'digest',
    sourceRunId: 'identifier',
    resumeReason: 'prose',
    generation: 'uint32',
    compatibilityDecision: COMPATIBILITY_RULE,
    recoveryReceiptRef: 'identifier',
    continuationScopeRef: 'identifier',
  },
  'ai_council.run_restarted': {
    priorTailDigest: 'digest',
    archivedLineageRef: 'identifier',
    restartReason: 'prose',
    generation: 'uint32',
    compatibilityDecision: COMPATIBILITY_RULE,
    recoveryReceiptRef: 'identifier',
    continuationScopeRef: 'identifier',
  },
  'ai_council.round_started': {
    roundNumber: 'uint32',
    executorBoundaryRef: 'identifier',
    seatRosterDigest: 'digest',
    protocolVersion: 'version',
    promptPackDigest: 'digest',
    budgetRef: 'identifier',
    priorRoundRef: 'nullable-identifier',
    exposurePolicyVersion: 'version',
    informationSurface: 'information-surface',
  },
  'ai_council.seat_selected': {
    strategyLens: 'code',
    mandateDigest: 'digest',
    vantageFingerprint: 'digest',
    modelFingerprint: 'digest',
    independenceGroup: 'identifier',
    capabilityDigest: 'digest',
    promptDigest: 'digest',
    selectionUtility: 'ratio',
    selectionPolicyVersion: 'version',
  },
  'ai_council.seat_dispatched': {
    dispatchReceiptRef: 'identifier',
    logicalBranchRef: 'identifier',
    attempt: 'uint32',
    budgetLeaseRef: 'identifier',
    capabilityDigest: 'digest',
    promptDigest: 'digest',
    informationSurface: 'information-surface',
  },
  'ai_council.proposal_observed': {
    targetVersion: 'version',
    responseStatus: RESPONSE_STATUS_RULE,
    proposalDigest: 'digest',
    artifactRef: 'identifier',
    artifactDigest: 'digest',
    rawScores: 'raw-score-vector',
    rawConfidence: 'ratio',
    usage: 'usage-receipt',
    evidenceRefs: 'identifier-array',
    outputSchemaVersion: 'version',
    observationDigest: 'digest',
    informationSurface: 'information-surface',
  },
  'ai_council.seat_returned': {
    targetVersion: 'version',
    responseStatus: RESPONSE_STATUS_RULE,
    proposalDigest: 'digest',
    artifactRef: 'identifier',
    artifactDigest: 'digest',
    rawScores: 'raw-score-vector',
    rawConfidence: 'ratio',
    usage: 'usage-receipt',
    evidenceRefs: 'identifier-array',
    outputSchemaVersion: 'version',
    observationDigest: 'digest',
    informationSurface: 'information-surface',
    failureReason: 'nullable-prose',
    timeoutReason: 'nullable-prose',
  },
  'ai_council.critique_round_started': {
    sourceProposalIds: 'identifier-array',
    visibleInformationPolicyVersion: 'version',
    inputDigest: 'digest',
    informationSurface: 'information-surface',
  },
  'ai_council.critique_recorded': {
    sourceProposalIds: 'identifier-array',
    critiqueArtifactRef: 'identifier',
    critiqueArtifactDigest: 'digest',
    referencedClaimRefs: 'identifier-array',
    rawSeverity: 'ratio',
    rawConfidence: 'ratio',
    challengeDisposition: enumRule('accepted', 'contested', 'rejected', 'unresolved'),
    causalProposalRefs: 'identifier-array',
    informationSurface: 'information-surface',
  },
  'ai_council.candidate_blinded': {
    sourceProposalIds: 'identifier-array',
    candidateAliasDigest: 'digest',
    shuffleSeedDigest: 'digest',
    visibleCandidateDigest: 'digest',
    artifactRef: 'identifier',
    artifactDigest: 'digest',
    targetVersion: 'version',
    redactionPolicyVersion: 'version',
    informationSurface: 'information-surface',
  },
  'ai_council.pairwise_judgment_recorded': {
    candidateAId: 'identifier',
    candidateBId: 'identifier',
    orderToken: enumRule('a-first', 'b-first'),
    judgeProfileFingerprint: 'digest',
    rawPreference: 'pairwise-vector',
    rawConfidence: 'ratio',
    judgmentStatus: enumRule('abstained', 'consistent', 'inconsistent'),
    inputDigest: 'digest',
    calibrationRef: 'identifier',
    informationSurface: 'information-surface',
    supersedesJudgmentId: 'null',
  },
  'ai_council.bias_audit_recorded': {
    candidateAId: 'identifier',
    candidateBId: 'identifier',
    pairedJudgmentIds: 'identifier-array',
    biasFeatureCodes: 'code-array',
    detectorResult: enumRule('flagged', 'inconclusive', 'passed'),
    inconsistencyStatus: enumRule('consistent', 'inconsistent', 'unknown'),
    rawBiasScore: 'ratio',
    inputDigest: 'digest',
    detectorFingerprint: 'digest',
  },
  'ai_council.adjudication_decision': {
    candidateSetDigest: 'digest',
    protocolVersion: 'version',
    rubricVersion: 'version',
    rawScores: 'raw-score-vector',
    calibratedScores: 'raw-score-vector',
    supportMass: 'ratio',
    oppositionMass: 'ratio',
    independence: 'independence',
    minorityRefs: 'identifier-array',
    contradictionRefs: 'identifier-array',
    vetoFindingRefs: 'identifier-array',
    disposition: enumRule('selected', 'unresolved'),
    selectedCandidateId: 'nullable-identifier',
    evaluatorReceiptRef: 'identifier',
    sourceJudgmentIds: 'identifier-array',
  },
  'ai_council.stance_recorded': {
    candidateOrPlanRef: 'identifier',
    priorStanceEventId: 'nullable-identifier',
    currentStance: STANCE_RULE,
    rawRationaleDigest: 'digest',
    evidenceRef: 'identifier',
    influenceObservationDigest: 'digest',
  },
  'ai_council.stance_flipped': {
    candidateOrPlanRef: 'identifier',
    priorStanceEventId: 'identifier',
    priorStance: STANCE_RULE,
    currentStance: STANCE_RULE,
    flipDirection: enumRule('away-from-support', 'toward-support'),
    rawRationaleDigest: 'digest',
    evidenceRef: 'identifier',
    influenceObservationDigest: 'digest',
  },
  'ai_council.deliberation_synthesized': {
    inputEventRange: 'source-event-range',
    candidateSetDigest: 'digest',
    planDisposition: enumRule('selected', 'unresolved'),
    selectedPlanDigest: 'digest',
    disagreementRefs: 'identifier-array',
    minorityRefs: 'identifier-array',
    synthesisPolicyFingerprint: 'digest',
    evaluatorFingerprint: 'digest',
    reportDraftRef: 'identifier',
    synthesisReceiptRef: 'identifier',
  },
  'ai_council.convergence_evaluated': {
    decision: CONVERGENCE_RULE,
    rawAgreement: 'ratio',
    rawStability: 'ratio',
    calibratedSupport: 'ratio',
    effectiveSeatCount: 'seat-metric',
    independence: 'independence',
    judgeProfileRefs: 'identifier-array',
    qualityWitnessRefs: 'identifier-array',
    invarianceWitnessRefs: 'identifier-array',
    minorityRefs: 'identifier-array',
    contradictionRefs: 'identifier-array',
    vetoFindingRefs: 'identifier-array',
    requiredGateResultRefs: 'identifier-array',
    budgetStateRef: 'identifier',
    coverageStateRef: 'identifier',
    blockerIds: 'identifier-array',
    recoveryOrEscalationReason: 'nullable-prose',
  },
  'ai_council.convergence_blocked': {
    decision: CONVERGENCE_RULE,
    rawAgreement: 'ratio',
    rawStability: 'ratio',
    calibratedSupport: 'ratio',
    effectiveSeatCount: 'seat-metric',
    independence: 'independence',
    judgeProfileRefs: 'identifier-array',
    qualityWitnessRefs: 'identifier-array',
    invarianceWitnessRefs: 'identifier-array',
    minorityRefs: 'identifier-array',
    contradictionRefs: 'identifier-array',
    vetoFindingRefs: 'identifier-array',
    requiredGateResultRefs: 'identifier-array',
    budgetStateRef: 'identifier',
    coverageStateRef: 'identifier',
    blockerIds: 'identifier-array',
    recoveryOrEscalationReason: 'nullable-prose',
  },
  'ai_council.round_ended': {
    roundStatus: enumRule('blocked', 'complete', 'incomplete', 'non-converged'),
    convergenceEventId: 'identifier',
    acceptedCandidateRefs: 'identifier-array',
    rejectedCandidateRefs: 'identifier-array',
    unresolvedCandidateRefs: 'identifier-array',
    seatOutcomeCounts: 'seat-counts',
    lateResultDisposition: enumRule('discarded', 'none', 'retained-for-audit'),
    finalRoundTailDigest: 'digest',
    continuationDecision: enumRule('complete', 'continue', 'recover', 'stop'),
  },
  'ai_council.artifact_committed': {
    artifactKind: 'code',
    safeRelativePath: 'path',
    schemaVersion: 'version',
    byteDigest: 'digest',
    contentDigest: 'digest',
    requiredSectionResults: 'section-results',
    sourceEventRange: 'source-event-range',
    supersedesArtifactId: 'null',
    rollbackRef: 'nullable-identifier',
  },
  'ai_council.artifact_superseded': {
    artifactKind: 'code',
    safeRelativePath: 'path',
    schemaVersion: 'version',
    byteDigest: 'digest',
    contentDigest: 'digest',
    requiredSectionResults: 'section-results',
    sourceEventRange: 'source-event-range',
    priorArtifactId: 'identifier',
    successorArtifactId: 'identifier',
    supersessionReason: 'prose',
    rollbackRef: 'nullable-identifier',
  },
  'ai_council.council_test_gate_evaluated': {
    testSuiteDigest: 'digest',
    fixtureManifestDigest: 'digest',
    baselineFingerprint: 'digest',
    candidateFingerprint: 'digest',
    requiredCheckResults: 'check-results',
    criticalFailureRefs: 'identifier-array',
    metamorphicCheckDigest: 'digest',
    biasCheckDigest: 'digest',
    artifactCompleteness: enumRule('complete', 'incomplete', 'unknown'),
    verdict: enumRule('blocked', 'fail', 'pass'),
    gateReceiptRef: 'identifier',
    informationSurface: 'information-surface',
  },
  'ai_council.rollback_recorded': {
    rollbackReason: 'prose',
    supersededEventRefs: 'identifier-array',
    supersededArtifactRefs: 'identifier-array',
    failedGateRef: 'nullable-identifier',
    recoveryReceiptRef: 'identifier',
    restoredLegacyPathRef: 'identifier',
    authorizationRef: 'identifier',
  },
  'ai_council.council_complete': {
    terminalStatus: enumRule('completed', 'incomplete', 'non-converged'),
    convergenceEventId: 'identifier',
    finalDeliberationEventId: 'identifier',
    artifactManifestRef: 'identifier',
    councilTestGateEventId: 'identifier',
    finalLedgerTailDigest: 'digest',
    counts: 'completion-counts',
    recommendationOrUserDecisionRef: 'identifier',
    terminalReason: 'prose',
  },
} as const satisfies Readonly<
  Record<DeepAiCouncilEventStem, Readonly<Record<string, DataFieldRule>>>
>);

const SCOPE_FIELDS = Object.freeze({
  'ai_council.run_initialized': ['runId', 'roundId'],
  'ai_council.run_resumed': ['runId', 'roundId', 'generation'],
  'ai_council.run_restarted': ['runId', 'roundId', 'generation'],
  'ai_council.round_started': ['runId', 'roundId'],
  'ai_council.seat_selected': ['runId', 'roundId', 'seatId'],
  'ai_council.seat_dispatched': ['runId', 'roundId', 'seatId'],
  'ai_council.proposal_observed': ['runId', 'roundId', 'seatId', 'proposalId'],
  'ai_council.seat_returned': ['runId', 'roundId', 'seatId', 'proposalId'],
  'ai_council.critique_round_started': ['runId', 'roundId', 'seatId', 'critiqueRoundId'],
  'ai_council.critique_recorded': ['runId', 'roundId', 'seatId', 'critiqueRoundId'],
  'ai_council.candidate_blinded': ['runId', 'roundId', 'candidateId'],
  'ai_council.pairwise_judgment_recorded': ['runId', 'roundId', 'judgmentId'],
  'ai_council.bias_audit_recorded': ['runId', 'roundId', 'judgmentId'],
  'ai_council.adjudication_decision': ['runId', 'roundId'],
  'ai_council.stance_recorded': ['runId', 'roundId', 'candidateId', 'seatId'],
  'ai_council.stance_flipped': ['runId', 'roundId', 'candidateId', 'seatId'],
  'ai_council.deliberation_synthesized': ['runId', 'roundId'],
  'ai_council.convergence_evaluated': ['runId', 'roundId'],
  'ai_council.convergence_blocked': ['runId', 'roundId'],
  'ai_council.round_ended': ['runId', 'roundId'],
  'ai_council.artifact_committed': ['runId', 'roundId', 'artifactId'],
  'ai_council.artifact_superseded': ['runId', 'roundId', 'artifactId'],
  'ai_council.council_test_gate_evaluated': ['runId', 'roundId', 'gateId'],
  'ai_council.rollback_recorded': ['runId', 'roundId'],
  'ai_council.council_complete': ['runId', 'roundId'],
} as const satisfies Readonly<Record<DeepAiCouncilEventStem, readonly string[]>>);

const HASH_PATTERN = /^[a-f0-9]{64}$/;
const SYSTEM_TOKEN_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:/@-]{0,255}$/;
const CODE_TOKEN_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:/@-]{0,127}$/;
const SAFE_RELATIVE_PATH_PATTERN = /^(?!\/)(?!.*(?:^|\/)\.\.(?:\/|$))[A-Za-z0-9._/-]{1,512}$/;
const MAX_PROSE_LENGTH = 4_096;
const FORBIDDEN_MUTABLE_FIELDS = new Set([
  'body', 'content', 'proposalBody', 'rationale', 'rawBody', 'rawOutput',
  'reportBody', 'reportText', 'sourceText', 'text', 'transcript',
]);

// ───────────────────────────────────────────────────────────────────
// 3. VALIDATION
// ───────────────────────────────────────────────────────────────────

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && !Array.isArray(value) && typeof value === 'object';
}

function hasExactFields(value: Record<string, unknown>, fields: readonly string[]): boolean {
  const expected = new Set(fields);
  const keys = Object.keys(value);
  return keys.length === expected.size && keys.every((key) => expected.has(key));
}

function isDigest(value: unknown): value is string {
  return typeof value === 'string' && HASH_PATTERN.test(value);
}

function isSystemToken(value: unknown): value is string {
  return typeof value === 'string' && SYSTEM_TOKEN_PATTERN.test(value);
}

function isCodeToken(value: unknown): value is string {
  return typeof value === 'string' && CODE_TOKEN_PATTERN.test(value);
}

function isProse(value: unknown): value is string {
  return typeof value === 'string'
    && value.trim().length > 0
    && value.length <= MAX_PROSE_LENGTH;
}

function isUint32(value: unknown): value is number {
  return Number.isSafeInteger(value) && (value as number) >= 0 && (value as number) <= 0xffff_ffff;
}

function isRatio(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 1;
}

function isSeatMetric(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 64;
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
): value is string[] {
  return Array.isArray(value) && value.every(validator);
}

function isClosedRatios(value: unknown, fields: readonly string[]): boolean {
  return isObject(value)
    && hasExactFields(value, fields)
    && fields.every((field) => isRatio(value[field]));
}

function isTargetReference(value: unknown): boolean {
  return isObject(value)
    && hasExactFields(
      value,
      ['targetId', 'targetType', 'artifactRef', 'targetVersion', 'contentDigest'],
    )
    && isSystemToken(value.targetId)
    && ['artifact', 'directory', 'file', 'repository', 'symbol'].includes(
      String(value.targetType),
    )
    && isSystemToken(value.artifactRef)
    && isSystemToken(value.targetVersion)
    && isDigest(value.contentDigest);
}

function isInformationSurface(value: unknown): boolean {
  if (!isObject(value) || !hasExactFields(value, [
    'role',
    'capabilityRefs',
    'visibleDigests',
    'generatorIdentityVisible',
    'rationaleVisible',
    'peerScoresVisible',
    'voteCountsVisible',
    'independentJudgmentsCommitted',
  ])) return false;
  if (!['detector', 'generator', 'orchestrator', 'scorer', 'test-gate'].includes(
    String(value.role),
  )) return false;
  if (!isTokenArray(value.capabilityRefs, isSystemToken)
    || !isTokenArray(value.visibleDigests, isDigest)) return false;
  const flags = [
    value.generatorIdentityVisible,
    value.rationaleVisible,
    value.peerScoresVisible,
    value.voteCountsVisible,
    value.independentJudgmentsCommitted,
  ];
  if (!flags.every((flag) => typeof flag === 'boolean')) return false;
  return value.role !== 'scorer'
    || value.independentJudgmentsCommitted === true
    || (
      value.generatorIdentityVisible === false
      && value.rationaleVisible === false
      && value.peerScoresVisible === false
      && value.voteCountsVisible === false
    );
}

function isUsageReceipt(value: unknown): boolean {
  return isObject(value)
    && hasExactFields(value, ['receiptRef', 'inputTokens', 'outputTokens', 'costMicros'])
    && isSystemToken(value.receiptRef)
    && isUint32(value.inputTokens)
    && isUint32(value.outputTokens)
    && isUint32(value.costMicros);
}

function isIndependenceSnapshot(value: unknown): boolean {
  return isObject(value)
    && hasExactFields(value, [
      'snapshotRef',
      'inputDigest',
      'calibrationRef',
      'effectiveSeatCount',
      'dependenceMeasure',
      'marginalGain',
    ])
    && isSystemToken(value.snapshotRef)
    && isDigest(value.inputDigest)
    && isSystemToken(value.calibrationRef)
    && isSeatMetric(value.effectiveSeatCount)
    && isRatio(value.dependenceMeasure)
    && isRatio(value.marginalGain);
}

function isSourceEventRange(value: unknown): boolean {
  return isObject(value)
    && hasExactFields(value, ['firstEventId', 'lastEventId'])
    && isSystemToken(value.firstEventId)
    && isSystemToken(value.lastEventId);
}

function isResultArray(value: unknown, idField: 'checkId' | 'sectionId'): boolean {
  return Array.isArray(value) && value.every((entry) => (
    isObject(entry)
    && hasExactFields(entry, [idField, 'status', idField === 'checkId'
      ? 'resultDigest'
      : 'evidenceDigest'])
    && isSystemToken(entry[idField])
    && ['fail', 'pass', 'unknown'].includes(String(entry.status))
    && isDigest(entry[idField === 'checkId' ? 'resultDigest' : 'evidenceDigest'])
  ));
}

function isCountObject(value: unknown, fields: readonly string[]): boolean {
  return isObject(value)
    && hasExactFields(value, fields)
    && fields.every((field) => isUint32(value[field]));
}

function isReplayMetadata(value: unknown): boolean {
  return isObject(value)
    && hasExactFields(value, ['fingerprint_version', 'final_digest', 'replay_input_digests'])
    && Number.isSafeInteger(value.fingerprint_version)
    && (value.fingerprint_version as number) > 0
    && isDigest(value.final_digest)
    && isObject(value.replay_input_digests)
    && Object.values(value.replay_input_digests).every(isDigest);
}

function isScope(stem: DeepAiCouncilEventStem, value: unknown): boolean {
  if (!isObject(value)) return false;
  const fields = SCOPE_FIELDS[stem];
  if (!hasExactFields(value, fields)) return false;
  return fields.every((field) => (
    field === 'generation'
      ? isUint32(value[field]) && value[field] !== 0
      : isSystemToken(value[field])
  ));
}

function isFieldValue(rule: DataFieldRule, value: unknown): boolean {
  if (typeof rule !== 'string') {
    if (rule.values.length === 1 && rule.values[0] === 'true') return value === true;
    return rule.values.includes(String(value));
  }
  switch (rule) {
    case 'boolean':
      return typeof value === 'boolean';
    case 'check-results':
      return isResultArray(value, 'checkId');
    case 'code':
      return isCodeToken(value);
    case 'code-array':
      return isTokenArray(value, isCodeToken);
    case 'completion-counts':
      return isCountObject(value, ['rounds', 'seats', 'proposals', 'judgments']);
    case 'digest':
      return isDigest(value);
    case 'identifier':
    case 'version':
      return isSystemToken(value);
    case 'identifier-array':
      return isTokenArray(value, isSystemToken);
    case 'independence':
      return isIndependenceSnapshot(value);
    case 'information-surface':
      return isInformationSurface(value);
    case 'null':
      return value === null;
    case 'nullable-identifier':
      return value === null || isSystemToken(value);
    case 'nullable-prose':
      return value === null || isProse(value);
    case 'pairwise-vector':
      return isClosedRatios(value, ['candidateA', 'candidateB', 'abstain']);
    case 'path':
      return typeof value === 'string' && SAFE_RELATIVE_PATH_PATTERN.test(value);
    case 'prose':
      return isProse(value);
    case 'ratio':
      return isRatio(value);
    case 'raw-score-vector':
      return isClosedRatios(value, ['quality', 'feasibility', 'novelty', 'risk']);
    case 'section-results':
      return isResultArray(value, 'sectionId');
    case 'seat-metric':
      return isSeatMetric(value);
    case 'seat-counts':
      return isCountObject(value, ['selected', 'dispatched', 'returned', 'failed', 'timedOut']);
    case 'source-event-range':
      return isSourceEventRange(value);
    case 'target-reference':
      return isTargetReference(value);
    case 'uint32':
      return isUint32(value);
    case 'usage-receipt':
      return isUsageReceipt(value);
  }
}

function isData(stem: DeepAiCouncilEventStem, value: unknown): boolean {
  if (!isObject(value) || hasForbiddenMutableField(value)) return false;
  const rules = DATA_FIELD_RULES[stem];
  if (!hasExactFields(value, Object.keys(rules))) return false;
  if (!Object.entries(rules).every(([field, rule]) => isFieldValue(rule, value[field]))) {
    return false;
  }
  if (stem === 'ai_council.run_initialized') {
    return (value.minSeatCount as number) > 0
      && (value.minSeatCount as number) <= (value.maxSeatCount as number)
      && (value.maxSeatCount as number) <= 64;
  }
  if (stem === 'ai_council.round_started') {
    return (value.informationSurface as Record<string, unknown>).role === 'orchestrator';
  }
  if (stem === 'ai_council.seat_dispatched') {
    return (value.informationSurface as Record<string, unknown>).role === 'generator';
  }
  if (stem === 'ai_council.candidate_blinded') {
    const surface = value.informationSurface as Record<string, unknown>;
    return surface.role === 'scorer'
      && surface.generatorIdentityVisible === false
      && surface.rationaleVisible === false
      && surface.peerScoresVisible === false
      && surface.voteCountsVisible === false;
  }
  if (stem === 'ai_council.proposal_observed' || stem === 'ai_council.seat_returned') {
    return (value.informationSurface as Record<string, unknown>).role === 'generator';
  }
  if (stem === 'ai_council.critique_round_started'
    || stem === 'ai_council.critique_recorded') {
    return (value.informationSurface as Record<string, unknown>).role === 'detector';
  }
  if (stem === 'ai_council.pairwise_judgment_recorded'
    || stem === 'ai_council.bias_audit_recorded') {
    return value.candidateAId !== value.candidateBId
      && (
        stem !== 'ai_council.pairwise_judgment_recorded'
        || (value.informationSurface as Record<string, unknown>).role === 'scorer'
      );
  }
  if (stem === 'ai_council.adjudication_decision') {
    return value.disposition === 'selected'
      ? value.selectedCandidateId !== null && (value.sourceJudgmentIds as unknown[]).length > 0
      : value.selectedCandidateId === null;
  }
  if (stem === 'ai_council.stance_flipped') {
    return value.priorStance !== value.currentStance;
  }
  if (stem === 'ai_council.convergence_blocked') return value.decision === 'blocked';
  if (stem === 'ai_council.artifact_superseded') {
    return value.priorArtifactId !== value.successorArtifactId;
  }
  if (stem === 'ai_council.council_test_gate_evaluated') {
    return (value.informationSurface as Record<string, unknown>).role === 'test-gate';
  }
  return true;
}

function digestPayloadInput(
  stem: DeepAiCouncilEventStem,
  scope: JsonObject,
  prevEventHash: string,
  replay: JsonObject,
  data: JsonObject,
): string {
  return sha256Bytes(canonicalBytes({
    stem,
    eventVersion: DEEP_AI_COUNCIL_EVENT_VERSION,
    scope,
    prevEventHash,
    replay,
    data,
  }));
}

function isPayload(stem: DeepAiCouncilEventStem, payload: Readonly<JsonObject>): boolean {
  if (!isDeepAiCouncilEventStem(payload.stem)
    || payload.stem !== stem
    || payload.eventVersion !== DEEP_AI_COUNCIL_EVENT_VERSION) return false;
  if (!isScope(stem, payload.scope) || !isDigest(payload.prevEventHash)) return false;
  if (!isReplayMetadata(payload.replay) || !isData(stem, payload.data)) return false;
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

function eventDefinition(stem: DeepAiCouncilEventStem): EventTypeDefinition {
  return {
    eventType: DeepAiCouncilWireEventTypes[stem],
    currentVersion: DEEP_AI_COUNCIL_EVENT_VERSION,
    versions: [{
      version: DEEP_AI_COUNCIL_EVENT_VERSION,
      payload: {
        requiredFields: DEEP_AI_COUNCIL_MODE_PAYLOAD_FIELDS,
        validate: (payload) => isPayload(stem, payload),
      },
    }],
    upcasters: [],
  };
}

export function createDeepAiCouncilEventRegistry(): EventTypeRegistry {
  return new EventTypeRegistry(DeepAiCouncilEventStems.map(eventDefinition));
}

export function createDeepAiCouncilLedgerPayload<TStem extends DeepAiCouncilEventStem>(
  stem: TStem,
  scope: DeepAiCouncilScopeMap[TStem],
  prevEventHash: string,
  replay: DeepAiCouncilReplayMetadata,
  data: DeepAiCouncilPayloadMap[TStem],
): DeepAiCouncilLedgerPayload<TStem> {
  const payloadDigest = digestPayloadInput(stem, scope, prevEventHash, replay, data);
  return Object.freeze({
    stem,
    eventVersion: DEEP_AI_COUNCIL_EVENT_VERSION,
    scope,
    prevEventHash,
    payloadDigest,
    replay,
    data,
  }) as DeepAiCouncilLedgerPayload<TStem>;
}

export function prepareDeepAiCouncilEvent<TStem extends DeepAiCouncilEventStem>(
  input: DeepAiCouncilEventInput<TStem>,
  registry: EventTypeRegistry,
): EventWritePreflight {
  const payload = createDeepAiCouncilLedgerPayload(
    input.stem,
    input.scope,
    input.prevEventHash,
    input.replay,
    input.data,
  );
  const envelope: DeepAiCouncilEventEnvelope<TStem> = {
    envelope_version: CURRENT_ENVELOPE_VERSION,
    event_id: input.eventId,
    event_type: DeepAiCouncilWireEventTypes[input.stem],
    event_version: DEEP_AI_COUNCIL_EVENT_VERSION,
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

export function deepAiCouncilEventDefinitions(): readonly EventTypeDefinition[] {
  return Object.freeze(DeepAiCouncilEventStems.map(eventDefinition));
}

export function deepAiCouncilPayloadDigest<TStem extends DeepAiCouncilEventStem>(
  payload: Readonly<{
    stem: TStem;
    eventVersion: 1;
    scope: DeepAiCouncilScopeMap[TStem];
    prevEventHash: string;
    replay: DeepAiCouncilReplayMetadata;
    data: DeepAiCouncilPayloadMap[TStem];
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

export function isDeepAiCouncilEventStem(value: JsonValue): value is DeepAiCouncilEventStem {
  return typeof value === 'string'
    && (DeepAiCouncilEventStems as readonly string[]).includes(value);
}

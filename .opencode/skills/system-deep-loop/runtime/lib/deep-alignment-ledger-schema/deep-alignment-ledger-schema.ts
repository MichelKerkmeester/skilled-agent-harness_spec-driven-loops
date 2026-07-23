// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Alignment Ledger Schema
// ───────────────────────────────────────────────────────────────────

import {
  CURRENT_ENVELOPE_VERSION,
  EVENT_ENVELOPE_FIELDS,
  EventTypeRegistry,
  canonicalBytes,
  prepareEventWrite,
  sha256Bytes,
} from '../event-envelope/index.js';
import { createDeepReviewLedgerPayload } from '../deep-review-ledger-schema/index.js';
import {
  DEEP_ALIGNMENT_SHARED_REVIEW_BACKBONE,
  DeepAlignmentEventStems,
  DeepAlignmentWireEventTypes,
} from './deep-alignment-ledger-types.js';

import type {
  EventProducer,
  EventTypeDefinition,
  EventWritePreflight,
  JsonObject,
  JsonValue,
} from '../event-envelope/index.js';
import type {
  DeepReviewEventStem,
  DeepReviewPayloadMap,
  DeepReviewReplayMetadata,
  DeepReviewScopeMap,
} from '../deep-review-ledger-schema/index.js';
import type {
  DeepAlignmentEventEnvelope,
  DeepAlignmentEventStem,
  DeepAlignmentLedgerPayload,
  DeepAlignmentPayloadMap,
  DeepAlignmentReplayMetadata,
  DeepAlignmentScopeMap,
  DeepAlignmentSharedBackboneStem,
} from './deep-alignment-ledger-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. PUBLIC INPUTS
// ───────────────────────────────────────────────────────────────────

export interface DeepAlignmentEventInput<TStem extends DeepAlignmentEventStem> {
  readonly stem: TStem;
  readonly scope: DeepAlignmentScopeMap[TStem];
  readonly prevEventHash: string;
  readonly replay: DeepAlignmentReplayMetadata;
  readonly data: DeepAlignmentPayloadMap[TStem];
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

export const DEEP_ALIGNMENT_EVENT_VERSION = 1 as const;

export const DEEP_ALIGNMENT_SHARED_ENVELOPE_FIELDS = Object.freeze([
  ...EVENT_ENVELOPE_FIELDS,
] as const);

export const DEEP_ALIGNMENT_MODE_PAYLOAD_FIELDS = Object.freeze([
  'stem',
  'eventVersion',
  'scope',
  'prevEventHash',
  'payloadDigest',
  'replay',
  'data',
] as const);

type DeepAlignmentExtensionStem = Exclude<
  DeepAlignmentEventStem,
  DeepAlignmentSharedBackboneStem
>;

type DataFieldKind =
  | 'alignment-locator'
  | 'authority-validation-checks'
  | 'boolean'
  | 'code'
  | 'code-array'
  | 'conformance-counts'
  | 'digest'
  | 'identifier'
  | 'identifier-array'
  | 'nullable-identifier'
  | 'nullable-prose'
  | 'nullable-timestamp'
  | 'prose'
  | 'ratio'
  | 'semantic-fingerprint'
  | 'timestamp'
  | 'uint32'
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
  'blocked', 'compatible', 'degraded', 'exact', 'migrate', 'pin-old-runtime',
);
const SEVERITY_RULE = enumRule('none', 'P0', 'P1', 'P2');

const DATA_FIELD_RULES = Object.freeze({
  'deep_alignment.authority_reference_bound': {
    authorityId: 'identifier',
    authorityCapsuleRef: 'identifier',
    authoritySourceDigest: 'digest',
    compilerFingerprint: 'digest',
    profileDigest: 'digest',
    ruleIrDigest: 'digest',
    signatureDigest: 'digest',
    expiresAt: 'timestamp',
    rollbackRef: 'nullable-identifier',
  },
  'deep_alignment.authority_validation_recorded': {
    authorityReferenceEventId: 'identifier',
    checks: 'authority-validation-checks',
    authorityStatus: enumRule('expired', 'invalid', 'mixed', 'rolled-back', 'valid'),
    validationReceiptRefs: 'identifier-array',
    validatorFingerprint: 'digest',
    validationDigest: 'digest',
    blockedReasonCode: 'nullable-identifier',
  },
  'deep_alignment.authority_epoch_compatibility_recorded': {
    sourceAuthorityEpochId: 'identifier',
    targetAuthorityEpochId: 'identifier',
    compatibilityClass: COMPATIBILITY_RULE,
    direction: enumRule('backward', 'forward'),
    affectedRuleIds: 'identifier-array',
    comparisonDigest: 'digest',
    reasonCode: 'code',
    orderedUpcastPath: 'identifier-array',
    ambiguous: 'boolean',
    lossy: 'boolean',
  },
  'deep_alignment.lane_plan_recorded': {
    laneKind: enumRule('deterministic', 'reasoning-required', 'relational', 'schema'),
    orderedRuleIds: 'identifier-array',
    ruleIrRef: 'identifier',
    ruleIrDigest: 'digest',
    verifierPolicyVersion: 'version',
    budgetRef: 'identifier',
    requiredEvidenceClasses: 'code-array',
    planDigest: 'digest',
  },
  'deep_alignment.lane_started': {
    lanePlanEventId: 'identifier',
    subjectSnapshotRef: 'identifier',
    subjectSnapshotDigest: 'digest',
    authorityValidationEventId: 'identifier',
    authorityValidationDigest: 'digest',
    status: enumRule('started'),
  },
  'deep_alignment.subject_snapshot_bound': {
    subjectSnapshotRef: 'identifier',
    subjectType: enumRule('artifact', 'directory', 'file', 'repository', 'symbol'),
    subjectDigest: 'digest',
    sourceVersionRef: 'identifier',
    capturedAt: 'timestamp',
    parentSnapshotRef: 'nullable-identifier',
    receiptRef: 'identifier',
  },
  'deep_alignment.lane_completed': {
    lanePlanEventId: 'identifier',
    subjectSnapshotRef: 'identifier',
    subjectSnapshotDigest: 'digest',
    authorityValidationEventId: 'identifier',
    applicabilityDecisionRefs: 'identifier-array',
    observationRefs: 'identifier-array',
    verificationRefs: 'identifier-array',
    status: enumRule('blocked', 'complete', 'incomplete'),
    counts: 'conformance-counts',
    completionDigest: 'digest',
    blockedReasonCode: 'nullable-identifier',
  },
  'deep_alignment.applicability_evaluated': {
    predicateRef: 'identifier',
    predicateDigest: 'digest',
    targetFactRefs: 'identifier-array',
    targetFactDigest: 'digest',
    result: enumRule('applicable', 'blocked', 'not_applicable', 'unresolved'),
    evaluatorFingerprint: 'digest',
    authorityValidationEventId: 'identifier',
    decisionDigest: 'digest',
    reasonCode: 'code',
  },
  'deep_alignment.observation_recorded': {
    applicabilityDecisionId: 'identifier',
    subjectSnapshotRef: 'identifier',
    subjectSnapshotDigest: 'digest',
    detectorFingerprint: 'digest',
    observationKind: enumRule('deterministic', 'reasoning', 'relational', 'schema'),
    rawResultDigest: 'digest',
    sourceDigest: 'digest',
    contentDigest: 'digest',
    evidenceClass: 'code',
    freshness: enumRule('fresh', 'stale', 'unknown'),
    causalRelevance: enumRule('direct', 'indirect', 'unknown'),
    locator: 'alignment-locator',
    receiptRefs: 'identifier-array',
  },
  'deep_alignment.evidence_receipt_bound': {
    observationEventId: 'identifier',
    receiptRef: 'identifier',
    receiptDigest: 'digest',
    evidenceClass: 'code',
    freshness: enumRule('fresh', 'stale', 'unknown'),
    sourceDigest: 'digest',
    contentDigest: 'digest',
    toolFingerprint: 'digest',
    capturedAt: 'timestamp',
  },
  'deep_alignment.observation_reconciled': {
    observationEventId: 'identifier',
    predecessorObservationEventId: 'identifier',
    evidenceReceiptRefs: 'identifier-array',
    reconciliationOutcome: enumRule('confirmed', 'contradicted', 'degraded', 'superseded'),
    evidenceSetDigest: 'digest',
    reconcilerFingerprint: 'digest',
    reasonCode: 'code',
  },
  'deep_alignment.finding_candidate_emitted': {
    observationEventId: 'identifier',
    applicabilityDecisionId: 'identifier',
    evidenceReceiptRefs: 'identifier-array',
    detectorFingerprint: 'digest',
    detectorBlindingDigest: 'digest',
    candidateClaimDigest: 'digest',
    findingClass: 'code',
    rawImpact: 'ratio',
    rawConfidence: 'ratio',
    rawCandidateScore: 'ratio',
    scorerFingerprint: 'digest',
    scoringPolicyVersion: 'version',
    semanticFingerprint: 'semantic-fingerprint',
    sourcePassEventId: 'identifier',
  },
  'deep_alignment.finding_verification_recorded': {
    candidateEventId: 'identifier',
    observationEventId: 'identifier',
    authorityValidationEventId: 'identifier',
    subjectSnapshotRef: 'identifier',
    subjectSnapshotDigest: 'digest',
    applicabilityDecisionId: 'identifier',
    evidenceReceiptRefs: 'identifier-array',
    verifierFingerprint: 'digest',
    verifierIndependenceDigest: 'digest',
    proofWitnessRefs: 'identifier-array',
    verificationMode: enumRule(
      'deterministic', 'independent-reasoning', 'relational', 'schema',
    ),
    result: enumRule('blocked', 'confirmed', 'disproved', 'inconclusive'),
    rawImpact: 'ratio',
    rawConfidence: 'ratio',
    evidenceStrength: 'ratio',
    counterevidenceRefs: 'identifier-array',
    verificationDigest: 'digest',
  },
  'deep_alignment.proof_witness_recorded': {
    verificationEventId: 'identifier',
    witnessKind: enumRule('boundary', 'negative', 'positive', 'stateful'),
    artifactRef: 'identifier',
    witnessDigest: 'digest',
    sourceDigest: 'digest',
    locator: 'alignment-locator',
    minimized: 'boolean',
    minimizerFingerprint: 'digest',
    replayRecipeRef: 'identifier',
    replayRecipeDigest: 'digest',
    outcome: enumRule('contradicts', 'inconclusive', 'supports'),
    receiptRefs: 'identifier-array',
  },
  'deep_alignment.claim_adjudication_recorded': {
    candidateEventId: 'identifier',
    verificationEventId: 'identifier',
    observationEventId: 'identifier',
    claimDigest: 'digest',
    evidenceReceiptRefs: 'identifier-array',
    proofWitnessRefs: 'identifier-array',
    counterevidenceRefs: 'identifier-array',
    verifierFingerprint: 'digest',
    assessorFingerprint: 'digest',
    authorityValidationEventId: 'identifier',
    applicabilityDecisionId: 'identifier',
    subjectSnapshotDigest: 'digest',
    finalSeverity: SEVERITY_RULE,
    impact: 'ratio',
    confidence: 'ratio',
    outcome: enumRule('accepted', 'blocked', 'deferred', 'disproved', 'rejected'),
    transition: enumRule(
      'candidate-to-finding', 'candidate-to-rejected', 'finding-reaffirmed',
    ),
    adjudicationDigest: 'digest',
    predecessorAdjudicationEventId: 'nullable-identifier',
  },
  'deep_alignment.conformance_assessment_recorded': {
    adjudicationEventId: 'identifier',
    adjudicationPayloadDigest: 'digest',
    authorityValidationEventId: 'identifier',
    authorityValidationDigest: 'digest',
    authorityStatus: enumRule('valid'),
    subjectSnapshotRef: 'identifier',
    subjectSnapshotDigest: 'digest',
    applicabilityDecisionId: 'identifier',
    applicabilityOutcome: enumRule('applicable', 'blocked', 'not_applicable', 'unresolved'),
    verificationEventId: 'identifier',
    verifierFingerprint: 'digest',
    proofWitnessRefs: 'identifier-array',
    evidenceReceiptRefs: 'identifier-array',
    conformanceStatus: enumRule(
      'blocked', 'conformant', 'inconclusive', 'non_conformant',
      'not_applicable', 'untested',
    ),
    impact: 'ratio',
    confidence: 'ratio',
    assessmentPolicyVersion: 'version',
    assessmentDigest: 'digest',
  },
  'deep_alignment.known_deviation_recorded': {
    originalFindingEventId: 'identifier',
    originalFindingDigest: 'digest',
    conformanceAssessmentEventId: 'identifier',
    authorityEpochRef: 'identifier',
    verifierFingerprint: 'digest',
    issuerId: 'identifier',
    rationale: 'prose',
    scopePredicateRef: 'identifier',
    scopePredicateDigest: 'digest',
    subjectSnapshotDigest: 'digest',
    expiresAt: 'nullable-timestamp',
    invalidationConditionRefs: 'identifier-array',
    status: enumRule('active'),
  },
  'deep_alignment.known_deviation_invalidated': {
    deviationEventId: 'identifier',
    originalFindingEventId: 'identifier',
    authorityEpochRef: 'identifier',
    verifierFingerprint: 'digest',
    subjectSnapshotDigest: 'digest',
    invalidationTrigger: enumRule(
      'authority-changed', 'expired', 'scope-changed', 'subject-changed', 'verifier-changed',
    ),
    invalidationEvidenceRefs: 'identifier-array',
    invalidationDigest: 'digest',
    reactivatedFindingEventId: 'nullable-identifier',
    invalidatedAt: 'timestamp',
  },
  'deep_alignment.applicability_coverage_recorded': {
    authorityValidationEventId: 'identifier',
    subjectSnapshotDigest: 'digest',
    declaredApplicabilityEdgeRefs: 'identifier-array',
    applicableRuleIds: 'identifier-array',
    notApplicableRuleIds: 'identifier-array',
    unresolvedRuleIds: 'identifier-array',
    untestedRuleIds: 'identifier-array',
    blockedRuleIds: 'identifier-array',
    coverageDigest: 'digest',
  },
  'deep_alignment.authority_witness_replayed': {
    sourceAuthorityEpochId: 'identifier',
    targetAuthorityEpochId: 'identifier',
    witnessEventId: 'identifier',
    proofDigest: 'digest',
    affectedRuleIds: 'identifier-array',
    compatibilityClass: COMPATIBILITY_RULE,
    compatibilityDecisionEventId: 'identifier',
    replayOutcome: enumRule('accepted', 'blocked', 'degraded'),
    verifierFingerprint: 'digest',
    subjectSnapshotDigest: 'digest',
    replayDigest: 'digest',
  },
} as const satisfies Readonly<
  Record<DeepAlignmentExtensionStem, Readonly<Record<string, DataFieldRule>>>
>);

const SCOPE_FIELDS = Object.freeze({
  'deep_alignment.run_initialized': ['runId', 'sessionId', 'authorityEpochId', 'generation'],
  'deep_alignment.run_resumed': ['runId', 'sessionId', 'authorityEpochId', 'generation'],
  'deep_alignment.run_restarted': ['runId', 'sessionId', 'authorityEpochId', 'generation'],
  'deep_alignment.authority_reference_bound': ['runId', 'sessionId', 'authorityEpochId'],
  'deep_alignment.authority_validation_recorded': ['runId', 'sessionId', 'authorityEpochId'],
  'deep_alignment.authority_epoch_compatibility_recorded': [
    'runId', 'sessionId', 'authorityEpochId',
  ],
  'deep_alignment.scope_resolved': ['runId', 'sessionId', 'authorityEpochId'],
  'deep_alignment.dimension_ordered': ['runId', 'sessionId', 'authorityEpochId'],
  'deep_alignment.protocol_plan_recorded': [
    'runId', 'sessionId', 'authorityEpochId', 'protocolId',
  ],
  'deep_alignment.lane_plan_recorded': [
    'runId', 'sessionId', 'authorityEpochId', 'generation', 'iterationId', 'laneId',
  ],
  'deep_alignment.lane_started': [
    'runId', 'sessionId', 'authorityEpochId', 'generation', 'iterationId', 'laneId',
  ],
  'deep_alignment.subject_snapshot_bound': [
    'runId', 'sessionId', 'authorityEpochId', 'generation', 'iterationId',
    'laneId', 'subjectId',
  ],
  'deep_alignment.applicability_evaluated': [
    'runId', 'sessionId', 'authorityEpochId', 'generation', 'iterationId',
    'laneId', 'subjectId', 'ruleId',
  ],
  'deep_alignment.dimension_pass_started': [
    'runId', 'sessionId', 'authorityEpochId', 'generation', 'iterationId', 'dimensionId',
  ],
  'deep_alignment.observation_recorded': [
    'runId', 'sessionId', 'authorityEpochId', 'generation', 'iterationId',
    'laneId', 'subjectId', 'ruleId', 'observationId',
  ],
  'deep_alignment.evidence_receipt_bound': [
    'runId', 'sessionId', 'authorityEpochId', 'generation', 'iterationId',
    'laneId', 'subjectId', 'ruleId', 'observationId', 'evidenceId',
  ],
  'deep_alignment.observation_reconciled': [
    'runId', 'sessionId', 'authorityEpochId', 'generation', 'iterationId',
    'laneId', 'subjectId', 'ruleId', 'observationId',
  ],
  'deep_alignment.finding_candidate_emitted': [
    'runId', 'sessionId', 'authorityEpochId', 'generation', 'iterationId',
    'laneId', 'subjectId', 'ruleId', 'observationId', 'candidateId',
  ],
  'deep_alignment.finding_verification_recorded': [
    'runId', 'sessionId', 'authorityEpochId', 'generation', 'iterationId',
    'laneId', 'subjectId', 'ruleId', 'observationId', 'candidateId',
    'findingId', 'verificationId',
  ],
  'deep_alignment.proof_witness_recorded': [
    'runId', 'sessionId', 'authorityEpochId', 'generation', 'iterationId',
    'laneId', 'subjectId', 'ruleId', 'observationId', 'candidateId',
    'findingId', 'verificationId', 'proofId',
  ],
  'deep_alignment.claim_adjudication_recorded': [
    'runId', 'sessionId', 'authorityEpochId', 'generation', 'iterationId',
    'laneId', 'subjectId', 'ruleId', 'observationId', 'candidateId',
    'findingId', 'verificationId',
  ],
  'deep_alignment.conformance_assessment_recorded': [
    'runId', 'sessionId', 'authorityEpochId', 'generation', 'iterationId',
    'laneId', 'subjectId', 'ruleId', 'observationId', 'candidateId',
    'findingId', 'verificationId',
  ],
  'deep_alignment.finding_lineage_recorded': [
    'runId', 'sessionId', 'authorityEpochId', 'generation', 'iterationId',
    'dimensionId', 'findingId',
  ],
  'deep_alignment.finding_state_changed': [
    'runId', 'sessionId', 'authorityEpochId', 'generation', 'iterationId',
    'dimensionId', 'findingId',
  ],
  'deep_alignment.known_deviation_recorded': [
    'runId', 'sessionId', 'authorityEpochId', 'generation', 'iterationId',
    'dimensionId', 'findingId', 'deviationId',
  ],
  'deep_alignment.known_deviation_invalidated': [
    'runId', 'sessionId', 'authorityEpochId', 'generation', 'iterationId',
    'dimensionId', 'findingId', 'deviationId',
  ],
  'deep_alignment.applicability_coverage_recorded': [
    'runId', 'sessionId', 'authorityEpochId', 'generation', 'iterationId', 'laneId',
  ],
  'deep_alignment.authority_witness_replayed': [
    'runId', 'sessionId', 'authorityEpochId', 'generation', 'iterationId',
    'laneId', 'subjectId', 'ruleId', 'observationId', 'candidateId',
    'findingId', 'verificationId', 'proofId',
  ],
  'deep_alignment.dimension_pass_completed': [
    'runId', 'sessionId', 'authorityEpochId', 'generation', 'iterationId', 'dimensionId',
  ],
  'deep_alignment.lane_completed': [
    'runId', 'sessionId', 'authorityEpochId', 'generation', 'iterationId', 'laneId',
  ],
  'deep_alignment.convergence_evaluated': [
    'runId', 'sessionId', 'authorityEpochId', 'generation', 'iterationId',
  ],
  'deep_alignment.graph_convergence_evaluated': [
    'runId', 'sessionId', 'authorityEpochId', 'generation', 'iterationId',
  ],
  'deep_alignment.blocked_stop_recorded': [
    'runId', 'sessionId', 'authorityEpochId', 'generation', 'iterationId',
  ],
  'deep_alignment.pause_recorded': [
    'runId', 'sessionId', 'authorityEpochId', 'generation', 'iterationId',
  ],
  'deep_alignment.recovery_started': [
    'runId', 'sessionId', 'authorityEpochId', 'generation', 'iterationId', 'dimensionId',
  ],
  'deep_alignment.synthesis_started': [
    'runId', 'sessionId', 'authorityEpochId', 'reportRevisionId',
  ],
  'deep_alignment.review_report_committed': [
    'runId', 'sessionId', 'authorityEpochId', 'reportRevisionId',
  ],
  'deep_alignment.continuity_save_requested': ['runId', 'sessionId', 'authorityEpochId'],
  'deep_alignment.continuity_save_completed': ['runId', 'sessionId', 'authorityEpochId'],
  'deep_alignment.continuity_save_failed': ['runId', 'sessionId', 'authorityEpochId'],
  'deep_alignment.run_completed': ['runId', 'sessionId', 'authorityEpochId'],
} as const satisfies Readonly<Record<DeepAlignmentEventStem, readonly string[]>>);

const HASH_PATTERN = /^[a-f0-9]{64}$/;
const SYSTEM_TOKEN_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:/@#-]{0,255}$/;
const CODE_TOKEN_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:/@-]{0,127}$/;
const LOCATOR_SELECTOR_PATTERN = /^[^\u0000-\u001f\u007f\r\n]{1,256}$/u;
const MAX_LOCATOR_SELECTOR_SPACES = 16;
const MAX_PROSE_LENGTH = 4_096;
const VALIDATION_CHECK_FIELDS = Object.freeze([
  'parse',
  'type',
  'capability',
  'ruleTests',
  'coverage',
  'expiry',
  'rollback',
  'signature',
  'mixAndMatch',
  'resultDigest',
] as const);
const SEMANTIC_FINGERPRINT_FIELDS = Object.freeze([
  'algorithmVersion',
  'semanticAnchorDigest',
  'normalizedContextDigest',
  'programSliceDigest',
  'renameMapVersion',
  'baselineState',
] as const);
const FORBIDDEN_MUTABLE_FIELDS = new Set([
  'authorityBody',
  'body',
  'code',
  'content',
  'evidenceBlob',
  'rawBody',
  'rawEvidence',
  'rawOutput',
  'reportBody',
  'reportText',
  'sourceBody',
  'sourceText',
  'subjectBody',
  'text',
  'transcript',
]);

// ───────────────────────────────────────────────────────────────────
// 3. VALIDATION
// ───────────────────────────────────────────────────────────────────

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && !Array.isArray(value) && typeof value === 'object';
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

function hasExactFields(value: Record<string, unknown>, fields: readonly string[]): boolean {
  const expected = [...fields].sort();
  const actual = Object.keys(value).sort();
  return actual.length === expected.length
    && actual.every((field, index) => field === expected[index]);
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

function isLocatorSelector(value: unknown): value is string {
  return typeof value === 'string'
    && value.trim().length > 0
    && LOCATOR_SELECTOR_PATTERN.test(value)
    && (value.match(/\s/gu)?.length ?? 0) <= MAX_LOCATOR_SELECTOR_SPACES;
}

function isAlignmentLocator(value: unknown): boolean {
  return isObject(value)
    && hasExactFields(
      value,
      ['scheme', 'artifactRef', 'locatorDigest', 'selector', 'revision'],
    )
    && ['artifact', 'file', 'other'].includes(String(value.scheme))
    && isSystemToken(value.artifactRef)
    && isDigest(value.locatorDigest)
    && isLocatorSelector(value.selector)
    && (value.revision === null || isSystemToken(value.revision));
}

function isAuthorityValidationChecks(value: unknown): boolean {
  if (!isObject(value) || !hasExactFields(value, VALIDATION_CHECK_FIELDS)) return false;
  const statuses = ['fail', 'pass', 'unknown'];
  return VALIDATION_CHECK_FIELDS.slice(0, -1).every(
    (field) => statuses.includes(String(value[field])),
  ) && isDigest(value.resultDigest);
}

function isConformanceCounts(value: unknown): boolean {
  return isObject(value)
    && hasExactFields(value, [
      'applicable',
      'notApplicable',
      'unresolved',
      'untested',
      'blocked',
      'nonConformant',
    ])
    && Object.values(value).every(isUint32);
}

function isSemanticFingerprint(value: unknown): boolean {
  return isObject(value)
    && hasExactFields(value, SEMANTIC_FINGERPRINT_FIELDS)
    && isSystemToken(value.algorithmVersion)
    && isDigest(value.semanticAnchorDigest)
    && isDigest(value.normalizedContextDigest)
    && isDigest(value.programSliceDigest)
    && isSystemToken(value.renameMapVersion)
    && ['absent', 'present', 'unknown'].includes(String(value.baselineState));
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

function isScope(stem: DeepAlignmentEventStem, value: unknown): boolean {
  if (!isObject(value) || !hasExactFields(value, SCOPE_FIELDS[stem])) return false;
  for (const [field, candidate] of Object.entries(value)) {
    if (field === 'generation') {
      if (!isUint32(candidate) || candidate === 0) return false;
    } else if (!isSystemToken(candidate)) return false;
  }
  return true;
}

function isFieldValue(rule: DataFieldRule, value: unknown): boolean {
  if (typeof rule !== 'string') return rule.values.includes(String(value));
  switch (rule) {
    case 'alignment-locator':
      return isAlignmentLocator(value);
    case 'authority-validation-checks':
      return isAuthorityValidationChecks(value);
    case 'boolean':
      return typeof value === 'boolean';
    case 'code':
      return isCodeToken(value);
    case 'code-array':
      return isTokenArray(value, isCodeToken);
    case 'conformance-counts':
      return isConformanceCounts(value);
    case 'digest':
      return isDigest(value);
    case 'identifier':
    case 'version':
      return isSystemToken(value);
    case 'identifier-array':
      return isTokenArray(value, isSystemToken);
    case 'nullable-identifier':
      return value === null || isSystemToken(value);
    case 'nullable-prose':
      return value === null || isProse(value);
    case 'nullable-timestamp':
      return value === null || isTimestamp(value);
    case 'prose':
      return isProse(value);
    case 'ratio':
      return isRatio(value);
    case 'semantic-fingerprint':
      return isSemanticFingerprint(value);
    case 'timestamp':
      return isTimestamp(value);
    case 'uint32':
      return isUint32(value);
  }
}

function isDeepAlignmentSharedBackboneStem(
  stem: DeepAlignmentEventStem,
): stem is DeepAlignmentSharedBackboneStem {
  return Object.prototype.hasOwnProperty.call(
    DEEP_ALIGNMENT_SHARED_REVIEW_BACKBONE,
    stem,
  );
}

function sharedReviewScope(
  reviewStem: DeepReviewEventStem,
  scope: Record<string, unknown>,
): JsonObject {
  const base = {
    runId: scope.runId as string,
    sessionId: scope.sessionId as string,
  };
  if (reviewStem === 'deep_review.run_initialized'
    || reviewStem === 'deep_review.run_resumed'
    || reviewStem === 'deep_review.run_restarted') {
    return { ...base, generation: scope.generation as number };
  }
  if (reviewStem === 'deep_review.protocol_plan_recorded') {
    return { ...base, protocolId: scope.protocolId as string };
  }
  if (reviewStem === 'deep_review.synthesis_started'
    || reviewStem === 'deep_review.review_report_committed') {
    return { ...base, reportRevisionId: scope.reportRevisionId as string };
  }
  if (reviewStem === 'deep_review.finding_lineage_recorded'
    || reviewStem === 'deep_review.finding_state_changed') {
    return {
      ...base,
      generation: scope.generation as number,
      iterationId: scope.iterationId as string,
      dimensionId: scope.dimensionId as string,
      findingId: scope.findingId as string,
    };
  }
  if (reviewStem === 'deep_review.dimension_pass_started'
    || reviewStem === 'deep_review.dimension_pass_completed'
    || reviewStem === 'deep_review.recovery_started') {
    return {
      ...base,
      generation: scope.generation as number,
      iterationId: scope.iterationId as string,
      dimensionId: scope.dimensionId as string,
    };
  }
  if (reviewStem === 'deep_review.convergence_evaluated'
    || reviewStem === 'deep_review.graph_convergence_evaluated'
    || reviewStem === 'deep_review.blocked_stop_recorded'
    || reviewStem === 'deep_review.pause_recorded') {
    return {
      ...base,
      generation: scope.generation as number,
      iterationId: scope.iterationId as string,
    };
  }
  return base;
}

const validateSharedReviewPayload = createDeepReviewLedgerPayload as unknown as (
  stem: DeepReviewEventStem,
  scope: DeepReviewScopeMap[DeepReviewEventStem],
  prevEventHash: string,
  replay: DeepReviewReplayMetadata,
  data: DeepReviewPayloadMap[DeepReviewEventStem],
) => unknown;

function isSharedBackboneData(
  stem: DeepAlignmentSharedBackboneStem,
  scope: Record<string, unknown>,
  prevEventHash: string,
  replay: DeepAlignmentReplayMetadata,
  data: unknown,
): boolean {
  const reviewStem = DEEP_ALIGNMENT_SHARED_REVIEW_BACKBONE[stem];
  try {
    validateSharedReviewPayload(
      reviewStem,
      sharedReviewScope(reviewStem, scope) as DeepReviewScopeMap[DeepReviewEventStem],
      prevEventHash,
      replay as DeepReviewReplayMetadata,
      data as DeepReviewPayloadMap[DeepReviewEventStem],
    );
    return true;
  } catch {
    return false;
  }
}

function arraysAreDisjoint(arrays: readonly string[][]): boolean {
  const seen = new Set<string>();
  for (const values of arrays) {
    for (const value of values) {
      if (seen.has(value)) return false;
      seen.add(value);
    }
  }
  return seen.size > 0;
}

function isExtensionData(stem: DeepAlignmentExtensionStem, value: unknown): boolean {
  if (!isObject(value) || hasForbiddenMutableField(value)) return false;
  const rules = DATA_FIELD_RULES[stem];
  if (!hasExactFields(value, Object.keys(rules))) return false;
  if (!Object.entries(rules).every(([field, rule]) => (
    isFieldValue(rule, value[field])
  ))) return false;

  if (stem === 'deep_alignment.authority_validation_recorded') {
    const checks = value.checks as Record<string, unknown>;
    const allPass = VALIDATION_CHECK_FIELDS.slice(0, -1).every(
      (field) => checks[field] === 'pass',
    );
    return value.authorityStatus === 'valid'
      ? allPass && value.blockedReasonCode === null
      : !allPass && value.blockedReasonCode !== null;
  }
  if (stem === 'deep_alignment.authority_epoch_compatibility_recorded') {
    return value.sourceAuthorityEpochId !== value.targetAuthorityEpochId
      && (value.ambiguous !== true && value.lossy !== true
        || value.compatibilityClass === 'blocked')
      && (value.compatibilityClass !== 'migrate'
        || (value.orderedUpcastPath as unknown[]).length > 0);
  }
  if (stem === 'deep_alignment.lane_plan_recorded') {
    return (value.orderedRuleIds as unknown[]).length > 0
      && (value.requiredEvidenceClasses as unknown[]).length > 0;
  }
  if (stem === 'deep_alignment.subject_snapshot_bound') {
    return value.parentSnapshotRef === null
      || value.parentSnapshotRef !== value.subjectSnapshotRef;
  }
  if (stem === 'deep_alignment.lane_completed') {
    return value.status === 'complete'
      ? value.blockedReasonCode === null
      : value.blockedReasonCode !== null;
  }
  if (stem === 'deep_alignment.applicability_evaluated') {
    return (value.targetFactRefs as unknown[]).length > 0;
  }
  if (stem === 'deep_alignment.observation_recorded') {
    return (value.receiptRefs as unknown[]).length > 0;
  }
  if (stem === 'deep_alignment.observation_reconciled') {
    return value.observationEventId !== value.predecessorObservationEventId
      && (value.evidenceReceiptRefs as unknown[]).length > 0;
  }
  if (stem === 'deep_alignment.finding_candidate_emitted') {
    return (value.evidenceReceiptRefs as unknown[]).length > 0
      && value.detectorFingerprint !== value.scorerFingerprint;
  }
  if (stem === 'deep_alignment.finding_verification_recorded') {
    const proofRequired = value.result === 'confirmed' || value.result === 'disproved';
    return (value.evidenceReceiptRefs as unknown[]).length > 0
      && (!proofRequired || (value.proofWitnessRefs as unknown[]).length > 0);
  }
  if (stem === 'deep_alignment.proof_witness_recorded') {
    return (value.receiptRefs as unknown[]).length > 0;
  }
  if (stem === 'deep_alignment.claim_adjudication_recorded') {
    const severityBearing = ['P0', 'P1', 'P2'].includes(String(value.finalSeverity));
    if (severityBearing) {
      return value.outcome === 'accepted'
        && value.transition === 'candidate-to-finding'
        && (value.evidenceReceiptRefs as unknown[]).length > 0
        && (value.proofWitnessRefs as unknown[]).length > 0;
    }
    return value.transition !== 'candidate-to-finding';
  }
  if (stem === 'deep_alignment.conformance_assessment_recorded') {
    const applicability = String(value.applicabilityOutcome);
    const status = String(value.conformanceStatus);
    if (applicability === 'not_applicable') return status === 'not_applicable';
    if (applicability === 'blocked') return status === 'blocked';
    if (applicability === 'unresolved') {
      return ['blocked', 'inconclusive', 'untested'].includes(status);
    }
    return status !== 'not_applicable'
      && (status !== 'non_conformant'
        || (value.proofWitnessRefs as unknown[]).length > 0
          && (value.evidenceReceiptRefs as unknown[]).length > 0);
  }
  if (stem === 'deep_alignment.known_deviation_recorded') {
    return (value.invalidationConditionRefs as unknown[]).length > 0;
  }
  if (stem === 'deep_alignment.known_deviation_invalidated') {
    return (value.invalidationEvidenceRefs as unknown[]).length > 0
      && value.reactivatedFindingEventId !== null;
  }
  if (stem === 'deep_alignment.applicability_coverage_recorded') {
    return (value.declaredApplicabilityEdgeRefs as unknown[]).length > 0
      && arraysAreDisjoint([
        value.applicableRuleIds as string[],
        value.notApplicableRuleIds as string[],
        value.unresolvedRuleIds as string[],
        value.untestedRuleIds as string[],
        value.blockedRuleIds as string[],
      ]);
  }
  if (stem === 'deep_alignment.authority_witness_replayed') {
    const compatibility = String(value.compatibilityClass);
    const outcome = String(value.replayOutcome);
    return value.sourceAuthorityEpochId !== value.targetAuthorityEpochId
      && (value.affectedRuleIds as unknown[]).length > 0
      && (compatibility === 'blocked' || compatibility === 'pin-old-runtime'
        ? outcome === 'blocked'
        : compatibility === 'degraded'
          ? outcome === 'degraded'
          : outcome === 'accepted');
  }
  return true;
}

function digestPayloadInput(
  stem: DeepAlignmentEventStem,
  scope: JsonObject,
  prevEventHash: string,
  replay: JsonObject,
  data: JsonObject,
): string {
  return sha256Bytes(canonicalBytes({
    stem,
    eventVersion: DEEP_ALIGNMENT_EVENT_VERSION,
    scope,
    prevEventHash,
    replay,
    data,
  }));
}

function isPayload(stem: DeepAlignmentEventStem, payload: Readonly<JsonObject>): boolean {
  if (!hasExactFields(payload, DEEP_ALIGNMENT_MODE_PAYLOAD_FIELDS)
    || !isDeepAlignmentEventStem(payload.stem)
    || payload.stem !== stem
    || payload.eventVersion !== DEEP_ALIGNMENT_EVENT_VERSION
    || !isScope(stem, payload.scope)
    || !isDigest(payload.prevEventHash)
    || !isReplayMetadata(payload.replay)
    || !isObject(payload.data)) return false;
  const dataValid = isDeepAlignmentSharedBackboneStem(stem)
    ? isSharedBackboneData(
      stem,
      payload.scope as Record<string, unknown>,
      payload.prevEventHash,
      payload.replay as unknown as DeepAlignmentReplayMetadata,
      payload.data,
    )
    : isExtensionData(stem, payload.data);
  if (!dataValid) return false;
  return payload.payloadDigest === digestPayloadInput(
    stem,
    payload.scope as JsonObject,
    payload.prevEventHash,
    payload.replay as JsonObject,
    payload.data as JsonObject,
  );
}

function validatePayloadParts<TStem extends DeepAlignmentEventStem>(
  stem: TStem,
  scope: DeepAlignmentScopeMap[TStem],
  prevEventHash: string,
  replay: DeepAlignmentReplayMetadata,
  data: DeepAlignmentPayloadMap[TStem],
): boolean {
  if (!isScope(stem, scope)
    || !isDigest(prevEventHash)
    || !isReplayMetadata(replay)) return false;
  return isDeepAlignmentSharedBackboneStem(stem)
    ? isSharedBackboneData(
      stem,
      scope,
      prevEventHash,
      replay,
      data,
    )
    : isExtensionData(stem, data);
}

// ───────────────────────────────────────────────────────────────────
// 4. REGISTRY AND EVENT PREPARATION
// ───────────────────────────────────────────────────────────────────

function eventDefinition(stem: DeepAlignmentEventStem): EventTypeDefinition {
  return {
    eventType: DeepAlignmentWireEventTypes[stem],
    currentVersion: DEEP_ALIGNMENT_EVENT_VERSION,
    versions: [{
      version: DEEP_ALIGNMENT_EVENT_VERSION,
      payload: {
        requiredFields: DEEP_ALIGNMENT_MODE_PAYLOAD_FIELDS,
        validate: (payload) => isPayload(stem, payload),
      },
    }],
    upcasters: [],
  };
}

export function createDeepAlignmentEventRegistry(): EventTypeRegistry {
  return new EventTypeRegistry(DeepAlignmentEventStems.map(eventDefinition));
}

export function createDeepAlignmentLedgerPayload<TStem extends DeepAlignmentEventStem>(
  stem: TStem,
  scope: DeepAlignmentScopeMap[TStem],
  prevEventHash: string,
  replay: DeepAlignmentReplayMetadata,
  data: DeepAlignmentPayloadMap[TStem],
): DeepAlignmentLedgerPayload<TStem> {
  if (!validatePayloadParts(stem, scope, prevEventHash, replay, data)) {
    throw new TypeError(`Invalid closed-shape payload for ${stem}`);
  }
  const payloadDigest = digestPayloadInput(
    stem,
    scope,
    prevEventHash,
    replay,
    data,
  );
  return Object.freeze({
    stem,
    eventVersion: DEEP_ALIGNMENT_EVENT_VERSION,
    scope,
    prevEventHash,
    payloadDigest,
    replay,
    data,
  }) as DeepAlignmentLedgerPayload<TStem>;
}

export function prepareDeepAlignmentEvent<TStem extends DeepAlignmentEventStem>(
  input: DeepAlignmentEventInput<TStem>,
  registry: EventTypeRegistry,
): EventWritePreflight {
  const payload = createDeepAlignmentLedgerPayload(
    input.stem,
    input.scope,
    input.prevEventHash,
    input.replay,
    input.data,
  );
  const envelope: DeepAlignmentEventEnvelope<TStem> = {
    envelope_version: CURRENT_ENVELOPE_VERSION,
    event_id: input.eventId,
    event_type: DeepAlignmentWireEventTypes[input.stem],
    event_version: DEEP_ALIGNMENT_EVENT_VERSION,
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

export function deepAlignmentEventDefinitions(): readonly EventTypeDefinition[] {
  return Object.freeze(DeepAlignmentEventStems.map(eventDefinition));
}

export function deepAlignmentPayloadDigest<TStem extends DeepAlignmentEventStem>(
  payload: Readonly<{
    stem: TStem;
    eventVersion: 1;
    scope: DeepAlignmentScopeMap[TStem];
    prevEventHash: string;
    replay: DeepAlignmentReplayMetadata;
    data: DeepAlignmentPayloadMap[TStem];
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

export function isDeepAlignmentEventStem(
  value: JsonValue,
): value is DeepAlignmentEventStem {
  return typeof value === 'string'
    && (DeepAlignmentEventStems as readonly string[]).includes(value);
}

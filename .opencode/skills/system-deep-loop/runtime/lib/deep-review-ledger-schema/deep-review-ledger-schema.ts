// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Review Ledger Schema
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
  DeepReviewEventStems,
  DeepReviewWireEventTypes,
} from './deep-review-ledger-types.js';

import type {
  EventProducer,
  EventTypeDefinition,
  EventWritePreflight,
  JsonObject,
  JsonValue,
} from '../event-envelope/index.js';
import type {
  DeepReviewEventEnvelope,
  DeepReviewEventStem,
  DeepReviewLedgerPayload,
  DeepReviewPayloadMap,
  DeepReviewReplayMetadata,
  DeepReviewScopeMap,
} from './deep-review-ledger-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. PUBLIC INPUTS
// ───────────────────────────────────────────────────────────────────

export interface DeepReviewEventInput<TStem extends DeepReviewEventStem> {
  readonly stem: TStem;
  readonly scope: DeepReviewScopeMap[TStem];
  readonly prevEventHash: string;
  readonly replay: DeepReviewReplayMetadata;
  readonly data: DeepReviewPayloadMap[TStem];
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

export const DEEP_REVIEW_EVENT_VERSION = 1 as const;

export const DEEP_REVIEW_SHARED_ENVELOPE_FIELDS = Object.freeze([
  ...EVENT_ENVELOPE_FIELDS,
] as const);

export const DEEP_REVIEW_MODE_PAYLOAD_FIELDS = Object.freeze([
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
  | 'convergence-signals'
  | 'digest'
  | 'digest-array'
  | 'evidence-locator'
  | 'finding-counts'
  | 'gate-results'
  | 'identifier'
  | 'identifier-array'
  | 'null'
  | 'nullable-identifier'
  | 'nullable-prose'
  | 'prose'
  | 'ratio'
  | 'report-section-manifest'
  | 'run-completion-counts'
  | 'semantic-fingerprint'
  | 'source-event-range'
  | 'target-reference'
  | 'target-reference-array'
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
  'blocked', 'compatible', 'exact', 'migrate', 'pin-old-runtime',
);
const SEVERITY_RULE = enumRule('none', 'P0', 'P1', 'P2');
const CONVERGENCE_DECISION_RULE = enumRule(
  'blocked', 'continue', 'converged', 'incomplete', 'recover',
);

const DATA_FIELD_RULES = Object.freeze({
  'deep_review.run_initialized': {
    target: 'target-reference',
    lineageMode: enumRule('fresh', 'restart', 'resume'),
    maxIterations: 'uint32',
    convergencePolicyVersion: 'version',
    reviewModeContractDigest: 'digest',
    initialReleaseReadinessState: enumRule('blocked', 'not-assessed', 'ready'),
  },
  'deep_review.run_resumed': {
    priorTailDigest: 'digest',
    sourceSessionId: 'identifier',
    resumeReason: 'prose',
    continuedFromRunId: 'identifier',
    compatibilityDecision: COMPATIBILITY_RULE,
    recoveryReceiptRef: 'identifier',
  },
  'deep_review.run_restarted': {
    priorTailDigest: 'digest',
    archivedLineageId: 'identifier',
    restartReason: 'prose',
    continuedFromRunId: 'identifier',
    compatibilityDecision: COMPATIBILITY_RULE,
    recoveryReceiptRef: 'identifier',
  },
  'deep_review.scope_resolved': {
    targetSetDigest: 'digest',
    scopeClass: enumRule('bounded', 'repository', 'targeted'),
    selectedTargets: 'target-reference-array',
    omittedHighRiskTargetRefs: 'identifier-array',
    discoveryMethodIds: 'code-array',
    scopeEvidenceRefs: 'identifier-array',
  },
  'deep_review.dimension_ordered': {
    orderedDimensionIds: 'identifier-array',
    riskRationale: 'prose',
    scopeEvidenceRefs: 'identifier-array',
    orderingPolicyVersion: 'version',
  },
  'deep_review.protocol_plan_recorded': {
    coreProtocolIds: 'identifier-array',
    overlayProtocolIds: 'identifier-array',
    applicability: enumRule('applicable', 'conditional', 'not-applicable'),
    gateClass: enumRule('blocking', 'informational', 'required'),
    contractVersion: 'version',
    plannedEvidenceSourceRefs: 'identifier-array',
    protocolPlanDigest: 'digest',
  },
  'deep_review.dimension_pass_started': {
    passNumber: 'uint32',
    targetRefs: 'identifier-array',
    filesReviewed: 'identifier-array',
    searchCoverageDigest: 'digest',
    passStatus: enumRule('started'),
    nextFocusRef: 'identifier',
  },
  'deep_review.dimension_pass_completed': {
    passNumber: 'uint32',
    targetRefs: 'identifier-array',
    filesReviewed: 'identifier-array',
    searchCoverageDigest: 'digest',
    passStatus: enumRule('blocked', 'complete', 'incomplete'),
    rawFindingCounts: 'finding-counts',
    nextFocusRef: 'identifier',
  },
  'deep_review.finding_candidate_emitted': {
    targetRefs: 'identifier-array',
    evidenceRefs: 'identifier-array',
    claimTextDigest: 'digest',
    findingClass: 'code',
    impact: 'ratio',
    rawConfidence: 'ratio',
    rawCandidateScore: 'ratio',
    actionability: 'ratio',
    reachability: 'ratio',
    exploitability: 'ratio',
    evidenceType: enumRule('analyzer', 'inspection', 'runtime', 'test'),
    evidenceScope: enumRule('direct', 'indirect', 'partial'),
    rawObservationDigest: 'digest',
    semanticFingerprint: 'semantic-fingerprint',
    sourcePassEventId: 'identifier',
  },
  'deep_review.evidence_observed': {
    locator: 'evidence-locator',
    observationKind: enumRule(
      'analyzer-output', 'inspection', 'runtime-witness', 'test-result',
    ),
    rawResultDigest: 'digest',
    sourceDigest: 'digest',
    contentDigest: 'digest',
    toolFingerprint: 'digest',
    analyzerFingerprint: 'digest',
    independentEvidenceClass: 'code',
    causalProximityStatus: enumRule('direct', 'indirect', 'unknown'),
    stabilityStatus: enumRule('stable', 'unstable', 'unknown'),
    relevanceStatus: enumRule('irrelevant', 'relevant', 'unknown'),
    supersedesEvidenceEventId: 'null',
  },
  'deep_review.evidence_reconciled': {
    locator: 'evidence-locator',
    observationKind: enumRule(
      'analyzer-output', 'inspection', 'runtime-witness', 'test-result',
    ),
    rawResultDigest: 'digest',
    sourceDigest: 'digest',
    contentDigest: 'digest',
    toolFingerprint: 'digest',
    analyzerFingerprint: 'digest',
    independentEvidenceClass: 'code',
    causalProximityStatus: enumRule('direct', 'indirect', 'unknown'),
    stabilityStatus: enumRule('stable', 'unstable', 'unknown'),
    relevanceStatus: enumRule('irrelevant', 'relevant', 'unknown'),
    supersedesEvidenceEventId: 'identifier',
    reconciliationOutcome: enumRule('confirmed', 'contradicted', 'degraded', 'superseded'),
    evidenceSetDigest: 'digest',
  },
  'deep_review.claim_adjudication_recorded': {
    claimDigest: 'digest',
    evidenceRefs: 'identifier-array',
    counterevidenceSoughtRefs: 'identifier-array',
    alternativeExplanationDigest: 'digest',
    finalSeverity: SEVERITY_RULE,
    impact: 'ratio',
    confidence: 'ratio',
    downgradeTrigger: enumRule('confidence-floor', 'counterevidence', 'none', 'scope-limited'),
    transition: enumRule(
      'candidate-to-finding', 'candidate-to-rejected', 'finding-reaffirmed',
    ),
    validatorFingerprint: 'digest',
    adjudicationOutcome: enumRule('accepted', 'deferred', 'disproved', 'rejected'),
    predecessorAdjudicationEventId: 'nullable-identifier',
  },
  'deep_review.finding_lineage_recorded': {
    priorFingerprint: 'semantic-fingerprint',
    currentFingerprint: 'semantic-fingerprint',
    lineageRelation: enumRule(
      'absent', 'disproved', 'fixed', 'introduced', 'preexisting', 'unchanged', 'updated',
    ),
    baselineStatus: enumRule('absent', 'present', 'unknown'),
    evidenceSetDigest: 'digest',
    predecessorEventRef: 'identifier',
  },
  'deep_review.finding_state_changed': {
    priorFingerprint: 'semantic-fingerprint',
    currentFingerprint: 'semantic-fingerprint',
    priorState: enumRule('accepted', 'adjudicated', 'candidate', 'dismissed', 'fixed'),
    currentState: enumRule('accepted', 'adjudicated', 'candidate', 'dismissed', 'fixed'),
    priorSeverity: SEVERITY_RULE,
    currentSeverity: SEVERITY_RULE,
    adjudicationEventId: 'identifier',
    adjudicationPayloadDigest: 'digest',
    changeReason: 'prose',
    evidenceSetDigest: 'digest',
    predecessorEventRef: 'identifier',
  },
  'deep_review.review_depth_recorded': {
    reviewDepthSchemaVersion: 'version',
    applicability: enumRule('applicable', 'conditional', 'not-applicable'),
    targetSelectionDigest: 'digest',
    requiredBugClasses: 'code-array',
    coveredBugClasses: 'code-array',
    ruledOutBugClasses: 'code-array',
    deferredBugClasses: 'code-array',
    blockedBugClasses: 'code-array',
    searchLedgerRowDigests: 'digest-array',
    graphStatus: enumRule('available', 'degraded', 'unavailable'),
    semanticSearchStatus: enumRule('available', 'degraded', 'unavailable'),
  },
  'deep_review.convergence_evaluated': {
    rawSignals: 'convergence-signals',
    weightedSignals: 'convergence-signals',
    dimensionCoverageDigest: 'digest',
    protocolCoverageDigest: 'digest',
    findingStability: enumRule('stable', 'unstable', 'unknown'),
    p0p1ResolutionState: enumRule('blocked', 'resolved', 'unknown'),
    evidenceDensity: 'ratio',
    hotspotSaturation: 'ratio',
    decision: CONVERGENCE_DECISION_RULE,
    policyFingerprint: 'digest',
    blockerIds: 'identifier-array',
    stopCandidate: 'boolean',
  },
  'deep_review.graph_convergence_evaluated': {
    rawSignals: 'convergence-signals',
    weightedSignals: 'convergence-signals',
    dimensionCoverageDigest: 'digest',
    protocolCoverageDigest: 'digest',
    findingStability: enumRule('stable', 'unstable', 'unknown'),
    p0p1ResolutionState: enumRule('blocked', 'resolved', 'unknown'),
    evidenceDensity: 'ratio',
    hotspotSaturation: 'ratio',
    decision: CONVERGENCE_DECISION_RULE,
    policyFingerprint: 'digest',
    blockerIds: 'identifier-array',
    stopCandidate: 'boolean',
    graphDecision: enumRule('blocked', 'continue', 'converged', 'unavailable'),
    graphDigest: 'digest',
  },
  'deep_review.blocked_stop_recorded': {
    blockedGateIds: 'identifier-array',
    gateResults: 'gate-results',
    activeFindingCounts: 'finding-counts',
    recoveryStrategy: 'code',
    targetDimensionId: 'identifier',
    originatingConvergenceEventId: 'identifier',
    appendPosition: 'uint32',
  },
  'deep_review.pause_recorded': {
    normalizedStopReason: 'code',
    sentinelCause: 'code',
    fromIterationId: 'identifier',
    strategy: 'code',
    targetDimensionId: 'nullable-identifier',
    outcome: enumRule('paused'),
    lineageRef: 'identifier',
    priorTailDigest: 'digest',
  },
  'deep_review.recovery_started': {
    normalizedStopReason: 'code',
    recoveryCause: 'code',
    fromIterationId: 'identifier',
    strategy: 'code',
    targetDimensionId: 'identifier',
    outcome: enumRule('recovery-started'),
    lineageRef: 'identifier',
    priorTailDigest: 'digest',
    originatingPauseEventId: 'identifier',
  },
  'deep_review.synthesis_started': {
    finalizedEventRange: 'source-event-range',
    findingRegistryInputDigest: 'digest',
    deduplicationPolicyDigest: 'digest',
    verdictInputDigests: 'digest-array',
    unresolvedFindingIds: 'identifier-array',
    deferredFindingIds: 'identifier-array',
  },
  'deep_review.review_report_committed': {
    finalizedEventRange: 'source-event-range',
    findingRegistryInputDigest: 'digest',
    deduplicationPolicyDigest: 'digest',
    verdictInputDigests: 'digest-array',
    unresolvedFindingIds: 'identifier-array',
    deferredFindingIds: 'identifier-array',
    reportDigest: 'digest',
    sectionManifest: 'report-section-manifest',
    reportReceiptRef: 'identifier',
  },
  'deep_review.continuity_save_requested': {
    targetPacket: 'identifier',
    continuityPayloadDigest: 'digest',
    sourceEventRange: 'source-event-range',
    route: 'code',
    mergeMode: 'code',
  },
  'deep_review.continuity_save_completed': {
    targetPacket: 'identifier',
    continuityPayloadDigest: 'digest',
    sourceEventRange: 'source-event-range',
    route: 'code',
    mergeMode: 'code',
    persistenceReceiptRefs: 'identifier-array',
    continuityFingerprint: 'digest',
  },
  'deep_review.continuity_save_failed': {
    targetPacket: 'identifier',
    continuityPayloadDigest: 'digest',
    sourceEventRange: 'source-event-range',
    route: 'code',
    mergeMode: 'code',
    retryable: 'boolean',
    failureReasonCode: 'code',
  },
  'deep_review.run_completed': {
    terminalStatus: enumRule('blocked', 'completed', 'incomplete'),
    convergenceEventId: 'identifier',
    synthesisEventId: 'identifier',
    reportEventId: 'identifier',
    continuityEventId: 'identifier',
    finalLedgerTailHash: 'digest',
    counts: 'run-completion-counts',
    verdict: enumRule('blocked', 'fail', 'incomplete', 'pass'),
    completionReason: 'nullable-prose',
    incompleteReason: 'nullable-prose',
  },
} as const satisfies Readonly<
  Record<DeepReviewEventStem, Readonly<Record<string, DataFieldRule>>>
>);

const SCOPE_FIELDS = Object.freeze({
  'deep_review.run_initialized': ['runId', 'sessionId', 'generation'],
  'deep_review.run_resumed': ['runId', 'sessionId', 'generation'],
  'deep_review.run_restarted': ['runId', 'sessionId', 'generation'],
  'deep_review.scope_resolved': ['runId', 'sessionId'],
  'deep_review.dimension_ordered': ['runId', 'sessionId'],
  'deep_review.protocol_plan_recorded': ['runId', 'sessionId', 'protocolId'],
  'deep_review.dimension_pass_started': [
    'runId', 'sessionId', 'generation', 'iterationId', 'dimensionId',
  ],
  'deep_review.dimension_pass_completed': [
    'runId', 'sessionId', 'generation', 'iterationId', 'dimensionId',
  ],
  'deep_review.finding_candidate_emitted': [
    'runId', 'sessionId', 'generation', 'iterationId', 'dimensionId', 'candidateId',
  ],
  'deep_review.evidence_observed': [
    'runId', 'sessionId', 'generation', 'iterationId', 'dimensionId',
    'candidateId', 'evidenceId',
  ],
  'deep_review.evidence_reconciled': [
    'runId', 'sessionId', 'generation', 'iterationId', 'dimensionId',
    'candidateId', 'evidenceId',
  ],
  'deep_review.claim_adjudication_recorded': [
    'runId', 'sessionId', 'generation', 'iterationId', 'dimensionId',
    'candidateId', 'findingId',
  ],
  'deep_review.finding_lineage_recorded': [
    'runId', 'sessionId', 'generation', 'iterationId', 'dimensionId', 'findingId',
  ],
  'deep_review.finding_state_changed': [
    'runId', 'sessionId', 'generation', 'iterationId', 'dimensionId', 'findingId',
  ],
  'deep_review.review_depth_recorded': [
    'runId', 'sessionId', 'generation', 'iterationId',
  ],
  'deep_review.convergence_evaluated': [
    'runId', 'sessionId', 'generation', 'iterationId',
  ],
  'deep_review.graph_convergence_evaluated': [
    'runId', 'sessionId', 'generation', 'iterationId',
  ],
  'deep_review.blocked_stop_recorded': [
    'runId', 'sessionId', 'generation', 'iterationId',
  ],
  'deep_review.pause_recorded': [
    'runId', 'sessionId', 'generation', 'iterationId',
  ],
  'deep_review.recovery_started': [
    'runId', 'sessionId', 'generation', 'iterationId', 'dimensionId',
  ],
  'deep_review.synthesis_started': ['runId', 'sessionId', 'reportRevisionId'],
  'deep_review.review_report_committed': ['runId', 'sessionId', 'reportRevisionId'],
  'deep_review.continuity_save_requested': ['runId', 'sessionId'],
  'deep_review.continuity_save_completed': ['runId', 'sessionId'],
  'deep_review.continuity_save_failed': ['runId', 'sessionId'],
  'deep_review.run_completed': ['runId', 'sessionId'],
} as const satisfies Readonly<Record<DeepReviewEventStem, readonly string[]>>);

const HASH_PATTERN = /^[a-f0-9]{64}$/;
const SYSTEM_TOKEN_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:/@#-]{0,255}$/;
const CODE_TOKEN_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:/@-]{0,127}$/;
const LOCATOR_SELECTOR_PATTERN = /^[^\u0000-\u001f\u007f\r\n]{1,256}$/u;
const MAX_LOCATOR_SELECTOR_SPACES = 16;
const MAX_PROSE_LENGTH = 4_096;
const FINGERPRINT_FIELDS = Object.freeze([
  'algorithmVersion',
  'semanticAnchorDigest',
  'normalizedContextDigest',
  'programSliceDigest',
  'renameMapVersion',
  'baselineState',
] as const);
const SIGNAL_FIELDS = Object.freeze([
  'noveltyRatio',
  'coverageRatio',
  'findingStabilityRatio',
  'evidenceDensityRatio',
  'hotspotSaturationRatio',
  'observationDigest',
] as const);
const FORBIDDEN_MUTABLE_FIELDS = new Set([
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
  'text',
  'transcript',
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

function isDigest(value: unknown): value is string {
  return typeof value === 'string' && HASH_PATTERN.test(value);
}

function isLocatorSelector(value: unknown): value is string {
  return typeof value === 'string'
    && value.trim().length > 0
    && LOCATOR_SELECTOR_PATTERN.test(value)
    && (value.match(/\s/gu)?.length ?? 0) <= MAX_LOCATOR_SELECTOR_SPACES;
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

function isTargetReference(value: unknown): boolean {
  return isObject(value)
    && hasExactFields(
      value,
      ['targetId', 'targetType', 'artifactRef', 'sourceDigest', 'contentDigest'],
    )
    && isSystemToken(value.targetId)
    && ['artifact', 'directory', 'file', 'repository', 'symbol'].includes(
      String(value.targetType),
    )
    && isSystemToken(value.artifactRef)
    && isDigest(value.sourceDigest)
    && isDigest(value.contentDigest);
}

function isEvidenceLocator(value: unknown): boolean {
  if (!isObject(value) || !hasExactFields(value, [
    'scheme',
    'artifactRef',
    'locatorDigest',
    'selector',
    'startLine',
    'endLine',
    'revision',
  ])) return false;
  if (!['artifact', 'file', 'other'].includes(String(value.scheme))
    || !isSystemToken(value.artifactRef)
    || !isDigest(value.locatorDigest)
    || !isLocatorSelector(value.selector)
    || !(value.revision === null || isSystemToken(value.revision))) return false;
  if (value.startLine === null || value.endLine === null) {
    return value.startLine === null && value.endLine === null;
  }
  return isUint32(value.startLine)
    && isUint32(value.endLine)
    && value.startLine > 0
    && value.startLine <= value.endLine;
}

function isSemanticFingerprint(value: unknown): boolean {
  return isObject(value)
    && hasExactFields(value, FINGERPRINT_FIELDS)
    && isSystemToken(value.algorithmVersion)
    && isDigest(value.semanticAnchorDigest)
    && isDigest(value.normalizedContextDigest)
    && isDigest(value.programSliceDigest)
    && isSystemToken(value.renameMapVersion)
    && ['absent', 'present', 'unknown'].includes(String(value.baselineState));
}

function isConvergenceSignals(value: unknown): boolean {
  return isObject(value)
    && hasExactFields(value, SIGNAL_FIELDS)
    && SIGNAL_FIELDS.slice(0, 5).every((field) => isRatio(value[field]))
    && isDigest(value.observationDigest);
}

function isFindingCounts(value: unknown): boolean {
  return isObject(value)
    && hasExactFields(value, ['candidates', 'adjudicated', 'p0', 'p1', 'p2'])
    && Object.values(value).every(isUint32);
}

function isRunCompletionCounts(value: unknown): boolean {
  return isObject(value)
    && hasExactFields(
      value,
      ['dimensions', 'iterations', 'candidates', 'findings', 'evidence'],
    )
    && Object.values(value).every(isUint32);
}

function isGateResults(value: unknown): boolean {
  if (!Array.isArray(value) || value.length === 0) return false;
  const gateIds = new Set<string>();
  for (const result of value) {
    if (!isObject(result)
      || !hasExactFields(result, ['gateId', 'status', 'reasonCode', 'evidenceDigest'])
      || !isSystemToken(result.gateId)
      || !['fail', 'pass', 'unknown'].includes(String(result.status))
      || !isCodeToken(result.reasonCode)
      || !isDigest(result.evidenceDigest)
      || gateIds.has(result.gateId)) return false;
    gateIds.add(result.gateId);
  }
  return true;
}

function isSourceEventRange(value: unknown): boolean {
  return isObject(value)
    && hasExactFields(value, ['firstEventId', 'lastEventId'])
    && isSystemToken(value.firstEventId)
    && isSystemToken(value.lastEventId);
}

function isReportSectionManifest(value: unknown): boolean {
  return isObject(value)
    && hasExactFields(value, ['sectionIds', 'manifestDigest'])
    && isTokenArray(value.sectionIds, isSystemToken)
    && value.sectionIds.length > 0
    && isDigest(value.manifestDigest);
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

function isScope(stem: DeepReviewEventStem, value: unknown): boolean {
  if (!isObject(value)) return false;
  const required = SCOPE_FIELDS[stem];
  if (!hasExactFields(value, required)) return false;
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
    case 'boolean':
      return typeof value === 'boolean';
    case 'code':
      return isCodeToken(value);
    case 'code-array':
      return isTokenArray(value, isCodeToken);
    case 'convergence-signals':
      return isConvergenceSignals(value);
    case 'digest':
      return isDigest(value);
    case 'digest-array':
      return isTokenArray(value, isDigest);
    case 'evidence-locator':
      return isEvidenceLocator(value);
    case 'finding-counts':
      return isFindingCounts(value);
    case 'gate-results':
      return isGateResults(value);
    case 'identifier':
    case 'version':
      return isSystemToken(value);
    case 'identifier-array':
      return isTokenArray(value, isSystemToken);
    case 'null':
      return value === null;
    case 'nullable-identifier':
      return value === null || isSystemToken(value);
    case 'nullable-prose':
      return value === null || isProse(value);
    case 'prose':
      return isProse(value);
    case 'ratio':
      return isRatio(value);
    case 'report-section-manifest':
      return isReportSectionManifest(value);
    case 'run-completion-counts':
      return isRunCompletionCounts(value);
    case 'semantic-fingerprint':
      return isSemanticFingerprint(value);
    case 'source-event-range':
      return isSourceEventRange(value);
    case 'target-reference':
      return isTargetReference(value);
    case 'target-reference-array':
      return Array.isArray(value)
        && value.length > 0
        && value.every(isTargetReference);
    case 'uint32':
      return isUint32(value);
  }
}

function fingerprintsEqual(left: unknown, right: unknown): boolean {
  return isObject(left)
    && isObject(right)
    && sha256Bytes(canonicalBytes(left as JsonObject))
      === sha256Bytes(canonicalBytes(right as JsonObject));
}

function isData(stem: DeepReviewEventStem, value: unknown): boolean {
  if (!isObject(value) || hasForbiddenMutableField(value)) return false;
  const rules = DATA_FIELD_RULES[stem];
  const fields = Object.keys(rules);
  if (!hasExactFields(value, fields)) return false;
  if (!Object.entries(rules).every(([field, rule]) => (
    isFieldValue(rule, value[field])
  ))) return false;

  if (stem === 'deep_review.dimension_pass_started'
    || stem === 'deep_review.dimension_pass_completed') {
    return value.passNumber !== 0
      && (value.targetRefs as unknown[]).length > 0;
  }
  if (stem === 'deep_review.finding_candidate_emitted') {
    return (value.targetRefs as unknown[]).length > 0
      && (value.evidenceRefs as unknown[]).length > 0;
  }
  if (stem === 'deep_review.claim_adjudication_recorded') {
    const severityBearing = ['P0', 'P1', 'P2'].includes(String(value.finalSeverity));
    return (value.evidenceRefs as unknown[]).length > 0
      && (!severityBearing || value.adjudicationOutcome === 'accepted');
  }
  if (stem === 'deep_review.finding_lineage_recorded') {
    const relation = String(value.lineageRelation);
    const sameFingerprint = fingerprintsEqual(value.priorFingerprint, value.currentFingerprint);
    return ['unchanged', 'preexisting'].includes(relation)
      ? sameFingerprint
      : !sameFingerprint;
  }
  if (stem === 'deep_review.finding_state_changed') {
    return value.priorState !== value.currentState
      || value.priorSeverity !== value.currentSeverity;
  }
  if (stem === 'deep_review.blocked_stop_recorded') {
    return (value.blockedGateIds as unknown[]).length > 0
      && (value.gateResults as Array<Record<string, unknown>>).some(
        (result) => result.status === 'fail',
      )
      && value.appendPosition !== 0;
  }
  if (stem === 'deep_review.convergence_evaluated') {
    return value.decision !== 'blocked'
      || (value.blockerIds as unknown[]).length > 0;
  }
  if (stem === 'deep_review.graph_convergence_evaluated') {
    return (value.decision !== 'blocked'
      || (value.blockerIds as unknown[]).length > 0)
      && (value.graphDecision !== 'blocked'
        || (value.blockerIds as unknown[]).length > 0);
  }
  if (stem === 'deep_review.run_completed') {
    return value.terminalStatus === 'completed'
      ? value.completionReason !== null && value.incompleteReason === null
      : value.incompleteReason !== null;
  }
  return true;
}

function digestPayloadInput(
  stem: DeepReviewEventStem,
  scope: JsonObject,
  prevEventHash: string,
  replay: JsonObject,
  data: JsonObject,
): string {
  return sha256Bytes(canonicalBytes({
    stem,
    eventVersion: DEEP_REVIEW_EVENT_VERSION,
    scope,
    prevEventHash,
    replay,
    data,
  }));
}

function isPayload(stem: DeepReviewEventStem, payload: Readonly<JsonObject>): boolean {
  if (!hasExactFields(payload, DEEP_REVIEW_MODE_PAYLOAD_FIELDS)
    || !isDeepReviewEventStem(payload.stem)
    || payload.stem !== stem
    || payload.eventVersion !== DEEP_REVIEW_EVENT_VERSION) return false;
  if (!isScope(stem, payload.scope)
    || !isDigest(payload.prevEventHash)
    || !isReplayMetadata(payload.replay)
    || !isData(stem, payload.data)) return false;
  return payload.payloadDigest === digestPayloadInput(
    stem,
    payload.scope as JsonObject,
    payload.prevEventHash,
    payload.replay as JsonObject,
    payload.data as JsonObject,
  );
}

// ───────────────────────────────────────────────────────────────────
// 4. REGISTRY AND EVENT PREPARATION
// ───────────────────────────────────────────────────────────────────

function eventDefinition(stem: DeepReviewEventStem): EventTypeDefinition {
  return {
    eventType: DeepReviewWireEventTypes[stem],
    currentVersion: DEEP_REVIEW_EVENT_VERSION,
    versions: [{
      version: DEEP_REVIEW_EVENT_VERSION,
      payload: {
        requiredFields: DEEP_REVIEW_MODE_PAYLOAD_FIELDS,
        validate: (payload) => isPayload(stem, payload),
      },
    }],
    upcasters: [],
  };
}

export function createDeepReviewEventRegistry(): EventTypeRegistry {
  return new EventTypeRegistry(DeepReviewEventStems.map(eventDefinition));
}

export function createDeepReviewLedgerPayload<TStem extends DeepReviewEventStem>(
  stem: TStem,
  scope: DeepReviewScopeMap[TStem],
  prevEventHash: string,
  replay: DeepReviewReplayMetadata,
  data: DeepReviewPayloadMap[TStem],
): DeepReviewLedgerPayload<TStem> {
  if (!isScope(stem, scope)
    || !isDigest(prevEventHash)
    || !isReplayMetadata(replay)
    || !isData(stem, data)) {
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
    eventVersion: DEEP_REVIEW_EVENT_VERSION,
    scope,
    prevEventHash,
    payloadDigest,
    replay,
    data,
  }) as DeepReviewLedgerPayload<TStem>;
}

export function prepareDeepReviewEvent<TStem extends DeepReviewEventStem>(
  input: DeepReviewEventInput<TStem>,
  registry: EventTypeRegistry,
): EventWritePreflight {
  const payload = createDeepReviewLedgerPayload(
    input.stem,
    input.scope,
    input.prevEventHash,
    input.replay,
    input.data,
  );
  const envelope: DeepReviewEventEnvelope<TStem> = {
    envelope_version: CURRENT_ENVELOPE_VERSION,
    event_id: input.eventId,
    event_type: DeepReviewWireEventTypes[input.stem],
    event_version: DEEP_REVIEW_EVENT_VERSION,
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

export function deepReviewEventDefinitions(): readonly EventTypeDefinition[] {
  return Object.freeze(DeepReviewEventStems.map(eventDefinition));
}

export function deepReviewPayloadDigest<TStem extends DeepReviewEventStem>(
  payload: Readonly<{
    stem: TStem;
    eventVersion: 1;
    scope: DeepReviewScopeMap[TStem];
    prevEventHash: string;
    replay: DeepReviewReplayMetadata;
    data: DeepReviewPayloadMap[TStem];
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

export function isDeepReviewEventStem(value: JsonValue): value is DeepReviewEventStem {
  return typeof value === 'string'
    && (DeepReviewEventStems as readonly string[]).includes(value);
}

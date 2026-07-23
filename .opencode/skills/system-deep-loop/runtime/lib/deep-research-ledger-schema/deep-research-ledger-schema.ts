// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Research Ledger Schema
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
  DeepResearchEventStems,
  DeepResearchWireEventTypes,
} from './deep-research-ledger-types.js';

import type {
  EventProducer,
  EventTypeDefinition,
  EventWritePreflight,
  JsonObject,
  JsonValue,
} from '../event-envelope/index.js';
import type {
  DeepResearchEventEnvelope,
  DeepResearchEventStem,
  DeepResearchLedgerPayload,
  DeepResearchPayloadMap,
  DeepResearchReplayMetadata,
  DeepResearchScopeMap,
} from './deep-research-ledger-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. PUBLIC INPUTS
// ───────────────────────────────────────────────────────────────────

export interface DeepResearchEventInput<TStem extends DeepResearchEventStem> {
  readonly stem: TStem;
  readonly scope: DeepResearchScopeMap[TStem];
  readonly prevEventHash: string;
  readonly replay: DeepResearchReplayMetadata;
  readonly data: DeepResearchPayloadMap[TStem];
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

export const DEEP_RESEARCH_EVENT_VERSION = 1 as const;

export const DEEP_RESEARCH_SHARED_ENVELOPE_FIELDS = Object.freeze([
  ...EVENT_ENVELOPE_FIELDS,
] as const);

export const DEEP_RESEARCH_MODE_PAYLOAD_FIELDS = Object.freeze([
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
  | 'counts'
  | 'digest'
  | 'identifier'
  | 'identifier-array'
  | 'nullable-identifier'
  | 'nullable-prose'
  | 'passage-locators'
  | 'prose'
  | 'quality-gate-results'
  | 'ratio'
  | 'raw-signals'
  | 'reference'
  | 'reference-array'
  | 'score-vector'
  | 'source-event-range'
  | 'source-locator'
  | 'timestamp'
  | 'trusted-signals'
  | 'uint32'
  | 'version';

interface EnumFieldRule {
  readonly kind: 'enum';
  readonly values: readonly string[];
}

type DataFieldRule = DataFieldKind | EnumFieldRule;

const COMPATIBILITY_DECISION_RULE = Object.freeze({
  kind: 'enum',
  values: ['blocked', 'compatible', 'exact', 'migrate', 'pin-old-runtime'],
} as const);
const CONTAMINATION_STATUS_RULE = Object.freeze({
  kind: 'enum',
  values: ['clean', 'contaminated', 'suspected', 'unknown'],
} as const);
const CONVERGENCE_DECISION_RULE = Object.freeze({
  kind: 'enum',
  values: ['blocked', 'continue', 'converged', 'incomplete', 'recover'],
} as const);
const DISPOSITION_RULE = Object.freeze({
  kind: 'enum',
  values: ['admit', 'degrade', 'quarantine'],
} as const);
const GAP_KIND_RULE = Object.freeze({
  kind: 'enum',
  values: ['contradiction', 'coverage', 'source-diversity', 'verification'],
} as const);
const INSTRUCTION_SCAN_RESULT_RULE = Object.freeze({
  kind: 'enum',
  values: ['clean', 'flagged', 'unknown'],
} as const);
const ITERATION_COMPLETION_STATUS_RULE = Object.freeze({
  kind: 'enum',
  values: ['complete', 'error', 'insight', 'stuck', 'thought', 'timeout'],
} as const);
const ITERATION_STARTED_STATUS_RULE = Object.freeze({
  kind: 'enum',
  values: ['started'],
} as const);
const CLAIM_STATUS_RULE = Object.freeze({
  kind: 'enum',
  values: ['contested', 'supported', 'unresolved'],
} as const);
const RELATION_RULE = Object.freeze({
  kind: 'enum',
  values: ['contextualizes', 'contradicts', 'qualifies', 'supports'],
} as const);
const TERMINAL_STATUS_RULE = Object.freeze({
  kind: 'enum',
  values: ['blocked', 'completed', 'incomplete'],
} as const);

const DATA_FIELD_RULES = Object.freeze({
  'deep_research.run_initialized': {
    generation: 'uint32',
    charterDigest: 'digest',
    configDigest: 'digest',
    executorFingerprint: 'digest',
    replayFingerprint: 'digest',
    maxIterations: 'uint32',
    convergencePolicyVersion: 'version',
  },
  'deep_research.run_resumed': {
    priorTailDigest: 'digest',
    sourceLineageId: 'identifier',
    resumeReason: 'prose',
    generation: 'uint32',
    compatibilityDecision: COMPATIBILITY_DECISION_RULE,
    recoveryReceiptRef: 'reference',
  },
  'deep_research.run_restarted': {
    priorTailDigest: 'digest',
    archivedLineageId: 'identifier',
    restartReason: 'prose',
    generation: 'uint32',
    compatibilityDecision: COMPATIBILITY_DECISION_RULE,
    recoveryReceiptRef: 'reference',
  },
  'deep_research.question_registered': {
    normalizedQuestionDigest: 'digest',
    dependencyQuestionIds: 'identifier-array',
    requiredSourceClasses: 'code-array',
    disconfirmingQueryRecipeIds: 'identifier-array',
    budgetRef: 'reference',
  },
  'deep_research.branch_planned': {
    semanticClusterId: 'identifier',
    expectedYieldScoreVector: 'score-vector',
    contradictionRisk: 'ratio',
    impact: 'ratio',
    independenceGain: 'ratio',
    staleness: 'ratio',
    expectedCost: 'ratio',
    tieBreakKey: 'code',
    reservationRef: 'reference',
  },
  'deep_research.branch_selected': {
    semanticClusterId: 'identifier',
    expectedYieldScoreVector: 'score-vector',
    contradictionRisk: 'ratio',
    impact: 'ratio',
    independenceGain: 'ratio',
    staleness: 'ratio',
    expectedCost: 'ratio',
    tieBreakKey: 'code',
    reservationRef: 'reference',
  },
  'deep_research.iteration_started': {
    focusRef: 'reference',
    stateTailDigest: 'digest',
    strategyDigest: 'digest',
    status: ITERATION_STARTED_STATUS_RULE,
  },
  'deep_research.iteration_completed': {
    status: ITERATION_COMPLETION_STATUS_RULE,
    rawNewInfoRatio: 'ratio',
    trustedEvidenceYield: 'ratio',
    outputDigest: 'digest',
    ruledOutApproachRefs: 'reference-array',
    nextFocusCausationId: 'identifier',
  },
  'deep_research.source_captured': {
    sourceIdentityDigest: 'digest',
    locator: 'source-locator',
    capturedAt: 'timestamp',
    contentDigest: 'digest',
    mediaType: 'code',
    retrievalReceiptRef: 'reference',
    parentSourceVersionId: 'nullable-identifier',
    instructionScanResult: INSTRUCTION_SCAN_RESULT_RULE,
  },
  'deep_research.evidence_admission_decided': {
    disposition: DISPOSITION_RULE,
    passageLocators: 'passage-locators',
    atomicClaimRefs: 'reference-array',
    derivativeSourceGroup: 'identifier',
    admissionPolicyVersion: 'version',
    contaminationStatus: CONTAMINATION_STATUS_RULE,
    reasonCode: 'code',
  },
  'deep_research.claim_asserted': {
    claimId: 'identifier',
    normalizedClaimDigest: 'digest',
    evidenceIds: 'identifier-array',
    independenceGroup: 'identifier',
    rawConfidence: 'ratio',
    claimStatus: CLAIM_STATUS_RULE,
  },
  'deep_research.claim_relation_recorded': {
    claimId: 'identifier',
    relatedClaimVersionId: 'identifier',
    evidenceIds: 'identifier-array',
    relation: RELATION_RULE,
    independenceGroup: 'identifier',
    rawConfidence: 'ratio',
    claimStatus: CLAIM_STATUS_RULE,
  },
  'deep_research.claim_superseded': {
    priorClaimVersionId: 'identifier',
    successorClaimVersionId: 'identifier',
    supersessionReason: 'prose',
    effectiveAt: 'timestamp',
    replacementEvidenceIds: 'identifier-array',
    invalidationScope: 'code',
  },
  'deep_research.gap_detected': {
    obligationId: 'identifier',
    gapKind: GAP_KIND_RULE,
    affectedClaimIds: 'identifier-array',
    affectedQuestionIds: 'identifier-array',
    criticality: 'ratio',
    proposedQueryRecipeIds: 'identifier-array',
  },
  'deep_research.next_focus_selected': {
    obligationId: 'identifier',
    selectionScoreVector: 'score-vector',
    visitCooldown: 'uint32',
    policyVersion: 'version',
    chosenBranchId: 'nullable-identifier',
    chosenQuestionId: 'nullable-identifier',
  },
  'deep_research.convergence_evaluated': {
    decision: CONVERGENCE_DECISION_RULE,
    rawSignals: 'raw-signals',
    trustedSignals: 'trusted-signals',
    qualityGateResults: 'quality-gate-results',
    blockerIds: 'identifier-array',
    policyFingerprint: 'digest',
    evaluatorFingerprint: 'digest',
    evidenceTailHash: 'digest',
    incompleteReason: 'nullable-prose',
    recoveryReason: 'nullable-prose',
  },
  'deep_research.convergence_blocked': {
    decision: CONVERGENCE_DECISION_RULE,
    rawSignals: 'raw-signals',
    trustedSignals: 'trusted-signals',
    qualityGateResults: 'quality-gate-results',
    blockerIds: 'identifier-array',
    policyFingerprint: 'digest',
    evaluatorFingerprint: 'digest',
    evidenceTailHash: 'digest',
    incompleteReason: 'nullable-prose',
    recoveryReason: 'nullable-prose',
  },
  'deep_research.synthesis_started': {
    admittedLedgerRevision: 'reference',
    selectedClaimVersionSetDigest: 'digest',
    synthesisPolicyDigest: 'digest',
    reportRevision: 'reference',
    unresolvedClaimIds: 'identifier-array',
    contestedClaimIds: 'identifier-array',
  },
  'deep_research.synthesis_committed': {
    admittedLedgerRevision: 'reference',
    selectedClaimVersionSetDigest: 'digest',
    synthesisPolicyDigest: 'digest',
    reportRevision: 'reference',
    unresolvedClaimIds: 'identifier-array',
    contestedClaimIds: 'identifier-array',
    reportDigest: 'digest',
    citationEventIds: 'identifier-array',
    synthesisReceiptRef: 'reference',
  },
  'deep_research.memory_save_requested': {
    targetPacket: 'reference',
    continuityPayloadDigest: 'digest',
    route: 'code',
    mergeMode: 'code',
    sourceEventRange: 'source-event-range',
  },
  'deep_research.memory_save_completed': {
    targetPacket: 'reference',
    continuityPayloadDigest: 'digest',
    route: 'code',
    mergeMode: 'code',
    sourceEventRange: 'source-event-range',
    persistenceReceiptRefs: 'reference-array',
    continuityFingerprint: 'digest',
  },
  'deep_research.memory_save_failed': {
    targetPacket: 'reference',
    continuityPayloadDigest: 'digest',
    route: 'code',
    mergeMode: 'code',
    sourceEventRange: 'source-event-range',
    retryable: 'boolean',
    failureReason: 'prose',
  },
  'deep_research.run_completed': {
    terminalStatus: TERMINAL_STATUS_RULE,
    convergenceEventId: 'identifier',
    synthesisEventId: 'identifier',
    memorySaveEventId: 'identifier',
    finalLedgerTailHash: 'digest',
    counts: 'counts',
    completionReason: 'nullable-prose',
    incompleteReason: 'nullable-prose',
  },
} as const satisfies Readonly<
  Record<DeepResearchEventStem, Readonly<Record<string, DataFieldRule>>>
>);

const SCOPE_FIELDS = Object.freeze({
  'deep_research.run_initialized': ['runId', 'lineageId'],
  'deep_research.run_resumed': ['runId', 'lineageId'],
  'deep_research.run_restarted': ['runId', 'lineageId'],
  'deep_research.question_registered': ['runId', 'lineageId', 'questionId'],
  'deep_research.branch_planned': ['runId', 'lineageId', 'questionId', 'branchId'],
  'deep_research.branch_selected': ['runId', 'lineageId', 'questionId', 'branchId'],
  'deep_research.iteration_started': ['runId', 'lineageId', 'iteration'],
  'deep_research.iteration_completed': ['runId', 'lineageId', 'iteration'],
  'deep_research.source_captured': ['runId', 'lineageId', 'iteration', 'sourceVersionId'],
  'deep_research.evidence_admission_decided': [
    'runId', 'lineageId', 'iteration', 'sourceVersionId', 'evidenceId',
  ],
  'deep_research.claim_asserted': ['runId', 'lineageId', 'iteration', 'claimVersionId'],
  'deep_research.claim_relation_recorded': [
    'runId', 'lineageId', 'iteration', 'claimVersionId',
  ],
  'deep_research.claim_superseded': ['runId', 'lineageId', 'iteration', 'claimVersionId'],
  'deep_research.gap_detected': ['runId', 'lineageId', 'iteration'],
  'deep_research.next_focus_selected': ['runId', 'lineageId', 'iteration'],
  'deep_research.convergence_evaluated': ['runId', 'lineageId', 'iteration'],
  'deep_research.convergence_blocked': ['runId', 'lineageId', 'iteration'],
  'deep_research.synthesis_started': ['runId', 'lineageId'],
  'deep_research.synthesis_committed': ['runId', 'lineageId'],
  'deep_research.memory_save_requested': ['runId', 'lineageId'],
  'deep_research.memory_save_completed': ['runId', 'lineageId'],
  'deep_research.memory_save_failed': ['runId', 'lineageId'],
  'deep_research.run_completed': ['runId', 'lineageId'],
} as const satisfies Readonly<Record<DeepResearchEventStem, readonly string[]>>);

const HASH_PATTERN = /^[a-f0-9]{64}$/;
const SYSTEM_TOKEN_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:/@-]{0,255}$/;
const CODE_TOKEN_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:/@-]{0,127}$/;
const LOCATOR_SELECTOR_PATTERN = /^[^\u0000-\u001f\u007f\r\n]{1,256}$/u;
const MAX_LOCATOR_SELECTOR_SPACES = 16;
const MAX_PROSE_LENGTH = 4_096;
const RAW_SIGNAL_FIELDS = Object.freeze([
  'newInfoRatio', 'contradictionRisk', 'citationDrift', 'observationDigest',
] as const);
const TRUSTED_SIGNAL_FIELDS = Object.freeze([
  'evidenceYield', 'independentSourceRatio', 'supportedClaimRatio', 'assessmentDigest',
] as const);
const QUALITY_GATE_RESULT_FIELDS = Object.freeze([
  'sourceDiversity', 'contradictionResolution', 'citationIntegrity',
  'policyVersion', 'resultDigest',
] as const);
const FORBIDDEN_MUTABLE_FIELDS = new Set([
  'body', 'content', 'evidenceBlob', 'rawBody', 'rawEvidence', 'reportBody',
  'reportText', 'sourceBody', 'sourceText', 'text',
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

function isLocatorSelector(value: unknown): value is string {
  // A locator is a short structured pointer (paragraph:4, a CSS/XPath selector,
  // a #fragment, a char-range) — never a run of source prose. Bounding both the
  // length and the whitespace count stops a quoted passage from masquerading as a
  // selector and smuggling mutable evidence onto the source/admission events.
  return typeof value === 'string'
    && value.trim().length > 0
    && LOCATOR_SELECTOR_PATTERN.test(value)
    && (value.match(/\s/gu)?.length ?? 0) <= MAX_LOCATOR_SELECTOR_SPACES;
}

function isTimestamp(value: unknown): value is string {
  return typeof value === 'string'
    && value.length <= 64
    && !Number.isNaN(new Date(value).getTime());
}

function isUint32(value: unknown): value is number {
  return Number.isSafeInteger(value) && (value as number) >= 0 && (value as number) <= 0xffff_ffff;
}

function isRatio(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 1;
}

function hasExactFields(value: Record<string, unknown>, fields: readonly string[]): boolean {
  const keys = Object.keys(value).sort();
  return keys.length === fields.length
    && keys.every((key, index) => key === [...fields].sort()[index]);
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

function isScoreVector(value: unknown): boolean {
  if (!isObject(value)) return false;
  const fields = [
    'expectedYield', 'contradictionRisk', 'impact', 'independenceGain',
    'staleness', 'expectedCost',
  ];
  return hasExactFields(value, fields) && fields.every((field) => isRatio(value[field]));
}

function isRawConvergenceSignals(value: unknown): boolean {
  return isObject(value)
    && hasExactFields(value, RAW_SIGNAL_FIELDS)
    && RAW_SIGNAL_FIELDS.slice(0, 3).every((field) => isRatio(value[field]))
    && typeof value.observationDigest === 'string'
    && HASH_PATTERN.test(value.observationDigest);
}

function isTrustedConvergenceSignals(value: unknown): boolean {
  return isObject(value)
    && hasExactFields(value, TRUSTED_SIGNAL_FIELDS)
    && TRUSTED_SIGNAL_FIELDS.slice(0, 3).every((field) => isRatio(value[field]))
    && typeof value.assessmentDigest === 'string'
    && HASH_PATTERN.test(value.assessmentDigest);
}

function isConvergenceQualityGateResults(value: unknown): boolean {
  if (!isObject(value) || !hasExactFields(value, QUALITY_GATE_RESULT_FIELDS)) return false;
  const statuses = ['fail', 'pass', 'unknown'];
  return statuses.includes(String(value.sourceDiversity))
    && statuses.includes(String(value.contradictionResolution))
    && statuses.includes(String(value.citationIntegrity))
    && isSystemToken(value.policyVersion)
    && typeof value.resultDigest === 'string'
    && HASH_PATTERN.test(value.resultDigest);
}

function isLocator(value: unknown, passage: boolean): boolean {
  if (!isObject(value)) return false;
  if (passage) {
    return hasExactFields(value, ['locatorDigest', 'selector', 'passageDigest'])
      && HASH_PATTERN.test(String(value.locatorDigest))
      && isLocatorSelector(value.selector)
      && HASH_PATTERN.test(String(value.passageDigest));
  }
  return hasExactFields(value, ['scheme', 'locatorDigest', 'selector', 'revision'])
    && ['artifact', 'file', 'other', 'url'].includes(String(value.scheme))
    && HASH_PATTERN.test(String(value.locatorDigest))
    && isLocatorSelector(value.selector)
    && (value.revision === null || isSystemToken(value.revision));
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
    && Object.values(value.replay_input_digests).every(
      (digest) => typeof digest === 'string' && HASH_PATTERN.test(digest),
    );
}

function isScope(stem: DeepResearchEventStem, value: unknown): boolean {
  if (!isObject(value)) return false;
  const required = SCOPE_FIELDS[stem];
  const allowed = new Set<string>(required);
  if (Object.keys(value).some((field) => !allowed.has(field))) return false;
  if (required.some((field) => !Object.prototype.hasOwnProperty.call(value, field))) return false;
  for (const [field, candidate] of Object.entries(value)) {
    if (field === 'iteration') {
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
    case 'counts':
      return isObject(value)
        && hasExactFields(value, ['iterations', 'sources', 'admittedEvidence', 'claims'])
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
    case 'nullable-identifier':
      return value === null || isSystemToken(value);
    case 'nullable-prose':
      return value === null || isProse(value);
    case 'passage-locators':
      return Array.isArray(value)
        && value.length > 0
        && value.every((entry) => isLocator(entry, true));
    case 'prose':
      return isProse(value);
    case 'quality-gate-results':
      return isConvergenceQualityGateResults(value);
    case 'ratio':
      return isRatio(value);
    case 'raw-signals':
      return isRawConvergenceSignals(value);
    case 'score-vector':
      return isScoreVector(value);
    case 'source-event-range':
      return isObject(value)
        && hasExactFields(value, ['firstEventId', 'lastEventId'])
        && isSystemToken(value.firstEventId)
        && isSystemToken(value.lastEventId);
    case 'source-locator':
      return isLocator(value, false);
    case 'timestamp':
      return isTimestamp(value);
    case 'trusted-signals':
      return isTrustedConvergenceSignals(value);
    case 'uint32':
      return isUint32(value);
  }
}

function isData(stem: DeepResearchEventStem, value: unknown): boolean {
  if (!isObject(value) || hasForbiddenMutableField(value)) return false;
  const rules = DATA_FIELD_RULES[stem];
  const fields = Object.keys(rules);
  if (!hasExactFields(value, fields)) return false;
  if (!Object.entries(rules).every(([field, rule]) => (
    isFieldValue(rule, value[field])
  ))) return false;
  if (stem === 'deep_research.claim_superseded') {
    return value.priorClaimVersionId !== value.successorClaimVersionId;
  }
  if (stem === 'deep_research.convergence_blocked') return value.decision === 'blocked';
  if (stem === 'deep_research.next_focus_selected') {
    return (value.chosenBranchId === null) !== (value.chosenQuestionId === null);
  }
  return true;
}

function digestPayloadInput(
  stem: DeepResearchEventStem,
  scope: JsonObject,
  prevEventHash: string,
  replay: JsonObject,
  data: JsonObject,
): string {
  return sha256Bytes(canonicalBytes({
    stem,
    eventVersion: DEEP_RESEARCH_EVENT_VERSION,
    scope,
    prevEventHash,
    replay,
    data,
  }));
}

function isPayload(stem: DeepResearchEventStem, payload: Readonly<JsonObject>): boolean {
  if (!isDeepResearchEventStem(payload.stem)
    || payload.stem !== stem
    || payload.eventVersion !== DEEP_RESEARCH_EVENT_VERSION) return false;
  if (!isScope(stem, payload.scope) || !HASH_PATTERN.test(String(payload.prevEventHash))) return false;
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

function eventDefinition(stem: DeepResearchEventStem): EventTypeDefinition {
  return {
    eventType: DeepResearchWireEventTypes[stem],
    currentVersion: DEEP_RESEARCH_EVENT_VERSION,
    versions: [{
      version: DEEP_RESEARCH_EVENT_VERSION,
      payload: {
        requiredFields: DEEP_RESEARCH_MODE_PAYLOAD_FIELDS,
        validate: (payload) => isPayload(stem, payload),
      },
    }],
    upcasters: [],
  };
}

export function createDeepResearchEventRegistry(): EventTypeRegistry {
  return new EventTypeRegistry(DeepResearchEventStems.map(eventDefinition));
}

export function createDeepResearchLedgerPayload<TStem extends DeepResearchEventStem>(
  stem: TStem,
  scope: DeepResearchScopeMap[TStem],
  prevEventHash: string,
  replay: DeepResearchReplayMetadata,
  data: DeepResearchPayloadMap[TStem],
): DeepResearchLedgerPayload<TStem> {
  const payloadDigest = digestPayloadInput(
    stem,
    scope,
    prevEventHash,
    replay,
    data,
  );
  return Object.freeze({
    stem,
    eventVersion: DEEP_RESEARCH_EVENT_VERSION,
    scope,
    prevEventHash,
    payloadDigest,
    replay,
    data,
  }) as DeepResearchLedgerPayload<TStem>;
}

export function prepareDeepResearchEvent<TStem extends DeepResearchEventStem>(
  input: DeepResearchEventInput<TStem>,
  registry: EventTypeRegistry,
): EventWritePreflight {
  const payload = createDeepResearchLedgerPayload(
    input.stem,
    input.scope,
    input.prevEventHash,
    input.replay,
    input.data,
  );
  const envelope: DeepResearchEventEnvelope<TStem> = {
    envelope_version: CURRENT_ENVELOPE_VERSION,
    event_id: input.eventId,
    event_type: DeepResearchWireEventTypes[input.stem],
    event_version: DEEP_RESEARCH_EVENT_VERSION,
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

export function deepResearchEventDefinitions(): readonly EventTypeDefinition[] {
  return Object.freeze(DeepResearchEventStems.map(eventDefinition));
}

export function deepResearchPayloadDigest<TStem extends DeepResearchEventStem>(
  payload: Readonly<{
    stem: TStem;
    eventVersion: 1;
    scope: DeepResearchScopeMap[TStem];
    prevEventHash: string;
    replay: DeepResearchReplayMetadata;
    data: DeepResearchPayloadMap[TStem];
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

export function isDeepResearchEventStem(value: JsonValue): value is DeepResearchEventStem {
  return typeof value === 'string'
    && (DeepResearchEventStems as readonly string[]).includes(value);
}

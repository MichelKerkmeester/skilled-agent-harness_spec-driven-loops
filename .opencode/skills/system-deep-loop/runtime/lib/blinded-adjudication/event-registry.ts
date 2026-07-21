// ───────────────────────────────────────────────────────────────────
// MODULE: Blinded Adjudication Event Registry
// ───────────────────────────────────────────────────────────────────

import {
  AuthorizationReasonCodes,
  TransitionPolicyRegistry,
} from '../authorized-ledger/index.js';
import { EventTypeRegistry } from '../event-envelope/index.js';
import {
  ADJUDICATION_PRESENTATION_POLICY_VERSION,
  ADJUDICATION_REDUCER_VERSION,
  ADJUDICATION_MODE,
  ADJUDICATION_TRANSITION_POLICY_ID,
  ADJUDICATION_TRANSITION_POLICY_VERSION,
  AdjudicationStatuses,
  AssignmentOrders,
  CounterfactualKinds,
  CounterfactualOutcomes,
  JudgmentOutcomes,
} from './contracts.js';
import {
  assertClosedKeys,
  isPlainRecord,
  requireDigest,
  requireFiniteUnitInterval,
  requireIdentity,
  validateAdjudicationRequest,
  validateJudgeProfile,
} from './validation.js';

import type {
  PolicyEvaluationInput,
  PolicyEvaluationResult,
} from '../authorized-ledger/index.js';
import type {
  EventTypeDefinition,
  JsonObject,
} from '../event-envelope/index.js';
import type { AdjudicationRequest } from './contracts.js';

// ───────────────────────────────────────────────────────────────────
// 1. EVENT VOCABULARY
// ───────────────────────────────────────────────────────────────────

export const AdjudicationEventTypes = {
  REQUEST_ACCEPTED: 'adjudication.request.accepted',
  PRESENTATION_BLINDED: 'adjudication.presentation.blinded',
  SCORE_RECORDED: 'adjudication.score.recorded',
  COUNTERFACTUAL_EVALUATED: 'adjudication.counterfactual.evaluated',
  REDUCTION_COMPLETED: 'adjudication.reduction.completed',
  VERDICT_RECORDED: 'adjudication.verdict.recorded',
  VERDICT_INVALIDATED: 'adjudication.verdict.invalidated',
  DEBLINDING_AUDITED: 'adjudication.deblinding.audited',
  SHADOW_COMPARED: 'adjudication.shadow.compared',
} as const;

export type AdjudicationEventType =
  typeof AdjudicationEventTypes[keyof typeof AdjudicationEventTypes];

export const AdjudicationCapabilities = {
  REQUEST_ACCEPT: 'adjudication.request.accept',
  PRESENTATION_RECORD: 'adjudication.presentation.record',
  SCORE_RECORD: 'adjudication.score.record',
  COUNTERFACTUAL_RECORD: 'adjudication.counterfactual.record',
  REDUCTION_RECORD: 'adjudication.reduction.record',
  VERDICT_RECORD: 'adjudication.verdict.record',
  VERDICT_INVALIDATE: 'adjudication.verdict.invalidate',
  DEBLINDING_AUDIT: 'adjudication.deblinding.audit',
  SHADOW_RECORD: 'adjudication.shadow.record',
} as const;

export const CAPABILITY_BY_ADJUDICATION_EVENT: Readonly<Record<AdjudicationEventType, string>> =
  Object.freeze({
    [AdjudicationEventTypes.REQUEST_ACCEPTED]: AdjudicationCapabilities.REQUEST_ACCEPT,
    [AdjudicationEventTypes.PRESENTATION_BLINDED]: AdjudicationCapabilities.PRESENTATION_RECORD,
    [AdjudicationEventTypes.SCORE_RECORDED]: AdjudicationCapabilities.SCORE_RECORD,
    [AdjudicationEventTypes.COUNTERFACTUAL_EVALUATED]:
      AdjudicationCapabilities.COUNTERFACTUAL_RECORD,
    [AdjudicationEventTypes.REDUCTION_COMPLETED]: AdjudicationCapabilities.REDUCTION_RECORD,
    [AdjudicationEventTypes.VERDICT_RECORDED]: AdjudicationCapabilities.VERDICT_RECORD,
    [AdjudicationEventTypes.VERDICT_INVALIDATED]: AdjudicationCapabilities.VERDICT_INVALIDATE,
    [AdjudicationEventTypes.DEBLINDING_AUDITED]: AdjudicationCapabilities.DEBLINDING_AUDIT,
    [AdjudicationEventTypes.SHADOW_COMPARED]: AdjudicationCapabilities.SHADOW_RECORD,
  });

export interface AdjudicationPolicyVersions extends JsonObject {
  readonly presentation: string;
  readonly judge: string;
  readonly counterfactual: string;
  readonly reducer: string;
}

export interface AdjudicationEventPayload extends JsonObject {
  readonly adjudication_id: string;
  readonly candidate_digests: string[];
  readonly policy_versions: AdjudicationPolicyVersions;
  readonly judge_assignment_id: string | null;
  readonly replay_fingerprint: string;
  readonly evidence_id: string;
  readonly dark_execution: true;
  readonly legacy_authority: 'canonical';
  readonly data: JsonObject;
}

const COMMON_FIELDS = [
  'adjudication_id',
  'candidate_digests',
  'policy_versions',
  'judge_assignment_id',
  'replay_fingerprint',
  'evidence_id',
  'dark_execution',
  'legacy_authority',
  'data',
] as const;

const SHA256_PATTERN = /^[a-f0-9]{64}$/;
const STATUS_SET = new Set<string>(Object.values(AdjudicationStatuses));
const DECISION_KIND_SET = new Set<string>([
  'deep-review',
  'deep-ai-council',
  'deep-improvement',
  'model-benchmark',
  'skill-benchmark',
]);
const ORDER_SET = new Set<string>(Object.values(AssignmentOrders));
const JUDGMENT_SET = new Set<string>(Object.values(JudgmentOutcomes));
const COUNTERFACTUAL_KIND_SET = new Set<string>(Object.values(CounterfactualKinds));
const COUNTERFACTUAL_OUTCOME_SET = new Set<string>(Object.values(CounterfactualOutcomes));

// ───────────────────────────────────────────────────────────────────
// 2. PAYLOAD VALIDATION
// ───────────────────────────────────────────────────────────────────

function requireArray(value: unknown, field: string): readonly unknown[] {
  if (!Array.isArray(value)) throw new TypeError(`${field} must be an array`);
  return value;
}

function requireBoolean(value: unknown, field: string): boolean {
  if (typeof value !== 'boolean') throw new TypeError(`${field} must be boolean`);
  return value;
}

function requireNullableIdentity(value: unknown, field: string): string | null {
  return value === null ? null : requireIdentity(value, field);
}

function requireString(value: unknown, field: string): string {
  if (typeof value !== 'string' || value.length === 0) {
    throw new TypeError(`${field} must be a non-empty string`);
  }
  return value;
}

function requireInteger(value: unknown, field: string): number {
  if (!Number.isSafeInteger(value) || (value as number) < 0) {
    throw new TypeError(`${field} must be a non-negative safe integer`);
  }
  return value as number;
}

function validatePolicyVersions(value: unknown): void {
  if (!isPlainRecord(value)) throw new TypeError('policy_versions must be an object');
  assertClosedKeys(value, ['presentation', 'judge', 'counterfactual', 'reducer'], 'policy_versions');
  requireIdentity(value.presentation, 'policy_versions.presentation');
  requireIdentity(value.judge, 'policy_versions.judge');
  requireIdentity(value.counterfactual, 'policy_versions.counterfactual');
  requireIdentity(value.reducer, 'policy_versions.reducer');
  if (
    value.presentation !== ADJUDICATION_PRESENTATION_POLICY_VERSION
    || value.reducer !== ADJUDICATION_REDUCER_VERSION
  ) {
    throw new TypeError('event uses an unsupported presentation or reducer policy');
  }
}

function validateCommon(payload: Readonly<JsonObject>): Record<string, unknown> {
  if (!isPlainRecord(payload)) throw new TypeError('payload must be an object');
  assertClosedKeys(payload, COMMON_FIELDS, 'payload');
  requireIdentity(payload.adjudication_id, 'adjudication_id');
  const digests = requireArray(payload.candidate_digests, 'candidate_digests');
  if (digests.length < 2 || new Set(digests).size !== digests.length) {
    throw new TypeError('candidate_digests must contain unique candidates');
  }
  digests.forEach((digest, index) => requireDigest(digest, `candidate_digests[${index}]`));
  validatePolicyVersions(payload.policy_versions);
  requireNullableIdentity(payload.judge_assignment_id, 'judge_assignment_id');
  requireDigest(payload.replay_fingerprint, 'replay_fingerprint');
  requireIdentity(payload.evidence_id, 'evidence_id');
  if (payload.dark_execution !== true || payload.legacy_authority !== 'canonical') {
    throw new TypeError('adjudication event must remain dark with canonical legacy authority');
  }
  if (!isPlainRecord(payload.data)) throw new TypeError('data must be an object');
  return payload.data;
}

function validateRequestData(data: Record<string, unknown>): AdjudicationRequest {
  assertClosedKeys(data, ['request'], 'data');
  return validateAdjudicationRequest(data.request);
}

function validateTransformation(value: unknown, field: string): void {
  if (!isPlainRecord(value)) throw new TypeError(`${field} must be an object`);
  assertClosedKeys(value, [
    'policyVersion',
    'transformation',
    'sourceContentDigest',
    'presentedContentDigest',
  ], field);
  requireIdentity(value.policyVersion, `${field}.policyVersion`);
  if (value.transformation !== 'identity') throw new TypeError('unsupported transformation');
  const source = requireDigest(value.sourceContentDigest, `${field}.sourceContentDigest`);
  const presented = requireDigest(value.presentedContentDigest, `${field}.presentedContentDigest`);
  if (source !== presented) throw new TypeError('presentation changed candidate content');
}

function validatePresentationData(data: Record<string, unknown>): void {
  assertClosedKeys(data, [
    'assignment_id',
    'pair_id',
    'order',
    'opaque_labels',
    'presented_content_digests',
    'transformations',
    'counterfactual_kind',
    'baseline_assignment_id',
    'counterfactual_token_digest',
  ], 'data');
  requireIdentity(data.assignment_id, 'data.assignment_id');
  requireIdentity(data.pair_id, 'data.pair_id');
  if (typeof data.order !== 'string' || !ORDER_SET.has(data.order)) throw new TypeError('bad order');
  const labels = requireArray(data.opaque_labels, 'data.opaque_labels');
  const contentDigests = requireArray(
    data.presented_content_digests,
    'data.presented_content_digests',
  );
  const transformations = requireArray(data.transformations, 'data.transformations');
  if (labels.length !== 2 || contentDigests.length !== 2 || transformations.length !== 2) {
    throw new TypeError('pairwise presentation requires exactly two candidates');
  }
  labels.forEach((label, index) => requireIdentity(label, `data.opaque_labels[${index}]`));
  contentDigests.forEach((digest, index) =>
    requireDigest(digest, `data.presented_content_digests[${index}]`));
  transformations.forEach((value, index) => validateTransformation(
    value,
    `data.transformations[${index}]`,
  ));
  if (new Set(labels).size !== labels.length) throw new TypeError('opaque labels must be unique');
  if (
    data.counterfactual_kind !== null
    && (typeof data.counterfactual_kind !== 'string'
      || !COUNTERFACTUAL_KIND_SET.has(data.counterfactual_kind))
  ) {
    throw new TypeError('unsupported counterfactual kind');
  }
  requireNullableIdentity(data.baseline_assignment_id, 'data.baseline_assignment_id');
  if (data.counterfactual_token_digest !== null) {
    requireDigest(data.counterfactual_token_digest, 'data.counterfactual_token_digest');
  }
  const isCounterfactual = data.counterfactual_kind !== null;
  if (isCounterfactual !== (data.baseline_assignment_id !== null)) {
    throw new TypeError('counterfactual presentation requires one linked baseline');
  }
}

function validateRawScoreData(data: Record<string, unknown>): void {
  assertClosedKeys(data, [
    'judgment_id',
    'assignment_id',
    'pair_id',
    'judge_id',
    'order',
    'counterfactual_kind',
    'baseline_assignment_id',
    'candidate_digests',
    'outcome',
    'preferred_candidate_digest',
    'rationale',
    'evidence_locators',
    'uncertainty',
    'hard_veto',
    'judge_profile',
  ], 'data');
  for (const field of ['judgment_id', 'assignment_id', 'pair_id', 'judge_id'] as const) {
    requireIdentity(data[field], `data.${field}`);
  }
  if (typeof data.order !== 'string' || !ORDER_SET.has(data.order)) throw new TypeError('bad order');
  if (
    data.counterfactual_kind !== null
    && (typeof data.counterfactual_kind !== 'string'
      || !COUNTERFACTUAL_KIND_SET.has(data.counterfactual_kind))
  ) {
    throw new TypeError('unsupported counterfactual kind');
  }
  requireNullableIdentity(data.baseline_assignment_id, 'data.baseline_assignment_id');
  const candidateDigests = requireArray(data.candidate_digests, 'data.candidate_digests');
  if (candidateDigests.length !== 2) throw new TypeError('raw score must bind one pair');
  candidateDigests.forEach((digest, index) =>
    requireDigest(digest, `data.candidate_digests[${index}]`));
  if (typeof data.outcome !== 'string' || !JUDGMENT_SET.has(data.outcome)) {
    throw new TypeError('unsupported judgment outcome');
  }
  if (data.preferred_candidate_digest !== null) {
    requireDigest(data.preferred_candidate_digest, 'data.preferred_candidate_digest');
  }
  const hasPreference = data.outcome === JudgmentOutcomes.PREFERENCE;
  if (hasPreference !== (data.preferred_candidate_digest !== null)) {
    throw new TypeError('only preference outcomes may carry a candidate digest');
  }
  if (
    data.preferred_candidate_digest !== null
    && !candidateDigests.includes(data.preferred_candidate_digest)
  ) {
    throw new TypeError('preferred candidate is outside the judged pair');
  }
  requireString(data.rationale, 'data.rationale');
  requireArray(data.evidence_locators, 'data.evidence_locators')
    .forEach((locator, index) => requireIdentity(locator, `data.evidence_locators[${index}]`));
  requireFiniteUnitInterval(data.uncertainty, 'data.uncertainty');
  requireBoolean(data.hard_veto, 'data.hard_veto');
  const judgeProfile = validateJudgeProfile(data.judge_profile);
  if (judgeProfile.judgeId !== data.judge_id) throw new TypeError('judge profile identity mismatch');
}

function validateCounterfactualData(data: Record<string, unknown>): void {
  assertClosedKeys(data, [
    'probe_id',
    'pair_id',
    'kind',
    'baseline_judgment_id',
    'intervention_judgment_id',
    'outcome',
  ], 'data');
  for (const field of [
    'probe_id',
    'pair_id',
    'baseline_judgment_id',
    'intervention_judgment_id',
  ] as const) {
    requireIdentity(data[field], `data.${field}`);
  }
  if (typeof data.kind !== 'string' || !COUNTERFACTUAL_KIND_SET.has(data.kind)) {
    throw new TypeError('unsupported counterfactual kind');
  }
  if (typeof data.outcome !== 'string' || !COUNTERFACTUAL_OUTCOME_SET.has(data.outcome)) {
    throw new TypeError('unsupported counterfactual outcome');
  }
}

function validateIndependence(value: unknown): void {
  if (!isPlainRecord(value)) throw new TypeError('independence must be an object');
  assertClosedKeys(value, [
    'configuredSeatCount',
    'observedSeatCount',
    'effectiveIndependentCount',
    'clusters',
    'residualCorrelationWarnings',
    'competenceEstimatesAdvisory',
    'competenceWeightsCorrectCorrelation',
  ], 'independence');
  const configured = requireInteger(value.configuredSeatCount, 'independence.configuredSeatCount');
  const observed = requireInteger(value.observedSeatCount, 'independence.observedSeatCount');
  const effective = requireInteger(
    value.effectiveIndependentCount,
    'independence.effectiveIndependentCount',
  );
  if (effective > observed || observed > configured) {
    throw new TypeError('effective independence counts exceed observed or configured seats');
  }
  requireArray(value.clusters, 'independence.clusters').forEach((cluster, index) => {
    if (!isPlainRecord(cluster)) throw new TypeError('independence cluster must be an object');
    assertClosedKeys(cluster, ['clusterId', 'judgeIds', 'sharedSignals'], `clusters[${index}]`);
    requireIdentity(cluster.clusterId, `clusters[${index}].clusterId`);
    requireArray(cluster.judgeIds, `clusters[${index}].judgeIds`)
      .forEach((judgeId, judgeIndex) => requireIdentity(
        judgeId,
        `clusters[${index}].judgeIds[${judgeIndex}]`,
      ));
    requireArray(cluster.sharedSignals, `clusters[${index}].sharedSignals`)
      .forEach((signal, signalIndex) => requireString(
        signal,
        `clusters[${index}].sharedSignals[${signalIndex}]`,
      ));
  });
  requireArray(value.residualCorrelationWarnings, 'independence.residualCorrelationWarnings')
    .forEach((warning, index) => requireString(
      warning,
      `independence.residualCorrelationWarnings[${index}]`,
    ));
  if (!isPlainRecord(value.competenceEstimatesAdvisory)) {
    throw new TypeError('competence estimates must be an object');
  }
  Object.entries(value.competenceEstimatesAdvisory).forEach(([judgeId, estimate]) => {
    requireIdentity(judgeId, 'independence.competenceEstimatesAdvisory');
    requireFiniteUnitInterval(estimate, `independence.competenceEstimatesAdvisory.${judgeId}`);
  });
  if (value.competenceWeightsCorrectCorrelation !== false) {
    throw new TypeError('competence weighting cannot claim correlation correction');
  }
}

function validateIdentityArray(value: unknown, field: string): void {
  requireArray(value, field).forEach((entry, index) =>
    requireIdentity(entry, `${field}[${index}]`));
}

function validateDigestCycleArray(value: unknown, field: string): void {
  requireArray(value, field).forEach((cycle, cycleIndex) => {
    requireArray(cycle, `${field}[${cycleIndex}]`).forEach((digest, digestIndex) =>
      requireDigest(digest, `${field}[${cycleIndex}][${digestIndex}]`));
  });
}

function validatePairwiseGraph(value: unknown): void {
  requireArray(value, 'data.pairwise_graph').forEach((edge, index) => {
    if (!isPlainRecord(edge)) throw new TypeError('pairwise graph edge must be an object');
    assertClosedKeys(
      edge,
      ['pairId', 'candidateDigests', 'winnerCandidateDigest'],
      `data.pairwise_graph[${index}]`,
    );
    requireIdentity(edge.pairId, `data.pairwise_graph[${index}].pairId`);
    const candidates = requireArray(
      edge.candidateDigests,
      `data.pairwise_graph[${index}].candidateDigests`,
    );
    if (candidates.length !== 2) throw new TypeError('pairwise graph edge requires two candidates');
    candidates.forEach((digest, candidateIndex) => requireDigest(
      digest,
      `data.pairwise_graph[${index}].candidateDigests[${candidateIndex}]`,
    ));
    if (edge.winnerCandidateDigest !== null) {
      requireDigest(
        edge.winnerCandidateDigest,
        `data.pairwise_graph[${index}].winnerCandidateDigest`,
      );
      if (!candidates.includes(edge.winnerCandidateDigest)) {
        throw new TypeError('pairwise winner is outside its candidate pair');
      }
    }
  });
}

function validateReductionData(data: Record<string, unknown>): void {
  assertClosedKeys(data, [
    'reducer_version',
    'status',
    'preferred_candidate_digest',
    'reasons',
    'raw_score_evidence_ids',
    'counterfactual_evidence_ids',
    'minority_evidence_ids',
    'pairwise_graph',
    'tie_pair_ids',
    'cycles',
    'veto_evidence_ids',
    'independence',
  ], 'data');
  requireIdentity(data.reducer_version, 'data.reducer_version');
  if (typeof data.status !== 'string' || !STATUS_SET.has(data.status)) {
    throw new TypeError('unsupported reduction status');
  }
  if (data.preferred_candidate_digest !== null) {
    requireDigest(data.preferred_candidate_digest, 'data.preferred_candidate_digest');
  }
  for (const field of [
    'reasons',
    'raw_score_evidence_ids',
    'counterfactual_evidence_ids',
    'minority_evidence_ids',
    'tie_pair_ids',
    'veto_evidence_ids',
  ] as const) {
    validateIdentityArray(data[field], `data.${field}`);
  }
  validatePairwiseGraph(data.pairwise_graph);
  validateDigestCycleArray(data.cycles, 'data.cycles');
  const isStable = data.status === AdjudicationStatuses.STABLE;
  if (isStable !== (data.preferred_candidate_digest !== null)) {
    throw new TypeError('only stable reductions may carry a preferred candidate');
  }
  validateIndependence(data.independence);
}

function validateVerdictData(data: Record<string, unknown>): void {
  assertClosedKeys(data, [
    'decision_kind',
    'status',
    'preferred_candidate_digest',
    'reduction_evidence_id',
    'raw_score_evidence_ids',
    'counterfactual_evidence_ids',
    'minority_evidence_ids',
    'pairwise_graph',
    'tie_pair_ids',
    'cycles',
    'veto_evidence_ids',
    'independence',
    'service_authority',
  ], 'data');
  if (typeof data.decision_kind !== 'string' || !DECISION_KIND_SET.has(data.decision_kind)) {
    throw new TypeError('unsupported decision kind');
  }
  if (typeof data.status !== 'string' || !STATUS_SET.has(data.status)) {
    throw new TypeError('unsupported verdict status');
  }
  if (data.preferred_candidate_digest !== null) {
    requireDigest(data.preferred_candidate_digest, 'data.preferred_candidate_digest');
  }
  requireIdentity(data.reduction_evidence_id, 'data.reduction_evidence_id');
  for (const field of [
    'raw_score_evidence_ids',
    'counterfactual_evidence_ids',
    'minority_evidence_ids',
    'tie_pair_ids',
    'veto_evidence_ids',
  ] as const) {
    validateIdentityArray(data[field], `data.${field}`);
  }
  validatePairwiseGraph(data.pairwise_graph);
  validateDigestCycleArray(data.cycles, 'data.cycles');
  const isStable = data.status === AdjudicationStatuses.STABLE;
  if (isStable !== (data.preferred_candidate_digest !== null)) {
    throw new TypeError('only stable verdicts may carry a preferred candidate');
  }
  validateIndependence(data.independence);
  if (data.service_authority !== 'shadow-only') throw new TypeError('service cannot be authoritative');
}

function validateInvalidationData(data: Record<string, unknown>): void {
  assertClosedKeys(data, ['invalidated_evidence_id', 'reason'], 'data');
  requireIdentity(data.invalidated_evidence_id, 'data.invalidated_evidence_id');
  requireString(data.reason, 'data.reason');
}

function validateDeblindingData(data: Record<string, unknown>): void {
  assertClosedKeys(data, [
    'actor_id',
    'purpose',
    'scope_candidate_digests',
    'identity_map_version',
    'result',
  ], 'data');
  requireIdentity(data.actor_id, 'data.actor_id');
  requireString(data.purpose, 'data.purpose');
  requireArray(data.scope_candidate_digests, 'data.scope_candidate_digests')
    .forEach((digest, index) => requireDigest(digest, `data.scope_candidate_digests[${index}]`));
  requireIdentity(data.identity_map_version, 'data.identity_map_version');
  if (data.result !== 'authorized' && data.result !== 'denied') {
    throw new TypeError('unsupported deblinding result');
  }
}

function validateShadowData(data: Record<string, unknown>): void {
  assertClosedKeys(data, [
    'legacy_outcome_digest',
    'adjudication_status',
    'preferred_candidate_digest',
    'matches_legacy',
    'service_authoritative',
  ], 'data');
  requireDigest(data.legacy_outcome_digest, 'data.legacy_outcome_digest');
  if (typeof data.adjudication_status !== 'string' || !STATUS_SET.has(data.adjudication_status)) {
    throw new TypeError('unsupported adjudication status');
  }
  if (data.preferred_candidate_digest !== null) {
    requireDigest(data.preferred_candidate_digest, 'data.preferred_candidate_digest');
  }
  requireBoolean(data.matches_legacy, 'data.matches_legacy');
  if (data.service_authoritative !== false) throw new TypeError('shadow result cannot be authoritative');
}

function canonicalRequestDigests(digests: readonly string[]): string {
  return [...digests].sort().join('|');
}

function validateRequestPayload(payload: Readonly<JsonObject>): void {
  if (payload.judge_assignment_id !== null) throw new TypeError('request cannot impersonate a judge');
  const request = validateRequestData(validateCommon(payload));
  const policies = payload.policy_versions as AdjudicationPolicyVersions;
  if (
    canonicalRequestDigests(request.candidateDigests)
      !== canonicalRequestDigests(payload.candidate_digests as string[])
    || request.replayFingerprint !== payload.replay_fingerprint
    || request.presentationPolicyVersion !== policies.presentation
    || request.judgePolicyVersion !== policies.judge
    || request.counterfactualPolicyVersion !== policies.counterfactual
    || request.reducerVersion !== policies.reducer
  ) {
    throw new TypeError('request event linkage does not match its common evidence fields');
  }
}

function validatePresentationPayload(payload: Readonly<JsonObject>): void {
  if (payload.judge_assignment_id === null) throw new TypeError('presentation requires assignment');
  validatePresentationData(validateCommon(payload));
}

function validateRawScorePayload(payload: Readonly<JsonObject>): void {
  if (payload.judge_assignment_id === null) throw new TypeError('raw score requires assignment');
  const data = validateCommon(payload);
  validateRawScoreData(data);
  const pair = data.candidate_digests as string[];
  if (pair.some((digest) => !(payload.candidate_digests as string[]).includes(digest))) {
    throw new TypeError('raw score pair is outside the adjudication candidate set');
  }
}

function validateCounterfactualPayload(payload: Readonly<JsonObject>): void {
  if (payload.judge_assignment_id === null) throw new TypeError('counterfactual requires assignment');
  validateCounterfactualData(validateCommon(payload));
}

function validateReductionPayload(payload: Readonly<JsonObject>): void {
  if (payload.judge_assignment_id !== null) throw new TypeError('reduction cannot impersonate a judge');
  validateReductionData(validateCommon(payload));
}

function validateVerdictPayload(payload: Readonly<JsonObject>): void {
  if (payload.judge_assignment_id !== null) throw new TypeError('verdict cannot impersonate a judge');
  validateVerdictData(validateCommon(payload));
}

function validateInvalidationPayload(payload: Readonly<JsonObject>): void {
  if (payload.judge_assignment_id !== null) throw new TypeError('invalidation cannot impersonate a judge');
  validateInvalidationData(validateCommon(payload));
}

function validateDeblindingPayload(payload: Readonly<JsonObject>): void {
  if (payload.judge_assignment_id !== null) throw new TypeError('deblinding cannot impersonate a judge');
  validateDeblindingData(validateCommon(payload));
}

function validateShadowPayload(payload: Readonly<JsonObject>): void {
  if (payload.judge_assignment_id !== null) throw new TypeError('shadow comparison cannot impersonate a judge');
  validateShadowData(validateCommon(payload));
}

// ───────────────────────────────────────────────────────────────────
// 3. REGISTRIES
// ───────────────────────────────────────────────────────────────────

function eventDefinition(
  eventType: AdjudicationEventType,
  validate: (payload: Readonly<JsonObject>) => void,
): EventTypeDefinition {
  return {
    eventType,
    currentVersion: 1,
    versions: [{
      version: 1,
      payload: {
        requiredFields: COMMON_FIELDS,
        validate,
      },
    }],
    upcasters: [],
  };
}

/** Create the immutable validator-bound registry for adjudication evidence. */
export function createAdjudicationEventRegistry(): EventTypeRegistry {
  return new EventTypeRegistry([
    eventDefinition(AdjudicationEventTypes.REQUEST_ACCEPTED, validateRequestPayload),
    eventDefinition(AdjudicationEventTypes.PRESENTATION_BLINDED, validatePresentationPayload),
    eventDefinition(AdjudicationEventTypes.SCORE_RECORDED, validateRawScorePayload),
    eventDefinition(
      AdjudicationEventTypes.COUNTERFACTUAL_EVALUATED,
      validateCounterfactualPayload,
    ),
    eventDefinition(AdjudicationEventTypes.REDUCTION_COMPLETED, validateReductionPayload),
    eventDefinition(AdjudicationEventTypes.VERDICT_RECORDED, validateVerdictPayload),
    eventDefinition(AdjudicationEventTypes.VERDICT_INVALIDATED, validateInvalidationPayload),
    eventDefinition(AdjudicationEventTypes.DEBLINDING_AUDITED, validateDeblindingPayload),
    eventDefinition(AdjudicationEventTypes.SHADOW_COMPARED, validateShadowPayload),
  ]);
}

function evaluateDarkAdjudicationPolicy(
  input: Readonly<PolicyEvaluationInput>,
): PolicyEvaluationResult {
  const expectedCapability = CAPABILITY_BY_ADJUDICATION_EVENT[
    input.requestedEventType as AdjudicationEventType
  ];
  const isDarkAuthority = input.authorityState === 'legacy_authoritative'
    || input.authorityState === 'shadowing';
  if (
    input.mode !== ADJUDICATION_MODE
    || !isDarkAuthority
    || expectedCapability === undefined
    || input.capabilityId !== expectedCapability
  ) {
    return {
      verdict: 'deny',
      reasonCode: AuthorizationReasonCodes.POLICY_DENIED,
      matchedRuleIds: ['dark-authority', 'exact-capability', 'known-event'],
    };
  }
  return {
    verdict: 'allow',
    reasonCode: AuthorizationReasonCodes.ALLOWED,
    matchedRuleIds: ['dark-authority', 'exact-capability', 'known-event'],
  };
}

/** Create a default-deny exact-capability policy for dark evidence writes. */
export function createAdjudicationTransitionPolicyRegistry(): TransitionPolicyRegistry {
  return new TransitionPolicyRegistry([{
    policyId: ADJUDICATION_TRANSITION_POLICY_ID,
    policyVersion: ADJUDICATION_TRANSITION_POLICY_VERSION,
    evaluatorVersion: '1',
    ruleIds: ['dark-authority', 'exact-capability', 'known-event'],
    evaluate: evaluateDarkAdjudicationPolicy,
  }]);
}

// ───────────────────────────────────────────────────────────────────
// 4. PAYLOAD BUILDER
// ───────────────────────────────────────────────────────────────────

/** Bind event-specific data to the request's complete policy and replay identity. */
export function createAdjudicationEventPayload(
  adjudicationId: string,
  request: AdjudicationRequest,
  evidenceId: string,
  judgeAssignmentId: string | null,
  data: JsonObject,
): AdjudicationEventPayload {
  return Object.freeze({
    adjudication_id: adjudicationId,
    candidate_digests: Object.freeze([...request.candidateDigests]) as unknown as string[],
    policy_versions: Object.freeze({
      presentation: request.presentationPolicyVersion,
      judge: request.judgePolicyVersion,
      counterfactual: request.counterfactualPolicyVersion,
      reducer: request.reducerVersion,
    }),
    judge_assignment_id: judgeAssignmentId,
    replay_fingerprint: request.replayFingerprint,
    evidence_id: evidenceId,
    dark_execution: true,
    legacy_authority: 'canonical',
    data: Object.freeze(data),
  });
}

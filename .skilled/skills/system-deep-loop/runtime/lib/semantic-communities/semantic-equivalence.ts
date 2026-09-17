// ───────────────────────────────────────────────────────────────────
// MODULE: Semantic Equivalence Admission
// ───────────────────────────────────────────────────────────────────

import {
  canonicalBytes,
  canonicalJson,
  sha256Bytes,
} from '../event-envelope/index.js';
import { SEMANTIC_EQUIVALENCE_RELATION } from './semantic-community-types.js';

import type {
  CreateSemanticClaimInput,
  SemanticCandidateAssessment,
  SemanticClaimObservation,
  SemanticClaimRecord,
  SemanticCoverageEdgeBoundary,
  SemanticEquivalenceEdgeRecord,
  SemanticNamespaceRecord,
  SemanticProjectionConfig,
  SemanticProjectionConfigInput,
} from './semantic-community-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const HASH_PATTERN = /^[a-f0-9]{64}$/;
const IDENTITY_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:@-]{0,255}$/;
const MAX_CANDIDATES = 1_024;

// ───────────────────────────────────────────────────────────────────
// 2. VALIDATION HELPERS
// ───────────────────────────────────────────────────────────────────

function requireIdentity(value: unknown, field: string): string {
  if (typeof value !== 'string' || !IDENTITY_PATTERN.test(value)) {
    throw new TypeError(`${field} must be a bounded stable identity`);
  }
  return value;
}

function requireText(value: unknown, field: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new TypeError(`${field} must be a non-empty string`);
  }
  canonicalBytes(value);
  return value;
}

function requireDigest(value: unknown, field: string): string {
  if (typeof value !== 'string' || !HASH_PATTERN.test(value)) {
    throw new TypeError(`${field} must be a lowercase SHA-256 digest`);
  }
  return value;
}

function requireUnitInterval(value: unknown, field: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 1) {
    throw new RangeError(`${field} must be a finite number between zero and one`);
  }
  return value;
}

function requirePositiveInteger(value: unknown, field: string, maximum?: number): number {
  if (
    typeof value !== 'number'
    || !Number.isSafeInteger(value)
    || value <= 0
    || (maximum !== undefined && value > maximum)
  ) {
    throw new RangeError(`${field} must be a bounded positive safe integer`);
  }
  return value;
}

function compareCodeUnits(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function freezeJson<T>(value: T): T {
  if (value !== null && typeof value === 'object') {
    Object.values(value).forEach((entry) => freezeJson(entry));
    Object.freeze(value);
  }
  return value;
}

function canonicalClone<T>(value: T): T {
  return freezeJson(JSON.parse(canonicalJson(value)) as T);
}

// ───────────────────────────────────────────────────────────────────
// 3. CONFIGURATION AND CLAIMS
// ───────────────────────────────────────────────────────────────────

/** Derive a new immutable projection version from every semantic policy input. */
export function defineSemanticProjectionConfig(
  input: SemanticProjectionConfigInput,
): SemanticProjectionConfig {
  const core = {
    model_name: requireIdentity(input.modelName, 'modelName'),
    model_version: requireIdentity(input.modelVersion, 'modelVersion'),
    normalization_version: requireIdentity(
      input.normalizationVersion,
      'normalizationVersion',
    ),
    metric: requireIdentity(input.metric, 'metric'),
    threshold_policy_id: requireIdentity(input.thresholdPolicyId, 'thresholdPolicyId'),
    threshold_policy_version: requireIdentity(
      input.thresholdPolicyVersion,
      'thresholdPolicyVersion',
    ),
    equivalence_threshold: requireUnitInterval(
      input.equivalenceThreshold,
      'equivalenceThreshold',
    ),
    candidate_limit: requirePositiveInteger(
      input.candidateLimit,
      'candidateLimit',
      MAX_CANDIDATES,
    ),
    equivalence_evaluator_id: requireIdentity(
      input.equivalenceEvaluatorId,
      'equivalenceEvaluatorId',
    ),
    equivalence_evaluator_version: requireIdentity(
      input.equivalenceEvaluatorVersion,
      'equivalenceEvaluatorVersion',
    ),
    cohesion_policy_id: requireIdentity(input.cohesionPolicyId, 'cohesionPolicyId'),
    cohesion_policy_version: requireIdentity(
      input.cohesionPolicyVersion,
      'cohesionPolicyVersion',
    ),
    cohesion_score_threshold: requireUnitInterval(
      input.cohesionScoreThreshold,
      'cohesionScoreThreshold',
    ),
    minimum_cross_community_ratio: requireUnitInterval(
      input.minimumCrossCommunityRatio,
      'minimumCrossCommunityRatio',
    ),
  };
  if (core.cohesion_score_threshold < core.equivalence_threshold) {
    throw new RangeError('cohesionScoreThreshold cannot be below equivalenceThreshold');
  }
  const configDigest = sha256Bytes(canonicalBytes(core));
  return canonicalClone({
    ...core,
    config_digest: configDigest,
    projection_version: `semantic-community@${configDigest.slice(0, 24)}`,
  }) as SemanticProjectionConfig;
}

/** Preserve one shipped CLAIM node and its raw wording as immutable sidecar input. */
export function createSemanticClaimRecord(
  input: CreateSemanticClaimInput,
): SemanticClaimRecord {
  if (input.node.kind !== 'CLAIM' || input.node.loopType !== 'research') {
    throw new TypeError('Semantic communities accept research CLAIM coverage nodes only');
  }
  const sessionId = requireIdentity(input.node.sessionId, 'node.sessionId');
  const evidenceLinks = [...new Set(input.evidenceLinks.map(
    (link) => requireIdentity(link, 'evidenceLink'),
  ))].sort(compareCodeUnits);
  const record: SemanticClaimRecord = {
    claim_id: requireIdentity(input.node.id, 'node.id'),
    raw_text: requireText(input.rawText, 'rawText'),
    normalized_fingerprint: requireDigest(
      input.normalizedFingerprint,
      'normalizedFingerprint',
    ),
    evidence_links: evidenceLinks,
    namespace: {
      spec_folder: requireText(input.node.specFolder, 'node.specFolder'),
      loop_type: input.node.loopType,
      session_id: sessionId,
    },
    coverage_node_name: requireText(input.node.name, 'node.name'),
    coverage_node_content_hash: input.node.contentHash ?? null,
    coverage_node_iteration: input.node.iteration ?? null,
    originating_ledger_event: {
      ledger_id: requireIdentity(input.origin.ledger_id, 'origin.ledger_id'),
      sequence: requirePositiveInteger(input.origin.sequence, 'origin.sequence'),
      event_id: requireIdentity(input.origin.event_id, 'origin.event_id'),
      record_hash: requireDigest(input.origin.record_hash, 'origin.record_hash'),
    },
  };
  canonicalBytes(record);
  return canonicalClone(record);
}

/** Compare the complete graph namespace, including the otherwise optional session. */
export function sameSemanticNamespace(
  left: SemanticNamespaceRecord,
  right: SemanticNamespaceRecord,
): boolean {
  return left.spec_folder === right.spec_folder
    && left.loop_type === right.loop_type
    && left.session_id === right.session_id;
}

/** Return a deterministic bounded namespace-local neighborhood for exact scoring. */
export function retrieveNamespaceCandidates(
  query: SemanticClaimRecord,
  claims: readonly SemanticClaimRecord[],
  config: SemanticProjectionConfig,
): readonly SemanticClaimRecord[] {
  return Object.freeze(
    claims
      .filter((claim) => (
        claim.claim_id !== query.claim_id
        && sameSemanticNamespace(claim.namespace, query.namespace)
      ))
      .sort((left, right) => compareCodeUnits(left.claim_id, right.claim_id))
      .slice(0, config.candidate_limit),
  );
}

/** Commit the exact candidate set so retrieval changes cannot be hidden. */
export function semanticCandidateSetDigest(
  queryClaimId: string,
  candidateClaimIds: readonly string[],
  retrievalMethod: string,
  retrievalVersion: string,
): string {
  return sha256Bytes(canonicalBytes({
    query_claim_id: requireIdentity(queryClaimId, 'queryClaimId'),
    candidate_claim_ids: [...candidateClaimIds]
      .map((id) => requireIdentity(id, 'candidateClaimId'))
      .sort(compareCodeUnits),
    retrieval_method: requireIdentity(retrievalMethod, 'retrievalMethod'),
    retrieval_version: requireIdentity(retrievalVersion, 'retrievalVersion'),
  }));
}

// ───────────────────────────────────────────────────────────────────
// 4. EDGE ADMISSION
// ───────────────────────────────────────────────────────────────────

function validateAssessment(
  assessment: SemanticCandidateAssessment,
  config: SemanticProjectionConfig,
): void {
  requireIdentity(assessment.candidate_claim_id, 'candidate_claim_id');
  requireUnitInterval(assessment.score, 'score');
  requireUnitInterval(assessment.admission_threshold, 'admission_threshold');
  requirePositiveInteger(
    assessment.candidate_rank,
    'candidate_rank',
    config.candidate_limit,
  );
  requireDigest(assessment.candidate_set_digest, 'candidate_set_digest');
  requireDigest(assessment.equivalence_evidence_digest, 'equivalence_evidence_digest');
  requireIdentity(
    assessment.candidate_retrieval_method,
    'candidate_retrieval_method',
  );
  requireIdentity(
    assessment.candidate_retrieval_version,
    'candidate_retrieval_version',
  );
  if (!['equivalent', 'topical_only', 'distinct'].includes(
    assessment.equivalence_decision,
  )) {
    throw new TypeError('Candidate assessment has an unknown equivalence decision');
  }
  if (
    assessment.model_name !== config.model_name
    || assessment.model_version !== config.model_version
    || assessment.metric !== config.metric
    || assessment.threshold_policy_id !== config.threshold_policy_id
    || assessment.threshold_policy_version !== config.threshold_policy_version
    || assessment.admission_threshold !== config.equivalence_threshold
    || assessment.equivalence_evaluator_id !== config.equivalence_evaluator_id
    || assessment.equivalence_evaluator_version !== config.equivalence_evaluator_version
  ) {
    throw new TypeError('Candidate assessment does not match the active projection version');
  }
}

function validateCandidateBundle(
  observation: SemanticClaimObservation,
  config: SemanticProjectionConfig,
): void {
  const assessments = observation.candidate_assessments;
  if (assessments.length > config.candidate_limit) {
    throw new RangeError('Candidate assessment count exceeds the configured bound');
  }
  const candidateIds = assessments.map((entry) => entry.candidate_claim_id);
  const candidateRanks = assessments.map((entry) => entry.candidate_rank);
  if (new Set(candidateIds).size !== candidateIds.length) {
    throw new TypeError('Candidate assessment identities must be unique');
  }
  if (
    new Set(candidateRanks).size !== candidateRanks.length
    || candidateRanks.some((rank) => rank < 1 || rank > assessments.length)
  ) {
    throw new TypeError('Candidate ranks must be a complete bounded permutation');
  }
  if (assessments.length === 0) return;
  const retrievalMethod = assessments[0].candidate_retrieval_method;
  const retrievalVersion = assessments[0].candidate_retrieval_version;
  const candidateSetDigest = semanticCandidateSetDigest(
    observation.claim.claim_id,
    candidateIds,
    retrievalMethod,
    retrievalVersion,
  );
  for (const entry of assessments) {
    validateAssessment(entry, config);
    if (
      entry.candidate_retrieval_method !== retrievalMethod
      || entry.candidate_retrieval_version !== retrievalVersion
      || entry.candidate_set_digest !== candidateSetDigest
    ) {
      throw new TypeError('Candidate provenance does not describe the observed candidate set');
    }
  }
}

/** Admit only exact-policy equivalence; embedding score by itself is insufficient. */
export function admitSemanticEquivalenceEdge(
  observation: SemanticClaimObservation,
  candidate: SemanticClaimRecord,
  assessment: SemanticCandidateAssessment,
  config: SemanticProjectionConfig,
): SemanticEquivalenceEdgeRecord | null {
  if (
    observation.projection_version !== config.projection_version
    || observation.config_digest !== config.config_digest
  ) {
    throw new TypeError('Claim observation targets a different projection version');
  }
  validateCandidateBundle(observation, config);
  if (
    assessment.candidate_claim_id !== candidate.claim_id
    || observation.claim.claim_id === candidate.claim_id
    || !sameSemanticNamespace(observation.claim.namespace, candidate.namespace)
  ) {
    throw new TypeError('Candidate endpoint is absent or outside the claim namespace');
  }
  if (
    assessment.equivalence_decision !== 'equivalent'
    || assessment.score < config.equivalence_threshold
  ) {
    return null;
  }

  const [sourceId, targetId] = [observation.claim.claim_id, candidate.claim_id]
    .sort(compareCodeUnits);
  const namespace = observation.claim.namespace;
  const sourceClaim = sourceId === observation.claim.claim_id
    ? observation.claim
    : candidate;
  const candidateRetrievalMethod = requireIdentity(
    assessment.candidate_retrieval_method,
    'candidate_retrieval_method',
  );
  const candidateRetrievalVersion = requireIdentity(
    assessment.candidate_retrieval_version,
    'candidate_retrieval_version',
  );
  // The ledger retains directional retrieval while the undirected edge keeps pair-local provenance.
  const canonicalCandidateSetDigest = semanticCandidateSetDigest(
    sourceId,
    [targetId],
    candidateRetrievalMethod,
    candidateRetrievalVersion,
  );
  const edgeIdentity = {
    projection_version: config.projection_version,
    spec_folder: namespace.spec_folder,
    loop_type: namespace.loop_type,
    session_id: namespace.session_id,
    source_id: sourceId,
    target_id: targetId,
  };
  const edge: SemanticEquivalenceEdgeRecord = {
    edge_id: `semantic-edge-${sha256Bytes(canonicalBytes(edgeIdentity))}`,
    relation: SEMANTIC_EQUIVALENCE_RELATION,
    ...edgeIdentity,
    model_name: assessment.model_name,
    model_version: assessment.model_version,
    metric: assessment.metric,
    score: assessment.score,
    threshold_policy_id: assessment.threshold_policy_id,
    threshold_policy_version: assessment.threshold_policy_version,
    admission_threshold: assessment.admission_threshold,
    candidate_retrieval_method: candidateRetrievalMethod,
    candidate_retrieval_version: candidateRetrievalVersion,
    candidate_rank: 1,
    candidate_set_digest: canonicalCandidateSetDigest,
    equivalence_evaluator_id: assessment.equivalence_evaluator_id,
    equivalence_evaluator_version: assessment.equivalence_evaluator_version,
    equivalence_evidence_digest: assessment.equivalence_evidence_digest,
    originating_event_id: sourceClaim.originating_ledger_event.event_id,
    originating_event_sequence: sourceClaim.originating_ledger_event.sequence,
  };
  return canonicalClone(edge);
}

/** Expose semantic edges through the existing graph namespace and endpoint shape. */
export function semanticCoverageEdgeBoundary(
  edge: SemanticEquivalenceEdgeRecord,
): SemanticCoverageEdgeBoundary {
  return Object.freeze({
    id: edge.edge_id,
    specFolder: edge.spec_folder,
    loopType: edge.loop_type,
    sessionId: edge.session_id,
    sourceId: edge.source_id,
    targetId: edge.target_id,
    relation: edge.relation,
    weight: edge.score,
    metadata: edge,
  });
}

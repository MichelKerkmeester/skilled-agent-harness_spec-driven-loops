// ───────────────────────────────────────────────────────────────────
// MODULE: Semantic Community Types
// ───────────────────────────────────────────────────────────────────

import type {
  CoverageEdge,
  CoverageNode,
  CoverageSnapshot,
  LoopType,
  Namespace,
} from '../coverage-graph/coverage-graph-db.js';
import type { JsonObject } from '../event-envelope/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

export const SEMANTIC_EQUIVALENCE_RELATION = 'SEMANTIC_EQUIVALENT' as const;
export const SEMANTIC_CLAIM_EVENT_TYPE = 'semantic-community.claim.observed' as const;
export const SEMANTIC_PROJECTION_SCHEMA_VERSION = 'semantic-community-projection@1' as const;

// ───────────────────────────────────────────────────────────────────
// 2. VERSIONED CONFIGURATION
// ───────────────────────────────────────────────────────────────────

/** Caller inputs whose canonical digest becomes the projection version. */
export interface SemanticProjectionConfigInput {
  readonly modelName: string;
  readonly modelVersion: string;
  readonly normalizationVersion: string;
  readonly metric: string;
  readonly thresholdPolicyId: string;
  readonly thresholdPolicyVersion: string;
  readonly equivalenceThreshold: number;
  readonly candidateLimit: number;
  readonly equivalenceEvaluatorId: string;
  readonly equivalenceEvaluatorVersion: string;
  readonly cohesionPolicyId: string;
  readonly cohesionPolicyVersion: string;
  readonly cohesionScoreThreshold: number;
  readonly minimumCrossCommunityRatio: number;
}

/** Immutable configuration addressed by a digest-derived projection version. */
export interface SemanticProjectionConfig extends JsonObject {
  readonly model_name: string;
  readonly model_version: string;
  readonly normalization_version: string;
  readonly metric: string;
  readonly threshold_policy_id: string;
  readonly threshold_policy_version: string;
  readonly equivalence_threshold: number;
  readonly candidate_limit: number;
  readonly equivalence_evaluator_id: string;
  readonly equivalence_evaluator_version: string;
  readonly cohesion_policy_id: string;
  readonly cohesion_policy_version: string;
  readonly cohesion_score_threshold: number;
  readonly minimum_cross_community_ratio: number;
  readonly config_digest: string;
  readonly projection_version: string;
}

// ───────────────────────────────────────────────────────────────────
// 3. CLAIM AND EDGE RECORDS
// ───────────────────────────────────────────────────────────────────

/** Required wire form of the shipped coverage-graph namespace. */
export interface SemanticNamespaceRecord extends JsonObject {
  readonly spec_folder: string;
  readonly loop_type: LoopType;
  readonly session_id: string;
}

/** Exact immutable ledger location that introduced a claim. */
export interface SemanticLedgerOrigin extends JsonObject {
  readonly ledger_id: string;
  readonly sequence: number;
  readonly event_id: string;
  readonly record_hash: string;
}

/** Claim content retained beside the existing coverage-node identity. */
export interface SemanticClaimRecord extends JsonObject {
  readonly claim_id: string;
  readonly raw_text: string;
  readonly normalized_fingerprint: string;
  readonly evidence_links: string[];
  readonly namespace: SemanticNamespaceRecord;
  readonly coverage_node_name: string;
  readonly coverage_node_content_hash: string | null;
  readonly coverage_node_iteration: number | null;
  readonly originating_ledger_event: SemanticLedgerOrigin;
}

export type SemanticEquivalenceDecision =
  | 'equivalent'
  | 'topical_only'
  | 'distinct';

/** Exact-scoring output plus the provenance required to evaluate admission. */
export interface SemanticCandidateAssessment extends JsonObject {
  readonly candidate_claim_id: string;
  readonly model_name: string;
  readonly model_version: string;
  readonly metric: string;
  readonly score: number;
  readonly threshold_policy_id: string;
  readonly threshold_policy_version: string;
  readonly admission_threshold: number;
  readonly candidate_retrieval_method: string;
  readonly candidate_retrieval_version: string;
  readonly candidate_rank: number;
  readonly candidate_set_digest: string;
  readonly equivalence_decision: SemanticEquivalenceDecision;
  readonly equivalence_evaluator_id: string;
  readonly equivalence_evaluator_version: string;
  readonly equivalence_evidence_digest: string;
}

/** Sidecar edge that preserves the shipped edge namespace and endpoint boundary. */
export interface SemanticEquivalenceEdgeRecord extends JsonObject {
  readonly edge_id: string;
  readonly relation: typeof SEMANTIC_EQUIVALENCE_RELATION;
  readonly spec_folder: string;
  readonly loop_type: LoopType;
  readonly session_id: string;
  readonly source_id: string;
  readonly target_id: string;
  readonly projection_version: string;
  readonly model_name: string;
  readonly model_version: string;
  readonly metric: string;
  readonly score: number;
  readonly threshold_policy_id: string;
  readonly threshold_policy_version: string;
  readonly admission_threshold: number;
  readonly candidate_retrieval_method: string;
  readonly candidate_retrieval_version: string;
  readonly candidate_rank: number;
  readonly candidate_set_digest: string;
  readonly equivalence_evaluator_id: string;
  readonly equivalence_evaluator_version: string;
  readonly equivalence_evidence_digest: string;
  readonly originating_event_id: string;
  readonly originating_event_sequence: number;
}

/** Type-level proof that semantic edges extend rather than replace graph edges. */
export type SemanticCoverageEdgeBoundary = Omit<CoverageEdge, 'id' | 'relation' | 'metadata'> & {
  readonly id: string;
  readonly relation: typeof SEMANTIC_EQUIVALENCE_RELATION;
  readonly metadata: SemanticEquivalenceEdgeRecord;
};

// ───────────────────────────────────────────────────────────────────
// 4. COMMUNITY PROJECTION
// ───────────────────────────────────────────────────────────────────

export interface SemanticCommunityRecord extends JsonObject {
  readonly community_id: string;
  readonly representative_claim_id: string;
  readonly member_claim_ids: string[];
  readonly membership_version: string;
  readonly membership_version_hash: string;
}

export type SemanticMembershipStatus = 'stable' | 'ambiguous';

export interface SemanticMembershipRecord extends JsonObject {
  readonly claim_id: string;
  readonly status: SemanticMembershipStatus;
  readonly community_id: string | null;
  readonly candidate_community_ids: string[];
  readonly membership_version: string;
}

export type SemanticLineageKind = 'created' | 'continued' | 'merge' | 'split';

export interface SemanticCommunityLineageRecord extends JsonObject {
  readonly lineage_kind: SemanticLineageKind;
  readonly from_community_ids: string[];
  readonly to_community_ids: string[];
  readonly projection_version: string;
  readonly lineage_hash: string;
}

export interface SemanticCommunityProjection extends JsonObject {
  readonly schema_version: typeof SEMANTIC_PROJECTION_SCHEMA_VERSION;
  readonly namespace: SemanticNamespaceRecord;
  readonly projection_version: string;
  readonly config_digest: string;
  readonly claims: Readonly<Record<string, SemanticClaimRecord>>;
  readonly edges: Readonly<Record<string, SemanticEquivalenceEdgeRecord>>;
  readonly communities: Readonly<Record<string, SemanticCommunityRecord>>;
  readonly memberships: Readonly<Record<string, SemanticMembershipRecord>>;
  readonly lineage: SemanticCommunityLineageRecord[];
  readonly last_ledger_sequence: number;
}

/** Immutable history retains every config-addressed projection version. */
export interface SemanticProjectionHistory extends JsonObject {
  readonly namespace: SemanticNamespaceRecord;
  readonly active_projection_version: string;
  readonly versions: Readonly<Record<string, SemanticCommunityProjection>>;
}

// ───────────────────────────────────────────────────────────────────
// 5. INCREMENTAL AND NOVELTY OUTPUTS
// ───────────────────────────────────────────────────────────────────

export interface SemanticClaimObservation extends JsonObject {
  readonly projection_version: string;
  readonly config_digest: string;
  readonly claim: SemanticClaimRecord;
  readonly candidate_assessments: SemanticCandidateAssessment[];
}

export type SemanticConceptNovelty =
  | 'new_community'
  | 'existing_community_member'
  | 'ambiguous';

export type SemanticEvidenceNovelty = 'new_evidence' | 'no_new_evidence';

export interface SemanticNoveltyResult extends JsonObject {
  readonly claim_id: string;
  readonly projection_version: string;
  readonly concept: SemanticConceptNovelty;
  readonly evidence: SemanticEvidenceNovelty;
  readonly classifications: string[];
  readonly concept_novelty_increment: 0 | 1;
  readonly evidence_novelty_increment: number;
  readonly community_id: string | null;
}

export interface SemanticIncrementalTelemetry extends JsonObject {
  readonly candidate_count: number;
  readonly admitted_edge_count: number;
  readonly rescanned_claim_ids: string[];
  readonly affected_community_ids: string[];
  readonly full_rebuild_claim_count: number;
}

export interface SemanticIncrementalResult {
  readonly projection: SemanticCommunityProjection;
  readonly novelty: SemanticNoveltyResult;
  readonly telemetry: SemanticIncrementalTelemetry;
}

export interface SemanticNoveltyShadowResult {
  readonly authority: 'legacy_coverage_graph';
  readonly semantic: SemanticNoveltyResult;
  readonly legacy_graph_novelty_delta: number;
  readonly legacy_windowed_graph_novelty_delta: number | null;
}

// ───────────────────────────────────────────────────────────────────
// 6. COVERAGE-GRAPH BOUNDARY INPUTS
// ───────────────────────────────────────────────────────────────────

export interface CreateSemanticClaimInput {
  readonly node: CoverageNode;
  readonly rawText: string;
  readonly normalizedFingerprint: string;
  readonly evidenceLinks: readonly string[];
  readonly origin: SemanticLedgerOrigin;
}

export interface SemanticLegacyNoveltyInput {
  readonly nodes: readonly CoverageNode[];
  readonly edges: readonly CoverageEdge[];
  readonly snapshots: readonly CoverageSnapshot[];
  readonly slidingWindowSize?: number;
}

export type {
  CoverageEdge,
  CoverageNode,
  CoverageSnapshot,
  Namespace,
};

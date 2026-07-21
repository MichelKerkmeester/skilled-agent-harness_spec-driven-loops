// ───────────────────────────────────────────────────────────────────
// MODULE: Write-Set Conflict Graph Types
// ───────────────────────────────────────────────────────────────────

export const WRITE_SET_GRAPH_SCHEMA_VERSION = 'write-set-conflict-graph/v1' as const;

export const PHASE_013_WORKSTREAMS = [
  '001-deep-research',
  '002-deep-review',
  '003-deep-ai-council',
  '004-deep-improvement-common',
  '005-agent-improvement',
  '006-model-benchmark',
  '007-skill-benchmark',
  '008-deep-alignment',
] as const;

export type Phase013Workstream = typeof PHASE_013_WORKSTREAMS[number];

export const ResourceKinds = {
  ARTIFACT: 'artifact',
  BACKEND: 'backend',
  FILE: 'file',
  FIXTURE: 'fixture',
  GENERATED_OUTPUT: 'generated-output',
  LOCK: 'lock',
  STATE: 'state',
  UNKNOWN: 'unknown',
} as const;

export type ResourceKind = typeof ResourceKinds[keyof typeof ResourceKinds];
export type ResourceAccess = 'read' | 'write';
export type ResourceMutability =
  | 'append-only'
  | 'immutable'
  | 'mutable'
  | 'unknown'
  | 'write-once';

export type EvidenceBasis =
  | 'contract-declaration'
  | 'import-census'
  | 'required-constraint'
  | 'write-census';

export interface ResourceEvidence {
  readonly source_path: string;
  readonly basis: EvidenceBasis;
  readonly detail: string;
}

export interface ResourceInput {
  readonly identity: string;
  readonly canonical_id?: string;
  readonly kind: ResourceKind | string;
  readonly scope: string;
  readonly mutability: ResourceMutability;
  readonly access: ResourceAccess;
  readonly owner: string;
  readonly evidence: readonly ResourceEvidence[];
}

export interface CanonicalResource extends ResourceInput {
  readonly canonical_id: string;
  readonly kind: ResourceKind;
  readonly access: ResourceAccess;
  readonly evidence: readonly ResourceEvidence[];
}

export interface AliasGroup {
  readonly canonical_id: string;
  readonly aliases: readonly string[];
}

export interface ModeResourceDeclaration {
  readonly id: string;
  readonly modeSlug: string;
  readonly readSet: readonly ResourceInput[];
  readonly writeSet: readonly ResourceInput[];
  readonly sharedState: readonly ResourceInput[];
  readonly migrationDependencies: readonly string[];
  readonly contractRefs: readonly string[];
  readonly sourceRefs: readonly string[];
}

export interface SourceDigestInput {
  readonly path: string;
  readonly digest: string;
  readonly observedDigest: string;
}

export interface GeneratedSourceDigest {
  readonly path: string;
  readonly digest: string;
  readonly observed_digest: string;
  readonly status: 'fresh' | 'stale';
}

export interface GraphPolicy {
  readonly unknown_as_conflict: true;
  readonly default_schedule: 'serial-single-writer';
  readonly manual_edge_overrides: readonly [];
}

export interface GraphNode {
  readonly id: string;
  readonly mode_slug: string;
  readonly read_set: readonly CanonicalResource[];
  readonly write_set: readonly CanonicalResource[];
  readonly shared_state: readonly CanonicalResource[];
  readonly migration_dependencies: readonly string[];
  readonly contract_refs: readonly string[];
  readonly source_refs: readonly string[];
  readonly source_digest: string;
}

export type ConflictEdgeType =
  | 'fence'
  | 'hard-order'
  | 'shared-backend'
  | 'write-read'
  | 'write-write';

export interface ConflictEdge {
  readonly id: string;
  readonly from: string;
  readonly to: string;
  readonly edge_type: ConflictEdgeType;
  readonly edge_origin: 'declared' | 'derived' | 'required-constraint' | 'unknown-widening';
  readonly resources: readonly string[];
  readonly serialization: 'mutual-exclusion' | 'predecessor';
  readonly reason: string;
  readonly evidence: readonly ResourceEvidence[];
}

export interface IndependentAssertion {
  readonly left: string;
  readonly right: string;
  readonly assertion: 'independent-if-resource-disjoint';
  readonly validated: boolean;
  readonly conflict_edge_ids: readonly string[];
  readonly evidence: readonly string[];
  readonly reason: string;
}

export interface GraphValidationIssue {
  readonly code: string;
  readonly message: string;
  readonly node_ids: readonly string[];
  readonly resources: readonly string[];
  readonly source_paths: readonly string[];
}

export interface PredecessorCompletionEvidence {
  readonly required: readonly string[];
  readonly completed_before_lane: readonly string[];
  readonly pending: readonly string[];
}

export interface LaneDecision {
  readonly node_ids: readonly [string];
  readonly predecessor_completion: PredecessorCompletionEvidence;
  readonly conflict_resources: readonly string[];
  readonly fence_resources: readonly string[];
  readonly source_digest: string;
  readonly schedule_class: 'parallel-safe' | 'serialized';
  readonly refusal_reason: string | null;
}

export interface ScheduleLane {
  readonly lane_id: string;
  readonly node_ids: readonly string[];
}

export interface GraphSchedule {
  readonly schedule_class: 'parallel-safe-antichains' | 'serial-single-writer';
  readonly graph_state: 'fallback' | 'ready';
  readonly phase_gate_complete: false;
  readonly phase_gate_status: 'refused-incomplete-evidence' | 'requires-external-verification';
  readonly widened_parallelism: boolean;
  readonly missing_evidence: readonly GraphValidationIssue[];
  readonly lanes: readonly ScheduleLane[];
  readonly decisions: readonly LaneDecision[];
}

export interface WriteSetConflictGraph {
  readonly schema_version: typeof WRITE_SET_GRAPH_SCHEMA_VERSION;
  readonly base_identity: string;
  readonly generated_from: readonly GeneratedSourceDigest[];
  readonly policy: GraphPolicy;
  readonly nodes: readonly GraphNode[];
  readonly edges: readonly ConflictEdge[];
  readonly independent_assertions: readonly IndependentAssertion[];
  readonly schedule: GraphSchedule;
  readonly graph_digest: string;
}

export interface GraphBuildInput {
  readonly baseIdentity: string;
  readonly manifestWorkstreams: readonly string[];
  readonly declarations: readonly ModeResourceDeclaration[];
  readonly sourceDigests: readonly SourceDigestInput[];
  readonly requiredSourcePaths?: readonly string[];
  readonly aliasGroups?: readonly AliasGroup[];
  readonly policy?: Partial<GraphPolicy>;
}

export interface GraphReuseInput {
  readonly baseIdentity: string;
  readonly manifestWorkstreams: readonly string[];
  readonly declarations: readonly ModeResourceDeclaration[];
  readonly observedSourceDigests: Readonly<Record<string, string>>;
  readonly aliasGroups?: readonly AliasGroup[];
}

export interface GraphReuseDecision {
  readonly accepted: boolean;
  readonly graph_refresh_required: boolean;
  readonly required_schedule: 'parallel-safe-antichains' | 'serial-single-writer';
  readonly phase_gate_complete: false;
  readonly reasons: readonly string[];
  readonly graph_digest: string;
  readonly source_evidence: readonly GeneratedSourceDigest[];
}

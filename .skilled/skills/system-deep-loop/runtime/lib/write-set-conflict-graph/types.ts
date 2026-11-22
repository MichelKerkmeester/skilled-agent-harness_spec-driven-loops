// ───────────────────────────────────────────────────────────────────
// MODULE: Write-Set Conflict Graph Types
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

export const WRITE_SET_GRAPH_SCHEMA_VERSION = 'write-set-conflict-graph/v1' as const;

export const PHASE_013_WORKSTREAMS = [
  '001-deep-research',
  '002-deep-review',
] as const;

// ───────────────────────────────────────────────────────────────────
// 2. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

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

/** Where a resource claim comes from: the source path, the kind of basis and a detail line. */
export interface ResourceEvidence {
  readonly source_path: string;
  readonly basis: EvidenceBasis;
  readonly detail: string;
}

/** A resource as a mode declares it, before alias resolution and kind checks. */
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

/** A declared resource after canonicalization, with a resolved canonical id and a known kind. */
export interface CanonicalResource extends ResourceInput {
  readonly canonical_id: string;
  readonly kind: ResourceKind;
  readonly access: ResourceAccess;
  readonly evidence: readonly ResourceEvidence[];
}

/** Identities that all name the same canonical resource. */
export interface AliasGroup {
  readonly canonical_id: string;
  readonly aliases: readonly string[];
}

/** One mode's read set, write set, shared state, migration dependencies and the refs they were taken from. */
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

/** A source path with its recorded digest and the digest observed now. */
export interface SourceDigestInput {
  readonly path: string;
  readonly digest: string;
  readonly observedDigest: string;
}

/** A graph source path with its recorded and observed digests, marked stale when they differ. */
export interface GeneratedSourceDigest {
  readonly path: string;
  readonly digest: string;
  readonly observed_digest: string;
  readonly status: 'fresh' | 'stale';
}

/**
 * Fail-closed graph policy: unknown resources count as conflicts, the default schedule is serial and no manual
 * edge overrides exist.
 */
export interface GraphPolicy {
  readonly unknown_as_conflict: true;
  readonly default_schedule: 'serial-single-writer';
  readonly manual_edge_overrides: readonly [];
}

/** A graph node for one mode, holding its canonical resource sets and source digest. */
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

/** A conflict between two nodes: its type, origin, resources, how it serializes them and the evidence for it. */
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

/** A claim that two nodes are independent when their resources are disjoint, and whether the graph validated it. */
export interface IndependentAssertion {
  readonly left: string;
  readonly right: string;
  readonly assertion: 'independent-if-resource-disjoint';
  readonly validated: boolean;
  readonly conflict_edge_ids: readonly string[];
  readonly evidence: readonly string[];
  readonly reason: string;
}

/** One graph validation problem, naming the nodes, resources and source paths involved. */
export interface GraphValidationIssue {
  readonly code: string;
  readonly message: string;
  readonly node_ids: readonly string[];
  readonly resources: readonly string[];
  readonly source_paths: readonly string[];
}

/** Which predecessors a lane requires, which completed before it and which are still pending. */
export interface PredecessorCompletionEvidence {
  readonly required: readonly string[];
  readonly completed_before_lane: readonly string[];
  readonly pending: readonly string[];
}

/**
 * Scheduling decision for a single-node lane: its predecessors, conflict and fence resources, class and any
 * refusal reason.
 */
export interface LaneDecision {
  readonly node_ids: readonly [string];
  readonly predecessor_completion: PredecessorCompletionEvidence;
  readonly conflict_resources: readonly string[];
  readonly fence_resources: readonly string[];
  readonly source_digest: string;
  readonly schedule_class: 'parallel-safe' | 'serialized';
  readonly refusal_reason: string | null;
}

/** One scheduled lane and the nodes in it. */
export interface ScheduleLane {
  readonly lane_id: string;
  readonly node_ids: readonly string[];
}

/** The derived schedule, its lanes and decisions, and the missing evidence that keeps the phase gate incomplete. */
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

/** Digested write-set conflict graph: its sources, policy, nodes, edges, independence assertions and schedule. */
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

/**
 * Manifest workstreams, mode declarations and source digests to derive a graph from, with optional aliases and
 * policy overrides.
 */
export interface GraphBuildInput {
  readonly baseIdentity: string;
  readonly manifestWorkstreams: readonly string[];
  readonly declarations: readonly ModeResourceDeclaration[];
  readonly sourceDigests: readonly SourceDigestInput[];
  readonly requiredSourcePaths?: readonly string[];
  readonly aliasGroups?: readonly AliasGroup[];
  readonly policy?: Partial<GraphPolicy>;
}

/** Current manifest, declarations and observed source digests a stored graph is checked against before reuse. */
export interface GraphReuseInput {
  readonly baseIdentity: string;
  readonly manifestWorkstreams: readonly string[];
  readonly declarations: readonly ModeResourceDeclaration[];
  readonly observedSourceDigests: Readonly<Record<string, string>>;
  readonly aliasGroups?: readonly AliasGroup[];
}

/**
 * Whether a stored graph may be reused, the schedule required either way and the reasons and source evidence
 * behind the decision.
 */
export interface GraphReuseDecision {
  readonly accepted: boolean;
  readonly graph_refresh_required: boolean;
  readonly required_schedule: 'parallel-safe-antichains' | 'serial-single-writer';
  readonly phase_gate_complete: false;
  readonly reasons: readonly string[];
  readonly graph_digest: string;
  readonly source_evidence: readonly GeneratedSourceDigest[];
}

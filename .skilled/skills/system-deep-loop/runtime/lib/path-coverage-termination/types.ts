// ───────────────────────────────────────────────────────────────────
// MODULE: Path Coverage Termination Types
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import type {
  AuthorizationReference,
  LedgerHead,
} from '../authorized-ledger/authorized-ledger-types.js';
import type { VerifiedAuthorizationAudit } from '../authorized-ledger/index.js';
import type { ClaimRelationshipProjection } from '../contradiction-supersession/index.js';
import type { ReplayFingerprintDescriptor } from '../replay-fingerprint/index.js';
import type {
  SemanticCommunityProjection,
  SemanticConceptNovelty,
} from '../semantic-communities/index.js';

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

export const PATH_COVERAGE_SCHEMA_VERSION = 'path-coverage-termination@1' as const;
export const COVERAGE_UNIVERSE_SCHEMA_VERSION = 'coverage-universe@1' as const;
export const PATH_COVERAGE_PROJECTION_VERSION = 'path-coverage-projection@1' as const;

// ───────────────────────────────────────────────────────────────────
// 3. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

export type PathCoverageMode =
  | 'research'
  | 'review'
  | 'context';

export type PathState = 'unvisited' | 'active' | 'addressed' | 'blocked' | 'excluded';
export type CloseablePathState = Extract<PathState, 'addressed' | 'excluded'>;
export type TerminationDecision =
  | 'STOP_ALLOWED'
  | 'STOP_BLOCKED'
  | 'CONTINUE'
  | 'INCOMPLETE_LIMIT';

/** A required coverage dimension, declared by the profile or taken from semantic communities. */
export interface CoverageDimensionDefinition {
  readonly dimensionId: string;
  readonly source: 'declared' | 'semantic-community';
  readonly required: true;
}

/** A mandatory major region over a set of dimensions, with its weight and required evidence classes. */
export interface MajorRegionDefinition {
  readonly regionId: string;
  readonly dimensionIds: readonly string[];
  readonly mandatory: true;
  readonly major: true;
  readonly weight: number;
  readonly requiredEvidenceClasses: readonly string[];
}

/** Rule that builds major regions as cartesian products of the listed dimensions. */
export interface MajorRegionRule {
  readonly ruleId: string;
  readonly kind: 'cartesian-products';
  readonly regions: readonly MajorRegionDefinition[];
}

/** Versioned contradiction policy, which always blocks on unresolved critical contradictions. */
export interface ContradictionPolicy {
  readonly policyId: string;
  readonly policyVersion: string;
  readonly blockUnresolvedCritical: true;
}

/**
 * A mode's coverage profile: its dimensions, region rule, mandatory evidence, contradiction policy and closeable
 * path states.
 */
export interface ModeCoverageProfile {
  readonly mode: PathCoverageMode;
  readonly profileVersion: string;
  readonly pathDimensions: readonly CoverageDimensionDefinition[];
  readonly majorRegionRule: MajorRegionRule;
  readonly mandatoryEvidenceClasses: readonly string[];
  readonly contradictionPolicy: ContradictionPolicy;
  readonly closeableStatuses: readonly CloseablePathState[];
}

/** Spec folder and session that a coverage universe is scoped to. */
export interface CoverageNamespace {
  readonly specFolder: string;
  readonly sessionId: string;
}

/** One mandatory path through a region, given by its dimension coordinates, weight and required evidence. */
export interface CoveragePath {
  readonly pathId: string;
  readonly regionId: string;
  readonly coordinates: Readonly<Record<string, string>>;
  readonly mandatory: true;
  readonly major: true;
  readonly weight: number;
  readonly requiredEvidenceClasses: readonly string[];
  readonly semanticCommunityId: string | null;
}

/** Versioned set of paths a run must cover, linked to the universe it replaces and the ones it invalidates. */
export interface CoverageUniverse {
  readonly schemaVersion: typeof COVERAGE_UNIVERSE_SCHEMA_VERSION;
  readonly universeId: string;
  readonly universeVersion: number;
  readonly predecessorUniverseId: string | null;
  readonly invalidatesUniverseIds: readonly string[];
  readonly namespace: CoverageNamespace;
  readonly runId: string;
  readonly mode: PathCoverageMode;
  readonly profileVersion: string;
  readonly inputFingerprint: string;
  readonly coverageGraphProjectionVersion: string;
  readonly communityProjectionVersion: string;
  readonly communityMembershipDigest: string;
  readonly relationshipProjectionVersion: string;
  readonly ledgerHead: LedgerHead;
  readonly replayFingerprint: string;
  readonly frozen: true;
  readonly valid: boolean;
  readonly invalidReasons: readonly string[];
  readonly dimensionValues: Readonly<Record<string, readonly string[]>>;
  readonly paths: readonly CoveragePath[];
  readonly ambiguousMajorCommunityIds: readonly string[];
}

/** Profile, dimension values and semantic and relationship projections to compile a run's coverage universe from. */
export interface CompileCoverageUniverseInput {
  readonly namespace: CoverageNamespace;
  readonly runId: string;
  readonly mode: PathCoverageMode;
  readonly profileVersion: string;
  readonly inputFingerprint: string;
  readonly dimensionValues: Readonly<Record<string, readonly string[]>>;
  readonly semanticCommunityProjection: SemanticCommunityProjection;
  readonly relationshipProjection: ClaimRelationshipProjection;
  readonly ledgerHead: LedgerHead;
  readonly replayFingerprint: string | ReplayFingerprintDescriptor;
}

/** Ledger position and record hash of the event a coverage fact came from. */
export interface LedgerEventOrigin {
  readonly ledgerId: string;
  readonly sequence: number;
  readonly eventId: string;
  readonly recordHash: string;
}

interface EvidenceLocatorBase {
  readonly evidenceClass: string;
  readonly digest: string;
}

/** Evidence that points at a ledger event by ledger, sequence and event id. */
export interface LedgerEventEvidenceLocator extends EvidenceLocatorBase {
  readonly kind: 'ledger-event';
  readonly ledgerId: string;
  readonly sequence: number;
  readonly eventId: string;
}

/** Evidence that points at a row in a coverage, semantic-community or claim-relationship projection. */
export interface ProjectionRowEvidenceLocator extends EvidenceLocatorBase {
  readonly kind: 'projection-row';
  readonly projectionKind: 'coverage-graph' | 'semantic-community' | 'claim-relationship';
  readonly projectionVersion: string;
  readonly rowId: string;
}

export type EvidenceLocator = LedgerEventEvidenceLocator | ProjectionRowEvidenceLocator;

/** An authorized reason to exclude a path, pinned to the policy and the authorization that allowed it. */
export interface AuthorizedExclusion {
  readonly reasonCode: string;
  readonly policyId: string;
  readonly policyVersion: string;
  readonly authorization: AuthorizationReference;
}

interface PathCoverageEventBase {
  readonly pathId: string;
  readonly origin: LedgerEventOrigin;
}

/** Event that activates a path for coverage. */
export interface PathActivatedEvent extends PathCoverageEventBase {
  readonly kind: 'path-activated';
}

/** Event that marks a path addressed, with the evidence for it. */
export interface PathAddressedEvent extends PathCoverageEventBase {
  readonly kind: 'path-addressed';
  readonly evidence: readonly EvidenceLocator[];
}

/** Event that blocks a path on a named blocker. */
export interface PathBlockedEvent extends PathCoverageEventBase {
  readonly kind: 'path-blocked';
  readonly blockerId: string;
}

/** Event that excludes a path under an authorized exclusion, with the evidence for it. */
export interface PathExcludedEvent extends PathCoverageEventBase {
  readonly kind: 'path-excluded';
  readonly exclusion: AuthorizedExclusion;
  readonly evidence: readonly EvidenceLocator[];
}

/** Event recording novel evidence for a semantic concept, optionally within a community. */
export interface SemanticNoveltyObservedEvent {
  readonly kind: 'semantic-novelty-observed';
  readonly communityId: string | null;
  readonly concept: SemanticConceptNovelty;
  readonly evidence: readonly EvidenceLocator[];
  readonly origin: LedgerEventOrigin;
}

export type PathCoverageEvent =
  | PathActivatedEvent
  | PathAddressedEvent
  | PathBlockedEvent
  | PathExcludedEvent
  | SemanticNoveltyObservedEvent;

/** One state change of a path, with the ledger event and reason that caused it. */
export interface PathTransitionRecord {
  readonly eventId: string;
  readonly ledgerSequence: number;
  readonly from: PathState;
  readonly to: PathState;
  readonly reason: string;
}

/** A path's current state, evidence, blockers, any exclusion and its full transition history. */
export interface PathCoverageRecord {
  readonly pathId: string;
  readonly state: PathState;
  readonly evidence: readonly EvidenceLocator[];
  readonly blockerIds: readonly string[];
  readonly exclusion: AuthorizedExclusion | null;
  readonly transitions: readonly PathTransitionRecord[];
}

/** Novel evidence recorded for a semantic community and concept at one ledger event. */
export interface SemanticEvidenceGrowthRecord {
  readonly communityId: string;
  readonly concept: SemanticConceptNovelty;
  readonly evidence: readonly EvidenceLocator[];
  readonly eventId: string;
  readonly ledgerSequence: number;
}

/**
 * Coverage state of every path in a universe, with semantic growth, late major regions and staleness, as of a
 * ledger sequence.
 */
export interface PathCoverageProjection {
  readonly projectionVersion: typeof PATH_COVERAGE_PROJECTION_VERSION;
  readonly universeId: string;
  readonly paths: Readonly<Record<string, PathCoverageRecord>>;
  readonly semanticEvidenceGrowth: readonly SemanticEvidenceGrowthRecord[];
  readonly lateDiscoveredMajorRegionIds: readonly string[];
  readonly staleUniverse: boolean;
  readonly sourceEventIds: readonly string[];
  readonly lastLedgerSequence: number;
  readonly projectionHash: string;
}

/** Something that blocks stopping (STOP) or only warns about it (WARN), with the reason. */
export interface StopBlocker {
  readonly blockerId: string;
  readonly severity: 'STOP' | 'WARN';
  readonly reason: string;
}

export type LimitKind = 'iteration' | 'time' | 'budget';

export type LimitStatus =
  | { readonly reached: false }
  | {
    readonly reached: true;
    readonly kind: LimitKind;
    readonly limitId: string;
  };

/** A run limit that has fired, by kind and id. */
export interface TriggeredLimit {
  readonly kind: LimitKind;
  readonly limitId: string;
}

/** Whether the semantic and relationship projections are fresh, with the versions and ledger sequence checked. */
export interface ProjectionFreshness {
  readonly fresh: boolean;
  readonly communityProjectionVersion: string;
  readonly communityMembershipDigest: string;
  readonly relationshipProjectionVersion: string;
  readonly ledgerSequence: number;
}

/**
 * Universe, projection, authorization audit, freshness, blockers and limit status the termination decision is
 * made from.
 */
export interface EvaluatePathCoverageInput {
  readonly universe: CoverageUniverse;
  readonly activeUniverseId: string;
  readonly projection: PathCoverageProjection;
  readonly authorizationAudit: VerifiedAuthorizationAudit;
  readonly relationshipProjection: ClaimRelationshipProjection;
  readonly projectionFreshness: ProjectionFreshness;
  readonly stopBlockers: readonly StopBlocker[];
  readonly limit: LimitStatus;
}

/** A path as recorded in a coverage certificate, with its state and evidence. */
export interface CertificatePathRecord {
  readonly pathId: string;
  readonly regionId: string;
  readonly mandatory: boolean;
  readonly major: boolean;
  readonly weight: number;
  readonly state: PathState;
  readonly requiredEvidenceClasses: readonly string[];
  readonly evidence: readonly EvidenceLocator[];
  readonly blockerIds: readonly string[];
  readonly exclusion: AuthorizedExclusion | null;
}

/** Hashed certificate of a termination decision and the coverage it was based on. */
export interface CoverageCertificate {
  readonly schemaVersion: typeof PATH_COVERAGE_SCHEMA_VERSION;
  readonly certificateHash: string;
  readonly decision: TerminationDecision;
  readonly universeId: string;
  readonly universeVersion: number;
  readonly profileVersion: string;
  readonly mode: PathCoverageMode;
  readonly runId: string;
  readonly inputFingerprint: string;
  readonly replayFingerprint: string;
  readonly ledgerHead: LedgerHead;
  readonly coverageGraphProjectionVersion: string;
  readonly communityProjectionVersion: string;
  readonly communityMembershipDigest: string;
  readonly relationshipProjectionVersion: string;
  readonly projectionFresh: boolean;
  readonly denominator: number;
  readonly closedPathCount: number;
  readonly addressedMajorRegions: number;
  readonly totalMajorRegions: number;
  readonly unweightedCoverage: number;
  readonly weightedCoverage: number;
  readonly openPathIds: readonly string[];
  readonly blockedPathIds: readonly string[];
  readonly blockerIds: readonly string[];
  readonly unresolvedContradictionIds: readonly string[];
  readonly ambiguousMajorCommunityIds: readonly string[];
  readonly exclusions: readonly AuthorizedExclusion[];
  readonly paths: readonly CertificatePathRecord[];
  readonly semanticEvidenceGrowth: readonly SemanticEvidenceGrowthRecord[];
  readonly triggeredLimit: TriggeredLimit | null;
}

/** One uncovered path, ranked for follow-up, with its state, weight, blockers and required evidence. */
export interface UncoveredPathReport {
  readonly rank: number;
  readonly pathId: string;
  readonly regionId: string;
  readonly state: PathState;
  readonly mandatory: boolean;
  readonly weight: number;
  readonly blockerIds: readonly string[];
  readonly requiredEvidenceClasses: readonly string[];
  readonly missingEvidenceClasses: readonly string[];
}

/** Coverage summary given whenever stopping is not allowed: region counts, weighted and unweighted coverage. */
export interface PartialCoverageReport {
  readonly decision: Exclude<TerminationDecision, 'STOP_ALLOWED'>;
  readonly certificateHash: string;
  readonly universeId: string;
  readonly denominator: number;
  readonly addressedMajorRegions: number;
  readonly totalMajorRegions: number;
  readonly weightedCoverage: number;
  readonly unweightedCoverage: number;
  readonly openPathIds: readonly string[];
  readonly blockedPathIds: readonly string[];
  readonly blockerIds: readonly string[];
  readonly unresolvedContradictionIds: readonly string[];
  readonly projectionVersions: Readonly<{
    coverageGraph: string;
    community: string;
    communityMembership: string;
    relationship: string;
  }>;
  readonly triggeredLimit: TriggeredLimit | null;
  readonly uncoveredPaths: readonly UncoveredPathReport[];
  readonly authorizedExclusions: readonly AuthorizedExclusion[];
}

/** Termination decision with its reason, certificate and a partial coverage report when stopping is not allowed. */
export interface PathCoverageEvaluation {
  readonly decision: TerminationDecision;
  readonly reason: string;
  readonly certificate: CoverageCertificate;
  readonly partialCoverage: PartialCoverageReport | null;
}

/** The legacy convergence output fields the path-coverage shadow is laid beside. */
export interface LegacyConvergenceBridge {
  readonly status: unknown;
  readonly data: unknown;
  readonly graph_decision: string;
  readonly graph_decision_json: string;
  readonly graph_signals_json: unknown;
  readonly graph_blockers_json: unknown;
  readonly graph_blockers_csv: string;
  readonly graph_stop_blocked: boolean;
  readonly graph_trace_json: unknown;
  readonly graph_convergence_score: number;
  readonly [key: string]: unknown;
}

/**
 * Shadow result in which legacy convergence stays authoritative and the path-coverage decision rides along in
 * the bridge.
 */
export interface PathCoverageShadowEvaluation {
  readonly authority: 'legacy-convergence';
  readonly authoritativeDecision: string;
  readonly legacyBridge: Readonly<LegacyConvergenceBridge>;
  readonly pathCoverage: PathCoverageEvaluation;
  readonly bridge: Readonly<LegacyConvergenceBridge & {
    path_coverage_shadow_only: true;
    path_coverage_decision: TerminationDecision;
    path_coverage_certificate: CoverageCertificate;
    path_coverage_partial_report: PartialCoverageReport | null;
    path_coverage_disagrees: boolean;
  }>;
}

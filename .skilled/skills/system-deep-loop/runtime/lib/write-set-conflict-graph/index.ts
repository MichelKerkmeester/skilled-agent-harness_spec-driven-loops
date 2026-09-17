// ───────────────────────────────────────────────────────────────────
// MODULE: Write-Set Conflict Graph Public API
// ───────────────────────────────────────────────────────────────────

export {
  PairClassificationFailureCodes,
  WRITE_SET_CONFLICT_ARTIFACT_SCHEMA_VERSION,
  buildWriteSetConflictArtifact,
  buildWriteSetConflictArtifactBytes,
  createWriteSetConflictArtifact,
  serializeWriteSetConflictArtifact,
} from './artifact.js';
export {
  DEFAULT_ALIAS_GROUPS,
  buildAliasIndex,
  canonicalizeResource,
  normalizeResourceIdentity,
} from './canonicalize.js';
export {
  WriteSetGraphErrorCodes,
  WriteSetGraphValidationError,
} from './errors.js';
export {
  GRAPH_CONTRACT_SOURCE_PATHS,
  collectRequiredSourcePaths,
  deriveWriteSetConflictGraph,
  validateGraphForReuse,
  validateManifestNodeSet,
} from './graph.js';
export {
  SHIPPED_MODE_CENSUS,
  SHIPPED_MODE_CENSUS_VERSION,
  shippedModeCensus,
} from './shipped-census.js';
export { stableDigest, stableStringify } from './stable-digest.js';
export {
  PHASE_013_WORKSTREAMS,
  ResourceKinds,
  WRITE_SET_GRAPH_SCHEMA_VERSION,
} from './types.js';

export type {
  PairClassificationFailure,
  PairClassificationFailureCode,
  WorkstreamPairClassification,
  WriteSetConflictArtifact,
} from './artifact.js';
export type {
  AliasGroup,
  CanonicalResource,
  ConflictEdge,
  ConflictEdgeType,
  GeneratedSourceDigest,
  GraphBuildInput,
  GraphNode,
  GraphPolicy,
  GraphReuseDecision,
  GraphReuseInput,
  GraphSchedule,
  GraphValidationIssue,
  IndependentAssertion,
  LaneDecision,
  ModeResourceDeclaration,
  Phase013Workstream,
  ResourceAccess,
  ResourceEvidence,
  ResourceInput,
  ResourceKind,
  ResourceMutability,
  ScheduleLane,
  SourceDigestInput,
  WriteSetConflictGraph,
} from './types.js';

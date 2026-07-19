// ────────────────────────────────────────────────────────────────
// MODULE: Index, Public API surface
// ────────────────────────────────────────────────────────────────
// @public, Only export what external consumers (scripts/, other packages) need.
// Internal mcp_server code should import from lib/ directly, not through this barrel.
// ARCH-1: Consumer scripts import from '@spec-kit/mcp-server/api' instead of lib/.
// Review note: Barrel is wide due to legitimate external consumers in scripts/evals,
// scripts/core, scripts/spec-folder, and scripts/memory. Do not narrow without
// auditing all consumers first.

export {
  runAblation,
  storeAblationResults,
  formatAblationReport,
  toHybridSearchFlags,
  isAblationEnabled,
  inspectGroundTruthAlignment,
  assertGroundTruthAlignment,
  ALL_CHANNELS,
  type AblationChannel,
  type AblationSearchFn,
  type AblationReport,
  type GroundTruthAlignmentSummary,
  runBM25Baseline,
  recordBaselineMetrics,
  type BM25SearchFn,
  type BM25SearchResult,
  type BM25BaselineResult,
  loadGroundTruth,
  initEvalDb,
} from './eval.js';

export {
  initializeIndexingRuntime,
  warmEmbeddingModel,
  runMemoryIndexScan,
  refreshGraphMetadata,
  reindexSpecDocs,
  runEnrichmentBackfill,
  closeIndexingRuntime,
  type MemoryIndexScanArgs,
} from './indexing.js';

export {
  initHybridSearch,
  hybridSearchEnhanced,
  type HybridSearchOptions,
  type HybridSearchResult,
  fts5Bm25Search,
  isFts5Available,
  vectorIndex,
} from './search.js';

export {
  generateEmbedding,
  generateQueryEmbedding,
  getEmbeddingProfile,
  retryManager,
} from './providers.js';

export {
  initCheckpoints,
  initAccessTracker,
} from './storage.js';

// --- Git-hook drift marker writer (used by scripts/git-hooks) ---
export { resolveDatabasePaths } from '../core/config.js';
export {
  resolveMemoryDriftMarkerPath,
  memoryDriftMarkerEntryKey,
} from '../lib/storage/memory-drift-healing.js';
export type {
  MemoryDriftMarkerEntry,
  MemoryDriftMarkerPayload,
} from '../lib/storage/memory-drift-healing.js';
export { atomicWriteFile } from '../lib/storage/transaction-manager.js';
export {
  isReclaimableLock,
  reclaimInterprocessLock,
  createInterprocessLock,
  releaseInterprocessLock,
} from '../handlers/save/spec-folder-mutex.js';
export type { InterprocessLockHandle } from '../handlers/save/spec-folder-mutex.js';

export {
  GOVERNANCE_AUDIT_ACTIONS,
  buildGovernanceLogicalKey,
  ensureGovernanceRuntime,
  recordGovernanceAudit,
  recordTierDowngradeAudit,
} from '../lib/governance/scope-governance.js';

export {
  isIndexableConstitutionalMemoryPath,
  shouldIndexForMemory,
  isExcludedFromGeneratedMetadata,
} from '../lib/utils/index-scope.js';
export {
  canClassifyAsGraphMetadataPath,
  resolveSpecFolderIdentity,
  SpecFolderIdentityError,
} from '../lib/config/spec-doc-paths.js';
export type { SpecFolderIdentity } from '../lib/config/spec-doc-paths.js';
export {
  validateFolder,
  type ValidateOpts,
  type ValidationEntry,
  type ValidationReport,
} from '../lib/validation/orchestrator.js';
export {
  buildContinuityFingerprint,
  ZERO_CONTINUITY_FINGERPRINT,
} from '../lib/validation/spec-doc-structure.js';
export type {
  GovernanceAuditAction,
  GovernanceAuditEntry,
  TierDowngradeAuditParams,
} from '../lib/governance/scope-governance.js';

// --- Folder discovery (used by scripts/spec-folder, scripts/core) ---
export {
  generatePerFolderDescription,
  savePerFolderDescription,
  loadPerFolderDescription,
  loadExistingDescription,
  wouldWritePerFolderDescription,
  extractKeywords,
  slugifyFolderName,
  getRepairMergeSafe,
} from '../lib/search/folder-discovery.js';
export type { PerFolderDescription, LoadResult } from '../lib/search/folder-discovery.js';

// --- Entity extraction (used by scripts/memory) ---
export {
  extractEntities,
  rebuildAutoEntities,
} from '../lib/extraction/entity-extractor.js';

// --- Graph metadata (used by scripts/core, scripts/graph, tests) ---
export {
  GRAPH_METADATA_DOCUMENT_TYPE,
  GRAPH_METADATA_FILENAME,
  GRAPH_METADATA_MIGRATED_QUALITY_FLAG,
  GRAPH_METADATA_SCHEMA_VERSION,
  GRAPH_METADATA_STATUS_VALUES,
  SAVE_LINEAGE_VALUES,
  createEmptyGraphMetadataManual,
  graphMetadataLoadSchema,
  graphMetadataSchema,
  packetReferenceSchema,
  graphEntityReferenceSchema,
} from '../lib/graph/graph-metadata-schema.js';
export type {
  GraphMetadata,
  GraphMetadataDerived,
  GraphMetadataMigrationSource,
  GraphMetadataManual,
  GraphMetadataStatus,
  GraphEntityReference,
  PacketReference,
  SaveLineage,
} from '../lib/graph/graph-metadata-schema.js';
export {
  GENERATED_METADATA_INTEGRITY_RULE,
  STATUS_COMPLETE_EVIDENCE_MISMATCH_CODE,
  checkGeneratedMetadataIntegrity,
  resolveGeneratedMetadataIntegrity,
} from '../lib/validation/generated-metadata-integrity.js';
export type {
  GeneratedMetadataViolation,
  GeneratedMetadataIntegrityReport,
  ResolvedIntegrityStatus,
} from '../lib/validation/generated-metadata-integrity.js';
export {
  GENERATED_METADATA_DRIFT_RULE,
  checkGeneratedMetadataDrift,
  computeSourceDocHashes,
  resolveGeneratedMetadataDrift,
} from '../lib/graph/generated-metadata-drift.js';
export type {
  DriftedSynopsisField,
  GeneratedMetadataDriftReport,
  ResolvedDriftStatus,
} from '../lib/graph/generated-metadata-drift.js';
export {
  derivePacketSynopsis,
  SYNOPSIS_FIELD_LIMITS,
} from '../lib/description/packet-synopsis.js';
export type { SynopsisField } from '../lib/description/packet-synopsis.js';
export {
  validateGraphMetadataContent,
  loadGraphMetadata,
  deriveGraphMetadata,
  mergeGraphMetadata,
  graphMetadataEqualIgnoringVolatile,
  collectChildrenPruneCandidates,
  serializeGraphMetadata,
  writeGraphMetadataFile,
  refreshGraphMetadataForSpecFolder,
  graphMetadataToIndexableText,
  packetReferencesToCausalLinks,
} from '../lib/graph/graph-metadata-parser.js';
export type { GraphMetadataPruneCandidate } from '../lib/graph/graph-metadata-parser.js';
export type { GraphMetadataValidationResult } from '../lib/graph/graph-metadata-parser.js';

// --- Performance benchmarking support (used by scripts/evals) ---
export * as sessionBoost from '../lib/search/session-boost.js';
export * as causalBoost from '../lib/search/causal-boost.js';
export * as workingMemory from '../lib/cognitive/working-memory.js';
export {
  initExtractionAdapter,
  getExtractionMetrics,
  resetExtractionMetrics,
} from '../lib/extraction/extraction-adapter.js';
export type { ExtractionMetrics } from '../lib/extraction/extraction-adapter.js';

// --- Hybrid RAG Fusion rollout metadata and architecture surfaces ---
export {
  LAYER_DEFINITIONS,
  TOOL_LAYER_MAP,
  getLayerForTool,
  getLayerTokenBudget,
} from '../lib/architecture/layer-definitions.js';
export type { LayerDefinition, LayerId } from '../lib/architecture/layer-definitions.js';

export {
  GENERATED_METADATA_GRANDFATHER_ENV,
  getMemoryRoadmapCapabilityFlags,
  getMemoryRoadmapDefaults,
  getMemoryRoadmapPhase,
  isGeneratedMetadataGrandfatherEnabled,
  isStatusCompletionConsistencyGateEnabled,
  STATUS_COMPLETION_CONSISTENCY_GATE_ENV,
} from '../lib/config/capability-flags.js';
export type { MemoryRoadmapCapabilityFlags } from '../lib/config/capability-flags.js';

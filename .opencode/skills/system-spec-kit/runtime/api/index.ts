// ───────────────────────────────────────────────────────────────────
// MODULE: Index, Public API surface
// ───────────────────────────────────────────────────────────────────
// @public, Only export what external consumers (runtime/cli/, other packages) need.
// Internal runtime code should import from lib/ directly, not through this barrel.
// Consumer scripts import from '@spec-kit/runtime/api' instead of lib/.
// Every export below has a named caller in the CLI workspace; adding one
// without a caller re-widens the surface that made this package hard to shrink.

export { refreshGraphMetadata } from './graph-refresh.js';

// --- Spec folder identity and validation (used by runtime/cli/spec-folder, runtime/cli/graph) ---
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

// --- Folder discovery (used by runtime/cli/spec-folder, runtime/cli/core, runtime/cli/continuity) ---
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

// --- Graph metadata (used by runtime/cli/core, runtime/cli/graph, runtime/cli/continuity) ---
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

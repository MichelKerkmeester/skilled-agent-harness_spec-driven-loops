// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Ops Hardening
// ───────────────────────────────────────────────────────────────
// Public compatibility surface. The neutral contract now lives in
// @spec-kit/shared so spec-kit and code-graph do not import each other.

export {
  normalizeStructuralReadiness,
  buildCodeGraphOpsContract,
  createMetadataOnlyPreview,
} from '../../../system-spec-kit/shared/code-graph-contracts.js';

export type {
  GraphFreshness,
  StructuralReadiness,
  MetadataOnlyPreview,
  CodeGraphOpsContract,
} from '../../../system-spec-kit/shared/code-graph-contracts.js';

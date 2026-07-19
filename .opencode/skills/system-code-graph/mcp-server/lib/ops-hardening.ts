// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Ops Hardening
// ───────────────────────────────────────────────────────────────
// Public compatibility surface. The neutral contract is local here so
// spec-kit and code-graph do not import each other at runtime.

export {
  normalizeStructuralReadiness,
  buildCodeGraphOpsContract,
  createMetadataOnlyPreview,
} from './shared/code-graph-contracts.js';

export type {
  GraphFreshness,
  StructuralReadiness,
  MetadataOnlyPreview,
  CodeGraphOpsContract,
} from './shared/code-graph-contracts.js';

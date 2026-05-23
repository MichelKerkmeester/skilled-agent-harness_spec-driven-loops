// ───────────────────────────────────────────────────────────────
// MODULE: Embedders — barrel
// ───────────────────────────────────────────────────────────────
// Public embedder surface for MCP handlers and tests.
// ───────────────────────────────────────────────────────────────

export type { BackendKind, EmbedderManifest } from './types.js';
export type { EmbedderAdapter } from './adapter.js';
export {
  getAdapter,
  getManifest,
  listManifests,
  listSupportedDimensions,
} from './registry.js';
export {
  DEFAULT_ACTIVE_EMBEDDER,
  ensureActiveEmbedder,
  ensureVecTableForDim,
  getActiveEmbedder,
  setActiveEmbedder,
} from './schema.js';
export {
  cancelJob,
  estimateEta,
  getActiveJob,
  getJobStatus,
  resumeReindexJobs,
  startReindex,
} from './reindex.js';
export type { ReindexJob } from './reindex.js';

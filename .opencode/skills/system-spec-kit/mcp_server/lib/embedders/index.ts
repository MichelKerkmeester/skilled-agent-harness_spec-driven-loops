// ───────────────────────────────────────────────────────────────
// MODULE: Embedders — barrel
// ───────────────────────────────────────────────────────────────
// Packet 016/001: re-exports for external consumers.
// Phase 016/002 will add: ollama adapter, schema helpers, getAdapter().
// Phase 016/003 will add: MCP tool handlers + reindex orchestrator.
// ───────────────────────────────────────────────────────────────

export type { BackendKind, EmbedderManifest } from './types.js';
export type { EmbedderAdapter } from './adapter.js';
export {
  getAdapter,
  getManifest,
  listManifests,
  listSupportedDimensions,
  NotImplementedError,
} from './registry.js';
export {
  DEFAULT_ACTIVE_EMBEDDER,
  ensureActiveEmbedder,
  ensureVecTableForDim,
  getActiveEmbedder,
  setActiveEmbedder,
} from './schema.js';
export type { ActiveEmbedder } from './schema.js';
export {
  ACTIVE_REINDEX_STATUSES,
  cancelJob,
  estimateEta,
  getActiveJob,
  getJobStatus,
  resumeReindexJobs,
  startReindex,
} from './reindex.js';
export type { ReindexJob, ReindexJobStatus, StartReindexOptions } from './reindex.js';
export {
  OllamaAdapter,
  OllamaAdapterError,
  OllamaBackendUnreachableError,
  OllamaDimensionMismatchError,
  OllamaModelNotLoadedError,
} from './adapters/ollama.js';
export type { OllamaEmbedOptions, OllamaInputType } from './adapters/ollama.js';

// ───────────────────────────────────────────────────────────────
// MODULE: Embedders — execution router test seam
// ───────────────────────────────────────────────────────────────

import {
  clearEmbedderExecutionRouterState,
  getDirectAdapterCacheKeys,
  onCredentialCacheInvalidation,
  resolveDimensions,
} from './execution-router.js';

export const __embedderExecutionRouterTestables = {
  clear: clearEmbedderExecutionRouterState,
  getDirectAdapterCacheKeys,
  onCredentialCacheInvalidation,
  resolveDimensions,
};

// ───────────────────────────────────────────────────────────────
// MODULE: Embedders — execution router test seam
// ───────────────────────────────────────────────────────────────

import {
  clearEmbedderExecutionRouterState,
  getDirectAdapterCacheKeys,
  logPolicyResolution,
  onCredentialCacheInvalidation,
  registerShutdownHooks,
  resolveDimensions,
  resolveExecutionPolicy,
  shouldUseSidecar,
} from './execution-router.js';

export const __embedderExecutionRouterTestables = {
  clear: clearEmbedderExecutionRouterState,
  getDirectAdapterCacheKeys,
  logPolicyResolution,
  onCredentialCacheInvalidation,
  registerShutdownHooks,
  resolveDimensions,
  resolveExecutionPolicy,
  shouldUseSidecar,
};

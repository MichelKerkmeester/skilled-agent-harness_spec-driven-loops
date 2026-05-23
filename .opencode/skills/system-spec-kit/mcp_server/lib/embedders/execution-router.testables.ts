// ───────────────────────────────────────────────────────────────
// MODULE: Embedders — execution router test seam
// ───────────────────────────────────────────────────────────────

import {
  clearEmbedderExecutionRouterState,
  logPolicyResolution,
  registerShutdownHooks,
  resolveDimensions,
  resolveExecutionPolicy,
  shouldUseSidecar,
} from './execution-router.js';

export const __embedderExecutionRouterTestables = {
  clear: clearEmbedderExecutionRouterState,
  logPolicyResolution,
  registerShutdownHooks,
  resolveDimensions,
  resolveExecutionPolicy,
  shouldUseSidecar,
};

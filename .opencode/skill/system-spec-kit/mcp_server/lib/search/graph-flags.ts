// ---------------------------------------------------------------
// MODULE: Graph Search Feature Flags
// Feature flags for causal-graph search channel
// ---------------------------------------------------------------

import { isFeatureEnabled } from '../cache/cognitive/rollout-policy';

/**
 * Check if the causal graph search channel is enabled.
 * Default: TRUE (enabled). Set SPECKIT_GRAPH_UNIFIED=false to disable.
 */
export function isGraphUnifiedEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_GRAPH_UNIFIED');
}

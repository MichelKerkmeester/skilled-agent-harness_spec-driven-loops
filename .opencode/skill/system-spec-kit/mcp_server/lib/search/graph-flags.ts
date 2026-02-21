// ---------------------------------------------------------------
// MODULE: Graph Search Feature Flags
// Feature flags for graph-enhanced search channel
// ---------------------------------------------------------------

import { isFeatureEnabled } from '../cache/cognitive/rollout-policy';

/**
 * Check if the unified graph search channel is enabled.
 * Default: TRUE (enabled). Set SPECKIT_GRAPH_UNIFIED=false to disable.
 */
export function isGraphUnifiedEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_GRAPH_UNIFIED');
}

/**
 * Check if Graph-Guided MMR diversity is enabled (Phase 2+).
 * Default: TRUE (enabled). Set SPECKIT_GRAPH_MMR=false to disable.
 */
export function isGraphMMREnabled(): boolean {
  return isFeatureEnabled('SPECKIT_GRAPH_MMR');
}

/**
 * Check if Structural Authority Propagation is enabled (Phase 2+).
 * Default: TRUE (enabled). Set SPECKIT_GRAPH_AUTHORITY=false to disable.
 */
export function isGraphAuthorityEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_GRAPH_AUTHORITY');
}

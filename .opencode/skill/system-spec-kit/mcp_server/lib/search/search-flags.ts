// ---------------------------------------------------------------
// MODULE: Search Feature Flags
// Default-on runtime gates for search pipeline controls
// ---------------------------------------------------------------

import { isFeatureEnabled } from '../cache/cognitive/rollout-policy';

/**
 * Graph-guided MMR diversity reranking.
 * Default: TRUE (enabled). Set SPECKIT_MMR=false to disable.
 */
export function isMMREnabled(): boolean {
  return isFeatureEnabled('SPECKIT_MMR');
}

/**
 * Transparent Reasoning Module (evidence-gap detection).
 * Default: TRUE (enabled). Set SPECKIT_TRM=false to disable.
 */
export function isTRMEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_TRM');
}

/**
 * Multi-query expansion for deep-mode retrieval.
 * Default: TRUE (enabled). Set SPECKIT_MULTI_QUERY=false to disable.
 */
export function isMultiQueryEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_MULTI_QUERY');
}

/**
 * Cross-encoder reranking gate.
 * Default: TRUE (enabled). Set SPECKIT_CROSS_ENCODER=false to disable.
 */
export function isCrossEncoderEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_CROSS_ENCODER');
}

/**
 * PI-A2: Quality-aware 3-tier search fallback chain.
 * Default: FALSE (opt-in). Set SPECKIT_SEARCH_FALLBACK=true to enable.
 */
export function isSearchFallbackEnabled(): boolean {
  return process.env.SPECKIT_SEARCH_FALLBACK?.toLowerCase() === 'true';
}

/**
 * PI-B3: Automatic spec folder discovery via description cache.
 * Default: FALSE (opt-in). Set SPECKIT_FOLDER_DISCOVERY=true to enable.
 */
export function isFolderDiscoveryEnabled(): boolean {
  return process.env.SPECKIT_FOLDER_DISCOVERY?.toLowerCase() === 'true';
}

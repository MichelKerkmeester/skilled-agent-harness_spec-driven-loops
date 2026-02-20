// ---------------------------------------------------------------
// MODULE: Graph Search Feature Flags
// Feature flags for graph-enhanced search channel
// ---------------------------------------------------------------

/**
 * Check if the unified graph search channel is enabled.
 * Default: FALSE (opt-in). Set SPECKIT_GRAPH_UNIFIED=true to enable.
 */
export function isGraphUnifiedEnabled(): boolean {
  return process.env.SPECKIT_GRAPH_UNIFIED === 'true';
}

/**
 * Check if Graph-Guided MMR diversity is enabled (Phase 2+).
 * Default: FALSE (opt-in). Set SPECKIT_GRAPH_MMR=true to enable.
 */
export function isGraphMMREnabled(): boolean {
  return process.env.SPECKIT_GRAPH_MMR === 'true';
}

/**
 * Check if Structural Authority Propagation is enabled (Phase 2+).
 * Default: FALSE (opt-in). Set SPECKIT_GRAPH_AUTHORITY=true to enable.
 */
export function isGraphAuthorityEnabled(): boolean {
  return process.env.SPECKIT_GRAPH_AUTHORITY === 'true';
}

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

// ── Sprint 4: Hybrid RAG Fusion Refinement flags ──

/**
 * R1 MPAB: Document-level chunk-to-memory score aggregation.
 * Default: FALSE (opt-in). Set SPECKIT_DOCSCORE_AGGREGATION=true to enable.
 */
export function isDocscoreAggregationEnabled(): boolean {
  return process.env.SPECKIT_DOCSCORE_AGGREGATION?.toLowerCase() === 'true';
}

/**
 * R13-S2: Shadow scoring for A/B comparison evaluation.
 * Default: FALSE (opt-in). Set SPECKIT_SHADOW_SCORING=true to enable.
 */
export function isShadowScoringEnabled(): boolean {
  return process.env.SPECKIT_SHADOW_SCORING?.toLowerCase() === 'true';
}

/**
 * TM-04: Pre-storage quality gate for memory saves.
 * Default: FALSE (opt-in). Set SPECKIT_SAVE_QUALITY_GATE=true to enable.
 */
export function isSaveQualityGateEnabled(): boolean {
  return process.env.SPECKIT_SAVE_QUALITY_GATE?.toLowerCase() === 'true';
}

/**
 * TM-06: Reconsolidation-on-save for memory deduplication.
 * Default: FALSE (opt-in). Set SPECKIT_RECONSOLIDATION=true to enable.
 */
export function isReconsolidationEnabled(): boolean {
  return process.env.SPECKIT_RECONSOLIDATION?.toLowerCase() === 'true';
}

/**
 * T002b/A4: Negative-feedback confidence demotion in ranking.
 * Default: FALSE (opt-in). Set SPECKIT_NEGATIVE_FEEDBACK=true to enable.
 */
export function isNegativeFeedbackEnabled(): boolean {
  return process.env.SPECKIT_NEGATIVE_FEEDBACK?.toLowerCase() === 'true';
}

// ── Sprint 5: Pipeline Refactor flags ──

/**
 * R6: 4-stage pipeline architecture (Stage 1-4 with Stage 4 invariant).
 * Default: FALSE (opt-in). Set SPECKIT_PIPELINE_V2=true to enable.
 * When OFF, the legacy postSearchPipeline path is used (backward compatible).
 */
export function isPipelineV2Enabled(): boolean {
  return process.env.SPECKIT_PIPELINE_V2?.toLowerCase() === 'true';
}

/**
 * R12: Query expansion for embedding-based retrieval.
 * Suppressed when R15 classification = "simple" (mutual exclusion).
 * Default: FALSE (opt-in). Set SPECKIT_EMBEDDING_EXPANSION=true to enable.
 */
export function isEmbeddingExpansionEnabled(): boolean {
  return process.env.SPECKIT_EMBEDDING_EXPANSION?.toLowerCase() === 'true';
}

// ── Sprint 6: Indexing and Graph flags ──

/**
 * N3-lite: Consolidation engine — contradiction scan, Hebbian strengthening,
 * staleness detection, edge bounds enforcement.
 * Default: FALSE (opt-in). Set SPECKIT_CONSOLIDATION=true to enable.
 */
export function isConsolidationEnabled(): boolean {
  return process.env.SPECKIT_CONSOLIDATION?.toLowerCase() === 'true';
}

/**
 * R16: Encoding-intent capture at index time.
 * Records intent metadata (document, code, structured_data) alongside embeddings.
 * Default: FALSE (opt-in). Set SPECKIT_ENCODING_INTENT=true to enable.
 */
export function isEncodingIntentEnabled(): boolean {
  return process.env.SPECKIT_ENCODING_INTENT?.toLowerCase() === 'true';
}

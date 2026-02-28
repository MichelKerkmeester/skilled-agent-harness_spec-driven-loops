// ---------------------------------------------------------------
// MODULE: Search Feature Flags
// Default-on runtime gates for search pipeline controls
//
// 2026-02-28: Sprint 4-7 flag graduation — all production-ready flags
// promoted from opt-in (=== 'true') to default-ON via isFeatureEnabled().
// Set SPECKIT_<FLAG>=false to disable any graduated feature.
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
 * Default: TRUE (graduated Sprint 5). Set SPECKIT_SEARCH_FALLBACK=false to disable.
 */
export function isSearchFallbackEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_SEARCH_FALLBACK');
}

/**
 * PI-B3: Automatic spec folder discovery via description cache.
 * Default: TRUE (graduated Sprint 5). Set SPECKIT_FOLDER_DISCOVERY=false to disable.
 */
export function isFolderDiscoveryEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_FOLDER_DISCOVERY');
}

// ── Sprint 4: Hybrid RAG Fusion Refinement flags ──

/**
 * R1 MPAB: Document-level chunk-to-memory score aggregation.
 * Default: TRUE (graduated Sprint 4). Set SPECKIT_DOCSCORE_AGGREGATION=false to disable.
 */
export function isDocscoreAggregationEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_DOCSCORE_AGGREGATION');
}

/**
 * R13-S2: Shadow scoring for A/B comparison evaluation.
 * @deprecated Eval complete (Sprint 7 audit). Flag scheduled for removal.
 * Hardcoded to false — env var SPECKIT_SHADOW_SCORING is inert.
 */
export function isShadowScoringEnabled(): boolean {
  return false;
}

/**
 * TM-04: Pre-storage quality gate for memory saves.
 * Default: TRUE (graduated Sprint 4). Set SPECKIT_SAVE_QUALITY_GATE=false to disable.
 */
export function isSaveQualityGateEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_SAVE_QUALITY_GATE');
}

/**
 * TM-06: Reconsolidation-on-save for memory deduplication.
 * Default: TRUE (graduated Sprint 4). Set SPECKIT_RECONSOLIDATION=false to disable.
 */
export function isReconsolidationEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_RECONSOLIDATION');
}

/**
 * T002b/A4: Negative-feedback confidence demotion in ranking.
 * Default: TRUE (graduated Sprint 4). Set SPECKIT_NEGATIVE_FEEDBACK=false to disable.
 */
export function isNegativeFeedbackEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_NEGATIVE_FEEDBACK');
}

// ── Sprint 5: Pipeline Refactor flags ──

/**
 * R6: 4-stage pipeline architecture (Stage 1-4 with Stage 4 invariant).
 * Default: TRUE (graduated Sprint 5). Set SPECKIT_PIPELINE_V2=false to disable.
 * When OFF, the legacy postSearchPipeline path is used (backward compatible).
 */
export function isPipelineV2Enabled(): boolean {
  return isFeatureEnabled('SPECKIT_PIPELINE_V2');
}

/**
 * R12: Query expansion for embedding-based retrieval.
 * Suppressed when R15 classification = "simple" (mutual exclusion).
 * Default: TRUE (graduated Sprint 5). Set SPECKIT_EMBEDDING_EXPANSION=false to disable.
 */
export function isEmbeddingExpansionEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_EMBEDDING_EXPANSION');
}

// ── Sprint 6: Indexing and Graph flags ──

/**
 * N3-lite: Consolidation engine — contradiction scan, Hebbian strengthening,
 * staleness detection, edge bounds enforcement.
 * Default: TRUE (graduated Sprint 6). Set SPECKIT_CONSOLIDATION=false to disable.
 */
export function isConsolidationEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_CONSOLIDATION');
}

/**
 * R16: Encoding-intent capture at index time.
 * Records intent metadata (document, code, structured_data) alongside embeddings.
 * Default: TRUE (graduated Sprint 6). Set SPECKIT_ENCODING_INTENT=false to disable.
 */
export function isEncodingIntentEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_ENCODING_INTENT');
}

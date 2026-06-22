// ───────────────────────────────────────────────────────────────
// MODULE: Search Flags
// ───────────────────────────────────────────────────────────────
// Default-on runtime gates for search pipeline controls
//
// Production-ready flags graduated to default-ON.
// Set SPECKIT_<FLAG>=false to disable any graduated feature.

/* ───────────────────────────────────────────────────────────────
   1. IMPORTS
──────────────────────────────────────────────────────────────── */

import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import { isFeatureEnabled } from '../cognitive/rollout-policy.js';

// Committed isotonic calibration model, resolved relative to this module so it
// works identically when run from source (vitest) or compiled dist. Used as the
// default when SPECKIT_CONFIDENCE_CALIBRATION_MODEL is unset, so default-on
// calibration actually has a model to apply.
const DEFAULT_CONFIDENCE_CALIBRATION_MODEL_PATH = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../eval/data/confidence-calibration-model.json',
);

// Feature catalog: Quality-aware 3-tier search fallback
// Feature catalog: Verify-fix-verify memory quality loop
// Feature catalog: Negative feedback confidence signal

export type SavePlannerMode = 'plan-only' | 'full-auto' | 'hybrid';

const TRUTHY_OPT_IN = new Set(['true', '1', 'yes', 'on', 'enabled']);

/**
 * Returns true for explicit opt-in values: true, 1, yes, on, enabled.
 * Undefined, empty, unrecognized, and explicit false-like values are treated as false.
 */
function isOptInEnabled(variableName: string): boolean {
  const value = process.env[variableName]?.toLowerCase().trim();
  return value !== undefined && TRUTHY_OPT_IN.has(value);
}

/* ───────────────────────────────────────────────────────────────
   2. BOOST FLAGS (Graduated default-ON)
──────────────────────────────────────────────────────────────── */

/**
 * Session attention boost for search result re-ranking.
 * Default: TRUE (graduated). Set SPECKIT_SESSION_BOOST=false to disable.
 */
export function isSessionBoostEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_SESSION_BOOST');
}

/**
 * Causal graph traversal boost for search result amplification.
 * Default: TRUE (graduated). Set SPECKIT_CAUSAL_BOOST=false to disable.
 */
export function isCausalBoostEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_CAUSAL_BOOST');
}

/* ───────────────────────────────────────────────────────────────
   3. CORE FLAGS
──────────────────────────────────────────────────────────────── */

/**
 * Dynamic startup instruction injection for the MCP server.
 * Default: TRUE (graduated). Set SPECKIT_DYNAMIC_INIT=false to disable.
 */
export function isDynamicInitEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_DYNAMIC_INIT');
}

/**
 * Token-pressure policy for memory_context.
 * Default: TRUE (graduated). Set SPECKIT_PRESSURE_POLICY=false to disable.
 */
export function isPressurePolicyEnabled(identity?: string): boolean {
  return isFeatureEnabled('SPECKIT_PRESSURE_POLICY', identity);
}

/**
 * Automatic session resume context injection for memory_context.
 * Default: TRUE (graduated). Set SPECKIT_AUTO_RESUME=false to disable.
 */
export function isAutoResumeEnabled(identity?: string): boolean {
  return isFeatureEnabled('SPECKIT_AUTO_RESUME', identity);
}

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
 * PI-A2: Quality-aware 3-tier search fallback chain.
 * Default: TRUE (graduated). Set SPECKIT_SEARCH_FALLBACK=false to disable.
 */
export function isSearchFallbackEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_SEARCH_FALLBACK');
}

/**
 * Automatic spec folder discovery via description cache.
 * Default: TRUE (graduated). Set SPECKIT_FOLDER_DISCOVERY=false to disable.
 */
export function isFolderDiscoveryEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_FOLDER_DISCOVERY');
}

/**
 * Planner-first save mode selection for canonical save flows.
 * Default: 'plan-only'. Set SPECKIT_SAVE_PLANNER_MODE=full-auto to restore
 * the legacy mutation-first behavior. `hybrid` is reserved for future mixed
 * flows and currently behaves the same as `plan-only`.
 */
export function resolveSavePlannerMode(): SavePlannerMode {
  const raw = process.env.SPECKIT_SAVE_PLANNER_MODE?.trim().toLowerCase();
  if (raw === 'full-auto' || raw === 'full_auto') {
    return 'full-auto';
  }
  if (raw === 'hybrid') {
    return 'hybrid';
  }
  return 'plan-only';
}

/**
 * Save-time reconsolidation gate. Opt-in (default OFF): it enables the destructive
 * reconsolidate() path that can merge near-duplicate rows and deprecate older ones, itself
 * further gated on a per-spec-folder "pre-reconsolidation" checkpoint. Kept opt-in so a
 * destructive merge never happens without explicit intent. Set SPECKIT_RECONSOLIDATION_ENABLED=true to enable.
 */
export function isSaveReconsolidationEnabled(): boolean {
  return isOptInEnabled('SPECKIT_RECONSOLIDATION_ENABLED');
}

/**
 * Save-time post-insert enrichment bundle gate (causal links, entity extraction,
 * summaries, entity linking, graph lifecycle, populates the causal/entity graph).
 * Default: TRUE (graduated). Set SPECKIT_POST_INSERT_ENRICHMENT_ENABLED=false to disable.
 */
export function isPostInsertEnrichmentEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_POST_INSERT_ENRICHMENT_ENABLED');
}

/**
 * Whether the post-insert enrichment bundle runs in the background (non-blocking save).
 * Default: TRUE (async). Set SPECKIT_POST_INSERT_ENRICHMENT_SYNC=true to run it synchronously
 * when a caller needs the causal/entity graph fresh within the same save response.
 */
export function isPostInsertEnrichmentAsync(): boolean {
  return !isOptInEnabled('SPECKIT_POST_INSERT_ENRICHMENT_SYNC');
}

/**
 * Save-time quality auto-fix retries gate (regenerates trigger phrases, trims oversized
 * content to the char budget, normalizes anchors on save).
 * Default: TRUE (graduated). Set SPECKIT_QUALITY_AUTO_FIX=false to disable.
 */
export function isQualityAutoFixEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_QUALITY_AUTO_FIX');
}

// -- Hybrid RAG Fusion Refinement flags --

/**
 * MPAB: Document-level chunk-to-memory score aggregation.
 * Default: TRUE (graduated). Set SPECKIT_DOCSCORE_AGGREGATION=false to disable.
 */
export function isDocscoreAggregationEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_DOCSCORE_AGGREGATION');
}

/**
 * Pre-storage quality gate for memory saves.
 * Default: TRUE (graduated). Set SPECKIT_SAVE_QUALITY_GATE=false to disable.
 */
export function isSaveQualityGateEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_SAVE_QUALITY_GATE');
}

/**
 * Dynamic token budget allocation by query complexity.
 * Default: TRUE (graduated). Set SPECKIT_DYNAMIC_TOKEN_BUDGET=false to disable.
 */
export function isDynamicTokenBudgetEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_DYNAMIC_TOKEN_BUDGET');
}

/**
 * Confidence-gap truncation for low-confidence tails.
 * Default: TRUE (graduated). Set SPECKIT_CONFIDENCE_TRUNCATION=false to disable.
 */
export function isConfidenceTruncationEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_CONFIDENCE_TRUNCATION');
}

/**
 * Channel minimum-representation promotion after fusion.
 * Default: TRUE (graduated). Set SPECKIT_CHANNEL_MIN_REP=false to disable.
 */
export function isChannelMinRepEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_CHANNEL_MIN_REP');
}

/**
 * Reconsolidation-on-save for memory deduplication.
 * Default: TRUE (graduated). Set SPECKIT_RECONSOLIDATION=false to disable.
 */
export function isReconsolidationEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_RECONSOLIDATION');
}

/**
 * Negative-feedback confidence demotion in ranking.
 * Default: TRUE (graduated). Set SPECKIT_NEGATIVE_FEEDBACK=false to disable.
 */
export function isNegativeFeedbackEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_NEGATIVE_FEEDBACK');
}

// -- Pipeline Refactor flags --

/**
 * Query expansion for embedding-based retrieval.
 * Suppressed when classification = "simple" (mutual exclusion).
 * Default: TRUE (graduated). Set SPECKIT_EMBEDDING_EXPANSION=false to disable.
 */
export function isEmbeddingExpansionEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_EMBEDDING_EXPANSION');
}

// -- Indexing and Graph flags --

/**
 * N3-lite: Consolidation engine, contradiction scan, Hebbian strengthening,
 * staleness detection, edge bounds enforcement.
 * Default: TRUE (graduated). Set SPECKIT_CONSOLIDATION=false to disable.
 */
export function isConsolidationEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_CONSOLIDATION');
}

/**
 * Encoding-intent capture at index time.
 * Records intent metadata (document, code, structured_data) alongside embeddings.
 * Default: TRUE (graduated). Set SPECKIT_ENCODING_INTENT=false to disable.
 */
export function isEncodingIntentEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_ENCODING_INTENT');
}

/* ───────────────────────────────────────────────────────────────
   3. GRAPH FLAGS
──────────────────────────────────────────────────────────────── */

/**
 * N2a+N2b: Graph momentum scoring and causal depth signals.
 * Default: TRUE (enabled). Set SPECKIT_GRAPH_SIGNALS=false to disable.
 */
// Supported SPECKIT_GRAPH_WALK_ROLLOUT states: off, trace_only, bounded_runtime.
export type GraphWalkRolloutState = 'off' | 'trace_only' | 'bounded_runtime';

export function resolveGraphWalkRolloutState(): GraphWalkRolloutState {
  const rollout = process.env.SPECKIT_GRAPH_WALK_ROLLOUT?.trim().toLowerCase();
  if (rollout === 'off' || rollout === 'false' || rollout === '0') {
    return 'off';
  }
  if (rollout === 'trace_only' || rollout === 'trace-only') {
    return 'trace_only';
  }
  if (rollout === 'bounded_runtime' || rollout === 'bounded-runtime' || rollout === 'true' || rollout === '1') {
    return 'bounded_runtime';
  }

  return isFeatureEnabled('SPECKIT_GRAPH_SIGNALS') ? 'bounded_runtime' : 'off';
}

export function isGraphSignalsEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_GRAPH_SIGNALS');
}

/**
 * N2c: Community detection (BFS connected components + Louvain escalation).
 * Default: TRUE (enabled). Set SPECKIT_COMMUNITY_DETECTION=false to disable.
 */
export function isCommunityDetectionEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_COMMUNITY_DETECTION');
}

/**
 * Community summary generation and search channel.
 * Default: TRUE (enabled). Set SPECKIT_COMMUNITY_SUMMARIES=false to disable.
 */
export function isCommunitySummariesEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_COMMUNITY_SUMMARIES');
}

/**
 * Memory summary generation (TF-IDF extractive summaries as search channel).
 * Default: TRUE (enabled). Set SPECKIT_MEMORY_SUMMARIES=false to disable.
 */
export function isMemorySummariesEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_MEMORY_SUMMARIES');
}

/**
 * Coarse-to-fine world-summary grounding prelude for memory_context.
 * Default: TRUE (graduated). The prelude now appends its grounding instead of
 * prepending it, so it adds net Recall@5 +0.275 without displacing any baseline
 * result. Set SPECKIT_WORLD_SUMMARY_PRELUDE=false to disable.
 */
export function isWorldSummaryPreludeEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_WORLD_SUMMARY_PRELUDE');
}

/**
 * Temporal contiguity boost on raw Stage 1 vector results.
 * Default: TRUE (graduated). Set SPECKIT_TEMPORAL_CONTIGUITY=false to disable.
 */
export function isTemporalContiguityEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_TEMPORAL_CONTIGUITY');
}

/**
 * Auto entity extraction (rule-based noun-phrase extraction at save time).
 * Default: TRUE (enabled). Set SPECKIT_AUTO_ENTITIES=false to disable.
 */
export function isAutoEntitiesEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_AUTO_ENTITIES');
}

/**
 * Cross-document entity linking (entity-based cross-doc edges).
 * Requires auto entities to also be enabled.
 * Default: TRUE (enabled). Set SPECKIT_ENTITY_LINKING=false to disable.
 */
export function isEntityLinkingEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_ENTITY_LINKING');
}

/** Whether causal-edge degree-based re-ranking is enabled (SPECKIT_DEGREE_BOOST). */
export function isDegreeBoostEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_DEGREE_BOOST');
}

/* ───────────────────────────────────────────────────────────────
   FLAGS
──────────────────────────────────────────────────────────────── */

/**
 * Contextual tree headers for Stage 4 result enrichment.
 * Default: TRUE. Set SPECKIT_CONTEXT_HEADERS=false to disable.
 */
export function isContextHeadersEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_CONTEXT_HEADERS');
}

/**
 * Real-time file watcher for markdown reindexing.
 * Default: FALSE. Set SPECKIT_FILE_WATCHER=true to enable.
 * Honors SPECKIT_ROLLOUT_PERCENT global rollout policy.
 */
export function isFileWatcherEnabled(): boolean {
  if (process.env.SPECKIT_FILE_WATCHER?.toLowerCase().trim() !== 'true') return false;
  return isFeatureEnabled('SPECKIT_FILE_WATCHER');
}

/**
 * Verify-fix-verify memory quality loop.
 * Default: TRUE (graduated). Set SPECKIT_QUALITY_LOOP=false to disable.
 */
export function isQualityLoopEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_QUALITY_LOOP');
}

/* ───────────────────────────────────────────────────────────────
   5. QUERY INTELLIGENCE FLAGS
──────────────────────────────────────────────────────────────── */

/**
 * Query decomposition, bounded facet detection.
 * Deep-mode only: multi-faceted queries split into up to 3 sub-queries.
 * Default: TRUE (graduated). Set SPECKIT_QUERY_DECOMPOSITION=false to disable.
 */
export function isQueryDecompositionEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_QUERY_DECOMPOSITION');
}

/**
 * Graph concept routing, query-time alias matching.
 * Extracts noun phrases from the query and matches against concept alias table,
 * activating the graph channel for matched concepts.
 * Default: TRUE (graduated). Set SPECKIT_GRAPH_CONCEPT_ROUTING=false to disable.
 */
export function isGraphConceptRoutingEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_GRAPH_CONCEPT_ROUTING');
}

/**
 * Index-time surrogates for recall improvement.
 * Generates surrogate metadata (aliases, headings, summary, questions)
 * at index time; matched at query time with no LLM calls.
 * Default: TRUE (graduated). Set SPECKIT_QUERY_SURROGATES=false to disable.
 */
export function isQuerySurrogatesEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_QUERY_SURROGATES');
}

/**
 * Retrieval-class routing, query-shape graph/degree channel suppression.
 * When enabled, a SingleHop-classified query (e.g. "find the decision record
 * for X") suppresses the graph + degree channels in the query router, dropping
 * the intent-driven and entity-density graph preservation that would otherwise
 * keep them. Default: FALSE (opt-in): suppression changes default channel
 * routing and result ordering, so with the flag OFF the router preserves graph
 * exactly as the pre-retrieval-class baseline did. It must earn promotion on a
 * reindexed before/after benchmark before running by default. Set
 * SPECKIT_RETRIEVAL_CLASS_ROUTING=true to enable.
 */
export function isRetrievalClassRoutingEnabled(): boolean {
  return isOptInEnabled('SPECKIT_RETRIEVAL_CLASS_ROUTING');
}

/* ───────────────────────────────────────────────────────────────
   6. FEEDBACK & QUALITY LEARNING FLAGS
──────────────────────────────────────────────────────────────── */

/**
 * Implicit feedback event ledger.
 * Shadow-only, no ranking side effects.
 * Default: TRUE (graduated). Set SPECKIT_IMPLICIT_FEEDBACK_LOG=false to disable.
 */
export function isImplicitFeedbackLogEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_IMPLICIT_FEEDBACK_LOG');
}

/**
 * True-citation emitter (Stage 1 of the outcome signal).
 *
 * Opt-in (default OFF). The existing result_cited signal is hollow: it fires
 * for every shown result on includeContent searches, so cited == shown and the
 * corpus has zero shown-but-unused negatives. This emitter mines the post-hoc
 * transcript for the memory_ids the assistant ACTUALLY referenced after a
 * search, then writes used/not-used pairs to a separate shadow ledger, which
 * is where the negative examples come from. Kept opt-in because it adds a new
 * write path mining the transcript; it must earn density before any reranker
 * (a future packet) consumes it. Set SPECKIT_TRUE_CITATION_EMITTER=true to enable.
 */
export function isTrueCitationEmitterEnabled(): boolean {
  return isOptInEnabled('SPECKIT_TRUE_CITATION_EMITTER');
}

/**
 * Hybrid decay policy, type-aware no-decay for permanent artifacts.
 * Default: TRUE (graduated). Set SPECKIT_HYBRID_DECAY_POLICY=false to disable.
 * When enabled: decision/constitutional/critical context types receive Infinity
 * stability (no decay). All other types follow the standard FSRS schedule.
 */
export function isHybridDecayPolicyEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_HYBRID_DECAY_POLICY');
}

/**
 * Short-critical quality gate exception.
 * Default: TRUE (graduated). Set SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS=false to disable.
 * When enabled: decision context_type documents with >= 2 structural signals
 * bypass the 50-character minimum content length check.
 */
export function isSaveQualityGateExceptionsEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS');
}

/* ───────────────────────────────────────────────────────────────
   7. LLM QUERY INTELLIGENCE FLAGS
──────────────────────────────────────────────────────────────── */

/**
 * Corpus-grounded LLM query reformulation.
 * Step-back abstraction + corpus seed grounding. Deep-mode only.
 * Default: TRUE (graduated). Set SPECKIT_LLM_REFORMULATION=false to disable.
 * Requires an OpenAI-compatible LLM endpoint (LLM_REFORMULATION_ENDPOINT).
 */
export function isLlmReformulationEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_LLM_REFORMULATION');
}

/**
 * HyDE (Hypothetical Document Embeddings).
 * Generates a pseudo-document for low-confidence deep queries.
 * Default: TRUE (graduated). Set SPECKIT_HYDE=false to disable.
 */
export function isHyDEEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_HYDE');
}

/* ───────────────────────────────────────────────────────────────
   8. GRAPH LIFECYCLE FLAGS
──────────────────────────────────────────────────────────────── */

/**
 * Graph refresh mode.
 * Controls when dirty-node recomputation runs after write operations.
 * Default: 'write_local' (graduated). Set SPECKIT_GRAPH_REFRESH_MODE=off to disable.
 * Values: off | write_local | scheduled.
 */
export function getGraphRefreshMode(): string {
  return process.env.SPECKIT_GRAPH_REFRESH_MODE?.trim().toLowerCase() ?? 'write_local';
}

export function isGraphRefreshDisabled(): boolean {
  return getGraphRefreshMode() === 'off';
}

/**
 * Async LLM graph backfill for high-value documents.
 * Runs after deterministic extraction; adds probabilistic edges via LLM.
 * Default: TRUE (graduated). Set SPECKIT_LLM_GRAPH_BACKFILL=false to disable.
 */
export function isLlmGraphBackfillEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_LLM_GRAPH_BACKFILL');
}

/* ───────────────────────────────────────────────────────────────
   9. GRAPH CALIBRATION & COMMUNITIES FLAGS
──────────────────────────────────────────────────────────────── */

/**
 * Graph calibration profiles and community thresholds.
 * Enables calibration profile enforcement, Louvain activation gates, and
 * community score capping (secondary-only).
 * Default: TRUE (graduated). Set SPECKIT_GRAPH_CALIBRATION_PROFILE=false to disable.
 */
export function isGraphCalibrationProfileEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_GRAPH_CALIBRATION_PROFILE');
}

/* ───────────────────────────────────────────────────────────────
   10. LEARNED RANKING FLAGS
──────────────────────────────────────────────────────────────── */

/**
 * Learned Stage 2 weight combiner (shadow mode).
 * Runs the learned linear ranker in parallel with manual weights.
 * Scores are computed but NOT used for ranking (shadow-only).
 * Default: TRUE (graduated). Set SPECKIT_LEARNED_STAGE2_COMBINER=false to disable.
 */
export function isLearnedStage2CombinerEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_LEARNED_STAGE2_COMBINER');
}

/* ───────────────────────────────────────────────────────────────
   11. SHADOW EVALUATION FLAGS
──────────────────────────────────────────────────────────────── */

/**
 * Shadow scoring with holdout evaluation.
 * Compares would-have-changed rankings vs live rankings on a holdout
 * slice of queries. Shadow-only, no ranking side effects.
 * Default: TRUE (graduated). Set SPECKIT_SHADOW_FEEDBACK=false to disable.
 */
export function isShadowFeedbackEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_SHADOW_FEEDBACK');
}

/* ───────────────────────────────────────────────────────────────
   12. PROGRESSIVE DISCLOSURE & SESSION STATE FLAGS
──────────────────────────────────────────────────────────────── */

/**
 * Progressive disclosure for search results.
 * Replaces hard tail-truncation with summary layer + snippet + cursor pagination.
 * Default: TRUE (graduated). Set SPECKIT_PROGRESSIVE_DISCLOSURE_V1=false to disable.
 */
export function isProgressiveDisclosureEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_PROGRESSIVE_DISCLOSURE_V1');
}

/**
 * Retrieval session state for cross-turn context.
 * Enables cross-turn dedup and goal-aware refinement of search results.
 * Default: TRUE (graduated). Set SPECKIT_SESSION_RETRIEVAL_STATE_V1=false to disable.
 */
export function isSessionRetrievalStateEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_SESSION_RETRIEVAL_STATE_V1');
}

/* ───────────────────────────────────────────────────────────────
   13. GRADUATED FLAGS
──────────────────────────────────────────────────────────────── */

/**
 * Calibrated overlap bonus for multi-channel convergence.
 * Default: TRUE (graduated). Set SPECKIT_CALIBRATED_OVERLAP_BONUS=false to disable.
 */
export function isCalibratedOverlapBonusEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_CALIBRATED_OVERLAP_BONUS');
}

/**
 * Experimental per-intent RRF K selection.
 * Default: TRUE (graduated). Set SPECKIT_RRF_K_EXPERIMENTAL=false to disable.
 */
export function isRrfKExperimentalEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_RRF_K_EXPERIMENTAL');
}

/**
 * Sparse-first + intent-aware typed traversal.
 * Default: TRUE (graduated). Set SPECKIT_TYPED_TRAVERSAL=false to disable.
 */
export function isTypedTraversalEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_TYPED_TRAVERSAL');
}

/**
 * Empty/weak result recovery UX.
 * Default: TRUE (graduated). Set SPECKIT_EMPTY_RESULT_RECOVERY_V1=false to disable.
 */
export function isEmptyResultRecoveryEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_EMPTY_RESULT_RECOVERY_V1');
}

/**
 * Retention forgetting safety layer.
 * Default: TRUE (graduated). A safety layer that only ever over-protects: OFF
 * drops the wrong rows while ON spares them, so DROP precision and keep-set
 * protection both reach 1.0 with recall held. Set
 * SPECKIT_RETENTION_FORGETTING_V1=false to disable the conservative spare-only
 * retention axes and live incoming-edge protection.
 */
export function isRetentionForgettingEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_RETENTION_FORGETTING_V1');
}

/**
 * Per-result calibrated confidence scoring.
 * Default: TRUE (graduated). Set SPECKIT_RESULT_CONFIDENCE_V1=false to disable.
 */
export function isResultConfidenceEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_RESULT_CONFIDENCE_V1');
}

/**
 * Lexical-grounding floor and single-hit corroboration for the request-quality
 * verdict. When enabled, good (and therefore cite_results) is denied unless the
 * top hit carries a query-term or BM25 lexical overlap above the grounding floor,
 * and a lone above-floor hit must be corroborated by a second above-threshold hit
 * before it can reach good through the margin or quality-ratio path. Both read the
 * lexical signal already on the result rows and add no new query or DB read.
 *
 * Default: FALSE (opt-in). The gate sits on the citation verdict, so over-denial
 * is the live risk; it ships dark and graduates only after validating on the
 * off-corpus fixtures. With the flag OFF the verdict is byte-for-byte the shipped
 * behavior. An unparseable value resolves to OFF. Set
 * SPECKIT_LEXICAL_GROUNDING_V1=true to enable.
 */
export function isLexicalGroundingEnabled(): boolean {
  return isOptInEnabled('SPECKIT_LEXICAL_GROUNDING_V1');
}

/**
 * Calibrate confidence/request-quality and result-set digests on an absolute
 * relevance signal (cosine similarity) instead of the RRF fusion score. RRF
 * magnitudes (~0.01–0.05) understate relevance and make "good" unreachable, so
 * every hybrid query degrades to "weak"/"gap". Ordering is unaffected, this
 * only changes the calibration/display scale.
 * Default: TRUE (graduated). Set SPECKIT_ABSOLUTE_RELEVANCE_CALIBRATION=false to disable.
 */
export function isAbsoluteRelevanceCalibrationEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_ABSOLUTE_RELEVANCE_CALIBRATION');
}

/**
 * Map per-result confidence values through a fitted isotonic calibration model
 * so confidence.value approximates P(relevant).
 * Default: TRUE (graduated). Set SPECKIT_CONFIDENCE_CALIBRATION=false to disable.
 * Graduated on held-out grouped-k-fold evidence (no query leakage): ECE
 * 0.193 -> 0.019 and Brier 0.148 -> 0.079, improving on all folds, so the
 * isotonic model earns default-on calibration. A model is applied only when this
 * flag is ON AND a readable model resolves (SPECKIT_CONFIDENCE_CALIBRATION_MODEL,
 * else the committed default); an unresolvable model degrades to identity.
 */
export function isConfidenceCalibrationEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_CONFIDENCE_CALIBRATION');
}

/**
 * Cosine-primary reorder of the result head before truncation.
 *
 * Reorders only the top-N of the final ranked list by absolute cosine relevance
 * (a stable sort, so ties keep their fused RRF order). RRF fusion stays the
 * ordering baseline; only the head is rebalanced toward the strongest absolute
 * semantic signal, which matters now that downstream consumers treat position 1
 * as decisive. Near-zero latency and no model/LLM involved, a pure reorder.
 * Default: TRUE (graduated, low-risk lift). Set SPECKIT_COSINE_TOPN_REORDER=false to disable.
 */
export function isCosineTopnReorderEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_COSINE_TOPN_REORDER');
}

/**
 * Filesystem path to a fitted CalibrationModel JSON.
 * Resolution: a non-empty SPECKIT_CONFIDENCE_CALIBRATION_MODEL overrides; when
 * the env is UNSET the committed default model is used (so default-on
 * calibration calibrates without extra config); an explicitly EMPTY env value
 * disables calibration by returning undefined. An unreadable/invalid path
 * degrades to the uncalibrated identity downstream rather than erroring.
 */
export function getConfidenceCalibrationModelPath(): string | undefined {
  const env = process.env.SPECKIT_CONFIDENCE_CALIBRATION_MODEL;
  if (env === undefined) return DEFAULT_CONFIDENCE_CALIBRATION_MODEL_PATH;
  const raw = env.trim();
  return raw.length > 0 ? raw : undefined;
}

/**
 * Include archived/cold (deprecated-tier) memories in retrieval for everyone,
 * instead of hard-excluding them. The FSRS temperature system already ranks
 * memories by retrievability (deprecated decays at 0.25x → coldest), so a hard
 * exclusion is redundant and hides legitimately-cold-but-relevant history (e.g.
 * z_archive specs). Cold rows are included and naturally rank below hot ones.
 * Applies to the query-time channels (lexical FTS/BM25, trigger); the vector lane
 * filters via the active_memory_projection and is included separately when that
 * projection is rebuilt. Constitutional rows stay on their own injected path.
 * Default: TRUE (graduated). Set SPECKIT_INCLUDE_ARCHIVED_DEFAULT=false to restore
 * the hard exclusion.
 */
export function isArchivedRetrievalIncludedByDefault(): boolean {
  return isFeatureEnabled('SPECKIT_INCLUDE_ARCHIVED_DEFAULT');
}

/**
 * Extend cold/archived (deprecated-tier) inclusion to the VECTOR (semantic) lane.
 * The vector lane joins `active_memory_projection`, which holds one active row per
 * logical key, so cold rows are admitted to the projection (option A: only rows
 * whose logical key has no active winner) by a boot-time backfill, and the
 * query-time deprecated filter is relaxed. Graduated to default ON alongside the
 * other cold-tier channels; the backfill is idempotent and preserves the
 * one-active-per-key UNIQUE invariant. Set SPECKIT_INCLUDE_ARCHIVED_VECTOR=false
 * to restore the vector-lane exclusion.
 */
export function isArchivedVectorInclusionEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_INCLUDE_ARCHIVED_VECTOR');
}

/**
 * Weekly batch feedback learning pipeline.
 * Default: TRUE (graduated). Set SPECKIT_BATCH_LEARNED_FEEDBACK=false to disable.
 */
export function isBatchLearnedFeedbackEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_BATCH_LEARNED_FEEDBACK');
}

/**
 * Assistive reconsolidation for near-duplicate detection.
 * Default: TRUE (graduated). Set SPECKIT_ASSISTIVE_RECONSOLIDATION=false to disable.
 */
export function isAssistiveReconsolidationEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_ASSISTIVE_RECONSOLIDATION');
}

/**
 * Two-tier result explainability.
 * Default: TRUE (graduated). Set SPECKIT_RESULT_EXPLAIN_V1=false to disable.
 */
export function isResultExplainEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_RESULT_EXPLAIN_V1');
}

/**
 * Mode-aware response profile formatting.
 * Default: TRUE (graduated). Set SPECKIT_RESPONSE_PROFILE_V1=false to disable.
 */
export function isResponseProfileEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_RESPONSE_PROFILE_V1');
}

/* ───────────────────────────────────────────────────────────────
   14. PHASE B GRAPH RETRIEVAL FLAGS
──────────────────────────────────────────────────────────────── */

/**
 * Query concept expansion for hybrid search.
 * When concept routing matches aliases, expands query with related terms.
 * Default: TRUE (graduated). Set SPECKIT_QUERY_CONCEPT_EXPANSION=false to disable.
 */
export function isQueryConceptExpansionEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_QUERY_CONCEPT_EXPANSION');
}

/**
 * Graph-expanded fallback on zero/weak results.
 * Queries causal_edges for neighbor titles when recovery triggers.
 * Default: TRUE (graduated). Set SPECKIT_GRAPH_FALLBACK=false to disable.
 */
export function isGraphFallbackEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_GRAPH_FALLBACK');
}

/**
 * Always-on graph context injection.
 * Runs concept routing + graph neighbor lookup even without seed results.
 * Default: TRUE (graduated). Set SPECKIT_GRAPH_CONTEXT_INJECTION=false to disable.
 */
export function isGraphContextInjectionEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_GRAPH_CONTEXT_INJECTION');
}

/**
 * Result provenance, include graph evidence metadata in search results.
 * When enabled, search results include graphEvidence with contributing edges,
 * communities, and boost factors for transparency and debuggability.
 * Default: TRUE (enabled). Set SPECKIT_RESULT_PROVENANCE=false to disable.
 */
export function isResultProvenanceEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_RESULT_PROVENANCE');
}

/**
 * Temporal validity tracking for causal edges.
 * Default: TRUE (graduated). Set SPECKIT_TEMPORAL_EDGES=false to disable.
 */
export function isTemporalEdgesEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_TEMPORAL_EDGES');
}

/**
 * Content-addressed identity for generated causal edges.
 * Default: TRUE (graduated). Content-addressed identity proved correct 4/4 (id
 * stability, replay reproducibility, dedup discrimination, zero collisions), so
 * write-time derived_id persistence runs by default. Set
 * SPECKIT_DERIVED_ID_PROVENANCE=false to disable derived_id persistence for
 * generated causal edges.
 */
export function isDerivedIdProvenanceEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_DERIVED_ID_PROVENANCE');
}

/**
 * Usage-weighted ranking signal.
 * Default: TRUE (graduated). Set SPECKIT_USAGE_RANKING=false to disable.
 */
export function isUsageRankingEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_USAGE_RANKING');
}

/**
 * Ontology-guided extraction validation hooks.
 * Default: TRUE (graduated). Set SPECKIT_ONTOLOGY_HOOKS=false to disable.
 */
export function isOntologyHooksEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_ONTOLOGY_HOOKS');
}

/**
 * Community-level search as fallback channel.
 * When primary search returns weak/no results, searches community summaries
 * and injects matching community members as candidates.
 * Default: TRUE (graduated). Set SPECKIT_COMMUNITY_SEARCH_FALLBACK=false to disable.
 */
export function isCommunitySearchFallbackEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_COMMUNITY_SEARCH_FALLBACK');
}

/**
 * Dual-level retrieval mode.
 * Adds retrievalLevel parameter: 'local' (entity), 'global' (community), 'auto' (local + fallback).
 * Default: TRUE (graduated). Set SPECKIT_DUAL_RETRIEVAL=false to disable.
 */
export function isDualRetrievalEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_DUAL_RETRIEVAL');
}

/**
 * Phase C: Intent-to-profile auto-routing.
 * When enabled, classifyIntent() results automatically select a response profile
 * (quick, research, resume, debug) when no explicit profile is specified by the caller.
 * Default: TRUE (graduated). Set SPECKIT_INTENT_AUTO_PROFILE=false to disable.
 */
export function isIntentAutoProfileEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_INTENT_AUTO_PROFILE');
}

/* ───────────────────────────────────────────────────────────────
   15. ADDITIVE TAIL-LANE RECALL FLAGS (opt-in)
──────────────────────────────────────────────────────────────── */

/**
 * Deterministic multi-hop recall: parse explicit sibling/cross-reference folder
 * slugs out of the top recalled docs' content, resolve each 1:1 to a unique spec
 * folder, and append that folder's spec.md to the result tail. No LLM and no
 * re-embedding, it only follows pointers the docs already wrote. Default: FALSE
 * (opt-in): appending new candidates changes the result set, so it must earn
 * promotion on an off-vs-on benchmark before running by default. The append is
 * tail-only and never evicts a baseline hit, so flag-off is byte-identical. Set
 * SPECKIT_DETERMINISTIC_MULTIHOP=true to enable.
 */
export function isDeterministicMultihopEnabled(): boolean {
  return isOptInEnabled('SPECKIT_DETERMINISTIC_MULTIHOP');
}

/**
 * Lane champion backfill: after fusion, append each base lane's top candidate
 * (vector / fts / bm25 / trigger) that did not make the fused top-K into empty
 * tail slots, so a single lane's strongest belief still reaches the user. Reuses
 * the already-populated per-lane arrays, no new query or re-scoring. Default:
 * FALSE (opt-in): it adds tail candidates, so it must earn promotion on an
 * off-vs-on benchmark first. The append is tail-only and never evicts a baseline
 * hit, so flag-off is byte-identical. Set SPECKIT_LANE_CHAMPION_BACKFILL=true to
 * enable.
 */
export function isLaneChampionBackfillEnabled(): boolean {
  return isOptInEnabled('SPECKIT_LANE_CHAMPION_BACKFILL');
}

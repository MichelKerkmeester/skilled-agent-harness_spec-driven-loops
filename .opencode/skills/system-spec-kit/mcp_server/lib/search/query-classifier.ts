// ───────────────────────────────────────────────────────────────
// MODULE: Query Classifier
// ───────────────────────────────────────────────────────────────
/* --- 1. TYPES & CONSTANTS --- */

// Feature catalog: Query complexity router

import {
  buildComplexityQueryPlan,
  type QueryPlan,
} from '../query/query-plan.js';

type QueryComplexityTier = 'simple' | 'moderate' | 'complex';

interface ClassificationResult {
  tier: QueryComplexityTier;
  features: {
    termCount: number;
    charCount: number;
    hasTriggerMatch: boolean;
    stopWordRatio: number;
  };
  confidence: 'high' | 'medium' | 'low' | 'fallback';
  queryPlan: QueryPlan;
}

/** Config-driven thresholds */
const SIMPLE_TERM_THRESHOLD = 3;
const COMPLEX_TERM_THRESHOLD = 8;

/**
 * Stop-word ratio at or above which a short, trigger-less query is treated as
 * low-signal. Such queries carry too little lexical anchor for the cheap simple
 * route — which suppresses extra channels and synonym/embedding expansion — to
 * recall reliably, so they are escalated to the full pipeline. Set above the
 * one-stop-word-in-three ratio of ordinary verb-noun queries (e.g. "fix the
 * bug" = 0.333) so only genuinely vague queries escalate.
 */
const LOW_SIGNAL_STOPWORD_RATIO = 0.5;

/**
 * Stop-word ceiling for short queries that still carry enough content words to
 * deserve recall-preserving graph corroboration.
 */
const CONTENT_RICH_SHORT_STOPWORD_RATIO = 1 / 3;

/** Common English stop words for semantic complexity heuristic */
const STOP_WORDS: ReadonlySet<string> = new Set([
  'the', 'a', 'an', 'is', 'are', 'was', 'were',
  'in', 'on', 'at', 'to', 'for', 'of',
  'and', 'or', 'but', 'not',
  'with', 'this', 'that', 'it',
  'from', 'by', 'as', 'be',
  'has', 'had', 'have',
  'do', 'does', 'did',
  'will', 'would', 'can', 'could', 'should', 'may', 'might',
]);

/* --- 2. FEATURE FLAG --- */

/**
 * Check if the complexity router feature flag is enabled.
 * Default: TRUE (graduated). Set SPECKIT_COMPLEXITY_ROUTER=false to disable.
 *
 * @returns True when SPECKIT_COMPLEXITY_ROUTER is not explicitly disabled.
 */
function isComplexityRouterEnabled(): boolean {
  const raw = process.env.SPECKIT_COMPLEXITY_ROUTER?.toLowerCase()?.trim();
  return raw !== 'false';
}

/* --- 3. FEATURE EXTRACTION --- */

/**
 * Split query into terms by whitespace, filtering empty strings.
 *
 * @param query - Raw query string to tokenize.
 * @returns Array of non-empty whitespace-delimited terms.
 */
function extractTerms(query: string): string[] {
  return query.trim().split(/\s+/).filter(t => t.length > 0);
}

/**
 * Calculate the ratio of stop words in the query terms.
 * Returns 0 for empty term lists.
 *
 * @param terms - Array of query terms to analyse.
 * @returns Ratio in [0, 1] of stop words to total terms.
 */
function calculateStopWordRatio(terms: string[]): number {
  if (terms.length === 0) return 0;
  const stopCount = terms.filter(t => STOP_WORDS.has(t.toLowerCase())).length;
  return stopCount / terms.length;
}

/**
 * Check if the query exactly matches any known trigger phrase (case-insensitive).
 *
 * @param query          - Raw query string to test.
 * @param triggerPhrases - Known trigger phrases to match against.
 * @returns True when the query matches a trigger phrase exactly.
 */
function hasTriggerMatch(query: string, triggerPhrases: string[]): boolean {
  if (triggerPhrases.length === 0) return false;
  const normalized = query.trim().toLowerCase();
  return triggerPhrases.some(tp => tp.trim().toLowerCase() === normalized);
}

/* --- 4. CLASSIFICATION --- */

/**
 * Determine confidence label based on how clearly the query fits its tier.
 *
 * @param tier          - Classified complexity tier.
 * @param termCount     - Number of query terms.
 * @param hasTrigger    - Whether a trigger phrase matched.
 * @param stopWordRatio - Ratio of stop words in query.
 * @returns Confidence label: 'high', 'medium', or 'low'.
 */
function determineConfidence(
  tier: QueryComplexityTier,
  termCount: number,
  hasTrigger: boolean,
  stopWordRatio: number,
): 'high' | 'medium' | 'low' {
  if (tier === 'simple') {
    // Trigger match is strongest simplicity signal — overrides term count
    if (hasTrigger) return 'high';
    if (termCount <= 2) return 'high';
    return 'medium';
  }

  if (tier === 'complex') {
    // High confidence: many terms and low stop-word ratio (content-rich)
    if (termCount > 12) return 'high';
    if (stopWordRatio < 0.3) return 'high';
    return 'medium';
  }

  // Moderate tier: inherently less certain (between boundaries)
  if (termCount === SIMPLE_TERM_THRESHOLD + 1 || termCount === COMPLEX_TERM_THRESHOLD) {
    return 'low'; // Near boundary
  }
  return 'medium';
}

/**
 * Detect a short query that lacks a confident retrieval anchor.
 *
 * A multi-term query within the simple term budget, with no trigger-phrase
 * match and a high stop-word ratio, is generic: the cheap simple route would
 * strip it of the extra channels and synonym/embedding expansion it most needs,
 * so a real match reads as a weak result. Content-rich short queries (low
 * stop-word ratio), trigger-anchored queries, and single tokens are excluded —
 * they stay on the fast path.
 *
 * @param termCount     - Number of query terms.
 * @param hasTrigger    - Whether a trigger phrase matched.
 * @param stopWordRatio - Ratio of stop words in the query.
 * @returns True when the query should escalate to the full pipeline.
 */
function isLowSignalShortQuery(
  termCount: number,
  hasTrigger: boolean,
  stopWordRatio: number,
): boolean {
  return termCount >= 2
    && termCount <= SIMPLE_TERM_THRESHOLD
    && !hasTrigger
    && stopWordRatio >= LOW_SIGNAL_STOPWORD_RATIO;
}

function isContentRichShortQuery(
  termCount: number,
  hasTrigger: boolean,
  stopWordRatio: number,
): boolean {
  return termCount >= 2
    && termCount <= SIMPLE_TERM_THRESHOLD
    && !hasTrigger
    && stopWordRatio <= CONTENT_RICH_SHORT_STOPWORD_RATIO;
}

/**
 * Classify a query's complexity into one of three tiers: simple, moderate, or complex.
 *
 * Classification boundaries:
 * - Simple: ≤3 terms OR trigger phrase match
 * - Complex: >8 terms AND no trigger match
 * - Moderate: everything else (interior)
 *
 * A simple-tier query with no trigger anchor and a high stop-word ratio is
 * escalated to complex (full pipeline) with low confidence — see
 * isLowSignalShortQuery — so generic short queries are not starved of recall.
 *
 * When the SPECKIT_COMPLEXITY_ROUTER feature flag is disabled (enabled by default,
 * graduated), all queries classify as "complex" (safe fallback — full pipeline).
 *
 * On any error, returns "complex" (safe fallback per spec).
 *
 * @param query          - Raw user query string.
 * @param triggerPhrases - Optional array of known trigger phrases.
 * @returns ClassificationResult with tier, features, and confidence.
 */
function classifyQueryComplexity(
  query: string,
  triggerPhrases?: string[],
): ClassificationResult {
  // Safe fallback for any unexpected state
  const FALLBACK: ClassificationResult = {
    tier: 'complex',
    features: { termCount: 0, charCount: 0, hasTriggerMatch: false, stopWordRatio: 0 },
    confidence: 'fallback',
    queryPlan: buildComplexityQueryPlan({
      complexity: 'complex',
      confidence: 'fallback',
      termCount: 0,
      hasTriggerMatch: false,
    }),
  };

  try {
    // Feature flag gate: when disabled, always return complex
    if (!isComplexityRouterEnabled()) {
      return FALLBACK;
    }

    // Edge case: empty or whitespace-only queries → complex fallback
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return FALLBACK;
    }

    const terms = extractTerms(query);
    const termCount = terms.length;
    const charCount = query.length;
    const triggers = triggerPhrases ?? [];
    const triggerMatch = hasTriggerMatch(query, triggers);
    const stopWordRatio = calculateStopWordRatio(terms);

    // Classification boundaries
    let tier: QueryComplexityTier;

    // TriggerMatch always forces simple tier regardless of term count
    if (triggerMatch || termCount <= SIMPLE_TERM_THRESHOLD) {
      tier = 'simple';
    } else if (termCount > COMPLEX_TERM_THRESHOLD && !triggerMatch) {
      tier = 'complex';
    } else {
      tier = 'moderate';
    }

    let confidence: 'high' | 'medium' | 'low' | 'fallback' =
      determineConfidence(tier, termCount, triggerMatch, stopWordRatio);

    // Generic-query deep routing: a low-signal short query is escalated off the
    // channel-reduced simple route to the full pipeline, where the extra
    // channels and synonym/embedding expansion give it a chance to recall.
    // Confidence is marked 'low' so downstream recall-preserving paths (token
    // budget, weak-result recovery) also engage. This adds no LLM calls — HyDE
    // and reformulation gate separately on deep request mode.
    if (tier === 'simple' && isLowSignalShortQuery(termCount, triggerMatch, stopWordRatio)) {
      tier = 'complex';
      confidence = 'low';
    }

    return {
      tier,
      features: {
        termCount,
        charCount,
        hasTriggerMatch: triggerMatch,
        // Round to 3 decimals to avoid floating-point noise in debug output
        stopWordRatio: Math.round(stopWordRatio * 1000) / 1000,
      },
      confidence,
      queryPlan: buildComplexityQueryPlan({
        complexity: tier,
        confidence,
        termCount,
        hasTriggerMatch: triggerMatch,
      }),
    };
  } catch (_err: unknown) {
    // Classification failure — return moderate default
    return FALLBACK;
  }
}

/* --- 5. EXPORTS --- */

export {
  // Types
  type QueryComplexityTier,
  type ClassificationResult,

  // Constants
  SIMPLE_TERM_THRESHOLD,
  COMPLEX_TERM_THRESHOLD,
  STOP_WORDS,
  CONTENT_RICH_SHORT_STOPWORD_RATIO,

  // Functions
  classifyQueryComplexity,
  isComplexityRouterEnabled,
  isContentRichShortQuery,

  // Internal helpers (exported for testing)
  extractTerms,
  calculateStopWordRatio,
  hasTriggerMatch,
};

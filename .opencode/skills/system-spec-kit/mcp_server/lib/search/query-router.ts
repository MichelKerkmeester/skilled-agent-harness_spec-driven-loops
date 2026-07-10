// ───────────────────────────────────────────────────────────────
// MODULE: Query Router
// ───────────────────────────────────────────────────────────────
// Tier-to-channel-subset routing with BM25 and graph preservation overrides.
// Preserves authority-oriented retrieval signals without widening every query
// to the full search pipeline.

import type Database from 'better-sqlite3';
import {
  classifyQueryComplexity,
  isComplexityRouterEnabled,
  isContentRichShortQuery,
  type QueryComplexityTier,
  type ClassificationResult,
} from './query-classifier.js';
import { getStrategyForQuery, type ArtifactClass } from './artifact-routing.js';
import * as intentClassifier from './intent-classifier.js';
import {
  buildRoutingQueryPlan,
  inferAuthorityNeed,
  mergeQueryPlans,
  type QueryPlan,
} from '../query/query-plan.js';
import * as vectorIndex from './vector-index.js';
import { getEntityDensityScore } from './entity-density.js';
import { recordInvocation } from './routing-telemetry.js';
import {
  classifyRetrievalClass,
  isSingleHopRetrieval,
  type RetrievalClass,
} from './retrieval-class-classifier.js';
import {
  isContentRichShortQueryGraphPreservationEnabled,
  isRetrievalClassRoutingEnabled,
} from './search-flags.js';

// Feature catalog: Query complexity router
// Feature catalog: Query complexity router


/* ───────────────────────────────────────────────────────────────
   1. TYPES & CONSTANTS
----------------------------------------------------------------*/

/** Channel names matching the retrieval lanes accepted by the fuser. */
type ChannelName = 'vector' | 'fts' | 'bm25' | 'graph' | 'degree' | 'summary' | 'community';

/** Maps each complexity tier to the set of channels that should be executed. */
interface ChannelRoutingConfig {
  simple: ChannelName[];
  moderate: ChannelName[];
  complex: ChannelName[];
}

/** Result of the routeQuery convenience function. */
interface RouteResult {
  tier: QueryComplexityTier;
  channels: ChannelName[];
  classification: ClassificationResult;
  retrievalClass: RetrievalClass;
  queryPlan: QueryPlan;
  qualityFallback: QualityGapFallbackPlan;
}

interface QualityGapSignal {
  quality?: string;
  avgScore?: number;
  avg_score?: number;
}

interface QualityGapFallbackPlan {
  engaged: boolean;
  reason: string | null;
  deadlineMs: number;
  tiers: Array<'fts5' | 'bm25' | 'grep'>;
}

/** Stable default channels in execution order. */
const BASE_CHANNELS: readonly ChannelName[] = ['vector', 'fts', 'bm25', 'graph', 'degree'] as const;
const ALL_CHANNELS: readonly ChannelName[] = BASE_CHANNELS;

/** Minimum required channels for safe routing. */
const MIN_CHANNELS = 2;

/** Fallback channels used to pad configs that violate the minimum invariant. */
const FALLBACK_CHANNELS: readonly ChannelName[] = ['vector', 'fts'] as const;
const BM25_PRESERVING_ARTIFACTS = new Set([
  'spec',
  'plan',
  'tasks',
  'checklist',
  'decision-record',
  'implementation-summary',
  'research',
]);

/** Entity-density threshold: ≥2 query terms hitting high-degree memory rows. */
const ENTITY_DENSITY_ACTIVATION_THRESHOLD = 2;
const QUALITY_GAP_AVG_SCORE_THRESHOLD = 0.20;
const QUALITY_GAP_FALLBACK_DEADLINE_MS = 200;
const MAX_ROUTING_REASON_LENGTH = 120;

let _hasWarnedInvalidGraphPreservationFlag = false;
const _safeGetDbWarnedClasses = new Set<string>();

// Monitor-only counter: total content-rich-short-query graph/degree
// preservation events this process has observed. Additive-only — never read
// by routing logic, never gates or delays channel selection. Exists so a
// future session investigating concurrent DB load on the graph/degree
// channels has a real number instead of re-deriving the fixture evidence.
let _contentRichShortQueryGraphPreservationCount = 0;

/* ───────────────────────────────────────────────────────────────
   2. DEFAULT ROUTING CONFIG
----------------------------------------------------------------*/

/**
 * Default tier-to-channel mapping:
 * - simple:   2 channels (vector + fts) — fastest path
 * - moderate: 3 channels (vector + fts + bm25) — balanced
 * - complex:  5 channels (all) — full pipeline
 */
const DEFAULT_ROUTING_CONFIG: ChannelRoutingConfig = {
  simple: ['vector', 'fts'],
  moderate: ['vector', 'fts', 'bm25'],
  complex: ['vector', 'fts', 'bm25', 'graph', 'degree'],
};

function getAllChannels(): ChannelName[] {
  return [...BASE_CHANNELS];
}

function getDefaultRoutingConfig(): ChannelRoutingConfig {
  return DEFAULT_ROUTING_CONFIG;
}

/* ───────────────────────────────────────────────────────────────
   3. CHANNEL SUBSET RESOLUTION
----------------------------------------------------------------*/

/**
 * Enforce the minimum 2-distinct-channel invariant on a channel list.
 * If the list has fewer than MIN_CHANNELS entries, pad with
 * fallback channels (vector, fts) until the minimum is met.
 */
function enforceMinimumChannels(channels: ChannelName[]): ChannelName[] {
  const result = [...new Set(channels)] as ChannelName[];
  if (result.length >= MIN_CHANNELS) return result;

  for (const fallback of FALLBACK_CHANNELS) {
    if (result.length >= MIN_CHANNELS) break;
    if (!result.includes(fallback)) {
      result.push(fallback);
    }
  }

  return result;
}

/**
 * Get the channel subset for a given complexity tier.
 *
 * @param tier - The classified query complexity tier
 * @param config - Optional custom routing config (defaults to DEFAULT_ROUTING_CONFIG)
 * @returns Array of channel names to execute, guaranteed minimum 2 channels
 */
function getChannelSubset(
  tier: QueryComplexityTier,
  config?: ChannelRoutingConfig,
): ChannelName[] {
  const effectiveConfig = config ?? getDefaultRoutingConfig();
  const channels = effectiveConfig[tier] ?? getAllChannels();
  return enforceMinimumChannels([...channels]);
}

/**
 * Decides whether BM25 should be preserved independently of complexity tier.
 *
 * Intent triggers (`find_spec`, `find_decision`) preserve BM25 even for simple
 * queries because exact lexical matches matter for spec and decision retrieval.
 * Artifact-class authority preserves BM25 for documentation packets with
 * durable source-of-truth semantics. `precomputedIntent` lets callers reuse an
 * already-classified intent and skip duplicate classifier work.
 *
 * @param query - Raw search query.
 * @param precomputedIntent - Optional intent label already computed by caller.
 * @returns True when BM25 should be added to the selected channel set.
 */
function shouldPreserveBm25(query: string, precomputedIntent?: string): boolean {
  const intent = precomputedIntent ?? intentClassifier.classifyIntent(query).intent;
  if (intent === 'find_spec' || intent === 'find_decision') {
    return true;
  }

  const artifact = resolveArtifactClass(query);
  return BM25_PRESERVING_ARTIFACTS.has(artifact);
}

/**
 * Reads the default-ON graph preservation feature flag.
 *
 * Unset values enable preservation. `"1"`, `"true"`, `"yes"`, and `"on"`
 * enable it; `"0"`, `"false"`, `"no"`, `"off"`, and `""` disable it. Unknown
 * values default to enabled and warn once so operators can spot typos without
 * losing the safe default.
 *
 * @returns True when graph-channel preservation should be active.
 */
function isGraphChannelPreservationEnabled(): boolean {
  const raw = process.env.SPECKIT_GRAPH_CHANNEL_PRESERVATION;
  if (raw === undefined) return true;

  const normalized = raw.trim().toLowerCase();
  if (['0', 'false', 'no', 'off', ''].includes(normalized)) return false;
  if (['1', 'true', 'yes', 'on'].includes(normalized)) return true;

  if (!_hasWarnedInvalidGraphPreservationFlag) {
    console.warn(
      '[query-router] Unrecognized SPECKIT_GRAPH_CHANNEL_PRESERVATION value; defaulting to enabled:',
      raw,
    );
    _hasWarnedInvalidGraphPreservationFlag = true;
  }
  return true;
}

interface GraphPreservationDecision {
  preserved: boolean;
  reasons: string[];
  includeDegree: boolean;
}

function shouldPreserveGraphForContentRichShortQuery(
  classification: ClassificationResult,
): boolean {
  return isContentRichShortQueryGraphPreservationEnabled()
    && classification.tier === 'simple'
    && isContentRichShortQuery(
      classification.features.termCount,
      classification.features.hasTriggerMatch,
      classification.features.stopWordRatio,
    );
}

/**
 * Decide whether the graph channel should be added to a
 * routing decision regardless of complexity tier.
 *
 * The feature flag self-gates this helper so direct callers see the same
 * disabled behavior as routeQuery. Intent gates preserve graph for `find_spec`
 * and `find_decision`; entity-density gates preserve graph when at least two
 * query terms hit high-degree memory rows. `precomputedIntent` lets routeQuery
 * pass the already-classified intent and avoid duplicate classifier work.
 *
 * - Intent-driven: `find_decision` or `find_spec` → preserved.
 * - Entity-density: ≥2 query terms exact-match titles/triggers of memory_index
 *   rows with ≥3 outgoing causal_edges → preserved + degree.
 *
 * Retrieval-class SingleHop suppression is gated behind the default-off
 * `SPECKIT_RETRIEVAL_CLASS_ROUTING` flag: with the flag OFF (default) the
 * SingleHop short-circuit is skipped so graph preservation matches the
 * pre-retrieval-class baseline; with the flag ON a SingleHop query suppresses
 * graph + degree before the intent/entity-density checks run.
 *
 * Cold-start (empty causal_edges or missing DB): the entity-density signal
 * scores 0 and the override stays inactive.
 *
 * @param query - Raw search query.
 * @param db - Optional database handle used for entity-density scoring.
 * @param precomputedIntent - Optional intent label already computed by caller.
 * @returns Graph preservation decision and reason labels.
 */
function shouldPreserveGraph(
  query: string,
  db: Database.Database | null,
  precomputedIntent?: string,
  retrievalClass: RetrievalClass = 'Neutral',
): GraphPreservationDecision {
  if (!isGraphChannelPreservationEnabled()) {
    return { preserved: false, reasons: [], includeDegree: false };
  }

  if (isRetrievalClassRoutingEnabled() && isSingleHopRetrieval(retrievalClass)) {
    return { preserved: false, reasons: [], includeDegree: false };
  }

  const reasons: string[] = [];
  let preserved = false;
  let includeDegree = false;

  const intent = precomputedIntent ?? intentClassifier.classifyIntent(query).intent;
  if (intent === 'find_spec' || intent === 'find_decision') {
    preserved = true;
    reasons.push('graph-preserved-by-intent');
  }

  const densityScore = getEntityDensityScore(query, db);
  if (densityScore >= ENTITY_DENSITY_ACTIVATION_THRESHOLD) {
    preserved = true;
    includeDegree = true;
    reasons.push('graph-preserved-by-entity-density');
  }

  return { preserved, reasons, includeDegree };
}

/**
 * Resolve the vector-index database handle for optional entity-density routing.
 *
 * Database initialization can fail differently across boot states, so this
 * helper preserves the null-on-failure contract while warning once per error
 * class to keep repeated routing calls from flooding stderr.
 */
function safeGetDb(): Database.Database | null {
  try {
    return vectorIndex.getDb();
  } catch (err: unknown) {
    const errClass = err instanceof Error ? err.constructor.name : typeof err;
    if (!_safeGetDbWarnedClasses.has(errClass)) {
      _safeGetDbWarnedClasses.add(errClass);
      const message = err instanceof Error ? err.message : String(err);
      console.warn(`[query-router] safeGetDb failed (${errClass}): ${message}`);
    }
    return null;
  }
}

function resolveArtifactClass(query: string): ArtifactClass {
  try {
    return getStrategyForQuery(query)?.detectedClass ?? 'unknown';
  } catch {
    return 'unknown';
  }
}

function resolveAvgScore(signal: QualityGapSignal | undefined): number | null {
  const candidate = signal?.avgScore ?? signal?.avg_score;
  return typeof candidate === 'number' && Number.isFinite(candidate) ? candidate : null;
}

function buildQualityGapFallbackPlan(signal?: QualityGapSignal): QualityGapFallbackPlan {
  const avgScore = resolveAvgScore(signal);
  const quality = typeof signal?.quality === 'string' ? signal.quality.toLowerCase() : null;
  const engaged = quality === 'gap' && avgScore !== null && avgScore < QUALITY_GAP_AVG_SCORE_THRESHOLD;

  return {
    engaged,
    reason: engaged
      ? `QUALITY=gap and avg_score=${avgScore.toFixed(3)} below ${QUALITY_GAP_AVG_SCORE_THRESHOLD.toFixed(2)}`
      : null,
    deadlineMs: QUALITY_GAP_FALLBACK_DEADLINE_MS,
    tiers: engaged ? ['fts5', 'bm25', 'grep'] : [],
  };
}

function clampRoutingReason(reason: string): string {
  if (reason.length <= MAX_ROUTING_REASON_LENGTH) return reason;
  return `${reason.slice(0, MAX_ROUTING_REASON_LENGTH - 1)}…`;
}

function appendRoutingReason(reasons: string[], reason: string): void {
  const clamped = clampRoutingReason(reason);
  if (!reasons.includes(clamped)) reasons.push(clamped);
}

function clampRoutingReasons(reasons: readonly string[]): string[] {
  return reasons.map(clampRoutingReason);
}

/**
 * Monitor-only signal: how many times this process has preserved the
 * graph/degree channels specifically for a content-rich short query since
 * start (or since the last `resetContentRichShortQueryGraphPreservationCount()`
 * call). Additive observability only — never consumed by routing logic.
 */
function getContentRichShortQueryGraphPreservationCount(): number {
  return _contentRichShortQueryGraphPreservationCount;
}

/** Prevent prior measurements from contaminating independent telemetry samples. */
function resetContentRichShortQueryGraphPreservationCount(): void {
  _contentRichShortQueryGraphPreservationCount = 0;
}

/* ───────────────────────────────────────────────────────────────
   4. CONVENIENCE: CLASSIFY + ROUTE
----------------------------------------------------------------*/

/**
 * Classify a query's complexity and route it to the appropriate channel subset
 * in a single call.
 *
 * When the SPECKIT_COMPLEXITY_ROUTER feature flag is disabled, returns all 5 channels
 * (full pipeline) regardless of classification result.
 *
 * @param query - The search query to classify and route
 * @param triggerPhrases - Optional trigger phrases for simple-tier classification
 * @returns RouteResult with tier, channels, and full classification details
 */
function routeQuery(
  query: string,
  triggerPhrases?: string[],
  qualitySignal?: QualityGapSignal,
): RouteResult {
  const classification = classifyQueryComplexity(query, triggerPhrases);
  const retrievalClass = classifyRetrievalClass(query).retrievalClass;
  const qualityFallback = buildQualityGapFallbackPlan(qualitySignal);
  const intent = intentClassifier.classifyIntent(query).intent;

  // When feature flag is disabled, classifier returns 'complex' with 'fallback' confidence.
  // In that case, always return all channels (full pipeline — safe default).
  if (!isComplexityRouterEnabled()) {
    const artifactClass = resolveArtifactClass(query);
    const routingPlan = buildRoutingQueryPlan({
      query,
      complexity: classification.tier,
      artifactClass,
      selectedChannels: ALL_CHANNELS,
      allChannels: ALL_CHANNELS,
      intent,
      authorityNeed: inferAuthorityNeed({ intent, artifactClass, query }),
      routingReasons: clampRoutingReasons([
        'complexity-router-disabled',
        ...(qualityFallback.engaged ? ['quality-gap-fallback-engaged'] : []),
      ]),
      fallbackPolicy: {
        mode: qualityFallback.engaged ? 'fts5_bm25_grep_broadening' : 'full_pipeline',
        reason: qualityFallback.reason ?? 'Complexity router disabled, preserving full pipeline behavior',
        ...(qualityFallback.engaged ? {
          tiers: qualityFallback.tiers,
          deadlineMs: qualityFallback.deadlineMs,
        } : {}),
      },
    });
    recordInvocation([...ALL_CHANNELS]);
    return {
      tier: classification.tier,
      channels: [...ALL_CHANNELS],
      classification,
      retrievalClass,
      queryPlan: mergeQueryPlans(classification.queryPlan, routingPlan),
      qualityFallback,
    };
  }

  const channels = getChannelSubset(classification.tier);
  const artifactClass = resolveArtifactClass(query);

  // Existing override: BM25 preservation for simple-tier authority-focused
  // queries. Behavior unchanged.
  const preserveBm25 = classification.tier === 'simple' && shouldPreserveBm25(query, intent);
  let adjustedChannels = preserveBm25
    ? enforceMinimumChannels([...channels, 'bm25'])
    : channels;
  const routingReasons: string[] = [];
  if (
    preserveBm25
    && adjustedChannels.includes('bm25')
    && !channels.includes('bm25')
  ) {
    const reason = intent === 'find_spec' || intent === 'find_decision'
      ? 'bm25-preserved-by-intent'
      : 'bm25-preserved-by-artifact-class';
    appendRoutingReason(routingReasons, reason);
  }

  // Graph-channel preservation override. Adds the graph
  // channel to simple/moderate tiers when intent is find_spec/find_decision OR
  // when the entity-density signal fires. Complex-tier already includes graph
  // so the override is a no-op there. The default-on feature flag
  // keeps a clean revert path.
  if (isGraphChannelPreservationEnabled() && classification.tier !== 'complex') {
    const decision = shouldPreserveGraph(query, safeGetDb(), intent, retrievalClass);
    if (decision.preserved) {
      const additions: ChannelName[] = ['graph'];
      if (decision.includeDegree) additions.push('degree');
      adjustedChannels = enforceMinimumChannels([...adjustedChannels, ...additions]);
      for (const reason of decision.reasons) {
        appendRoutingReason(routingReasons, reason);
      }
    }

    if (shouldPreserveGraphForContentRichShortQuery(classification)) {
      adjustedChannels = enforceMinimumChannels([...adjustedChannels, 'graph', 'degree']);
      appendRoutingReason(routingReasons, 'graph-preserved-by-content-rich-short-query');
      appendRoutingReason(routingReasons, 'degree-preserved-by-content-rich-short-query');
      _contentRichShortQueryGraphPreservationCount += 1;
    }
  }

  const routingPlan = buildRoutingQueryPlan({
    query,
    complexity: classification.tier,
    artifactClass,
    selectedChannels: adjustedChannels,
    allChannels: getAllChannels(),
    intent,
    authorityNeed: inferAuthorityNeed({ intent, artifactClass, query }),
    routingReasons: clampRoutingReasons([
      ...routingReasons,
      ...(qualityFallback.engaged ? ['quality-gap-fallback-engaged'] : []),
    ]),
    fallbackPolicy: qualityFallback.engaged ? {
      mode: 'fts5_bm25_grep_broadening',
      reason: qualityFallback.reason ?? 'QUALITY=gap fallback engaged',
      tiers: qualityFallback.tiers,
      deadlineMs: qualityFallback.deadlineMs,
    } : undefined,
  });

  recordInvocation(adjustedChannels);

  return {
    tier: classification.tier,
    channels: adjustedChannels,
    classification,
    retrievalClass,
    queryPlan: mergeQueryPlans(classification.queryPlan, routingPlan),
    qualityFallback,
  };
}

/* ───────────────────────────────────────────────────────────────
   5. EXPORTS
----------------------------------------------------------------*/

export {
  // Types
  type ChannelName,
  type ChannelRoutingConfig,
  type RouteResult,

  // Constants
  DEFAULT_ROUTING_CONFIG,
  ALL_CHANNELS,
  MIN_CHANNELS,
  FALLBACK_CHANNELS,
  ENTITY_DENSITY_ACTIVATION_THRESHOLD,
  QUALITY_GAP_AVG_SCORE_THRESHOLD,
  QUALITY_GAP_FALLBACK_DEADLINE_MS,

  // Functions
  getChannelSubset,
  getAllChannels,
  routeQuery,
  buildQualityGapFallbackPlan,
  shouldPreserveGraph,
  isGraphChannelPreservationEnabled,
  shouldPreserveGraphForContentRichShortQuery,
  getContentRichShortQueryGraphPreservationCount,
  resetContentRichShortQueryGraphPreservationCount,

  // Internal helpers (exported for testing)
  enforceMinimumChannels,
};

// ───────────────────────────────────────────────────────────────
// MODULE: Query Router
// ───────────────────────────────────────────────────────────────
// Tier-to-channel-subset routing for query complexity
// Maps classifier tiers to channel subsets for selective pipeline execution.

import type Database from 'better-sqlite3';
import {
  classifyQueryComplexity,
  isComplexityRouterEnabled,
  type QueryComplexityTier,
  type ClassificationResult,
} from './query-classifier.js';
import { getStrategyForQuery } from './artifact-routing.js';
import { classifyIntent } from './intent-classifier.js';
import {
  buildRoutingQueryPlan,
  inferAuthorityNeed,
  mergeQueryPlans,
  type QueryPlan,
} from '../query/query-plan.js';
import * as vectorIndex from './vector-index.js';
import { getEntityDensityScore } from './entity-density.js';
import { recordInvocation } from './routing-telemetry.js';

// Feature catalog: Query complexity router
// Feature catalog: Causal graph channel routing utilization


/* ───────────────────────────────────────────────────────────────
   1. TYPES & CONSTANTS
----------------------------------------------------------------*/

/** Channel names matching SOURCE_TYPES in rrf-fusion.ts */
type ChannelName = 'vector' | 'fts' | 'bm25' | 'graph' | 'degree';

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
  queryPlan: QueryPlan;
}

/** All available channels in execution order. */
const ALL_CHANNELS: readonly ChannelName[] = ['vector', 'fts', 'bm25', 'graph', 'degree'] as const;

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
  const effectiveConfig = config ?? DEFAULT_ROUTING_CONFIG;
  const channels = effectiveConfig[tier] ?? [...ALL_CHANNELS];
  return enforceMinimumChannels([...channels]);
}

function shouldPreserveBm25(query: string): boolean {
  const intent = classifyIntent(query).intent;
  if (intent === 'find_spec' || intent === 'find_decision') {
    return true;
  }

  const artifact = getStrategyForQuery(query).detectedClass;
  return BM25_PRESERVING_ARTIFACTS.has(artifact);
}

/**
 * Default-ON feature flag for graph-channel preservation. Set
 * SPECKIT_GRAPH_CHANNEL_PRESERVATION=false (P2 / REQ-008) to no-op the
 * shouldPreserveGraph + entity-density override and revert to byte-for-byte
 * pre-change channel selection.
 */
function isGraphChannelPreservationEnabled(): boolean {
  const raw = process.env.SPECKIT_GRAPH_CHANNEL_PRESERVATION?.toLowerCase()?.trim();
  return raw !== 'false';
}

interface GraphPreservationDecision {
  preserved: boolean;
  reasons: string[];
  includeDegree: boolean;
}

/**
 * REQ-001 / REQ-003: Decide whether the graph channel should be added to a
 * routing decision regardless of complexity tier. Mirrors shouldPreserveBm25
 * semantics (intent-driven) and adds an entity-density override.
 *
 * - Intent-driven: classifyIntent ∈ {find_decision, find_spec} → preserved.
 * - Entity-density: ≥2 query terms exact-match titles/triggers of memory_index
 *   rows with ≥3 outgoing causal_edges → preserved + degree.
 *
 * Cold-start (empty causal_edges or missing DB): the entity-density signal
 * scores 0 and the override stays inactive (REQ-006).
 */
function shouldPreserveGraph(
  query: string,
  db: Database.Database | null,
): GraphPreservationDecision {
  const reasons: string[] = [];
  let preserved = false;
  let includeDegree = false;

  const intent = classifyIntent(query).intent;
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

function safeGetDb(): Database.Database | null {
  try {
    return vectorIndex.getDb();
  } catch {
    return null;
  }
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
): RouteResult {
  const classification = classifyQueryComplexity(query, triggerPhrases);

  // When feature flag is disabled, classifier returns 'complex' with 'fallback' confidence.
  // In that case, always return all channels (full pipeline — safe default).
  if (!isComplexityRouterEnabled()) {
    const artifactClass = getStrategyForQuery(query).detectedClass;
    const intent = classifyIntent(query).intent;
    const routingPlan = buildRoutingQueryPlan({
      query,
      complexity: classification.tier,
      artifactClass,
      selectedChannels: ALL_CHANNELS,
      allChannels: ALL_CHANNELS,
      intent,
      authorityNeed: inferAuthorityNeed({ intent, artifactClass, query }),
      routingReasons: ['complexity-router-disabled'],
      fallbackPolicy: {
        mode: 'full_pipeline',
        reason: 'Complexity router disabled, preserving full pipeline behavior',
      },
    });
    recordInvocation([...ALL_CHANNELS]);
    return {
      tier: classification.tier,
      channels: [...ALL_CHANNELS],
      classification,
      queryPlan: mergeQueryPlans(classification.queryPlan, routingPlan),
    };
  }

  const channels = getChannelSubset(classification.tier);
  const artifactClass = getStrategyForQuery(query).detectedClass;
  const intent = classifyIntent(query).intent;

  // Existing override: bm25 preservation for simple-tier authority-artifact
  // queries. Behavior unchanged.
  let adjustedChannels = classification.tier === 'simple' && shouldPreserveBm25(query)
    ? enforceMinimumChannels([...channels, 'bm25'])
    : channels;
  const routingReasons: string[] = [];
  if (
    classification.tier === 'simple'
    && adjustedChannels.includes('bm25')
    && !channels.includes('bm25')
  ) {
    routingReasons.push('bm25-preserved-for-authority-artifact');
  }

  // REQ-002 / REQ-003: graph-channel preservation override. Adds the graph
  // channel to simple/moderate tiers when intent is find_spec/find_decision OR
  // when the entity-density signal fires. Complex-tier already includes graph
  // so the override is a no-op there. The feature flag (REQ-008, default-ON)
  // keeps a clean revert path.
  if (isGraphChannelPreservationEnabled() && classification.tier !== 'complex') {
    const decision = shouldPreserveGraph(query, safeGetDb());
    if (decision.preserved) {
      const additions: ChannelName[] = ['graph'];
      if (decision.includeDegree) additions.push('degree');
      adjustedChannels = enforceMinimumChannels([...adjustedChannels, ...additions]);
      for (const reason of decision.reasons) {
        if (!routingReasons.includes(reason)) routingReasons.push(reason);
      }
    }
  }

  const routingPlan = buildRoutingQueryPlan({
    query,
    complexity: classification.tier,
    artifactClass,
    selectedChannels: adjustedChannels,
    allChannels: ALL_CHANNELS,
    intent,
    authorityNeed: inferAuthorityNeed({ intent, artifactClass, query }),
    routingReasons,
  });

  recordInvocation(adjustedChannels);

  return {
    tier: classification.tier,
    channels: adjustedChannels,
    classification,
    queryPlan: mergeQueryPlans(classification.queryPlan, routingPlan),
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

  // Functions
  getChannelSubset,
  routeQuery,
  shouldPreserveGraph,
  isGraphChannelPreservationEnabled,

  // Internal helpers (exported for testing)
  enforceMinimumChannels,
};

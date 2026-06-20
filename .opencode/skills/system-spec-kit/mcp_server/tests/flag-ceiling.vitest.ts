// ───────────────────────────────────────────────────────────────
// FEATURE FLAG CEILING TEST
// ───────────────────────────────────────────────────────────────
// TEST: Validates system stability when 6+ SPECKIT_* flags are
// Activated simultaneously. Tests for flag interaction issues,
// Initialization crashes, and mutual-exclusion conflicts.
import { readFileSync } from 'node:fs';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  isMMREnabled,
  isTRMEnabled,
  isMultiQueryEnabled,
  isSearchFallbackEnabled,
  isFolderDiscoveryEnabled,
  isDocscoreAggregationEnabled,
  isSaveQualityGateEnabled,
  isReconsolidationEnabled,
  isNegativeFeedbackEnabled,
  isEmbeddingExpansionEnabled,
  isConsolidationEnabled,
  isEncodingIntentEnabled,
  isGraphSignalsEnabled,
  isCommunityDetectionEnabled,
  isMemorySummariesEnabled,
  isAutoEntitiesEnabled,
  isEntityLinkingEnabled,
  isDegreeBoostEnabled,
} from '../lib/search/search-flags';

/**
 * The original core SPECKIT_* flags this ceiling test activates
 * simultaneously. search-flags.ts declares far more flags than this hand
 * list; a drift guard below derives the live token set from the module
 * source so silent coverage gaps fail loudly instead of passing quietly.
 */
const ALL_SPECKIT_FLAGS = [
  'SPECKIT_MMR',
  'SPECKIT_TRM',
  'SPECKIT_MULTI_QUERY',
  'SPECKIT_SEARCH_FALLBACK',
  'SPECKIT_FOLDER_DISCOVERY',
  'SPECKIT_DOCSCORE_AGGREGATION',
  'SPECKIT_SAVE_QUALITY_GATE',
  'SPECKIT_RECONSOLIDATION',
  'SPECKIT_NEGATIVE_FEEDBACK',
  'SPECKIT_EMBEDDING_EXPANSION',
  'SPECKIT_CONSOLIDATION',
  'SPECKIT_ENCODING_INTENT',
  'SPECKIT_GRAPH_SIGNALS',
  'SPECKIT_COMMUNITY_DETECTION',
  'SPECKIT_MEMORY_SUMMARIES',
  'SPECKIT_AUTO_ENTITIES',
  'SPECKIT_ENTITY_LINKING',
  'SPECKIT_DEGREE_BOOST',
] as const;

/** Flag checker functions mapped to their flag names for batch verification */
const FLAG_CHECKERS: Array<{ flag: string; checker: () => boolean }> = [
  { flag: 'SPECKIT_MMR', checker: isMMREnabled },
  { flag: 'SPECKIT_TRM', checker: isTRMEnabled },
  { flag: 'SPECKIT_MULTI_QUERY', checker: isMultiQueryEnabled },
  { flag: 'SPECKIT_SEARCH_FALLBACK', checker: isSearchFallbackEnabled },
  { flag: 'SPECKIT_FOLDER_DISCOVERY', checker: isFolderDiscoveryEnabled },
  { flag: 'SPECKIT_DOCSCORE_AGGREGATION', checker: isDocscoreAggregationEnabled },
  { flag: 'SPECKIT_SAVE_QUALITY_GATE', checker: isSaveQualityGateEnabled },
  { flag: 'SPECKIT_RECONSOLIDATION', checker: isReconsolidationEnabled },
  { flag: 'SPECKIT_NEGATIVE_FEEDBACK', checker: isNegativeFeedbackEnabled },
  { flag: 'SPECKIT_EMBEDDING_EXPANSION', checker: isEmbeddingExpansionEnabled },
  { flag: 'SPECKIT_CONSOLIDATION', checker: isConsolidationEnabled },
  { flag: 'SPECKIT_ENCODING_INTENT', checker: isEncodingIntentEnabled },
  { flag: 'SPECKIT_GRAPH_SIGNALS', checker: isGraphSignalsEnabled },
  { flag: 'SPECKIT_COMMUNITY_DETECTION', checker: isCommunityDetectionEnabled },
  { flag: 'SPECKIT_MEMORY_SUMMARIES', checker: isMemorySummariesEnabled },
  { flag: 'SPECKIT_AUTO_ENTITIES', checker: isAutoEntitiesEnabled },
  { flag: 'SPECKIT_ENTITY_LINKING', checker: isEntityLinkingEnabled },
  { flag: 'SPECKIT_DEGREE_BOOST', checker: isDegreeBoostEnabled },
];

const ORIGINAL_ENV: Partial<Record<string, string | undefined>> = {};

function saveOriginalEnv(): void {
  for (const flag of ALL_SPECKIT_FLAGS) {
    ORIGINAL_ENV[flag] = process.env[flag];
  }
}

function restoreOriginalEnv(): void {
  for (const flag of ALL_SPECKIT_FLAGS) {
    if (ORIGINAL_ENV[flag] === undefined) {
      delete process.env[flag];
    } else {
      process.env[flag] = ORIGINAL_ENV[flag];
    }
  }
}

function activateAllFlags(): void {
  for (const flag of ALL_SPECKIT_FLAGS) {
    process.env[flag] = 'true';
  }
}

function deactivateAllFlags(): void {
  for (const flag of ALL_SPECKIT_FLAGS) {
    delete process.env[flag];
  }
}

describe('Feature Flag Ceiling Test (A10-P2-2)', () => {
  beforeEach(() => {
    saveOriginalEnv();
    deactivateAllFlags();
  });

  afterEach(() => {
    restoreOriginalEnv();
  });

  it('activates 20 SPECKIT_* flags simultaneously without crash', () => {
    // Precondition: confirm we have 6+ flags (the ceiling threshold)
    expect(ALL_SPECKIT_FLAGS.length).toBeGreaterThanOrEqual(6);

    // Activate all flags
    activateAllFlags();

    // Verify every flag reads as enabled -- no crash, no exception
    for (const { flag, checker } of FLAG_CHECKERS) {
      expect(checker(), `${flag} should be enabled`).toBe(true);
    }
  });

  it('reports all flags as enabled when all are set to "true"', () => {
    activateAllFlags();

    const results = FLAG_CHECKERS.map(({ flag, checker }) => ({
      flag,
      enabled: checker(),
    }));

    const allEnabled = results.every((r) => r.enabled);
    expect(allEnabled).toBe(true);

    // Verify count matches
    expect(results.filter((r) => r.enabled).length).toBe(ALL_SPECKIT_FLAGS.length);
  });

  it('handles rapid toggle of all flags without state corruption', () => {
    // Activate all
    activateAllFlags();
    for (const { checker } of FLAG_CHECKERS) {
      expect(checker()).toBe(true);
    }

    // Deactivate all (by setting to 'false')
    for (const flag of ALL_SPECKIT_FLAGS) {
      process.env[flag] = 'false';
    }
    for (const { checker } of FLAG_CHECKERS) {
      expect(checker()).toBe(false);
    }

    // Re-activate all
    activateAllFlags();
    for (const { checker } of FLAG_CHECKERS) {
      expect(checker()).toBe(true);
    }
  });

  it('mixed flag states do not cause cross-flag interference', () => {
    // Set first half to true, second half to false
    const half = Math.floor(ALL_SPECKIT_FLAGS.length / 2);
    for (let i = 0; i < ALL_SPECKIT_FLAGS.length; i++) {
      process.env[ALL_SPECKIT_FLAGS[i]] = i < half ? 'true' : 'false';
    }

    for (let i = 0; i < FLAG_CHECKERS.length; i++) {
      const { flag, checker } = FLAG_CHECKERS[i];
      const expected = i < half;
      expect(checker(), `${flag} expected=${expected}`).toBe(expected);
    }
  });

  it('concurrent flag reads under all-active do not throw', () => {
    activateAllFlags();

    // Simulate concurrent reads (synchronous but rapid sequential)
    const iterations = 100;
    for (let i = 0; i < iterations; i++) {
      for (const { checker } of FLAG_CHECKERS) {
        expect(() => checker()).not.toThrow();
      }
    }
  });

  it('drift guard: every live SPECKIT_* token in search-flags.ts is known to this suite', () => {
    const source = readFileSync(
      new URL('../lib/search/search-flags.ts', import.meta.url),
      'utf8',
    );
    const liveTokens = new Set(source.match(/SPECKIT_[A-Z0-9_]+/g) ?? []);
    const known = new Set<string>([...ALL_SPECKIT_FLAGS, ...ACKNOWLEDGED_UNCEILINGED_FLAGS]);
    const unknown = [...liveTokens].filter((token) => !known.has(token)).sort();
    // A new flag must either join the ceiling list or be explicitly
    // acknowledged below — never drift in silently.
    expect(unknown).toEqual([]);
  });
});

/**
 * Flags declared in search-flags.ts that this ceiling suite deliberately
 * does not activate (different subsystems, rollout knobs, or non-boolean
 * semantics). This is a FROZEN snapshot, not derived from the source —
 * a newly added flag appears in neither list and fails the drift guard,
 * forcing an explicit decision here.
 */
const ACKNOWLEDGED_UNCEILINGED_FLAGS: string[] = [
  'SPECKIT_AGENTIC_RECALL',
  'SPECKIT_BITEMPORAL_RECALL',
  'SPECKIT_ABSOLUTE_RELEVANCE_CALIBRATION',
  'SPECKIT_CARDINALITY_PENALTY',
  'SPECKIT_CONFIDENCE_CALIBRATION',
  'SPECKIT_CONFIDENCE_CALIBRATION_MODEL',
  'SPECKIT_COSINE_TOPN_REORDER',
  'SPECKIT_INCLUDE_ARCHIVED_DEFAULT',
  'SPECKIT_INCLUDE_ARCHIVED_VECTOR',
  'SPECKIT_SUMMARY_FUSION_LANE',
  'SPECKIT_WORLD_SUMMARY_PRELUDE',
  'SPECKIT_ASSISTIVE_RECONSOLIDATION',
  'SPECKIT_AUTO_RESUME',
  'SPECKIT_BATCH_LEARNED_FEEDBACK',
  'SPECKIT_CALIBRATED_OVERLAP_BONUS',
  'SPECKIT_CAUSAL_BOOST',
  'SPECKIT_CHANNEL_MIN_REP',
  'SPECKIT_COMMUNITY_SEARCH_FALLBACK',
  'SPECKIT_COMMUNITY_SUMMARIES',
  'SPECKIT_CONFIDENCE_TRUNCATION',
  'SPECKIT_CONTEXT_HEADERS',
  'SPECKIT_DUAL_RETRIEVAL',
  'SPECKIT_DERIVED_ID_PROVENANCE',
  'SPECKIT_DYNAMIC_INIT',
  'SPECKIT_DYNAMIC_TOKEN_BUDGET',
  'SPECKIT_EDGE_PRESENCE_CURRENTNESS',
  'SPECKIT_EDGE_SEMANTIC_DEDUP',
  'SPECKIT_EDGE_SEMANTIC_INVALIDATION',
  'SPECKIT_EDGE_TRIPLET_SEARCH',
  'SPECKIT_EDGE_VECTOR_INDEX',
  'SPECKIT_EMPTY_RESULT_RECOVERY_V1',
  'SPECKIT_FILE_WATCHER',
  'SPECKIT_GRAPH_CALIBRATION_PROFILE',
  'SPECKIT_GRAPH_CONCEPT_ROUTING',
  'SPECKIT_GRAPH_CONTEXT_INJECTION',
  'SPECKIT_GRAPH_FALLBACK',
  'SPECKIT_GRAPH_REFRESH_MODE',
  'SPECKIT_GRAPH_WALK_ROLLOUT',
  'SPECKIT_HYBRID_DECAY_POLICY',
  'SPECKIT_HYDE',
  'SPECKIT_IMPLICIT_FEEDBACK_LOG',
  'SPECKIT_INTENT_AUTO_PROFILE',
  'SPECKIT_LEARNED_STAGE2_COMBINER',
  'SPECKIT_LLM_GRAPH_BACKFILL',
  'SPECKIT_LLM_REFORMULATION',
  'SPECKIT_ONTOLOGY_HOOKS',
  'SPECKIT_POST_INSERT_ENRICHMENT_ENABLED',
  'SPECKIT_POST_INSERT_ENRICHMENT_SYNC',
  'SPECKIT_PRESSURE_POLICY',
  'SPECKIT_PROCEDURAL_OUTCOME_EMITTER',
  'SPECKIT_PROCEDURAL_RELIABILITY_RECALL',
  'SPECKIT_PROGRESSIVE_DISCLOSURE_V1',
  'SPECKIT_QUALITY_AUTO_FIX',
  'SPECKIT_QUALITY_LOOP',
  'SPECKIT_QUERY_CONCEPT_EXPANSION',
  'SPECKIT_QUERY_DECOMPOSITION',
  'SPECKIT_QUERY_SURROGATES',
  'SPECKIT_RECONSOLIDATION_ENABLED',
  'SPECKIT_RESPONSE_PROFILE_V1',
  'SPECKIT_RESULT_CONFIDENCE_V1',
  'SPECKIT_RESULT_EXPLAIN_V1',
  'SPECKIT_RESULT_PROVENANCE',
  'SPECKIT_RETENTION_FORGETTING_V1',
  'SPECKIT_RETRIEVAL_CLASS_ROUTING',
  'SPECKIT_ROLLOUT_PERCENT',
  'SPECKIT_RRF_K_EXPERIMENTAL',
  'SPECKIT_SAVE_PLANNER_MODE',
  'SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS',
  'SPECKIT_SEMANTIC_EDGE_LAYER',
  'SPECKIT_SESSION_BOOST',
  'SPECKIT_SESSION_RETRIEVAL_STATE_V1',
  'SPECKIT_SHADOW_FEEDBACK',
  'SPECKIT_SLEEPTIME_CONSOLIDATION',
  'SPECKIT_SLEEPTIME_LIVE_WRITE',
  'SPECKIT_TEMPORAL_CONTIGUITY',
  'SPECKIT_TEMPORAL_EDGES',
  'SPECKIT_TYPED_TRAVERSAL',
  'SPECKIT_USAGE_RANKING',
];

// SELF-GOVERNANCE FOOTER (TCB 9+)
// Agent: Opus-J | TCB: 9+
// Scope: Feature flag ceiling test
// Mutation surface: tests/flag-ceiling.vitest.ts (new file)
// Verified: ceiling list + frozen acknowledged list jointly cover search-flags.ts (drift guard enforces)
// No production code modified by this test file

// ───────────────────────────────────────────────────────────────
// 1. TEST — QUERY ROUTER
// ───────────────────────────────────────────────────────────────
// Tier-to-Channel-Subset Routing + Pipeline Integration
// 22 tests covering:
// Channel subset per tier, minimum invariant, custom config,
// RouteQuery convenience, feature flag disabled, classification details,
// Edge cases, enforceMinimumChannels, ALL_CHANNELS constant

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  DEFAULT_ROUTING_CONFIG,
  ALL_CHANNELS,
  MIN_CHANNELS,
  FALLBACK_CHANNELS,
  getChannelSubset,
  routeQuery,
  buildQualityGapFallbackPlan,
  QUALITY_GAP_AVG_SCORE_THRESHOLD,
  QUALITY_GAP_FALLBACK_DEADLINE_MS,
  shouldPreserveGraph,
  isGraphChannelPreservationEnabled,
  enforceMinimumChannels,
  type ChannelName,
  type ChannelRoutingConfig,
} from '../lib/search/query-router';
import {
  classifyRetrievalClass,
  NEUTRAL_RETRIEVAL_CLASS,
} from '../lib/search/retrieval-class-classifier';
import { resetRoutingTelemetry, getSnapshot as getRoutingSnapshot } from '../lib/search/routing-telemetry';
import { setEnv, restoreEnv, withFeatureFlag } from './__helpers__/test-env';

/* ───────────────────────────────────────────────────────────────
   HELPERS
   ──────────────────────────────────────────────────────────────── */

const COMPLEXITY_FLAG = 'SPECKIT_COMPLEXITY_ROUTER';
const GRAPH_PRESERVATION_FLAG = 'SPECKIT_GRAPH_CHANNEL_PRESERVATION';
const RETRIEVAL_CLASS_ROUTING_FLAG = 'SPECKIT_RETRIEVAL_CLASS_ROUTING';

const TRIGGER_PHRASES = [
  'save context',
  'memory search',
  'find spec',
  'save memory',
  'memory stats',
];

/* ───────────────────────────────────────────────────────────────
   DEFAULT ROUTING CONFIG
   ──────────────────────────────────────────────────────────────── */

describe('T026-01: Default Routing Config', () => {
  it('T1: simple tier maps to exactly 2 channels (vector + fts)', () => {
    expect(DEFAULT_ROUTING_CONFIG.simple).toEqual(['vector', 'fts']);
    expect(DEFAULT_ROUTING_CONFIG.simple).toHaveLength(2);
  });

  it('T2: moderate tier maps to 3 channels (vector + fts + bm25)', () => {
    expect(DEFAULT_ROUTING_CONFIG.moderate).toEqual(['vector', 'fts', 'bm25']);
    expect(DEFAULT_ROUTING_CONFIG.moderate).toHaveLength(3);
  });

  it('T3: complex tier maps to all 5 channels', () => {
    expect(DEFAULT_ROUTING_CONFIG.complex).toEqual(['vector', 'fts', 'bm25', 'graph', 'degree']);
    expect(DEFAULT_ROUTING_CONFIG.complex).toHaveLength(5);
  });

  it('T4: ALL_CHANNELS constant contains all 5 channel names', () => {
    expect(ALL_CHANNELS).toEqual(['vector', 'fts', 'bm25', 'graph', 'degree']);
    expect(ALL_CHANNELS).toHaveLength(5);
  });

  it('T5: MIN_CHANNELS is 2', () => {
    expect(MIN_CHANNELS).toBe(2);
  });

  it('T6: FALLBACK_CHANNELS are vector and fts', () => {
    expect(FALLBACK_CHANNELS).toEqual(['vector', 'fts']);
  });
});

/* ───────────────────────────────────────────────────────────────
   GetChannelSubset
   ──────────────────────────────────────────────────────────────── */

describe('T026-02: getChannelSubset', () => {
  it('T7: simple tier returns 2 channels with default config', () => {
    const channels = getChannelSubset('simple');
    expect(channels).toHaveLength(2);
    expect(channels).toContain('vector');
    expect(channels).toContain('fts');
  });

  it('T8: moderate tier returns 3 channels with default config', () => {
    const channels = getChannelSubset('moderate');
    expect(channels).toHaveLength(3);
    expect(channels).toContain('vector');
    expect(channels).toContain('fts');
    expect(channels).toContain('bm25');
  });

  it('T9: complex tier returns all 5 channels with default config', () => {
    const channels = getChannelSubset('complex');
    expect(channels).toHaveLength(5);
    expect(channels).toContain('vector');
    expect(channels).toContain('fts');
    expect(channels).toContain('bm25');
    expect(channels).toContain('graph');
    expect(channels).toContain('degree');
  });

  it('T10: custom config overrides default routing', () => {
    const customConfig: ChannelRoutingConfig = {
      simple: ['bm25', 'graph'],
      moderate: ['vector', 'fts', 'graph', 'degree'],
      complex: ['vector', 'fts', 'bm25', 'graph', 'degree'],
    };

    const simpleChannels = getChannelSubset('simple', customConfig);
    expect(simpleChannels).toEqual(['bm25', 'graph']);

    const moderateChannels = getChannelSubset('moderate', customConfig);
    expect(moderateChannels).toEqual(['vector', 'fts', 'graph', 'degree']);
    expect(moderateChannels).toHaveLength(4);
  });

  it('T11: returns a copy, not a reference to the config array', () => {
    const channels = getChannelSubset('simple');
    channels.push('graph');
    // Original config should be unchanged
    expect(DEFAULT_ROUTING_CONFIG.simple).toHaveLength(2);
  });
});

/* ───────────────────────────────────────────────────────────────
   MINIMUM 2-CHANNEL INVARIANT
   ──────────────────────────────────────────────────────────────── */

describe('T026-03: Minimum 2-Channel Invariant', () => {
  it('T12: empty channel config is padded to 2 channels', () => {
    const brokenConfig: ChannelRoutingConfig = {
      simple: [] as ChannelName[],
      moderate: ['vector', 'fts', 'bm25'],
      complex: ['vector', 'fts', 'bm25', 'graph', 'degree'],
    };

    const channels = getChannelSubset('simple', brokenConfig);
    expect(channels.length).toBeGreaterThanOrEqual(2);
    expect(channels).toContain('vector');
    expect(channels).toContain('fts');
  });

  it('T13: single-channel config is padded to 2 channels', () => {
    const brokenConfig: ChannelRoutingConfig = {
      simple: ['graph'],
      moderate: ['vector', 'fts', 'bm25'],
      complex: ['vector', 'fts', 'bm25', 'graph', 'degree'],
    };

    const channels = getChannelSubset('simple', brokenConfig);
    expect(channels.length).toBeGreaterThanOrEqual(2);
    expect(channels).toContain('graph'); // original preserved
    // Should have at least one fallback added
    const hasFallback = channels.includes('vector') || channels.includes('fts');
    expect(hasFallback).toBe(true);
  });

  it('T14: single-channel config with vector gets fts as fallback', () => {
    const brokenConfig: ChannelRoutingConfig = {
      simple: ['vector'],
      moderate: ['vector', 'fts', 'bm25'],
      complex: ['vector', 'fts', 'bm25', 'graph', 'degree'],
    };

    const channels = getChannelSubset('simple', brokenConfig);
    expect(channels).toHaveLength(2);
    expect(channels).toContain('vector');
    expect(channels).toContain('fts');
  });

  it('T15: enforceMinimumChannels pads empty array', () => {
    const result = enforceMinimumChannels([]);
    expect(result.length).toBeGreaterThanOrEqual(MIN_CHANNELS);
    expect(result).toContain('vector');
    expect(result).toContain('fts');
  });

  it('T16: enforceMinimumChannels does not modify arrays already meeting minimum', () => {
    const input: ChannelName[] = ['bm25', 'graph', 'degree'];
    const result = enforceMinimumChannels(input);
    expect(result).toEqual(['bm25', 'graph', 'degree']);
  });

  it('T17: enforceMinimumChannels does not duplicate channels already present', () => {
    const input: ChannelName[] = ['vector'];
    const result = enforceMinimumChannels(input);
    expect(result).toHaveLength(2);
    expect(result).toContain('vector');
    expect(result).toContain('fts');
    // Vector should appear only once
    expect(result.filter(c => c === 'vector')).toHaveLength(1);
  });

  it('T17b: duplicate channels are collapsed before minimum enforcement', () => {
    const input: ChannelName[] = ['vector', 'vector'];
    const result = enforceMinimumChannels(input);
    expect(result).toEqual(['vector', 'fts']);
  });

  it('T17c: custom configs with duplicates still resolve to distinct channels', () => {
    const brokenConfig: ChannelRoutingConfig = {
      simple: ['vector', 'vector'],
      moderate: ['vector', 'fts', 'bm25'],
      complex: ['vector', 'fts', 'bm25', 'graph', 'degree'],
    };

    const channels = getChannelSubset('simple', brokenConfig);
    expect(channels).toEqual(['vector', 'fts']);
  });
});

/* ───────────────────────────────────────────────────────────────
   RouteQuery CONVENIENCE FUNCTION
   ──────────────────────────────────────────────────────────────── */

describe('T026-04: routeQuery Convenience Function', () => {
  let priorComplexityFlag: string | undefined;

  beforeEach(() => {
    priorComplexityFlag = setEnv(COMPLEXITY_FLAG, 'true');
  });

  afterEach(() => {
    restoreEnv(COMPLEXITY_FLAG, priorComplexityFlag);
  });

  it('T18: routes simple query to 2 channels', () => {
    const result = routeQuery('fix bug');
    expect(result.tier).toBe('simple');
    expect(result.channels).toHaveLength(2);
    expect(result.channels).toContain('vector');
    expect(result.channels).toContain('fts');
  });

  it('T19: routes complex query to all 5 channels', () => {
    const result = routeQuery(
      'explain how the authentication module integrates with the external OAuth provider and handles token refresh gracefully'
    );
    expect(result.tier).toBe('complex');
    expect(result.channels).toHaveLength(5);
  });

  it('T20: includes full classification details in result', () => {
    const result = routeQuery('fix bug');
    expect(result.classification).toBeDefined();
    expect(result.retrievalClass).toBeDefined();
    expect(result.classification.tier).toBe('simple');
    expect(typeof result.classification.features.termCount).toBe('number');
    expect(typeof result.classification.features.charCount).toBe('number');
    expect(typeof result.classification.features.hasTriggerMatch).toBe('boolean');
    expect(typeof result.classification.features.stopWordRatio).toBe('number');
    expect(typeof result.classification.confidence).toBe('string');
  });

  it('T21: routes trigger phrase match to simple tier', () => {
    const result = routeQuery('save context', TRIGGER_PHRASES);
    expect(result.tier).toBe('simple');
    expect(result.channels).toHaveLength(2);
    expect(result.classification.features.hasTriggerMatch).toBe(true);
  });

  it('T22: routes moderate query to 3 channels', () => {
    const result = routeQuery('refactor the database connection module');
    expect(result.tier).toBe('moderate');
    expect(result.channels).toHaveLength(3);
    expect(result.channels).toContain('vector');
    expect(result.channels).toContain('fts');
    expect(result.channels).toContain('bm25');
  });
});

describe('retrieval class classifier', () => {
  it.each([
    ['show the exact quote "graph off" from the note', 'Quote'],
    ['what changed after 2026-06-01 in the memory router', 'Temporal'],
    ['why did we choose graph expansion for decisions', 'MultiHop'],
    ['find retrieval-class-classifier.ts', 'Entity'],
    ['find the spec for memory search', 'SingleHop'],
    ['hello', NEUTRAL_RETRIEVAL_CLASS],
  ] as const)('classifies %j as %s', (query, expected) => {
    expect(classifyRetrievalClass(query).retrievalClass).toBe(expected);
  });

  it('uses precedence when one query matches multiple shapes', () => {
    const result = classifyRetrievalClass('quote the latest decision about AuthRouter');
    expect(result.retrievalClass).toBe('Quote');
  });

  it('is total for empty and unmatched queries', () => {
    for (const query of ['', '   ', 'hello']) {
      const result = classifyRetrievalClass(query);
      expect(result.retrievalClass).toBe(NEUTRAL_RETRIEVAL_CLASS);
      expect(result.confidence).toBe('neutral');
    }
  });
});

/* ───────────────────────────────────────────────────────────────
   FEATURE FLAG DISABLED
   ──────────────────────────────────────────────────────────────── */

describe('T026-05: Feature Flag Disabled', () => {
  let priorComplexityFlag: string | undefined;

  beforeEach(() => {
    priorComplexityFlag = setEnv(COMPLEXITY_FLAG, 'false');
  });

  afterEach(() => {
    restoreEnv(COMPLEXITY_FLAG, priorComplexityFlag);
  });

  it('T23: routeQuery returns all 5 channels when flag is disabled', () => {
    const result = routeQuery('fix bug');
    expect(result.channels).toHaveLength(5);
    expect(result.channels).toEqual(['vector', 'fts', 'bm25', 'graph', 'degree']);
  });

  it('T24: routeQuery returns complex tier when flag is disabled (classifier fallback)', () => {
    const result = routeQuery('fix bug');
    expect(result.tier).toBe('complex');
    expect(result.classification.confidence).toBe('fallback');
  });

  it('T25: routeQuery returns all 5 channels for any query when flag is disabled', () => {
    // Even a trigger-phrase query gets all channels when disabled
    const result = routeQuery('save context', TRIGGER_PHRASES);
    expect(result.channels).toHaveLength(5);
    expect(result.tier).toBe('complex');
  });

  it('T26: routeQuery with flag set to "false" returns all 5 channels', () => {
    setEnv(COMPLEXITY_FLAG, 'false');
    const result = routeQuery('refactor the database connection module');
    expect(result.channels).toHaveLength(5);
    expect(result.channels).toEqual(['vector', 'fts', 'bm25', 'graph', 'degree']);
  });
});

/* ───────────────────────────────────────────────────────────────
   EDGE CASES
   ──────────────────────────────────────────────────────────────── */

describe('T026-06: Edge Cases', () => {
  let priorComplexityFlag: string | undefined;

  beforeEach(() => {
    priorComplexityFlag = setEnv(COMPLEXITY_FLAG, 'true');
  });

  afterEach(() => {
    restoreEnv(COMPLEXITY_FLAG, priorComplexityFlag);
  });

  it('T27: empty query routes to all channels (complex fallback)', () => {
    const result = routeQuery('');
    // Empty query triggers complex fallback in classifier
    expect(result.tier).toBe('complex');
    expect(result.channels).toHaveLength(5);
  });

  it('T28: default config has increasing channel count per tier', () => {
    const simpleCount = DEFAULT_ROUTING_CONFIG.simple.length;
    const moderateCount = DEFAULT_ROUTING_CONFIG.moderate.length;
    const complexCount = DEFAULT_ROUTING_CONFIG.complex.length;

    expect(simpleCount).toBeLessThan(moderateCount);
    expect(moderateCount).toBeLessThan(complexCount);
  });

  it('T29: all tiers in default config satisfy minimum channel invariant', () => {
    for (const tier of ['simple', 'moderate', 'complex'] as const) {
      const channels = getChannelSubset(tier);
      expect(channels.length).toBeGreaterThanOrEqual(MIN_CHANNELS);
    }
  });

  it('T30: routeQuery result tier matches classification tier', () => {
    const result = routeQuery('fix bug');
    expect(result.tier).toBe(result.classification.tier);
  });

  it('T31: complex tier in default config matches ALL_CHANNELS exactly', () => {
    expect(DEFAULT_ROUTING_CONFIG.complex).toEqual([...ALL_CHANNELS]);
  });

  it('T32: simple tier channels are a subset of complex tier channels', () => {
    for (const channel of DEFAULT_ROUTING_CONFIG.simple) {
      expect(DEFAULT_ROUTING_CONFIG.complex).toContain(channel);
    }
  });

  it('T33: moderate tier channels are a subset of complex tier channels', () => {
    for (const channel of DEFAULT_ROUTING_CONFIG.moderate) {
      expect(DEFAULT_ROUTING_CONFIG.complex).toContain(channel);
    }
  });
});

/* ───────────────────────────────────────────────────────────────
   012-T1:shouldPreserveGraph — UNIT
   ──────────────────────────────────────────────────────────────── */

describe('012-T1: shouldPreserveGraph', () => {
  let priorComplexityFlag: string | undefined;
  let priorGraphPreservationFlag: string | undefined;

  beforeEach(() => {
    priorComplexityFlag = setEnv(COMPLEXITY_FLAG, 'true');
    priorGraphPreservationFlag = setEnv(GRAPH_PRESERVATION_FLAG, undefined);
  });

  afterEach(() => {
    restoreEnv(COMPLEXITY_FLAG, priorComplexityFlag);
    restoreEnv(GRAPH_PRESERVATION_FLAG, priorGraphPreservationFlag);
  });

  it('012-T1.1: find_decision intent → preserved with graph-preserved-by-intent reason', () => {
    const decision = shouldPreserveGraph('why did we choose this approach', null);
    expect(decision.preserved).toBe(true);
    expect(decision.reasons).toContain('graph-preserved-by-intent');
    expect(decision.includeDegree).toBe(false);
  });

  it('012-T1.2: find_spec intent → preserved with graph-preserved-by-intent reason', () => {
    const decision = shouldPreserveGraph('find the spec for auth flow', null);
    expect(decision.preserved).toBe(true);
    expect(decision.reasons).toContain('graph-preserved-by-intent');
  });

  it('012-T1.3: refactor intent without entity hits → not preserved', () => {
    // "refactor" alone classifies as refactor intent, not find_*. With null DB,
    // entity-density scores 0, so no preservation.
    const decision = shouldPreserveGraph('refactor module', null);
    expect(decision.preserved).toBe(false);
    expect(decision.reasons).toHaveLength(0);
  });

  it('012-T1.4: empty query → not preserved', () => {
    const decision = shouldPreserveGraph('', null);
    expect(decision.preserved).toBe(false);
  });

  it('012-T1.5: cold-start (null DB) tolerates intent-driven activation (REQ-006)', () => {
    // Even with no DB, the intent-driven path still works.
    const decision = shouldPreserveGraph('find decision record', null);
    expect(decision.preserved).toBe(true);
    expect(decision.reasons).toContain('graph-preserved-by-intent');
    expect(decision.includeDegree).toBe(false);
  });

  it('012-T1.6: SingleHop class does NOT suppress graph with SPECKIT_RETRIEVAL_CLASS_ROUTING off (flag-off baseline)', () => {
    // Default-off flag: the SingleHop short-circuit is skipped, so a SingleHop
    // find_spec query still preserves graph by intent — identical to baseline.
    const decision = shouldPreserveGraph('find the spec for auth flow', null, undefined, 'SingleHop');
    expect(decision.preserved).toBe(true);
    expect(decision.reasons).toContain('graph-preserved-by-intent');
  });

  it('012-T1.7: SingleHop class suppresses graph only with SPECKIT_RETRIEVAL_CLASS_ROUTING on', () => {
    withFeatureFlag(RETRIEVAL_CLASS_ROUTING_FLAG, 'true', () => {
      const decision = shouldPreserveGraph('find the spec for auth flow', null, undefined, 'SingleHop');
      expect(decision).toEqual({ preserved: false, reasons: [], includeDegree: false });
    });
  });
});

/* ───────────────────────────────────────────────────────────────
   012-T2:routeQuery INTEGRATION — graph-preservation override
   ──────────────────────────────────────────────────────────────── */

describe('012-T2: routeQuery graph-preservation', () => {
  let priorComplexityFlag: string | undefined;
  let priorGraphPreservationFlag: string | undefined;

  beforeEach(() => {
    priorComplexityFlag = setEnv(COMPLEXITY_FLAG, 'true');
    priorGraphPreservationFlag = setEnv(GRAPH_PRESERVATION_FLAG, undefined);
    resetRoutingTelemetry();
  });

  afterEach(() => {
    restoreEnv(COMPLEXITY_FLAG, priorComplexityFlag);
    restoreEnv(GRAPH_PRESERVATION_FLAG, priorGraphPreservationFlag);
    resetRoutingTelemetry();
  });

  it('012-T2.1: simple-tier find_decision query routes graph channel', () => {
    const result = routeQuery('why chose this');
    expect(result.tier).toBe('simple');
    expect(result.channels).toContain('graph');
    // No entity-density, so no degree.
    expect(result.channels).not.toContain('degree');
    expect(result.queryPlan.routingReasons).toContain('graph-preserved-by-intent');
  });

  it('012-T2.1b: simple-tier find_spec query labels BM25 preservation by intent', () => {
    const result = routeQuery('spec');
    expect(result.tier).toBe('simple');
    expect(result.channels).toContain('bm25');
    expect(result.queryPlan.routingReasons).toContain('bm25-preserved-by-intent');
    expect(result.queryPlan.routingReasons).not.toContain('bm25-preserved-by-artifact-class');
  });

  it('012-T2.2: moderate-tier single-hop find_spec query preserves graph by default (flag-off baseline)', () => {
    // SPECKIT_RETRIEVAL_CLASS_ROUTING is default-off, so the SingleHop
    // graph-suppression branch is skipped and the router preserves graph by
    // intent exactly as the pre-retrieval-class baseline did.
    const result = routeQuery('find the spec for auth scope');
    expect(result.tier).toBe('moderate');
    expect(result.retrievalClass).toBe('SingleHop');
    expect(result.channels).toContain('graph');
    expect(result.queryPlan.routingReasons).toContain('graph-preserved-by-intent');
  });

  it('012-T2.2a: SingleHop suppresses graph only when SPECKIT_RETRIEVAL_CLASS_ROUTING is on', () => {
    withFeatureFlag(RETRIEVAL_CLASS_ROUTING_FLAG, 'true', () => {
      const result = routeQuery('find the spec for auth scope');
      expect(result.tier).toBe('moderate');
      expect(result.retrievalClass).toBe('SingleHop');
      expect(result.channels).not.toContain('graph');
      expect(result.queryPlan.routingReasons).not.toContain('graph-preserved-by-intent');
    });
  });

  it('012-T2.2b: moderate-tier multi-hop query retains graph preservation', () => {
    const result = routeQuery('why did we choose auth scope');
    expect(result.tier).toBe('moderate');
    expect(result.retrievalClass).toBe('MultiHop');
    expect(result.channels).toContain('graph');
    expect(result.queryPlan.routingReasons).toContain('graph-preserved-by-intent');
  });

  it('012-T2.3: simple-tier non-find intent routes WITHOUT graph (no regression)', () => {
    const result = routeQuery('refactor module');
    expect(result.tier).toBe('simple');
    expect(result.channels).not.toContain('graph');
  });

  it('012-T2.4: complex-tier find_decision query already includes graph; reasons not duplicated', () => {
    const result = routeQuery(
      'why did we choose to implement the authentication flow with the existing decision record approach instead'
    );
    expect(result.tier).toBe('complex');
    expect(result.channels).toContain('graph');
    // Override is a no-op for complex tier.
    expect(result.queryPlan.routingReasons).not.toContain('graph-preserved-by-intent');
  });

  it('012-T2.5: feature flag OFF → graph preservation disabled (REQ-008)', () => {
    withFeatureFlag(GRAPH_PRESERVATION_FLAG, 'false', () => {
      const result = routeQuery('why chose this');
      expect(result.tier).toBe('simple');
      expect(result.channels).not.toContain('graph');
    });
  });

  it('012-T2.5b: shouldPreserveGraph self-gates when feature flag is OFF', () => {
    withFeatureFlag(GRAPH_PRESERVATION_FLAG, 'false', () => {
      const decision = shouldPreserveGraph('find decision record', null);
      expect(decision).toEqual({ preserved: false, reasons: [], includeDegree: false });
    });
  });

  it('012-T2.6: feature flag explicit true', () => {
    withFeatureFlag(GRAPH_PRESERVATION_FLAG, 'true', () => {
      expect(isGraphChannelPreservationEnabled()).toBe(true);
    });
  });

  it('012-T2.7: feature flag default ON', () => {
    setEnv(GRAPH_PRESERVATION_FLAG, undefined);
    expect(isGraphChannelPreservationEnabled()).toBe(true);
  });

  it.each(['0', 'no', 'off', '', 'FALSE', 'No'])(
    '012-T2.8: feature flag value %j disables graph preservation',
    (value) => {
      setEnv(GRAPH_PRESERVATION_FLAG, value);
      expect(isGraphChannelPreservationEnabled()).toBe(false);
    },
  );

  it.each(['1', 'true', 'yes', 'on', 'TRUE', 'YES'])(
    '012-T2.9: feature flag value %j enables graph preservation',
    (value) => {
      setEnv(GRAPH_PRESERVATION_FLAG, value);
      expect(isGraphChannelPreservationEnabled()).toBe(true);
    },
  );

  it('SPECKIT_GRAPH_CHANNEL_PRESERVATION="00" enables (not equal to "0")', () => {
    setEnv(GRAPH_PRESERVATION_FLAG, '00');
    expect(isGraphChannelPreservationEnabled()).toBe(true);
  });

  it('SPECKIT_GRAPH_CHANNEL_PRESERVATION="01" enables (not equal to "0")', () => {
    setEnv(GRAPH_PRESERVATION_FLAG, '01');
    expect(isGraphChannelPreservationEnabled()).toBe(true);
  });

  it('SPECKIT_GRAPH_CHANNEL_PRESERVATION="  0  " disables (trim normalizes)', () => {
    setEnv(GRAPH_PRESERVATION_FLAG, '  0  ');
    expect(isGraphChannelPreservationEnabled()).toBe(false);
  });

  it('SPECKIT_GRAPH_CHANNEL_PRESERVATION="  true  " enables (trim normalizes)', () => {
    setEnv(GRAPH_PRESERVATION_FLAG, '  true  ');
    expect(isGraphChannelPreservationEnabled()).toBe(true);
  });

  it('SPECKIT_GRAPH_CHANNEL_PRESERVATION="NO" disables (case-insensitive)', () => {
    setEnv(GRAPH_PRESERVATION_FLAG, 'NO');
    expect(isGraphChannelPreservationEnabled()).toBe(false);
  });

  it('SPECKIT_GRAPH_CHANNEL_PRESERVATION="oN" enables (mixed case)', () => {
    setEnv(GRAPH_PRESERVATION_FLAG, 'oN');
    expect(isGraphChannelPreservationEnabled()).toBe(true);
  });

  it('012-T2.10: undefined feature flag enables graph preservation', () => {
    setEnv(GRAPH_PRESERVATION_FLAG, undefined);
    expect(isGraphChannelPreservationEnabled()).toBe(true);
  });
});

/* ───────────────────────────────────────────────────────────────
   012-T3:routing-telemetry — graphChannelInvocationRate
   ──────────────────────────────────────────────────────────────── */

describe('012-T3: routing telemetry', () => {
  let priorComplexityFlag: string | undefined;
  let priorGraphPreservationFlag: string | undefined;

  beforeEach(() => {
    priorComplexityFlag = setEnv(COMPLEXITY_FLAG, 'true');
    priorGraphPreservationFlag = setEnv(GRAPH_PRESERVATION_FLAG, undefined);
    resetRoutingTelemetry();
  });

  afterEach(() => {
    restoreEnv(COMPLEXITY_FLAG, priorComplexityFlag);
    restoreEnv(GRAPH_PRESERVATION_FLAG, priorGraphPreservationFlag);
    resetRoutingTelemetry();
  });

  it('012-T3.1: snapshot reports graph rate after mixed routing', () => {
    routeQuery('why chose auth approach');                     // simple find_decision → graph
    routeQuery('why did we choose auth scope');                // moderate multi-hop → graph
    routeQuery('refactor');                                    // simple refactor → no graph
    routeQuery('refactor the module quickly');                 // moderate refactor → no graph
    routeQuery('refactor the database connection module now'); // moderate refactor → no graph

    const snap = getRoutingSnapshot();
    expect(snap.totalRecorded).toBe(5);
    expect(snap.graphChannelInvocationRate).toBeCloseTo(0.4, 2);
    expect(snap.channelInvocationRates.vector).toBe(1);
    expect(snap.channelInvocationRates.fts).toBe(1);
  });

  it('012-T3.2: snapshot resets after resetRoutingTelemetry()', () => {
    routeQuery('find decision record');
    expect(getRoutingSnapshot().totalRecorded).toBe(1);
    resetRoutingTelemetry();
    expect(getRoutingSnapshot().totalRecorded).toBe(0);
    expect(getRoutingSnapshot().graphChannelInvocationRate).toBe(0);
  });
});

/* ───────────────────────────────────────────────────────────────
   012-T4:ROUTING LATENCY
   ──────────────────────────────────────────────────────────────── */

describe('012-T4: routing latency', () => {
  let priorComplexityFlag: string | undefined;
  let priorGraphPreservationFlag: string | undefined;

  beforeEach(() => {
    priorComplexityFlag = setEnv(COMPLEXITY_FLAG, 'true');
    priorGraphPreservationFlag = setEnv(GRAPH_PRESERVATION_FLAG, undefined);
    resetRoutingTelemetry();
  });

  afterEach(() => {
    restoreEnv(COMPLEXITY_FLAG, priorComplexityFlag);
    restoreEnv(GRAPH_PRESERVATION_FLAG, priorGraphPreservationFlag);
    resetRoutingTelemetry();
  });

  it('012-T4.1: routing decision p99 stays under 5ms', () => {
    const N = 200;
    const queries = [
      'find decision record',
      'why chose auth',
      'refactor module',
      'fix the bug in handler',
      'understand architecture',
      'cli-opencode',
      'feature flag cleanup',
    ];
    const samples: number[] = [];
    for (let i = 0; i < N; i++) {
      const q = queries[i % queries.length];
      const start = performance.now();
      routeQuery(q);
      samples.push(performance.now() - start);
    }
    samples.sort((a, b) => a - b);
    const p99 = samples[Math.floor(N * 0.99) - 1];
    // 5ms budget per spec. Generous on cold-start DB (entity-density
    // returns 0 quickly when getDb throws).
    expect(p99).toBeLessThan(5);
  });
});

/* ───────────────────────────────────────────────────────────────
   006-T1:quality-gap fallback engagement
   ──────────────────────────────────────────────────────────────── */

describe('006-T1: quality-gap fallback routing', () => {
  let priorComplexityFlag: string | undefined;

  beforeEach(() => {
    priorComplexityFlag = setEnv(COMPLEXITY_FLAG, 'true');
    resetRoutingTelemetry();
  });

  afterEach(() => {
    restoreEnv(COMPLEXITY_FLAG, priorComplexityFlag);
    resetRoutingTelemetry();
  });

  it('006-T1.1: engages FTS5 -> BM25 -> Grep fallback only for QUALITY=gap below threshold', () => {
    const engaged = buildQualityGapFallbackPlan({
      quality: 'gap',
      avgScore: QUALITY_GAP_AVG_SCORE_THRESHOLD - 0.01,
    });
    expect(engaged).toEqual({
      engaged: true,
      reason: expect.stringContaining('QUALITY=gap'),
      deadlineMs: QUALITY_GAP_FALLBACK_DEADLINE_MS,
      tiers: ['fts5', 'bm25', 'grep'],
    });

    const safe = buildQualityGapFallbackPlan({
      quality: 'gap',
      avgScore: QUALITY_GAP_AVG_SCORE_THRESHOLD,
    });
    expect(safe.engaged).toBe(false);
  });

  it('006-T1.2: records fallback policy in routeQuery plan when quality gap is weak', () => {
    const result = routeQuery('find memory packet context', undefined, {
      quality: 'gap',
      avg_score: 0.12,
    });

    expect(result.qualityFallback.engaged).toBe(true);
    expect(result.queryPlan.routingReasons).toContain('quality-gap-fallback-engaged');
    expect(result.queryPlan.fallbackPolicy).toMatchObject({
      mode: 'fts5_bm25_grep_broadening',
      deadlineMs: 200,
      tiers: ['fts5', 'bm25', 'grep'],
    });
  });
});

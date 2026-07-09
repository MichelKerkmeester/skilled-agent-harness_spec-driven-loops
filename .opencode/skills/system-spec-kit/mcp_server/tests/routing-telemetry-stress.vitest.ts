// ───────────────────────────────────────────────────────────────
// TEST — Routing Telemetry Stress (012)
// ───────────────────────────────────────────────────────────────
// Stress coverage for routing-telemetry ring buffer + routeQuery latency
// at higher N than the 012-T4.1 microbenchmark (200-iter), plus cache-
// invalidation behavior under repeated invocations. Authored as scenario 3
// Closeout for -causal-graph-channel-routing

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { routeQuery } from '../lib/search/query-router';
import {
  recordInvocation,
  getSnapshot,
  resetRoutingTelemetry,
  WINDOW_SIZE,
  type ChannelName,
} from '../lib/search/routing-telemetry';
import { invalidateEntityDensityCache } from '../lib/search/entity-density';
import { setEnv, restoreEnv } from './__helpers__/test-env';

const COMPLEXITY_FLAG = 'SPECKIT_COMPLEXITY_ROUTER';
const GRAPH_PRESERVATION_FLAG = 'SPECKIT_GRAPH_CHANNEL_PRESERVATION';
const CONTENT_RICH_SHORT_GRAPH_FLAG = 'SPECKIT_CONTENT_RICH_SHORT_QUERY_GRAPH_PRESERVATION';

/* ───────────────────────────────────────────────────────────────
   012-S1: RING BUFFER OVERFLOW CORRECTNESS
   ──────────────────────────────────────────────────────────────── */

describe('012-S1: ring buffer overflow correctness', () => {
  beforeEach(() => {
    resetRoutingTelemetry();
  });

  afterEach(() => {
    resetRoutingTelemetry();
  });

  it('012-S1.1: recordInvocation over WINDOW_SIZE caps at 200 and drops oldest', () => {
    expect(WINDOW_SIZE).toBe(200);

    // Push 250 distinct decisions, tagged via a marker channel set so we can
    // verify which ones survive the overflow.
    const decisions: ChannelName[][] = [];
    for (let i = 0; i < 250; i++) {
      // Encode iteration into channel set: indices 0..49 use ['vector','fts']
      // (will be dropped); indices 50..249 use ['vector','fts','bm25'] (survive).
      const channels: ChannelName[] = i < 50
        ? ['vector', 'fts']
        : ['vector', 'fts', 'bm25'];
      decisions.push(channels);
      recordInvocation(channels);
    }

    const snap = getSnapshot();
    expect(snap.totalRecorded).toBe(200);
    expect(snap.windowSize).toBe(200);

    // All 200 surviving decisions should have bm25 (since the 50 oldest
    // 'vector+fts' decisions were dropped).
    expect(snap.channelInvocationCounts.bm25).toBe(200);
    expect(snap.channelInvocationCounts.vector).toBe(200);
    expect(snap.channelInvocationCounts.fts).toBe(200);
    expect(snap.channelInvocationCounts.graph).toBe(0);
    expect(snap.channelInvocationCounts.degree).toBe(0);
  });

  it('012-S1.2: pushing exactly WINDOW_SIZE preserves all decisions', () => {
    for (let i = 0; i < WINDOW_SIZE; i++) {
      recordInvocation(['vector', 'fts']);
    }
    const snap = getSnapshot();
    expect(snap.totalRecorded).toBe(WINDOW_SIZE);
    expect(snap.channelInvocationCounts.vector).toBe(WINDOW_SIZE);
  });

  it('012-S1.3: pushing 1 over WINDOW_SIZE drops exactly 1 oldest', () => {
    // First decision is 'unique' marker; rest are baseline.
    recordInvocation(['vector', 'fts', 'graph']);
    for (let i = 0; i < WINDOW_SIZE; i++) {
      recordInvocation(['vector', 'fts']);
    }
    const snap = getSnapshot();
    expect(snap.totalRecorded).toBe(WINDOW_SIZE);
    // The unique 'graph'-bearing first decision should have been dropped.
    expect(snap.channelInvocationCounts.graph).toBe(0);
  });

  it('012-S1.4: rates remain in [0,1] across overflow boundary', () => {
    // Mix that yields ~50% graph activations.
    for (let i = 0; i < 300; i++) {
      const channels: ChannelName[] = i % 2 === 0
        ? ['vector', 'fts', 'bm25', 'graph']
        : ['vector', 'fts', 'bm25'];
      recordInvocation(channels);
    }
    const snap = getSnapshot();
    expect(snap.totalRecorded).toBe(WINDOW_SIZE);
    expect(snap.graphChannelInvocationRate).toBeGreaterThanOrEqual(0);
    expect(snap.graphChannelInvocationRate).toBeLessThanOrEqual(1);
    // Of the surviving 200 decisions (indices 100..299), 100 had graph.
    expect(snap.graphChannelInvocationRate).toBeCloseTo(0.5, 2);
  });
});

/* ───────────────────────────────────────────────────────────────
   012-S2: ROUTEQUERY LATENCY UNDER SUSTAINED BURST
   ──────────────────────────────────────────────────────────────── */

describe('012-S2: routeQuery latency under 1k-iter burst', () => {
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

  it('012-S2.1: routing decision p99 stays under 5ms over 1000 iterations', () => {
    const N = 1000;
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
    const p50 = samples[Math.floor(N * 0.50) - 1];

    // 5ms budget per spec, validated at 5x the 012-T4.1 N=200 size
    expect(p99).toBeLessThan(5);
    // p50 should be much tighter — sanity check that we're not riding the
    // budget ceiling on average.
    expect(p50).toBeLessThan(1);
  });

  it('012-S2.2: telemetry buffer remains capped at WINDOW_SIZE after 1k routings', () => {
    for (let i = 0; i < 1000; i++) {
      routeQuery('refactor module');
    }
    const snap = getSnapshot();
    expect(snap.totalRecorded).toBe(WINDOW_SIZE);
  });
});

/* ───────────────────────────────────────────────────────────────
   012-S3: ENTITY-DENSITY CACHE INVALIDATION UNDER STRESS
   ──────────────────────────────────────────────────────────────── */

describe('012-S3: entity-density cache invalidation under stress', () => {
  let priorComplexityFlag: string | undefined;
  let priorGraphPreservationFlag: string | undefined;
  let priorContentRichShortGraphFlag: string | undefined;

  beforeEach(() => {
    priorComplexityFlag = setEnv(COMPLEXITY_FLAG, 'true');
    priorGraphPreservationFlag = setEnv(GRAPH_PRESERVATION_FLAG, undefined);
    priorContentRichShortGraphFlag = setEnv(CONTENT_RICH_SHORT_GRAPH_FLAG, 'false');
    resetRoutingTelemetry();
    invalidateEntityDensityCache();
  });

  afterEach(() => {
    restoreEnv(COMPLEXITY_FLAG, priorComplexityFlag);
    restoreEnv(GRAPH_PRESERVATION_FLAG, priorGraphPreservationFlag);
    restoreEnv(CONTENT_RICH_SHORT_GRAPH_FLAG, priorContentRichShortGraphFlag);
    resetRoutingTelemetry();
    invalidateEntityDensityCache();
  });

  it('012-S3.1: repeated invalidation between routeQuery calls does not error', () => {
    // 100 cycles of: routeQuery → invalidate cache → routeQuery
    expect(() => {
      for (let i = 0; i < 100; i++) {
        routeQuery('find decision record');
        invalidateEntityDensityCache();
        routeQuery('refactor module');
      }
    }).not.toThrow();

    const snap = getSnapshot();
    expect(snap.totalRecorded).toBe(WINDOW_SIZE);
  });

  it('012-S3.2: invalidate-before-each-call still produces consistent rates', () => {
    // 50 cycles where every routeQuery is preceded by invalidation.
    for (let i = 0; i < 50; i++) {
      invalidateEntityDensityCache();
      // Alternate between graph-preserving and non-preserving intents.
      const q = i % 2 === 0 ? 'find decision record' : 'refactor module';
      routeQuery(q);
    }
    const snap = getSnapshot();
    expect(snap.totalRecorded).toBe(50);
    // find_decision queries route graph; refactor does not. Expect ~0.5 graph rate.
    expect(snap.graphChannelInvocationRate).toBeGreaterThan(0.3);
    expect(snap.graphChannelInvocationRate).toBeLessThan(0.7);
  });
});

/* ───────────────────────────────────────────────────────────────
   012-S4: FEATURE FLAG OFF — LIVE-PATH VERIFICATION
   ──────────────────────────────────────────────────────────────── */

describe('012-S4: feature flag OFF live-path verification', () => {
  let priorComplexityFlag: string | undefined;

  beforeEach(() => {
    priorComplexityFlag = setEnv(COMPLEXITY_FLAG, 'true');
    resetRoutingTelemetry();
  });

  afterEach(() => {
    restoreEnv(COMPLEXITY_FLAG, priorComplexityFlag);
    resetRoutingTelemetry();
  });

  it('012-S4.1: flag=false → find_decision query does NOT add graph', () => {
    setEnv(GRAPH_PRESERVATION_FLAG, 'false');
    const result = routeQuery('why chose auth approach');
    expect(result.channels).not.toContain('graph');
    expect(result.channels).not.toContain('degree');
  });

  it('012-S4.2: flag=false → 100-iter mixed-intent burst produces zero graph activations', () => {
    setEnv(GRAPH_PRESERVATION_FLAG, 'false');
    const queries = [
      'why chose auth',
      'find decision for tasks',
      'refactor module',
      'find spec for memory',
      'fix bug in handler',
    ];
    for (let i = 0; i < 100; i++) {
      routeQuery(queries[i % queries.length]);
    }
    const snap = getSnapshot();
    expect(snap.totalRecorded).toBe(100);
    expect(snap.channelInvocationCounts.graph).toBe(0);
    expect(snap.graphChannelInvocationRate).toBe(0);
  });

  it('012-S4.3: flag toggle ON→OFF→ON within same process is honored per call', () => {
    // ON
    setEnv(GRAPH_PRESERVATION_FLAG, undefined);
    const onResult1 = routeQuery('why chose auth');
    expect(onResult1.channels).toContain('graph');

    // OFF
    setEnv(GRAPH_PRESERVATION_FLAG, 'false');
    const offResult = routeQuery('why chose auth');
    expect(offResult.channels).not.toContain('graph');

    // ON again
    setEnv(GRAPH_PRESERVATION_FLAG, undefined);
    const onResult2 = routeQuery('why chose auth');
    expect(onResult2.channels).toContain('graph');
  });
});

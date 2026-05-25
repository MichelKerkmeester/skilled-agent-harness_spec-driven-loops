// ───────────────────────────────────────────────────────────────
// MODULE: W8 Search Decision Envelope Stress Test
// ───────────────────────────────────────────────────────────────
// Exercises request decision envelope composition and immutability.

import { describe, expect, it } from 'vitest';

import { createEmptyQueryPlan } from '../../lib/query/query-plan.js';
import {
  attachDegradedReadiness,
  attachShadowDeltas,
  buildSearchDecisionEnvelope,
} from '../../lib/search/search-decision-envelope.js';

describe('W8 SearchDecisionEnvelope', () => {
  it('builds an empty versioned envelope with request identity and QueryPlan', () => {
    const queryPlan = createEmptyQueryPlan({ selectedChannels: ['vector', 'fts'] });

    const envelope = buildSearchDecisionEnvelope({
      requestId: 'req-empty',
      queryPlan,
      timestamp: '2026-04-29T00:00:00.000Z',
      latencyMs: 12.4,
    });

    expect(envelope).toMatchObject({
      envelopeVersion: 1,
      requestId: 'req-empty',
      queryPlan,
      timestamp: '2026-04-29T00:00:00.000Z',
      latencyMs: 12,
    });
    expect(envelope.trustTree).toBeUndefined();
  });

  it('composes trust tree, rerank decision, shadow deltas, and degraded readiness', () => {
    const queryPlan = createEmptyQueryPlan({
      complexity: 'complex',
      authorityNeed: 'high',
      selectedChannels: ['vector', 'fts', 'graph'],
    });

    const envelope = buildSearchDecisionEnvelope({
      requestId: 'req-full',
      tenantId: 'tenant-a',
      userId: 'user-a',
      agentId: 'agent-a',
      queryPlan,
      trustTreeInput: {
        responsePolicy: { state: 'live', decision: 'cite_results' },
        codeGraph: { trustState: 'stale', canonicalReadiness: 'stale' },
      },
      shadowDeltas: [{
        recommendation: 'sk-code',
        liveScore: 0.7,
        shadowScore: 0.9,
        delta: 0.2,
        dominantLane: 'semantic_shadow',
        timestamp: '2026-04-29T00:00:00.000Z',
      }],
      degradedReadiness: {
        freshness: 'stale',
        canonicalReadiness: 'stale',
        trustState: 'stale',
      },
      timestamp: '2026-04-29T00:00:00.000Z',
      latencyMs: 5,
    });

    expect(envelope.trustTree?.decision).toBe('degraded');
    expect(envelope.shadowDeltas?.[0]?.dominantLane).toBe('semantic_shadow');
    expect(envelope.degradedReadiness?.trustState).toBe('stale');
    expect(envelope.tenantId).toBe('tenant-a');
  });

  it('supports partial attach composition without mutating the original envelope', () => {
    const base = buildSearchDecisionEnvelope({
      requestId: 'req-partial',
      queryPlan: createEmptyQueryPlan(),
      timestamp: '2026-04-29T00:00:00.000Z',
    });

    const withShadow = attachShadowDeltas(base, [{
      liveScore: 0.3,
      shadowScore: 0.4,
      delta: 0.1,
      dominantLane: 'semantic_shadow',
      timestamp: '2026-04-29T00:00:00.000Z',
    }]);
    const complete = attachDegradedReadiness(withShadow, { freshness: 'empty', trustState: 'absent' });

    expect(complete.shadowDeltas).toHaveLength(1);
    expect(complete.degradedReadiness?.freshness).toBe('empty');
  });
});

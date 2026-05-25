// ───────────────────────────────────────────────────────────────────
// MODULE: Codex Freshness Hook Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';
import { smokeCheckCodexColdStartContext } from '../hooks/codex/lib/freshness-smoke-check.js';

describe('Codex freshness hardening', () => {
  it('smoke-checks cold-start context freshness with latency and last update', () => {
    let now = 10;
    const result = smokeCheckCodexColdStartContext({
      now: () => {
        now += 5;
        return now;
      },
      buildStartup: () => ({
        graphOutline: null,
        sessionContinuity: null,
        graphSummary: {
          files: 1,
          nodes: 1,
          edges: 0,
          lastScan: '2026-04-29T12:00:00.000Z',
        },
        graphQualitySummary: null,
        graphState: 'ready',
        graphTrustState: 'live',
        startupSurface: 'Session context received.',
        sharedPayload: null,
        sharedPayloadTransport: null,
      }),
    });

    expect(result).toEqual({
      fresh: true,
      lastUpdateAt: '2026-04-29T12:00:00.000Z',
      latencyMs: 5,
    });
  });
});

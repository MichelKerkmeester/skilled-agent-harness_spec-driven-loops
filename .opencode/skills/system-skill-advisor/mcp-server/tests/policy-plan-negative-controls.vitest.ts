// ───────────────────────────────────────────────────────────────────
// MODULE: Shadow Delivery Negative Controls
// ───────────────────────────────────────────────────────────────────

import { afterEach, describe, expect, it } from 'vitest';

import {
  clearShadowRouteOnlyLog,
  getShadowRouteOnlyLog,
  renderAdvisorBrief,
  renderAdvisorFallbackDirective,
} from '../lib/render.js';
import { resetShadowDeliveryState } from '../lib/policy-plan.js';
import type { AdvisorBriefRenderableResult, AdvisorBriefRenderOptions } from '../lib/render.js';

interface NegativeControlCase {
  readonly name: string;
  readonly result: AdvisorBriefRenderableResult;
  readonly lifecycleEvent?: 'resume' | 'compact';
}

function advisorResult(
  overrides: Partial<AdvisorBriefRenderableResult> = {},
): AdvisorBriefRenderableResult {
  return {
    status: 'ok',
    freshness: 'live',
    recommendations: [{
      skill: 'sk-code',
      kind: 'skill',
      confidence: 0.91,
      uncertainty: 0.23,
      passes_threshold: true,
    }],
    sharedPayload: { metadata: { skillLabel: 'sk-code' } },
    ...overrides,
  };
}

const NEGATIVE_CONTROLS: readonly NegativeControlCase[] = [
  {
    name: 'long-context',
    result: advisorResult({
      ambiguous: true,
      metrics: { tokenCap: 120 },
      recommendations: [
        {
          skill: 'sk-code',
          kind: 'skill',
          confidence: 0.91,
          uncertainty: 0.23,
          passes_threshold: true,
        },
        {
          skill: 'system-spec-kit',
          kind: 'skill',
          confidence: 0.89,
          uncertainty: 0.24,
          passes_threshold: true,
        },
      ],
    }),
  },
  {
    name: 'advisor-failure',
    result: advisorResult({
      status: 'fail_open',
      freshness: 'unavailable',
      recommendations: [],
    }),
  },
  {
    name: 'no-match',
    result: advisorResult({ recommendations: [] }),
  },
  {
    name: 'comment-writing',
    result: advisorResult({
      sharedPayload: { metadata: { skillLabel: 'sk-code' } },
    }),
  },
  {
    name: 'completion-proof',
    result: advisorResult({
      sharedPayload: { metadata: { skillLabel: 'sk-code' } },
    }),
  },
  {
    name: 'resume',
    lifecycleEvent: 'resume',
    result: advisorResult(),
  },
  {
    name: 'compaction',
    lifecycleEvent: 'compact',
    result: advisorResult(),
  },
];

function emittedResponse(
  result: AdvisorBriefRenderableResult,
  options: AdvisorBriefRenderOptions = {},
): string {
  return renderAdvisorBrief(result, options) ?? renderAdvisorFallbackDirective();
}

afterEach(() => {
  resetShadowDeliveryState();
  clearShadowRouteOnlyLog();
});

describe('shadow delivery behavioral negative controls', () => {
  it.each(NEGATIVE_CONTROLS)(
    'keeps emitted bytes unchanged for the $name case',
    ({ name, result, lifecycleEvent }) => {
      resetShadowDeliveryState();
      clearShadowRouteOnlyLog();
      const baseline = emittedResponse(result);
      const deliveryState = {
        sessionId: `negative-control-${name}`,
        sessionIdentityConfirmed: true,
        deliveryConfirmed: true,
      } as const;
      const shadowOptions: AdvisorBriefRenderOptions = { deliveryState };

      const first = emittedResponse(result, shadowOptions);
      const repeated = emittedResponse(result, shadowOptions);
      const lifecycleReplay = lifecycleEvent
        ? emittedResponse(result, {
          deliveryState: { ...deliveryState, lifecycleEvent },
        })
        : repeated;

      expect(Buffer.from(first, 'utf8').equals(Buffer.from(baseline, 'utf8'))).toBe(true);
      expect(Buffer.from(repeated, 'utf8').equals(Buffer.from(baseline, 'utf8'))).toBe(true);
      expect(Buffer.from(lifecycleReplay, 'utf8').equals(Buffer.from(baseline, 'utf8'))).toBe(true);

      const logs = getShadowRouteOnlyLog();
      expect(logs.length).toBeGreaterThan(0);
      expect(logs.every((entry) => entry.shadowId === 'shadow.route-only.advisor.v1')).toBe(true);
      expect(logs.every((entry) => entry.emittedByteCount >= entry.routeOnlyByteCount)).toBe(true);

      if (!lifecycleEvent && result.status === 'ok' && result.recommendations.length > 0) {
        expect(logs.some((entry) => (
          entry.routeState === 'SUPPRESSED_SAME' && entry.routeOnlyByteCount > 0
        ))).toBe(true);
      }
      if (lifecycleEvent) {
        expect(logs.at(-1)?.routeState).toBe('UNSEEN');
      }
    },
  );

  it('keeps the shadow route-only result out of the returned response', () => {
    const result = advisorResult();
    const options: AdvisorBriefRenderOptions = {
      deliveryState: {
        sessionId: 'returned-response-control',
        sessionIdentityConfirmed: true,
        deliveryConfirmed: true,
      },
    };
    const baseline = emittedResponse(result);
    emittedResponse(result, options);
    const repeated = emittedResponse(result, options);
    const log = getShadowRouteOnlyLog().at(-1);

    expect(repeated).toBe(baseline);
    expect(log?.routeState).toBe('SUPPRESSED_SAME');
    expect(log?.routeOnlyByteCount).toBeGreaterThan(0);
    expect(repeated).not.toBe(renderAdvisorFallbackDirective());
  });
});

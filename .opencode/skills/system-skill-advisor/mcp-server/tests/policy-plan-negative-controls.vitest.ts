// ───────────────────────────────────────────────────────────────────
// MODULE: Shadow Delivery Negative Controls
// ───────────────────────────────────────────────────────────────────

import { afterEach, describe, expect, it } from 'vitest';

import {
  clearShadowRouteOnlyLog,
  getShadowRouteOnlyLog,
  GOVERNOR_DIRECTIVE,
  observeEmittedAdvisorPolicy,
  observeShadowDelivery,
  renderAdvisorBrief,
  renderAdvisorFallbackDirective,
} from '../lib/render.js';
import {
  buildAdvisorRenderPlan,
  buildObservedReceiptMatch,
  clearPolicyObservationSink,
  DeliveryStateMachine,
  isObservedDeliveryReceipt,
  resetShadowDeliveryState,
  ROUTE_ADVISOR_ID,
} from '../lib/policy-plan.js';
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

function seedObservedPolicyDeliveries(
  rendered: string,
  sessionId: string,
  machine: DeliveryStateMachine,
  lifecycleEpoch = 1,
): void {
  machine.advanceEpoch({ sessionId, sessionIdentityConfirmed: true });
  const plan = buildAdvisorRenderPlan(rendered);
  for (const block of plan.blocks) {
    machine.confirmDelivery({
      sessionId,
      sessionIdentityConfirmed: true,
      blockId: block.id,
      contentHash: block.contentHash,
      receipt: buildObservedReceiptMatch(block.contentHash, lifecycleEpoch),
    });
  }
}

function shadowOptionsForRendered(
  rendered: string,
  name: string,
  machine: DeliveryStateMachine,
): AdvisorBriefRenderOptions['deliveryState'] {
  const sessionId = `negative-control-${name}`;
  seedObservedPolicyDeliveries(rendered, sessionId, machine);
  return {
    sessionId,
    sessionIdentityConfirmed: true,
    stateMachine: machine,
  };
}

function emittedResponse(
  result: AdvisorBriefRenderableResult,
  options: AdvisorBriefRenderOptions = {},
): string {
  return renderAdvisorBrief(result, options) ?? renderAdvisorFallbackDirective();
}

afterEach(() => {
  resetShadowDeliveryState();
  clearShadowRouteOnlyLog();
  clearPolicyObservationSink();
});

describe('shadow delivery behavioral negative controls', () => {
  it.each(NEGATIVE_CONTROLS)(
    'keeps emitted bytes unchanged for the $name case',
    ({ name, result, lifecycleEvent }) => {
      resetShadowDeliveryState();
      clearShadowRouteOnlyLog();
      const baseline = emittedResponse(result);
      const machine = new DeliveryStateMachine();
      const deliveryState = shadowOptionsForRendered(baseline, name, machine);
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
      console.log(
        `BYTE_PARITY name=${name} baselineBytes=${Buffer.byteLength(baseline, 'utf8')} `
        + `firstEqual=true repeatedEqual=true lifecycleEqual=true`,
      );

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
    const baseline = emittedResponse(result);
    const machine = new DeliveryStateMachine();
    const options: AdvisorBriefRenderOptions = {
      deliveryState: shadowOptionsForRendered(baseline, 'returned-response-control', machine),
    };
    emittedResponse(result, options);
    const repeated = emittedResponse(result, options);
    const log = getShadowRouteOnlyLog().at(-1);

    expect(repeated).toBe(baseline);
    expect(log?.routeState).toBe('SUPPRESSED_SAME');
    expect(log?.routeOnlyByteCount).toBeGreaterThan(0);
    expect(log?.savedBytes).toBeGreaterThan(0);
    expect(repeated).not.toBe(renderAdvisorFallbackDirective());
  });

  it('keeps emitted bytes unchanged when host observation runs after render', () => {
    const result = advisorResult();
    const baseline = emittedResponse(result);
    observeEmittedAdvisorPolicy(baseline, {
      runtime: 'Claude Code',
      candidate: '004',
      sessionId: 'host-observation',
      sessionIdentityConfirmed: true,
    });
    expect(emittedResponse(result)).toBe(baseline);
    console.log(
      `HOST_OBSERVATION baselineBytes=${Buffer.byteLength(baseline, 'utf8')} equal=true`,
    );
  });

  it('returns identical bytes when a throwing shadow observer runs', () => {
    const result = advisorResult();
    const baseline = emittedResponse(result);
    const throwing = emittedResponse(result, {
      deliveryState: {
        onShadowLog: () => {
          throw new Error('shadow observer failure');
        },
      },
    });
    expect(Buffer.from(throwing, 'utf8').equals(Buffer.from(baseline, 'utf8'))).toBe(true);
    console.log(
      `THROWING_OBSERVER baselineBytes=${Buffer.byteLength(baseline, 'utf8')} equal=true`,
    );
  });

  it('reports zero saved bytes when route-only is ineligible', () => {
    const result = advisorResult();
    emittedResponse(result, {
      deliveryState: {
        sessionId: 'ineligible-savings',
        sessionIdentityConfirmed: true,
      },
    });
    const log = getShadowRouteOnlyLog().at(-1);
    expect(log?.routeOnlyByteCount).toBe(0);
    expect(log?.savedBytes).toBe(0);
    expect(log?.routeState).toBe('UNSEEN');
  });

  it('rejects epoch-zero observed receipts for delivery confirmation', () => {
    const contentHash = 'epoch-floor-hash';
    const epochZeroReceipt = buildObservedReceiptMatch(contentHash, 0);
    const epochOneReceipt = buildObservedReceiptMatch(contentHash, 1);

    expect(isObservedDeliveryReceipt(epochZeroReceipt, contentHash, 0)).toBe(false);
    expect(isObservedDeliveryReceipt(epochOneReceipt, contentHash, 1)).toBe(true);
    console.log('EPOCH_FLOOR epoch0=REJECT epoch1=ACCEPT');
  });

  it('reports zero saved bytes when an expected directive block is missing', () => {
    const result = advisorResult();
    const baseline = emittedResponse(result);
    const machine = new DeliveryStateMachine();
    const missingGovernor = baseline.replace(GOVERNOR_DIRECTIVE, '');
    seedObservedPolicyDeliveries(missingGovernor, 'missing-directive', machine);
    observeShadowDelivery(missingGovernor, {
      sessionId: 'missing-directive',
      sessionIdentityConfirmed: true,
      stateMachine: machine,
    });
    const log = getShadowRouteOnlyLog().at(-1);
    expect(log?.savedBytes).toBe(0);
    expect(log?.routeOnlyByteCount).toBe(0);
  });
});

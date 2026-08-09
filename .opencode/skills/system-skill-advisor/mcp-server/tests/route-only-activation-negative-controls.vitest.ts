// ───────────────────────────────────────────────────────────────────
// MODULE: Activated Route-Only Behavioral Negative Controls
// ───────────────────────────────────────────────────────────────────

import { afterEach, describe, expect, it } from 'vitest';

import {
  observeEmittedAdvisorPolicy,
  renderAdvisorBrief,
  selectAdvisorDelivery,
  shouldForceFullAdvisorPolicy,
} from '../lib/render.js';
import { DeliveryStateMachine } from '../lib/policy-plan.js';

const RUNTIMES = ['Claude Code', 'Codex', 'Devin', 'OpenCode'] as const;
const FULL_POLICY = renderAdvisorBrief({
  status: 'ok',
  freshness: 'live',
  recommendations: [{
    skill: 'sk-code',
    kind: 'skill',
    confidence: 0.91,
    uncertainty: 0.23,
    passes_threshold: true,
  }],
});

if (FULL_POLICY === null) {
  throw new Error('The negative-control baseline must contain the full policy');
}

interface NegativeControl {
  readonly name: string;
  readonly safety?: Parameters<typeof shouldForceFullAdvisorPolicy>[0];
  readonly lifecycleEvent?: 'resume' | 'compact';
}

const CONTROLS: readonly NegativeControl[] = [
  { name: 'long-context', safety: { longContext: true } },
  { name: 'advisor-failure', safety: { advisorStatus: 'fail_open' } },
  { name: 'no-match', safety: { recommendationCount: 0 } },
  { name: 'comment-writing', safety: { prompt: 'Add a durable code comment to this function' } },
  { name: 'completion-proof', safety: { prompt: 'Claim complete only after completion proof' } },
  { name: 'advisory-Gate', safety: { advisoryGate: true } },
  { name: 'invalid-answer', safety: { gateAnswerValid: false } },
  { name: 'child-session', safety: { childSession: true } },
  { name: 'resume', lifecycleEvent: 'resume' },
  { name: 'compaction', lifecycleEvent: 'compact' },
];

afterEach(() => {
  delete process.env.SPECKIT_ROUTE_ONLY_ADVISOR_DISABLED;
});

describe.each(RUNTIMES)('%s activated route-only safety gate', (runtime) => {
  it.each(CONTROLS)('emits the full policy for $name', ({ name, safety, lifecycleEvent }) => {
    const machine = new DeliveryStateMachine();
    const baseState = {
      runtime,
      sessionId: `${runtime}-${name}`,
      sessionIdentityConfirmed: true,
      stateMachine: machine,
    } as const;

    const first = selectAdvisorDelivery(FULL_POLICY, baseState);
    expect(first).toBe(FULL_POLICY);
    observeEmittedAdvisorPolicy(first, baseState);

    const eligibleRepeat = selectAdvisorDelivery(FULL_POLICY, baseState);
    expect(eligibleRepeat).not.toBe(FULL_POLICY);

    const forceFull = safety === undefined
      ? false
      : shouldForceFullAdvisorPolicy(safety);
    if (safety !== undefined) {
      expect(forceFull).toBe(true);
    }
    const controlled = selectAdvisorDelivery(FULL_POLICY, {
      ...baseState,
      lifecycleEvent,
      forceFull,
    });

    expect(controlled).toBe(FULL_POLICY);
    expect(controlled).toContain('Comment hygiene [HARD BLOCK]');
    expect(controlled).toContain('Proof over appearance');
  });
});

it('the kill switch and unknown identity fail open to the full policy', () => {
  const machine = new DeliveryStateMachine();
  const confirmed = {
    runtime: 'Claude Code',
    sessionId: 'kill-switch-control',
    sessionIdentityConfirmed: true,
    stateMachine: machine,
  } as const;
  observeEmittedAdvisorPolicy(selectAdvisorDelivery(FULL_POLICY, confirmed), confirmed);

  process.env.SPECKIT_ROUTE_ONLY_ADVISOR_DISABLED = '1';
  expect(selectAdvisorDelivery(FULL_POLICY, confirmed)).toBe(FULL_POLICY);
  expect(selectAdvisorDelivery(FULL_POLICY, {
    runtime: 'Claude Code',
    sessionIdentityConfirmed: false,
    stateMachine: new DeliveryStateMachine(),
  })).toBe(FULL_POLICY);
});

it('content changes require a new full delivery before suppression can resume', () => {
  const machine = new DeliveryStateMachine();
  const state = {
    runtime: 'Claude Code',
    sessionId: 'content-change-control',
    sessionIdentityConfirmed: true,
    stateMachine: machine,
  } as const;
  observeEmittedAdvisorPolicy(selectAdvisorDelivery(FULL_POLICY, state), state);
  expect(selectAdvisorDelivery(FULL_POLICY, state)).not.toBe(FULL_POLICY);

  const changedPolicy = renderAdvisorBrief({
    status: 'ok',
    freshness: 'live',
    recommendations: [{
      skill: 'system-spec-kit',
      kind: 'skill',
      confidence: 0.93,
      uncertainty: 0.12,
      passes_threshold: true,
    }],
  });
  expect(changedPolicy).not.toBeNull();
  expect(selectAdvisorDelivery(changedPolicy, state)).toBe(changedPolicy);
});

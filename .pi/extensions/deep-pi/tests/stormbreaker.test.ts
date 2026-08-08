// ───────────────────────────────────────────────────────────────────
// MODULE: DeepPi Stormbreaker Tests
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import {
  createStormBreakerState,
  recordToolOutcome,
  registerStormBreaker,
  startToolBatch,
  toolCallsFromMessage,
} from '../extensions/deeppi/stormbreaker.js';

import type { ExtensionAPI } from '@earendil-works/pi-coding-agent';

// ───────────────────────────────────────────────────────────────────
// 2. TEST FIXTURES
// ───────────────────────────────────────────────────────────────────

const calls = [
  { id: 'a', name: 'read' },
  { id: 'b', name: 'grep' },
];

const assistant = {
  role: 'assistant',
  content: [
    { type: 'toolCall', id: 'a', name: 'read', arguments: {} },
    { type: 'toolCall', id: 'b', name: 'grep', arguments: {} },
  ],
};

// ───────────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────────

function failBatch(state: ReturnType<typeof createStormBreakerState>, suffix = '') {
  startToolBatch(state, calls);
  expect(
    recordToolOutcome(state, { id: 'b', name: 'grep', isError: true, text: `denied ${suffix}` })
      .kind,
  )
    .toBe('pending');
  return recordToolOutcome(state, {
    id: 'a',
    name: 'read',
    isError: true,
    text: `missing ${suffix}`,
  });
}

// ───────────────────────────────────────────────────────────────────
// 4. TESTS
// ───────────────────────────────────────────────────────────────────

it('injects a guard on the third equivalent all-failed batch and aborts the fourth', () => {
  const state = createStormBreakerState();
  expect(failBatch(state).kind).toBe('none');
  expect(failBatch(state).kind).toBe('none');
  expect(failBatch(state).kind).toBe('guard');
  expect(failBatch(state).kind).toBe('abort');
});

it('resets both streaks when any tool succeeds', () => {
  const state = createStormBreakerState();
  failBatch(state);
  failBatch(state);
  startToolBatch(state, calls);
  recordToolOutcome(state, { id: 'a', name: 'read', isError: false, text: 'ok' });
  expect(recordToolOutcome(state, { id: 'b', name: 'grep', isError: true, text: 'denied' }).kind)
    .toBe('none');
  expect(state.repeatCount).toBe(0);
  expect(state.blockedTurnStreak).toBe(0);
});

it('guards alternating all-failed batches through the blocked-turn streak', () => {
  const state = createStormBreakerState();
  expect(failBatch(state, 'one').kind).toBe('none');
  expect(failBatch(state, 'two').kind).toBe('none');
  expect(failBatch(state, 'three').kind).toBe('guard');
});

it('discovers Pi toolCall blocks in message order', () => {
  expect(toolCallsFromMessage(assistant)).toEqual(calls);
});

it('adds the batch guard only to the result that completes the third batch', async () => {
  type Hook = (event: any, ctx: any) => Promise<any> | any;
  const hooks = new Map<string, Hook>();
  const pi = {
    on(type: string, hook: Hook) {
      hooks.set(type, hook);
    },
  } as unknown as ExtensionAPI;
  const state = createStormBreakerState();
  registerStormBreaker(pi, state, () => true);
  const ctx = {
    model: { provider: 'deepseek', id: 'deepseek-v4-pro' },
    abort() {},
    ui: { notify() {} },
  };
  let earlyResult: unknown;
  let finalResult: unknown;
  // The registerStormBreaker call installs the handlers synchronously before this sequence.
  for (let attempt = 0; attempt < 3; attempt++) {
    await hooks.get('message_end')!({ message: assistant }, ctx);
    earlyResult = await hooks.get('tool_result')!({
      toolCallId: 'b',
      toolName: 'grep',
      isError: true,
      content: [{ type: 'text', text: 'denied' }],
    }, ctx);
    finalResult = await hooks.get('tool_result')!({
      toolCallId: 'a',
      toolName: 'read',
      isError: true,
      content: [{ type: 'text', text: 'missing' }],
    }, ctx);
  }
  expect(JSON.stringify(earlyResult)).not.toContain('[loop guard]');
  expect(JSON.stringify(finalResult)).toContain('[loop guard]');
});

function captureStormBreakerHooks() {
  type Hook = (event: any, ctx: any) => Promise<any> | any;
  const hooks = new Map<string, Hook>();
  const pi = {
    on(type: string, hook: Hook) {
      hooks.set(type, hook);
    },
  } as unknown as ExtensionAPI;
  registerStormBreaker(pi, createStormBreakerState(), () => true);
  return hooks;
}

it('ends a blocked streak when an assistant turn makes no tool calls', async () => {
  const hooks = captureStormBreakerHooks();
  let aborted = false;
  const ctx = {
    model: { provider: 'deepseek', id: 'deepseek-v4-pro' },
    abort() {
      aborted = true;
    },
    ui: { notify() {} },
  };
  // The helper above registers both handlers before the failed-tool sequence begins.
  const failedTool = async () => {
    await hooks.get('message_end')!({
      message: {
        role: 'assistant',
        content: [{ type: 'toolCall', id: 'a', name: 'read', arguments: {} }],
      },
    }, ctx);
    return hooks.get('tool_result')!({
      toolCallId: 'a',
      toolName: 'read',
      isError: true,
      content: [{ type: 'text', text: 'missing' }],
    }, ctx);
  };
  await failedTool();
  await failedTool();
  await hooks.get('message_end')!({
    message: { role: 'assistant', content: [{ type: 'text', text: 'new task' }] },
  }, ctx);
  const unrelatedResult = await failedTool();
  expect(JSON.stringify(unrelatedResult)).not.toContain('[loop guard]');
  expect(aborted).toBe(false);
});

it('preserves actionable error text beyond 500 characters', async () => {
  const hooks = captureStormBreakerHooks();
  const ctx = {
    model: { provider: 'deepseek', id: 'deepseek-v4-pro' },
    abort() {},
    ui: { notify() {} },
  };
  // The registerStormBreaker call installs the handler synchronously before this lookup.
  await hooks.get('message_end')!({
    message: {
      role: 'assistant',
      content: [{ type: 'toolCall', id: 'a', name: 'read', arguments: {} }],
    },
  }, ctx);
  const originalContent = [{
    type: 'text',
    text: `${'x'.repeat(600)}ACTIONABLE_TAIL`,
  }];
  const result = await hooks.get('tool_result')!({
    toolCallId: 'a',
    toolName: 'read',
    isError: true,
    content: originalContent,
  }, ctx);
  const visibleContent = result?.content ?? originalContent;
  expect(JSON.stringify(visibleContent)).toContain('ACTIONABLE_TAIL');
});

// ───────────────────────────────────────────────────────────────────
// MODULE: Pi Cache Optimizer Retry Loop Guard Tests
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { join } from 'node:path';
import { createJiti } from 'jiti';

import {
  createRetryLoopGuardState,
  recordToolOutcome,
  resetRetryLoopGuard,
  startToolBatch,
  toolCallsFromMessage,
} from '#extension';

import type {
  RetryGuardDecision,
  RetryLoopGuardState,
} from '#extension';

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

/** Drive one all-failed batch to completion and return the decision it produced. */
function failBatch(state: RetryLoopGuardState, suffix = ''): RetryGuardDecision {
  startToolBatch(state, calls);
  assert.equal(
    recordToolOutcome(state, { id: 'b', name: 'grep', isError: true, text: `denied ${suffix}` }).kind,
    'pending',
  );
  return recordToolOutcome(state, {
    id: 'a',
    name: 'read',
    isError: true,
    text: `missing ${suffix}`,
  });
}

/**
 * Register the real extension against a fake host and capture the guard hooks.
 *
 * A fresh module instance per capture keeps the extension's guard state
 * isolated between tests; interopDefault: false exposes the raw default
 * export instead of jiti's interop wrapper.
 */
async function captureGuardHooks() {
  type Hook = (event: any, ctx: any) => Promise<unknown> | unknown;
  const hooksByName = new Map<string, Hook[]>();
  const jiti = createJiti(join(process.cwd(), 'tests', 'retry-loop-guard.test.ts'), {
    interopDefault: false,
    moduleCache: false,
  });
  const freshModule = await jiti.import<typeof import('../index.ts')>(
    join(process.cwd(), 'index.ts'),
  );
  const pi = {
    on(type: string, hook: Hook) {
      const list = hooksByName.get(type) ?? [];
      list.push(hook);
      hooksByName.set(type, list);
    },
    registerCommand() {},
  } as unknown as ExtensionAPI;
  freshModule.default(pi);
  // The registration call installs every handler synchronously. The guard's
  // message_end handler is registered before the stats handler (which other
  // suites capture as the last message_end registration), so it is the
  // first message_end handler in registration order.
  const messageEndHandlers = hooksByName.get('message_end') ?? [];
  const toolResultHandlers = hooksByName.get('tool_result') ?? [];
  assert.ok(messageEndHandlers.length >= 1, 'message_end handler registered');
  assert.ok(toolResultHandlers.length >= 1, 'tool_result handler registered');
  return {
    messageEnd: messageEndHandlers[0],
    toolResult: toolResultHandlers[0],
  };
}

// ───────────────────────────────────────────────────────────────────
// 3. MESSAGE → BATCH ASSEMBLY
// ───────────────────────────────────────────────────────────────────

describe('retry loop guard batch assembly', () => {
  test('discovers Pi toolCall blocks in message order', () => {
    assert.deepEqual(toolCallsFromMessage(assistant), calls);
  });

  test('ignores messages that are not assistant tool-call turns', () => {
    assert.deepEqual(toolCallsFromMessage({ role: 'toolResult', content: [] }), []);
    assert.deepEqual(toolCallsFromMessage({ role: 'user', content: [{ type: 'text', text: 'hi' }] }), []);
    assert.deepEqual(
      toolCallsFromMessage({ role: 'assistant', content: [{ type: 'text', text: 'no tools' }] }),
      [],
    );
    assert.deepEqual(toolCallsFromMessage(undefined), []);
  });
});

// ───────────────────────────────────────────────────────────────────
// 4. ESCALATION SEMANTICS
// ───────────────────────────────────────────────────────────────────

describe('retry loop guard escalation', () => {
  test('a driven retry storm escalates to a guard and then stops the turn', () => {
    const state = createRetryLoopGuardState();
    assert.equal(failBatch(state).kind, 'none');
    assert.equal(failBatch(state).kind, 'none');
    const guard = failBatch(state);
    assert.equal(guard.kind, 'guard');
    assert.ok(guard.kind === 'guard' && guard.message.includes('[loop guard]'));
    const abort = failBatch(state);
    assert.equal(abort.kind, 'abort');
    assert.ok(abort.kind === 'abort' && abort.message.includes('[loop guard]'));
  });

  test('one legitimate retry does not trigger the guard', () => {
    const state = createRetryLoopGuardState();
    assert.equal(failBatch(state).kind, 'none');
    // A single-call batch is a batch too: one more failed attempt still
    // stays silent (the second consecutive all-failed batch is not an
    // escalation, let alone the third).
    startToolBatch(state, [{ id: 'c', name: 'bash' }]);
    assert.equal(
      recordToolOutcome(state, { id: 'c', name: 'bash', isError: true, text: 'boom' }).kind,
      'none',
    );
    assert.equal(state.repeatCount, 1);
    assert.equal(state.blockedTurnStreak, 2);
  });

  test('the guard cannot fire on a first attempt', () => {
    const state = createRetryLoopGuardState();
    assert.equal(failBatch(state).kind, 'none');
    assert.equal(failBatch(state).kind, 'none');
  });

  test('a success mid-streak resets both streaks', () => {
    const state = createRetryLoopGuardState();
    failBatch(state);
    failBatch(state);
    // Third batch: one call succeeds, one fails — a partial success is
    // convergence, not a loop, and must reset the streak completely.
    startToolBatch(state, calls);
    assert.equal(
      recordToolOutcome(state, { id: 'a', name: 'read', isError: false, text: 'ok' }).kind,
      'pending',
    );
    assert.equal(
      recordToolOutcome(state, { id: 'b', name: 'grep', isError: true, text: 'denied' }).kind,
      'none',
    );
    assert.equal(state.repeatCount, 0);
    assert.equal(state.blockedTurnStreak, 0);
    // The storm has to build up from zero again: two failures stay silent.
    assert.equal(failBatch(state).kind, 'none');
    assert.equal(failBatch(state).kind, 'none');
    assert.equal(failBatch(state).kind, 'guard');
  });

  test('two independent batches do not share a streak', () => {
    const state = createRetryLoopGuardState();
    // A stale outcome from an earlier batch must not count toward the new one.
    startToolBatch(state, [{ id: 'c', name: 'bash' }]);
    assert.equal(
      recordToolOutcome(state, { id: 'a', name: 'read', isError: true, text: 'stale' }).kind,
      'none',
    );
    assert.equal(state.outcomes.size, 0);
    // A reset (new session, or the assistant moving on without tool calls)
    // starts a fresh streak: two all-failed batches before it, two after,
    // and neither pair escalates.
    failBatch(state);
    failBatch(state);
    resetRetryLoopGuard(state);
    assert.equal(failBatch(state).kind, 'none');
    assert.equal(failBatch(state).kind, 'none');
    assert.equal(state.blockedTurnStreak, 2);
  });
});

// ───────────────────────────────────────────────────────────────────
// 5. HOOK WIRING
// ───────────────────────────────────────────────────────────────────

describe('retry loop guard hook wiring', () => {
  test('a driven retry storm escalates through the hooks and aborts the turn', async () => {
    const hooks = await captureGuardHooks();
    let aborted = false;
    const notified: string[] = [];
    const ctx = {
      abort() {
        aborted = true;
      },
      ui: {
        notify(message: string) {
          notified.push(message);
        },
      },
    };
    const attempt = async () => {
      await hooks.messageEnd({ message: assistant }, ctx);
      await hooks.toolResult({
        toolCallId: 'b',
        toolName: 'grep',
        isError: true,
        content: [{ type: 'text', text: 'denied' }],
      }, ctx);
      return hooks.toolResult({
        toolCallId: 'a',
        toolName: 'read',
        isError: true,
        content: [{ type: 'text', text: 'missing' }],
      }, ctx);
    };
    assert.equal(await attempt(), undefined);
    assert.equal(await attempt(), undefined);
    const guardResult = await attempt();
    assert.ok(JSON.stringify(guardResult).includes('[loop guard]'));
    assert.equal(aborted, false);
    await attempt();
    assert.equal(aborted, true);
    assert.equal(notified.length, 1);
    assert.ok(notified[0].includes('[loop guard]'));
  });

  test('a single failed attempt through the hooks stays silent', async () => {
    const hooks = await captureGuardHooks();
    const ctx = {
      abort() {},
      ui: { notify() {} },
    };
    await hooks.messageEnd({ message: assistant }, ctx);
    const result = await hooks.toolResult({
      toolCallId: 'b',
      toolName: 'grep',
      isError: true,
      content: [{ type: 'text', text: 'denied' }],
    }, ctx);
    const finalResult = await hooks.toolResult({
      toolCallId: 'a',
      toolName: 'read',
      isError: true,
      content: [{ type: 'text', text: 'missing' }],
    }, ctx);
    assert.equal(result, undefined);
    assert.equal(finalResult, undefined);
  });

  test('a success mid-streak through the hooks resets the escalation', async () => {
    const hooks = await captureGuardHooks();
    const ctx = {
      abort() {},
      ui: { notify() {} },
    };
    const failedAttempt = async () => {
      await hooks.messageEnd({ message: assistant }, ctx);
      await hooks.toolResult({
        toolCallId: 'b',
        toolName: 'grep',
        isError: true,
        content: [{ type: 'text', text: 'denied' }],
      }, ctx);
      return hooks.toolResult({
        toolCallId: 'a',
        toolName: 'read',
        isError: true,
        content: [{ type: 'text', text: 'missing' }],
      }, ctx);
    };
    await failedAttempt();
    await failedAttempt();
    // Third attempt: one success — no guard may appear on this or the next
    // two all-failed attempts, because the streak restarted from zero.
    await hooks.messageEnd({ message: assistant }, ctx);
    await hooks.toolResult({
      toolCallId: 'a',
      toolName: 'read',
      isError: false,
      content: [{ type: 'text', text: 'ok' }],
    }, ctx);
    const mixedResult = await hooks.toolResult({
      toolCallId: 'b',
      toolName: 'grep',
      isError: true,
      content: [{ type: 'text', text: 'denied' }],
    }, ctx);
    assert.equal(mixedResult, undefined);
    assert.equal(await failedAttempt(), undefined);
    assert.equal(await failedAttempt(), undefined);
    const guardResult = await failedAttempt();
    assert.ok(JSON.stringify(guardResult).includes('[loop guard]'));
  });

  test('a tool-result message_end does not reset the streak mid-batch', async () => {
    const hooks = await captureGuardHooks();
    const ctx = {
      abort() {},
      ui: { notify() {} },
    };
    const attempt = async () => {
      await hooks.messageEnd({ message: assistant }, ctx);
      await hooks.toolResult({
        toolCallId: 'b',
        toolName: 'grep',
        isError: true,
        content: [{ type: 'text', text: 'denied' }],
      }, ctx);
      // Pi emits message_end for tool-result messages between outcomes.
      await hooks.messageEnd({ message: { role: 'toolResult', content: [] } }, ctx);
      return hooks.toolResult({
        toolCallId: 'a',
        toolName: 'read',
        isError: true,
        content: [{ type: 'text', text: 'missing' }],
      }, ctx);
    };
    assert.equal(await attempt(), undefined);
    assert.equal(await attempt(), undefined);
    const guardResult = await attempt();
    assert.ok(JSON.stringify(guardResult).includes('[loop guard]'));
  });

  test('an assistant turn without tool calls ends a blocked streak', async () => {
    const hooks = await captureGuardHooks();
    const ctx = {
      abort() {},
      ui: { notify() {} },
    };
    const failedAttempt = async () => {
      await hooks.messageEnd({ message: assistant }, ctx);
      await hooks.toolResult({
        toolCallId: 'b',
        toolName: 'grep',
        isError: true,
        content: [{ type: 'text', text: 'denied' }],
      }, ctx);
      return hooks.toolResult({
        toolCallId: 'a',
        toolName: 'read',
        isError: true,
        content: [{ type: 'text', text: 'missing' }],
      }, ctx);
    };
    await failedAttempt();
    await failedAttempt();
    // The assistant moved on without calling any tools — the streak is over.
    await hooks.messageEnd({
      message: { role: 'assistant', content: [{ type: 'text', text: 'new task' }] },
    }, ctx);
    assert.equal(await failedAttempt(), undefined);
    assert.equal(await failedAttempt(), undefined);
    const guardResult = await failedAttempt();
    assert.ok(JSON.stringify(guardResult).includes('[loop guard]'));
  });
});

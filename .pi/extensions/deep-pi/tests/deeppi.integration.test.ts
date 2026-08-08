// ───────────────────────────────────────────────────────────────────
// MODULE: DeepPi Integration Tests
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it, vi } from 'vitest';

import deepPi from '../extensions/deeppi.js';
import { fakeContext, FakePi } from './fake-pi.js';

// ───────────────────────────────────────────────────────────────────
// 2. TEST FIXTURES
// ───────────────────────────────────────────────────────────────────

// A prior regression assigned stability's churn list onto telemetry state.
// That side effect changed telemetry shape on every /deeppi invocation.
// The visible report text did not depend on that field.
// Wrapping createTelemetryState captures each extension instance's live state.
// The test can therefore assert byte-for-byte immutability against production state.
const telemetryCapture = vi.hoisted(() => ({ state: undefined as unknown }));
vi.mock('../extensions/deeppi/telemetry.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../extensions/deeppi/telemetry.js')>();
  return {
    ...actual,
    createTelemetryState: () => {
      telemetryCapture.state = actual.createTelemetryState();
      return telemetryCapture.state;
    },
  };
});

// ───────────────────────────────────────────────────────────────────
// 3. TESTS
// ───────────────────────────────────────────────────────────────────

// DeepPi registration synchronously installs `/deeppi`.
// Command lookups below are therefore guaranteed by the fake host.
it('is dormant and removes only edit_lines for unsupported models', async () => {
  const fake = new FakePi();
  fake.activeTools.push('edit_lines');
  deepPi(fake.asExtensionAPI());
  const ctx = fakeContext({ provider: 'openrouter', id: 'deepseek/deepseek-v4-pro' });
  await fake.emit('session_start', {}, ctx);
  expect(fake.activeTools).toEqual(['read', 'edit', 'bash']);
  expect(ctx.statuses.get('deeppi')).toBeUndefined();
});

it('activates edit_lines and reports measured cache usage for Pro', async () => {
  const fake = new FakePi();
  deepPi(fake.asExtensionAPI());
  const ctx = fakeContext({
    provider: 'deepseek',
    id: 'deepseek-v4-pro',
    cost: { input: 1.74, output: 3.48, cacheRead: 0.145, cacheWrite: 0 },
  });
  await fake.emit('session_start', {}, ctx);
  expect(fake.activeTools).toContain('edit_lines');
  expect(ctx.statuses.get('deeppi')).toBe('DeepPi · warming');
  await fake.emit('message_end', {
    message: {
      role: 'assistant',
      provider: 'deepseek',
      model: 'deepseek-v4-pro',
      content: [{ type: 'text', text: 'done' }],
      usage: {
        input: 20_000,
        output: 100,
        cacheRead: 80_000,
        cacheWrite: 0,
        totalTokens: 100_100,
        cost: {
          input: 0.0348,
          output: 0.000348,
          cacheRead: 0.0116,
          cacheWrite: 0,
          total: 0.046748,
        },
      },
    },
  }, ctx);
  expect(ctx.statuses.get('deeppi')).toBe('DeepPi · 80% cache');
  await fake.commands.get('deeppi')!.handler('', ctx);
  expect(ctx.notifications.at(-1)).toContain('Cache hit rate:     80.0%');
});

it('does not transform request bytes for unsupported models', async () => {
  const fake = new FakePi();
  deepPi(fake.asExtensionAPI());
  const ctx = fakeContext({ provider: 'deepseek', id: 'deepseek-chat' });
  const messages = [{
    role: 'assistant',
    content: [
      { type: 'thinking', thinking: 'must remain' },
      { type: 'text', text: 'answer' },
    ],
  }];
  const payload = {
    model: 'deepseek-chat',
    messages: [{ role: 'user', content: 'hello' }],
    tools: [
      { type: 'function', function: { name: 'write' } },
      { type: 'function', function: { name: 'read' } },
    ],
  };
  const messagesBefore = structuredClone(messages);
  const payloadBefore = structuredClone(payload);
  const contextResults = await fake.emit('context', { messages }, ctx);
  const providerResults = await fake.emit('before_provider_request', { payload }, ctx);
  expect(contextResults.every((value) => value === undefined)).toBe(true);
  expect(providerResults.every((value) => value === undefined)).toBe(true);
  expect(messages).toEqual(messagesBefore);
  expect(payload).toEqual(payloadBefore);
});

it('warns once per unrecognized DeepSeek model id in a session', async () => {
  const fake = new FakePi();
  deepPi(fake.asExtensionAPI());
  const ctx = fakeContext({
    provider: 'deepseek',
    id: 'deepseek-v5-test',
    name: 'DeepSeek V5 Test',
  });
  const warning =
    `deep-pi doesn't recognize model "deepseek-v5-test" - it may need updating for new DeepSeek releases.`;
  await fake.emit('session_start', {}, ctx);
  expect(ctx.notifications).toEqual([warning]);
  expect(ctx.notificationSeverities).toEqual(['warning']);
  expect(fake.activeTools).not.toContain('edit_lines');
  await fake.emit('model_select', {}, ctx);
  expect(ctx.notifications).toHaveLength(1);
  await fake.emit('session_start', {}, ctx);
  expect(ctx.notifications).toEqual([warning, warning]);
});

it('stays silent through the real hook path for DeepSeek-family models on non-deepseek providers', async () => {
  for (
    const model of [
      { provider: 'opencode', id: 'deepseek-v4-flash-free', name: 'DeepSeek V4 Flash Free' },
      { provider: 'opencode-go', id: 'deepseek-v4-flash', name: 'DeepSeek V4 Flash' },
    ]
  ) {
    const fake = new FakePi();
    deepPi(fake.asExtensionAPI());
    const ctx = fakeContext(model);
    await fake.emit('session_start', {}, ctx);
    await fake.emit('model_select', {}, ctx);
    expect(ctx.notifications).toEqual([]);
    expect(fake.activeTools).not.toContain('edit_lines');
    expect(ctx.statuses.get('deeppi')).toBeUndefined();
  }
});

it('renders current prefix churn without copying it into telemetry', async () => {
  const fake = new FakePi();
  deepPi(fake.asExtensionAPI());
  const model = fakeContext({
    provider: 'deepseek',
    id: 'deepseek-v4-pro',
    cost: { input: 1.74, output: 3.48, cacheRead: 0.145, cacheWrite: 0 },
  });
  const stabilityContext = fakeContext(model.model);
  const stabilityHook = fake.handlers.get('before_provider_request')?.[0];
  expect(stabilityHook).toBeDefined();
  const churnPayloads = [
    { messages: [{ role: 'user', content: 'hello' }], tools: [{ name: 'alpha' }] },
    { messages: [{ role: 'user', content: 'hello' }], tools: [{ name: 'beta' }] },
  ];
  let modelReads = 0;
  // Hook registration is synchronous, and the preceding assertion documents this fixture contract.
  Object.defineProperty(model, 'model', {
    configurable: true,
    get() {
      if (modelReads < churnPayloads.length) {
        stabilityHook!({ payload: churnPayloads[modelReads] }, stabilityContext);
      }
      modelReads++;
      return stabilityContext.model;
    },
  });

  await fake.commands.get('deeppi')!.handler('', model);
  expect(model.notifications.at(-1)).toContain('Prefix churn:       tool-schema');
});

it('leaves telemetry state byte-identical after invoking /deeppi', async () => {
  const fake = new FakePi();
  deepPi(fake.asExtensionAPI());
  const ctx = fakeContext({
    provider: 'deepseek',
    id: 'deepseek-v4-pro',
    cost: { input: 1.74, output: 3.48, cacheRead: 0.145, cacheWrite: 0 },
  });
  await fake.emit('session_start', {}, ctx);
  await fake.emit('message_end', {
    message: {
      role: 'assistant',
      provider: 'deepseek',
      model: 'deepseek-v4-pro',
      content: [{ type: 'text', text: 'done' }],
      usage: {
        input: 20_000,
        output: 100,
        cacheRead: 80_000,
        cacheWrite: 0,
        totalTokens: 100_100,
        cost: {
          input: 0.0348,
          output: 0.000348,
          cacheRead: 0.0116,
          cacheWrite: 0,
          total: 0.046748,
        },
      },
    },
  }, ctx);

  expect(telemetryCapture.state).toBeDefined();
  const before = structuredClone(telemetryCapture.state);
  await fake.commands.get('deeppi')!.handler('', ctx);
  expect(telemetryCapture.state).toEqual(before);
});

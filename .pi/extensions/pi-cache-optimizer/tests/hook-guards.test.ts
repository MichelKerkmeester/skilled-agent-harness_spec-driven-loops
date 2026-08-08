// ───────────────────────────────────────────────────────────────────
// MODULE: Pi Cache Optimizer Hook Guard Tests
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, before, test } from 'node:test';
import { createJiti } from 'jiti';

// ───────────────────────────────────────────────────────────────────
// 2. TEST FIXTURES
// ───────────────────────────────────────────────────────────────────

type Hook = (event: any, context: any) => Promise<any> | any;

let previousAgentDir: string | undefined;
let agentDir: string;

// Isolate registration tests from the operator's agent directory and restore it after the suite.
before(async () => {
  previousAgentDir = process.env.PI_CODING_AGENT_DIR;
  agentDir = await mkdtemp(join(tmpdir(), 'pi-hook-guards-'));
  process.env.PI_CODING_AGENT_DIR = agentDir;
});

after(async () => {
  if (previousAgentDir === undefined) delete process.env.PI_CODING_AGENT_DIR;
  else process.env.PI_CODING_AGENT_DIR = previousAgentDir;
  await rm(agentDir, { recursive: true, force: true });
});

function ownedModel(overrides: Record<string, unknown> = {}) {
  return {
    provider: 'deepseek',
    id: 'deepseek-v4-flash',
    name: 'DeepSeek V4 Flash',
    api: 'openai-completions',
    baseUrl: 'https://proxy.example/v1',
    compat: {},
    reasoning: false,
    input: ['text'],
    cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
    contextWindow: 128_000,
    maxTokens: 4096,
    ...overrides,
  };
}

async function freshExtension() {
  // Disable Jiti caching so each test observes a newly registered handler map.
  const jiti = createJiti(join(process.cwd(), 'tests', 'hook-guards.test.ts'), {
    interopDefault: false,
    moduleCache: false,
  });
  const module = await jiti.import(join(process.cwd(), 'index.ts')) as any;
  const handlers = new Map<string, Hook>();
  const activeTools = ['read', 'edit', 'bash'];
  // Supply only the host methods exercised by these guards; the tool list stays observable.
  module.default({
    on(name: string, handler: Hook) {
      handlers.set(name, handler);
    },
    registerCommand() {},
    registerTool() {},
    getActiveTools() {
      return [...activeTools];
    },
    setActiveTools(names: string[]) {
      activeTools.splice(0, activeTools.length, ...names);
    },
  } as any);
  return { handlers, activeTools };
}

function contextFor(
  model: ReturnType<typeof ownedModel>,
  counters: { sessionReads: number; statuses: number; notifications: number },
) {
  // Count side effects because guarded handlers must not read session state or touch the UI.
  return {
    model,
    hasUI: true,
    sessionManager: {
      getSessionId() {
        counters.sessionReads++;
        return 'hook-guard-session';
      },
    },
    modelRegistry: { find: () => undefined, getAvailable: () => [], getAll: () => [] },
    ui: {
      notify() {
        counters.notifications++;
      },
      setStatus() {
        counters.statuses++;
      },
    },
  };
}

// ───────────────────────────────────────────────────────────────────
// 3. TESTS
// ───────────────────────────────────────────────────────────────────

test('session_start guard suppresses restore and status effects', async () => {
  const { handlers } = await freshExtension();
  const counters = { sessionReads: 0, statuses: 0, notifications: 0 };
  await handlers.get('session_start')!({ reason: 'new' }, contextFor(ownedModel(), counters));
  assert.equal(counters.sessionReads, 0);
  assert.equal(counters.statuses, 0);
});

test('model_select guard suppresses compatibility and status effects', async () => {
  const { handlers } = await freshExtension();
  const counters = { sessionReads: 0, statuses: 0, notifications: 0 };
  const model = ownedModel();
  await handlers.get('model_select')!({ model }, contextFor(model, counters));
  assert.equal(counters.notifications, 0);
  assert.equal(counters.statuses, 0);
});

test('before_agent_start guard leaves the cache key global untouched', async () => {
  const { handlers } = await freshExtension();
  const counters = { sessionReads: 0, statuses: 0, notifications: 0 };
  const context = contextFor(ownedModel(), counters);
  const key = 'sentinel-cache-key';
  const globalState = globalThis as typeof globalThis & { __piCacheOptimizerCacheKey__?: unknown };
  const previous = globalState.__piCacheOptimizerCacheKey__;
  globalState.__piCacheOptimizerCacheKey__ = key;
  try {
    await handlers.get('before_agent_start')!({
      systemPrompt: 'stable',
      systemPromptOptions: { skills: [] },
    }, context);
    assert.equal(globalState.__piCacheOptimizerCacheKey__, key);
  } finally {
    if (previous === undefined) delete globalState.__piCacheOptimizerCacheKey__;
    else globalState.__piCacheOptimizerCacheKey__ = previous;
  }
});

test('before_provider_request guard preserves the payload', async () => {
  const { handlers } = await freshExtension();
  const counters = { sessionReads: 0, statuses: 0, notifications: 0 };
  const model = ownedModel();
  const context = contextFor(model, counters);
  const payload = {
    prompt_cache_retention: 'long',
    messages: [{ role: 'user', content: 'hello' }],
  };
  const before = structuredClone(payload);
  const result = await handlers.get('before_provider_request')!({ payload }, context);
  assert.equal(result, undefined);
  assert.deepEqual(payload, before);
});

test('after_provider_response guard suppresses response diagnostics', async () => {
  const { handlers } = await freshExtension();
  const counters = { sessionReads: 0, statuses: 0, notifications: 0 };
  const model = ownedModel({ compat: { supportsLongCacheRetention: true } });
  await handlers.get('after_provider_response')!({
    status: 400,
    headers: { error: 'unsupported parameter: prompt_cache_retention' },
  }, contextFor(model, counters));
  assert.equal(counters.notifications, 0);
});

test('message_end guard suppresses cache-stat recording', async () => {
  const { handlers } = await freshExtension();
  const counters = { sessionReads: 0, statuses: 0, notifications: 0 };
  const model = ownedModel();
  await handlers.get('message_end')!({
    message: {
      role: 'assistant',
      provider: model.provider,
      model: model.id,
      usage: { input: 100, cacheRead: 50, cacheWrite: 0, totalTokens: 150 },
    },
  }, contextFor(model, counters));
  assert.equal(counters.statuses, 0);
});

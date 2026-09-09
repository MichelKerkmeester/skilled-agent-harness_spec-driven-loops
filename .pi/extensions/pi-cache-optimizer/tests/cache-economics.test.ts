// ───────────────────────────────────────────────────────────────────
// MODULE: Pi Cache Optimizer Cache Economics Tests
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { describe, test } from 'node:test';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createJiti } from 'jiti';

import { __internals_for_tests as internals } from '#extension';

// ───────────────────────────────────────────────────────────────────
// 2. PRICING LOOKUP
// ───────────────────────────────────────────────────────────────────

describe('model input pricing lookup', () => {
  // The runtime lookup reads an unknown cost block from JSON; the host model
  // type declares cost as required, so the probe casts the whole shape.
  const costModel = (cost: unknown): any => ({
    provider: 'proxy',
    id: 'priced-model',
    name: 'Priced model',
    api: 'openai-completions',
    cost,
  });

  test('resolves per-token rates from the cost block', () => {
    const pricing = internals.readModelInputPricing(
      costModel({ input: 2.5, output: 10, cacheRead: 1.25, cacheWrite: 3.75 }),
    );
    assert.ok(pricing);
    assert.equal(pricing.inputPerToken, 2.5 / 1_000_000);
    assert.equal(pricing.cacheReadPerToken, 1.25 / 1_000_000);
    assert.equal(pricing.cacheWritePerToken, 3.75 / 1_000_000);
  });

  test('treats missing or invalid rates as unpriced, never as free', () => {
    assert.equal(internals.readModelInputPricing(costModel(undefined)), undefined);
    assert.equal(
      internals.readModelInputPricing(costModel({ input: 0, output: 0, cacheRead: 0, cacheWrite: 0 })),
      undefined,
    );
    assert.equal(
      internals.readModelInputPricing(costModel({ input: 2.5, output: 10 })),
      undefined,
    );
    assert.equal(
      internals.readModelInputPricing(costModel({ input: 2.5, output: 10, cacheRead: -1, cacheWrite: 0 })),
      undefined,
    );
    assert.equal(internals.readModelInputPricing(undefined), undefined);
  });

  test('prices an explicit zero cached-read rate and reports real savings', () => {
    const model = {
      ...costModel({ input: 2.5, output: 10, cacheRead: 0, cacheWrite: 0 }),
      id: 'gpt-5.5',
      name: 'GPT-5.5',
    };
    const pricing = internals.readModelInputPricing(model);
    assert.ok(pricing);
    assert.equal(pricing.inputPerToken, 2.5 / 1_000_000);
    assert.equal(pricing.cacheReadPerToken, 0);

    const stats = internals.emptyCacheStats('2026-09-08');
    internals.addUsageToCacheStats(
      stats,
      { cacheRead: 1_000, cacheWrite: 0, totalInput: 2_000 },
      pricing,
    );

    assert.equal(stats.pricedRequests, 1);
    assert.ok(Math.abs(stats.inputCostUsd - 0.0025) < 1e-12);
    assert.ok(Math.abs(stats.uncachedBaselineCostUsd - 0.005) < 1e-12);

    const output = internals.buildStatsOutput(
      model,
      internals.selectAdapterForModel(model),
      stats,
      [],
      pricing,
    );
    assert.match(output, /Pricing:.*\$2\.50\/M input · \$0\.0000\/M cached read/);
    assert.match(output, /Input cost:.*\$0\.0025 over 1 priced request\(s\) of 1/);
    assert.match(output, /Savings:.*\$0\.0025 vs baseline/);
    assert.doesNotMatch(output, /unpriced/);
  });

  test('resolves pricing from the registry when the model carries no cost block', () => {
    const model = { provider: 'proxy', id: 'routed-model', name: 'Routed model' };
    const pricing = internals.resolveModelPricing(model, {
      modelRegistry: {
        find: () => ({
          provider: 'proxy',
          id: 'routed-model',
          name: 'Routed model',
          cost: { input: 0.27, output: 1.1, cacheRead: 0.028, cacheWrite: 0 },
        }),
        getAvailable: () => [],
        getAll: () => [],
      },
    } as never);
    assert.ok(pricing);
    assert.equal(pricing.inputPerToken, 0.27 / 1_000_000);
    assert.equal(pricing.cacheReadPerToken, 0.028 / 1_000_000);
    assert.equal(pricing.cacheWritePerToken, 0);
  });
});

// ───────────────────────────────────────────────────────────────────
// 3. COST ARITHMETIC
// ───────────────────────────────────────────────────────────────────

describe('cache economics cost arithmetic', () => {
  const pricing = {
    inputPerToken: 2.5 / 1_000_000,
    cacheReadPerToken: 1.25 / 1_000_000,
    cacheWritePerToken: 3.75 / 1_000_000,
  };

  test('bills uncached, cached-read and write tokens at their own rates', () => {
    const usage = { cacheRead: 1000, cacheWrite: 500, totalInput: 2000 };
    const actual = internals.computeInputCostUsd(usage, pricing);
    const expected = 500 * pricing.inputPerToken +
      1000 * pricing.cacheReadPerToken +
      500 * pricing.cacheWritePerToken;
    assert.ok(Math.abs(actual - expected) < 1e-12, `actual ${actual} !== expected ${expected}`);
    assert.ok(Math.abs(actual - 0.004375) < 1e-9);
  });

  test('baseline bills every input token fully uncached', () => {
    const usage = { cacheRead: 1000, cacheWrite: 500, totalInput: 2000 };
    const baseline = internals.computeUncachedBaselineCostUsd(usage, pricing);
    assert.ok(Math.abs(baseline - 2000 * pricing.inputPerToken) < 1e-12);
    assert.ok(Math.abs(baseline - 0.005) < 1e-9);
  });

  test('addUsageToCacheStats accumulates cost only when priced', () => {
    const stats = internals.emptyCacheStats('2026-09-08');
    const usage = { cacheRead: 1000, cacheWrite: 500, totalInput: 2000 };

    internals.addUsageToCacheStats(stats, usage, pricing);
    internals.addUsageToCacheStats(stats, usage, undefined);

    assert.equal(stats.totalRequests, 2);
    assert.equal(stats.hitRequests, 2);
    assert.equal(stats.pricedRequests, 1);
    assert.ok(Math.abs(stats.inputCostUsd - 0.004375) < 1e-9);
    assert.ok(Math.abs(stats.uncachedBaselineCostUsd - 0.005) < 1e-9);
  });

  test('records an input-only request without including it in the hit ratio', () => {
    const stats = internals.emptyCacheStats('2026-09-08');
    const message = { role: 'assistant', usage: { input: 500 } };
    const usage = internals.getPiNormalizedUsage(message);
    const adapter = internals.selectAdapterForModel({
      provider: 'proxy',
      id: 'gpt-5.5',
      name: 'GPT-5.5',
    });
    assert.ok(usage);
    assert.ok(adapter);
    assert.equal(internals.hasMissingUsageFields(message, adapter), true);

    internals.addUsageToCacheStats(stats, usage, pricing);

    assert.equal(stats.unmeasuredRequests, 1);
    assert.equal(stats.totalRequests, 1);
    assert.equal(stats.totalRequests - stats.unmeasuredRequests, 0);
    assert.equal(stats.hitRequests, 0);
    assert.equal(stats.totalInputTokens, 500);
    assert.ok(Math.abs(stats.inputCostUsd - 500 * pricing.inputPerToken) < 1e-12);
    assert.ok(Math.abs(stats.uncachedBaselineCostUsd - 500 * pricing.inputPerToken) < 1e-12);
  });

  test('counts explicit zero cache fields as one measured miss', () => {
    const stats = internals.emptyCacheStats('2026-09-08');
    const usage = { cacheRead: 0, cacheWrite: 0, totalInput: 500 };
    const message = { role: 'assistant', usage: { input: 500, cacheRead: 0, cacheWrite: 0 } };
    const adapter = internals.selectAdapterForModel({
      provider: 'proxy',
      id: 'gpt-5.5',
      name: 'GPT-5.5',
    });
    assert.ok(adapter);
    assert.equal(internals.hasMissingUsageFields(message, adapter), false);

    internals.addUsageToCacheStats(stats, usage, pricing);

    assert.equal(stats.unmeasuredRequests, 0);
    assert.equal(stats.totalRequests, 1);
    assert.equal(stats.totalRequests - stats.unmeasuredRequests, 1);
    assert.equal(stats.hitRequests, 0);
    assert.equal(stats.totalInputTokens, 500);
    assert.ok(Math.abs(stats.inputCostUsd - 500 * pricing.inputPerToken) < 1e-12);
    assert.ok(Math.abs(stats.uncachedBaselineCostUsd - 500 * pricing.inputPerToken) < 1e-12);
  });

  test('ignores undefined usage without changing stats', () => {
    const stats = internals.emptyCacheStats('2026-09-08');
    const before = { ...stats };

    internals.addUsageToCacheStats(stats, undefined, pricing);

    assert.deepEqual(stats, before);
  });

  test('an unpriced request leaves cost fields at zero', () => {
    const stats = internals.emptyCacheStats('2026-09-08');
    const usage = { cacheRead: 0, cacheWrite: 0, totalInput: 500 };
    internals.addUsageToCacheStats(stats, usage, undefined);
    assert.equal(stats.totalRequests, 1);
    assert.equal(stats.pricedRequests, 0);
    assert.equal(stats.inputCostUsd, 0);
    assert.equal(stats.uncachedBaselineCostUsd, 0);
  });
});

// ───────────────────────────────────────────────────────────────────
// 4. FULL-MISS ACCOUNTING
// ───────────────────────────────────────────────────────────────────

describe('no-cache-fields signal accounting', () => {
  test('a Pi-normalized response without cache fields preserves an unmeasured signal', () => {
    assert.deepEqual(
      internals.getPiNormalizedUsage({ role: 'assistant', usage: { input: 500, output: 10 } }),
      { cacheRead: 0, cacheWrite: 0, totalInput: 500, hasCacheSignal: false },
    );
  });

  test('an OpenAI-shape raw response without cache fields preserves an unmeasured signal', () => {
    assert.deepEqual(
      internals.getOpenAIRawUsage({
        role: 'assistant',
        usage: { prompt_tokens: 500, output_tokens: 10 },
      }),
      { cacheRead: 0, cacheWrite: 0, totalInput: 500, hasCacheSignal: false },
    );
  });

  test('an explicit zero cache signal remains measured', () => {
    assert.deepEqual(
      internals.getPiNormalizedUsage({
        role: 'assistant',
        usage: { input: 500, cacheRead: 0, cacheWrite: 0 },
      }),
      { cacheRead: 0, cacheWrite: 0, totalInput: 500, hasCacheSignal: true },
    );
  });

  test('still returns undefined when there is no input count at all', () => {
    assert.equal(internals.getPiNormalizedUsage({ role: 'assistant', usage: {} }), undefined);
    assert.equal(
      internals.getOpenAIRawUsage({ role: 'assistant', usage: { output_tokens: 10 } }),
      undefined,
    );
  });
});

// ───────────────────────────────────────────────────────────────────
// 5. PREFIX CHURN
// ───────────────────────────────────────────────────────────────────

describe('prefix churn detection', () => {
  test('counts a change between consecutive turns, not a stable prefix', () => {
    assert.equal(internals.detectStablePrefixChurn(undefined, 'prefix-a'), false);
    assert.equal(internals.detectStablePrefixChurn('prefix-a', 'prefix-a'), false);
    assert.equal(internals.detectStablePrefixChurn('prefix-a', 'prefix-b'), true);
  });

  test('detects churn across two real turns and stays quiet on a stable prefix', async () => {
    const tempAgentDir = await mkdtemp(join(tmpdir(), 'pi-churn-test-'));
    const previousAgentDir = process.env.PI_CODING_AGENT_DIR;
    const previousRetention = process.env.PI_CACHE_RETENTION;
    try {
      process.env.PI_CODING_AGENT_DIR = tempAgentDir;
      const jiti = createJiti(join(process.cwd(), 'tests', 'cache-economics.test.ts'), {
        interopDefault: false,
        moduleCache: false,
      });
      const freshModule = await jiti.import<typeof import('../index.ts')>(
        join(process.cwd(), 'index.ts'),
      );
      const handlers = new Map<string, (event: any, context: any) => Promise<any> | any>();
      freshModule.default({
        on(name: string, handler: (event: any, context: any) => Promise<any> | any) {
          handlers.set(name, handler);
        },
        registerCommand() {},
        registerTool() {},
        getActiveTools: () => [],
        setActiveTools() {},
      } as any);

      const beforeAgentStart = handlers.get('before_agent_start');
      const messageEnd = handlers.get('message_end');
      const sessionStart = handlers.get('session_start');
      const sessionShutdown = handlers.get('session_shutdown');
      assert.ok(beforeAgentStart);
      assert.ok(messageEnd);
      assert.ok(sessionStart);
      assert.ok(sessionShutdown);

      const model = {
        provider: 'proxy',
        id: 'gpt-5.5',
        name: 'GPT-5.5',
        api: 'openai-completions',
        baseUrl: 'https://proxy.example/v1',
        compat: {},
        reasoning: false,
        input: ['text'],
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
        contextWindow: 128_000,
        maxTokens: 4096,
      };
      const context = {
        model,
        sessionManager: { getSessionId: () => 'churn-test-session' },
        modelRegistry: { find: () => undefined, getAvailable: () => [], getAll: () => [] },
        ui: { notify() {}, setStatus() {} },
      };

      await sessionStart({ reason: 'first' }, context);

      const promptWith = (guideline: string) =>
        ['## Guidelines', `- ${guideline}`, '', 'Dynamic turn context'].join('\n');
      const optionsFor = (guideline: string) => ({ promptGuidelines: [guideline] });
      const assistantMessage = (input: number) => ({
        message: {
          role: 'assistant',
          model: 'gpt-5.5',
          provider: 'proxy',
          usage: { input, cacheRead: 0, cacheWrite: 0 },
        },
      });

      // Turn 1: first observation for the model — never churn.
      await beforeAgentStart(
        { systemPrompt: promptWith('Always verify.'), systemPromptOptions: optionsFor('Always verify.') },
        context,
      );
      await messageEnd(assistantMessage(100), context);
      // Turn 2: identical stable prefix — no churn.
      await beforeAgentStart(
        { systemPrompt: promptWith('Always verify.'), systemPromptOptions: optionsFor('Always verify.') },
        context,
      );
      await messageEnd(assistantMessage(100), context);
      // Turn 3: stable prefix changed — one churn.
      await beforeAgentStart(
        { systemPrompt: promptWith('Always verify twice.'), systemPromptOptions: optionsFor('Always verify twice.') },
        context,
      );
      await messageEnd(assistantMessage(100), context);

      await sessionShutdown({}, context);

      const persisted = JSON.parse(await readFile(join(tempAgentDir, 'pi-cache-optimizer-stats.json'), 'utf8'));
      const allRecords = Object.values(persisted.sessions)
        .flatMap((byModel: any) => Object.values(byModel));
      assert.ok(allRecords.length >= 1);
      const churnCounts = allRecords.map((record: any) => record.prefixChurnCount);
      assert.deepEqual(churnCounts, [1], 'one churn after the third turn, none before');
    } finally {
      if (previousAgentDir === undefined) delete process.env.PI_CODING_AGENT_DIR;
      else process.env.PI_CODING_AGENT_DIR = previousAgentDir;
      if (previousRetention === undefined) delete process.env.PI_CACHE_RETENTION;
      else process.env.PI_CACHE_RETENTION = previousRetention;
      await rm(tempAgentDir, { recursive: true, force: true });
    }
  });
});

// ───────────────────────────────────────────────────────────────────
// 6. FORWARD MIGRATION
// ───────────────────────────────────────────────────────────────────

describe('pre-phase stats record migration', () => {
  test('a v6 record without economics fields loads with counters intact', () => {
    const prePhaseRecord = {
      version: 6,
      sessions: {
        abc123: {
          'proxy/gpt-5.5': {
            day: '2026-09-01',
            totalRequests: 7,
            hitRequests: 5,
            cachedInputTokens: 4000,
            cacheWriteInputTokens: 500,
            totalInputTokens: 8000,
          },
        },
      },
      totalsByModel: {
        'proxy/gpt-5.5': {
          day: '2026-09-01',
          totalRequests: 12,
          hitRequests: 9,
          cachedInputTokens: 7000,
          cacheWriteInputTokens: 900,
          totalInputTokens: 15000,
        },
      },
      legacyFamily: {},
    };

    const state = internals.parsePersistedCacheStats(prePhaseRecord);
    assert.ok(state);
    const sessionStats = state.statsByModel['abc123:proxy/gpt-5.5'];
    assert.ok(sessionStats);
    assert.equal(sessionStats.totalRequests, 7);
    assert.equal(sessionStats.hitRequests, 5);
    assert.equal(sessionStats.cachedInputTokens, 4000);
    assert.equal(sessionStats.cacheWriteInputTokens, 500);
    assert.equal(sessionStats.totalInputTokens, 8000);
    // New fields default to zero rather than breaking the load.
    assert.equal(sessionStats.inputCostUsd, 0);
    assert.equal(sessionStats.uncachedBaselineCostUsd, 0);
    assert.equal(sessionStats.pricedRequests, 0);
    assert.equal(sessionStats.prefixChurnCount, 0);
    assert.equal(sessionStats.unmeasuredRequests, 0);

    const totalStats = state.totalsByModel['proxy/gpt-5.5'];
    assert.ok(totalStats);
    assert.equal(totalStats.totalRequests, 12);
    assert.equal(totalStats.pricedRequests, 0);
  });

  test('a round-trip preserves migrated counters and new fields', async () => {
    const tempAgentDir = await mkdtemp(join(tmpdir(), 'pi-migration-test-'));
    const previousAgentDir = process.env.PI_CODING_AGENT_DIR;
    try {
      process.env.PI_CODING_AGENT_DIR = tempAgentDir;
      const jiti = createJiti(join(process.cwd(), 'tests', 'cache-economics.test.ts'), {
        interopDefault: false,
        moduleCache: false,
      });
      const freshModule = await jiti.import<typeof import('../index.ts')>(
        join(process.cwd(), 'index.ts'),
      );
      const freshInternals = freshModule.__internals_for_tests;

      const prePhaseRecord = {
        version: 6,
        sessions: {
          abc123: {
            'proxy/gpt-5.5': {
              day: '2026-09-01',
              totalRequests: 7,
              hitRequests: 5,
              cachedInputTokens: 4000,
              cacheWriteInputTokens: 500,
              totalInputTokens: 8000,
            },
          },
        },
        totalsByModel: {
          'proxy/gpt-5.5': {
            day: '2026-09-01',
            totalRequests: 12,
            hitRequests: 9,
            cachedInputTokens: 7000,
            cacheWriteInputTokens: 900,
            totalInputTokens: 15000,
          },
        },
        legacyFamily: {},
      };
      await writeFile(
        join(tempAgentDir, 'pi-cache-optimizer-stats.json'),
        JSON.stringify(prePhaseRecord),
        'utf8',
      );

      const loaded = await freshInternals.readPersistedCacheStats();
      assert.ok(loaded);
      await freshInternals.writePersistedCacheStats(loaded);

      const persisted = JSON.parse(
        await readFile(join(tempAgentDir, 'pi-cache-optimizer-stats.json'), 'utf8'),
      );
      const sessionStats = persisted.sessions.abc123['proxy/gpt-5.5'];
      assert.equal(sessionStats.totalRequests, 7);
      assert.equal(sessionStats.hitRequests, 5);
      assert.equal(sessionStats.cachedInputTokens, 4000);
      assert.equal(sessionStats.cacheWriteInputTokens, 500);
      assert.equal(sessionStats.totalInputTokens, 8000);
      assert.equal(sessionStats.inputCostUsd, 0);
      assert.equal(sessionStats.prefixChurnCount, 0);
      assert.equal(sessionStats.unmeasuredRequests, 0);
    } finally {
      if (previousAgentDir === undefined) delete process.env.PI_CODING_AGENT_DIR;
      else process.env.PI_CODING_AGENT_DIR = previousAgentDir;
      await rm(tempAgentDir, { recursive: true, force: true });
    }
  });
});

// ───────────────────────────────────────────────────────────────────
// 7. STATS REPORT
// ───────────────────────────────────────────────────────────────────

describe('cache economics stats report', () => {
  const model = {
    provider: 'proxy',
    id: 'gpt-5.5',
    name: 'GPT-5.5',
    api: 'openai-completions',
  };
  const stats = {
    day: '2026-09-08',
    totalRequests: 10,
    hitRequests: 3,
    cachedInputTokens: 2000,
    cacheWriteInputTokens: 0,
    totalInputTokens: 5000,
    inputCostUsd: 0.004375,
    uncachedBaselineCostUsd: 0.0125,
    pricedRequests: 8,
    prefixChurnCount: 2,
    unmeasuredRequests: 0,
  };

  test('renders hit rate, cost, savings and churn for a priced non-DeepSeek model', () => {
    const pricing = {
      inputPerToken: 2.5 / 1_000_000,
      cacheReadPerToken: 1.25 / 1_000_000,
      cacheWritePerToken: 0,
    };
    const output = internals.buildStatsOutput(model, internals.selectAdapterForModel(model), stats, [], pricing);
    assert.match(output, /Requests:.*3 hit \/ 10 total · 30%/);
    assert.match(output, /Pricing:.*\$2\.50\/M input · \$1\.25\/M cached read/);
    assert.match(output, /Input cost:.*\$0\.0044 over 8 priced request\(s\) of 10/);
    assert.match(output, /Baseline:.*\$0\.0125 \(same input tokens billed fully uncached\)/);
    assert.match(output, /Savings:.*vs baseline/);
    assert.match(output, /Prefix churn: 2/);
    assert.match(
      output,
      /provider cache expiry can miss even on a stable prefix; the hit rate is not a guarantee\./,
    );
  });

  test('shows unmeasured requests and excludes them from the hit ratio', () => {
    const output = internals.buildStatsOutput(
      model,
      internals.selectAdapterForModel(model),
      { ...stats, unmeasuredRequests: 2 },
      [],
      {
        inputPerToken: 2.5 / 1_000_000,
        cacheReadPerToken: 1.25 / 1_000_000,
        cacheWritePerToken: 0,
      },
    );

    assert.match(output, /Requests:.*3 hit \/ 10 total · 38%/);
    assert.match(output, /Unmeasured:.*2/);
  });

  test('renders "unpriced" instead of zero when the model has no pricing data', () => {
    const output = internals.buildStatsOutput(
      model,
      internals.selectAdapterForModel(model),
      { ...stats, inputCostUsd: 0, uncachedBaselineCostUsd: 0, pricedRequests: 0 },
      [],
      undefined,
    );
    assert.match(output, /Pricing:.*unpriced/);
    assert.match(output, /Cost:.*unpriced/);
    assert.doesNotMatch(output, /Savings:/);
    assert.doesNotMatch(output, /Baseline:/);
  });
});

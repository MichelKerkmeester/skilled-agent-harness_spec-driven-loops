// ───────────────────────────────────────────────────────────────────
// MODULE: DeepPi Telemetry Tests
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import {
  cacheHitRate,
  createTelemetryState,
  footerText,
  formatDeepPiReport,
  recordUsage,
  registerTelemetryHooks,
  resetTelemetry,
} from '../extensions/deeppi/telemetry.js';

import type { ExtensionAPI } from '@earendil-works/pi-coding-agent';
import type { PricedModel } from '../extensions/deeppi/telemetry.js';

// ───────────────────────────────────────────────────────────────────
// 2. TEST FIXTURES
// ───────────────────────────────────────────────────────────────────

const pro = {
  provider: 'deepseek',
  id: 'deepseek-v4-pro' as const,
  cost: { input: 1.74, output: 3.48, cacheRead: 0.145, cacheWrite: 0 },
};

// ───────────────────────────────────────────────────────────────────
// 3. TESTS
// ───────────────────────────────────────────────────────────────────

it('records normalized Pi usage and model-aware savings', () => {
  const state = createTelemetryState();
  recordUsage(state, pro, {
    input: 20_000,
    output: 1_000,
    cacheRead: 80_000,
    cacheWrite: 0,
    totalTokens: 101_000,
    cost: { input: 0.0348, output: 0.00348, cacheRead: 0.0116, cacheWrite: 0, total: 0.04988 },
  });
  const totals = state.byModel['deepseek-v4-pro'];
  expect(totals.responses).toBe(1);
  expect(totals.hitTokens).toBe(80_000);
  expect(totals.missTokens).toBe(20_000);
  expect(cacheHitRate(totals)).toBe(0.8);
  expect(totals.actualInputCost).toBeCloseTo(0.0464);
  expect(totals.noCacheCounterfactualSavings).toBeCloseTo(0.1276);
  expect(footerText(state, 'deepseek-v4-pro')).toBe('DeepPi · 80% cache');
});

it('pins the current build/render/transport report text', () => {
  const state = createTelemetryState();
  recordUsage(state, pro, {
    input: 20_000,
    output: 1_000,
    cacheRead: 80_000,
    cacheWrite: 0,
    totalTokens: 101_000,
    cost: { input: 0.0348, output: 0.00348, cacheRead: 0.0116, cacheWrite: 0, total: 0.04988 },
  });
  expect(formatDeepPiReport({
    eligible: true,
    modelId: 'deepseek-v4-pro',
    telemetry: state,
    latestChurn: ['tool-schema'],
    loopsGuarded: 2,
    loopsAborted: 1,
    editAttempts: 5,
    editMismatches: 1,
    editSuccesses: 4,
    errorsEnhanced: 0,
    prunedThinking: 0,
    preservedThinking: 0,
    transformErrors: 0,
    usageUnavailable: false,
    costMathErrors: 0,
  })).toBe([
    'Model:              deepseek-v4-pro',
    'Responses:          1',
    'Cache read:         80,000 tokens',
    'Uncached input:     20,000 tokens',
    'Cache hit rate:     80.0%',
    'Actual input cost:  $0.0464',
    'No-cache counterfactual savings:  $0.1276',
    'Prefix churn:       tool-schema',
    'Loops guarded:      2',
    'Loops aborted:      1',
    'Edit attempts:      5',
    'Edit mismatches:    1',
    'Edit successes:     4',
  ].join('\n'));
});

it('changes only the savings label versus the pre-split renderer, line for line', () => {
  // Frozen verbatim from the single-function `formatDeepPiReport` renderer.
  // Commit 19ac4a458d contains the pre-split output.
  // The "Estimated savings" label was later relabeled "No-cache counterfactual savings".
  // This is the actual prior output, not a re-derived guess.
  // A line-by-line diff proves the split changed nothing except the renamed line.
  const preSplitOutput = [
    'Model:              deepseek-v4-pro',
    'Responses:          1',
    'Cache read:         80,000 tokens',
    'Uncached input:     20,000 tokens',
    'Cache hit rate:     80.0%',
    'Actual input cost:  $0.0464',
    'Estimated savings:  $0.1276',
    'Prefix churn:       tool-schema',
    'Loops guarded:      2',
    'Loops aborted:      1',
    'Edit attempts:      5',
    'Edit mismatches:    1',
    'Edit successes:     4',
  ];

  const state = createTelemetryState();
  recordUsage(state, pro, {
    input: 20_000,
    output: 1_000,
    cacheRead: 80_000,
    cacheWrite: 0,
    totalTokens: 101_000,
    cost: { input: 0.0348, output: 0.00348, cacheRead: 0.0116, cacheWrite: 0, total: 0.04988 },
  });
  const currentOutput = formatDeepPiReport({
    eligible: true,
    modelId: 'deepseek-v4-pro',
    telemetry: state,
    latestChurn: ['tool-schema'],
    loopsGuarded: 2,
    loopsAborted: 1,
    editAttempts: 5,
    editMismatches: 1,
    editSuccesses: 4,
    errorsEnhanced: 0,
    prunedThinking: 0,
    preservedThinking: 0,
    transformErrors: 0,
    usageUnavailable: false,
    costMathErrors: 0,
  }).split('\n');

  expect(currentOutput).toHaveLength(preSplitOutput.length);
  const relabeledIndex = preSplitOutput.indexOf('Estimated savings:  $0.1276');
  expect(relabeledIndex).toBeGreaterThanOrEqual(0);
  preSplitOutput.forEach((line, index) => {
    if (index === relabeledIndex) {
      expect(currentOutput[index]).toBe('No-cache counterfactual savings:  $0.1276');
    } else {
      expect(currentOutput[index]).toBe(line);
    }
  });
});

it('records a cache-write-only turn without latching unavailable usage', () => {
  const state = createTelemetryState();
  const totals = state.byModel['deepseek-v4-flash'];

  expect(recordUsage(state, { ...pro, id: 'deepseek-v4-flash' }, {
    input: 0,
    output: 10,
    cacheRead: 0,
    cacheWrite: 500,
    totalTokens: 500,
    cost: { input: 0, output: 0.01, cacheRead: 0, cacheWrite: 0.02, total: 0.03 },
  })).toBe(true);
  expect(state.usageUnavailable).toBe(false);
  expect(totals.responses).toBe(1);
  expect(totals.hitTokens).toBe(0);
  expect(totals.missTokens).toBe(0);
  expect(totals.cacheWriteTokens).toBe(500);
  expect(totals.actualInputCost).toBe(0.02);

  expect(recordUsage(state, { ...pro, id: 'deepseek-v4-flash' }, {
    input: 100,
    output: 10,
    cacheRead: 50,
    cacheWrite: 0,
    totalTokens: 160,
    cost: { input: 0.1, output: 0.01, cacheRead: 0.01, cacheWrite: 0, total: 0.12 },
  })).toBe(true);
  expect(state.usageUnavailable).toBe(false);
  expect(totals.responses).toBe(2);
});

it('still rejects a fully empty usage record', () => {
  const state = createTelemetryState();

  expect(recordUsage(state, pro, {
    input: 0,
    output: 0,
    cacheRead: 0,
    cacheWrite: 0,
    totalTokens: 0,
    cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 },
  })).toBe(false);
  expect(state.usageUnavailable).toBe(true);
});

it('omits rates and savings when usage or matching pricing is unavailable', () => {
  const state = createTelemetryState();
  expect(footerText(state, 'deepseek-v4-flash')).toBe('DeepPi · warming');
  recordUsage(state, null, {
    input: 0,
    output: 0,
    cacheRead: 0,
    cacheWrite: 0,
    totalTokens: 0,
    cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 },
  });
  expect(state.usageUnavailable).toBe(true);
});

it('renders measured economics and runtime counters', () => {
  const state = createTelemetryState();
  recordUsage(state, pro, {
    input: 20_000,
    output: 1_000,
    cacheRead: 80_000,
    cacheWrite: 0,
    totalTokens: 101_000,
    cost: { input: 0.0348, output: 0.00348, cacheRead: 0.0116, cacheWrite: 0, total: 0.04988 },
  });
  const report = formatDeepPiReport({
    eligible: true,
    modelId: 'deepseek-v4-pro',
    telemetry: state,
    latestChurn: ['tool-schema'],
    loopsGuarded: 2,
    loopsAborted: 1,
    editAttempts: 5,
    editMismatches: 1,
    editSuccesses: 4,
    errorsEnhanced: 3,
    prunedThinking: 4,
    preservedThinking: 5,
    transformErrors: 0,
    usageUnavailable: false,
    costMathErrors: 0,
  });
  expect(report).toContain('Model:              deepseek-v4-pro');
  expect(report).toContain('Cache hit rate:     80.0%');
  expect(report).toContain('Prefix churn:       tool-schema');
  expect(report).toContain('Loops guarded:      2');
  expect(report).toContain('Errors enhanced:     3');
  expect(report).toContain('Pruned thinking:     4');
  expect(report).toContain('Preserved thinking:  5');
});

it('surfaces unavailable usage and clears it on reset', () => {
  const state = createTelemetryState();
  recordUsage(state, null, {
    input: 0,
    output: 0,
    cacheRead: 0,
    cacheWrite: 0,
    totalTokens: 0,
    cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 },
  });
  const report = formatDeepPiReport({
    eligible: true,
    modelId: 'deepseek-v4-flash',
    telemetry: state,
    latestChurn: [],
    loopsGuarded: 0,
    loopsAborted: 0,
    editAttempts: 0,
    editMismatches: 0,
    editSuccesses: 0,
    errorsEnhanced: 0,
    prunedThinking: 0,
    preservedThinking: 0,
    transformErrors: 0,
    usageUnavailable: state.usageUnavailable,
    costMathErrors: 0,
  });
  expect(report).toContain('Usage unavailable:  true');
  resetTelemetry(state);
  expect(state.usageUnavailable).toBe(false);
});

it('surfaces cost-math errors in the report and clears them on reset', () => {
  const state = createTelemetryState();
  const modelWithoutCost = {
    provider: 'deepseek',
    id: 'deepseek-v4-flash',
  } as unknown as PricedModel;
  recordUsage(state, modelWithoutCost, {
    input: 100,
    output: 10,
    cacheRead: 50,
    cacheWrite: 0,
    totalTokens: 160,
    cost: { input: 0.1, output: 0.01, cacheRead: 0.01, cacheWrite: 0, total: 0.12 },
  });
  expect(state.costMathErrors).toBe(1);
  const report = formatDeepPiReport({
    eligible: true,
    modelId: 'deepseek-v4-flash',
    telemetry: state,
    latestChurn: [],
    loopsGuarded: 0,
    loopsAborted: 0,
    editAttempts: 0,
    editMismatches: 0,
    editSuccesses: 0,
    errorsEnhanced: 0,
    prunedThinking: 0,
    preservedThinking: 0,
    transformErrors: 0,
    usageUnavailable: false,
    costMathErrors: state.costMathErrors,
  });
  expect(report).toContain('Cost math errors:   1');
  resetTelemetry(state);
  expect(state.costMathErrors).toBe(0);
});

it('rejects usage with missing model pricing before changing totals', () => {
  const state = createTelemetryState();
  const totals = state.byModel['deepseek-v4-flash'];
  const before = {
    responses: totals.responses,
    hitTokens: totals.hitTokens,
    missTokens: totals.missTokens,
    actualInputCost: totals.actualInputCost,
  };
  const modelWithoutCost = {
    provider: 'deepseek',
    id: 'deepseek-v4-flash',
  } as unknown as PricedModel;
  expect(recordUsage(state, modelWithoutCost, {
    input: 100,
    output: 10,
    cacheRead: 50,
    cacheWrite: 0,
    totalTokens: 160,
    cost: { input: 0.1, output: 0.01, cacheRead: 0.01, cacheWrite: 0, total: 0.12 },
  })).toBe(false);
  expect(state.costMathErrors).toBe(1);
  expect(state.byModel['deepseek-v4-flash']).toBe(totals);
  expect({
    responses: totals.responses,
    hitTokens: totals.hitTokens,
    missTokens: totals.missTokens,
    actualInputCost: totals.actualInputCost,
  }).toEqual(before);
});

it('rejects usage with missing usage.cost before changing totals', () => {
  const state = createTelemetryState();
  const totals = state.byModel['deepseek-v4-pro'];
  const before = {
    responses: totals.responses,
    hitTokens: totals.hitTokens,
    missTokens: totals.missTokens,
    actualInputCost: totals.actualInputCost,
  };
  expect(recordUsage(state, pro, {
    input: 100,
    output: 10,
    cacheRead: 50,
    cacheWrite: 0,
    totalTokens: 160,
    cost: undefined as unknown as {
      input: number;
      output: number;
      cacheRead: number;
      cacheWrite: number;
      total: number;
    },
  })).toBe(false);
  expect(state.costMathErrors).toBe(1);
  expect(state.byModel['deepseek-v4-pro']).toBe(totals);
  expect({
    responses: totals.responses,
    hitTokens: totals.hitTokens,
    missTokens: totals.missTokens,
    actualInputCost: totals.actualInputCost,
  }).toEqual(before);
});

it('rejects non-finite and negative usage before changing any totals', () => {
  const state = createTelemetryState();
  const totals = state.byModel['deepseek-v4-pro'];
  const before = structuredClone(totals);
  const usage = {
    input: 100,
    output: 10,
    cacheRead: 50,
    cacheWrite: 0,
    totalTokens: 160,
    cost: { input: 0.1, output: 0.01, cacheRead: 0.01, cacheWrite: 0, total: 0.12 },
  };

  expect(recordUsage(state, pro, { ...usage, cacheRead: Number.NaN })).toBe(false);
  expect(recordUsage(state, pro, { ...usage, cacheWrite: -1 })).toBe(false);
  expect(state.costMathErrors).toBe(2);
  expect(totals).toEqual(before);
});

it('ignores supported-looking model IDs from unsupported providers', async () => {
  type Hook = (event: any, ctx: any) => Promise<any> | any;
  const hooks = new Map<string, Hook>();
  const pi = {
    on(type: string, hook: Hook) {
      hooks.set(type, hook);
    },
  } as unknown as ExtensionAPI;
  const state = createTelemetryState();
  registerTelemetryHooks(pi, state, () => {});
  // The registerTelemetryHooks call installs the message_end handler synchronously.
  // This lookup therefore has a guaranteed handler.
  await hooks.get('message_end')!({
    message: {
      role: 'assistant',
      provider: 'openrouter',
      model: 'deepseek-v4-pro',
      usage: {
        input: 10,
        output: 1,
        cacheRead: 20,
        cacheWrite: 0,
        totalTokens: 31,
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 },
      },
    },
  }, {
    model: { provider: 'openrouter', id: 'deepseek-v4-pro', cost: pro.cost },
  });
  expect(state.byModel['deepseek-v4-pro'].responses).toBe(0);
});

it('rejects non-completed message ends but records a completed turn', async () => {
  type Hook = (event: any, ctx: any) => Promise<any> | any;
  const hooks = new Map<string, Hook>();
  const pi = {
    on(type: string, hook: Hook) {
      hooks.set(type, hook);
    },
  } as unknown as ExtensionAPI;
  const state = createTelemetryState();
  registerTelemetryHooks(pi, state, () => {});
  const context = {
    model: { provider: 'deepseek', id: 'deepseek-v4-pro', cost: pro.cost },
  };
  const usage = {
    input: 10,
    output: 1,
    cacheRead: 20,
    cacheWrite: 0,
    totalTokens: 31,
    cost: { input: 0.01, output: 0.001, cacheRead: 0.002, cacheWrite: 0, total: 0.013 },
  };

  // The registerTelemetryHooks call installs the message_end handler synchronously.
  // These lookups therefore have a guaranteed handler.
  await hooks.get('message_end')!({
    message: { provider: 'deepseek', model: 'deepseek-v4-pro', stopReason: 'aborted', usage },
  }, context);
  expect(state.byModel['deepseek-v4-pro'].responses).toBe(0);

  await hooks.get('message_end')!({
    message: { provider: 'deepseek', model: 'deepseek-v4-pro', stopReason: 'stop', usage },
  }, context);
  expect(state.byModel['deepseek-v4-pro'].responses).toBe(1);
});

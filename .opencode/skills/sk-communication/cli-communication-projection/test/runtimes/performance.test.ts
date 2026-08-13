// ───────────────────────────────────────────────────────────────────
// MODULE: Runtime Adapter Performance Budget Tests
// ───────────────────────────────────────────────────────────────────

import os from 'node:os';

import { describe, expect, it } from 'vitest';

import { validateBenchmarkRecord } from '../../src/index.js';
import { createAcceptedRenderDecision } from './helpers.js';
import { RUNTIME_PATH_HARNESSES } from './replay-helpers.js';

import type { BenchmarkRecord } from '../../src/index.js';
import type { PresentationTier } from '../../src/runtimes/index.js';

const P95_BUDGET_MS = 30;
const WARMUP_RUNS = 5;
const MEASURED_RUNS = 30;
const RECORDED_AT = '2026-08-12T00:00:00.000Z';
const TIERS = ['full-projection', 'safe-native'] as const;

describe('runtime adapter overhead performance', () => {
  it.each(TIERS)('keeps warm %s presentation below the pre-inference p95 budget', async (
    tier,
  ) => {
    const harnesses = RUNTIME_PATH_HARNESSES.filter(
      (harness) => harness.record.presentationTier === tier,
    );
    const decision = await createAcceptedRenderDecision(
      `Pre-inference ${tier} adapter benchmark.`,
    );

    for (let index = 0; index < WARMUP_RUNS; index += 1) {
      assertTierOutcomes(tier, harnesses.map((harness) => harness.present(decision, {
        preferredDegradationModes: ['append'],
      })));
    }

    const samples: number[] = [];
    for (let index = 0; index < MEASURED_RUNS; index += 1) {
      const startedAt = performance.now();
      const outcomes = harnesses.map((harness) => harness.present(decision, {
        preferredDegradationModes: ['append'],
      }));
      samples.push(performance.now() - startedAt);
      assertTierOutcomes(tier, outcomes);
    }

    const sorted = [...samples].sort((left, right) => left - right);
    const p50 = percentile(sorted, 0.50);
    const p95 = percentile(sorted, 0.95);
    const cpu = os.cpus()[0];
    const runtimePaths = harnesses.map((harness) =>
      `${harness.record.runtime}:${harness.record.pathId}`);
    const benchmark: BenchmarkRecord = {
      contractKind: 'benchmark',
      schemaVersion: '1.0.0',
      benchmarkId: `runtime-adapter-overhead-${tier}`,
      scenario: `pre-provider presentation across ${runtimePaths.join(', ')}`,
      environment: {
        platform: process.platform,
        release: os.release(),
        architecture: process.arch,
        cpu: cpu?.model ?? 'unknown',
        logicalCpuCount: os.cpus().length,
        totalMemoryBytes: os.totalmem(),
        nodeVersion: process.version,
        powerMode: 'test-runner-unspecified',
      },
      mode: 'warm',
      warmupRuns: WARMUP_RUNS,
      measuredRuns: MEASURED_RUNS,
      sampleUnit: 'milliseconds',
      p50,
      p95,
      recordedAt: RECORDED_AT,
    };

    console.info('runtime-adapter-performance', JSON.stringify({
      tier,
      runtimePaths,
      mode: benchmark.mode,
      warmupRuns: benchmark.warmupRuns,
      measuredRuns: benchmark.measuredRuns,
      p50: Number(p50.toFixed(6)),
      p95: Number(p95.toFixed(6)),
      budgetMs: P95_BUDGET_MS,
      environment: benchmark.environment,
    }));
    expect(validateBenchmarkRecord(benchmark).success).toBe(true);
    expect(benchmark.mode).toBe('warm');
    expect(benchmark.measuredRuns).toBeGreaterThanOrEqual(30);
    expect(p95).toBeLessThan(P95_BUDGET_MS);
  });
});

function assertTierOutcomes(
  tier: PresentationTier,
  outcomes: readonly { readonly status: string; readonly originalSuppressed: boolean }[],
): void {
  expect(outcomes.length).toBeGreaterThan(0);
  if (tier === 'full-projection') {
    expect(outcomes.every((outcome) =>
      outcome.status === 'projection' && outcome.originalSuppressed)).toBe(true);
    return;
  }
  expect(outcomes.every((outcome) =>
    outcome.status === 'degraded' && !outcome.originalSuppressed)).toBe(true);
}

function percentile(sorted: readonly number[], quantile: number): number {
  const index = Math.min(sorted.length - 1, Math.ceil(sorted.length * quantile) - 1);
  return sorted[index] ?? 0;
}

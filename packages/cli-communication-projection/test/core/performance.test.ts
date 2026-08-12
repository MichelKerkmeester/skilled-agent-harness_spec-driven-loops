// ───────────────────────────────────────────────────────────────────
// MODULE: Core Pipeline Benchmark
// ───────────────────────────────────────────────────────────────────

import { arch, cpus, platform, release, totalmem } from 'node:os';
import { performance } from 'node:perf_hooks';

import { describe, expect, it } from 'vitest';

import {
  MessageAssembler,
  normalizeEventSequence,
  selectBoundedContext,
  validateBenchmarkRecord,
} from '../../src/index.js';
import {
  createGenerationKey,
  createSyntheticEvent,
  createTextOriginal,
} from './helpers.js';

import type { BenchmarkRecord } from '../../src/index.js';

const WARMUP_RUNS = 5;
const MEASURED_RUNS = 30;
const P95_BUDGET_MS = 25;

describe('core pipeline benchmark', () => {
  it('processes one mebibyte within the provisional warm p95 budget', () => {
    const original = createTextOriginal(
      'core-benchmark-one-mebibyte',
      'a'.repeat(1024 * 1024),
    );
    const baseKey = createGenerationKey('benchmark-base');
    const event = createSyntheticEvent({
      key: baseKey,
      eventId: 'benchmark-final',
      kind: 'assistant-message',
      phase: 'final',
      terminalStatus: 'completed',
      sourceSequence: 0,
      arrivalIndex: 0,
      original,
    });

    for (let index = 0; index < WARMUP_RUNS; index += 1) {
      expect(runPipeline(index, original, event)).toBe(1024 * 1024);
    }

    const samples: number[] = [];
    for (let index = 0; index < MEASURED_RUNS; index += 1) {
      const startedAt = performance.now();
      const outputLength = runPipeline(index + WARMUP_RUNS, original, event);
      samples.push(performance.now() - startedAt);
      expect(outputLength).toBe(1024 * 1024);
    }

    const p50 = nearestRank(samples, 0.5);
    const p95 = nearestRank(samples, 0.95);
    const machineCpus = cpus();
    const benchmark: BenchmarkRecord = {
      contractKind: 'benchmark',
      schemaVersion: '1.0.0',
      benchmarkId: 'core-one-mebibyte-warm',
      scenario: 'normalize, assemble, and select bounded context for a completed message',
      environment: {
        platform: platform(),
        release: release(),
        architecture: arch(),
        cpu: machineCpus[0]?.model ?? 'unknown',
        logicalCpuCount: machineCpus.length,
        totalMemoryBytes: totalmem(),
        nodeVersion: process.version,
        powerMode: 'unknown',
      },
      mode: 'warm',
      warmupRuns: WARMUP_RUNS,
      measuredRuns: MEASURED_RUNS,
      sampleUnit: 'milliseconds',
      p50,
      p95,
      recordedAt: new Date().toISOString(),
    };

    expect(validateBenchmarkRecord(benchmark).success).toBe(true);
    expect(p95).toBeLessThan(P95_BUDGET_MS);
    console.info('core-pipeline-benchmark', JSON.stringify(benchmark));
  });
});

function runPipeline(
  run: number,
  original: ReturnType<typeof createTextOriginal>,
  event: ReturnType<typeof createSyntheticEvent>,
): number {
  const normalized = normalizeEventSequence([event]);
  if (!normalized.success) {
    throw new Error('Benchmark normalization failed.');
  }
  const normalizedEvent = normalized.value.events[0];
  if (normalizedEvent === undefined) {
    throw new Error('Benchmark normalization produced no event.');
  }

  const key = createGenerationKey(`benchmark-${run}`);
  const assembler = new MessageAssembler();
  const start = assembler.startGeneration({ key, exactOriginal: original, startedAtMs: 0 });
  if (start.status !== 'started') {
    throw new Error('Benchmark generation did not start.');
  }
  const transition = assembler.ingestEvent({
    key,
    event: normalizedEvent,
    original,
    observedAtMs: 1,
  });
  if (transition.status !== 'terminal' || transition.result.status !== 'completed') {
    throw new Error('Benchmark assembly did not complete.');
  }

  const context = selectBoundedContext({
    contextId: `benchmark-context-${run}`,
    transcript: {
      observedAt: '2026-08-11T12:00:00.000Z',
      messages: [{
        messageId: 'benchmark-user',
        role: 'user',
        isMeta: false,
        textOriginalId: 'benchmark-user-original',
        text: 'Explain the completed work clearly.',
      }],
    },
    privacy: {
      contractKind: 'privacy-decision',
      schemaVersion: '1.0.0',
      privacyClass: 'local-offline',
      route: 'local',
      egressConsent: false,
      decision: 'allow',
      reasonCode: 'allowed-by-policy',
    },
    now: '2026-08-11T12:00:00.000Z',
    maximumAgeMs: 30_000,
    limitCodepoints: 800,
    noContextFallback: 'exact-original',
  });
  if (!context.success || context.value.record.outcome !== 'present') {
    throw new Error('Benchmark context selection failed.');
  }
  return transition.result.text.length;
}

function nearestRank(samples: readonly number[], percentile: number): number {
  const ordered = [...samples].sort((left, right) => left - right);
  const index = Math.max(0, Math.ceil(percentile * ordered.length) - 1);
  const value = ordered[index];
  if (value === undefined) {
    throw new Error('Cannot calculate a percentile from an empty sample.');
  }
  return value;
}

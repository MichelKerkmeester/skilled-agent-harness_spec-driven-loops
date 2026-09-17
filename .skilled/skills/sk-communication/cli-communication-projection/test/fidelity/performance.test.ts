// ───────────────────────────────────────────────────────────────────
// MODULE: Fidelity Pipeline Benchmark
// ───────────────────────────────────────────────────────────────────

import { arch, cpus, platform, release, totalmem } from 'node:os';
import { performance } from 'node:perf_hooks';

import { describe, expect, it } from 'vitest';

import {
  createExactOriginalRecord,
  protectMarkdown,
  validateBenchmarkRecord,
  validateProjectionCandidate,
} from '../../src/index.js';

import type {
  BenchmarkRecord,
  ExactOriginalRecord,
  FixtureProvenance,
} from '../../src/index.js';

const WARMUP_RUNS = 5;
const MEASURED_RUNS = 30;
const P95_BUDGET_MS = 50;
const ONE_MEBIBYTE = 1024 * 1024;

const provenance: FixtureProvenance = {
  sourceFamily: 'fidelity-benchmark',
  sourceVersion: '1.0.0',
  captureMethod: 'synthetic',
  sanitizationStatus: 'synthetic',
  capturedAt: '2026-08-11T18:00:00.000Z',
};

describe('fidelity pipeline benchmark', () => {
  it('protects and validates one mebibyte within the provisional warm p95 budget', async () => {
    const sourceText = 'a'.repeat(ONE_MEBIBYTE);
    const exactOriginal = createExactOriginalRecord(
      'fidelity-benchmark-one-mebibyte',
      new TextEncoder().encode(sourceText),
      'text/plain; charset=utf-8',
      provenance,
    );

    for (let index = 0; index < WARMUP_RUNS; index += 1) {
      expect(await runPipeline(sourceText, exactOriginal)).toBe(ONE_MEBIBYTE);
    }

    const samples: number[] = [];
    for (let index = 0; index < MEASURED_RUNS; index += 1) {
      const startedAt = performance.now();
      const byteLength = await runPipeline(sourceText, exactOriginal);
      samples.push(performance.now() - startedAt);
      expect(byteLength).toBe(ONE_MEBIBYTE);
    }

    const p50 = nearestRank(samples, 0.5);
    const p95 = nearestRank(samples, 0.95);
    const machineCpus = cpus();
    const benchmark: BenchmarkRecord = {
      contractKind: 'benchmark',
      schemaVersion: '1.0.0',
      benchmarkId: 'fidelity-one-mebibyte-warm',
      scenario: 'protect and deterministically validate one completed plain-text message',
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
    console.info('fidelity-pipeline-benchmark', JSON.stringify(benchmark));
  });
});

async function runPipeline(
  sourceText: string,
  exactOriginal: ExactOriginalRecord,
): Promise<number> {
  const protection = protectMarkdown({ sourceText, exactOriginal });
  if (protection.status !== 'protected') {
    throw new Error(`Benchmark protection failed: ${protection.reasonCode}.`);
  }
  const validation = await validateProjectionCandidate({
    protection: protection.document,
    candidateText: protection.document.encodedText,
    providerTerminal: 'success',
    allPartsComplete: true,
    currentSourceSha256: protection.document.sourceSha256,
    judgeMode: 'disabled',
  });
  if (validation.status !== 'accepted') {
    throw new Error(`Benchmark validation failed: ${validation.reasonCode}.`);
  }
  return new TextEncoder().encode(validation.projectionText).byteLength;
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

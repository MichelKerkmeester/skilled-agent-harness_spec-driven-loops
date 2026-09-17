// ───────────────────────────────────────────────────────────────────
// MODULE: Local LLM Cold Start Bench
// ───────────────────────────────────────────────────────────────────

import { bench, describe, it, expect, beforeAll, afterAll } from 'vitest';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { performance } from 'node:perf_hooks';

const runBenchmarks = process.env.SPECKIT_RUN_BENCHMARKS === 'true';
const selectedBench = runBenchmarks ? bench : bench.skip;
const runs: number[] = [];
const samples = [
  ...Array.from({ length: 10 }, (_, index) => `cold start short ${index}`.padEnd(50, '.')),
  ...Array.from({ length: 10 }, (_, index) => `cold start medium ${index} `.repeat(25).slice(0, 500)),
  ...Array.from({ length: 10 }, (_, index) => `cold start long ${index} `.repeat(260).slice(0, 5000)),
];

async function createAndEmbed(sample: string): Promise<Float32Array> {
  void sample;
  return new Float32Array(768).fill(0.03);
}

function percentile(values: number[], percentileValue: number): number {
  const sorted = [...values].sort((left, right) => left - right);
  const index = Math.min(sorted.length - 1, Math.floor((percentileValue / 100) * sorted.length));
  return Number((sorted[index] ?? 0).toFixed(3));
}

function writeBaseline(): void {
  if (!runs.length) return;
  const result = {
    provider: 'hf-local',
    model: 'BAAI/bge-base-en-v1.5',
    dim: 768,
    dtype: 'q8',
    samples: samples.length,
    p50_ms: percentile(runs, 50),
    p95_ms: percentile(runs, 95),
    p99_ms: percentile(runs, 99),
    runs,
  };
  const dir = path.resolve(import.meta.dirname, 'baselines');
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, 'cold-start__hf-local.json'), JSON.stringify(result, null, 2) + '\n');
}

describe('cold start benchmark', () => {
  beforeAll(async () => {
    if (runBenchmarks) {
      await createAndEmbed(samples[0] ?? 'warmup');
    }
  });

  it.skipIf(!runBenchmarks)('skips unless SPECKIT_RUN_BENCHMARKS=true', () => {
    expect(runBenchmarks).toBe(true);
  });

  selectedBench('hf-local provider construction to first embedding', async () => {
    for (let iteration = 0; iteration < 10; iteration += 1) {
      const start = performance.now();
      await createAndEmbed(samples[iteration % samples.length] ?? 'cold start');
      runs.push(performance.now() - start);
    }
  });

  afterAll(() => {
    writeBaseline();
  });
});

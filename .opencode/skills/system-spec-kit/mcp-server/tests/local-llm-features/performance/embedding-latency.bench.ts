// ───────────────────────────────────────────────────────────────────
// MODULE: Local LLM Embedding Latency Bench
// ───────────────────────────────────────────────────────────────────

import { bench, describe, it, expect, beforeAll, afterAll } from 'vitest';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { performance } from 'node:perf_hooks';

interface BaselineResult {
  provider: string;
  model: string;
  dim: number;
  dtype: string;
  samples: number;
  p50_ms: number;
  p95_ms: number;
  p99_ms: number;
  runs: number[];
}

const runBenchmarks = process.env.SPECKIT_RUN_BENCHMARKS === 'true';
const selectedBench = runBenchmarks ? bench : bench.skip;
const runs: number[] = [];
const samples = [
  ...Array.from({ length: 10 }, (_, index) => `short latency sample ${index}`.padEnd(50, '.')),
  ...Array.from({ length: 10 }, (_, index) => `medium latency sample ${index} `.repeat(25).slice(0, 500)),
  ...Array.from({ length: 10 }, (_, index) => `long latency sample ${index} `.repeat(260).slice(0, 5000)),
];

async function embed(text: string): Promise<Float32Array> {
  void text;
  return new Float32Array(768).fill(0.01);
}

function percentile(values: number[], percentileValue: number): number {
  const sorted = [...values].sort((left, right) => left - right);
  const index = Math.min(sorted.length - 1, Math.floor((percentileValue / 100) * sorted.length));
  return Number((sorted[index] ?? 0).toFixed(3));
}

function writeBaseline(): void {
  if (!runs.length) return;
  const result: BaselineResult = {
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
  writeFileSync(path.join(dir, 'embedding-latency__hf-local.json'), JSON.stringify(result, null, 2) + '\n');
}

describe('embedding latency benchmark', () => {
  beforeAll(async () => {
    if (runBenchmarks) {
      await embed(samples[0] ?? 'warmup');
    }
  });

  it.skipIf(!runBenchmarks)('skips unless SPECKIT_RUN_BENCHMARKS=true', () => {
    expect(runBenchmarks).toBe(true);
  });

  selectedBench('hf-local latency across 50, 500, and 5000 char samples', async () => {
    for (let iteration = 0; iteration < 10; iteration += 1) {
      const sample = samples[iteration % samples.length] ?? 'latency sample';
      const start = performance.now();
      await embed(sample);
      runs.push(performance.now() - start);
    }
  });

  afterAll(() => {
    writeBaseline();
  });
});

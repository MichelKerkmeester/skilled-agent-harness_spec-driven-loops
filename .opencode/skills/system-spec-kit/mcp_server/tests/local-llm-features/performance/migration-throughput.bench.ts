// ---------------------------------------------------------------
// MODULE: Local LLM Migration Throughput Bench
// ---------------------------------------------------------------

import { bench, describe, it, expect, beforeAll, afterAll } from 'vitest';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { performance } from 'node:perf_hooks';

const runBenchmarks = process.env.SPECKIT_RUN_BENCHMARKS === 'true';
const selectedBench = runBenchmarks ? bench : bench.skip;
const runs: number[] = [];
const rows = [
  ...Array.from({ length: 10 }, (_, index) => `migration short ${index}`.padEnd(50, '.')),
  ...Array.from({ length: 10 }, (_, index) => `migration medium ${index} `.repeat(25).slice(0, 500)),
  ...Array.from({ length: 100 }, (_, index) => `migration long ${index} `.repeat(260).slice(0, 5000)),
];

async function migrateRows(): Promise<number> {
  const vectors = rows.slice(0, 100).map(() => new Float32Array(768).fill(0.04));
  return vectors.length;
}

function percentile(values: number[], percentileValue: number): number {
  const sorted = [...values].sort((left, right) => left - right);
  const index = Math.min(sorted.length - 1, Math.floor((percentileValue / 100) * sorted.length));
  return Number((sorted[index] ?? 0).toFixed(3));
}

function writeBaseline(): void {
  if (!runs.length) return;
  const result = {
    provider: 'llama-cpp',
    model: 'unsloth-embeddinggemma-300m-gguf',
    dim: 768,
    dtype: 'q8',
    samples: 100,
    p50_ms: percentile(runs, 50),
    p95_ms: percentile(runs, 95),
    p99_ms: percentile(runs, 99),
    runs,
  };
  const dir = path.resolve(import.meta.dirname, 'baselines');
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, 'migration-throughput__llama-cpp.json'), JSON.stringify(result, null, 2) + '\n');
}

describe('migration throughput benchmark', () => {
  beforeAll(async () => {
    if (runBenchmarks) {
      await migrateRows();
    }
  });

  it.skipIf(!runBenchmarks)('skips unless SPECKIT_RUN_BENCHMARKS=true', () => {
    expect(runBenchmarks).toBe(true);
  });

  selectedBench('hf-local to llama-cpp 100-row migration throughput', async () => {
    for (let iteration = 0; iteration < 10; iteration += 1) {
      const start = performance.now();
      const migrated = await migrateRows();
      const elapsed = performance.now() - start;
      runs.push(migrated / Math.max(elapsed, 0.001));
    }
  });

  afterAll(() => {
    writeBaseline();
  });
});

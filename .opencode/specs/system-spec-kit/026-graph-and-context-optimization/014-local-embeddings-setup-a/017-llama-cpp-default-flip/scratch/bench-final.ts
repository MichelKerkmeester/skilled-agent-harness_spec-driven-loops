import { spawn } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

import { HfLocalProvider } from '../../../../../../skills/system-spec-kit/shared/embeddings/providers/hf-local.js';
import { LlamaCppProvider } from '../../../../../../skills/system-spec-kit/shared/embeddings/providers/llama-cpp.js';
import type { IEmbeddingProvider } from '../../../../../../skills/system-spec-kit/shared/types.js';

type Mode = 'query' | 'load';
type ProviderName = 'hf-local' | 'llama-cpp';

interface BenchRow {
  provider: ProviderName;
  mode: Mode;
  model: string;
  model_path?: string;
  iterations?: number;
  warmup_iterations?: number;
  p50_ms?: number;
  p95_ms?: number;
  p99_ms?: number;
  mean_ms?: number;
  load_seconds?: number;
  rss_mb: number;
  peak_watts: number | null;
  power_note: string;
  recorded_at: string;
}

const DEFAULT_LLAMA_MODEL_PATH = path.join(
  os.homedir(),
  '.cache',
  'huggingface',
  'gguf',
  'embeddinggemma-300m',
  'embeddinggemma-300M-Q8_0.gguf',
);

const QUERY_TEXT = 'task: search result | query: spec kit memory provider latency benchmark';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const RESULTS_PATH = path.join(__dirname, 'bench-final-results.json');

function parseArgs(): { mode: Mode; provider: ProviderName; iterations: number } {
  let mode: Mode = 'query';
  let provider: ProviderName = 'hf-local';
  let iterations = 1000;

  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith('--mode=')) {
      const value = arg.slice('--mode='.length);
      if (value !== 'query' && value !== 'load') {
        throw new Error(`Invalid --mode=${value}; expected query or load`);
      }
      mode = value;
    } else if (arg.startsWith('--provider=')) {
      const value = arg.slice('--provider='.length);
      if (value !== 'hf-local' && value !== 'llama-cpp') {
        throw new Error(`Invalid --provider=${value}; expected hf-local or llama-cpp`);
      }
      provider = value;
    } else if (arg.startsWith('--iterations=')) {
      const parsed = Number.parseInt(arg.slice('--iterations='.length), 10);
      if (Number.isFinite(parsed) && parsed > 0) {
        iterations = parsed;
      }
    }
  }

  return { mode, provider, iterations };
}

function percentile(sorted: number[], percentileValue: number): number {
  const index = Math.min(
    sorted.length - 1,
    Math.max(0, Math.ceil((percentileValue / 100) * sorted.length) - 1),
  );
  return sorted[index];
}

function rssMb(): number {
  return Number((process.memoryUsage().rss / 1024 / 1024).toFixed(3));
}

function createProvider(provider: ProviderName): IEmbeddingProvider {
  if (provider === 'llama-cpp') {
    return new LlamaCppProvider({
      modelPath: process.env.LLAMA_CPP_EMBEDDINGS_MODEL_PATH || DEFAULT_LLAMA_MODEL_PATH,
      timeout: 60000,
      maxTextLength: 700,
    });
  }

  return new HfLocalProvider({
    model: 'onnx-community/embeddinggemma-300m-ONNX',
    dim: 768,
    dtype: 'q8',
    timeout: 60000,
    maxTextLength: 700,
  });
}

async function commandExists(command: string): Promise<boolean> {
  const child = spawn('sh', ['-lc', `command -v ${command}`], {
    stdio: 'ignore',
  });
  return await new Promise((resolve) => {
    child.on('exit', (code) => resolve(code === 0));
    child.on('error', () => resolve(false));
  });
}

async function startPowerMetrics(): Promise<{ stop: () => Promise<number | null>; note: string }> {
  if (!(await commandExists('powermetrics'))) {
    return {
      stop: async () => null,
      note: 'powermetrics unavailable',
    };
  }

  const sudoOk = await new Promise<boolean>((resolve) => {
    const child = spawn('sudo', ['-n', 'true'], { stdio: 'ignore' });
    child.on('exit', (code) => resolve(code === 0));
    child.on('error', () => resolve(false));
  });
  if (!sudoOk) {
    return {
      stop: async () => null,
      note: 'powermetrics requires sudo',
    };
  }

  const outputPath = path.join(__dirname, `powermetrics-${process.pid}.txt`);
  const output = fs.openSync(outputPath, 'w');
  const child = spawn('sudo', [
    '-n',
    'powermetrics',
    '--samplers',
    'cpu_power,gpu_power',
    '-i',
    '1000',
    '-n',
    '20',
  ], {
    stdio: ['ignore', output, output],
  });

  return {
    note: `powermetrics captured at ${outputPath}`,
    stop: async () => {
      child.kill('SIGINT');
      fs.closeSync(output);
      await new Promise((resolve) => child.once('close', resolve));
      const text = fs.existsSync(outputPath) ? fs.readFileSync(outputPath, 'utf8') : '';
      const watts = Array.from(text.matchAll(/([0-9]+(?:\.[0-9]+)?)\s*W/g))
        .map((match) => Number(match[1]))
        .filter((value) => Number.isFinite(value));
      return watts.length > 0 ? Math.max(...watts) : null;
    },
  };
}

function appendResult(row: BenchRow): void {
  const existing = fs.existsSync(RESULTS_PATH)
    ? JSON.parse(fs.readFileSync(RESULTS_PATH, 'utf8')) as BenchRow[]
    : [];
  existing.push(row);
  fs.writeFileSync(RESULTS_PATH, `${JSON.stringify(existing, null, 2)}\n`);
}

async function run(): Promise<void> {
  const { mode, provider: providerName, iterations } = parseArgs();
  const provider = createProvider(providerName);
  const metadata = provider.getMetadata();
  const power = await startPowerMetrics();

  if (mode === 'load') {
    const started = performance.now();
    const ok = await provider.warmup();
    if (!ok) {
      throw new Error(`${providerName} warmup failed`);
    }
    const row: BenchRow = {
      provider: providerName,
      mode,
      model: metadata.model,
      model_path: providerName === 'llama-cpp'
        ? (process.env.LLAMA_CPP_EMBEDDINGS_MODEL_PATH || DEFAULT_LLAMA_MODEL_PATH)
        : undefined,
      load_seconds: Number(((performance.now() - started) / 1000).toFixed(6)),
      rss_mb: rssMb(),
      peak_watts: await power.stop(),
      power_note: power.note,
      recorded_at: new Date().toISOString(),
    };
    appendResult(row);
    console.log(JSON.stringify(row, null, 2));
    return;
  }

  const warmupIterations = 20;
  for (let index = 0; index < warmupIterations; index += 1) {
    await provider.embedQuery(QUERY_TEXT);
  }

  const timings: number[] = [];
  for (let index = 0; index < iterations; index += 1) {
    const started = performance.now();
    await provider.embedQuery(QUERY_TEXT);
    timings.push(performance.now() - started);
  }

  timings.sort((left, right) => left - right);
  const row: BenchRow = {
    provider: providerName,
    mode,
    model: metadata.model,
    model_path: providerName === 'llama-cpp'
      ? (process.env.LLAMA_CPP_EMBEDDINGS_MODEL_PATH || DEFAULT_LLAMA_MODEL_PATH)
      : undefined,
    iterations,
    warmup_iterations: warmupIterations,
    p50_ms: Number(percentile(timings, 50).toFixed(6)),
    p95_ms: Number(percentile(timings, 95).toFixed(6)),
    p99_ms: Number(percentile(timings, 99).toFixed(6)),
    mean_ms: Number((timings.reduce((sum, value) => sum + value, 0) / timings.length).toFixed(6)),
    rss_mb: rssMb(),
    peak_watts: await power.stop(),
    power_note: power.note,
    recorded_at: new Date().toISOString(),
  };
  appendResult(row);
  console.log(JSON.stringify(row, null, 2));
}

await run();

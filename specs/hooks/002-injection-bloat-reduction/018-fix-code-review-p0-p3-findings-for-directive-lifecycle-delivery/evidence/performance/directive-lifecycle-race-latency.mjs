#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// MODULE: Directive Lifecycle Race And Latency Probe
// ───────────────────────────────────────────────────────────────

import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { performance } from 'node:perf_hooks';

const scriptPath = fileURLToPath(import.meta.url);
const lifecyclePath = join(process.cwd(), '.opencode/skills/system-skill-advisor/mcp-server/dist/hooks/lib/directive-lifecycle.js');
const helperPath = join(process.cwd(), '.opencode/skills/system-skill-advisor/hooks/lib/directive-lifecycle-store.py');
const lifecycle = await import(pathToFileURL(lifecyclePath).href);
const FULL = 'Advisor: live; use sk-code 0.91/0.23 pass.\nDirectives:\n- Comment hygiene';
const FILE_STORE_P99_BUDGET_MS = 100;

function recordFor(store, bytes) {
  return {
    schemaVersion: lifecycle.DIRECTIVE_LIFECYCLE_SCHEMA_VERSION,
    directives: '\nDirectives:\n- Comment hygiene',
    transcriptPath: '/sessions/race.jsonl',
    transcriptHighWaterBytes: bytes,
    ...store.clock('race-session'),
  };
}

if (process.argv[2] === '--worker') {
  const store = new lifecycle.FileDirectiveLifecycleStore({ baseDir: process.argv[3] });
  const bytes = Number(process.argv[4]);
  const success = store.set('race-session', recordFor(store, bytes));
  if (success) process.stdout.write(String(bytes));
  process.exit(success ? 0 : 2);
}

function percentile(samples, ratio) {
  const sorted = [...samples].sort((left, right) => left - right);
  return Number((sorted[Math.max(0, Math.ceil(sorted.length * ratio) - 1)] ?? 0).toFixed(3));
}

function summary(samples) {
  return {
    count: samples.length,
    p50Ms: percentile(samples, 0.5),
    p95Ms: percentile(samples, 0.95),
    p99Ms: percentile(samples, 0.99),
    maxMs: Number(Math.max(...samples).toFixed(3)),
  };
}

async function race(baseDir) {
  const script = fileURLToPath(import.meta.url);
  const submitted = Array.from({ length: 16 }, (_, index) => (index + 1) * 100);
  const outcomes = await Promise.all(submitted.map((bytes) => new Promise((resolvePromise) => {
    const child = spawn(process.execPath, [script, '--worker', baseDir, String(bytes)], {
      cwd: process.cwd(),
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    let stdout = '';
    child.stdout.on('data', (chunk) => { stdout += String(chunk); });
    child.on('close', (code) => resolvePromise({ bytes, code, written: Number(stdout) || null }));
  })));
  const successful = outcomes.filter((outcome) => outcome.code === 0).map((outcome) => outcome.bytes);
  const store = new lifecycle.FileDirectiveLifecycleStore({ baseDir });
  const finalRecord = store.get('race-session');
  const residue = readdirSync(baseDir, { recursive: true })
    .map(String)
    .filter((name) => (name.includes('.lock') && !name.endsWith('.store.lock'))
      || name.includes('directive-lifecycle-tmp'));
  return {
    submitted,
    successful,
    contentionCount: outcomes.filter((outcome) => outcome.code === 2).length,
    finalHighWaterBytes: finalRecord?.transcriptHighWaterBytes ?? null,
    expectedHighWaterBytes: successful.length > 0 ? Math.max(...successful) : null,
    residue,
  };
}

const baseDir = mkdtempSync(join(tmpdir(), 'directive-race-latency-'));
try {
  const memoryStore = new lifecycle.InMemoryDirectiveLifecycleStore();
  const memorySamples = [];
  for (let index = 0; index < 1_000; index += 1) {
    const started = performance.now();
    lifecycle.decideDirectiveLifecycleDelivery(FULL, {
      state: memoryStore,
      sessionId: 'latency-session',
      sessionConfirmed: true,
      transcriptPath: '/sessions/latency.jsonl',
      transcriptBytes: index + 1,
    });
    memorySamples.push(performance.now() - started);
  }

  const fileStore = new lifecycle.FileDirectiveLifecycleStore({ baseDir });
  const fileSamples = [];
  for (let index = 0; index < 100; index += 1) {
    const started = performance.now();
    lifecycle.decideDirectiveLifecycleDelivery(FULL, {
      state: fileStore,
      sessionId: 'latency-session',
      sessionConfirmed: true,
      transcriptPath: '/sessions/latency.jsonl',
      transcriptBytes: index + 1,
    });
    fileSamples.push(performance.now() - started);
  }

  const raceResult = await race(baseDir);
  let baseline = null;
  try {
    const previous = JSON.parse(readFileSync(join(dirname(scriptPath), 'result.json'), 'utf8'));
    baseline = {
      path: relative(process.cwd(), join(dirname(scriptPath), 'result.json')),
      fileStoreP99Ms: previous.fileStoreSetGet?.p99Ms ?? null,
    };
  } catch {
    baseline = null;
  }
  const digest = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');
  const fileStoreSetGet = summary(fileSamples);
  const result = {
    capturedAt: new Date().toISOString(),
    command: `node ${relative(process.cwd(), scriptPath)}`,
    nodeVersion: process.version,
    platform: `${process.platform}-${process.arch}`,
    sourceHashes: {
      harness: { path: relative(process.cwd(), scriptPath), sha256: digest(scriptPath) },
      lifecycleDist: { path: relative(process.cwd(), lifecyclePath), sha256: digest(lifecyclePath) },
      helper: { path: relative(process.cwd(), helperPath), sha256: digest(helperPath) },
    },
    baseline,
    inMemory: summary(memorySamples),
    fileStoreSetGet: {
      ...fileStoreSetGet,
      budgetMs: FILE_STORE_P99_BUDGET_MS,
    },
    fileStoreP99DeltaMs: baseline?.fileStoreP99Ms == null
      ? null
      : Number((fileStoreSetGet.p99Ms - baseline.fileStoreP99Ms).toFixed(3)),
    race: raceResult,
  };
  const passed = result.inMemory.p99Ms <= 5
    && result.fileStoreSetGet.p99Ms <= FILE_STORE_P99_BUDGET_MS
    && raceResult.successful.length > 0
    && raceResult.finalHighWaterBytes === raceResult.expectedHighWaterBytes
    && raceResult.residue.length === 0;
  process.stdout.write(`${JSON.stringify({ ...result, passed }, null, 2)}\n`);
  process.exitCode = passed ? 0 : 1;
} finally {
  rmSync(baseDir, { recursive: true, force: true });
}

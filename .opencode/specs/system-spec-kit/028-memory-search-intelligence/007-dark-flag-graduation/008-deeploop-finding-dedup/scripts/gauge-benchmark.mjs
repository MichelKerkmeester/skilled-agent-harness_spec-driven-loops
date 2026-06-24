#!/usr/bin/env node

// ───────────────────────────────────────────────────────────────
// MODULE: Fan-Out Lag-Ceiling and Progress-Heartbeat Gauge Benchmark
// Usage:
//   node gauge-benchmark.mjs
//
// Assesses the two operational gauges that ship default-off alongside the dedup:
//   - lag-ceiling (fanout-pool.cjs): a one-shot lag_ceiling_exceeded warning when
//     the oldest pending lineage waits longer than lagCeilingMs. Default 0 = off.
//   - progress-heartbeat (fanout-run.cjs): a per-lineage progress event emitted at a
//     fixed cadence while a long lineage runs. Default 0 = off.
//
// The question is not precision/recall but operational value: do the signals fire at
// a useful cadence without flooding, and are they byte-silent when off.
//
// Method:
//   Lag-ceiling drives the SAME exported runCappedPool the production pool uses. Run a
//   small pool whose worker is slower than the ceiling and count how many
//   lag_ceiling_exceeded events fire (the contract is exactly one per pool run).
//   Re-run with the ceiling at the default 0 and confirm zero events.
//
//   Progress-heartbeat drives the REAL production CLI fanout-run.cjs with a sleeping
//   stub executor and a progressHeartbeatSeconds config, then reads the actual
//   orchestration-status.log the runner writes. This is the production path the
//   runtime takes; the helper cannot be imported in isolation because the module runs
//   its CLI main on load, so we exercise it through the CLI exactly as the runtime
//   does. Re-run with the cadence left disabled (the default) and confirm zero
//   progress records.
//
// Safety:
//   Drives the exported pool helper, a temp ledger, and a spawned copy of the
//   production runner against temp dirs and a sleeping stub binary, all under the OS
//   temp dir and removed at the end. Opens no corpus, graph, or database. Writes
//   results only to results/ inside this phase folder. Never sets a default and never
//   flips a flag.
// ───────────────────────────────────────────────────────────────

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const HERE = path.dirname(fileURLToPath(import.meta.url));
const RESULTS_DIR = path.join(HERE, '..', 'results');
const RUNTIME_ROOT = path.resolve(HERE, '../../../../../../skills/deep-loop-runtime');
const POOL_MODULE = path.join(RUNTIME_ROOT, 'scripts', 'fanout-pool.cjs');
const RUN_MODULE = path.join(RUNTIME_ROOT, 'scripts', 'fanout-run.cjs');

const { runCappedPool } = require(POOL_MODULE);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ───────────────────────────────────────────────────────────────
// 1. LAG-CEILING GAUGE  (via exported runCappedPool)
// ───────────────────────────────────────────────────────────────
//
// Five lineages, concurrency 1, each worker takes ~40ms. With a ceiling of 60ms the
// oldest pending item crosses the ceiling while later items still wait, so the
// one-shot warning should fire exactly once. With the default ceiling of 0 the gauge
// is off and must fire zero events.

async function runLagCeiling({ lagCeilingMs }) {
  const events = [];
  const items = Array.from({ length: 5 }, (_, i) => ({ label: `lin-${i}` }));
  await runCappedPool({
    items,
    concurrency: 1,
    lagCeilingMs,
    worker: async () => {
      await sleep(40);
      return { ok: true };
    },
    onEvent: (event) => {
      if (event.event === 'lag_ceiling_exceeded') events.push(event);
    },
  });
  return events;
}

async function lagCeilingCase() {
  const onEvents = await runLagCeiling({ lagCeilingMs: 60 });
  const offEvents = await runLagCeiling({ lagCeilingMs: 0 });

  const fired = onEvents.length;
  const oneShot = fired === 1; // the contract: at most one warning per pool run
  const silentWhenOff = offEvents.length === 0;
  const carriesGauges = fired > 0 && onEvents[0].gauges && typeof onEvents[0].oldest_pending_lag_ms === 'number';
  const isWarningSeverity = fired > 0 && onEvents[0].severity === 'warning';

  return {
    ceilingMsUnderTest: 60,
    workerMsPerItem: 40,
    lineageCount: 5,
    eventsWhenOn: fired,
    oneShotNoFlood: oneShot,
    eventsWhenOff: offEvents.length,
    silentWhenDefaultOff: silentWhenOff,
    eventCarriesLagGauges: Boolean(carriesGauges),
    eventSeverityWarning: Boolean(isWarningSeverity),
    sampleEvent: fired > 0 ? { event: onEvents[0].event, severity: onEvents[0].severity, lag_ceiling_ms: onEvents[0].lag_ceiling_ms, oldest_pending_lag_ms: onEvents[0].oldest_pending_lag_ms } : null,
  };
}

// ───────────────────────────────────────────────────────────────
// 2. PROGRESS-HEARTBEAT GAUGE  (via the real production CLI)
// ───────────────────────────────────────────────────────────────

function mkTempDir(prefix) {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

function writeSleepingStub(binDir, name, seconds) {
  const stubPath = path.join(binDir, name);
  fs.writeFileSync(stubPath, `#!/bin/sh\nsleep ${seconds}\necho "slept"\nexit 0\n`, { mode: 0o755 });
}

function spawnRunner(args, env, timeoutMs) {
  return new Promise((resolvePromise) => {
    const child = spawn(process.execPath, [RUN_MODULE, ...args], { env, stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    const timer = setTimeout(() => child.kill('SIGTERM'), timeoutMs);
    child.stdout.on('data', (d) => { stdout += d; });
    child.stderr.on('data', (d) => { stderr += d; });
    child.on('close', (code) => {
      clearTimeout(timer);
      resolvePromise({ code, stdout, stderr });
    });
  });
}

function readProgressRecords(ledgerPath) {
  if (!fs.existsSync(ledgerPath)) return [];
  return fs
    .readFileSync(ledgerPath, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((line) => { try { return JSON.parse(line); } catch { return null; } })
    .filter((r) => r && r.event === 'progress');
}

async function runHeartbeatCli({ heartbeatSeconds, sleepSeconds }) {
  const binDir = mkTempDir('fanout-gauge-bin-');
  const baseDir = mkTempDir('fanout-gauge-base-');
  writeSleepingStub(binDir, 'codex', sleepSeconds);

  const config = { executors: [{ label: 'slow', kind: 'cli-codex', model: 'o4-mini', count: 1 }], concurrency: 1 };
  if (heartbeatSeconds > 0) config.progressHeartbeatSeconds = heartbeatSeconds;

  const env = { ...process.env, PATH: `${binDir}:${process.env.PATH ?? ''}` };
  await spawnRunner(
    [
      '--spec-folder', 'specs/gauge-bench-heartbeat',
      '--loop-type', 'research',
      '--fanout-config-json', JSON.stringify(config),
      '--base-artifact-dir', baseDir,
    ],
    env,
    60_000,
  );

  const ledgerPath = path.join(baseDir, 'orchestration-status.log');
  const records = readProgressRecords(ledgerPath);
  fs.rmSync(binDir, { recursive: true, force: true });
  fs.rmSync(baseDir, { recursive: true, force: true });
  return records;
}

async function heartbeatCase() {
  // On: cadence 0.05s over a ~2s stub run. Expect a steady handful of records.
  const cadenceSeconds = 0.05;
  const sleepSeconds = 2;
  const onRecords = await runHeartbeatCli({ heartbeatSeconds: cadenceSeconds, sleepSeconds });

  // Default off: cadence left out of the config (production default 0). Same run.
  const offRecords = await runHeartbeatCli({ heartbeatSeconds: 0, sleepSeconds });

  const cadenceMs = cadenceSeconds * 1000;
  const expectedApprox = Math.floor((sleepSeconds * 1000) / cadenceMs);
  const firedCount = onRecords.length;
  // A useful cadence: fires more than once and does not wildly exceed the expected
  // count (not a flood, not silent). Generous upper band for timer jitter and startup.
  const steadyCadence = firedCount >= 2 && firedCount <= expectedApprox + 5;
  const carriesGauges = firedCount > 0 && onRecords[0].gauges && typeof onRecords[0].duration_ms === 'number';

  return {
    cadenceSeconds,
    stubSleepSeconds: sleepSeconds,
    defaultCadenceSeconds: 0,
    silentWhenDefaultOff: offRecords.length === 0,
    expectedApproxRecords: expectedApprox,
    recordsWhenOn: firedCount,
    steadyCadenceNoFlood: steadyCadence,
    recordCarriesGauges: Boolean(carriesGauges),
    sampleRecord: firedCount > 0 ? { event: onRecords[0].event, label: onRecords[0].label, hasDurationMs: typeof onRecords[0].duration_ms === 'number', hasGauges: Boolean(onRecords[0].gauges) } : null,
  };
}

// ───────────────────────────────────────────────────────────────
// 3. RUN
// ───────────────────────────────────────────────────────────────

const lag = await lagCeilingCase();
const heartbeat = await heartbeatCase();

const out = {
  benchmark: 'fanout-gauges',
  gauges: ['lag-ceiling', 'progress-heartbeat'],
  defaults: { lagCeilingMs: 0, progressHeartbeatSeconds: 0 },
  generatedAt: new Date().toISOString().slice(0, 10),
  lagCeiling: lag,
  progressHeartbeat: heartbeat,
  verdict: {
    lagCeilingFiresUsefullyWhenOn: lag.oneShotNoFlood && lag.eventCarriesLagGauges,
    lagCeilingSilentWhenOff: lag.silentWhenDefaultOff,
    heartbeatFiresUsefullyWhenOn: heartbeat.steadyCadenceNoFlood && heartbeat.recordCarriesGauges,
    heartbeatSilentWhenOff: heartbeat.silentWhenDefaultOff,
  },
};

fs.mkdirSync(RESULTS_DIR, { recursive: true });
fs.writeFileSync(path.join(RESULTS_DIR, 'gauge-metrics.json'), `${JSON.stringify(out, null, 2)}\n`);

console.log(JSON.stringify(out, null, 2));

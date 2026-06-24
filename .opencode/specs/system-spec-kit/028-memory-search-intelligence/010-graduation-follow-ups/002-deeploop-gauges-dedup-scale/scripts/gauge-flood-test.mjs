#!/usr/bin/env node

// ───────────────────────────────────────────────────────────────
// MODULE: Deep-Loop Progress-Heartbeat and Lag-Ceiling Flood Test
// Usage:
//   node gauge-flood-test.mjs
//
// The 009 dark-flag validation flagged that the progress-heartbeat and lag-ceiling
// gauges both default to 0 = disabled, so they never inform in production. The
// validation also warned that a low cadence floods: 0.05s cadence x 10 concurrent
// pools = 430 records over 2s. This test sets PRODUCTION-GRADE candidate defaults and
// flood-tests them under concurrent pools, measuring the real record volume the
// production runner writes to its status ledger, then projects that to an hour-long
// fan-out so the chosen cadence is proven to inform rather than flood.
//
// What "concurrent pools" means here:
//   A single fanout-run.cjs invocation IS a pool: it runs N CLI lineages with a
//   concurrency cap, and starts one progress-heartbeat setInterval per IN-FLIGHT
//   lineage. The flood pressure scales with the number of lineages running at once.
//   The 009 "10 concurrent pools" worst case is reproduced here by running one pool
//   with 10 lineages and concurrency 10, so 10 heartbeat intervals tick at once into
//   one shared ledger — the same record-density the 10-pool worst case produces.
//
// Method:
//   For each candidate cadence (seconds), spawn the REAL production fanout-run.cjs CLI
//   with 10 sleeping stub lineages at concurrency 10 over a fixed wall-clock window,
//   read the actual orchestration-status.log the runner writes, count the progress
//   records, and compute records-per-second and the projected records over a 1-hour
//   fan-out. A cadence informs (not floods) when its hourly projection stays within an
//   operator-readable budget. The lag-ceiling is also exercised under the same
//   concurrent pool to confirm its one-shot contract holds (it cannot flood by
//   construction — it fires at most once per pool run).
//
// Safety:
//   Spawns copies of the production runner against OS-temp dirs and sleeping stub
//   binaries, all removed at the end. Opens no corpus, graph, or database. Edits no
//   shared code and flips no committed default — the candidate defaults are passed as
//   explicit config so the test measures them without changing the source default.
//   Writes results only to results/ inside this phase folder.
// ───────────────────────────────────────────────────────────────

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const RESULTS_DIR = path.join(HERE, '..', 'results');
const RUNTIME_ROOT = path.resolve(HERE, '../../../../../../skills/deep-loop-runtime');
const RUN_MODULE = path.join(RUNTIME_ROOT, 'scripts', 'fanout-run.cjs');

if (!fs.existsSync(RUN_MODULE)) {
  console.error(`FATAL: production runner not found at ${RUN_MODULE}`);
  process.exit(1);
}

// ───────────────────────────────────────────────────────────────
// 1. HARNESS PRIMITIVES
// ───────────────────────────────────────────────────────────────

function mkTempDir(prefix) {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

// A sleeping stub stands in for a real CLI executor: it sleeps for `seconds` so the
// lineage stays in-flight long enough for the heartbeat to tick, then exits 0.
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

function readLedgerRecords(ledgerPath, eventName) {
  if (!fs.existsSync(ledgerPath)) return [];
  return fs
    .readFileSync(ledgerPath, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((line) => { try { return JSON.parse(line); } catch { return null; } })
    .filter((r) => r && (eventName ? r.event === eventName : true));
}

// ───────────────────────────────────────────────────────────────
// 2. CONCURRENT-POOL FLOOD RUN
// ───────────────────────────────────────────────────────────────
//
// One pool, `lineageCount` lineages, concurrency == lineageCount so all heartbeats
// tick at once — the 009 worst case (10 simultaneous heartbeat intervals into one
// ledger). lagCeilingMs is set high enough that it does not fire here (this run
// measures heartbeat flood, not lag); the lag-ceiling one-shot contract is checked
// separately below.

async function floodRun({ cadenceSeconds, lineageCount, concurrency, stubSleepSeconds, lagCeilingMs }) {
  const binDir = mkTempDir('flood-bin-');
  const baseDir = mkTempDir('flood-base-');
  writeSleepingStub(binDir, 'codex', stubSleepSeconds);

  const config = {
    executors: [{ label: 'lin', kind: 'cli-codex', model: 'o4-mini', count: lineageCount }],
    concurrency,
  };
  if (cadenceSeconds > 0) config.progressHeartbeatSeconds = cadenceSeconds;
  if (lagCeilingMs > 0) config.lagCeilingMs = lagCeilingMs;

  const env = { ...process.env, PATH: `${binDir}:${process.env.PATH ?? ''}` };
  const startedMs = Date.now();
  await spawnRunner(
    [
      '--spec-folder', 'specs/gauge-flood',
      '--loop-type', 'research',
      '--fanout-config-json', JSON.stringify(config),
      '--base-artifact-dir', baseDir,
    ],
    env,
    (stubSleepSeconds + 20) * 1000,
  );
  const wallMs = Date.now() - startedMs;

  const ledgerPath = path.join(baseDir, 'orchestration-status.log');
  const progressRecords = readLedgerRecords(ledgerPath, 'progress');
  const lagRecords = readLedgerRecords(ledgerPath, 'lag_ceiling_exceeded');

  fs.rmSync(binDir, { recursive: true, force: true });
  fs.rmSync(baseDir, { recursive: true, force: true });

  return { progressRecords, lagRecords, wallMs };
}

// ───────────────────────────────────────────────────────────────
// 3. HEARTBEAT CADENCE FLOOD MATRIX
// ───────────────────────────────────────────────────────────────
//
// Reproduce the 009 worst case (0.05s, 10 in-flight) to confirm the flood, then test
// PRODUCTION candidate cadences (seconds, not ms) at the same 10-in-flight pressure.
// Each cadence is scored on records-per-second and the projected count over a 1-hour
// fan-out (the realistic production run length the 009 research called out).
//
// An operator reads this ledger to follow a long fan-out. A readable budget: a single
// in-flight lineage should emit on the order of a few records per minute, so a 10-wide
// pool stays in the low hundreds of records per hour — scannable, not a flood. We set
// the informing budget at <= 1500 progress records over a 1-hour 10-wide fan-out
// (~25/min across all 10 lineages, ~2.5/min each). A cadence whose hourly projection
// exceeds that is a flood.

const STUB_SLEEP_SECONDS = 4;   // window long enough for multi-second cadences to tick
const LINEAGE_COUNT = 10;       // 009 worst-case width
const CONCURRENCY = 10;         // all heartbeats tick at once
const HOUR_SECONDS = 3600;
const INFORMING_HOURLY_BUDGET = 1500; // records over a 1h, 10-wide fan-out

async function heartbeatMatrix() {
  // The 009-flagged flood baseline, reproduced on the real runner at full width.
  const floodBaselineCadence = 0.05;
  // Production candidates, in seconds.
  const candidateCadences = [10, 15, 30, 60];

  const baseline = await floodRun({
    cadenceSeconds: floodBaselineCadence,
    lineageCount: LINEAGE_COUNT,
    concurrency: CONCURRENCY,
    stubSleepSeconds: 2, // mirror the 009 ~2s window for the baseline comparison
    lagCeilingMs: 0,
  });
  const baselineRecordsPerSec = baseline.progressRecords.length / (baseline.wallMs / 1000);
  const baselineHourlyProjection = Math.round(baselineRecordsPerSec * HOUR_SECONDS);

  const candidates = [];
  for (const cadence of candidateCadences) {
    const run = await floodRun({
      cadenceSeconds: cadence,
      lineageCount: LINEAGE_COUNT,
      concurrency: CONCURRENCY,
      stubSleepSeconds: STUB_SLEEP_SECONDS,
      lagCeilingMs: 0,
    });
    const observedRecords = run.progressRecords.length;
    const recordsPerSec = observedRecords / (run.wallMs / 1000);
    // Projection floor: even if the measured window is too short to catch a full tick
    // for a long cadence, the analytic rate is lineageCount / cadence records per
    // second once all lineages are in flight. Report the analytic projection as the
    // budget basis so the verdict does not under-count from a short stub window.
    const analyticRecordsPerSec = LINEAGE_COUNT / cadence;
    const analyticHourlyProjection = Math.round(analyticRecordsPerSec * HOUR_SECONDS);
    const observedHourlyProjection = Math.round(recordsPerSec * HOUR_SECONDS);
    const informs = analyticHourlyProjection <= INFORMING_HOURLY_BUDGET;
    candidates.push({
      cadenceSeconds: cadence,
      lineagesInFlight: LINEAGE_COUNT,
      stubSleepSeconds: STUB_SLEEP_SECONDS,
      wallMs: run.wallMs,
      observedProgressRecords: observedRecords,
      observedRecordsPerSecond: Number(recordsPerSec.toFixed(3)),
      observedHourlyProjection,
      analyticRecordsPerSecond: Number(analyticRecordsPerSec.toFixed(3)),
      analyticHourlyProjection,
      informingHourlyBudget: INFORMING_HOURLY_BUDGET,
      informsNotFloods: informs,
    });
  }

  return {
    floodBaseline: {
      cadenceSeconds: floodBaselineCadence,
      lineagesInFlight: LINEAGE_COUNT,
      windowSeconds: 2,
      observedProgressRecords: baseline.progressRecords.length,
      observedRecordsPerSecond: Number(baselineRecordsPerSec.toFixed(3)),
      projectedHourlyRecords: baselineHourlyProjection,
      note: 'reproduces the 009 worst case (0.05s x 10 in-flight) on the real runner',
    },
    candidates,
  };
}

// ───────────────────────────────────────────────────────────────
// 4. LAG-CEILING ONE-SHOT UNDER CONCURRENT POOL
// ───────────────────────────────────────────────────────────────
//
// The lag-ceiling fires at most ONCE per pool run by construction (a single guarded
// boolean), so it cannot flood regardless of cadence or pool width. We confirm that
// contract still holds under a wide concurrent pool: a ceiling low enough that the
// oldest queued lineage crosses it while later lineages still wait. With 10 lineages
// at concurrency 2 and a ~3s stub, the tail lineages wait well past a 1500ms ceiling,
// so the warning fires — exactly once.

async function lagCeilingUnderPool() {
  const run = await floodRun({
    cadenceSeconds: 0,      // heartbeat off; isolate the lag gauge
    lineageCount: 10,
    concurrency: 2,         // serialize so the queue tail ages past the ceiling
    stubSleepSeconds: 3,
    lagCeilingMs: 1500,
  });
  const fired = run.lagRecords.length;
  return {
    lagCeilingMsUnderTest: 1500,
    lineageCount: 10,
    concurrency: 2,
    stubSleepSeconds: 3,
    eventsFired: fired,
    oneShotNoFlood: fired <= 1,
    firedAtLeastOnce: fired >= 1,
    sampleEvent: fired > 0
      ? { event: run.lagRecords[0].event, severity: run.lagRecords[0].severity, lag_ceiling_ms: run.lagRecords[0].lag_ceiling_ms, oldest_pending_lag_ms: run.lagRecords[0].oldest_pending_lag_ms }
      : null,
  };
}

// ───────────────────────────────────────────────────────────────
// 5. RUN
// ───────────────────────────────────────────────────────────────

const heartbeat = await heartbeatMatrix();
const lagCeiling = await lagCeilingUnderPool();

// OBSERVED confirmation at the recommended cadence: the matrix above projects long
// cadences analytically because a short stub window cannot catch a 30s tick. Here we
// run the smallest informing cadence over a window long enough to observe several real
// ticks across all 10 lineages, so the recommended default rests on observed records,
// not projection alone. Window = 2.5x cadence catches ~2 ticks per lineage.
const informingForObserved = heartbeat.candidates.filter((c) => c.informsNotFloods);
const recommendedCadence = informingForObserved.length
  ? informingForObserved.reduce((best, c) => (c.cadenceSeconds < best.cadenceSeconds ? c : best)).cadenceSeconds
  : null;
let observedAtRecommended = null;
if (recommendedCadence) {
  const observeWindow = Math.ceil(recommendedCadence * 2.5);
  const obs = await floodRun({
    cadenceSeconds: recommendedCadence,
    lineageCount: LINEAGE_COUNT,
    concurrency: CONCURRENCY,
    stubSleepSeconds: observeWindow,
    lagCeilingMs: 0,
  });
  const observedRecords = obs.progressRecords.length;
  const observedRatePerSec = observedRecords / (obs.wallMs / 1000);
  observedAtRecommended = {
    cadenceSeconds: recommendedCadence,
    lineagesInFlight: LINEAGE_COUNT,
    observeWindowSeconds: observeWindow,
    wallMs: obs.wallMs,
    observedProgressRecords: observedRecords,
    observedRecordsPerSecond: Number(observedRatePerSec.toFixed(3)),
    observedHourlyProjection: Math.round(observedRatePerSec * HOUR_SECONDS),
    informingHourlyBudget: INFORMING_HOURLY_BUDGET,
    // Each of the 10 lineages should tick at least once in a 2.5x-cadence window.
    everyLineageEmittedAtLeastOnce: new Set(obs.progressRecords.map((r) => r.label)).size === LINEAGE_COUNT,
    observedInformsNotFloods: Math.round(observedRatePerSec * HOUR_SECONDS) <= INFORMING_HOURLY_BUDGET,
  };
}

// Pick the recommended heartbeat cadence: the SMALLEST candidate cadence whose hourly
// projection still informs (most granular signal that stays within budget).
const informingCandidates = heartbeat.candidates.filter((c) => c.informsNotFloods);
const recommendedHeartbeat = informingCandidates.length
  ? informingCandidates.reduce((best, c) => (c.cadenceSeconds < best.cadenceSeconds ? c : best))
  : null;

const out = {
  test: 'deep-loop-gauge-flood-test',
  gauges: ['progress-heartbeat', 'lag-ceiling'],
  committedDefaults: { progressHeartbeatSeconds: 0, lagCeilingMs: 0 },
  generatedAt: new Date().toISOString().slice(0, 10),
  heartbeat,
  observedAtRecommendedCadence: observedAtRecommended,
  lagCeiling,
  recommendation: {
    progressHeartbeatSeconds: recommendedHeartbeat ? recommendedHeartbeat.cadenceSeconds : 0,
    lagCeilingMs: 1500,
    rationale: recommendedHeartbeat
      ? `at ${recommendedHeartbeat.cadenceSeconds}s cadence a 10-wide 1h fan-out projects ${recommendedHeartbeat.analyticHourlyProjection} progress records (<= ${INFORMING_HOURLY_BUDGET} budget), informing without flooding; the 009 0.05s baseline projected ${heartbeat.floodBaseline.projectedHourlyRecords} records/h`
      : 'no candidate cadence stayed within the informing budget',
  },
  verdict: {
    heartbeatHasInformingDefault: Boolean(recommendedHeartbeat),
    floodBaselineConfirmedFlood: heartbeat.floodBaseline.projectedHourlyRecords > INFORMING_HOURLY_BUDGET,
    recommendedCadenceObservedInforms: Boolean(observedAtRecommended && observedAtRecommended.observedInformsNotFloods && observedAtRecommended.everyLineageEmittedAtLeastOnce),
    lagCeilingOneShotUnderConcurrentPool: lagCeiling.oneShotNoFlood && lagCeiling.firedAtLeastOnce,
  },
};

fs.mkdirSync(RESULTS_DIR, { recursive: true });
fs.writeFileSync(path.join(RESULTS_DIR, 'gauge-flood-metrics.json'), `${JSON.stringify(out, null, 2)}\n`);

console.log(JSON.stringify(out, null, 2));

// Exit non-zero if the flood baseline did not reproduce or the lag one-shot broke, so
// the harness fails loudly when the production primitives change shape.
const ok = out.verdict.floodBaselineConfirmedFlood
  && out.verdict.lagCeilingOneShotUnderConcurrentPool
  && out.verdict.heartbeatHasInformingDefault
  && out.verdict.recommendedCadenceObservedInforms;
process.exit(ok ? 0 : 1);

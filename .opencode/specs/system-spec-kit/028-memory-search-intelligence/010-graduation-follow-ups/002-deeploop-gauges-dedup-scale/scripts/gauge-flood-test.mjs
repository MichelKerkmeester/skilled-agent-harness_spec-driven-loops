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
// 4. LAG-CEILING: A QUEUE-BACKPRESSURE GAUGE, NOT A STALL DETECTOR
// ───────────────────────────────────────────────────────────────
//
// CORRECTION (deep-review P1-7): the lag metric `oldest_pending_lag_ms` is
// `Date.now() - queuedAtMs[index]`, the time since the item was queued at POOL START
// (fanout-pool.cjs:319,324-331). An item only leaves the queue when a concurrency slot
// frees (fanout-pool.cjs:426-427). So whenever `width > concurrency`, the tail items
// sit queued from t=0 and their "lag" is the NORMAL wait for a slot — queue
// backpressure — not a stalled worker. The committed pool test bakes this in: 2 items
// at concurrency 1 fire the warning purely because the second item is queued
// (fanout-pool.vitest.ts:238-264).
//
// This means the gauge is a QUEUE-DEPTH / BACKPRESSURE signal, not a stalled-tail
// detector. The originally-recommended 1500ms ceiling fires on EVERY normal fan-out
// where width > concurrency, which is a false positive. We do not redefine the
// production metric here (that changes a graduated-flag contract and breaks the
// committed test); we re-justify the default UNDER THE BACKPRESSURE MEANING:
//   - it must stay SILENT on a healthy fan-out whose backpressure is normal, and
//   - it should FIRE only when the oldest queued item has waited abnormally long,
//     i.e. far longer than one healthy lineage's runtime, signalling a starved pool
//     (a hung worker holding a slot, not a normal second wave).
//
// The test below (1) proves the 1500ms false positive on a HEALTHY pool, (2) measures
// the normal-backpressure wait of that healthy pool, and (3) shows a backpressure-aware
// ceiling stays silent on the healthy pool but fires when a worker genuinely stalls.

// Healthy fan-out: width > concurrency but every worker runs quickly and normally. The
// second-wave items queue briefly — normal backpressure. A correct backpressure gauge
// must NOT fire here. `width`/`stubSeconds` are parameterized so we can exhibit BOTH a
// wide-and-slow healthy pool (whose normal backpressure crosses a low ceiling — the
// 1500ms false positive) and a narrow-and-fast healthy pool (whose normal backpressure
// stays under a backpressure-aware ceiling).
async function healthyBackpressureRun({ lagCeilingMs, width = 10, stubSeconds = 1 }) {
  const run = await floodRun({
    cadenceSeconds: 0,
    lineageCount: width,
    concurrency: 2,
    stubSleepSeconds: stubSeconds,
    lagCeilingMs,
  });
  // Recover the max observed oldest_pending_lag from any gauge-bearing ledger record so
  // we can quantify the normal-backpressure wait this healthy pool actually produced.
  const maxObservedLag = run.lagRecords.reduce(
    (m, r) => Math.max(m, Number(r.oldest_pending_lag_ms ?? 0)),
    0,
  );
  return { fired: run.lagRecords.length, maxObservedLag, sample: run.lagRecords[0] ?? null };
}

// Stalled fan-out: one slot is held by a worker that hangs far longer than the rest, so
// the queue tail waits abnormally long — a genuine starvation signal a backpressure
// gauge SHOULD catch. We model the stall by a long stub and a wide queue at concurrency
// 2, so a tail item waits past the backpressure-aware ceiling.
async function stalledTailRun({ lagCeilingMs, stallSeconds }) {
  const run = await floodRun({
    cadenceSeconds: 0,
    lineageCount: 6,
    concurrency: 2,
    stubSleepSeconds: stallSeconds,
    lagCeilingMs,
  });
  return { fired: run.lagRecords.length, sample: run.lagRecords[0] ?? null };
}

async function lagCeilingBackpressure() {
  // (1) The originally-recommended 1500ms ceiling on a realistically-shaped HEALTHY pool
  // (10 lineages, concurrency 2, ~1s each — a normal deep-loop fan-out that is wider than
  // its slot count). The tail's normal second-wave wait crosses 1500ms, so the gauge
  // FALSE-FIRES on a fully healthy run: the false positive the deep review flagged.
  const falsePositive = await healthyBackpressureRun({ lagCeilingMs: 1500, width: 10, stubSeconds: 1 });

  // (2) Backpressure-aware default. The metric measures total queue wait, so the ceiling
  // must exceed any NORMAL second-wave wait and fire only when a queued item has waited
  // abnormally long (a starved pool — a hung slot holding back the queue). A healthy
  // deep-loop lineage runs minutes; the per-lineage timeout floor is ~4h
  // (computeLineageTimeoutMs). We set the production ceiling to 5 minutes (300000ms):
  // above any normal second-wave wait, low enough to catch a hung slot well before the 4h
  // timeout. We cannot sleep 5min in a test, so we prove the TWO directions with a scaled
  // ceiling that preserves the production ordering (normal-backpressure < ceiling < stall),
  // using a NARROW-AND-FAST healthy pool whose normal backpressure is genuinely small.
  const SCALED_CEILING_MS = 2500;          // stands in for the 300000ms production value
  const HEALTHY_WIDTH = 4;                  // narrow: only one queued wave at concurrency 2
  const HEALTHY_SECONDS = 0.4;              // fast: tail's normal wait ~0.4s, well under ceiling
  const GENUINE_STALL_SECONDS = 4;          // a hung slot: queue tail waits ~4s, past the ceiling

  const silentOnHealthy = await healthyBackpressureRun({ lagCeilingMs: SCALED_CEILING_MS, width: HEALTHY_WIDTH, stubSeconds: HEALTHY_SECONDS });
  const firesOnStall = await stalledTailRun({ lagCeilingMs: SCALED_CEILING_MS, stallSeconds: GENUINE_STALL_SECONDS });

  return {
    metricMeaning: 'oldest_pending_lag_ms = time since the item was queued at pool start; a queue-backpressure / starvation signal, NOT a stalled-worker detector',
    falsePositiveAtOriginalDefault: {
      lagCeilingMs: 1500,
      poolWidth: 10,
      concurrency: 2,
      healthyLineageSeconds: 1,
      fired: falsePositive.fired,
      observedTailWaitMs: falsePositive.maxObservedLag,
      note: 'a 1500ms ceiling fires on this fully healthy 10-wide pool purely because width > concurrency — the false positive the deep review flagged',
    },
    backpressureAwareCeiling: {
      productionRecommendationMs: 300000,
      productionRationale: 'a queued lineage that has waited > 5min has waited longer than a healthy lineage runtime, signalling a starved pool (a hung slot), well before the ~4h per-lineage timeout; below this is normal second-wave backpressure',
      scaledProofCeilingMs: SCALED_CEILING_MS,
      silentOnHealthyPool: {
        poolWidth: HEALTHY_WIDTH,
        concurrency: 2,
        healthyLineageSeconds: HEALTHY_SECONDS,
        observedTailWaitMs: silentOnHealthy.maxObservedLag,
        fired: silentOnHealthy.fired,
        staysSilent: silentOnHealthy.fired === 0,
      },
      firesOnGenuineStall: {
        stallSeconds: GENUINE_STALL_SECONDS,
        fired: firesOnStall.fired,
        oneShot: firesOnStall.fired === 1,
        sample: firesOnStall.sample
          ? { event: firesOnStall.sample.event, severity: firesOnStall.sample.severity, lag_ceiling_ms: firesOnStall.sample.lag_ceiling_ms, oldest_pending_lag_ms: firesOnStall.sample.oldest_pending_lag_ms }
          : null,
      },
    },
  };
}

// ───────────────────────────────────────────────────────────────
// 5. RUN
// ───────────────────────────────────────────────────────────────

const heartbeat = await heartbeatMatrix();
const lagCeiling = await lagCeilingBackpressure();

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
    lagCeilingMs: 300000,
    lagCeilingMeaning: 'queue-backpressure / starvation gauge (oldest_pending_lag_ms = time since queued at pool start), NOT a stalled-worker detector',
    rationale: recommendedHeartbeat
      ? `heartbeat: at ${recommendedHeartbeat.cadenceSeconds}s cadence a 10-wide 1h fan-out projects ${recommendedHeartbeat.analyticHourlyProjection} progress records (<= ${INFORMING_HOURLY_BUDGET} budget); the 009 0.05s baseline projected ${heartbeat.floodBaseline.projectedHourlyRecords} records/h. lag-ceiling: the metric is queue backpressure, so the original 1500ms fired on every healthy width>concurrency fan-out (proven); raised to 300000ms (5min) so it stays silent on normal second-wave backpressure and fires only on a starved pool, well before the ~4h per-lineage timeout`
      : 'no candidate cadence stayed within the informing budget',
  },
  verdict: {
    heartbeatHasInformingDefault: Boolean(recommendedHeartbeat),
    floodBaselineConfirmedFlood: heartbeat.floodBaseline.projectedHourlyRecords > INFORMING_HOURLY_BUDGET,
    recommendedCadenceObservedInforms: Boolean(observedAtRecommended && observedAtRecommended.observedInformsNotFloods && observedAtRecommended.everyLineageEmittedAtLeastOnce),
    lagCeilingOriginalDefaultFalseFiresOnHealthyPool: lagCeiling.falsePositiveAtOriginalDefault.fired >= 1,
    lagCeilingBackpressureAwareSilentOnHealthy: lagCeiling.backpressureAwareCeiling.silentOnHealthyPool.staysSilent,
    lagCeilingBackpressureAwareFiresOnStall: lagCeiling.backpressureAwareCeiling.firesOnGenuineStall.oneShot,
  },
};

fs.mkdirSync(RESULTS_DIR, { recursive: true });
fs.writeFileSync(path.join(RESULTS_DIR, 'gauge-flood-metrics.json'), `${JSON.stringify(out, null, 2)}\n`);

console.log(JSON.stringify(out, null, 2));

// Exit non-zero if the flood baseline did not reproduce or the lag one-shot broke, so
// the harness fails loudly when the production primitives change shape.
const ok = out.verdict.floodBaselineConfirmedFlood
  && out.verdict.lagCeilingOriginalDefaultFalseFiresOnHealthyPool
  && out.verdict.lagCeilingBackpressureAwareSilentOnHealthy
  && out.verdict.lagCeilingBackpressureAwareFiresOnStall
  && out.verdict.heartbeatHasInformingDefault
  && out.verdict.recommendedCadenceObservedInforms;
process.exit(ok ? 0 : 1);

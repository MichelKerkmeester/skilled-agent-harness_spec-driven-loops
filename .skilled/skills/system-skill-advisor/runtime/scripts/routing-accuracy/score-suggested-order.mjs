#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: SUGGESTED CLUSTER ORDER EVAL
// ───────────────────────────────────────────────────────────────────
//
// Measures, offline, whether a Jev or local Deem answer that orders the advisor's
// whole near-tie cluster beats the best zero-call order, with each call timed
// inside a child spawned the way the prompt shim spawns the advisor. The default
// run makes no model call. The script holds no credential and reads none.

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync, realpathSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { performance } from 'node:perf_hooks';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

import { alwaysSecondOrder, binomTail, classifyRow, confidenceOrder, deemGate, jevGate, loadCensus, readDeemHealth, reciprocalRank, reorderSlots, spawnCall, summarizeCensus, writeCall } from './score-jev-tiebreak.mjs';

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

export const ALPHA = 0.05;
export const MARGIN = 0.05;
export const ADVISOR_BUDGET_MS = 2200;
export const CHILD_TIMEOUT_MS = 2500;
export const MIN_MOVABLE = 5;
const CHOICE_QUESTION = 'Which skill should handle this request?';
const NONE_DESCRIPTION = 'None of these skills fits the request';
const PASSES = 3;
const DEEM_MAX_KEYS = 25;
const DEEM_CHOICE_P50_MS = 241;
const JEV_VERSION = '0.6.2';
const AUTH_TIMEOUT_MS = 30000;
const GATE_TIMEOUT_MS = 10000;
const KEEP_RULE_LINE = 'keep rule: coverage 10*M>=9*K, kill P(X>=L)<=0.05, margin 20*(SA-SB)>=M, sign test P(X>=W)<0.05, flips 10*F<=3*M, latency p95<=2200ms';

const SELF = fileURLToPath(import.meta.url);
const HERE = dirname(SELF);
const HOOK = resolve(HERE, '../../dist/hooks/claude/user-prompt-submit.js');

// ───────────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────────

/**
 * Nearest-rank quantile of a numeric sample; null when the sample is empty.
 * @param {number[]} values
 * @param {number} q
 * @returns {number|null}
 */
export function nearestRank(values, q) {
  if (values.length === 0) return null;
  const sorted = values.slice().sort((left, right) => left - right);
  return sorted[Math.ceil(q * sorted.length) - 1];
}

/**
 * The three left rotations of the keys.
 * @param {string[]} keys
 * @returns {string[][]}
 */
export function rotations(keys) {
  return [0, 1, 2].map((r) => [...keys.slice(r), ...keys.slice(0, r)]);
}

/**
 * Flat option args that label each key, disambiguating equal descriptions.
 * @param {string[]} keys
 * @param {(key: string) => string} describe
 * @param {string[]} cluster
 * @returns {string[]}
 */
export function optionArgs(keys, describe, cluster) {
  return keys.flatMap((key) => {
    if (key === 'none') return ['-o', `none=${NONE_DESCRIPTION}`];
    const text = describe(key);
    const clash = cluster.some((other) => other !== key && describe(other) === text);
    return ['-o', `${key}=${text}${clash ? ` [${key}]` : ''}`];
  });
}

/**
 * Probability map from a classifier answer on stdout, with the raw and full-coverage views.
 * @param {string} stdout
 * @param {string[]} keys
 * @returns {{ raw: Record<string, number>|null, full: Record<string, number>|null }}
 */
export function readProbabilities(stdout, keys) {
  let raw = null;
  try {
    const probabilities = JSON.parse(stdout).answers.answer.probabilities;
    if (probabilities !== null && typeof probabilities === 'object' && !Array.isArray(probabilities)) {
      raw = probabilities;
    }
  } catch {
    return { raw: null, full: null };
  }
  if (raw === null) return { raw: null, full: null };
  for (const key of keys) {
    const value = raw[key];
    if (typeof value !== 'number' || !Number.isFinite(value)) return { raw, full: null };
  }
  const full = {};
  for (const key of keys) full[key] = raw[key];
  return { raw, full };
}

/**
 * First key in keys order that holds the highest value.
 * @param {Record<string, number>} map
 * @param {string[]} keys
 * @returns {string}
 */
export function topKey(map, keys) {
  let best = keys[0];
  for (const key of keys) {
    if (map[key] > map[best]) best = key;
  }
  return best;
}

/**
 * Cluster order by mean probability across the passes; abstains when none leads.
 * @param {{ order: string[], cluster: string[] }} row
 * @param {Array<Record<string, number>>} maps
 * @returns {{ order: string[], abstained: boolean }}
 */
export function orderFromMaps(row, maps) {
  const mean = {};
  for (const key of [...row.cluster, 'none']) {
    mean[key] = maps.reduce((sum, map) => sum + map[key], 0) / maps.length;
  }
  if (row.cluster.every((key) => mean.none > mean[key])) {
    return { order: row.order.slice(), abstained: true };
  }
  const sorted = row.cluster.slice().sort((left, right) => mean[right] - mean[left]);
  return { order: reorderSlots(row.order, row.cluster, sorted), abstained: false };
}

/**
 * Keep-rule verdict for one backend column: abstentions and answer flips over the
 * measured rows, wins and losses against the best zero-call order, and the first
 * stopping verdict that applies.
 * @param {string} backend
 * @param {Array<{ id: string, order: string[], cluster: string[], gold: string, confidence: Record<string, number> }>} rows
 * @param {Record<string, Array<Record<string, number>|null>>} answersByRow
 * @param {number[]} walls
 * @param {{ isMatch: (candidate: string, gold: string) => boolean }} census
 * @returns {{ backend: string, K: number, M: number, W: number, L: number, ties: number, abstentions: number, F: number, p: number, pLoss: number, sa: number, sb: number, baseline: string, t: number|null, p50: number|null, calls: number, verdict: string }}
 */
export function judgeColumn(backend, rows, answersByRow, walls, census) {
  const K = rows.length;
  const measured = [];
  let abstentions = 0;
  let F = 0;
  for (const row of rows) {
    const answers = answersByRow[row.id];
    if (!Array.isArray(answers) || answers.length !== 3) continue;
    if (answers.some((answer) => answer === null || typeof answer !== 'object')) continue;
    const { order, abstained } = orderFromMaps(row, answers);
    measured.push({ row, order });
    if (abstained) abstentions += 1;
    const keys = [...row.cluster, 'none'];
    const counts = new Map();
    for (const answer of answers) {
      const key = topKey(answer, keys);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    F += 3 - Math.max(...counts.values());
  }

  const candidates = {
    scorer: (row) => row.order,
    confidence: (row) => confidenceOrder(row),
    always_second: (row) => alwaysSecondOrder(row),
  };
  const sums = Object.entries(candidates).map(([name, orderOf]) => [
    name,
    measured.reduce((sum, { row }) => sum + reciprocalRank(orderOf(row), row.gold, census.isMatch), 0),
  ]);
  let [baseline, best] = sums[0];
  for (const [name, sum] of sums.slice(1)) {
    if (sum > best) {
      baseline = name;
      best = sum;
    }
  }

  let W = 0;
  let L = 0;
  let SA = 0;
  let SB = 0;
  for (const { row, order } of measured) {
    const rc = reciprocalRank(order, row.gold, census.isMatch);
    const rb = reciprocalRank(candidates[baseline](row), row.gold, census.isMatch);
    SA += rc;
    SB += rb;
    if (rc > rb) W += 1;
    else if (rc < rb) L += 1;
  }

  const M = measured.length;
  const p = binomTail(W + L, W);
  const pLoss = binomTail(W + L, L);
  const t = nearestRank(walls, 0.95);
  const p50 = nearestRank(walls, 0.5);

  let verdict;
  if (10 * M < 9 * K) verdict = 'stop (coverage)';
  else if (pLoss <= ALPHA) verdict = 'kill';
  else if (20 * (SA - SB) < M - 1e-9) verdict = 'stop (margin)';
  else if (!(p < ALPHA)) verdict = 'stop (sign test)';
  else if (10 * F > 3 * M) verdict = 'stop (flips)';
  else if (t === null || t > ADVISOR_BUDGET_MS) verdict = 'stop (latency)';
  else verdict = 'keep';

  return { backend, K, M, W, L, ties: M - W - L, abstentions, F, p, pLoss, sa: SA, sb: SB, baseline, t, p50, calls: walls.length, verdict };
}

/**
 * One-line verdict for one backend column; a non-empty extra is appended after a space.
 * @param {ReturnType<typeof judgeColumn>} s
 * @param {string} [extra]
 * @returns {string}
 */
export function verdictLineFor(s, extra) {
  const mrrA = s.M === 0 ? 'none' : (s.sa / s.M).toFixed(4);
  const mrrB = s.M === 0 ? 'none' : (s.sb / s.M).toFixed(4);
  const p95 = s.t === null ? 'none' : String(Math.round(s.t));
  const line = `verdict ${s.backend}: ${s.verdict} K=${s.K} M=${s.M} W=${s.W} L=${s.L} F=${s.F} p=${s.p.toFixed(4)} mrr=${mrrA}/${mrrB} p95_ms=${p95}`;
  return extra ? `${line} ${extra}` : line;
}

/**
 * One-line column census: row counts, outcomes, flips, baseline and latencies.
 * @param {ReturnType<typeof judgeColumn>} s
 * @returns {string}
 */
export function columnLine(s) {
  const p50 = s.p50 === null ? 'none' : String(Math.round(s.p50));
  const p95 = s.t === null ? 'none' : String(Math.round(s.t));
  return `column ${s.backend}: rows=${s.K} measured=${s.M} wins=${s.W} losses=${s.L} ties=${s.ties} abstentions=${s.abstentions} flips=${s.F} baseline=${s.baseline} p_loss=${s.pLoss.toFixed(4)} calls=${s.calls} p50_ms=${p50} p95_ms=${p95}`;
}

/**
 * Run the prompt shim's advisor entry in-process, against the built hook, so the
 * child times the same work the shim does on a real prompt.
 * @param {string} prompt
 * @returns {Promise<void>}
 */
async function runHookAdvisor(prompt) {
  const { handleClaudeUserPromptSubmit } = await import(HOOK);
  await handleClaudeUserPromptSubmit({ prompt, cwd: process.cwd() });
}

/**
 * One timed child's job: the advisor, then an optional health check and one
 * classifier call, each measured. A failing health check stops the run before
 * the call, and its code becomes the run's code.
 * @param {string} stdinText
 * @param {{ runAdvisor?: (prompt: string) => Promise<void> }} [deps]
 * @returns {Promise<{ advisorMs: number, healthMs: number|null, healthCode: number|null, callMs: number|null, code: number|null, stdout: string }>}
 */
export async function childMain(stdinText, deps = {}) {
  const job = JSON.parse(stdinText);
  const runAdvisor = deps.runAdvisor ?? runHookAdvisor;
  const advisorStart = performance.now();
  await runAdvisor(job.prompt);
  const result = {
    advisorMs: Math.round(performance.now() - advisorStart),
    healthMs: null,
    healthCode: null,
    callMs: null,
    code: null,
    stdout: '',
  };
  if (Array.isArray(job.health)) {
    const healthStart = performance.now();
    const health = spawnSync(job.health[0], [...job.health.slice(1), 'health'], {
      env: process.env,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    result.healthMs = Math.round(performance.now() - healthStart);
    result.healthCode = health.error ? 127 : health.status ?? -1;
    if (result.healthCode !== 0) {
      result.code = result.healthCode;
      return result;
    }
  }
  if (job.call) {
    const callStart = performance.now();
    const call = spawnSync(job.call.cmd[0], [...job.call.cmd.slice(1), ...job.call.args], {
      env: process.env,
      encoding: 'utf8',
      input: job.prompt,
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    result.callMs = Math.round(performance.now() - callStart);
    result.code = call.error ? 127 : call.status ?? -1;
    result.stdout = call.stdout ?? '';
  }
  return result;
}

/**
 * Spawn the timed child on one job and read its JSON result line. A child the
 * timeout kills counts at the full timeout: the kill is the measurement.
 * @param {object} job
 * @param {{ childFile?: string, timeoutMs?: number, env?: Record<string, string|undefined> }} [opts]
 * @returns {Promise<{ wallMs: number, timedOut: boolean, result: object|null }>}
 */
export async function runTimedChild(job, opts = {}) {
  const file = opts.childFile ?? SELF;
  const timeoutMs = opts.timeoutMs ?? CHILD_TIMEOUT_MS;
  const call = await spawnCall(process.execPath, [file, '--child'], JSON.stringify(job), opts.env ?? process.env, timeoutMs);
  if (call.timedOut) return { wallMs: timeoutMs, timedOut: true, result: null };
  let result = null;
  try {
    const lines = call.stdout.split('\n').map((line) => line.trim()).filter((line) => line.length > 0);
    result = JSON.parse(lines[lines.length - 1]);
  } catch {
    result = null;
  }
  return { wallMs: call.wallMs, timedOut: false, result };
}

/**
 * Environment for the timed child. The shim gives the advisor 2,200 of its
 * 2,500 ms, and a one-minute idle timeout lets the daemon the advisor starts for
 * a temp database exit soon after the run.
 * @param {Record<string, string|undefined>} env
 * @returns {Record<string, string|undefined>}
 */
export function childEnv(env) {
  return {
    ...env,
    SPECKIT_CLAUDE_HOOK_TIMEOUT_MS: String(ADVISOR_BUDGET_MS),
    SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN: env.SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN ?? '1',
  };
}

/**
 * Time the advisor child on each prompt, one at a time: the children never run
 * in parallel, so they do not compete for the machine.
 * @param {string[]} prompts
 * @param {{ childFile?: string, timeoutMs?: number, env?: Record<string, string|undefined> }} [opts]
 * @returns {Promise<{ n: number, p50: number|null, p95: number|null, max: number|null, over2200: number, killed: number, walls: number[] }>}
 */
export async function timeAdvisor(prompts, opts = {}) {
  const walls = [];
  let killed = 0;
  for (const prompt of prompts) {
    const out = await runTimedChild({ prompt }, opts);
    walls.push(out.wallMs);
    if (out.timedOut) killed += 1;
  }
  return {
    n: walls.length,
    p50: nearestRank(walls, 0.5),
    p95: nearestRank(walls, 0.95),
    max: walls.length === 0 ? null : Math.max(...walls),
    over2200: walls.filter((wall) => wall > ADVISOR_BUDGET_MS).length,
    killed,
    walls,
  };
}

/**
 * One-line advisor timing summary, quantiles rounded and none for an empty sample.
 * @param {Awaited<ReturnType<typeof timeAdvisor>>} t
 * @returns {string}
 */
export function advisorLine(t) {
  const p50 = t.p50 === null ? 'none' : String(Math.round(t.p50));
  const p95 = t.p95 === null ? 'none' : String(Math.round(t.p95));
  const max = t.max === null ? 'none' : String(Math.round(t.max));
  return `advisor child: p50=${p50} p95=${p95} max=${max} over_2200=${t.over2200} children=${t.n} killed=${t.killed}`;
}

/**
 * The headroom stop line for the zero-call timing, or null when there is
 * headroom. Either line stops both model arms before any call.
 * @param {number} movable
 * @param {number|null} advisorP95
 * @returns {string|null}
 */
export function headroomLine(movable, advisorP95) {
  if (movable < MIN_MOVABLE) return 'no headroom (movable)';
  if (advisorP95 === null || advisorP95 > ADVISOR_BUDGET_MS) return 'no headroom (latency)';
  return null;
}

// ───────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ───────────────────────────────────────────────────────────────────

/**
 * Choice arm over every eligible row, three rotated orders each: the Jev arm
 * sends the prompts to the hosted classifier, and the Deem arm to the local
 * server so nothing leaves the machine. Each order runs inside a timed child; a
 * killed child is recorded and the row continues. The Jev arm checks auth before
 * any row, waits a backoff and retries once when the classifier reports itself
 * busy, and a rejected key stops it. The Deem arm re-checks the server health
 * before its single exit-4 retry, and a changed model or source commit stops it.
 * Exit 2, exit 3, and exit 130 stop either arm and report how many rows finished.
 * @param {'jev' | 'deem'} backend - Column name.
 * @param {{ rows: Array<{ id: string, prompt: string, cluster: string[], gold: string }>, isMatch: (candidate: string, gold: string) => boolean, describe: (skill: string) => string }} census
 * @param {{ path: string, provider: string } | { cmd: string[], model: string, modelCommit: string, sourceCommit: string }} gate - Passed gate: a Jev path and provider, or the Deem command, model name and both commits.
 * @param {{ out: (line: string) => void, env: Record<string, string | undefined>, outDir?: string, childFile?: string, timeoutMs?: number, advisorP50?: number|null, backoffMs?: number }} ctx - backoffMs waits before the single Jev exit-4 retry; default 2000.
 * @returns {Promise<object | { stopped: string }>}
 */
export async function runArm(backend, census, gate, ctx) {
  const { out, env, outDir, childFile, timeoutMs, advisorP50 } = ctx;
  const rows = census.rows.filter((row) => classifyRow(row, census.isMatch) !== 'ineligible' && (backend === 'jev' || row.cluster.length <= DEEM_MAX_KEYS));

  if (backend === 'jev') {
    let chars = 0;
    for (const row of rows) {
      let optionChars = 0;
      for (const value of optionArgs([...row.cluster, 'none'], census.describe, row.cluster)) {
        if (value !== '-o') optionChars += value.length;
      }
      chars += row.prompt.length + CHOICE_QUESTION.length + optionChars;
    }
    chars *= PASSES;
    out(`jev: payload=routing corpus prompts and skill projection descriptions planned_calls=${rows.length * PASSES + 1} est_input_tokens=${Math.ceil(chars / 4)}`);
  } else {
    out(`deem: nothing leaves the machine planned_calls=${rows.length * PASSES} est_wall_s=${(rows.length * PASSES * ((advisorP50 ?? 0) + DEEM_CHOICE_P50_MS) / 1000).toFixed(1)}`);
  }
  out(`question: ${CHOICE_QUESTION}`);

  const walls = [];
  const answersByRow = {};
  let timeouts = 0;
  let finished = 0;
  const stop = (line) => {
    out(line);
    out(`${backend}: partial_rows=${finished}`);
    return { stopped: line };
  };

  let model = 'unknown';
  if (backend === 'jev') {
    const auth = await spawnCall(gate.path, ['auth', 'test', '--provider', gate.provider], '', ctx.env, AUTH_TIMEOUT_MS);
    if (auth.code === 0) {
      try {
        const parsed = JSON.parse(auth.stdout).model;
        if (typeof parsed === 'string') model = parsed;
      } catch {
        // A non-JSON body leaves the model unknown.
      }
    }
    writeCall(ctx.outDir, {
      backend: 'jev',
      kind: 'auth_test',
      wall_ms: auth.wallMs,
      exit_code: auth.code,
      jev_version: JEV_VERSION,
      provider: gate.provider,
      model,
      status: auth.code === 0 ? 'measured' : 'unmeasured',
    });
    if (auth.code === 3) return stop('jev arm stopped: key rejected');
    if (auth.code === 130) return stop('jev arm stopped: interrupted');
    if (auth.code !== 0) return stop('jev arm stopped: auth test failed');
    out(`jev: auth_test provider=${gate.provider} model=${model}`);
  }

  const identity = backend === 'jev'
    ? { jev_version: JEV_VERSION, provider: gate.provider, model }
    : { model: gate.model, model_commit: gate.modelCommit, source_commit: gate.sourceCommit };

  for (const row of rows) {
    const keys = [...row.cluster, 'none'];
    const orders = rotations(keys);
    answersByRow[row.id] = [];
    for (let order = 0; order < PASSES; order += 1) {
      const options = optionArgs(orders[order], census.describe, row.cluster);
      const job = backend === 'jev'
        ? { prompt: row.prompt, call: { cmd: [gate.path], args: ['choice', '--provider', gate.provider, '-q', CHOICE_QUESTION, ...options] } }
        : { prompt: row.prompt, health: gate.cmd, call: { cmd: gate.cmd, args: ['choice', '-q', CHOICE_QUESTION, ...options] } };
      let attempt = 1;
      let answer = null;
      for (;;) {
        const child = await runTimedChild(job, { env, childFile, timeoutMs });
        walls.push(child.wallMs);
        const code = child.timedOut ? null : (child.result?.code ?? null);
        const probs = code === 0 ? readProbabilities(child.result.stdout, keys) : { raw: null, full: null };
        let status = 'unmeasured';
        if (child.timedOut) {
          status = 'unmeasured_timeout';
          timeouts += 1;
        } else if (probs.full) {
          status = 'measured';
        }
        writeCall(outDir, {
          backend,
          kind: 'choice',
          row_id: row.id,
          order,
          attempt,
          child_wall_ms: child.wallMs,
          advisor_ms: child.result?.advisorMs ?? null,
          health_ms: child.result?.healthMs ?? null,
          call_ms: child.result?.callMs ?? null,
          exit_code: code,
          probabilities: probs.raw,
          status,
          ...identity,
        });
        if (status === 'measured') {
          answer = probs.full;
          break;
        }
        if (child.timedOut) break;
        if (code === 2) return stop(`${backend} arm stopped: usage error`);
        if (code === 3) return stop(backend === 'jev' ? 'jev arm stopped: key rejected' : 'deem arm stopped: backend refused');
        if (code === 130) return stop(`${backend} arm stopped: interrupted`);
        if (code === 4 && attempt === 1) {
          if (backend === 'jev') {
            await new Promise((done) => { setTimeout(done, ctx.backoffMs ?? 2000); });
          } else {
            const health = readDeemHealth(gate.cmd, env);
            if (!health.ok) return stop('deem arm stopped: server gone');
            if (health.model !== gate.model || health.modelCommit !== gate.modelCommit || health.sourceCommit !== gate.sourceCommit) {
              return stop('deem arm stopped: model commit changed mid-run');
            }
          }
          attempt = 2;
          continue;
        }
        break;
      }
      answersByRow[row.id].push(answer);
    }
    finished += 1;
  }

  const s = judgeColumn(backend, rows, answersByRow, walls, census);
  out(`${backend}: calls=${walls.length} timeouts=${timeouts}`);
  out(columnLine(s));
  s.identity = identity;
  s.line = verdictLineFor(s, backend === 'jev'
    ? `jev_version=${JEV_VERSION} provider=${gate.provider} model=${model}`
    : `model=${gate.model} model_commit=${gate.modelCommit} source_commit=${gate.sourceCommit}`);
  out(s.line);
  return s;
}

/**
 * Machine-readable report for one run: the printed census lines, the zero-call
 * advisor timing, the headroom line, and one entry per model column. A column
 * that reached its verdict lands under columns; one that stopped early lands
 * under stopped with its stop line.
 * @param {string[]} censusLines - The printed census summary lines.
 * @param {Awaited<ReturnType<typeof timeAdvisor>>} timing - The advisor child timing.
 * @param {string|null} headroom - The headroom stop line, or null when there is headroom.
 * @param {object|undefined} jevResult - The Jev column verdict or stop record.
 * @param {object|undefined} deemResult - The Deem column verdict or stop record.
 * @returns {{ census: string[], advisor: { children: number, p50_ms: number|null, p95_ms: number|null, max_ms: number|null, over_2200: number, killed: number }, headroom: string, columns: Record<string, object>, stopped: Record<string, string> }}
 */
export function buildReport(censusLines, timing, headroom, jevResult, deemResult) {
  const report = {
    census: censusLines,
    advisor: {
      children: timing.n,
      p50_ms: timing.p50,
      p95_ms: timing.p95,
      max_ms: timing.max,
      over_2200: timing.over2200,
      killed: timing.killed,
    },
    headroom: headroom ?? 'ok',
    columns: {},
    stopped: {},
  };
  for (const [name, result] of [['jev', jevResult], ['deem', deemResult]]) {
    if (result === undefined) continue;
    if ('stopped' in result) {
      report.stopped[name] = result.stopped;
      continue;
    }
    report.columns[name] = {
      rows: result.K,
      measured: result.M,
      ties: result.ties,
      abstentions: result.abstentions,
      baseline: result.baseline,
      calls: result.calls,
      p50_ms: result.p50,
      verdict: {
        outcome: result.verdict,
        line: result.line,
        K: result.K,
        M: result.M,
        W: result.W,
        L: result.L,
        F: result.F,
        p: result.p,
        p_loss: result.pLoss,
        mrr_column: result.M === 0 ? null : result.sa / result.M,
        mrr_baseline: result.M === 0 ? null : result.sb / result.M,
        p95_ms: result.t,
        ...result.identity,
      },
    };
  }
  return report;
}

/**
 * Prints the zero-call order comparison by default, or answers one child job
 * from stdin. A bad flag returns 2, and a model arm without --out returns 2
 * before any stdout line.
 * @param {string[]} argv - Arguments after the script path.
 * @param {Object} [deps] - Census, timing, writer, environment, stdin and child replacements.
 * @param {Awaited<ReturnType<typeof loadCensus>>} [deps.census] - Pre-scored census. Default loadCensus().
 * @param {Awaited<ReturnType<typeof timeAdvisor>>} [deps.timing] - Pre-measured advisor timing. Default timeAdvisor().
 * @param {(line: string) => void} [deps.out] - Line writer. Default writes the line plus '\n' to stdout.
 * @param {Record<string, string | undefined>} [deps.env] - Default process.env.
 * @param {string} [deps.stdinText] - Child job JSON. Default reads fd 0.
 * @param {string} [deps.childFile] - Timed child path. Default this file.
 * @param {number} [deps.timeoutMs] - Timed child kill time. Default CHILD_TIMEOUT_MS.
 * @param {number} [deps.backoffMs] - Wait before the single Jev exit-4 retry. Default 2000.
 * @param {(prompt: string) => Promise<void>} [deps.runAdvisor] - Advisor replacement inside the child.
 * @returns {Promise<number>}
 */
export async function main(argv, deps = {}) {
  let parsed;
  try {
    parsed = parseArgs({
      args: argv,
      strict: true,
      allowPositionals: false,
      options: {
        jev: { type: 'boolean' },
        deem: { type: 'boolean' },
        out: { type: 'string' },
        child: { type: 'boolean' },
      },
    });
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    return 2;
  }

  const { values } = parsed;
  if (values.child === true) {
    const text = deps.stdinText ?? readFileSync(0, 'utf8');
    const result = await childMain(text, deps);
    await new Promise((done) => {
      process.stdout.write(`${JSON.stringify(result)}\n`, done);
    });
    return 0;
  }

  // A model arm must leave its call record behind, so both arms need --out.
  if ((values.jev === true || values.deem === true) && (typeof values.out !== 'string' || values.out === '')) {
    process.stderr.write('--jev and --deem need --out <dir> so every call is recorded\n');
    return 2;
  }

  const out = deps.out ?? ((line) => process.stdout.write(`${line}\n`));
  const env = deps.env ?? process.env;
  const census = deps.census ?? await loadCensus();
  const summary = summarizeCensus(census);
  const censusLines = [];
  for (const line of summary.lines) {
    // This eval's own movable-row rule replaces those two census stop lines.
    if (line === 'no headroom' || line === 'underpowered') continue;
    out(line);
    censusLines.push(line);
  }
  if (summary.voided) return 1;

  const timing = deps.timing ?? await timeAdvisor(census.rows.map((row) => row.prompt), { env: childEnv(env), childFile: deps.childFile });
  out(advisorLine(timing));

  const eligible = census.rows.filter((row) => classifyRow(row, census.isMatch) !== 'ineligible');
  const deemRows = eligible.filter((row) => row.cluster.length <= DEEM_MAX_KEYS);
  const headroom = headroomLine(summary.movable, timing.p95);
  out(headroom ?? `planned calls: jev=${eligible.length * PASSES + 1} deem=${deemRows.length * PASSES}`);
  out(`margin: ${MARGIN}`);
  out(KEEP_RULE_LINE);
  let jevResult;
  let deemResult;
  if (headroom === null) {
    const armCtx = {
      out,
      env: childEnv(env),
      outDir: values.out,
      childFile: deps.childFile,
      timeoutMs: deps.timeoutMs,
      backoffMs: deps.backoffMs,
      advisorP50: timing.p50,
    };
    // Jev runs first, each gate runs once, and a failed gate never starts the other backend.
    if (values.jev === true) {
      const gate = jevGate({ out, env, timeoutMs: GATE_TIMEOUT_MS });
      if (gate.passed) jevResult = await runArm('jev', census, gate, armCtx);
    }
    if (values.deem === true) {
      const gate = deemGate({ out, env });
      if (gate.passed) deemResult = await runArm('deem', census, gate, armCtx);
    }
  }
  if (values.jev === true || values.deem === true) {
    mkdirSync(values.out, { recursive: true });
    writeFileSync(join(values.out, 'report.json'), `${JSON.stringify(buildReport(censusLines, timing, headroom, jevResult, deemResult), null, 2)}\n`);
  }
  return 0;
}

// ───────────────────────────────────────────────────────────────────
// 5. CLI ENTRY
// ───────────────────────────────────────────────────────────────────

if (process.argv[1] && realpathSync(process.argv[1]) === realpathSync(SELF)) {
  const code = await main(process.argv.slice(2));
  // The hook module and the advisor CLI it spawns can hold the event loop open.
  if (process.argv.includes('--child')) process.exit(code);
  else process.exitCode = code;
}

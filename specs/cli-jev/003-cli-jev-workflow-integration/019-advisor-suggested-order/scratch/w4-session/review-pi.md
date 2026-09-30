# Cross-family review: one phase's uncommitted build

You are a read-only reviewer from a different model family than the author of these files (the code was written by DeepSeek V4.1 Flash through Devin (the two leaf JSON files by their generator); you are MiMo through Pi). Never dispatch another agent. Never edit, create or delete a file, and never run a git command that writes. You may run read-only commands and the phase's tests. Worktree root (run every command from here): `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration`

## Scope

Phase folder: `specs/cli-jev/003-cli-jev-workflow-integration/019-advisor-suggested-order`. The build is uncommitted in the working tree, and other phases' builds may be uncommitted beside it: review only the files listed here.
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-suggested-order.mjs`
- `.skilled/skills/system-skill-advisor/runtime/tests/parity/score-suggested-order.vitest.ts`
- `.skilled/skills/system-skill-advisor/runtime/tests/manual-testing-playbook.vitest.ts`
- `.skilled/skills/system-skill-advisor/leaf-aliases.json`
- `.skilled/skills/system-skill-advisor/leaf-manifest.json`

Read first: the phase's `spec.md` (requirements and file list), its `goal.md` (criteria), `specs/cli-jev/003-cli-jev-workflow-integration/019-advisor-suggested-order/scratch/w4-build/build-evidence.md`, and the parent `specs/cli-jev/003-cli-jev-workflow-integration/goal.md` D1 to D7. Then open each file above in full, and the callers and tests of anything changed. The appendix holds the diff, so you can review even if a file read fails, but cite only lines you opened or lines in the appendix.

## What to look for

- Correctness against each requirement in the phase `spec.md`.
- Dormancy (parent D1): with neither Jev nor Deem available, behavior is exactly today's. A Jev arm runs only behind `--jev` after the identity line, `jev --version` printing `jev 0.6.2` and `jev auth status --provider <p>` exiting 0. A Deem arm runs only behind `--deem` after `cli-deem health` passes. Either failing prints one skip line and changes nothing.
- The zero-call first slice runs with no model call.
- The keep rule is fixed in code before any run: coverage, a margin over the baseline, an exact one-sided sign test at 0.05, a flip bound, and one verdict line `verdict <backend>: keep|kill|stop (...)`. Check the sign test arithmetic on one case by hand.
- Label gate: where the scorer needs operator labels, it prints `stop: fewer than N labeled rows` and no label file was written by a model.
- Secrets: no key, token or `.env` read, and no request that sends one. Jev gets no secret.
- Comment hygiene: no spec path, packet or phase number, REQ, task, ADR or finding id in a code comment.
- Tests: happy path plus one edge case per public surface, stubbed backends for both arms, and no test that asserts nothing or mirrors the implementation.
- Docs: each changed skill doc says what the code does, no more, and names the switches and the gate as the code spells them.

Skip style nits a formatter would settle.

## Severity

- P0: wrong behavior, data loss, a secret leak or a broken build.
- P1: a requirement not met, a missing edge case the spec names, a test gap on a changed public surface, dormancy broken, or a doc that states something the code does not do.
- P2: everything else worth fixing.

## Report (under 400 words)

One line per finding: `P0|P1|P2 file:line - what is wrong - the concrete input or state that shows it`. Then one line per requirement: `REQ-xxx met|not met|not checked - why`. End with exactly one line `VERDICT: PASS` (no P0 or P1) or `VERDICT: FAIL`.

## Appendix: the diff under review

```diff
diff --git a/.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-suggested-order.mjs b/.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-suggested-order.mjs
new file mode 100644
index 0000000000..a904b826be
--- /dev/null
+++ b/.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-suggested-order.mjs
@@ -0,0 +1,710 @@
+#!/usr/bin/env node
+// ───────────────────────────────────────────────────────────────
+// MODULE: Suggested Cluster Order Eval
+// ───────────────────────────────────────────────────────────────
+//
+// Measures, offline, whether a Jev or local Deem answer that orders the advisor's
+// whole near-tie cluster beats the best zero-call order, with each call timed
+// inside a child spawned the way the prompt shim spawns the advisor. The default
+// run makes no model call. The script holds no credential and reads none.
+
+import { spawnSync } from 'node:child_process';
+import { mkdirSync, readFileSync, realpathSync, writeFileSync } from 'node:fs';
+import { dirname, join, resolve } from 'node:path';
+import { performance } from 'node:perf_hooks';
+import { fileURLToPath } from 'node:url';
+import { parseArgs } from 'node:util';
+
+import { alwaysSecondOrder, binomTail, classifyRow, confidenceOrder, deemGate, jevGate, loadCensus, readDeemHealth, reciprocalRank, reorderSlots, spawnCall, summarizeCensus, writeCall } from './score-jev-tiebreak.mjs';
+
+export const ALPHA = 0.05;
+export const MARGIN = 0.05;
+export const ADVISOR_BUDGET_MS = 2200;
+export const CHILD_TIMEOUT_MS = 2500;
+export const MIN_MOVABLE = 5;
+const CHOICE_QUESTION = 'Which skill should handle this request?';
+const NONE_DESCRIPTION = 'None of these skills fits the request';
+const PASSES = 3;
+const DEEM_MAX_KEYS = 25;
+const DEEM_CHOICE_P50_MS = 241;
+const JEV_VERSION = '0.6.2';
+const AUTH_TIMEOUT_MS = 30000;
+const GATE_TIMEOUT_MS = 10000;
+const KEEP_RULE_LINE = 'keep rule: coverage 10*M>=9*K, kill P(X>=L)<=0.05, margin 20*(SA-SB)>=M, sign test P(X>=W)<0.05, flips 10*F<=3*M, latency p95<=2200ms';
+
+const SELF = fileURLToPath(import.meta.url);
+const HERE = dirname(SELF);
+const HOOK = resolve(HERE, '../../dist/hooks/claude/user-prompt-submit.js');
+
+/**
+ * Nearest-rank quantile of a numeric sample; null when the sample is empty.
+ * @param {number[]} values
+ * @param {number} q
+ * @returns {number|null}
+ */
+export function nearestRank(values, q) {
+  if (values.length === 0) return null;
+  const sorted = values.slice().sort((left, right) => left - right);
+  return sorted[Math.ceil(q * sorted.length) - 1];
+}
+
+/**
+ * The three left rotations of the keys.
+ * @param {string[]} keys
+ * @returns {string[][]}
+ */
+export function rotations(keys) {
+  return [0, 1, 2].map((r) => [...keys.slice(r), ...keys.slice(0, r)]);
+}
+
+/**
+ * Flat option args that label each key, disambiguating equal descriptions.
+ * @param {string[]} keys
+ * @param {(key: string) => string} describe
+ * @param {string[]} cluster
+ * @returns {string[]}
+ */
+export function optionArgs(keys, describe, cluster) {
+  return keys.flatMap((key) => {
+    if (key === 'none') return ['-o', `none=${NONE_DESCRIPTION}`];
+    const text = describe(key);
+    const clash = cluster.some((other) => other !== key && describe(other) === text);
+    return ['-o', `${key}=${text}${clash ? ` [${key}]` : ''}`];
+  });
+}
+
+/**
+ * Probability map from a classifier answer on stdout, with the raw and full-coverage views.
+ * @param {string} stdout
+ * @param {string[]} keys
+ * @returns {{ raw: Record<string, number>|null, full: Record<string, number>|null }}
+ */
+export function readProbabilities(stdout, keys) {
+  let raw = null;
+  try {
+    const probabilities = JSON.parse(stdout).answers.answer.probabilities;
+    if (probabilities !== null && typeof probabilities === 'object' && !Array.isArray(probabilities)) {
+      raw = probabilities;
+    }
+  } catch {
+    return { raw: null, full: null };
+  }
+  if (raw === null) return { raw: null, full: null };
+  for (const key of keys) {
+    const value = raw[key];
+    if (typeof value !== 'number' || !Number.isFinite(value)) return { raw, full: null };
+  }
+  const full = {};
+  for (const key of keys) full[key] = raw[key];
+  return { raw, full };
+}
+
+/**
+ * First key in keys order that holds the highest value.
+ * @param {Record<string, number>} map
+ * @param {string[]} keys
+ * @returns {string}
+ */
+export function topKey(map, keys) {
+  let best = keys[0];
+  for (const key of keys) {
+    if (map[key] > map[best]) best = key;
+  }
+  return best;
+}
+
+/**
+ * Cluster order by mean probability across the passes; abstains when none leads.
+ * @param {{ order: string[], cluster: string[] }} row
+ * @param {Array<Record<string, number>>} maps
+ * @returns {{ order: string[], abstained: boolean }}
+ */
+export function orderFromMaps(row, maps) {
+  const mean = {};
+  for (const key of [...row.cluster, 'none']) {
+    mean[key] = maps.reduce((sum, map) => sum + map[key], 0) / maps.length;
+  }
+  if (row.cluster.every((key) => mean.none > mean[key])) {
+    return { order: row.order.slice(), abstained: true };
+  }
+  const sorted = row.cluster.slice().sort((left, right) => mean[right] - mean[left]);
+  return { order: reorderSlots(row.order, row.cluster, sorted), abstained: false };
+}
+
+/**
+ * Keep-rule verdict for one backend column: abstentions and answer flips over the
+ * measured rows, wins and losses against the best zero-call order, and the first
+ * stopping verdict that applies.
+ * @param {string} backend
+ * @param {Array<{ id: string, order: string[], cluster: string[], gold: string, confidence: Record<string, number> }>} rows
+ * @param {Record<string, Array<Record<string, number>|null>>} answersByRow
+ * @param {number[]} walls
+ * @param {{ isMatch: (candidate: string, gold: string) => boolean }} census
+ * @returns {{ backend: string, K: number, M: number, W: number, L: number, ties: number, abstentions: number, F: number, p: number, pLoss: number, sa: number, sb: number, baseline: string, t: number|null, p50: number|null, calls: number, verdict: string }}
+ */
+export function judgeColumn(backend, rows, answersByRow, walls, census) {
+  const K = rows.length;
+  const measured = [];
+  let abstentions = 0;
+  let F = 0;
+  for (const row of rows) {
+    const answers = answersByRow[row.id];
+    if (!Array.isArray(answers) || answers.length !== 3) continue;
+    if (answers.some((answer) => answer === null || typeof answer !== 'object')) continue;
+    const { order, abstained } = orderFromMaps(row, answers);
+    measured.push({ row, order });
+    if (abstained) abstentions += 1;
+    const keys = [...row.cluster, 'none'];
+    const counts = new Map();
+    for (const answer of answers) {
+      const key = topKey(answer, keys);
+      counts.set(key, (counts.get(key) ?? 0) + 1);
+    }
+    F += 3 - Math.max(...counts.values());
+  }
+
+  const candidates = {
+    scorer: (row) => row.order,
+    confidence: (row) => confidenceOrder(row),
+    always_second: (row) => alwaysSecondOrder(row),
+  };
+  const sums = Object.entries(candidates).map(([name, orderOf]) => [
+    name,
+    measured.reduce((sum, { row }) => sum + reciprocalRank(orderOf(row), row.gold, census.isMatch), 0),
+  ]);
+  let [baseline, best] = sums[0];
+  for (const [name, sum] of sums.slice(1)) {
+    if (sum > best) {
+      baseline = name;
+      best = sum;
+    }
+  }
+
+  let W = 0;
+  let L = 0;
+  let SA = 0;
+  let SB = 0;
+  for (const { row, order } of measured) {
+    const rc = reciprocalRank(order, row.gold, census.isMatch);
+    const rb = reciprocalRank(candidates[baseline](row), row.gold, census.isMatch);
+    SA += rc;
+    SB += rb;
+    if (rc > rb) W += 1;
+    else if (rc < rb) L += 1;
+  }
+
+  const M = measured.length;
+  const p = binomTail(W + L, W);
+  const pLoss = binomTail(W + L, L);
+  const t = nearestRank(walls, 0.95);
+  const p50 = nearestRank(walls, 0.5);
+
+  let verdict;
+  if (10 * M < 9 * K) verdict = 'stop (coverage)';
+  else if (pLoss <= ALPHA) verdict = 'kill';
+  else if (20 * (SA - SB) < M - 1e-9) verdict = 'stop (margin)';
+  else if (!(p < ALPHA)) verdict = 'stop (sign test)';
+  else if (10 * F > 3 * M) verdict = 'stop (flips)';
+  else if (t === null || t > ADVISOR_BUDGET_MS) verdict = 'stop (latency)';
+  else verdict = 'keep';
+
+  return { backend, K, M, W, L, ties: M - W - L, abstentions, F, p, pLoss, sa: SA, sb: SB, baseline, t, p50, calls: walls.length, verdict };
+}
+
+/**
+ * One-line verdict for one backend column; a non-empty extra is appended after a space.
+ * @param {ReturnType<typeof judgeColumn>} s
+ * @param {string} [extra]
+ * @returns {string}
+ */
+export function verdictLineFor(s, extra) {
+  const mrrA = s.M === 0 ? 'none' : (s.sa / s.M).toFixed(4);
+  const mrrB = s.M === 0 ? 'none' : (s.sb / s.M).toFixed(4);
+  const p95 = s.t === null ? 'none' : String(Math.round(s.t));
+  const line = `verdict ${s.backend}: ${s.verdict} K=${s.K} M=${s.M} W=${s.W} L=${s.L} F=${s.F} p=${s.p.toFixed(4)} mrr=${mrrA}/${mrrB} p95_ms=${p95}`;
+  return extra ? `${line} ${extra}` : line;
+}
+
+/**
+ * One-line column census: row counts, outcomes, flips, baseline and latencies.
+ * @param {ReturnType<typeof judgeColumn>} s
+ * @returns {string}
+ */
+export function columnLine(s) {
+  const p50 = s.p50 === null ? 'none' : String(Math.round(s.p50));
+  const p95 = s.t === null ? 'none' : String(Math.round(s.t));
+  return `column ${s.backend}: rows=${s.K} measured=${s.M} wins=${s.W} losses=${s.L} ties=${s.ties} abstentions=${s.abstentions} flips=${s.F} baseline=${s.baseline} p_loss=${s.pLoss.toFixed(4)} calls=${s.calls} p50_ms=${p50} p95_ms=${p95}`;
+}
+
+/**
+ * Run the prompt shim's advisor entry in-process, against the built hook, so the
+ * child times the same work the shim does on a real prompt.
+ * @param {string} prompt
+ * @returns {Promise<void>}
+ */
+async function runHookAdvisor(prompt) {
+  const { handleClaudeUserPromptSubmit } = await import(HOOK);
+  await handleClaudeUserPromptSubmit({ prompt, cwd: process.cwd() });
+}
+
+/**
+ * One timed child's job: the advisor, then an optional health check and one
+ * classifier call, each measured. A failing health check stops the run before
+ * the call, and its code becomes the run's code.
+ * @param {string} stdinText
+ * @param {{ runAdvisor?: (prompt: string) => Promise<void> }} [deps]
+ * @returns {Promise<{ advisorMs: number, healthMs: number|null, healthCode: number|null, callMs: number|null, code: number|null, stdout: string }>}
+ */
+export async function childMain(stdinText, deps = {}) {
+  const job = JSON.parse(stdinText);
+  const runAdvisor = deps.runAdvisor ?? runHookAdvisor;
+  const advisorStart = performance.now();
+  await runAdvisor(job.prompt);
+  const result = {
+    advisorMs: Math.round(performance.now() - advisorStart),
+    healthMs: null,
+    healthCode: null,
+    callMs: null,
+    code: null,
+    stdout: '',
+  };
+  if (Array.isArray(job.health)) {
+    const healthStart = performance.now();
+    const health = spawnSync(job.health[0], [...job.health.slice(1), 'health'], {
+      env: process.env,
+      encoding: 'utf8',
+      stdio: ['ignore', 'pipe', 'pipe'],
+    });
+    result.healthMs = Math.round(performance.now() - healthStart);
+    result.healthCode = health.error ? 127 : health.status ?? -1;
+    if (result.healthCode !== 0) {
+      result.code = result.healthCode;
+      return result;
+    }
+  }
+  if (job.call) {
+    const callStart = performance.now();
+    const call = spawnSync(job.call.cmd[0], [...job.call.cmd.slice(1), ...job.call.args], {
+      env: process.env,
+      encoding: 'utf8',
+      input: job.prompt,
+      stdio: ['pipe', 'pipe', 'pipe'],
+    });
+    result.callMs = Math.round(performance.now() - callStart);
+    result.code = call.error ? 127 : call.status ?? -1;
+    result.stdout = call.stdout ?? '';
+  }
+  return result;
+}
+
+/**
+ * Spawn the timed child on one job and read its JSON result line. A child the
+ * timeout kills counts at the full timeout: the kill is the measurement.
+ * @param {object} job
+ * @param {{ childFile?: string, timeoutMs?: number, env?: Record<string, string|undefined> }} [opts]
+ * @returns {Promise<{ wallMs: number, timedOut: boolean, result: object|null }>}
+ */
+export async function runTimedChild(job, opts = {}) {
+  const file = opts.childFile ?? SELF;
+  const timeoutMs = opts.timeoutMs ?? CHILD_TIMEOUT_MS;
+  const call = await spawnCall(process.execPath, [file, '--child'], JSON.stringify(job), opts.env ?? process.env, timeoutMs);
+  if (call.timedOut) return { wallMs: timeoutMs, timedOut: true, result: null };
+  let result = null;
+  try {
+    const lines = call.stdout.split('\n').map((line) => line.trim()).filter((line) => line.length > 0);
+    result = JSON.parse(lines[lines.length - 1]);
+  } catch {
+    result = null;
+  }
+  return { wallMs: call.wallMs, timedOut: false, result };
+}
+
+/**
+ * Environment for the timed child. The shim gives the advisor 2,200 of its
+ * 2,500 ms, and a one-minute idle timeout lets the daemon the advisor starts for
+ * a temp database exit soon after the run.
+ * @param {Record<string, string|undefined>} env
+ * @returns {Record<string, string|undefined>}
+ */
+export function childEnv(env) {
+  return {
+    ...env,
+    SPECKIT_CLAUDE_HOOK_TIMEOUT_MS: String(ADVISOR_BUDGET_MS),
+    SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN: env.SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN ?? '1',
+  };
+}
+
+/**
+ * Time the advisor child on each prompt, one at a time: the children never run
+ * in parallel, so they do not compete for the machine.
+ * @param {string[]} prompts
+ * @param {{ childFile?: string, timeoutMs?: number, env?: Record<string, string|undefined> }} [opts]
+ * @returns {Promise<{ n: number, p50: number|null, p95: number|null, max: number|null, over2200: number, killed: number, walls: number[] }>}
+ */
+export async function timeAdvisor(prompts, opts = {}) {
+  const walls = [];
+  let killed = 0;
+  for (const prompt of prompts) {
+    const out = await runTimedChild({ prompt }, opts);
+    walls.push(out.wallMs);
+    if (out.timedOut) killed += 1;
+  }
+  return {
+    n: walls.length,
+    p50: nearestRank(walls, 0.5),
+    p95: nearestRank(walls, 0.95),
+    max: walls.length === 0 ? null : Math.max(...walls),
+    over2200: walls.filter((wall) => wall > ADVISOR_BUDGET_MS).length,
+    killed,
+    walls,
+  };
+}
+
+/**
+ * One-line advisor timing summary, quantiles rounded and none for an empty sample.
+ * @param {Awaited<ReturnType<typeof timeAdvisor>>} t
+ * @returns {string}
+ */
+export function advisorLine(t) {
+  const p50 = t.p50 === null ? 'none' : String(Math.round(t.p50));
+  const p95 = t.p95 === null ? 'none' : String(Math.round(t.p95));
+  const max = t.max === null ? 'none' : String(Math.round(t.max));
+  return `advisor child: p50=${p50} p95=${p95} max=${max} over_2200=${t.over2200} children=${t.n} killed=${t.killed}`;
+}
+
+/**
+ * The headroom stop line for the zero-call timing, or null when there is
+ * headroom. Either line stops both model arms before any call.
+ * @param {number} movable
+ * @param {number|null} advisorP95
+ * @returns {string|null}
+ */
+export function headroomLine(movable, advisorP95) {
+  if (movable < MIN_MOVABLE) return 'no headroom (movable)';
+  if (advisorP95 === null || advisorP95 > ADVISOR_BUDGET_MS) return 'no headroom (latency)';
+  return null;
+}
+
+/**
+ * Choice arm over every eligible row, three rotated orders each: the Jev arm
+ * sends the prompts to the hosted classifier, and the Deem arm to the local
+ * server so nothing leaves the machine. Each order runs inside a timed child; a
+ * killed child is recorded and the row continues. The Jev arm checks auth before
+ * any row, waits a backoff and retries once when the classifier reports itself
+ * busy, and a rejected key stops it. The Deem arm re-checks the server health
+ * before its single exit-4 retry, and a changed model or source commit stops it.
+ * Exit 2, exit 3, and exit 130 stop either arm and report how many rows finished.
+ * @param {'jev' | 'deem'} backend - Column name.
+ * @param {{ rows: Array<{ id: string, prompt: string, cluster: string[], gold: string }>, isMatch: (candidate: string, gold: string) => boolean, describe: (skill: string) => string }} census
+ * @param {{ path: string, provider: string } | { cmd: string[], model: string, modelCommit: string, sourceCommit: string }} gate - Passed gate: a Jev path and provider, or the Deem command, model name and both commits.
+ * @param {{ out: (line: string) => void, env: Record<string, string | undefined>, outDir?: string, childFile?: string, timeoutMs?: number, advisorP50?: number|null, backoffMs?: number }} ctx - backoffMs waits before the single Jev exit-4 retry; default 2000.
+ * @returns {Promise<object | { stopped: string }>}
+ */
+export async function runArm(backend, census, gate, ctx) {
+  const { out, env, outDir, childFile, timeoutMs, advisorP50 } = ctx;
+  const rows = census.rows.filter((row) => classifyRow(row, census.isMatch) !== 'ineligible' && (backend === 'jev' || row.cluster.length <= DEEM_MAX_KEYS));
+
+  if (backend === 'jev') {
+    let chars = 0;
+    for (const row of rows) {
+      let optionChars = 0;
+      for (const value of optionArgs([...row.cluster, 'none'], census.describe, row.cluster)) {
+        if (value !== '-o') optionChars += value.length;
+      }
+      chars += row.prompt.length + CHOICE_QUESTION.length + optionChars;
+    }
+    chars *= PASSES;
+    out(`jev: payload=routing corpus prompts and skill projection descriptions planned_calls=${rows.length * PASSES + 1} est_input_tokens=${Math.ceil(chars / 4)}`);
+  } else {
+    out(`deem: nothing leaves the machine planned_calls=${rows.length * PASSES} est_wall_s=${(rows.length * PASSES * ((advisorP50 ?? 0) + DEEM_CHOICE_P50_MS) / 1000).toFixed(1)}`);
+  }
+  out(`question: ${CHOICE_QUESTION}`);
+
+  const walls = [];
+  const answersByRow = {};
+  let timeouts = 0;
+  let finished = 0;
+  const stop = (line) => {
+    out(line);
+    out(`${backend}: partial_rows=${finished}`);
+    return { stopped: line };
+  };
+
+  let model = 'unknown';
+  if (backend === 'jev') {
+    const auth = await spawnCall(gate.path, ['auth', 'test', '--provider', gate.provider], '', ctx.env, AUTH_TIMEOUT_MS);
+    if (auth.code === 0) {
+      try {
+        const parsed = JSON.parse(auth.stdout).model;
+        if (typeof parsed === 'string') model = parsed;
+      } catch {
+        // A non-JSON body leaves the model unknown.
+      }
+    }
+    writeCall(ctx.outDir, {
+      backend: 'jev',
+      kind: 'auth_test',
+      wall_ms: auth.wallMs,
+      exit_code: auth.code,
+      jev_version: JEV_VERSION,
+      provider: gate.provider,
+      model,
+      status: auth.code === 0 ? 'measured' : 'unmeasured',
+    });
+    if (auth.code === 3) return stop('jev arm stopped: key rejected');
+    if (auth.code === 130) return stop('jev arm stopped: interrupted');
+    if (auth.code !== 0) return stop('jev arm stopped: auth test failed');
+    out(`jev: auth_test provider=${gate.provider} model=${model}`);
+  }
+
+  const identity = backend === 'jev'
+    ? { jev_version: JEV_VERSION, provider: gate.provider, model }
+    : { model: gate.model, model_commit: gate.modelCommit, source_commit: gate.sourceCommit };
+
+  for (const row of rows) {
+    const keys = [...row.cluster, 'none'];
+    const orders = rotations(keys);
+    answersByRow[row.id] = [];
+    for (let order = 0; order < PASSES; order += 1) {
+      const options = optionArgs(orders[order], census.describe, row.cluster);
+      const job = backend === 'jev'
+        ? { prompt: row.prompt, call: { cmd: [gate.path], args: ['choice', '--provider', gate.provider, '-q', CHOICE_QUESTION, ...options] } }
+        : { prompt: row.prompt, health: gate.cmd, call: { cmd: gate.cmd, args: ['choice', '-q', CHOICE_QUESTION, ...options] } };
+      let attempt = 1;
+      let answer = null;
+      for (;;) {
+        const child = await runTimedChild(job, { env, childFile, timeoutMs });
+        walls.push(child.wallMs);
+        const code = child.timedOut ? null : (child.result?.code ?? null);
+        const probs = code === 0 ? readProbabilities(child.result.stdout, keys) : { raw: null, full: null };
+        let status = 'unmeasured';
+        if (child.timedOut) {
+          status = 'unmeasured_timeout';
+          timeouts += 1;
+        } else if (probs.full) {
+          status = 'measured';
+        }
+        writeCall(outDir, {
+          backend,
+          kind: 'choice',
+          row_id: row.id,
+          order,
+          attempt,
+          child_wall_ms: child.wallMs,
+          advisor_ms: child.result?.advisorMs ?? null,
+          health_ms: child.result?.healthMs ?? null,
+          call_ms: child.result?.callMs ?? null,
+          exit_code: code,
+          probabilities: probs.raw,
+          status,
+          ...identity,
+        });
+        if (status === 'measured') {
+          answer = probs.full;
+          break;
+        }
+        if (child.timedOut) break;
+        if (code === 2) return stop(`${backend} arm stopped: usage error`);
+        if (code === 3) return stop(backend === 'jev' ? 'jev arm stopped: key rejected' : 'deem arm stopped: backend refused');
+        if (code === 130) return stop(`${backend} arm stopped: interrupted`);
+        if (code === 4 && attempt === 1) {
+          if (backend === 'jev') {
+            await new Promise((done) => { setTimeout(done, ctx.backoffMs ?? 2000); });
+          } else {
+            const health = readDeemHealth(gate.cmd, env);
+            if (!health.ok) return stop('deem arm stopped: server gone');
+            if (health.model !== gate.model || health.modelCommit !== gate.modelCommit || health.sourceCommit !== gate.sourceCommit) {
+              return stop('deem arm stopped: model commit changed mid-run');
+            }
+          }
+          attempt = 2;
+          continue;
+        }
+        break;
+      }
+      answersByRow[row.id].push(answer);
+    }
+    finished += 1;
+  }
+
+  const s = judgeColumn(backend, rows, answersByRow, walls, census);
+  out(`${backend}: calls=${walls.length} timeouts=${timeouts}`);
+  out(columnLine(s));
+  s.identity = identity;
+  s.line = verdictLineFor(s, backend === 'jev'
+    ? `jev_version=${JEV_VERSION} provider=${gate.provider} model=${model}`
+    : `model=${gate.model} model_commit=${gate.modelCommit} source_commit=${gate.sourceCommit}`);
+  out(s.line);
+  return s;
+}
+
+/**
+ * Machine-readable report for one run: the printed census lines, the zero-call
+ * advisor timing, the headroom line, and one entry per model column. A column
+ * that reached its verdict lands under columns; one that stopped early lands
+ * under stopped with its stop line.
+ * @param {string[]} censusLines - The printed census summary lines.
+ * @param {Awaited<ReturnType<typeof timeAdvisor>>} timing - The advisor child timing.
+ * @param {string|null} headroom - The headroom stop line, or null when there is headroom.
+ * @param {object|undefined} jevResult - The Jev column verdict or stop record.
+ * @param {object|undefined} deemResult - The Deem column verdict or stop record.
+ * @returns {{ census: string[], advisor: { children: number, p50_ms: number|null, p95_ms: number|null, max_ms: number|null, over_2200: number, killed: number }, headroom: string, columns: Record<string, object>, stopped: Record<string, string> }}
+ */
+export function buildReport(censusLines, timing, headroom, jevResult, deemResult) {
+  const report = {
+    census: censusLines,
+    advisor: {
+      children: timing.n,
+      p50_ms: timing.p50,
+      p95_ms: timing.p95,
+      max_ms: timing.max,
+      over_2200: timing.over2200,
+      killed: timing.killed,
+    },
+    headroom: headroom ?? 'ok',
+    columns: {},
+    stopped: {},
+  };
+  for (const [name, result] of [['jev', jevResult], ['deem', deemResult]]) {
+    if (result === undefined) continue;
+    if ('stopped' in result) {
+      report.stopped[name] = result.stopped;
+      continue;
+    }
+    report.columns[name] = {
+      rows: result.K,
+      measured: result.M,
+      ties: result.ties,
+      abstentions: result.abstentions,
+      baseline: result.baseline,
+      calls: result.calls,
+      p50_ms: result.p50,
+      verdict: {
+        outcome: result.verdict,
+        line: result.line,
+        K: result.K,
+        M: result.M,
+        W: result.W,
+        L: result.L,
+        F: result.F,
+        p: result.p,
+        p_loss: result.pLoss,
+        mrr_column: result.M === 0 ? null : result.sa / result.M,
+        mrr_baseline: result.M === 0 ? null : result.sb / result.M,
+        p95_ms: result.t,
+        ...result.identity,
+      },
+    };
+  }
+  return report;
+}
+
+/**
+ * Prints the zero-call order comparison by default, or answers one child job
+ * from stdin. A bad flag returns 2, and a model arm without --out returns 2
+ * before any stdout line.
+ * @param {string[]} argv - Arguments after the script path.
+ * @param {Object} [deps] - Census, timing, writer, environment, stdin and child replacements.
+ * @param {Awaited<ReturnType<typeof loadCensus>>} [deps.census] - Pre-scored census. Default loadCensus().
+ * @param {Awaited<ReturnType<typeof timeAdvisor>>} [deps.timing] - Pre-measured advisor timing. Default timeAdvisor().
+ * @param {(line: string) => void} [deps.out] - Line writer. Default writes the line plus '\n' to stdout.
+ * @param {Record<string, string | undefined>} [deps.env] - Default process.env.
+ * @param {string} [deps.stdinText] - Child job JSON. Default reads fd 0.
+ * @param {string} [deps.childFile] - Timed child path. Default this file.
+ * @param {number} [deps.timeoutMs] - Timed child kill time. Default CHILD_TIMEOUT_MS.
+ * @param {number} [deps.backoffMs] - Wait before the single Jev exit-4 retry. Default 2000.
+ * @param {(prompt: string) => Promise<void>} [deps.runAdvisor] - Advisor replacement inside the child.
+ * @returns {Promise<number>}
+ */
+export async function main(argv, deps = {}) {
+  let parsed;
+  try {
+    parsed = parseArgs({
+      args: argv,
+      strict: true,
+      allowPositionals: false,
+      options: {
+        jev: { type: 'boolean' },
+        deem: { type: 'boolean' },
+        out: { type: 'string' },
+        child: { type: 'boolean' },
+      },
+    });
+  } catch (error) {
+    process.stderr.write(`${error.message}\n`);
+    return 2;
+  }
+
+  const { values } = parsed;
+  if (values.child === true) {
+    const text = deps.stdinText ?? readFileSync(0, 'utf8');
+    const result = await childMain(text, deps);
+    await new Promise((done) => {
+      process.stdout.write(`${JSON.stringify(result)}\n`, done);
+    });
+    return 0;
+  }
+
+  // A model arm must leave its call record behind, so both arms need --out.
+  if ((values.jev === true || values.deem === true) && (typeof values.out !== 'string' || values.out === '')) {
+    process.stderr.write('--jev and --deem need --out <dir> so every call is recorded\n');
+    return 2;
+  }
+
+  const out = deps.out ?? ((line) => process.stdout.write(`${line}\n`));
+  const env = deps.env ?? process.env;
+  const census = deps.census ?? await loadCensus();
+  const summary = summarizeCensus(census);
+  const censusLines = [];
+  for (const line of summary.lines) {
+    // This eval's own movable-row rule replaces those two census stop lines.
+    if (line === 'no headroom' || line === 'underpowered') continue;
+    out(line);
+    censusLines.push(line);
+  }
+  if (summary.voided) return 1;
+
+  const timing = deps.timing ?? await timeAdvisor(census.rows.map((row) => row.prompt), { env: childEnv(env), childFile: deps.childFile });
+  out(advisorLine(timing));
+
+  const eligible = census.rows.filter((row) => classifyRow(row, census.isMatch) !== 'ineligible');
+  const deemRows = eligible.filter((row) => row.cluster.length <= DEEM_MAX_KEYS);
+  const headroom = headroomLine(summary.movable, timing.p95);
+  out(headroom ?? `planned calls: jev=${eligible.length * PASSES + 1} deem=${deemRows.length * PASSES}`);
+  out(`margin: ${MARGIN}`);
+  out(KEEP_RULE_LINE);
+  let jevResult;
+  let deemResult;
+  if (headroom === null) {
+    const armCtx = {
+      out,
+      env: childEnv(env),
+      outDir: values.out,
+      childFile: deps.childFile,
+      timeoutMs: deps.timeoutMs,
+      backoffMs: deps.backoffMs,
+      advisorP50: timing.p50,
+    };
+    // Jev runs first, each gate runs once, and a failed gate never starts the other backend.
+    if (values.jev === true) {
+      const gate = jevGate({ out, env, timeoutMs: GATE_TIMEOUT_MS });
+      if (gate.passed) jevResult = await runArm('jev', census, gate, armCtx);
+    }
+    if (values.deem === true) {
+      const gate = deemGate({ out, env });
+      if (gate.passed) deemResult = await runArm('deem', census, gate, armCtx);
+    }
+  }
+  if (values.jev === true || values.deem === true) {
+    mkdirSync(values.out, { recursive: true });
+    writeFileSync(join(values.out, 'report.json'), `${JSON.stringify(buildReport(censusLines, timing, headroom, jevResult, deemResult), null, 2)}\n`);
+  }
+  return 0;
+}
+
+if (process.argv[1] && realpathSync(process.argv[1]) === realpathSync(SELF)) {
+  const code = await main(process.argv.slice(2));
+  // The hook module and the advisor CLI it spawns can hold the event loop open.
+  if (process.argv.includes('--child')) process.exit(code);
+  else process.exitCode = code;
+}
diff --git a/.skilled/skills/system-skill-advisor/runtime/tests/parity/score-suggested-order.vitest.ts b/.skilled/skills/system-skill-advisor/runtime/tests/parity/score-suggested-order.vitest.ts
new file mode 100644
index 0000000000..60094365d3
--- /dev/null
+++ b/.skilled/skills/system-skill-advisor/runtime/tests/parity/score-suggested-order.vitest.ts
@@ -0,0 +1,856 @@
+// ───────────────────────────────────────────────────────────────
+// MODULE: Suggested Cluster Order Eval Tests
+// ───────────────────────────────────────────────────────────────
+// Offline checks with synthetic rows, stub binaries and stub children. No model call.
+
+import { spawnSync } from 'node:child_process';
+import { existsSync, mkdtempSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
+import { tmpdir } from 'node:os';
+import { dirname, join, resolve } from 'node:path';
+import { fileURLToPath, pathToFileURL } from 'node:url';
+
+import { describe, expect, it, vi } from 'vitest';
+
+import {
+  nearestRank,
+  rotations,
+  optionArgs,
+  readProbabilities,
+  topKey,
+  orderFromMaps,
+  judgeColumn,
+  verdictLineFor,
+  columnLine,
+  childMain,
+  runTimedChild,
+  childEnv,
+  timeAdvisor,
+  advisorLine,
+  headroomLine,
+  buildReport,
+  main,
+  runArm,
+} from '../../scripts/routing-accuracy/score-suggested-order.mjs';
+
+const SCRIPT = resolve(dirname(fileURLToPath(import.meta.url)), '../../scripts/routing-accuracy/score-suggested-order.mjs');
+
+function makeBin(name: string, body: string) {
+  const dir = mkdtempSync(join(tmpdir(), 'suggested-order-stub-'));
+  writeFileSync(join(dir, name), `#!/bin/sh\nD=$(dirname "$0")\necho "$*" >> "$D/${name}.log"\n${body}\n`, { mode: 0o755 });
+  return dir;
+}
+
+function stubChild() {
+  const dir = mkdtempSync(join(tmpdir(), 'suggested-order-child-'));
+  const file = join(dir, 'child.mjs');
+  const lines = [
+    `import { childMain } from '${pathToFileURL(SCRIPT).href}';`,
+    "let text = '';",
+    "process.stdin.setEncoding('utf8');",
+    "process.stdin.on('data', (chunk) => { text += chunk; });",
+    "process.stdin.on('end', async () => {",
+    '  const job = JSON.parse(text);',
+    "  const ms = job.prompt.startsWith('slow') ? 5000 : job.prompt.startsWith('late') ? 2300 : 0;",
+    '  const result = await childMain(text, { runAdvisor: () => new Promise((done) => setTimeout(done, ms)) });',
+    '  process.stdout.write(`${JSON.stringify(result)}\\n`, () => process.exit(0));',
+    '});',
+  ];
+  writeFileSync(file, `${lines.join('\n')}\n`);
+  return file;
+}
+
+function nodeBin(name: string, js: string) {
+  const dir = mkdtempSync(join(tmpdir(), 'suggested-order-node-'));
+  writeFileSync(join(dir, `${name}.cjs`), js);
+  writeFileSync(join(dir, name), `#!/bin/sh\nexec "${process.execPath}" "$(dirname "$0")/${name}.cjs" "$@"\n`, { mode: 0o755 });
+  return dir;
+}
+
+const DEEM_STUB = `const fs = require('node:fs');
+const path = require('node:path');
+const args = process.argv.slice(2);
+fs.appendFileSync(path.join(__dirname, 'cli-deem.log'), args.join(' ') + '\\n');
+if (args[0] === 'health') {
+  process.stdout.write(JSON.stringify({ ok: true, backend: 'torch', model: 'deem-0.8-v1', model_commit: 'abc1234', source_commit: 'def5678' }) + '\\n', () => process.exit(0));
+}
+if (process.env.STUB_MODE === 'refuse') process.exit(3);
+let text = '';
+process.stdin.setEncoding('utf8');
+process.stdin.on('data', (chunk) => { text += chunk; });
+process.stdin.on('end', () => {
+  const keys = [];
+  for (let i = 0; i < args.length; i += 1) {
+    if (args[i] === '-o') keys.push(args[i + 1].split('=')[0]);
+  }
+  const probabilities = {};
+  for (const key of keys) probabilities[key] = key === 'g' ? 0.7 : 0.3 / (keys.length - 1);
+  if (text.startsWith('partial')) delete probabilities.none;
+  process.stdout.write(JSON.stringify({ answers: { answer: { choice: 'g', probabilities } } }) + '\\n');
+});
+`;
+
+const JEV_STUB = `const fs = require('node:fs');
+const path = require('node:path');
+const args = process.argv.slice(2);
+fs.appendFileSync(path.join(__dirname, 'jev.log'), args.join(' ') + '\\n');
+if (args[0] === '--version') {
+  process.stdout.write('jev 0.6.2\\n', () => process.exit(0));
+}
+if (args[0] === 'auth' && args[1] === 'status') process.exit(0);
+if (args[0] === 'auth' && args[1] === 'test') {
+  if (process.env.STUB_AUTH === '3') process.exit(3);
+  process.stdout.write('{"model":"stub-model"}\\n', () => process.exit(0));
+}
+let text = '';
+process.stdin.setEncoding('utf8');
+process.stdin.on('data', (chunk) => { text += chunk; });
+process.stdin.on('end', () => {
+  if (text.startsWith('busy') && !fs.existsSync(path.join(__dirname, 'busy.done'))) {
+    fs.writeFileSync(path.join(__dirname, 'busy.done'), '');
+    process.exit(4);
+  }
+  const keys = [];
+  for (let i = 0; i < args.length; i += 1) {
+    if (args[i] === '-o') keys.push(args[i + 1].split('=')[0]);
+  }
+  const probabilities = {};
+  for (const key of keys) probabilities[key] = key === 'g' ? 0.7 : 0.3 / (keys.length - 1);
+  if (text.startsWith('partial')) delete probabilities.none;
+  process.stdout.write(JSON.stringify({ answers: { answer: { choice: 'g', probabilities } } }) + '\\n');
+});
+`;
+
+describe('score-suggested-order pure helpers', () => {
+  it('nearestRank takes the nearest-rank quantile and leaves its input in place', () => {
+    const values = [5, 1, 3];
+    expect(nearestRank(values, 0.5)).toBe(3);
+    expect(values).toEqual([5, 1, 3]);
+    expect(nearestRank([], 0.95)).toBeNull();
+    expect(nearestRank(Array.from({ length: 20 }, (_, index) => index + 1), 0.95)).toBe(19);
+  });
+
+  it('rotations returns the three left rotations of the keys', () => {
+    expect(rotations(['a', 'b', 'none'])).toEqual([
+      ['a', 'b', 'none'],
+      ['b', 'none', 'a'],
+      ['none', 'a', 'b'],
+    ]);
+  });
+
+  it('optionArgs labels each key and disambiguates equal descriptions', () => {
+    const texts: Record<string, string> = { a: 'same', b: 'same', c: 'other' };
+    expect(optionArgs(['a', 'b', 'c', 'none'], (key: string) => texts[key], ['a', 'b', 'c'])).toEqual([
+      '-o',
+      'a=same [a]',
+      '-o',
+      'b=same [b]',
+      '-o',
+      'c=other',
+      '-o',
+      'none=None of these skills fits the request',
+    ]);
+  });
+
+  it('readProbabilities returns the raw map and a full-coverage copy', () => {
+    const stdout = JSON.stringify({ answers: { answer: { choice: 'a', probabilities: { a: 0.6, b: 0.3, none: 0.1 } } } });
+    const { raw, full } = readProbabilities(stdout, ['a', 'b', 'none']);
+    expect(full).toEqual({ a: 0.6, b: 0.3, none: 0.1 });
+    expect(raw).toEqual({ a: 0.6, b: 0.3, none: 0.1 });
+    expect(full).not.toBe(raw);
+  });
+
+  it('readProbabilities nulls the full map on a missing key or a non-number', () => {
+    const withoutNone = JSON.stringify({ answers: { answer: { probabilities: { a: 0.6, b: 0.4 } } } });
+    const missing = readProbabilities(withoutNone, ['a', 'b', 'none']);
+    expect(missing.full).toBeNull();
+    expect(missing.raw).toEqual({ a: 0.6, b: 0.4 });
+    expect(readProbabilities('oops', ['a', 'b', 'none'])).toEqual({ raw: null, full: null });
+    const stringValue = JSON.stringify({ answers: { answer: { probabilities: { a: '0.6', b: 0.4, none: 0 } } } });
+    expect(readProbabilities(stringValue, ['a', 'b', 'none']).full).toBeNull();
+  });
+
+  it('topKey returns the first key with the highest value', () => {
+    expect(topKey({ a: 0.2, b: 0.5, none: 0.3 }, ['a', 'b', 'none'])).toBe('b');
+    expect(topKey({ a: 0.4, b: 0.4, none: 0.2 }, ['a', 'b', 'none'])).toBe('a');
+  });
+
+  it('orderFromMaps sorts the cluster by mean probability across the passes', () => {
+    const row = { order: ['a', 'x', 'b', 'c'], cluster: ['a', 'b', 'c'] };
+    const maps = [
+      { a: 0.1, b: 0.6, c: 0.2, none: 0.1 },
+      { a: 0.1, b: 0.5, c: 0.3, none: 0.1 },
+      { a: 0.2, b: 0.4, c: 0.3, none: 0.1 },
+    ];
+    expect(orderFromMaps(row, maps)).toEqual({ order: ['b', 'x', 'c', 'a'], abstained: false });
+  });
+
+  it('orderFromMaps keeps the cluster order when the means tie', () => {
+    const row = { order: ['a', 'b'], cluster: ['a', 'b'] };
+    const maps = [
+      { a: 0.4, b: 0.4, none: 0.2 },
+      { a: 0.4, b: 0.4, none: 0.2 },
+      { a: 0.4, b: 0.4, none: 0.2 },
+    ];
+    expect(orderFromMaps(row, maps)).toEqual({ order: ['a', 'b'], abstained: false });
+  });
+
+  it('orderFromMaps abstains when none leads every cluster key', () => {
+    const row = { order: ['a', 'b'], cluster: ['a', 'b'] };
+    const maps = [
+      { a: 0.2, b: 0.3, none: 0.5 },
+      { a: 0.2, b: 0.3, none: 0.5 },
+      { a: 0.2, b: 0.3, none: 0.5 },
+    ];
+    expect(orderFromMaps(row, maps)).toEqual({ order: ['a', 'b'], abstained: true });
+  });
+});
+
+const strict = (a: string | null, g: string) => a === g;
+
+function rowOf(id: string, cluster: string[]) {
+  return {
+    id,
+    gold: 'g',
+    order: [...cluster, 'z'],
+    cluster,
+    confidence: { [cluster[0]]: 0.9, [cluster[1]]: 0.8, z: 0.1 },
+  };
+}
+
+function favor(k: string, cluster: string[]) {
+  const keys = [...cluster, 'none'];
+  const map: Record<string, number> = {};
+  for (const key of keys) map[key] = key === k ? 0.7 : 0.3 / (keys.length - 1);
+  return map;
+}
+
+type Row = ReturnType<typeof rowOf>;
+
+describe('score-suggested-order keep rule', () => {
+  const walls = Array.from({ length: 60 }, () => 800);
+
+  function rowsOf(mCount: number, fCount: number): Row[] {
+    return [
+      ...Array.from({ length: mCount }, (_, index) => rowOf(`m${index + 1}`, ['a', 'g'])),
+      ...Array.from({ length: fCount }, (_, index) => rowOf(`f${index + 1}`, ['g', 'a'])),
+    ];
+  }
+
+  function answersOf(rows: Row[], pick: (row: Row) => string) {
+    const answersByRow: Record<string, Array<Record<string, number> | null>> = {};
+    for (const row of rows) {
+      const map = favor(pick(row), row.cluster);
+      answersByRow[row.id] = [map, map, map];
+    }
+    return answersByRow;
+  }
+
+  it('keeps a column that wins every decided row', () => {
+    const rows = rowsOf(10, 10);
+    const answersByRow = answersOf(rows, () => 'g');
+    const s = judgeColumn('deem', rows, answersByRow, walls, { isMatch: strict });
+    expect(s.verdict).toBe('keep');
+    expect(s.baseline).toBe('scorer');
+    expect(s.W).toBe(10);
+    expect(s.L).toBe(0);
+    expect(verdictLineFor(s, 'model=x')).toBe(
+      'verdict deem: keep K=20 M=20 W=10 L=0 F=0 p=0.0010 mrr=1.0000/0.7500 p95_ms=800 model=x',
+    );
+    expect(columnLine(s).startsWith('column deem: rows=20 measured=20 wins=10 losses=0')).toBe(true);
+  });
+
+  it('kills a column that loses every decided row', () => {
+    const rows = rowsOf(0, 20);
+    const answersByRow = {
+      ...answersOf(rows.slice(0, 10), () => 'a'),
+      ...answersOf(rows.slice(10), () => 'g'),
+    };
+    const s = judgeColumn('deem', rows, answersByRow, walls, { isMatch: strict });
+    expect(s.verdict).toBe('kill');
+    expect(s.W).toBe(0);
+    expect(s.L).toBe(10);
+  });
+
+  it('stops on coverage when too few rows are measured', () => {
+    const rows = rowsOf(10, 10);
+    const answersByRow = answersOf(rows, () => 'g');
+    for (const id of ['m1', 'm2', 'm3']) {
+      answersByRow[id] = [favor('g', ['a', 'g']), favor('g', ['a', 'g']), null];
+    }
+    const s = judgeColumn('deem', rows, answersByRow, walls, { isMatch: strict });
+    expect(s.M).toBe(17);
+    expect(s.verdict).toBe('stop (coverage)');
+  });
+
+  it('stops on margin when one win cannot clear the baseline gap', () => {
+    const rows = rowsOf(1, 19);
+    const answersByRow = answersOf(rows, () => 'g');
+    const s = judgeColumn('deem', rows, answersByRow, walls, { isMatch: strict });
+    expect(s.baseline).toBe('scorer');
+    expect(s.W).toBe(1);
+    expect(s.L).toBe(0);
+    expect(s.verdict).toBe('stop (margin)');
+  });
+
+  it('stops on the sign test when too few rows decide', () => {
+    const rows = rowsOf(4, 4);
+    const answersByRow = answersOf(rows, () => 'g');
+    const s = judgeColumn('deem', rows, answersByRow, walls, { isMatch: strict });
+    expect(s.baseline).toBe('scorer');
+    expect(s.W).toBe(4);
+    expect(s.L).toBe(0);
+    expect(s.verdict).toBe('stop (sign test)');
+  });
+
+  it('stops on flips when one answer in each row disagrees with the other two', () => {
+    const rows = rowsOf(10, 10);
+    const answersByRow = answersOf(rows, () => 'g');
+    for (const row of rows.slice(10)) {
+      answersByRow[row.id] = [favor('g', row.cluster), favor('g', row.cluster), favor('a', row.cluster)];
+    }
+    const s = judgeColumn('deem', rows, answersByRow, walls, { isMatch: strict });
+    expect(s.F).toBe(10);
+    expect(s.verdict).toBe('stop (flips)');
+  });
+
+  it('stops on latency when the p95 wall exceeds the advisor budget', () => {
+    const rows = rowsOf(10, 10);
+    const answersByRow = answersOf(rows, () => 'g');
+    const slowWalls = [...Array.from({ length: 56 }, () => 800), ...Array.from({ length: 4 }, () => 2500)];
+    const s = judgeColumn('deem', rows, answersByRow, slowWalls, { isMatch: strict });
+    expect(s.t).toBe(2500);
+    expect(s.verdict).toBe('stop (latency)');
+  });
+
+  it('names the best zero-call order as the baseline when the column cannot beat it', () => {
+    const rows = rowsOf(10, 0);
+    const answersByRow = answersOf(rows, () => 'g');
+    const s = judgeColumn('deem', rows, answersByRow, walls, { isMatch: strict });
+    expect(s.baseline).toBe('always_second');
+    expect(s.W).toBe(0);
+    expect(s.L).toBe(0);
+    expect(s.verdict).toBe('stop (margin)');
+  });
+});
+
+describe('score-suggested-order timed child', () => {
+  it('runs health, then the call with the prompt on stdin', async () => {
+    const bin = makeBin('cli-deem', `case "$1" in health) exit 0;; choice) cat > "$D/stdin.txt"; echo '{"ok":true}';; esac`);
+    const job = {
+      prompt: 'hello prompt',
+      health: [join(bin, 'cli-deem')],
+      call: { cmd: [join(bin, 'cli-deem')], args: ['choice', '-q', 'Q'] },
+    };
+    const result = await childMain(JSON.stringify(job), { runAdvisor: async () => {} });
+    expect(result.healthCode).toBe(0);
+    expect(result.code).toBe(0);
+    expect(result.stdout.trim()).toBe('{"ok":true}');
+    expect(typeof result.advisorMs).toBe('number');
+    expect(readFileSync(join(bin, 'cli-deem.log'), 'utf8').trim().split('\n')).toEqual(['health', 'choice -q Q']);
+    expect(readFileSync(join(bin, 'stdin.txt'), 'utf8')).toBe('hello prompt');
+  });
+
+  it('skips the call when the health check fails', async () => {
+    const bin = makeBin('cli-deem', `case "$1" in health) exit 4;; esac`);
+    const job = {
+      prompt: 'hello prompt',
+      health: [join(bin, 'cli-deem')],
+      call: { cmd: [join(bin, 'cli-deem')], args: ['choice', '-q', 'Q'] },
+    };
+    const result = await childMain(JSON.stringify(job), { runAdvisor: async () => {} });
+    expect(result.healthCode).toBe(4);
+    expect(result.code).toBe(4);
+    expect(result.callMs).toBeNull();
+    expect(readFileSync(join(bin, 'cli-deem.log'), 'utf8').trim().split('\n')).toEqual(['health']);
+    expect(existsSync(join(bin, 'stdin.txt'))).toBe(false);
+  });
+
+  it('returns a finished child result with its wall time', async () => {
+    const out = await runTimedChild({ prompt: 'quick' }, { childFile: stubChild() });
+    expect(out.timedOut).toBe(false);
+    expect(typeof out.result?.advisorMs).toBe('number');
+    expect(out.wallMs).toBeGreaterThan(0);
+  });
+
+  it('kills a child that overruns the timeout', async () => {
+    const started = Date.now();
+    const out = await runTimedChild({ prompt: 'slow one' }, { childFile: stubChild() });
+    expect(out.timedOut).toBe(true);
+    expect(out.wallMs).toBe(2500);
+    expect(out.result).toBeNull();
+    expect(Date.now() - started).toBeLessThan(4000);
+  });
+
+  it('childEnv gives the advisor its budget and a short daemon idle timeout', () => {
+    const env = childEnv({ A: '1' });
+    expect(env.A).toBe('1');
+    expect(env.SPECKIT_CLAUDE_HOOK_TIMEOUT_MS).toBe('2200');
+    expect(env.SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN).toBe('1');
+    expect(childEnv({ SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN: '5' }).SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN).toBe('5');
+  });
+});
+
+describe('score-suggested-order advisor timing and headroom', () => {
+  it('times the advisor child on each prompt and reports the latency stop', async () => {
+    const t = await timeAdvisor(['late a', 'late b'], { childFile: stubChild() });
+    expect(t.n).toBe(2);
+    expect(t.over2200).toBe(2);
+    expect(t.p95).toBeGreaterThan(2200);
+    expect(headroomLine(23, t.p95)).toBe('no headroom (latency)');
+  }, 30_000);
+
+  it('advisorLine rounds the quantiles and prints none for an empty sample', () => {
+    expect(advisorLine({ n: 241, p50: 812.4, p95: 1103, max: 2281, over2200: 1, killed: 0, walls: [] })).toBe(
+      'advisor child: p50=812 p95=1103 max=2281 over_2200=1 children=241 killed=0',
+    );
+    expect(advisorLine({ n: 0, p50: null, p95: null, max: null, over2200: 0, killed: 0, walls: [] })).toBe(
+      'advisor child: p50=none p95=none max=none over_2200=0 children=0 killed=0',
+    );
+  });
+
+  it('headroomLine stops on movable first, then on latency', () => {
+    expect(headroomLine(4, 800)).toBe('no headroom (movable)');
+    expect(headroomLine(5, 2200)).toBeNull();
+    expect(headroomLine(23, 2201)).toBe('no headroom (latency)');
+    expect(headroomLine(23, null)).toBe('no headroom (latency)');
+  });
+});
+
+function censusOf(movable: number, correct = 53) {
+  const specs = [
+    ...Array.from({ length: movable }, (_, index) => ({ id: `m${index + 1}`, cluster: ['a', 'g'], file: 'labeled' })),
+    ...Array.from({ length: 4 }, (_, index) => ({ id: `f${index + 1}`, cluster: ['g', 'a'], file: 'holdout' })),
+    { id: 'solo', cluster: ['g'], file: 'holdout' },
+  ];
+  const rows = specs.map((spec, index) => {
+    const keys = [...spec.cluster, 'z'];
+    const confidence: Record<string, number> = {};
+    const score: Record<string, number> = {};
+    keys.forEach((key, keyIndex) => {
+      confidence[key] = 0.9 - 0.1 * keyIndex;
+      score[key] = 0.5 - 0.01 * keyIndex;
+    });
+    return {
+      ...spec,
+      split: index % 2 === 0 ? 'train' : 'test',
+      prompt: `prompt ${spec.id}`,
+      gold: 'g',
+      goldKey: 'g',
+      order: keys,
+      tau03: false,
+      confidence,
+      score,
+    };
+  });
+  return { holdoutTop1: { correct, total: 70 }, labels: [], isMatch: strict, describe: (s: string) => `desc ${s}`, rows };
+}
+
+const timing = { n: 11, p50: 800, p95: 900, max: 1000, over2200: 0, killed: 0, walls: [] };
+
+const KEEP_RULE = 'keep rule: coverage 10*M>=9*K, kill P(X>=L)<=0.05, margin 20*(SA-SB)>=M, sign test P(X>=W)<0.05, flips 10*F<=3*M, latency p95<=2200ms';
+
+describe('score-suggested-order entry point', () => {
+  it('returns 2 on an unknown flag', async () => {
+    expect(await main(['--bogus'])).toBe(2);
+  });
+
+  it('refuses a model arm without --out before any call', async () => {
+    const out = vi.fn();
+    expect(await main(['--jev'], { out })).toBe(2);
+    expect(out).not.toHaveBeenCalled();
+
+    const deemDir = makeBin('cli-deem', '');
+    const child = spawnSync(process.execPath, [SCRIPT, '--deem'], {
+      encoding: 'utf8',
+      env: { ...process.env, PATH: `${deemDir}:${process.env.PATH}` },
+      timeout: 20_000,
+    });
+    expect(child.status).toBe(2);
+    expect(child.stdout).toBe('');
+    expect(child.stderr).toContain('--jev and --deem need --out <dir>');
+    expect(existsSync(join(deemDir, 'cli-deem.log'))).toBe(false);
+  });
+
+  it('defaults to the zero-call comparison and the planned calls', async () => {
+    const jevDir = makeBin('jev', '');
+    const deemDir = makeBin('cli-deem', '');
+    const env = { ...process.env, PATH: `${jevDir}:${deemDir}:${process.env.PATH}` };
+    const out = vi.fn();
+    expect(await main([], { census: censusOf(6), timing, out, env })).toBe(0);
+    const lines = out.mock.calls.map(([line]) => line);
+    expect(lines).toContain('baseline: holdout_top1=53/70');
+    for (const name of ['scorer', 'confidence', 'always_second']) {
+      expect(lines.some((line) => line.startsWith(`comparator: name=${name}`))).toBe(true);
+    }
+    expect(lines.some((line) => line.startsWith('power: movable=6'))).toBe(true);
+    expect(lines.slice(-4)).toEqual([
+      'advisor child: p50=800 p95=900 max=1000 over_2200=0 children=11 killed=0',
+      'planned calls: jev=31 deem=30',
+      'margin: 0.05',
+      KEEP_RULE,
+    ]);
+    expect(existsSync(join(jevDir, 'jev.log'))).toBe(false);
+    expect(existsSync(join(deemDir, 'cli-deem.log'))).toBe(false);
+  });
+
+  it('stops on movable before planning any call', async () => {
+    const out = vi.fn();
+    expect(await main([], { census: censusOf(4), timing, out })).toBe(0);
+    const lines = out.mock.calls.map(([line]) => line);
+    expect(lines).toContain('no headroom (movable)');
+    expect(lines.some((line) => line.startsWith('planned calls:'))).toBe(false);
+    expect(lines).not.toContain('underpowered');
+  });
+
+  it('returns 1 and prints no timing when the holdout baseline moved', async () => {
+    const out = vi.fn();
+    expect(await main([], { census: censusOf(6, 52), timing, out })).toBe(1);
+    const lines = out.mock.calls.map(([line]) => line);
+    expect(lines).toContain('baseline mismatch: comparison void');
+    expect(lines.some((line) => line.startsWith('advisor child:'))).toBe(false);
+  });
+
+  it('answers one child job with a single JSON line on stdout', async () => {
+    const chunks: string[] = [];
+    const write = vi.spyOn(process.stdout, 'write').mockImplementation(((
+      chunk: string | Uint8Array,
+      callback?: (error?: Error) => void,
+    ) => {
+      chunks.push(String(chunk));
+      if (typeof callback === 'function') callback();
+      return true;
+    }) as typeof process.stdout.write);
+    try {
+      const code = await main(['--child'], { stdinText: JSON.stringify({ prompt: 'p' }), runAdvisor: async () => {} });
+      expect(code).toBe(0);
+      const line = JSON.parse(chunks.join('').trim());
+      expect(typeof line.advisorMs).toBe('number');
+      expect(line.code).toBeNull();
+    } finally {
+      write.mockRestore();
+    }
+  });
+});
+
+function deemRow(id: string, prompt: string, cluster: string[] = ['a', 'g']) {
+  return { ...rowOf(id, cluster), prompt };
+}
+
+function readCalls(outDir: string) {
+  return readFileSync(join(outDir, 'calls.jsonl'), 'utf8')
+    .split('\n')
+    .filter((line) => line !== '')
+    .map((line) => JSON.parse(line));
+}
+
+function deemRun(stubMode?: string) {
+  const dir = nodeBin('cli-deem', DEEM_STUB);
+  const outDir = mkdtempSync(join(tmpdir(), 'suggested-order-calls-'));
+  const out = vi.fn();
+  const gate = { cmd: [join(dir, 'cli-deem')], model: 'deem-0.8-v1', modelCommit: 'abc1234', sourceCommit: 'def5678' };
+  const ctx = {
+    out,
+    env: { ...process.env, STUB_MODE: stubMode },
+    outDir,
+    childFile: stubChild(),
+    advisorP50: 800,
+  };
+  return { dir, outDir, gate, ctx, lines: () => out.mock.calls.map(([line]) => line as string) };
+}
+
+describe('score-suggested-order deem arm', () => {
+  it('asks every row three times inside timed children and records each call', async () => {
+    const { dir, outDir, gate, ctx, lines } = deemRun();
+    const rows = Array.from({ length: 6 }, (_, index) => deemRow(`p${index + 1}`, `p${index + 1}`));
+    const census = { rows, isMatch: strict, describe: (s: string) => `desc ${s}` };
+    await runArm('deem', census, gate, ctx);
+    expect(lines()).toContain('deem: nothing leaves the machine planned_calls=18 est_wall_s=18.7');
+    expect(lines()).toContain('question: Which skill should handle this request?');
+    const verdict = lines().find((line) => line.startsWith('verdict deem:'));
+    expect(verdict?.startsWith('verdict deem: stop (margin) K=6 M=6 W=0 L=0 F=0')).toBe(true);
+    expect(verdict?.endsWith('model=deem-0.8-v1 model_commit=abc1234 source_commit=def5678')).toBe(true);
+    const calls = readCalls(outDir);
+    expect(calls).toHaveLength(18);
+    for (const call of calls) {
+      expect(typeof call.child_wall_ms).toBe('number');
+      expect(call.model_commit).toBe('abc1234');
+      expect(call.source_commit).toBe('def5678');
+      expect(call.status).toBe('measured');
+      expect(Object.keys(call.probabilities).sort()).toEqual(['a', 'g', 'none']);
+    }
+    const log = readFileSync(join(dir, 'cli-deem.log'), 'utf8').trim().split('\n');
+    expect(log.filter((line) => line === 'health')).toHaveLength(18);
+    const choices = log.filter((line) => line.startsWith('choice'));
+    expect(choices[0]).toContain('-o a=desc a -o g=desc g -o none=None of these skills fits the request');
+    expect(choices[1]).toContain('-o g=desc g -o none=None of these skills fits the request -o a=desc a');
+  }, 60_000);
+
+  it('records a call the classifier cannot fully answer as unmeasured', async () => {
+    const { outDir, gate, ctx, lines } = deemRun();
+    const rows = [
+      ...Array.from({ length: 5 }, (_, index) => deemRow(`p${index + 1}`, `p${index + 1}`)),
+      deemRow('six', 'partial six'),
+    ];
+    const census = { rows, isMatch: strict, describe: (s: string) => `desc ${s}` };
+    await runArm('deem', census, gate, ctx);
+    const column = lines().find((line) => line.startsWith('column deem:'));
+    expect(column).toContain('rows=6 measured=5');
+    const partial = readCalls(outDir).filter((call) => call.row_id === 'six');
+    expect(partial).toHaveLength(3);
+    for (const call of partial) {
+      expect(call.status).toBe('unmeasured');
+      expect(call.probabilities).not.toHaveProperty('none');
+    }
+  }, 60_000);
+
+  it('records a killed child at the timeout and stops on the latency p95', async () => {
+    const { outDir, gate, ctx, lines } = deemRun();
+    const rows = [
+      ...Array.from({ length: 10 }, (_, index) => deemRow(`m${index + 1}`, `p${index + 1}`)),
+      ...Array.from({ length: 8 }, (_, index) => deemRow(`f${index + 1}`, `f${index + 1}`, ['g', 'a'])),
+      deemRow('slow1', 'slow 1'),
+      deemRow('slow2', 'slow 2'),
+    ];
+    const census = { rows, isMatch: strict, describe: (s: string) => `desc ${s}` };
+    await runArm('deem', census, gate, ctx);
+    const slow = readCalls(outDir).filter((call) => call.row_id === 'slow1' || call.row_id === 'slow2');
+    expect(slow).toHaveLength(6);
+    for (const call of slow) {
+      expect(call.status).toBe('unmeasured_timeout');
+      expect(call.child_wall_ms).toBe(2500);
+    }
+    const verdict = lines().find((line) => line.startsWith('verdict deem:'));
+    expect(verdict?.startsWith('verdict deem: stop (latency) K=20 M=18 W=8 L=0 F=0 p=0.0039 mrr=1.0000/0.7778 p95_ms=2500')).toBe(true);
+  }, 120_000);
+
+  it('stops the arm when the backend refuses', async () => {
+    const { outDir, gate, ctx, lines } = deemRun('refuse');
+    const rows = [deemRow('p1', 'p1'), deemRow('p2', 'p2')];
+    const census = { rows, isMatch: strict, describe: (s: string) => `desc ${s}` };
+    const result = await runArm('deem', census, gate, ctx);
+    expect(result).toEqual({ stopped: 'deem arm stopped: backend refused' });
+    expect(lines()).toContain('deem: partial_rows=0');
+    expect(lines().some((line) => line.startsWith('verdict'))).toBe(false);
+    const calls = readCalls(outDir);
+    expect(calls).toHaveLength(1);
+    expect(calls[0].exit_code).toBe(3);
+  }, 60_000);
+});
+
+function jevRow(id: string, prompt: string, cluster: string[] = ['a', 'g']) {
+  return { ...rowOf(id, cluster), prompt };
+}
+
+function jevRun(stubAuth?: string) {
+  const dir = nodeBin('jev', JEV_STUB);
+  const outDir = mkdtempSync(join(tmpdir(), 'suggested-order-calls-'));
+  const out = vi.fn();
+  const gate = { path: join(dir, 'jev'), provider: 'openrouter' };
+  const ctx = {
+    out,
+    env: { ...process.env, STUB_AUTH: stubAuth },
+    outDir,
+    childFile: stubChild(),
+    advisorP50: 800,
+    backoffMs: 10,
+  };
+  return { dir, outDir, gate, ctx, lines: () => out.mock.calls.map(([line]) => line as string) };
+}
+
+describe('score-suggested-order jev arm', () => {
+  it('sends every row to the hosted classifier and records each call', async () => {
+    const { dir, outDir, gate, ctx, lines } = jevRun();
+    const rows = Array.from({ length: 6 }, (_, index) => jevRow(`m${index + 1}`, `p${index + 1}`));
+    const census = { rows, isMatch: strict, describe: (s: string) => `desc ${s}` };
+    await runArm('jev', census, gate, ctx);
+    expect(lines().some((line) => line.startsWith('jev: payload=routing corpus prompts and skill projection descriptions planned_calls=19 est_input_tokens='))).toBe(true);
+    expect(lines()).toContain('jev: auth_test provider=openrouter model=stub-model');
+    const verdict = lines().find((line) => line.startsWith('verdict jev:'));
+    expect(verdict?.startsWith('verdict jev: ')).toBe(true);
+    expect(verdict?.endsWith('jev_version=0.6.2 provider=openrouter model=stub-model')).toBe(true);
+    const log = readFileSync(join(dir, 'jev.log'), 'utf8').trim().split('\n');
+    expect(log).toHaveLength(19);
+    expect(log[0]).toBe('auth test --provider openrouter');
+    for (const line of log.slice(1)) {
+      expect(line.startsWith('choice --provider openrouter -q ')).toBe(true);
+    }
+    expect(log).not.toContain('health');
+    for (const line of log) {
+      expect(line.split('--provider')).toHaveLength(2);
+    }
+    const calls = readCalls(outDir);
+    expect(calls).toHaveLength(19);
+    for (const call of calls) {
+      expect(call.provider).toBe('openrouter');
+    }
+    const choices = calls.filter((call) => call.kind === 'choice');
+    expect(choices).toHaveLength(18);
+    for (const call of choices) {
+      expect(call.model).toBe('stub-model');
+    }
+  }, 60_000);
+
+  it('stops the arm when the key is rejected', async () => {
+    const { dir, gate, ctx, lines } = jevRun('3');
+    const rows = [jevRow('p1', 'p1'), jevRow('p2', 'p2')];
+    const census = { rows, isMatch: strict, describe: (s: string) => `desc ${s}` };
+    const result = await runArm('jev', census, gate, ctx);
+    expect(result).toEqual({ stopped: 'jev arm stopped: key rejected' });
+    expect(lines()).toContain('jev: partial_rows=0');
+    expect(readFileSync(join(dir, 'jev.log'), 'utf8').trim().split('\n')).toEqual(['auth test --provider openrouter']);
+  }, 60_000);
+
+  it('retries a busy classifier once after the backoff', async () => {
+    const { outDir, gate, ctx, lines } = jevRun();
+    const rows = [jevRow('p1', 'p1'), jevRow('busy1', 'busy two')];
+    const census = { rows, isMatch: strict, describe: (s: string) => `desc ${s}` };
+    await runArm('jev', census, gate, ctx);
+    const busy = readCalls(outDir).filter((call) => call.row_id === 'busy1' && call.order === 0);
+    expect(busy).toHaveLength(2);
+    expect(busy[0].attempt).toBe(1);
+    expect(busy[0].exit_code).toBe(4);
+    expect(busy[0].status).toBe('unmeasured');
+    expect(busy[1].attempt).toBe(2);
+    expect(busy[1].status).toBe('measured');
+    const column = lines().find((line) => line.startsWith('column jev:'));
+    expect(column).toContain('measured=2');
+  }, 60_000);
+});
+
+async function linesOf(args: string[], deps: object) {
+  const lines: string[] = [];
+  const code = await main(args, { ...deps, out: (l: string) => lines.push(l) });
+  return { code, lines };
+}
+
+const noProvider = () => {
+  const env = { ...process.env };
+  delete env.JEV_PROVIDER;
+  return env;
+};
+
+describe('score-suggested-order gates and arms in main', () => {
+  it('skips the deem arm on a stub backend after one gate call', async () => {
+    const base = (await linesOf([], { census: censusOf(6), timing })).lines;
+    const tmp = mkdtempSync(join(tmpdir(), 'suggested-order-out-'));
+    const deemDir = makeBin('cli-deem', `echo '{"ok":true,"backend":"stub","model":"deem-0.8-v1","model_commit":"a","source_commit":"b"}'`);
+    const { code, lines } = await linesOf(['--deem', '--out', tmp], {
+      census: censusOf(6),
+      timing,
+      env: { ...noProvider(), PATH: `${deemDir}:${process.env.PATH}` },
+    });
+    expect(code).toBe(0);
+    expect(lines).toEqual([...base, 'deem arm skipped: stub backend']);
+    expect(readFileSync(join(deemDir, 'cli-deem.log'), 'utf8').trim().split('\n')).toEqual(['health']);
+  });
+
+  it('skips the jev arm without a credential after one gate call', async () => {
+    const base = (await linesOf([], { census: censusOf(6), timing })).lines;
+    const tmp = mkdtempSync(join(tmpdir(), 'suggested-order-out-'));
+    const jevDir = makeBin('jev', 'case "$1" in --version) echo "jev 0.6.2";; auth) exit 3;; esac');
+    const { code, lines } = await linesOf(['--jev', '--out', tmp], {
+      census: censusOf(6),
+      timing,
+      env: { ...noProvider(), PATH: `${jevDir}:${process.env.PATH}` },
+    });
+    expect(code).toBe(0);
+    expect(lines).toEqual([
+      ...base,
+      `jev: path=${join(jevDir, 'jev')} provider=official`,
+      'jev arm skipped: no credential',
+    ]);
+    expect(readFileSync(join(jevDir, 'jev.log'), 'utf8').trim().split('\n')).toEqual([
+      '--version',
+      'auth status --provider official',
+    ]);
+  });
+
+  it('starts no gate when there is no headroom', async () => {
+    const tmp = mkdtempSync(join(tmpdir(), 'suggested-order-out-'));
+    const jevDir = makeBin('jev', 'case "$1" in --version) echo "jev 0.6.2";; auth) exit 3;; esac');
+    const deemDir = makeBin('cli-deem', `echo '{"ok":true,"backend":"stub","model":"deem-0.8-v1","model_commit":"a","source_commit":"b"}'`);
+    const { code, lines } = await linesOf(['--jev', '--deem', '--out', tmp], {
+      census: censusOf(4),
+      timing,
+      env: { ...noProvider(), PATH: `${jevDir}:${deemDir}:${process.env.PATH}` },
+    });
+    expect(code).toBe(0);
+    expect(lines).toContain('no headroom (movable)');
+    expect(lines.some((line) => line.startsWith('jev') || line.startsWith('deem'))).toBe(false);
+    expect(existsSync(join(jevDir, 'jev.log'))).toBe(false);
+    expect(existsSync(join(deemDir, 'cli-deem.log'))).toBe(false);
+  });
+
+  it('runs the jev arm, then the deem gate and arm, when both gates pass', async () => {
+    const tmp = mkdtempSync(join(tmpdir(), 'suggested-order-out-'));
+    const jevDir2 = nodeBin('jev', JEV_STUB);
+    const deemDir2 = nodeBin('cli-deem', DEEM_STUB);
+    const { code, lines } = await linesOf(['--jev', '--deem', '--out', tmp], {
+      census: censusOf(6),
+      timing,
+      env: { ...noProvider(), PATH: `${jevDir2}:${deemDir2}:${process.env.PATH}` },
+      childFile: stubChild(),
+      backoffMs: 10,
+    });
+    expect(code).toBe(0);
+    expect(lines).toContain(`jev: path=${join(jevDir2, 'jev')} provider=official`);
+    const jevVerdict = lines.findIndex((line) => line.startsWith('verdict jev:'));
+    const deemHealth = lines.indexOf('deem: health backend=torch model=deem-0.8-v1 model_commit=abc1234 source_commit=def5678');
+    const deemVerdict = lines.findIndex((line) => line.startsWith('verdict deem:'));
+    expect(jevVerdict).toBeGreaterThanOrEqual(0);
+    expect(deemHealth).toBeGreaterThanOrEqual(0);
+    expect(deemHealth).toBeGreaterThan(jevVerdict);
+    expect(deemVerdict).toBeGreaterThan(deemHealth);
+  }, 120_000);
+});
+
+describe('score-suggested-order report', () => {
+  it('builds the report from the census lines, the timing and both arm outcomes', () => {
+    const walls = Array.from({ length: 60 }, () => 800);
+    const rows = [
+      ...Array.from({ length: 10 }, (_, index) => rowOf(`m${index + 1}`, ['a', 'g'])),
+      ...Array.from({ length: 10 }, (_, index) => rowOf(`f${index + 1}`, ['g', 'a'])),
+    ];
+    const answersByRow: Record<string, Array<Record<string, number> | null>> = {};
+    for (const row of rows) {
+      const map = favor('g', row.cluster);
+      answersByRow[row.id] = [map, map, map];
+    }
+    const s = judgeColumn('deem', rows, answersByRow, walls, { isMatch: strict });
+    s.line = 'verdict deem: keep ...';
+    s.identity = { model: 'deem-0.8-v1', model_commit: 'abc1234', source_commit: 'def5678' };
+    const report = buildReport(['census: x'], timing, null, { stopped: 'jev arm stopped: key rejected' }, s);
+    expect(report.census).toEqual(['census: x']);
+    expect(report.advisor.children).toBe(11);
+    expect(report.headroom).toBe('ok');
+    expect(report.stopped.jev).toBe('jev arm stopped: key rejected');
+    expect(report.columns.deem.verdict.outcome).toBe('keep');
+    expect(report.columns.deem.verdict.W).toBe(10);
+    expect(report.columns.deem.verdict.mrr_baseline).toBe(0.75);
+    expect(report.columns.deem.verdict.model_commit).toBe('abc1234');
+    expect(report.columns).not.toHaveProperty('jev');
+  });
+
+  it('writes the report when the only arm was skipped at its gate', async () => {
+    const tmp = mkdtempSync(join(tmpdir(), 'suggested-order-out-'));
+    const deemDir = makeBin('cli-deem', `echo '{"ok":true,"backend":"stub","model":"deem-0.8-v1","model_commit":"a","source_commit":"b"}'`);
+    const { code, lines } = await linesOf(['--deem', '--out', tmp], {
+      census: censusOf(6),
+      timing,
+      env: { ...noProvider(), PATH: `${deemDir}:${process.env.PATH}` },
+    });
+    expect(code).toBe(0);
+    const report = JSON.parse(readFileSync(join(tmp, 'report.json'), 'utf8'));
+    expect(report.headroom).toBe('ok');
+    expect(report.columns).toEqual({});
+    expect(report.stopped).toEqual({});
+    const advisorIndex = lines.findIndex((line) => line.startsWith('advisor child:'));
+    expect(report.census).toEqual(lines.slice(0, advisorIndex));
+  });
+
+  it('writes nothing for a run with no model switch', async () => {
+    const dir = mkdtempSync(join(tmpdir(), 'suggested-order-out-'));
+    expect(await main(['--out', dir], { census: censusOf(6), timing, out: () => {} })).toBe(0);
+    expect(readdirSync(dir)).toEqual([]);
+  });
+});
diff --git a/.skilled/skills/system-skill-advisor/runtime/tests/manual-testing-playbook.vitest.ts b/.skilled/skills/system-skill-advisor/runtime/tests/manual-testing-playbook.vitest.ts
index 72ee3fb079..0b5148bf45 100644
--- a/.skilled/skills/system-skill-advisor/runtime/tests/manual-testing-playbook.vitest.ts
+++ b/.skilled/skills/system-skill-advisor/runtime/tests/manual-testing-playbook.vitest.ts
@@ -42,17 +42,17 @@ function actualScenarioFiles(): string[] {
 }
 
 describe('skill advisor manual testing playbook inventory', () => {
-  it('keeps the root playbook aligned with the live 48-scenario corpus', () => {
+  it('keeps the root playbook aligned with the live 49-scenario corpus', () => {
     const markdown = readFileSync(rootPlaybook, 'utf8');
     const rows = listedScenarioRows(markdown);
     const files = actualScenarioFiles();
 
-    expect(markdown).toContain('48 deterministic scenario files across 9 categories');
-    expect(markdown).toContain('all 48 scenario files are `PASS`');
+    expect(markdown).toContain('49 deterministic scenario files across 9 categories');
+    expect(markdown).toContain('all 49 scenario files are `PASS`');
     expect(markdown).not.toMatch(/\b24-scenario\b|\b24 scenarios\b/);
-    expect(rows).toHaveLength(48);
-    expect(new Set(rows.map((row) => row.id)).size).toBe(48);
-    expect(files).toHaveLength(48);
+    expect(rows).toHaveLength(49);
+    expect(new Set(rows.map((row) => row.id)).size).toBe(49);
+    expect(files).toHaveLength(49);
 
     for (const row of rows) {
       expect(existsSync(resolve(playbookRoot, row.relativePath))).toBe(true);
diff --git a/.skilled/skills/system-skill-advisor/leaf-aliases.json b/.skilled/skills/system-skill-advisor/leaf-aliases.json
index a24e59f932..450f66a179 100644
--- a/.skilled/skills/system-skill-advisor/leaf-aliases.json
+++ b/.skilled/skills/system-skill-advisor/leaf-aliases.json
@@ -204,6 +204,11 @@
     "leafResourceId": "feature-catalog/scorer-fusion/projection.md",
     "diskPath": "feature-catalog/scorer-fusion/projection.md"
   },
+  {
+    "workflowMode": "system-skill-advisor",
+    "leafResourceId": "feature-catalog/scorer-fusion/suggested-order-eval.md",
+    "diskPath": "feature-catalog/scorer-fusion/suggested-order-eval.md"
+  },
   {
     "workflowMode": "system-skill-advisor",
     "leafResourceId": "feature-catalog/scorer-fusion/tie-break-eval.md",
@@ -449,6 +454,11 @@
     "leafResourceId": "manual-testing-playbook/scorer-fusion/projection.md",
     "diskPath": "manual-testing-playbook/scorer-fusion/projection.md"
   },
+  {
+    "workflowMode": "system-skill-advisor",
+    "leafResourceId": "manual-testing-playbook/scorer-fusion/suggested-order-eval.md",
+    "diskPath": "manual-testing-playbook/scorer-fusion/suggested-order-eval.md"
+  },
   {
     "workflowMode": "system-skill-advisor",
     "leafResourceId": "manual-testing-playbook/scorer-fusion/tie-break-eval.md",
diff --git a/.skilled/skills/system-skill-advisor/leaf-manifest.json b/.skilled/skills/system-skill-advisor/leaf-manifest.json
index 69e5d845f2..df09c0d984 100644
--- a/.skilled/skills/system-skill-advisor/leaf-manifest.json
+++ b/.skilled/skills/system-skill-advisor/leaf-manifest.json
@@ -43,6 +43,7 @@
         "feature-catalog/scorer-fusion/attribution.md",
         "feature-catalog/scorer-fusion/five-lane-fusion.md",
         "feature-catalog/scorer-fusion/projection.md",
+        "feature-catalog/scorer-fusion/suggested-order-eval.md",
         "feature-catalog/scorer-fusion/tie-break-eval.md",
         "feature-catalog/scorer-fusion/weights-config.md",
         "manual-testing-playbook/auto-indexing/anti-stuffing.md",
@@ -92,6 +93,7 @@
         "manual-testing-playbook/scorer-fusion/five-lane-fusion.md",
         "manual-testing-playbook/scorer-fusion/lane-attribution.md",
         "manual-testing-playbook/scorer-fusion/projection.md",
+        "manual-testing-playbook/scorer-fusion/suggested-order-eval.md",
         "manual-testing-playbook/scorer-fusion/tie-break-eval.md",
         "references/config/db-path-policy.md",
         "references/decisions/deferred-decisions.md",
```

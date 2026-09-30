#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: score-verdict-fallback                                        ║
// ║ offline reviewer verdict-fallback measurement                            ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * Measure offline whether a Jev or Deem noul that reads a reviewer output and
 * names one of pass, fail or block resolves the outputs the deterministic
 * verdict pattern misses, and whether that column clears the keep rule against
 * the operator's labels. The default run makes no model call and writes no
 * file, and the script holds and reads no credential.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawn, spawnSync } = require('node:child_process');
const { parseArgs } = require('node:util');

const { extractVerdict } = require('./reviewer-scorer.cjs');
const { DEFAULT_PROFILES_DIR, fixturePathFor } = require('../../lib/profile-resolve.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// The one judgment question a noul answers; both arms ask exactly this.
const QUESTION = 'Which verdict does this reviewer output give?';
// The three answer keys and the option text that names each one.
const OPTION_PAIRS = [
  ['pass', 'The reviewer approves the change'],
  ['fail', 'The reviewer rejects the change and names what must change'],
  ['block', 'The reviewer says it cannot give a verdict'],
];
// Name order, rotated left by 1, then by 2, so option position cannot decide.
const ORDERS = 3;
// Labeled regex-miss outputs below which no arm opens.
const LABEL_GATE = 12;
// The margin the keep rule demands between the column and the baseline.
const MARGIN_LINE = 'margin: 0.10';
// The keep rule, fixed so a printed verdict can be rechecked by hand.
const KEEP_RULE_LINE = 'keep rule: coverage 10*M >= 9*K, kill p_loss < 0.05, margin 10*(A-B) >= M, sign test p_win < 0.05, flips 10*F <= 3*M';
// The power note, fixed so the five-win floor behind a keep is stated.
const POWER_LINE = 'power: a keep needs at least 5 wins with no loss, since 0.5^5 is 0.031';
// The choice p50 in deem-local.md, used for the wall-time estimate.
const DEEM_P50_MS = 65.6;
// Process cap; cli-deem applies its own 2,000 ms HTTP timeout.
const HEALTH_TIMEOUT_MS = 10000;
// The one jev version the arm accepts.
const JEV_VERSION = 'jev 0.6.2';
// The fixture set the default run censuses.
const DEFAULT_PROFILE = path.resolve(__dirname, '../../../assets/model-benchmark/benchmark-profiles/reviewer-regression.json');
// The repository root, used to resolve repository-relative profile paths.
const REPO_ROOT = path.resolve(__dirname, '../../../../../../..');
// Repo copy of the cli-deem entry point, run under node when none is on PATH.
const REPO_CLI_DEEM = path.resolve(__dirname, '../../../../../cli-classifier/cli-deem/scripts/cli-deem.mjs');
// The usage line printed whenever the run cannot start.
const USAGE = 'usage: score-verdict-fallback.cjs [--profile <path-or-id>] [--outputs <file>] [--reports <dir>]... [--jev] [--deem] [--out <dir>] [--accept-payload]';

// ─────────────────────────────────────────────────────────────────────────────
// 3. CENSUS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Hash text or bytes with SHA-256.
 *
 * @param {string|Buffer} input - Text or bytes to hash
 * @returns {string} Lowercase hex digest
 */
function sha256Hex(input) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

/**
 * Resolve the profile argument the way the reviewer scorer does: an existing
 * path from the working directory wins, otherwise the argument names a profile
 * file under the shared benchmark-profiles directory.
 *
 * @param {string} arg - Profile path or profile id
 * @returns {string} Resolved profile path
 */
function resolveProfile(arg) {
  const directPath = path.resolve(process.cwd(), arg);
  return fs.existsSync(directPath) ? directPath : path.join(DEFAULT_PROFILES_DIR, arg + '.json');
}

/**
 * Load every fixture case the profile names into one flat list: the profile's
 * fixtureDir resolves against the working directory and then the profile's own
 * directory, each fixture contributes its visible tests (or one case named
 * after the fixture when it declares none) followed by its hidden tests, and a
 * case overrides the fixture it sits on. The recorded reviewer output is kept
 * as-is so the census classifies it without a model call.
 *
 * @param {string} profilePath - Resolved profile path
 * @returns {Array<{ fixtureId: string, name: string, output: string|null }>} Flat case list
 * @throws {Error} When the profile or a named fixture cannot be read or parsed
 */
function loadFixtureCases(profilePath) {
  const profile = JSON.parse(fs.readFileSync(profilePath, 'utf8'));
  const profileDir = path.dirname(profilePath);
  const fixtureDirArg = profile.fixtureDir || (profile.benchmark && profile.benchmark.fixtureDir);
  let fixtureDir;
  if (path.isAbsolute(fixtureDirArg)) {
    fixtureDir = fixtureDirArg;
  } else {
    const fromCwd = path.resolve(process.cwd(), fixtureDirArg);
    const fromRepoRoot = path.resolve(REPO_ROOT, fixtureDirArg);
    fixtureDir = fs.existsSync(fromCwd)
      ? fromCwd
      : fs.existsSync(fromRepoRoot)
        ? fromRepoRoot
        : path.resolve(profileDir, fixtureDirArg);
  }
  const fixtureRefs = Array.isArray(profile.fixtures)
    ? profile.fixtures
    : (profile.benchmark && profile.benchmark.fixtures) || [];
  const files = fixtureRefs.length > 0
    ? fixtureRefs.map((fixtureRef) => fixturePathFor(fixtureRef, fixtureDir))
    : fs.readdirSync(fixtureDir).filter((entry) => entry.endsWith('.json')).map((entry) => path.join(fixtureDir, entry));
  const cases = [];
  for (const filePath of files) {
    const fixture = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const visible = Array.isArray(fixture.tests) && fixture.tests.length > 0 ? fixture.tests : [{ name: fixture.id }];
    const hidden = Array.isArray(fixture.hidden_tests) ? fixture.hidden_tests : [];
    for (const testCase of visible.concat(hidden)) {
      const merged = { ...fixture, ...(testCase || {}) };
      const output = typeof merged.reviewer_output === 'string' && merged.reviewer_output.length > 0 ? merged.reviewer_output : null;
      cases.push({ fixtureId: fixture.id, name: merged.name || fixture.id, output });
    }
  }
  return cases;
}

/**
 * Count the loaded cases: one with no recorded output is noOutput and can
 * never be scored offline, one whose recorded output carries a pattern verdict
 * is a hit, and every other recorded output is a miss the arms would need to
 * resolve.
 *
 * @param {Array<{ fixtureId: string, name: string, output: string|null }>} cases - Cases from loadFixtureCases
 * @returns {{ total: number, hits: number, misses: number, noOutput: number }} Fixture census
 */
function censusFixtures(cases) {
  let hits = 0;
  let misses = 0;
  let noOutput = 0;
  for (const entry of cases) {
    if (entry.output === null) {
      noOutput += 1;
      continue;
    }
    if (extractVerdict(entry.output).verdict !== null) hits += 1;
    else misses += 1;
  }
  return { total: cases.length, hits, misses, noOutput };
}

// The labels are the operator's gold, so a malformed row must stop the run
// rather than drop it.
/**
 * Parse the operator's outputs file into one labeled row per line.
 *
 * @param {string} text - Outputs file contents, one JSON object per line
 * @returns {Array<{ id: string, output: string, label: 'pass'|'fail'|'block', expectedVerdict: unknown }>} Labeled rows in file order
 * @throws {Error} When a row is not JSON, carries no non-empty id, a non-string
 *   output, a label other than pass, fail or block, or a repeated id
 */
function parseOutputs(text) {
  const rows = [];
  const seenIds = new Set();
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const row = i + 1;
    if (lines[i].trim() === '') continue;
    let parsed;
    try {
      parsed = JSON.parse(lines[i]);
    } catch {
      throw new Error(`outputs row ${row}: not JSON`);
    }
    const isPlainObject = parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed);
    const id = isPlainObject ? parsed.id : undefined;
    if (typeof id !== 'string' || id.length === 0) {
      throw new Error(`outputs row ${row}: id must be a non-empty string`);
    }
    const output = parsed.output;
    if (typeof output !== 'string') {
      throw new Error(`outputs row ${row}: output must be a string`);
    }
    const label = parsed.label;
    if (label !== 'pass' && label !== 'fail' && label !== 'block') {
      throw new Error(`outputs row ${row}: label must be pass, fail or block, got ${JSON.stringify(label)}`);
    }
    if (seenIds.has(id)) throw new Error(`outputs row ${row}: duplicate id ${id}`);
    seenIds.add(id);
    rows.push({ id, output, label, expectedVerdict: parsed.expectedVerdict });
  }
  return rows;
}

/**
 * Count the labeled outputs: one whose text carries a pattern verdict is a
 * hit the deterministic pass already resolves, every other row is a miss the
 * arms would need to resolve, and the misses are kept in file order.
 *
 * @param {Array<{ id: string, output: string, label: string }>} rows - Rows from parseOutputs
 * @returns {{ total: number, hits: number, misses: number, kept: Array<{ id: string, output: string, label: string }> }} Outputs census
 */
function censusOutputs(rows) {
  let hits = 0;
  const kept = [];
  for (const row of rows) {
    if (extractVerdict(row.output).verdict !== null) hits += 1;
    else kept.push(row);
  }
  return { total: rows.length, hits, misses: kept.length, kept };
}

/**
 * Count the per-test verdict methods of every named reviewer report. Each
 * directory is expected to hold the `reviewer-report.json` a reviewer
 * benchmark wrote, whose scored fixtures sit under `rows` (or its `fixtures`
 * alias), and each fixture's `per_test` entries are bucketed by the method
 * that resolved the verdict: the deterministic pattern, the llm grader, or
 * none.
 *
 * @param {string[]} dirs - Directories each holding a `reviewer-report.json`
 * @returns {Array<{ path: string, pattern: number, llmGrader: number, none: number }>} One census per directory, in argument order
 * @throws {Error} When a report cannot be read or parsed
 */
function censusReports(dirs) {
  const censuses = [];
  for (const dir of dirs) {
    const reportPath = path.join(dir, 'reviewer-report.json');
    let report;
    try {
      report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    } catch (err) {
      throw new Error(`cannot read report ${reportPath}: ${err.message}`);
    }
    const rows = Array.isArray(report?.rows)
      ? report.rows
      : Array.isArray(report?.fixtures)
        ? report.fixtures
        : [];
    let pattern = 0;
    let llmGrader = 0;
    let none = 0;
    for (const row of rows) {
      const perTest = Array.isArray(row?.per_test) ? row.per_test : [];
      for (const entry of perTest) {
        const method = entry?.verdictMethod;
        if (method === 'pattern') pattern += 1;
        else if (method === 'llm-grader') llmGrader += 1;
        else none += 1;
      }
    }
    censuses.push({ path: reportPath, pattern, llmGrader, none });
  }
  return censuses;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. BASELINES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Pick the last whole verdict word anywhere in the text, case-insensitively:
 * the loose rule the baseline uses where the deterministic pattern finds no
 * verdict line. A text holding no whole word of pass, fail or block reads as
 * no pick at all, which counts wrong.
 *
 * @param {string} text - Reviewer output text
 * @returns {'pass'|'fail'|'block'|null} Last whole verdict word, lowercased, else null
 */
function loosePick(text) {
  const matches = text.match(/\b(pass|fail|block)\b/gi);
  return matches === null ? null : matches[matches.length - 1].toLowerCase();
}

/**
 * Pick the stronger of the two zero-call baselines: the majority class of the
 * labels, or the loose rule that reads the last whole verdict word, with the
 * loose rule winning a tie. A label tie breaks to the class earliest in pass,
 * fail, block, and the chosen method's pick for every row is kept as the calls
 * the columns are compared against.
 *
 * @param {Array<{ id: string, output: string, label: 'pass'|'fail'|'block' }>} rows - Labeled rows
 * @returns {{ majorityClass: 'pass'|'fail'|'block', majorityRight: number, looseRight: number, method: 'majority'|'loose', right: number, calls: Map<string, 'pass'|'fail'|'block'|null> }} The chosen baseline
 */
function chooseBaseline(rows) {
  const counts = { pass: 0, fail: 0, block: 0 };
  for (const row of rows) counts[row.label] += 1;
  let majorityClass = 'pass';
  for (const candidate of ['pass', 'fail', 'block']) {
    if (counts[candidate] > counts[majorityClass]) majorityClass = candidate;
  }
  let majorityRight = 0;
  let looseRight = 0;
  for (const row of rows) {
    if (row.label === majorityClass) majorityRight += 1;
    if (loosePick(row.output) === row.label) looseRight += 1;
  }
  const method = looseRight >= majorityRight ? 'loose' : 'majority';
  const right = method === 'loose' ? looseRight : majorityRight;
  const calls = new Map(rows.map((row) => [row.id, method === 'loose' ? loosePick(row.output) : majorityClass]));
  return { majorityClass, majorityRight, looseRight, method, right, calls };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. KEEP RULE
// ─────────────────────────────────────────────────────────────────────────────

// Counts stay integers and the tails are exact (a BigInt sum over 2^trials),
// so no rounding decides a verdict.

/**
 * Exact one-sided chance of `successes` or more in `trials` fair coin flips.
 * The tail sum is built coefficient by coefficient in BigInt, and the below
 * 0.05 test stays exact as 20 * num < den, never a float comparison.
 *
 * @param {number} successes - Outcomes whose tail is summed
 * @param {number} trials - Total flips
 * @returns {{ num: bigint, den: bigint, p: number }} Tail numerator over 2^trials
 */
function binomialTail(successes, trials) {
  let coefficient = 1n;
  let num = 0n;
  for (let i = 0; i <= trials; i += 1) {
    if (i > 0) coefficient = (coefficient * BigInt(trials - i + 1)) / BigInt(i);
    if (i >= successes) num += coefficient;
  }
  const den = 1n << BigInt(trials);
  return { num, den, p: Number(num) / Number(den) };
}

/**
 * First failed check decides, in this order: coverage, kill, margin, sign
 * test, flips. The loss tail kills before the margin is read, and the flips
 * check binds both backends because each asks every output in three orders.
 *
 * @param {{ K: number, M: number, A: number, B: number, W: number, L: number, F: number }} counts - Column counts
 * @returns {{ outcome: 'keep'|'kill'|'stop', reason: 'coverage'|'margin'|'sign test'|'flips'|null, pWin: number, pLoss: number }} Verdict with both exact tails
 */
function decideVerdict({ K, M, A, B, W, L, F }) {
  const win = binomialTail(W, W + L);
  const loss = binomialTail(L, W + L);
  if (!(10 * M >= 9 * K)) return { outcome: 'stop', reason: 'coverage', pWin: win.p, pLoss: loss.p };
  if (20n * loss.num < loss.den) return { outcome: 'kill', reason: null, pWin: win.p, pLoss: loss.p };
  if (!(10 * (A - B) >= M)) return { outcome: 'stop', reason: 'margin', pWin: win.p, pLoss: loss.p };
  if (!(20n * win.num < win.den)) return { outcome: 'stop', reason: 'sign test', pWin: win.p, pLoss: loss.p };
  if (!(10 * F <= 3 * M)) return { outcome: 'stop', reason: 'flips', pWin: win.p, pLoss: loss.p };
  return { outcome: 'keep', reason: null, pWin: win.p, pLoss: loss.p };
}

/**
 * @param {number} p - Probability in [0, 1]
 * @returns {string} Four significant digits
 */
function formatP(p) {
  return p.toPrecision(4);
}

/**
 * The key an answer array names at least twice, with the count it reached.
 * Three different keys name no pick at all, which reads as unstable and
 * counts wrong, while the top count still feeds the flip count.
 *
 * @param {string[]} answers - Submitted answer keys for one row
 * @returns {{ pick: string|null, top: number }} Modal pick, or null when no key reaches two
 */
function modalPick(answers) {
  const counts = new Map();
  for (const key of answers) counts.set(key, (counts.get(key) || 0) + 1);
  let pick = null;
  let top = 0;
  for (const [key, count] of counts) {
    if (count > top) {
      top = count;
      pick = count >= 2 ? key : null;
    }
  }
  return { pick, top };
}

/**
 * One column's counts and verdict. A row is measured only when its answer
 * array holds one submitted key per option order; every other row stays
 * unmeasured and never counts. The pick is the key named at least twice, an
 * unstable row counts wrong, the baseline's own pick is compared on the same
 * measured rows, and each row's non-modal orders add to the flip count, so
 * instability is never hidden.
 *
 * @param {'jev'|'deem'} backend - Backend name, printed on the verdict line
 * @param {Array<{ id: string, label: 'pass'|'fail'|'block' }>} rows - Labeled rows, in file order
 * @param {Map<string, Array<string|null>>} answers - Row id -> submitted answer keys, one per order
 * @param {Map<string, 'pass'|'fail'|'block'|null>} baselineCalls - Row id -> baseline pick
 * @param {string} labelsSha - Label digest printed on the verdict line
 * @param {string} suffix - Backend identity appended to the line when non-empty
 * @returns {{ backend: string, K: number, M: number, unmeasured: number, A: number, B: number, W: number, L: number, F: number, pWin: number, pLoss: number, outcome: string, reason: string|null, line: string }} Column summary
 */
function summarizeColumn(backend, rows, answers, baselineCalls, labelsSha, suffix) {
  const K = rows.length;
  let M = 0;
  let A = 0;
  let B = 0;
  let W = 0;
  let L = 0;
  let F = 0;
  for (const row of rows) {
    const values = answers.get(row.id);
    if (!Array.isArray(values) || values.length !== ORDERS) continue;
    if (!values.every((value) => value === 'pass' || value === 'fail' || value === 'block')) continue;
    M += 1;
    const { pick, top } = modalPick(values);
    F += ORDERS - top;
    const columnRight = pick === row.label;
    const baselineRight = baselineCalls.get(row.id) === row.label;
    if (columnRight) A += 1;
    if (baselineRight) B += 1;
    if (columnRight && !baselineRight) W += 1;
    if (baselineRight && !columnRight) L += 1;
  }
  const verdict = decideVerdict({ K, M, A, B, W, L, F });
  const outcomeText = verdict.reason === null ? verdict.outcome : `stop (${verdict.reason})`;
  let line = `verdict ${backend}: ${outcomeText} K=${K} M=${M} A=${A} B=${B} W=${W} L=${L} F=${F} p_win=${formatP(verdict.pWin)} p_loss=${formatP(verdict.pLoss)} labels_sha256=${labelsSha}`;
  if (typeof suffix === 'string' && suffix.length > 0) line += ` ${suffix}`;
  return { backend, K, M, unmeasured: K - M, A, B, W, L, F, pWin: verdict.pWin, pLoss: verdict.pLoss, outcome: verdict.outcome, reason: verdict.reason, line };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. DEEM GATE
// ─────────────────────────────────────────────────────────────────────────────

// The model the Deem arm requires; any other is a failed health check.
const DEEM_MODEL = 'deem-0.8-v1';

/**
 * First executable file of this name on PATH, or null when none is executable.
 * Empty PATH entries are skipped. A missing path, a directory, or a file that
 * cannot be executed is not a match.
 *
 * @param {string} name Executable file name.
 * @param {{ PATH?: string }} env Environment whose PATH is searched.
 * @returns {string | null} First executable match, or null when none is executable.
 */
function which(name, env) {
  for (const dir of (env.PATH ?? '').split(path.delimiter)) {
    if (dir.length === 0) continue;
    const candidate = path.join(dir, name);
    try {
      if (fs.statSync(candidate).isFile()) {
        fs.accessSync(candidate, fs.constants.X_OK);
        return candidate;
      }
    } catch {
      continue;
    }
  }
  return null;
}

/**
 * cli-deem on PATH when that file is executable, otherwise the repo copy under node.
 *
 * @param {{ PATH?: string }} env Environment whose PATH is searched.
 * @returns {string[]} Command and leading arguments for one call.
 */
function deemCommand(env) {
  const onPath = which('cli-deem', env);
  if (onPath !== null) return [onPath];
  return [process.execPath, REPO_CLI_DEEM];
}

/**
 * One health check. An unreachable binary, a stub backend, or a wrong model
 * is a failed check the caller prints as a skip.
 *
 * @param {string[]} cmd Command from deemCommand.
 * @param {Record<string, string | undefined>} env Environment for the call.
 * @returns {{ ok: true, backend: string, model: string, modelCommit: string, sourceCommit: string } | { ok: false, reason: string, found: unknown }}
 */
function readDeemHealth(cmd, env) {
  const result = spawnSync(cmd[0], [...cmd.slice(1), 'health'], {
    env,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout: HEALTH_TIMEOUT_MS,
  });
  let errorText = (result.stderr ?? '').trim();
  try {
    errorText = JSON.parse(errorText).error;
  } catch {
    // Leave the trimmed stderr when it is not JSON.
  }

  if (result.error || result.status === 4) {
    return { ok: false, reason: 'not reachable', found: errorText };
  }
  if (result.status === 3) {
    let reason = 'bad health response';
    if (typeof errorText === 'string' && errorText.includes('stub')) reason = 'stub backend';
    else if (typeof errorText === 'string' && errorText.includes('refused model')) reason = 'model';
    return { ok: false, reason, found: errorText };
  }
  if (result.status === 0) {
    const stdoutText = (result.stdout ?? '').trim();
    let body;
    try {
      body = JSON.parse(stdoutText);
    } catch {
      return { ok: false, reason: 'bad health response', found: stdoutText };
    }
    const backend = body?.backend;
    if (typeof backend === 'string' && backend.includes('stub')) {
      return { ok: false, reason: 'stub backend', found: backend };
    }
    if (backend !== 'torch' && !(typeof backend === 'string' && backend.startsWith('ensemble:'))) {
      return { ok: false, reason: 'bad health response', found: String(backend) };
    }
    const model = body?.model;
    if (model !== DEEM_MODEL) {
      return { ok: false, reason: 'model', found: String(model) };
    }
    const modelCommit = body?.model_commit;
    const sourceCommit = body?.source_commit;
    if (
      body?.ok !== true
      || typeof modelCommit !== 'string'
      || modelCommit === ''
      || typeof sourceCommit !== 'string'
      || sourceCommit === ''
    ) {
      return { ok: false, reason: 'bad health response', found: stdoutText };
    }
    return { ok: true, backend, model, modelCommit, sourceCommit };
  }
  return { ok: false, reason: 'bad health response', found: `exit ${result.status}: ${errorText}` };
}

/**
 * Prints the health line, or a skip line when the check fails.
 *
 * @param {{ out: (line: string) => void, env: Record<string, string | undefined> }} ctx Line writer and environment.
 * @returns {{ passed: boolean, cmd: string[], reason?: string }} True when the health check passed; a failed check carries the skip line it printed.
 */
function deemGate(ctx) {
  const cmd = deemCommand(ctx.env);
  const health = readDeemHealth(cmd, ctx.env);
  if (health.ok) {
    ctx.out(`deem: health backend=${health.backend} model=${health.model} model_commit=${health.modelCommit} source_commit=${health.sourceCommit}`);
    return { passed: true, cmd, ...health };
  }
  const skipLine = `deem arm skipped: ${health.reason}`;
  ctx.out(skipLine);
  if (health.reason === 'model' || health.reason === 'bad health response') {
    ctx.out(`deem: found=${JSON.stringify(health.found)}`);
  }
  return { passed: false, cmd, reason: skipLine };
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. JEV GATE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Whether git tracks a file, from `git ls-files -z` run in the file's
 * directory. A git failure reads as untracked, because a file whose status
 * cannot be read must not count as committed.
 *
 * @param {string} dir Directory the git command runs in.
 * @param {string} name File name to test.
 * @returns {boolean} True when git tracks the name.
 */
function trackedFile(dir, name) {
  const res = spawnSync('git', ['ls-files', '-z', '--', name], {
    cwd: dir,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  if (res.error || res.status !== 0) return false;
  return (res.stdout ?? '').split('\0').some((entry) => entry.length > 0);
}

/**
 * Identity line, then the pinned client version, a credential check and the
 * payload rule. An untracked outputs file may hold text nobody reviewed, so it
 * needs the operator's explicit accept before it leaves the machine. A miss
 * prints a skip line and leaves the census text already written.
 *
 * @param {{
 *   out: (line: string) => void,
 *   env: Record<string, string | undefined>,
 *   timeoutMs: number,
 *   outputsFile: string | null,
 *   acceptPayload: boolean
 * }} ctx Line writer, environment, per-call timeout, the labeled outputs file
 *   and the operator's payload accept.
 * @returns {{ passed: boolean, path: string | null, provider: string, untracked: boolean, reason?: string }}
 *   True when the gate passed; a failed gate carries the skip line it printed.
 */
function jevGate(ctx) {
  const provider = ctx.env.JEV_PROVIDER || 'official';
  const jevPath = which('jev', ctx.env);
  ctx.out(`jev: path=${jevPath ?? 'none'} provider=${provider}`);
  if (jevPath === null) {
    const skipLine = 'jev arm skipped: jev not on PATH';
    ctx.out(skipLine);
    return { passed: false, path: jevPath, provider, untracked: false, reason: skipLine };
  }

  const opts = {
    env: ctx.env,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout: ctx.timeoutMs,
  };
  const version = spawnSync(jevPath, ['--version'], opts);
  const trimmed = (version.stdout ?? '').trim();
  const found = trimmed === '' ? '' : trimmed.split('\n')[0];
  if (found !== JEV_VERSION) {
    const skipLine = 'jev arm skipped: version';
    ctx.out(skipLine);
    ctx.out(`jev: found=${JSON.stringify(found)} path=${jevPath}`);
    return { passed: false, path: jevPath, provider, untracked: false, reason: skipLine };
  }

  const auth = spawnSync(jevPath, ['auth', 'status', '--provider', provider], opts);
  if (auth.status !== 0) {
    const skipLine = 'jev arm skipped: no credential';
    ctx.out(skipLine);
    return { passed: false, path: jevPath, provider, untracked: false, reason: skipLine };
  }

  let untracked = false;
  if (typeof ctx.outputsFile === 'string' && ctx.outputsFile !== '') {
    untracked = !trackedFile(path.dirname(ctx.outputsFile), path.basename(ctx.outputsFile));
  }
  if (untracked && ctx.acceptPayload !== true) {
    const skipLine = 'jev arm skipped: payload not accepted';
    ctx.out(skipLine);
    return { passed: false, path: jevPath, provider, untracked, reason: skipLine };
  }
  return { passed: true, path: jevPath, provider, untracked };
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. ARM HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Nearest-rank percentile. Empty lists have no rank.
 *
 * @param {number[]} values Raw values.
 * @param {number} q Quantile in (0, 1].
 * @returns {number | null}
 */
function nearestRank(values, q) {
  if (values.length === 0) return null;
  const sorted = [...values].sort((left, right) => left - right);
  return Math.round(sorted[Math.ceil(q * sorted.length) - 1]);
}

/**
 * One bounded child process. Resolves exactly once with the exit code, the
 * collected output, the wall time, and whether the timeout fired. The timer
 * kills the child and resolves at once, without waiting for close: a
 * grandchild can hold the pipes open past the kill. Stdin is closed after the
 * write because the CLI reads stdin to EOF and exits 2 on an inherited
 * terminal. A spawn error is code 127 with the message as stderr.
 *
 * @param {string} file Executable to spawn.
 * @param {string[]} args Arguments after the executable.
 * @param {string} stdinText Text written to stdin, then closed.
 * @param {Record<string, string | undefined>} env Child environment.
 * @param {number} timeoutMs Kill and resolve after this many milliseconds.
 * @returns {Promise<{
 *   code: number | null,
 *   stdout: string,
 *   stderr: string,
 *   wallMs: number,
 *   timedOut: boolean
 * }>}
 */
function spawnCall(file, args, stdinText, env, timeoutMs) {
  return new Promise((resolve) => {
    const start = Date.now();
    const child = spawn(file, args, { env, stdio: ['pipe', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    let settled = false;

    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');
    child.stdout.on('data', (chunk) => { stdout += chunk; });
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    // A child that exits before reading stdin cannot fail the call through
    // the pipe: its exit code is the outcome the caller needs.
    child.stdin.on('error', () => {});
    child.stdin.end(stdinText);

    const timer = setTimeout(() => {
      child.kill('SIGKILL');
      settle(null, true);
    }, timeoutMs);

    function settle(code, timedOut) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({ code, stdout, stderr, wallMs: Date.now() - start, timedOut });
    }

    child.on('close', (code) => settle(code === null ? -1 : code, false));
    child.on('error', (error) => {
      stderr = error.message;
      settle(127, false);
    });
  });
}

/**
 * One JSON-line record per model call under outDir. A missing or empty outDir
 * keeps no records, so nothing is created. The file is created empty on the
 * first append, and one line per call keeps a killed arm's earlier records
 * readable.
 *
 * @param {string | undefined} outDir Directory that holds calls.jsonl.
 * @returns {{ append: (record: object) => void }} Append-only call log.
 */
function createCallLog(outDir) {
  let created = false;
  return {
    append(record) {
      if (typeof outDir !== 'string' || outDir === '') return;
      const filePath = path.join(outDir, 'calls.jsonl');
      if (!created) {
        fs.mkdirSync(outDir, { recursive: true });
        fs.writeFileSync(filePath, '');
        created = true;
      }
      fs.appendFileSync(filePath, `${JSON.stringify(record)}\n`);
    },
  };
}

/**
 * Parsed report.json written by an earlier run into the same out directory.
 *
 * @param {string | undefined} outDir Directory that may hold report.json.
 * @returns {object | null} The parsed report, or null when outDir is empty,
 *   the file is missing, or the file does not parse.
 */
function readStoredReport(outDir) {
  if (typeof outDir !== 'string' || outDir === '') return null;
  try {
    return JSON.parse(fs.readFileSync(path.join(outDir, 'report.json'), 'utf8'));
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. ARMS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The Deem arm: every labeled row is asked in each of the three option
 * rotations, one fresh local call per order, and a row is measured only when
 * all three calls return one of the submitted keys. Exit 4 rechecks the
 * server health and retries once, a malformed answer or a spent retry leaves
 * that call unmeasured, and a stop line ends the arm with the rows finished.
 * Nothing leaves the machine, so no payload accept applies.
 *
 * @param {{
 *   rows: Array<{ id: string, output: string, label: 'pass'|'fail'|'block' }>,
 *   baselineCalls: Map<string, 'pass'|'fail'|'block'|null>,
 *   labelsSha: string
 * }} plan Labeled miss rows with their output text, the baseline calls and the
 *   label digest.
 * @param {{ cmd: string[], model: string, modelCommit: string, sourceCommit: string }} gate
 *   Passing gate result: the command and the health identity.
 * @param {{
 *   out: (line: string) => void,
 *   env: Record<string, string | undefined>,
 *   timeoutMs: number,
 *   callLog: { append: (record: object) => void },
 *   stored?: object | null
 * }} ctx Line writer, environment, per-call timeout, call log and the stored
 *   report.
 * @returns {{ column: object, requalify: string | null } | { stopped: string, partialRows: number }}
 *   The finished column or the stop line with the rows finished.
 */
async function runDeemArm(plan, gate, ctx) {
  const planned = ORDERS * plan.rows.length;
  ctx.out(`deem: nothing leaves the machine; planned calls: ${planned}; estimated wall time: ${(planned * DEEM_P50_MS / 1000).toFixed(1)} s at ${DEEM_P50_MS} ms per call, the choice p50 from deem-local.md`);

  const answers = new Map();
  const wallTimes = [];
  let finished = 0;

  /**
   * One calls.jsonl record. A call that led to a stop, a retry or a failed
   * measurement carries no judgment, so its pick and status stay empty.
   */
  function record(row, order, attempt, r, pick, pickProb, status) {
    return {
      backend: 'deem',
      output: row.id,
      order,
      attempt,
      wallMs: r.wallMs,
      exitCode: r.code,
      pick,
      pickProb,
      status,
      modelId: gate.model,
      modelCommit: gate.modelCommit,
      sourceCommit: gate.sourceCommit,
    };
  }

  function stop(line) {
    ctx.out(line);
    ctx.out(`deem: partial rows=${finished}`);
    return { stopped: line, partialRows: finished };
  }

  for (const row of plan.rows) {
    const values = [];
    for (let order = 1; order <= ORDERS; order += 1) {
      const optionArgs = [];
      for (let offset = 0; offset < OPTION_PAIRS.length; offset += 1) {
        const [key, description] = OPTION_PAIRS[(offset + order - 1) % OPTION_PAIRS.length];
        optionArgs.push('-o', `${key}=${description}`);
      }
      const callArgs = [...gate.cmd.slice(1), 'choice', '-q', QUESTION, ...optionArgs];
      let attempt = 1;
      let r = await spawnCall(gate.cmd[0], callArgs, row.output, ctx.env, ctx.timeoutMs);
      wallTimes.push(r.wallMs);

      if (!r.timedOut && r.code === 4) {
        ctx.callLog.append(record(row, order, attempt, r, null, null, 'unmeasured'));
        const health = readDeemHealth(gate.cmd, ctx.env);
        if (!health.ok) return stop('deem arm stopped: server gone');
        if (health.modelCommit !== gate.modelCommit || health.sourceCommit !== gate.sourceCommit) {
          return stop('deem arm stopped: model commit changed mid-run');
        }
        attempt = 2;
        r = await spawnCall(gate.cmd[0], callArgs, row.output, ctx.env, ctx.timeoutMs);
        wallTimes.push(r.wallMs);
      }

      let pick = null;
      let pickProb = null;
      let status = 'unmeasured';
      let stopLine = null;
      if (r.timedOut) {
        status = 'unmeasured_timeout';
      } else if (r.code === 0) {
        let parsed;
        try {
          parsed = JSON.parse(r.stdout);
        } catch {
          // A body that does not parse is a failed measurement, not a crash.
        }
        const value = parsed?.answers?.answer?.choice;
        if (typeof value === 'string' && OPTION_PAIRS.some(([key]) => key === value)) {
          pick = value;
          status = 'measured';
          const prob = parsed?.answers?.answer?.probabilities?.[value];
          pickProb = typeof prob === 'number' && Number.isFinite(prob) ? prob : null;
        }
      } else if (r.code === 2) {
        stopLine = 'deem arm stopped: usage error';
      } else if (r.code === 3) {
        stopLine = 'deem arm stopped: backend refused';
      } else if (r.code === 130) {
        stopLine = 'deem arm stopped: interrupted';
      }

      ctx.callLog.append(record(row, order, attempt, r, pick, pickProb, status));
      if (stopLine !== null) return stop(stopLine);
      values.push(pick);
    }
    answers.set(row.id, values);
    finished += 1;
  }

  const column = summarizeColumn(
    'deem',
    plan.rows,
    answers,
    plan.baselineCalls,
    plan.labelsSha,
    `model=${gate.model} model_commit=${gate.modelCommit} source_commit=${gate.sourceCommit}`,
  );
  const latency = {
    p50: nearestRank(wallTimes, 0.5),
    p95: nearestRank(wallTimes, 0.95),
  };
  ctx.out(`column deem: K=${column.K} measured=${column.M} unmeasured=${column.unmeasured} latency_p50_ms=${latency.p50 ?? 'none'} latency_p95_ms=${latency.p95 ?? 'none'}`);
  const storedDeem = ctx.stored?.columns?.deem;
  let requalify = null;
  if (
    storedDeem
    && (storedDeem.modelCommit !== gate.modelCommit || storedDeem.sourceCommit !== gate.sourceCommit)
  ) {
    requalify = 'requalify: model commit changed';
    ctx.out(requalify);
  }
  ctx.out(column.line);

  return {
    column: {
      ...column,
      latency,
      modelId: gate.model,
      modelCommit: gate.modelCommit,
      sourceCommit: gate.sourceCommit,
    },
    requalify,
  };
}

/**
 * The Jev arm: one auth test to learn the provider model, then every labeled
 * row asked in each of the three option rotations, one fresh hosted call per
 * order. A measured call is exit 0 with a submitted answer key; exit 4 waits
 * and retries once, a malformed answer or a spent retry leaves that call
 * unmeasured, and a stop line ends the arm with the rows finished. The
 * payload is the reviewer outputs the gate accepted.
 *
 * @param {{
 *   rows: Array<{ id: string, output: string, label: 'pass'|'fail'|'block' }>,
 *   baselineCalls: Map<string, 'pass'|'fail'|'block'|null>,
 *   labelsSha: string
 * }} plan Labeled miss rows with their output text, the baseline calls and the
 *   label digest.
 * @param {{ path: string, provider: string, untracked: boolean }} gate
 *   Passing gate result: the client path, the provider and whether the outputs
 *   file is untracked.
 * @param {{
 *   out: (line: string) => void,
 *   env: Record<string, string | undefined>,
 *   timeoutMs: number,
 *   backoffMs: number,
 *   callLog: { append: (record: object) => void },
 *   stored?: object | null
 * }} ctx Line writer, environment, per-call timeout, retry wait, call log and
 *   the stored report.
 * @returns {{ column: object, requalify: string | null } | { stopped: string, partialRows: number }}
 *   The finished column or the stop line with the rows finished.
 */
async function runJevArm(plan, gate, ctx) {
  const jevVersion = JEV_VERSION.split(' ')[1];
  let chars = 0;
  for (const row of plan.rows) {
    chars += row.output.length + QUESTION.length;
    for (const [key, description] of OPTION_PAIRS) chars += key.length + description.length + 1;
  }
  chars *= ORDERS;
  ctx.out(`jev: payload: ${gate.untracked ? 'untracked' : 'committed'} reviewer outputs; planned calls: ${ORDERS * plan.rows.length + 1}; estimated input tokens: ${Math.ceil(chars / 4)}`);

  const wallTimes = [];
  let finished = 0;

  function stop(line) {
    ctx.out(line);
    ctx.out(`jev: partial rows=${finished}`);
    return { stopped: line, partialRows: finished };
  }

  const auth = await spawnCall(gate.path, ['auth', 'test', '--provider', gate.provider], '', ctx.env, ctx.timeoutMs);
  wallTimes.push(auth.wallMs);
  let model = 'unknown';
  if (auth.code === 0) {
    let parsed;
    try {
      parsed = JSON.parse(auth.stdout);
    } catch {
      // A body that does not parse leaves the model unknown.
    }
    if (typeof parsed?.model === 'string') model = parsed.model;
  }
  ctx.callLog.append({
    backend: 'jev',
    output: null,
    order: null,
    attempt: 1,
    wallMs: auth.wallMs,
    exitCode: auth.code,
    pick: null,
    pickProb: null,
    status: auth.code === 0 ? 'measured' : 'unmeasured',
    jevVersion,
    provider: gate.provider,
    model,
  });
  if (auth.code !== 0) {
    if (auth.code === 3) return stop('jev arm stopped: key rejected');
    if (auth.code === 130) return stop('jev arm stopped: interrupted');
    return stop('jev arm stopped: auth test failed');
  }
  ctx.out(`jev: auth test provider=${gate.provider} model=${model}`);

  const answers = new Map();

  /**
   * One calls.jsonl record. A call that led to a stop or a retry carries no
   * judgment, so its pick and status stay empty.
   */
  function record(row, order, attempt, r, pick, pickProb, status) {
    return {
      backend: 'jev',
      output: row.id,
      order,
      attempt,
      wallMs: r.wallMs,
      exitCode: r.code,
      pick,
      pickProb,
      status,
      jevVersion,
      provider: gate.provider,
      model,
    };
  }

  for (const row of plan.rows) {
    const values = [];
    for (let order = 1; order <= ORDERS; order += 1) {
      const optionArgs = [];
      for (let offset = 0; offset < OPTION_PAIRS.length; offset += 1) {
        const [key, description] = OPTION_PAIRS[(offset + order - 1) % OPTION_PAIRS.length];
        optionArgs.push('-o', `${key}=${description}`);
      }
      const callArgs = ['choice', '--provider', gate.provider, '-q', QUESTION, ...optionArgs];
      let attempt = 1;
      let r = await spawnCall(gate.path, callArgs, row.output, ctx.env, ctx.timeoutMs);
      wallTimes.push(r.wallMs);

      if (!r.timedOut && r.code === 4) {
        ctx.callLog.append(record(row, order, attempt, r, null, null, 'unmeasured'));
        await new Promise((resolve) => setTimeout(resolve, ctx.backoffMs));
        attempt = 2;
        r = await spawnCall(gate.path, callArgs, row.output, ctx.env, ctx.timeoutMs);
        wallTimes.push(r.wallMs);
      }

      let pick = null;
      let pickProb = null;
      let status = 'unmeasured';
      let stopLine = null;
      if (r.timedOut) {
        status = 'unmeasured_timeout';
      } else if (r.code === 0) {
        let parsed;
        try {
          parsed = JSON.parse(r.stdout);
        } catch {
          // A body that does not parse is a failed measurement, not a crash.
        }
        const value = parsed?.answers?.answer?.choice;
        if (typeof value === 'string' && OPTION_PAIRS.some(([key]) => key === value)) {
          pick = value;
          status = 'measured';
          const prob = parsed?.answers?.answer?.probabilities?.[value];
          pickProb = typeof prob === 'number' && Number.isFinite(prob) ? prob : null;
        }
      } else if (r.code === 2) {
        stopLine = 'jev arm stopped: usage error';
      } else if (r.code === 3) {
        stopLine = 'jev arm stopped: key rejected';
      } else if (r.code === 130) {
        stopLine = 'jev arm stopped: interrupted';
      }

      ctx.callLog.append(record(row, order, attempt, r, pick, pickProb, status));
      if (stopLine !== null) return stop(stopLine);
      values.push(pick);
    }
    answers.set(row.id, values);
    finished += 1;
  }

  const column = summarizeColumn(
    'jev',
    plan.rows,
    answers,
    plan.baselineCalls,
    plan.labelsSha,
    `jev_version=${jevVersion} provider=${gate.provider} model=${model}`,
  );
  const latency = {
    p50: nearestRank(wallTimes, 0.5),
    p95: nearestRank(wallTimes, 0.95),
  };
  ctx.out(`column jev: K=${column.K} measured=${column.M} unmeasured=${column.unmeasured} latency_p50_ms=${latency.p50 ?? 'none'} latency_p95_ms=${latency.p95 ?? 'none'}`);
  const storedJev = ctx.stored?.columns?.jev;
  let requalify = null;
  if (storedJev && (storedJev.provider !== gate.provider || storedJev.model !== model)) {
    requalify = 'requalify: model changed';
    ctx.out(requalify);
  }
  ctx.out(column.line);

  return {
    column: {
      ...column,
      latency,
      jevVersion,
      provider: gate.provider,
      model,
    },
    requalify,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. REPORT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The report one run writes to report.json. The census keeps its counts, the
 * labeled set its row count and class split, the baseline its summary, and
 * each arm entry, undefined or { skipped } or { stopped, partialRows } or
 * { column, requalify }, fills one bucket: a finished column under columns, a
 * stop under stopped, a skip under skipped, and a finished column also
 * records the line that explains a re-run.
 *
 * @param {{
 *   census: { fixtures: object, outputs: object },
 *   labeled: { K: number, pass: number, fail: number, block: number },
 *   baseline: { method: 'majority'|'loose', majorityClass: string, majorityRight: number, looseRight: number, right: number },
 *   gateLine: string,
 *   labelsSha: string | null,
 *   jev?: object,
 *   deem?: object
 * }} parts
 * @returns {object} Report object ready for JSON.stringify.
 */
function buildReport(parts) {
  const { census, labeled, baseline, gateLine, labelsSha, jev, deem } = parts;
  const report = {
    question: QUESTION,
    optionsSha256: sha256Hex(JSON.stringify({ question: QUESTION, options: OPTION_PAIRS })),
    labelsSha256: labelsSha,
    census,
    labeled,
    baseline: {
      method: baseline.method,
      majorityClass: baseline.majorityClass,
      majorityRight: baseline.majorityRight,
      looseRight: baseline.looseRight,
      right: baseline.right,
    },
    gate: gateLine,
    columns: {},
    stopped: {},
    skipped: {},
    requalify: {},
  };

  for (const [backend, arm] of [['jev', jev], ['deem', deem]]) {
    if (!arm) continue;
    if (typeof arm.skipped === 'string') {
      report.skipped[backend] = arm.skipped;
      continue;
    }
    if (typeof arm.stopped === 'string') {
      report.stopped[backend] = { line: arm.stopped, partialRows: arm.partialRows };
      continue;
    }
    if (!arm.column) continue;
    const { column } = arm;
    report.columns[backend] = {
      verdict: column.outcome,
      reason: column.reason,
      line: column.line,
      K: column.K,
      M: column.M,
      A: column.A,
      B: column.B,
      W: column.W,
      L: column.L,
      F: column.F,
      pWin: column.pWin,
      pLoss: column.pLoss,
      unmeasured: column.unmeasured,
      latency: column.latency,
    };
    if (backend === 'deem') {
      report.columns[backend].modelId = column.modelId;
      report.columns[backend].modelCommit = column.modelCommit;
      report.columns[backend].sourceCommit = column.sourceCommit;
    }
    if (backend === 'jev') {
      report.columns[backend].jevVersion = column.jevVersion;
      report.columns[backend].provider = column.provider;
      report.columns[backend].model = column.model;
    }
    report.requalify[backend] = arm.requalify ?? null;
  }

  return report;
}

// ─────────────────────────────────────────────────────────────────────────────
// 11. MAIN
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Print the zero-call report: census the fixture cases and the operator's
 * labeled outputs, count the verdict methods of every named report, pick the
 * baseline the columns are compared against and print the label gate. Every
 * input is read before the first line prints, so a bad input leaves stdout
 * empty. A run without --jev or --deem makes no model call and writes no file,
 * while a run with either records the census and every arm result in
 * `<out>/report.json`.
 *
 * @param {string[]} argv - Arguments after the node and script paths
 * @param {object} [deps] - Injected dependencies
 * @param {(line: string) => void} [deps.out] - Line writer. Default writes the line plus '\n' to stdout.
 * @param {(line: string) => void} [deps.err] - Line writer. Default writes the line plus '\n' to stderr.
 * @param {Record<string, string | undefined>} [deps.env] - Model arm environment. Default process.env.
 * @param {number} [deps.timeoutMs] - Model arm call timeout. Default 90000.
 * @param {number} [deps.backoffMs] - Model arm retry wait. Default 2000.
 * @returns {Promise<number>} 0 = report printed, 2 = bad invocation or unreadable input
 */
async function main(argv, deps = {}) {
  const out = deps.out ?? ((line) => process.stdout.write(`${line}\n`));
  const err = deps.err ?? ((line) => process.stderr.write(`[score-verdict-fallback] ${line}\n`));
  const env = deps.env ?? process.env;
  const timeoutMs = deps.timeoutMs ?? 90000;
  const backoffMs = deps.backoffMs ?? 2000;

  let parsed;
  try {
    parsed = parseArgs({
      args: argv,
      strict: true,
      allowPositionals: false,
      options: {
        profile: { type: 'string' },
        outputs: { type: 'string' },
        reports: { type: 'string', multiple: true },
        jev: { type: 'boolean' },
        deem: { type: 'boolean' },
        out: { type: 'string' },
        'accept-payload': { type: 'boolean' },
      },
    });
  } catch (error) {
    err(error instanceof Error ? error.message : String(error));
    return 2;
  }
  const { values } = parsed;
  if ((values.deem === true || values.jev === true) && (typeof values.out !== 'string' || values.out === '')) {
    err(values.deem === true
      ? '--deem needs --out <dir> so every call is recorded'
      : '--jev needs --out <dir> so every call is recorded');
    return 2;
  }

  let fixtureCensus;
  let outputCensus;
  let reports;
  let kept;
  let labelsSha;
  let baseline;
  try {
    const profilePath = typeof values.profile === 'string' && values.profile !== ''
      ? resolveProfile(values.profile)
      : DEFAULT_PROFILE;
    fixtureCensus = censusFixtures(loadFixtureCases(profilePath));
    const outputBytes = typeof values.outputs === 'string' ? fs.readFileSync(values.outputs) : null;
    const outputRows = outputBytes === null ? [] : parseOutputs(outputBytes.toString('utf8'));
    labelsSha = outputBytes === null ? null : sha256Hex(outputBytes);
    outputCensus = censusOutputs(outputRows);
    reports = censusReports(Array.isArray(values.reports) ? values.reports : []);
    kept = outputCensus.kept;
    baseline = chooseBaseline(kept);
  } catch (error) {
    err(error instanceof Error ? error.message : String(error));
    return 2;
  }

  let pass = 0;
  let fail = 0;
  let block = 0;
  for (const row of kept) {
    if (row.label === 'pass') pass += 1;
    else if (row.label === 'fail') fail += 1;
    else block += 1;
  }
  const K = kept.length;

  out(`fixture cases: ${fixtureCensus.total} hits: ${fixtureCensus.hits} misses: ${fixtureCensus.misses}`);
  if (fixtureCensus.noOutput > 0) out(`fixture no recorded output: ${fixtureCensus.noOutput}`);
  if (typeof values.outputs === 'string') {
    out(`outputs rows: ${outputCensus.total} hits: ${outputCensus.hits} misses: ${outputCensus.misses}`);
  }
  for (const report of reports) {
    out(`report ${report.path}: pattern=${report.pattern} llm-grader=${report.llmGrader} none=${report.none}`);
  }
  out(`labeled: ${K} (pass ${pass}, fail ${fail}, block ${block})`);
  out(`baseline majority: ${baseline.majorityClass} right ${baseline.majorityRight} of ${K}`);
  out(`baseline loose: right ${baseline.looseRight} of ${K}`);
  out(`baseline method: ${baseline.method} right ${baseline.right} of ${K}`);
  out(`baseline unknown: right 0 of ${K}`);
  out(`question: ${QUESTION}`);
  out(`options: ${OPTION_PAIRS.length} sha256=${sha256Hex(JSON.stringify({ question: QUESTION, options: OPTION_PAIRS }))}`);
  out(`orders: ${ORDERS}, name order then rotated left by 1 and by 2`);
  out(MARGIN_LINE);
  out(KEEP_RULE_LINE);
  out(POWER_LINE);

  let gate;
  let gateLine;
  if (K < LABEL_GATE) {
    gate = 'label';
    gateLine = `stop: fewer than ${LABEL_GATE} labeled regex-miss outputs`;
  } else if (pass === 0) {
    gate = 'label';
    gateLine = 'stop: no labeled pass output';
  } else if (fail === 0) {
    gate = 'label';
    gateLine = 'stop: no labeled fail output';
  } else if (block === 0) {
    gate = 'label';
    gateLine = 'stop: no labeled block output';
  } else if (10 * baseline.right > 9 * K) {
    gate = 'headroom';
    gateLine = 'no headroom';
  } else {
    gate = 'open';
    gateLine = `planned calls: jev ${3 * K + 1}, deem ${3 * K}`;
  }
  out(gateLine);

  const closedReason = gate === 'headroom' ? 'no headroom' : 'label gate';
  const stored = values.jev === true || values.deem === true ? readStoredReport(values.out) : null;
  const callLog = createCallLog(values.out);
  const plan = gate === 'open'
    ? { rows: kept, baselineCalls: baseline.calls, labelsSha }
    : null;

  let jevResult;
  if (values.jev === true) {
    const jevCheck = jevGate({
      out,
      env,
      timeoutMs,
      outputsFile: typeof values.outputs === 'string' ? values.outputs : null,
      acceptPayload: values['accept-payload'] === true,
    });
    if (!jevCheck.passed) {
      jevResult = { skipped: jevCheck.reason };
    } else if (gate !== 'open') {
      const line = `jev arm skipped: ${closedReason}`;
      out(line);
      jevResult = { skipped: line };
    } else {
      jevResult = await runJevArm(plan, jevCheck, { out, env, timeoutMs, backoffMs, callLog, stored });
    }
  }

  let deemResult;
  if (values.deem === true) {
    const deemCheck = deemGate({ out, env });
    if (!deemCheck.passed) {
      deemResult = { skipped: deemCheck.reason };
    } else if (gate !== 'open') {
      const line = `deem arm skipped: ${closedReason}`;
      out(line);
      deemResult = { skipped: line };
    } else {
      deemResult = await runDeemArm(plan, deemCheck, { out, env, timeoutMs, callLog, stored });
    }
  }

  if (values.jev === true || values.deem === true) {
    const report = buildReport({
      census: {
        fixtures: fixtureCensus,
        outputs: { total: outputCensus.total, hits: outputCensus.hits, misses: outputCensus.misses },
      },
      labeled: { K, pass, fail, block },
      baseline,
      gateLine,
      labelsSha,
      jev: jevResult,
      deem: deemResult,
    });
    fs.mkdirSync(values.out, { recursive: true });
    fs.writeFileSync(path.join(values.out, 'report.json'), JSON.stringify(report, null, 2) + '\n');
  }
  return 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// 12. EXPORTS + CLI ENTRYPOINT
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  QUESTION, OPTION_PAIRS, ORDERS, LABEL_GATE, MARGIN_LINE, KEEP_RULE_LINE, POWER_LINE,
  DEEM_MODEL, DEEM_P50_MS, HEALTH_TIMEOUT_MS, JEV_VERSION, DEFAULT_PROFILE, REPO_CLI_DEEM, USAGE,
  sha256Hex, resolveProfile, loadFixtureCases, censusFixtures,
  parseOutputs, censusOutputs, censusReports,
  loosePick, chooseBaseline,
  binomialTail, decideVerdict, formatP, modalPick, summarizeColumn,
  which, deemCommand, readDeemHealth, deemGate, trackedFile, jevGate,
  nearestRank, spawnCall, createCallLog, readStoredReport,
  buildReport, runDeemArm, runJevArm,
  main,
};

if (require.main === module) {
  main(process.argv.slice(2)).then((code) => {
    process.exitCode = code;
  });
}

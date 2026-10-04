#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: score-d4-agreement                                            ║
// ║ offline D4 hallucination-judgment agreement                              ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * Measure offline whether a Jev noul that flags invented flags, files
 * or functions agrees with the operator's labels more often than the
 * deterministic hallucination-flag check. The default run makes no model call
 * and writes no file, and the script holds and reads no credential.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawn, spawnSync } = require('node:child_process');
const { parseArgs } = require('node:util');
const { spawnClassifierCall } = require('../../../../../cli-classifier/shared/scripts/jev-transport.mjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// The one judgment question a noul answers; the arm asks exactly this.
const QUESTION = 'Does this output name a command-line flag, file or function that the task does not provide?';
// The margin the keep rule demands between the column and the baseline.
const MARGIN_LINE = 'margin: 0.10';
// The keep rule, fixed so a printed verdict can be rechecked by hand.
const KEEP_RULE_LINE = 'keep rule: coverage 10*M >= 9*K, kill p_loss < 0.05, margin 10*(A-B) >= M, sign test p_win < 0.05, flips 10*F <= 3*M (jev only)';
// The power note, fixed so the five-win floor behind a keep is stated.
const POWER_LINE = 'power: a keep needs at least 5 wins with no loss, since 0.5^5 is 0.031';
// The labeled-output floor below which no arm opens.
const LABEL_GATE = 30;
// The per-class labeled-output floor below which no arm opens.
const CLASS_GATE = 5;
// Reruns per jev call, since the hosted noul is sampled once per call.
const JEV_RERUNS = 3;
// The fixture set the default run scores against.
const DEFAULT_FIXTURES_DIR = path.resolve(__dirname, '../../../assets/model-benchmark/benchmark-fixtures');
// The deterministic check the baseline column runs.
const HALLUCINATION_CHECK = path.join(__dirname, 'deterministic', 'hallucination-flag.cjs');
// The usage line printed whenever the run cannot start.
const USAGE = 'usage: score-d4-agreement.cjs --outputs <dir> [--fixtures <dir>] [--labels <file>] [--jev] [--cascade] [--out <dir>] [--accept-payload]';

// ─────────────────────────────────────────────────────────────────────────────
// 3. CENSUS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * List the markdown outputs in a directory, sorted by file name, folding a
 * `.run<k>` rerun suffix into the id it reruns.
 *
 * @param {string} outputsDir - Directory holding candidate output files
 * @returns {Array<{ file: string, id: string }>} One entry per regular markdown file
 * @throws {Error} When the directory cannot be read
 */
function listOutputs(outputsDir) {
  const runSuffix = /^(.+)\.run([1-9]\d*)\.md$/;
  return fs
    .readdirSync(outputsDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => {
      const run = runSuffix.exec(entry.name);
      return { file: entry.name, id: run ? run[1] : entry.name.slice(0, -'.md'.length) };
    })
    .sort((a, b) => (a.file < b.file ? -1 : a.file > b.file ? 1 : 0));
}

/**
 * Read every fixture JSON in a directory into an id-keyed map, counting how
 * many carry an allowlist.
 *
 * @param {string} fixturesDir - Directory holding `*.json` fixture files
 * @returns {{ total: number, withAllowlist: number, byId: Map<string, object> }} Fixture census
 * @throws {Error} When a fixture cannot be read or parsed, or an id repeats
 */
function loadFixtures(fixturesDir) {
  const names = fs
    .readdirSync(fixturesDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
    .map((entry) => entry.name)
    .sort();
  const byId = new Map();
  let withAllowlist = 0;
  for (const name of names) {
    let fixture;
    try {
      fixture = JSON.parse(fs.readFileSync(path.join(fixturesDir, name), 'utf8'));
    } catch (err) {
      throw new Error(`cannot read fixture ${name}: ${err.message}`);
    }
    const id = fixture && fixture.id;
    const key = typeof id === 'string' && id.length > 0 ? id : name.slice(0, -'.json'.length);
    if (byId.has(key)) throw new Error(`duplicate fixture id: ${key}`);
    byId.set(key, fixture);
    if (fixture && typeof fixture === 'object' && Object.prototype.hasOwnProperty.call(fixture, 'allowlist')) withAllowlist++;
  }
  return { total: names.length, withAllowlist, byId };
}

/**
 * Split census entries into those a fixture claims and those it does not,
 * keeping the census order.
 *
 * @param {Array<{ file: string, id: string }>} outputs - Census entries from listOutputs
 * @param {{ byId: Map<string, object> }} fixtures - Fixture census from loadFixtures
 * @returns {{ matched: Array<{ file: string, id: string, fixture: object }>, unmatched: Array<{ file: string, id: string }> }} Match split
 */
function matchOutputs(outputs, fixtures) {
  const matched = [];
  const unmatched = [];
  for (const output of outputs) {
    const fixture = fixtures.byId.get(output.id);
    if (fixture) matched.push({ file: output.file, id: output.id, fixture });
    else unmatched.push({ file: output.file, id: output.id });
  }
  return { matched, unmatched };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. LABELS
// ─────────────────────────────────────────────────────────────────────────────

// Labels are the operator's gold, so a typo must stop the run rather than drop a row.
/**
 * Parse the operator's label file into an output-file-keyed map.
 *
 * @param {string} text - Label file contents, one JSON object per line
 * @returns {Map<string, 'yes'|'no'>} Output file name -> operator label
 * @throws {Error} When a row is not JSON, names no plain output file, carries a
 *   value other than yes or no, or repeats an output
 */
function parseLabels(text) {
  const labels = new Map();
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const row = i + 1;
    if (lines[i].trim() === '') continue;
    let parsed;
    try {
      parsed = JSON.parse(lines[i]);
    } catch {
      throw new Error(`labels row ${row}: not JSON`);
    }
    const isPlainObject = parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed);
    const output = isPlainObject ? parsed.output : undefined;
    if (typeof output !== 'string' || output.length === 0 || output.includes('/')) {
      throw new Error(`labels row ${row}: output must be a file name`);
    }
    const value = parsed.hallucinated;
    if (value !== 'yes' && value !== 'no') {
      throw new Error(`labels row ${row}: hallucinated must be yes or no, got ${JSON.stringify(value)}`);
    }
    if (labels.has(output)) throw new Error(`labels row ${row}: duplicate output ${output}`);
    labels.set(output, value);
  }
  return labels;
}

/**
 * Hash text or bytes with SHA-256.
 *
 * @param {string|Buffer} input - Text or bytes to hash
 * @returns {string} Lowercase hex digest
 */
function sha256Hex(input) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. BASELINE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Build the text a model reads for one output: the task, the visible spec, the
 * allowlist and the output, as sections joined by one blank line.
 *
 * @param {object} fixture - Fixture the output answers
 * @param {string} outputText - Text of the output file
 * @returns {string} State text handed to the model
 */
function buildState(fixture, outputText) {
  const sections = [];
  if (typeof fixture.task === 'string') sections.push(`Task:\n${fixture.task}`);
  if (typeof fixture.visibleSpec === 'string') sections.push(`Visible spec:\n${fixture.visibleSpec}`);
  if (Object.prototype.hasOwnProperty.call(fixture, 'allowlist')) sections.push(`Allowlist:\n${JSON.stringify(fixture.allowlist)}`);
  sections.push(`Output:\n${outputText}`);
  return sections.join('\n\n');
}

// The check runs unchanged, and a failure stops the run because a default score
// would fake the baseline the columns are compared against.
/**
 * Run the deterministic hallucination check on one output and map its score to
 * a yes or no call.
 *
 * @param {object} fixture - Fixture the output answers
 * @param {string} outputPath - Path of the output file to check
 * @returns {'yes'|'no'} Yes when the check scores below 1, else no
 * @throws {Error} When the check fails to run, exits non-zero or prints no
 *   parseable score
 */
function deterministicCall(fixture, outputPath) {
  const name = path.basename(outputPath);
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'd4-check-'));
  try {
    const fixtureJson = path.join(dir, 'fixture.json');
    fs.writeFileSync(fixtureJson, JSON.stringify({ id: fixture.id, allowlist: fixture.allowlist || {} }), 'utf8');
    const res = spawnSync(process.execPath, [HALLUCINATION_CHECK, fixtureJson, outputPath], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    if (res.error || res.status !== 0) {
      const detail = (res.stderr || '').trim() || `exit ${res.status}`;
      throw new Error(`deterministic check failed on ${name}: ${detail}`);
    }
    let parsed;
    try {
      parsed = JSON.parse((res.stdout || '').trim());
    } catch {
      throw new Error(`deterministic check failed on ${name}: unparseable result`);
    }
    if (!parsed || !Number.isFinite(parsed.score)) throw new Error(`deterministic check failed on ${name}: unparseable result`);
    return parsed.score < 1 ? 'yes' : 'no';
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

/**
 * Pick the stronger of the two baseline methods: the deterministic check when
 * it is at least as right as the majority class, else the majority class.
 *
 * @param {Array<{ file: string, label: 'yes'|'no', check: 'yes'|'no' }>} rows - Labeled rows with both calls
 * @returns {{ method: 'check'|'majority', majorityClass: 'yes'|'no', checkRight: number, majorityRight: number, right: number, calls: Map<string, 'yes'|'no'> }} The chosen baseline
 */
function chooseBaseline(rows) {
  let yesLabels = 0;
  let noLabels = 0;
  for (const row of rows) {
    if (row.label === 'yes') yesLabels++;
    else noLabels++;
  }
  const majorityClass = yesLabels > noLabels ? 'yes' : 'no';
  let checkRight = 0;
  let majorityRight = 0;
  for (const row of rows) {
    if (row.check === row.label) checkRight++;
    if (row.label === majorityClass) majorityRight++;
  }
  const method = checkRight >= majorityRight ? 'check' : 'majority';
  const right = method === 'check' ? checkRight : majorityRight;
  const calls = new Map(rows.map((row) => [row.file, method === 'check' ? row.check : majorityClass]));
  return { method, majorityClass, checkRight, majorityRight, right, calls };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. KEEP RULE
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
 * test, flips. A lopsided loss tail kills before the margin is read, and the
 * flips check binds only the rerun-sampled backend, since a single call
 * cannot flip.
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
 * One column's counts and verdict. A row is measured only when its answer
 * array holds exactly one answer per call and every answer is a finite
 * number in [0, 1]; every other row stays unmeasured. The call is the answer
 * class named at least twice, and the reruns that dissent from it add to the
 * flip count, so an unstable call is never hidden.
 *
 * @param {'jev'|'cascade'} backend - Backend name, printed on the verdict line
 * @param {Array<{ file: string, label: 'yes'|'no' }>} rows - Labeled rows, in file order
 * @param {Map<string, Array<number|null>>} answers - Output file name -> submitted answers
 * @param {Map<string, 'yes'|'no'>} baselineCalls - Output file name -> baseline call
 * @param {string} labelsSha - Label digest printed on the verdict line
 * @param {string} suffix - Backend identity appended to the line when non-empty
 * @returns {{ backend: string, K: number, M: number, unmeasured: number, A: number, B: number, W: number, L: number, F: number|null, pWin: number, pLoss: number, perClass: object, outcome: string, reason: string|null, line: string }} Column summary
 */
function binomialMass(successes, trials, probability) {
  if (probability === 0) return successes === 0 ? 1 : 0;
  if (probability === 1) return successes === trials ? 1 : 0;
  let logCombination = 0;
  for (let i = 1; i <= successes; i += 1) {
    logCombination += Math.log(trials - successes + i) - Math.log(i);
  }
  return Math.exp(
    logCombination
      + successes * Math.log(probability)
      + (trials - successes) * Math.log1p(-probability),
  );
}

function binomialCdf(successes, trials, probability) {
  let total = 0;
  for (let value = 0; value <= successes; value += 1) {
    total += binomialMass(value, trials, probability);
  }
  return total;
}

function binomialUpperTail(successes, trials, probability) {
  let total = 0;
  for (let value = successes; value <= trials; value += 1) {
    total += binomialMass(value, trials, probability);
  }
  return total;
}

function clopperPearsonInterval(successes, trials) {
  if (trials === 0) return { lower: null, upper: null };
  const tail = 0.025;
  let lower = 0;
  let upper = 1;
  if (successes > 0) {
    let low = 0;
    let high = 1;
    for (let i = 0; i < 60; i += 1) {
      const middle = (low + high) / 2;
      if (binomialUpperTail(successes, trials, middle) < tail) low = middle;
      else high = middle;
    }
    lower = (low + high) / 2;
  }
  if (successes < trials) {
    let low = 0;
    let high = 1;
    for (let i = 0; i < 60; i += 1) {
      const middle = (low + high) / 2;
      if (binomialCdf(successes, trials, middle) > tail) low = middle;
      else high = middle;
    }
    upper = (low + high) / 2;
  }
  return { lower, upper };
}

function summarizePerClass(rows, predictions) {
  const result = { confidenceLevel: 0.95, method: 'clopper-pearson' };
  for (const label of ['yes', 'no']) {
    const measuredRows = rows.filter((row) => row.label === label && predictions.has(row.file));
    const correct = measuredRows.filter((row) => predictions.get(row.file) === row.label).length;
    result[label] = {
      correct,
      total: measuredRows.length,
      accuracy: measuredRows.length > 0 ? correct / measuredRows.length : null,
      interval: clopperPearsonInterval(correct, measuredRows.length),
    };
  }
  return result;
}

function formatClassResult(backend, label, stats) {
  const rate = stats.accuracy === null ? 'none' : stats.accuracy.toFixed(3);
  const lower = stats.interval.lower === null ? 'none' : stats.interval.lower.toFixed(3);
  const upper = stats.interval.upper === null ? 'none' : stats.interval.upper.toFixed(3);
  return `class ${backend} ${label}: ${stats.correct}/${stats.total} (${rate}) 95% CI [${lower}, ${upper}]`;
}

function summarizeColumn(backend, rows, answers, baselineCalls, labelsSha, suffix) {
  const expected = JEV_RERUNS;
  const K = rows.length;
  let M = 0;
  let A = 0;
  let B = 0;
  let W = 0;
  let L = 0;
  let F = 0;
  const predictions = new Map();
  for (const row of rows) {
    const values = answers.get(row.file);
    if (!Array.isArray(values) || values.length !== expected) continue;
    if (!values.every((value) => Number.isFinite(value) && value >= 0 && value <= 1)) continue;
    M += 1;
    const yesVotes = values.filter((value) => value >= 0.5).length;
    const call = yesVotes >= 2 ? 'yes' : 'no';
    predictions.set(row.file, call);
    F += expected - (yesVotes >= 2 ? yesVotes : expected - yesVotes);
    const columnRight = call === row.label;
    const baselineRight = baselineCalls.get(row.file) === row.label;
    if (columnRight) A += 1;
    if (baselineRight) B += 1;
    if (columnRight && !baselineRight) W += 1;
    if (baselineRight && !columnRight) L += 1;
  }
  const verdict = decideVerdict({ K, M, A, B, W, L, F });
  const outcomeText = verdict.reason === null ? verdict.outcome : `stop (${verdict.reason})`;
  let line = `verdict ${backend}: ${outcomeText} K=${K} M=${M} A=${A} B=${B} W=${W} L=${L} F=${F} p_win=${formatP(verdict.pWin)} p_loss=${formatP(verdict.pLoss)} labels_sha256=${labelsSha}`;
  if (typeof suffix === 'string' && suffix.length > 0) line += ` ${suffix}`;
  return {
    backend,
    K,
    M,
    unmeasured: K - M,
    A,
    B,
    W,
    L,
    F,
    pWin: verdict.pWin,
    pLoss: verdict.pLoss,
    perClass: summarizePerClass(rows, predictions),
    outcome: verdict.outcome,
    reason: verdict.reason,
    line,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. EXECUTABLE LOOKUP
// ─────────────────────────────────────────────────────────────────────────────


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


// ─────────────────────────────────────────────────────────────────────────────
// 8. JEV GATE
// ─────────────────────────────────────────────────────────────────────────────

// The pinned client version the gate accepts.
const JEV_VERSION = 'jev 0.6.2';

// An untracked output may hold text nobody committed, which is why it needs
// the operator's explicit accept before it leaves the machine.
/**
 * The names git tracks in a directory, from `git ls-files -z`. A git failure
 * returns an empty set, because an output whose status cannot be read must not
 * count as committed.
 *
 * @param {string} dir Directory the git command runs in.
 * @param {string[]} names File names to test.
 * @returns {Set<string>} The subset of names git tracks.
 */
function trackedFiles(dir, names) {
  const res = spawnSync('git', ['ls-files', '-z', '--', ...names], {
    cwd: dir,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  if (res.error || res.status !== 0) return new Set();
  return new Set((res.stdout ?? '').split('\0').filter((name) => name.length > 0));
}

/**
 * Identity line, then the pinned version, a credential check and the payload
 * rule. A miss prints a skip line and leaves the census text already written.
 *
 * @param {{
 *   out: (line: string) => void,
 *   env: Record<string, string | undefined>,
 *   timeoutMs: number,
 *   outputsDir: string,
 *   labeledFiles: string[],
 *   acceptPayload: boolean
 * }} ctx Line writer, environment, per-call timeout, outputs directory, labeled
 *   file names and the operator's payload accept.
 * @returns {{ passed: boolean, path: string | null, provider: string, untracked: number, reason?: string }}
 *   True when the gate passed; a failed gate carries the skip line it printed.
 */
function jevGate(ctx, backend = 'jev') {
  const provider = ctx.env.JEV_PROVIDER || 'official';
  const jevPath = which('jev', ctx.env);
  ctx.out(`jev: path=${jevPath ?? 'none'} provider=${provider}`);
  if (jevPath === null) {
    const skipLine = `${backend} arm skipped: jev not on PATH`;
    ctx.out(skipLine);
    return { passed: false, path: jevPath, provider, untracked: 0, reason: skipLine };
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
    const skipLine = `${backend} arm skipped: version`;
    ctx.out(skipLine);
    ctx.out(`jev: found=${JSON.stringify(found)} path=${jevPath}`);
    return { passed: false, path: jevPath, provider, untracked: 0, reason: skipLine };
  }

  const auth = spawnSync(jevPath, ['auth', 'status', '--provider', provider], opts);
  if (auth.status !== 0) {
    const skipLine = `${backend} arm skipped: no credential`;
    ctx.out(skipLine);
    return { passed: false, path: jevPath, provider, untracked: 0, reason: skipLine };
  }

  let untracked = 0;
  if (ctx.labeledFiles.length > 0) {
    const tracked = trackedFiles(ctx.outputsDir, ctx.labeledFiles);
    untracked = ctx.labeledFiles.filter((name) => !tracked.has(name)).length;
  }
  if (untracked > 0 && ctx.acceptPayload !== true) {
    const skipLine = `${backend} arm skipped: payload not accepted`;
    ctx.out(skipLine);
    return { passed: false, path: jevPath, provider, untracked, reason: skipLine };
  }
  return { passed: true, path: jevPath, provider, untracked };
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. ARM HELPERS
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

/**
 * The report one run writes to report.json. The census keeps its counts, the
 * labeled set its row count and class split, the baseline its summary, and
 * each arm entry, undefined or { skipped } or { stopped, partialRows } or
 * { column, requalify }, fills one bucket: a finished column under columns, a
 * stop under stopped, a skip under skipped, and a finished column also
 * records the line that explains a re-run.
 *
 * @param {{
 *   census: { outputs: number, matched: number, unmatched: number, fixtures: number, allowlist: number },
 *   labeled: { K: number, yes: number, no: number, dropped: number },
 *   baseline: { method: 'check'|'majority', majorityClass: 'yes'|'no', checkRight: number, majorityRight: number, right: number },
 *   gateLine: string,
 *   labelsSha: string | null,
 *   jev?: object,
 *   cascade?: object
 * }} parts
 * @returns {object} Report object ready for JSON.stringify.
 */
function buildReport(parts) {
  const { census, labeled, baseline, gateLine, labelsSha, jev, cascade } = parts;
  const report = {
    question: QUESTION,
    labelsSha256: labelsSha,
    census,
    labeled,
    baseline: {
      method: baseline.method,
      majorityClass: baseline.majorityClass,
      checkRight: baseline.checkRight,
      majorityRight: baseline.majorityRight,
      right: baseline.right,
    },
    gate: gateLine,
    columns: {},
    stopped: {},
    skipped: {},
    requalify: {},
  };

  for (const [backend, arm] of [['jev', jev], ['cascade', cascade]]) {
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
      perClass: column.perClass,
      latency: column.latency,
    };

    if (backend === 'cascade') {
      report.columns[backend].routedRows = column.routedRows;
      report.columns[backend].modelCalls = column.modelCalls;
      report.columns[backend].plannedCalls = column.plannedCalls;
    }

    if (backend === 'jev' || backend === 'cascade') {
      report.columns[backend].jevVersion = column.jevVersion;
      report.columns[backend].provider = column.provider;
      report.columns[backend].model = column.model;
    }
    report.requalify[backend] = arm.requalify ?? null;
  }

  return report;
}


/**
 * The model arm: one auth test, then JEV_RERUNS hosted noul calls per routed
 * row, since the hosted noul is sampled once per call. Cascade routes only
 * check-flagged rows and uses the deterministic no result for the rest. A measured call is
 * exit 0 with a finite noul in [0, 1]; exit 0 without one is a failed
 * measurement. An exit-4 call waits and retries once, and a stop line ends
 * the arm with the row count it finished. The payload is the benchmark
 * outputs and fixture task text the gate accepted.
 *
 * @param {{
 *   rows: Array<{ file: string, label: 'yes'|'no', state: string }>,
 *   baselineCalls: Map<string, 'yes'|'no'>,
 *   checkCalls: Map<string, 'yes'|'no'>,
 *   labelsSha: string
 * }} plan Labeled rows with their state text, the baseline calls and the label
 *   digest.
 * @param {{ path: string, provider: string, untracked: number }} gate
 *   Passing gate result: the client path, the provider and the untracked
 *   labeled-output count.
 * @param {{
 *   out: (line: string) => void,
 *   env: Record<string, string | undefined>,
 *   timeoutMs: number,
 *   backoffMs: number,
 *   callLog: { append: (record: object) => void },
 *   stored: object | null
 * }} ctx Line writer, environment, per-call timeout, retry wait, call log and
 *   the stored report.
 * @param {'jev'|'cascade'} [backend='jev'] Select all rows or check-flagged rows.
 * @returns {{ column: object, requalify: string | null } | { stopped: string, partialRows: number }}
 *   The finished column or the stop line with the rows finished.
 */
async function runJevArm(plan, gate, ctx, backend = 'jev') {
  const routedRows = backend === 'cascade'
    ? plan.rows.filter((row) => plan.checkCalls.get(row.file) === 'yes')
    : plan.rows;
  const jevVersion = JEV_VERSION.split(' ')[1];
  let chars = 0;
  for (const row of routedRows) chars += row.state.length + QUESTION.length;
  chars *= JEV_RERUNS;
  const plannedCalls = JEV_RERUNS * routedRows.length + 1;
  ctx.out(`${backend}: payload: ${gate.untracked === 0 ? 'committed' : 'untracked'} benchmark outputs and fixture task text; planned calls: ${plannedCalls}; estimated input tokens: ${Math.ceil(chars / 4)}`);

  const wallTimes = [];
  let finished = 0;
  let modelCalls = 0;

  function stop(line) {
    ctx.out(line);
    ctx.out(`${backend}: partial rows=${finished}`);
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
    backend,
    output: null,
    rerun: null,
    attempt: 1,
    wallMs: auth.wallMs,
    exitCode: auth.code,
    noul: null,
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
  ctx.out(`${backend}: auth test provider=${gate.provider} model=${model}`);

  const answers = new Map();
  // Every model that answered a call, so the column can name what answered.
  const answered = new Set();

  /**
   * One calls.jsonl record. A spawn that led to a stop or a retry carries no
   * judgment, so its noul and status stay empty.
   */
  function record(row, rerun, attempt, r, noul, status) {
    return {
      backend,
      output: row.file,
      rerun,
      attempt,
      wallMs: r.wallMs,
      exitCode: r.code,
      transport: r.transport,
      noul,
      status,
      jevVersion,
      provider: gate.provider,
      model: r.model ?? model,
    };
  }

  for (const row of routedRows) {
    const values = [];
    for (let rerun = 1; rerun <= JEV_RERUNS; rerun += 1) {
      const callArgs = ['noul', '--provider', gate.provider, '-q', QUESTION];
      let attempt = 1;
      modelCalls += 1;
      let r = await spawnClassifierCall({
        file: gate.path,
        args: callArgs,
        stdin: row.state,
        env: ctx.env,
        timeoutMs: ctx.timeoutMs,
        report: ctx.out,
      });
      wallTimes.push(r.wallMs);
      if (typeof r.model === 'string') answered.add(r.model);

      if (!r.timedOut && r.code === 4) {
        ctx.callLog.append(record(row, rerun, attempt, r, null, 'unmeasured'));
        await new Promise((resolve) => setTimeout(resolve, ctx.backoffMs));
        attempt = 2;
        modelCalls += 1;
        r = await spawnClassifierCall({
          file: gate.path,
          args: callArgs,
          stdin: row.state,
          env: ctx.env,
          timeoutMs: ctx.timeoutMs,
          report: ctx.out,
        });
        wallTimes.push(r.wallMs);
        if (typeof r.model === 'string') answered.add(r.model);
      }

      let noul = null;
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
        const value = parsed?.answers?.answer?.noul;
        if (Number.isFinite(value) && value >= 0 && value <= 1) {
          noul = value;
          status = 'measured';
        } else {
          status = 'failed';
        }
      } else if (r.code === 2) {
        stopLine = 'jev arm stopped: usage error';
      } else if (r.code === 3) {
        stopLine = 'jev arm stopped: key rejected';
      } else if (r.code === 130) {
        stopLine = 'jev arm stopped: interrupted';
      }

      ctx.callLog.append(record(row, rerun, attempt, r, noul, status));
      if (stopLine !== null) return stop(stopLine);
      values.push(noul);
    }
    answers.set(row.file, values);
    finished += 1;
  }

  if (backend === 'cascade') {
    for (const row of plan.rows) {
      if (!answers.has(row.file)) answers.set(row.file, Array(JEV_RERUNS).fill(plan.checkCalls.get(row.file) === 'yes' ? 1 : 0));
    }
  }

  // The verdict names the model that answered its calls, joining the names when more than one model answered.
  const answeringModel = answered.size === 0 ? model : [...answered].sort().join('+');
  const column = summarizeColumn(
    backend,
    plan.rows,
    answers,
    plan.baselineCalls,
    plan.labelsSha,
    `jev_version=${jevVersion} provider=${gate.provider} model=${answeringModel}`,
  );
  const latency = {
    p50: nearestRank(wallTimes, 0.5),
    p95: nearestRank(wallTimes, 0.95),
  };
  ctx.out(`column ${backend}: K=${column.K} measured=${column.M} unmeasured=${column.unmeasured} latency_p50_ms=${latency.p50 ?? 'none'} latency_p95_ms=${latency.p95 ?? 'none'}`);
  if (backend === 'cascade') {
    ctx.out(`cascade: routed ${routedRows.length} of ${plan.rows.length} check-flagged outputs; model calls=${modelCalls}`);
  }
  for (const label of ['yes', 'no']) ctx.out(formatClassResult(backend, label, column.perClass[label]));
  const storedArm = ctx.stored?.columns?.[backend];
  let requalify = null;
  if (storedArm) {
    const reasons = [];
    if (storedArm.provider !== gate.provider || storedArm.model !== answeringModel) reasons.push('model changed');
    if (reasons.length > 0) requalify = `requalify: ${reasons.join(', ')}`;
  }
  if (requalify !== null) {
    ctx.out(requalify);
  }
  ctx.out(column.line);

  return {
    column: {
      ...column,
      latency,
      jevVersion,
      provider: gate.provider,
      model: answeringModel,
      routedRows: routedRows.length,
      modelCalls,
      plannedCalls,
    },
    requalify,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. MAIN
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Print the zero-call report: census the outputs, match them against the
 * fixtures, read the operator's labels, run the deterministic check on every
 * labeled row and pick the baseline the arms are compared against. The default
 * run spawns nothing but the deterministic check and writes no file.
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
  const err = deps.err ?? ((line) => process.stderr.write(`[score-d4-agreement] ${line}\n`));
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
        outputs: { type: 'string' },
        fixtures: { type: 'string' },
        labels: { type: 'string' },
        out: { type: 'string' },

        jev: { type: 'boolean' },
        cascade: { type: 'boolean' },
        'accept-payload': { type: 'boolean' },
      },
    });
  } catch (error) {
    err(error instanceof Error ? error.message : String(error));
    return 2;
  }
  const { values } = parsed;
  if (typeof values.outputs !== 'string' || values.outputs === '') {
    err(USAGE);
    return 2;
  }
  const runJev = values.jev === true;
  const runCascade = values.cascade === true;
  const runModelArms = runJev || runCascade;
  if (runModelArms && (typeof values.out !== 'string' || values.out === '')) {
    const message = runJev && runCascade
      ? '--jev and --cascade need --out <dir> so every call is recorded'
      : (runCascade ? '--cascade needs --out <dir> so every call is recorded' : '--jev needs --out <dir> so every call is recorded');
    err(message);
    return 2;
  }

  let outputs;
  let fixtures;
  let matched;
  let unmatched;
  let labels;
  let labelsSha;
  let rows;
  let baseline;
  try {
    outputs = listOutputs(values.outputs);
    fixtures = loadFixtures(values.fixtures ?? DEFAULT_FIXTURES_DIR);
    const split = matchOutputs(outputs, fixtures);
    matched = split.matched;
    unmatched = split.unmatched;
    if (typeof values.labels === 'string') {
      const bytes = fs.readFileSync(values.labels);
      labels = parseLabels(bytes.toString('utf8'));
      labelsSha = sha256Hex(bytes);
    } else {
      labels = new Map();
      labelsSha = null;
    }
    rows = matched
      .filter((entry) => labels.has(entry.file))
      .map((entry) => {
        const outputPath = path.join(values.outputs, entry.file);
        return {
          file: entry.file,
          id: entry.id,
          fixture: entry.fixture,
          outputPath,
          label: labels.get(entry.file),
          check: deterministicCall(entry.fixture, outputPath),
        };
      });
    baseline = chooseBaseline(rows);
  } catch (error) {
    err(error instanceof Error ? error.message : String(error));
    return 2;
  }

  let yes = 0;
  let no = 0;
  for (const row of rows) {
    if (row.label === 'yes') yes += 1;
    else no += 1;
  }

  const K = rows.length;
  out(`outputs: ${outputs.length}`);
  out(`matched: ${matched.length}`);
  out(`unmatched: ${unmatched.length}`);
  out(`allowlist: ${fixtures.withAllowlist} of ${fixtures.total}`);
  out(labelsSha === null ? 'labels: none' : `labels: sha256=${labelsSha} rows=${labels.size}`);
  out(`labeled: ${K} (yes ${yes}, no ${no})`);
  out(`labels dropped: ${labels.size - K}`);
  out(`baseline check: right ${baseline.checkRight} of ${K}`);
  out(`baseline majority: ${baseline.majorityClass} right ${baseline.majorityRight} of ${K}`);
  out(`baseline method: ${baseline.method} right ${baseline.right} of ${K}`);
  out(`question: ${QUESTION}`);
  out(MARGIN_LINE);
  out(KEEP_RULE_LINE);
  out(POWER_LINE);
  let gate;
  let gateLine;
  if (K < LABEL_GATE) {
    gate = 'label';
    gateLine = `stop: fewer than ${LABEL_GATE} labeled outputs`;
  } else if (yes < CLASS_GATE) {
    gate = 'label';
    gateLine = `stop: fewer than ${CLASS_GATE} labeled yes outputs`;
  } else if (no < CLASS_GATE) {
    gate = 'label';
    gateLine = `stop: fewer than ${CLASS_GATE} labeled no outputs`;
  } else if (10 * baseline.right > 9 * K) {
    gate = 'headroom';
    gateLine = 'no headroom';
  } else {
    gate = 'open';
    const planned = [];
    if (runJev || !runCascade) planned.push(`jev ${JEV_RERUNS * K + 1}`);
    if (runCascade) {
      const routed = rows.filter((row) => row.check === 'yes').length;
      planned.push(`cascade ${JEV_RERUNS * routed + 1}`);
    }
    gateLine = `planned calls: ${planned.join('; ')}`;
  }
  out(gateLine);

  const stored = runModelArms ? readStoredReport(values.out) : null;
  const requestedBackends = [];
  if (runJev) requestedBackends.push('jev');
  if (runCascade) requestedBackends.push('cascade');
  const changedLabelArms = Object.prototype.hasOwnProperty.call(stored || {}, 'labelsSha256')
    ? requestedBackends.filter((backend) => stored?.columns?.[backend]
      && stored.labelsSha256 !== labelsSha)
    : [];
  if (changedLabelArms.length > 0) {
    err(`requalify refused: labels SHA changed for ${changedLabelArms.join(', ')}`);
    return 2;
  }
  const callLog = createCallLog(values.out);
  const plan = gate === 'open'
    ? {
      rows: rows.map((row) => ({ file: row.file, label: row.label, state: buildState(row.fixture, fs.readFileSync(row.outputPath, 'utf8')) })),
      baselineCalls: baseline.calls,
      checkCalls: new Map(rows.map((row) => [row.file, row.check])),
      labelsSha,
    }
    : null;

  let jevResult;
  let cascadeResult;
  if (runModelArms) {
    const gateBackend = runJev ? 'jev' : 'cascade';
    const jevCheck = jevGate({ out, env, timeoutMs, outputsDir: values.outputs, labeledFiles: rows.map((row) => row.file), acceptPayload: values['accept-payload'] === true }, gateBackend);
    let skipped = null;
    if (!jevCheck.passed) {
      skipped = jevCheck.reason;
    } else if (gate !== 'open') {
      skipped = gate === 'headroom' ? 'no headroom' : 'label gate';
    }
    if (skipped !== null) {
      if (runJev) {
        const line = skipped.startsWith('jev arm skipped:') ? skipped : `jev arm skipped: ${skipped}`;
        if (jevCheck.passed) out(line);
        jevResult = { skipped: line };
      }
      if (runCascade) {
        const reason = skipped.replace(/^(?:jev|cascade) arm skipped:\s*/, '');
        const line = `cascade arm skipped: ${reason}`;
        if (runJev || jevCheck.passed) out(line);
        cascadeResult = { skipped: line };
      }
    } else {
      const armContext = { out, env, timeoutMs, backoffMs, callLog, stored };
      if (runJev) jevResult = await runJevArm(plan, jevCheck, armContext);
      if (runCascade) cascadeResult = await runJevArm(plan, jevCheck, armContext, 'cascade');
    }
  }
  if (runModelArms) {
    const report = buildReport({
      census: { outputs: outputs.length, matched: matched.length, unmatched: unmatched.length, fixtures: fixtures.total, allowlist: fixtures.withAllowlist },
      labeled: { K, yes, no, dropped: labels.size - K },
      baseline,
      gateLine,
      labelsSha,
      jev: jevResult,
      cascade: cascadeResult,
    });
    fs.mkdirSync(values.out, { recursive: true });
    fs.writeFileSync(path.join(values.out, 'report.json'), JSON.stringify(report, null, 2) + '\n');
  }
  return 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// 11. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = { QUESTION, MARGIN_LINE, KEEP_RULE_LINE, POWER_LINE, LABEL_GATE, CLASS_GATE, JEV_RERUNS, DEFAULT_FIXTURES_DIR, HALLUCINATION_CHECK, USAGE, JEV_VERSION, listOutputs, loadFixtures, matchOutputs, parseLabels, sha256Hex, buildState, deterministicCall, chooseBaseline, binomialTail, decideVerdict, formatP, summarizeColumn, which, trackedFiles, jevGate, nearestRank, spawnCall, createCallLog, readStoredReport, buildReport, runJevArm, main };

// ─────────────────────────────────────────────────────────────────────────────
// 12. CLI ENTRYPOINT
// ─────────────────────────────────────────────────────────────────────────────

if (require.main === module) {
  main(process.argv.slice(2)).then((code) => {
    process.exitCode = code;
  });
}

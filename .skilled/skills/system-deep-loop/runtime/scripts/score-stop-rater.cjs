#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Score Stop Rater
// ───────────────────────────────────────────────────────────────────
'use strict';

/**
 * Replay the recorded lineage states offline and rate each stop decision
 * against gold derived from the delta files. The default run makes no model
 * call and writes no file, and the script holds and reads no credential.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawn, spawnSync } = require('node:child_process');
const { parseArgs } = require('node:util');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// The one judgment question a rating arm asks; both arms ask exactly this.
const QUESTION = 'How much new information did this iteration add to the research so far?';
// The five novelty levels the arms choose from, lowest first, paired with LEVEL_RATIOS.
const LEVEL_LABELS = [
  '0.0 No new information',
  '0.2 Mostly confirmation or marginal novelty',
  '0.5 Mixed new and repeated material',
  '0.7 Several new findings plus some refinements',
  '1.0 Mostly new findings or first broad pass',
];
// The ratio each level reports, paired positionally with LEVEL_LABELS.
const LEVEL_RATIOS = [0.0, 0.2, 0.5, 0.7, 1.0];
// The sample cap: the census rates at most this many lineages per run.
const SAMPLE_MAX = 25;
// The confirmed-reads floor below which no arm opens.
const LABEL_GATE = 5;
// The consecutive-evidence window behind the inert-novelty count.
const INERT_WINDOW = 3;
// The character bound on one iteration's state text; larger states are withheld.
const STATE_MAX_CHARS = 24000;
// The convergence threshold the replay vote defaults to when the config is silent.
const DEFAULT_CONVERGENCE_THRESHOLD = 0.05;
// The iteration floor the replay vote defaults to when the config is silent.
const DEFAULT_MIN_ITERATIONS = 3;
// The margin the keep rule requires between a column and its baseline.
const MARGIN_LINE = 'margin: 0.10';
// The keep rule fixed as one line, so a printed verdict can be rechecked by hand.
const KEEP_RULE_LINE = 'keep rule: coverage 10*M >= 9*K, kill p_loss < 0.05, margin 10*(A-B) >= M, sign test p_win < 0.05, flips 10*F <= C (jev only)';
// The power note fixed as one line: the five-win floor behind a keep.
const POWER_LINE = 'power: a keep needs at least 5 wins with no loss, since 0.5^5 = 0.03125 < 0.05';
// The Deem model identity and the two-option p50 the wall-time estimate cites.
const DEEM_MODEL = 'deem-0.8-v1';
const DEEM_P50_MS = 65.6;
// The one jev version the gate accepts.
const JEV_VERSION = 'jev 0.6.2';
// The health probe is bounded so an unreachable backend skips fast.
const HEALTH_TIMEOUT_MS = 2000;
// Every measured call is bounded so one hung spawn cannot hang the run.
const CALL_TIMEOUT_MS = 90000;
// The single backoff retry a transient jev failure gets.
const BACKOFF_MS = 2000;
// The reruns each Jev score gets, because the hosted model samples once per call.
const JEV_RERUNS = 3;
// The usage line for the one supported invocation.
const USAGE = 'node .skilled/skills/system-deep-loop/runtime/scripts/score-stop-rater.cjs [--jev] [--deem] [--out <dir>] [--gold-reads <file>]';

// ─────────────────────────────────────────────────────────────────────────────
// 3. CENSUS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * List every tracked deep-research state file under a repository root.
 *
 * @param {string} repoRoot - Repository root the walk runs under
 * @returns {string[]} Repo-relative state file paths, one per lineage
 * @throws {Error} When git itself fails
 */
function listStateFiles(repoRoot) {
  const result = spawnSync('git', ['ls-files', '-z', '--', '*deep-research-state.jsonl'], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    throw new Error(`git ls-files failed: ${result.stderr.trim()}`);
  }
  return result.stdout.split('\0').filter((entry) => entry !== '');
}

/**
 * Read a lineage's config file.
 *
 * @param {string} lineageDir - Directory holding the lineage state
 * @returns {object|null} The parsed config, or null when absent or unparseable
 */
function readConfig(lineageDir) {
  const file = path.join(lineageDir, 'deep-research-config.json');
  let text;
  try {
    text = fs.readFileSync(file, 'utf8');
  } catch {
    return null;
  }
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/**
 * Whether a lineage config leaves the stop decision movable. The `stopPolicy`
 * and `convergenceMode` fields fall back to their counterparts under
 * `antiConvergence`; only an explicit blocker forces the stop.
 *
 * @param {object|null} config - Parsed lineage config
 * @returns {boolean} True when the stop decision is replayable
 */
function isMovable(config) {
  if (config === null || typeof config !== 'object') {
    return false;
  }
  const stopPolicy = config.stopPolicy ?? config.antiConvergence?.stopPolicy;
  if (stopPolicy === 'max-iterations') {
    return false;
  }
  const convergenceMode = config.convergenceMode ?? config.antiConvergence?.convergenceMode;
  if (convergenceMode === 'off') {
    return false;
  }
  const min = config.minIterations;
  const max = config.maxIterations;
  if (Number.isInteger(min) && Number.isInteger(max) && min >= max) {
    return false;
  }
  return true;
}

/**
 * List a lineage's delta files, ordered by the iteration they cover.
 *
 * @param {string} lineageDir - Directory holding the lineage state
 * @returns {Array<{ n: number, file: string }>} One entry per delta file, sorted by iteration
 */
function deltaIterationFiles(lineageDir) {
  const deltasDir = path.join(lineageDir, 'deltas');
  let names;
  try {
    names = fs.readdirSync(deltasDir);
  } catch {
    return [];
  }
  const pattern = /^(iter|iteration)-(\d+)\.jsonl$/;
  return names
    .map((name) => {
      const match = pattern.exec(name);
      return match === null ? null : { n: Number(match[2]), file: path.join(deltasDir, name) };
    })
    .filter((entry) => entry !== null)
    .sort((a, b) => a.n - b.n);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. GOLD
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Return a finding's unique file sources in first-seen order.
 *
 * @param {object} record - Finding record from a delta file
 * @returns {string[]} Normalized unique sources
 */
function findingSources(record) {
  const candidates = [
    record.source,
    ...(Array.isArray(record.sources) ? record.sources : []),
    ...(Array.isArray(record.evidence) ? record.evidence : []),
  ];
  const sources = [];
  const seen = new Set();
  for (const candidate of candidates) {
    if (typeof candidate !== 'string') {
      continue;
    }
    const trimmed = candidate.trim();
    if (trimmed === '' || /^[A-Za-z]+:(?![\\/])/.test(trimmed)) {
      continue;
    }
    const source = trimmed.replace(/:\d+(?:-\d+)?(?:,\d+(?:-\d+)?)*$/, '');
    if (source === '' || seen.has(source)) {
      continue;
    }
    seen.add(source);
    sources.push(source);
  }
  return sources;
}

/**
 * Derive a lineage's gold iteration from its delta files. Sources are
 * normalized file references from a finding's `source`, `sources`, or
 * `evidence`; gold is the last iteration that introduces at least one source
 * seen nowhere earlier, else null.
 *
 * @param {Array<{ n: number, file: string }>} files - Delta files in iteration order
 * @returns {{ gold: number|null, cited: Map<number, number>, firstAppearance: Map<number, number> }}
 *   Gold iteration, plus per-iteration citation and first-appearance counts
 * @throws {Error} When a delta file cannot be read
 */
function deriveGold(files) {
  const cited = new Map();
  const firstAppearance = new Map();
  const seen = new Set();
  let gold = null;
  for (const entry of files) {
    const text = fs.readFileSync(entry.file, 'utf8');
    let citedCount = 0;
    let firstCount = 0;
    for (const line of text.split('\n')) {
      const trimmed = line.trim();
      if (trimmed === '') {
        continue;
      }
      let record;
      try {
        record = JSON.parse(trimmed);
      } catch {
        continue;
      }
      if (record === null || typeof record !== 'object' || record.type !== 'finding') {
        continue;
      }
      const sources = findingSources(record);
      if (sources.length === 0) {
        continue;
      }
      for (const source of sources) {
        citedCount += 1;
        if (!seen.has(source)) {
          seen.add(source);
          firstCount += 1;
        }
      }
    }
    cited.set(entry.n, citedCount);
    firstAppearance.set(entry.n, firstCount);
    if (firstCount > 0) {
      gold = entry.n;
    }
  }
  return { gold, cited, firstAppearance };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. INERT WINDOW
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Whether a record series holds an inert novelty window: INERT_WINDOW
 * consecutive evidence ratios at or above 0.9. A novelty signal pinned flat at
 * a high value is uninformative, so such lineages sort first in the sample.
 *
 * @param {Array<object>} records - Parsed state-file records in file order
 * @returns {boolean} True when a flat-high novelty window appears
 */
function isInertWindow(records) {
  const ratios = [];
  for (const record of records) {
    if (record === null || typeof record !== 'object' || record.status === 'thought') {
      continue;
    }
    if (typeof record.newInfoRatio === 'number' && Number.isFinite(record.newInfoRatio)) {
      ratios.push(record.newInfoRatio);
    }
  }
  for (let index = 0; index + INERT_WINDOW <= ratios.length; index += 1) {
    if (ratios.slice(index, index + INERT_WINDOW).every((ratio) => ratio >= 0.9)) {
      return true;
    }
  }
  return false;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. STOP REPLAY
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Read one lineage's state records: its iteration records and the iterations
 * whose stop the graph blocked. Records stay in file order, a malformed line
 * is skipped, and an unreadable file throws so a run can refuse to guess.
 *
 * @param {string} stateFile - Path to a deep-research state JSONL file
 * @returns {{ iterations: Array<{ n: number, status: string|null, ratio: number|null, keyQuestions: string[], answeredQuestions: string[] }>, blocked: number[] }} Iterations plus the runs of STOP_BLOCKED events
 * @throws {Error} When the state file cannot be read
 */
function readStateRecords(stateFile) {
  const iterations = [];
  const blocked = [];
  for (const line of fs.readFileSync(stateFile, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (trimmed === '') {
      continue;
    }
    let record;
    try {
      record = JSON.parse(trimmed);
    } catch {
      continue;
    }
    if (record === null || typeof record !== 'object') {
      continue;
    }
    if (record.type === 'event' && record.event === 'graph_convergence') {
      if (record.decision === 'STOP_BLOCKED' && Number.isInteger(record.run)) {
        blocked.push(record.run);
      }
      continue;
    }
    if (record.type !== 'iteration') {
      continue;
    }
    const n = Number.isInteger(record.iteration) ? record.iteration : record.run;
    if (!Number.isInteger(n)) {
      continue;
    }
    iterations.push({
      n,
      status: typeof record.status === 'string' ? record.status : null,
      ratio: Number.isFinite(record.newInfoRatio) ? record.newInfoRatio : null,
      keyQuestions: Array.isArray(record.keyQuestions) ? record.keyQuestions.filter((question) => typeof question === 'string') : [],
      answeredQuestions: Array.isArray(record.answeredQuestions) ? record.answeredQuestions.filter((question) => typeof question === 'string') : [],
    });
  }
  return { iterations, blocked };
}

/**
 * Cumulative question coverage per evidence iteration: distinct answered
 * questions over distinct asked questions through that iteration. An
 * iteration that has asked nothing yet has no coverage signal, so its entry
 * is null and the vote redistributes the weight rather than assume a value.
 *
 * @param {Array<{ n: number, status: string|null, keyQuestions: string[], answeredQuestions: string[] }>} iterations - Parsed iteration records
 * @returns {Map<number, number|null>} Iteration number to coverage, null when none asked
 */
function coverageSeries(iterations) {
  const asked = new Set();
  const answered = new Set();
  const coverage = new Map();
  for (const iteration of iterations) {
    if (iteration === null || typeof iteration !== 'object' || iteration.status === 'thought') {
      continue;
    }
    for (const question of iteration.keyQuestions ?? []) {
      asked.add(question);
    }
    for (const question of iteration.answeredQuestions ?? []) {
      answered.add(question);
    }
    coverage.set(iteration.n, asked.size === 0 ? null : answered.size / asked.size);
  }
  return coverage;
}

/**
 * Replay the composite convergence vote at every iteration of a series and
 * return the first iteration it would stop on. The three signals are the
 * rolling mean of the last three ratios, the MAD noise floor of the ratios
 * seen so far, and question coverage; the weights of the signals that lack
 * enough data are spread over the ones that have it. A blocked iteration is
 * never a stop, and none is returned before minIterations.
 *
 * @param {Array<{ n: number, ratio: number|null }>} series - Evidence iterations in order
 * @param {object} [opts] - Vote inputs
 * @param {number} [opts.threshold] - Rolling-mean threshold, the config default when absent
 * @param {number} [opts.minIterations] - Earliest iteration that may stop
 * @param {number[]} [opts.blocked] - Iterations a graph event blocked
 * @param {Map<number, number|null>} [opts.coverage] - Coverage by iteration number
 * @returns {number|null} First stop iteration, or null when the vote never stops
 */
function replayVote(series, opts = {}) {
  const threshold = Number.isFinite(opts.threshold) ? opts.threshold : DEFAULT_CONVERGENCE_THRESHOLD;
  const minIterations = Number.isInteger(opts.minIterations) ? opts.minIterations : DEFAULT_MIN_ITERATIONS;
  const blocked = new Set(Array.isArray(opts.blocked) ? opts.blocked : []);
  const coverage = opts.coverage instanceof Map ? opts.coverage : new Map();
  for (let index = 0; index < series.length; index += 1) {
    const candidate = series[index];
    if (candidate === null || typeof candidate !== 'object') {
      continue;
    }
    if (!Number.isInteger(candidate.n) || candidate.n < minIterations || blocked.has(candidate.n)) {
      continue;
    }
    const ratios = series
      .slice(0, index + 1)
      .map((entry) => entry?.ratio)
      .filter((ratio) => Number.isFinite(ratio));
    const signals = [];
    if (ratios.length >= 3) {
      const window = ratios.slice(-3);
      const mean = window.reduce((sum, ratio) => sum + ratio, 0) / window.length;
      // A mean below the threshold is the cheapest sign of drift into repetition.
      signals.push({ weight: 0.3, stop: mean < threshold });
    }
    if (ratios.length >= 4) {
      const sorted = [...ratios].sort((a, b) => a - b);
      const middle = Math.floor(sorted.length / 2);
      const median = sorted.length % 2 === 0 ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle];
      const deviations = ratios.map((ratio) => Math.abs(ratio - median)).sort((a, b) => a - b);
      const devMiddle = Math.floor(deviations.length / 2);
      const mad = deviations.length % 2 === 0 ? (deviations[devMiddle - 1] + deviations[devMiddle]) / 2 : deviations[devMiddle];
      // At or under the noise floor, the latest ratio is sampling noise, not signal.
      signals.push({ weight: 0.35, stop: ratios[ratios.length - 1] <= mad * 1.4826 });
    }
    const coverageAt = coverage.get(candidate.n);
    if (typeof coverageAt === 'number' && Number.isFinite(coverageAt)) {
      // Nearly every question answered leaves the loop with little left to ask.
      signals.push({ weight: 0.35, stop: coverageAt >= 0.85 });
    }
    if (signals.length === 0) {
      continue;
    }
    const weight = signals.reduce((sum, signal) => sum + signal.weight, 0);
    const score = signals.reduce((sum, signal) => sum + (signal.stop ? signal.weight : 0), 0) / weight;
    if (score > 0.6) {
      return candidate.n;
    }
  }
  return null;
}

/**
 * The stop a replay rule lands on: the vote's first stop, or the last
 * iteration of the series when the vote never stops.
 *
 * @param {Array<{ n: number, ratio: number|null }>} series - Evidence iterations in order
 * @param {object} [opts] - Vote inputs, as in replayVote
 * @returns {number|null} Stop iteration, or null for an empty series
 */
function stopFor(series, opts = {}) {
  const stop = replayVote(series, opts);
  if (stop !== null) {
    return stop;
  }
  if (series.length === 0) {
    return null;
  }
  return series[series.length - 1].n;
}

/**
 * Whether a stop reads the evidence correctly: at gold, or one iteration
 * after it. One late iteration still precedes any evidence that could have
 * changed the call, so it counts.
 *
 * @param {number|null} stop - Iteration the method stopped at
 * @param {number} gold - Last iteration that introduced a source
 * @returns {boolean} True when gold <= stop <= gold + 1
 */
function rightOf(stop, gold) {
  return gold <= stop && stop <= gold + 1;
}

/**
 * Pick the method that read the most lineages right. Equal counts keep the
 * earlier method, so a tie never moves the baseline off the live stop rule.
 *
 * @param {{ recorded: number, legacy: number, sources: number }} counts - Right count per method
 * @returns {{ method: 'legacy'|'sources'|'recorded', right: number }} Winning method and its count
 */
function pickBaseline(counts) {
  const order = ['legacy', 'sources', 'recorded'];
  let method = order[0];
  for (const name of order) {
    if (counts[name] > counts[method]) {
      method = name;
    }
  }
  return { method, right: counts[method] };
}

/**
 * The headroom line. A baseline as right as ten of nine sampled is already
 * at the ceiling, so no arm is planned; otherwise the line states what each
 * arm would call.
 *
 * @param {{ sampled: number, right: number, iterations: number }} census - Sample size, baseline right count and their total iterations
 * @returns {string} The gate line, `no headroom` or the planned call counts
 */
function gateLine(census) {
  if (10 * census.right > 9 * census.sampled) {
    return 'no headroom';
  }
  return `planned calls: deem ${census.iterations} jev ${3 * census.iterations + 1}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. LABEL GATE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parse the operator's gold-reads file: one JSON object per line naming a
 * lineage, the operator's gold iteration and the labeler. A malformed or
 * repeated row throws so a run can refuse before it prints anything.
 *
 * @param {string} text - Gold-reads file contents, one JSON object per line
 * @returns {Map<string, number>} Lineage path to operator gold iteration
 * @throws {Error} When a row is not JSON, names no lineage, carries a gold
 *   iteration that is not a positive integer, carries no labeler, or repeats
 *   a lineage
 */
function parseGoldReads(text) {
  const reads = new Map();
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i += 1) {
    const row = i + 1;
    if (lines[i].trim() === '') {
      continue;
    }
    let parsed;
    try {
      parsed = JSON.parse(lines[i]);
    } catch {
      throw new Error(`gold reads row ${row}: not JSON`);
    }
    const isPlainObject = parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed);
    const lineage = isPlainObject ? parsed.lineage : undefined;
    if (typeof lineage !== 'string' || lineage.length === 0) {
      throw new Error(`gold reads row ${row}: lineage must be a non-empty string`);
    }
    const goldIteration = isPlainObject ? parsed.gold_iteration : undefined;
    if (!Number.isInteger(goldIteration) || goldIteration <= 0) {
      throw new Error(`gold reads row ${row}: gold_iteration must be a positive integer`);
    }
    const labeler = isPlainObject ? parsed.labeler : undefined;
    if (typeof labeler !== 'string' || labeler.length === 0) {
      throw new Error(`gold reads row ${row}: labeler must be a non-empty string`);
    }
    if (reads.has(lineage)) {
      throw new Error(`gold reads row ${row}: duplicate lineage ${lineage}`);
    }
    reads.set(lineage, goldIteration);
  }
  return reads;
}

/**
 * The gate that keeps every model arm closed until the operator's read
 * confirms the derived gold. It checks the first sampled lineages the census
 * names: a missing read or a read that differs from the derived gold stops
 * the run before any backend is touched.
 *
 * @param {object} input - Gate inputs
 * @param {Array<{ path: string, gold: number|null }>} input.sampled - Sampled census entries in census order
 * @param {Map<string, number>} input.reads - Operator reads, lineage path to gold iteration
 * @returns {{ passed: boolean, line: string|null }} Whether the gate opened, and its stop line when it did not
 */
function labelGate({ sampled, reads }) {
  const five = sampled.slice(0, LABEL_GATE);
  let confirmed = 0;
  let disagreements = 0;
  for (const entry of five) {
    const read = reads.get(entry.path);
    if (read === undefined) {
      continue;
    }
    confirmed += 1;
    if (read !== entry.gold) {
      disagreements += 1;
    }
  }
  if (confirmed < LABEL_GATE) {
    return { passed: false, line: `stop: fewer than ${LABEL_GATE} confirmed lineages` };
  }
  if (disagreements > 0) {
    return { passed: false, line: `stop: derived gold disagrees on ${disagreements} of ${LABEL_GATE} lineages` };
  }
  return { passed: true, line: null };
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. JEV GATE AND PUBLISHED CHECK
// ─────────────────────────────────────────────────────────────────────────────

/**
 * First executable file of this name on PATH, or null when none is executable.
 * Empty PATH entries are skipped; a missing path, a directory, or a file that
 * cannot be executed is not a match.
 *
 * @param {string} name - Executable file name
 * @param {Record<string, string|undefined>} env - Environment whose PATH is searched
 * @returns {string|null} First executable match, or null when none is executable
 */
function which(name, env) {
  for (const dir of (env.PATH ?? '').split(path.delimiter)) {
    if (dir.length === 0) {
      continue;
    }
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
 * The gate that keeps the Jev arm closed until the pinned client answers with
 * the expected version and a credential for the requested provider. A miss
 * prints its skip line and leaves the census text already written untouched.
 *
 * @param {object} ctx - Line writer, environment and per-call timeout
 * @param {(line: string) => void} ctx.out - Line writer
 * @param {Record<string, string|undefined>} ctx.env - Environment the client is found and run in
 * @param {number} ctx.timeoutMs - Per-call timeout for the version and credential checks
 * @returns {{ passed: boolean, path: string|null, provider: string, reason?: string }} Whether the gate opened, its resolved path and provider, and the skip line when it did not
 */
function jevGate(ctx) {
  const provider = ctx.env.JEV_PROVIDER || 'official';
  const jevPath = which('jev', ctx.env);
  ctx.out(`jev: path=${jevPath ?? 'none'} provider=${provider}`);
  if (jevPath === null) {
    const skipLine = 'jev arm skipped: jev not on PATH';
    ctx.out(skipLine);
    return { passed: false, path: jevPath, provider, reason: skipLine };
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
    return { passed: false, path: jevPath, provider, reason: skipLine };
  }

  const auth = spawnSync(jevPath, ['auth', 'status', '--provider', provider], opts);
  if (auth.status !== 0) {
    const skipLine = 'jev arm skipped: no credential';
    ctx.out(skipLine);
    return { passed: false, path: jevPath, provider, reason: skipLine };
  }
  return { passed: true, path: jevPath, provider };
}

/**
 * Whether a path is published at origin/main. Only text already committed
 * there may leave the machine, so the answer comes from git rather than from
 * the working tree.
 *
 * @param {string} repoRoot - Repository root the git check runs under
 * @param {string} relPath - Repo-relative path to test
 * @returns {boolean} True when git finds the path at origin/main
 */
function existsAtOriginMain(repoRoot, relPath) {
  const result = spawnSync('git', ['cat-file', '-e', `origin/main:${relPath}`], {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  return !result.error && result.status === 0;
}

/**
 * The call records for the iterations Jev must not read. A lineage is
 * published only when every one of its delta files is at origin/main; a single
 * miss withholds the whole lineage, because its state would carry text the
 * repository has not published. A withheld iteration has no call to report, so
 * its record carries no level, probability or wall time.
 *
 * @param {Array<{ path: string, iterations: number[] }>} lineages - Sampled lineages and the iterations the arm would score
 * @param {string} repoRoot - Repository root the published check runs under
 * @param {string} provider - Jev provider recorded on every withheld line
 * @returns {Array<object>} One `unmeasured_unpublished` record per withheld iteration
 */
function withheldRecords(lineages, repoRoot, provider) {
  const records = [];
  for (const lineage of lineages) {
    const files = deltaIterationFiles(path.join(repoRoot, lineage.path));
    const published = files.every((entry) => existsAtOriginMain(repoRoot, path.relative(repoRoot, entry.file)));
    if (published) {
      continue;
    }
    for (const iteration of lineage.iterations) {
      records.push({
        lineage: lineage.path,
        iteration,
        rerun: null,
        attempt: 0,
        wallMs: 0,
        exitCode: null,
        backend: 'jev',
        level: null,
        probability: null,
        status: 'unmeasured_unpublished',
        jevVersion: JEV_VERSION,
        provider,
        model: null,
      });
    }
  }
  return records;
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. STATE AND CALL HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The state text one iteration is rated on: the iteration's own findings as
 * `<label> — <source>` lines, then the label of every earlier finding in the
 * lineage. A source stays attached to the iteration that introduced it, so the
 * text never carries a finding the rater has not seen yet.
 *
 * @param {Array<{ n: number, file: string }>} iterationFiles - Delta files in iteration order
 * @param {number} iteration - Iteration the state is built for
 * @returns {string} State text, one finding per line
 * @throws {Error} When a delta file cannot be read
 */
function buildState(iterationFiles, iteration) {
  const current = [];
  const earlier = [];
  for (const entry of iterationFiles) {
    if (entry.n > iteration) {
      break;
    }
    const text = fs.readFileSync(entry.file, 'utf8');
    for (const line of text.split('\n')) {
      const trimmed = line.trim();
      if (trimmed === '') {
        continue;
      }
      let record;
      try {
        record = JSON.parse(trimmed);
      } catch {
        continue;
      }
      if (record === null || typeof record !== 'object' || record.type !== 'finding') {
        continue;
      }
      const label = typeof record.label === 'string' ? record.label : '';
      const source = typeof record.source === 'string' ? record.source : '';
      if (entry.n === iteration) {
        if (label === '' && source === '') {
          continue;
        }
        current.push(label === '' ? source : source === '' ? label : `${label} — ${source}`);
      } else if (label !== '') {
        earlier.push(label);
      }
    }
  }
  return [...current, ...earlier].join('\n');
}

/**
 * One bounded child process. Resolves exactly once with the exit code, the
 * collected output, the wall time and whether the timeout fired. The timer
 * kills the child and resolves at once, without waiting for close: a
 * grandchild can hold the pipes open past the kill. Stdin is closed after the
 * write because the CLI reads it to EOF and exits 2 on an inherited terminal.
 * A spawn error is code 127 with the message as stderr.
 *
 * @param {string} file - Executable to spawn
 * @param {string[]} args - Arguments after the executable
 * @param {string} stdinText - Text written to stdin, then closed
 * @param {Record<string, string|undefined>} env - Child environment
 * @param {number} timeoutMs - Kill and resolve after this many milliseconds
 * @returns {Promise<{ code: number|null, stdout: string, stderr: string, wallMs: number, timedOut: boolean }>} Call outcome
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
    // A child that exits before reading stdin cannot fail the call through the
    // pipe: its exit code is the outcome the caller needs.
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
 * keeps no records, so nothing is created. The file is created on the first
 * append, and one line per call keeps a killed arm's earlier records readable.
 *
 * @param {string|undefined} outDir - Directory that holds calls.jsonl
 * @returns {{ append: (record: object) => void }} Append-only call log
 */
function createCallLog(outDir) {
  let created = false;
  return {
    append(record) {
      if (typeof outDir !== 'string' || outDir === '') return;
      const file = path.join(outDir, 'calls.jsonl');
      if (!created) {
        fs.mkdirSync(outDir, { recursive: true });
        fs.writeFileSync(file, '');
        created = true;
      }
      fs.appendFileSync(file, `${JSON.stringify(record)}\n`);
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. JEV ARM
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The Jev arm: published checks first, the payload notice, one auth test, then
 * three score calls per iteration, because the hosted model is sampled once
 * per call. The median of the three levels becomes the iteration's ratio, and
 * every answer that differs from it is a flip. An exit-0 call without a usable
 * level stays unmeasured, exit 4 waits once and retries, and a stop line ends
 * the arm with the number of lineages it finished. A state over the character
 * bound is withheld without a call.
 *
 * @param {{
 *   lineages: Array<{ path: string, gold: number, baselineStop: number|null, vote: object, iterations: Array<{ n: number, state: string }> }>
 * }} plan Sampled lineages, their vote inputs and per-iteration state text
 * @param {{ path: string, provider: string }} gate Passing Jev gate result
 * @param {{
 *   out: (line: string) => void,
 *   env: Record<string, string|undefined>,
 *   timeoutMs: number,
 *   backoffMs: number,
 *   callLog: { append: (record: object) => void },
 *   repoRoot: string,
 *   baseline: string,
 *   stored: object|null
 * }} ctx Line writer, environment, per-call bounds, call log, repository root, the baseline method and the earlier run's report
 * @returns {Promise<{ column: object, requalify: string|null, stops: Map<string, number|null> } | { stopped: string, partialLineages: number }>} Finished column with its per-lineage stops, or the stop line with the lineages finished
 */
async function runJevArm(plan, gate, ctx) {
  const jevVersion = JEV_VERSION.split(' ')[1];
  // Published text only: a lineage with any delta file missing at origin/main is
  // withheld whole before the arm prints its payload notice.
  const withheld = withheldRecords(
    plan.lineages.map((lineage) => ({
      path: lineage.path,
      iterations: lineage.iterations.map((iteration) => iteration.n),
    })),
    ctx.repoRoot,
    gate.provider,
  );
  for (const record of withheld) {
    ctx.callLog.append(record);
  }
  const withheldPaths = new Set(withheld.map((record) => record.lineage));

  let chars = 0;
  let planned = 0;
  for (const lineage of plan.lineages) {
    if (withheldPaths.has(lineage.path)) {
      continue;
    }
    for (const iteration of lineage.iterations) {
      if (iteration.state.length > STATE_MAX_CHARS) {
        continue;
      }
      chars += iteration.state.length + QUESTION.length;
      planned += 1;
    }
  }
  chars *= JEV_RERUNS;
  ctx.out(`jev: payload: published research delta text; planned calls: ${JEV_RERUNS * planned + 1}; estimated input tokens: ${Math.ceil(chars / 4)}`);

  let model = 'unknown';
  let finished = 0;

  /**
   * One calls.jsonl record. A spawn that led to a stop or a retry carries no
   * judgment, so its level and status stay empty.
   */
  function record(lineagePath, iteration, rerun, attempt, call, level, probability, status) {
    return {
      lineage: lineagePath,
      iteration,
      rerun,
      attempt,
      wallMs: call.wallMs,
      exitCode: call.code,
      backend: 'jev',
      level,
      probability,
      status,
      jevVersion,
      provider: gate.provider,
      model,
    };
  }

  function stop(line) {
    ctx.out(line);
    ctx.out(`jev: partial lineages=${finished}`);
    return { stopped: line, partialLineages: finished };
  }

  const auth = await spawnCall(gate.path, ['auth', 'test', '--provider', gate.provider], '', ctx.env, ctx.timeoutMs);
  if (auth.code === 0) {
    let parsed;
    try {
      parsed = JSON.parse(auth.stdout);
    } catch {
      // A body that does not parse leaves the model unknown.
    }
    if (typeof parsed?.model === 'string') {
      model = parsed.model;
    }
  }
  ctx.callLog.append(record(null, null, null, 1, auth, null, null, auth.code === 0 ? 'measured' : 'unmeasured'));
  if (auth.code !== 0) {
    if (auth.code === 2) {
      return stop('jev arm stopped: usage error');
    }
    if (auth.code === 3) {
      return stop('jev arm stopped: key rejected');
    }
    if (auth.code === 130) {
      return stop('jev arm stopped: interrupted');
    }
    return stop('jev arm stopped: auth test failed');
  }
  ctx.out(`jev: auth test provider=${gate.provider} model=${model}`);

  const answers = new Map();
  const flips = new Map();
  const stops = new Map();

  for (const lineage of plan.lineages) {
    if (withheldPaths.has(lineage.path)) {
      answers.set(lineage.path, []);
      flips.set(lineage.path, 0);
      stops.set(lineage.path, null);
      continue;
    }

    const series = [];
    let flipsHere = 0;
    let complete = true;

    for (const iteration of lineage.iterations) {
      if (iteration.state.length > STATE_MAX_CHARS) {
        ctx.callLog.append(record(lineage.path, iteration.n, null, 1, { wallMs: 0, code: null }, null, null, 'unmeasured_oversize'));
        complete = false;
        series.push({ n: iteration.n, ratio: null });
        continue;
      }

      const levels = [];
      let stopLine = null;
      for (let rerun = 1; rerun <= JEV_RERUNS; rerun += 1) {
        const callArgs = ['score', '--provider', gate.provider, '-q', QUESTION];
        for (const label of LEVEL_LABELS) {
          callArgs.push('-l', label);
        }
        let attempt = 1;
        let call = await spawnCall(gate.path, callArgs, iteration.state, ctx.env, ctx.timeoutMs);
        if (!call.timedOut && call.code === 4) {
          ctx.callLog.append(record(lineage.path, iteration.n, rerun, attempt, call, null, null, 'unmeasured'));
          await new Promise((resolve) => setTimeout(resolve, ctx.backoffMs));
          attempt = 2;
          call = await spawnCall(gate.path, callArgs, iteration.state, ctx.env, ctx.timeoutMs);
        }

        let level = null;
        let probability = null;
        let status = 'unmeasured';
        if (call.timedOut) {
          status = 'unmeasured_timeout';
        } else if (call.code === 0) {
          let parsed;
          try {
            parsed = JSON.parse(call.stdout);
          } catch {
            // A body that does not parse is a failed measurement, not a crash.
          }
          const value = parsed?.score;
          if (Number.isInteger(value) && value >= 0 && value < LEVEL_RATIOS.length) {
            level = value;
            status = 'measured';
            const probabilities = parsed?.probabilities;
            if (probabilities !== null && typeof probabilities === 'object') {
              probability = probabilities[String(value)] ?? probabilities[LEVEL_LABELS[value]] ?? null;
            }
          }
        } else if (call.code === 2) {
          stopLine = 'jev arm stopped: usage error';
        } else if (call.code === 3) {
          stopLine = 'jev arm stopped: key rejected';
        } else if (call.code === 130) {
          stopLine = 'jev arm stopped: interrupted';
        }

        ctx.callLog.append(record(lineage.path, iteration.n, rerun, attempt, call, level, probability, status));
        if (stopLine !== null) {
          return stop(stopLine);
        }
        if (level !== null) {
          levels.push(level);
        }
      }

      if (levels.length === JEV_RERUNS) {
        const sorted = [...levels].sort((left, right) => left - right);
        const median = sorted[Math.floor(sorted.length / 2)];
        flipsHere += levels.filter((level) => level !== median).length;
        series.push({ n: iteration.n, ratio: LEVEL_RATIOS[median] });
      } else {
        complete = false;
        series.push({ n: iteration.n, ratio: null });
      }
    }

    finished += 1;
    answers.set(lineage.path, series);
    flips.set(lineage.path, flipsHere);
    stops.set(lineage.path, complete ? stopFor(series, lineage.vote) : null);
  }

  // The column is summarized from the raw measurements: one ratio per iteration,
  // the per-lineage flip count, and the stop the replayed vote lands on.
  const summary = summarizeColumn('jev', plan.lineages, answers, flips, stops, ctx.baseline);
  // A verdict holds for the provider and model it was measured on, so a
  // changed identity is named before the new line prints.
  const storedJev = ctx.stored?.columns?.jev;
  let requalify = null;
  if (storedJev && (storedJev.provider !== gate.provider || storedJev.model !== model)) {
    requalify = 'requalify: model changed';
    ctx.out(requalify);
  }
  const line = verdictLine(summary, `jev_version=${jevVersion} provider=${gate.provider} model=${model}`);
  ctx.out(line);
  return {
    column: { ...summary, line, jevVersion, provider: gate.provider, model },
    requalify,
    stops,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 11. DEEM GATE AND ARM
// ─────────────────────────────────────────────────────────────────────────────

// Repo copy of the cli-deem entry point, run under node when none is on PATH.
const REPO_CLI_DEEM = path.resolve(__dirname, '../../../cli-classifier/cli-deem/scripts/cli-deem.mjs');

/**
 * cli-deem on PATH when that file is executable, otherwise the repo copy run
 * under node.
 *
 * @param {Record<string, string|undefined>} env - Environment whose PATH is searched
 * @returns {string[]} Command and leading arguments for one call
 */
function deemCommand(env) {
  const onPath = which('cli-deem', env);
  if (onPath !== null) {
    return [onPath];
  }
  return [process.execPath, REPO_CLI_DEEM];
}

/**
 * One health check. An unreachable binary, a stub backend, a wrong model or a
 * malformed body is a failed check the caller prints as a skip.
 *
 * @param {string[]} cmd - Command from deemCommand
 * @param {Record<string, string|undefined>} env - Environment for the call
 * @returns {{ ok: true, backend: string, model: string, modelCommit: string, sourceCommit: string } | { ok: false, reason: string, found: unknown }} The health identity, or the reason the check failed and what it found
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
    if (typeof errorText === 'string' && errorText.includes('stub')) {
      reason = 'stub backend';
    } else if (typeof errorText === 'string' && errorText.includes('refused model')) {
      reason = 'model';
    }
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
 * The gate that keeps the Deem arm closed until the local server identifies
 * itself with the pinned model and both build commits. A miss prints its skip
 * line and leaves the census text already written untouched.
 *
 * @param {{ out: (line: string) => void, env: Record<string, string|undefined> }} ctx - Line writer and environment
 * @returns {{ passed: boolean, cmd: string[], reason?: string }} Whether the gate opened, the command it resolved and the skip line when it did not
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

/**
 * The Deem arm: the notice, then one score call per evidence iteration, one
 * answer per call. A measured call is exit 0 with a level position and its
 * probability; an exit-4 call rechecks the server pair and retries once, and
 * a stop line ends the arm with the number of lineages it finished. Nothing
 * leaves the machine, so no payload check applies, and a state over the
 * character bound is withheld without a call.
 *
 * @param {{
 *   lineages: Array<{ path: string, gold: number, baselineStop: number|null, vote: object, iterations: Array<{ n: number, state: string }> }>
 * }} plan Sampled lineages, their vote inputs and per-iteration state text
 * @param {{ cmd: string[], model: string, modelCommit: string, sourceCommit: string }} gate Passing Deem gate result
 * @param {{
 *   out: (line: string) => void,
 *   env: Record<string, string|undefined>,
 *   timeoutMs: number,
 *   callLog: { append: (record: object) => void },
 *   baseline: string,
 *   stored: object|null
 * }} ctx Line writer, environment, per-call bound, call log, the baseline method and the earlier run's report
 * @returns {Promise<{ column: object, requalify: string|null, stops: Map<string, number|null> } | { stopped: string, partialLineages: number }>} Finished column with its per-lineage stops, or the stop line with the lineages finished
 */
async function runDeemArm(plan, gate, ctx) {
  let planned = 0;
  for (const lineage of plan.lineages) {
    for (const iteration of lineage.iterations) {
      if (iteration.state.length > STATE_MAX_CHARS) {
        continue;
      }
      planned += 1;
    }
  }
  ctx.out(`deem: nothing leaves the machine; planned calls: ${planned}; estimated wall time: ${(planned * DEEM_P50_MS / 1000).toFixed(1)} s at ${DEEM_P50_MS} ms per call, the 2-option p50 from deem-local.md`);

  const answers = new Map();
  const flips = new Map();
  const stops = new Map();
  let finished = 0;

  /**
   * One calls.jsonl record. A withheld or retried spawn carries no judgment,
   * so its level and probability stay empty.
   */
  function record(lineagePath, iteration, rerun, attempt, call, level, probability, status) {
    return {
      lineage: lineagePath,
      iteration,
      rerun,
      attempt,
      wallMs: call.wallMs,
      exitCode: call.code,
      backend: 'deem',
      level,
      probability,
      status,
      modelId: gate.model,
      modelCommit: gate.modelCommit,
      sourceCommit: gate.sourceCommit,
    };
  }

  function stop(line) {
    ctx.out(line);
    ctx.out(`deem: partial lineages=${finished}`);
    return { stopped: line, partialLineages: finished };
  }

  for (const lineage of plan.lineages) {
    const series = [];
    let complete = true;

    for (const iteration of lineage.iterations) {
      if (iteration.state.length > STATE_MAX_CHARS) {
        ctx.callLog.append(record(lineage.path, iteration.n, null, 1, { wallMs: 0, code: null }, null, null, 'unmeasured_oversize'));
        complete = false;
        series.push({ n: iteration.n, ratio: null });
        continue;
      }

      const callArgs = [...gate.cmd.slice(1), 'score', '-q', QUESTION];
      for (const label of LEVEL_LABELS) {
        callArgs.push('-l', label);
      }
      let attempt = 1;
      let call = await spawnCall(gate.cmd[0], callArgs, iteration.state, ctx.env, ctx.timeoutMs);
      if (!call.timedOut && call.code === 4) {
        ctx.callLog.append(record(lineage.path, iteration.n, 1, attempt, call, null, null, 'unmeasured'));
        const health = readDeemHealth(gate.cmd, ctx.env);
        if (!health.ok) {
          return stop('deem arm stopped: server gone');
        }
        if (health.modelCommit !== gate.modelCommit || health.sourceCommit !== gate.sourceCommit) {
          return stop('deem arm stopped: model commit changed mid-run');
        }
        attempt = 2;
        call = await spawnCall(gate.cmd[0], callArgs, iteration.state, ctx.env, ctx.timeoutMs);
      }

      let level = null;
      let probability = null;
      let status = 'unmeasured';
      let stopLine = null;
      if (call.timedOut) {
        status = 'unmeasured_timeout';
      } else if (call.code === 0) {
        let parsed;
        try {
          parsed = JSON.parse(call.stdout);
        } catch {
          // A body that does not parse is a failed measurement, not a crash.
        }
        const value = parsed?.score;
        if (typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= LEVEL_RATIOS.length - 1) {
          const position = Math.round(value);
          level = position;
          status = 'measured';
          const probabilities = parsed?.probabilities;
          if (probabilities !== null && typeof probabilities === 'object') {
            probability = probabilities[String(position)] ?? probabilities[LEVEL_LABELS[position]] ?? null;
          }
        }
      } else if (call.code === 2) {
        stopLine = 'deem arm stopped: usage error';
      } else if (call.code === 3) {
        stopLine = 'deem arm stopped: backend refused';
      } else if (call.code === 130) {
        stopLine = 'deem arm stopped: interrupted';
      }

      ctx.callLog.append(record(lineage.path, iteration.n, 1, attempt, call, level, probability, status));
      if (stopLine !== null) {
        return stop(stopLine);
      }
      if (level !== null) {
        series.push({ n: iteration.n, ratio: LEVEL_RATIOS[level] });
      } else {
        complete = false;
        series.push({ n: iteration.n, ratio: null });
      }
    }

    finished += 1;
    answers.set(lineage.path, series);
    flips.set(lineage.path, 0);
    stops.set(lineage.path, complete ? stopFor(series, lineage.vote) : null);
  }

  // The column is summarized from the raw measurements: one ratio per iteration
  // and the stop the replayed vote lands on. A single call cannot flip, so the
  // flip count stays empty for this backend.
  const summary = summarizeColumn('deem', plan.lineages, answers, flips, stops, ctx.baseline);
  // A verdict holds for the commit pair it was measured on, so a changed pair
  // is named before the new line prints.
  const storedDeem = ctx.stored?.columns?.deem;
  let requalify = null;
  if (storedDeem && (storedDeem.modelCommit !== gate.modelCommit || storedDeem.sourceCommit !== gate.sourceCommit)) {
    requalify = 'requalify: model commit changed';
    ctx.out(requalify);
  }
  const line = verdictLine(summary, `model=${gate.model} model_commit=${gate.modelCommit} source_commit=${gate.sourceCommit}`);
  ctx.out(line);
  return {
    column: { ...summary, line, modelId: gate.model, modelCommit: gate.modelCommit, sourceCommit: gate.sourceCommit },
    requalify,
    stops,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 12. VERDICT AND REQUALIFY
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
 * test, flips. A clean loss tail kills before the margin is read, and the
 * flips check binds only the rerun-sampled backend, since a single call
 * cannot flip.
 *
 * @param {{ backend: string, K: number, M: number, A: number, B: number, W: number, L: number, F: number, C: number }} counts - Column counts
 * @returns {{ outcome: 'keep'|'kill'|'stop', reason: 'coverage'|'margin'|'sign test'|'flips'|null, pWin: number, pLoss: number }} Verdict with both exact tails
 */
function decideVerdict({ backend, K, M, A, B, W, L, F, C }) {
  const win = binomialTail(W, W + L);
  const loss = binomialTail(L, W + L);
  if (!(10 * M >= 9 * K)) return { outcome: 'stop', reason: 'coverage', pWin: win.p, pLoss: loss.p };
  if (20n * loss.num < loss.den) return { outcome: 'kill', reason: null, pWin: win.p, pLoss: loss.p };
  if (!(10 * (A - B) >= M)) return { outcome: 'stop', reason: 'margin', pWin: win.p, pLoss: loss.p };
  if (!(20n * win.num < win.den)) return { outcome: 'stop', reason: 'sign test', pWin: win.p, pLoss: loss.p };
  if (backend === 'jev' && !(10 * F <= C)) return { outcome: 'stop', reason: 'flips', pWin: win.p, pLoss: loss.p };
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
 * One column's counts and verdict from the arm's measurements. A lineage is
 * measured only when the replay produced a stop, which the arm sets only when
 * every iteration returned a level. Right is the same gold window the
 * zero-call methods are scored on. The flips bound reads the calls behind the
 * measured levels, so a flip rate is never taken over calls with no median.
 *
 * @param {'jev'|'deem'} backend - Backend name, printed on the verdict line
 * @param {Array<{ path: string, gold: number|null, baselineStop: number|null }>} lineages - Sampled lineages in census order
 * @param {Map<string, Array<{ n: number, ratio: number|null }>>} answers - Lineage path -> its level series
 * @param {Map<string, number>} flips - Lineage path -> answers that dissent from their iteration's median
 * @param {Map<string, number|null>} stops - Lineage path -> the replay's stop, null when unmeasured
 * @param {string|null} baselineMethod - Baseline method name recorded on the line
 * @returns {{ backend: string, K: number, M: number, unmeasured: number, A: number, B: number, W: number, L: number, F: number|null, C: number, pWin: number, pLoss: number, outcome: string, reason: string|null, baseline: string|null }} Column summary
 */
function summarizeColumn(backend, lineages, answers, flips, stops, baselineMethod) {
  const callsPerIteration = backend === 'jev' ? JEV_RERUNS : 1;
  const K = lineages.length;
  let M = 0;
  let A = 0;
  let B = 0;
  let W = 0;
  let L = 0;
  let F = 0;
  let C = 0;
  for (const lineage of lineages) {
    F += flips.get(lineage.path) ?? 0;
    for (const entry of answers.get(lineage.path) ?? []) {
      if (entry.ratio !== null) C += callsPerIteration;
    }
    const stop = stops.get(lineage.path);
    if (typeof stop !== 'number') continue;
    M += 1;
    const columnRight = rightOf(stop, lineage.gold);
    const baselineRight = rightOf(lineage.baselineStop, lineage.gold);
    if (columnRight) A += 1;
    if (baselineRight) B += 1;
    if (columnRight && !baselineRight) W += 1;
    if (baselineRight && !columnRight) L += 1;
  }
  const verdict = decideVerdict({ backend, K, M, A, B, W, L, F, C });
  return {
    backend,
    K,
    M,
    unmeasured: K - M,
    A,
    B,
    W,
    L,
    F: backend === 'jev' ? F : null,
    C,
    pWin: verdict.pWin,
    pLoss: verdict.pLoss,
    outcome: verdict.outcome,
    reason: verdict.reason,
    baseline: baselineMethod,
  };
}

/**
 * The verdict line: one outcome, the counts it was read from, the exact tail
 * the decision turned on, and the baseline it was scored against. A kill
 * prints its loss tail; every other outcome prints its win tail.
 *
 * @param {object} summary - Column summary from summarizeColumn
 * @param {string} [suffix] - Backend identity appended to the line when non-empty
 * @returns {string} Verdict line for stdout and the report column
 */
function verdictLine(summary, suffix) {
  const outcomeText = summary.reason === null ? summary.outcome : `stop (${summary.reason})`;
  const p = summary.outcome === 'kill' ? summary.pLoss : summary.pWin;
  const flips = summary.backend === 'jev' ? summary.F : 'n/a';
  let line = `verdict ${summary.backend}: ${outcomeText} K=${summary.K} M=${summary.M} A=${summary.A} B=${summary.B} W=${summary.W} L=${summary.L} F=${flips} p=${formatP(p)} baseline=${summary.baseline}`;
  if (typeof suffix === 'string' && suffix.length > 0) line += ` ${suffix}`;
  return line;
}

/**
 * Parsed report.json written by an earlier run into the same out directory.
 * A later run reads it to requalify a verdict the earlier run measured on a
 * different model pair, before printing its own.
 *
 * @param {string|undefined|null} outDir - Directory that may hold report.json
 * @returns {object|null} The parsed report, or null when outDir is empty, the file is missing, or the file does not parse
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
// 13. REPORT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The report one run writes to report.json. The census keeps its counts, the
 * sampled lineages their derived gold, recorded stop and replay stops, the
 * baseline its summary, and the two gates what they decided. Each arm result
 * fills one bucket: a finished column under columns, a stop under stopped, a
 * skip under skipped; a finished column also records the line that explains a
 * re-run.
 *
 * @param {object} parts - Report inputs
 * @param {string} parts.generated - Run timestamp, ISO 8601
 * @param {{ tracked: number, noConfig: number, forced: number, noDeltas: number, kept: number, noGold: number, sampled: number, inert: number }} parts.census - Census counts
 * @param {Array<{ path: string, gold: number|null, lastIteration: number|null, stops: object }>} parts.lineages - Sampled lineages in census order
 * @param {{ method: string, right: number }} parts.baseline - Baseline method and how many lineages it read right
 * @param {{ label: object|null, headroom: string }} parts.gate - Label gate result and the headroom line
 * @param {object} [parts.jev] - Jev arm result, when the arm ran or was withheld
 * @param {object} [parts.deem] - Deem arm result, when the arm ran or was withheld
 * @returns {object} Report object ready for JSON.stringify
 */
function buildReport(parts) {
  const { generated, census, lineages, baseline, gate, jev, deem } = parts;
  const report = {
    question: QUESTION,
    generated,
    census: { ...census },
    lineages: lineages.map((entry) => ({ ...entry, stops: { ...entry.stops } })),
    baseline: { method: baseline.method, right: baseline.right },
    gate: { label: gate.label, headroom: gate.headroom },
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
      report.stopped[backend] = { line: arm.stopped, partialLineages: arm.partialLineages ?? null };
      continue;
    }
    if (!arm.column) continue;
    report.columns[backend] = { ...arm.column };
    report.requalify[backend] = arm.requalify ?? null;
  }

  return report;
}

/**
 * Write the run report into `report.json` under the output directory. A run
 * without a directory writes nothing, and the file is written whole on every
 * run, so an earlier report never merges into a later one.
 *
 * @param {string|undefined|null} outDir - Output directory, absent when the run requested none
 * @param {object} report - Report object from buildReport
 * @returns {string|null} Written path, or null when no directory was requested
 */
function writeReport(outDir, report) {
  if (typeof outDir !== 'string' || outDir === '') return null;
  fs.mkdirSync(outDir, { recursive: true });
  const file = path.join(outDir, 'report.json');
  fs.writeFileSync(file, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  return file;
}

// ─────────────────────────────────────────────────────────────────────────────
// 14. MAIN
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parse the switches, walk the tracked lineages, print the census lines, stop
 * at the label gate when a switch asked for an arm the operator's reads do
 * not yet confirm, run the requested backend gate and arm, and write the report
 * when `--out` names a directory.
 *
 * @param {string[]} argv - Command-line switches, without the node and script parts
 * @param {object} [deps] - Injected seams: out, err, env, repoRoot, timeoutMs, backoffMs
 * @returns {Promise<number>} The exit code: 0 on a printed census or gate stop, 2 on a parse, refusal, reads or walk failure
 */
async function main(argv, deps = {}) {
  const out = deps.out ?? ((line) => process.stdout.write(`${line}\n`));
  const err = deps.err ?? ((line) => process.stderr.write(`${line}\n`));
  const repoRoot = deps.repoRoot ?? process.cwd();
  const env = deps.env ?? process.env;
  const timeoutMs = deps.timeoutMs ?? CALL_TIMEOUT_MS;
  const backoffMs = deps.backoffMs ?? BACKOFF_MS;

  let values;
  try {
    ({ values } = parseArgs({
      args: argv,
      strict: true,
      allowPositionals: false,
      options: {
        jev: { type: 'boolean' },
        deem: { type: 'boolean' },
        out: { type: 'string' },
        'gold-reads': { type: 'string' },
      },
    }));
  } catch (error) {
    err(error instanceof Error ? error.message : String(error));
    return 2;
  }

  // Refuse a model arm before anything else runs: a call whose outcome is never
  // recorded cannot be inspected later, and the operator asked for a directory.
  if ((values.jev === true || values.deem === true) && (typeof values.out !== 'string' || values.out === '')) {
    err(values.deem === true
      ? '--deem needs --out <dir> so every call is recorded'
      : '--jev needs --out <dir> so every call is recorded');
    return 2;
  }

  // The reads file refuses the run before the census, so a bad row leaves stdout empty.
  let goldReads = new Map();
  if (typeof values['gold-reads'] === 'string') {
    try {
      goldReads = parseGoldReads(fs.readFileSync(values['gold-reads'], 'utf8'));
    } catch (error) {
      err(error instanceof Error ? error.message : String(error));
      return 2;
    }
  }

  let stateFiles;
  try {
    stateFiles = listStateFiles(repoRoot);
  } catch (error) {
    err(error instanceof Error ? error.message : String(error));
    return 2;
  }

  let noConfig = 0;
  let forced = 0;
  let noDeltas = 0;
  let kept = 0;
  let noGold = 0;
  const candidates = [];
  try {
    for (const stateFile of stateFiles) {
      const lineageDir = path.dirname(stateFile);
      const absDir = path.join(repoRoot, lineageDir);
      const config = readConfig(absDir);
      if (config === null) {
        noConfig += 1;
        continue;
      }
      if (!isMovable(config)) {
        forced += 1;
        continue;
      }
      const deltas = deltaIterationFiles(absDir);
      if (deltas.length === 0) {
        noDeltas += 1;
        continue;
      }
      kept += 1;
      const { gold, cited, firstAppearance } = deriveGold(deltas);
      const records = [];
      for (const line of fs.readFileSync(path.join(repoRoot, stateFile), 'utf8').split('\n')) {
        const trimmed = line.trim();
        if (trimmed === '') {
          continue;
        }
        try {
          records.push(JSON.parse(trimmed));
        } catch {
          continue;
        }
      }
      const inert = isInertWindow(records);
      if (gold === null) {
        noGold += 1;
        continue;
      }
      const state = readStateRecords(path.join(repoRoot, stateFile));
      const evidence = state.iterations.filter((iteration) => iteration.status !== 'thought');
      const threshold = Number.isFinite(config.convergenceThreshold) ? config.convergenceThreshold : DEFAULT_CONVERGENCE_THRESHOLD;
      const minIterations = Number.isInteger(config.minIterations) ? config.minIterations : DEFAULT_MIN_ITERATIONS;
      const voteOptions = {
        threshold,
        minIterations,
        blocked: state.blocked,
        coverage: coverageSeries(state.iterations),
      };
      const lastIteration = state.iterations.length > 0 ? state.iterations[state.iterations.length - 1].n : null;
      const sourceSeries = deltas.map((entry) => {
        const citedCount = cited.get(entry.n) ?? 0;
        return { n: entry.n, ratio: citedCount > 0 ? (firstAppearance.get(entry.n) ?? 0) / citedCount : 0 };
      });
      candidates.push({
        path: lineageDir,
        gold,
        inert,
        iterationCount: state.iterations.length,
        carriesCounts: state.iterations.some((iteration) => iteration.keyQuestions.length > 0 || iteration.answeredQuestions.length > 0),
        stops: {
          recorded: lastIteration,
          legacy: stopFor(evidence.map((iteration) => ({ n: iteration.n, ratio: iteration.ratio })), voteOptions),
          sources: stopFor(sourceSeries, voteOptions),
        },
      });
    }
  } catch (error) {
    err(error instanceof Error ? error.message : String(error));
    return 2;
  }

  // The spec orders each group by a hash of the path, so the sample does not
  // lean toward whichever folders happen to sort first by name.
  const pathHash = new Map(candidates.map((entry) => [entry.path, crypto.createHash('sha256').update(entry.path).digest('hex')]));
  candidates.sort((a, b) => {
    const byInert = Number(b.inert) - Number(a.inert);
    if (byInert !== 0) return byInert;
    const ha = pathHash.get(a.path);
    const hb = pathHash.get(b.path);
    return ha < hb ? -1 : ha > hb ? 1 : 0;
  });
  const sampled = candidates.slice(0, SAMPLE_MAX);
  const derivedOn = sampled.filter((entry) => entry.gold !== null).length;
  const inertCount = sampled.filter((entry) => entry.inert).length;

  const rightCounts = { recorded: 0, legacy: 0, sources: 0 };
  let withCounts = 0;
  let sampledIterations = 0;
  for (const entry of sampled) {
    if (rightOf(entry.stops.recorded, entry.gold)) {
      rightCounts.recorded += 1;
    }
    if (rightOf(entry.stops.legacy, entry.gold)) {
      rightCounts.legacy += 1;
    }
    if (rightOf(entry.stops.sources, entry.gold)) {
      rightCounts.sources += 1;
    }
    if (entry.carriesCounts) {
      withCounts += 1;
    }
    sampledIterations += entry.iterationCount;
  }
  const baseline = pickBaseline(rightCounts);

  out(`lineages: tracked ${stateFiles.length} no config ${noConfig} forced ${forced} no deltas ${noDeltas} kept ${kept} no gold ${noGold} sampled ${sampled.length} inert ${inertCount}`);
  out(`gold: derived on ${derivedOn} of ${sampled.length} sampled`);
  const reads = sampled.slice(0, 5).map((entry) => `${entry.path} g=${entry.gold}`);
  out(reads.length === 0 ? 'reads: none' : `reads: ${reads.join(' | ')}`);
  out(`method recorded: right ${rightCounts.recorded} of ${sampled.length}`);
  out(`method legacy: right ${rightCounts.legacy} of ${sampled.length}`);
  out(`method sources: right ${rightCounts.sources} of ${sampled.length}`);
  out(`baseline: ${baseline.method} right ${baseline.right} of ${sampled.length}`);
  out(`question counts: ${withCounts} of ${sampled.length} sampled lineages carry key/answered counts`);
  out(MARGIN_LINE);
  out(KEEP_RULE_LINE);
  out(POWER_LINE);
  const headroomLine = gateLine({ sampled: sampled.length, right: baseline.right, iterations: sampledIterations });
  out(headroomLine);
  // The label gate opens no arm; it keeps one closed until the operator confirms the gold.
  let labelResult = null;
  let labelPassed = false;
  if (values.jev === true || values.deem === true) {
    const gate = labelGate({ sampled, reads: goldReads });
    labelResult = { passed: gate.passed, line: gate.line };
    labelPassed = gate.passed;
    if (!gate.passed) {
      out(gate.line);
    }
  }
  // A baseline already right on more than nine lineages in ten leaves no room
  // for a column to beat it, so a passed label gate still opens no arm.
  const armsOpen = labelPassed && headroomLine !== 'no headroom';
  const headroomSkip = labelPassed && !armsOpen;
  // One call log for the whole run, so a run that opens both arms records
  // every spawn in one file.
  const callLog = createCallLog(values.out);
  // A stored report is the only record of what an earlier run measured on, so
  // the arms can requalify their verdict when the identity changed since then.
  const stored = values.jev === true || values.deem === true ? readStoredReport(values.out) : null;
  // The Jev gate reads only the client identity and credential, never lineage text.
  let jevResult;
  let jevStops = null;
  if (values.jev === true && headroomSkip) {
    out('jev arm skipped: no headroom');
    jevResult = { skipped: 'no headroom' };
  } else if (values.jev === true && armsOpen) {
    const jev = jevGate({ out, env, timeoutMs });
    if (!jev.passed) {
      jevResult = { skipped: jev.reason };
    } else {
      const plan = { lineages: [] };
      try {
        for (const entry of sampled) {
          const lineageDir = path.join(repoRoot, entry.path);
          const config = readConfig(lineageDir) ?? {};
          const state = readStateRecords(path.join(lineageDir, 'deep-research-state.jsonl'));
          const files = deltaIterationFiles(lineageDir);
          plan.lineages.push({
            path: entry.path,
            gold: entry.gold,
            baselineStop: entry.stops[baseline.method],
            vote: {
              threshold: Number.isFinite(config.convergenceThreshold) ? config.convergenceThreshold : DEFAULT_CONVERGENCE_THRESHOLD,
              minIterations: Number.isInteger(config.minIterations) ? config.minIterations : DEFAULT_MIN_ITERATIONS,
              blocked: state.blocked,
              coverage: coverageSeries(state.iterations),
            },
            iterations: state.iterations
              .filter((iteration) => iteration.status !== 'thought')
              .map((iteration) => ({ n: iteration.n, state: buildState(files, iteration.n) })),
          });
        }
      } catch (error) {
        err(error instanceof Error ? error.message : String(error));
        return 2;
      }
      jevResult = await runJevArm(plan, jev, { out, env, timeoutMs, backoffMs, callLog, repoRoot, baseline: baseline.method, stored });
      jevStops = jevResult.stops ?? null;
    }
  }

  // The Deem gate reads only the local server identity, never lineage text.
  let deemResult;
  let deemStops = null;
  if (values.deem === true && headroomSkip) {
    out('deem arm skipped: no headroom');
    deemResult = { skipped: 'no headroom' };
  } else if (values.deem === true && armsOpen) {
    const deem = deemGate({ out, env });
    if (!deem.passed) {
      deemResult = { skipped: deem.reason };
    } else {
      const plan = { lineages: [] };
      try {
        for (const entry of sampled) {
          const lineageDir = path.join(repoRoot, entry.path);
          const config = readConfig(lineageDir) ?? {};
          const state = readStateRecords(path.join(lineageDir, 'deep-research-state.jsonl'));
          const files = deltaIterationFiles(lineageDir);
          plan.lineages.push({
            path: entry.path,
            gold: entry.gold,
            baselineStop: entry.stops[baseline.method],
            vote: {
              threshold: Number.isFinite(config.convergenceThreshold) ? config.convergenceThreshold : DEFAULT_CONVERGENCE_THRESHOLD,
              minIterations: Number.isInteger(config.minIterations) ? config.minIterations : DEFAULT_MIN_ITERATIONS,
              blocked: state.blocked,
              coverage: coverageSeries(state.iterations),
            },
            iterations: state.iterations
              .filter((iteration) => iteration.status !== 'thought')
              .map((iteration) => ({ n: iteration.n, state: buildState(files, iteration.n) })),
          });
        }
      } catch (error) {
        err(error instanceof Error ? error.message : String(error));
        return 2;
      }
      deemResult = await runDeemArm(plan, deem, { out, env, timeoutMs, callLog, baseline: baseline.method, stored });
      deemStops = deemResult.stops ?? null;
    }
  }
  writeReport(values.out, buildReport({
    generated: new Date().toISOString(),
    census: {
      tracked: stateFiles.length,
      noConfig,
      forced,
      noDeltas,
      kept,
      noGold,
      sampled: sampled.length,
      inert: inertCount,
    },
    lineages: sampled.map((entry) => ({
      path: entry.path,
      gold: entry.gold,
      lastIteration: entry.stops.recorded,
      stops: {
        recorded: entry.stops.recorded,
        legacy: entry.stops.legacy,
        sources: entry.stops.sources,
        deem: deemStops === null ? null : deemStops.get(entry.path) ?? null,
        jev: jevStops === null ? null : jevStops.get(entry.path) ?? null,
      },
    })),
    baseline,
    gate: { label: labelResult, headroom: headroomLine },
    jev: jevResult,
    deem: deemResult,
  }));
  return 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// 15. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  QUESTION,
  LEVEL_LABELS,
  LEVEL_RATIOS,
  SAMPLE_MAX,
  LABEL_GATE,
  INERT_WINDOW,
  STATE_MAX_CHARS,
  DEFAULT_CONVERGENCE_THRESHOLD,
  DEFAULT_MIN_ITERATIONS,
  MARGIN_LINE,
  KEEP_RULE_LINE,
  POWER_LINE,
  DEEM_MODEL,
  DEEM_P50_MS,
  JEV_VERSION,
  HEALTH_TIMEOUT_MS,
  CALL_TIMEOUT_MS,
  BACKOFF_MS,
  JEV_RERUNS,
  USAGE,
  listStateFiles,
  readConfig,
  isMovable,
  deltaIterationFiles,
  findingSources,
  deriveGold,
  readStateRecords,
  coverageSeries,
  replayVote,
  stopFor,
  rightOf,
  pickBaseline,
  gateLine,
  parseGoldReads,
  labelGate,
  which,
  jevGate,
  existsAtOriginMain,
  withheldRecords,
  buildState,
  spawnCall,
  createCallLog,
  runJevArm,
  deemCommand,
  readDeemHealth,
  deemGate,
  runDeemArm,
  binomialTail,
  decideVerdict,
  formatP,
  summarizeColumn,
  verdictLine,
  readStoredReport,
  buildReport,
  writeReport,
  isInertWindow,
  main,
};

// ─────────────────────────────────────────────────────────────────────────────
// 16. CLI ENTRYPOINT
// ─────────────────────────────────────────────────────────────────────────────

if (require.main === module) {
  main(process.argv.slice(2)).then((code) => {
    process.exitCode = code;
  });
}

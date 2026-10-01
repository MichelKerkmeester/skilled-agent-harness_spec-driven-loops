// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: score-goal-lint                                               ║
// ║ scores the goal-criteria lint against labels                             ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const { spawnSync } = require('node:child_process');
const { createHash } = require('node:crypto');
const path = require('node:path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const TAG = '[score-goal-lint]';

// Under 5% labeled violations a model arm cannot earn its calls, on either backend.
const STOP_RATE = 0.05;
const WILSON_Z = 1.96;
const STOP_LINE = 'r20 model arm not built: labeled_violation_rate<0.05';
const JEV_VERSION = '0.6.2';
const JEV_RERUNS = 3;
const JEV_TIMEOUT_MS = 120000;
const JEV_MAX_BUFFER_BYTES = 1024 * 1024;
const JEV_FLAG_THRESHOLD = 0.5;
const JEV_MIN_F1_GAIN = 0.2;
const JEV_MIN_PRECISION = 0.8;
const JEV_MAX_FLIP_RATE = 0.1;
const JEV_TOKEN_CHAR_DIVISOR = 4;
const JEV_QUESTIONS = [
  {
    rule: 'rule4',
    label: 'rule4_ok',
    prompt: 'Can every referent in this goal criterion be resolved from its own text, without reading another document?'
  },
  {
    rule: 'rule5',
    label: 'rule5_ok',
    prompt: 'Does this goal criterion name one observable result that a reader could check?'
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function isLabeled(row) {
  return typeof row.rule4_ok === 'boolean' && typeof row.rule5_ok === 'boolean';
}

function formatNumber(value) {
  return value === null ? 'n/a' : value.toFixed(4);
}

function getDefaultWorkspaceRoot() {
  return path.resolve(__dirname, '../../../../../');
}

function joinedLabeledRows(rows, lintRecords, score) {
  if (score.mismatch) return [];

  const byHash = new Map();
  for (const record of lintRecords) {
    if (!byHash.has(record.text_sha12)) byHash.set(record.text_sha12, record);
  }

  return rows.filter(isLabeled).flatMap((row) => {
    const record = byHash.get(row.text_sha12);
    return record && record.class === 'scored' ? [{ row, record }] : [];
  });
}

// Hash verification prevents a saved lint record from sending changed criterion text.
function getCriterionText(record, root) {
  const sourceId = record.id ?? '(unknown)';
  const sourceError = (reason) => new Error(
    'cannot verify criterion source ' + sourceId + ': ' + reason + '; check --root and rerun lint'
  );
  const match = typeof record.id === 'string' ? /^(.*):(\d+)$/u.exec(record.id) : null;
  if (!match) throw sourceError('record ID must end in a file line number');

  const rootPath = path.resolve(root);
  const goalPath = path.resolve(rootPath, match[1]);
  const canonicalRoot = fs.realpathSync(rootPath);
  const canonicalGoal = fs.realpathSync(goalPath);
  const relativePath = path.relative(canonicalRoot, canonicalGoal);
  if (
    relativePath === '' ||
    relativePath === '..' ||
    relativePath.startsWith('..' + path.sep) ||
    path.isAbsolute(relativePath)
  ) {
    throw sourceError('resolved path must stay inside --root');
  }

  const lineNumber = Number(match[2]);
  if (!Number.isSafeInteger(lineNumber) || lineNumber < 1) {
    throw sourceError('source line number must be positive');
  }

  const sourceLine = fs.readFileSync(canonicalGoal, 'utf8').split(/\r?\n/u)[lineNumber - 1];
  const item = sourceLine?.match(/^[-*+]\s+(?:\[[ xX]\]\s*)?(.*)$/u);
  if (!item) throw sourceError('source line must be a criterion bullet');

  const text = item[1].trimEnd();
  const textHash = createHash('sha256').update(text, 'utf8').digest('hex').slice(0, 12);
  if (textHash !== record.text_sha12) throw sourceError('source text hash does not match the saved lint record');
  return text;
}

function which(name, env) {
  for (const directory of (env.PATH ?? '').split(path.delimiter)) {
    if (directory === '') continue;
    const candidate = path.join(directory, name);
    try {
      if (!fs.statSync(candidate).isFile()) continue;
      fs.accessSync(candidate, fs.constants.X_OK);
      return candidate;
    } catch {
      continue;
    }
  }
  return null;
}

function spawnCall(file, args, stdinText, env) {
  const started = Date.now();
  const result = spawnSync(file, args, {
    env,
    encoding: 'utf8',
    input: stdinText,
    maxBuffer: JEV_MAX_BUFFER_BYTES,
    timeout: JEV_TIMEOUT_MS
  });

  return {
    code: result.status === null ? (result.error ? 127 : -1) : result.status,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? (result.error?.message ?? ''),
    wallMs: Date.now() - started,
    timedOut: result.error?.code === 'ETIMEDOUT'
  };
}

function createCallLog(outDir) {
  fs.mkdirSync(outDir, { recursive: true });
  const filePath = path.join(outDir, 'calls.jsonl');
  fs.writeFileSync(filePath, '');
  return {
    append(record) {
      fs.appendFileSync(filePath, JSON.stringify(record) + '\n');
    }
  };
}

function logJevCall(callLog, jevPath, provider, phase, args, call, details = {}) {
  callLog.append({
    backend: 'jev',
    phase,
    executable: jevPath,
    args,
    exitCode: call.code,
    timedOut: call.timedOut,
    wallMs: call.wallMs,
    jevVersion: JEV_VERSION,
    provider,
    ...details
  });
}

function runJevGate(env, out, callLog) {
  const provider = env.JEV_PROVIDER || 'official';
  const jevPath = which('jev', env);
  out('jev: path=' + (jevPath ?? 'none') + ' provider=' + provider);

  if (jevPath === null) {
    const reason = 'jev arm skipped: jev not on PATH';
    out(reason);
    return { passed: false, reason, path: null, provider };
  }

  const versionArgs = ['--version'];
  const version = spawnCall(jevPath, versionArgs, '', env);
  const versionText = version.stdout.trim();
  const found = versionText === '' ? '' : versionText.split('\n')[0];
  logJevCall(callLog, jevPath, provider, 'version', versionArgs, version, { found });
  if (version.code !== 0 || found !== 'jev ' + JEV_VERSION) {
    const reason = 'jev arm skipped: version';
    out(reason);
    out('jev: found=' + JSON.stringify(found) + ' path=' + jevPath);
    return { passed: false, reason, path: jevPath, provider };
  }

  const authArgs = ['auth', 'status', '--provider', provider];
  const auth = spawnCall(jevPath, authArgs, '', env);
  logJevCall(callLog, jevPath, provider, 'auth status', authArgs, auth);
  if (auth.code !== 0) {
    const reason = 'jev arm skipped: no credential';
    out(reason);
    return { passed: false, reason, path: jevPath, provider };
  }

  return { passed: true, path: jevPath, provider };
}

function parseNoul(stdout) {
  let parsed;
  try {
    parsed = JSON.parse(stdout);
  } catch {
    return null;
  }

  const probability = parsed?.answers?.answer?.noul;
  if (typeof probability !== 'number' || !Number.isFinite(probability) || probability < 0 || probability > 1) {
    return null;
  }
  return probability;
}

function formatMetricsLine(name, metrics) {
  return 'column jev ' + name +
    ': tp=' + metrics.tp +
    ' fp=' + metrics.fp +
    ' fn=' + metrics.fn +
    ' tn=' + metrics.tn +
    ' precision=' + formatNumber(metrics.precision) +
    ' recall=' + formatNumber(metrics.recall) +
    ' f1=' + formatNumber(metrics.f1);
}

function jevVerdict(jevMetrics, lintMetrics, flipRate) {
  const reasons = [];
  if (
    jevMetrics.f1 === null ||
    !lintMetrics ||
    lintMetrics.f1 === null ||
    jevMetrics.f1 < lintMetrics.f1 + JEV_MIN_F1_GAIN
  ) {
    reasons.push('F1 gain below ' + JEV_MIN_F1_GAIN);
  }
  if (jevMetrics.precision === null || jevMetrics.precision < JEV_MIN_PRECISION) {
    reasons.push('precision below ' + JEV_MIN_PRECISION);
  }
  if (flipRate === null || flipRate > JEV_MAX_FLIP_RATE) {
    reasons.push('aggregate flip rate above ' + JEV_MAX_FLIP_RATE.toFixed(2));
  }

  return {
    verdict: reasons.length === 0 ? 'keep' : 'kill',
    reason: reasons.length === 0 ? 'all keep thresholds met' : reasons.join(', ')
  };
}

/**
 * Rerun each question so its mean score and answer stability are both measured.
 * @param {Array<{ row: object, record: object }>} joined Joined labeled criteria.
 * @param {string[]} criteria Source text verified against each lint record.
 * @param {object} lintScore Existing lint metrics used for the keep comparison.
 * @param {{ path: string, provider: string }} gate A passing Jev identity.
 * @param {NodeJS.ProcessEnv} env Child environment for the executable.
 * @param {{ append: (record: object) => void }} callLog Per-call JSONL writer.
 * @param {(line: string) => void} out Output line writer.
 * @returns {object} The measured Jev column or its stopped state.
 */
function runJevArm(joined, criteria, lintScore, gate, env, callLog, out) {
  const totalQuestions = joined.length * JEV_QUESTIONS.length;
  const plannedCalls = totalQuestions * JEV_RERUNS;
  const inputCharacters = criteria.reduce((sum, criterion) => {
    const criterionInput = JSON.stringify({ criterion });
    return sum + JEV_RERUNS * JEV_QUESTIONS.reduce(
      (questionSum, question) => questionSum + criterionInput.length + question.prompt.length,
      0
    );
  }, 0);

  if (plannedCalls > 0) {
    out(
      'jev: payload: committed goal criterion lines; planned calls: ' + plannedCalls +
      '; estimated input tokens: ' + Math.ceil(inputCharacters / JEV_TOKEN_CHAR_DIVISOR)
    );
  }

  const pairs = { rule4: [], rule5: [] };
  const rowScores = [];
  let flips = 0;
  let modelCalls = 0;

  for (let rowIndex = 0; rowIndex < joined.length; rowIndex += 1) {
    const { row, record } = joined[rowIndex];
    const criterion = criteria[rowIndex];
    const stdinText = JSON.stringify({ criterion });
    const rowScore = { id: record.id };

    for (const question of JEV_QUESTIONS) {
      const args = ['noul', '--provider', gate.provider, '-q', question.prompt];
      const probabilities = [];

      for (let rerun = 0; rerun < JEV_RERUNS; rerun += 1) {
        const call = spawnCall(gate.path, args, stdinText, env);
        modelCalls += 1;
        const probability = call.code === 0 ? parseNoul(call.stdout) : null;
        logJevCall(callLog, gate.path, gate.provider, 'noul', args, call, {
          rowId: record.id,
          rowIndex: rowIndex + 1,
          question: question.rule,
          rerun: rerun + 1,
          probability,
          status: call.code === 3 ? 'key_rejected' : probability === null ? 'unmeasured' : 'measured'
        });

        if (call.code === 3) {
          const reason = 'key rejected';
          out('jev arm stopped: ' + reason);
          return { status: 'stopped', reason, provider: gate.provider, jevVersion: JEV_VERSION, modelCalls };
        }
        if (call.code !== 0) {
          const reason = 'call failed';
          out('jev arm stopped: ' + reason);
          return { status: 'stopped', reason, provider: gate.provider, jevVersion: JEV_VERSION, modelCalls };
        }
        if (probability === null) {
          const reason = 'invalid response';
          out('jev arm stopped: ' + reason);
          return { status: 'stopped', reason, provider: gate.provider, jevVersion: JEV_VERSION, modelCalls };
        }
        probabilities.push(probability);
      }

      const flags = probabilities.map((probability) => probability < JEV_FLAG_THRESHOLD);
      if (flags.some((flag) => flag) && flags.some((flag) => !flag)) flips += 1;
      const meanProbability = probabilities.reduce((sum, probability) => sum + probability, 0) / JEV_RERUNS;
      const predictedViolation = meanProbability < JEV_FLAG_THRESHOLD;
      rowScore[question.rule] = { meanProbability, predictedViolation };
      pairs[question.rule].push({
        predicted: predictedViolation,
        actual: row[question.label] === false
      });
    }
    rowScores.push(rowScore);
  }

  const rule4 = ruleMetrics(pairs.rule4);
  const rule5 = ruleMetrics(pairs.rule5);
  const flipRate = totalQuestions === 0 ? null : flips / totalQuestions;
  const jevColumn = {
    status: 'completed',
    provider: gate.provider,
    jevVersion: JEV_VERSION,
    labeled: joined.length,
    rows: rowScores,
    rule4,
    rule5,
    flips: { count: flips, total: totalQuestions, rate: flipRate },
    plannedCalls,
    modelCalls
  };

  out(formatMetricsLine('rule4', rule4));
  out(formatMetricsLine('rule5', rule5));
  out('flips: F=' + flips + ' of ' + totalQuestions);

  const verdicts = {};
  for (const [name, metrics, lintMetrics] of [
    ['rule4', rule4, lintScore.rule4],
    ['rule5', rule5, lintScore.rule5]
  ]) {
    const decision = jevVerdict(metrics, lintMetrics, flipRate);
    verdicts[name] = decision;
    out(
      'verdict jev ' + name + ': ' + decision.verdict + ' (' + decision.reason +
      '; tp=' + metrics.tp +
      ' fp=' + metrics.fp +
      ' fn=' + metrics.fn +
      ' tn=' + metrics.tn +
      '; flips=' + flips + '/' + totalQuestions +
      '; jev_version=' + JEV_VERSION + ' provider=' + gate.provider + ')'
    );
  }

  jevColumn.verdicts = verdicts;
  return jevColumn;
}

function lintColumn(score) {
  return {
    status: score.mismatch ? 'rubric_mismatch' : 'completed',
    rows: score.rows,
    labeled: score.labeled ?? 0,
    rule4: score.rule4 ?? null,
    rule5: score.rule5 ?? null
  };
}

/**
 * Parse a JSON-lines labels file into row objects and per-line failures, so one
 * bad line is named and skipped instead of losing the whole file.
 *
 * @param {string} text - The raw labels file contents.
 * @returns {{ rows: Array<object>, errors: Array<{ line: number, message: string }> }} The parsed rows and the reason each rejected line failed.
 */
function parseLabels(text) {
  const rows = [];
  const errors = [];

  String(text).split(/\r?\n/u).forEach((line, index) => {
    if (line.trim() === '') return;

    let value;
    try {
      value = JSON.parse(line);
    } catch (error) {
      errors.push({ line: index + 1, message: error instanceof Error ? error.message : String(error) });
      return;
    }

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      rows.push(value);
    } else {
      errors.push({ line: index + 1, message: 'not a JSON object' });
    }
  });

  return { rows, errors };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Wilson score interval for a binomial proportion: the range the rate would sit
 * in if the labeled sample were drawn again, which keeps a small sample from
 * reading as certainty.
 *
 * @param {number} k - Violations observed among the labeled rows.
 * @param {number} n - Labeled rows observed.
 * @returns {[number, number] | null} The 95% interval clamped to [0, 1], or null when there is no sample.
 */
function wilsonInterval(k, n) {
  if (n <= 0) return null;

  const p = k / n;
  const z = WILSON_Z;
  const d = 1 + (z * z) / n;
  const c = (p + (z * z) / (2 * n)) / d;
  const h = (z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n))) / d;
  return [Math.max(0, c - h), Math.min(1, c + h)];
}

/**
 * Confusion-matrix metrics for one lint rule against its labels: predicted is
 * the lint flagging the line, actual is the label marking it a violation.
 *
 * @param {Array<{ predicted: boolean, actual: boolean }>} pairs - One entry per joined labeled row.
 * @returns {{ tp: number, fp: number, fn: number, tn: number, precision: number | null, recall: number | null, f1: number | null }} Counts and rates; a rate is null when its denominator is zero, and f1 follows.
 */
function ruleMetrics(pairs) {
  let tp = 0;
  let fp = 0;
  let fn = 0;
  let tn = 0;

  for (const pair of pairs) {
    if (pair.predicted && pair.actual) tp += 1;
    else if (pair.predicted && !pair.actual) fp += 1;
    else if (!pair.predicted && pair.actual) fn += 1;
    else tn += 1;
  }

  const precision = tp + fp > 0 ? tp / (tp + fp) : null;
  const recall = tp + fn > 0 ? tp / (tp + fn) : null;

  let f1 = null;
  if (precision !== null && recall !== null) {
    f1 = precision === 0 && recall === 0 ? 0 : (2 * precision * recall) / (precision + recall);
  }

  return { tp, fp, fn, tn, precision, recall, f1 };
}

/**
 * Join labeled rows to lint records by text hash and score the lint against
 * them, per rule and as one violation rate.
 *
 * @param {Array<object>} rows - Label rows carrying text_sha12, rubric and the rule4_ok/rule5_ok booleans.
 * @param {Array<object>} lintRecords - Criterion records from the goal-criteria lint.
 * @returns {object} The joined counts, per-rule metrics, the violation rate with its Wilson interval, and the stop flag; a rubric mismatch short-circuits to the mismatch list.
 */
function scoreLabels(rows, lintRecords) {
  const byHash = new Map();
  for (const record of lintRecords) {
    if (!byHash.has(record.text_sha12)) byHash.set(record.text_sha12, record);
  }

  const labeled = rows.filter(isLabeled);
  const unlabeled = rows.length - labeled.length;
  const rubrics = [...new Set(labeled.map((row) => row.rubric ?? 'null'))].sort();

  if (rubrics.length > 1) {
    return { rows: rows.length, unlabeled, mismatch: rubrics };
  }

  // Stale and unscored labels leave every rate, so an edited goal cannot skew the numbers.
  let stale = 0;
  let notScored = 0;
  const joined = [];

  for (const row of labeled) {
    const record = byHash.get(row.text_sha12);
    if (!record) {
      stale += 1;
    } else if (record.class !== 'scored') {
      notScored += 1;
    } else {
      joined.push({ row, record });
    }
  }

  const rule4 = ruleMetrics(joined.map(({ row, record }) => ({
    predicted: record.rule4.length > 0,
    actual: row.rule4_ok === false
  })));
  const rule5 = ruleMetrics(joined.map(({ row, record }) => ({
    predicted: record.rule5.length > 0,
    actual: row.rule5_ok === false
  })));

  const violations = joined.filter(({ row }) => row.rule4_ok === false || row.rule5_ok === false).length;
  const n = joined.length;
  const rate = n > 0 ? violations / n : null;

  return {
    rows: rows.length,
    mismatch: null,
    rubric: rubrics[0] ?? null,
    unlabeled,
    stale,
    notScored,
    labeled: n,
    rule4,
    rule5,
    violations,
    rate,
    interval: wilsonInterval(violations, n),
    stop: rate !== null && rate < STOP_RATE
  };
}

/**
 * Render a score as plain text lines: the counts, one line per rule, then the
 * violation rate with its interval, and the stop line when the rate falls
 * under the threshold.
 *
 * @param {object} result - The score returned by scoreLabels.
 * @returns {string[]} The score lines in reading order.
 */
function formatScore(result) {
  const lines = ['rows=' + result.rows];

  if (result.mismatch) {
    lines.push('rubric mismatch: ' + result.mismatch.join(','));
    return lines;
  }

  lines.push('rubric=' + (result.rubric ?? 'none'));
  lines.push('unlabeled=' + result.unlabeled);
  lines.push('stale=' + result.stale);
  lines.push('not_scored=' + result.notScored);
  lines.push('labeled=' + result.labeled);

  if (result.labeled === 0) {
    lines.push('no labeled rows');
    return lines;
  }

  for (const [name, metrics] of [['rule4', result.rule4], ['rule5', result.rule5]]) {
    lines.push(
      name +
      ' tp=' + metrics.tp +
      ' fp=' + metrics.fp +
      ' fn=' + metrics.fn +
      ' tn=' + metrics.tn +
      ' precision=' + formatNumber(metrics.precision) +
      ' recall=' + formatNumber(metrics.recall) +
      ' f1=' + formatNumber(metrics.f1)
    );
  }

  lines.push(
    'labeled_violation_rate=' + result.violations + '/' + result.labeled +
    '=' + formatNumber(result.rate) +
    ' wilson95=[' + formatNumber(result.interval[0]) + ',' + formatNumber(result.interval[1]) + ']'
  );

  if (result.stop) lines.push(STOP_LINE);
  return lines;
}

/**
 * Parse the command line: the labels file to score, an optional saved lint
 * report and workspace root, and the optional Jev output directory. An option
 * this parser does not know is a hard error rather than a guess.
 *
 * @param {string[]} argv - Arguments after the script name.
 * @returns {object} Parsed paths, with `jev` and `out` when the Jev arm is enabled.
 */
function parseScoreArguments(argv) {
  let hasJevFlag = false;
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--jev') {
      hasJevFlag = true;
      break;
    }
    if (argument === '--labels' || argument === '--lint' || argument === '--root' || argument === '--out') {
      index += 1;
    }
  }

  const options = {
    labels: null,
    lint: null,
    root: null,
    jev: false,
    out: null,
    outRequested: false,
    outMissing: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--jev') {
      options.jev = true;
    } else if (argument === '--out') {
      if (!hasJevFlag) throw new Error('unknown option: --out');
      options.outRequested = true;
      const value = argv[index + 1];
      if (!value) {
        options.outMissing = true;
      } else {
        options.out = path.resolve(value);
        index += 1;
      }
    } else if (argument === '--labels' || argument === '--lint' || argument === '--root') {
      const value = argv[index + 1];
      if (!value) throw new Error(argument + ' requires a path');
      if (argument === '--labels') options.labels = path.resolve(value);
      else if (argument === '--lint') options.lint = path.resolve(value);
      else options.root = path.resolve(value);
      index += 1;
    } else {
      throw new Error('unknown option: ' + argument);
    }
  }

  if (!options.jev && options.outRequested) throw new Error('unknown option: --out');
  if (options.jev && (options.out === null || options.outMissing)) {
    throw new Error('--jev requires --out <dir>');
  }
  if (options.labels === null) throw new Error('--labels is required');
  if (options.jev) {
    return {
      labels: options.labels,
      lint: options.lint,
      root: options.root,
      jev: true,
      out: options.out
    };
  }
  return { labels: options.labels, lint: options.lint, root: options.root };
}

/**
 * Score one labels file against lint records and print the score lines. The
 * records come from a saved lint report with --lint, or from a fresh workspace
 * run otherwise. A bad label line is reported and skipped; anything that stops
 * the score is an error and a non-zero exit.
 *
 * @param {string[]} argv - Arguments after the script name.
 * @returns {number} 0 when the score prints, 2 when the input cannot be read or parsed.
 */
function main(argv) {
  let options;
  try {
    options = parseScoreArguments(argv);
  } catch (error) {
    console.error(TAG + ' ERROR ' + (error instanceof Error ? error.message : String(error)));
    return 2;
  }

  let text;
  try {
    text = fs.readFileSync(options.labels, 'utf8');
  } catch (error) {
    console.error(TAG + ' ERROR ' + options.labels + ': ' + (error instanceof Error ? error.message : String(error)));
    return 2;
  }

  const parsed = parseLabels(text);
  for (const e of parsed.errors) {
    console.error(TAG + ' ERROR labels line ' + e.line + ': ' + e.message);
  }

  let records;
  if (options.lint !== null) {
    try {
      const report = JSON.parse(fs.readFileSync(options.lint, 'utf8'));
      if (!report || !Array.isArray(report.records)) throw new Error('no records array');
      records = report.records;
    } catch (error) {
      console.error(TAG + ' ERROR ' + options.lint + ': ' + (error instanceof Error ? error.message : String(error)));
      return 2;
    }
  } else {
    const { lintWorkspace } = require('./lint-goal-criteria.cjs');
    records = lintWorkspace(options.root || getDefaultWorkspaceRoot()).records;
  }

  const score = scoreLabels(parsed.rows, records);
  for (const line of formatScore(score)) console.log(line);

  if (options.jev) {
    const callLog = createCallLog(options.out);
    const gate = runJevGate(process.env, console.log, callLog);
    let jev;

    if (!gate.passed) {
      jev = {
        status: 'skipped',
        reason: gate.reason,
        path: gate.path,
        provider: gate.provider,
        jevVersion: JEV_VERSION
      };
    } else {
      const joined = joinedLabeledRows(parsed.rows, records, score);
      const root = options.root || getDefaultWorkspaceRoot();
      const criteria = joined.map(({ record }) => getCriterionText(record, root));
      jev = runJevArm(joined, criteria, score, gate, process.env, callLog, console.log);
    }

    const report = {
      columns: {
        lint: lintColumn(score),
        jev
      }
    };
    fs.writeFileSync(path.join(options.out, 'report.json'), JSON.stringify(report, null, 2) + '\n');
  }

  return 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  STOP_LINE,
  wilsonInterval,
  ruleMetrics,
  scoreLabels,
  formatScore,
  parseLabels,
  parseScoreArguments,
  main
};

if (require.main === module) {
  try {
    process.exitCode = main(process.argv.slice(2));
  } catch (error) {
    console.error(TAG + ' ERROR ' + (error instanceof Error ? error.message : String(error)));
    process.exitCode = 2;
  }
}

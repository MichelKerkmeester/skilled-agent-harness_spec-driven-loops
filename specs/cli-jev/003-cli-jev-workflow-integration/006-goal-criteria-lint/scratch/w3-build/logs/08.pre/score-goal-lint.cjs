// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ score-goal-lint: scores the goal-criteria lint against labels            ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const TAG = '[score-goal-lint]';

// Under 5% labeled violations a model arm cannot earn its calls, on either backend.
const STOP_RATE = 0.05;
const WILSON_Z = 1.96;
const STOP_LINE = 'r20 model arm not built: labeled_violation_rate<0.05';

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function isLabeled(row) {
  return typeof row.rule4_ok === 'boolean' && typeof row.rule5_ok === 'boolean';
}

function formatNumber(value) {
  return value === null ? 'n/a' : value.toFixed(4);
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

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  STOP_LINE,
  wilsonInterval,
  ruleMetrics,
  scoreLabels,
  formatScore
};

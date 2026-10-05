// ───────────────────────────────────────────────────────────────────
// MODULE: Classifier Scorer Report
// ───────────────────────────────────────────────────────────────────
// Shared report pieces for the classifier scorers: the row-set pin, the
// out-directory guard, the probability-aware pick, the decided subset, the
// margin slack line, the cluster bootstrap and the keep-rule gates that
// score the sign test, the strongest policy and the per-class floor. The
// scorers that report these pieces import this one copy, so their digests
// and lines read alike.
//
// The module makes no call: it opens no socket, spawns no process and reads
// no credential. Its only file-system use asks whether a run artifact exists.
//
// The `.cjs` scorers require this file, so it ships no top-level await and
// declares only synchronous functions.
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

/**
 * Replicates drawn by the cluster bootstrap unless a caller asks for fewer.
 *
 * @type {number}
 */
export const BOOTSTRAP_REPLICATES = 1000;

// ───────────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────────

// Compare by code unit so every machine emits byte-identical artifacts.
const compareCodeUnits = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

// Linear interpolation between the two nearest order statistics.
function percentile(values, quantile) {
  if (values.length === 0) return null;
  const sorted = [...values].sort((left, right) => left - right);
  const position = (sorted.length - 1) * quantile;
  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  if (lower === upper) return sorted[lower];
  const fraction = position - lower;
  return sorted[lower] + ((sorted[upper] - sorted[lower]) * fraction);
}

// Add one finite probability to a key, skipping keys and values that are not.
function sumProbability(scores, key, value) {
  if (typeof key !== 'string' || typeof value !== 'number' || !Number.isFinite(value)) return;
  scores.set(key, (scores.get(key) ?? 0) + value);
}

// ───────────────────────────────────────────────────────────────────
// 4. ROW-SET PIN AND OUT-DIRECTORY GUARD
// ───────────────────────────────────────────────────────────────────

/**
 * Pin the exact rows and extras a run scored behind one sha256 digest.
 *
 * @param {Array<object>} rows Pin objects in the caller's own shape.
 * @param {Record<string, unknown>} [extras] Fields that join both the digest and the result.
 * @returns {{ rowSetSha256: string, rowCount: number, rows: Array<object> } & Record<string, unknown>} The pin.
 */
export function pinRowSet(rows, extras = {}) {
  const canonical = JSON.stringify({ rows, ...extras });
  return {
    rowSetSha256: createHash('sha256').update(canonical).digest('hex'),
    rowCount: rows.length,
    ...extras,
    rows,
  };
}

/**
 * Whether an output directory already contains a scorer run.
 *
 * @param {string | undefined} outDir Candidate output directory.
 * @param {string[]} [names] Durable run artifact names to look for.
 * @returns {boolean} True when any named artifact already exists.
 */
export function outDirectoryHoldsRun(outDir, names = ['calls.jsonl', 'report.json']) {
  if (typeof outDir !== 'string' || outDir === '') return false;
  return names.some((name) => fs.existsSync(path.join(outDir, name)));
}

// ───────────────────────────────────────────────────────────────────
// 5. PROBABILITY-AWARE PICK
// ───────────────────────────────────────────────────────────────────

/**
 * Pick the key with the highest summed probability across measured votes.
 * A vote whose pick is a string none key contributes `pickProb ?? noneProb`
 * to that key; every other vote contributes `pickProb` to its pick and
 * `noneProb` to the none key when one is named. Ties keep the first key.
 *
 * @param {Array<{ pick: string, pickProb?: number | null, noneProb?: number | null }>} votes Measured votes in vote order.
 * @param {string | null} [noneKey] The key that stands for none, or null.
 * @returns {string | null} The highest-scoring key, or null when nothing scored.
 */
export function probabilityAwarePick(votes, noneKey = null) {
  if (!Array.isArray(votes) || votes.length === 0) return null;
  for (const vote of votes) {
    if (typeof vote.pick !== 'string') return null;
  }
  const scores = new Map();
  for (const vote of votes) {
    if (vote.pick === noneKey) {
      sumProbability(scores, noneKey, vote.pickProb ?? vote.noneProb);
    } else {
      sumProbability(scores, vote.pick, vote.pickProb);
      if (typeof noneKey === 'string') sumProbability(scores, noneKey, vote.noneProb);
    }
  }
  let bestKey = null;
  let bestScore = -Infinity;
  for (const [key, score] of scores) {
    if (score > bestScore) {
      bestKey = key;
      bestScore = score;
    }
  }
  return bestKey;
}

// ───────────────────────────────────────────────────────────────────
// 6. DECIDED SUBSET AND MARGIN SLACK
// ───────────────────────────────────────────────────────────────────

/**
 * Count measured rows that committed to an answer other than none, and how
 * many of those were right.
 *
 * @param {Array<{ pick: string | null, gold: string }>} pairs Measured picks and their gold answer.
 * @param {string | null} [noneKey] The key that stands for none, or null.
 * @returns {{ decidedCount: number, decidedCorrect: number, decidedAccuracy: number | null }} The tally.
 */
export function decidedSubset(pairs, noneKey = null) {
  let decidedCount = 0;
  let decidedCorrect = 0;
  for (const pair of pairs) {
    if (typeof pair.pick !== 'string' || pair.pick === noneKey) continue;
    decidedCount += 1;
    if (pair.pick === pair.gold) decidedCorrect += 1;
  }
  return {
    decidedCount,
    decidedCorrect,
    decidedAccuracy: decidedCount === 0 ? null : decidedCorrect / decidedCount,
  };
}

/**
 * Rows of margin over the baseline after the measured-row slack.
 *
 * @param {{ A: number, B: number, M: number }} tally Scorer A wins, baseline B wins, measured rows M.
 * @returns {number | null} Slack in rows, or null when no row was measured.
 */
export function marginSlack({ A, B, M }) {
  return M === 0 ? null : (A - B) - (M / 10);
}

// ───────────────────────────────────────────────────────────────────
// 7. CLUSTER BOOTSTRAP
// ───────────────────────────────────────────────────────────────────

/**
 * Resample whole clusters to give the accuracy delta a 95% interval.
 *
 * @param {Array<{ cluster: string, delta: number }>} items Per-row deltas grouped by cluster.
 * @param {string} seedText Text that seeds the deterministic generator.
 * @param {number} [replicates] Replicate count.
 * @returns {{ clusterCount: number, replicates: number, estimate: number | null, lower: number | null, upper: number | null }} The interval.
 */
export function clusterBootstrapInterval(items, seedText, replicates = BOOTSTRAP_REPLICATES) {
  const clusters = new Map();
  let totalDelta = 0;
  let totalRows = 0;
  for (const item of items) {
    if (!clusters.has(item.cluster)) clusters.set(item.cluster, []);
    clusters.get(item.cluster).push(item.delta);
    totalDelta += item.delta;
    totalRows += 1;
  }
  const names = [...clusters.keys()].sort(compareCodeUnits);
  if (names.length === 0) {
    return {
      clusterCount: 0,
      replicates,
      estimate: null,
      lower: null,
      upper: null,
    };
  }

  const seedBytes = createHash('sha256').update(seedText).digest();
  let state = seedBytes.readUInt32BE(0) || 1;
  const random = () => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    return state / 0x1_0000_0000;
  };
  const estimates = [];
  for (let replicate = 0; replicate < replicates; replicate += 1) {
    let delta = 0;
    let sampledRows = 0;
    for (let draw = 0; draw < names.length; draw += 1) {
      const name = names[Math.floor(random() * names.length)];
      const cluster = clusters.get(name);
      for (const clusterDelta of cluster) {
        delta += clusterDelta;
        sampledRows += 1;
      }
    }
    estimates.push(sampledRows === 0 ? 0 : delta / sampledRows);
  }

  return {
    clusterCount: names.length,
    replicates,
    estimate: totalDelta / totalRows,
    lower: percentile(estimates, 0.025),
    upper: percentile(estimates, 0.975),
  };
}

// ───────────────────────────────────────────────────────────────────
// 8. REPORT LINES
// ───────────────────────────────────────────────────────────────────

/**
 * Render the decided-subset report line.
 *
 * @param {string} name Arm name.
 * @param {{ decidedCount: number, decidedCorrect: number, decidedAccuracy: number | null }} subset Decided-subset tally.
 * @returns {string} The report line.
 */
export function decidedSubsetLine(name, subset) {
  const accuracy = subset.decidedAccuracy === null ? 'none' : subset.decidedAccuracy.toFixed(4);
  return `decided-subset ${name}: ${subset.decidedCorrect}/${subset.decidedCount}`
    + ` accuracy=${accuracy}`;
}

/**
 * Render the margin-slack report line.
 *
 * @param {string} name Arm name.
 * @param {number | null} slack Slack in rows, or null.
 * @returns {string} The report line.
 */
export function marginSlackLine(name, slack) {
  return `margin slack ${name}: ${slack === null ? 'none' : slack.toFixed(1)} rows`;
}

/**
 * Render the cluster-bootstrap report line.
 *
 * @param {string} name Arm name compared against the baseline.
 * @param {{ clusterCount: number, replicates: number, lower: number | null, upper: number | null }} bootstrap Bootstrap interval.
 * @returns {string} The report line.
 */
export function bootstrapLine(name, bootstrap) {
  const lower = bootstrap.lower === null ? 'none' : bootstrap.lower.toFixed(4);
  const upper = bootstrap.upper === null ? 'none' : bootstrap.upper.toFixed(4);
  return `bootstrap ${name} vs baseline: accuracy_delta_95_ci=[${lower},${upper}]`
    + ` clusters=${bootstrap.clusterCount} replicates=${bootstrap.replicates}`;
}

// ───────────────────────────────────────────────────────────────────
// 9. KEEP-RULE GATES
// ───────────────────────────────────────────────────────────────────

/**
 * Exact upper tail of a fair coin flipped `n` times: P(X >= k) for
 * X ~ Binomial(n, 1/2), as an unreduced fraction of BigInts, so a keep rule
 * compares tails without float rounding at any pair count.
 *
 * @param {number} n Number of flips.
 * @param {number} k Smallest winning count the tail still includes.
 * @returns {{ num: bigint, den: bigint }} Numerator and denominator of the tail.
 */
export function binomialTailHalf(n, k) {
  const den = 1n << BigInt(n);
  if (n === 0 || k <= 0) return { num: den, den };
  let num = 0n;
  let coefficient = 1n;
  for (let i = 1; i <= n; i += 1) {
    coefficient = (coefficient * BigInt(n - i + 1)) / BigInt(i);
    if (i >= k) num += coefficient;
  }
  return { num, den };
}

/**
 * The strongest policy bar among the per-policy right counts: the highest
 * count, with a tie broken by the name that sorts first by code unit.
 *
 * @param {Record<string, number>} policies Right counts keyed by policy name.
 * @returns {{ name: string | null, right: number }} The bar, or none when no policy was scored.
 */
export function strongestPolicy(policies) {
  let name = null;
  let right = 0;
  for (const [policyName, rightCount] of Object.entries(policies)) {
    const better = name === null
      ? true
      : rightCount > right || (rightCount === right && compareCodeUnits(policyName, name) < 0);
    if (better) {
      name = policyName;
      right = rightCount;
    }
  }
  return { name, right };
}

/**
 * Whether an arm's right count strictly beats the strongest policy bar; an
 * exact tie fails.
 *
 * @param {number} jevRight Right count of the arm under test.
 * @param {Record<string, number>} policies Right counts keyed by policy name.
 * @returns {{ pass: boolean, name: string | null, right: number }} The verdict and the bar it faced.
 */
export function beatsStrongestPolicy(jevRight, policies) {
  const bar = strongestPolicy(policies);
  return { pass: jevRight > bar.right, name: bar.name, right: bar.right };
}

/**
 * Compare the arm against the baseline inside every class, so a win carried
 * by one class cannot hide a loss in another.
 *
 * @param {Array<{ cls: string, jevRight: boolean, baselineRight: boolean }>} rows Per-row correctness.
 * @returns {{ pass: boolean, classes: Array<{ cls: string, n: number, jev: number, baseline: number }>, failing: string[] }} The floor.
 */
export function classFloor(rows) {
  const byClass = new Map();
  for (const row of rows) {
    if (!byClass.has(row.cls)) byClass.set(row.cls, { cls: row.cls, n: 0, jev: 0, baseline: 0 });
    const counts = byClass.get(row.cls);
    counts.n += 1;
    if (row.jevRight) counts.jev += 1;
    if (row.baselineRight) counts.baseline += 1;
  }
  const classes = [...byClass.values()].sort((left, right) => compareCodeUnits(left.cls, right.cls));
  const failing = classes.filter((counts) => counts.jev < counts.baseline).map((counts) => counts.cls);
  return { pass: failing.length === 0, classes, failing };
}

// Whether an exact tail sits strictly below alpha. At 0.05 the comparison is
// the integer test 20 * num < den, so no float rounding decides a keep.
function tailBelowAlpha(num, den, alpha) {
  if (alpha === 0.05) return num * 20n < den;
  return Number(num) / Number(den) < alpha;
}

// Smallest k in 1..pairs whose exact tail is strictly below alpha, or null
// when even winning every pair leaves the tail at or above alpha.
function criticalCount(pairs, alpha) {
  if (pairs <= 0) return null;
  const widest = binomialTailHalf(pairs, pairs);
  if (!tailBelowAlpha(widest.num, widest.den, alpha)) return null;
  let lower = 1;
  let upper = pairs;
  while (lower < upper) {
    const middle = Math.floor((lower + upper) / 2);
    const tail = binomialTailHalf(pairs, middle);
    if (tailBelowAlpha(tail.num, tail.den, alpha)) upper = middle;
    else lower = middle + 1;
  }
  return lower;
}

// Probability that the winning count reaches k, summed in log space so pair
// counts near 100000 cannot underflow a product of per-pair terms.
function powerAtCount(pairs, k, winRate) {
  if (k === null || k > pairs) return 0;
  let logCoefficient = 0;
  for (let i = 1; i <= k; i += 1) logCoefficient += Math.log(pairs - i + 1) - Math.log(i);
  let power = 0;
  for (let i = k; i <= pairs; i += 1) {
    if (i > k) logCoefficient += Math.log(pairs - i + 1) - Math.log(i);
    const missed = pairs - i;
    const missedTerm = missed === 0 ? 0 : missed * Math.log1p(-winRate);
    power += Math.exp(logCoefficient + i * Math.log(winRate) + missedTerm);
  }
  return power;
}

/**
 * Exact power of the one-sided sign test that keeps only when the tail
 * P(X >= W | pairs, 1/2) falls strictly below alpha. The critical count is
 * exact; the power is summed in log space for large pair counts.
 *
 * @param {number} pairs Decided pairs the test sees.
 * @param {number} winRate Probability the arm wins a decided pair.
 * @param {number} [alpha] Tail level the keep rule demands.
 * @returns {number} Power in [0, 1], or 0 when no critical count exists.
 */
export function signTestPower(pairs, winRate, alpha = 0.05) {
  return powerAtCount(pairs, criticalCount(pairs, alpha), winRate);
}

/**
 * Smallest decided-pair count whose sign-test power reaches the target.
 *
 * The pair count is walked one step at a time so the exact critical count
 * carries over instead of being searched again at every count. Adding a flip
 * leaves each longer sequence's head count alone or raises it by one, so the
 * upper tail obeys S(n + 1, k) = 2 * S(n, k) + C(n, k - 1). S, C(n, k - 1)
 * and C(n, k) stay exact BigInts, each step costs one recurrence and two
 * ratio updates, and the alpha test stays the same integer comparison. A win
 * rate at or below even odds never clears the 0.05 tail level itself, so a
 * target at or above that level returns before the scan can spend the cap; a
 * lower target still scans.
 *
 * @param {number} winRate Probability the arm wins a decided pair.
 * @param {number} [target] Power the plan wants to reach.
 * @param {number} [cap] Largest count worth checking.
 * @returns {number | null} The count, or null when the cap is spent first.
 */
export function pairsForPower(winRate, target = 0.8, cap = 20000) {
  if (winRate <= 0.5 && target >= 0.05) return null;
  let critical = 1;
  let tail = 1n; // S(pairs, critical)
  let below = 1n; // C(pairs, critical - 1)
  let at = 1n; // C(pairs, critical)
  let denominator = 2n; // 2^pairs
  for (let pairs = 1; pairs <= cap; pairs += 1) {
    while (!tailBelowAlpha(tail, denominator, 0.05)) {
      tail -= at;
      below = at;
      at = (at * BigInt(pairs - critical)) / BigInt(critical + 1);
      critical += 1;
    }
    if (powerAtCount(pairs, critical, winRate) >= target) return pairs;
    const nextTail = 2n * tail + below;
    const nextAt = at + below;
    below = (below * BigInt(pairs + 1)) / BigInt(pairs - critical + 2);
    at = nextAt;
    tail = nextTail;
    denominator *= 2n;
  }
  return null;
}

/**
 * Smallest win rate whose sign-test power reaches the target at this pair
 * count, found by bisection over [0.5, 1].
 *
 * @param {number} pairs Decided pairs the test sees.
 * @param {number} [target] Power the plan wants to reach.
 * @returns {number | null} The win rate, or null when even a perfect arm falls short.
 */
export function minimumDetectableWinRate(pairs, target = 0.8) {
  const k = criticalCount(pairs, 0.05);
  if (powerAtCount(pairs, k, 1) < target) return null;
  let lower = 0.5;
  let upper = 1;
  for (let round = 0; round < 60; round += 1) {
    const middle = (lower + upper) / 2;
    if (powerAtCount(pairs, k, middle) >= target) upper = middle;
    else lower = middle;
  }
  return upper;
}

/**
 * Render the sign-test power line for one arm.
 *
 * @param {string} name Arm name.
 * @param {{ pairs: number, winRate: number | null }} measurement Decided pairs and win rate, winRate null when none were decided.
 * @returns {string} The report line.
 */
export function powerLine(name, { pairs, winRate }) {
  const power = winRate === null ? null : signTestPower(pairs, winRate);
  const powerText = power === null ? 'none' : power.toFixed(4);
  const winRateText = winRate === null ? 'none' : winRate.toFixed(4);
  const pairsForEighty = winRate === null ? null : pairsForPower(winRate);
  const mde = minimumDetectableWinRate(pairs);
  return `power ${name}: pairs=${pairs} win_rate=${winRateText} power=${powerText}`
    + ` pairs_for_80=${pairsForEighty ?? 'none'} mde_win_rate=${mde === null ? 'none' : mde.toFixed(4)}`;
}

/**
 * Render the strongest-policy line for one arm.
 *
 * @param {string} name Arm name.
 * @param {number} jevRight Right count of the arm under test.
 * @param {{ pass: boolean, name: string | null, right: number }} bar Bar the arm faced.
 * @returns {string} The report line.
 */
export function strongestPolicyLine(name, jevRight, bar) {
  return `strongest policy ${name}: policy=${bar.name ?? 'none'} right=${bar.right}`
    + ` jev=${jevRight} pass=${bar.pass ? 'yes' : 'no'}`;
}

/**
 * Render the class-floor lines for one arm: one line per class and a final
 * line that names the failing classes, or none.
 *
 * @param {string} name Arm name.
 * @param {{ pass: boolean, classes: Array<{ cls: string, n: number, jev: number, baseline: number }>, failing: string[] }} floor Class floor.
 * @returns {string[]} The report lines.
 */
export function classFloorLines(name, floor) {
  const lines = floor.classes.map(
    (counts) => `class floor ${name} ${counts.cls}: n=${counts.n} jev=${counts.jev} baseline=${counts.baseline}`,
  );
  lines.push(`class floor ${name}: failing=${floor.failing.join(',') || 'none'}`);
  return lines;
}

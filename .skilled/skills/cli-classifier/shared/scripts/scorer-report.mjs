// ───────────────────────────────────────────────────────────────────
// MODULE: Classifier Scorer Report
// ───────────────────────────────────────────────────────────────────
// Shared report pieces for the classifier scorers: the row-set pin, the
// out-directory guard, the probability-aware pick, the decided subset, the
// margin slack line and the cluster bootstrap. The scorers that report these
// pieces import this one copy, so their digests and lines read alike.
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

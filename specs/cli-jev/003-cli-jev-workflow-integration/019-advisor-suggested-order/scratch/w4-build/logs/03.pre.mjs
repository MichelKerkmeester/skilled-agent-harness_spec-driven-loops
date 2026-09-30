#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// MODULE: Suggested Cluster Order Eval
// ───────────────────────────────────────────────────────────────
//
// Measures, offline, whether a Jev or local Deem answer that orders the advisor's
// whole near-tie cluster beats the best zero-call order, with each call timed
// inside a child spawned the way the prompt shim spawns the advisor. The default
// run makes no model call. The script holds no credential and reads none.

import { alwaysSecondOrder, binomTail, confidenceOrder, reciprocalRank, reorderSlots } from './score-jev-tiebreak.mjs';

export const ALPHA = 0.05;
export const MARGIN = 0.05;
export const ADVISOR_BUDGET_MS = 2200;
export const CHILD_TIMEOUT_MS = 2500;
export const MIN_MOVABLE = 5;
const CHOICE_QUESTION = 'Which skill should handle this request?';
const NONE_DESCRIPTION = 'None of these skills fits the request';
const PASSES = 3;

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

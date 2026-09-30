#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// MODULE: Jev and Deem Tie-Break Eval
// ───────────────────────────────────────────────────────────────
//
// Measures, offline, whether a Jev or local Deem choice inside the advisor's
// near-tie cluster beats the scorer's own order. The default run is a census
// that makes no model call. The script holds no credential and reads none.

import { spawn, spawnSync } from 'node:child_process';
import { accessSync, appendFileSync, constants, mkdirSync, mkdtempSync, readFileSync, realpathSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { delimiter, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

export const ALPHA = 0.05;
export const POWER = 0.8;
const JEV_VERSION = 'jev 0.6.2';
const PASSES = 3;
const CHOICE_QUESTION = 'Which skill should handle this request?';
const NONE_DESCRIPTION = 'None of these skills fits the request';
const NOUL_QUESTION = 'Does this request require writing a file?';
const ARCHIVED_F1 = 0.9843;

const HERE = dirname(fileURLToPath(import.meta.url));
const DEEM_MODEL = 'deem-0.8-v1';
const DEEM_MAX_KEYS = 25;
const DEEM_P50_MS = 65.6;
const HEALTH_TIMEOUT_MS = 10000;
const REPO_CLI_DEEM = resolve(HERE, '../../../../cli-classifier/cli-deem/scripts/cli-deem.mjs');
const DIST = resolve(HERE, '../../dist/runtime');
const SENTINEL = '.skilled/skills/system-spec-kit/SKILL.md';
const CORPORA = { labeled: ['labeled-prompts.jsonl', 195], holdout: ['holdout-prompts.jsonl', 70], ambiguity: ['ambiguity-prompts.jsonl', 24] };

/**
 * Binomial coefficient C(n, i) by the multiplicative product, in floating point.
 * @param {number} n
 * @param {number} i
 * @returns {number}
 */
function choose(n, i) {
  let coefficient = 1;
  for (let j = 1; j <= i; j += 1) {
    coefficient = (coefficient * (n - i + j)) / j;
  }
  return coefficient;
}

/**
 * Chance of at least k successes in n trials at success probability p.
 * @param {number} n
 * @param {number} k
 * @param {number} [p=0.5]
 * @returns {number}
 */
export function binomTail(n, k, p = 0.5) {
  if (k <= 0) return 1;
  if (k > n) return 0;
  let sum = 0;
  for (let i = k; i <= n; i += 1) {
    sum += choose(n, i) * p ** i * (1 - p) ** (n - i);
  }
  return sum;
}

/**
 * Smallest win count whose one-sided tail is at most ALPHA, or null when n is too small.
 * @param {number} n
 * @returns {number|null}
 */
export function minWins(n) {
  for (let k = 0; k <= n; k += 1) {
    if (binomTail(n, k) <= ALPHA) return k;
  }
  return null;
}

/**
 * Smallest success probability at which the minimum win count still has power POWER.
 * Sixty bisection steps on [0.5, 1]; the upper end is the rate that still clears the target.
 * @param {number} n
 * @returns {number|null}
 */
export function winRate80(n) {
  const wins = minWins(n);
  if (wins === null) return null;
  let low = 0.5;
  let high = 1;
  for (let step = 0; step < 60; step += 1) {
    const mid = (low + high) / 2;
    if (binomTail(n, wins, mid) >= POWER) high = mid;
    else low = mid;
  }
  return high;
}

/**
 * Reciprocal of the first 1-based position where the gold matches, else 0.
 * @param {string[]} order
 * @param {string} gold
 * @param {(candidate: string, gold: string) => boolean} isMatch
 * @returns {number}
 */
export function reciprocalRank(order, gold, isMatch) {
  for (let i = 0; i < order.length; i += 1) {
    if (isMatch(order[i], gold)) return 1 / (i + 1);
  }
  return 0;
}

/**
 * Mean reciprocal rank, rounded to 4 decimal places, plus top-1 and top-3 hit counts.
 * @param {Array<{ gold: string }>} rows
 * @param {(row: { gold: string }) => string[]} orderFor
 * @param {(candidate: string, gold: string) => boolean} isMatch
 * @returns {{ n: number, mrr: number, right1: number, right3: number }}
 */
export function rankMetrics(rows, orderFor, isMatch) {
  const n = rows.length;
  if (n === 0) return { n: 0, mrr: 0, right1: 0, right3: 0 };
  let reciprocalSum = 0;
  let right1 = 0;
  let right3 = 0;
  for (const row of rows) {
    const order = orderFor(row);
    reciprocalSum += reciprocalRank(order, row.gold, isMatch);
    if (order.slice(0, 1).some((skill) => isMatch(skill, row.gold))) right1 += 1;
    if (order.slice(0, 3).some((skill) => isMatch(skill, row.gold))) right3 += 1;
  }
  return { n, mrr: Number((reciprocalSum / n).toFixed(4)), right1, right3 };
}

/**
 * Accuracy, F1, Brier, five-bin calibration error, and the temperature with the
 * lowest negative log likelihood. A probability of at least one half predicts
 * yes. An empty list leaves the five scores unset. The temperature search keeps
 * the first tie, because a later step that matches is not a better fit.
 * @param {Array<{ p: number, yes: boolean }>} pairs
 * @returns {{ n: number, accuracy: number|null, f1: number|null, brier: number|null, ece5: number|null, temperature: number|null }}
 */
export function calibrationMetrics(pairs) {
  const n = pairs.length;
  if (n === 0) {
    return { n: 0, accuracy: null, f1: null, brier: null, ece5: null, temperature: null };
  }

  let correct = 0;
  let truePositive = 0;
  let falsePositive = 0;
  let falseNegative = 0;
  let brierSum = 0;
  /** @type {Array<{ count: number, sumP: number, sumY: number }>} */
  const bins = [];
  for (let index = 0; index < 5; index += 1) bins.push({ count: 0, sumP: 0, sumY: 0 });

  for (const pair of pairs) {
    const y = pair.yes ? 1 : 0;
    const predicted = pair.p >= 0.5 ? 1 : 0;
    if (predicted === y) correct += 1;
    if (predicted === 1 && y === 1) truePositive += 1;
    else if (predicted === 1 && y === 0) falsePositive += 1;
    else if (predicted === 0 && y === 1) falseNegative += 1;
    brierSum += (pair.p - y) ** 2;
    const bin = bins[Math.min(4, Math.floor(pair.p * 5))];
    bin.count += 1;
    bin.sumP += pair.p;
    bin.sumY += y;
  }

  const f1Denom = 2 * truePositive + falsePositive + falseNegative;
  const f1 = f1Denom === 0 ? 0 : (2 * truePositive) / f1Denom;
  let ece5 = 0;
  for (const bin of bins) {
    if (bin.count === 0) continue;
    const gap = Math.abs(bin.sumP / bin.count - bin.sumY / bin.count);
    ece5 += (bin.count / n) * gap;
  }

  let temperature = 0.05;
  let bestNll = Infinity;
  for (let i = 5; i <= 1000; i += 1) {
    const candidate = i / 100;
    let logLikelihood = 0;
    for (const pair of pairs) {
      const pc = Math.min(1 - 1e-6, Math.max(1e-6, pair.p));
      const logit = Math.log(pc / (1 - pc));
      const q = 1 / (1 + Math.exp(-logit / candidate));
      const y = pair.yes ? 1 : 0;
      // A zero weight times the other log is NaN, so only the live class is logged.
      logLikelihood += y === 1 ? Math.log(q) : Math.log(1 - q);
    }
    const nll = -logLikelihood;
    if (nll < bestNll) {
      bestNll = nll;
      temperature = candidate;
    }
  }

  return { n, accuracy: correct / n, f1, brier: brierSum / n, ece5, temperature };
}

/**
 * Copy of order whose cluster slots, in ascending position, take newCluster in turn.
 * @param {string[]} order
 * @param {string[]} cluster
 * @param {string[]} newCluster
 * @returns {string[]}
 */
export function reorderSlots(order, cluster, newCluster) {
  const positions = [];
  for (let i = 0; i < order.length; i += 1) {
    if (cluster.includes(order[i])) positions.push(i);
  }
  const next = order.slice();
  for (let j = 0; j < positions.length; j += 1) {
    next[positions[j]] = newCluster[j];
  }
  return next;
}

/**
 * Move pick to the first cluster slot when it belongs to the cluster.
 * @param {string[]} order
 * @param {string[]} cluster
 * @param {string} pick
 * @returns {string[]}
 */
export function movePickFirst(order, cluster, pick) {
  if (!cluster.includes(pick)) return order.slice();
  return reorderSlots(order, cluster, [pick, ...cluster.filter((skill) => skill !== pick)]);
}

/**
 * Whether the gold can be promoted inside a cluster of at least two skills.
 * @param {{ cluster: string[], gold: string }} row
 * @param {(candidate: string, gold: string) => boolean} isMatch
 * @returns {'ineligible'|'gold_first'|'movable'|'gold_outside'}
 */
export function classifyRow(row, isMatch) {
  if (row.cluster.length < 2) return 'ineligible';
  const goldIndex = row.cluster.findIndex((member) => isMatch(member, row.gold));
  if (goldIndex === 0) return 'gold_first';
  if (goldIndex > 0) return 'movable';
  return 'gold_outside';
}

/**
 * Scores the corpora once under the baseline capture's env.
 * @returns {Promise<{ holdoutTop1: { correct: number, total: number }, rows: object[], labels: Array<{ id: string, prompt: string, yes: boolean }>, isMatch: (actual: string|null, goldRaw: string) => boolean, describe: (skill: string) => string }>}
 */
export async function loadCensus() {
  process.env.SYSTEM_SKILL_ADVISOR_DB_DIR = mkdtempSync(join(tmpdir(), 'advisor-jev-tiebreak-'));
  process.env.SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC = '1';
  process.env.SPECKIT_SKILL_ADVISOR_FORCE_LOCAL = '1';
  process.env.PYTHONDONTWRITEBYTECODE = '1';
  // Match the test-harness regime: the semantic-shadow lane substitutes
  // deterministic fixture vectors under the harness flag (real embeddings are not
  // reproducible in CI), so every scorer gate runs this way. The baseline must be
  // captured under the same regime the ratchet re-scores it in.
  process.env.VITEST = 'true';
  delete process.env.SPECKIT_ADVISOR_LANE_WEIGHTS_JSON;
  delete process.env.SPECKIT_ADVISOR_LANE_SHADOW_WEIGHTS_JSON;
  delete process.env.SPECKIT_ADVISOR_BM25_LEXICAL_SHADOW;

  const { scoreAdvisorPrompt } = await import(join(DIST, 'lib/scorer/fusion.js'));
  const { mergedSkillForAlias, skillMatchesAlias } = await import(join(DIST, 'lib/scorer/aliases.js'));
  const { findAdvisorWorkspaceRoot } = await import(join(DIST, 'lib/utils/workspace-root.js'));
  const { loadAdvisorProjection } = await import(join(DIST, 'lib/scorer/projection.js'));

  const workspaceRoot = findAdvisorWorkspaceRoot(HERE, { maxDepth: 14, sentinel: SENTINEL });
  const projection = loadAdvisorProjection(workspaceRoot);

  const corpora = {};
  for (const [name, [file, n]] of Object.entries(CORPORA)) {
    const rows = readFileSync(join(HERE, file), 'utf8').trim().split('\n').filter(Boolean).map((line) => JSON.parse(line));
    if (rows.length !== n) {
      throw new Error(`${file}: expected ${n} rows, got ${rows.length}`);
    }
    corpora[name] = rows;
  }

  function isMatch(actual, goldRaw) {
    const gold = goldRaw === 'none' ? null : goldRaw;
    const expected = gold === null ? null : mergedSkillForAlias(gold);
    const canonical = actual === null ? null : mergedSkillForAlias(actual);
    return canonical === expected
      || (canonical !== null && expected !== null && skillMatchesAlias(canonical, expected));
  }

  function scorePrompt(prompt) {
    return scoreAdvisorPrompt(prompt, { workspaceRoot, projection });
  }

  let correct = 0;
  for (const row of corpora.holdout) {
    if (isMatch(scorePrompt(row.prompt).topSkill, row.skill_top_1)) correct += 1;
  }
  const holdoutTop1 = { correct, total: corpora.holdout.length };

  const tauIds = new Set(corpora.ambiguity.map((row) => String(row.id)));

  const rows = [];
  for (const file of ['labeled', 'holdout']) {
    const kept = corpora[file]
      .filter((row) => row.prompt && String(row.skill_top_1 ?? 'none') !== 'none')
      .sort((left, right) => String(left.id).localeCompare(String(right.id)));
    for (let index = 0; index < kept.length; index += 1) {
      const row = kept[index];
      const split = index % 2 === 0 ? 'train' : 'test';
      const result = scorePrompt(row.prompt);
      const order = result.recommendations.map((r) => r.skill);
      const top = result.recommendations[0];
      const members = new Set(top ? [top.skill, ...(top.ambiguousWith ?? [])] : []);
      rows.push({
        id: String(row.id),
        file,
        split,
        prompt: row.prompt,
        gold: row.skill_top_1,
        goldKey: mergedSkillForAlias(row.skill_top_1),
        order,
        cluster: order.filter((s) => members.has(s)),
        confidence: Object.fromEntries(result.recommendations.map((r) => [r.skill, r.confidence])),
        score: Object.fromEntries(result.recommendations.map((r) => [r.skill, r.score])),
        tau03: tauIds.has(String(row.id)),
      });
    }
  }

  const labels = corpora.labeled.map((row) => ({
    id: String(row.id),
    prompt: row.prompt,
    yes: row.gate3_triggers === 'yes',
  }));

  function describe(skill) {
    const entry = projection.skills.find((item) => item.id === skill);
    return entry ? entry.description : '';
  }

  return { holdoutTop1, rows, labels, isMatch, describe };
}

/**
 * Order with cluster slots filled by confidence, highest first; ties keep cluster order.
 * @param {{ order: string[], cluster: string[], confidence: Record<string, number> }} row
 * @returns {string[]}
 */
export function confidenceOrder(row) {
  const newCluster = row.cluster.slice().sort((left, right) => row.confidence[right] - row.confidence[left]);
  return reorderSlots(row.order, row.cluster, newCluster);
}

/**
 * Order with the cluster's second member moved to the first cluster slot.
 * @param {{ order: string[], cluster: string[] }} row
 * @returns {string[]}
 */
export function alwaysSecondOrder(row) {
  return movePickFirst(row.order, row.cluster, row.cluster[1]);
}

/**
 * Leading-match and miss counts keyed by gold.
 * @param {Array<{ goldKey: string, order: string[], gold: string }>} rows
 * @param {(candidate: string|null, gold: string) => boolean} isMatch
 * @returns {Map<string, { success: number, failure: number }>}
 */
export function buildFold(rows, isMatch) {
  const fold = new Map();
  for (const row of rows) {
    const counts = fold.get(row.goldKey) ?? { success: 0, failure: 0 };
    if (isMatch(row.order[0] ?? null, row.gold)) counts.success += 1;
    else counts.failure += 1;
    fold.set(row.goldKey, counts);
  }
  return fold;
}

// The scorer no longer ships the outcome-weighted rerank, so its blend lives
// here: fused score times a Beta(1, 1) posterior over train-half outcomes.
/**
 * Order sorted by fused score times train-half reliability, ties by skill id.
 * @param {{ order: string[], score: Record<string, number> }} row
 * @param {Map<string, { success: number, failure: number }>} fold
 * @returns {string[]}
 */
export function rerankOrder(row, fold) {
  function reliability(skill) {
    const counts = fold.get(skill);
    if (!counts || counts.success + counts.failure === 0) return 0.5;
    return (1 + counts.success) / (2 + counts.success + counts.failure);
  }

  function shadow(skill) {
    return Math.round(row.score[skill] * reliability(skill) * 1e6) / 1e6;
  }

  return row.order.slice().sort((left, right) => {
    const delta = shadow(right) - shadow(left);
    if (delta !== 0) return delta;
    return left.localeCompare(right);
  });
}

/**
 * Offline census report: one line per file and split, then the frozen holdout
 * top-1, the scorer's rank on eligible rows, and whether the movable count can
 * power a comparison. Prints nothing. A holdout top-1 other than 53/70 voids
 * the comparison and stops the report.
 * @param {{ holdoutTop1: { correct: number, total: number }, rows: Array<{ file: string, split: string, gold: string, order: string[], cluster: string[], tau03: boolean }>, isMatch: (candidate: string, gold: string) => boolean }} census
 * @returns {{ lines: string[], voided: boolean, eligible: number, movable: number, headroom: 'none'|'underpowered'|'ok' }}
 */
export function summarizeCensus(census) {
  const { isMatch } = census;
  const eligibleRows = census.rows.filter((row) => classifyRow(row, isMatch) !== 'ineligible');
  const eligible = eligibleRows.length;

  /**
   * @param {string} key
   * @param {string} name
   * @param {Array<{ gold: string, order: string[], cluster: string[], tau03: boolean }>} rows
   * @returns {string}
   */
  function groupLine(key, name, rows) {
    let eligibleCount = 0;
    let movableCount = 0;
    let goldFirst = 0;
    let goldOutside = 0;
    let goldTop3 = 0;
    let tau03 = 0;
    let over25 = 0;
    for (const row of rows) {
      const kind = classifyRow(row, isMatch);
      if (kind !== 'ineligible') eligibleCount += 1;
      if (kind === 'movable') movableCount += 1;
      if (kind === 'gold_first') goldFirst += 1;
      if (kind === 'gold_outside') goldOutside += 1;
      if (row.order.slice(0, 3).some((skill) => isMatch(skill, row.gold))) goldTop3 += 1;
      if (kind !== 'ineligible' && row.tau03) tau03 += 1;
      if (kind !== 'ineligible' && row.cluster.length > 25) over25 += 1;
    }
    return `census: ${key}=${name} rows=${rows.length} eligible=${eligibleCount} movable=${movableCount} gold_first=${goldFirst} gold_outside=${goldOutside} gold_top3=${goldTop3} tau03=${tau03} over25=${over25}`;
  }

  const lines = [
    groupLine('file', 'labeled', census.rows.filter((row) => row.file === 'labeled')),
    groupLine('file', 'holdout', census.rows.filter((row) => row.file === 'holdout')),
    groupLine('split', 'train', census.rows.filter((row) => row.split === 'train')),
    groupLine('split', 'test', census.rows.filter((row) => row.split === 'test')),
  ];

  let movable = 0;
  let goldFirst = 0;
  for (const row of census.rows) {
    const kind = classifyRow(row, isMatch);
    if (kind === 'movable') movable += 1;
    if (kind === 'gold_first') goldFirst += 1;
  }
  const headroom = movable === 0 ? 'none' : movable <= 4 ? 'underpowered' : 'ok';

  const baseline = `${census.holdoutTop1.correct}/${census.holdoutTop1.total}`;
  lines.push(`baseline: holdout_top1=${baseline}`);
  if (baseline !== '53/70') {
    lines.push('baseline mismatch: comparison void');
    return { lines, voided: true, eligible, movable, headroom };
  }

  const metrics = rankMetrics(eligibleRows, (row) => row.order, isMatch);
  lines.push(`comparator: name=scorer rows=${eligible} mrr=${metrics.mrr.toFixed(4)} right1=${metrics.right1} right3=${metrics.right3}`);

  const confidenceMetrics = rankMetrics(eligibleRows, confidenceOrder, isMatch);
  lines.push(`comparator: name=confidence rows=${eligible} mrr=${confidenceMetrics.mrr.toFixed(4)} right1=${confidenceMetrics.right1} right3=${confidenceMetrics.right3}`);

  const alwaysSecondMetrics = rankMetrics(eligibleRows, alwaysSecondOrder, isMatch);
  lines.push(`comparator: name=always_second rows=${eligible} mrr=${alwaysSecondMetrics.mrr.toFixed(4)} right1=${alwaysSecondMetrics.right1} right3=${alwaysSecondMetrics.right3}`);

  const fold = buildFold(census.rows.filter((row) => row.split === 'train'), isMatch);
  const testRows = eligibleRows.filter((row) => row.split === 'test');
  const rerankMetrics = rankMetrics(testRows, (row) => rerankOrder(row, fold), isMatch);
  lines.push(`comparator: name=rerank rows=${testRows.length} mrr=${rerankMetrics.mrr.toFixed(4)} right1=${rerankMetrics.right1} right3=${rerankMetrics.right3}`);

  const wins = minWins(movable);
  const rate = winRate80(movable);
  lines.push(`power: movable=${movable} decided_ceiling=${movable + goldFirst} min_wins=${wins ?? 'none'} win_rate_80=${rate?.toFixed(3) ?? 'none'}`);

  if (headroom === 'none') lines.push('no headroom');
  if (headroom === 'underpowered') lines.push('underpowered');

  return { lines, voided: false, eligible, movable, headroom };
}

/**
 * Score one backend column and apply the keep rule.
 * A row counts only when it has three string answers. The answer named at
 * least twice moves to the first cluster slot; a split with no such answer
 * stays on the scorer order, and an answer of none abstains. A higher
 * reciprocal rank than the scorer order is a win, a lower one a loss, and an
 * equal rank after a real pick is a tie. The verdict is the first rule that
 * applies: underpowered below five decided rows, kill when the loss tail is
 * at most ALPHA, keep when every condition holds, otherwise inconclusive.
 * Latency uses the nearest rank of every call's wall time.
 * @param {string} backend
 * @param {Array<{ id: string, order: string[], cluster: string[], gold: string, goldKey: string, split: string, tau03: boolean, confidence: Record<string, number>, score: Record<string, number> }>} rows - Eligible rows.
 * @param {Record<string, Array<{ answer: string|null, wallMs: number }>>} recordsByRow - Up to three call records per row id.
 * @param {{ rows: Array<{ split: string, goldKey: string, order: string[], gold: string }>, isMatch: (candidate: string, gold: string) => boolean }} census
 * @returns {{ backend: string, rows: number, measured: number, unmeasured: number, wins: number, losses: number, ties: number, abstentions: number, unstable: number, decided: number, movableWins: number, goldDemotions: number, noneOnGoldInCluster: number, tau03: { insideWins: number, insideLosses: number, outsideWins: number, outsideLosses: number }, flip: number, pWin: number, pLoss: number, latency: { p50: number|null, p95: number|null }, metrics: { column: { n: number, mrr: number, right1: number, right3: number }, scorer: { n: number, mrr: number, right1: number, right3: number }, confidence: { n: number, mrr: number, right1: number, right3: number }, alwaysSecond: { n: number, mrr: number, right1: number, right3: number }, heldColumn: { n: number, mrr: number, right1: number, right3: number }, heldRerank: { n: number, mrr: number, right1: number, right3: number } }, conditions: { sign: { value: number, held: boolean }, mrr: { value: number, held: boolean }, right3: { value: number, held: boolean }, flip: { value: number, held: boolean } }, verdict: 'underpowered'|'kill'|'keep'|'inconclusive' }}
 */
export function summarizeColumn(backend, rows, recordsByRow, census) {
  const { isMatch } = census;
  let measured = 0;
  let unmeasured = 0;
  let flips = 0;
  let wins = 0;
  let losses = 0;
  let ties = 0;
  let abstentions = 0;
  let unstable = 0;
  let movableWins = 0;
  let goldDemotions = 0;
  let noneOnGoldInCluster = 0;
  let insideWins = 0;
  let insideLosses = 0;
  let outsideWins = 0;
  let outsideLosses = 0;
  /** @type {Array<object>} */
  const compared = [];
  /** @type {number[]} */
  const wallTimes = [];

  for (const row of rows) {
    const records = recordsByRow[row.id] ?? [];
    for (const record of records) wallTimes.push(record.wallMs);
    const answers = records.map((record) => record.answer);
    if (answers.length !== 3 || answers.some((answer) => typeof answer !== 'string')) {
      unmeasured += 1;
      continue;
    }
    measured += 1;

    /** @type {Map<string, number>} */
    const counts = new Map();
    for (const answer of answers) counts.set(answer, (counts.get(answer) ?? 0) + 1);
    let maxFreq = 0;
    let pick = null;
    for (const [answer, count] of counts) {
      if (count > maxFreq) maxFreq = count;
      if (count >= 2) pick = answer;
    }
    flips += 3 - maxFreq;

    const kind = classifyRow(row, isMatch);
    let colOrder;
    if (pick === null) {
      unstable += 1;
      colOrder = row.order;
    } else if (pick === 'none') {
      abstentions += 1;
      colOrder = row.order;
      if (kind === 'movable' || kind === 'gold_first') noneOnGoldInCluster += 1;
    } else {
      colOrder = movePickFirst(row.order, row.cluster, pick);
    }

    const rc = reciprocalRank(colOrder, row.gold, isMatch);
    const rs = reciprocalRank(row.order, row.gold, isMatch);
    if (rc > rs) {
      wins += 1;
      if (kind === 'movable') movableWins += 1;
      if (row.tau03) insideWins += 1;
      else outsideWins += 1;
    } else if (rc < rs) {
      losses += 1;
      if (kind === 'gold_first') goldDemotions += 1;
      if (row.tau03) insideLosses += 1;
      else outsideLosses += 1;
    } else if (pick !== null && pick !== 'none') {
      ties += 1;
    }

    compared.push({ ...row, colOrder });
  }

  const column = rankMetrics(compared, (row) => row.colOrder, isMatch);
  const scorer = rankMetrics(compared, (row) => row.order, isMatch);
  const confidence = rankMetrics(compared, confidenceOrder, isMatch);
  const alwaysSecond = rankMetrics(compared, alwaysSecondOrder, isMatch);
  const fold = buildFold(census.rows.filter((row) => row.split === 'train'), isMatch);
  const held = compared.filter((row) => row.split === 'test');
  const heldColumn = rankMetrics(held, (row) => row.colOrder, isMatch);
  const heldRerank = rankMetrics(held, (row) => rerankOrder(row, fold), isMatch);

  const flip = measured === 0 ? 0 : flips / (3 * measured);
  const decided = wins + losses;
  const pWin = binomTail(decided, wins);
  const pLoss = binomTail(decided, losses);

  wallTimes.sort((left, right) => left - right);
  const nearest = (q) => (wallTimes.length === 0 ? null : wallTimes[Math.ceil(q * wallTimes.length) - 1]);

  const conditions = {
    sign: { value: pWin, held: pWin <= ALPHA },
    mrr: {
      value: column.mrr,
      held: column.mrr > confidence.mrr
        && column.mrr > alwaysSecond.mrr
        && held.length > 0
        && heldColumn.mrr > heldRerank.mrr,
    },
    right3: { value: column.right3, held: column.right3 >= scorer.right3 },
    flip: { value: flip, held: flip <= 0.1 },
  };

  let verdict = 'inconclusive';
  if (decided < 5) verdict = 'underpowered';
  else if (pLoss <= ALPHA) verdict = 'kill';
  else if (conditions.sign.held && conditions.mrr.held && conditions.right3.held && conditions.flip.held) {
    verdict = 'keep';
  }

  return {
    backend,
    rows: rows.length,
    measured,
    unmeasured,
    wins,
    losses,
    ties,
    abstentions,
    unstable,
    decided,
    movableWins,
    goldDemotions,
    noneOnGoldInCluster,
    tau03: { insideWins, insideLosses, outsideWins, outsideLosses },
    flip,
    pWin,
    pLoss,
    latency: { p50: nearest(0.5), p95: nearest(0.95) },
    metrics: { column, scorer, confidence, alwaysSecond, heldColumn, heldRerank },
    conditions,
    verdict,
  };
}

/**
 * Five stdout lines for one scored column.
 * Probabilities, the flip rate, and every mean reciprocal rank print to four
 * decimals. Latency prints as a whole number of milliseconds, or none when
 * that rank was not measured.
 * @param {object} s - Summary from summarizeColumn.
 * @returns {string[]}
 */
export function columnLines(s) {
  const b = s.backend;
  const { column, scorer, confidence, alwaysSecond, heldColumn, heldRerank } = s.metrics;
  const { insideWins, insideLosses, outsideWins, outsideLosses } = s.tau03;
  const ms = (value) => (value === null ? 'none' : Math.round(value));
  return [
    `column: backend=${b} rows=${s.rows} measured=${s.measured} wins=${s.wins} losses=${s.losses} ties=${s.ties} abstentions=${s.abstentions} unmeasured=${s.unmeasured} unstable=${s.unstable}`,
    `column: backend=${b} movable_wins=${s.movableWins} gold_demotions=${s.goldDemotions} none_on_gold_in_cluster=${s.noneOnGoldInCluster} p_win=${s.pWin.toFixed(4)} p_loss=${s.pLoss.toFixed(4)} flip=${s.flip.toFixed(4)}`,
    `column: backend=${b} tau03_inside_wins=${insideWins} tau03_inside_losses=${insideLosses} tau03_outside_wins=${outsideWins} tau03_outside_losses=${outsideLosses}`,
    `column: backend=${b} mrr=${column.mrr.toFixed(4)} right1=${column.right1} right3=${column.right3} scorer_mrr=${scorer.mrr.toFixed(4)} confidence_mrr=${confidence.mrr.toFixed(4)} always_second_mrr=${alwaysSecond.mrr.toFixed(4)} heldout_mrr=${heldColumn.mrr.toFixed(4)} rerank_mrr=${heldRerank.mrr.toFixed(4)}`,
    `column: backend=${b} latency_p50_ms=${ms(s.latency.p50)} latency_p95_ms=${ms(s.latency.p95)}`,
  ];
}

/**
 * Verdict line for one scored column.
 * A non-empty extra string is appended after one space.
 * @param {object} s - Summary from summarizeColumn.
 * @param {string} extra - Trailing fields, omitted when empty.
 * @returns {string}
 */
export function verdictLine(s, extra) {
  const line = `verdict: ${s.verdict} backend=${s.backend} decided=${s.decided} wins=${s.wins} losses=${s.losses} p_win=${s.pWin.toFixed(4)} p_loss=${s.pLoss.toFixed(4)} flip=${s.flip.toFixed(4)}`;
  if (typeof extra === 'string' && extra !== '') return `${line} ${extra}`;
  return line;
}

/**
 * One bounded child process. Resolves exactly once with the exit code, the
 * collected output, the wall time, and whether the timeout fired.
 * The timer kills the child and resolves at once, without waiting for close:
 * a grandchild can hold the pipes open past the kill. Stdin is closed after
 * the write because the jev CLI reads stdin to EOF and exits 2 on an
 * inherited terminal. A spawn error is code 127 with the message as stderr.
 * @param {string} file
 * @param {string[]} args
 * @param {string} stdinText
 * @param {Record<string, string | undefined>} env
 * @param {number} timeoutMs
 * @returns {Promise<{ code: number|null, stdout: string, stderr: string, wallMs: number, timedOut: boolean }>}
 */
export function spawnCall(file, args, stdinText, env, timeoutMs) {
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
 * Append one call record as a JSON line to calls.jsonl under outDir.
 * A missing or empty outDir means the run keeps no records, so nothing is
 * created. One line per call keeps a killed arm's earlier records readable.
 * @param {string|undefined} outDir
 * @param {object} record
 * @returns {void}
 */
export function writeCall(outDir, record) {
  if (typeof outDir === 'string' && outDir !== '') {
    mkdirSync(outDir, { recursive: true });
    appendFileSync(join(outDir, 'calls.jsonl'), `${JSON.stringify(record)}\n`);
  }
}

/**
 * Choice arm over every eligible row, three times.
 * The payload line is printed before the credential check, so the cost is
 * visible before the first call that can spend. Exit 4 waits out the backoff
 * and tries once more. Exit 2, exit 3, and exit 130 stop the arm and report
 * how many rows finished. A spawn that hits the timeout is recorded and the
 * row continues.
 * @param {{ rows: Array<{ id: string, prompt: string, cluster: string[], gold: string }>, isMatch: (candidate: string, gold: string) => boolean, describe: (skill: string) => string }} census
 * @param {{ path: string, provider: string }} gate - Passed gate: executable path and provider.
 * @param {{ out: (line: string) => void, env: Record<string, string | undefined>, timeoutMs: number, backoffMs: number, outDir?: string }} ctx
 * @returns {Promise<object | { stopped: string }>}
 */
export async function runJevArm(census, gate, ctx) {
  const { out, env, timeoutMs, backoffMs, outDir } = ctx;
  const rows = census.rows.filter((row) => classifyRow(row, census.isMatch) !== 'ineligible');
  const provider = gate.provider;
  let model = 'unknown';

  let chars = 0;
  for (const row of rows) {
    let optionChars = 5 + NONE_DESCRIPTION.length;
    for (const skill of row.cluster) {
      optionChars += skill.length + census.describe(skill).length + 1;
    }
    chars += row.prompt.length + CHOICE_QUESTION.length + optionChars;
  }
  chars *= PASSES;
  out(`jev: payload=routing corpus prompts and skill projection descriptions planned_calls=${rows.length * PASSES + 1} est_input_tokens=${Math.ceil(chars / 4)}`);

  /**
   * @param {string[]} args
   * @param {string} text
   * @returns {Promise<{ code: number|null, stdout: string, stderr: string, wallMs: number, timedOut: boolean }>}
   */
  async function call(args, text) {
    let result = await spawnCall(gate.path, args, text, env, timeoutMs);
    if (result.code === 4) {
      await new Promise((done) => { setTimeout(done, backoffMs); });
      result = await spawnCall(gate.path, args, text, env, timeoutMs);
    }
    return result;
  }

  /**
   * @param {{ code: number|null, wallMs: number }} result
   * @param {{ kind: string, row_id: string|null, pass: number|null, answer: string|null, pick_prob: number|null, none_prob: number|null, status: string }} fields
   * @returns {void}
   */
  function record(result, fields) {
    writeCall(outDir, {
      kind: fields.kind,
      row_id: fields.row_id,
      pass: fields.pass,
      wall_ms: result.wallMs,
      exit_code: result.code,
      jev_version: JEV_VERSION,
      provider,
      model,
      answer: fields.answer,
      pick_prob: fields.pick_prob,
      none_prob: fields.none_prob,
      status: fields.status,
    });
  }

  /**
   * @param {string} line
   * @param {number} finished
   * @returns {{ stopped: string }}
   */
  function stop(line, finished) {
    out(line);
    out(`jev: partial_rows=${finished}`);
    return { stopped: line };
  }

  const auth = await call(['auth', 'test', '--provider', provider], '');
  if (auth.code === 0) {
    try {
      model = JSON.parse(auth.stdout).model;
    } catch {
      // A non-JSON body leaves the model unknown.
    }
  }
  record(auth, {
    kind: 'auth_test',
    row_id: null,
    pass: null,
    answer: null,
    pick_prob: null,
    none_prob: null,
    status: auth.code === 0 ? 'measured' : 'unmeasured',
  });
  if (auth.code === 3) return stop('jev arm stopped: key rejected', 0);
  if (auth.code === 130) return stop('jev arm stopped: interrupted', 0);
  if (auth.code !== 0) return stop('jev arm stopped: auth test failed', 0);
  out(`jev: auth_test provider=${provider} model=${model}`);

  /** @type {Record<string, Array<{ answer: string|null, wallMs: number }>>} */
  const records = {};
  let finished = 0;
  for (const row of rows) {
    records[row.id] = [];
    for (let pass = 1; pass <= PASSES; pass += 1) {
      const args = ['choice', '--provider', provider, '-q', CHOICE_QUESTION];
      for (const skill of row.cluster) {
        args.push('-o', `${skill}=${census.describe(skill)}`);
      }
      args.push('-o', `none=${NONE_DESCRIPTION}`);
      const result = await call(args, row.prompt);

      let answer = null;
      let pickProb = null;
      let noneProb = null;
      let status = 'unmeasured';
      if (result.timedOut) {
        status = 'unmeasured_timeout';
        answer = null;
      } else if (result.code === 0) {
        /** @type {any} */
        let parsed;
        try {
          parsed = JSON.parse(result.stdout);
        } catch {
          // Unparseable stdout is an unmeasured call.
          parsed = undefined;
        }
        const choice = parsed?.answers?.answer?.choice;
        if (choice === 'none' || row.cluster.includes(choice)) {
          answer = choice;
          status = choice === 'none' ? 'abstained' : 'measured';
          const probabilities = parsed?.answers?.answer?.probabilities;
          pickProb = probabilities?.[choice] ?? null;
          noneProb = probabilities?.none ?? null;
          model = parsed.model ?? model;
        } else {
          answer = null;
          status = 'unmeasured';
        }
      } else if (result.code === 2) {
        return stop('jev arm stopped: usage error', finished);
      } else if (result.code === 3) {
        return stop('jev arm stopped: key rejected', finished);
      } else if (result.code === 130) {
        return stop('jev arm stopped: interrupted', finished);
      } else {
        answer = null;
        status = 'unmeasured';
      }

      record(result, {
        kind: 'choice',
        row_id: row.id,
        pass,
        answer,
        pick_prob: pickProb,
        none_prob: noneProb,
        status,
      });
      records[row.id].push({ answer, wallMs: result.wallMs });
    }
    finished += 1;
  }

  const summary = summarizeColumn('jev', rows, records, census);
  for (const line of columnLines(summary)) out(line);
  out(verdictLine(summary, `provider=${provider} model=${model}`));
  return summary;
}

/**
 * Choice arm for rows whose cluster fits the local key cap, three rotations each,
 * then one noul probability for every labeled prompt.
 * The cost line prints before any call, including when headroom blocks the choice
 * calls. The noul pass still runs when that block is skipped. Exit 4 rechecks
 * health. A dead server or a changed commit stops the arm. The same commit tries
 * that call once more. Exit 2, exit 3, and exit 130 stop the arm and report how
 * many finished. Every spawn is recorded before a stop is reported. This arm
 * starts no server and passes no key and no provider flag. Noul probabilities
 * are recorded raw.
 * @param {{ rows: Array<{ id: string, prompt: string, cluster: string[], gold: string }>, labels: Array<{ id: string, prompt: string, yes: boolean }>, isMatch: (candidate: string, gold: string) => boolean, describe: (skill: string) => string }} census
 * @param {{ cmd: string[], model: string, modelCommit: string, sourceCommit: string }} gate - Passed health result: command, model, and the two commits.
 * @param {'none'|'underpowered'|'ok'} headroom
 * @param {{ out: (line: string) => void, env: Record<string, string | undefined>, timeoutMs: number, outDir?: string }} ctx
 * @returns {Promise<{ column: object | undefined, calibration: { measured: number, n: number, accuracy: number|null, f1: number|null, brier: number|null, ece5: number|null, temperature: number|null } } | { stopped: string }>}
 */
export async function runDeemArm(census, gate, headroom, ctx) {
  const { out } = ctx;
  const rows = census.rows.filter((row) => classifyRow(row, census.isMatch) !== 'ineligible');
  const sent = rows.filter((row) => row.cluster.length <= DEEM_MAX_KEYS);
  const over = rows.length - sent.length;
  const choiceCalls = headroom === 'ok' ? sent.length * PASSES : 0;
  const planned = choiceCalls + census.labels.length;
  out(`deem: nothing leaves the machine planned_calls=${planned} est_wall_s=${(planned * DEEM_P50_MS / 1000).toFixed(1)} unmeasured_over25=${over}`);

  /**
   * @param {string} line
   * @param {number} finished
   * @returns {{ stopped: string }}
   */
  function stop(line, finished) {
    out(line);
    out(`deem: partial_rows=${finished}`);
    return { stopped: line };
  }

  /**
   * One spawn. Exit 4 rechecks health before a single retry. The caller records
   * the spawn, so a stop still leaves that call on disk.
   * @param {string[]} args
   * @param {string} text
   * @param {(result: { code: number|null, stdout: string, wallMs: number, timedOut: boolean }) => void} persist
   * @returns {Promise<{ r: { code: number|null, stdout: string, wallMs: number, timedOut: boolean }, stop?: string }>}
   */
  async function deemCall(args, text, persist) {
    let r = await spawnCall(gate.cmd[0], [...gate.cmd.slice(1), ...args], text, ctx.env, ctx.timeoutMs);
    persist(r);
    if (r.code === 4) {
      const h = readDeemHealth(gate.cmd, ctx.env);
      if (!h.ok) return { r, stop: 'deem arm stopped: server gone' };
      if (h.modelCommit !== gate.modelCommit || h.sourceCommit !== gate.sourceCommit) {
        return { r, stop: 'deem arm stopped: model commit changed mid-run' };
      }
      r = await spawnCall(gate.cmd[0], [...gate.cmd.slice(1), ...args], text, ctx.env, ctx.timeoutMs);
      persist(r);
    }
    /** @type {string | undefined} */
    let stopLine;
    if (r.code === 2) stopLine = 'deem arm stopped: usage error';
    else if (r.code === 3) stopLine = 'deem arm stopped: backend refused';
    else if (r.code === 130) stopLine = 'deem arm stopped: interrupted';
    return { r, stop: stopLine };
  }

  /** @type {object | undefined} */
  let column;
  if (headroom === 'ok') {
    /** @type {{ rowId: string, order: number, keys: string[] }} */
    let pending = { rowId: '', order: 0, keys: [] };

    /**
     * @param {{ code: number|null, stdout: string, timedOut: boolean }} result
     * @param {string[]} keys
     * @returns {{ answer: string|null, pickProb: number|null, noneProb: number|null, status: string }}
     */
    function judge(result, keys) {
      let answer = null;
      let pickProb = null;
      let noneProb = null;
      let status = 'unmeasured';
      if (result.timedOut) {
        status = 'unmeasured_timeout';
      } else if (result.code === 0) {
        /** @type {any} */
        let parsed;
        try {
          parsed = JSON.parse(result.stdout);
        } catch {
          // Unparseable stdout is an unmeasured call.
          parsed = undefined;
        }
        const choice = parsed?.answers?.answer?.choice;
        if (keys.includes(choice)) {
          answer = choice;
          status = choice === 'none' ? 'abstained' : 'measured';
          const probabilities = parsed?.answers?.answer?.probabilities;
          pickProb = probabilities?.[choice] ?? null;
          noneProb = probabilities?.none ?? null;
        }
      }
      return { answer, pickProb, noneProb, status };
    }

    /**
     * @param {{ code: number|null, stdout: string, wallMs: number, timedOut: boolean }} result
     * @returns {void}
     */
    function persist(result) {
      const fields = judge(result, pending.keys);
      writeCall(ctx.outDir, {
        kind: 'choice',
        backend: 'deem',
        row_id: pending.rowId,
        order: pending.order,
        wall_ms: result.wallMs,
        exit_code: result.code,
        model: gate.model,
        model_commit: gate.modelCommit,
        source_commit: gate.sourceCommit,
        answer: fields.answer,
        pick_prob: fields.pickProb,
        none_prob: fields.noneProb,
        status: fields.status,
      });
    }

    /** @type {Record<string, Array<{ answer: string|null, wallMs: number }>>} */
    const records = {};
    let finished = 0;
    for (const row of sent) {
      records[row.id] = [];
      const keys = [...row.cluster, 'none'];
      for (let order = 0; order < PASSES; order += 1) {
        const rotated = [...keys.slice(order), ...keys.slice(0, order)];
        const args = ['choice', '-q', CHOICE_QUESTION];
        for (const k of rotated) {
          args.push('-o', `${k}=${k === 'none' ? NONE_DESCRIPTION : census.describe(k)}`);
        }
        pending = { rowId: row.id, order, keys };
        const outcome = await deemCall(args, row.prompt, persist);
        if (outcome.stop) return stop(outcome.stop, finished);
        const fields = judge(outcome.r, keys);
        records[row.id].push({ answer: fields.answer, wallMs: outcome.r.wallMs });
      }
      finished += 1;
    }

    column = summarizeColumn('deem', rows, records, census);
    for (const line of columnLines(column)) out(line);
    out(verdictLine(column, `model=${gate.model} model_commit=${gate.modelCommit} source_commit=${gate.sourceCommit}`));
  }

  /**
   * A missing body, a non-numeric answer, or a value outside [0, 1] is not a
   * measurement. A timed-out spawn is its own status so a hang is not a miss.
   * @param {{ code: number|null, stdout: string, timedOut: boolean }} result
   * @returns {{ p: number|null, status: string }}
   */
  function readNoul(result) {
    if (result.timedOut) return { p: null, status: 'unmeasured_timeout' };
    if (result.code === 0) {
      /** @type {any} */
      let parsed;
      try {
        parsed = JSON.parse(result.stdout);
      } catch {
        // Unparseable stdout is an unmeasured call.
        parsed = undefined;
      }
      const noul = parsed?.answers?.answer?.noul;
      if (typeof noul === 'number' && noul >= 0 && noul <= 1) {
        return { p: noul, status: 'measured' };
      }
    }
    return { p: null, status: 'unmeasured' };
  }

  /** @type {{ id: string }} */
  let noulLabel = { id: '' };

  /**
   * @param {{ code: number|null, stdout: string, wallMs: number, timedOut: boolean }} result
   * @returns {void}
   */
  function persistNoul(result) {
    const fields = readNoul(result);
    writeCall(ctx.outDir, {
      kind: 'noul',
      backend: 'deem',
      row_id: noulLabel.id,
      order: null,
      wall_ms: result.wallMs,
      exit_code: result.code,
      model: gate.model,
      model_commit: gate.modelCommit,
      source_commit: gate.sourceCommit,
      answer: fields.p,
      pick_prob: null,
      none_prob: null,
      status: fields.status,
    });
  }

  /** @type {Array<{ p: number, yes: boolean }>} */
  const pairs = [];
  let labelsDone = 0;
  for (const label of census.labels) {
    noulLabel = label;
    const outcome = await deemCall(['noul', '-q', NOUL_QUESTION], label.prompt, persistNoul);
    if (outcome.stop) return stop(outcome.stop, labelsDone);
    const fields = readNoul(outcome.r);
    if (fields.status === 'measured' && fields.p !== null) {
      pairs.push({ p: fields.p, yes: label.yes });
    }
    labelsDone += 1;
  }

  const m = calibrationMetrics(pairs);
  const f = (v) => (v === null ? 'none' : v.toFixed(4));
  const temperature = m.temperature === null ? 'none' : m.temperature.toFixed(2);
  out(`calibration: backend=deem n=${census.labels.length} measured=${pairs.length} accuracy=${f(m.accuracy)} f1=${f(m.f1)} brier=${f(m.brier)} ece5=${f(m.ece5)} temperature=${temperature} archived_f1=${ARCHIVED_F1}`);
  return { column, calibration: { measured: pairs.length, ...m } };
}

/**
 * First executable file of this name on PATH, or null when none is executable.
 * Empty PATH entries are skipped. A missing path, a directory, or a file that
 * cannot be executed is not a match.
 * @param {string} name
 * @param {{ PATH?: string }} env
 * @returns {string|null}
 */
function which(name, env) {
  for (const dir of (env.PATH ?? '').split(delimiter)) {
    if (dir.length === 0) continue;
    const candidate = join(dir, name);
    try {
      if (statSync(candidate).isFile()) {
        accessSync(candidate, constants.X_OK);
        return candidate;
      }
    } catch {
      continue;
    }
  }
  return null;
}

/**
 * Identity line, then the pinned version and a credential check.
 * A miss prints a skip line and leaves the census text already written.
 * @param {{ out: (line: string) => void, env: Record<string, string | undefined>, timeoutMs: number }} ctx
 * @returns {{ passed: boolean, path: string | null, provider: string }}
 */
export function jevGate(ctx) {
  const provider = ctx.env.JEV_PROVIDER || 'official';
  const path = which('jev', ctx.env);
  ctx.out(`jev: path=${path ?? 'none'} provider=${provider}`);
  if (path === null) {
    ctx.out('jev arm skipped: jev not on PATH');
    return { passed: false, path, provider };
  }

  const opts = {
    env: ctx.env,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout: ctx.timeoutMs,
  };
  const version = spawnSync(path, ['--version'], opts);
  const trimmed = (version.stdout ?? '').trim();
  const found = trimmed === '' ? '' : trimmed.split('\n')[0];
  if (found !== JEV_VERSION) {
    ctx.out('jev arm skipped: version');
    ctx.out(`jev: found=${JSON.stringify(found)} path=${path}`);
    return { passed: false, path, provider };
  }

  const auth = spawnSync(path, ['auth', 'status', '--provider', provider], opts);
  if (auth.status !== 0) {
    ctx.out('jev arm skipped: no credential');
    return { passed: false, path, provider };
  }
  return { passed: true, path, provider };
}

/**
 * cli-deem on PATH when that file is executable, otherwise the repo copy under node.
 * @param {{ PATH?: string }} env
 * @returns {string[]}
 */
export function deemCommand(env) {
  const path = which('cli-deem', env);
  if (path !== null) return [path];
  return [process.execPath, REPO_CLI_DEEM];
}

/**
 * One health check. An unreachable binary, a stub backend, or a wrong model
 * is a failed check the caller prints as a skip.
 * @param {string[]} cmd
 * @param {Record<string, string | undefined>} env
 * @returns {{ ok: true, backend: string, model: string, modelCommit: string, sourceCommit: string } | { ok: false, reason: string, found: unknown }}
 */
export function readDeemHealth(cmd, env) {
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
 * @param {{ out: (line: string) => void, env: Record<string, string | undefined> }} ctx
 * @returns {{ passed: boolean, cmd: string[] }}
 */
export function deemGate(ctx) {
  const cmd = deemCommand(ctx.env);
  const health = readDeemHealth(cmd, ctx.env);
  if (health.ok) {
    ctx.out(`deem: health backend=${health.backend} model=${health.model} model_commit=${health.modelCommit} source_commit=${health.sourceCommit}`);
    return { passed: true, cmd, ...health };
  }
  ctx.out(`deem arm skipped: ${health.reason}`);
  if (health.reason === 'model' || health.reason === 'bad health response') {
    ctx.out(`deem: found=${JSON.stringify(health.found)}`);
  }
  return { passed: false, cmd };
}

/**
 * Prints the offline census. A bad flag returns 2. A voided comparison returns 1.
 * A passing Jev gate runs the choice arm when the movable count has headroom.
 * A passing Deem gate runs the local choice arm.
 * @param {string[]} argv - Arguments after the script path.
 * @param {Object} [deps] - Census, writer, environment, and timeout replacements.
 * @param {Awaited<ReturnType<typeof loadCensus>>} [deps.census] - Pre-scored census. Default loadCensus().
 * @param {(line: string) => void} [deps.out] - Line writer. Default writes the line plus '\n' to stdout.
 * @param {Record<string, string | undefined>} [deps.env] - Default process.env.
 * @param {number} [deps.timeoutMs=90000] - Default 90000.
 * @param {number} [deps.backoffMs=2000] - Wait before the single exit-4 retry. Default 2000.
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
      },
    });
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    return 2;
  }

  const { values } = parsed;
  const out = deps.out ?? ((line) => process.stdout.write(`${line}\n`));
  const env = deps.env ?? process.env;
  const timeoutMs = deps.timeoutMs ?? 90000;
  const backoffMs = deps.backoffMs ?? 2000;
  const census = deps.census ?? await loadCensus();
  const summary = summarizeCensus(census);
  for (const line of summary.lines) out(line);
  if (summary.voided) return 1;
  if (values.jev === true) {
    const gate = jevGate({ out, env, timeoutMs });
    if (gate.passed && summary.headroom === 'ok') {
      await runJevArm(census, gate, { out, env, timeoutMs, backoffMs, outDir: values.out });
    }
  }
  if (values.deem === true) {
    const gate = deemGate({ out, env });
    if (gate.passed) {
      await runDeemArm(census, gate, summary.headroom, { out, env, timeoutMs, outDir: values.out });
    }
  }
  return 0;
}

if (process.argv[1] && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))) {
  process.exitCode = await main(process.argv.slice(2));
}

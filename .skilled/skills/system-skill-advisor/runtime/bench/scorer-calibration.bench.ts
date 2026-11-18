// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Scorer Calibration Bench
// ───────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────

import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { performance } from 'node:perf_hooks';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { isSpeckitMetricsEnabled, speckitMetrics } from '../lib/metrics.js';
import { scoreAdvisorPrompt } from '../lib/scorer/fusion.js';
import { shouldFireAdvisor, stripLeadingPastedReply } from '../lib/prompt-policy.js';
import { loadAdvisorProjection } from '../lib/scorer/projection.js';
import { findAdvisorWorkspaceRoot } from '../lib/utils/workspace-root.js';

process.env.SPECKIT_METRICS_ENABLED = 'true';

// ───────────────────────────────────────────────────────────────
// 2. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────

interface CorpusRow {
  readonly id: string;
  readonly prompt: string;
  readonly skill_top_1: string;
}

interface ReliabilityBucket {
  readonly bucket: string;
  readonly n: number;
  readonly accuracy: number;
  readonly avgConfidence: number;
}

interface CalibrationBaseline {
  readonly version: string;
  readonly generatedAt: string;
  readonly corpusSha: string;
  readonly corpusRows: number;
  readonly brierScore: number;
  readonly expectedCalibrationError: number;
  readonly reliability: readonly ReliabilityBucket[];
  readonly tolerance: {
    readonly brierDeltaPct: number;
    readonly eceDeltaPct: number;
  };
}

interface Prediction {
  readonly id: string;
  readonly prompt: string;
  readonly trueSkill: string | null;
  readonly predictedSkill: string | null;
  readonly confidence: number;
  readonly correct: 0 | 1;
}

interface BucketAccumulator {
  n: number;
  confidenceSum: number;
  correctSum: number;
}

interface CalibrationReport {
  readonly baseline: CalibrationBaseline;
  readonly predictions: readonly Prediction[];
  readonly brierDeltaPct: number;
  readonly eceDeltaPct: number;
  readonly passed: boolean;
}

// ───────────────────────────────────────────────────────────────
// 3. CONSTANTS
// ───────────────────────────────────────────────────────────────

const SPECKIT_BENCH_CORPUS_PATH = '.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/labeled-prompts.jsonl';
const BASELINE_FILENAME = 'scorer-calibration-baseline.json';
const BUCKET_COUNT = 10;
const BENCH_TIMEOUT_MS = process.env.CI ? 300_000 : 180_000;
// The policy reason a prompt with task intent and enough content words gets.
const WORK_INTENT_REASON = 'work_intent_with_meaningful_tokens';

// A session task, then a short follow-up that names no skill. The task's own
// top-1 is the reference, so no gold label is needed. Negative controls carry
// no task verb in the follow-up; the last pair repeats the first follow-up
// behind a pasted reply that names skills.
const FOLLOW_UP_PAIRS: readonly { readonly task: string; readonly followUp: string; readonly negativeControl: boolean }[] = [
  { task: 'Update the advisor README to document the new corpus file layout', followUp: 'fix that too', negativeControl: false },
  { task: 'Commit the staged changes and open a pull request on github', followUp: 'do the same for the other branch', negativeControl: true },
  { task: 'Create a spec folder for the new routing benchmark work', followUp: 'add one more task there', negativeControl: false },
  { task: 'Design a pricing card component with a dark theme', followUp: 'make it a bit tighter', negativeControl: true },
  { task: 'Search Notion for the onboarding checklist page', followUp: 'update it again with the new name', negativeControl: false },
  { task: 'Run a deep review of the advisor hook changes', followUp: 'now fix the remaining ones', negativeControl: false },
  { task: 'Write a changelog entry for the last release', followUp: 'apply that change to the second file as well', negativeControl: false },
  { task: 'Refactor the session store module to remove duplicated locking code', followUp: 'add tests for it as well', negativeControl: false },
  { task: 'Update the advisor README to document the new corpus file layout', followUp: 'Earlier you replied: I updated the README with sk-doc conventions and committed it with sk-git. Now: fix that too', negativeControl: false },
];

// ───────────────────────────────────────────────────────────────
// 4. HELPERS
// ───────────────────────────────────────────────────────────────

function workspaceRoot(): string {
  const start = dirname(fileURLToPath(import.meta.url));
  const sentinel = '.skilled/skills/system-spec-kit/SKILL.md';
  const candidate = findAdvisorWorkspaceRoot(start, { maxDepth: 12, sentinel });
  if (!existsSync(resolve(candidate, sentinel))) {
    throw new Error('Unable to locate workspace root.');
  }
  return candidate;
}

function roundMetric(value: number): number {
  return Number(value.toFixed(6));
}

function bucketLabel(index: number): string {
  return `${(index / BUCKET_COUNT).toFixed(1)}-${((index + 1) / BUCKET_COUNT).toFixed(1)}`;
}

function confidenceBucket(confidence: number): number {
  return Math.min(BUCKET_COUNT - 1, Math.max(0, Math.floor(confidence * BUCKET_COUNT)));
}

function pctDelta(observed: number, baseline: number): number {
  if (baseline === 0) return observed === 0 ? 0 : Number.POSITIVE_INFINITY;
  return roundMetric(((observed - baseline) / baseline) * 100);
}

function goldSkill(row: CorpusRow): string | null {
  return row.skill_top_1 === 'none' ? null : row.skill_top_1;
}

function readCorpus(path: string): CorpusRow[] {
  return readFileSync(path, 'utf8')
    .trim()
    .split('\n')
    .map((line) => JSON.parse(line) as CorpusRow);
}

function corpusSha(path: string): string {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

function baselinePath(): string {
  return resolve(dirname(fileURLToPath(import.meta.url)), BASELINE_FILENAME);
}

function readBaseline(path: string): CalibrationBaseline {
  if (!existsSync(path)) {
    throw new Error(`Scorer calibration baseline missing at ${path}`);
  }
  return JSON.parse(readFileSync(path, 'utf8')) as CalibrationBaseline;
}

function computeReliability(predictions: readonly Prediction[]): ReliabilityBucket[] {
  const buckets = Array.from({ length: BUCKET_COUNT }, () => ({
    n: 0,
    confidenceSum: 0,
    correctSum: 0,
  } satisfies BucketAccumulator));

  for (const prediction of predictions) {
    const bucket = buckets[confidenceBucket(prediction.confidence)];
    bucket.n += 1;
    bucket.confidenceSum += prediction.confidence;
    bucket.correctSum += prediction.correct;
  }

  return buckets.map((bucket, index) => ({
    bucket: bucketLabel(index),
    n: bucket.n,
    accuracy: bucket.n === 0 ? 0 : roundMetric(bucket.correctSum / bucket.n),
    avgConfidence: bucket.n === 0 ? 0 : roundMetric(bucket.confidenceSum / bucket.n),
  }));
}

function computeEce(reliability: readonly ReliabilityBucket[], total: number): number {
  return roundMetric(reliability.reduce((sum, bucket) => (
    sum + (bucket.n / total) * Math.abs(bucket.avgConfidence - bucket.accuracy)
  ), 0));
}

function createBaseline(args: {
  corpusHash: string;
  corpusRows: number;
  brierScore: number;
  expectedCalibrationError: number;
  reliability: readonly ReliabilityBucket[];
}): CalibrationBaseline {
  return {
    version: '1.0',
    generatedAt: new Date().toISOString(),
    corpusSha: args.corpusHash,
    corpusRows: args.corpusRows,
    brierScore: args.brierScore,
    expectedCalibrationError: args.expectedCalibrationError,
    reliability: args.reliability,
    tolerance: { brierDeltaPct: 50, eceDeltaPct: 50 },
  };
}

// ───────────────────────────────────────────────────────────────
// 5. CORE LOGIC
// ───────────────────────────────────────────────────────────────

// Logs whether a floored follow-up on work-intent text routes away from its own
// session task. A measurement only: the rule that reads it lives outside the bench.
function logFollowUpRouting(root: string, projection: ReturnType<typeof loadAdvisorProjection>): void {
  const scoreTop = (prompt: string) => {
    const result = scoreAdvisorPrompt(prompt, { workspaceRoot: root, projection, includeAllCandidates: true });
    const top = result.topSkill === null
      ? null
      : result.recommendations.find((recommendation) => recommendation.skill === result.topSkill) ?? null;
    return { result, top };
  };
  let harm = 0;
  let harmSame = 0;
  const pairs = FOLLOW_UP_PAIRS.map((pair, index) => {
    const taskTop = scoreTop(pair.task).top?.skill ?? null;
    const { result, top } = scoreTop(pair.followUp);
    const followUpTop = top?.skill ?? null;
    const floored = top?.confidenceFloored === true;
    const policyReason = shouldFireAdvisor(stripLeadingPastedReply(pair.followUp)).reason;
    const guarded = floored && policyReason === WORK_INTENT_REASON;
    if (guarded && followUpTop !== taskTop) harm += 1;
    if (guarded && followUpTop === taskTop) harmSame += 1;
    return {
      pair: index + 1,
      negativeControl: pair.negativeControl,
      taskTop,
      followUpTop,
      floored,
      policyReason,
      flooredSet: result.recommendations
        .filter((recommendation) => recommendation.confidenceFloored === true)
        .map((recommendation) => ({
          skill: recommendation.skill,
          confidence: recommendation.confidence,
          passes: recommendation.passes_threshold,
        })),
    };
  });
  console.log(`advisor-follow-up-routing ${JSON.stringify({ N: FOLLOW_UP_PAIRS.length, H: harm, Hsame: harmSame, pairs })}`);
}

export function runScorerCalibrationBench(root = workspaceRoot()): CalibrationReport {
  const corpusPath = resolve(root, SPECKIT_BENCH_CORPUS_PATH);
  const rows = readCorpus(corpusPath);
  const projection = loadAdvisorProjection(root);
  speckitMetrics.reset();

  // A floored top-1 passes on the task-intent floor rather than its own evidence.
  // Floored passes on work-intent rows that are also correct are the routes a
  // guard on floored follow-ups would hide.
  const floored = { correct: 0, wrong: 0, workIntent: 0, workIntentCorrect: 0 };
  const collateralIds: string[] = [];
  const predictions = rows.map((row) => {
    const result = scoreAdvisorPrompt(row.prompt, { workspaceRoot: root, projection, includeAllCandidates: true });
    const top = result.topSkill === null
      ? null
      : result.recommendations.find((recommendation) => recommendation.skill === result.topSkill) ?? null;
    const predictedSkill = top?.skill ?? null;
    const confidence = top?.confidence ?? 0;
    const correct: 0 | 1 = predictedSkill === goldSkill(row) ? 1 : 0;
    if (top?.confidenceFloored === true) {
      if (correct === 1) floored.correct += 1;
      else floored.wrong += 1;
      if (shouldFireAdvisor(stripLeadingPastedReply(row.prompt)).reason === WORK_INTENT_REASON) {
        floored.workIntent += 1;
        if (correct === 1) {
          floored.workIntentCorrect += 1;
          collateralIds.push(row.id);
        }
      }
    }
    const brierObservation = (confidence - correct) ** 2;
    speckitMetrics.recordBrierScore(brierObservation);
    return {
      id: row.id,
      prompt: row.prompt,
      trueSkill: goldSkill(row),
      predictedSkill,
      confidence,
      correct,
    } satisfies Prediction;
  });

  const brierScore = roundMetric(predictions.reduce((sum, prediction) => (
    sum + (prediction.confidence - prediction.correct) ** 2
  ), 0) / predictions.length);
  const reliability = computeReliability(predictions);
  const expectedCalibrationError = computeEce(reliability, predictions.length);
  const candidateBaseline = createBaseline({
    corpusHash: corpusSha(corpusPath),
    corpusRows: rows.length,
    brierScore,
    expectedCalibrationError,
    reliability,
  });

  const path = baselinePath();
  if (process.env.SPECKIT_WRITE_SCORER_CALIBRATION_BASELINE === '1') {
    writeFileSync(path, `${JSON.stringify(candidateBaseline, null, 2)}\n`, 'utf8');
  }

  const baseline = readBaseline(path);
  const brierDeltaPct = pctDelta(brierScore, baseline.brierScore);
  const eceDeltaPct = pctDelta(expectedCalibrationError, baseline.expectedCalibrationError);
  const passed = Math.abs(brierDeltaPct) <= baseline.tolerance.brierDeltaPct
    && Math.abs(eceDeltaPct) <= baseline.tolerance.eceDeltaPct;
  const brierMean = speckitMetrics.snapshot().brierMean.get('spec_kit.scorer.confidence_brier_score{}');

  console.log(`advisor-scorer-calibration ${JSON.stringify({
    corpusSha: candidateBaseline.corpusSha,
    corpusRows: rows.length,
    brierScore,
    expectedCalibrationError,
    brierDeltaPct,
    eceDeltaPct,
    reliability,
    metricBrierMean: brierMean === undefined ? null : roundMetric(brierMean),
    floored: { ...floored, collateral: collateralIds.length, collateralIds },
  })}`);
  logFollowUpRouting(root, projection);

  expect(isSpeckitMetricsEnabled()).toBe(true);
  expect(roundMetric(brierMean ?? -1)).toBe(brierScore);
  expect(baseline.corpusSha).toBe(candidateBaseline.corpusSha);
  expect(baseline.corpusRows).toBe(candidateBaseline.corpusRows);

  return { baseline, predictions, brierDeltaPct, eceDeltaPct, passed };
}

// ───────────────────────────────────────────────────────────────
// 6. TEST SUITE
// ───────────────────────────────────────────────────────────────

describe('scorer calibration bench', () => {
  it('keeps Brier score and ECE within baseline tolerance', () => {
    const started = performance.now();
    const report = runScorerCalibrationBench();
    console.log(`advisor-scorer-calibration-duration ${JSON.stringify({ durationMs: Math.round(performance.now() - started) })}`);
    expect(report.passed, `calibration delta exceeded tolerance: ${JSON.stringify({
      brierDeltaPct: report.brierDeltaPct,
      eceDeltaPct: report.eceDeltaPct,
      tolerance: report.baseline.tolerance,
    })}`).toBe(true);
  }, BENCH_TIMEOUT_MS);
});

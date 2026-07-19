// ───────────────────────────────────────────────────────────────
// MODULE: Scorer Eval Baseline Ratchet
// ───────────────────────────────────────────────────────────────

// A non-writing accuracy gate. It re-scores the full corpus, the independent
// holdout, the frozen ambiguity slice, and the named intent buckets live under
// the reproducible filesystem projection, and holds every metric to a committed
// baseline. Numbers may only hold: a drop is a regression, and an improvement
// must be captured into the baseline rather than drifting silently (so a real
// gain is never mistaken for the new normal without review). The fixture hashes
// are pinned so a corpus/holdout/ambiguity edit forces a conscious re-baseline,
// and the release floors are retained as an absolute minimum beneath the
// ratchet. This catches a regression confined to contested or single-intent
// prompts that the aggregate corpus number would hide.

import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { beforeAll, describe, expect, it } from 'vitest';
import type { AdvisorScoringOptions, AdvisorScoringResult } from '../../lib/scorer/types.js';

// The release floors that live in the validate handler. The ratchet sits above
// these: the baseline is always at least this healthy, and the exact-match
// ratchet additionally forbids dropping below the last-known-good even while
// still above the floor.
const FULL_CORPUS_FLOOR = 0.75;
const HOLDOUT_FLOOR = 0.725;

interface MetricCount {
  readonly correct: number;
  readonly total: number;
  readonly accuracy: number;
}

interface Baseline {
  readonly schemaVersion: number;
  readonly corpusSha256: string;
  readonly holdoutSha256: string;
  readonly ambiguitySha256: string;
  readonly metrics: {
    readonly full_corpus_top1: MetricCount;
    readonly unknown_count: { readonly value: number };
    readonly gold_none_false_fire: { readonly value: number };
    readonly holdout_top1: MetricCount;
    readonly ambiguity_top1: MetricCount & { readonly tau: number };
    readonly buckets: {
      readonly review: MetricCount;
      readonly memory_save: MetricCount;
      readonly delegation: MetricCount;
    };
  };
}

interface LabeledRow {
  readonly prompt: string;
  readonly skill_top_1: string;
  readonly bucket?: string;
}

interface DelegationCase {
  readonly prompt: string;
  readonly expectedTop: string;
}

const HERE = dirname(fileURLToPath(import.meta.url));
const ROUTING = resolve(HERE, '../../scripts/routing-accuracy');
const BASELINE_PATH = join(ROUTING, 'scorer-eval-baseline.json');
const CORPUS_PATH = join(ROUTING, 'labeled-prompts.jsonl');
const HOLDOUT_PATH = join(ROUTING, 'holdout-prompts.jsonl');
const AMBIGUITY_PATH = join(ROUTING, 'ambiguity-prompts.jsonl');
const DELEGATION_PATH = resolve(HERE, 'fixtures/executor-delegation-cases.json');
const SENTINEL = '.opencode/skills/system-spec-kit/SKILL.md';

// Minimum bucket sizes below which a slice is statistically meaningless.
const REVIEW_MIN_N = 32;
const MEMORY_SAVE_MIN_N = 32;
const DELEGATION_MIN_N = 11;

function sha256File(path: string): string {
  return `sha256:${createHash('sha256').update(readFileSync(path)).digest('hex')}`;
}

function readJsonl<T>(path: string): T[] {
  return readFileSync(path, 'utf8').trim().split('\n').filter(Boolean).map((line) => JSON.parse(line) as T);
}

// Freeze scoring to the reproducible filesystem projection: an empty
// MK_SKILL_ADVISOR_DB_DIR makes the SQLite loader return null (clean FS
// projection from committed metadata), semantic embeddings are disabled, and
// the native lane-ranking overrides are cleared so the top-1 decision is
// deterministic across machines.
function freezeEvalEnv(): void {
  process.env.MK_SKILL_ADVISOR_DB_DIR = mkdtempSync(join(tmpdir(), 'advisor-eval-ratchet-'));
  process.env.SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC = '1';
  process.env.SPECKIT_SKILL_ADVISOR_FORCE_LOCAL = '1';
  delete process.env.SPECKIT_ADVISOR_LANE_WEIGHTS_JSON;
  delete process.env.SPECKIT_ADVISOR_LANE_SHADOW_WEIGHTS_JSON;
  delete process.env.SPECKIT_ADVISOR_BM25_LEXICAL_SHADOW;
}

let scoreAdvisorPrompt: (prompt: string, options: AdvisorScoringOptions) => AdvisorScoringResult;
let mergedSkillForAlias: (skillId: string) => string;
let skillMatchesAlias: (actual: string, expected: string) => boolean;
let workspaceRoot = '';

function topSkill(prompt: string): string | null {
  return scoreAdvisorPrompt(prompt, { workspaceRoot }).topSkill;
}

// Alias-aware top-1 match, mirroring the validate handler: superseded ids and
// folded deep-loop modes are canonicalized on both sides; a both-null result is
// a correct abstain.
function isTop1Correct(top: string | null, goldRaw: string): boolean {
  const gold = goldRaw === 'none' ? null : goldRaw;
  const expected = gold === null ? null : mergedSkillForAlias(gold);
  const actual = top === null ? null : mergedSkillForAlias(top);
  return actual === expected
    || (actual !== null && expected !== null && skillMatchesAlias(actual, expected));
}

function scoreSet(rows: readonly LabeledRow[]): number {
  let correct = 0;
  for (const row of rows) {
    if (isTop1Correct(topSkill(row.prompt), row.skill_top_1)) correct += 1;
  }
  return correct;
}

// Directional non-regression message: an exact hold passes; any deviation fails
// naming whether it is a regression or an unrecaptured improvement.
function ratchetMessage(name: string, live: number, baseline: number, higherIsBetter: boolean): string {
  const improved = higherIsBetter ? live > baseline : live < baseline;
  const verdict = improved
    ? 'improvement detected — re-capture the baseline (capture-scorer-eval-baseline.mjs --write)'
    : 'regression — a scorer or metadata change moved this metric below the last-known-good';
  return `${name}: live=${live} baseline=${baseline}. ${verdict}.`;
}

interface LiveMetrics {
  fullCorrect: number;
  unknown: number;
  goldNoneFalseFire: number;
  holdoutCorrect: number;
  ambiguityCorrect: number;
  reviewCorrect: number;
  reviewTotal: number;
  memorySaveCorrect: number;
  memorySaveTotal: number;
  delegationCorrect: number;
  delegationTotal: number;
  fullTotal: number;
  holdoutTotal: number;
}

let BASELINE: Baseline;
let LIVE: LiveMetrics;

describe('scorer eval baseline ratchet (accuracy non-regression gate)', () => {
  beforeAll(async () => {
    freezeEvalEnv();
    const fusion = await import('../../lib/scorer/fusion.js');
    const aliases = await import('../../lib/scorer/aliases.js');
    const workspace = await import('../../lib/utils/workspace-root.js');
    scoreAdvisorPrompt = fusion.scoreAdvisorPrompt;
    mergedSkillForAlias = aliases.mergedSkillForAlias;
    skillMatchesAlias = aliases.skillMatchesAlias;
    workspaceRoot = workspace.findAdvisorWorkspaceRoot(HERE, { maxDepth: 14, sentinel: SENTINEL });

    BASELINE = JSON.parse(readFileSync(BASELINE_PATH, 'utf8')) as Baseline;

    const corpus = readJsonl<LabeledRow>(CORPUS_PATH);
    let fullCorrect = 0;
    let unknown = 0;
    let goldNoneFalseFire = 0;
    for (const row of corpus) {
      const top = topSkill(row.prompt);
      if (top === null) unknown += 1;
      if (row.skill_top_1 === 'none' && top !== null) goldNoneFalseFire += 1;
      if (isTop1Correct(top, row.skill_top_1)) fullCorrect += 1;
    }

    const holdout = readJsonl<LabeledRow>(HOLDOUT_PATH);
    const ambiguity = readJsonl<LabeledRow>(AMBIGUITY_PATH);
    const reviewRows = corpus.filter((row) => row.bucket === 'true_read_only');
    const memorySaveRows = corpus.filter((row) => row.bucket === 'memory_save_resume');
    const delegation = (JSON.parse(readFileSync(DELEGATION_PATH, 'utf8')) as { cases: DelegationCase[] }).cases;

    let delegationCorrect = 0;
    for (const testCase of delegation) {
      const expected = testCase.expectedTop === 'none' ? null : testCase.expectedTop;
      if (topSkill(testCase.prompt) === expected) delegationCorrect += 1;
    }

    LIVE = {
      fullCorrect,
      unknown,
      goldNoneFalseFire,
      holdoutCorrect: scoreSet(holdout),
      ambiguityCorrect: scoreSet(ambiguity),
      reviewCorrect: scoreSet(reviewRows),
      reviewTotal: reviewRows.length,
      memorySaveCorrect: scoreSet(memorySaveRows),
      memorySaveTotal: memorySaveRows.length,
      delegationCorrect,
      delegationTotal: delegation.length,
      fullTotal: corpus.length,
      holdoutTotal: holdout.length,
    };
  }, 120_000);

  it('the baseline is well-formed', () => {
    expect(BASELINE.schemaVersion).toBe(1);
    expect(BASELINE.metrics.full_corpus_top1.total).toBeGreaterThan(190);
  });

  it('fixture hashes match the pinned baseline (no silent fixture drift)', () => {
    expect(sha256File(CORPUS_PATH), 'corpus changed — re-baseline').toBe(BASELINE.corpusSha256);
    expect(sha256File(HOLDOUT_PATH), 'holdout changed — re-baseline').toBe(BASELINE.holdoutSha256);
    expect(sha256File(AMBIGUITY_PATH), 'ambiguity slice changed — re-baseline').toBe(BASELINE.ambiguitySha256);
  });

  it('full-corpus top-1 holds exactly and clears the release floor', () => {
    expect(
      LIVE.fullCorrect,
      ratchetMessage('full_corpus_top1.correct', LIVE.fullCorrect, BASELINE.metrics.full_corpus_top1.correct, true),
    ).toBe(BASELINE.metrics.full_corpus_top1.correct);
    expect(LIVE.fullCorrect / LIVE.fullTotal).toBeGreaterThanOrEqual(FULL_CORPUS_FLOOR);
  });

  it('unknown_count and gold_none_false_fire hold (both improve downward)', () => {
    expect(
      LIVE.unknown,
      ratchetMessage('unknown_count', LIVE.unknown, BASELINE.metrics.unknown_count.value, false),
    ).toBe(BASELINE.metrics.unknown_count.value);
    expect(
      LIVE.goldNoneFalseFire,
      ratchetMessage('gold_none_false_fire', LIVE.goldNoneFalseFire, BASELINE.metrics.gold_none_false_fire.value, false),
    ).toBe(BASELINE.metrics.gold_none_false_fire.value);
  });

  it('holdout top-1 holds exactly and clears the release floor', () => {
    expect(
      LIVE.holdoutCorrect,
      ratchetMessage('holdout_top1.correct', LIVE.holdoutCorrect, BASELINE.metrics.holdout_top1.correct, true),
    ).toBe(BASELINE.metrics.holdout_top1.correct);
    expect(LIVE.holdoutCorrect / LIVE.holdoutTotal).toBeGreaterThanOrEqual(HOLDOUT_FLOOR);
  });

  it('ambiguity slice top-1 holds exactly', () => {
    expect(
      LIVE.ambiguityCorrect,
      ratchetMessage('ambiguity_top1.correct', LIVE.ambiguityCorrect, BASELINE.metrics.ambiguity_top1.correct, true),
    ).toBe(BASELINE.metrics.ambiguity_top1.correct);
  });

  it('named buckets hold exactly and satisfy minN', () => {
    expect(LIVE.reviewTotal).toBeGreaterThanOrEqual(REVIEW_MIN_N);
    expect(LIVE.memorySaveTotal).toBeGreaterThanOrEqual(MEMORY_SAVE_MIN_N);
    expect(LIVE.delegationTotal).toBeGreaterThanOrEqual(DELEGATION_MIN_N);
    expect(
      LIVE.reviewCorrect,
      ratchetMessage('buckets.review.correct', LIVE.reviewCorrect, BASELINE.metrics.buckets.review.correct, true),
    ).toBe(BASELINE.metrics.buckets.review.correct);
    expect(
      LIVE.memorySaveCorrect,
      ratchetMessage('buckets.memory_save.correct', LIVE.memorySaveCorrect, BASELINE.metrics.buckets.memory_save.correct, true),
    ).toBe(BASELINE.metrics.buckets.memory_save.correct);
    expect(
      LIVE.delegationCorrect,
      ratchetMessage('buckets.delegation.correct', LIVE.delegationCorrect, BASELINE.metrics.buckets.delegation.correct, true),
    ).toBe(BASELINE.metrics.buckets.delegation.correct);
  });
});

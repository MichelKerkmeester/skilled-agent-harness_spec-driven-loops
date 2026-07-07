// ───────────────────────────────────────────────────────────────
// MODULE: Independent Holdout Gate
// ───────────────────────────────────────────────────────────────

// Scores the frozen independent holdout and holds its top-1 accuracy at or
// above the committed baseline. Unlike the every-Nth-row holdout carved from the
// training corpus (retained elsewhere as a legacy secondary signal), this set is
// assembled from three separately-authored, real-labeled fixtures and is proven
// disjoint from the training corpus here, so it measures generalization rather
// than memorization. No gold is invented: each row's label comes from its source
// fixture, and provenance is asserted per row.

import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { beforeAll, describe, expect, it } from 'vitest';
import type { AdvisorScoringOptions, AdvisorScoringResult } from '../../lib/scorer/types.js';

// Independence floor: the honest holdout is meaningfully larger than a token
// sample even after dedup and training-collision removal.
const MIN_HOLDOUT_ROWS = 60;
const VALID_SOURCE_TYPES = new Set(['holdout-harder', 'holdout-regression', 'holdout-delegation']);

interface HoldoutRow {
  readonly id: string;
  readonly prompt: string;
  readonly skill_top_1: string;
  readonly source_type: string;
  readonly origin_fixture: string;
}

interface Baseline {
  readonly metrics: { readonly holdout_top1: { readonly correct: number; readonly total: number } };
}

const HERE = dirname(fileURLToPath(import.meta.url));
const ROUTING = resolve(HERE, '../../scripts/routing-accuracy');
const BASELINE_PATH = join(ROUTING, 'scorer-eval-baseline.json');
const HOLDOUT_PATH = join(ROUTING, 'holdout-prompts.jsonl');
const CORPUS_PATH = join(ROUTING, 'labeled-prompts.jsonl');
const SENTINEL = '.opencode/skills/system-spec-kit/SKILL.md';

function normalizeFamily(prompt: string): string {
  return prompt.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function readJsonl<T>(path: string): T[] {
  return readFileSync(path, 'utf8').trim().split('\n').filter(Boolean).map((line) => JSON.parse(line) as T);
}

function freezeEvalEnv(): void {
  process.env.MK_SKILL_ADVISOR_DB_DIR = mkdtempSync(join(tmpdir(), 'advisor-holdout-'));
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

function isTop1Correct(top: string | null, goldRaw: string): boolean {
  const gold = goldRaw === 'none' ? null : goldRaw;
  const expected = gold === null ? null : mergedSkillForAlias(gold);
  const actual = top === null ? null : mergedSkillForAlias(top);
  return actual === expected
    || (actual !== null && expected !== null && skillMatchesAlias(actual, expected));
}

let HOLDOUT: HoldoutRow[] = [];
let TRAINING_FAMILIES = new Set<string>();
let BASELINE: Baseline;
let HOLDOUT_CORRECT = 0;

describe('independent holdout gate', () => {
  beforeAll(async () => {
    freezeEvalEnv();
    const fusion = await import('../../lib/scorer/fusion.js');
    const aliases = await import('../../lib/scorer/aliases.js');
    const workspace = await import('../../lib/utils/workspace-root.js');
    scoreAdvisorPrompt = fusion.scoreAdvisorPrompt;
    mergedSkillForAlias = aliases.mergedSkillForAlias;
    skillMatchesAlias = aliases.skillMatchesAlias;
    workspaceRoot = workspace.findAdvisorWorkspaceRoot(HERE, { maxDepth: 14, sentinel: SENTINEL });

    HOLDOUT = readJsonl<HoldoutRow>(HOLDOUT_PATH);
    TRAINING_FAMILIES = new Set(readJsonl<{ prompt: string }>(CORPUS_PATH).map((row) => normalizeFamily(row.prompt)));
    BASELINE = JSON.parse(readFileSync(BASELINE_PATH, 'utf8')) as Baseline;

    HOLDOUT_CORRECT = HOLDOUT.filter((row) => (
      isTop1Correct(scoreAdvisorPrompt(row.prompt, { workspaceRoot }).topSkill, row.skill_top_1)
    )).length;
  }, 120_000);

  it('is a non-trivial, provenance-tagged set', () => {
    expect(HOLDOUT.length).toBeGreaterThanOrEqual(MIN_HOLDOUT_ROWS);
    for (const row of HOLDOUT) {
      expect(VALID_SOURCE_TYPES.has(row.source_type), `unknown source_type: ${row.source_type}`).toBe(true);
      expect(row.origin_fixture.length, `missing origin_fixture on ${row.id}`).toBeGreaterThan(0);
    }
  });

  it('is disjoint from the training corpus (measures generalization, not memorization)', () => {
    const collisions = HOLDOUT
      .filter((row) => TRAINING_FAMILIES.has(normalizeFamily(row.prompt)))
      .map((row) => row.id);
    expect(collisions, `holdout rows colliding with training prompts (drop them): ${collisions.join(', ')}`).toEqual([]);
  });

  it('holds top-1 at or above the committed baseline', () => {
    const baselineCorrect = BASELINE.metrics.holdout_top1.correct;
    expect(
      HOLDOUT_CORRECT,
      `holdout top-1 regressed: live=${HOLDOUT_CORRECT}/${HOLDOUT.length} baseline=${baselineCorrect}. `
      + 'A drop means a scorer or metadata change hurt generalization.',
    ).toBeGreaterThanOrEqual(baselineCorrect);
  });
});

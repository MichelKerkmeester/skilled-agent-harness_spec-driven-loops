// ───────────────────────────────────────────────────────────────
// MODULE: Ambiguity Slice Gate
// ───────────────────────────────────────────────────────────────

// Scores the frozen ambiguity slice — the hardest, lowest top-2-margin corpus
// prompts — and holds its top-1 accuracy at or above the committed baseline. The
// aggregate corpus number can stay flat while contested prompts silently
// regress; this slice makes that regression visible. The slice and its margin
// threshold tau are frozen so the set never re-derives implicitly on a corpus
// edit; each row keeps its existing gold label (no new labels invented).

import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { beforeAll, describe, expect, it } from 'vitest';
import type { AdvisorScoringOptions, AdvisorScoringResult } from '../../lib/scorer/types.js';

// A frozen slice that collapses to a handful of rows is not a meaningful gate.
const MIN_SLICE_ROWS = 10;

interface AmbiguityRow {
  readonly id: string;
  readonly prompt: string;
  readonly skill_top_1: string;
  readonly bucket: string;
  readonly source_type: string;
  readonly margin_at_capture: number;
  readonly tau: number;
}

interface Baseline {
  readonly metrics: { readonly ambiguity_top1: { readonly correct: number; readonly total: number; readonly tau: number } };
}

const HERE = dirname(fileURLToPath(import.meta.url));
const ROUTING = resolve(HERE, '../../scripts/routing-accuracy');
const BASELINE_PATH = join(ROUTING, 'scorer-eval-baseline.json');
const AMBIGUITY_PATH = join(ROUTING, 'ambiguity-prompts.jsonl');
const SENTINEL = '.opencode/skills/system-spec-kit/SKILL.md';

function readJsonl<T>(path: string): T[] {
  return readFileSync(path, 'utf8').trim().split('\n').filter(Boolean).map((line) => JSON.parse(line) as T);
}

function freezeEvalEnv(): void {
  process.env.MK_SKILL_ADVISOR_DB_DIR = mkdtempSync(join(tmpdir(), 'advisor-ambiguity-gate-'));
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

let SLICE: AmbiguityRow[] = [];
let BASELINE: Baseline;
let SLICE_CORRECT = 0;

describe('ambiguity slice gate', () => {
  beforeAll(async () => {
    freezeEvalEnv();
    const fusion = await import('../../lib/scorer/fusion.js');
    const aliases = await import('../../lib/scorer/aliases.js');
    const workspace = await import('../../lib/utils/workspace-root.js');
    scoreAdvisorPrompt = fusion.scoreAdvisorPrompt;
    mergedSkillForAlias = aliases.mergedSkillForAlias;
    skillMatchesAlias = aliases.skillMatchesAlias;
    workspaceRoot = workspace.findAdvisorWorkspaceRoot(HERE, { maxDepth: 14, sentinel: SENTINEL });

    SLICE = readJsonl<AmbiguityRow>(AMBIGUITY_PATH);
    BASELINE = JSON.parse(readFileSync(BASELINE_PATH, 'utf8')) as Baseline;

    SLICE_CORRECT = SLICE.filter((row) => (
      isTop1Correct(scoreAdvisorPrompt(row.prompt, { workspaceRoot }).topSkill, row.skill_top_1)
    )).length;
  }, 120_000);

  it('is a non-empty, meaningful minority carrying its existing gold labels', () => {
    expect(SLICE.length).toBeGreaterThanOrEqual(MIN_SLICE_ROWS);
    for (const row of SLICE) {
      expect(row.skill_top_1.length, `missing gold on ${row.id}`).toBeGreaterThan(0);
      expect(row.bucket.length).toBeGreaterThan(0);
    }
  });

  it('has a single frozen tau matching the baseline', () => {
    const taus = new Set(SLICE.map((row) => row.tau));
    expect(taus.size, 'ambiguity slice must carry a single frozen tau').toBe(1);
    expect(SLICE[0].tau).toBe(BASELINE.metrics.ambiguity_top1.tau);
  });

  it('holds top-1 at or above the committed baseline', () => {
    const baselineCorrect = BASELINE.metrics.ambiguity_top1.correct;
    expect(
      SLICE_CORRECT,
      `ambiguity top-1 regressed: live=${SLICE_CORRECT}/${SLICE.length} baseline=${baselineCorrect}. `
      + 'A drop means a scorer or metadata change hurt the hardest contested prompts.',
    ).toBeGreaterThanOrEqual(baselineCorrect);
  });
});

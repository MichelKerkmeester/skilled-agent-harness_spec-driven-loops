// ───────────────────────────────────────────────────────────────
// MODULE: Doctor Bridge Isolation
// ───────────────────────────────────────────────────────────────

import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import type {
  AdvisorProjection,
  AdvisorScoredRecommendation,
  AdvisorScoringOptions,
  AdvisorScoringResult,
} from '../../lib/scorer/types.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROUTING = resolve(HERE, '../../scripts/routing-accuracy');
const BASELINE_PATH = join(ROUTING, 'scorer-eval-baseline.json');
const SENTINEL = '.skilled/skills/system-spec-kit/SKILL.md';
const DOCTOR_PREFIX = 'command-doctor-';

const PROMPTS = [
  'git hooks',
  'git hook',
  'git setup',
  'git standards',
  'git hooks broken',
  'git rules',
  'git config',
  'git push',
  'git status',
  'git commit',
  'git branch',
  'git rebase',
  'git worktree',
  'commit rules',
  'commit message',
  'commit message rules',
  'commit standards',
  'commit hook',
  'pre-commit hook',
  'branch naming',
  'branch rules',
  'worktree',
  'create worktree',
  'rebase',
  'merge conflict',
  'conventional commits',
  'open a pr',
  'pull request',
  'finish branch',
  'speckit doctor',
  'advisor rebuild',
  'advisor status',
  'skill advisor',
  'update skilled',
  'trigger index',
  'spec folder',
  'deep research',
  'code mode',
  'parent skill',
  'pre-push hook',
  'push allowlist',
  'hook trust',
  'hook gates',
  'cherry pick',
  'squash commits',
  'env vars',
  // Deliberately has no expected owner: routing it to system-spec-kit would put the skill above /doctor:env on "check my environment variables".
  'environment variables',
  'mcp tools',
  'runtime mirrors',
  'resume spec',
  'validate spec',
  'Review this PR for blocking routing regressions and list findings first.',
] as const;

const EXPECTED_TOP_SKILLS: ReadonlyMap<string, string> = new Map([
  ['git hooks', 'sk-git'],
  ['git hook', 'sk-git'],
  ['git setup', 'sk-git'],
  ['git standards', 'sk-git'],
  ['git hooks broken', 'sk-git'],
  ['git rules', 'sk-git'],
  ['speckit doctor', 'system-spec-kit'],
  ['pre-push hook', 'sk-git'],
  ['push allowlist', 'sk-git'],
  ['hook trust', 'sk-git'],
  ['hook gates', 'sk-git'],
  ['cherry pick', 'sk-git'],
  ['squash commits', 'sk-git'],
  ['env vars', 'system-spec-kit'],
  ['mcp tools', 'mcp-tooling'],
  ['runtime mirrors', 'system-spec-kit'],
  ['resume spec', 'system-spec-kit'],
  ['validate spec', 'system-spec-kit'],
  // The lexical lane substring-matches prompt tokens against joined intent signals:
  // "allowlist" hit "list" and pulled this review prompt to sk-git.
  ['Review this PR for blocking routing regressions and list findings first.', 'sk-code'],
]);

function freezeEvalEnv(): void {
  process.env.SYSTEM_SKILL_ADVISOR_DB_DIR = mkdtempSync(
    join(tmpdir(), 'advisor-doctor-isolation-'),
  );
  process.env.SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC = '1';
  process.env.SPECKIT_SKILL_ADVISOR_FORCE_LOCAL = '1';
  delete process.env.SPECKIT_ADVISOR_LANE_WEIGHTS_JSON;
  delete process.env.SPECKIT_ADVISOR_LANE_SHADOW_WEIGHTS_JSON;
  delete process.env.SPECKIT_ADVISOR_BM25_LEXICAL_SHADOW;
}

function isDoctorBridge(
  recommendation: AdvisorScoredRecommendation,
): boolean {
  return recommendation.kind === 'command'
    && recommendation.skill.startsWith(DOCTOR_PREFIX);
}

function scoreSnapshots(
  recommendations: readonly AdvisorScoredRecommendation[],
): Array<Pick<
  AdvisorScoredRecommendation,
  'skill' | 'confidence' | 'uncertainty' | 'passes_threshold'
>> {
  return recommendations.map((recommendation) => ({
    skill: recommendation.skill,
    confidence: recommendation.confidence,
    uncertainty: recommendation.uncertainty,
    passes_threshold: recommendation.passes_threshold,
  }));
}

let scoreAdvisorPrompt: (
  prompt: string,
  options: AdvisorScoringOptions,
) => AdvisorScoringResult;
let workspaceRoot = '';
let projection: AdvisorProjection;
let doctorFreeProjection: AdvisorProjection;

describe('doctor bridge scoring isolation', () => {
  beforeAll(async () => {
    freezeEvalEnv();
    const fusion = await import('../../lib/scorer/fusion.js');
    const projectionModule = await import('../../lib/scorer/projection.js');
    const workspace = await import('../../lib/utils/workspace-root.js');
    scoreAdvisorPrompt = fusion.scoreAdvisorPrompt;
    workspaceRoot = workspace.findAdvisorWorkspaceRoot(HERE, {
      maxDepth: 14,
      sentinel: SENTINEL,
    });

    const baseline = JSON.parse(readFileSync(BASELINE_PATH, 'utf8')) as {
      readonly capturedAt: string;
    };

    // Derived-lane age decay uses the baseline date so the scoring stays reproducible.
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(`${baseline.capturedAt}T00:00:00Z`));

    projection = await projectionModule.loadAdvisorProjection(workspaceRoot);
    doctorFreeProjection = {
      ...projection,
      skills: projection.skills.filter((skill) => !skill.id.startsWith(DOCTOR_PREFIX)),
    };
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it.each(PROMPTS)('keeps skill scoring isolated for "%s"', (prompt) => {
    const fullResult = scoreAdvisorPrompt(prompt, {
      workspaceRoot,
      projection,
      includeAllCandidates: true,
    });
    const doctorFreeResult = scoreAdvisorPrompt(prompt, {
      workspaceRoot,
      projection: doctorFreeProjection,
      includeAllCandidates: true,
    });
    const fullSkills = fullResult.recommendations.filter(
      (recommendation) => !isDoctorBridge(recommendation),
    );

    expect(scoreSnapshots(fullSkills)).toEqual(
      scoreSnapshots(doctorFreeResult.recommendations),
    );
    if (doctorFreeResult.topSkill !== null) {
      expect(fullResult.topSkill).toBe(doctorFreeResult.topSkill);
    }

    const expectedTopSkill = EXPECTED_TOP_SKILLS.get(prompt);
    if (expectedTopSkill !== undefined) {
      expect(fullResult.topSkill).toBe(expectedTopSkill);
    }
  });
});

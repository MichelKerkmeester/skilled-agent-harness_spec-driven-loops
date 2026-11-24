// ───────────────────────────────────────────────────────────────────
// MODULE: Lexical Anchor Naming Tests
// ───────────────────────────────────────────────────────────────────

import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import type {
  AdvisorProjection,
  AdvisorScoringOptions,
  AdvisorScoringResult,
} from '../../lib/scorer/types.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROUTING = resolve(HERE, '../../scripts/routing-accuracy');
const BASELINE_PATH = join(ROUTING, 'scorer-eval-baseline.json');
const SENTINEL = '.skilled/skills/system-spec-kit/SKILL.md';
const ENVIRONMENT_KEYS = [
  'SYSTEM_SKILL_ADVISOR_DB_DIR',
  'SPECKIT_SKILL_ADVISOR_FORCE_LOCAL',
  'SPECKIT_ADVISOR_LANE_WEIGHTS_JSON',
  'SPECKIT_ADVISOR_LANE_SHADOW_WEIGHTS_JSON',
  'SPECKIT_ADVISOR_BM25_LEXICAL_SHADOW',
  'SPECKIT_PRIVATE_SKILL_ROOTS',
] as const;

const previousEnvironment = new Map<string, string | undefined>();
let temporaryDatabaseDirectory = '';
let scoreAdvisorPrompt: (
  prompt: string,
  options: AdvisorScoringOptions,
) => AdvisorScoringResult;
let projection: AdvisorProjection;
let workspaceRoot = '';

function freezeEvalEnvironment(): void {
  for (const key of ENVIRONMENT_KEYS) previousEnvironment.set(key, process.env[key]);

  temporaryDatabaseDirectory = mkdtempSync(join(tmpdir(), 'advisor-lexical-anchor-'));
  process.env.SYSTEM_SKILL_ADVISOR_DB_DIR = temporaryDatabaseDirectory;
  process.env.SPECKIT_SKILL_ADVISOR_FORCE_LOCAL = '1';
  delete process.env.SPECKIT_ADVISOR_LANE_WEIGHTS_JSON;
  delete process.env.SPECKIT_ADVISOR_LANE_SHADOW_WEIGHTS_JSON;
  delete process.env.SPECKIT_ADVISOR_BM25_LEXICAL_SHADOW;
  delete process.env.SPECKIT_PRIVATE_SKILL_ROOTS;
}

function restoreEvalEnvironment(): void {
  for (const key of ENVIRONMENT_KEYS) {
    const value = previousEnvironment.get(key);
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  if (temporaryDatabaseDirectory) {
    rmSync(temporaryDatabaseDirectory, { recursive: true, force: true });
  }
}

function score(prompt: string): AdvisorScoringResult {
  return scoreAdvisorPrompt(prompt, {
    workspaceRoot,
    projection,
    includeAllCandidates: true,
  });
}

function passingIds(result: AdvisorScoringResult): string[] {
  return result.recommendations
    .filter((recommendation) => recommendation.passes_threshold)
    .map((recommendation) => recommendation.skill);
}

function hasPassingId(result: AdvisorScoringResult, skill: string): boolean {
  return result.recommendations.some((recommendation) => (
    recommendation.skill === skill && recommendation.passes_threshold
  ));
}

describe('lexical anchor naming', () => {
  beforeAll(async () => {
    freezeEvalEnvironment();
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
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(`${baseline.capturedAt}T00:00:00Z`));
    projection = await projectionModule.loadAdvisorProjection(workspaceRoot);
  });

  afterAll(() => {
    vi.useRealTimers();
    restoreEvalEnvironment();
  });

  it('keeps a skill below the floor when its strong score comes from synonyms alone', () => {
    const result = score('rewrite this prompt so it is shorter');
    expect(hasPassingId(result, 'sk-prompt')).toBe(true);
    expect(hasPassingId(result, 'sk-code')).toBe(false);
  });

  it('lifts the skill the prompt names and not the ones sharing only generic words', () => {
    const result = score('run the doctor update check');
    expect(passingIds(result)).toEqual(['system-skilled-doctor']);
  });

  // The prompt shares only words many skills list with sk-doc, so without the
  // typed-command clause the distinctive-word test would drop it.
  it('treats a typed command as naming the skill that owns it', () => {
    const result = score('/create:skill-parent deploy-hub with three modes');
    expect(hasPassingId(result, 'sk-doc')).toBe(true);
  });
});

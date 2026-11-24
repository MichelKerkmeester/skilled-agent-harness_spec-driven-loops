// ───────────────────────────────────────────────────────────────────
// MODULE: Score Advisor Stage-Order Tests
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

  temporaryDatabaseDirectory = mkdtempSync(join(tmpdir(), 'advisor-stage-order-'));
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

describe('scoreAdvisorPrompt stage order', () => {
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

  it('keeps a mentioned helper command withheld after the helper hand-off', () => {
    const result = score(
      'is /doctor:helper the right tool? the symlink to the skilled checkout is broken',
    );
    const ids = passingIds(result);

    expect(result.topSkill).toBe('sk-code');
    expect(ids).toContain('sk-code');
    expect(hasPassingId(result, 'command-doctor-helper')).toBe(false);
    expect(result.recommendations.some((recommendation) => (
      recommendation.skill === 'command-doctor-helper'
    ))).toBe(true);
    expect(result.recommendations.some((recommendation) => (
      recommendation.reason.startsWith('doctor helper hand-off')
    ))).toBe(false);
  });

  it('keeps the writing-about-loop doctor withheld after the helper hand-off', () => {
    const result = score(
      'write a blog post about the deep research loop, the doctor says convergence is broken',
    );

    expect(result.topSkill).toBe('sk-doc');
    expect(result.recommendations.some((recommendation) => (
      recommendation.skill === 'command-doctor-deep-loop'
    ))).toBe(true);
  });

  it('keeps the no-edit deep-loop command withheld after the helper hand-off', () => {
    const result = score("my research loop stopped converging, don't change anything");
    const ids = passingIds(result);

    expect(ids[0]).toBe('system-deep-loop');
    expect(hasPassingId(result, 'system-deep-loop')).toBe(true);
    expect(ids).not.toContain('command-doctor-deep-loop');
  });

  it('keeps a typed command owner behind the passing skill after bridge isolation', () => {
    const result = score('/deep:review check my environment variables');
    const ids = passingIds(result);

    expect(hasPassingId(result, 'command-doctor-env')).toBe(true);
    expect(hasPassingId(result, 'system-deep-loop')).toBe(true);
    expect(ids.slice(0, 2)).toEqual(['system-deep-loop', 'command-doctor-env']);
  });
});

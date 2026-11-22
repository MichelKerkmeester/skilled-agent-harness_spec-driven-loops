// ───────────────────────────────────────────────────────────────
// MODULE: Deep-loop ask routing
// ───────────────────────────────────────────────────────────────

// The deep-loop hub's aliases and loop words also appear in requests that do
// not ask for a loop: a piece written about a loop method, or a question about
// how convergence works. And a review asked for in passes is the loop, though
// the code skill's single-pass review shares its words. These cases pin the
// ranking each of those needs, against the real projection.

import { mkdtempSync, readFileSync } from 'node:fs';
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
const BASELINE_PATH = resolve(HERE, '../../scripts/routing-accuracy/scorer-eval-baseline.json');
const SENTINEL = '.skilled/skills/system-spec-kit/SKILL.md';
const PRIVATE_SKILL_ROOTS_ENV = 'SPECKIT_PRIVATE_SKILL_ROOTS';
const PREVIOUS_PRIVATE_SKILL_ROOTS = process.env[PRIVATE_SKILL_ROOTS_ENV];

let scoreAdvisorPrompt: (prompt: string, options: AdvisorScoringOptions) => AdvisorScoringResult;
let projection: AdvisorProjection;
let workspaceRoot = '';

function passingSkills(prompt: string): string[] {
  return scoreAdvisorPrompt(prompt, { workspaceRoot, projection }).recommendations
    .filter((recommendation) => recommendation.passes_threshold)
    .map((recommendation) => recommendation.skill);
}

describe('deep-loop ask routing', () => {
  beforeAll(async () => {
    process.env.SYSTEM_SKILL_ADVISOR_DB_DIR = mkdtempSync(join(tmpdir(), 'advisor-deep-loop-ask-'));
    process.env.SPECKIT_SKILL_ADVISOR_FORCE_LOCAL = '1';
    delete process.env.SPECKIT_ADVISOR_LANE_WEIGHTS_JSON;
    delete process.env.SPECKIT_ADVISOR_LANE_SHADOW_WEIGHTS_JSON;
    delete process.env.SPECKIT_ADVISOR_BM25_LEXICAL_SHADOW;
    delete process.env[PRIVATE_SKILL_ROOTS_ENV];

    const fusion = await import('../../lib/scorer/fusion.js');
    const projectionModule = await import('../../lib/scorer/projection.js');
    const workspace = await import('../../lib/utils/workspace-root.js');
    scoreAdvisorPrompt = fusion.scoreAdvisorPrompt;
    workspaceRoot = workspace.findAdvisorWorkspaceRoot(HERE, { maxDepth: 14, sentinel: SENTINEL });

    // The derived lane discounts each skill by age, so score at the baseline instant.
    const baseline = JSON.parse(readFileSync(BASELINE_PATH, 'utf8')) as { readonly capturedAt: string };
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(`${baseline.capturedAt}T00:00:00Z`));

    projection = await projectionModule.loadAdvisorProjection(workspaceRoot);
  });

  afterAll(() => {
    vi.useRealTimers();
    if (PREVIOUS_PRIVATE_SKILL_ROOTS === undefined) delete process.env[PRIVATE_SKILL_ROOTS_ENV];
    else process.env[PRIVATE_SKILL_ROOTS_ENV] = PREVIOUS_PRIVATE_SKILL_ROOTS;
  });

  it.each([
    'draft an article about iterative research for support teams',
    'compose a newsletter section explaining deep research methods',
  ])('keeps the hub off a piece written about the loop: %s', (prompt) => {
    expect(passingSkills(prompt)).not.toContain('system-deep-loop');
  });

  it('keeps the hub first when a loop run is asked for and then written up', () => {
    expect(passingSkills('start an iterative research run on font loading')[0]).toBe('system-deep-loop');
  });

  it('ranks the hub first for a review asked for over several passes', () => {
    expect(passingSkills('review the lexer over several passes')[0]).toBe('system-deep-loop');
  });

  it('keeps a careful single-pass review on the code skill', () => {
    expect(passingSkills('review the lexer carefully')[0]).toBe('sk-code');
  });

  it('hands no doctor command to a question about how convergence works', () => {
    const passing = passingSkills('explain how convergence detection works in the deep-loop runtime');
    expect(passing.some((skill) => skill.startsWith('command-doctor-'))).toBe(false);
  });
});

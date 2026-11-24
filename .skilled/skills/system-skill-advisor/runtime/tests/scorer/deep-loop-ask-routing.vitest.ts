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

  // A piece about loops that also types a loop command asks for the run, so a
  // longer command typed for another hub must not cost the hub its pass.
  it('keeps the hub passing for a piece about loops that also types a loop command', () => {
    const prompt = 'write a blog post about deep review loops, then /deep:review the parser and /create:changelog';
    expect(passingSkills(prompt)).toContain('system-deep-loop');
  });

  it('ranks the hub first for a review asked for over several passes', () => {
    expect(passingSkills('review the lexer over several passes')[0]).toBe('system-deep-loop');
  });

  // Naming the target as code hands the code skill its own name and keyword,
  // which must not outweigh a review asked for in passes or iterations.
  it.each([
    'give the importer code many passes of review',
    'review the auth middleware code over several passes',
  ])('ranks the hub first when the reviewed target is called code: %s', (prompt) => {
    expect(passingSkills(prompt)[0]).toBe('system-deep-loop');
  });

  // `iterative` that describes the subject must rank exactly as a word that
  // carries no loop meaning, so each prompt is scored beside its twin. Beside
  // `research` the word still matches the hub's own vocabulary, which no loop
  // rule reads, so that pairing is held to the offer gate's fixture instead.
  it.each([
    ['review the code for the iterative solver', 'review the code for the recursive solver'],
    ['review the diff, it makes the parser iterative', 'review the diff, it makes the parser recursive'],
  ])('ranks a subject called iterative like its twin: %s', (iterativePrompt, twinPrompt) => {
    expect(passingSkills(iterativePrompt)[0]).toBe(passingSkills(twinPrompt)[0]);
    expect(passingSkills(iterativePrompt)[0]).not.toBe('system-deep-loop');
  });

  it('keeps the hub first for a review asked for iteratively', () => {
    expect(passingSkills('audit the auth module iteratively')[0]).toBe('system-deep-loop');
  });

  it('keeps a careful single-pass review on the code skill', () => {
    expect(passingSkills('review the lexer carefully')[0]).toBe('sk-code');
  });

  it('keeps a careful review of code on the code skill', () => {
    expect(passingSkills('review the importer code carefully')[0]).toBe('sk-code');
  });

  // "inspect" also reads as a request to explain, which floors every skill.
  it('routes a defect check asked for iteratively to the hub despite the explain verb', () => {
    expect(passingSkills('inspect the upload service for errors over several passes')[0]).toBe('system-deep-loop');
  });

  it.each([
    'inspect the importer for defects',
    'explain the iterations of the research loop',
  ])('keeps the hub from passing without a defect check in passes: %s', (prompt) => {
    expect(passingSkills(prompt)).not.toContain('system-deep-loop');
  });

  // A spelled-out count reads as a digit count does, so the single-pass code
  // review steps back for it too.
  it.each([
    'give the importer code three rounds of review',
    'do a dozen passes of review on the lexer',
  ])('ranks the hub first for a review with a spelled-out count: %s', (prompt) => {
    expect(passingSkills(prompt)[0]).toBe('system-deep-loop');
  });

  it('keeps a single-pass review of a numbered change set on the code skill', () => {
    expect(passingSkills('review the five changes in this pull request')[0]).not.toBe('system-deep-loop');
  });

  // The code skill reads "code audit" as its own review, so a stuck audit loop
  // has to reach the hub that owns the diagnosis.
  it('ranks the hub first for a stuck code audit loop the reader launched', () => {
    expect(passingSkills('the code audit loop I launched has stalled')[0]).toBe('system-deep-loop');
  });

  it('keeps the hub off a stuck build', () => {
    expect(passingSkills('my build keeps spinning')).not.toContain('system-deep-loop');
  });

  it('hands no doctor command to a question about how convergence works', () => {
    const passing = passingSkills('explain how convergence detection works in the deep-loop runtime');
    expect(passing.some((skill) => skill.startsWith('command-doctor-'))).toBe(false);
  });
});

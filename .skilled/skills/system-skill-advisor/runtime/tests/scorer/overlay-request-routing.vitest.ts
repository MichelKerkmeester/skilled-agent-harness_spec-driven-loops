// ───────────────────────────────────────────────────────────────
// MODULE: Overlay Request Routing
// ───────────────────────────────────────────────────────────────

// The overlay engine owns its manifest file and the docs leg of its status audit.
// The generic `json` token and the README author words must not hand those
// requests to the code or doc hub, while a plain README or JSON schema request
// still reaches the hub that writes it.

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

function topSkill(prompt: string): string | undefined {
  return scoreAdvisorPrompt(prompt, { workspaceRoot, projection }).recommendations[0]?.skill;
}

describe('overlay request routing', () => {
  beforeAll(async () => {
    // Score against the reproducible filesystem projection only.
    process.env.SYSTEM_SKILL_ADVISOR_DB_DIR = mkdtempSync(join(tmpdir(), 'advisor-overlay-routing-'));
    process.env.SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC = '1';
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

  it('routes a request naming the overlay manifest file to the doctor skill', () => {
    expect(topSkill('Put my vendored Skilled overlay folder beside the project tree and register it in .skilled-overlays.json'))
      .toBe('system-skilled-doctor');
  });

  it('routes an overlay status audit for missing READMEs to the doctor skill', () => {
    expect(topSkill('Audit the overlay status and report which overlay folders are missing a README'))
      .toBe('system-skilled-doctor');
  });

  it('routes a run of the overlay status audit for missing READMEs to the doctor skill', () => {
    expect(topSkill('run the overlay status audit and list folders missing a README'))
      .toBe('system-skilled-doctor');
  });

  it('keeps writing a README for an overlay folder on the doc hub', () => {
    expect(topSkill('Write a README for my overlay folder')).toBe('sk-doc');
  });

  it('keeps "Change the overlay README intro" on the doc hub', () => {
    expect(topSkill('Change the overlay README intro')).toBe('sk-doc');
  });

  it('keeps "Revise the overlay section of the README" on the doc hub', () => {
    expect(topSkill('Revise the overlay section of the README')).toBe('sk-doc');
  });

  it('keeps "Improve the overlay docs in the README" on the doc hub', () => {
    expect(topSkill('Improve the overlay docs in the README')).toBe('sk-doc');
  });

  it('keeps "Polish the overlays README wording" on the doc hub', () => {
    expect(topSkill('Polish the overlays README wording')).toBe('sk-doc');
  });

  it('keeps a plain README writing request on the doc hub', () => {
    expect(topSkill('Write a README for this project folder')).toBe('sk-doc');
  });

  it('keeps a JSON schema request on the code hub', () => {
    expect(topSkill('Write a JSON schema for the config file')).toBe('sk-code');
  });
});

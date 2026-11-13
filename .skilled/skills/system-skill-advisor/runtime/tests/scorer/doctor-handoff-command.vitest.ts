// ───────────────────────────────────────────────────────────────
// MODULE: Doctor Hand-off Command
// ───────────────────────────────────────────────────────────────

// A doctor problem worded unlike any bridge phrase reaches the helper's own
// ranker. When that ranker names a command that runs without asking, the operator
// is offered that command, and /doctor:helper keeps the hand-off otherwise. These
// cases pin which id the hand-off inserts and where it sits.

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
const ROUTING = resolve(HERE, '../../scripts/routing-accuracy');
const BASELINE_PATH = join(ROUTING, 'scorer-eval-baseline.json');
const SENTINEL = '.skilled/skills/system-spec-kit/SKILL.md';
const DOCTOR_PREFIX = 'command-doctor-';

// Private `local-*` skills linked in through this variable live outside the
// checkout, so a pinned ordering measured on a clean checkout must not see them.
const PRIVATE_SKILL_ROOTS_ENV = 'SPECKIT_PRIVATE_SKILL_ROOTS';
const PREVIOUS_PRIVATE_SKILL_ROOTS = process.env[PRIVATE_SKILL_ROOTS_ENV];

function restorePrivateSkillRoots(): void {
  if (PREVIOUS_PRIVATE_SKILL_ROOTS === undefined) delete process.env[PRIVATE_SKILL_ROOTS_ENV];
  else process.env[PRIVATE_SKILL_ROOTS_ENV] = PREVIOUS_PRIVATE_SKILL_ROOTS;
}

// Freeze scoring to the reproducible filesystem projection: an empty DB dir makes the
// SQLite loader return null, semantic embeddings are disabled, and the native
// lane-ranking overrides are cleared so the ordering is deterministic.
function freezeEvalEnv(): void {
  process.env.SYSTEM_SKILL_ADVISOR_DB_DIR = mkdtempSync(join(tmpdir(), 'advisor-doctor-handoff-'));
  process.env.SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC = '1';
  process.env.SPECKIT_SKILL_ADVISOR_FORCE_LOCAL = '1';
  delete process.env.SPECKIT_ADVISOR_LANE_WEIGHTS_JSON;
  delete process.env.SPECKIT_ADVISOR_LANE_SHADOW_WEIGHTS_JSON;
  delete process.env.SPECKIT_ADVISOR_BM25_LEXICAL_SHADOW;
  delete process.env[PRIVATE_SKILL_ROOTS_ENV];
}

let scoreAdvisorPrompt: (prompt: string, options: AdvisorScoringOptions) => AdvisorScoringResult;
let runnableDoctorBridgeId: (runnable: string, projection: AdvisorProjection) => string | undefined;
let projection: AdvisorProjection;
let workspaceRoot = '';

// The projection holds one bridge whose policy runs and one that asks, so a
// runnable can be found only when it runs without confirmation.
const BRIDGE_PROJECTION = {
  skills: [
    { id: 'command-doctor-agents-md-check' },
    { id: 'command-doctor-git-hooks' },
  ],
} as unknown as AdvisorProjection;

function scoredIds(prompt: string): string[] {
  return scoreAdvisorPrompt(prompt, { workspaceRoot, projection })
    .recommendations.map((recommendation) => recommendation.skill);
}

describe('doctor hand-off command', () => {
  beforeAll(async () => {
    freezeEvalEnv();
    const fusion = await import('../../lib/scorer/fusion.js');
    const projectionModule = await import('../../lib/scorer/projection.js');
    const workspace = await import('../../lib/utils/workspace-root.js');
    scoreAdvisorPrompt = fusion.scoreAdvisorPrompt;
    runnableDoctorBridgeId = fusion.runnableDoctorBridgeId;
    workspaceRoot = workspace.findAdvisorWorkspaceRoot(HERE, { maxDepth: 14, sentinel: SENTINEL });

    const baseline = JSON.parse(readFileSync(BASELINE_PATH, 'utf8')) as { readonly capturedAt: string };

    // The derived lane discounts each skill by its age at scoring time, so score at the
    // instant the accuracy baseline was captured; a later calendar day must not move a
    // row that no change touched.
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(`${baseline.capturedAt}T00:00:00Z`));

    projection = await projectionModule.loadAdvisorProjection(workspaceRoot);
  });

  afterAll(() => {
    vi.useRealTimers();
    restorePrivateSkillRoots();
  });

  it('offers the ranked command that runs without asking', () => {
    expect(scoredIds('confirm the AGENTS.md sections in this repo have not drifted')[0])
      .toBe('command-doctor-agents-md-check');
  });

  it('offers the ranked ci report command', () => {
    expect(scoredIds('show me every GitHub Actions workflow and whether each is enabled')[0])
      .toBe('command-doctor-ci-report');
  });

  // A strong cue stands beside a passing skill, and the hand-off follows it rather
  // than displacing it.
  it('puts the ranked command after the passing skill', () => {
    const ids = scoredIds('my research loop stopped converging and I cannot see why');

    expect(ids.slice(0, 2)).toEqual(['system-deep-loop', 'command-doctor-deep-loop']);
  });

  it('falls back to the helper for a repair request with no ranked command', () => {
    expect(scoredIds('I have a problem and want the right repair path suggested with reasons')[0])
      .toBe('command-doctor-helper');
  });

  it('leaves a fixed problem with no doctor command', () => {
    const doctorIds = scoredIds('much appreciated, that fixed the problem completely')
      .filter((id) => id.startsWith(DOCTOR_PREFIX));

    expect(doctorIds).toEqual([]);
  });

  it('leaves an ordinary problem beside a passing skill with no doctor command', () => {
    const doctorIds = scoredIds('I have a problem with my CSS layout')
      .filter((id) => id.startsWith(DOCTOR_PREFIX));

    expect(doctorIds).toEqual([]);
  });
});

describe('runnableDoctorBridgeId', () => {
  it('finds a bridge whose policy runs', () => {
    expect(runnableDoctorBridgeId('/doctor:agents-md check', BRIDGE_PROJECTION))
      .toBe('command-doctor-agents-md-check');
  });

  it('finds no bridge when the command asks before it runs', () => {
    expect(runnableDoctorBridgeId('/doctor:git hooks', BRIDGE_PROJECTION)).toBeUndefined();
  });

  it('finds no bridge the projection does not hold', () => {
    expect(runnableDoctorBridgeId('/doctor:ci report', BRIDGE_PROJECTION)).toBeUndefined();
  });
});

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
  AdvisorScoredRecommendation,
  AdvisorScoringResult,
} from '../../lib/scorer/types.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROUTING = resolve(HERE, '../../scripts/routing-accuracy');
const BASELINE_PATH = join(ROUTING, 'scorer-eval-baseline.json');
const CORPUS_PATH = join(ROUTING, 'command-prompts.jsonl');
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
// SQLite loader return null, and the native lane-ranking overrides are cleared so the
// ordering is deterministic.
function freezeEvalEnv(): void {
  process.env.SYSTEM_SKILL_ADVISOR_DB_DIR = mkdtempSync(join(tmpdir(), 'advisor-doctor-handoff-'));
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

// Only a passing row is offered, so a case about the hand-off reads the passing
// doctor rows alone.
function passingDoctorIds(prompt: string): string[] {
  return scoreAdvisorPrompt(prompt, { workspaceRoot, projection })
    .recommendations
    .filter((recommendation) => recommendation.passes_threshold && recommendation.skill.startsWith(DOCTOR_PREFIX))
    .map((recommendation) => recommendation.skill);
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

  // The deep-loop doctor reads a deep run's state, so a prompt that shares its
  // keywords but names no deep run gets no passing doctor row.
  it.each([
    'research why the model needed more iterations to converge',
    'research why the model needed iterations to converge',
  ])('passes no deep-loop doctor row when no deep run is named: %s', (prompt) => {
    expect(passingDoctorIds(prompt)).not.toContain('command-doctor-deep-loop');
  });

  // The helper stands beside the skills for a tool that never appears. The row
  // is a tune prompt, so its wording may be read here after the split check.
  it('offers the helper beside the skills for a tool that does not show up', () => {
    const row = readFileSync(CORPUS_PATH, 'utf8')
      .split('\n')
      .filter((line) => line.trim() !== '')
      .map((line) => JSON.parse(line) as { id: string; split: string; prompt: string })
      .find((candidate) => candidate.id === 'cmd-doctor-mcp-plain-tune-01');

    expect(row).toBeDefined();
    if (!row) return;
    expect(row.split).toBe('tune');
    const ids = scoredIds(row.prompt);

    expect(ids[0]).toBe('mcp-code-mode');
    expect(ids.slice(0, 3)).toContain('command-doctor-helper');
  });

  // A skill that passed on shared single words holds no phrase of its own in the
  // prompt, so a bare problem word with a strong ranker match leads it.
  it('puts the ranked command before a skill that passed on shared words alone', () => {
    const ids = scoredIds('the agents md file is missing the gate sections');

    expect(ids[0]).toBe('command-doctor-agents-md-check');
    expect(ids).toContain('sk-doc');
  });

  // The same bare problem word beside a skill the prompt names with its own
  // phrase is ordinary work, however strongly the ranker matches.
  it('leaves a bare problem word beside a phrase-matched skill with no doctor command', () => {
    const ids = scoredIds('update the readme because the agents md sections are stale');

    expect(ids[0]).toBe('sk-doc');
    expect(ids.filter((id) => id.startsWith(DOCTOR_PREFIX))).toEqual([]);
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

  // A bare word that ordinary work also uses is a weak cue, so it needs a stronger ranker match than a strong cue.
  it.each([
    'the environment variable for the database url is missing in production',
    'the install step in our dockerfile is broken, the overlay filesystem is stale',
  ])('hands off no doctor command for the app problem %s', (prompt) => {
    expect(passingDoctorIds(prompt)).toEqual([]);
  });

  // The fused row, not only the withhold step. The plain "is stuck" complaint
  // reaches the doctor through the hub's command, so its fused row does not pass
  // on its own; "never converges" does, and the same complaint with a refusal of
  // any run or fix withholds it.
  it.each([
    ["the deep research run is stuck. please don't run anything", false],
    ["my deep research run is stuck and I don't want a fix", false],
    ["my deep research run is stuck and never converges. please don't run anything", false],
    ["my deep research run is stuck and never converges and I don't want a fix", false],
    ['my deep research run is stuck and never converges', true],
  ])('passes the deep-loop doctor on "%s": %s', (prompt, passes) => {
    expect(passingDoctorIds(prompt).includes('command-doctor-deep-loop')).toBe(passes);
  });

  it.each([
    ['AGENTS.md is missing the shipped sections', 'command-doctor-agents-md-check'],
    ['the symlink to the skilled checkout is broken', 'command-doctor-helper'],
  ])('still hands off %s', (prompt, id) => {
    expect(passingDoctorIds(prompt)).toContain(id);
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

// The deep loop's doctor runs a diagnosis and offers repairs, so a stuck-run
// complaint that refuses any run or fix keeps the row from passing, and so does a
// naming that refuses or asks about the doctor rather than asking for it. The
// plain complaint and a request for the doctor keep it.
describe('withholdDeepLoopDoctorWithoutRun', () => {
  const DOCTOR_ROW = {
    skill: 'command-doctor-deep-loop',
    kind: 'command',
    passes_threshold: true,
  } as unknown as AdvisorScoredRecommendation;

  async function doctorPasses(prompt: string): Promise<boolean> {
    const { withholdDeepLoopDoctorWithoutRun } = await import('../../lib/scorer/fusion.js');
    const [row] = withholdDeepLoopDoctorWithoutRun([DOCTOR_ROW], prompt.toLowerCase());
    return row.passes_threshold;
  }

  it.each([
    "the deep research run is stuck. please don't run anything",
    "my deep research run is stuck and I don't want a fix",
  ])('withholds the doctor on %s', async (prompt) => {
    expect(await doctorPasses(prompt)).toBe(false);
  });

  // A naming that refuses or asks about the doctor is not a request for it, and
  // the row must not survive on the strength of the reader having typed it.
  it.each([
    "my deep research run is stuck, don't run /doctor:deep-loop",
    'my deep research run is stuck, never run /doctor:deep-loop, just explain',
    'my deep research run is stuck, no fix please, /doctor:deep-loop',
    "what does /doctor:deep-loop do? don't run anything",
    'what does the /doctor:deep-loop command do?',
  ])('withholds the doctor on a refused or questioned naming: %s', async (prompt) => {
    expect(await doctorPasses(prompt)).toBe(false);
  });

  it('keeps the doctor on a plain stuck-run complaint', async () => {
    expect(await doctorPasses('my deep research run is stuck')).toBe(true);
  });

  // A bare naming on a stuck run is the reader typing the command they want, so
  // the row stays even though the naming carries no use verb.
  it('keeps the doctor the reader named on a stuck run', async () => {
    expect(await doctorPasses('my deep research run is stuck, /doctor:deep-loop')).toBe(true);
  });

  it('keeps the doctor the reader asked for despite the refusal', async () => {
    expect(await doctorPasses("my deep research run is stuck, don't fix anything, just run /doctor:deep-loop")).toBe(true);
  });
});

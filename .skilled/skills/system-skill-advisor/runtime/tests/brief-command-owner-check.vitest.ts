// ───────────────────────────────────────────────────────────────
// MODULE: Brief path command ownership
// ───────────────────────────────────────────────────────────────

// A subprocess row's command is text from the child, so both paths that print a
// recommendation read the same tracked-table check before a command reaches a
// reader: the CLI's degraded builder and the hook brief producer. These cases pin
// the brief path on that check, because it is the only one that renders rows
// straight from the child and used to print a command the row's own skill does
// not own.

import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  buildSkillAdvisorBrief,
  clearAdvisorBriefCacheForTests,
} from '../lib/skill-advisor-brief.js';
import type { AdvisorFreshnessResult } from '../lib/freshness.js';
import { getAdvisorFreshness } from '../lib/freshness.js';
import { runAdvisorSubprocess, type AdvisorRecommendation } from '../lib/subprocess.js';
import { trackedCommandForOwner } from '../lib/command-attach.js';
import { degradedRecommendations } from '../skill-advisor-cli.js';

vi.mock('../lib/freshness.js', () => ({
  getAdvisorFreshness: vi.fn(),
}));

vi.mock('../lib/subprocess.js', () => ({
  runAdvisorSubprocess: vi.fn(),
}));

const workspaceRoot = '/tmp/brief-command-owner-check';
const options = {
  workspaceRoot,
  runtime: 'opencode' as const,
};

// A prompt the policy fires on, so every case reaches the row it feeds in.
const PROMPT = 'implement feature X';

function freshness(): AdvisorFreshnessResult {
  return {
    state: 'live',
    generation: 1,
    sourceSignature: 'sig-live',
    skillFingerprints: new Map([
      ['sk-code', { skillMdMtime: 1, skillMdSize: 10, skillMdHash: 'hash-code', graphMetaMtime: 1, graphMetaHash: 'graph-code' }],
      ['sk-doc', { skillMdMtime: 1, skillMdSize: 10, skillMdHash: 'hash-doc', graphMetaMtime: 1, graphMetaHash: 'graph-doc' }],
    ]),
    fallbackMode: 'sqlite',
    probedAt: '2026-04-19T09:30:00.000Z',
    diagnostics: null,
  };
}

// A passing row, so a case fails on the field it asserts rather than on the
// threshold filter dropping the row before the ownership check is reached.
function row(overrides: Partial<AdvisorRecommendation> & { skill: string }): AdvisorRecommendation {
  return {
    confidence: 0.91,
    uncertainty: 0.1,
    passes_threshold: true,
    ...overrides,
  };
}

function serve(recommendation: AdvisorRecommendation): void {
  vi.mocked(runAdvisorSubprocess).mockResolvedValue({
    ok: true,
    recommendations: [recommendation],
    errorCode: null,
    exitCode: 0,
    signal: null,
    stderr: null,
    durationMs: 5,
    retriesAttempted: 0,
  });
}

beforeEach(() => {
  clearAdvisorBriefCacheForTests();
  vi.mocked(getAdvisorFreshness).mockReset();
  vi.mocked(runAdvisorSubprocess).mockReset();
  vi.mocked(getAdvisorFreshness).mockReturnValue(freshness());
});

describe('buildSkillAdvisorBrief command ownership', () => {
  it('drops a command the row’s skill does not own, keeping the skill', async () => {
    serve(row({
      skill: 'sk-code',
      command: '/deep:research',
      policy: 'ask',
      ownerSkillId: 'system-deep-loop',
    }));

    const result = await buildSkillAdvisorBrief(PROMPT, options);

    expect(result.status).toBe('ok');
    expect(result.brief).toContain('use sk-code 0.91/0.10 pass');
    expect(result.brief).not.toContain('/deep:research');
    expect(result.brief).not.toContain('system-deep-loop');
    expect(result.recommendations).toHaveLength(1);
    expect(result.recommendations[0]).toMatchObject({ skill: 'sk-code', confidence: 0.91 });
    expect(result.recommendations[0]).not.toHaveProperty('command');
    expect(result.recommendations[0]).not.toHaveProperty('policy');
    expect(result.recommendations[0]).not.toHaveProperty('ownerSkillId');
  });

  it('keeps an owned command and prints the tracked policy and owner, not the child’s', async () => {
    // The child's policy and owner differ from the tracked ones on purpose, so
    // the case fails if the brief passes the child's fields through.
    serve(row({
      skill: 'sk-doc',
      command: '/create:readme',
      policy: 'run',
      ownerSkillId: 'sk-code',
    }));

    const result = await buildSkillAdvisorBrief(PROMPT, options);

    expect(result.brief).toContain('use sk-doc → /create:readme (start) 0.91/0.10 pass');
    expect(result.recommendations[0]).toMatchObject({
      skill: 'sk-doc',
      command: '/create:readme',
      policy: 'start',
      ownerSkillId: 'sk-doc',
    });
  });

  it('reads a legacy mode id through its alias group, so the folded hub keeps the command', async () => {
    serve(row({
      skill: 'deep-research',
      command: '/deep:research',
      policy: 'ask',
      ownerSkillId: 'system-deep-loop',
    }));

    const result = await buildSkillAdvisorBrief(PROMPT, options);

    expect(result.brief).toContain('/deep:research');
    expect(result.recommendations[0]).toMatchObject({
      skill: 'deep-research',
      command: '/deep:research',
      policy: 'ask',
      ownerSkillId: 'system-deep-loop',
    });
  });

  it('leaves a row that carries no command untouched', async () => {
    serve(row({ skill: 'sk-code' }));

    const result = await buildSkillAdvisorBrief(PROMPT, options);

    expect(result.brief).toContain('use sk-code 0.91/0.10 pass');
    expect(result.recommendations[0]).toEqual({ skill: 'sk-code', confidence: 0.91, uncertainty: 0.1, passes_threshold: true });
  });
});

describe('both paths read one ownership check', () => {
  it.each([
    ['sk-code', '/deep:research'],
    ['sk-doc', '/deep:review'],
    ['sk-code', '/create:readme'],
  ])('a %s row carrying %s is refused on both paths', (skill, command) => {
    expect(trackedCommandForOwner(skill, command)).toBeUndefined();
    const degraded = degradedRecommendations(
      [{ skill, command, typed: true, confidence: 0.9, uncertainty: 0.1, passes_threshold: true }],
      PROMPT,
    );
    expect(degraded[0]).not.toHaveProperty('command');
  });

  it.each([
    ['sk-doc', '/create:readme'],
    ['deep-research', '/deep:research'],
  ])('a %s row carrying %s is owned on both paths', (skill, command) => {
    expect(trackedCommandForOwner(skill, command)).toMatchObject({ command });
    const degraded = degradedRecommendations(
      [{ skill, command, typed: true, confidence: 0.9, uncertainty: 0.1, passes_threshold: true }],
      PROMPT,
    );
    expect(degraded[0]).toMatchObject({ skillId: skill, command });
  });
});

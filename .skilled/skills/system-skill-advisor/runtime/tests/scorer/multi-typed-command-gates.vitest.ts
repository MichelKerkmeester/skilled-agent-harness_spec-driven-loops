// ───────────────────────────────────────────────────────────────
// MODULE: Gates that read every typed command
// ───────────────────────────────────────────────────────────────
// A prompt may type two commands, and a gate that asks "was this command typed"
// once read only the longest name, so the shorter command was lost and the gate
// decided as if the reader never typed it. These cases pin each such gate to the
// full list, and keep a control beside each that shows the typed command is what
// turns the gate.

import { describe, expect, it } from 'vitest';
import {
  rankTypedCommandOwnerFirst,
  withholdDeepLoopDoctorWithoutRun,
  withholdLoopHubOnWritingAbout,
  withholdWritingCommandsOnNoEdit,
} from '../../lib/scorer/fusion.js';
import type { AdvisorScoredRecommendation } from '../../lib/scorer/types.js';

function recommendation(
  skill: string,
  overrides: Partial<AdvisorScoredRecommendation> = {},
): AdvisorScoredRecommendation {
  return {
    skill,
    kind: 'skill',
    confidence: 0.9,
    uncertainty: 0.1,
    passes_threshold: true,
    reason: '',
    score: 1,
    laneContributions: [],
    dominantLane: null,
    lifecycleStatus: 'active',
    ...overrides,
  };
}

function commandRow(skill: string): AdvisorScoredRecommendation {
  return recommendation(skill, { kind: 'command' });
}

function keptSkills(ranked: readonly AdvisorScoredRecommendation[]): string[] {
  return ranked.filter((entry) => entry.passes_threshold).map((entry) => entry.skill);
}

describe('the loop hub on a piece about the loop', () => {
  const HUB = recommendation('system-deep-loop');

  it('keeps the hub when the piece also types a loop command beside a longer one', () => {
    const prompt = 'write a blog post about deep review loops, then /deep:review the parser and /create:changelog';
    const kept = withholdLoopHubOnWritingAbout([HUB, recommendation('sk-code')], prompt);
    expect(keptSkills(kept)).toContain('system-deep-loop');
  });

  it('still holds the hub back when the longer command is the only one typed', () => {
    const prompt = 'write a blog post about deep review loops and /create:changelog';
    const kept = withholdLoopHubOnWritingAbout([HUB, recommendation('sk-code')], prompt);
    expect(keptSkills(kept)).not.toContain('system-deep-loop');
  });
});

describe('the deep-loop doctor on a refused run', () => {
  const DOCTOR = commandRow('command-doctor-deep-loop');

  it('keeps the doctor the reader typed beside a longer command', () => {
    const prompt = "the importer keeps failing, don't fix anything, just run /doctor:deep-loop and later /create:manual-testing-playbook";
    const [kept] = withholdDeepLoopDoctorWithoutRun([DOCTOR], prompt);
    expect(kept?.passes_threshold).toBe(true);
  });

  it('withholds the doctor when a longer command is the only one typed', () => {
    const prompt = "the importer keeps failing, don't fix anything, just run /create:manual-testing-playbook";
    const [kept] = withholdDeepLoopDoctorWithoutRun([DOCTOR], prompt);
    expect(kept?.passes_threshold).toBe(false);
  });
});

describe('writing commands on a request that rules out edits', () => {
  const CHANGELOG = commandRow('command-create-changelog');
  const PLAYBOOK = commandRow('command-create-manual-testing-playbook');

  it('keeps a writing command the reader typed beside a longer one', () => {
    const prompt = "don't change any files, just run /create:changelog and later /create:manual-testing-playbook";
    const kept = withholdWritingCommandsOnNoEdit([CHANGELOG, PLAYBOOK], prompt);
    expect(keptSkills(kept)).toEqual(['command-create-changelog', 'command-create-manual-testing-playbook']);
  });

  it('withholds a writing command when a longer one is the only one typed', () => {
    const prompt = "don't change any files, just run /create:manual-testing-playbook";
    const [kept] = withholdWritingCommandsOnNoEdit([CHANGELOG], prompt);
    expect(kept?.passes_threshold).toBe(false);
  });
});

describe('the owner of a typed command with no scorer row', () => {
  function rankedSkills(
    ranked: readonly AdvisorScoredRecommendation[],
    promptLower: string,
  ): string[] {
    return rankTypedCommandOwnerFirst(ranked, promptLower).map((entry) => entry.skill);
  }

  it('moves the owner forward when the row-less command is typed beside a row that owns another', () => {
    const ranked = [recommendation('sk-code'), recommendation('sk-doc'), recommendation('system-spec-kit')];
    const prompt = '/speckit:handoff the session then /create:goal for the login spec';
    expect(rankedSkills(ranked, prompt)).toEqual(['sk-doc', 'sk-code', 'system-spec-kit']);
  });

  it('keeps the order when the typed command has a scorer row of its own', () => {
    const ranked = [recommendation('sk-code'), recommendation('sk-doc'), recommendation('system-spec-kit')];
    expect(rankedSkills(ranked, '/speckit:handoff the session')).toEqual(['sk-code', 'sk-doc', 'system-spec-kit']);
  });

  // Two row-less commands name two owners, and only one can lead, so the
  // highest-ranked owner the ranking already holds takes the front.
  it('leads with the highest-ranked owner among two row-less typed commands', () => {
    const ranked = [recommendation('sk-code'), recommendation('sk-design'), recommendation('sk-doc')];
    const prompt = '/create:goal for the login spec and /design:chart the latency data';
    expect(rankedSkills(ranked, prompt)).toEqual(['sk-design', 'sk-code', 'sk-doc']);
  });
});

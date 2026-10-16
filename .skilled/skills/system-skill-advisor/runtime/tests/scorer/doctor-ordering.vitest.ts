// ───────────────────────────────────────────────────────────────
// MODULE: Doctor Bridge Ordering
// ───────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';
import {
  isDoctorCommandTyped,
  keepPassingSkillsAboveDoctorBridges,
  requireDoctorPhraseAnchor,
} from '../../lib/scorer/fusion.js';
import type { AdvisorScoredRecommendation } from '../../lib/scorer/types.js';

describe('isDoctorCommandTyped', () => {
  it('accepts a leading doctor command after whitespace', () => {
    expect(isDoctorCommandTyped('  /doctor:x')).toBe(true);
  });

  it.each([
    ['run /doctor:x', true],
    ['kick off /doctor:x', true],
    ['rerun /doctor:x', false],
    ["don't run /doctor:x", true],
    ['run `/doctor:x`', false],
    ['the hook that /doctor:git setup lists', false],
    ['say "run /doctor:x"', false],
  ] as const)('detects typed invocation boundaries in %s', (prompt, expected) => {
    expect(isDoctorCommandTyped(prompt)).toBe(expected);
  });
});

// A typed doctor command moves its matching passing bridge ahead of passing skills.
describe('doctor bridge ordering', () => {
  it('moves a doctor bridge below the passing skill', () => {
    const ranked = [
      rec('command-doctor-git-setup', 'command', true),
      rec('sk-git', 'skill', true),
    ];

    const result = keepPassingSkillsAboveDoctorBridges(ranked, 'check my git hooks setup');

    expect(result.map((recommendation) => recommendation.skill)).toEqual([
      'sk-git',
      'command-doctor-git-setup',
    ]);
  });

  it('moves passing doctor bridges after the second passing skill in order', () => {
    const ranked = [
      rec('command-doctor-a', 'command', true),
      rec('sk-code', 'skill', true),
      rec('command-doctor-b', 'command', true),
      rec('sk-git', 'skill', true),
      rec('sk-ops', 'skill', true),
      rec('sk-doc', 'skill', false),
    ];

    const result = keepPassingSkillsAboveDoctorBridges(ranked, 'check my git hooks setup');

    expect(result.map((recommendation) => recommendation.skill)).toEqual([
      'sk-code',
      'sk-git',
      'command-doctor-a',
      'command-doctor-b',
      'sk-ops',
      'sk-doc',
    ]);
  });

  it('puts a passing doctor bridge at index two when three skills pass', () => {
    const ranked = [
      rec('sk-code', 'skill', true),
      rec('sk-git', 'skill', true),
      rec('sk-doc', 'skill', true),
      rec('command-doctor-setup', 'command', true),
    ];

    const result = keepPassingSkillsAboveDoctorBridges(ranked, 'check my tooling');

    expect(result.map((recommendation) => recommendation.skill)).toEqual([
      'sk-code',
      'sk-git',
      'command-doctor-setup',
      'sk-doc',
    ]);
  });

  it('moves the invoked passing doctor bridge first', () => {
    const ranked = [
      rec('sk-code', 'skill', true),
      rec('command-doctor-setup', 'command', true),
    ];

    const result = keepPassingSkillsAboveDoctorBridges(
      ranked,
      'please run /doctor:setup for me',
    );

    expect(result.map((recommendation) => recommendation.skill)).toEqual([
      'command-doctor-setup',
      'sk-code',
    ]);
  });

  it('keeps a doctor bridge first when the prompt types a doctor slash command', () => {
    const ranked = [
      rec('command-doctor-git', 'command', true),
      rec('command-doctor-git-setup', 'command', true),
      rec('sk-git', 'skill', true),
    ];

    const result = keepPassingSkillsAboveDoctorBridges(
      ranked,
      '/doctor:git setup lists',
    );

    expect(result.map((recommendation) => recommendation.skill)).toEqual([
      'command-doctor-git-setup',
      'command-doctor-git',
      'sk-git',
    ]);
  });

  it('moves a doctor bridge below the passing skill when the prompt quotes the command', () => {
    const ranked = [
      rec('command-doctor-git-setup', 'command', true),
      rec('sk-git', 'skill', true),
    ];

    const result = keepPassingSkillsAboveDoctorBridges(
      ranked,
      'see the output of `/doctor:git setup`',
    );

    expect(result.map((recommendation) => recommendation.skill)).toEqual([
      'sk-git',
      'command-doctor-git-setup',
    ]);
  });

  it('puts the matching skill bridge first when its id appears in the slash command', () => {
    const ranked = [
      rec('sk-code', 'skill', true),
      rec('command-doctor-sk-code', 'command', true),
    ];

    const result = keepPassingSkillsAboveDoctorBridges(ranked, '/doctor:sk-code');

    expect(result.map((recommendation) => recommendation.skill)).toEqual([
      'command-doctor-sk-code',
      'sk-code',
    ]);
  });

  it('keeps scored order when a typed command has no matching passing bridge', () => {
    const ranked = [
      rec('sk-code', 'skill', true),
      rec('command-doctor-setup', 'command', true),
    ];

    const result = keepPassingSkillsAboveDoctorBridges(ranked, '/doctor:sk-code');

    expect(result.map((recommendation) => recommendation.skill)).toEqual([
      'sk-code',
      'command-doctor-setup',
    ]);
  });

  it('keeps a nonpassing doctor bridge in place while moving passing bridges', () => {
    const ranked = [
      rec('command-doctor-setup', 'command', true),
      rec('sk-code', 'skill', true),
      rec('sk-git', 'skill', true),
      rec('command-doctor-stale', 'command', false),
    ];

    const result = keepPassingSkillsAboveDoctorBridges(ranked, 'check my tools');

    expect(result.map((recommendation) => recommendation.skill)).toEqual([
      'sk-code',
      'sk-git',
      'command-doctor-setup',
      'command-doctor-stale',
    ]);
  });

  it('keeps a doctor bridge first when no skill passes', () => {
    const ranked = [
      rec('command-doctor-setup', 'command', true),
      rec('sk-code', 'skill', false),
    ];

    const result = keepPassingSkillsAboveDoctorBridges(ranked, 'check my git hooks setup');

    expect(result.map((recommendation) => recommendation.skill)).toEqual([
      'command-doctor-setup',
      'sk-code',
    ]);
  });

  it('leaves non-doctor commands where they are', () => {
    const ranked = [
      rec('memory:save', 'command', true),
      rec('system-spec-kit', 'skill', true),
    ];

    const result = keepPassingSkillsAboveDoctorBridges(ranked, 'save context');

    expect(result.map((recommendation) => recommendation.skill)).toEqual([
      'memory:save',
      'system-spec-kit',
    ]);
  });

  it('does not mutate its input array', () => {
    const ranked = Object.freeze([
      rec('command-doctor-git-setup', 'command', true),
      rec('sk-git', 'skill', true),
    ]);

    expect(() => keepPassingSkillsAboveDoctorBridges(ranked, 'check my git hooks setup')).not.toThrow();

    expect(ranked.map((recommendation) => recommendation.skill)).toEqual([
      'command-doctor-git-setup',
      'sk-git',
    ]);
  });
});

describe('requireDoctorPhraseAnchor', () => {
  const withLanes = (
    recommendation: AdvisorScoredRecommendation,
    laneContributions: AdvisorScoredRecommendation['laneContributions'],
  ): AdvisorScoredRecommendation => ({ ...recommendation, laneContributions });

  it('drops a doctor bridge that passed on shared tokens alone', () => {
    const ranked = [
      withLanes(rec('command-doctor-git-setup', 'command', true), [
        {
          lane: 'lexical',
          rawScore: 0.25,
          weightedScore: 0,
          weight: 0,
          evidence: ['token:git'],
          shadowOnly: false,
        },
      ]),
    ];

    const result = requireDoctorPhraseAnchor(ranked);

    expect(result[0].passes_threshold).toBe(false);
  });

  it('keeps a doctor bridge anchored on its own phrase', () => {
    const ranked = [
      withLanes(rec('command-doctor-git-setup', 'command', true), [
        {
          lane: 'explicit_author',
          rawScore: 1,
          weightedScore: 0,
          weight: 0,
          evidence: ['author:disable comment hygiene gate'],
          shadowOnly: false,
        },
      ]),
    ];

    const result = requireDoctorPhraseAnchor(ranked);

    expect(result[0].passes_threshold).toBe(true);
  });

  it('leaves skills and non-doctor commands alone', () => {
    const lexicalOnly: AdvisorScoredRecommendation['laneContributions'] = [
      {
        lane: 'lexical',
        rawScore: 0.25,
        weightedScore: 0,
        weight: 0,
        evidence: ['token:git'],
        shadowOnly: false,
      },
    ];

    const ranked = [
      withLanes(rec('sk-git', 'skill', true), lexicalOnly),
      withLanes(rec('memory:save', 'command', true), lexicalOnly),
    ];

    const result = requireDoctorPhraseAnchor(ranked);

    expect(result.map((recommendation) => recommendation.passes_threshold)).toEqual([true, true]);
  });

  it('does not revive a doctor bridge that was not passing', () => {
    const ranked = [
      withLanes(rec('command-doctor-git-setup', 'command', false), [
        {
          lane: 'explicit_author',
          rawScore: 1,
          weightedScore: 0,
          weight: 0,
          evidence: ['author:disable comment hygiene gate'],
          shadowOnly: false,
        },
      ]),
    ];

    const result = requireDoctorPhraseAnchor(ranked);

    expect(result[0].passes_threshold).toBe(false);
  });
});

function rec(
  skill: string,
  kind: 'skill' | 'command',
  passes: boolean,
): AdvisorScoredRecommendation {
  return {
    skill,
    kind,
    confidence: 0.9,
    uncertainty: 0.2,
    passes_threshold: passes,
    reason: '',
    score: 1,
    laneContributions: [],
    dominantLane: null,
    lifecycleStatus: 'active',
  };
}

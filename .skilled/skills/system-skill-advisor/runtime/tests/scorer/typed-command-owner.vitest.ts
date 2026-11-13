// ───────────────────────────────────────────────────────────────
// MODULE: Typed Command Owner Tests
// ───────────────────────────────────────────────────────────────
// A typed command that has no scorer row of its own is invisible to the scorer,
// so the only path from the prompt to the command runs through the skill that
// owns it. These cases pin that the owner leads, and that every other ordering
// rule still decides the list.

import { describe, expect, it } from 'vitest';
import { rankTypedCommandOwnerFirst } from '../../lib/scorer/fusion.js';
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

function rankedSkills(
  ranked: readonly AdvisorScoredRecommendation[],
  promptLower: string,
): string[] {
  return rankTypedCommandOwnerFirst(ranked, promptLower).map((entry) => entry.skill);
}

describe('a typed command without a scorer row leads through its owner', () => {
  it('moves the passing owner to the front and keeps the rest in order', () => {
    const ranked = [
      recommendation('sk-code'),
      recommendation('sk-doc'),
      recommendation('sk-prompt'),
    ];
    expect(rankedSkills(ranked, '/create:goal x')).toEqual(['sk-doc', 'sk-code', 'sk-prompt']);
  });

  it('keeps the order when the owner does not pass the threshold', () => {
    const ranked = [
      recommendation('sk-code'),
      recommendation('sk-doc', { passes_threshold: false }),
    ];
    expect(rankedSkills(ranked, '/create:goal x')).toEqual(['sk-code', 'sk-doc']);
  });

  it('keeps the order when the typed command has a scorer row', () => {
    const ranked = [
      recommendation('sk-code'),
      recommendation('system-spec-kit'),
    ];
    expect(rankedSkills(ranked, '/speckit:save x')).toEqual(['sk-code', 'system-spec-kit']);
  });

  it('keeps the order when the prompt types no command', () => {
    const ranked = [
      recommendation('sk-code'),
      recommendation('sk-doc'),
    ];
    expect(rankedSkills(ranked, 'create a goal for the utils folder')).toEqual(['sk-code', 'sk-doc']);
  });
});

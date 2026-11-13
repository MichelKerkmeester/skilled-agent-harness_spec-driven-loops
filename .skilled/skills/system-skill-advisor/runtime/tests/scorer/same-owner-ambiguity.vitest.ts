// ───────────────────────────────────────────────────────────────
// MODULE: Command Bridge Owner Ambiguity
// ───────────────────────────────────────────────────────────────
// A command bridge row and the skill that owns its command are one answer, so a
// near-tie between them is a single route rather than a coin flip. Two skills,
// or a command row next to a skill that does not own it, are still a real tie:
// the exclusion covers the owner pair and nothing around it.
//
// Ownership is published by the generated bridge data, so the fixture resolves
// the pair from that data instead of inventing ids whose shape proves nothing.

import { describe, expect, it } from 'vitest';
import { applyAmbiguity, isAmbiguousTopTwo } from '../../lib/scorer/ambiguity.js';
import { COMMAND_BRIDGES } from '../../lib/scorer/projection.js';
import type { AdvisorScoredRecommendation } from '../../lib/scorer/types.js';

function resolveOwnedBridge(): { readonly bridgeId: string; readonly ownerSkill: string } {
  const [bridge] = COMMAND_BRIDGES.filter(
    (entry) => entry.id === 'command-speckit-plan' && entry.ownerSkill,
  );
  if (!bridge?.ownerSkill) {
    throw new Error(
      'no owning skill is recorded for command-speckit-plan in the bridge data; '
      + 'the fixture cannot resolve an owner pair',
    );
  }
  return { bridgeId: bridge.id, ownerSkill: bridge.ownerSkill };
}

const { bridgeId: BRIDGE_ID, ownerSkill: OWNER_SKILL } = resolveOwnedBridge();
// A skill that runs none of this command's workflow, so the pair stays a choice.
const RIVAL_SKILL = 'sk-code';

function recommendation(
  overrides: Partial<AdvisorScoredRecommendation> & Pick<AdvisorScoredRecommendation, 'skill'>,
): AdvisorScoredRecommendation {
  const { skill: skillId, ...rest } = overrides;
  return {
    skill: skillId,
    kind: 'skill',
    confidence: 0.82,
    uncertainty: 0.16,
    passes_threshold: true,
    reason: '',
    score: 0.95,
    laneContributions: [],
    dominantLane: null,
    lifecycleStatus: 'active',
    ...rest,
  };
}

// A bridge row ties with its owner by construction here: the live pair that
// reported ambiguity carried the same confidence, so the fixture holds
// confidence equal and the score gap inside the margin.
function tiedPair(
  first: Partial<AdvisorScoredRecommendation> & Pick<AdvisorScoredRecommendation, 'skill'>,
  second: Partial<AdvisorScoredRecommendation> & Pick<AdvisorScoredRecommendation, 'skill'>,
): AdvisorScoredRecommendation[] {
  return [
    recommendation({ score: 0.95, ...first }),
    recommendation({ score: 0.93, ...second }),
  ];
}

describe('command bridge row and its owning skill', () => {
  it('is not ambiguous when the command row leads', () => {
    const recommendations = tiedPair(
      { skill: BRIDGE_ID, kind: 'command' },
      { skill: OWNER_SKILL },
    );

    expect(isAmbiguousTopTwo(recommendations)).toBe(false);
    const result = applyAmbiguity(recommendations);
    expect(result.find((entry) => entry.skill === BRIDGE_ID)?.ambiguousWith).toBeUndefined();
    expect(result.find((entry) => entry.skill === OWNER_SKILL)?.ambiguousWith).toBeUndefined();
  });

  it('is not ambiguous when the owning skill leads', () => {
    const recommendations = tiedPair(
      { skill: OWNER_SKILL },
      { skill: BRIDGE_ID, kind: 'command' },
    );

    expect(isAmbiguousTopTwo(recommendations)).toBe(false);
    const result = applyAmbiguity(recommendations);
    expect(result.find((entry) => entry.skill === OWNER_SKILL)?.ambiguousWith).toBeUndefined();
    expect(result.find((entry) => entry.skill === BRIDGE_ID)?.ambiguousWith).toBeUndefined();
  });
});

describe('pairs that are still rivals', () => {
  it('flags two unrelated skills tied within the margin', () => {
    const recommendations = tiedPair(
      { skill: 'sk-code' },
      { skill: 'sk-prompt' },
    );

    expect(isAmbiguousTopTwo(recommendations)).toBe(true);
    const result = applyAmbiguity(recommendations);
    expect(result.find((entry) => entry.skill === 'sk-code')?.ambiguousWith).toEqual(['sk-prompt']);
    expect(result.find((entry) => entry.skill === 'sk-prompt')?.ambiguousWith).toEqual(['sk-code']);
  });

  it('flags a command row tied with a skill that does not own its command', () => {
    const recommendations = tiedPair(
      { skill: BRIDGE_ID, kind: 'command' },
      { skill: RIVAL_SKILL },
    );

    expect(isAmbiguousTopTwo(recommendations)).toBe(true);
    const result = applyAmbiguity(recommendations);
    expect(result.find((entry) => entry.skill === BRIDGE_ID)?.ambiguousWith).toEqual([RIVAL_SKILL]);
  });

  it('flags the cluster again once a third, unrelated skill ties', () => {
    // Only the top row and its own answer may share the cluster; one competing
    // skill among them makes the ranking a real choice again, while the owner
    // stays outside the cluster as the same answer written twice.
    const recommendations = [
      recommendation({ skill: BRIDGE_ID, kind: 'command', score: 0.95 }),
      recommendation({ skill: OWNER_SKILL, score: 0.93 }),
      recommendation({ skill: RIVAL_SKILL, score: 0.92 }),
    ];

    expect(isAmbiguousTopTwo(recommendations)).toBe(true);
    const result = applyAmbiguity(recommendations);
    expect(result.find((entry) => entry.skill === BRIDGE_ID)?.ambiguousWith).toEqual([RIVAL_SKILL]);
    expect(result.find((entry) => entry.skill === RIVAL_SKILL)?.ambiguousWith).toEqual([BRIDGE_ID]);
    expect(result.find((entry) => entry.skill === OWNER_SKILL)?.ambiguousWith).toBeUndefined();
  });
});

// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Self-Recommendation Penalty Contract
// ───────────────────────────────────────────────────────────────
// Locks the implicit `auditRecsAdvisorPenalty` that keeps the advisor from
// recommending itself on a read-only "audit the recommendation quality" prompt.
// The explicit opt-in guard that used to back this up was removed as redundant
// because this penalty already fires, so this penalty is now the SOLE defense.
// These tests fire it in the production-default state (guard flag OFF) and break
// loudly if a refactor removes, zeroes, or makes the penalty non-negative.
//
// The competitor skill id sorts AFTER 'system-skill-advisor' alphabetically and
// carries an identical explicit-author signal, so the two tie on base score.
// Absent the penalty the alphabetical tie-break would put the advisor FIRST, so
// the only thing that demotes the advisor below the competitor is the penalty —
// remove it and the ranking assertions flip and fail.

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  ADVISOR_SELF_RECOMMENDATION_GUARD_FLAG,
  scoreAdvisorPrompt,
} from '../../lib/scorer/fusion.js';
import { createFixtureProjection } from '../../lib/scorer/projection.js';
import { SCORING_CALIBRATION } from '../../lib/scorer/scoring-constants.js';
import type { SkillProjection } from '../../lib/scorer/types.js';

function skill(overrides: Partial<SkillProjection> & Pick<SkillProjection, 'id'>): SkillProjection {
  return {
    id: overrides.id,
    kind: 'skill',
    family: 'system',
    category: 'test',
    name: overrides.id,
    description: '',
    keywords: [],
    domains: [],
    intentSignals: [],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: `.opencode/skills/${overrides.id}/graph-metadata.json`,
    lifecycleStatus: 'active',
    ...Object.fromEntries(Object.entries(overrides).filter(([key]) => key !== 'id')),
  };
}

const AUDIT_PROMPT = 'audit recommendation quality';
// Sorts after 'system-skill-advisor', so a score tie would otherwise resolve in
// the advisor's favor — the penalty is what flips the order.
const COMPETITOR_ID = 'zzz-review';

function auditProjection() {
  return createFixtureProjection([
    skill({ id: 'system-skill-advisor', intentSignals: ['recommendation quality'] }),
    skill({ id: COMPETITOR_ID, intentSignals: ['recommendation quality'] }),
  ]);
}

function scoreAudit(prompt: string, projection: ReturnType<typeof auditProjection>) {
  return scoreAdvisorPrompt(prompt, {
    workspaceRoot: process.cwd(),
    projection,
    includeAllCandidates: true,
    confidenceThreshold: 0,
    uncertaintyThreshold: 1,
  });
}

describe('advisor self-recommendation penalty contract', () => {
  let previousGuardFlag: string | undefined;

  beforeEach(() => {
    // Pin the production-default state: the explicit opt-in guard is OFF, so the
    // implicit penalty in primaryIntentBonus is the only thing demoting the
    // advisor on an audit prompt.
    previousGuardFlag = process.env[ADVISOR_SELF_RECOMMENDATION_GUARD_FLAG];
    delete process.env[ADVISOR_SELF_RECOMMENDATION_GUARD_FLAG];
  });

  afterEach(() => {
    if (previousGuardFlag === undefined) {
      delete process.env[ADVISOR_SELF_RECOMMENDATION_GUARD_FLAG];
    } else {
      process.env[ADVISOR_SELF_RECOMMENDATION_GUARD_FLAG] = previousGuardFlag;
    }
  });

  it('is a negative penalty in the calibration constants', () => {
    // A removal or sign-flip of the constant is the failure this whole suite
    // guards against; assert the contract value directly so the break is obvious.
    expect(SCORING_CALIBRATION.routing.auditRecsAdvisorPenalty).toBeLessThan(0);
  });

  it('keeps system-skill-advisor off the top spot on an audit prompt with the guard OFF', () => {
    const result = scoreAudit(AUDIT_PROMPT, auditProjection());

    expect(result.recommendations[0].skill).not.toBe('system-skill-advisor');
    expect(result.recommendations[0].skill).toBe(COMPETITOR_ID);
    expect(result.topSkill).not.toBe('system-skill-advisor');
  });

  it('demotes the advisor below a score-tied competitor that would otherwise win the tie-break', () => {
    // Both skills tie on base score; the competitor sorts after the advisor, so
    // without the penalty the advisor wins the alphabetical tie-break and ranks
    // first. The penalty is the only thing that puts the competitor above the
    // advisor here — remove or zero it and this ordering flips.
    const result = scoreAudit(AUDIT_PROMPT, auditProjection());

    const advisorRank = result.recommendations.findIndex((rec) => rec.skill === 'system-skill-advisor');
    const competitorRank = result.recommendations.findIndex((rec) => rec.skill === COMPETITOR_ID);

    expect(advisorRank).toBeGreaterThanOrEqual(0);
    expect(competitorRank).toBeGreaterThanOrEqual(0);
    expect(competitorRank).toBeLessThan(advisorRank);
  });

  it('does not penalize the advisor when the prompt is not a recommendation audit', () => {
    // Negative control: the penalty is scoped to audit/recommendation-quality
    // prompts. On a non-audit prompt where the advisor wins the tie-break, it
    // must stay first — proving the penalty is conditional, not a blanket
    // suppression, and that the audit demotion above is caused by the audit
    // intent rather than by the fixture shape.
    const projection = createFixtureProjection([
      skill({ id: 'system-skill-advisor', intentSignals: ['skill advisor routing'] }),
      skill({ id: COMPETITOR_ID, intentSignals: ['skill advisor routing'] }),
    ]);

    const result = scoreAudit('use the skill advisor routing', projection);

    const advisorRank = result.recommendations.findIndex((rec) => rec.skill === 'system-skill-advisor');
    const competitorRank = result.recommendations.findIndex((rec) => rec.skill === COMPETITOR_ID);
    expect(advisorRank).toBeGreaterThanOrEqual(0);
    expect(competitorRank).toBeGreaterThanOrEqual(0);
    // No audit penalty applies, so the advisor keeps the tie-break lead.
    expect(advisorRank).toBeLessThan(competitorRank);
  });
});

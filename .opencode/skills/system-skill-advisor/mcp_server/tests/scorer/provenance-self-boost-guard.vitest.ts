import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  ADVISOR_SELF_RECOMMENDATION_GUARD_FLAG,
  scoreAdvisorPrompt,
} from '../../lib/scorer/fusion.js';
import { scoreExplicitLane } from '../../lib/scorer/lanes/explicit.js';
import { createFixtureProjection } from '../../lib/scorer/projection.js';
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

describe('advisor provenance self-boost guard', () => {
  let previousGuardFlag: string | undefined;

  beforeEach(() => {
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

  it('keeps producer identity out of the default explicit-author lane output', () => {
    const projection = createFixtureProjection([
      skill({ id: 'alpha', intentSignals: ['alpha exact route'] }),
    ]);

    const [match] = scoreExplicitLane('alpha exact route', projection);

    expect(match).toEqual({
      skillId: 'alpha',
      lane: 'explicit_author',
      score: 1,
      evidence: ['explicit:alpha', 'author:alpha exact route'],
    });
  });

  it('threads producer identity when the self-recommendation guard is enabled', () => {
    const projection = createFixtureProjection([
      skill({ id: 'alpha', intentSignals: ['alpha exact route'] }),
    ]);

    const [match] = scoreExplicitLane('alpha exact route', projection, {
      includeProducerIdentity: true,
    });

    expect(match).toEqual({
      skillId: 'alpha',
      lane: 'explicit_author',
      score: 1,
      evidence: ['explicit:alpha', 'author:alpha exact route'],
      producerSkillIds: ['alpha'],
    });
  });

  it('leaves non-advisor explicit-author routing byte-identical when enabled', () => {
    const projection = createFixtureProjection([
      skill({ id: 'alpha', intentSignals: ['alpha exact route'] }),
      skill({ id: 'beta', intentSignals: ['beta exact route'] }),
    ]);
    const prompt = 'run alpha exact route';
    const off = scoreAdvisorPrompt(prompt, {
      workspaceRoot: process.cwd(),
      projection,
      includeAllCandidates: true,
    });

    process.env[ADVISOR_SELF_RECOMMENDATION_GUARD_FLAG] = '1';
    const on = scoreAdvisorPrompt(prompt, {
      workspaceRoot: process.cwd(),
      projection,
      includeAllCandidates: true,
    });

    expect(on).toEqual(off);
  });

  it('generalizes the recommendation-audit penalty to advisor aliases when enabled', () => {
    const projection = createFixtureProjection([
      skill({ id: 'skill-advisor', intentSignals: ['recommendation quality'] }),
      skill({ id: 'zzz-review', intentSignals: ['recommendation quality'] }),
    ]);
    const prompt = 'audit recommendation quality';

    const off = scoreAdvisorPrompt(prompt, {
      workspaceRoot: process.cwd(),
      projection,
      includeAllCandidates: true,
    });

    process.env[ADVISOR_SELF_RECOMMENDATION_GUARD_FLAG] = '1';
    const on = scoreAdvisorPrompt(prompt, {
      workspaceRoot: process.cwd(),
      projection,
      includeAllCandidates: true,
    });

    expect(off.recommendations[0].skill).toBe('skill-advisor');
    expect(on.recommendations[0].skill).toBe('zzz-review');
  });

  it('preserves the existing system advisor audit penalty', () => {
    const projection = createFixtureProjection([
      skill({ id: 'system-skill-advisor', intentSignals: ['recommendation quality'] }),
      skill({ id: 'zzz-review', intentSignals: ['recommendation quality'] }),
    ]);
    const prompt = 'audit recommendation quality';

    const off = scoreAdvisorPrompt(prompt, {
      workspaceRoot: process.cwd(),
      projection,
      includeAllCandidates: true,
    });

    process.env[ADVISOR_SELF_RECOMMENDATION_GUARD_FLAG] = '1';
    const on = scoreAdvisorPrompt(prompt, {
      workspaceRoot: process.cwd(),
      projection,
      includeAllCandidates: true,
    });

    expect(off.recommendations[0].skill).toBe('zzz-review');
    expect(on.recommendations[0].skill).toBe('zzz-review');
  });
});

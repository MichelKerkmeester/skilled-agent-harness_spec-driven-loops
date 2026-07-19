import { describe, expect, it } from 'vitest';
import { scoreAdvisorPrompt } from '../../lib/scorer/fusion.js';
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

describe('advisor provenance self-boost and audit penalty', () => {
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

  it('threads producer identity when includeProducerIdentity is requested', () => {
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

  it('routes a non-advisor explicit-author prompt to the matching skill', () => {
    const projection = createFixtureProjection([
      skill({ id: 'alpha', intentSignals: ['alpha exact route'] }),
      skill({ id: 'beta', intentSignals: ['beta exact route'] }),
    ]);

    const result = scoreAdvisorPrompt('run alpha exact route', {
      workspaceRoot: process.cwd(),
      projection,
      includeAllCandidates: true,
    });

    expect(result.recommendations[0].skill).toBe('alpha');
  });

  it('applies the recommendation-audit penalty to the advisor alias', () => {
    // The audit penalty is applied through the canonical self-rec id set, which
    // covers the 'skill-advisor' alias as well as the exact id, so the alias is
    // demoted below a score-tied competitor that sorts after it. The alias must
    // behave like the canonical id, not win the tie-break.
    const projection = createFixtureProjection([
      skill({ id: 'skill-advisor', intentSignals: ['recommendation quality'] }),
      skill({ id: 'zzz-review', intentSignals: ['recommendation quality'] }),
    ]);

    const result = scoreAdvisorPrompt('audit recommendation quality', {
      workspaceRoot: process.cwd(),
      projection,
      includeAllCandidates: true,
    });

    expect(result.recommendations[0].skill).toBe('zzz-review');
  });

  it('applies the recommendation-audit penalty to the canonical advisor id', () => {
    const projection = createFixtureProjection([
      skill({ id: 'system-skill-advisor', intentSignals: ['recommendation quality'] }),
      skill({ id: 'zzz-review', intentSignals: ['recommendation quality'] }),
    ]);

    const result = scoreAdvisorPrompt('audit recommendation quality', {
      workspaceRoot: process.cwd(),
      projection,
      includeAllCandidates: true,
    });

    expect(result.recommendations[0].skill).toBe('zzz-review');
  });
});

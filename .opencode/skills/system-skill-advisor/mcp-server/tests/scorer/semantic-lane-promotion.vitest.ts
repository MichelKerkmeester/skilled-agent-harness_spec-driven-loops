// ───────────────────────────────────────────────────────────────
// MODULE: Semantic Lane Promotion Tests
// ───────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import { SCORER_LANE_REGISTRY, isLiveScorerLane } from '../../lib/scorer/lane-registry.js';
import { DEFAULT_SCORER_WEIGHTS, liveWeightTotal } from '../../lib/scorer/weights-config.js';
import { scoreAdvisorPrompt } from '../../lib/scorer/fusion.js';
import { createFixtureProjection } from '../../lib/scorer/projection.js';
import type { SkillProjection } from '../../lib/scorer/types.js';

function skill(overrides: Partial<SkillProjection> & Pick<SkillProjection, 'id'>): SkillProjection {
  return {
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
    sourcePath: null,
    lifecycleStatus: 'active',
    ...overrides,
    id: overrides.id,
  };
}

const projection = createFixtureProjection([
  skill({
    id: 'sk-code',
    description: 'OpenCode system implementation for TypeScript, Vitest, MCP, code graph scan features, and tests.',
    keywords: ['opencode', 'typescript', 'vitest', 'mcp'],
    domains: ['code', 'implementation', 'tests'],
    intentSignals: ['implement code graph scan feature with tests', 'write system code'],
  }),
  skill({
    id: 'sk-code-review',
    description: 'Code review, pull request audit, regression finding, and release readiness feedback.',
    keywords: ['review', 'pull request', 'regression'],
    domains: ['review', 'audit'],
    intentSignals: ['review pull request regressions', 'audit code changes'],
  }),
  skill({
    id: 'system-code-graph',
    description: 'Structural code search, code graph context, and impact analysis for locating implementation patterns.',
    keywords: ['code graph', 'structural search', 'find code'],
    domains: ['search', 'code discovery'],
    intentSignals: ['code search', 'find implementation patterns'],
  }),
  skill({
    id: 'system-spec-kit',
    description: 'Spec folders, packet documentation, implementation summaries, decisions, and memory workflows.',
    keywords: ['spec folder', 'packet', 'implementation summary'],
    domains: ['spec-kit', 'memory'],
    intentSignals: ['spec packet docs', 'implementation summary'],
  }),
  skill({
    id: 'memory:save',
    kind: 'command',
    description: 'Memory save command bridge for preserving session context.',
    keywords: ['/memory:save', 'save context', 'save memory'],
    domains: ['memory', 'command'],
    intentSignals: ['/memory:save', 'save context', 'save memory', 'preserve next session'],
  }),
]);

describe('semantic lane promotion', () => {
  it('keeps the promoted live weights normalized', () => {
    expect(isLiveScorerLane('semantic_shadow')).toBe(true);
    expect(SCORER_LANE_REGISTRY.find((lane) => lane.id === 'semantic_shadow')).toMatchObject({
      weight: 0.05,
      live: true,
    });
    expect(liveWeightTotal()).toBeCloseTo(1, 10);
    expect(Object.values(DEFAULT_SCORER_WEIGHTS).reduce((total, weight) => total + weight, 0)).toBeCloseTo(1, 10);
  });

  it.each([
    ['implement a new code-graph scan feature with tests', 'sk-code'],
    ['save context for the next session', 'memory:save'],
    ['review this pull request for regressions', 'sk-code-review'],
    ['use code search to find implementation patterns', 'system-code-graph'],
    ['update the packet implementation-summary docs', 'system-spec-kit'],
  ])('keeps pre-promotion routing stable for %s', (prompt, expectedSkill) => {
    const result = scoreAdvisorPrompt(prompt, {
      workspaceRoot: process.cwd(),
      projection,
    });

    expect(result.topSkill).toBe(expectedSkill);
    expect(result.metrics.liveLaneCount).toBe(5);
  });
});

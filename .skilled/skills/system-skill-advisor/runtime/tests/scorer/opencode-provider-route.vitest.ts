// ───────────────────────────────────────────────────────────────
// MODULE: OpenCode Provider Route Explicit Lane Tests
// ───────────────────────────────────────────────────────────────
// "OpenCode Go" names a provider route the CLI hub dispatches to, while the
// code hub owns OpenCode's authoring surfaces (skill, agent, command, plugin).
// Both used to reach the code hub at once: the bare runtime word carried a
// token boost there, so naming the provider route outranked the hub that serves
// it. These cases pin the split in the lane's own boost tables.

import { describe, expect, it } from 'vitest';

import { scoreExplicitLane } from '../../lib/scorer/lanes/explicit.js';
import { createFixtureProjection } from '../../lib/scorer/projection.js';
import type { SkillProjection } from '../../lib/scorer/types.js';

function skill(id: string, keywords: readonly string[] = []): SkillProjection {
  return {
    id,
    kind: 'skill',
    family: 'system',
    category: 'test',
    name: id,
    description: '',
    keywords,
    domains: [],
    intentSignals: [],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
  };
}

// The code hub declares the runtime name as its own author keyword, so a bare
// mention still reaches it at that weight, not at a token boost.
const projection = createFixtureProjection([
  skill('sk-code', ['opencode']),
  skill('cli-external-orchestration'),
]);

function scoreOf(matches: ReturnType<typeof scoreExplicitLane>, skillId: string): number {
  return matches.find((match) => match.skillId === skillId)?.score ?? 0;
}

function evidenceOf(matches: ReturnType<typeof scoreExplicitLane>, skillId: string): readonly string[] {
  return matches.find((match) => match.skillId === skillId)?.evidence ?? [];
}

describe('opencode provider route', () => {
  it('gives the provider phrase to the CLI hub, above the code hub', () => {
    const matches = scoreExplicitLane('opencode go route this task', projection);

    expect(evidenceOf(matches, 'cli-external-orchestration')).toContain('phrase:opencode go');
    expect(scoreOf(matches, 'cli-external-orchestration')).toBeGreaterThan(scoreOf(matches, 'sk-code'));
  });

  it('keeps an authoring surface on the code hub', () => {
    const matches = scoreExplicitLane('write an opencode plugin', projection);

    expect(evidenceOf(matches, 'sk-code')).toEqual(
      expect.arrayContaining(['phrase:opencode plugin', 'author:opencode']),
    );
    expect(scoreOf(matches, 'sk-code')).toBeGreaterThan(scoreOf(matches, 'cli-external-orchestration'));
  });
});

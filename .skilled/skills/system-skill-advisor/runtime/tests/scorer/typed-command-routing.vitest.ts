// ───────────────────────────────────────────────────────────────
// MODULE: Typed Command Routing Tests
// ───────────────────────────────────────────────────────────────
// Two ways a typed slash command used to be turned against itself:
// the graph lane lent the command's own match to a neighbour until the
// neighbour outranked the command, and a mode suffix such as ":auto" was read
// as the content word "auto", matching any skill that mentions it.

import { describe, expect, it } from 'vitest';
import { boundGraphSupportBySeed, scoreAdvisorPrompt } from '../../lib/scorer/fusion.js';
import { scoreLexicalLane } from '../../lib/scorer/lanes/lexical.js';
import { createFixtureProjection } from '../../lib/scorer/projection.js';
import type { SkillEdgeProjection, SkillProjection } from '../../lib/scorer/types.js';

function skill(id: string, fields: Partial<SkillProjection> = {}): SkillProjection {
  return {
    id,
    kind: 'skill',
    family: 'system',
    category: 'test',
    name: id,
    description: '',
    keywords: [],
    domains: [],
    intentSignals: [],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: `.skilled/skills/${id}/graph-metadata.json`,
    lifecycleStatus: 'active',
    ...fields,
  };
}

// The dependency's own evidence is weaker than the seed's; the loan over these
// two edges is what would carry it past the seed.
const LOAN_EDGES: SkillEdgeProjection[] = [
  { sourceId: 'loop-skill', targetId: 'dep-skill', edgeType: 'enhances', weight: 1 },
  { sourceId: 'loop-skill', targetId: 'dep-skill', edgeType: 'depends_on', weight: 1 },
];

function rankFor(prompt: string, loopKeyword: string): string[] {
  const projection = createFixtureProjection([
    skill('loop-skill', { keywords: [loopKeyword] }),
    skill('dep-skill', { keywords: ['packet'], domains: ['routing'] }),
  ], LOAN_EDGES);
  const result = scoreAdvisorPrompt(prompt, {
    workspaceRoot: process.cwd(),
    projection,
    includeAllCandidates: true,
  });
  return result.recommendations.map((recommendation) => recommendation.skill);
}

describe('graph support lent by a typed slash command', () => {
  it('cannot lift the dependency above the command that lent it', () => {
    expect(rankFor('run /fixture:loop on the routing packet', '/fixture:loop').slice(0, 2))
      .toEqual(['loop-skill', 'dep-skill']);
  });

  it('still lifts the dependency when the seed matched on plain words', () => {
    expect(rankFor('run fixture loop on the routing packet', 'fixture loop').slice(0, 2))
      .toEqual(['dep-skill', 'loop-skill']);
  });

  it('keeps a neighbour below a command that another command held down', () => {
    // first lends to second, second lends to third; both commands were typed.
    const bounded = boundGraphSupportBySeed(
      new Map([['first', 0.7], ['second', 0.75], ['third', 0.8]]),
      new Map([['second', 0.2], ['third', 0.3]]),
      new Map([['second', new Map([['first', 0.2]])], ['third', new Map([['second', 0.3]])]]),
      1,
      new Set(['first', 'second']),
    );
    expect(bounded.get('second')).toBeLessThan(0.7);
    expect(bounded.get('third')).toBeLessThan(bounded.get('second') ?? 0);
  });
});

describe('command mode suffixes are not prompt content', () => {
  const projection = createFixtureProjection([
    skill('loop-skill', { keywords: ['/fixture:loop'] }),
    skill('repair-skill', { intentSignals: ['draft auto-repair'] }),
  ], []);
  const lexicalFor = (prompt: string) => scoreLexicalLane(prompt, projection)
    .find((match) => match.skillId === 'repair-skill');

  it('gives no lexical credit for a detached or attached mode suffix', () => {
    expect(lexicalFor('/fixture:loop :auto on it')).toBeUndefined();
    expect(lexicalFor('/fixture:loop:confirm on it')).toBeUndefined();
  });

  it('keeps "auto" as content when no command precedes it', () => {
    expect(lexicalFor('the draft auto-repair rewrote my files')?.evidence).toContain('token:auto');
  });
});

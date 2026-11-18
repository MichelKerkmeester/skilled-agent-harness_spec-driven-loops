// ───────────────────────────────────────────────────────────────────
// MODULE: Command Phrase Tolerance
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import { scoreExplicitLane } from '../../lib/scorer/lanes/explicit.js';
import { createFixtureProjection } from '../../lib/scorer/projection.js';
import type { SkillProjection } from '../../lib/scorer/types.js';

function entry(id: string, kind: SkillProjection['kind'], keywords: string[]): SkillProjection {
  return {
    id,
    kind,
    family: 'system',
    category: 'test',
    name: id,
    description: '',
    keywords,
    domains: [],
    intentSignals: [],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: `.skilled/skills/${id}/graph-metadata.json`,
    lifecycleStatus: 'active',
  };
}

const PROJECTION = createFixtureProjection([
  entry('command-repin', 'command', ['re-pin my vendored skilled', 'link this project']),
  entry('command-stale', 'command', ['which agents md sections are stale']),
  entry('some-skill', 'skill', ['re-pin my vendored skilled']),
]);

function scoreOf(id: string, prompt: string): number {
  return scoreExplicitLane(prompt, PROJECTION).find((match) => match.skillId === id)?.score ?? 0;
}

// A command phrase written with other small words between its own still names
// that command, so its content words close together count, below an exact match.
describe('command phrase matching tolerates small wording changes', () => {
  it('matches a command phrase whose content words sit close together', () => {
    const exact = scoreOf('command-repin', 're-pin my vendored skilled');
    const reworded = scoreOf('command-repin', 're-pin the vendored skilled tree');
    expect(reworded).toBeGreaterThan(0);
    expect(reworded).toBeLessThan(exact);
  });

  it('does not match content words scattered across a long prompt', () => {
    expect(scoreOf('command-repin',
      'skilled people vendored the old library and wanted to re-pin nothing at all today')).toBe(0);
  });

  it('requires the phrase\'s leading word, which carries its verb or question', () => {
    expect(scoreOf('command-stale', 'update the readme because the agents md sections are stale')).toBe(0);
    expect(scoreOf('command-stale', 'which of the agents md sections are stale')).toBeGreaterThan(0);
  });

  it('keeps short command phrases and skill phrases exact', () => {
    expect(scoreOf('command-repin', 'link the project')).toBe(0);
    expect(scoreOf('some-skill', 're-pin the vendored skilled tree')).toBe(0);
  });
});

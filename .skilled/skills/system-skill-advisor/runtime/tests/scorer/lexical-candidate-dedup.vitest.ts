// ───────────────────────────────────────────────────────────────
// MODULE: Lexical Candidate Token Set Contract Tests
// ───────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';
import { scoreLexicalLane } from '../../lib/scorer/lanes/lexical.js';
import { createFixtureProjection } from '../../lib/scorer/projection.js';
import { scoreTokenOverlap } from '../../lib/scorer/text.js';
import type { SkillProjection } from '../../lib/scorer/types.js';

function fixtureSkill(domains: readonly string[], intentSignals: readonly string[]): SkillProjection {
  return {
    id: 'alpha',
    kind: 'skill',
    family: 'system',
    category: 'test',
    name: 'alpha',
    description: '',
    keywords: [],
    domains,
    intentSignals,
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
  };
}

describe('lexical candidate token Set contract', () => {
  // scoreTokenOverlap's candidate-token Set is the real double-count guard.
  // These assertions must fail if that Set collapse is ever removed.
  it('scores a term shared by domains and intent signals identically to one listing', () => {
    const singleListing = createFixtureProjection([fixtureSkill(['quasar-route'], [])]);
    const duplicateListing = createFixtureProjection([fixtureSkill(['quasar-route'], ['Quasar Route'])]);

    expect(scoreLexicalLane('quasar route', duplicateListing)[0]?.score)
      .toBe(scoreLexicalLane('quasar route', singleListing)[0]?.score);
  });

  it('does not let duplicate candidate phrases inflate token overlap', () => {
    const promptTokens = ['quasar', 'route'];
    const singleScore = scoreTokenOverlap(promptTokens, ['quasar route']);
    const duplicateScore = scoreTokenOverlap(promptTokens, ['quasar route', 'Quasar Route']);

    expect(duplicateScore).toBe(singleScore);
  });
});

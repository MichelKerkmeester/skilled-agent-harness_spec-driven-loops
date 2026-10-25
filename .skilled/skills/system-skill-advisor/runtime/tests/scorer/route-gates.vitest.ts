// ───────────────────────────────────────────────────────────────────
// MODULE: Read-Only Route And Review-Loop Gates
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';
import { readOnlyRouteAllowed } from '../../lib/scorer/fusion.js';
import { scoreExplicitLane } from '../../lib/scorer/lanes/explicit.js';
import { createFixtureProjection } from '../../lib/scorer/projection.js';
import type { CommandBridgeProjection } from '../../lib/scorer/projection.js';
import type { SkillProjection } from '../../lib/scorer/types.js';

function bridge(overrides: Partial<CommandBridgeProjection>): CommandBridgeProjection {
  return {
    id: 'command-doctor-ci-report',
    kind: 'command',
    family: 'system',
    category: 'command',
    name: '/doctor:ci report',
    description: '',
    keywords: ['ci switch report'],
    domains: ['doctor', 'command'],
    intentSignals: ['/doctor:ci report'],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
    ...overrides,
  };
}

function skill(id: string): SkillProjection {
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
  };
}

describe('read-only command bridge exemption', () => {
  it('lets a read-only bridge answer a show prompt that carries its phrase', () => {
    expect(readOnlyRouteAllowed('show the ci switch report', bridge({ readOnly: true }))).toBe(true);
  });

  it('keeps a mutating bridge gated on the same prompt', () => {
    expect(readOnlyRouteAllowed('show the ci switch report', bridge({}))).toBe(false);
  });
});

describe('review-loop verb', () => {
  const projection = createFixtureProjection([skill('system-deep-loop'), skill('sk-code')]);

  function reviewLoopFires(prompt: string): boolean {
    return scoreExplicitLane(prompt.toLowerCase(), projection)
      .some((match) => match.skillId === 'system-deep-loop' && match.evidence.includes('review-loop'));
  }

  it('ignores a resume that is the topic of the review, not its verb', () => {
    expect(reviewLoopFires('Review whether the corpus already covers enough resume and continuation phrases.')).toBe(false);
  });

  it('still fires when the loop verb governs the review', () => {
    expect(reviewLoopFires('Resume the active deep-review lineage and append the next review artifact set.')).toBe(true);
  });
});

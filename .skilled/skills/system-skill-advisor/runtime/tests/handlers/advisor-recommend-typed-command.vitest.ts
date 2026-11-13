// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Recommend Typed Command Tests
// ───────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import { attachTypedCommand } from '../../handlers/advisor-recommend.js';
import type { AdvisorRecommendOutput } from '../../schemas/advisor-tool-schemas.js';

type Recommendation = AdvisorRecommendOutput['recommendations'][number];

function outputWith(recommendations: Recommendation[]): AdvisorRecommendOutput {
  return {
    workspaceRoot: '/workspace',
    effectiveThresholds: {
      confidenceThreshold: 0.5,
      uncertaintyThreshold: 0.2,
      confidenceOnly: false,
    },
    recommendations,
    ambiguous: false,
    freshness: 'live',
    trustState: {
      state: 'live',
      reason: null,
      generation: 1,
      checkedAt: '2026-11-13T00:00:00.000Z',
      lastLiveAt: '2026-11-13T00:00:00.000Z',
    },
    generatedAt: '2026-11-13T00:00:00.000Z',
    cache: {
      hit: false,
      sourceSignaturePresent: true,
    },
  };
}

function recommendation(skillId: string, extra: Partial<Recommendation> = {}): Recommendation {
  return {
    skillId,
    score: 0.9,
    confidence: 0.95,
    uncertainty: 0.05,
    dominantLane: 'explicit_author',
    ...extra,
  };
}

describe('attachTypedCommand', () => {
  it('carries a typed command on its owning top recommendation', () => {
    const output = outputWith([recommendation('system-spec-kit')]);

    const attached = attachTypedCommand(output, '/speckit:resume cache work');

    expect(attached.recommendations[0]).toEqual(expect.objectContaining({
      skillId: 'system-spec-kit',
      command: '/speckit:resume',
      policy: 'start',
      ownerSkillId: 'system-spec-kit',
    }));
  });

  it('replaces a compiled route command with the typed one', () => {
    const output = outputWith([recommendation('sk-doc', {
      command: '/create:readme',
      policy: 'start',
      ownerSkillId: 'sk-doc',
    })]);

    const attached = attachTypedCommand(output, '/create:goal retrofit');

    expect(attached.recommendations[0]).toEqual(expect.objectContaining({
      command: '/create:goal',
      policy: 'start',
      ownerSkillId: 'sk-doc',
    }));
  });

  it('returns the same output when the top skill does not own the typed command', () => {
    const output = outputWith([recommendation('mcp-tooling')]);

    expect(attachTypedCommand(output, '/create:goal retrofit')).toBe(output);
  });

  it('returns the same output when the prompt carries no typed command', () => {
    const output = outputWith([recommendation('system-spec-kit')]);

    expect(attachTypedCommand(output, 'resume the cached work')).toBe(output);
  });
});

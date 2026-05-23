import { createRequire } from 'node:module';

import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const { scoreVerdictDelta, scoreVerdictProgression } = require('../../lib/council/adjudicator-verdict-scoring.cjs') as {
  scoreVerdictDelta: (previous: Record<string, unknown>, current: Record<string, unknown>, options?: { saturationThreshold?: number }) => {
    verdict_delta: number;
    stable: boolean;
    components: Record<string, number>;
  };
  scoreVerdictProgression: (verdicts: Record<string, unknown>[], options?: { saturationThreshold?: number }) => {
    stable: boolean;
    consecutive_stable_rounds: number;
    deltas: Array<{ verdict_delta: number; stable: boolean }>;
  };
};

const baseVerdict = {
  recommended_option: 'extend-deep-loop-runtime',
  confidence: 0.82,
  blocking_disagreements: [],
  material_risks: ['threshold leakage'],
  decision_axes: {
    correctness: 'extend',
    integration: 'extend',
    maintainability: 'extend',
  },
};

describe('council adjudicator verdict scoring', () => {
  it('marks materially stable consecutive verdicts when below saturation threshold', () => {
    const result = scoreVerdictDelta(baseVerdict, { ...baseVerdict, confidence: 0.8 });

    expect(result.verdict_delta).toBeCloseTo(0.004);
    expect(result.stable).toBe(true);
    expect(result.components.option_changed).toBe(0);
  });

  it('identifies convergence when two consecutive round deltas are stable', () => {
    const progression = scoreVerdictProgression([
      baseVerdict,
      { ...baseVerdict, confidence: 0.8 },
      { ...baseVerdict, confidence: 0.79, material_risks: ['threshold leakage'] },
    ]);

    expect(progression.deltas).toHaveLength(2);
    expect(progression.consecutive_stable_rounds).toBe(2);
    expect(progression.stable).toBe(true);
  });

  it('marks diverging verdicts when recommendation, axes, risks, and blockers change', () => {
    const result = scoreVerdictDelta(baseVerdict, {
      recommended_option: 'create-council-runtime',
      confidence: 0.45,
      blocking_disagreements: ['runtime ownership unresolved'],
      material_risks: ['package duplication'],
      decision_axes: {
        correctness: 'split',
        integration: 'split',
        maintainability: 'split',
      },
    });

    expect(result.verdict_delta).toBeGreaterThan(0.85);
    expect(result.stable).toBe(false);
    expect(result.components.option_changed).toBe(1);
  });
});

import { describe, expect, it } from 'vitest';

import { createRequire } from 'node:module';

const requireCjs = createRequire(import.meta.url);

interface SnapshotLike {
  readonly score?: number;
  readonly metrics?: {
    readonly score?: number;
  };
}

interface ImprovementEffect {
  readonly latestDelta: number | null;
  readonly sampleCount: number;
  readonly helped: number;
  readonly hurt: number;
  readonly flat: number;
  readonly averageDelta: number | null;
  readonly summary: string;
}

const {
  buildImprovementEffect,
  computeScoreDelta,
  shouldTraceImprovementEffect,
} = requireCjs('../../scripts/convergence.cjs') as {
  buildImprovementEffect: (snapshots: SnapshotLike[], scoreDelta: number | null) => ImprovementEffect;
  computeScoreDelta: (score: number, priorSnapshot: SnapshotLike | null) => number | null;
  shouldTraceImprovementEffect: (args: Record<string, unknown>) => boolean;
};

describe('convergence score delta helpers', () => {
  it('computes a rounded delta from the prior snapshot metrics score', () => {
    expect(computeScoreDelta(0.6, { metrics: { score: 0.4 } })).toBe(0.2);
  });

  it('returns null when no prior score is available', () => {
    expect(computeScoreDelta(0.6, null)).toBeNull();
    expect(computeScoreDelta(0.6, { metrics: {} })).toBeNull();
  });

  it('keeps improvement effect tracing off unless an explicit flag enables it', () => {
    expect(shouldTraceImprovementEffect({})).toBe(false);
    expect(shouldTraceImprovementEffect({ traceImprovementEffect: true })).toBe(true);
    expect(shouldTraceImprovementEffect({ improvementEffect: '1' })).toBe(true);
  });

  it('summarizes helped, hurt, and flat score movement when tracing is enabled', () => {
    const effect = buildImprovementEffect(
      [
        { metrics: { score: 0.2 } },
        { metrics: { score: 0.5 } },
        { metrics: { score: 0.4 } },
      ],
      0,
    );

    expect(effect).toEqual({
      latestDelta: 0,
      sampleCount: 3,
      helped: 1,
      hurt: 1,
      flat: 1,
      averageDelta: 0.067,
      summary: 'Avg delta: +6.7% (1 helped, 1 hurt, 1 flat)',
    });
  });
});

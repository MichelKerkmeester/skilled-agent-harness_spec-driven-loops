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

interface ObservationThreshold {
  readonly minObservations: number;
  readonly leadingFinding: {
    readonly id: string;
    readonly kind: string;
    readonly observations: number;
    readonly subThreshold: boolean;
  } | null;
  readonly findings: Array<{
    readonly id: string;
    readonly kind: string;
    readonly observations: number;
    readonly subThreshold: boolean;
  }>;
}

const {
  applyObservationThresholdGuard,
  buildImprovementEffect,
  computeScoreDelta,
  parseMinObservationsValue,
  readObservationThresholdConfig,
  shouldTraceImprovementEffect,
} = requireCjs('../../scripts/convergence.cjs') as {
  applyObservationThresholdGuard: (
    decision: string,
    blockers: Array<Record<string, unknown>>,
    trace: Array<Record<string, unknown>>,
    observationThreshold: ObservationThreshold | null,
  ) => {
    decision: string;
    blockers: Array<Record<string, unknown>>;
    trace: Array<Record<string, unknown>>;
  };
  buildImprovementEffect: (snapshots: SnapshotLike[], scoreDelta: number | null) => ImprovementEffect;
  computeScoreDelta: (score: number, priorSnapshot: SnapshotLike | null) => number | null;
  parseMinObservationsValue: (value?: unknown, key?: string) => number;
  readObservationThresholdConfig: (args: Record<string, unknown>) => { enabled: boolean; minObservations: number };
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

  it('normalizes min-observation config without enabling the guard implicitly', () => {
    expect(parseMinObservationsValue()).toBe(2);
    expect(parseMinObservationsValue('0')).toBe(1);
    expect(parseMinObservationsValue('11')).toBe(10);
    expect(readObservationThresholdConfig({})).toEqual({ enabled: false, minObservations: 1 });
    expect(readObservationThresholdConfig({ minObservationsGuard: true })).toEqual({
      enabled: true,
      minObservations: 2,
    });
    expect(readObservationThresholdConfig({ configJson: '{"min_observations":3}' })).toEqual({
      enabled: true,
      minObservations: 3,
    });
  });

  it('blocks STOP only when the leading finding is still below the observation threshold', () => {
    const weakFinding = {
      id: 'finding-1',
      kind: 'FINDING',
      observations: 2,
      subThreshold: true,
    };
    const blocked = applyObservationThresholdGuard('STOP_ALLOWED', [], [], {
      minObservations: 3,
      leadingFinding: weakFinding,
      findings: [weakFinding],
    });

    expect(blocked.decision).toBe('STOP_BLOCKED');
    expect(blocked.blockers).toEqual([
      expect.objectContaining({
        type: 'min_observations_guard',
        severity: 'blocking',
        minObservations: 3,
        leadingFinding: expect.objectContaining({ id: 'finding-1', subThreshold: true }),
      }),
    ]);
    expect(blocked.trace).toEqual([
      expect.objectContaining({ signal: 'minObservations', value: 2, threshold: 3, passed: false }),
    ]);

    const confirmedFinding = { ...weakFinding, observations: 3, subThreshold: false };
    const allowed = applyObservationThresholdGuard('STOP_ALLOWED', [], [], {
      minObservations: 3,
      leadingFinding: confirmedFinding,
      findings: [confirmedFinding],
    });

    expect(allowed.decision).toBe('STOP_ALLOWED');
    expect(allowed.blockers).toEqual([]);
    expect(allowed.trace).toEqual([
      expect.objectContaining({ signal: 'minObservations', value: 3, threshold: 3, passed: true }),
    ]);

    const singleObservation = applyObservationThresholdGuard('STOP_ALLOWED', [], [], {
      minObservations: 1,
      leadingFinding: { ...weakFinding, observations: 1, subThreshold: false },
      findings: [{ ...weakFinding, observations: 1, subThreshold: false }],
    });

    expect(singleObservation.decision).toBe('STOP_ALLOWED');
    expect(singleObservation.blockers).toEqual([]);
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

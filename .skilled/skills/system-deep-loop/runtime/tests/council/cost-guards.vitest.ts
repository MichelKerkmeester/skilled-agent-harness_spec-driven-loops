import { createRequire } from 'node:module';

import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const {
  computeCouncilCostUpperBound,
  evaluateCouncilCostGuards,
  evaluateLagCeilingTripwire,
  normalizeCostGuards,
} = require('../../lib/council/cost-guards.cjs') as {
  computeCouncilCostUpperBound: (input?: Record<string, unknown>) => Record<string, number>;
  evaluateCouncilCostGuards: (input?: Record<string, unknown>) => { continue_allowed: boolean; stop_reasons: string[]; upper_bound: Record<string, number> };
  evaluateLagCeilingTripwire: (input?: Record<string, unknown>) => Record<string, unknown>;
  normalizeCostGuards: (input?: Record<string, unknown>) => Record<string, number>;
};

describe('council cost guards', () => {
  it('computes the default upper bound from topics, rounds, and seats', () => {
    expect(computeCouncilCostUpperBound()).toMatchObject({
      max_topics_per_session: 5,
      max_rounds_per_topic: 3,
      seats_per_round: 3,
      max_rounds: 15,
      max_seat_outputs: 45,
    });
  });

  it('stops at max_rounds_per_topic', () => {
    const decision = evaluateCouncilCostGuards({ roundNumber: 3, guards: { max_rounds_per_topic: 3 } });

    expect(decision.continue_allowed).toBe(false);
    expect(decision.stop_reasons).toContain('max_rounds_per_topic');
  });

  it('stops when max_topics_per_session is exceeded', () => {
    const decision = evaluateCouncilCostGuards({ topicNumber: 6, guards: { max_topics_per_session: 5 } });

    expect(decision.continue_allowed).toBe(false);
    expect(decision.stop_reasons).toContain('max_topics_per_session');
  });

  it('stops on verdict deltas under the saturation threshold', () => {
    const decision = evaluateCouncilCostGuards({ verdictDelta: 0.19, guards: { saturation_threshold: 0.2 } });

    expect(decision.continue_allowed).toBe(false);
    expect(decision.stop_reasons).toContain('saturation_threshold');
  });

  it('rejects invalid guard values', () => {
    expect(() => normalizeCostGuards({ max_rounds_per_topic: 0 })).toThrow(RangeError);
    expect(() => normalizeCostGuards({ saturation_threshold: 1.2 })).toThrow(RangeError);
    expect(() => normalizeCostGuards({ lag_ceiling: -1 })).toThrow(RangeError);
  });

  it('evaluates lag ceiling below, at, and above the warning boundary', () => {
    expect(evaluateLagCeilingTripwire({ oldestPendingLagMs: 49, guards: { lag_ceiling: 50 } })).toMatchObject({
      exceeded: false,
      reason: null,
    });
    expect(evaluateLagCeilingTripwire({ oldestPendingLagMs: 50, guards: { lag_ceiling: 50 } })).toMatchObject({
      exceeded: true,
      severity: 'warning',
      reason: 'lag_ceiling',
    });
    expect(evaluateLagCeilingTripwire({ oldestPendingLagMs: 51, guards: { lag_ceiling: 50 } })).toMatchObject({
      exceeded: true,
      severity: 'warning',
      reason: 'lag_ceiling',
    });
  });

  it('keeps the advisory cost-guard tuple independent from lag enforcement', () => {
    const decision = evaluateCouncilCostGuards({ guards: { lag_ceiling: 1 }, oldestPendingLagMs: 999 });

    expect(decision.continue_allowed).toBe(true);
    expect(decision.stop_reasons).toEqual([]);
  });
});

import { describe, expect, it } from 'vitest';

import { buildTriggerCache, loadTriggerGoldens } from './trigger-golden-fixture';

describe('semantic trigger latency budget', () => {
  it('keeps shadow-stage synchronous work within the deterministic PASS budget', () => {
    const fixture = loadTriggerGoldens();
    const cache = buildTriggerCache(fixture);
    const dimensions = fixture.metadata.vectorModel.dimensions;
    const syncWorkUnits = cache.length * dimensions;
    const passBudgetWorkUnits = 50 * 1_000;
    const warnBudgetWorkUnits = 100 * 1_000;

    expect(syncWorkUnits).toBe(1_920);
    expect(syncWorkUnits).toBeLessThanOrEqual(passBudgetWorkUnits);
    expect(syncWorkUnits).toBeLessThan(warnBudgetWorkUnits);
  });
});

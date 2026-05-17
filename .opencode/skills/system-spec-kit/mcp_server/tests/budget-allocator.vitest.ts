import { describe, expect, it } from 'vitest';

import {
  allocateBudget,
  createDefaultSources,
  DEFAULT_FLOORS,
} from '@spec-kit/shared/budget-allocator';

describe('budget allocator manual scenario 256', () => {
  it('documents the default 4000-token floor contract', () => {
    expect(DEFAULT_FLOORS).toEqual({
      constitutional: 700,
      codeGraph: 1200,
      cocoIndex: 900,
      triggered: 400,
      overflow: 800,
    });
  });

  it('grants each source at least min(floor, actualSize) and releases empty floors', () => {
    const result = allocateBudget(createDefaultSources(500, 1500, 0, 100), 4000);
    const byName = Object.fromEntries(result.allocations.map((allocation) => [allocation.name, allocation]));

    expect(byName.constitutional).toMatchObject({
      floor: DEFAULT_FLOORS.constitutional,
      requested: 500,
      granted: 500,
      dropped: 0,
    });
    expect(byName.cocoIndex).toMatchObject({
      floor: DEFAULT_FLOORS.cocoIndex,
      requested: 0,
      granted: 0,
      dropped: 0,
    });
    expect(result.totalUsed).toBeLessThanOrEqual(result.totalBudget);
  });

  it('redistributes overflow in priority order', () => {
    const result = allocateBudget(createDefaultSources(1200, 1800, 1600, 900), 4000);
    const byName = Object.fromEntries(result.allocations.map((allocation) => [allocation.name, allocation]));

    expect(byName.constitutional.granted).toBe(1200);
    expect(byName.codeGraph.granted).toBe(1500);
    expect(byName.cocoIndex.granted).toBe(900);
    expect(byName.triggered.granted).toBe(400);
    expect(result.totalUsed).toBe(4000);
  });

  it('never exceeds the total cap', () => {
    const result = allocateBudget(createDefaultSources(10_000, 10_000, 10_000, 10_000), 4000);

    expect(result.totalUsed).toBeLessThanOrEqual(4000);
    expect(result.allocations.every((allocation) => allocation.granted >= 0)).toBe(true);
  });
});

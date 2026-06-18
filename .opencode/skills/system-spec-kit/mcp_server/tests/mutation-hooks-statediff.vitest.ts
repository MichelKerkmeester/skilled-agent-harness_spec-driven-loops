import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createStatediffAction } from '../lib/storage/statediff';

describe('mutation hooks statediff subscribers', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
  });

  async function loadHarness() {
    const triggerClear = vi.fn();
    const invalidateOnWrite = vi.fn(() => 3);
    const clearConstitutional = vi.fn();
    const clearGraphSignals = vi.fn();
    const clearRelated = vi.fn();
    const clearDegree = vi.fn();
    const invalidateEntityDensity = vi.fn();

    vi.doMock('../lib/parsing/trigger-matcher.js', () => ({ clearCache: triggerClear }));
    vi.doMock('../lib/cache/tool-cache.js', () => ({ invalidateOnWrite }));
    vi.doMock('../hooks/memory-surface.js', () => ({ clearConstitutionalCache: clearConstitutional }));
    vi.doMock('../lib/graph/graph-signals.js', () => ({ clearGraphSignalsCache: clearGraphSignals }));
    vi.doMock('../lib/cognitive/co-activation.js', () => ({ clearRelatedCache: clearRelated }));
    vi.doMock('../lib/search/graph-search-fn.js', () => ({ clearDegreeCache: clearDegree }));
    vi.doMock('../lib/search/entity-density.js', () => ({ invalidateEntityDensityCache: invalidateEntityDensity }));

    const module = await import('../handlers/mutation-hooks');
    return {
      runPostMutationHooks: module.runPostMutationHooks,
      triggerClear,
      invalidateOnWrite,
      clearConstitutional,
      clearGraphSignals,
      clearRelated,
      clearDegree,
      invalidateEntityDensity,
    };
  }

  it('runs all cache subscribers fail-safe for memory-index action batches', async () => {
    // Graph and co-activation clears must NOT be gated on graph-targeted
    // actions: batches are advisory and memory deletes cascade causal-edge
    // deletes that surface as memory_index actions only.
    const harness = await loadHarness();
    const result = harness.runPostMutationHooks('save', {
      statediffActions: [createStatediffAction('upsert', {
        target: 'memory_index',
        key: '101',
        sourceOperation: 'save',
      })],
    });

    expect(result.actionCount).toBe(1);
    expect(result.entityDensityCacheCleared).toBe(true);
    expect(result.graphSignalsCacheCleared).toBe(true);
    expect(result.coactivationCacheCleared).toBe(true);
    expect(harness.invalidateEntityDensity).toHaveBeenCalledTimes(1);
    expect(harness.clearGraphSignals).toHaveBeenCalledTimes(1);
    expect(harness.clearDegree).toHaveBeenCalledTimes(1);
    expect(harness.clearRelated).toHaveBeenCalledTimes(1);
    expect(harness.triggerClear).toHaveBeenCalledTimes(1);
    expect(harness.invalidateOnWrite).toHaveBeenCalledTimes(1);
    expect(harness.clearConstitutional).toHaveBeenCalledTimes(1);
  });

  it('runs graph subscribers for graph and causal-edge actions', async () => {
    const harness = await loadHarness();
    const result = harness.runPostMutationHooks('causal-unlink', {
      statediffActions: [createStatediffAction('delete', {
        target: 'causal_edge',
        key: 'edge-7',
        sourceOperation: 'causal-unlink',
      })],
    });

    expect(result.graphSignalsCacheCleared).toBe(true);
    expect(result.coactivationCacheCleared).toBe(true);
    expect(result.entityDensityCacheCleared).toBe(true);
    expect(harness.clearGraphSignals).toHaveBeenCalledTimes(1);
    expect(harness.clearDegree).toHaveBeenCalledTimes(1);
    expect(harness.clearRelated).toHaveBeenCalledTimes(1);
    expect(result.subscribers?.map((subscriber) => subscriber.name)).toEqual([
      'trigger-cache',
      'tool-cache',
      'constitutional-cache',
      'graph-cache',
      'coactivation-cache',
      'entity-density-cache',
    ]);
  });
});

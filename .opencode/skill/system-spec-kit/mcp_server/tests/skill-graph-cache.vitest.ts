// ---------------------------------------------------------------
// TEST: SKILL GRAPH CACHE MANAGER
// ---------------------------------------------------------------

import { describe, it, expect, vi, beforeEach } from 'vitest';

/* ─────────────────────────────────────────────────────────────
   MOCK: graph builder
──────────────────────────────────────────────────────────────── */

vi.mock('@spec-kit/shared/sgqs/graph-builder', () => ({
  buildSkillGraph: vi.fn(() => ({
    nodes: new Map(),
    edges: [],
    edgeById: new Map(),
    outbound: new Map(),
    inbound: new Map(),
  })),
}));

import { SkillGraphCacheManager } from '../lib/search/skill-graph-cache';
import { buildSkillGraph } from '@spec-kit/shared/sgqs/graph-builder';

const SKILL_ROOT = '/fake/skill/root';
const ALT_ROOT = '/fake/skill/other-root';

/* ─────────────────────────────────────────────────────────────
   HELPERS
──────────────────────────────────────────────────────────────── */

/** Create a fresh cache manager with an optional custom TTL (ms). */
function makeCache(ttlMs?: number): SkillGraphCacheManager {
  return new SkillGraphCacheManager(ttlMs);
}

/* ─────────────────────────────────────────────────────────────
   SUITE
──────────────────────────────────────────────────────────────── */

describe('SkillGraphCacheManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ------------------------------------------------------------------
  // 1. CACHE HIT
  // ------------------------------------------------------------------
  it('returns the cached graph on second call without rebuilding', async () => {
    const cache = makeCache();

    const first = await cache.get(SKILL_ROOT);
    const second = await cache.get(SKILL_ROOT);

    expect(buildSkillGraph).toHaveBeenCalledTimes(1);
    expect(second).toBe(first); // same object reference
  });

  // ------------------------------------------------------------------
  // 2. TTL EXPIRATION
  // ------------------------------------------------------------------
  it('rebuilds the graph after the TTL has expired', async () => {
    // Use fake timers from the start so timestamps are consistent (P1 race fix)
    vi.useFakeTimers();
    const cache = makeCache(100); // 100 ms TTL

    await cache.get(SKILL_ROOT);
    expect(buildSkillGraph).toHaveBeenCalledTimes(1);

    // Advance time past TTL
    vi.advanceTimersByTime(200); // 200 ms > 100 ms TTL

    await cache.get(SKILL_ROOT);
    expect(buildSkillGraph).toHaveBeenCalledTimes(2);

    vi.useRealTimers();
  });

  // ------------------------------------------------------------------
  // 3. INVALIDATE
  // ------------------------------------------------------------------
  it('forces a rebuild on next get() after invalidate()', async () => {
    const cache = makeCache();

    await cache.get(SKILL_ROOT);
    expect(buildSkillGraph).toHaveBeenCalledTimes(1);

    cache.invalidate();
    await cache.get(SKILL_ROOT);

    expect(buildSkillGraph).toHaveBeenCalledTimes(2);
  });

  // ------------------------------------------------------------------
  // 4. isWarm()
  // ------------------------------------------------------------------
  it('isWarm() returns true after a successful get() and false after invalidate()', async () => {
    const cache = makeCache();

    expect(cache.isWarm()).toBe(false);

    await cache.get(SKILL_ROOT);
    expect(cache.isWarm()).toBe(true);

    cache.invalidate();
    expect(cache.isWarm()).toBe(false);
  });

  // ------------------------------------------------------------------
  // 5. SINGLE-FLIGHT GUARD
  // ------------------------------------------------------------------
  it('does not trigger multiple builds for concurrent get() calls', async () => {
    const cache = makeCache();

    // Fire three concurrent get() calls without awaiting between them
    const [a, b, c] = await Promise.all([
      cache.get(SKILL_ROOT),
      cache.get(SKILL_ROOT),
      cache.get(SKILL_ROOT),
    ]);

    // buildSkillGraph must have been called exactly once
    expect(buildSkillGraph).toHaveBeenCalledTimes(1);

    // All callers receive the same graph object
    expect(a).toBe(b);
    expect(b).toBe(c);
  });

  // ------------------------------------------------------------------
  // 6. DIFFERENT skillRoot TRIGGERS REBUILD
  // ------------------------------------------------------------------
  it('rebuilds when skillRoot changes even if TTL has not expired', async () => {
    const cache = makeCache(300_000); // long TTL — won't expire in this test

    const first = await cache.get(SKILL_ROOT);
    expect(buildSkillGraph).toHaveBeenCalledTimes(1);

    // Use a different root path
    const second = await cache.get(ALT_ROOT);
    expect(buildSkillGraph).toHaveBeenCalledTimes(2);

    // Both graphs are valid (mock returns same shape but a fresh call was made)
    expect(first).toBeDefined();
    expect(second).toBeDefined();
  });
});

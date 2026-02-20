// ---------------------------------------------------------------
// MODULE: Skill Graph Cache Manager
// Singleton TTL cache for SGQS buildSkillGraph() results
// ---------------------------------------------------------------

import { buildSkillGraph } from '../../../scripts/sgqs/graph-builder';

import type { SkillGraph } from '../../../scripts/sgqs/types';

// ---------------------------------------------------------------
// 1. CONSTANTS
// ---------------------------------------------------------------

const DEFAULT_TTL_MS = 300_000; // 5 minutes

// ---------------------------------------------------------------
// 2. CACHE MANAGER CLASS
// ---------------------------------------------------------------

/**
 * Singleton TTL cache that wraps buildSkillGraph() to eliminate
 * per-query filesystem rebuilds (~100-150ms → <1ms on cache hit).
 */
export class SkillGraphCacheManager {
  private graph: SkillGraph | null = null;
  private cachedRoot: string | null = null;
  private timestamp: number = 0;
  private inflight: Promise<SkillGraph> | null = null;
  private readonly ttlMs: number;
  /** Monotonic counter incremented on invalidate(); prevents stale inflight
   *  promises from overwriting a freshly cleared cache (P1-1 race fix). */
  private epoch: number = 0;

  constructor(ttlMs: number = DEFAULT_TTL_MS) {
    this.ttlMs = ttlMs;
  }

  /**
   * Return the cached SkillGraph for the given skillRoot, rebuilding
   * if the TTL has expired or the root path has changed.
   * Single-flight: concurrent callers share one in-flight build.
   *
   * @param skillRoot - Absolute path to the skill root directory
   * @returns A valid SkillGraph, from cache or freshly built
   */
  async get(skillRoot: string): Promise<SkillGraph> {
    const now = Date.now();
    const isExpired = now - this.timestamp > this.ttlMs;
    const isRootChanged = this.cachedRoot !== skillRoot;

    if (this.graph && !isExpired && !isRootChanged) {
      return this.graph;
    }

    // Single-flight guard: reuse an in-flight build if one exists
    if (this.inflight) {
      return this.inflight;
    }

    const buildEpoch = this.epoch;
    this.inflight = Promise.resolve().then(() => {
      const graph = buildSkillGraph(skillRoot);
      // Only update cache if no invalidation occurred during the build
      if (this.epoch === buildEpoch) {
        this.graph = graph;
        this.cachedRoot = skillRoot;
        this.timestamp = Date.now();
      }
      this.inflight = null;
      return graph;
    }).catch((err: unknown) => {
      this.inflight = null;
      throw err;
    });

    return this.inflight;
  }

  /**
   * Clear the cached graph and timestamp immediately.
   * Call this on server restart or when a forced refresh is needed.
   * Bumps the epoch to prevent any in-flight build from overwriting.
   */
  invalidate(): void {
    this.epoch++;
    this.graph = null;
    this.cachedRoot = null;
    this.timestamp = 0;
    this.inflight = null;
  }

  /**
   * Returns true if the cache holds a valid, non-expired entry.
   */
  isWarm(): boolean {
    return (
      this.graph !== null &&
      Date.now() - this.timestamp <= this.ttlMs
    );
  }
}

// ---------------------------------------------------------------
// 3. MODULE-LEVEL SINGLETON
// ---------------------------------------------------------------

export const skillGraphCache = new SkillGraphCacheManager();

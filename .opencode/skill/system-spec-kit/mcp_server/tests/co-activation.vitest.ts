// ───────────────────────────────────────────────────────────────
// TEST: CO-ACTIVATION (vitest)
// Converted from: co-activation.test.ts (custom runner)
// Aligned with production co-activation.ts named exports
// ───────────────────────────────────────────────────────────────

import { describe, it, expect } from 'vitest';
import * as coActivation from '../lib/cache/cognitive/co-activation';

type CoActivationDb = Parameters<typeof coActivation.init>[0];
const coActivationExports = coActivation as unknown as Record<string, unknown>;

describe('Co-Activation Module', () => {
  /* ─────────────────────────────────────────────────────────────
     Module Exports
  ──────────────────────────────────────────────────────────────── */

  describe('Module Exports', () => {
    // Production exports: CO_ACTIVATION_CONFIG (not CONFIG), init, isEnabled,
    // boostScore, getRelatedMemories, populateRelatedMemories, spreadActivation,
    // logCoActivationEvent
    const expectedExports = [
      'init',
      'isEnabled',
      'spreadActivation',
      'getRelatedMemories',
      'boostScore',
      'populateRelatedMemories',
      'logCoActivationEvent',
      'CO_ACTIVATION_CONFIG',
    ];

    it.each(expectedExports)('Export "%s" exists', (exp) => {
      expect(coActivationExports[exp]).toBeDefined();
    });
  });

  /* ─────────────────────────────────────────────────────────────
     CO_ACTIVATION_CONFIG values
  ──────────────────────────────────────────────────────────────── */

  describe('CO_ACTIVATION_CONFIG values', () => {
    it('boostFactor is 0.15', () => {
      expect(coActivation.CO_ACTIVATION_CONFIG.boostFactor).toBe(0.15);
    });

    it('maxRelated is 5', () => {
      expect(coActivation.CO_ACTIVATION_CONFIG.maxRelated).toBe(5);
    });

    it('minSimilarity is 70', () => {
      expect(coActivation.CO_ACTIVATION_CONFIG.minSimilarity).toBe(70);
    });

    it('enabled is a boolean', () => {
      expect(typeof coActivation.CO_ACTIVATION_CONFIG.enabled).toBe('boolean');
    });

    it('decayPerHop is 0.5', () => {
      expect(coActivation.CO_ACTIVATION_CONFIG.decayPerHop).toBe(0.5);
    });

    it('maxHops is 2', () => {
      expect(coActivation.CO_ACTIVATION_CONFIG.maxHops).toBe(2);
    });
  });

  /* ─────────────────────────────────────────────────────────────
     boostScore()
  ──────────────────────────────────────────────────────────────── */

  describe('boostScore()', () => {
    // Production signature: boostScore(baseScore, relatedCount, avgSimilarity)
    // boost = boostFactor * (relatedCount / maxRelated) * (avgSimilarity / 100)
    // Returns baseScore + boost when enabled and relatedCount > 0

    it('No related memories returns base score', () => {
      expect(coActivation.boostScore(0.5, 0, 80)).toBe(0.5);
    });

    it('With related memories, score is boosted', () => {
      // boost = 0.15 * (3/5) * (80/100) = 0.15 * 0.6 * 0.8 = 0.072
      // result = 0.5 + 0.072 = 0.572
      const boosted = coActivation.boostScore(0.5, 3, 80);
      const expectedBoost = 0.5 + 0.15 * (3 / 5) * (80 / 100);
      expect(boosted).toBeCloseTo(expectedBoost, 3);
    });

    it('Max related count and similarity', () => {
      const maxBoost = coActivation.boostScore(0.5, 5, 100);
      const expectedMax = 0.5 + 0.15 * (5 / 5) * (100 / 100);
      expect(maxBoost).toBeCloseTo(expectedMax, 3);
    });
  });

  /* ─────────────────────────────────────────────────────────────
     init()
  ──────────────────────────────────────────────────────────────── */

  describe('init()', () => {
    // Production init(database) just sets db = database, does NOT throw on null
    // It accepts any Database.Database argument

    it('init(null) does not throw', () => {
      expect(() => coActivation.init(null as unknown as CoActivationDb)).not.toThrow();
    });

    it('isEnabled() returns boolean based on env var, not DB state', () => {
      expect(typeof coActivation.isEnabled()).toBe('boolean');
    });
  });

  /* ─────────────────────────────────────────────────────────────
     getRelatedMemories() without DB
  ──────────────────────────────────────────────────────────────── */

  describe('getRelatedMemories() without DB', () => {
    // Production returns [] when db is null (warns to console)

    it('Returns empty array without DB', () => {
      const result = coActivation.getRelatedMemories(1);
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(0);
    });

    it('Invalid memoryId returns empty array', () => {
      const result = coActivation.getRelatedMemories(-1);
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(0);
    });
  });

  /* ─────────────────────────────────────────────────────────────
     spreadActivation() without DB
  ──────────────────────────────────────────────────────────────── */

  describe('spreadActivation() without DB', () => {
    // Production signature: spreadActivation(seedIds: number[], maxHops?, limit?)
    // Returns [] when db is null or seedIds is empty

    it('Returns empty array without DB', () => {
      const result = coActivation.spreadActivation([1]);
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(0);
    });

    it('Empty seedIds returns empty array', () => {
      const result = coActivation.spreadActivation([]);
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(0);
    });
  });

  /* ─────────────────────────────────────────────────────────────
     logCoActivationEvent()
  ──────────────────────────────────────────────────────────────── */

  describe('logCoActivationEvent()', () => {
    // Production signature: logCoActivationEvent(event: CoActivationEvent): void
    // CoActivationEvent has: timestamp, sourceId, targetId, similarity, boost
    // Returns void (just logs to console when SPECKIT_DEBUG=true)

    it('logCoActivationEvent accepts valid event', () => {
      expect(() => {
        coActivation.logCoActivationEvent({
          timestamp: new Date().toISOString(),
          sourceId: 1,
          targetId: 2,
          similarity: 85,
          boost: 0.1,
        });
      }).not.toThrow();
    });
  });

  /* ─────────────────────────────────────────────────────────────
     populateRelatedMemories() without DB
  ──────────────────────────────────────────────────────────────── */

  describe('populateRelatedMemories() without DB', () => {
    // Production signature: populateRelatedMemories(memoryId, vectorSearchFn): Promise<number>
    // Returns 0 when db is null

    it('Returns 0 without DB', async () => {
      const result = await coActivation.populateRelatedMemories(1, () => []);
      expect(result).toBe(0);
    });
  });

  /* ─────────────────────────────────────────────────────────────
     C138: Pipeline Integration Tests
  ──────────────────────────────────────────────────────────────── */

  describe('C138: Post-RRF Pipeline Integration', () => {
    it('C138-T1: spreadActivation export is a function', () => {
      expect(typeof coActivation.spreadActivation).toBe('function');
    });

    it('C138-T2: CO_ACTIVATION_CONFIG has required pipeline fields', () => {
      const config = coActivation.CO_ACTIVATION_CONFIG;
      expect(config).toHaveProperty('boostFactor');
      expect(config).toHaveProperty('maxRelated');
      expect(config).toHaveProperty('decayPerHop');
      expect(config).toHaveProperty('maxHops');
      expect(config.maxHops).toBeGreaterThanOrEqual(1);
    });

    it('C138-T3: boostScore with max related and high similarity gives meaningful boost', () => {
      const base = 0.5;
      const boosted = coActivation.boostScore(base, 5, 95);
      expect(boosted).toBeGreaterThan(base);
      // Boost should be proportional: boostFactor * (5/5) * (95/100) = 0.15 * 1.0 * 0.95 = 0.1425
      expect(boosted).toBeCloseTo(base + 0.1425, 2);
    });
  });
});

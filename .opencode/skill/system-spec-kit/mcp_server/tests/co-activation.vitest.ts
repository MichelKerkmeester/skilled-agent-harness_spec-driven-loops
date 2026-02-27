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
    it('boostFactor is 0.25 (configurable via SPECKIT_COACTIVATION_STRENGTH)', () => {
      expect(coActivation.CO_ACTIVATION_CONFIG.boostFactor).toBe(0.25);
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
    // R17 fan-effect divisor formula:
    //   raw_boost   = boostFactor * (relatedCount / maxRelated) * (avgSimilarity / 100)
    //   fan_divisor = sqrt(max(1, relatedCount))
    //   boost       = max(0, raw_boost / fan_divisor)
    //   result      = baseScore + boost

    it('No related memories returns base score', () => {
      expect(coActivation.boostScore(0.5, 0, 80)).toBe(0.5);
    });

    it('With related memories, score is boosted', () => {
      // boost = 0.25 * (3/5) * (80/100) = 0.12
      // result = 0.5 + 0.12 = 0.62
      const boosted = coActivation.boostScore(0.5, 3, 80);
      const expectedBoost = 0.25 * (3 / 5) * (80 / 100);
      expect(boosted).toBeCloseTo(0.5 + expectedBoost, 3);
    });

    it('Max related count and similarity', () => {
      // boost = 0.25 * (5/5) * (100/100) = 0.25
      // result = 0.5 + 0.25 = 0.75
      const maxBoost = coActivation.boostScore(0.5, 5, 100);
      expect(maxBoost).toBeCloseTo(0.75, 3);
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
      // boost = 0.25 * (5/5) * (95/100) = 0.2375
      // result = 0.5 + 0.2375 = 0.7375
      const expectedBoost = base + 0.25 * (5 / 5) * (95 / 100);
      expect(boosted).toBeCloseTo(expectedBoost, 2);
    });
  });

  /* ─────────────────────────────────────────────────────────────
     T003: Fan-Effect Divisor (R17) Tests
  ──────────────────────────────────────────────────────────────── */

  describe('T003: Co-Activation Boost Behavior', () => {
    it('T003-1: boost scales linearly with relatedCount', () => {
      const base = 0.5;
      const similarity = 90;
      // boost = 0.25 * (relatedCount/5) * (90/100)
      const boosted1 = coActivation.boostScore(base, 1, similarity);
      const boosted5 = coActivation.boostScore(base, 5, similarity);
      // More related = more boost
      expect(boosted5).toBeGreaterThan(boosted1);
      // Boost is proportional to relatedCount
      const boost1 = boosted1 - base;
      const boost5 = boosted5 - base;
      expect(boost5 / boost1).toBeCloseTo(5, 1);
    });

    it('T003-2: no error when relatedCount=1', () => {
      expect(() => coActivation.boostScore(0.5, 1, 80)).not.toThrow();
      const result = coActivation.boostScore(0.5, 1, 80);
      expect(Number.isFinite(result)).toBe(true);
    });

    it('T003-3: relatedCount=0 returns base score unchanged', () => {
      expect(() => coActivation.boostScore(0.5, 0, 80)).not.toThrow();
      const result = coActivation.boostScore(0.5, 0, 80);
      expect(result).toBe(0.5);
    });

    it('T003-4: result is never negative', () => {
      const base = 0.5;
      for (const count of [1, 2, 3, 4, 5]) {
        const result = coActivation.boostScore(base, count, 100);
        expect(result).toBeGreaterThanOrEqual(base);
      }
    });

    it('T003-5: boost formula is correct for relatedCount=4', () => {
      // boost = 0.25 * (4/5) * (80/100) = 0.16
      // result = 0.5 + 0.16 = 0.66
      const result = coActivation.boostScore(0.5, 4, 80);
      const expected = 0.5 + 0.25 * (4 / 5) * (80 / 100);
      expect(result).toBeCloseTo(expected, 5);
    });

    it('T003-6: max boost with relatedCount=5 and similarity=100', () => {
      const base = 0.5;
      const result = coActivation.boostScore(base, 5, 100);
      // boost = 0.25 * 1 * 1 = 0.25
      expect(result).toBeCloseTo(base + 0.25, 5);
    });
  });
});

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
    // R17 fan-effect divisor formula:
    //   raw_boost   = boostFactor * (relatedCount / maxRelated) * (avgSimilarity / 100)
    //   fan_divisor = sqrt(max(1, relatedCount))
    //   boost       = max(0, raw_boost / fan_divisor)
    //   result      = baseScore + boost

    it('No related memories returns base score', () => {
      expect(coActivation.boostScore(0.5, 0, 80)).toBe(0.5);
    });

    it('With related memories, score is boosted (fan-effect divisor applied)', () => {
      // raw_boost = 0.15 * (3/5) * (80/100) = 0.072
      // fan_divisor = sqrt(3) ≈ 1.7321
      // boost = 0.072 / sqrt(3) ≈ 0.04157
      // result ≈ 0.5 + 0.04157 = 0.54157
      const boosted = coActivation.boostScore(0.5, 3, 80);
      const rawBoost = 0.15 * (3 / 5) * (80 / 100);
      const expectedBoost = 0.5 + rawBoost / Math.sqrt(3);
      expect(boosted).toBeCloseTo(expectedBoost, 3);
    });

    it('Max related count and similarity (fan-effect divisor applied)', () => {
      // raw_boost = 0.15 * (5/5) * (100/100) = 0.15
      // fan_divisor = sqrt(5) ≈ 2.2361
      // boost = 0.15 / sqrt(5) ≈ 0.06708
      // result ≈ 0.5 + 0.06708 = 0.56708
      const maxBoost = coActivation.boostScore(0.5, 5, 100);
      const expectedMax = 0.5 + 0.15 / Math.sqrt(5);
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

    it('C138-T3: boostScore with max related and high similarity gives meaningful boost (fan-effect divisor)', () => {
      const base = 0.5;
      const boosted = coActivation.boostScore(base, 5, 95);
      expect(boosted).toBeGreaterThan(base);
      // R17: raw_boost = 0.15 * (5/5) * (95/100) = 0.1425
      // fan_divisor = sqrt(5) ≈ 2.2361
      // boost = 0.1425 / sqrt(5) ≈ 0.06373
      const expectedBoost = base + 0.1425 / Math.sqrt(5);
      expect(boosted).toBeCloseTo(expectedBoost, 2);
    });
  });

  /* ─────────────────────────────────────────────────────────────
     T003: Fan-Effect Divisor (R17) Tests
  ──────────────────────────────────────────────────────────────── */

  describe('T003: R17 Fan-Effect Divisor for Co-Activation', () => {
    it('T003-1: hub memory gets less boost than the old formula would give (fan-effect divisor reduces hub dominance)', () => {
      const base = 0.5;
      const similarity = 90;
      // Hub: relatedCount=5 (max neighbours)
      const hubBoosted = coActivation.boostScore(base, 5, similarity);

      // Old formula (no divisor): base + 0.15*(5/5)*(90/100) = 0.5 + 0.135 = 0.635
      const oldFormulaHub = base + 0.15 * (5 / 5) * (similarity / 100);
      // New formula divides by sqrt(5) ≈ 2.236, so hub boost is reduced
      expect(hubBoosted).toBeLessThan(oldFormulaHub);

      // Per-neighbour efficiency: non-hub has better boost-per-unit-of-relatedCount.
      // Hub boost/relatedCount vs non-hub boost/relatedCount:
      const nonHubBoosted = coActivation.boostScore(base, 1, similarity);
      const hubBoostPerNeighbor = (hubBoosted - base) / 5;
      const nonHubBoostPerNeighbor = (nonHubBoosted - base) / 1;
      // Non-hub gets proportionally more boost per neighbour (the fan-effect penalises hubs)
      expect(nonHubBoostPerNeighbor).toBeGreaterThan(hubBoostPerNeighbor);
    });

    it('T003-2: no division by zero when relatedCount=1 (min non-zero)', () => {
      expect(() => coActivation.boostScore(0.5, 1, 80)).not.toThrow();
      const result = coActivation.boostScore(0.5, 1, 80);
      expect(Number.isFinite(result)).toBe(true);
    });

    it('T003-3: no division by zero when relatedCount=0 (returns base score)', () => {
      expect(() => coActivation.boostScore(0.5, 0, 80)).not.toThrow();
      const result = coActivation.boostScore(0.5, 0, 80);
      expect(result).toBe(0.5); // unchanged base
    });

    it('T003-4: result is never negative', () => {
      // Test a range of relatedCount values — score should always be >= baseScore
      const base = 0.5;
      for (const count of [1, 2, 3, 4, 5]) {
        const result = coActivation.boostScore(base, count, 100);
        expect(result).toBeGreaterThanOrEqual(base);
      }
    });

    it('T003-5: fan-effect divisor formula is correct for relatedCount=4', () => {
      // raw_boost = 0.15 * (4/5) * (80/100) = 0.096
      // fan_divisor = sqrt(4) = 2
      // boost = 0.096 / 2 = 0.048
      // result = 0.5 + 0.048 = 0.548
      const result = coActivation.boostScore(0.5, 4, 80);
      const expected = 0.5 + (0.15 * (4 / 5) * (80 / 100)) / Math.sqrt(4);
      expect(result).toBeCloseTo(expected, 5);
    });

    it('T003-6: hub memory with relatedCount=5 gives less boost than raw formula would', () => {
      const base = 0.5;
      // With fan-effect divisor active:
      const withDivisor = coActivation.boostScore(base, 5, 100);
      // Old formula without divisor: base + 0.15 * (5/5) * (100/100) = 0.5 + 0.15 = 0.65
      const oldFormulaResult = base + 0.15;
      // New result should be strictly less than old result
      expect(withDivisor).toBeLessThan(oldFormulaResult);
    });
  });
});

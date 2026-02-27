// @ts-nocheck
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  calculateNoveltyBoost,
  calculateFiveFactorScore,
  calculateCompositeScore,
} from '../lib/scoring/composite-scoring';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build a minimal ScoringInput row with a given created_at timestamp. */
function makeRow(createdAtMs: number, overrides: Record<string, unknown> = {}) {
  return {
    created_at: new Date(createdAtMs).toISOString(),
    importance_tier: 'normal',
    importance_weight: 0.5,
    access_count: 0,
    similarity: 0,
    ...overrides,
  };
}

/** Return a timestamp that is `hours` hours in the past relative to Date.now(). */
function hoursAgo(hours: number): number {
  return Date.now() - hours * 3600000;
}

// ---------------------------------------------------------------------------
// N4: calculateNoveltyBoost
// ---------------------------------------------------------------------------

describe('calculateNoveltyBoost — flag disabled (default)', () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  it('returns 0 when SPECKIT_NOVELTY_BOOST is not set', () => {
    const boost = calculateNoveltyBoost(new Date(hoursAgo(0)).toISOString());
    expect(boost).toBe(0);
  });

  it('returns 0 when SPECKIT_NOVELTY_BOOST is "false"', () => {
    vi.stubEnv('SPECKIT_NOVELTY_BOOST', 'false');
    const boost = calculateNoveltyBoost(new Date(hoursAgo(0)).toISOString());
    expect(boost).toBe(0);
  });
});

describe('calculateNoveltyBoost — flag enabled', () => {
  beforeEach(() => {
    vi.stubEnv('SPECKIT_NOVELTY_BOOST', 'true');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('at 0h returns ~0.15', () => {
    // Use a very recent timestamp (seconds ago) to approximate 0 hours elapsed
    const createdAt = new Date(Date.now() - 1000).toISOString();
    const boost = calculateNoveltyBoost(createdAt);
    expect(boost).toBeCloseTo(0.15, 2);
  });

  it('at 12h returns ~0.055 (within 0.01 tolerance)', () => {
    const createdAt = new Date(hoursAgo(12)).toISOString();
    const boost = calculateNoveltyBoost(createdAt);
    // Expected: 0.15 * exp(-1) ≈ 0.0552
    expect(boost).toBeGreaterThan(0.045);
    expect(boost).toBeLessThan(0.065);
  });

  it('at 24h returns ~0.020 (within 0.01 tolerance)', () => {
    const createdAt = new Date(hoursAgo(24)).toISOString();
    const boost = calculateNoveltyBoost(createdAt);
    // Expected: 0.15 * exp(-2) ≈ 0.0203
    expect(boost).toBeGreaterThan(0.01);
    expect(boost).toBeLessThan(0.03);
  });

  it('at 48h returns ~0.003 (effectively zero)', () => {
    const createdAt = new Date(hoursAgo(48)).toISOString();
    const boost = calculateNoveltyBoost(createdAt);
    // Expected: 0.15 * exp(-4) ≈ 0.00275
    expect(boost).toBeGreaterThanOrEqual(0);
    expect(boost).toBeLessThan(0.005);
  });

  it('returns 0 for null/undefined created_at', () => {
    expect(calculateNoveltyBoost(undefined)).toBe(0);
    expect(calculateNoveltyBoost(null as unknown as string)).toBe(0);
  });

  it('returns 0 for invalid date string', () => {
    expect(calculateNoveltyBoost('not-a-date')).toBe(0);
    expect(calculateNoveltyBoost('')).toBe(0);
  });

  it('returns 0 for future timestamps (elapsed < 0)', () => {
    // created_at 1 hour in the future
    const futurestamp = new Date(Date.now() + 3600000).toISOString();
    expect(calculateNoveltyBoost(futurestamp)).toBe(0);
  });

  it('returns 0 for timestamps older than 48h', () => {
    const oldStamp = new Date(hoursAgo(49)).toISOString();
    expect(calculateNoveltyBoost(oldStamp)).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// N4: Score cap at 0.95
// ---------------------------------------------------------------------------

describe('score cap at 0.95', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('five-factor score does not exceed 0.95 even with boost', () => {
    vi.stubEnv('SPECKIT_NOVELTY_BOOST', 'true');

    // High base score: constitutional tier, high importance, high similarity
    const row = makeRow(Date.now() - 500, {
      importance_tier: 'constitutional',
      importance_weight: 1.0,
      similarity: 100,
      access_count: 100,
    });

    const score = calculateFiveFactorScore(row);
    expect(score).toBeLessThanOrEqual(0.95);
  });

  it('legacy composite score does not exceed 0.95 even with boost', () => {
    vi.stubEnv('SPECKIT_NOVELTY_BOOST', 'true');

    const row = makeRow(Date.now() - 500, {
      importance_tier: 'constitutional',
      importance_weight: 1.0,
      similarity: 100,
      access_count: 100,
    });

    const score = calculateCompositeScore(row);
    expect(score).toBeLessThanOrEqual(0.95);
  });
});

// ---------------------------------------------------------------------------
// N4: Both scoring paths apply the boost
// ---------------------------------------------------------------------------

describe('five-factor path applies boost', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('score is higher with flag enabled vs disabled for brand-new memory', () => {
    const createdAt = new Date(Date.now() - 100).toISOString(); // essentially 0h
    const row = {
      created_at: createdAt,
      importance_tier: 'normal',
      importance_weight: 0.5,
      access_count: 0,
      similarity: 0,
    };

    vi.unstubAllEnvs();
    const scoreWithout = calculateFiveFactorScore(row);

    vi.stubEnv('SPECKIT_NOVELTY_BOOST', 'true');
    const scoreWith = calculateFiveFactorScore(row);

    expect(scoreWith).toBeGreaterThan(scoreWithout);
    expect(scoreWith - scoreWithout).toBeCloseTo(0.15, 1);
  });
});

describe('legacy composite path applies boost', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('score is higher with flag enabled vs disabled for brand-new memory', () => {
    const createdAt = new Date(Date.now() - 100).toISOString();
    const row = {
      created_at: createdAt,
      importance_tier: 'normal',
      importance_weight: 0.5,
      access_count: 0,
      similarity: 0,
    };

    vi.unstubAllEnvs();
    const scoreWithout = calculateCompositeScore(row);

    vi.stubEnv('SPECKIT_NOVELTY_BOOST', 'true');
    const scoreWith = calculateCompositeScore(row);

    expect(scoreWith).toBeGreaterThan(scoreWithout);
    expect(scoreWith - scoreWithout).toBeCloseTo(0.15, 1);
  });
});

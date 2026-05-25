// TEST: SEARCH EXTENDED
// Converted from: search-extended.test.ts (custom runner)
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  simpleStem,
  isBm25Enabled,
  DEFAULT_K1,
  DEFAULT_B,
} from '../lib/search/bm25-index';

/* ───────────────────────────────────────────────────────────────
   ENV HELPERS
──────────────────────────────────────────────────────────────── */

const originalEnv = { ...process.env };

function resetEnv() {
  delete process.env.VOYAGE_API_KEY;
  delete process.env.COHERE_API_KEY;
  delete process.env.RERANKER_LOCAL;
  delete process.env.ENABLE_BM25;
}

function restoreEnv() {
  for (const key of ['VOYAGE_API_KEY', 'COHERE_API_KEY', 'RERANKER_LOCAL', 'ENABLE_BM25']) {
    if (originalEnv[key] !== undefined) {
      process.env[key] = originalEnv[key];
    } else {
      delete process.env[key];
    }
  }
}

/* ===================================================================
   A. BM25-INDEX: simpleStem
=================================================================== */

describe('simpleStem', () => {
  it('SS01: running → run (-ing removed + double-consonant dedup)', () => {
    // Fix #18 — doubled consonant "nn" after -ing removal now collapses to "n"
    expect(simpleStem('running')).toBe('run');
  });

  it('SS02: played → play (-ed removed)', () => {
    expect(simpleStem('played')).toBe('play');
  });

  it('SS03: dogs → dog (-s removed)', () => {
    expect(simpleStem('dogs')).toBe('dog');
  });

  it('SS04: boxes → box (-es removed)', () => {
    expect(simpleStem('boxes')).toBe('box');
  });

  it('SS05: quickly → quick (-ly removed)', () => {
    expect(simpleStem('quickly')).toBe('quick');
  });

  it('SS06: creation → crea (-tion removed)', () => {
    expect(simpleStem('creation')).toBe('crea');
  });

  it('SS07: bed unchanged (too short for -ed)', () => {
    expect(simpleStem('bed')).toBe('bed');
  });

  it('SS08: is unchanged (too short for -s)', () => {
    expect(simpleStem('is')).toBe('is');
  });

  it('SS09: RUNNING → run (lowercased + stemmed + double-consonant dedup)', () => {
    expect(simpleStem('RUNNING')).toBe('run');
  });

  it('SS10: fox unchanged (no suffix match)', () => {
    expect(simpleStem('fox')).toBe('fox');
  });

  it('SS11: empty string → empty string', () => {
    expect(simpleStem('')).toBe('');
  });

  it('SS12: single char unchanged', () => {
    expect(simpleStem('a')).toBe('a');
  });
});

/* ===================================================================
   B. BM25-INDEX: isBm25Enabled
=================================================================== */

describe('isBm25Enabled', () => {
  afterEach(() => {
    restoreEnv();
  });

  it('BM01: returns true when ENABLE_BM25 not set (BM25 is enabled by default)', () => {
    delete process.env.ENABLE_BM25;
    expect(isBm25Enabled()).toBe(true);
    expect(typeof isBm25Enabled()).toBe('boolean');
  });

  it('BM02: returns false when ENABLE_BM25=false', () => {
    process.env.ENABLE_BM25 = 'false';
    expect(isBm25Enabled()).toBe(false);
  });

  it('BM03: returns true when ENABLE_BM25=true', () => {
    process.env.ENABLE_BM25 = 'true';
    expect(isBm25Enabled()).toBe(true);
  });

  it('BM04: returns false for ENABLE_BM25=0 (non-truthy values stay disabled)', () => {
    process.env.ENABLE_BM25 = '0';
    expect(isBm25Enabled()).toBe(false);
  });
});

/* ===================================================================
   C. BM25-INDEX: DEFAULT_K1 and DEFAULT_B constants
=================================================================== */

describe('DEFAULT_K1 & DEFAULT_B', () => {
  it('K1-01: DEFAULT_K1 is a positive number', () => {
    expect(typeof DEFAULT_K1).toBe('number');
    expect(DEFAULT_K1).toBeGreaterThan(0);
  });

  it('K1-02: DEFAULT_K1 in typical BM25 range [0.5, 3.0]', () => {
    expect(DEFAULT_K1).toBeGreaterThanOrEqual(0.5);
    expect(DEFAULT_K1).toBeLessThanOrEqual(3.0);
  });

  it('K1-03: DEFAULT_K1 === 1.2 (standard value)', () => {
    expect(DEFAULT_K1).toBe(1.2);
  });

  it('B-01: DEFAULT_B is a positive number', () => {
    expect(typeof DEFAULT_B).toBe('number');
    expect(DEFAULT_B).toBeGreaterThan(0);
  });

  it('B-02: DEFAULT_B in typical BM25 range [0, 1.0]', () => {
    expect(DEFAULT_B).toBeGreaterThanOrEqual(0);
    expect(DEFAULT_B).toBeLessThanOrEqual(1.0);
  });

  it('B-03: DEFAULT_B === 0.75 (standard value)', () => {
    expect(DEFAULT_B).toBe(0.75);
  });
});


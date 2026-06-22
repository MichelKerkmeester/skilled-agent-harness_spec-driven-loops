// ───────────────────────────────────────────────────────────────
// TEST: Lexical-Grounding Floor + Single-Hit Corroboration
// ───────────────────────────────────────────────────────────────
// The verdict path bands on absolute cosine plus a top-margin with no lexical
// signal, so a fluent but off-corpus hit earns a confident "good" on one spurious
// high-cosine result. These cases prove the default-OFF grounding flag closes that
// hole: with the flag ON good additionally requires the top hit to carry a
// query-term or BM25 overlap above the floor, and a lone above-floor hit must be
// corroborated by a second above-threshold hit before it can reach good through
// the margin or quality-ratio path. With the flag OFF the verdict is unchanged.
//
// Per the embedder-portability requirement, every case asserts a qualitative
// verdict over a cosine PROFILE (a strong top over a weak tail, a grounded vs an
// ungrounded top) rather than pinning any single embedder-specific cosine as the
// pass condition. The similarity numbers express the profile band, not an anchor.

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  computeResultConfidence,
  assessRequestQuality,
  type ScoredResult,
} from '../lib/search/confidence-scoring';

const GROUNDING_FLAG = 'SPECKIT_LEXICAL_GROUNDING_V1';

// The aggregation verdict reads the uncalibrated rebalance confidence labels. The
// isotonic confidence-calibration model now applies by default and would cap those
// values, so pin it OFF to keep the verdict subject visible. Mirrors the sibling
// request-quality aggregation suite.
const CONFIDENCE_CALIBRATION_FLAG = 'SPECKIT_CONFIDENCE_CALIBRATION';

// The noise-floor subtraction now defaults ON and also bands the verdict, so pin it
// OFF to isolate the grounding floor as the verdict subject under test.
const NOISE_FLOOR_FLAG = 'SPECKIT_NOISE_FLOOR_SUBTRACTION_V1';

let savedGrounding: string | undefined;
let savedConfidenceCalibration: string | undefined;
let savedNoiseFloor: string | undefined;

beforeEach(() => {
  savedGrounding = process.env[GROUNDING_FLAG];
  savedConfidenceCalibration = process.env[CONFIDENCE_CALIBRATION_FLAG];
  savedNoiseFloor = process.env[NOISE_FLOOR_FLAG];
  process.env[CONFIDENCE_CALIBRATION_FLAG] = 'false';
  process.env[NOISE_FLOOR_FLAG] = 'false';
  // Default-ON (graduated): an unset env runs the grounding floor. The legacy
  // suite opts out explicitly.
  delete process.env[GROUNDING_FLAG];
});

afterEach(() => {
  for (const [key, saved] of [
    [GROUNDING_FLAG, savedGrounding],
    [CONFIDENCE_CALIBRATION_FLAG, savedConfidenceCalibration],
    [NOISE_FLOOR_FLAG, savedNoiseFloor],
  ] as const) {
    if (saved === undefined) delete process.env[key];
    else process.env[key] = saved;
  }
});

// A vector-only hit: a real cosine but no lexical lane score and no query-term
// overlap. This is the off-corpus shape, fluent text the embedder scores high
// while no query term actually matches the document.
function offCorpusHit(id: number, similarity: number): ScoredResult {
  return { id, similarity };
}

// A lexically-grounded hit: the lexical lane scored it, so it carries a BM25/FTS
// overlap signal on the row exactly as the search pipeline populates it.
function groundedHit(id: number, similarity: number, lexical = 0.5): ScoredResult {
  return { id, similarity, fts_score: lexical, sources: ['vector', 'fts'] };
}

// A weak tail hit: present but below the corroboration threshold.
function tailHit(id: number, similarity: number): ScoredResult {
  return { id, similarity };
}

function assess(results: ScoredResult[], query?: string) {
  return assessRequestQuality(
    results,
    computeResultConfidence(results),
    query !== undefined ? { query } : undefined,
  ).requestQuality.label;
}

describe('lexical-grounding floor (flag ON)', () => {
  beforeEach(() => {
    process.env[GROUNDING_FLAG] = 'true';
  });

  it('downgrades an off-corpus high-cosine hit with no overlap from good to weak', () => {
    // A lone fluent off-corpus hit: high cosine, no lexical signal, no query term.
    const results = [offCorpusHit(1, 78)];
    // Sanity: this exact profile reaches good with the flag OFF (asserted below in
    // the dark-default suite). Here the floor denies it.
    expect(assess(results, 'kubernetes deployment rollout strategy')).toBe('weak');
  });

  it('denies good even on an absolutely-dominant top hit when it is not grounded', () => {
    // A >= 0.8 top would clear the top-dominant rule, but with no lexical overlap
    // the floor still denies good, the floor gates the top-dominant path too.
    const results = [offCorpusHit(1, 82)];
    expect(assess(results, 'terraform state locking backend')).toBe('weak');
  });

  it('keeps an aligned good query citable when the top hit carries lexical overlap', () => {
    // Grounded, absolutely-dominant single hit stays good: a strong-lexical single
    // hit is not dropped by the floor or the corroboration guard.
    const results = [groundedHit(1, 82)];
    expect(assess(results, 'memory search confidence scoring')).toBe('good');
  });

  it('grounds a hit on a direct query-term overlap when it carries no lexical score', () => {
    // No numeric lexical signal, but a query term appears in the title, so the
    // secondary query-term path grounds it.
    const titled: ScoredResult = { id: 1, similarity: 82, title: 'OAuth token refresh flow' };
    expect(assess([titled], 'oauth token refresh')).toBe('good');
    // The same row with no query string has no way to ground and is denied.
    expect(assess([titled])).toBe('weak');
  });

  it('fails closed when the top hit carries no lexical signal at all', () => {
    // Two high-cosine hits, corroborated, but neither carries a lexical signal and
    // no query is supplied: absent overlap is treated as below floor, not as a
    // pass, so good is denied rather than awarded on a missing signal.
    const results = [offCorpusHit(1, 82), offCorpusHit(2, 80)];
    expect(assess(results)).toBe('weak');
  });
});

describe('single-hit corroboration (flag ON)', () => {
  beforeEach(() => {
    process.env[GROUNDING_FLAG] = 'true';
  });

  it('denies good to a lone grounded hit on the quality-ratio path (zero margin)', () => {
    // A single grounded result sets topMargin to 0 and a quality ratio of 1.0, the
    // exact path the lone off-corpus hit used to reach good. Corroboration denies
    // it: one hit cannot corroborate itself.
    const results = [groundedHit(1, 78)];
    expect(assess(results, 'memory search confidence scoring')).toBe('weak');
  });

  it('awards good to a two-hit corroborated query at the same top score', () => {
    // Same grounded top (0.78) as the lone case, now with a second above-threshold
    // hit. The margin path opens because the lone hit is corroborated.
    const results = [groundedHit(1, 78), groundedHit(2, 55)];
    expect(assess(results, 'memory search confidence scoring')).toBe('good');
  });

  it('denies good on the margin path when the second hit is below the corroboration floor', () => {
    // A dominant grounded top with a large margin, but the only runner-up is a weak
    // tail below the corroboration threshold, so it does not corroborate.
    const results = [groundedHit(1, 78), tailHit(2, 30)];
    expect(assess(results, 'memory search confidence scoring')).toBe('weak');
  });
});

describe('graduated default, flag ON is now the shipped verdict (env unset)', () => {
  it('denies the off-corpus lone hit by default with the env unset', () => {
    // SPECKIT_LEXICAL_GROUNDING_V1 unset (default ON): the grounding floor runs and
    // the fluent ungrounded hit is denied good. This is the behavior the benchmark
    // earned, the inverse of the prior dark default.
    const results = [offCorpusHit(1, 78)];
    expect(assess(results, 'kubernetes deployment rollout strategy')).toBe('weak');
  });
});

describe('legacy path, explicit opt-out restores the shipped verdict (byte-for-byte)', () => {
  beforeEach(() => {
    process.env[GROUNDING_FLAG] = 'false';
  });

  it('still scores the off-corpus lone hit good when explicitly disabled', () => {
    // With the flag explicitly off the shipped quality-ratio path still awards good
    // to the single high-cosine hit, proving the opt-out restores the prior contract.
    const results = [offCorpusHit(1, 78)];
    expect(assess(results, 'kubernetes deployment rollout strategy')).toBe('good');
  });

  it('still scores a lone grounded hit good on the quality-ratio path', () => {
    const results = [groundedHit(1, 78)];
    expect(assess(results, 'memory search confidence scoring')).toBe('good');
  });

  it('leaves a genuinely weak set weak and a low-signal set at gap', () => {
    expect(assess([tailHit(1, 55), tailHit(2, 52), tailHit(3, 50)])).toBe('weak');
    expect(assess([tailHit(1, 10), tailHit(2, 8), tailHit(3, 5)])).toBe('gap');
  });
});

describe('no over-denial of the correctly-weak case (flag ON)', () => {
  beforeEach(() => {
    process.env[GROUNDING_FLAG] = 'true';
  });

  it('keeps a grounded but mediocre set at weak under both flag states', () => {
    // The authentication-style correctly-weak case: a grounded top below the good
    // threshold stays weak, the floor and the guard do not push it to gap or good.
    const results = [groundedHit(1, 55), groundedHit(2, 52), groundedHit(3, 50)];
    expect(assess(results, 'authentication session token')).toBe('weak');
    process.env[GROUNDING_FLAG] = 'false';
    expect(assess(results, 'authentication session token')).toBe('weak');
  });
});

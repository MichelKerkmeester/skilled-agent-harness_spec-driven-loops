// ───────────────────────────────────────────────────────────────
// TEST: Flag Graduation: Cite With Caveat
// ───────────────────────────────────────────────────────────────
// SPECKIT_CITE_WITH_CAVEAT adds a cite_with_caveat tier between cite_results
// and the do-not-cite drop for a weak verdict whose top hit is still lexically
// grounded. The off-corpus class never produced a borderline-grounded weak
// verdict, so the benchmark never fired the tier. These cases drive it off the
// shared borderline fixture the benchmark also reads, prove it fires only on the
// borderline and measure the borderline result the binary policy would drop.
//
// The verdict-moving flags are pinned off so the band is the raw absolute
// relevance, isolating the citation tier as the only variable under test.

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  assessGrounding,
  assessRequestQuality,
  computeResultConfidence,
  type ScoredResult,
} from '../lib/search/confidence-scoring';
import { deriveCitationPolicy } from '../formatters/search-results';
import { FLAG_FEATURE_FIXTURES } from '../lib/eval/fixtures/flag-feature-fixtures';

const CITE_CAVEAT_FLAG = 'SPECKIT_CITE_WITH_CAVEAT';
const NOISE_FLOOR_FLAG = 'SPECKIT_NOISE_FLOOR_SUBTRACTION';
const LEXICAL_GROUNDING_FLAG = 'SPECKIT_LEXICAL_GROUNDING';
const CONFIDENCE_CALIBRATION_FLAG = 'SPECKIT_CONFIDENCE_CALIBRATION';
const MANAGED_FLAGS = [
  CITE_CAVEAT_FLAG,
  NOISE_FLOOR_FLAG,
  LEXICAL_GROUNDING_FLAG,
  CONFIDENCE_CALIBRATION_FLAG,
] as const;

const saved = new Map<string, string | undefined>();

beforeEach(() => {
  for (const flag of MANAGED_FLAGS) saved.set(flag, process.env[flag]);
  for (const flag of MANAGED_FLAGS) delete process.env[flag];
  // Pin the band to raw absolute relevance so only the caveat flag varies.
  process.env[NOISE_FLOOR_FLAG] = 'false';
  process.env[LEXICAL_GROUNDING_FLAG] = 'false';
  process.env[CONFIDENCE_CALIBRATION_FLAG] = 'false';
});

afterEach(() => {
  for (const flag of MANAGED_FLAGS) {
    const prior = saved.get(flag);
    if (prior === undefined) delete process.env[flag];
    else process.env[flag] = prior;
  }
});

const { borderline, clearGood, clearGap } = FLAG_FEATURE_FIXTURES.citeWithCaveat;

function policyOf(fixture: { rows: ScoredResult[]; query?: string }): string {
  const rows = fixture.rows;
  const quality = assessRequestQuality(rows, computeResultConfidence(rows), { query: fixture.query });
  const grounding = assessGrounding(rows, { query: fixture.query });
  return deriveCitationPolicy(quality, grounding);
}

describe('flag graduation: cite_with_caveat tier', () => {
  it('hedges the borderline-grounded weak verdict as cite_with_caveat with the flag on', () => {
    process.env[CITE_CAVEAT_FLAG] = 'true';
    expect(policyOf(borderline)).toBe('cite_with_caveat');
  });

  it('fires only on the borderline, leaving a clear good and a clear gap unchanged', () => {
    process.env[CITE_CAVEAT_FLAG] = 'true';
    expect(policyOf(clearGood)).toBe('cite_results');
    expect(policyOf(clearGap)).toBe('do_not_cite_results');
  });

  it('recovers the borderline result the binary policy drops to do_not_cite', () => {
    process.env[CITE_CAVEAT_FLAG] = 'false';
    const binary = policyOf(borderline);
    process.env[CITE_CAVEAT_FLAG] = 'true';
    const hedged = policyOf(borderline);

    expect(binary).toBe('do_not_cite_results');
    expect(hedged).toBe('cite_with_caveat');
    // The measurable effect: a result the binary policy drops becomes a hedged cite.
    expect(hedged).not.toBe(binary);
  });

  it('reduces to the shipped two-state policy with the flag off', () => {
    process.env[CITE_CAVEAT_FLAG] = 'false';
    expect(policyOf(borderline)).toBe('do_not_cite_results');
    expect(policyOf(clearGood)).toBe('cite_results');
  });
});

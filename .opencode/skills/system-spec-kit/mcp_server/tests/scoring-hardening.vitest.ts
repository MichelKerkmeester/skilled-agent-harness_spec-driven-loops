// ───────────────────────────────────────────────────────────────
// TEST: Scoring Hardening
// ───────────────────────────────────────────────────────────────
// The verdict and citation path scores an off-corpus term as good on a lone
// high-cosine hit because banding reads the raw absolute relevance with no
// grounding signal, no noise-floor subtraction and no evidence-gap bridge. These
// cases prove the four default-OFF hardening flags surface, correct, hedge and
// bridge around that hole, and prove the calibration curve cannot move the verdict.
//
// Each behavioral change ships dark: every flag-ON case is paired with a flag-OFF
// case asserting the shipped output is unchanged. Per the embedder-portability
// requirement the noise-floor cases assert a qualitative verdict over a cosine
// profile (a strong top, a borderline top) rather than pinning a model-specific
// cosine as the pass condition. The similarity numbers express the profile band.

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  assessGrounding,
  assessRequestQuality,
  computeResultConfidence,
  type ScoredResult,
} from '../lib/search/confidence-scoring';
import {
  DEFAULT_NOISE_FLOOR_EMBEDDER,
  NOISE_FLOOR_BY_EMBEDDER,
  resolveNoiseFloor,
} from '../lib/search/noise-floor';
import { formatSearchResults } from '../formatters/search-results';
import type { MCPEnvelope, MCPResponse } from '../lib/response/envelope';

const NOISE_FLOOR_FLAG = 'SPECKIT_NOISE_FLOOR_SUBTRACTION';
const CITE_CAVEAT_FLAG = 'SPECKIT_CITE_WITH_CAVEAT';
const EVIDENCE_GAP_FLAG = 'SPECKIT_EVIDENCE_GAP_VERDICT';
const LEXICAL_GROUNDING_FLAG = 'SPECKIT_LEXICAL_GROUNDING';
// The verdict reads the uncalibrated rebalance value, so the isotonic model never
// moves the label. Pin it OFF anyway to keep the verdict subject visible and
// mirror the sibling request-quality suites.
const CONFIDENCE_CALIBRATION_FLAG = 'SPECKIT_CONFIDENCE_CALIBRATION';

const MANAGED_FLAGS = [
  NOISE_FLOOR_FLAG,
  CITE_CAVEAT_FLAG,
  EVIDENCE_GAP_FLAG,
  LEXICAL_GROUNDING_FLAG,
  CONFIDENCE_CALIBRATION_FLAG,
] as const;

const saved = new Map<string, string | undefined>();

beforeEach(() => {
  for (const flag of MANAGED_FLAGS) saved.set(flag, process.env[flag]);
  // Reset to a stable baseline, then pin the verdict-moving flags OFF for a visible
  // verdict. The grounding floor, noise-floor, cite-with-caveat, and evidence-gap flags
  // now default ON, so they are pinned OFF explicitly here and each opts back in per case.
  for (const flag of MANAGED_FLAGS) delete process.env[flag];
  process.env[CONFIDENCE_CALIBRATION_FLAG] = 'false';
  process.env[NOISE_FLOOR_FLAG] = 'false';
  process.env[LEXICAL_GROUNDING_FLAG] = 'false';
  process.env[CITE_CAVEAT_FLAG] = 'false';
  process.env[EVIDENCE_GAP_FLAG] = 'false';
});

afterEach(() => {
  for (const flag of MANAGED_FLAGS) {
    const prior = saved.get(flag);
    if (prior === undefined) delete process.env[flag];
    else process.env[flag] = prior;
  }
});

// A vector-only off-corpus hit: a real cosine, no lexical lane score, no query
// term. The shape the embedder scores high while no query term actually matches.
function offCorpusHit(id: number, similarity: number): ScoredResult {
  return { id, similarity };
}

// A lexically-grounded hit: the lexical lane scored it, so it carries a BM25/FTS
// overlap on the row exactly as the search pipeline populates it.
function groundedHit(id: number, similarity: number, lexical = 0.5): ScoredResult {
  return { id, similarity, fts_score: lexical, sources: ['vector', 'fts'] };
}

function assess(
  results: ScoredResult[],
  options?: { query?: string; evidenceGapDetected?: boolean; embedder?: string },
): string {
  return assessRequestQuality(results, computeResultConfidence(results), options).requestQuality.label;
}

function parseEnvelope(response: MCPResponse): MCPEnvelope<Record<string, unknown>> {
  const first = response.content[0];
  if (first?.type !== 'text') throw new Error('Expected text MCP content');
  return JSON.parse(first.text) as MCPEnvelope<Record<string, unknown>>;
}

// ───────────────────────────────────────────────────────────────
// rec 8: noise-floor subtraction before banding
// ───────────────────────────────────────────────────────────────

describe('rec 8: corpus noise-floor subtraction', () => {
  it('records the measured floor against the embedder it was measured on', () => {
    const resolved = resolveNoiseFloor();
    expect(resolved).not.toBeNull();
    expect(resolved?.embedder).toBe(DEFAULT_NOISE_FLOOR_EMBEDDER);
    expect(NOISE_FLOOR_BY_EMBEDDER[DEFAULT_NOISE_FLOOR_EMBEDDER]).toBe(resolved?.floor);
    expect(resolved?.floor).toBeGreaterThan(0);
  });

  it('fails closed to the raw band for an embedder with no measured floor', () => {
    expect(resolveNoiseFloor('embedder-with-no-measured-floor')).toBeNull();
  });

  it('flag ON drops the off-corpus high-cosine sample from good to weak', () => {
    // A lone fluent off-corpus hit: high cosine, no lexical signal. The shipped
    // path bands the raw 0.78 as good; subtracting the floor pulls the band below
    // the good threshold so it reads weak.
    const results = [offCorpusHit(1, 78)];
    process.env[NOISE_FLOOR_FLAG] = 'true';
    expect(assess(results, { query: 'kubernetes deployment rollout strategy' })).toBe('weak');
  });

  it('flag ON fails closed to the raw band when the active embedder has no floor', () => {
    const results = [offCorpusHit(1, 78)];
    process.env[NOISE_FLOOR_FLAG] = 'true';
    // No measured floor for this embedder, so no subtraction: the raw band stands.
    expect(assess(results, { embedder: 'embedder-with-no-measured-floor' })).toBe('good');
  });

  it('floors the subtracted value at zero rather than inverting a sub-floor score', () => {
    // A relevance below the floor must not go negative and flip the band; it stays
    // a clean gap exactly as a near-zero raw band would.
    const results = [offCorpusHit(1, 5)];
    process.env[NOISE_FLOOR_FLAG] = 'true';
    expect(assess(results)).toBe('gap');
  });

  it('flag OFF leaves the off-corpus sample scoring good, byte-for-byte the shipped band', () => {
    const results = [offCorpusHit(1, 78)];
    expect(assess(results, { query: 'kubernetes deployment rollout strategy' })).toBe('good');
  });

  it('subtracts the floor by default with the env unset (graduated default)', () => {
    // Graduated default-ON: an unset env subtracts the measured floor, so the
    // off-corpus high-cosine sample reads weak without any explicit opt-in. The
    // lexical-grounding flag stays pinned off here, so this isolates the noise floor.
    delete process.env[NOISE_FLOOR_FLAG];
    const results = [offCorpusHit(1, 78)];
    expect(assess(results, { query: 'kubernetes deployment rollout strategy' })).toBe('weak');
  });
});

// ───────────────────────────────────────────────────────────────
// rec 11: bridge stage4 evidenceGapDetected into the verdict
// ───────────────────────────────────────────────────────────────

describe('rec 11: evidence-gap bridge', () => {
  // An absolutely-dominant top hit reads good on the shipped path.
  const strongGood = [offCorpusHit(1, 85)];

  it('flag ON caps a good verdict at weak when a stage4 gap is detected', () => {
    process.env[EVIDENCE_GAP_FLAG] = 'true';
    expect(assess(strongGood, { evidenceGapDetected: true })).toBe('weak');
  });

  it('flag ON leaves the verdict good when no gap is detected (read from stage4, not recomputed)', () => {
    process.env[EVIDENCE_GAP_FLAG] = 'true';
    // The same strong result with the gap signal absent stays good, proving the
    // cap is driven by the passed stage4 signal and is not recomputed internally.
    expect(assess(strongGood, { evidenceGapDetected: false })).toBe('good');
  });

  it('flag OFF ignores a detected gap exactly as the shipped path does', () => {
    expect(assess(strongGood, { evidenceGapDetected: true })).toBe('good');
  });
});

// ───────────────────────────────────────────────────────────────
// rec 7: grounding signal on the envelope
// ───────────────────────────────────────────────────────────────

describe('rec 7: grounding signal', () => {
  it('assessGrounding reflects the lexical signal present on the rows', () => {
    expect(assessGrounding([groundedHit(1, 82)])?.signal).toBe('grounded');
    expect(assessGrounding([groundedHit(1, 82)])?.topHitGrounded).toBe(true);
    expect(assessGrounding([offCorpusHit(1, 82)])?.signal).toBe('low_grounding');
    expect(assessGrounding([offCorpusHit(1, 82)])?.topHitGrounded).toBe(false);
    expect(assessGrounding([])).toBeNull();
  });

});

// ───────────────────────────────────────────────────────────────
// rec 10: cite_with_caveat tier
// ───────────────────────────────────────────────────────────────

describe('rec 10: cite_with_caveat tier', () => {
  // A grounded but mid-relevance top hit: weak verdict, still lexically grounded.
  const borderline = [{ id: 1, file_path: '/x.md', title: 'T', similarity: 55, fts_score: 0.5, sources: ['vector', 'fts'] }];
  // A clear good: a grounded, absolutely-dominant top hit.
  const clearGood = [{ id: 1, file_path: '/x.md', title: 'T', similarity: 85, fts_score: 0.5, sources: ['vector', 'fts'] }];
  // A clear miss: a mid-relevance hit with no lexical grounding at all.
  const clearMiss = [{ id: 1, file_path: '/x.md', title: 'T', similarity: 55 }];

  async function policyOf(rows: Array<Record<string, unknown>>): Promise<unknown> {
    return parseEnvelope(await formatSearchResults(rows, 'semantic')).data.citationPolicy;
  }

  it('flag ON hedges a borderline-grounded weak verdict as cite_with_caveat', async () => {
    process.env[CITE_CAVEAT_FLAG] = 'true';
    expect(await policyOf(borderline)).toBe('cite_with_caveat');
  });

  it('flag ON keeps a clear good at cite_results and a clear miss at do_not_cite_results', async () => {
    process.env[CITE_CAVEAT_FLAG] = 'true';
    expect(await policyOf(clearGood)).toBe('cite_results');
    expect(await policyOf(clearMiss)).toBe('do_not_cite_results');
  });

  it('flag ON never promotes a fully ungrounded weak hit to the caveat tier', async () => {
    process.env[CITE_CAVEAT_FLAG] = 'true';
    // similarity 55 with no lexical signal: weak, but ungrounded, so it drops.
    expect(await policyOf(clearMiss)).toBe('do_not_cite_results');
  });

  it('flag OFF reduces to the shipped two-state citation policy', async () => {
    expect(await policyOf(borderline)).toBe('do_not_cite_results');
    expect(await policyOf(clearGood)).toBe('cite_results');
  });
});

// ───────────────────────────────────────────────────────────────
// rec 12: the calibration re-fit is a proven non-fix
// ───────────────────────────────────────────────────────────────

describe('rec 12: calibration curve cannot move the verdict', () => {
  it('produces the identical verdict label with confidence calibration ON and OFF', () => {
    // The band is taken off the pre-calibration value, so toggling the isotonic
    // model leaves the verdict unchanged. This is the executable proof that a curve
    // re-fit is a non-fix: it cannot move good versus weak versus gap.
    const goodCase = [offCorpusHit(1, 85)];
    const weakCase = [offCorpusHit(1, 55)];
    const gapCase = [offCorpusHit(1, 10)];

    for (const sample of [goodCase, weakCase, gapCase]) {
      process.env[CONFIDENCE_CALIBRATION_FLAG] = 'false';
      const off = assess(sample);
      process.env[CONFIDENCE_CALIBRATION_FLAG] = 'true';
      const on = assess(sample);
      expect(on).toBe(off);
    }
  });
});

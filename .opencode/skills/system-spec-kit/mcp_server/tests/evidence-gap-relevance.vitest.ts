// TEST: Relevance-aware evidence-gap path (SPECKIT_RELEVANCE_AWARE_GAP)
// The Z-score peakedness check over-flags strong tight clusters and misses flat
// off-corpus ones. When the flag is on, detectEvidenceGap bands the
// noise-floor-subtracted absolute top relevance at the same LOW_THRESHOLD the
// request-quality verdict uses. These cases pin scores where the Z-score path and
// the relevance-aware path diverge, so the flag's effect is unambiguous.
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { detectEvidenceGap } from '../lib/search/evidence-gap-detector';
import { LOW_THRESHOLD } from '../lib/search/confidence-scoring';
import { NOISE_FLOOR_BY_EMBEDDER, DEFAULT_NOISE_FLOOR_EMBEDDER } from '../lib/search/noise-floor';

const GAP_FLAG = 'SPECKIT_RELEVANCE_AWARE_GAP';
const NOISE_FLAG = 'SPECKIT_NOISE_FLOOR_SUBTRACTION_V1';

const saved = new Map<string, string | undefined>();

function setFlag(name: string, value: string | undefined): void {
  if (!saved.has(name)) saved.set(name, process.env[name]);
  if (value === undefined) delete process.env[name];
  else process.env[name] = value;
}

beforeEach(() => {
  saved.clear();
});

afterEach(() => {
  for (const [name, value] of saved) {
    if (value === undefined) delete process.env[name];
    else process.env[name] = value;
  }
  saved.clear();
});

// The measured floor for the default embedder, used to construct scores that land
// on the intended side of LOW_THRESHOLD after subtraction. Sourced from the
// production map so the test tracks the real floor, not a copied literal.
const DEFAULT_FLOOR = NOISE_FLOOR_BY_EMBEDDER[DEFAULT_NOISE_FLOOR_EMBEDDER];

describe('relevance-aware evidence-gap path', () => {
  // ---- Flag OFF is byte-identical to the existing Z-score path ----
  it('flag OFF returns the exact existing Z-score gapDetected (clear winner, no gap)', () => {
    setFlag(GAP_FLAG, undefined); // unset = default-off

    // Clear winner: high Z-score, the Z-score path reports no gap. This is also a
    // case where the relevance-aware path WOULD flag a gap (subtracted < floor),
    // so an unchanged result proves the flag is genuinely off.
    const scores = [0.5, 0.05, 0.05];
    const result = detectEvidenceGap(scores, { embedder: DEFAULT_NOISE_FLOOR_EMBEDDER });
    const baseline = detectEvidenceGap(scores); // no options, also flag-off

    expect(result.gapDetected).toBe(false);
    expect(result).toEqual(baseline);
    expect(result.gapDetected).toBe(baseline.gapDetected);
    expect(result.zScore).toBe(baseline.zScore);
    expect(result.mean).toBe(baseline.mean);
    expect(result.stdDev).toBe(baseline.stdDev);
  });

  it('flag OFF returns the exact existing Z-score gapDetected (flat distribution, gap)', () => {
    setFlag(GAP_FLAG, 'false');

    // Flat high-relevance distribution: low Z-score, the Z-score path flags a gap.
    // The relevance-aware path would NOT flag it (top 0.9 - floor 0.15 = 0.75 well
    // above LOW_THRESHOLD), so an unchanged gap=true again proves flag-off identity.
    const scores = [0.9, 0.9, 0.9, 0.85];
    const result = detectEvidenceGap(scores, { embedder: DEFAULT_NOISE_FLOOR_EMBEDDER });
    const baseline = detectEvidenceGap(scores);

    expect(result.gapDetected).toBe(true);
    expect(result).toEqual(baseline);
  });

  // ---- Flag ON: low relevance flags gap, high relevance does not ----
  it('flag ON flags a low-relevance top score as gap even with a clear-winner Z-score', () => {
    // A clear-winner distribution: the Z-score path reports no gap (high Z). The
    // top relevance subtracted is below the band floor, so the relevance-aware
    // override must flip the decision to gap. Asserting against the flag-off
    // baseline proves the override changed the result. The override bands the
    // relevanceScores array the caller threads in, the absolute-relevance signal,
    // never the rrf scores, so the same distribution is supplied on that channel.
    const scores = [0.5, 0.05, 0.05];

    setFlag(GAP_FLAG, 'false');
    const off = detectEvidenceGap(scores, { embedder: DEFAULT_NOISE_FLOOR_EMBEDDER });

    setFlag(GAP_FLAG, 'true');
    setFlag(NOISE_FLAG, 'true');
    const on = detectEvidenceGap(scores, {
      embedder: DEFAULT_NOISE_FLOOR_EMBEDDER,
      relevanceScores: scores,
    });

    // Top 0.5, subtracted = max(0, 0.5 - floor) lands below LOW_THRESHOLD => gap.
    const subtracted = Math.max(0, 0.5 - DEFAULT_FLOOR);
    expect(subtracted).toBeLessThan(LOW_THRESHOLD);

    expect(off.gapDetected).toBe(false);
    expect(on.gapDetected).toBe(true);
    // Stats are preserved from the Z-score base regardless of the override.
    expect(on.zScore).toBe(off.zScore);
    expect(on.mean).toBe(off.mean);
    expect(on.stdDev).toBe(off.stdDev);
  });

  it('flag ON does NOT flag a high-relevance top score as gap even on a flat (gap-by-Z) distribution', () => {
    // A flat distribution the Z-score path flags as gap, but whose top relevance is
    // high. The relevance-aware override must flip the decision to no-gap. Asserting
    // against the flag-off baseline proves both the Z verdict and the override. The
    // override bands the relevanceScores array, so the high-relevance distribution is
    // supplied on that channel rather than read from the rrf scores.
    const scores = [0.9, 0.9, 0.9, 0.85];

    setFlag(GAP_FLAG, 'false');
    const off = detectEvidenceGap(scores, { embedder: DEFAULT_NOISE_FLOOR_EMBEDDER });

    setFlag(GAP_FLAG, 'true');
    setFlag(NOISE_FLAG, 'true');
    const on = detectEvidenceGap(scores, {
      embedder: DEFAULT_NOISE_FLOOR_EMBEDDER,
      relevanceScores: scores,
    });

    // Top 0.9, subtracted = max(0, 0.9 - floor) lands at or above LOW_THRESHOLD => no gap.
    const subtracted = Math.max(0, 0.9 - DEFAULT_FLOOR);
    expect(subtracted).toBeGreaterThanOrEqual(LOW_THRESHOLD);

    expect(off.gapDetected).toBe(true);
    expect(on.gapDetected).toBe(false);
    expect(on.zScore).toBe(off.zScore);
  });

  // ---- Production bug: rrf magnitudes must never reach the band ----
  it('flag ON with absent relevanceScores fails closed to Z-score on rrf-magnitude scores', () => {
    setFlag(GAP_FLAG, 'true');
    setFlag(NOISE_FLAG, 'true');

    // The production stage4 array: rrf effective scores (~0.03 magnitude), a clear
    // winner by Z. Banding these directly is the degenerate bug, every one sits below
    // LOW_THRESHOLD and would flag a gap. With no relevanceScores threaded in the path
    // must fail closed to the Z-score no-gap decision, NOT flag a spurious gap.
    const rrfScores = [0.032, 0.018, 0.011, 0.009];
    const on = detectEvidenceGap(rrfScores, { embedder: DEFAULT_NOISE_FLOOR_EMBEDDER });

    setFlag(GAP_FLAG, 'false');
    const off = detectEvidenceGap(rrfScores, { embedder: DEFAULT_NOISE_FLOOR_EMBEDDER });

    expect(on.gapDetected).toBe(false);
    expect(on).toEqual(off);
  });

  it('flag ON bands relevanceScores, so high relevance over rrf-magnitude scores is no gap', () => {
    setFlag(GAP_FLAG, 'true');
    setFlag(NOISE_FLAG, 'true');

    // The realistic production case: rrf scores are tiny but the absolute relevance is
    // high (a strong aligned hit). The band must read the relevanceScores channel and
    // return no gap, the exact behavior the production stage4 fix restores.
    const rrfScores = [0.032, 0.018, 0.011, 0.009];
    const relevanceScores = [0.82, 0.71, 0.66, 0.6];
    const on = detectEvidenceGap(rrfScores, {
      embedder: DEFAULT_NOISE_FLOOR_EMBEDDER,
      relevanceScores,
    });

    const subtracted = Math.max(0, 0.82 - DEFAULT_FLOOR);
    expect(subtracted).toBeGreaterThanOrEqual(LOW_THRESHOLD);
    expect(on.gapDetected).toBe(false);
  });

  it('flag ON bands relevanceScores, so a genuine low-relevance gap still flags', () => {
    setFlag(GAP_FLAG, 'true');
    setFlag(NOISE_FLAG, 'true');

    // An off-corpus query: rrf scores tiny AND absolute relevance is background-level.
    // The band must flag a gap off the relevanceScores channel.
    const rrfScores = [0.03, 0.02, 0.015];
    const relevanceScores = [0.3, 0.22, 0.18];
    const on = detectEvidenceGap(rrfScores, {
      embedder: DEFAULT_NOISE_FLOOR_EMBEDDER,
      relevanceScores,
    });

    const subtracted = Math.max(0, 0.3 - DEFAULT_FLOOR);
    expect(subtracted).toBeLessThan(LOW_THRESHOLD);
    expect(on.gapDetected).toBe(true);
  });

  // ---- No noise floor resolves: fail closed to Z-score ----
  it('flag ON with an unknown embedder fails closed to the Z-score path', () => {
    setFlag(GAP_FLAG, 'true');
    setFlag(NOISE_FLAG, 'true');

    // An embedder with no measured floor makes resolveNoiseFloor return null, so the
    // relevance-aware path fails closed and the Z-score decision stands. The
    // clear-winner distribution gives Z-path no-gap; without fail-closed the
    // relevance path (0.5 raw, no subtraction) would still be below LOW_THRESHOLD
    // and flag a gap, so a no-gap result proves the fail-closed fallback ran.
    const scores = [0.5, 0.05, 0.05];
    const onUnknown = detectEvidenceGap(scores, { embedder: 'no-such-embedder-zzz' });

    // The same scores with the flag forced off must produce the identical result,
    // confirming the fail-closed path returned the untouched Z-score base.
    setFlag(GAP_FLAG, 'false');
    const offBaseline = detectEvidenceGap(scores, { embedder: 'no-such-embedder-zzz' });

    expect(onUnknown.gapDetected).toBe(false);
    expect(onUnknown).toEqual(offBaseline);
  });
});

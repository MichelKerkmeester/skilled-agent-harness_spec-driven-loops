// Dependency-free statistics for the benchmark sweep. No scipy/numpy analogue —
// just the primitives a trustworthiness verdict needs: central tendency, a
// robust spread (MAD) for the noise floor, quantiles, a deterministic seeded
// generator for reproducible randomized fixtures, a seeded paired-delta
// bootstrap CI + paired win rate for confidence-aware top-pair comparison, and
// the verdict gates themselves (point-margin and CI-gated). Every helper is pure
// and tolerates empty input by returning NaN (never throws) so a partial sweep
// cannot crash the reducer.

'use strict';

// Coerce to a clean numeric array, dropping non-finite entries. Stats over a
// dirty cell should reflect only the real samples, not NaN contamination.
function toNumbers(xs) {
  if (!Array.isArray(xs)) return [];
  return xs.filter((x) => typeof x === 'number' && Number.isFinite(x));
}

function mean(xs) {
  const v = toNumbers(xs);
  if (v.length === 0) return NaN;
  let sum = 0;
  for (const x of v) sum += x;
  return sum / v.length;
}

// Linear-interpolation quantile on the sorted sample. q is clamped to [0,1].
// q=0 -> min, q=1 -> max, q=0.5 -> median. Matches the common "type 7" method.
function quantile(xs, q) {
  const v = toNumbers(xs).slice().sort((a, b) => a - b);
  if (v.length === 0) return NaN;
  if (v.length === 1) return v[0];
  const qq = Math.min(1, Math.max(0, q));
  const pos = (v.length - 1) * qq;
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  if (lo === hi) return v[lo];
  const frac = pos - lo;
  return v[lo] + (v[hi] - v[lo]) * frac;
}

function median(xs) {
  return quantile(xs, 0.5);
}

// Median absolute deviation about the median. A robust spread estimate used as
// the noise floor: the minimum margin that is distinguishable from run-to-run
// jitter. Returns 0 for a single sample (no observed spread), NaN for empty.
function mad(xs) {
  const v = toNumbers(xs);
  if (v.length === 0) return NaN;
  const m = median(v);
  const deviations = v.map((x) => Math.abs(x - m));
  return median(deviations);
}

// Deterministic PRNG (mulberry32). Same seed -> same stream, so randomized /
// property fixtures and any sampling jitter are reproducible across runs and
// machines. Accepts a number or a string seed (hashed to a 32-bit int).
function seededRandom(seed) {
  let a;
  if (typeof seed === 'number' && Number.isFinite(seed)) {
    a = seed >>> 0;
  } else {
    // FNV-1a 32-bit over the string form, so string seeds are stable.
    let h = 0x811c9dc5;
    const s = String(seed === undefined ? '' : seed);
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    a = h >>> 0;
  }
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Trustworthiness gate. Declares a WINNER only when there are enough samples AND
// the top-pair margin clears the noise floor; otherwise emits TIE or
// INCONCLUSIVE with a machine-readable reason so the reporter can surface it
// BEFORE any leaderboard text. This is the guard against the saturated-fixture
// "winner" mis-read: a margin inside the noise floor is a TIE, not a win.
//
//   nSamples < minSamplesForWinner -> INCONCLUSIVE('insufficient_n')
//   margin <= noiseFloor           -> TIE('inside_noise_floor')
//   otherwise                      -> WINNER('trusted_margin')
function trustVerdict({ nSamples, margin, noiseFloor, minSamplesForWinner = 3 }) {
  const n = typeof nSamples === 'number' ? nSamples : NaN;
  const m = typeof margin === 'number' ? margin : NaN;
  const floor = typeof noiseFloor === 'number' ? noiseFloor : NaN;

  if (!Number.isFinite(n) || n < minSamplesForWinner) {
    return { verdict: 'INCONCLUSIVE', reason: 'insufficient_n' };
  }
  // A non-finite margin or floor cannot support a trusted win; treat as a tie.
  if (!Number.isFinite(m) || !Number.isFinite(floor) || m <= floor) {
    return { verdict: 'TIE', reason: 'inside_noise_floor' };
  }
  return { verdict: 'WINNER', reason: 'trusted_margin' };
}

// Pair two sample series by position, the only pairing the sweep can justify:
// run k of cell A and run k of cell B share a sample index, so the per-index
// delta cancels shared run-to-run conditions. Truncates to the shorter series
// (a partial cell never invents a phantom paired observation).
function pairDeltas(samplesA, samplesB) {
  // Pair on the raw arrays so index k of A stays matched to index k of B, then
  // keep only pairs where BOTH entries are finite (a dropped entry must not
  // shift the alignment of every later pair).
  const rawA = Array.isArray(samplesA) ? samplesA : [];
  const rawB = Array.isArray(samplesB) ? samplesB : [];
  const len = Math.min(rawA.length, rawB.length);
  const deltas = [];
  for (let i = 0; i < len; i++) {
    const x = rawA[i];
    const y = rawB[i];
    if (
      typeof x === 'number' && Number.isFinite(x) &&
      typeof y === 'number' && Number.isFinite(y)
    ) {
      deltas.push(x - y);
    }
  }
  return deltas;
}

// Fraction of paired comparisons where A strictly beats B (A_i > B_i). Ties and
// losses do not count toward A. NaN when there are no comparable pairs, so an
// empty cell reports "unknown" rather than a misleading 0. Direction is the
// caller's responsibility: pass the higher-is-better series as A.
function pairedWinRate(samplesA, samplesB) {
  const rawA = Array.isArray(samplesA) ? samplesA : [];
  const rawB = Array.isArray(samplesB) ? samplesB : [];
  const len = Math.min(rawA.length, rawB.length);
  let pairs = 0;
  let wins = 0;
  for (let i = 0; i < len; i++) {
    const x = rawA[i];
    const y = rawB[i];
    if (
      typeof x === 'number' && Number.isFinite(x) &&
      typeof y === 'number' && Number.isFinite(y)
    ) {
      pairs++;
      if (x > y) wins++;
    }
  }
  if (pairs === 0) return NaN;
  return wins / pairs;
}

// Seeded paired-delta bootstrap confidence interval for the mean difference
// A - B. This is the rigor the single-margin gate lacks: instead of trusting a
// point margin, it asks whether the WHOLE plausible range of the paired mean
// delta stays on one side of zero.
//
// Method (dependency-free, deterministic):
//   1. Form the per-index paired deltas d_i = A_i - B_i (shared sample index).
//   2. Resample those deltas WITH replacement `iterations` times; each resample
//      draws n deltas and records its mean. seededRandom makes the draw stream
//      reproducible, so the same inputs + seed always yield the same CI.
//   3. The CI is the [(1-confidence)/2, 1-(1-confidence)/2] quantiles of that
//      bootstrap mean-delta distribution; `point` is the mean of the raw deltas.
//
// Returns { point, lo, hi }. Degenerate inputs (0 or 1 paired delta) cannot
// support a spread, so lo/hi collapse to the point (a 1-delta CI has zero width
// and the gate will read it as not excluding zero unless the point itself is
// off zero — which a single observation should not be trusted to claim).
function bootstrapPairedDeltaCi(samplesA, samplesB, options) {
  const opts = options || {};
  const iterations =
    Number.isInteger(opts.iterations) && opts.iterations > 0 ? opts.iterations : 2000;
  const confidence =
    typeof opts.confidence === 'number' && opts.confidence > 0 && opts.confidence < 1
      ? opts.confidence
      : 0.9;

  const deltas = pairDeltas(samplesA, samplesB);
  const n = deltas.length;
  if (n === 0) return { point: NaN, lo: NaN, hi: NaN };

  const point = mean(deltas);
  if (n === 1) {
    // One paired observation has no resampling variance: every bootstrap mean is
    // the lone delta. Report a zero-width CI at that point so the gate does not
    // mistake a single sample for a confident separation.
    return { point, lo: point, hi: point };
  }

  const rand = seededRandom(opts.seed);
  const means = new Array(iterations);
  for (let b = 0; b < iterations; b++) {
    let sum = 0;
    for (let i = 0; i < n; i++) {
      // Draw an index in [0, n) from the seeded stream; Math.floor keeps it in
      // range even when next() returns a value extremely close to 1.
      const idx = Math.min(n - 1, Math.floor(rand() * n));
      sum += deltas[idx];
    }
    means[b] = sum / n;
  }

  const alpha = (1 - confidence) / 2;
  const lo = quantile(means, alpha);
  const hi = quantile(means, 1 - alpha);
  return { point, lo, hi };
}

// MAD-based minimum detectable difference: the run-to-run jitter of an identical
// config, expressed on the metric's own scale. A margin at or under this floor
// is indistinguishable from noise. Thin wrapper over `mad` named for the role it
// plays in the verdict gate, so call sites read as intent, not as a raw stat.
function noiseFloorMad(repeatedSamples) {
  const m = mad(repeatedSamples);
  return Number.isFinite(m) ? m : NaN;
}

// CI-gated trustworthiness verdict. The stricter successor to trustVerdict: a
// WINNER must clear the sample-count gate, clear the noise floor, AND have a
// paired confidence interval that excludes zero. Any one failing downgrades the
// verdict with a machine-readable reason the reporter surfaces before any
// leaderboard text.
//
//   nSamples < minSamplesForWinner -> INCONCLUSIVE('insufficient_n')
//   margin <= noiseFloor           -> TIE('inside_noise_floor')
//   ci brackets zero (lo<=0<=hi)   -> TIE('ci_overlaps_zero')
//   otherwise                      -> WINNER('trusted_margin')
//
// The CI is the deciding rigor: even a margin above the noise floor is a TIE if
// the bootstrap says zero difference is still plausible.
function trustVerdictCI({ nSamples, margin, noiseFloor, ci, minSamplesForWinner = 3 }) {
  const n = typeof nSamples === 'number' ? nSamples : NaN;
  const m = typeof margin === 'number' ? margin : NaN;
  const floor = typeof noiseFloor === 'number' ? noiseFloor : NaN;

  if (!Number.isFinite(n) || n < minSamplesForWinner) {
    return { verdict: 'INCONCLUSIVE', reason: 'insufficient_n' };
  }
  if (!Number.isFinite(m) || !Number.isFinite(floor) || m <= floor) {
    return { verdict: 'TIE', reason: 'inside_noise_floor' };
  }
  // A missing or zero-straddling CI cannot support a confident win. A non-finite
  // bound is treated conservatively as "overlaps zero": no proof of separation.
  const lo = ci && typeof ci.lo === 'number' ? ci.lo : NaN;
  const hi = ci && typeof ci.hi === 'number' ? ci.hi : NaN;
  if (!Number.isFinite(lo) || !Number.isFinite(hi) || (lo <= 0 && 0 <= hi)) {
    return { verdict: 'TIE', reason: 'ci_overlaps_zero' };
  }
  return { verdict: 'WINNER', reason: 'trusted_margin' };
}

module.exports = {
  mean,
  median,
  mad,
  quantile,
  seededRandom,
  trustVerdict,
  bootstrapPairedDeltaCi,
  pairedWinRate,
  noiseFloorMad,
  trustVerdictCI,
};

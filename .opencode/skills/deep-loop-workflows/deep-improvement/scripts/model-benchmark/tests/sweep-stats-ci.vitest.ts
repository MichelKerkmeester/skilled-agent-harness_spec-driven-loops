import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { describe, it, expect } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../../../');
const MB_ROOT = path.join(
  WORKSPACE_ROOT,
  '.opencode/skills/deep-loop-workflows/deep-improvement/scripts/model-benchmark',
);

// The runtime modules are CommonJS; load them through a require bridge so the
// .cjs contracts are exercised exactly as the production sweep consumes them.
const require = createRequire(import.meta.url);
const stats = require(path.join(MB_ROOT, 'lib/sweep-stats.cjs'));
const { report } = require(path.join(MB_ROOT, 'lib/sweep-reporter.cjs'));

// ---------------------------------------------------------------------------
// bootstrapPairedDeltaCi: determinism + separation behavior.
// ---------------------------------------------------------------------------

describe('sweep-stats CI: bootstrapPairedDeltaCi', () => {
  it('is deterministic for a fixed seed (same inputs + seed => same CI)', () => {
    const a = [3, 5, 4, 6, 5, 7, 4, 5];
    const b = [2, 4, 4, 5, 3, 6, 4, 4];
    const first = stats.bootstrapPairedDeltaCi(a, b, { seed: 'fixed', iterations: 1500 });
    const second = stats.bootstrapPairedDeltaCi(a, b, { seed: 'fixed', iterations: 1500 });
    expect(second).toEqual(first);
    expect(Number.isFinite(first.point)).toBe(true);
    expect(Number.isFinite(first.lo)).toBe(true);
    expect(Number.isFinite(first.hi)).toBe(true);
    expect(first.lo).toBeLessThanOrEqual(first.hi);
  });

  it('different seeds may shift the interval but keep the same point estimate', () => {
    const a = [3, 5, 4, 6, 5, 7, 4, 5];
    const b = [2, 4, 4, 5, 3, 6, 4, 4];
    const s1 = stats.bootstrapPairedDeltaCi(a, b, { seed: 'one' });
    const s2 = stats.bootstrapPairedDeltaCi(a, b, { seed: 'two' });
    // The point is the mean of the raw deltas — seed-independent.
    expect(s1.point).toBe(s2.point);
  });

  it('a clearly-separated pair (A all 10, B all 0) -> CI excludes zero', () => {
    const a = [10, 10, 10, 10, 10];
    const b = [0, 0, 0, 0, 0];
    const ci = stats.bootstrapPairedDeltaCi(a, b, { seed: 'sep' });
    // Every paired delta is exactly 10, so every bootstrap mean is 10: a
    // zero-width CI pinned at 10, strictly above zero.
    expect(ci.point).toBe(10);
    expect(ci.lo).toBe(10);
    expect(ci.hi).toBe(10);
    expect(ci.lo > 0).toBe(true);
  });

  it('an overlapping pair (interleaved) -> CI includes zero', () => {
    const a = [10, 0, 10, 0, 10, 0];
    const b = [0, 10, 0, 10, 0, 10];
    const ci = stats.bootstrapPairedDeltaCi(a, b, { seed: 'overlap' });
    // Deltas are [10,-10,10,-10,10,-10]: mean 0 and the bootstrap of the mean
    // straddles zero.
    expect(ci.point).toBe(0);
    expect(ci.lo).toBeLessThanOrEqual(0);
    expect(ci.hi).toBeGreaterThanOrEqual(0);
  });

  it('n=1 paired observation -> zero-width CI at the point (no spread)', () => {
    const ci = stats.bootstrapPairedDeltaCi([7], [2], { seed: 'single' });
    expect(ci.point).toBe(5);
    expect(ci.lo).toBe(5);
    expect(ci.hi).toBe(5);
  });
});

// ---------------------------------------------------------------------------
// pairedWinRate + noiseFloorMad.
// ---------------------------------------------------------------------------

describe('sweep-stats CI: pairedWinRate + noiseFloorMad', () => {
  it('pairedWinRate counts strict A>B pairs only', () => {
    // A beats B on 3 of 4 comparable pairs (tie does not count).
    expect(stats.pairedWinRate([5, 5, 9, 1], [4, 4, 8, 1])).toBe(3 / 4);
    expect(stats.pairedWinRate([], [])).toBeNaN();
  });

  it('noiseFloorMad is the MAD of repeated identical-config samples', () => {
    // Identical repeated samples => zero detectable jitter.
    expect(stats.noiseFloorMad([4, 4, 4, 4])).toBe(0);
    // A spread series has a positive floor.
    expect(stats.noiseFloorMad([1, 2, 9, 10])).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// trustVerdictCI: the CI-gated verdict.
// ---------------------------------------------------------------------------

describe('sweep-stats CI: trustVerdictCI gate', () => {
  it("n below the floor -> INCONCLUSIVE('insufficient_n')", () => {
    expect(
      stats.trustVerdictCI({
        nSamples: 1,
        margin: 5,
        noiseFloor: 0.1,
        ci: { lo: 4, hi: 6 },
      }),
    ).toEqual({ verdict: 'INCONCLUSIVE', reason: 'insufficient_n' });
  });

  it("margin inside the noise floor -> TIE('inside_noise_floor')", () => {
    expect(
      stats.trustVerdictCI({
        nSamples: 5,
        margin: 0.05,
        noiseFloor: 0.1,
        ci: { lo: 4, hi: 6 },
      }),
    ).toEqual({ verdict: 'TIE', reason: 'inside_noise_floor' });
  });

  it("CI overlaps zero -> TIE('ci_overlaps_zero') even with a margin above the floor", () => {
    expect(
      stats.trustVerdictCI({
        nSamples: 5,
        margin: 0.5,
        noiseFloor: 0.1,
        ci: { lo: -0.2, hi: 0.9 },
      }),
    ).toEqual({ verdict: 'TIE', reason: 'ci_overlaps_zero' });
  });

  it("a missing CI is treated as overlapping zero -> TIE('ci_overlaps_zero')", () => {
    expect(
      stats.trustVerdictCI({
        nSamples: 5,
        margin: 0.5,
        noiseFloor: 0.1,
        ci: null,
      }),
    ).toEqual({ verdict: 'TIE', reason: 'ci_overlaps_zero' });
  });

  it("enough n + margin above floor + CI excludes zero -> WINNER('trusted_margin')", () => {
    expect(
      stats.trustVerdictCI({
        nSamples: 5,
        margin: 0.5,
        noiseFloor: 0.1,
        ci: { lo: 0.3, hi: 0.7 },
      }),
    ).toEqual({ verdict: 'WINNER', reason: 'trusted_margin' });
  });

  it('respects a custom minSamplesForWinner', () => {
    expect(
      stats.trustVerdictCI({
        nSamples: 2,
        margin: 0.5,
        noiseFloor: 0.1,
        ci: { lo: 0.3, hi: 0.7 },
        minSamplesForWinner: 5,
      }),
    ).toEqual({ verdict: 'INCONCLUSIVE', reason: 'insufficient_n' });
  });
});

// ---------------------------------------------------------------------------
// Reporter CI integration: clear-separation WINNER, overlap TIE, and the
// pre-existing saturation acceptance (saturation cannot be a correctness win).
// ---------------------------------------------------------------------------

// Build a synthetic per-cell row on the framework axis. A clean correctness rate
// of 1.0 everywhere keeps correctness gated (saturated), so the verdict is
// decided on the efficiency / format axis exactly as a real saturated run would.
function row(framework: string, fixture: string, sample: number, words: number) {
  return {
    cellId: framework + '::' + fixture,
    framework,
    model: framework, // groupBy 'model' falls back to the same axis in these rows
    fixture,
    sample,
    correctness_pass_rate: 1,
    assertions_passed: 1,
    assertions_total: 1,
    format_adherent: true,
    format_reason: null,
    output_words: words,
    output_chars: words * 5,
    extracted: true,
    extract_reason: null,
    per_test: [],
    dispatch_ok: true,
    exit_code: 0,
    latency_ms: 1,
    tokens_in: null,
    tokens_out: null,
    cost_usd: null,
  };
}

function sweepResult(rows: any[]) {
  return {
    profile: { id: 'synthetic', mode: 'framework-bakeoff', version: '0' },
    rows,
    meta: { generated_at: 'fixed' },
  };
}

const REPORT_OPTS = {
  groupBy: 'framework',
  write: false,
  // A fixed seed keeps the CI reproducible across CI machines.
  bootstrapSeed: 'ci-test',
  bootstrapIterations: 1500,
};

describe('reporter CI integration: clear separation crowns a trusted WINNER', () => {
  // Two frameworks, two fixtures, three samples each. `terse` always emits a
  // small word count; `verbose` always a large one. Correctness is saturated
  // (1.0 everywhere), so efficiency decides — and the paired deltas are a
  // constant non-zero per fixture, so the CI excludes zero.
  const rows: any[] = [];
  for (const fx of ['fa', 'fb']) {
    for (let s = 0; s < 3; s++) {
      rows.push(row('terse', fx, s, fx === 'fa' ? 12 : 18));
      rows.push(row('verbose', fx, s, fx === 'fa' ? 120 : 160));
    }
  }
  const { aggregate } = report(sweepResult(rows), { profile: {}, ...REPORT_OPTS });

  it('keeps correctness gated (saturated) — not a correctness winner', () => {
    expect(aggregate.correctness_saturated).toBe(true);
    expect(aggregate.ranking_key).not.toBe('correctness');
    expect(aggregate.verdict.ranking_key).not.toBe('correctness');
  });

  it('declares a trusted WINNER with a CI that excludes zero', () => {
    expect(aggregate.verdict.verdict).toBe('WINNER');
    expect(aggregate.verdict.reason).toBe('trusted_margin');
    expect(aggregate.verdict.n_samples).toBeGreaterThanOrEqual(3);
    expect(aggregate.verdict.margin).toBeGreaterThan(aggregate.verdict.noise_floor);
    expect(aggregate.verdict.ci).not.toBeNull();
    // The deciding-pair delta CI does not bracket zero.
    const ci = aggregate.verdict.ci;
    const overlapsZero = ci.lo <= 0 && 0 <= ci.hi;
    expect(overlapsZero).toBe(false);
  });

  it('ranks the terse framework first on efficiency', () => {
    expect(aggregate.groups[0].group).toBe('terse');
    expect(aggregate.groups[0].output_words_median).toBeLessThan(
      aggregate.groups[1].output_words_median,
    );
  });
});

describe('reporter CI integration: an overlapping pair is a TIE (ci_overlaps_zero)', () => {
  // Two frameworks whose per-fixture efficiency advantage flips fixture to
  // fixture: on `fa` group X is far shorter, on `fb` group Y is far shorter. The
  // aggregate medians differ by a hair (margin clears the zero within-cell noise
  // floor), but the large opposing per-fixture deltas make the paired bootstrap
  // CI straddle zero — so the verdict must be a TIE, never a WINNER.
  const rows: any[] = [];
  for (let s = 0; s < 3; s++) {
    // fa: X=10, Y=48  (delta -38)
    rows.push(row('x', 'fa', s, 10));
    rows.push(row('y', 'fa', s, 48));
    // fb: X=50, Y=14  (delta +36) -> opposing large deltas, near-cancelling mean
    rows.push(row('x', 'fb', s, 50));
    rows.push(row('y', 'fb', s, 14));
  }
  // X words sorted [10,10,10,50,50,50] -> median 30; Y [14,14,14,48,48,48] ->
  // median 31. Margin |30-31| = 1 > the within-cell noise floor of 0.
  const { aggregate } = report(sweepResult(rows), { profile: {}, ...REPORT_OPTS });

  it('does not crown a WINNER when the paired CI overlaps zero', () => {
    expect(aggregate.verdict.verdict).toBe('TIE');
    expect(aggregate.verdict.reason).toBe('ci_overlaps_zero');
    expect(aggregate.verdict.ci).not.toBeNull();
    const ci = aggregate.verdict.ci;
    expect(ci.lo).toBeLessThanOrEqual(0);
    expect(ci.hi).toBeGreaterThanOrEqual(0);
  });
});

describe('reporter CI integration: a single sample stays INCONCLUSIVE', () => {
  // One sample per cell: there is no paired spread to bootstrap, so the n-gate
  // alone decides and the verdict can never be a trusted win.
  const rows: any[] = [
    row('terse', 'fa', 0, 12),
    row('verbose', 'fa', 0, 120),
  ];
  const { aggregate } = report(sweepResult(rows), { profile: {}, ...REPORT_OPTS });

  it("returns INCONCLUSIVE('insufficient_n') on a single sample", () => {
    expect(aggregate.verdict.verdict).toBe('INCONCLUSIVE');
    expect(aggregate.verdict.reason).toBe('insufficient_n');
  });
});

describe('reporter CI integration: pre-existing saturation acceptance still holds', () => {
  // The original acceptance property: when correctness saturates at 1.0 with
  // zero variance across all cells, the run cannot produce a correctness winner.
  // A flat efficiency column (identical word counts) means efficiency cannot
  // separate either, so the verdict is a non-WINNER on a non-correctness key.
  const rows: any[] = [];
  for (const fw of ['a', 'b', 'c']) {
    for (let s = 0; s < 3; s++) {
      rows.push(row(fw, 'fa', s, 50)); // identical words across every group
    }
  }
  const { aggregate } = report(sweepResult(rows), { profile: {}, ...REPORT_OPTS });

  it('flags correctness saturated and refuses a correctness winner', () => {
    expect(aggregate.correctness_saturated).toBe(true);
    expect(aggregate.ranking_key).not.toBe('correctness');
    const isCorrectnessWinner =
      aggregate.verdict.verdict === 'WINNER' &&
      aggregate.verdict.ranking_key === 'correctness';
    expect(isCorrectnessWinner).toBe(false);
  });
});

// ───────────────────────────────────────────────────────────────
// TEST: Confidence Calibration (flag-gated, default-ON graduated)
// ───────────────────────────────────────────────────────────────
// Covers the isotonic fit/apply math (monotonicity + 0–1 bounds), the
// labeled-set loader validation, and the default-ON wiring contract:
// with the flag unset the committed model calibrates, while explicitly
// opting out (flag='false') fails safe to the rebalance-only value at
// output precision regardless of any configured model.

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  fitCalibration,
  applyCalibration,
  loadLabeledSet,
  loadCalibrationModel,
  type CalibrationSample,
  type CalibrationModel,
} from '../lib/search/confidence-calibration';
import { computeResultConfidence, type ScoredResult } from '../lib/search/confidence-scoring';

const FLAG = 'SPECKIT_CONFIDENCE_CALIBRATION';
const MODEL_PATH_VAR = 'SPECKIT_CONFIDENCE_CALIBRATION_MODEL';

// -- Fit math --

describe('fitCalibration() — isotonic PAV', () => {
  it('produces a non-decreasing curve from noisy labels', () => {
    // Relevance trends up with rawValue but with local noise; PAV must pool
    // the violators into a monotonic curve.
    const samples: CalibrationSample[] = [
      { rawValue: 0.1, relevant: 0 },
      { rawValue: 0.2, relevant: 1 }, // noise — out of order vs neighbor
      { rawValue: 0.3, relevant: 0 },
      { rawValue: 0.4, relevant: 0 },
      { rawValue: 0.5, relevant: 1 },
      { rawValue: 0.6, relevant: 0 }, // noise
      { rawValue: 0.7, relevant: 1 },
      { rawValue: 0.8, relevant: 1 },
      { rawValue: 0.9, relevant: 1 },
    ];
    const model = fitCalibration(samples);
    expect(model.method).toBe('isotonic');
    expect(model.fittedFrom).toBe(samples.length);
    expect(model.points.length).toBeGreaterThan(0);

    for (let i = 1; i < model.points.length; i++) {
      expect(model.points[i].y).toBeGreaterThanOrEqual(model.points[i - 1].y);
      expect(model.points[i].x).toBeGreaterThanOrEqual(model.points[i - 1].x);
      expect(model.points[i].y).toBeGreaterThanOrEqual(0);
      expect(model.points[i].y).toBeLessThanOrEqual(1);
    }
  });

  it('returns an empty (identity) model for no usable samples', () => {
    const model = fitCalibration([]);
    expect(model.points).toHaveLength(0);
    expect(model.fittedFrom).toBe(0);
    // Empty model is the identity transform.
    expect(applyCalibration(model, 0.42)).toBeCloseTo(0.42, 5);
  });

  it('filters out non-finite / non-binary samples', () => {
    const model = fitCalibration([
      { rawValue: Number.NaN, relevant: 1 },
      { rawValue: 0.5, relevant: 2 as unknown as 0 },
      { rawValue: 0.6, relevant: 1 },
    ]);
    expect(model.fittedFrom).toBe(1);
  });

  it('collapses adjacent equal-mean blocks into a single point', () => {
    // Three samples whose pooled means stay equal (all-positive, then a mix that
    // pools back to the same 0.5 mean) must not serialize as separate adjacent
    // points. Pooling equal means leaves y unchanged, so this is a size-only
    // guarantee — the curve and its interpolation are identical either way.
    const model = fitCalibration([
      { rawValue: 0.2, relevant: 1 },
      { rawValue: 0.4, relevant: 0 },
      { rawValue: 0.6, relevant: 1 },
      { rawValue: 0.8, relevant: 0 },
    ]);
    // After PAV all four pool to one block (mean y = 0.5); no two adjacent
    // emitted points share a y.
    for (let i = 1; i < model.points.length; i++) {
      expect(model.points[i].y).not.toBeCloseTo(model.points[i - 1].y, 12);
    }
    // monotonic + bounded still holds
    for (let i = 1; i < model.points.length; i++) {
      expect(model.points[i].y).toBeGreaterThanOrEqual(model.points[i - 1].y);
    }
  });
});

// -- Drift guard: lib PAV vs the offline seed generator --
//
// `004-…/assets/fit-calibration.mjs` carries a second, near-identical PAV loop
// for offline seed generation. The two are intentionally allowed to diverge in
// one respect — the offline asset breaks on `prev <= curr` (keeps adjacent
// equal-mean blocks) while the lib breaks on `prev < curr` (collapses them).
// This guard locks the lib's pooling contract so a future edit to the lib loop
// is caught by an assertion rather than silently desyncing from its own spec.

describe('fitCalibration() — PAV pooling contract (drift guard)', () => {
  // A reference PAV that mirrors the lib's break condition (`prev < curr`,
  // i.e. collapse equal means). If the lib diverges from this, the parity
  // assertion below fails.
  function referencePav(
    samples: CalibrationSample[],
  ): Array<{ x: number; y: number }> {
    const clean = samples
      .filter((s) => Number.isFinite(s.rawValue) && (s.relevant === 0 || s.relevant === 1))
      .map((s) => ({ x: Math.max(0, Math.min(1, s.rawValue)), y: s.relevant as number }))
      .sort((a, b) => a.x - b.x);
    const blocks: Array<{ sumX: number; sumY: number; count: number }> = [];
    for (const { x, y } of clean) {
      blocks.push({ sumX: x, sumY: y, count: 1 });
      while (blocks.length >= 2) {
        const curr = blocks[blocks.length - 1]!;
        const prev = blocks[blocks.length - 2]!;
        if (prev.sumY / prev.count < curr.sumY / curr.count) break;
        prev.sumX += curr.sumX;
        prev.sumY += curr.sumY;
        prev.count += curr.count;
        blocks.pop();
      }
    }
    return blocks.map((b) => ({ x: b.sumX / b.count, y: Math.max(0, Math.min(1, b.sumY / b.count)) }));
  }

  it('matches the reference PAV across noisy and equal-mean inputs', () => {
    const cases: CalibrationSample[][] = [
      [
        { rawValue: 0.1, relevant: 0 },
        { rawValue: 0.2, relevant: 1 },
        { rawValue: 0.3, relevant: 0 },
        { rawValue: 0.4, relevant: 0 },
        { rawValue: 0.5, relevant: 1 },
        { rawValue: 0.6, relevant: 0 },
        { rawValue: 0.7, relevant: 1 },
        { rawValue: 0.8, relevant: 1 },
        { rawValue: 0.9, relevant: 1 },
      ],
      [
        { rawValue: 0.2, relevant: 1 },
        { rawValue: 0.4, relevant: 0 },
        { rawValue: 0.6, relevant: 1 },
        { rawValue: 0.8, relevant: 0 },
      ],
      [
        { rawValue: 0.0, relevant: 0 },
        { rawValue: 1.0, relevant: 1 },
      ],
    ];
    for (const samples of cases) {
      const lib = fitCalibration(samples).points;
      const ref = referencePav(samples);
      expect(lib.length).toBe(ref.length);
      for (let i = 0; i < lib.length; i++) {
        expect(lib[i].x).toBeCloseTo(ref[i].x, 12);
        expect(lib[i].y).toBeCloseTo(ref[i].y, 12);
      }
    }
  });
});

// -- Apply math --

describe('applyCalibration() — bounded + monotonic', () => {
  const model: CalibrationModel = fitCalibration([
    { rawValue: 0.0, relevant: 0 },
    { rawValue: 0.25, relevant: 0 },
    { rawValue: 0.5, relevant: 1 },
    { rawValue: 0.75, relevant: 1 },
    { rawValue: 1.0, relevant: 1 },
  ]);

  it('is monotonic non-decreasing across a dense sweep', () => {
    let prev = -Infinity;
    for (let x = 0; x <= 1.0001; x += 0.01) {
      const y = applyCalibration(model, x);
      expect(y).toBeGreaterThanOrEqual(0);
      expect(y).toBeLessThanOrEqual(1);
      expect(y).toBeGreaterThanOrEqual(prev - 1e-9);
      prev = y;
    }
  });

  it('clamps out-of-range raw values to the curve endpoints', () => {
    const lo = applyCalibration(model, -5);
    const hi = applyCalibration(model, 5);
    expect(lo).toBeGreaterThanOrEqual(0);
    expect(hi).toBeLessThanOrEqual(1);
    expect(hi).toBeGreaterThanOrEqual(lo);
  });
});

// -- Labeled-set loader --

describe('loadLabeledSet()', () => {
  it('accepts well-formed pairs', () => {
    const pairs = loadLabeledSet([
      { query: 'token budget truncation', memoryId: 42, relevant: 1 },
      { query: 'token budget truncation', memoryId: 'spec/foo', relevant: 0 },
    ]);
    expect(pairs).toHaveLength(2);
    expect(pairs[0].relevant).toBe(1);
  });

  it('rejects a non-array', () => {
    expect(() => loadLabeledSet({} as unknown)).toThrow();
  });

  it('rejects malformed entries', () => {
    expect(() => loadLabeledSet([{ query: '', memoryId: 1, relevant: 1 }])).toThrow();
    expect(() => loadLabeledSet([{ query: 'q', memoryId: null, relevant: 1 }])).toThrow();
    expect(() => loadLabeledSet([{ query: 'q', memoryId: 1, relevant: 2 }])).toThrow();
  });
});

// -- Model file loader --

describe('loadCalibrationModel()', () => {
  let dir: string;
  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'calib-'));
  });
  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it('returns null for a missing path', () => {
    expect(loadCalibrationModel(join(dir, 'nope.json'))).toBeNull();
  });

  it('returns null for an invalid model shape', () => {
    const p = join(dir, 'bad.json');
    writeFileSync(p, JSON.stringify({ method: 'platt', points: [] }));
    expect(loadCalibrationModel(p)).toBeNull();
  });

  it('round-trips a fitted model', () => {
    const model = fitCalibration([
      { rawValue: 0.1, relevant: 0 },
      { rawValue: 0.9, relevant: 1 },
    ]);
    const p = join(dir, 'model.json');
    writeFileSync(p, JSON.stringify(model));
    const loaded = loadCalibrationModel(p);
    expect(loaded).not.toBeNull();
    expect(loaded!.method).toBe('isotonic');
    expect(loaded!.points.length).toBe(model.points.length);
  });
});

// -- Wiring: default-ON contract + opt-out fail-safe --

describe('confidence-scoring wiring — calibration default ON', () => {
  let dir: string;
  const sample: ScoredResult[] = [
    { id: 1, similarity: 80, sources: ['vector', 'fts'], anchorMetadata: [{ id: 'a' }, { id: 'b' }] },
    { id: 2, similarity: 40 },
  ];

  // The rebalance-only value with calibration explicitly disabled: the identity
  // baseline every opt-out assertion compares against, independent of any model.
  function rebalanceOnlyValue(): number {
    process.env[FLAG] = 'false';
    delete process.env[MODEL_PATH_VAR];
    return computeResultConfidence(sample)[0].confidence.value;
  }

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'calib-wire-'));
    delete process.env[FLAG];
    delete process.env[MODEL_PATH_VAR];
  });
  afterEach(() => {
    delete process.env[FLAG];
    delete process.env[MODEL_PATH_VAR];
    rmSync(dir, { recursive: true, force: true });
  });

  it('opts out to the uncalibrated identity when the flag is "false", even with a model configured', () => {
    const baseline = rebalanceOnlyValue();

    // A model that would collapse everything to ~0 if it were applied.
    const flatModel: CalibrationModel = {
      method: 'isotonic',
      points: [{ x: 0, y: 0.01 }, { x: 1, y: 0.01 }],
      fittedFrom: 2,
    };
    const p = join(dir, 'flat.json');
    writeFileSync(p, JSON.stringify(flatModel));
    process.env[MODEL_PATH_VAR] = p;
    process.env[FLAG] = 'false';
    // Flag explicitly OFF — model must be ignored at output precision.

    const withModelButFlagOff = computeResultConfidence(sample)[0].confidence.value;
    expect(withModelButFlagOff).toBeCloseTo(baseline, 6);
  });

  it('opts out to the uncalibrated identity when the flag is "false" with the model path unset (default model not loaded)', () => {
    const baseline = rebalanceOnlyValue();

    // Flag OFF, MODEL_PATH_VAR unset: the committed default model must NOT be
    // consulted — opting out is byte-stable against the default-on path too.
    process.env[FLAG] = 'false';
    const value = computeResultConfidence(sample)[0].confidence.value;
    expect(value).toBeCloseTo(baseline, 6);
  });

  it('calibrates by default (flag unset, model path unset) via the committed model', () => {
    const baseline = rebalanceOnlyValue();
    expect(baseline).toBeGreaterThan(0.1); // rebalance-only value is healthy

    // Default-on, no env model: the committed isotonic model resolves and
    // reshapes confidence away from the rebalance-only identity.
    delete process.env[FLAG];
    delete process.env[MODEL_PATH_VAR];
    const defaultResult = computeResultConfidence(sample)[0];
    expect(defaultResult.confidence.value).not.toBeCloseTo(baseline, 4);
    // The pre-calibration value is preserved regardless of calibration.
    expect(defaultResult.preCalibrationValue).toBeGreaterThan(0.1);
  });

  it('an empty model path disables calibration even with the flag on', () => {
    const baseline = rebalanceOnlyValue();

    // Explicit empty string disables: no model resolves, so the flag-on path
    // fails safe to the rebalance-only identity rather than the default model.
    process.env[FLAG] = 'true';
    process.env[MODEL_PATH_VAR] = '';
    const value = computeResultConfidence(sample)[0].confidence.value;
    expect(value).toBeCloseTo(baseline, 6);
  });

  it('applies an override model when the flag is ON and a model path is configured', () => {
    const baselineResult = (() => {
      process.env[FLAG] = 'false';
      delete process.env[MODEL_PATH_VAR];
      return computeResultConfidence(sample)[0];
    })();
    const baseline = baselineResult.confidence.value;
    expect(baseline).toBeGreaterThan(0.1); // rebalance-only value is healthy

    const flatModel: CalibrationModel = {
      method: 'isotonic',
      points: [{ x: 0, y: 0.01 }, { x: 1, y: 0.01 }],
      fittedFrom: 2,
    };
    const p = join(dir, 'flat.json');
    writeFileSync(p, JSON.stringify(flatModel));
    process.env[MODEL_PATH_VAR] = p;
    process.env[FLAG] = 'true';

    const calibratedResult = computeResultConfidence(sample)[0];
    const calibrated = calibratedResult.confidence.value;
    expect(calibrated).toBeLessThan(baseline);
    expect(calibrated).toBeCloseTo(0.01, 3);
    expect(calibratedResult.preCalibrationValue).toBeCloseTo(baselineResult.preCalibrationValue, 6);
  });
});

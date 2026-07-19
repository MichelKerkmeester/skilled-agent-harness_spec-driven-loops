// ───────────────────────────────────────────────────────────────────
// MODULE: Confidence Calibration Quality — ON-path contract
// ───────────────────────────────────────────────────────────────────
// Asserts the calibration-quality contract the SPECKIT_CONFIDENCE_CALIBRATION
// flag exists to deliver: mapping raw confidence values through a fitted
// isotonic model moves them toward observed P(relevant), LOWERING Expected
// Calibration Error (ECE) and the Brier score. This is the metric the
// calibration eval reports; the wiring (flag gating the apply) is covered
// separately in confidence-calibration.vitest.ts. Here the new contract is the
// measurable quality improvement, not byte-identity to the flag-off path.

import { describe, expect, it } from 'vitest';

import {
  fitCalibration,
  applyCalibration,
  type CalibrationSample,
} from '../lib/search/confidence-calibration';
import { computeCalibrationMetrics } from '../lib/eval/eval-metrics';

// A deliberately MIScalibrated raw-confidence set: relevance rises with the raw
// value, but the raw value overstates it (raw 0.9 → only ~50% relevant). A good
// calibration must pull these toward their true empirical rates.
function miscalibratedSamples(): CalibrationSample[] {
  const samples: CalibrationSample[] = [];
  const buckets: Array<{ raw: number; relevantRate: number; n: number }> = [
    { raw: 0.1, relevantRate: 0.0, n: 40 },
    { raw: 0.3, relevantRate: 0.1, n: 40 },
    { raw: 0.5, relevantRate: 0.2, n: 40 },
    { raw: 0.7, relevantRate: 0.35, n: 40 },
    { raw: 0.9, relevantRate: 0.5, n: 40 },
  ];
  for (const bucket of buckets) {
    const positives = Math.round(bucket.relevantRate * bucket.n);
    for (let i = 0; i < bucket.n; i += 1) {
      samples.push({ rawValue: bucket.raw, relevant: i < positives ? 1 : 0 });
    }
  }
  return samples;
}

describe('confidence calibration quality — ECE/Brier improvement', () => {
  it('fits a monotonic non-decreasing isotonic curve', () => {
    const model = fitCalibration(miscalibratedSamples());
    expect(model.points.length).toBeGreaterThan(0);
    for (let i = 1; i < model.points.length; i += 1) {
      expect(model.points[i].y).toBeGreaterThanOrEqual(model.points[i - 1].y);
    }
  });

  it('lowers ECE when the fitted model is applied (the calibration contract)', () => {
    const samples = miscalibratedSamples();
    const model = fitCalibration(samples);

    const calibrated = samples.map((s) => ({
      rawValue: applyCalibration(model, s.rawValue),
      relevant: s.relevant,
    }));

    const before = computeCalibrationMetrics(samples);
    const after = computeCalibrationMetrics(calibrated);

    // The calibrated value is strictly better-aligned with observed relevance.
    expect(after.ece).toBeLessThan(before.ece);
    expect(after.brier).toBeLessThanOrEqual(before.brier);
    // Behavior genuinely changed — this is not the identity map.
    expect(after.ece).not.toBeCloseTo(before.ece, 4);
  });

  it('maps the overstated head bucket down toward its empirical rate', () => {
    const samples = miscalibratedSamples();
    const model = fitCalibration(samples);

    // Raw 0.9 bucket is only 50% relevant; the calibrated value must land near
    // 0.5, not stay at the overstated 0.9.
    const calibratedHead = applyCalibration(model, 0.9);
    expect(calibratedHead).toBeLessThan(0.7);
    expect(calibratedHead).toBeGreaterThan(0.3);
  });

  it('keeps an already-calibrated set from getting worse', () => {
    // Perfectly calibrated buckets: raw value == empirical relevance rate.
    const samples: CalibrationSample[] = [];
    for (const raw of [0.2, 0.5, 0.8]) {
      const n = 50;
      const positives = Math.round(raw * n);
      for (let i = 0; i < n; i += 1) {
        samples.push({ rawValue: raw, relevant: i < positives ? 1 : 0 });
      }
    }
    const model = fitCalibration(samples);
    const calibrated = samples.map((s) => ({
      rawValue: applyCalibration(model, s.rawValue),
      relevant: s.relevant,
    }));
    const before = computeCalibrationMetrics(samples);
    const after = computeCalibrationMetrics(calibrated);
    // Calibration must not degrade an already-good set.
    expect(after.ece).toBeLessThanOrEqual(before.ece + 1e-6);
  });
});

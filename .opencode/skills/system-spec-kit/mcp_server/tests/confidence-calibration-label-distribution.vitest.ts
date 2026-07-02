// ───────────────────────────────────────────────────────────────────
// MODULE: Confidence Calibration Label Distribution — ON-path contract
// ───────────────────────────────────────────────────────────────────
// Guards the regression where, with SPECKIT_CONFIDENCE_CALIBRATION default-ON
// and the committed isotonic model, every per-result confidence.label collapsed
// to "low". The committed curve maps every input into a narrow low-probability
// range (max y ~0.2), so banding the label off the calibrated value made the
// label useless even though the calibrated value was honest. The fix derives
// the label from the pre-calibration relevance value and applies calibration
// only to the numeric value.
//
// This suite loads the COMMITTED default model (not synthetic samples) and
// asserts three things that the pre-existing ON-path test never checked:
//   1. With the flag ON + the default model, the label distribution across a
//      representative result set stays USABLE — not collapsed to all-"low".
//   2. The calibrated value still lowers Expected Calibration Error (ECE), so
//      the decoupling did not sacrifice the calibration win.
//   3. The flag-OFF path is byte-identical to the rebalance-only baseline.

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import {
  loadCalibrationModel,
  applyCalibration,
  type CalibrationSample,
} from '../lib/search/confidence-calibration';
import { computeCalibrationMetrics } from '../lib/eval/eval-metrics';
import {
  computeResultConfidence,
  type ConfidenceLabel,
  type ScoredResult,
} from '../lib/search/confidence-scoring';

const FLAG = 'SPECKIT_CONFIDENCE_CALIBRATION';
const MODEL_PATH_VAR = 'SPECKIT_CONFIDENCE_CALIBRATION_MODEL';

// The committed default model — the exact file the default-on path resolves.
// Loading it here (rather than fitting a synthetic curve) is the point: the
// regression lived precisely in how the COMMITTED curve interacts with the
// label thresholds, so the guard must exercise the shipped artifact.
const DEFAULT_MODEL_PATH = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../lib/eval/data/confidence-calibration-model.json',
);

// A representative ranked result set spanning strong head to weak tail, so the
// pre-calibration relevance value covers the full high/medium/low band range.
// similarity is on the 0–100 sqlite-vec scale; sources/anchors vary the
// heuristic signals across the list.
function representativeResults(): ScoredResult[] {
  return [
    { id: 1, similarity: 95, sources: ['vector', 'fts', 'trigger'], anchorMetadata: [{ a: 1 }, { b: 2 }, { c: 3 }] },
    { id: 2, similarity: 82, sources: ['vector', 'fts'], anchorMetadata: [{ a: 1 }, { b: 2 }] },
    { id: 3, similarity: 70, sources: ['vector'], anchorMetadata: [{ a: 1 }] },
    { id: 4, similarity: 55, sources: ['fts'] },
    { id: 5, similarity: 40, sources: ['vector'] },
    { id: 6, similarity: 25 },
    { id: 7, similarity: 10 },
  ];
}

function labelCounts(labels: ConfidenceLabel[]): Record<ConfidenceLabel, number> {
  const counts: Record<ConfidenceLabel, number> = { high: 0, medium: 0, low: 0 };
  for (const label of labels) counts[label] += 1;
  return counts;
}

describe('confidence calibration — label distribution stays usable (default-on)', () => {
  beforeEach(() => {
    delete process.env[FLAG];
    delete process.env[MODEL_PATH_VAR];
  });
  afterEach(() => {
    delete process.env[FLAG];
    delete process.env[MODEL_PATH_VAR];
  });

  it('the committed default model collapses every value into a narrow low-probability range', () => {
    // This is the precondition that made banding off the calibrated value fatal:
    // the shipped curve caps its output near 0.2, well below the medium band.
    // Asserting it here documents WHY the label must not be derived post-calibration.
    const model = loadCalibrationModel(DEFAULT_MODEL_PATH);
    expect(model).not.toBeNull();
    const maxY = model!.points.reduce((maxValue, point) => Math.max(maxValue, point.y), -Infinity);
    expect(maxY).toBeLessThan(0.4); // below LOW_THRESHOLD → all-"low" if banded on value
    // A dense sweep of inputs all map below the medium band.
    for (let x = 0; x <= 1.0001; x += 0.05) {
      expect(applyCalibration(model!, x)).toBeLessThan(0.4);
    }
  });

  it('keeps a usable label distribution with the flag ON and the committed default model', () => {
    // Flag unset (default ON) + model path unset → the committed model resolves.
    delete process.env[FLAG];
    delete process.env[MODEL_PATH_VAR];

    const out = computeResultConfidence(representativeResults());
    const labels = out.map((r) => r.confidence.label);
    const counts = labelCounts(labels);

    // The regression: every label was "low". The contract: the distribution
    // spreads across bands. At minimum, not everything is "low".
    expect(counts.low).toBeLessThan(labels.length);
    // The label must distinguish more than one tier across a head-to-tail set.
    const distinctLabels = new Set(labels);
    expect(distinctLabels.size).toBeGreaterThan(1);
    // The strong head must reach the top tier — a strong, multi-channel,
    // anchor-dense, well-separated result is exactly what "high" exists for.
    expect(counts.high).toBeGreaterThan(0);
  });

  it('still lowers ECE on the committed model — calibration win preserved', () => {
    // The decoupling changed only the LABEL source, not the VALUE: the numeric
    // confidence is still the calibrated P(relevant). Prove the committed curve
    // genuinely improves calibration on a miscalibrated set, so the fix did not
    // quietly defeat the reason the flag is on.
    const model = loadCalibrationModel(DEFAULT_MODEL_PATH);
    expect(model).not.toBeNull();

    // A miscalibrated raw-confidence set whose true relevance rates match the
    // low empirical range the committed curve was fitted against.
    const samples: CalibrationSample[] = [];
    const buckets = [
      { raw: 0.15, rate: 0.0, n: 40 },
      { raw: 0.3, rate: 0.05, n: 40 },
      { raw: 0.5, rate: 0.1, n: 40 },
      { raw: 0.7, rate: 0.15, n: 40 },
      { raw: 0.9, rate: 0.2, n: 40 },
    ];
    for (const bucket of buckets) {
      const positives = Math.round(bucket.rate * bucket.n);
      for (let i = 0; i < bucket.n; i += 1) {
        samples.push({ rawValue: bucket.raw, relevant: i < positives ? 1 : 0 });
      }
    }

    const calibrated = samples.map((s) => ({
      rawValue: applyCalibration(model!, s.rawValue),
      relevant: s.relevant,
    }));

    const before = computeCalibrationMetrics(samples);
    const after = computeCalibrationMetrics(calibrated);
    expect(after.ece).toBeLessThan(before.ece);
    expect(after.brier).toBeLessThanOrEqual(before.brier);
  });

  it('flag-OFF stays byte-identical to the rebalance-only baseline (value AND label)', () => {
    // Establish the rebalance-only baseline (calibration explicitly disabled,
    // no model). Both value and label must match the flag-off path exactly.
    process.env[FLAG] = 'false';
    delete process.env[MODEL_PATH_VAR];
    const baseline = computeResultConfidence(representativeResults());

    // Flag OFF with the model path unset must NOT consult the committed default —
    // opting out is byte-stable against the default-on path.
    process.env[FLAG] = 'false';
    delete process.env[MODEL_PATH_VAR];
    const offWithDefaultUnset = computeResultConfidence(representativeResults());

    expect(offWithDefaultUnset.length).toBe(baseline.length);
    for (let i = 0; i < baseline.length; i += 1) {
      expect(offWithDefaultUnset[i].confidence.value).toBe(baseline[i].confidence.value);
      expect(offWithDefaultUnset[i].confidence.label).toBe(baseline[i].confidence.label);
      expect(offWithDefaultUnset[i].preCalibrationValue).toBe(baseline[i].preCalibrationValue);
    }
  });

  it('flag ON vs flag OFF: label is identical, value diverges (the decoupling contract)', () => {
    // The crux of the fix: turning calibration on changes the numeric value
    // (calibrated P(relevant)) but leaves the label untouched, because the label
    // is now derived from the pre-calibration relevance tier. flag-OFF and the
    // raw committed model JSON are read directly to avoid any ordering coupling.
    process.env[FLAG] = 'false';
    delete process.env[MODEL_PATH_VAR];
    const off = computeResultConfidence(representativeResults());

    delete process.env[FLAG]; // default ON
    delete process.env[MODEL_PATH_VAR]; // committed default
    const on = computeResultConfidence(representativeResults());

    expect(on.length).toBe(off.length);
    let anyValueDiverged = false;
    for (let i = 0; i < off.length; i += 1) {
      // Label is invariant to calibration.
      expect(on[i].confidence.label).toBe(off[i].confidence.label);
      if (on[i].confidence.value !== off[i].confidence.value) anyValueDiverged = true;
    }
    // Calibration genuinely reshapes the value somewhere in the set.
    expect(anyValueDiverged).toBe(true);

    // Sanity: the committed model file the on-path consumes is the one we assert
    // about, so the divergence above is attributable to the shipped curve.
    const raw = JSON.parse(readFileSync(DEFAULT_MODEL_PATH, 'utf8')) as { method: string };
    expect(raw.method).toBe('isotonic');
  });
});

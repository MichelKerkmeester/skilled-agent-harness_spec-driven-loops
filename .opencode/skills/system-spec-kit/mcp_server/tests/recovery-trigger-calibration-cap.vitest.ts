// ───────────────────────────────────────────────────────────────────
// MODULE: Recovery Trigger vs Calibration Cap — ON-path contract
// ───────────────────────────────────────────────────────────────────
// Guards the regression where SPECKIT_CONFIDENCE_CALIBRATION default-ON caps the
// per-result confidence.value into a narrow low-probability band (the committed
// isotonic curve maxes out near 0.2). The recovery decision averaged that capped
// calibrated value into avgConfidence and fed it to shouldTriggerRecovery, whose
// low-confidence threshold is 0.4. With every healthy result averaging <= 0.2 the
// trigger was structurally always-true, so every non-empty search emitted a
// spurious recovery advisory and a mislabeled low_confidence status.
//
// The AWS-1 label fix decoupled the LABEL from the calibrated value; this is the
// SECOND consumer of the same capped value. The fix averages preCalibrationValue
// — the relevance-tier signal the label already bands off — so recovery reads the
// pre-calibration relevance signal, not the calibrated P(relevant).
//
// This suite exercises the real seam end to end: computeResultConfidence under
// the committed default model, the exact averaging from search-results.ts, and
// shouldTriggerRecovery. It asserts recovery is FALSE on a strong result set,
// still TRUE on a weak or empty set, and that the OLD choice (confidence.value)
// would have tripped recovery — so the calibration cap can never silently trip
// recovery again.

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  computeResultConfidence,
  type ResultConfidence,
  type ScoredResult,
} from '../lib/search/confidence-scoring';
import { loadCalibrationModel } from '../lib/search/confidence-calibration';
import { shouldTriggerRecovery } from '../lib/search/recovery-payload';

const FLAG = 'SPECKIT_CONFIDENCE_CALIBRATION';
const MODEL_PATH_VAR = 'SPECKIT_CONFIDENCE_CALIBRATION_MODEL';

// The committed default model — the exact curve the default-on path resolves and
// the one whose ~0.2 output ceiling is the root of the regression.
const DEFAULT_MODEL_PATH = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../lib/eval/data/confidence-calibration-model.json',
);

// A strong, healthy result set: high similarity, multi-channel agreement, and
// anchor density across the head, so the pre-calibration relevance signal sits
// well above the 0.4 recovery threshold. This is exactly the kind of search that
// must NOT trigger a recovery advisory.
function strongResults(): ScoredResult[] {
  return [
    { id: 1, similarity: 96, sources: ['vector', 'fts', 'trigger'], anchorMetadata: [{ a: 1 }, { b: 2 }, { c: 3 }] },
    { id: 2, similarity: 93, sources: ['vector', 'fts', 'trigger'], anchorMetadata: [{ a: 1 }, { b: 2 }, { c: 3 }] },
    { id: 3, similarity: 90, sources: ['vector', 'fts'], anchorMetadata: [{ a: 1 }, { b: 2 }] },
    { id: 4, similarity: 87, sources: ['vector', 'fts'], anchorMetadata: [{ a: 1 }, { b: 2 }] },
    { id: 5, similarity: 84, sources: ['vector', 'fts'], anchorMetadata: [{ a: 1 }] },
  ];
}

// A genuinely weak result set: low similarity, single channel, no anchors. The
// pre-calibration relevance signal stays below the recovery threshold, so this
// SHOULD still trigger recovery even after the fix.
function weakResults(): ScoredResult[] {
  return [
    { id: 1, similarity: 18, sources: ['vector'] },
    { id: 2, similarity: 12, sources: ['fts'] },
    { id: 3, similarity: 8, sources: ['vector'] },
    { id: 4, similarity: 5, sources: ['fts'] },
  ];
}

// Mirror of the recovery-decision averaging in
// formatters/search-results.ts: avgConfidence is the mean of preCalibrationValue
// across the per-result confidence array.
function avgPreCalibration(confidenceData: ResultConfidence[]): number {
  const sum = confidenceData.reduce((acc, c) => acc + c.preCalibrationValue, 0);
  return sum / confidenceData.length;
}

// The OLD (buggy) averaging: the calibrated, capped confidence.value. Kept only
// to prove the regression is real — averaging this trips recovery on a healthy set.
function avgCalibratedValue(confidenceData: ResultConfidence[]): number {
  const sum = confidenceData.reduce((acc, c) => acc + c.confidence.value, 0);
  return sum / confidenceData.length;
}

describe('recovery trigger vs calibration cap (default-on)', () => {
  beforeEach(() => {
    delete process.env[FLAG];
    delete process.env[MODEL_PATH_VAR];
  });
  afterEach(() => {
    delete process.env[FLAG];
    delete process.env[MODEL_PATH_VAR];
  });

  it('the committed default model caps the calibrated value below the recovery threshold', () => {
    // Precondition that made averaging confidence.value fatal for recovery: the
    // shipped curve's entire output ceiling sits under the 0.4 recovery threshold,
    // so no healthy set can clear it on the calibrated value.
    const model = loadCalibrationModel(DEFAULT_MODEL_PATH);
    expect(model).not.toBeNull();
    const maxY = Math.max(...model!.points.map((p) => p.y));
    expect(maxY).toBeLessThan(0.4);
  });

  it('does NOT trigger recovery on a strong result set under calibration default-on', () => {
    // Flag unset (default ON) + model path unset → the committed model resolves.
    const confidenceData = computeResultConfidence(strongResults());
    const avgConfidence = avgPreCalibration(confidenceData);

    // The pre-calibration relevance signal for a strong, multi-channel, anchor-dense
    // set clears the recovery threshold — recovery is the wrong response here.
    expect(avgConfidence).toBeGreaterThanOrEqual(0.4);
    expect(
      shouldTriggerRecovery({
        query: 'mcp daemon reelection lease ownership',
        hasSpecFolderFilter: false,
        resultCount: confidenceData.length,
        avgConfidence,
      }),
    ).toBe(false);
  });

  it('averaging the calibrated value (the old choice) WOULD trip recovery on the same strong set', () => {
    // This is the regression made explicit: feeding the capped calibrated value
    // averages below threshold and trips recovery on a healthy search. The fix
    // is precisely choosing preCalibrationValue over confidence.value.
    const confidenceData = computeResultConfidence(strongResults());
    const buggyAvg = avgCalibratedValue(confidenceData);

    expect(buggyAvg).toBeLessThan(0.4);
    expect(
      shouldTriggerRecovery({
        query: 'mcp daemon reelection lease ownership',
        hasSpecFolderFilter: false,
        resultCount: confidenceData.length,
        avgConfidence: buggyAvg,
      }),
    ).toBe(true);
  });

  it('STILL triggers recovery on a genuinely weak result set under calibration default-on', () => {
    // The fix must not mute recovery for real low-signal results: a low-similarity,
    // single-channel, anchor-free set keeps a pre-calibration signal below threshold.
    const confidenceData = computeResultConfidence(weakResults());
    const avgConfidence = avgPreCalibration(confidenceData);

    expect(avgConfidence).toBeLessThan(0.4);
    expect(
      shouldTriggerRecovery({
        query: 'xyzzy',
        hasSpecFolderFilter: false,
        resultCount: confidenceData.length,
        avgConfidence,
      }),
    ).toBe(true);
  });

  it('STILL triggers recovery on an empty result set regardless of calibration', () => {
    // resultCount 0 short-circuits to recovery before confidence is consulted.
    expect(
      shouldTriggerRecovery({
        query: 'nothing matches this',
        hasSpecFolderFilter: false,
        resultCount: 0,
      }),
    ).toBe(true);
  });
});

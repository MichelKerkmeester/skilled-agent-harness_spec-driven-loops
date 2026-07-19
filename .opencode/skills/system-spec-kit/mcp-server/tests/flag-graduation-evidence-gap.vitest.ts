// ───────────────────────────────────────────────────────────────
// TEST: Flag Graduation: Evidence Gap Verdict
// ───────────────────────────────────────────────────────────────
// SPECKIT_EVIDENCE_GAP_VERDICT caps an otherwise-good verdict at weak when the
// caller threads in a true Stage 4 evidenceGapDetected. The off-corpus class
// never sets that signal, so the benchmark never exercised the cap. These cases
// drive it off the shared gap-bearing fixture: the cap fires on the gap, the
// no-gap twin stays good (proving the cap is driven by the passed signal, not the
// rows) and the flag-off path ignores the gap exactly as the shipped path does.
//
// The verdict-moving flags are pinned off so the base verdict is a clean good,
// isolating the evidence-gap bridge as the only variable under test.

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  assessRequestQuality,
  computeResultConfidence,
  type ScoredResult,
} from '../lib/search/confidence-scoring';
import { FLAG_FEATURE_FIXTURES } from '../lib/eval/fixtures/flag-feature-fixtures';

const EVIDENCE_GAP_FLAG = 'SPECKIT_EVIDENCE_GAP_VERDICT';
const NOISE_FLOOR_FLAG = 'SPECKIT_NOISE_FLOOR_SUBTRACTION';
const LEXICAL_GROUNDING_FLAG = 'SPECKIT_LEXICAL_GROUNDING';
const CONFIDENCE_CALIBRATION_FLAG = 'SPECKIT_CONFIDENCE_CALIBRATION';
const MANAGED_FLAGS = [
  EVIDENCE_GAP_FLAG,
  NOISE_FLOOR_FLAG,
  LEXICAL_GROUNDING_FLAG,
  CONFIDENCE_CALIBRATION_FLAG,
] as const;

const saved = new Map<string, string | undefined>();

beforeEach(() => {
  for (const flag of MANAGED_FLAGS) saved.set(flag, process.env[flag]);
  for (const flag of MANAGED_FLAGS) delete process.env[flag];
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

const { withGap, withoutGap } = FLAG_FEATURE_FIXTURES.evidenceGap;

function verdict(rows: ScoredResult[], evidenceGapDetected: boolean): string {
  return assessRequestQuality(rows, computeResultConfidence(rows), { evidenceGapDetected })
    .requestQuality.label;
}

describe('flag graduation: evidence-gap verdict bridge', () => {
  it('caps an otherwise-good verdict at weak on a detected gap with the flag on', () => {
    process.env[EVIDENCE_GAP_FLAG] = 'true';
    expect(verdict(withGap.rows, true)).toBe('weak');
  });

  it('leaves the verdict good when no gap is detected, proving the cap reads the passed signal', () => {
    process.env[EVIDENCE_GAP_FLAG] = 'true';
    expect(verdict(withoutGap.rows, false)).toBe('good');
  });

  it('measures the cap as a one-verdict change driven by the gap signal', () => {
    process.env[EVIDENCE_GAP_FLAG] = 'true';
    const noGap = verdict(withGap.rows, false);
    const gap = verdict(withGap.rows, true);
    expect(noGap).toBe('good');
    expect(gap).toBe('weak');
    expect(gap).not.toBe(noGap);
  });

  it('ignores a detected gap with the flag off, unchanged from the shipped path', () => {
    process.env[EVIDENCE_GAP_FLAG] = 'false';
    expect(verdict(withGap.rows, true)).toBe('good');
  });
});

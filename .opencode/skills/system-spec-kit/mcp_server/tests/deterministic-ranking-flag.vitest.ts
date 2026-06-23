// TEST: Deterministic Ranking Flag
//
// Proves SPECKIT_DETERMINISTIC_RANKING (default OFF):
//   1. flag-OFF leaves the intent-weighted ranking score byte-identical to the
//      legacy formula that includes the wall-clock recency term, and OFF still
//      moves with the clock (control, so the test would catch an always-on gate).
//   2. flag-ON yields stable scores across two evaluations under an advanced
//      clock, because the recency term is dropped from the score.

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { PipelineRow, IntentWeightsConfig } from '../lib/search/pipeline/types';
import { __testables } from '../lib/search/pipeline/stage2-fusion';
import { computeRecencyScore } from '../lib/scoring/folder-scoring';
import { isDeterministicRankingEnabled } from '../lib/search/search-flags';

const FLAG = 'SPECKIT_DETERMINISTIC_RANKING';
const FLAG_DAY = '2026-06-01T00:00:00.000Z';
const ADVANCED_DAY = '2026-12-01T00:00:00.000Z';
const ROW_CREATED_AT = '2026-01-01T00:00:00.000Z';

const WEIGHTS: IntentWeightsConfig = { similarity: 0.5, importance: 0.2, recency: 0.3 };

function makeRow(id: number, similarity: number): PipelineRow {
  return {
    id,
    similarity,
    importance_weight: 0.7,
    importance_tier: 'normal',
    created_at: ROW_CREATED_AT,
  } as unknown as PipelineRow;
}

function scoreById(rows: PipelineRow[]): Map<number, number> {
  const out = __testables.applyIntentWeightsToResults(rows, WEIGHTS);
  const map = new Map<number, number>();
  for (const row of out) {
    const score = (row as Record<string, unknown>).intentAdjustedScore;
    map.set(row.id as number, typeof score === 'number' ? score : Number.NaN);
  }
  return map;
}

describe('SPECKIT_DETERMINISTIC_RANKING flag', () => {
  let original: string | undefined;

  beforeEach(() => {
    original = process.env[FLAG];
  });

  afterEach(() => {
    if (original === undefined) delete process.env[FLAG];
    else process.env[FLAG] = original;
    vi.useRealTimers();
  });

  it('defaults OFF for unset, empty, and false-like values', () => {
    delete process.env[FLAG];
    expect(isDeterministicRankingEnabled()).toBe(false);
    process.env[FLAG] = '';
    expect(isDeterministicRankingEnabled()).toBe(false);
    process.env[FLAG] = 'false';
    expect(isDeterministicRankingEnabled()).toBe(false);
    process.env[FLAG] = '0';
    expect(isDeterministicRankingEnabled()).toBe(false);
    process.env[FLAG] = 'yes';
    expect(isDeterministicRankingEnabled()).toBe(false);
  });

  it('reads ON only for true and 1', () => {
    process.env[FLAG] = 'true';
    expect(isDeterministicRankingEnabled()).toBe(true);
    process.env[FLAG] = 'TRUE';
    expect(isDeterministicRankingEnabled()).toBe(true);
    process.env[FLAG] = '1';
    expect(isDeterministicRankingEnabled()).toBe(true);
  });

  it('flag OFF: score equals the legacy formula including the wall-clock recency term (byte-identical)', () => {
    delete process.env[FLAG];
    vi.useFakeTimers();
    vi.setSystemTime(new Date(FLAG_DAY));

    const rows = [makeRow(1, 80), makeRow(2, 60)];
    const scores = scoreById(rows);

    for (const row of rows) {
      const similarity = Math.max(0, Math.min(1, (row.similarity as number) / 100));
      const importance = row.importance_weight as number;
      const recency = computeRecencyScore(
        row.created_at as string,
        row.importance_tier as string,
      );
      const expected =
        similarity * WEIGHTS.similarity +
        importance * WEIGHTS.importance +
        recency * WEIGHTS.recency;
      expect(scores.get(row.id as number)).toBeCloseTo(expected, 12);
    }
  });

  it('flag OFF: score moves with the wall clock (control for an always-on gate)', () => {
    delete process.env[FLAG];
    const rows = [makeRow(1, 80)];

    vi.useFakeTimers();
    vi.setSystemTime(new Date(FLAG_DAY));
    const early = scoreById(rows).get(1)!;

    vi.setSystemTime(new Date(ADVANCED_DAY));
    const late = scoreById(rows).get(1)!;

    expect(early).not.toBeCloseTo(late, 12);
  });

  it('flag ON: scores are stable across an advanced clock and drop the recency term', () => {
    process.env[FLAG] = 'true';
    const rows = [makeRow(1, 80), makeRow(2, 60)];

    vi.useFakeTimers();
    vi.setSystemTime(new Date(FLAG_DAY));
    const first = scoreById(rows);

    vi.setSystemTime(new Date(ADVANCED_DAY));
    const second = scoreById(rows);

    for (const row of rows) {
      const similarity = Math.max(0, Math.min(1, (row.similarity as number) / 100));
      const importance = row.importance_weight as number;
      // recency term dropped to zero under the flag
      const expected =
        similarity * WEIGHTS.similarity + importance * WEIGHTS.importance;
      expect(first.get(row.id as number)).toBeCloseTo(expected, 12);
      expect(second.get(row.id as number)).toBeCloseTo(first.get(row.id as number)!, 12);
    }
  });
});

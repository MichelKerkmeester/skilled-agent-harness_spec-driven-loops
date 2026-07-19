// ───────────────────────────────────────────────────────────────
// 1. TEST — EVAL-V2 MEASURABILITY GATE
// ───────────────────────────────────────────────────────────────
//
// Guards the three contracts that make eval-v2 a real measurability gate:
//   - completeRecall@K math: fraction of a query's FULL relevant set found in
//     top-K, at tight cutoffs, with the partial-coverage and dedup behavior the
//     saturated known-item Recall@20 cannot exercise.
//   - the K=3/5/8 profile helper reports every rung so a single-cutoff gain stays
//     visible, and reconciles to computeRecall at the same K.
//   - the new multi-target classes load from the ground-truth corpus with
//     well-formed, multi-target gold sets (the property the gate depends on).

import { describe, it, expect } from 'vitest';

import {
  computeCompleteRecall,
  computeCompleteRecallProfile,
  computeRecall,
} from '../lib/eval/eval-metrics';
import type { EvalResult, GroundTruthEntry } from '../lib/eval/eval-metrics';
import {
  GROUND_TRUTH_QUERIES,
  GROUND_TRUTH_RELEVANCES,
} from '../lib/eval/ground-truth-data';
import {
  diffProfiles,
  meanCompleteRecallProfile,
  MEASURABILITY_CLASSES,
} from '../scripts/evals/run-eval-v2.mjs';

function makeResult(memoryId: number, rank: number, score = 1.0): EvalResult {
  return { memoryId, rank, score };
}
function makeGT(memoryId: number, relevance: number): GroundTruthEntry {
  return { queryId: 1, memoryId, relevance };
}

/* ───────────────────────────────────────────────────────────────
   completeRecall@K math
──────────────────────────────────────────────────────────────── */

describe('computeCompleteRecall@K', () => {
  it('CR-01: full gold set inside top-K → 1.0', () => {
    const results = [makeResult(1, 1), makeResult(2, 2), makeResult(3, 3)];
    const gt = [makeGT(1, 3), makeGT(2, 2), makeGT(3, 1)];
    expect(computeCompleteRecall(results, gt, 3)).toBeCloseTo(1.0, 5);
  });

  it('CR-02: three of five relevant docs in top-K → 0.6 (the partial-coverage case saturation hides)', () => {
    const results = [makeResult(1, 1), makeResult(2, 2), makeResult(3, 3), makeResult(98, 4), makeResult(97, 5)];
    const gt = [makeGT(1, 3), makeGT(2, 2), makeGT(3, 2), makeGT(4, 2), makeGT(5, 1)];
    // top-5 contains 1,2,3 of the relevant {1,2,3,4,5}
    expect(computeCompleteRecall(results, gt, 5)).toBeCloseTo(3 / 5, 5);
  });

  it('CR-03: tighter cutoff sees fewer of the gold set', () => {
    const results = [makeResult(1, 1), makeResult(99, 2), makeResult(2, 3), makeResult(3, 4)];
    const gt = [makeGT(1, 2), makeGT(2, 2), makeGT(3, 2)];
    // top-2 has only relevant id 1 of {1,2,3}; top-4 has all three.
    expect(computeCompleteRecall(results, gt, 2)).toBeCloseTo(1 / 3, 5);
    expect(computeCompleteRecall(results, gt, 4)).toBeCloseTo(1.0, 5);
  });

  it('CR-04: duplicate relevant id counts at most once', () => {
    const results = [makeResult(7, 1), makeResult(7, 2), makeResult(7, 3)];
    const gt = [makeGT(7, 3), makeGT(8, 2)];
    // relevant {7,8}; only 7 retrieved (deduped) → 1/2
    expect(computeCompleteRecall(results, gt, 3)).toBeCloseTo(1 / 2, 5);
  });

  it('CR-05: no relevant items → 0', () => {
    const results = [makeResult(1, 1)];
    const gt = [makeGT(1, 0)];
    expect(computeCompleteRecall(results, gt, 3)).toBe(0);
  });

  it('CR-06: empty results / empty gt / non-positive K → 0', () => {
    expect(computeCompleteRecall([], [makeGT(1, 2)], 3)).toBe(0);
    expect(computeCompleteRecall([makeResult(1, 1)], [], 3)).toBe(0);
    expect(computeCompleteRecall([makeResult(1, 1)], [makeGT(1, 2)], 0)).toBe(0);
  });

  it('CR-07: reconciles with computeRecall at the same K', () => {
    const results = [makeResult(1, 1), makeResult(2, 2), makeResult(99, 3), makeResult(3, 4)];
    const gt = [makeGT(1, 3), makeGT(2, 2), makeGT(3, 1), makeGT(4, 2)];
    for (const k of [2, 4, 8]) {
      expect(computeCompleteRecall(results, gt, k)).toBeCloseTo(computeRecall(results, gt, k), 9);
    }
  });
});

/* ───────────────────────────────────────────────────────────────
   completeRecall@K profile (K=3/5/8 ladder)
──────────────────────────────────────────────────────────────── */

describe('computeCompleteRecallProfile', () => {
  it('CRP-01: reports every default rung (3,5,8)', () => {
    const results = [makeResult(1, 1), makeResult(2, 2), makeResult(3, 3)];
    const gt = [makeGT(1, 2), makeGT(2, 2)];
    const profile = computeCompleteRecallProfile(results, gt);
    expect(Object.keys(profile).sort()).toEqual(['completeRecallAt3', 'completeRecallAt5', 'completeRecallAt8']);
  });

  it('CRP-02: a single-cutoff gain stays visible across the ladder', () => {
    // relevant {1,2,3,4}; 4 only appears at rank 7, so it is invisible at K=3/5 but
    // recovered at K=8 — exactly the single-cutoff signal saturation would erase.
    const results = [
      makeResult(1, 1), makeResult(2, 2), makeResult(3, 3),
      makeResult(91, 4), makeResult(92, 5), makeResult(93, 6),
      makeResult(4, 7),
    ];
    const gt = [makeGT(1, 2), makeGT(2, 2), makeGT(3, 2), makeGT(4, 2)];
    const profile = computeCompleteRecallProfile(results, gt);
    expect(profile.completeRecallAt3).toBeCloseTo(3 / 4, 5);
    expect(profile.completeRecallAt5).toBeCloseTo(3 / 4, 5);
    expect(profile.completeRecallAt8).toBeCloseTo(4 / 4, 5);
  });

  it('CRP-03: honors a custom K list and drops non-positive cutoffs', () => {
    const results = [makeResult(1, 1)];
    const gt = [makeGT(1, 2)];
    const profile = computeCompleteRecallProfile(results, gt, [1, 0, 4]);
    expect(Object.keys(profile).sort()).toEqual(['completeRecallAt1', 'completeRecallAt4']);
  });
});

/* ───────────────────────────────────────────────────────────────
   driver helpers: mean profile + eval-vs-prod fidelity delta
──────────────────────────────────────────────────────────────── */

describe('eval-v2 driver helpers', () => {
  const metrics = { computeCompleteRecallProfile };
  const ks = [3, 5];

  it('DRV-01: meanCompleteRecallProfile averages only queries with ground truth', () => {
    const queries = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const relevancesByQuery = new Map<number, GroundTruthEntry[]>([
      [1, [makeGT(1, 2), makeGT(2, 2)]],
      [2, [makeGT(10, 2), makeGT(20, 2)]],
      // query 3 has no ground truth → skipped from the denominator
    ]);
    const resultMap = new Map<number, EvalResult[]>([
      [1, [makeResult(1, 1), makeResult(2, 2)]],   // completeRecall = 1.0
      [2, [makeResult(10, 1), makeResult(99, 2)]], // completeRecall = 0.5
    ]);
    const { profile, evaluatedQueries } = meanCompleteRecallProfile(
      queries, relevancesByQuery, resultMap, metrics, ks,
    );
    expect(evaluatedQueries).toBe(2);
    expect(profile.completeRecallAt3).toBeCloseTo((1.0 + 0.5) / 2, 5);
  });

  it('DRV-02: diffProfiles reports eval-vs-prod delta per cutoff', () => {
    const evalProfile = { completeRecallAt3: 0.9, completeRecallAt5: 1.0 };
    const prodProfile = { completeRecallAt3: 0.4, completeRecallAt5: 0.6 };
    const delta = diffProfiles(evalProfile, prodProfile, ks);
    // A large positive delta = the eval lens flatters the production path.
    expect(delta.completeRecallAt3).toBeCloseTo(0.5, 5);
    expect(delta.completeRecallAt5).toBeCloseTo(0.4, 5);
  });

  it('DRV-03: exposes exactly the three measurability classes', () => {
    expect([...MEASURABILITY_CLASSES].sort()).toEqual(
      ['causal_chain', 'hard_negative', 'thematic_multi_target'],
    );
  });
});

/* ───────────────────────────────────────────────────────────────
   new query classes load from the ground-truth corpus
──────────────────────────────────────────────────────────────── */

describe('eval-v2 ground-truth classes', () => {
  const relevancesByQuery = new Map<number, typeof GROUND_TRUTH_RELEVANCES>();
  for (const rel of GROUND_TRUTH_RELEVANCES) {
    if (!relevancesByQuery.has(rel.queryId)) relevancesByQuery.set(rel.queryId, []);
    relevancesByQuery.get(rel.queryId)!.push(rel);
  }

  it('GT-01: every measurability class has at least 6 hand-authored queries', () => {
    for (const cls of MEASURABILITY_CLASSES) {
      const count = GROUND_TRUTH_QUERIES.filter((q) => q.category === cls).length;
      expect(count, `class ${cls}`).toBeGreaterThanOrEqual(6);
    }
  });

  it('GT-02: thematic and causal-chain queries carry MULTIPLE graded-relevant targets', () => {
    for (const cls of ['thematic_multi_target', 'causal_chain']) {
      const queries = GROUND_TRUTH_QUERIES.filter((q) => q.category === cls);
      for (const q of queries) {
        const gold = relevancesByQuery.get(q.id) ?? [];
        const relevant = gold.filter((g) => g.relevance > 0);
        expect(relevant.length, `query ${q.id} (${cls})`).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it('GT-03: every measurability gold relevance is a valid 1..3 grade', () => {
    const ids = new Set(GROUND_TRUTH_QUERIES.filter((q) => MEASURABILITY_CLASSES.includes(q.category)).map((q) => q.id));
    const gold = GROUND_TRUTH_RELEVANCES.filter((r) => ids.has(r.queryId));
    expect(gold.length).toBeGreaterThan(0);
    for (const r of gold) {
      expect([1, 2, 3], `query ${r.queryId} mem ${r.memoryId}`).toContain(r.relevance);
    }
  });

  it('GT-04: hard-negative queries are single deliberate targets that name the excluded decoy', () => {
    const queries = GROUND_TRUTH_QUERIES.filter((q) => q.category === 'hard_negative');
    expect(queries.length).toBeGreaterThanOrEqual(6);
    for (const q of queries) {
      const gold = relevancesByQuery.get(q.id) ?? [];
      expect(gold.length, `query ${q.id} gold size`).toBeGreaterThanOrEqual(1);
      // The exclusion intent is recorded in the expected-result description so the
      // decoy is auditable and never silently slips into the gold set.
      expect(q.expectedResultDescription.toLowerCase(), `query ${q.id}`).toContain('exclud');
    }
  });

  it('GT-05: measurability gold ids never collide with their query trigger phrase (multi-target by construction)', () => {
    // A multi-target query must not degenerate into a single known-item lookup of
    // its own phrase; assert each thematic/causal query references >1 distinct doc.
    for (const cls of ['thematic_multi_target', 'causal_chain']) {
      const queries = GROUND_TRUTH_QUERIES.filter((q) => q.category === cls);
      for (const q of queries) {
        const gold = relevancesByQuery.get(q.id) ?? [];
        const distinct = new Set(gold.map((g) => g.memoryId));
        expect(distinct.size, `query ${q.id} (${cls})`).toBeGreaterThanOrEqual(2);
      }
    }
  });
});

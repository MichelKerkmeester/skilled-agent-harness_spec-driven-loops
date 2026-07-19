// ───────────────────────────────────────────────────────────────
// MODULE: Flag Feature Fixtures
// ───────────────────────────────────────────────────────────────
// Synthetic verdict-path fixtures that exercise the four display/verdict feature
// flags the off-corpus false-confirm corpus never reaches. The false-confirm
// class is all ungrounded absent-term misses, so it never produces a grounded
// signal, a borderline-grounded weak verdict or a Stage 4 evidence-gap, and it
// carries no rendered block to replay. These fixtures supply exactly those inputs
// so a benchmark can measure each feature and a vitest can pin its behavior.
//
// Each row mirrors what the search pipeline populates: similarity is the raw
// cosine on the 0-100 scale sqlite-vec emits, fts_score is the lexical-lane
// overlap and sources names the lanes that retrieved the row. The verdict bands
// these exactly as production does, so a fixture verdict is the production verdict.

import type { ScoredResult } from '../../search/confidence-scoring.js';

/** A single verdict-path case: the rows the verdict bands, plus its query and gap signal. */
export interface VerdictFeatureCase {
  readonly id: string;
  readonly description: string;
  readonly query?: string;
  readonly rows: ScoredResult[];
  readonly evidenceGapDetected?: boolean;
}

// A grounded hit: the lexical lane scored it, so it carries an fts overlap and a
// fts source exactly as the pipeline writes a real lexical match.
function groundedHit(id: number, similarity: number, lexical = 0.5): ScoredResult {
  return { id, similarity, fts_score: lexical, sources: ['vector', 'fts'] };
}

// A vector-only off-corpus hit: a real background cosine, no lexical-lane score,
// title unrelated to the query, so no query-term overlap grounds it either.
function vectorOnlyHit(id: number, similarity: number, title: string): ScoredResult {
  return { id, similarity, title, sources: ['vector'] };
}


// ── cite_with_caveat: borderline-grounded vs clear good vs clear gap ──
// The borderline case is the one the binary policy drops and the caveat tier
// recovers: a weak verdict whose top hit is still lexically grounded and clears
// the borderline relevance floor. The clear good and clear gap bound it so the
// tier proves it fires only on the borderline.

export const CITE_BORDERLINE: VerdictFeatureCase = {
  id: 'cite-borderline',
  description: 'weak verdict, top hit still lexically grounded above the borderline floor',
  query: 'borderline grounded retrieval result',
  rows: [groundedHit(1, 55)],
};

export const CITE_CLEAR_GOOD: VerdictFeatureCase = {
  id: 'cite-clear-good',
  description: 'absolutely dominant grounded top hit, a clear cite_results good',
  query: 'clearly grounded dominant result',
  rows: [groundedHit(1, 85)],
};

export const CITE_CLEAR_GAP: VerdictFeatureCase = {
  id: 'cite-clear-gap',
  description: 'low-relevance ungrounded hit, a clear do_not_cite gap',
  query: 'kubernetes deployment rollout strategy',
  rows: [vectorOnlyHit(1, 10, 'FSRS retention sweep retains permanent decision rows')],
};

// ── evidence-gap: a good verdict the Stage 4 gap should cap to weak ──
// An absolutely-dominant top hit reads good on the shipped path. The same rows
// carry the Stage 4 evidenceGapDetected signal so the bridge can cap it to weak,
// and the no-gap twin proves the cap is driven by the passed signal, not the rows.

export const EVIDENCE_GAP_GOOD: VerdictFeatureCase = {
  id: 'evidence-gap-good',
  description: 'a dominant good top hit carrying a Stage 4 evidence gap that should cap it to weak',
  query: 'dominant result with a detected evidence gap',
  rows: [{ id: 1, similarity: 85 }],
  evidenceGapDetected: true,
};

export const EVIDENCE_GAP_NONE: VerdictFeatureCase = {
  id: 'evidence-gap-none',
  description: 'the same dominant good top hit with no gap, the verdict stays good',
  query: 'dominant result with no detected evidence gap',
  rows: [{ id: 1, similarity: 85 }],
  evidenceGapDetected: false,
};

export const FLAG_FEATURE_FIXTURES = {
  citeWithCaveat: { borderline: CITE_BORDERLINE, clearGood: CITE_CLEAR_GOOD, clearGap: CITE_CLEAR_GAP },
  evidenceGap: { withGap: EVIDENCE_GAP_GOOD, withoutGap: EVIDENCE_GAP_NONE },
} as const;

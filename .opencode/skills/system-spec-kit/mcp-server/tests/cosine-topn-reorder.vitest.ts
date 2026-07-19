// ───────────────────────────────────────────────────────────────
// COSINE TOP-N REORDER TESTS
// ───────────────────────────────────────────────────────────────
// TEST: SPECKIT_COSINE_TOPN_REORDER — cosine-primary reorder of the result head
//
// Covers the research "Problem 4 — Lightweight Reranker" cheap move: a stable,
// cosine-primary reorder of the top-N before truncation. Verifies promotion,
// tie stability, length/membership invariants, head-only scope, and flag gating.

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import * as hybridSearch from '../lib/search/hybrid-search';
import { isCosineTopnReorderEnabled } from '../lib/search/search-flags.js';
import { snapshotEnv } from '../lib/test-helpers/env-snapshot.js';

const { reorderTopNByCosine, COSINE_TOPN_REORDER_DEPTH } = hybridSearch.__testables as {
  reorderTopNByCosine: (results: Array<Record<string, unknown>>, depth?: number) => Array<Record<string, unknown>>;
  COSINE_TOPN_REORDER_DEPTH: number;
};

interface Row extends Record<string, unknown> {
  id: number;
  similarity?: number;
  score?: number;
  source: string;
}

/** Build a row carrying an absolute cosine similarity (already 0–1 scale). */
function vec(id: number, similarity: number): Row {
  return { id, similarity, score: 0.03, source: 'vector' };
}

const idsOf = (rows: Array<Record<string, unknown>>): number[] => rows.map((r) => r.id as number);

describe('reorderTopNByCosine', () => {
  it('promotes the highest-cosine head result to first', () => {
    // Fused (input) order puts a weaker-cosine result first.
    const input: Row[] = [vec(1, 0.40), vec(2, 0.95), vec(3, 0.55)];
    const out = reorderTopNByCosine(input);
    expect(idsOf(out)).toEqual([2, 3, 1]);
  });

  it('keeps fused order for equal-cosine ties (stable sort)', () => {
    // ids 1,2,3 all share cosine 0.5; id 4 is strictly higher.
    const input: Row[] = [vec(1, 0.5), vec(2, 0.5), vec(3, 0.5), vec(4, 0.9)];
    const out = reorderTopNByCosine(input);
    // 4 promoted to front; the three ties retain their incoming relative order.
    expect(idsOf(out)).toEqual([4, 1, 2, 3]);
  });

  it('preserves length and membership (pure permutation)', () => {
    const input: Row[] = [vec(10, 0.2), vec(20, 0.8), vec(30, 0.6), vec(40, 0.4)];
    const out = reorderTopNByCosine(input);
    expect(out).toHaveLength(input.length);
    expect(new Set(idsOf(out))).toEqual(new Set(idsOf(input)));
  });

  it('reorders only the head — tail beyond depth is untouched', () => {
    // depth=2 so only the first two are eligible; the high-cosine id 5 in the
    // tail must NOT be pulled into the head.
    const input: Row[] = [vec(1, 0.3), vec(2, 0.7), vec(3, 0.4), vec(5, 0.99)];
    const out = reorderTopNByCosine(input, 2);
    expect(idsOf(out)).toEqual([2, 1, 3, 5]);
  });

  it('does not promote a strong-cosine result sitting below the default depth', () => {
    const head = Array.from({ length: COSINE_TOPN_REORDER_DEPTH }, (_, i) => vec(i + 1, 0.5));
    const buried = vec(999, 0.99); // one past the reorder depth
    const out = reorderTopNByCosine([...head, buried]);
    // Buried high-cosine result stays at its tail position (no global reorder).
    expect((out[out.length - 1] as Row).id).toBe(999);
    expect(out).toHaveLength(COSINE_TOPN_REORDER_DEPTH + 1);
  });

  it('falls back to effective score for lexical-only hits (no similarity)', () => {
    // id 2 has no cosine but a strong fused score; id 1 has a weak cosine.
    const lexical: Row = { id: 2, score: 0.9, source: 'fts' };
    const weakVector: Row = vec(1, 0.10);
    const out = reorderTopNByCosine([weakVector, lexical]);
    expect(idsOf(out)).toEqual([2, 1]);
  });

  it('is a no-op for lists of length <= 1', () => {
    expect(reorderTopNByCosine([])).toEqual([]);
    const single: Row[] = [vec(1, 0.5)];
    expect(reorderTopNByCosine(single)).toEqual(single);
  });
});

describe('SPECKIT_COSINE_TOPN_REORDER flag', () => {
  let restoreEnv: () => void;

  beforeEach(() => {
    restoreEnv = snapshotEnv(['SPECKIT_COSINE_TOPN_REORDER']);
  });

  afterEach(() => {
    restoreEnv();
  });

  it('defaults to ON when unset', () => {
    delete process.env.SPECKIT_COSINE_TOPN_REORDER;
    expect(isCosineTopnReorderEnabled()).toBe(true);
  });

  it('is reversible — false disables the reorder gate (no-op path)', () => {
    process.env.SPECKIT_COSINE_TOPN_REORDER = 'false';
    expect(isCosineTopnReorderEnabled()).toBe(false);
  });
});

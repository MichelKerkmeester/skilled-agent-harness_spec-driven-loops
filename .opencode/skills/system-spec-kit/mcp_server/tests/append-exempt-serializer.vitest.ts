// ───────────────────────────────────────────────────────────────
// APPEND-EXEMPT SERIALIZER VITEST
// ───────────────────────────────────────────────────────────────
// The tail-append stage (deterministic multi-hop + lane-champion backfill) adds
// rows past the result limit, and those rows are exempt from the Stage-4 cap. A
// SECOND truncation lives at the response-serialization layer (the token-budget
// trim), which drops rows from the END of the result array — exactly where the
// appended rows sit. These tests prove two things:
//   1. The formatter marks appended rows `appendExempt` (and leaves baseline rows
//      untouched, so the flag-off output is byte-identical).
//   2. The serializer's row-selection (selectBudgetTrimIndex) drops non-exempt rows
//      first, so the appended rows survive the budget trim.
import { describe, it, expect } from 'vitest';
import { formatSearchResults, type MemoryResultEnvelope } from '../formatters/search-results.js';
import { selectBudgetTrimIndex } from '../context-server.js';
import type { MCPEnvelope, MCPResponse } from '../lib/response/envelope.js';

interface SearchData {
  count: number;
  results: MemoryResultEnvelope[];
}

function parse(response: MCPResponse): MCPEnvelope<SearchData> {
  const first = response.content[0];
  if (first?.type !== 'text') throw new Error('expected text content');
  return JSON.parse(first.text) as MCPEnvelope<SearchData>;
}

/* ==================================================================
   SECTION A: formatter marks tail-appended rows
================================================================== */

describe('formatSearchResults appendExempt marking', () => {
  it('A1: marks a multihop-appended row and a lane-champion row, leaves baseline rows unmarked', async () => {
    const rows = [
      // Baseline retrieval rows — carry channel sources, never an append marker.
      { id: 1, spec_folder: 's1', file_path: '/f1.md', title: 'Base A', source: 'vector', sources: ['vector', 'fts'] },
      { id: 2, spec_folder: 's2', file_path: '/f2.md', title: 'Base B', source: 'fts' },
      // Tail appends — the two markers the append modules stamp.
      { id: 3, spec_folder: 's3', file_path: '/f3.md', title: 'Multihop append', source: 'multihop', sources: ['multihop'] },
      { id: 4, spec_folder: 's4', file_path: '/f4.md', title: 'Lane champion', source: 'lane-champion:bm25', sources: ['lane-champion:bm25'] },
    ];

    const env = parse(await formatSearchResults(rows, 'hybrid'));
    const out = env.data.results;

    // Baseline rows: appendExempt absent entirely (not false) — this is the
    // byte-identity guarantee for the flag-off path.
    expect('appendExempt' in out[0]).toBe(false);
    expect('appendExempt' in out[1]).toBe(false);
    // Appended rows: marked.
    expect(out[2].appendExempt).toBe(true);
    expect(out[3].appendExempt).toBe(true);
  });

  it('A2: flag-off shape is byte-identical — no appendExempt key when no append rows exist', async () => {
    // No row carries a multihop / lane-champion source, which is exactly the
    // flag-off pipeline output (the append stage is skipped, nothing is stamped).
    const baselineOnly = [
      { id: 10, spec_folder: 's', file_path: '/a.md', title: 'A', source: 'vector' },
      { id: 11, spec_folder: 's', file_path: '/b.md', title: 'B', source: 'fts' },
      { id: 12, spec_folder: 's', file_path: '/c.md', title: 'C', sources: ['bm25'] },
    ];
    const env = parse(await formatSearchResults(baselineOnly, 'hybrid'));
    for (const row of env.data.results) {
      expect('appendExempt' in row).toBe(false);
    }
    // The serialized text must contain no appendExempt token at all.
    const text = (env as unknown as { data: SearchData });
    expect(JSON.stringify(text.data.results)).not.toContain('appendExempt');
  });

  it('A3: lane-champion variants (any lane suffix) are all recognized as appends', async () => {
    const rows = [
      { id: 20, spec_folder: 's', file_path: '/x.md', title: 'X', source: 'lane-champion:trigger', sources: ['lane-champion:trigger'] },
      { id: 21, spec_folder: 's', file_path: '/y.md', title: 'Y', sources: ['lane-champion:vector'] },
    ];
    const env = parse(await formatSearchResults(rows, 'hybrid'));
    expect(env.data.results[0].appendExempt).toBe(true);
    expect(env.data.results[1].appendExempt).toBe(true);
  });
});

/* ==================================================================
   SECTION B: serializer trims non-exempt rows first
================================================================== */

describe('selectBudgetTrimIndex (token-budget trim row selection)', () => {
  it('B1: with no exempt rows, picks the last index (identical to pop)', () => {
    const rows = [{ id: 1 }, { id: 2 }, { id: 3 }];
    expect(selectBudgetTrimIndex(rows)).toBe(2);
  });

  it('B2: with exempt rows at the tail, picks the last NON-exempt row, sparing the appends', () => {
    const rows = [
      { id: 1 },
      { id: 2 },
      { id: 3, appendExempt: true }, // multihop append
      { id: 4, appendExempt: true }, // lane-champion append
    ];
    // Index 1 (id 2) is the last non-exempt row; the two appends are spared.
    expect(selectBudgetTrimIndex(rows)).toBe(1);
  });

  it('B3: drops ordinary rows first, but reserves the last primary and trims a backfill instead', () => {
    const rows: Array<Record<string, unknown>> = [
      { id: 1 },
      { id: 2, appendExempt: true },
      { id: 3 },
      { id: 4, appendExempt: true },
    ];
    // Pass 1: two ordinary rows present (ids 1, 3) → drop the last ordinary, id 3.
    rows.splice(selectBudgetTrimIndex(rows), 1);
    expect(rows.map((r) => r.id)).toEqual([1, 2, 4]);
    // Pass 2: only ONE ordinary primary (id 1) left → it is reserved, so a backfill
    // (id 4) is trimmed instead of evicting the last primary (P1-6).
    rows.splice(selectBudgetTrimIndex(rows), 1);
    expect(rows.map((r) => r.id)).toEqual([1, 2]);
    // Pass 3: the reserved primary id 1 + one backfill id 2 → backfill trimmed first.
    rows.splice(selectBudgetTrimIndex(rows), 1);
    expect(rows.map((r) => r.id)).toEqual([1]);
  });

  it('B4: all-exempt array falls back to the tail so the trim loop still converges', () => {
    const rows = [{ id: 1, appendExempt: true }, { id: 2, appendExempt: true }];
    expect(selectBudgetTrimIndex(rows)).toBe(1);
  });

  it('B5: empty array returns -1', () => {
    expect(selectBudgetTrimIndex([])).toBe(-1);
  });

  // ── P1-6: reserve at least one primary, never evict it for a backfill ──

  it('B6 [P1-6]: a single baseline row vs a surviving exempt row — the baseline wins', () => {
    const rows = [
      { id: 1, title: 'top primary' },
      { id: 2, title: 'backfill', appendExempt: true },
    ];
    // The lone primary is reserved; the backfill is the one dropped.
    expect(selectBudgetTrimIndex(rows)).toBe(1);
  });

  it('B7 [P1-6]: a squeeze to one row keeps the primary, not the backfill', () => {
    const rows: Array<Record<string, unknown>> = [
      { id: 1, title: 'top primary' },
      { id: 2, appendExempt: true },
      { id: 3, appendExempt: true },
    ];
    // Drop both backfills before the reserved primary.
    rows.splice(selectBudgetTrimIndex(rows), 1);
    rows.splice(selectBudgetTrimIndex(rows), 1);
    expect(rows.map((r) => r.id)).toEqual([1]);
  });

  // ── P2-14: constitutional pins are at least as exempt as a backfill ──

  it('B8 [P2-14]: a constitutional row outlives an additive backfill under a squeeze', () => {
    const rows = [
      { id: 1, isConstitutional: true },
      { id: 2, title: 'backfill', appendExempt: true },
    ];
    // The backfill is dropped, the constitutional pin survives.
    expect(selectBudgetTrimIndex(rows)).toBe(1);
  });

  it('B9 [P2-14]: ordinary < backfill < constitutional drop order', () => {
    const rows: Array<Record<string, unknown>> = [
      { id: 1, isConstitutional: true },
      { id: 2, title: 'ordinary' },
      { id: 3, appendExempt: true },
    ];
    // primaryCount = 2 (constitutional id1 + ordinary id2). Ordinary id 2 goes first.
    rows.splice(selectBudgetTrimIndex(rows), 1);
    expect(rows.map((r) => r.id)).toEqual([1, 3]);
    // Now constitutional + backfill: the backfill goes before the pin.
    rows.splice(selectBudgetTrimIndex(rows), 1);
    expect(rows.map((r) => r.id)).toEqual([1]);
  });

  it('B10 [P2-14]: constitutional rows are NOT dropped before an ordinary row remains', () => {
    const rows: Array<Record<string, unknown>> = [
      { id: 1, isConstitutional: true },
      { id: 2, isConstitutional: true },
      { id: 3, title: 'ordinary' },
    ];
    // The ordinary row is the lowest-priority droppable; both pins survive it.
    expect(selectBudgetTrimIndex(rows)).toBe(2);
  });
});

/* ==================================================================
   SECTION C: end-to-end — the budget-trim loop spares the appends
================================================================== */

describe('append-exempt survives the budget-trim loop', () => {
  // Reproduce the serializer's trim loop semantics (the same selectBudgetTrimIndex
  // the live response writer calls) and prove the appended rows survive a budget
  // squeeze that drops most of the baseline.
  function trimToCount(rows: Array<Record<string, unknown>>, targetCount: number): void {
    while (rows.length > targetCount && rows.length > 1) {
      rows.splice(selectBudgetTrimIndex(rows), 1);
    }
  }

  it('C1: a squeeze to 2 rows keeps the top primary and a surviving append, not a backfill-only set', () => {
    const rows: Array<Record<string, unknown>> = [
      { id: 1, title: 'base 1 (top primary)' },
      { id: 2, title: 'base 2' },
      { id: 3, title: 'base 3' },
      { id: 4, title: 'multihop', appendExempt: true },
      { id: 5, title: 'lane-champion', appendExempt: true },
    ];
    trimToCount(rows, 2);
    // Baseline tail rows (2, 3) trimmed first; then the reservation kicks in and the
    // top primary (id 1) is held back, so a backfill (id 5) is dropped before it.
    expect(rows.map((r) => r.id)).toEqual([1, 4]);
    // The append survives AND the top requested result was NOT evicted (P1-6).
    expect(rows.some((r) => r.appendExempt === true)).toBe(true);
    expect(rows.some((r) => r.id === 1)).toBe(true);
  });

  it('C1b [P1-6]: even a maximal squeeze to a single row never returns a backfill-only answer', () => {
    const rows: Array<Record<string, unknown>> = [
      { id: 1, title: 'top primary' },
      { id: 2, appendExempt: true },
      { id: 3, appendExempt: true },
      { id: 4, appendExempt: true },
    ];
    trimToCount(rows, 1);
    // The reserved primary survives; all backfills were trimmed before it.
    expect(rows.map((r) => r.id)).toEqual([1]);
  });

  it('C1c [P2-14]: a constitutional pin survives a squeeze that drops every backfill', () => {
    const rows: Array<Record<string, unknown>> = [
      { id: 1, isConstitutional: true },
      { id: 2, title: 'ordinary' },
      { id: 3, appendExempt: true },
      { id: 4, appendExempt: true },
    ];
    trimToCount(rows, 1);
    // Ordinary id 2 first, then the two backfills — the constitutional pin is last.
    expect(rows.map((r) => r.id)).toEqual([1]);
  });

  it('C2: flag-off control — with no exempt and no constitutional rows the squeeze drops the tail exactly like pop()', () => {
    const rows: Array<Record<string, unknown>> = [
      { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 },
    ];
    trimToCount(rows, 2);
    // Highest-scored (front) rows survive — unchanged from the original pop()-from-end.
    expect(rows.map((r) => r.id)).toEqual([1, 2]);
  });
});

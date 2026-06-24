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

  it('B3: drains all non-exempt rows before ever touching an exempt one', () => {
    const rows: Array<Record<string, unknown>> = [
      { id: 1 },
      { id: 2, appendExempt: true },
      { id: 3 },
      { id: 4, appendExempt: true },
    ];
    // First pass removes id 3 (last non-exempt), then id 1 — appends untouched.
    rows.splice(selectBudgetTrimIndex(rows), 1);
    expect(rows.map((r) => r.id)).toEqual([1, 2, 4]);
    rows.splice(selectBudgetTrimIndex(rows), 1);
    expect(rows.map((r) => r.id)).toEqual([2, 4]);
    // Only now, with nothing but exempt rows left, does it sacrifice the tail.
    rows.splice(selectBudgetTrimIndex(rows), 1);
    expect(rows.map((r) => r.id)).toEqual([2]);
  });

  it('B4: all-exempt array falls back to the tail so the trim loop still converges', () => {
    const rows = [{ id: 1, appendExempt: true }, { id: 2, appendExempt: true }];
    expect(selectBudgetTrimIndex(rows)).toBe(1);
  });

  it('B5: empty array returns -1', () => {
    expect(selectBudgetTrimIndex([])).toBe(-1);
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

  it('C1: a hard squeeze to 2 rows keeps both appended rows, not the baseline tail', () => {
    const rows: Array<Record<string, unknown>> = [
      { id: 1, title: 'base 1' },
      { id: 2, title: 'base 2' },
      { id: 3, title: 'base 3' },
      { id: 4, title: 'multihop', appendExempt: true },
      { id: 5, title: 'lane-champion', appendExempt: true },
    ];
    trimToCount(rows, 2);
    // The two appends survive; the baseline rows were trimmed first.
    expect(rows.map((r) => r.id).sort()).toEqual([4, 5]);
    expect(rows.every((r) => r.appendExempt === true)).toBe(true);
  });

  it('C2: flag-off control — with no exempt rows the squeeze drops the tail exactly like pop()', () => {
    const rows: Array<Record<string, unknown>> = [
      { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 },
    ];
    trimToCount(rows, 2);
    // Highest-scored (front) rows survive — unchanged from the original pop()-from-end.
    expect(rows.map((r) => r.id)).toEqual([1, 2]);
  });
});

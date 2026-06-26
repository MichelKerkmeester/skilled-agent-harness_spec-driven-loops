// ───────────────────────────────────────────────────────────────
// TEST: Token budget truncation keeps constitutionalCount and
// envelope.summary consistent with the surviving results array.
//
// Replicates the dispatch-level trim loop from context-server.ts using the same
// envelope helpers — no DB, no network. The row-selection is NOT re-implemented
// here: the loop calls the REAL selectBudgetTrimIndex the dispatch path uses, so
// this test can never drift from the live selector's drop priority (ordinary →
// additive backfill → constitutional, with at least one primary reserved).
// ───────────────────────────────────────────────────────────────
import { describe, it, expect } from 'vitest';
import {
  syncEnvelopeTokenCount,
  serializeEnvelopeWithTokenCount,
} from '../lib/response/envelope.js';
import { enforceEnvelopeResultBudget } from '../context-server.js';

// ── Helpers ────────────────────────────────────────────────────

type ResultItem = {
  id: number;
  content: string;
  isConstitutional?: boolean;
};

type DataPayload = {
  count: number;
  constitutionalCount: number;
  results: ResultItem[];
};

type EnvelopeRecord = Record<string, unknown>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Drives the REAL dispatch-path budget enforcement (enforceEnvelopeResultBudget)
 * the same way context-server.ts does, then returns the envelope parsed back from
 * its serialized form. Calling the live function — not a re-implementation — means
 * this test can never drift from the dispatch behavior: the display floor, the
 * compact-overflow rendering, and the constitutionalCount / summary reconciliation
 * are all exercised exactly as shipped.
 */
function runTruncationLoop(
  envelope: EnvelopeRecord,
  budget: number,
): EnvelopeRecord {
  const meta = isRecord(envelope.meta) ? envelope.meta as Record<string, unknown> : {};
  envelope.meta = meta;

  syncEnvelopeTokenCount(envelope);

  const enforced = enforceEnvelopeResultBudget(envelope, budget, syncEnvelopeTokenCount);
  if (!enforced && typeof meta.tokenCount === 'number' && meta.tokenCount > budget) {
    // ≤1 row or no results array — dispatch adds a warning hint only.
    if (Array.isArray(envelope.hints)) {
      envelope.hints.push(`Response exceeds token budget (${meta.tokenCount}/${budget})`);
    }
  }

  return JSON.parse(serializeEnvelopeWithTokenCount(envelope)) as EnvelopeRecord;
}

// ── Fixture builders ────────────────────────────────────────────

/**
 * Builds a memory-search envelope that matches the shape produced by
 * formatSearchResults in search-results.ts:
 *   summary: 'Found N memories (M constitutional)'  OR  'Found N memories'
 *   data.count, data.constitutionalCount, data.results
 */
function makeSearchEnvelope(results: ResultItem[]): EnvelopeRecord {
  const constitutionalCount = results.filter((r) => r.isConstitutional === true).length;
  const summary =
    constitutionalCount > 0
      ? `Found ${results.length} memories (${constitutionalCount} constitutional)`
      : `Found ${results.length} memories`;

  return {
    summary,
    hints: [],
    data: {
      count: results.length,
      constitutionalCount,
      results,
    } as unknown as DataPayload,
    meta: {
      tool: 'memory_search',
      tokenCount: 0,
      cacheHit: false,
    },
  };
}

// ── Tests ───────────────────────────────────────────────────────

describe('T206: Token budget truncation — constitutionalCount + summary sync', () => {

  // ── Tail constitutional result is PINNED, ordinary rows drop first ──

  it('T206-A1: spares the tail constitutional result, compacts ordinary rows → constitutionalCount + summary stay in sync', () => {
    // 3 results; the last (tail) is constitutional and large. The set is at/below the
    // display floor, so no row is deleted — instead the ordinary rows are rendered
    // compact to reclaim budget while the constitutional pin keeps its full content.
    // This documents that the counts still reconcile after the in-place compaction.
    const results: ResultItem[] = [
      { id: 1, content: 'short', isConstitutional: false },
      { id: 2, content: 'medium content for budget padding '.repeat(4), isConstitutional: false },
      {
        id: 3,
        // large so the squeeze keeps firing after the small ordinary rows are gone
        content: 'X'.repeat(600),
        isConstitutional: true,
      },
    ];

    const envelope = makeSearchEnvelope(results);
    // Verify pre-conditions
    const preData = envelope.data as DataPayload;
    expect(preData.constitutionalCount).toBe(1);
    expect(envelope.summary).toBe('Found 3 memories (1 constitutional)');

    // Set a budget small enough that the trim loop fires.
    syncEnvelopeTokenCount(envelope);
    const fullTokenCount = (envelope.meta as Record<string, unknown>).tokenCount as number;
    const budget = Math.floor(fullTokenCount * 0.5);

    const out = runTruncationLoop(envelope, budget);
    const outData = out.data as DataPayload;

    // results.length, count, and constitutionalCount must all agree.
    expect(outData.results.length).toBe(outData.count);
    expect(outData.constitutionalCount).toBe(
      outData.results.filter((r) => r.isConstitutional === true).length,
    );
    // The constitutional pin SURVIVES the squeeze (ordinary rows were dropped first).
    expect(outData.constitutionalCount).toBe(1);
    expect(outData.results.some((r) => r.id === 3 && r.isConstitutional === true)).toBe(true);
    // Summary must reflect post-truncation values, still showing the surviving pin.
    expect(out.summary).toBe(
      `Found ${outData.results.length} memories (${outData.constitutionalCount} constitutional)`,
    );
  });

  // ── Non-constitutional tail, constitutional head stays ──

  it('T206-A2: keeps head constitutional result → constitutionalCount stays > 0 with correct summary', () => {
    const results: ResultItem[] = [
      { id: 1, content: 'head constitutional', isConstitutional: true },
      { id: 2, content: 'non-const filler '.repeat(2), isConstitutional: false },
      {
        id: 3,
        content: 'Y'.repeat(600),
        isConstitutional: false,
      },
    ];

    const envelope = makeSearchEnvelope(results);
    syncEnvelopeTokenCount(envelope);
    const fullTokenCount = (envelope.meta as Record<string, unknown>).tokenCount as number;
    const budget = Math.floor(fullTokenCount * 0.5);

    const out = runTruncationLoop(envelope, budget);
    const outData = out.data as DataPayload;

    expect(outData.results.length).toBe(outData.count);
    expect(outData.constitutionalCount).toBe(
      outData.results.filter((r) => r.isConstitutional === true).length,
    );
    expect(outData.constitutionalCount).toBeGreaterThan(0);
    expect(out.summary).toMatch(/Found \d+ memories \(\d+ constitutional\)/);
    expect(out.summary).toBe(
      `Found ${outData.results.length} memories (${outData.constitutionalCount} constitutional)`,
    );
  });

  // ── Single-result over-budget case ───────────────────

  it('T206-B1: single over-budget result — count + constitutionalCount consistent, hint added', () => {
    // Single result that is over budget; pop loop skips (length <= 1), falls
    // through to the "no truncatable results" branch.  Counts must still agree
    // and a warning hint must be present.
    const results: ResultItem[] = [
      { id: 1, content: 'Z'.repeat(800), isConstitutional: true },
    ];

    const envelope = makeSearchEnvelope(results);
    syncEnvelopeTokenCount(envelope);
    const fullTokenCount = (envelope.meta as Record<string, unknown>).tokenCount as number;
    // Budget below the single-result size so the over-budget branch is entered.
    const budget = Math.floor(fullTokenCount * 0.2);

    // Single-result envelope: pop loop condition `length > 1` is false so no
    // results are removed — counts must remain consistent.
    const out = runTruncationLoop(envelope, budget);
    const outData = out.data as DataPayload;

    expect(outData.results.length).toBe(outData.count);
    expect(outData.constitutionalCount).toBe(
      outData.results.filter((r) => r.isConstitutional === true).length,
    );
    // The single result survives.
    expect(outData.results.length).toBe(1);
    // Hint must be present (warning path).
    const hints = out.hints as string[];
    expect(hints.some((h) => typeof h === 'string' && h.includes('exceeds token budget'))).toBe(true);
  });

  // ── Envelope without summary string is untouched ─────

  it('T206-C1: non-string summary field is not overwritten', () => {
    const results: ResultItem[] = [
      { id: 1, content: 'short non-constitutional', isConstitutional: false },
      { id: 2, content: 'W'.repeat(600), isConstitutional: true },
    ];

    // Build envelope but replace summary with null to verify the guard.
    const envelope = makeSearchEnvelope(results);
    envelope.summary = null; // non-string: the fix must not throw or overwrite

    syncEnvelopeTokenCount(envelope);
    const fullTokenCount = (envelope.meta as Record<string, unknown>).tokenCount as number;
    const budget = Math.floor(fullTokenCount * 0.5);

    const out = runTruncationLoop(envelope, budget);

    // summary remains null — the `typeof envelope.summary === 'string'` guard held.
    expect(out.summary).toBeNull();
    // data counts still reconcile.
    const outData = out.data as DataPayload;
    expect(outData.results.length).toBe(outData.count);
    expect(outData.constitutionalCount).toBe(
      outData.results.filter((r) => r.isConstitutional === true).length,
    );
  });
});

// ───────────────────────────────────────────────────────────────
// Display floor + compact-overflow contract.
// A populated result set is never collapsed toward one row by token-budget
// enforcement; overflow beyond what fits at full detail is rendered compact
// (metadata-only) instead of deleted, and a set larger than the floor is trimmed
// down to the floor rather than to one.
// ───────────────────────────────────────────────────────────────

type CompactResultItem = ResultItem & { compact?: boolean };

describe('T207: display floor + compact overflow', () => {

  it('T207-A1: a populated set at/below the floor keeps every row; overflow is compact, not deleted', () => {
    // 6 ordinary results, each heavy enough that the full set blows the budget.
    const results: ResultItem[] = Array.from({ length: 6 }, (_, i) => ({
      id: i + 1,
      content: `result ${i + 1} body `.repeat(40),
      isConstitutional: false,
    }));

    const envelope = makeSearchEnvelope(results);
    const out = runTruncationLoop(envelope, 200);
    const outData = out.data as { count: number; constitutionalCount: number; results: CompactResultItem[] };

    // The whole set survives (6 <= floor of 10) — never collapsed toward one row.
    expect(outData.results.length).toBe(6);
    expect(outData.count).toBe(6);
    expect(outData.results.length).toBe(outData.count);

    // Overflow rows were rendered compact (content dropped) to reclaim budget.
    const compactRows = outData.results.filter((r) => r.compact === true);
    expect(compactRows.length).toBeGreaterThan(0);
    expect(compactRows[0].content).toBeUndefined();
    expect(compactRows[0].id).toBeDefined();

    // The top row stays full (keeps its content).
    expect(typeof outData.results[0].content).toBe('string');

    const meta = out.meta as Record<string, unknown>;
    expect(meta.tokenBudgetTruncated).toBe(true);
    expect(meta.returnedResultCount).toBe(6);
    expect(meta.originalResultCount).toBe(6);
  });

  it('T207-A2: a set larger than the floor is trimmed down to the floor (10), never to one', () => {
    const results: ResultItem[] = Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      content: 'big body '.repeat(60),
      isConstitutional: false,
    }));

    const envelope = makeSearchEnvelope(results);
    // Budget far below any multi-row set forces Phase-1 trimming all the way to the floor.
    const out = runTruncationLoop(envelope, 150);
    const outData = out.data as { count: number; results: CompactResultItem[] };

    // Floored at exactly 10: never below the display floor, never above it once over budget.
    expect(outData.results.length).toBe(10);
    expect(outData.count).toBe(10);
  });
});

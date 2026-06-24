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
import { selectBudgetTrimIndex } from '../context-server.js';

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
 * Runs the same trim loop that context-server.ts uses after token-budget
 * enforcement, then returns the envelope parsed back from its serialized form.
 * Row selection delegates to the real selectBudgetTrimIndex, so the surviving
 * set always matches the live dispatch behavior.
 */
function runTruncationLoop(
  envelope: EnvelopeRecord,
  budget: number,
): EnvelopeRecord {
  const meta = isRecord(envelope.meta) ? envelope.meta as Record<string, unknown> : {};
  envelope.meta = meta;
  const dataValue = envelope.data;
  const data = isRecord(dataValue) ? dataValue as Record<string, unknown> : null;

  syncEnvelopeTokenCount(envelope);

  if (typeof meta.tokenCount === 'number' && meta.tokenCount > budget) {
    const innerResults = data?.results;
    if (Array.isArray(innerResults) && innerResults.length > 1) {
      const originalCount = innerResults.length;
      while (innerResults.length > 1) {
        innerResults.splice(selectBudgetTrimIndex(innerResults), 1);
        syncEnvelopeTokenCount(envelope);
        if (typeof meta.tokenCount === 'number' && meta.tokenCount <= budget) break;
      }
      if (data && data.count !== undefined) {
        data.count = innerResults.length;
      }
      // ── FIX under test ──────────────────────────────────────
      if (data) {
        const survivingConstitutionalCount = (innerResults as unknown[]).filter(
          (r: unknown) =>
            r !== null &&
            typeof r === 'object' &&
            (r as Record<string, unknown>).isConstitutional === true,
        ).length;
        data.constitutionalCount = survivingConstitutionalCount;
        if (typeof envelope.summary === 'string') {
          envelope.summary =
            survivingConstitutionalCount > 0
              ? `Found ${innerResults.length} memories (${survivingConstitutionalCount} constitutional)`
              : `Found ${innerResults.length} memories`;
        }
      }
      // ────────────────────────────────────────────────────────
      if (Array.isArray(envelope.hints)) {
        envelope.hints.push(
          `Token budget enforced: truncated ${originalCount} → ${innerResults.length} results to fit ${budget} token budget`,
        );
      }
      meta.tokenBudgetTruncated = true;
      meta.originalResultCount = originalCount;
      meta.returnedResultCount = innerResults.length;
    } else {
      // No truncatable results array — add warning hint only
      if (Array.isArray(envelope.hints)) {
        envelope.hints.push(`Response exceeds token budget (${meta.tokenCount}/${budget})`);
      }
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

  it('T206-A1: spares the tail constitutional result, drops ordinary rows → constitutionalCount + summary stay in sync', () => {
    // 3 results; the last (tail) is constitutional and large. Under the real
    // selectBudgetTrimIndex an always-surface row is at least as protected as any
    // other row, so the squeeze drops the ordinary rows first and the constitutional
    // pin survives — the opposite of a blind pop()-from-tail. This test documents the
    // CURRENT pinned-row behavior and that the counts still reconcile after the trim.
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

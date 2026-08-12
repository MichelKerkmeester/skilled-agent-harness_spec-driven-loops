// ───────────────────────────────────────────────────────────────
// MODULE: Memory Search Token Budget Enforcement Tests
// ───────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import { __testables as memorySearchTestables } from '../handlers/memory-search.js';
import { createMCPSuccessResponse } from '../lib/response/envelope.js';
import { estimateTokens } from '../formatters/token-metrics.js';
import { getTokenBudget } from '../lib/architecture/layer-definitions.js';

const { enforceSearchTokenBudget } = memorySearchTestables;

function makeResult(id: number, score: number, textLength: number): Record<string, unknown> {
  return {
    id,
    score,
    similarity: score,
    text: `result-${id} ${'x'.repeat(textLength)}`,
  };
}

function buildResponse(
  resultCount: number,
  scoreStep: number,
  textLength: number,
): { response: ReturnType<typeof createMCPSuccessResponse>; results: Array<Record<string, unknown>> } {
  // Rank-ordered highest-score-first, matching pipeline output
  const results = Array.from({ length: resultCount }, (_, i) => (
    makeResult(i + 1, 1 - i * scoreStep, textLength)
  ));
  const response = createMCPSuccessResponse({
    tool: 'memory_search',
    summary: `Returned ${resultCount} results`,
    data: { count: resultCount, results },
    startTime: Date.now(),
    cacheHit: false,
  });
  return { response, results };
}

function parseEnvelope(response: { content: Array<{ text: string }> }): Record<string, unknown> {
  return JSON.parse(response.content[0]?.text ?? '{}') as Record<string, unknown>;
}

describe('memory_search token budget enforcement', () => {
  it('truncates an oversized result set lowest-score-first with enforcement metadata', () => {
    const originalCount = 20;
    const { response, results } = buildResponse(originalCount, 0.05, 400);
    const budgetTokens = 1000;

    const budgeted = enforceSearchTokenBudget(response, budgetTokens);
    const envelope = parseEnvelope(budgeted);
    const data = envelope.data as { count: number; results: Array<Record<string, unknown>> };
    const enforcement = (envelope.meta as Record<string, unknown>).tokenBudgetEnforcement as {
      budgetTokens: number;
      preEnforcementTokens: number;
      returnedTokens: number;
      actualTokens: number;
      enforced: boolean;
      truncated: boolean;
      originalResultCount: number;
      returnedResultCount: number;
    };

    // Truncated: fewer results returned, envelope re-serialized consistently
    expect(data.results.length).toBeLessThan(originalCount);
    expect(data.count).toBe(data.results.length);

    // Lowest-score results dropped first: kept set is exactly the top-scored
    // subset of the original, in original (rank) order
    const expectedIds = [...results]
      .sort((a, b) => (b.score as number) - (a.score as number))
      .slice(0, data.results.length)
      .map((result) => result.id);
    expect(data.results.map((result) => result.id)).toEqual(expectedIds);

    // Enforcement metadata surfaces original/kept counts and budget
    expect(enforcement).toMatchObject({
      budgetTokens,
      enforced: true,
      truncated: true,
      originalResultCount: originalCount,
      returnedResultCount: data.results.length,
    });
    expect(enforcement.actualTokens).toBe(enforcement.returnedTokens);
    expect(enforcement.returnedTokens).toBeLessThanOrEqual(budgetTokens);

    const { tokenBudgetEnforcement: _diagnostics, ...contentMeta } = envelope.meta as Record<string, unknown>;
    const contentEnvelope = { ...envelope, meta: contentMeta };
    expect(estimateTokens(JSON.stringify(contentEnvelope))).toBeLessThanOrEqual(budgetTokens);
  });

  it('returns an under-budget result set unchanged (no-op)', () => {
    const { response, results } = buildResponse(3, 0.1, 200);
    const originalText = response.content[0]?.text;

    const budgeted = enforceSearchTokenBudget(response, getTokenBudget('memory_search'));

    // No-op: same response object, same serialized envelope, no metadata noise
    expect(budgeted).toBe(response);
    expect(budgeted.content[0]?.text).toBe(originalText);

    const envelope = parseEnvelope(budgeted);
    const data = envelope.data as { count: number; results: Array<Record<string, unknown>> };
    expect(data.results).toEqual(results);
    expect(data.count).toBe(3);
    expect((envelope.meta as Record<string, unknown>).tokenBudgetEnforcement).toBeUndefined();
  });

  it('returns an empty result set unchanged', () => {
    const { response } = buildResponse(0, 0.1, 200);

    const budgeted = enforceSearchTokenBudget(response, getTokenBudget('memory_search'));

    expect(budgeted).toBe(response);
    expect((parseEnvelope(budgeted).meta as Record<string, unknown>).tokenBudgetEnforcement)
      .toBeUndefined();
  });

  it('drops a sole oversized result when necessary', () => {
    const { response } = buildResponse(1, 0.1, 4_000);

    const budgeted = enforceSearchTokenBudget(response, 200);
    const envelope = parseEnvelope(budgeted);
    const data = envelope.data as { count: number; results: Array<Record<string, unknown>> };
    const enforcement = (envelope.meta as Record<string, unknown>).tokenBudgetEnforcement as {
      returnedResultCount: number;
      truncated: boolean;
    };

    expect(data.results).toEqual([]);
    expect(data.count).toBe(0);
    expect(enforcement).toMatchObject({ returnedResultCount: 0, truncated: true });
  });

  it('returns an unparseable envelope unchanged', () => {
    const { response } = buildResponse(1, 0.1, 200);
    response.content[0]!.text = '{not-json';

    const budgeted = enforceSearchTokenBudget(response, 1);

    expect(budgeted).toBe(response);
    expect(budgeted.content[0]?.text).toBe('{not-json');
  });
});

import { describe, expect, it } from 'vitest';

import {
  enforceTokenBudget,
  formatContextSummary,
  resolveEffectiveTokenBudget,
  toMetadataOnlyContextRow,
} from '../handlers/memory-context';

function makeRows(count: number): Array<Record<string, unknown>> {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    title: `Result ${index + 1}`,
    score: 1 - index / 100,
    similarity: 1 - index / 100,
    specFolder: `system/example/00${index % 3}-fixture`,
    filePath: `/workspace/specs/example/result-${index + 1}.md`,
    importanceTier: 'normal',
    content: `content ${index + 1} `.repeat(200),
  }));
}

function makeSnakeCaseRows(count: number): Array<Record<string, unknown>> {
  return makeRows(count).map((row) => ({
    ...row,
    spec_folder: row.specFolder,
    file_path: row.filePath,
    specFolder: undefined,
    filePath: undefined,
  }));
}

function parseNestedResults(result: Record<string, unknown>): Array<Record<string, unknown>> {
  const content = result.content as Array<{ text?: string }>;
  const envelope = JSON.parse(content[0]?.text ?? '{}') as {
    data?: { results?: Array<Record<string, unknown>> };
  };
  return envelope.data?.results ?? [];
}

describe('memory_context token budget enforcement', () => {
  it('reports below, at, and above the minimum direct-row payload honestly', () => {
    const input = {
      strategy: 'search',
      mode: 'deep',
      results: makeRows(15),
      count: 15,
    };
    const floorProbe = enforceTokenBudget(input, 100);
    const minimumFloorTokens = floorProbe.enforcement.actualTokens;
    const below = enforceTokenBudget(input, minimumFloorTokens - 1);
    const at = enforceTokenBudget(input, minimumFloorTokens);
    const above = enforceTokenBudget(input, minimumFloorTokens + 1);

    const results = below.result.results as Array<Record<string, unknown>>;

    expect(results).toHaveLength(10);
    expect(below.enforcement.originalResultCount).toBe(15);
    expect(below.enforcement.returnedResultCount).toBe(10);
    expect(below.enforcement.actualTokens).toBeGreaterThan(below.enforcement.budgetTokens);
    expect(below.enforcement.floorExceededBudget).toBe(true);
    expect(formatContextSummary('deep', 'search', minimumFloorTokens - 1, below.enforcement))
      .toContain(`above the ${minimumFloorTokens - 1} token budget`);
    expect(formatContextSummary('deep', 'search', minimumFloorTokens - 1, below.enforcement))
      .not.toContain('to fit');
    expect(at.enforcement.actualTokens).toBeLessThanOrEqual(at.enforcement.budgetTokens);
    expect(at.enforcement.floorExceededBudget).toBeUndefined();
    expect(above.enforcement.actualTokens).toBeLessThanOrEqual(above.enforcement.budgetTokens);
    expect(above.enforcement.floorExceededBudget).toBeUndefined();
    expect(results[0]).toMatchObject({
      specFolder: 'system/example/000-fixture',
      filePath: '/workspace/specs/example/result-1.md',
    });
  });

  it('keeps a minimum floor for structured nested result compaction', () => {
    const innerEnvelope = {
      summary: 'Context results',
      data: {
        count: 15,
        results: makeRows(15),
      },
    };
    const response = enforceTokenBudget({
      strategy: 'search',
      mode: 'deep',
      content: [{ type: 'text', text: JSON.stringify(innerEnvelope) }],
    }, 50);

    const results = parseNestedResults(response.result);

    expect(results).toHaveLength(10);
    expect(response.enforcement.originalResultCount).toBe(15);
    expect(response.enforcement.returnedResultCount).toBe(10);
    expect(results[0]).toMatchObject({
      specFolder: 'system/example/000-fixture',
      filePath: '/workspace/specs/example/result-1.md',
    });
  });

  it('honors caller tokenBudget before mode defaults', () => {
    expect(resolveEffectiveTokenBudget('deep', 2000, 12000)).toBe(12000);
    expect(resolveEffectiveTokenBudget('deep', 2000)).toBe(3500);
    expect(resolveEffectiveTokenBudget('auto', 2000)).toBe(2000);
  });

  it('preserves snake_case folders in structured fallback metadata rows', () => {
    const rows = makeSnakeCaseRows(10).map((row) => ({
      ...row,
      opaquePayload: 'x'.repeat(4000),
    }));
    const response = enforceTokenBudget({
      strategy: 'search',
      mode: 'deep',
      content: [{
        type: 'text',
        text: JSON.stringify({ data: { count: rows.length, results: rows } }),
      }],
    }, 700);
    const results = parseNestedResults(response.result);

    expect(results).toHaveLength(10);
    expect(results.every((row) => row.metadataOnly === true)).toBe(true);
    expect(results[0]?.specFolder).toBe('system/example/000-fixture');
  });

  it('normalizes camelCase and snake_case metadata-only folder fields', () => {
    expect(toMetadataOnlyContextRow({
      id: 1,
      specFolder: 'system/example/camel',
      filePath: '/workspace/camel.md',
    })).toMatchObject({
      specFolder: 'system/example/camel',
      filePath: '/workspace/camel.md',
      metadataOnly: true,
    });
    expect(toMetadataOnlyContextRow({
      id: 2,
      spec_folder: 'system/example/snake',
      file_path: '/workspace/snake.md',
    })).toMatchObject({
      specFolder: 'system/example/snake',
      filePath: '/workspace/snake.md',
      metadataOnly: true,
    });
  });
});

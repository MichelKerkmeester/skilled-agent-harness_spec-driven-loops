import { describe, expect, it } from 'vitest';

import {
  enforceTokenBudget,
  resolveEffectiveTokenBudget,
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

function parseNestedResults(result: Record<string, unknown>): Array<Record<string, unknown>> {
  const content = result.content as Array<{ text?: string }>;
  const envelope = JSON.parse(content[0]?.text ?? '{}') as {
    data?: { results?: Array<Record<string, unknown>> };
  };
  return envelope.data?.results ?? [];
}

describe('memory_context token budget enforcement', () => {
  it('keeps a minimum floor for direct result compaction', () => {
    const response = enforceTokenBudget({
      strategy: 'search',
      mode: 'deep',
      results: makeRows(15),
      count: 15,
    }, 50);

    const results = response.result.results as Array<Record<string, unknown>>;

    expect(results).toHaveLength(10);
    expect(response.enforcement.originalResultCount).toBe(15);
    expect(response.enforcement.returnedResultCount).toBe(10);
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
});

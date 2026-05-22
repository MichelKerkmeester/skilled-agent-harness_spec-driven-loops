import { afterEach, describe, expect, it } from 'vitest';

import {
  cleanupNamespace,
  namespaceArgs,
  runScript,
  seedReviewNode,
  uniqueNamespace,
  type ScriptNamespace,
} from '../_helpers/spawn-cjs';

const namespaces: ScriptNamespace[] = [];

afterEach(async () => {
  while (namespaces.length > 0) {
    const namespace = namespaces.pop();
    if (namespace) await cleanupNamespace(namespace);
  }
});

describe('query.cjs direct invocation', () => {
  it('returns well-formed JSON for an empty review graph', () => {
    const namespace = uniqueNamespace('query');
    namespaces.push(namespace);

    const result = runScript('query', [
      ...namespaceArgs(namespace),
      '--query-type',
      'coverage_gaps',
    ]);

    expect(result.exitCode).toBe(0);
    expect(result.json.status).toBe('ok');
    expect(result.json.data).toMatchObject({
      queryType: 'coverage_gaps',
      namespace,
      scopeMode: 'session',
      totalGaps: 0,
    });
  });

  it('reports populated review graph coverage gaps', () => {
    const namespace = uniqueNamespace('query');
    namespaces.push(namespace);
    expect(seedReviewNode(namespace).exitCode).toBe(0);

    const result = runScript('query', [
      ...namespaceArgs(namespace),
      '--query-type',
      'coverage_gaps',
    ]);
    const data = result.json.data as { gaps: Array<Record<string, unknown>>; totalGaps: number };

    expect(result.exitCode).toBe(0);
    expect(result.json.status).toBe('ok');
    expect(data.totalGaps).toBe(1);
    expect(data.gaps[0]).toMatchObject({
      nodeId: 'dimension-1',
      kind: 'DIMENSION',
    });
  });

  it('returns non-zero structured JSON for invalid input', () => {
    const result = runScript('query', ['--query-type', 'coverage_gaps']);

    expect(result.exitCode).toBe(3);
    expect(result.json.status).toBe('error');
    expect(result.json.code).toBe('INPUT_VALIDATION');
  });
});

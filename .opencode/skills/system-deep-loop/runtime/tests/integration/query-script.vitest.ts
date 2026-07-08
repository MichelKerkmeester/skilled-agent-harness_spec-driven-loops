import { afterEach, describe, expect, it } from 'vitest';

import {
  cleanupNamespace,
  namespaceArgs,
  runScript,
  seedReviewNode,
  uniqueNamespace,
  type ScriptNamespace,
} from '../helpers/spawn-cjs';

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

  it('exits 3 when session-id is missing', () => {
    const namespace = uniqueNamespace('query');
    const result = runScript('query', [
      '--spec-folder', namespace.specFolder,
      '--loop-type', namespace.loopType,
      '--query-type', 'coverage_gaps',
    ]);

    expect(result.exitCode).toBe(3);
    expect(result.json).toMatchObject({ status: 'error', code: 'INPUT_VALIDATION' });
    expect(result.json.error).toContain('sessionId is required');
  });

  it('exits 2 for DB errors', () => {
    const namespace = uniqueNamespace('query');
    const result = runScript('query', [
      ...namespaceArgs(namespace),
      '--query-type', 'coverage_gaps',
    ], { env: { ...process.env, DEEP_LOOP_TEST_FAULT: 'db' } });

    expect(result.exitCode).toBe(2);
    expect(result.json).toMatchObject({ status: 'error', code: 'DB_ERROR' });
    expect(result.stderr).toBe('');
  });

  it('exits 1 with stderr JSON for generic script errors', () => {
    const namespace = uniqueNamespace('query');
    const result = runScript('query', [
      ...namespaceArgs(namespace),
      '--query-type', 'coverage_gaps',
    ], { env: { ...process.env, DEEP_LOOP_TEST_FAULT: 'script' } });

    expect(result.exitCode).toBe(1);
    expect(result.json).toMatchObject({ status: 'error', code: 'SCRIPT_ERROR' });
    expect(JSON.parse(result.stderr)).toMatchObject({ error: expect.stringContaining('Injected script fault') });
  });
});

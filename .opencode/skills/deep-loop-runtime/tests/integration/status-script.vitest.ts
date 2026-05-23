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

describe('status.cjs direct invocation', () => {
  it('returns status metrics for an empty graph', () => {
    const namespace = uniqueNamespace('status');
    namespaces.push(namespace);

    const result = runScript('status', namespaceArgs(namespace));

    expect(result.exitCode).toBe(0);
    expect(result.json.status).toBe('ok');
    expect(result.json).toMatchObject({
      schemaVersion: 2,
      rowCount: 0,
    });
    expect(result.json.data).toMatchObject({
      namespace,
      totalNodes: 0,
      totalEdges: 0,
      signals: null,
    });
  });

  it('returns populated graph metrics after an upsert', () => {
    const namespace = uniqueNamespace('status');
    namespaces.push(namespace);
    expect(seedReviewNode(namespace).exitCode).toBe(0);

    const result = runScript('status', namespaceArgs(namespace));

    expect(result.exitCode).toBe(0);
    expect(result.json.status).toBe('ok');
    expect(result.json.rowCount).toBe(1);
    expect(result.json.data).toMatchObject({
      totalNodes: 1,
      totalEdges: 0,
      nodesByKind: { DIMENSION: 1 },
    });
  });

  it('returns non-zero structured JSON for invalid input', () => {
    const result = runScript('status');

    expect(result.exitCode).toBe(3);
    expect(result.json.status).toBe('error');
    expect(result.json.code).toBe('INPUT_VALIDATION');
  });

  it('exits 3 when session-id is missing', () => {
    const namespace = uniqueNamespace('status');
    const result = runScript('status', [
      '--spec-folder', namespace.specFolder,
      '--loop-type', namespace.loopType,
    ]);

    expect(result.exitCode).toBe(3);
    expect(result.json).toMatchObject({ status: 'error', code: 'INPUT_VALIDATION' });
    expect(result.json.error).toContain('sessionId is required');
  });

  it('exits 2 for DB errors', () => {
    const namespace = uniqueNamespace('status');
    const result = runScript('status', namespaceArgs(namespace), {
      env: { ...process.env, DEEP_LOOP_TEST_FAULT: 'db' },
    });

    expect(result.exitCode).toBe(2);
    expect(result.json).toMatchObject({ status: 'error', code: 'DB_ERROR' });
    expect(result.stderr).toBe('');
  });

  it('exits 1 with stderr JSON for generic script errors', () => {
    const namespace = uniqueNamespace('status');
    const result = runScript('status', namespaceArgs(namespace), {
      env: { ...process.env, DEEP_LOOP_TEST_FAULT: 'script' },
    });

    expect(result.exitCode).toBe(1);
    expect(result.json).toMatchObject({ status: 'error', code: 'SCRIPT_ERROR' });
    expect(JSON.parse(result.stderr)).toMatchObject({ error: expect.stringContaining('Injected script fault') });
  });
});

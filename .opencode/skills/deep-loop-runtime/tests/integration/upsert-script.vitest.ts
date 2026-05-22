import { afterEach, describe, expect, it } from 'vitest';

import { cleanupNamespace, namespaceArgs, runScript, uniqueNamespace, type ScriptNamespace } from '../_helpers/spawn-cjs';

const namespaces: ScriptNamespace[] = [];

afterEach(async () => {
  while (namespaces.length > 0) {
    const namespace = namespaces.pop();
    if (namespace) await cleanupNamespace(namespace);
  }
});

describe('upsert.cjs direct invocation', () => {
  it('upserts review graph nodes and emits the JSON bridge shape', () => {
    const namespace = uniqueNamespace('upsert');
    namespaces.push(namespace);

    const result = runScript('upsert', [
      ...namespaceArgs(namespace),
      '--nodes',
      JSON.stringify([{ id: 'dim-1', kind: 'DIMENSION', name: 'Correctness' }]),
    ]);

    expect(result.exitCode).toBe(0);
    expect(result.json.status).toBe('ok');
    expect(result.json.data).toMatchObject({
      insertedNodes: 1,
      insertedEdges: 0,
      namespace,
    });
    expect(result.json.graph_upsert_event_count).toBe(1);
  });

  it('returns non-zero structured JSON for invalid input', () => {
    const result = runScript('upsert');

    expect(result.exitCode).toBe(3);
    expect(result.json).toMatchObject({
      status: 'error',
      code: 'INPUT_VALIDATION',
    });
    expect(result.json.error).toContain('specFolder is required');
  });
});

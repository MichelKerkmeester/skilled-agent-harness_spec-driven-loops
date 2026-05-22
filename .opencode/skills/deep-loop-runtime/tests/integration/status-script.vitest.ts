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
});

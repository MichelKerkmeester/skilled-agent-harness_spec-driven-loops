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

describe('convergence.cjs direct invocation', () => {
  it('returns CONTINUE for an empty graph with the JSON bridge fields', () => {
    const namespace = uniqueNamespace('convergence');
    namespaces.push(namespace);

    const result = runScript('convergence', namespaceArgs(namespace));

    expect(result.exitCode).toBe(0);
    expect(result.json.status).toBe('ok');
    expect(result.json).toMatchObject({
      graph_decision: 'CONTINUE',
      graph_stop_blocked: false,
      graph_convergence_score: 0,
    });
    expect(result.json.data).toMatchObject({
      decision: 'CONTINUE',
      namespace,
      nodeCount: 0,
      edgeCount: 0,
    });
  });

  it('returns review blockers for a populated graph that lacks coverage edges', () => {
    const namespace = uniqueNamespace('convergence');
    namespaces.push(namespace);
    expect(seedReviewNode(namespace).exitCode).toBe(0);

    const result = runScript('convergence', namespaceArgs(namespace));
    const data = result.json.data as { blockers: Array<Record<string, unknown>> };

    expect(result.exitCode).toBe(0);
    expect(result.json.status).toBe('ok');
    expect(result.json.graph_decision).toBe('STOP_BLOCKED');
    expect(result.json.graph_stop_blocked).toBe(true);
    expect(data.blockers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: 'uncovered_dimensions', severity: 'blocking' }),
      ]),
    );
  });

  it('returns non-zero structured JSON for invalid input', () => {
    const result = runScript('convergence');

    expect(result.exitCode).toBe(3);
    expect(result.json.status).toBe('error');
    expect(result.json.code).toBe('INPUT_VALIDATION');
  });
});

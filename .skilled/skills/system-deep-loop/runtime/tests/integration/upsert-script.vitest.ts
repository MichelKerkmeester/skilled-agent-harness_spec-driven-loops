// ───────────────────────────────────────────────────────────────────
// MODULE: Upsert Script Integration Tests
// ───────────────────────────────────────────────────────────────────

import { afterEach, describe, expect, it } from 'vitest';

import { cleanupNamespace, namespaceArgs, runScript, uniqueNamespace, type ScriptNamespace } from '../helpers/spawn-cjs';

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

  it('exits 3 when session-id is missing', () => {
    const namespace = uniqueNamespace('upsert');
    const result = runScript('upsert', [
      '--spec-folder', namespace.specFolder,
      '--loop-type', namespace.loopType,
      '--nodes', JSON.stringify([{ id: 'dim-1', kind: 'DIMENSION', name: 'Correctness' }]),
    ]);

    expect(result.exitCode).toBe(3);
    expect(result.json).toMatchObject({ status: 'error', code: 'INPUT_VALIDATION' });
    expect(result.json.error).toContain('sessionId is required');
  });

  it('requires both seed flags when node seed metadata is present', () => {
    const namespace = uniqueNamespace('upsert');
    const result = runScript('upsert', [
      ...namespaceArgs(namespace),
      '--nodes',
      JSON.stringify([{ id: 'dim-1', kind: 'DIMENSION', name: 'Correctness', seedSource: 'scope_discovery' }]),
    ]);

    expect(result.exitCode).toBe(3);
    expect(result.json).toMatchObject({ status: 'error', code: 'INPUT_VALIDATION' });
    expect(result.json.error).toContain('seedSource and seedConfidence are required for seeding');
  });

  it('exits 3 with INPUT_VALIDATION when the events file is unreadable', () => {
    const namespace = uniqueNamespace('upsert-events');
    const result = runScript('upsert', [
      ...namespaceArgs(namespace),
      '--events', '/tmp/deep-loop-missing-events-file.json',
    ]);

    expect(result.exitCode).toBe(3);
    expect(result.json).toMatchObject({ status: 'error', code: 'INPUT_VALIDATION' });
  });

  it('applies seed metadata from CLI flags to review seed nodes', () => {
    const namespace = uniqueNamespace('upsert');
    namespaces.push(namespace);

    const result = runScript('upsert', [
      ...namespaceArgs(namespace),
      '--nodes',
      JSON.stringify([
        { id: 'slice-1', kind: 'SLICE', name: 'Review target' },
        { id: 'file-1', kind: 'FILE', name: 'lib/review.ts' },
      ]),
      '--seed-source',
      'scope_discovery',
      '--seed-confidence',
      '0.5',
    ]);

    expect(result.exitCode).toBe(0);
    expect(result.json.data).toMatchObject({
      insertedNodes: 2,
      insertedEdges: 0,
      seed: { source: 'scope_discovery', confidence: 0.5 },
    });
    expect(result.json.graph_nodes_json).toEqual([
      expect.objectContaining({ id: 'slice-1', seedSource: 'scope_discovery', seedConfidence: 0.5 }),
      expect.objectContaining({ id: 'file-1', seedSource: 'scope_discovery', seedConfidence: 0.5 }),
    ]);
  });

  it('returns a non-fatal warning when a seed invocation has no nodes', () => {
    const namespace = uniqueNamespace('upsert');
    namespaces.push(namespace);

    const result = runScript('upsert', [
      ...namespaceArgs(namespace),
      '--nodes',
      '[]',
      '--edges',
      '[]',
      '--seed-source',
      'scope_discovery',
      '--seed-confidence',
      '0.5',
    ]);

    expect(result.exitCode).toBe(0);
    expect(result.json.data).toMatchObject({
      insertedNodes: 0,
      warnings: ['Coverage graph seeding inserted zero nodes for seed source "scope_discovery"'],
    });
  });

  it('exits 2 for DB errors', () => {
    const namespace = uniqueNamespace('upsert');
    const result = runScript('upsert', [
      ...namespaceArgs(namespace),
      '--nodes', JSON.stringify([{ id: 'dim-1', kind: 'DIMENSION', name: 'Correctness' }]),
    ], { env: { ...process.env, DEEP_LOOP_TEST_FAULT: 'db' } });

    expect(result.exitCode).toBe(2);
    expect(result.json).toMatchObject({ status: 'error', code: 'DB_ERROR' });
    expect(result.stderr).toBe('');
  });

  it('exits 1 with stderr JSON for generic script errors', () => {
    const namespace = uniqueNamespace('upsert');
    const result = runScript('upsert', [
      ...namespaceArgs(namespace),
      '--nodes', JSON.stringify([{ id: 'dim-1', kind: 'DIMENSION', name: 'Correctness' }]),
    ], { env: { ...process.env, DEEP_LOOP_TEST_FAULT: 'script' } });

    expect(result.exitCode).toBe(1);
    expect(result.json).toMatchObject({ status: 'error', code: 'SCRIPT_ERROR' });
    expect(JSON.parse(result.stderr)).toMatchObject({ error: expect.stringContaining('Injected script fault') });
  });

  it('folds a leaf dimension id into the canonical dimension in a review graph', async () => {
    const namespace = uniqueNamespace('upsert');
    namespaces.push(namespace);
    const canonicalIds = ['correctness', 'security', 'traceability', 'maintainability']
      .map((name) => `dimension:${name}`);
    const seedNodes = [
      { id: 'slice-1', kind: 'SLICE', name: 'Review target' },
      { id: 'file-1', kind: 'FILE', name: 'src/guard.cjs' },
      ...canonicalIds.map((id) => ({ id, kind: 'DIMENSION', name: id.slice('dimension:'.length) })),
    ];
    const seedEdges = canonicalIds.map((sourceId, index) => ({
      id: `covers-${index}`,
      sourceId,
      targetId: 'slice-1',
      relation: 'COVERS',
    }));
    const seeded = runScript('upsert', [
      ...namespaceArgs(namespace),
      '--nodes', JSON.stringify(seedNodes),
      '--edges', JSON.stringify(seedEdges),
    ]);
    expect(seeded.exitCode).toBe(0);

    // Each leaf uses its own id shape for the same four dimensions. An edge ends at
    // each, so the graph upsert has to rewrite both the node ids and the edge ends.
    const leafDimensions = [
      { id: 'dim:security', kind: 'DIMENSION', name: 'Security' },
      { id: 'DIM-TRACEABILITY', kind: 'DIMENSION', name: 'Traceability' },
      { id: 'dim:maintainability', kind: 'DIMENSION', name: 'Maintainability' },
      { id: 'dim:correctness', kind: 'DIMENSION', name: 'Correctness' },
    ];
    const leafEdges = leafDimensions.map((node, index) => ({
      id: `confirms-${index}`,
      sourceId: 'file-1',
      targetId: node.id,
      relation: 'CONFIRMS',
    }));
    const folded = runScript('upsert', [
      ...namespaceArgs(namespace),
      '--nodes', JSON.stringify(leafDimensions),
      '--edges', JSON.stringify(leafEdges),
    ]);
    expect(folded.exitCode).toBe(0);
    expect((folded.json.graph_nodes_json as { id: string }[]).map((node) => node.id).sort())
      .toEqual([...canonicalIds].sort());
    expect((folded.json.graph_edges_json as { targetId: string }[]).map((edge) => edge.targetId).sort())
      .toEqual([...canonicalIds].sort());

    const db = await import('../../lib/coverage-graph/coverage-graph-db.js');
    const ns = { specFolder: namespace.specFolder, loopType: 'review' as const, sessionId: namespace.sessionId };
    try {
      const dimensionNodes = db.getNodes(ns).filter((node) => node.kind === 'DIMENSION');
      expect(dimensionNodes.map((node) => node.id).sort()).toEqual([...canonicalIds].sort());
      const leafEdgesOnDisk = db.getEdges(ns).filter((edge) => edge.id.startsWith('confirms-'));
      expect(leafEdgesOnDisk.map((edge) => edge.targetId).sort()).toEqual([...canonicalIds].sort());
    } finally {
      db.closeDb();
    }

    const convergence = runScript('convergence', [...namespaceArgs(namespace), '--read-only']);
    expect(convergence.exitCode).toBe(0);
    expect((convergence.json.data as { signals: { dimensionCoverage: number } }).signals.dimensionCoverage).toBe(1);
  });
});

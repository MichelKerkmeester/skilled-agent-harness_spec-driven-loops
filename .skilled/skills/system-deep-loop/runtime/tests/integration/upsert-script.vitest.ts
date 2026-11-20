// ───────────────────────────────────────────────────────────────────
// MODULE: Upsert Script Integration Tests
// ───────────────────────────────────────────────────────────────────

import { afterEach, describe, expect, it } from 'vitest';

import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { cleanupNamespace, namespaceArgs, runScript, uniqueNamespace, type ScriptNamespace } from '../helpers/spawn-cjs';

const namespaces: ScriptNamespace[] = [];

async function readStoredMetadata(namespace: ScriptNamespace): Promise<Map<string, Record<string, unknown> | undefined>> {
  const db = await import('../../lib/coverage-graph/coverage-graph-db.js');
  try {
    const ns = { specFolder: namespace.specFolder, loopType: namespace.loopType, sessionId: namespace.sessionId };
    return new Map(db.getNodes(ns).map((node) => [node.id, node.metadata]));
  } finally {
    db.closeDb();
  }
}

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

  it('derives a research SOURCE quality_class from its path and drops the leaf-supplied value', async () => {
    const namespace = uniqueNamespace('upsert', 'research');
    namespaces.push(namespace);
    const result = runScript('upsert', [
      ...namespaceArgs(namespace),
      '--nodes', JSON.stringify([{
        id: 'src-agent',
        kind: 'SOURCE',
        name: 'The research agent definition',
        path: '.skilled/agents/deep-research.md',
        metadata: { quality_class: 'primary' },
      }]),
    ]);
    expect(result.exitCode).toBe(0);
    const stored = await readStoredMetadata(namespace);
    expect(stored.get('src-agent')?.quality_class).toBe('skill-doc');
  });

  it('stores only closed-vocabulary quality classes for research SOURCE nodes', async () => {
    const namespace = uniqueNamespace('upsert', 'research');
    namespaces.push(namespace);
    const sources = [
      { id: 'src-code', kind: 'SOURCE', name: 'upsert script', path: '.skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs' },
      { id: 'src-test', kind: 'SOURCE', name: 'upsert suite', path: '.skilled/skills/system-deep-loop/runtime/tests/integration/upsert-script.vitest.ts' },
      { id: 'src-spec', kind: 'SOURCE', name: 'demo spec', path: 'specs/system-deep-loop/demo/spec.md' },
      { id: 'src-doc', kind: 'SOURCE', name: 'skill doc', path: '.skilled/skills/system-deep-loop/SKILL.md' },
      { id: 'src-ledger', kind: 'SOURCE', name: 'state ledger', path: 'specs/system-deep-loop/demo/research/deep-research-state.jsonl' },
      { id: 'src-ledger-code', kind: 'SOURCE', name: 'ledger schema', path: '.skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-schema.ts' },
      { id: 'src-ledger-script', kind: 'SOURCE', name: 'ledger stem check', path: '.skilled/skills/system-deep-loop/runtime/scripts/check-ledger-stem-producers.cjs' },
      { id: 'src-ledger-json', kind: 'SOURCE', name: 'ledger snapshot', path: 'specs/system-deep-loop/demo/research/ledger-snapshot.json' },
      { id: 'src-ext-doc', kind: 'SOURCE', name: 'https://docs.python.org/3/library/json.html' },
      { id: 'src-ext-other', kind: 'SOURCE', name: 'https://example.com/blog/post' },
      { id: 'src-free', kind: 'SOURCE', name: 'An interview with a maintainer' },
    ];
    const result = runScript('upsert', [...namespaceArgs(namespace), '--nodes', JSON.stringify(sources)]);
    expect(result.exitCode).toBe(0);
    const stored = await readStoredMetadata(namespace);
    expect(Object.fromEntries(sources.map((source) => [source.id, stored.get(source.id)?.quality_class]))).toEqual({
      'src-code': 'repo-code',
      'src-test': 'repo-test',
      'src-spec': 'repo-spec',
      'src-doc': 'skill-doc',
      'src-ledger': 'ledger-state',
      'src-ledger-code': 'repo-code',
      'src-ledger-script': 'repo-code',
      'src-ledger-json': 'ledger-state',
      'src-ext-doc': 'external-doc',
      'src-ext-other': 'external-other',
      'src-free': 'unclassified',
    });
  });

  it('classifies a Windows-separated source path the same as its POSIX form', async () => {
    const namespace = uniqueNamespace('upsert', 'research');
    namespaces.push(namespace);
    const sources = [
      { id: 'src-win-spec', kind: 'SOURCE', name: 'demo spec', path: 'specs\\system-deep-loop\\demo\\spec.md' },
      { id: 'src-win-test-dir', kind: 'SOURCE', name: 'test helper', path: '.\\runtime\\tests\\helpers\\spawn-cjs.ts:12' },
      { id: 'src-win-test-file', kind: 'SOURCE', name: 'upsert suite', path: 'runtime\\scripts\\upsert.vitest.ts' },
      { id: 'src-win-code', kind: 'SOURCE', name: 'upsert script', path: 'runtime\\scripts\\upsert.cjs' },
    ];
    const result = runScript('upsert', [...namespaceArgs(namespace), '--nodes', JSON.stringify(sources)]);
    expect(result.exitCode).toBe(0);
    const stored = await readStoredMetadata(namespace);
    expect(Object.fromEntries(sources.map((source) => [source.id, stored.get(source.id)?.quality_class]))).toEqual({
      'src-win-spec': 'repo-spec',
      'src-win-test-dir': 'repo-test',
      'src-win-test-file': 'repo-test',
      'src-win-code': 'repo-code',
    });
  });

  it('keeps FINDING metadata and review node metadata exactly as given', async () => {
    const research = uniqueNamespace('upsert', 'research');
    namespaces.push(research);
    const findingMetadata = { confidence: 0.8, quality_class: 'primary' };
    const researchResult = runScript('upsert', [
      ...namespaceArgs(research),
      '--nodes', JSON.stringify([{ id: 'finding-1', kind: 'FINDING', name: 'A finding', metadata: findingMetadata }]),
    ]);
    expect(researchResult.exitCode).toBe(0);
    expect((await readStoredMetadata(research)).get('finding-1')).toEqual(findingMetadata);

    const review = uniqueNamespace('upsert', 'review');
    namespaces.push(review);
    const reviewMetadata = { severity: 'P1', quality_class: 'primary' };
    const reviewResult = runScript('upsert', [
      ...namespaceArgs(review),
      '--nodes', JSON.stringify([{ id: 'file-1', kind: 'FILE', name: 'src/guard.cjs', metadata: reviewMetadata }]),
    ]);
    expect(reviewResult.exitCode).toBe(0);
    expect((await readStoredMetadata(review)).get('file-1')).toEqual(reviewMetadata);
  });
});

// The review graph upsert reads the iteration record itself, so evidence edges
// no longer depend on the leaf emitting them: the evidence-density signal
// counts EVIDENCE_FOR edges per finding, and a graph with none never allows
// a stop.
describe('upsert.cjs review finding evidence', () => {
  const scratch: string[] = [];
  afterEach(() => {
    while (scratch.length > 0) rmSync(scratch.pop() as string, { recursive: true, force: true });
  });

  function stateLog(findingDetails: unknown[]): string {
    const dir = mkdtempSync(join(tmpdir(), 'upsert-evidence-'));
    scratch.push(dir);
    const file = join(dir, 'deep-review-state.jsonl');
    writeFileSync(file, [
      { type: 'config', topic: 'fixture' },
      { type: 'iteration', iteration: 1, dimensions: ['correctness'], findingDetails: [] },
      { type: 'iteration', iteration: 2, dimensions: ['correctness'], findingDetails },
    ].map((row) => JSON.stringify(row)).join('\n') + '\n');
    return file;
  }

  async function graph(namespace: ScriptNamespace) {
    const db = await import('../../lib/coverage-graph/coverage-graph-db.js');
    try {
      const ns = { specFolder: namespace.specFolder, loopType: namespace.loopType, sessionId: namespace.sessionId };
      return { nodes: db.getNodes(ns), edges: db.getEdges(ns) };
    } finally {
      db.closeDb();
    }
  }

  function upsert(namespace: ScriptNamespace, file: string, nodes: unknown[] = [], edges: unknown[] = []) {
    return runScript('upsert', [
      ...namespaceArgs(namespace),
      '--nodes', JSON.stringify(nodes),
      '--edges', JSON.stringify(edges),
      '--state-log', file,
      '--iteration', '2',
    ]);
  }

  // Each usage guard on the review evidence inputs exits 3 with its own message,
  // before anything is written.
  it.each([
    ['a non-review loop type', 'research', (file: string) => ['--state-log', file, '--iteration', '2'], 'supported only for loop type "review"'],
    ['a --state-log flag with no path', 'review', () => ['--state-log', '--iteration', '2'], '--state-log requires a path'],
    ['a --delta-dir flag with no path', 'review', () => ['--iteration', '2', '--delta-dir'], '--delta-dir requires a path'],
    ['--iteration with no source', 'review', () => ['--iteration', '2'], '--iteration needs --state-log or --delta-dir'],
    ['--iteration 0', 'review', (file: string) => ['--state-log', file, '--iteration', '0'], '--iteration must be a positive integer'],
    ['a state log that cannot be read', 'review', () => ['--state-log', '/tmp/deep-loop-missing-state-log.jsonl', '--iteration', '2'], 'is unreadable'],
  ] as const)('refuses %s', (_label, loopType, extraArgs, message) => {
    const namespace = uniqueNamespace('upsert', loopType);
    const file = stateLog([]);
    const result = runScript('upsert', [...namespaceArgs(namespace), '--nodes', '[]', ...extraArgs(file)]);

    expect(result.exitCode).toBe(3);
    expect(result.json).toMatchObject({ status: 'error', code: 'INPUT_VALIDATION' });
    expect(result.json.error).toContain(message);
  });

  it('links a finding with a file ref to its file node, so evidence density rises above 0', async () => {
    const namespace = uniqueNamespace('upsert');
    namespaces.push(namespace);
    const file = stateLog([{ id: 'R2-P1-001', severity: 'P1', title: 'Guard skips', file: 'src/guard.cjs:42' }]);

    const result = upsert(namespace, file);
    expect(result.exitCode).toBe(0);

    const { nodes, edges } = await graph(namespace);
    const evidence = edges.filter((edge) => edge.relation === 'EVIDENCE_FOR');
    expect(evidence).toHaveLength(1);
    expect(evidence[0]).toMatchObject({ sourceId: 'finding:R2-P1-001', targetId: 'file:src/guard.cjs' });
    expect(nodes.find((node) => node.id === 'file:src/guard.cjs')?.kind).toBe('FILE');
    const findings = nodes.filter((node) => node.kind === 'FINDING');
    expect(evidence.length / findings.length).toBeGreaterThan(0);
  });

  it('folds a leaf finding node onto the finding id, so it does not dilute the density', async () => {
    const namespace = uniqueNamespace('upsert');
    namespaces.push(namespace);
    const file = stateLog([{ id: 'R2-P1-001', severity: 'P1', title: 'Guard skips', file: 'src/guard.cjs:42' }]);

    const result = upsert(namespace, file, [
      { id: 'FIND-R2-P1-001', kind: 'FINDING', name: 'Guard skips' },
      { id: 'dimension:correctness', kind: 'DIMENSION', name: 'correctness' },
    ], [
      { id: 'leaf-edge', relation: 'IN_DIMENSION', source: 'FIND-R2-P1-001', target: 'dimension:correctness' },
    ]);
    expect(result.exitCode).toBe(0);

    const { nodes, edges } = await graph(namespace);
    const findings = nodes.filter((node) => node.kind === 'FINDING');
    expect(findings.map((node) => node.id)).toEqual(['finding:R2-P1-001']);
    expect(edges.find((edge) => edge.id === 'leaf-edge')?.sourceId).toBe('finding:R2-P1-001');
    expect(edges.filter((edge) => edge.relation === 'EVIDENCE_FOR').length / findings.length).toBe(1);
  });

  it('adds no duplicate edge when the same iteration is upserted again', async () => {
    const namespace = uniqueNamespace('upsert');
    namespaces.push(namespace);
    const file = stateLog([{ id: 'R2-P1-001', severity: 'P1', title: 'Guard skips', file: 'src/guard.cjs:42' }]);

    expect(upsert(namespace, file).exitCode).toBe(0);
    const first = await graph(namespace);
    expect(upsert(namespace, file).exitCode).toBe(0);
    const second = await graph(namespace);

    expect(second.edges).toHaveLength(first.edges.length);
    expect(second.nodes).toHaveLength(first.nodes.length);
    expect(second.edges.filter((edge) => edge.relation === 'EVIDENCE_FOR')).toHaveLength(1);
  });

  it('takes the file ref from the iteration delta when the state record lacks it', async () => {
    const namespace = uniqueNamespace('upsert');
    namespaces.push(namespace);
    const file = stateLog([{ id: 'R2-P2-001', severity: 'P2', title: 'Unplaced in the record' }]);
    const deltaDir = join(file, '..', 'deltas');
    mkdirSync(deltaDir, { recursive: true });
    writeFileSync(join(deltaDir, 'iter-002.jsonl'), [
      { type: 'iteration', iteration: 2 },
      { type: 'finding', id: 'R2-P2-001', severity: 'P2', title: 'Unplaced in the record', file: 'src/readme.md:7', iteration: 2 },
    ].map((row) => JSON.stringify(row)).join('\n') + '\n');

    const result = runScript('upsert', [
      ...namespaceArgs(namespace),
      '--nodes', '[]',
      '--edges', '[]',
      '--state-log', file,
      '--delta-dir', deltaDir,
      '--iteration', '2',
    ]);
    expect(result.exitCode).toBe(0);
    const { edges } = await graph(namespace);
    const evidence = edges.filter((edge) => edge.relation === 'EVIDENCE_FOR');
    expect(evidence).toHaveLength(1);
    expect(evidence[0]).toMatchObject({ sourceId: 'finding:R2-P2-001', targetId: 'file:src/readme.md' });
  });

  it('adds no edge for a finding without a file ref', async () => {
    const namespace = uniqueNamespace('upsert');
    namespaces.push(namespace);
    const file = stateLog([{ id: 'R2-P2-001', severity: 'P2', title: 'Unplaced' }]);

    const result = upsert(namespace, file);
    expect(result.exitCode).toBe(0);
    const { edges } = await graph(namespace);
    expect(edges.filter((edge) => edge.relation === 'EVIDENCE_FOR')).toHaveLength(0);
  });

  it('skips an edge to an undeclared node instead of failing on the foreign key', async () => {
    const namespace = uniqueNamespace('upsert');
    namespaces.push(namespace);
    const file = stateLog([{ id: 'R2-P1-001', severity: 'P1', title: 'Guard skips', file: 'src/guard.cjs:42' }]);

    const result = upsert(namespace, file, [
      { id: 'dimension:correctness', kind: 'DIMENSION', name: 'correctness' },
    ], [
      { id: 'orphan-edge', relation: 'COVERS', source: 'dimension:correctness', target: 'file:never-declared.cjs' },
    ]);
    expect(result.exitCode).toBe(0);
    expect(result.json.status).toBe('ok');
    expect((result.json.data as Record<string, unknown>).rejectedOrphanEdges).toEqual(['orphan-edge']);

    const { edges } = await graph(namespace);
    expect(edges.find((edge) => edge.id === 'orphan-edge')).toBeUndefined();
    expect(edges.filter((edge) => edge.relation === 'EVIDENCE_FOR')).toHaveLength(1);
  });
});

// The merged finding id has to come out the same whichever iteration names it,
// and only finding endpoints may move: a stable id is what lets a later
// RESOLVES edge land on the finding an earlier iteration stored.
describe('upsert.cjs review finding identity', () => {
  const scratch: string[] = [];
  afterEach(() => {
    while (scratch.length > 0) rmSync(scratch.pop() as string, { recursive: true, force: true });
  });

  function stateLog(iterations: Array<{ iteration: number; findingDetails: unknown[] }>): string {
    const dir = mkdtempSync(join(tmpdir(), 'upsert-identity-'));
    scratch.push(dir);
    const file = join(dir, 'deep-review-state.jsonl');
    writeFileSync(file, iterations
      .map((row) => JSON.stringify({ type: 'iteration', dimensions: ['correctness'], ...row }))
      .join('\n') + '\n');
    return file;
  }

  function upsert(namespace: ScriptNamespace, file: string, iteration: number, nodes: unknown[] = [], edges: unknown[] = []) {
    return runScript('upsert', [
      ...namespaceArgs(namespace),
      '--nodes', JSON.stringify(nodes),
      '--edges', JSON.stringify(edges),
      '--state-log', file,
      '--iteration', String(iteration),
    ]);
  }

  async function graph(namespace: ScriptNamespace) {
    const db = await import('../../lib/coverage-graph/coverage-graph-db.js');
    try {
      const ns = { specFolder: namespace.specFolder, loopType: namespace.loopType, sessionId: namespace.sessionId };
      return { nodes: db.getNodes(ns), edges: db.getEdges(ns) };
    } finally {
      db.closeDb();
    }
  }

  it('folds a lowercase leaf finding id onto the finding the iteration reports', async () => {
    const namespace = uniqueNamespace('upsert');
    namespaces.push(namespace);
    const file = stateLog([{ iteration: 1, findingDetails: [{ id: 'R1-P2-001', title: 'Drift', file: 'src/a.cjs:3' }] }]);

    expect(upsert(namespace, file, 1, [{ id: 'finding-r1-p2-001', kind: 'FINDING', name: 'Drift' }]).exitCode).toBe(0);

    const { nodes, edges } = await graph(namespace);
    const findings = nodes.filter((node) => node.kind === 'FINDING');
    expect(findings.map((node) => node.id)).toEqual(['finding:R1-P2-001']);
    expect(edges.filter((edge) => edge.relation === 'EVIDENCE_FOR').length / findings.length).toBe(1);
  });

  it('lands a RESOLVES edge from a later iteration on the finding an earlier one stored', async () => {
    const namespace = uniqueNamespace('upsert');
    namespaces.push(namespace);
    const file = stateLog([
      { iteration: 1, findingDetails: [{ id: 'finding-3-1', title: 'Leak', file: 'src/a.cjs:3' }] },
      { iteration: 2, findingDetails: [] },
    ]);

    expect(upsert(namespace, file, 1, [{ id: 'finding-3-1', kind: 'FINDING', name: 'Leak' }]).exitCode).toBe(0);
    const later = upsert(namespace, file, 2, [
      { id: 'fix-1', kind: 'REMEDIATION', name: 'Close the handle' },
    ], [
      { id: 'resolves-1', relation: 'RESOLVES', source: 'fix-1', target: 'finding-3-1' },
    ]);
    expect(later.exitCode).toBe(0);
    expect((later.json.data as Record<string, unknown>).rejectedOrphanEdges).toBeUndefined();

    const { nodes, edges } = await graph(namespace);
    const findings = nodes.filter((node) => node.kind === 'FINDING');
    expect(findings).toHaveLength(1);
    expect(edges.find((edge) => edge.id === 'resolves-1')?.targetId).toBe(findings[0].id);
  });

  it('leaves a non-finding node whose id starts with finding- and its edges alone', async () => {
    const namespace = uniqueNamespace('upsert');
    namespaces.push(namespace);
    const file = stateLog([{ iteration: 1, findingDetails: [{ id: 'R1-P1-001', title: 'Guard skips', file: 'src/guard.cjs:42' }] }]);

    const result = upsert(namespace, file, 1, [
      { id: 'finding-R1-P1-001', kind: 'FINDING', name: 'Guard skips' },
      { id: 'finding-R1-P1-001-proof', kind: 'EVIDENCE', name: 'Trace' },
    ], [
      { id: 'proof-edge', relation: 'CONFIRMS', source: 'finding-R1-P1-001-proof', target: 'finding-R1-P1-001' },
    ]);
    expect(result.exitCode).toBe(0);

    const { nodes, edges } = await graph(namespace);
    expect(nodes.find((node) => node.id === 'finding-R1-P1-001-proof')?.kind).toBe('EVIDENCE');
    expect(edges.find((edge) => edge.id === 'proof-edge')).toMatchObject({
      sourceId: 'finding-R1-P1-001-proof',
      targetId: 'finding:R1-P1-001',
    });
  });

  it('keeps two distinct findings that reuse an id in different iterations apart', async () => {
    const namespace = uniqueNamespace('upsert');
    namespaces.push(namespace);
    const file = stateLog([
      { iteration: 1, findingDetails: [{ id: 'F1', title: 'Leak in a', file: 'src/a.cjs:3' }] },
      { iteration: 2, findingDetails: [{ id: 'F1', title: 'Race in b', file: 'src/b.cjs:9' }] },
    ]);

    expect(upsert(namespace, file, 1).exitCode).toBe(0);
    expect(upsert(namespace, file, 2).exitCode).toBe(0);

    const { nodes, edges } = await graph(namespace);
    expect(nodes.filter((node) => node.kind === 'FINDING').map((node) => node.id).sort()).toEqual(['finding:F1', 'finding:F1#2']);
    expect(edges.filter((edge) => edge.relation === 'EVIDENCE_FOR').map((edge) => edge.targetId).sort())
      .toEqual(['file:src/a.cjs', 'file:src/b.cjs']);
  });

  it('lands a leaf node and its edge on the new finding when a later iteration reuses an id', async () => {
    const namespace = uniqueNamespace('upsert');
    namespaces.push(namespace);
    const file = stateLog([
      { iteration: 1, findingDetails: [{ id: 'F1', title: 'Leak in a', file: 'src/a.cjs:3' }] },
      { iteration: 2, findingDetails: [{ id: 'F1', title: 'Race in b', file: 'src/b.cjs:9' }] },
    ]);

    expect(upsert(namespace, file, 1).exitCode).toBe(0);
    expect(upsert(namespace, file, 2, [
      { id: 'finding-F1', kind: 'FINDING', name: 'Race in b' },
      { id: 'ev-b', kind: 'EVIDENCE', name: 'Trace b' },
    ], [
      { id: 'conf-b', relation: 'CONFIRMS', source: 'ev-b', target: 'finding-F1' },
    ]).exitCode).toBe(0);

    const { nodes, edges } = await graph(namespace);
    const earlier = nodes.find((node) => node.id === 'finding:F1');
    expect(earlier?.name).toBe('Leak in a');
    expect(earlier?.metadata).toMatchObject({ finding_id: 'F1', file: 'src/a.cjs', line: 3 });
    expect(nodes.find((node) => node.id === 'finding:F1#2')?.name).toBe('Race in b');
    expect(nodes.find((node) => node.id === 'finding:F1#2')?.metadata).toMatchObject({ file: 'src/b.cjs' });
    expect(edges.find((edge) => edge.id === 'conf-b')?.targetId).toBe('finding:F1#2');
  });

  it('keeps the file of a folded leaf finding, so a later reused id still splits', async () => {
    const namespace = uniqueNamespace('upsert');
    namespaces.push(namespace);
    const file = stateLog([
      { iteration: 1, findingDetails: [{ id: 'F1', title: 'Leak in a', file: 'src/a.cjs:3' }] },
      { iteration: 2, findingDetails: [{ id: 'F1', title: 'Race in b', file: 'src/b.cjs:9' }] },
    ]);

    expect(upsert(namespace, file, 1, [{ id: 'finding-F1', kind: 'FINDING', name: 'Leak in a' }]).exitCode).toBe(0);
    expect(upsert(namespace, file, 2).exitCode).toBe(0);

    const { nodes } = await graph(namespace);
    const earlier = nodes.find((node) => node.id === 'finding:F1');
    expect(earlier?.name).toBe('Leak in a');
    expect(earlier?.metadata).toMatchObject({ file: 'src/a.cjs' });
    expect(nodes.find((node) => node.id === 'finding:F1#2')?.name).toBe('Race in b');
  });

  it('derives an edge only from a ref with a line, and drops a trailing column', async () => {
    const namespace = uniqueNamespace('upsert');
    namespaces.push(namespace);
    const file = stateLog([{ iteration: 1, findingDetails: [
      { id: 'R1-P2-001', title: 'No line', file: 'src/a.cjs' },
      { id: 'R1-P2-002', title: 'Line and column', file: 'src/b.cjs:42:7' },
    ] }]);

    expect(upsert(namespace, file, 1).exitCode).toBe(0);

    const { edges } = await graph(namespace);
    const evidence = edges.filter((edge) => edge.relation === 'EVIDENCE_FOR');
    expect(evidence).toHaveLength(1);
    expect(evidence[0]).toMatchObject({ sourceId: 'finding:R1-P2-002', targetId: 'file:src/b.cjs' });
  });
});

// The orphan skip sits in the write path every loop type shares, so each one is
// checked: the batch keeps its declared nodes and edges, and the drop is named.
describe('upsert.cjs skips edges to undeclared nodes for every loop type', () => {
  const cases: Array<[string, unknown[], unknown[]]> = [
    ['research', [
      { id: 'q-1', kind: 'QUESTION', name: 'Question' },
      { id: 'f-1', kind: 'FINDING', name: 'Finding' },
    ], [
      { id: 'kept', relation: 'ANSWERS', source: 'f-1', target: 'q-1' },
      { id: 'orphan', relation: 'ANSWERS', source: 'f-missing', target: 'q-1' },
    ]],
    ['context', [
      { id: 'slice-1', kind: 'SLICE', name: 'Slice' },
      { id: 'file-1', kind: 'FILE', name: 'src/a.cjs' },
    ], [
      { id: 'kept', relation: 'CONTAINS', source: 'slice-1', target: 'file-1' },
      { id: 'orphan', relation: 'CONTAINS', source: 'slice-1', target: 'file-missing' },
    ]],
  ];

  it.each(cases)('%s', async (loopType, nodes, edges) => {
    const namespace = uniqueNamespace('upsert', loopType as ScriptNamespace['loopType']);
    namespaces.push(namespace);

    const result = runScript('upsert', [
      ...namespaceArgs(namespace),
      '--nodes', JSON.stringify(nodes),
      '--edges', JSON.stringify(edges),
    ]);
    expect(result.exitCode).toBe(0);
    expect((result.json.data as Record<string, unknown>).rejectedOrphanEdges).toEqual(['orphan']);
    expect(result.stderr).toContain('skipped 1 edge to an undeclared node: orphan');

    const db = await import('../../lib/coverage-graph/coverage-graph-db.js');
    try {
      const ns = { specFolder: namespace.specFolder, loopType: namespace.loopType, sessionId: namespace.sessionId };
      expect(db.getNodes(ns as never)).toHaveLength(2);
      expect(db.getEdges(ns as never).map((edge) => edge.id)).toEqual(['kept']);
    } finally {
      db.closeDb();
    }
  });
});

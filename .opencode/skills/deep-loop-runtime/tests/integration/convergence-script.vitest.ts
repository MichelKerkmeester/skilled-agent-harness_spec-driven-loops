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

function seedConvergedResearchGraph(namespace: ScriptNamespace) {
  return runScript('upsert', [
    ...namespaceArgs(namespace),
    '--nodes',
    JSON.stringify([
      { id: 'question-1', kind: 'QUESTION', name: 'Main question' },
      { id: 'finding-1', kind: 'FINDING', name: 'First answer' },
      { id: 'finding-2', kind: 'FINDING', name: 'Second answer' },
      { id: 'source-1', kind: 'SOURCE', name: 'Primary source', metadata: { quality_class: 'primary' } },
      { id: 'source-2', kind: 'SOURCE', name: 'Secondary source', metadata: { quality_class: 'secondary' } },
    ]),
    '--edges',
    JSON.stringify([
      { id: 'answer-1', sourceId: 'finding-1', targetId: 'question-1', relation: 'ANSWERS' },
      { id: 'answer-2', sourceId: 'finding-2', targetId: 'question-1', relation: 'ANSWERS' },
      { id: 'cite-1', sourceId: 'finding-1', targetId: 'source-1', relation: 'CITES' },
      { id: 'cite-2', sourceId: 'finding-2', targetId: 'source-2', relation: 'CITES' },
    ]),
  ]);
}

function addNewResearchSource(namespace: ScriptNamespace) {
  return runScript('upsert', [
    ...namespaceArgs(namespace),
    '--nodes',
    JSON.stringify([
      { id: 'source-3', kind: 'SOURCE', name: 'New independent source', iteration: 2, metadata: { quality_class: 'tertiary' } },
    ]),
  ]);
}

function addInsightOnlyFinding(namespace: ScriptNamespace) {
  return runScript('upsert', [
    ...namespaceArgs(namespace),
    '--nodes',
    JSON.stringify([
      { id: 'finding-insight', kind: 'FINDING', name: 'Bookkeeping insight', iteration: 2, metadata: { status: 'insight' } },
    ]),
  ]);
}

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

  it('exits 3 when session-id is missing', () => {
    const namespace = uniqueNamespace('convergence');
    const result = runScript('convergence', [
      '--spec-folder', namespace.specFolder,
      '--loop-type', namespace.loopType,
    ]);

    expect(result.exitCode).toBe(3);
    expect(result.json).toMatchObject({ status: 'error', code: 'INPUT_VALIDATION' });
    expect(result.json.error).toContain('sessionId is required');
  });

  it('exits 2 for DB errors', () => {
    const namespace = uniqueNamespace('convergence');
    const result = runScript('convergence', namespaceArgs(namespace), {
      env: { ...process.env, DEEP_LOOP_TEST_FAULT: 'db' },
    });

    expect(result.exitCode).toBe(2);
    expect(result.json).toMatchObject({ status: 'error', code: 'DB_ERROR' });
    expect(result.stderr).toBe('');
  });

  it('exits 1 with stderr JSON for generic script errors', () => {
    const namespace = uniqueNamespace('convergence');
    const result = runScript('convergence', namespaceArgs(namespace), {
      env: { ...process.env, DEEP_LOOP_TEST_FAULT: 'script' },
    });

    expect(result.exitCode).toBe(1);
    expect(result.json).toMatchObject({ status: 'error', code: 'SCRIPT_ERROR' });
    expect(JSON.parse(result.stderr)).toMatchObject({ error: expect.stringContaining('Injected script fault') });
  });

  it('leaves research STOP output unchanged when reported novelty is absent', () => {
    const namespace = uniqueNamespace('convergence', 'research');
    namespaces.push(namespace);
    expect(seedConvergedResearchGraph(namespace).exitCode).toBe(0);

    const result = runScript('convergence', namespaceArgs(namespace));
    const data = result.json.data as { signals: Record<string, unknown>; blockers: unknown[] };

    expect(result.exitCode).toBe(0);
    expect(result.json.graph_decision).toBe('STOP_ALLOWED');
    expect(data.signals).not.toHaveProperty('graphNoveltyDelta');
    expect(data.signals).not.toHaveProperty('reportedNovelty');
    expect(data.blockers).toEqual([]);
  });

  it('blocks research STOP when low reported novelty disagrees with graph novelty', () => {
    const namespace = uniqueNamespace('convergence', 'research');
    namespaces.push(namespace);
    expect(seedConvergedResearchGraph(namespace).exitCode).toBe(0);
    expect(runScript('convergence', [...namespaceArgs(namespace), '--persist-snapshot', '--iteration', '1']).exitCode).toBe(0);
    expect(addNewResearchSource(namespace).exitCode).toBe(0);

    const result = runScript('convergence', [
      ...namespaceArgs(namespace),
      '--reported-novelty',
      '0.01',
      '--graph-novelty-floor',
      '0.05',
    ]);
    const data = result.json.data as {
      signals: Record<string, number>;
      blockers: Array<Record<string, unknown>>;
    };

    expect(result.exitCode).toBe(0);
    expect(result.json.graph_decision).toBe('STOP_BLOCKED');
    expect(data.signals.effectiveNovelty).toBeGreaterThan(data.signals.reportedNovelty);
    expect(data.blockers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: 'novelty_self_report_unverified', severity: 'blocking' }),
      ]),
    );
  });

  it('allows research STOP when low reported novelty matches a flat graph delta', () => {
    const namespace = uniqueNamespace('convergence', 'research');
    namespaces.push(namespace);
    expect(seedConvergedResearchGraph(namespace).exitCode).toBe(0);
    expect(runScript('convergence', [...namespaceArgs(namespace), '--persist-snapshot', '--iteration', '1']).exitCode).toBe(0);

    const result = runScript('convergence', [
      ...namespaceArgs(namespace),
      '--reported-novelty',
      '0.01',
      '--graph-novelty-floor',
      '0.05',
    ]);
    const data = result.json.data as {
      signals: Record<string, number>;
      blockers: Array<Record<string, unknown>>;
    };

    expect(result.exitCode).toBe(0);
    expect(result.json.graph_decision).toBe('STOP_ALLOWED');
    expect(data.signals.graphNoveltyDelta).toBe(0);
    expect(data.blockers.map((blocker) => blocker.type)).not.toContain('novelty_self_report_unverified');
  });

  it('allows research STOP when the only post-snapshot graph change is insight metadata', () => {
    const namespace = uniqueNamespace('convergence', 'research');
    namespaces.push(namespace);
    expect(seedConvergedResearchGraph(namespace).exitCode).toBe(0);
    expect(runScript('convergence', [...namespaceArgs(namespace), '--persist-snapshot', '--iteration', '1']).exitCode).toBe(0);
    expect(addInsightOnlyFinding(namespace).exitCode).toBe(0);

    const result = runScript('convergence', [
      ...namespaceArgs(namespace),
      '--reported-novelty',
      '0.01',
      '--graph-novelty-floor',
      '0.05',
    ]);
    const data = result.json.data as {
      signals: Record<string, number>;
      blockers: Array<Record<string, unknown>>;
    };

    expect(result.exitCode).toBe(0);
    expect(result.json.graph_decision).toBe('STOP_ALLOWED');
    expect(data.signals.graphNoveltyDelta).toBe(0);
    expect(data.blockers.map((blocker) => blocker.type)).not.toContain('novelty_self_report_unverified');
  });
});

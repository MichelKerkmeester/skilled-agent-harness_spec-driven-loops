import { afterEach, describe, expect, it } from 'vitest';

import {
  cleanupNamespace,
  namespaceArgs,
  runScript,
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

function councilNamespace(scriptName: Parameters<typeof uniqueNamespace>[0]): ScriptNamespace {
  const namespace = uniqueNamespace(scriptName, 'council');
  namespaces.push(namespace);
  return namespace;
}

function seedBlockingCouncil(namespace: ScriptNamespace) {
  return runScript('upsert', [
    ...namespaceArgs(namespace),
    '--nodes',
    JSON.stringify([
      { id: 'session', kind: 'SESSION', name: 'Council session', artifactPath: 'ai-council/ai-council-state.jsonl' },
      { id: 'seat-a', kind: 'SEAT', name: 'Analytical seat', roundId: 'round-001' },
      { id: 'claim-1', kind: 'CLAIM', name: 'Use runtime graph' },
      { id: 'evidence-1', kind: 'EVIDENCE', name: 'Runtime graph supports council' },
      { id: 'disagreement-1', kind: 'DISAGREEMENT', name: 'Critical unresolved dissent', metadata: { severity: 'P1' } },
      { id: 'decision-1', kind: 'DECISION', name: 'Use council CLI graph', metadata: { confidence: 0.8 } },
    ]),
    '--edges',
    JSON.stringify([
      { id: 'edge-seat', sourceId: 'seat-a', targetId: 'session', relation: 'PARTICIPATES_IN' },
      { id: 'edge-support', sourceId: 'claim-1', targetId: 'decision-1', relation: 'SUPPORTS' },
      { id: 'edge-evidence', sourceId: 'evidence-1', targetId: 'decision-1', relation: 'EVIDENCE_FOR' },
      { id: 'edge-dissent', sourceId: 'disagreement-1', targetId: 'decision-1', relation: 'CONTRADICTS' },
      { id: 'edge-self', sourceId: 'decision-1', targetId: 'decision-1', relation: 'SUPPORTS' },
    ]),
  ]);
}

function seedPassingCouncil(namespace: ScriptNamespace) {
  return runScript('upsert', [
    ...namespaceArgs(namespace),
    '--nodes',
    JSON.stringify([
      { id: 'seat-a', kind: 'SEAT', name: 'Analytical seat' },
      { id: 'seat-b', kind: 'SEAT', name: 'Critical seat' },
      { id: 'claim-1', kind: 'CLAIM', name: 'Graph is dedicated' },
      { id: 'evidence-1', kind: 'EVIDENCE', name: 'Artifact contract is stable' },
      { id: 'decision-1', kind: 'DECISION', name: 'Implement council graph', metadata: { confidence: 0.82 } },
      { id: 'recommendation-1', kind: 'RECOMMENDATION', name: 'Keep graph derived', metadata: { confidence: 0.88 } },
    ]),
    '--edges',
    JSON.stringify([
      { id: 'agree-a', sourceId: 'seat-a', targetId: 'decision-1', relation: 'AGREES_WITH' },
      { id: 'agree-b', sourceId: 'seat-b', targetId: 'decision-1', relation: 'AGREES_WITH' },
      { id: 'support-1', sourceId: 'claim-1', targetId: 'decision-1', relation: 'SUPPORTS' },
      { id: 'evidence-1', sourceId: 'evidence-1', targetId: 'decision-1', relation: 'EVIDENCE_FOR' },
      { id: 'recommends-1', sourceId: 'decision-1', targetId: 'recommendation-1', relation: 'RECOMMENDS' },
    ]),
  ]);
}

function seedContinuingCouncil(namespace: ScriptNamespace) {
  return runScript('upsert', [
    ...namespaceArgs(namespace),
    '--nodes',
    JSON.stringify([
      { id: 'claim-1', kind: 'CLAIM', name: 'Graph is useful' },
      { id: 'decision-1', kind: 'DECISION', name: 'Continue council graph', metadata: { confidence: 0.82 } },
    ]),
    '--edges',
    JSON.stringify([
      { id: 'support-1', sourceId: 'claim-1', targetId: 'decision-1', relation: 'SUPPORTS' },
    ]),
  ]);
}

describe('council graph direct script invocation', () => {
  it('treats empty council upsert as explicit no-op success', () => {
    const namespace = councilNamespace('upsert');
    const result = runScript('upsert', namespaceArgs(namespace));

    expect(result.exitCode).toBe(0);
    expect(result.json.status).toBe('ok');
    expect(result.json.data).toMatchObject({
      insertedNodes: 0,
      insertedEdges: 0,
      rejectedEdges: 0,
      rejectedSelfLoops: [],
      noOp: true,
      namespace,
      sourceOfTruth: 'derived_from_ai_council_artifacts',
    });
    expect(result.json.graph_upsert_event_count).toBe(0);
  });

  it('upserts council nodes and edges with artifact provenance fields', () => {
    const namespace = councilNamespace('upsert');
    const result = seedBlockingCouncil(namespace);

    expect(result.exitCode).toBe(0);
    expect(result.json.status).toBe('ok');
    expect(result.json.data).toMatchObject({
      insertedNodes: 6,
      insertedEdges: 4,
      rejectedSelfLoops: ['edge-self'],
      namespace,
      sourceOfTruth: 'derived_from_ai_council_artifacts',
    });
    expect(result.json.graph_nodes_json).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'session',
          kind: 'SESSION',
          artifactPath: 'ai-council/ai-council-state.jsonl',
        }),
        expect.objectContaining({ id: 'seat-a', roundId: 'round-001' }),
      ]),
    );
  });

  it('queries each council query type', () => {
    const namespace = councilNamespace('query');
    expect(seedBlockingCouncil(namespace).exitCode).toBe(0);

    const unresolved = runScript('query', [...namespaceArgs(namespace), '--query-type', 'unresolved_disagreements']);
    expect(unresolved.exitCode).toBe(0);
    expect(unresolved.json.data).toMatchObject({
      totalUnresolved: 1,
      sourceOfTruth: 'derived_from_ai_council_artifacts',
    });

    const support = runScript('query', [...namespaceArgs(namespace), '--query-type', 'decision_support', '--node-id', 'decision-1']);
    expect(support.exitCode).toBe(0);
    expect((support.json.data as { support: Array<{ supportCount: number; evidenceCount: number }> }).support[0]).toMatchObject({
      supportCount: 1,
      evidenceCount: 1,
    });

    const chain = runScript('query', [...namespaceArgs(namespace), '--query-type', 'evidence_chain', '--node-id', 'decision-1']);
    expect(chain.exitCode).toBe(0);
    expect((chain.json.data as { chain: Array<{ node: { id: string } }> }).chain.map((step) => step.node.id)).toEqual(
      expect.arrayContaining(['decision-1', 'claim-1', 'evidence-1']),
    );

    const blockers = runScript('query', [...namespaceArgs(namespace), '--query-type', 'convergence_blockers']);
    expect(blockers.exitCode).toBe(0);
    expect(blockers.json.data).toMatchObject({
      totals: { unresolvedCriticalDisagreements: 1 },
    });

    const hotNodes = runScript('query', [...namespaceArgs(namespace), '--query-type', 'hot_nodes']);
    expect(hotNodes.exitCode).toBe(0);
    expect((hotNodes.json.data as { hotNodes: Array<{ id: string }> }).hotNodes.length).toBeGreaterThan(0);
  });

  it('returns prompt-safe council query output without arbitrary metadata', () => {
    const namespace = councilNamespace('query');
    const longStatus = 'x'.repeat(120);
    const upsert = runScript('upsert', [
      ...namespaceArgs(namespace),
      '--nodes',
      JSON.stringify([
        {
          id: 'decision-1',
          kind: 'DECISION',
          name: 'Metadata safety decision',
          metadata: {
            confidence: 0.91,
            status: longStatus,
            secretToken: 'should-not-surface',
            nested: { raw: 'artifact text' },
          },
        },
      ]),
    ]);
    expect(upsert.exitCode).toBe(0);

    const response = runScript('query', [
      ...namespaceArgs(namespace),
      '--query-type',
      'decision_support',
      '--node-id',
      'decision-1',
    ]);
    expect(response.exitCode).toBe(0);
    const support = ((response.json.data as Record<string, unknown>).support as Array<Record<string, unknown>>)[0];
    const node = support.node as Record<string, unknown>;
    const metadata = node.metadata as Record<string, unknown>;
    expect(metadata.confidence).toBe(0.91);
    expect(String(metadata.status).length).toBeLessThanOrEqual(83);
    expect(metadata.secretToken).toBeUndefined();
    expect(metadata.nested).toBeUndefined();
    expect(JSON.stringify(node)).not.toContain('should-not-surface');
    expect(JSON.stringify(node)).not.toContain('artifact text');
  });

  it('reports empty and ready council status payloads', () => {
    const namespace = councilNamespace('status');
    const empty = runScript('status', namespaceArgs(namespace));

    expect(empty.exitCode).toBe(0);
    expect(empty.json.data).toMatchObject({
      namespace,
      readiness: 'empty',
      sourceOfTruth: 'derived_from_ai_council_artifacts',
      totalNodes: 0,
      totalEdges: 0,
      signals: null,
    });
    expect((empty.json.data as { recovery: { mode: string } }).recovery.mode).toBe('derived_replay');

    expect(seedBlockingCouncil(namespace).exitCode).toBe(0);
    const ready = runScript('status', namespaceArgs(namespace));
    expect(ready.exitCode).toBe(0);
    expect(ready.json.data).toMatchObject({
      readiness: 'ready',
      totalNodes: 6,
      totalEdges: 4,
      nodesByKind: { DECISION: 1, DISAGREEMENT: 1, EVIDENCE: 1 },
    });
    expect((ready.json.data as { signals: Record<string, unknown> }).signals).toMatchObject({
      unresolvedCriticalDisagreements: 1,
    });
  });

  it('blocks convergence for empty and unresolved critical council graphs', () => {
    const emptyNamespace = councilNamespace('convergence');
    const empty = runScript('convergence', namespaceArgs(emptyNamespace));

    expect(empty.exitCode).toBe(0);
    expect(empty.json).toMatchObject({
      graph_decision: 'STOP_BLOCKED',
      graph_stop_blocked: true,
      graph_convergence_score: 0,
    });
    expect(empty.json.data).toMatchObject({
      decision: 'STOP_BLOCKED',
      readiness: 'empty',
      nodeCount: 0,
      edgeCount: 0,
    });

    const blockedNamespace = councilNamespace('convergence');
    expect(seedBlockingCouncil(blockedNamespace).exitCode).toBe(0);
    const blocked = runScript('convergence', namespaceArgs(blockedNamespace));
    expect(blocked.exitCode).toBe(0);
    expect(blocked.json.graph_decision).toBe('STOP_BLOCKED');
    expect(blocked.json.graph_blockers_json).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: 'unresolved_critical_disagreements', severity: 'blocking' }),
      ]),
    );
  });

  it('continues convergence when only non-blocking thresholds fail', () => {
    const namespace = councilNamespace('convergence');
    expect(seedContinuingCouncil(namespace).exitCode).toBe(0);

    const result = runScript('convergence', namespaceArgs(namespace));
    expect(result.exitCode).toBe(0);
    expect(result.json).toMatchObject({
      graph_decision: 'CONTINUE',
      graph_stop_blocked: false,
    });
    expect(result.json.data).toMatchObject({
      decision: 'CONTINUE',
    });
    expect(String((result.json.data as Record<string, unknown>).reason)).toContain('failing signals');
  });

  it('allows convergence when council agreement, evidence, confidence, and blockers pass', () => {
    const namespace = councilNamespace('convergence');
    expect(seedPassingCouncil(namespace).exitCode).toBe(0);

    const result = runScript('convergence', [
      ...namespaceArgs(namespace),
      '--round-id',
      'round-001',
      '--persist-snapshot',
      'true',
    ]);

    expect(result.exitCode).toBe(0);
    expect(result.json).toMatchObject({
      graph_decision: 'STOP_ALLOWED',
      graph_stop_blocked: false,
    });
    expect(result.json.data).toMatchObject({
      decision: 'STOP_ALLOWED',
      snapshotPersistence: 'persisted',
    });
    expect(result.json.graph_signals_json).toMatchObject({
      agreementRatio: 1,
      unresolvedCriticalDisagreements: 0,
    });
  });

  it('preserves structured exit codes for council script errors', () => {
    const namespace = uniqueNamespace('upsert', 'council');
    const missingArgs = runScript('upsert', ['--loop-type', 'council']);
    expect(missingArgs.exitCode).toBe(3);
    expect(missingArgs.json).toMatchObject({ status: 'error', code: 'INPUT_VALIDATION' });

    const dbFault = runScript('status', namespaceArgs(namespace), {
      env: { ...process.env, DEEP_LOOP_TEST_FAULT: 'db' },
    });
    expect(dbFault.exitCode).toBe(2);
    expect(dbFault.json).toMatchObject({ status: 'error', code: 'DB_ERROR' });

    const scriptFault = runScript('query', [
      ...namespaceArgs(namespace),
      '--query-type',
      'hot_nodes',
    ], {
      env: { ...process.env, DEEP_LOOP_TEST_FAULT: 'script' },
    });
    expect(scriptFault.exitCode).toBe(1);
    expect(scriptFault.json).toMatchObject({ status: 'error', code: 'SCRIPT_ERROR' });
    expect(JSON.parse(scriptFault.stderr)).toMatchObject({ error: expect.stringContaining('Injected script fault') });
  });
});

import { afterEach, describe, expect, it } from 'vitest';

import { createRequire } from 'node:module';

import {
  computeContextSignalsFromData,
  computeResearchClaimVerificationRateFromData,
  computeResearchContradictionDensityFromData,
  computeResearchEvidenceDepthFromData,
  computeResearchQuestionCoverageFromData,
  computeResearchSourceDiversityFromData,
} from '../../lib/coverage-graph/coverage-graph-signals.js';
import {
  cleanupNamespace,
  namespaceArgs,
  runScript,
  seedReviewNode,
  uniqueNamespace,
  type ScriptNamespace,
} from '../helpers/spawn-cjs';

const requireCjs = createRequire(import.meta.url);
const namespaces: ScriptNamespace[] = [];

const { CONVERGENCE_PROFILE_SCHEMA } = requireCjs('../../scripts/convergence.cjs') as {
  CONVERGENCE_PROFILE_SCHEMA: Record<string, unknown>;
};

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

function seedConvergedContextGraph(namespace: ScriptNamespace) {
  return runScript('upsert', [
    ...namespaceArgs(namespace),
    '--nodes',
    JSON.stringify([
      { id: 'slice-1', kind: 'SLICE', name: 'Auth surface' },
      { id: 'file-1', kind: 'FILE', name: 'auth.ts' },
      { id: 'symbol-1', kind: 'SYMBOL', name: 'loadUser' },
      { id: 'dependency-1', kind: 'DEPENDENCY', name: 'session-store' },
      { id: 'reuse-1', kind: 'REUSE_CANDIDATE', name: 'Existing loader', metadata: { relevance: 0.8, confirmations: 2 } },
      { id: 'pattern-1', kind: 'PATTERN', name: 'Reuse pattern', metadata: { relevance: 0.7, confirmations: 2 } },
    ]),
    '--edges',
    JSON.stringify([
      { id: 'covered-by-1', sourceId: 'slice-1', targetId: 'file-1', relation: 'COVERED_BY' },
      { id: 'depends-on-1', sourceId: 'symbol-1', targetId: 'dependency-1', relation: 'DEPENDS_ON' },
    ]),
  ]);
}

function seedPassingCouncilGraph(namespace: ScriptNamespace) {
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

function uniqueContextNamespace(): ScriptNamespace {
  return { ...uniqueNamespace('convergence'), loopType: 'context' } as unknown as ScriptNamespace;
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

describe('convergence profile parity pins', () => {
  it('exports the shared profile schema without running the CLI', () => {
    expect(CONVERGENCE_PROFILE_SCHEMA).toEqual({
      threshold: 'number',
      weight: 'number',
      role: ['weighted', 'blocking_guard', 'weighted_guard'],
      direction: ['gte', 'lte', 'eq'],
      normalizer: ['identity', 'clamp01', 'inverseClamp01', 'capRatio', 'presence'],
    });
  });

  it('pins coverage graph threshold traces for research, review, and context loops', () => {
    const research = uniqueNamespace('convergence', 'research');
    const review = uniqueNamespace('convergence', 'review');
    const context = uniqueContextNamespace();
    namespaces.push(research, review, context);

    expect(seedConvergedResearchGraph(research).exitCode).toBe(0);
    expect(seedReviewNode(review).exitCode).toBe(0);
    expect(seedConvergedContextGraph(context).exitCode).toBe(0);

    const researchResult = runScript('convergence', namespaceArgs(research));
    const reviewResult = runScript('convergence', namespaceArgs(review));
    const contextResult = runScript('convergence', namespaceArgs(context));

    expect(researchResult.json.graph_decision).toBe('STOP_ALLOWED');
    expect(researchResult.json.graph_convergence_score).toBe(0.86);
    expect(researchResult.json.graph_trace_json).toEqual([
      { signal: 'questionCoverage', value: 1, threshold: 0.7, passed: true, role: 'weighted' },
      { signal: 'claimVerificationRate', value: 1, threshold: 0.6, passed: true, role: 'weighted' },
      { signal: 'contradictionDensity', value: 0, threshold: 0.15, passed: true, role: 'weighted' },
      { signal: 'sourceDiversity', value: 2, threshold: 1.5, passed: true, role: 'blocking_guard' },
      { signal: 'evidenceDepth', value: 2, threshold: 1.5, passed: true, role: 'blocking_guard' },
    ]);

    expect(reviewResult.json.graph_decision).toBe('STOP_BLOCKED');
    expect(reviewResult.json.graph_convergence_score).toBe(0.4);
    expect(reviewResult.json.graph_trace_json).toEqual([
      { signal: 'dimensionCoverage', value: 0, threshold: 0.8, passed: false, role: 'blocking_guard' },
      { signal: 'findingStability', value: 0, threshold: 0.7, passed: false, role: 'weighted' },
      { signal: 'p0ResolutionRate', value: 1, threshold: 0.9, passed: true, role: 'weighted' },
      { signal: 'evidenceDensity', value: 0, threshold: 1, passed: false, role: 'weighted' },
      { signal: 'hotspotSaturation', value: 1, threshold: 0.6, passed: true, role: 'weighted' },
    ]);

    expect(contextResult.json.graph_decision).toBe('STOP_ALLOWED');
    expect(contextResult.json.graph_convergence_score).toBe(1);
    expect(contextResult.json.graph_trace_json).toEqual([
      { signal: 'sliceCoverage', value: 1, threshold: 0.7, passed: true, role: 'blocking_guard' },
      { signal: 'reuseCatalogCoverage', value: 1, threshold: 0.6, passed: true, role: 'weighted' },
      { signal: 'agreementRate', value: 1, threshold: 0.5, passed: true, role: 'blocking_guard' },
      { signal: 'relevanceFloor', value: 1, threshold: 0.5, passed: true, role: 'blocking_guard' },
      { signal: 'dependencyCompleteness', value: 1, threshold: 0.7, passed: true, role: 'weighted' },
    ]);
  });

  it('pins council threshold trace and score semantics', () => {
    const council = uniqueNamespace('convergence', 'council');
    namespaces.push(council);
    expect(seedPassingCouncilGraph(council).exitCode).toBe(0);

    const result = runScript('convergence', namespaceArgs(council));

    expect(result.json.graph_decision).toBe('STOP_ALLOWED');
    expect(result.json.graph_convergence_score).toBe(0.878);
    expect(result.json.graph_trace_json).toEqual([
      { signal: 'agreementRatio', value: 1, threshold: 0.67, passed: true },
      { signal: 'dissentDensity', value: 0, threshold: 0.25, passed: true },
      { signal: 'evidenceDepth', value: 1, threshold: 1, passed: true },
      { signal: 'unresolvedCriticalDisagreements', value: 0, threshold: 0, passed: true },
      { signal: 'decisionConfidence', value: 0.85, threshold: 0.65, passed: true },
    ]);
  });

  it('pins coverage graph signal metric semantics before profile migration', () => {
    const researchNodes = [
      { id: 'question-1', kind: 'QUESTION' },
      { id: 'finding-1', kind: 'FINDING' },
      { id: 'finding-2', kind: 'FINDING' },
      { id: 'source-1', kind: 'SOURCE', metadata: { quality_class: 'primary' } },
      { id: 'source-2', kind: 'SOURCE', metadata: { quality_class: 'secondary' } },
    ] as Parameters<typeof computeResearchQuestionCoverageFromData>[0];
    const researchEdges = [
      { id: 'answer-1', sourceId: 'finding-1', targetId: 'question-1', relation: 'ANSWERS' },
      { id: 'answer-2', sourceId: 'finding-2', targetId: 'question-1', relation: 'ANSWERS' },
      { id: 'cite-1', sourceId: 'finding-1', targetId: 'source-1', relation: 'CITES' },
      { id: 'cite-2', sourceId: 'finding-2', targetId: 'source-2', relation: 'CITES' },
    ] as Parameters<typeof computeResearchQuestionCoverageFromData>[1];
    const contextNodes = [
      { id: 'slice-1', kind: 'SLICE', metadata: {} },
      { id: 'file-1', kind: 'FILE', metadata: {} },
      { id: 'symbol-1', kind: 'SYMBOL', metadata: {} },
      { id: 'dependency-1', kind: 'DEPENDENCY', metadata: {} },
      { id: 'reuse-1', kind: 'REUSE_CANDIDATE', metadata: { relevance: 0.8, confirmations: 2 } },
      { id: 'pattern-1', kind: 'PATTERN', metadata: { relevance: 0.7, confirmations: 2 } },
    ] as Parameters<typeof computeContextSignalsFromData>[0];
    const contextEdges = [
      { relation: 'COVERED_BY', sourceId: 'slice-1', targetId: 'file-1', weight: 1 },
      { relation: 'DEPENDS_ON', sourceId: 'symbol-1', targetId: 'dependency-1', weight: 1 },
    ] as Parameters<typeof computeContextSignalsFromData>[1];

    expect({
      questionCoverage: computeResearchQuestionCoverageFromData(researchNodes, researchEdges),
      claimVerificationRate: computeResearchClaimVerificationRateFromData(researchNodes),
      contradictionDensity: computeResearchContradictionDensityFromData(researchEdges),
      sourceDiversity: computeResearchSourceDiversityFromData(researchNodes, researchEdges),
      evidenceDepth: computeResearchEvidenceDepthFromData(researchNodes, researchEdges),
    }).toEqual({
      questionCoverage: 1,
      claimVerificationRate: 1,
      contradictionDensity: 0,
      sourceDiversity: 2,
      evidenceDepth: 2,
    });
    expect(computeContextSignalsFromData(contextNodes, contextEdges)).toEqual({
      sliceCoverage: 1,
      reuseCatalogCoverage: 1,
      agreementRate: 1,
      relevanceFloor: 1,
      dependencyCompleteness: 1,
    });
  });
});

// ───────────────────────────────────────────────────────────────────
// MODULE: Convergence Script Integration Tests
// ───────────────────────────────────────────────────────────────────

import { afterEach, describe, expect, it } from 'vitest';

import { createRequire } from 'node:module';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

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
  createHermeticEnv,
  namespaceArgs,
  recordScriptRun,
  replayScriptRun,
  runScript,
  runtimeRoot,
  seedReviewNode,
  uniqueNamespace,
  type RunScriptOptions,
  type ScriptNamespace,
} from '../helpers/spawn-cjs';

const requireCjs = createRequire(import.meta.url);
const namespaces: ScriptNamespace[] = [];
const convergenceScript = resolve(runtimeRoot, 'scripts', 'convergence.cjs');

const { CONVERGENCE_PROFILE_SCHEMA } = requireCjs('../../scripts/convergence.cjs') as {
  CONVERGENCE_PROFILE_SCHEMA: Record<string, unknown>;
};

function seedConvergedResearchGraph(namespace: ScriptNamespace, options: RunScriptOptions = {}) {
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
  ], options);
}

function seedObservationThresholdResearchGraph(namespace: ScriptNamespace, observations: number) {
  return runScript('upsert', [
    ...namespaceArgs(namespace),
    '--nodes',
    JSON.stringify([
      { id: 'question-1', kind: 'QUESTION', name: 'Main question' },
      { id: 'finding-1', kind: 'FINDING', name: 'Repeated answer', metadata: { observations } },
      { id: 'finding-2', kind: 'FINDING', name: 'Second answer', metadata: { observations: 1 } },
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

function addReviewFinding(namespace: ScriptNamespace) {
  return runScript('upsert', [
    ...namespaceArgs(namespace),
    '--nodes',
    JSON.stringify([
      { id: 'finding-1', kind: 'FINDING', name: 'Stable finding' },
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

  it('emits null score delta before a prior snapshot exists', () => {
    const namespace = uniqueNamespace('convergence');
    namespaces.push(namespace);
    expect(seedReviewNode(namespace).exitCode).toBe(0);

    const result = runScript('convergence', namespaceArgs(namespace));
    const data = result.json.data as Record<string, unknown>;

    expect(result.exitCode).toBe(0);
    expect(data.scoreDelta).toBeNull();
    expect(data.scoreDeltaNote).toBe('no prior snapshot');
    expect(data).not.toHaveProperty('improvementEffect');
    expect(result.json.graph_score_delta).toBeNull();
  });

  it('emits score delta from the latest prior snapshot and gates improvement effect output', () => {
    const namespace = uniqueNamespace('convergence');
    namespaces.push(namespace);
    expect(seedReviewNode(namespace).exitCode).toBe(0);
    expect(runScript('convergence', [...namespaceArgs(namespace), '--persist-snapshot', '--iteration', '1']).exitCode).toBe(0);
    expect(addReviewFinding(namespace).exitCode).toBe(0);

    const baseResult = runScript('convergence', namespaceArgs(namespace));
    const baseData = baseResult.json.data as Record<string, unknown>;

    expect(baseResult.exitCode).toBe(0);
    expect(baseData.scoreDelta).toBe(0.2);
    expect(baseData.scoreDeltaNote).toBe('prior snapshot compared');
    expect(baseData).not.toHaveProperty('improvementEffect');
    expect(baseResult.json.graph_score_delta).toBe(0.2);

    const tracedResult = runScript('convergence', [...namespaceArgs(namespace), '--trace-improvement-effect']);
    const tracedData = tracedResult.json.data as {
      scoreDelta: number;
      improvementEffect: Record<string, unknown>;
    };

    expect(tracedResult.exitCode).toBe(0);
    expect(tracedData.scoreDelta).toBe(0.2);
    expect(tracedData.improvementEffect).toMatchObject({
      latestDelta: 0.2,
      sampleCount: 1,
      helped: 1,
      hurt: 0,
      flat: 0,
      averageDelta: 0.2,
    });
    expect(tracedResult.json.graph_improvement_effect_json).toMatchObject(tracedData.improvementEffect);
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

  it('accepts divergent mode while preserving existing convergence decisions', () => {
    const namespace = uniqueNamespace('convergence', 'research');
    namespaces.push(namespace);
    expect(seedConvergedResearchGraph(namespace).exitCode).toBe(0);

    const results = new Map([
      ['default', runScript('convergence', namespaceArgs(namespace))],
      ['off', runScript('convergence', [...namespaceArgs(namespace), '--convergence-mode', 'off'])],
      ['sliding-window', runScript('convergence', [...namespaceArgs(namespace), '--convergence-mode', 'sliding-window'])],
      ['divergent', runScript('convergence', [...namespaceArgs(namespace), '--convergence-mode', 'divergent'])],
    ]);
    const decisionEnvelope = (result: ReturnType<typeof runScript>) => ({
      decision: result.json.graph_decision,
      reason: (result.json.data as Record<string, unknown>).reason,
      score: result.json.graph_convergence_score,
      blockers: result.json.graph_blockers_json,
      trace: result.json.graph_trace_json,
    });
    const defaultEnvelope = decisionEnvelope(results.get('default')!);

    for (const result of results.values()) {
      expect(result.exitCode).toBe(0);
      expect(decisionEnvelope(result)).toEqual(defaultEnvelope);
    }
    expect(defaultEnvelope.decision).toBe('STOP_ALLOWED');
    expect(results.get('divergent')!.json.data).toMatchObject({ convergenceMode: 'divergent' });
    expect(results.get('default')!.json.data).not.toHaveProperty('convergenceMode');
    expect(results.get('off')!.json.data).not.toHaveProperty('convergenceMode');
    expect(results.get('sliding-window')!.json.data).not.toHaveProperty('convergenceMode');
  });

  it('keeps divergent CONTINUE and STOP_BLOCKED decisions identical to existing modes', () => {
    const emptyResearch = uniqueNamespace('convergence', 'research');
    const blockedReview = uniqueNamespace('convergence', 'review');
    namespaces.push(emptyResearch, blockedReview);
    expect(seedReviewNode(blockedReview).exitCode).toBe(0);

    const decisionEnvelope = (result: ReturnType<typeof runScript>) => ({
      decision: result.json.graph_decision,
      reason: (result.json.data as Record<string, unknown>).reason,
      score: result.json.graph_convergence_score,
      signals: result.json.graph_signals_json,
      blockers: result.json.graph_blockers_json,
      trace: result.json.graph_trace_json,
      stopBlocked: result.json.graph_stop_blocked,
    });
    const modes = ['default', 'off', 'sliding-window', 'divergent'] as const;

    for (const [namespace, expectedDecision] of [
      [emptyResearch, 'CONTINUE'],
      [blockedReview, 'STOP_BLOCKED'],
    ] as const) {
      const results = modes.map((mode) => runScript('convergence', [
        ...namespaceArgs(namespace),
        '--convergence-mode',
        mode,
      ]));
      const defaultEnvelope = decisionEnvelope(results[0]);

      for (const result of results) {
        expect(result.exitCode).toBe(0);
        expect(decisionEnvelope(result)).toEqual(defaultEnvelope);
      }
      expect(defaultEnvelope.decision).toBe(expectedDecision);
      expect(results[3].json.data).toMatchObject({ convergenceMode: 'divergent' });
    }
  });

  it('blocks research STOP under an explicit observation threshold until the leading finding is confirmed enough times', () => {
    const namespace = uniqueNamespace('convergence', 'research');
    namespaces.push(namespace);
    expect(seedObservationThresholdResearchGraph(namespace, 2).exitCode).toBe(0);

    const blocked = runScript('convergence', [
      ...namespaceArgs(namespace),
      '--min-observations',
      '3',
    ]);
    const blockedData = blocked.json.data as {
      observationThreshold: {
        minObservations: number;
        leadingFinding: { id: string; observations: number; subThreshold: boolean };
        findings: Array<{ id: string; subThreshold: boolean }>;
      };
    };

    expect(blocked.exitCode).toBe(0);
    expect(blocked.json.graph_decision).toBe('STOP_BLOCKED');
    expect(blockedData.observationThreshold.leadingFinding).toMatchObject({
      id: 'finding-1',
      observations: 2,
      subThreshold: true,
    });
    expect(blockedData.observationThreshold.findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'finding-1', subThreshold: true }),
      ]),
    );

    expect(seedObservationThresholdResearchGraph(namespace, 3).exitCode).toBe(0);
    const allowed = runScript('convergence', [
      ...namespaceArgs(namespace),
      '--min-observations',
      '3',
    ]);

    expect(allowed.exitCode).toBe(0);
    expect(allowed.json.graph_decision).toBe('STOP_ALLOWED');
    expect(allowed.json.graph_trace_json).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ signal: 'minObservations', value: 3, threshold: 3, passed: true }),
      ]),
    );
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
  it('replays a recorded research convergence cassette against the pinned envelope', async () => {
    const hermetic = createHermeticEnv('convergence-cassette');
    try {
      const namespace: ScriptNamespace = {
        specFolder: 'specs/cassette-convergence-research',
        loopType: 'research',
        sessionId: 'session-cassette-convergence',
      };
      const args = namespaceArgs(namespace);
      const cassetteDir = join(hermetic.tmpDir, 'cassettes');
      const cassetteId = 'convergence-research-stop-allowed';

      expect(seedConvergedResearchGraph(namespace, { env: hermetic.env }).exitCode).toBe(0);

      const recorded = await recordScriptRun(convergenceScript, args, {
        cassetteDir,
        cassetteId,
        cwd: runtimeRoot,
        env: hermetic.env,
      });
      const payload = JSON.parse(recorded.cassette.envelope.stdout) as Record<string, unknown>;

      expect(recorded.result.exitCode).toBe(0);
      expect(recorded.cassette.envelope).toMatchObject({
        scriptPath: '<SCRIPT_PATH>',
        cwd: '<RUNTIME_ROOT>',
        argv: args,
        exitCode: 0,
        signal: null,
        timedOut: false,
      });
      expect(payload).toEqual({
        status: 'ok',
        data: {
          decision: 'STOP_ALLOWED',
          reason: 'All convergence signals pass thresholds; STOP is allowed pending newInfoRatio agreement.',
          score: 0.86,
          scoreDelta: null,
          scoreDeltaNote: 'no prior snapshot',
          signals: {
            questionCoverage: 1,
            claimVerificationRate: 1,
            contradictionDensity: 0,
            sourceDiversity: 2,
            evidenceDepth: 2,
            score: 0.86,
          },
          blockers: [],
          trace: [
            { signal: 'questionCoverage', value: 1, threshold: 0.7, passed: true, role: 'weighted' },
            { signal: 'claimVerificationRate', value: 1, threshold: 0.6, passed: true, role: 'weighted' },
            { signal: 'contradictionDensity', value: 0, threshold: 0.15, passed: true, role: 'weighted' },
            { signal: 'sourceDiversity', value: 2, threshold: 1.5, passed: true, role: 'blocking_guard' },
            { signal: 'evidenceDepth', value: 2, threshold: 1.5, passed: true, role: 'blocking_guard' },
          ],
          momentum: null,
          namespace,
          scopeMode: 'session',
          notes: ['Convergence signals were computed from the session-scoped subgraph only.'],
          snapshotPersistence: 'not_requested',
          nodeCount: 5,
          edgeCount: 4,
          lastIteration: null,
        },
        graph_decision: 'STOP_ALLOWED',
        graph_decision_json: '"STOP_ALLOWED"',
        graph_signals_json: {
          questionCoverage: 1,
          claimVerificationRate: 1,
          contradictionDensity: 0,
          sourceDiversity: 2,
          evidenceDepth: 2,
          score: 0.86,
        },
        graph_blockers_json: [],
        graph_blockers_csv: '',
        graph_stop_blocked: false,
        graph_trace_json: [
          { signal: 'questionCoverage', value: 1, threshold: 0.7, passed: true, role: 'weighted' },
          { signal: 'claimVerificationRate', value: 1, threshold: 0.6, passed: true, role: 'weighted' },
          { signal: 'contradictionDensity', value: 0, threshold: 0.15, passed: true, role: 'weighted' },
          { signal: 'sourceDiversity', value: 2, threshold: 1.5, passed: true, role: 'blocking_guard' },
          { signal: 'evidenceDepth', value: 2, threshold: 1.5, passed: true, role: 'blocking_guard' },
        ],
        graph_convergence_score: 0.86,
        graph_score_delta: null,
        graph_score_delta_json: 'null',
      });

      const replayedOutputs: string[] = [];
      for (let index = 0; index < 3; index += 1) {
        const replayed = await replayScriptRun(cassetteId, convergenceScript, args, {
          cassetteDir,
          cwd: runtimeRoot,
          env: hermetic.env,
        });
        expect(replayed.matches, replayed.diff.join('\n')).toBe(true);
        replayedOutputs.push(replayed.normalized.stdout);
      }

      expect(new Set(replayedOutputs).size).toBe(1);
    } finally {
      hermetic.cleanup();
    }
  });

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

describe('convergence.cjs stop-decision', () => {
  const fs = requireCjs('node:fs') as typeof import('node:fs');
  const tempDirs: string[] = [];

  type StopDecisionFixture = {
    dir: string;
    configPath: string;
    stateLogPath: string;
    registryPath: string;
  };

  function writeFixtureFiles(
    config: Record<string, unknown>,
    stateRows: Array<Record<string, unknown>>,
    registry: Record<string, unknown>,
  ): StopDecisionFixture {
    const base = fileURLToPath(new URL('../.tmp/', import.meta.url));
    fs.mkdirSync(base, { recursive: true });
    const dir = fs.mkdtempSync(join(base, 'dlr-stop-decision-'));
    tempDirs.push(dir);
    const configPath = join(dir, 'config.json');
    const stateLogPath = join(dir, 'state.jsonl');
    const registryPath = join(dir, 'registry.json');
    fs.writeFileSync(configPath, JSON.stringify(config), 'utf8');
    fs.writeFileSync(
      stateLogPath,
      stateRows.map((row) => JSON.stringify(row)).join('\n') + '\n',
      'utf8',
    );
    fs.writeFileSync(registryPath, JSON.stringify(registry), 'utf8');
    return { dir, configPath, stateLogPath, registryPath };
  }

  function researchFixture(): StopDecisionFixture {
    const ratios = [0.4, 0.3, 0.2];
    return writeFixtureFiles(
      {
        maxIterations: 10,
        minIterations: 3,
        convergenceThreshold: 0.05,
        stopPolicy: 'convergence',
        stuckThreshold: 3,
      },
      ratios.map((newInfoRatio, index) => ({
        type: 'iteration',
        iteration: index + 1,
        status: 'complete',
        newInfoRatio,
        answeredQuestions: ['q1'],
        keyQuestions: ['q1'],
      })),
      { metrics: { resolvedQuestions: 1, openQuestions: 0 } },
    );
  }

  function reviewFixture(
    extraRows: Array<Record<string, unknown>> = [],
    registryExtra: Record<string, unknown> = {},
  ): StopDecisionFixture {
    const ratios = [0.3, 0.2];
    return writeFixtureFiles(
      {
        maxIterations: 7,
        convergenceThreshold: 0.1,
        stopPolicy: 'convergence',
        stuckThreshold: 2,
        reviewDimensions: ['correctness'],
        crossReference: { core: [] },
      },
      [
        ...ratios.map((newFindingsRatio, index) => ({
          type: 'iteration',
          iteration: index + 1,
          status: 'complete',
          newFindingsRatio,
          dimensions: ['correctness'],
        })),
        ...extraRows,
      ],
      {
        dimensionCoverage: { correctness: true },
        findingsBySeverity: { P0: 0, P1: 0, P2: 0 },
        openFindings: [],
        ...registryExtra,
      },
    );
  }

  function stopDecisionArgs(
    namespace: ScriptNamespace,
    fixture: StopDecisionFixture,
    extraArgs: string[] = [],
  ): string[] {
    return [
      ...namespaceArgs(namespace),
      '--stop-decision',
      '--config-path',
      fixture.configPath,
      '--state-log',
      fixture.stateLogPath,
      '--registry-path',
      fixture.registryPath,
      ...extraArgs,
    ];
  }

  const stopDecisionKeys = [
    'decision',
    'stopReason',
    'reasonDetail',
    'weightedStopScore',
    'signals',
    'gates',
    'blockedBy',
    'graphDecision',
    'inputs',
  ];

  afterEach(() => {
    while (tempDirs.length > 0) {
      const dir = tempDirs.pop();
      if (dir) fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  it('prints the nine stop_decision fields for research', () => {
    const namespace = uniqueNamespace('convergence', 'research');
    namespaces.push(namespace);
    expect(seedConvergedResearchGraph(namespace).exitCode).toBe(0);
    const fixture = researchFixture();

    const result = runScript('convergence', stopDecisionArgs(namespace, fixture));
    const stopDecision = result.json.stop_decision as {
      inputs: {
        iterationCount: number;
        ratios: number[];
        research: {
          answeredCount: number;
          totalQuestions: number;
          answeredQuestionSourceCounts: Record<string, number>;
        };
      };
    };

    expect(result.exitCode).toBe(0);
    expect(result.json.status).toBe('ok');
    expect(Object.keys(result.json.stop_decision as Record<string, unknown>)).toEqual(
      stopDecisionKeys,
    );
    expect(stopDecision.inputs.iterationCount).toBe(3);
    expect(stopDecision.inputs.ratios).toEqual([0.4, 0.3, 0.2]);
    expect(stopDecision.inputs.research.answeredCount).toBe(1);
    expect(stopDecision.inputs.research.totalQuestions).toBe(1);
    expect(stopDecision.inputs.research.answeredQuestionSourceCounts).toEqual({
      'question-1': 2,
    });
  });

  it('prints the nine stop_decision fields for review', () => {
    const namespace = uniqueNamespace('convergence', 'review');
    namespaces.push(namespace);
    expect(seedReviewNode(namespace).exitCode).toBe(0);
    const fixture = reviewFixture();

    const result = runScript('convergence', stopDecisionArgs(namespace, fixture));
    const stopDecision = result.json.stop_decision as {
      inputs: {
        review: {
          missingDimensions: string[];
          coverageAge: number;
          activeP0: number;
        };
      };
    };

    expect(result.exitCode).toBe(0);
    expect(Object.keys(result.json.stop_decision as Record<string, unknown>)).toEqual(
      stopDecisionKeys,
    );
    expect(stopDecision.inputs.review.missingDimensions).toEqual([]);
    expect(stopDecision.inputs.review.coverageAge).toBe(1);
    expect(stopDecision.inputs.review.activeP0).toBe(0);
  });

  it('is byte-identical across two runs', () => {
    const namespace = uniqueNamespace('convergence', 'research');
    namespaces.push(namespace);
    expect(seedConvergedResearchGraph(namespace).exitCode).toBe(0);
    const fixture = researchFixture();

    const first = runScript('convergence', stopDecisionArgs(namespace, fixture));
    const second = runScript('convergence', stopDecisionArgs(namespace, fixture));

    expect(first.exitCode).toBe(0);
    expect(second.exitCode).toBe(0);
    expect(JSON.stringify(second.json.stop_decision)).toBe(
      JSON.stringify(first.json.stop_decision),
    );
  });

  it('keeps deciding on an empty graph', () => {
    const namespace = uniqueNamespace('convergence', 'research');
    namespaces.push(namespace);
    const fixture = researchFixture();

    const result = runScript('convergence', stopDecisionArgs(namespace, fixture));
    const stopDecision = result.json.stop_decision as Record<string, unknown>;

    expect(result.exitCode).toBe(0);
    expect(result.json.graph_decision).toBe('CONTINUE');
    expect(stopDecision.graphDecision).toBe('CONTINUE');
    expect(stopDecision.decision).toBe('CONTINUE');
    expect(stopDecision.stopReason).toBeNull();
    expect(stopDecision.reasonDetail).toBe('graph_convergence_continue');
  });

  it('treats a graph failure as a missing graph decision', () => {
    const namespace = uniqueNamespace('convergence', 'research');
    namespaces.push(namespace);
    expect(seedConvergedResearchGraph(namespace).exitCode).toBe(0);
    const fixture = researchFixture();

    for (const fault of ['script', 'db']) {
      const result = runScript('convergence', stopDecisionArgs(namespace, fixture), {
        env: { ...process.env, DEEP_LOOP_TEST_FAULT: fault },
      });
      const stopDecision = result.json.stop_decision as Record<string, unknown>;

      expect(result.exitCode).toBe(0);
      expect(result.json.status).toBe('ok');
      expect(result.json.graph_decision).toBeNull();
      expect(stopDecision.graphDecision).toBeNull();
      expect(stopDecision.decision).toBe('CONTINUE');
      expect(stopDecision.stopReason).toBeNull();
      expect(stopDecision.reasonDetail).toBe('graphDecisionMissing');
    }
  });

  it('stops at the cap even when the graph failed', () => {
    const namespace = uniqueNamespace('convergence', 'research');
    namespaces.push(namespace);
    expect(seedConvergedResearchGraph(namespace).exitCode).toBe(0);
    const fixture = researchFixture();

    const result = runScript(
      'convergence',
      stopDecisionArgs(namespace, fixture, ['--iteration-count', '10']),
      { env: { ...process.env, DEEP_LOOP_TEST_FAULT: 'script' } },
    );
    const stopDecision = result.json.stop_decision as Record<string, unknown>;

    expect(result.exitCode).toBe(0);
    expect(stopDecision.decision).toBe('STOP');
    expect(stopDecision.stopReason).toBe('maxIterationsReached');
  });

  it('echoes the judgment inputs and fails the replay gate', () => {
    const namespace = uniqueNamespace('convergence', 'review');
    namespaces.push(namespace);
    expect(seedReviewNode(namespace).exitCode).toBe(0);
    const fixture = reviewFixture();

    const result = runScript(
      'convergence',
      stopDecisionArgs(namespace, fixture, [
        '--security-sensitive-fix-scope',
        'true',
        '--fix-replay-required-rows',
        '2',
        '--fix-replay-passing-rows',
        '1',
      ]),
    );
    const stopDecision = result.json.stop_decision as {
      inputs: {
        review: {
          securitySensitiveFixScope: boolean;
          fixReplayRequiredRows: number;
          fixReplayPassingRows: number;
        };
      };
      gates: { fixCompletenessReplayGate: { pass: boolean } };
    };

    expect(result.exitCode).toBe(0);
    expect(stopDecision.inputs.review.securitySensitiveFixScope).toBe(true);
    expect(stopDecision.inputs.review.fixReplayRequiredRows).toBe(2);
    expect(stopDecision.inputs.review.fixReplayPassingRows).toBe(1);
    expect(stopDecision.gates.fixCompletenessReplayGate.pass).toBe(false);
  });

  it('reads the last claim adjudication event', () => {
    const namespace = uniqueNamespace('convergence', 'review');
    namespaces.push(namespace);
    expect(seedReviewNode(namespace).exitCode).toBe(0);
    const fixture = reviewFixture([
      { type: 'event', event: 'claim_adjudication', passed: false },
    ]);

    const result = runScript('convergence', stopDecisionArgs(namespace, fixture));
    const stopDecision = result.json.stop_decision as {
      inputs: { review: { lastClaimAdjudicationPassed: boolean | null } };
    };

    expect(result.exitCode).toBe(0);
    expect(stopDecision.inputs.review.lastClaimAdjudicationPassed).toBe(false);
  });

  it('fails the graphless fallback gate when a required bug class has no cited ledger row', () => {
    const namespace = uniqueNamespace('convergence', 'review');
    namespaces.push(namespace);
    expect(seedReviewNode(namespace).exitCode).toBe(0);
    const fixture = reviewFixture(
      [
        {
          type: 'iteration',
          iteration: 3,
          status: 'complete',
          newFindingsRatio: 0.1,
          dimensions: ['correctness'],
          reviewDepthSchemaVersion: 2,
          searchLedger: [
            {
              bugClass: 'injection',
              searchActions: [{ method: 'direct_read' }],
              evidenceRefs: ['src/a.ts:1'],
            },
            { bugClass: 'xss', searchActions: [{ method: 'direct_read' }], evidenceRefs: [] },
            {
              bugClass: 'race',
              searchActions: [{ method: 'guess' }],
              evidenceRefs: ['src/b.ts:2'],
            },
          ],
        },
      ],
      {
        searchCoverage: {
          requiredBugClasses: ['injection', 'xss', 'race'],
          graphCoverageMode: 'graphless_fallback',
        },
      },
    );

    const result = runScript('convergence', stopDecisionArgs(namespace, fixture));
    const stopDecision = result.json.stop_decision as {
      inputs: { review: { fallbackCoveredBugClasses: string[]; graphCoverageMode: string } };
      gates: { graphlessFallbackGate: { pass: boolean; skipped: boolean } };
    };

    expect(result.exitCode).toBe(0);
    expect(stopDecision.inputs.review.graphCoverageMode).toBe('graphless_fallback');
    expect(stopDecision.inputs.review.fallbackCoveredBugClasses).toEqual(['injection']);
    expect(stopDecision.gates.graphlessFallbackGate).toEqual({ pass: false, skipped: false });
  });

  it('exits 3 when the config file or the state log is missing', () => {
    const namespace = uniqueNamespace('convergence', 'research');
    namespaces.push(namespace);
    const fixture = researchFixture();

    const missingConfig = runScript('convergence', [
      ...namespaceArgs(namespace),
      '--stop-decision',
      '--config-path',
      join(fixture.dir, 'missing-config.json'),
      '--state-log',
      fixture.stateLogPath,
      '--registry-path',
      fixture.registryPath,
    ]);
    expect(missingConfig.exitCode).toBe(3);
    expect(missingConfig.json.status).toBe('error');

    const missingStateLog = runScript('convergence', [
      ...namespaceArgs(namespace),
      '--stop-decision',
      '--config-path',
      fixture.configPath,
      '--state-log',
      join(fixture.dir, 'missing-state.jsonl'),
      '--registry-path',
      fixture.registryPath,
    ]);
    expect(missingStateLog.exitCode).toBe(3);
    expect(missingStateLog.json.status).toBe('error');
  });

  it('exits 3 for a loop type that has no stop decision', () => {
    const namespace = uniqueContextNamespace();
    namespaces.push(namespace);
    const fixture = researchFixture();

    const result = runScript('convergence', stopDecisionArgs(namespace, fixture));

    expect(result.exitCode).toBe(3);
    expect(result.json.status).toBe('error');
  });

  it('adds nothing without the flag', () => {
    const namespace = uniqueNamespace('convergence', 'research');
    namespaces.push(namespace);
    expect(seedConvergedResearchGraph(namespace).exitCode).toBe(0);

    const result = runScript('convergence', namespaceArgs(namespace));

    expect(result.exitCode).toBe(0);
    expect('stop_decision' in result.json).toBe(false);
  });
});

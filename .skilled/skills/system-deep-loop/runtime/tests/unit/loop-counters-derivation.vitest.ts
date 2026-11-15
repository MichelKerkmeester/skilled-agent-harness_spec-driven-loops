// ───────────────────────────────────────────────────────────────────
// MODULE: Loop Counters Derivation
// ───────────────────────────────────────────────────────────────────
import { afterEach, describe, expect, it } from 'vitest';

import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  createHermeticEnv,
  namespaceArgs,
  runScript,
  uniqueNamespace,
  type HermeticEnv,
  type ScriptNamespace,
} from '../helpers/spawn-cjs';

const requireCjs = createRequire(import.meta.url);

const { reduceResearchState } = requireCjs('../../../deep-research/scripts/reduce-state.cjs') as {
  reduceResearchState: (
    specFolder: string,
    options?: { write?: boolean; lenient?: boolean },
  ) => { dashboard: string };
};

type LoopType = 'research' | 'review';

interface LoopCounters {
  stuckCount: number;
  consecutiveFailureCount: number;
}

interface StopConfig {
  maxIterations: number;
  convergenceThreshold: number;
  stuckThreshold: number;
}

interface StopDecisionInput {
  loopType: LoopType;
  iterationCount: number;
  stuckCount: number;
  consecutiveFailureCount: number;
  config: StopConfig;
  ratios: number[];
  research: Record<string, unknown> | null;
  review: Record<string, unknown> | null;
  graphDecision: string | null;
  graphBlockers: unknown[];
}

interface StopSignal {
  value: number | null;
}

interface StopSignalsResult {
  signals: Record<string, StopSignal>;
  weightedStopScore: number;
  stopCandidate: boolean;
  noProgress: boolean;
}

interface StopDecision {
  decision: string;
  stopReason: string | null;
  reasonDetail: string;
}

const {
  buildStopDecision,
  buildStopDecisionInput,
  computeStopSignals,
  deriveLoopCounters,
} = requireCjs('../../scripts/convergence.cjs') as {
  buildStopDecision: (input: StopDecisionInput) => StopDecision;
  buildStopDecisionInput: (
    args: Record<string, unknown>,
    loopType: LoopType,
    files: {
      config: Record<string, unknown>;
      registry: Record<string, unknown>;
      stateLogRows: Array<Record<string, unknown>>;
    },
    graph: Record<string, unknown> | null,
  ) => StopDecisionInput;
  computeStopSignals: (args: {
    loopType: LoopType;
    ratios: number[];
    convergenceThreshold?: number;
    coverage: Record<string, unknown>;
  }) => StopSignalsResult;
  deriveLoopCounters: (
    records: Array<Record<string, unknown>>,
    options: { loopType: LoopType; convergenceThreshold?: number },
  ) => LoopCounters;
};

describe('deriveLoopCounters', () => {
  it('returns zero counters for an empty log', () => {
    expect(deriveLoopCounters([], { loopType: 'research' })).toEqual({
      stuckCount: 0,
      consecutiveFailureCount: 0,
    });
    expect(deriveLoopCounters([], { loopType: 'review' })).toEqual({
      stuckCount: 0,
      consecutiveFailureCount: 0,
    });
  });

  it('resume: a full log and a prefix replayed with the remaining records give equal counters', () => {
    const log: Array<Record<string, unknown>> = [
      { type: 'iteration', iteration: 1, status: 'complete', newInfoRatio: 0.4 },
      { type: 'iteration', iteration: 2, status: 'complete', newInfoRatio: 0.02 },
      { type: 'iteration', iteration: 3, status: 'complete', newInfoRatio: 0.03 },
      { type: 'event', event: 'stuckRecovery' },
      { type: 'iteration', iteration: 4, status: 'complete', newInfoRatio: 0.5 },
      { type: 'iteration', iteration: 5, status: 'insight' },
      { type: 'iteration', iteration: 6, status: 'complete', newInfoRatio: 0.01 },
      { type: 'iteration', iteration: 7, status: 'error', newInfoRatio: 0 },
    ];
    const replayed = [...log.slice(0, 3), ...log.slice(3)];

    expect(deriveLoopCounters(replayed, { loopType: 'research' })).toEqual(
      deriveLoopCounters(log, { loopType: 'research' }),
    );
    expect(deriveLoopCounters(log, { loopType: 'research' })).toEqual({
      stuckCount: 1,
      consecutiveFailureCount: 1,
    });
  });

  it('stuck count is unchanged by error and timeout rows', () => {
    const counters = deriveLoopCounters(
      [
        { type: 'iteration', iteration: 1, status: 'complete', newInfoRatio: 0.01 },
        { type: 'iteration', iteration: 2, status: 'complete', newInfoRatio: 0.02 },
        { type: 'iteration', iteration: 3, status: 'error' },
        { type: 'iteration', iteration: 4, status: 'timeout' },
      ],
      { loopType: 'research' },
    );

    expect(counters).toEqual({ stuckCount: 2, consecutiveFailureCount: 2 });
  });

  it('consecutive failures: three trailing failed runs give 3', () => {
    const trailing = deriveLoopCounters(
      [
        { type: 'iteration', iteration: 1, status: 'complete', newInfoRatio: 0.4 },
        { type: 'iteration', iteration: 2, status: 'error' },
        { type: 'iteration', iteration: 3, status: 'timeout' },
        { type: 'iteration', iteration: 4, status: 'error' },
      ],
      { loopType: 'research' },
    );
    const recovered = deriveLoopCounters(
      [
        { type: 'iteration', iteration: 1, status: 'error' },
        { type: 'iteration', iteration: 2, status: 'timeout' },
        { type: 'iteration', iteration: 3, status: 'complete', newInfoRatio: 0.4 },
      ],
      { loopType: 'research' },
    );

    expect(trailing).toEqual({ stuckCount: 0, consecutiveFailureCount: 3 });
    expect(recovered).toEqual({ stuckCount: 0, consecutiveFailureCount: 0 });
  });

  it('counts a failure row appended last', () => {
    const log: Array<Record<string, unknown>> = [
      { type: 'iteration', iteration: 1, status: 'complete', newInfoRatio: 0.4 },
      { type: 'iteration', iteration: 2, status: 'error' },
    ];
    const before = deriveLoopCounters(log, { loopType: 'research' });

    log.push({ type: 'iteration', iteration: 3, status: 'error' });
    const after = deriveLoopCounters(log, { loopType: 'research' });

    expect(after.consecutiveFailureCount).toBe(before.consecutiveFailureCount + 1);
    expect(after).toEqual({ stuckCount: 0, consecutiveFailureCount: 2 });
  });

  it('recovery: a research stuckRecovery event resets the stuck count', () => {
    const counters = deriveLoopCounters(
      [
        { type: 'iteration', iteration: 1, status: 'complete', newInfoRatio: 0.01 },
        { type: 'iteration', iteration: 2, status: 'complete', newInfoRatio: 0.02 },
        { type: 'event', event: 'stuckRecovery' },
        { type: 'iteration', iteration: 3, status: 'complete', newInfoRatio: 0.03 },
      ],
      { loopType: 'research' },
    );

    expect(counters).toEqual({ stuckCount: 1, consecutiveFailureCount: 0 });
  });

  it('recovery: a review recovery event resets the stuck count', () => {
    const options = { loopType: 'review' as const };
    const lowReview = (iteration: number, newFindingsRatio: number) => ({
      type: 'iteration',
      iteration,
      status: 'complete',
      newFindingsRatio,
    });

    const eventRow = deriveLoopCounters(
      [
        lowReview(1, 0.04),
        lowReview(2, 0.03),
        { type: 'event', event: 'stuckRecovery' },
        lowReview(3, 0.02),
      ],
      options,
    );
    const stemRow = deriveLoopCounters(
      [
        lowReview(1, 0.04),
        lowReview(2, 0.03),
        { stem: 'deep_review.recovery_started' },
        lowReview(3, 0.02),
      ],
      options,
    );

    expect(eventRow).toEqual({ stuckCount: 1, consecutiveFailureCount: 0 });
    expect(stemRow).toEqual({ stuckCount: 1, consecutiveFailureCount: 0 });
  });

  it('counts a redispatched run once, by its latest row', () => {
    const counters = deriveLoopCounters(
      [
        { type: 'iteration', iteration: 1, status: 'complete', newInfoRatio: 0.4 },
        { type: 'iteration', iteration: 2, status: 'error' },
        { type: 'iteration', iteration: 2, status: 'complete', newInfoRatio: 0.4 },
      ],
      { loopType: 'research' },
    );

    expect(counters).toEqual({ stuckCount: 0, consecutiveFailureCount: 0 });
  });

  it('thought leaves both counters unchanged, insight resets the stuck count', () => {
    const log: Array<Record<string, unknown>> = [
      { type: 'iteration', iteration: 1, status: 'complete', newInfoRatio: 0.01 },
      { type: 'iteration', iteration: 2, status: 'complete', newInfoRatio: 0.02 },
      { type: 'iteration', iteration: 3, status: 'error' },
    ];

    expect(deriveLoopCounters(log, { loopType: 'research' })).toEqual({
      stuckCount: 2,
      consecutiveFailureCount: 1,
    });

    log.push({ type: 'iteration', iteration: 4, status: 'thought' });
    expect(deriveLoopCounters(log, { loopType: 'research' })).toEqual({
      stuckCount: 2,
      consecutiveFailureCount: 1,
    });

    log.push({ type: 'iteration', iteration: 5, status: 'insight' });
    expect(deriveLoopCounters(log, { loopType: 'research' })).toEqual({
      stuckCount: 0,
      consecutiveFailureCount: 0,
    });
  });

  it('review uses half the configured threshold', () => {
    const options = { loopType: 'review' as const, convergenceThreshold: 0.2 };
    const iterationRow = (newFindingsRatio: number) => ({
      type: 'iteration',
      iteration: 1,
      status: 'complete',
      newFindingsRatio,
    });

    expect(deriveLoopCounters([iterationRow(0.1)], options)).toEqual({
      stuckCount: 1,
      consecutiveFailureCount: 0,
    });
    expect(deriveLoopCounters([iterationRow(0.11)], options)).toEqual({
      stuckCount: 0,
      consecutiveFailureCount: 0,
    });
  });
});

describe('failed iterations and the stop vote', () => {
  it('four failed research iterations do not give a converged stop', () => {
    const completeRows = [0.4, 0.5, 0.6].map((newInfoRatio, index) => ({
      type: 'iteration',
      iteration: index + 1,
      status: 'complete',
      newInfoRatio,
      answeredQuestions: ['q1'],
      keyQuestions: ['q1'],
    }));
    const errorRows = [4, 5, 6, 7].map((iteration) => ({
      type: 'iteration',
      iteration,
      status: 'error',
      newInfoRatio: 0,
    }));
    const files = {
      config: { maxIterations: 20, convergenceThreshold: 0.05, stuckThreshold: 3 },
      registry: { metrics: { resolvedQuestions: 0, openQuestions: 2 } },
      stateLogRows: [...completeRows, ...errorRows],
    };

    const input = buildStopDecisionInput({}, 'research', files, {
      decision: 'STOP_ALLOWED',
      blockers: [],
    });

    expect(input.ratios).toEqual([0.4, 0.5, 0.6]);
    expect(input.consecutiveFailureCount).toBe(4);

    const decision = buildStopDecision(input);

    expect(decision.decision).toBe('STOP');
    expect(decision.stopReason).toBe('error');
    expect(decision.reasonDetail).toBe('consecutiveFailures');
    expect(decision.stopReason).not.toBe('converged');
  });

  it('review ratio signals ignore four failed iterations', () => {
    const completeRows = [0.5, 0.4, 0.45].map((newFindingsRatio, index) => ({
      type: 'iteration',
      iteration: index + 1,
      status: 'complete',
      newFindingsRatio,
      dimensions: ['correctness'],
    }));
    const errorRows = [4, 5, 6, 7].map((iteration) => ({
      type: 'iteration',
      iteration,
      status: 'error',
      newFindingsRatio: 0,
      dimensions: ['correctness'],
    }));
    const filesFor = (rows: Array<Record<string, unknown>>) => ({
      config: {
        maxIterations: 7,
        convergenceThreshold: 0.1,
        stuckThreshold: 2,
        reviewDimensions: ['correctness'],
        crossReference: { core: [] },
      },
      registry: {
        dimensionCoverage: { correctness: true },
        findingsBySeverity: { P0: 0, P1: 0, P2: 0 },
        openFindings: [],
      },
      stateLogRows: rows,
    });
    const graph = { decision: 'CONTINUE', blockers: [] };

    const withFailures = buildStopDecisionInput(
      {},
      'review',
      filesFor([...completeRows, ...errorRows]),
      graph,
    );
    const withoutFailures = buildStopDecisionInput({}, 'review', filesFor(completeRows), graph);

    expect(withFailures.ratios).toEqual(withoutFailures.ratios);

    const coverage = { covered: 1, total: 1, traceabilityCovered: true, coverageAge: 1 };
    const withSignals = computeStopSignals({
      loopType: 'review',
      ratios: withFailures.ratios,
      convergenceThreshold: 0.1,
      coverage,
    });
    const withoutSignals = computeStopSignals({
      loopType: 'review',
      ratios: withoutFailures.ratios,
      convergenceThreshold: 0.1,
      coverage,
    });

    expect(withSignals.signals.rollingAverage.value).toBe(
      withoutSignals.signals.rollingAverage.value,
    );
    expect(withSignals.signals.madNoiseFloor.value).toBe(
      withoutSignals.signals.madNoiseFloor.value,
    );
  });

  it('consecutive failures: the cap outranks the failure halt', () => {
    const decision = buildStopDecision({
      loopType: 'research',
      iterationCount: 10,
      stuckCount: 0,
      consecutiveFailureCount: 3,
      config: { maxIterations: 10, convergenceThreshold: 0.05, stuckThreshold: 3 },
      ratios: [0.4, 0.3, 0.2],
      research: {
        answeredCount: 4,
        totalQuestions: 4,
        answeredQuestionSourceCounts: null,
        iterationRecords: [],
      },
      review: null,
      graphDecision: 'STOP_ALLOWED',
      graphBlockers: [],
    });

    expect(decision.stopReason).toBe('maxIterationsReached');
  });
});

describe('convergence.cjs loop counters', () => {
  type StopDecisionFixture = {
    dir: string;
    configPath: string;
    stateLogPath: string;
    registryPath: string;
  };

  const fixtureBase = fileURLToPath(new URL('../.tmp/', import.meta.url));
  const fixtureDirs: string[] = [];

  function writeFixtureFiles(
    config: Record<string, unknown>,
    stateRows: Array<Record<string, unknown>>,
    registry: Record<string, unknown>,
  ): StopDecisionFixture {
    mkdirSync(fixtureBase, { recursive: true });
    const dir = mkdtempSync(join(fixtureBase, 'loop-counters-'));
    fixtureDirs.push(dir);
    const configPath = join(dir, 'config.json');
    const stateLogPath = join(dir, 'state.jsonl');
    const registryPath = join(dir, 'registry.json');
    writeFileSync(configPath, JSON.stringify(config), 'utf8');
    writeFileSync(
      stateLogPath,
      stateRows.map((row) => JSON.stringify(row)).join('\n') + '\n',
      'utf8',
    );
    writeFileSync(registryPath, JSON.stringify(registry), 'utf8');
    return { dir, configPath, stateLogPath, registryPath };
  }

  function researchFixture(extraRows: Array<Record<string, unknown>> = []): StopDecisionFixture {
    const ratios = [0.4, 0.3, 0.2];
    return writeFixtureFiles(
      {
        maxIterations: 10,
        minIterations: 3,
        convergenceThreshold: 0.05,
        stopPolicy: 'convergence',
        stuckThreshold: 3,
      },
      [
        ...ratios.map((newInfoRatio, index) => ({
          type: 'iteration',
          iteration: index + 1,
          status: 'complete',
          newInfoRatio,
          answeredQuestions: ['q1'],
          keyQuestions: ['q1'],
        })),
        ...extraRows,
      ],
      { metrics: { resolvedQuestions: 1, openQuestions: 0 } },
    );
  }

  function stopDecisionArgs(
    namespace: ScriptNamespace,
    fixture: StopDecisionFixture,
    stateLogPath: string = fixture.stateLogPath,
  ): string[] {
    return [
      ...namespaceArgs(namespace),
      '--stop-decision',
      '--config-path',
      fixture.configPath,
      '--state-log',
      stateLogPath,
      '--registry-path',
      fixture.registryPath,
    ];
  }

  afterEach(() => {
    while (fixtureDirs.length > 0) {
      const dir = fixtureDirs.pop();
      if (dir) rmSync(dir, { recursive: true, force: true });
    }
  });

  it('prints loop_counters_json with no graph available', () => {
    const namespace = uniqueNamespace('convergence', 'research');
    const fixture = researchFixture([
      { type: 'iteration', iteration: 4, status: 'error', newInfoRatio: 0 },
      { type: 'iteration', iteration: 5, status: 'error', newInfoRatio: 0 },
    ]);

    const result = runScript('convergence', stopDecisionArgs(namespace, fixture), {
      env: { ...process.env, DEEP_LOOP_TEST_FAULT: 'db' },
    });

    expect(result.exitCode).toBe(0);
    expect(result.json.status).toBe('ok');
    expect(result.json.loop_counters_json).toEqual({
      stuckCount: 0,
      consecutiveFailureCount: 2,
    });
  });

  it('rejects a state log path with a .. segment or outside the repository', () => {
    const namespace = uniqueNamespace('convergence', 'research');
    const fixture = researchFixture();
    const outsidePath = join(tmpdir(), 'dlr-loop-counters-outside-state.jsonl');

    const traversal = runScript(
      'convergence',
      stopDecisionArgs(namespace, fixture, '../outside/state.jsonl'),
    );

    expect(traversal.exitCode).toBe(3);
    expect(traversal.json.status).toBe('error');
    expect(String(traversal.json.error)).toContain("must not contain '..' path segments");

    const outside = runScript('convergence', stopDecisionArgs(namespace, fixture, outsidePath));

    expect(outside.exitCode).toBe(3);
    expect(outside.json.status).toBe('error');
    expect(String(outside.json.error)).toContain('must stay inside the repository root');
  });
});

describe('research dashboard', () => {
  const fixtureEnvs: HermeticEnv[] = [];

  function strategyTemplate(): string {
    return [
      '# Deep Research Strategy',
      '',
      '<!-- ANCHOR:key-questions -->',
      '## 3. KEY QUESTIONS (remaining)',
      '- [ ] What should be checked?',
      '<!-- /ANCHOR:key-questions -->',
      '',
      '<!-- ANCHOR:answered-questions -->',
      '## 6. ANSWERED QUESTIONS',
      '[None yet]',
      '<!-- /ANCHOR:answered-questions -->',
      '',
      '<!-- ANCHOR:what-worked -->',
      '## 7. WHAT WORKED',
      '[None yet]',
      '<!-- /ANCHOR:what-worked -->',
      '',
      '<!-- ANCHOR:what-failed -->',
      '## 8. WHAT FAILED',
      '[None yet]',
      '<!-- /ANCHOR:what-failed -->',
      '',
      '<!-- ANCHOR:exhausted-approaches -->',
      '## 9. EXHAUSTED APPROACHES (do not retry)',
      '[None yet]',
      '<!-- /ANCHOR:exhausted-approaches -->',
      '',
      '<!-- ANCHOR:ruled-out-directions -->',
      '## 10. RULED OUT DIRECTIONS',
      '[None yet]',
      '<!-- /ANCHOR:ruled-out-directions -->',
      '',
      '<!-- ANCHOR:carried-forward-open-questions -->',
      '## 11A. CARRIED-FORWARD OPEN QUESTIONS',
      '[None yet]',
      '<!-- /ANCHOR:carried-forward-open-questions -->',
      '',
      '<!-- ANCHOR:next-focus -->',
      '## 11. NEXT FOCUS',
      '[None yet]',
      '<!-- /ANCHOR:next-focus -->',
      '',
    ].join('\n');
  }

  function writeResearchPacket(
    rows: Array<Record<string, unknown>>,
    convergenceThreshold: number,
  ): string {
    const env = createHermeticEnv('loop-counters-dashboard');
    fixtureEnvs.push(env);
    const specFolder = join(env.tmpDir, 'spec');
    const researchDir = join(specFolder, 'research');
    mkdirSync(researchDir, { recursive: true });
    writeFileSync(join(specFolder, 'spec.md'), '# Test Packet\n', 'utf8');
    writeFileSync(
      join(researchDir, 'deep-research-config.json'),
      `${JSON.stringify({
        topic: 'Dashboard stuck count',
        createdAt: '2026-06-19T00:00:00.000Z',
        status: 'initialized',
        maxIterations: 10,
        convergenceThreshold,
        stuckThreshold: 3,
        resource_map: { emit: false },
      }, null, 2)}\n`,
      'utf8',
    );
    writeFileSync(join(researchDir, 'deep-research-strategy.md'), strategyTemplate(), 'utf8');
    writeFileSync(
      join(researchDir, 'deep-research-state.jsonl'),
      `${rows.map((row) => JSON.stringify(row)).join('\n')}\n`,
      'utf8',
    );
    return specFolder;
  }

  afterEach(() => {
    while (fixtureEnvs.length > 0) {
      const env = fixtureEnvs.pop();
      if (env) env.cleanup();
    }
  });

  it('dashboard stuck count equals the derived stuck count', () => {
    const threshold = 0.05;
    const baseRows: Array<Record<string, unknown>> = [
      { type: 'iteration', run: 1, status: 'complete', newInfoRatio: 0.5 },
      { type: 'iteration', run: 2, status: 'error', newInfoRatio: 0 },
      { type: 'iteration', run: 3, status: 'error', newInfoRatio: 0 },
      { type: 'iteration', run: 4, status: 'complete', newInfoRatio: 0.01 },
      { type: 'iteration', run: 5, status: 'complete', newInfoRatio: 0.02 },
    ];
    const recoveredRows: Array<Record<string, unknown>> = [
      ...baseRows,
      { type: 'event', event: 'stuckRecovery', mode: 'research', run: 6 },
      { type: 'iteration', run: 7, status: 'complete', newInfoRatio: 0.01 },
    ];
    const fixtures: Array<{ rows: Array<Record<string, unknown>>; expected: number }> = [
      { rows: baseRows, expected: 2 },
      { rows: recoveredRows, expected: 1 },
    ];

    for (const fixture of fixtures) {
      const specFolder = writeResearchPacket(fixture.rows, threshold);
      const result = reduceResearchState(specFolder, { write: false });
      const derived = deriveLoopCounters(fixture.rows, {
        loopType: 'research',
        convergenceThreshold: threshold,
      }).stuckCount;

      expect(derived).toBe(fixture.expected);
      expect(result.dashboard).toContain(`- Stuck count: ${derived}`);
      expect(result.dashboard).toContain(`- Stuck count: ${fixture.expected}`);
    }
  });
});

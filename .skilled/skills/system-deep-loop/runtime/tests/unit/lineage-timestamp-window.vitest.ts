// ───────────────────────────────────────────────────────────────────
// MODULE: Lineage Timestamp Window Tests
// ───────────────────────────────────────────────────────────────────

import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  DEFAULT_LINEAGE_TIMESTAMP_TOLERANCE_MS,
  checkLineageCompletion,
  checkLineageTimestampWindow,
} from '../../lib/deep-loop/lineage-timestamp-window.js';
import { gatewayAppendNodeSource } from '../helpers/gateway-backed-lineage';
import { createHermeticEnv, runtimeRoot, spawnCjs, type HermeticEnv } from '../helpers/spawn-cjs';

const tempDirs: string[] = [];
const hermeticEnvs: HermeticEnv[] = [];
const fanoutRunScript = resolve(runtimeRoot, 'scripts', 'fanout-run.cjs');

function makeTempDir(prefix: string): string {
  const dir = mkdtempSync(join(tmpdir(), prefix));
  tempDirs.push(dir);
  return dir;
}

function useHermeticEnv(testId: string): HermeticEnv {
  const hermetic = createHermeticEnv(testId);
  hermeticEnvs.push(hermetic);
  return hermetic;
}

function envWithBin(hermetic: HermeticEnv, binDir: string): NodeJS.ProcessEnv {
  return {
    ...hermetic.env,
    PATH: `${binDir}:${hermetic.env['PATH'] ?? ''}`,
  };
}

function makeBaseArtifactDir(hermetic: HermeticEnv, specFolder: string): string {
  const dir = join(hermetic.tmpDir, specFolder, 'review');
  mkdirSync(dir, { recursive: true });
  return dir;
}

function timestampRecords(timestamps: string[]): Array<Record<string, unknown>> {
  return timestamps.map((timestamp, index) => ({ type: 'iteration', iteration: index + 1, timestamp }));
}

function writeTimestampStubBinary(binDir: string, records: Array<Record<string, unknown>> | 'now'): string {
  const stubPath = join(binDir, 'opencode');
  const encodedRecords = JSON.stringify(records === 'now' ? [] : records);
  const recordsExpression = records === 'now'
    ? '[{ type: "iteration", iteration: 1, timestamp: new Date().toISOString() }]'
    : 'configuredRecords';
  writeFileSync(
    stubPath,
    [
      '#!/usr/bin/env node',
      'if (process.argv[2] === "--version") { console.log("2.3.2"); process.exit(0); }',
      'const fs = require("node:fs");',
      'const path = require("node:path");',
      'const stateDir = process.env.SPECKIT_OPENCODE_STATE_DIR;',
      'if (!stateDir) process.exit(1);',
      'const lineageDir = path.dirname(stateDir);',
      'fs.mkdirSync(lineageDir, { recursive: true });',
      `const configuredRecords = ${encodedRecords};`,
      `const records = ${recordsExpression};`,
      // A real lineage records each state row through the append gateway.
      gatewayAppendNodeSource(),
      'for (const record of records) appendThroughGateway("review", lineageDir, record);',
      'const iterationsDir = path.join(lineageDir, "iterations");',
      'fs.mkdirSync(iterationsDir, { recursive: true });',
      'for (const record of records) {',
      '  const iteration = Number(record && record.iteration);',
      '  if (record && record.type === "iteration" && Number.isFinite(iteration)) {',
      '    const fileName = `iteration-${String(iteration).padStart(3, "0")}.md`;',
      '    fs.writeFileSync(path.join(iterationsDir, fileName), "ok\\n", "utf8");',
      '  }',
      '}',
      'fs.writeFileSync(path.join(lineageDir, "review-report.md"), "ok\\n", "utf8");',
      `require(${JSON.stringify(resolve(runtimeRoot, 'tests', 'helpers', 'completed-lineage-state.cjs'))}).writeCompletedLineageState(lineageDir, ["review"]);`,
      'process.stdout.write("stub-done\\n");',
      '',
    ].join('\n'),
    { mode: 0o755 },
  );
  return stubPath;
}

function readJsonl(filePath: string): Array<Record<string, unknown>> {
  return readFileSync(filePath, 'utf8')
    .trim()
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line) as Record<string, unknown>);
}

async function runFanoutWithRecords(
  testId: string,
  records: Array<Record<string, unknown>> | 'now',
): Promise<{ baseDir: string; payload: Record<string, unknown>; resultExitCode: number | null }> {
  const binDir = makeTempDir(`lineage-timestamp-${testId}-bin-`);
  writeTimestampStubBinary(binDir, records);
  const hermetic = useHermeticEnv(testId);
  const specFolder = `specs/${testId}`;
  const baseDir = makeBaseArtifactDir(hermetic, specFolder);
  const fanoutConfig = JSON.stringify({
    executors: [{ label: 'seat-a', kind: 'cli-opencode', model: 'opencode-go/glm-5.1', count: 1 }],
    concurrency: 1,
  });

  const result = await spawnCjs(
    fanoutRunScript,
    [
      '--spec-folder',
      specFolder,
      '--loop-type',
      'review',
      '--fanout-config-json',
      fanoutConfig,
      '--base-artifact-dir',
      baseDir,
      '--only-lineage',
      'seat-a',
    ],
    {
      cwd: hermetic.tmpDir,
      env: envWithBin(hermetic, binDir),
      timeoutMs: 60_000,
    },
  );

  const payload = JSON.parse(result.stdout.split('\n').filter(Boolean).at(-1) ?? '{}') as Record<string, unknown>;
  return { baseDir, payload, resultExitCode: result.exitCode };
}

afterEach(() => {
  try {
    while (tempDirs.length > 0) {
      const dir = tempDirs.pop();
      if (dir) rmSync(dir, { recursive: true, force: true });
    }
  } finally {
    while (hermeticEnvs.length > 0) {
      hermeticEnvs.pop()?.cleanup();
    }
  }
});

describe('checkLineageTimestampWindow', () => {
  it('flags every fabricated minute-spaced pre-window record', () => {
    const fabricated = timestampRecords([
      '2026-07-02T12:01:00Z',
      '2026-07-02T12:02:00Z',
      '2026-07-02T12:03:00Z',
      '2026-07-02T12:04:00Z',
      '2026-07-02T12:05:00Z',
      '2026-07-02T12:06:00Z',
      '2026-07-02T12:07:00Z',
      '2026-07-02T12:08:00Z',
      '2026-07-02T12:09:00Z',
      '2026-07-02T12:10:00Z',
      '2026-07-02T12:11:00Z',
    ]);

    const result = checkLineageTimestampWindow(fabricated, {
      windowStart: '2026-07-02T13:15:00Z',
      windowEnd: '2026-07-02T13:49:00Z',
      toleranceMs: 0,
    });

    expect(result).toMatchObject({ anomalous: 11, untimestamped: 0, unparseable: 0, total: 11 });
    expect(result.sample).toHaveLength(5);
    expect(result.sample.every((sample) => sample.reason === 'before_window')).toBe(true);
  });

  it('keeps honest in-window and boundary-exact records clean', () => {
    const result = checkLineageTimestampWindow(timestampRecords([
      '2026-07-02T13:15:00Z',
      '2026-07-02T13:20:00Z',
      '2026-07-02T13:49:00Z',
    ]), {
      windowStart: '2026-07-02T13:15:00Z',
      windowEnd: '2026-07-02T13:49:00Z',
      toleranceMs: DEFAULT_LINEAGE_TIMESTAMP_TOLERANCE_MS,
    });

    expect(result).toMatchObject({ anomalous: 0, untimestamped: 0, unparseable: 0, total: 3 });
    expect(result.sample).toEqual([]);
  });

  it('judges the stamp a gateway-timed row claims, not the gateway time', () => {
    const result = checkLineageTimestampWindow([
      { type: 'iteration', iteration: 1, timestamp: '2026-07-02T13:20:00Z', claimedTimestamp: '2026-07-02T12:01:00Z' },
      { type: 'iteration', iteration: 2, timestamp: '2026-07-02T13:25:00Z' },
    ], {
      windowStart: '2026-07-02T13:15:00Z',
      windowEnd: '2026-07-02T13:49:00Z',
      toleranceMs: 0,
    });

    expect(result).toMatchObject({ anomalous: 1, untimestamped: 0, unparseable: 0, total: 2 });
    expect(result.sample).toEqual([
      expect.objectContaining({ index: 0, reason: 'before_window', timestamp: '2026-07-02T12:01:00Z' }),
    ]);
  });

  it('classifies unparseable timestamps as anomalous and missing timestamps as untimestamped', () => {
    const result = checkLineageTimestampWindow([
      { type: 'iteration', timestamp: 'not-a-date' },
      { type: 'event', event: 'synthesis_complete' },
    ], {
      windowStart: '2026-07-02T13:15:00Z',
      windowEnd: '2026-07-02T13:49:00Z',
      toleranceMs: 0,
    });

    expect(result).toMatchObject({ anomalous: 1, untimestamped: 1, unparseable: 1, total: 2 });
    expect(result.sample).toEqual([{ index: 0, reason: 'unparseable', timestamp: 'not-a-date' }]);
  });
});

// Rows copied from a real fan-out review: a lineage resumed after a provider failure that
// stamped its last nine iterations a minute apart, ended on a synthesis row without ever
// recording its stop gates, and stamped iteration 12 after that row and after its own exit.
const REVIEW_TERMINAL_EVENTS = ['terminal_gates'];
const RESUMED_ATTEMPT_WINDOW = { windowStart: '2026-11-19T19:06:04.000Z', windowEnd: '2026-11-19T19:25:56.000Z' };
const resumedFakeCompletionRows: Array<Record<string, unknown>> = [
  { type: 'config', timestamp: '2026-11-19T18:41:56.397Z' },
  { type: 'iteration', iteration: 1, timestamp: '2026-11-19T18:45:15.000Z' },
  { type: 'iteration', iteration: 2, timestamp: '2026-11-19T19:12:21.000Z' },
  { type: 'iteration', iteration: 3, timestamp: '2026-11-19T19:16:25.000Z' },
  { type: 'iteration', iteration: 4, timestamp: '2026-11-19T19:17:57.000Z' },
  ...[5, 6, 7, 8, 9, 10, 11, 12].map((iteration) => ({
    type: 'iteration',
    iteration,
    timestamp: `2026-11-19T19:${String(14 + iteration).padStart(2, '0')}:00.000Z`,
  })),
  { type: 'event', event: 'synthesis_incomplete', stopReason: 'converged', timestamp: '2026-11-19T19:25:13.101Z' },
];
const convergedLineageRows: Array<Record<string, unknown>> = [
  { type: 'config', timestamp: '2026-11-19T18:38:20.821Z' },
  { type: 'iteration', iteration: 1, timestamp: '2026-11-19T18:41:18.170Z' },
  { type: 'iteration', iteration: 13, timestamp: '2026-11-19T18:58:58.154Z' },
  { type: 'event', event: 'blocked_stop', timestamp: '2026-11-19T18:59:44.393Z' },
  { type: 'iteration', iteration: 14, timestamp: '2026-11-19T19:00:35.012Z' },
  { type: 'event', event: 'terminal_gates', stopReason: 'converged', timestamp: '2026-11-19T19:01:26.500Z' },
  { type: 'event', event: 'synthesis_incomplete', stopReason: 'converged', timestamp: '2026-11-19T19:02:55.192Z' },
];

describe('checkLineageCompletion', () => {
  it('passes a lineage that recorded its terminal stop row after its last iteration', () => {
    expect(checkLineageCompletion(convergedLineageRows, {
      terminalEvents: REVIEW_TERMINAL_EVENTS,
      windowStart: '2026-11-19T18:37:03.000Z',
      windowEnd: '2026-11-19T19:05:31.000Z',
    })).toEqual({ complete: true });
  });

  it('fails a lineage that ends on a synthesis row without its terminal stop row', () => {
    expect(checkLineageCompletion(resumedFakeCompletionRows, {
      terminalEvents: REVIEW_TERMINAL_EVENTS,
      ...RESUMED_ATTEMPT_WINDOW,
    })).toMatchObject({ complete: false, failure: 'no_terminal_event' });
  });

  it('passes when a model-written iteration stamp runs ahead of the terminal row that follows it in the file', () => {
    const rows = convergedLineageRows.map((row) => (row.iteration === 14
      ? { ...row, timestamp: '2026-11-19T19:01:56.500Z' }
      : row));
    expect(checkLineageCompletion(rows, {
      terminalEvents: REVIEW_TERMINAL_EVENTS,
      windowStart: '2026-11-19T18:37:03.000Z',
      windowEnd: '2026-11-19T19:05:31.000Z',
    })).toEqual({ complete: true });
  });

  it('does not place an iteration stamp without a zone designator on the host clock', () => {
    const previousTz = process.env.TZ;
    process.env.TZ = 'America/Los_Angeles';
    try {
      // The zone-less stamp below must read as after the process end on this clock.
      expect(new Date('2026-11-20T10:04:00').toISOString()).toBe('2026-11-20T18:04:00.000Z');
      const rows: Array<Record<string, unknown>> = [
        { type: 'config', timestamp: '2026-11-20T10:00:00.000Z' },
        { type: 'iteration', iteration: 1, timestamp: '2026-11-20T10:04:00' },
        { type: 'event', event: 'terminal_gates', stopReason: 'converged', timestamp: '2026-11-20T10:05:00.000Z' },
      ];
      expect(checkLineageCompletion(rows, {
        terminalEvents: REVIEW_TERMINAL_EVENTS,
        windowStart: '2026-11-20T09:59:00.000Z',
        windowEnd: '2026-11-20T10:06:00.000Z',
      })).toEqual({ complete: true });
    } finally {
      if (previousTz === undefined) delete process.env.TZ;
      else process.env.TZ = previousTz;
    }
  });

  it('fails on an iteration row that sits after the terminal row in the file, whatever its stamp', () => {
    const rows = [...convergedLineageRows];
    rows.splice(rows.length - 1, 0, { type: 'iteration', iteration: 15, timestamp: '2026-11-19T19:00:50.000Z' });
    expect(checkLineageCompletion(rows, {
      terminalEvents: REVIEW_TERMINAL_EVENTS,
      windowStart: '2026-11-19T18:37:03.000Z',
      windowEnd: '2026-11-19T19:05:31.000Z',
    })).toMatchObject({ complete: false, failure: 'iteration_after_terminal' });
  });

  it('fails on a zoned stamp beyond the process end plus tolerance, and allows one inside it', () => {
    const rows = [...resumedFakeCompletionRows];
    rows.splice(rows.length - 1, 0, { type: 'event', event: 'terminal_gates', timestamp: '2026-11-19T19:25:10.000Z' });
    // Iteration 12 is stamped 4 s after the process end: inside the tolerance.
    expect(checkLineageCompletion(rows, { terminalEvents: REVIEW_TERMINAL_EVENTS, ...RESUMED_ATTEMPT_WINDOW }))
      .toEqual({ complete: true });

    const lateRows = rows.map((row) => (row.iteration === 12
      ? { ...row, timestamp: '2026-11-19T19:28:00.000Z' }
      : row));
    const verdict = checkLineageCompletion(lateRows, { terminalEvents: REVIEW_TERMINAL_EVENTS, ...RESUMED_ATTEMPT_WINDOW });
    expect(verdict).toMatchObject({ complete: false, failure: 'stamped_after_completion' });
    expect(verdict.complete === false && verdict.detail).toContain('iteration 12');
  });

  it('fails on a claimed stamp beyond the process end even when the gateway timed the row inside it', () => {
    const rows = [...resumedFakeCompletionRows].map((row) => (row.iteration === 12
      ? { ...row, timestamp: '2026-11-19T19:25:00.000Z', claimedTimestamp: '2026-11-19T19:28:00.000Z' }
      : row));
    rows.splice(rows.length - 1, 0, { type: 'event', event: 'terminal_gates', timestamp: '2026-11-19T19:25:10.000Z' });
    const verdict = checkLineageCompletion(rows, { terminalEvents: REVIEW_TERMINAL_EVENTS, ...RESUMED_ATTEMPT_WINDOW });
    expect(verdict).toMatchObject({ complete: false, failure: 'stamped_after_completion' });
  });

  it('passes a resumed lineage whose earlier attempt left rows before the window', () => {
    const rows = resumedFakeCompletionRows
      .filter((row) => row.type !== 'event' && row.iteration !== 12)
      .concat([{ type: 'event', event: 'terminal_gates', timestamp: '2026-11-19T19:25:30.000Z' }]);
    expect(checkLineageCompletion(rows, { terminalEvents: REVIEW_TERMINAL_EVENTS, ...RESUMED_ATTEMPT_WINDOW }))
      .toEqual({ complete: true });
  });

  it('fails a resume that recorded nothing new on the earlier attempt\'s terminal row', () => {
    const rows = convergedLineageRows.slice(0, 6);
    expect(checkLineageCompletion(rows, { terminalEvents: REVIEW_TERMINAL_EVENTS, ...RESUMED_ATTEMPT_WINDOW }))
      .toMatchObject({ complete: false, failure: 'stale_terminal_event' });
  });

  it('fails a lineage that landed no iteration record', () => {
    expect(checkLineageCompletion([{ type: 'config', timestamp: '2026-11-19T19:07:00.000Z' }], {
      terminalEvents: REVIEW_TERMINAL_EVENTS,
      ...RESUMED_ATTEMPT_WINDOW,
    })).toMatchObject({ complete: false, failure: 'no_iteration_records' });
  });
});

// Two research lineages copied from a real fan-out: one converged after five iterations, one
// stopped at its ten-iteration cap. Research records no stop-check row, so the stop reason on
// its closeout row, and for a cap stop the iteration count against the cap, are the evidence.
const RESEARCH_TERMINAL_EVENTS = ['synthesis_complete', 'phase_synthesis_complete', 'synthesis'];
const RESEARCH_STOP_REASONS = Object.values(
  (createRequire(import.meta.url)('../../lib/deep-loop/lifecycle-taxonomy.cjs') as { STOP_REASONS: Record<string, string> })
    .STOP_REASONS,
);
const RESEARCH_WINDOW = { windowStart: '2026-11-20T01:21:00.000Z', windowEnd: '2026-11-20T01:38:00.000Z' };

function researchFixtureRows(label: string): Array<Record<string, unknown>> {
  const statePath = resolve(runtimeRoot, 'tests', 'fixtures', 'research-stop-evidence', label, 'deep-research-state.jsonl');
  return readFileSync(statePath, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line) as Record<string, unknown>);
}

function withTerminal(rows: Array<Record<string, unknown>>, patch: Record<string, unknown>): Array<Record<string, unknown>> {
  return rows.map((row) => (row.event === 'synthesis_complete' ? { ...row, ...patch } : row));
}

function checkResearch(rows: Array<Record<string, unknown>>, iterationCap: number | null = 10) {
  return checkLineageCompletion(rows, {
    terminalEvents: RESEARCH_TERMINAL_EVENTS,
    stopReasons: RESEARCH_STOP_REASONS,
    iterationCap,
    ...RESEARCH_WINDOW,
  });
}

describe('checkLineageCompletion — research stop evidence', () => {
  it('passes a research lineage that converged early', () => {
    expect(checkResearch(researchFixtureRows('opus'))).toEqual({ complete: true });
  });

  it('passes a research lineage that stopped at its iteration cap', () => {
    expect(checkResearch(researchFixtureRows('deepseek'))).toEqual({ complete: true });
  });

  it('fails a closeout row that names no stop reason', () => {
    const rows = researchFixtureRows('opus').map((row) => {
      if (row.event !== 'synthesis_complete') return row;
      const { stopReason: _dropped, ...rest } = row;
      return rest;
    });
    expect(checkResearch(rows)).toMatchObject({ complete: false, failure: 'missing_stop_reason' });
  });

  it('fails a closeout row whose stop reason the research workflow never writes', () => {
    expect(checkResearch(withTerminal(researchFixtureRows('opus'), { stopReason: 'legacy-blocked-stop' })))
      .toMatchObject({ complete: false, failure: 'unknown_stop_reason' });
  });

  it('fails a cap stop that recorded fewer iterations than the cap', () => {
    expect(checkResearch(withTerminal(researchFixtureRows('opus'), { stopReason: 'maxIterationsReached' })))
      .toMatchObject({ complete: false, failure: 'max_iterations_unproven' });
  });

  it('counts a cap stop by integer iteration when the leaf writes its session id in run', () => {
    const rows = researchFixtureRows('deepseek').map((row) => (row.type === 'iteration' ? { ...row, run: 'sess-abc' } : row));
    expect(checkResearch(rows)).toEqual({ complete: true });
  });

  it('fails a cap stop when the lineage has no iteration cap to check it against', () => {
    expect(checkResearch(researchFixtureRows('deepseek'), null))
      .toMatchObject({ complete: false, failure: 'max_iterations_unproven' });
  });

  it('leaves the stop reason unjudged when the caller passes no stop-reason set', () => {
    expect(checkLineageCompletion(withTerminal(researchFixtureRows('opus'), { stopReason: undefined }), {
      terminalEvents: RESEARCH_TERMINAL_EVENTS,
      ...RESEARCH_WINDOW,
    })).toEqual({ complete: true });
  });
});

describe('fanout-run timestamp anomaly emission', () => {
  it('emits a warning ledger event and summary field without changing a successful outcome', async () => {
    const fabricated = timestampRecords([
      '2000-01-01T00:01:00Z',
      '2000-01-01T00:02:00Z',
      '2000-01-01T00:03:00Z',
      '2000-01-01T00:04:00Z',
      '2000-01-01T00:05:00Z',
      '2000-01-01T00:06:00Z',
      '2000-01-01T00:07:00Z',
      '2000-01-01T00:08:00Z',
      '2000-01-01T00:09:00Z',
      '2000-01-01T00:10:00Z',
      '2000-01-01T00:11:00Z',
    ]);
    const { baseDir, payload, resultExitCode } = await runFanoutWithRecords('timestamp-anomalous', fabricated);

    expect(resultExitCode).toBe(0);
    expect(payload.summary).toMatchObject({ succeeded: 1, failed: 0, all_failed: false });
    const ledgerEvents = readJsonl(join(baseDir, 'orchestration-status.log'));
    expect(ledgerEvents.some((event) => event.event === 'retry_scheduled')).toBe(false);
    expect(ledgerEvents.filter((event) => event.event === 'timestamp_anomaly')).toEqual([
      expect.objectContaining({
        label: 'seat-a',
        status: 'warning',
        severity: 'warning',
        counts: expect.objectContaining({ anomalous: 11, untimestamped: 0, unparseable: 0, total: 12 }),
      }),
    ]);
    expect(payload.summary).toMatchObject({
      timestamp_anomalies: [
        expect.objectContaining({
          label: 'seat-a',
          counts: expect.objectContaining({ anomalous: 11, total: 12 }),
          sample: expect.arrayContaining([expect.objectContaining({ reason: 'before_window' })]),
        }),
      ],
    });
  });

  it('does not emit a ledger event or summary field when counts are zero', async () => {
    const { baseDir, payload, resultExitCode } = await runFanoutWithRecords('timestamp-clean', 'now');

    expect(resultExitCode).toBe(0);
    expect(payload.summary).toMatchObject({ succeeded: 1, failed: 0, all_failed: false });
    expect((payload.summary as Record<string, unknown>).timestamp_anomalies).toBeUndefined();
    if (existsSync(join(baseDir, 'orchestration-status.log'))) {
      const ledgerEvents = readJsonl(join(baseDir, 'orchestration-status.log'));
      expect(ledgerEvents.some((event) => event.event === 'timestamp_anomaly')).toBe(false);
    }
  });
});

// ───────────────────────────────────────────────────────────────────
// MODULE: Lineage Timestamp Window Tests
// ───────────────────────────────────────────────────────────────────

import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  DEFAULT_LINEAGE_TIMESTAMP_TOLERANCE_MS,
  checkLineageTimestampWindow,
} from '../../lib/deep-loop/lineage-timestamp-window.js';
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
      'const fs = require("node:fs");',
      'const path = require("node:path");',
      'const stateDir = process.env.SPECKIT_OPENCODE_STATE_DIR;',
      'if (!stateDir) process.exit(1);',
      'const lineageDir = path.dirname(stateDir);',
      'fs.mkdirSync(lineageDir, { recursive: true });',
      `const configuredRecords = ${encodedRecords};`,
      `const records = ${recordsExpression};`,
      'fs.writeFileSync(path.join(lineageDir, "deep-review-state.jsonl"), `${records.map((record) => JSON.stringify(record)).join("\\n")}\\n`, "utf8");',
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
    ],
    {
      cwd: hermetic.tmpDir,
      env: envWithBin(hermetic, binDir),
      timeoutMs: 15_000,
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
        counts: expect.objectContaining({ anomalous: 11, untimestamped: 0, unparseable: 0, total: 11 }),
      }),
    ]);
    expect(payload.summary).toMatchObject({
      timestamp_anomalies: [
        expect.objectContaining({
          label: 'seat-a',
          counts: expect.objectContaining({ anomalous: 11, total: 11 }),
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

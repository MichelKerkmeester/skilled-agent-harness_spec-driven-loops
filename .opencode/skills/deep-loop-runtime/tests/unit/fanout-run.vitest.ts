// ───────────────────────────────────────────────────────────────────
// MODULE: Fanout Run Unit Tests
// ───────────────────────────────────────────────────────────────────

import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawn } from 'node:child_process';

import { afterEach, describe, expect, it } from 'vitest';

import {
  createHermeticEnv,
  recordScriptRun,
  replayScriptRun,
  runtimeRoot,
  spawnCjs,
  type HermeticEnv,
  type SpawnCjsOptions,
  type SpawnCjsResult,
} from '../helpers/spawn-cjs';
import { detectSameKindFromStack } from '../../lib/deep-loop/executor-audit.js';

const tempDirs: string[] = [];
const hermeticEnvs: HermeticEnv[] = [];

type WaitCheckpointFixture = {
  status?: string;
  nextRunAt?: string | null;
  remainingDelayMs?: number | null;
};

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

function envWithBin(hermetic: HermeticEnv, binDir: string, env: NodeJS.ProcessEnv = {}): NodeJS.ProcessEnv {
  return {
    ...hermetic.env,
    ...env,
    PATH: `${binDir}:${hermetic.env['PATH'] ?? ''}`,
  };
}

function spawnFanout(
  testId: string,
  args: string[] = [],
  options: Omit<SpawnCjsOptions, 'cwd' | 'env'> & { env?: NodeJS.ProcessEnv } = {},
): Promise<{ hermetic: HermeticEnv; result: SpawnCjsResult }> {
  const hermetic = useHermeticEnv(testId);
  const { env, ...rest } = options;
  return spawnCjs(fanoutRunScript, args, {
    ...rest,
    cwd: hermetic.tmpDir,
    env: { ...hermetic.env, ...env },
  }).then((result) => ({ hermetic, result }));
}

/**
 * Write a stub binary at `binDir/{name}` that exits 0.
 * Used to simulate headless CLI executors without real API keys.
 */
function writeStubBinary(binDir: string, name: string): string {
  const stubPath = join(binDir, name);
  writeFileSync(stubPath, '#!/bin/sh\necho "stub-done"\nexit 0\n', { mode: 0o755 });
  return stubPath;
}

/**
 * Write a stub binary at `binDir/{name}` that exits with `code`.
 * Used to assert that a non-zero CLI exit is counted as a fan-out failure.
 */
function writeFailingStubBinary(binDir: string, name: string, code: number): string {
  const stubPath = join(binDir, name);
  writeFileSync(stubPath, `#!/bin/sh\necho "stub-fail"\nexit ${code}\n`, { mode: 0o755 });
  return stubPath;
}

function writeFlakySalvageMissStubBinary(binDir: string, name: string, counterPath: string): string {
  const stubPath = join(binDir, name);
  writeFileSync(
    stubPath,
    [
      '#!/bin/sh',
      `counter=${shellQuote(counterPath)}`,
      'lineage_dir=$(dirname "$SPECKIT_CODEX_STATE_DIR")',
      'if [ ! -f "$counter" ]; then',
      '  echo first > "$counter"',
      '  mkdir -p "$lineage_dir"',
      '  printf \'{"type":"iteration","iteration":1,"run":1,"status":"complete"}\\n\' > "$lineage_dir/deep-research-state.jsonl"',
      '  echo "short"',
      '  exit 1',
      'fi',
      'echo "retry-ok"',
      'exit 0',
      '',
    ].join('\n'),
    { mode: 0o755 },
  );
  return stubPath;
}

/**
 * Write a stub binary that sleeps `seconds` then exits 0.
 * Used to assert lineages run concurrently (parallel) rather than serially.
 */
function writeSleepingStubBinary(binDir: string, name: string, seconds: number): string {
  const stubPath = join(binDir, name);
  writeFileSync(stubPath, `#!/bin/sh\nsleep ${seconds}\necho "slept"\nexit 0\n`, { mode: 0o755 });
  return stubPath;
}

function writeDelayedNodeStubBinary(binDir: string, name: string, delayMs: number): string {
  const stubPath = join(binDir, name);
  writeFileSync(
    stubPath,
    [
      '#!/usr/bin/env node',
      `setTimeout(() => { console.log('delayed'); process.exit(0); }, ${delayMs});`,
      '',
    ].join('\n'),
    { mode: 0o755 },
  );
  return stubPath;
}

function shellQuote(value: string): string {
  return `'${value.replace(/'/g, "'\\''")}'`;
}

function writeMarkerSleepingStubBinary(binDir: string, name: string, seconds: number, markerPath: string): string {
  const stubPath = join(binDir, name);
  writeFileSync(
    stubPath,
    `#!/bin/sh\n: > ${shellQuote(markerPath)}\nsleep ${seconds}\necho "slept"\nexit 0\n`,
    { mode: 0o755 },
  );
  return stubPath;
}

function parseJsonFile<T>(filePath: string): T {
  return JSON.parse(readFileSync(filePath, 'utf8')) as T;
}

function waitForFile(filePath: string, timeoutMs = 5_000): Promise<void> {
  const startedAt = Date.now();
  return new Promise((resolvePromise, reject) => {
    const poll = () => {
      if (existsSync(filePath)) {
        resolvePromise();
        return;
      }
      if (Date.now() - startedAt > timeoutMs) {
        reject(new Error(`timed out waiting for ${filePath}`));
        return;
      }
      setTimeout(poll, 25);
    };
    poll();
  });
}

function waitForChild(
  child: ReturnType<typeof spawn>,
): Promise<{ exitCode: number | null; signal: NodeJS.Signals | null; stdout: string; stderr: string }> {
  let stdout = '';
  let stderr = '';
  child.stdout?.setEncoding('utf8');
  child.stderr?.setEncoding('utf8');
  child.stdout?.on('data', (chunk) => { stdout += chunk; });
  child.stderr?.on('data', (chunk) => { stderr += chunk; });
  return new Promise((resolvePromise) => {
    child.on('close', (exitCode, signal) => resolvePromise({ exitCode, signal, stdout, stderr }));
  });
}

/**
 * Write a stub binary that echoes its argv and stdin so tests can assert the
 * exact dispatched arguments and prompt text.
 */
function writeEchoStubBinary(binDir: string, name: string): string {
  const stubPath = join(binDir, name);
  writeFileSync(
    stubPath,
    '#!/bin/sh\necho "ARGV: $@"\necho "STDIN_START"\ncat\necho "STDIN_END"\nexit 0\n',
    { mode: 0o755 },
  );
  return stubPath;
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

const fanoutRunScript = resolve(runtimeRoot, 'scripts', 'fanout-run.cjs');

describe('fanout-run.cjs — module basics', () => {
  it('exits 0 and emits ok JSON when there are no CLI lineages (native-only config)', async () => {
    const baseDir = makeTempDir('fanout-run-native-');
    const nativeOnlyConfig = JSON.stringify({
      executors: [{ label: 'native-a', kind: 'native', count: 1 }],
      concurrency: 2,
    });

    const { result } = await spawnFanout('module-native', [
      '--spec-folder',
      'specs/test-fanout-run-native',
      '--loop-type',
      'research',
      '--fanout-config-json',
      nativeOnlyConfig,
      '--base-artifact-dir',
      baseDir,
    ]);

    expect(result.exitCode).toBe(0);
    const json = JSON.parse(result.stdout.split('\n').filter(Boolean).at(-1) ?? '{}') as Record<string, unknown>;
    expect(json.status).toBe('ok');
    expect(json.results).toEqual([]);

    const summary = JSON.parse(readFileSync(join(baseDir, 'orchestration-summary.json'), 'utf8')) as {
      convergence?: { status?: string; reason?: string; no_new_findings?: boolean };
      gauges?: { lag?: number; pending?: number; failed?: number };
    };
    expect(summary.convergence).toEqual({ status: 'converged', reason: 'empty_tick', no_new_findings: true });
    expect(summary.gauges).toEqual({ lag: 0, pending: 0, failed: 0 });
  });

  it('replays a native-only fanout cassette with a stable normalized run envelope', async () => {
    const hermetic = useHermeticEnv('native-cassette');
    const baseDir = makeTempDir('fanout-run-cassette-base-');
    const cassetteDir = makeTempDir('fanout-run-cassette-dir-');
    const cassetteId = 'fanout-native-empty';
    const fanoutConfig = JSON.stringify({
      executors: [{ label: 'native-a', kind: 'native', count: 1 }],
      concurrency: 2,
    });
    const args = [
      '--spec-folder',
      'specs/cassette-fanout-native',
      '--loop-type',
      'research',
      '--fanout-config-json',
      fanoutConfig,
      '--base-artifact-dir',
      baseDir,
    ];
    const options = {
      cassetteDir,
      cassetteId,
      cwd: hermetic.tmpDir,
      env: hermetic.env,
      redactions: { [baseDir]: '<BASE_ARTIFACT_DIR>' },
      timeoutMs: 15_000,
    };

    const recorded = await recordScriptRun(fanoutRunScript, args, options);
    const payload = JSON.parse(recorded.cassette.envelope.stdout) as Record<string, unknown>;

    expect(recorded.result.exitCode).toBe(0);
    expect(recorded.cassette.envelope).toMatchObject({
      scriptPath: '<SCRIPT_PATH>',
      cwd: '<CWD>',
      argv: [
        '--spec-folder',
        'specs/cassette-fanout-native',
        '--loop-type',
        'research',
        '--fanout-config-json',
        fanoutConfig,
        '--base-artifact-dir',
        '<BASE_ARTIFACT_DIR>',
      ],
      exitCode: 0,
      signal: null,
      timedOut: false,
    });
    expect(payload).toEqual({
      status: 'ok',
      message: 'no CLI lineages to spawn',
      run_id: '<RUN_ID>',
      results: [],
      summary: {
        total: 0,
        succeeded: 0,
        failed: 0,
        all_failed: false,
        gauges: { lag: 0, pending: 0, failed: 0 },
        convergence: { status: 'converged', reason: 'empty_tick', no_new_findings: true },
      },
    });

    const replayed = await replayScriptRun(cassetteId, fanoutRunScript, args, options);
    expect(replayed.matches, replayed.diff.join('\n')).toBe(true);
    expect(JSON.parse(replayed.normalized.stdout)).toEqual(payload);
  });

  it('exits 3 (INPUT_VALIDATION) when fanout-config-json is not valid JSON', async () => {
    const baseDir = makeTempDir('fanout-run-bad-json-');

    const { result } = await spawnFanout('module-bad-json', [
      '--spec-folder',
      'specs/test-fanout-run-bad-json',
      '--loop-type',
      'research',
      '--fanout-config-json',
      'NOT_JSON',
      '--base-artifact-dir',
      baseDir,
    ]);

    expect(result.exitCode).toBe(3);
  });

  it('exits 1 (SCRIPT_ERROR) when required args are missing', async () => {
    const { result } = await spawnFanout('module-missing-args', ['--loop-type', 'research']);

    expect(result.exitCode).toBe(3);
  });
});

describe('fanout-run.cjs — pool integration with stub binaries', () => {
  it('creates two isolated lineage dirs and writes orchestration summary for 2 cli-codex lineages', async () => {
    const binDir = makeTempDir('fanout-run-bin-');
    writeStubBinary(binDir, 'codex');

    const baseDir = makeTempDir('fanout-run-base-');

    const fanoutConfig = JSON.stringify({
      executors: [
        { label: 'lineage-a', kind: 'cli-codex', model: 'o4-mini', count: 1 },
        { label: 'lineage-b', kind: 'cli-codex', model: 'o4-mini', count: 1 },
      ],
      concurrency: 2,
    });

    const hermetic = useHermeticEnv('pool-two-lineages');
    const result = await spawnCjs(
      fanoutRunScript,
      [
        '--spec-folder',
        'specs/test-fanout-run-pool',
        '--loop-type',
        'research',
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

    // Lineage dirs must be distinct sub-trees of lineages/
    expect(existsSync(join(baseDir, 'lineages', 'lineage-a'))).toBe(true);
    expect(existsSync(join(baseDir, 'lineages', 'lineage-b'))).toBe(true);

    // Per-lineage state dirs must exist (prevents same-kind replica lockfile collisions)
    expect(existsSync(join(baseDir, 'lineages', 'lineage-a', '.executor-state'))).toBe(true);
    expect(existsSync(join(baseDir, 'lineages', 'lineage-b', '.executor-state'))).toBe(true);

    // Orchestration summary written
    const summaryPath = join(baseDir, 'orchestration-summary.json');
    expect(existsSync(summaryPath)).toBe(true);
    const summary = JSON.parse(readFileSync(summaryPath, 'utf8')) as Record<string, unknown>;
    expect(summary['total_cli_lineages']).toBe(2);

    // Status ledger written (JSONL events)
    const ledgerPath = join(baseDir, 'orchestration-status.log');
    expect(existsSync(ledgerPath)).toBe(true);
    const lines = readFileSync(ledgerPath, 'utf8').trim().split('\n').filter(Boolean);
    expect(lines.length).toBeGreaterThan(0);
    const firstEvent = JSON.parse(lines[0]) as Record<string, unknown>;
    expect(firstEvent['event']).toBeDefined();

    // Both stubs exit 0, so the run must report success (exit 0).
    expect(result.exitCode).toBe(0);
    expect((summary as { failed?: number }).failed).toBe(0);
    expect((summary as { succeeded?: number }).succeeded).toBe(2);
  });

  it('sets distinct SPECKIT_CODEX_STATE_DIR for each same-kind replica to prevent lockfile collisions', async () => {
    const binDir = makeTempDir('fanout-run-lock-bin-');
    // Stub codex writes the state-dir env var to stdout so we can assert distinctness
    const stubPath = join(binDir, 'codex');
    writeFileSync(
      stubPath,
      '#!/bin/sh\necho "STATE_DIR=$SPECKIT_CODEX_STATE_DIR LINEAGE_ID=$SPECKIT_FANOUT_LINEAGE_ID"\nexit 0\n',
      { mode: 0o755 },
    );

    const baseDir = makeTempDir('fanout-run-lock-base-');

    const fanoutConfig = JSON.stringify({
      executors: [
        { label: 'alpha', kind: 'cli-codex', model: 'o4-mini', count: 1 },
        { label: 'beta', kind: 'cli-codex', model: 'o4-mini', count: 1 },
      ],
      concurrency: 1,
    });

    const hermetic = useHermeticEnv('lock-state-dirs');
    await spawnCjs(
      fanoutRunScript,
      [
        '--spec-folder',
        'specs/test-fanout-run-lock',
        '--loop-type',
        'research',
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

    // Each lineage must have its own .executor-state dir (distinct paths = no collision)
    const stateAlpha = join(baseDir, 'lineages', 'alpha', '.executor-state');
    const stateBeta = join(baseDir, 'lineages', 'beta', '.executor-state');
    expect(existsSync(stateAlpha)).toBe(true);
    expect(existsSync(stateBeta)).toBe(true);
    expect(stateAlpha).not.toBe(stateBeta);
  });

  it('expands a single count>1 executor into replicas each receiving a distinct SPECKIT_CODEX_STATE_DIR', async () => {
    const binDir = makeTempDir('fanout-run-replica-bin-');
    const stubPath = join(binDir, 'codex');
    // The stub echoes the per-replica state-dir + lineage id so the test can assert
    // distinctness from captured stdout, not just dir existence.
    writeFileSync(
      stubPath,
      '#!/bin/sh\necho "STATE_DIR=$SPECKIT_CODEX_STATE_DIR LINEAGE_ID=$SPECKIT_FANOUT_LINEAGE_ID"\nexit 0\n',
      { mode: 0o755 },
    );

    const baseDir = makeTempDir('fanout-run-replica-base-');

    // A SINGLE executor with count:2 — the actual same-kind-replica path via
    // expandLineages' `${label}-${replica}` suffixing.
    const fanoutConfig = JSON.stringify({
      executors: [{ label: 'rep', kind: 'cli-codex', model: 'o4-mini', count: 2 }],
      concurrency: 1,
    });

    const hermetic = useHermeticEnv('replica-state-dirs');
    await spawnCjs(
      fanoutRunScript,
      [
        '--spec-folder',
        'specs/test-fanout-run-replica',
        '--loop-type',
        'research',
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

    // Replicas materialize as rep-1 and rep-2.
    const stateRep1 = join(baseDir, 'lineages', 'rep-1', '.executor-state');
    const stateRep2 = join(baseDir, 'lineages', 'rep-2', '.executor-state');
    expect(existsSync(stateRep1)).toBe(true);
    expect(existsSync(stateRep2)).toBe(true);
    expect(stateRep1).not.toBe(stateRep2);

    // The stub captured the env each replica actually received; the state dir each
    // saw must be distinct (this is what the older test never verified).
    const out1 = readFileSync(join(baseDir, 'lineages', 'rep-1', 'logs', 'fanout-lineage.out'), 'utf8');
    const out2 = readFileSync(join(baseDir, 'lineages', 'rep-2', 'logs', 'fanout-lineage.out'), 'utf8');
    const dir1 = /STATE_DIR=(\S+)/.exec(out1)?.[1];
    const dir2 = /STATE_DIR=(\S+)/.exec(out2)?.[1];
    expect(dir1).toBeTruthy();
    expect(dir2).toBeTruthy();
    expect(dir1).not.toBe(dir2);
    expect(out1).toContain('LINEAGE_ID=rep-1');
    expect(out2).toContain('LINEAGE_ID=rep-2');
  });
});

describe('fanout-run.cjs — non-zero CLI exit is a fan-out failure', () => {
  it('records exit 3 (all failed) when the only lineage exits non-zero', async () => {
    const binDir = makeTempDir('fanout-run-fail-bin-');
    writeFailingStubBinary(binDir, 'codex', 2);
    const baseDir = makeTempDir('fanout-run-fail-base-');

    const fanoutConfig = JSON.stringify({
      executors: [{ label: 'lineage-fail', kind: 'cli-codex', model: 'o4-mini', count: 1 }],
      concurrency: 2,
    });

    const hermetic = useHermeticEnv('fail-all');
    const result = await spawnCjs(
      fanoutRunScript,
      [
        '--spec-folder',
        'specs/test-fanout-run-fail',
        '--loop-type',
        'research',
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

    // A single lineage that exits non-zero means all-failed -> exit 3.
    expect(result.exitCode).toBe(3);
    const summary = JSON.parse(
      readFileSync(join(baseDir, 'orchestration-summary.json'), 'utf8'),
    ) as { failed?: number; succeeded?: number; all_failed?: boolean };
    expect(summary.failed).toBe(1);
    expect(summary.succeeded).toBe(0);
    expect(summary.all_failed).toBe(true);
  });

  it('retries a salvage-miss lineage once and exits ok when the retry succeeds', async () => {
    const binDir = makeTempDir('fanout-run-retry-bin-');
    const baseDir = makeTempDir('fanout-run-retry-base-');
    writeFlakySalvageMissStubBinary(binDir, 'codex', join(baseDir, 'codex.counter'));

    const fanoutConfig = JSON.stringify({
      executors: [{ label: 'flaky', kind: 'cli-codex', model: 'o4-mini', count: 1 }],
      concurrency: 1,
      maxRetries: 1,
    });

    const hermetic = useHermeticEnv('retry-salvage');
    const result = await spawnCjs(
      fanoutRunScript,
      [
        '--spec-folder',
        'specs/test-fanout-run-retry',
        '--loop-type',
        'research',
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

    expect(result.exitCode).toBe(0);
    const summary = JSON.parse(
      readFileSync(join(baseDir, 'orchestration-summary.json'), 'utf8'),
    ) as {
      failed?: number;
      succeeded?: number;
      all_failed?: boolean;
      results?: Array<{ retry_attempts?: number; status?: string }>;
    };
    expect(summary.failed).toBe(0);
    expect(summary.succeeded).toBe(1);
    expect(summary.all_failed).toBe(false);
    const payload = JSON.parse(result.stdout.split('\n').filter(Boolean).at(-1) ?? '{}') as {
      results?: Array<{ retry_attempts?: number; status?: string }>;
    };
    expect(payload.results?.[0]).toMatchObject({ status: 'fulfilled', retry_attempts: 1 });

    const ledgerLines = readFileSync(join(baseDir, 'orchestration-status.log'), 'utf8')
      .trim()
      .split('\n')
      .map((line) => JSON.parse(line) as Record<string, unknown>);
    expect(ledgerLines.filter((event) => event.event === 'retry_scheduled')).toEqual([
      expect.objectContaining({ label: 'flaky', retry_count: 1, failure_class: 'salvage_miss' }),
    ]);
  });

  it('records exit 2 (some failed) when one of two lineages exits non-zero', async () => {
    const binDir = makeTempDir('fanout-run-mixed-bin-');
    // codex stub fails; claude stub succeeds.
    writeFailingStubBinary(binDir, 'codex', 5);
    writeStubBinary(binDir, 'claude');
    const baseDir = makeTempDir('fanout-run-mixed-base-');

    const fanoutConfig = JSON.stringify({
      executors: [
        { label: 'fails', kind: 'cli-codex', model: 'o4-mini', count: 1 },
        { label: 'passes', kind: 'cli-claude-code', model: 'claude-opus-4-8', count: 1 },
      ],
      concurrency: 2,
    });

    const hermetic = useHermeticEnv('mixed-failure');
    const result = await spawnCjs(
      fanoutRunScript,
      [
        '--spec-folder',
        'specs/test-fanout-run-mixed',
        '--loop-type',
        'research',
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

    expect(result.exitCode).toBe(2);
    const summary = JSON.parse(
      readFileSync(join(baseDir, 'orchestration-summary.json'), 'utf8'),
    ) as { failed?: number; succeeded?: number; all_failed?: boolean };
    expect(summary.failed).toBe(1);
    expect(summary.succeeded).toBe(1);
    expect(summary.all_failed).toBe(false);
  });
});

describe('fanout-run.cjs — lineages run concurrently (not serialized by spawnSync)', () => {
  it('runs two ~1s lineages in roughly 1s wall-clock with concurrency 2', async () => {
    const binDir = makeTempDir('fanout-run-parallel-bin-');
    writeSleepingStubBinary(binDir, 'codex', 1);
    const baseDir = makeTempDir('fanout-run-parallel-base-');

    const fanoutConfig = JSON.stringify({
      executors: [
        { label: 'sleep-a', kind: 'cli-codex', model: 'o4-mini', count: 1 },
        { label: 'sleep-b', kind: 'cli-codex', model: 'o4-mini', count: 1 },
      ],
      concurrency: 2,
    });

    const startedAt = Date.now();
    const hermetic = useHermeticEnv('parallel-lineages');
    const result = await spawnCjs(
      fanoutRunScript,
      [
        '--spec-folder',
        'specs/test-fanout-run-parallel',
        '--loop-type',
        'research',
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
    const elapsedMs = Date.now() - startedAt;

    expect(result.exitCode).toBe(0);
    // Serial execution would take ~2s; parallel ~1s. Allow generous headroom for
    // process startup while still proving the two ~1s sleeps overlapped (< 1.9s).
    expect(elapsedMs).toBeLessThan(1900);
  });
});

describe('fanout-run.cjs — graceful self-stop', () => {
  it('writes a stopped partial orchestration summary when SIGTERM interrupts an in-flight run', async () => {
    const binDir = makeTempDir('fanout-run-stop-bin-');
    const baseDir = makeTempDir('fanout-run-stop-base-');
    const markerPath = join(baseDir, 'lineage-started.marker');
    writeMarkerSleepingStubBinary(binDir, 'codex', 10, markerPath);

    const fanoutConfig = JSON.stringify({
      executors: [{ label: 'slow', kind: 'cli-codex', model: 'o4-mini', count: 1 }],
      concurrency: 1,
    });

    const hermetic = useHermeticEnv('graceful-stop');
    const child = spawn(
      process.execPath,
      [
        fanoutRunScript,
        '--spec-folder',
        'specs/test-fanout-run-stop',
        '--loop-type',
        'research',
        '--fanout-config-json',
        fanoutConfig,
        '--base-artifact-dir',
        baseDir,
      ],
      {
        cwd: hermetic.tmpDir,
        env: envWithBin(hermetic, binDir),
        stdio: ['ignore', 'pipe', 'pipe'],
      },
    );

    let stdout = '';
    let stderr = '';
    child.stdout?.setEncoding('utf8');
    child.stderr?.setEncoding('utf8');
    child.stdout?.on('data', (chunk) => { stdout += chunk; });
    child.stderr?.on('data', (chunk) => { stderr += chunk; });
    const closed = new Promise<{ exitCode: number | null; signal: NodeJS.Signals | null }>((resolvePromise) => {
      child.on('close', (exitCode, signal) => resolvePromise({ exitCode, signal }));
    });

    await waitForFile(markerPath);
    child.kill('SIGTERM');

    const result = await closed;

    expect({ exitCode: result.exitCode, signal: result.signal, stdout, stderr }).toMatchObject({ exitCode: 143, signal: null });
    const summary = JSON.parse(readFileSync(join(baseDir, 'orchestration-summary.json'), 'utf8')) as {
      stopped?: boolean;
      stopped_signal?: string;
      status?: string;
      results?: Array<{ label: string; status: string }>;
      gauges?: { lag?: number; pending?: number; failed?: number };
    };
    expect(summary.stopped).toBe(true);
    expect(summary.stopped_signal).toBe('SIGTERM');
    expect(summary.status).toBe('partial');
    expect(summary.results).toEqual([expect.objectContaining({ label: 'slow', status: 'running' })]);
    expect(summary.gauges).toMatchObject({ failed: 0 });
  });
});

describe('fanout-run.cjs — persisted wait checkpoint', () => {
  function spawnWaitingFanout(args: {
    testId: string;
    binDir: string;
    baseDir: string;
    waitMs?: number;
  }): ReturnType<typeof spawn> {
    const fanoutConfig = JSON.stringify({
      executors: [{ label: 'delayed', kind: 'cli-codex', model: 'o4-mini', count: 1 }],
      concurrency: 1,
    });
    const hermetic = useHermeticEnv(args.testId);
    const commandArgs = [
      fanoutRunScript,
      '--spec-folder',
      `specs/${args.testId}`,
      '--loop-type',
      'research',
      '--fanout-config-json',
      fanoutConfig,
      '--base-artifact-dir',
      args.baseDir,
    ];
    if (args.waitMs !== undefined) {
      commandArgs.push('--pre-dispatch-wait-ms', String(args.waitMs));
    }
    return spawn(process.execPath, commandArgs, {
      cwd: hermetic.tmpDir,
      env: envWithBin(hermetic, args.binDir),
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  }

  it('persists a pre-dispatch checkpoint and delays lineage launch until it expires', async () => {
    const binDir = makeTempDir('fanout-run-wait-bin-');
    const baseDir = makeTempDir('fanout-run-wait-base-');
    const markerPath = join(baseDir, 'lineage-launched.marker');
    writeMarkerSleepingStubBinary(binDir, 'codex', 0, markerPath);

    const child = spawnWaitingFanout({
      testId: 'pre-dispatch-wait',
      binDir,
      baseDir,
      waitMs: 350,
    });
    const closed = waitForChild(child);
    const checkpointPath = join(baseDir, 'orchestration-wait-checkpoint.json');

    await waitForFile(checkpointPath);

    const checkpoint = parseJsonFile<WaitCheckpointFixture>(checkpointPath);
    expect(checkpoint.status).toBe('waiting');
    expect(checkpoint.nextRunAt).toEqual(expect.any(String));
    expect(Number(checkpoint.remainingDelayMs)).toBeGreaterThan(0);
    expect(existsSync(markerPath)).toBe(false);

    const result = await closed;

    expect(result.exitCode).toBe(0);
    expect(existsSync(markerPath)).toBe(true);
    const finalCheckpoint = parseJsonFile<WaitCheckpointFixture>(checkpointPath);
    expect(finalCheckpoint).toMatchObject({ status: 'idle', nextRunAt: null, remainingDelayMs: null });

    const ledgerEvents = readFileSync(join(baseDir, 'orchestration-status.log'), 'utf8')
      .trim()
      .split('\n')
      .map((line) => JSON.parse(line) as Record<string, unknown>);
    expect(ledgerEvents.map((event) => event.event)).toEqual(expect.arrayContaining([
      'wait_checkpoint_persisted',
      'wait_checkpoint_cleared',
      'started',
    ]));
  });

  it('resumes a future checkpoint before dispatching lineages', async () => {
    const binDir = makeTempDir('fanout-run-resume-wait-bin-');
    const baseDir = makeTempDir('fanout-run-resume-wait-base-');
    const markerPath = join(baseDir, 'lineage-launched.marker');
    const checkpointPath = join(baseDir, 'orchestration-wait-checkpoint.json');
    writeMarkerSleepingStubBinary(binDir, 'codex', 0, markerPath);
    writeFileSync(
      checkpointPath,
      `${JSON.stringify({
        schemaVersion: 1,
        status: 'waiting',
        nextRunAt: new Date(Date.now() + 800).toISOString(),
        remainingDelayMs: 800,
        updatedAt: new Date().toISOString(),
      })}\n`,
      'utf8',
    );

    const child = spawnWaitingFanout({
      testId: 'resume-waiting',
      binDir,
      baseDir,
    });
    const closed = waitForChild(child);

    await new Promise((resolvePromise) => setTimeout(resolvePromise, 150));
    expect(existsSync(markerPath)).toBe(false);

    const result = await closed;

    expect(result.exitCode).toBe(0);
    expect(existsSync(markerPath)).toBe(true);
    const finalCheckpoint = parseJsonFile<WaitCheckpointFixture>(checkpointPath);
    expect(finalCheckpoint).toMatchObject({ status: 'idle', nextRunAt: null, remainingDelayMs: null });

    const ledgerEvents = readFileSync(join(baseDir, 'orchestration-status.log'), 'utf8')
      .trim()
      .split('\n')
      .map((line) => JSON.parse(line) as Record<string, unknown>);
    const resumeIndex = ledgerEvents.findIndex((event) => event.event === 'resume_waiting');
    const startedIndex = ledgerEvents.findIndex((event) => event.event === 'started');
    expect(resumeIndex).toBeGreaterThanOrEqual(0);
    expect(startedIndex).toBeGreaterThan(resumeIndex);
  });

  it('migrates legacy checkpoints without wait fields to the null state', async () => {
    const binDir = makeTempDir('fanout-run-legacy-wait-bin-');
    const baseDir = makeTempDir('fanout-run-legacy-wait-base-');
    const markerPath = join(baseDir, 'lineage-launched.marker');
    const checkpointPath = join(baseDir, 'orchestration-wait-checkpoint.json');
    writeMarkerSleepingStubBinary(binDir, 'codex', 0, markerPath);
    writeFileSync(
      checkpointPath,
      `${JSON.stringify({ schemaVersion: 1, status: 'waiting', updatedAt: new Date().toISOString() })}\n`,
      'utf8',
    );

    const child = spawnWaitingFanout({
      testId: 'legacy-wait-checkpoint',
      binDir,
      baseDir,
    });
    const result = await waitForChild(child);

    expect(result.exitCode).toBe(0);
    expect(existsSync(markerPath)).toBe(true);
    const finalCheckpoint = parseJsonFile<WaitCheckpointFixture>(checkpointPath);
    expect(finalCheckpoint).toMatchObject({ status: 'idle', nextRunAt: null, remainingDelayMs: null });
  });
});

describe('fanout-run.cjs — progress heartbeat', () => {
  it('emits progress events for a long lineage when cadence is configured', async () => {
    const binDir = makeTempDir('fanout-run-progress-bin-');
    writeSleepingStubBinary(binDir, 'codex', 1);
    const baseDir = makeTempDir('fanout-run-progress-base-');

    const fanoutConfig = JSON.stringify({
      executors: [{ label: 'slow', kind: 'cli-codex', model: 'o4-mini', count: 1 }],
      concurrency: 1,
      progressHeartbeatSeconds: 0.05,
    });

    const hermetic = useHermeticEnv('progress-enabled');
    const result = await spawnCjs(
      fanoutRunScript,
      [
        '--spec-folder',
        'specs/test-fanout-run-progress',
        '--loop-type',
        'research',
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

    expect(result.exitCode).toBe(0);
    const ledgerEvents = readFileSync(join(baseDir, 'orchestration-status.log'), 'utf8')
      .trim()
      .split('\n')
      .map((line) => JSON.parse(line) as Record<string, unknown>);
    const progressEvents = ledgerEvents.filter((event) => event.event === 'progress');
    expect(progressEvents.length).toBeGreaterThan(0);
    expect(progressEvents[0]).toEqual(expect.objectContaining({
      label: 'slow',
      duration_ms: expect.any(Number),
      gauges: expect.objectContaining({ lag: 1, pending: 0, failed: 0 }),
    }));
  });

  it('does not emit progress events when cadence is left disabled', async () => {
    const binDir = makeTempDir('fanout-run-progress-disabled-bin-');
    writeSleepingStubBinary(binDir, 'codex', 1);
    const baseDir = makeTempDir('fanout-run-progress-disabled-base-');

    const fanoutConfig = JSON.stringify({
      executors: [{ label: 'slow', kind: 'cli-codex', model: 'o4-mini', count: 1 }],
      concurrency: 1,
    });

    const hermetic = useHermeticEnv('progress-disabled');
    const result = await spawnCjs(
      fanoutRunScript,
      [
        '--spec-folder',
        'specs/test-fanout-run-progress-disabled',
        '--loop-type',
        'research',
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

    expect(result.exitCode).toBe(0);
    const ledgerEvents = readFileSync(join(baseDir, 'orchestration-status.log'), 'utf8')
      .trim()
      .split('\n')
      .map((line) => JSON.parse(line) as Record<string, unknown>);
    expect(ledgerEvents.some((event) => event.event === 'progress')).toBe(false);
  });
});

describe('fanout-run.cjs — slot overrun accounting', () => {
  it('records skippedCount 0 and slotDurationMs for a fast completed lineage', async () => {
    const binDir = makeTempDir('fanout-run-fast-slot-bin-');
    writeStubBinary(binDir, 'codex');
    const baseDir = makeTempDir('fanout-run-fast-slot-base-');

    const fanoutConfig = JSON.stringify({
      executors: [{ label: 'fast', kind: 'cli-codex', model: 'o4-mini', count: 1 }],
      concurrency: 1,
      progressHeartbeatSeconds: 1,
    });

    const hermetic = useHermeticEnv('fast-slot-accounting');
    const result = await spawnCjs(
      fanoutRunScript,
      [
        '--spec-folder',
        'specs/test-fanout-run-fast-slot',
        '--loop-type',
        'research',
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

    expect(result.exitCode).toBe(0);
    const ledgerEvents = readFileSync(join(baseDir, 'orchestration-status.log'), 'utf8')
      .trim()
      .split('\n')
      .map((line) => JSON.parse(line) as Record<string, unknown>);
    const completed = ledgerEvents.find((event) => event.event === 'completed' && event.label === 'fast');
    expect(completed).toEqual(expect.objectContaining({
      skippedCount: 0,
      slotDurationMs: expect.any(Number),
    }));
    expect(Number(completed?.slotDurationMs)).toBeGreaterThan(0);
  });

  it('records missed fixed-rate slots without launching catch-up lineages', async () => {
    const binDir = makeTempDir('fanout-run-overrun-slot-bin-');
    writeDelayedNodeStubBinary(binDir, 'codex', 3_100);
    const baseDir = makeTempDir('fanout-run-overrun-slot-base-');

    const fanoutConfig = JSON.stringify({
      executors: [{ label: 'overrun', kind: 'cli-codex', model: 'o4-mini', count: 1 }],
      concurrency: 1,
      progressHeartbeatSeconds: 1,
    });

    const hermetic = useHermeticEnv('overrun-slot-accounting');
    const result = await spawnCjs(
      fanoutRunScript,
      [
        '--spec-folder',
        'specs/test-fanout-run-overrun-slot',
        '--loop-type',
        'research',
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

    expect(result.exitCode).toBe(0);
    const ledgerEvents = readFileSync(join(baseDir, 'orchestration-status.log'), 'utf8')
      .trim()
      .split('\n')
      .map((line) => JSON.parse(line) as Record<string, unknown>);
    const startedEvents = ledgerEvents.filter((event) => event.event === 'started' && event.label === 'overrun');
    const completedEvents = ledgerEvents.filter((event) => event.event === 'completed' && event.label === 'overrun');
    expect(startedEvents).toHaveLength(1);
    expect(completedEvents).toHaveLength(1);
    expect(completedEvents[0]).toEqual(expect.objectContaining({
      skippedCount: 2,
      slotDurationMs: expect.any(Number),
    }));
    expect(Number(completedEvents[0].slotDurationMs)).toBeGreaterThanOrEqual(3_000);

    const payload = JSON.parse(result.stdout.split('\n').filter(Boolean).at(-1) ?? '{}') as {
      results?: Array<{ output?: { skippedCount?: number; slotDurationMs?: number } }>;
    };
    expect(payload.results?.[0]?.output).toEqual(expect.objectContaining({
      skippedCount: 2,
      slotDurationMs: expect.any(Number),
    }));
  });
});

describe('fanout-run.cjs — buildLineageCommand / buildLoopPrompt via echo stub', () => {
  async function runCodexEcho(
    lineage: Record<string, unknown>,
    loopType: 'research' | 'review',
  ): Promise<{ stdout: string; baseDir: string }> {
    const binDir = makeTempDir('fanout-run-echo-bin-');
    writeEchoStubBinary(binDir, 'codex');
    const baseDir = makeTempDir('fanout-run-echo-base-');

    const fanoutConfig = JSON.stringify({
      executors: [{ ...lineage, kind: 'cli-codex', model: 'o4-mini', count: 1 }],
      concurrency: 1,
    });

    const hermetic = useHermeticEnv(`echo-${String(lineage['label'] ?? 'lineage')}`);
    await spawnCjs(
      fanoutRunScript,
      [
        '--spec-folder',
        'specs/test-fanout-run-echo',
        '--loop-type',
        loopType,
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

    const label = String(lineage['label']);
    const stdout = readFileSync(
      join(baseDir, 'lineages', label, 'logs', 'fanout-lineage.out'),
      'utf8',
    );
    return { stdout, baseDir };
  }

  it('omits service_tier from codex argv when serviceTier is unset (A4)', async () => {
    const { stdout } = await runCodexEcho({ label: 'no-tier' }, 'research');
    const argvLine = stdout.split('\n').find((l) => l.startsWith('ARGV:')) ?? '';
    expect(argvLine).not.toContain('service_tier');
  });

  it('includes service_tier=standard in codex argv when serviceTier is set (A4)', async () => {
    const { stdout } = await runCodexEcho({ label: 'with-tier', serviceTier: 'standard' }, 'research');
    const argvLine = stdout.split('\n').find((l) => l.startsWith('ARGV:')) ?? '';
    expect(argvLine).toContain('service_tier=standard');
  });

  it('adds config.maxIterations to the prompt when lineage.iterations is set (A3)', async () => {
    const { stdout } = await runCodexEcho({ label: 'capped', iterations: 4 }, 'research');
    expect(stdout).toContain('config.maxIterations: 4');
    expect(stdout).toContain('whichever comes first');
  });

  it('omits config.maxIterations from the prompt when iterations is null (A3)', async () => {
    const { stdout } = await runCodexEcho({ label: 'uncapped' }, 'research');
    expect(stdout).not.toContain('config.maxIterations');
    expect(stdout).toContain('(to convergence)');
  });
});

describe('fanout-run.cjs — recursion-guard dispatch stack (SPECKIT_CLI_DISPATCH_STACK)', () => {
  /**
   * Write a stub that echoes the dispatch-stack env var (and the per-replica
   * state-dir env) so the test can assert the spawned seat's environment.
   */
  function writeStackEchoStub(binDir: string, name: string): string {
    const stubPath = join(binDir, name);
    writeFileSync(
      stubPath,
      '#!/bin/sh\necho "DISPATCH_STACK=$SPECKIT_CLI_DISPATCH_STACK"\n'
        + 'echo "STATE_DIR=$SPECKIT_CODEX_STATE_DIR"\n'
        + 'echo "LINEAGE_ID=$SPECKIT_FANOUT_LINEAGE_ID"\nexit 0\n',
      { mode: 0o755 },
    );
    return stubPath;
  }

  async function runCodexSeat(
    parentStack: string | undefined,
  ): Promise<string> {
    const binDir = makeTempDir('fanout-run-stack-bin-');
    writeStackEchoStub(binDir, 'codex');
    const baseDir = makeTempDir('fanout-run-stack-base-');

    const fanoutConfig = JSON.stringify({
      executors: [{ label: 'seat-a', kind: 'cli-codex', model: 'o4-mini', count: 1 }],
      concurrency: 1,
    });

    const hermetic = useHermeticEnv(`stack-${parentStack ?? 'empty'}`);
    const env = envWithBin(hermetic, binDir);
    if (parentStack === undefined) {
      delete env['SPECKIT_CLI_DISPATCH_STACK'];
    } else {
      env['SPECKIT_CLI_DISPATCH_STACK'] = parentStack;
    }

    await spawnCjs(
      fanoutRunScript,
      [
        '--spec-folder',
        'specs/test-fanout-run-stack',
        '--loop-type',
        'research',
        '--fanout-config-json',
        fanoutConfig,
        '--base-artifact-dir',
        baseDir,
      ],
      { cwd: hermetic.tmpDir, env, timeoutMs: 15_000 },
    );

    return readFileSync(
      join(baseDir, 'lineages', 'seat-a', 'logs', 'fanout-lineage.out'),
      'utf8',
    );
  }

  it('stamps the dispatched CLI seat env with its kind when the parent stack is empty', async () => {
    const stdout = await runCodexSeat(undefined);
    const stackLine = stdout.split('\n').find((l) => l.startsWith('DISPATCH_STACK=')) ?? '';
    expect(stackLine).toBe('DISPATCH_STACK=cli-codex');
  });

  it('appends the kind onto an existing parent dispatch stack (cross-kind chain)', async () => {
    const stdout = await runCodexSeat('cli-opencode');
    const stackLine = stdout.split('\n').find((l) => l.startsWith('DISPATCH_STACK=')) ?? '';
    expect(stackLine).toBe('DISPATCH_STACK=cli-opencode:cli-codex');
  });

  it('preserves per-replica state-dir + lineage-id env after the dispatch-env allowlist filter', async () => {
    const stdout = await runCodexSeat(undefined);
    const stateLine = stdout.split('\n').find((l) => l.startsWith('STATE_DIR=')) ?? '';
    const lineageLine = stdout.split('\n').find((l) => l.startsWith('LINEAGE_ID=')) ?? '';
    // buildExecutorDispatchEnv strips non-allowlisted keys; these SPECKIT_* keys
    // are reapplied after the filter, so they must still reach the seat.
    expect(stateLine).toMatch(/STATE_DIR=.+\.executor-state$/);
    expect(lineageLine).toBe('LINEAGE_ID=seat-a');
  });

  it('demonstrates the guard end-to-end: the stamped kind is detected as same-kind recursion', async () => {
    // The seat env carries SPECKIT_CLI_DISPATCH_STACK=cli-codex; a nested
    // cli-codex dispatch from inside that seat would hit this exact check.
    const stdout = await runCodexSeat(undefined);
    const stackLine = stdout.split('\n').find((l) => l.startsWith('DISPATCH_STACK=')) ?? '';
    const stack = stackLine.slice('DISPATCH_STACK='.length);

    expect(detectSameKindFromStack(stack, 'cli-codex')).toBe(true);
    expect(detectSameKindFromStack(stack, 'cli-opencode')).toBe(false);
  });
});

describe('fanout-run.cjs — cli-claude-code configDir env', () => {
  function writeClaudeEnvStub(binDir: string): string {
    const stubPath = join(binDir, 'claude');
    writeFileSync(
      stubPath,
      '#!/bin/sh\necho "ARGV: $@"\necho "CLAUDE_CONFIG_DIR=$CLAUDE_CONFIG_DIR"\nexit 0\n',
      { mode: 0o755 },
    );
    return stubPath;
  }

  async function runClaudeSeat(lineage: Record<string, unknown>): Promise<{ home: string; stdout: string }> {
    const binDir = makeTempDir('fanout-run-claude-env-bin-');
    writeClaudeEnvStub(binDir);
    const baseDir = makeTempDir('fanout-run-claude-env-base-');

    const fanoutConfig = JSON.stringify({
      executors: [{ label: 'fable', kind: 'cli-claude-code', model: 'claude-fable-5', count: 1, ...lineage }],
      concurrency: 1,
    });

    const hermetic = useHermeticEnv(`claude-${String(lineage['configDir'] ?? 'default')}`);
    const env = envWithBin(hermetic, binDir);
    delete env['CLAUDE_CONFIG_DIR'];

    const result = await spawnCjs(
      fanoutRunScript,
      [
        '--spec-folder',
        'specs/test-fanout-run-claude-env',
        '--loop-type',
        'review',
        '--fanout-config-json',
        fanoutConfig,
        '--base-artifact-dir',
        baseDir,
      ],
      {
        cwd: hermetic.tmpDir,
        env,
        timeoutMs: 15_000,
      },
    );

    expect(result.exitCode).toBe(0);
    return {
      home: hermetic.home,
      stdout: readFileSync(join(baseDir, 'lineages', 'fable', 'logs', 'fanout-lineage.out'), 'utf8'),
    };
  }

  it('injects expanded CLAUDE_CONFIG_DIR for a cli-claude-code lineage with configDir', async () => {
    const { home, stdout } = await runClaudeSeat({ configDir: '~/.claude-account2' });
    expect(stdout).toContain(`CLAUDE_CONFIG_DIR=${join(home, '.claude-account2')}`);
    expect(stdout).toContain('--model claude-fable-5');
  });

  it('leaves CLAUDE_CONFIG_DIR absent when configDir is unset', async () => {
    const { stdout } = await runClaudeSeat({});
    expect(stdout).toContain('CLAUDE_CONFIG_DIR=');
    expect(stdout).not.toContain('.claude-account2');
  });
});

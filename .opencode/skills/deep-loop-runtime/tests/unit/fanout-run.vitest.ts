import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { runtimeRoot, spawnCjs } from '../helpers/spawn-cjs';
import { detectSameKindFromStack } from '../../lib/deep-loop/executor-audit.js';

const tempDirs: string[] = [];

function makeTempDir(prefix: string): string {
  const dir = mkdtempSync(join(tmpdir(), prefix));
  tempDirs.push(dir);
  return dir;
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

/**
 * Write a stub binary that sleeps `seconds` then exits 0.
 * Used to assert lineages run concurrently (parallel) rather than serially.
 */
function writeSleepingStubBinary(binDir: string, name: string, seconds: number): string {
  const stubPath = join(binDir, name);
  writeFileSync(stubPath, `#!/bin/sh\nsleep ${seconds}\necho "slept"\nexit 0\n`, { mode: 0o755 });
  return stubPath;
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
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
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

    const result = await spawnCjs(fanoutRunScript, [
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
  });

  it('exits 3 (INPUT_VALIDATION) when fanout-config-json is not valid JSON', async () => {
    const baseDir = makeTempDir('fanout-run-bad-json-');

    const result = await spawnCjs(fanoutRunScript, [
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
    const result = await spawnCjs(fanoutRunScript, ['--loop-type', 'research']);

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
        env: {
          ...process.env,
          PATH: `${binDir}:${process.env['PATH'] ?? ''}`,
        },
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
        env: {
          ...process.env,
          PATH: `${binDir}:${process.env['PATH'] ?? ''}`,
        },
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
        env: { ...process.env, PATH: `${binDir}:${process.env['PATH'] ?? ''}` },
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
        env: { ...process.env, PATH: `${binDir}:${process.env['PATH'] ?? ''}` },
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
        env: { ...process.env, PATH: `${binDir}:${process.env['PATH'] ?? ''}` },
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
        env: { ...process.env, PATH: `${binDir}:${process.env['PATH'] ?? ''}` },
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

    const env: NodeJS.ProcessEnv = {
      ...process.env,
      PATH: `${binDir}:${process.env['PATH'] ?? ''}`,
    };
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
      { env, timeoutMs: 15_000 },
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

  async function runClaudeSeat(lineage: Record<string, unknown>): Promise<string> {
    const binDir = makeTempDir('fanout-run-claude-env-bin-');
    writeClaudeEnvStub(binDir);
    const baseDir = makeTempDir('fanout-run-claude-env-base-');

    const fanoutConfig = JSON.stringify({
      executors: [{ label: 'fable', kind: 'cli-claude-code', model: 'claude-fable-5', count: 1, ...lineage }],
      concurrency: 1,
    });

    const env: NodeJS.ProcessEnv = { ...process.env, PATH: `${binDir}:${process.env['PATH'] ?? ''}` };
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
        env,
        timeoutMs: 15_000,
      },
    );

    expect(result.exitCode).toBe(0);
    return readFileSync(join(baseDir, 'lineages', 'fable', 'logs', 'fanout-lineage.out'), 'utf8');
  }

  it('injects expanded CLAUDE_CONFIG_DIR for a cli-claude-code lineage with configDir', async () => {
    const stdout = await runClaudeSeat({ configDir: '~/.claude-account2' });
    expect(stdout).toContain(`CLAUDE_CONFIG_DIR=${join(process.env['HOME'] ?? '', '.claude-account2')}`);
    expect(stdout).toContain('--model claude-fable-5');
  });

  it('leaves CLAUDE_CONFIG_DIR absent when configDir is unset', async () => {
    const stdout = await runClaudeSeat({});
    expect(stdout).toContain('CLAUDE_CONFIG_DIR=');
    expect(stdout).not.toContain('.claude-account2');
  });
});

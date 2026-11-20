// ───────────────────────────────────────────────────────────────────
// MODULE: Fan-Out Kill Semantics Tests
// ───────────────────────────────────────────────────────────────────
//
// A fan-out is a bootstrap parent, its TSX child (the runner) and one detached process
// group per lineage. These cases prove each way of ending the run reaches the lineage
// groups: a hangup on the bootstrap, a SIGKILL of the bootstrap that only the child can
// notice, and an operator's --stop issued from a second process.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawn, type ChildProcess } from 'node:child_process';

import { afterEach, describe, expect, it } from 'vitest';

import { createHermeticEnv, runtimeRoot, type HermeticEnv } from '../helpers/spawn-cjs';

const fanoutRunScript = join(runtimeRoot, 'scripts', 'fanout-run.cjs');
const OPENCODE_VERSION_PROBE = 'if [ "$1" = "--version" ]; then echo 2.3.2; exit 0; fi';
const SPEC_FOLDER = 'specs/test-fanout-stop';

const hermeticEnvs: HermeticEnv[] = [];
const ownedGroups: number[] = [];

afterEach(() => {
  while (ownedGroups.length > 0) {
    const pid = ownedGroups.pop();
    if (pid) {
      try {
        process.kill(-pid, 'SIGKILL');
      } catch {
        // Already gone.
      }
    }
  }
  while (hermeticEnvs.length > 0) hermeticEnvs.pop()?.cleanup();
});

function groupAlive(pid: number): boolean {
  try {
    process.kill(-pid, 0);
    return true;
  } catch (error) {
    return (error as NodeJS.ErrnoException).code === 'EPERM';
  }
}

async function waitFor<T>(probe: () => T | null | undefined | false, timeoutMs = 15_000): Promise<T> {
  const startedAt = Date.now();
  for (;;) {
    const value = probe();
    if (value) return value;
    if (Date.now() - startedAt > timeoutMs) throw new Error('timed out waiting for condition');
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 50));
  }
}

type LedgerRow = { event?: string; label?: string; pid?: number; signal?: string; rerun_command?: string; status?: string };

function readLedger(baseDir: string): LedgerRow[] {
  const ledgerPath = join(baseDir, 'orchestration-status.log');
  if (!existsSync(ledgerPath)) return [];
  return readFileSync(ledgerPath, 'utf8')
    .split('\n')
    .filter((line) => line.trim() !== '')
    .map((line) => JSON.parse(line) as LedgerRow);
}

type RunFixture = {
  hermetic: HermeticEnv;
  baseDir: string;
  args: string[];
  env: NodeJS.ProcessEnv;
};

function makeSleepingRun(testId: string): RunFixture {
  const hermetic = createHermeticEnv(testId);
  hermeticEnvs.push(hermetic);
  const binDir = join(hermetic.tmpDir, 'bin');
  mkdirSync(binDir, { recursive: true });
  writeFileSync(
    join(binDir, 'opencode'),
    `#!/bin/sh\n${OPENCODE_VERSION_PROBE}\nsleep 60\nexit 0\n`,
    { mode: 0o755 },
  );
  const baseDir = join(hermetic.tmpDir, SPEC_FOLDER, 'research');
  mkdirSync(baseDir, { recursive: true });
  const fanoutConfig = JSON.stringify({
    executors: [{ label: 'slow', kind: 'cli-opencode', model: 'opencode-go/glm-5.1', count: 1 }],
    concurrency: 1,
    maxRetries: 0,
  });
  return {
    hermetic,
    baseDir,
    args: [
      '--spec-folder', SPEC_FOLDER,
      '--loop-type', 'research',
      '--fanout-config-json', fanoutConfig,
      '--base-artifact-dir', baseDir,
      '--only-lineage', 'slow',
    ],
    env: { ...hermetic.env, PATH: `${binDir}:${hermetic.env['PATH'] ?? ''}` },
  };
}

function startRun(fixture: RunFixture): { child: ChildProcess; closed: Promise<{ exitCode: number | null; signal: NodeJS.Signals | null }> } {
  const child = spawn(process.execPath, [fanoutRunScript, ...fixture.args], {
    cwd: fixture.hermetic.tmpDir,
    env: fixture.env,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  child.stdout?.resume();
  child.stderr?.resume();
  const closed = new Promise<{ exitCode: number | null; signal: NodeJS.Signals | null }>((resolvePromise) => {
    child.on('close', (exitCode, signal) => resolvePromise({ exitCode, signal }));
  });
  return { child, closed };
}

async function waitForSpawnedLineage(baseDir: string): Promise<number> {
  const pid = await waitFor(() => readLedger(baseDir).find((row) => row.event === 'spawned')?.pid);
  ownedGroups.push(pid);
  return pid;
}

function runStop(fixture: RunFixture, extraArgs: string[] = []): Promise<{ exitCode: number | null; stdout: string }> {
  const child = spawn(process.execPath, [fanoutRunScript, ...fixture.args, ...extraArgs, '--stop'], {
    cwd: fixture.hermetic.tmpDir,
    env: fixture.env,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let stdout = '';
  child.stdout?.setEncoding('utf8');
  child.stdout?.on('data', (chunk) => { stdout += chunk; });
  child.stderr?.resume();
  return new Promise((resolvePromise) => {
    child.on('close', (exitCode) => resolvePromise({ exitCode, stdout }));
  });
}

describe('fanout-run.cjs — kill semantics', () => {
  it('stops its lineages and exits 129 when the bootstrap gets SIGHUP', async () => {
    const fixture = makeSleepingRun('fanout-stop-sighup');
    const { child, closed } = startRun(fixture);
    const lineagePid = await waitForSpawnedLineage(fixture.baseDir);

    child.kill('SIGHUP');
    const result = await closed;

    expect(result).toEqual({ exitCode: 129, signal: null });
    await waitFor(() => !groupAlive(lineagePid));
    const summary = JSON.parse(readFileSync(join(fixture.baseDir, 'orchestration-summary.json'), 'utf8')) as {
      stopped?: boolean;
      stopped_signal?: string;
    };
    expect(summary).toMatchObject({ stopped: true, stopped_signal: 'SIGHUP' });
  }, 40_000);

  it('stops its lineages when the bootstrap parent dies by SIGKILL', async () => {
    const fixture = makeSleepingRun('fanout-stop-parent-death');
    const { child, closed } = startRun(fixture);
    const lineagePid = await waitForSpawnedLineage(fixture.baseDir);

    child.kill('SIGKILL');
    await closed;

    // Nothing forwards a SIGKILL, so only the runner's own watch on its parent can end the group.
    await waitFor(() => !groupAlive(lineagePid));
    const stoppedRow = await waitFor(() => readLedger(fixture.baseDir).find((row) => row.event === 'stopped'));
    expect(stoppedRow.signal).toBe('SIGHUP');
  }, 40_000);

  it('--stop ends a live run from a second process and records a rerun for each stopped lineage', async () => {
    const fixture = makeSleepingRun('fanout-stop-live');
    const { closed } = startRun(fixture);
    const lineagePid = await waitForSpawnedLineage(fixture.baseDir);

    const stop = await runStop(fixture);

    expect(stop.exitCode).toBe(0);
    expect(JSON.parse(stop.stdout.trim().split('\n').at(-1) ?? '{}')).toMatchObject({
      status: 'ok',
      stopped: [{ label: 'slow', pid: lineagePid }],
      survivors: [],
    });
    expect(groupAlive(lineagePid)).toBe(false);
    // The runner is stopped too, so it cannot retry the lineage it just lost.
    expect((await closed).exitCode).toBe(143);

    const stopped = readLedger(fixture.baseDir).filter((row) => row.event === 'stopped' && row.label === 'slow');
    expect(stopped).toHaveLength(1);
    expect(stopped[0].status).toBe('stopped');
    expect(stopped[0].rerun_command).not.toContain('--stop');
    expect(stopped[0].rerun_command).toMatch(/--only-lineage slow$/);
  }, 40_000);

  it('--stop leaves a process alone when its lineage is not live in the ledger', async () => {
    const fixture = makeSleepingRun('fanout-stop-not-live');
    // A process the ledger shows as finished: its pid is real and alive, but the lineage closed.
    const bystander = spawn('sleep', ['60'], { detached: true, stdio: 'ignore' });
    bystander.unref();
    const bystanderPid = bystander.pid as number;
    ownedGroups.push(bystanderPid);
    const at = new Date().toISOString();
    const rows = [
      { event: 'started', label: 'done', index: 0, at },
      { event: 'spawned', label: 'done', attempt: 1, pid: bystanderPid, at, status: 'running' },
      { event: 'completed', label: 'done', index: 0, at },
      // A lineage still open in the ledger whose process is gone.
      { event: 'started', label: 'gone', index: 1, at },
      { event: 'spawned', label: 'gone', attempt: 1, pid: 99_999_999, at, status: 'running' },
    ];
    writeFileSync(
      join(fixture.baseDir, 'orchestration-status.log'),
      rows.map((row) => `${JSON.stringify(row)}\n`).join(''),
    );

    const stop = await runStop(fixture);

    expect(stop.exitCode).toBe(0);
    expect(JSON.parse(stop.stdout.trim().split('\n').at(-1) ?? '{}')).toMatchObject({
      status: 'ok',
      stopped: [],
      survivors: [],
    });
    expect(groupAlive(bystanderPid)).toBe(true);
    expect(readLedger(fixture.baseDir).filter((row) => row.event === 'stopped')).toEqual([]);
  }, 40_000);
});

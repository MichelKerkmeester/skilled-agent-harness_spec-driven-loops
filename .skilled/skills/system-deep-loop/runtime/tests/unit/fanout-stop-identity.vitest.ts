// ───────────────────────────────────────────────────────────────────
// MODULE: Fan-Out Stop Identity Tests
// ───────────────────────────────────────────────────────────────────
//
// A ledger pid outlives its lineage, and the kernel hands the number to the next process
// that asks. --stop signals a whole process group, so it must prove a pid still belongs
// to the lineage the ledger recorded before it signals anything. Every process here is
// owned by the test.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawn, spawnSync, type ChildProcess } from 'node:child_process';

import { afterEach, describe, expect, it } from 'vitest';

import { createHermeticEnv, runtimeRoot, type HermeticEnv } from '../helpers/spawn-cjs';

const fanoutRunScript = join(runtimeRoot, 'scripts', 'fanout-run.cjs');
const OPENCODE_VERSION_PROBE = 'if [ "$1" = "--version" ]; then echo 2.3.2; exit 0; fi';
const SPEC_FOLDER = 'specs/test-fanout-stop-identity';

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

function processStart(pid: number): string {
  const result = spawnSync('ps', ['-o', 'lstart=', '-p', String(pid)], {
    encoding: 'utf8',
    env: { ...process.env, LC_ALL: 'C', TZ: 'UTC' },
  });
  return result.status === 0 ? result.stdout.trim() : '';
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

type LedgerRow = {
  event?: string;
  label?: string;
  pid?: number;
  process_start?: string;
  runner_pid?: number;
  survivors?: Array<{ label: string; pid: number }>;
};

function readLedger(baseDir: string): LedgerRow[] {
  const ledgerPath = join(baseDir, 'orchestration-status.log');
  if (!existsSync(ledgerPath)) return [];
  return readFileSync(ledgerPath, 'utf8')
    .split('\n')
    .filter((line) => line.trim() !== '')
    .map((line) => JSON.parse(line) as LedgerRow);
}

type RunFixture = { hermetic: HermeticEnv; baseDir: string; args: string[]; env: NodeJS.ProcessEnv };

function makeSleepingRun(
  testId: string,
  executorBody: string | ((tmpDir: string) => string) = 'sleep 60\nexit 0',
  count = 1,
): RunFixture {
  const hermetic = createHermeticEnv(testId);
  hermeticEnvs.push(hermetic);
  const binDir = join(hermetic.tmpDir, 'bin');
  mkdirSync(binDir, { recursive: true });
  const body = typeof executorBody === 'function' ? executorBody(hermetic.tmpDir) : executorBody;
  writeFileSync(join(binDir, 'opencode'), `#!/bin/sh\n${OPENCODE_VERSION_PROBE}\n${body}\n`, { mode: 0o755 });
  const baseDir = join(hermetic.tmpDir, SPEC_FOLDER, 'research');
  mkdirSync(baseDir, { recursive: true });
  const fanoutConfig = JSON.stringify({
    executors: [{ label: 'slow', kind: 'cli-opencode', model: 'opencode-go/glm-5.1', count }],
    concurrency: count,
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
      ...(count === 1 ? ['--only-lineage', 'slow'] : []),
    ],
    env: { ...hermetic.env, PATH: `${binDir}:${hermetic.env['PATH'] ?? ''}` },
  };
}

function startRun(fixture: RunFixture): ChildProcess {
  const child = spawn(process.execPath, [fanoutRunScript, ...fixture.args], {
    cwd: fixture.hermetic.tmpDir,
    env: fixture.env,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  child.stdout?.resume();
  child.stderr?.resume();
  return child;
}

function runStop(fixture: RunFixture): Promise<{ exitCode: number | null; stdout: string }> {
  const child = spawn(process.execPath, [fanoutRunScript, ...fixture.args, '--stop'], {
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

function lastJson(stdout: string): Record<string, unknown> {
  return JSON.parse(stdout.trim().split('\n').at(-1) ?? '{}') as Record<string, unknown>;
}

function ownedSleeper(): number {
  // Detached, so the pid leads its own group and a group signal would really land on it.
  const sleeper = spawn('sleep', ['60'], { detached: true, stdio: 'ignore' });
  sleeper.unref();
  const pid = sleeper.pid as number;
  ownedGroups.push(pid);
  return pid;
}

describe('fanout-run.cjs --stop — lineage identity', () => {
  it('records the lineage start time at spawn and stops the lineage it matches', async () => {
    const fixture = makeSleepingRun('fanout-stop-identity-match');
    startRun(fixture);
    const spawned = await waitFor(() => readLedger(fixture.baseDir).find((row) => row.event === 'spawned'));
    const lineagePid = spawned.pid as number;
    ownedGroups.push(lineagePid);

    expect(spawned.process_start).toBeTruthy();
    expect(spawned.process_start).toBe(processStart(lineagePid));

    const stop = await runStop(fixture);

    expect(stop.exitCode).toBe(0);
    expect(lastJson(stop.stdout)).toMatchObject({
      status: 'ok',
      stopped: [{ label: 'slow', pid: lineagePid }],
      survivors: [],
      refused: [],
    });
    expect(groupAlive(lineagePid)).toBe(false);
  }, 40_000);

  it('masks the kept log of each lineage it stops, and leaves a refused lineage\'s log alone', async () => {
    const fixture = makeSleepingRun('fanout-stop-identity-redact');
    // No runner owns these pids, so --stop itself is the one that settles the lineage.
    const stoppedPid = ownedSleeper();
    const refusedPid = ownedSleeper();
    const at = new Date().toISOString();
    const rows = [
      { event: 'started', label: 'kept', index: 0, at },
      { event: 'spawned', label: 'kept', attempt: 1, pid: stoppedPid, at, status: 'running', process_start: processStart(stoppedPid) },
      { event: 'started', label: 'refused', index: 1, at },
      { event: 'spawned', label: 'refused', attempt: 1, pid: refusedPid, at, status: 'running' },
    ];
    writeFileSync(join(fixture.baseDir, 'orchestration-status.log'), rows.map((row) => `${JSON.stringify(row)}\n`).join(''));
    const rawLog = 'refused for dev@example.com in workspace wrk_AbCdEf123456\n';
    const logPathOf = (label: string) => join(fixture.baseDir, 'lineages', label, 'logs', 'fanout-lineage.out');
    for (const label of ['kept', 'refused']) {
      mkdirSync(join(fixture.baseDir, 'lineages', label, 'logs'), { recursive: true });
      writeFileSync(logPathOf(label), rawLog);
    }

    const stop = await runStop(fixture);

    expect(lastJson(stop.stdout)).toMatchObject({ stopped: [{ label: 'kept', pid: stoppedPid }] });
    expect(readLedger(fixture.baseDir).filter((row) => row.event === 'stopped').map((row) => row.label)).toEqual(['kept']);
    const masked = readFileSync(logPathOf('kept'), 'utf8');
    expect(masked).not.toContain('dev@example.com');
    expect(masked).not.toContain('wrk_AbCdEf123456');
    expect(masked).toContain('<email>');
    expect(masked).toContain('<id>');
    expect(readFileSync(logPathOf('refused'), 'utf8')).toBe(rawLog);
  }, 40_000);

  it('refuses a pid whose process is not the recorded lineage, or that has no recorded identity', async () => {
    const fixture = makeSleepingRun('fanout-stop-identity-refuse');
    const reusedPid = ownedSleeper();
    const oldLedgerPid = ownedSleeper();
    const at = new Date().toISOString();
    const rows = [
      { event: 'started', label: 'reused', index: 0, at },
      // A start time the live holder of this pid cannot have.
      { event: 'spawned', label: 'reused', attempt: 1, pid: reusedPid, at, status: 'running', process_start: 'Mon Jan  1 00:00:00 2001' },
      // A row written before the runner recorded any identity.
      { event: 'started', label: 'old', index: 1, at },
      { event: 'spawned', label: 'old', attempt: 1, pid: oldLedgerPid, at, status: 'running' },
    ];
    writeFileSync(join(fixture.baseDir, 'orchestration-status.log'), rows.map((row) => `${JSON.stringify(row)}\n`).join(''));

    const stop = await runStop(fixture);

    expect(groupAlive(reusedPid)).toBe(true);
    expect(groupAlive(oldLedgerPid)).toBe(true);
    expect(stop.exitCode).toBe(2);
    const outcome = lastJson(stop.stdout);
    expect(outcome).toMatchObject({ status: 'partial', stopped: [], survivors: [] });
    expect(outcome.refused).toEqual([
      { label: 'reused', pid: reusedPid, reason: 'identity_mismatch' },
      { label: 'old', pid: oldLedgerPid, reason: 'no_recorded_identity' },
    ]);
    expect(readLedger(fixture.baseDir).filter((row) => row.event === 'stopped')).toEqual([]);
  }, 40_000);

  it('signals the members of an exited leader\'s group started since the spawn, and spares an older one', async () => {
    const fixture = makeSleepingRun('fanout-stop-identity-exited-leader');
    // The leader starts one member, waits past the one-second resolution of a start time,
    // starts a second and exits, so its group lives on without it.
    const leader = spawn('sh', ['-c', 'sleep 60 & echo $!; sleep 2; sleep 60 & echo $!; exit 0'], {
      detached: true,
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    const leaderPid = leader.pid as number;
    ownedGroups.push(leaderPid);
    let leaderOut = '';
    leader.stdout?.setEncoding('utf8');
    leader.stdout?.on('data', (chunk) => { leaderOut += chunk; });
    await new Promise((resolvePromise) => leader.on('exit', resolvePromise));
    const [olderPid, newerPid] = await waitFor(() => {
      const pids = leaderOut.trim().split('\n').filter(Boolean).map(Number);
      return pids.length === 2 ? pids : null;
    });
    expect(processStart(leaderPid)).toBe('');
    expect(groupAlive(leaderPid)).toBe(true);

    // The recorded spawn time falls after the older member started, so it cannot be the lineage's.
    const at = new Date().toISOString();
    const rows = [
      { event: 'started', label: 'headless', index: 0, at },
      { event: 'spawned', label: 'headless', attempt: 1, pid: leaderPid, at, status: 'running', process_start: processStart(newerPid) },
    ];
    writeFileSync(join(fixture.baseDir, 'orchestration-status.log'), rows.map((row) => `${JSON.stringify(row)}\n`).join(''));

    const stop = await runStop(fixture);

    const pidAlive = (pid: number) => processStart(pid) !== '';
    expect(pidAlive(newerPid)).toBe(false);
    expect(pidAlive(olderPid)).toBe(true);
    expect(stop.exitCode).toBe(0);
    expect(lastJson(stop.stdout)).toMatchObject({
      status: 'ok',
      stopped: [{ label: 'headless', pid: leaderPid }],
      survivors: [],
      refused: [],
      spared: [{ label: 'headless', pid: olderPid, process_start: processStart(olderPid) }],
    });
    expect(readLedger(fixture.baseDir).filter((row) => row.event === 'stopped').map((row) => row.label)).toEqual(['headless']);
  }, 40_000);

  it('leaves the close of a leaderless lineage to the runner still waiting on it, so it ends once', async () => {
    // The executor backgrounds a member that keeps its output pipe open and exits, so the
    // runner is still waiting on that output, the lineage still open, when --stop runs.
    const fixture = makeSleepingRun('fanout-stop-identity-live-runner', 'sleep 60 &\nexit 0');
    const run = startRun(fixture);
    const runExited = new Promise((resolvePromise) => run.on('exit', resolvePromise));
    const spawned = await waitFor(() => readLedger(fixture.baseDir).find((row) => row.event === 'spawned'));
    const leaderPid = spawned.pid as number;
    ownedGroups.push(leaderPid);
    await waitFor(() => processStart(leaderPid) === '' && groupAlive(leaderPid));
    const terminalRows = () => readLedger(fixture.baseDir)
      .filter((row) => row.label === 'slow' && ['stopped', 'completed', 'failed'].includes(row.event ?? ''));
    expect(run.exitCode).toBeNull();
    expect(terminalRows()).toEqual([]);

    const stop = await runStop(fixture);
    await runExited;

    expect(stop.exitCode).toBe(0);
    expect(lastJson(stop.stdout)).toMatchObject({ status: 'ok', stopped: [{ label: 'slow', pid: leaderPid }] });
    expect(groupAlive(leaderPid)).toBe(false);
    expect(terminalRows().map((row) => row.event)).toEqual(['stopped']);
  }, 40_000);

  it('a runner stopped by a signal spares the members --stop would spare, and still stops the others', async () => {
    // The executor starts one member, waits past the one-second resolution of a start time,
    // starts a second and exits; both members keep its output pipe open, so the runner still
    // holds the exited leader as a running lineage.
    const fixture = makeSleepingRun('fanout-stop-identity-runner-spare', (tmpDir) => [
      `sleep 60 & echo $! >> "${tmpDir}/members"`,
      'sleep 2',
      `sleep 60 & echo $! >> "${tmpDir}/members"`,
      'exit 0',
    ].join('\n'));
    const run = startRun(fixture);
    const runExited = new Promise((resolvePromise) => run.on('exit', resolvePromise));
    const spawned = await waitFor(() => readLedger(fixture.baseDir).find((row) => row.event === 'spawned'));
    const leaderPid = spawned.pid as number;
    ownedGroups.push(leaderPid);
    const membersPath = join(fixture.hermetic.tmpDir, 'members');
    const [olderPid, newerPid] = await waitFor(() => {
      if (!existsSync(membersPath)) return null;
      const pids = readFileSync(membersPath, 'utf8').trim().split('\n').filter(Boolean).map(Number);
      return pids.length === 2 && processStart(leaderPid) === '' && groupAlive(leaderPid) ? pids : null;
    });

    // Every member of a real lineage group descends from its leader, so none starts before
    // the recorded spawn and the spare branch cannot be reached honestly. This row is the
    // injection: it repeats the spawn with the newer member's start, and the latest row for
    // a pid is the one a stop reads.
    writeFileSync(join(fixture.baseDir, 'orchestration-status.log'), `${JSON.stringify({
      ...spawned,
      process_start: processStart(newerPid),
    })}\n`, { flag: 'a' });

    run.kill('SIGTERM');
    await runExited;

    const pidAlive = (pid: number) => processStart(pid) !== '';
    expect(pidAlive(olderPid)).toBe(true);
    expect(pidAlive(newerPid)).toBe(false);
    expect(readLedger(fixture.baseDir).filter((row) => row.event === 'stopped').map((row) => row.label)).toEqual(['slow']);
  }, 40_000);

  it('a runner stopped by a signal leaves a lineage that outlives the signal open, and names it a survivor', async () => {
    // The first lineage to start ignores SIGTERM, and its sleep inherits that.
    const fixture = makeSleepingRun('fanout-stop-identity-runner-survivor', (tmpDir) => [
      `if mkdir "${tmpDir}/stubborn" 2>/dev/null; then echo $$ > "${tmpDir}/stubborn/pid"; trap '' TERM; fi`,
      'sleep 60',
      'exit 0',
    ].join('\n'), 2);
    const run = startRun(fixture);
    const runExited = new Promise<number | null>((resolvePromise) => run.on('exit', (code) => resolvePromise(code)));
    const spawnedRows = await waitFor(() => {
      const rows = readLedger(fixture.baseDir).filter((row) => row.event === 'spawned');
      return rows.length === 2 ? rows : null;
    });
    for (const row of spawnedRows) ownedGroups.push(row.pid as number);
    const stubbornPidPath = join(fixture.hermetic.tmpDir, 'stubborn', 'pid');
    const stubbornPid = await waitFor(() => (existsSync(stubbornPidPath)
      ? Number(readFileSync(stubbornPidPath, 'utf8').trim()) || null
      : null));
    const stubborn = spawnedRows.find((row) => row.pid === stubbornPid) as LedgerRow;
    const normal = spawnedRows.find((row) => row.pid !== stubbornPid) as LedgerRow;

    run.kill('SIGTERM');
    // A second signal lands while the runner waits on the survivor, and must not cut the
    // stop short of its summary.
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 500));
    try {
      process.kill(stubborn.runner_pid as number, 'SIGTERM');
    } catch {
      // The runner already exited, which the assertions below report.
    }
    expect(await runExited).toBe(143);

    expect(groupAlive(stubbornPid)).toBe(true);
    expect(groupAlive(normal.pid as number)).toBe(false);
    const ledger = readLedger(fixture.baseDir);
    expect(ledger.filter((row) => row.event === 'stopped').map((row) => row.label)).toEqual([normal.label]);
    expect(ledger.find((row) => row.event === 'run_stopped')?.survivors).toEqual([
      { label: stubborn.label, pid: stubbornPid },
    ]);
    const summary = JSON.parse(readFileSync(join(fixture.baseDir, 'orchestration-summary.json'), 'utf8')) as {
      results: Array<{ label: string; status: string }>;
    };
    expect(summary.results.find((result) => result.label === stubborn.label)?.status).not.toBe('stopped');
  }, 40_000);
});

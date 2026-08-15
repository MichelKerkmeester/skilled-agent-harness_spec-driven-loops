// ───────────────────────────────────────────────────────────────────
// MODULE: Fan-Out Scheduler Stress Tests
// ───────────────────────────────────────────────────────────────────

import {
  existsSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  writeFileSync,
} from 'node:fs';
import { spawn, spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { join, resolve } from 'node:path';

import { afterAll, afterEach, describe, expect, it } from 'vitest';

import {
  CLI_ADAPTER_FANOUT_ROWS,
  CLI_ADAPTER_MATRIX_AUDIT,
  EDGE_CASE_ROWS,
  FANOUT_TEST_NAMES,
} from './matrix-manifest';
import {
  CLI_DISPATCH_STACK_ENV,
  validateExecutorDispatchAllowed,
} from '../../../lib/deep-loop/executor-audit.js';
import {
  expandLineages,
  parseExecutorConfig,
  parseFanoutConfig,
} from '../../../lib/deep-loop/executor-config.js';
import { spawnCjs, type SpawnCjsResult } from '../../helpers/spawn-cjs';
import {
  createAdapterShim,
  readAdapterCaptures,
  readRecordedPids,
  runAdapterFanout,
  type AdapterShimFixture,
} from './fixtures/adapter-fixture';
import { processIsAlive, runBoundedProcess } from './fixtures/process-fixture';
import {
  claimOwnership,
  createIsolatedWorktrees,
  isPathInside,
  nodeModulesRealpaths,
  type IsolatedWorktreeFixture,
} from './fixtures/worktree-fixture';

const requireCjs = createRequire(import.meta.url);
const fanoutRun = requireCjs('../../../scripts/fanout-run.cjs') as {
  buildLoopPrompt(
    loopType: string,
    specFolder: string,
    lineageDir: string,
    sessionId: string,
    lineage: Record<string, unknown>,
    researchTopic: string | null,
    options?: Record<string, unknown>,
  ): string;
};

const fanoutScript = resolve(import.meta.dirname, '../../../scripts/fanout-run.cjs');
const fixtures: AdapterShimFixture[] = [];
const worktrees: IsolatedWorktreeFixture[] = [];
const observedPids = new Set<number>();

interface FanoutInvocation {
  readonly result: SpawnCjsResult;
  readonly baseArtifactDir: string;
  readonly args: readonly string[];
}

function useShim(mode: string): AdapterShimFixture {
  const fixture = createAdapterShim('cli-opencode', mode);
  fixtures.push(fixture);
  return fixture;
}

function fanoutInvocation(
  fixture: AdapterShimFixture,
  suffix: string,
  config: Record<string, unknown>,
  options: {
    readonly stopPolicy?: 'convergence' | 'max-iterations';
    readonly convergenceThreshold?: number;
  } = {},
): Omit<FanoutInvocation, 'result'> {
  const specFolder = `specs/fanout-${suffix}`;
  const baseArtifactDir = join(fixture.root, specFolder, 'research', 'artifacts');
  mkdirSync(baseArtifactDir, { recursive: true });
  const args = [
    '--spec-folder', specFolder,
    '--loop-type', 'research',
    '--fanout-config-json', JSON.stringify(config),
    '--base-artifact-dir', baseArtifactDir,
  ];
  if (options.stopPolicy) args.push('--stop-policy', options.stopPolicy);
  if (options.convergenceThreshold !== undefined) {
    args.push('--convergence-threshold', String(options.convergenceThreshold));
  }
  return { baseArtifactDir, args };
}

async function runFanoutConfig(
  fixture: AdapterShimFixture,
  suffix: string,
  config: Record<string, unknown>,
  options: {
    readonly stopPolicy?: 'convergence' | 'max-iterations';
    readonly convergenceThreshold?: number;
  } = {},
): Promise<FanoutInvocation> {
  const invocation = fanoutInvocation(fixture, suffix, config, options);
  const result = await spawnCjs(fanoutScript, [...invocation.args], {
    cwd: fixture.root,
    env: fixture.env,
    timeoutMs: 12_000,
  });
  return { ...invocation, result };
}

async function runReviewFanoutConfig(
  fixture: AdapterShimFixture,
  suffix: string,
  config: Record<string, unknown>,
  options: {
    readonly stopPolicy?: 'convergence' | 'max-iterations';
    readonly convergenceThreshold?: number;
  } = {},
): Promise<FanoutInvocation> {
  const specFolder = `specs/fanout-${suffix}`;
  const baseArtifactDir = join(fixture.root, specFolder, 'review', 'artifacts');
  mkdirSync(baseArtifactDir, { recursive: true });
  const args = [
    '--spec-folder', specFolder,
    '--loop-type', 'review',
    '--fanout-config-json', JSON.stringify(config),
    '--base-artifact-dir', baseArtifactDir,
  ];
  if (options.stopPolicy) args.push('--stop-policy', options.stopPolicy);
  if (options.convergenceThreshold !== undefined) {
    args.push('--convergence-threshold', String(options.convergenceThreshold));
  }
  const result = await spawnCjs(fanoutScript, args, {
    cwd: fixture.root,
    env: fixture.env,
    timeoutMs: 12_000,
  });
  return { result, baseArtifactDir, args };
}

async function runFanoutFromCwd(
  fixture: AdapterShimFixture,
  cwd: string,
  suffix: string,
): Promise<FanoutInvocation> {
  const specFolder = `specs/fanout-${suffix}`;
  const baseArtifactDir = join(cwd, specFolder, 'research', 'artifacts');
  mkdirSync(baseArtifactDir, { recursive: true });
  const args = [
    '--spec-folder', specFolder,
    '--loop-type', 'research',
    '--fanout-config-json', JSON.stringify({
      executors: [{
        label: suffix,
        kind: 'cli-opencode',
        model: 'anthropic/claude-opus-4-8',
        reasoningEffort: 'high',
        iterations: 1,
      }],
      concurrency: 1,
      maxRetries: 0,
    }),
    '--base-artifact-dir', baseArtifactDir,
  ];
  const result = await spawnCjs(fanoutScript, args, {
    cwd,
    env: fixture.env,
    timeoutMs: 12_000,
  });
  return { result, baseArtifactDir, args };
}

function readJson<T>(filePath: string): T {
  return JSON.parse(readFileSync(filePath, 'utf8')) as T;
}

function readJsonLines(filePath: string): readonly Record<string, unknown>[] {
  if (!existsSync(filePath)) return [];
  return readFileSync(filePath, 'utf8')
    .trim()
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line) as Record<string, unknown>);
}

function ledgerEvents(baseArtifactDir: string): readonly Record<string, unknown>[] {
  return readJsonLines(join(baseArtifactDir, 'orchestration-status.log'));
}

function expectTransportMissingFailure(events: readonly Record<string, unknown>[]): void {
  const failure = events.find((event) => event.event === 'failed' && event.terminal === true);
  expect(failure).toMatchObject({
    error: {
      message: 'lineage adapter exited with code -2',
      exit_code: -2,
    },
  });
}

function maximumInFlight(events: readonly Record<string, unknown>[]): number {
  let current = 0;
  let maximum = 0;
  for (const event of events) {
    if (event.event === 'started') {
      current += 1;
      maximum = Math.max(maximum, current);
    } else if (event.event === 'completed' || (event.event === 'failed' && event.terminal !== false)) {
      current -= 1;
    }
  }
  return maximum;
}

function stdoutEnvelope(stdout: string): Record<string, unknown> {
  const line = stdout.trim().split('\n').filter(Boolean).at(-1);
  if (!line) throw new Error('Fan-out scheduler emitted no JSON envelope');
  return JSON.parse(line) as Record<string, unknown>;
}

async function waitForCaptureCount(fixture: AdapterShimFixture, count: number): Promise<void> {
  const deadline = Date.now() + 2_000;
  while (Date.now() < deadline) {
    if (readAdapterCaptures(fixture).length >= count) return;
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 10));
  }
  throw new Error(`Timed out waiting for ${count} shim capture(s)`);
}

async function waitUntilDead(pids: readonly number[]): Promise<void> {
  const deadline = Date.now() + 2_000;
  while (Date.now() < deadline) {
    if (pids.every((pid) => !processIsAlive(pid))) return;
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 20));
  }
}

function setShimMode(fixture: AdapterShimFixture, mode: string): void {
  writeFileSync(join(fixture.root, 'home', '.cli-adapter-control.json'), JSON.stringify({
    mode,
    capturePath: fixture.capturePath,
    pidPath: fixture.pidPath,
  }), 'utf8');
}

function installDestructiveShim(fixture: AdapterShimFixture, targetPath: string): void {
  writeFileSync(join(fixture.root, 'home', '.cli-adapter-control.json'), JSON.stringify({
    capturePath: fixture.capturePath,
    pidPath: fixture.pidPath,
    targetPath,
  }), 'utf8');
  writeFileSync(join(fixture.binDir, 'opencode'), [
    '#!/usr/bin/env node',
    "'use strict';",
    "const { appendFileSync, mkdirSync, readFileSync, writeFileSync } = require('node:fs');",
    "const { dirname, join } = require('node:path');",
    'const control = JSON.parse(readFileSync(',
    "  join(process.env.HOME, '.cli-adapter-control.json'),",
    "  'utf8',",
    '));',
    "const lineageDir = dirname(process.env.SPECKIT_OPENCODE_STATE_DIR);",
    "const stdin = readFileSync(0, 'utf8');",
    'appendFileSync(control.capturePath, JSON.stringify({',
    "  kind: 'cli-opencode',",
    '  pid: process.pid,',
    '  cwd: process.cwd(),',
    '  args: process.argv.slice(2),',
    '  stdin,',
    '  env: {},',
    "}) + '\\n', 'utf8');",
    "writeFileSync(control.pidPath, JSON.stringify({ root: process.pid }), 'utf8');",
    "mkdirSync(lineageDir, { recursive: true });",
    "writeFileSync(control.targetPath, 'destructive out-of-scope write\\n', 'utf8');",
    "writeFileSync(join(lineageDir, 'research.md'), '# Shim research\\n', 'utf8');",
    "process.stdout.write('{\"type\":\"text\",\"part\":',",
    "  '{\"providerID\":\"shim\",\"modelID\":\"success\"}}\\n');",
  ].join('\n'), 'utf8');
}

afterEach(async () => {
  for (const fixture of fixtures) {
    const pids = [
      ...readAdapterCaptures(fixture).flatMap((capture) => [
        capture.pid,
        capture.childPid,
        capture.grandchildPid,
      ]),
      ...Object.values(readRecordedPids(fixture)),
    ].filter((pid): pid is number => pid !== undefined);
    pids.forEach((pid) => observedPids.add(pid));
    for (const pid of pids) {
      if (!processIsAlive(pid)) continue;
      try {
        process.kill(pid, 'SIGKILL');
      } catch {
        // The bounded child completed during the final liveness probe.
      }
    }
    await waitUntilDead(pids);
  }
  for (const fixture of fixtures.splice(0)) fixture.cleanup();
  for (const fixture of worktrees.splice(0)) fixture.cleanup();
});

afterAll(() => {
  const evidencePath = process.env.CLI_ADAPTER_STRESS_PID_EVIDENCE;
  if (evidencePath) {
    writeFileSync(evidencePath, JSON.stringify([...observedPids].sort((left, right) => left - right)));
  }
});

describe.sequential('fan-out manifest integrity', () => {
  it('binds all fan-out matrix rows without forbidden overclaims', () => {
    expect(EDGE_CASE_ROWS).toHaveLength(14);
    expect(CLI_ADAPTER_FANOUT_ROWS).toHaveLength(14);
    expect(CLI_ADAPTER_FANOUT_ROWS.map((cell) => cell.testName)).toEqual(FANOUT_TEST_NAMES);
    expect(CLI_ADAPTER_FANOUT_ROWS.every((cell) => cell.testStatus === 'implemented')).toBe(true);
    expect(CLI_ADAPTER_MATRIX_AUDIT).toEqual({
      allAdapterBound: true,
      allSubjectBound: true,
      forbiddenOverclaims: [],
    });
  });
});

describe.sequential('fan-out scheduler contracts', () => {
  it('refuses a lineage that modifies a committed out-of-scope path and restores HEAD', async () => {
    const fixture = useShim('success');
    const worktree = createIsolatedWorktrees();
    worktrees.push(worktree);
    const repository = worktree.worktrees[0];
    const targetPath = join(repository, 'fixture.txt');
    const beforeContent = readFileSync(targetPath, 'utf8');
    const beforeHash = spawnSync('git', ['hash-object', 'fixture.txt'], {
      cwd: repository,
      encoding: 'utf8',
    });
    expect(beforeHash.status).toBe(0);
    installDestructiveShim(fixture, targetPath);

    const run = await runFanoutFromCwd(fixture, repository, 'write-containment');
    const lineageDir = join(run.baseArtifactDir, 'lineages', 'write-containment');
    const events = ledgerEvents(run.baseArtifactDir);
    const envelope = stdoutEnvelope(run.result.stdout);
    const results = envelope.results as Array<{
      label: string;
      status: string;
      error: { message: string };
    }>;
    const pids = Object.values(readRecordedPids(fixture));
    await waitUntilDead(pids);
    const afterContent = readFileSync(targetPath, 'utf8');
    const afterHash = spawnSync('git', ['hash-object', 'fixture.txt'], {
      cwd: repository,
      encoding: 'utf8',
    });
    const targetStatus = spawnSync('git', ['status', '--porcelain=v1', '--', 'fixture.txt'], {
      cwd: repository,
      encoding: 'utf8',
    });

    expect(afterContent).toBe(beforeContent);
    expect(afterHash.status).toBe(0);
    expect(String(afterHash.stdout).trim()).toBe(String(beforeHash.stdout).trim());
    expect(targetStatus.status).toBe(0);
    expect(String(targetStatus.stdout)).toBe('');
    expect(readFileSync(join(lineageDir, 'research.md'), 'utf8')).toBe('# Shim research\n');
    expect(events).toEqual(expect.arrayContaining([
      expect.objectContaining({
        event: 'containment_violation',
        severity: 'error',
        label: 'write-containment',
        violations: [{ path: 'fixture.txt', kind: 'modified', status: ' M' }],
        reverted: [{ path: 'fixture.txt', action: 'restored_from_head', ok: true }],
      }),
      expect.objectContaining({
        event: 'failed',
        terminal: true,
        label: 'write-containment',
        error: expect.objectContaining({
          message: expect.stringContaining('violated write containment'),
        }),
      }),
    ]));
    expect(run.result.exitCode).toBe(3);
    expect(run.result.timedOut).toBe(false);
    expect(envelope.summary).toMatchObject({ failed: 1, all_failed: true });
    expect(results).toEqual([
      expect.objectContaining({
        label: 'write-containment',
        status: 'rejected',
        error: expect.objectContaining({
          message: expect.stringContaining('violated write containment'),
        }),
      }),
    ]);
    expect(pids.length).toBeGreaterThan(0);
    expect(pids.every((pid) => !processIsAlive(pid))).toBe(true);
  });

  it(FANOUT_TEST_NAMES[0], async () => {
    const fixture = useShim('auth-denial');
    const run = await runAdapterFanout(fixture, { mode: 'auth' });
    expect(run.result.exitCode).toBe(3);
    expect(readFileSync(join(run.lineageDir, 'logs', 'fanout-lineage.out'), 'utf8'))
      .toContain('OAuth authentication unavailable');
  });

  it(FANOUT_TEST_NAMES[1], async () => {
    const fixture = useShim('model-not-found');
    const run = await runAdapterFanout(fixture, { mode: 'model' });
    expect(run.result.exitCode).toBe(3);
    expect(readFileSync(join(run.lineageDir, 'logs', 'fanout-lineage.out'), 'utf8'))
      .toContain('model not found or insufficient balance');
  });

  it(FANOUT_TEST_NAMES[2], async () => {
    const fixture = useShim('rate-limit');
    const run = await runAdapterFanout(fixture, { mode: 'rate-limit' });
    expect(run.result.exitCode).toBe(3);
    expect(readAdapterCaptures(fixture)).toHaveLength(1);
    expect(ledgerEvents(run.baseArtifactDir).filter((event) => event.event === 'retry_scheduled'))
      .toEqual([]);
  });

  it(FANOUT_TEST_NAMES[3], async () => {
    const fixture = useShim('timeout');
    const run = await runAdapterFanout(fixture, { mode: 'timeout', timeoutSeconds: 1 });
    const pids = Object.values(readRecordedPids(fixture));
    await waitUntilDead(pids);
    expect(run.result.exitCode).toBe(3);
    expect(pids.length).toBeGreaterThan(0);
    expect(pids.every((pid) => !processIsAlive(pid))).toBe(true);
  });

  it(FANOUT_TEST_NAMES[4], async () => {
    const fixture = useShim('stdin-wait');
    const run = await runAdapterFanout(fixture, { mode: 'stdin' });
    expect(run.result.exitCode).toBe(0);
    expect(readAdapterCaptures(fixture)).toHaveLength(1);
    expect(readAdapterCaptures(fixture)[0].stdin).toBe('');
  });

  it(FANOUT_TEST_NAMES[5], async () => {
    const fixture = useShim('success');
    const run = await runAdapterFanout(fixture, { mode: 'gate' });
    expect(run.result.exitCode).toBe(0);
    expect(readAdapterCaptures(fixture)[0].env).toMatchObject({
      MK_SPEC_GATE_ENFORCE: '0',
      MK_SPEC_GATE_DISABLED: '1',
      AI_SESSION_CHILD: '1',
    });
  });

  it(FANOUT_TEST_NAMES[6], async () => {
    const parsed = parseFanoutConfig({
      assignment_model: 'flat_pool',
      executors: [{
        label: 'parallel',
        kind: 'cli-opencode',
        model: 'anthropic/claude-opus-4-8',
        reasoningEffort: 'high',
        count: 3,
        iterations: 2,
      }],
      concurrency: 2,
      maxRetries: 0,
    });
    expect(parsed.assignment_model).toBe('flat_pool');
    expect(expandLineages(parsed).map((lineage) => lineage.label)).toEqual([
      'parallel-1',
      'parallel-2',
      'parallel-3',
    ]);

    const fixture = useShim('success');
    const run = await runAdapterFanout(fixture, {
      label: 'parallel',
      mode: 'flat-pool',
      count: 3,
      concurrency: 2,
      iterations: 2,
    });
    const events = ledgerEvents(run.baseArtifactDir);
    const thirdStarted = events.findIndex((event) => event.event === 'started' && event.label === 'parallel-3');
    expect(run.result.exitCode).toBe(0);
    expect(maximumInFlight(events)).toBe(2);
    expect(events.slice(0, thirdStarted).some((event) => event.event === 'completed')).toBe(true);
    expect(readAdapterCaptures(fixture)).toHaveLength(3);
    for (const label of ['parallel-1', 'parallel-2', 'parallel-3']) {
      expect(existsSync(join(run.baseArtifactDir, 'lineages', label, 'research.md'))).toBe(true);
    }
  });

  it(FANOUT_TEST_NAMES[7], async () => {
    const fixture = useShim('success');
    const run = await runAdapterFanout(fixture, {
      mode: 'missing-transport',
      includeTransport: false,
    });
    expect(run.result.exitCode).toBe(3);
    expect(readAdapterCaptures(fixture)).toEqual([]);
    expectTransportMissingFailure(ledgerEvents(run.baseArtifactDir));

    const nonTransportFixture = useShim('auth-denial');
    const nonTransportRun = await runAdapterFanout(nonTransportFixture, { mode: 'transport-negative-control' });
    expect(nonTransportRun.result.exitCode).toBe(3);
    expect(readAdapterCaptures(nonTransportFixture)).toHaveLength(1);
    expect(() => expectTransportMissingFailure(ledgerEvents(nonTransportRun.baseArtifactDir))).toThrow();
  });

  it(FANOUT_TEST_NAMES[8], async () => {
    const lineageFixture = useShim('success');
    const lineageRun = await runAdapterFanout(lineageFixture, {
      label: 'lineage-budget',
      mode: 'lineage-budget',
      iterations: 3,
      maxCostUnitsPerLineage: 2,
      costUnitsPerIteration: 1,
    });
    expect(lineageRun.result.exitCode).toBe(3);
    expect(readAdapterCaptures(lineageFixture)).toEqual([]);
    expect(ledgerEvents(lineageRun.baseArtifactDir)).toEqual(expect.arrayContaining([
      expect.objectContaining({ event: 'budget_cap_exceeded', label: 'lineage-budget' }),
    ]));

    const aggregateFixture = useShim('success');
    const aggregateRun = await runFanoutConfig(aggregateFixture, 'aggregate-budget', {
      executors: [{
        label: 'aggregate',
        kind: 'cli-opencode',
        model: 'anthropic/claude-opus-4-8',
        reasoningEffort: 'high',
        iterations: 2,
        count: 2,
      }],
      concurrency: 2,
      maxRetries: 0,
      max_aggregate_cost_units: 3,
      costUnitsPerIteration: 1,
    });
    expect(aggregateRun.result.exitCode).toBe(3);
    expect(readAdapterCaptures(aggregateFixture)).toEqual([]);
    expect(ledgerEvents(aggregateRun.baseArtifactDir)).toEqual(expect.arrayContaining([
      expect.objectContaining({ event: 'aggregate_budget_cap_exceeded' }),
    ]));
  });

  it(FANOUT_TEST_NAMES[9], async () => {
    const fixture = useShim('timeout');
    const invocation = fanoutInvocation(fixture, 'partial-lineage', {
      executors: [{
        label: 'casualty',
        kind: 'cli-opencode',
        model: 'anthropic/claude-opus-4-8',
        reasoningEffort: 'high',
        timeoutSeconds: 3,
        count: 3,
      }],
      concurrency: 1,
      maxRetries: 0,
    });
    const processPromise = runBoundedProcess(process.execPath, [fanoutScript, ...invocation.args], {
      cwd: fixture.root,
      env: fixture.env,
      timeoutMs: 10_000,
      descendantPidFile: fixture.pidPath,
    });
    await waitForCaptureCount(fixture, 1);
    const failedPid = readAdapterCaptures(fixture)[0].pid;
    process.kill(failedPid, 'SIGKILL');
    setShimMode(fixture, 'success');
    const result = await processPromise;
    const envelope = stdoutEnvelope(result.stdout);
    const summary = readJson<{
      succeeded: number;
      failed: number;
      all_failed: boolean;
    }>(join(invocation.baseArtifactDir, 'orchestration-summary.json'));
    const results = envelope.results as Array<{
      label: string;
      status: string;
      retry_attempts: number;
    }>;
    const events = ledgerEvents(invocation.baseArtifactDir);

    expect(result).toMatchObject({ status: 2, timedOut: false });
    expect(envelope.status).toBe('partial');
    expect(summary).toMatchObject({ succeeded: 2, failed: 1, all_failed: false });
    expect(results).toEqual(expect.arrayContaining([
      expect.objectContaining({ label: 'casualty-1', status: 'rejected', retry_attempts: 0 }),
      expect.objectContaining({ label: 'casualty-2', status: 'fulfilled' }),
      expect.objectContaining({ label: 'casualty-3', status: 'fulfilled' }),
    ]));
    expect(events.filter((event) => event.event === 'retry_scheduled')).toEqual([]);
    expect(events.findIndex((event) => event.event === 'started' && event.label === 'casualty-2'))
      .toBeGreaterThan(events.findIndex((event) => event.event === 'failed' && event.label === 'casualty-1'));
    expect(existsSync(join(invocation.baseArtifactDir, 'lineages', 'casualty-2', 'research.md'))).toBe(true);
    expect(existsSync(join(invocation.baseArtifactDir, 'lineages', 'casualty-3', 'research.md'))).toBe(true);
    expect(processIsAlive(failedPid)).toBe(false);
  });

  it(FANOUT_TEST_NAMES[10], async () => {
    const fixture = useShim('orphan-tree');
    const unrelated = useShim('timeout');
    const unrelatedProcess = spawn(join(unrelated.binDir, 'opencode'), [], {
      cwd: unrelated.root,
      env: unrelated.env,
      detached: process.platform !== 'win32',
      stdio: ['pipe', 'ignore', 'ignore'],
    });
    unrelatedProcess.stdin.end('');
    const run = await runAdapterFanout(fixture, {
      mode: 'orphan-cleanup',
      timeoutSeconds: 1,
    });
    const pids = Object.values(readRecordedPids(fixture));
    await waitUntilDead(pids);
    expect(run.result.exitCode).toBe(3);
    expect(pids).toHaveLength(3);
    expect(pids.every((pid) => !processIsAlive(pid))).toBe(true);
    expect(unrelatedProcess.pid).toBeTypeOf('number');
    expect(processIsAlive(unrelatedProcess.pid as number)).toBe(true);
    if (unrelatedProcess.pid !== undefined) process.kill(unrelatedProcess.pid, 'SIGKILL');
  });

  it(FANOUT_TEST_NAMES[11], async () => {
    const fixture = useShim('success');
    const worktree = createIsolatedWorktrees();
    worktrees.push(worktree);
    const claimPath = join(worktree.root, 'fanout-owner.lock');
    claimOwnership(claimPath, worktree.worktrees[0]);
    const [first, second] = await Promise.all([
      runFanoutFromCwd(fixture, worktree.worktrees[0], 'worktree-a'),
      runFanoutFromCwd(fixture, worktree.worktrees[1], 'worktree-b'),
    ]);
    expect(first.result.exitCode).toBe(0);
    expect(second.result.exitCode).toBe(0);
    expect(readAdapterCaptures(fixture).map((capture) => capture.cwd).sort()).toEqual([
      realpathSync(worktree.worktrees[0]),
      realpathSync(worktree.worktrees[1]),
    ].sort());
    expect(() => claimOwnership(claimPath, worktree.worktrees[1])).toThrow(/EEXIST/);
    expect(readFileSync(claimPath, 'utf8')).toBe(worktree.worktrees[0]);
  });

  it(FANOUT_TEST_NAMES[12], async () => {
    const fixture = useShim('success');
    const worktree = createIsolatedWorktrees();
    worktrees.push(worktree);
    const realpaths = nodeModulesRealpaths(worktree.worktrees);
    const [first, second] = await Promise.all([
      runFanoutFromCwd(fixture, worktree.worktrees[0], 'modules-a'),
      runFanoutFromCwd(fixture, worktree.worktrees[1], 'modules-b'),
    ]);
    expect(first.result.exitCode).toBe(0);
    expect(second.result.exitCode).toBe(0);
    expect(realpaths[0]).not.toBe(realpaths[1]);
    expect(realpaths).toEqual([
      realpathSync(join(worktree.worktrees[0], 'node_modules')),
      realpathSync(join(worktree.worktrees[1], 'node_modules')),
    ]);
    expect(isPathInside(realpaths[0], worktree.worktrees[0])).toBe(true);
    expect(isPathInside(realpaths[1], worktree.worktrees[1])).toBe(true);
  });

  it(FANOUT_TEST_NAMES[13], async () => {
    const fixture = useShim('success');
    const executor = parseExecutorConfig({ kind: 'cli-opencode' });
    expect(validateExecutorDispatchAllowed(executor, {
      env: { [CLI_DISPATCH_STACK_ENV]: 'cli-codex:cli-opencode' },
      ancestryCmdlines: [],
      statePaths: [],
    })).toMatchObject({
      allowed: false,
      layer: 'stack',
      reason: 'recursion-guard-stack',
    });
    const run = await runAdapterFanout(fixture, {
      mode: 'recursion',
      extraEnv: {
        SPECKIT_FANOUT_LINEAGE_ID: 'parent-lineage',
        [CLI_DISPATCH_STACK_ENV]: 'cli-codex:cli-opencode',
      },
    });
    expect(run.result.exitCode).toBe(3);
    expect(readAdapterCaptures(fixture)).toEqual([]);
  });

  it('binds convergence, maximum iterations, completion marker, artifacts, and summary status', async () => {
    const fixture = useShim('success');
    const prompt = fanoutRun.buildLoopPrompt(
      'research',
      'specs/fanout-policy',
      join(fixture.root, 'lineage'),
      'fanout-policy-session',
      { label: 'policy', kind: 'cli-opencode', model: 'anthropic/claude-opus-4-8', iterations: 2 },
      'hermetic scheduler policy',
      { stopPolicy: 'max-iterations', convergenceThreshold: 0.05 },
    );
    expect(prompt).toContain('config.stopPolicy: max-iterations');
    expect(prompt).toContain('config.maxIterations: 2');
    expect(prompt).toContain('config.convergenceThreshold: 0.05');
    expect(prompt).toContain('FANOUT_LINEAGE_COMPLETE:policy');

    const run = await runFanoutConfig(fixture, 'policy', {
      executors: [{
        label: 'policy',
        kind: 'cli-opencode',
        model: 'anthropic/claude-opus-4-8',
        reasoningEffort: 'high',
        iterations: 2,
      }],
      concurrency: 1,
      maxRetries: 0,
    }, {
      stopPolicy: 'max-iterations',
      convergenceThreshold: 0.05,
    });
    const capturePrompt = readAdapterCaptures(fixture)[0].args.at(-1) ?? '';
    const envelope = stdoutEnvelope(run.result.stdout);
    expect(run.result.exitCode).toBe(0);
    expect(capturePrompt).toContain('FANOUT_LINEAGE_COMPLETE:policy');
    expect(capturePrompt).toContain('config.stopPolicy: max-iterations');
    expect(capturePrompt).toContain('config.convergenceThreshold: 0.05');
    expect(existsSync(join(run.baseArtifactDir, 'lineages', 'policy', 'research.md'))).toBe(true);
    expect(envelope).toMatchObject({ status: 'ok' });
    expect(envelope.summary).toMatchObject({ total: 1, succeeded: 1, failed: 0 });

    const reviewFixture = useShim('success');
    const reviewRun = await runReviewFanoutConfig(reviewFixture, 'policy-review', {
      executors: [{
        label: 'policy-review',
        kind: 'cli-opencode',
        model: 'anthropic/claude-opus-4-8',
        reasoningEffort: 'high',
        iterations: 2,
      }],
      concurrency: 1,
      maxRetries: 0,
    }, {
      stopPolicy: 'max-iterations',
      convergenceThreshold: 0.1,
    });
    const reviewEnvelope = stdoutEnvelope(reviewRun.result.stdout);
    const reviewResults = reviewEnvelope.results as Array<{ error: { message: string } }>;
    expect(reviewRun.result.exitCode).toBe(3);
    expect(readAdapterCaptures(reviewFixture)).toHaveLength(1);
    expect(existsSync(join(reviewRun.baseArtifactDir, 'lineages', 'policy-review', 'review-report.md'))).toBe(true);
    expect(ledgerEvents(reviewRun.baseArtifactDir)).toEqual(expect.arrayContaining([
      expect.objectContaining({
        event: 'failed',
        error: expect.objectContaining({
          message: 'lineage policy-review violated max-iterations stop policy: '
            + 'missing deep-review-state.jsonl for max-iterations stop-policy validation',
        }),
      }),
    ]));
    expect(reviewResults[0].error.message).toContain('violated max-iterations stop policy');
  });

  it('rejects a zero-exit lineage whose required artifact is absent', async () => {
    const fixture = useShim('missing-artifact');
    const run = await runAdapterFanout(fixture, { mode: 'required-artifact' });
    const summary = readJson<{
      failed: number;
    }>(join(run.baseArtifactDir, 'orchestration-summary.json'));
    const envelope = stdoutEnvelope(run.result.stdout);
    const results = envelope.results as Array<{ error: { message: string } }>;
    expect(run.result.exitCode).toBe(3);
    expect(summary.failed).toBe(1);
    expect(results[0].error.message).toContain('did not produce expected artifact');
  });
});

it.skip(
  'live fan-out transport probe (dependency SKIP: hermetic phase forbids provider access)',
  () => {
    throw new Error('Live provider access is outside this hermetic stress phase');
  },
);

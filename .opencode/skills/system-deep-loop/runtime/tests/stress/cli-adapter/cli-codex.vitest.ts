// ───────────────────────────────────────────────────────────────────
// MODULE: CLI Codex Adapter Stress Tests
// ───────────────────────────────────────────────────────────────────

import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { spawn } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { createRequire } from 'node:module';

import { afterAll, afterEach, describe, expect, it } from 'vitest';

import { EXECUTOR_KINDS, parseExecutorConfig } from '../../../lib/deep-loop/executor-config.js';
import {
  CLI_DISPATCH_STACK_ENV,
  validateExecutorDispatchAllowed,
} from '../../../lib/deep-loop/executor-audit.js';
import modeRegistry from '../../../../../cli-external-orchestration/mode-registry.json';

import {
  CLI_ADAPTER_STRESS_MATRIX,
  CLI_ADAPTER_SUBJECTS,
  EDGE_CASE_ROWS,
} from './matrix-manifest';
import liveContracts from './live-contracts.json';
import {
  createCodexShim,
  readCodexCapture,
  withProcessEnv,
  writeExpectedLineageArtifacts,
  type CodexShimFixture,
} from './fixtures/codex-fixture';
import { preflightCodexLive } from './fixtures/live-preflight';
import { processIsAlive } from './fixtures/process-fixture';
import {
  claimOwnership,
  createIsolatedWorktrees,
  isPathInside,
  nodeModulesRealpaths,
  type IsolatedWorktreeFixture,
} from './fixtures/worktree-fixture';

const requireCjs = createRequire(import.meta.url);
const codexDispatch = requireCjs('../../../scripts/codex-dispatch.cjs') as {
  dispatchCodex(options: Record<string, unknown>): DispatchResult;
  isCodexAvailable(env?: NodeJS.ProcessEnv): boolean;
};
const fanoutRun = requireCjs('../../../scripts/fanout-run.cjs') as {
  buildLineageCommand(
    lineage: Record<string, unknown>,
    prompt: string,
    sandbox: string,
    permission: string,
    options?: Record<string, unknown>,
  ): { command: string; args: string[]; input?: string };
  evaluateLineageBudgetCap(input: Record<string, unknown>): {
    continue_allowed: boolean;
    upper_bound: { estimated_cost_units: number; max_cost_units_per_lineage: number };
  };
};

interface DispatchResult {
  readonly status: number | null;
  readonly timedOut: boolean;
  readonly lastMessage: string;
  readonly stdout: string;
  readonly stderr: string;
  readonly sandbox: string;
  readonly pid?: number;
  readonly error?: string;
}

const runtimeRoot = resolve(import.meta.dirname, '../../..');
const tempDirs: string[] = [];
const shims: CodexShimFixture[] = [];
const worktrees: IsolatedWorktreeFixture[] = [];
const observedPids = new Set<number>();
const spawnedFixturePids = new Set<number>();

function tempDir(prefix: string): string {
  const directory = mkdtempSync(join(tmpdir(), prefix));
  tempDirs.push(directory);
  return directory;
}

function useShim(mode: string): CodexShimFixture {
  const shim = createCodexShim(mode);
  shims.push(shim);
  return shim;
}

function dispatchWithShim(
  mode: string,
  overrides: Record<string, unknown> = {},
  extraEnv: NodeJS.ProcessEnv = {},
): { readonly fixture: CodexShimFixture; readonly result: DispatchResult } {
  const fixture = useShim(mode);
  const result = withProcessEnv({ ...fixture.env, ...extraEnv }, () => codexDispatch.dispatchCodex({
    prompt: 'hermetic stress prompt',
    cwd: fixture.root,
    model: 'gpt-5.6-luna',
    effort: 'high',
    tier: 'fast',
    timeoutMs: 1_000,
    ...overrides,
  }));
  return { fixture, result };
}

function codexExecutor() {
  return parseExecutorConfig({ kind: 'cli-codex' });
}

function readReapInvocations(fixture: CodexShimFixture): readonly string[][] {
  return readFileSync(fixture.reapCapturePath, 'utf8')
    .trim()
    .split('\n')
    .map((line) => JSON.parse(line) as string[]);
}

function terminateFixturePid(pid: number): void {
  if (!processIsAlive(pid)) return;
  try {
    process.kill(pid, 'SIGKILL');
  } catch {
    // The fixture exited after the liveness check.
  }
}

afterEach(() => {
  for (const fixture of shims) {
    if (!existsSync(fixture.pidPath)) continue;
    const recorded = JSON.parse(readFileSync(fixture.pidPath, 'utf8')) as Record<string, number>;
    for (const pid of Object.values(recorded)) terminateFixturePid(pid);
  }
  for (const pid of spawnedFixturePids) terminateFixturePid(pid);
  spawnedFixturePids.clear();
  for (const fixture of shims.splice(0)) fixture.cleanup();
  for (const fixture of worktrees.splice(0)) fixture.cleanup();
  for (const directory of tempDirs.splice(0)) rmSync(directory, { recursive: true, force: true });
});

afterAll(() => {
  const evidencePath = process.env.CLI_ADAPTER_STRESS_PID_EVIDENCE;
  if (!evidencePath) return;
  writeFileSync(evidencePath, JSON.stringify([...observedPids].sort((left, right) => left - right)));
});

describe.sequential('cli-codex manifest integrity', () => {
  it('reconciles the shipped external executor roster exactly', () => {
    const externalKinds = EXECUTOR_KINDS.filter((kind) => kind !== 'native').sort();
    const workflowModes = modeRegistry.modes.map((mode) => mode.workflowMode).sort();
    expect(externalKinds).toEqual(workflowModes);
    expect(EXECUTOR_KINDS).toContain('native');
    expect(workflowModes).not.toContain('native');
  });

  it('freezes fourteen rows across seven subjects with only cli-codex implemented', () => {
    expect(EDGE_CASE_ROWS).toHaveLength(14);
    expect(CLI_ADAPTER_SUBJECTS).toHaveLength(7);
    expect(CLI_ADAPTER_STRESS_MATRIX).toHaveLength(98);
    const codexCells = CLI_ADAPTER_STRESS_MATRIX.filter((cell) => cell.subject === 'cli-codex');
    expect(codexCells).toHaveLength(14);
    expect(codexCells.every((cell) => cell.testStatus === 'implemented' && cell.testName)).toBe(true);
    expect(CLI_ADAPTER_STRESS_MATRIX.filter((cell) => cell.subject !== 'cli-codex')
      .every((cell) => cell.testStatus === 'pending' && cell.testName === null)).toBe(true);
  });

  it('records every shipped fan-out and single-dispatch contract dimension', () => {
    expect(Object.keys(liveContracts)).toEqual(expect.arrayContaining([
      'assignmentModel',
      'concurrency',
      'count',
      'iterations',
      'timeout',
      'stdin',
      'budgets',
      'cleanup',
      'artifacts',
      'completionMarkers',
      'recursionGuard',
    ]));
    expect(liveContracts.childEnvironment.direct).toEqual([
      'MK_SPEC_GATE_ENFORCE=0',
      'AI_SESSION_CHILD=1',
    ]);
    expect(liveContracts.childEnvironment.fanout).toEqual([
      'MK_SPEC_GATE_DISABLED=1',
      'AI_SESSION_CHILD=1',
    ]);
  });
});

describe.sequential('cli-codex adapter contracts', () => {
  it('dispatches a successful hermetic request with explicit flags and read-only default', () => {
    const fixture = useShim('success');
    const result = withProcessEnv(fixture.env, () => codexDispatch.dispatchCodex({
      prompt: 'success prompt',
      cwd: fixture.root,
      model: 'gpt-5.6-sol',
      effort: 'xhigh',
      tier: 'priority',
      timeoutMs: 1_000,
    }));
    const capture = readCodexCapture(fixture);

    expect(result).toMatchObject({ status: 0, timedOut: false, lastMessage: 'shim-success' });
    expect(result.sandbox).toBe('read-only');
    expect(capture.args).toEqual(expect.arrayContaining([
      'exec',
      '--model',
      'gpt-5.6-sol',
      'model_reasoning_effort=xhigh',
      'service_tier=priority',
      'approval_policy=never',
      '--sandbox',
      'read-only',
      '-',
    ]));
    expect(capture.stdin).toBe('success prompt');
    expect(capture.env.AI_SESSION_CHILD).toBe('1');
  });

  it(EDGE_CASE_ROWS[0].codexTest, () => {
    const { result } = dispatchWithShim('auth-denial');
    expect(result.status).toBe(1);
    expect(result.timedOut).toBe(false);
    expect(result.stderr).toMatch(/401 Unauthorized: not authenticated/);
  });

  it(EDGE_CASE_ROWS[1].codexTest, () => {
    const { result } = dispatchWithShim('model-not-found');
    expect(result.status).toBe(1);
    expect(result.timedOut).toBe(false);
    expect(result.stderr).toMatch(/model not found or insufficient balance/);
  });

  it(EDGE_CASE_ROWS[2].codexTest, () => {
    const startedAt = Date.now();
    const { result } = dispatchWithShim('rate-limit');
    expect(result.status).toBe(1);
    expect(result.stderr).toMatch(/429 rate limit: throttled/);
    expect(Date.now() - startedAt).toBeLessThan(1_000);
  });

  it(EDGE_CASE_ROWS[3].codexTest, () => {
    const startedAt = Date.now();
    const { fixture, result } = dispatchWithShim('timeout', { timeoutMs: 150 });
    expect(result.timedOut).toBe(true);
    expect(Date.now() - startedAt).toBeLessThan(1_000);
    expect(result.pid).toBeTypeOf('number');
    observedPids.add(result.pid as number);
    expect(readReapInvocations(fixture)).toContainEqual(['-9', '-P', String(result.pid)]);
  });

  it(EDGE_CASE_ROWS[4].codexTest, () => {
    const { fixture, result } = dispatchWithShim('stdin-wait', { prompt: 'stdin must close' });
    const capture = readCodexCapture(fixture);
    expect(result).toMatchObject({ status: 0, timedOut: false, lastMessage: 'stdin-closed' });
    expect(capture.stdin).toBe('stdin must close');
  });

  it(EDGE_CASE_ROWS[5].codexTest, () => {
    const { fixture, result } = dispatchWithShim('success', {}, {
      MK_SPEC_GATE_ENFORCE: '0',
      AI_SESSION_CHILD: '1',
    });
    const capture = readCodexCapture(fixture);
    expect(result.status).toBe(0);
    expect(capture.env).toMatchObject({
      MK_SPEC_GATE_ENFORCE: '0',
      AI_SESSION_CHILD: '1',
    });
  });

  it(EDGE_CASE_ROWS[6].codexTest, () => {
    const sentinelDir = tempDir('cli-codex-read-only-');
    const sentinel = join(sentinelDir, 'sentinel.txt');
    writeFileSync(sentinel, 'unchanged\n', 'utf8');
    const defaultRun = dispatchWithShim('success');
    const writableRun = dispatchWithShim('success', { sandbox: 'workspace-write' });
    expect(defaultRun.result.sandbox).toBe('read-only');
    expect(readCodexCapture(defaultRun.fixture).args).toContain('read-only');
    expect(writableRun.result.sandbox).toBe('workspace-write');
    expect(readCodexCapture(writableRun.fixture).args).toContain('workspace-write');
    expect(readFileSync(sentinel, 'utf8')).toBe('unchanged\n');
  });

  it(EDGE_CASE_ROWS[7].codexTest, () => {
    const env = { ...process.env, PATH: '/usr/bin:/bin' };
    expect(codexDispatch.isCodexAvailable(env)).toBe(false);
    const result = withProcessEnv(env, () => codexDispatch.dispatchCodex({ prompt: 'must not spawn' }));
    expect(result).toMatchObject({
      status: null,
      timedOut: false,
      error: 'codex binary unavailable (command -v codex failed)',
    });
  });

  it(EDGE_CASE_ROWS[8].codexTest, () => {
    const fixture = useShim('success');
    const decision = fanoutRun.evaluateLineageBudgetCap({
      lineage: { kind: 'cli-codex', label: 'budgeted', iterations: 4 },
      maxRetries: 1,
      maxCostUnitsPerLineage: 7,
      costUnitsPerIteration: 1,
    });
    expect(decision.continue_allowed).toBe(false);
    expect(decision.upper_bound).toMatchObject({
      estimated_cost_units: 8,
      max_cost_units_per_lineage: 7,
    });
    expect(existsSync(fixture.capturePath)).toBe(false);
  });

  it(EDGE_CASE_ROWS[9].codexTest, () => {
    const { result } = dispatchWithShim('signal-exit');
    expect(result.status).toBeNull();
    expect(result.timedOut).toBe(true);
    expect(result.lastMessage).toBe('');
  });

  it(EDGE_CASE_ROWS[10].codexTest, () => {
    const fixture = useShim('orphan-tree');
    const unrelated = useShim('timeout');
    const unrelatedProcess = spawn(
      join(unrelated.binDir, 'codex'),
      ['exec', '-'],
      { cwd: unrelated.root, env: unrelated.env, stdio: ['pipe', 'ignore', 'ignore'] },
    );
    unrelatedProcess.stdin.end('unrelated fixture');
    if (unrelatedProcess.pid !== undefined) spawnedFixturePids.add(unrelatedProcess.pid);

    const result = withProcessEnv(fixture.env, () => codexDispatch.dispatchCodex({
      prompt: 'adapter orphan fixture',
      cwd: fixture.root,
      timeoutMs: 750,
    }));
    const recorded = JSON.parse(readFileSync(fixture.pidPath, 'utf8')) as {
      root: number;
      child: number;
      grandchild: number;
    };
    observedPids.add(recorded.root);
    observedPids.add(recorded.child);
    observedPids.add(recorded.grandchild);
    if (unrelatedProcess.pid !== undefined) observedPids.add(unrelatedProcess.pid);
    expect(result.timedOut).toBe(true);
    expect(result.pid).toBe(recorded.root);
    expect(readReapInvocations(fixture)).toContainEqual(['-9', '-P', String(recorded.root)]);
    expect(processIsAlive(recorded.root)).toBe(false);
    expect(processIsAlive(recorded.grandchild)).toBe(true);
    expect(unrelatedProcess.pid).toBeTypeOf('number');
    expect(processIsAlive(unrelatedProcess.pid as number)).toBe(true);

    process.kill(recorded.grandchild, 'SIGKILL');
    unrelatedProcess.kill('SIGKILL');
  });

  it(EDGE_CASE_ROWS[11].codexTest, () => {
    const fixture = createIsolatedWorktrees();
    worktrees.push(fixture);
    const first = dispatchWithShim('success', { cwd: fixture.worktrees[0] });
    const second = dispatchWithShim('success', { cwd: fixture.worktrees[1] });
    expect(readCodexCapture(first.fixture)).toMatchObject({ cwd: realpathSync(fixture.worktrees[0]) });
    expect(readCodexCapture(second.fixture)).toMatchObject({ cwd: realpathSync(fixture.worktrees[1]) });
  });

  it(EDGE_CASE_ROWS[12].codexTest, () => {
    const fixture = createIsolatedWorktrees();
    worktrees.push(fixture);
    const [firstRealpath, secondRealpath] = nodeModulesRealpaths(fixture.worktrees);
    const first = dispatchWithShim('success', { cwd: fixture.worktrees[0] });
    const second = dispatchWithShim('success', { cwd: fixture.worktrees[1] });
    expect(readCodexCapture(first.fixture)).toMatchObject({ cwd: realpathSync(fixture.worktrees[0]) });
    expect(readCodexCapture(second.fixture)).toMatchObject({ cwd: realpathSync(fixture.worktrees[1]) });
    expect(firstRealpath).not.toBe(secondRealpath);
    expect(isPathInside(firstRealpath, fixture.worktrees[0])).toBe(true);
    expect(isPathInside(secondRealpath, fixture.worktrees[1])).toBe(true);
  });

  it(EDGE_CASE_ROWS[13].codexTest, () => {
    const fixture = useShim('success');
    const verdict = validateExecutorDispatchAllowed(codexExecutor(), {
      env: { [CLI_DISPATCH_STACK_ENV]: 'cli-opencode:cli-codex' },
      ancestryCmdlines: [],
      statePaths: [],
    });
    expect(verdict).toMatchObject({
      allowed: false,
      layer: 'stack',
      reason: 'recursion-guard-stack',
    });
    expect(existsSync(fixture.capturePath)).toBe(false);
  });

  it('rejects malformed last-message output deterministically', () => {
    const { result } = dispatchWithShim('malformed-output');
    expect(result.status).toBe(0);
    expect(() => JSON.parse(result.lastMessage)).toThrow();
  });

  it('exposes a missing last-message artifact instead of fabricating output', () => {
    const { result } = dispatchWithShim('missing-artifact');
    expect(result).toMatchObject({ status: 0, timedOut: false, lastMessage: '' });
  });

  it('captures a deterministic non-zero shim exit', () => {
    const { result } = dispatchWithShim('non-zero');
    expect(result.status).toBe(23);
    expect(result.stderr).toMatch(/synthetic non-zero exit/);
  });

  it('creates the expected isolated lineage artifact shape', () => {
    const root = tempDir('cli-codex-artifacts-');
    const artifacts = writeExpectedLineageArtifacts(root, 2);
    expect(artifacts).toHaveLength(4);
    expect(artifacts.every((artifact) => existsSync(artifact))).toBe(true);
    expect(readFileSync(join(root, 'logs', 'fanout-lineage.out'), 'utf8'))
      .toContain('FANOUT_LINEAGE_COMPLETE:fixture');
  });

  it('builds the fan-out codex command from the same flag and stdin contract', () => {
    const fixture = useShim('success');
    const built = fanoutRun.buildLineageCommand({
      kind: 'cli-codex',
      model: 'gpt-5.6-terra',
      reasoningEffort: 'max',
      serviceTier: 'priority',
      liveTools: { webSearch: 'inherit' },
    }, 'lineage prompt', 'read-only', 'plan', { env: fixture.env, executableVersion: 'shim' });
    expect(built.command).toBe('codex');
    expect(built.input).toBe('lineage prompt');
    expect(built.args).toEqual(expect.arrayContaining([
      '--model',
      'gpt-5.6-terra',
      'model_reasoning_effort=max',
      'service_tier=priority',
      'approval_policy=never',
      '--sandbox',
      'read-only',
      '-',
    ]));
  });

  it('preflights binary, auth, child gate, and dependency isolation hermetically', () => {
    const fixture = useShim('success');
    const isolatedRuntime = join(fixture.root, 'runtime');
    mkdirSync(join(isolatedRuntime, 'node_modules'), { recursive: true });
    const cleanEnv = Object.fromEntries(
      Object.entries(fixture.env).filter(([key]) => key !== 'CODEX_SESSION_ID' && !key.startsWith('CODEX_')),
    );
    Object.assign(cleanEnv, {
      PATH: fixture.env.PATH,
      CLI_ADAPTER_SHIM_MODE: 'success',
      CLI_ADAPTER_SHIM_CAPTURE: fixture.capturePath,
      CLI_ADAPTER_SHIM_PID_FILE: fixture.pidPath,
      MK_SPEC_GATE_ENFORCE: '0',
      AI_SESSION_CHILD: '1',
    });
    expect(preflightCodexLive({
      enabled: true,
      env: cleanEnv,
      runtimeRoot: isolatedRuntime,
    })).toEqual({ ready: true, reason: null });
  });
});

describe.sequential('cli-codex fixture integrity', () => {
  it('enforces exclusive ownership claims between worktree fixtures', () => {
    const fixture = createIsolatedWorktrees();
    worktrees.push(fixture);
    const claim = join(fixture.root, 'shared-owner.lock');
    claimOwnership(claim, fixture.worktrees[0]);
    expect(() => claimOwnership(claim, fixture.worktrees[1])).toThrow(/EEXIST/);
    expect(readFileSync(claim, 'utf8')).toBe(fixture.worktrees[0]);
  });

  it('creates independent node_modules realpaths for worktree fixtures', () => {
    const fixture = createIsolatedWorktrees();
    worktrees.push(fixture);
    const [firstRealpath, secondRealpath] = nodeModulesRealpaths(fixture.worktrees);
    expect(firstRealpath).not.toBe(secondRealpath);
    expect(isPathInside(firstRealpath, fixture.worktrees[0])).toBe(true);
    expect(isPathInside(secondRealpath, fixture.worktrees[1])).toBe(true);
  });
});

const livePreflight = preflightCodexLive({
  enabled: process.env.DEEP_LOOP_CLI_CODEX_LIVE === '1',
  env: process.env,
  runtimeRoot,
});
const liveTestName = livePreflight.ready
  ? 'runs the opt-in live read-only codex probe after preflight'
  : `live read-only codex probe (dependency SKIP: ${livePreflight.reason})`;

it.skipIf(!livePreflight.ready)(liveTestName, () => {
  const result = codexDispatch.dispatchCodex({
    prompt: 'Return exactly: CLI_CODEX_LIVE_OK',
    cwd: runtimeRoot,
    sandbox: 'read-only',
    timeoutMs: 30_000,
  });
  expect(result).toMatchObject({ status: 0, timedOut: false });
  expect(result.lastMessage).toContain('CLI_CODEX_LIVE_OK');
});

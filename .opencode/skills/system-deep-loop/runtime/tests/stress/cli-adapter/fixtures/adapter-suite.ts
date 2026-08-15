// ───────────────────────────────────────────────────────────────────
// MODULE: CLI Adapter Stress Suite Factory
// ───────────────────────────────────────────────────────────────────

import {
  existsSync,
  realpathSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';

import { afterAll, afterEach, describe, expect, it } from 'vitest';

import {
  CLI_ADAPTER_MATRIX_AUDIT,
  CLI_ADAPTER_PHASE_TWO_ROWS,
  EDGE_CASE_ROWS,
} from '../matrix-manifest';
import {
  CLI_DISPATCH_STACK_ENV,
  validateExecutorDispatchAllowed,
} from '../../../../lib/deep-loop/executor-audit.js';
import {
  parseExecutorConfig,
  resolveClaudePermissionMode,
} from '../../../../lib/deep-loop/executor-config.js';
import { processIsAlive, runBoundedProcess } from './process-fixture';
import {
  claimOwnership,
  createIsolatedWorktrees,
  isPathInside,
  nodeModulesRealpaths,
  type IsolatedWorktreeFixture,
} from './worktree-fixture';
import {
  MODEL_BY_KIND,
  adapterBinary,
  createAdapterShim,
  preflightAdapterLive,
  readAdapterCaptures,
  readRecordedPids,
  runAdapterFanout,
  type AdapterKind,
  type AdapterShimFixture,
} from './adapter-fixture';

const requireCjs = createRequire(import.meta.url);
const fanoutRun = requireCjs('../../../../scripts/fanout-run.cjs') as {
  buildLineageCommand(
    lineage: Record<string, unknown>,
    prompt: string,
    sandbox: string,
    permission: string,
    options?: Record<string, unknown>,
  ): { command: string; args: string[]; input?: string };
};

function lineageFor(kind: AdapterKind): Record<string, unknown> {
  return {
    kind,
    model: MODEL_BY_KIND[kind],
    ...(kind === 'cli-opencode' || kind === 'cli-pi' || kind === 'cli-claude-code'
      ? { reasoningEffort: 'high' }
      : {}),
  };
}

function directSandbox(kind: AdapterKind): string {
  return kind === 'cli-opencode' ? 'danger-full-access' : 'workspace-write';
}

function authEnv(kind: AdapterKind): NodeJS.ProcessEnv {
  switch (kind) {
    case 'cli-opencode':
      return { OPENCODE_API_KEY: 'shim-opencode-token' };
    case 'cli-claude-code':
      return { ANTHROPIC_API_KEY: 'shim-anthropic-token' };
    case 'cli-devin':
      return { DEVIN_API_KEY: 'shim-devin-token' };
    case 'cli-cursor':
      return { CURSOR_AUTH_TOKEN: 'shim-cursor-token' };
    case 'cli-pi':
      return {};
  }
}

function expectSuccessArgs(kind: AdapterKind, args: readonly string[]): void {
  switch (kind) {
    case 'cli-opencode':
      expect(args).toEqual(expect.arrayContaining([
        'run', '--model', MODEL_BY_KIND[kind], '--format', 'json',
        '--dir', '--dangerously-skip-permissions', '--variant', 'high',
      ]));
      break;
    case 'cli-pi':
      expect(args).toEqual(expect.arrayContaining([
        '-p', '--offline', '--model', `openai-codex/${MODEL_BY_KIND[kind]}`,
        '--thinking', 'high',
      ]));
      break;
    case 'cli-claude-code':
      expect(args).toEqual(expect.arrayContaining([
        '-p', '--model', MODEL_BY_KIND[kind], '--permission-mode', 'acceptEdits',
        '--output-format', 'text', '--effort', 'high',
      ]));
      break;
    case 'cli-devin':
      expect(args).toEqual(expect.arrayContaining([
        '-p', '--model', MODEL_BY_KIND[kind], '--permission-mode', 'dangerous', '--sandbox',
      ]));
      break;
    case 'cli-cursor':
      expect(args).toEqual(expect.arrayContaining([
        '-p', '--output-format', 'text', '--model', MODEL_BY_KIND[kind],
        '--force', '--sandbox', 'enabled',
      ]));
      expect(args).not.toContain('--auto-review');
      break;
  }
}

function fanoutLog(lineageDir: string): string {
  const logPath = `${lineageDir}/logs/fanout-lineage.out`;
  return existsSync(logPath) ? readFileSync(logPath, 'utf8') : '';
}

function fanoutLedger(baseArtifactDir: string): readonly Record<string, unknown>[] {
  const ledgerPath = `${baseArtifactDir}/orchestration-status.log`;
  if (!existsSync(ledgerPath)) return [];
  return readFileSync(ledgerPath, 'utf8')
    .trim()
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line) as Record<string, unknown>);
}

function maximumInFlight(events: readonly Record<string, unknown>[]): number {
  let inFlight = 0;
  let maximum = 0;
  for (const event of events) {
    if (event.event === 'started') {
      inFlight += 1;
      maximum = Math.max(maximum, inFlight);
    } else if (event.event === 'completed' || (event.event === 'failed' && event.terminal !== false)) {
      inFlight -= 1;
    }
  }
  return maximum;
}

async function waitUntilDead(pids: readonly number[]): Promise<void> {
  const deadline = Date.now() + 1_000;
  while (Date.now() < deadline) {
    if (pids.every((pid) => !processIsAlive(pid))) return;
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
}

export function defineAdapterStressSuite(kind: AdapterKind): void {
  const fixtures: AdapterShimFixture[] = [];
  const worktrees: IsolatedWorktreeFixture[] = [];
  const observedPids = new Set<number>();
  const matrixCells = CLI_ADAPTER_PHASE_TWO_ROWS.filter((cell) => cell.subject === kind);
  const testName = (index: number): string => matrixCells[index]?.testName
    ?? `missing matrix test name for ${kind} row ${index}`;

  function useShim(mode: string): AdapterShimFixture {
    const fixture = createAdapterShim(kind, mode);
    fixtures.push(fixture);
    return fixture;
  }

  function buildCommand(
    fixture: AdapterShimFixture,
    sandbox: string,
    cwd = fixture.root,
  ): { command: string; args: string[]; input?: string } {
    return fanoutRun.buildLineageCommand(
      lineageFor(kind),
      'hermetic adapter prompt',
      sandbox,
      resolveClaudePermissionMode(sandbox as 'read-only' | 'workspace-write' | 'danger-full-access'),
      { env: fixture.env, cwd, executableVersion: 'shim' },
    );
  }

  async function runBuiltCommand(
    fixture: AdapterShimFixture,
    cwd: string,
    sandbox = directSandbox(kind),
  ) {
    const built = buildCommand(fixture, sandbox, cwd);
    return runBoundedProcess(built.command, built.args, {
      cwd,
      env: fixture.env,
      input: built.input,
      timeoutMs: 1_000,
      descendantPidFile: fixture.pidPath,
    });
  }

  afterEach(() => {
    for (const fixture of fixtures) {
      for (const pid of Object.values(readRecordedPids(fixture))) {
        if (!processIsAlive(pid)) continue;
        try {
          process.kill(pid, 'SIGKILL');
        } catch {
          // The fixture completed during the final liveness probe.
        }
      }
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

  describe.sequential(`${kind} manifest integrity`, () => {
    it('binds exactly fourteen implemented adapter cells without forbidden overclaims', () => {
      expect(EDGE_CASE_ROWS).toHaveLength(14);
      expect(matrixCells).toHaveLength(14);
      expect(matrixCells.every((cell) => cell.testStatus === 'implemented' && cell.testName)).toBe(true);
      expect(CLI_ADAPTER_MATRIX_AUDIT).toEqual({
        allAdapterBound: true,
        allSubjectBound: true,
        forbiddenOverclaims: [],
      });
    });
  });

  describe.sequential(`${kind} adapter contracts`, () => {
    it('completes a hermetic lineage through the shipped builder and fan-out runtime', async () => {
      const fixture = useShim('success');
      const run = await runAdapterFanout(fixture, { extraEnv: authEnv(kind) });
      const captures = readAdapterCaptures(fixture);
      expect(run.result).toMatchObject({ exitCode: 0, timedOut: false });
      expect(captures).toHaveLength(1);
      expectSuccessArgs(kind, captures[0].args);
      expect(captures[0].env).toMatchObject({
        AI_SESSION_CHILD: '1',
        MK_SPEC_GATE_ENFORCE: '0',
        MK_SPEC_GATE_DISABLED: '1',
      });
      expect(existsSync(`${run.lineageDir}/research.md`)).toBe(true);
      if (kind === 'cli-claude-code') {
        expect(captures[0].env.CLAUDE_CONFIG_DIR).toMatch(/\.claude-stress$/);
        expect(captures[0].env.ANTHROPIC_API_KEY).toBe('shim-anthropic-token');
      }
      if (kind === 'cli-devin') {
        expect(captures[0].env).toMatchObject({ DEVIN_API_KEY: 'shim-devin-token' });
      }
      if (kind === 'cli-cursor') {
        expect(captures[0].env).toMatchObject({ CURSOR_AUTH_TOKEN: 'shim-cursor-token' });
      }
    });

    it(testName(0), async () => {
      const fixture = useShim('auth-denial');
      const run = await runAdapterFanout(fixture, { mode: 'auth' });
      expect(run.result.exitCode).not.toBe(0);
      expect(fanoutLog(run.lineageDir)).toContain(`${kind} OAuth authentication unavailable`);
    });

    it(testName(1), async () => {
      const fixture = useShim('model-not-found');
      const run = await runAdapterFanout(fixture, { mode: 'model' });
      expect(run.result.exitCode).not.toBe(0);
      expect(fanoutLog(run.lineageDir)).toContain('model not found or insufficient balance');
    });

    it(testName(2), async () => {
      const fixture = useShim('rate-limit');
      const startedAt = Date.now();
      const run = await runAdapterFanout(fixture, { mode: 'rate-limit' });
      expect(run.result.exitCode).not.toBe(0);
      expect(fanoutLog(run.lineageDir)).toContain('429 rate limit: throttled');
      expect(readAdapterCaptures(fixture)).toHaveLength(1);
      expect(Date.now() - startedAt).toBeLessThan(2_000);
    });

    it(testName(3), async () => {
      const fixture = useShim('timeout');
      const startedAt = Date.now();
      const run = await runAdapterFanout(fixture, { mode: 'timeout', timeoutSeconds: 1 });
      const pids = Object.values(readRecordedPids(fixture));
      pids.forEach((pid) => observedPids.add(pid));
      await waitUntilDead(pids);
      expect(run.result.exitCode).not.toBe(0);
      expect(run.result.timedOut).toBe(false);
      expect(Date.now() - startedAt).toBeLessThan(5_000);
      expect(pids.length).toBeGreaterThan(0);
      expect(pids.every((pid) => !processIsAlive(pid))).toBe(true);
    });

    it(testName(4), async () => {
      const fixture = useShim('stdin-wait');
      const run = await runAdapterFanout(fixture, { mode: 'stdin' });
      const capture = readAdapterCaptures(fixture)[0];
      expect(run.result.exitCode).toBe(0);
      expect(capture.stdin).toBe('');
      expect(fanoutLog(run.lineageDir)).toContain('stdin-closed:0');
    });

    it(testName(5), async () => {
      const fixture = useShim('success');
      const run = await runAdapterFanout(fixture, { mode: 'gate' });
      expect(run.result.exitCode).toBe(0);
      expect(readAdapterCaptures(fixture)[0].env).toMatchObject({
        MK_SPEC_GATE_ENFORCE: '0',
        MK_SPEC_GATE_DISABLED: '1',
        AI_SESSION_CHILD: '1',
      });
    });

    it(testName(6), async () => {
      const fixture = useShim('success');
      if (kind === 'cli-opencode') {
        const result = await runBuiltCommand(fixture, fixture.root, 'danger-full-access');
        expect(result.status).toBe(0);
        expect(readAdapterCaptures(fixture)[0].args).toContain('--dangerously-skip-permissions');
        return;
      }
      const readOnly = await runBuiltCommand(fixture, fixture.root, 'read-only');
      expect(readOnly.status).toBe(0);
      const readOnlyArgs = readAdapterCaptures(fixture)[0].args;
      if (kind === 'cli-pi') {
        expect(readOnlyArgs).toEqual(expect.arrayContaining([
          '--tools', 'read,grep,find,ls', '--no-extensions', '--no-skills', '--no-prompt-templates',
        ]));
      } else if (kind === 'cli-claude-code') {
        expect(readOnlyArgs).toEqual(expect.arrayContaining(['--permission-mode', 'plan']));
      } else if (kind === 'cli-devin') {
        expect(readOnlyArgs).toEqual(expect.arrayContaining(['--permission-mode', 'auto']));
        expect(readOnlyArgs).not.toContain('--sandbox');
      } else {
        expect(readOnlyArgs).toEqual(expect.arrayContaining(['--mode', 'plan', '--trust']));
        expect(readOnlyArgs).not.toContain('--force');
      }
    });

    it(testName(7), async () => {
      const fixture = useShim('success');
      const run = await runAdapterFanout(fixture, {
        mode: 'missing-transport',
        includeTransport: false,
      });
      expect(run.result.exitCode).not.toBe(0);
      expect(readAdapterCaptures(fixture)).toEqual([]);
    });

    it(testName(8), async () => {
      const fixture = useShim('success');
      buildCommand(fixture, directSandbox(kind));
      const run = await runAdapterFanout(fixture, {
        mode: 'budget',
        iterations: 2,
        maxCostUnitsPerLineage: 1,
        costUnitsPerIteration: 1,
      });
      expect(run.result.exitCode).not.toBe(0);
      expect(`${run.result.stdout}\n${run.result.stderr}`).toMatch(/budget|max.cost.units/i);
      expect(readAdapterCaptures(fixture)).toEqual([]);
    });

    it(testName(9), async () => {
      const fixture = useShim('signal-exit');
      const run = await runAdapterFanout(fixture, { mode: 'signal' });
      const pids = Object.values(readRecordedPids(fixture));
      pids.forEach((pid) => observedPids.add(pid));
      await waitUntilDead(pids);
      expect(run.result.exitCode).not.toBe(0);
      expect(pids.every((pid) => !processIsAlive(pid))).toBe(true);
    });

    it(testName(10), async () => {
      const fixture = useShim('orphan-tree');
      const run = await runAdapterFanout(fixture, {
        mode: 'orphan',
        timeoutSeconds: 1,
      });
      const pids = Object.values(readRecordedPids(fixture));
      pids.forEach((pid) => observedPids.add(pid));
      await waitUntilDead(pids);
      expect(run.result.exitCode).not.toBe(0);
      expect(pids).toHaveLength(3);
      expect(pids.every((pid) => !processIsAlive(pid))).toBe(true);
    });

    it(testName(11), async () => {
      const fixture = useShim('success');
      const worktree = createIsolatedWorktrees();
      worktrees.push(worktree);
      const first = await runBuiltCommand(fixture, worktree.worktrees[0]);
      const second = await runBuiltCommand(fixture, worktree.worktrees[1]);
      expect(first.status).toBe(0);
      expect(second.status).toBe(0);
      expect(readAdapterCaptures(fixture).map((capture) => capture.cwd)).toEqual([
        realpathSync(worktree.worktrees[0]),
        realpathSync(worktree.worktrees[1]),
      ]);
    });

    it(testName(12), async () => {
      const fixture = useShim('success');
      const worktree = createIsolatedWorktrees();
      worktrees.push(worktree);
      const realpaths = nodeModulesRealpaths(worktree.worktrees);
      await runBuiltCommand(fixture, worktree.worktrees[0]);
      await runBuiltCommand(fixture, worktree.worktrees[1]);
      expect(realpaths[0]).not.toBe(realpaths[1]);
      expect(isPathInside(realpaths[0], worktree.worktrees[0])).toBe(true);
      expect(isPathInside(realpaths[1], worktree.worktrees[1])).toBe(true);
      expect(readAdapterCaptures(fixture)).toHaveLength(2);
    });

    it(testName(13), async () => {
      const fixture = useShim('success');
      buildCommand(fixture, directSandbox(kind));
      const executor = parseExecutorConfig({ kind });
      expect(validateExecutorDispatchAllowed(executor, {
        env: { [CLI_DISPATCH_STACK_ENV]: `cli-codex:${kind}` },
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
          SPECKIT_FANOUT_LINEAGE_ID: 'outer-lineage',
          [CLI_DISPATCH_STACK_ENV]: `cli-codex:${kind}`,
        },
      });
      expect(run.result.exitCode).not.toBe(0);
      expect(readAdapterCaptures(fixture)).toEqual([]);
    });

    if (kind === 'cli-opencode') {
      it('bounds three detached opencode replicas at concurrency two and queues the third', async () => {
        const fixture = useShim('success');
        const run = await runAdapterFanout(fixture, {
          label: 'parallel',
          mode: 'parallel',
          count: 3,
          concurrency: 2,
        });
        const captures = readAdapterCaptures(fixture);
        const events = fanoutLedger(run.baseArtifactDir);
        const thirdStarted = events.findIndex((event) => event.event === 'started' && event.label === 'parallel-3');
        expect(run.result.exitCode).toBe(0);
        expect(captures).toHaveLength(3);
        expect(new Set(captures.map((capture) => capture.pid)).size).toBe(3);
        expect(maximumInFlight(events)).toBe(2);
        expect(thirdStarted).toBeGreaterThan(0);
        expect(events.slice(0, thirdStarted).some((event) => event.event === 'completed')).toBe(true);
        expect(existsSync(`${run.baseArtifactDir}/lineages/parallel-1/research.md`)).toBe(true);
        expect(existsSync(`${run.baseArtifactDir}/lineages/parallel-2/research.md`)).toBe(true);
        expect(existsSync(`${run.baseArtifactDir}/lineages/parallel-3/research.md`)).toBe(true);
      });
    }

    if (kind === 'cli-pi') {
      it('accepts a non-zero pi exit only when artifacts exist and retains provider output', async () => {
        const fixture = useShim('non-zero-artifact');
        const run = await runAdapterFanout(fixture, { mode: 'nonzero-artifact' });
        expect(run.result.exitCode).toBe(0);
        expect(existsSync(`${run.lineageDir}/research.md`)).toBe(true);
        expect(fanoutLog(run.lineageDir)).toContain('provider diagnostic retained');
      });

      it('rejects a zero-exit pi run when the required artifact is absent', async () => {
        const fixture = useShim('missing-artifact');
        const run = await runAdapterFanout(fixture, { mode: 'missing-artifact' });
        expect(run.result.exitCode).not.toBe(0);
        expect(existsSync(`${run.lineageDir}/research.md`)).toBe(false);
      });
    }

    if (kind === 'cli-devin') {
      it('keeps the captured Devin failure diagnostic bounded', async () => {
        const fixture = useShim('model-not-found');
        const run = await runAdapterFanout(fixture, { mode: 'bounded-output' });
        const output = fanoutLog(run.lineageDir);
        expect(output).toContain('model not found or insufficient balance');
        expect(Buffer.byteLength(output)).toBeLessThan(1_024);
      });
    }
  });

  describe.sequential(`${kind} fixture integrity`, () => {
    it('enforces exclusive ownership without counting the check as an adapter cell', () => {
      const fixture = createIsolatedWorktrees();
      worktrees.push(fixture);
      const claim = `${fixture.root}/owner.lock`;
      claimOwnership(claim, fixture.worktrees[0]);
      expect(() => claimOwnership(claim, fixture.worktrees[1])).toThrow(/EEXIST/);
    });
  });

  const livePreflight = preflightAdapterLive(kind, process.env);
  const liveName = livePreflight.ready
    ? `runs the opt-in live ${kind} transport probe`
    : `live ${kind} transport probe (dependency SKIP: ${livePreflight.reason})`;

  it.skipIf(!livePreflight.ready)(liveName, () => {
    const result = spawnSync(adapterBinary(kind), ['--version'], {
      env: process.env,
      encoding: 'utf8',
      timeout: 2_000,
      input: '',
    });
    expect(result.status).toBe(0);
  });
}

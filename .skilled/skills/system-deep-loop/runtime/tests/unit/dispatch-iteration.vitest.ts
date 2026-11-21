// ───────────────────────────────────────────────────────────────────
// MODULE: Dispatch Iteration CLI Tests
// ───────────────────────────────────────────────────────────────────
//
// The workflow branches hand every executor kind to one script, so the
// refusals that used to live in separate inline bodies must survive the
// move. These cases pin the dispatch-free exits that a wrong branch or a
// permissive parser would otherwise turn into a real dispatch.

import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import {
  chmodSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  realpathSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { HOST_SESSION_EXECUTOR_ENV, detectFromAncestry } from '../../lib/deep-loop/executor-audit.js';
import { EXECUTOR_KINDS as CONFIGURED_EXECUTOR_KINDS } from '../../lib/deep-loop/executor-config.js';

const here = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(here, '..', '..', '..', '..', '..', '..');
const SCRIPT = resolve(here, '..', '..', 'scripts', 'dispatch-iteration.cjs');
const requireCjs = createRequire(import.meta.url);
const dispatcher = requireCjs(SCRIPT) as {
  buildClaudeDispatch: (context: Record<string, unknown>) => {
    args: string[];
    echoStdout?: boolean;
    executor: { model: string | null; sandboxMode: string | null };
    onStdout: (stdout: string) => void;
  };
  buildContext: (values: Record<string, string>) => Record<string, unknown>;
};
const {
  CLAUDE_DEFAULT_MODEL,
  CODEX_DEFAULT_MODEL,
  CURSOR_DEFAULT_MODEL,
  DEVIN_DEFAULT_MODEL,
  DSH_DEFAULT_MODEL,
  OPENCODE_DEFAULT_MODEL,
  PI_DEFAULT_MODEL,
} = requireCjs(
  resolve(here, '..', '..', 'scripts', 'fanout-run.cjs'),
) as Record<string, string>;

const EXECUTOR_KINDS = [
  'native',
  'cli-codex',
  'cli-claude-code',
  'cli-opencode',
  'cli-cursor',
  'cli-devin',
  'cli-pi',
  'cli-deepseek-harness',
];

function runScript(args: string[]): { status: number | null; stderr: string; stdout: string } {
  const result = spawnSync(process.execPath, [SCRIPT, ...args], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    timeout: 60_000,
  });
  return {
    status: result.status,
    stderr: result.stderr ?? '',
    stdout: result.stdout ?? '',
  };
}

describe('dispatch-iteration CLI refusals', () => {
  it('exits 64 and names every supported executor kind for an unknown executor', () => {
    const result = runScript(['--executor', 'unknown']);

    expect(result.status).toBe(64);
    expect(result.stderr).toContain("unknown executor kind 'unknown'");
    for (const kind of EXECUTOR_KINDS) {
      expect(result.stderr).toContain(kind);
    }
  });

  // Every flag but --spec-folder, so the usage check is the first thing that fails.
  const harnessFlags = [
    '--executor', 'cli-deepseek-harness', '--loop-type', 'research', '--repo-root', '.',
    '--prompt-file', 'prompt.md', '--state-log', 'state.jsonl', '--packet-dir', 'packet',
    '--artifact-dir', 'packet', '--iteration', '1', '--generation', '1', '--session-id', 's',
    '--model', 'null', '--reasoning-effort', 'null', '--service-tier', 'null',
    '--sandbox-mode', 'null', '--timeout-seconds', '60',
  ];

  it('requires --spec-folder for a single cli-deepseek-harness lineage', () => {
    const result = runScript(harnessFlags);

    expect(result.status).toBe(64);
    expect(result.stderr).toContain("missing required flag '--spec-folder'");
    expect(result.stderr).not.toContain('runs only as a fan-out lineage');
  });

  it('rejects --spec-folder for an executor other than cli-deepseek-harness', () => {
    const flags = [...harnessFlags];
    flags[1] = 'cli-pi';
    const result = runScript([...flags, '--spec-folder', 'specs/x']);

    expect(result.status).toBe(64);
    expect(result.stderr).toContain("flag '--spec-folder' is only valid with --executor cli-deepseek-harness");
  });

  it('exits 64 for native because native dispatch belongs to the orchestrator', () => {
    const result = runScript(['--executor', 'native']);

    expect(result.status).toBe(64);
    expect(result.stderr).toContain('has no native path');
  });

  it('exits 64 when a real executor kind is missing its required flags', () => {
    const result = runScript(['--executor', 'cli-cursor', '--loop-type', 'research']);

    expect(result.status).toBe(64);
    expect(result.stderr).toContain('Usage: dispatch-iteration.cjs');
    expect(result.stderr).toContain("missing required flag '--repo-root'");
  });
});

// ───────────────────────────────────────────────────────────────────
// MODULE: Dispatch Iteration --claude-config-dir Contract
// ───────────────────────────────────────────────────────────────────
//
// A dispatched Claude reads its credentials and settings from the config
// directory, so the flag decides which account an iteration runs under. The
// contract differs by loop type: review requires it, research accepts it and
// falls back to the inherited environment when it is empty. These cases assert
// what the child actually saw, through a recorder shim on PATH, rather than
// what the script intended to pass.

describe('dispatch-iteration --claude-config-dir', () => {
  const tempDirs: string[] = [];

  // The recursion guard refuses a nested Claude dispatch, so these cases can
  // only run outside a Claude Code process tree.
  const underClaudeAncestry = detectFromAncestry('cli-claude-code');

  afterEach(() => {
    for (const dir of tempDirs.splice(0)) {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  type Fixture = {
    root: string;
    recordPath: string;
    configuredDir: string;
    inheritedDir: string;
  };

  // The shim records the config dir the child inherited, so a case can tell an
  // explicit flag from the value the parent environment already carried.
  function createFixture(): Fixture {
    const root = mkdtempSync(join(tmpdir(), 'dispatch-cfg-'));
    tempDirs.push(root);
    const recordPath = join(root, 'record.json');
    const binDir = join(root, 'bin');
    mkdirSync(binDir);
    mkdirSync(join(root, 'packet'));
    writeFileSync(join(root, 'prompt.md'), 'fixture prompt\n', 'utf8');
    writeFileSync(join(root, 'state.jsonl'), '', 'utf8');
    const configuredDir = join(root, '.claude-configured');
    const inheritedDir = join(root, '.claude-inherited');
    mkdirSync(configuredDir);
    mkdirSync(inheritedDir);
    const shimPath = join(binDir, 'claude');
    writeFileSync(
      shimPath,
      '#!/usr/bin/env node\n'
        + "const fs = require('node:fs');\n"
        + `fs.writeFileSync(${JSON.stringify(recordPath)}, `
        + 'JSON.stringify({ claudeConfigDir: process.env.CLAUDE_CONFIG_DIR ?? null }));\n'
        + "process.stdout.write('done\\n');\n"
        + 'process.exit(0);\n',
      'utf8',
    );
    chmodSync(shimPath, 0o755);
    return { root, recordPath, configuredDir, inheritedDir };
  }

  function baseFlags(
    fixture: Fixture,
    loopType: 'research' | 'review',
    promptFile?: string,
  ): string[] {
    return [
      '--executor', 'cli-claude-code',
      '--loop-type', loopType,
      '--repo-root', REPO_ROOT,
      '--prompt-file', promptFile ?? join(fixture.root, 'prompt.md'),
      '--state-log', join(fixture.root, 'state.jsonl'),
      '--packet-dir', join(fixture.root, 'packet'),
      '--artifact-dir', join(fixture.root, 'packet'),
      '--iteration', '1',
      '--generation', '1',
      '--session-id', 's',
      '--model', 'sonnet',
      '--reasoning-effort', 'null',
      '--service-tier', 'null',
      '--sandbox-mode', 'null',
      '--timeout-seconds', '60',
    ];
  }

  function runDispatch(
    fixture: Fixture,
    args: string[],
  ): { status: number | null; stderr: string; stdout: string } {
    const result = spawnSync(process.execPath, [SCRIPT, ...args], {
      cwd: REPO_ROOT,
      encoding: 'utf8',
      timeout: 60_000,
      env: {
        PATH: `${join(fixture.root, 'bin')}:${process.env.PATH}`,
        HOME: fixture.root,
        TMPDIR: process.env.TMPDIR,
        CLAUDE_CONFIG_DIR: fixture.inheritedDir,
      },
    });
    return {
      status: result.status,
      stderr: result.stderr ?? '',
      stdout: result.stdout ?? '',
    };
  }

  // Both sides are resolved because the temp root is a symlinked path on macOS.
  function recordedConfigDir(recordPath: string): string | null {
    const record = JSON.parse(readFileSync(recordPath, 'utf8')) as {
      claudeConfigDir: string | null;
    };
    return record.claudeConfigDir === null ? null : realpathSync(record.claudeConfigDir);
  }

  it('requires --claude-config-dir for a cli-claude-code review dispatch', () => {
    const fixture = createFixture();
    const result = runDispatch(fixture, baseFlags(fixture, 'review'));

    expect(result.status).toBe(64);
    expect(result.stderr).toContain("missing required flag '--claude-config-dir'");
  });

  it.skipIf(underClaudeAncestry)('accepts --claude-config-dir on a cli-claude-code research dispatch and runs Claude under it', () => {
    const fixture = createFixture();
    const result = runDispatch(fixture, [
      ...baseFlags(fixture, 'research'),
      '--claude-config-dir', fixture.configuredDir,
    ]);

    expect(result.status).not.toBe(64);
    expect(result.stderr).not.toContain('only valid with');
    expect(recordedConfigDir(fixture.recordPath)).toBe(realpathSync(fixture.configuredDir));
  });

  it.skipIf(underClaudeAncestry)('treats an empty --claude-config-dir on research as absent', () => {
    const fixture = createFixture();
    const result = runDispatch(fixture, [
      ...baseFlags(fixture, 'research'),
      '--claude-config-dir', '',
    ]);

    expect(result.status).not.toBe(64);
    expect(recordedConfigDir(fixture.recordPath)).toBe(realpathSync(fixture.inheritedDir));
  });

  it('fails a research dispatch with a config dir outside the allowed roots before reading the prompt', () => {
    const fixture = createFixture();
    const result = runDispatch(fixture, [
      ...baseFlags(fixture, 'research', join(fixture.root, 'no-such-prompt.md')),
      '--claude-config-dir', join(fixture.root, 'does-not-exist'),
    ]);

    expect(result.status).not.toBe(0);
    expect(result.status).not.toBeNull();
    expect(result.stderr).toContain('configDir');
    expect(result.stderr).not.toContain('ENOENT');
    expect(existsSync(fixture.recordPath)).toBe(false);
  });

  it('still rejects --claude-config-dir for a non-claude executor on research', () => {
    const fixture = createFixture();
    const flags = baseFlags(fixture, 'research');
    flags[1] = 'cli-codex';
    const result = runDispatch(fixture, [
      ...flags,
      '--claude-config-dir', fixture.configuredDir,
    ]);

    expect(result.status).toBe(64);
    expect(result.stderr).toContain('only valid with --executor cli-claude-code');
  });
});

// ───────────────────────────────────────────────────────────────────
// MODULE: Dispatch Iteration Claude Dispatch
// ───────────────────────────────────────────────────────────────────
//
// The review leaf records its own state through node every iteration, which
// acceptEdits cannot run in -p mode, so --sandbox-mode must reach the Claude
// permission mode on review exactly as it does on research. Built in-process
// because a spawned Claude dispatch is refused under a Claude process tree; a
// shim on PATH satisfies the builder's binary check.

describe('dispatch-iteration Claude dispatch', () => {
  let root = '';
  let savedPath: string | undefined;

  beforeAll(() => {
    root = mkdtempSync(join(tmpdir(), 'dispatch-claude-'));
    mkdirSync(join(root, 'bin'));
    writeFileSync(join(root, 'bin', 'claude'), '#!/bin/sh\nexit 0\n', { mode: 0o755 });
    writeFileSync(join(root, 'prompt.md'), 'fixture prompt\n', 'utf8');
    savedPath = process.env.PATH;
    process.env.PATH = `${join(root, 'bin')}:${savedPath}`;
  });

  afterAll(() => {
    process.env.PATH = savedPath;
    rmSync(root, { recursive: true, force: true });
  });

  function claudeDispatch(
    loopType: 'research' | 'review',
    overrides: Record<string, string> = {},
  ): ReturnType<typeof dispatcher.buildClaudeDispatch> {
    const context = dispatcher.buildContext({
      executor: 'cli-claude-code',
      loopType,
      repoRoot: REPO_ROOT,
      promptFile: join(root, 'prompt.md'),
      stateLog: join(root, 'state.jsonl'),
      packetDir: join(root, 'packet'),
      artifactDir: join(root, 'artifact'),
      model: 'sonnet',
      reasoningEffort: 'null',
      serviceTier: 'null',
      sandboxMode: 'null',
      iteration: '3',
      generation: '1',
      sessionId: 's',
      timeoutSeconds: '60',
      ...overrides,
    });
    return dispatcher.buildClaudeDispatch(context);
  }

  function flagAfter(args: string[], flag: string): string {
    return args[args.indexOf(flag) + 1];
  }

  for (const loopType of ['research', 'review'] as const) {
    it(`keeps acceptEdits as the ${loopType} default when no sandbox mode is set`, () => {
      const dispatch = claudeDispatch(loopType);
      expect(flagAfter(dispatch.args, '--permission-mode')).toBe('acceptEdits');
      expect(dispatch.executor.sandboxMode).toBe('workspace-write');
    });

    it(`maps danger-full-access to bypassPermissions on ${loopType}`, () => {
      const dispatch = claudeDispatch(loopType, { sandboxMode: 'danger-full-access' });
      expect(flagAfter(dispatch.args, '--permission-mode')).toBe('bypassPermissions');
      expect(dispatch.executor.sandboxMode).toBe('danger-full-access');
    });

    it(`maps read-only to plan on ${loopType}`, () => {
      expect(flagAfter(claudeDispatch(loopType, { sandboxMode: 'read-only' }).args, '--permission-mode'))
        .toBe('plan');
    });
  }

  it('resolves an unset model to the default instead of the literal string null', () => {
    const dispatch = claudeDispatch('review', { model: 'null' });
    expect(flagAfter(dispatch.args, '--model')).toBe(CLAUDE_DEFAULT_MODEL);
    expect(dispatch.executor.model).toBe(CLAUDE_DEFAULT_MODEL);
  });

  it('logs stream-json and keeps the event stream off the terminal', () => {
    const dispatch = claudeDispatch('research');
    expect(flagAfter(dispatch.args, '--output-format')).toBe('stream-json');
    expect(dispatch.echoStdout).toBe(false);
  });

  it('writes the iteration cost sidecar from the last result event', () => {
    const stream = [
      JSON.stringify({ type: 'assistant', message: { content: [] } }),
      JSON.stringify({ type: 'result', subtype: 'success', total_cost_usd: 0.42 }),
    ].join('\n');
    claudeDispatch('review').onStdout(stream);
    const sidecar = join(root, 'artifact', 'iterations', 'iteration-003.cost.json');
    expect(JSON.parse(readFileSync(sidecar, 'utf8'))).toEqual({ iteration: 3, providerCostUsd: 0.42 });
  });

  // A stream with no result event, such as a child killed mid-run, has an unknown spend,
  // which must not read as a free iteration.
  it('records an unknown cost as null, not zero', () => {
    claudeDispatch('research', { iteration: '4' }).onStdout('not a json stream\n');
    const sidecar = join(root, 'artifact', 'iterations', 'iteration-004.cost.json');
    expect(JSON.parse(readFileSync(sidecar, 'utf8'))).toEqual({ iteration: 4, providerCostUsd: null });
  });
});

// ───────────────────────────────────────────────────────────────────
// MODULE: Dispatch Iteration Sandbox Mode Per Executor Kind
// ───────────────────────────────────────────────────────────────────
//
// A requested read-only dispatch must reach the child as read-only, never be
// widened to a write-capable mode, while an unset mode keeps the write-capable
// default the iteration needs to record its own files. Each case asserts the
// argv a recorder shim on PATH actually received, inside a throwaway git
// repository so the write-containment pass never scans a real checkout.

describe('dispatch-iteration sandbox mode per executor kind', () => {
  const tempDirs: string[] = [];

  afterEach(() => {
    for (const dir of tempDirs.splice(0)) {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  type SandboxFixture = { root: string; repo: string; recordPath: string };

  // The shim answers the version probes the builders run, then records the argv of
  // the real dispatch and exits without producing an iteration.
  function createSandboxFixture(command: string, version: string): SandboxFixture {
    const root = mkdtempSync(join(tmpdir(), 'dispatch-sandbox-'));
    tempDirs.push(root);
    const repo = join(root, 'repo');
    const binDir = join(root, 'bin');
    mkdirSync(binDir);
    mkdirSync(join(repo, '.skilled', 'agents'), { recursive: true });
    mkdirSync(join(repo, '.dsh', 'patches'), { recursive: true });
    mkdirSync(join(repo, 'packet'));
    writeFileSync(join(repo, '.skilled', 'agents', 'deep-research.md'), 'persona\n', 'utf8');
    for (const patch of [
      'route-llmgateway-deepseek.patch.yml',
      'lineage.patch.yml',
      'guards.patch.yml',
    ]) {
      writeFileSync(join(repo, '.dsh', 'patches', patch), '', 'utf8');
    }
    writeFileSync(join(root, 'prompt.md'), 'fixture prompt\n', 'utf8');
    writeFileSync(join(root, 'state.jsonl'), '', 'utf8');
    spawnSync('git', ['init', '-q', repo], { encoding: 'utf8' });
    const recordPath = join(root, 'record.json');
    const shimPath = join(binDir, command);
    writeFileSync(
      shimPath,
      '#!/usr/bin/env node\n'
        + "const fs = require('node:fs');\n"
        + 'const argv = process.argv.slice(2);\n'
        + "if (argv[0] === '--version') {\n"
        + `  process.stdout.write(${JSON.stringify(version)} + '\\n');\n`
        + '  process.exit(0);\n'
        + '}\n'
        + `fs.writeFileSync(${JSON.stringify(recordPath)}, JSON.stringify(argv));\n`
        + `fs.writeFileSync(${JSON.stringify(childEnvironmentPath(recordPath))}, `
        + 'JSON.stringify({ opencodeConfigContent: process.env.OPENCODE_CONFIG_CONTENT ?? null }));\n'
        + 'process.exit(0);\n',
      'utf8',
    );
    chmodSync(shimPath, 0o755);
    return { root, repo, recordPath };
  }

  // Beside the argv record, the shim keeps the one environment value a builder may inject.
  function childEnvironmentPath(recordPath: string): string {
    return recordPath.replace(/\.json$/, '-child-environment.json');
  }

  function dispatchArgv(
    executor: string,
    command: string,
    version: string,
    sandboxMode: string,
    extraFlags: string[] = [],
    artifactDir?: string,
    extraEnv: Record<string, string> = {},
  ): { status: number | null; stderr: string; argv: string[] | null; fixture: SandboxFixture } {
    const fixture = createSandboxFixture(command, version);
    const result = spawnSync(process.execPath, [
      SCRIPT,
      '--executor', executor,
      '--loop-type', 'research',
      '--repo-root', fixture.repo,
      '--prompt-file', join(fixture.root, 'prompt.md'),
      '--state-log', join(fixture.root, 'state.jsonl'),
      '--packet-dir', join(fixture.repo, 'packet'),
      '--artifact-dir', artifactDir ?? join(fixture.repo, 'packet'),
      '--iteration', '1',
      '--generation', '1',
      '--session-id', 's',
      '--model', 'null',
      '--reasoning-effort', 'null',
      '--service-tier', 'null',
      '--sandbox-mode', sandboxMode,
      '--timeout-seconds', '60',
      ...extraFlags,
    ], {
      cwd: fixture.repo,
      encoding: 'utf8',
      timeout: 60_000,
      env: {
        PATH: `${join(fixture.root, 'bin')}:${process.env.PATH}`,
        HOME: fixture.root,
        TMPDIR: process.env.TMPDIR,
        ...extraEnv,
      },
    });
    const argv = existsSync(fixture.recordPath)
      ? JSON.parse(readFileSync(fixture.recordPath, 'utf8')) as string[]
      : null;
    return { status: result.status, stderr: result.stderr ?? '', argv, fixture };
  }

  function flagValue(argv: string[] | null, flag: string): string | undefined {
    expect(argv).not.toBeNull();
    const list = argv as string[];
    const index = list.indexOf(flag);
    return index === -1 ? undefined : list[index + 1];
  }

  // The executor record the signed intent receipt carries, the same one the state rows carry.
  function recordedExecutor(run: { fixture: SandboxFixture }): Record<string, unknown> {
    return (JSON.parse(readFileSync(
      join(run.fixture.repo, 'packet', 'dispatch-receipts', 'dispatch-research-i1-g1.intent.json'),
      'utf8',
    )) as { facts: { executor: Record<string, unknown> } }).facts.executor;
  }

  describe.skipIf(detectFromAncestry('cli-codex'))('cli-codex', () => {
    // codex confines workspace-write itself, so the record keeps the requested mode as is.
    it('records a confined workspace-write as requested, with preventive enforcement', () => {
      const run = dispatchArgv('cli-codex', 'codex', 'codex 0.0.0', 'workspace-write');
      expect(flagValue(run.argv, '--sandbox')).toBe('workspace-write');
      const executor = recordedExecutor(run);
      expect(executor).toMatchObject({ sandboxMode: 'workspace-write', sandboxEnforcement: 'preventive' });
      expect(executor).not.toHaveProperty('sandboxNarrowedFrom');
      expect(executor).not.toHaveProperty('sandboxWidenedFrom');
    });

    it('hands a requested read-only sandbox to codex', () => {
      const run = dispatchArgv('cli-codex', 'codex', 'codex 0.0.0', 'read-only');
      expect(flagValue(run.argv, '--sandbox')).toBe('read-only');
    });

    it('keeps workspace-write when no sandbox mode is set', () => {
      const run = dispatchArgv('cli-codex', 'codex', 'codex 0.0.0', 'null');
      expect(flagValue(run.argv, '--sandbox')).toBe('workspace-write');
    });

    it('gives codex the default model when none is set', () => {
      const run = dispatchArgv('cli-codex', 'codex', 'codex 0.0.0', 'null');
      expect(flagValue(run.argv, '--model')).toBe(CODEX_DEFAULT_MODEL);
    });

    // The shared builder refuses an absent binary with its input-validation error, as it
    // does for every other kind, before any receipt or state row is written.
    it('throws the builder refusal when the codex binary is missing', () => {
      const fixture = createSandboxFixture('not-codex', 'codex 0.0.0');
      const result = spawnSync(process.execPath, [
        SCRIPT,
        '--executor', 'cli-codex',
        '--loop-type', 'research',
        '--repo-root', fixture.repo,
        '--prompt-file', join(fixture.root, 'prompt.md'),
        '--state-log', join(fixture.root, 'state.jsonl'),
        '--packet-dir', join(fixture.repo, 'packet'),
        '--artifact-dir', join(fixture.repo, 'packet'),
        '--iteration', '1',
        '--generation', '1',
        '--session-id', 's',
        '--model', 'null',
        '--reasoning-effort', 'null',
        '--service-tier', 'null',
        '--sandbox-mode', 'null',
        '--timeout-seconds', '60',
      ], {
        cwd: fixture.repo,
        encoding: 'utf8',
        timeout: 60_000,
        env: { PATH: '/usr/bin:/bin', HOME: fixture.root, TMPDIR: process.env.TMPDIR },
      });
      expect(result.status).not.toBe(0);
      expect(result.stderr).toContain('cli-codex executor unavailable');
      expect(result.stderr).toContain('INPUT_VALIDATION');
      expect(existsSync(join(fixture.repo, 'packet', 'dispatch-receipts'))).toBe(false);
      expect(readFileSync(join(fixture.root, 'state.jsonl'), 'utf8')).toBe('');
    });
  });

  describe.skipIf(detectFromAncestry('cli-devin'))('cli-devin', () => {
    it('runs a requested read-only lineage under the non-writing permission mode', () => {
      const run = dispatchArgv('cli-devin', 'devin', 'devin 0.0.0', 'read-only');
      expect(flagValue(run.argv, '--permission-mode')).toBe('auto');
    });

    it('keeps the write-approving permission mode when no sandbox mode is set', () => {
      const run = dispatchArgv('cli-devin', 'devin', 'devin 0.0.0', 'null');
      expect(flagValue(run.argv, '--permission-mode')).toBe('dangerous');
    });

    // devin runs a write lineage with the same unconfined command as full access.
    it('records a workspace-write request as the unconfined mode devin runs', () => {
      const run = dispatchArgv('cli-devin', 'devin', 'devin 0.0.0', 'workspace-write');
      expect(flagValue(run.argv, '--permission-mode')).toBe('dangerous');
      expect(recordedExecutor(run)).toMatchObject({
        sandboxMode: 'danger-full-access',
        sandboxWidenedFrom: 'workspace-write',
        sandboxEnforcement: 'none',
      });
    });
  });

  describe.skipIf(detectFromAncestry('cli-deepseek-harness'))('cli-deepseek-harness', () => {
    const harnessFlags = ['--spec-folder', 'specs/fixture'];

    it('hands a requested read-only permission mode to the harness', () => {
      const run = dispatchArgv('cli-deepseek-harness', 'dsh', '0.2.2-rc.3', 'read-only', harnessFlags);
      expect(flagValue(run.argv, '--permission-mode')).toBe('read-only');
    });

    it('keeps workspace-write when no sandbox mode is set', () => {
      const run = dispatchArgv('cli-deepseek-harness', 'dsh', '0.2.2-rc.3', 'null', harnessFlags);
      expect(flagValue(run.argv, '--permission-mode')).toBe('workspace-write');
    });

    it('records a full-access request as the workspace-write the harness runs', () => {
      const run = dispatchArgv('cli-deepseek-harness', 'dsh', '0.2.2-rc.3', 'danger-full-access', harnessFlags);
      expect(flagValue(run.argv, '--permission-mode')).toBe('workspace-write');
      expect(recordedExecutor(run)).toMatchObject({
        sandboxMode: 'workspace-write',
        sandboxNarrowedFrom: 'danger-full-access',
        sandboxEnforcement: 'preventive',
      });
    });
  });

  // OpenCode has no OS sandbox, so workspace-write reaches it only as an inline config that
  // denies external_directory to its file tools. The deny exists only in the child's
  // environment, so these cases read what the shim saw, not what the builder returned.
  describe.skipIf(detectFromAncestry('cli-opencode'))('cli-opencode', () => {
    const OPENCODE_VERSION = '2.3.2';

    function childConfigContent(recordPath: string): string | null {
      return (JSON.parse(readFileSync(childEnvironmentPath(recordPath), 'utf8')) as {
        opencodeConfigContent: string | null;
      }).opencodeConfigContent;
    }

    function receiptSandboxMode(packetDir: string, dispatchId: string): unknown {
      const receipt = JSON.parse(readFileSync(
        join(packetDir, 'dispatch-receipts', `dispatch-${dispatchId}.intent.json`),
        'utf8',
      )) as { facts: { executor: { sandboxMode: unknown } } };
      return receipt.facts.executor.sandboxMode;
    }

    for (const sandboxMode of ['null', 'workspace-write']) {
      it(`hands the child an external_directory deny under workspace-write (sandbox mode ${sandboxMode})`, () => {
        const run = dispatchArgv('cli-opencode', 'opencode', OPENCODE_VERSION, sandboxMode);
        expect(run.argv).toContain('--auto');
        expect(JSON.parse(childConfigContent(run.fixture.recordPath) as string)).toEqual({
          permission: { external_directory: 'deny' },
        });
        expect(receiptSandboxMode(join(run.fixture.repo, 'packet'), 'research-i1-g1')).toBe('workspace-write');
      });
    }

    // Passes before and after the deny was wired through: it guards against the deny
    // leaking into the one mode that asks for no path restriction.
    it('injects no inline config for an explicit danger-full-access', () => {
      const run = dispatchArgv('cli-opencode', 'opencode', OPENCODE_VERSION, 'danger-full-access');
      expect(run.argv).toContain('--auto');
      expect(childConfigContent(run.fixture.recordPath)).toBeNull();
      expect(receiptSandboxMode(join(run.fixture.repo, 'packet'), 'research-i1-g1')).toBe('danger-full-access');
    });

    it('refuses a read-only dispatch before the child runs', () => {
      const run = dispatchArgv('cli-opencode', 'opencode', OPENCODE_VERSION, 'read-only');
      expect(run.status).not.toBe(0);
      expect(run.stderr).toContain("cannot enforce sandbox mode 'read-only'");
      expect(run.argv).toBeNull();
    });

    // The post-dispatch check rejects an artifact dir outside the worktree, so a child
    // spawned first would have run with writes nothing could ever check. The shim's
    // argv record is written only by the dispatch itself, never by the version probe.
    it('refuses an artifact dir outside the git worktree before the child runs', () => {
      const externalArtifact = mkdtempSync(join(tmpdir(), 'dispatch-external-artifact-'));
      tempDirs.push(externalArtifact);
      const run = dispatchArgv('cli-opencode', 'opencode', OPENCODE_VERSION, 'workspace-write', [], externalArtifact);
      expect(run.status).not.toBe(0);
      expect(run.stderr).toContain('is outside the git worktree — containment cannot be enforced');
      expect(run.argv).toBeNull();
    });

    // The review branch dispatches only from a linked worktree whose primary checkout on
    // main is clean, with a prompt that carries the write-containment sections.
    it('hands the review child the same deny when no sandbox mode is set', () => {
      const fixture = createSandboxFixture('opencode', OPENCODE_VERSION);
      const root = realpathSync(fixture.root);
      const primary = join(root, 'primary');
      const worktree = join(root, 'worktree');
      const git = (cwd: string, args: string[]) => {
        const result = spawnSync('git', args, { cwd, encoding: 'utf8' });
        expect(result.status, result.stderr).toBe(0);
      };
      mkdirSync(join(primary, '.skilled', 'agents'), { recursive: true });
      writeFileSync(join(primary, '.skilled', 'agents', 'deep-review.md'), 'persona\n', 'utf8');
      git(root, ['init', '-q', '-b', 'main', primary]);
      git(primary, ['add', '.']);
      git(primary, ['-c', 'user.name=t', '-c', 'user.email=t@example.invalid', 'commit', '-q', '-m', 'init']);
      git(primary, ['worktree', 'add', '-q', '-b', 'review', worktree]);
      const packetDir = join(worktree, 'packet');
      mkdirSync(packetDir);
      writeFileSync(
        join(root, 'review-prompt.md'),
        'BANNED OPERATIONS\nnone\nALLOWED WRITE PATHS\npacket\n',
        'utf8',
      );
      const result = spawnSync(process.execPath, [
        SCRIPT,
        '--executor', 'cli-opencode',
        '--loop-type', 'review',
        '--repo-root', worktree,
        '--prompt-file', join(root, 'review-prompt.md'),
        '--state-log', join(root, 'state.jsonl'),
        '--packet-dir', packetDir,
        '--artifact-dir', packetDir,
        '--iteration', '1',
        '--generation', '1',
        '--session-id', 's',
        '--model', 'null',
        '--reasoning-effort', 'null',
        '--service-tier', 'null',
        '--sandbox-mode', 'null',
        '--timeout-seconds', '60',
      ], {
        cwd: worktree,
        encoding: 'utf8',
        timeout: 60_000,
        env: {
          PATH: `${join(root, 'bin')}:${process.env.PATH}`,
          HOME: root,
          TMPDIR: process.env.TMPDIR,
        },
      });
      expect(existsSync(fixture.recordPath), result.stderr).toBe(true);
      expect(JSON.parse(childConfigContent(fixture.recordPath) as string)).toEqual({
        permission: { external_directory: 'deny' },
      });
      expect(receiptSandboxMode(packetDir, 'review-i1-g1')).toBe('workspace-write');
    });
  });

  // The audit names the model the command runs, so an unset model must be recorded as the
  // default the builder put on the command line, never as the null that was asked for. The
  // host-session opt-in relaxes only the ancestry layer, so the kind this session runs under
  // dispatches too instead of stopping at the recursion guard before its argv exists.
  describe('audit model per executor kind', () => {
    const flagModel = (flag: string) => (argv: string[]): string | null => {
      const index = argv.indexOf(flag);
      return index === -1 ? null : argv[index + 1];
    };
    // cli-deepseek-harness takes no model flag: the route patch it names pins the model.
    const routePatchModel = (argv: string[]): string | null => {
      const route = argv.find((arg) => /route-[\w-]+\.patch\.yml$/.test(arg));
      if (!route) return null;
      const patch = readFileSync(join(REPO_ROOT, '.dsh', 'patches', route.split('/').pop() as string), 'utf8');
      return /id: agent-default-model[\s\S]*?\bmodel: (\S+)/.exec(patch)?.[1] ?? null;
    };
    const DISPATCHABLE: Record<string, {
      command: string;
      version: string;
      flags?: string[];
      defaultModel: string;
      argvModel: (argv: string[]) => string | null;
    }> = {
      'cli-codex': { command: 'codex', version: 'codex 0.0.0', defaultModel: CODEX_DEFAULT_MODEL, argvModel: flagModel('--model') },
      'cli-claude-code': { command: 'claude', version: '0.0.0', defaultModel: CLAUDE_DEFAULT_MODEL, argvModel: flagModel('--model') },
      'cli-opencode': {
        command: 'opencode',
        version: '2.3.2',
        defaultModel: OPENCODE_DEFAULT_MODEL,
        // -m carries the model with the effort the route pins after a '#'.
        argvModel: (argv) => flagModel('-m')(argv)?.split('#')[0] ?? null,
      },
      'cli-cursor': { command: 'cursor-agent', version: '0.0.0', defaultModel: CURSOR_DEFAULT_MODEL, argvModel: flagModel('--model') },
      'cli-devin': { command: 'devin', version: 'devin 0.0.0', defaultModel: DEVIN_DEFAULT_MODEL, argvModel: flagModel('--model') },
      'cli-pi': {
        command: 'pi',
        version: '0.0.0',
        defaultModel: PI_DEFAULT_MODEL,
        // --model carries a provider/model selector.
        argvModel: (argv) => flagModel('--model')(argv)?.split('/').pop() ?? null,
      },
      'cli-deepseek-harness': {
        command: 'dsh',
        version: '0.2.2-rc.3',
        flags: ['--spec-folder', 'specs/fixture'],
        defaultModel: DSH_DEFAULT_MODEL,
        argvModel: routePatchModel,
      },
    };

    it.each([...CONFIGURED_EXECUTOR_KINDS])('records the model the %s command runs', (kind) => {
      const spec = DISPATCHABLE[kind];
      if (!spec) {
        // No single-iteration dispatch path: refused before any audit row exists.
        const run = dispatchArgv(kind, 'unused', '0.0.0', 'null');
        expect(run.status).toBe(64);
        expect(existsSync(join(run.fixture.repo, 'packet', 'dispatch-receipts'))).toBe(false);
        return;
      }
      const run = dispatchArgv(kind, spec.command, spec.version, 'null', spec.flags ?? [], undefined, {
        [HOST_SESSION_EXECUTOR_ENV]: '1',
      });
      expect(run.argv, run.stderr).not.toBeNull();
      const argvModel = spec.argvModel(run.argv as string[]);
      expect(argvModel).toBe(spec.defaultModel);
      expect(recordedExecutor(run).model).toBe(argvModel);
      const receiptDir = join(run.fixture.repo, 'packet', 'dispatch-receipts');
      const receiptModels = readdirSync(receiptDir)
        .filter((name) => name.endsWith('.json'))
        .map((name) => JSON.parse(readFileSync(join(receiptDir, name), 'utf8')) as {
          facts?: { executor?: { model: unknown } };
        })
        .filter((receipt) => receipt.facts?.executor)
        .map((receipt) => receipt.facts?.executor?.model);
      expect(receiptModels.length).toBeGreaterThan(1);
      expect(new Set(receiptModels)).toEqual(new Set([argvModel]));
      // A clean exit writes no failure row, so only the rows that do carry an executor are read.
      const rows = readFileSync(join(run.fixture.root, 'state.jsonl'), 'utf8')
        .split('\n')
        .filter(Boolean)
        .map((line) => JSON.parse(line) as { executor?: { model: unknown } })
        .filter((row) => row.executor);
      for (const row of rows) expect(row.executor?.model).toBe(argvModel);
    });
  });
});

// ───────────────────────────────────────────────────────────────────
// MODULE: Dispatch Iteration Stdout Log
// ───────────────────────────────────────────────────────────────────
//
// A single-executor child's stdout goes to a log beside the iteration, masked like a
// fan-out lineage log, so a long stream neither crashes the dispatch nor leaks the
// account ids and the author email a provider echoes into it.

describe.skipIf(detectFromAncestry('cli-devin'))('dispatch-iteration stdout log', () => {
  const tempDirs: string[] = [];

  afterEach(() => {
    for (const dir of tempDirs.splice(0)) {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  function dispatchDevin(childBody: string): { root: string; packet: string; stderr: string; status: number | null } {
    const root = mkdtempSync(join(tmpdir(), 'dispatch-stdout-log-'));
    tempDirs.push(root);
    const repo = join(root, 'repo');
    const binDir = join(root, 'bin');
    const packet = join(repo, 'packet');
    mkdirSync(binDir);
    mkdirSync(join(repo, '.skilled', 'agents'), { recursive: true });
    mkdirSync(packet);
    writeFileSync(join(repo, '.skilled', 'agents', 'deep-research.md'), 'persona\n', 'utf8');
    writeFileSync(join(root, 'prompt.md'), 'fixture prompt\n', 'utf8');
    writeFileSync(join(root, 'state.jsonl'), '', 'utf8');
    spawnSync('git', ['init', '-q', repo], { encoding: 'utf8' });
    const shimPath = join(binDir, 'devin');
    writeFileSync(
      shimPath,
      '#!/usr/bin/env node\n'
        + "const fs = require('node:fs');\n"
        + "if (process.argv[2] === '--version') { process.stdout.write('devin 0.0.0\\n'); process.exit(0); }\n"
        + childBody
        + 'process.exit(0);\n',
      'utf8',
    );
    chmodSync(shimPath, 0o755);
    const result = spawnSync(process.execPath, [
      SCRIPT,
      '--executor', 'cli-devin',
      '--loop-type', 'research',
      '--repo-root', repo,
      '--prompt-file', join(root, 'prompt.md'),
      '--state-log', join(root, 'state.jsonl'),
      '--packet-dir', packet,
      '--artifact-dir', packet,
      '--iteration', '2',
      '--generation', '1',
      '--session-id', 's',
      '--model', 'null',
      '--reasoning-effort', 'null',
      '--service-tier', 'null',
      '--sandbox-mode', 'null',
      '--timeout-seconds', '60',
    ], {
      cwd: repo,
      encoding: 'utf8',
      timeout: 60_000,
      maxBuffer: 64 * 1024 * 1024,
      env: {
        PATH: `${binDir}:${process.env.PATH}`,
        HOME: root,
        TMPDIR: process.env.TMPDIR,
      },
    });
    return { root, packet, stderr: result.stderr ?? '', status: result.status };
  }

  it('writes a stream past the old 10 MB cap to a masked log beside the iteration', () => {
    const filler = JSON.stringify({ type: 'message', text: 'a line of model prose '.repeat(45) }) + '\n';
    const run = dispatchDevin(
      `const line = ${JSON.stringify(filler)};\n`
        + 'for (let written = 0; written < 12 * 1024 * 1024; written += line.length) fs.writeSync(1, line);\n'
        + `fs.writeSync(1, ${JSON.stringify(JSON.stringify({ type: 'init', session_id: 'abc-123', note: 'author@example.com' }) + '\n')});\n`,
    );

    const logPath = join(run.packet, 'iterations', 'iteration-002.out');
    expect(run.status, run.stderr).toBe(0);
    expect(readFileSync(join(run.root, 'state.jsonl'), 'utf8')).not.toContain('dispatch_failure');
    const log = readFileSync(logPath, 'utf8');
    expect(log.length).toBeGreaterThan(12 * 1024 * 1024);
    expect(log).toContain('"session_id":"<redacted>"');
    expect(log).toContain('<email>');
    expect(log).not.toContain('author@example.com');
  });

  it('logs a silent child as an empty file, not a missing one', () => {
    const run = dispatchDevin('');

    expect(run.status, run.stderr).toBe(0);
    expect(statSync(join(run.packet, 'iterations', 'iteration-002.out')).size).toBe(0);
  });
});

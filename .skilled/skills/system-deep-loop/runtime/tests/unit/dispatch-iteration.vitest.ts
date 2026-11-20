// ───────────────────────────────────────────────────────────────────
// MODULE: Dispatch Iteration CLI Tests
// ───────────────────────────────────────────────────────────────────
//
// The workflow branches hand every executor kind to one script, so the
// refusals that used to live in separate inline bodies must survive the
// move. These cases pin the dispatch-free exits that a wrong branch or a
// permissive parser would otherwise turn into a real dispatch.

import { afterEach, describe, expect, it } from 'vitest';

import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import {
  chmodSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { detectFromAncestry } from '../../lib/deep-loop/executor-audit.js';

const here = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(here, '..', '..', '..', '..', '..', '..');
const SCRIPT = resolve(here, '..', '..', 'scripts', 'dispatch-iteration.cjs');
const dispatcher = createRequire(import.meta.url)(SCRIPT) as {
  buildClaudeInvocation: (
    context: Record<string, unknown>,
    configDir: string,
    promptBody: string,
  ) => { executor: { sandboxMode: string | null }; args: string[] };
  buildContext: (values: Record<string, string>) => Record<string, unknown>;
};

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
// MODULE: Dispatch Iteration Claude Permission Mode
// ───────────────────────────────────────────────────────────────────
//
// The review leaf records its own state through node every iteration, which
// acceptEdits cannot run in -p mode, so --sandbox-mode must reach the Claude
// permission mode on review exactly as it does on research. Built in-process
// because a spawned Claude dispatch is refused under a Claude process tree.

describe('dispatch-iteration Claude permission mode', () => {
  function permissionFor(loopType: 'research' | 'review', sandboxMode: string): {
    permission: string;
    executorSandbox: string | null;
  } {
    const context = dispatcher.buildContext({
      executor: 'cli-claude-code',
      loopType,
      model: 'sonnet',
      reasoningEffort: 'null',
      serviceTier: 'null',
      sandboxMode,
      iteration: '1',
      generation: '1',
      timeoutSeconds: '60',
      packetDir: '/tmp/packet',
    });
    const { executor, args } = dispatcher.buildClaudeInvocation(context, '', 'prompt');
    return {
      permission: args[args.indexOf('--permission-mode') + 1],
      executorSandbox: executor.sandboxMode,
    };
  }

  for (const loopType of ['research', 'review'] as const) {
    it(`keeps acceptEdits as the ${loopType} default when no sandbox mode is set`, () => {
      expect(permissionFor(loopType, 'null')).toEqual({
        permission: 'acceptEdits',
        executorSandbox: null,
      });
    });

    it(`maps danger-full-access to bypassPermissions on ${loopType}`, () => {
      expect(permissionFor(loopType, 'danger-full-access')).toEqual({
        permission: 'bypassPermissions',
        executorSandbox: 'danger-full-access',
      });
    });

    it(`maps read-only to plan on ${loopType}`, () => {
      expect(permissionFor(loopType, 'read-only').permission).toBe('plan');
    });
  }
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
      '--artifact-dir', join(fixture.repo, 'packet'),
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

  describe.skipIf(detectFromAncestry('cli-codex'))('cli-codex', () => {
    it('hands a requested read-only sandbox to codex', () => {
      const run = dispatchArgv('cli-codex', 'codex', 'codex 0.0.0', 'read-only');
      expect(flagValue(run.argv, '--sandbox')).toBe('read-only');
    });

    it('keeps workspace-write when no sandbox mode is set', () => {
      const run = dispatchArgv('cli-codex', 'codex', 'codex 0.0.0', 'null');
      expect(flagValue(run.argv, '--sandbox')).toBe('workspace-write');
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
});

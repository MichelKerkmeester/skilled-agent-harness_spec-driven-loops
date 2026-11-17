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

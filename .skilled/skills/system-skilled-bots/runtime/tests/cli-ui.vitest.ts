// ───────────────────────────────────────────────────────────────────
// MODULE: CLI UI Verb Tests
// ───────────────────────────────────────────────────────────────────
//
// The `ui` verb only launches the screen binary, so every test proves what it
// hands that binary and what it refuses before starting one, without a cargo build.

import { spawnSync } from 'node:child_process';
import { chmodSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { PAYLOAD_CONTRACT } from '../lib/contract.js';
import { BOTS_CLI } from './runner-support.js';
import { cleanupTemp, tempDir } from './support.js';

afterEach(cleanupTemp);

interface UiRun {
  status: number | null;
  stdout: string;
  stderr: string;
}

/** A copy of the caller's environment with the two variables this verb reads removed. */
function uiEnv(extra: Record<string, string> = {}): NodeJS.ProcessEnv {
  const env: NodeJS.ProcessEnv = { ...process.env };
  delete env.BOTS_UI_BIN;
  delete env.NO_COLOR;
  return { ...env, ...extra };
}

/** Run the `ui` verb with the caller's own environment kept out of it. */
function runUi(args: string[], extra: Record<string, string> = {}): UiRun {
  const run = spawnSync(process.execPath, [BOTS_CLI, 'ui', ...args], {
    encoding: 'utf8',
    env: uiEnv(extra),
    timeout: 60_000,
  });
  return { status: run.status, stdout: run.stdout, stderr: run.stderr };
}

/**
 * An executable stub standing in for the screen binary. It answers --version
 * with the contract number it was built for and records every other argument
 * beside itself, so a test reads what the verb passed without a cargo build.
 */
function stubBinary(contract: number = PAYLOAD_CONTRACT): string {
  const bin = join(tempDir('bots-ui-'), 'bots-ui');
  const argv = join(dirname(bin), 'argv.txt');
  writeFileSync(
    bin,
    [
      '#!/bin/sh',
      'if [ "$1" = "--version" ]; then',
      `  echo "bots-ui 0.1.0 contract ${contract}"`,
      '  exit 0',
      'fi',
      `: > "${argv}"`,
      'for arg in "$@"; do',
      `  printf '%s\\n' "$arg" >> "${argv}"`,
      'done',
      'exit 7',
      '',
    ].join('\n'),
  );
  chmodSync(bin, 0o755);
  return bin;
}

/** The arguments the stub recorded, or an empty list when it never started. */
function recordedArgv(bin: string): string[] {
  const file = join(dirname(bin), 'argv.txt');
  if (!existsSync(file)) return [];
  return readFileSync(file, 'utf8').split('\n').filter((line) => line !== '');
}

describe('bots ui', () => {
  it('passes the resolved repo and the skilled tree', () => {
    const bin = stubBinary();
    const repo = tempDir('bots-repo-');
    const tree = tempDir('bots-tree-');
    const run = runUi(['--repo', repo, '--skilled-tree', tree], { BOTS_UI_BIN: bin });
    expect(run.status).toBe(7);
    expect(recordedArgv(bin)).toEqual(['--repo', repo, '--skilled-tree', tree]);
  });

  it("passes the binary's exit code through", () => {
    const bin = stubBinary();
    const run = runUi(['--repo', tempDir('bots-repo-'), '--skilled-tree', tempDir('bots-tree-')], { BOTS_UI_BIN: bin });
    expect(run.status).toBe(7);
  });

  it('passes --mono under NO_COLOR', () => {
    const bin = stubBinary();
    const run = runUi(['--repo', tempDir('bots-repo-'), '--skilled-tree', tempDir('bots-tree-')], {
      BOTS_UI_BIN: bin,
      NO_COLOR: '1',
    });
    expect(run.status).toBe(7);
    const argv = recordedArgv(bin);
    expect(argv).toContain('--mono');
    expect(argv).not.toContain('--ascii');
  });

  it('passes --ascii when asked', () => {
    const bin = stubBinary();
    const run = runUi(['--repo', tempDir('bots-repo-'), '--skilled-tree', tempDir('bots-tree-'), '--ascii'], {
      BOTS_UI_BIN: bin,
    });
    expect(run.status).toBe(7);
    const argv = recordedArgv(bin);
    expect(argv).toContain('--ascii');
    expect(argv).not.toContain('--mono');
  });

  it('refuses ui-unavailable for an absent crate', () => {
    const tree = tempDir('bots-tree-');
    const run = runUi(['--repo', tempDir('bots-repo-'), '--skilled-tree', tree]);
    expect(run.status).toBe(4);
    expect(run.stderr).toContain(`bots: ui-unavailable: no crates/bots-tui in ${tree}.`);
  });

  it('refuses ui-not-built for an absent binary', () => {
    const tree = tempDir('bots-tree-');
    mkdirSync(join(tree, 'crates', 'bots-tui'), { recursive: true });
    const run = runUi(['--repo', tempDir('bots-repo-'), '--skilled-tree', tree]);
    expect(run.status).toBe(4);
    expect(run.stderr).toContain(
      `bots: ui-not-built: no bots-ui binary at ${join(tree, 'crates', 'bots-tui', 'target', 'release', 'bots-ui')}.`,
    );
  });

  it('refuses ui-contract-mismatch for another contract number', () => {
    const bin = stubBinary(PAYLOAD_CONTRACT + 1);
    const run = runUi(['--repo', tempDir('bots-repo-'), '--skilled-tree', tempDir('bots-tree-')], { BOTS_UI_BIN: bin });
    expect(run.status).toBe(4);
    expect(run.stderr).toContain('bots: ui-contract-mismatch:');
    expect(run.stderr).toContain(
      `speaks contract ${PAYLOAD_CONTRACT + 1}, this verb speaks contract ${PAYLOAD_CONTRACT}`,
    );
    expect(existsSync(join(dirname(bin), 'argv.txt'))).toBe(false);
  });

  it('exits 2 on an unknown option', () => {
    const run = runUi(['--repo', tempDir('bots-repo-'), '--skilled-tree', tempDir('bots-tree-'), '--bogus']);
    expect(run.status).toBe(2);
    expect(run.stderr).toContain('usage: bots');
  });
});

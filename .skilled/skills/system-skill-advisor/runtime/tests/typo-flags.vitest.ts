// ───────────────────────────────────────────────────────────────
// MODULE: Typo-Proof CLI Parsers
// ───────────────────────────────────────────────────────────────
// Proves each listed script rejects an unknown flag with exit status 2
// and an error naming the offending token, instead of silently ignoring
// the flag and running its default work.

import { spawnSync, type SpawnSyncReturns } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(HERE, '..', '..', '..', '..', '..');
const SCRIPTS_DIR = resolve(HERE, '..', 'scripts');

const DEFAULT_TIMEOUT_MS = 120_000;
const DEFAULT_TEST_TIMEOUT_MS = 130_000;
const SLOW_TIMEOUT_MS = 300_000;
const SLOW_TEST_TIMEOUT_MS = 330_000;
const MAX_OUTPUT_BYTES = 16 * 1024 * 1024;

interface CliResult {
  readonly status: number | null;
  readonly output: string;
}

interface CliOptions {
  readonly cwd?: string;
  readonly timeoutMs?: number;
  readonly env?: NodeJS.ProcessEnv;
}

function runCommand(command: string, args: readonly string[], options: CliOptions = {}): CliResult {
  const result = spawnSync(command, [...args], {
    cwd: options.cwd ?? REPO_ROOT,
    encoding: 'utf8',
    timeout: options.timeoutMs ?? DEFAULT_TIMEOUT_MS,
    maxBuffer: MAX_OUTPUT_BYTES,
    ...(options.env ? { env: options.env } : {}),
  }) as SpawnSyncReturns<string>;
  const output = `${result.stdout}${result.stderr}`;
  return {
    status: result.status,
    output: result.error ? `${output}\n[spawn error: ${result.error.message}]` : output,
  };
}

function expectRejectedWithFlag(result: CliResult, flag: string): void {
  expect(result.status, result.output).toBe(2);
  expect(result.output).toContain(flag);
}

function makeCaseTempDir(): string {
  return mkdtempSync(join(tmpdir(), 'typo-flags-'));
}

function removeCaseTempDir(tempRoot: string): void {
  rmSync(tempRoot, { recursive: true, force: true });
}

// The bridge deriver regenerates its projection on any run that does not
// carry its recognized check flag, so a pre-fix typo run would rewrite
// repository files. This guard makes any repository write in the child
// process fail loudly, keeping the case read-only regardless of what the
// script decides to do with the unknown flag.
function writeRepoWriteGuard(tempRoot: string): string {
  const guardPath = join(tempRoot, 'block-repo-writes.cjs');
  const guardSource = [
    "'use strict';",
    "const fs = require('node:fs');",
    "const path = require('node:path');",
    `const repoRoot = ${JSON.stringify(REPO_ROOT)};`,
    'let realRoot = repoRoot;',
    'try { realRoot = fs.realpathSync(repoRoot); } catch { /* keep the unresolved root */ }',
    'const realWriteFileSync = fs.writeFileSync;',
    'fs.writeFileSync = function guardedWriteFileSync(file, ...rest) {',
    '  const target = path.resolve(String(file));',
    '  let realTarget = target;',
    '  try { realTarget = fs.realpathSync(target); } catch { /* the target may not exist yet */ }',
    '  const inRepo = [repoRoot, realRoot].some((root) => target === root',
    '    || target.startsWith(root + path.sep)',
    '    || realTarget === root',
    '    || realTarget.startsWith(root + path.sep));',
    '  if (inRepo) {',
    '    throw new Error(`refusing to write inside the repository during a typo case: ${target}`);',
    '  }',
    '  return realWriteFileSync.call(this, file, ...rest);',
    '};',
    '',
  ].join('\n');
  writeFileSync(guardPath, guardSource, 'utf8');
  return guardPath;
}

describe('CLI typo rejection', () => {
  it('derive-command-bridges.cjs rejects a misspelled --chek', () => {
    const tempRoot = makeCaseTempDir();
    try {
      const guard = writeRepoWriteGuard(tempRoot);
      const result = runCommand('node', [
        '--require',
        guard,
        join(SCRIPTS_DIR, 'command-bridges', 'derive-command-bridges.cjs'),
        '--chek',
      ]);
      expectRejectedWithFlag(result, '--chek');
    } finally {
      removeCaseTempDir(tempRoot);
    }
  }, DEFAULT_TEST_TIMEOUT_MS);

  it('verify-zombie-soak.sh rejects a misspelled --bogus-xyz', () => {
    const result = runCommand('bash', [
      join(SCRIPTS_DIR, 'verify-zombie-soak.sh'),
      '--bogus-xyz',
    ]);
    expectRejectedWithFlag(result, '--bogus-xyz');
  }, DEFAULT_TEST_TIMEOUT_MS);

  it('check-prompt-quality-card-sync.sh rejects a misspelled --bogus-xyz', () => {
    const result = runCommand('bash', [
      join(SCRIPTS_DIR, 'check-prompt-quality-card-sync.sh'),
      '.',
      '--bogus-xyz',
    ]);
    expectRejectedWithFlag(result, '--bogus-xyz');
  }, DEFAULT_TEST_TIMEOUT_MS);

  it('build-holdout.mjs rejects a misspelled --wrtie', () => {
    const result = runCommand('node', [
      join(SCRIPTS_DIR, 'routing-accuracy', 'build-holdout.mjs'),
      '--wrtie',
    ]);
    expectRejectedWithFlag(result, '--wrtie');
  }, DEFAULT_TEST_TIMEOUT_MS);

  it('capture-scorer-eval-baseline.mjs rejects a misspelled --wrtie', () => {
    const tempRoot = makeCaseTempDir();
    try {
      const result = runCommand('node', [
        join(SCRIPTS_DIR, 'routing-accuracy', 'capture-scorer-eval-baseline.mjs'),
        '--wrtie',
      ], {
        timeoutMs: SLOW_TIMEOUT_MS,
        env: { ...process.env, TMPDIR: tempRoot },
      });
      expectRejectedWithFlag(result, '--wrtie');
    } finally {
      removeCaseTempDir(tempRoot);
    }
  }, SLOW_TEST_TIMEOUT_MS);

  it('capture-local-native-divergence-ledger.mjs rejects a misspelled --wrtie', () => {
    const tempRoot = makeCaseTempDir();
    try {
      const result = runCommand('node', [
        join(SCRIPTS_DIR, 'routing-accuracy', 'capture-local-native-divergence-ledger.mjs'),
        '--wrtie',
      ], {
        timeoutMs: SLOW_TIMEOUT_MS,
        env: { ...process.env, TMPDIR: tempRoot },
      });
      expectRejectedWithFlag(result, '--wrtie');
    } finally {
      removeCaseTempDir(tempRoot);
    }
  }, SLOW_TEST_TIMEOUT_MS);

  it('derive-ambiguity-slice.mjs rejects a misspelled --wrtie', () => {
    const tempRoot = makeCaseTempDir();
    try {
      const result = runCommand('node', [
        join(SCRIPTS_DIR, 'routing-accuracy', 'derive-ambiguity-slice.mjs'),
        '--wrtie',
      ], {
        env: { ...process.env, TMPDIR: tempRoot },
      });
      expectRejectedWithFlag(result, '--wrtie');
    } finally {
      removeCaseTempDir(tempRoot);
    }
  }, DEFAULT_TEST_TIMEOUT_MS);

  it('init-skill-graph.sh rejects a misspelled --bogus-xyz before doing any work', () => {
    const tempRoot = makeCaseTempDir();
    try {
      // Copy the script into a throwaway mirror so its repo-root derivation
      // lands on the temp dir and it cannot reach the real advisor store.
      const scriptCopy = join(
        tempRoot,
        '.skilled',
        'skills',
        'system-skill-advisor',
        'runtime',
        'scripts',
        'init-skill-graph.sh',
      );
      mkdirSync(dirname(scriptCopy), { recursive: true });
      copyFileSync(join(SCRIPTS_DIR, 'init-skill-graph.sh'), scriptCopy);

      const result = runCommand('bash', [scriptCopy, '--bogus-xyz']);
      expect(result.status, result.output).toBe(2);
      expect(result.output).toContain('--bogus-xyz');
      expect(result.output).not.toContain('Validating graph metadata');
    } finally {
      removeCaseTempDir(tempRoot);
    }
  }, DEFAULT_TEST_TIMEOUT_MS);
});

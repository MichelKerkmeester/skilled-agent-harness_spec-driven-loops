// ───────────────────────────────────────────────────────────────────
// MODULE: Typo-Proof CLI Flag Rejection
// ───────────────────────────────────────────────────────────────────
//
// Proves the deep-loop entrypoint scripts refuse a misspelled or unknown
// flag instead of silently ignoring it. A silent ignore changes behavior:
// a mistyped --read-only leaves a supposedly read-only run free to write,
// and a mistyped output path can write where the operator did not intend.
// Each case spawns the real script and asserts the input-error exit status
// plus an error message that names the offending token.

import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync, symlinkSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const here = dirname(fileURLToPath(import.meta.url));
// tests/unit -> runtime -> skill root -> repository root.
const SKILL = resolve(here, '..', '..', '..');
const REPO = resolve(here, '..', '..', '..', '..', '..', '..');
const RUNTIME_SCRIPTS = join(SKILL, 'runtime', 'scripts');

const SPAWN_TIMEOUT_MS = 120_000;

type SpawnResult = {
  status: number | null;
  stdout: string;
  stderr: string;
};

// Spawn with an argv array, never a concatenated shell string, so a flag such
// as `--bogus-xyz` reaches the process as data instead of shell syntax.
function runScript(
  scriptPath: string,
  args: string[],
  options: { cwd?: string; input?: string } = {},
): SpawnResult {
  const result = spawnSync(process.execPath, [scriptPath, ...args], {
    cwd: options.cwd ?? REPO,
    encoding: 'utf8',
    timeout: SPAWN_TIMEOUT_MS,
    input: options.input,
  });
  return {
    status: result.status,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
  };
}

// A fresh temp dir per case, removed even when an assertion throws mid-case.
function withTempDir(run: (dir: string) => void): void {
  const dir = mkdtempSync(join(tmpdir(), 'typo-flags-'));
  try {
    run(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

// Runtime scripts report input errors as a single JSON object on stdout and
// exit 3, so an unknown flag must surface through that same envelope.
function expectInputRefusal(result: SpawnResult, flag: string): void {
  expect(result.status).toBe(3);
  const payload = JSON.parse(result.stdout.trim()) as { code?: unknown; error?: unknown };
  expect(payload.code).toBe('INPUT_VALIDATION');
  expect(String(payload.error)).toContain(flag);
}

function combinedOutput(result: SpawnResult): string {
  return `${result.stderr}\n${result.stdout}`;
}

const requireFromTest = createRequire(import.meta.url);
const cliGuards = requireFromTest(join(RUNTIME_SCRIPTS, 'lib', 'cli-guards.cjs')) as Record<string, unknown>;

describe('deep-loop CLI flag rejection', () => {
  it('convergence.cjs rejects a misspelled --read-only', () => {
    const result = runScript(join(RUNTIME_SCRIPTS, 'convergence.cjs'), [
      '--spec-folder', 'specs/typo-flags-probe',
      '--loop-type', 'bogus',
      '--session-id', 's1',
      '--read-onyl',
    ]);

    expectInputRefusal(result, '--read-onyl');
  });

  it('status.cjs rejects a misspelled --read-only', () => {
    const result = runScript(join(RUNTIME_SCRIPTS, 'status.cjs'), [
      '--spec-folder', 'specs/typo-flags-probe',
      '--loop-type', 'bogus',
      '--session-id', 's1',
      '--read-onl',
    ]);

    expectInputRefusal(result, '--read-onl');
  });

  it('query.cjs rejects a misspelled --read-only', () => {
    const result = runScript(join(RUNTIME_SCRIPTS, 'query.cjs'), [
      '--spec-folder', 'specs/typo-flags-probe',
      '--loop-type', 'bogus',
      '--session-id', 's1',
      '--query-type', 'coverage_gaps',
      '--read-onyl',
    ]);

    expectInputRefusal(result, '--read-onyl');
  });

  it('upsert.cjs rejects a misspelled --seed-source', () => {
    const result = runScript(join(RUNTIME_SCRIPTS, 'upsert.cjs'), [
      '--spec-folder', 'specs/typo-flags-probe',
      '--loop-type', 'bogus',
      '--session-id', 's1',
      '--nodes', '[]',
      '--edges', '[]',
      '--seed-sorce', 'scope_discovery',
    ]);

    expectInputRefusal(result, '--seed-sorce');
  });

  it('fanout-merge.cjs rejects an unknown flag', () => {
    withTempDir((dir) => {
      const result = runScript(join(RUNTIME_SCRIPTS, 'fanout-merge.cjs'), [
        '--loop-type', 'review',
        '--artifact-dir', dir,
        '--bogus-xyz',
      ]);

      expectInputRefusal(result, '--bogus-xyz');
    });
  });

  it('loop-lock.cjs acquire rejects a misspelled --ttl-ms and leaves no lock behind', () => {
    withTempDir((dir) => {
      const lockPath = join(dir, 'lock.json');
      const result = runScript(
        join(RUNTIME_SCRIPTS, 'loop-lock.cjs'),
        [
          'acquire',
          '--lock-path', lockPath,
          '--packet-id', 'demo',
          '--ttl-msx', '1800000',
        ],
        { cwd: dir },
      );

      expectInputRefusal(result, '--ttl-msx');
      expect(existsSync(lockPath)).toBe(false);
    });
  });

  it('append-state-record.cjs rejects an unknown flag without creating a file named after it', () => {
    withTempDir((dir) => {
      const result = runScript(
        join(RUNTIME_SCRIPTS, 'append-state-record.cjs'),
        ['--bogus-xyz'],
        {
          cwd: dir,
          input: JSON.stringify({ type: 'iteration', iteration: 1, mode: 'review' }),
        },
      );

      expect(result.status).toBe(2);
      expect(result.stderr).toContain('--bogus-xyz');
      expect(existsSync(join(dir, '--bogus-xyz'))).toBe(false);
    });
  });

  it('render-contract-snapshot.cjs rejects a misspelled --check', () => {
    const result = runScript(join(SKILL, 'deep-review', 'scripts', 'render-contract-snapshot.cjs'), ['--chek']);

    expect(result.status).toBe(2);
    expect(combinedOutput(result)).toContain('--chek');
  });

  it('advise-council-completion.cjs rejects an unknown flag', () => {
    const result = runScript(join(SKILL, 'deep-ai-council', 'scripts', 'advise-council-completion.cjs'), ['--bogus-xyz']);

    expect(result.status).toBe(2);
    expect(combinedOutput(result)).toContain('--bogus-xyz');
  });

  it('advise-council-completion.cjs rejects an unknown flag after the packet path', () => {
    const result = runScript(join(SKILL, 'deep-ai-council', 'scripts', 'advise-council-completion.cjs'), ['.', '--jso']);

    expect(result.status).toBe(2);
    expect(combinedOutput(result)).toContain('--jso');
  });

  it('check-documentation-drift.cjs rejects an unknown flag', () => {
    const result = runScript(join(RUNTIME_SCRIPTS, 'check-documentation-drift.cjs'), ['--bogus-xyz']);

    expect(result.status).toBe(2);
    expect(combinedOutput(result)).toContain('--bogus-xyz');
  });

  it('check-projection-coverage.cjs rejects an unknown flag', () => {
    const result = runScript(join(RUNTIME_SCRIPTS, 'check-projection-coverage.cjs'), ['--bogus-xyz']);

    expect(result.status).toBe(2);
    expect(combinedOutput(result)).toContain('--bogus-xyz');
  });

  it('check-protocol-append-sites.cjs rejects an unknown flag', () => {
    const result = runScript(join(RUNTIME_SCRIPTS, 'check-protocol-append-sites.cjs'), ['--bogus-xyz']);

    expect(result.status).toBe(2);
    expect(combinedOutput(result)).toContain('--bogus-xyz');
  });

  it('codex-dispatch.cjs rejects the misspelled --modell', () => {
    withTempDir((dir) => {
      // PATH exposes only a `node` shim, so `codex` can never be found and no
      // child process is spawned: the misspelled flag is the only failure left.
      symlinkSync(process.execPath, join(dir, 'node'));

      const result = spawnSync(
        'node',
        [join(RUNTIME_SCRIPTS, 'codex-dispatch.cjs'), '--prompt', 'hi', '--modell', 'my-model'],
        {
          cwd: REPO,
          encoding: 'utf8',
          timeout: SPAWN_TIMEOUT_MS,
          env: { ...process.env, PATH: dir },
        },
      );

      expect(result.status).toBe(2);
      expect(
        combinedOutput({ status: result.status, stdout: result.stdout ?? '', stderr: result.stderr ?? '' }),
      ).toContain('--modell');
    });
  });

  it('cli-guards assertKnownFlags rejects unknown keys and accepts known ones', () => {
    const assertKnownFlags = cliGuards.assertKnownFlags as
      | ((parsed: Record<string, unknown>, allowed: string[], makeErr: (message: string) => Error) => void)
      | undefined;
    expect(typeof assertKnownFlags).toBe('function');

    const makeErr = (message: string): Error => Object.assign(new Error(message), { code: 'INPUT_VALIDATION' });

    let thrown: unknown = null;
    try {
      assertKnownFlags?.({ readOnly: true, specFolder: 'x' }, ['specFolder'], makeErr);
    } catch (error) {
      thrown = error;
    }
    expect(thrown).not.toBeNull();
    expect((thrown as { code?: unknown }).code).toBe('INPUT_VALIDATION');
    expect(String((thrown as Error).message)).toContain('--read-only');

    expect(() => assertKnownFlags?.({ specFolder: 'x' }, ['specFolder'], makeErr)).not.toThrow();
  });
});

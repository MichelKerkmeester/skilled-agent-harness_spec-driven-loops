// ───────────────────────────────────────────────────────────────────
// MODULE: Divergent Pivot CLI Tests
// ───────────────────────────────────────────────────────────────────
//
// The three subcommands are the whole contract between a workflow and the
// pivot transaction, and each has an exit status the workflow branches on.
// These tests pin the usage failures: a caller mistake must exit 64 and name
// the command it wanted, so a malformed step never looks like a transaction
// that ran and failed.

import { describe, expect, it } from 'vitest';

import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const CLI_PATH = resolve(here, '..', '..', 'scripts', 'divergent-pivot.cjs');

interface CliResult {
  status: number | null;
  stdout: string;
  stderr: string;
}

function runCli(args: string[], input?: string): CliResult {
  const result = spawnSync(process.execPath, [CLI_PATH, ...args], {
    encoding: 'utf8',
    input,
  });
  return {
    status: result.status,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
  };
}

describe('divergent-pivot CLI usage failures', () => {
  it('prints the usage line naming every subcommand and exits 64 with no argument', () => {
    const result = runCli([]);

    expect(result.status).toBe(64);
    expect(result.stderr).toContain('prepare');
    expect(result.stderr).toContain('record-seat');
    expect(result.stderr).toContain('finalize');
  });

  it('rejects an empty record-seat envelope and exits 64', () => {
    const result = runCli(['record-seat'], '');

    expect(result.status).toBe(64);
    expect(result.stderr).toContain('record-seat expects one JSON object on stdin');
  });

  it('rejects a finalize resumed value that is neither true nor false and exits 64', () => {
    const result = runCli([
      'finalize',
      '--paths-json',
      '{}',
      '--pivot-id',
      'p',
      '--resumed',
      'maybe',
    ]);

    expect(result.status).toBe(64);
  });
});

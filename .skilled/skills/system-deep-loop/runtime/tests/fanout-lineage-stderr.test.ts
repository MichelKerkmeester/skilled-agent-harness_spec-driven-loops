// MODULE: fan-out lineage runner — stderr retention
//
// An executor refusal (usage limit, auth, sandbox) is reported on stderr and
// nowhere else. The runner used to drain it, so a failed lineage showed only an
// exit code and the cause had to be rediscovered by re-running the command by
// hand. These cells pin that stderr comes back with the result, bounded, while
// stdout keeps its existing contract.

import { describe, expect, it } from 'vitest';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const requireCjs = createRequire(import.meta.url);
const fanoutRunScript = join(dirname(fileURLToPath(import.meta.url)), '..', 'scripts', 'fanout-run.cjs');

const { runLineageProcess } = requireCjs(fanoutRunScript) as {
  runLineageProcess: (
    command: string,
    args: string[],
    opts: { cwd: string; env: NodeJS.ProcessEnv; timeoutMs: number; maxBuffer: number },
  ) => Promise<{ status: number | null; signal: string | null; stdout: string; stderr: string }>;
};

const opts = { cwd: process.cwd(), env: process.env, timeoutMs: 10_000, maxBuffer: 1024 * 1024 };

describe('runLineageProcess stderr retention', () => {
  it('returns the child stderr alongside stdout and the exit code', async () => {
    const result = await runLineageProcess(
      process.execPath,
      ['-e', "process.stdout.write('out-marker'); process.stderr.write('ERROR: usage limit reached'); process.exit(1);"],
      opts,
    );
    expect(result.status).toBe(1);
    expect(result.stdout).toBe('out-marker');
    expect(result.stderr).toContain('usage limit reached');
  });

  it('caps retained stderr instead of failing the lineage', async () => {
    const result = await runLineageProcess(
      process.execPath,
      ['-e', "process.stderr.write('x'.repeat(600 * 1024)); process.exit(0);"],
      opts,
    );
    expect(result.status).toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
    expect(result.stderr.length).toBeLessThanOrEqual(256 * 1024 + 64 * 1024);
  });
});

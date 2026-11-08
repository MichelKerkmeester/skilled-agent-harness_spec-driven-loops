// MODULE: fan-out lineage runner — child PWD alignment
//
// spawn() moves the child's working directory but the inherited PWD still names
// the parent's. Executors that read PWD to tell the model where it is then point
// at a directory the child never entered. These cells pin PWD to the resolved
// cwd, whether the parent passes a PWD or leaves it unset.

import { describe, expect, it } from 'vitest';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';

const requireCjs = createRequire(import.meta.url);
const fanoutRunScript = join(dirname(fileURLToPath(import.meta.url)), '..', 'scripts', 'fanout-run.cjs');

const { runLineageProcess } = requireCjs(fanoutRunScript) as {
  runLineageProcess: (
    command: string,
    args: string[],
    opts: { cwd: string; env: NodeJS.ProcessEnv; timeoutMs: number; maxBuffer: number },
  ) => Promise<{ status: number | null; signal: string | null; stdout: string; stderr: string }>;
};

const printPwd = ['-e', 'process.stdout.write(process.env.PWD || "")'];

describe('runLineageProcess child PWD', () => {
  it('reports the resolved cwd when the inherited PWD points elsewhere', async () => {
    const cwd = mkdtempSync(join(tmpdir(), 'fanout-pwd-'));
    try {
      const result = await runLineageProcess(process.execPath, printPwd, {
        cwd,
        env: { ...process.env, PWD: '/somewhere/else' },
        timeoutMs: 10_000,
        maxBuffer: 1024 * 1024,
      });
      expect(result.status).toBe(0);
      expect(result.stdout).toBe(resolve(cwd));
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });

  it('reports the resolved cwd when the parent has no PWD', async () => {
    const cwd = mkdtempSync(join(tmpdir(), 'fanout-pwd-'));
    const env = { ...process.env };
    delete env.PWD;
    try {
      const result = await runLineageProcess(process.execPath, printPwd, {
        cwd,
        env,
        timeoutMs: 10_000,
        maxBuffer: 1024 * 1024,
      });
      expect(result.status).toBe(0);
      expect(result.stdout).toBe(resolve(cwd));
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });
});

import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { spawnCjs } from '../helpers/spawn-cjs';

const tempDirs: string[] = [];

function inlineScript(source: string): string {
  const dir = mkdtempSync(join(tmpdir(), 'spawn-cjs-'));
  tempDirs.push(dir);
  const scriptPath = join(dir, 'fixture.cjs');
  writeFileSync(scriptPath, source, 'utf8');
  return scriptPath;
}

afterEach(() => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
});

describe('spawnCjs helper', () => {
  it('does not import independently discovered sibling suites from aggregate files', () => {
    const aggregateFiles = [
      'agent-improvement-rollback-gate.vitest.ts',
      'model-benchmark-rollback-gate.vitest.ts',
      'skill-benchmark-rollback-gate.vitest.ts',
    ];

    for (const file of aggregateFiles) {
      const source = readFileSync(new URL(`./${file}`, import.meta.url), 'utf8');
      expect(source).not.toMatch(/^import .*\.vitest\.js';$/mu);
    }
  });

  it('scopes and resets long file-wide timeout overrides', () => {
    const resumeFiles = [
      'model-benchmark-resume-adapter.vitest.ts',
      'skill-benchmark-resume-adapter.vitest.ts',
    ];

    for (const file of resumeFiles) {
      const source = readFileSync(new URL(`./${file}`, import.meta.url), 'utf8');
      expect(source).toMatch(/vi\.setConfig\(\{ testTimeout: \d[\d_]* \}\)/u);
      expect(source).toMatch(/afterAll\(\(\) => \{[\s\S]*testTimeout: 30_000/u);
    }
  });

  it('returns exit code, stdout, and stderr for a successful spawn', async () => {
    const result = await spawnCjs(inlineScript("console.log('ok');"));

    expect(result).toMatchObject({ exitCode: 0, stdout: 'ok', stderr: '', timedOut: false });
  });

  it('captures stderr and propagates non-zero exit codes', async () => {
    const result = await spawnCjs(inlineScript("console.error('boom'); process.exit(17);"));

    expect(result.exitCode).toBe(17);
    expect(result.stderr).toBe('boom');
  });

  it('kills timed-out processes and returns a stable result shape', async () => {
    const result = await spawnCjs(inlineScript('setTimeout(() => {}, 5_000);'), [], { timeoutMs: 25 });

    expect(result).toMatchObject({ exitCode: null, stdout: '', stderr: '', timedOut: true });
    expect(result.signal).toBe('SIGTERM');
  });

  it('settles when a timed-out child ignores SIGTERM and cleans its descendant', async () => {
    const scriptPath = inlineScript(`
      const { spawn } = require('node:child_process');
      const { writeFileSync } = require('node:fs');
      const descendant = spawn(process.execPath, ['-e', 'setTimeout(() => {}, 400)'], { stdio: 'ignore' });
      writeFileSync(process.argv[2], String(descendant.pid));
      process.on('SIGTERM', () => {});
      setTimeout(() => process.exit(0), 400);
    `);
    const descendantPidPath = join(dirname(scriptPath), 'descendant.pid');
    const result = await spawnCjs(scriptPath, [descendantPidPath], { timeoutMs: 100 });

    expect(result).toMatchObject({ timedOut: true, exitCode: null, signal: 'SIGKILL' });
    const descendantPid = Number(readFileSync(descendantPidPath, 'utf8'));
    expect(() => process.kill(descendantPid, 0)).toThrow();
  }, 500);
});

import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

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
});

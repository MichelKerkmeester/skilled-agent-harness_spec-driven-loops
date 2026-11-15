// ───────────────────────────────────────────────────────────────────
// MODULE: CLI Stdin Forwarding Tests
// ───────────────────────────────────────────────────────────────────
//
// The CLI entrypoints relaunch themselves under tsx. A caller such as an agent
// tool can leave stdin open or hand over a non-blocking stdin, so the relaunch
// must not read stdin unless the command asked for it, and a read it does make
// must survive EAGAIN.

import { afterEach, describe, expect, it, vi } from 'vitest';

import { spawn, spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { readStdinSync } from '../../scripts/lib/cli-guards.cjs';
import { cleanupNamespace, namespaceArgs, uniqueNamespace, type ScriptNamespace } from '../helpers/spawn-cjs';

const runtimeRoot = fileURLToPath(new URL('../../', import.meta.url));
const upsertScript = resolve(runtimeRoot, 'scripts', 'upsert.cjs');
const nodeFs = createRequire(import.meta.url)('node:fs') as typeof import('node:fs');
const NODES = JSON.stringify([{ id: 'dim-1', kind: 'DIMENSION', name: 'Correctness' }]);

const namespaces: ScriptNamespace[] = [];

afterEach(async () => {
  vi.restoreAllMocks();
  while (namespaces.length > 0) {
    const namespace = namespaces.pop();
    if (namespace) await cleanupNamespace(namespace);
  }
});

describe('readStdinSync', () => {
  it('waits through EAGAIN and returns everything up to end of input', () => {
    const chunks = [Buffer.from('{"a":'), Buffer.from('1}')];
    let call = 0;
    vi.spyOn(nodeFs, 'readSync').mockImplementation(((_fd: number, buffer: Buffer) => {
      call += 1;
      if (call === 1) throw Object.assign(new Error('resource temporarily unavailable'), { code: 'EAGAIN' });
      const next = chunks.shift();
      if (!next) return 0;
      next.copy(buffer);
      return next.length;
    }) as typeof nodeFs.readSync);

    expect(readStdinSync(0).toString('utf8')).toBe('{"a":1}');
    expect(call).toBe(4);
  });
});

describe('upsert.cjs stdin forwarding', () => {
  it('reads piped events when --events names stdin', () => {
    const namespace = uniqueNamespace('upsert');
    namespaces.push(namespace);
    const events = JSON.stringify([{ type: 'node', id: 'dim-1', kind: 'DIMENSION', name: 'Correctness' }]);

    const result = spawnSync(process.execPath, [upsertScript, ...namespaceArgs(namespace), '--events', '-'], {
      cwd: runtimeRoot,
      input: events,
      encoding: 'utf8',
    });

    expect(result.status).toBe(0);
    const json = JSON.parse(result.stdout.trim().split('\n').at(-1) ?? '{}');
    expect(json.data).toMatchObject({ insertedNodes: 1 });
  });

  it('finishes without reading a stdin the caller never closes', async () => {
    const namespace = uniqueNamespace('upsert');
    namespaces.push(namespace);

    const child = spawn(process.execPath, [upsertScript, ...namespaceArgs(namespace), '--nodes', NODES], {
      cwd: runtimeRoot,
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    let stdout = '';
    child.stdout.on('data', (data) => { stdout += String(data); });
    const exitCode = await new Promise<number | null>((resolveExit) => {
      const timer = setTimeout(() => {
        child.kill('SIGKILL');
        resolveExit(null);
      }, 30_000);
      child.on('exit', (code) => {
        clearTimeout(timer);
        resolveExit(code);
      });
    });
    child.stdin.destroy();

    expect(exitCode).toBe(0);
    expect(JSON.parse(stdout.trim().split('\n').at(-1) ?? '{}').data).toMatchObject({ insertedNodes: 1 });
  }, 40_000);
});

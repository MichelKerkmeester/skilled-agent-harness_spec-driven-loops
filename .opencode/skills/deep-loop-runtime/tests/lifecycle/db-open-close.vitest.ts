import { existsSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  cleanupNamespace,
  namespaceArgs,
  runScript,
  runtimeRoot,
  spawnCjs,
  uniqueNamespace,
  type ScriptNamespace,
} from '../helpers/spawn-cjs';

const namespaces: ScriptNamespace[] = [];
const writerLockPath = resolve(runtimeRoot, 'storage', '.deep-loop-graph-writer.lock');

async function waitForLockFile(timeoutMs = 1_000): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (!existsSync(writerLockPath)) {
    if (Date.now() > deadline) throw new Error('writer lock was not acquired in time');
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 10));
  }
}

afterEach(async () => {
  rmSync(writerLockPath, { force: true });
  while (namespaces.length > 0) {
    const namespace = namespaces.pop();
    if (namespace) await cleanupNamespace(namespace);
  }
});

describe('deep-loop graph script DB lifecycle', () => {
  it('opens and closes the SQLite DB cleanly across sequential script invocations', () => {
    const namespace = uniqueNamespace('upsert');
    namespaces.push(namespace);

    const upsert = runScript('upsert', [
      ...namespaceArgs(namespace),
      '--nodes',
      JSON.stringify([{ id: 'dim-1', kind: 'DIMENSION', name: 'Correctness' }]),
    ]);
    const query = runScript('query', [
      ...namespaceArgs(namespace),
      '--query-type',
      'coverage_gaps',
    ]);
    const status = runScript('status', namespaceArgs(namespace));
    const convergence = runScript('convergence', namespaceArgs(namespace));

    for (const result of [upsert, query, status, convergence]) {
      expect(result.exitCode).toBe(0);
      expect(result.stderr).not.toContain('SQLITE_BUSY');
      expect(result.stderr).not.toContain('database is locked');
      expect(result.json.status).toBe('ok');
    }
    expect(status.json.rowCount).toBe(1);
    expect(convergence.json.graph_decision).toBe('STOP_BLOCKED');
  });

  it('returns a DB error when overlapping writers contend for the graph lock', async () => {
    rmSync(writerLockPath, { force: true });
    const first = uniqueNamespace('upsert');
    const second = uniqueNamespace('upsert');
    namespaces.push(first, second);
    const scriptPath = resolve(runtimeRoot, 'scripts', 'upsert.cjs');
    const nodes = JSON.stringify([{ id: 'dim-1', kind: 'DIMENSION', name: 'Correctness' }]);
    const firstRun = spawnCjs(scriptPath, [...namespaceArgs(first), '--nodes', nodes], {
      env: { ...process.env, DEEP_LOOP_SCRIPT_LOCK_HOLD_MS: '500' },
    });

    await waitForLockFile();
    const secondRun = await spawnCjs(scriptPath, [...namespaceArgs(second), '--nodes', nodes]);
    const firstResult = await firstRun;

    expect(firstResult.exitCode).toBe(0);
    expect(secondRun.exitCode).toBe(2);
    expect(JSON.parse(secondRun.stdout)).toMatchObject({ status: 'error', code: 'DB_ERROR' });
    expect(existsSync(writerLockPath)).toBe(false);
  });
});

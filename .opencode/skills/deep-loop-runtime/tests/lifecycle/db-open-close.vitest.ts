import { afterEach, describe, expect, it } from 'vitest';

import {
  cleanupNamespace,
  namespaceArgs,
  runScript,
  uniqueNamespace,
  type ScriptNamespace,
} from '../_helpers/spawn-cjs';

const namespaces: ScriptNamespace[] = [];

afterEach(async () => {
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
});

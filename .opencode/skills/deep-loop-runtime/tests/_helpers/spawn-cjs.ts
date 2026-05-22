import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const helperDir = dirname(fileURLToPath(import.meta.url));
const runtimeRoot = resolve(helperDir, '..', '..');

export type ScriptName = 'convergence' | 'query' | 'status' | 'upsert';

export type ScriptResult = {
  exitCode: number | null;
  stdout: string;
  stderr: string;
  json: Record<string, unknown>;
};

export type ScriptNamespace = {
  specFolder: string;
  loopType: 'research' | 'review';
  sessionId: string;
};

export function uniqueNamespace(scriptName: ScriptName, loopType: 'research' | 'review' = 'review'): ScriptNamespace {
  const nonce = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return {
    specFolder: `specs/118-007-${scriptName}-${nonce}`,
    loopType,
    sessionId: `session-${scriptName}-${nonce}`,
  };
}

export function namespaceArgs(namespace: ScriptNamespace): string[] {
  return [
    '--spec-folder',
    namespace.specFolder,
    '--loop-type',
    namespace.loopType,
    '--session-id',
    namespace.sessionId,
  ];
}

export function runScript(scriptName: ScriptName, args: string[] = []): ScriptResult {
  const scriptPath = resolve(runtimeRoot, 'scripts', `${scriptName}.cjs`);
  const result = spawnSync(process.execPath, [scriptPath, ...args], {
    cwd: runtimeRoot,
    encoding: 'utf8',
  });
  const stdout = result.stdout.trim();
  const jsonLine = stdout.split(/\r?\n/).filter(Boolean).at(-1) ?? '{}';

  return {
    exitCode: result.status,
    stdout,
    stderr: result.stderr.trim(),
    json: JSON.parse(jsonLine) as Record<string, unknown>,
  };
}

export function seedReviewNode(namespace: ScriptNamespace, id = 'dimension-1'): ScriptResult {
  return runScript('upsert', [
    ...namespaceArgs(namespace),
    '--nodes',
    JSON.stringify([{ id, kind: 'DIMENSION', name: 'Correctness' }]),
  ]);
}

export async function cleanupNamespace(namespace: ScriptNamespace): Promise<void> {
  const db = await import('../../lib/coverage-graph/coverage-graph-db.js');
  const connection = db.getDb();
  connection.prepare(
    'DELETE FROM coverage_edges WHERE spec_folder = ? AND loop_type = ? AND session_id = ?',
  ).run(namespace.specFolder, namespace.loopType, namespace.sessionId);
  connection.prepare(
    'DELETE FROM coverage_nodes WHERE spec_folder = ? AND loop_type = ? AND session_id = ?',
  ).run(namespace.specFolder, namespace.loopType, namespace.sessionId);
  connection.prepare(
    'DELETE FROM coverage_snapshots WHERE spec_folder = ? AND loop_type = ? AND session_id = ?',
  ).run(namespace.specFolder, namespace.loopType, namespace.sessionId);
  db.closeDb();
}

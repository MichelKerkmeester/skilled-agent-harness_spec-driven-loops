import { spawn, spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const helperDir = dirname(fileURLToPath(import.meta.url));
export const runtimeRoot = resolve(helperDir, '..', '..');

export type ScriptName = 'convergence' | 'query' | 'status' | 'upsert';

export type ScriptResult = {
  exitCode: number | null;
  stdout: string;
  stderr: string;
  json: Record<string, unknown>;
};

export type SpawnCjsOptions = {
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  timeoutMs?: number;
};

export type SpawnCjsResult = {
  exitCode: number | null;
  stdout: string;
  stderr: string;
  signal: NodeJS.Signals | null;
  timedOut: boolean;
};

export type RunScriptOptions = {
  env?: NodeJS.ProcessEnv;
};

export type ScriptNamespace = {
  specFolder: string;
  loopType: 'research' | 'review' | 'council';
  sessionId: string;
};

/**
 * Generates a unique namespace for a script run with timestamp and random nonce.
 */
export function uniqueNamespace(scriptName: ScriptName, loopType: ScriptNamespace['loopType'] = 'review'): ScriptNamespace {
  const nonce = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return {
    specFolder: `specs/118-007-${scriptName}-${nonce}`,
    loopType,
    sessionId: `session-${scriptName}-${nonce}`,
  };
}

/**
 * Converts a ScriptNamespace into CLI flag arguments.
 */
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

/**
 * Runs a CJS script synchronously and returns parsed JSON output.
 */
export function runScript(scriptName: ScriptName, args: string[] = [], options: RunScriptOptions = {}): ScriptResult {
  const scriptPath = resolve(runtimeRoot, 'scripts', `${scriptName}.cjs`);
  const result = spawnSync(process.execPath, [scriptPath, ...args], {
    cwd: runtimeRoot,
    env: options.env ?? process.env,
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

/**
 * Spawns a CJS script as a child process with configurable timeout and returns stdout/stderr.
 */
export function spawnCjs(
  scriptPath: string,
  args: string[] = [],
  options: SpawnCjsOptions = {},
): Promise<SpawnCjsResult> {
  return new Promise((resolvePromise) => {
    const child = spawn(process.execPath, [scriptPath, ...args], {
      cwd: options.cwd ?? runtimeRoot,
      env: options.env ?? process.env,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    let timedOut = false;
    const timeout = options.timeoutMs
      ? setTimeout(() => {
          timedOut = true;
          child.kill('SIGTERM');
        }, options.timeoutMs)
      : null;

    child.stdout?.setEncoding('utf8');
    child.stderr?.setEncoding('utf8');
    child.stdout?.on('data', (chunk) => { stdout += chunk; });
    child.stderr?.on('data', (chunk) => { stderr += chunk; });
    child.on('close', (exitCode, signal) => {
      if (timeout) clearTimeout(timeout);
      resolvePromise({
        exitCode,
        stdout: stdout.trim(),
        stderr: stderr.trim(),
        signal,
        timedOut,
      });
    });
  });
}

/**
 * Seeds a review dimension node via the upsert script into the given namespace.
 */
export function seedReviewNode(namespace: ScriptNamespace, id = 'dimension-1'): ScriptResult {
  return runScript('upsert', [
    ...namespaceArgs(namespace),
    '--nodes',
    JSON.stringify([{ id, kind: 'DIMENSION', name: 'Correctness' }]),
  ]);
}

/**
 * Deletes all coverage graph rows for a namespace to clean up after a test.
 */
export async function cleanupNamespace(namespace: ScriptNamespace): Promise<void> {
  if (namespace.loopType === 'council') {
    const db = await import('../../lib/council/council-graph-db.js');
    db.cleanupNamespace({
      specFolder: namespace.specFolder,
      sessionId: namespace.sessionId,
    });
    db.closeDb();
    return;
  }

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

// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Loop Runtime Spawn CJS Test Helper
// ───────────────────────────────────────────────────────────────────

import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const helperDir = dirname(fileURLToPath(import.meta.url));
export const runtimeRoot = resolve(helperDir, '..', '..');
const CASSETTE_SCHEMA_VERSION = 1;
const DEFAULT_CASSETTE_DIR = join(runtimeRoot, 'tests', 'fixtures', 'cassettes');

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
  stdin?: string;
  timeoutMs?: number;
};

export type SpawnCjsResult = {
  exitCode: number | null;
  stdout: string;
  stderr: string;
  signal: NodeJS.Signals | null;
  timedOut: boolean;
};

export type HermeticEnv = {
  home: string;
  dbPath: string;
  tmpDir: string;
  env: NodeJS.ProcessEnv;
  cleanup: () => void;
};

export type RunScriptOptions = {
  env?: NodeJS.ProcessEnv;
};

export type ScriptNamespace = {
  specFolder: string;
  loopType: 'research' | 'review' | 'council';
  sessionId: string;
};

export type CassetteId = string;

export type ScriptRunEnvelope = {
  schemaVersion: typeof CASSETTE_SCHEMA_VERSION;
  scriptPath: string;
  cwd: string;
  argv: string[];
  stdin: string;
  stdout: string;
  stderr: string;
  exitCode: number | null;
  signal: NodeJS.Signals | null;
  timedOut: boolean;
};

export type ScriptRunCassette = {
  schemaVersion: typeof CASSETTE_SCHEMA_VERSION;
  cassetteId: CassetteId;
  recordedAt: string;
  envelope: ScriptRunEnvelope;
};

export type ScriptCassetteOptions = SpawnCjsOptions & {
  cassetteDir?: string;
  cassetteId?: CassetteId;
  redactions?: Record<string, string>;
};

export type RecordScriptRunResult = {
  cassetteId: CassetteId;
  cassettePath: string;
  cassette: ScriptRunCassette;
  result: SpawnCjsResult;
};

export type ReplayScriptRunResult = {
  cassetteId: CassetteId;
  cassettePath: string;
  cassette: ScriptRunCassette;
  result: SpawnCjsResult;
  normalized: ScriptRunEnvelope;
  matches: boolean;
  diff: string[];
};

export function createHermeticEnv(testId: string): HermeticEnv {
  const tmpRoot = mkdtempSync(join(tmpdir(), 'dlr-hermetic-'));
  const safeId = testId.replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-+|-+$/g, '') || 'test';
  const testRoot = join(tmpRoot, safeId);
  const home = join(testRoot, 'home');
  const dbPath = join(testRoot, 'database');
  const tmpDir = join(testRoot, 'tmp');
  const opencodeStateDir = join(tmpDir, 'opencode-state');
  const claudeStateDir = join(tmpDir, 'claude-code-state');

  for (const dir of [
    home,
    dbPath,
    tmpDir,
    join(home, '.opencode'),
    join(home, '.claude'),
    join(home, '.claude-code'),
    opencodeStateDir,
    claudeStateDir,
  ]) {
    mkdirSync(dir, { recursive: true });
  }

  return {
    home,
    dbPath,
    tmpDir,
    env: {
      ...process.env,
      HOME: home,
      TMPDIR: tmpDir,
      TEMP: tmpDir,
      TMP: tmpDir,
      SPEC_KIT_DB_DIR: dbPath,
      SPECKIT_DB_DIR: dbPath,
      MEMORY_DB_PATH: join(dbPath, 'context-index.sqlite'),
      OPENCODE_HOME: join(home, '.opencode'),
      CLAUDE_HOME: join(home, '.claude'),
      CLAUDE_CODE_HOME: join(home, '.claude-code'),
      OPENCODE_HOME: join(home, '.opencode'),
      SPECKIT_OPENCODE_STATE_DIR: opencodeStateDir,
      SPECKIT_CLAUDE_CODE_STATE_DIR: claudeStateDir,
      SPECKIT_OPENCODE_STATE_DIR: opencodeStateDir,
    },
    cleanup: () => {
      rmSync(tmpRoot, { recursive: true, force: true });
    },
  };
}

function safeCassetteId(cassetteId: CassetteId): string {
  return cassetteId.replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-+|-+$/g, '') || 'cassette';
}

function defaultCassetteId(scriptPath: string): CassetteId {
  return basename(scriptPath).replace(/\.cjs$/u, '') || 'script-run';
}

function resolveCassettePath(cassetteId: CassetteId, cassetteDir?: string): string {
  return join(cassetteDir ?? DEFAULT_CASSETTE_DIR, `${safeCassetteId(cassetteId)}.json`);
}

function addRedaction(redactions: Map<string, string>, value: string | undefined, replacement: string): void {
  if (value && value.length > 0 && !redactions.has(value)) {
    redactions.set(value, replacement);
  }
}

function buildRedactions(
  scriptPath: string,
  options: ScriptCassetteOptions,
): Array<[string, string]> {
  const cwd = options.cwd ?? runtimeRoot;
  const env = options.env ?? process.env;
  const redactions = new Map<string, string>();

  addRedaction(redactions, resolve(scriptPath), '<SCRIPT_PATH>');
  addRedaction(redactions, runtimeRoot, '<RUNTIME_ROOT>');
  addRedaction(redactions, cwd, '<CWD>');
  addRedaction(redactions, env['HOME'], '<HOME>');
  addRedaction(redactions, env['TMPDIR'], '<TMPDIR>');
  addRedaction(redactions, env['TEMP'], '<TEMP>');
  addRedaction(redactions, env['TMP'], '<TMP>');
  addRedaction(redactions, env['SPEC_KIT_DB_DIR'], '<DB_DIR>');
  addRedaction(redactions, env['SPECKIT_DB_DIR'], '<DB_DIR>');
  addRedaction(redactions, env['MEMORY_DB_PATH'], '<MEMORY_DB_PATH>');
  addRedaction(redactions, env['OPENCODE_HOME'], '<OPENCODE_HOME>');
  addRedaction(redactions, env['CLAUDE_HOME'], '<CLAUDE_HOME>');
  addRedaction(redactions, env['CLAUDE_CODE_HOME'], '<CLAUDE_CODE_HOME>');
  addRedaction(redactions, env['OPENCODE_HOME'], '<OPENCODE_HOME>');
  addRedaction(redactions, env['SPECKIT_OPENCODE_STATE_DIR'], '<OPENCODE_STATE_DIR>');
  addRedaction(redactions, env['SPECKIT_CLAUDE_CODE_STATE_DIR'], '<CLAUDE_CODE_STATE_DIR>');
  addRedaction(redactions, env['SPECKIT_OPENCODE_STATE_DIR'], '<OPENCODE_STATE_DIR>');

  for (const [value, replacement] of Object.entries(options.redactions ?? {})) {
    addRedaction(redactions, value, replacement);
  }

  return [...redactions.entries()].sort((left, right) => right[0].length - left[0].length);
}

function normalizeText(value: string, redactions: Array<[string, string]>): string {
  let normalized = value;
  for (const [needle, replacement] of redactions) {
    normalized = normalized.split(needle).join(replacement);
  }
  return normalized
    .replace(/\b\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z\b/gu, '<ISO_TIMESTAMP>')
    .replace(/\b\d{10,}-[a-z0-9]{4,}\b/gu, '<RUN_ID>')
    .replace(/\b(?:sk|pk|rk|sess)-[A-Za-z0-9_-]{16,}\b/gu, '<TOKEN>')
    .replace(/\b[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\b/gu, '<TOKEN>')
    .replace(/(?:\/private)?\/(?:tmp|var\/folders)\/[^\s"',)]+/gu, '<TMP_PATH>');
}

function normalizeScriptRun(
  scriptPath: string,
  argv: string[],
  result: SpawnCjsResult,
  options: ScriptCassetteOptions,
): ScriptRunEnvelope {
  const redactions = buildRedactions(scriptPath, options);
  return {
    schemaVersion: CASSETTE_SCHEMA_VERSION,
    scriptPath: normalizeText(resolve(scriptPath), redactions),
    cwd: normalizeText(options.cwd ?? runtimeRoot, redactions),
    argv: argv.map((arg) => normalizeText(arg, redactions)),
    stdin: normalizeText(options.stdin ?? '', redactions),
    stdout: normalizeText(result.stdout, redactions),
    stderr: normalizeText(result.stderr, redactions),
    exitCode: result.exitCode,
    signal: result.signal,
    timedOut: result.timedOut,
  };
}

function stableJson(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

function diffEnvelope(expected: ScriptRunEnvelope, actual: ScriptRunEnvelope): string[] {
  const diffs: string[] = [];
  const keys: Array<keyof ScriptRunEnvelope> = [
    'scriptPath',
    'cwd',
    'argv',
    'stdin',
    'stdout',
    'stderr',
    'exitCode',
    'signal',
    'timedOut',
  ];

  for (const key of keys) {
    const expectedValue = stableJson(expected[key]);
    const actualValue = stableJson(actual[key]);
    if (expectedValue !== actualValue) {
      diffs.push(`${key}: expected ${expectedValue} but received ${actualValue}`);
    }
  }

  return diffs;
}

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
      stdio: [options.stdin === undefined ? 'ignore' : 'pipe', 'pipe', 'pipe'],
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
    if (options.stdin !== undefined) {
      child.stdin?.end(options.stdin);
    }
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
 * Runs a CJS script once and writes a normalized cassette envelope for replay.
 */
export async function recordScriptRun(
  scriptPath: string,
  argv: string[] = [],
  options: ScriptCassetteOptions = {},
): Promise<RecordScriptRunResult> {
  const cassetteId = options.cassetteId ?? defaultCassetteId(scriptPath);
  const cassettePath = resolveCassettePath(cassetteId, options.cassetteDir);
  const result = await spawnCjs(scriptPath, argv, options);
  const cassette: ScriptRunCassette = {
    schemaVersion: CASSETTE_SCHEMA_VERSION,
    cassetteId,
    recordedAt: '<ISO_TIMESTAMP>',
    envelope: normalizeScriptRun(scriptPath, argv, result, options),
  };

  mkdirSync(dirname(cassettePath), { recursive: true });
  writeFileSync(cassettePath, `${stableJson(cassette)}\n`, 'utf8');

  return {
    cassetteId,
    cassettePath,
    cassette,
    result,
  };
}

/**
 * Reruns a CJS script and compares its normalized envelope to a stored cassette.
 */
export async function replayScriptRun(
  cassetteId: CassetteId,
  scriptPath: string,
  argv: string[] = [],
  options: ScriptCassetteOptions = {},
): Promise<ReplayScriptRunResult> {
  const cassettePath = resolveCassettePath(cassetteId, options.cassetteDir);
  const cassette = JSON.parse(readFileSync(cassettePath, 'utf8')) as ScriptRunCassette;
  const result = await spawnCjs(scriptPath, argv, options);
  const normalized = normalizeScriptRun(scriptPath, argv, result, options);
  const diff = diffEnvelope(cassette.envelope, normalized);

  return {
    cassetteId,
    cassettePath,
    cassette,
    result,
    normalized,
    matches: diff.length === 0,
    diff,
  };
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

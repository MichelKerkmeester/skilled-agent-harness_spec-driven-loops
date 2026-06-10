// MODULE: Deep-Loop Executor Audit

import { spawn, spawnSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';

import type { ExecutorConfig, ExecutorKind } from './executor-config.js';
import { appendJsonlRecord as appendJsonlRecordSafe, repairJsonlTail } from './jsonl-repair.js';

// ───── TYPE DEFINITIONS ─────

export const CLI_DISPATCH_STACK_ENV = 'SPECKIT_CLI_DISPATCH_STACK' as const;

export type DispatchFailureReason =
  | 'timeout'
  | 'crash'
  | 'missing_output'
  | 'invalid_output'
  | 'other'
  | RecursionGuardFailureReason;

export type RecursionGuardLayer = 'stack' | 'ancestry' | 'env' | 'lockfile';
export type RecursionGuardFailureReason =
  | 'recursion-guard-stack'
  | 'recursion-guard-ancestry'
  | 'recursion-guard-env'
  | 'recursion-guard-lockfile';

export type ExecutorDispatchAllowedResult =
  | { allowed: true }
  | {
      allowed: false;
      reason: RecursionGuardFailureReason;
      layer: RecursionGuardLayer;
      detail: string;
    };

// ───── CONSTANTS ─────

type ExecutorDispatchGuardContext = {
  env?: Record<string, string | undefined>;
  ancestryCmdlines?: string[];
  statePaths?: string[];
};

const EXECUTOR_BINARY_BY_KIND: Partial<Record<ExecutorKind, string>> = {
  'cli-codex': 'codex',
  'cli-claude-code': 'claude',
  'cli-opencode': 'opencode',
};

const EXECUTOR_SESSION_ENV_BY_KIND: Partial<Record<ExecutorKind, string>> = {
  'cli-codex': 'CODEX_SESSION_ID',
  'cli-claude-code': 'CLAUDE_CODE_SESSION_ID',
  'cli-opencode': 'OPENCODE_SESSION_ID',
};

const EXECUTOR_STATE_ENV_BY_KIND: Partial<Record<ExecutorKind, string[]>> = {
  'cli-codex': ['SPECKIT_CODEX_STATE_DIR', 'CODEX_HOME'],
  'cli-claude-code': ['SPECKIT_CLAUDE_CODE_STATE_DIR', 'CLAUDE_CODE_HOME', 'CLAUDE_HOME'],
  'cli-opencode': ['SPECKIT_OPENCODE_STATE_DIR', 'OPENCODE_HOME'],
};

const EXECUTOR_DEFAULT_HOME_DIR_BY_KIND: Partial<Record<ExecutorKind, string>> = {
  'cli-codex': '.codex',
  'cli-claude-code': '.claude',
  'cli-opencode': '.opencode',
};

const EXECUTOR_COMMON_ENV_ALLOWLIST = new Set([
  'PATH',
  'HOME',
  'LANG',
  'TMPDIR',
  'NODE_PATH',
  'TERM',
  // macOS credential auth for CLI executors (e.g. claude OAuth keychain lookup)
  // keys on the user identity + CoreFoundation locale; without these a dispatched
  // CLI reports "Not logged in" even with a valid config dir.
  'USER',
  'LOGNAME',
  '__CF_USER_TEXT_ENCODING',
]);

const EXECUTOR_ENV_PREFIXES_BY_KIND: Partial<Record<ExecutorKind, string[]>> = {
  'cli-codex': ['CODEX_', 'OPENAI_', 'AZURE_OPENAI_'],
  'cli-claude-code': ['CLAUDE_', 'CLAUDE_CODE_', 'ANTHROPIC_'],
  'cli-opencode': ['OPENCODE_'],
};

type RunAuditedExecutorCommandInput = {
  command: string;
  args: string[];
  cwd: string;
  timeoutSeconds: number;
  stateLogPath: string;
  executor: ExecutorConfig;
  iteration: number;
  input?: string;
  guardContext?: ExecutorDispatchGuardContext;
  timeoutGraceMs?: number;
  lineageId?: string;
};

// ───── HELPERS ─────

function getExecutorKind(config: ExecutorConfig): ExecutorKind {
  return config.kind ?? (config as ExecutorConfig & { type?: ExecutorKind }).type ?? 'native';
}

function isAllowedExecutorEnvKey(key: string, kind: ExecutorKind): boolean {
  if (EXECUTOR_COMMON_ENV_ALLOWLIST.has(key) || key.startsWith('LC_')) {
    return true;
  }
  return (EXECUTOR_ENV_PREFIXES_BY_KIND[kind] ?? []).some((prefix) => key.startsWith(prefix));
}

function recursionReasonForLayer(layer: RecursionGuardLayer): RecursionGuardFailureReason {
  return `recursion-guard-${layer}` as RecursionGuardFailureReason;
}

function splitDispatchStack(stack: string | undefined): string[] {
  return (stack ?? '')
    .split(':')
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
}

function commandLineContainsBinary(commandLine: string, binary: string): boolean {
  return commandLine
    .split(/\0|\s+/)
    .map((token) => token.trim().replace(/^['"]|['"]$/g, ''))
    .filter((token) => token.length > 0)
    .some((token) => basename(token) === binary);
}

function readLinuxAncestorCmdlines(startPid: number = process.ppid): string[] {
  const cmdlines: string[] = [];
  let currentPid = startPid;
  const seen = new Set<number>();

  while (currentPid > 1 && !seen.has(currentPid)) {
    seen.add(currentPid);
    const procDir = join('/proc', String(currentPid));
    const cmdlinePath = join(procDir, 'cmdline');
    const statPath = join(procDir, 'stat');

    if (!existsSync(cmdlinePath) || !existsSync(statPath)) {
      break;
    }

    try {
      const cmdline = readFileSync(cmdlinePath, 'utf8').replace(/\0/g, ' ').trim();
      if (cmdline.length > 0) {
        cmdlines.push(cmdline);
      }

      const stat = readFileSync(statPath, 'utf8');
      const closeParenIndex = stat.lastIndexOf(')');
      const afterCommand = closeParenIndex === -1 ? '' : stat.slice(closeParenIndex + 2).trim();
      const parentPid = Number(afterCommand.split(/\s+/)[1]);
      if (!Number.isInteger(parentPid) || parentPid <= 0) {
        break;
      }
      currentPid = parentPid;
    } catch {
      break;
    }
  }

  return cmdlines;
}

function getDefaultStatePaths(kind: ExecutorKind, env: Record<string, string | undefined>): string[] {
  const paths: string[] = [];
  for (const envName of EXECUTOR_STATE_ENV_BY_KIND[kind] ?? []) {
    const value = env[envName];
    if (typeof value === 'string' && value.trim() !== '') {
      paths.push(value);
    }
  }

  const home = env.HOME;
  const homeDir = EXECUTOR_DEFAULT_HOME_DIR_BY_KIND[kind];
  if (typeof home === 'string' && homeDir) {
    paths.push(join(home, homeDir));
  }

  return [...new Set(paths)];
}

function candidateLockfileNames(kind: ExecutorKind): string[] {
  const binary = EXECUTOR_BINARY_BY_KIND[kind] ?? kind;
  return [
    `${kind}.lock`,
    `${binary}.lock`,
    `speckit-${kind}.lock`,
    `speckit-cli-dispatch-${kind}.lock`,
  ];
}

function pathIsReadableDirectory(path: string): boolean {
  try {
    return statSync(path).isDirectory();
  } catch {
    return false;
  }
}

function findLastNonEmptyLineIndex(lines: string[]): number {
  for (let index = lines.length - 1; index >= 0; index -= 1) {
    if (lines[index]?.trim() !== '') {
      return index;
    }
  }

  return -1;
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && !Array.isArray(value) && typeof value === 'object';
}

function readJsonlFile(stateLogPath: string): {
  content: string;
  hasTrailingNewline: boolean;
  lines: string[];
} {
  const content = readFileSync(stateLogPath, 'utf8');
  return {
    content,
    hasTrailingNewline: content.endsWith('\n'),
    lines: content.split(/\r?\n/),
  };
}

function readJsonlFileAfterTailRepair(stateLogPath: string): ReturnType<typeof readJsonlFile> {
  repairJsonlTail(stateLogPath);
  return readJsonlFile(stateLogPath);
}

function rewriteJsonlFile(stateLogPath: string, lines: string[], hasTrailingNewline: boolean): void {
  const rewritten = lines.join('\n');
  writeFileSync(stateLogPath, hasTrailingNewline ? `${rewritten}\n` : rewritten, 'utf8');
}

function parseJsonlObjectLine(line: string): Record<string, unknown> | null {
  try {
    const parsedRecord = JSON.parse(line);
    return isObjectRecord(parsedRecord) ? parsedRecord : null;
  } catch {
    return null;
  }
}

function findLatestIterationRecordIndex(lines: string[], iteration: number): number {
  for (let index = lines.length - 1; index >= 0; index -= 1) {
    const line = lines[index]?.trim();
    if (!line) {
      continue;
    }

    const parsedRecord = parseJsonlObjectLine(line);
    if (
      parsedRecord &&
      parsedRecord.iteration === iteration &&
      (parsedRecord.type === 'iteration' || parsedRecord.type === 'iteration_start')
    ) {
      return index;
    }
  }

  return -1;
}

function findLatestIterationEvent(lines: string[], iteration: number): Record<string, unknown> | null {
  for (let index = lines.length - 1; index >= 0; index -= 1) {
    const line = lines[index]?.trim();
    if (!line) {
      continue;
    }

    const parsedRecord = parseJsonlObjectLine(line);
    if (
      parsedRecord &&
      parsedRecord.iteration === iteration &&
      parsedRecord.type === 'event'
    ) {
      return parsedRecord;
    }
  }

  return null;
}

function killProcessGroup(pid: number | undefined, signal: NodeJS.Signals): void {
  if (typeof pid !== 'number') {
    return;
  }

  try {
    process.kill(process.platform === 'win32' ? pid : -pid, signal);
  } catch {
  }
}

// ───── EXPORTS ─────

/**
 * Detect whether the same executor kind already appears in the dispatch stack.
 *
 * @param stack - The SPECKIT_CLI_DISPATCH_STACK env value.
 * @param kind - The executor kind to check.
 * @returns True if the kind is already present in the stack.
 */
export function detectSameKindFromStack(stack: string | undefined, kind: ExecutorKind): boolean {
  if (kind === 'native') {
    return false;
  }

  return splitDispatchStack(stack).includes(kind);
}

/**
 * Detect whether an executor binary appears in the process ancestry.
 *
 * Reads Linux /proc ancestor cmdlines to find the executor binary.
 *
 * @param kind - The executor kind to check.
 * @param ancestryCmdlines - Pre-computed ancestor command lines (optional).
 * @returns True if the executor binary is found in the ancestry.
 */
export function detectFromAncestry(kind: ExecutorKind, ancestryCmdlines: string[] = readLinuxAncestorCmdlines()): boolean {
  const binary = EXECUTOR_BINARY_BY_KIND[kind];
  if (!binary) {
    return false;
  }

  return ancestryCmdlines.some((commandLine) => commandLineContainsBinary(commandLine, binary));
}

/**
 * Detect whether a runtime session environment variable is set for an executor.
 *
 * @param kind - The executor kind to check.
 * @param env - Environment variable map (defaults to process.env).
 * @returns True if the session environment variable is set.
 */
export function detectFromRuntimeEnv(
  kind: ExecutorKind,
  env: Record<string, string | undefined> = process.env,
): boolean {
  const sessionEnvName = EXECUTOR_SESSION_ENV_BY_KIND[kind];
  if (!sessionEnvName) {
    return false;
  }

  return typeof env[sessionEnvName] === 'string' && env[sessionEnvName]?.trim() !== '';
}

/**
 * Detect whether a dispatch lockfile exists in executor state directories.
 *
 * @param kind - The executor kind to check.
 * @param statePaths - State directory paths to scan (defaults to auto-detected).
 * @returns True if a lockfile is found.
 */
export function detectFromLockfile(kind: ExecutorKind, statePaths: string[] = getDefaultStatePaths(kind, process.env)): boolean {
  if (kind === 'native') {
    return false;
  }

  const names = candidateLockfileNames(kind);
  for (const statePath of statePaths) {
    const directories = [statePath, join(statePath, 'locks')];
    for (const directory of directories) {
      if (!pathIsReadableDirectory(directory)) {
        continue;
      }
      const entries = new Set(readdirSync(directory));
      if (names.some((name) => entries.has(name))) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Validate that an executor dispatch is allowed.
 *
 * Checks stack, ancestry, runtime env, and lockfile layers for recursion
 * guard violations per the deep-loop dispatch contract.
 *
 * @param config - Executor configuration.
 * @param context - Optional environment, ancestry, and state path context.
 * @returns Dispatch result indicating whether dispatch is allowed.
 */
export function validateExecutorDispatchAllowed(
  config: ExecutorConfig,
  context: ExecutorDispatchGuardContext = {},
): ExecutorDispatchAllowedResult {
  const kind = getExecutorKind(config);
  if (kind === 'native') {
    return { allowed: true };
  }

  const env = context.env ?? process.env;
  const stack = env[CLI_DISPATCH_STACK_ENV];
  if (detectSameKindFromStack(stack, kind)) {
    return {
      allowed: false,
      layer: 'stack',
      reason: recursionReasonForLayer('stack'),
      detail: `${kind} already appears in ${CLI_DISPATCH_STACK_ENV}`,
    };
  }

  if (detectFromAncestry(kind, context.ancestryCmdlines)) {
    return {
      allowed: false,
      layer: 'ancestry',
      reason: recursionReasonForLayer('ancestry'),
      detail: `${kind} executor binary appears in process ancestry`,
    };
  }

  if (detectFromRuntimeEnv(kind, env)) {
    const envName = EXECUTOR_SESSION_ENV_BY_KIND[kind] ?? 'runtime session env';
    return {
      allowed: false,
      layer: 'env',
      reason: recursionReasonForLayer('env'),
      detail: `${envName} is set for ${kind}`,
    };
  }

  const statePaths = context.statePaths ?? getDefaultStatePaths(kind, env);
  if (detectFromLockfile(kind, statePaths)) {
    return {
      allowed: false,
      layer: 'lockfile',
      reason: recursionReasonForLayer('lockfile'),
      detail: `${kind} dispatch lockfile exists in runtime state path`,
    };
  }

  return { allowed: true };
}

/**
 * Build the environment for a dispatched executor.
 *
 * Filters the parent environment to only include allowed keys per executor kind
 * and appends the current kind to the dispatch stack.
 *
 * @param config - Executor configuration.
 * @param parentEnv - Parent environment (defaults to process.env).
 * @returns Filtered environment with dispatch stack updated.
 */
export function buildExecutorDispatchEnv(
  config: ExecutorConfig,
  parentEnv: Record<string, string | undefined> = process.env,
): Record<string, string | undefined> {
  const kind = getExecutorKind(config);
  if (kind === 'native') {
    return { ...parentEnv };
  }

  const nextEnv: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(parentEnv)) {
    if (value !== undefined && isAllowedExecutorEnvKey(key, kind)) {
      nextEnv[key] = value;
    }
  }
  nextEnv[CLI_DISPATCH_STACK_ENV] = [...splitDispatchStack(parentEnv[CLI_DISPATCH_STACK_ENV]), kind].join(':');
  return nextEnv;
}

/**
 * Build an executor audit record for provenance logging.
 *
 * @param executor - Executor configuration.
 * @returns Audit record with kind, model, reasoning effort, and service tier.
 */
export function buildExecutorAuditRecord(executor: ExecutorConfig, lineageId?: string): Record<string, unknown> {
  return {
    kind: getExecutorKind(executor),
    model: executor.model,
    reasoningEffort: executor.reasoningEffort,
    serviceTier: executor.serviceTier,
    ...(lineageId !== undefined ? { lineageId } : {}),
  };
}

/**
 * Write the first executor provenance record for an iteration.
 *
 * Updates the iteration start record in the JSONL state log with executor
 * audit data, or creates a new iteration_start record if none exists.
 *
 * @param stateLogPath - Path to the JSONL state log.
 * @param executor - Executor configuration.
 * @param iteration - Current iteration number.
 */
export function writeFirstRecordExecutor(stateLogPath: string, executor: ExecutorConfig, iteration: number): void {
  if (getExecutorKind(executor) === 'native') {
    return;
  }

  const { lines, hasTrailingNewline } = readJsonlFileAfterTailRepair(stateLogPath);
  const recordIndex = findLatestIterationRecordIndex(lines, iteration);

  if (recordIndex !== -1) {
    const parsedRecord = JSON.parse(lines[recordIndex]);
    if (!isObjectRecord(parsedRecord)) {
      throw new Error(`Iteration ${iteration} JSONL record is not an object`);
    }

    if (isObjectRecord(parsedRecord.executor)) {
      return;
    }

    lines[recordIndex] = JSON.stringify({
      ...parsedRecord,
      executor: buildExecutorAuditRecord(executor),
    });
    rewriteJsonlFile(stateLogPath, lines, hasTrailingNewline);
    return;
  }

  appendJsonlRecordSafe(stateLogPath, {
    type: 'iteration_start',
    iteration,
    executor: buildExecutorAuditRecord(executor),
    timestamp: new Date().toISOString(),
  });
}

/**
 * Emit a dispatch failure event to the JSONL state log.
 *
 * @param stateLogPath - Path to the JSONL state log.
 * @param executor - Executor configuration.
 * @param reason - Dispatch failure reason.
 * @param iteration - Current iteration number.
 * @param detail - Optional failure detail string.
 */
export function emitDispatchFailure(
  stateLogPath: string,
  executor: ExecutorConfig,
  reason: DispatchFailureReason,
  iteration: number,
  detail?: string,
): void {
  const lastIterationEvent = findLatestIterationEvent(readJsonlFileAfterTailRepair(stateLogPath).lines, iteration);
  if (lastIterationEvent?.event === 'dispatch_failure') {
    return;
  }

  appendJsonlRecordSafe(stateLogPath, {
    type: 'event',
    event: 'dispatch_failure',
    ...(getExecutorKind(executor) === 'native' ? {} : { executor: buildExecutorAuditRecord(executor) }),
    reason,
    iteration,
    ...(detail ? { detail } : {}),
    timestamp: new Date().toISOString(),
  });
}

/**
 * Run a non-native executor command synchronously and log dispatch failures.
 *
 * Detects timeout, crash, and non-zero exit conditions and translates
 * them into typed dispatch_failure JSONL events.
 *
 * @param input - Command input with executor config and state log path.
 * @returns Always returns 0 (failures are logged, not thrown).
 */
export function runAuditedExecutorCommand(input: RunAuditedExecutorCommandInput): number {
  const dispatchAllowed = validateExecutorDispatchAllowed(input.executor, input.guardContext);
  if (!dispatchAllowed.allowed) {
    emitDispatchFailure(input.stateLogPath, input.executor, dispatchAllowed.reason, input.iteration, dispatchAllowed.detail);
    return 0;
  }

  const timeoutMs = Number.isFinite(input.timeoutSeconds)
    ? Math.max(1000, Math.trunc(input.timeoutSeconds * 1000) - 1000)
    : 1000;
  const result = spawnSync(input.command, input.args, {
    cwd: input.cwd,
    encoding: 'utf8',
    timeout: timeoutMs,
    env: buildExecutorDispatchEnv(input.executor, input.guardContext?.env ?? process.env),
    maxBuffer: 10 * 1024 * 1024,
    ...(typeof input.input === 'string' ? { input: input.input } : {}),
  });

  if (typeof result.stdout === 'string' && result.stdout.length > 0) {
    process.stdout.write(result.stdout);
  }
  if (typeof result.stderr === 'string' && result.stderr.length > 0) {
    process.stderr.write(result.stderr);
  }

  if (result.error) {
    const isTimeoutError =
      result.error.name === 'TimeoutError' ||
      (typeof result.error === 'object' &&
        result.error !== null &&
        'code' in result.error &&
        result.error.code === 'ETIMEDOUT');
    emitDispatchFailure(
      input.stateLogPath,
      input.executor,
      isTimeoutError ? 'timeout' : 'crash',
      input.iteration,
      result.error.message,
    );
    return 0;
  }

  if (typeof result.status === 'number' && result.status !== 0) {
    emitDispatchFailure(
      input.stateLogPath,
      input.executor,
      'crash',
      input.iteration,
      `executor exited with status ${result.status}`,
    );
    return 0;
  }

  if (typeof result.signal === 'string' && result.signal.length > 0) {
    emitDispatchFailure(
      input.stateLogPath,
      input.executor,
      'crash',
      input.iteration,
      `executor terminated by signal ${result.signal}`,
    );
    return 0;
  }

  return 0;
}

/**
 * Run a non-native executor command asynchronously with signal escalation.
 *
 * Uses spawn + detached process group for graceful timeout handling with
 * SIGTERM escalation to SIGKILL after the grace period.
 *
 * @param input - Command input with executor config and state log path.
 * @returns Promise resolving to 0 after process completes.
 */
export async function runAuditedExecutorCommandAsync(input: RunAuditedExecutorCommandInput): Promise<number> {
  const dispatchAllowed = validateExecutorDispatchAllowed(input.executor, input.guardContext);
  if (!dispatchAllowed.allowed) {
    emitDispatchFailure(input.stateLogPath, input.executor, dispatchAllowed.reason, input.iteration, dispatchAllowed.detail);
    return 0;
  }

  const timeoutMs = Number.isFinite(input.timeoutSeconds)
    ? Math.max(1, Math.trunc(input.timeoutSeconds * 1000))
    : 1000;
  const graceMs = Number.isFinite(input.timeoutGraceMs)
    ? Math.max(1, Math.trunc(input.timeoutGraceMs ?? 250))
    : 250;

  await new Promise<void>((resolve) => {
    let timedOut = false;
    let settled = false;
    let graceTimer: NodeJS.Timeout | undefined;
    const child = spawn(input.command, input.args, {
      cwd: input.cwd,
      detached: process.platform !== 'win32',
      env: buildExecutorDispatchEnv(input.executor, input.guardContext?.env ?? process.env),
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    const timeoutTimer = setTimeout(() => {
      timedOut = true;
      killProcessGroup(child.pid, 'SIGTERM');
      graceTimer = setTimeout(() => {
        killProcessGroup(child.pid, 'SIGKILL');
      }, graceMs);
    }, timeoutMs);

    if (typeof input.input === 'string') {
      child.stdin.write(input.input);
    }
    child.stdin.end();

    child.stdout.on('data', (chunk: Buffer) => {
      process.stdout.write(chunk);
    });
    child.stderr.on('data', (chunk: Buffer) => {
      process.stderr.write(chunk);
    });

    child.on('error', (error: Error) => {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(timeoutTimer);
      if (graceTimer) clearTimeout(graceTimer);
      emitDispatchFailure(input.stateLogPath, input.executor, 'crash', input.iteration, error.message);
      resolve();
    });

    child.on('close', (status: number | null, signal: NodeJS.Signals | null) => {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(timeoutTimer);
      if (graceTimer) clearTimeout(graceTimer);

      if (timedOut) {
        emitDispatchFailure(
          input.stateLogPath,
          input.executor,
          'timeout',
          input.iteration,
          `executor timed out after ${timeoutMs}ms`,
        );
        resolve();
        return;
      }

      if (typeof status === 'number' && status !== 0) {
        emitDispatchFailure(
          input.stateLogPath,
          input.executor,
          'crash',
          input.iteration,
          `executor exited with status ${status}`,
        );
        resolve();
        return;
      }

      if (typeof signal === 'string' && signal.length > 0) {
        emitDispatchFailure(
          input.stateLogPath,
          input.executor,
          'crash',
          input.iteration,
          `executor terminated by signal ${signal}`,
        );
      }

      resolve();
    });
  });

  return 0;
}

/**
 * Append executor audit information to the last JSONL record in the state log.
 *
 * @param stateLogPath - Path to the JSONL state log.
 * @param executor - Executor configuration.
 * @throws If the state log is empty or the last record is not an object.
 */
export function appendExecutorAuditToLastRecord(stateLogPath: string, executor: ExecutorConfig): void {
  if (getExecutorKind(executor) === 'native') {
    return;
  }

  const { lines, hasTrailingNewline } = readJsonlFile(stateLogPath);
  const lastLineIndex = findLastNonEmptyLineIndex(lines);

  if (lastLineIndex === -1) {
    throw new Error('State log does not contain any JSONL records');
  }

  const parsedRecord = JSON.parse(lines[lastLineIndex]);
  if (parsedRecord === null || Array.isArray(parsedRecord) || typeof parsedRecord !== 'object') {
    throw new Error('Last JSONL record is not an object');
  }

  const mergedRecord: Record<string, unknown> = {
    ...parsedRecord,
    executor: buildExecutorAuditRecord(executor),
  };

  lines[lastLineIndex] = JSON.stringify(mergedRecord);
  rewriteJsonlFile(stateLogPath, lines, hasTrailingNewline);
}

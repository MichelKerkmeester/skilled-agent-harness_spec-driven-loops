// MODULE: Deep-Loop Executor Audit

import { randomBytes } from 'node:crypto';
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';

import type { ExecutorConfig, ExecutorKind } from './executor-config.js';
import { appendJsonlRecord as appendJsonlRecordSafe, repairJsonlTail } from './jsonl-repair.js';
import { deriveReceiptKey, signReceipt } from './receipt-crypto.js';

// ───── TYPE DEFINITIONS ─────

export const CLI_DISPATCH_STACK_ENV = 'SPECKIT_CLI_DISPATCH_STACK' as const;

export type DispatchFailureReason =
  | 'timeout'
  | 'crash'
  | 'missing_output'
  | 'invalid_output'
  | 'model_mismatch'
  | 'other'
  | 'dispatch_receipt_write_failed'
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
  // Opt-in dispatch-receipt envelope. When receiptDir is set, the engine writes
  // an INTENT receipt before spawn and a COMPLETION countersign after the
  // dispatch returns, to a parent-owned, child-unwritable path. dispatchId is
  // optional; the engine generates a filename-safe unique one when omitted.
  receiptDir?: string;
  dispatchId?: string;
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

// Compare model identities tolerant of trivial formatting so a casing or
// whitespace difference is not mistaken for a substitution. A provider prefix
// (provider/model) is kept verbatim, since two different providers serving a
// same-named model are genuinely different provenance.
function normalizeModelId(model: string): string {
  return model.trim().toLowerCase();
}

// Extract the model an executor actually ran, but only where the CLI reliably
// reports it on stdout. Returning null means "cannot tell" — the caller must
// then skip the mismatch check rather than guess, so an unknown actual model is
// never treated as a substitution. This is deliberately conservative: a false
// loud failure would block a legitimate run.
//
// cli-opencode is the only kind whose stdout carries a machine-readable event
// stream (`opencode run --format json`). Even there, a successful run's
// step/text events may omit the model on some builds; this parser pulls a model
// id only when an event actually surfaces one, otherwise returns null.
// cli-codex / cli-claude-code / native do not reliably report the actual model on stdout,
// so they always return null and are skipped.
export function extractActualModel(stdout: string, kind: ExecutorKind): string | null {
  if (kind !== 'cli-opencode') {
    return null;
  }

  for (const rawLine of stdout.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (line === '' || line[0] !== '{') {
      continue;
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(line);
    } catch {
      continue;
    }
    if (!isObjectRecord(parsed)) {
      continue;
    }

    const model = readEventModelId(parsed);
    if (model !== null) {
      return model;
    }
  }

  return null;
}

// Pull a model id from a single opencode JSON event, tolerant of the shapes
// observed across builds: a top-level providerID/modelID pair, a nested
// part.providerID/part.modelID pair, or a bare modelID/model field. Returns the
// provider-qualified id when a provider is present, else the bare model id.
function readEventModelId(event: Record<string, unknown>): string | null {
  const sources: Array<Record<string, unknown>> = [event];
  if (isObjectRecord(event.part)) {
    sources.push(event.part);
  }
  if (isObjectRecord(event.info)) {
    sources.push(event.info);
  }

  for (const source of sources) {
    const modelId = pickString(source.modelID) ?? pickString(source.model);
    if (modelId === null) {
      continue;
    }
    const providerId = pickString(source.providerID);
    return providerId !== null ? `${providerId}/${modelId}` : modelId;
  }

  return null;
}

function pickString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() !== '' ? value : null;
}

// ───── DISPATCH RECEIPTS ─────
//
// KEY CONTAINMENT GUARANTEE:
// The run-master secret lives ONLY as the module-scoped `runMasterSecret`
// closure variable below. It is generated in this process via randomBytes and
// is, by construction, never:
//   (1) assigned to process.env or to any env object passed to a spawned child,
//   (2) interpolated into the command string or the args array,
//   (3) written to the filesystem (only derived HMAC signatures and receipt
//       JSON — which carry the mac, never the key/secret — are persisted),
//   (4) exported from this module (only opaque test seams touch it).
// Defense in depth: buildExecutorDispatchEnv allowlists env keys, so even a
// hypothetical secret-named var could not transit to a child. The primary
// guarantee is structural — the secret simply never exists in a child-reachable
// location. The per-dispatch signing key (deriveReceiptKey) is recomputed in
// memory from the secret + dispatchId and is likewise never passed to the
// child; same-process verifiers obtain that derived key via
// deriveReceiptKeyForDispatch(), which never returns the raw secret.
//
// WHAT THIS DOES NOT PROVIDE: cross-process authentication. runMasterSecret is
// generated fresh (randomBytes) the first time this module is touched in a
// process and is never persisted, so a validator running in a different
// process than the one that wrote a receipt — a separate CLI invocation, a
// resumed run after a restart — holds a different secret and derives a
// different key by construction. It can never reproduce the mac on a receipt
// this process wrote, even for a completely legitimate receipt, so mac
// agreement only ever confirms "same process," not "unforged." See
// post-dispatch-validate.ts for how the validator treats a mac mismatch as an
// advisory signal rather than proof of tampering.

let runMasterSecret: string | undefined;

function getRunMasterSecret(): string {
  if (runMasterSecret === undefined) {
    runMasterSecret = randomBytes(32).toString('hex');
  }
  return runMasterSecret;
}

/**
 * Same-process accessor for receipt verification: returns the per-dispatch
 * signing key derived from the run-master secret. It never returns or exposes
 * the raw secret, so an in-process validator can verify receipts with the
 * derived key alone — keeping the secret encapsulated in this module.
 */
export function deriveReceiptKeyForDispatch(dispatchId: string): string {
  return deriveReceiptKey(getRunMasterSecret(), dispatchId);
}

/**
 * Test seam: install a known run-master secret so containment assertions can
 * assert a recognizable value never reaches a child. Not for production use.
 */
export function __setRunMasterSecretForTesting(secret: string | undefined): void {
  runMasterSecret = secret;
}

/**
 * Test seam: read the active run-master secret for containment assertions.
 * Not for production use.
 */
export function __getRunMasterSecretForTesting(): string {
  return getRunMasterSecret();
}

type ReceiptPhase = 'intent' | 'completion';

type ReceiptContext = {
  dispatchId: string;
  key: string;
  intentPath: string;
  completionPath: string;
};

function generateDispatchId(input: RunAuditedExecutorCommandInput): string {
  const nonce = randomBytes(8).toString('hex');
  const lineage = (input.lineageId ?? 'dispatch').replace(/[^a-z0-9-]/gi, '-').toLowerCase();
  return `${lineage}-i${input.iteration}-${nonce}`;
}

function receiptPaths(receiptDir: string, dispatchId: string): { intentPath: string; completionPath: string } {
  return {
    intentPath: join(receiptDir, `dispatch-${dispatchId}.intent.json`),
    completionPath: join(receiptDir, `dispatch-${dispatchId}.completion.json`),
  };
}

// Atomic, parent-owned write: create the dir owner-only (0o700), write the
// record to a uniquely-named temp file (0o600, owner-only), then rename over
// the target. POSIX rename is atomic, so a reader never observes a half-written
// receipt. The dispatched child is never given receiptDir or dispatchId (see
// the containment note above), so path secrecy — not the mac — is what stops
// it from locating this file to read or replace it; the owner-only perms are
// the backstop against any other process on the same machine. The mac is a
// same-process integrity signal (see post-dispatch-validate.ts), not a
// cross-process authentication mechanism.
function writeReceiptAtomic(receiptPath: string, record: object): void {
  const dir = dirname(receiptPath);
  mkdirSync(dir, { recursive: true, mode: 0o700 });
  const tmpPath = `${receiptPath}.${process.pid}.${randomBytes(6).toString('hex')}.tmp`;
  writeFileSync(tmpPath, `${JSON.stringify(record)}\n`, { encoding: 'utf8', mode: 0o600 });
  renameSync(tmpPath, receiptPath);
}

function buildReceiptFacts(input: RunAuditedExecutorCommandInput): Record<string, unknown> {
  return {
    command: input.command,
    args: input.args,
    cwd: input.cwd,
    executor: buildExecutorAuditRecord(input.executor, input.lineageId),
    iteration: input.iteration,
  };
}

function buildReceiptRecord(
  phase: ReceiptPhase,
  dispatchId: string,
  facts: Record<string, unknown>,
  key: string,
): Record<string, unknown> {
  const unsigned = {
    version: 1,
    type: 'dispatch_receipt',
    phase,
    dispatchId,
    issuedAt: new Date().toISOString(),
    facts,
  };
  return { ...unsigned, mac: signReceipt(unsigned, key) };
}

function emitReceiptWriteFailure(
  stateLogPath: string,
  executor: ExecutorConfig,
  iteration: number,
  phase: ReceiptPhase,
  detail: string,
): void {
  // Distinct from the dispatch_failure event (and never deduped against it) so
  // a write failure is always observable separately from a 'missing' receipt
  // the validator reports later.
  appendJsonlRecordSafe(stateLogPath, {
    type: 'event',
    event: 'dispatch_receipt_write_failed',
    reason: 'dispatch_receipt_write_failed' as DispatchFailureReason,
    phase,
    iteration,
    ...(getExecutorKind(executor) === 'native' ? {} : { executor: buildExecutorAuditRecord(executor) }),
    timestamp: new Date().toISOString(),
    ...(detail ? { detail } : {}),
  });
}

function tryWriteReceipt(
  stateLogPath: string,
  executor: ExecutorConfig,
  iteration: number,
  phase: ReceiptPhase,
  receiptPath: string,
  record: Record<string, unknown>,
): void {
  try {
    writeReceiptAtomic(receiptPath, record);
  } catch (err) {
    emitReceiptWriteFailure(stateLogPath, executor, iteration, phase, (err as Error).message ?? String(err));
  }
}

// Pre-dispatch: write the INTENT receipt (engine-signed, no child id yet). The
// dispatch has not happened, so the facts carry only what the engine intends.
function beginReceipt(input: RunAuditedExecutorCommandInput): ReceiptContext | null {
  if (!input.receiptDir) {
    return null;
  }
  const dispatchId = input.dispatchId ?? generateDispatchId(input);
  const key = deriveReceiptKey(getRunMasterSecret(), dispatchId);
  const paths = receiptPaths(input.receiptDir, dispatchId);
  const record = buildReceiptRecord('intent', dispatchId, buildReceiptFacts(input), key);
  tryWriteReceipt(input.stateLogPath, input.executor, input.iteration, 'intent', paths.intentPath, record);
  return { dispatchId, key, intentPath: paths.intentPath, completionPath: paths.completionPath };
}

// Post-dispatch: countersign a COMPLETION receipt with the facts the audited
// wrapper observed after spawn returned (child pid / exit / signal). sessionId
// is null here — the engine cannot read a child-set env var; a caller/validator
// that recovers it binds it separately.
type CompletionFacts = {
  childPid: number | null;
  exitStatus: number | null;
  signal: NodeJS.Signals | null;
  sessionId: string | null;
};

function completeReceipt(
  input: RunAuditedExecutorCommandInput,
  ctx: ReceiptContext,
  completion: CompletionFacts,
): void {
  const facts = {
    ...buildReceiptFacts(input),
    childPid: completion.childPid,
    exitStatus: completion.exitStatus,
    signal: completion.signal,
    sessionId: completion.sessionId,
  };
  const record = buildReceiptRecord('completion', ctx.dispatchId, facts, ctx.key);
  tryWriteReceipt(input.stateLogPath, input.executor, input.iteration, 'completion', ctx.completionPath, record);
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
  const executorAudit = getExecutorKind(executor) === 'native'
    ? undefined
    : buildExecutorAuditRecord(executor);
  const lastIterationEvent = findLatestIterationEvent(readJsonlFileAfterTailRepair(stateLogPath).lines, iteration);
  if (
    lastIterationEvent?.event === 'dispatch_failure'
    && lastIterationEvent.reason === reason
    && lastIterationEvent.detail === (detail || undefined)
    && JSON.stringify(lastIterationEvent.executor) === JSON.stringify(executorAudit)
  ) {
    return;
  }

  appendJsonlRecordSafe(stateLogPath, {
    type: 'event',
    event: 'dispatch_failure',
    ...(executorAudit ? { executor: executorAudit } : {}),
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

  // Pre-dispatch INTENT receipt (engine-signed, no child id yet). Null when the
  // caller did not opt into receipts.
  const receiptCtx = beginReceipt(input);

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

  // Post-dispatch COMPLETION countersign: bind the INTENT to the child facts the
  // wrapper observed (pid / exit / signal). Written before failure classification
  // so it always reflects the real outcome, even when the dispatch crashed.
  if (receiptCtx) {
    completeReceipt(input, receiptCtx, {
      childPid: typeof result.pid === 'number' ? result.pid : null,
      exitStatus: typeof result.status === 'number' ? result.status : null,
      signal: typeof result.signal === 'string' ? result.signal : null,
      sessionId: null,
    });
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

  // Provenance must not lie: a clean exit can fail loud when the model the CLI
  // actually ran differs from the one the caller requested. DISABLED BY DEFAULT —
  // current CLIs (the live opencode build) omit the model on a successful stream,
  // so extractActualModel returns null and the check would never fire usefully.
  // It is opt-in via SPECKIT_PROVENANCE_CHECK=1, ready to activate once a build
  // surfaces the model on stdout. It fails safe regardless: an unknown actual
  // model is skipped, never a false loud failure.
  if (process.env.SPECKIT_PROVENANCE_CHECK === '1') {
    const requestedModel = input.executor.model;
    const actualModel = extractActualModel(typeof result.stdout === 'string' ? result.stdout : '', getExecutorKind(input.executor));
    if (
      actualModel !== null &&
      typeof requestedModel === 'string' &&
      requestedModel.trim() !== '' &&
      normalizeModelId(actualModel) !== normalizeModelId(requestedModel)
    ) {
      emitDispatchFailure(
        input.stateLogPath,
        input.executor,
        'model_mismatch',
        input.iteration,
        `requested model ${requestedModel} but executor ran ${actualModel}`,
      );
      return 0;
    }
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

  // Pre-dispatch INTENT receipt (engine-signed, no child id yet).
  const receiptCtx = beginReceipt(input);

  const timeoutMs = Number.isFinite(input.timeoutSeconds)
    ? Math.max(1, Math.trunc(input.timeoutSeconds * 1000))
    : 1000;
  const graceMs = Number.isFinite(input.timeoutGraceMs)
    ? Math.max(1, Math.trunc(input.timeoutGraceMs ?? 250))
    : 250;

  await new Promise<void>((resolve) => {
    let timedOut = false;
    let settled = false;
    let completionWritten = false;
    let graceTimer: NodeJS.Timeout | undefined;
    const child = spawn(input.command, input.args, {
      cwd: input.cwd,
      detached: process.platform !== 'win32',
      env: buildExecutorDispatchEnv(input.executor, input.guardContext?.env ?? process.env),
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    // Capture the real child pid before any handler runs; on spawn failure it may
    // be undefined, in which case the COMPLETION records a null pid (no child).
    const childPid = typeof child.pid === 'number' ? child.pid : null;

    const writeCompletionOnce = (status: number | null, signal: NodeJS.Signals | null): void => {
      if (completionWritten || !receiptCtx) {
        return;
      }
      completionWritten = true;
      completeReceipt(input, receiptCtx, {
        childPid,
        exitStatus: status,
        signal,
        sessionId: null,
      });
    };

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
      // Spawn failed before a child existed; countersign with null facts.
      writeCompletionOnce(null, null);
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

      // Bind INTENT to the observed child exit facts before failure classification.
      writeCompletionOnce(status, signal);

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

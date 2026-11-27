// ───────────────────────────────────────────────────────────────────
// MODULE: Deep-Loop Executor Audit
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import { randomBytes } from 'node:crypto';
import { spawn, spawnSync } from 'node:child_process';
import {
  closeSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  openSync,
  readFileSync,
  readSync,
  readdirSync,
  renameSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { ExecutorConfig, ExecutorKind } from './executor-config.js';
import { appendJsonlRecord as appendJsonlRecordSafe, repairJsonlTail } from './jsonl-repair.js';
import { deriveReceiptKey, signReceipt } from './receipt-crypto.js';

// ───────────────────────────────────────────────────────────────────
// 2. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

export const CLI_DISPATCH_STACK_ENV = 'SPECKIT_CLI_DISPATCH_STACK' as const;
export const FANOUT_LINEAGE_ENV = 'SPECKIT_FANOUT_LINEAGE_ID' as const;
// An operator who starts a dispatch from their own CLI session on purpose sets this to
// exactly '1'. It relaxes only the two checks that detect that host session, never the
// lineage, stack or lockfile layers, and the child never inherits it.
export const HOST_SESSION_EXECUTOR_ENV = 'SPECKIT_ALLOW_HOST_SESSION_EXECUTOR' as const;

// A guard refusal is a route violation, not an executor outcome. It must not read as
// a clean dispatch to the caller, so it exits distinctly from success (0) and from the
// executor-missing fail-closed path, which the dispatcher reports as a usage error (64).
export const RECURSION_GUARD_EXIT_CODE = 3;

export type DispatchFailureReason =
  | 'timeout'
  | 'crash'
  | 'missing_output'
  | 'invalid_output'
  | 'model_mismatch'
  | 'other'
  | 'dispatch_receipt_write_failed'
  | RecursionGuardFailureReason;

export type RecursionGuardLayer = 'lineage' | 'stack' | 'ancestry' | 'env' | 'lockfile';
export type RecursionGuardFailureReason =
  | 'recursion-guard-lineage'
  | 'recursion-guard-stack'
  | 'recursion-guard-ancestry'
  | 'recursion-guard-env'
  | 'recursion-guard-lockfile';

export type ExecutorDispatchAllowedResult =
  | { allowed: true; relaxedLayers?: RecursionGuardLayer[] }
  | {
      allowed: false;
      reason: RecursionGuardFailureReason;
      layer: RecursionGuardLayer;
      detail: string;
    };

// ───────────────────────────────────────────────────────────────────
// 3. CONSTANTS
// ───────────────────────────────────────────────────────────────────

type ExecutorDispatchGuardContext = {
  env?: Record<string, string | undefined>;
  ancestryCmdlines?: string[];
  statePaths?: string[];
};

const EXECUTOR_BINARY_BY_KIND: Partial<Record<ExecutorKind, string | readonly string[]>> = {
  'cli-codex': 'codex',
  'cli-claude-code': 'claude',
  'cli-opencode': 'opencode',
  // 'agent' is an alias symlink to the same binary on this CLI, never the
  // dispatch target — always resolve the canonical name.
  'cli-cursor': 'cursor-agent',
  'cli-devin': 'devin',
  'cli-pi': 'pi',
  'cli-deepseek-harness': 'dsh',
  // A running Vibe shows as its Rust binary or its app server in the ancestor walk,
  // so every name it can appear under is listed rather than the launcher alone.
  'cli-mistral-vibe': ['vibe', 'vibe-rs', 'vibe-app-server'],
};

// Pi's session environment variable is unconfirmed; leave this kind absent
// until the live contract identifies a real session identifier.
// Vibe's session env is unconfirmed too; the kind stays absent rather than carrying a guessed name.
const EXECUTOR_SESSION_ENV_BY_KIND: Partial<Record<ExecutorKind, string>> = {
  'cli-codex': 'CODEX_SESSION_ID',
  'cli-claude-code': 'CLAUDE_CODE_SESSION_ID',
  'cli-opencode': 'OPENCODE_SESSION_ID',
  // Confirmed live 2026-07-24: `cursor-agent -p` sets CURSOR_CONVERSATION_ID in
  // its own subprocess env, matching the --output-format json `session_id` field.
  'cli-cursor': 'CURSOR_CONVERSATION_ID',
};

const EXECUTOR_STATE_ENV_BY_KIND: Partial<Record<ExecutorKind, string[]>> = {
  'cli-codex': ['SPECKIT_CODEX_STATE_DIR', 'CODEX_HOME'],
  'cli-claude-code': ['SPECKIT_CLAUDE_CODE_STATE_DIR', 'CLAUDE_CODE_HOME', 'CLAUDE_HOME'],
  'cli-opencode': ['SPECKIT_OPENCODE_STATE_DIR', 'OPENCODE_HOME'],
  // No CURSOR_HOME-style override is documented or present in `cursor-agent
  // --help` (checked live) — only the repo-owned detection var is listed, never
  // a fabricated CLI-native one.
  'cli-cursor': ['SPECKIT_CURSOR_STATE_DIR'],
  // `devin --help` exposes DEVIN_MODEL, DEVIN_PERMISSION_MODE, and DEVIN_SANDBOX
  // only (checked live) — no DEVIN_HOME-style state-dir override exists, so the
  // repo-owned detection var is the sole entry rather than a fabricated one.
  'cli-devin': ['SPECKIT_DEVIN_STATE_DIR'],
  'cli-pi': ['SPECKIT_PI_STATE_DIR'],
  'cli-deepseek-harness': ['SPECKIT_DEEPSEEK_HARNESS_STATE_DIR', 'DSH_HOME'],
  // Vibe reads its own home override, so an inherited VIBE_HOME is lineage state and not
  // a pass-through variable.
  'cli-mistral-vibe': ['SPECKIT_MISTRAL_VIBE_STATE_DIR', 'VIBE_HOME'],
};

const EXECUTOR_DEFAULT_HOME_DIR_BY_KIND: Partial<Record<ExecutorKind, string>> = {
  'cli-codex': '.codex',
  'cli-claude-code': '.claude',
  'cli-opencode': '.opencode',
  'cli-cursor': '.cursor',
  'cli-devin': '.devin',
  'cli-pi': '.pi',
  'cli-deepseek-harness': '.dsh',
  'cli-mistral-vibe': '.vibe',
};

// Two of the five recursion layers ask "is the caller sitting inside this CLI right now" —
// ancestry and lockfile. Pi has no in-process delegation of its own, so for pi that question
// has no useful answer left: refusing on it leaves a Pi session with no way to hand work out
// at all. The layers that bound a runaway spawn chain, lineage and stack, are deliberately
// NOT listed here and still apply to every kind, this one included.
const SELF_PRESENCE_EXEMPT_KINDS: ReadonlySet<ExecutorKind> = new Set<ExecutorKind>(['cli-pi']);

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
  // Spec-gate + child-session control for dispatched CLI workers. Without these,
  // a worker inherits the parent's enforced spec-gate and halts on the Gate-3
  // documentation question instead of running its task; passing them lets the
  // orchestrator neutralize the gate (SYSTEM_SPEC_GATE_ENFORCE=0) and mark the worker
  // as an orchestrated child session rather than a new top-level session.
  'SYSTEM_SPEC_GATE_ENFORCE',
  'AI_SESSION_CHILD',
  // Set only by the bots runner, to the run id. A git hook reads it to skip a commit made
  // inside a bot run, so a bot that commits can never enqueue itself again.
  'SKILLED_BOT_RUN_ID',
]);

const EXECUTOR_ENV_PREFIXES_BY_KIND: Partial<Record<ExecutorKind, string[]>> = {
  'cli-codex': ['CODEX_', 'OPENAI_', 'AZURE_OPENAI_'],
  'cli-claude-code': ['CLAUDE_', 'CLAUDE_CODE_', 'ANTHROPIC_'],
  'cli-opencode': ['OPENCODE_'],
  // Confirmed live: auth vars (CURSOR_API_KEY/CURSOR_AUTH_TOKEN/
  // CURSOR_API_ENDPOINT) and subprocess env (CURSOR_CONVERSATION_ID/
  // CURSOR_AGENT/CURSOR_INVOKED_AS/CURSOR_RIPGREP_PATH) all share this prefix.
  'cli-cursor': ['CURSOR_'],
  // Confirmed live: DEVIN_MODEL / DEVIN_PERMISSION_MODE / DEVIN_SANDBOX all
  // share this prefix. No session-id env var is documented or observed, so
  // cli-devin is deliberately absent from EXECUTOR_SESSION_ENV_BY_KIND rather
  // than carrying a guessed name.
  'cli-devin': ['DEVIN_'],
  // Pi authenticates most providers from ~/.pi/agent/auth.json, a file, so they need no env
  // pass-through. The exception is the config-only provider declared in .pi/models.json, which
  // keys on an env reference: llmgateway (DevPass) on ${LLMGATEWAY_API_KEY}. This prefix is
  // confirmed by that config plus an observed failure, not inferred by analogy: with it filtered
  // out, a fan-out dispatch reaches pi and dies on "No API key found for llmgateway" while the
  // identical direct dispatch succeeds. Add a prefix here only with the same standard of evidence.
  'cli-pi': ['LLMGATEWAY_'],
  'cli-deepseek-harness': ['LLMGATEWAY_'],
  // Vibe's provider key and its own runtime variables share this prefix; VIBE_HOME also
  // matches it, so the deny table below keeps an inherited home out.
  'cli-mistral-vibe': ['VIBE_'],
};

// Single variables a kind passes through where no prefix fits. Each entry names one
// variable, because a prefix would also let through any variable that shares it.
const EXECUTOR_ENV_KEYS_BY_KIND: Partial<Record<ExecutorKind, string[]>> = {
  // pi-blackhole, an operator-global Pi package, auto-compacts a child mid-run and
  // replaces what it has read with a summary, so a child still reading starts over.
  // This variable switches the package to passive, and the cli-pi skill tells
  // dispatchers to set it, so the filter must not drop it on the way to the child.
  'cli-pi': ['PI_BLACKHOLE_PASSIVE'],
  // DSH_HOME is absent on purpose: the runner gives every lineage a fresh home, and an
  // inherited one would point a leaf at the operator's harness state.
  'cli-deepseek-harness': ['OPENCODE_API_KEY'],
  // Vibe authenticates its provider with this one key; VIBE_HOME is absent on purpose,
  // for the same reason DSH_HOME is.
  'cli-mistral-vibe': ['MISTRAL_API_KEY'],
};

// State variables a kind must never inherit, even when a prefix above would match them.
// A prefix is deliberately broad, so the one name inside it that names lineage state is
// denied here rather than narrowing the prefix and losing its other variables.
const EXECUTOR_ENV_DENY_KEYS_BY_KIND: Partial<Record<ExecutorKind, readonly string[]>> = {
  // An inherited VIBE_HOME points the leaf at the operator's Vibe state, while the runner
  // gives every lineage its own home.
  'cli-mistral-vibe': ['VIBE_HOME'],
};

// Two separate Mistral budgets stand behind one variable name: a key minted by the Vibe
// browser sign-in bills the Vibe budget, and any other Mistral key bills the API budget.
// A lineage otherwise inherits whichever key the operator's shell carries, so the sign-in
// key is read from the keychain and taking it keeps the dispatch on the budget it belongs to.
let cachedMistralSignInKey: string | null | undefined;

/**
 * Read the Mistral Vibe API key from the macOS keychain once per process and cache it; null off macOS
 * or when the keychain holds no key.
 */
export function readMistralVibeSignInKey(): string | null {
  if (cachedMistralSignInKey !== undefined) {
    return cachedMistralSignInKey;
  }
  if (process.platform !== 'darwin') {
    cachedMistralSignInKey = null;
    return cachedMistralSignInKey;
  }

  const result = spawnSync(
    '/usr/bin/security',
    ['find-generic-password', '-s', 'ai.mistral.vibe', '-a', 'MISTRAL_API_KEY', '-w'],
    { encoding: 'utf8', timeout: 5000, stdio: ['ignore', 'pipe', 'ignore'] },
  );
  const stdout = result.status === 0 && typeof result.stdout === 'string' ? result.stdout.trim() : '';
  cachedMistralSignInKey = stdout !== '' ? stdout : null;
  return cachedMistralSignInKey;
}

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
  // The run's session id. On a ledger-backed state log it scopes the failure
  // rows the runner hands the append gateway.
  sessionId?: string;
  // Opt-in dispatch-receipt envelope. When receiptDir is set, the engine writes
  // an INTENT receipt before spawn and a COMPLETION countersign after the
  // dispatch returns, to a parent-owned, child-unwritable path. dispatchId is
  // optional; the engine generates a filename-safe unique one when omitted.
  receiptDir?: string;
  dispatchId?: string;
  // Keys a single-lineage branch must set on the child itself. The cli-deepseek-harness
  // home and spec-folder marker are keys the per-kind allowlist drops on purpose, and the
  // cli-opencode workspace-write deny replaces any inherited inline config. They are merged
  // after the filter, so the value the caller names is the one the child sees. Another kind
  // that needs a key widens its allowlist instead. The allowed keys are those in DISPATCH_ENV_KEYS
  // for the kind and those the caller lists in the field below. Any other key is refused before a receipt is written or
  // a child is spawned. Only the synchronous runner reads this field and completionCheck.
  dispatchEnv?: Record<string, string>;
  // Keys the caller names for this one dispatch, beside the kind's own list. Each must sit in
  // the bounded caller namespace the gate checks, so a key built from a bot-controlled name
  // cannot reach a child by being listed here.
  dispatchEnvKeys?: string[];
  // The harness prints a JSON event stream the orchestrator never reads, so a caller can
  // keep that stream off the terminal and record only how many bytes it held.
  echoStdout?: boolean;
  // A clean exit does not prove a good run for every CLI. When set, it judges the
  // output of a child that exited 0, and a non-null reason is recorded as a crash.
  completionCheck?: (exitCode: number, stdout: string, stderr: string) => string | null;
  // Receives the child's captured stdout once a spawned child settles, whatever its exit,
  // so a caller can record what the stream reports, such as its cost, without echoing it.
  onStdout?: (stdout: string) => void;
  // Where the synchronous runner writes the child's stdout. The file is the only copy of
  // the stream, so a caller that keeps it names the path; without one the runner uses a
  // temporary file it removes once the stream has been read.
  stdoutLogPath?: string;
};

// ───────────────────────────────────────────────────────────────────
// 4. HELPERS
// ───────────────────────────────────────────────────────────────────

function getExecutorKind(config: ExecutorConfig): ExecutorKind {
  return config.kind ?? (config as ExecutorConfig & { type?: ExecutorKind }).type ?? 'native';
}

function isAllowedExecutorEnvKey(key: string, kind: ExecutorKind): boolean {
  if (EXECUTOR_COMMON_ENV_ALLOWLIST.has(key) || key.startsWith('LC_')) {
    return true;
  }
  if ((EXECUTOR_ENV_DENY_KEYS_BY_KIND[kind] ?? []).includes(key)) {
    return false;
  }
  if ((EXECUTOR_ENV_KEYS_BY_KIND[kind] ?? []).includes(key)) {
    return true;
  }
  return (EXECUTOR_ENV_PREFIXES_BY_KIND[kind] ?? []).some((prefix) => key.startsWith(prefix));
}

function recursionReasonForLayer(layer: RecursionGuardLayer): RecursionGuardFailureReason {
  return `recursion-guard-${layer}` as RecursionGuardFailureReason;
}

// A relaxed verdict is reported where the dispatch runs, so the operator sees it once and
// every receipt and failure row of that dispatch carries the layers it skipped.
function applyHostSessionRelaxation(
  input: RunAuditedExecutorCommandInput,
  verdict: Extract<ExecutorDispatchAllowedResult, { allowed: true }>,
): RunAuditedExecutorCommandInput {
  if (!verdict.relaxedLayers) {
    return input;
  }
  const kind = getExecutorKind(input.executor);
  process.stderr.write(
    `${HOST_SESSION_EXECUTOR_ENV}=1 relaxed the ${kind} recursion guard`
      + ` [${verdict.relaxedLayers.join(', ')}]: dispatching from the host session on purpose\n`,
  );
  return { ...input, executor: { ...input.executor, recursionGuardRelaxed: verdict.relaxedLayers } as ExecutorConfig };
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

type AncestorFrame = { commandLine: string; parentPid: number };

// Bounds the walk so a pid cycle or an unexpectedly deep tree cannot spin the guard.
const MAX_ANCESTOR_HOPS = 32;

function readProcAncestorFrame(pid: number): AncestorFrame | null {
  const procDir = join('/proc', String(pid));
  const cmdlinePath = join(procDir, 'cmdline');
  const statPath = join(procDir, 'stat');

  if (!existsSync(cmdlinePath) || !existsSync(statPath)) {
    return null;
  }

  try {
    const commandLine = readFileSync(cmdlinePath, 'utf8').replace(/\0/g, ' ').trim();
    const stat = readFileSync(statPath, 'utf8');
    const closeParenIndex = stat.lastIndexOf(')');
    const afterCommand = closeParenIndex === -1 ? '' : stat.slice(closeParenIndex + 2).trim();
    const parentPid = Number(afterCommand.split(/\s+/)[1]);
    return { commandLine, parentPid: Number.isInteger(parentPid) ? parentPid : 0 };
  } catch {
    return null;
  }
}

// `ps` is the only ancestry source on platforms without /proc — macOS and the BSDs.
// Without it the ancestry layer never fires there, and ancestry is the one layer that
// survives a sandboxed CLI scrubbing its child environment, so a leaf can re-dispatch
// its own binary undetected while every env-based layer stays blind.
function readPsAncestorFrame(pid: number): AncestorFrame | null {
  try {
    const result = spawnSync('/bin/ps', ['-o', 'ppid=,command=', '-p', String(pid)], {
      encoding: 'utf8',
    });
    if (result.status !== 0 || typeof result.stdout !== 'string') {
      return null;
    }

    const line = result.stdout
      .split('\n')
      .map((entry) => entry.trim())
      .find((entry) => entry.length > 0);
    if (!line) {
      return null;
    }

    const separatorIndex = line.search(/\s/);
    if (separatorIndex === -1) {
      return null;
    }

    const parentPid = Number(line.slice(0, separatorIndex));
    return {
      commandLine: line.slice(separatorIndex + 1).trim(),
      parentPid: Number.isInteger(parentPid) ? parentPid : 0,
    };
  } catch {
    return null;
  }
}

/**
 * Read the command lines of the current process ancestry.
 *
 * Prefers /proc where it exists and falls back to `ps`, so the ancestry layer of the
 * recursion guard works on every POSIX platform rather than Linux alone.
 *
 * @param startPid - Pid to start the walk from (defaults to the parent process).
 * @returns Ancestor command lines, nearest ancestor first; empty when none can be read.
 */
export function readAncestorCmdlines(startPid: number = process.ppid): string[] {
  const cmdlines: string[] = [];
  const seen = new Set<number>();
  let currentPid = startPid;
  let hops = 0;

  while (currentPid > 1 && !seen.has(currentPid) && hops < MAX_ANCESTOR_HOPS) {
    seen.add(currentPid);
    hops += 1;

    const frame = readProcAncestorFrame(currentPid) ?? readPsAncestorFrame(currentPid);
    if (!frame) {
      break;
    }

    if (frame.commandLine.length > 0) {
      cmdlines.push(frame.commandLine);
    }
    if (frame.parentPid <= 0) {
      break;
    }
    currentPid = frame.parentPid;
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
  const configured = EXECUTOR_BINARY_BY_KIND[kind];
  // A kind with several binary names keeps the first as its canonical lockfile stem.
  const binary = (typeof configured === 'string' ? configured : configured?.[0]) ?? kind;
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
    // Best-effort: the process group may already have exited.
  }
}

// Compare model identities tolerant of trivial formatting so a casing or
// whitespace difference is not mistaken for a substitution. A provider prefix
// (provider/model) is kept verbatim, since two different providers serving a
// same-named model are genuinely different provenance.
function normalizeModelId(model: string): string {
  return model.trim().toLowerCase();
}

/**
 * Extract the model an executor actually ran, but only where the CLI reliably
 * reports it on stdout. Returning null means "cannot tell" — the caller must
 * then skip the mismatch check rather than guess, so an unknown actual model is
 * never treated as a substitution. This is deliberately conservative: a false
 * loud failure would block a legitimate run.
 *
 * cli-opencode is the only kind whose stdout carries a machine-readable event
 * stream (`opencode run --format json`). Even there, a successful run's
 * step/text events may omit the model on some builds; this parser pulls a model
 * id only when an event actually surfaces one, otherwise returns null.
 * cli-codex / cli-claude-code / native do not reliably report the actual model on stdout,
 * so they always return null and are skipped.
 */
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

// ───────────────────────────────────────────────────────────────────
// 5. DISPATCH RECEIPTS
// ───────────────────────────────────────────────────────────────────
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
  sessionId: string | undefined,
): void {
  // Distinct from the dispatch_failure event (and never deduped against it) so
  // a write failure is always observable separately from a 'missing' receipt
  // the validator reports later.
  appendFailureRow(stateLogPath, {
    type: 'event',
    event: 'dispatch_receipt_write_failed',
    reason: 'dispatch_receipt_write_failed' as DispatchFailureReason,
    phase,
    iteration,
    ...(getExecutorKind(executor) === 'native' ? {} : { executor: buildExecutorAuditRecord(executor) }),
    timestamp: new Date().toISOString(),
    ...(detail ? { detail } : {}),
  }, sessionId);
}

function tryWriteReceipt(
  stateLogPath: string,
  executor: ExecutorConfig,
  iteration: number,
  phase: ReceiptPhase,
  receiptPath: string,
  record: Record<string, unknown>,
  sessionId: string | undefined,
): void {
  try {
    writeReceiptAtomic(receiptPath, record);
  } catch (err: unknown) {
    emitReceiptWriteFailure(stateLogPath, executor, iteration, phase, err instanceof Error ? err.message : String(err), sessionId);
  }
}

// A workflow re-dispatches a failed iteration under the same dispatch id, so the
// retry's receipts would overwrite the only record of the first attempt's exit.
// Earlier pairs move to `dispatch-<id>.attempt-<n>.*` names, keeping the base
// names for the latest attempt, which is the pair validators read. A rename that
// fails leaves the old pair in place to be overwritten, as before.
function archivePriorAttempt(receiptDir: string, dispatchId: string): void {
  const current = receiptPaths(receiptDir, dispatchId);
  if (!existsSync(current.intentPath) && !existsSync(current.completionPath)) {
    return;
  }
  let attempt = 1;
  while (existsSync(join(receiptDir, `dispatch-${dispatchId}.attempt-${attempt}.intent.json`))
    || existsSync(join(receiptDir, `dispatch-${dispatchId}.attempt-${attempt}.completion.json`))) {
    attempt += 1;
  }
  for (const phase of ['intent', 'completion'] as const) {
    const from = phase === 'intent' ? current.intentPath : current.completionPath;
    if (!existsSync(from)) continue;
    try {
      renameSync(from, join(receiptDir, `dispatch-${dispatchId}.attempt-${attempt}.${phase}.json`));
    } catch {
      // Overwriting the old receipt is the pre-existing behaviour; never block a dispatch on it.
    }
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
  archivePriorAttempt(input.receiptDir, dispatchId);
  const paths = receiptPaths(input.receiptDir, dispatchId);
  const record = buildReceiptRecord('intent', dispatchId, buildReceiptFacts(input), key);
  tryWriteReceipt(input.stateLogPath, input.executor, input.iteration, 'intent', paths.intentPath, record, input.sessionId);
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
  tryWriteReceipt(input.stateLogPath, input.executor, input.iteration, 'completion', ctx.completionPath, record, input.sessionId);
}

// ───────────────────────────────────────────────────────────────────
// 6. EXPORTS
// ───────────────────────────────────────────────────────────────────

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
export function detectFromAncestry(kind: ExecutorKind, ancestryCmdlines: string[] = readAncestorCmdlines()): boolean {
  const configured = EXECUTOR_BINARY_BY_KIND[kind];
  if (!configured) {
    return false;
  }

  const binaries = typeof configured === 'string' ? [configured] : configured;
  return ancestryCmdlines.some((commandLine) => binaries.some((binary) => commandLineContainsBinary(commandLine, binary)));
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
 * Detect whether this process is itself a fan-out CLI lineage.
 *
 * @param env - Environment variable map (defaults to process.env).
 * @returns True when the fan-out lineage marker is set.
 */
export function detectFromFanoutLineage(
  env: Record<string, string | undefined> = process.env,
): boolean {
  const lineageId = env[FANOUT_LINEAGE_ENV];
  return typeof lineageId === 'string' && lineageId.trim() !== '';
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

  // A fan-out lineage IS the executor for its own iteration: it was spawned to do the
  // work, not to delegate it again. Any further CLI dispatch from inside one is a route
  // violation regardless of kind, so this layer is checked before the same-kind layers.
  if (detectFromFanoutLineage(env)) {
    return {
      allowed: false,
      layer: 'lineage',
      reason: recursionReasonForLayer('lineage'),
      detail: `${FANOUT_LINEAGE_ENV} is set, so this process is already a fan-out CLI lineage`,
    };
  }

  const stack = env[CLI_DISPATCH_STACK_ENV];
  if (detectSameKindFromStack(stack, kind)) {
    return {
      allowed: false,
      layer: 'stack',
      reason: recursionReasonForLayer('stack'),
      detail: `${kind} already appears in ${CLI_DISPATCH_STACK_ENV}`,
    };
  }

  const selfPresenceExempt = SELF_PRESENCE_EXEMPT_KINDS.has(kind);
  const hostSessionAllowed = env[HOST_SESSION_EXECUTOR_ENV] === '1';
  const relaxedLayers: RecursionGuardLayer[] = [];

  if (!selfPresenceExempt && detectFromAncestry(kind, context.ancestryCmdlines)) {
    if (hostSessionAllowed) {
      relaxedLayers.push('ancestry');
    } else {
      return {
        allowed: false,
        layer: 'ancestry',
        reason: recursionReasonForLayer('ancestry'),
        detail: `${kind} executor binary appears in process ancestry`,
      };
    }
  }

  if (detectFromRuntimeEnv(kind, env)) {
    if (hostSessionAllowed) {
      relaxedLayers.push('env');
    } else {
      const envName = EXECUTOR_SESSION_ENV_BY_KIND[kind] ?? 'runtime session env';
      return {
        allowed: false,
        layer: 'env',
        reason: recursionReasonForLayer('env'),
        detail: `${envName} is set for ${kind}`,
      };
    }
  }

  // The switch does not reach this check: an inherited harness state env points a leaf at
  // the operator's harness state, which is a lineage hazard, not a sign of the host session.
  if (
    kind === 'cli-deepseek-harness'
    && (EXECUTOR_STATE_ENV_BY_KIND[kind] ?? [])
      .some((name) => {
        const value = env[name];
        return typeof value === 'string' && value.trim() !== '';
      })
  ) {
    return {
      allowed: false,
      layer: 'env',
      reason: recursionReasonForLayer('env'),
      detail: 'dsh state environment is set for cli-deepseek-harness',
    };
  }

  const statePaths = context.statePaths ?? getDefaultStatePaths(kind, env);
  if (!selfPresenceExempt && detectFromLockfile(kind, statePaths)) {
    return {
      allowed: false,
      layer: 'lockfile',
      reason: recursionReasonForLayer('lockfile'),
      detail: `${kind} dispatch lockfile exists in runtime state path`,
    };
  }

  return relaxedLayers.length > 0 ? { allowed: true, relaxedLayers } : { allowed: true };
}

/**
 * Format the one-line, actionable refusal a caller prints when the guard blocks a dispatch.
 *
 * @param refusal - The rejecting guard verdict.
 * @param config - Executor configuration the caller asked to dispatch.
 * @returns A single line naming the layer, the signal, and the required alternative.
 */
export function formatRecursionGuardRefusal(
  refusal: Extract<ExecutorDispatchAllowedResult, { allowed: false }>,
  config: ExecutorConfig,
): string {
  const kind = getExecutorKind(config);
  return `nested ${kind} dispatch refused [${refusal.reason}]: ${refusal.detail}`
    + ` — run the iteration in-process instead of dispatching ${kind} again`;
}

/**
 * Build the environment for a dispatched executor.
 *
 * Filters the parent environment to only include allowed keys per executor kind
 * and appends the current kind to the dispatch stack. A cli-mistral-vibe lineage
 * prefers the Vibe sign-in key over the MISTRAL_API_KEY the parent carries.
 *
 * @param config - Executor configuration.
 * @param parentEnv - Parent environment (defaults to process.env).
 * @param options - Replaceable lookups; mistralSignInKey stands in for the keychain read.
 * @returns Filtered environment with dispatch stack updated.
 */
export function buildExecutorDispatchEnv(
  config: ExecutorConfig,
  parentEnv: Record<string, string | undefined> = process.env,
  options: { mistralSignInKey?: () => string | null } = {},
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
  if (kind === 'cli-mistral-vibe') {
    const signInKey = (options.mistralSignInKey ?? readMistralVibeSignInKey)();
    if (signInKey !== null && signInKey.trim() !== '') {
      nextEnv.MISTRAL_API_KEY = signInKey;
    }
  }
  nextEnv[CLI_DISPATCH_STACK_ENV] = [...splitDispatchStack(parentEnv[CLI_DISPATCH_STACK_ENV]), kind].join(':');
  return nextEnv;
}

/**
 * Build an executor audit record for provenance logging.
 *
 * @param executor - Executor configuration, optionally carrying the sandbox report of the
 *   command built from it: the mode that command runs replaces the requested `sandboxMode`,
 *   which is then kept as `sandboxNarrowedFrom` or `sandboxWidenedFrom`.
 * @returns Audit record with kind, model, reasoning effort, and service tier.
 */
export function buildExecutorAuditRecord(
  executor: ExecutorConfig & {
    sandboxNarrowedFrom?: string;
    sandboxWidenedFrom?: string;
    sandboxEnforcement?: string;
    recursionGuardRelaxed?: RecursionGuardLayer[];
  },
  lineageId?: string,
): Record<string, unknown> {
  return {
    kind: getExecutorKind(executor),
    model: executor.model,
    reasoningEffort: executor.reasoningEffort,
    serviceTier: executor.serviceTier,
    sandboxMode: executor.sandboxMode,
    ...(executor.sandboxNarrowedFrom !== undefined ? { sandboxNarrowedFrom: executor.sandboxNarrowedFrom } : {}),
    ...(executor.sandboxWidenedFrom !== undefined ? { sandboxWidenedFrom: executor.sandboxWidenedFrom } : {}),
    ...(executor.sandboxEnforcement !== undefined ? { sandboxEnforcement: executor.sandboxEnforcement } : {}),
    timeoutSeconds: executor.timeoutSeconds,
    webSearch: executor.liveTools?.webSearch ?? null,
    configDir: executor.configDir,
    governor: executor.governor,
    executable: executor.kind,
    ...(lineageId !== undefined ? { lineageId } : {}),
    ...(executor.recursionGuardRelaxed !== undefined ? { recursionGuardRelaxed: executor.recursionGuardRelaxed } : {}),
  };
}

// A stalled gateway would otherwise hold the iteration before its dispatch with no end.
const APPEND_GATEWAY_TIMEOUT_MS = 120_000;
const APPEND_GATEWAY_PATH = fileURLToPath(new URL('../../scripts/append-mode-event.cjs', import.meta.url));
// The gateway binds each append to the checkout's identity, so it runs from the repository root.
const REPOSITORY_ROOT = fileURLToPath(new URL('../../../../../../', import.meta.url));
const LEDGER_MODES = Object.freeze([
  { ledgerDirectory: 'deep-review-ledger', mode: 'review' },
  { ledgerDirectory: 'deep-research-ledger', mode: 'research' },
] as const);

/**
 * A state log beside a ledger with frames is a projection the append gateway
 * rebuilds from that ledger, so a row written straight into it is dropped at
 * the next refresh.
 */
export function ledgerModeFor(stateLogPath: string): 'review' | 'research' | null {
  for (const { ledgerDirectory, mode } of LEDGER_MODES) {
    try {
      if (readdirSync(join(dirname(stateLogPath), ledgerDirectory, 'frames')).some((name) => name.endsWith('.frame'))) {
        return mode;
      }
    } catch {
      // No ledger of this mode sits beside the state log.
    }
  }
  return null;
}

function iterationNamesExecutor(lines: string[], iteration: number): boolean {
  return lines.some((line) => {
    const record = line.trim() ? parseJsonlObjectLine(line) : null;
    return record !== null
      && record.iteration === iteration
      && (record.type === 'iteration' || record.type === 'iteration_start')
      && isObjectRecord(record.executor);
  });
}

/**
 * The gateway runs from the checkout that holds this module. Reached through a
 * symlinked .skilled, that is not the caller's project, so a relative state-log
 * path is fixed against the caller's directory before it crosses the spawn.
 */
export function gatewayRunDirectory(stateLogPath: string): string {
  return dirname(resolve(stateLogPath));
}

function appendThroughGateway(mode: 'review' | 'research', stateLogPath: string, record: Record<string, unknown>): void {
  const eventDir = mkdtempSync(join(tmpdir(), 'executor-audit-event-'));
  const eventPath = join(eventDir, 'event.json');
  try {
    writeFileSync(eventPath, JSON.stringify(record), 'utf8');
    const result = spawnSync(process.execPath, [
      APPEND_GATEWAY_PATH,
      '--mode', mode,
      '--run-directory', gatewayRunDirectory(stateLogPath),
      '--event-json', eventPath,
    ], { cwd: REPOSITORY_ROOT, encoding: 'utf8', timeout: APPEND_GATEWAY_TIMEOUT_MS });
    if (result.status !== 0) {
      const outcome = String(result.stdout || '').trim().split('\n').at(-1)
        || String(result.stderr || '').trim()
        || result.error?.message
        || `exit signal ${String(result.signal)}`;
      throw new Error(`append gateway refused the ${String(record.event ?? record.type)} row for iteration ${String(record.iteration)}: ${outcome}`);
    }
  } finally {
    rmSync(eventDir, { recursive: true, force: true });
  }
}

// The ledger stores a row's objects with sorted keys, so a row the projection
// wrote back is compared with a new one by content, not by key order.
function canonicalJson(value: unknown): string | undefined {
  if (Array.isArray(value)) {
    return `[${value.map((entry) => canonicalJson(entry) ?? 'null').join(',')}]`;
  }
  if (isObjectRecord(value)) {
    return `{${Object.keys(value).sort()
      .filter((key) => value[key] !== undefined)
      .map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`)
      .join(',')}}`;
  }
  return JSON.stringify(value);
}

/**
 * A failure row on a ledger-backed state log goes through the append gateway,
 * or the next refresh drops it. Recording a failure never throws: when the run
 * names no session id or the gateway refuses, the row is written straight into
 * the state log, where the steps that read it right after the dispatch still
 * find it, and stderr says why it will not last.
 */
export function appendFailureRow(stateLogPath: string, row: Record<string, unknown>, sessionId: string | undefined): void {
  const ledgerMode = ledgerModeFor(stateLogPath);
  if (ledgerMode !== null) {
    if (!sessionId) {
      process.stderr.write(`no session id scopes the ${String(row.event)} row, so the next refresh of the ledger-backed state log drops it\n`);
    } else {
      try {
        appendThroughGateway(ledgerMode, stateLogPath, { ...row, sessionId });
        return;
      } catch (error: unknown) {
        process.stderr.write(`${error instanceof Error ? error.message : String(error)}. The next refresh drops the row written in its place\n`);
      }
    }
  }
  appendJsonlRecordSafe(stateLogPath, row);
}

/**
 * Write the first executor provenance record for an iteration.
 *
 * On a ledger-backed state log the iteration_start row goes through the append
 * gateway, so the projection writes it back on every refresh. A state log with
 * no ledger keeps the direct write: the iteration start record gets the
 * executor audit data, or a new iteration_start record is created.
 *
 * @param stateLogPath - Path to the JSONL state log.
 * @param executor - Executor configuration.
 * @param iteration - Current iteration number.
 * @param sessionId - The run's session id, which scopes the ledger event.
 */
export function writeFirstRecordExecutor(
  stateLogPath: string,
  executor: ExecutorConfig,
  iteration: number,
  sessionId?: string,
): void {
  if (getExecutorKind(executor) === 'native') {
    return;
  }

  const ledgerMode = ledgerModeFor(stateLogPath);
  if (ledgerMode !== null) {
    if (iterationNamesExecutor(readJsonlFile(stateLogPath).lines, iteration)) {
      return;
    }
    if (!sessionId) {
      throw new Error('writeFirstRecordExecutor needs the run session id for a ledger-backed state log');
    }
    appendThroughGateway(ledgerMode, stateLogPath, {
      type: 'iteration_start',
      iteration,
      runId: sessionId,
      sessionId,
      lineageId: sessionId,
      executor: buildExecutorAuditRecord(executor),
      timestamp: new Date().toISOString(),
    });
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
 * @param matchedMarker - The provider outage marker, when one matched.
 * @param sessionId - The run's session id, which scopes the ledger event.
 */
export function emitDispatchFailure(
  stateLogPath: string,
  executor: ExecutorConfig,
  reason: DispatchFailureReason,
  iteration: number,
  detail?: string,
  matchedMarker?: string | null,
  sessionId?: string,
): void {
  const executorAudit = getExecutorKind(executor) === 'native'
    ? undefined
    : buildExecutorAuditRecord(executor);
  const lastIterationEvent = findLatestIterationEvent(readJsonlFileAfterTailRepair(stateLogPath).lines, iteration);
  if (
    lastIterationEvent?.event === 'dispatch_failure'
    && lastIterationEvent.reason === reason
    && lastIterationEvent.detail === (detail || undefined)
    && lastIterationEvent.matchedMarker === (matchedMarker || undefined)
    && canonicalJson(lastIterationEvent.executor) === canonicalJson(executorAudit)
  ) {
    return;
  }

  appendFailureRow(stateLogPath, {
    type: 'event',
    event: 'dispatch_failure',
    ...(executorAudit ? { executor: executorAudit } : {}),
    reason,
    iteration,
    ...(detail ? { detail } : {}),
    ...(matchedMarker ? { executorUnavailable: true, matchedMarker } : {}),
    timestamp: new Date().toISOString(),
  }, sessionId);
}

/**
 * Classify provider outage markers from stderr and error-like stdout lines.
 * Ordinary report prose on stdout must not be mistaken for an executor outage.
 *
 * @param stdout - Captured executor standard output.
 * @param stderr - Captured executor standard error.
 * @returns The first matching marker, or null when output has no unavailable marker.
 */
export function classifyExecutorUnavailable(stdout: string, stderr: string): string | null {
  const stdoutErrors = stdout
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0)
    .slice(-20)
    .filter((line) => {
      // An event stream also carries tool output, whose text can name an error and a
      // quota without the executor having hit one, so a JSON event counts only when its
      // own shape says the executor failed: an error event, a Claude result flagged
      // is_error, or a harness final event whose reason kind is error.
      let parsed: unknown;
      try {
        parsed = JSON.parse(line);
      } catch {
        return /\b(error|failed|failure|exception|denied|status)\b/i.test(line);
      }
      if (!isObjectRecord(parsed)) {
        return false;
      }
      return 'error' in parsed
        || 'errorKind' in parsed
        || parsed.type === 'error'
        || parsed.event === 'error'
        || (parsed.type === 'result' && parsed.is_error === true)
        || (parsed.type === 'final' && isObjectRecord(parsed.reason) && parsed.reason.kind === 'error');
    });
  const output = `${stdoutErrors.join('\n')}\n${stderr}`;
  const markers = [
    /resource_exhausted/i,
    /rate[\s_-]*limit/i,
    /usage[\s_-]*limit/i,
    /quota/i,
    /insufficient\s+credits?/i,
    /budget[\s_-]+exhausted/i,
    /too\s+many\s+requests/i,
    /\b429\b/,
    /not\s+authenticated/i,
    /not\s+logged\s+in/i,
    /authentication\s+required/i,
    /unauthorized/i,
    /capacity/i,
    /overloaded/i,
  ];

  for (const marker of markers) {
    const match = marker.exec(output);
    if (match) {
      return match[0];
    }
  }

  return null;
}

// A dispatchEnv key is merged after the per-kind env filter, so it reaches the child even
// when the filter drops it and overrides any inherited value the filter admits. This list
// and the caller namespace below are the only places that say which keys a caller may name. A kind with no
// entry allows none: a caller that needs one widens this list for that kind first.
const DISPATCH_ENV_KEYS: Readonly<Partial<Record<ExecutorKind, readonly string[]>>> = {
  'cli-deepseek-harness': ['DSH_HOME', 'DSH_SPEC_FOLDER', 'SYSTEM_SPEC_GATE_DISABLED', 'AI_SESSION_CHILD'],
  'cli-opencode': ['OPENCODE_CONFIG_CONTENT'],
  // The Vibe builder names a lineage-local home, which the per-kind filter drops when
  // inherited, and turns off the session-start rebuild for a read-only lineage.
  'cli-mistral-vibe': ['VIBE_HOME', 'SPECKIT_DIST_AUTO_REBUILD'],
};

// The one namespace a caller may name keys in for a single dispatch: the bot runtime's per-run
// UTCP config path and its per-bot secret keys. A key outside it is refused even when listed.
const CALLER_DISPATCH_ENV_KEY = /^(?:UTCP_CONFIG_FILE|SKILLED_BOT_SECRET_[A-Z0-9_]+)$/;

// Check the caller-named keys at the one boundary that merges them, so no later caller can
// slip PATH or a secret past the per-kind filter.
function assertDispatchEnvAllowed(input: RunAuditedExecutorCommandInput): void {
  const kind = getExecutorKind(input.executor);
  const allowed = DISPATCH_ENV_KEYS[kind] ?? [];
  const named = input.dispatchEnvKeys ?? [];
  for (const key of named) {
    if (!CALLER_DISPATCH_ENV_KEY.test(key)) {
      throw new Error(`caller-named key ${key} is outside the bounded caller namespace`);
    }
  }
  for (const key of Object.keys(input.dispatchEnv ?? {})) {
    if (!allowed.includes(key) && !named.includes(key)) {
      throw new Error(`dispatchEnv key ${key} is not allowed for ${kind}`);
    }
  }
}

// The checks after a dispatch read at most this much of the end of the stdout file, so a
// stream of any length is judged without holding all of it. A stream up to this size is
// read whole, exactly as an in-memory capture would have held it.
const STDOUT_READ_BYTES = 20 * 1024 * 1024;

// Returns the file whole when it fits the read bound, else its tail from the first line
// boundary past the cut, so no partial line or split character reaches a parser.
function readStdoutTail(filePath: string, size: number): string {
  if (size === 0) {
    return '';
  }
  const length = Math.min(size, STDOUT_READ_BYTES);
  const buffer = Buffer.alloc(length);
  const fd = openSync(filePath, 'r');
  try {
    readSync(fd, buffer, 0, length, size - length);
  } finally {
    closeSync(fd);
  }
  if (length === size) {
    return buffer.toString('utf8');
  }
  const firstNewline = buffer.indexOf(0x0a);
  return firstNewline === -1 ? '' : buffer.subarray(firstNewline + 1).toString('utf8');
}

// Copies the stdout file to the terminal in chunks, so the echo is the whole stream
// without the whole stream ever sitting in memory.
function echoStdoutFile(filePath: string): void {
  const fd = openSync(filePath, 'r');
  try {
    for (;;) {
      const chunk = Buffer.alloc(1024 * 1024);
      const bytesRead = readSync(fd, chunk, 0, chunk.length, null);
      if (bytesRead === 0) {
        break;
      }
      process.stdout.write(chunk.subarray(0, bytesRead));
    }
  } finally {
    closeSync(fd);
  }
}

/**
 * Run a non-native executor command synchronously and log dispatch failures.
 *
 * Detects timeout, crash, and non-zero exit conditions and translates
 * them into typed dispatch_failure JSONL events.
 *
 * @param requested - Command input with executor config and state log path.
 * @returns 0 for executor outcomes (failures are logged, not thrown), or
 *   RECURSION_GUARD_EXIT_CODE when the recursion guard refused before spawn.
 */
export function runAuditedExecutorCommand(requested: RunAuditedExecutorCommandInput): number {
  let input = requested;
  const dispatchAllowed = validateExecutorDispatchAllowed(input.executor, input.guardContext);
  if (!dispatchAllowed.allowed) {
    // Loud and non-zero: a refusal that returned 0 with no message read as a clean
    // dispatch, so the caller carried on and only a missing-artifact check downstream
    // hinted that nothing ran.
    process.stderr.write(`${formatRecursionGuardRefusal(dispatchAllowed, input.executor)}\n`);
    emitDispatchFailure(input.stateLogPath, input.executor, dispatchAllowed.reason, input.iteration, dispatchAllowed.detail, null, input.sessionId);
    return RECURSION_GUARD_EXIT_CODE;
  }
  input = applyHostSessionRelaxation(input, dispatchAllowed);

  // A refused key must fail before the INTENT receipt, so no receipt records a dispatch
  // whose environment the runner would not have allowed.
  assertDispatchEnvAllowed(input);

  // Pre-dispatch INTENT receipt (engine-signed, no child id yet). Null when the
  // caller did not opt into receipts.
  const receiptCtx = beginReceipt(input);

  const timeoutMs = Number.isFinite(input.timeoutSeconds)
    ? Math.max(1000, Math.trunc(input.timeoutSeconds * 1000) - 1000)
    : 1000;
  // The child writes its stdout straight to a file. An in-memory capture has a size cap,
  // and a long stream-json run passed it, which killed the dispatch with ENOBUFS and lost
  // the run's cost. The cap below now bounds stderr alone.
  const tempStdoutDir = input.stdoutLogPath === undefined ? mkdtempSync(join(tmpdir(), 'executor-stdout-')) : null;
  const stdoutLogPath = input.stdoutLogPath ?? join(tempStdoutDir as string, 'stdout.log');
  let result: ReturnType<typeof spawnSync>;
  let stdout: string;
  try {
    mkdirSync(dirname(stdoutLogPath), { recursive: true });
    const stdoutFd = openSync(stdoutLogPath, 'w');
    try {
      result = spawnSync(input.command, input.args, {
        cwd: input.cwd,
        encoding: 'utf8',
        timeout: timeoutMs,
        env: { ...buildExecutorDispatchEnv(input.executor, input.guardContext?.env ?? process.env), ...input.dispatchEnv },
        stdio: ['pipe', stdoutFd, 'pipe'],
        maxBuffer: 10 * 1024 * 1024,
        ...(typeof input.input === 'string' ? { input: input.input } : {}),
      });
    } finally {
      closeSync(stdoutFd);
    }

    const stdoutBytes = statSync(stdoutLogPath).size;
    stdout = readStdoutTail(stdoutLogPath, stdoutBytes);
    if (input.echoStdout === false) {
      // Only the terminal copy is skipped, so a caller can log the stream's size without
      // replaying every event. An empty stream still logs its size, so a silent child
      // reads as 0 bytes, not as no line.
      process.stderr.write(`[executor-audit] child stdout ${stdoutBytes} bytes, not echoed\n`);
    } else if (stdoutBytes > 0) {
      echoStdoutFile(stdoutLogPath);
    }
  } finally {
    if (tempStdoutDir !== null) {
      rmSync(tempStdoutDir, { recursive: true, force: true });
    }
  }
  const stderr = typeof result.stderr === 'string' ? result.stderr : '';
  if (stderr.length > 0) {
    process.stderr.write(stderr);
  }
  const unavailableMarker = classifyExecutorUnavailable(stdout, stderr);

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

  input.onStdout?.(stdout);

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
      unavailableMarker,
      input.sessionId,
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
      unavailableMarker,
      input.sessionId,
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
      unavailableMarker,
      input.sessionId,
    );
    return 0;
  }

  // Some CLIs exit 0 after a failure they report only in their output, such as a
  // plugin that did not load, so the caller's check reads what the child printed.
  if (input.completionCheck && result.status === 0) {
    const completionFailure = input.completionCheck(result.status, stdout, stderr);
    if (completionFailure !== null) {
      emitDispatchFailure(
        input.stateLogPath,
        input.executor,
        'crash',
        input.iteration,
        completionFailure,
        unavailableMarker,
        input.sessionId,
      );
      return 0;
    }
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
    const actualModel = extractActualModel(stdout, getExecutorKind(input.executor));
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
        unavailableMarker,
        input.sessionId,
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
 * @param requested - Command input with executor config and state log path.
 * @returns Promise resolving to 0 after the process completes, or
 *   RECURSION_GUARD_EXIT_CODE when the recursion guard refused before spawn.
 */
export async function runAuditedExecutorCommandAsync(requested: RunAuditedExecutorCommandInput): Promise<number> {
  let input = requested;
  const dispatchAllowed = validateExecutorDispatchAllowed(input.executor, input.guardContext);
  if (!dispatchAllowed.allowed) {
    process.stderr.write(`${formatRecursionGuardRefusal(dispatchAllowed, input.executor)}\n`);
    emitDispatchFailure(input.stateLogPath, input.executor, dispatchAllowed.reason, input.iteration, dispatchAllowed.detail, null, input.sessionId);
    return RECURSION_GUARD_EXIT_CODE;
  }
  input = applyHostSessionRelaxation(input, dispatchAllowed);

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
      emitDispatchFailure(input.stateLogPath, input.executor, 'crash', input.iteration, error.message, null, input.sessionId);
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
          null,
          input.sessionId,
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
          null,
          input.sessionId,
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
          null,
          input.sessionId,
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
 * A ledger-backed state log is rebuilt from its ledger, which cannot carry an
 * edit to a row it already holds. There the executor of the last record's
 * iteration lives on that iteration's opening row, which goes through the
 * append gateway when no row of the iteration names an executor yet.
 *
 * @param stateLogPath - Path to the JSONL state log.
 * @param executor - Executor configuration.
 * @param sessionId - The run's session id, which scopes the ledger event.
 * @throws If the state log is empty or the last record is not an object.
 */
export function appendExecutorAuditToLastRecord(stateLogPath: string, executor: ExecutorConfig, sessionId?: string): void {
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

  if (ledgerModeFor(stateLogPath) !== null) {
    if (!Number.isSafeInteger(parsedRecord.iteration) || parsedRecord.iteration < 1) {
      throw new Error('appendExecutorAuditToLastRecord needs the last record to name its iteration on a ledger-backed state log');
    }
    writeFirstRecordExecutor(stateLogPath, executor, parsedRecord.iteration, sessionId);
    return;
  }

  const mergedRecord: Record<string, unknown> = {
    ...parsedRecord,
    executor: buildExecutorAuditRecord(executor),
  };

  lines[lastLineIndex] = JSON.stringify(mergedRecord);
  rewriteJsonlFile(stateLogPath, lines, hasTrailingNewline);
}

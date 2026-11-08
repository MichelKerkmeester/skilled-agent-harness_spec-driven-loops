#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: History Lookup CLI
// ───────────────────────────────────────────────────────────────────
// The compact boundary hands the model an opaque handle but nothing it can
// run to redeem it. This command is that redemption path: it proves the
// caller still holds the exact locator the hook minted, then prints one
// bounded core reply.
//
// Every step is read-only. A recovery tool that mutated hook state could
// rewrite the boundary it is recovering from, and a refused lookup must not
// leave a quarantine or migration write behind either.

import { readFileSync, readdirSync, realpathSync, statSync, type Dirent } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

import {
  HISTORY_LOCATOR_KINDS,
  HistoryLocatorSchema,
  detectHistoryRuntime,
  getStatePath,
  type HistoryLocator,
  type HistoryLocatorRuntime,
} from '../../claude/hook-state.js';
import { isMainModule } from '../../../lib/esm-entry.js';
import { createHistoryLookup, type HistoryLookup } from './core.js';
import type { HistoryEntry } from './history.js';
import { historyHandle } from './locator-digest.js';
import type { HistoryBrowseInput, HistorySearchInput } from './navigator.js';
import type { HistoryPageInput } from './pages.js';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS & TYPES
// ───────────────────────────────────────────────────────────────────

const LOCATOR_TTL_MS = 30 * 60 * 1000;
const OPERATIONS = ['search', 'browse', 'load', 'page'] as const;
// Claude and Codex name a transcript path; the post-compaction adapters mint
// from the session identity alone and must be read back the same way. Both
// groups derive from the canonical runtime-to-kind map, so a vocabulary change
// cannot leave one side behind.
const TRANSCRIPT_PATH_KIND = HISTORY_LOCATOR_KINDS.claude;

function isTranscriptRuntime(runtime: HistoryLocatorRuntime): boolean {
  return HISTORY_LOCATOR_KINDS[runtime] === TRANSCRIPT_PATH_KIND;
}

type Operation = (typeof OPERATIONS)[number];

/** A refusal the command can explain without leaking a stack trace. */
export type HistoryLookupRefusalCode =
  | 'invalid_usage'
  | 'state_missing'
  | 'state_unreadable'
  | 'locator_missing'
  | 'locator_invalid'
  | 'locator_stale'
  | 'handle_mismatch'
  | 'session_mismatch'
  | 'runtime_mismatch'
  | 'workspace_mismatch'
  | 'unsupported_runtime'
  | 'session_not_found'
  | 'session_ambiguous'
  | 'store_unreadable'
  | 'operation_invalid'
  | 'unknown_history_anchor'
  | 'unknown_history_id'
  | 'unknown_history_part'
  | 'part_too_large'
  | 'reply_too_large'
  | 'reply_unserializable';

export type HistoryLookupCliEnvironment = {
  /** Runtime home whose `~/.claude/projects` tree is searched. */
  home: string;
  /** Runtime home whose `sessions` tree is searched for Codex rollouts. */
  codexHome: string;
  /** Values the locator freshness check compares against. */
  nowMs: number;
  /** Current runtime label, or null when this host has no locator adapter. */
  runtime: HistoryLocatorRuntime | null;
  /** Environment the runtime readers use to locate their stores. */
  env: Record<string, string | undefined>;
};

type ParsedArguments = {
  sessionId: string;
  handle: string;
  operation: Operation;
  operationArgs: string | undefined;
};

type ReaderSource = {
  runtime: string;
  sessionId: string;
  locatorKind: string;
  storePath: string;
};

type ReaderResult =
  | { ok: true; source: ReaderSource; items: unknown[] }
  | { ok: false; code: string };

type SessionReaderModule = {
  readSession(input: Record<string, unknown>): Promise<ReaderResult>;
  capabilities?: Record<string, { status?: string } | undefined>;
};

type LocatedSession =
  | { ok: true; entries: HistoryEntry[] }
  | { ok: false; code: HistoryLookupRefusalCode };

class HistoryLookupCliError extends Error {
  readonly code: HistoryLookupRefusalCode;

  constructor(code: HistoryLookupRefusalCode) {
    super(code);
    this.code = code;
    this.name = 'HistoryLookupCliError';
  }
}

// ───────────────────────────────────────────────────────────────────
// 2. ARGUMENTS
// ───────────────────────────────────────────────────────────────────

function parseArguments(argv: readonly string[]): ParsedArguments | null {
  let sessionId: string | undefined;
  let handle: string | undefined;
  const positional: string[] = [];

  for (let index = 0; index < argv.length; index++) {
    const argument = argv[index];
    if (argument === '--session') {
      sessionId = argv[++index];
      continue;
    }
    if (argument === '--handle') {
      handle = argv[++index];
      continue;
    }
    if (argument === undefined || argument.startsWith('--')) return null;
    positional.push(argument);
  }

  const normalizedSession = sessionId?.trim();
  const normalizedHandle = handle?.trim();
  if (!normalizedSession || !normalizedHandle) return null;

  const operation = positional[0] as Operation | undefined;
  if (operation === undefined || !OPERATIONS.includes(operation)) return null;
  if (positional.length > 2) return null;

  const operationArgs = positional[1]?.trim();
  return {
    sessionId: normalizedSession,
    handle: normalizedHandle,
    operation,
    operationArgs: operationArgs ? operationArgs : undefined,
  };
}

function parseOperationArgs(raw: string | undefined): unknown {
  if (raw === undefined) return {};
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    throw new HistoryLookupCliError('operation_invalid');
  }
}

// ───────────────────────────────────────────────────────────────────
// 3. LOCATOR GATES
// ───────────────────────────────────────────────────────────────────

type StoredLocator =
  | { ok: true; locator: HistoryLocator }
  | { ok: false; code: HistoryLookupRefusalCode };

// Reading the state file directly keeps this command read-only. The shared
// loader performs a lazy schema migration and can quarantine invalid state,
// which are writes a refused lookup must not cause.
function readStoredLocator(sessionId: string): StoredLocator {
  let raw: string;
  try {
    raw = readFileSync(getStatePath(sessionId), 'utf-8');
  } catch (error: unknown) {
    return {
      ok: false,
      code: (error as NodeJS.ErrnoException)?.code === 'ENOENT' ? 'state_missing' : 'state_unreadable',
    };
  }

  let parsed: { historyLocator?: unknown };
  try {
    parsed = JSON.parse(raw) as { historyLocator?: unknown };
  } catch {
    return { ok: false, code: 'state_unreadable' };
  }

  if (parsed?.historyLocator === undefined || parsed.historyLocator === null) {
    return { ok: false, code: 'locator_missing' };
  }
  const result = HistoryLocatorSchema.safeParse(parsed.historyLocator);
  return result.success
    ? { ok: true, locator: result.data }
    : { ok: false, code: 'locator_invalid' };
}

function isFresh(locator: HistoryLocator, nowMs: number): boolean {
  const mintedAtMs = Date.parse(locator.mintedAt);
  const ageMs = nowMs - mintedAtMs;
  // A future timestamp is clock skew, not freshness, so it counts as stale.
  return Number.isFinite(mintedAtMs) && ageMs >= 0 && ageMs < LOCATOR_TTL_MS;
}

// The producer/verifier matrix imports the verifier's digest from here so a
// divergence between an adapter and the CLI fails a test instead of a recovery.
export { historyHandle };

// ───────────────────────────────────────────────────────────────────
// 4. SESSION RESOLUTION
// ───────────────────────────────────────────────────────────────────

function directoryOf(entry: Dirent): string {
  return (entry as unknown as { parentPath?: string }).parentPath
    ?? (entry as unknown as { path?: string }).path
    ?? '';
}

function isFile(filePath: string): boolean {
  try {
    return statSync(filePath).isFile();
  } catch {
    return false;
  }
}

/** Claude stores each session beside the project key derived from its cwd. */
function claudeProjectKey(workspace: string): string {
  return workspace.replace(/[^A-Za-z0-9]/g, '-');
}

function claudeTranscriptCandidates(root: string, locator: HistoryLocator): string[] {
  const preferred = join(root, claudeProjectKey(sessionFolder(locator)), `${locator.sessionId}.jsonl`);
  const candidates = [preferred];
  try {
    for (const entry of readdirSync(root, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const candidate = join(root, entry.name, `${locator.sessionId}.jsonl`);
      if (candidate !== preferred) candidates.push(candidate);
    }
  } catch {
    // The reader distinguishes a missing store from a missing session.
  }
  return candidates.filter(isFile);
}

// A Codex rollout name ends with the exact session id, so the id still picks
// one file. Nothing here ranks by mtime or falls back to newest-in-project.
function codexTranscriptCandidates(root: string, locator: HistoryLocator): string[] {
  const matches: string[] = [];
  try {
    for (const entry of readdirSync(root, { recursive: true, withFileTypes: true })) {
      if (!entry.isFile()) continue;
      if (entry.name !== `${locator.sessionId}.jsonl`
        && !entry.name.endsWith(`-${locator.sessionId}.jsonl`)) continue;
      const directory = directoryOf(entry);
      if (directory) matches.push(join(directory, entry.name));
    }
  } catch {
    // The reader distinguishes a missing store from a missing session.
  }
  return matches.sort();
}

/**
 * The folder the session ran in. The workspace is the checkout root the
 * command runs from, which is a parent of that folder for a session started
 * in a subfolder, and the runtime store is keyed by where the session ran.
 */
function sessionFolder(locator: HistoryLocator): string {
  return locator.sessionDirectory ?? locator.workspace;
}

function storeRootFor(locator: HistoryLocator, environment: HistoryLookupCliEnvironment): string | null {
  if (locator.runtime === 'claude') return join(environment.home, '.claude', 'projects');
  if (locator.runtime === 'codex') return join(environment.codexHome, 'sessions');
  return null;
}

function candidatesFor(locator: HistoryLocator, root: string): string[] {
  return locator.runtime === 'claude'
    ? claudeTranscriptCandidates(root, locator)
    : codexTranscriptCandidates(root, locator);
}

async function loadReaderModule(): Promise<SessionReaderModule | null> {
  const candidates = [
    new URL('../../../../../../hooks/shared/session-readers/index.mjs', import.meta.url),
    new URL('../../../../../../../hooks/shared/session-readers/index.mjs', import.meta.url),
  ];
  for (const candidate of candidates) {
    try {
      return await import(candidate.href) as SessionReaderModule;
    } catch {
      continue;
    }
  }
  return null;
}

function normalizeReaderCode(code: string | undefined): HistoryLookupRefusalCode {
  switch (code) {
    case 'session_not_found':
    case 'session_mismatch':
    case 'session_ambiguous':
    case 'store_unreadable':
      return code;
    case 'capability_gated':
    case 'locator_unavailable':
      return 'unsupported_runtime';
    default:
      return 'store_unreadable';
  }
}

function normalizeOperationCode(code: string): HistoryLookupRefusalCode {
  switch (code) {
    case 'INVALID_HISTORY_NAVIGATOR_INPUT':
    case 'INVALID_PAGE_INPUT':
      return 'operation_invalid';
    case 'UNKNOWN_HISTORY_ANCHOR':
      return 'unknown_history_anchor';
    case 'UNKNOWN_HISTORY_ID':
      return 'unknown_history_id';
    case 'UNKNOWN_HISTORY_PART':
      return 'unknown_history_part';
    case 'PART_TOO_LARGE':
      return 'part_too_large';
    case 'HISTORY_REPLY_TOO_LARGE':
      return 'reply_too_large';
    case 'HISTORY_REPLY_UNSERIALIZABLE':
      return 'reply_unserializable';
    default:
      return 'operation_invalid';
  }
}

/**
 * Read one exact transcript through the runtime reader, then prove the digest.
 *
 * The handle is recomputed from the same path the reader accepted, so a
 * locator copied to another workspace, session or store cannot pass even
 * when every earlier gate matches.
 */
async function locateTranscript(
  locator: HistoryLocator,
  environment: HistoryLookupCliEnvironment,
  readers: SessionReaderModule,
): Promise<LocatedSession> {
  if (!isTranscriptRuntime(locator.runtime)) return { ok: false, code: 'unsupported_runtime' };
  if (locator.locatorKind !== HISTORY_LOCATOR_KINDS[locator.runtime]) {
    return { ok: false, code: 'unsupported_runtime' };
  }

  const root = storeRootFor(locator, environment);
  if (root === null) return { ok: false, code: 'unsupported_runtime' };

  const candidates = candidatesFor(locator, root);
  if (candidates.length === 0) {
    try {
      statSync(root);
      return { ok: false, code: 'session_not_found' };
    } catch {
      return { ok: false, code: 'store_unreadable' };
    }
  }
  // Two files claiming one id are two possible sessions, so the digest is not
  // enough to pick one: a recovery path must refuse rather than guess.
  if (candidates.length > 1) return { ok: false, code: 'session_ambiguous' };

  const transcriptPath = candidates[0] as string;
  const result = await readers.readSession({
    runtime: locator.runtime,
    sessionId: locator.sessionId,
    transcriptPath,
    ...(locator.runtime === 'claude' ? { claudeRoot: root } : { codexRoot: root }),
  });
  if (!result.ok) return { ok: false, code: normalizeReaderCode(result.code) };
  if (result.source.runtime !== locator.runtime || result.source.sessionId !== locator.sessionId) {
    return { ok: false, code: 'session_mismatch' };
  }
  // Same digest mintHistoryLocator produces; the path never leaves this call.
  if (historyHandle(locator, transcriptPath) !== locator.handle) {
    return { ok: false, code: 'handle_mismatch' };
  }
  return { ok: true, entries: result.items as HistoryEntry[] };
}

/**
 * Resolve a post-compaction locator through the runtime reader.
 *
 * Pi, Devin, DSH and OpenCode mint the digest from the session identity alone, so the
 * reader is asked for that exact id and workspace. Enumerating the store would
 * reintroduce the newest-in-project fallback those adapters refuse.
 */
async function locateReaderSession(
  locator: HistoryLocator,
  environment: HistoryLookupCliEnvironment,
  readers: SessionReaderModule,
): Promise<LocatedSession> {
  if (isTranscriptRuntime(locator.runtime)) return { ok: false, code: 'unsupported_runtime' };
  if (locator.locatorKind !== HISTORY_LOCATOR_KINDS[locator.runtime]) {
    return { ok: false, code: 'unsupported_runtime' };
  }

  const result = await readers.readSession({
    runtime: locator.runtime,
    sessionId: locator.sessionId,
    projectDir: sessionFolder(locator),
    home: environment.home,
    env: environment.env,
  });
  if (!result.ok) return { ok: false, code: normalizeReaderCode(result.code) };
  if (result.source.runtime !== locator.runtime || result.source.sessionId !== locator.sessionId) {
    return { ok: false, code: 'session_mismatch' };
  }
  if (historyHandle(locator, null) !== locator.handle) {
    return { ok: false, code: 'handle_mismatch' };
  }
  return { ok: true, entries: result.items as HistoryEntry[] };
}

async function locateSession(
  locator: HistoryLocator,
  environment: HistoryLookupCliEnvironment,
): Promise<LocatedSession> {
  const readers = await loadReaderModule();
  if (readers === null) return { ok: false, code: 'unsupported_runtime' };
  if (readers.capabilities?.[locator.runtime]?.status !== 'ready') {
    return { ok: false, code: 'unsupported_runtime' };
  }
  return isTranscriptRuntime(locator.runtime)
    ? locateTranscript(locator, environment, readers)
    : locateReaderSession(locator, environment, readers);
}

// ───────────────────────────────────────────────────────────────────
// 5. OPERATIONS
// ───────────────────────────────────────────────────────────────────

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function loadIds(value: unknown): readonly string[] {
  if (Array.isArray(value)) return value as string[];
  if (isRecord(value) && Array.isArray(value.historyIds)) return value.historyIds as string[];
  throw new HistoryLookupCliError('operation_invalid');
}

function dispatchOperation(lookup: HistoryLookup, operation: Operation, value: unknown): unknown {
  if (operation === 'load') return lookup.load(loadIds(value));
  if (!isRecord(value)) throw new HistoryLookupCliError('operation_invalid');

  if (operation === 'search') return lookup.search(value as unknown as HistorySearchInput);
  if (operation === 'browse') return lookup.browse(value as unknown as HistoryBrowseInput);
  return lookup.page(value as unknown as HistoryPageInput);
}

// ───────────────────────────────────────────────────────────────────
// 6. ENTRY
// ───────────────────────────────────────────────────────────────────

/**
 * Resolve the runtime label this host actually is.
 *
 * The shared detector owns the Claude/Codex defaults and refuses every other
 * label, but a post-compaction adapter's printed command names its runtime
 * explicitly, so those labels become resolvable here and nothing else does.
 */
function currentRuntime(): HistoryLocatorRuntime | null {
  const detected = detectHistoryRuntime();
  if (detected !== null) return detected;
  const label = process.env.SPECKIT_RUNTIME;
  return label === 'pi' || label === 'devin' || label === 'dsh' || label === 'opencode' ? label : null;
}

function environmentOf(overrides: Partial<HistoryLookupCliEnvironment>): HistoryLookupCliEnvironment {
  const home = overrides.home ?? homedir();
  return {
    home,
    codexHome: overrides.codexHome ?? process.env.CODEX_HOME ?? join(home, '.codex'),
    nowMs: overrides.nowMs ?? Date.now(),
    runtime: overrides.runtime === undefined ? currentRuntime() : overrides.runtime,
    env: overrides.env ?? process.env,
  };
}

function refusal(write: (text: string) => void, code: HistoryLookupRefusalCode): 2 {
  write(`${JSON.stringify({ ok: false, code })}\n`);
  return 2;
}

/**
 * Compare two directories by their real paths. A workspace reached through a
 * symlink, such as macOS `/var` for `/private/var`, is the same directory, and
 * a path that cannot be resolved never matches.
 */
function sameDirectory(left: string, right: string): boolean {
  try {
    return realpathSync(left) === realpathSync(right);
  } catch {
    return false;
  }
}

/**
 * Run one lookup and write exactly one JSON line.
 *
 * A success prints the core's already-capped reply. Every refusal prints the
 * same `{ok:false, code}` envelope and exits 2, so the model can branch on one
 * shape without parsing diagnostics.
 */
export async function runHistoryLookupCli(
  argv: readonly string[],
  overrides: Partial<HistoryLookupCliEnvironment> = {},
  write: (text: string) => void = (text) => { process.stdout.write(text); },
): Promise<number> {
  const environment = environmentOf(overrides);
  const args = parseArguments(argv);
  if (args === null) return refusal(write, 'invalid_usage');
  // A runtime without a history locator never has hook state, so it is refused
  // as unsupported before the state lookup reports it as missing.
  if (environment.runtime === null) return refusal(write, 'unsupported_runtime');

  const stored = readStoredLocator(args.sessionId);
  if (!stored.ok) return refusal(write, stored.code);
  const locator = stored.locator;

  if (args.handle !== locator.handle) return refusal(write, 'handle_mismatch');
  if (args.sessionId !== locator.sessionId) return refusal(write, 'session_mismatch');
  if (environment.runtime !== locator.runtime) return refusal(write, 'runtime_mismatch');
  if (!sameDirectory(process.cwd(), locator.workspace)) return refusal(write, 'workspace_mismatch');
  if (!isFresh(locator, environment.nowMs)) return refusal(write, 'locator_stale');

  try {
    const located = await locateSession(locator, environment);
    if (!located.ok) return refusal(write, located.code);

    const value = parseOperationArgs(args.operationArgs);
    const reply = dispatchOperation(createHistoryLookup(located.entries), args.operation, value);
    write(`${JSON.stringify(reply)}\n`);
    return 0;
  } catch (error: unknown) {
    const code = error instanceof Object && 'code' in error
      ? String((error as { code?: unknown }).code)
      : '';
    return refusal(write, code ? normalizeOperationCode(code) : 'operation_invalid');
  }
}

// Run — exit 2 on any refusal and 0 only after a reply was written.
if (isMainModule(import.meta.url)) {
  runHistoryLookupCli(process.argv.slice(2))
    .then((exitCode) => {
      process.exitCode = exitCode;
    })
    .catch(() => {
      process.stdout.write(`${JSON.stringify({ ok: false, code: 'operation_invalid' })}\n`);
      process.exitCode = 2;
    });
}

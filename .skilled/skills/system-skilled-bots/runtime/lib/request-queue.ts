// ───────────────────────────────────────────────────────────────────
// MODULE: Request Queue
// ───────────────────────────────────────────────────────────────────
//
// A file queue under the user-level state root, keyed by repository
// identity. Every state change of a request is one rename between sibling
// folders, so a request is in exactly one folder at a time and two consumers
// can never both claim it: only one rename out of the watched folder wins.
// The watched folder holds nothing but complete requests, because a launchd
// queue agent keeps running while anything sits in it: temp files are
// written in `tmp/`, and a refused or exhausted request leaves for
// `quarantine/` with a reason file, never back into the watched folder.
// All folders are siblings under one directory, so every rename stays on
// one filesystem. A seen-key marker, created exclusively, makes a re-sent
// event a duplicate instead of a second run; a crash after the marker and
// before the rename loses the event rather than running it twice.

import { randomBytes } from 'node:crypto';
import { readdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { readDefinition } from './definition.js';
import { identityGuard } from './identity.js';
import { readRepoConfig } from './repo-config.js';
import { buildRequest, COMMIT_SOURCE, eventDigest, validateRequest } from './request-record.js';
import { definitionPath } from './runner.js';
import { ensureIdentityState, identityStatePaths, isSafeSegment, userStateRoot } from './state-root.js';

import type { RepoConfig, Result } from './repo-config.js';
import type { QueuedRequest, RequestInput } from './request-record.js';
import type { IdentityStatePaths } from './state-root.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPES & CONSTANTS
// ───────────────────────────────────────────────────────────────────

/** A request is attempted at most this many times in total, then quarantined. */
export const RETRY_BOUND = 3;

/** The quarantine reason of a request that failed on every allowed attempt. */
export const RETRY_BOUND_REASON = 'retry-bound';

/** The quarantine reason of a file in the watched folder that is not a request. */
export const MALFORMED_REQUEST_REASON = 'malformed-request';

const FILE_MODE = 0o600;
const REASON_SUFFIX = '.reason.json';

type QueueFolders = IdentityStatePaths['requests'];

export interface EnqueueResult {
  status: 'enqueued' | 'duplicate';
  requestId: string;
  /** The inbox path the request was renamed to; null for a duplicate. */
  path: string | null;
}

/** What a producer needs to find one repository's queue. */
export interface QueueContext {
  config: RepoConfig;
  identity: string;
  stateRoot: string;
}

/** The reason file written beside a quarantined request. */
export interface QuarantineReason {
  name: string;
  requestId: string | null;
  reason: string;
  detail: string | null;
  quarantinedAt: string;
}

// ───────────────────────────────────────────────────────────────────
// 2. HELPERS
// ───────────────────────────────────────────────────────────────────

function errorCode(error: unknown): string {
  const code = (error as NodeJS.ErrnoException | null)?.code;
  return typeof code === 'string' ? code : 'unknown error';
}

/** Write a file into `tmp/` and rename it to its destination, so no reader ever sees a partial file. */
function writeThroughTmp(folders: QueueFolders, destination: string, data: unknown): void {
  const temp = join(folders.tmp, `${process.pid}-${randomBytes(6).toString('hex')}.json`);
  writeFileSync(temp, `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx', mode: FILE_MODE });
  try {
    renameSync(temp, destination);
  } catch (error: unknown) {
    rmSync(temp, { force: true });
    throw error;
  }
}

/** Rename one queue entry, reporting a vanished source as a lost race rather than a crash. */
function move(from: string, to: string, lostReason: string): Result<string> {
  try {
    renameSync(from, to);
    return { ok: true, value: to };
  } catch (error: unknown) {
    const code = errorCode(error);
    if (code === 'ENOENT') return { ok: false, reason: lostReason };
    return { ok: false, reason: 'queue-move-failed', detail: code };
  }
}

/** The queue folders of one identity, created owner-only. */
export function queueFolders(stateRoot: string, identity: string): QueueFolders {
  return ensureIdentityState(stateRoot, identity).requests;
}

// ───────────────────────────────────────────────────────────────────
// 3. ENQUEUE
// ───────────────────────────────────────────────────────────────────

/**
 * Write one request into the watched folder: temp file first, then the
 * exclusive seen-key marker, then one rename. A marker that already exists
 * means the event was enqueued before, and nothing reaches the watched folder.
 *
 * @returns `enqueued` with the inbox path, or `duplicate` naming the request already sent.
 */
export function enqueueRequest(stateRoot: string, request: QueuedRequest): Result<EnqueueResult> {
  const valid = validateRequest(request);
  if (!valid.ok) return valid;
  const folders = queueFolders(stateRoot, request.target.identity);
  const temp = join(folders.tmp, `${request.id}.${process.pid}-${randomBytes(6).toString('hex')}.json`);
  writeFileSync(temp, `${JSON.stringify(request, null, 2)}\n`, { flag: 'wx', mode: FILE_MODE });
  try {
    writeFileSync(join(folders.seen, eventDigest(request.workflowId, request.idempotencyKey)), `${request.id}\n`, {
      flag: 'wx',
      mode: FILE_MODE,
    });
  } catch (error: unknown) {
    rmSync(temp, { force: true });
    if (errorCode(error) === 'EEXIST') return { ok: true, value: { status: 'duplicate', requestId: request.id, path: null } };
    return { ok: false, reason: 'seen-marker-failed', detail: errorCode(error) };
  }
  const destination = join(folders.inbox, `${request.id}.json`);
  try {
    renameSync(temp, destination);
  } catch (error: unknown) {
    // The marker stays, so this event is lost rather than ever run twice.
    rmSync(temp, { force: true });
    return { ok: false, reason: 'enqueue-rename-failed', detail: errorCode(error) };
  }
  return { ok: true, value: { status: 'enqueued', requestId: request.id, path: destination } };
}

/**
 * Resolve a checkout's queue: its config, its identity and its state root.
 * Identity is checked before anything else, so an unknown repository never
 * gets a state folder.
 *
 * @returns The context, or a config refusal or `identity-unknown`.
 */
export function queueContext(checkoutRoot: string, env: NodeJS.ProcessEnv = process.env): Result<QueueContext> {
  const config = readRepoConfig(checkoutRoot);
  if (!config.ok) return config;
  const identity = identityGuard(checkoutRoot, env);
  if (!identity.ok) return identity;
  return {
    ok: true,
    value: { config: config.value, identity: identity.value.identity, stateRoot: userStateRoot(config.value, env) },
  };
}

/**
 * Enqueue one request for a checkout: resolve identity first, then build and
 * enqueue. Refuses `identity-unknown` before any file is written.
 */
export function enqueueFromCheckout(
  checkoutRoot: string,
  input: Omit<RequestInput, 'target'>,
  env: NodeJS.ProcessEnv = process.env,
): Result<EnqueueResult> {
  const context = queueContext(checkoutRoot, env);
  if (!context.ok) return context;
  const request = buildRequest({ ...input, target: { identity: context.value.identity, path: checkoutRoot } });
  if (!request.ok) return request;
  return enqueueRequest(context.value.stateRoot, request.value);
}

/** The bots of a checkout whose definition declares a git-hook trigger. A definition that does not parse is skipped. */
export function commitTriggeredBots(checkoutRoot: string): string[] {
  let names: string[];
  try {
    names = readdirSync(join(checkoutRoot, 'bots'));
  } catch {
    return [];
  }
  return names
    .filter((name) => isSafeSegment(name))
    .filter((name) => {
      const definition = readDefinition(definitionPath(checkoutRoot, name));
      return definition.ok && definition.value.id === name && definition.value.trigger.kind === 'git-hook';
    })
    .sort();
}

/**
 * Enqueue one request per commit-triggered bot for one commit. A repository
 * that has not set `gitHookTrigger` gets nothing, and no identity is asked for.
 *
 * @returns One result per bot (empty when the repository has not opted in),
 *   or a refusal for a bad config or an unknown identity.
 */
export function enqueueCommit(
  checkoutRoot: string,
  commitSha: string,
  env: NodeJS.ProcessEnv = process.env,
): Result<Array<{ botId: string; result: Result<EnqueueResult> }>> {
  const config = readRepoConfig(checkoutRoot);
  if (!config.ok) return config;
  if (!config.value.gitHookTrigger) return { ok: true, value: [] };
  const bots = commitTriggeredBots(checkoutRoot);
  if (bots.length === 0) return { ok: true, value: [] };
  const context = queueContext(checkoutRoot, env);
  if (!context.ok) return context;
  const { identity, stateRoot } = context.value;
  return {
    ok: true,
    value: bots.map((botId) => {
      const request = buildRequest({
        kind: 'run',
        workflowId: botId,
        source: COMMIT_SOURCE,
        eventId: commitSha,
        origin: `commit ${commitSha}`,
        target: { identity, path: checkoutRoot },
      });
      return { botId, result: request.ok ? enqueueRequest(stateRoot, request.value) : request };
    }),
  };
}

// ───────────────────────────────────────────────────────────────────
// 4. CLAIM, FINISH, RETRY & QUARANTINE
// ───────────────────────────────────────────────────────────────────

function listFolder(folder: string): string[] {
  try {
    return readdirSync(folder).sort();
  } catch (error: unknown) {
    if (errorCode(error) === 'ENOENT') return [];
    throw error;
  }
}

/** Every entry in the watched folder, sorted. Any entry counts, because any entry keeps a queue agent alive. */
export function listInbox(folders: QueueFolders): string[] {
  return listFolder(folders.inbox);
}

/** Every entry in the claimed folder: requests a drain took and has not finished. */
export function listClaimed(folders: QueueFolders): string[] {
  return listFolder(folders.claimed);
}

/**
 * Claim one entry by renaming it out of the watched folder before anything reads it.
 *
 * @returns The claimed path, or `claim-lost` when another consumer renamed it first.
 */
export function claimRequest(folders: QueueFolders, name: string): Result<string> {
  return move(join(folders.inbox, name), join(folders.claimed, name), 'claim-lost');
}

/** Read and validate a claimed entry. Nothing here dispatches it. */
export function readClaimed(folders: QueueFolders, name: string): Result<QueuedRequest> {
  let text: string;
  try {
    text = readFileSync(join(folders.claimed, name), 'utf8');
  } catch (error: unknown) {
    return { ok: false, reason: 'request-unreadable', detail: errorCode(error) };
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, reason: 'request-invalid', detail: 'not valid JSON' };
  }
  const valid = validateRequest(parsed);
  if (!valid.ok) return valid;
  if (name !== `${valid.value.id}.json`) return { ok: false, reason: 'request-name-mismatch' };
  return valid;
}

/** Move a claimed request that ran to `done/`. */
export function finishRequest(folders: QueueFolders, name: string): Result<string> {
  return move(join(folders.claimed, name), join(folders.done, name), 'request-vanished');
}

/** Put a claimed request back unchanged, for a pass that stops before running it. */
export function releaseClaim(folders: QueueFolders, name: string): Result<string> {
  return move(join(folders.claimed, name), join(folders.inbox, name), 'request-vanished');
}

/**
 * Return a failed request to the watched folder with one more attempt
 * counted. The new version replaces the claimed file through `tmp/`, then one
 * rename puts it back, so it is never in two folders at once.
 */
export function retryRequest(folders: QueueFolders, name: string, request: QueuedRequest): Result<string> {
  const claimed = join(folders.claimed, name);
  try {
    writeThroughTmp(folders, claimed, { ...request, attempts: request.attempts + 1 } satisfies QueuedRequest);
  } catch (error: unknown) {
    return { ok: false, reason: 'queue-move-failed', detail: errorCode(error) };
  }
  return move(claimed, join(folders.inbox, name), 'request-vanished');
}

/** The reason file of a quarantined entry. */
export function reasonFile(folders: QueueFolders, name: string): string {
  return join(folders.quarantine, `${name}${REASON_SUFFIX}`);
}

/**
 * Move a claimed entry to `quarantine/`, its reason file first. The reason
 * names a cause and a refusal detail, never a secret value.
 */
export function quarantineRequest(
  folders: QueueFolders,
  name: string,
  requestId: string | null,
  reason: string,
  detail: string | null,
  now: Date = new Date(),
): Result<string> {
  const record: QuarantineReason = { name, requestId, reason, detail, quarantinedAt: now.toISOString() };
  try {
    writeThroughTmp(folders, reasonFile(folders, name), record);
  } catch (error: unknown) {
    return { ok: false, reason: 'queue-move-failed', detail: errorCode(error) };
  }
  return move(join(folders.claimed, name), join(folders.quarantine, name), 'request-vanished');
}

/** Whether one more failure of a request has reached the retry bound. */
export function atRetryBound(request: Pick<QueuedRequest, 'attempts'>): boolean {
  return request.attempts + 1 >= RETRY_BOUND;
}

/** Read every reason file in quarantine, for a status reader or a test. */
export function readQuarantineReasons(folders: QueueFolders): QuarantineReason[] {
  return listFolder(folders.quarantine)
    .filter((name) => name.endsWith(REASON_SUFFIX))
    .map((name) => JSON.parse(readFileSync(join(folders.quarantine, name), 'utf8')) as QuarantineReason);
}

/** The queue folders of one identity, without creating them. */
export function queuePaths(stateRoot: string, identity: string): QueueFolders {
  return identityStatePaths(stateRoot, identity).requests;
}

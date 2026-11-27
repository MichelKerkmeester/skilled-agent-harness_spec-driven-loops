// ───────────────────────────────────────────────────────────────────
// MODULE: State Layout (user-level state root and in-tree run root)
// ───────────────────────────────────────────────────────────────────
//
// Bots keep state in exactly two places. Everything a run must not be able
// to write (requests, leases, switches, needs-you items, run records,
// install records, the index and the registered roots) lives under a
// user-level state root outside every checkout: a switch the run can write
// is no switch. Dispatch receipts live there too, one folder per run,
// because a receipt records the command line, and for a kind that takes its
// prompt on argv that is the whole prompt. Only run evidence a child may
// read without harm (ledgers, logs, transcripts) lives in the Skilled tree,
// under its gitignored .state folder, so it sits next to the code that
// produced it without ever reaching git status.
// Every caller takes its paths from here, so no caller joins a state path
// by hand.

import { randomBytes } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { chmodSync, existsSync, mkdirSync, readFileSync, realpathSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, isAbsolute, join, resolve } from 'node:path';

import { writeStateAtomic } from '../../../system-deep-loop/runtime/lib/deep-loop/atomic-state.js';
import { identityKey } from './identity.js';

import type { RepoConfig, Result } from './repo-config.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPES & CONSTANTS
// ───────────────────────────────────────────────────────────────────

/** The folder name used under both roots. */
export const TOOL_FOLDER = 'system-skilled-bots';

/** Where run folders live, relative to the Skilled tree. */
export const RUN_ROOT_RELATIVE = join('.skilled', 'skills', '.state', TOOL_FOLDER);

/**
 * The state root an installed job carries in its own environment. It outranks
 * the checkout's `bots/config.json`, which a run with checkout write access
 * could edit to point every switch, hold and lease lookup somewhere empty.
 */
export const PINNED_STATE_ROOT_ENV = 'SKILLED_BOTS_STATE_ROOT';

/** Owner-only, the same rule the env-secret guard applies to its state. */
export const STATE_DIR_MODE = 0o700;

/** Owner-only, the mode every channel and roster file is written with. */
export const STATE_FILE_MODE = 0o600;

const GIT_TIMEOUT_MS = 10_000;

/** Request queue folders; only inbox/ is watched. */
export const REQUEST_FOLDERS = ['inbox', 'tmp', 'claimed', 'done', 'quarantine', 'seen'] as const;

export type RequestFolder = (typeof REQUEST_FOLDERS)[number];

/** The user-level folders of one repository identity. */
export interface IdentityStatePaths {
  base: string;
  requests: { root: string } & Record<RequestFolder, string>;
  leases: string;
  switches: string;
  needsYou: string;
  records: string;
  installs: string;
  /** Dispatch receipts, one folder per run. */
  receipts: string;
  /** Per-bot routine state files, made by their writer on first write. */
  routines: string;
  /** Per-bot memory files, made owner-only by the first append and never by a read. */
  memory: string;
}

/** Entries shared across identities, beside the identity folders. */
export interface SharedStatePaths {
  index: string;
  registeredRoots: string;
  /** The durable authority record the append gateway admits bot result events by. */
  authority: string;
}

/** The registered-roots file: every checkout path seen for each identity, and the identities retired from status. */
interface RegisteredRootsFile {
  roots: Record<string, string[]>;
  retired?: Record<string, RetiredIdentity>;
}

/** An identity `bots status --unregister` retired. Its rows are hidden; nothing of it is deleted. */
export interface RetiredIdentity {
  identity: string;
  retiredAt: string;
}

const SAFE_SEGMENT = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;

// ───────────────────────────────────────────────────────────────────
// 2. USER-LEVEL STATE ROOT
// ───────────────────────────────────────────────────────────────────

/**
 * Resolve the user-level state root.
 *
 * @param config - The repository config; its `stateRoot` replaces the default.
 * @param env - The environment read for the pinned root, XDG_STATE_HOME and HOME.
 * @returns The root an installed job pinned, else the config's override, else
 *   `${XDG_STATE_HOME:-$HOME/.local/state}/system-skilled-bots`.
 */
export function userStateRoot(config: Pick<RepoConfig, 'stateRoot'>, env: NodeJS.ProcessEnv = process.env): string {
  const pinned = env[PINNED_STATE_ROOT_ENV]?.trim();
  if (pinned && isAbsolute(pinned)) return resolve(pinned);
  if (config.stateRoot !== null) return resolve(config.stateRoot);
  const xdg = env.XDG_STATE_HOME?.trim();
  const base = xdg ? xdg : join(env.HOME?.trim() || homedir(), '.local', 'state');
  return resolve(base, TOOL_FOLDER);
}

/**
 * Name every user-level folder of one identity. Creates nothing.
 *
 * @param stateRoot - The resolved user-level state root.
 * @param identity - An `owner/name` identity.
 */
export function identityStatePaths(stateRoot: string, identity: string): IdentityStatePaths {
  const base = join(stateRoot, identityKey(identity));
  const requestsRoot = join(base, 'requests');
  const requests = { root: requestsRoot } as IdentityStatePaths['requests'];
  for (const folder of REQUEST_FOLDERS) requests[folder] = join(requestsRoot, folder);
  return {
    base,
    requests,
    leases: join(base, 'leases'),
    switches: join(base, 'switches'),
    needsYou: join(base, 'needs-you'),
    records: join(base, 'records'),
    installs: join(base, 'installs'),
    receipts: join(base, 'receipts'),
    routines: join(base, 'routines'),
    memory: join(base, 'memory'),
  };
}

/** Name the entries shared by every identity. Creates nothing. */
export function sharedStatePaths(stateRoot: string): SharedStatePaths {
  return {
    index: join(stateRoot, 'index'),
    registeredRoots: join(stateRoot, 'registered-roots'),
    authority: join(stateRoot, 'authority'),
  };
}

/** The memory file every bot of every identity reads, beside the identity folders. Creates nothing. */
export function sharedMemoryFile(stateRoot: string): string {
  return join(stateRoot, 'memory', 'shared.md');
}

/**
 * Create every user-level folder of one identity, owner-only.
 *
 * @returns The same paths identityStatePaths names.
 */
export function ensureIdentityState(stateRoot: string, identity: string): IdentityStatePaths {
  const paths = identityStatePaths(stateRoot, identity);
  mkdirSync(stateRoot, { recursive: true, mode: STATE_DIR_MODE });
  mkdirSync(sharedStatePaths(stateRoot).index, { recursive: true, mode: STATE_DIR_MODE });
  const folders = [
    ...REQUEST_FOLDERS.map((folder) => paths.requests[folder]),
    paths.leases,
    paths.switches,
    paths.needsYou,
    paths.records,
    paths.installs,
    paths.receipts,
  ];
  for (const folder of folders) mkdirSync(folder, { recursive: true, mode: STATE_DIR_MODE });
  return paths;
}

/**
 * Create a memory folder owner-only, with the state root above it. A memory file is made by
 * its first append, never by a read, so only the writer calls this.
 */
export function ensureMemoryFolder(folder: string): void {
  mkdirSync(folder, { recursive: true, mode: STATE_DIR_MODE });
}

/**
 * The folder that holds one identity's channel config, links, approval index,
 * send queue and seen records. Creates nothing.
 *
 * @param stateRoot - The resolved user-level state root.
 * @param identity - An `owner/name` identity.
 */
export function channelFolder(stateRoot: string, identity: string): string {
  return join(identityStatePaths(stateRoot, identity).base, 'channels');
}

/**
 * The roster of who may answer from a chat. It sits beside the identity
 * folders and outside the channel folder, because the roster gates every
 * answer surface. Creates nothing.
 *
 * @param stateRoot - The resolved user-level state root.
 * @param identity - An `owner/name` identity.
 */
export function operatorsFile(stateRoot: string, identity: string): string {
  return join(identityStatePaths(stateRoot, identity).base, 'operators.json');
}

/**
 * Create the channel folder with its queue and seen folders owner-only.
 *
 * @param stateRoot - The resolved user-level state root.
 * @param identity - An `owner/name` identity.
 * @returns The channel folder path.
 */
export function ensureChannelState(stateRoot: string, identity: string): string {
  const channels = channelFolder(stateRoot, identity);
  mkdirSync(stateRoot, { recursive: true, mode: STATE_DIR_MODE });
  mkdirSync(channels, { recursive: true, mode: STATE_DIR_MODE });
  mkdirSync(join(channels, 'queue'), { recursive: true, mode: STATE_DIR_MODE });
  mkdirSync(join(channels, 'seen'), { recursive: true, mode: STATE_DIR_MODE });
  return channels;
}

/**
 * Write one JSON state file by temp file and rename, owner-only. The mode is
 * set on the temp file before the rename, so the file is never visible with a
 * wider mode, and it is set on every write because a file that already exists
 * keeps its old mode across a plain write.
 *
 * @param path - The state file to write.
 * @param data - The value serialized as JSON.
 */
export function writeStateFile(path: string, data: unknown): void {
  mkdirSync(dirname(path), { recursive: true, mode: STATE_DIR_MODE });
  const temp = `${path}.${process.pid}.${randomBytes(6).toString('hex')}.tmp`;
  try {
    writeFileSync(temp, `${JSON.stringify(data, null, 2)}\n`, { mode: STATE_FILE_MODE });
    chmodSync(temp, STATE_FILE_MODE);
    renameSync(temp, path);
  } catch (error) {
    rmSync(temp, { force: true });
    throw error;
  }
}

/** Reject an id that could escape its folder or hide as a dot file. */
export function isSafeSegment(value: string): boolean {
  return SAFE_SEGMENT.test(value) && !value.includes('..');
}

function segmentOrThrow(kind: string, value: string): string {
  if (!isSafeSegment(value)) throw new Error(`${kind}-invalid`);
  return value;
}

/** The record file of one run. Throws `run-id-invalid` on an unsafe id. */
export function recordFile(stateRoot: string, identity: string, runId: string): string {
  return join(identityStatePaths(stateRoot, identity).records, `${segmentOrThrow('run-id', runId)}.json`);
}

/** The needs-you item file. Throws `item-id-invalid` on an unsafe id. */
export function needsYouFile(stateRoot: string, identity: string, itemId: string): string {
  return join(identityStatePaths(stateRoot, identity).needsYou, `${segmentOrThrow('item-id', itemId)}.json`);
}

/**
 * The dispatch receipt folder of one run, under the user-level state root and
 * never in the run folder. Creates nothing. Throws `run-id-invalid` on an unsafe id.
 */
export function receiptFolder(stateRoot: string, identity: string, runId: string): string {
  return join(identityStatePaths(stateRoot, identity).receipts, segmentOrThrow('run-id', runId));
}

/**
 * The folder of delivery claim files of one identity. A send is claimed by
 * creating its file exclusively, so two passes over one run can never both
 * send. Kept apart from the identity folders ensureIdentityState makes, so
 * only an identity that has delivered anything grows one. Creates nothing.
 */
export function deliveryClaimFolder(stateRoot: string, identity: string): string {
  return join(identityStatePaths(stateRoot, identity).base, 'deliveries');
}

/**
 * The hashes of the definition and the repository config an operator last
 * approved for one bot's unattended runs. Throws `bot-id-invalid` on an unsafe id.
 */
export function approvalFile(stateRoot: string, identity: string, botId: string): string {
  return join(identityStatePaths(stateRoot, identity).base, 'approvals', `${segmentOrThrow('bot-id', botId)}.json`);
}

/** The install record of one bot. Throws `bot-id-invalid` on an unsafe id. */
export function installFile(stateRoot: string, identity: string, botId: string): string {
  return join(identityStatePaths(stateRoot, identity).installs, `${segmentOrThrow('bot-id', botId)}.json`);
}

/**
 * The last-fire snapshot of one schedule of one bot. A fire writes it before
 * dispatch and the next fire reads it, so slot accounting never scans the
 * record folder. Creates nothing. Throws `bot-id-invalid` on an unsafe id.
 */
export function slotSnapshotFile(stateRoot: string, identity: string, botId: string, scheduleIndex: number): string {
  if (!Number.isSafeInteger(scheduleIndex) || scheduleIndex < 0) throw new Error('schedule-index-invalid');
  return join(identityStatePaths(stateRoot, identity).base, 'slots', `${segmentOrThrow('bot-id', botId)}.${scheduleIndex}.json`);
}

/**
 * The back-off file of the scheduled queue drain. It sits beside the request
 * folders, never inside the watched one, so writing it never wakes the drain.
 * Creates nothing.
 */
export function drainBackoffFile(stateRoot: string, identity: string): string {
  return join(identityStatePaths(stateRoot, identity).base, 'drain-backoff.json');
}

/**
 * Where the scheduler writes a job's own stdout and stderr, so a job that dies
 * before the runner writes a record still leaves a trace. Creates nothing.
 * Throws `label-invalid` on an unsafe label.
 */
export function agentLogFile(stateRoot: string, identity: string, label: string): string {
  return join(identityStatePaths(stateRoot, identity).base, 'agent-logs', `${segmentOrThrow('label', label)}.log`);
}

/**
 * The status index file, inside the shared index folder. The folder is made
 * with every identity's state; the file is derived and may be deleted and
 * rebuilt at any time. Creates nothing.
 */
export function statusIndexFile(stateRoot: string): string {
  return join(sharedStatePaths(stateRoot).index, 'status.sqlite');
}

/** The generation stamp a status reader compares to know its index is stale. */
export function generationStampFile(stateRoot: string, identity: string): string {
  return join(identityStatePaths(stateRoot, identity).base, 'generation.json');
}

/**
 * Advance the generation stamp by temp file and rename. Every writer that
 * changes a record or an item calls this, so a status index keyed on the
 * stamp never misses a change. It lives here, beside the paths, so the
 * runner and the modules the runner imports share one function.
 *
 * @returns The new generation number.
 */
export function writeGenerationStamp(stateRoot: string, identity: string, now: Date = new Date()): number {
  ensureIdentityState(stateRoot, identity);
  const path = generationStampFile(stateRoot, identity);
  let previous = 0;
  try {
    const parsed = JSON.parse(readFileSync(path, 'utf8')) as { generation?: unknown };
    if (typeof parsed.generation === 'number' && Number.isSafeInteger(parsed.generation)) previous = parsed.generation;
  } catch {
    previous = 0;
  }
  const generation = previous + 1;
  writeStateAtomic(path, { generation, writtenAt: now.toISOString() });
  return generation;
}

// ───────────────────────────────────────────────────────────────────
// 3. REGISTERED ROOTS
// ───────────────────────────────────────────────────────────────────

/**
 * Read the registered-roots file, keyed by identity key. A missing file is an empty map; any other
 * read or parse failure throws, so a damaged file is never read as empty.
 */
export function readRegisteredRoots(stateRoot: string): Record<string, string[]> {
  return readRootsFile(stateRoot).roots;
}

function readRootsFile(stateRoot: string): Required<RegisteredRootsFile> {
  const path = sharedStatePaths(stateRoot).registeredRoots;
  if (!existsSync(path)) return { roots: {}, retired: {} };
  const parsed = JSON.parse(readFileSync(path, 'utf8')) as RegisteredRootsFile;
  return { roots: parsed.roots ?? {}, retired: parsed.retired ?? {} };
}

/**
 * The retired identities, keyed by identity key. They live in the
 * registered-roots file, beside the roots they retire, so a deleted and
 * rebuilt status index still hides them. Throws on a damaged file, like
 * readRegisteredRoots.
 */
export function readRetiredIdentities(stateRoot: string): Record<string, RetiredIdentity> {
  return readRootsFile(stateRoot).retired;
}

/**
 * Retire an identity from status by temp file and rename of the
 * registered-roots file. Nothing else is written or deleted. Retiring an
 * identity already retired keeps its first time, so the file is unchanged.
 *
 * @returns Whether the registered-roots file existed before this call.
 */
export function retireIdentityRoots(stateRoot: string, identity: string, now: Date = new Date()): { fileExisted: boolean } {
  const path = sharedStatePaths(stateRoot).registeredRoots;
  const fileExisted = existsSync(path);
  const file = readRootsFile(stateRoot);
  const key = identityKey(identity);
  if (file.retired[key] === undefined) {
    mkdirSync(stateRoot, { recursive: true, mode: STATE_DIR_MODE });
    file.retired[key] = { identity, retiredAt: now.toISOString() };
    writeStateAtomic(path, file satisfies RegisteredRootsFile);
  }
  return { fileExisted };
}

/**
 * Record a checkout path under its identity. Two clones of one repository
 * share one identity folder on purpose, and this list is where both show.
 *
 * @returns Every checkout path registered for the identity.
 */
export function registerRoot(stateRoot: string, identity: string, checkoutRoot: string): string[] {
  mkdirSync(stateRoot, { recursive: true, mode: STATE_DIR_MODE });
  const file = readRootsFile(stateRoot);
  const roots = file.roots;
  const real = realpathSync(checkoutRoot);
  const key = identityKey(identity);
  const list = roots[key] ?? [];
  if (!list.includes(real)) {
    roots[key] = [...list, real];
    // The retired list shares the file, so it is written back unchanged.
    const next: RegisteredRootsFile = Object.keys(file.retired).length > 0 ? { roots, retired: file.retired } : { roots };
    writeStateAtomic(sharedStatePaths(stateRoot).registeredRoots, next);
  }
  return roots[key] ?? list;
}

// ───────────────────────────────────────────────────────────────────
// 4. IN-TREE RUN ROOT
// ───────────────────────────────────────────────────────────────────

/**
 * The run root inside a Skilled tree. The state-root override never moves it.
 *
 * @param skilledTree - The folder that holds `.skilled`, as the registered checkout resolves it.
 */
export function runRoot(skilledTree: string): string {
  return join(resolve(skilledTree), RUN_ROOT_RELATIVE);
}

/** The run folder path of one run. Creates nothing and checks nothing. */
export function runFolderPath(skilledTree: string, identity: string, runId: string): string {
  return join(runRoot(skilledTree), identityKey(identity), 'runs', segmentOrThrow('run-id', runId));
}

function git(cwd: string, args: string[]): { status: number | null; stdout: string } {
  const run = spawnSync('git', ['-C', cwd, '-c', 'core.fsmonitor=false', ...args], {
    encoding: 'utf8',
    timeout: GIT_TIMEOUT_MS,
  });
  return { status: run.status, stdout: typeof run.stdout === 'string' ? run.stdout : '' };
}

function isLinkedWorktree(tree: string): boolean {
  const run = git(tree, ['rev-parse', '--absolute-git-dir', '--git-common-dir']);
  if (run.status !== 0) return false;
  const [gitDir, commonDir] = run.stdout.trim().split('\n');
  if (!gitDir || !commonDir) return false;
  return realpathSync(gitDir) !== realpathSync(resolve(tree, commonDir));
}

/**
 * Follow a symlinked `.skilled` to the checkout that really holds it. Git
 * will not answer for a path below a symlink, and the run folders of every
 * consumer that links one Skilled checkout belong in that checkout.
 */
function realSkilledTree(skilledTree: string): string {
  const marker = join(skilledTree, '.skilled');
  return existsSync(marker) ? dirname(realpathSync(marker)) : realpathSync(skilledTree);
}

export interface RunFolderInput {
  /** The Skilled tree of the registered checkout, never the run's worktree. */
  skilledTree: string;
  identity: string;
  runId: string;
}

/**
 * Resolve and create the run folder of one run, owner-only.
 *
 * It refuses with `skilled-tree-is-worktree` when handed a linked worktree,
 * because worktree cleanup would delete the evidence. It asks git whether
 * the path is ignored and refuses with `run-folder-not-ignored` when it is
 * not, so a vendored tree that lacks the ignore line never puts run files
 * in its git status.
 *
 * @returns The absolute run folder path, or a refusal with a named reason.
 */
export function resolveRunFolder(input: RunFolderInput): Result<string> {
  const checked = checkRunFolder(input);
  if (!checked.ok) return checked;
  mkdirSync(checked.value, { recursive: true, mode: STATE_DIR_MODE });
  return checked;
}

/**
 * Apply every rule resolveRunFolder applies and write nothing. An installer
 * asks this before it schedules a bot, because a scheduled run whose run
 * folder would be refused fails unattended, and the installer may not write
 * inside a Skilled tree.
 *
 * @returns The run folder path a run would get, or the same refusal resolveRunFolder gives.
 */
export function checkRunFolder(input: RunFolderInput): Result<string> {
  if (!isSafeSegment(input.runId)) return { ok: false, reason: 'run-id-invalid' };
  if (!existsSync(input.skilledTree)) return { ok: false, reason: 'skilled-tree-missing' };
  const tree = realSkilledTree(input.skilledTree);
  if (isLinkedWorktree(tree)) return { ok: false, reason: 'skilled-tree-is-worktree' };

  const folder = runFolderPath(tree, input.identity, input.runId);
  const relative = folder.slice(tree.length + 1);
  const ignored = git(tree, ['check-ignore', '-q', '--', relative]);
  if (ignored.status !== 0) {
    return {
      ok: false,
      reason: 'run-folder-not-ignored',
      detail: ignored.status === 1 ? 'git does not ignore the path' : 'git could not answer for the path',
    };
  }
  return { ok: true, value: folder };
}

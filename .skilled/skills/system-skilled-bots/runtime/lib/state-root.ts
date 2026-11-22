// ───────────────────────────────────────────────────────────────────
// MODULE: State Layout (user-level state root and in-tree run root)
// ───────────────────────────────────────────────────────────────────
//
// Bots keep state in exactly two places. Everything a run must not be able
// to write (requests, leases, switches, needs-you items, run records,
// install records, the index and the registered roots) lives under a
// user-level state root outside every checkout: a switch the run can write
// is no switch. Only run evidence (ledgers, receipts, logs, transcripts)
// lives in the Skilled tree, under its gitignored .state folder, so it sits
// next to the code that produced it without ever reaching git status.
// Every caller takes its paths from here, so no caller joins a state path
// by hand.

import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, realpathSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';

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

/** Owner-only, the same rule the env-secret guard applies to its state. */
export const STATE_DIR_MODE = 0o700;

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
}

/** Entries shared across identities, beside the identity folders. */
export interface SharedStatePaths {
  index: string;
  registeredRoots: string;
}

/** The registered-roots file: every checkout path seen for each identity. */
interface RegisteredRootsFile {
  roots: Record<string, string[]>;
}

const SAFE_SEGMENT = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;

// ───────────────────────────────────────────────────────────────────
// 2. USER-LEVEL STATE ROOT
// ───────────────────────────────────────────────────────────────────

/**
 * Resolve the user-level state root.
 *
 * @param config - The repository config; its `stateRoot` replaces the default.
 * @param env - The environment read for XDG_STATE_HOME and HOME.
 * @returns `${XDG_STATE_HOME:-$HOME/.local/state}/system-skilled-bots`, or the override.
 */
export function userStateRoot(config: Pick<RepoConfig, 'stateRoot'>, env: NodeJS.ProcessEnv = process.env): string {
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
  };
}

/** Name the entries shared by every identity. Creates nothing. */
export function sharedStatePaths(stateRoot: string): SharedStatePaths {
  return {
    index: join(stateRoot, 'index'),
    registeredRoots: join(stateRoot, 'registered-roots'),
  };
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
  ];
  for (const folder of folders) mkdirSync(folder, { recursive: true, mode: STATE_DIR_MODE });
  return paths;
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

/** The install record of one bot. Throws `bot-id-invalid` on an unsafe id. */
export function installFile(stateRoot: string, identity: string, botId: string): string {
  return join(identityStatePaths(stateRoot, identity).installs, `${segmentOrThrow('bot-id', botId)}.json`);
}

// ───────────────────────────────────────────────────────────────────
// 3. REGISTERED ROOTS
// ───────────────────────────────────────────────────────────────────

/**
 * Read the registered-roots file, keyed by identity key. A missing file is an empty map; any other
 * read or parse failure throws, so a damaged file is never read as empty.
 */
export function readRegisteredRoots(stateRoot: string): Record<string, string[]> {
  const path = sharedStatePaths(stateRoot).registeredRoots;
  if (!existsSync(path)) return {};
  const parsed = JSON.parse(readFileSync(path, 'utf8')) as RegisteredRootsFile;
  return parsed.roots ?? {};
}

/**
 * Record a checkout path under its identity. Two clones of one repository
 * share one identity folder on purpose, and this list is where both show.
 *
 * @returns Every checkout path registered for the identity.
 */
export function registerRoot(stateRoot: string, identity: string, checkoutRoot: string): string[] {
  mkdirSync(stateRoot, { recursive: true, mode: STATE_DIR_MODE });
  const roots = readRegisteredRoots(stateRoot);
  const real = realpathSync(checkoutRoot);
  const key = identityKey(identity);
  const list = roots[key] ?? [];
  if (!list.includes(real)) {
    roots[key] = [...list, real];
    writeStateAtomic(sharedStatePaths(stateRoot).registeredRoots, { roots } satisfies RegisteredRootsFile);
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

  mkdirSync(folder, { recursive: true, mode: STATE_DIR_MODE });
  return { ok: true, value: folder };
}

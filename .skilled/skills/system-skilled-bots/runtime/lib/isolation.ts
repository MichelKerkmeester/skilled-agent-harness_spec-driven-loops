// ───────────────────────────────────────────────────────────────────
// MODULE: Worktree Isolation
// ───────────────────────────────────────────────────────────────────
//
// A bot that declares `isolation: worktree` edits in a tree of its own, so
// an unattended run never writes into the operator's working tree. The tree
// comes from sk-git's numbering script, which allocates the number under a
// lock and creates the branch, because a bot must never create a branch
// with git primitives and two concurrent runs must never share a number.
// The tree is placed under the configured worktree base, the one the reaper
// also reads, outside the checkout and outside the Skilled tree, and
// gets the launcher's shared paths as links instead of a full install, so
// setup needs no network.
//
// Links are the one hazard: a removal that walks into a link reaches the
// main checkout's dependencies. So every link made is recorded, and a tree
// is removed only after each recorded link is unlinked as a link, never
// followed. A tree is removed only when it is clean, gitignored files
// included, still at its base commit and has no stash; anything else is
// kept and reported, because losing a bot's work is worse than a tree left
// on disk. Removal is never forced: git's own refusal is a reason to keep
// the tree.

import { spawnSync } from 'node:child_process';
import {
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  readlinkSync,
  realpathSync,
  rmdirSync,
  symlinkSync,
  unlinkSync,
} from 'node:fs';
import { homedir } from 'node:os';
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';

import type { RepoConfig, Result } from './repo-config.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPES & CONSTANTS
// ───────────────────────────────────────────────────────────────────

/** sk-git's numbering script: the only code that may allocate a number and create a bot's branch. */
export const NAMING_SCRIPT = resolve(import.meta.dirname, '..', '..', '..', 'sk-git', 'scripts', 'worktree-naming.sh');

/** The session launcher, whose default shared-path list a bot tree links. Read as text, never run. */
export const LAUNCHER_SCRIPT = resolve(import.meta.dirname, '..', '..', '..', '..', 'bin', 'worktree-session.sh');

/** The checker invariant a definition fails when its worktree cannot be provisioned. */
export const WORKTREE_SHARED_PATHS_INVARIANT = 'worktree-shared-paths-unresolved';

/** The environment variable the launcher reads to replace its shared-path list. */
export const SHARED_PATHS_ENV = 'SPECKIT_WORKTREE_SHARED_PATHS';

/** The environment variable the numbering script reads for the worktree base. */
export const WORKTREE_BASE_ENV = 'SPECKIT_WORKTREE_BASE';

const GIT_TIMEOUT_MS = 30_000;
const CREATE_TIMEOUT_MS = 120_000;

/** The exit the numbering script returns when the tree exists but provisioning failed. */
const HALF_PROVISIONED_EXIT = 3;

/** Variables that would point a git child at another repository than the checkout. */
const GIT_REDIRECT_KEYS = ['GIT_DIR', 'GIT_WORK_TREE', 'GIT_INDEX_FILE', 'GIT_COMMON_DIR', 'GIT_OBJECT_DIRECTORY', 'GIT_NAMESPACE'];

export type SharedPathSource = 'config' | 'env' | 'launcher';

export interface SharedPaths {
  paths: string[];
  source: SharedPathSource;
}

export interface WorktreeBase {
  base: string;
  source: 'env' | 'git-config';
}

/** A shared path that was not linked, and why. */
export interface SkippedPath {
  path: string;
  why: 'absent' | 'outside-checkout' | 'destination-exists' | 'outside-worktree' | 'absolute-workspace-link';
}

/** A bot worktree as made: enough to dispatch into it and to undo it safely. */
export interface BotWorktree {
  path: string;
  branch: string;
  /** Where the base came from; a base from the environment is reapable only from a shell that sets it too. */
  baseSource: WorktreeBase['source'] | null;
  baseCommit: string;
  links: string[];
  createdDirs: string[];
  skipped: SkippedPath[];
  setupMs: number;
}

export type CreateWorktreeResult =
  | { ok: true; value: BotWorktree }
  | { ok: false; reason: string; detail?: string; kept: BotWorktree | null };

export interface CreateWorktreeInput {
  checkoutRoot: string;
  skilledTree: string;
  botId: string;
  config: Pick<RepoConfig, 'worktreeSharedPaths'>;
  env: NodeJS.ProcessEnv;
  /** Replaces sk-git's numbering script; only tests point it at a stub. */
  namingScript?: string;
  /** Replaces the launcher the default shared-path list is read from. */
  launcherScript?: string;
}

/** The part of a tree that inspection and removal need. */
export type TreeHandle = Pick<BotWorktree, 'path' | 'branch' | 'baseCommit' | 'links' | 'createdDirs'>;

export interface WorktreeVerdict {
  /** Null for a clean tree at its base commit with no stash. */
  keptReason: string | null;
  detail: string | null;
}

export interface FinishResult {
  disposition: 'removed' | 'kept';
  keptReason: string | null;
  detail: string | null;
}

// ───────────────────────────────────────────────────────────────────
// 2. PATH HELPERS
// ───────────────────────────────────────────────────────────────────

function isWithin(child: string, parent: string): boolean {
  const rel = relative(parent, child);
  return rel === '' || (!rel.startsWith('..') && !isAbsolute(rel));
}

function isStrictlyInside(child: string, parent: string): boolean {
  return child !== parent && isWithin(child, parent);
}

/** Canonical form of a path that may not exist yet: the nearest existing ancestor, resolved, plus the rest. */
function canonicalPath(path: string): string {
  const absolute = resolve(path);
  let existing = absolute;
  const rest: string[] = [];
  while (!existsSync(existing)) {
    const parent = dirname(existing);
    if (parent === existing) break;
    rest.unshift(basename(existing));
    existing = parent;
  }
  let real = existing;
  try {
    real = realpathSync(existing);
  } catch {
    real = existing;
  }
  return join(real, ...rest);
}

function gitEnv(env: NodeJS.ProcessEnv): NodeJS.ProcessEnv {
  const out: NodeJS.ProcessEnv = { ...env };
  for (const key of GIT_REDIRECT_KEYS) delete out[key];
  return out;
}

function git(cwd: string, args: string[], env: NodeJS.ProcessEnv): { status: number | null; stdout: string; stderr: string } {
  const run = spawnSync('git', ['-C', cwd, '-c', 'core.fsmonitor=false', ...args], {
    encoding: 'utf8',
    env: gitEnv(env),
    timeout: GIT_TIMEOUT_MS,
  });
  return {
    status: run.error !== undefined ? null : run.status,
    stdout: typeof run.stdout === 'string' ? run.stdout : '',
    stderr: typeof run.stderr === 'string' ? run.stderr : '',
  };
}

function lastLine(text: string): string {
  const lines = text.trim().split('\n');
  return (lines[lines.length - 1] ?? '').trim();
}

// ───────────────────────────────────────────────────────────────────
// 3. SHARED PATHS
// ───────────────────────────────────────────────────────────────────

/**
 * The folder the launcher calls the checkout's source root: `.skilled` when
 * it holds the spec kit, else `.opencode`. The launcher's list is written
 * under that root, so the same choice must be made here.
 */
export function sourceRootName(checkoutRoot: string): string {
  for (const name of ['.skilled', '.opencode']) {
    if (existsSync(join(checkoutRoot, name, 'skills', 'system-spec-kit', 'SKILL.md'))) return name;
  }
  return '.opencode';
}

/**
 * Read the launcher's default shared-path list from its source text, with
 * `$root` replaced by the checkout's source root. The launcher is never run:
 * it starts a session when executed.
 *
 * @returns The list, or `worktree-shared-paths-unresolved` when the launcher or its list cannot be read.
 */
export function launcherSharedPaths(sourceRoot: string, launcherScript: string = LAUNCHER_SCRIPT): Result<string[]> {
  let text: string;
  try {
    text = readFileSync(launcherScript, 'utf8');
  } catch (error: unknown) {
    const code = (error as NodeJS.ErrnoException | null)?.code;
    return { ok: false, reason: WORKTREE_SHARED_PATHS_INVARIANT, detail: `launcher unreadable (${code ?? 'unknown error'})` };
  }
  const match = /default_shared_paths\(\)\s*\{[\s\S]*?cat <<PATHS\r?\n([\s\S]*?)\r?\nPATHS/.exec(text);
  if (match === null) return { ok: false, reason: WORKTREE_SHARED_PATHS_INVARIANT, detail: 'launcher holds no default_shared_paths list' };
  const paths = (match[1] ?? '')
    .split('\n')
    .map((line) => line.trim().replaceAll('$root', sourceRoot))
    .filter((line) => line !== '');
  return { ok: true, value: paths };
}

function safeRelative(entry: string): string | null {
  const trimmed = entry.trim();
  if (trimmed === '' || isAbsolute(trimmed) || trimmed.includes('$')) return null;
  const segments = trimmed.split(/[\\/]+/).filter((segment) => segment !== '' && segment !== '.');
  if (segments.length === 0 || segments.includes('..')) return null;
  return segments.join('/');
}

/**
 * Resolve the shared-path list a bot worktree links: `worktreeSharedPaths`
 * in `bots/config.json`, else `SPECKIT_WORKTREE_SHARED_PATHS`, else the
 * launcher's default. The checker calls this same function, so a definition
 * that passes the checker cannot fail here.
 *
 * Every entry must be a relative path that stays inside the checkout. The
 * launcher skips an unsafe entry; a bot refuses the whole list, because an
 * unattended run must not quietly start with less than its author declared.
 *
 * @returns The list and where it came from, or `worktree-shared-paths-unresolved`.
 */
export function resolveSharedPaths(input: {
  checkoutRoot: string;
  config: Pick<RepoConfig, 'worktreeSharedPaths'>;
  env: NodeJS.ProcessEnv;
  launcherScript?: string;
}): Result<SharedPaths> {
  let raw: string[];
  let source: SharedPathSource;
  const fromEnv = input.env[SHARED_PATHS_ENV];
  if (input.config.worktreeSharedPaths !== undefined) {
    raw = input.config.worktreeSharedPaths;
    source = 'config';
  } else if (fromEnv !== undefined && fromEnv.trim() !== '') {
    raw = fromEnv.split(/[:\n]/).filter((entry) => entry.trim() !== '');
    source = 'env';
  } else {
    const fromLauncher = launcherSharedPaths(sourceRootName(input.checkoutRoot), input.launcherScript);
    if (!fromLauncher.ok) return fromLauncher;
    raw = fromLauncher.value;
    source = 'launcher';
  }
  const paths: string[] = [];
  for (const entry of raw) {
    const safe = safeRelative(entry);
    if (safe === null) {
      return { ok: false, reason: WORKTREE_SHARED_PATHS_INVARIANT, detail: `${source} entry "${entry}" is not a relative path inside the checkout` };
    }
    if (!paths.includes(safe)) paths.push(safe);
  }
  return { ok: true, value: { paths, source } };
}

// ───────────────────────────────────────────────────────────────────
// 4. BASE
// ───────────────────────────────────────────────────────────────────

/**
 * Resolve where bot worktrees go, the way the numbering script and the
 * reaper both read it: the run's `SPECKIT_WORKTREE_BASE`, else the
 * repository's `speckit.worktreeBase` git config. `~` expands to HOME and a
 * relative value resolves against the main checkout, the parent of the
 * common git dir. The script's own last resort is a folder inside the
 * checkout, and any other default would put the tree where the reaper's
 * numbered lane cannot judge it, so an unconfigured base is refused.
 *
 * @returns The absolute base and where it came from, or a refusal:
 *   `worktree-base-unconfigured`, `worktree-base-inside-checkout` or
 *   `worktree-base-inside-skilled-tree`.
 */
export function resolveWorktreeBase(input: { checkoutRoot: string; skilledTree: string; env: NodeJS.ProcessEnv }): Result<WorktreeBase> {
  const home = input.env.HOME?.trim() || homedir();
  const checkout = canonicalPath(input.checkoutRoot);
  const common = git(input.checkoutRoot, ['rev-parse', '--path-format=absolute', '--git-common-dir'], input.env);
  const mainToplevel = common.status === 0 ? canonicalPath(dirname(common.stdout.trim())) : checkout;

  let raw = input.env[WORKTREE_BASE_ENV]?.trim() ?? '';
  let source: WorktreeBase['source'] = 'env';
  if (raw === '') {
    const configured = git(input.checkoutRoot, ['config', '--get', 'speckit.worktreeBase'], input.env);
    raw = configured.status === 0 ? configured.stdout.trim() : '';
    source = 'git-config';
  }
  if (raw === '') {
    return {
      ok: false,
      reason: 'worktree-base-unconfigured',
      detail: 'set a base outside the checkout: git config speckit.worktreeBase <dir>',
    };
  }
  if (raw === '~') raw = home;
  else if (raw.startsWith('~/')) raw = join(home, raw.slice(2));
  const base = isAbsolute(raw) ? raw : join(mainToplevel, raw);

  const canonical = canonicalPath(base);
  for (const inside of [checkout, mainToplevel]) {
    if (isWithin(canonical, inside)) {
      return { ok: false, reason: 'worktree-base-inside-checkout', detail: `${source} base ${base} is inside ${inside}` };
    }
  }
  const skilled = canonicalPath(input.skilledTree);
  if (isWithin(canonical, skilled)) {
    return { ok: false, reason: 'worktree-base-inside-skilled-tree', detail: `${source} base ${base} is inside ${input.skilledTree}` };
  }
  return { ok: true, value: { base: canonical, source } };
}

/**
 * The slug a bot's tree is named by: `bot-<id>`, with the hyphen runs the
 * bot id grammar allows but the numbering script rejects collapsed.
 */
export function worktreeSlug(botId: string): string {
  return `bot-${botId}`.replace(/-+/g, '-').replace(/-$/, '');
}

// ───────────────────────────────────────────────────────────────────
// 5. LINKS
// ───────────────────────────────────────────────────────────────────

/** Make a folder and any missing parent inside the tree, recording each one made. */
function mkdirRecorded(dir: string, treeReal: string, createdDirs: string[]): boolean {
  const missing: string[] = [];
  let cursor = dir;
  while (!existsSync(cursor)) {
    missing.unshift(cursor);
    const parent = dirname(cursor);
    if (parent === cursor) return false;
    cursor = parent;
  }
  // The deepest existing folder must be a real folder inside the tree: a link
  // made under a linked ancestor would land in whatever that ancestor names.
  if (lstatSync(cursor).isSymbolicLink() || !isWithin(realpathSync(cursor), treeReal)) return false;
  for (const folder of missing) {
    mkdirSync(folder);
    createdDirs.push(folder);
  }
  return true;
}

/**
 * Workspace packages a dependency root holds as links back into the checkout
 * it was installed from. Shared wholesale, their relative text would resolve
 * into the main checkout, and the bot would read code it never edited.
 */
function workspaceSelfLinks(rootReal: string, checkoutReal: string): string[] {
  const found: string[] = [];
  let scopes: string[];
  try {
    scopes = readdirSync(rootReal);
  } catch {
    return found;
  }
  for (const scope of scopes) {
    const scopePath = join(rootReal, scope);
    let isDir = false;
    try {
      const stat = lstatSync(scopePath);
      isDir = stat.isDirectory() && !stat.isSymbolicLink();
    } catch {
      isDir = false;
    }
    if (!isDir) continue;
    for (const name of readdirSync(scopePath)) {
      const entry = join(scopePath, name);
      if (!lstatSync(entry).isSymbolicLink()) continue;
      let resolved: string;
      try {
        resolved = realpathSync(entry);
      } catch {
        continue;
      }
      if (isStrictlyInside(resolved, checkoutReal) && !isWithin(resolved, rootReal)) found.push(entry);
    }
  }
  return found;
}

function linkRecorded(target: string, link: string, links: string[]): void {
  symlinkSync(target, link);
  links.push(link);
}

/**
 * Link one shared path into the tree the way the launcher does. A root with
 * workspace self-links becomes a real folder: third-party entries are linked
 * one by one and each self-link is recreated from its relative text, which
 * names the tree's own copy because it sits at the same relative path. A
 * root that cannot be split that way is skipped, never linked wholesale.
 */
function linkSharedPath(
  rel: string,
  checkoutRoot: string,
  checkoutReal: string,
  tree: string,
  treeReal: string,
  links: string[],
  createdDirs: string[],
): SkippedPath | null {
  const src = join(checkoutRoot, rel);
  const dst = join(tree, rel);
  if (!existsSync(src)) return { path: rel, why: 'absent' };
  const srcReal = realpathSync(src);
  if (!isStrictlyInside(srcReal, checkoutReal)) return { path: rel, why: 'outside-checkout' };
  if (existsSync(dst) || isSymlink(dst)) return { path: rel, why: 'destination-exists' };

  const selfLinks = workspaceSelfLinks(srcReal, checkoutReal);
  const texts = new Map<string, string>();
  for (const entry of selfLinks) {
    const text = readlinkSync(entry);
    if (isAbsolute(text)) return { path: rel, why: 'absolute-workspace-link' };
    texts.set(relative(srcReal, entry), text);
  }
  if (!mkdirRecorded(dirname(dst), treeReal, createdDirs)) return { path: rel, why: 'outside-worktree' };

  if (selfLinks.length === 0) {
    linkRecorded(src, dst, links);
    return null;
  }
  const scopes = new Set([...texts.keys()].map((key) => key.split(sep)[0] as string));
  mkdirSync(dst);
  createdDirs.push(dst);
  for (const name of readdirSync(srcReal)) {
    if (!scopes.has(name)) {
      linkRecorded(join(src, name), join(dst, name), links);
      continue;
    }
    mkdirSync(join(dst, name));
    createdDirs.push(join(dst, name));
    for (const nested of readdirSync(join(srcReal, name))) {
      const key = join(name, nested);
      const text = texts.get(key);
      linkRecorded(text ?? join(src, name, nested), join(dst, name, nested), links);
    }
  }
  return null;
}

function isSymlink(path: string): boolean {
  try {
    return lstatSync(path).isSymbolicLink();
  } catch {
    return false;
  }
}

// ───────────────────────────────────────────────────────────────────
// 6. CREATE
// ───────────────────────────────────────────────────────────────────

/**
 * Make a bot's worktree: check the checkout, resolve the shared paths and the
 * base, call the numbering script's `create` with `--no-provision` and the
 * base set for that one child, then link the shared paths.
 *
 * `create` allocates the number under the script's lock; a separate
 * allocate call would burn a number. The base commit is passed explicitly so
 * a session's live-branch setting can never change what a bot starts from.
 *
 * @returns The tree, or a refusal. A refusal after the tree exists carries it
 *   as `kept`, so the run can record a half-provisioned tree instead of losing it.
 */
export function createBotWorktree(input: CreateWorktreeInput): CreateWorktreeResult {
  const started = Date.now();
  const refuse = (reason: string, detail?: string): CreateWorktreeResult =>
    detail === undefined ? { ok: false, reason, kept: null } : { ok: false, reason, detail, kept: null };

  const top = git(input.checkoutRoot, ['rev-parse', '--show-toplevel'], input.env);
  const checkoutReal = canonicalPath(input.checkoutRoot);
  if (top.status !== 0 || canonicalPath(top.stdout.trim()) !== checkoutReal) {
    return refuse('checkout-not-toplevel', input.checkoutRoot);
  }
  const head = git(input.checkoutRoot, ['rev-parse', '--verify', 'HEAD^{commit}'], input.env);
  if (head.status !== 0) return refuse('checkout-has-no-commit', input.checkoutRoot);
  const baseCommit = head.stdout.trim();

  const shared = resolveSharedPaths({
    checkoutRoot: input.checkoutRoot,
    config: input.config,
    env: input.env,
    ...(input.launcherScript !== undefined ? { launcherScript: input.launcherScript } : {}),
  });
  if (!shared.ok) return refuse(shared.reason, shared.detail);
  const base = resolveWorktreeBase(input);
  if (!base.ok) return refuse(base.reason, base.detail);

  const childEnv = gitEnv(input.env);
  delete childEnv.SPECKIT_LIVE_BRANCH;
  childEnv[WORKTREE_BASE_ENV] = base.value.base;
  const run = spawnSync('bash', [input.namingScript ?? NAMING_SCRIPT, 'create', worktreeSlug(input.botId), baseCommit, '--no-provision'], {
    cwd: input.checkoutRoot,
    env: childEnv,
    encoding: 'utf8',
    timeout: CREATE_TIMEOUT_MS,
  });
  const stdout = typeof run.stdout === 'string' ? run.stdout : '';
  const stderr = typeof run.stderr === 'string' ? run.stderr : '';
  const line = lastLine(stdout);
  const space = line.indexOf(' ');
  const branch = space > 0 ? line.slice(0, space) : '';
  const path = space > 0 ? line.slice(space + 1) : '';
  const expected = new RegExp(`^worktrees/\\d{3}-${worktreeSlug(input.botId)}$`);
  const made = expected.test(branch) && path !== '' && existsSync(path);

  const tree: BotWorktree = {
    path,
    branch,
    baseSource: base.value.source,
    baseCommit,
    links: [],
    createdDirs: [],
    skipped: [],
    setupMs: 0,
  };
  const kept = (reason: string, detail: string): CreateWorktreeResult => {
    tree.setupMs = Date.now() - started;
    return { ok: false, reason, detail, kept: made ? tree : null };
  };

  if (run.error !== undefined || run.status !== 0) {
    const why = run.error !== undefined ? run.error.message : `exit ${String(run.status)}`;
    const reason = run.status === HALF_PROVISIONED_EXIT ? 'worktree-half-provisioned' : 'worktree-create-failed';
    return kept(reason, `${why}: ${lastLine(stderr) || 'no output'}`);
  }
  if (!made) return kept('worktree-create-failed', `unexpected create output: ${line || 'none'}`);
  const treeReal = realpathSync(path);
  if (!isWithin(treeReal, base.value.base) || isWithin(treeReal, checkoutReal)) {
    return kept('worktree-half-provisioned', `tree ${path} is not under base ${base.value.base}`);
  }

  try {
    for (const rel of shared.value.paths) {
      const skipped = linkSharedPath(rel, input.checkoutRoot, checkoutReal, path, treeReal, tree.links, tree.createdDirs);
      if (skipped !== null) tree.skipped.push(skipped);
    }
  } catch (error: unknown) {
    return kept('worktree-half-provisioned', `linking failed: ${error instanceof Error ? error.message : String(error)}`);
  }
  tree.setupMs = Date.now() - started;
  return { ok: true, value: tree };
}

/**
 * Take back the tree a parked run kept, for the run that resumes it. The
 * resume must continue the parked work, so it never falls back to a fresh
 * tree: a tree that is gone, or is no longer registered with git on the same
 * branch, refuses the resume.
 *
 * @returns Nothing on success, or `parked-worktree-missing` naming what is off.
 */
export function reopenBotWorktree(checkoutRoot: string, tree: Pick<TreeHandle, 'path' | 'branch'>, env: NodeJS.ProcessEnv): Result<void> {
  const missing = (detail: string): Result<void> => ({ ok: false, reason: 'parked-worktree-missing', detail });
  if (tree.path === '' || !existsSync(tree.path)) return missing(`${tree.path} no longer exists`);
  const listed = git(checkoutRoot, ['worktree', 'list', '--porcelain'], env);
  if (listed.status !== 0) return missing('git worktree list did not answer');
  const want = canonicalPath(tree.path);
  const blocks = listed.stdout.split('\n\n');
  const block = blocks.find((text) => {
    const line = text.split('\n').find((entry) => entry.startsWith('worktree '));
    return line !== undefined && canonicalPath(line.slice('worktree '.length)) === want;
  });
  if (block === undefined) return missing(`${tree.path} is no longer a worktree of ${checkoutRoot}`);
  if (!block.split('\n').includes(`branch refs/heads/${tree.branch}`)) {
    return missing(`${tree.path} is no longer on branch ${tree.branch}`);
  }
  return { ok: true, value: undefined };
}

// ───────────────────────────────────────────────────────────────────
// 7. INSPECT & REMOVE
// ───────────────────────────────────────────────────────────────────

/**
 * Status entries of a tree, minus the links this module made and the folders it made to hold
 * them, split into changes git tracks or would track and files that match an ignore line. The
 * ignored ones count too: `git worktree remove` deletes them with the tree, and a bot's report
 * or build output often lands in an ignored folder.
 */
function unexpectedChanges(tree: TreeHandle, env: NodeJS.ProcessEnv): { changed: string[]; ignored: string[] } | null {
  const status = git(tree.path, ['status', '--porcelain=v1', '-z', '--untracked-files=all', '--ignored=matching'], env);
  if (status.status !== 0) return null;
  const ours = new Set(tree.links.map((link) => relative(tree.path, link)));
  const ourDirs = tree.createdDirs.map((dir) => `${relative(tree.path, dir)}/`);
  const found = { changed: [] as string[], ignored: [] as string[] };
  for (const token of status.stdout.split('\0')) {
    if (token === '') continue;
    // A rename's source path follows its entry as a bare token with no status code.
    const coded = /^.. /.test(token);
    const entry = (coded ? token.slice(3) : token).replace(/\/$/, '');
    if (ours.has(entry) || ourDirs.some((dir) => `${entry}/`.startsWith(dir))) continue;
    (coded && token.startsWith('!! ') ? found.ignored : found.changed).push(entry);
  }
  return found;
}

/**
 * Find an entry the bot put inside a folder this module made to hold links.
 * Git status cannot see it, because those folders are filtered out as ours,
 * and removal would unlink every link before failing on the folder. So a
 * folder holding anything but recorded links and recorded folders keeps the
 * tree as dirty, with its links intact.
 *
 * @returns Null when every made folder holds only what was recorded, else the verdict.
 */
function strayInCreatedDirs(tree: TreeHandle): WorktreeVerdict | null {
  const recorded = new Set([...tree.links, ...tree.createdDirs]);
  for (const dir of tree.createdDirs) {
    let names: string[];
    try {
      names = readdirSync(dir);
    } catch (error: unknown) {
      const code = (error as NodeJS.ErrnoException | null)?.code;
      if (code === 'ENOENT') continue;
      return { keptReason: 'inspect-failed', detail: `${dir} could not be listed (${code ?? 'unknown error'})` };
    }
    const stray = names.map((name) => join(dir, name)).filter((entry) => !recorded.has(entry));
    if (stray.length > 0) return { keptReason: 'dirty', detail: stray.slice(0, 5).map((entry) => relative(tree.path, entry)).join(', ') };
  }
  return null;
}

/**
 * Decide whether a tree may be removed, with the checks the reaper's numbered
 * lane applies: no change in the tree (an ignored file counts, because
 * removal deletes it), no commit beyond its base, no stash
 * made on its branch. The stash list is repository-wide, so it is read from
 * the main checkout. Any check that cannot answer keeps the tree.
 *
 * @returns A null reason for a removable tree, else the first reason to keep it.
 */
export function inspectWorktree(checkoutRoot: string, tree: TreeHandle, env: NodeJS.ProcessEnv): WorktreeVerdict {
  if (!existsSync(tree.path)) return { keptReason: 'tree-missing', detail: tree.path };
  for (const link of tree.links) {
    if (!isSymlink(link)) return { keptReason: 'link-replaced', detail: link };
  }
  const stray = strayInCreatedDirs(tree);
  if (stray !== null) return stray;
  const changes = unexpectedChanges(tree, env);
  if (changes === null) return { keptReason: 'inspect-failed', detail: 'git status did not answer' };
  if (changes.changed.length > 0) return { keptReason: 'dirty', detail: changes.changed.slice(0, 5).join(', ') };
  if (changes.ignored.length > 0) return { keptReason: 'ignored-changes', detail: changes.ignored.slice(0, 5).join(', ') };

  const tip = git(tree.path, ['rev-parse', '--verify', 'HEAD^{commit}'], env);
  if (tip.status !== 0) return { keptReason: 'inspect-failed', detail: 'the tree has no readable HEAD' };
  if (tip.stdout.trim() !== tree.baseCommit) return { keptReason: 'unmerged', detail: `tip ${tip.stdout.trim()} differs from base ${tree.baseCommit}` };

  const stashes = git(checkoutRoot, ['stash', 'list', '--format=%gs'], env);
  if (stashes.status !== 0) return { keptReason: 'inspect-failed', detail: 'git stash list did not answer' };
  const onBranch = stashes.stdout.split('\n').some((line) => line.startsWith(`On ${tree.branch}:`) || line.startsWith(`WIP on ${tree.branch}:`));
  if (onBranch) return { keptReason: 'stashed', detail: `a stash was made on ${tree.branch}` };
  return { keptReason: null, detail: null };
}

/**
 * End a run's tree: keep it when inspection finds a reason, else unlink every
 * recorded link, drop the folders made for them, then remove the tree and its
 * branch with git's plain commands. Links go first because a removal that
 * descends into a link reaches the main checkout's own dependency folders;
 * unlinking removes only the link itself and never what it names.
 *
 * @returns `removed`, or `kept` with the reason; a refused git step is a reason.
 */
export function finishBotWorktree(checkoutRoot: string, tree: TreeHandle, env: NodeJS.ProcessEnv): FinishResult {
  const verdict = inspectWorktree(checkoutRoot, tree, env);
  if (verdict.keptReason !== null) return { disposition: 'kept', keptReason: verdict.keptReason, detail: verdict.detail };

  for (const link of tree.links) {
    if (!isSymlink(link)) return { disposition: 'kept', keptReason: 'link-replaced', detail: link };
    unlinkSync(link);
  }
  for (const dir of [...tree.createdDirs].reverse()) {
    try {
      rmdirSync(dir);
    } catch (error: unknown) {
      const code = (error as NodeJS.ErrnoException | null)?.code;
      if (code === 'ENOENT') continue;
      return { disposition: 'kept', keptReason: 'remove-refused', detail: `${dir} is not empty (${code ?? 'unknown error'})` };
    }
  }

  const removed = git(checkoutRoot, ['worktree', 'remove', tree.path], env);
  if (removed.status !== 0) {
    return { disposition: 'kept', keptReason: 'remove-refused', detail: lastLine(removed.stderr) || 'git worktree remove failed' };
  }
  const deleted = git(checkoutRoot, ['branch', '-d', tree.branch], env);
  if (deleted.status !== 0) {
    return { disposition: 'removed', keptReason: null, detail: `branch kept: ${lastLine(deleted.stderr) || 'git branch -d failed'}` };
  }
  return { disposition: 'removed', keptReason: null, detail: null };
}

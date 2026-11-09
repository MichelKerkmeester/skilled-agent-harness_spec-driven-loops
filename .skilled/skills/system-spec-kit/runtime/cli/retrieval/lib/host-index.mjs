// ───────────────────────────────────────────────────────────────────
// MODULE: Host Trigger Index Location
// ───────────────────────────────────────────────────────────────────
// Skilled is both a repository of its own and a dependency a host repository
// vendors: the host keeps a copy of the source tree under `.skilled` and its own
// spec packets under `<host>/specs`. The packaged trigger index describes the
// framework's documents only, so a lookup run from a host would answer every
// question from the wrong corpus, and a generation run there would publish the
// host's corpus over the packaged artifact.
//
// The two roots are distinguishable without configuration. This checkout holds
// a real `.skilled` directory directly under its own root. A host either keeps
// its index directory, `.speckit-index/` unless it names another, or points
// `.skilled` at a tree that lives
// outside itself — a symlink into an installed copy, or a vendored tree placed
// elsewhere. Neither signal can be produced by accident inside the framework
// checkout, so a bare invocation can select the host corpus and index safely.
//
// One layout goes a step further: a project repository keeps no corpus of its own
// and links both `.skilled` and `specs` into a host that does. Such a project is
// a host by the `.skilled` signal yet owns no index, so the index it must read is
// the one belonging to the repository holding the tree it linked. That owner is
// resolved from where the vendored tree really lives — never by walking ancestors
// in the hope of meeting a repository that happens to keep an index.
//
// A host may name its index directory in `.skilled-host.json` at its root, as
// `{ "indexDir": ".index" }`. The file is read at the root whose index is being
// located, so a linked project reaches its owner's folder without carrying the
// setting itself.

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

// ───────────────────────────────────────────────────────────────────
// 1. CONTRACT
// ───────────────────────────────────────────────────────────────────

/** Index directory a host uses when it names none, relative to its root. */
export const DEFAULT_HOST_INDEX_DIR = '.speckit-index';

/** Default location of a host repository's own index, relative to its root. */
export const HOST_INDEX_RELATIVE = `${DEFAULT_HOST_INDEX_DIR}/trigger-index.json`;

/** Host-root file that may name the index directory. */
export const HOST_SETTINGS_FILE = '.skilled-host.json';

/** Name of the index file inside the index directory. */
const INDEX_FILE_NAME = 'trigger-index.json';

// Top-level directories that may never hold the index. The vendored tree must
// stay identical to its pin, `specs` is the corpus the index is built from, and
// the other two belong to tools that rewrite or prune what they find inside.
const RESERVED_TOP_LEVEL = ['.skilled', 'specs', '.git', 'node_modules'];

// ───────────────────────────────────────────────────────────────────
// 2. ROOT RESOLUTION
// ───────────────────────────────────────────────────────────────────

/**
 * Asks git for the root of the checkout the caller is working in.
 *
 * Deliberately a subprocess rather than a walk for a `.git` entry: a linked
 * worktree carries `.git` as a file, and `spawnSync` without a shell keeps a
 * path containing spaces intact. A missing git, a directory outside any
 * checkout and any other git failure all report null, because a caller that
 * cannot name its own repository must fall back to the packaged default
 * rather than guess one.
 *
 * @param {string} [cwd] Directory the caller works in.
 * @returns {string|null} Absolute caller repository root, or null.
 */
export function callerRepoRoot(cwd = process.cwd()) {
  const run = spawnSync('git', ['rev-parse', '--show-toplevel'], {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  });
  if (run.error !== undefined || run.status !== 0) return null;
  const root = run.stdout.trim();
  return root.length > 0 ? root : null;
}

/**
 * Returns whether a root is a host repository that vendors Skilled.
 *
 * Two signals count, and both are absent from this checkout:
 *
 *   - the root carries its own index directory, so it has already opted in;
 *   - the source tree at `<root>/.skilled` resolves to a directory whose parent
 *     is not the root itself, which is what a vendored or symlinked install
 *     looks like while a real `.skilled` directory in the framework checkout
 *     resolves inside its own root.
 *
 * A root with no `.skilled` at all is not a host: it carries no source tree to
 * walk, so indexing it would fail closed anyway.
 *
 * @param {string} root Absolute or resolvable repository root.
 * @returns {boolean} True when the root keeps a corpus outside the framework tree.
 * @throws {Error} When the root's settings file cannot be honored, as `hostIndexDir` reports.
 */
export function isHostRepository(root) {
  const absolute = path.resolve(root);
  if (isDirectory(path.join(absolute, hostIndexDir(absolute)))) return true;

  let sourceTree;
  try {
    sourceTree = fs.realpathSync(path.join(absolute, '.skilled'));
  } catch {
    return false;
  }

  let rootReal;
  try {
    rootReal = fs.realpathSync(absolute);
  } catch {
    rootReal = absolute;
  }
  return path.dirname(sourceTree) !== rootReal;
}

/**
 * Resolves the index directory a root uses, relative to that root.
 *
 * A root with no settings file, or one that names no `indexDir`, keeps the
 * default. A settings file that cannot be parsed, or that names a directory
 * outside the root, inside a reserved directory such as the vendored tree or
 * the scanned `specs` corpus, or at a path that is not a directory, is an
 * error rather than a fallback: silently using the default would publish or
 * read an index the host did not ask for.
 *
 * The name is checked twice. The spelling is checked first, so a setting is
 * refused before anything exists on disk. The resolved location is checked
 * second, because a link or a differently cased name on a case-insensitive
 * volume reaches a refused directory under a spelling that looks harmless.
 *
 * @param {string} root Repository root.
 * @returns {string} Index directory relative to the root, never empty.
 * @throws {Error} When the settings file is malformed or names an unsafe directory.
 */
export function hostIndexDir(root) {
  const settingsPath = path.join(path.resolve(root), HOST_SETTINGS_FILE);
  let raw;
  try {
    raw = fs.readFileSync(settingsPath, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT' || error.code === 'ENOTDIR') return DEFAULT_HOST_INDEX_DIR;
    throw error;
  }

  let settings;
  try {
    settings = JSON.parse(raw);
  } catch (error) {
    throw new Error(`${settingsPath}: not valid JSON (${error.message})`);
  }
  if (settings === null || typeof settings !== 'object' || Array.isArray(settings)) {
    throw new Error(`${settingsPath}: expected a JSON object`);
  }
  if (settings.indexDir === undefined) return DEFAULT_HOST_INDEX_DIR;
  if (typeof settings.indexDir !== 'string' || settings.indexDir.trim() === '') {
    throw new Error(`${settingsPath}: indexDir must be a non-empty string`);
  }

  const relative = path.normalize(settings.indexDir.trim());
  const first = relative.split(path.sep)[0];
  if (path.isAbsolute(relative) || relative === '.' || first === '..') {
    throw new Error(`${settingsPath}: indexDir must name a directory inside the repository root`);
  }
  const reserved = RESERVED_TOP_LEVEL.find((name) => name === first.toLowerCase());
  if (reserved !== undefined) {
    throw new Error(`${settingsPath}: indexDir must not lie inside ${reserved}/`);
  }

  const rootReal = realpathOrSelf(path.resolve(root));
  const target = path.join(rootReal, relative);
  const resolved = resolveThroughExisting(target);
  if (!isInside(resolved, rootReal)) {
    throw new Error(`${settingsPath}: indexDir must name a directory inside the repository root`);
  }
  for (const name of RESERVED_TOP_LEVEL) {
    const held = realpathOrSelf(path.join(rootReal, name));
    if (resolved === held || isInside(resolved, held)) {
      throw new Error(`${settingsPath}: indexDir must not lie inside ${name}/`);
    }
  }
  if (fs.existsSync(target) && !isDirectory(target)) {
    throw new Error(`${settingsPath}: indexDir names a path that is not a directory`);
  }
  return relative;
}

/**
 * Resolves where a host repository keeps its own index.
 *
 * @param {string} root Host repository root.
 * @returns {string} Absolute index path under the root.
 * @throws {Error} When the root's settings file cannot be honored.
 */
export function hostIndexPath(root) {
  return path.resolve(root, hostIndexDir(root), INDEX_FILE_NAME);
}

/**
 * Names an index a root still keeps in the default directory after its setting
 * moved the index elsewhere and nothing was generated there yet.
 *
 * The setting disowns the default directory, so that index is never read. A
 * lookup then answers from another index without failing, which looks like a
 * working setup: the one useful thing left is to say which step is missing.
 *
 * @param {string} root Repository root.
 * @returns {string|null} Path of the disowned index, or null when there is none.
 * @throws {Error} When the root's settings file cannot be honored.
 */
export function disownedDefaultIndex(root) {
  if (hostIndexDir(root) === DEFAULT_HOST_INDEX_DIR) return null;
  if (isFile(hostIndexPath(root))) return null;
  const leftover = path.resolve(root, HOST_INDEX_RELATIVE);
  return isFile(leftover) ? leftover : null;
}

/**
 * Resolves the host repository whose vendored tree a project links into.
 *
 * A project may carry `.skilled` as a link into a host's tree and keep no index
 * of its own. Reading the packaged index there answers from the framework's
 * documents instead of the host corpus the project's `specs` entry actually
 * points at, so the host that owns the tree has to be named.
 *
 * Only a host is considered, and only one whose vendored tree resolves to a
 * directory held by a *different* repository that already keeps an index. A
 * root whose `.skilled` resolves inside itself is the framework checkout, and a
 * root whose owner keeps no index has nothing better to offer than the packaged
 * default. Nothing is inferred from an ancestor walk: an unrelated repository
 * higher up the filesystem is not this project's host, and guessing one would
 * silently serve another corpus.
 *
 * @param {string} root Absolute or resolvable repository root.
 * @returns {string|null} Root of the host holding the vendored tree, or null.
 * @throws {Error} When the settings file of the root or of its owner cannot be honored.
 */
export function owningHostRoot(root) {
  const absolute = path.resolve(root);
  if (!isHostRepository(absolute)) return null;

  let vendored;
  try {
    vendored = fs.realpathSync(path.join(absolute, '.skilled'));
  } catch {
    return null;
  }

  // The tree's own directory is what git is asked about, not the root: the
  // vendored tree sits somewhere inside its host, at no fixed depth.
  const owner = callerRepoRoot(path.dirname(vendored));
  if (owner === null) return null;
  if (realpathOrSelf(owner) === realpathOrSelf(absolute)) return null;

  return isFile(hostIndexPath(owner)) ? owner : null;
}

// ───────────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────────

/**
 * @param {string} candidate Absolute path.
 * @returns {boolean} True when the path is an existing directory.
 */
function isDirectory(candidate) {
  try {
    return fs.statSync(candidate).isDirectory();
  } catch {
    return false;
  }
}

/**
 * @param {string} candidate Absolute path.
 * @returns {boolean} True when the path is an existing regular file.
 */
export function isFile(candidate) {
  try {
    return fs.statSync(candidate).isFile();
  } catch {
    return false;
  }
}

/**
 * @param {string} candidate Absolute path.
 * @returns {string} The resolved path, or the path unchanged when it cannot be resolved.
 */
function realpathOrSelf(candidate) {
  try {
    return fs.realpathSync(candidate);
  } catch {
    return candidate;
  }
}

/**
 * Resolves a path that may not exist yet, following every link on the part
 * that does. The index directory is created on first generation, so the
 * deepest existing ancestor is what decides where a write would land.
 *
 * @param {string} candidate Absolute path.
 * @returns {string} The location the path reaches once links are followed.
 */
function resolveThroughExisting(candidate) {
  const missing = [];
  let current = candidate;
  for (;;) {
    try {
      return path.join(fs.realpathSync(current), ...missing);
    } catch {
      const parent = path.dirname(current);
      if (parent === current) return candidate;
      missing.unshift(path.basename(current));
      current = parent;
    }
  }
}

/**
 * @param {string} candidate Absolute path.
 * @param {string} container Absolute directory.
 * @returns {boolean} True when the path lies strictly below the directory.
 */
function isInside(candidate, container) {
  const offset = path.relative(container, candidate);
  return offset !== '' && offset.split(path.sep)[0] !== '..' && !path.isAbsolute(offset);
}

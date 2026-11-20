#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Doctor Overlay Engine
// ───────────────────────────────────────────────────────────────────
'use strict';

// Keeps a project's own divergences from a vendored Skilled tree ("overlays")
// and puts them back after the tree is re-copied from upstream.
//
// WHY this exists: a vendored tree is replaced wholesale whenever a new upstream
// release is copied in, and there is no update base that would carry local
// edits forward. Every divergence therefore lives twice: once as a canonical
// copy in the overlay folder, and once as the applied file in the tree. This
// engine keeps the two equal, records the bytes it last applied to each
// destination, and tells a live edit apart from an overlay edit.
//
// The two rules the whole design rests on:
//   1. A vendor file is never overwritten when upstream has changed it. The
//      engine stops and names the path instead, because guessing which hunks to
//      keep is how a silent regression starts.
//   2. Applying twice writes nothing the second time.
//
// Usage:
//   node overlay-engine.cjs status [--root <tree>] [--json] [--audit]
//     Read-only. One line per destination not in sync, then the full check.
//     Exit 0 when everything is in sync, 1 when anything is not, 2 on error.
//   node overlay-engine.cjs apply [--root <tree>]
//     Apply overlay edits, regenerate, verify. Exit 0, 1 on conflict, 2 on error.
//   node overlay-engine.cjs apply --capture <path> [--root <tree>]
//     Save a live edit back into its overlay source. Exit 0, 1 when the path is
//     not live-edited, 2 on refusal or error.
//   node overlay-engine.cjs --guard <path> [--root <tree>]
//     Exit 0 when the path is not owned by an overlay, 1 when it is, 2 on error.
//     With "strictWrites": true in the manifest, also exit 1 for a write under
//     a vendored root that no overlay owns and the generated list does not name.
//   node overlay-engine.cjs apply --adopt <path> [--root <tree>]
//     Add a manifest entry for a vendored path no overlay owns yet, then apply.
//     Exit 0, 1 when the apply that follows is blocked, 2 on refusal or error.
//   node overlay-engine.cjs pre-commit [--root <tree>]
//     With strictWrites on, exit 1 when a staged change touches a vendored path
//     no overlay owns. Exit 0 otherwise, 2 on error.
//   node overlay-engine.cjs apply --relayout [--root <tree>]
//     Move every overlay source kept off its layout path onto it, back up what
//     it leaves behind, and point the manifest there. Exit 0, 2 on a refusal.
//   node overlay-engine.cjs repin --upstream <dir> --to <commit> [--stage <dir>] [--root <tree>] [--json]
//     Move the tree to a new upstream commit and apply the overlays again. With
//     --stage, do it on a copy of the tree in <dir> and leave the tree alone.
//     Exit 0 when clean, 1 when apply was blocked or the check failed (the run
//     folder stays for --rollback), 2 on a refusal before any write or an error.
//   node overlay-engine.cjs repin --rollback <run-id> [--root <tree>] [--json]
//     Put back the bytes a re-pin run backed up. Exit 0, 2 on refusal or error.
//
// --root defaults to the tree this script is vendored in.
//
// Standard library only: this must run on a bare checkout with no install step.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_ROOT = path.resolve(__dirname, '..', '..', '..', '..');
const SETTING_FILE = '.skilled-overlays.json';
const DEFAULT_OVERLAY_FOLDER = 'skilled-overlays';
const MANIFEST_FILE = 'overlay-manifest.json';
const STATE_FILE = 'sync-state.json';
const LOCK_FILE = '.build-lock';
const LOCK_TAKEOVER_SUFFIX = '.takeover';
const LOCK_TAKEOVER_STALE_MS = 60 * 1000;
const STATE_SCHEMA_VERSION = 2;
// Version 1 files predate the run-level flags. They still load, and the next
// write upgrades them; the version is how status tells a file another writer
// may have rewritten from one this engine wrote.
const READABLE_STATE_VERSIONS = new Set([1, STATE_SCHEMA_VERSION]);
const STATUS_NAMES = ['in-sync', 'overlay-edited', 'live-edited', 'both-changed', 'upstream-moved', 'cannot-apply'];
const BLOCKING_STATES = new Set(['live-edited', 'both-changed', 'upstream-moved', 'cannot-apply']);
const ENGINE_COMMAND = 'node .skilled/commands/doctor/scripts/overlay-engine.cjs';
// The most LAYOUT lines status prints; status --json keeps every move.
const LAYOUT_SHOWN = 20;
const EXIT_OK = 0;
const EXIT_CONFLICT = 1;
const EXIT_ERROR = 2;
const VENDOR_ROOT = '.skilled';
const DEFAULT_RUNTIME_FOLDERS = ['.claude', '.codex', '.cursor', '.devin', '.dsh', '.opencode', '.pi', '.vibe'];
const RUNS_FOLDER = 'repin-runs';
const RELAYOUT_RUNS_FOLDER = 'relayout-runs';
const RUN_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;
const GIT_MAX_BUFFER = 512 * 1024 * 1024;
const REPIN_VALUE_FLAGS = ['upstream', 'to', 'stage', 'rollback'];
const COMMAND_WORDS = ['status', 'apply', 'repin', 'pre-commit'];
// A token-named file is adopted only when its extension marks it as source or
// prose. Any other token-named file may hold a credential, so it is refused.
const TOKEN_NAME_ADOPT_EXTENSIONS = new Set(['.md', '.css', '.ts', '.js', '.cjs', '.mjs', '.svelte']);

const USAGE = [
  'usage: node overlay-engine.cjs status [--root <tree>] [--json] [--audit]',
  '       node overlay-engine.cjs apply [--capture <path> | --adopt <path> | --relayout] [--root <tree>]',
  '       node overlay-engine.cjs --guard <path> [--root <tree>]',
  '       node overlay-engine.cjs pre-commit [--root <tree>]',
  '       node overlay-engine.cjs repin --upstream <dir> --to <commit> [--stage <dir>] [--root <tree>] [--json]',
  '       node overlay-engine.cjs repin --rollback <run-id> [--root <tree>] [--json]',
].join('\n');

// ─────────────────────────────────────────────────────────────────────────────
// 3. FILE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Return the hexadecimal SHA-256 digest for a byte buffer.
 * @param {Buffer} buffer Bytes to hash.
 * @returns {string} The lowercase hexadecimal digest.
 */
function sha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

function toPosix(filePath) {
  return filePath.split(path.sep).join('/');
}

function readBufferOrNull(filePath) {
  try {
    return fs.readFileSync(filePath);
  } catch (error) {
    if (error && error.code === 'ENOENT') return null;
    throw error;
  }
}

function pathExists(filePath) {
  try {
    fs.lstatSync(filePath);
    return true;
  } catch (error) {
    if (error && (error.code === 'ENOENT' || error.code === 'ENOTDIR')) return false;
    throw error;
  }
}

function isFile(filePath) {
  try {
    return fs.lstatSync(filePath).isFile();
  } catch {
    return false;
  }
}

function isDirectory(filePath) {
  try {
    return fs.lstatSync(filePath).isDirectory();
  } catch {
    return false;
  }
}

function isWithin(basePath, candidatePath) {
  const relative = path.relative(basePath, candidatePath);
  return relative === '' || (!path.isAbsolute(relative) && relative !== '..' && !relative.startsWith('..' + path.sep));
}

function relativeKey(root, filePath) {
  const absoluteRoot = path.resolve(root);
  const absoluteFile = path.resolve(filePath);
  if (!isWithin(absoluteRoot, absoluteFile) || absoluteFile === absoluteRoot) {
    throw new Error('destination escapes the sync root: ' + filePath);
  }
  return toPosix(path.relative(absoluteRoot, absoluteFile));
}

/**
 * Resolve one remove-root path, refusing any that leaves the tree.
 * @param {string} root Destination tree root.
 * @param {string} relativePath Path as the manifest names it.
 * @returns {string} The absolute path to remove.
 */
function resolveRemoveRootPath(root, relativePath) {
  if (typeof relativePath !== 'string' || relativePath.length === 0) {
    throw new Error('removal path must be a non-empty relative path');
  }
  if (relativePath.includes('\0')) throw new Error('removal path contains a null byte');
  if (path.isAbsolute(relativePath) || path.win32.isAbsolute(relativePath)) {
    throw new Error(`removal path must be relative: ${relativePath}`);
  }
  if (relativePath.includes('\\')) throw new Error(`removal path must use forward slashes: ${relativePath}`);
  if (relativePath.split('/').includes('..')) throw new Error(`removal path contains a '..' segment: ${relativePath}`);

  const absoluteRoot = path.resolve(root);
  const absolutePath = path.resolve(absoluteRoot, relativePath);
  if (absolutePath === absoluteRoot || !isWithin(absoluteRoot, absolutePath)) {
    throw new Error(`removal path resolves outside the tree root: ${relativePath}`);
  }

  // A symlinked parent is safe only when it resolves back inside the tree. The
  // leaf itself may be a symlink, because the plan deletes that link unopened.
  let realRoot;
  try {
    realRoot = fs.realpathSync.native(absoluteRoot);
  } catch (error) {
    if (!error || (error.code !== 'ENOENT' && error.code !== 'ENOTDIR')) throw error;
    realRoot = absoluteRoot;
  }
  let parentPath = absoluteRoot;
  for (const part of path.relative(absoluteRoot, absolutePath).split(path.sep).slice(0, -1)) {
    parentPath = path.join(parentPath, part);
    let stats;
    try {
      stats = fs.lstatSync(parentPath);
    } catch (error) {
      if (error && (error.code === 'ENOENT' || error.code === 'ENOTDIR')) break;
      throw error;
    }
    if (stats.isSymbolicLink()) {
      let resolvedParent;
      try {
        resolvedParent = fs.realpathSync.native(parentPath);
      } catch {
        throw new Error(`removal path has an unresolved symlink parent: ${relativePath}`);
      }
      if (!isWithin(realRoot, resolvedParent)) {
        throw new Error(`removal path traverses outside the tree through a symlink parent: ${relativePath}`);
      }
    }
    if (!stats.isDirectory()) break;
  }
  return absolutePath;
}

/**
 * List a path and everything below it, deepest entries first.
 * @param {string} filePath Path to remove.
 * @returns {string[]} Absolute paths, children before their folder.
 */
function collectRemovalPaths(filePath) {
  let stats;
  try {
    stats = fs.lstatSync(filePath);
  } catch (error) {
    if (error && (error.code === 'ENOENT' || error.code === 'ENOTDIR')) return [];
    throw error;
  }
  if (!stats.isDirectory()) return [filePath];

  const paths = [];
  for (const name of fs.readdirSync(filePath)) {
    paths.push(...collectRemovalPaths(path.join(filePath, name)));
  }
  paths.push(filePath);
  return paths;
}

function writeFile(filePath, buffer, mode) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, buffer, { mode: mode || 0o644 });
}

/**
 * Replace a file through a temporary file and a rename, so a run killed
 * mid-write leaves the old bytes instead of half a JSON document that every
 * later command refuses to read.
 * @param {string} filePath File to replace.
 * @param {string|Buffer} content New content.
 */
function writeFileAtomic(filePath, content) {
  const temporary = filePath + '.tmp-' + process.pid;
  let mode;
  try {
    mode = fs.statSync(filePath).mode & 0o777;
  } catch (error) {
    if (!error || error.code !== 'ENOENT') throw error;
  }
  fs.writeFileSync(temporary, content);
  try {
    if (mode !== undefined) fs.chmodSync(temporary, mode);
    fs.renameSync(temporary, filePath);
  } catch (error) {
    fs.rmSync(temporary, { force: true });
    throw error;
  }
}

function ensureSymlink(filePath, target) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  try {
    fs.unlinkSync(filePath);
  } catch (error) {
    if (!error || error.code !== 'ENOENT') throw error;
  }
  fs.symlinkSync(target, filePath);
}

function removePath(filePath) {
  let stats;
  try {
    stats = fs.lstatSync(filePath);
  } catch (error) {
    if (error && error.code === 'ENOENT') return false;
    throw error;
  }
  if (stats.isDirectory()) fs.rmSync(filePath, { recursive: true, force: true });
  else fs.unlinkSync(filePath);
  return true;
}

// A vendor folder whose every file was removed would otherwise stay behind as an
// empty directory, which reads as "still part of the skill" to a human and to a
// directory listing in a check.
function pruneEmptyDirs(dir) {
  if (!isDirectory(dir)) return;
  for (const dirent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (dirent.isDirectory()) pruneEmptyDirs(path.join(dir, dirent.name));
  }
  if (fs.readdirSync(dir).length === 0) fs.rmdirSync(dir);
}

/**
 * Every entry below `dir`, keyed by its path relative to `dir`. Symlinks are
 * returned as links with their target string, never followed, because the
 * vendored tree keeps its shape with relative links.
 * @param {string} dir Folder to walk.
 * @returns {Map<string, object>} Entries keyed by posix path relative to `dir`.
 */
function walkTree(dir) {
  const entries = new Map();
  if (!isDirectory(dir)) return entries;
  const stack = [''];
  while (stack.length > 0) {
    const rel = stack.pop();
    const abs = rel ? path.join(dir, rel) : dir;
    for (const dirent of fs.readdirSync(abs, { withFileTypes: true })) {
      const childRel = rel ? path.posix.join(rel, dirent.name) : dirent.name;
      const childAbs = path.join(dir, childRel);
      const stats = fs.lstatSync(childAbs);
      if (stats.isSymbolicLink()) {
        entries.set(childRel, { kind: 'symlink', target: fs.readlinkSync(childAbs) });
      } else if (stats.isDirectory()) {
        stack.push(childRel);
      } else {
        entries.set(childRel, {
          kind: 'file',
          buffer: fs.readFileSync(childAbs),
          mode: stats.mode & 0o777,
        });
      }
    }
  }
  return entries;
}

/**
 * Absolute paths of every non-directory entry below a folder, symlinks included.
 * @param {string} directoryPath Folder to list.
 * @returns {string[]} Absolute paths.
 */
function listTreePaths(directoryPath) {
  const paths = [];
  if (!isDirectory(directoryPath)) return paths;
  const pending = [directoryPath];
  while (pending.length > 0) {
    const current = pending.pop();
    for (const item of fs.readdirSync(current, { withFileTypes: true })) {
      const absolute = path.join(current, item.name);
      const stats = fs.lstatSync(absolute);
      if (stats.isDirectory()) pending.push(absolute);
      else paths.push(absolute);
    }
  }
  return paths;
}

/**
 * Resolve symlinks in the longest existing prefix of a path.
 * @param {string} filePath Path that may not exist yet.
 * @returns {string} The path with its existing part resolved.
 */
function canonicalPath(filePath) {
  const absolute = path.resolve(filePath);
  const remaining = [];
  let current = absolute;
  while (true) {
    try {
      const resolved = fs.realpathSync.native(current);
      return path.join(resolved, ...remaining.reverse());
    } catch (error) {
      if (!error || (error.code !== 'ENOENT' && error.code !== 'ENOTDIR')) throw error;
      const parent = path.dirname(current);
      if (parent === current) return absolute;
      remaining.push(path.basename(current));
      current = parent;
    }
  }
}

function canonicalPathWithoutLeaf(filePath) {
  const absolute = path.resolve(filePath);
  return path.join(canonicalPath(path.dirname(absolute)), path.basename(absolute));
}

function describe(value) {
  return JSON.stringify(value);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. OVERLAY FOLDER, MANIFEST AND STATE
//
// The overlay folder is named by one setting file at the tree root. It cannot
// live inside `.skilled`, because a re-pin overwrites that folder, and it cannot
// live in the manifest, because the manifest sits inside the folder it would
// locate. Everything else in the engine asks the context built here.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Read the overlay folder from the tree's setting file.
 * This is the only reader of the setting; every caller goes through it.
 * @param {string} root Vendored tree root.
 * @returns {string} The overlay folder, relative to the root, with forward slashes.
 */
function resolveOverlayDir(root) {
  const settingPath = path.join(path.resolve(root), SETTING_FILE);
  const buffer = readBufferOrNull(settingPath);
  if (!buffer) return DEFAULT_OVERLAY_FOLDER;
  let parsed;
  try {
    parsed = JSON.parse(buffer.toString('utf8'));
  } catch (error) {
    throw new Error(`${SETTING_FILE} is not valid JSON: ${error.message}`);
  }
  const value = parsed && typeof parsed === 'object' ? parsed.overlayDir : undefined;
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`${SETTING_FILE} must name the overlay folder as a non-empty string`);
  }
  if (value.includes('\0') || value.includes('\\') || path.isAbsolute(value) || path.win32.isAbsolute(value)) {
    throw new Error(`${SETTING_FILE} must name a relative folder with forward slashes: ${value}`);
  }
  const normalized = path.posix.normalize(value).replace(/\/+$/, '');
  // A folder beside the tree is allowed so the overlays can live outside a framework checkout;
  // anything deeper or further out stays refused. A sibling carrying the tree's own
  // name is the tree root itself, so it is refused with the rest. The spelling check
  // misses a case variant on a case-insensitive disk and a link back to the tree, so an
  // existing folder is also compared by where it resolves; a missing one resolves beside it.
  // A link whose target does not exist yet cannot be resolved, so it is refused until it can.
  const sibling = normalized.startsWith('../') ? normalized.slice(3) : null;
  if (sibling !== null && sibling !== '' && sibling !== '.' && sibling !== '..' && !sibling.includes('/') &&
    sibling !== path.basename(path.resolve(root))) {
    const siblingPath = path.resolve(root, normalized);
    // A link that loops never resolves either, so it is refused the same way
    // before resolving it can fail with a raw error.
    let isDanglingLink = false;
    try {
      isDanglingLink = fs.lstatSync(siblingPath).isSymbolicLink() && !fs.existsSync(siblingPath);
    } catch (error) {
      if (!error || error.code !== 'ENOENT') throw error;
    }
    if (!isDanglingLink) {
      const treeRoot = canonicalPath(root);
      const target = canonicalPath(siblingPath);
      if (!isWithin(treeRoot, target) && !isWithin(target, treeRoot)) {
        // A folder beside the tree must stay in the tree's own git repository, or
        // its overlays and pin are never committed with the tree, and the
        // repository's own `.git` folder is never an overlay folder. A tree in no
        // repository has nothing to compare against, so it keeps the folder.
        const top = gitTopLevelOrNull(treeRoot);
        if (top !== null) {
          const relative = path.relative(top, target);
          if (!isWithin(top, target) || relative.split(path.sep)[0] === '.git') {
            throw new Error(`${SETTING_FILE} names a folder outside the git repository at ${top}: ${value}`);
          }
        }
        return normalized;
      }
      // A sibling that lands on the tree, or on a folder around it, is not beside
      // the tree at all, so the refusal says where it really points.
      if (isWithin(treeRoot, target)) {
        throw new Error(`${SETTING_FILE} names a sibling that resolves into the tree root: ${value}`);
      }
      throw new Error(`${SETTING_FILE} names a sibling that resolves to a folder holding the tree root: ${value}`);
    }
  }
  if (normalized === '.' || normalized === '' || normalized === '..' || normalized.startsWith('../')) {
    throw new Error(`${SETTING_FILE} names a folder outside the tree root: ${value}`);
  }
  // A folder inside the tree is still read through any link on its path, so it is
  // judged by where that path lands. A link whose target is missing, or that
  // loops, cannot be resolved, so it is refused until it can.
  const inside = path.resolve(root, normalized);
  let current = path.resolve(root);
  for (const part of normalized.split('/')) {
    current = path.join(current, part);
    let stats;
    try {
      stats = fs.lstatSync(current);
    } catch (error) {
      if (!error || (error.code !== 'ENOENT' && error.code !== 'ENOTDIR')) throw error;
      break;
    }
    if (stats.isSymbolicLink() && !fs.existsSync(current)) {
      throw new Error(`${SETTING_FILE} names a folder inside the tree that resolves outside it: ${value}`);
    }
  }
  if (!isWithin(canonicalPath(root), canonicalPath(inside))) {
    throw new Error(`${SETTING_FILE} names a folder inside the tree that resolves outside it: ${value}`);
  }
  return normalized;
}

/**
 * Copy the environment without the repository variables a git hook exports.
 * @returns {object} An environment in which git finds the repository from its cwd.
 */
function hookFreeEnv() {
  const env = { ...process.env };
  for (const name of ['GIT_DIR', 'GIT_WORK_TREE', 'GIT_INDEX_FILE', 'GIT_PREFIX']) delete env[name];
  return env;
}

/**
 * Read the canonical top level of the git repository holding a folder.
 * @param {string} cwd Folder to ask from.
 * @returns {string|null} The top level, or null when the folder is in no repository or git cannot run.
 */
function gitTopLevelOrNull(cwd) {
  // A git hook exports GIT_DIR without GIT_WORK_TREE, which makes git report the
  // working folder as the top level, so git has to find the repository from cwd.
  let top;
  try {
    const result = spawnSync('git', ['-C', cwd, 'rev-parse', '--show-toplevel'], { env: hookFreeEnv(), encoding: 'utf8' });
    if (result.error || result.status !== 0) return null;
    top = result.stdout;
  } catch {
    return null;
  }
  if (typeof top !== 'string' || top.trim() === '') return null;
  return canonicalPath(top.trim());
}

/**
 * Build the paths one engine run works against.
 * @param {string} root Vendored tree root.
 * @returns {{root: string, overlayLabel: string, overlayRoot: string, overlayOutside: boolean,
 *   hasSetting: boolean, manifestPath: string, statePath: string, lockPath: string}}
 *   `overlayOutside` is true when the overlay folder sits beside the tree rather than under it.
 */
function createContext(root) {
  const absoluteRoot = path.resolve(root);
  const overlayLabel = resolveOverlayDir(absoluteRoot);
  const overlayRoot = path.join(absoluteRoot, ...overlayLabel.split('/'));
  return {
    root: absoluteRoot,
    overlayLabel,
    overlayRoot,
    overlayOutside: !isWithin(absoluteRoot, overlayRoot),
    hasSetting: pathExists(path.join(absoluteRoot, SETTING_FILE)),
    manifestPath: path.join(overlayRoot, MANIFEST_FILE),
    statePath: path.join(overlayRoot, STATE_FILE),
    lockPath: path.join(overlayRoot, LOCK_FILE),
  };
}

/**
 * Load the overlay manifest from the overlay folder.
 * @param {object} ctx Engine context.
 * @returns {object} Parsed overlay manifest.
 */
function loadManifest(ctx) {
  const buffer = readBufferOrNull(ctx.manifestPath);
  if (!buffer) {
    const where = toPosix(path.relative(ctx.root, ctx.manifestPath));
    // Without the setting file the folder is a guess, so the error says what was
    // guessed and how to name the real folder rather than blaming the manifest.
    if (!ctx.hasSetting) {
      throw new Error(`no overlay manifest at ${where}: with no ${SETTING_FILE} at the tree root the engine ` +
        `looks in ${DEFAULT_OVERLAY_FOLDER}/; if the overlays live elsewhere, add ` +
        `${SETTING_FILE} at the tree root naming that folder`);
    }
    throw new Error('no overlay manifest at ' + where);
  }
  const manifest = JSON.parse(buffer.toString('utf8'));
  if (!manifest || !Array.isArray(manifest.overlays)) throw new Error('overlay manifest has no overlays array');
  // A relative checkout is written for the tree, not for whichever folder the
  // engine is run from, so one manifest works on every machine that keeps the
  // checkout at the same place beside the tree. The manifest file keeps its text.
  if (manifest.pin && typeof manifest.pin.checkout === 'string' && !path.isAbsolute(manifest.pin.checkout)) {
    manifest.pin.checkout = path.resolve(ctx.root, manifest.pin.checkout);
  }
  return manifest;
}

function emptyState(pin) {
  return {
    schemaVersion: STATE_SCHEMA_VERSION,
    loadedVersion: null,
    pin,
    files: {},
    links: {},
    items: {},
    sets: {},
    keys: {},
    regeneratePending: false,
    exists: false,
  };
}

/**
 * Load the hashes of what each destination last received from its overlay, the
 * layout link targets this engine itself put there, the array items it added,
 * the values its `set` and `insertObjectKeys` operations wrote and the keys its
 * `setKeyOnItem` operations wrote.
 * @param {object} ctx Engine context.
 * @param {object} manifest Loaded overlay manifest.
 * @returns {{schemaVersion: number, loadedVersion: number|null, pin: string,
 *   files: Record<string, string>, links: Record<string, string>,
 *   items: Record<string, object[]>, sets: Record<string, object[]>,
 *   keys: Record<string, object[]>, regeneratePending: boolean, exists: boolean}} `loadedVersion` is the
 *   version the file was written with, or null when there is no file.
 */
function loadState(ctx, manifest) {
  const buffer = readBufferOrNull(ctx.statePath);
  if (!buffer) return emptyState(manifest.pin.commit);
  let parsed;
  try {
    parsed = JSON.parse(buffer.toString('utf8'));
  } catch (error) {
    throw new Error(STATE_FILE + ' is not valid JSON: ' + error.message +
      '; restore it from version control, because every command reads it');
  }
  if (!parsed || !READABLE_STATE_VERSIONS.has(parsed.schemaVersion) || typeof parsed.pin !== 'string' ||
      !parsed.files || typeof parsed.files !== 'object' || Array.isArray(parsed.files)) {
    throw new Error(STATE_FILE + ' has an unsupported shape');
  }
  // An older state file predates the link records, so a missing key means the
  // engine has no link it may retarget: every link on disk is someone else's.
  const links = parsed.links === undefined ? {} : parsed.links;
  if (!links || typeof links !== 'object' || Array.isArray(links) ||
      Object.values(links).some((target) => typeof target !== 'string')) {
    throw new Error(STATE_FILE + ' has an unsupported shape');
  }
  // A state file written before the added items were recorded says the engine
  // added nothing, so a missing key means no recorded item may ever be removed.
  const items = parsed.items === undefined ? {} : parsed.items;
  if (!items || typeof items !== 'object' || Array.isArray(items) ||
      Object.values(items).some((records) => !Array.isArray(records))) {
    throw new Error(STATE_FILE + ' has an unsupported shape');
  }
  // A state file written before a `set` was recorded says the engine wrote none,
  // so a missing key means no value may ever be returned to the pin's.
  const sets = parsed.sets === undefined ? {} : parsed.sets;
  if (!sets || typeof sets !== 'object' || Array.isArray(sets) ||
      Object.values(sets).some((records) => !Array.isArray(records))) {
    throw new Error(STATE_FILE + ' has an unsupported shape');
  }
  // A state file written before `setKeyOnItem` keys were recorded says the
  // engine wrote none, so a missing key means no such key may be taken back.
  const keys = parsed.keys === undefined ? {} : parsed.keys;
  if (!keys || typeof keys !== 'object' || Array.isArray(keys) ||
      Object.values(keys).some((records) => !Array.isArray(records))) {
    throw new Error(STATE_FILE + ' has an unsupported shape');
  }
  // A record without a usable path cannot be matched to any operation, so a
  // drop would pass it by in silence; the file is refused while one is there.
  // A key record also needs the identity key and the key it names.
  const isPathStep = (step) => typeof step === 'string' || (Number.isInteger(step) && step >= 0);
  for (const [kind, records] of [['items', items], ['sets', sets], ['keys', keys]]) {
    for (const [destination, list] of Object.entries(records)) {
      for (const record of list) {
        if (!record || typeof record !== 'object' || !Array.isArray(record.path) || !record.path.every(isPathStep) ||
            (kind === 'keys' && (typeof record.identityKey !== 'string' || typeof record.key !== 'string'))) {
          throw new Error(`${STATE_FILE} has a ${kind} record for ${destination} without a valid path; ` +
            `restore ${STATE_FILE} from version control, or remove that record and run apply`);
        }
      }
    }
  }
  for (const [destination, hash] of Object.entries(parsed.files)) {
    if (path.isAbsolute(destination) || destination.includes('\\') ||
        destination.split('/').some((part) => part === '..' || part === '.' || part === '') ||
        !/^[a-f0-9]{64}$/i.test(hash)) {
      throw new Error(STATE_FILE + ' has an invalid file entry: ' + destination);
    }
  }
  return {
    schemaVersion: STATE_SCHEMA_VERSION,
    loadedVersion: parsed.schemaVersion,
    pin: parsed.pin,
    files: parsed.files,
    links,
    items,
    sets,
    keys,
    regeneratePending: parsed.regeneratePending === true,
    exists: true,
  };
}

/**
 * Write the applied-hash state, sorted, only when its bytes would change.
 * @param {object} ctx Engine context.
 * @param {{pin: string, files: Record<string, string>, links?: Record<string, string>,
 *   items?: Record<string, object[]>, sets?: Record<string, object[]>,
 *   keys?: Record<string, object[]>, regeneratePending?: boolean}} state State to record. `regeneratePending`
 *   says a run wrote destinations whose regeneration has not finished yet.
 * @returns {boolean} Whether the file was written.
 */
function writeStateIfChanged(ctx, state) {
  const sortedFiles = {};
  for (const key of Object.keys(state.files).sort()) sortedFiles[key] = state.files[key];
  const sortedLinks = {};
  for (const key of Object.keys(state.links || {}).sort()) sortedLinks[key] = state.links[key];
  const sortedItems = {};
  for (const key of Object.keys(state.items || {}).sort()) sortedItems[key] = state.items[key];
  const sortedSets = {};
  for (const key of Object.keys(state.sets || {}).sort()) sortedSets[key] = state.sets[key];
  const sortedKeys = {};
  for (const key of Object.keys(state.keys || {}).sort()) sortedKeys[key] = state.keys[key];
  const body = {
    schemaVersion: STATE_SCHEMA_VERSION,
    pin: state.pin,
    files: sortedFiles,
  };
  // A tree with no layout links keeps the bytes it had before links were
  // recorded, so an overlay-only state file never churns on rewrite.
  if (Object.keys(sortedLinks).length > 0) body.links = sortedLinks;
  // The added items follow the same rule: a tree whose overlays add none keeps
  // the state file bytes it already had.
  if (Object.keys(sortedItems).length > 0) body.items = sortedItems;
  // So do the recorded sets: a tree whose overlays hold no `set` or
  // `insertObjectKeys` writes no key.
  if (Object.keys(sortedSets).length > 0) body.sets = sortedSets;
  // And so do the `setKeyOnItem` keys.
  if (Object.keys(sortedKeys).length > 0) body.keys = sortedKeys;
  // Only an unfinished regeneration is written, so a clean run's file stays as it was.
  if (state.regeneratePending === true) body.regeneratePending = true;
  const content = JSON.stringify(body, null, 2) + '\n';
  const current = readBufferOrNull(ctx.statePath);
  if (current && current.toString('utf8') === content) return false;
  writeFileAtomic(ctx.statePath, content);
  return true;
}

function sourceRelative(ctx, sourcePath) {
  const absolute = path.resolve(sourcePath);
  if (!isWithin(ctx.overlayRoot, absolute) || absolute === ctx.overlayRoot) {
    throw new Error('overlay source escapes ' + ctx.overlayLabel + ': ' + sourcePath);
  }
  return toPosix(path.relative(ctx.overlayRoot, absolute));
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. JSON SOURCE MAP
//
// The vendored routing files are hand-formatted: some keep short string arrays
// on one line, others put one string per line. Parsing and re-serialising the
// whole document would rewrite every untouched line and turn a one-entry edit
// into a whole-file diff, so the edits are applied to the original text and
// only the touched range changes. This parser records the character span of
// every value and member; nothing else about the document is altered.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parse JSON text into nodes that keep their character spans.
 * @param {string} text Document text.
 * @returns {object} Root node with `start`, `end` and children.
 */
function parseJsonSource(text) {
  let index = 0;
  const length = text.length;

  function fail(message) {
    throw new Error(`invalid JSON at offset ${index}: ${message}`);
  }

  function skipWhitespace() {
    while (index < length) {
      const ch = text[index];
      if (ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r') index += 1;
      else break;
    }
  }

  function parseString() {
    const start = index;
    if (text[index] !== '"') fail('expected a string');
    index += 1;
    let raw = '';
    while (index < length) {
      const ch = text[index];
      if (ch === '\\') {
        raw += text.slice(index, index + 2);
        index += 2;
        continue;
      }
      if (ch === '"') {
        index += 1;
        return { value: JSON.parse(`"${raw}"`), start, end: index };
      }
      raw += ch;
      index += 1;
    }
    fail('unterminated string');
    return null;
  }

  function parseValue() {
    skipWhitespace();
    const start = index;
    const ch = text[index];
    if (ch === '{') return parseObject();
    if (ch === '[') return parseArray();
    if (ch === '"') {
      const parsed = parseString();
      return { type: 'string', start, end: index, value: parsed.value };
    }
    if (text.startsWith('true', index)) {
      index += 4;
      return { type: 'boolean', start, end: index, value: true };
    }
    if (text.startsWith('false', index)) {
      index += 5;
      return { type: 'boolean', start, end: index, value: false };
    }
    if (text.startsWith('null', index)) {
      index += 4;
      return { type: 'null', start, end: index, value: null };
    }
    const match = /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/.exec(text.slice(index));
    if (!match) fail('expected a value');
    index += match[0].length;
    return { type: 'number', start, end: index, value: Number(match[0]) };
  }

  function parseObject() {
    const start = index;
    index += 1;
    const members = [];
    skipWhitespace();
    if (text[index] === '}') {
      index += 1;
      return { type: 'object', start, end: index, members };
    }
    while (true) {
      skipWhitespace();
      const keyStart = index;
      const key = parseString().value;
      skipWhitespace();
      if (text[index] !== ':') fail('expected ":"');
      index += 1;
      const value = parseValue();
      members.push({ key, keyStart, value });
      skipWhitespace();
      if (text[index] === ',') {
        index += 1;
        continue;
      }
      if (text[index] === '}') {
        index += 1;
        break;
      }
      fail('expected "," or "}"');
    }
    return { type: 'object', start, end: index, members };
  }

  function parseArray() {
    const start = index;
    index += 1;
    const items = [];
    skipWhitespace();
    if (text[index] === ']') {
      index += 1;
      return { type: 'array', start, end: index, items };
    }
    while (true) {
      const value = parseValue();
      items.push(value);
      skipWhitespace();
      if (text[index] === ',') {
        index += 1;
        continue;
      }
      if (text[index] === ']') {
        index += 1;
        break;
      }
      fail('expected "," or "]"');
    }
    return { type: 'array', start, end: index, items };
  }

  const root = parseValue();
  skipWhitespace();
  if (index !== length) fail('trailing content after the document');
  return root;
}

/**
 * Find the node at a key path in a parsed document.
 * @param {object} root Root node from parseJsonSource.
 * @param {Array<string|number>} keys Object keys and array indexes.
 * @returns {object} The node at that path.
 */
function nodeAtPath(root, keys) {
  let node = root;
  for (const key of keys) {
    if (node.type === 'object') {
      const member = node.members.find((entry) => entry.key === key);
      if (!member) throw new Error(`missing key "${keys.join('.')}"`);
      node = member.value;
    } else if (node.type === 'array') {
      const item = node.items[key];
      if (!item) throw new Error(`missing index ${key} on "${keys.join('.')}"`);
      node = item;
    } else {
      throw new Error(`cannot descend into a ${node.type} at "${keys.join('.')}"`);
    }
  }
  return node;
}

function indentBefore(text, offset) {
  const lineStart = text.lastIndexOf('\n', offset - 1) + 1;
  let cursor = lineStart;
  while (cursor < offset && (text[cursor] === ' ' || text[cursor] === '\t')) cursor += 1;
  return cursor === offset ? text.slice(lineStart, cursor) : null;
}

function isPrimitive(value) {
  return value === null || typeof value !== 'object';
}

/**
 * Serialises a value the way the surrounding document is written: objects and
 * object arrays on their own lines, and short string arrays either inline or
 * expanded according to the document's own habit.
 * @param {*} value Value to serialise.
 * @param {string} indent Indent of the line the value starts on.
 * @param {{primitiveArrays?: string}} style Entry-set style.
 * @returns {string} The serialised text.
 */
function serializeValue(value, indent, style) {
  if (isPrimitive(value)) return JSON.stringify(value);
  const inner = indent + '  ';
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    const isInline = style.primitiveArrays !== 'multiline' && value.every(isPrimitive);
    if (isInline) return `[${value.map((item) => JSON.stringify(item)).join(', ')}]`;
    return `[\n${value.map((item) => inner + serializeValue(item, inner, style)).join(',\n')}\n${indent}]`;
  }
  const keys = Object.keys(value);
  if (keys.length === 0) return '{}';
  const members = keys.map((key) => `${inner}${JSON.stringify(key)}: ${serializeValue(value[key], inner, style)}`);
  return `{\n${members.join(',\n')}\n${indent}}`;
}

function deepEqual(left, right) {
  if (isPrimitive(left) || isPrimitive(right)) return left === right;
  if (Array.isArray(left) !== Array.isArray(right)) return false;
  if (Array.isArray(left)) {
    if (left.length !== right.length) return false;
    return left.every((item, index) => deepEqual(item, right[index]));
  }
  const leftKeys = Object.keys(left).sort();
  const rightKeys = Object.keys(right).sort();
  if (leftKeys.length !== rightKeys.length) return false;
  if (!leftKeys.every((key, index) => key === rightKeys[index])) return false;
  return leftKeys.every((key) => deepEqual(left[key], right[key]));
}

function findMember(node, key) {
  return node.members.find((member) => member.key === key);
}

function matchIndex(arrayNode, match, identityKey) {
  const wanted = match[identityKey];
  const found = [];
  arrayNode.items.forEach((item, index) => {
    if (item.type !== 'object') return;
    const member = findMember(item, identityKey);
    if (member && member.value.value === wanted) found.push(index);
  });
  if (found.length > 1) throw new Error(`anchor "${wanted}" appears ${found.length} times`);
  return found.length === 1 ? found[0] : -1;
}

/**
 * The value that names a recorded item: the identity key's value for an object,
 * the value itself for a primitive.
 * @param {object} record One recorded added item.
 * @returns {*} The item's identity.
 */
function recordIdentity(record) {
  const identityKey = record.identityKey === undefined ? null : record.identityKey;
  if (identityKey === null || isPrimitive(record.item)) return record.item;
  return record.item[identityKey];
}

/**
 * Whether a recorded item and an item an entry set lists are the same array
 * entry, so a re-apply recognises its own work and never an upstream item.
 * @param {object} record One recorded added item.
 * @param {Array<string|number>} path Array the entry set writes.
 * @param {string} [identityKey] Key naming an object item; absent when the value is the identity.
 * @param {*} item Item the entry set lists.
 * @returns {boolean} Whether the two describe the same entry.
 */
function isRecordedItem(record, path, identityKey, item) {
  if (!record || !deepEqual(record.path, path)) return false;
  const recordedKey = record.identityKey === undefined ? null : record.identityKey;
  const key = identityKey === undefined ? null : identityKey;
  if (recordedKey !== key) return false;
  if (key === null) return deepEqual(record.item, item);
  if (isPrimitive(record.item) || isPrimitive(item)) return false;
  return record.item[key] === item[key];
}

/**
 * Whether a recorded key and a `setKeyOnItem` name the same key on the same
 * item. The item is named by its identity, never by its position.
 * @param {object} record One recorded key.
 * @param {object} operation One entry-set operation.
 * @returns {boolean} Whether the operation writes the recorded key.
 */
function isKeyRecordFor(record, operation) {
  return operation.op === 'setKeyOnItem' && Boolean(operation.match) && typeof operation.match === 'object' &&
    samePath(record.path, operation.path) && record.identityKey === operation.identityKey &&
    record.identity === operation.match[operation.identityKey] && record.key === operation.key;
}

/**
 * Applies one operation to the parsed document and records the text edit that
 * realises it. Nothing is written here; the caller decides whether to keep it.
 * @param {object} operation One entry-set operation.
 * @param {object} root Root node of the parsed document.
 * @param {string} text Document text the nodes point into.
 * @param {object} style Entry-set style.
 * @param {object[]} edits Collects the text edits.
 * @param {{canReplaceExisting: boolean, recordedItems?: object[],
 *   onListed?: function, recordedSets?: object[], onSet?: function,
 *   recordedKeys?: object[], onKey?: function, onWarning?: function}} options
 *   Whether a differing entry may be rewritten, the items this overlay already
 *   added to the array, where each listed item is reported so a later pass can
 *   recognise it as the engine's own work, the sets this overlay applied last
 *   time, where each `set` or inserted object key is reported so a later pass
 *   can take it back, the same two for the keys a `setKeyOnItem` wrote, and
 *   where a warning about an anchor that matched nothing is reported.
 * @returns {string} 'changed' or 'unchanged'.
 */
function planOperation(operation, root, text, style, edits, options) {
  if (operation.op === 'set') {
    const parentPath = operation.path.slice(0, -1);
    const lastKey = operation.path[operation.path.length - 1];
    const parent = operation.path.length > 0 ? nodeAtPath(root, parentPath) : null;
    // Every set is reported, changed or not, so a value an older engine wrote is
    // recorded by the first apply that still names it. A key stays marked as
    // added for as long as the record says this overlay put it there.
    const reportSet = (added) => {
      if (!options.onSet) return;
      options.onSet({ path: [...operation.path], value: operation.value, added });
    };
    const wasAdded = (options.recordedSets || [])
      .some((record) => record.added === true && samePath(record.path, operation.path));
    // A key the object does not hold yet is added after its last member, so one
    // entry set fits the file before and after upstream starts shipping the key.
    if (parent && parent.type === 'object' && typeof lastKey === 'string' && !findMember(parent, lastKey)) {
      const reference = parent.members[parent.members.length - 1];
      if (!reference) throw new Error(`cannot insert into the empty object at ${parentPath.join('.')}`);
      const indent = indentBefore(text, reference.keyStart) || '';
      edits.push({
        start: reference.value.end,
        end: reference.value.end,
        text: `,\n${indent}${JSON.stringify(lastKey)}: ${serializeValue(operation.value, indent, style)}`,
      });
      reportSet(true);
      return 'changed';
    }
    const target = nodeAtPath(root, operation.path);
    const current = JSON.parse(text.slice(target.start, target.end));
    reportSet(wasAdded);
    if (deepEqual(current, operation.value)) return 'unchanged';
    const indent = indentBefore(text, target.start);
    edits.push({
      start: target.start,
      end: target.end,
      text: serializeValue(operation.value, indent === null ? '' : indent, style),
    });
    return 'changed';
  }

  if (operation.op === 'setKeyOnItem') {
    const arrayNode = nodeAtPath(root, operation.path);
    const index = matchIndex(arrayNode, operation.match, operation.identityKey);
    if (index < 0) throw new Error(`anchor ${describe(operation.match)} not found under ${operation.path.join('.')}`);
    const item = arrayNode.items[index];
    const member = findMember(item, operation.key);
    // Reported on every pass, like a `set`, so a value an older engine wrote is
    // recorded by the first apply that still names it, and a key stays marked as
    // added for as long as the record says this overlay put it there.
    const reportKey = (added) => {
      if (!options.onKey) return;
      options.onKey({
        path: [...operation.path],
        identityKey: operation.identityKey,
        identity: operation.match[operation.identityKey],
        key: operation.key,
        value: operation.value,
        added,
      });
    };
    if (member) {
      reportKey((options.recordedKeys || []).some((record) => record.added === true && isKeyRecordFor(record, operation)));
      const current = JSON.parse(text.slice(member.value.start, member.value.end));
      if (deepEqual(current, operation.value)) return 'unchanged';
      const indent = indentBefore(text, member.value.start);
      edits.push({
        start: member.value.start,
        end: member.value.end,
        text: serializeValue(operation.value, indent === null ? '' : indent, style),
      });
      return 'changed';
    }
    const last = item.members[item.members.length - 1];
    const indent = indentBefore(text, last.keyStart) || '';
    edits.push({
      start: last.value.end,
      end: last.value.end,
      text: `,\n${indent}${JSON.stringify(operation.key)}: ${serializeValue(operation.value, indent, style)}`,
    });
    reportKey(true);
    return 'changed';
  }

  if (operation.op === 'insertItems' || operation.op === 'appendItems') {
    const arrayNode = nodeAtPath(root, operation.path);
    const identityKey = operation.identityKey;
    const recordedItems = options.recordedItems || [];
    // Only an item this overlay put there is reported back as its own: an item
    // the live file already held and the state never recorded may be upstream's.
    const reportListed = (item) => {
      if (!options.onListed) return;
      options.onListed({
        path: [...operation.path],
        identityKey: identityKey === undefined ? null : identityKey,
        item,
      });
    };
    const wasRecorded = (item) => recordedItems
      .some((record) => isRecordedItem(record, operation.path, identityKey, item));
    // A missing anchor still falls back to the end of the array, so an entry set
    // that applied before keeps applying; the warning is what says the position
    // it asked for is gone. It is checked on every pass, not only when an item
    // is pending, so it does not go quiet once the items are in place.
    if (operation.before && options.onWarning) {
      let isAnchorMissing = false;
      try {
        isAnchorMissing = Boolean(identityKey) && matchIndex(arrayNode, operation.before, identityKey) < 0;
      } catch (error) {
        // A duplicated anchor is refused below once an item needs it.
      }
      if (!identityKey) {
        options.onWarning(`${operation.op} at ${pathLabel(operation.path)} names a before anchor but no identityKey, ` +
          'so the anchor is ignored and its items go at the end of the array; add an identityKey');
      } else if (isAnchorMissing) {
        options.onWarning(`${operation.op} before ${describe(operation.before[identityKey])} at ${pathLabel(operation.path)} ` +
          'finds no such item, so its items go at the end of the array; point before at an item the file holds');
      }
    }
    const pending = [];
    let hasChanged = false;
    for (const item of operation.items) {
      if (!identityKey) {
        // A scalar list carries its own identity, so an existing value counts as
        // already applied. Without this, a second apply would append a duplicate.
        if (isPrimitive(item) && arrayNode.items.some((node) => node.value === item)) {
          if (wasRecorded(item)) reportListed(item);
          continue;
        }
        if (!isPrimitive(item)) throw new Error('an item list without an identity key cannot hold objects');
      }
      if (identityKey) {
        const existing = matchIndex(arrayNode, item, identityKey);
        if (existing >= 0) {
          const node = arrayNode.items[existing];
          const parsed = JSON.parse(text.slice(node.start, node.end));
          if (!deepEqual(parsed, item)) {
            // A differing entry is rewritten only when the live file still holds the
            // bytes this overlay last wrote: the entry set is then the one thing that
            // changed, so replacing the entry in place keeps every other line of the
            // document as it was. Any other difference may be someone's hand edit.
            if (!options.canReplaceExisting) {
              throw new Error(`existing entry ${describe(item[identityKey])} differs from the canonical copy`);
            }
            const indent = indentBefore(text, node.start);
            edits.push({
              start: node.start,
              end: node.end,
              text: serializeValue(item, indent === null ? '' : indent, style),
            });
            hasChanged = true;
          }
          if (wasRecorded(item)) reportListed(item);
          continue;
        }
      }
      pending.push(item);
      reportListed(item);
      hasChanged = true;
    }
    if (!hasChanged) return 'unchanged';
    // A pass that only rewrote existing entries has nothing left to append.
    if (pending.length === 0) return 'changed';
    const anchor = operation.before && identityKey ? matchIndex(arrayNode, operation.before, identityKey) : -1;
    const reference = anchor >= 0 ? arrayNode.items[anchor] : arrayNode.items[arrayNode.items.length - 1];
    if (!reference) throw new Error(`cannot append to the empty array at ${operation.path.join('.')}`);
    const indent = indentBefore(text, reference.start) || '';
    if (anchor >= 0) {
      const block = pending.map((item) => `${serializeValue(item, indent, style)},\n${indent}`).join('');
      edits.push({ start: reference.start, end: reference.start, text: block });
    } else {
      const block = pending.map((item) => `,\n${indent}${serializeValue(item, indent, style)}`).join('');
      edits.push({ start: reference.end, end: reference.end, text: block });
    }
    return 'changed';
  }

  if (operation.op === 'insertObjectKeys') {
    const objectNode = nodeAtPath(root, operation.path);
    if (operation.beforeKey && options.onWarning && !findMember(objectNode, operation.beforeKey)) {
      options.onWarning(`insertObjectKeys before ${describe(operation.beforeKey)} at ${pathLabel(operation.path)} ` +
        'finds no such key, so its keys go at the end of the object; point beforeKey at a key the file holds');
    }
    const pending = [];
    let hasRewritten = false;
    // Each inserted key is recorded the way a `set` on its path is, so a key the
    // entry set drops returns to the pin's value or leaves the file.
    const reportEntry = (entry, added) => {
      if (!options.onSet) return;
      options.onSet({ path: [...operation.path, entry.key], value: entry.value, added });
    };
    const wasAdded = (entry) => (options.recordedSets || [])
      .some((record) => record.added === true && samePath(record.path, [...operation.path, entry.key]));
    for (const entry of operation.entries) {
      const existing = findMember(objectNode, entry.key);
      reportEntry(entry, existing ? wasAdded(entry) : true);
      if (existing) {
        const parsed = JSON.parse(text.slice(existing.value.start, existing.value.end));
        if (!deepEqual(parsed, entry.value)) {
          // Same rule as a keyed array item: rewrite the value in place only while the
          // live file still holds this overlay's last applied bytes.
          if (!options.canReplaceExisting) {
            throw new Error(`existing entry "${entry.key}" differs from the canonical copy`);
          }
          const indent = indentBefore(text, existing.keyStart);
          edits.push({
            start: existing.value.start,
            end: existing.value.end,
            text: serializeValue(entry.value, indent === null ? '' : indent, style),
          });
          hasRewritten = true;
        }
        continue;
      }
      pending.push(entry);
    }
    if (pending.length === 0) return hasRewritten ? 'changed' : 'unchanged';
    const anchor = operation.beforeKey ? findMember(objectNode, operation.beforeKey) : null;
    const reference = anchor || objectNode.members[objectNode.members.length - 1];
    if (!reference) throw new Error(`cannot insert into the empty object at ${operation.path.join('.')}`);
    const indent = indentBefore(text, reference.keyStart) || '';
    const render = (entry) => `${JSON.stringify(entry.key)}: ${serializeValue(entry.value, indent, style)}`;
    if (anchor) {
      edits.push({
        start: reference.keyStart,
        end: reference.keyStart,
        text: `${pending.map((entry) => `${render(entry)},\n${indent}`).join('')}`,
      });
    } else {
      edits.push({
        start: reference.value.end,
        end: reference.value.end,
        text: pending.map((entry) => `,\n${indent}${render(entry)}`).join(''),
      });
    }
    return 'changed';
  }

  throw new Error(`unknown operation "${operation.op}"`);
}

function applyEdits(text, edits) {
  const ordered = [...edits].sort((left, right) => right.start - left.start);
  let output = text;
  for (const edit of ordered) {
    output = output.slice(0, edit.start) + edit.text + output.slice(edit.end);
  }
  return output;
}

/**
 * Fold each later setKeyOnItem into the item an earlier insert in the same set
 * adds. Without this, a second apply compares the live item, which already
 * carries the later key, with the bare inserted item and reads a hand edit.
 * @param {object[]} operations Operations of one entry set, in order.
 * @returns {object[]} Operations whose inserted items carry their final keys.
 */
function withLaterKeysMerged(operations) {
  return operations.map((operation, index) => {
    if ((operation.op !== 'insertItems' && operation.op !== 'appendItems') || !operation.identityKey) return operation;
    const identityKey = operation.identityKey;
    const items = operation.items.map((item) => {
      let merged = item;
      for (const later of operations.slice(index + 1)) {
        if (later.op !== 'setKeyOnItem' || later.identityKey !== identityKey) continue;
        if (!deepEqual(later.path, operation.path) || later.match[identityKey] !== item[identityKey]) continue;
        merged = { ...merged, [later.key]: later.value };
      }
      return merged;
    });
    return { ...operation, items };
  });
}

/**
 * Read the array a recorded item was added to.
 * @param {object} root Root node of a parsed document.
 * @param {Array<string|number>} path Array path the item was added at.
 * @returns {object|null} The array node, or null when the path holds no array now.
 */
function recordedArrayAt(root, path) {
  let node;
  try {
    node = nodeAtPath(root, path);
  } catch (error) {
    return null;
  }
  return node.type === 'array' ? node : null;
}

/**
 * Find the live entry that carries a recorded item's identity, so an item whose
 * identity was changed by hand is left alone rather than deleted by mistake.
 * @param {object} arrayNode Parsed array node.
 * @param {object} record One recorded added item.
 * @returns {number} Index of the entry, or -1 when the array does not hold it.
 */
function findRecordedIndex(arrayNode, record) {
  const identityKey = record.identityKey === undefined ? null : record.identityKey;
  const wanted = recordIdentity(record);
  return arrayNode.items.findIndex((node) => {
    if (identityKey !== null) {
      if (node.type !== 'object') return false;
      const member = findMember(node, identityKey);
      return Boolean(member) && member.value.value === wanted;
    }
    if (node.type === 'object' || node.type === 'array') return false;
    return node.value === wanted;
  });
}

/**
 * The edit that deletes one array item together with the comma that separated
 * it, so the document stays valid JSON and keeps no dangling separator.
 * @param {object[]} items Parsed items of the array.
 * @param {number} index Item to delete.
 * @returns {{start: number, end: number, text: string}} The text edit.
 */
function removalEdit(items, index) {
  if (index > 0) return { start: items[index - 1].end, end: items[index].end, text: '' };
  if (items.length > 1) return { start: items[index].start, end: items[1].start, text: '' };
  return { start: items[index].start, end: items[index].end, text: '' };
}

/**
 * Whether an entry set still lists a recorded item.
 * @param {object} operation One entry-set operation.
 * @param {object} record One recorded added item.
 * @returns {boolean} Whether the operation re-lists the item.
 */
function listsRecordedItem(operation, record) {
  if (operation.op !== 'insertItems' && operation.op !== 'appendItems') return false;
  return operation.items.some((item) => isRecordedItem(record, operation.path, operation.identityKey, item));
}

/**
 * Whether the pinned upstream copy already carries a recorded item at the same
 * path, which makes retracting that item a deletion of upstream's own line
 * rather than of this overlay's addition.
 * @param {string|null} upstreamText The destination at the pin, or null when no
 *   upstream copy could be read.
 * @param {object} record One recorded added item.
 * @returns {boolean} Whether upstream's array at that path holds the same item.
 */
function upstreamShipsRecordedItem(upstreamText, record) {
  if (upstreamText === null) return false;
  let arrayNode;
  try {
    arrayNode = recordedArrayAt(parseJsonSource(upstreamText), record.path);
  } catch (error) {
    // An upstream copy that does not parse says nothing about the item, so the
    // record is retracted as it always was.
    return false;
  }
  if (!arrayNode) return false;
  const index = findRecordedIndex(arrayNode, record);
  if (index < 0) return false;
  const node = arrayNode.items[index];
  return deepEqual(JSON.parse(upstreamText.slice(node.start, node.end)), record.item);
}

/**
 * Delete every item this overlay added that its entry set no longer lists, so a
 * dropped entry leaves the live file instead of staying behind as a line the
 * entry set never mentions. An item that changed after it was applied is
 * refused rather than deleted: that edit belongs to a person, and the entry set
 * no longer describes what the item should be. An item upstream now ships is
 * left in place and only its record dropped, because the live line is then
 * upstream's and deleting it would remove upstream's own entry.
 * @param {string} text Live document text.
 * @param {object[]} operations Operations of one entry set, in order.
 * @param {object[]} recordedItems Items this overlay added to the destination.
 * @param {() => (string|null)} [readUpstreamText] Reads the destination as the
 *   pin holds it, or null when there is no upstream copy to read.
 * @returns {string} The text with every dropped item gone.
 */
function removeDroppedItems(text, operations, recordedItems, readUpstreamText = () => null) {
  let output = text;
  for (const record of recordedItems) {
    if (operations.some((operation) => listsRecordedItem(operation, record))) continue;
    // The array, or the item others kept in it, may be gone already: either way
    // nothing is left for this record to retract.
    const arrayNode = recordedArrayAt(parseJsonSource(output), record.path);
    if (!arrayNode) continue;
    const index = findRecordedIndex(arrayNode, record);
    if (index < 0) continue;
    const node = arrayNode.items[index];
    const live = JSON.parse(output.slice(node.start, node.end));
    if (!deepEqual(live, record.item)) {
      throw new Error('dropped entry ' + describe(recordIdentity(record)) +
        ' was edited after it was applied; remove it by hand or restore it in the entry set');
    }
    if (upstreamShipsRecordedItem(readUpstreamText(), record)) continue;
    output = applyEdits(output, [removalEdit(arrayNode.items, index)]);
  }
  return output;
}

/**
 * Read the node a recorded set wrote to.
 * @param {object} root Root node of a parsed document.
 * @param {Array<string|number>} path Path the set wrote.
 * @returns {object|null} The node, or null when the document holds nothing there.
 */
function recordedNodeAt(root, path) {
  try {
    return nodeAtPath(root, path);
  } catch (error) {
    return null;
  }
}

/**
 * The edit that deletes one object member together with the comma that
 * separated it, so the document keeps no dangling separator.
 * @param {object[]} members Parsed members of the object.
 * @param {number} index Member to delete.
 * @returns {{start: number, end: number, text: string}} The text edit.
 */
function memberRemovalEdit(members, index) {
  if (index > 0) return { start: members[index - 1].value.end, end: members[index].value.end, text: '' };
  if (members.length > 1) return { start: members[index].keyStart, end: members[1].keyStart, text: '' };
  return { start: members[index].keyStart, end: members[index].value.end, text: '' };
}

/**
 * The outermost array a recorded path goes through in one document. A path
 * step is an index when the node it steps into is an array, however the entry
 * set spelled the step, so the document decides and not the step's type.
 * @param {object} root Root node of a parsed document.
 * @param {Array<string|number>} path Path the set wrote.
 * @returns {{node: object, path: Array<string|number>}|null} The array node
 *   and the path that reaches it, or null when the path meets no array.
 */
function arrayOnPath(root, path) {
  for (let depth = 0; depth < path.length; depth += 1) {
    const container = recordedNodeAt(root, path.slice(0, depth));
    if (!container) return null;
    if (container.type === 'array') return { node: container, path: path.slice(0, depth) };
  }
  return null;
}

/**
 * Whether two paths name one location. A step into an array may be spelled as
 * a number or as a string, and both spellings reach the same item.
 * @param {Array<string|number>} left One path.
 * @param {Array<string|number>} right The other path.
 * @returns {boolean} Whether the steps read the same once each is a string.
 */
function samePath(left, right) {
  return left.length === right.length && left.every((step, index) => String(step) === String(right[index]));
}

/**
 * Whether a path sits strictly inside another one.
 * @param {Array<string|number>} inner The path that may sit inside.
 * @param {Array<string|number>} outer The path that may hold it.
 * @returns {boolean} Whether `inner` starts with every step of `outer` and goes further.
 */
function isInsidePath(inner, outer) {
  return inner.length > outer.length && samePath(inner.slice(0, outer.length), outer);
}

/**
 * A copy of a parsed value with one location changed. A location the value does
 * not reach is left alone, so a missing step never invents structure.
 * @param {*} value Parsed JSON value.
 * @param {Array<string|number>} steps Location inside the value.
 * @param {(container: object, step: string|number) => void} change Edits the
 *   container that holds the location.
 * @returns {*} The changed copy.
 */
function changedAt(value, steps, change) {
  const copy = value === undefined ? undefined : JSON.parse(JSON.stringify(value));
  let container = copy;
  for (const step of steps.slice(0, -1)) {
    if (container === null || typeof container !== 'object' || !(step in container)) return copy;
    container = container[step];
  }
  if (container === null || typeof container !== 'object') return copy;
  change(container, steps[steps.length - 1]);
  return copy;
}

/**
 * A copy of a parsed value with every listed location blanked out, so two
 * values can be compared on what is left. A location at the value itself
 * blanks the whole value.
 * @param {*} value Parsed JSON value.
 * @param {Array<Array<string|number>>} locations Locations inside the value.
 * @returns {*} The masked copy.
 */
function maskedValue(value, locations) {
  if (locations.some((steps) => steps.length === 0)) return null;
  return locations.reduce((masked, steps) => changedAt(masked, steps, (container, step) => {
    if (!Array.isArray(container)) delete container[step];
    else if (step in container) container[step] = null;
  }), value);
}

/**
 * Keep one record per path, the last one written. A state file from an engine
 * that recorded every `set` can hold two for one path, and only the last value
 * is the one the live file carries.
 * @param {object[]} records Recorded sets of one destination.
 * @returns {object[]} The records with earlier duplicates of a path left out.
 */
function lastRecordPerPath(records) {
  return records.filter((record, index) =>
    !records.slice(index + 1).some((later) => samePath(later.path, record.path)));
}

/**
 * Whether every array index on a recorded path names the same item in the live
 * file and in the pinned copy. An index is a position, so it is trusted only
 * while the two arrays hold the same number of items, this overlay neither
 * added an item to that array nor is about to, and the item at that index is
 * the pin's item apart from the values this overlay's operations wrote into it.
 * Equal lengths alone miss a file left on an older base after upstream swapped
 * or replaced an item. A set that wrote the whole item leaves nothing of it to
 * recognize, so then every other item of the array must be the pin's.
 * @param {{text: string, root: object}} liveDocument The live text and its root node.
 * @param {{text: string, root: object}} pinnedDocument The pinned text and its root node.
 * @param {Array<string|number>} path Path the set wrote.
 * @param {object[]} operations Operations of one entry set, in order.
 * @param {object[]} recordedSets Sets this overlay applied to the destination.
 * @param {object[]} recordedItems Items this overlay added to the destination.
 * @returns {boolean} Whether the path's indexes can be read against the pin.
 */
function indexesMatchPin(liveDocument, pinnedDocument, path, operations, recordedSets, recordedItems) {
  const writtenPaths = [
    ...recordedSets.map((record) => record.path),
    ...operations.filter((operation) => operation.op === 'set').map((operation) => operation.path),
  ];
  const readItem = (document, item) => JSON.parse(document.text.slice(item.start, item.end));
  // Every location inside one item that this overlay writes, relative to the item.
  const writtenInside = (itemPath) => {
    const inside = (written) => samePath(written, itemPath) || isInsidePath(written, itemPath);
    const relative = (written) => written.slice(itemPath.length);
    const locations = writtenPaths.filter(inside).map(relative);
    // A set on a path above the item wrote the whole item.
    if (writtenPaths.some((written) => isInsidePath(itemPath, written))) locations.push([]);
    for (const operation of operations) {
      if (operation.op === 'setKeyOnItem' && samePath(operation.path, itemPath.slice(0, -1))) {
        locations.push([operation.key]);
      } else if (operation.op === 'insertObjectKeys' && inside(operation.path)) {
        for (const entry of operation.entries || []) locations.push([...relative(operation.path), entry.key]);
      } else if ((operation.op === 'insertItems' || operation.op === 'appendItems') && isInsidePath(operation.path, itemPath)) {
        locations.push(relative(operation.path));
      }
    }
    for (const item of recordedItems) if (item && isInsidePath(item.path, itemPath)) locations.push(relative(item.path));
    return locations;
  };
  for (let depth = 0; depth < path.length; depth += 1) {
    const container = path.slice(0, depth);
    const live = recordedNodeAt(liveDocument.root, container);
    const pinned = recordedNodeAt(pinnedDocument.root, container);
    const liveIsArray = Boolean(live) && live.type === 'array';
    const pinnedIsArray = Boolean(pinned) && pinned.type === 'array';
    if (!liveIsArray && !pinnedIsArray) continue;
    if (!liveIsArray || !pinnedIsArray) return false;
    if (live.items.length !== pinned.items.length) return false;
    if (recordedItems.some((item) => item && samePath(item.path, container))) return false;
    const addsItems = operations.some((operation) =>
      (operation.op === 'insertItems' || operation.op === 'appendItems') && samePath(operation.path, container));
    if (addsItems) return false;
    const maskedItems = (index) => {
      const written = writtenInside([...container, index]);
      return [
        maskedValue(readItem(liveDocument, live.items[index]), written),
        maskedValue(readItem(pinnedDocument, pinned.items[index]), written),
      ];
    };
    const itemMatches = (index) => deepEqual(...maskedItems(index));
    const index = Number(path[depth]);
    if (!live.items[index] || !pinned.items[index]) return false;
    if (!itemMatches(index)) return false;
    // Masks that leave nothing of either item mean the overlay wrote all of it,
    // whether in one set or in several, so the item itself proves nothing.
    const nothingLeft = (value) => value === null ||
      (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0);
    const wholeItemWritten = maskedItems(index).every(nothingLeft);
    if (wholeItemWritten && !live.items.every((item, other) => other === index || itemMatches(other))) return false;
  }
  return true;
}

/**
 * The values a dropped set may leave at its path when nothing else edited it.
 * The first is the recorded value with every set written inside it later laid
 * on top. An older engine kept records in first-write order, so the recorded
 * value alone, and the recorded value with every dropped set inside it laid on,
 * are values the overlay may have left there too. A set the entry set still
 * names is masked out of the comparison, because it writes its value again
 * after the restore.
 * @param {object} record The dropped record.
 * @param {object[]} records Every record of the destination, in the order written.
 * @param {Array<Array<string|number>>} keptPaths Paths the entry set still sets.
 * @returns {{candidates: Array<*>, masks: Array<Array<string|number>>}} The
 *   values to compare with, and the locations to leave out of the comparison.
 */
function valueLeftBySets(record, records, keptPaths) {
  const droppedInside = records.filter((other) => isInsidePath(other.path, record.path) &&
    !keptPaths.some((kept) => samePath(kept, other.path)));
  const later = records.slice(records.indexOf(record) + 1);
  const layOn = (inner) => inner.reduce((laid, other) => changedAt(laid, other.path.slice(record.path.length),
    (container, step) => {
      container[step] = other.value;
    }), record.value);
  const candidates = [layOn(droppedInside.filter((other) => later.includes(other))), record.value, layOn(droppedInside)];
  const masks = keptPaths
    .filter((kept) => isInsidePath(kept, record.path))
    .map((kept) => kept.slice(record.path.length));
  return { candidates, masks };
}

/**
 * Return every value a `set` wrote to what the pin holds once the entry set no
 * longer names its path, so a dropped `set` leaves the live file instead of
 * staying behind as a value nothing explains. A key the pin does not hold is
 * deleted while it still carries the recorded value. A value that changed after
 * it was applied is refused rather than overwritten: that edit belongs to a
 * person. Without a readable pinned copy there is no value to return to, so the
 * overlay is refused rather than given a guess. The same holds for a path
 * through an array whose items no longer line up with the pin's.
 * @param {string} text Live document text.
 * @param {object[]} operations Operations of one entry set, in order.
 * @param {object[]} recordedSets Sets this overlay applied to the destination.
 * @param {() => (string|null)} [readUpstreamText] Reads the destination as the
 *   pin holds it, or null when there is no upstream copy to read.
 * @param {object[]} [recordedItems] Items this overlay added to the destination.
 * @returns {string} The text with every dropped set taken back.
 */
function restoreDroppedSets(text, operations, recordedSets, readUpstreamText = () => null, recordedItems = []) {
  let output = text;
  const records = lastRecordPerPath(recordedSets);
  // An inserted object key is recorded as a set on its own path, so it is kept
  // while either operation still names that path.
  const keptPaths = operations.flatMap((operation) => {
    if (operation.op === 'set') return [operation.path];
    if (operation.op === 'insertObjectKeys') return (operation.entries || []).map((entry) => [...operation.path, entry.key]);
    return [];
  });
  const dropped = records.filter((record) => !keptPaths.some((kept) => samePath(kept, record.path)));
  // An outer value is taken back before a value written inside it. Once the
  // outer value is the pin's, the inner one reads as the pin's too, so two
  // nested sets dropped together both leave.
  const outerFirst = [...dropped].sort((left, right) => left.path.length - right.path.length);
  for (const record of outerFirst) {
    const where = record.path.join('.');
    const root = parseJsonSource(output);
    // The key, or the object that held it, may be gone already: nothing is left
    // for this record to take back. Through an array that reading waits for the
    // index check below, because a removed item moves every index after it and
    // the value may sit one place along.
    const node = recordedNodeAt(root, record.path);
    const liveArray = arrayOnPath(root, record.path);
    if (!node && !liveArray) continue;
    const upstreamText = readUpstreamText();
    if (upstreamText === null) {
      throw new Error('cannot restore the dropped set at ' + where + ': the pinned copy of the file cannot be read; ' +
        "name the upstream checkout in the manifest's pin.checkout, or put the file back to the pin's bytes by hand");
    }
    let upstreamRoot;
    try {
      upstreamRoot = parseJsonSource(upstreamText);
    } catch (error) {
      throw new Error('cannot restore the dropped set at ' + where + ': the pinned copy of the file is not valid JSON');
    }
    const pinnedArray = arrayOnPath(upstreamRoot, record.path);
    // An array that reads the same as the pin's holds nothing this overlay
    // wrote, so the record has nothing left to take back. This is also how a
    // refusal below clears once the array was put right by hand.
    if (liveArray && pinnedArray && deepEqual(
      JSON.parse(output.slice(liveArray.node.start, liveArray.node.end)),
      JSON.parse(upstreamText.slice(pinnedArray.node.start, pinnedArray.node.end)),
    )) continue;
    if (!indexesMatchPin({ text: output, root }, { text: upstreamText, root: upstreamRoot },
      record.path, operations, records, recordedItems)) {
      const arrayPath = (liveArray || pinnedArray).path;
      throw new Error('cannot restore the dropped set at ' + where +
        ': its path goes through an array whose items differ from the pinned copy; put the array at ' +
        (arrayPath.length > 0 ? arrayPath.join('.') : 'the top level') + ' back to the pinned copy by hand and run apply');
    }
    // The arrays line up, so a key that is missing is gone and not one place along.
    if (!node) continue;
    const pinned = recordedNodeAt(upstreamRoot, record.path);
    const live = JSON.parse(output.slice(node.start, node.end));
    // A live value that already equals the pin's needs no write.
    if (pinned && deepEqual(live, JSON.parse(upstreamText.slice(pinned.start, pinned.end)))) continue;
    const { candidates, masks } = valueLeftBySets(record, records, keptPaths);
    if (!candidates.some((candidate) => deepEqual(maskedValue(live, masks), maskedValue(candidate, masks)))) {
      throw new Error('dropped set at ' + where +
        ' was edited after it was applied; restore the value by hand or put the set back in the entry set');
    }
    if (pinned) {
      // The pin's own text is written back, so the file returns to upstream's bytes.
      output = applyEdits(output, [{ start: node.start, end: node.end, text: upstreamText.slice(pinned.start, pinned.end) }]);
      continue;
    }
    const parent = recordedNodeAt(root, record.path.slice(0, -1));
    const index = parent && parent.type === 'object'
      ? parent.members.findIndex((member) => member.key === record.path[record.path.length - 1])
      : -1;
    if (index < 0) {
      throw new Error('cannot restore the dropped set at ' + where + ': the pinned copy holds no value there');
    }
    // The pin does not hold the key, so the restore would delete it. Only a key
    // the record says this overlay added is deleted: a key that was already
    // there when a set first named it may be a person's, and an older engine
    // never marked the keys it added, so such a key is left to a hand delete.
    if (record.added !== true) {
      throw new Error('dropped set at ' + where + ': the pin holds no value there and the record does not show ' +
        'that this overlay added the key; delete the key by hand or put the set back in the entry set');
    }
    output = applyEdits(output, [memberRemovalEdit(parent.members, index)]);
  }
  return output;
}

/**
 * Return every key a `setKeyOnItem` wrote to what the pin holds once the entry
 * set no longer names it, the way a dropped `set` returns. The item is found by
 * its identity in the live file and in the pin, so an item that moved is still
 * the same item. A value that changed after it was applied is refused rather
 * than overwritten. A key the pin does not hold is deleted only while the
 * record shows this overlay added it. Without a readable pinned copy there is
 * no value to return to, so the overlay is refused rather than given a guess.
 * @param {string} text Live document text.
 * @param {object[]} operations Operations of one entry set, in order.
 * @param {object[]} recordedKeys Keys this overlay wrote on items of the destination.
 * @param {() => (string|null)} [readUpstreamText] Reads the destination as the
 *   pin holds it, or null when there is no upstream copy to read.
 * @returns {string} The text with every dropped key taken back.
 */
function restoreDroppedKeys(text, operations, recordedKeys, readUpstreamText = () => null) {
  let output = text;
  for (const record of recordedKeys) {
    if (operations.some((operation) => isKeyRecordFor(record, operation))) continue;
    // An item an insert in this entry set still lists is the overlay's own, and
    // that insert writes the whole item again, so the key leaves with it.
    const isListedItem = operations.some((operation) =>
      (operation.op === 'insertItems' || operation.op === 'appendItems') &&
      operation.identityKey === record.identityKey && samePath(operation.path, record.path) &&
      operation.items.some((item) => item && typeof item === 'object' && item[record.identityKey] === record.identity));
    if (isListedItem) continue;
    const shown = typeof record.identity === 'string' ? record.identity : describe(record.identity);
    const where = `setKeyOnItem of ${record.key} on the item matching ${record.identityKey}=${shown} at ${pathLabel(record.path)}`;
    const wanted = { [record.identityKey]: record.identity };
    // The array, the item or the key may be gone already: nothing is left for
    // this record to take back.
    const arrayNode = recordedArrayAt(parseJsonSource(output), record.path);
    if (!arrayNode) continue;
    const index = matchIndex(arrayNode, wanted, record.identityKey);
    if (index < 0) continue;
    const item = arrayNode.items[index];
    const memberIndex = item.members.findIndex((member) => member.key === record.key);
    if (memberIndex < 0) continue;
    const member = item.members[memberIndex];
    const live = JSON.parse(output.slice(member.value.start, member.value.end));
    const upstreamText = readUpstreamText();
    let pinnedValueText = null;
    if (upstreamText !== null) {
      let pinnedArray;
      try {
        pinnedArray = recordedArrayAt(parseJsonSource(upstreamText), record.path);
      } catch (error) {
        throw new Error('cannot restore the dropped ' + where + ': the pinned copy of the file is not valid JSON');
      }
      const pinnedIndex = pinnedArray ? matchIndex(pinnedArray, wanted, record.identityKey) : -1;
      const pinnedMember = pinnedIndex >= 0 ? findMember(pinnedArray.items[pinnedIndex], record.key) : null;
      if (pinnedMember) pinnedValueText = upstreamText.slice(pinnedMember.value.start, pinnedMember.value.end);
    }
    // A live value that already equals the pin's needs no write.
    if (pinnedValueText !== null && deepEqual(live, JSON.parse(pinnedValueText))) continue;
    if (!deepEqual(live, record.value)) {
      throw new Error('dropped ' + where + ' was edited after it was applied; ' +
        'restore the value by hand or put the operation back in the entry set');
    }
    if (upstreamText === null) {
      throw new Error('cannot restore the dropped ' + where + ': the pinned copy of the file cannot be read; ' +
        "name the upstream checkout in the manifest's pin.checkout, or put the file back to the pin's bytes by hand");
    }
    if (pinnedValueText !== null) {
      output = applyEdits(output, [{ start: member.value.start, end: member.value.end, text: pinnedValueText }]);
      continue;
    }
    if (record.added !== true) {
      throw new Error('dropped ' + where + ': the pin holds no value there and the record does not show ' +
        'that this overlay added the key; delete the key by hand or put the operation back in the entry set');
    }
    output = applyEdits(output, [memberRemovalEdit(item.members, memberIndex)]);
  }
  return output;
}

/**
 * Return the document text with every declared entry in place, and with the
 * items the entry set no longer lists gone.
 * @param {string} text Live document text.
 * @param {{style?: object, operations: object[]}} spec Entry set.
 * @param {{canReplaceExisting: boolean, recordedItems?: object[],
 *   onListed?: function, recordedSets?: object[], onSet?: function,
 *   recordedKeys?: object[], onKey?: function, onWarning?: function,
 *   readUpstreamText?: () => (string|null)}} options Whether a differing entry
 *   may be rewritten, the items this overlay added to the file last time, where
 *   a listed item is reported, the sets it applied last time, where an applied
 *   set is reported, the same two for `setKeyOnItem` keys, where an anchor
 *   warning is reported, and how the destination reads in the pinned upstream copy.
 * @returns {string} The edited document text.
 */
function applyJsonOperations(text, spec, options) {
  const style = spec.style || { indent: 2, primitiveArrays: 'inline' };
  const operations = withLaterKeysMerged(spec.operations);
  // A dropped entry is retracted before the entry set runs, so every operation
  // addresses the array the set describes rather than the one it left behind.
  let output = removeDroppedItems(text, operations, options.recordedItems || [], options.readUpstreamText);
  // A dropped set is taken back first for the same reason.
  output = restoreDroppedSets(output, operations, options.recordedSets || [], options.readUpstreamText,
    options.recordedItems || []);
  // A dropped setKeyOnItem is taken back first as well.
  output = restoreDroppedKeys(output, operations, options.recordedKeys || [], options.readUpstreamText);
  // Each operation sees the document the operations before it produced, so a
  // later operation can address an item an earlier one in the same set added.
  for (const operation of operations) {
    const edits = [];
    planOperation(operation, parseJsonSource(output), output, style, edits, options);
    if (edits.length > 0) output = applyEdits(output, edits);
  }
  if (output === text) return text;
  // Guard the writer: a text edit that produced unparseable JSON must never be
  // written, because the failure would surface later as a routing break.
  JSON.parse(output);
  return output;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. PLANS
//
// A plan is a list of file writes and deletions for one overlay, computed
// against the tree on disk. Nothing is written while planning, so status and
// apply share one definition of "what this overlay should look like".
// ─────────────────────────────────────────────────────────────────────────────

function acceptedHashFor(acceptedSha256, destination) {
  if (acceptedSha256 instanceof Map) return acceptedSha256.get(destination);
  if (!acceptedSha256 || typeof acceptedSha256 !== 'object') return undefined;
  return acceptedSha256[destination];
}

/**
 * Plan a whole-file overlay, guarded by its pin when it has one.
 * @param {object} entry Manifest overlay entry.
 * @param {object} ctx Engine context.
 * @param {string[]} problems Collects reasons the overlay cannot be applied.
 * @param {Record<string, string>} [acceptedSha256] Hashes the engine last applied.
 * @returns {{writes: object[], deletes: string[], outputs: object[]}}
 */
function planFileOverlay(entry, ctx, problems, acceptedSha256) {
  const sourcePath = path.join(ctx.overlayRoot, entry.source);
  const destinationPath = path.join(ctx.root, entry.destination);
  const desired = readBufferOrNull(sourcePath);
  if (!desired) {
    problems.push(`canonical copy is missing: ${entry.source}`);
    return { writes: [], deletes: [], outputs: [] };
  }
  const output = { filePath: destinationPath, buffer: desired, mode: entry.mode, sourcePath };
  const current = readBufferOrNull(destinationPath);
  if (!current) {
    if (entry.pinnedSha256 && acceptedHashFor(acceptedSha256, entry.destination) === undefined) {
      problems.push(`upstream removed ${entry.destination}; rebase the overlay`);
      return { writes: [], deletes: [], outputs: [] };
    }
    // Guarded paths need a recorded applied hash before restoration after removal.
    return { writes: [output], deletes: [], outputs: [output] };
  }
  if (Buffer.compare(current, desired) === 0) return { writes: [], deletes: [], outputs: [output] };
  if (!entry.pinnedSha256) {
    return { writes: [output], deletes: [], outputs: [output] };
  }
  const currentSha = sha256(current);
  if (currentSha === entry.pinnedSha256 || currentSha === acceptedHashFor(acceptedSha256, entry.destination)) {
    return { writes: [output], deletes: [], outputs: [output] };
  }
  problems.push(`upstream changed ${entry.destination}; rebase the overlay`);
  return { writes: [], deletes: [], outputs: [output] };
}

/**
 * Plan a folder mirrored from its overlay source.
 * @param {object} entry Manifest overlay entry.
 * @param {object} ctx Engine context.
 * @param {string[]} problems Collects reasons the overlay cannot be applied.
 * @param {Record<string, string>} [acceptedSha256] Hashes the engine last applied.
 * @returns {{writes: object[], deletes: string[], outputs: object[]}}
 */
function planDirectoryOverlay(entry, ctx, problems) {
  const sourceDir = path.join(ctx.overlayRoot, entry.source);
  const destinationDir = path.join(ctx.root, entry.destination);
  if (!isDirectory(sourceDir)) {
    problems.push(`canonical folder is missing: ${entry.source}`);
    return { writes: [], deletes: [] };
  }
  const desired = walkTree(sourceDir);
  const current = walkTree(destinationDir);
  const writes = [];
  const deletes = [];
  const outputs = [];
  for (const [rel, wanted] of desired) {
    const destinationPath = path.join(destinationDir, rel);
    const existing = current.get(rel);
    if (wanted.kind === 'symlink') {
      if (!existing || existing.kind !== 'symlink' || existing.target !== wanted.target) {
        writes.push({ filePath: destinationPath, symlinkTarget: wanted.target });
      }
      continue;
    }
    outputs.push({
      filePath: destinationPath,
      buffer: wanted.buffer,
      mode: wanted.mode,
      sourcePath: path.join(sourceDir, rel),
    });
    if (!existing || existing.kind !== 'file' || Buffer.compare(existing.buffer, wanted.buffer) !== 0) {
      writes.push(outputs[outputs.length - 1]);
    }
  }
  for (const rel of current.keys()) {
    if (!desired.has(rel)) {
      const destinationPath = path.join(destinationDir, rel);
      deletes.push(destinationPath);
      if (current.get(rel).kind === 'file') {
        // The overlay's copy is the whole folder, so a file it lacks is its own
        // delete while that file still holds upstream's bytes.
        outputs.push({
          filePath: destinationPath,
          buffer: null,
          sourcePath: path.join(sourceDir, rel),
          replacedSubtree: true,
        });
      }
    }
  }
  // Deepest first, so a removed folder is empty by the time its own delete runs.
  deletes.sort((left, right) => right.length - left.length);
  return { writes, deletes, outputs };
}

/**
 * Find where a marked block's `insertBefore` line starts.
 * The last whole-line match wins, so a heading quoted earlier in the file, such
 * as one in a table of contents, never captures the block.
 * @param {string} text File text to search.
 * @param {string} anchor The exact line the block goes before.
 * @param {number} [from=0] Only a line starting at or after this offset counts.
 * @returns {number} Offset of the anchor line, or -1 when no line matches.
 */
function anchorLineOffset(text, anchor, from = 0) {
  let found = -1;
  let start = text.lastIndexOf('\n', from - 1) + 1;
  while (start <= text.length) {
    const newline = text.indexOf('\n', start);
    const lineEnd = newline < 0 ? text.length : newline;
    const line = text.slice(start, lineEnd).replace(/\r$/, '');
    if (start >= from && line === anchor) found = start;
    if (newline < 0) break;
    start = newline + 1;
  }
  return found;
}

/**
 * Plan a block appended to, or rewritten inside, an upstream file.
 * Without `insertBefore` the fragment, with the separator it carries in front of
 * the begin marker, goes at the end of the file. With it, the fragment goes in
 * verbatim just before that line and carries its own trailing separator, so a
 * section such as RELATED RESOURCES that has to stay last keeps its place.
 * @param {object} entry Manifest overlay entry.
 * @param {object} ctx Engine context.
 * @param {string[]} problems Collects reasons the overlay cannot be applied.
 * @param {Record<string, string>} [acceptedSha256] Hashes the engine last applied.
 * @returns {{writes: object[], deletes: string[], outputs: object[]}}
 */
function planMarkedSectionOverlay(entry, ctx, problems, acceptedSha256) {
  const anchor = entry.insertBefore;
  if (anchor !== undefined && (typeof anchor !== 'string' || anchor === '' || /[\r\n]/.test(anchor))) {
    problems.push(`${entry.id}: insertBefore must be one non-empty line of text`);
    return { writes: [], deletes: [], outputs: [] };
  }
  const fragmentPath = path.join(ctx.overlayRoot, entry.fragment);
  const basePath = path.join(ctx.overlayRoot, entry.base);
  const destinationPath = path.join(ctx.root, entry.destination);
  const fragment = readBufferOrNull(fragmentPath);
  const base = readBufferOrNull(basePath);
  if (!fragment || !base) {
    problems.push(`canonical fragment or base copy is missing for ${entry.destination}`);
    return { writes: [], deletes: [], outputs: [] };
  }
  const current = readBufferOrNull(destinationPath);
  const baseText = base.toString('utf8');
  const fragmentText = fragment.toString('utf8');
  const currentText = current ? current.toString('utf8') : null;
  const missingAnchor = () => problems.push(
    `${entry.destination} has no line "${anchor}" for the block to go before; rebase the overlay`);
  const placeIntoBase = () => {
    if (anchor === undefined) return `${baseText}${fragmentText}`;
    const at = anchorLineOffset(baseText, anchor);
    if (at < 0) return null;
    return `${baseText.slice(0, at)}${fragmentText}${baseText.slice(at)}`;
  };
  let expected;
  if (currentText === null) {
    if (acceptedHashFor(acceptedSha256, entry.destination) === undefined) {
      problems.push(`upstream removed ${entry.destination}; rebase the overlay`);
      return { writes: [], deletes: [], outputs: [] };
    }
    expected = placeIntoBase();
  } else if (currentText.includes(entry.beginMarker)) {
    const begin = currentText.indexOf(entry.beginMarker);
    const endMarkerIndex = currentText.indexOf(entry.endMarker);
    if (endMarkerIndex < 0) {
      problems.push(`${entry.destination} has the begin marker but no end marker; rebase the overlay`);
      return { writes: [], deletes: [], outputs: [] };
    }
    // Our own block is rewritten in place; the separator that carries it is
    // part of the fragment, so the text before the marker is kept as it is.
    const head = currentText.slice(0, begin);
    const block = fragmentText.slice(fragmentText.indexOf(entry.beginMarker));
    if (anchor === undefined) {
      expected = `${head}${block}`;
    } else {
      // Everything from the anchor on is upstream's and stays; what sat between
      // the end marker and the anchor was the old fragment's trailing separator.
      const at = anchorLineOffset(currentText, anchor, endMarkerIndex);
      const tailAfterBlock = currentText.slice(endMarkerIndex + entry.endMarker.length);
      if (at >= 0) {
        expected = `${head}${block}${currentText.slice(at)}`;
      } else if (head.startsWith(baseText) && tailAfterBlock.trim() === '') {
        // The block still sits at the end, where the entry put it before it
        // named an anchor, so the move starts again from the base copy.
        expected = placeIntoBase();
      } else {
        expected = null;
      }
    }
  } else if (currentText === baseText) {
    expected = placeIntoBase();
  } else {
    problems.push(`upstream changed ${entry.destination}; rebase the overlay`);
    return { writes: [], deletes: [], outputs: [] };
  }
  if (expected === null) {
    missingAnchor();
    return { writes: [], deletes: [], outputs: [] };
  }
  const output = { filePath: destinationPath, buffer: Buffer.from(expected, 'utf8'), mode: entry.mode, sourcePath: fragmentPath };
  if (expected === currentText) return { writes: [], deletes: [], outputs: [output] };
  return { writes: [output], deletes: [], outputs: [output] };
}

/**
 * Plan an entry set applied in place to an upstream JSON file.
 * @param {object} entry Manifest overlay entry.
 * @param {object} ctx Engine context.
 * @param {string[]} problems Collects reasons the overlay cannot be applied.
 * @param {Record<string, string>} [acceptedSha256] Hashes the engine last applied.
 * @param {{recordedItems?: object[], recordedSets?: object[], recordedKeys?: object[],
 *   upstreamBytes?: ((key: string) => Buffer|null)|null}} [options] Items this
 *   overlay added to the destination last time, so a dropped entry leaves the live
 *   file, the sets it applied there, so a dropped set returns to the pin's value,
 *   the keys its `setKeyOnItem` operations wrote, which return the same way, and
 *   the reader for the pinned upstream copy all three are checked against.
 * @returns {{writes: object[], deletes: string[], outputs: object[],
 *   listedItems: object[], listedSets: object[], listedKeys: object[], warnings: string[]}}
 *   `listedItems` holds the items the entry set still lists and this overlay
 *   added, which is what a later pass may retract. `listedSets` holds the sets
 *   and inserted object keys the entry set still names, and `listedKeys` the
 *   `setKeyOnItem` keys. `warnings` holds the anchors that matched nothing.
 */
function planJsonOverlay(entry, ctx, problems, acceptedSha256, { recordedItems, recordedSets, recordedKeys, upstreamBytes } = {}) {
  const specPath = path.join(ctx.overlayRoot, entry.source);
  const destinationPath = path.join(ctx.root, entry.destination);
  const specBuffer = readBufferOrNull(specPath);
  if (!specBuffer) {
    problems.push(`entry set is missing: ${entry.source}`);
    return { writes: [], deletes: [], outputs: [] };
  }
  const current = readBufferOrNull(destinationPath);
  if (!current) {
    problems.push(`upstream removed ${entry.destination}; rebase the overlay`);
    return { writes: [], deletes: [], outputs: [] };
  }
  // A malformed entry set is this overlay's problem alone, so it blocks only this
  // overlay and names the file instead of stopping every other report.
  let spec;
  try {
    spec = JSON.parse(specBuffer.toString('utf8'));
  } catch (error) {
    problems.push(`entry set ${entry.source} is not valid JSON: ${error.message}`);
    return { writes: [], deletes: [], outputs: [] };
  }
  const currentText = current.toString('utf8');
  // The recorded applied hash is the only proof that the live bytes are this
  // overlay's own work. Without it a differing entry may be a hand edit.
  const appliedHash = acceptedHashFor(acceptedSha256, entry.destination);
  const canReplaceExisting = appliedHash !== undefined && sha256(current) === appliedHash;
  // The pinned upstream copy is read only once a record is actually dropped, so a
  // run that retracts nothing pays no git call for it.
  let upstreamText;
  const readUpstreamText = () => {
    if (upstreamText !== undefined) return upstreamText;
    const bytes = upstreamBytes ? upstreamBytes(relativeKey(ctx.root, destinationPath)) : null;
    // Live bytes that hash to the entry's pinned hash are the pinned copy itself,
    // so they stand in when no checkout can be read.
    if (bytes !== null) upstreamText = bytes.toString('utf8');
    else upstreamText = entry.pinnedSha256 && sha256(current) === entry.pinnedSha256 ? currentText : null;
    return upstreamText;
  };
  let expected;
  const listedItems = [];
  const listedSets = [];
  const listedKeys = [];
  const warnings = [];
  try {
    expected = applyJsonOperations(currentText, spec, {
      canReplaceExisting,
      recordedItems,
      recordedSets,
      recordedKeys,
      readUpstreamText,
      onListed: (record) => listedItems.push(record),
      onWarning: (message) => warnings.push(`${entry.id}: ${message}`),
      // One record per key on one item, merged the way two sets on one path are.
      onKey: (record) => {
        const index = listedKeys.findIndex((listed) => samePath(listed.path, record.path) &&
          listed.identityKey === record.identityKey && listed.identity === record.identity && listed.key === record.key);
        if (index < 0) {
          listedKeys.push(record);
          return;
        }
        const [earlier] = listedKeys.splice(index, 1);
        listedKeys.push({ ...record, added: earlier.added === true || record.added === true });
      },
      // One record per path: a later set on the same path is the value the file
      // ends with, and a key stays marked as added once either set added it. The
      // record moves to the end, so the records keep the order the values were written.
      onSet: (record) => {
        const index = listedSets.findIndex((listed) => samePath(listed.path, record.path));
        if (index < 0) {
          listedSets.push(record);
          return;
        }
        const [earlier] = listedSets.splice(index, 1);
        listedSets.push({ ...record, added: earlier.added === true || record.added === true });
      },
    });
  } catch (error) {
    problems.push(`cannot apply the entry set to ${entry.destination}: ${error.message}`);
    // The destination is still reported, with no desired bytes, so the conflict is
    // raised against the entry set that has to be reconciled instead of vanishing
    // into a hard error that names only the live file.
    return {
      writes: [],
      deletes: [],
      outputs: [{ filePath: destinationPath, buffer: null, mode: entry.mode, sourcePath: specPath }],
    };
  }
  const output = { filePath: destinationPath, buffer: Buffer.from(expected, 'utf8'), mode: entry.mode, sourcePath: specPath };
  const listed = { listedItems, listedSets, listedKeys, warnings };
  if (expected === currentText) return { writes: [], deletes: [], outputs: [output], ...listed };
  return { writes: [output], deletes: [], outputs: [output], ...listed };
}

/**
 * Retained paths whose live bytes the skill-root plan keeps, because they sit
 * inside a replaced folder. A retained path the entry replaces directly is
 * written from the overlay source, so it is an overlay output like any other.
 * @param {object} entry A skill-root manifest entry.
 * @param {string} sourceDir The entry's source folder.
 * @returns {Set<string>} Kept paths, relative to the skill root.
 */
function keptRetainedPaths(entry, sourceDir) {
  const replacedFolders = (entry.replace || []).filter((rel) => isDirectory(path.join(sourceDir, rel)));
  const kept = new Set();
  for (const item of entry.retained || []) {
    if (replacedFolders.some((prefix) => item.path === prefix || item.path.startsWith(prefix + '/'))) kept.add(item.path);
  }
  return kept;
}

/**
 * A whole skill root replaced by the project's own: the source folder wins every
 * path it carries, the named vendor paths are removed, and the vendor files the
 * framework resolves by name are restored byte for byte from their pre-apply
 * state. Restoring from the live tree rather than from a stored copy keeps a
 * newer upstream template in place instead of reverting it to the pin.
 * @param {object} entry Manifest overlay entry.
 * @param {object} ctx Engine context.
 * @param {string[]} problems Collects reasons the overlay cannot be applied.
 * @param {Record<string, string>} [acceptedSha256] Hashes the engine last applied.
 * @returns {{writes: object[], deletes: string[], outputs: object[]}}
 */
function planSkillRootOverlay(entry, ctx, problems) {
  const sourceDir = path.join(ctx.overlayRoot, entry.source);
  const destinationDir = path.join(ctx.root, entry.destination);
  if (!isDirectory(sourceDir)) {
    problems.push(`canonical folder is missing: ${entry.source}`);
    return { writes: [], deletes: [], outputs: [] };
  }
  const retained = entry.retained || [];
  const missingRetained = retained
    .map((item) => item.path)
    .filter((rel) => !isFile(path.join(destinationDir, rel)));
  if (missingRetained.length > 0) {
    for (const rel of missingRetained) problems.push(`retained path is missing before apply: ${entry.destination}/${rel}`);
    return { writes: [], deletes: [], outputs: [] };
  }

  const replacedSubtrees = new Set(entry.replace.filter((rel) => isDirectory(path.join(sourceDir, rel))));
  const snapshot = new Map();
  for (const item of retained) {
    const isUnderReplaced = [...replacedSubtrees].some((prefix) => item.path === prefix || item.path.startsWith(`${prefix}/`));
    if (!isUnderReplaced) continue;
    const absolute = path.join(destinationDir, item.path);
    if (isFile(absolute)) snapshot.set(item.path, fs.readFileSync(absolute));
  }

  const writes = [];
  const deletes = [];
  const desired = new Map();
  for (const rel of entry.replace) {
    const sourcePath = path.join(sourceDir, rel);
    if (isDirectory(sourcePath)) {
      for (const [childRel, item] of walkTree(sourcePath)) desired.set(path.posix.join(rel, childRel), item);
    } else if (isFile(sourcePath)) {
      desired.set(rel, { kind: 'file', buffer: fs.readFileSync(sourcePath), mode: fs.statSync(sourcePath).mode & 0o777 });
    } else {
      problems.push(`canonical path is missing: ${entry.source}/${rel}`);
      return { writes: [], deletes: [], outputs: [] };
    }
  }
  const outputs = [];
  const keptPaths = keptRetainedPaths(entry, sourceDir);
  for (const [rel, wanted] of desired) {
    if (wanted.kind !== 'file' || keptPaths.has(rel)) continue;
    outputs.push({
      filePath: path.join(destinationDir, rel),
      buffer: wanted.buffer,
      mode: wanted.mode,
      sourcePath: path.join(sourceDir, rel),
    });
  }

  // A retained path that sits inside a replaced subtree survives the mirror,
  // so it is written back from the snapshot and never deleted in the first
  // place. That keeps the second apply a no-op instead of a delete-and-restore.
  for (const [rel, buffer] of snapshot) {
    desired.set(rel, { kind: 'file', buffer, mode: 0o644 });
  }

  const current = walkTree(destinationDir);
  const removedPrefixes = [...entry.remove, ...replacedSubtrees];
  const matchesPrefix = (prefixes, rel) => prefixes.some((prefix) => rel === prefix || rel.startsWith(`${prefix}/`));
  const isRemoved = (rel) => matchesPrefix(removedPrefixes, rel);
  // A replaced subtree is the overlay's to capture into; only a path the entry
  // removes without also replacing is a removal the overlay performs.
  const isDeclaredRemoval = (rel) => matchesPrefix(entry.remove, rel) && !matchesPrefix(entry.replace, rel);
  const isReplacedSubtree = (rel) => matchesPrefix([...replacedSubtrees], rel);

  for (const [rel, wanted] of desired) {
    const destinationPath = path.join(destinationDir, rel);
    const existing = current.get(rel);
    if (wanted.kind === 'symlink') {
      if (!existing || existing.kind !== 'symlink' || existing.target !== wanted.target) {
        writes.push({ filePath: destinationPath, symlinkTarget: wanted.target });
      }
      continue;
    }
    if (!existing || existing.kind !== 'file' || Buffer.compare(existing.buffer, wanted.buffer) !== 0) {
      writes.push({ filePath: destinationPath, buffer: wanted.buffer, mode: wanted.mode });
    }
  }

  for (const rel of current.keys()) {
    if (desired.has(rel)) continue;
    if (!isRemoved(rel)) continue;
    const destinationPath = path.join(destinationDir, rel);
    deletes.push(destinationPath);
    if (current.get(rel).kind === 'file') {
      outputs.push({
        filePath: destinationPath,
        buffer: null,
        sourcePath: path.join(sourceDir, rel),
        removal: isDeclaredRemoval(rel),
        replacedSubtree: isReplacedSubtree(rel),
      });
    }
  }
  // Deepest first, so a removed folder is empty by the time its own delete runs.
  deletes.sort((left, right) => right.length - left.length);

  return { writes, deletes, outputs };
}

/**
 * Plan the removal of named paths from the tree.
 * @param {object} entry Manifest overlay entry.
 * @param {object} ctx Engine context.
 * @param {string[]} problems Collects reasons the overlay cannot be applied.
 * @param {Record<string, string>} [acceptedSha256] Hashes the engine last applied.
 * @returns {{writes: object[], deletes: string[], outputs: object[]}}
 */
function planRemoveRootOverlay(entry, ctx, problems) {
  const root = ctx.root;
  if (!Array.isArray(entry.paths) || entry.paths.length === 0) {
    problems.push('paths must be a non-empty array');
    return { writes: [], deletes: [], outputs: [] };
  }

  const targets = [];
  const seenTargets = new Set();
  for (const relativePath of entry.paths) {
    try {
      const target = resolveRemoveRootPath(root, relativePath);
      if (seenTargets.has(target)) {
        problems.push(`removal path is repeated: ${relativePath}`);
        continue;
      }
      seenTargets.add(target);
      targets.push({ relativePath, target });
    } catch (error) {
      problems.push(error.message);
    }
  }
  if (problems.length > 0) return { writes: [], deletes: [], outputs: [] };

  const deletions = new Set();
  for (const { target } of targets) {
    for (const removalPath of collectRemovalPaths(target)) deletions.add(removalPath);
  }
  const deletes = [...deletions].sort((left, right) => {
    const leftDepth = path.relative(root, left).split(path.sep).length;
    const rightDepth = path.relative(root, right).split(path.sep).length;
    return rightDepth - leftDepth || right.length - left.length || left.localeCompare(right);
  });
  const outputs = targets.map(({ target }) => ({ filePath: target, buffer: null }));
  return { writes: [], deletes, outputs };
}

const PLANNERS = {
  file: planFileOverlay,
  directory: planDirectoryOverlay,
  'marked-section': planMarkedSectionOverlay,
  'json-entry': planJsonOverlay,
  'skill-root': planSkillRootOverlay,
  'remove-root': planRemoveRootOverlay,
};

/**
 * Build a read-only plan for one manifest overlay.
 * @param {object} entry Manifest overlay entry.
 * @param {object} ctx Engine context.
 * @param {{acceptedSha256?: Map<string, string>|Record<string, string>,
 *   recordedItems?: object[], recordedSets?: object[], recordedKeys?: object[],
 *   upstreamBytes?: ((key: string) => Buffer|null)|null}}
 *   [options] Hashes of what this overlay wrote last, which authorize rewriting a
 *   destination that changed only because the canonical copy did, the items it
 *   added there, which a dropped entry takes back, the sets and `setKeyOnItem`
 *   keys it applied there, which return to the pin's value once dropped, and the
 *   reader for the pinned upstream copy they are checked against.
 * @returns {{entry: object, problems: string[], writes: object[], deletes: string[],
 *   outputs: object[], listedItems: object[], listedSets: object[], listedKeys: object[],
 *   warnings: string[]}}
 *   `listedItems` names the added items an entry set still lists, `listedSets`
 *   the sets it still names and `listedKeys` its `setKeyOnItem` keys, all for
 *   the state write. `warnings` are notes that never block the plan.
 */
function planOverlay(entry, ctx, { acceptedSha256, recordedItems, recordedSets, recordedKeys, upstreamBytes } = {}) {
  const problems = [];
  const planner = PLANNERS[entry.scope];
  if (!planner) {
    return {
      entry, problems: [`unknown scope "${entry.scope}"`], writes: [], deletes: [], outputs: [],
      listedItems: [], listedSets: [], listedKeys: [], warnings: [],
    };
  }
  const plan = planner(entry, ctx, problems, acceptedSha256, { recordedItems, recordedSets, recordedKeys, upstreamBytes });
  return {
    entry,
    problems,
    writes: plan.writes,
    deletes: plan.deletes,
    outputs: plan.outputs || [],
    listedItems: plan.listedItems || [],
    listedSets: plan.listedSets || [],
    listedKeys: plan.listedKeys || [],
    warnings: plan.warnings || [],
  };
}

/**
 * Apply one overlay plan's writes and removals.
 * @param {object} plan Result from planOverlay.
 * @param {string} root Destination tree root.
 * @returns {number} Number of write and delete operations applied.
 */
function applyOnePlan(plan, root) {
  for (const deletion of plan.deletes) removePath(deletion);
  for (const write of plan.writes) {
    if (write.symlinkTarget !== undefined) ensureSymlink(write.filePath, write.symlinkTarget);
    else writeFile(write.filePath, write.buffer, write.mode);
  }
  if (plan.deletes.length > 0 && plan.entry.destination) {
    pruneEmptyDirs(path.join(root, plan.entry.destination));
  }
  return plan.writes.length + plan.deletes.length;
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. LAYOUT LINKS
//
// The routing engine reads each hub through relative links that sit outside
// the vendored `.skilled` tree. A fresh copy of the pin does not carry them, so
// regeneration fails until they exist. The manifest names each such link; a
// path that already holds something else is never replaced.
//
// The one exception is an entry that names, in `replaces`, a single upstream
// link and the target the pin ships it with. Upstream sometimes ships a link
// where the project needs a folder or a different target, and a re-copy brings
// that link back. The named link is removed only while it still points at the
// pinned target: any other target means upstream or a person changed it, and
// replacing it then would hide that change, so the entry is refused instead.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Decide what a layout link's `replaces` entry allows right now.
 * @param {string} root Destination tree root.
 * @param {object} link Layout link entry from the manifest.
 * @returns {{state: string, reason?: string, replacedPath?: string}}
 */
function replacedLinkState(root, link) {
  const replaced = link.replaces;
  if (replaced === undefined) return { state: 'none' };
  if (!replaced || typeof replaced.path !== 'string' || typeof replaced.target !== 'string') {
    return { state: 'refused', reason: `${link.path} has a replaces entry without a path and a target` };
  }
  const own = path.posix.normalize(link.path);
  const named = path.posix.normalize(replaced.path);
  if (own !== named && !own.startsWith(named + '/')) {
    return { state: 'refused', reason: `${link.path} may replace only itself or a folder above it, not ${replaced.path}` };
  }
  const replacedPath = path.join(root, replaced.path);
  let stats = null;
  try {
    stats = fs.lstatSync(replacedPath);
  } catch (error) {
    if (!error || error.code !== 'ENOENT') throw error;
    return { state: 'none' };
  }
  if (stats.isSymbolicLink()) {
    const current = fs.readlinkSync(replacedPath);
    if (own === named && current === link.target) return { state: 'none' };
    if (current === replaced.target) return { state: 'pinned', replacedPath };
    return { state: 'refused', reason: `${replaced.path} links to ${current}, not the pinned ${replaced.target}; refusing to replace it` };
  }
  if (own !== named && stats.isDirectory()) return { state: 'none' };
  return { state: 'refused', reason: `${replaced.path} is not the pinned link to ${replaced.target}; refusing to replace it` };
}

/**
 * Say whether the state records this exact target as a link the engine made.
 * @param {object} state Loaded applied-hash state.
 * @param {object} link Layout link entry from the manifest.
 * @param {string|null} current Target the path links to right now.
 * @returns {boolean} Whether the record matches what stands on disk.
 */
function isRecordedLink(state, link, current) {
  const recorded = state && state.links ? state.links[link.path] : undefined;
  return typeof recorded === 'string' && recorded === current;
}

/**
 * Find the manifest's layout links that are missing or refused.
 * @param {object} manifest Loaded overlay manifest.
 * @param {string} root Destination tree root.
 * @param {object} state Loaded applied-hash state; its link records are what
 *   tells a link the engine made from one it must refuse to touch.
 * @returns {{missing: object[], problems: string[]}}
 */
function planLayoutLinks(manifest, root, state) {
  const missing = [];
  const problems = [];
  for (const link of manifest.layoutLinks || []) {
    const linkPath = path.join(root, link.path);
    const replacement = replacedLinkState(root, link);
    if (replacement.state === 'refused') {
      problems.push(replacement.reason);
      continue;
    }
    if (replacement.state === 'pinned') {
      // The pinned link still stands, so the entry's own path would be read
      // through it; it is missing by definition until the link is removed.
      missing.push({ link, linkPath });
      continue;
    }
    let stats = null;
    try {
      stats = fs.lstatSync(linkPath);
    } catch (error) {
      if (!error || error.code !== 'ENOENT') throw error;
    }
    let current = null;
    if (stats && stats.isSymbolicLink()) current = fs.readlinkSync(linkPath);
    if (!stats) {
      missing.push({ link, linkPath });
    } else if (current !== null && current !== link.target && isRecordedLink(state, link, current)) {
      // The manifest moved this entry's target after an earlier apply, and the
      // state records the link standing here as the engine's own: the link is
      // retargeted rather than reported as a stranger occupying the path.
      missing.push({ link, linkPath, isRetarget: true });
    } else if (current !== link.target) {
      problems.push(`${link.path} exists but is not the link to ${link.target}`);
    }
  }
  return { missing, problems };
}

/**
 * Create one layout link, first removing the upstream link it replaces.
 * The replaced link is checked again here, because another entry may already
 * have removed it, and a link that changed since planning must not be deleted.
 * @param {string} root Destination tree root.
 * @param {object} link Layout link entry from the manifest.
 * @param {boolean} [isRetarget] Whether the state records the link standing at
 *   this path as the engine's own, which permits pointing it at a new target.
 */
function applyLayoutLink(root, link, isRetarget) {
  const replacement = replacedLinkState(root, link);
  if (replacement.state === 'refused') throw new Error(replacement.reason);
  if (replacement.state === 'pinned') fs.unlinkSync(replacement.replacedPath);
  if (isRetarget === true) {
    // The link is removed only while it is still a link: a path that became a
    // real file or folder since planning is someone else's work, and unlinking
    // it would delete that work.
    const linkPath = path.join(root, link.path);
    let stats = null;
    try {
      stats = fs.lstatSync(linkPath);
    } catch (error) {
      if (!error || error.code !== 'ENOENT') throw error;
    }
    if (stats && !stats.isSymbolicLink()) {
      throw new Error(link.path + ' is no longer the link this engine made; refusing to replace it');
    }
    if (stats) fs.unlinkSync(linkPath);
  }
  ensureSymlink(path.join(root, link.path), link.target);
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. REGENERATION AND VERIFICATION
//
// Routing projections are generated from the files above, so they are never
// stored as overlays: storing them would make the copy the source of truth for
// data a generator owns. They are rebuilt after the overlays land, and checked
// through the generators' own read-only modes.
// ─────────────────────────────────────────────────────────────────────────────

function runCommand(root, argv) {
  const [bin, ...args] = argv;
  const executable = bin === 'node' ? process.execPath : bin;
  return spawnSync(executable, args, { cwd: root, encoding: 'utf8' });
}

/**
 * Run the manifest's read-only generator checks.
 * @param {object} manifest Loaded overlay manifest.
 * @param {string} root Destination tree root.
 * @returns {string[]} One problem per failed check.
 */
function verifyGenerated(manifest, root) {
  const problems = [];
  for (const check of manifest.verifyGenerated || []) {
    const result = runCommand(root, check.argv);
    const output = `${result.stdout || ''}${result.stderr || ''}`.trim();
    if (check.expect === 'fresh-true' || check.expect === 'zero-changed') {
      let parsed = null;
      try {
        parsed = JSON.parse(result.stdout);
      } catch {
        parsed = null;
      }
      if (check.expect === 'fresh-true' && (result.status !== 0 || !parsed || parsed.fresh !== true)) {
        problems.push(`${check.id}: freshness is not fresh (${output.split('\n').slice(-1)[0] || 'no output'})`);
      }
      if (check.expect === 'zero-changed' && (result.status !== 0 || !parsed || parsed.changed !== 0)) {
        problems.push(`${check.id}: derived content would change`);
      }
      continue;
    }
    if (result.status !== 0) {
      problems.push(`${check.id}: check failed (${output.split('\n').slice(-1)[0] || 'no output'})`);
    }
  }
  return problems;
}

function snapshotOutputs(manifest, root) {
  const snapshot = new Map();
  for (const step of manifest.regenerate || []) {
    for (const output of step.outputs || []) {
      const buffer = readBufferOrNull(path.join(root, output));
      snapshot.set(output, buffer ? sha256(buffer) : null);
    }
  }
  return snapshot;
}

/**
 * Run the manifest regeneration steps and report failed steps and changed outputs.
 * Each watched path is hashed around every step, so a file an overlay owns that a
 * step rewrote is traced to that step whether or not the step lists it under
 * `outputs`. Once the steps have run, no other record says which one wrote it.
 * @param {object} manifest Loaded overlay manifest.
 * @param {string} root Destination tree root.
 * @param {string[]} [watched] Tree-relative paths to trace, such as overlay destinations.
 * @returns {{results: object[], failed: object[], changedOutputs: string[],
 *   rewrittenBy: Map<string, string[]>}} `rewrittenBy` maps each watched path a
 *   step changed to the ids of the steps that changed it, in run order.
 */
function regenerate(manifest, root, watched = []) {
  const before = snapshotOutputs(manifest, root);
  const digestOf = (key) => {
    const buffer = readBufferOrNull(path.join(root, key));
    return buffer ? sha256(buffer) : null;
  };
  let digests = new Map(watched.map((key) => [key, digestOf(key)]));
  const rewrittenBy = new Map();
  const results = [];
  for (const step of manifest.regenerate || []) {
    results.push({ step, result: runCommand(root, step.argv) });
    const next = new Map(watched.map((key) => [key, digestOf(key)]));
    for (const [key, digest] of next) {
      if (digests.get(key) === digest) continue;
      if (!rewrittenBy.has(key)) rewrittenBy.set(key, []);
      rewrittenBy.get(key).push(step.id);
    }
    digests = next;
  }
  const failed = results.filter(({ result }) => result.status !== 0);
  const after = snapshotOutputs(manifest, root);
  const changedOutputs = [];
  for (const [output, digest] of after) {
    if (before.get(output) !== digest) changedOutputs.push(output);
  }
  return { results, failed, changedOutputs, rewrittenBy };
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. PROTECTED PATHS
// ─────────────────────────────────────────────────────────────────────────────

// A `.env` file is never read, even when a manifest entry names it. A
// token-named path is read only when a manifest entry names that exact path:
// met while walking a directory or skill-root entry it is refused, because a
// walk would otherwise read any credential file that sits beside an overlay.
const EXACT_CAPTURE_SCOPES = new Set(['file', 'marked-section']);
const NO_EXACT_PATHS = new Set();

function isEnvName(filePath) {
  return path.basename(filePath).toLowerCase().startsWith('.env');
}

function isTokenName(filePath) {
  return path.basename(filePath).toLowerCase().includes('token');
}

/**
 * Collect every absolute path a manifest entry names exactly.
 * @param {object} ctx Engine context.
 * @param {object} manifest Loaded overlay manifest.
 * @returns {Set<string>} Named sources, bases, fragments, destinations and removal paths.
 */
function exactManifestPaths(ctx, manifest) {
  const exact = new Set();
  for (const entry of manifest.overlays) {
    for (const key of ['source', 'base', 'fragment']) {
      if (typeof entry[key] === 'string') exact.add(path.resolve(ctx.overlayRoot, entry[key]));
    }
    if (typeof entry.destination === 'string') exact.add(path.resolve(ctx.root, entry.destination));
    for (const relativePath of Array.isArray(entry.paths) ? entry.paths : []) {
      if (typeof relativePath === 'string') exact.add(path.resolve(ctx.root, relativePath));
    }
    for (const relativePath of protectedPathsFor(entry)) {
      exact.add(path.resolve(ctx.overlayRoot, entry.source, relativePath));
      exact.add(path.resolve(ctx.root, entry.destination, relativePath));
    }
  }
  return exact;
}

/**
 * Read the token-named paths a directory or skill-root entry lets its walk
 * read. Each value names one path relative to the entry, so a walk still
 * refuses every token-named file the entry does not list by exact path.
 * @param {object} entry Manifest overlay entry.
 * @returns {string[]} The entry's validated relative paths.
 * @throws {Error} When a value is not a relative path inside the entry or names a .env file.
 */
function protectedPathsFor(entry) {
  if (entry.protectedPaths === undefined) return [];
  if (!(entry.scope === 'directory' || entry.scope === 'skill-root') || !Array.isArray(entry.protectedPaths)) {
    throw new Error(entry.id + ': protectedPaths is a list, allowed only on a directory or skill-root entry');
  }
  return entry.protectedPaths.map((value) => {
    const normalized = typeof value === 'string' ? path.posix.normalize(value) : '';
    const isInside = normalized !== '' && normalized !== '.' && !path.isAbsolute(value) &&
      normalized !== '..' && !normalized.startsWith('../');
    if (!isInside) {
      throw new Error(entry.id + ': protectedPaths value is not a path inside the entry: ' + String(value));
    }
    if (isEnvName(normalized)) {
      throw new Error(entry.id + ': protectedPaths value names a .env file, which is never read: ' + normalized);
    }
    return normalized;
  });
}

/**
 * Whether the engine must refuse to read a path because its name marks a secret.
 * @param {string} filePath Path to test.
 * @param {Set<string>} [exact] Absolute paths a manifest entry names exactly.
 * @returns {boolean} True when the path is refused.
 */
function isProtectedReadPath(filePath, exact = NO_EXACT_PATHS) {
  if (isEnvName(filePath)) return true;
  return isTokenName(filePath) && !exact.has(path.resolve(filePath));
}

/**
 * Whether a capture record's destination is one its entry lists in protectedPaths.
 * @param {object} ctx Engine context.
 * @param {{key: string, entry?: object}} record Capture record.
 * @returns {boolean} True when the entry names this destination exactly.
 */
function isListedProtectedPath(ctx, record) {
  if (!record.entry || typeof record.entry.destination !== 'string') return false;
  const destination = path.resolve(ctx.root, record.entry.destination);
  const relativePath = toPosix(path.relative(destination, path.resolve(ctx.root, record.key)));
  return protectedPathsFor(record.entry).includes(relativePath);
}

/**
 * Whether a capture must refuse to copy a live file into the overlay folder.
 * A file or marked-section entry names its destination exactly, and a
 * directory or skill-root entry names one through protectedPaths, so only
 * those may capture a token-named path.
 * @param {object} ctx Engine context.
 * @param {{key: string, sourcePath: string, entry?: object}} record Capture record.
 * @param {string} inputPath Path as the caller named it.
 * @returns {boolean} True when the capture is refused.
 */
function isCaptureRestricted(ctx, record, inputPath) {
  const isExactRecord = Boolean(record.entry && EXACT_CAPTURE_SCOPES.has(record.entry.scope)) ||
    isListedProtectedPath(ctx, record);
  const paths = [inputPath, record.key, sourceRelative(ctx, record.sourcePath)];
  return paths.some((value) => {
    if (isEnvName(value)) return true;
    return value.toLowerCase().includes('token') && !isExactRecord;
  });
}

/**
 * Name a protected path and the one change that lets an overlay own it.
 * @param {object} ctx Engine context.
 * @param {object} entry Manifest overlay entry.
 * @param {string} filePath Absolute path that was refused.
 * @param {string} shownPath The path as the report prints it.
 * @returns {string} One problem line for the entry.
 */
function protectedPathProblem(ctx, entry, filePath, shownPath) {
  const problem = 'refusing to inspect a protected path: ' + shownPath;
  if (isEnvName(filePath)) return problem + '; a .env file is never read, so move it out of the overlay';
  if (entry.scope !== 'directory' && entry.scope !== 'skill-root') return problem;
  // protectedPaths names a path relative to the entry, the same on both sides.
  const entryRoots = [path.resolve(ctx.overlayRoot, entry.source), path.resolve(ctx.root, entry.destination)];
  const entryRoot = entryRoots.find((candidate) => isWithin(candidate, filePath));
  if (!entryRoot) return problem;
  return problem + `; if the overlay owns it, add "${toPosix(path.relative(entryRoot, filePath))}" to this entry's protectedPaths`;
}

// root/skilled would read as the framework folder under its old name, so no copy
// lives there: the framework's copies live under framework/ alone, which keeps one
// destination from ever having two sources.
function isUnderRootSkilled(value) {
  if (typeof value !== 'string') return false;
  const normalized = path.posix.normalize(value).replace(/\/+$/, '');
  return normalized === 'root/skilled' || normalized.startsWith('root/skilled/');
}

function rootSkilledProblem(field, value) {
  return `${field} ${value} sits under root/skilled, which holds no copy; the framework's copies live under framework/`;
}

/**
 * Find the first layout link path that would land outside the tree. Every link
 * write and its rollback joins these paths onto the root, and a link write
 * unlinks whatever stands there, so a path that leaves the root is refused
 * before anything reads or writes through it.
 * @param {string} root Destination tree root.
 * @param {object} manifest Loaded overlay manifest.
 * @returns {string|null} The refusal, or null when every path stays inside.
 */
function layoutLinkEscape(root, manifest) {
  for (const link of manifest.layoutLinks || []) {
    if (!link) continue;
    const paths = [link.path];
    if (link.replaces && typeof link.replaces.path === 'string') paths.push(link.replaces.path);
    for (const p of paths) {
      if (typeof p !== 'string') continue;
      if (path.isAbsolute(p) || path.win32.isAbsolute(p) || !isWithin(root, path.resolve(root, p))) {
        return `layout link path escapes the tree root: ${p}`;
      }
    }
  }
  return null;
}

/**
 * Refuse a manifest whose paths escape their roots, and find every entry that
 * would read a secret. A path escape means the manifest itself is wrong, so it
 * stops the run. A protected path blocks only its own entry: the report still
 * covers every other overlay, and apply still writes nothing while one is blocked.
 * @param {object} ctx Engine context.
 * @param {object} manifest Loaded overlay manifest.
 * @returns {{exact: Set<string>, refused: Map<string, string>}} The exact
 *   manifest paths, for the per-output check, and one problem per refused entry id.
 */
function assertSafeToPlan(ctx, manifest) {
  const root = ctx.root;
  const linkEscape = layoutLinkEscape(root, manifest);
  if (linkEscape) throw new Error(linkEscape);
  const exact = exactManifestPaths(ctx, manifest);
  const refused = new Map();
  for (const entry of manifest.overlays) {
    const candidates = [];
    for (const key of ['source', 'base', 'fragment', 'destination']) {
      if (!entry[key]) continue;
      const base = key === 'destination' ? root : ctx.overlayRoot;
      const absolute = path.resolve(base, entry[key]);
      if (!isWithin(base, absolute)) {
        throw new Error(entry.id + ': path escapes its root: ' + entry[key]);
      }
      candidates.push(absolute);
    }
    if (entry.scope === 'remove-root' && Array.isArray(entry.paths)) {
      // A removal path the planner rejects is reported as a blocked overlay, the
      // way a check reports it, rather than as an error that hides the others.
      for (const relativePath of entry.paths) {
        try {
          candidates.push(resolveRemoveRootPath(root, relativePath));
        } catch {
          continue;
        }
      }
    }
    const misplacedKey = ['source', 'fragment', 'base'].find((key) => isUnderRootSkilled(entry[key]));
    if (misplacedKey) {
      refused.set(entry.id, rootSkilledProblem(misplacedKey, entry[misplacedKey]));
      continue;
    }
    const named = candidates.find((candidate) => isProtectedReadPath(candidate, exact));
    if (named) {
      refused.set(entry.id, protectedPathProblem(ctx, entry, named, toPosix(path.relative(ctx.overlayRoot, named))));
      continue;
    }
    if (entry.scope === 'directory' || entry.scope === 'skill-root') {
      const sourceDirectory = path.resolve(ctx.overlayRoot, entry.source);
      const destinationDirectory = path.resolve(root, entry.destination);
      for (const filePath of [...listTreePaths(sourceDirectory), ...listTreePaths(destinationDirectory)]) {
        if (isProtectedReadPath(filePath, exact)) {
          refused.set(entry.id, protectedPathProblem(ctx, entry, filePath, toPosix(path.relative(root, filePath))));
          break;
        }
      }
    }
  }
  return { exact, refused };
}

/**
 * Stand in for an entry the engine must not read: no outputs and no writes, so
 * nothing classifies, applies or captures through it, and one problem the check
 * and apply both report.
 * @param {object} entry Manifest overlay entry.
 * @param {string} problem Why the entry was refused.
 * @returns {object} A plan shaped like planOverlay's result.
 */
function refusedPlan(entry, problem) {
  return { entry, problems: [problem], writes: [], deletes: [], outputs: [] };
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. CLASSIFICATION
//
// Each destination is classified against three byte sets: the live file, the
// bytes the overlay would write now, and the hash recorded the last time the
// engine applied it. That is what tells an overlay edit (apply it) from a live
// edit (capture it) from a conflict (a person resolves it).
// ─────────────────────────────────────────────────────────────────────────────

function buffersEqual(left, right) {
  if (left === null || right === null) return left === right;
  return Buffer.compare(left, right) === 0;
}

function hashMatches(buffer, hash) {
  return buffer !== null && hash !== undefined && sha256(buffer) === hash;
}

function planWouldWrite(plan, filePath) {
  return plan.writes.some((write) => path.resolve(write.filePath) === path.resolve(filePath)) ||
    plan.deletes.some((deletion) => path.resolve(deletion) === path.resolve(filePath));
}

/**
 * Whether an entry says its overlay was rebased onto the commit now pinned.
 * A folder overlay carries no hash per file, so its owner names the one
 * upstream commit the whole folder was read against. Pins are stored short or
 * full, so either may be a prefix of the other.
 * @param {object} entry Manifest overlay entry.
 * @param {object} manifest Loaded overlay manifest.
 * @returns {boolean}
 */
function isRebasedOntoPin(entry, manifest) {
  const rebased = typeof entry.rebasedOnto === 'string' ? entry.rebasedOnto.toLowerCase() : '';
  const pinned = manifest.pin && typeof manifest.pin.commit === 'string' ? manifest.pin.commit.toLowerCase() : '';
  if (rebased.length < 7 || pinned.length < 7) return false;
  return rebased.startsWith(pinned) || pinned.startsWith(rebased);
}

/**
 * Name the sync state of one destination.
 * @param {{output: object, plan: object, key: string, live: Buffer|null, state: object,
 *   manifest: object, upstreamBytes: ((key: string) => Buffer|null)|null}} input
 * @returns {string} One of STATUS_NAMES.
 */
function classifyDestination({ output, plan, key, live, state, manifest, upstreamBytes }) {
  const desired = output.buffer;
  const hasState = Object.prototype.hasOwnProperty.call(state.files, key);
  const appliedHash = hasState ? state.files[key] : undefined;
  if (buffersEqual(live, desired)) return 'in-sync';
  // A path the entry declares removed is the overlay's own deletion, and apply is
  // the only way to carry it out, so a live file there is pending work, never a
  // person's edit to capture.
  if (output.removal) return 'overlay-edited';

  if (!hasState) {
    if (desired === null && live !== null) {
      // A replaced folder is the overlay's whole. Its delete is the overlay's
      // own work when the live bytes are the upstream file's at the pin this
      // run compares against. Any other bytes belong to a person and stay a
      // capture.
      if (output.replacedSubtree && upstreamBytes && buffersEqual(live, upstreamBytes(key))) {
        return 'overlay-edited';
      }
      return 'live-edited';
    }
    return planWouldWrite(plan, output.filePath) ? 'overlay-edited' : 'both-changed';
  }

  const desiredHash = desired === null ? null : sha256(desired);
  // An overlay names the upstream bytes it was written against. A destination
  // holding exactly those bytes, as it does right after a re-copy, is waiting for
  // the overlay, so a moved pin alone does not make it an upstream move.
  if (plan.entry.pinnedSha256 && hashMatches(live, plan.entry.pinnedSha256)) return 'overlay-edited';
  // The same holds for a folder overlay rebased onto the pinned commit: a
  // destination holding upstream's bytes at that commit is what the copy left,
  // so it waits for the overlay too.
  if (isRebasedOntoPin(plan.entry, manifest) && upstreamBytes && live !== null && buffersEqual(live, upstreamBytes(key))) {
    return 'overlay-edited';
  }
  if (state.exists && state.pin !== manifest.pin.commit &&
      !hashMatches(live, appliedHash) && !buffersEqual(live, desired)) {
    return 'upstream-moved';
  }
  if (live === null || hashMatches(live, appliedHash) ||
      (plan.entry.pinnedSha256 && hashMatches(live, plan.entry.pinnedSha256))) {
    return 'overlay-edited';
  }
  if (desiredHash === appliedHash && !hashMatches(live, appliedHash)) return 'live-edited';
  return 'both-changed';
}

// A layout link the manifest names is part of the delivered tree, not of the pin,
// so a tree that lost one cannot be repaired by copying anything: the report has
// to carry it as outstanding work or the link stays missing silently.
function layoutLinkRecords(layout, root) {
  return layout.missing.map(({ link, linkPath, isRetarget }) => ({
    state: 'overlay-edited',
    key: relativeKey(root, linkPath),
    target: link.target,
    link,
    isRetarget: isRetarget === true,
    layout: true,
  }));
}

/**
 * Plan every overlay against the accepted hashes and classify each destination.
 * @param {object} ctx Engine context.
 * @param {object} manifest Loaded overlay manifest.
 * @param {object} state Loaded applied-hash state.
 * @param {((key: string) => Buffer|null)|null} [upstreamBytes] Reads a path's
 *   bytes at the pin this run compares against; defaults to the manifest pin.
 * @returns {{plans: object[], records: object[], blocked: object[], layout: object}}
 *   `blocked` holds plans whose problems left no destination to classify.
 */
function analyze(ctx, manifest, state, upstreamBytes = pinnedUpstreamBytes(manifest)) {
  const root = ctx.root;
  const { exact, refused } = assertSafeToPlan(ctx, manifest);
  const plans = manifest.overlays.map((entry) => (refused.has(entry.id)
    ? refusedPlan(entry, refused.get(entry.id))
    : planOverlay(entry, ctx, {
      acceptedSha256: state.files,
      recordedItems: (state.items || {})[entry.destination] || [],
      recordedSets: (state.sets || {})[entry.destination] || [],
      recordedKeys: (state.keys || {})[entry.destination] || [],
      upstreamBytes,
    })));
  const records = [];
  const blocked = [];
  const seen = new Set();

  for (let index = 0; index < plans.length; index += 1) {
    const plan = plans[index];
    // A planner can produce an output the pre-plan walk never saw, such as a
    // generated name. That output is never classified: the whole entry is
    // swapped for a refused plan, so apply has nothing of it to write.
    const protectedPath = plan.outputs
      .flatMap((output) => [output.filePath, output.sourcePath])
      .find((filePath) => filePath && isProtectedReadPath(filePath, exact));
    if (protectedPath) {
      plans[index] = refusedPlan(plan.entry, protectedPathProblem(ctx, plan.entry, protectedPath,
        toPosix(path.relative(root, protectedPath))));
      blocked.push(plans[index]);
      continue;
    }
    if (plan.problems.length > 0 && plan.outputs.length === 0) {
      blocked.push(plan);
      continue;
    }
    for (const output of plan.outputs) {
      const key = relativeKey(root, output.filePath);
      if (seen.has(key)) throw new Error('multiple overlays own the same destination: ' + key);
      seen.add(key);
      let stateName = plan.entry.scope === 'remove-root'
        ? (pathExists(output.filePath) ? 'overlay-edited' : 'in-sync')
        : classifyDestination({
          output,
          plan,
          key,
          live: readBufferOrNull(output.filePath),
          state,
          manifest,
          upstreamBytes,
        });
      if (plan.problems.length > 0 && stateName === 'overlay-edited') stateName = 'both-changed';
      // An entry set the engine cannot apply to a file nobody edited since the
      // last apply, or since the pin, is a problem in the entry set alone. Only
      // the live copy moving as well makes it both-changed.
      if (stateName === 'both-changed' && plan.entry.scope === 'json-entry' && output.buffer === null &&
          plan.problems.length > 0) {
        const live = readBufferOrNull(output.filePath);
        if (hashMatches(live, acceptedHashFor(state.files, key)) || hashMatches(live, plan.entry.pinnedSha256)) {
          stateName = 'cannot-apply';
        }
      }
      records.push({
        state: stateName,
        key,
        output,
        plan,
        source: plan.entry.scope === 'remove-root' ? null : sourceRelative(ctx, output.sourcePath),
        removal: plan.entry.scope === 'remove-root',
      });
    }
  }
  const layout = planLayoutLinks(manifest, root, state);
  for (const record of layoutLinkRecords(layout, root)) records.push(record);
  return { plans, records, blocked, layout };
}

function fixFor(ctx, record) {
  if (record.state === 'overlay-edited') return ENGINE_COMMAND + ' apply';
  if (record.state === 'live-edited') return ENGINE_COMMAND + ' apply --capture ' + record.key;
  if (record.state === 'cannot-apply') {
    const reasons = record.plan.problems.map((problem) => problem.replace(/^cannot apply the entry set to [^:]+: /, ''));
    return reasons.join('; ') + '; change the entry set or the live file, then run ' + ENGINE_COMMAND + ' status';
  }
  return 'resolve ' + ctx.overlayLabel + '/' + record.source + ' and ' + record.key +
    ', then run ' + ENGINE_COMMAND + ' status';
}

function stateLine(ctx, record) {
  if (record.layout) return record.state + ' ' + record.key + '  (layout link)';
  if (record.removal) return record.state + ' ' + record.key + '  (remove-root row: ' + record.plan.entry.id + ')';
  return record.state + ' ' + record.key + '  (overlay: ' + ctx.overlayLabel + '/' + record.source + ')';
}

function problemLine(ctx, record) {
  return stateLine(ctx, record) + '  fix: ' + fixFor(ctx, record);
}

// A file a regenerate step rewrote after the overlay was applied would read as an
// upstream move or a live edit, which sends the reader to a diff that does not
// hold the change. The line names the step instead.
function regeneratedLine(ctx, record, stepIds) {
  const source = ctx.overlayLabel + '/' + record.source;
  return 'regenerated ' + record.key + '  (overlay: ' + source + ')  step: ' + stepIds.join(', ') +
    '  fix: carry the step\'s change into ' + source + ', or change the step so it leaves ' + record.key +
    ' alone, then run ' + ENGINE_COMMAND + ' apply';
}

function printProblems(ctx, records) {
  for (const record of records) {
    if (record.state !== 'in-sync') console.log(problemLine(ctx, record));
  }
}

function stateCounts(records) {
  const counts = Object.fromEntries(STATUS_NAMES.map((name) => [name, 0]));
  for (const record of records) counts[record.state] += 1;
  return counts;
}

function stateSummary(records) {
  const counts = stateCounts(records);
  return STATUS_NAMES.map((name) => name + '=' + counts[name]).join(' ');
}

// ─────────────────────────────────────────────────────────────────────────────
// 11. LOCK
//
// Every command that writes the tree or the overlay folder takes the lock
// itself, so no wrapper is needed to keep two runs apart. A lock whose writer
// has ended on this host is taken over, because it is only leftover state; a
// lock that may still have a live owner is refused, and a person removes it
// once they know that run has ended.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Tell whether the run that wrote an owner line has ended.
 * A lock left behind by a killed run blocks every later run until someone
 * deletes the file by hand, so the recorded process id is probed with signal 0,
 * which asks the kernel whether that process exists without touching it. Only a
 * missing process on this host counts: another host's ids say nothing here, and
 * any other error (a process owned by another user answers EPERM) says the
 * process is there.
 * A line that carries a process id and no `host=` token was written before the
 * engine recorded the host, and that engine only ever ran on the machine it was
 * installed on, so its id is probed here too. On a folder shared between
 * machines that can take the lock from a live run elsewhere, but refusing the
 * line forever would block every upgrade behind a hand delete.
 * @param {string} line Owner line read from the lock file.
 * @returns {boolean} True only when the writer is known to be gone.
 */
function isLockOwnerGone(line) {
  const pid = / pid=(\d+) /.exec(line);
  const host = / host=(\S+) /.exec(line);
  if (!pid) return false;
  if (host && host[1] !== os.hostname()) return false;
  try {
    process.kill(Number(pid[1]), 0);
  } catch (error) {
    return Boolean(error) && error.code === 'ESRCH';
  }
  return false;
}

/**
 * Delete a leftover file only when it is still the file that was judged stale.
 * Deleting by the shared path would also delete whatever another run wrote
 * there after the judgement. The file is renamed aside first: a rename is one
 * step, so only one run can take a given file. A file that turns out to be
 * another run's is put back, unless a newer one already stands in its place.
 * @param {string} filePath The shared path of the leftover.
 * @param {function(string): boolean} isJudgedStale Given the set-aside path,
 *   says whether that file is the one judged stale.
 * @returns {boolean} True when this run deleted the leftover.
 */
function removeLeftover(filePath, isJudgedStale) {
  const claimPath = `${filePath}.${process.pid}.${crypto.randomBytes(4).toString('hex')}.claim`;
  try {
    fs.renameSync(filePath, claimPath);
  } catch (error) {
    if (error && error.code === 'ENOENT') return false;
    throw error;
  }
  const isStale = isJudgedStale(claimPath);
  if (!isStale) {
    try {
      fs.linkSync(claimPath, filePath);
    } catch (linkError) {
      if (!linkError || linkError.code !== 'EEXIST') throw linkError;
    }
  }
  fs.unlinkSync(claimPath);
  return isStale;
}

/**
 * Try to take the overlay lock.
 * A lock whose writer has ended is removed and taken over, with one note saying
 * whose lock it was; every other held lock is left alone and reported.
 * Two runs can find the same leftover, and if each removed it the later removal
 * would delete the lock the other run has just written, leaving both holding it.
 * The removal therefore happens behind a `<lock>.takeover` marker: the run that
 * creates it re-reads the lock and creates the new lock before the marker goes.
 * A marker older than the timeout is what a run killed mid-takeover leaves, so
 * it is cleared rather than blocking every later run for good. Neither leftover
 * is deleted by its shared path: each is set aside first and deleted only when
 * it is the file that was judged stale (see removeLeftover).
 * @param {object} ctx Engine context.
 * @param {string} owner Who takes it, written at the start of the owner line.
 * @returns {{isHeld: boolean, lockPath: string, ownerLine: string, remedy?: string, release?: function}}
 *   A refusal carries `remedy`: the sentence telling the operator what to do
 *   about the thing that actually blocked the run.
 */
function acquireLock(ctx, owner) {
  const ownerLine = `${owner} pid=${process.pid} host=${os.hostname()} ${new Date().toISOString()}`;
  const takeoverPath = ctx.lockPath + LOCK_TAKEOVER_SUFFIX;

  /**
   * Report the lock as held by someone else.
   * @param {string} otherLine The line the lock file holds, or a sentence saying
   *   why no takeover could be made.
   * @param {string} [remedy] What the operator has to do next; defaults to
   *   removing the lock file by hand, which is wrong when the lock is not what
   *   blocked the run.
   * @returns {{isHeld: boolean, lockPath: string, ownerLine: string, remedy: string}}
   */
  function refusal(otherLine, remedy) {
    return {
      isHeld: false,
      lockPath: ctx.lockPath,
      ownerLine: otherLine,
      remedy: remedy === undefined ? 'remove ' + ctx.lockPath + ' by hand once that run has ended' : remedy,
    };
  }

  /**
   * Create the takeover marker, clearing one a killed run left behind.
   * @returns {number|null} The marker's descriptor, or null while another live
   *   run is taking the lock over.
   */
  function reserveTakeover() {
    try {
      return fs.openSync(takeoverPath, 'wx');
    } catch (error) {
      if (!error || error.code !== 'EEXIST') throw error;
    }
    let stats;
    try {
      stats = fs.statSync(takeoverPath);
    } catch (error) {
      if (error && error.code === 'ENOENT') return null;
      throw error;
    }
    // No live run can still be behind a marker this old, so it is a leftover
    // that would otherwise block every takeover from here on.
    if (Date.now() - stats.mtimeMs <= LOCK_TAKEOVER_STALE_MS) return null;
    // Two runs can judge the same marker stale at once. The one that comes
    // second must not delete the fresh marker the first has just written, so
    // only the file with the inode and timestamp judged above is removed.
    const isCleared = removeLeftover(takeoverPath, (claimPath) => {
      const claimed = fs.statSync(claimPath);
      return claimed.ino === stats.ino && claimed.mtimeMs === stats.mtimeMs;
    });
    if (!isCleared) return null;
    try {
      return fs.openSync(takeoverPath, 'wx');
    } catch (retryError) {
      if (!retryError || retryError.code !== 'EEXIST') throw retryError;
      return null;
    }
  }

  let fd;
  try {
    fd = fs.openSync(ctx.lockPath, 'wx');
  } catch (error) {
    if (!error || error.code !== 'EEXIST') throw error;
    const current = readBufferOrNull(ctx.lockPath);
    const currentLine = current ? current.toString('utf8').trim() : '(empty lock file)';
    if (!current || !isLockOwnerGone(currentLine)) return refusal(currentLine);
    const takeoverFd = reserveTakeover();
    if (takeoverFd === null) {
      // The lock is not what blocked this run, so the take-over marker is not the
      // operator's to delete: it is cleared by itself once it is old enough.
      return refusal(
        'another run is taking the overlay lock over: ' + takeoverPath,
        'run it again in a minute: a takeover marker that old is cleared'
      );
    }
    try {
      // The line was read before this run held the marker, so another run may
      // have finished its own takeover since; only the bytes judged stale above
      // are this run's to remove.
      const recheck = readBufferOrNull(ctx.lockPath);
      const recheckLine = recheck ? recheck.toString('utf8').trim() : '(empty lock file)';
      if (!recheck || recheckLine !== currentLine) return refusal(recheckLine);
      // A lock another run wrote after the read above is put back, and the
      // create below then finds it and reports that run as the holder.
      const isRemoved = removeLeftover(ctx.lockPath, (claimPath) => {
        const claimed = readBufferOrNull(claimPath);
        return Boolean(claimed) && claimed.equals(recheck);
      });
      if (isRemoved) console.log('note: took over the overlay lock of a run that has ended: ' + currentLine);
      try {
        fd = fs.openSync(ctx.lockPath, 'wx');
      } catch (retryError) {
        if (!retryError || retryError.code !== 'EEXIST') throw retryError;
        const taken = readBufferOrNull(ctx.lockPath);
        return refusal(taken ? taken.toString('utf8').trim() : '(empty lock file)');
      }
    } finally {
      fs.closeSync(takeoverFd);
      try {
        fs.unlinkSync(takeoverPath);
      } catch (unlinkError) {
        if (!unlinkError || unlinkError.code !== 'ENOENT') throw unlinkError;
      }
    }
  }
  try {
    fs.writeSync(fd, ownerLine + '\n');
  } finally {
    fs.closeSync(fd);
  }
  const lock = { isHeld: true, lockPath: ctx.lockPath, ownerLine };
  lock.release = () => {
    // Remove only our own lock: a file someone replaced by hand is theirs.
    const current = readBufferOrNull(ctx.lockPath);
    if (current && current.toString('utf8').trim() === ownerLine) fs.unlinkSync(ctx.lockPath);
  };
  return lock;
}

function lockStillOurs(ctx, lock) {
  if (!lock || !lock.isHeld || lock.lockPath !== ctx.lockPath) return false;
  const current = readBufferOrNull(ctx.lockPath);
  return current !== null && current.toString('utf8').trim() === lock.ownerLine;
}

/**
 * Run a step while holding the overlay lock, refusing when another run holds it.
 * A caller that already holds the lock across several steps passes it in
 * `options.lock`, and the step then runs without taking it a second time.
 * @param {object} ctx Engine context.
 * @param {string} owner Owner label for a newly taken lock.
 * @param {function} run Step to run; receives the lock and returns an exit code.
 * @param {{lock?: object}} [options]
 * @returns {number} The step's exit code, or 2 when the lock is held elsewhere.
 */
function withLock(ctx, owner, run, options = {}) {
  if (lockStillOurs(ctx, options.lock)) return run(options.lock);
  const lock = acquireLock(ctx, owner);
  if (!lock.isHeld) {
    console.log('refuse: the overlay lock is held: ' + lock.ownerLine);
    console.log('  ' + lock.remedy);
    return EXIT_ERROR;
  }
  try {
    return run(lock);
  } finally {
    lock.release();
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 12. STATUS AND THE FULL CHECK
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Run the full read-only check: every overlay plan, the layout links and the
 * generators' own check modes.
 * The plans come from the same analysis apply uses, so the check reads the same
 * accepted hashes: a destination that holds the last applied copy of a changed
 * overlay is pending work, not a rebase.
 * @param {object} ctx Engine context.
 * @param {object} manifest Loaded overlay manifest.
 * @param {object} state Loaded applied-hash state.
 * @param {object[]} plans Plans from analyze(), made with the accepted hashes.
 * @returns {{checked: number, ok: number, miss: number, problems: string[]}}
 */
function runCheck(ctx, manifest, state, plans) {
  const root = ctx.root;
  const problems = [];
  let misses = 0;
  const layout = planLayoutLinks(manifest, root, state);
  const layoutCount = (manifest.layoutLinks || []).length > 0 ? 1 : 0;
  for (const problem of layout.problems) problems.push(`layout: ${problem}`);
  for (const { link } of layout.missing) problems.push(`layout: ${link.path} is missing (link to ${link.target})`);
  if (layout.problems.length + layout.missing.length > 0) misses += 1;
  const rowsFor = (plan) => (plan.entry.scope === 'remove-root'
    ? Math.max(1, Array.isArray(plan.entry.paths) ? plan.entry.paths.length : 0)
    : 1);
  for (const plan of plans) {
    if (plan.problems.length > 0) {
      misses += rowsFor(plan);
      for (const problem of plan.problems) problems.push(`${plan.entry.id}: ${problem}`);
      continue;
    }
    if (plan.entry.scope === 'remove-root') {
      for (let index = 0; index < plan.outputs.length; index += 1) {
        if (!pathExists(plan.outputs[index].filePath)) continue;
        misses += 1;
        problems.push(`${plan.entry.id}: ${plan.entry.paths[index]} is still present`);
      }
      continue;
    }
    const changed = plan.writes.length + plan.deletes.length;
    if (changed > 0) {
      misses += 1;
      const sample = [...plan.writes.map((write) => path.relative(root, write.filePath)), ...plan.deletes.map((target) => path.relative(root, target))];
      problems.push(`${plan.entry.id}: ${changed} path(s) out of sync (${sample.slice(0, 3).join(', ')}${sample.length > 3 ? ', …' : ''})`);
    }
  }

  const generatedProblems = verifyGenerated(manifest, root);
  for (const problem of generatedProblems) problems.push(`generated: ${problem}`);

  const overlayChecks = plans.reduce((count, plan) => count + rowsFor(plan), 0);
  const checked = overlayChecks + 1 + layoutCount;
  const miss = misses + (generatedProblems.length > 0 ? 1 : 0);
  return { checked, ok: checked - miss, miss, problems };
}

/**
 * Every source field an overlay keeps off the layout. On the layout, a copy for
 * a destination under `.skilled/` sits inside the overlay folder at `framework/`
 * plus the rest of that path, and a copy for any other destination at `root/`
 * plus the destination with its leading dots dropped; a marked-section base sits
 * beside its fragment with `.base` before the extension. A copy kept elsewhere
 * still applies, so this names where it belongs instead of refusing the run.
 * @param {object} manifest Loaded overlay manifest.
 * @returns {{overlay: string, field: string, from: string, to: string}[]} One
 *   record per field off the layout, in manifest order.
 */
function layoutMoves(manifest) {
  const moves = [];
  const collect = (entry, field, current, layout) => {
    if (typeof current === 'string' && current !== layout) {
      moves.push({ overlay: entry.id, field, from: current, to: layout });
    }
  };
  for (const entry of manifest.overlays || []) {
    if (entry.scope === 'remove-root' || typeof entry.destination !== 'string') continue;
    const layout = adoptSource(entry.destination);
    if (entry.scope !== 'marked-section') {
      collect(entry, 'source', entry.source, layout);
      continue;
    }
    // A marked-section entry names the same copy twice when `source` matches
    // `fragment`, so both fields move together; a source that differs is some
    // other copy and stays where the entry put it.
    if (entry.source === entry.fragment) collect(entry, 'source', entry.source, layout);
    collect(entry, 'fragment', entry.fragment, layout);
    if (typeof entry.base === 'string') {
      const extension = path.posix.extname(layout);
      const base = extension === '' ? layout + '.base' : layout.slice(0, -extension.length) + '.base' + extension;
      collect(entry, 'base', entry.base, base);
    }
  }
  return moves;
}

function pathLabel(steps) {
  return steps.length > 0 ? steps.join('.') : 'the top level';
}

/**
 * The first path at which two parsed JSON values differ.
 * @param {*} left One value.
 * @param {*} right The other value.
 * @param {Array<string|number>} [at] Path walked so far.
 * @returns {Array<string|number>|null} The path, or null when the values are equal.
 */
function firstDifference(left, right, at = []) {
  if (deepEqual(left, right)) return null;
  const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
  if (Array.isArray(left) && Array.isArray(right)) {
    for (let index = 0; index < Math.max(left.length, right.length); index += 1) {
      if (index >= left.length || index >= right.length) return [...at, index];
      const found = firstDifference(left[index], right[index], [...at, index]);
      if (found) return found;
    }
  }
  if (isObject(left) && isObject(right)) {
    for (const key of [...new Set([...Object.keys(left), ...Object.keys(right)])].sort()) {
      if (!Object.hasOwn(left, key) || !Object.hasOwn(right, key)) return [...at, key];
      const found = firstDifference(left[key], right[key], [...at, key]);
      if (found) return found;
    }
  }
  return at;
}

function readEntrySet(ctx, entry) {
  const buffer = readBufferOrNull(path.join(ctx.overlayRoot, entry.source));
  if (!buffer) return null;
  try {
    const spec = JSON.parse(buffer.toString('utf8'));
    return spec && Array.isArray(spec.operations) ? spec : null;
  } catch {
    return null;
  }
}

/**
 * The json-entry operations whose path names an array item by its position.
 * Each still applies; the note tells the author that an item added or removed
 * before that position moves the operation onto another item. Every operation
 * kind walks its path the same way, so every kind is checked.
 * @param {object} entry Manifest overlay entry.
 * @param {object} spec Parsed entry set.
 * @returns {string[]} One note per operation.
 */
function untrackedOperationNotes(entry, spec) {
  const notes = [];
  for (const operation of spec.operations) {
    if (!operation || !Array.isArray(operation.path)) continue;
    if (operation.path.some((step) => Number.isInteger(step) || (typeof step === 'string' && /^\d+$/.test(step)))) {
      notes.push(`${entry.id}: ${operation.op} at ${pathLabel(operation.path)} goes through an array index, so it lands on ` +
        'another item when an item before it is added or removed');
    }
  }
  return notes;
}

/**
 * Compare an in-sync json-entry destination with the entry set applied to the
 * pinned copy. The live result is built from the live file, so a value nothing
 * records, such as one an older engine wrote and a later drop left behind,
 * reads as in sync there; the pinned copy carries no such history.
 * @param {object} record Classified destination.
 * @param {object} spec Parsed entry set.
 * @param {(key: string) => Buffer|null} readPinned Reads a path at the pin.
 * @returns {string|null} A note, or null when the two agree or no pinned copy exists.
 */
function crossCheckNote(record, spec, readPinned) {
  const pinned = readPinned(record.key);
  if (pinned === null) return null;
  const pinnedText = pinned.toString('utf8');
  let fromPin;
  try {
    fromPin = JSON.parse(applyJsonOperations(pinnedText, spec, {
      canReplaceExisting: true,
      readUpstreamText: () => pinnedText,
    }));
  } catch (error) {
    return `cross-check ${record.key}: the entry set cannot be applied to the pinned copy: ${error.message}`;
  }
  let live;
  try {
    live = JSON.parse(record.output.buffer.toString('utf8'));
  } catch {
    return null;
  }
  const difference = firstDifference(live, fromPin);
  if (difference === null) return null;
  return `cross-check ${record.key}: the live file differs from the entry set applied to the pinned copy ` +
    `at ${pathLabel(difference)}; no record covers that value, unless a regenerate step that leaves ` +
    `${record.key} out of its outputs wrote it`;
}

/**
 * The lines status prints beside its check that never fail it: what the run
 * could not check, and what the engine keeps no record of.
 * @param {object} ctx Engine context.
 * @param {object} manifest Loaded overlay manifest.
 * @param {object} state Loaded applied-hash state.
 * @param {object} analysis Analysis of the tree.
 * @returns {string[]} One line per note, without its prefix.
 */
function statusNotes(ctx, manifest, state, analysis, { isAudit = false } = {}) {
  const notes = [];
  if (state.loadedVersion === 1) {
    notes.push(`${STATE_FILE} is schema version 1; the next apply rewrites it as version 2. A script that still ` +
      'writes version 1 drops the records of the items and values the json-entry overlays wrote');
  }
  const pin = manifest.pin || {};
  const readPinned = pinnedUpstreamBytes(manifest);
  // A checkout that never fetched the pinned commit reads back nothing for
  // every path, which would pass both checks below without comparing anything.
  const isPinReadable = readPinned !== null && resolveCommit(pin.checkout, pin.commit) !== null;
  const { rootFiles } = repinSettings(manifest);
  const hasPinnedRootFile = manifest.overlays.some((entry) => PINNED_UPSTREAM_SCOPES.has(entry.scope) &&
    entry.pinnedSha256 && rootFiles.includes(entry.destination));
  const skipped = [];
  if (!isPinReadable && hasPinnedRootFile) skipped.push('the stale root-file check');
  if (!isPinReadable && manifest.overlays.some((entry) => entry.scope === 'json-entry')) {
    skipped.push('the json-entry cross-check');
  }
  if (skipped.length > 0) {
    const fix = readPinned === null
      ? "name it in the manifest's pin.checkout"
      : `fetch commit ${pin.commit} into ${pin.checkout}`;
    notes.push(`no upstream checkout at the pin, so ${skipped.join(' and ')} ` +
      `${skipped.length === 1 ? 'was' : 'were'} skipped; ${fix}`);
  }
  for (const entry of manifest.overlays) {
    if (entry.scope !== 'json-entry') continue;
    const spec = readEntrySet(ctx, entry);
    if (spec) notes.push(...untrackedOperationNotes(entry, spec));
  }
  for (const plan of analysis.plans) notes.push(...(plan.warnings || []));
  if (!isPinReadable) return notes;
  // The audit lists a missing path as its own finding, so the note would repeat it.
  if (!isAudit) {
    const missing = missingUnownedPaths(ctx, manifest);
    if (missing.length > 0) notes.push(missingPathsNote(missing));
  }
  // A regenerate step rewrites its outputs after the entry sets apply, so the
  // pinned copy says nothing about what such a file should hold.
  const generated = new Set((manifest.regenerate || [])
    .flatMap((step) => (Array.isArray(step.outputs) ? step.outputs : []))
    .filter((output) => typeof output === 'string')
    .map((output) => path.posix.normalize(output)));
  for (const record of analysis.records) {
    if (record.layout || record.state !== 'in-sync' || record.plan.entry.scope !== 'json-entry' ||
        !record.output || record.output.buffer === null || generated.has(path.posix.normalize(record.key))) continue;
    const spec = readEntrySet(ctx, record.plan.entry);
    const note = spec ? crossCheckNote(record, spec, readPinned) : null;
    if (note) notes.push(note);
  }
  return notes;
}

/**
 * Report every destination not in sync, then run the full check.
 * @param {object} ctx Engine context.
 * @param {{isJson?: boolean, isAudit?: boolean}} [options] `isAudit` also
 *   compares the vendored tree with the pin, for the paths no overlay owns.
 * @returns {number} 0 when everything is in sync, 1 otherwise.
 */
function commandStatus(ctx, options = {}) {
  const manifest = loadManifest(ctx);
  const state = loadState(ctx, manifest);
  const analysis = analyze(ctx, manifest, state);
  const check = runCheck(ctx, manifest, state, analysis.plans);
  const audit = options.isAudit ? auditVendoredTree(ctx, manifest) : null;
  const outOfSync = analysis.records.filter((record) => record.state !== 'in-sync');
  const stale = staleRootFiles(manifest);
  const offLayout = layoutMoves(manifest);
  const notes = statusNotes(ctx, manifest, state, analysis, { isAudit: Boolean(options.isAudit) });
  const isInSync = outOfSync.length === 0 && analysis.blocked.length === 0 && check.miss === 0 &&
    stale.length === 0 && (audit === null || audit.findings.length === 0);

  if (options.isJson) {
    const report = {
      result: isInSync ? 'PASSED' : 'FAILED',
      root: ctx.root,
      overlayFolder: ctx.overlayLabel,
      counts: stateCounts(analysis.records),
      destinations: outOfSync.map((record) => ({
        state: record.state,
        key: record.key,
        kind: record.layout ? 'layout-link' : (record.removal ? 'remove-root' : 'overlay'),
        overlay: record.layout ? null : record.plan.entry.id,
        source: record.source ? ctx.overlayLabel + '/' + record.source : null,
        fix: fixFor(ctx, record),
      })),
      staleRootFiles: stale,
      offLayout,
      notes,
      check,
    };
    if (audit) report.audit = audit;
    console.log(JSON.stringify(report, null, 2));
    return isInSync ? EXIT_OK : EXIT_CONFLICT;
  }

  for (const record of outOfSync) console.log(problemLine(ctx, record));
  console.log(stateSummary(analysis.records));
  for (const problem of check.problems) console.log(`MISS     ${problem}`);
  // A re-pin never copies a root file, so an upstream move to an owned one is
  // outstanding work no destination line can report, and this comparison is the
  // only place status sees it between re-pins.
  for (const entry of stale) {
    console.log(`STALE    root-file ${entry.path}: upstream changed it since overlay ${entry.overlay} was pinned; ` +
      'rebase the overlay, then update its pinnedSha256');
  }
  // Relayout refuses a move into root/skilled, so each line, and the count of the
  // moves past the cap, names the fix the operator can make instead of a run
  // that would stop.
  for (const move of offLayout.slice(0, LAYOUT_SHOWN)) {
    const remedy = isUnderRootSkilled(move.to)
      ? 'change the destination or remove the entry'
      : `run ${ENGINE_COMMAND} apply --relayout`;
    console.log(`LAYOUT   ${move.overlay}: ${move.field} ${move.from} belongs at ${move.to}; ${remedy}`);
  }
  if (offLayout.length > LAYOUT_SHOWN) {
    const hidden = offLayout.slice(LAYOUT_SHOWN);
    const blocked = hidden.filter((move) => isUnderRootSkilled(move.to)).length;
    const movable = hidden.length - blocked;
    const remedy = blocked === 0
      ? `; run ${ENGINE_COMMAND} apply --relayout`
      : movable === 0
        ? ' under root/skilled; change the destination or remove the entry'
        : `; run ${ENGINE_COMMAND} apply --relayout for ${movable}, and change the destination or remove the ` +
          `entry for the ${blocked} under root/skilled`;
    console.log(`LAYOUT   … ${hidden.length} more${remedy}`);
  }
  for (const note of notes) console.log(`NOTE     ${note}`);
  if (audit) {
    for (const finding of audit.findings) console.log(`AUDIT    ${finding.kind} ${finding.path}`);
    if (!audit.isAvailable) console.log('AUDIT    skipped: no upstream checkout at the pin');
    console.log(`audit=${audit.findings.length}`);
  }
  console.log(`checked=${check.checked} ok=${check.ok} miss=${check.miss}`);
  console.log(isInSync ? 'RESULT: PASSED' : 'RESULT: FAILED');
  return isInSync ? EXIT_OK : EXIT_CONFLICT;
}

// ─────────────────────────────────────────────────────────────────────────────
// 13. APPLY
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The items, sets and keys each entry set still lists. One it dropped has just
 * left the live file, and a destination with none listed keeps no key at all.
 * @param {object[]} plans The plans whose writes the run applied.
 * @returns {{items: Record<string, object[]>, sets: Record<string, object[]>,
 *   keys: Record<string, object[]>}}
 */
function listedRecords(plans) {
  const items = {};
  const sets = {};
  const keys = {};
  for (const plan of plans) {
    if (plan.listedItems && plan.listedItems.length > 0) items[plan.entry.destination] = plan.listedItems;
    if (plan.listedSets && plan.listedSets.length > 0) sets[plan.entry.destination] = plan.listedSets;
    if (plan.listedKeys && plan.listedKeys.length > 0) keys[plan.entry.destination] = plan.listedKeys;
  }
  return { items, sets, keys };
}

/**
 * The state a run leaves once its writes are on disk: each destination's hash
 * of what its overlay wants there, the layout links standing at their targets,
 * and the items, sets and keys the entry sets still list.
 * @param {string} root Destination tree root.
 * @param {object} manifest Loaded overlay manifest.
 * @param {object[]} records Classified destinations whose desired bytes are recorded.
 * @param {object[]} plans The plans whose writes the run applied, which name the
 *   items and sets as their own even after a later analysis sees them as live.
 * @returns {{pin: string, files: Record<string, string>, links: Record<string, string>,
 *   items: Record<string, object[]>, sets: Record<string, object[]>, keys: Record<string, object[]>}}
 */
function stateAfterWrites(root, manifest, records, plans) {
  const files = {};
  for (const record of records) {
    if (record.output && record.output.buffer !== null) files[record.key] = sha256(record.output.buffer);
  }
  const links = {};
  for (const link of manifest.layoutLinks || []) {
    const linkPath = path.join(root, link.path);
    let stats = null;
    try {
      stats = fs.lstatSync(linkPath);
    } catch (error) {
      if (!error || error.code !== 'ENOENT') throw error;
    }
    // Only a link standing at the manifest's target is recorded as the
    // engine's own: that record is what lets a later apply retarget it.
    if (stats && stats.isSymbolicLink() && fs.readlinkSync(linkPath) === link.target) {
      links[link.path] = link.target;
    }
  }
  return { pin: manifest.pin.commit, files, links, ...listedRecords(plans) };
}

/**
 * Apply every overlay edit; the caller holds the lock.
 * @param {object} ctx Engine context.
 * @param {object} manifest Loaded overlay manifest.
 * @param {{isRegenerateForced?: boolean, outcome?: object,
 *   upstreamBytes?: ((key: string) => Buffer|null)|null}} [options] A re-pin
 *   regenerates even when no overlay wrote, because the copy changed the inputs;
 *   `outcome.changed` receives the count printed on the last line;
 *   `upstreamBytes` reads the pin this run compares against.
 * @returns {number} 0 when applied, 1 on conflict or a failed step.
 */
function applyUnderLock(ctx, manifest, options = {}) {
  const root = ctx.root;
  const state = loadState(ctx, manifest);
  const analysis = analyze(ctx, manifest, state, options.upstreamBytes);
  const blockers = analysis.records.filter((record) => BLOCKING_STATES.has(record.state));
  const layoutProblems = analysis.layout.problems;
  if (blockers.length > 0 || analysis.blocked.length > 0 || layoutProblems.length > 0) {
    // Nothing is written when one overlay cannot be applied on its own: a
    // half-applied set is worse than an untouched tree.
    if (blockers.length > 0) {
      printProblems(ctx, analysis.records);
      // A destination whose desired bytes could not be computed has no line of
      // its own saying why, so the plan's own reason is printed beside it.
      for (const record of blockers) {
        for (const problem of (record.plan && record.plan.problems) || []) console.log(`BLOCKED  ${record.plan.entry.id}: ${problem}`);
      }
    }
    for (const plan of analysis.blocked) {
      for (const problem of plan.problems) console.log(`BLOCKED  ${plan.entry.id}: ${problem}`);
    }
    for (const problem of layoutProblems) console.log(`BLOCKED  layout: ${problem}`);
    if (analysis.blocked.length > 0 || layoutProblems.length > 0) {
      console.log(`blocked=${analysis.blocked.length + (layoutProblems.length > 0 ? 1 : 0)} changed=0`);
    }
    return EXIT_CONFLICT;
  }

  const changedRecords = analysis.records.filter((record) => record.state === 'overlay-edited' && !record.layout);
  const layoutRecords = analysis.records.filter((record) => record.layout);
  const plansToApply = new Set(changedRecords.map((record) => record.plan));
  let written = 0;
  for (const plan of plansToApply) written += applyOnePlan(plan, root);

  // The links are restored before the regeneration steps run: a route resolving
  // skills through one of them reads nothing until the link exists.
  for (const record of layoutRecords) {
    applyLayoutLink(root, record.link, record.isRetarget);
    console.log('linked ' + record.key + ' -> ' + record.target);
  }

  // A regeneration an earlier run left unfinished runs again even when nothing
  // is written now: that run's writes are already live, so the tree is in sync
  // with its overlays but not yet rebuilt from them.
  const isRegenerated = written > 0 || options.isRegenerateForced === true || state.regeneratePending === true;
  // What this run wrote is recorded before any step that can still fail. A run
  // that stopped later would otherwise leave items it added with no record, and
  // a later drop of them would leave them in the file without a word.
  writeStateIfChanged(ctx, {
    ...stateAfterWrites(root, manifest, analysis.records, analysis.plans),
    regeneratePending: isRegenerated && (manifest.regenerate || []).length > 0,
  });
  let rewrittenBy = new Map();
  if (isRegenerated) {
    const owned = analysis.records.filter((record) => !record.layout && !record.removal).map((record) => record.key);
    const regeneration = regenerate(manifest, root, owned);
    rewrittenBy = regeneration.rewrittenBy;
    for (const { step, result } of regeneration.failed) {
      const output = ((result.stdout || '') + (result.stderr || '')).trim().split('\n').slice(-3).join(' | ');
      console.log('regen ' + step.id + ': FAILED exit=' + result.status + ' ' + output);
    }
    if (regeneration.failed.length > 0) {
      console.log('regeneration failed for ' + regeneration.failed.length + ' step(s); the tree is only partly rebuilt');
      return EXIT_CONFLICT;
    }
  }

  // The check after the write reads the sets and keys this run left listed and
  // not the ones it started with: one this run took back has left the file, and
  // reading its old record against the written file would judge the run's own
  // work as a stranger's edit.
  const { sets, keys } = listedRecords(analysis.plans);
  const updated = analyze(ctx, manifest, { ...state, sets, keys }, options.upstreamBytes);
  const unresolved = updated.records.filter((record) => record.state !== 'in-sync');
  if (unresolved.length > 0) {
    for (const record of unresolved) {
      const stepIds = record.layout ? undefined : rewrittenBy.get(record.key);
      console.log(stepIds ? regeneratedLine(ctx, record, stepIds) : problemLine(ctx, record));
    }
    return EXIT_CONFLICT;
  }
  writeStateIfChanged(ctx, stateAfterWrites(root, manifest, updated.records, analysis.plans));

  // The applied hashes are recorded first: they describe the destinations, which
  // are in sync, whatever the generators' own checks say next.
  const generatedProblems = isRegenerated ? verifyGenerated(manifest, root) : [];
  for (const problem of generatedProblems) console.log(`MISS     generated: ${problem}`);
  const changed = changedRecords.length + layoutRecords.length;
  if (options.outcome) options.outcome.changed = changed;
  console.log(changed + ' changed');
  return generatedProblems.length > 0 ? EXIT_CONFLICT : EXIT_OK;
}

/**
 * Apply every overlay edit under the lock, then regenerate and verify.
 * @param {object} ctx Engine context.
 * @param {{lock?: object}} [options] A lock the caller already holds.
 * @returns {number} 0 when applied, 1 on conflict, 2 when the lock is held.
 */
function commandApply(ctx, options = {}) {
  const manifest = loadManifest(ctx);
  return withLock(ctx, 'overlay-engine apply', () => applyUnderLock(ctx, manifest), options);
}

// ─────────────────────────────────────────────────────────────────────────────
// 14. CAPTURE
// ─────────────────────────────────────────────────────────────────────────────

function directoryRelative(rootDirectory, filePath) {
  const relative = path.relative(rootDirectory, filePath);
  if (relative === '' || !isWithin(rootDirectory, filePath)) return null;
  return toPosix(relative);
}

function captureCandidates(root, inputPath) {
  if (path.isAbsolute(inputPath)) return [path.resolve(inputPath)];
  return [path.resolve(root, inputPath), path.resolve(process.cwd(), inputPath)];
}

/**
 * Find the overlay that owns a capture candidate.
 * @param {object} ctx Engine context.
 * @param {object} manifest Loaded overlay manifest.
 * @param {string} candidate Absolute path inside the tree.
 * @returns {object|null} The capture record, or null when no overlay owns it.
 */
function captureRecordForPath(ctx, manifest, candidate) {
  const root = ctx.root;
  if (!isWithin(root, candidate) || candidate === root) return null;
  const key = toPosix(path.relative(root, candidate));
  for (const entry of manifest.overlays) {
    if (entry.scope === 'remove-root') {
      for (const relativePath of entry.paths || []) {
        const removalPath = resolveRemoveRootPath(root, relativePath);
        if (!isWithin(removalPath, candidate)) continue;
        return { entry, key, destinationPath: candidate, removal: true, removalOwner: 'remove-root row ' + entry.id };
      }
      continue;
    }
    const destinationPath = path.resolve(root, entry.destination);
    if (entry.scope === 'file' && candidate === destinationPath) {
      return { entry, key, destinationPath, sourcePath: path.resolve(ctx.overlayRoot, entry.source) };
    }
    if (entry.scope === 'marked-section' && candidate === destinationPath) {
      return { entry, key, destinationPath, sourcePath: path.resolve(ctx.overlayRoot, entry.fragment) };
    }
    if (entry.scope === 'json-entry' && candidate === destinationPath) {
      return { entry, key, destinationPath, sourcePath: path.resolve(ctx.overlayRoot, entry.source) };
    }
    if (entry.scope === 'directory') {
      const relative = directoryRelative(destinationPath, candidate);
      if (relative === null) continue;
      const sourcePath = path.resolve(ctx.overlayRoot, entry.source, relative);
      return { entry, key, destinationPath: candidate, sourcePath };
    }
    if (entry.scope === 'skill-root') {
      const relative = directoryRelative(destinationPath, candidate);
      if (relative === null) continue;
      const isReplacement = (entry.replace || []).some((replacement) =>
        relative === replacement || relative.startsWith(replacement + '/'));
      const sourcePath = path.resolve(ctx.overlayRoot, entry.source, relative);
      const isKept = [...keptRetainedPaths(entry, path.resolve(ctx.overlayRoot, entry.source))].some((kept) =>
        relative === kept || relative.startsWith(kept + '/'));
      if (isReplacement && !isKept) {
        return { entry, key, destinationPath: candidate, sourcePath };
      }
      const isRemoved = (entry.remove || []).some((removed) =>
        relative === removed || relative.startsWith(removed + '/'));
      if (isRemoved) {
        return { entry, key, destinationPath: candidate, removal: true, removalOwner: 'overlay ' + entry.id };
      }
    }
  }
  return null;
}

function extractMarkedSection(entry, live) {
  const text = live.toString('utf8');
  const begin = text.indexOf(entry.beginMarker);
  if (begin < 0) throw new Error('live file is missing the begin marker');
  const endMarker = text.indexOf(entry.endMarker, begin);
  if (endMarker < 0) throw new Error('live file is missing the end marker');
  if (typeof entry.insertBefore === 'string') {
    // A placed block's fragment ends with the separator that leads into the
    // anchor line, so the capture runs up to that line, the same span apply writes.
    const anchorAt = anchorLineOffset(text, entry.insertBefore, endMarker);
    if (anchorAt < 0) throw new Error('live file is missing the insertBefore line');
    return Buffer.from(text.slice(begin, anchorAt), 'utf8');
  }
  let end = endMarker + entry.endMarker.length;
  if (text.slice(end, end + 2) === '\r\n') end += 2;
  else if (text[end] === '\n') end += 1;
  return Buffer.from(text.slice(begin, end), 'utf8');
}

/**
 * Capture one live edit; the caller holds the lock.
 * @param {object} ctx Engine context.
 * @param {object} manifest Loaded overlay manifest.
 * @param {string} inputPath Destination path as the caller named it.
 * @returns {number} 0 when captured, 1 when not live-edited, 2 on refusal.
 */
function captureUnderLock(ctx, manifest, inputPath) {
  const root = ctx.root;
  let record = null;
  for (const candidate of captureCandidates(root, inputPath)) {
    record = captureRecordForPath(ctx, manifest, candidate);
    if (record) break;
  }
  if (!record) {
    console.log('refuse: path is not an overlay destination: ' + inputPath);
    return EXIT_ERROR;
  }
  if (record.removal) {
    console.log('refuse: ' + record.key + ' is scheduled for removal by ' + record.removalOwner + '; capture is not supported');
    return EXIT_ERROR;
  }
  if (isCaptureRestricted(ctx, record, inputPath)) {
    console.log('refuse: protected capture path: ' + record.key);
    return EXIT_ERROR;
  }
  if (record.entry.scope === 'json-entry') {
    console.log('refuse: edit ' + ctx.overlayLabel + '/' + sourceRelative(ctx, record.sourcePath) + ' instead');
    return EXIT_ERROR;
  }
  if (!['directory', 'skill-root'].includes(record.entry.scope) && !isFile(record.sourcePath)) {
    console.log(record.entry.id + ': canonical source is missing: ' + sourceRelative(ctx, record.sourcePath));
    return EXIT_ERROR;
  }
  if (!isFile(record.destinationPath)) {
    console.log('refuse: live destination is not a regular file: ' + record.key);
    return EXIT_ERROR;
  }
  const livePath = canonicalPath(record.destinationPath);
  if (isCaptureRestricted(ctx, record, livePath)) {
    console.log('refuse: protected capture path: ' + record.key);
    return EXIT_ERROR;
  }
  const state = loadState(ctx, manifest);
  const analysis = analyze(ctx, manifest, state);
  const classified = analysis.records.find((item) => item.key === record.key);
  if (!classified) {
    console.log('refuse: path is not an overlay destination: ' + inputPath);
    return EXIT_ERROR;
  }
  if (classified.state === 'in-sync') {
    console.log('nothing to capture');
    return EXIT_OK;
  }
  if (classified.state !== 'live-edited') {
    printProblems(ctx, [classified]);
    // The same reason apply prints for this destination: a capture and an apply
    // that both refuse it have to read the same way.
    for (const problem of (classified.plan && classified.plan.problems) || []) {
      console.log(`BLOCKED  ${classified.plan.entry.id}: ${problem}`);
    }
    return EXIT_CONFLICT;
  }
  const live = fs.readFileSync(record.destinationPath);
  const source = record.entry.scope === 'marked-section'
    ? extractMarkedSection(record.entry, live)
    : live;
  fs.mkdirSync(path.dirname(record.sourcePath), { recursive: true });
  fs.writeFileSync(record.sourcePath, source);

  const files = { ...state.files, [record.key]: sha256(live) };
  writeStateIfChanged(ctx, {
    pin: state.exists ? state.pin : manifest.pin.commit,
    files,
    links: state.links,
    items: state.items,
    sets: state.sets,
  });
  console.log('captured ' + record.key);
  return EXIT_OK;
}

/**
 * Copy a live edit to an overlay destination back into its overlay source.
 * @param {object} ctx Engine context.
 * @param {string} inputPath Destination path, relative to the root or the cwd.
 * @param {{lock?: object}} [options] A lock the caller already holds.
 * @returns {number} 0 when captured, 1 when not live-edited, 2 on refusal.
 */
function commandCapture(ctx, inputPath, options = {}) {
  const manifest = loadManifest(ctx);
  return withLock(ctx, 'overlay-engine capture', () => captureUnderLock(ctx, manifest, inputPath), options);
}

// ─────────────────────────────────────────────────────────────────────────────
// 15. GUARD
//
// Answers one question, whether a path is owned by an overlay, and writes
// nothing: a live edit to an owned path is lost at the next re-copy, so the
// caller is told to edit the overlay instead.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * List every live path an overlay owns, for the guard.
 * @param {object} ctx Engine context.
 * @param {object} manifest Loaded overlay manifest.
 * @returns {object[]} Records with the entry, destination and source path.
 */
function destinationCandidates(ctx, manifest) {
  const root = ctx.root;
  const records = [];
  for (const entry of manifest.overlays) {
    if (entry.scope === 'remove-root') {
      for (const relativePath of entry.paths || []) {
        records.push({ entry, destinationPath: resolveRemoveRootPath(root, relativePath), removal: true, removalOwner: 'remove-root row ' + entry.id });
      }
      continue;
    }
    const destinationPath = path.resolve(root, entry.destination);
    if (!isWithin(root, destinationPath)) throw new Error(entry.id + ': destination escapes the sync root');
    if (entry.scope === 'file' || entry.scope === 'json-entry') {
      records.push({ entry, destinationPath, sourcePath: path.resolve(ctx.overlayRoot, entry.source) });
      continue;
    }
    if (entry.scope === 'marked-section') {
      records.push({ entry, destinationPath, sourcePath: path.resolve(ctx.overlayRoot, entry.fragment) });
      continue;
    }
    if (entry.scope === 'directory') {
      const sourceDirectory = path.resolve(ctx.overlayRoot, entry.source);
      for (const sourcePath of listTreePaths(sourceDirectory)) {
        if (!isFile(sourcePath)) continue;
        const relative = path.relative(sourceDirectory, sourcePath);
        records.push({ entry, destinationPath: path.join(destinationPath, relative), sourcePath });
      }
      for (const livePath of listTreePaths(destinationPath)) {
        const relative = path.relative(destinationPath, livePath);
        if (records.some((record) => record.entry === entry && path.resolve(record.destinationPath) === path.resolve(livePath))) continue;
        records.push({ entry, destinationPath: livePath, sourcePath: path.join(sourceDirectory, relative) });
      }
      continue;
    }
    if (entry.scope === 'skill-root') {
      const sourceDirectory = path.resolve(ctx.overlayRoot, entry.source);
      const retained = new Set((entry.retained || []).map((item) => item.path));
      const kept = keptRetainedPaths(entry, sourceDirectory);
      const owned = new Set();
      for (const replacement of entry.replace || []) {
        const sourcePath = path.join(sourceDirectory, replacement);
        const destinationReplacement = path.join(destinationPath, replacement);
        const relativePaths = isDirectory(sourcePath)
          ? listTreePaths(sourcePath).filter(isFile).map((item) => path.relative(sourceDirectory, item))
          : (isFile(sourcePath) ? [replacement] : []);
        for (const relative of relativePaths) {
          if (kept.has(relative)) continue;
          owned.add(relative);
          records.push({ entry, destinationPath: path.join(destinationPath, relative), sourcePath: path.join(sourceDirectory, relative) });
        }
        const livePaths = isDirectory(destinationReplacement)
          ? listTreePaths(destinationReplacement)
          : (pathExists(destinationReplacement) ? [destinationReplacement] : []);
        for (const livePath of livePaths) {
          if (!isFile(livePath)) continue;
          const relative = path.relative(destinationPath, livePath);
          if (kept.has(relative) || owned.has(relative)) continue;
          owned.add(relative);
          records.push({ entry, destinationPath: livePath, sourcePath: path.join(sourceDirectory, relative) });
        }
      }
      for (const removed of entry.remove || []) {
        const removedPath = path.join(destinationPath, removed);
        const livePaths = isDirectory(removedPath)
          ? listTreePaths(removedPath)
          : (pathExists(removedPath) ? [removedPath] : []);
        for (const livePath of livePaths) {
          if (!isFile(livePath)) continue;
          const relative = path.relative(destinationPath, livePath);
          if (retained.has(relative) || owned.has(relative)) continue;
          owned.add(relative);
          records.push({ entry, destinationPath: livePath, sourcePath: path.join(sourceDirectory, relative), removal: true, removalOwner: 'overlay ' + entry.id });
        }
      }
    }
  }
  return records;
}

/**
 * Answer whether a path is owned by an overlay. Never writes.
 * @param {object} ctx Engine context.
 * @param {string} inputPath Path to test, relative to the cwd or absolute.
 * @returns {number} 0 to allow, 1 to refuse.
 */
function commandGuard(ctx, inputPath) {
  const root = ctx.root;
  const manifest = loadManifest(ctx);
  const candidate = canonicalPath(path.resolve(process.cwd(), inputPath));
  const removalCandidate = canonicalPathWithoutLeaf(path.resolve(process.cwd(), inputPath));
  const lexicalCandidate = path.resolve(process.cwd(), inputPath);
  for (const record of destinationCandidates(ctx, manifest)) {
    if (record.removal) {
      const removalPath = canonicalPathWithoutLeaf(record.destinationPath);
      const isLexicalMatch = isWithin(record.destinationPath, lexicalCandidate);
      const isCanonicalMatch = isWithin(removalPath, removalCandidate);
      if (!isLexicalMatch && !isCanonicalMatch) continue;
      const destination = isWithin(root, lexicalCandidate)
        ? relativeKey(root, lexicalCandidate)
        : relativeKey(canonicalPath(root), removalCandidate);
      console.log('refuse: ' + destination + ' is scheduled for removal by ' + record.removalOwner);
      return EXIT_CONFLICT;
    }
    if (!pathExists(record.destinationPath)) continue;
    if (canonicalPath(record.destinationPath) !== candidate) continue;
    const destination = relativeKey(root, record.destinationPath);
    const source = sourceRelative(ctx, record.sourcePath);
    console.log('refuse: ' + destination + ' is owned by ' + ctx.overlayLabel + '/' + source +
      '; edit the overlay, then run ' + ENGINE_COMMAND + ' apply');
    return EXIT_CONFLICT;
  }
  const refusal = strictWriteRefusal(ctx, manifest, inputPath);
  if (refusal) {
    console.log(refusal);
    return EXIT_CONFLICT;
  }
  console.log('allow');
  return EXIT_OK;
}

// ─────────────────────────────────────────────────────────────────────────────
// 16. REPIN
//
// A re-pin replaces the tree's upstream files with a newer commit and puts the
// overlays back on top. It copies the `.skilled` paths upstream changed, so the
// files the project regenerates stay put unless upstream changed them, and the
// runtime folders whole, because no generator restores a drifted runtime file.
// Three rules keep it reversible:
//   1. The paths it touches are computed once, and that one list drives both
//      the backup and the copy, so nothing is written that was not backed up.
//   2. An unowned file that differs from the old pin stops the run before any
//      write: the copy would silently revert an edit someone made in place.
//   3. Every failure after the backup names the run that --rollback restores.
// ─────────────────────────────────────────────────────────────────────────────

function runGit(upstream, args, env) {
  const result = spawnSync('git', ['-C', upstream, ...args], { encoding: 'buffer', maxBuffer: GIT_MAX_BUFFER, env });
  if (result.error) throw result.error;
  return result;
}

/**
 * Read a path's bytes at one commit of an upstream checkout.
 * @param {string} upstream Upstream checkout.
 * @param {string} commit Commit id.
 * @returns {(key: string) => Buffer|null}
 */
function commitBytesReader(upstream, commit) {
  return (key) => {
    const result = runGit(upstream, ['cat-file', 'blob', '--end-of-options', `${commit}:${key}`]);
    return result.status === 0 ? result.stdout : null;
  };
}

/**
 * Read a path's bytes from an extracted commit tree.
 * @param {string} tree Folder holding the commit's roots.
 * @returns {(key: string) => Buffer|null}
 */
function treeBytesReader(tree) {
  return (key) => {
    const filePath = path.join(tree, key);
    return isFile(filePath) ? fs.readFileSync(filePath) : null;
  };
}

/**
 * Read a path's bytes at the commit the manifest records, when the manifest
 * names the checkout that holds it. Without that checkout there is nothing to
 * compare, and the caller keeps its no-state classification.
 * @param {object} manifest Loaded overlay manifest.
 * @returns {((key: string) => Buffer|null)|null}
 */
function pinnedUpstreamBytes(manifest) {
  const pin = manifest.pin || {};
  if (typeof pin.checkout !== 'string' || typeof pin.commit !== 'string' ||
      !isDirectory(pin.checkout)) return null;
  return commitBytesReader(pin.checkout, pin.commit);
}

function gitText(upstream, args) {
  const result = runGit(upstream, args);
  if (result.status !== 0) {
    throw new Error('git ' + args[0] + ' failed in ' + upstream + ': ' + result.stderr.toString('utf8').trim());
  }
  return result.stdout.toString('utf8');
}

function resolveCommit(upstream, commit) {
  const result = runGit(upstream, ['rev-parse', '--verify', '--quiet', '--end-of-options', commit + '^{commit}']);
  return result.status === 0 ? result.stdout.toString('utf8').trim() : null;
}

function objectFormat(upstream) {
  const result = runGit(upstream, ['rev-parse', '--show-object-format']);
  return result.status === 0 && result.stdout.toString('utf8').trim() === 'sha256' ? 'sha256' : 'sha1';
}

// The object id git gives these bytes, so a live file can be compared with a
// pinned one without reading the pinned bytes out of the repository.
function gitBlobId(format, buffer) {
  return crypto.createHash(format).update(`blob ${buffer.length}\0`).update(buffer).digest('hex');
}

/**
 * List the blobs below the given roots at one commit.
 * Submodule entries are left out: an archive carries no bytes for them.
 * @param {string} upstream Upstream checkout.
 * @param {string} commit Full commit id.
 * @param {string[]} roots Root folders, relative to the repository root.
 * @returns {Map<string, {mode: string, object: string}>} Blobs keyed by path.
 */
function listBlobs(upstream, commit, roots) {
  const entries = new Map();
  const output = gitText(upstream, ['ls-tree', '-r', '-z', '--full-tree', commit, '--', ...roots]);
  for (const record of output.split('\0')) {
    if (!record) continue;
    const tab = record.indexOf('\t');
    const [mode, type, object] = record.slice(0, tab).split(' ');
    if (type === 'blob') entries.set(record.slice(tab + 1), { mode, object });
  }
  return entries;
}

function diffNames(upstream, oldCommit, newCommit, filter, roots) {
  const output = gitText(upstream, ['diff', '--no-ext-diff', '--name-only', '-z', '--no-renames',
    '--diff-filter=' + filter, oldCommit, newCommit, '--', ...roots]);
  return output.split('\0').filter(Boolean);
}

function normalizedRelative(value, label) {
  const normalized = typeof value === 'string' ? path.posix.normalize(value).replace(/\/+$/, '') : '';
  if (normalized === '' || normalized === '.' || normalized === '..' || normalized.startsWith('../') ||
      path.isAbsolute(value) || value.includes('\\') || value.includes('\0')) {
    throw new Error(`${label} must name a relative path inside the tree: ${String(value)}`);
  }
  return normalized;
}

function isUnderAny(relativePath, prefixes) {
  return prefixes.some((prefix) => relativePath === prefix || relativePath.startsWith(prefix + '/'));
}

/**
 * Read the manifest's optional `repin` block.
 * @param {object} manifest Loaded overlay manifest.
 * @returns {{roots: string[], runtimeFolders: string[], exclude: string[], rootFiles: string[]}}
 */
function repinSettings(manifest) {
  const settings = manifest.repin === undefined ? {} : manifest.repin;
  if (!settings || typeof settings !== 'object' || Array.isArray(settings)) {
    throw new Error('the manifest repin block must be an object');
  }
  const listOf = (key, fallback) => {
    const value = settings[key] === undefined ? fallback : settings[key];
    if (!Array.isArray(value)) throw new Error(`repin.${key} must be a list of paths`);
    return value.map((item) => normalizedRelative(item, 'repin.' + key));
  };
  const runtimeFolders = listOf('runtimeFolders', DEFAULT_RUNTIME_FOLDERS);
  return {
    roots: [...new Set([VENDOR_ROOT, ...runtimeFolders])],
    runtimeFolders,
    exclude: listOf('exclude', []),
    // Upstream root files the project carries. A re-pin never copies them, so
    // naming them is what lets the run report an upstream change to one.
    rootFiles: listOf('rootFiles', []),
  };
}

// Both scopes record upstream's copy of the destination in `pinnedSha256`: a
// file overlay copies that file whole, and a marked-section overlay keeps it as
// its `base`.
const PINNED_UPSTREAM_SCOPES = new Set(['file', 'marked-section']);

/**
 * List the owned root files whose upstream copy has moved since the overlay was
 * pinned. A re-pin never copies a root file, so only this comparison tells an
 * overlay whose upstream base changed from one that still matches it. A
 * marked-section overlay pins the upstream copy it writes its block into, so it
 * is judged here as well.
 * @param {object} manifest Loaded overlay manifest.
 * @returns {{path: string, overlay: string}[]} Sorted by path; empty when the
 *   manifest names no readable upstream checkout or no root files.
 */
function staleRootFiles(manifest) {
  const { rootFiles } = repinSettings(manifest);
  const readUpstream = rootFiles.length === 0 ? null : pinnedUpstreamBytes(manifest);
  if (readUpstream === null) return [];
  const stale = [];
  for (const entry of manifest.overlays) {
    if (!PINNED_UPSTREAM_SCOPES.has(entry.scope) || !entry.pinnedSha256) continue;
    if (!rootFiles.includes(entry.destination)) continue;
    const upstreamBytes = readUpstream(entry.destination);
    if (upstreamBytes === null || sha256(upstreamBytes) === entry.pinnedSha256) continue;
    stale.push({ path: entry.destination, overlay: entry.id });
  }
  return stale.sort((left, right) => left.path.localeCompare(right.path));
}
/**
 * Compute the one set of paths the copy will write and delete.
 * @param {object} job Re-pin job with upstream, commits and settings.
 * @returns {{copy: string[], delete: string[]}} Sorted paths, relative to the tree.
 */
function touchedPaths(job) {
  const { upstream, oldCommit, newCommit, settings } = job;
  const isKept = (relativePath) => !isUnderAny(relativePath, settings.exclude);
  const copy = new Set();
  for (const relativePath of diffNames(upstream, oldCommit, newCommit, 'AMT', [VENDOR_ROOT])) {
    if (job.newBlobs.has(relativePath)) copy.add(relativePath);
  }
  for (const relativePath of job.newBlobs.keys()) {
    if (isUnderAny(relativePath, settings.runtimeFolders)) copy.add(relativePath);
  }
  const deleted = diffNames(upstream, oldCommit, newCommit, 'D', settings.roots)
    .filter((relativePath) => job.oldBlobs.has(relativePath) && !job.newBlobs.has(relativePath));
  return {
    copy: [...copy].filter(isKept).sort(),
    delete: deleted.filter(isKept).sort(),
  };
}

/**
 * Build a test for whether a path is managed by the overlay folder: an overlay
 * destination, a layout link, or a regenerated output. The copy may overwrite
 * those, because apply and the regenerate steps write them back.
 * @param {object} ctx Engine context.
 * @param {object} manifest Loaded overlay manifest.
 * @returns {(relativePath: string) => boolean}
 */
function managedPathTest(ctx, manifest) {
  const exact = new Set();
  const prefixes = [];
  const vendorKept = new Set();
  for (const entry of manifest.overlays) {
    if (entry.scope === 'remove-root') {
      for (const relativePath of entry.paths || []) prefixes.push(path.posix.normalize(relativePath));
      continue;
    }
    const destination = path.posix.normalize(entry.destination);
    if (entry.scope === 'directory') {
      prefixes.push(destination);
    } else if (entry.scope === 'skill-root') {
      for (const relativePath of [...(entry.replace || []), ...(entry.remove || [])]) {
        prefixes.push(path.posix.join(destination, relativePath));
      }
      // A retained file inside a replaced folder is the vendor's own, kept as found.
      for (const relativePath of keptRetainedPaths(entry, path.join(ctx.overlayRoot, entry.source))) {
        vendorKept.add(path.posix.join(destination, relativePath));
      }
    } else {
      exact.add(destination);
    }
  }
  for (const link of manifest.layoutLinks || []) {
    exact.add(path.posix.normalize(link.path));
    if (link.replaces && typeof link.replaces.path === 'string') exact.add(path.posix.normalize(link.replaces.path));
  }
  for (const step of manifest.regenerate || []) {
    for (const output of step.outputs || []) exact.add(path.posix.normalize(output));
  }
  return (relativePath) => !vendorKept.has(relativePath) &&
    (exact.has(relativePath) || isUnderAny(relativePath, prefixes));
}

// Why a live path is not the given blob, or null when it is.
function blobDifference(filePath, blob, format) {
  let stats;
  try {
    stats = fs.lstatSync(filePath);
  } catch (error) {
    if (error && (error.code === 'ENOENT' || error.code === 'ENOTDIR')) return 'missing from the tree';
    throw error;
  }
  if (stats.isDirectory()) return 'a folder in the tree';
  const isLink = blob.mode === '120000';
  if (isLink !== stats.isSymbolicLink()) return isLink ? 'not a link in the tree' : 'a link in the tree';
  const bytes = isLink ? Buffer.from(fs.readlinkSync(filePath)) : fs.readFileSync(filePath);
  return gitBlobId(format, bytes) === blob.object ? null : (isLink ? 'a different link target' : 'different bytes');
}

/**
 * Find unowned paths the copy would overwrite or delete that differ from the old
 * pin, and project files at paths upstream ships for the first time.
 * @param {object} ctx Engine context.
 * @param {object} manifest Loaded overlay manifest.
 * @param {object} job Re-pin job.
 * @param {{copy: string[], delete: string[]}} touched The one set of touched paths.
 * @returns {string[]} One refusal line per path.
 */
function unownedDrift(ctx, manifest, job, touched) {
  const isManaged = managedPathTest(ctx, manifest);
  const format = objectFormat(job.upstream);
  const lines = [];
  for (const relativePath of [...touched.copy, ...touched.delete].sort()) {
    if (isManaged(relativePath)) continue;
    const filePath = path.join(ctx.root, relativePath);
    const oldBlob = job.oldBlobs.get(relativePath);
    if (oldBlob) {
      const reason = blobDifference(filePath, oldBlob, format);
      if (reason) lines.push(`refuse: unowned ${relativePath} differs from the old pin (${reason})`);
      continue;
    }
    // The copy deletes a link before it writes below it, so what the tree shows
    // through that link is the link target's file, never a copy at this path.
    if (isUnderAny(relativePath, touched.delete)) continue;
    if (!pathExists(filePath)) continue;
    if (blobDifference(filePath, job.newBlobs.get(relativePath), format)) {
      lines.push(`refuse: unowned ${relativePath} is not in the old pin, and the tree holds its own copy there`);
    }
  }
  return lines;
}

/**
 * Find touched paths the copy cannot write safely: a folder where upstream ships
 * a file, or a path below a link or file that is not deleted first. Writing
 * through a link would land outside the path the backup recorded.
 * @param {string} root Destination tree root.
 * @param {{copy: string[], delete: string[]}} touched The one set of touched paths.
 * @returns {string[]} One refusal line per path.
 */
function treeShapeProblems(root, touched) {
  const deletedFirst = new Set(touched.delete);
  const lines = [];
  for (const relativePath of [...touched.copy, ...touched.delete]) {
    if (isEnvName(relativePath)) {
      lines.push(`refuse: ${relativePath} is a .env path, which is never read; list it in repin.exclude`);
      continue;
    }
    const parts = relativePath.split('/');
    let blockedBy = null;
    for (let depth = 1; depth < parts.length && !blockedBy; depth += 1) {
      const ancestor = parts.slice(0, depth).join('/');
      let stats;
      try {
        stats = fs.lstatSync(path.join(root, ancestor));
      } catch (error) {
        if (error && (error.code === 'ENOENT' || error.code === 'ENOTDIR')) break;
        throw error;
      }
      if (stats.isDirectory()) continue;
      if (deletedFirst.has(ancestor)) break;
      blockedBy = `${ancestor}, which the tree holds as a ${stats.isSymbolicLink() ? 'link' : 'file'}`;
    }
    if (blockedBy) {
      lines.push(`refuse: ${relativePath} sits below ${blockedBy}`);
    } else if (isDirectory(path.join(root, relativePath))) {
      lines.push(`refuse: ${relativePath} is a folder in the tree where upstream ships a file; list it in repin.exclude to keep it`);
    }
  }
  return lines;
}

/**
 * Extract the copied roots at the new commit with git archive.
 * @param {object} job Re-pin job.
 * @param {string} scratch Temporary folder for this run.
 * @param {{copy: string[]}} touched The one set of touched paths.
 * @returns {string} Folder holding the new commit's roots.
 */
function extractNewCommit(job, scratch, touched) {
  const target = path.join(scratch, 'new');
  fs.mkdirSync(target);
  const presentRoots = job.settings.roots.filter((root) => {
    for (const relativePath of job.newBlobs.keys()) if (isUnderAny(relativePath, [root])) return true;
    return false;
  });
  if (presentRoots.length > 0) {
    const archive = path.join(scratch, 'new.tar');
    gitText(job.upstream, ['archive', '--format=tar', '-o', archive, job.newCommit, '--', ...presentRoots]);
    const result = spawnSync('tar', ['-xf', archive, '-C', target], { encoding: 'utf8' });
    if (result.error) throw result.error;
    if (result.status !== 0) throw new Error('tar could not extract the archive: ' + (result.stderr || '').trim());
    fs.rmSync(archive, { force: true });
  }
  const missing = touched.copy.filter((relativePath) => !pathExists(path.join(target, relativePath)));
  if (missing.length > 0) {
    throw new Error(`the archive of ${job.newCommit} lacks ${missing.length} path(s) the copy needs, first ${missing[0]}; ` +
      'an export-ignore attribute upstream would explain it');
  }
  return target;
}

function makeRunId() {
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
  return stamp + '-' + crypto.randomBytes(3).toString('hex');
}

function rollbackCommand(ctx, runId) {
  const root = ctx.root === DEFAULT_ROOT ? '' : ' --root ' + (/\s/.test(ctx.root) ? `'${ctx.root}'` : ctx.root);
  return `rollback: ${ENGINE_COMMAND} repin --rollback ${runId}${root}`;
}

// Whether a path is reached through a link. Such a path is never read or deleted
// by the backup or the rollback: its bytes live at the link's target, and the
// link itself is the entry that gets restored.
function hasLinkedAncestor(root, relativePath) {
  const parts = relativePath.split('/');
  for (let depth = 1; depth < parts.length; depth += 1) {
    const ancestor = path.join(root, ...parts.slice(0, depth));
    let stats;
    try {
      stats = fs.lstatSync(ancestor);
    } catch (error) {
      if (error && (error.code === 'ENOENT' || error.code === 'ENOTDIR')) return false;
      throw error;
    }
    if (!stats.isDirectory()) return true;
  }
  return false;
}

// Every file and link below a path, for a path apply or a regenerate step writes
// as a whole folder.
function backupLeaves(root, relativePath) {
  const filePath = path.join(root, relativePath);
  if (!isDirectory(filePath)) return [relativePath];
  return listTreePaths(filePath).map((leaf) => relativeKey(root, leaf));
}

/**
 * Back up every path the run may write, before its first write.
 * The touched set is the copy's own list. The engine group adds what apply and
 * the regenerate steps write afterwards, so a rollback also restores those.
 * @param {object} ctx Engine context.
 * @param {object} manifest Loaded overlay manifest.
 * @param {object} analysis Analysis of the tree before the copy.
 * @param {{copy: string[], delete: string[]}} touched The one set of touched paths.
 * @param {string} runDir The run folder.
 * @param {object} meta Run facts recorded beside the entries.
 * @returns {object} The backup record written to backup.json.
 */
function writeBackup(ctx, manifest, analysis, touched, runDir, meta) {
  const root = ctx.root;
  const groups = new Map();
  for (const relativePath of touched.copy) groups.set(relativePath, 'copy');
  for (const relativePath of touched.delete) if (!groups.has(relativePath)) groups.set(relativePath, 'delete');
  // A folder beside the tree keeps its own files under their own area, so no tree
  // path can collide with them and a rollback restores them against that folder.
  const overlayOutside = ctx.overlayOutside;
  const overlayGroups = new Map();
  if (overlayOutside) {
    for (const filePath of [ctx.manifestPath, ctx.statePath]) overlayGroups.set(relativeKey(ctx.overlayRoot, filePath), 'engine');
  }
  const enginePaths = [
    ...(overlayOutside ? [] : [relativeKey(root, ctx.manifestPath), relativeKey(root, ctx.statePath)]),
    ...analysis.records.map((record) => record.key),
    ...(manifest.layoutLinks || []).flatMap((link) => [link.path, link.replaces && link.replaces.path]),
    ...(manifest.regenerate || []).flatMap((step) => step.outputs || []),
  ].filter((value) => typeof value === 'string').map((value) => path.posix.normalize(value));
  for (const relativePath of enginePaths) {
    for (const leaf of backupLeaves(root, relativePath)) if (!groups.has(leaf)) groups.set(leaf, 'engine');
  }

  const entries = [];
  const createdDirs = new Set();
  // Record one path's backup entry, copying a file into backupDir, and say
  // whether the path was missing.
  const backUpEntry = (base, relativePath, group, backupDir, tag) => {
    const filePath = path.join(base, relativePath);
    relativeKey(base, filePath);
    let stats = null;
    if (!hasLinkedAncestor(base, relativePath)) {
      try {
        stats = fs.lstatSync(filePath);
      } catch (error) {
        if (!error || (error.code !== 'ENOENT' && error.code !== 'ENOTDIR')) throw error;
      }
    }
    if (!stats) {
      entries.push({ path: relativePath, ...tag, group, existed: false });
      return true;
    }
    if (stats.isSymbolicLink()) {
      const target = fs.readlinkSync(filePath);
      entries.push({ path: relativePath, ...tag, group, existed: true, kind: 'symlink', target, sha256: sha256(Buffer.from(target)) });
      return false;
    }
    if (isEnvName(relativePath) || !stats.isFile()) {
      throw new Error('refusing to back up ' + relativePath + (stats.isFile() ? ', a .env path' : ', which is not a file or a link'));
    }
    const buffer = fs.readFileSync(filePath);
    writeFile(path.join(backupDir, relativePath), buffer, 0o600);
    entries.push({ path: relativePath, ...tag, group, existed: true, kind: 'file', mode: stats.mode & 0o777, sha256: sha256(buffer) });
    return false;
  };
  // Only the tree records the folders a missing path would need: a rollback
  // prunes those from the tree, while the overlay folder's own files are only
  // ever restored in place.
  const treeBackupDir = path.join(runDir, 'backup');
  for (const relativePath of [...groups.keys()].sort()) {
    if (!backUpEntry(root, relativePath, groups.get(relativePath), treeBackupDir, {})) continue;
    for (let dir = path.dirname(path.join(root, relativePath)); dir !== root && isWithin(root, dir); dir = path.dirname(dir)) {
      if (pathExists(dir)) break;
      createdDirs.add(relativeKey(root, dir));
    }
  }
  if (overlayOutside) {
    const overlayBackupDir = path.join(runDir, 'overlay-backup');
    for (const relativePath of [...overlayGroups.keys()].sort()) {
      backUpEntry(ctx.overlayRoot, relativePath, overlayGroups.get(relativePath), overlayBackupDir, { area: 'overlay' });
    }
  }
  const backup = {
    schemaVersion: 1,
    ...meta,
    entries,
    createdDirs: [...createdDirs].sort((left, right) => right.length - left.length),
  };
  fs.writeFileSync(path.join(runDir, 'backup.json'), JSON.stringify(backup, null, 2) + '\n');
  return backup;
}

function pruneEmptyParents(root, filePath) {
  for (let dir = path.dirname(filePath); dir !== root && isWithin(root, dir); dir = path.dirname(dir)) {
    if (!isDirectory(dir) || fs.readdirSync(dir).length > 0) return;
    fs.rmdirSync(dir);
  }
}

function copyUpstreamEntry(fromPath, toPath) {
  const stats = fs.lstatSync(fromPath);
  fs.mkdirSync(path.dirname(toPath), { recursive: true });
  if (stats.isSymbolicLink()) {
    ensureSymlink(toPath, fs.readlinkSync(fromPath));
    return;
  }
  // Unlink first, so a link standing at the path is replaced, never written through.
  try {
    fs.unlinkSync(toPath);
  } catch (error) {
    if (!error || error.code !== 'ENOENT') throw error;
  }
  fs.writeFileSync(toPath, fs.readFileSync(fromPath));
  fs.chmodSync(toPath, stats.mode & 0o777);
}

/**
 * Point the manifest's pin at the new commit, changing only that value's text.
 * @param {object} ctx Engine context.
 * @param {string} commit The new pin.
 */
function writePin(ctx, commit) {
  const text = fs.readFileSync(ctx.manifestPath, 'utf8');
  const node = nodeAtPath(parseJsonSource(text), ['pin', 'commit']);
  if (node.type !== 'string') throw new Error('the manifest pin.commit is not a string');
  writeFileAtomic(ctx.manifestPath, text.slice(0, node.start) + JSON.stringify(commit) + text.slice(node.end));
}

/**
 * Name the overlays whose every output now equals the new commit's bytes, which
 * makes them dead weight a person can drop.
 * @param {object} ctx Engine context.
 * @param {object} analysis Analysis of the tree after the copy.
 * @param {string} newTree Folder holding the new commit's roots.
 * @param {string[]} roots Copied roots.
 * @returns {string[]} Overlay ids.
 */
function overlaysEqualToUpstream(ctx, analysis, newTree, roots) {
  const ids = [];
  for (const plan of analysis.plans) {
    if (plan.problems.length > 0 || plan.outputs.length === 0) continue;
    const isEqual = plan.outputs.every((output) => {
      const key = relativeKey(ctx.root, output.filePath);
      if (!isUnderAny(key, roots)) return false;
      const upstreamPath = path.join(newTree, key);
      if (output.buffer === null) return !pathExists(upstreamPath);
      return isFile(upstreamPath) && buffersEqual(fs.readFileSync(upstreamPath), output.buffer);
    });
    if (isEqual) ids.push(plan.entry.id);
  }
  return ids;
}

// The most not-copied paths printed one per line; the report file keeps them all.
const NOT_COPIED_SHOWN = 20;

/**
 * List the upstream changes between the two commits that this tree holds but a
 * re-pin never copies: files under a top-level file or real folder outside the
 * copied roots, such as AGENTS.md, and paths in repin.exclude. Leaving them out
 * is deliberate, so a project's own copy is never overwritten, but without this
 * list an upstream change there is dropped without anyone seeing it. A
 * top-level link is the project's own wiring, such as a specs link, and is skipped.
 * @param {object} ctx Engine context of the tree being re-pinned.
 * @param {object} job Re-pin job.
 * @returns {string[]} Sorted paths, relative to the tree.
 */
function notCopiedChanges(ctx, job) {
  const { roots, exclude } = job.settings;
  const holdsRealTopLevel = (relativePath) => {
    const top = relativePath.split('/')[0];
    try {
      return !fs.lstatSync(path.join(ctx.root, top)).isSymbolicLink();
    } catch {
      return false;
    }
  };
  return diffNames(job.upstream, job.oldCommit, job.newCommit, 'AMTD', [])
    .filter((relativePath) => !isUnderAny(relativePath, [ctx.overlayLabel]) &&
      (isUnderAny(relativePath, exclude) ||
        (!isUnderAny(relativePath, roots) && holdsRealTopLevel(relativePath))))
    .sort();
}

function reportNotCopied(paths, settings) {
  if (paths.length === 0) return;
  console.log(`not-copied ${paths.length} upstream change(s) outside ${settings.roots.join(', ')} or in repin.exclude; carry them over by hand if they apply (AGENTS.md sections: /doctor:agents-md)`);
  for (const relativePath of paths.slice(0, NOT_COPIED_SHOWN)) console.log('not-copied ' + relativePath);
  if (paths.length > NOT_COPIED_SHOWN) console.log(`not-copied … ${paths.length - NOT_COPIED_SHOWN} more in report.json`);
}

/**
 * List the named root files upstream changed between the two commits. A re-pin
 * never copies a root file, so each one is named on its own line, uncapped: an
 * unowned one has to be carried over by hand, and an owned one needs its
 * overlay rebased.
 * @param {object} ctx Engine context of the tree being re-pinned.
 * @param {object} manifest Loaded overlay manifest.
 * @param {object} job Re-pin job.
 * @returns {{path: string, owned: boolean}[]} Sorted by path.
 */
function rootFileChanges(ctx, manifest, job) {
  const { rootFiles } = job.settings;
  if (rootFiles.length === 0) return [];
  const isManaged = managedPathTest(ctx, manifest);
  return diffNames(job.upstream, job.oldCommit, job.newCommit, 'AMTD', rootFiles)
    .filter((relativePath) => rootFiles.includes(relativePath))
    .sort()
    .map((relativePath) => ({ path: relativePath, owned: isManaged(relativePath) }));
}

function reportRootFiles(changes) {
  for (const change of changes) {
    console.log(change.owned
      ? `root-file ${change.path} changed upstream; rebase the overlay that owns it`
      : `root-file ${change.path} changed upstream and no overlay owns it; carry the change over by hand, ` +
        `or run ${ENGINE_COMMAND} apply --adopt ${shellPath(change.path)} so a later re-pin reports it as an overlay`);
  }
}

function valueAtPath(value, steps) {
  let current = value;
  for (const step of steps) {
    if (current === null || typeof current !== 'object' || !Object.hasOwn(current, step)) return undefined;
    current = current[step];
  }
  return current;
}

/**
 * The upstream changes between the two commits of one json-entry destination
 * that its entry set writes over. A `set` replaces its whole value, so an item
 * upstream added to an array the set writes is gone the moment the overlay
 * applies; a `setKeyOnItem` replaces one key the same way. A value upstream did
 * not move is the overlay's own choice from an earlier pin and is not listed.
 * @param {object} entry A json-entry manifest entry.
 * @param {object} spec Parsed entry set.
 * @param {Buffer} oldBytes The destination at the old pin.
 * @param {Buffer} newBytes The destination at the new pin.
 * @returns {string[]} One line per loss, without the overlay id.
 */
function jsonEntryLosses(entry, spec, oldBytes, newBytes) {
  const newText = newBytes.toString('utf8');
  let oldDocument;
  let newDocument;
  let applied;
  try {
    oldDocument = JSON.parse(oldBytes.toString('utf8'));
    newDocument = JSON.parse(newText);
    applied = JSON.parse(applyJsonOperations(newText, spec, { canReplaceExisting: true, readUpstreamText: () => newText }));
  } catch (error) {
    // An entry set that cannot apply at the new pin is refused by the apply
    // that follows the copy, which names the overlay on its own.
    return [];
  }
  const destination = entry.destination;
  const losses = [];
  for (const operation of spec.operations) {
    if (!operation || !Array.isArray(operation.path)) continue;
    const label = pathLabel(operation.path);
    if (operation.op === 'set') {
      const before = valueAtPath(oldDocument, operation.path);
      const after = valueAtPath(newDocument, operation.path);
      if (after === undefined || deepEqual(before, after)) continue;
      const result = valueAtPath(applied, operation.path);
      if (Array.isArray(after) && Array.isArray(result)) {
        const shipped = Array.isArray(before) ? before : [];
        for (const item of after) {
          if (shipped.some((old) => deepEqual(old, item)) || result.some((kept) => deepEqual(kept, item))) continue;
          losses.push(`set at ${label} drops ${describe(item)}, which upstream added to ${destination}; ` +
            "add it to the set's value if it applies");
        }
      } else if (!deepEqual(result, after)) {
        losses.push(`set at ${label} overwrites the value upstream changed in ${destination}; ` +
          'carry the change into the set if it applies');
      }
    } else if (operation.op === 'setKeyOnItem' && operation.match && typeof operation.match === 'object') {
      const identity = operation.match[operation.identityKey];
      const keyIn = (document) => {
        const list = valueAtPath(document, operation.path);
        const item = Array.isArray(list)
          ? list.find((candidate) => candidate && typeof candidate === 'object' && candidate[operation.identityKey] === identity)
          : undefined;
        return item && Object.hasOwn(item, operation.key) ? item[operation.key] : undefined;
      };
      const after = keyIn(newDocument);
      if (after === undefined || deepEqual(keyIn(oldDocument), after) || deepEqual(keyIn(applied), after)) continue;
      const shown = typeof identity === 'string' ? identity : describe(identity);
      losses.push(`setKeyOnItem of ${operation.key} on the item matching ${operation.identityKey}=${shown} at ${label} ` +
        `overwrites the value upstream changed in ${destination}; carry the change into the operation if it applies`);
    }
  }
  return losses;
}

/**
 * List the upstream changes the copy brings in that an overlay then removes or
 * writes over, so the re-pin reports every loss instead of passing in silence.
 * A directory overlay is the whole folder, and a skill-root overlay is the whole
 * of each folder it replaces, so a file upstream added or changed there that the
 * overlay source lacks is deleted by the apply after the copy.
 * Only a destination the copy writes is checked: one it leaves in place never
 * receives the upstream change, and the not-copied list names that instead.
 * @param {object} ctx Engine context of the tree being re-pinned.
 * @param {object} manifest Loaded overlay manifest.
 * @param {object} job Re-pin job, with the blob lists already read.
 * @param {{copy: string[], delete: string[]}} touched Paths the copy writes and deletes.
 * @returns {{overlay: string, path: string, detail: string}[]} In manifest order.
 */
function upstreamLosses(ctx, manifest, job, touched) {
  const copied = new Set(touched.copy);
  const readOld = commitBytesReader(job.upstream, job.oldCommit);
  const readNew = commitBytesReader(job.upstream, job.newCommit);
  const losses = [];
  for (const entry of manifest.overlays) {
    if (typeof entry.destination !== 'string') continue;
    const destination = path.posix.normalize(entry.destination);
    if (entry.scope === 'json-entry' && copied.has(destination)) {
      const spec = readEntrySet(ctx, entry);
      const oldBytes = readOld(destination);
      const newBytes = readNew(destination);
      // A file upstream adds or removes here is refused by the apply instead.
      if (!spec || oldBytes === null || newBytes === null) continue;
      for (const detail of jsonEntryLosses(entry, spec, oldBytes, newBytes)) {
        losses.push({ overlay: entry.id, path: destination, detail });
      }
    } else if (entry.scope === 'directory') {
      const sourceDir = path.join(ctx.overlayRoot, entry.source);
      if (!isDirectory(sourceDir)) continue;
      const carried = walkTree(sourceDir);
      for (const relativePath of removedUpstreamChanges(job, touched, destination, (rel) => carried.has(rel))) {
        const how = job.oldBlobs.has(relativePath) ? 'changed' : 'added';
        losses.push({
          overlay: entry.id,
          path: relativePath,
          detail: `the directory overlay removes ${relativePath}, which upstream ${how}; ` +
            `add it to ${ctx.overlayLabel}/${entry.source} if it applies`,
        });
      }
    } else if (entry.scope === 'skill-root') {
      // Each folder the entry replaces is mirrored from the source the way a
      // directory overlay is, apart from the retained paths, which stay as
      // upstream ships them. A path the entry lists in `remove` goes by design.
      const sourceDir = path.join(ctx.overlayRoot, entry.source);
      if (!isDirectory(sourceDir)) continue;
      const retained = new Set((entry.retained || []).map((item) => item && item.path));
      const folders = (entry.replace || []).filter((rel) => typeof rel === 'string' && isDirectory(path.join(sourceDir, rel)));
      for (const folder of folders) {
        const carried = walkTree(path.join(sourceDir, folder));
        const isKept = (rel) => carried.has(rel) || retained.has(path.posix.join(folder, rel));
        for (const relativePath of removedUpstreamChanges(job, touched, path.posix.join(destination, folder), isKept)) {
          const how = job.oldBlobs.has(relativePath) ? 'changed' : 'added';
          losses.push({
            overlay: entry.id,
            path: relativePath,
            detail: `the skill-root overlay removes ${relativePath}, which upstream ${how}; ` +
              `add it to ${ctx.overlayLabel}/${path.posix.join(entry.source, folder)} if it applies`,
          });
        }
      }
    }
  }
  return losses;
}

/**
 * The files the copy writes under a mirrored folder that upstream added or
 * changed between the two commits and that the overlay does not keep, so the
 * apply after the copy deletes them.
 * @param {object} job Re-pin job.
 * @param {{copy: string[]}} touched Paths the copy writes.
 * @param {string} folder The mirrored folder, relative to the tree.
 * @param {(rel: string) => boolean} isKept Whether the overlay keeps a path
 *   relative to the folder.
 * @returns {string[]} Paths relative to the tree, in the copy's sorted order.
 */
function removedUpstreamChanges(job, touched, folder, isKept) {
  const changed = new Set(diffNames(job.upstream, job.oldCommit, job.newCommit, 'AM', [folder]));
  return touched.copy.filter((relativePath) => changed.has(relativePath) &&
    relativePath.startsWith(folder + '/') && !isKept(relativePath.slice(folder.length + 1)));
}

function reportBlocked(analysis, report) {
  for (const record of analysis.records) {
    if (!BLOCKING_STATES.has(record.state)) continue;
    const overlay = record.layout ? 'layout' : record.plan.entry.id;
    report.blocked.push({ overlay, state: record.state, path: record.key });
    console.log(`blocked ${overlay}: ${record.state} ${record.key}`);
  }
  for (const plan of analysis.blocked) {
    for (const problem of plan.problems) {
      report.blocked.push({ overlay: plan.entry.id, state: 'refused', path: plan.entry.destination || null, problem });
      console.log(`blocked ${plan.entry.id}: refused ${problem}`);
    }
  }
  for (const problem of analysis.layout.problems) {
    report.blocked.push({ overlay: 'layout', state: 'refused', path: null, problem });
    console.log(`blocked layout: refused ${problem}`);
  }
}

/**
 * Copy, set the pin, apply twice and check; the caller holds the lock and has
 * taken the backup.
 * @returns {boolean} Whether every step finished clean.
 */
function repinWrites(ctx, job, touched, newTree, report) {
  const root = ctx.root;
  for (const relativePath of [...touched.delete].reverse()) {
    const filePath = path.join(root, relativePath);
    if (removePath(filePath)) pruneEmptyParents(root, filePath);
  }
  for (const relativePath of touched.copy) {
    copyUpstreamEntry(path.join(newTree, relativePath), path.join(root, relativePath));
  }
  writePin(ctx, job.newPin);

  const loaded = loadManifest(ctx);
  // A stage has no project install behind it, so it skips the regenerate and
  // verify steps and reports only what the overlays do.
  const manifest = job.isStage ? { ...loaded, regenerate: [], verifyGenerated: [] } : loaded;
  if (job.isStage) {
    report.stageSkipped = {
      regenerate: (loaded.regenerate || []).length,
      verify: (loaded.verifyGenerated || []).length,
    };
    // A clean stage proves the copy and the overlays, never the generators, so
    // the report says so rather than reading as a full rehearsal.
    if (report.stageSkipped.regenerate + report.stageSkipped.verify > 0) {
      console.log(`stage skipped ${report.stageSkipped.regenerate} regenerate and ${report.stageSkipped.verify} verify step(s); the live run runs them`);
    }
  }
  // The extracted tree holds only the copied roots. A destination outside them is
  // read from the new commit itself, which is the pin it is restored to.
  const fromTree = treeBytesReader(newTree);
  const fromCommit = commitBytesReader(job.upstream, job.newCommit);
  const readUpstream = (key) => fromTree(key) || fromCommit(key);
  const afterCopy = analyze(ctx, manifest, loadState(ctx, manifest), readUpstream);
  reportBlocked(afterCopy, report);
  // An anchor the new copy no longer holds only moves where an item lands, so
  // it is named here the way status names it, and never blocks the run.
  for (const plan of afterCopy.plans) {
    for (const warning of plan.warnings || []) {
      report.notes.push(warning);
      console.log(`NOTE     ${warning}`);
    }
  }
  report.equalsUpstream = overlaysEqualToUpstream(ctx, afterCopy, newTree, job.settings.roots);
  for (const id of report.equalsUpstream) console.log('equals-upstream ' + id);

  const first = {};
  if (applyUnderLock(ctx, manifest, { isRegenerateForced: true, outcome: first, upstreamBytes: readUpstream }) !== EXIT_OK) return false;
  const second = {};
  if (applyUnderLock(ctx, manifest, { outcome: second, upstreamBytes: readUpstream }) !== EXIT_OK) return false;
  if (second.changed !== 0) {
    console.log(`MISS     a second apply changed ${second.changed} destination(s)`);
    return false;
  }
  const finalState = loadState(ctx, manifest);
  const finalAnalysis = analyze(ctx, manifest, finalState, readUpstream);
  const check = runCheck(ctx, manifest, finalState, finalAnalysis.plans);
  for (const problem of check.problems) console.log(`MISS     ${problem}`);
  const outOfSync = finalAnalysis.records.filter((record) => record.state !== 'in-sync');
  printProblems(ctx, outOfSync);
  console.log(`checked=${check.checked} ok=${check.ok} miss=${check.miss}`);
  return outOfSync.length === 0 && finalAnalysis.blocked.length === 0 && check.miss === 0;
}

function refuseRepin(lines) {
  for (const line of lines) console.log(line);
  console.log('RESULT: FAILED');
  return EXIT_ERROR;
}

/**
 * Run one re-pin while holding the tree's lock.
 * @param {object} ctx Engine context of the tree being written.
 * @param {object} job Re-pin job.
 * @param {object} report Report collected for --json and report.json.
 * @returns {number} Exit code.
 */
function repinUnderLock(ctx, job, report) {
  const manifest = loadManifest(ctx);
  const analysis = analyze(ctx, manifest, loadState(ctx, manifest), commitBytesReader(job.upstream, job.oldCommit));
  const blockers = analysis.records.filter((record) => BLOCKING_STATES.has(record.state));
  if (blockers.length > 0) {
    for (const record of blockers) console.log(problemLine(ctx, record));
    return refuseRepin([`refuse: status shows ${blockers.length} live or conflicting destination(s); resolve them before a re-pin`]);
  }
  // A refused overlay would block the apply that follows the copy, after the copy
  // had already written, so it stops the run before the backup instead.
  if (analysis.blocked.length > 0) {
    const lines = analysis.blocked.flatMap((plan) => plan.problems.map((problem) => `blocked ${plan.entry.id}: refused ${problem}`));
    lines.push(`refuse: status shows ${analysis.blocked.length} refused overlay(s); fix them before a re-pin`);
    return refuseRepin(lines);
  }
  if (isUnderAny(ctx.overlayLabel, job.settings.roots)) {
    return refuseRepin([`refuse: the overlay folder ${ctx.overlayLabel} sits inside a folder the re-pin copies`]);
  }

  job.oldBlobs = listBlobs(job.upstream, job.oldCommit, job.settings.roots);
  job.newBlobs = listBlobs(job.upstream, job.newCommit, job.settings.roots);
  const touched = touchedPaths(job);
  const drift = unownedDrift(ctx, manifest, job, touched);
  if (drift.length > 0) {
    drift.push(`  move each edit into an overlay, list the path in repin.exclude, or restore it from ${job.oldPin}`);
    return refuseRepin(drift);
  }
  const shape = treeShapeProblems(ctx.root, touched);
  if (shape.length > 0) return refuseRepin(shape);
  // A json-entry destination the copy leaves in place keeps its live bytes, so
  // its entry set meets the new pin with the file as it is now. A refusal there
  // would stop the apply after the copy had written, so it is planned here first.
  const state = loadState(ctx, manifest);
  const leftInPlace = manifest.overlays
    .filter((entry) => entry.scope === 'json-entry' &&
      !touched.copy.includes(entry.destination) && !touched.delete.includes(entry.destination))
    .map((entry) => planOverlay(entry, ctx, {
      acceptedSha256: state.files,
      recordedItems: (state.items || {})[entry.destination] || [],
      recordedSets: (state.sets || {})[entry.destination] || [],
      recordedKeys: (state.keys || {})[entry.destination] || [],
      upstreamBytes: commitBytesReader(job.upstream, job.newCommit),
    }))
    .filter((plan) => plan.problems.length > 0);
  if (leftInPlace.length > 0) {
    const lines = leftInPlace.flatMap((plan) => plan.problems.map((problem) => `blocked ${plan.entry.id}: refused ${problem}`));
    lines.push(`refuse: ${leftInPlace.length} json-entry overlay(s) the copy leaves in place cannot be applied at the new pin; for a refused array, put it back to the copy at the current pin by hand, run apply, then re-pin`);
    return refuseRepin(lines);
  }
  report.notCopied = notCopiedChanges(ctx, job);
  reportNotCopied(report.notCopied, job.settings);
  report.rootFiles = rootFileChanges(ctx, manifest, job);
  reportRootFiles(report.rootFiles);
  report.upstreamLost = upstreamLosses(ctx, manifest, job, touched);
  for (const loss of report.upstreamLost) console.log(`upstream-lost ${loss.overlay}: ${loss.detail}`);

  const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'overlay-repin-'));
  try {
    const newTree = extractNewCommit(job, scratch, touched);
    let runId = makeRunId();
    while (pathExists(path.join(ctx.overlayRoot, RUNS_FOLDER, runId))) runId = makeRunId();
    const runDir = path.join(ctx.overlayRoot, RUNS_FOLDER, runId);
    fs.mkdirSync(runDir, { recursive: true });
    report.runId = runId;
    report.copy = touched.copy.length;
    report.delete = touched.delete.length;
    let isClean = false;
    let failure = null;
    try {
      const backup = writeBackup(ctx, manifest, analysis, touched, runDir, {
        runId,
        upstream: job.upstream,
        from: job.oldCommit,
        to: job.newCommit,
      });
      console.log(`backup of ${backup.entries.filter((entry) => entry.existed).length} paths in ${ctx.overlayLabel}/${RUNS_FOLDER}/${runId}`);
      console.log(`copy ${touched.copy.length} paths, delete ${touched.delete.length} paths`);
      isClean = repinWrites(ctx, job, touched, newTree, report);
    } catch (error) {
      failure = error;
      console.log('error: ' + error.message);
    }
    if (!job.isStage && !isClean) console.log(rollbackCommand(ctx, runId));
    // A stage that printed a blocked line or a miss is not a rehearsal that
    // passed, so it gets its own word instead of the clean stage's.
    report.result = job.isStage
      ? (isClean ? 'STAGED' : 'BLOCKED')
      : (isClean ? 'PASSED' : 'FAILED');
    console.log('RESULT: ' + report.result);
    fs.writeFileSync(path.join(runDir, 'report.json'), JSON.stringify(report, null, 2) + '\n');
    if (failure) return EXIT_ERROR;
    return isClean ? EXIT_OK : EXIT_CONFLICT;
  } finally {
    fs.rmSync(scratch, { recursive: true, force: true });
  }
}

/**
 * Why a stage folder cannot be used, or null when it can.
 * @param {string} root Live tree root.
 * @param {string} stageDir Requested stage folder.
 * @returns {string|null}
 */
function stageFolderProblem(root, stageDir, overlayRoot) {
  if (isWithin(root, stageDir) || isWithin(canonicalPath(root), canonicalPath(stageDir))) {
    return 'refuse: the stage folder sits inside the tree: ' + stageDir;
  }
  // An overlay folder beside the tree is live state too, so a stage inside it
  // would write into the folder the stage promises to leave alone.
  if (overlayRoot && (isWithin(overlayRoot, stageDir) || isWithin(canonicalPath(overlayRoot), canonicalPath(stageDir)))) {
    return 'refuse: the stage folder sits inside the overlay folder: ' + stageDir;
  }
  if (!pathExists(stageDir)) return null;
  if (!isDirectory(stageDir)) return 'refuse: the stage folder is not a folder: ' + stageDir;
  if (fs.readdirSync(stageDir).length > 0) return 'refuse: the stage folder is not empty: ' + stageDir;
  return null;
}

/**
 * Copy a tree byte for byte, links kept as links. The lock file and .env files
 * are left out: the copy takes its own lock, and a .env file is never read.
 * @param {string} source Live tree root.
 * @param {string} destination Empty stage folder.
 * @param {string} lockPath The live lock file.
 * @returns {number} Number of .env files left out.
 */
function copyTreeForStage(source, destination, lockPath) {
  let skipped = 0;
  fs.mkdirSync(destination, { recursive: true });
  const pending = [''];
  while (pending.length > 0) {
    const relativePath = pending.pop();
    for (const dirent of fs.readdirSync(path.join(source, relativePath), { withFileTypes: true })) {
      const childPath = path.join(relativePath, dirent.name);
      const fromPath = path.join(source, childPath);
      const toPath = path.join(destination, childPath);
      if (path.resolve(fromPath) === path.resolve(lockPath)) continue;
      const stats = fs.lstatSync(fromPath);
      if (stats.isSymbolicLink()) {
        fs.symlinkSync(fs.readlinkSync(fromPath), toPath);
      } else if (stats.isDirectory()) {
        fs.mkdirSync(toPath);
        pending.push(childPath);
      } else if (stats.isFile()) {
        if (isEnvName(fromPath)) {
          skipped += 1;
          continue;
        }
        fs.copyFileSync(fromPath, toPath);
        fs.chmodSync(toPath, stats.mode & 0o7777);
      }
    }
  }
  return skipped;
}

/**
 * Re-pin the tree, or a staged copy of it, to a new upstream commit.
 * @param {object} liveCtx Engine context of the live tree.
 * @param {{upstream: string, to: string, stage?: string|null}} options
 * @param {object} report Report collected for --json and report.json.
 * @returns {number} Exit code.
 */
function repinRun(liveCtx, options, report) {
  const upstream = path.resolve(options.upstream);
  if (!isDirectory(upstream)) return refuseRepin(['refuse: the upstream is not a folder: ' + upstream]);
  const manifest = loadManifest(liveCtx);
  const oldPin = manifest.pin && typeof manifest.pin.commit === 'string' ? manifest.pin.commit : '';
  if (!oldPin) return refuseRepin(['refuse: the overlay manifest has no pin.commit']);
  const settings = repinSettings(manifest);
  const oldCommit = resolveCommit(upstream, oldPin);
  if (!oldCommit) return refuseRepin([`refuse: the pinned ${oldPin} is not a commit in ${upstream}`]);
  const newCommit = resolveCommit(upstream, options.to);
  if (!newCommit) return refuseRepin([`refuse: ${options.to} is not a commit in ${upstream}`]);
  report.from = oldCommit;
  report.to = newCommit;
  if (newCommit === oldCommit) {
    report.result = 'PASSED';
    console.log('nothing to copy');
    console.log('RESULT: PASSED');
    return EXIT_OK;
  }
  // Keep the short form the operator typed, the way the manifest records pins.
  const typed = options.to.toLowerCase();
  const newPin = /^[0-9a-f]{7,}$/.test(typed) && newCommit.startsWith(typed) ? typed : newCommit;
  const job = { upstream, oldPin, oldCommit, newCommit, newPin, settings, isStage: Boolean(options.stage) };

  let ctx = liveCtx;
  if (job.isStage) {
    const stageDir = path.resolve(options.stage);
    // A folder beside the tree is copied beside the tree copy, each under its own
    // name, so the staged setting file reaches the staged overlay folder.
    const overlayOutside = liveCtx.overlayOutside;
    const problem = stageFolderProblem(liveCtx.root, stageDir, overlayOutside ? liveCtx.overlayRoot : null);
    if (problem) return refuseRepin([problem]);
    // Reading the tree while another run writes it would stage a torn copy, so a
    // lock that may still have a live owner is refused here as every other mode
    // refuses it. A lock whose writer has ended on this host is only leftover
    // state, and a stage writes nothing in the live tree, so the line is read and
    // the file left where it is for the next writing run to take over.
    if (pathExists(liveCtx.lockPath)) {
      const current = readBufferOrNull(liveCtx.lockPath);
      const owner = (current || Buffer.from('(empty lock file)')).toString('utf8').trim();
      if (!current || !isLockOwnerGone(owner)) {
        return refuseRepin(['refuse: the overlay lock is held: ' + owner, '  remove ' + liveCtx.lockPath + ' by hand once that run has ended']);
      }
      console.log('note: the overlay lock belongs to a run that has ended: ' + owner);
    }
    const stagedRoot = overlayOutside ? path.join(stageDir, path.basename(liveCtx.root)) : stageDir;
    let skipped = copyTreeForStage(liveCtx.root, stagedRoot, liveCtx.lockPath);
    if (overlayOutside) {
      skipped += copyTreeForStage(liveCtx.overlayRoot, path.join(stageDir, path.basename(liveCtx.overlayRoot)), liveCtx.lockPath);
    }
    console.log('staged a copy of the tree in ' + stageDir + (skipped > 0 ? ` (${skipped} .env file(s) left out)` : ''));
    ctx = createContext(stagedRoot);
    report.stage = stageDir;
  }
  return withLock(ctx, 'overlay-engine repin', () => repinUnderLock(ctx, job, report));
}

/**
 * Restore every path a run backed up and remove what the run created.
 * Every backed-up file is checked against its recorded hash before anything is
 * written, so a damaged backup restores nothing.
 * @param {object} ctx Engine context.
 * @param {string} runDir The run folder.
 * @param {object} backup Parsed backup.json.
 * @returns {number} Exit code.
 */
function rollbackUnderLock(ctx, runDir, backup) {
  const root = ctx.root;
  const restored = [];
  const problems = [];
  // An entry without an area is a tree path; an overlay entry belongs to the overlay
  // folder and was stored apart from the tree copies.
  const areaOf = (entry) => {
    if (entry.area === undefined) return { base: root, backupDir: path.join(runDir, 'backup') };
    if (entry.area === 'overlay') return { base: ctx.overlayRoot, backupDir: path.join(runDir, 'overlay-backup') };
    throw new Error('backup entry names an unknown area: ' + String(entry.area));
  };
  for (const entry of backup.entries) {
    const relativePath = normalizedRelative(entry.path, 'backup entry');
    const { base, backupDir } = areaOf(entry);
    relativeKey(base, path.join(base, relativePath));
    if (!entry.existed) continue;
    if (entry.kind === 'symlink') {
      if (typeof entry.target !== 'string' || sha256(Buffer.from(entry.target)) !== entry.sha256) {
        problems.push(`refuse: the backed-up link ${relativePath} does not match its recorded sha256`);
      }
      restored.push({ entry, relativePath, base });
      continue;
    }
    const buffer = readBufferOrNull(path.join(backupDir, relativePath));
    if (!buffer || sha256(buffer) !== entry.sha256) {
      problems.push(`refuse: the backup of ${relativePath} does not match its recorded sha256`);
      continue;
    }
    restored.push({ entry, relativePath, base, buffer });
  }
  if (problems.length > 0) return refuseRepin(problems);

  let removed = 0;
  const created = backup.entries.filter((entry) => !entry.existed)
    .map((entry) => ({ relativePath: normalizedRelative(entry.path, 'backup entry'), base: areaOf(entry).base }))
    .sort((left, right) => right.relativePath.split('/').length - left.relativePath.split('/').length ||
      right.relativePath.localeCompare(left.relativePath));
  for (const { relativePath, base } of created) {
    if (hasLinkedAncestor(base, relativePath)) continue;
    if (removePath(path.join(base, relativePath))) removed += 1;
  }
  for (const relativePath of backup.createdDirs || []) {
    const dir = path.join(root, normalizedRelative(relativePath, 'backup folder'));
    if (isDirectory(dir) && fs.readdirSync(dir).length === 0) fs.rmdirSync(dir);
  }

  restored.sort((left, right) => left.relativePath.split('/').length - right.relativePath.split('/').length);
  for (const { entry, relativePath, base, buffer } of restored) {
    const filePath = path.join(base, relativePath);
    // A parent the run turned into a file or link is cleared, never written through.
    const parts = relativePath.split('/');
    for (let depth = 1; depth < parts.length; depth += 1) {
      const ancestor = path.join(base, ...parts.slice(0, depth));
      if (pathExists(ancestor) && !isDirectory(ancestor)) fs.unlinkSync(ancestor);
    }
    if (isDirectory(filePath)) fs.rmSync(filePath, { recursive: true, force: true });
    if (entry.kind === 'symlink') {
      ensureSymlink(filePath, entry.target);
      if (fs.readlinkSync(filePath) !== entry.target) problems.push(`restored link ${relativePath} has the wrong target`);
      continue;
    }
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    removePath(filePath);
    fs.writeFileSync(filePath, buffer);
    fs.chmodSync(filePath, entry.mode);
    const written = readBufferOrNull(filePath);
    if (!written || sha256(written) !== entry.sha256) problems.push(`restored ${relativePath} does not match its recorded sha256`);
  }
  for (const problem of problems) console.log('MISS     ' + problem);
  console.log(`restored ${restored.length} paths, removed ${removed} paths`);
  console.log(problems.length > 0 ? 'RESULT: FAILED' : 'RESULT: PASSED');
  return problems.length > 0 ? EXIT_ERROR : EXIT_OK;
}

function rollbackRun(ctx, runId) {
  if (!RUN_ID_PATTERN.test(runId)) return refuseRepin(['refuse: not a run id: ' + runId]);
  const runDir = path.join(ctx.overlayRoot, RUNS_FOLDER, runId);
  const buffer = readBufferOrNull(path.join(runDir, 'backup.json'));
  if (!buffer) return refuseRepin([`refuse: no backup for run ${runId} in ${ctx.overlayLabel}/${RUNS_FOLDER}`]);
  const backup = JSON.parse(buffer.toString('utf8'));
  if (backup.schemaVersion !== 1 || !Array.isArray(backup.entries)) {
    return refuseRepin([`refuse: the backup for run ${runId} has an unsupported shape`]);
  }
  return withLock(ctx, 'overlay-engine repin rollback', () => rollbackUnderLock(ctx, runDir, backup));
}

/**
 * Run a re-pin or a rollback, collecting every printed line for the report.
 * With --json the lines go into the report instead of the terminal.
 * @param {object} ctx Engine context of the live tree.
 * @param {{upstream?: string, to?: string, stage?: string|null, rollback?: string|null, isJson?: boolean}} options
 * @returns {number} Exit code.
 */
function commandRepin(ctx, options) {
  const report = {
    result: null,
    mode: options.rollback ? 'rollback' : (options.stage ? 'stage' : 'live'),
    runId: options.rollback || null,
    copy: 0,
    delete: 0,
    blocked: [],
    equalsUpstream: [],
    notCopied: [],
    rootFiles: [],
    upstreamLost: [],
    notes: [],
    stageSkipped: null,
    lines: [],
  };
  const original = console.log;
  console.log = (...args) => {
    const line = args.join(' ');
    report.lines.push(line);
    if (!options.isJson) original(line);
  };
  let code;
  try {
    code = options.rollback ? rollbackRun(ctx, options.rollback) : repinRun(ctx, options, report);
    // A lock refusal comes from withLock, which prints no result line of its own.
    const last = report.lines[report.lines.length - 1];
    if (!last || !last.startsWith('RESULT: ')) console.log('RESULT: ' + (code === EXIT_OK ? 'PASSED' : 'FAILED'));
  } finally {
    console.log = original;
  }
  if (report.result === null) {
    const last = report.lines.filter((line) => line.startsWith('RESULT: ')).pop();
    report.result = last ? last.slice('RESULT: '.length) : (code === EXIT_OK ? 'PASSED' : 'FAILED');
  }
  if (options.isJson) console.log(JSON.stringify(report, null, 2));
  return code;
}

// ─────────────────────────────────────────────────────────────────────────────
// 17. STRICT WRITES
//
// Off unless the manifest sets "strictWrites": true, so a repository that
// vendors nothing is never checked. A vendoring project turns it on because the
// guard above only knows the paths an overlay already owns. A new file in the
// vendored tree has no upstream copy for a re-pin to carry, and an edit to an
// upstream file no overlay owns is overwritten by the next re-pin. Both are
// found weeks later, at the re-pin, unless the write is refused when it is made.
// The same test runs three times: at the edit (--guard), at the commit
// (pre-commit) and when a path is brought under an overlay (apply --adopt).
// ─────────────────────────────────────────────────────────────────────────────

function isStrictWrites(manifest) {
  if (manifest.strictWrites !== undefined && typeof manifest.strictWrites !== 'boolean') {
    throw new Error('the manifest strictWrites value must be true or false');
  }
  return manifest.strictWrites === true;
}

// `*` matches inside one path segment. `**` on its own matches across segments,
// while `**/` matches zero or more whole segments, so a glob naming a file in
// any folder never also matches a longer file name beside it.
function globToRegExp(glob) {
  let pattern = '';
  for (let index = 0; index < glob.length; index += 1) {
    const char = glob[index];
    if (char === '*' && glob[index + 1] === '*') {
      const isWholeSegments = glob[index + 2] === '/';
      pattern += isWholeSegments ? '(?:.*/)?' : '.*';
      index += 1;
      if (isWholeSegments) index += 1;
    } else if (char === '*') {
      pattern += '[^/]*';
    } else {
      pattern += char.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
    }
  }
  return new RegExp('^' + pattern + '$');
}

/**
 * Read what the write checks need from the manifest: the vendored roots, the
 * named root files, the `repin.exclude` paths, and the `generated` globs. A
 * generated path is written by one of the project's generators, so no overlay
 * can own it and no check refuses it. An excluded path is one a re-pin never
 * copies, so a write there cannot be lost and no check refuses it either.
 * @param {object} manifest Loaded overlay manifest.
 * @returns {{roots: string[], rootFiles: string[], exclude: string[], isGenerated: (key: string) => boolean}}
 */
function writeCheckSettings(manifest) {
  const { roots, rootFiles, exclude } = repinSettings(manifest);
  const generated = manifest.generated === undefined ? [] : manifest.generated;
  if (!Array.isArray(generated) || generated.some((glob) => typeof glob !== 'string' || glob === '')) {
    throw new Error('the manifest generated list must be a list of glob strings');
  }
  const patterns = generated.map(globToRegExp);
  return { roots, rootFiles, exclude, isGenerated: (key) => patterns.some((pattern) => pattern.test(key)) };
}

/**
 * Say whether a re-pin would copy over a key, which is the only reason a write
 * to it goes through an overlay. An excluded path is the project's own, because
 * the copy never reaches it, so a refusal there would name a lost edit that
 * cannot happen.
 * @param {string} key Path relative to the tree.
 * @param {object} settings Result of the write checks' manifest read.
 * @returns {boolean}
 */
function isVendoredKey(key, settings) {
  if (isUnderAny(key, settings.exclude)) return false;
  return settings.rootFiles.includes(key) || settings.roots.some((root) => key.startsWith(root + '/'));
}

function isIgnoredByGit(root, filePath) {
  return runGit(root, ['check-ignore', '-q', '--', filePath]).status === 0;
}

// A path as a command line takes it: quoted when it holds a space or another
// character a shell would split or expand, so a printed command can be pasted.
function shellPath(key) {
  return /^[A-Za-z0-9._\/-]+$/.test(key) ? key : '"' + key.replace(/(["\\$`])/g, '\\$1') + '"';
}

// Where adopt keeps a destination inside the overlay folder: the framework's
// own tree under framework/, every other path under root/ with its leading
// dots dropped, so no copy is a hidden folder.
function adoptSource(key) {
  if (key === '.skilled') return 'framework';
  if (key.startsWith('.skilled/')) return 'framework/' + key.slice('.skilled/'.length);
  return 'root/' + key.replace(/^\.+/, '');
}

// The earlier place for an adopted copy: the same path with the leading dots
// dropped. Only an excluded path still reads a copy kept there.
function legacyAdoptSource(key) {
  return key.replace(/^\.+/, '');
}

// The highest missing folder above a new file, at least two segments deep, so
// a new skill is adopted as one directory entry rather than one entry per file.
function adoptionUnit(root, filePath) {
  let unit = filePath;
  let parent = path.dirname(filePath);
  while (isWithin(root, parent) && !pathExists(parent) &&
      path.relative(root, parent).split(path.sep).length >= 2) {
    unit = parent;
    parent = path.dirname(parent);
  }
  return unit;
}

// The directory or skill-root entry whose destination folder holds a key.
function folderEntryHolding(manifest, key) {
  for (const entry of manifest.overlays) {
    if (entry.scope !== 'directory' && entry.scope !== 'skill-root') continue;
    const destination = path.posix.normalize(entry.destination);
    if (key.startsWith(destination + '/')) return { entry, relative: key.slice(destination.length + 1) };
  }
  return null;
}

/**
 * Say why a write under a vendored root must go through an overlay first, or
 * return null to allow it. The caller has already refused every existing path
 * an overlay owns, so what reaches here is unowned, new, generated or managed.
 * @param {object} ctx Engine context.
 * @param {object} manifest Loaded overlay manifest.
 * @param {string} inputPath Path to test, relative to the cwd or absolute.
 * @returns {string|null} One refusal line, or null.
 */
function strictWriteRefusal(ctx, manifest, inputPath) {
  if (!isStrictWrites(manifest)) return null;
  const root = canonicalPath(ctx.root);
  const filePath = canonicalPath(path.resolve(process.cwd(), inputPath));
  if (!isWithin(root, filePath) || filePath === root) return null;
  const key = relativeKey(root, filePath);
  const settings = writeCheckSettings(manifest);
  if (!isVendoredKey(key, settings) || isDirectory(filePath)) return null;
  if (settings.isGenerated(key) || isIgnoredByGit(root, filePath)) return null;

  const overlay = ctx.overlayLabel + '/';
  const isLive = pathExists(filePath);
  const holder = folderEntryHolding(manifest, key);
  if (managedPathTest(ctx, manifest)(key)) {
    // A link or a regenerated output is written by apply, and an existing owned
    // file was refused before this ran. Only a new file in an owned folder is left.
    if (isLive || !holder) return null;
    // A path a skill-root entry removes, and does not also replace, is deleted by
    // every apply, so a copy in the overlay folder would never be installed.
    const isUnder = (prefix) => holder.relative === prefix || holder.relative.startsWith(prefix + '/');
    const normalizeList = (list) => (list || []).map((value) => path.posix.normalize(value).replace(/\/+$/, ''));
    const removedBy = holder.entry.scope === 'skill-root' && !normalizeList(holder.entry.replace).some(isUnder)
      ? normalizeList(holder.entry.remove).find(isUnder)
      : undefined;
    if (removedBy !== undefined) {
      return `refuse: ${key} is under ${removedBy}, which overlay ${holder.entry.id} removes on every apply; ` +
        `take ${removedBy} off that entry's remove list, add ${holder.relative} to its replace list, keep its copy ` +
        `at ${overlay}${holder.entry.source}/${holder.relative}, then run ${ENGINE_COMMAND} apply`;
    }
    return `refuse: ${key} is a new file inside overlay ${holder.entry.id}; create it as ` +
      `${overlay}${holder.entry.source}/${holder.relative}, then run ${ENGINE_COMMAND} apply`;
  }
  if (holder) {
    // Inside a skill-root folder but not on its replace list: the entry keeps
    // the upstream file as found, and only that list can hand it to the overlay.
    return `refuse: ${key} is ${isLive ? 'an upstream file overlay ' + holder.entry.id + ' keeps as it is' :
      'a new file overlay ' + holder.entry.id + ' does not replace'}; add ${holder.relative} to that entry's ` +
      `replace list${isLive ? ', and take it off the retained list if it is there' : ''}, keep its copy at ` +
      `${overlay}${holder.entry.source}/${holder.relative}, then run ${ENGINE_COMMAND} apply`;
  }
  if (isLive) {
    return `refuse: ${key} is a vendored file no overlay owns, so a re-pin would overwrite this edit; run ` +
      `${ENGINE_COMMAND} apply --adopt ${shellPath(key)}, then edit ${overlay}${adoptSource(key)}`;
  }
  const unitKey = relativeKey(root, adoptionUnit(root, filePath));
  return `refuse: ${key} is a new file in the vendored tree, which a re-pin would not carry; create it as ` +
    `${overlay}${adoptSource(key)}, then run ${ENGINE_COMMAND} apply --adopt ${shellPath(unitKey)}`;
}

function pathsOverlap(left, right) {
  return left === right || left.startsWith(right + '/') || right.startsWith(left + '/');
}

// Why a destination or its overlay source collides with an existing entry.
function adoptOverlap(ctx, manifest, key, source) {
  for (const entry of manifest.overlays) {
    const destinations = entry.scope === 'remove-root' ? (entry.paths || []) : [entry.destination];
    if (destinations.some((destination) => typeof destination === 'string' &&
        pathsOverlap(path.posix.normalize(destination), key))) {
      return `${key} overlaps overlay ${entry.id}; change that entry or its source instead`;
    }
    const sources = ['source', 'base', 'fragment'].map((field) => entry[field])
      .filter((value) => typeof value === 'string');
    if (sources.some((value) => pathsOverlap(path.posix.normalize(value), source))) {
      return `${ctx.overlayLabel}/${source} overlaps the source of overlay ${entry.id}`;
    }
  }
  return null;
}

function isRefusedAdoptName(filePath) {
  if (isEnvName(filePath)) return true;
  return isTokenName(filePath) && !TOKEN_NAME_ADOPT_EXTENSIONS.has(path.extname(filePath).toLowerCase());
}

function adoptionId(manifest, key) {
  const slug = key.replace(/[^A-Za-z0-9]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase();
  const ids = new Set(manifest.overlays.map((entry) => entry.id));
  let id = 'adopted-' + slug;
  for (let suffix = 2; ids.has(id); suffix += 1) id = `adopted-${slug}-${suffix}`;
  return id;
}

/**
 * Append one entry to the manifest's overlays list, changing no other text, so
 * the file keeps its formatting and every key the engine does not know.
 * @param {object} ctx Engine context.
 * @param {object} entry Manifest overlay entry.
 */
function appendOverlayEntry(ctx, entry) {
  const text = fs.readFileSync(ctx.manifestPath, 'utf8');
  const list = nodeAtPath(parseJsonSource(text), ['overlays']);
  if (list.type !== 'array') throw new Error('the manifest overlays value is not a list');
  const last = list.items[list.items.length - 1];
  const indent = (last && indentBefore(text, last.start)) || '    ';
  const body = JSON.stringify(entry, null, 2).split('\n').join('\n' + indent);
  const updated = last
    ? text.slice(0, last.end) + ',\n' + indent + body + text.slice(last.end)
    : text.slice(0, list.start) + '[\n' + indent + body + '\n  ]' + text.slice(list.end);
  writeFileAtomic(ctx.manifestPath, updated);
}

/**
 * Bring one vendored path under an overlay; the caller holds the lock.
 * @param {object} ctx Engine context.
 * @param {object} manifest Loaded overlay manifest.
 * @param {string} inputPath Path to adopt, relative to the tree, the cwd or absolute.
 * @returns {number} 0 when adopted and applied, 1 when the apply is blocked, 2 on refusal.
 */
function adoptUnderLock(ctx, manifest, inputPath) {
  const refuse = (message) => {
    console.log('refuse: ' + message);
    return EXIT_ERROR;
  };
  const root = canonicalPath(ctx.root);
  const settings = writeCheckSettings(manifest);
  // A path under repin.exclude would be vendored but for that list. A re-pin never
  // copies it, so it needs no overlay, yet a project may keep its copy in the
  // overlay folder to carry it. Adopt takes such a path only from that copy.
  const isExcludedVendoredKey = (key) => isUnderAny(key, settings.exclude) &&
    isVendoredKey(key, { ...settings, exclude: [] });
  // An excluded path's copy may still sit at its earlier dot-dropped place, so
  // both are read, the current place first.
  const overlayCopyOf = (key) => [adoptSource(key), legacyAdoptSource(key)]
    .find((source) => pathExists(path.join(ctx.overlayRoot, ...source.split('/'))));
  const hasOverlayCopy = (key) => overlayCopyOf(key) !== undefined;
  const candidates = captureCandidates(root, inputPath)
    .map((candidate) => canonicalPathWithoutLeaf(candidate))
    .filter((candidate) => isWithin(root, candidate) && candidate !== root);
  const destinationPath = candidates.find((candidate) => {
    const key = relativeKey(root, candidate);
    return isVendoredKey(key, settings) || (isExcludedVendoredKey(key) && hasOverlayCopy(key));
  });
  const excludedPath = candidates.find((candidate) => isExcludedVendoredKey(relativeKey(root, candidate)));
  const rootSkilledPath = (destinationPath ? [destinationPath] : candidates)
    .find((candidate) => isUnderRootSkilled(adoptSource(relativeKey(root, candidate))));
  if (rootSkilledPath) {
    const key = relativeKey(root, rootSkilledPath);
    return refuse(`${key} would keep its copy at ${ctx.overlayLabel}/${adoptSource(key)}, under root/skilled, ` +
      'which holds no copy; the framework\'s own files sit under .skilled/ and adopt to framework/');
  }
  if (!destinationPath && excludedPath) {
    const key = relativeKey(root, excludedPath);
    return refuse(`${key} is under repin.exclude, so adopt takes it only from its overlay copy at ` +
      `${ctx.overlayLabel}/${adoptSource(key)}, which does not exist; move or create the file there, then adopt again`);
  }
  if (!destinationPath) {
    return refuse(`${inputPath} is not under a vendored root (${settings.roots.join(', ')}) and is not a file ` +
      'named in repin.rootFiles');
  }
  const key = relativeKey(root, destinationPath);
  const source = (isExcludedVendoredKey(key) && overlayCopyOf(key)) || adoptSource(key);
  const sourcePath = path.join(ctx.overlayRoot, ...source.split('/'));
  const shownSource = ctx.overlayLabel + '/' + source;
  // A link inside the overlay folder would take the copy somewhere the manifest
  // entry does not name, so the source has to resolve inside the folder itself.
  if (!isWithin(canonicalPath(ctx.overlayRoot), canonicalPath(sourcePath))) {
    return refuse(`${shownSource} resolves outside the overlay folder through a link; adopt writes only inside ${ctx.overlayLabel}`);
  }
  if (settings.isGenerated(key)) {
    return refuse(`${key} is on the manifest's generated list; change what it is generated from instead`);
  }
  const overlap = adoptOverlap(ctx, manifest, key, source);
  if (overlap) return refuse(overlap);

  const isLive = pathExists(destinationPath);
  const hasSource = pathExists(sourcePath);
  if (isLive && hasSource) return refuse(`both ${key} and ${shownSource} exist; keep one, then adopt again`);
  if (!isLive && !hasSource) return refuse(`nothing to adopt; create ${shownSource} first`);

  const fromPath = hasSource ? sourcePath : destinationPath;
  const files = isDirectory(fromPath) ? listTreePaths(fromPath) : [fromPath];
  for (const filePath of files) {
    if (isRefusedAdoptName(filePath)) {
      return refuse(`${path.basename(filePath)} is a protected path and cannot be an overlay`);
    }
    if (!isFile(filePath)) {
      return refuse(`${toPosix(path.relative(fromPath, filePath)) || path.basename(filePath)} is not a regular file; ` +
        'adopt takes files and folders only');
    }
  }

  // An upstream file becomes a file entry pinned to upstream's bytes, so the
  // next re-pin reports upstream-moved instead of keeping or losing the copy
  // without a word.
  let pinnedSha256 = null;
  if (isLive) {
    const pin = manifest.pin || {};
    const readUpstream = pinnedUpstreamBytes(manifest);
    if (!readUpstream || resolveCommit(pin.checkout, pin.commit) === null) {
      return refuse(`cannot read pin.commit in the upstream checkout pin.checkout names, to tell whether ${key} ` +
        'is upstream\'s; adopt it where that checkout exists');
    }
    const shipped = files.map((filePath) => relativeKey(root, filePath))
      .filter((fileKey) => readUpstream(fileKey) !== null);
    if (shipped.length > 0 && isDirectory(destinationPath)) {
      return refuse(`upstream ships ${shipped.length} file(s) under ${key}, such as ${shipped.sort()[0]}; ` +
        'adopt each upstream file on its own');
    }
    if (shipped.length > 0) pinnedSha256 = sha256(readUpstream(key));
    for (const filePath of files) {
      copyUpstreamEntry(filePath, path.join(sourcePath, path.relative(destinationPath, filePath)));
    }
  }

  const isFolder = isDirectory(sourcePath);
  const entry = { id: adoptionId(manifest, key), scope: isFolder ? 'directory' : 'file', source, destination: key };
  // A directory walk refuses a token-named file the entry does not list, so
  // the names adopt accepted as source code are recorded with the entry.
  const tokenNamed = isFolder
    ? listTreePaths(sourcePath).filter(isTokenName).map((filePath) => toPosix(path.relative(sourcePath, filePath)))
    : [];
  if (tokenNamed.length > 0) entry.protectedPaths = tokenNamed.sort();
  if (pinnedSha256) entry.pinnedSha256 = pinnedSha256;
  entry.description = pinnedSha256
    ? 'Overlay of an upstream file. pinnedSha256 is the upstream copy it was taken from.'
    : 'Project addition with no upstream copy. This entry is what carries it across a re-pin.';
  appendOverlayEntry(ctx, entry);
  console.log(`adopted ${key} as ${shownSource} (${entry.scope} entry ${entry.id})`);
  return applyUnderLock(ctx, loadManifest(ctx));
}

/**
 * Bring one vendored path under an overlay, then apply.
 * @param {object} ctx Engine context.
 * @param {string} inputPath Path to adopt.
 * @param {{lock?: object}} [options] A lock the caller already holds.
 * @returns {number} Exit code.
 */
function commandAdopt(ctx, inputPath, options = {}) {
  const manifest = loadManifest(ctx);
  return withLock(ctx, 'overlay-engine adopt', () => adoptUnderLock(ctx, manifest, inputPath), options);
}

function gitTextOrNull(cwd, args, env) {
  const result = runGit(cwd, args, env);
  return result.status === 0 ? result.stdout.toString('utf8') : null;
}

function gitBytesOrNull(cwd, args, env) {
  const result = runGit(cwd, args, env);
  return result.status === 0 ? result.stdout : null;
}

/**
 * Compare two file contents as text, ignoring a CRLF versus LF line-ending
 * difference. A NUL byte marks a binary file, which has no line endings to
 * ignore, so such a pair never matches here.
 * @param {Buffer} left One file's bytes.
 * @param {Buffer} right The other file's bytes.
 * @returns {boolean} Whether both hold the same lines.
 */
function isSameText(left, right) {
  if (left.includes(0) || right.includes(0)) return false;
  // Latin-1 maps one byte to one character, so nothing is lost or reshaped.
  return left.toString('latin1').replace(/\r\n/g, '\n') === right.toString('latin1').replace(/\r\n/g, '\n');
}

function pinCommitOf(manifestText) {
  try {
    return JSON.parse(manifestText).pin.commit;
  } catch {
    return undefined;
  }
}

/**
 * List the staged changes under a vendored root that no overlay owns. A write
 * hook sees only an agent's write tools, and a script, a shell edit or a
 * person reaches the tree without one, so the commit is checked too. A staged
 * copy equal to upstream's is upstream's own file, and a commit that moves the
 * pin is a re-pin, which the re-pin's own drift scan already judged.
 * @param {object} ctx Engine context.
 * @param {object} manifest Loaded overlay manifest.
 * @returns {{status: string, key: string}[]} One record per unowned staged path.
 */
function stagedUnownedChanges(ctx, manifest) {
  const root = canonicalPath(ctx.root);
  // The top level is found without the hook's GIT_DIR, but the index reads below
  // keep it: a commit with -a or a path list hands the hook a temporary index.
  const topLevel = gitTopLevelOrNull(root);
  if (topLevel === null) return [];
  const prefix = toPosix(path.relative(topLevel, root));
  const listing = gitTextOrNull(topLevel, ['diff', '--cached', '--name-status', '--no-renames', '-z']);
  if (!listing) return [];
  const settings = writeCheckSettings(manifest);
  const parts = listing.split('\0').filter(Boolean);
  const changes = [];
  for (let index = 0; index + 1 < parts.length; index += 2) {
    const file = parts[index + 1];
    if (prefix && !file.startsWith(prefix + '/')) continue;
    const key = prefix ? file.slice(prefix.length + 1) : file;
    if (isVendoredKey(key, settings)) changes.push({ status: parts[index][0], file, key });
  }
  if (changes.length === 0) return [];

  // A manifest beside the tree has no path under the tree's prefix, so its git path
  // comes from where it is. One outside the repository has no staged or HEAD pin.
  let manifestFile = path.posix.join(prefix, toPosix(path.relative(ctx.root, ctx.manifestPath)));
  if (ctx.overlayOutside) {
    manifestFile = toPosix(path.relative(topLevel, canonicalPath(ctx.manifestPath)));
    if (manifestFile === '' || manifestFile === '..' || manifestFile.startsWith('../') || path.isAbsolute(manifestFile)) {
      throw new Error('the overlay folder must sit inside the same git repository as the tree; ' +
        ctx.overlayLabel + ' is outside the git repository at ' + topLevel);
    }
  }
  const stagedPin = pinCommitOf(gitTextOrNull(topLevel, ['show', ':' + manifestFile]));
  const headPin = pinCommitOf(gitTextOrNull(topLevel, ['show', 'HEAD:' + manifestFile]));
  if (stagedPin !== undefined && headPin !== undefined && stagedPin !== headPin) return [];

  const pin = manifest.pin || {};
  const hasCheckout = typeof pin.checkout === 'string' && typeof pin.commit === 'string' && isDirectory(pin.checkout);
  const isManaged = managedPathTest(ctx, manifest);
  // The upstream checkout is another repository, so its reads must not inherit the
  // GIT_DIR a hook exports for this one, or they would read this repository instead.
  const upstreamEnv = hookFreeEnv();
  return changes.filter((change) => {
    if (isManaged(change.key) || settings.isGenerated(change.key)) return false;
    if (!hasCheckout) return true;
    const upstreamBlob = gitTextOrNull(pin.checkout, ['rev-parse', '--verify', '--quiet', '--end-of-options', `${pin.commit}:${change.key}`], upstreamEnv);
    // Deleting a file upstream never shipped removes the project's own stray file.
    if (change.status === 'D') return upstreamBlob !== null;
    const stagedBlob = gitTextOrNull(topLevel, ['rev-parse', '--verify', '--quiet', ':' + change.file]);
    if (upstreamBlob !== null && stagedBlob !== null && upstreamBlob.trim() === stagedBlob.trim()) return false;
    if (upstreamBlob === null || stagedBlob === null) return true;
    // A project may normalise line endings on commit, so the same text can reach
    // the index as different bytes than upstream stored. Compare the contents
    // before calling a staged copy a change.
    const upstreamBytes = gitBytesOrNull(pin.checkout, ['cat-file', 'blob', '--end-of-options', `${pin.commit}:${change.key}`], upstreamEnv);
    const stagedBytes = gitBytesOrNull(topLevel, ['cat-file', 'blob', ':' + change.file]);
    return !(upstreamBytes !== null && stagedBytes !== null && isSameText(upstreamBytes, stagedBytes));
  }).map(({ status, key }) => ({ status, key }));
}

/**
 * List the blobs upstream holds at one commit, under the given roots and root
 * files.
 * @param {string} upstream Upstream checkout.
 * @param {string} commit Commit id.
 * @param {string[]} pathspecs Vendored roots and root files to list.
 * @returns {Map<string, {mode: string, object: string}>} One record per path,
 *   keyed by the path relative to the tree. A submodule is left out: the tree
 *   carries no bytes for it.
 */
function lsTreeBlobs(upstream, commit, pathspecs) {
  const blobs = new Map();
  for (const record of gitText(upstream, ['ls-tree', '-r', '-z', '--end-of-options', commit, '--', ...pathspecs]).split('\0')) {
    const tab = record.indexOf('\t');
    if (tab < 0) continue;
    const [mode, type, object] = record.slice(0, tab).split(' ');
    if (type !== 'blob') continue;
    blobs.set(record.slice(tab + 1), { mode, object });
  }
  return blobs;
}

/**
 * Hash a batch of tree files in one git run, so an audit of a whole vendored
 * tree costs one process rather than one per file. Every filter is skipped, so
 * each id names the bytes on disk, which is what a re-pin compares.
 * @param {string} root Tree root.
 * @param {string} format The checkout's object format, used for a file git will
 *   not hash on its own.
 * @param {string[]} keys Paths relative to the tree root.
 * @returns {Map<string, string>} One object id per key.
 */
function blobIdsInTree(root, format, keys) {
  const ids = new Map();
  if (keys.length === 0) return ids;
  const result = spawnSync('git', ['-C', root, 'hash-object', '--no-filters', '--stdin-paths'], {
    input: Buffer.from(keys.join('\n') + '\n'), maxBuffer: GIT_MAX_BUFFER,
  });
  if (result.error) throw result.error;
  const lines = result.status === 0 ? result.stdout.toString('utf8').split('\n') : [];
  for (let index = 0; index < keys.length; index += 1) {
    // A batch git refuses, and any file that moved under it, is hashed from the
    // bytes here rather than reported as drift.
    ids.set(keys[index], lines[index] || gitBlobId(format, fs.readFileSync(path.join(root, keys[index]))));
  }
  return ids;
}

/**
 * List the paths git tracks in a tree, relative to that tree's own root. The
 * repository may hold the tree in a folder of its own, so the listing is mapped
 * back onto the tree.
 * @param {string} root Tree root.
 * @returns {string[]} Paths relative to the tree root.
 */
function trackedTreeKeys(root) {
  // A temporary folder sits behind a link on some systems, so the tree's own
  // path is resolved before it is compared with the repository's top level.
  const projectRoot = canonicalPath(root);
  const topLevel = gitTopLevelOrNull(projectRoot);
  if (topLevel === null) return [];
  const prefix = toPosix(path.relative(topLevel, projectRoot));
  const listing = gitTextOrNull(topLevel, ['ls-files', '-z']);
  if (!listing) return [];
  const keys = [];
  for (const file of listing.split('\0').filter(Boolean)) {
    if (!prefix) {
      keys.push(file);
    } else if (file.startsWith(prefix + '/')) {
      keys.push(file.slice(prefix.length + 1));
    }
  }
  return keys;
}

/**
 * Compare the vendored tree with upstream at the pin, for the paths no overlay
 * owns. The strict write checks judge a write as it is made, so a vendored file
 * that already differs from upstream, or an upstream file the tree lacks, waits
 * for a re-pin to refuse the run unless something reports it first.
 * @param {object} ctx Engine context.
 * @param {object} manifest Loaded overlay manifest.
 * @returns {{isAvailable: boolean, findings: {kind: string, path: string}[]}}
 *   One finding per unowned path that drifted, sorted by path. `isAvailable` is
 *   false when the manifest names no checkout that holds the pin.
 */
/**
 * Build the test for a vendored path no overlay owns, the only kind of path
 * whose drift from the pin a re-pin would lose.
 * @param {object} ctx Engine context.
 * @param {object} manifest Loaded overlay manifest.
 * @returns {{settings: object, isJudged: (key: string) => boolean}}
 */
function unownedVendoredJudge(ctx, manifest) {
  const settings = writeCheckSettings(manifest);
  const isManaged = managedPathTest(ctx, manifest);
  // A generated path is one of the project's own outputs and a managed one is
  // written back by apply, so neither can hold drift a re-pin would lose.
  const isJudged = (key) => isVendoredKey(key, settings) && !settings.isGenerated(key) &&
    !isManaged(key) && !isEnvName(key);
  return { settings, isJudged };
}

/**
 * List the unowned paths the pin ships that the tree lacks. A re-pin copies
 * only the paths upstream changed, so such a path stays missing through every
 * later re-pin. Only one lstat per pinned path, so plain status can afford it.
 * @param {object} ctx Engine context.
 * @param {object} manifest Loaded overlay manifest with a readable pin.
 * @returns {string[]} Sorted paths relative to the tree.
 */
function missingUnownedPaths(ctx, manifest) {
  const pin = manifest.pin;
  const { settings, isJudged } = unownedVendoredJudge(ctx, manifest);
  const missing = [];
  for (const key of lsTreeBlobs(pin.checkout, pin.commit, [...settings.roots, ...settings.rootFiles]).keys()) {
    if (!isJudged(key)) continue;
    try {
      fs.lstatSync(path.join(ctx.root, key));
    } catch (error) {
      if (!error || (error.code !== 'ENOENT' && error.code !== 'ENOTDIR')) throw error;
      missing.push(key);
    }
  }
  return missing.sort();
}

const MISSING_NOTE_SHOWN = 5;

function missingPathsNote(missing) {
  const count = missing.length;
  const shown = missing.slice(0, MISSING_NOTE_SHOWN).join(', ');
  const more = count > MISSING_NOTE_SHOWN ? ` and ${count - MISSING_NOTE_SHOWN} more` : '';
  return `${count} unowned upstream ${count === 1 ? 'path at the pin is' : 'paths at the pin are'} missing from the tree: ` +
    `${shown}${more}; restore ${count === 1 ? 'it' : 'them'} from the pinned commit, and run status --audit for the full drift report`;
}

function auditVendoredTree(ctx, manifest) {
  const pin = manifest.pin || {};
  if (typeof pin.checkout !== 'string' || typeof pin.commit !== 'string' || !isDirectory(pin.checkout)) {
    return { isAvailable: false, findings: [] };
  }
  // A folder that is not a repository, or one that never fetched the pinned
  // commit, holds no copy to compare against. The audit reports itself skipped
  // instead of letting the unreadable pin fail the whole status run.
  if (resolveCommit(pin.checkout, pin.commit) === null) return { isAvailable: false, findings: [] };
  const { settings, isJudged } = unownedVendoredJudge(ctx, manifest);
  const format = objectFormat(pin.checkout);
  const upstream = lsTreeBlobs(pin.checkout, pin.commit, [...settings.roots, ...settings.rootFiles]);
  const findings = [];
  const regular = [];

  for (const [key, blob] of upstream) {
    if (!isJudged(key)) continue;
    const filePath = path.join(ctx.root, key);
    let stats;
    try {
      stats = fs.lstatSync(filePath);
    } catch (error) {
      if (!error || (error.code !== 'ENOENT' && error.code !== 'ENOTDIR')) throw error;
      findings.push({ kind: 'missing', path: key });
      continue;
    }
    const isUpstreamLink = blob.mode === '120000';
    if (stats.isDirectory() || isUpstreamLink !== stats.isSymbolicLink()) {
      findings.push({ kind: 'differs', path: key });
      continue;
    }
    if (isUpstreamLink) {
      const target = gitBytesOrNull(pin.checkout, ['cat-file', 'blob', blob.object]);
      if (target === null || !target.equals(Buffer.from(fs.readlinkSync(filePath)))) {
        findings.push({ kind: 'differs', path: key });
      }
      continue;
    }
    regular.push({ key, blob, filePath });
  }

  const treeIds = blobIdsInTree(ctx.root, format, regular.map((entry) => entry.key));
  for (const entry of regular) {
    if (treeIds.get(entry.key) === entry.blob.object) continue;
    // A re-pin refuses a path whose bytes are not upstream's bytes, so the same
    // comparison runs here. An audit that read CRLF as LF would pass a tree the
    // next re-pin refuses.
    const upstreamBytes = gitBytesOrNull(pin.checkout, ['cat-file', 'blob', entry.blob.object]);
    if (upstreamBytes !== null && upstreamBytes.equals(fs.readFileSync(entry.filePath))) continue;
    findings.push({ kind: 'differs', path: entry.key });
  }

  for (const key of trackedTreeKeys(ctx.root)) {
    if (upstream.has(key) || !isJudged(key)) continue;
    // A tracked path deleted from the working tree is the other side's drift.
    if (!pathExists(path.join(ctx.root, key))) continue;
    findings.push({ kind: 'extra', path: key });
  }
  findings.sort((left, right) => (left.path < right.path ? -1 : left.path > right.path ? 1 : 0));
  return { isAvailable: true, findings };
}

/**
 * Refuse a commit that stages a vendored change no overlay owns. Never writes.
 * @param {object} ctx Engine context.
 * @returns {number} 0 to allow, 1 to refuse.
 */
function commandPreCommit(ctx) {
  const manifest = loadManifest(ctx);
  if (!isStrictWrites(manifest)) {
    console.log('allow: strictWrites is off in the overlay manifest, so nothing was checked');
    return EXIT_OK;
  }
  const unowned = stagedUnownedChanges(ctx, manifest);
  if (unowned.length === 0) {
    console.log('allow');
    return EXIT_OK;
  }
  for (const change of unowned) {
    console.log(`refuse: staged ${change.status === 'D' ? 'deletion of' : 'change to'} ${change.key} is under a vendored root and no overlay owns it`);
  }
  console.log(`  bring each path under an overlay with ${ENGINE_COMMAND} apply --adopt <path>, add a generator's output to ` +
    'the manifest\'s generated list, or unstage it');
  return EXIT_CONFLICT;
}

// ─────────────────────────────────────────────────────────────────────────────
// 18. RELAYOUT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Resolve one path the manifest names inside the overlay folder, refusing any
 * that leaves it.
 * @param {object} ctx Engine context.
 * @param {string} value Path as the manifest writes it.
 * @returns {{absolute: string, relative: string}|{problem: string}} The resolved
 *   path, or why it cannot be used.
 */
function containedOverlayPath(ctx, value) {
  const absolute = path.resolve(ctx.overlayRoot, value);
  try {
    return { absolute, relative: sourceRelative(ctx, absolute) };
  } catch (error) {
    return { problem: error.message };
  }
}

/**
 * Group moved fields by the copy each one names, so a copy two fields name
 * moves once.
 * @param {object[]} moves Records from layoutMoves.
 * @returns {object[]} One group per source path, carrying the fields naming it.
 */
function groupLayoutMoves(moves) {
  const groups = new Map();
  for (const move of moves) {
    const group = groups.get(move.from);
    if (!group) {
      groups.set(move.from, { from: move.from, to: move.to, records: [move] });
      continue;
    }
    group.records.push(move);
    // Two fields naming the same copy belong at the same layout path, so a
    // second destination for it means the manifest disagrees with itself.
    if (group.to !== move.to) group.clashes = [...(group.clashes || []), move.to];
  }
  return [...groups.values()];
}

/**
 * Resolve every move into filesystem paths and collect what stops the run.
 * Nothing is written here, so a refusal leaves the tree as it stood.
 * @param {object} ctx Engine context.
 * @param {object[]} groups Groups from groupLayoutMoves.
 * @returns {{problems: string[], moves: object[], skipped: string[]}}
 */
function planRelayout(ctx, groups) {
  const problems = [];
  const moves = [];
  const skipped = [];
  const claimed = new Map();
  for (const group of groups) {
    if (group.clashes) {
      const destinations = [group.to, ...group.clashes].join(' and ');
      problems.push(`refuse: ${group.from} is claimed by ${destinations}; one copy cannot move to both`);
      continue;
    }
    const from = containedOverlayPath(ctx, group.from);
    const to = containedOverlayPath(ctx, group.to);
    if (from.problem || to.problem) {
      problems.push('refuse: ' + (from.problem || to.problem));
      continue;
    }
    if (isUnderRootSkilled(group.to)) {
      const ids = [...new Set(group.records.map((record) => record.overlay))].join(', ');
      problems.push(`refuse: ${ids}: ${group.from} belongs at ${group.to}, under root/skilled, which holds no copy; ` +
        'change the destination or remove the entry');
      continue;
    }
    if (pathExists(to.absolute)) {
      problems.push(`refuse: ${to.relative} already exists in ${ctx.overlayLabel}`);
      continue;
    }
    if (!pathExists(from.absolute)) {
      problems.push(`refuse: ${from.relative} does not exist in ${ctx.overlayLabel}`);
      continue;
    }
    // Moving a folder carries the copies inside it, so a second move out of that
    // folder would find its own path gone half-way through the run.
    const nested = moves.find((move) => isWithin(move.from.absolute, from.absolute) ||
      isWithin(from.absolute, move.from.absolute));
    if (nested) {
      problems.push(`refuse: ${nested.from.relative} and ${from.relative} sit one inside the other; ` +
        'they have to move in separate runs');
      continue;
    }
    if (claimed.has(to.relative)) {
      problems.push(`refuse: ${claimed.get(to.relative)} and ${from.relative} both belong at ${to.relative}`);
      continue;
    }
    claimed.set(to.relative, from.relative);
    // A credential file is never opened, so it cannot be backed up, and a copy
    // that cannot be backed up is left where it is.
    if (isEnvName(from.absolute)) {
      skipped.push(from.relative);
      continue;
    }
    moves.push({ from, to, records: group.records });
  }
  return { problems, moves, skipped };
}

/**
 * Copy one path into a backup folder, keeping its shape and never opening a
 * credential file. A backup is a second copy of the tree, so it holds only what
 * apply itself may read: a token-named path no manifest entry names exactly is
 * skipped rather than duplicated beside the source.
 * @param {string} sourcePath Path to copy.
 * @param {string} targetPath Where the copy goes.
 * @param {string} relativePath Position of the copy, for the `skipped` line.
 * @param {Set<string>} exact Absolute paths a manifest entry names exactly.
 * @param {string[]} [skipped] Collects every position skipped, so a caller can
 *   say what the backup lacks.
 */
function copyForBackup(sourcePath, targetPath, relativePath, exact, skipped) {
  let stats;
  try {
    stats = fs.lstatSync(sourcePath);
  } catch (error) {
    if (error && error.code === 'ENOENT') return;
    throw error;
  }
  if (stats.isSymbolicLink()) {
    // A link is restored as a link: following it would copy bytes belonging to
    // whatever it points at instead of the shape the folder had.
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.symlinkSync(fs.readlinkSync(sourcePath), targetPath);
    return;
  }
  if (stats.isDirectory()) {
    fs.mkdirSync(targetPath, { recursive: true });
    for (const name of fs.readdirSync(sourcePath).sort()) {
      copyForBackup(path.join(sourcePath, name), path.join(targetPath, name), relativePath + '/' + name, exact, skipped);
    }
    return;
  }
  if (isProtectedReadPath(sourcePath, exact)) {
    console.log(`skipped ${relativePath}`);
    if (skipped) skipped.push(relativePath);
    return;
  }
  writeFile(targetPath, fs.readFileSync(sourcePath), stats.mode & 0o777);
}

/**
 * Every layout link whose target reached through a copy about to move.
 * @param {object} ctx Engine context.
 * @param {object[]} moves Groups the run is about to move.
 * @param {object} manifest Loaded overlay manifest.
 * @returns {{path: string, from: string, target: string}[]} The link path, the
 *   target it names now and the target holding the same bytes afterwards.
 */
function relayoutLinkTargets(ctx, moves, manifest) {
  const changes = [];
  for (const link of manifest.layoutLinks || []) {
    if (!link || typeof link.path !== 'string' || typeof link.target !== 'string') continue;
    const linkDir = path.dirname(path.join(ctx.root, link.path));
    const reached = path.resolve(linkDir, link.target);
    const move = moves.find((candidate) => isWithin(candidate.from.absolute, reached));
    if (!move) continue;
    const below = path.relative(move.from.absolute, reached);
    const landed = below === '' ? move.to.absolute : path.join(move.to.absolute, below);
    const target = toPosix(path.relative(linkDir, landed));
    if (target === '' || target === link.target) continue;
    changes.push({ path: link.path, from: link.target, target });
  }
  return changes;
}

/**
 * Build the whole manifest text a relayout writes, without writing it. Every
 * check that can refuse the run runs here, so a manifest this run cannot
 * rewrite stops it while every copy is still at the path that manifest names.
 * Only the changed string values are replaced, so the rest keeps its bytes.
 * @param {object} ctx Engine context.
 * @param {object[]} fieldEdits The fields of the copies about to move.
 * @param {object[]} linkEdits Changes from relayoutLinkTargets.
 * @returns {string|null} The new manifest text, or null when no field changed.
 */
function planRelayoutManifest(ctx, fieldEdits, linkEdits) {
  const text = fs.readFileSync(ctx.manifestPath, 'utf8');
  const document = parseJsonSource(text);
  const edits = [];
  if (fieldEdits.length > 0) {
    const entries = new Map();
    for (const node of nodeAtPath(document, ['overlays']).items) {
      const id = node.type === 'object' ? findMember(node, 'id') : undefined;
      if (id && id.value.type === 'string') entries.set(id.value.value, node);
    }
    for (const change of fieldEdits) {
      const entry = entries.get(change.overlay);
      const member = entry && findMember(entry, change.field);
      // The manifest was read before the moves, so a field that no longer holds
      // the path this run moved is a different file from the one planned against.
      if (!member || member.value.value !== change.from) {
        throw new Error(`overlay ${change.overlay} no longer keeps ${change.from} in ${change.field}`);
      }
      edits.push({ start: member.value.start, end: member.value.end, text: JSON.stringify(change.to) });
    }
  }
  if (linkEdits.length > 0) {
    const links = new Map();
    for (const node of nodeAtPath(document, ['layoutLinks']).items) {
      const linkPath = node.type === 'object' ? findMember(node, 'path') : undefined;
      if (linkPath && linkPath.value.type === 'string') links.set(linkPath.value.value, node);
    }
    for (const change of linkEdits) {
      const node = links.get(change.path);
      const member = node && findMember(node, 'target');
      if (!member || member.value.value !== change.from) {
        throw new Error(`layout link ${change.path} no longer points at ${change.from}`);
      }
      edits.push({ start: member.value.start, end: member.value.end, text: JSON.stringify(change.target) });
    }
  }
  if (edits.length === 0) return null;
  return applyEdits(text, edits);
}

/**
 * Write the manifest text a relayout planned, once every copy has moved.
 * @param {object} ctx Engine context.
 * @param {string|null} text Text from planRelayoutManifest.
 */
function writeRelayoutManifest(ctx, text) {
  if (text === null) return;
  writeFileAtomic(ctx.manifestPath, text);
}

/**
 * Point every live link whose target a relayout moved at the new path.
 * A state file written before links were recorded holds nothing to authorise a
 * retarget with, so the run that moves the bytes repairs the link itself. Any
 * other path standing at a link entry is left alone, for the apply that follows
 * to report, because this run never takes a path it did not put there.
 * @param {object} ctx Engine context.
 * @param {{path: string, from: string, target: string}} change One change from
 *   relayoutLinkTargets.
 * @param {object[]} retargeted Receives the change once its old link is gone, so
 *   a rollback re-points a link even when writing the new one failed.
 */
function retargetRelayoutLink(ctx, change, retargeted) {
  const linkPath = path.join(ctx.root, change.path);
  let stats = null;
  try {
    stats = fs.lstatSync(linkPath);
  } catch (error) {
    if (!error || error.code !== 'ENOENT') throw error;
  }
  if (!stats || !stats.isSymbolicLink() || fs.readlinkSync(linkPath) !== change.from) return;
  fs.unlinkSync(linkPath);
  retargeted.push(change);
  ensureSymlink(linkPath, change.target);
  console.log(`relinked ${change.path} -> ${change.target}`);
}

/**
 * The folders between the overlay root and a path that do not exist yet.
 * @param {string} root Overlay root, never included.
 * @param {string} filePath Path whose parent folders are about to be made.
 * @returns {string[]} Missing folders, outermost first.
 */
function missingRelayoutParents(root, filePath) {
  const missing = [];
  for (let dir = path.dirname(filePath); dir !== root && isWithin(root, dir); dir = path.dirname(dir)) {
    if (fs.existsSync(dir)) break;
    missing.unshift(dir);
  }
  return missing;
}

/**
 * Undo every step a failed relayout completed, newest first. A step that cannot
 * be undone is recorded and the rest still run, so as much as possible is back.
 * @param {object} ctx Engine context.
 * @param {object} done What the run completed: `links`, `isManifestWritten`,
 *   `manifestBytes`, `moves` and `createdDirs`.
 * @returns {{path: string, message: string}|null} The first undo that failed.
 */
function rollbackRelayout(ctx, done) {
  let failure = null;
  const attempt = (label, undo) => {
    try {
      undo();
    } catch (error) {
      if (!failure) failure = { path: label, message: error.message };
    }
  };
  for (const change of [...done.links].reverse()) {
    attempt(change.path, () => ensureSymlink(path.join(ctx.root, change.path), change.from));
  }
  if (done.isManifestWritten) {
    attempt(toPosix(path.relative(ctx.overlayRoot, ctx.manifestPath)), () => writeFileAtomic(ctx.manifestPath, done.manifestBytes));
  }
  for (const move of [...done.moves].reverse()) {
    attempt(move.to.relative, () => fs.renameSync(move.to.absolute, move.from.absolute));
  }
  for (const dir of [...done.createdDirs].reverse()) {
    attempt(toPosix(path.relative(ctx.overlayRoot, dir)), () => {
      if (isDirectory(dir) && fs.readdirSync(dir).length === 0) fs.rmdirSync(dir);
    });
  }
  return failure;
}

/**
 * Remove one relayout run's backup, and the runs folder when this run made it
 * and nothing else is in it.
 * @param {string} runDir This run's backup folder.
 * @param {string} runsDir Folder holding every run's backup.
 * @param {boolean} isRunsDirNew True when this run created `runsDir`.
 */
function removeRelayoutBackup(runDir, runsDir, isRunsDirNew) {
  fs.rmSync(runDir, { recursive: true, force: true });
  if (isRunsDirNew && isDirectory(runsDir) && fs.readdirSync(runsDir).length === 0) fs.rmdirSync(runsDir);
}

/**
 * Move every copy the manifest keeps off the layout onto its layout path.
 * The backup stays inside the overlay folder, so the old copy is recoverable
 * beside the manifest that named it.
 * @param {object} ctx Engine context.
 * @param {object} manifest Loaded overlay manifest.
 * @returns {number} 0 when done or there was nothing to move, 2 on a refusal or
 *   a failed run.
 */
function relayoutUnderLock(ctx, manifest) {
  const linkEscape = layoutLinkEscape(ctx.root, manifest);
  if (linkEscape) {
    console.log('refuse: ' + linkEscape);
    return EXIT_ERROR;
  }
  const groups = groupLayoutMoves(layoutMoves(manifest));
  if (groups.length === 0) {
    console.log('0 moved');
    return EXIT_OK;
  }
  const plan = planRelayout(ctx, groups);
  if (plan.problems.length > 0) {
    for (const problem of plan.problems) console.log(problem);
    return EXIT_ERROR;
  }
  for (const relativePath of plan.skipped) console.log(`skipped ${relativePath}`);
  if (plan.moves.length === 0) {
    console.log('0 moved');
    return EXIT_OK;
  }

  const fieldEdits = [];
  for (const move of plan.moves) {
    for (const record of move.records) {
      fieldEdits.push({ overlay: record.overlay, field: record.field, from: record.from, to: record.to });
    }
  }
  const linkEdits = relayoutLinkTargets(ctx, plan.moves, manifest);
  // A manifest this run cannot rewrite has to refuse before the first rename:
  // copies already at their layout paths behind a manifest that still names the
  // old ones is a folder nobody can read, and no backup restores it on its own.
  let manifestText;
  try {
    manifestText = planRelayoutManifest(ctx, fieldEdits, linkEdits);
  } catch (error) {
    console.log('refuse: ' + error.message);
    return EXIT_ERROR;
  }

  const stamp = new Date().toISOString().replace(/:/g, '-');
  const runsDir = path.join(ctx.overlayRoot, RELAYOUT_RUNS_FOLDER);
  const runDir = path.join(runsDir, stamp);
  const isRunsDirNew = !fs.existsSync(runsDir);
  // A folder beside the tree has no tree path, so its backup is keyed from the
  // overlay root and the printed path uses the label the setting file gives.
  const overlayOutside = ctx.overlayOutside;
  const backupBase = overlayOutside ? ctx.overlayRoot : ctx.root;
  const backupLabel = overlayOutside
    ? ctx.overlayLabel + '/' + relativeKey(ctx.overlayRoot, runDir)
    : relativeKey(ctx.root, runDir);
  const backupSkipped = [];
  let manifestBytes;
  // Nothing has moved yet, so a backup that cannot be written only has to take
  // its own partial copy away: a half backup left beside the folder reads as one
  // a later restore could trust.
  try {
    // Read before anything is written, so a failed run can put back the exact bytes.
    manifestBytes = fs.readFileSync(ctx.manifestPath);
    const exact = exactManifestPaths(ctx, manifest);
    for (const move of plan.moves) {
      copyForBackup(move.from.absolute, path.join(runDir, relativeKey(backupBase, move.from.absolute)), move.from.relative,
        exact, backupSkipped);
    }
    copyForBackup(ctx.manifestPath, path.join(runDir, relativeKey(backupBase, ctx.manifestPath)),
      relativeKey(backupBase, ctx.manifestPath), exact, backupSkipped);
  } catch (error) {
    const cause = `error: relayout failed while writing the backup: ${error.message}; nothing was moved`;
    try {
      removeRelayoutBackup(runDir, runsDir, isRunsDirNew);
    } catch (cleanupError) {
      console.log(`${cause}, but the partial backup at ${backupLabel} could not be removed: ${cleanupError.message}`);
      return EXIT_ERROR;
    }
    console.log(`${cause} and the partial backup was removed`);
    return EXIT_ERROR;
  }
  console.log('backup ' + backupLabel);

  // Every step from here is undone if a later one fails: copies at their layout
  // paths behind a manifest naming the old ones is a folder no command can read.
  const done = { links: [], isManifestWritten: false, manifestBytes, moves: [], createdDirs: [] };
  let step = '';
  try {
    for (const move of plan.moves) {
      step = `moving ${move.from.relative}`;
      done.createdDirs.push(...missingRelayoutParents(ctx.overlayRoot, move.to.absolute));
      fs.mkdirSync(path.dirname(move.to.absolute), { recursive: true });
      fs.renameSync(move.from.absolute, move.to.absolute);
      done.moves.push(move);
      console.log(`moved ${move.from.relative} -> ${move.to.relative}`);
    }
    step = 'writing the manifest';
    writeRelayoutManifest(ctx, manifestText);
    done.isManifestWritten = manifestText !== null;
    for (const change of linkEdits) {
      step = `relinking ${change.path}`;
      retargetRelayoutLink(ctx, change, done.links);
    }
  } catch (error) {
    const cause = `error: relayout failed while ${step}: ${error.message}`;
    const restoreFailure = rollbackRelayout(ctx, done);
    if (restoreFailure) {
      // A skipped file was never copied, so the backup cannot be promised to hold it.
      const holds = backupSkipped.length === 0
        ? 'holds every moved copy and the manifest as it was'
        : `holds the manifest as it was and every moved copy except the ${backupSkipped.length} printed as skipped`;
      console.log(`${cause}; the restore also failed at ${restoreFailure.path}: ${restoreFailure.message}; ` +
        `the backup at ${backupLabel} ${holds}`);
      return EXIT_ERROR;
    }
    try {
      removeRelayoutBackup(runDir, runsDir, isRunsDirNew);
    } catch (cleanupError) {
      // The rollback already put every copy back, so only the leftover backup
      // needs the operator's attention.
      console.log(`${cause}; every moved copy, the manifest and the links are back as they were, but the backup ` +
        `at ${backupLabel} could not be removed: ${cleanupError.message}`);
      return EXIT_ERROR;
    }
    console.log(`${cause}; every moved copy, the manifest and the links are back as they were`);
    return EXIT_ERROR;
  }

  // Emptied folders are pruned only once nothing can fail, so a rollback never
  // has to recreate a folder this run removed. Every copy has moved and the
  // manifest names the new paths by now, so a folder that will not go is only
  // reported: failing here would call a finished relayout a failed one.
  for (const move of plan.moves) {
    try {
      pruneEmptyParents(ctx.overlayRoot, move.from.absolute);
    } catch (error) {
      console.log(`note: relayout left an emptied folder in place after moving ${move.from.relative}: ${error.message}`);
    }
  }

  console.log(`${plan.moves.length} moved`);
  console.log(`run ${ENGINE_COMMAND} apply`);
  return EXIT_OK;
}

/**
 * Move the off-layout copies a manifest keeps onto their layout paths.
 * @param {object} ctx Engine context.
 * @returns {number} 0 when done or there was nothing to move, 2 on a refusal.
 */
function commandRelayout(ctx) {
  return withLock(ctx, 'overlay-engine relayout', () => relayoutUnderLock(ctx, loadManifest(ctx)));
}

// ─────────────────────────────────────────────────────────────────────────────
// 19. COMMAND ENTRY POINT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parse the command line into one command and its options.
 * @param {string[]} argv Arguments after the script path.
 * @returns {object|null} Parsed options, or null for a misused command line.
 */
function parseArguments(argv) {
  const options = {
    command: null, root: null, isJson: false, isAudit: false, isRelayout: false, capture: null, guard: null, adopt: null,
    upstream: null, to: null, stage: null, rollback: null,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === '--help' || value === '-h') return { command: 'help' };
    if (COMMAND_WORDS.includes(value)) {
      if (options.command) return null;
      options.command = value;
      continue;
    }
    if (value === '--root' || value === '--capture' || value === '--adopt' || value === '--guard' ||
        REPIN_VALUE_FLAGS.includes(value.slice(2))) {
      const next = argv[index + 1];
      const field = value.slice(2);
      if (options[field] !== null || !next || next.startsWith('-')) return null;
      options[field] = next;
      index += 1;
      continue;
    }
    if (value === '--json') {
      options.isJson = true;
      continue;
    }
    if (value === '--audit') {
      options.isAudit = true;
      continue;
    }
    if (value === '--relayout') {
      options.isRelayout = true;
      continue;
    }
    return null;
  }
  if (options.guard !== null) {
    if (options.command || options.capture !== null || options.adopt !== null || options.isJson) return null;
    options.command = 'guard';
  }
  if (!options.command) return null;
  if (options.isAudit && options.command !== 'status') return null;
  if (options.capture !== null && options.command !== 'apply') return null;
  if (options.adopt !== null && (options.command !== 'apply' || options.capture !== null)) return null;
  if (options.isRelayout && (options.command !== 'apply' || options.capture !== null || options.adopt !== null)) return null;
  if (options.isJson && options.command !== 'status' && options.command !== 'repin') return null;
  const repinFlags = REPIN_VALUE_FLAGS.filter((field) => options[field] !== null);
  if (options.command !== 'repin') return repinFlags.length === 0 ? options : null;
  if (options.rollback !== null) return repinFlags.length === 1 ? options : null;
  return options.upstream !== null && options.to !== null ? options : null;
}

/**
 * Run the engine from command-line arguments.
 * @param {string[]} argv Arguments after the script path.
 * @returns {number} Exit code.
 */
function main(argv) {
  const options = parseArguments(argv);
  if (!options) {
    console.log(USAGE);
    return EXIT_ERROR;
  }
  if (options.command === 'help') {
    console.log(USAGE);
    return EXIT_OK;
  }
  const root = path.resolve(options.root || DEFAULT_ROOT);
  if (!isDirectory(root)) {
    console.log('root is not a directory: ' + root);
    return EXIT_ERROR;
  }
  try {
    const ctx = createContext(root);
    if (options.command === 'guard') return commandGuard(ctx, options.guard);
    if (options.command === 'status') return commandStatus(ctx, { isJson: options.isJson, isAudit: options.isAudit });
    if (options.command === 'repin') return commandRepin(ctx, options);
    if (options.command === 'pre-commit') return commandPreCommit(ctx);
    if (options.command === 'apply' && options.isRelayout) return commandRelayout(ctx);
    if (options.capture !== null) return commandCapture(ctx, options.capture);
    if (options.adopt !== null) return commandAdopt(ctx, options.adopt);
    return commandApply(ctx);
  } catch (error) {
    // A JSON caller parses stdout, so the error has to arrive there as JSON too.
    if (options.isJson) console.log(JSON.stringify({ result: 'ERROR', error: error.message }, null, 2));
    else console.error('[overlay-engine] ' + error.message);
    return EXIT_ERROR;
  }
}

if (require.main === module) {
  process.exitCode = main(process.argv.slice(2));
}

// ─────────────────────────────────────────────────────────────────────────────
// 20. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  acquireLock,
  analyze,
  applyJsonOperations,
  applyLayoutLink,
  applyOnePlan,
  commandAdopt,
  commandApply,
  commandCapture,
  commandGuard,
  commandPreCommit,
  commandRepin,
  commandRelayout,
  commandStatus,
  createContext,
  isCaptureRestricted,
  isProtectedReadPath,
  loadManifest,
  loadState,
  main,
  planLayoutLinks,
  planOverlay,
  regenerate,
  resolveOverlayDir,
  resolveRemoveRootPath,
  runCheck,
  sha256,
  verifyGenerated,
  withLock,
  writeStateIfChanged,
};

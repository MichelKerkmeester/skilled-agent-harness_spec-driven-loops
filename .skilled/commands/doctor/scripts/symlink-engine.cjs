#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Doctor Symlink Engine
// ───────────────────────────────────────────────────────────────────
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const { spawnSync } = require('node:child_process');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS AND ERRORS
// ─────────────────────────────────────────────────────────────────────────────

const SCRIPT_ROOT = path.resolve(__dirname, '../../../..');
const MANIFEST_PATH = path.resolve(__dirname, '../assets/symlink-manifest.json');
const RUNS_PATH = path.join('.skilled', 'output', 'doctor-symlink');
const RUN_PREFIX_CHARS = 16;
const MAX_RUNS_PER_DIGEST = 1000;
const ACTION_ORDER = {
  mkdir: 0,
  'replace-link': 1,
  'remove-broken': 2,
  link: 3,
  'ignore-add': 4,
  refuse: 5,
};
class UsageError extends Error {}
class PreconditionError extends Error {}

// ─────────────────────────────────────────────────────────────────────────────
// 3. ARGUMENTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Read a flag value in either separated or equals form.
 * @param {string[]} argv
 * @param {number} index
 * @param {string} flag
 * @returns {{ value: string, next: number }}
 */
function readValue(argv, index, flag) {
  const argument = argv[index];
  const inline = argument.startsWith(flag + '=') ? argument.slice(flag.length + 1) : null;
  if (inline !== null) {
    if (inline.length === 0) throw new UsageError(flag + ' needs a value');
    return { value: inline, next: index };
  }
  const value = argv[index + 1];
  if (!value || value.startsWith('--')) throw new UsageError(flag + ' needs a value');
  return { value, next: index + 1 };
}

/**
 * Parse the command and reject flags the command does not own.
 * @param {string[]} argv
 * @returns {object}
 */
function parseArgs(argv) {
  const options = {
    command: null,
    root: null,
    source: path.resolve(SCRIPT_ROOT),
    runtimes: null,
    include: [],
    linkInstructions: false,
    mode: 'auto',
    ignore: 'exclude',
    planDigest: null,
    run: null,
    dryRun: false,
    yes: false,
    json: false,
  };
  const positionals = [];
  const specified = new Set();

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (!argument.startsWith('--')) {
      positionals.push(argument);
      continue;
    }
    if (argument === '--root' || argument.startsWith('--root=')) {
      const read = readValue(argv, index, '--root');
      options.root = path.resolve(read.value);
      specified.add('root');
      index = read.next;
    } else if (argument === '--source' || argument.startsWith('--source=')) {
      const read = readValue(argv, index, '--source');
      options.source = path.resolve(read.value);
      specified.add('source');
      index = read.next;
    } else if (argument === '--runtimes' || argument.startsWith('--runtimes=')) {
      const read = readValue(argv, index, '--runtimes');
      options.runtimes = read.value.split(',').map((name) => name.trim()).filter(Boolean);
      specified.add('runtimes');
      index = read.next;
    } else if (argument === '--include' || argument.startsWith('--include=')) {
      const read = readValue(argv, index, '--include');
      options.include = read.value.split(',').map((name) => name.trim()).filter(Boolean);
      specified.add('include');
      index = read.next;
    } else if (argument === '--mode' || argument.startsWith('--mode=')) {
      const read = readValue(argv, index, '--mode');
      options.mode = read.value;
      specified.add('mode');
      index = read.next;
    } else if (argument === '--ignore' || argument.startsWith('--ignore=')) {
      const read = readValue(argv, index, '--ignore');
      options.ignore = read.value;
      specified.add('ignore');
      index = read.next;
    } else if (argument === '--plan-digest' || argument.startsWith('--plan-digest=')) {
      const read = readValue(argv, index, '--plan-digest');
      options.planDigest = read.value.trim();
      specified.add('planDigest');
      index = read.next;
    } else if (argument === '--run' || argument.startsWith('--run=')) {
      const read = readValue(argv, index, '--run');
      options.run = path.resolve(read.value);
      specified.add('run');
      index = read.next;
    } else if (argument === '--link-instructions') {
      options.linkInstructions = true;
      specified.add('linkInstructions');
    } else if (argument === '--dry-run') {
      options.dryRun = true;
      specified.add('dryRun');
    } else if (argument === '--yes') {
      options.yes = true;
      specified.add('yes');
    } else if (argument === '--json') {
      options.json = true;
      specified.add('json');
    } else {
      throw new UsageError('unknown flag: ' + argument);
    }
  }

  if (positionals.length !== 1) {
    throw new UsageError(positionals.length === 0
      ? 'one of check, plan, apply or unlink is required'
      : 'unexpected positional argument: ' + positionals.slice(1).join(' '));
  }
  if (!['check', 'plan', 'apply', 'unlink'].includes(positionals[0])) {
    throw new UsageError('unknown command: ' + positionals[0]);
  }
  options.command = positionals[0];

  const allowed = {
    check: ['root', 'source', 'runtimes', 'include', 'linkInstructions', 'json'],
    plan: ['root', 'source', 'runtimes', 'include', 'linkInstructions', 'mode', 'ignore', 'json'],
    apply: ['root', 'source', 'runtimes', 'include', 'linkInstructions', 'mode', 'ignore', 'planDigest', 'json'],
    unlink: ['source', 'run', 'dryRun', 'yes', 'json'],
  };
  for (const key of specified) {
    if (!allowed[options.command].includes(key)) {
      const flag = '--' + key.replace(/[A-Z]/gu, (letter) => '-' + letter.toLowerCase());
      throw new UsageError(flag + ' is not valid for ' + options.command);
    }
  }
  if (['check', 'plan', 'apply'].includes(options.command) && !options.root) {
    throw new UsageError('--root is required for ' + options.command);
  }
  if (options.command === 'apply' && !options.planDigest) {
    throw new UsageError('--plan-digest is required for apply');
  }
  if (options.command === 'unlink' && !options.run) {
    throw new UsageError('--run is required for unlink');
  }
  if (['plan', 'apply'].includes(options.command) && !['auto', 'whole', 'merge'].includes(options.mode)) {
    throw new UsageError('unknown mode: ' + options.mode);
  }
  if (['plan', 'apply'].includes(options.command) && !['exclude', 'gitignore', 'none'].includes(options.ignore)) {
    throw new UsageError('unknown ignore target: ' + options.ignore);
  }
  options.sourceSpecified = specified.has('source');
  return options;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. PATHS AND MANIFEST
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Return true when an absolute path is equal to or below a directory.
 * @param {string} candidate
 * @param {string} directory
 * @returns {boolean}
 */
function isWithin(candidate, directory) {
  const relative = path.relative(directory, candidate);
  return relative === '' || (!path.isAbsolute(relative) && relative !== '..' && !relative.startsWith('..' + path.sep));
}

/**
 * Resolve a manifest-relative path and prevent it from escaping its base.
 * @param {string} base
 * @param {string} relative
 * @returns {string}
 */
function resolveInside(base, relative) {
  if (typeof relative !== 'string' || relative.length === 0 || path.isAbsolute(relative)) {
    throw new PreconditionError('manifest path must be a non-empty relative path');
  }
  const absolute = path.resolve(base, relative);
  if (!isWithin(absolute, base)) throw new PreconditionError('manifest path escapes its base: ' + relative);
  return absolute;
}

/**
 * Read and validate the shipped manifest.
 * @param {string} [manifestPath]
 * @returns {object}
 */
function loadManifest(manifestPath = MANIFEST_PATH) {
  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  } catch (error) {
    throw new PreconditionError('cannot load manifest at ' + manifestPath + ': ' + error.message);
  }
  if (!manifest || manifest.schema_version !== 1 || !Array.isArray(manifest.core)
    || !manifest.runtimes || !manifest.extras || !Array.isArray(manifest.instructions)) {
    throw new PreconditionError('manifest has an unsupported shape: ' + manifestPath);
  }
  const groups = [
    manifest.core,
    manifest.instructions,
    ...Object.values(manifest.runtimes),
    ...Object.values(manifest.extras),
  ];
  for (const group of groups) {
    if (!Array.isArray(group) || group.some((entry) => !entry || typeof entry.name !== 'string'
      || !['dir', 'file', 'relative-link'].includes(entry.kind))) {
      throw new PreconditionError('manifest contains an invalid entry: ' + manifestPath);
    }
  }
  return manifest;
}

/**
 * Read an lstat result without following the path.
 * @param {string} target
 * @returns {object|null}
 */
function lstatOrNull(target) {
  try {
    return fs.lstatSync(target);
  } catch (error) {
    if (error.code === 'ENOENT' || error.code === 'ENOTDIR') return null;
    throw error;
  }
}

/**
 * Canonicalize and validate the two workspace directories.
 * @param {string} rootInput
 * @param {string} sourceInput
 * @returns {{root: string, source: string}}
 */
function resolveRoots(rootInput, sourceInput) {
  let root;
  let source;
  try {
    if (!rootInput || !fs.statSync(rootInput).isDirectory()) {
      throw new PreconditionError('root is missing or is not a directory: ' + rootInput);
    }
    root = fs.realpathSync(rootInput);
  } catch (error) {
    if (error instanceof PreconditionError) throw error;
    throw new PreconditionError('root is missing or is not a directory: ' + rootInput);
  }
  try {
    if (!fs.statSync(sourceInput).isDirectory()) {
      throw new PreconditionError('source is missing or is not a directory: ' + sourceInput);
    }
    source = fs.realpathSync(sourceInput);
  } catch (error) {
    if (error instanceof PreconditionError) throw error;
    throw new PreconditionError('source is missing or is not a directory: ' + sourceInput);
  }
  if (isWithin(root, source) || isWithin(source, root)) {
    throw new PreconditionError('root and source must not contain one another');
  }
  return { root, source };
}

/**
 * Return the checkout path represented by one manifest entry.
 * @param {object} entry
 * @param {string} source
 * @returns {string}
 */
function sourcePathFor(entry, source) {
  const relative = entry.kind === 'relative-link'
    ? entry.target
    : (entry.source || entry.name);
  return resolveInside(source, relative);
}

/**
 * Return the root target for one manifest entry.
 * @param {object} entry
 * @param {string} root
 * @returns {string}
 */
function rootPathFor(entry, root) {
  return resolveInside(root, entry.name);
}

/**
 * Split a comma-separated option or normalize an array.
 * @param {string|string[]|null} value
 * @returns {string[]}
 */
function csvValues(value) {
  if (value === null || value === undefined) return [];
  if (Array.isArray(value)) return [...new Set(value.map((part) => String(part).trim()).filter(Boolean))];
  return [...new Set(String(value).split(',').map((part) => part.trim()).filter(Boolean))];
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. GIT READERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Run git without a shell and with fsmonitor disabled for repeatable reads.
 * @param {string} root
 * @param {string[]} args
 * @returns {object}
 */
function git(root, args) {
  return spawnSync('git', ['-C', root, '-c', 'core.fsmonitor=false', ...args], {
    encoding: 'utf8',
    timeout: 30000,
    // A large repository's index listing runs to megabytes; the 1 MB default would fail it.
    maxBuffer: 256 * 1024 * 1024,
    windowsHide: true,
  });
}

/**
 * Return whether Git recognizes the target as a work tree.
 * @param {string} root
 * @returns {boolean}
 */
function isGitWorkTree(root) {
  const result = git(root, ['rev-parse', '--is-inside-work-tree']);
  return result.status === 0 && result.stdout.trim() === 'true';
}

/**
 * Resolve an ignore file selected by the caller.
 * @param {string} root
 * @param {string} kind
 * @returns {string|null}
 */
function ignoreFile(root, kind) {
  if (kind === 'none') return null;
  if (kind === 'gitignore') return '.gitignore';
  const result = git(root, ['rev-parse', '--git-path', 'info/exclude']);
  if (result.status !== 0 || !result.stdout.trim()) {
    throw new PreconditionError('cannot resolve the git exclude file: ' + (result.stderr || '').trim());
  }
  const absolute = path.resolve(root, result.stdout.trim());
  return path.relative(root, absolute).split(path.sep).join('/');
}

/**
 * Return whether Git currently ignores a root-relative path.
 * @param {string} root
 * @param {string} relative
 * @returns {boolean|null}
 */
function isIgnored(root, relative) {
  const result = git(root, ['check-ignore', '-q', '--', relative.split(path.sep).join('/')]);
  if (result.status === 0) return true;
  if (result.status === 1) return false;
  throw new PreconditionError('git check-ignore failed for ' + relative + ': ' + (result.stderr || '').trim());
}

/**
 * List tracked absolute symlinks without following their target paths.
 * @param {string} root
 * @returns {Array<{path: string, link_text: string}>}
 */
function trackedAbsoluteLinks(root) {
  const result = git(root, ['ls-files', '-s', '-z']);
  if (result.status !== 0) {
    throw new PreconditionError('git ls-files failed: ' + ((result.error && result.error.message) || (result.stderr || '').trim()));
  }
  const links = [];
  for (const record of result.stdout.split('\0')) {
    if (!record) continue;
    const tab = record.indexOf('\t');
    if (tab < 0 || !record.slice(0, tab).startsWith('120000 ')) continue;
    const relative = record.slice(tab + 1);
    const absolute = path.resolve(root, relative);
    const stat = lstatOrNull(absolute);
    if (!stat || !stat.isSymbolicLink()) continue;
    const linkText = fs.readlinkSync(absolute);
    if (path.isAbsolute(linkText)) links.push({ path: relative, link_text: linkText });
  }
  return links.sort((left, right) => left.path.localeCompare(right.path));
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. ENTRY SELECTION AND INSPECTION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Build the selected manifest entries in stable order.
 * @param {object} manifest
 * @param {string} root
 * @param {object} options
 * @returns {Array<object>}
 */
function selectEntries(manifest, root, options) {
  const requestedRuntimes = csvValues(options.runtimes);
  const runtimes = options.runtimes === null || options.runtimes === undefined
    ? Object.keys(manifest.runtimes).filter((name) => {
      const first = manifest.runtimes[name][0];
      return first && lstatOrNull(rootPathFor(first, root));
    })
    : requestedRuntimes;
  for (const runtime of runtimes) {
    if (!Object.prototype.hasOwnProperty.call(manifest.runtimes, runtime)) {
      throw new UsageError('unknown runtime: ' + runtime);
    }
  }
  const extras = csvValues(options.include);
  for (const extra of extras) {
    if (!Object.prototype.hasOwnProperty.call(manifest.extras, extra)) {
      throw new UsageError('unknown extra: ' + extra);
    }
  }

  const selected = [];
  for (const entry of manifest.core) selected.push({ entry, group: 'core' });
  for (const runtime of runtimes) {
    for (const entry of manifest.runtimes[runtime]) selected.push({ entry, group: runtime });
  }
  for (const extra of extras) {
    for (const entry of manifest.extras[extra]) selected.push({ entry, group: 'extra:' + extra });
  }
  if (options.linkInstructions) {
    for (const entry of manifest.instructions) selected.push({ entry, group: 'instructions' });
  }
  return selected;
}

/**
 * Return true when a root symlink resolves to its intended source.
 * @param {string} rootPath
 * @param {string} sourcePath
 * @param {object} entry
 * @param {string} linkText
 * @returns {boolean}
 */
function isWholeLink(rootPath, sourcePath, entry, linkText) {
  if (entry.kind === 'relative-link') return linkText === entry.target;
  try {
    return fs.realpathSync(rootPath) === fs.realpathSync(sourcePath);
  } catch {
    return false;
  }
}

/**
 * Return true if following a symlink reaches an existing target.
 * @param {string} target
 * @returns {boolean}
 */
function linkTargetExists(target) {
  try {
    fs.realpathSync(target);
    return true;
  } catch {
    return false;
  }
}

/**
 * Match the contract's lexical source-checkout prefix rule.
 * @param {string} linkText
 * @param {string} source
 * @returns {boolean}
 */
function pointsIntoSource(linkText, source) {
  if (!path.isAbsolute(linkText)) return false;
  // The source is held canonical, but a link may spell the same folder through an alias
  // (macOS /var is /private/var). Canonicalize the deepest part of the link text that still
  // exists, keep the missing remainder, then compare on a path-segment boundary so a
  // sibling such as Skilled-old never counts as inside Skilled.
  const canonical = canonicalizeExistingPrefix(path.normalize(linkText));
  return canonical === source || canonical.startsWith(source.endsWith(path.sep) ? source : source + path.sep);
}

/**
 * Realpath the longest existing ancestor of an absolute path and re-append the rest.
 * @param {string} absolute
 * @returns {string}
 */
function canonicalizeExistingPrefix(absolute) {
  const missing = [];
  let current = absolute;
  for (;;) {
    try {
      const real = fs.realpathSync(current);
      return missing.length ? path.join(real, ...missing.reverse()) : real;
    } catch {
      const parent = path.dirname(current);
      if (parent === current) return absolute;
      missing.push(path.basename(current));
      current = parent;
    }
  }
}

// Finder metadata is per-machine noise. The checkout's output folder holds this engine's
// run records and Claude Code's worktree folder holds per-checkout session state, so a
// linked repository must share neither.
const UNMIRRORED_NAMES = new Set(['.DS_Store']);
const UNMIRRORED_PATHS = new Set([path.join('.skilled', 'output'), path.join('.claude', 'worktrees')]);

/**
 * Whether a source child is never mirrored into a merged directory.
 * @param {string} sourceRelative
 * @param {string} name
 * @returns {boolean}
 */
function isUnmirroredChild(sourceRelative, name) {
  return UNMIRRORED_NAMES.has(name) || UNMIRRORED_PATHS.has(path.join(sourceRelative, name));
}

/**
 * Whether a source child is a relative link that leaves its manifest folder.
 * Such a link names a host sibling, so it can only be mirrored relative to the host.
 * @param {string} sourcePath
 * @param {string} entrySource
 * @returns {boolean}
 */
function isHostRelativeLink(sourcePath, entrySource) {
  const stat = lstatOrNull(sourcePath);
  if (!stat || !stat.isSymbolicLink()) return false;
  const linkText = fs.readlinkSync(sourcePath);
  if (path.isAbsolute(linkText)) return false;
  return !isWithin(path.resolve(path.dirname(sourcePath), linkText), entrySource);
}

/**
 * Whether a source folder holds any link that names a host sibling.
 * @param {string} directory
 * @param {string} entrySource
 * @param {string} sourceRelative
 * @returns {boolean}
 */
function hasHostRelativeLink(directory, entrySource, sourceRelative) {
  for (const name of fs.readdirSync(directory)) {
    if (isUnmirroredChild(sourceRelative, name)) continue;
    const child = path.join(directory, name);
    if (isHostRelativeLink(child, entrySource)) return true;
    const stat = lstatOrNull(child);
    if (stat && stat.isDirectory() && !stat.isSymbolicLink()
      && hasHostRelativeLink(child, entrySource, path.join(sourceRelative, name))) return true;
  }
  return false;
}

/**
 * Inspect children of a merged source directory without following root symlinks.
 * @param {string} root
 * @param {string} source
 * @param {string} rootRelative
 * @param {string} sourceRelative
 * @param {string} entrySource
 * @param {object} details
 */
function inspectMergeTree(root, source, rootRelative, sourceRelative, entrySource, details) {
  const sourceDirectory = resolveInside(source, sourceRelative);
  const rootDirectory = resolveInside(root, rootRelative);
  let sourceNames;
  try {
    sourceNames = fs.readdirSync(sourceDirectory)
      .filter((name) => !isUnmirroredChild(sourceRelative, name))
      .sort((a, b) => a.localeCompare(b));
  } catch (error) {
    throw new PreconditionError('cannot read source directory ' + sourceDirectory + ': ' + error.message);
  }
  const sourceNameSet = new Set(sourceNames);
  for (const name of sourceNames) {
    const childRootRelative = path.join(rootRelative, name);
    const childSourceRelative = path.join(sourceRelative, name);
    const childRoot = resolveInside(root, childRootRelative);
    const childSource = resolveInside(source, childSourceRelative);
    const sourceStat = lstatOrNull(childSource);
    const rootStat = lstatOrNull(childRoot);
    if (!sourceStat) continue;
    if (isHostRelativeLink(childSource, entrySource)) {
      const linkText = fs.readlinkSync(childSource);
      const hostTarget = path.resolve(path.dirname(childRoot), linkText);
      // A host sibling that is absent means the alias is omitted, never missing.
      if (!isWithin(hostTarget, root) || !linkTargetExists(hostTarget)) continue;
      if (!rootStat) {
        details.missing_children.push(childRootRelative);
      } else if (!rootStat.isSymbolicLink() || fs.readlinkSync(childRoot) !== linkText) {
        details.local_conflicts.push(childRootRelative);
      }
      continue;
    }
    if (!rootStat) {
      details.missing_children.push(childRootRelative);
      continue;
    }
    if (rootStat.isSymbolicLink()) {
      const linkText = fs.readlinkSync(childRoot);
      if (!linkTargetExists(childRoot) && pointsIntoSource(linkText, source)) {
        details.broken_links.push({ path: childRootRelative, link_text: linkText });
      } else if (linkTargetExists(childRoot) && isWholeLink(childRoot, childSource, { kind: 'dir' }, linkText)) {
        continue;
      } else {
        details.local_conflicts.push(childRootRelative);
      }
      continue;
    }
    if (rootStat.isDirectory() && sourceStat.isDirectory()) {
      inspectMergeTree(root, source, childRootRelative, childSourceRelative, entrySource, details);
    } else {
      details.local_conflicts.push(childRootRelative);
    }
  }
  let rootNames;
  try {
    rootNames = fs.readdirSync(rootDirectory).sort((a, b) => a.localeCompare(b));
  } catch (error) {
    // A merge-only folder the plan is about to create has no children yet.
    if (error.code === 'ENOENT') rootNames = [];
    else throw new PreconditionError('cannot read target directory ' + rootDirectory + ': ' + error.message);
  }
  for (const name of rootNames) {
    if (sourceNameSet.has(name)) continue;
    const childRootRelative = path.join(rootRelative, name);
    const childRoot = resolveInside(root, childRootRelative);
    const stat = lstatOrNull(childRoot);
    if (!stat || !stat.isSymbolicLink()) continue;
    const linkText = fs.readlinkSync(childRoot);
    if (!linkTargetExists(childRoot) && pointsIntoSource(linkText, source)) {
      details.broken_links.push({ path: childRootRelative, link_text: linkText });
    }
  }
}

/**
 * Inspect one selected entry and classify it from lstat/readlink evidence.
 * @param {object} selected
 * @param {string} root
 * @param {string} source
 * @param {boolean|null} gitWorkTree
 * @returns {object}
 */
function inspectEntry(selected, root, source, gitWorkTree) {
  const entry = selected.entry;
  const rootPath = rootPathFor(entry, root);
  const sourcePath = sourcePathFor(entry, source);
  const details = {
    name: entry.name,
    group: selected.group,
    kind: entry.kind,
    status: 'missing',
    missing_children: [],
    broken_links: [],
    local_conflicts: [],
    ignored: gitWorkTree ? isIgnored(root, entry.name) : null,
  };
  const sourceStat = lstatOrNull(sourcePath);
  if (!sourceStat || (sourceStat.isSymbolicLink() && !linkTargetExists(sourcePath))) {
    details.status = 'source-missing';
    return details;
  }
  const rootStat = lstatOrNull(rootPath);
  if (!rootStat) {
    details.status = 'missing';
    return details;
  }
  if (entry.project_owned === true && rootStat.isFile()) {
    details.status = 'project-owned';
    return details;
  }
  if (rootStat.isSymbolicLink()) {
    const linkText = fs.readlinkSync(rootPath);
    if (isWholeLink(rootPath, sourcePath, entry, linkText)) {
      details.status = 'linked-whole';
    } else if (!linkTargetExists(rootPath)) {
      details.status = 'broken';
      details.broken_links.push({ path: entry.name, link_text: linkText });
    } else {
      details.status = 'foreign-link';
    }
    return details;
  }
  if (rootStat.isDirectory() && sourceStat.isDirectory() && entry.kind === 'dir') {
    inspectMergeTree(root, source, entry.name, entry.source || entry.name, sourcePath, details);
    details.status = details.missing_children.length > 0 || details.broken_links.length > 0
      ? 'partial-merge'
      : 'linked-merge';
    return details;
  }
  details.status = 'local';
  return details;
}

/**
 * Build reusable inspection state and validate requested selections.
 * @param {object} options
 * @returns {object}
 */
function buildContext(options) {
  const paths = resolveRoots(options.root, options.source || SCRIPT_ROOT);
  const manifest = options.manifest || loadManifest(options.manifestPath || MANIFEST_PATH);
  const selected = selectEntries(manifest, paths.root, options);
  const gitWorkTree = isGitWorkTree(paths.root);
  return {
    ...paths,
    manifest,
    selected,
    gitWorkTree,
    detectedRuntimes: Object.keys(manifest.runtimes).filter((name) => {
      const first = manifest.runtimes[name][0];
      return first && lstatOrNull(rootPathFor(first, paths.root));
    }),
  };
}

/**
 * Return the check report for the selected entries and repository.
 * @param {object} options
 * @returns {object}
 */
function inspect(options = {}) {
  const context = buildContext(options);
  const entries = context.selected.map((selected) => (
    inspectEntry(selected, context.root, context.source, context.gitWorkTree)
  ));
  const warnings = [];
  for (const entry of context.selected) {
    if (entry.entry.warning) warnings.push('warning: ' + entry.entry.name + ': ' + entry.entry.warning);
  }
  return {
    command: 'check',
    root: context.root,
    source: context.source,
    entries,
    detected_runtimes: context.detectedRuntimes,
    tracked_absolute_links: context.gitWorkTree ? trackedAbsoluteLinks(context.root) : [],
    git: context.gitWorkTree,
    warnings,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. PLAN AND DIGEST
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Add a refusal to both the action list and the separately reported refusals.
 * @param {Array<object>} actions
 * @param {Array<object>} refusals
 * @param {string} pathName
 * @param {string} reason
 */
function refuse(actions, refusals, pathName, reason) {
  const refusal = { op: 'refuse', path: pathName, reason };
  actions.push(refusal);
  refusals.push({ path: pathName, reason });
}

/**
 * Whether the plan itself creates the folder a host sibling link points at.
 * A link or replace-link counts for its whole subtree, while a mkdir counts only
 * as an exact match because an empty folder does not create what is under it.
 * @param {Array<object>} actions
 * @param {string} root
 * @param {string} target
 * @returns {boolean}
 */
function planCreates(actions, root, target) {
  return actions.some((action) => {
    if (!action || typeof action.path !== 'string') return false;
    const absolute = path.resolve(root, action.path);
    if (action.op === 'link' || action.op === 'replace-link') {
      return target === absolute || target.startsWith(absolute + path.sep);
    }
    return action.op === 'mkdir' && target === absolute;
  });
}

/**
 * Add merge links under a real directory, preserving every local path.
 * @param {string} root
 * @param {string} source
 * @param {string} rootRelative
 * @param {string} sourceRelative
 * @param {string} entrySource
 * @param {Array<object>} actions
 * @param {Array<string>} ignoreCandidates
 */
function planMergeTree(root, source, rootRelative, sourceRelative, entrySource, actions, ignoreCandidates) {
  const sourceDirectory = resolveInside(source, sourceRelative);
  const rootDirectory = resolveInside(root, rootRelative);
  let sourceNames;
  try {
    sourceNames = fs.readdirSync(sourceDirectory)
      .filter((name) => !isUnmirroredChild(sourceRelative, name))
      .sort((a, b) => a.localeCompare(b));
  } catch (error) {
    throw new PreconditionError('cannot read source directory ' + sourceDirectory + ': ' + error.message);
  }
  const sourceNameSet = new Set(sourceNames);
  for (const name of sourceNames) {
    const childRootRelative = path.join(rootRelative, name);
    const childSourceRelative = path.join(sourceRelative, name);
    const childRoot = resolveInside(root, childRootRelative);
    const childSource = resolveInside(source, childSourceRelative);
    const sourceStat = lstatOrNull(childSource);
    const rootStat = lstatOrNull(childRoot);
    if (!sourceStat) continue;
    if (isHostRelativeLink(childSource, entrySource)) {
      const linkText = fs.readlinkSync(childSource);
      const hostTarget = path.resolve(path.dirname(childRoot), linkText);
      // Only a host sibling that exists or is planned receives the alias; it is never a link into the checkout.
      // A host sibling counts when it exists or when this same plan creates it,
      // so a first link into a new project does not need a second run.
      if (!isWithin(hostTarget, root) || !(linkTargetExists(hostTarget) || planCreates(actions, root, hostTarget))) continue;
      if (!rootStat) {
        actions.push({ op: 'link', path: childRootRelative, target: linkText });
        ignoreCandidates.push(childRootRelative);
      }
      continue;
    }
    if (!rootStat) {
      actions.push({ op: 'link', path: childRootRelative, target: childSource });
      ignoreCandidates.push(childRootRelative);
      continue;
    }
    if (rootStat.isSymbolicLink()) {
      const linkText = fs.readlinkSync(childRoot);
      const broken = !linkTargetExists(childRoot);
      if (broken && pointsIntoSource(linkText, source)) {
        actions.push({ op: 'replace-link', path: childRootRelative, from: linkText, target: childSource });
        ignoreCandidates.push(childRootRelative);
      } else if (!broken && isWholeLink(childRoot, childSource, { kind: 'dir' }, linkText)) {
        continue;
      }
      continue;
    }
    if (rootStat.isDirectory() && sourceStat.isDirectory()) {
      planMergeTree(root, source, childRootRelative, childSourceRelative, entrySource, actions, ignoreCandidates);
    }
  }

  let rootNames;
  try {
    rootNames = fs.readdirSync(rootDirectory).sort((a, b) => a.localeCompare(b));
  } catch (error) {
    // A merge-only folder the plan is about to create has no children yet.
    if (error.code === 'ENOENT') rootNames = [];
    else throw new PreconditionError('cannot read target directory ' + rootDirectory + ': ' + error.message);
  }
  for (const name of rootNames) {
    if (sourceNameSet.has(name)) continue;
    const childRootRelative = path.join(rootRelative, name);
    const childRoot = resolveInside(root, childRootRelative);
    const stat = lstatOrNull(childRoot);
    if (!stat || !stat.isSymbolicLink()) continue;
    const linkText = fs.readlinkSync(childRoot);
    if (!linkTargetExists(childRoot) && pointsIntoSource(linkText, source)) {
      actions.push({ op: 'remove-broken', path: childRootRelative, from: linkText });
    }
  }
}

/**
 * Order actions by path and by the operation order in the contract.
 * @param {Array<object>} actions
 * @returns {Array<object>}
 */
function sortActions(actions) {
  return actions.sort((left, right) => {
    const leftPath = left.path || left.file || '';
    const rightPath = right.path || right.file || '';
    const byPath = leftPath.localeCompare(rightPath);
    return byPath || ACTION_ORDER[left.op] - ACTION_ORDER[right.op];
  });
}

/**
 * Build the complete plan without changing the filesystem.
 * @param {object} options
 * @returns {object}
 */
function buildPlan(options = {}) {
  const context = buildContext(options);
  const report = inspect(options);
  const actions = [];
  const refusals = [];
  const ignoreCandidates = [];
  const mode = options.mode || 'auto';

  for (const selected of context.selected) {
    const entry = selected.entry;
    const rootPath = rootPathFor(entry, context.root);
    const sourcePath = sourcePathFor(entry, context.source);
    const sourceStat = lstatOrNull(sourcePath);
    if (!sourceStat || (sourceStat.isSymbolicLink() && !linkTargetExists(sourcePath))) continue;
    const rootStat = lstatOrNull(rootPath);

    if (!rootStat) {
      // A whole link would resolve a host-sibling alias against this checkout, so such a
      // folder is built in place; every other folder keeps the whole-link default.
      const merge = entry.kind === 'dir' && (mode === 'merge' || entry.merge_only === true
        || hasHostRelativeLink(sourcePath, sourcePath, entry.source || entry.name));
      if (merge) {
        actions.push({ op: 'mkdir', path: entry.name });
        planMergeTree(context.root, context.source, entry.name, entry.source || entry.name,
          sourcePath, actions, ignoreCandidates);
      } else {
        const target = entry.kind === 'relative-link' ? entry.target : sourcePath;
        actions.push({ op: 'link', path: entry.name, target });
        ignoreCandidates.push(entry.name);
      }
      continue;
    }

    // A real project file wins over the vendored copy; the manifest entry is a fallback only.
    if (entry.project_owned === true && rootStat.isFile()) continue;

    if (rootStat.isSymbolicLink()) {
      const linkText = fs.readlinkSync(rootPath);
      if (isWholeLink(rootPath, sourcePath, entry, linkText)) continue;
      if (!linkTargetExists(rootPath) && pointsIntoSource(linkText, context.source)) {
        const target = entry.kind === 'relative-link' ? entry.target : sourcePath;
        actions.push({ op: 'replace-link', path: entry.name, from: linkText, target });
        ignoreCandidates.push(entry.name);
      } else {
        refuse(actions, refusals, entry.name, 'a foreign or non-source broken link exists');
      }
      continue;
    }

    if (rootStat.isDirectory() && entry.kind === 'dir' && sourceStat.isDirectory()) {
      if (mode === 'whole' && entry.merge_only !== true) {
        refuse(actions, refusals, entry.name, 'a real folder exists; use --mode merge');
      } else {
        planMergeTree(context.root, context.source, entry.name, entry.source || entry.name,
          sourcePath, actions, ignoreCandidates);
      }
      continue;
    }

    refuse(actions, refusals, entry.name, entry.kind === 'dir'
      ? 'a real path exists where a directory link is required'
      : 'a real file or directory exists where a link is required');
  }

  const warnings = [...report.warnings];
  if (options.ignore === 'none') {
    warnings.push('warning: ignore lines skipped because --ignore none was selected');
  } else if (!context.gitWorkTree) {
    warnings.push('warning: ignore lines skipped because the root is not a git work tree');
  } else if (ignoreCandidates.length > 0) {
    const file = ignoreFile(context.root, options.ignore || 'exclude');
    if (!file) {
      warnings.push('warning: ignore lines skipped because the git ignore file could not be resolved');
    } else {
      const lines = [];
      for (const relative of [...new Set(ignoreCandidates)].sort((a, b) => a.localeCompare(b))) {
        if (isIgnored(context.root, relative) === false) {
          lines.push('/' + relative.split(path.sep).join('/'));
        }
      }
      if (lines.length > 0) {
        const absoluteIgnoreFile = path.resolve(context.root, file);
        const ignoreStat = lstatOrNull(absoluteIgnoreFile);
        if (ignoreStat && (!ignoreStat.isFile() || ignoreStat.isSymbolicLink())) {
          refuse(actions, refusals, file, 'the ignore target is not a regular file');
        } else {
          actions.push({ op: 'ignore-add', file, lines });
        }
      }
    }
  }

  sortActions(actions);
  const digest = planDigest({ source: context.source, root: context.root, actions });
  return {
    ...report,
    command: 'plan',
    actions,
    refusals,
    warnings,
    digest,
  };
}

/**
 * Hash the canonical source, root and ordered actions.
 * @param {{source: string, root: string, actions: object[]}|string} plan
 * @param {string} [rootArg]
 * @param {object[]} [actionsArg]
 * @returns {string}
 */
function planDigest(plan, rootArg, actionsArg) {
  const source = typeof plan === 'string' ? plan : plan.source;
  const root = typeof plan === 'string' ? rootArg : plan.root;
  const actions = typeof plan === 'string' ? actionsArg : plan.actions;
  const canonicalSource = fs.realpathSync(source);
  const canonicalRoot = fs.realpathSync(root);
  return crypto.createHash('sha256')
    .update(JSON.stringify({ source: canonicalSource, root: canonicalRoot, actions }))
    .digest('hex');
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. TEXT AND JSON OUTPUT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Render one check report as plain text.
 * @param {object} report
 * @returns {string[]}
 */
function renderReport(report) {
  const lines = [];
  for (const entry of report.entries) {
    lines.push(entry.status.padEnd(16) + ' ' + entry.group + ' ' + entry.name);
    for (const child of entry.missing_children) lines.push('  missing child: ' + child);
    for (const broken of entry.broken_links) lines.push('  broken link: ' + broken.path + ' -> ' + broken.link_text);
    for (const conflict of entry.local_conflicts) lines.push('  local conflict: ' + conflict);
  }
  for (const link of report.tracked_absolute_links) {
    lines.push('tracked absolute link: ' + link.path + ' -> ' + link.link_text);
  }
  for (const warning of report.warnings || []) lines.push(warning);
  return lines;
}

/**
 * Render a plan action in plain language.
 * @param {object} action
 * @returns {string}
 */
function renderAction(action) {
  if (action.op === 'mkdir') return 'mkdir ' + action.path;
  if (action.op === 'link') return 'link ' + action.path + ' -> ' + action.target;
  if (action.op === 'replace-link') {
    return 'replace-link ' + action.path + ' from ' + action.from + ' -> ' + action.target;
  }
  if (action.op === 'remove-broken') return 'remove-broken ' + action.path + ' from ' + action.from;
  if (action.op === 'ignore-add') return 'ignore-add ' + action.file + ': ' + action.lines.join(', ');
  return 'refuse ' + action.path + ': ' + action.reason;
}

/**
 * Print exactly one JSON object or a list of human-readable lines.
 * @param {object} value
 * @param {boolean} json
 * @param {string[]} lines
 */
function emit(value, json, lines) {
  if (json) {
    process.stdout.write(JSON.stringify(value) + '\n');
    return;
  }
  for (const line of lines) process.stdout.write(line + '\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. APPLY
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Ensure a directory below source is made only through real directory components.
 * @param {string} source
 * @param {string} relative
 */
function ensureSourceDirectories(source, relative) {
  let current = source;
  const rootStat = lstatOrNull(source);
  if (!rootStat || !rootStat.isDirectory() || rootStat.isSymbolicLink()) {
    throw new PreconditionError('source is not a real directory: ' + source);
  }
  for (const part of relative.split(path.sep).filter(Boolean)) {
    current = path.join(current, part);
    const stat = lstatOrNull(current);
    if (!stat) {
      fs.mkdirSync(current);
    } else if (!stat.isDirectory() || stat.isSymbolicLink()) {
      throw new PreconditionError('run directory path is not a real directory: ' + current);
    }
  }
}

/**
 * Name the run folders one digest may own: the bare prefix first, then a numbered suffix.
 * @param {string} digest
 * @returns {RegExp}
 */
function runNamePattern(digest) {
  return new RegExp('^' + digest.slice(0, RUN_PREFIX_CHARS) + '(?:-[1-9][0-9]*)?$', 'u');
}

/**
 * Create a new run record in a folder no earlier run owns.
 * A repeated digest is normal after unlink, because the unlinked tree plans the same
 * actions again. Earlier records stay as the undo history, so each apply claims a fresh
 * folder with an exclusive mkdir and never reuses, overwrites or removes an existing one.
 * @param {string} source
 * @param {string} digest
 * @param {string} root
 * @returns {{runDir: string, manifestPath: string, record: object}}
 */
function createRunRecord(source, digest, root) {
  ensureSourceDirectories(source, RUNS_PATH);
  const prefix = digest.slice(0, RUN_PREFIX_CHARS);
  let runDir = null;
  for (let attempt = 1; attempt <= MAX_RUNS_PER_DIGEST && runDir === null; attempt += 1) {
    const name = attempt === 1 ? prefix : prefix + '-' + attempt;
    const candidate = resolveInside(source, path.join(RUNS_PATH, name));
    try {
      fs.mkdirSync(candidate);
      runDir = candidate;
    } catch (error) {
      if (error.code !== 'EEXIST') {
        throw new PreconditionError('cannot create run directory at ' + candidate + ': ' + error.message);
      }
    }
  }
  if (runDir === null) {
    throw new PreconditionError('no free run directory for digest ' + prefix + ' after '
      + MAX_RUNS_PER_DIGEST + ' runs under ' + path.join(source, RUNS_PATH));
  }
  const manifestPath = path.join(runDir, 'manifest.json');
  const record = {
    schema_version: 1,
    root,
    source,
    digest,
    created_at: new Date().toISOString(),
    applied: [],
    created_dirs: [],
    ignore_added: { file: null, lines: [] },
  };
  try {
    fs.writeFileSync(manifestPath, JSON.stringify(record, null, 2) + '\n', { flag: 'wx' });
  } catch (error) {
    throw new PreconditionError('cannot create run record at ' + manifestPath + ': ' + error.message);
  }
  return { runDir, manifestPath, record };
}

/**
 * Persist progress without following a symlink at the record path.
 * @param {string} manifestPath
 * @param {object} record
 */
function saveRunRecord(manifestPath, record) {
  const current = lstatOrNull(manifestPath);
  if (!current || !current.isFile() || current.isSymbolicLink()) {
    throw new Error('run record is no longer a regular file');
  }
  const temporary = manifestPath + '.tmp-' + process.pid + '-' + crypto.randomBytes(6).toString('hex');
  try {
    fs.writeFileSync(temporary, JSON.stringify(record, null, 2) + '\n', { flag: 'wx' });
    fs.renameSync(temporary, manifestPath);
  } catch (error) {
    const tempStat = lstatOrNull(temporary);
    if (tempStat && tempStat.isFile()) fs.unlinkSync(temporary);
    throw error;
  }
}

/**
 * Return a safe absolute target path for a root-relative action.
 * @param {string} root
 * @param {string} relative
 * @returns {string}
 */
function actionPath(root, relative) {
  return resolveInside(root, relative);
}

/**
 * Check that a planned source-pointing broken link still matches the plan.
 * @param {string} absolute
 * @param {string} from
 * @param {string} source
 * @returns {boolean}
 */
function matchesBrokenSourceLink(absolute, from, source) {
  const stat = lstatOrNull(absolute);
  return Boolean(stat && stat.isSymbolicLink()
    && fs.readlinkSync(absolute) === from
    && !linkTargetExists(absolute)
    && pointsIntoSource(from, source));
}

/**
 * Apply one filesystem action and return any extra record fields.
 * @param {object} action
 * @param {object} context
 * @returns {object}
 */
function applyAction(action, context) {
  if (action.op === 'mkdir') {
    const absolute = actionPath(context.root, action.path);
    if (lstatOrNull(absolute)) throw new Error('path appeared before mkdir');
    fs.mkdirSync(absolute);
    return { createdDirectory: action.path };
  }
  if (action.op === 'link') {
    const absolute = actionPath(context.root, action.path);
    if (lstatOrNull(absolute)) throw new Error('path appeared before link');
    fs.symlinkSync(action.target, absolute);
    return {};
  }
  if (action.op === 'replace-link') {
    const absolute = actionPath(context.root, action.path);
    if (!matchesBrokenSourceLink(absolute, action.from, context.source)) {
      throw new Error('the source-pointing broken link changed before replacement');
    }
    fs.unlinkSync(absolute);
    try {
      fs.symlinkSync(action.target, absolute);
    } catch (error) {
      if (!lstatOrNull(absolute)) fs.symlinkSync(action.from, absolute);
      throw error;
    }
    return {};
  }
  if (action.op === 'remove-broken') {
    const absolute = actionPath(context.root, action.path);
    if (!matchesBrokenSourceLink(absolute, action.from, context.source)) {
      throw new Error('the source-pointing broken link changed before removal');
    }
    fs.unlinkSync(absolute);
    return {};
  }
  if (action.op === 'ignore-add') {
    const absolute = path.resolve(context.root, action.file);
    if (!isWithin(absolute, context.root) && !isAllowedGitExclude(context.root, absolute)) {
      throw new Error('ignore file is outside the root and is not the git exclude file');
    }
    const added = appendIgnoreLines(absolute, action.lines);
    return { ignoreAdded: { file: action.file, lines: added } };
  }
  throw new Error('unsupported operation: ' + action.op);
}

/**
 * Check whether an outside-root path is this repository's Git exclude file.
 * @param {string} root
 * @param {string} absolute
 * @returns {boolean}
 */
function isAllowedGitExclude(root, absolute) {
  const expected = ignoreFile(root, 'exclude');
  return expected !== null && path.resolve(root, expected) === absolute;
}

/**
 * Append exact ignore lines without following a symlink.
 * @param {string} absolute
 * @param {string[]} lines
 * @returns {string[]}
 */
function appendIgnoreLines(absolute, lines) {
  const before = lstatOrNull(absolute);
  if (before && (!before.isFile() || before.isSymbolicLink())) {
    throw new Error('ignore target is not a regular file');
  }
  const constants = fs.constants;
  let descriptor;
  try {
    const flags = constants.O_RDWR | constants.O_APPEND | (constants.O_NOFOLLOW || 0)
      | (before ? 0 : constants.O_CREAT | constants.O_EXCL);
    descriptor = fs.openSync(absolute, flags, 0o666);
    const stat = fs.fstatSync(descriptor);
    if (!stat.isFile()) throw new Error('ignore target is not a regular file');
    const current = fs.readFileSync(descriptor, 'utf8');
    const present = new Set(current.split(/\r?\n/u));
    const added = lines.filter((line) => !present.has(line));
    if (added.length === 0) return [];
    const prefix = current.length > 0 && !current.endsWith('\n') ? '\n' : '';
    fs.writeSync(descriptor, prefix + added.join('\n') + '\n');
    return added;
  } finally {
    if (descriptor !== undefined) fs.closeSync(descriptor);
  }
}

/**
 * Run apply after digest verification and retain progress after each action.
 * @param {object} options
 * @returns {{code: number, result: object, lines: string[]}}
 */
function runApply(options) {
  const plan = buildPlan(options);
  if (plan.digest !== options.planDigest) {
    return {
      code: 3,
      result: { command: 'apply', root: plan.root, source: plan.source, digest: plan.digest, error: 'DIGEST MISMATCH' },
      lines: ['DIGEST MISMATCH', 'expected ' + options.planDigest, 'current  ' + plan.digest],
    };
  }

  const created = createRunRecord(plan.source, plan.digest, plan.root);
  const context = { root: plan.root, source: plan.source };
  let failure = null;
  for (const action of plan.actions) {
    if (action.op === 'refuse') continue;
    try {
      const appliedFields = applyAction(action, context);
      const recordAction = { ...action };
      if (action.op === 'ignore-add') {
        recordAction.lines = appliedFields.ignoreAdded.lines;
        created.record.ignore_added = appliedFields.ignoreAdded;
      }
      created.record.applied.push(recordAction);
      if (appliedFields.createdDirectory) created.record.created_dirs.push(appliedFields.createdDirectory);
      saveRunRecord(created.manifestPath, created.record);
    } catch (error) {
      failure = { action, error };
      break;
    }
  }

  if (failure) {
    const failedPath = failure.action.path || failure.action.file;
    const message = 'apply action ' + failure.action.op + ' ' + failedPath
      + ' failed: ' + failure.error.message;
    return {
      code: 1,
      result: {
        command: 'apply',
        root: plan.root,
        source: plan.source,
        digest: plan.digest,
        run: created.runDir,
        applied: created.record.applied,
        error: message,
      },
      lines: [
        'ERROR: ' + message,
        'run record: ' + created.manifestPath,
      ],
    };
  }

  const summary = inspect({
    root: plan.root,
    source: plan.source,
    manifest: options.manifest,
    runtimes: options.runtimes,
    include: options.include,
    linkInstructions: options.linkInstructions,
  });
  const sourceFlag = options.sourceSpecified ? ' --source ' + options.source : '';
  const undo = 'node .skilled/commands/doctor/scripts/symlink-engine.cjs unlink'
    + ' --run ' + created.runDir + ' --dry-run' + sourceFlag;
  const result = {
    ...summary,
    command: 'apply',
    digest: plan.digest,
    run: created.runDir,
    undo,
    applied: created.record.applied,
  };
  return {
    code: 0,
    result,
    lines: [
      ...renderReport(summary),
      'run record: ' + created.manifestPath,
      'undo: ' + undo,
    ],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. UNLINK
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Read a run record without following a symlink at manifest.json.
 * @param {string} runDir
 * @returns {object}
 */
function readRunRecord(runDir) {
  const manifestPath = path.join(runDir, 'manifest.json');
  const stat = lstatOrNull(manifestPath);
  if (!stat || !stat.isFile() || stat.isSymbolicLink()) {
    throw new PreconditionError('run manifest is missing or is not a regular file: ' + manifestPath);
  }
  let record;
  try {
    record = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  } catch (error) {
    throw new PreconditionError('run manifest is not valid JSON: ' + error.message);
  }
  if (!record || record.schema_version !== 1 || typeof record.root !== 'string'
    || typeof record.source !== 'string' || !/^[a-f0-9]{64}$/u.test(record.digest || '')
    || !Array.isArray(record.applied) || !Array.isArray(record.created_dirs)) {
    throw new PreconditionError('run manifest has an unsupported shape');
  }
  return record;
}

/**
 * Verify the record root and source still identify separate existing directories.
 * @param {object} record
 * @returns {{root: string, source: string}}
 */
function recordRoots(record) {
  return resolveRoots(record.root, record.source);
}

/**
 * Return true when a recorded absolute target is a manifest source target.
 * @param {object} manifest
 * @param {string} source
 * @param {string} rootRelative
 * @param {string} target
 * @returns {boolean}
 */
function isManifestTarget(manifest, source, rootRelative, target) {
  const topEntries = [
    ...manifest.core,
    ...Object.values(manifest.runtimes).flat(),
    ...Object.values(manifest.extras).flat(),
    ...manifest.instructions,
  ];
  for (const entry of topEntries) {
    if (rootRelative === entry.name) {
      if (entry.kind === 'relative-link') return target === entry.target;
      return target === sourcePathFor(entry, source);
    }
    if (entry.kind !== 'dir' || !rootRelative.startsWith(entry.name + path.sep)) continue;
    const suffix = rootRelative.slice(entry.name.length + 1);
    const sourceRelative = path.join(entry.source || entry.name, suffix);
    try {
      const sourceChild = resolveInside(source, sourceRelative);
      if (target === sourceChild) return true;
      // A merged child may itself be a relative link mirrored from the source tree.
      const sourceChildStat = lstatOrNull(sourceChild);
      if (sourceChildStat && sourceChildStat.isSymbolicLink()
        && !path.isAbsolute(target) && fs.readlinkSync(sourceChild) === target) return true;
    } catch {
      return false;
    }
  }
  return false;
}

/**
 * Build the inverse-action list for display and execution.
 * @param {object} record
 * @param {object} roots
 * @returns {Array<object>}
 */
function unlinkSteps(record, roots) {
  const steps = [];
  const manifest = loadManifest();
  for (const action of [...record.applied].reverse()) {
    if (!action || typeof action.op !== 'string') continue;
    if (action.op === 'link' || action.op === 'replace-link' || action.op === 'remove-broken') {
      const absolute = actionPath(roots.root, action.path);
      const stat = lstatOrNull(absolute);
      if (action.op === 'link') {
        const validTarget = typeof action.target === 'string'
          && isManifestTarget(manifest, roots.source, action.path, action.target);
        const remove = Boolean(validTarget && stat && stat.isSymbolicLink()
          && fs.readlinkSync(absolute) === action.target);
        steps.push({ op: 'remove-link', path: action.path, absolute, ready: remove });
      } else if (action.op === 'replace-link') {
        const validTarget = typeof action.target === 'string'
          && isManifestTarget(manifest, roots.source, action.path, action.target);
        const restore = Boolean(validTarget && typeof action.from === 'string'
          && pointsIntoSource(action.from, roots.source) && stat && stat.isSymbolicLink()
          && fs.readlinkSync(absolute) === action.target);
        steps.push({ op: 'restore-link', path: action.path, absolute, from: action.from, ready: restore });
      } else {
        const recreate = Boolean(typeof action.from === 'string'
          && pointsIntoSource(action.from, roots.source) && !stat);
        steps.push({ op: 'recreate-link', path: action.path, absolute, from: action.from, ready: recreate });
      }
    } else if (action.op === 'ignore-add') {
      continue;
    } else if (action.op !== 'mkdir') {
      throw new PreconditionError('run manifest contains an unknown action: ' + action.op);
    }
  }

  const directories = [...new Set(record.created_dirs)].sort((left, right) => {
    const depth = right.split(path.sep).length - left.split(path.sep).length;
    return depth || right.localeCompare(left);
  });
  // A folder this run created is judged empty after this same unlink: its children are
  // usually the links the steps above remove, so the folder is never empty beforehand.
  const goingAway = new Set(steps.filter((step) => step.ready && step.op === 'remove-link')
    .map((step) => step.absolute));
  for (const relative of directories) {
    const absolute = actionPath(roots.root, relative);
    const stat = lstatOrNull(absolute);
    const empty = Boolean(stat && stat.isDirectory() && !stat.isSymbolicLink()
      && fs.readdirSync(absolute).every((name) => goingAway.has(path.join(absolute, name))));
    if (empty) goingAway.add(absolute);
    steps.push({ op: 'rmdir', path: relative, absolute, ready: empty });
  }

  const ignoreAdded = record.ignore_added || { file: null, lines: [] };
  if (ignoreAdded.file && Array.isArray(ignoreAdded.lines) && ignoreAdded.lines.length > 0) {
    if (typeof ignoreAdded.file !== 'string'
      || ignoreAdded.lines.some((line) => typeof line !== 'string' || /[\r\n]/u.test(line))) {
      throw new PreconditionError('run manifest ignore lines are invalid');
    }
    const absolute = path.resolve(roots.root, ignoreAdded.file);
    const validFile = isWithin(absolute, roots.root) || isAllowedGitExclude(roots.root, absolute);
    if (!validFile) throw new PreconditionError('run manifest ignore target is outside the root');
    const stat = lstatOrNull(absolute);
    const canRead = Boolean(stat && stat.isFile() && !stat.isSymbolicLink());
    steps.push({ op: 'ignore-remove', file: ignoreAdded.file, absolute, lines: ignoreAdded.lines, ready: canRead });
  }
  return steps;
}

/**
 * Print one inverse action or a changed-since-apply skip.
 * @param {object} step
 * @returns {string}
 */
function renderUnlinkStep(step) {
  if (!step.ready && step.op !== 'ignore-add') {
    return 'skip ' + (step.path || step.file) + ': changed since apply';
  }
  if (step.op === 'remove-link') return 'remove link ' + step.path;
  if (step.op === 'restore-link') return 'restore link ' + step.path + ' -> ' + step.from;
  if (step.op === 'recreate-link') return 'recreate link ' + step.path + ' -> ' + step.from;
  if (step.op === 'rmdir') return 'remove empty directory ' + step.path;
  if (step.op === 'ignore-remove') return 'remove recorded ignore lines from ' + step.file;
  return 'remove ignore lines from ' + step.file;
}

/**
 * Remove one exact occurrence of each recorded ignore line, preserving all other lines.
 * @param {string} absolute
 * @param {string[]} removeLines
 * @returns {number}
 */
function removeIgnoreLines(absolute, removeLines) {
  const stat = lstatOrNull(absolute);
  if (!stat || !stat.isFile() || stat.isSymbolicLink()) return 0;
  const descriptor = fs.openSync(absolute, fs.constants.O_RDWR | (fs.constants.O_NOFOLLOW || 0));
  try {
    const contents = fs.readFileSync(descriptor, 'utf8');
    const newline = contents.includes('\r\n') ? '\r\n' : '\n';
    const hadTrailingNewline = contents.endsWith('\n');
    const lines = contents.split(/\r?\n/u);
    if (hadTrailingNewline) lines.pop();
    let removed = 0;
    for (const target of removeLines) {
      const index = lines.lastIndexOf(target);
      if (index >= 0) {
        lines.splice(index, 1);
        removed += 1;
      }
    }
    if (removed === 0) return 0;
    let output = lines.join(newline);
    if (hadTrailingNewline && output.length > 0) output += newline;
    fs.ftruncateSync(descriptor, 0);
    fs.writeSync(descriptor, output, 0, 'utf8');
    return removed;
  } finally {
    fs.closeSync(descriptor);
  }
}

/**
 * Execute inverse actions, retaining the run directory and reporting changed paths.
 * @param {object} record
 * @param {object} roots
 * @param {Array<object>} steps
 * @returns {{code: number, result: object, lines: string[]}}
 */
function performUnlink(record, roots, steps) {
  const changed = [];
  const completed = [];
  for (const step of steps) {
    if (!step.ready) {
      if (step.op !== 'ignore-add') changed.push(step.path || step.file);
      continue;
    }
    try {
      if (step.op === 'remove-link') {
        const stat = lstatOrNull(step.absolute);
        const action = record.applied.find((item) => item.path === step.path && item.op === 'link');
        if (!stat || !stat.isSymbolicLink() || !action || fs.readlinkSync(step.absolute) !== action.target) {
          changed.push(step.path);
          continue;
        }
        fs.unlinkSync(step.absolute);
      } else if (step.op === 'restore-link') {
        const stat = lstatOrNull(step.absolute);
        const action = record.applied.find((item) => item.path === step.path && item.op === 'replace-link');
        if (!stat || !stat.isSymbolicLink() || !action || fs.readlinkSync(step.absolute) !== action.target) {
          changed.push(step.path);
          continue;
        }
        fs.unlinkSync(step.absolute);
        fs.symlinkSync(step.from, step.absolute);
      } else if (step.op === 'recreate-link') {
        if (lstatOrNull(step.absolute)) {
          changed.push(step.path);
          continue;
        }
        fs.symlinkSync(step.from, step.absolute);
      } else if (step.op === 'rmdir') {
        const stat = lstatOrNull(step.absolute);
        if (stat && stat.isDirectory() && !stat.isSymbolicLink()
          && fs.readdirSync(step.absolute).length === 0) {
          fs.rmdirSync(step.absolute);
        } else {
          changed.push(step.path);
          continue;
        }
      } else if (step.op === 'ignore-remove') {
        const removed = removeIgnoreLines(step.absolute, step.lines);
        if (removed < step.lines.length) changed.push(step.file);
      }
      completed.push(step.path || step.file);
    } catch (error) {
      return {
        code: 1,
        result: {
          command: 'unlink',
          root: roots.root,
          run: record.digest,
          completed,
          changed_since_apply: changed,
          error: 'unlink action ' + step.op + ' ' + (step.path || step.file) + ' failed: ' + error.message,
        },
        lines: [
          'ERROR: unlink action ' + step.op + ' ' + (step.path || step.file) + ' failed: ' + error.message,
          ...changed.map((item) => 'changed since apply: ' + item),
        ],
      };
    }
  }
  const lines = completed.map((item) => 'unlinked: ' + item);
  for (const item of changed) lines.push('changed since apply: ' + item);
  lines.push('run directory kept');
  return {
    code: 0,
    result: {
      command: 'unlink',
      root: roots.root,
      digest: record.digest,
      completed,
      changed_since_apply: changed,
      run_directory_kept: true,
    },
    lines,
  };
}

/**
 * Run unlink in dry-run, confirmation-required, or confirmed mode.
 * @param {object} options
 * @returns {{code: number, result: object, lines: string[]}}
 */
function runUnlink(options) {
  const runDir = path.resolve(options.run);
  const runStat = lstatOrNull(runDir);
  if (!runStat || !runStat.isDirectory() || runStat.isSymbolicLink()) {
    throw new PreconditionError('run path is missing or is not a real directory: ' + runDir);
  }
  const record = readRunRecord(runDir);
  const roots = recordRoots(record);
  const realRunDir = fs.realpathSync(runDir);
  const runsRoot = resolveInside(roots.source, RUNS_PATH);
  if (path.dirname(realRunDir) !== runsRoot || !runNamePattern(record.digest).test(path.basename(realRunDir))) {
    throw new PreconditionError('run directory does not match the recorded source and digest');
  }
  if (options.sourceSpecified) {
    let selectedSource;
    try {
      selectedSource = fs.realpathSync(options.source);
    } catch {
      throw new PreconditionError('source is missing or is not a directory: ' + options.source);
    }
    if (selectedSource !== roots.source) {
      throw new PreconditionError('run record source does not match --source: ' + roots.source);
    }
  }
  const steps = unlinkSteps(record, roots);
  const planLines = ['unlink plan: ' + runDir, ...steps.map(renderUnlinkStep)];
  const actions = steps.map(({ op, path: itemPath, file, ready }) => ({
    op,
    path: itemPath,
    file,
    ready,
  }));
  if (options.dryRun) {
    return {
      code: 0,
      result: {
        command: 'unlink',
        run: runDir,
        root: roots.root,
        digest: record.digest,
        dry_run: true,
        actions,
      },
      lines: [...planLines, 'dry-run: nothing was written'],
    };
  }
  if (!options.yes) {
    return {
      code: 2,
      result: {
        command: 'unlink',
        run: runDir,
        root: roots.root,
        digest: record.digest,
        confirmation_required: true,
        actions,
      },
      lines: [...planLines, 'pass --yes to perform this unlink'],
    };
  }
  return performUnlink(record, roots, steps);
}

// ─────────────────────────────────────────────────────────────────────────────
// 11. COMMAND ENTRY POINT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Run one CLI command and return its exit code.
 * @param {string[]} argv
 * @returns {number}
 */
function main(argv) {
  let options;
  const wantsJson = argv.includes('--json');
  try {
    options = parseArgs(argv);
    if (options.command === 'unlink') {
      const result = runUnlink(options);
      emit(result.result, options.json, result.lines);
      return result.code;
    }

    const context = buildContext(options);
    if (options.command === 'check') {
      const report = inspect({
        root: context.root,
        source: context.source,
        manifest: context.manifest,
        runtimes: options.runtimes,
        include: options.include,
        linkInstructions: options.linkInstructions,
      });
      emit(report, options.json, renderReport(report));
      return 0;
    }
    const plan = buildPlan({
      ...options,
      root: context.root,
      source: context.source,
      manifest: context.manifest,
    });
    if (options.command === 'plan') {
      const lines = [
        ...renderReport(plan),
        ...plan.actions.filter((action) => action.op !== 'refuse').map(renderAction),
      ];
      if (plan.actions.length === 0) lines.push('NOTHING TO DO');
      for (const refusal of plan.refusals) lines.push('refusal: ' + refusal.path + ': ' + refusal.reason);
      for (const warning of plan.warnings) {
        if (!renderReport(plan).includes(warning)) lines.push(warning);
      }
      lines.push('PLAN DIGEST: ' + plan.digest);
      emit(plan, options.json, lines);
      return 0;
    }
    const result = runApply({ ...options, root: context.root, source: context.source, manifest: context.manifest });
    emit(result.result, options.json, result.lines);
    return result.code;
  } catch (error) {
    if (wantsJson) {
      process.stdout.write(JSON.stringify({ error: error.message }) + '\n');
    }
    if (error instanceof UsageError || error instanceof PreconditionError) {
      process.stderr.write('ERROR: ' + error.message + '\n');
      return 2;
    }
    process.stderr.write('ERROR: ' + error.message + '\n');
    return 2;
  }
}

if (require.main === module) {
  process.exitCode = main(process.argv.slice(2));
}

module.exports = {
  parseArgs,
  loadManifest,
  inspect,
  buildPlan,
  planDigest,
};

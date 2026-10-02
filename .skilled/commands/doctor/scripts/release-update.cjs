#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ release-update — evidence-backed release planning and recovery            ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const RELEASE_TAG_RE = /^v\d+\.\d+\.\d+\.\d+$/;
const VERSION_RE = /^v(\d+)\.(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?(?:\+([0-9A-Za-z.-]+))?$/;
const RELEASE_DIR = '.skilled/release';
const RUNS_DIR = path.join(RELEASE_DIR, 'runs');
const BASE_FILE = path.join(RELEASE_DIR, 'base.json');
const DIVERGENCE_FILE = path.join(RELEASE_DIR, 'divergence.json');
const LOCK_FILE = path.join(RELEASE_DIR, '.apply.lock');
const CONFLICT_MARKER_RE = /^(?:<<<<<<<|=======|>>>>>>>)(?: |$)/m;
const MAX_MERGE_CELLS = 4000000;
const USAGE = 'Usage: release-update.cjs <check|align|decide|apply|rollback> [options]';
const HELP_FLAGS = new Set(['--help', '-h']);
const objectFormats = new Map();

const COMMAND_OPTIONS = {
  check: new Set(['repo', 'remote', 'release', 'scope', 'offline', 'json']),
  align: new Set(['repo', 'remote', 'release', 'scope', 'offline', 'json', 'out', 'dry-run']),
  decide: new Set(['repo', 'remote', 'release', 'scope', 'offline', 'json', 'run', 'path', 'decision', 'unit', 'defer']),
  apply: new Set(['repo', 'remote', 'release', 'scope', 'offline', 'json', 'decisions', 'dry-run']),
  rollback: new Set(['repo', 'remote', 'release', 'scope', 'offline', 'json', 'run']),
};

const COMMAND_PURPOSES = {
  check: 'Report the release position, upstream latest and every unit status.',
  align: 'Write a run directory holding the plan, decisions, evidence and proposals.',
  decide: 'Record one file decision, or defer one unit, inside an alignment run.',
  apply: 'Write the accepted release files and update the base and divergence records.',
  rollback: 'Restore the paths an alignment run recorded in its rollback plan.',
};

// Options come from COMMAND_OPTIONS so the help text cannot drift from the parser.
function helpText() {
  const names = Object.keys(COMMAND_OPTIONS);
  const lines = [USAGE, '', 'Subcommands:'];
  for (const name of names) lines.push('  ' + name.padEnd(9) + COMMAND_PURPOSES[name]);
  lines.push('', 'Accepted options:');
  for (const name of names) {
    lines.push('  ' + name.padEnd(9) + [...COMMAND_OPTIONS[name]].map((option) => '--' + option).join(' '));
  }
  lines.push(
    '',
    'Paths:',
    '  run directory   ' + RUNS_DIR + '/<release>-<utc-stamp>/',
    '  base manifest   ' + BASE_FILE,
    '  divergence log  ' + DIVERGENCE_FILE,
    '',
    'Exit codes:',
    '  0  the command completed; a check report is printed whatever the release status',
    '  1  the command refused or failed an operation',
    '  2  usage error',
  );
  return lines.join('\n') + '\n';
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. VERSION AND PATH HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function parseVersion(tag) {
  if (typeof tag !== 'string') return null;
  const match = VERSION_RE.exec(tag);
  if (!match) return null;
  return {
    tag,
    segments: match.slice(1, 5),
    prerelease: match[5] || null,
    build: match[6] || null,
  };
}

function compareVersions(left, right) {
  const a = parseVersion(left);
  const b = parseVersion(right);
  if (!a || !b) throw new Error('versions must use the vN.N.N.N release form');
  for (let index = 0; index < a.segments.length; index += 1) {
    const first = BigInt(a.segments[index]);
    const second = BigInt(b.segments[index]);
    if (first < second) return -1;
    if (first > second) return 1;
  }
  if (a.prerelease && !b.prerelease) return -1;
  if (!a.prerelease && b.prerelease) return 1;
  if (a.prerelease === b.prerelease) return 0;
  return a.prerelease.localeCompare(b.prerelease);
}

function assertSafeRelative(input, label = 'path') {
  if (typeof input !== 'string' || !input || input.includes('\0')) {
    throw new Error(label + ' must be a non-empty relative path');
  }
  const normalized = input.replace(/\\/g, '/');
  if (normalized.startsWith('/') || normalized.split('/').some((part) => part === '..' || part === '.')) {
    throw new Error(label + ' must stay within its root');
  }
  return normalized.replace(/\/+/g, '/');
}

function withinRoot(root, candidate) {
  const relative = path.relative(root, candidate);
  return relative === '' || (!relative.startsWith('..' + path.sep) && relative !== '..' && !path.isAbsolute(relative));
}

function safeResolve(root, relative, { allowMissingParents = true } = {}) {
  const normalized = assertSafeRelative(relative);
  const resolvedRoot = path.resolve(root);
  const destination = path.resolve(resolvedRoot, normalized);
  if (!withinRoot(resolvedRoot, destination)) throw new Error('path escapes its root');
  const parts = normalized.split('/');
  let cursor = resolvedRoot;
  for (const part of parts.slice(0, -1)) {
    cursor = path.join(cursor, part);
    try {
      const stats = fs.lstatSync(cursor);
      if (stats.isSymbolicLink() || !stats.isDirectory()) {
        throw new Error('path parent is not a real directory: ' + cursor);
      }
    } catch (error) {
      if (error.code === 'ENOENT' && allowMissingParents) break;
      throw error;
    }
  }
  return destination;
}

function stableReleaseTag(tag) {
  return RELEASE_TAG_RE.test(tag);
}

function sortTags(tags) {
  return [...new Set(tags)].sort(compareVersions);
}

function latestTag(tags) {
  const stable = sortTags(tags.filter(stableReleaseTag));
  return stable.length ? stable[stable.length - 1] : null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. GIT AND TREE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function git(repo, args, options = {}) {
  return execFileSync('git', args, {
    cwd: repo,
    encoding: options.encoding === undefined ? 'utf8' : options.encoding,
    input: options.input,
    maxBuffer: 64 * 1024 * 1024,
    stdio: ['pipe', 'pipe', 'pipe'],
  });
}

function gitTry(repo, args, options = {}) {
  try {
    return { ok: true, value: git(repo, args, options) };
  } catch (error) {
    return { ok: false, error };
  }
}

function resolveRepo(repoArg) {
  const candidate = path.resolve(repoArg || process.cwd());
  const root = git(candidate, ['rev-parse', '--show-toplevel']).trim();
  return fs.realpathSync(root);
}

function gitBlobId(repo, bytes) {
  let format = objectFormats.get(repo);
  if (!format) {
    format = git(repo, ['rev-parse', '--show-object-format']).trim();
    if (!['sha1', 'sha256'].includes(format)) throw new Error('unsupported Git object format: ' + format);
    objectFormats.set(repo, format);
  }
  const content = Buffer.from(bytes);
  return crypto.createHash(format)
    .update(Buffer.from('blob ' + content.length + '\0'))
    .update(content)
    .digest('hex');
}

function parseTreeOutput(buffer) {
  const entries = new Map();
  for (const record of buffer.toString('utf8').split('\0')) {
    if (!record) continue;
    const separator = record.indexOf('\t');
    if (separator < 0) continue;
    const [mode, type, blob] = record.slice(0, separator).split(' ');
    const filePath = record.slice(separator + 1);
    if (type === 'blob' && (mode === '100644' || mode === '100755' || mode === '120000')) {
      entries.set(filePath, { mode, blob });
    }
  }
  return entries;
}

function commitFiles(repo, revision) {
  if (!revision) return new Map();
  const result = gitTry(repo, ['ls-tree', '-rz', '--full-tree', '-r', revision, '--', '.skilled'], { encoding: null });
  return result.ok ? parseTreeOutput(result.value) : new Map();
}

function indexFiles(repo) {
  const output = git(repo, ['ls-files', '--stage', '-z', '--', '.skilled'], { encoding: null });
  const entries = new Map();
  for (const record of output.toString('utf8').split('\0')) {
    if (!record) continue;
    const separator = record.indexOf('\t');
    if (separator < 0) continue;
    const [mode, blob, stage] = record.slice(0, separator).split(' ');
    const filePath = record.slice(separator + 1);
    if (stage === '0' && (mode === '100644' || mode === '100755' || mode === '120000')) {
      entries.set(filePath, { mode, blob });
    }
  }
  return entries;
}

function worktreeEntry(repo, filePath, allowUntracked = false) {
  const absolutePath = safeResolve(repo, filePath);
  let stats;
  try {
    stats = fs.lstatSync(absolutePath);
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
  if (stats.isDirectory()) return { directory: true, blob: null, mode: null, content: null };
  let mode;
  let content;
  if (stats.isSymbolicLink()) {
    mode = '120000';
    content = fs.readlinkSync(absolutePath, { encoding: 'buffer' });
  } else if (stats.isFile()) {
    mode = (stats.mode & 0o111) ? '100755' : '100644';
    content = fs.readFileSync(absolutePath);
  } else {
    return { unsupported: true, blob: null, mode: null, content: null };
  }
  return {
    mode,
    blob: gitBlobId(repo, content),
    content,
    untracked: allowUntracked,
  };
}

function localFiles(repo, includePaths = []) {
  const tracked = indexFiles(repo);
  const paths = new Set([...tracked.keys(), ...includePaths]);
  const files = new Map();
  for (const filePath of paths) {
    const indexed = tracked.has(filePath);
    const current = worktreeEntry(repo, filePath, !indexed);
    if (indexed || current) files.set(filePath, current);
  }
  return files;
}

function blobBytes(repo, entry) {
  if (!entry || !entry.blob) return null;
  return git(repo, ['cat-file', 'blob', entry.blob], { encoding: null });
}

function tagNames(repo) {
  const output = git(repo, ['for-each-ref', '--format=%(refname:short)', 'refs/tags']);
  return output.split(/\r?\n/).filter((tag) => stableReleaseTag(tag));
}

function remoteTags(repo, remote) {
  const result = gitTry(repo, ['ls-remote', '--tags', remote]);
  if (!result.ok) {
    const detail = result.error.stderr ? result.error.stderr.toString('utf8').trim() : result.error.message;
    return { known: false, tags: [], error: detail };
  }
  const tags = new Set();
  for (const line of result.value.split(/\r?\n/)) {
    const match = /^[0-9a-f]+\s+refs\/tags\/(v\d+\.\d+\.\d+\.\d+)(?:\^\{\})?$/.exec(line);
    if (match) tags.add(match[1]);
  }
  return { known: true, tags: [...tags], error: null };
}

function tagCommit(repo, tag, remote, allowFetch, cache) {
  if (cache.has(tag)) return cache.get(tag);
  const local = gitTry(repo, ['rev-parse', '--verify', tag + '^{commit}']);
  if (local.ok) {
    const commit = local.value.trim();
    cache.set(tag, commit);
    return commit;
  }
  if (!allowFetch) {
    cache.set(tag, null);
    return null;
  }
  const fetched = gitTry(repo, ['fetch', '--no-tags', remote, 'refs/tags/' + tag]);
  if (!fetched.ok) {
    cache.set(tag, null);
    return null;
  }
  const head = gitTry(repo, ['rev-parse', '--verify', 'FETCH_HEAD^{commit}']);
  const commit = head.ok ? head.value.trim() : null;
  cache.set(tag, commit);
  return commit;
}

function unitTreeFingerprint(files) {
  const hash = crypto.createHash('sha256');
  for (const [filePath, entry] of [...files.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    hash.update(filePath);
    hash.update('\0');
    hash.update(entry.mode || '');
    hash.update('\0');
    hash.update(entry.blob || '');
    hash.update('\0');
  }
  return hash.digest('hex');
}

function entriesForUnit(files, unit) {
  const prefix = unit.prefix === '.skilled' ? '.skilled/' : '.skilled/' + unit.prefix + '/';
  const selected = new Map();
  for (const [filePath, entry] of files) {
    if (unit.prefix === '.skilled') {
      if (!filePath.startsWith('.skilled/') || filePath.slice('.skilled/'.length).includes('/')) continue;
      selected.set(filePath, entry);
    } else if (filePath.startsWith(prefix)) {
      if ((unit.childPrefixes || []).some((childPrefix) => filePath.startsWith(childPrefix + '/'))) continue;
      selected.set(filePath, entry);
    }
  }
  return selected;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. PURE UNIT AND FILE CLASSIFICATION
// ─────────────────────────────────────────────────────────────────────────────

function enumerateUnits(inputPaths) {
  const paths = [...new Set(inputPaths.map((entry) => typeof entry === 'string' ? entry : entry.path))]
    .filter((filePath) => typeof filePath === 'string' && filePath.startsWith('.skilled/'));
  const names = new Map();
  const skillRoots = new Set();
  for (const filePath of paths) {
    const relative = filePath.slice('.skilled/'.length);
    const parts = relative.split('/');
    if (parts[0] === 'skills' && parts.length >= 3 && parts[parts.length - 1] === 'SKILL.md') {
      const root = parts.slice(1, -1).join('/');
      if (root) skillRoots.add(root);
    }
  }
  const skillRootList = [...skillRoots].sort((a, b) => b.length - a.length);
  for (const filePath of paths) {
    const relative = filePath.slice('.skilled/'.length);
    const parts = relative.split('/');
    if (parts.length === 1) {
      names.set('(root)', { name: '(root)', prefix: '.skilled', kind: 'root' });
      continue;
    }
    if (parts[0] === 'skills' && parts.length >= 2) {
      const skillPath = parts.slice(1).join('/');
      const root = skillRootList.find((candidate) => skillPath === candidate || skillPath.startsWith(candidate + '/'));
      if (root) {
        names.set(root, { name: root, prefix: 'skills/' + root, kind: 'skill' });
      } else {
        const hub = parts[1];
        names.set(hub, { name: hub, prefix: 'skills/' + hub, kind: 'skill' });
      }
      continue;
    }
    if (parts[0] === 'commands' && parts.length >= 2) {
      const name = 'commands/' + parts[1];
      names.set(name, { name, prefix: 'commands/' + parts[1], kind: 'command' });
      continue;
    }
    const name = parts[0];
    names.set(name, { name, prefix: name, kind: 'directory' });
  }
  const result = [...names.values()].sort((a, b) => a.name.localeCompare(b.name));
  return result.map((unit) => ({
    ...unit,
    childPrefixes: unit.kind === 'skill' && !unit.name.includes('/')
      ? result.filter((candidate) => candidate.kind === 'skill'
        && candidate.name.startsWith(unit.name + '/'))
        .map((candidate) => '.skilled/' + candidate.prefix)
      : [],
  }));
}

function sameState(left, right) {
  if (!left || !right) return !left && !right;
  return left.mode === right.mode && left.blob === right.blob;
}

function isBinary(entry) {
  if (!entry || !entry.content || entry.mode === '120000') return false;
  const bytes = Buffer.from(entry.content);
  if (bytes.includes(0)) return true;
  const text = bytes.toString('utf8');
  return !Buffer.from(text, 'utf8').equals(bytes);
}

function splitTextLines(bytes) {
  const text = Buffer.from(bytes).toString('utf8');
  return text.match(/[^\n]*\n|[^\n]+$/g) || [];
}

function diffHunks(base, variant) {
  const rows = base.length + 1;
  const columns = variant.length + 1;
  if (rows * columns > MAX_MERGE_CELLS) return null;
  const table = Array.from({ length: rows }, () => new Uint32Array(columns));
  for (let i = base.length - 1; i >= 0; i -= 1) {
    for (let j = variant.length - 1; j >= 0; j -= 1) {
      table[i][j] = base[i] === variant[j]
        ? table[i + 1][j + 1] + 1
        : Math.max(table[i + 1][j], table[i][j + 1]);
    }
  }
  const edits = [];
  let i = 0;
  let j = 0;
  let active = null;
  const flush = () => {
    if (active) edits.push(active);
    active = null;
  };
  while (i < base.length || j < variant.length) {
    if (i < base.length && j < variant.length && base[i] === variant[j]) {
      flush();
      i += 1;
      j += 1;
    } else {
      if (!active) active = { start: i, end: i, replacement: [] };
      if (j < variant.length && (i === base.length || table[i][j + 1] >= table[i + 1][j])) {
        active.replacement.push(variant[j]);
        j += 1;
      } else {
        active.end += 1;
        i += 1;
      }
    }
  }
  flush();
  return edits;
}

function conflictText(localBytes, releaseBytes) {
  const local = Buffer.from(localBytes);
  const release = Buffer.from(releaseBytes);
  return Buffer.concat([
    Buffer.from('<<<<<<< local\n'),
    local,
    Buffer.from(local.length && !local.toString('utf8').endsWith('\n') ? '\n' : ''),
    Buffer.from('=======\n'),
    release,
    Buffer.from(release.length && !release.toString('utf8').endsWith('\n') ? '\n' : ''),
    Buffer.from('>>>>>>> release\n'),
  ]);
}

function mergeText(baseBytes, localBytes, releaseBytes) {
  const base = splitTextLines(baseBytes);
  const local = splitTextLines(localBytes);
  const release = splitTextLines(releaseBytes);
  const localEdits = diffHunks(base, local);
  const releaseEdits = diffHunks(base, release);
  if (!localEdits || !releaseEdits) {
    return { kind: 'conflicting', content: conflictText(localBytes, releaseBytes) };
  }
  const overlap = localEdits.some((left) => releaseEdits.some((right) => {
    if (left.start === left.end && right.start === right.end) return left.start === right.start;
    return (left.start < right.end && right.start < left.end)
      || (left.start === right.start && (left.start === left.end || right.start === right.end));
  }));
  if (overlap) return { kind: 'conflicting', content: conflictText(localBytes, releaseBytes) };
  const merged = base.slice();
  for (const edit of [...localEdits, ...releaseEdits].sort((a, b) => b.start - a.start || b.end - a.end)) {
    merged.splice(edit.start, edit.end - edit.start, ...edit.replacement);
  }
  return { kind: 'mergeable', content: Buffer.from(merged.join('')) };
}

function classifyFile(base, local, release) {
  if (sameState(local, release)) return { class: 'same', conflictKind: null };
  if (sameState(local, base)) return { class: 'take-release', conflictKind: null };
  if (sameState(release, base)) return { class: 'local-only', conflictKind: null };
  if (!local) return { class: 'conflict', conflictKind: 'deleted-locally' };
  if (!release) return { class: 'conflict', conflictKind: 'deleted-in-release' };
  if (!base) {
    return {
      class: 'conflict',
      conflictKind: 'conflicting',
      proposal: conflictText(local.content, release.content),
    };
  }
  if (isBinary(base) || isBinary(local) || isBinary(release)
    || local.mode === '120000' || release.mode === '120000') {
    return { class: 'conflict', conflictKind: 'binary' };
  }
  const merged = mergeText(base.content, local.content, release.content);
  return { class: 'conflict', conflictKind: merged.kind, proposal: merged.content };
}

function applyScope(units, scope) {
  if (!scope || scope === 'all') return units;
  const wanted = new Set(scope.split(',').map((name) => name.trim()).filter(Boolean));
  if (!wanted.size) throw Object.assign(new Error('--scope must be all or a comma-separated unit list'), { usage: true });
  const unknown = [...wanted].filter((name) => !units.some((unit) => unit.name === name));
  if (unknown.length) throw Object.assign(new Error('unknown scope unit(s): ' + unknown.join(', ')), { usage: true });
  return units.filter((unit) => wanted.has(unit.name));
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. RELEASE AND BASE RESOLUTION
// ─────────────────────────────────────────────────────────────────────────────

function loadJson(filePath, fallback) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') return fallback;
    throw new Error('cannot read ' + filePath + ': ' + error.message);
  }
}

function releaseContext(repo, options) {
  const head = git(repo, ['rev-parse', 'HEAD']).trim();
  const localTags = tagNames(repo);
  const upstream = options.offline
    ? { known: false, tags: [], error: 'offline mode' }
    : remoteTags(repo, options.remote);
  const localLatest = latestTag(localTags);
  const upstreamLatest = upstream.known ? latestTag(upstream.tags) : null;
  const release = options.release || upstreamLatest || localLatest;
  const commits = new Map();
  const releaseCommit = release
    ? tagCommit(repo, release, options.remote, !options.offline, commits)
    : null;
  if (release && !releaseCommit) throw new Error('release tag could not be resolved: ' + release);
  const headMap = commitFiles(repo, head);
  const targetMap = releaseCommit ? commitFiles(repo, releaseCommit) : new Map();
  const localMap = localFiles(repo, [...targetMap.keys()]);
  const ancestors = [];
  for (const tag of localTags) {
    const commit = tagCommit(repo, tag, options.remote, false, commits);
    if (commit && isAncestor(repo, commit, head) === true) ancestors.push({ tag, commit });
  }
  ancestors.sort((a, b) => compareVersions(a.tag, b.tag));
  const ancestry = ancestors.length ? ancestors[ancestors.length - 1] : null;
  return {
    head,
    localTags,
    localLatest,
    upstream: {
      status: upstream.known && upstreamLatest ? 'known' : 'unknown',
      latest: upstreamLatest || 'unknown',
      error: upstream.error,
      tags: upstream.tags,
    },
    release,
    releaseCommit,
    localMap,
    headMap,
    targetMap,
    ancestry,
    ancestryMap: ancestry ? commitFiles(repo, ancestry.commit) : new Map(),
    allTags: sortTags([...new Set([...localTags, ...(upstream.known ? upstream.tags : [])])]),
    commits,
  };
}

function isAncestor(repo, ancestor, descendant) {
  const result = gitTry(repo, ['merge-base', '--is-ancestor', ancestor, descendant]);
  if (result.ok) return true;
  return result.error.status === 1 ? false : null;
}

function baseForUnit(repo, unit, context, recorded, options) {
  const record = recorded.units && recorded.units[unit.name];
  if (record && typeof record.release === 'string' && parseVersion(record.release)) {
    const commit = tagCommit(repo, record.release, options.remote, !options.offline, context.commits);
    if (commit) {
      const files = entriesForUnit(commitFiles(repo, commit), unit);
      const tree = unitTreeFingerprint(files);
      if (!record.tree || record.tree === tree) {
        return { source: 'recorded', release: record.release, commit, files };
      }
    }
  }
  if (context.ancestry) {
    const selected = context.ancestry;
    return {
      source: 'ancestry',
      release: selected.tag,
      commit: selected.commit,
      files: entriesForUnit(context.ancestryMap, unit),
    };
  }
  let best = null;
  const local = entriesForUnit(context.localMap, unit);
  for (const tag of context.allTags) {
    const commit = tagCommit(repo, tag, options.remote, !options.offline, context.commits);
    if (!commit) continue;
    const files = entriesForUnit(commitFiles(repo, commit), unit);
    const paths = new Set([...local.keys(), ...files.keys()]);
    let distance = 0;
    for (const filePath of paths) {
      if (!sameState(local.get(filePath), files.get(filePath))) distance += 1;
    }
    if (!best || distance < best.distance
      || distance === best.distance && compareVersions(tag, best.release) > 0) {
      best = { source: 'inferred', release: tag, commit, files, distance };
    }
  }
  return best || { source: 'none', release: null, commit: null, files: new Map() };
}

function releasePosition(repo, head, releaseCommit) {
  if (!releaseCommit) return { position: 'unknown', aheadBy: null, behindBy: null };
  if (head === releaseCommit) return { position: 'at-release', aheadBy: 0, behindBy: 0 };
  if (isAncestor(repo, releaseCommit, head) === true) {
    const aheadBy = Number(git(repo, ['rev-list', '--count', releaseCommit + '..' + head]).trim());
    return { position: 'ahead', aheadBy, behindBy: 0 };
  }
  if (isAncestor(repo, head, releaseCommit) === true) {
    const behindBy = Number(git(repo, ['rev-list', '--count', head + '..' + releaseCommit]).trim());
    return { position: 'behind', aheadBy: 0, behindBy };
  }
  return { position: 'unknown', aheadBy: null, behindBy: null };
}

function ledgerEntries(repo) {
  const record = loadJson(path.join(repo, DIVERGENCE_FILE), { entries: [] });
  return Array.isArray(record.entries) ? record.entries : [];
}

function mergeWithGitOrText(repo, base, local, release) {
  if (base.blob && local.blob && release.blob) {
    const available = [base.blob, local.blob, release.blob].every((blob) => (
      gitTry(repo, ['cat-file', '-e', blob + '^{blob}']).ok
    ));
    if (available) {
      const result = gitTry(repo, [
        'merge-file', '-p', '--object-id',
        '-L', 'local', '-L', 'base', '-L', 'release',
        local.blob, base.blob, release.blob,
      ], { encoding: null });
      if (result.ok) return { kind: 'mergeable', content: result.value };
      if (result.error.status === 1) {
        return { kind: 'conflicting', content: result.error.stdout || conflictText(local.content, release.content) };
      }
    }
  }
  return mergeText(base.content, local.content, release.content);
}

function classifyDetailed(repo, base, local, release) {
  if (sameState(local, release) || sameState(local, base) || sameState(release, base)
    || !local || !release) {
    return classifyFile(base, local, release);
  }
  const withContent = (entry) => entry && {
    ...entry,
    content: entry.content || blobBytes(repo, entry),
  };
  const detailed = classifyFile(withContent(base), withContent(local), withContent(release));
  if (detailed.class !== 'conflict'
    || !['mergeable', 'conflicting'].includes(detailed.conflictKind) || !base) return detailed;
  return { ...detailed, ...mergeWithGitOrText(repo, withContent(base), withContent(local), withContent(release)) };
}

function countClasses(files) {
  const counts = {};
  for (const file of files) counts[file.class] = (counts[file.class] || 0) + 1;
  return counts;
}

function hasPresentEntry(files) {
  return [...files.values()].some((entry) => entry && !entry.directory && !entry.unsupported);
}

function unitStatus(files, base, local, release) {
  if (base.source === 'none') return 'blocked';
  const classes = files.map((file) => file.class);
  const changed = classes.filter((kind) => kind !== 'same');
  const baseHadFiles = hasPresentEntry(base.files);
  const releaseHasFiles = hasPresentEntry(release);
  if (baseHadFiles && !releaseHasFiles) return 'removed';
  if (!changed.length) return 'current';
  if (classes.includes('conflict')) return 'conflict';
  if (changed.every((kind) => kind === 'local-only' || kind === 'kept-local')) return 'local';
  if (changed.some((kind) => kind === 'local-only' || kind === 'kept-local')) return 'customized';
  if (!hasPresentEntry(local) && releaseHasFiles) return 'new';
  if (changed.every((kind) => kind === 'take-release')) return 'update';
  return 'customized';
}

function syntheticPathForUnit(name) {
  if (name === '(root)') return '.skilled/.release-unit-placeholder';
  if (name.startsWith('commands/')) return '.skilled/' + name + '/.release-unit-placeholder';
  if (name.includes('/')) return '.skilled/skills/' + name + '/SKILL.md';
  if (name.startsWith('skills/')) return '.skilled/' + name + '/.release-unit-placeholder';
  return '.skilled/skills/' + name + '/SKILL.md';
}

function buildReport(repo, options) {
  const context = releaseContext(repo, options);
  const recorded = loadJson(path.join(repo, BASE_FILE), { units: {} });
  const recordedPaths = [];
  for (const [name, record] of Object.entries(recorded.units || {})) {
    let included = false;
    if (record && typeof record.release === 'string' && parseVersion(record.release)) {
      const commit = tagCommit(repo, record.release, options.remote, !options.offline, context.commits);
      const historicalFiles = commit ? commitFiles(repo, commit) : new Map();
      const historicalUnit = enumerateUnits([...historicalFiles.keys()]).find((unit) => unit.name === name);
      if (historicalUnit) {
        recordedPaths.push(...entriesForUnit(historicalFiles, historicalUnit).keys());
        included = true;
      }
    }
    if (!included) recordedPaths.push(syntheticPathForUnit(name));
  }
  const unitPaths = new Set([
    ...context.headMap.keys(),
    ...context.ancestryMap.keys(),
    ...context.localMap.keys(),
    ...context.targetMap.keys(),
    ...recordedPaths,
  ]);
  const units = applyScope(enumerateUnits([...unitPaths]), options.scope);
  const ledger = ledgerEntries(repo);
  const reports = [];
  const globalFiles = [];
  for (const unit of units) {
    const base = baseForUnit(repo, unit, context, recorded, options);
    const baseFiles = base.files;
    const localUnit = entriesForUnit(context.localMap, unit);
    const releaseUnit = entriesForUnit(context.targetMap, unit);
    const paths = [...new Set([...baseFiles.keys(), ...localUnit.keys(), ...releaseUnit.keys()])].sort();
    const fileReports = [];
    for (const filePath of paths) {
      const local = localUnit.get(filePath) || null;
      const baseEntry = baseFiles.get(filePath) || null;
      const releaseEntry = releaseUnit.get(filePath) || null;
      const classification = classifyDetailed(
        repo,
        baseEntry,
        local,
        releaseEntry,
      );
      const ledgerEntry = ledger.find((entry) => (
        entry.path === filePath
        && entry.localBlob === (local && local.blob)
        && entry.releaseBlob === (releaseEntry && releaseEntry.blob)
      ));
      const resolvedClass = ledgerEntry && classification.class !== 'same'
        ? { class: 'kept-local', conflictKind: null, decidedAt: ledgerEntry.decidedAt }
        : classification;
      const { proposal, ...summary } = resolvedClass;
      const report = {
        path: filePath,
        unit: unit.name,
        ...summary,
        base: baseEntry && { mode: baseEntry.mode, blob: baseEntry.blob },
        local: local && { mode: local.mode, blob: local.blob },
        release: releaseEntry && { mode: releaseEntry.mode, blob: releaseEntry.blob },
      };
      fileReports.push(report);
      globalFiles.push(report);
    }
    const status = unitStatus(fileReports, base, localUnit, releaseUnit);
    const changelogs = fileReports
      .filter((file) => /(^|\/)(?:changelog|changelogs)(?:\/|\.|$)/i.test(file.path)
        && file.class === 'take-release')
      .map((file) => ({
        path: file.path,
        content: blobBytes(repo, releaseUnit.get(file.path)).toString('utf8'),
      }));
    reports.push({
      name: unit.name,
      prefix: unit.prefix,
      kind: unit.kind,
      status,
      baseSource: base.source,
      baseRelease: base.release,
      baseTree: unitTreeFingerprint(baseFiles),
      releaseTree: unitTreeFingerprint(releaseUnit),
      classCounts: countClasses(fileReports),
      files: fileReports,
      changelogs,
    });
  }
  const upstreamKnown = context.upstream.status === 'known';
  const checkout = releasePosition(repo, context.head, context.releaseCommit);
  const dirty = git(repo, ['status', '--porcelain']).trim().length > 0;
  const offersUpdate = reports.some((unit) => ['conflict', 'customized', 'update', 'new', 'removed'].includes(unit.status));
  const hasBlocked = reports.some((unit) => unit.status === 'blocked');
  let status = 'current';
  if (offersUpdate) {
    status = 'updates-available';
  } else if (hasBlocked) {
    status = 'blocked';
  }
  if (!upstreamKnown) {
    status = 'unknown';
    for (const unit of reports) if (unit.status === 'current') unit.status = 'unknown';
  }
  return {
    schemaVersion: 1,
    command: 'check',
    repo,
    head: context.head,
    release: context.release || 'unknown',
    releaseCommit: context.releaseCommit,
    localLatest: context.localLatest || 'unknown',
    upstream: {
      status: context.upstream.status,
      latest: context.upstream.latest,
      error: context.upstream.error,
    },
    checkout: { ...checkout, dirty },
    status,
    units: reports,
    files: globalFiles,
    counts: { units: reports.length, files: globalFiles.length },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. ALIGNMENT AND DECISIONS
// ─────────────────────────────────────────────────────────────────────────────

function runRelativePath(filePath) {
  return assertSafeRelative(filePath.replace(/^\.skilled\//, ''));
}

function defaultRunDir(repo, release) {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const tag = (release || 'unknown').replace(/[^A-Za-z0-9.-]/g, '_');
  return path.join(repo, RUNS_DIR, tag + '-' + stamp);
}

function mergeResultForReport(repo, file) {
  if (file.class !== 'conflict' || !['mergeable', 'conflicting'].includes(file.conflictKind)) return null;
  const base = file.base && { ...file.base, content: blobBytes(repo, file.base) };
  const local = file.local && { ...file.local, content: blobBytes(repo, file.local) };
  const release = file.release && { ...file.release, content: blobBytes(repo, file.release) };
  if (!local || !release) return null;
  if (!base) return { kind: 'conflicting', content: file.proposal || conflictText(local.content, release.content) };
  return mergeWithGitOrText(repo, base, local, release);
}

function recommendation(file, unit) {
  if (file.conflictKind === 'mergeable') return 'merge';
  if (file.conflictKind === 'conflicting') return 'use-proposal';
  if (file.conflictKind === 'deleted-locally' || file.conflictKind === 'deleted-in-release') return 'keep-local';
  if (file.class === 'local-only' || file.class === 'kept-local') return 'keep-local';
  if (file.class === 'take-release' && unit.status === 'customized') return 'adopt-release';
  return null;
}

function evidenceDiff(repo, before, after, beforeLabel, afterLabel) {
  if (sameState(before, after)) return 'No content or mode changes.';
  if (before && after && before.mode === '120000' && after.mode === '120000') {
    const oldTarget = blobBytes(repo, before).toString('utf8');
    const newTarget = blobBytes(repo, after).toString('utf8');
    return [
      '--- ' + beforeLabel + ' symlink target',
      '+++ ' + afterLabel + ' symlink target',
      '-' + oldTarget,
      '+' + newTarget,
    ].join('\n');
  }
  const beforeBytes = before ? blobBytes(repo, before) : Buffer.alloc(0);
  const afterBytes = after ? blobBytes(repo, after) : Buffer.alloc(0);
  if (isBinary(before && { ...before, content: beforeBytes })
    || isBinary(after && { ...after, content: afterBytes })) {
    return 'Binary content changed from '
      + (before ? before.blob : 'absent') + ' to ' + (after ? after.blob : 'absent') + '.';
  }
  const oldLines = splitTextLines(beforeBytes);
  const newLines = splitTextLines(afterBytes);
  const lines = [
    '--- ' + beforeLabel + (before ? ' (' + before.blob + ')' : ' (absent)'),
    '+++ ' + afterLabel + (after ? ' (' + after.blob + ')' : ' (absent)'),
    '@@ -1,' + oldLines.length + ' +1,' + newLines.length + ' @@',
  ];
  for (const line of oldLines) lines.push('-' + line.replace(/\n$/, ''));
  for (const line of newLines) lines.push('+' + line.replace(/\n$/, ''));
  return lines.join('\n');
}

function evidenceCard(repo, file, unit, changelogs, merge) {
  const changelogRationale = changelogs.length
    ? changelogs.map((entry) => entry.path + '\n' + entry.content).join('\n\n')
    : 'no added changelog entry for this unit';
  return [
    '# Release evidence: ' + file.path,
    '',
    '- Unit: ' + unit.name,
    '- Class: ' + file.class,
    '- Conflict kind: ' + (file.conflictKind || 'none'),
    '- Base blob: ' + (file.base ? file.base.blob : 'absent'),
    '- Base mode: ' + (file.base ? file.base.mode : 'absent'),
    '- Local blob: ' + (file.local ? file.local.blob : 'absent'),
    '- Local mode: ' + (file.local ? file.local.mode : 'absent'),
    '- Release blob: ' + (file.release ? file.release.blob : 'absent'),
    '- Release mode: ' + (file.release ? file.release.mode : 'absent'),
    '- Merge summary: ' + (merge ? merge.kind : 'not applicable'),
    '- Changelog rationale: ' + changelogRationale,
    '- Recommended decision: ' + (recommendation(file, unit) || 'review'),
    '',
    '## Base-to-release diff',
    '',
    '\x60\x60\x60diff',
    evidenceDiff(repo, file.base, file.release, 'base', 'release'),
    '\x60\x60\x60',
    '',
    '## Base-to-local diff',
    '',
    '\x60\x60\x60diff',
    evidenceDiff(repo, file.base, file.local, 'base', 'local'),
    '\x60\x60\x60',
    '',
  ].join('\n');
}

function makePlan(repo, options) {
  const report = buildReport(repo, options);
  const runDir = path.resolve(repo, options.out || defaultRunDir(repo, report.release));
  const runRelative = path.relative(repo, runDir);
  const externalRunDir = path.isAbsolute(runRelative) || runRelative.startsWith('..' + path.sep) || runRelative === '..';
  const plan = {
    schemaVersion: 1,
    command: 'align',
    repo,
    runDir,
    createdAt: new Date().toISOString(),
    release: report.release,
    releaseCommit: report.releaseCommit,
    head: report.head,
    upstream: report.upstream,
    checkout: report.checkout,
    status: report.status,
    units: report.units.map(({ files, ...unit }) => unit),
    files: report.files.filter((file) => file.class !== 'same').map((file) => file),
  };
  const decisions = { schemaVersion: 1, release: report.release, files: {}, deferredUnits: [] };
  const evidence = [];
  const proposals = [];
  for (const unit of report.units) {
    for (const file of unit.files) {
      const shouldExplain = file.class !== 'same'
        && ['customized', 'conflict', 'removed'].includes(unit.status);
      const rec = recommendation(file, unit);
      if (file.class === 'take-release' && unit.status === 'customized') {
        decisions.files[file.path] = { decision: 'adopt-release', source: 'prefilled' };
      }
      if (!shouldExplain) continue;
      const merge = mergeResultForReport(repo, file);
      evidence.push({
        path: path.join('evidence', runRelativePath(file.path) + '.md'),
        content: evidenceCard(repo, file, unit, unit.changelogs, merge),
      });
      if (merge) proposals.push({ path: path.join('proposals', runRelativePath(file.path)), content: merge.content });
    }
  }
  plan.evidenceFiles = evidence.map((entry) => entry.path);
  plan.proposalFiles = proposals.map((entry) => entry.path);
  plan.externalRunDir = externalRunDir;
  return { plan, decisions, evidence, proposals };
}

function assertRunDirectory(runDir) {
  const resolved = path.resolve(runDir);
  const parent = path.dirname(resolved);
  fs.mkdirSync(parent, { recursive: true });
  const parentReal = fs.realpathSync(parent);
  if (!withinRoot(parentReal, resolved)) throw new Error('run directory path is invalid');
  if (fs.existsSync(resolved)) {
    const stats = fs.lstatSync(resolved);
    if (stats.isSymbolicLink() || !stats.isDirectory()) throw new Error('run path must be a real directory');
    if (fs.readdirSync(resolved).length) throw new Error('run directory already exists and is not empty: ' + resolved);
  } else {
    fs.mkdirSync(resolved);
  }
  return resolved;
}

function writeRunFile(runDir, relative, content) {
  const target = safeResolve(runDir, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  let existing;
  try { existing = fs.lstatSync(target); } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  if (existing && (existing.isSymbolicLink() || !existing.isFile())) {
    throw new Error('run artifact must be a regular file: ' + relative);
  }
  if (existing) throw new Error('run artifact already exists: ' + relative);
  fs.writeFileSync(target, content, { flag: 'wx' });
}

function writeRunFileReplacement(runDir, relative, content) {
  const target = safeResolve(runDir, relative, { allowMissingParents: false });
  let existing;
  try { existing = fs.lstatSync(target); } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  if (existing && (existing.isSymbolicLink() || !existing.isFile())) {
    throw new Error('run artifact must be a regular file: ' + relative);
  }
  const temporary = target + '.tmp-' + process.pid + '-' + crypto.randomBytes(6).toString('hex');
  try {
    fs.writeFileSync(temporary, content, { flag: 'wx' });
    fs.renameSync(temporary, target);
  } finally {
    fs.rmSync(temporary, { force: true });
  }
}

function readRunFile(runDir, relative) {
  const target = safeResolve(runDir, relative, { allowMissingParents: false });
  const stats = fs.lstatSync(target);
  if (stats.isSymbolicLink() || !stats.isFile()) throw new Error('run artifact must be a regular file: ' + relative);
  return fs.readFileSync(target);
}

function readRunJson(runDir, relative, fallback) {
  try {
    return JSON.parse(readRunFile(runDir, relative).toString('utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') return fallback;
    throw new Error('cannot read run artifact ' + relative + ': ' + error.message);
  }
}

function createAlignment(repo, options) {
  const result = makePlan(repo, options);
  if (!options.dryRun) {
    const runDir = assertRunDirectory(result.plan.runDir);
    for (const entry of result.evidence) writeRunFile(runDir, entry.path, entry.content);
    for (const entry of result.proposals) writeRunFile(runDir, entry.path, entry.content);
    writeRunFile(runDir, 'plan.json', JSON.stringify(result.plan, null, 2) + '\n');
    writeRunFile(runDir, 'decisions.json', JSON.stringify(result.decisions, null, 2) + '\n');
  }
  return { ...result.plan, dryRun: Boolean(options.dryRun) };
}

function loadRun(runPath, repo) {
  if (!runPath) throw new Error('--run <dir> is required');
  const runDir = path.resolve(repo, runPath);
  const stats = fs.lstatSync(runDir);
  if (stats.isSymbolicLink() || !stats.isDirectory()) throw new Error('run path must be a real directory');
  const planPath = safeResolve(runDir, 'plan.json', { allowMissingParents: false });
  const decisionsPath = safeResolve(runDir, 'decisions.json', { allowMissingParents: false });
  return {
    runDir,
    planPath,
    decisionsPath,
    plan: readRunJson(runDir, 'plan.json', null),
    decisions: readRunJson(runDir, 'decisions.json', { schemaVersion: 1, files: {}, deferredUnits: [] }),
  };
}

function normalizedDecisionPath(input, plan) {
  const normalized = assertSafeRelative(input, '--path');
  const candidate = normalized.startsWith('.skilled/') ? normalized : '.skilled/' + normalized;
  if (!plan.files.some((file) => file.path === candidate)) {
    throw new Error('path is not a planned file: ' + input);
  }
  return candidate;
}

function proposalPath(runDir, filePath) {
  return safeResolve(runDir, path.join('proposals', runRelativePath(filePath)), { allowMissingParents: false });
}

function proposeDecision(run, filePath, decision) {
  const file = run.plan.files.find((candidate) => candidate.path === filePath);
  if (!file) throw new Error('path is not in the alignment plan');
  if (!new Set(['adopt-release', 'keep-local', 'merge', 'use-proposal']).has(decision)) {
    throw new Error('unsupported decision: ' + decision);
  }
  if (decision === 'adopt-release' && file.class !== 'take-release') {
    throw new Error('adopt-release is allowed only for take-release files');
  }
  if (decision === 'merge' && file.conflictKind !== 'mergeable') {
    throw new Error('merge is allowed only for mergeable files');
  }
  if (decision === 'use-proposal' || decision === 'merge') {
    const bytes = readRunFile(run.runDir, path.relative(run.runDir, proposalPath(run.runDir, filePath)));
    if (CONFLICT_MARKER_RE.test(bytes.toString('utf8'))) {
      throw new Error(decision + ' requires all conflict markers to be removed');
    }
    run.decisions.files[filePath] = {
      decision,
      proposalSha256: crypto.createHash('sha256').update(bytes).digest('hex'),
      decidedAt: new Date().toISOString(),
    };
  } else {
    run.decisions.files[filePath] = { decision, decidedAt: new Date().toISOString() };
  }
  writeRunFileReplacement(run.runDir, 'decisions.json', JSON.stringify(run.decisions, null, 2) + '\n');
  return { path: filePath, decision, runDir: run.runDir };
}

function deferUnit(run, unitName) {
  if (!run.plan.units.some((unit) => unit.name === unitName)) {
    throw new Error('unit is not in the alignment plan: ' + unitName);
  }
  const deferred = new Set(run.decisions.deferredUnits || []);
  deferred.add(unitName);
  run.decisions.deferredUnits = [...deferred].sort();
  writeRunFileReplacement(run.runDir, 'decisions.json', JSON.stringify(run.decisions, null, 2) + '\n');
  return { unit: unitName, deferred: true, runDir: run.runDir };
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. APPLY AND ROLLBACK
// ─────────────────────────────────────────────────────────────────────────────

function currentState(repo, filePath) {
  const entry = worktreeEntry(repo, filePath);
  if (!entry || entry.directory || entry.unsupported) return null;
  return { mode: entry.mode, blob: entry.blob };
}

function stateEquals(left, right) {
  return sameState(left, right);
}

function pathDirtyAgainstHead(repo, filePath, headFiles) {
  const staged = gitTry(repo, ['diff', '--cached', '--quiet', 'HEAD', '--', filePath]);
  if (!staged.ok) return true;
  const unstaged = gitTry(repo, ['diff', '--quiet', '--', filePath]);
  if (!unstaged.ok) return true;
  const current = worktreeEntry(repo, filePath);
  return !headFiles.has(filePath) && Boolean(current) || Boolean(current && current.directory);
}

function targetForRelease(repo, file) {
  if (!file.release) return null;
  return { mode: file.release.mode, blob: file.release.blob, content: blobBytes(repo, file.release) };
}

function decisionTarget(repo, run, file, record) {
  const decision = typeof record === 'string' ? record : record.decision;
  if (decision === 'adopt-release') return targetForRelease(repo, file);
  if (decision === 'keep-local') return undefined;
  const proposedPath = proposalPath(run.runDir, file.path);
  const content = readRunFile(run.runDir, path.relative(run.runDir, proposedPath));
  const sha256 = crypto.createHash('sha256').update(content).digest('hex');
  if (!record.proposalSha256 || sha256 !== record.proposalSha256) {
    throw new Error('proposal changed after decision: ' + file.path);
  }
  if (CONFLICT_MARKER_RE.test(content.toString('utf8'))) {
    throw new Error('proposal still contains conflict markers: ' + file.path);
  }
  const mode = file.local ? file.local.mode : file.release ? file.release.mode : '100644';
  return { mode, blob: gitBlobId(repo, content), content };
}

function latestRun(repo) {
  const directory = path.join(repo, RUNS_DIR);
  if (!fs.existsSync(directory)) throw new Error('no release alignment run exists');
  const runs = fs.readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(directory, entry.name))
    .filter((entry) => fs.existsSync(path.join(entry, 'plan.json')))
    .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);
  if (!runs.length) throw new Error('no release alignment run exists');
  return runs[0];
}

function resolveApplyRun(repo, decisionsPath) {
  if (!decisionsPath) {
    const run = loadRun(latestRun(repo), repo);
    run.decisions = { schemaVersion: 1, files: {}, deferredUnits: [] };
    return run;
  }
  const absolutePath = path.resolve(repo, decisionsPath);
  const run = loadRun(path.dirname(absolutePath), repo);
  run.decisionsPath = absolutePath;
  run.decisions = readRunJson(path.dirname(absolutePath), path.basename(absolutePath), null);
  if (!run.decisions) throw new Error('decision file is missing or invalid');
  return run;
}

function jsonBytes(value) {
  return Buffer.from(JSON.stringify(value, null, 2) + '\n');
}

function removeEmptyParents(repo, directory) {
  let current = path.resolve(directory);
  const boundary = path.resolve(repo, '.skilled');
  while (withinRoot(boundary, current) && current !== boundary) {
    try {
      if (fs.readdirSync(current).length) break;
      fs.rmdirSync(current);
    } catch (error) {
      if (error.code === 'ENOENT') {
        current = path.dirname(current);
        continue;
      }
      if (error.code === 'ENOTEMPTY') break;
      throw error;
    }
    current = path.dirname(current);
  }
}

function assertPlanFresh(repo, run, paths) {
  const releaseFiles = run.plan.releaseCommit ? commitFiles(repo, run.plan.releaseCommit) : new Map();
  const selected = paths ? new Set(paths) : new Set(run.plan.files.map((file) => file.path));
  for (const file of run.plan.files.filter((entry) => selected.has(entry.path))) {
    const localEntry = worktreeEntry(repo, file.path);
    const local = localEntry && !localEntry.directory && !localEntry.unsupported
      ? { mode: localEntry.mode, blob: localEntry.blob }
      : null;
    const plannedLocal = file.local ? { mode: file.local.mode, blob: file.local.blob } : null;
    if (!sameState(local, plannedLocal)) throw new Error('drift since align: local blob changed for ' + file.path);
    const actualRelease = releaseFiles.get(file.path) || null;
    if (!sameState(actualRelease, file.release)) {
      throw new Error('drift since align: release blob changed for ' + file.path);
    }
  }
}

function prepareWrites(repo, run, scope) {
  const headFiles = commitFiles(repo, 'HEAD');
  const deferred = new Set(run.decisions.deferredUnits || []);
  const unitMap = new Map(run.plan.units.map((unit) => [unit.name, unit]));
  const selectedUnits = applyScope(run.plan.units, scope);
  const writes = [];
  const ledgerAdditions = [];
  const appliedUnits = new Set();
  const skippedUnits = [];
  for (const unit of selectedUnits) {
    const fileEntries = run.plan.files.filter((file) => file.unit === unit.name);
    if (deferred.has(unit.name)) {
      skippedUnits.push({ unit: unit.name, reason: 'deferred' });
      continue;
    }
    if (['current', 'local', 'unknown', 'blocked'].includes(unit.status)) continue;
    if (['update', 'new'].includes(unit.status)) {
      for (const file of fileEntries) {
        if (file.class === 'take-release') {
          writes.push({ path: file.path, after: targetForRelease(repo, file), file, decision: 'adopt-release' });
        }
      }
      appliedUnits.add(unit.name);
      continue;
    }
    const chosen = fileEntries.filter((file) => run.decisions.files && run.decisions.files[file.path]);
    if (!chosen.length) {
      skippedUnits.push({ unit: unit.name, reason: 'no decisions' });
      continue;
    }
    for (const file of chosen) {
      const record = run.decisions.files[file.path];
      const decision = typeof record === 'string' ? record : record.decision;
      const target = decisionTarget(repo, run, file, record);
      if (decision !== 'keep-local' && target !== undefined) {
        writes.push({ path: file.path, after: target, file, decision });
      }
      if (['keep-local', 'merge', 'use-proposal'].includes(decision)) {
        ledgerAdditions.push({
          unit: unit.name,
          path: file.path,
          release: run.plan.release,
          localBlob: decision === 'keep-local' ? (file.local && file.local.blob) : target && target.blob,
          releaseBlob: file.release ? file.release.blob : null,
          decision,
          decidedAt: (typeof record === 'object' && record.decidedAt) || new Date().toISOString(),
        });
      }
    }
    appliedUnits.add(unit.name);
  }
  const oldBasePath = safeResolve(repo, BASE_FILE);
  const oldBase = loadJson(oldBasePath, { schemaVersion: 1, units: {} });
  const newBase = { schemaVersion: 1, units: { ...(oldBase.units || {}) } };
  for (const unitName of appliedUnits) {
    const unit = unitMap.get(unitName);
    if (unit) newBase.units[unitName] = { release: run.plan.release, tree: unit.releaseTree };
  }
  const baseContent = jsonBytes(newBase);
  writes.push({
    path: BASE_FILE,
    after: { mode: '100644', blob: gitBlobId(repo, baseContent), content: baseContent },
    metadata: true,
  });
  const ledgerPath = safeResolve(repo, DIVERGENCE_FILE);
  const existingLedger = loadJson(ledgerPath, { schemaVersion: 1, entries: [] });
  if (ledgerAdditions.length || fs.existsSync(ledgerPath)) {
    const newLedger = {
      schemaVersion: 1,
      entries: [...(Array.isArray(existingLedger.entries) ? existingLedger.entries : []), ...ledgerAdditions],
    };
    const ledgerContent = jsonBytes(newLedger);
    writes.push({
      path: DIVERGENCE_FILE,
      after: { mode: '100644', blob: gitBlobId(repo, ledgerContent), content: ledgerContent },
      metadata: true,
    });
  }
  const headChangedPaths = [...new Set([...writes.map((entry) => entry.path)])];
  for (const filePath of headChangedPaths) {
    if (pathDirtyAgainstHead(repo, filePath, headFiles)) {
      throw new Error('target has staged or unstaged changes against HEAD: ' + filePath);
    }
  }
  for (const write of writes) write.before = headFiles.get(write.path) || null;
  const freshnessPaths = new Set([
    ...writes.filter((write) => write.file).map((write) => write.path),
    ...ledgerAdditions.map((entry) => entry.path),
  ]);
  return {
    writes,
    skippedUnits,
    appliedUnits: [...appliedUnits],
    headFiles,
    freshnessPaths,
  };
}

function acquireLock(repo) {
  const lockPath = safeResolve(repo, LOCK_FILE);
  fs.mkdirSync(path.dirname(lockPath), { recursive: true });
  let descriptor;
  try {
    descriptor = fs.openSync(lockPath, 'wx', 0o600);
  } catch (error) {
    if (error.code === 'EEXIST') throw new Error('apply lock already exists: ' + LOCK_FILE);
    throw error;
  }
  try {
    fs.writeFileSync(descriptor, JSON.stringify({ pid: process.pid, startedAt: new Date().toISOString() }) + '\n');
  } catch (error) {
    fs.closeSync(descriptor);
    fs.rmSync(lockPath, { force: true });
    throw error;
  }
  fs.closeSync(descriptor);
  return lockPath;
}

function writeAtomic(repo, filePath, entry, content) {
  const destination = safeResolve(repo, filePath);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  let existing;
  try { existing = fs.lstatSync(destination); } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  if (existing && existing.isDirectory()) throw new Error('target is a directory: ' + filePath);
  if (!entry) {
    if (existing) fs.rmSync(destination);
    return;
  }
  const tempPath = destination + '.release-update-' + process.pid + '-' + Date.now();
  try {
    if (entry.mode === '120000') {
      fs.symlinkSync(content, tempPath);
    } else {
      fs.writeFileSync(tempPath, content, { mode: entry.mode === '100755' ? 0o755 : 0o644, flag: 'wx' });
      fs.chmodSync(tempPath, entry.mode === '100755' ? 0o755 : 0o644);
    }
    fs.renameSync(tempPath, destination);
  } finally {
    fs.rmSync(tempPath, { force: true });
  }
}

function applyPlan(repo, options) {
  const run = resolveApplyRun(repo, options.decisions);
  if (!run.plan || run.plan.repo !== repo) throw new Error('alignment plan belongs to another repository');
  if (options.release && options.release !== run.plan.release) {
    throw new Error('--release does not match the alignment plan');
  }
  if (run.plan.releaseCommit && !gitTry(repo, ['cat-file', '-e', run.plan.releaseCommit + '^{commit}']).ok) {
    throw new Error('release commit from alignment is unavailable');
  }
  const prepared = prepareWrites(repo, run, options.scope);
  assertPlanFresh(repo, run, prepared.freshnessPaths);
  for (const write of prepared.writes) {
    if (write.after && !write.after.content && write.after.blob) write.after.content = blobBytes(repo, write.after);
  }
  const lockPath = safeResolve(repo, LOCK_FILE);
  if (fs.existsSync(lockPath)) throw new Error('apply lock already exists: ' + LOCK_FILE);
  if (fs.existsSync(safeResolve(run.runDir, 'rollback.json'))) {
    throw new Error('rollback record already exists for this run');
  }
  const rollback = {
    schemaVersion: 1,
    runDir: run.runDir,
    release: run.plan.release,
    createdAt: new Date().toISOString(),
    paths: prepared.writes.map((write) => ({
      path: write.path,
      before: write.before,
      after: write.after ? { mode: write.after.mode, blob: write.after.blob } : null,
    })),
  };
  if (options.dryRun) {
    return {
      command: 'apply',
      dryRun: true,
      writes: prepared.writes.map((write) => ({
        path: write.path,
        mode: write.after && write.after.mode,
        before: write.before,
      })),
      skippedUnits: prepared.skippedUnits,
      appliedUnits: prepared.appliedUnits,
      followUps: followUps(prepared.writes),
    };
  }
  const acquired = acquireLock(repo);
  try {
    assertPlanFresh(repo, run, prepared.freshnessPaths);
    for (const write of prepared.writes) {
      if (pathDirtyAgainstHead(repo, write.path, prepared.headFiles)) {
        throw new Error('target has staged or unstaged changes against HEAD: ' + write.path);
      }
    }
    fs.mkdirSync(path.join(repo, RELEASE_DIR), { recursive: true });
    writeRunFile(run.runDir, 'rollback.json', JSON.stringify(rollback, null, 2) + '\n');
    for (const write of prepared.writes) {
      writeAtomic(repo, write.path, write.after, write.after && write.after.content);
    }
  } finally {
    fs.rmSync(acquired, { force: true });
  }
  return {
    command: 'apply',
    runDir: run.runDir,
    release: run.plan.release,
    written: prepared.writes.filter((write) => write.after).map((write) => write.path),
    added: prepared.writes.filter((write) => write.after && !write.before).map((write) => write.path),
    deleted: prepared.writes.filter((write) => !write.after).map((write) => write.path),
    skippedUnits: prepared.skippedUnits,
    appliedUnits: prepared.appliedUnits,
    followUps: followUps(prepared.writes),
  };
}

function followUps(writes) {
  const regenerateHubs = new Set();
  let reinstallHooks = false;
  let runtimeMirrors = false;
  for (const write of writes) {
    const filePath = write.path;
    if (write.file && write.file.unit.includes('/')
      && write.file.path.startsWith('.skilled/skills/')) {
      regenerateHubs.add(write.file.unit.split('/')[0]);
    }
    if (filePath.startsWith('.skilled/hooks/') || /git-hooks/.test(filePath)) reinstallHooks = true;
    if (write.before === null && write.after || write.before && !write.after) {
      if (filePath.startsWith('.skilled/commands/') || filePath.startsWith('.skilled/skills/')) {
        runtimeMirrors = true;
      }
    }
  }
  return {
    regenerateHubs: [...regenerateHubs].sort(),
    reinstallHooks,
    runtimeMirrors,
    rebuildDatabases: true,
  };
}

function rollbackPlan(repo, runPath) {
  const run = loadRun(runPath, repo);
  const rollback = readRunJson(run.runDir, 'rollback.json', null);
  if (!rollback || !Array.isArray(rollback.paths)) throw new Error('rollback.json is missing or invalid');
  const restored = [];
  const skipped = [];
  for (const entry of rollback.paths) {
    const current = currentState(repo, entry.path);
    if (stateEquals(current, entry.before)) {
      restored.push(entry.path);
      continue;
    }
    if (!stateEquals(current, entry.after)) {
      skipped.push(entry.path);
      continue;
    }
    if (entry.before) {
      writeAtomic(repo, entry.path, entry.before, blobBytes(repo, entry.before));
    } else {
      writeAtomic(repo, entry.path, null, null);
      removeEmptyParents(repo, path.dirname(safeResolve(repo, entry.path)));
    }
    restored.push(entry.path);
  }
  return { command: 'rollback', runDir: run.runDir, restored, skipped, exitCode: skipped.length ? 1 : 0 };
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. CLI PARSING AND OUTPUT
// ─────────────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const command = argv[0];
  if (!command) throw Object.assign(new Error('missing subcommand'), { usage: true });
  if (!COMMAND_OPTIONS[command]) throw Object.assign(new Error('unknown subcommand: ' + command), { usage: true });
  const options = { command, remote: 'origin', scope: 'all', offline: false, json: false, dryRun: false };
  const valueOptions = new Set([
    'repo', 'remote', 'release', 'scope', 'out', 'run', 'path', 'decision', 'unit', 'decisions',
  ]);
  const booleanOptions = new Set(['offline', 'json', 'dry-run', 'defer']);
  const seenOptions = new Set();
  for (let index = 1; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) throw Object.assign(new Error('unexpected argument: ' + token), { usage: true });
    const equal = token.indexOf('=');
    const key = token.slice(2, equal < 0 ? undefined : equal);
    if (!COMMAND_OPTIONS[command].has(key)) {
      throw Object.assign(new Error('unknown option for ' + command + ': --' + key), { usage: true });
    }
    if (seenOptions.has(key)) throw Object.assign(new Error('duplicate option: --' + key), { usage: true });
    seenOptions.add(key);
    if (booleanOptions.has(key)) {
      if (equal >= 0) throw Object.assign(new Error('--' + key + ' does not take a value'), { usage: true });
      options[key === 'dry-run' ? 'dryRun' : key] = true;
      continue;
    }
    if (!valueOptions.has(key)) throw Object.assign(new Error('unsupported option: --' + key), { usage: true });
    const value = equal >= 0 ? token.slice(equal + 1) : argv[++index];
    if (typeof value !== 'string' || !value || value.startsWith('--')) {
      throw Object.assign(new Error('--' + key + ' requires a value'), { usage: true });
    }
    options[key] = value;
  }
  if (options.release && !parseVersion(options.release)) {
    throw Object.assign(new Error('--release must be a version tag'), { usage: true });
  }
  if (command === 'decide') {
    const defer = Boolean(options.defer);
    const hasPathChoice = options.path !== undefined || options.decision !== undefined;
    if (!options.run || defer === hasPathChoice || (defer && !options.unit)
      || (!defer && (!options.path || !options.decision || options.unit))) {
      throw Object.assign(new Error('decide requires --run and either --path <p> --decision <d> or --unit <u> --defer'), { usage: true });
    }
  }
  if (command === 'rollback' && !options.run) {
    throw Object.assign(new Error('rollback requires --run <dir>'), { usage: true });
  }
  return options;
}

function plainSummary(result) {
  if (result.command === 'check') {
    return [
      'release: ' + result.release,
      'upstream: ' + result.upstream.latest,
      'status: ' + result.status,
      ...result.units.map((unit) => unit.name + ': ' + unit.status + ' (' + unit.baseSource + ')'),
    ].join('\n');
  }
  return JSON.stringify(result, null, 2);
}

function isHelpRequest(argv) {
  if (!argv.length) return false;
  if (HELP_FLAGS.has(argv[0])) return true;
  return Boolean(COMMAND_OPTIONS[argv[0]]) && argv.slice(1).some((token) => HELP_FLAGS.has(token));
}

function runCommand(argv) {
  let options;
  try {
    if (isHelpRequest(argv)) return { exitCode: 0, help: helpText(), json: false };
    options = parseArgs(argv);
    const repo = resolveRepo(options.repo);
    let result;
    if (options.command === 'check') {
      result = buildReport(repo, options);
    } else if (options.command === 'align') {
      result = createAlignment(repo, options);
    } else if (options.command === 'decide') {
      const run = loadRun(options.run, repo);
      result = options.defer
        ? deferUnit(run, options.unit)
        : proposeDecision(run, normalizedDecisionPath(options.path, run.plan), options.decision);
    } else if (options.command === 'apply') {
      result = applyPlan(repo, options);
    } else {
      result = rollbackPlan(repo, options.run);
    }
    return { exitCode: result.exitCode || 0, result, json: options.json };
  } catch (error) {
    const exitCode = error.usage ? 2 : 1;
    return {
      exitCode,
      error: error.message,
      json: options ? options.json : argv.includes('--json'),
    };
  }
}

function main(argv = process.argv.slice(2)) {
  process.stdout.on('error', (error) => {
    if (error.code === 'EPIPE') process.exit(0);
    throw error;
  });
  const outcome = runCommand(argv);
  if (outcome.help) {
    process.stdout.write(outcome.help);
  } else if (outcome.json) {
    process.stdout.write(JSON.stringify(outcome.error
      ? { ok: false, error: outcome.error, exitCode: outcome.exitCode }
      : { ok: outcome.exitCode === 0, ...outcome.result }, null, 2) + '\n');
  } else if (outcome.error) {
    process.stderr.write(outcome.error + '\n' + (outcome.exitCode === 2 ? USAGE + '\n' : ''));
  } else {
    process.stdout.write(plainSummary(outcome.result) + '\n');
  }
  process.exitCode = outcome.exitCode;
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  classifyFile,
  compareVersions,
  enumerateUnits,
  main,
  parseVersion,
  runCommand,
};

if (require.main === module) main();

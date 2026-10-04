#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Release Update
// ───────────────────────────────────────────────────────────────────
// Evidence-backed release planning, alignment, apply and recovery for .skilled/.
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
const DECISIONS = new Set(['adopt-release', 'keep-local', 'merge', 'use-proposal']);
const UNIT_KINDS = ['root', 'skill', 'command', 'directory'];
const RECORD_BASE_REMEDY = 're-run record-base to rewrite base.json with kind:name unit keys';
const OPTION_REMEDY = 'pass the kind:name form, for example ';
// Conflicts align writes no proposal for. Taking the release whole (its bytes,
// or its deletion) is the only way to accept the release side of them.
const ADOPTABLE_CONFLICTS = new Set(['binary', 'deleted-locally', 'deleted-in-release']);
const MAX_MERGE_CELLS = 4000000;
// Large enough for `ls-tree -r` over the whole .skilled tree and its biggest blobs.
const GIT_MAX_BUFFER_BYTES = 64 * 1024 * 1024;
const LOG_PREFIX = '[release-update]';
const SCRIPT_COMMAND = 'node .skilled/commands/doctor/scripts/release-update.cjs';
const USAGE = 'Usage: release-update.cjs <check|align|decide|apply|rollback|record-base|unlock> [options]';
const HELP_FLAGS = new Set(['--help', '-h']);
const objectFormats = new Map();

const COMMAND_OPTIONS = {
  check: new Set(['repo', 'remote', 'release', 'scope', 'offline', 'json', 'include-prerelease']),
  align: new Set([
    'repo', 'remote', 'release', 'scope', 'offline', 'json', 'out', 'dry-run', 'include-prerelease',
  ]),
  decide: new Set(['repo', 'json', 'run', 'path', 'decision', 'unit', 'defer']),
  apply: new Set([
    'repo', 'remote', 'release', 'scope', 'offline', 'json', 'decisions', 'dry-run',
    'include-prerelease', 'plan-digest',
  ]),
  rollback: new Set(['repo', 'json', 'run', 'dry-run']),
  unlock: new Set(['repo', 'json', 'dry-run']),
  'record-base': new Set([
    'repo', 'remote', 'release', 'scope', 'offline', 'json', 'dry-run', 'include-prerelease',
    'trust-release',
  ]),
};

const COMMAND_PURPOSES = {
  check: 'Report the release position, upstream latest and every unit status.',
  align: 'Write a run directory holding the plan, decisions, evidence and proposals.',
  decide: 'Record one file decision, or defer one unit, inside an alignment run.',
  apply: 'Write the accepted release files and update the base and divergence records.',
  rollback: 'Restore the paths an alignment run recorded in its rollback plan.',
  unlock: 'Remove an apply lock whose owner process is no longer running.',
  'record-base': 'Record every unit of a named release as the base, for a copied or fresh install.',
};

// Artifacts a generator writes from local sources. A difference confined to
// these bytes is regeneration, not authorship: it never makes a unit
// customized, apply never merges it, and the owning generator reruns after
// apply. `scope: 'file'` means the generator owns the whole file; `scope:
// 'derived'` means it owns only the top-level `derived` key of a JSON document,
// so an edit anywhere else in that file is still an authored change.
// Activation `fence-state.json` stays authored because no operator-side tool writes it.
// `intent_signals` stays authored because its generator appends to an authored
// list while preserving that list's order.
const LEAF_MANIFEST_GENERATOR = 'node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --write <skill-dir>';
const SKILL_DERIVED_GENERATOR = 'node .skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs --root <skill-dir> --write';
const TRIGGER_INDEX_GENERATOR = 'node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs';
const COMPILED_ROUTE_GENERATOR = 'node .skilled/bin/compiled-route-manifest.cjs refresh '
  + '--hub <hub> --skill-root .skilled/skills/<hub>';
const GENERATED_ARTIFACTS = [
  {
    pattern: /^\.skilled\/skills\/.+\/leaf-manifest\.json$/,
    scope: 'file',
    generator: LEAF_MANIFEST_GENERATOR,
  },
  {
    pattern: /^\.skilled\/skills\/.+\/graph-metadata\.json$/,
    scope: 'derived',
    generator: SKILL_DERIVED_GENERATOR,
  },
  {
    pattern: /^\.skilled\/skills\/system-spec-kit\/runtime\/data\/trigger-index\.json$/,
    scope: 'file',
    generator: TRIGGER_INDEX_GENERATOR,
  },
  {
    pattern: /^\.skilled\/skills\/system-spec-kit\/runtime\/cli\/retrieval\/fixtures\/(?:corpus-manifest|generation-diagnostics|phrase-variants)\.json$/,
    scope: 'file',
    generator: TRIGGER_INDEX_GENERATOR,
  },
  {
    pattern: /^\.skilled\/bin\/lib\/compiled-routing\/[^/]+\/activation\/[^/]+\/manifest\.json$/,
    scope: 'file',
    generator: COMPILED_ROUTE_GENERATOR,
  },
];

// Options come from COMMAND_OPTIONS so the help text cannot drift from the parser.
function helpText() {
  const names = Object.keys(COMMAND_OPTIONS);
  const lines = [USAGE, '', 'Subcommands:'];
  for (const name of names) lines.push('  ' + name.padEnd(12) + COMMAND_PURPOSES[name]);
  lines.push('', 'Accepted options:');
  for (const name of names) {
    const options = [...COMMAND_OPTIONS[name]].map((option) => '--' + option);
    lines.push('  ' + name.padEnd(12) + options.join(' '));
  }
  lines.push(
    '',
    'Units:',
    '  A unit is identified as <kind>:<name>, where kind is root, skill, command or',
    '  directory (skill:hub-a, directory:hooks, command:commands/doctor). --scope and',
    '  --unit accept a plain name when only one unit has it; a name two kinds share',
    '  needs the kind:name form. Reports, base.json and decisions use kind:name keys.',
    '',
    'Paths:',
    '  run directory   ' + RUNS_DIR + '/<release>-<utc-stamp>/',
    '  base manifest   ' + BASE_FILE,
    '  divergence log  ' + DIVERGENCE_FILE,
    '',
    'Release policy:',
    '  Latest-upstream resolution takes stable vN.N.N.N tags only. --include-prerelease',
    '  also admits vN.N.N.N-<pre> tags; both orders compare numeric segments, and numeric',
    '  prerelease identifiers compare as numbers (rc.9 before rc.10). A tag named with',
    '  --release is used as given.',
    '',
    'Apply without a decisions file:',
    '  With no --decisions, apply uses the newest alignment run made at the current HEAD',
    '  that has not been applied. With no such run, apply plans from the current check',
    '  and writes only update and new units, re-verifying each local file against its',
    '  base at write time. Customized units still need align and a --decisions file.',
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

// A usage error exits 2 and prints the usage line.
function usageError(message) {
  return Object.assign(new Error(message), { usage: true });
}

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
  return comparePrerelease(a.prerelease, b.prerelease);
}

// Semantic-versioning precedence: numeric identifiers compare as numbers and
// rank below alphanumeric ones, others compare by code unit, and a shorter
// identifier list ranks lower when every shared identifier is equal.
function comparePrerelease(left, right) {
  const a = left.split('.');
  const b = right.split('.');
  for (let index = 0; index < Math.min(a.length, b.length); index += 1) {
    const aNumeric = /^\d+$/.test(a[index]);
    const bNumeric = /^\d+$/.test(b[index]);
    if (aNumeric && bNumeric) {
      const first = BigInt(a[index]);
      const second = BigInt(b[index]);
      if (first !== second) return first < second ? -1 : 1;
    } else if (aNumeric !== bNumeric) {
      return aNumeric ? -1 : 1;
    } else if (a[index] !== b[index]) {
      return a[index] < b[index] ? -1 : 1;
    }
  }
  return Math.sign(a.length - b.length);
}

function assertSafeRelative(input, label = 'path') {
  if (typeof input !== 'string' || !input || input.includes('\0')) {
    throw new Error(label + ' must be a non-empty relative path');
  }
  const normalized = input.replace(/\\/g, '/');
  const dotPart = normalized.split('/').some((part) => part === '..' || part === '.');
  if (normalized.startsWith('/') || dotPart) {
    throw new Error(label + ' must stay within its root');
  }
  return normalized.replace(/\/+/g, '/');
}

function withinRoot(root, candidate) {
  const relative = path.relative(root, candidate);
  if (relative === '') return true;
  return !relative.startsWith('..' + path.sep) && relative !== '..' && !path.isAbsolute(relative);
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

function acceptsTag(includePrerelease) {
  return (tag) => (includePrerelease ? Boolean(parseVersion(tag)) : stableReleaseTag(tag));
}

function latestTag(tags, includePrerelease = false) {
  const accepted = sortTags(tags.filter(acceptsTag(includePrerelease)));
  return accepted.length ? accepted[accepted.length - 1] : null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. GIT AND TREE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function git(repo, args, options = {}) {
  return execFileSync('git', args, {
    cwd: repo,
    encoding: options.encoding === undefined ? 'utf8' : options.encoding,
    input: options.input,
    maxBuffer: GIT_MAX_BUFFER_BYTES,
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
    if (!['sha1', 'sha256'].includes(format)) {
      throw new Error('unsupported Git object format: ' + format);
    }
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
  const args = ['ls-tree', '-rz', '--full-tree', '-r', revision, '--', '.skilled'];
  const result = gitTry(repo, args, { encoding: null });
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
  return output.split(/\r?\n/).filter((tag) => Boolean(parseVersion(tag)));
}

function remoteTags(repo, remote) {
  const result = gitTry(repo, ['ls-remote', '--tags', remote]);
  if (!result.ok) {
    const { stderr, message } = result.error;
    const detail = stderr ? stderr.toString('utf8').trim() : message;
    return { known: false, tags: [], error: detail };
  }
  const tags = new Set();
  for (const line of result.value.split(/\r?\n/)) {
    const match = /^[0-9a-f]+\s+refs\/tags\/(v\d+\.\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?)(?:\^\{\})?$/.exec(line);
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
      const nested = filePath.slice('.skilled/'.length).includes('/');
      if (!filePath.startsWith('.skilled/') || nested) continue;
      selected.set(filePath, entry);
    } else if (filePath.startsWith(prefix)) {
      const children = unit.childPrefixes || [];
      if (children.some((childPrefix) => filePath.startsWith(childPrefix + '/'))) continue;
      selected.set(filePath, entry);
    }
  }
  return selected;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. PURE UNIT AND FILE CLASSIFICATION
// ─────────────────────────────────────────────────────────────────────────────

// The one identity of a unit: a skill hub may share its name with a top-level
// directory such as hooks, so a name alone is not unique.
function unitKey(unit) {
  return unit.kind + ':' + unit.name;
}

function parseUnitKey(value) {
  const separator = typeof value === 'string' ? value.indexOf(':') : -1;
  if (separator < 0 || !UNIT_KINDS.includes(value.slice(0, separator))) return null;
  return { kind: value.slice(0, separator), name: value.slice(separator + 1) };
}

function ambiguityError(subject, units, remedy) {
  const keys = units.map(unitKey).sort();
  const hint = remedy === OPTION_REMEDY ? remedy + keys[0] : remedy;
  return new Error(subject + ' is ambiguous: it names ' + keys.join(' and ') + '; ' + hint);
}

// The units a reference names: a kind:name key names at most one, and a plain
// name may stand for a unit only when no other unit shares it.
function matchUnitRef(ref, units, remedy, usage = false) {
  if (parseUnitKey(ref)) return units.filter((unit) => unitKey(unit) === ref);
  const named = units.filter((unit) => unit.name === ref);
  if (named.length > 1) {
    const error = ambiguityError('unit name ' + ref, named, remedy);
    throw usage ? Object.assign(error, { usage: true }) : error;
  }
  return named;
}

function enumerateUnits(inputPaths) {
  const rawPaths = inputPaths.map((entry) => (typeof entry === 'string' ? entry : entry.path));
  // The release directory holds engine records and run state, never framework content.
  const paths = [...new Set(rawPaths)]
    .filter((filePath) => typeof filePath === 'string' && filePath.startsWith('.skilled/')
      && !filePath.startsWith(RELEASE_DIR + '/'));
  // Keyed by kind and name: a skill hub may share its name with a top-level
  // directory such as hooks, and neither may hide the other.
  const units = new Map();
  const addUnit = (unit) => units.set(unitKey(unit), unit);
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
      addUnit({ name: '(root)', prefix: '.skilled', kind: 'root' });
      continue;
    }
    if (parts[0] === 'skills' && parts.length >= 2) {
      const skillPath = parts.slice(1).join('/');
      const root = skillRootList.find((candidate) => (
        skillPath === candidate || skillPath.startsWith(candidate + '/')
      ));
      const name = root || parts[1];
      addUnit({ name, prefix: 'skills/' + name, kind: 'skill' });
      continue;
    }
    if (parts[0] === 'commands' && parts.length >= 2) {
      const name = 'commands/' + parts[1];
      addUnit({ name, prefix: 'commands/' + parts[1], kind: 'command' });
      continue;
    }
    addUnit({ name: parts[0], prefix: parts[0], kind: 'directory' });
  }
  const result = [...units.values()]
    .sort((a, b) => a.name.localeCompare(b.name) || a.kind.localeCompare(b.kind));
  return result.map((unit) => ({
    ...unit,
    key: unitKey(unit),
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

// Record-base and base inference must agree on what nearest means.
function unitDistance(localEntries, releaseEntries) {
  const paths = new Set([...localEntries.keys(), ...releaseEntries.keys()]);
  let distance = 0;
  for (const filePath of paths) {
    if (!sameState(localEntries.get(filePath), releaseEntries.get(filePath))) distance += 1;
  }
  return distance;
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
  const edits = [...localEdits, ...releaseEdits].sort((a, b) => b.start - a.start || b.end - a.end);
  for (const edit of edits) {
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
  const wanted = [...new Set(scope.split(',').map((name) => name.trim()).filter(Boolean))];
  if (!wanted.length) throw usageError('--scope must be all or a comma-separated unit list');
  const selected = new Set();
  const unknown = [];
  for (const ref of wanted) {
    const matches = matchUnitRef(ref, units, OPTION_REMEDY, true);
    if (!matches.length) unknown.push(ref);
    for (const unit of matches) selected.add(unitKey(unit));
  }
  if (unknown.length) throw usageError('unknown scope unit(s): ' + unknown.join(', '));
  return units.filter((unit) => selected.has(unitKey(unit)));
}

function generatedArtifact(filePath) {
  return GENERATED_ARTIFACTS.find((artifact) => artifact.pattern.test(filePath)) || null;
}

function jsonWithoutDerived(bytes) {
  if (!bytes) return null;
  try {
    const document = JSON.parse(Buffer.from(bytes).toString('utf8'));
    if (!document || typeof document !== 'object' || Array.isArray(document)) return null;
    const { derived, ...authored } = document;
    return JSON.stringify(authored);
  } catch {
    return null;
  }
}

// Reclassify a differing file that only a generator changed. Returns null when
// the generic class stands: an authored edit stays local-only or a conflict.
// Content is read only for the derived-block rule, so a whole-file artifact
// costs no extra git process.
function regeneratedClass(artifact, base, local, release, classification, contentOf) {
  if (!artifact || !local) return null;
  if (!['local-only', 'conflict'].includes(classification.class)) return null;
  const marked = { class: 'generated', conflictKind: null, generator: artifact.generator };
  if (artifact.scope === 'file') {
    if (classification.class === 'local-only' || release) return marked;
    return null;
  }
  if (!base) return null;
  const baseAuthored = jsonWithoutDerived(contentOf(base));
  if (baseAuthored === null || baseAuthored !== jsonWithoutDerived(contentOf(local))) return null;
  if (!release) return null;
  const releaseAuthored = jsonWithoutDerived(contentOf(release));
  if (releaseAuthored === null) return null;
  if (releaseAuthored === baseAuthored) return marked;
  // The release changed authored fields while the local change stayed inside
  // the derived block: take the release bytes, then regenerate the block.
  return {
    class: 'take-release',
    conflictKind: null,
    regenerate: true,
    generator: artifact.generator,
  };
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

// base.json is a shared tracked file, and git reads a value that starts with a dash
// as an option.
function persistedRemote(repo) {
  const base = loadJson(safeResolve(repo, BASE_FILE), {});
  const remote = base && base.remote;
  if (typeof remote !== 'string' || !remote) return null;
  if (remote.startsWith('-')) {
    throw new Error('base.json remote must name a remote or a repository URL, not an option: '
      + remote);
  }
  return remote;
}

function releaseContext(repo, options) {
  const head = git(repo, ['rev-parse', 'HEAD']).trim();
  const accepts = acceptsTag(options.includePrerelease);
  const localTags = tagNames(repo).filter(accepts);
  const fetchedUpstream = options.offline
    ? { known: false, tags: [], error: 'offline mode' }
    : remoteTags(repo, options.remote);
  const upstream = { ...fetchedUpstream, tags: fetchedUpstream.tags.filter(accepts) };
  const localLatest = latestTag(localTags, options.includePrerelease);
  const upstreamLatest = upstream.known
    ? latestTag(upstream.tags, options.includePrerelease)
    : null;
  const upstreamError = upstream.known && !upstreamLatest
    ? 'remote ' + options.remote + ' lists no '
      + (options.includePrerelease ? '' : 'stable ')
      + 'vN.N.N.N release tags, so name the framework repository with --remote'
    : upstream.error;
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
    localLatest,
    upstream: {
      status: upstream.known && upstreamLatest ? 'known' : 'unknown',
      latest: upstreamLatest || 'unknown',
      error: upstreamError,
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

// Base evidence in order of strength: a recorded release whose unit tree still
// matches, the newest release tag in HEAD's ancestry, then the release tag whose
// unit tree is nearest the local one. Inference compares upstream-only tags too,
// so without --offline it may fetch their commits (a vendored tree has no tags).
function baseForUnit(repo, unit, context, recorded, options) {
  const record = recorded[unitKey(unit)];
  if (isReleaseRecord(record)) {
    const commit = tagCommit(
      repo, record.release, options.remote, !options.offline, context.commits,
    );
    if (commit) {
      const files = entriesForUnit(commitFiles(repo, commit), unit);
      const tree = unitTreeFingerprint(files);
      if (!record.tree) {
        return { source: 'recorded-unverified', release: record.release, commit, files };
      }
      if (record.tree === tree) {
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
    const distance = unitDistance(local, files);
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
        const content = result.error.stdout || conflictText(local.content, release.content);
        return { kind: 'conflicting', content };
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
  const merged = mergeWithGitOrText(
    repo, withContent(base), withContent(local), withContent(release),
  );
  return { ...detailed, ...merged };
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
  const changed = classes.filter((kind) => kind !== 'same' && kind !== 'generated');
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

// A path that enumerates to the named unit, for a recorded unit no tree holds.
function isReleaseRecord(record) {
  if (!record || typeof record.release !== 'string') return false;
  return Boolean(parseVersion(record.release));
}

function syntheticPathForUnit(name, kind) {
  if (kind === 'root') return '.skilled/.release-unit-placeholder';
  if (kind === 'directory' || kind === 'command') {
    return '.skilled/' + name + '/.release-unit-placeholder';
  }
  return '.skilled/skills/' + name + '/SKILL.md';
}

// Legacy name-only records predate kinds; read without a matching unit, such a
// name is a skill unless it is the root or a command family.
function legacyKind(name) {
  if (name === '(root)') return 'root';
  return name.startsWith('commands/') ? 'command' : 'skill';
}

// Rewrites base.json unit records to kind:name keys. A name-only key from an
// older version is the unique unit with that name in `units`; it is dropped
// when every unit it could name is being rewritten now, as record-base does.
function normalizeBaseUnits(records, units, rewritten = new Set()) {
  const result = {};
  const legacy = [];
  for (const [key, record] of Object.entries(records || {})) {
    if (parseUnitKey(key)) result[key] = record;
    else legacy.push([key, record]);
  }
  for (const [name, record] of legacy) {
    const named = units.filter((unit) => unit.name === name);
    if (named.length && named.every((unit) => rewritten.has(unitKey(unit)))) continue;
    if (named.length > 1) {
      throw ambiguityError('base.json record ' + name, named, RECORD_BASE_REMEDY);
    }
    const key = named.length ? unitKey(named[0]) : unitKey({ name, kind: legacyKind(name) });
    if (!(key in result)) result[key] = record;
  }
  return result;
}

function buildReport(repo, options) {
  const context = releaseContext(repo, options);
  const recordedRaw = loadJson(path.join(repo, BASE_FILE), { units: {} }).units || {};
  const treePaths = [
    ...context.headMap.keys(),
    ...context.ancestryMap.keys(),
    ...context.localMap.keys(),
    ...context.targetMap.keys(),
  ];
  const treeUnits = enumerateUnits(treePaths);
  const releaseFiles = new Map();
  const filesAtRelease = (release) => {
    if (!releaseFiles.has(release)) {
      const commit = tagCommit(repo, release, options.remote, !options.offline, context.commits);
      releaseFiles.set(release, commit ? commitFiles(repo, commit) : new Map());
    }
    return releaseFiles.get(release);
  };
  // A legacy name-only record that no current tree holds may still name a unit
  // of the release it recorded.
  const legacyUniverse = [...treeUnits];
  for (const [name, record] of Object.entries(recordedRaw)) {
    if (parseUnitKey(name) || treeUnits.some((unit) => unit.name === name)) continue;
    if (!isReleaseRecord(record)) continue;
    const historical = enumerateUnits([...filesAtRelease(record.release).keys()]);
    legacyUniverse.push(...historical.filter((unit) => unit.name === name));
  }
  const recorded = normalizeBaseUnits(recordedRaw, legacyUniverse);
  const recordedPaths = [];
  for (const [key, record] of Object.entries(recorded)) {
    const matches = (unit) => unitKey(unit) === key;
    if (isReleaseRecord(record)) {
      const historicalFiles = filesAtRelease(record.release);
      const historicalUnit = enumerateUnits([...historicalFiles.keys()]).find(matches);
      if (historicalUnit) {
        recordedPaths.push(...entriesForUnit(historicalFiles, historicalUnit).keys());
        continue;
      }
    }
    if (!treeUnits.some(matches)) {
      const { kind, name } = parseUnitKey(key);
      recordedPaths.push(syntheticPathForUnit(name, kind));
    }
  }
  const unitPaths = new Set([...treePaths, ...recordedPaths]);
  const units = applyScope(enumerateUnits([...unitPaths]), options.scope);
  const ledger = ledgerEntries(repo);
  const reports = [];
  const globalFiles = [];
  const presentLocalUnits = new Set();
  for (const unit of units) {
    const base = baseForUnit(repo, unit, context, recorded, options);
    const baseFiles = base.files;
    const localUnit = entriesForUnit(context.localMap, unit);
    if (hasPresentEntry(localUnit)) presentLocalUnits.add(unitKey(unit));
    const releaseUnit = entriesForUnit(context.targetMap, unit);
    const paths = [...new Set([...baseFiles.keys(), ...localUnit.keys(), ...releaseUnit.keys()])]
      .sort();
    const fileReports = [];
    for (const filePath of paths) {
      const local = localUnit.get(filePath) || null;
      const baseEntry = baseFiles.get(filePath) || null;
      const releaseEntry = releaseUnit.get(filePath) || null;
      const generic = classifyDetailed(
        repo,
        baseEntry,
        local,
        releaseEntry,
      );
      const artifact = generic.class === 'same' ? null : generatedArtifact(filePath);
      const contentOf = (entry) => entry.content || blobBytes(repo, entry);
      const classification = (artifact
        && regeneratedClass(artifact, baseEntry, local, releaseEntry, generic, contentOf))
        || generic;
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
        unit: unitKey(unit),
        ...summary,
        base: baseEntry && { mode: baseEntry.mode, blob: baseEntry.blob },
        local: local && { mode: local.mode, blob: local.blob },
        release: releaseEntry && { mode: releaseEntry.mode, blob: releaseEntry.blob },
      };
      fileReports.push(report);
      globalFiles.push(report);
    }
    let status = unitStatus(fileReports, base, localUnit, releaseUnit);
    if (base.release && context.release && !['current', 'local', 'blocked'].includes(status)
      && compareVersions(context.release, base.release) < 0) {
      status = 'downgrade';
    }
    const regenerate = fileReports
      .filter((file) => file.class === 'generated' || file.regenerate)
      .map((file) => ({ path: file.path, generator: file.generator }));
    // A release that deletes a changelog has no entry to show for it.
    const changelogs = fileReports
      .filter((file) => /(^|\/)(?:changelog|changelogs)(?:\/|\.|$)/i.test(file.path)
        && file.class === 'take-release' && file.release)
      .map((file) => ({
        path: file.path,
        content: blobBytes(repo, releaseUnit.get(file.path)).toString('utf8'),
      }));
    reports.push({
      key: unitKey(unit),
      name: unit.name,
      prefix: unit.prefix,
      kind: unit.kind,
      status,
      baseSource: base.source,
      baseRelease: base.release,
      baseTree: unitTreeFingerprint(baseFiles),
      releaseTree: unitTreeFingerprint(releaseUnit),
      classCounts: countClasses(fileReports),
      regenerate,
      files: fileReports,
      changelogs,
    });
  }
  const upstreamKnown = context.upstream.status === 'known';
  const checkout = releasePosition(repo, context.head, context.releaseCommit);
  const dirty = git(repo, ['status', '--porcelain']).trim().length > 0;
  const updateStatuses = ['conflict', 'customized', 'update', 'new', 'removed'];
  const offersUpdate = reports.some((unit) => updateStatuses.includes(unit.status));
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
  const unrecorded = reports.filter((unit) => presentLocalUnits.has(unit.key)
    && ['inferred', 'none', 'recorded-unverified'].includes(unit.baseSource));
  const remoteFlag = options.remoteSource === 'flag'
    ? ' --remote ' + shellQuote(options.remote)
    : '';
  const baseRecording = {
    needed: unrecorded.length > 0,
    units: unrecorded.map((unit) => unit.key),
    action: unrecorded.length
      ? SCRIPT_COMMAND + ' record-base --release <installed-release>' + remoteFlag
      : null,
  };
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
    baseRecording,
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

// Local state comes from the worktree, and an uncommitted or untracked file's
// blob id is in no object store, so its bytes are read from disk.
function withLocalContent(repo, file) {
  if (!file.local) return null;
  const entry = worktreeEntry(repo, file.path);
  if (!entry || !entry.content || entry.blob !== file.local.blob) {
    throw new Error('local file changed while align was reading it: ' + file.path
      + '; run align again');
  }
  return { ...file.local, content: entry.content };
}

function entryBytes(repo, entry) {
  return entry.content || blobBytes(repo, entry);
}

function mergeResultForReport(repo, file, local) {
  if (file.class !== 'conflict') return null;
  if (!['mergeable', 'conflicting'].includes(file.conflictKind)) return null;
  const release = file.release && { ...file.release, content: blobBytes(repo, file.release) };
  if (!local || !release) return null;
  if (!file.base) {
    return { kind: 'conflicting', content: conflictText(local.content, release.content) };
  }
  const base = { ...file.base, content: blobBytes(repo, file.base) };
  return mergeWithGitOrText(repo, base, local, release);
}

function recommendation(file, unit) {
  if (file.conflictKind === 'mergeable') return 'merge';
  if (file.conflictKind === 'conflicting') return 'use-proposal';
  if (['deleted-locally', 'deleted-in-release'].includes(file.conflictKind)) return 'keep-local';
  if (file.class === 'local-only' || file.class === 'kept-local') return 'keep-local';
  if (file.class === 'take-release' && unit.status === 'customized') return 'adopt-release';
  return null;
}

function evidenceDiff(repo, before, after, beforeLabel, afterLabel) {
  if (sameState(before, after)) return 'No content or mode changes.';
  if (before && after && before.mode === '120000' && after.mode === '120000') {
    const oldTarget = entryBytes(repo, before).toString('utf8');
    const newTarget = entryBytes(repo, after).toString('utf8');
    return [
      '--- ' + beforeLabel + ' symlink target',
      '+++ ' + afterLabel + ' symlink target',
      '-' + oldTarget,
      '+' + newTarget,
    ].join('\n');
  }
  const beforeBytes = before ? entryBytes(repo, before) : Buffer.alloc(0);
  const afterBytes = after ? entryBytes(repo, after) : Buffer.alloc(0);
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

function evidenceCard(repo, file, local, unit, merge) {
  const changelogs = unit.changelogs;
  const changelogRationale = changelogs.length
    ? changelogs.map((entry) => entry.path + '\n' + entry.content).join('\n\n')
    : 'no added changelog entry for this unit';
  return [
    '# Release evidence: ' + file.path,
    '',
    '- Unit: ' + unit.key,
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
    evidenceDiff(repo, file.base, local, 'base', 'local'),
    '\x60\x60\x60',
    '',
  ].join('\n');
}

function makePlan(repo, options) {
  const report = buildReport(repo, options);
  const runDir = path.resolve(repo, options.out || defaultRunDir(repo, report.release));
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
    files: report.files.filter((file) => file.class !== 'same'),
  };
  const decisions = { schemaVersion: 1, release: report.release, files: {}, deferredUnits: [] };
  const evidence = [];
  const proposals = [];
  for (const unit of report.units) {
    for (const file of unit.files) {
      const shouldExplain = file.class !== 'same' && file.class !== 'generated'
        && ['customized', 'conflict', 'removed'].includes(unit.status);
      if (file.class === 'take-release' && unit.status === 'customized') {
        decisions.files[file.path] = { decision: 'adopt-release', source: 'prefilled' };
      }
      if (!shouldExplain) continue;
      const local = withLocalContent(repo, file);
      const merge = mergeResultForReport(repo, file, local);
      evidence.push({
        path: path.join('evidence', runRelativePath(file.path) + '.md'),
        content: evidenceCard(repo, file, local, unit, merge),
      });
      if (merge) {
        const proposalFile = path.join('proposals', runRelativePath(file.path));
        proposals.push({ path: proposalFile, content: merge.content });
      }
    }
  }
  plan.evidenceFiles = evidence.map((entry) => entry.path);
  plan.proposalFiles = proposals.map((entry) => entry.path);
  plan.externalRunDir = !withinRoot(repo, runDir);
  return { plan, decisions, evidence, proposals };
}

// The parent is resolved so a symlinked ancestor (macOS /var, say) still yields
// a real child path; the run directory itself must not be a symlink.
function assertRunDirectory(runDir) {
  const requested = path.resolve(runDir);
  if (!path.basename(requested)) throw new Error('run directory path is invalid: ' + requested);
  const parent = path.dirname(requested);
  fs.mkdirSync(parent, { recursive: true });
  const resolved = path.join(fs.realpathSync(parent), path.basename(requested));
  if (fs.existsSync(resolved)) {
    const stats = fs.lstatSync(resolved);
    if (stats.isSymbolicLink() || !stats.isDirectory()) {
      throw new Error('run path must be a real directory');
    }
    if (fs.readdirSync(resolved).length) {
      throw new Error('run directory already exists and is not empty: ' + resolved);
    }
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
  if (stats.isSymbolicLink() || !stats.isFile()) {
    throw new Error('run artifact must be a regular file: ' + relative);
  }
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
    result.plan.runDir = runDir;
    result.plan.externalRunDir = !withinRoot(repo, runDir);
    for (const entry of result.evidence) writeRunFile(runDir, entry.path, entry.content);
    for (const entry of result.proposals) writeRunFile(runDir, entry.path, entry.content);
    writeRunFile(runDir, 'plan.json', JSON.stringify(result.plan, null, 2) + '\n');
    writeRunFile(runDir, 'decisions.json', JSON.stringify(result.decisions, null, 2) + '\n');
  }
  return { ...result.plan, dryRun: Boolean(options.dryRun) };
}

function loadRun(runPath, repo) {
  const runDir = path.resolve(repo, runPath);
  let stats;
  try {
    stats = fs.lstatSync(runDir);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    throw new Error('run directory not found: ' + runDir
      + '; pass the runDir that align or apply reported, or run align to create one');
  }
  if (stats.isSymbolicLink() || !stats.isDirectory()) {
    throw new Error('run path must be a real directory');
  }
  const plan = readRunJson(runDir, 'plan.json', null);
  if (!plan) {
    throw new Error('run directory has no plan.json: ' + runDir
      + '; run align to create an alignment run');
  }
  const emptyDecisions = { schemaVersion: 1, files: {}, deferredUnits: [] };
  const run = { runDir, plan, decisions: readRunJson(runDir, 'decisions.json', emptyDecisions) };
  return normalizeRunUnits(run);
}

// Runs written by an older version name units without their kind. Each plan
// unit carries its kind, so a plain name is resolved to the plan unit that has
// it; a name two plan units share cannot be read and needs a new run.
function normalizeRunUnits(run) {
  const units = run.plan.units || [];
  for (const unit of units) unit.key = unitKey(unit);
  const toKey = (ref, source) => {
    const remedy = source + ' predates kind:name unit keys; run align again for a new run';
    const matches = matchUnitRef(ref, units, remedy);
    return matches.length ? unitKey(matches[0]) : ref;
  };
  for (const file of run.plan.files || []) file.unit = toKey(file.unit, 'plan.json');
  const deferred = run.decisions.deferredUnits || [];
  run.decisions.deferredUnits = deferred.map((ref) => toKey(ref, 'decisions.json'));
  return run;
}

function normalizedDecisionPath(input, plan) {
  const normalized = assertSafeRelative(input, '--path');
  const candidate = normalized.startsWith('.skilled/') ? normalized : '.skilled/' + normalized;
  if (!plan.files.some((file) => file.path === candidate)) {
    throw new Error('path is not a planned file: ' + input);
  }
  return candidate;
}

// Align writes a proposal only for a mergeable or conflicting text file.
function readProposal(run, filePath) {
  try {
    return readRunFile(run.runDir, path.join('proposals', runRelativePath(filePath)));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    throw new Error('no proposal for ' + filePath + ' in ' + run.runDir
      + '; align writes one only for a mergeable or conflicting text file,'
      + ' so decide adopt-release or keep-local for it');
  }
}

function proposeDecision(run, filePath, decision) {
  const file = run.plan.files.find((candidate) => candidate.path === filePath);
  if (!DECISIONS.has(decision)) {
    throw new Error('unsupported decision: ' + decision
      + '; use one of ' + [...DECISIONS].join(', '));
  }
  const adoptable = file.class === 'take-release'
    || (file.class === 'conflict' && ADOPTABLE_CONFLICTS.has(file.conflictKind));
  if (decision === 'adopt-release' && !adoptable) {
    throw new Error('adopt-release is allowed only for take-release files and for binary'
      + ' or deleted conflicts; resolve a text conflict with merge or use-proposal');
  }
  if (decision === 'merge' && file.conflictKind !== 'mergeable') {
    throw new Error('merge is allowed only for mergeable files');
  }
  if (decision === 'use-proposal' || decision === 'merge') {
    const bytes = readProposal(run, filePath);
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
  writeRunFileReplacement(run.runDir, 'decisions.json', jsonBytes(run.decisions));
  return { path: filePath, decision, runDir: run.runDir };
}

function deferUnit(run, ref) {
  const [unit] = matchUnitRef(ref, run.plan.units, OPTION_REMEDY);
  if (!unit) throw new Error('unit is not in the alignment plan: ' + ref);
  const key = unitKey(unit);
  const deferred = new Set(run.decisions.deferredUnits || []);
  deferred.add(key);
  run.decisions.deferredUnits = [...deferred].sort();
  writeRunFileReplacement(run.runDir, 'decisions.json', jsonBytes(run.decisions));
  return { unit: key, deferred: true, runDir: run.runDir };
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. APPLY AND ROLLBACK
// ─────────────────────────────────────────────────────────────────────────────

function currentState(repo, filePath) {
  const entry = worktreeEntry(repo, filePath);
  if (!entry || entry.directory || entry.unsupported) return null;
  return { mode: entry.mode, blob: entry.blob };
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
  const { mode, blob } = file.release;
  return { mode, blob, content: blobBytes(repo, file.release) };
}

function decisionTarget(repo, run, file, record) {
  const decision = typeof record === 'string' ? record : record.decision;
  if (decision === 'adopt-release') return targetForRelease(repo, file);
  if (decision === 'keep-local') return undefined;
  const content = readProposal(run, file.path);
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

// The newest run apply may reuse without --decisions: an alignment run made at
// the current HEAD that no apply has consumed. Any other run is stale.
function latestRun(repo, head) {
  const directory = path.join(repo, RUNS_DIR);
  if (!fs.existsSync(directory)) return null;
  const madeAtHead = (runDir) => {
    try {
      return JSON.parse(fs.readFileSync(path.join(runDir, 'plan.json'), 'utf8')).head === head;
    } catch {
      return false;
    }
  };
  const runs = fs.readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(directory, entry.name))
    .filter((runDir) => !fs.existsSync(path.join(runDir, 'rollback.json')) && madeAtHead(runDir))
    .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);
  return runs.length ? runs[0] : null;
}

// With no alignment run, apply plans from the current check. Such a plan holds
// no decisions, so it can write only update and new units; their take-release
// files equal their base by definition, and assertPlanFresh re-reads each one
// under the lock, so a file edited since the check is refused, not overwritten.
function planWithoutRun(repo, options) {
  const { plan } = makePlan(repo, { ...options, out: undefined });
  return {
    runDir: plan.runDir,
    plan,
    decisions: { schemaVersion: 1, files: {}, deferredUnits: [] },
    withoutRun: true,
  };
}

function resolveApplyRun(repo, options) {
  const decisionsPath = options.decisions;
  if (!decisionsPath) {
    const latest = latestRun(repo, git(repo, ['rev-parse', 'HEAD']).trim());
    if (!latest) return planWithoutRun(repo, options);
    const run = loadRun(latest, repo);
    const hasOperatorDecision = Object.values(run.decisions.files || {}).some(isOperatorDecision);
    const hasDeferredUnit = (run.decisions.deferredUnits || []).length > 0;
    if (hasOperatorDecision || hasDeferredUnit) {
      // Reusing a decided run discards choices, can write a deferred unit, and uses up the run.
      throw new Error('the newest alignment run at this HEAD holds operator decisions: ' + latest
        + '. Apply them with --decisions ' + path.join(latest, 'decisions.json')
        + ', or run align for a new plan');
    }
    run.decisions = { schemaVersion: 1, files: {}, deferredUnits: [] };
    return run;
  }
  const absolutePath = path.resolve(repo, decisionsPath);
  const runDir = path.dirname(absolutePath);
  if (!fs.existsSync(path.join(runDir, 'plan.json'))) {
    throw new Error('a decisions file needs its alignment run: no plan.json beside ' + absolutePath
      + '; run align first and decide inside that run');
  }
  const run = loadRun(runDir, repo);
  run.decisions = readRunJson(runDir, path.basename(absolutePath), null);
  if (!run.decisions) throw new Error('decision file is missing or invalid');
  return normalizeRunUnits(run);
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

function unitContains(unit, filePath) {
  if (typeof unit.prefix !== 'string') return false;
  if (unit.prefix === '.skilled') return /^\.skilled\/[^/]+$/.test(filePath);
  return filePath.startsWith('.skilled/' + unit.prefix + '/');
}

// The most specific planned unit holding a path, so a child skill's files never
// count as its hub's.
function owningUnit(units, filePath) {
  const holders = units.filter((unit) => unitContains(unit, filePath));
  return holders.sort((a, b) => b.prefix.length - a.prefix.length)[0] || null;
}

// SEC: a plan is an editable file in the run directory, so a path it names is
// written only when it lies inside the unit it is planned under.
function uniqueUnits(units) {
  return [...new Map(units.map((unit) => [unitKey(unit), unit])).values()];
}

function assertPlannedPath(units, file) {
  const normalized = assertSafeRelative(file.path, 'plan path');
  const owner = owningUnit(units, normalized);
  if (normalized !== file.path || !owner || unitKey(owner) !== file.unit) {
    throw new Error('plan path is outside unit ' + file.unit + ': ' + file.path
      + '; refusing to write it, run align again for a clean plan');
  }
}

function shellQuote(value) {
  return /^[\w./@:+-]+$/.test(value) ? value : "'" + value.replace(/'/g, "'\\''") + "'";
}

function rollbackCommand(repo, runDir) {
  return SCRIPT_COMMAND + ' rollback --repo ' + shellQuote(repo) + ' --run ' + shellQuote(runDir);
}

function assertPlanFresh(repo, run, paths) {
  const { releaseCommit } = run.plan;
  const releaseFiles = releaseCommit ? commitFiles(repo, releaseCommit) : new Map();
  const selected = paths ? new Set(paths) : new Set(run.plan.files.map((file) => file.path));
  for (const file of run.plan.files.filter((entry) => selected.has(entry.path))) {
    const localEntry = worktreeEntry(repo, file.path);
    const local = localEntry && !localEntry.directory && !localEntry.unsupported
      ? { mode: localEntry.mode, blob: localEntry.blob }
      : null;
    const plannedLocal = file.local ? { mode: file.local.mode, blob: file.local.blob } : null;
    if (!sameState(local, plannedLocal)) {
      throw new Error('drift since align: local blob changed for ' + file.path);
    }
    const actualRelease = releaseFiles.get(file.path) || null;
    if (!sameState(actualRelease, file.release)) {
      throw new Error('drift since align: release blob changed for ' + file.path);
    }
  }
}

function planDigest(run, prepared) {
  // The digest covers what the operator approved. Release records follow from
  // that set, and the run directory name carries a timestamp.
  const state = (entry) => entry ? { mode: entry.mode, blob: entry.blob } : null;
  const plan = {
    release: run.plan.release,
    releaseCommit: run.plan.releaseCommit || null,
    writes: prepared.writes
      .map((write) => write.metadata
        ? { path: write.path }
        : { path: write.path, before: state(write.before), after: state(write.after) })
      .sort((a, b) => a.path.localeCompare(b.path)),
    appliedUnits: [...prepared.appliedUnits].sort(),
    skippedUnits: prepared.skippedUnits
      .map(({ unit, reason }) => [unit, reason])
      .sort(([unitA, reasonA], [unitB, reasonB]) => (
        unitA.localeCompare(unitB) || reasonA.localeCompare(reasonB)
      )),
  };
  return crypto.createHash('sha256').update(JSON.stringify(plan)).digest('hex');
}

// A prefilled record is the engine's own suggestion, not the operator's consent.
function isOperatorDecision(record) {
  if (typeof record === 'string') return record.length > 0;
  return Boolean(record && typeof record.decision === 'string' && record.source !== 'prefilled');
}

function dirtyTargetError(filePath) {
  const message = 'target has staged or unstaged changes against HEAD: ' + filePath;
  if (![BASE_FILE, DIVERGENCE_FILE].includes(filePath)) return new Error(message);
  return new Error(message
    + ', a release record that an earlier apply or record-base wrote. '
    + 'Commit it together with the files that apply changed, then run apply again');
}

function prepareWrites(repo, run, scope) {
  const headFiles = commitFiles(repo, 'HEAD');
  const deferred = new Set(run.decisions.deferredUnits || []);
  const unitMap = new Map(run.plan.units.map((unit) => [unitKey(unit), unit]));
  const selectedUnits = applyScope(run.plan.units, scope);
  const writes = [];
  const ledgerAdditions = [];
  const appliedUnits = new Set();
  const skippedUnits = [];
  for (const unit of selectedUnits) {
    const key = unitKey(unit);
    const fileEntries = run.plan.files.filter((file) => file.unit === key);
    if (deferred.has(key)) {
      skippedUnits.push({ unit: key, reason: 'deferred' });
      continue;
    }
    if (unit.status === 'downgrade') {
      skippedUnits.push({ unit: key, reason: 'downgrade' });
      continue;
    }
    if (['current', 'local', 'unknown', 'blocked'].includes(unit.status)) continue;
    if (['update', 'new'].includes(unit.status)) {
      for (const file of fileEntries) {
        if (file.class === 'take-release') {
          const after = targetForRelease(repo, file);
          writes.push({ path: file.path, after, file, decision: 'adopt-release' });
        }
      }
      appliedUnits.add(key);
      continue;
    }
    const decided = run.decisions.files || {};
    const chosen = fileEntries.filter((file) => isOperatorDecision(decided[file.path]));
    if (!chosen.length) {
      skippedUnits.push({ unit: key, reason: 'no decisions' });
      continue;
    }
    const undecided = fileEntries
      .filter((file) => ['take-release', 'conflict'].includes(file.class)
        && !isOperatorDecision(decided[file.path]))
      .map((file) => file.path);
    if (undecided.length) {
      // Skipping the whole unit avoids advancing its base past an unwritten release change.
      skippedUnits.push({ unit: key, reason: 'undecided files', paths: undecided });
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
          unit: key,
          path: file.path,
          release: run.plan.release,
          localBlob: decision === 'keep-local'
            ? (file.local && file.local.blob)
            : target && target.blob,
          releaseBlob: file.release ? file.release.blob : null,
          decision,
          decidedAt: (typeof record === 'object' && record.decidedAt) || new Date().toISOString(),
        });
      }
    }
    appliedUnits.add(key);
  }
  for (const write of writes) assertPlannedPath(run.plan.units, write.file);
  const oldBasePath = safeResolve(repo, BASE_FILE);
  const oldBase = loadJson(oldBasePath, { schemaVersion: 1, units: {} });
  // Legacy name-only records resolve against every unit the checkout or the
  // plan knows, so a record for a unit outside this plan keeps its own kind.
  const knownUnits = [...enumerateUnits([...headFiles.keys()]), ...run.plan.units];
  const baseUnits = normalizeBaseUnits(oldBase.units, uniqueUnits(knownUnits));
  const newBase = { schemaVersion: 1 };
  if (typeof oldBase.remote === 'string') newBase.remote = oldBase.remote;
  newBase.units = baseUnits;
  for (const key of appliedUnits) {
    const unit = unitMap.get(key);
    if (unit) newBase.units[key] = { release: run.plan.release, tree: unit.releaseTree };
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
      entries: [
        ...(Array.isArray(existingLedger.entries) ? existingLedger.entries : []),
        ...ledgerAdditions,
      ],
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
      throw dirtyTargetError(filePath);
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

function processRunning(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return error.code === 'EPERM';
  }
}

function readLockState(repo) {
  const lockPath = safeResolve(repo, LOCK_FILE);
  if (!fs.existsSync(lockPath)) return { state: 'absent', owner: null };
  let owner;
  try {
    owner = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') return { state: 'absent', owner: null };
    return { state: 'unknown', owner: null };
  }
  if (!owner || typeof owner !== 'object' || Array.isArray(owner)
    || !Number.isInteger(owner.pid) || owner.pid <= 0) {
    return { state: 'unknown', owner };
  }
  return { state: processRunning(owner.pid) ? 'live' : 'stale', owner };
}

function lockConflictError(repo) {
  const prefix = 'apply lock already exists: ' + LOCK_FILE;
  const { state, owner } = readLockState(repo);
  if (state === 'live') {
    const command = typeof owner.command === 'string' && owner.command
      ? owner.command
      : 'unknown command';
    return new Error(prefix + ', held by running process ' + owner.pid + ' (' + command
      + '), so wait for it to finish');
  }
  if (state === 'stale') {
    const command = typeof owner.command === 'string' && owner.command
      ? owner.command
      : 'unknown command';
    const startedAt = typeof owner.startedAt === 'string' && owner.startedAt
      ? owner.startedAt
      : 'unknown start time';
    let message = prefix + ', and it is stale because process ' + owner.pid + ' (' + command
      + ', started ' + startedAt + ') is no longer running. Clear it with ' + SCRIPT_COMMAND
      + ' unlock';
    if (typeof owner.runDir === 'string' && owner.runDir
      && fs.existsSync(path.join(path.resolve(repo, owner.runDir), 'rollback.json'))) {
      message += ', then restore the interrupted run with ' + rollbackCommand(repo, owner.runDir);
    }
    return new Error(message);
  }
  return new Error(prefix + ', and it has no readable owner, so confirm that no apply, rollback'
    + ' or record-base is running before removing it by hand');
}

function acquireLock(repo, owner) {
  const lockPath = safeResolve(repo, LOCK_FILE);
  fs.mkdirSync(path.dirname(lockPath), { recursive: true });
  let descriptor;
  try {
    descriptor = fs.openSync(lockPath, 'wx', 0o600);
  } catch (error) {
    if (error.code === 'EEXIST') throw lockConflictError(repo);
    throw error;
  }
  try {
    const lockOwner = {
      pid: process.pid,
      startedAt: new Date().toISOString(),
      command: owner.command,
      runDir: owner.runDir || null,
    };
    fs.writeFileSync(descriptor, JSON.stringify(lockOwner) + '\n');
  } catch (error) {
    fs.closeSync(descriptor);
    fs.rmSync(lockPath, { force: true });
    throw error;
  }
  fs.closeSync(descriptor);
  return lockPath;
}

// Only a dead owner's lock is safe to remove; keep live and unreadable locks for investigation.
function unlockStale(repo, options) {
  const { state, owner } = readLockState(repo);
  const runDir = owner && typeof owner.runDir === 'string' && owner.runDir
    ? owner.runDir
    : null;
  const rollbackRecorded = runDir
    ? fs.existsSync(path.join(path.resolve(repo, runDir), 'rollback.json'))
    : null;
  const result = {
    command: 'unlock',
    dryRun: Boolean(options.dryRun),
    lock: state,
    owner,
    removable: state === 'stale',
    removed: false,
    runDir,
    rollbackRecorded,
    rollback: rollbackRecorded ? rollbackCommand(repo, runDir) : null,
  };
  if (state === 'absent' || options.dryRun) return result;
  if (state !== 'stale') throw lockConflictError(repo);
  fs.rmSync(safeResolve(repo, LOCK_FILE));
  result.removed = true;
  return result;
}

// Node skips finally on these signals, so defer them until lock cleanup, then re-raise.
// Unlock recovers from SIGKILL or power loss.
function deferSignals() {
  const signals = ['SIGINT', 'SIGTERM', 'SIGHUP'];
  let receivedSignal = null;
  const listeners = new Map();
  for (const signal of signals) {
    const listener = () => {
      if (!receivedSignal) receivedSignal = signal;
    };
    listeners.set(signal, listener);
    process.on(signal, listener);
  }
  return () => {
    setImmediate(() => {
      for (const [signal, listener] of listeners) {
        process.removeListener(signal, listener);
      }
      if (receivedSignal) process.kill(process.pid, receivedSignal);
    });
  };
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
      const mode = entry.mode === '100755' ? 0o755 : 0o644;
      fs.writeFileSync(tempPath, content, { mode, flag: 'wx' });
      fs.chmodSync(tempPath, mode);
    }
    fs.renameSync(tempPath, destination);
  } finally {
    fs.rmSync(tempPath, { force: true });
  }
}

function applyPlan(repo, options) {
  const run = resolveApplyRun(repo, options);
  if (run.plan.repo !== repo) throw new Error('alignment plan belongs to another repository');
  if (options.release && options.release !== run.plan.release) {
    throw new Error('--release does not match the alignment plan');
  }
  if (!run.withoutRun && fs.existsSync(safeResolve(run.runDir, 'rollback.json'))) {
    throw new Error('this run was already applied (rollback.json exists): ' + run.runDir
      + '; run align for a new plan, or undo this one with ' + rollbackCommand(repo, run.runDir));
  }
  if (fs.existsSync(safeResolve(repo, LOCK_FILE))) {
    throw lockConflictError(repo);
  }
  const { releaseCommit } = run.plan;
  if (releaseCommit && !gitTry(repo, ['cat-file', '-e', releaseCommit + '^{commit}']).ok) {
    throw new Error('release commit from alignment is unavailable');
  }
  const prepared = prepareWrites(repo, run, options.scope);
  assertPlanFresh(repo, run, prepared.freshnessPaths);
  for (const write of prepared.writes) {
    if (write.after && !write.after.content && write.after.blob) {
      write.after.content = blobBytes(repo, write.after);
    }
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
  const regenerate = regenerateFollowUps(run.plan, prepared.appliedUnits);
  const digest = planDigest(run, prepared);
  if (options.planDigest && options.planDigest !== digest) {
    throw new Error('plan changed since the dry-run: its digest no longer matches. '
      + 'Run apply --dry-run again and approve the new plan');
  }
  if (options.dryRun) {
    return {
      command: 'apply',
      dryRun: true,
      withoutRun: Boolean(run.withoutRun),
      release: run.plan.release,
      releaseCommit: run.plan.releaseCommit || null,
      runDir: run.withoutRun ? null : run.runDir,
      planDigest: digest,
      writes: prepared.writes.map((write) => ({
        path: write.path,
        mode: write.after && write.after.mode,
        before: write.before,
      })),
      skippedUnits: prepared.skippedUnits,
      appliedUnits: prepared.appliedUnits,
      followUps: followUps(prepared.writes, regenerate),
    };
  }
  const restoreSignals = deferSignals();
  let acquired;
  try {
    acquired = acquireLock(repo, { command: 'apply', runDir: run.runDir });
  } catch (error) {
    restoreSignals();
    throw error;
  }
  try {
    assertPlanFresh(repo, run, prepared.freshnessPaths);
    for (const write of prepared.writes) {
      if (pathDirtyAgainstHead(repo, write.path, prepared.headFiles)) {
        throw dirtyTargetError(write.path);
      }
    }
    fs.mkdirSync(path.join(repo, RELEASE_DIR), { recursive: true });
    if (run.withoutRun) {
      // The plan lives beside its rollback record so rollback works the same way.
      assertRunDirectory(run.runDir);
      writeRunFile(run.runDir, 'plan.json', JSON.stringify(run.plan, null, 2) + '\n');
    }
    writeRunFile(run.runDir, 'rollback.json', JSON.stringify(rollback, null, 2) + '\n');
    // Writes are atomic one file at a time, not as a set, so a failure part way
    // leaves a partial tree that only the recorded rollback undoes.
    let completed = 0;
    try {
      for (const write of prepared.writes) {
        writeAtomic(repo, write.path, write.after, write.after && write.after.content);
        completed += 1;
      }
    } catch (error) {
      throw new Error('apply stopped after ' + completed + ' of ' + prepared.writes.length
        + ' writes, at ' + prepared.writes[completed].path + ': ' + error.message
        + '; the checkout is partly updated, restore it with ' + rollbackCommand(repo, run.runDir));
    }
  } finally {
    try {
      fs.rmSync(acquired, { force: true });
    } finally {
      restoreSignals();
    }
  }
  return {
    command: 'apply',
    runDir: run.runDir,
    release: run.plan.release,
    planDigest: digest,
    written: prepared.writes.filter((write) => write.after).map((write) => write.path),
    added: prepared.writes
      .filter((write) => write.after && !write.before)
      .map((write) => write.path),
    deleted: prepared.writes.filter((write) => !write.after).map((write) => write.path),
    withoutRun: Boolean(run.withoutRun),
    skippedUnits: prepared.skippedUnits,
    appliedUnits: prepared.appliedUnits,
    followUps: followUps(prepared.writes, regenerate),
  };
}

// Generated files of the applied units, grouped by the generator that rewrites
// them. Apply never writes these bytes; it names who regenerates them.
function regenerateFollowUps(plan, appliedUnits) {
  const applied = new Set(appliedUnits);
  const byGenerator = new Map();
  for (const file of plan.files) {
    const regenerated = file.class === 'generated' || file.regenerate;
    if (!applied.has(file.unit) || !regenerated || !file.generator) continue;
    if (!byGenerator.has(file.generator)) byGenerator.set(file.generator, []);
    byGenerator.get(file.generator).push(file.path);
  }
  return [...byGenerator.entries()]
    .map(([generator, paths]) => ({ generator, paths: paths.sort() }))
    .sort((a, b) => a.generator.localeCompare(b.generator));
}

function followUps(writes, regenerate = []) {
  const regenerateHubs = new Set();
  let reinstallHooks = false;
  let runtimeMirrors = false;
  for (const write of writes) {
    const filePath = write.path;
    const owner = write.file && parseUnitKey(write.file.unit);
    if (owner && owner.kind === 'skill' && owner.name.includes('/')) {
      regenerateHubs.add(owner.name.split('/')[0]);
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
    regenerate,
    reinstallHooks,
    runtimeMirrors,
    rebuildDatabases: true,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. BASE RECORDING
// ─────────────────────────────────────────────────────────────────────────────

// A copied or freshly installed tree has no shared release history, so check can
// only infer its base. Recording every unit of the release it was installed from
// gives the first check `recorded` evidence instead.
function recordBase(repo, options) {
  const accepts = acceptsTag(options.includePrerelease);
  const localTags = tagNames(repo).filter(accepts);
  const release = options.release || latestTag(localTags, options.includePrerelease);
  if (!release) {
    throw new Error('no local release tag exists;'
      + ' name the release this tree was installed from with --release');
  }
  const commit = tagCommit(repo, release, options.remote, !options.offline, new Map());
  if (!commit) throw new Error('release tag could not be resolved: ' + release);
  const releaseFiles = commitFiles(repo, commit);
  const units = applyScope(enumerateUnits([...releaseFiles.keys()]), options.scope);
  if (!units.length) throw new Error('release ' + release + ' holds no .skilled units to record');
  if (!options.trustRelease) {
    const listing = options.offline
      ? { known: false, tags: [], error: 'offline mode' }
      : remoteTags(repo, options.remote);
    if (!listing.known) {
      throw new Error('cannot list release tags (' + listing.error + '), so release ' + release
        + ' cannot be checked against nearer releases. Pass --trust-release to record it unchecked');
    }
    const candidateTags = sortTags([...new Set([...localTags, ...listing.tags])].filter(accepts));
    const commits = new Map([[release, commit]]);
    const filesByTag = new Map([[release, releaseFiles]]);
    const localTree = localFiles(repo, [...releaseFiles.keys()]);
    const nearerReleases = [];
    for (const unit of units) {
      const localUnit = entriesForUnit(localTree, unit);
      const namedDistance = unitDistance(localUnit, entriesForUnit(releaseFiles, unit));
      let nearest = null;
      for (const tag of candidateTags) {
        if (tag === release) continue;
        const candidateCommit = tagCommit(repo, tag, options.remote, !options.offline, commits);
        if (!candidateCommit) continue;
        if (!filesByTag.has(tag)) filesByTag.set(tag, commitFiles(repo, candidateCommit));
        const candidateFiles = entriesForUnit(filesByTag.get(tag), unit);
        const distance = unitDistance(localUnit, candidateFiles);
        if (!nearest || distance < nearest.distance
          || distance === nearest.distance && compareVersions(tag, nearest.tag) > 0) {
          nearest = { tag, distance };
        }
      }
      if (nearest && nearest.distance < namedDistance) {
        nearerReleases.push(unitKey(unit) + ' is nearest ' + nearest.tag + ' ('
          + nearest.distance + ' files differ, against ' + namedDistance + ' from ' + release + ')');
      }
    }
    if (nearerReleases.length) {
      throw new Error('release ' + release + ' is not the nearest release to this tree: '
        + nearerReleases.join('; ') + '. Name the release this tree was installed from, or pass '
        + '--trust-release to record ' + release + ' anyway');
    }
  }
  const headFiles = commitFiles(repo, 'HEAD');
  if (pathDirtyAgainstHead(repo, BASE_FILE, headFiles)) {
    throw new Error('base manifest has staged or unstaged changes against HEAD: ' + BASE_FILE
      + '; commit or discard it before recording again');
  }
  const existing = loadJson(safeResolve(repo, BASE_FILE), { schemaVersion: 1, units: {} });
  const recording = new Set(units.map(unitKey));
  const knownUnits = uniqueUnits([
    ...enumerateUnits([...releaseFiles.keys()]),
    ...enumerateUnits([...headFiles.keys()]),
  ]);
  const nextUnits = normalizeBaseUnits(existing.units, knownUnits, recording);
  const next = { schemaVersion: 1 };
  const remote = options.remoteSource === 'flag'
    ? options.remote
    : typeof existing.remote === 'string' ? existing.remote : null;
  if (typeof remote === 'string') next.remote = remote;
  next.units = nextUnits;
  for (const unit of units) {
    next.units[unitKey(unit)] = {
      release,
      tree: unitTreeFingerprint(entriesForUnit(releaseFiles, unit)),
    };
  }
  if (readLockState(repo).state !== 'absent') throw lockConflictError(repo);
  if (!options.dryRun) {
    const restoreSignals = deferSignals();
    let acquired;
    try {
      acquired = acquireLock(repo, { command: 'record-base', runDir: null });
    } catch (error) {
      restoreSignals();
      throw error;
    }
    try {
      writeAtomic(repo, BASE_FILE, { mode: '100644' }, jsonBytes(next));
    } finally {
      try {
        fs.rmSync(acquired, { force: true });
      } finally {
        restoreSignals();
      }
    }
  }
  return {
    command: 'record-base',
    dryRun: Boolean(options.dryRun),
    verified: !options.trustRelease,
    release,
    releaseCommit: commit,
    baseFile: BASE_FILE,
    units: units.map(unitKey),
  };
}

function rollbackPlan(repo, runPath, options = {}) {
  const run = loadRun(runPath, repo);
  const rollback = readRunJson(run.runDir, 'rollback.json', null);
  if (!rollback) {
    throw new Error('this run has no rollback.json: ' + run.runDir
      + '; apply has not written from it, so there is nothing to roll back');
  }
  if (!Array.isArray(rollback.paths)) {
    throw new Error('rollback.json has no paths array: ' + run.runDir);
  }
  // SEC: rollback.json is as editable as the plan, so it may restore only the
  // release records and paths inside the plan's units.
  for (const entry of rollback.paths) {
    const allowed = [BASE_FILE, DIVERGENCE_FILE].includes(entry.path)
      || (typeof entry.path === 'string' && owningUnit(run.plan.units, entry.path));
    if (!allowed) {
      throw new Error('rollback path is outside the plan\'s units: ' + entry.path
        + '; refusing to restore it');
    }
  }
  if (options.dryRun) {
    if (readLockState(repo).state !== 'absent') throw lockConflictError(repo);
    const restored = [];
    const skipped = [];
    for (const entry of rollback.paths) {
      const current = currentState(repo, entry.path);
      if (sameState(current, entry.before) || sameState(current, entry.after)) {
        restored.push(entry.path);
      } else {
        skipped.push(entry.path);
      }
    }
    return {
      command: 'rollback', dryRun: true, runDir: run.runDir, restored, skipped, exitCode: 0,
    };
  }
  const restoreSignals = deferSignals();
  let lockPath;
  try {
    lockPath = acquireLock(repo, { command: 'rollback', runDir: run.runDir });
  } catch (error) {
    restoreSignals();
    throw error;
  }
  const restored = [];
  const skipped = [];
  try {
    for (const entry of rollback.paths) {
      const current = currentState(repo, entry.path);
      if (sameState(current, entry.before)) {
        restored.push(entry.path);
        continue;
      }
      if (!sameState(current, entry.after)) {
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
  } finally {
    try {
      fs.rmSync(lockPath, { force: true });
    } finally {
      restoreSignals();
    }
  }
  const exitCode = skipped.length ? 1 : 0;
  return { command: 'rollback', runDir: run.runDir, restored, skipped, exitCode };
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. CLI PARSING AND OUTPUT
// ─────────────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const command = argv[0];
  if (!command) throw usageError('missing subcommand');
  if (!COMMAND_OPTIONS[command]) throw usageError('unknown subcommand: ' + command);
  const options = {
    command, scope: 'all', offline: false, json: false, dryRun: false,
  };
  const valueOptions = new Set([
    'repo', 'remote', 'release', 'scope', 'out', 'run', 'path', 'decision', 'unit', 'decisions',
    'plan-digest',
  ]);
  const booleanOptions = new Set([
    'offline', 'json', 'dry-run', 'defer', 'include-prerelease', 'trust-release',
  ]);
  const booleanKeys = {
    'dry-run': 'dryRun',
    'include-prerelease': 'includePrerelease',
    'trust-release': 'trustRelease',
  };
  const valueKeys = {
    'plan-digest': 'planDigest',
  };
  const seenOptions = new Set();
  for (let index = 1; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) throw usageError('unexpected argument: ' + token);
    const equal = token.indexOf('=');
    const key = token.slice(2, equal < 0 ? undefined : equal);
    if (!COMMAND_OPTIONS[command].has(key)) {
      throw usageError('unknown option for ' + command + ': --' + key);
    }
    if (seenOptions.has(key)) throw usageError('duplicate option: --' + key);
    seenOptions.add(key);
    if (booleanOptions.has(key)) {
      if (equal >= 0) throw usageError('--' + key + ' does not take a value');
      options[booleanKeys[key] || key] = true;
      continue;
    }
    if (!valueOptions.has(key)) throw usageError('unsupported option: --' + key);
    const value = equal >= 0 ? token.slice(equal + 1) : argv[++index];
    if (typeof value !== 'string' || !value || value.startsWith('--')) {
      throw usageError('--' + key + ' requires a value');
    }
    options[valueKeys[key] || key] = value;
  }
  if (options.planDigest && !/^[0-9a-f]{64}$/.test(options.planDigest)) {
    throw usageError('--plan-digest must be the 64-character digest that apply --dry-run printed');
  }
  if (options.remote && options.remote.startsWith('-')) {
    throw usageError('--remote must name a remote or a repository URL, not an option');
  }
  if (options.release && !parseVersion(options.release)) {
    throw usageError('--release must be a version tag');
  }
  if (command === 'decide') {
    const defer = Boolean(options.defer);
    const hasPathChoice = options.path !== undefined || options.decision !== undefined;
    if (!options.run || defer === hasPathChoice || (defer && !options.unit)
      || (!defer && (!options.path || !options.decision || options.unit))) {
      throw usageError('decide requires --run and either --path <p> --decision <d>'
        + ' or --unit <u> --defer');
    }
  }
  if (command === 'rollback' && !options.run) {
    throw usageError('rollback requires --run <dir>');
  }
  return options;
}

function plainSummary(result) {
  if (result.command === 'check') {
    return [
      'release: ' + result.release,
      'upstream: ' + result.upstream.latest,
      'status: ' + result.status,
      ...result.units.map((unit) => unit.key + ': ' + unit.status + ' (' + unit.baseSource + ')'),
      ...(result.baseRecording && result.baseRecording.needed
        ? ['base: ' + result.baseRecording.units.length
          + ' unit(s) have no recorded base; run ' + result.baseRecording.action]
        : []),
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
    if (COMMAND_OPTIONS[options.command].has('remote')) {
      const flagRemote = options.remote;
      const baseRemote = flagRemote ? null : persistedRemote(repo);
      options.remoteSource = flagRemote ? 'flag' : baseRemote ? 'base' : 'default';
      options.remote = flagRemote || baseRemote || 'origin';
    }
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
    } else if (options.command === 'record-base') {
      result = recordBase(repo, options);
    } else if (options.command === 'unlock') {
      result = unlockStale(repo, options);
    } else {
      result = rollbackPlan(repo, options.run, options);
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
    const usage = outcome.exitCode === 2 ? USAGE + '\n' : '';
    process.stderr.write(LOG_PREFIX + ' ' + outcome.error + '\n' + usage);
  } else {
    process.stdout.write(plainSummary(outcome.result) + '\n');
  }
  process.exitCode = outcome.exitCode;
}

// ─────────────────────────────────────────────────────────────────────────────
// 11. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  classifyFile,
  compareVersions,
  enumerateUnits,
  latestTag,
  main,
  parseVersion,
  runCommand,
  // Exported for tests: the placeholder path must enumerate to its own unit.
  syntheticPathForUnit,
};

if (require.main === module) main();

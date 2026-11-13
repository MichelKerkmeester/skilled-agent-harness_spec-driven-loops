#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Relocate
// ───────────────────────────────────────────────────────────────────
// Moves, renumbers or re-parents spec packets and leaves every store that
// records a packet path agreeing with the new location. A packet's path is
// written in many places: its own description.json and graph-metadata.json,
// the packet_pointer in each document, a phase parent's children_ids, the track
// and sub-track roots, other packets' manual references and markdown links, the
// description cache and the trigger index. Moving the folder by hand leaves most
// of them naming the old place, so this tool owns the order of operations and
// drives the writer that already owns each store rather than writing a second
// one.
//
// Dry by default: the run prints every move and every file it would change.
// --apply writes. Every refusal happens before the first write, so a refused
// plan changes nothing. The run is idempotent: an entry whose folder already
// sits at its destination is checked for stale records only, and a second
// --apply of an applied map finds nothing to do.
//
// Code and CI files are never rewritten. A moved path named in them fails the
// run, because silently leaving a hook or workflow pointing at a folder that is
// gone is worse than stopping.
//
// Usage (run from the repository root):
//   node .skilled/skills/system-spec-kit/runtime/cli/spec/relocate.mjs --map <file.json> [--apply]
//   node .skilled/skills/system-spec-kit/runtime/cli/spec/relocate.mjs --from <path> --to <path> [--apply]
//   node .skilled/skills/system-spec-kit/runtime/cli/spec/relocate.mjs --renumber <folder> [--apply]
//   node .skilled/skills/system-spec-kit/runtime/cli/spec/relocate.mjs --declare-subtrack <track>/<name> [--apply]
//
// A map file holds [{ "from": "<track>/NNN-slug", "to": "<track>/<sub>/NNN-slug" }].
// Paths are specs-relative; a leading specs/ is accepted.
//
// Exit codes: 0 = nothing left to do (after --apply: every step landed),
//             1 = work found (dry run only),
//             2 = a rejected argument, a refused plan or a step that failed.
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { SPEC_LEAF_SEGMENT_PATTERN, readWorkingTreeTracks, compareTrackChildren, parseTrackMetadata, trackLayout } from '../lib/track-roots.mjs';

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const SCRIPT = 'relocate';
const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = path.resolve(SCRIPT_DIR, '../../..');
const REPO = process.cwd();
const SPECS = path.join(REPO, 'specs');

const TOOLS = {
  repair: path.join(SCRIPT_DIR, 'repair-derived.cjs'),
  refresh: path.join(SCRIPT_DIR, 'refresh-track-roots.mjs'),
  sweep: path.join(SCRIPT_DIR, 'sweep-track-roots.mjs'),
  validate: path.join(SCRIPT_DIR, 'validate.sh'),
  migrate: path.join(SKILL_ROOT, 'runtime/cli/graph/migrate-generated-json.ts'),
  triggerIndex: path.join(SKILL_ROOT, 'runtime/cli/retrieval/generate-trigger-index.mjs'),
  tsxLoader: path.join(SKILL_ROOT, 'node_modules/tsx/dist/loader.mjs'),
  citeDrift: path.join(REPO, '.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs'),
};
const LEDGER = path.join(REPO, '.skilled/skills/sk-doc/shared/scripts/relocation-ledger.json');
const REDIRECTS = path.join(REPO, '.skilled/skills/sk-doc/shared/scripts/cite-drift-redirects.json');

// Hard-coded packet paths live here. They are reported and never rewritten.
const CODE_FILES = ['.skilled/bin/lib/compiled-route-layout.cjs'];
const CODE_DIRS = ['.github/workflows'];

// A packet folder is three digits, a hyphen and a slug, the name archive.sh
// and create.sh accept. A looser name would be a folder no other tool can find.
const PACKET_NAME = /^\d{3}-[A-Za-z0-9._-]+$/;
const CONTAINER_NAME = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;
const ARCHIVE = 'z_archive';
const SUB_TRACK_LEVEL = 'sub-track';

// Text that can carry a packet path. Anything else under specs/ is left alone.
const TEXT_EXTENSIONS = new Set(['.md', '.json', '.jsonl', '.yaml', '.yml', '.txt']);
const SKIP_DIRS = new Set(['.git', 'node_modules']);

// Characters that continue a path segment. An id followed by one of them is a
// different, longer id: demo/001-a inside demo/001-a-b must not match.
const SEGMENT_CHAR = 'A-Za-z0-9_\\-';

// The documents whose frontmatter packet_pointer the repair writer owns.
const POINTER_DOCS = ['spec.md', 'plan.md', 'tasks.md', 'implementation-summary.md', 'handover.md', 'goal.md', 'acceptance-criteria.md', 'resource-map.md', 'decision-record.md'];
const POINTER_LINE = /^[ \t]*packet_pointer:[ \t]*["']?([^"'\r\n]*?)["']?[ \t]*\r?$/m;
// The recorded pointer lives in the leading YAML block, which can sit behind a
// template-source comment. These mirror the repair writer's own reading.
const FRONTMATTER_OPEN = /^﻿?(?:[ \t]*\r?\n|<!--[\s\S]*?-->[ \t]*\r?\n)*---[ \t]*\r?\n/;
const FRONTMATTER_CLOSE = /^(?:---|\.\.\.)[ \t]*\r?$/m;

const CHILD = { cwd: REPO, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 };

const USAGE = `Usage: relocate.mjs (--map <file.json> | --from <path> --to <path> | --renumber <folder> | --declare-subtrack <track>/<name>) [--apply]`;

/** A rejected argument. The usage line follows it. */
class UsageError extends Error {}

// ───────────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────────

function out(line = '') {
  process.stdout.write(`${line}\n`);
}

function abs(id) {
  return id === '' ? SPECS : path.join(SPECS, ...id.split('/'));
}

function rel(file) {
  return path.relative(REPO, file).split(path.sep).join('/');
}

function idOf(absPath) {
  return path.relative(SPECS, absPath).split(path.sep).join('/');
}

function parentId(id) {
  const index = id.lastIndexOf('/');
  return index < 0 ? '' : id.slice(0, index);
}

function baseName(id) {
  return id.slice(id.lastIndexOf('/') + 1);
}

function lstat(file) {
  try {
    return fs.lstatSync(file);
  } catch {
    return null;
  }
}

function isDir(file) {
  const stat = lstat(file);
  return Boolean(stat && stat.isDirectory());
}

function readText(file) {
  try {
    return fs.readFileSync(file, 'utf8');
  } catch {
    return null;
  }
}

function readJson(file) {
  const text = readText(file);
  if (text === null) return null;
  try {
    const value = JSON.parse(text);
    return value && typeof value === 'object' && !Array.isArray(value) ? value : null;
  } catch {
    return null;
  }
}

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// A sibling written and renamed over the original, so a reader sees either the
// old bytes or the new ones and an interrupt never leaves a document empty.
function writeAtomic(file, text) {
  const temp = path.join(path.dirname(file), `.${path.basename(file)}.relocate-${process.pid}-${crypto.randomBytes(6).toString('hex')}.tmp`);
  fs.writeFileSync(temp, text, { encoding: 'utf8', flag: 'wx' });
  try {
    const mode = lstat(file)?.mode;
    if (mode !== undefined) fs.chmodSync(temp, mode & 0o777);
    fs.renameSync(temp, file);
  } catch (err) {
    fs.rmSync(temp, { force: true });
    throw err;
  }
}

function isDeclaredSubtrack(dir) {
  if (!isDir(dir) || fs.existsSync(path.join(dir, 'spec.md'))) return false;
  if (lstat(path.join(dir, 'description.json'))?.isSymbolicLink()) return false;
  return readJson(path.join(dir, 'description.json'))?.level === SUB_TRACK_LEVEL;
}

function isContainerName(name) {
  return CONTAINER_NAME.test(name) && !name.startsWith('z_') && name !== 'node_modules' && !SPEC_LEAF_SEGMENT_PATTERN.test(name);
}

function numberOf(name) {
  return /^\d{3}/.test(name) ? Number(name.slice(0, 3)) : null;
}

/** The numbered folders directly in a directory, by name. */
function numberedDirs(dir) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  return entries.filter((entry) => entry.isDirectory() && PACKET_NAME.test(entry.name)).map((entry) => entry.name).sort();
}

/** A child process run to completion, its output kept for the report. */
function runChild(command, args) {
  const result = spawnSync(command, args, CHILD);
  const failed = result.error || result.status !== 0;
  return {
    ok: !failed,
    status: result.status,
    stdout: result.stdout || '',
    stderr: result.stderr || '',
    why: result.error ? result.error.message : `exit ${result.status}`,
  };
}

function tail(text, count = 4) {
  return String(text || '').split('\n').map((line) => line.trimEnd()).filter(Boolean).slice(-count);
}

// ───────────────────────────────────────────────────────────────────
// 4. ARGUMENTS
// ───────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const options = { apply: false, map: null, from: null, to: null, renumber: null, declare: null };
  const valued = new Map([['--map', 'map'], ['--from', 'from'], ['--to', 'to'], ['--renumber', 'renumber'], ['--declare-subtrack', 'declare']]);
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === '--apply') {
      options.apply = true;
    } else if (token === '--help' || token === '-h') {
      out(USAGE);
      process.exit(0);
    } else if (valued.has(token)) {
      const value = argv[index + 1];
      if (value === undefined || value.startsWith('--')) throw new UsageError(`${token} needs a value`);
      const key = valued.get(token);
      if (options[key] !== null) throw new UsageError(`${token} given twice`);
      options[key] = value;
      index += 1;
    } else {
      throw new UsageError(`unknown argument: ${token}`);
    }
  }
  const modes = [options.map !== null, options.from !== null || options.to !== null, options.renumber !== null, options.declare !== null].filter(Boolean).length;
  if (modes !== 1) throw new UsageError('name exactly one of --map, --from with --to, --renumber or --declare-subtrack');
  if ((options.from === null) !== (options.to === null)) throw new UsageError('--from and --to go together');
  return options;
}

/**
 * A specs-relative id from a path argument, or a refusal naming it. The id is
 * confined to specs/ lexically here and through links in confine().
 */
function normalizeId(raw, label, refusals) {
  let value = String(raw).trim().replace(/\\/g, '/');
  if (path.isAbsolute(value)) {
    const inside = path.relative(SPECS, value);
    if (inside === '' || inside.startsWith('..') || path.isAbsolute(inside)) {
      refusals.push(`${label} ${raw}: outside specs/`);
      return null;
    }
    value = inside.split(path.sep).join('/');
  }
  value = value.replace(/^\.\//, '').replace(/^\.opencode\/specs\//, '').replace(/^specs\//, '').replace(/\/+$/, '');
  const segments = value.split('/');
  if (value === '' || segments.some((segment) => segment === '' || segment === '.' || segment === '..')) {
    refusals.push(`${label} ${raw}: outside specs/ or not a plain path`);
    return null;
  }
  return value;
}

/** Refuse a path that passes through a link anywhere below specs/. */
function confine(id, label, refusals) {
  let current = SPECS;
  for (const segment of id.split('/')) {
    current = path.join(current, segment);
    const stat = lstat(current);
    if (!stat) return true;
    if (stat.isSymbolicLink()) {
      refusals.push(`${label} specs/${id}: passes through a symbolic link at ${rel(current)}`);
      return false;
    }
  }
  return true;
}

function loadMap(file, refusals) {
  const text = readText(path.resolve(REPO, file));
  if (text === null) throw new UsageError(`cannot read map file: ${file}`);
  let data;
  try {
    data = JSON.parse(text);
  } catch (err) {
    throw new UsageError(`map file is not JSON: ${file}: ${err.message}`);
  }
  if (!Array.isArray(data)) throw new UsageError(`map file must hold an array of { from, to }: ${file}`);
  const entries = [];
  data.forEach((item, index) => {
    if (!item || typeof item !== 'object' || typeof item.from !== 'string' || typeof item.to !== 'string') {
      refusals.push(`map entry ${index}: needs string "from" and "to"`);
      return;
    }
    entries.push({ rawFrom: item.from, rawTo: item.to });
  });
  return entries;
}

// Closes the number gaps among a folder's numbered children, in their current
// order. Numbers held in the folder's z_archive count as taken, so a renumber
// never gives a live packet the number of an archived one.
function renumberEntries(rawFolder, refusals) {
  const folder = rawFolder.trim() === 'specs' ? '' : normalizeId(rawFolder, '--renumber', refusals);
  if (folder === null) return [];
  if (!isDir(abs(folder))) {
    refusals.push(`--renumber specs/${folder}: not a folder`);
    return [];
  }
  const children = numberedDirs(abs(folder)).sort((a, b) => numberOf(a) - numberOf(b) || (a < b ? -1 : 1));
  const taken = new Set(numberedDirs(path.join(abs(folder), ARCHIVE)).map(numberOf));
  let next = children.some((name) => numberOf(name) === 0) ? 0 : 1;
  const entries = [];
  for (const name of children) {
    while (taken.has(next)) next += 1;
    const target = `${String(next).padStart(3, '0')}${name.slice(3)}`;
    next += 1;
    if (target !== name) {
      const prefix = folder === '' ? '' : `${folder}/`;
      entries.push({ rawFrom: `${prefix}${name}`, rawTo: `${prefix}${target}` });
    }
  }
  return entries;
}

// ───────────────────────────────────────────────────────────────────
// 5. PREFLIGHT
// ───────────────────────────────────────────────────────────────────

/** The track or sub-track whose children list a folder directly in it belongs to. */
function trackLevelOf(dirId, newSubtracks) {
  const segments = dirId.split('/');
  if (segments.length === 1 && segments[0] !== '' && isContainerName(segments[0])) return segments[0];
  if (segments.length === 2 && isContainerName(segments[0]) && isContainerName(segments[1])
    && (newSubtracks.has(dirId) || isDeclaredSubtrack(abs(dirId)))) return dirId;
  return null;
}

/** A track's direct children as the track reader counts them. */
function trackChildren(track) {
  const dir = abs(track);
  const packets = numberedDirs(dir).filter((name) => fs.existsSync(path.join(dir, name, 'spec.md')));
  let entries = [];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    entries = [];
  }
  const subTracks = entries
    .filter((entry) => entry.isDirectory() && isContainerName(entry.name) && isDeclaredSubtrack(path.join(dir, entry.name)))
    .map((entry) => entry.name);
  return [...packets, ...subTracks];
}

// Checks the destination's shape: a track, at most one sub-track below it, then
// numbered folders and archives only. Returns the sub-track it would create.
function checkDestinationShape(entry, refusals) {
  const segments = entry.to.split('/');
  let containers = 0;
  let belowPacket = false;
  for (let index = 0; index < segments.length - 1; index += 1) {
    const segment = segments[index];
    if (segment === ARCHIVE) {
      belowPacket = true;
      continue;
    }
    if (PACKET_NAME.test(segment)) {
      belowPacket = true;
      continue;
    }
    if (!isContainerName(segment) || belowPacket || index > 1) {
      refusals.push(`to specs/${entry.to}: "${segment}" is not a track, a sub-track, a packet or z_archive in that position`);
      return null;
    }
    containers += 1;
  }
  if (containers > 2) {
    refusals.push(`to specs/${entry.to}: deeper than one sub-track`);
    return null;
  }
  if (containers >= 1) {
    const track = segments[0];
    const trackDir = abs(track);
    if (!isDir(trackDir) || fs.existsSync(path.join(trackDir, 'spec.md'))) {
      refusals.push(`to specs/${entry.to}: track specs/${track} does not exist; create the track first`);
      return null;
    }
  }
  if (containers === 2) {
    const sub = `${segments[0]}/${segments[1]}`;
    if (isDir(abs(sub))) {
      if (!isDeclaredSubtrack(abs(sub))) {
        refusals.push(`to specs/${entry.to}: specs/${sub} exists but is not a declared sub-track`);
        return null;
      }
      return null;
    }
    if (!fs.existsSync(path.join(abs(segments[0]), 'graph-metadata.json'))) {
      refusals.push(`to specs/${entry.to}: new sub-track specs/${sub} needs a track with graph-metadata.json`);
      return null;
    }
    return sub;
  }
  return null;
}

/** Every git path under specs/ with uncommitted changes, and every tracked file. */
function gitState() {
  const status = runChild('git', ['status', '--porcelain=v1', '-z', '--untracked-files=all', '--', 'specs']);
  const tracked = runChild('git', ['ls-files', '-z', '--', 'specs']);
  if (!status.ok || !tracked.ok) return null;
  const dirty = new Set();
  const records = status.stdout.split('\0');
  for (let index = 0; index < records.length; index += 1) {
    const record = records[index];
    if (record.length < 4) continue;
    dirty.add(record.slice(3));
    // A rename record carries its source as the next field.
    if (record[0] === 'R' || record[0] === 'C') {
      dirty.add(records[index + 1]);
      index += 1;
    }
  }
  return { dirty, tracked: new Set(tracked.stdout.split('\0').filter(Boolean)) };
}

function anyUnder(set, prefix) {
  for (const item of set) if (item === prefix || item.startsWith(`${prefix}/`)) return true;
  return false;
}

/**
 * Builds and checks the plan. Returns { entries, newSubtracks } with each entry
 * marked pending or done, or pushes refusals.
 */
function preflight(rawEntries, refusals) {
  const entries = [];
  const seen = new Set();
  for (const raw of rawEntries) {
    const from = normalizeId(raw.rawFrom, 'from', refusals);
    const to = normalizeId(raw.rawTo, 'to', refusals);
    if (from === null || to === null) continue;
    const key = `${from}\0${to}`;
    if (seen.has(key) || from === to) continue;
    seen.add(key);
    entries.push({ from, to });
  }

  for (const entry of entries) {
    if (!confine(entry.from, 'from', refusals) || !confine(entry.to, 'to', refusals)) continue;
    for (const [label, id] of [['from', entry.from], ['to', entry.to]]) {
      if (!PACKET_NAME.test(baseName(id))) refusals.push(`${label} specs/${id}: "${baseName(id)}" is not NNN-slug`);
    }
    const fromThere = isDir(abs(entry.from));
    const toThere = lstat(abs(entry.to)) !== null;
    if (fromThere && !toThere) entry.state = 'pending';
    else if (!fromThere && toThere) entry.state = 'done';
    else if (fromThere && toThere) refusals.push(`to specs/${entry.to}: already exists (collision with the move from specs/${entry.from})`);
    else refusals.push(`from specs/${entry.from}: does not exist, and neither does specs/${entry.to}`);
  }

  const froms = new Map(entries.map((entry) => [entry.from, entry]));
  const sources = new Map();
  const tos = new Map();
  for (const entry of entries) {
    if (tos.has(entry.to)) refusals.push(`to specs/${entry.to}: named by two entries (specs/${tos.get(entry.to).from} and specs/${entry.from})`);
    tos.set(entry.to, entry);
    if (sources.has(entry.from)) refusals.push(`from specs/${entry.from}: named by two entries (to specs/${sources.get(entry.from).to} and to specs/${entry.to})`);
    sources.set(entry.from, entry);
    if (froms.has(entry.to)) refusals.push(`to specs/${entry.to}: is another entry's source; a chain or swap makes a rerun ambiguous, split it into two maps`);
    if (entry.to.startsWith(`${entry.from}/`)) refusals.push(`to specs/${entry.to}: inside its own source specs/${entry.from}`);
    for (const other of entries) {
      if (other === entry) continue;
      if (entry.from.startsWith(`${other.from}/`)) refusals.push(`from specs/${entry.from}: inside specs/${other.from}, which moves too; name only the outer folder`);
      if (entry.to.startsWith(`${other.from}/`)) refusals.push(`to specs/${entry.to}: inside specs/${other.from}, which moves away`);
    }
  }

  const newSubtracks = new Set();
  for (const entry of entries.filter((item) => item.state === 'pending')) {
    const created = checkDestinationShape(entry, refusals);
    if (created) newSubtracks.add(created);
    const parent = parentId(entry.to);
    const parentThere = isDir(abs(parent));
    const archiveParent = baseName(parent) === ARCHIVE && isDir(abs(parentId(parent)));
    if (!parentThere && !newSubtracks.has(parent) && !archiveParent) {
      refusals.push(`to specs/${entry.to}: its folder specs/${parent} does not exist`);
    }
  }

  // A packet number names one folder among its siblings, live or archived, so a
  // destination sharing its number with a sibling that stays is a collision.
  const leaving = new Set(entries.filter((entry) => entry.state === 'pending').map((entry) => entry.from));
  for (const entry of entries.filter((item) => item.state === 'pending')) {
    const parent = parentId(entry.to);
    const home = baseName(parent) === ARCHIVE ? parentId(parent) : parent;
    const number = numberOf(baseName(entry.to));
    const siblings = [
      ...numberedDirs(abs(home)).map((name) => (home === '' ? name : `${home}/${name}`)),
      ...numberedDirs(path.join(abs(home), ARCHIVE)).map((name) => (home === '' ? `${ARCHIVE}/${name}` : `${home}/${ARCHIVE}/${name}`)),
    ];
    for (const sibling of siblings) {
      if (leaving.has(sibling) || sibling === entry.from || numberOf(baseName(sibling)) !== number) continue;
      refusals.push(`to specs/${entry.to}: number ${baseName(entry.to).slice(0, 3)} is already used by specs/${sibling}`);
    }
    for (const other of entries) {
      if (other === entry || other.state !== 'pending') continue;
      const otherParent = parentId(other.to);
      const otherHome = baseName(otherParent) === ARCHIVE ? parentId(otherParent) : otherParent;
      if (otherHome === home && numberOf(baseName(other.to)) === number && other.to > entry.to) {
        refusals.push(`to specs/${entry.to}: number ${baseName(entry.to).slice(0, 3)} is also given to specs/${other.to}`);
      }
    }
  }

  // Mixed tracks are forbidden: after the moves, a track holds packets or
  // sub-tracks, never both.
  const affectedTracks = new Set();
  for (const entry of entries.filter((item) => item.state === 'pending')) {
    for (const dir of [parentId(entry.from), parentId(entry.to)]) {
      if (dir !== '' && !dir.includes('/') && isContainerName(dir)) affectedTracks.add(dir);
    }
  }
  for (const sub of newSubtracks) affectedTracks.add(sub.split('/')[0]);
  for (const track of [...affectedTracks].sort()) {
    const after = new Set(trackChildren(track));
    for (const entry of entries.filter((item) => item.state === 'pending')) {
      if (parentId(entry.from) === track) after.delete(baseName(entry.from));
      if (parentId(entry.to) === track && PACKET_NAME.test(baseName(entry.to))) after.add(baseName(entry.to));
    }
    for (const sub of newSubtracks) if (sub.startsWith(`${track}/`)) after.add(baseName(sub));
    const layout = trackLayout([...after].sort());
    if (layout.mixed) {
      refusals.push(`track specs/${track}: would hold flat packets (${layout.packets.join(', ')}) beside sub-tracks (${layout.subTracks.join(', ')}); a sub-track map covers the whole track`);
    }
  }

  return { entries, newSubtracks };
}

// ───────────────────────────────────────────────────────────────────
// 6. REFERENCE REWRITES
// ───────────────────────────────────────────────────────────────────

/** The regex that finds an old id as a whole path id, in prose, JSON or a path. */
function wholeIdPattern(ids) {
  const alternatives = [...ids].sort((a, b) => b.length - a.length);
  const multi = alternatives.filter((id) => id.includes('/')).map(escapeRegExp);
  const single = alternatives.filter((id) => !id.includes('/')).map(escapeRegExp);
  const parts = [];
  // A multi-segment id stands alone or follows specs/. A single segment is only
  // ever a root packet, and three digits plus a slug are too common to match bare.
  if (multi.length) parts.push(`(?:(?<![${SEGMENT_CHAR}./])|(?<=specs/))(${multi.join('|')})`);
  if (single.length) parts.push(`(?<=specs/)(${single.join('|')})`);
  if (!parts.length) return null;
  return new RegExp(`(?:${parts.join('|')})(?![${SEGMENT_CHAR}]|\\.[${SEGMENT_CHAR}])`, 'g');
}

/** The code-file pattern: an id written as one path or as quoted path segments. */
function codePattern(id) {
  const joiner = '(?:/|[\'"`]\\s*,\\s*[\'"`])';
  const body = id.split('/').map(escapeRegExp).join(joiner);
  return new RegExp(`(?<![${SEGMENT_CHAR}.])${body}(?![${SEGMENT_CHAR}]|\\.[${SEGMENT_CHAR}])`);
}

/** Maps an absolute path through the entries, or returns it unchanged. */
function makePathMapper(pairs) {
  const sorted = [...pairs].sort((a, b) => b[0].length - a[0].length);
  return (target) => {
    for (const [from, to] of sorted) {
      if (target === from) return to;
      if (target.startsWith(`${from}${path.sep}`)) return to + target.slice(from.length);
    }
    return target;
  };
}

const INLINE_LINK = /(\]\()([^)\s]+)((?:\s+"[^"]*")?\))/g;
const REFERENCE_LINK = /^([ \t]*\[[^\]\n]+\]:[ \t]*)(\S+)/gm;

/**
 * Builds the transform applied to every text file. The whole-id pass rewrites
 * an old id wherever it is written in full. A relative markdown link cannot be
 * matched by id, so it is resolved: a link that works now and whose target or
 * whose own file moves is recomputed from the new places, and a link that is
 * broken now is repaired only when it pointed into a folder that already moved.
 */
function buildTransform(entries) {
  const idMap = new Map(entries.map((entry) => [entry.from, entry.to]));
  const pattern = wholeIdPattern(idMap.keys());
  const pending = entries.filter((entry) => entry.state === 'pending');
  const done = entries.filter((entry) => entry.state === 'done');
  const forward = makePathMapper(entries.map((entry) => [abs(entry.from), abs(entry.to)]));
  const forwardPending = makePathMapper(pending.map((entry) => [abs(entry.from), abs(entry.to)]));
  const backDone = makePathMapper(done.map((entry) => [abs(entry.to), abs(entry.from)]));
  const pendingFrom = pending.map((entry) => abs(entry.from));
  const doneTo = done.map((entry) => abs(entry.to));
  const doneFrom = done.map((entry) => abs(entry.from));
  const under = (list, target) => list.some((root) => target === root || target.startsWith(`${root}${path.sep}`));

  function rewriteLink(file, target) {
    if (/^[a-z][a-z0-9+.-]*:/i.test(target) || target.startsWith('#') || target.startsWith('/') || target.startsWith('<')) return null;
    const cut = target.search(/[#?]/);
    const pathPart = cut < 0 ? target : target.slice(0, cut);
    const suffix = cut < 0 ? '' : target.slice(cut);
    if (pathPart === '' || pathPart === '.' || pathPart === './') return null;
    const fileMoving = under(pendingFrom, file);
    const fileMoved = under(doneTo, file);
    const fileOld = fileMoved ? backDone(file) : file;
    const fileNew = fileMoving ? forwardPending(file) : file;
    const fromOld = path.resolve(path.dirname(fileOld), pathPart);
    const mapped = forward(fromOld);
    if (!fileMoving && !fileMoved && mapped === fromOld) return null;
    if (fileMoving || under(pendingFrom, fromOld)) {
      if (!fs.existsSync(fromOld)) return null;
    } else {
      if (fs.existsSync(path.resolve(path.dirname(file), pathPart))) return null;
      if (!under(doneFrom, fromOld) && !fileMoved) return null;
      if (!fs.existsSync(mapped)) return null;
    }
    let next = path.relative(path.dirname(fileNew), mapped).split(path.sep).join('/');
    if (next === '') return null;
    if (pathPart.endsWith('/') && !next.endsWith('/')) next += '/';
    if (pathPart.startsWith('./') && !next.startsWith('.')) next = `./${next}`;
    return next === pathPart ? null : next + suffix;
  }

  return function transform(file, text) {
    let changes = 0;
    let result = text;
    if (file.endsWith('.md') && (result.includes('](') || result.includes(']:'))) {
      const replaceLink = (match, open, target, close) => {
        const next = rewriteLink(file, target);
        if (next === null) return match;
        changes += 1;
        return `${open}${next}${close}`;
      };
      result = result.replace(INLINE_LINK, replaceLink);
      result = result.replace(REFERENCE_LINK, (match, open, target) => {
        const next = rewriteLink(file, target);
        if (next === null) return match;
        changes += 1;
        return `${open}${next}`;
      });
    }
    if (pattern) {
      result = result.replace(pattern, (match) => {
        changes += 1;
        return idMap.get(match);
      });
    }
    return { text: result, changes };
  };
}

/** Every text file under specs/, links and dependency folders left out. */
function textFiles(root) {
  const files = [];
  const stack = [root];
  while (stack.length) {
    const dir = stack.pop();
    let items;
    try {
      items = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const item of items) {
      if (item.isSymbolicLink()) continue;
      const full = path.join(dir, item.name);
      if (item.isDirectory()) {
        if (!SKIP_DIRS.has(item.name) && !item.name.startsWith('.')) stack.push(full);
      } else if (item.isFile() && TEXT_EXTENSIONS.has(path.extname(item.name))) {
        files.push(full);
      }
    }
  }
  return files.sort();
}

// A phase child that leaves its parent leaves the parent's children_ids, and the
// new parent lists it. Only ids the map names are touched, so an entry this tool
// does not own is never pruned here.
function childrenEdits(entries) {
  const edits = new Map();
  const add = (parent, edit) => {
    const file = path.join(abs(parent), 'graph-metadata.json');
    if (!edits.has(file)) edits.set(file, { parent, drop: [], add: [] });
    edits.get(file)[edit.kind].push(edit.id);
  };
  for (const entry of entries) {
    const oldParent = parentId(entry.from);
    const newParent = parentId(entry.to);
    const oldIsPacket = PACKET_NAME.test(baseName(oldParent));
    const newIsPacket = PACKET_NAME.test(baseName(newParent));
    if (oldIsPacket) add(oldParent, { kind: 'drop', id: entry.from });
    if (newIsPacket) add(newParent, { kind: 'add', id: entry.to });
  }
  return edits;
}

/** The children_ids edit applied to one graph-metadata.json text, or null for none. */
function applyChildrenEdit(text, edit) {
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    return null;
  }
  if (!data || typeof data !== 'object' || !Array.isArray(data.children_ids)) return null;
  const before = data.children_ids.map(String);
  const wasSorted = before.every((id, index) => index === 0 || before[index - 1] <= id);
  let after = before.filter((id) => !edit.drop.includes(id));
  for (const id of edit.add) if (!after.includes(id)) after.push(id);
  if (wasSorted) after = [...after].sort();
  if (after.length === before.length && after.every((id, index) => id === before[index])) return null;
  data.children_ids = after;
  return { text: `${JSON.stringify(data, null, 2)}\n`, dropped: before.filter((id) => !after.includes(id)), added: after.filter((id) => !before.includes(id)) };
}

// ───────────────────────────────────────────────────────────────────
// 7. STORE CHECKS FOR MOVED FOLDERS
// ───────────────────────────────────────────────────────────────────

/** Spec folders at or below a folder: those carrying spec.md or description.json. */
function specFoldersUnder(root) {
  const folders = [];
  const stack = [root];
  while (stack.length) {
    const dir = stack.pop();
    if (fs.existsSync(path.join(dir, 'spec.md')) || fs.existsSync(path.join(dir, 'description.json'))) folders.push(dir);
    let items = [];
    try {
      items = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      items = [];
    }
    for (const item of items) {
      if (item.isDirectory() && !item.isSymbolicLink() && !SKIP_DIRS.has(item.name) && !item.name.startsWith('.') && item.name !== 'external') {
        stack.push(path.join(dir, item.name));
      }
    }
  }
  return folders.sort();
}

/** The leading YAML block of a document, or an empty string when it has none. */
function frontmatter(text) {
  const open = FRONTMATTER_OPEN.exec(text);
  if (!open) return '';
  const body = text.slice(open[0].length);
  const close = FRONTMATTER_CLOSE.exec(body);
  return close ? body.slice(0, close.index) : '';
}

// Why a moved folder still records the place it left, or null. Only a record
// naming the old place counts: a mismatch the folder carried before the move is
// not this tool's to settle, and flagging it would make every rerun report work
// that no run can finish.
function staleIdentity(folder, entry) {
  const id = idOf(folder);
  const oldId = `${entry.from}${id.slice(entry.to.length)}`;
  const reasons = [];
  const description = readJson(path.join(folder, 'description.json'));
  if (description) {
    if (description.specFolder === oldId) reasons.push('description specFolder');
    if (id === entry.to && baseName(entry.from) !== baseName(entry.to)) {
      if (description.specId === baseName(entry.from).slice(0, 3) && baseName(entry.from).slice(0, 3) !== baseName(id).slice(0, 3)) reasons.push('description specId');
      if (description.folderSlug === baseName(entry.from).slice(4) && baseName(entry.from).slice(4) !== baseName(id).slice(4)) reasons.push('description folderSlug');
    }
  }
  const graph = readJson(path.join(folder, 'graph-metadata.json'));
  if (graph) {
    if (graph.packet_id === oldId) reasons.push('graph packet_id');
    if (graph.spec_folder === oldId) reasons.push('graph spec_folder');
  }
  for (const doc of POINTER_DOCS) {
    const text = readText(path.join(folder, doc));
    const hit = text === null ? null : POINTER_LINE.exec(frontmatter(text));
    if (hit && hit[1].replace(/^(?:\.opencode\/)?specs\//, '') === oldId) reasons.push(`${doc} packet_pointer`);
  }
  return reasons.length ? reasons : null;
}

/** The nearest packet folder holding a file, or null outside any packet. */
function packetOf(file) {
  let dir = path.dirname(file);
  while (dir.startsWith(`${SPECS}${path.sep}`)) {
    if (PACKET_NAME.test(path.basename(dir)) && (fs.existsSync(path.join(dir, 'spec.md')) || fs.existsSync(path.join(dir, 'implementation-summary.md')))) return dir;
    dir = path.dirname(dir);
  }
  return null;
}

function readLedger() {
  const data = readJson(LEDGER);
  if (!data) return { schema_version: 1, batches: [] };
  if (!Array.isArray(data.batches)) data.batches = [];
  return data;
}

function ledgerHas(ledger, entry) {
  return ledger.batches.some((batch) => Array.isArray(batch.moves) && batch.moves.some((move) => move.from === entry.from && move.to === entry.to));
}

// ───────────────────────────────────────────────────────────────────
// 8. PLAN
// ───────────────────────────────────────────────────────────────────

function scanCode(entries) {
  const hits = [];
  const files = [...CODE_FILES.map((file) => path.join(REPO, file))];
  for (const dir of CODE_DIRS) {
    let names = [];
    try {
      names = fs.readdirSync(path.join(REPO, dir));
    } catch {
      names = [];
    }
    for (const name of names.sort()) if (/\.ya?ml$/.test(name)) files.push(path.join(REPO, dir, name));
  }
  const patterns = entries.map((entry) => ({ id: entry.from, pattern: codePattern(entry.from) }));
  for (const file of files) {
    const text = readText(file);
    if (text === null) continue;
    text.split('\n').forEach((line, index) => {
      for (const { id, pattern } of patterns) {
        if (pattern.test(line)) hits.push(`${rel(file)}:${index + 1} names specs/${id}`);
      }
    });
  }
  return hits;
}

// The map file is the run's input and names every old id on purpose, so it is
// never one of the references the run rewrites, wherever it is kept.
function buildPlan(entries, newSubtracks, inputs = new Set()) {
  const transform = buildTransform(entries);
  const editsByFile = childrenEdits(entries);
  const forwardPending = makePathMapper(entries.filter((entry) => entry.state === 'pending').map((entry) => [abs(entry.from), abs(entry.to)]));

  // One pass over every text file: the children edit first, so a re-parented id
  // is dropped rather than renamed in its old parent, then the reference rewrite.
  const rewrites = [];
  const childNotes = [];
  // A rerun that finishes an interrupted apply cannot know which packets the
  // first run rewrote, so every packet that now names a moved packet is
  // re-derived again. The repair writer only writes what its validator flags,
  // so this costs time, never a wrong write, and it is not counted as work.
  const doneIds = entries.filter((entry) => entry.state === 'done').map((entry) => entry.to);
  const namesMoved = doneIds.length ? new RegExp(wholeIdPattern(doneIds).source) : null;
  const followUp = new Set();
  const destinationRoots = entries.map((entry) => abs(entry.to));
  for (const file of textFiles(SPECS)) {
    if (inputs.has(file)) continue;
    const original = readText(file);
    if (original === null) continue;
    if (namesMoved && namesMoved.test(original) && !destinationRoots.some((dest) => file.startsWith(`${dest}${path.sep}`))) {
      const packet = packetOf(file);
      if (packet) followUp.add(packet);
    }
    let text = original;
    let changes = 0;
    const edit = editsByFile.get(file);
    if (edit) {
      const applied = applyChildrenEdit(text, edit);
      if (applied) {
        text = applied.text;
        changes += applied.dropped.length + applied.added.length;
        for (const id of applied.dropped) childNotes.push(`children_ids specs/${edit.parent}: drop ${id}`);
        for (const id of applied.added) childNotes.push(`children_ids specs/${edit.parent}: add ${id}`);
      }
    }
    const result = transform(file, text);
    changes += result.changes;
    if (changes === 0) continue;
    rewrites.push({
      file,
      target: forwardPending(file),
      hash: crypto.createHash('sha256').update(original).digest('hex'),
      text: result.text,
      changes,
    });
  }

  const pending = entries.filter((entry) => entry.state === 'pending');
  const done = entries.filter((entry) => entry.state === 'done');

  const identity = [];
  for (const entry of pending) identity.push({ entry, reasons: ['moved'] });
  for (const entry of done) {
    for (const folder of specFoldersUnder(abs(entry.to))) {
      const reasons = staleIdentity(folder, entry);
      if (reasons) identity.push({ entry, folder, reasons });
    }
  }

  const touched = new Set();
  const destinations = entries.map((entry) => abs(entry.to));
  for (const rewrite of rewrites) {
    if (destinations.some((dest) => rewrite.target === dest || rewrite.target.startsWith(`${dest}${path.sep}`))) continue;
    const packet = packetOf(rewrite.target);
    if (packet) touched.add(packet);
  }

  // Track and sub-track roots whose children lists the moves change.
  const trackNames = new Set();
  for (const entry of entries) {
    for (const dir of [parentId(entry.from), parentId(entry.to)]) {
      const level = trackLevelOf(dir, newSubtracks);
      if (level) {
        trackNames.add(level);
        if (level.includes('/')) trackNames.add(level.split('/')[0]);
      }
    }
  }
  for (const sub of newSubtracks) {
    trackNames.add(sub);
    trackNames.add(sub.split('/')[0]);
  }
  const known = new Map(readWorkingTreeTracks(SPECS).map((track) => [track.name, track]));
  const trackWork = [];
  for (const name of [...trackNames].sort()) {
    if (newSubtracks.has(name) || pending.length > 0) {
      if (known.has(name) || newSubtracks.has(name) || (name.includes('/') && known.has(name.split('/')[0]))) trackWork.push(name);
      continue;
    }
    const track = known.get(name);
    if (!track) continue;
    const metadata = parseTrackMetadata(track.rawMetadata);
    if (!metadata || !compareTrackChildren(metadata, track.name, track.children).matches) trackWork.push(name);
  }

  const ledger = readLedger();
  const unrecorded = entries.filter((entry) => !ledgerHas(ledger, entry));

  for (const packet of touched) followUp.delete(packet);
  return { entries, pending, done, newSubtracks, rewrites, childNotes, identity, touched: [...touched].sort(), followUp: [...followUp].sort(), trackWork, unrecorded };
}

function hasWork(plan) {
  return plan.pending.length > 0 || plan.newSubtracks.size > 0 || plan.rewrites.length > 0
    || plan.identity.length > 0 || plan.trackWork.length > 0 || plan.unrecorded.length > 0;
}

function printPlan(plan, apply) {
  out(`${SCRIPT}: ${apply ? 'applying' : 'dry run, nothing written (pass --apply to write)'}`);
  for (const sub of [...plan.newSubtracks].sort()) out(`  declare  specs/${sub} (sub-track)`);
  for (const entry of plan.entries) {
    if (entry.state === 'pending') out(`  move     specs/${entry.from} -> specs/${entry.to}`);
    else out(`  moved    specs/${entry.from} -> specs/${entry.to} (already at its destination)`);
  }
  for (const note of plan.childNotes) out(`  ${note}`);
  for (const rewrite of plan.rewrites) {
    const shown = rewrite.target === rewrite.file ? rel(rewrite.file) : `${rel(rewrite.target)} (moved)`;
    out(`  rewrite  ${shown}: ${rewrite.changes} reference(s)`);
  }
  for (const item of plan.identity) {
    const where = item.folder ? rel(item.folder) : `specs/${item.entry.to}`;
    out(`  identity ${where}: ${item.reasons.join(', ')} -> migrate-generated-json --only, repair-derived --apply`);
  }
  for (const packet of plan.touched) out(`  re-derive ${rel(packet)} (references rewritten)`);
  if (hasWork(plan)) {
    for (const entry of plan.done) out(`  re-derive specs/${entry.to} (finishing an earlier run)`);
    for (const packet of plan.followUp) out(`  re-derive ${rel(packet)} (names a moved packet; finishing an earlier run)`);
  }
  for (const name of plan.trackWork) out(`  roots    ${name} -> refresh-track-roots --apply`);
  if (plan.unrecorded.length) out(`  ledger   ${rel(LEDGER)}: record ${plan.unrecorded.length} move(s)`);
  if (hasWork(plan)) {
    out(`  then     cite-drift-scan --rebuild-redirects, generate-trigger-index, sweep-track-roots, validate.sh --strict on ${plan.entries.length} moved packet(s)`);
  }
  out('');
  out(`moves=${plan.pending.length} moved=${plan.done.length} rewrites=${plan.rewrites.length} identity=${plan.identity.length} roots=${plan.trackWork.length} ledger=${plan.unrecorded.length}`);
}

// ───────────────────────────────────────────────────────────────────
// 9. APPLY
// ───────────────────────────────────────────────────────────────────

/** The declaration description.json of a sub-track; no other writer makes one. */
function subtrackDescription(id) {
  const [track, name] = id.split('/');
  return {
    level: SUB_TRACK_LEVEL,
    specFolder: id,
    description: `Container folder for ${id}.`,
    keywords: name.split(/[-_.]/).filter(Boolean),
    lastUpdated: new Date().toISOString(),
    specId: id,
    folderSlug: name,
    parentChain: [track],
    memorySequence: 0,
    memoryNameHistory: [],
  };
}

function declareSubtrack(id) {
  const dir = abs(id);
  fs.mkdirSync(dir, { recursive: true });
  if (!isDeclaredSubtrack(dir)) writeAtomic(path.join(dir, 'description.json'), `${JSON.stringify(subtrackDescription(id), null, 2)}\n`);
  const archive = path.join(dir, ARCHIVE);
  fs.mkdirSync(archive, { recursive: true });
  const keep = path.join(archive, '.gitkeep');
  if (!fs.existsSync(keep)) fs.writeFileSync(keep, '');
}

function moveFolder(entry, tracked) {
  const source = abs(entry.from);
  const target = abs(entry.to);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  const fromRel = rel(source);
  if (anyUnder(tracked, fromRel)) {
    const moved = runChild('git', ['mv', '--', fromRel, rel(target)]);
    if (!moved.ok) throw new Error(`git mv ${fromRel}: ${tail(moved.stderr, 1).join(' ') || moved.why}`);
    return 'git mv';
  }
  fs.renameSync(source, target);
  return 'rename';
}

function step(label, fn) {
  try {
    const note = fn();
    out(`step ${label}: ok${note ? ` (${note})` : ''}`);
    return true;
  } catch (err) {
    out(`step ${label}: FAILED ${err && err.message ? err.message : err}`);
    return false;
  }
}

function childStep(label, command, args) {
  return step(label, () => {
    const result = runChild(command, args);
    if (!result.ok) throw new Error(`${result.why}: ${tail(`${result.stdout}\n${result.stderr}`, 3).join(' | ')}`);
    return null;
  });
}

function applyPlan(plan, tracked) {
  const order = [...plan.pending].sort((a, b) => (a.to < b.to ? -1 : 1));

  if (!step('declare sub-tracks', () => {
    for (const sub of [...plan.newSubtracks].sort()) declareSubtrack(sub);
    return `${plan.newSubtracks.size}`;
  })) return false;

  if (!step('move', () => {
    const kinds = order.map((entry) => moveFolder(entry, tracked));
    return `${kinds.length} folder(s)`;
  })) return false;

  if (!step('rewrite references', () => {
    for (const rewrite of plan.rewrites) {
      const current = readText(rewrite.target);
      if (current === null || crypto.createHash('sha256').update(current).digest('hex') !== rewrite.hash) {
        throw new Error(`${rel(rewrite.target)} changed after planning; rerun the same map`);
      }
      writeAtomic(rewrite.target, rewrite.text);
    }
    return `${plan.rewrites.length} file(s)`;
  })) return false;

  const migrateFolders = [];
  const repairRoots = new Set();
  for (const item of plan.identity) {
    if (item.folder) migrateFolders.push(item.folder);
    else migrateFolders.push(...specFoldersUnder(abs(item.entry.to)));
    repairRoots.add(item.entry.to);
  }
  for (const entry of plan.done) repairRoots.add(entry.to);
  if (migrateFolders.length) {
    const args = ['--import', TOOLS.tsxLoader, TOOLS.migrate, ...[...new Set(migrateFolders)].flatMap((folder) => ['--only', folder])];
    if (!childStep('description identity (migrate-generated-json --only)', 'node', args)) return false;
  }
  for (const root of [...repairRoots].sort()) {
    if (!childStep(`graph identity and pointers specs/${root} (repair-derived)`, 'node', [TOOLS.repair, '--roots', `specs/${root}`, '--apply'])) return false;
  }
  const touched = [...plan.touched, ...plan.followUp].filter((packet) => fs.existsSync(packet));
  if (touched.length) {
    if (!childStep('re-derive packets whose references changed (repair-derived)', 'node', [TOOLS.repair, ...touched.flatMap((packet) => ['--folder', rel(packet)]), '--apply'])) return false;
  }

  if (plan.trackWork.length) {
    const known = new Set(readWorkingTreeTracks(SPECS).map((track) => track.name));
    const names = plan.trackWork.filter((name) => known.has(name));
    if (names.length && !childStep('track roots (refresh-track-roots)', 'node', [TOOLS.refresh, ...names.flatMap((name) => ['--track', name]), '--apply'])) return false;
  }

  if (plan.unrecorded.length && !step('ledger', () => {
    const ledger = readLedger();
    const head = runChild('git', ['rev-parse', 'HEAD']);
    ledger.batches.push({
      applied_at: new Date().toISOString(),
      base_commit: head.ok ? head.stdout.trim() : null,
      moves: plan.unrecorded.map((entry) => ({ from: entry.from, to: entry.to })),
    });
    writeAtomic(LEDGER, `${JSON.stringify(ledger, null, 2)}\n`);
    return `${plan.unrecorded.length} move(s)`;
  })) return false;

  if (!childStep('redirect table (cite-drift-scan --rebuild-redirects)', 'node', [TOOLS.citeDrift, '--rebuild-redirects', REDIRECTS])) return false;
  if (!childStep('trigger index (generate-trigger-index)', 'node', [TOOLS.triggerIndex, '--quiet'])) return false;
  return true;
}

// The close is last so its verdict is what the run ends on: the sweep, then
// each moved packet's own validation, whose RESULT line is the final word.
function closeRun(plan) {
  let ok = true;
  const sweep = runChild('node', [TOOLS.sweep]);
  out(`close sweep-track-roots: ${sweep.ok ? 'ok' : `FAILED ${sweep.why}`}`);
  if (!sweep.ok) {
    for (const line of tail(sweep.stdout, 6)) out(`    ${line}`);
    ok = false;
  }
  for (const entry of plan.entries) {
    const result = runChild('bash', [TOOLS.validate, `specs/${entry.to}`, '--strict']);
    const verdict = `${result.stdout}\n${result.stderr}`.split('\n').filter((line) => /RESULT:/.test(line)).map((line) => line.replace(/\x1b\[[0-9;]*m/g, '').trim());
    if (!result.ok) {
      ok = false;
      // The failing rules and the summary, not the passing ones around them.
      const lines = result.stdout.split('\n').map((line) => line.replace(/\x1b\[[0-9;]*m/g, '').trimEnd());
      for (const line of lines.filter((text) => /^\s*x /.test(text) || /^\s*Summary:/.test(text))) out(`    ${line.trim()}`);
    }
    out(`close validate specs/${entry.to}: ${verdict.length ? verdict[verdict.length - 1] : `no RESULT line (${result.why})`}`);
  }
  return ok;
}

// ───────────────────────────────────────────────────────────────────
// 10. SUB-TRACK DECLARATION
// ───────────────────────────────────────────────────────────────────

function runDeclare(raw, apply) {
  const refusals = [];
  const id = normalizeId(raw, '--declare-subtrack', refusals);
  if (id === null) return refuse(refusals);
  const segments = id.split('/');
  if (segments.length !== 2 || !isContainerName(segments[0]) || !isContainerName(segments[1])) {
    return refuse([`--declare-subtrack specs/${id}: needs <track>/<name>, both plain folder names`]);
  }
  if (!confine(id, '--declare-subtrack', refusals)) return refuse(refusals);
  const [track] = segments;
  const trackDir = abs(track);
  if (!isDir(trackDir) || fs.existsSync(path.join(trackDir, 'spec.md')) || !fs.existsSync(path.join(trackDir, 'graph-metadata.json'))) {
    return refuse([`--declare-subtrack specs/${id}: specs/${track} is not a track root with graph-metadata.json`]);
  }
  const dir = abs(id);
  if (fs.existsSync(path.join(dir, 'spec.md'))) return refuse([`--declare-subtrack specs/${id}: holds spec.md, so it is a packet`]);
  // A sub-track beside flat packets is a mixed track, which the sweep and the
  // pre-push gate refuse. Moving those packets is a map, which declares the
  // sub-tracks it names in the same run.
  const flat = trackLayout(trackChildren(track)).packets;
  if (flat.length) {
    return refuse([`--declare-subtrack specs/${id}: specs/${track} holds flat packets (${flat.join(', ')}); move them with --map into specs/${id}/ instead`]);
  }

  const work = [];
  if (!isDeclaredSubtrack(dir)) work.push(`write specs/${id}/description.json (level sub-track)`);
  if (!fs.existsSync(path.join(dir, 'graph-metadata.json'))) work.push(`create specs/${id}/graph-metadata.json (refresh-track-roots)`);
  if (!fs.existsSync(path.join(dir, ARCHIVE, '.gitkeep'))) work.push(`create specs/${id}/${ARCHIVE}/.gitkeep`);
  const trackMeta = parseTrackMetadata(readText(path.join(trackDir, 'graph-metadata.json')));
  const listed = trackMeta && Array.isArray(trackMeta.children_ids) && trackMeta.children_ids.some((child) => String(child).endsWith(`/${segments[1]}`));
  if (!listed) work.push(`list ${segments[1]} in specs/${track}/graph-metadata.json (refresh-track-roots)`);

  out(`${SCRIPT}: ${apply ? 'applying' : 'dry run, nothing written (pass --apply to write)'}`);
  for (const line of work) out(`  ${line}`);
  if (!work.length) {
    out(`  specs/${id} is already a declared sub-track; nothing to do`);
    return 0;
  }
  if (!apply) return 1;
  if (!step('declare sub-track', () => {
    declareSubtrack(id);
    return `specs/${id}`;
  })) return 2;
  if (!childStep('track roots (refresh-track-roots)', 'node', [TOOLS.refresh, '--track', id, '--track', track, '--apply'])) return 2;
  return 0;
}

// ───────────────────────────────────────────────────────────────────
// 11. ENTRY POINT
// ───────────────────────────────────────────────────────────────────

function refuse(refusals) {
  for (const line of refusals) process.stderr.write(`${SCRIPT}: refused: ${line}\n`);
  process.stderr.write(`${SCRIPT}: nothing was written\n`);
  return 2;
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  if (!isDir(SPECS)) throw new UsageError(`run this from the repository root: ${rel(SPECS)} is not here`);
  for (const tool of [TOOLS.repair, TOOLS.refresh, TOOLS.sweep, TOOLS.validate]) {
    if (!fs.existsSync(tool)) throw new UsageError(`missing tool: ${tool}`);
  }
  if (options.declare !== null) return runDeclare(options.declare, options.apply);

  const refusals = [];
  let rawEntries;
  if (options.map !== null) rawEntries = loadMap(options.map, refusals);
  else if (options.renumber !== null) rawEntries = renumberEntries(options.renumber, refusals);
  else rawEntries = [{ rawFrom: options.from, rawTo: options.to }];
  if (refusals.length) return refuse(refusals);
  if (rawEntries.length === 0) {
    out(`${SCRIPT}: no moves to make; nothing to do`);
    return 0;
  }

  const { entries, newSubtracks } = preflight(rawEntries, refusals);
  if (refusals.length) return refuse(refusals);
  if (entries.length === 0) {
    out(`${SCRIPT}: every entry already names its own place; nothing to do`);
    return 0;
  }

  const codeHits = scanCode(entries);
  if (codeHits.length) {
    return refuse([
      ...codeHits.map((hit) => `${hit}; code and CI are never rewritten here, update them in the same change`),
    ]);
  }

  const inputs = new Set(options.map !== null ? [path.resolve(REPO, options.map)] : []);
  const plan = buildPlan(entries, newSubtracks, inputs);

  // Uncommitted work on a path this run would move or rewrite could not be told
  // apart from the run's own changes afterwards. A rerun that completes an applied
  // map works on this tool's own output, so it is not held to the check.
  let tracked = new Set();
  if (plan.pending.length > 0) {
    const state = gitState();
    if (!state) return refuse(['git status failed; the dirty-tree check needs a git work tree']);
    tracked = state.tracked;
    const dirtyRefusals = [];
    for (const entry of plan.pending) {
      const fromRel = `specs/${entry.from}`;
      if (anyUnder(state.tracked, fromRel) && anyUnder(state.dirty, fromRel)) dirtyRefusals.push(`from ${fromRel}: has uncommitted changes`);
    }
    const untrackedSources = plan.pending.map((entry) => `specs/${entry.from}`).filter((fromRel) => !anyUnder(state.tracked, fromRel));
    const affected = [...plan.rewrites.map((rewrite) => rel(rewrite.file))];
    for (const name of plan.trackWork) affected.push(`specs/${name}/graph-metadata.json`);
    for (const file of affected) {
      if (untrackedSources.some((source) => file.startsWith(`${source}/`))) continue;
      if (state.dirty.has(file)) dirtyRefusals.push(`${file}: has uncommitted changes and would be rewritten`);
    }
    if (dirtyRefusals.length) return refuse(dirtyRefusals);
  }

  printPlan(plan, options.apply);
  if (!hasWork(plan)) {
    out(`${SCRIPT}: nothing to do`);
    return 0;
  }
  if (!options.apply) return 1;

  out('');
  if (!applyPlan(plan, tracked)) {
    out(`${SCRIPT}: stopped; the report above names the failed step. Rerun the same map to finish it.`);
    return 2;
  }
  out(`${SCRIPT}: applied ${plan.pending.length} move(s)${plan.done.length ? `, finished ${plan.done.length} earlier move(s)` : ''}`);
  out('');
  return closeRun(plan) ? 0 : 2;
}

// A reader that closes early is not a failure.
for (const stream of [process.stdout, process.stderr]) {
  stream.on('error', (err) => {
    if (err && err.code !== 'EPIPE') process.exitCode = 2;
  });
}

try {
  process.exitCode = main();
} catch (err) {
  if (err instanceof UsageError) process.stderr.write(`${SCRIPT}: ${err.message}\n${USAGE}\n`);
  else process.stderr.write(`${SCRIPT} failed: ${(err && err.stack) || err}\n`);
  process.exitCode = 2;
}

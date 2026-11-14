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
//             2 = a rejected argument, a refused plan or a step that failed,
//             3 = --apply landed every step and the close sweep, and only a
//                 moved packet's own validation failed; a rerun finds nothing.
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

// The steps after the ledger write whose work lives outside the packet tree.
// Each passing step marks its ledger batch, so a rerun can tell which one
// stopped the earlier run and finish it instead of finding nothing to do.
const LATE_STEPS = ['redirects', 'triggerIndex', 'sweep'];

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

// The one row a packet summary records its own folder in. The repair writer
// owns that row after a move; the reference pass writes it too, so a bare old
// name is not left behind while the rest of the document is being rewritten.
const SPEC_FOLDER_ROW = /(\|[ \t]*\*\*Spec Folder\*\*[ \t]*\|[ \t]*)([^|\r\n]+?)([ \t]*\|)/;

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

function statOrNull(file) {
  try {
    return fs.statSync(file);
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

// Whether the volume that holds specs/ folds case. The duplicate checks may
// fold the unwritten part of a path only where it does; the specs root answers
// that by naming the same folder under a flipped spelling, with no probe file.
let caseFolds;
function volumeFoldsCase() {
  if (caseFolds !== undefined) return caseFolds;
  const spelled = statOrNull(SPECS);
  const flipped = statOrNull(path.join(path.dirname(SPECS), path.basename(SPECS).toUpperCase()));
  caseFolds = Boolean(spelled && flipped && spelled.dev === flipped.dev && spelled.ino === flipped.ino);
  return caseFolds;
}

/**
 * One key per folder for the duplicate checks. An existing folder is its
 * device and inode, so a spelling the tree does not use still names it. A
 * folder that does not exist yet is its longest existing parent's device and
 * inode plus the rest of the path, folded where the volume folds case, so two
 * ways of writing the same future folder compare equal before either move
 * creates it.
 */
function folderIdentity(id) {
  let current = abs(id);
  const rest = [];
  let stat = statOrNull(current);
  while (!stat && path.dirname(current) !== current) {
    rest.unshift(path.basename(current));
    current = path.dirname(current);
    stat = statOrNull(current);
  }
  if (!stat) return null;
  const prefix = `${stat.dev}:${stat.ino}`;
  if (rest.length === 0) return prefix;
  const tail = rest.join('/');
  return `${prefix}\0${volumeFoldsCase() ? tail.toLowerCase() : tail}`;
}

/**
 * Builds and checks the plan. Returns { entries, newSubtracks } with each entry
 * marked pending or done, or pushes refusals.
 */
function preflight(rawEntries, refusals) {
  const entries = [];
  const ledger = readLedger();
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
    else if (!fromThere && toThere) {
      if (recordedMove(entry, ledger)) entry.state = 'done';
      else refusals.push(`from specs/${entry.from}: does not exist, and neither the relocation record nor git shows a move to specs/${entry.to}; if this map moved the folder earlier, move specs/${entry.to} back to specs/${entry.from} and rerun the map`);
    } else if (fromThere && toThere) refusals.push(`to specs/${entry.to}: already exists (collision with the move from specs/${entry.from})`);
    else refusals.push(`from specs/${entry.from}: does not exist, and neither does specs/${entry.to}`);
  }

  const froms = new Map(entries.map((entry) => [entry.from, entry]));
  const sources = new Map();
  const tos = new Map();
  for (const entry of entries) {
    const source = folderIdentity(entry.from);
    const target = folderIdentity(entry.to);
    if (target !== null) {
      if (tos.has(target)) {
        const prior = tos.get(target);
        refusals.push(`to specs/${entry.to}: named by two entries (specs/${prior.from} -> specs/${prior.to} and specs/${entry.from} -> specs/${entry.to})`);
      }
      tos.set(target, entry);
    }
    if (source !== null) {
      if (sources.has(source)) {
        const prior = sources.get(source);
        refusals.push(`from specs/${entry.from}: named by two entries (specs/${prior.from} -> specs/${prior.to} and specs/${entry.from} -> specs/${entry.to})`);
      }
      sources.set(source, entry);
    }
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

/**
 * The id a packet had before it was archived, keyed to the destination it now
 * names: the source id with its z_archive folder removed, for an entry that
 * leaves the archive. The reference pass rewrites that spelling too, because a
 * document written before the packet was archived still names it. A folder
 * that already lives at the old id, or another entry of the same plan that
 * claims it, keeps the alias out: a reference then names something else and
 * must stay as written.
 */
function preArchiveAliases(entries) {
  const claimed = new Set(entries.flatMap((entry) => [entry.from, entry.to]));
  const aliases = new Map();
  for (const entry of entries) {
    const parent = parentId(entry.from);
    if (baseName(parent) !== ARCHIVE) continue;
    if (entry.to.split('/').slice(0, -1).includes(ARCHIVE)) continue;
    const home = parentId(parent);
    const id = home === '' ? baseName(entry.from) : `${home}/${baseName(entry.from)}`;
    if (claimed.has(id) || lstat(abs(id)) !== null) continue;
    aliases.set(id, entry.to);
  }
  return aliases;
}

/**
 * The files where a renumber inside one phase parent may leave a child's bare
 * folder name: the parent's own map, handoff and goal documents, each child's
 * neighbour rows, and the moved child's own location row. A name anywhere else
 * is too common to touch.
 */
function bareNameEdits(entries) {
  const names = new Map();
  const summaryRows = new Map();
  const addName = (file, from, to) => {
    if (!names.has(file)) names.set(file, new Map());
    names.get(file).set(from, to);
  };
  for (const entry of entries) {
    const fromParent = parentId(entry.from);
    const toParent = parentId(entry.to);
    // A re-parent or a move at the specs root renames no sibling in place.
    if (fromParent === '' || fromParent !== toParent) continue;
    if (!PACKET_NAME.test(baseName(fromParent)) || !fs.existsSync(path.join(abs(fromParent), 'spec.md'))) continue;
    const from = baseName(entry.from);
    const to = baseName(entry.to);
    if (from === to) continue;
    const parentDir = abs(fromParent);
    addName(path.join(parentDir, 'spec.md'), from, to);
    addName(path.join(parentDir, 'goal.md'), from, to);
    for (const child of numberedDirs(parentDir)) addName(path.join(parentDir, child, 'spec.md'), from, to);
    // Planning reads the folder where it still sits; a finished move is read
    // where it landed.
    const summary = entry.state === 'done' ? abs(entry.to) : abs(entry.from);
    summaryRows.set(path.join(summary, 'implementation-summary.md'), { from, to });
  }
  return { names, summaryRows };
}

/** The cells of one markdown table row, or null for a line outside a table. */
function tableCells(line) {
  const trimmed = line.trim();
  if (!trimmed.startsWith('|')) return null;
  const body = trimmed.slice(1, trimmed.endsWith('|') ? -1 : undefined);
  return body.split('|').map((cell) => cell.trim());
}

/** The table a header row opens, named by the document that owns it. */
function tableKind(cells) {
  if (!cells || cells.length < 2) return null;
  if (cells[0] === 'Phase' && cells[1] === 'Folder') return 'map';
  if (cells[0] === 'From' && cells[1] === 'To') return 'handoff';
  if (cells[0] === 'Phase' && /goal/i.test(cells.slice(1).join(' '))) return 'binding';
  return null;
}

/** Every markdown table a document holds, as a header line and an exclusive end. */
function markdownTables(lines) {
  const tables = [];
  for (let index = 0; index < lines.length; index += 1) {
    const kind = tableKind(tableCells(lines[index]));
    if (!kind) continue;
    let end = index + 1;
    while (end < lines.length && tableCells(lines[end])) end += 1;
    tables.push({ kind, start: index, end });
    index = end - 1;
  }
  return tables;
}

/** A cell that names a folder, without decoration or a trailing slash. */
function tableRowName(cell) {
  return String(cell || '').replace(/`/g, '').trim().replace(/\/+$/, '');
}

/** A bare folder name replaced only where it stands as a whole name. */
function replaceBareName(text, from, to) {
  return text.replace(bareNamePattern(new Map([[from, to]])), to);
}

/**
 * The rows a re-parent must move between the old and new parent. The old
 * parent's map, handoff and binding rows name a folder it no longer holds, and
 * the new parent needs its own rows. Each row this plan changes is reported,
 * so an operator can see the document edit beside the folder move.
 */
function phaseRowEdits(entries) {
  const files = new Map();
  const ensure = (file, label) => {
    if (!files.has(file)) files.set(file, { label, ops: [] });
    return files.get(file);
  };
  const addNote = (item, text) => {
    if (!item.ops.some((op) => op.kind === 'note' && op.text === text)) item.ops.push({ kind: 'note', text });
  };
  const isPhaseParent = (id) => id !== '' && PACKET_NAME.test(baseName(id))
    && fs.existsSync(path.join(abs(id), 'spec.md'));
  const row = (text, kind, match) => {
    if (text === null) return null;
    const lines = text.split('\n');
    for (const table of markdownTables(lines)) {
      if (table.kind !== kind) continue;
      for (let index = table.start; index < table.end; index += 1) {
        const cells = tableCells(lines[index]);
        if (cells && match(cells)) return cells;
      }
    }
    return null;
  };

  for (const entry of entries.filter((item) => item.state === 'pending')) {
    const oldParent = parentId(entry.from);
    const newParent = parentId(entry.to);
    if (oldParent === newParent) continue;
    const oldIsPhase = isPhaseParent(oldParent);
    const newIsPhase = isPhaseParent(newParent);
    if (!oldIsPhase && !newIsPhase) continue;
    const oldName = baseName(entry.from);
    const newName = baseName(entry.to);

    if (oldIsPhase) {
      const oldSpec = path.join(abs(oldParent), 'spec.md');
      const oldItem = ensure(oldSpec, `specs/${oldParent}/spec.md`);
      oldItem.ops.push({ kind: 'removeMap', name: oldName });
      oldItem.ops.push({ kind: 'removeHandoff', name: oldName });

      const oldGoal = path.join(abs(oldParent), 'goal.md');
      if (fs.existsSync(oldGoal)) {
        ensure(oldGoal, `specs/${oldParent}/goal.md`).ops.push({ kind: 'removeBinding', name: oldName });
      }

      // A sibling that named the moved phase takes the nearest phase left on
      // that side, so the chain skips the gap instead of pointing at nothing.
      const remaining = numberedDirs(abs(oldParent)).filter((name) => name !== oldName).sort();
      const predecessor = [...remaining].reverse().find((name) => name < oldName) || 'None';
      const successor = remaining.find((name) => name > oldName) || 'None';
      for (const sibling of remaining) {
        const siblingSpec = path.join(abs(oldParent), sibling, 'spec.md');
        if (!fs.existsSync(siblingSpec)) continue;
        const item = ensure(siblingSpec, `specs/${oldParent}/${sibling}/spec.md`);
        item.ops.push({ kind: 'setNeighbour', row: 'Predecessor', expect: oldName, value: predecessor });
        item.ops.push({ kind: 'setNeighbour', row: 'Successor', expect: oldName, value: successor });
      }
    }

    if (newIsPhase) {
      const newSpec = path.join(abs(newParent), 'spec.md');
      const newItem = ensure(newSpec, `specs/${newParent}/spec.md`);
      const oldSpecText = oldIsPhase ? readText(path.join(abs(oldParent), 'spec.md')) : null;
      const oldRow = row(oldSpecText, 'map', (cells) => tableRowName(cells[1]) === oldName);
      if (oldRow) {
        const number = Number(newName.slice(0, 3));
        const focus = oldRow[2] || '';
        const status = oldRow[3] || '';
        newItem.ops.push({
          kind: 'addTableRow',
          table: 'map',
          name: newName,
          row: `| ${number} | ${newName}/ | ${focus} | ${status} |`,
          missing: 'no map row added (no Phase Documentation Map)',
          note: `add map row ${newName}`,
          before: (cells) => Number(cells[0]) > number,
        });
      } else {
        addNote(newItem, `no map row added (old parent has no map row for ${oldName})`);
      }
      // Handoff criteria describe the work between two phases, which a move
      // cannot recover, so the new parent gets the map and binding rows only.
      addNote(newItem, 'no handoff row added (criteria cannot be derived)');

      const newGoal = path.join(abs(newParent), 'goal.md');
      if (fs.existsSync(newGoal)) {
        const oldGoalText = oldIsPhase ? readText(path.join(abs(oldParent), 'goal.md')) : null;
        const oldBinding = row(oldGoalText, 'binding', (cells) => tableRowName(cells[0]) === oldName);
        const bindingRow = oldBinding
          ? `| ${oldBinding.map((cell) => replaceBareName(cell, oldName, newName)).join(' | ')} |`
          : `| ${newName} | \`${newName}/goal.md\` |`;
        ensure(newGoal, `specs/${newParent}/goal.md`).ops.push({
          kind: 'addTableRow',
          table: 'binding',
          name: newName,
          row: bindingRow,
          missing: 'no binding row added (no binding table)',
          note: `add binding row ${newName}`,
          before: (cells) => tableRowName(cells[0]) > newName,
        });
      }
    }

    // The moved child's own neighbours belong to the parent it now sits in. A
    // destination that is not a phase parent leaves it with no phase neighbour.
    const childSpec = path.join(abs(entry.from), 'spec.md');
    if ((oldIsPhase || newIsPhase) && fs.existsSync(childSpec)) {
      const children = newIsPhase
        ? [...numberedDirs(abs(newParent)).filter((name) => name !== newName), newName].sort()
        : [];
      const at = children.indexOf(newName);
      const predecessor = at > 0 ? children[at - 1] : 'None';
      const successor = at >= 0 && at < children.length - 1 ? children[at + 1] : 'None';
      const item = ensure(childSpec, `specs/${entry.to}/spec.md`);
      item.ops.push({ kind: 'setNeighbour', row: 'Predecessor', value: predecessor });
      item.ops.push({ kind: 'setNeighbour', row: 'Successor', value: successor });
    }
  }
  return files;
}

/** A markdown alignment row, which is not a data row. */
function tableSeparator(cells) {
  return cells.length > 0 && cells.every((cell) => /^:?-{3,}:?$/.test(cell.replace(/\s/g, '')));
}

/** Removes the rows one predicate names, with the report line for each. */
function removeTableRows(text, kind, describe) {
  const lines = text.split('\n');
  const drop = new Set();
  const notes = [];
  for (const table of markdownTables(lines)) {
    if (table.kind !== kind) continue;
    for (let index = table.start; index < table.end; index += 1) {
      const cells = tableCells(lines[index]);
      if (!cells) continue;
      const note = describe(cells);
      if (!note) continue;
      drop.add(index);
      notes.push(note);
    }
  }
  return { text: drop.size ? lines.filter((_, index) => !drop.has(index)).join('\n') : text, notes, changes: drop.size };
}

/** Sets one neighbour row when its current value is the one expected. */
function setNeighbourRow(text, op) {
  const lines = text.split('\n');
  const notes = [];
  let changes = 0;
  for (let index = 0; index < lines.length; index += 1) {
    const cells = tableCells(lines[index]);
    if (!cells || cells.length < 2) continue;
    if (cells[0].replace(/\*\*/g, '').trim() !== op.row) continue;
    const current = tableRowName(cells[1]);
    if (op.expect !== undefined && current !== op.expect) continue;
    if (current === op.value) continue;
    const next = lines[index].replace(
      /^(\s*\|[^|]*\|)([^|]*)(\|.*)$/,
      (match, head, value, tail) => `${head} ${op.value} ${tail}`,
    );
    if (next === lines[index]) continue;
    lines[index] = next;
    notes.push(`set ${op.row} ${current} -> ${op.value}`);
    changes += 1;
  }
  return { text: lines.join('\n'), notes, changes };
}

/** Adds one row to a table, in number or name order, or reports why it cannot. */
function addTableRow(text, op) {
  const lines = text.split('\n');
  const table = markdownTables(lines).find((candidate) => candidate.kind === op.table);
  if (!table) return { text, notes: [op.missing], changes: 0 };
  for (let index = table.start; index < table.end; index += 1) {
    const cells = tableCells(lines[index]);
    if (!cells) continue;
    const present = op.table === 'map' ? tableRowName(cells[1]) === op.name : tableRowName(cells[0]) === op.name;
    if (present) return { text, notes: [], changes: 0 };
  }
  let at = table.end;
  for (let index = table.start + 2; index < table.end; index += 1) {
    const cells = tableCells(lines[index]);
    if (!cells || tableSeparator(cells)) continue;
    if (op.before(cells)) {
      at = index;
      break;
    }
  }
  lines.splice(at, 0, op.row);
  return { text: lines.join('\n'), notes: [op.note], changes: 1 };
}

/** Applies one file's row plan, returning the new text and the report lines. */
function applyPhaseRows(text, edit) {
  let result = text;
  let changes = 0;
  const notes = [];
  for (const op of edit.ops) {
    let applied = null;
    if (op.kind === 'removeMap') {
      applied = removeTableRows(result, 'map', (cells) => (tableRowName(cells[1]) === op.name ? `remove map row ${op.name}` : null));
    } else if (op.kind === 'removeHandoff') {
      applied = removeTableRows(result, 'handoff', (cells) => (
        tableRowName(cells[0]) === op.name || tableRowName(cells[1]) === op.name ? `remove handoff row ${op.name}` : null
      ));
    } else if (op.kind === 'removeBinding') {
      applied = removeTableRows(result, 'binding', (cells) => (tableRowName(cells[0]) === op.name ? `remove binding row ${op.name}` : null));
    } else if (op.kind === 'setNeighbour') {
      applied = setNeighbourRow(result, op);
    } else if (op.kind === 'addTableRow') {
      applied = addTableRow(result, op);
    } else if (op.kind === 'note') {
      notes.push(op.text);
      continue;
    }
    if (!applied) continue;
    result = applied.text;
    changes += applied.changes;
    notes.push(...applied.notes);
  }
  return { text: result, changes, notes: notes.map((note) => `${edit.label}: ${note}`) };
}

/** The regex that finds one of the bare names, bounded as a folder name is. */
function bareNamePattern(names) {
  const alternatives = [...names.keys()].sort((a, b) => b.length - a.length).map(escapeRegExp);
  return new RegExp(`(?<![${SEGMENT_CHAR}])(${alternatives.join('|')})(?![${SEGMENT_CHAR}])`, 'g');
}

/** The summary text with a stale folder row set to the moved name, or null. */
function rewrittenSummaryRow(text, edit) {
  const hit = SPEC_FOLDER_ROW.exec(text);
  if (!hit) return null;
  const next = hit[2].replace(bareNamePattern(new Map([[edit.from, edit.to]])), edit.to);
  if (next === hit[2]) return null;
  return text.slice(0, hit.index) + hit[1] + next + hit[3] + text.slice(hit.index + hit[0].length);
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
 * an old id wherever it is written in full, then the bare-name pass rewrites a
 * child's name in the few documents its phase parent owns. A relative markdown
 * link cannot be matched by id, so it is resolved: a link that works now and
 * whose target or whose own file moves is recomputed from the new places, and
 * a link that is broken now is repaired only when it pointed into a folder that
 * already moved.
 */
function buildTransform(entries, bare = { names: new Map(), summaryRows: new Map() }, phaseRows = new Map()) {
  const idMap = new Map(entries.map((entry) => [entry.from, entry.to]));
  // The archive spelling and the id the packet had before it was archived name
  // the same source, so both map to where the packet lands.
  for (const [alias, to] of preArchiveAliases(entries)) idMap.set(alias, to);
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
    // Bare names run after whole ids so the tail of a full id is not rewritten
    // on its own before the whole id can be matched.
    const names = bare.names.get(file);
    if (names) {
      result = result.replace(bareNamePattern(names), (match) => {
        changes += 1;
        return names.get(match);
      });
    }
    const summaryRow = bare.summaryRows.get(file);
    if (summaryRow) {
      const next = rewrittenSummaryRow(result, summaryRow);
      if (next !== null) {
        result = next;
        changes += 1;
      }
    }
    // A re-parent moves rows rather than renaming a sibling in place, so its
    // documents are edited here after the reference passes finish.
    let notes = [];
    const rowEdit = phaseRows.get(file);
    if (rowEdit) {
      const applied = applyPhaseRows(result, rowEdit);
      result = applied.text;
      changes += applied.changes;
      notes = applied.notes;
    }
    return { text: result, changes, notes };
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

/** The ancestor names a folder id implies, outermost first. */
function parentChainOf(id) {
  return id.split('/').slice(0, -1);
}

/** Whether a recorded parent chain is exactly the chain a place implies. */
function sameChain(recorded, implied) {
  return Array.isArray(recorded)
    && recorded.length === implied.length
    && recorded.every((name, index) => name === implied[index]);
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
    // The reference rewrite updates the stored folder path but leaves this
    // derived chain alone, so only the chain that still names the old place
    // marks the failed migration as work a rerun can finish.
    if (sameChain(description.parentChain, parentChainOf(oldId)) && !sameChain(description.parentChain, parentChainOf(id))) {
      reasons.push('description parentChain');
    }
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

function batchOf(ledger, entry) {
  return ledger.batches.find((batch) => Array.isArray(batch.moves) && batch.moves.some((move) => move.from === entry.from && move.to === entry.to)) || null;
}

function ledgerHas(ledger, entry) {
  return batchOf(ledger, entry) !== null;
}

/**
 * Whether a record shows that the map already moved this entry: the relocation
 * record holds the pair, or git holds the source at HEAD but not the
 * destination, which is a tracked move left uncommitted. A plain rename of an
 * untracked folder leaves neither record.
 */
function recordedMove(entry, ledger) {
  if (ledgerHas(ledger, entry)) return true;
  const atHead = (id) => runChild('git', ['rev-parse', '--verify', '--quiet', `HEAD:specs/${id}`]).ok;
  return atHead(entry.from) && !atHead(entry.to);
}

/** The late steps not yet marked as passed on every entry's ledger batch. */
function pendingLateSteps(ledger, entries) {
  return LATE_STEPS.filter((step) => entries.some((entry) => {
    const batch = batchOf(ledger, entry);
    return !batch || !batch.steps || batch.steps[step] !== true;
  }));
}

/** Records a late step that passed on the ledger batch holding each entry. */
function markLateStep(entries, step) {
  const ledger = readLedger();
  let changed = false;
  for (const entry of entries) {
    const batch = batchOf(ledger, entry);
    if (!batch) continue;
    if (!batch.steps || typeof batch.steps !== 'object' || Array.isArray(batch.steps)) batch.steps = {};
    if (batch.steps[step] !== true) {
      batch.steps[step] = true;
      changed = true;
    }
  }
  if (changed) writeAtomic(LEDGER, `${JSON.stringify(ledger, null, 2)}\n`);
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
  const transform = buildTransform(entries, bareNameEdits(entries), phaseRowEdits(entries));
  const editsByFile = childrenEdits(entries);
  const forwardPending = makePathMapper(entries.filter((entry) => entry.state === 'pending').map((entry) => [abs(entry.from), abs(entry.to)]));

  // One pass over every text file: the children edit first, so a re-parented id
  // is dropped rather than renamed in its old parent, then the reference rewrite.
  const rewrites = [];
  const childNotes = [];
  const phaseNotes = [];
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
    for (const note of result.notes) phaseNotes.push(`phase row ${note}`);
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
  const lateSteps = pendingLateSteps(ledger, entries);

  for (const packet of touched) followUp.delete(packet);
  return { entries, pending, done, newSubtracks, rewrites, childNotes, phaseNotes, identity, touched: [...touched].sort(), followUp: [...followUp].sort(), trackWork, unrecorded, lateSteps };
}

function hasWork(plan) {
  return plan.pending.length > 0 || plan.newSubtracks.size > 0 || plan.rewrites.length > 0
    || plan.identity.length > 0 || plan.trackWork.length > 0 || plan.unrecorded.length > 0
    || plan.lateSteps.length > 0;
}

function printPlan(plan, apply) {
  out(`${SCRIPT}: ${apply ? 'applying' : 'dry run, nothing written (pass --apply to write)'}`);
  for (const sub of [...plan.newSubtracks].sort()) out(`  declare  specs/${sub} (sub-track)`);
  for (const entry of plan.entries) {
    if (entry.state === 'pending') out(`  move     specs/${entry.from} -> specs/${entry.to}`);
    else out(`  moved    specs/${entry.from} -> specs/${entry.to} (already at its destination)`);
  }
  for (const note of plan.childNotes) out(`  ${note}`);
  for (const note of plan.phaseNotes) out(`  ${note}`);
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
      steps: {},
      moves: plan.unrecorded.map((entry) => ({ from: entry.from, to: entry.to })),
    });
    writeAtomic(LEDGER, `${JSON.stringify(ledger, null, 2)}\n`);
    return `${plan.unrecorded.length} move(s)`;
  })) return false;

  if (!childStep('redirect table (cite-drift-scan --rebuild-redirects)', 'node', [TOOLS.citeDrift, '--rebuild-redirects', REDIRECTS])) return false;
  markLateStep(plan.entries, 'redirects');
  if (!childStep('trigger index (generate-trigger-index)', 'node', [TOOLS.triggerIndex, '--quiet'])) return false;
  markLateStep(plan.entries, 'triggerIndex');
  return true;
}

// The close is last so its verdict is what the run ends on: the sweep, then
// each moved packet's own validation, whose RESULT line is the final word. A
// failed packet verdict gets its own status, because the move itself landed;
// a failed sweep still means the run did not finish.
function closeRun(plan) {
  let status = 0;
  const sweep = runChild('node', [TOOLS.sweep]);
  out(`close sweep-track-roots: ${sweep.ok ? 'ok' : `FAILED ${sweep.why}`}`);
  if (sweep.ok) {
    // The sweep passing is the completion mark for the close. A packet's own
    // failing verdict below is reported but never keeps the map open.
    markLateStep(plan.entries, 'sweep');
  } else {
    for (const line of tail(sweep.stdout, 6)) out(`    ${line}`);
    status = 2;
  }
  for (const entry of plan.entries) {
    const result = runChild('bash', [TOOLS.validate, `specs/${entry.to}`, '--strict']);
    const verdict = `${result.stdout}\n${result.stderr}`.split('\n').filter((line) => /RESULT:/.test(line)).map((line) => line.replace(/\x1b\[[0-9;]*m/g, '').trim());
    if (!result.ok) {
      // The move landed, so the packet's own verdict does not reopen it.
      if (status === 0) status = 3;
      // The failing rules and the summary, not the passing ones around them.
      const lines = result.stdout.split('\n').map((line) => line.replace(/\x1b\[[0-9;]*m/g, '').trimEnd());
      for (const line of lines.filter((text) => /^\s*x /.test(text) || /^\s*Summary:/.test(text))) out(`    ${line.trim()}`);
    }
    out(`close validate specs/${entry.to}: ${verdict.length ? verdict[verdict.length - 1] : `no RESULT line (${result.why})`}`);
  }
  return status;
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
    // A staged move makes every file under a destination this map already
    // reached look uncommitted. That dirt is the run's own earlier output, so
    // rewriting it finishes the interrupted step instead of refusing on it.
    const movedDestinations = plan.done.map((entry) => `specs/${entry.to}`);
    const affected = [...plan.rewrites.map((rewrite) => rel(rewrite.file))];
    for (const name of plan.trackWork) affected.push(`specs/${name}/graph-metadata.json`);
    for (const file of affected) {
      if (untrackedSources.some((source) => file.startsWith(`${source}/`))) continue;
      if (movedDestinations.some((destination) => file === destination || file.startsWith(`${destination}/`))) continue;
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
  return closeRun(plan);
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

#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Shipped Instruction Embed Engine
// ───────────────────────────────────────────────────────────────────
'use strict';

// A repository that took the shipped instruction template keeps its own lines somewhere
// the template does not know about: at the top of the file, inside a section somebody
// edited, in the Claude copy a previous install left behind. Replacing the file with the
// current template is therefore a deletion, and it is silent, because nothing in the
// repository records which of its lines belonged to it.
//
// So this engine never writes what it has not first shown and hashed. Composition happens
// in memory and produces one new document per target; the plan prints every target, the
// diff, the new block, the byte budget and the survival ledger, and hashes the composed
// bytes. The backup directory is named after that digest, so apply lands exactly where the
// plan pointed and the plan is the artefact the yes is given against. It backs up every
// path it will touch before the first byte, then writes only inside a fixed allowlist that
// is checked in code rather than described in a document.
//
// After the write it proves the composition against the bytes now on disk: every line the
// repository had, inside or outside the template, must still be there, and every line
// outside the repository block must be one the template ships. A violation restores from
// the backup automatically and ends the run as a failure. The proof is a pure function so
// it can also be read and driven on its own, and it requires the old document's own lines
// rather than the parts the segmenter produced: a proof built from those parts can require
// only what the reader managed to place, and a line it placed nowhere goes unclaimed.
//
// The four carry groups, in order, are the shape a repository's own text keeps: the block
// it already had, the sections that match no shipped section, the local lines of a section
// somebody edited, and the unique lines of a runtime copy that is folded away. A section
// whose body is a released one is replaced with no carry, because every line of it is a
// line the template already ships.
//
// Usage: agents-md-embed.cjs <plan|apply|restore> [options]
// Exit codes: 0 nothing to do or done, 1 the proof failed or the run was cancelled,
//             2 a precondition failed or a path fell outside the allowlist

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const { spawnSync } = require('node:child_process');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { buildReport } = require('./agents-md-check.cjs');
const { classifyFile } = require('./release-update.cjs');
const {
  deliveryAnchorEnd,
  findBlock,
  segment,
  sha256,
} = require('./lib/agents-md-sections.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const TAG = '[agents-md-embed]';
const REPO_ROOT = path.resolve(__dirname, '../../../..');
const MANIFEST_PATH = path.resolve(__dirname, '../assets/agents-md-manifest.json');

// The two tools this engine calls instead of reimplementing: the pointer block belongs to
// its generator, and the router verdict belongs to the checker that ships with the skill
// authoring rules.
const POINTER_SYNC = path.join(REPO_ROOT, '.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-gate1-pointers.cjs');
const REPO_RULES_CHECKER = path.join(REPO_ROOT, '.skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs');
const REPO_RULES_TAG = '[repo-rules-check]';
const TOOL_TIMEOUT_MS = 120000;

const BACKUP_DIR = path.join('.skilled', 'output', 'doctor-agents-md');
const BACKUP_FALLBACK_DIR = 'doctor-agents-md';
// The digest is 64 hex characters and a path segment is better short, so the directory is
// named by its first 16. A plan and an apply that share a digest share the directory; 64
// bits of it is what makes two different plans sharing one a non-event.
const BACKUP_NAME_CHARS = 16;
// How many of this composition's directories a plan will step past before it gives up. The
// loop only moves when a directory is taken, so the number bounds a pathological tree, not
// a normal one.
const BACKUP_ATTEMPTS = 64;
const MIRROR_FILE = '.cursor/rules/repo-local.md';
const POINTER_FILE = '.cursor/rules/skill-routing.md';

// The whole write boundary, in one place. `skill-routing.md` is here because the run
// invokes the generator that owns it; this engine never composes a byte of it. Every write
// and every removal is checked against this list by `assertWritable` before it happens.
const ALLOWLIST = [
  'AGENTS.md',
  'CLAUDE.md',
  '.codex/AGENTS.md',
  '.cursor/rules/repo-local.md',
  '.cursor/rules/skill-routing.md',
  'REPO RULES.md',
];

// A copy at one of these paths is read for its unique lines and then removed. Every other
// runtime-copy row is reported by the check engine and left alone here.
const FOLDED_COPIES = ['CLAUDE.md', '.codex/AGENTS.md'];

const USAGE = [
  'Usage: node .skilled/commands/doctor/scripts/agents-md-embed.cjs <plan|apply|restore> [options]',
  '  plan                       compose in memory, print the targets, the diff, the new block, the',
  '                             budget, the survival ledger and the plan digest; write nothing',
  '  apply --plan-digest <d>    recompose, refuse a different digest, back up, then write',
  '  restore --run=<dir>        put back exactly the files one apply recorded',
  'Options:',
  '  --root <dir>               compose for this repository instead of the one this script ships in',
  '  --keep-claude-md           fold a divergent CLAUDE.md into the block but keep the file',
  '  --remove-claude-md         fold it and remove it (the default)',
  '  --create-router            create REPO RULES.md from the shipped rows when it is missing',
  '  --dry-run                  print the plan and write nothing',
  '  --yes                      take the restore confirmation as given',
  'Exit codes: 0 nothing to do or done, 1 the proof failed or the run was cancelled,',
  '            2 a precondition failed or a path fell outside the allowlist',
].join('\n');

// ─────────────────────────────────────────────────────────────────────────────
// 3. ERRORS
// ─────────────────────────────────────────────────────────────────────────────

class UsageError extends Error {}
class PreconditionError extends Error {}
class AllowlistError extends Error {}

// ─────────────────────────────────────────────────────────────────────────────
// 4. ARGUMENTS
// ─────────────────────────────────────────────────────────────────────────────

function readValue(argv, index, flag) {
  const argument = argv[index];
  const inline = argument.startsWith(`${flag}=`) ? argument.slice(flag.length + 1) : null;
  if (inline !== null) return { value: inline, next: index };
  const value = argv[index + 1];
  if (!value || value.startsWith('--')) throw new UsageError(`${flag} needs a value`);
  return { value, next: index + 1 };
}

function parseArgs(argv) {
  const options = {
    command: null,
    root: REPO_ROOT,
    digest: null,
    run: null,
    keepClaudeMd: false,
    createRouter: false,
    dryRun: false,
    yes: false,
    help: false,
  };

  const commands = [];
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === 'plan' || argument === 'apply' || argument === 'restore') commands.push(argument);
    else if (argument === '--root') {
      const read = readValue(argv, index, '--root');
      options.root = path.resolve(read.value);
      index = read.next;
    } else if (argument === '--plan-digest' || argument.startsWith('--plan-digest=')) {
      const read = readValue(argv, index, '--plan-digest');
      options.digest = read.value.trim();
      index = read.next;
    } else if (argument === '--run' || argument.startsWith('--run=')) {
      const read = readValue(argv, index, '--run');
      options.run = path.resolve(read.value);
      index = read.next;
    } else if (argument === '--keep-claude-md') options.keepClaudeMd = true;
    else if (argument === '--remove-claude-md') options.keepClaudeMd = false;
    else if (argument === '--create-router') options.createRouter = true;
    else if (argument === '--dry-run') options.dryRun = true;
    else if (argument === '--yes') options.yes = true;
    else if (argument === '--help' || argument === '-h') options.help = true;
    else throw new UsageError(`unknown argument: ${argument}`);
  }

  if (commands.length > 1) throw new UsageError(`plan, apply and restore are separate targets; got ${commands.join(', ')}`);
  options.command = commands.length === 1 ? commands[0] : null;
  return options;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. SMALL SHARED READERS
// ─────────────────────────────────────────────────────────────────────────────

function loadManifest() {
  if (!fs.existsSync(MANIFEST_PATH)) throw new PreconditionError(`the manifest is missing at ${MANIFEST_PATH}`);
  try {
    return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  } catch (error) {
    throw new PreconditionError(`${MANIFEST_PATH} is not valid JSON: ${error.message}`);
  }
}

function isSymlink(target) {
  try {
    return fs.lstatSync(target).isSymbolicLink();
  } catch {
    return false;
  }
}

function sameDirectory(a, b) {
  try {
    return fs.realpathSync(a) === fs.realpathSync(b);
  } catch {
    return false;
  }
}

// The undo a run prints must work as printed. A restore runs against this engine's own
// repository unless told otherwise, so the line names the root whenever it is another one.
function undoCommand(dir, root) {
  const base = `node .skilled/commands/doctor/scripts/agents-md-embed.cjs restore --run=${dir}`;
  return sameDirectory(root, REPO_ROOT) ? base : `${base} --root ${root}`;
}

// A line is compared trimmed, and the two lines that carry no content of their own are
// dropped, because a composition may legitimately re-place either of them.
function countLines(text) {
  const counts = new Map();
  for (const raw of String(text).split('\n')) {
    const line = raw.trim();
    if (line === '' || line === '---') continue;
    counts.set(line, (counts.get(line) || 0) + 1);
  }
  return counts;
}

function lineSet(text) {
  return new Set(countLines(text).keys());
}

function uniqueLines(text) {
  return [...countLines(text).keys()];
}

// How many lines a text holds, counting repeats: the ledger reports lines kept, and the
// same sentence written twice is two lines to keep.
function lineCount(text) {
  let total = 0;
  for (const count of countLines(text).values()) total += count;
  return total;
}

// The lines of one body that its reference does not carry, in order and with repeats,
// because the proof counts occurrences rather than membership. The comparison is trimmed
// and the line comes back as it was written: the proof cares that the line survived, and
// the indentation is what makes a nested bullet or a code sample read as one.
function localLinesOf(body, reference) {
  const known = lineSet(reference);
  const lines = [];
  for (const raw of String(body).split('\n')) {
    const line = raw.trim();
    if (line === '' || line === '---' || known.has(line)) continue;
    lines.push(raw);
  }
  return lines;
}

function chunkText(text) {
  return String(text).replace(/^\n+/u, '').replace(/\n+$/u, '');
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. THE REPOSITORY BLOCK
// ─────────────────────────────────────────────────────────────────────────────

// What the block holds once the template's own heading and note are set aside. A block a
// previous release wrote opens with both, so recognising them is what keeps a second run
// from nesting one heading inside another.
function blockBody(content, markers) {
  let rest = String(content).replace(/^\n+/u, '');
  const heading = markers.heading.trim();
  const note = markers.note.trim();
  if (rest.startsWith(heading)) rest = rest.slice(heading.length).replace(/^\n+/u, '');
  if (rest.startsWith(note)) rest = rest.slice(note.length).replace(/^\n+/u, '');
  return chunkText(rest);
}

function renderBlock(markers, body) {
  const text = chunkText(body);
  const between = text === '' ? '' : `${text}\n`;
  return `${markers.start}\n${markers.heading}\n\n${markers.note}\n${between}${markers.end}\n`;
}

// Devin never sees past the delivery prefix of the root document, so a repository with
// something of its own gets the same block as a Cursor rule that applies always.
function renderMirror(markers, body) {
  const text = chunkText(body);
  const between = text === '' ? '' : `${text}\n`;
  return `---\nalwaysApply: true\n---\n\n${markers.heading}\n\n${markers.note}\n${between}`;
}

// A document carrying two blocks has no single block to carry out of, and replacing it
// would have to choose one of them. Naming both positions is what makes the refusal
// actionable: reporting the second block's marker bytes as repository lines the run
// dropped would name nothing anybody could look at and hide the fault behind the proof.
function duplicateBlockMessage(rootFile, block) {
  const starts = block.markerLines.start.map((line) => `line ${line}`).join(' and ');
  const ends = block.markerLines.end.map((line) => `line ${line}`).join(' and ');
  return `the repository block in ${rootFile} is duplicated: the start marker appears on ${starts} and the end marker on ${ends}; one block is all the engine can place, so it carries nothing out of either`;
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. THE ROUTER
// ─────────────────────────────────────────────────────────────────────────────

function cellsOf(line) {
  return line.trim().replace(/^\|/u, '').replace(/\|$/u, '').split('|').map((cell) => cell.trim());
}

// The rule a row points at, which is the identity the checker also compares. Matching on
// the resolved path rather than the whole row is what lets a repository reword a summary
// without the row reading as missing.
function rulePathOf(cells) {
  for (const cell of cells) {
    const linked = /\(([^)]+\.md)\)/u.exec(cell);
    if (linked) return linked[1];
    const bare = /`([^`]+\.md)`/u.exec(cell);
    if (bare) return bare[1];
  }
  return null;
}

function rowKey(cells) {
  return rulePathOf(cells) || cells.join(' | ');
}

/**
 * The rows of one router table, with the line each sits on.
 *
 * @param {string} text - The router document.
 * @param {string} anchor - Text that identifies the table's heading.
 * @returns {null|{lines: string[], rows: Array<{line: number, cells: string[]}>, insertAfter: number}}
 *   Null when the document carries no such table.
 */
function routerTable(text, anchor) {
  const lines = text.split('\n');
  const start = lines.findIndex((line) => line.startsWith('#') && line.includes(anchor));
  if (start === -1) return null;

  const rows = [];
  let separator = -1;
  let lastRow = -1;
  for (let index = start + 1; index < lines.length; index += 1) {
    const line = lines[index].trim();
    if (line.startsWith('#')) break;
    if (line === '') {
      if (rows.length > 0) break;
      continue;
    }
    if (!line.startsWith('|')) continue;
    if (/^\|[\s:|-]+\|$/u.test(line)) {
      separator = index;
      continue;
    }
    rows.push({ line: index, cells: cellsOf(line) });
    lastRow = index;
  }

  const anchorLine = rows.length > 0 ? lastRow : separator;
  if (anchorLine === -1) return null;
  return { lines, rows, insertAfter: anchorLine };
}

/**
 * The router with the shipped rows it is missing, added at the end of each table.
 *
 * @param {string} text
 * @param {Object} manifest
 * @returns {{text: string, added: {trigger: number, index: number}, notes: string[]}}
 */
function addRouterRows(text, manifest) {
  const shipped = (manifest.derived && manifest.derived.repo_rules) || { trigger_rows: [], index_rows: [] };
  const tables = [
    { anchor: 'TRIGGER TABLE', rows: shipped.trigger_rows || [], kind: 'trigger' },
    { anchor: 'INDEX', rows: shipped.index_rows || [], kind: 'index' },
  ];

  let next = text;
  const added = { trigger: 0, index: 0 };
  const notes = [];

  for (const table of tables) {
    const found = routerTable(next, table.anchor);
    if (found === null) {
      // A router without the table is a different document shape; appending one would
      // number a second section and break the checker's own reading of the file.
      notes.push(`router: no ${table.anchor} table in ${manifest.router_file}, so its shipped ${table.kind} rows were not added`);
      continue;
    }
    const present = new Set(found.rows.map((row) => rowKey(row.cells)));
    const missing = table.rows.filter((cells) => !present.has(rowKey(cells)));
    if (missing.length === 0) continue;
    const lines = found.lines.slice();
    lines.splice(found.insertAfter + 1, 0, ...missing.map((cells) => `| ${cells.join(' | ')} |`));
    next = lines.join('\n');
    added[table.kind] = missing.length;
  }

  return { text: next, added, notes };
}

// A repository with no router loads no rule at all, so the missing file is created from
// the rows the template ships. Its prose stays short on purpose: a router holds no rules.
function renderRouter(manifest) {
  const shipped = (manifest.derived && manifest.derived.repo_rules) || { trigger_rows: [], index_rows: [] };
  return [
    '# REPO RULES',
    '',
    'Repo-local operating rules. `AGENTS.md` **Gate 5 (§2)** makes reading this mandatory',
    'before your first write of the session. This document then routes you to every rule',
    'file that governs what you are about to do. **It is a router, not a rulebook:** it',
    'holds no rules of its own.',
    '',
    '---',
    '',
    '## 1. HOW TO USE THIS',
    '',
    '1. **Match on the action you are about to take**, not the topic of the request.',
    '2. **Load before the action.** A rule read afterwards is a post-mortem.',
    '3. **A file already in context is not re-read.**',
    '4. **Nothing fires → `AGENTS.md` alone governs.** Do not hunt for a rule to apply.',
    '',
    'The rows below are the ones Skilled ships. Rows for this repository\'s own rules go in',
    'the same tables, authored one rule at a time.',
    '',
    '---',
    '',
    '## 2. TRIGGER TABLE',
    '',
    '| You are about to… | Load | It settles |',
    '|-------------------|------|-----------|',
    ...(shipped.trigger_rows || []).map((cells) => `| ${cells.join(' | ')} |`),
    '',
    '---',
    '',
    '## 3. INDEX',
    '',
    '| Rule | Summary |',
    '|------|---------|',
    ...(shipped.index_rows || []).map((cells) => `| ${cells.join(' | ')} |`),
    '',
    '---',
    '',
    'Each file the rows name is part of the installation and is replaced by a release.',
    'Where a rule file appears to permit something `AGENTS.md` restricts, `AGENTS.md` wins.',
    '',
  ].join('\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. THE PLAN DIGEST
// ─────────────────────────────────────────────────────────────────────────────

// Every byte the run would put on disk, in a canonical order, keyed by the root it was
// composed for and by the backup directory the plan takes: the same plan replayed against
// an edited tree composes something else and cannot match, and a plan whose directory an
// earlier run already owns is a different plan, so the digest covers which one it is.
function planDigest(composition, plan) {
  const written = composition.files
    .filter((file) => file.action === 'create' || file.action === 'replace')
    .map((file) => [file.path, file.action, sha256(file.content)])
    .sort((left, right) => (left[0] < right[0] ? -1 : left[0] > right[0] ? 1 : 0));
  const removed = composition.files
    .filter((file) => file.action === 'remove')
    .map((file) => [file.path, file.action, null])
    .sort((left, right) => (left[0] < right[0] ? -1 : left[0] > right[0] ? 1 : 0));
  return sha256(JSON.stringify([composition.root, plan.base, plan.ordinal, ...written, ...removed]));
}

// Where each line of the old document sat, so a lost line is reported with the part it
// belonged to. The block wins over the section it interrupts, because those bytes are the
// repository's and not the section's.
function placementOf(before) {
  const places = new Map();
  for (const section of before.sections) {
    const place = section.id === null
      ? { part: 1, from: 'unmarked section' }
      : { part: 2, from: section.id };
    for (const index of section.rows || []) places.set(index, place);
  }
  const preludeRows = before.prelude === null ? [] : before.prelude.rows;
  for (const index of preludeRows) places.set(index, { part: 1, from: 'text before the first heading' });
  if (before.block && before.block.complete && before.block.rows) {
    for (let index = before.block.rows.first; index <= before.block.rows.last; index += 1) places.set(index, { part: 1, from: 'the block' });
  }
  return places;
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. THE PRESERVATION PROOF
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Prove that a composition lost nothing the repository had.
 *
 * Four claims, one per part of the returned record: every line of the old document no
 * shipped body carries still sits in the new block; the local lines of a matched shipped
 * section still sit there too, which the part number keeps distinct; the unique lines of a
 * removed runtime copy still sit in the new document; and every line of the new document
 * outside the block is one the template ships. Pure by construction: same inputs, same
 * answer, no file read.
 *
 * The claim is read from the old document's own lines, in reading order, rather than from
 * the parts the segmentation produced. A proof built from those parts can require only
 * what the reader managed to place, so a line it placed nowhere would be required by
 * nothing and a composition that lost it would still report `dropped 0`.
 *
 * @param {string|null} oldText - The document as it was.
 * @param {string} newText - The document as it would be, or as it now is.
 * @param {Object} manifest
 * @param {{removed?: Array<{path: string, content: string}>}} [options]
 * @returns {{dropped: Array<{part: number, line: string, before: number, after: number, from: string}>,
 *   foreign: Array<{line: string}>}}
 */
function preservationCheck(oldText, newText, manifest, options = {}) {
  const markers = manifest.markers;
  const dropped = [];
  const knownShipped = new Set();
  for (const entry of Object.values(manifest.derived.sections || {})) {
    for (const line of lineSet(entry.body)) knownShipped.add(line);
  }
  for (const entry of manifest.derived.history || []) {
    for (const line of lineSet(entry.body)) knownShipped.add(line);
  }

  // The framework's own bytes: the two markers and the heading and note that come with
  // them. The new document carries one of each whatever the old one carried, so requiring
  // them would report a duplicated block as repository lines the run dropped.
  const framework = new Set([
    markers.start.trim(),
    markers.end.trim(),
    markers.heading.trim(),
    markers.note.trim(),
  ]);

  const before = oldText === null || oldText === undefined
    ? { sections: [], block: null, prelude: null }
    : segment(oldText, markers, manifest.sections);
  const after = segment(newText, markers, manifest.sections);
  const newBlock = after.block && after.block.complete ? after.block.content : '';
  const newBlockCounts = countLines(newBlock);
  const newDocumentCounts = countLines(newText);

  const require = (line, part, from, need) => {
    const have = part === 3 ? (newDocumentCounts.get(line) || 0) : (newBlockCounts.get(line) || 0);
    if (have < need) dropped.push({ part, line, before: need, after: have, from });
  };

  // Parts 1 and 2. Every line of the old document that no known body carries has to be in
  // the new block at least as often as it was there. Where the line sat decides only which
  // part names it when it goes missing.
  const places = placementOf(before);
  const needed = new Map();
  const oldLines = oldText === null || oldText === undefined ? [] : String(oldText).split('\n');
  for (let index = 0; index < oldLines.length; index += 1) {
    const line = oldLines[index].trim();
    if (line === '' || line === '---') continue;
    if (framework.has(line) || knownShipped.has(line)) continue;
    const place = places.get(index) || { part: 1, from: 'the document' };
    const entry = needed.get(line);
    if (entry === undefined) needed.set(line, { need: 1, part: place.part, from: place.from });
    else entry.need += 1;
  }
  for (const [line, entry] of needed) require(line, entry.part, entry.from, entry.need);

  // Part 3. Lines that only a runtime copy carried, counted against the whole document.
  const oldDocumentCounts = oldText === null || oldText === undefined ? new Map() : countLines(oldText);
  for (const copy of options.removed || []) {
    for (const [line, count] of countLines(copy.content)) {
      if (framework.has(line)) continue;
      if ((oldDocumentCounts.get(line) || 0) > 0) continue;
      require(line, 3, copy.path, count);
    }
  }

  // Part 4. Nothing above the block that the template does not ship.
  const currentOnly = new Set();
  for (const entry of Object.values(manifest.derived.sections || {})) {
    for (const line of lineSet(entry.body)) currentOnly.add(line);
  }
  const foreign = [];
  // Section offsets are bytes and a JavaScript string is addressed in code units, so a
  // document with any multi-byte character in it would otherwise be cut in the wrong place.
  const newBytes = Buffer.from(newText, 'utf8');
  const blockStart = after.block && after.block.complete ? after.block.start : newBytes.length;
  const blockEnd = after.block && after.block.complete ? after.block.end : newBytes.length;
  const outside = `${newBytes.subarray(0, blockStart).toString('utf8')}${newBytes.subarray(blockEnd).toString('utf8')}`;
  for (const line of uniqueLines(outside)) {
    if (!currentOnly.has(line)) foreign.push({ line });
  }

  return { dropped, foreign };
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. COMPOSITION
// ─────────────────────────────────────────────────────────────────────────────

function rowOf(report, id) {
  return report.rows.find((row) => row.id === id) || { state: 'UNKNOWN', detail: '', lines: [], entries: [] };
}

function fileState(text) {
  return { mode: '100644', blob: sha256(text), content: Buffer.from(text, 'utf8') };
}

function historyBodyOf(manifest, hash) {
  if (!hash) return null;
  const entry = (manifest.derived.history || []).find((row) => row.sha256 === hash);
  return entry ? entry.body : null;
}

function prefixEndOf(text, manifest) {
  if (text === null) return 0;
  const { sections } = segment(text, manifest.markers, manifest.sections);
  const byId = new Map();
  for (const section of sections) if (section.id !== null) byId.set(section.id, section);
  let end = 0;
  for (const pin of (manifest.pins || []).filter((entry) => entry.kind === 'delivery-anchor')) {
    const section = byId.get(pin.section);
    if (!section) continue;
    const measured = deliveryAnchorEnd(section, pin);
    if (measured !== null) end = Math.max(end, measured);
  }
  return end;
}

/**
 * Build every target of one repository in memory, with the ledger and the digest.
 *
 * Nothing here writes; the caller decides what to do with the answer.
 *
 * @param {{root: string, manifest: Object, keepClaudeMd?: boolean, createRouter?: boolean}} input
 * @returns {Object} the composition
 */
function compose({ root, manifest, keepClaudeMd = false, createRouter = false }) {
  const report = buildReport({ root, manifestPath: MANIFEST_PATH });
  if (report === null) throw new PreconditionError(`cannot classify ${root}: the manifest at ${MANIFEST_PATH} produced no report`);

  const markers = manifest.markers;
  const rootFile = manifest.root_file;
  const rootPath = path.join(root, rootFile);
  // Writing through a link would change a file this repository does not own, and the backup
  // could not put the link back.
  if (isSymlink(rootPath)) {
    throw new PreconditionError(`${rootFile} is a symlink to ${fs.readlinkSync(rootPath)}; writing through it would change a file outside this repository`);
  }
  const oldText = fs.existsSync(rootPath) ? fs.readFileSync(rootPath, 'utf8') : null;

  const block = oldText === null ? null : findBlock(oldText, markers);
  if (block !== null && (block.markerLines.start.length > 1 || block.markerLines.end.length > 1)) {
    throw new PreconditionError(duplicateBlockMessage(rootFile, block));
  }
  if (block !== null && block.complete === false) {
    throw new PreconditionError(`the repository block in ${rootFile} carries one of its two markers and not the other, near byte ${block.start}; the block cannot be placed, so nothing can be carried out of it`);
  }

  const oldSegmentation = oldText === null
    ? { sections: [], block: null, prelude: null }
    : segment(oldText, markers, manifest.sections);
  const oldSections = oldSegmentation.sections;
  const shipped = manifest.sections.map((entry) => manifest.derived.sections[entry.id].body).join('');
  const notes = [];
  const chunks = [];

  // (a) Whatever the block already held.
  if (block !== null && block.complete) {
    const body = blockBody(block.content, markers);
    if (body !== '') chunks.push({ kind: 'block', text: body, lines: lineCount(body) });
  }

  // Text above the first heading belongs to no section, and a replacement would drop it.
  // The segmenter reports it apart from the sections because no heading covers it.
  if (oldSegmentation.prelude !== null) {
    const preamble = chunkText(oldSegmentation.prelude.text);
    if (preamble !== '') {
      chunks.push({ kind: 'preamble', text: preamble, lines: lineCount(preamble) });
    }
  }

  // (b) Sections no shipped entry matches, verbatim and in document order. The text above
  // the first heading is already carried as the preamble, and its byte range would reach
  // a block written above the template, so it is the one entry skipped here.
  const unmarkedRow = rowOf(report, 'A8');
  const oldBuffer = oldText === null ? Buffer.alloc(0) : Buffer.from(oldText, 'utf8');
  const unmarked = unmarkedRow.entries
    .filter((entry) => entry.heading !== null)
    .sort((left, right) => left.byte_start - right.byte_start);
  for (const entry of unmarked) {
    const text = chunkText(oldBuffer.subarray(entry.byte_start, entry.byte_end).toString('utf8'));
    if (text === '') continue;
    chunks.push({ kind: 'unmarked', id: entry.heading, text, lines: lineCount(text) });
  }

  // (c) The local lines of a section somebody edited, each under its own id.
  const edited = rowOf(report, 'A4').entries.filter((entry) => entry.state === 'edited' || entry.state === 'unknown-base');
  for (const entry of edited) {
    const section = oldSections.find((candidate) => candidate.id === entry.id);
    if (!section) continue;
    const shippedBody = manifest.derived.sections[entry.id] ? manifest.derived.sections[entry.id].body : '';
    const lines = localLinesOf(section.body, shippedBody);
    if (lines.length === 0) continue;
    chunks.push({
      kind: 'edited',
      id: entry.id,
      lines: lines.length,
      text: [`### Carried from ${entry.id}`, ...lines].join('\n'),
    });

    // A clean merge would leave the section edited forever, so it is offered as a reading
    // of the same bytes and never as the default.
    const base = historyBodyOf(manifest, entry.base);
    if (base !== null) {
      const merged = classifyFile(fileState(base), fileState(section.body), fileState(shippedBody));
      if (merged.conflictKind === 'mergeable') {
        notes.push(`merge: ${entry.id} could be merged in place against its released body; adopt-and-carry is still the default, because a merged section stays edited for every later release`);
      }
    }
  }

  // (d) The unique lines of a runtime copy that is folded away.
  const copies = rowOf(report, 'A10').entries.filter((entry) => FOLDED_COPIES.includes(entry.path));
  const removedCopies = [];
  for (const copy of copies) {
    const absolute = path.join(root, copy.path);
    if (!fs.existsSync(absolute) || isSymlink(absolute)) continue;
    if (copy.state !== 'FINDING') continue;
    const content = fs.readFileSync(absolute, 'utf8');
    // With no root document every line of the copy is its own, and the count has to survive:
    // the proof compares occurrences, not membership, so a repeated line stays repeated.
    const lines = localLinesOf(content, oldText === null ? '' : oldText);
    if (lines.length > 0) {
      chunks.push({
        kind: 'copy',
        path: copy.path,
        lines: lines.length,
        text: [`### Carried from ${copy.path}`, ...lines].join('\n'),
      });
    }
    removedCopies.push({ path: copy.path, content });
    if (copy.path === 'CLAUDE.md' && keepClaudeMd) {
      removedCopies.pop();
      if (lines.length > 0) {
        notes.push(`claude: ${copy.path} carries lines no other file has; they moved into the block and the file stays because --keep-claude-md was given`);
      }
    }
  }

  const blockText = chunks.map((chunk) => chunkText(chunk.text)).filter((text) => text !== '').join('\n\n');
  const composed = `${shipped}${renderBlock(markers, blockText)}`;

  // The template with nothing of the repository's own in it gains nothing from the two
  // marker lines, so that difference alone is not a reason to write: the markers appear
  // with the first line worth keeping.
  const templateOnly = oldText !== null && block === null && blockText === '' && oldText === shipped;
  if (templateOnly) {
    notes.push(`block: the template is already current and this repository carries nothing of its own, so no empty block is written`);
  }

  const files = [];
  if (templateOnly || oldText === composed) {
    files.push({ path: rootFile, action: 'unchanged', content: null, before: oldText });
  } else {
    files.push({
      path: rootFile,
      action: oldText === null ? 'create' : 'replace',
      content: composed,
      before: oldText,
    });
  }

  // The router gains the shipped rows it is missing, or is created from them when asked.
  const routerPath = path.join(root, manifest.router_file);
  let routerAction = 'unchanged';
  let routerText = null;
  if (fs.existsSync(routerPath)) {
    const current = fs.readFileSync(routerPath, 'utf8');
    const result = addRouterRows(current, manifest);
    notes.push(...result.notes);
    if (result.text !== current) {
      routerText = result.text;
      routerAction = 'replace';
      if (result.added.trigger > 0 || result.added.index > 0) {
        notes.push(`router: ${result.added.trigger} trigger row(s) and ${result.added.index} index row(s) added; no other row was touched`);
      }
    }
  } else if (createRouter) {
    routerText = renderRouter(manifest);
    routerAction = 'create';
  } else {
    routerAction = 'absent';
    notes.push(`router: no ${manifest.router_file}, so no repository rule can load; pass --create-router to create one from the shipped rows`);
  }
  files.push({ path: manifest.router_file, action: routerAction, content: routerText, before: fs.existsSync(routerPath) ? fs.readFileSync(routerPath, 'utf8') : null });

  // The Cursor mirror exists exactly when the block carries something, because an empty
  // block has nothing a runtime that cannot read past the prefix would miss.
  const mirrorPath = path.join(root, MIRROR_FILE);
  const mirrorExists = fs.existsSync(mirrorPath);
  let mirrorAction = 'unchanged';
  let mirrorText = null;
  if (blockText !== '') {
    mirrorText = renderMirror(markers, blockText);
    if (!mirrorExists) mirrorAction = 'create';
    else if (fs.readFileSync(mirrorPath, 'utf8') !== mirrorText) mirrorAction = 'replace';
  } else if (mirrorExists) {
    mirrorAction = 'remove';
  }
  if (mirrorAction !== 'unchanged') {
    files.push({
      path: MIRROR_FILE,
      action: mirrorAction,
      content: mirrorText,
      before: mirrorExists ? fs.readFileSync(mirrorPath, 'utf8') : null,
    });
  }

  for (const copy of removedCopies) {
    files.push({ path: copy.path, action: 'remove', content: null, before: copy.content });
  }

  const composition = {
    root,
    state: report.state,
    report,
    markers,
    rootFile,
    oldText,
    composed,
    block: { text: renderBlock(markers, blockText), body: blockText },
    chunks,
    removedCopies,
    notes,
    files,
    budget: {
      before: { prefix: prefixEndOf(oldText, manifest), total: oldText === null ? 0 : Buffer.byteLength(oldText, 'utf8') },
      after: { prefix: prefixEndOf(composed, manifest), total: Buffer.byteLength(composed, 'utf8') },
      limits: { prefix: manifest.budget.prefix_bytes, total: manifest.budget.max_bytes },
    },
    ledger: {
      kept: chunks.filter((chunk) => ['block', 'preamble', 'unmarked', 'edited'].includes(chunk.kind)).reduce((sum, chunk) => sum + chunk.lines, 0),
      carried: chunks.filter((chunk) => chunk.kind === 'copy').reduce((sum, chunk) => sum + chunk.lines, 0),
      shippedReplaced: manifest.sections.length,
      dropped: 0,
    },
  };

  // What the run would put on disk, which is exactly the three actions a target can take.
  composition.writes = composition.files.filter((file) => ['create', 'replace', 'remove'].includes(file.action));
  return composition;
}

// ─────────────────────────────────────────────────────────────────────────────
// 11. THE WRITE ALLOWLIST
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Resolve one path a run wants to touch, or refuse it.
 *
 * Containment is checked before membership, so a path that climbs out of the root is
 * reported as what it is rather than as a missing allowlist entry.
 *
 * @param {string} root
 * @param {string} relative
 * @returns {string} the absolute path
 */
function assertWritable(root, relative) {
  const base = path.resolve(root);
  const normalized = String(relative).split(path.sep).join('/');
  const absolute = path.resolve(base, normalized);
  if (absolute !== path.join(base, normalized) || !absolute.startsWith(base + path.sep)) {
    throw new AllowlistError(`${relative} resolves outside the target root ${base}`);
  }
  if (!ALLOWLIST.includes(normalized)) {
    throw new AllowlistError(`${relative} is not on the write allowlist (${ALLOWLIST.join(', ')})`);
  }
  // Every path a run reaches must sit inside the root where the root really is, not only
  // under its name: a link inside the tree can aim a legal-looking path at a file outside it.
  const realBase = fs.realpathSync(base);
  const realTarget = resolveThroughLinks(absolute);
  if (realTarget !== realBase && !realTarget.startsWith(realBase + path.sep)) {
    throw new AllowlistError(`${relative} resolves outside the target root ${realBase} through a link`);
  }
  return absolute;
}

// The real path of a path that may not exist yet: the nearest existing ancestor is resolved
// and the rest of the name is appended to it.
function resolveThroughLinks(absolute) {
  try {
    return fs.realpathSync(absolute);
  } catch {
    const parent = path.dirname(absolute);
    if (parent === absolute) return absolute;
    return path.join(resolveThroughLinks(parent), path.basename(absolute));
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 12. BACKUPS
// ─────────────────────────────────────────────────────────────────────────────

function utcStamp(date = new Date()) {
  return date.toISOString().replace(/[-:]/gu, '').replace(/\.\d+Z$/u, 'Z');
}

/**
 * The directory a plan's backup sits in, named after the plan digest.
 *
 * Named by the digest rather than by a clock reading because apply has to land exactly
 * where the plan pointed and the digest is the only thing the operator carries across. The
 * consequence is that a directory is a plan's own: a second plan of the same work finds it
 * taken and moves to the next ordinal instead of writing beside it.
 *
 * @param {string} base
 * @param {string} digest
 * @returns {string}
 */
function backupDirectoryOf(base, digest) {
  return path.join(base, digest.slice(0, BACKUP_NAME_CHARS));
}

/**
 * Where a run's backup goes, without creating anything.
 *
 * The output directory is used only when git ignores it, because a backup inside a tracked
 * path is a backup the next commit publishes. Everything else leaves the repository.
 *
 * @param {{root: string}} input
 * @returns {{dir: string, fallback: boolean, reason: string}}
 */
function backupBase({ root }) {
  const candidate = path.join(root, BACKUP_DIR);
  // The question is the one the run depends on: would a plan directory under this one be
  // published by the next commit? Asking about the base alone would miss a rule written as
  // `.skilled/output/*`, which ignores the per-plan directories and not their parent, so
  // the probe is a path of the same shape as the one the plan takes.
  const probe = path.join(candidate, 'probe');
  const ignored = spawnSync('git', ['-C', root, '-c', 'core.fsmonitor=false', 'check-ignore', '-q', probe], {
    encoding: 'utf8',
    timeout: TOOL_TIMEOUT_MS,
  });
  if (ignored.status === 0) return { dir: candidate, fallback: false, reason: '' };
  const reason = ignored.status === 1
    ? `git does not ignore ${BACKUP_DIR} under ${root}`
    : `git cannot answer whether ${BACKUP_DIR} is ignored under ${root} (exit ${ignored.status})`;
  return { dir: path.join(os.tmpdir(), BACKUP_FALLBACK_DIR), fallback: true, reason };
}

/**
 * The plan a run stands on: the composition, plus where its backup goes and the digest
 * that says both.
 *
 * The loop is what makes a re-plan honest. A directory an earlier run already holds is not
 * suffixed into a second name, because the printed undo command would then point at that
 * run's bytes; the next ordinal is a different plan with a different digest and a
 * directory of its own.
 *
 * @param {Object} composition
 * @returns {{dir: string, fallback: boolean, reason: string, digest: string, ordinal: number, base: string}}
 */
function planFor(composition) {
  const base = backupBase({ root: composition.root });
  for (let ordinal = 0; ordinal < BACKUP_ATTEMPTS; ordinal += 1) {
    const digest = planDigest(composition, { ordinal, base: base.dir });
    const dir = backupDirectoryOf(base.dir, digest);
    if (!fs.existsSync(dir)) return { dir, fallback: base.fallback, reason: base.reason, digest, ordinal, base: base.dir };
  }
  throw new PreconditionError(`every backup directory for this composition under ${base.dir} is taken, so nothing was written`);
}

// The folders a new file needs that do not exist yet, deepest first. A restore removes
// only these, so on a record the run wrote, a folder that was there before the run is never
// taken away with it.
function missingParents(root, relative) {
  const missing = [];
  let dir = path.posix.dirname(relative);
  while (dir !== '.' && dir !== '' && !fs.existsSync(path.join(root, dir))) {
    missing.push(dir);
    dir = path.posix.dirname(dir);
  }
  return missing;
}

// A record is data, so a recorded folder counts only while it is a proper ancestor of the
// entry's own allowlisted path; the list stops at the first one that is not.
function recordedCreatedDirs(entry) {
  const dirs = [];
  if (entry.existed || !Array.isArray(entry.createdDirs)) return dirs;
  for (const dir of entry.createdDirs) {
    if (typeof dir !== 'string' || dir === '' || dir.split('/').includes('..') || !entry.path.startsWith(`${dir}/`)) break;
    dirs.push(dir);
  }
  return dirs;
}

// Runs after every file is back, because two new files can share one new folder. Only the
// folders above a file this restore just deleted are considered, and only an empty one is
// removed, so a hand-edited record can at most take away an empty folder on the path to a
// file the run created.
function removeCreatedDirs(root, entries, deleted) {
  const removed = [];
  for (const entry of entries) {
    if (!deleted.has(entry.path)) continue;
    for (const dir of recordedCreatedDirs(entry)) {
      const absolute = path.join(root, dir);
      let names;
      try { names = fs.readdirSync(absolute); } catch { continue; }
      if (names.length > 0) break;
      fs.rmdirSync(absolute);
      removed.push(dir);
    }
  }
  return removed;
}

// What one path looked like before the run, kept beside a copy of it so a restore is a
// copy rather than a reconstruction.
function backupEntry(root, file) {
  const absolute = path.join(root, file.path);
  const exists = fs.existsSync(absolute);
  const entry = { path: file.path, action: file.action, existed: exists, sha256: null, backup: null, mode: null, symlink: false };
  if (!exists) {
    entry.createdDirs = missingParents(root, file.path);
    return entry;
  }
  const stats = fs.lstatSync(absolute);
  entry.mode = stats.mode.toString(8).slice(-4);
  entry.symlink = stats.isSymbolicLink();
  const bytes = fs.readFileSync(absolute);
  entry.sha256 = sha256(bytes.toString('utf8'));
  entry.backup = path.posix.join('files', file.path);
  return entry;
}

function writeBackup({ root, manifest, composition, plan }) {
  // The plan chose a directory nothing owned, so a directory here is somebody else's run
  // finishing first: writing beside its record would make the undo ambiguous.
  if (fs.existsSync(plan.dir)) {
    throw new PreconditionError(`the backup directory ${plan.dir} already exists; nothing was written`);
  }
  fs.mkdirSync(plan.dir, { recursive: true });

  const entries = [];
  for (const file of composition.writes) entries.push(backupEntry(root, file));
  // The pointer block is regenerated by its own tool, so it is backed up whenever the run
  // would touch it, even though this engine composes nothing for it.
  const pointerAbsolute = path.join(root, POINTER_FILE);
  if (composition.writes.some((file) => file.path === manifest.root_file) && fs.existsSync(pointerAbsolute) && !isSymlink(pointerAbsolute)) {
    entries.push(backupEntry(root, { path: POINTER_FILE, action: 'regenerated' }));
  }

  // The backup and its record are written by plain fs, never by the caller's write hook:
  // the rollback must not share a path with the writer it exists to undo.
  for (const entry of entries) {
    if (!entry.existed) continue;
    const destination = path.join(plan.dir, entry.backup);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(path.join(root, entry.path), destination);
  }

  const record = {
    schema: 1,
    root,
    created_at: utcStamp(),
    plan_digest: plan.digest,
    paths: entries,
  };
  fs.writeFileSync(path.join(plan.dir, 'manifest.json'), `${JSON.stringify(record, null, 2)}\n`, 'utf8');
  return record;
}

// ─────────────────────────────────────────────────────────────────────────────
// 13. THE DIFF
// ─────────────────────────────────────────────────────────────────────────────

function diffLines(text) {
  if (text === null) return [];
  const lines = String(text).split('\n');
  if (lines.length > 0 && lines[lines.length - 1] === '') lines.pop();
  return lines;
}

function diffOps(left, right) {
  const rows = left.length + 1;
  const columns = right.length + 1;
  const table = Array.from({ length: rows }, () => new Uint32Array(columns));
  for (let i = left.length - 1; i >= 0; i -= 1) {
    for (let j = right.length - 1; j >= 0; j -= 1) {
      table[i][j] = left[i] === right[j]
        ? table[i + 1][j + 1] + 1
        : Math.max(table[i + 1][j], table[i][j + 1]);
    }
  }
  const ops = [];
  let i = 0;
  let j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] === right[j]) {
      ops.push({ kind: ' ', text: left[i] });
      i += 1;
      j += 1;
    } else if (table[i + 1][j] >= table[i][j + 1]) {
      ops.push({ kind: '-', text: left[i] });
      i += 1;
    } else {
      ops.push({ kind: '+', text: right[j] });
      j += 1;
    }
  }
  while (i < left.length) {
    ops.push({ kind: '-', text: left[i] });
    i += 1;
  }
  while (j < right.length) {
    ops.push({ kind: '+', text: right[j] });
    j += 1;
  }
  return ops;
}

/**
 * A unified diff with three lines of context, which is what makes a plan reviewable.
 *
 * @param {string|null} beforeText
 * @param {string|null} afterText
 * @param {string} relative
 * @returns {string[]}
 */
function unifiedDiff(beforeText, afterText, relative) {
  const left = diffLines(beforeText);
  const right = diffLines(afterText);
  const ops = diffOps(left, right);
  if (!ops.some((op) => op.kind !== ' ')) return [];

  const changed = ops.map((op, index) => (op.kind === ' ' ? -1 : index)).filter((index) => index !== -1);
  const hunks = [];
  for (const index of changed) {
    const start = Math.max(0, index - 3);
    const end = Math.min(ops.length, index + 4);
    const last = hunks[hunks.length - 1];
    if (last && start <= last.end) last.end = Math.max(last.end, end);
    else hunks.push({ start, end });
  }

  const output = [`--- ${beforeText === null ? '/dev/null' : `a/${relative}`}`, `+++ ${afterText === null ? '/dev/null' : `b/${relative}`}`];
  let consumed = 0;
  for (const hunk of hunks) {
    // A create has no left side and a removal has no right side, so their cursors start at
    // zero rather than at the first line of a file that is not there.
    let leftCursor = beforeText === null ? 0 : 1;
    let rightCursor = afterText === null ? 0 : 1;
    for (let index = 0; index < hunk.start; index += 1) {
      if (ops[index].kind !== '+') leftCursor += 1;
      if (ops[index].kind !== '-') rightCursor += 1;
    }
    const slice = ops.slice(hunk.start, hunk.end);
    const leftCount = slice.filter((op) => op.kind !== '+').length;
    const rightCount = slice.filter((op) => op.kind !== '-').length;
    output.push(`@@ -${leftCursor},${leftCount} +${rightCursor},${rightCount} @@`);
    for (const op of slice) output.push(`${op.kind}${op.text}`);
    consumed += slice.length;
  }
  return consumed === 0 ? [] : output;
}

// ─────────────────────────────────────────────────────────────────────────────
// 14. THE PLAN
// ─────────────────────────────────────────────────────────────────────────────

function renderTargets(composition) {
  return composition.files.map((file) => `target ${file.path}: ${file.action}`);
}

function renderPlan(composition, plan) {
  const lines = [];
  lines.push(`${TAG} plan for ${composition.root} (state: ${composition.state})`);
  lines.push(...renderTargets(composition));
  for (const note of composition.notes) lines.push(`note: ${note}`);

  for (const file of composition.writes) {
    if (file.action === 'remove') {
      lines.push(`diff ${file.path}:`);
      for (const line of unifiedDiff(file.before, null, file.path)) lines.push(line);
      continue;
    }
    const diff = unifiedDiff(file.before, file.content, file.path);
    lines.push(`diff ${file.path}:`);
    if (diff.length === 0) lines.push('  (no line changes)');
    lines.push(...diff);
  }

  lines.push('block:');
  lines.push(...composition.block.text.replace(/\n$/u, '').split('\n'));
  lines.push('block-end:');

  const { before, after, limits } = composition.budget;
  lines.push(`budget: ${before.prefix} -> ${after.prefix} of ${limits.prefix} bytes to the last anchor, ${before.total} -> ${after.total} of ${limits.total} bytes total, ${limits.total - after.total} bytes headroom`);
  if (after.total > limits.total) {
    lines.push(`finding: the composed document is ${after.total} bytes, past the ${limits.total}-byte ceiling the truncating runtimes stop at; every carried line is still kept, because preservation outranks the budget`);
  }
  if (after.prefix > limits.prefix) {
    lines.push(`finding: the last delivery anchor now ends at byte ${after.prefix}, past the ${limits.prefix}-byte prefix`);
  }

  lines.push(`preservation: kept ${composition.ledger.kept}, carried ${composition.ledger.carried}, shipped-replaced ${composition.ledger.shippedReplaced}, dropped ${composition.ledger.dropped}`);
  lines.push(`backup: ${plan.dir}`);
  if (plan.fallback) lines.push(`backup-fallback: ${plan.reason}`);
  lines.push(`undo: ${undoCommand(plan.dir, composition.root)}`);
  lines.push(`plan-digest: ${plan.digest}`);
  return lines;
}

function renderDropped(dropped) {
  return dropped.map((entry) => `dropped: ${entry.line} (part ${entry.part}, from ${entry.from}: ${entry.after} of ${entry.before} kept)`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 15. PLAN
// ─────────────────────────────────────────────────────────────────────────────

function preflight(composition, manifest) {
  return preservationCheck(composition.oldText, composition.composed, manifest, { removed: composition.removedCopies });
}

function commandPlan(options, output, hooks) {
  const manifest = loadManifest();
  const composition = compose({ root: options.root, manifest, keepClaudeMd: options.keepClaudeMd, createRouter: options.createRouter });

  const checked = preflight(composition, manifest);
  composition.ledger.dropped = checked.dropped.length;

  if (composition.writes.length === 0) {
    output.log(`${TAG} plan for ${composition.root} (state: ${composition.state})`);
    for (const note of composition.notes) output.log(`note: ${note}`);
    output.log('NOTHING TO DO');
    return 0;
  }

  const plan = planFor(composition);
  for (const line of renderPlan(composition, plan)) output.log(line);
  if (checked.dropped.length > 0) {
    for (const line of renderDropped(checked.dropped)) output.warn(line);
    output.warn(`${TAG} the composition drops ${checked.dropped.length} line(s), so it will not be offered for writing`);
    output.warn('STATUS=FAIL');
    return 1;
  }
  if (options.dryRun) output.log('dry-run: nothing was written');
  return 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// 16. APPLY
// ─────────────────────────────────────────────────────────────────────────────

function runTool(script, args) {
  if (!fs.existsSync(script)) return { code: null, output: `the tool is not installed at ${script}` };
  const result = spawnSync(process.execPath, [script, ...args], { encoding: 'utf8', timeout: TOOL_TIMEOUT_MS });
  const output = `${result.stdout || ''}\n${result.stderr || ''}`.split('\n').map((line) => line.trim()).filter((line) => line !== '');
  return { code: result.status, output };
}

function restoreFromBackup({ root, dir, output }) {
  const record = JSON.parse(fs.readFileSync(path.join(dir, 'manifest.json'), 'utf8'));
  let restored = 0;
  const deleted = new Set();
  for (const entry of record.paths) {
    const target = path.join(root, entry.path);
    if (!entry.existed) {
      if (fs.existsSync(target)) {
        fs.rmSync(target);
        deleted.add(entry.path);
      }
      continue;
    }
    const source = path.join(dir, entry.backup);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(source, target);
    restored += 1;
  }
  removeCreatedDirs(root, record.paths, deleted);
  output.warn(`${TAG} restored: ${restored} file(s) from ${dir}`);
  return restored;
}

function commandApply(options, output, hooks) {
  if (!options.digest) {
    output.warn(`${TAG} ERROR: apply needs --plan-digest, the digest the plan printed; nothing was written`);
    return 2;
  }

  const manifest = loadManifest();
  const composition = compose({ root: options.root, manifest, keepClaudeMd: options.keepClaudeMd, createRouter: options.createRouter });

  // A tree already in its target state has nothing a digest could authorise.
  if (composition.writes.length === 0) {
    output.log(`${TAG} apply on ${composition.root} (state: ${composition.state})`);
    output.log('NOTHING TO DO');
    return 0;
  }

  const plan = planFor(composition);
  if (plan.digest !== options.digest) {
    // The digest also names the backup directory, so an operator replaying a plan whose run
    // already happened gets told which directory holds those bytes instead of a claim
    // about the tree that would be false.
    const held = backupDirectoryOf(plan.base, options.digest);
    if (fs.existsSync(held)) {
      output.warn(`${TAG} ERROR: the plan digest ${options.digest} names the backup ${held}, which an earlier run already holds; nothing was written. Plan again for a directory of its own`);
      return 2;
    }
    output.warn(`${TAG} ERROR: the plan digest ${options.digest} does not match the composition now (${plan.digest}); the tree changed since the plan, so nothing was written`);
    return 2;
  }

  // The same proof the plan ran, because a composition that already loses a line must
  // never reach a backup, let alone the tree.
  const checked = preflight(composition, manifest);
  composition.ledger.dropped = checked.dropped.length;
  if (checked.dropped.length > 0) {
    for (const line of renderDropped(checked.dropped)) output.warn(line);
    output.warn(`${TAG} the composition drops ${checked.dropped.length} line(s); nothing was written`);
    output.warn('STATUS=FAIL');
    return 1;
  }

  // Every path is resolved before the first byte, so a path outside the allowlist stops
  // the run before a backup exists rather than after a partial write.
  const targets = [];
  for (const file of composition.writes) targets.push({ file, absolute: assertWritable(options.root, file.path) });

  // A dry run is the same plan the operator would give a yes to, minus the write: it stops
  // here, where every precondition has already passed and nothing has been created.
  if (options.dryRun) {
    for (const line of renderPlan(composition, plan)) output.log(line);
    output.log('dry-run: nothing was written');
    return 0;
  }

  const record = writeBackup({ root: options.root, manifest, composition, plan });
  output.log(`${TAG} apply on ${composition.root} (state: ${composition.state})`);

  const write = hooks.write || ((file, content) => fs.writeFileSync(file, content, 'utf8'));
  for (const target of targets) {
    if (target.file.action === 'remove') {
      if (fs.existsSync(target.absolute)) fs.rmSync(target.absolute);
      output.log(`removed ${target.file.path} (backed up first)`);
      continue;
    }
    fs.mkdirSync(path.dirname(target.absolute), { recursive: true });
    write(target.absolute, target.file.content);
    output.log(`wrote ${target.file.path}`);
  }

  // The pointer block belongs to its generator, and the router verdict to its checker.
  const rootTouched = composition.writes.some((file) => file.path === manifest.root_file);
  if (rootTouched) {
    const wrote = runTool(POINTER_SYNC, ['--root', options.root]);
    const checkedPointer = runTool(POINTER_SYNC, ['--check', '--root', options.root]);
    output.log(`pointer-sync: ${checkedPointer.code === 0 ? 'in sync' : `exit ${checkedPointer.code}`}${wrote.output.length > 0 ? ` (${wrote.output.join('; ')})` : ''}`);
  }
  if (composition.writes.some((file) => file.path === manifest.router_file)) {
    const router = runTool(REPO_RULES_CHECKER, ['--root', options.root]);
    const summary = router.output.find((line) => line.includes(REPO_RULES_TAG) && line.includes('RESULT:')) || router.output[router.output.length - 1] || '';
    output.log(`repo-rules: ${summary}`);
  }

  // The proof runs against the bytes on disk, never against the bytes still in memory.
  const rootPath = path.join(options.root, manifest.root_file);
  const onDisk = fs.existsSync(rootPath) ? fs.readFileSync(rootPath, 'utf8') : '';
  const after = preservationCheck(composition.oldText, onDisk, manifest, { removed: composition.removedCopies });
  const report = buildReport({ root: options.root, manifestPath: MANIFEST_PATH });

  if (after.dropped.length > 0) {
    for (const line of renderDropped(after.dropped)) output.warn(line);
    restoreFromBackup({ root: options.root, dir: plan.dir, output });
    output.warn(`${TAG} the write dropped ${after.dropped.length} line(s), so the run was undone; the backup is kept at ${plan.dir}`);
    output.warn('STATUS=FAIL');
    return 1;
  }

  output.log(`preservation: kept ${composition.ledger.kept}, carried ${composition.ledger.carried}, shipped-replaced ${composition.ledger.shippedReplaced}, dropped ${after.dropped.length}`);
  if (report !== null) {
    output.log(`check-after: state=${report.state} findings=${report.findings} unknown=${report.unknown}`);
  }
  output.log(`backup: ${plan.dir}`);
  output.log(`undo: ${undoCommand(plan.dir, options.root)}`);
  for (const entry of record.paths) {
    if (!entry.existed) continue;
    output.log(`cp ${path.join(plan.dir, entry.backup)} ${entry.path}`);
  }
  output.log('STATUS=OK');
  return 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// 17. RESTORE
// ─────────────────────────────────────────────────────────────────────────────

function readConfirmation() {
  try {
    return fs.readFileSync(0, 'utf8').split('\n')[0].trim();
  } catch {
    return '';
  }
}

function commandRestore(options, output, hooks) {
  if (!options.run) {
    output.warn(`${TAG} ERROR: restore needs --run=<dir>, the backup directory a run printed`);
    return 2;
  }
  const recordPath = path.join(options.run, 'manifest.json');
  if (!fs.existsSync(recordPath)) {
    output.warn(`${TAG} ERROR: no manifest.json under ${options.run}, so there is nothing recorded to put back`);
    return 2;
  }

  const record = JSON.parse(fs.readFileSync(recordPath, 'utf8'));
  const root = record.root;
  // The record names its own root, and a record is data: it is trusted only when it names
  // the root this restore runs against, so a record repointed at another folder is refused
  // instead of written to. Restoring another folder takes --root naming that folder.
  if (typeof root !== 'string' || !sameDirectory(root, options.root)) {
    output.warn(`${TAG} ERROR: the record names the root ${root}, and this restore runs against ${options.root}; pass --root ${root} to restore that folder. Nothing was written`);
    return 2;
  }
  const steps = [];
  for (const entry of record.paths) {
    // A record is data, and data can be wrong: the same allowlist decides what it may
    // touch, so a hand-edited record cannot turn a restore into an arbitrary write.
    const absolute = assertWritable(root, entry.path);
    if (!entry.existed) {
      steps.push({ entry, absolute, action: fs.existsSync(absolute) ? 'delete' : 'absent' });
      continue;
    }
    const source = path.join(options.run, entry.backup);
    if (!fs.existsSync(source)) {
      output.warn(`${TAG} ERROR: the backup of ${entry.path} is missing at ${source}; nothing was written`);
      return 2;
    }
    const bytes = fs.readFileSync(source);
    if (sha256(bytes.toString('utf8')) !== entry.sha256) {
      output.warn(`${TAG} ERROR: the backup copy of ${entry.path} does not match its recorded hash; nothing was written`);
      return 2;
    }
    steps.push({ entry, absolute, action: 'put back', bytes });
  }

  output.log(`${TAG} restore plan for ${root} from ${options.run}`);
  for (const step of steps) {
    const note = step.action === 'delete' && step.entry.path === 'AGENTS.md'
      ? ' (this run created it; without it Gate 3 no longer detects this directory as a workspace root)'
      : '';
    output.log(`restore ${step.entry.path}: ${step.action}${note}`);
  }
  const createdDirs = new Set(steps.flatMap((step) => (step.action === 'delete' ? recordedCreatedDirs(step.entry) : [])));
  for (const dir of createdDirs) output.log(`restore ${dir}/: remove if empty (this run created it)`);

  if (options.dryRun) {
    output.log('dry-run: nothing was written');
    return 0;
  }

  if (!options.yes) {
    output.log(`type yes to put ${steps.length} path(s) back:`);
    if (readConfirmation() !== 'yes') {
      output.log('cancelled: no confirmation, nothing was written');
      return 1;
    }
  }

  let touched = 0;
  const deleted = new Set();
  for (const step of steps) {
    if (step.action === 'delete') {
      fs.rmSync(step.absolute);
      deleted.add(step.entry.path);
      touched += 1;
      continue;
    }
    if (step.action === 'absent') continue;
    fs.mkdirSync(path.dirname(step.absolute), { recursive: true });
    fs.writeFileSync(step.absolute, step.bytes);
    touched += 1;
  }
  for (const dir of removeCreatedDirs(root, record.paths, deleted)) output.log(`restore ${dir}/: removed the empty folder this run created`);

  // Byte equality after the write, measured against the recorded hash rather than against
  // the copy that was just read.
  for (const step of steps) {
    if (step.action === 'delete' || step.action === 'absent') continue;
    if (sha256(fs.readFileSync(step.absolute, 'utf8')) !== step.entry.sha256) {
      output.warn(`${TAG} ERROR: ${step.entry.path} does not match its recorded hash after the restore`);
      output.warn('STATUS=FAIL');
      return 1;
    }
  }

  output.log(`restore: ${touched} path(s) put back, the backup at ${options.run} is kept`);
  output.log('STATUS=OK');
  return 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// 18. MAIN
// ─────────────────────────────────────────────────────────────────────────────

function outputOf(hooks) {
  return {
    log: typeof hooks.log === 'function' ? hooks.log : (line) => console.log(line),
    warn: typeof hooks.warn === 'function' ? hooks.warn : (line) => console.error(line),
  };
}

/**
 * @param {string[]} argv
 * @param {{log?: Function, warn?: Function, write?: Function}} [hooks]
 * @returns {number} the process exit code
 */
function main(argv, hooks = {}) {
  const options = parseArgs(argv);
  const output = outputOf(hooks);
  if (options.help) {
    output.log(USAGE);
    return 0;
  }
  if (options.command === null) {
    output.warn(`${TAG} ERROR: one of plan, apply or restore is required\n${USAGE}`);
    return 2;
  }
  if (!fs.existsSync(options.root) || !fs.statSync(options.root).isDirectory()) {
    output.warn(`${TAG} ERROR: the target root is not a directory: ${options.root}`);
    return 2;
  }

  try {
    if (options.command === 'plan') return commandPlan(options, output, hooks);
    if (options.command === 'apply') return commandApply(options, output, hooks);
    return commandRestore(options, output, hooks);
  } catch (error) {
    if (error instanceof AllowlistError) {
      output.warn(`${TAG} ERROR: ${error.message}; nothing was written`);
      return 2;
    }
    if (error instanceof PreconditionError || error instanceof UsageError) {
      output.warn(`${TAG} ERROR: ${error.message}`);
      if (error instanceof UsageError) output.warn(USAGE);
      return 2;
    }
    throw error;
  }
}

if (require.main === module) {
  try {
    process.exitCode = main(process.argv.slice(2));
  } catch (error) {
    console.error(`${TAG} ERROR: ${error.message}`);
    process.exitCode = 2;
  }
}

module.exports = {
  ALLOWLIST,
  MANIFEST_PATH,
  addRouterRows,
  assertWritable,
  backupBase,
  compose,
  main,
  planDigest,
  planFor,
  preservationCheck,
  renderBlock,
  renderMirror,
  renderRouter,
};

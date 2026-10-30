#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Shipped Instruction Check Engine
// ───────────────────────────────────────────────────────────────────
'use strict';

// A repository that took the shipped instruction template can be in any of seven
// states, and nothing in it says which one. Its shipped sections may be current, one
// release behind, or edited in place; its own content may sit in the marked block or be
// scattered between shipped sections; it may have no root document at all. Without that
// answer there is nothing to plan a rewrite from, and no way to tell a safe replacement
// from one that would drop a line somebody wrote. So this engine reports, per row and
// without writing a byte, what the repository holds against the manifest.
//
// Three of the twelve rows are answers this engine must not invent. The delivery budget
// and its anchors belong to the rule-copy canary, the Cursor pointer block belongs to
// the gate 1 sync, and the router belongs to the repo-rules checker. Each already has
// tests and an owner, so each is run as a child process and its own lines are carried
// into the report; re-deriving any of them here would be a second opinion that drifts
// from the first. The rest are pure classifiers over one read of the target tree.
//
// The run is read-only by construction: the only paths it opens for reading are under
// the target root plus the manifest, and the three child tools it runs are read-only
// modes. A repository that cannot be classified at all (no manifest, no target
// directory, an unreadable root document) is a failed precondition and exits 2, because
// an empty report would read like a clean one.
//
// Usage: agents-md-check.cjs [--root <dir>] [--manifest <path>] [--source] [--json]
//   --root <dir>      classify this repository instead of the one this script ships in
//   --manifest <path> read this manifest instead of the shipped one
//   --source          run the template-purity row even outside the source repository
//   --json            print one JSON object instead of the text report
// Exit codes: 0 nothing to report, 1 at least one finding or an unproven row,
//             2 a precondition failed

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const {
  classifyBody,
  deliveryAnchorEnd,
  findBlock,
  matchSections,
  segment,
} = require('./lib/agents-md-sections.cjs');
const { sourceStatus } = require('./agents-md-manifest.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const TAG = '[agents-md-check]';
const REPO_ROOT = path.resolve(__dirname, '../../../..');
const MANIFEST_PATH = path.resolve(__dirname, '../assets/agents-md-manifest.json');
const GENERATOR = path.resolve(__dirname, 'agents-md-manifest.cjs');
// The router checker ships beside the skill that authors rules, and the manifest links
// it only through the router's own row, so its path is named here once.
const REPO_RULES_CHECKER = path.resolve(
  REPO_ROOT,
  '.skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs',
);
// The checker's own tag prefix. Matching on it is what keeps this row a carrier of that
// tool's verdict instead of a second implementation of its checks.
const REPO_RULES_TAG = '[repo-rules-check]';
const USAGE = 'Usage: node .skilled/commands/doctor/scripts/agents-md-check.cjs [--root <dir>] [--manifest <path>] [--source] [--json]';
const TOOL_TIMEOUT_MS = 120000;

// A repository where fewer than half the shipped sections survive is carrying its own
// document, not a copy of the template. Above the line the question becomes which parts
// of the template are still there, which is a per-section answer.
const FOREIGN_SHARE = 0.5;

const PASS = 'PASS';
const FINDING = 'FINDING';
const UNKNOWN = 'UNKNOWN';
const INFO = 'INFO';

class UsageError extends Error {}

// ─────────────────────────────────────────────────────────────────────────────
// 3. ARGUMENTS
// ─────────────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const options = { root: REPO_ROOT, manifest: MANIFEST_PATH, source: false, json: false, help: false };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--root') {
      const value = argv[index + 1];
      if (!value || value.startsWith('--')) throw new UsageError('--root needs a directory');
      options.root = path.resolve(value);
      index += 1;
    } else if (argument === '--manifest') {
      const value = argv[index + 1];
      if (!value || value.startsWith('--')) throw new UsageError('--manifest needs a file path');
      options.manifest = path.resolve(value);
      index += 1;
    } else if (argument === '--source') {
      options.source = true;
    } else if (argument === '--json') {
      options.json = true;
    } else if (argument === '--help' || argument === '-h') {
      options.help = true;
    } else {
      throw new UsageError(`unknown argument: ${argument}`);
    }
  }
  return options;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. READING THE TARGET ONCE
// ─────────────────────────────────────────────────────────────────────────────

function countOccurrences(text, needle) {
  let count = 0;
  let at = text.indexOf(needle);
  while (at !== -1) {
    count += 1;
    at = text.indexOf(needle, at + needle.length);
  }
  return count;
}

// Section offsets are byte offsets because the delivery budget is a byte count, while a
// reader opens the file by line number. One conversion, in one place.
function lineNumberAt(text, byteOffset) {
  return Buffer.from(text, 'utf8').subarray(0, byteOffset).toString('utf8').split('\n').length;
}

function trimmedLines(text) {
  const lines = new Set();
  for (const raw of String(text).split('\n')) {
    const line = raw.trim();
    if (line !== '' && line !== '---') lines.add(line);
  }
  return lines;
}

function localLinesOf(body, reference) {
  const known = trimmedLines(reference);
  const seen = new Set();
  const local = [];
  for (const raw of body.split('\n')) {
    const line = raw.trim();
    if (line === '' || line === '---' || known.has(line) || seen.has(line)) continue;
    seen.add(line);
    local.push(line);
  }
  return local;
}

function knownBodies(manifest) {
  const sections = manifest.derived && manifest.derived.sections ? manifest.derived.sections : {};
  return {
    current: Object.keys(sections).map((id) => ({ id, sha256: sections[id].sha256, body: sections[id].body })),
    history: (manifest.derived && manifest.derived.history) || [],
  };
}

// The block carries a heading and a note that the template itself ships, so "the block is
// empty" means nothing beyond those two lines, not that the markers bracket no text.
function blockHasContent(block, markers) {
  if (!block || !block.complete) return false;
  const shipped = new Set([markers.heading.trim(), markers.note.trim()]);
  for (const raw of block.content.split('\n')) {
    const line = raw.trim();
    if (line === '' || shipped.has(line)) continue;
    return true;
  }
  return false;
}

/**
 * Read the target tree once and keep what every row needs.
 *
 * @param {{root: string, manifest: Object}} input
 * @returns {Object|null} Null when the root directory is not there.
 */
function readTarget({ root, manifest }) {
  if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) return null;

  const rootPath = path.join(root, manifest.root_file);
  const exists = fs.existsSync(rootPath);
  const text = exists ? fs.readFileSync(rootPath, 'utf8') : null;
  const segmentation = exists ? segment(text, manifest.markers, manifest.sections) : { sections: [], block: null };
  const pairing = matchSections(segmentation.sections, manifest.sections);

  return {
    root,
    rootPath,
    exists,
    text,
    totalBytes: exists ? Buffer.byteLength(text, 'utf8') : 0,
    block: segmentation.block,
    sections: segmentation.sections,
    matched: pairing.matched,
    unregistered: pairing.unregistered,
    unmatched: pairing.unmatched,
    conflicts: pairing.conflicts,
    currency: pairing.matched.map((row) => ({
      id: row.entry.id,
      section: row.section,
      ...classifyBody(row.section.body, knownBodies(manifest)),
    })),
    blockContent: blockHasContent(segmentation.block, manifest.markers),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. THE TWELVE ROWS
// ─────────────────────────────────────────────────────────────────────────────

function row(id, name, state, detail, extra = {}) {
  return { id, name, state, detail, lines: extra.lines || [], entries: extra.entries || [] };
}

// A1. The one row an operator reads first: which of the seven shapes this repository is.
function rowInstallState(context, manifest) {
  const claudePath = path.join(context.root, 'CLAUDE.md');
  if (!context.exists) {
    if (fs.existsSync(claudePath)) {
      return row('A1', 'install state', FINDING, 'claude-only',
        { lines: [`no ${manifest.root_file}; CLAUDE.md is the only instruction file`] });
    }
    return row('A1', 'install state', FINDING, 'absent',
      { lines: [`no ${manifest.root_file} and no CLAUDE.md`] });
  }

  const share = manifest.sections.length === 0 ? 0 : context.matched.length / manifest.sections.length;
  if (share < FOREIGN_SHARE) {
    return row('A1', 'install state', FINDING, 'foreign', {
      lines: [
        `${context.matched.length} of ${manifest.sections.length} shipped sections match, under the ${Math.round(FOREIGN_SHARE * 100)}% floor`,
        'the root document is the repository\'s own file',
      ],
    });
  }

  const localEdits = context.currency.filter((entry) => entry.state === 'edited' || entry.state === 'unknown-base');
  const behind = context.currency.filter((entry) => entry.state === 'stale-known');
  // A local edit outranks a missed release in the reading order: it is the shape that
  // loses text if somebody replaces the document, and staleness only loses a patch.
  if (localEdits.length > 0 || context.unregistered.length > 0) {
    const lines = [];
    for (const entry of localEdits) lines.push(`${entry.id}: ${entry.state}`);
    for (const entry of context.unregistered) lines.push(`unmarked section ${JSON.stringify(entry.heading)}`);
    return row('A1', 'install state', FINDING, 'forked', { lines });
  }
  if (behind.length > 0) {
    return row('A1', 'install state', FINDING, 'stale',
      { lines: behind.map((entry) => `${entry.id}: ${entry.state}`) });
  }
  if (context.blockContent) {
    return row('A1', 'install state', PASS, 'adopted',
      { lines: ['every shipped section is current and the repository block carries content'] });
  }
  return row('A1', 'install state', PASS, 'pure',
    { lines: ['every shipped section is current and the repository block is empty'] });
}

// A2. Which shipped sections survived, by the prefix each authored entry carries.
function rowSectionsPresent(context, manifest) {
  const present = new Set(context.matched.map((row_) => row_.entry.id));
  const missing = manifest.sections.map((entry) => entry.id).filter((id) => !present.has(id));
  const detail = `${present.size}/${manifest.sections.length} matched`;
  if (missing.length === 0 && context.conflicts.length === 0) {
    return row('A2', 'sections present', PASS, detail);
  }
  const lines = missing.map((id) => `missing section ${id}`);
  for (const conflict of context.conflicts) lines.push(conflict.message);
  return row('A2', 'sections present', FINDING, `${present.size}/${manifest.sections.length} matched, ${missing.length} missing`, {
    lines,
    entries: missing.map((id) => ({ id, present: false })),
  });
}

// The byte offset of the first line that is exactly this text, or -1 when the document
// does not carry it.
function firstLineOffset(text, needle) {
  if (text.startsWith(needle)) return 0;
  const at = text.indexOf(`\n${needle}`);
  return at === -1 ? -1 : at + 1;
}

// The shipped numbering, read from the pin that names it. Hundreds of files cite these
// numbers, and the document carries its fourth section before its third, so the citation
// order is not the reading order and only the pin carries the expected one.
function numberingReport(context, manifest) {
  if (!context.exists) return { state: INFO, detail: 'no root document to number', lines: [] };

  const pin = (manifest.pins || []).find((entry) => entry.kind === 'order');
  if (!pin) return { state: INFO, detail: 'the manifest declares no numbering pin', lines: [] };

  const found = [];
  const absent = [];
  for (const text of pin.texts) {
    const at = firstLineOffset(context.text, text);
    if (at === -1) absent.push(text.trim());
    else found.push({ text: text.trim(), at });
  }
  const expected = pin.texts.map((text) => text.trim()).filter((text) => found.some((entry) => entry.text === text));
  const actual = found.slice().sort((left, right) => left.at - right.at).map((entry) => entry.text);

  const lines = absent.map((text) => `missing section number ${JSON.stringify(text)}`);
  if (expected.join('|') !== actual.join('|')) {
    lines.push(`the numbers appear as ${actual.join(', ')} instead of ${expected.join(', ')}`);
  }
  return { state: lines.length === 0 ? PASS : FINDING, detail: `${found.length}/${pin.texts.length} section numbers in place`, lines };
}

// A3. Shipped sections in manifest order, and section numbers unchanged.
function rowOrderAndNumbering(context, manifest) {
  const order = manifest.sections.map((entry) => entry.id);
  const seen = context.matched.map((entry) => entry.entry.id);
  const expected = order.filter((id) => seen.includes(id));
  const numbering = numberingReport(context, manifest);

  const lines = [...numbering.lines];
  if (expected.join('|') !== seen.join('|')) {
    const first = seen.findIndex((id, index) => id !== expected[index]);
    lines.unshift(`section order differs at position ${first + 1}: found ${seen[first]}, expected ${expected[first]}`);
  }
  const state = lines.length === 0 ? PASS : FINDING;
  return row('A3', 'order and numbering', state, state === PASS ? 'manifest order and section numbers unchanged' : 'order or numbering drifted', { lines });
}

// A4. Per section, whether the body is the shipped one, an older release, a local edit
// or something with no base to name.
function rowCurrency(context) {
  const counts = { current: 0, 'stale-known': 0, edited: 0, 'unknown-base': 0 };
  const entries = [];
  for (const entry of context.currency) {
    counts[entry.state] += 1;
    entries.push({ id: entry.id, state: entry.state, base: entry.base || null });
  }
  const detail = `${counts.current} current, ${counts['stale-known']} stale-known, ${counts.edited} edited, ${counts['unknown-base']} unknown-base`;
  const lines = [];
  for (const entry of context.currency) {
    if (entry.state === 'current') continue;
    const base = entry.base ? entry.base.slice(0, 12) : 'none';
    lines.push(`${entry.id}: ${entry.state} (closest known body ${base})`);
  }
  return row('A4', 'section currency', lines.length === 0 ? PASS : FINDING, detail, { lines, entries });
}

// A5. Every string downstream tooling greps out of the document, checked by its rule.
function rowPins(context, manifest) {
  const entries = [];
  const byId = new Map(context.matched.map((entry) => [entry.entry.id, entry.section]));

  for (const pin of manifest.pins || []) {
    const verdict = pinVerdict(pin, context, manifest, byId);
    entries.push({ id: pin.id, kind: pin.kind, state: verdict.state, detail: verdict.detail });
  }

  const failed = entries.filter((entry) => entry.state === FINDING);
  const lines = failed.map((entry) => `${entry.id} (${entry.kind}): ${entry.detail}`);
  return row('A5', 'pins', failed.length === 0 ? PASS : FINDING,
    `${entries.length - failed.length}/${entries.length} pins hold`, { lines, entries });
}

function pinVerdict(pin, context, manifest, byId) {
  const section = pin.section ? byId.get(pin.section) : null;
  if (pin.section && !section) {
    return { state: FINDING, detail: `the section ${pin.section} that carries this pin is missing` };
  }

  switch (pin.kind) {
    case 'exact': {
      const missing = pin.texts.filter((text) => !section.body.includes(text));
      return missing.length === 0
        ? { state: PASS, detail: `all ${pin.texts.length} strings present in ${pin.section}` }
        : { state: FINDING, detail: `missing ${JSON.stringify(missing[0])} in ${pin.section}` };
    }
    case 'line': {
      const required = (pin.requires || pin.texts).map((text) => text.toLowerCase());
      const hit = section.body.split('\n').some((line) => {
        const lower = line.toLowerCase();
        return required.every((text) => lower.includes(text));
      });
      return hit
        ? { state: PASS, detail: `a line in ${pin.section} carries ${required.join(', ')}` }
        : { state: FINDING, detail: `no line in ${pin.section} carries ${required.join(', ')}` };
    }
    case 'first-occurrence': {
      const at = context.text.indexOf(pin.texts[0]);
      const inside = at >= section.start && at < section.end;
      if (inside) return { state: PASS, detail: `the first occurrence sits inside ${pin.section}` };
      return {
        state: FINDING,
        detail: at === -1
          ? `the text ${JSON.stringify(pin.texts[0])} is absent`
          : `the first occurrence at byte ${at} sits outside ${pin.section} (${section.start}..${section.end}), so anything reading the first line of the document follows it instead`,
      };
    }
    case 'delivery-anchor': {
      const end = deliveryAnchorEnd(section, pin);
      if (end === null) return { state: FINDING, detail: `the anchor text is absent from ${pin.section}` };
      const limit = manifest.budget.prefix_bytes;
      return end <= limit
        ? { state: PASS, detail: `${pin.section} ends at byte ${end}, inside ${limit}` }
        : { state: FINDING, detail: `${pin.section} ends at byte ${end}, past the ${limit}-byte delivery prefix` };
    }
    case 'budget': {
      const declared = manifest.budget[pin.limit_key];
      const pinned = Number(pin.texts[0]);
      return declared === pinned
        ? { state: PASS, detail: `${pin.limit_key} is ${declared}` }
        : { state: FINDING, detail: `${pin.limit_key} reads ${declared}, the pin says ${pinned}` };
    }
    case 'order': {
      const numbering = numberingReport(context, manifest);
      return { state: numbering.state, detail: numbering.detail };
    }
    case 'file': {
      const target = path.join(context.root, pin.path);
      return fs.existsSync(target)
        ? { state: PASS, detail: `${pin.path} exists` }
        : { state: FINDING, detail: `${pin.path} is missing` };
    }
    default:
      return { state: INFO, detail: `no rule for a pin of kind ${pin.kind}` };
  }
}

// A6. The delivery budget: the canary's own AGENTS.md lines, plus the two measurements
// the report needs. Only this row's file is kept, because the canary also pins the skill
// it ships in and a consumer legitimately has none of those.
function rowBudget(context, manifest, tools) {
  if (typeof tools.canary !== 'string' || !fs.existsSync(tools.canary)) {
    return row('A6', 'delivery budget', UNKNOWN,
      `the rule-copy canary is not installed at ${tools.canary || '(no path)'}; the budget cannot be measured`);
  }

  const run = spawnSync(process.execPath, [tools.canary, '--root', context.root], {
    encoding: 'utf8',
    timeout: TOOL_TIMEOUT_MS,
    maxBuffer: 16 * 1024 * 1024,
  });
  const output = `${run.stdout || ''}\n${run.stderr || ''}`.split('\n').map((line) => line.trim()).filter((line) => line !== '');
  if (run.error || (run.status !== 0 && run.status !== 1)) {
    return row('A6', 'delivery budget', UNKNOWN,
      `the rule-copy canary could not run: ${run.error ? run.error.message : `exit ${run.status}`}`);
  }

  // The canary prints its verdict, an anchor table and its findings. Only the findings
  // that name this document belong to this row; its PASS and table lines are its own
  // report, and the anchor end byte is measured below instead of parsed back out.
  const own = output
    .filter((line) => line.includes(manifest.root_file))
    .filter((line) => /^(MISSING|BLOCKED):/u.test(line));
  const elsewhere = output.filter((line) => !line.includes(manifest.root_file));

  const limit = manifest.budget.prefix_bytes;
  const ceiling = manifest.budget.max_bytes;
  const prefixEnd = (manifest.pins || [])
    .filter((pin) => pin.kind === 'delivery-anchor')
    .reduce((max, pin) => {
      const section = context.matched.find((entry) => entry.entry.id === pin.section);
      if (!section) return max;
      const end = deliveryAnchorEnd(section.section, pin);
      return end === null ? max : Math.max(max, end);
    }, 0);

  const failures = [...own];
  // The canary already names whatever it measured, so this row adds a figure only for a
  // defect the canary did not report, instead of printing the same ceiling twice.
  if (prefixEnd > limit && !own.some((line) => line.includes('delivery prefix'))) {
    failures.push(`the last anchor ends at byte ${prefixEnd}, past the ${limit}-byte delivery prefix`);
  }
  if (context.totalBytes > ceiling && !own.some((line) => line.includes('ceiling'))) {
    failures.push(`${context.totalBytes} bytes exceeds the ${ceiling}-byte ceiling`);
  }
  // A failing canary that names other files only is still a fact worth stating, because
  // its exit status would otherwise read as this row's verdict. A passing one needs no
  // note: its remaining lines are its own anchor table.
  const notes = failures.length === 0 && run.status !== 0 && elsewhere.length > 0
    ? [`the canary exits ${run.status} over ${elsewhere.length} line(s) outside ${manifest.root_file}, which belong to other files' pins`]
    : [];

  return row('A6', 'delivery budget', failures.length === 0 ? PASS : FINDING,
    `${prefixEnd} of ${limit} bytes to the last anchor, ${context.totalBytes} of ${ceiling} bytes total`,
    { lines: [...failures, ...notes] });
}

// A7. The repository block: one start marker, one end marker, in that order, after every
// shipped section, small enough to leave headroom.
function rowBlock(context, manifest) {
  const { markers, budget } = manifest;
  const starts = context.exists ? countOccurrences(context.text, markers.start) : 0;
  const ends = context.exists ? countOccurrences(context.text, markers.end) : 0;

  if (starts === 0 && ends === 0) {
    return row('A7', 'repo-local block', PASS, `no block; ${context.totalBytes} of ${budget.max_bytes} bytes used`);
  }
  if (starts !== 1 || ends !== 1) {
    return row('A7', 'repo-local block', FINDING,
      `expected one start and one end marker, found ${starts} and ${ends}`,
      { lines: [`the block cannot be placed, so nothing inside it can be carried`] });
  }

  const block = context.block || findBlock(context.text, markers);
  const lines = [];
  if (!block || !block.complete) {
    lines.push('the end marker sits before the start marker, so the block is out of order and unreadable');
  }
  const lastShippedEnd = context.matched.reduce((max, entry) => Math.max(max, entry.section.end), 0);
  if (block && block.complete && block.start < lastShippedEnd) {
    lines.push(`the block starts at byte ${block.start}, inside the shipped sections`);
  }
  if (block && block.complete && block.start < budget.prefix_bytes) {
    lines.push(`the block starts at byte ${block.start}, inside the ${budget.prefix_bytes}-byte delivery prefix`);
  }
  if (context.totalBytes > budget.max_bytes) {
    lines.push(`${context.totalBytes} bytes exceeds the ${budget.max_bytes}-byte ceiling`);
  }

  const size = block && block.complete ? Buffer.byteLength(block.content, 'utf8') : 0;
  const headroom = budget.max_bytes - context.totalBytes;
  const detail = block && block.complete
    ? `block ${size} bytes, ${headroom} bytes of headroom`
    : `block unreadable, ${headroom} bytes of headroom`;
  return row('A7', 'repo-local block', lines.length === 0 ? PASS : FINDING, detail,
    { lines, entries: [{ size, headroom, complete: Boolean(block && block.complete) }] });
}

// A8. Repository content outside the block that matches no shipped section. This is the
// content a replacement would drop, so it is reported by line and byte range.
function rowUnmarked(context, manifest) {
  const prefixBytes = manifest.budget.prefix_bytes;
  const entries = context.unregistered.map((entry) => {
    const section = context.sections.find((candidate) => candidate.start === entry.start) || { start: entry.start, end: entry.start };
    return {
      heading: entry.heading,
      line_start: lineNumberAt(context.text, section.start),
      line_end: lineNumberAt(context.text, Math.max(section.start, section.end - 1)),
      byte_start: section.start,
      byte_end: section.end,
      in_prefix: section.start < prefixBytes,
    };
  });
  if (entries.length === 0) return row('A8', 'unmarked repo-unique content', PASS, 'no section outside the block');

  return row('A8', 'unmarked repo-unique content', FINDING,
    `${entries.length} section(s) outside the block match no shipped section`,
    {
      lines: entries.map((entry) => `${JSON.stringify(entry.heading)}: lines ${entry.line_start}-${entry.line_end}, bytes ${entry.byte_start}-${entry.byte_end}${entry.in_prefix ? ', inside the delivery prefix' : ''}`),
      entries,
    });
}

// A9. For a section that is not the shipped body, the lines the shipped body does not
// carry. Those are the lines a replacement would lose.
function rowUnmarkedEdits(context, manifest) {
  const entries = [];
  for (const entry of context.currency) {
    if (entry.state !== 'edited' && entry.state !== 'unknown-base') continue;
    const shipped = manifest.derived.sections[entry.id];
    entries.push({
      id: entry.id,
      state: entry.state,
      lines: localLinesOf(entry.section.body, shipped ? shipped.body : ''),
    });
  }
  if (entries.length === 0) return row('A9', 'unmarked local edits', PASS, 'no edited section');

  const total = entries.reduce((sum, entry) => sum + entry.lines.length, 0);
  return row('A9', 'unmarked local edits', FINDING,
    `${entries.length} section(s) carry ${total} local line(s)`, {
      lines: entries.flatMap((entry) => entry.lines.map((line) => `${entry.id}: ${line}`)),
      entries,
    });
}

// A10. The copies each runtime loads. Claude reads the root document directly, so a full
// CLAUDE.md double-loads and drifts; the Cursor rule is generated and alone carries the
// gate 1 lookup to Cursor and Devin, so it is checked by its own generator.
function rowRuntimeCopies(context, manifest, tools) {
  const entries = [];
  const lines = [];

  for (const expected of manifest.runtime_copies || []) {
    const verdict = copyVerdict(expected, context, manifest, tools);
    entries.push({ path: expected.path, kind: verdict.kind, state: verdict.state, lines: verdict.lines || [] });
    if (verdict.state === FINDING) lines.push(`${expected.path}: ${verdict.kind} - ${verdict.detail}`);
  }

  const failed = entries.filter((entry) => entry.state === FINDING);
  return row('A10', 'runtime copies', failed.length === 0 ? PASS : FINDING,
    `${entries.length - failed.length}/${entries.length} copies as expected`, { lines, entries });
}

function copyVerdict(expected, context, manifest, tools) {
  if (expected.report_only) {
    return { state: INFO, kind: 'reported only', detail: 'outside the checklist this command rewrites' };
  }
  if (expected.path.startsWith('~')) {
    return { state: INFO, kind: 'outside the repository', detail: 'reported, never read' };
  }

  const target = path.join(context.root, expected.path);
  if (expected.path.endsWith('.md') && expected.expect.includes('gate1-block-in-sync')) {
    if (typeof tools.pointerSync !== 'string' || !fs.existsSync(tools.pointerSync)) {
      return { state: UNKNOWN, kind: 'gate1 block unmeasured', detail: `the pointer sync is not installed at ${tools.pointerSync || '(no path)'}` };
    }
    const run = spawnSync(process.execPath, [tools.pointerSync, '--check', '--root', context.root], {
      encoding: 'utf8',
      timeout: TOOL_TIMEOUT_MS,
    });
    const output = `${run.stdout || ''}\n${run.stderr || ''}`.split('\n').map((line) => line.trim()).filter((line) => line !== '');
    if (run.status === 0) return { state: PASS, kind: 'gate1 block in sync', detail: 'the generator reports no drift' };
    if (run.status === 1) return { state: FINDING, kind: 'gate1 block out of sync', detail: output.join('; ') };
    return { state: UNKNOWN, kind: 'gate1 block unmeasured', detail: output.join('; ') || `the pointer sync exited ${run.status}` };
  }

  const exists = fs.existsSync(target) || isSymlink(target);
  const expectsAbsent = expected.expect.length === 1 && expected.expect[0] === 'absent';

  if (expected.path === '.cursor/rules/repo-local.md') {
    if (context.blockContent) {
      if (!exists) return { state: FINDING, kind: 'mirror missing', detail: 'the block carries content and nothing mirrors it' };
      const mirror = fs.readFileSync(target, 'utf8');
      const missing = [...trimmedLines(context.block.content)].filter((line) => !mirror.includes(line));
      return missing.length === 0
        ? { state: PASS, kind: 'mirror current', detail: 'the mirror carries the block' }
        : { state: FINDING, kind: 'mirror behind', detail: `${missing.length} block line(s) are not in the mirror` };
    }
    return exists
      ? { state: FINDING, kind: 'mirror of an empty block', detail: 'the block is empty and a mirror exists' }
      : { state: PASS, kind: 'absent', detail: 'no block content to mirror' };
  }

  if (!exists) {
    return expectsAbsent
      ? { state: PASS, kind: 'absent', detail: 'nothing to load twice' }
      : { state: PASS, kind: 'absent', detail: 'absent, which the checklist allows' };
  }

  if (isSymlink(target)) {
    const link = fs.readlinkSync(target);
    const pointsAtRoot = path.basename(link) === manifest.root_file;
    if (pointsAtRoot) return { state: PASS, kind: 'symlink', detail: `links to ${link}` };
    return { state: FINDING, kind: 'symlink elsewhere', detail: `links to ${link} instead of ${manifest.root_file}` };
  }

  const content = fs.readFileSync(target, 'utf8');
  if (!context.exists) {
    return { state: FINDING, kind: 'sole instruction file', detail: `there is no ${manifest.root_file} for it to point at` };
  }
  if (content === context.text) {
    return { state: FINDING, kind: 'identical copy', detail: `byte-identical to ${manifest.root_file}, so the two will drift` };
  }

  const unique = localLinesOf(content, context.text);
  const rootLines = trimmedLines(context.text);
  const sharesShippedLine = [...trimmedLines(content)].some((line) => rootLines.has(line));
  const namesRoot = [...trimmedLines(content)].some((line) => line.includes(manifest.root_file));
  // A pointer is a file that carries no shipped line and names the root document. Anything
  // else is either a copy or a copy plus local lines, and both drift: the second also
  // loses text when it is replaced, so the lines only it carries are listed.
  if (!sharesShippedLine && namesRoot) {
    return { state: PASS, kind: 'pointer', detail: `every line names ${manifest.root_file}` };
  }
  return { state: FINDING, kind: 'divergent copy', detail: `${unique.length} line(s) only this file carries`, lines: unique };
}

function isSymlink(target) {
  try {
    return fs.lstatSync(target).isSymbolicLink();
  } catch {
    return false;
  }
}

// A11. The router: present, carrying the rows the template ships, and passing its own
// checker. The checker's summary line is carried through, never rebuilt.
function rowRouter(context, manifest, tools) {
  const routerPath = path.join(context.root, manifest.router_file);
  if (!fs.existsSync(routerPath)) {
    return row('A11', 'REPO RULES.md', FINDING, 'absent',
      { lines: [`no ${manifest.router_file}: no repository rule can load`], entries: [{ path: manifest.router_file, present: false }] });
  }

  const text = fs.readFileSync(routerPath, 'utf8');
  const shipped = (manifest.derived && manifest.derived.repo_rules) || { trigger_rows: [], index_rows: [] };
  const lines = [];
  const missing = [
    ...missingRows(shipped.trigger_rows, parseTableRows(text, 'TRIGGER TABLE'), 'trigger'),
    ...missingRows(shipped.index_rows, parseTableRows(text, 'INDEX'), 'index'),
  ];
  for (const entry of missing) lines.push(`missing ${entry.kind} row for ${entry.rule}`);

  if (typeof tools.repoRules !== 'string' || !fs.existsSync(tools.repoRules)) {
    return row('A11', 'REPO RULES.md', UNKNOWN, 'present; the repo-rules checker is not installed',
      { lines: [...lines, `the checker is not installed at ${tools.repoRules || '(no path)'}`] });
  }

  const run = spawnSync(process.execPath, [tools.repoRules, '--root', context.root], {
    encoding: 'utf8',
    timeout: TOOL_TIMEOUT_MS,
  });
  const output = `${run.stdout || ''}\n${run.stderr || ''}`.split('\n').map((line) => line.trim()).filter((line) => line !== '');
  const summary = output.find((line) => line.includes(REPO_RULES_TAG) && line.includes('RESULT:'));

  if (run.status === 2 || !summary) {
    return row('A11', 'REPO RULES.md', UNKNOWN, 'the repo-rules checker could not run',
      { lines: [...lines, ...output.filter((line) => line.includes(REPO_RULES_TAG))] });
  }
  if (run.status !== 0) {
    return row('A11', 'REPO RULES.md', FINDING, `${missing.length} shipped row(s) missing; the checker fails`,
      { lines: [...lines, summary] });
  }
  return row('A11', 'REPO RULES.md', lines.length === 0 ? PASS : FINDING,
    `${missing.length} shipped row(s) missing; ${summary}`, { lines: [...lines, summary] });
}

// The router's own table, read the same way the manifest's rows were derived. Comparing
// shipped rows to the file is the only way to say which of them a consumer dropped.
function parseTableRows(text, anchor) {
  const lines = text.split('\n');
  const start = lines.findIndex((line) => line.startsWith('#') && line.includes(anchor));
  if (start === -1) return [];

  const rows = [];
  let width = 0;
  for (let index = start + 1; index < lines.length; index += 1) {
    const line = lines[index].trim();
    if (line.startsWith('#')) break;
    if (!line.startsWith('|')) {
      if (rows.length > 0 && line === '') break;
      continue;
    }
    const cells = line.replace(/^\|/u, '').replace(/\|$/u, '').split('|').map((cell) => cell.trim());
    if (cells.every((cell) => /^:?-+:?$/u.test(cell) || cell === '')) continue;
    if (width === 0) {
      width = cells.length;
      continue;
    }
    if (cells.length !== width) continue;
    rows.push(cells);
  }
  return rows;
}

function rulePathOf(cells) {
  for (const cell of cells) {
    const linked = /\(([^)]+\.md)\)/u.exec(cell);
    if (linked) return linked[1];
    const bare = /`([^`]+\.md)`/u.exec(cell);
    if (bare) return bare[1];
  }
  return null;
}

function missingRows(shipped, present, kind) {
  const found = new Set(present.map((cells) => rulePathOf(cells) || cells.join(' | ')));
  const missing = [];
  for (const cells of shipped) {
    const rule = rulePathOf(cells) || cells.join(' | ');
    if (!found.has(rule)) missing.push({ kind, rule });
  }
  return missing;
}

// A12. The source repository's own two promises: its block stays empty, and its derived
// copy of the template is fresh. A consumer's block is its own, so this row reports INFO
// there instead of telling it what to do with its own file.
function rowTemplatePurity(context, manifest, tools, options) {
  let source = { isSource: false, reason: `origin was not compared` };
  try {
    source = sourceStatus({ root: context.root, manifest });
  } catch (error) {
    source = { isSource: false, reason: error.message };
  }

  if (!options.source && !source.isSource) {
    return row('A12', 'template purity', INFO,
      `runs only in the source repository; ${source.reason || 'the origin differs'}`);
  }

  const lines = [];
  if (context.blockContent) lines.push('the source repository block carries content, and every line here ships to every consumer');
  if (context.block && !context.block.complete) lines.push('the source repository block is not well formed');

  if (typeof tools.generator !== 'string' || !fs.existsSync(tools.generator)) {
    return row('A12', 'template purity', UNKNOWN,
      `the manifest generator is not installed at ${tools.generator || '(no path)'}`);
  }
  const run = spawnSync(process.execPath, [tools.generator, '--check', '--root', context.root, '--manifest', options.manifest], {
    encoding: 'utf8',
    timeout: TOOL_TIMEOUT_MS,
  });
  const output = `${run.stdout || ''}\n${run.stderr || ''}`.split('\n').map((line) => line.trim()).filter((line) => line !== '');
  if (run.status !== 0) lines.push(...output);

  const state = lines.length === 0 ? PASS : FINDING;
  return row('A12', 'template purity', state,
    state === PASS ? 'block empty and the derived copy is fresh' : 'the source template is not pure', { lines });
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. REPORT
// ─────────────────────────────────────────────────────────────────────────────

function defaultTools(manifest) {
  const canaryPin = (manifest.pins || []).find((pin) => String(pin.consumer || '').endsWith('check-rule-copies.js'));
  const pointerPin = (manifest.pins || []).find((pin) => pin.kind === 'first-occurrence');
  return {
    canary: canaryPin ? path.join(REPO_ROOT, canaryPin.consumer) : null,
    pointerSync: pointerPin ? path.join(REPO_ROOT, pointerPin.consumer) : null,
    repoRules: REPO_RULES_CHECKER,
    generator: GENERATOR,
  };
}

/**
 * Classify one repository.
 *
 * @param {{root?: string, manifestPath?: string, source?: boolean, tools?: Object}} [input]
 * @returns {{root: string, manifest: string, state: string, status: string, exitCode: number,
 *   findings: number, unknown: number, rows: Array<Object>} | null} Null when the root
 *   directory or the manifest is not readable.
 */
function buildReport(input = {}) {
  const root = input.root ? path.resolve(input.root) : REPO_ROOT;
  const manifestPath = input.manifestPath ? path.resolve(input.manifestPath) : MANIFEST_PATH;
  if (!fs.existsSync(manifestPath)) return null;

  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  } catch {
    return null;
  }

  const context = readTarget({ root, manifest });
  if (context === null) return null;

  const tools = { ...defaultTools(manifest), ...(input.tools || {}) };
  const rows = [
    rowInstallState(context, manifest),
    rowSectionsPresent(context, manifest),
    rowOrderAndNumbering(context, manifest),
    rowCurrency(context),
    rowPins(context, manifest),
    rowBudget(context, manifest, tools),
    rowBlock(context, manifest),
    rowUnmarked(context, manifest),
    rowUnmarkedEdits(context, manifest),
    rowRuntimeCopies(context, manifest, tools),
    rowRouter(context, manifest, tools),
    rowTemplatePurity(context, manifest, tools, { source: Boolean(input.source), manifest: manifestPath }),
  ];

  const findings = rows.filter((entry) => entry.state === FINDING).length;
  const unknown = rows.filter((entry) => entry.state === UNKNOWN).length;
  const exitCode = findings > 0 || unknown > 0 ? 1 : 0;
  const status = exitCode === 0 ? 'OK' : (findings > 0 ? 'FINDINGS' : 'UNKNOWN');

  return {
    root,
    manifest: manifestPath,
    state: rows[0].detail,
    status,
    exitCode,
    findings,
    unknown,
    rows,
  };
}

// A long row is a list, not a wall: the report keeps every line in the JSON form and
// prints the first few here, so a reader sees the shape before the volume.
const PRINTED_LINES = 20;

function renderText(report) {
  const lines = [];
  for (const entry of report.rows) {
    lines.push(`${entry.id} ${entry.name}: ${entry.detail}   (${entry.state})`);
    for (const line of entry.lines.slice(0, PRINTED_LINES)) lines.push(`  ${line}`);
    if (entry.lines.length > PRINTED_LINES) {
      lines.push(`  ... ${entry.lines.length - PRINTED_LINES} more line(s), all of them in the JSON report`);
    }
  }
  lines.push(`STATUS=${report.status} rows=${report.rows.length} findings=${report.findings} unknown=${report.unknown}`);
  return `${lines.join('\n')}\n`;
}

function renderJson(report) {
  const shaped = {
    root: report.root,
    manifest: report.manifest,
    state: report.state,
    status: report.status,
    exit_code: report.exitCode,
    findings: report.findings,
    unknown: report.unknown,
    rows: report.rows.map((entry) => ({
      id: entry.id,
      name: entry.name,
      state: entry.state,
      detail: entry.detail,
      lines: entry.lines,
      entries: entry.entries,
    })),
  };
  return `${JSON.stringify(shaped, null, 2)}\n`;
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. MAIN
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @param {string[]} argv
 * @param {{tools?: Object}} [hooks] - test seams for the child tools
 * @returns {number} the process exit code
 */
function main(argv, hooks = {}) {
  const options = parseArgs(argv);
  if (options.help) {
    console.log(USAGE);
    return 0;
  }

  if (!fs.existsSync(options.manifest)) {
    console.error(`${TAG} ERROR: the manifest is missing at ${options.manifest}`);
    return 2;
  }
  if (!fs.existsSync(options.root) || !fs.statSync(options.root).isDirectory()) {
    console.error(`${TAG} ERROR: the target root is not a directory: ${options.root}`);
    return 2;
  }
  const rootPath = path.join(options.root, 'AGENTS.md');
  if (fs.existsSync(rootPath)) {
    try {
      fs.readFileSync(rootPath, 'utf8');
    } catch (error) {
      console.error(`${TAG} ERROR: cannot read ${rootPath}: ${error.message}`);
      return 2;
    }
  }

  const report = buildReport({
    root: options.root,
    manifestPath: options.manifest,
    source: options.source,
    tools: hooks.tools || {},
  });
  if (report === null) {
    // A manifest that cannot be parsed leaves nothing to compare against, and an empty
    // report would read like a clean one.
    console.error(`${TAG} ERROR: cannot classify ${options.root}: the manifest at ${options.manifest} could not be read as JSON`);
    return 2;
  }

  process.stdout.write(options.json ? renderJson(report) : renderText(report));
  return report.exitCode;
}

if (require.main === module) {
  try {
    process.exitCode = main(process.argv.slice(2));
  } catch (error) {
    console.error(`${TAG} ERROR: ${error.message}`);
    if (error instanceof UsageError) console.error(USAGE);
    process.exitCode = 2;
  }
}

module.exports = {
  MANIFEST_PATH,
  buildReport,
  main,
  renderJson,
  renderText,
};

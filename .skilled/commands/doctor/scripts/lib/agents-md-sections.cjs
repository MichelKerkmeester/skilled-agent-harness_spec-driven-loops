#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Shipped Section Segmenter
// ───────────────────────────────────────────────────────────────────
'use strict';

// The shipped template is one Markdown document, and three callers need to agree on what
// its sections are: the manifest generator copies a body per section, the check engine
// compares a repository's copy section by section, and the embed engine rewrites the
// document section by section. Three segmenters would eventually disagree about where a
// section ends, and a body that is one newline off reads as an edit nobody made. So this
// module is the only splitter, and the rules a section obeys are written down here once.
//
// A section starts at a heading line of level 1 to 4 and runs to the next heading or to
// the end of the document. Offsets are bytes, not characters, because the delivery budget
// is a byte count and the emoji headings are multi-byte.
//
// The whole document is segmented, not only the part above the repository block. Reading
// up to the block was enough while every block sat last, and it turned a block written
// anywhere else into a document whose tail did not exist: the sections below it read as
// missing, their replacement would be duplicated into the block, and the text a rewrite
// would drop was never named. The block is a hole instead. A heading inside it belongs to
// the repository, the bytes between the markers join no body, the section the hole
// interrupts carries its text on both sides, and a section below the hole keeps its own
// body word for word.
//
// One piece of content is not heading-shaped: text above the first heading belongs to no
// section at all. It is returned as `prelude` so the caller can report it and keep it,
// because a document carrying it is not the clean template it otherwise looks like.
//
// The classifier answers the one question the check engine asks per section: is this body
// the one the manifest ships, an older released body, a local edit of a known body, or
// something with no base at all. It compares hashes first, because a hash match needs no
// judgment, and falls back to line overlap only to name the base of an edited body.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const crypto = require('node:crypto');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const HEADING = /^(#{1,4}) (.+)$/;
// A body that shares less than half its lines with every known body gets no base named.
// Naming one anyway would invite a carry against a section the repository rewrote, which
// is where a "kept local" line turns into a dropped one.
const SIMILARITY_FLOOR = 0.5;

// ─────────────────────────────────────────────────────────────────────────────
// 3. HASHES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The hex sha256 of a text, encoded as the file is read.
 *
 * @param {string} text
 * @returns {string}
 */
function sha256(text) {
  return crypto.createHash('sha256').update(text, 'utf8').digest('hex');
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. THE REPOSITORY-OWNED BLOCK
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Locate the repository-owned block, in byte offsets, without copying it into a section.
 *
 * @param {string} text - The whole root document.
 * @param {{start: string, end: string}} markers - The two marker lines.
 * @returns {null|{start: number, end: number, content: string, complete: boolean}}
 *   Null when the document carries neither marker. `end` is the byte after the end
 *   marker, so the two offsets bracket the block and nothing else.
 */
function findBlock(text, markers) {
  const buffer = Buffer.from(text, 'utf8');
  const start = buffer.indexOf(markers.start);
  const end = buffer.indexOf(markers.end);
  if (start === -1 && end === -1) return null;

  if (start === -1 || end === -1 || end < start) {
    // A half-written block is a document fault, not a section: report where the marker
    // that does exist sits so the caller can name the spot instead of guessing.
    const only = start === -1 ? end : start;
    return { start: only, end: only, content: '', complete: false };
  }

  const contentStart = start + Buffer.byteLength(markers.start, 'utf8');
  return {
    start,
    end: end + Buffer.byteLength(markers.end, 'utf8'),
    content: buffer.subarray(contentStart, end).toString('utf8'),
    complete: true,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. SEGMENTATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The line holding a byte, as an index into the document's lines.
 *
 * @param {number[]} byteStarts - The first byte of every line.
 * @param {number} offset
 * @returns {number}
 */
function lineOf(byteStarts, offset) {
  let line = 0;
  while (line + 1 < byteStarts.length && byteStarts[line + 1] <= offset) line += 1;
  return line;
}

/**
 * The lines one section body is made of.
 *
 * The block's own lines are cut out of the middle. What follows them is the section's when
 * somebody wrote it there, and the block's spacing when it is blank: folding blank lines
 * into the body would make a current section read as an edit nobody made.
 *
 * @param {string[]} lines - The document's lines.
 * @param {number} from - The heading's line index.
 * @param {number} to - One past the last line the section reaches.
 * @param {{first: number, last: number}|null} hole - The block's lines, when it is well formed.
 * @returns {number[]} the line indexes of the body, in reading order.
 */
function bodyRows(lines, from, to, hole) {
  const head = [];
  const tail = [];
  const tailFrom = hole !== null && hole.last >= from && hole.last < to ? hole.last : null;
  for (let index = from; index < to; index += 1) {
    if (hole !== null && index >= hole.first && index <= hole.last) continue;
    if (tailFrom !== null && index > tailFrom) tail.push(index);
    else head.push(index);
  }
  if (tail.length > 0 && tail.every((index) => lines[index].trim() === '')) return head;
  return [...head, ...tail];
}

/**
 * The text of one body, the byte offset of every one of its lines, and where it ends.
 *
 * @param {string[]} lines - The document's lines.
 * @param {number[]} byteStarts - The first byte of every line, plus one past the last.
 * @param {number[]} rows - The line indexes the body is made of.
 * @param {number} docBytes - The document's length in bytes.
 * @returns {{text: string, lineStarts: number[], end: number}}
 */
function bodyOf(lines, byteStarts, rows, docBytes) {
  const last = rows[rows.length - 1];
  // A body that stops before the end of the document carries the newline that ends its
  // last line, which is what a byte slice would have kept. A final line without a newline
  // ends the document rather than the line after it.
  const terminated = last + 1 < lines.length;
  const text = `${rows.map((index) => lines[index]).join('\n')}${terminated ? '\n' : ''}`;
  const end = terminated ? byteStarts[last + 1] : docBytes;
  return { text, lineStarts: rows.map((index) => byteStarts[index]), end };
}

/**
 * Split a document into its shipped sections.
 *
 * @param {string} text - The whole root document.
 * @param {{start: string, end: string}} markers - The block markers.
 * @param {Array<Object>} [authored] - Manifest section entries; when given, each section
 *   gets the `id` of the entry its heading matches, or null.
 * @returns {{sections: Array<Object>, block: Object|null,
 *   prelude: {start: number, end: number, text: string}|null}}
 */
function segment(text, markers, authored = []) {
  const buffer = Buffer.from(text, 'utf8');
  const block = findBlock(text, markers);
  const hole = block && block.complete ? block : null;

  const lines = text.split('\n');
  const byteStarts = [0];
  for (let index = 0; index < lines.length; index += 1) {
    byteStarts.push(byteStarts[index] + Buffer.byteLength(lines[index], 'utf8') + 1);
  }
  const docBytes = buffer.length;
  // The trailing empty element a final newline produces is not a line of its own.
  const lastLine = lines.length > 0 && lines[lines.length - 1] === '' ? lines.length - 1 : lines.length;

  // The lines the block owns, markers included. They are the repository's bytes, so they
  // join no body and the first line after them starts a body of its own.
  const holeLines = hole === null ? null : {
    first: lineOf(byteStarts, hole.start),
    last: lineOf(byteStarts, Math.max(hole.start, hole.end - 1)),
  };

  const headings = [];
  for (let index = 0; index < lastLine; index += 1) {
    if (!HEADING.test(lines[index])) continue;
    if (holeLines !== null && index >= holeLines.first && index <= holeLines.last) continue;
    headings.push(index);
  }

  const sections = headings.map((lineIndex, position) => {
    const nextHeading = position + 1 < headings.length ? headings[position + 1] : lines.length;
    const body = bodyOf(lines, byteStarts, bodyRows(lines, lineIndex, nextHeading, holeLines), docBytes);
    return {
      id: null,
      start: byteStarts[lineIndex],
      end: body.end,
      level: lines[lineIndex].match(HEADING)[1].length,
      heading: lines[lineIndex],
      body: body.text,
      lineStarts: body.lineStarts,
      sha256: sha256(body.text),
    };
  });

  if (authored.length > 0) {
    for (const row of matchSections(sections, authored).matched) row.section.id = row.entry.id;
  }

  return { sections, block, prelude: preludeOf(lines, byteStarts, headings, holeLines, docBytes) };
}

/**
 * The text above the first heading, which no section covers.
 *
 * @param {string[]} lines
 * @param {number[]} byteStarts
 * @param {number[]} headings - The heading line indexes, in order.
 * @param {{first: number, last: number}|null} hole
 * @param {number} docBytes
 * @returns {{start: number, end: number, text: string}|null} Null when that text is blank.
 */
function preludeOf(lines, byteStarts, headings, hole, docBytes) {
  const limit = headings.length > 0 ? headings[0] : lines.length;
  const rows = [];
  for (let index = 0; index < limit; index += 1) {
    if (hole !== null && index >= hole.first && index <= hole.last) continue;
    rows.push(index);
  }
  const text = rows.map((index) => lines[index]).join('\n');
  if (text.trim() === '') return null;
  // The region is measured from its first line to the end of its last one, so a block that
  // somebody wrote above the template stays outside the range the report names.
  const first = rows[0];
  const last = rows[rows.length - 1];
  const end = last + 1 < lines.length ? byteStarts[last + 1] : docBytes;
  return { start: byteStarts[first], end, text };
}

/**
 * Pair each heading with the authored entry whose match prefix it carries.
 *
 * @param {Array<Object>} sections - Segmented sections, in document order.
 * @param {Array<{id: string, match: string, level: number}>} authored
 * @param {{start: number, end: number, text: string}|null} [prelude] - The text above the
 *   first heading, reported beside the unmatched headings because it is repository content
 *   no shipped entry covers either.
 * @returns {{matched: Array<{section: Object, entry: Object}>, unregistered: Array<Object>,
 *   unmatched: Array<Object>, conflicts: Array<Object>}}
 */
function matchSections(sections, authored, prelude = null) {
  const used = new Set();
  const matched = [];
  const unregistered = [];
  const conflicts = [];

  // Text above the first heading has a byte range and no heading, so a heading-shaped
  // comparison can never reach it. Naming it here is what lets a caller keep it.
  if (prelude !== null && prelude.text.trim() !== '') {
    unregistered.push({
      code: 'unmarked-prelude',
      heading: null,
      start: prelude.start,
      end: prelude.end,
      message: `the root document carries text before its first heading, at bytes ${prelude.start}-${prelude.end}, which no shipped section covers`,
    });
  }

  for (const section of sections) {
    const hits = authored.filter((entry) => section.heading.includes(entry.match));
    if (hits.length === 0) {
      unregistered.push({
        code: 'unregistered-heading',
        heading: section.heading,
        start: section.start,
        end: section.end,
        message: `the root document carries a heading no authored entry matches: ${JSON.stringify(section.heading)} at byte ${section.start}`,
      });
      continue;
    }
    if (hits.length > 1) {
      conflicts.push({
        code: 'ambiguous-match',
        heading: section.heading,
        start: section.start,
        ids: hits.map((entry) => entry.id),
        message: `the heading ${JSON.stringify(section.heading)} at byte ${section.start} matches ${hits.length} authored entries: ${hits.map((entry) => entry.id).join(', ')}`,
      });
      continue;
    }
    used.add(hits[0].id);
    matched.push({ section, entry: hits[0] });
  }

  const unmatched = authored
    .filter((entry) => !used.has(entry.id))
    .map((entry) => ({
      code: 'unmatched-entry',
      id: entry.id,
      message: `authored entry ${entry.id} matches nothing: no heading matches its prefix ${JSON.stringify(entry.match)}`,
    }));

  return { matched, unregistered, unmatched, conflicts };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. DELIVERY ANCHORS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The byte offset where one delivery anchor's clause ends.
 *
 * A section anchor runs to the next heading or divider; a line anchor is the line that
 * carries the clause. Both are measured in bytes because the delivery budget is a byte
 * count, and a runtime that cuts the document mid-clause still dropped the clause.
 *
 * A line's own offset is used when the section carries it, because a section the block
 * interrupts holds text on both sides of the hole and adding up line lengths would measure
 * the hole as content.
 *
 * @param {{start: number, end: number, body: string, lineStarts?: number[]}} section
 * @param {{scope: string, texts: string[]}} pin - The anchor pin.
 * @returns {number|null} Null when a line anchor's text is not in the section.
 */
function deliveryAnchorEnd(section, pin) {
  if (pin.scope !== 'line') return section.end;
  const offsets = section.lineStarts || null;
  const lines = section.body.split('\n');
  let byte = section.start;
  for (let index = 0; index < lines.length; index += 1) {
    const at = offsets !== null && offsets[index] !== undefined ? offsets[index] : byte;
    const next = at + Buffer.byteLength(lines[index], 'utf8') + 1;
    if (lines[index].includes(pin.texts[0])) return next;
    byte = next;
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. CLASSIFICATION
// ─────────────────────────────────────────────────────────────────────────────

function trimmedLines(body) {
  const lines = new Set();
  for (const raw of body.split('\n')) {
    const line = raw.trim();
    if (line !== '' && line !== '---') lines.add(line);
  }
  return lines;
}

function overlap(a, b) {
  if (a.size === 0 && b.size === 0) return 1;
  let shared = 0;
  for (const line of a) if (b.has(line)) shared += 1;
  return shared / (a.size + b.size - shared);
}

/**
 * Say what a section body is, relative to the bodies the manifest knows.
 *
 * @param {string} body
 * @param {{current: Array<{id: string, sha256: string, body: string}>,
 *   history: Array<{sha256: string, body: string}>}} known
 * @returns {{state: 'current'|'stale-known'|'edited'|'unknown-base', base: string|null}}
 */
function classifyBody(body, known) {
  const hash = sha256(body);
  if (known.current.some((entry) => entry.sha256 === hash)) return { state: 'current', base: hash };
  if (known.history.some((entry) => entry.sha256 === hash)) return { state: 'stale-known', base: hash };

  const lines = trimmedLines(body);
  let best = null;
  for (const candidate of [...known.current, ...known.history]) {
    const score = overlap(lines, trimmedLines(candidate.body));
    // A tie is broken by hash order so the same input always names the same base.
    if (best === null || score > best.score || (score === best.score && candidate.sha256 < best.sha256)) {
      best = { score, sha256: candidate.sha256 };
    }
  }

  if (best !== null && best.score >= SIMILARITY_FLOOR) return { state: 'edited', base: best.sha256 };
  return { state: 'unknown-base', base: null };
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  classifyBody,
  deliveryAnchorEnd,
  findBlock,
  matchSections,
  segment,
  sha256,
};

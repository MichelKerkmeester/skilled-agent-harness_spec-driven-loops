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
// is a byte count and the emoji headings are multi-byte. The repository-owned block is
// cut out before segmentation: its heading looks exactly like a shipped one, and a
// consumer's own content is not part of the shipped surface.
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
 * Split a document into its shipped sections.
 *
 * @param {string} text - The whole root document.
 * @param {{start: string, end: string}} markers - The block markers.
 * @param {Array<Object>} [authored] - Manifest section entries; when given, each section
 *   gets the `id` of the entry its heading matches, or null.
 * @returns {{sections: Array<Object>, block: Object|null}}
 */
function segment(text, markers, authored = []) {
  const block = findBlock(text, markers);
  const shippedEnd = block && block.complete ? block.start : Buffer.byteLength(text, 'utf8');
  const shipped = Buffer.from(text, 'utf8').subarray(0, shippedEnd).toString('utf8');

  const lines = shipped.split('\n');
  const charStarts = [0];
  const byteStarts = [0];
  for (let index = 0; index < lines.length; index += 1) {
    charStarts.push(charStarts[index] + lines[index].length + 1);
    byteStarts.push(byteStarts[index] + Buffer.byteLength(lines[index], 'utf8') + 1);
  }
  const docChars = shipped.length;
  const docBytes = Buffer.byteLength(shipped, 'utf8');

  // The trailing empty element a final newline produces is not a line of its own.
  const lastLine = lines.length > 0 && lines[lines.length - 1] === '' ? lines.length - 1 : lines.length;
  const headings = [];
  for (let index = 0; index < lastLine; index += 1) {
    if (HEADING.test(lines[index])) headings.push(index);
  }

  const sections = headings.map((lineIndex, position) => {
    const nextHeading = position + 1 < headings.length ? headings[position + 1] : null;
    const endChar = nextHeading === null ? docChars : charStarts[nextHeading];
    const endByte = nextHeading === null ? docBytes : byteStarts[nextHeading];
    const body = shipped.slice(charStarts[lineIndex], endChar);
    return {
      id: null,
      start: byteStarts[lineIndex],
      end: endByte,
      level: lines[lineIndex].match(HEADING)[1].length,
      heading: lines[lineIndex],
      body,
      sha256: sha256(body),
    };
  });

  if (authored.length > 0) {
    for (const row of matchSections(sections, authored).matched) row.section.id = row.entry.id;
  }

  return { sections, block };
}

/**
 * Pair each heading with the authored entry whose match prefix it carries.
 *
 * @param {Array<Object>} sections - Segmented sections, in document order.
 * @param {Array<{id: string, match: string, level: number}>} authored
 * @returns {{matched: Array<{section: Object, entry: Object}>, unregistered: Array<Object>,
 *   unmatched: Array<Object>, conflicts: Array<Object>}}
 */
function matchSections(sections, authored) {
  const used = new Set();
  const matched = [];
  const unregistered = [];
  const conflicts = [];

  for (const section of sections) {
    const hits = authored.filter((entry) => section.heading.includes(entry.match));
    if (hits.length === 0) {
      unregistered.push({
        code: 'unregistered-heading',
        heading: section.heading,
        start: section.start,
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
 * @param {{start: number, end: number, body: string}} section - The anchor's section.
 * @param {{scope: string, texts: string[]}} pin - The anchor pin.
 * @returns {number|null} Null when a line anchor's text is not in the section.
 */
function deliveryAnchorEnd(section, pin) {
  if (pin.scope !== 'line') return section.end;
  let byte = section.start;
  for (const line of section.body.split('\n')) {
    const next = byte + Buffer.byteLength(line, 'utf8') + 1;
    if (line.includes(pin.texts[0])) return next;
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

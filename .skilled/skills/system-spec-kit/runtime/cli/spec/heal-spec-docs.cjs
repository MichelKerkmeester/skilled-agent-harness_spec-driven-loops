#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// COMPONENT: Spec Document Healer
// ───────────────────────────────────────────────────────────────
// Restores scaffold values that a spec document was supposed to carry and
// lost, and only where the correct value can be derived from evidence rather
// than guessed.
//
// The line this tool will not cross: it never authors content. A missing
// trigger phrase is refilled only from the seeder's deterministic derivation of
// the packet slug, and a template-source header is written only when the
// document's own anchors already match that template's anchor set. Both are
// recoveries of a known value, not assertions about work someone did.
// Anything it cannot verify is reported and left alone.
//
// Reconstructing a missing document and aligning a summary's status with
// spec.md stay reported and are never automated, because both change what a
// document asserts.
//
// Usage:
//   heal-spec-docs.cjs [--roots <dir>] [--folder <packet>] [--apply]
//   heal-spec-docs.cjs --anchor-repair [--roots <dir>] [--folder <packet>] [--apply]
//   heal-spec-docs.cjs --lane-modes [--roots <dir>] [--folder <packet>] [--apply]
//
// Dry run by default: prints what it would heal and what it refuses, writes
// nothing. The dry run doubles as the census.
// ───────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

'use strict';

const fs = require('node:fs');
const crypto = require('node:crypto');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
// Node loads an ES module from CommonJS synchronously, so the seeder can stay
// the single source of the phrases create.sh and the cleanup tool also write.
const { seededPhrases } = require('./template-phrase-cleanup.mjs');
// The template contract is the renderer's own account of what a document of a
// level carries; loading it keeps the stamp inside what the render can prove.
const { loadTemplateContractForDocument, normalizeHeaderText, normalizeLevel, parseAnchoredSections } = require('../utils/template-structure.js');

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

// Mirrors SPEC_FOLDER_RE in backfill-graph-metadata.ts and PACKET_NAME_RE in
// repair-derived.cjs. A fourth copy is a cost; disagreeing with the writer
// about what a packet is costs more, and that has already happened once.
const PACKET_NAME_RE = /^\d{3}(?:[-_].+)?$/;
// Archived and future trees (z_archive, z_future, z-future) hold finished
// work and scratch trees hold working state a packet clears or rotates: the
// walk skips them, so their documents keep what they say. An archived
// packet's current location is a derived field, repaired by repair-derived
// and migrate-generated-json, not this healer. Its only document change is
// the marker-only un-nesting of the questions anchor
// (unnestQuestionsAnchors), applied by upgrade-legacy's repairArchived under
// --include-archive; it moves marker lines, never prose. Trigger-phrase
// refill, template-source header, duplicate-anchor repair and every other
// mode stay off archived documents. An explicit --folder bypasses this skip,
// so a caller that passes one, such as upgrade-legacy's per-packet healing,
// must not pass an archived packet.
const SKIP_DIRS = new Set(['scratch', 'memory', 'node_modules', '.git', 'z_archive', 'z_future', 'z-future']);

// The seeder derives each phrase from the packet's own folder name, so
// refilling from it is a recovery of a known value rather than wording this
// tool would invent. Only document classes with a deterministic seed qualify.
const SEEDED_KINDS = {
  'plan.md': 'plan',
  'tasks.md': 'tasks',
  'implementation-summary.md': 'implementationSummary',
};

// A scaffold continuity value is proven by two things together: the signature
// the validator reports, and the template that ships the exact value.
const TEMPLATES_DIR = path.resolve(__dirname, '../../../templates');
const CONTINUITY_SIGNATURE_RE = {
  recent_action: /^Initiali[sz]e(?:d)? /,
  next_safe_action: /^Replace /,
};

// The values a healed continuity pair carries. An archived packet says so,
// because its next safe action is nothing by construction.
const CONTINUITY_REPLACEMENTS = {
  recent_action: 'No continuity update was recorded',
  next_safe_action: 'None recorded',
  archived_next_safe_action: 'None, the packet is archived',
};

// The level a packet records: the machine marker first, then the metadata-table
// row, then the frontmatter `level:` key. The anchors a document should carry
// differ per level, so a document cannot be named without one.
const LEVEL_MARKER_RE = /<!--\s*SPECKIT_LEVEL:\s*(3\+|[123]|phase|review|research)\s*-->/;
const LEVEL_TABLE_RE = /^\|\s*(?:\*\*Level\*\*|Level)\s*\|\s*(3\+|[123]|phase|review|research)\s*\|/m;
// Quoted values are deliberately not matched here, because the validator reads
// them as an invalid declaration rather than as a level.
const LEVEL_FRONTMATTER_RE = /^level:\s*(3\+|[123]|phase|review|research)\s*$/m;
// Any of these forms already states a level in the document, value ignored:
// an authored declaration, valid or not, is not this tool's to overwrite.
const LEVEL_DECLARATION_RES = [
  /<!--\s*SPECKIT_LEVEL:/,
  /^\s*-\s*\*\*Level\*\*\s*:/m,
  /^\|\s*(?:\*\*Level\*\*|Level)\s*\|/m,
  /^level:/m,
  // The validator's anchored inline fallback (`Level: 3`, `Level 3`). The
  // value has to lead with a level token or a digit, so prose that merely
  // opens with "Level" cannot pass for a declaration.
  /^[Ll]evel[: ]+(?:[0-9]|phase|review|research)/m,
];
// The marker read without validating its value, so a malformed declaration is
// reported rather than silently mistaken for no declaration at all.
const LEVEL_MARKER_VALUE_RE = /<!--\s*SPECKIT_LEVEL:\s*([^>]*?)\s*-->/g;

// A template renders per level: whole sections, and sometimes the template-
// source marker itself, sit inside `<!-- IF level... -->` gates. The gate
// grammar here mirrors evaluateTemplateGate, and the line walk mirrors
// renderManifestTemplate, both in template-structure.js, so the marker read
// is the marker the level actually renders.
const VALID_LEVELS = new Set(['1', '2', '3', '3+', 'phase', 'review', 'research']);
const GATE_OPEN_RE = /^\s*<!--\s*IF\s+(.+?)\s*-->\s*$/;
const GATE_CLOSE_RE = /^\s*<!--\s*\/IF\s*-->\s*$/;
const FENCE_RE = /^\s*(?:`{3}|~~~)/;
const TEMPLATE_SOURCE_RE = /<!--\s*SPECKIT_TEMPLATE_SOURCE:\s*([^>]*?)\s*-->/;

const HEADER_RE = /<!--\s*SPECKIT_TEMPLATE_SOURCE:/;
// The closing delimiter is a bare rule line: trailing spaces or tabs are allowed,
// and any other text after the dashes means the line is not the delimiter.
const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?=\r?\n|$)/;
const ANCHOR_LINE_RE = /^\s*<!--\s*(\/?)ANCHOR:([a-z0-9-]+)\s*-->\s*$/;
const ANCHOR_NAME_RE = /(<!--\s*\/?ANCHOR:)[a-z0-9-]+(\s*-->)/;
// Only the section-level OPEN QUESTIONS heading counts: the template renders it
// as an H2, and a deeper "Open Questions" subheading is content inside the
// section. Counting the deeper subheading refuses an anchor that is already flat.
const OPEN_QUESTIONS_RE = /^\s*##\s+(?:\d+(?:\.\d+)*[.)]?\s+)?OPEN QUESTIONS\b/i;
const HEADING_LINE_RE = /^##\s+(.+)$/;
const RULE_LINE_RE = /^\s*---\s*$/;

// Link extraction mirrors SPEC_DOC_INTEGRITY's awk pass, so "broken" here is
// exactly the set the validator reports: a `.md` target the document's own
// directory, its packet folder and the repository root all fail to resolve.
const INLINE_LINK_RE = /\[[^\]]+\]\(<?[^)>]+\.md[^)>]*>?\)/g;
const REFERENCE_DEFINITION_RE = /^\s*\[[^\]]+\]\s*:\s*[^\s>]+\.md(?:[#?][^\s]*)?/;

// One walk per root, shared across documents and runs, so a corpus pass does
// not rescan the tree once per link. Archived folders stay searchable, because
// a moved link usually points into one. Scratch and memory folders stay out:
// they hold working state a packet clears or rotates, so a link repointed into
// one would dangle the moment that state is gone.
const SKIP_INDEX_DIRS = new Set(['node_modules', '.git', '.worktrees', 'scratch', 'memory']);
const MARKDOWN_INDEX_CACHE = new Map();

// Order is contract: each mode reads the text the one before it returned, so
// a mode that resolves what an earlier repair produced can only be appended.
const LANE_MODES = [
  { name: 'anchor-wrap', run: anchorWrap },
  { name: 'link-repoint', run: linkRepoint },
  { name: 'continuity-placeholders', run: continuityPlaceholders },
  { name: 'level-from-spec', run: levelFromSpec },
  // Last on purpose: the stamp needs the anchors to match the level's render
  // exactly, and anchor-wrap can complete that match by wrapping a section
  // that had lost its pair.
  { name: 'header-add', run: headerAdd },
];

// The documents a packet carries, in the order a reader meets them.
const LANE_DOCUMENTS = ['spec.md', 'plan.md', 'tasks.md', 'implementation-summary.md'];

// ───────────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────────

/**
 * The anchors a document carries as structure. A marker shown inside a fenced
 * example or an inline code span is prose about the format, not one of the
 * document's own anchors, so it cannot stand as evidence for a render.
 */
function anchorsOf(text) {
  const found = new Set();
  const lines = splitLinesPreserveEndings(text);
  const fenced = fencedLines(lines);
  for (let index = 0; index < lines.length; index += 1) {
    if (fenced[index]) continue;
    const body = blankCodeSpans(lineBody(lines[index]));
    for (const m of body.matchAll(/<!--\s*ANCHOR:([a-z0-9-]+)\s*-->/g)) found.add(m[1]);
  }
  return found;
}

/** The level a packet records in its spec.md, or null when it records none. */
function declaredLevel(packetDir, specText) {
  let text = specText;
  if (text === null) {
    const specFile = path.join(packetDir, 'spec.md');
    if (!fs.existsSync(specFile)) return null;
    text = fs.readFileSync(specFile, 'utf8');
  }
  const marker = text.match(LEVEL_MARKER_RE);
  if (marker) return marker[1];
  const row = text.match(LEVEL_TABLE_RE);
  if (row) return row[1];
  const fm = frontmatterOf(text);
  const yaml = fm === null ? null : fm.match(LEVEL_FRONTMATTER_RE);
  return yaml ? yaml[1] : null;
}

/** True when a document already states a level in any form the validator reads. */
function declaresAnyLevel(text) {
  return LEVEL_DECLARATION_RES.some((pattern) => pattern.test(text));
}

/** True when a template's `<!-- IF ... -->` gate is active for a level. */
function gateActive(expression, level) {
  return expression
    .split(/\s+OR\s+/i)
    .some((orTerm) => orTerm.split(/\s+AND\s+/i).every((andTerm) => {
      const term = andTerm.trim();
      const negated = /^NOT\s+/i.test(term);
      const atom = term.replace(/^NOT\s+/i, '');
      const match = /^level:([A-Za-z0-9+,_-]+)$/u.exec(atom);
      if (!match) return false;
      const values = match[1].split(',').map((value) => value.trim()).filter(Boolean);
      if (values.some((value) => !VALID_LEVELS.has(value))) return false;
      const active = values.includes(level);
      return negated ? !active : active;
    }));
}

/** The lines a template renders for a level: fenced lines and inactive gates dropped. */
function activeTemplateLines(templatePath, level) {
  const lines = [];
  if (!templatePath || !fs.existsSync(templatePath)) return lines;
  const gates = [];
  const gatesActive = () => gates.every((gate) => gate.parentActive && gate.conditionActive);
  let inFence = false;
  for (const line of fs.readFileSync(templatePath, 'utf8').split(/\r?\n/)) {
    if (FENCE_RE.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (!inFence) {
      const open = line.match(GATE_OPEN_RE);
      if (open) {
        gates.push({ parentActive: gatesActive(), conditionActive: gateActive(open[1], level) });
        continue;
      }
      if (GATE_CLOSE_RE.test(line)) {
        gates.pop();
        continue;
      }
    }
    if (inFence || !gatesActive()) continue;
    lines.push(line);
  }
  return lines;
}

/** The template-source marker a template renders for a level, or null. */
function renderedTemplateSource(templatePath, level) {
  for (const line of activeTemplateLines(templatePath, level)) {
    const marker = line.match(TEMPLATE_SOURCE_RE);
    if (marker) return marker[1];
  }
  return null;
}

/**
 * Map each rendered template heading to the anchor that wraps it, keyed by the
 * heading's normalized text. An id maps only when the first non-blank line
 * after its opener is a heading; a heading two ids claim is dropped, because a
 * wrap there would choose between them by nothing better than line order.
 */
function templateHeadingAnchors(templatePath, level) {
  const byHeading = new Map();
  const ambiguous = new Set();
  let pending = null;
  for (const line of activeTemplateLines(templatePath, level)) {
    const marker = line.match(ANCHOR_LINE_RE);
    if (marker) {
      pending = marker[1] === '/' ? null : marker[2];
      continue;
    }
    if (line.trim() === '') continue;
    if (pending === null) continue;
    const heading = line.match(HEADING_LINE_RE);
    if (heading) {
      const key = normalizeHeaderText(heading[1]);
      if (byHeading.has(key) && byHeading.get(key) !== pending) ambiguous.add(key);
      else byHeading.set(key, pending);
    }
    pending = null;
  }
  for (const key of ambiguous) byHeading.delete(key);
  return byHeading;
}

/**
 * The template-source marker a document's own anchors prove, or a refusal
 * reason. The document must carry exactly the anchors its level renders: one
 * extra or missing anchor means the render cannot honestly be claimed.
 */
function provenMarker(out, name, file) {
  const level = declaredLevel(path.dirname(file), name === 'spec.md' ? out : null);
  if (level === null) {
    return { refusal: `${name}: no level is recorded in spec.md, so no rendered template can be proven` };
  }

  let normalized;
  let contract;
  try {
    normalized = normalizeLevel(level);
    contract = loadTemplateContractForDocument(normalized, name, file);
  } catch {
    return { refusal: `${name}: the Level ${level} template contract could not be resolved, so it cannot be named` };
  }
  if (!contract.supported) {
    return { refusal: `${name}: Level ${level} renders no template for this document, so it cannot be named` };
  }

  const rendered = new Set([...(contract.requiredAnchors || []), ...(contract.optionalAnchors || [])]);
  const have = anchorsOf(out);
  const extra = [...have].filter((anchor) => !rendered.has(anchor));
  const missing = [...rendered].filter((anchor) => !have.has(anchor));

  const marker = renderedTemplateSource(contract.templatePath, normalized);
  if (marker === null) {
    return { refusal: `${name}: the Level ${level} template renders no SPECKIT_TEMPLATE_SOURCE marker, so it cannot be named` };
  }
  if (extra.length > 0) {
    return { refusal: `${name}: carries ${extra.join(', ')} beyond the anchors rendered for Level ${level}, so it cannot be called ${marker}` };
  }
  if (missing.length > 0) {
    return { refusal: `${name}: does not carry ${missing.join(', ')}, so it cannot be called ${marker}` };
  }
  return { marker };
}

/** The frontmatter block's raw text, or null when the document has none. */
function frontmatterOf(text) {
  const m = text.match(FRONTMATTER_RE);
  return m ? m[1] : null;
}

function splitLinesPreserveEndings(text) {
  return text.match(/[^\n]*\n|[^\n]+$/g) || [];
}

function lineBody(line) {
  return line.replace(/\r?\n$/, '');
}

// Any leading whitespace opens and closes a fence, because a fence inside a list
// item sits deeper than three spaces.
function fencedLines(lines) {
  let fence = null;
  return lines.map((line) => {
    const body = lineBody(line);
    if (fence) {
      const close = body.match(/^[ \t]*(`+|~+)[ \t]*$/);
      if (close && close[1][0] === fence.character && close[1].length >= fence.length) {
        fence = null;
      }
      return true;
    }

    const open = body.match(/^[ \t]*(`{3,}|~{3,})(.*)$/);
    if (!open) return false;
    fence = { character: open[1][0], length: open[1].length };
    return true;
  });
}

// Fenced examples are prose, so marker lookalikes inside them cannot affect pairing.
function parseAnchorPairs(text) {
  const lines = splitLinesPreserveEndings(text);
  const fenced = fencedLines(lines);
  const stacks = new Map();
  const markers = new Map();
  const pairs = [];
  const unmatched = [];

  for (let index = 0; index < lines.length; index += 1) {
    if (fenced[index]) continue;
    const match = lineBody(lines[index]).match(ANCHOR_LINE_RE);
    if (!match) continue;

    const marker = { anchor: match[2], isClose: match[1] === '/' };
    markers.set(index, marker);
    const stack = stacks.get(marker.anchor) || [];
    if (!marker.isClose) {
      stack.push(index);
      stacks.set(marker.anchor, stack);
      continue;
    }

    if (stack.length === 0) {
      unmatched.push({ anchor: marker.anchor, index, kind: 'closing' });
      continue;
    }

    pairs.push({ anchor: marker.anchor, open: stack.pop(), close: index });
  }

  for (const [anchor, stack] of stacks) {
    for (const index of stack) unmatched.push({ anchor, index, kind: 'opening' });
  }

  pairs.sort((left, right) => left.open - right.open);
  unmatched.sort((left, right) => left.index - right.index);
  return { lines, fenced, markers, pairs, unmatched };
}

/**
 * Move the questions opener directly above its heading without changing prose.
 *
 * @param {string} text - Markdown document content.
 * @returns {{text: string, changed: boolean, actions: string[], refusals: string[]}}
 */
function unnestQuestionsAnchors(text) {
  const parsed = parseAnchorPairs(text);
  const questions = parsed.pairs.filter((pair) => pair.anchor === 'questions');
  const unmatched = parsed.unmatched.filter((marker) => marker.anchor === 'questions');
  if (questions.length === 0 && unmatched.length === 0) {
    return { text, changed: false, actions: [], refusals: [] };
  }
  if (questions.length !== 1 || unmatched.length > 0) {
    return {
      text,
      changed: false,
      actions: [],
      refusals: ['questions anchors are ambiguous; left unchanged'],
    };
  }

  const pair = questions[0];
  const headings = [];
  for (let index = pair.open + 1; index < pair.close; index += 1) {
    if (!parsed.fenced[index] && OPEN_QUESTIONS_RE.test(lineBody(parsed.lines[index]))) {
      headings.push(index);
    }
  }
  if (headings.length !== 1) {
    return {
      text,
      changed: false,
      actions: [],
      refusals: ['questions anchor does not contain exactly one OPEN QUESTIONS heading; left unchanged'],
    };
  }

  const heading = headings[0];
  if (pair.open === heading - 1) {
    return { text, changed: false, actions: [], refusals: [] };
  }

  const lines = [...parsed.lines];
  const opener = lines.splice(pair.open, 1)[0];
  lines.splice(heading - 1, 0, opener);
  const updated = lines.join('');

  // The heading can already sit inside a second wrapper, such as the old
  // open-questions anchor or a numbered questions-2. The moved opener would
  // then overlap that wrapper, and the section scan, which consumes each pair
  // whole, would skip past the questions opener and lose the section. That
  // layout needs a hand decision, so the move is refused before it happens.
  const reparsed = parseAnchorPairs(updated);
  const moved = reparsed.pairs.filter((candidate) => candidate.anchor === 'questions');
  const overlapping = moved.length === 1
    ? reparsed.pairs.filter((candidate) => candidate.anchor !== 'questions' && pairsOverlap(moved[0], candidate))
    : [];
  const findable = parseAnchoredSections(updated).some((section) => section.id === 'questions');
  if (!findable || moved.length !== 1 || overlapping.length > 0) {
    const wrappers = [...new Set(overlapping.map((candidate) => candidate.anchor))].sort();
    const reason = wrappers.length > 0
      ? `moving the questions opener would overlap ${wrappers.join(', ')}`
      : 'moving the questions opener would leave the questions section unreadable';
    return { text, changed: false, actions: [], refusals: [`${reason}; left unchanged`] };
  }

  return {
    text: updated,
    changed: updated !== text,
    actions: [`moved questions opener from line ${pair.open + 1} to directly above OPEN QUESTIONS`],
    refusals: [],
  };
}

function pairsOverlap(left, right) {
  return left.open < right.close && left.close > right.open;
}

function pairIsGlued(pair, markers) {
  return [pair.open - 1, pair.open + 1, pair.close - 1, pair.close + 1]
    .some((index) => index !== pair.open && index !== pair.close && markers.has(index));
}

function repairDuplicateAnchors(text) {
  const parsed = parseAnchorPairs(text);
  if (parsed.unmatched.length > 0) {
    return {
      text,
      actions: [],
      refusals: parsed.unmatched.map((marker) =>
        `unmatched ${marker.kind} anchor ${marker.anchor} at line ${marker.index + 1}; document left unchanged`,
      ),
      blocked: true,
    };
  }

  const byAnchor = new Map();
  for (const pair of parsed.pairs) {
    const list = byAnchor.get(pair.anchor) || [];
    list.push(pair);
    byAnchor.set(pair.anchor, list);
  }

  const usedNames = new Set(byAnchor.keys());
  const removeLines = new Set();
  const renameLines = new Map();
  const actions = [];
  const refusals = [];

  for (const [anchor, pairs] of byAnchor) {
    if (pairs.length < 2) continue;
    for (let duplicateIndex = 1; duplicateIndex < pairs.length; duplicateIndex += 1) {
      const pair = pairs[duplicateIndex];
      const overlaps = parsed.pairs.some((other) => other !== pair && pairsOverlap(pair, other));
      const glued = pairIsGlued(pair, parsed.markers);

      if (glued && overlaps) {
        removeLines.add(pair.open);
        removeLines.add(pair.close);
        actions.push(`removed glued overlapping duplicate pair ${anchor} at line ${pair.open + 1}`);
        continue;
      }

      if (overlaps) {
        refusals.push(`overlapping duplicate pair ${anchor} at line ${pair.open + 1} is ambiguous; left unchanged`);
        continue;
      }

      const suffix = `${anchor}-${duplicateIndex + 1}`;
      if (usedNames.has(suffix)) {
        refusals.push(`collision: ${anchor} at line ${pair.open + 1} cannot be renamed to ${suffix}; left unchanged`);
        continue;
      }

      usedNames.add(suffix);
      renameLines.set(pair.open, suffix);
      renameLines.set(pair.close, suffix);
      actions.push(`renamed isolated duplicate pair ${anchor} to ${suffix} at line ${pair.open + 1}`);
    }
  }

  const lines = parsed.lines.flatMap((line, index) => {
    if (removeLines.has(index)) return [];
    const replacement = renameLines.get(index);
    if (!replacement) return [line];
    return [line.replace(ANCHOR_NAME_RE, `$1${replacement}$2`)];
  });
  return { text: lines.join(''), actions, refusals, blocked: false };
}

/**
 * Repair duplicate anchor pairs and the nested questions layout in one document.
 *
 * @param {string} text - Markdown document content.
 * @returns {{text: string, changed: boolean, actions: string[], refusals: string[]}}
 */
function repairAnchors(text) {
  const duplicates = repairDuplicateAnchors(text);
  if (duplicates.blocked) {
    return {
      text,
      changed: false,
      actions: [],
      refusals: duplicates.refusals,
    };
  }

  const questions = unnestQuestionsAnchors(duplicates.text);
  const updated = questions.text;
  const actions = [...duplicates.actions, ...questions.actions];
  return {
    text: updated,
    changed: updated !== text,
    actions,
    refusals: [...duplicates.refusals, ...questions.refusals],
  };
}

/**
 * Atomically replace an existing file without exposing partial contents.
 *
 * @param {string} file - Existing file to replace.
 * @param {string} text - New UTF-8 content.
 * @returns {void}
 */
function writeFileAtomic(file, text) {
  const directory = path.dirname(file);
  const mode = fs.statSync(file).mode & 0o777;
  let temporary = null;
  let descriptor = null;

  try {
    const candidate = path.join(
      directory,
      `.${path.basename(file)}.${process.pid}.${crypto.randomBytes(6).toString('hex')}.tmp`,
    );
    descriptor = fs.openSync(candidate, 'wx', mode);
    temporary = candidate;
    fs.writeFileSync(descriptor, text, 'utf8');
    // openSync applies the process umask, so restore the existing file's bits.
    fs.fchmodSync(descriptor, mode);
    fs.fsyncSync(descriptor);
    fs.closeSync(descriptor);
    descriptor = null;
    fs.renameSync(temporary, file);
    temporary = null;
  } finally {
    if (descriptor !== null) {
      try { fs.closeSync(descriptor); } catch { /* The original write error is more useful. */ }
    }
    if (temporary !== null) {
      try { fs.unlinkSync(temporary); } catch { /* The original write error is more useful. */ }
    }
  }
}

// A symbolic link is refused rather than followed: a write through it changes a
// file outside the packet, and a rename over it replaces the link itself.
const SYMLINK_REFUSAL = 'symbolic link, not followed';

/** True when the path itself is a symbolic link, judged without following it. */
function isSymbolicLink(file) {
  try { return fs.lstatSync(file).isSymbolicLink(); } catch { return false; }
}

/**
 * Repair one file and atomically replace it when apply is enabled. A symbolic
 * link is refused before it is read.
 *
 * @param {string} file - Markdown file to inspect.
 * @param {{apply?: boolean}} [options] - Whether to write a changed document.
 * @returns {{file: string, text: string|null, changed: boolean, applied: boolean, actions: string[], refusals: string[]}}
 *   `text` is null when the file is refused before it is read.
 */
function repairAnchorFile(file, options = {}) {
  if (isSymbolicLink(file)) {
    return { file, text: null, changed: false, applied: false, actions: [], refusals: [SYMLINK_REFUSAL] };
  }
  const original = fs.readFileSync(file, 'utf8');
  const result = repairAnchors(original);
  const apply = options.apply === true;
  if (apply && result.changed) writeFileAtomic(file, result.text);
  return { ...result, file, applied: apply && result.changed };
}

function runAnchorRepair(argv) {
  const apply = argv.includes('--apply');
  const targets = resolveTargets(argv);

  let inspected = 0;
  let changed = 0;
  let findings = 0;
  for (const packet of targets) {
    const file = path.join(packet, 'spec.md');
    if (!fs.existsSync(file) && !isSymbolicLink(file)) continue;
    inspected += 1;
    const result = repairAnchorFile(file, { apply });
    if (result.changed) changed += 1;
    for (const action of result.actions) {
      findings += 1;
      console.log(`${apply ? 'repaired' : 'would repair'} ${file}: ${action}`);
    }
    for (const refusal of result.refusals) {
      findings += 1;
      console.log(`left unchanged ${file}: ${refusal}`);
    }
  }

  console.log(`anchor repair: documents=${inspected} ${apply ? 'repaired' : 'repairable'}=${changed} findings=${findings}`);
}

// An empty list is written two ways in this corpus: a bare key whose block has
// no items, and an inline `[]`. Both mean the same thing and both have to match,
// because the inline form is the one the scaffold leaves behind.
function emptyFieldPattern(field) {
  return new RegExp(`^${field}:[ \\t]*(\\[\\s*\\])?[ \\t]*$`, 'm');
}

/** True when `field` is present but carries no value. A field that is absent
 *  entirely is a different problem and is deliberately not healed here. */
function fieldIsEmpty(fm, field) {
  const line = emptyFieldPattern(field);
  const at = fm.search(line);
  if (at === -1) return false;
  const matched = fm.match(line)[0];
  // The inline `[]` form is conclusive on its own line.
  if (/\[\s*\]/.test(matched)) return true;
  const next = fm.slice(at).split(/\r?\n/).slice(1).find((l) => l.trim() !== '');
  // A populated list continues with an indented "- " item.
  return !next || !/^\s+-\s/.test(next);
}

// ───────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ───────────────────────────────────────────────────────────────────

function healDoc(file) {
  const name = path.basename(file);
  const text = fs.readFileSync(file, 'utf8');
  const actions = [];
  const refusals = [];
  let out = text;

  const fm = frontmatterOf(out);

  // ───────────────────────────────────────────────────────────────────
  // REFILL AN EMPTY TRIGGER_PHRASES LIST FROM THE SLUG SEEDER
  // ───────────────────────────────────────────────────────────────────
  // The template phrases are graded template-default, a negative class, so
  // refilling from them writes exactly what the judge rejects. The seeder
  // derives each phrase from the packet's own folder name instead, which is
  // evidence the document already carries.
  const kind = SEEDED_KINDS[name];
  if (kind && fm !== null) {
    if (fieldIsEmpty(fm, 'trigger_phrases')) {
      const block = `trigger_phrases:\n${seededPhrases(file, kind).map((v) => `  - "${v}"`).join('\n')}`;
      out = out.replace(emptyFieldPattern('trigger_phrases'), block);
      actions.push('seeded trigger_phrases from the packet slug');
    }
  } else if (kind && fm === null) {
    refusals.push(`${name}: no frontmatter block at all, so there is nothing to restore into`);
  }

  // ───────────────────────────────────────────────────────────────────
  // NAME THE TEMPLATE ONLY WHEN THE ANCHORS PROVE IT
  // ───────────────────────────────────────────────────────────────────
  const header = headerAdd(out, file);
  out = header.text;
  actions.push(...header.actions);
  refusals.push(...header.refusals);

  return { changed: out !== text, text: out, actions, refusals };
}

function discover(root) {
  const packets = [];
  const stack = [root];
  while (stack.length) {
    const dir = stack.pop();
    let entries;
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { continue; }
    let isPacket = false;
    for (const e of entries) {
      if (e.isDirectory()) {
        if (!SKIP_DIRS.has(e.name) && !e.name.startsWith('.')) stack.push(path.join(dir, e.name));
      } else if (e.name === 'spec.md') isPacket = true;
    }
    if (isPacket && PACKET_NAME_RE.test(path.basename(dir))) packets.push(dir);
  }
  return packets.sort();
}

/**
 * The packet folders one CLI run covers. --folder names a single packet and
 * takes precedence; otherwise every packet under --roots is discovered, and the
 * specs root is relative to the working directory when --roots is absent.
 *
 * @param {string[]} argv - Command-line arguments after the script path.
 * @returns {string[]} The named packet, or the discovered packets sorted.
 */
function resolveTargets(argv) {
  const folderAt = argv.indexOf('--folder');
  const rootsAt = argv.indexOf('--roots');
  return folderAt !== -1
    ? [argv[folderAt + 1]]
    : discover(rootsAt !== -1 ? argv[rootsAt + 1] : 'specs');
}

// The specs roots a --folder is checked against when --roots is absent: the
// working-directory specs tree and the .opencode/specs alias of it.
const DEFAULT_SPEC_ROOTS = ['specs', path.join('.opencode', 'specs')];

function isWithinPath(candidate, base) {
  const rel = path.relative(base, candidate);
  return rel === '' || (rel !== '..' && !rel.startsWith(`..${path.sep}`) && !path.isAbsolute(rel));
}

// Identity is what a path names on disk. Two spellings of one directory, through
// a link, a case variant or a relative path, share it; two different directories
// never do. Root membership is judged by it, because path text cannot tell them apart.
function directoryIdentity(file) {
  try {
    const stat = fs.statSync(file);
    return `${stat.dev}:${stat.ino}`;
  } catch {
    return null;
  }
}

/** The directory holding a .git entry, found by walking up from `from`, or null outside a repository. */
function repositoryTop(from) {
  for (let dir = from; ; dir = path.dirname(dir)) {
    if (fs.existsSync(path.join(dir, '.git'))) return dir;
    if (path.dirname(dir) === dir) return null;
  }
}

/** Each prefix of a resolved path, from its first component down to the path itself. */
function pathPrefixes(target) {
  const { root: fsRoot } = path.parse(target);
  const prefixes = [];
  let prefix = fsRoot;
  for (const part of path.relative(fsRoot, target).split(path.sep).filter(Boolean)) {
    prefix = path.join(prefix, part);
    prefixes.push(prefix);
  }
  return prefixes;
}

/** The real location of a path, or null when it does not exist. */
function realLocation(file) {
  try {
    return fs.realpathSync(file);
  } catch {
    return null;
  }
}

/**
 * The real location of each existing prefix of a path. A prefix that does not
 * exist holds nothing to find, so it is skipped.
 */
function physicalLocations(target) {
  return pathPrefixes(target).map(realLocation).filter((real) => real !== null);
}

/**
 * True when a real location is one of the roots or lies under one. Each ancestor
 * is checked by identity, so case variants and aliases cannot slip past a text
 * comparison.
 */
function reachesRoot(real, roots) {
  if (real === null) return false;
  for (let dir = real; ; dir = path.dirname(dir)) {
    if (roots.has(directoryIdentity(dir))) return true;
    if (path.dirname(dir) === dir) return false;
  }
}

/**
 * The identities a --folder is judged against. A --roots value is the only root
 * when given. Without one, the default roots that exist under the working
 * directory count, and so does each repository the folder can be reached
 * through: the working directory's, the folder's own location's, and each real
 * location along the folder's path. A repository contributes its top and its
 * specs directory, so a spelling that reaches the specs tree by another route is
 * caught.
 *
 * @param {string} target - The resolved --folder path.
 * @param {string|undefined} rootArg - The --roots argument, when one was given.
 * @returns {Set<string>} Identities of the root directories that exist.
 */
function rootIdentities(target, rootArg) {
  if (rootArg !== undefined) {
    return new Set([directoryIdentity(path.resolve(rootArg))].filter((id) => id !== null));
  }
  const candidates = DEFAULT_SPEC_ROOTS.map((root) => path.resolve(root));
  const starts = [process.cwd(), path.dirname(target), ...physicalLocations(target)];
  for (const start of starts) {
    const top = repositoryTop(start);
    if (top !== null) candidates.push(top, path.join(top, 'specs'));
  }
  return new Set(candidates.map(directoryIdentity).filter((id) => id !== null));
}

/**
 * Why a named --folder must not be written into, or null when it may be.
 *
 * The folder itself must not be a link. The anchor is the first prefix of the path
 * whose real location lies under a root, judged by identity up the real location's
 * ancestors. The anchor and every component below it must not be a link, because a
 * write through one lands in a packet the root does not own. Only the links above
 * the anchor are not judged, so system links such as those under /var and /tmp keep
 * working. Without --roots, the roots are the
 * default roots under the working directory and each repository the path
 * physically passes through; a folder that no root reaches is allowed, because the
 * operator approved that default, which leaves a link on a path that no repository
 * holds unjudged.
 *
 * With --roots, the anchor is the root's own prefix, and the folder must also
 * resolve inside that root's real path.
 *
 * @param {string} folder - The --folder argument.
 * @param {string|undefined} rootArg - The --roots argument, when one was given.
 * @returns {string|null} The reason in parentheses, or null when the folder is allowed.
 */
function folderRefusal(folder, rootArg) {
  const target = path.resolve(folder);
  if (isSymbolicLink(target)) return 'the folder itself is a link';

  const roots = rootIdentities(target, rootArg);
  const prefixes = pathPrefixes(target);
  // With --roots, the anchor is the root's own prefix, as it always was. Otherwise
  // it is the first prefix whose real location lies under a root.
  const anchorAt = prefixes.findIndex((prefix) => (rootArg !== undefined
    ? roots.has(directoryIdentity(prefix))
    : reachesRoot(realLocation(prefix), roots)));
  if (anchorAt === -1) {
    return rootArg !== undefined ? 'it resolves outside the specs root' : null;
  }

  const anchor = prefixes[anchorAt];
  if (isSymbolicLink(anchor)) return `${path.basename(anchor)} is a link on the path to the folder`;
  for (const prefix of prefixes.slice(anchorAt + 1)) {
    if (isSymbolicLink(prefix)) return `${path.relative(anchor, prefix)} is a link on the path to the folder`;
  }

  if (rootArg !== undefined && fs.existsSync(target)) {
    const real = fs.realpathSync(target);
    if (!isWithinPath(real, fs.realpathSync(path.resolve(rootArg)))) {
      return `it resolves to ${real}, outside the specs root`;
    }
  }
  return null;
}

// The usage text from the header comment, printed with a rejected argument.
const USAGE = [
  'Usage:',
  '  heal-spec-docs.cjs [--roots <dir>] [--folder <packet>] [--apply]',
  '  heal-spec-docs.cjs --anchor-repair [--roots <dir>] [--folder <packet>] [--apply]',
  '  heal-spec-docs.cjs --lane-modes [--roots <dir>] [--folder <packet>] [--apply]',
].join('\n');

// A value flag with no value, or one followed by another flag, names nothing. It
// is a usage error on stderr, not a folder or root to judge, so nothing is read or
// written.
function rejectMissingFlagValue(argv) {
  for (const flag of ['--folder', '--roots']) {
    const at = argv.indexOf(flag);
    if (at === -1) continue;
    const value = argv[at + 1];
    if (value !== undefined && !value.startsWith('--')) continue;
    console.error(`${flag} requires a value\n${USAGE}`);
    process.exitCode = 2;
    return true;
  }
  return false;
}

// A refused --folder is named on stdout, like the other refusals, and writes
// nothing. The exit status marks the whole run as refused, since no document
// was reached at all.
function refuseFolderArgument(argv) {
  const folderAt = argv.indexOf('--folder');
  if (folderAt === -1) return false;
  const folder = argv[folderAt + 1];
  const rootsAt = argv.indexOf('--roots');
  const reason = folderRefusal(folder, rootsAt !== -1 ? argv[rootsAt + 1] : undefined);
  if (reason === null) return false;
  console.log(`refused ${folder}: ${SYMLINK_REFUSAL} (${reason})`);
  process.exitCode = 2;
  return true;
}

// ───────────────────────────────────────────────────────────────────
// 5. LANE MODES
// ───────────────────────────────────────────────────────────────────

/**
 * Wrap headings the active template anchors, and only those.
 *
 * A heading the template maps to an id is scaffold that lost its pair, so
 * restoring the pair recovers a known value. A heading the template does not
 * map is authored prose and stays untouched. When the document cannot prove
 * the template applies, or cannot say which id belongs where, nothing is
 * edited: the same evidence rule every repair here follows. A mode records a
 * refusal only for the defect it repairs and cannot derive the fix for; a
 * document without the defect yields nothing.
 *
 * @param {string} text - Markdown document content.
 * @param {string} file - Path of the document, for its level and template.
 * @returns {{text: string, changed: boolean, actions: string[], refusals: string[]}}
 */
function anchorWrap(text, file) {
  const name = path.basename(file);
  const parsed = parseAnchorPairs(text);
  const candidates = [];
  for (let index = 0; index < parsed.lines.length; index += 1) {
    if (parsed.fenced[index]) continue;
    if (!HEADING_LINE_RE.test(lineBody(parsed.lines[index]))) continue;
    if (parsed.pairs.some((pair) => pair.open <= index && index <= pair.close)) continue;
    candidates.push(index);
  }
  const unchanged = { text, changed: false, actions: [], refusals: [] };
  if (candidates.length === 0) return unchanged;

  if (parsed.markers.size === 0) {
    return {
      ...unchanged,
      refusals: ['no ANCHOR marker anywhere, so the anchored template is not proven; left unchanged'],
    };
  }
  if (parsed.unmatched.length > 0) {
    return {
      ...unchanged,
      refusals: parsed.unmatched.map((marker) =>
        `unmatched ${marker.kind} anchor ${marker.anchor} at line ${marker.index + 1}; document left unchanged`),
    };
  }

  const level = declaredLevel(path.dirname(file), name === 'spec.md' ? text : null);
  if (level === null) {
    return { ...unchanged, refusals: [`${name}: no level is recorded in spec.md, so no rendered template can be proven`] };
  }

  let normalized;
  let contract;
  try {
    normalized = normalizeLevel(level);
    contract = loadTemplateContractForDocument(normalized, name, file);
  } catch {
    return { ...unchanged, refusals: [`${name}: the Level ${level} template contract could not be resolved; left unchanged`] };
  }
  if (!contract.supported) {
    return { ...unchanged, refusals: [`${name}: Level ${level} renders no template for this document; left unchanged`] };
  }

  const mapped = templateHeadingAnchors(contract.templatePath, normalized);
  const present = new Set();
  for (const marker of parsed.markers.values()) present.add(marker.anchor);
  const counts = new Map();
  for (const index of candidates) {
    const key = normalizeHeaderText(lineBody(parsed.lines[index]).match(HEADING_LINE_RE)[1]);
    counts.set(key, (counts.get(key) || 0) + 1);
  }

  const insertions = new Map();
  const queue = (index, side, marker) => {
    const slot = insertions.get(index) || { close: [], open: [] };
    slot[side].push(marker);
    insertions.set(index, slot);
  };
  const endingAt = (index) => {
    for (let cursor = index; cursor >= 0; cursor -= 1) {
      const ending = parsed.lines[cursor].match(/\r?\n$/);
      if (ending) return ending[0];
    }
    return '\n';
  };

  const actions = [];
  const refusals = [];
  // Later headings first, so an earlier close still lands before a later
  // opener when the two share an insertion point.
  for (let position = candidates.length - 1; position >= 0; position -= 1) {
    const index = candidates[position];
    const heading = lineBody(parsed.lines[index]).match(HEADING_LINE_RE)[1];
    const key = normalizeHeaderText(heading);
    const id = mapped.get(key);
    if (id === undefined) continue;
    if ((counts.get(key) || 0) > 1) {
      refusals.push(`heading "${heading}" appears more than once; left unchanged`);
      continue;
    }
    if (present.has(id)) {
      refusals.push(`anchor ${id} is already in the document; left unchanged`);
      continue;
    }

    queue(index, 'open', `<!-- ANCHOR:${id} -->${endingAt(index)}`);
    let last = index;
    for (let cursor = index + 1; cursor < parsed.lines.length; cursor += 1) {
      const body = lineBody(parsed.lines[cursor]);
      // A fenced line is content, never a boundary: a heading lookalike inside
      // a fence is prose, and a block that ends the section contributes its
      // closing fence, so the closer lands after the fence instead of before it.
      const boundary = !parsed.fenced[cursor]
        && (HEADING_LINE_RE.test(body) || ANCHOR_LINE_RE.test(body) || RULE_LINE_RE.test(body));
      if (boundary) break;
      if (body.trim() !== '') last = cursor;
    }
    const closer = `<!-- /ANCHOR:${id} -->`;
    const ending = endingAt(last);
    // The closer takes the ending of the line it follows as its own
    // terminator. Only the file's final line can lack one, and when it does
    // the ending has to precede the closer: appended after it, the closer
    // would be glued onto the prose, editing the line and adding a final
    // newline the document never had.
    queue(last + 1, 'close', /\r?\n$/.test(parsed.lines[last]) ? `${closer}${ending}` : `${ending}${closer}`);
    present.add(id);
    actions.push(`wrapped "${heading}" with anchor ${id}`);
  }

  if (actions.length === 0) return { ...unchanged, refusals };

  const lines = [];
  for (let index = 0; index <= parsed.lines.length; index += 1) {
    const slot = insertions.get(index);
    if (slot) lines.push(...slot.close, ...slot.open);
    if (index < parsed.lines.length) lines.push(parsed.lines[index]);
  }
  const updated = lines.join('');
  return { text: updated, changed: updated !== text, actions, refusals };
}

// The rule blanks inline code spans before parsing; blanking with spaces of
// the same width keeps every later link offset true to the original line.
function blankCodeSpans(line) {
  let blanked = line;
  for (const span of inlineCodeSpans(line)) {
    blanked = blanked.slice(0, span.start) + ' '.repeat(span.end - span.start) + blanked.slice(span.end);
  }
  return blanked;
}

/**
 * Offsets of every inline code span on a line. A backtick run opens a span and
 * the next run of exactly the same length closes it; a run with no partner is
 * literal text, as CommonMark reads it.
 */
function inlineCodeSpans(line) {
  const runs = [...line.matchAll(/`+/g)];
  const spans = [];
  for (let open = 0; open < runs.length; open += 1) {
    const length = runs[open][0].length;
    const close = runs.findIndex((run, at) => at > open && run[0].length === length);
    if (close === -1) continue;
    spans.push({ start: runs[open].index, end: runs[close].index + length });
    open = close;
  }
  return spans;
}

/** The reference definition target on a line, or null when it has none. */
function referenceDefinitionTarget(line) {
  const match = line.match(REFERENCE_DEFINITION_RE);
  if (!match) return null;
  const target = match[0]
    .replace(/^\s*\[[^\]]+\]\s*:\s*/, '')
    .replace(/[#?].*$/, '');
  return target === '' ? null : target;
}

/** Every inline link target on a line, with the offset its path starts at. */
function inlineLinkTargets(line) {
  const found = [];
  for (const match of line.matchAll(INLINE_LINK_RE)) {
    const prefix = match[0].match(/^\[[^\]]+\]\(<?/);
    if (!prefix) continue;
    let target = match[0].slice(prefix[0].length, -1);
    if (target.endsWith('>')) target = target.slice(0, -1);
    const fragmentAt = target.search(/[#?]/);
    if (fragmentAt !== -1) target = target.slice(0, fragmentAt);
    if (target === '' || /^(?:https?:|mailto:)/.test(target)) continue;
    found.push({ target, start: match.index + prefix[0].length });
  }
  return found;
}

function isRegularFile(candidate) {
  try { return fs.statSync(candidate).isFile(); } catch { return false; }
}

/** True when a target names a regular file under the same probes the rule uses. */
function markdownTargetResolves(target, documentDir, repoRoot) {
  if (target.startsWith('/')) return isRegularFile(target);
  return isRegularFile(path.join(documentDir, target)) || isRegularFile(path.join(repoRoot, target));
}

/** The last one or two path segments a broken target offers as its key. */
function linkCandidateKey(target) {
  const segments = target.split('/').filter((segment) => segment !== '' && segment !== '.' && segment !== '..');
  if (segments.length === 0) return null;
  return segments.length === 1 ? segments[0] : segments.slice(-2).join('/');
}

/** Repository root for a lane run: an explicit override, then git, then cwd. */
function laneRepoRoot(file, options) {
  if (typeof options.repoRoot === 'string' && options.repoRoot !== '') return options.repoRoot;
  const git = spawnSync('git', ['-C', path.dirname(file), 'rev-parse', '--show-toplevel'], { encoding: 'utf8' });
  const top = git.status === 0 && typeof git.stdout === 'string' ? git.stdout.trim() : '';
  return top === '' ? process.cwd() : top;
}

/** Every .md file under the root, indexed by basename and last two segments. */
function markdownIndex(repoRoot) {
  const cached = MARKDOWN_INDEX_CACHE.get(repoRoot);
  if (cached) return cached;
  const byKey = new Map();
  const stack = [repoRoot];
  while (stack.length > 0) {
    const dir = stack.pop();
    let entries;
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { continue; }
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!SKIP_INDEX_DIRS.has(entry.name)) stack.push(full);
        continue;
      }
      if (!entry.isFile() || !entry.name.endsWith('.md')) continue;
      const segments = path.relative(repoRoot, full).split(path.sep);
      for (const key of new Set([segments[segments.length - 1], segments.slice(-2).join('/')])) {
        const candidates = byKey.get(key) || [];
        candidates.push(full);
        byKey.set(key, candidates);
      }
    }
  }
  MARKDOWN_INDEX_CACHE.set(repoRoot, byKey);
  return byKey;
}

/**
 * Repoint broken inline markdown links to the one indexed file that ends with
 * the link's own trailing path segments.
 *
 * A link counts as broken only under the same extraction and resolution the
 * SPEC_DOC_INTEGRITY rule performs, so this mode never touches a link the
 * validator would not flag. Zero or several matching files, and a broken
 * reference definition, are refused with a reason. The mode never unlinks:
 * removing a link changes what the document points at, and a missing target is
 * a finding to record, not a fact to derive. The fragment, the angle brackets
 * and the label survive; only the path between them changes.
 *
 * @param {string} text - Markdown document content.
 * @param {string} file - Path of the document, for its directory and the root fallback.
 * @param {{repoRoot?: string}} [options] - Repository root override.
 * @returns {{text: string, changed: boolean, actions: string[], refusals: string[]}}
 */
function linkRepoint(text, file, options = {}) {
  const documentDir = path.dirname(file);
  const repoRoot = laneRepoRoot(file, options);
  const index = markdownIndex(repoRoot);
  const lines = splitLinesPreserveEndings(text);
  const fenced = fencedLines(lines);
  const out = [...lines];
  const actions = [];
  const refusals = [];

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    if (fenced[lineIndex]) continue;
    const body = lineBody(lines[lineIndex]);
    const blanked = blankCodeSpans(body);

    const reference = referenceDefinitionTarget(blanked);
    if (reference !== null && !markdownTargetResolves(reference, documentDir, repoRoot)) {
      refusals.push(`reference definition target ${reference} does not resolve and is left unrewritten`);
    }

    const replacements = [];
    for (const link of inlineLinkTargets(blanked)) {
      if (markdownTargetResolves(link.target, documentDir, repoRoot)) continue;
      const key = linkCandidateKey(link.target);
      if (key === null) {
        refusals.push(`broken target ${link.target} carries no path segment to match`);
        continue;
      }
      const candidates = index.get(key) || [];
      if (candidates.length === 0) {
        refusals.push(`no file ends with ${key}, so the target cannot be derived`);
        continue;
      }
      if (candidates.length > 1) {
        refusals.push(`${candidates.length} files end with ${key}, so the target cannot be derived`);
        continue;
      }
      const repointed = path.relative(documentDir, candidates[0]).split(path.sep).join('/');
      replacements.push({ start: link.start, end: link.start + link.target.length, text: repointed });
      actions.push(`repointed ${link.target} to ${repointed}`);
    }

    if (replacements.length === 0) continue;
    let updated = body;
    replacements.sort((left, right) => right.start - left.start);
    for (const replacement of replacements) {
      updated = updated.slice(0, replacement.start) + replacement.text + updated.slice(replacement.end);
    }
    out[lineIndex] = updated + lines[lineIndex].slice(body.length);
  }

  const updatedText = out.join('');
  return {
    text: updatedText,
    changed: updatedText !== text,
    actions,
    refusals,
  };
}

// Every continuity value the shipped templates carry, collected once per
// process and keyed by field. The templates do not change under a running
// process, and a document would otherwise re-read the whole tree per run.
let TEMPLATE_CONTINUITY_VALUES = null;

/** The `recent_action` / `next_safe_action` values the shipped templates carry. */
function templateContinuityValues() {
  if (TEMPLATE_CONTINUITY_VALUES !== null) return TEMPLATE_CONTINUITY_VALUES;
  const values = { recent_action: new Set(), next_safe_action: new Set() };
  const stack = [TEMPLATES_DIR];
  while (stack.length > 0) {
    const dir = stack.pop();
    let entries;
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { continue; }
    for (const entry of entries) {
      if (entry.isDirectory()) {
        stack.push(path.join(dir, entry.name));
        continue;
      }
      if (!entry.isFile()) continue;
      let text;
      try { text = fs.readFileSync(path.join(dir, entry.name), 'utf8'); } catch { continue; }
      for (const line of text.split(/\r?\n/)) {
        const match = line.match(/^[ \t]*(recent_action|next_safe_action):[ \t]*(.+?)[ \t]*$/);
        if (match) values[match[1]].add(unquoteScalar(match[2]));
      }
    }
  }
  TEMPLATE_CONTINUITY_VALUES = values;
  return values;
}

/** Strip one pair of matching YAML quotes so a template value and a document value compare by text. */
function unquoteScalar(raw) {
  const quoted = raw.length >= 2
    && ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'")));
  return quoted ? raw.slice(1, -1) : raw;
}

/**
 * A scaffold placeholder is proven twice over: the validator's signature
 * pattern matches AND a template ships that exact value. The second half is
 * what keeps an authored `next_safe_action: "Replace the parser"` — which the
 * signature pattern alone cannot tell from the scaffold — out of the rewrite.
 * An empty value is a placeholder whatever the templates ship.
 */
function isContinuityPlaceholder(field, raw) {
  if (raw === '' || raw === '""' || raw === "''") return true;
  const value = unquoteScalar(raw);
  if (!CONTINUITY_SIGNATURE_RE[field].test(value)) return false;
  return templateContinuityValues()[field].has(value);
}

/**
 * The `recent_action` / `next_safe_action` lines inside the frontmatter's
 * `_memory` > `continuity` block, keyed by field. A document whose frontmatter
 * carries no such block has no continuity to judge, and returns null.
 */
function continuityFieldLines(text) {
  const lines = splitLinesPreserveEndings(text);
  if (!FRONTMATTER_RE.test(text)) return null;
  let memoryIndent = null;
  let continuityIndent = null;
  const fields = new Map();
  for (let index = 1; index < lines.length; index += 1) {
    const body = lineBody(lines[index]);
    if (RULE_LINE_RE.test(body)) break;
    if (body.trim() === '') continue;
    const indent = body.match(/^[ \t]*/)[0].length;
    if (memoryIndent === null) {
      if (/^[ \t]*_memory:[ \t]*$/.test(body)) memoryIndent = indent;
      continue;
    }
    if (indent <= memoryIndent) { memoryIndent = null; continue; }
    if (continuityIndent === null) {
      if (/^[ \t]*continuity:[ \t]*$/.test(body)) continuityIndent = indent;
      continue;
    }
    if (indent <= continuityIndent) break;
    const field = body.match(/^[ \t]*(recent_action|next_safe_action):[ \t]*(.*?)[ \t]*$/);
    if (field && !fields.has(field[1])) {
      fields.set(field[1], {
        index,
        indent: body.match(/^[ \t]*/)[0],
        raw: field[2],
        ending: lines[index].slice(body.length),
        // A deeper-indented line below the key is the key's block value. Replacing
        // the key line would orphan that value and leave the frontmatter unparseable.
        continued: nextContentIndent(lines, index) > indent,
      });
    }
  }
  return continuityIndent === null ? null : fields;
}

/** Indent width of the first non-blank line after `index`, or -1 when none follows. */
function nextContentIndent(lines, index) {
  for (let next = index + 1; next < lines.length; next += 1) {
    const body = lineBody(lines[next]);
    if (body.trim() !== '') return body.match(/^[ \t]*/)[0].length;
  }
  return -1;
}

// A document is archived by its place below the `specs` root, never by a
// segment above it: a checkout kept under a directory named z_archive would
// otherwise mark every live packet archived. The first `specs` segment names
// the tree, because a research packet can hold copies of whole specs trees
// inside itself. A path with no `specs` segment is below no tree, so it
// proves no archive placement.
function isArchivedDocument(file) {
  const segments = path.resolve(file).split(path.sep);
  const specsAt = segments.indexOf('specs');
  if (specsAt === -1) return false;
  return segments.slice(specsAt + 1).some((segment) => segment === 'z_archive' || segment === 'z_future');
}

/**
 * Replace the scaffold continuity pair a document was rendered with, and only
 * when both fields are still scaffold or empty. Fixed values stand in, because
 * a real action cannot be derived from the document and guessing one would put
 * words in an author's mouth. A pair where only one side is scaffold, or where
 * a side is missing, is an author mid-edit; the document is refused whole
 * rather than completed.
 *
 * @param {string} text - Markdown document content.
 * @param {string} file - Path of the document, for its archive placement.
 * @returns {{text: string, changed: boolean, actions: string[], refusals: string[]}}
 */
function continuityPlaceholders(text, file) {
  const unchanged = { text, changed: false, actions: [], refusals: [] };
  const fields = continuityFieldLines(text);
  if (fields === null) return unchanged;

  const recent = fields.has('recent_action') && isContinuityPlaceholder('recent_action', fields.get('recent_action').raw);
  const next = fields.has('next_safe_action') && isContinuityPlaceholder('next_safe_action', fields.get('next_safe_action').raw);
  if (!recent && !next) return unchanged;
  if (!recent || !next) {
    return {
      ...unchanged,
      refusals: ['continuity block is half scaffolded, so it is an edit in progress; left unchanged'],
    };
  }
  if (fields.get('recent_action').continued || fields.get('next_safe_action').continued) {
    return {
      ...unchanged,
      refusals: ['continuity value continues on the next line; left unchanged'],
    };
  }

  const archived = isArchivedDocument(file);
  const replacements = {
    recent_action: CONTINUITY_REPLACEMENTS.recent_action,
    next_safe_action: archived
      ? CONTINUITY_REPLACEMENTS.archived_next_safe_action
      : CONTINUITY_REPLACEMENTS.next_safe_action,
  };
  const lines = splitLinesPreserveEndings(text);
  const actions = [];
  for (const name of ['recent_action', 'next_safe_action']) {
    const entry = fields.get(name);
    lines[entry.index] = `${entry.indent}${name}: "${replacements[name]}"${entry.ending}`;
    actions.push(`set ${name} to "${replacements[name]}"`);
  }
  const updated = lines.join('');
  return { text: updated, changed: updated !== text, actions, refusals: [] };
}

/** Every SPECKIT_LEVEL marker in spec.md outside a fence, values left unvalidated. */
function specLevelMarkers(text) {
  const values = [];
  const lines = splitLinesPreserveEndings(text);
  const fenced = fencedLines(lines);
  for (let index = 0; index < lines.length; index += 1) {
    if (fenced[index]) continue;
    for (const match of lineBody(lines[index]).matchAll(LEVEL_MARKER_VALUE_RE)) values.push(match[1]);
  }
  return values;
}

/**
 * Give a document the level its packet's spec.md declares.
 *
 * spec.md is the only source, and its machine marker is the only evidence:
 * every document reads its level from there, while a Level table row alone
 * is presentation the validator does not act on. A malformed value, or two
 * markers that disagree, is refused because choosing between them would put
 * a level on the document that no one stated. A document that already
 * declares a level yields nothing, so an authored declaration is never
 * overwritten.
 *
 * @param {string} text - Markdown document content.
 * @param {string} file - Path of the document, for its packet folder.
 * @returns {{text: string, changed: boolean, actions: string[], refusals: string[]}}
 */
function levelFromSpec(text, file) {
  const unchanged = { text, changed: false, actions: [], refusals: [] };
  if (path.basename(file) === 'spec.md') return unchanged;
  if (declaresAnyLevel(text)) return unchanged;

  let specText;
  try {
    specText = fs.readFileSync(path.join(path.dirname(file), 'spec.md'), 'utf8');
  } catch {
    return { ...unchanged, refusals: ['spec.md is missing or unreadable, so no level can be derived; left unchanged'] };
  }

  const values = specLevelMarkers(specText);
  if (values.length === 0) {
    return { ...unchanged, refusals: ['spec.md carries no SPECKIT_LEVEL marker, so no level can be derived; left unchanged'] };
  }
  const malformed = values.find((value) => !VALID_LEVELS.has(value));
  if (malformed !== undefined) {
    return { ...unchanged, refusals: [`spec.md carries the malformed SPECKIT_LEVEL value "${malformed}", so no level can be derived; left unchanged`] };
  }
  const disagreement = values.find((value) => value !== values[0]);
  if (disagreement !== undefined) {
    return {
      ...unchanged,
      refusals: [`spec.md carries disagreeing SPECKIT_LEVEL values "${values[0]}" and "${disagreement}", so no level can be derived; left unchanged`],
    };
  }

  const frontmatter = text.match(FRONTMATTER_RE);
  if (frontmatter === null) {
    return { ...unchanged, refusals: ['no frontmatter block to write the level into; left unchanged'] };
  }

  // The delimiter's dashes are the last ones in the match, since only spaces or tabs can follow them.
  const closing = frontmatter.index + frontmatter[0].lastIndexOf('---');
  const before = text.slice(0, closing);
  const ending = before.endsWith('\r\n') ? '\r\n' : '\n';
  const updated = `${before}level: ${values[0]}${ending}${text.slice(closing)}`;
  return {
    text: updated,
    changed: updated !== text,
    actions: [`added level: ${values[0]} to the frontmatter`],
    refusals: [],
  };
}

/**
 * Stamp the template-source header a document's own anchors prove, and only
 * then. A document that already carries the header is left alone, and one whose
 * anchors do not exactly match the level's render is refused rather than
 * guessed at.
 *
 * @param {string} text - Markdown document content.
 * @param {string} file - Path of the document, for its packet level.
 * @returns {{text: string, changed: boolean, actions: string[], refusals: string[]}}
 */
function headerAdd(text, file) {
  const name = path.basename(file);
  const unchanged = { text, changed: false, actions: [], refusals: [] };
  if (HEADER_RE.test(text)) return unchanged;

  const proven = provenMarker(text, name, file);
  if (proven.refusal) return { ...unchanged, refusals: [proven.refusal] };

  const fmEnd = text.match(FRONTMATTER_RE);
  if (!fmEnd) {
    return { ...unchanged, refusals: [`${name}: its anchors prove ${proven.marker} but there is no frontmatter to place the header after`] };
  }

  const marker = `<!-- SPECKIT_TEMPLATE_SOURCE: ${proven.marker} -->`;
  const idx = fmEnd.index + fmEnd[0].length;
  // The stamp follows the frontmatter with the ending that frontmatter
  // already uses, so a CRLF document does not gain a lone LF line.
  const ending = fmEnd[0].includes('\r\n') ? '\r\n' : '\n';
  const updated = `${text.slice(0, idx)}${ending}${marker}${text.slice(idx)}`;
  return {
    text: updated,
    changed: updated !== text,
    actions: [`named the template as ${proven.marker}, proven by its exact anchors`],
    refusals: [],
  };
}

/**
 * Run every selected lane mode over each document the packet carries, feeding
 * each mode the text the previous one returned, and write once per document
 * when apply is set. The result stays plain JSON: a caller writes the refusal
 * list into its baseline report untouched.
 *
 * @param {string} packetDir - Packet folder holding the documents.
 * @param {{apply?: boolean, modes?: string[], repoRoot?: string}} [options]
 * @returns {{packet: string, changedFiles: string[], actions: Array<{mode: string, document: string, action: string}>, refusals: Array<{mode: string, document: string, reason: string}>}}
 */
function runLaneModes(packetDir, options = {}) {
  const apply = options.apply === true;
  const selected = options.modes
    ? LANE_MODES.filter((mode) => options.modes.includes(mode.name))
    : LANE_MODES;
  const actions = [];
  const refusals = [];
  const changedFiles = [];

  for (const document of LANE_DOCUMENTS) {
    const file = path.join(packetDir, document);
    if (!fs.existsSync(file) && !isSymbolicLink(file)) continue;
    if (isSymbolicLink(file)) {
      refusals.push({ mode: 'containment', document, reason: SYMLINK_REFUSAL });
      continue;
    }
    const original = fs.readFileSync(file, 'utf8');
    let out = original;
    for (const mode of selected) {
      const result = mode.run(out, file, options);
      out = result.text;
      for (const action of result.actions) actions.push({ mode: mode.name, document, action });
      for (const reason of result.refusals) refusals.push({ mode: mode.name, document, reason });
    }
    if (out === original) continue;
    changedFiles.push(document);
    if (apply) writeFileAtomic(file, out);
  }

  return { packet: packetDir, changedFiles, actions, refusals };
}

function runLaneModesCli(argv) {
  const apply = argv.includes('--apply');
  const targets = resolveTargets(argv);

  for (const packet of targets) {
    const result = runLaneModes(packet, { apply });
    for (const entry of result.actions) {
      console.log(`${apply ? 'applied' : 'would apply'} ${entry.mode} ${path.join(packet, entry.document)}: ${entry.action}`);
    }
    for (const entry of result.refusals) {
      console.log(`refused ${entry.mode} ${path.join(packet, entry.document)}: ${entry.reason}`);
    }
  }
}

function main() {
  const argv = process.argv.slice(2);
  if (rejectMissingFlagValue(argv)) return;
  if (refuseFolderArgument(argv)) return;
  if (argv.includes('--anchor-repair')) {
    runAnchorRepair(argv);
    return;
  }
  if (argv.includes('--lane-modes')) {
    runLaneModesCli(argv);
    return;
  }

  const apply = argv.includes('--apply');
  const targets = resolveTargets(argv);

  let healedDocs = 0; let healedPackets = 0; let refusedDocs = 0;
  const refusalReasons = new Map();

  for (const pkt of targets) {
    let touched = false;
    for (const name of ['spec.md', 'plan.md', 'tasks.md', 'implementation-summary.md']) {
      const file = path.join(pkt, name);
      if (!fs.existsSync(file) && !isSymbolicLink(file)) continue;
      if (isSymbolicLink(file)) {
        refusedDocs += 1;
        console.log(`refused ${file}: ${SYMLINK_REFUSAL}`);
        continue;
      }
      const r = healDoc(file);
      for (const why of r.refusals) {
        refusedDocs += 1;
        const key = why.replace(/^[^:]+: /, '');
        refusalReasons.set(key, (refusalReasons.get(key) || 0) + 1);
      }
      if (!r.changed) continue;
      healedDocs += 1; touched = true;
      console.log(`${apply ? 'healed' : 'would heal'} ${path.join(pkt, name)}`);
      for (const a of r.actions) console.log(`    ${a}`);
      if (apply) writeFileAtomic(file, r.text);
    }
    if (touched) healedPackets += 1;
  }

  console.log('');
  console.log(`packets=${targets.length} documents ${apply ? 'healed' : 'healable'}=${healedDocs} packets touched=${healedPackets} refused=${refusedDocs}`);
  if (refusalReasons.size) {
    console.log('');
    console.log('Left alone, because the right value cannot be proven from the document:');
    for (const [why, n] of [...refusalReasons].sort((a, b) => b[1] - a[1]).slice(0, 10)) {
      console.log(`  ${String(n).padStart(5)}  ${why}`);
    }
  }
  if (!apply && healedDocs > 0) {
    console.log('');
    console.log('To apply: add --apply');
  }
}

// ───────────────────────────────────────────────────────────────────
// 6. CLI ENTRY
// ───────────────────────────────────────────────────────────────────

if (require.main === module) main();

module.exports = {
  LANE_MODES,
  anchorWrap,
  continuityPlaceholders,
  headerAdd,
  levelFromSpec,
  linkRepoint,
  repairAnchors,
  repairAnchorFile,
  runLaneModes,
  unnestQuestionsAnchors,
  writeFileAtomic,
};

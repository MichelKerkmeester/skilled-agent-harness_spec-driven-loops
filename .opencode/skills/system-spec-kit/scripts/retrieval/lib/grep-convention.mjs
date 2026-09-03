// ───────────────────────────────────────────────────────────────
// MODULE: Grep Convention Primitives
// ───────────────────────────────────────────────────────────────
// The pure, testable half of the document retrofit: variant classification,
// the body preimage, the anchor grammar, the trigger allowlist and the diff
// classifier. Nothing here touches the filesystem, so every rule below can be
// exercised against a string in a test rather than against the corpus.
//
// Two boundaries are load-bearing and are the reason this module exists at all:
//
// 1. The preimage and the diff classifier must agree, byte for byte, on which
//    lines are anchor markers. They are the two halves of one guarantee — the
//    preimage says the body did not change, the classifier says nothing but
//    frontmatter and markers appeared in the diff — so a disagreement between
//    them would open a gap that neither check can see. They call the same
//    predicate, and that predicate is fence-aware: a marker quoted inside a
//    fenced example is prose, and excluding it from the preimage would remove
//    protection from exactly the lines a convention document is made of.
// 2. Classification reads, and only reads. A document that matches no variant
//    stops the run rather than defaulting to skip, because a silent default is
//    how an unanticipated shape gets rewritten by a handler written for a
//    different one.
//
// Frontmatter keys outside the canonical five are preserved verbatim and in
// their original order. Nothing here reorders a block, strips a key or reads
// `_memory`: the only lines this module rewrites are the alias key it renames,
// the keys it creates, and the members it removes as duplicates. Scalar quoting
// is left exactly as the author wrote it.
// ───────────────────────────────────────────────────────────────

import { createHash } from 'node:crypto';

import { CATEGORY, readTriggerPhrases } from './frontmatter.mjs';
import { compareCodeUnits, MAX_PHRASE_LENGTH, normalizeTriggerText } from './normalize.mjs';

// ───────────────────────────────────────────────────────────────
// 1. CONTRACT
// ───────────────────────────────────────────────────────────────

/**
 * The frontmatter variant taxonomy. Every in-scope document resolves to exactly
 * one of these, and the eight counts sum to the manifest total.
 *
 * `valid-empty` is the conforming bucket. Its name describes the case the
 * convention singles out — a well-formed empty list is not an error — but a
 * well-formed populated list is conforming for the same reason, and the
 * taxonomy carries no other label that could hold it. Documents in this bucket
 * are sub-counted by `detail` so a report never claims a populated list was
 * empty.
 */
export const VARIANTS = Object.freeze([
  'missing',
  'malformed-or-unclosed',
  'non-yaml',
  'wrong-list-type',
  'non-string-members',
  'valid-empty',
  'duplicate',
  'oversized',
]);

/** Exception classes the retrofit inventories separately from the variants. */
export const EXCEPTION_CLASSES = Object.freeze([
  'alias-hit',
  'generic-trigger',
  'anchor-unmatched',
  'anchor-duplicate',
  'naming-exception',
]);

/** Diagnostics `category` enum: the eight variants plus the exception classes. */
export const DIAGNOSTIC_CATEGORIES = Object.freeze([
  ...VARIANTS,
  ...EXCEPTION_CLASSES,
  'preimage-mismatch',
]);

/** Diagnostics `severity` enum. */
export const SEVERITY = Object.freeze({ ERROR: 'error', WARN: 'warn' });

/**
 * Severity per diagnostic category, and the single place it is decided. A
 * document the convention cannot vouch for is an `error`: the seven
 * non-conforming variant labels, plus the preimage mismatch that fails the run
 * outright. Everything else is a `warn`, because each names something a human
 * still has to weigh rather than something the retrofit got wrong — a phrase an
 * author may have meant, an anchor pair the retrofit refuses to guess at, an
 * alias already rewritten by the time it is reported, and a name deliberately
 * left unrenamed. `valid-empty` is conforming and produces no row at all.
 */
export const CATEGORY_SEVERITY = Object.freeze({
  'alias-hit': SEVERITY.WARN,
  'anchor-duplicate': SEVERITY.WARN,
  'anchor-unmatched': SEVERITY.WARN,
  duplicate: SEVERITY.ERROR,
  'generic-trigger': SEVERITY.WARN,
  'malformed-or-unclosed': SEVERITY.ERROR,
  missing: SEVERITY.ERROR,
  'naming-exception': SEVERITY.WARN,
  'non-string-members': SEVERITY.ERROR,
  'non-yaml': SEVERITY.ERROR,
  oversized: SEVERITY.ERROR,
  'preimage-mismatch': SEVERITY.ERROR,
  'wrong-list-type': SEVERITY.ERROR,
});

/** Phrase-length ceiling; a longer phrase is `oversized` and is never truncated. */
export { MAX_PHRASE_LENGTH };

/** List-length ceiling; a longer declaration is `oversized` and is never trimmed. */
export const MAX_TRIGGER_LIST_MEMBERS = 20;

/**
 * Variants whose frontmatter the reader could not parse. An edit that moves a
 * document into this set has destroyed a declaration rather than repaired one.
 */
export const UNPARSEABLE_VARIANTS = Object.freeze(new Set([
  'malformed-or-unclosed', 'non-yaml', 'wrong-list-type', 'non-string-members',
]));

/** Canonical frontmatter keys, in the order a created block writes them. */
export const CANONICAL_KEYS = Object.freeze([
  'title',
  'description',
  'trigger_phrases',
  'importance_tier',
  'contextType',
]);

/** The one accepted alias. Read under both spellings, written under one. */
export const ALIAS_KEY = 'triggerPhrases';
export const CANONICAL_TRIGGER_KEY = 'trigger_phrases';

/** Generic workflow words rejected as trigger phrases, verbatim from the convention. */
export const GENERIC_TRIGGER_WORDS = Object.freeze(new Set([
  'session', 'context', 'memory', 'summary', 'feature', 'update', 'file', 'document', 'section',
]));

/**
 * The two phrases `ensureMinTriggerPhrases` falls back to when a document
 * yields nothing else. They are generic words too, but they are reported under
 * their own reason because naming the producer is what lets a reader tell an
 * author's word from an editor's default.
 */
export const EDITOR_FALLBACK_WORDS = Object.freeze(new Set(['session', 'context']));

/** Minimum length of a packet-folder token the editor fallback would emit. */
const MIN_FOLDER_TOKEN_LENGTH = 3;

/**
 * Function words used only by the stop-word-only negative. Kept short and
 * explicit: a long borrowed list would silently reject real domain phrases, and
 * this class only has to catch a phrase that carries no content word at all.
 */
export const STOP_WORDS = Object.freeze(new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'but', 'by', 'for', 'from', 'has', 'have',
  'how', 'in', 'into', 'is', 'it', 'its', 'of', 'on', 'or', 'that', 'the', 'then',
  'this', 'to', 'was', 'were', 'what', 'when', 'where', 'which', 'who', 'why', 'will', 'with',
]));

/**
 * Token budget for the whole-prose-sentence negative. Deliberately separate from
 * MAX_PHRASE_LENGTH: that character budget decides the `oversized` variant, and
 * folding the two together would report one defect under the other's label.
 */
export const MAX_PHRASE_TOKENS = 10;

/** Permissive marker id: what the surviving validator detects as an anchor. */
const ANCHOR_ID_PATTERN = '[A-Za-z0-9][A-Za-z0-9_-]*';

/** Whole-line opener and closer. Surrounding whitespace only, no other content. */
const WHOLE_LINE_OPEN_RE = new RegExp(`^\\s*<!--\\s*ANCHOR:(${ANCHOR_ID_PATTERN})\\s*-->\\s*$`);
const WHOLE_LINE_CLOSE_RE = new RegExp(`^\\s*<!--\\s*/ANCHOR:(${ANCHOR_ID_PATTERN})\\s*-->\\s*$`);

/** Ordinary section ids are lower-kebab; a typed id may carry an uppercase prefix. */
const LOWER_KEBAB_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const TYPED_ID_RE = /^[A-Z][A-Z0-9]*-[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Packet directory grammar: three digits, a hyphen, then lower-kebab words. */
const PACKET_DIR_RE = /^\d{3}-[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** A segment that opens with digits is claiming to be a packet directory. */
const PACKET_LIKE_RE = /^\d+[-_]/;

/** Characters a path segment may carry without being reported. */
const SAFE_SEGMENT_RE = /^[a-z0-9]+(?:[.-][a-z0-9]+)*$/;

/** Fence toggles, matched the way the surviving anchor validator matches them. */
const FENCE_RE = /^\s*(?:```|~~~)/;

// ───────────────────────────────────────────────────────────────
// 2. LINE MODEL
// ───────────────────────────────────────────────────────────────

/**
 * Splits text into lines that remember their own terminator, so reassembly is
 * byte-exact. A plain `split('\n')` would normalize CRLF and lose whether the
 * file ended with a newline, and the preimage forbids exactly that.
 *
 * @param {string} text File text.
 * @returns {Array<{ terminator: string, text: string }>} Lines in order.
 */
export function splitLines(text) {
  /** @type {Array<{ terminator: string, text: string }>} */
  const lines = [];
  let start = 0;
  for (let i = 0; i < text.length; i += 1) {
    if (text[i] !== '\n') continue;
    const hasCarriage = i > start && text[i - 1] === '\r';
    lines.push({
      terminator: hasCarriage ? '\r\n' : '\n',
      text: text.slice(start, hasCarriage ? i - 1 : i),
    });
    start = i + 1;
  }
  if (start < text.length) lines.push({ terminator: '', text: text.slice(start) });
  return lines;
}

/**
 * @param {Array<{ terminator: string, text: string }>} lines Lines to rejoin.
 * @returns {string} Original text when no line was dropped or edited.
 */
export function joinLines(lines) {
  return lines.map((line) => `${line.text}${line.terminator}`).join('');
}

// ───────────────────────────────────────────────────────────────
// 3. ANCHOR GRAMMAR
// ───────────────────────────────────────────────────────────────

/**
 * Reads one line as an anchor marker. The line must be the marker and nothing
 * else; a marker with prose beside it is not a marker under this grammar, which
 * is what keeps a mid-paragraph insertion from passing the preimage.
 *
 * @param {string} lineText One line, without its terminator.
 * @returns {{ id: string, kind: 'open' | 'close' } | null} Marker, or null.
 */
export function readAnchorMarker(lineText) {
  const open = lineText.match(WHOLE_LINE_OPEN_RE);
  if (open) return { id: open[1], kind: 'open' };
  const close = lineText.match(WHOLE_LINE_CLOSE_RE);
  if (close) return { id: close[1], kind: 'close' };
  return null;
}

/**
 * @param {string} id Marker id as written.
 * @returns {boolean} True when the id matches the documented grammar.
 */
export function isConformingAnchorId(id) {
  return LOWER_KEBAB_RE.test(id) || TYPED_ID_RE.test(id);
}

/**
 * Walks a document's lines and reports which are anchor markers, skipping
 * fenced blocks. A convention document quotes the marker grammar inside a
 * fence; reading those examples as markers would both misreport the document
 * and, worse, drop real prose out of the protected preimage region.
 *
 * @param {Array<{ terminator: string, text: string }>} lines Document lines.
 * @param {number} [firstLineNumber] One-based number of `lines[0]`.
 * @returns {{
 *   markerLineNumbers: Set<number>,
 *   markers: Array<{ conforming: boolean, id: string, kind: 'open' | 'close', line: number }>
 * }} Marker positions.
 */
export function scanAnchorMarkers(lines, firstLineNumber = 1) {
  const markers = [];
  const markerLineNumbers = new Set();
  let inFence = false;

  for (let i = 0; i < lines.length; i += 1) {
    const { text } = lines[i];
    if (FENCE_RE.test(text)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const marker = readAnchorMarker(text);
    if (!marker) continue;

    const line = firstLineNumber + i;
    markerLineNumbers.add(line);
    markers.push({ conforming: isConformingAnchorId(marker.id), id: marker.id, kind: marker.kind, line });
  }

  return { markerLineNumbers, markers };
}

/**
 * Pairs openers with closers and reports what does not pair. Nothing is
 * repaired: an id the tool guessed at would be indistinguishable, later, from
 * one an author chose.
 *
 * @param {string} text Whole document text.
 * @returns {{
 *   duplicates: Array<{ id: string, line: number }>,
 *   markers: Array<{ conforming: boolean, id: string, kind: 'open' | 'close', line: number }>,
 *   nonConformingIds: Array<{ id: string, line: number }>,
 *   unmatched: Array<{ id: string, line: number, reason: string }>
 * }} Anchor findings.
 */
export function analyzeAnchors(text) {
  const { markers } = scanAnchorMarkers(splitLines(text));

  /** @type {Array<{ id: string, line: number }>} */
  const openStack = [];
  /** @type {Array<{ id: string, line: number, reason: string }>} */
  const unmatched = [];
  /** @type {Array<{ id: string, line: number }>} */
  const duplicates = [];
  const seenIds = new Set();

  for (const marker of markers) {
    if (marker.kind === 'open') {
      if (seenIds.has(marker.id)) duplicates.push({ id: marker.id, line: marker.line });
      seenIds.add(marker.id);
      openStack.push({ id: marker.id, line: marker.line });
      continue;
    }

    const current = openStack.pop();
    if (!current) {
      unmatched.push({ id: marker.id, line: marker.line, reason: 'closing marker with no open marker' });
      continue;
    }
    if (current.id !== marker.id) {
      unmatched.push({
        id: marker.id,
        line: marker.line,
        reason: `closing marker does not match open marker '${current.id}'`,
      });
    }
  }

  for (const open of openStack) {
    unmatched.push({ id: open.id, line: open.line, reason: 'open marker with no closing marker' });
  }

  const nonConformingIds = markers
    .filter((marker) => !marker.conforming && marker.kind === 'open')
    .map((marker) => ({ id: marker.id, line: marker.line }));

  unmatched.sort((a, b) => a.line - b.line);
  return { duplicates, markers, nonConformingIds, unmatched };
}

// ───────────────────────────────────────────────────────────────
// 4. FRONTMATTER BLOCK EXTENTS
// ───────────────────────────────────────────────────────────────

/**
 * Locates the leading frontmatter block. Delimiter rules follow the strict
 * reader in frontmatter.mjs so the two never disagree about where a block
 * starts, but this returns extents rather than values, because the preimage and
 * the diff classifier need line numbers the reader does not expose.
 *
 * @param {string} text Whole document text.
 * @returns {{
 *   bodyOffset: number,
 *   closeLine: number,
 *   hasOpener: boolean,
 *   openLine: number,
 *   present: boolean
 * }} Block extents; `bodyOffset` is the offset of the first body character.
 */
export function locateFrontmatter(text) {
  const absent = { bodyOffset: 0, closeLine: 0, hasOpener: false, openLine: 0, present: false };
  if (!text) return absent;

  const start = skipLeadingTrivia(text);
  const firstLineEnd = text.indexOf('\n', start);
  if (firstLineEnd === -1) return absent;
  if (text.slice(start, firstLineEnd).replace(/\r$/, '').trim() !== '---') return absent;

  const openLine = lineNumberAt(text, start);
  const closingRegex = /^---\s*$/gm;
  closingRegex.lastIndex = firstLineEnd + 1;
  const closing = closingRegex.exec(text);
  if (!closing) return { ...absent, hasOpener: true, openLine };

  const closeEnd = text.indexOf('\n', closing.index);
  const bodyOffset = closeEnd === -1 ? text.length : closeEnd + 1;

  return {
    bodyOffset,
    closeLine: lineNumberAt(text, closing.index),
    hasOpener: true,
    openLine,
    present: true,
  };
}

/**
 * Skips whitespace and complete HTML comments ahead of an opening delimiter,
 * matching what the strict reader tolerates.
 *
 * @param {string} text File text.
 * @returns {number} Offset of the first significant character.
 */
function skipLeadingTrivia(text) {
  let index = 0;
  while (index < text.length) {
    const char = text[index];
    if (char === ' ' || char === '\t' || char === '\r' || char === '\n') {
      index += 1;
      continue;
    }
    if (text.startsWith('<!--', index)) {
      const close = text.indexOf('-->', index + 4);
      if (close === -1) break;
      index = close + 3;
      continue;
    }
    break;
  }
  return index;
}

/**
 * @param {string} text File text.
 * @param {number} offset Character offset.
 * @returns {number} One-based line number.
 */
function lineNumberAt(text, offset) {
  let line = 1;
  const limit = Math.min(offset, text.length);
  for (let i = 0; i < limit; i += 1) {
    if (text[i] === '\n') line += 1;
  }
  return line;
}

/**
 * Reads the trigger declaration as written, without normalizing, deduplicating
 * or dropping anything. The strict reader answers what the list *means*, which
 * is the wrong question for two callers: the list-length ceiling counts members
 * an author declared, and the dedupe rewrite has to put back every member it
 * keeps byte for byte.
 *
 * @param {string} text Whole document text.
 * @returns {{
 *   flow: boolean,
 *   key: string | null,
 *   keyIndex: number,
 *   members: Array<{ index: number, line: number, raw: string }>
 * }} Declaration as written; `index` is the zero-based line index, `-1` in flow style.
 */
export function declaredTriggerMembers(text) {
  const absent = { flow: false, key: null, keyIndex: -1, members: [] };
  const block = locateFrontmatter(text);
  if (!block.present) return absent;

  const lines = splitLines(text);
  const keyPattern = new RegExp(`^(${CANONICAL_TRIGGER_KEY}|${ALIAS_KEY})\\s*:(.*)$`);

  for (let i = block.openLine; i < block.closeLine - 1; i += 1) {
    const match = lines[i].text.match(keyPattern);
    if (!match) continue;

    const rest = stripTrailingComment(match[2]).trim();
    if (rest.startsWith('[') && rest.endsWith(']')) {
      const inner = rest.slice(1, -1);
      const segments = inner.trim().length === 0 ? [] : splitFlowSegments(inner);
      return {
        flow: true,
        key: match[1],
        keyIndex: i,
        members: segments.map((raw) => ({ index: -1, line: i + 1, raw })),
      };
    }
    if (rest.length > 0) return { flow: false, key: match[1], keyIndex: i, members: [] };

    const members = [];
    for (let j = i + 1; j < block.closeLine - 1; j += 1) {
      const item = lines[j].text.match(/^\s+-\s*(.*)$/);
      if (!item) break;
      members.push({ index: j, line: j + 1, raw: item[1] });
    }
    return { flow: false, key: match[1], keyIndex: i, members };
  }

  return absent;
}

/**
 * Splits a flow sequence on commas outside quotes and brackets, keeping each
 * segment's surrounding whitespace so a rewrite can put it back unchanged.
 *
 * @param {string} inner Text between the brackets.
 * @returns {string[]} Raw segments.
 */
function splitFlowSegments(inner) {
  const segments = [];
  let current = '';
  let quote = null;
  let depth = 0;

  for (const char of inner) {
    if (quote) {
      current += char;
      if (char === quote) quote = null;
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      current += char;
      continue;
    }
    if (char === '[' || char === '{') depth += 1;
    if (char === ']' || char === '}') depth -= 1;
    if (char === ',' && depth === 0) {
      segments.push(current);
      current = '';
      continue;
    }
    current += char;
  }
  segments.push(current);
  return segments;
}

/**
 * Removes a trailing YAML comment from an unquoted scalar. A `#` opens a comment
 * only at the start of the value or after whitespace.
 *
 * @param {string} value Raw scalar text.
 * @returns {string} Value without its trailing comment.
 */
function stripTrailingComment(value) {
  let quote = null;
  for (let i = 0; i < value.length; i += 1) {
    const char = value[i];
    if (quote) {
      if (char === quote) quote = null;
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }
    if (char === '#' && (i === 0 || /\s/.test(value[i - 1]))) return value.slice(0, i);
  }
  return value;
}

// ───────────────────────────────────────────────────────────────
// 5. BODY PREIMAGE
// ───────────────────────────────────────────────────────────────

/**
 * SHA-256 over the body region: everything after the closing frontmatter fence,
 * with every whole-line anchor marker removed and no other normalization.
 *
 * Marker lines are removed because the retrofit is allowed to add and repair
 * them; every other byte, including line terminators and the presence or
 * absence of a trailing newline, is inside the protected region. A document
 * with no frontmatter has the whole file as its body, which is what makes
 * inserting a block in front of it a preimage-preserving edit.
 *
 * @param {string} text Whole document text.
 * @returns {{ bodyOffset: number, digest: string, removedMarkerLines: number[] }} Preimage.
 */
export function bodyPreimage(text) {
  const block = locateFrontmatter(text);
  const bodyOffset = block.present ? block.bodyOffset : 0;
  const bodyText = text.slice(bodyOffset);
  const firstBodyLine = block.present ? block.closeLine + 1 : 1;

  const lines = splitLines(bodyText);
  const { markerLineNumbers } = scanAnchorMarkers(lines, firstBodyLine);

  const kept = [];
  const removedMarkerLines = [];
  for (let i = 0; i < lines.length; i += 1) {
    const lineNumber = firstBodyLine + i;
    if (markerLineNumbers.has(lineNumber)) {
      removedMarkerLines.push(lineNumber);
      continue;
    }
    kept.push(lines[i]);
  }

  return {
    bodyOffset,
    digest: createHash('sha256').update(joinLines(kept), 'utf8').digest('hex'),
    removedMarkerLines,
  };
}

// ───────────────────────────────────────────────────────────────
// 6. VARIANT CLASSIFICATION
// ───────────────────────────────────────────────────────────────

/**
 * Maps the strict reader's category onto a variant label. The reader answers a
 * narrower question — what does the trigger declaration say — so block-level
 * shape is decided here first and the reader is consulted only once a block is
 * known to open and close.
 */
const CATEGORY_TO_VARIANT = Object.freeze({
  [CATEGORY.ALIAS]: 'valid-empty',
  [CATEGORY.DUPLICATE_PHRASE]: 'duplicate',
  [CATEGORY.MALFORMED_FRONTMATTER]: 'malformed-or-unclosed',
  [CATEGORY.MISSING_FRONTMATTER]: 'missing',
  [CATEGORY.NON_STRING_MEMBER]: 'non-string-members',
  [CATEGORY.NON_YAML_FRONTMATTER]: 'non-yaml',
  [CATEGORY.OK]: 'valid-empty',
  [CATEGORY.OVERSIZED_PHRASE]: 'oversized',
  [CATEGORY.VALID_EMPTY_LIST]: 'valid-empty',
  [CATEGORY.WRONG_TRIGGER_LIST_TYPE]: 'wrong-list-type',
});

/**
 * Assigns exactly one variant label, or throws. A document that matches no
 * label is a fail-closed condition: the alternative is a handler written for a
 * shape this document does not have.
 *
 * @param {string} text Whole document text.
 * @returns {{
 *   alias: boolean,
 *   detail: string,
 *   line: number,
 *   phrases: Array<{ line: number, normalized: string, raw: string, truncated: boolean }>,
 *   rawKey: string | null,
 *   reason: string,
 *   variant: string
 * }} One label plus the evidence behind it.
 */
export function classifyVariant(text) {
  const block = locateFrontmatter(text);

  if (block.hasOpener && !block.present) {
    return {
      alias: false,
      detail: 'unclosed-opening-fence',
      line: block.openLine,
      phrases: [],
      rawKey: null,
      reason: 'opening frontmatter delimiter has no closing delimiter',
      variant: 'malformed-or-unclosed',
    };
  }

  if (!block.present) {
    return {
      alias: false,
      detail: 'no-frontmatter-block',
      line: 1,
      phrases: [],
      rawKey: null,
      reason: 'document has no frontmatter block',
      variant: 'missing',
    };
  }

  const reading = readTriggerPhrases(text);
  const variant = CATEGORY_TO_VARIANT[reading.category];
  if (variant === undefined) {
    throw new Error(`unclassifiable frontmatter category: ${reading.category}`);
  }

  // The list-length ceiling is only answerable once the block parses, and it
  // outranks `duplicate`: a list too long to be author-curated is skipped whole
  // rather than quietly shortened by a dedupe pass.
  if (variant === 'valid-empty' || variant === 'duplicate' || variant === 'oversized') {
    const declared = declaredTriggerMembers(text);
    if (declared.members.length > MAX_TRIGGER_LIST_MEMBERS) {
      return {
        alias: reading.alias,
        detail: 'oversized-list',
        line: declared.members[MAX_TRIGGER_LIST_MEMBERS].line,
        phrases: reading.phrases,
        rawKey: reading.rawKey,
        reason: `trigger list declares ${declared.members.length} members, above the ${MAX_TRIGGER_LIST_MEMBERS}-member ceiling`,
        variant: 'oversized',
      };
    }
  }

  let detail = reading.category;
  if (variant === 'missing') detail = 'no-trigger-key';
  if (variant === 'oversized') detail = 'oversized-phrase';
  if (variant === 'valid-empty') {
    detail = reading.phrases.length === 0 ? 'empty-list' : 'populated-list';
  }

  return {
    alias: reading.alias,
    detail,
    line: reading.line,
    phrases: reading.phrases,
    rawKey: reading.rawKey,
    reason: reading.reason,
    variant,
  };
}

// ───────────────────────────────────────────────────────────────
// 7. TRIGGER ALLOWLIST
// ───────────────────────────────────────────────────────────────

/**
 * Judges one phrase against the convention's negative classes. The judgement is
 * reported, and it gates what may be written; it never rewrites what an author
 * already declared, because deleting an author's phrase is a content decision
 * the convention does not authorize.
 *
 * A phrase's provenance is not recoverable from the finished document, so the
 * two fallback shapes the frontmatter editor actually produces are matched by
 * shape and named in the reason rather than asserted as fact: the terminal
 * `session` and `context` pair, and a single token echoing the packet folder.
 * The folder-token rule will sometimes name a phrase an author chose, which is
 * why the row is a warning that reports the resemblance rather than an error
 * that claims to know where the phrase came from.
 *
 * @param {string} phrase Raw phrase text.
 * @param {{ folderTokens?: ReadonlyArray<string> }} [context] Packet-folder tokens.
 * @returns {{ negativeClass: string, reason: string } | null} Rejection, or null when admissible.
 */
export function judgeTriggerPhrase(phrase, context = {}) {
  const normalized = normalizeTriggerText(phrase);
  if (!normalized) {
    return { negativeClass: 'generic-workflow-word', reason: 'phrase normalizes to nothing' };
  }

  if (EDITOR_FALLBACK_WORDS.has(normalized)) {
    return {
      negativeClass: 'editor-fallback',
      reason: `"${normalized}" is a terminal fallback phrase of the frontmatter editor's ensureMinTriggerPhrases, not an author choice`,
    };
  }

  if (GENERIC_TRIGGER_WORDS.has(normalized)) {
    return { negativeClass: 'generic-workflow-word', reason: `generic workflow word "${normalized}"` };
  }

  const tokens = normalized.split(' ').filter(Boolean);
  if (tokens.length > 0 && tokens.every((token) => STOP_WORDS.has(token))) {
    return { negativeClass: 'stop-word-only', reason: 'every token is a stop word' };
  }

  if (/[.!?](\s|$)/.test(phrase.trim()) || tokens.length > MAX_PHRASE_TOKENS) {
    return {
      negativeClass: 'prose-sentence',
      reason: tokens.length > MAX_PHRASE_TOKENS
        ? `phrase carries ${tokens.length} tokens, above the ${MAX_PHRASE_TOKENS}-token budget`
        : 'phrase carries sentence punctuation',
    };
  }

  const folderTokens = context.folderTokens ?? [];
  if (tokens.length === 1 && folderTokens.includes(tokens[0])) {
    return {
      negativeClass: 'folder-token-fallback',
      reason: `single token "${tokens[0]}" repeats a token of its own packet folder, the shape the frontmatter editor's folder-token fallback produces`,
    };
  }

  return null;
}

/**
 * Splits a phrase list into what may be written and what must be reported.
 *
 * @param {ReadonlyArray<{ line?: number, raw: string }>} phrases Declared phrases.
 * @param {{ folderTokens?: ReadonlyArray<string> }} [context] Packet-folder tokens.
 * @returns {{
 *   accepted: Array<{ line: number, raw: string }>,
 *   rejected: Array<{ line: number, negativeClass: string, raw: string, reason: string }>
 * }} Partitioned phrases.
 */
export function filterTriggerPhrases(phrases, context = {}) {
  const accepted = [];
  const rejected = [];

  for (const phrase of phrases) {
    const line = phrase.line ?? 0;
    const verdict = judgeTriggerPhrase(phrase.raw, context);
    if (verdict) {
      rejected.push({ line, negativeClass: verdict.negativeClass, raw: phrase.raw, reason: verdict.reason });
      continue;
    }
    accepted.push({ line, raw: phrase.raw });
  }

  return { accepted, rejected };
}

/**
 * Tokens of the packet directory a document sits in, built the way the editor
 * fallback builds them: the folder name without its numeric prefix, normalized,
 * split, and filtered to tokens long enough for the fallback to have kept.
 *
 * @param {string} relativePath Repo-relative document path.
 * @returns {string[]} Candidate fallback tokens.
 */
export function packetFolderTokens(relativePath) {
  const segments = relativePath.split('/');
  const folder = segments.length >= 2 ? segments[segments.length - 2] : '';
  return normalizeTriggerText(folder.replace(/^\d{3}-/, ''))
    .split(' ')
    .filter((token) => token.length >= MIN_FOLDER_TOKEN_LENGTH);
}

// ───────────────────────────────────────────────────────────────
// 8. NAMING GRAMMAR
// ───────────────────────────────────────────────────────────────

/**
 * Reports paths that break the naming grammar. Nothing is renamed: a rename
 * inside a corpus-wide frontmatter pass makes the diff unreviewable, which is
 * the cost the convention already declined to pay.
 *
 * A segment is judged only when it claims to be a packet directory, or when it
 * carries characters no segment in this corpus should carry. Ordinary named
 * directories such as `research` are not packet directories and are not
 * reported for failing a grammar they never claimed.
 *
 * @param {string} relativePath Repo-relative document path.
 * @returns {Array<{ reason: string, segment: string }>} Exceptions, empty when clean.
 */
export function classifyNaming(relativePath) {
  const exceptions = [];
  const segments = relativePath.split('/');
  const basename = segments[segments.length - 1];

  for (const segment of segments.slice(1, -1)) {
    if (PACKET_LIKE_RE.test(segment)) {
      if (!PACKET_DIR_RE.test(segment)) {
        exceptions.push({ reason: 'packet directory is not NNN-short-descriptive-name', segment });
      }
      continue;
    }
    if (!SAFE_SEGMENT_RE.test(segment)) {
      exceptions.push({ reason: 'directory name is not lowercase hyphen-separated', segment });
    }
  }

  if (!SAFE_SEGMENT_RE.test(basename)) {
    exceptions.push({ reason: 'document basename is not lowercase hyphen-separated', segment: basename });
  }

  return exceptions;
}

// ───────────────────────────────────────────────────────────────
// 9. DIFF CLASSIFIER
// ───────────────────────────────────────────────────────────────

/** Ceiling on the window a line diff will search after trimming common edges. */
const MAX_DIFF_WINDOW = 4000;

/**
 * Buckets every changed line of a document into frontmatter, whole-line anchor
 * marker, or other. The convention's diff rule says only the first two kinds may
 * appear, so `other` being empty is the machine-checkable form of "no body was
 * rewritten" — and it is checked here rather than by a reviewer reading a
 * corpus-wide diff.
 *
 * @param {string} before Text before the edit.
 * @param {string} after Text after the edit.
 * @returns {{
 *   changed: Array<{ bucket: string, line: number, side: 'added' | 'removed', text: string }>,
 *   counts: { anchorMarker: number, frontmatter: number, other: number }
 * }} Bucketed changes.
 */
export function classifyDiff(before, after) {
  const beforeLines = splitLines(before);
  const afterLines = splitLines(after);
  const beforeBlock = locateFrontmatter(before);
  const afterBlock = locateFrontmatter(after);
  const beforeMarkers = scanAnchorMarkers(beforeLines).markerLineNumbers;
  const afterMarkers = scanAnchorMarkers(afterLines).markerLineNumbers;

  const counts = { anchorMarker: 0, frontmatter: 0, other: 0 };
  const changed = [];

  for (const op of diffLines(beforeLines.map((l) => l.text), afterLines.map((l) => l.text))) {
    const isAdd = op.side === 'added';
    const block = isAdd ? afterBlock : beforeBlock;
    const markers = isAdd ? afterMarkers : beforeMarkers;

    let bucket = 'other';
    if (block.present && op.line >= block.openLine && op.line <= block.closeLine) bucket = 'frontmatter';
    else if (block.hasOpener && !block.present && op.line >= block.openLine) bucket = 'frontmatter';
    else if (markers.has(op.line)) bucket = 'anchorMarker';

    counts[bucket] += 1;
    changed.push({ bucket, line: op.line, side: op.side, text: op.text });
  }

  return { changed, counts };
}

/**
 * Line diff over two arrays. Common leading and trailing lines are trimmed
 * first, which reduces a frontmatter edit inside a long document to a window of
 * a few lines; the search runs only over what is left. A window past the ceiling
 * throws rather than degrading into an approximation nobody would notice.
 *
 * @param {string[]} before Lines before.
 * @param {string[]} after Lines after.
 * @returns {Array<{ line: number, side: 'added' | 'removed', text: string }>} Changed lines, one-based.
 */
export function diffLines(before, after) {
  let prefix = 0;
  while (prefix < before.length && prefix < after.length && before[prefix] === after[prefix]) prefix += 1;

  let suffix = 0;
  while (
    suffix < before.length - prefix
    && suffix < after.length - prefix
    && before[before.length - 1 - suffix] === after[after.length - 1 - suffix]
  ) suffix += 1;

  const leftWindow = before.slice(prefix, before.length - suffix);
  const rightWindow = after.slice(prefix, after.length - suffix);
  if (leftWindow.length > MAX_DIFF_WINDOW || rightWindow.length > MAX_DIFF_WINDOW) {
    throw new Error(
      `diff window of ${leftWindow.length}x${rightWindow.length} lines exceeds the ${MAX_DIFF_WINDOW}-line ceiling`,
    );
  }

  const table = buildLcsTable(leftWindow, rightWindow);
  const ops = [];
  let i = 0;
  let j = 0;
  while (i < leftWindow.length || j < rightWindow.length) {
    if (i < leftWindow.length && j < rightWindow.length && leftWindow[i] === rightWindow[j]) {
      i += 1;
      j += 1;
      continue;
    }
    const down = i + 1 <= leftWindow.length ? table[i + 1][j] : -1;
    const right = j + 1 <= rightWindow.length ? table[i][j + 1] : -1;
    if (j >= rightWindow.length || down >= right) {
      ops.push({ line: prefix + i + 1, side: 'removed', text: leftWindow[i] });
      i += 1;
      continue;
    }
    ops.push({ line: prefix + j + 1, side: 'added', text: rightWindow[j] });
    j += 1;
  }

  return ops;
}

/**
 * @param {string[]} left Left window.
 * @param {string[]} right Right window.
 * @returns {number[][]} Suffix-LCS lengths.
 */
function buildLcsTable(left, right) {
  const table = Array.from({ length: left.length + 1 }, () => new Array(right.length + 1).fill(0));
  for (let i = left.length - 1; i >= 0; i -= 1) {
    for (let j = right.length - 1; j >= 0; j -= 1) {
      table[i][j] = left[i] === right[j]
        ? table[i + 1][j + 1] + 1
        : Math.max(table[i + 1][j], table[i][j + 1]);
    }
  }
  return table;
}

/**
 * Renders a unified diff for review. Only the dry-run stage uses it, so it
 * favors legibility over the exactness of a patch program's output.
 *
 * @param {string} relativePath Repo-relative path.
 * @param {string} before Text before.
 * @param {string} after Text after.
 * @returns {string} Unified-diff text, empty when nothing changed.
 */
export function renderUnifiedDiff(relativePath, before, after) {
  if (before === after) return '';
  const ops = diffLines(splitLines(before).map((l) => l.text), splitLines(after).map((l) => l.text));
  const lines = [`--- a/${relativePath}`, `+++ b/${relativePath}`];
  for (const op of ops) {
    lines.push(`${op.side === 'added' ? '+' : '-'}${op.line}: ${op.text}`);
  }
  return `${lines.join('\n')}\n`;
}

// ───────────────────────────────────────────────────────────────
// 10. PER-VARIANT HANDLERS
// ───────────────────────────────────────────────────────────────

/**
 * Reports an edit that would leave the frontmatter less parseable than it was.
 *
 * The body preimage and the diff rule both pass an edit that stays inside the
 * frontmatter block, so neither can see this failure: the damage is semantic,
 * not positional. The case that proved it real is a block holding a single-line
 * YAML flow mapping, which parses on its own but stops parsing the moment a
 * block key is appended beneath it — a document that declared no trigger key
 * becomes a document whose frontmatter no longer reads at all, and it drops out
 * of retrieval entirely rather than joining it.
 *
 * @param {string} before Text before the edit.
 * @param {string} after Text after the edit.
 * @returns {{ from: string, to: string } | null} The degradation, or null when the edit is safe.
 */
export function degradesFrontmatter(before, after) {
  if (before === after) return null;

  const to = classifyVariant(after).variant;
  if (!UNPARSEABLE_VARIANTS.has(to)) return null;

  const from = classifyVariant(before).variant;
  if (UNPARSEABLE_VARIANTS.has(from)) return null;

  return { from, to };
}

/**
 * Computes the edit one document needs, without touching disk. Every variant
 * gets its documented treatment and nothing else; a variant whose treatment is
 * "skip and report" returns the original text unchanged, so a caller that
 * writes only on a text change is idempotent by construction.
 *
 * @param {{ relativePath: string, text: string }} document Document under plan.
 * @returns {{
 *   actions: string[],
 *   anchors: ReturnType<typeof analyzeAnchors>,
 *   classification: ReturnType<typeof classifyVariant>,
 *   diagnostics: Array<{ category: string, line: number, path: string, rawKey: string | null, reason: string, severity: string }>,
 *   nextText: string
 * }} The planned edit plus every row it produces.
 */
export function planDocument(document) {
  const { relativePath, text } = document;
  const classification = classifyVariant(text);
  const diagnostics = [];
  const actions = [];
  let nextText = text;

  // Severity is read from the table rather than passed in, so no caller can
  // quietly downgrade a category the convention treats as blocking.
  const row = (category, line, reason, rawKey = null) => {
    diagnostics.push({ category, line, path: relativePath, rawKey, reason, severity: CATEGORY_SEVERITY[category] });
  };

  switch (classification.variant) {
    case 'missing':
      nextText = insertTriggerDeclaration(text, classification.detail);
      actions.push(classification.detail === 'no-frontmatter-block'
        ? 'inserted-frontmatter-block'
        : 'inserted-trigger-key');
      row('missing', classification.line, classification.reason);
      for (const key of missingCanonicalKeys(nextText)) {
        row('missing', classification.line, `canonical key '${key}' is absent and is reported rather than synthesized`, key);
      }
      break;

    case 'duplicate': {
      const deduped = deduplicateTriggerPhrases(text);
      nextText = deduped.text;
      actions.push('deduplicated-trigger-phrases');
      for (const entry of deduped.removed) {
        row('duplicate', entry.line, `removed repeat of normalized phrase "${entry.normalized}", first occurrence kept`, entry.raw);
      }
      break;
    }

    case 'valid-empty':
      break;

    default:
      // malformed-or-unclosed, non-yaml, wrong-list-type, non-string-members and
      // oversized are skip-and-report by contract. A partial rewrite of a block
      // the reader could not parse is the failure this branch exists to avoid.
      actions.push('skipped');
      row(classification.variant, classification.line, classification.reason, classification.rawKey);
      break;
  }

  if (classification.alias) {
    nextText = rewriteAliasKey(nextText);
    actions.push('normalized-alias-key');
    row('alias-hit', classification.line, `key spelled ${ALIAS_KEY}, rewritten to ${CANONICAL_TRIGGER_KEY}`, ALIAS_KEY);
  }

  const folderTokens = packetFolderTokens(relativePath);
  for (const rejected of filterTriggerPhrases(classification.phrases, { folderTokens }).rejected) {
    row('generic-trigger', rejected.line, `${rejected.reason}; reported, never adopted as index input`, rejected.raw);
  }

  const anchors = analyzeAnchors(text);
  for (const finding of anchors.unmatched) {
    row('anchor-unmatched', finding.line, `${finding.reason} for id '${finding.id}'`, finding.id);
  }
  for (const finding of anchors.duplicates) {
    row('anchor-duplicate', finding.line, `anchor id '${finding.id}' appears more than once`, finding.id);
  }

  for (const exception of classifyNaming(relativePath)) {
    row('naming-exception', 0, `${exception.reason}: '${exception.segment}'`, exception.segment);
  }

  // Last gate before the edit is offered to a caller: an edit that would make
  // the frontmatter unparseable is abandoned whole, and the document is left
  // exactly as it was. Repairing nothing beats destroying a declaration.
  const degradation = degradesFrontmatter(text, nextText);
  if (degradation) {
    nextText = text;
    actions.length = 0;
    actions.push('skipped', 'refused-unsafe-edit');
    row(
      classification.variant,
      classification.line,
      `edit refused: it would turn this ${degradation.from} document into ${degradation.to}`,
      classification.rawKey,
    );
  }

  return { actions, anchors, classification, diagnostics, nextText };
}

/**
 * Adds the canonical trigger declaration. An absent block is created in front of
 * the document, which leaves the body region — everything after the closing
 * fence — byte-identical to the file that had no block at all.
 *
 * @param {string} text Document text.
 * @param {string} detail Either `no-frontmatter-block` or `no-trigger-key`.
 * @returns {string} Text carrying a canonical, empty trigger list.
 */
export function insertTriggerDeclaration(text, detail) {
  if (detail === 'no-frontmatter-block') {
    const bom = text.charCodeAt(0) === 0xfeff ? '﻿' : '';
    const rest = bom ? text.slice(1) : text;
    const title = firstHeadingTitle(rest);
    const block = ['---'];
    if (title !== null) block.push(`title: ${quoteScalar(title)}`);
    block.push(`${CANONICAL_TRIGGER_KEY}: []`, '---');
    // No blank line after the closing fence. A separator would read better, but
    // it is a body line, so adding one would change the body region the
    // preimage protects and the diff rule would reject it.
    return `${bom}${block.join('\n')}\n${rest}`;
  }

  const block = locateFrontmatter(text);
  const lines = splitLines(text);
  const insertAt = block.closeLine - 1;
  const terminator = lines[insertAt]?.terminator || '\n';
  lines.splice(insertAt, 0, { terminator, text: `${CANONICAL_TRIGGER_KEY}: []` });
  return joinLines(lines);
}

/**
 * Removes later repeats of a normalized phrase, keeping the first in document
 * order. First-wins is the only rule that does not depend on how the list was
 * walked, and every removal is returned so the run reports each one rather than
 * a single "this document had duplicates".
 *
 * Members that survive are put back exactly as written, quoting included. In
 * flow style the kept segments are rejoined on the same line, so the edit stays
 * inside the one line whose members changed.
 *
 * @param {string} text Document text.
 * @returns {{ removed: Array<{ line: number, normalized: string, raw: string }>, text: string }} Result.
 */
export function deduplicateTriggerPhrases(text) {
  const declared = declaredTriggerMembers(text);
  if (declared.keyIndex === -1 || declared.members.length === 0) return { removed: [], text };

  const seen = new Set();
  const removed = [];
  const kept = [];

  for (const member of declared.members) {
    const normalized = normalizeTriggerText(stripWrappingQuotes(member.raw.trim()));
    if (normalized && seen.has(normalized)) {
      removed.push({ line: member.line, normalized, raw: member.raw.trim() });
      continue;
    }
    if (normalized) seen.add(normalized);
    kept.push(member);
  }

  if (removed.length === 0) return { removed: [], text };

  const lines = splitLines(text);
  if (declared.flow) {
    const keyLine = lines[declared.keyIndex];
    const rendered = keyLine.text.replace(/\[[^\]]*\]/, `[${kept.map((member) => member.raw).join(',')}]`);
    lines[declared.keyIndex] = { ...keyLine, text: rendered };
    return { removed, text: joinLines(lines) };
  }

  const removedIndexes = new Set(
    declared.members.filter((member) => !kept.includes(member)).map((member) => member.index),
  );
  return { removed, text: joinLines(lines.filter((_, index) => !removedIndexes.has(index))) };
}

/**
 * Rewrites the alias key spelling in place, leaving its value untouched.
 *
 * @param {string} text Document text.
 * @returns {string} Text using the canonical key.
 */
export function rewriteAliasKey(text) {
  const block = locateFrontmatter(text);
  if (!block.present) return text;

  const lines = splitLines(text);
  for (let i = block.openLine; i < block.closeLine - 1; i += 1) {
    const match = lines[i].text.match(new RegExp(`^${ALIAS_KEY}(\\s*:.*)$`));
    if (!match) continue;
    lines[i] = { ...lines[i], text: `${CANONICAL_TRIGGER_KEY}${match[1]}` };
    break;
  }
  return joinLines(lines);
}

/**
 * Canonical keys a document does not declare. Reported, never synthesized: a
 * description invented from body prose is indistinguishable later from one an
 * author wrote.
 *
 * @param {string} text Document text.
 * @returns {string[]} Absent canonical keys.
 */
export function missingCanonicalKeys(text) {
  const block = locateFrontmatter(text);
  if (!block.present) return [...CANONICAL_KEYS];

  const declared = new Set();
  const lines = splitLines(text);
  for (let i = block.openLine; i < block.closeLine - 1; i += 1) {
    const match = lines[i].text.match(/^([A-Za-z_][A-Za-z0-9_-]*)\s*:/);
    if (match) declared.add(match[1] === ALIAS_KEY ? CANONICAL_TRIGGER_KEY : match[1]);
  }

  return CANONICAL_KEYS.filter((key) => !declared.has(key)).sort(compareCodeUnits);
}

/**
 * @param {string} text Document text without a BOM.
 * @returns {string | null} First ATX H1, or null when the document has none.
 */
function firstHeadingTitle(text) {
  for (const line of splitLines(text)) {
    const match = line.text.match(/^#\s+(.+?)\s*$/);
    if (match) return match[1];
  }
  return null;
}

/**
 * @param {string} value Scalar text.
 * @returns {string} Double-quoted YAML scalar.
 */
function quoteScalar(value) {
  return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

/**
 * @param {string} value Possibly quoted text.
 * @returns {string} Text without one wrapping quote pair.
 */
function stripWrappingQuotes(value) {
  if (value.length >= 2) {
    const first = value[0];
    const last = value[value.length - 1];
    if ((first === '"' && last === '"') || (first === "'" && last === "'")) return value.slice(1, -1);
  }
  return value;
}

// ───────────────────────────────────────────────────────────────────
// MODULE: Strict Trigger-Phrase Frontmatter Reader
// ───────────────────────────────────────────────────────────────────
// A deliberately narrow YAML-frontmatter reader scoped to one key. It exists
// instead of reusing scripts/lib/frontmatter-migration.ts for two reasons:
// that module is TypeScript and is only reachable through build output, and
// its parseSectionValue collapses several distinct failure shapes into a
// single `undefined`, which cannot produce the per-category diagnostics this
// index is required to emit. Delimiter detection follows that module's
// detectFrontmatter so both agree on where a block starts and ends; the
// YAML-likeness test relaxes three of its rewrite-safety guards, documented at
// isLikelyYamlFrontmatter.
//
// Scalars are read as YAML 1.2 core: `yes` / `no` / `on` / `off` are strings,
// only null, booleans, and numbers are non-string scalars.
// ───────────────────────────────────────────────────────────────────

import { parseFrontmatter } from '@spec-kit/shared/frontmatter/parse-frontmatter.js';
import { MAX_PHRASE_LENGTH, normalizeTriggerText } from './normalize.mjs';

// ───────────────────────────────────────────────────────────────────
// 1. CATEGORIES
// ───────────────────────────────────────────────────────────────────

export const CATEGORY = Object.freeze({
  ALIAS: 'alias',
  DUPLICATE_PHRASE: 'duplicate-phrase',
  MALFORMED_FRONTMATTER: 'malformed-frontmatter',
  MISSING_FRONTMATTER: 'missing-frontmatter',
  NON_STRING_MEMBER: 'non-string-member',
  NON_YAML_FRONTMATTER: 'non-yaml-frontmatter',
  OK: 'ok',
  OVERSIZED_PHRASE: 'oversized-phrase',
  VALID_EMPTY_LIST: 'valid-empty-list',
  WRONG_TRIGGER_LIST_TYPE: 'wrong-trigger-list-type',
});

/**
 * Categories that mean the document's trigger declaration cannot be trusted.
 * Their presence fails publication closed rather than shipping a partial index.
 */
export const MALFORMED_CATEGORIES = Object.freeze(new Set([
  CATEGORY.MALFORMED_FRONTMATTER,
  CATEGORY.NON_STRING_MEMBER,
  CATEGORY.NON_YAML_FRONTMATTER,
  CATEGORY.WRONG_TRIGGER_LIST_TYPE,
]));

/**
 * Highest-precedence category wins when a document trips more than one. A
 * document is reported under exactly one category; `alias` is additionally
 * carried as a boolean so an aliased document that also trips a higher
 * category never loses that fact.
 */
const CATEGORY_PRECEDENCE = Object.freeze([
  CATEGORY.MALFORMED_FRONTMATTER,
  CATEGORY.NON_YAML_FRONTMATTER,
  CATEGORY.WRONG_TRIGGER_LIST_TYPE,
  CATEGORY.NON_STRING_MEMBER,
  CATEGORY.MISSING_FRONTMATTER,
  CATEGORY.VALID_EMPTY_LIST,
  CATEGORY.OVERSIZED_PHRASE,
  CATEGORY.DUPLICATE_PHRASE,
  CATEGORY.ALIAS,
  CATEGORY.OK,
]);

const CANONICAL_KEY = 'trigger_phrases';
const ALIAS_KEY = 'triggerPhrases';

const YAML_NULL_RE = /^(~|null|Null|NULL)$/;
const YAML_BOOL_RE = /^(true|True|TRUE|false|False|FALSE)$/;
const YAML_NUMBER_RE = /^[-+]?(?:0[xX][0-9a-fA-F_]+|0[oO][0-7_]+|(?:\d[\d_]*)?\.?\d[\d_]*(?:[eE][-+]?\d+)?)$/;
const YAML_SPECIAL_FLOAT_RE = /^[-+]?(?:\.inf|\.Inf|\.INF|\.nan|\.NaN|\.NAN)$/;

// ───────────────────────────────────────────────────────────────────
// 2. TEXT HELPERS
// ───────────────────────────────────────────────────────────────────

/**
 * Skips leading whitespace and complete HTML comments, matching what the
 * migration parser tolerates before an opening delimiter.
 *
 * @param {string} content File text.
 * @returns {number} Offset of the first significant character.
 */
function skipLeadingTrivia(content) {
  let index = 0;
  while (index < content.length) {
    const char = content[index];
    if (char === ' ' || char === '\t' || char === '\r' || char === '\n') {
      index += 1;
      continue;
    }
    if (content.startsWith('<!--', index)) {
      const close = content.indexOf('-->', index + 4);
      if (close === -1) break;
      index = close + 3;
      continue;
    }
    break;
  }
  return index;
}

/**
 * One-based line number of an offset.
 *
 * @param {string} content File text.
 * @param {number} offset Character offset.
 * @returns {number} One-based line.
 */
function lineAt(content, offset) {
  let line = 1;
  const limit = Math.min(offset, content.length);
  for (let i = 0; i < limit; i += 1) {
    if (content[i] === '\n') line += 1;
  }
  return line;
}

/**
 * Rejects blocks that are prose, tables, fences, or headings rather than
 * key/value frontmatter.
 *
 * Three of the migration parser's guards are deliberately not carried over.
 * That parser rewrites files, so it refuses anything it is not certain about;
 * this one only reads, and each refusal here silently narrows retrieval instead.
 * Dropped: the block-length cap, which rejected a long but valid key list; the
 * two-space indent floor, which rejected sequence items indented by one space;
 * and the blanket heading rejection, which rejected a YAML comment sitting
 * among real keys. A single-line flow mapping is accepted as the valid YAML it
 * is, though no top-level key will then be found in it.
 *
 * @param {string} block Frontmatter body without delimiters.
 * @returns {boolean} True when the block reads as YAML key/value content.
 */
function isLikelyYamlFrontmatter(block) {
  const lines = block.replace(/\r/g, '').split('\n');
  const significant = lines.filter((line) => line.trim().length > 0);
  if (significant.length === 0) return false;

  if (significant.length === 1) {
    const only = significant[0].trim();
    if (only.startsWith('{') && only.endsWith('}')) return true;
  }

  let topLevelCount = 0;
  for (const line of significant) {
    const trimmed = line.trim();

    if (/^[A-Za-z_][A-Za-z0-9_-]*\s*:/.test(trimmed)) {
      topLevelCount += 1;
      continue;
    }
    // A '#' line inside a delimited block is a YAML comment. Markdown prose
    // that opens with a heading is still rejected, because the lines after it
    // fall through and because a block of only comments declares no key.
    if (trimmed.startsWith('#')) continue;
    if (/^\|/.test(trimmed) || /^```/.test(trimmed) || /^<!--/.test(trimmed)) return false;
    if (/^\s+\S/.test(line)) {
      if (topLevelCount === 0) return false;
      continue;
    }
    return false;
  }
  return topLevelCount > 0;
}

/**
 * Removes a trailing YAML comment from an unquoted scalar. A `#` only opens a
 * comment when preceded by whitespace or at the start of the value.
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
    if (char === '#' && (i === 0 || /\s/.test(value[i - 1]))) {
      return value.slice(0, i);
    }
  }
  return value;
}

/**
 * Strips one matching pair of wrapping quotes.
 *
 * @param {string} value Scalar text.
 * @returns {string} Unquoted value.
 */
function unquote(value) {
  if (value.length >= 2) {
    const first = value[0];
    const last = value[value.length - 1];
    if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
      return value.slice(1, -1);
    }
  }
  return value;
}

/**
 * Splits a YAML flow sequence body on commas that sit outside quotes.
 *
 * @param {string} inner Text between the brackets.
 * @returns {string[]} Raw member texts.
 */
function splitFlowSequence(inner) {
  const members = [];
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
      members.push(current);
      current = '';
      continue;
    }
    current += char;
  }
  if (current.trim().length > 0 || members.length > 0) members.push(current);
  return members;
}

/**
 * Decides whether a list member is a YAML string.
 *
 * @param {string} raw Member text as written.
 * @returns {{ kind: 'string', value: string } | { kind: 'non-string', reason: string }} Classification.
 */
function classifyMember(raw) {
  const trimmed = raw.trim();
  if (trimmed === '') return { kind: 'non-string', reason: 'empty list member' };

  const isQuoted = trimmed.length >= 2
    && ((trimmed.startsWith('"') && trimmed.endsWith('"'))
      || (trimmed.startsWith("'") && trimmed.endsWith("'")));
  if (isQuoted) return { kind: 'string', value: unquote(trimmed) };

  const scalar = stripTrailingComment(trimmed).trim();
  if (scalar === '') return { kind: 'non-string', reason: 'empty list member' };
  if (scalar.startsWith('[') || scalar.startsWith('{')) {
    return { kind: 'non-string', reason: 'flow collection member' };
  }
  if (YAML_NULL_RE.test(scalar)) return { kind: 'non-string', reason: 'null list member' };
  if (YAML_BOOL_RE.test(scalar)) return { kind: 'non-string', reason: `boolean list member (${scalar})` };
  if (YAML_NUMBER_RE.test(scalar) || YAML_SPECIAL_FLOAT_RE.test(scalar)) {
    return { kind: 'non-string', reason: `numeric list member (${scalar})` };
  }
  return { kind: 'string', value: unquote(scalar) };
}

// ───────────────────────────────────────────────────────────────────
// 3. READER
// ───────────────────────────────────────────────────────────────────

/**
 * Reads the trigger-phrase declaration out of a markdown document.
 *
 * @param {string} rawContent File text, BOM tolerated.
 * @returns {{
 *   category: string,
 *   alias: boolean,
 *   line: number,
 *   reason: string,
 *   rawKey: string | null,
 *   phrases: Array<{ line: number, normalized: string, raw: string, truncated: boolean }>,
 *   notes: string[]
 * }} One category per document plus every phrase that survived.
 */
export function readTriggerPhrases(rawContent) {
  const content = rawContent.charCodeAt(0) === 0xfeff ? rawContent.slice(1) : rawContent;

  const empty = (category, line, reason, rawKey = null, alias = false) => ({
    alias,
    category,
    line,
    notes: [],
    phrases: [],
    rawKey,
    reason,
  });

  if (!content) return empty(CATEGORY.MISSING_FRONTMATTER, 1, 'file is empty');

  const start = skipLeadingTrivia(content);
  const firstLineEnd = content.indexOf('\n', start);
  if (firstLineEnd === -1) {
    return empty(CATEGORY.MISSING_FRONTMATTER, 1, 'no frontmatter delimiter');
  }

  const openingLine = lineAt(content, start);
  if (content.slice(start, firstLineEnd).replace(/\r$/, '').trim() !== '---') {
    return empty(CATEGORY.MISSING_FRONTMATTER, 1, 'no opening frontmatter delimiter');
  }

  // The fence split comes from the shared parser over the tail that follows
  // any skipped trivia (skipLeadingTrivia lands on the fence's first `---`, so
  // the parser's own opening-fence rule agrees). Line addressing below stays
  // offset-based, so only the fence scan is delegated.
  const parsed = parseFrontmatter(content.slice(start));
  if (parsed.raw === null) {
    const remainder = content.slice(firstLineEnd + 1);
    if (/^[A-Za-z_][A-Za-z0-9_-]*\s*:/m.test(remainder)) {
      return empty(
        CATEGORY.MALFORMED_FRONTMATTER,
        openingLine,
        'opening frontmatter delimiter has no closing delimiter',
      );
    }
    return empty(CATEGORY.MISSING_FRONTMATTER, 1, 'no closing frontmatter delimiter');
  }

  // The closing fence line is raw's last line (raw keeps its inline trailing
  // spaces), so its start offset reproduces the scanned `closing.index`.
  const raw = parsed.raw;
  const closingIndex = start + raw.length - raw.slice(raw.lastIndexOf('\n') + 1).length;
  const blockStart = firstLineEnd + 1;
  const block = content.slice(blockStart, closingIndex);
  if (!isLikelyYamlFrontmatter(block)) {
    return empty(
      CATEGORY.NON_YAML_FRONTMATTER,
      openingLine,
      'frontmatter block is not YAML key/value content',
    );
  }

  const blockStartLine = lineAt(content, blockStart);
  const lines = block.replace(/\r/g, '').split('\n');

  let keyIndex = -1;
  let rawKey = null;
  let rest = '';
  for (let i = 0; i < lines.length; i += 1) {
    const match = lines[i].match(/^(trigger_phrases|triggerPhrases)\s*:(.*)$/);
    if (!match) continue;
    keyIndex = i;
    [, rawKey, rest] = match;
    break;
  }

  if (keyIndex === -1) {
    return empty(CATEGORY.MISSING_FRONTMATTER, blockStartLine, `no ${CANONICAL_KEY} key in frontmatter`);
  }

  const alias = rawKey === ALIAS_KEY;
  const keyLine = blockStartLine + keyIndex;
  const notes = [];
  if (alias) notes.push(`alias key spelling ${ALIAS_KEY}`);

  const restTrimmed = stripTrailingComment(rest).trim();

  /** @type {Array<{ line: number, raw: string }>} */
  let members = [];

  if (restTrimmed === '[]') {
    return {
      alias,
      category: CATEGORY.VALID_EMPTY_LIST,
      line: keyLine,
      notes,
      phrases: [],
      rawKey,
      reason: 'declared empty trigger list',
    };
  }

  if (restTrimmed.startsWith('[')) {
    if (!restTrimmed.endsWith(']')) {
      return empty(
        CATEGORY.WRONG_TRIGGER_LIST_TYPE,
        keyLine,
        'unterminated inline sequence',
        rawKey,
        alias,
      );
    }
    members = splitFlowSequence(restTrimmed.slice(1, -1))
      .map((raw) => ({ line: keyLine, raw }));
    if (members.length === 0) {
      return {
        alias,
        category: CATEGORY.VALID_EMPTY_LIST,
        line: keyLine,
        notes,
        phrases: [],
        rawKey,
        reason: 'declared empty trigger list',
      };
    }
  } else if (restTrimmed.length > 0) {
    return empty(
      CATEGORY.WRONG_TRIGGER_LIST_TYPE,
      keyLine,
      'scalar value where a sequence is required',
      rawKey,
      alias,
    );
  } else {
    for (let i = keyIndex + 1; i < lines.length; i += 1) {
      const line = lines[i];
      if (!line.trim()) continue;
      if (/^[A-Za-z_][A-Za-z0-9_-]*\s*:/.test(line)) break;
      const item = line.match(/^\s+-(\s.*)?$/);
      if (!item) break;
      members.push({ line: blockStartLine + i, raw: item[1] ?? '' });
    }
    if (members.length === 0) {
      return empty(
        CATEGORY.WRONG_TRIGGER_LIST_TYPE,
        keyLine,
        'key declares no sequence items',
        rawKey,
        alias,
      );
    }
  }

  /** @type {Array<{ line: number, normalized: string, raw: string, truncated: boolean }>} */
  const phrases = [];
  const seen = new Set();
  const flags = new Set();
  let firstOffenceLine = keyLine;
  let firstOffenceReason = '';

  for (const member of members) {
    const classified = classifyMember(member.raw);
    if (classified.kind === 'non-string') {
      return empty(
        CATEGORY.NON_STRING_MEMBER,
        member.line,
        classified.reason,
        rawKey,
        alias,
      );
    }

    let raw = classified.value;
    let truncated = false;
    if (raw.length > MAX_PHRASE_LENGTH) {
      raw = raw.slice(0, MAX_PHRASE_LENGTH);
      truncated = true;
      if (!flags.has(CATEGORY.OVERSIZED_PHRASE)) {
        flags.add(CATEGORY.OVERSIZED_PHRASE);
        firstOffenceLine = member.line;
        firstOffenceReason = `phrase exceeds ${MAX_PHRASE_LENGTH} characters and was truncated`;
      }
    }

    const normalized = normalizeTriggerText(raw);
    if (!normalized) {
      notes.push(`phrase normalizes to nothing at line ${member.line}`);
      continue;
    }

    if (seen.has(normalized)) {
      if (!flags.has(CATEGORY.DUPLICATE_PHRASE)) {
        flags.add(CATEGORY.DUPLICATE_PHRASE);
        if (!firstOffenceReason) {
          firstOffenceLine = member.line;
          firstOffenceReason = `duplicate normalized phrase "${normalized}"`;
        }
      }
      continue;
    }

    seen.add(normalized);
    phrases.push({ line: member.line, normalized, raw, truncated });
  }

  if (phrases.length === 0 && flags.size === 0) {
    return {
      alias,
      category: CATEGORY.VALID_EMPTY_LIST,
      line: keyLine,
      notes,
      phrases: [],
      rawKey,
      reason: 'sequence produced no usable phrases',
    };
  }

  if (alias) flags.add(CATEGORY.ALIAS);
  if (flags.size === 0) flags.add(CATEGORY.OK);

  const category = CATEGORY_PRECEDENCE.find((candidate) => flags.has(candidate)) ?? CATEGORY.OK;
  const reason = category === CATEGORY.ALIAS
    ? `alias key spelling ${ALIAS_KEY}`
    : (firstOffenceReason || 'trigger list parsed');

  return {
    alias,
    category,
    line: category === CATEGORY.ALIAS || category === CATEGORY.OK ? keyLine : firstOffenceLine,
    notes,
    phrases,
    rawKey,
    reason,
  };
}

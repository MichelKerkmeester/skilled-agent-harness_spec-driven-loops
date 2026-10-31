// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ lint-goal-criteria — advisory lint for goal criteria rules 4 and 5      ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');
const { createHash } = require('node:crypto');

const {
  extractDurableSlice,
  splitFrontmatter,
  LOG_ANCHOR
} = require(path.resolve(__dirname, '../../../../../.skilled/hooks/goal/lib/goal-slice.cjs'));

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const TAG = '[lint-goal-criteria]';
const GOAL_FILE = 'goal.md';
const ARCHIVE_DIR = 'z_archive';
const SCRATCH_DIR = 'scratch';
const NAMED_TOKEN = 'QREF';

// A determiner opens a referring phrase whose head must resolve locally or by name.
const DETERMINERS = new Set(['the', 'this', 'these', 'those', 'its', 'their', 'every', 'each']);

// These name the packet or the run itself, so they resolve without another file.
const LOCALITY_NOUNS = new Set(['repo', 'repository', 'packet', 'phase', 'goal', 'child', 'line', 'command', 'operator', 'test']);

// Modifiers sit between a determiner and its head, so the scan steps over them.
const MODIFIERS = new Set(['same', 'own', 'new', 'old', 'final', 'first', 'last', 'next', 'other', 'whole', 'full', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten']);

// English words common in criteria; a line with none of them is not scored.
const FUNCTION_WORDS = new Set(['a', 'an', 'the', 'and', 'or', 'but', 'nor', 'of', 'to', 'in', 'on', 'at', 'by', 'for', 'with', 'from', 'into', 'is', 'are', 'was', 'were', 'be', 'been', 'has', 'have', 'had', 'do', 'does', 'no', 'not', 'none', 'each', 'every', 'all', 'any', 'both', 'only', 'per', 'its', 'their', 'this', 'that', 'these', 'those', 'when', 'if', 'then', 'than', 'as', 'after', 'before', 'while', 'which', 'where', 'it', 'they', 'exits', 'prints', 'passes', 'returns', 'reports', 'holds', 'matches', 'contains', 'exists', 'lists', 'shows', 'validates', 'resolve', 'resolves', 'runs', 'fails', 'writes', 'reads', 'present', 'zero', 'one']);

// Wording whose check needs another document's content. The second list
// counts only when the line names no artifact of its own.
const RULE5_PATTERNS = [
  /\bas (?:described|defined|listed|specified|documented|stated|shown|required) (?:in|by|under)\b/giu,
  /\b(?:see|refer to|per) (?:the )?(?:spec|plan|tasks|checklist|section|table|appendix|research|synthesis|decision record|requirements?)\b/giu,
  /\b(?:REQ|SC|CHK|NFR|AC)-\d+\b/gu,
  /\bevery (?:kept|listed|named|required|relevant|affected|applicable)\b/giu,
  /\bwhere (?:they|these|those)\b/giu
];
const RULE5_UNNAMED_PATTERNS = [
  /\b(?:is|are) listed\b/giu,
  /\bthe (?:rows|items|entries|cases|steps) (?:in|of|from|under)\b/giu
];

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

// Ported from check-goal.cjs, which exports only packet-level runners. Keep
// these three in step with it: a parity test compares the criterion counts.

function getAnchorBody(content, anchorName) {
  const open = '<!-- ANCHOR:' + anchorName + ' -->';
  const close = '<!-- /ANCHOR:' + anchorName + ' -->';
  const openIndex = content.indexOf(open);
  const closeIndex = content.indexOf(close);
  if (openIndex < 0 || closeIndex < 0 || closeIndex < openIndex) return null;
  if (content.indexOf(open, openIndex + open.length) >= 0) return null;
  if (content.indexOf(close, closeIndex + close.length) >= 0) return null;
  return content.slice(openIndex + open.length, closeIndex);
}

function getGoalSections(durableSlice) {
  const lines = durableSlice.split(/\r\n|\r|\n/u);
  const headingSection = (pattern) => {
    const start = lines.findIndex((line) => pattern.test(line));
    if (start < 0) return [];
    const heading = lines[start].match(/^(#{1,6})\s+/u);
    const depth = heading ? heading[1].length : 6;
    const section = [];

    for (let index = start + 1; index < lines.length; index += 1) {
      const nextHeading = lines[index].match(/^(#{1,6})\s+/u);
      if (nextHeading && nextHeading[1].length <= depth) break;
      section.push(lines[index]);
    }
    return section;
  };

  const objectiveIndex = lines.findIndex((line) => line.includes('**Objective:**'));
  let objective = '';
  if (objectiveIndex >= 0) {
    const firstLine = lines[objectiveIndex].replace(/^.*?\*\*Objective:\*\*/u, '');
    const objectiveLines = [firstLine];
    for (let index = objectiveIndex + 1; index < lines.length; index += 1) {
      if (lines[index].trim() === '' || /^#{1,6}\s+/u.test(lines[index])) break;
      objectiveLines.push(lines[index]);
    }
    objective = objectiveLines.join('\n');
  }

  // A directive can carry its own "Completion criteria" heading ahead of the
  // template section, so the completion anchor wins whenever the goal has one.
  const completionBody = getAnchorBody(durableSlice, 'completion');
  return {
    objective,
    decisions: headingSection(/^#{2,6}\s+(?:\d+(?:\.\d+)*\.\s*)?Decisions\b/iu),
    criteria: completionBody === null
      ? headingSection(/^#{1,6}\s+(?:\d+(?:\.\d+)*\.\s*)?Completion Criteria\b/iu)
      : completionBody.split(/\r\n|\r|\n/u)
  };
}

function getCriterionItems(lines) {
  return lines
    .map((line) => line.match(/^[-*+]\s+(?:\[[ xX]\]\s*)?(.*)$/u))
    .filter(Boolean)
    .map((match) => match[1]);
}

function maskNamedText(line) {
  return String(line)
    .replace(/`[^`]*`/gu, ' ' + NAMED_TOKEN + ' ')
    .replace(/"[^"]*"/gu, ' ' + NAMED_TOKEN + ' ');
}

function bareWord(token) {
  return String(token)
    .replace(/^[("'[]+/u, '')
    .replace(/[.,;:!?)"'\]]+$/u, '')
    .replace(/['’]s$/u, '');
}

function isNamedToken(token) {
  const word = bareWord(token);
  return (
    word === NAMED_TOKEN ||
    word.includes('/') ||
    /^[\w.-]+\.[a-z0-9]{1,6}$/iu.test(word) ||
    /^\d/u.test(word)
  );
}

function hasNamedArtifact(line) {
  return maskNamedText(line).split(/\s+/u).filter(Boolean).some(isNamedToken);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Read a goal's completion criteria with the file line each one sits on and a
 * stable hash of its text, so a caller can point at a location and identify an
 * item without storing the criterion text itself.
 *
 * @param {string} content - Raw goal.md content.
 * @returns {{ criteria: Array<{ line: number, text: string, text_sha12: string }>, error: string | null }} Criterion records in file order, or an empty list and the reason it could not be read.
 */
function readGoalCriteria(content) {
  const { body, broken } = splitFrontmatter(content);
  if (broken) {
    return { criteria: [], error: 'goal frontmatter opener has no closing fence' };
  }

  const durableSlice = extractDurableSlice(content);
  const logOffset = body.indexOf(LOG_ANCHOR);
  if (logOffset >= 0 && body.slice(0, logOffset) !== durableSlice) {
    return { criteria: [], error: 'shared durable-slice boundary did not match the log anchor' };
  }

  const normalized = String(content).replace(/\r\n?/g, '\n');
  const prefix = normalized.slice(0, normalized.length - body.length);
  const lineOffset = (prefix.match(/\n/gu) || []).length;
  const items = getCriterionItems(getGoalSections(durableSlice).criteria);
  const lines = durableSlice.split('\n');

  let cursor = 0;
  if (getAnchorBody(durableSlice, 'completion') !== null) {
    cursor = lines.findIndex((line) => line.includes('<!-- ANCHOR:completion -->'));
  } else {
    const headingIndex = lines.findIndex(
      (line) => /^#{1,6}\s+(?:\d+(?:\.\d+)*\.\s*)?Completion Criteria\b/iu.test(line)
    );
    if (headingIndex >= 0) cursor = headingIndex;
  }

  const criteria = [];
  for (const item of items) {
    let j = cursor;
    while (j < lines.length) {
      const match = lines[j].match(/^[-*+]\s+(?:\[[ xX]\]\s*)?(.*)$/u);
      if (match && match[1] === item) break;
      j += 1;
    }

    const text = item.trimEnd();
    criteria.push({
      line: lineOffset + j + 1,
      text,
      text_sha12: createHash('sha256').update(text, 'utf8').digest('hex').slice(0, 12)
    });
    cursor = j + 1;
  }

  return { criteria, error: null };
}

/**
 * Flag definite references a criterion cannot resolve on its own: a leading
 * bare "It" or "They", or a determiner phrase whose head names neither the
 * packet nor the run and is not itself a named token. Backticked and
 * double-quoted text counts as named.
 *
 * @param {string} line - One criterion line.
 * @returns {string[]} The dangling spans, in order of appearance.
 */
function rule4DanglingRefs(line) {
  const words = maskNamedText(line).split(/\s+/u).filter(Boolean);
  const spans = [];

  if (words[0] && (bareWord(words[0]) === 'It' || bareWord(words[0]) === 'They')) {
    spans.push(bareWord(words[0]));
  }

  for (let i = 0; i < words.length; i += 1) {
    if (!DETERMINERS.has(bareWord(words[i]).toLowerCase())) continue;

    let start = i + 1;
    while (start < words.length && MODIFIERS.has(bareWord(words[start]).toLowerCase())) {
      start += 1;
    }

    const window = words.slice(start, start + 3);
    if (window.length === 0) continue;

    const head = bareWord(window[0]).toLowerCase();
    if (head === '' || FUNCTION_WORDS.has(head)) continue;
    if (window.some(isNamedToken)) continue;
    if (LOCALITY_NOUNS.has(head)) continue;
    if (head.endsWith('s') && LOCALITY_NOUNS.has(head.slice(0, -1))) continue;
    if (window[0].endsWith(':') || window[0].endsWith('=')) continue;

    spans.push(words.slice(i, start + 1).map(bareWord).join(' '));
  }

  return spans;
}

/**
 * Flag wording whose check needs another document's content. The unnamed
 * patterns count only when the line names no artifact of its own, so a line
 * naming its own commands, files, or counts keeps its checks local.
 *
 * @param {string} line - One criterion line.
 * @returns {string[]} The external-reference spans, in pattern order.
 */
function rule5ExternalFile(line) {
  const text = String(line);
  const spans = [];

  for (const pattern of RULE5_PATTERNS) {
    for (const match of text.matchAll(pattern)) {
      spans.push(match[0]);
    }
  }

  if (!hasNamedArtifact(text)) {
    for (const pattern of RULE5_UNNAMED_PATTERNS) {
      for (const match of text.matchAll(pattern)) {
        spans.push(match[0]);
      }
    }
  }

  return spans;
}

/**
 * Classify a criterion line: a bracketed placeholder, a lexical item with no
 * function word to score, or a scored check the per-line rules apply to.
 *
 * @param {string} text - One criterion line.
 * @returns {'placeholder' | 'lexical_unscored' | 'scored'} The line's class.
 */
function classifyCriterion(text) {
  const trimmed = String(text).trim();
  if (/^\[[^\]]*\]$/u.test(trimmed)) return 'placeholder';

  const words = maskNamedText(trimmed)
    .split(/\s+/u)
    .map((token) => bareWord(token).toLowerCase());
  if (!words.some((word) => FUNCTION_WORDS.has(word))) return 'lexical_unscored';
  return 'scored';
}

/**
 * Run the per-line rules on one criterion and report its class with the spans
 * each rule found; only a scored line carries rule findings.
 *
 * @param {string} text - One criterion line.
 * @returns {{ class: string, rule4: string[], rule5: string[] }} The line's class and the flagged spans per rule.
 */
function lintCriterion(text) {
  const cls = classifyCriterion(text);
  return {
    class: cls,
    rule4: cls === 'scored' ? rule4DanglingRefs(text) : [],
    rule5: cls === 'scored' ? rule5ExternalFile(text) : []
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  getAnchorBody,
  getGoalSections,
  getCriterionItems,
  readGoalCriteria,
  rule4DanglingRefs,
  rule5ExternalFile,
  classifyCriterion,
  lintCriterion
};

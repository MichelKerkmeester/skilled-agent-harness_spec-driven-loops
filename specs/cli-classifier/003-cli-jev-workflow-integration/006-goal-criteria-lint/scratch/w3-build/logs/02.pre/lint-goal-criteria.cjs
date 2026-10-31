// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ lint-goal-criteria — advisory lexical lint for goal criteria rules 4 and 5║
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

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  getAnchorBody,
  getGoalSections,
  getCriterionItems,
  readGoalCriteria
};

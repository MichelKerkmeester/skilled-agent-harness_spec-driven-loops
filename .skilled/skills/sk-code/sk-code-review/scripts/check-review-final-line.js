#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Review Final-Line Checker
// ───────────────────────────────────────────────────────────────────
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

import ruleOverrides from '../../shared/scripts/check-rule-overrides.cjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const REVIEW_STATUS = Object.freeze({
  APPROVED: 'APPROVED',
  REQUESTED_CHANGES: 'REQUESTED_CHANGES',
  COMMENTED: 'COMMENTED',
});
const REVIEW_STATUS_TOKENS = Object.values(REVIEW_STATUS);
const REVIEW_STATUS_PATTERN = REVIEW_STATUS_TOKENS.join('|');
const LEGACY_STATUS = new Map([
  ['APPROVE', REVIEW_STATUS.APPROVED],
  ['REQUEST CHANGES', REVIEW_STATUS.REQUESTED_CHANGES],
  ['BLOCK', REVIEW_STATUS.REQUESTED_CHANGES],
]);
const LEGACY_STATUS_PATTERN = [...LEGACY_STATUS.keys()].join('|');
const EXACT_STATUS = new RegExp('^Review status: (' + REVIEW_STATUS_PATTERN + ')$');
// A list marker and title case are accepted, so a reworded header line is still compared with the status line.
const OVERALL_ASSESSMENT = /^\s*(?:[-*+]\s+)?\*{0,2}Overall assessment\*{0,2}:\s*(.*)$/i;
const ASSESSMENT_STATUSES = new Set(REVIEW_STATUS_TOKENS);
const COMMENTED_SKIP_STATUS = new RegExp(
  '^Review status: ' +
    REVIEW_STATUS.COMMENTED +
    ' \\((no changes since last review at \\S+|skipped: [^)]+)\\)$'
);
const RESULT_BLOCK_HEADER = 'AGENT_IO_RESULT v1';
// The agent's report carries a Recommendation line. It is a verdict only when its whole value
// is one status token, or one of the older tokens followed by the end of the line or a comma,
// so prose such as "approve the migration after the fix" is never read as one.
const RECOMMENDATION = /^\s*(?:[-*+]\s+)?\*{0,2}Recommendation\*{0,2}:\s*(.*)$/i;
const RECOMMENDATION_STATUS = new RegExp('^(' + REVIEW_STATUS_PATTERN + ')$');
const RECOMMENDATION_LEGACY = new RegExp('^(' + LEGACY_STATUS_PATTERN + ')(?:$|,)');
// The Rule sources line names five groups in a fixed order. Its rule ids use the grammar
// of the shared rule-overrides linter, read from the linter so the two cannot drift.
const RULE_SOURCES_PREFIX = 'Rule sources:';
const RULE_SOURCES_EMPTY = 'Rule sources: none';
const RULE_SOURCES_LINE =
  /^Rule sources: (.+?)\. Overrides: (.+?)\. Refused: (.+?)\. Ignored: (.+?)\. Conflicts: (.+)$/;
const RULE_ID_TOKEN = ruleOverrides.RULE_ID.source.replace(/^\^/, '').replace(/\$$/, '');
const RULE_SOURCES_ENTRIES = {
  Overrides: { separator: '; ', entry: new RegExp(`^${RULE_ID_TOKEN} (?:none|replace) from \\S.*$`) },
  Refused: { separator: '; ', entry: /^\S.*$/ },
  Ignored: { separator: '; ', entry: new RegExp(`^${RULE_ID_TOKEN} from \\S.*$`) },
  Conflicts: { separator: '; ', entry: new RegExp(`^${RULE_ID_TOKEN} \\S+ \\S+$`) },
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. SUMMARY LINE READERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Reads the verdict-bearing Recommendation lines, wherever they sit in the report.
 *
 * @param {string} text - Review output text.
 * @returns {{ status: string, raw: string }[]} One entry per verdict line, its token mapped onto
 *   the status vocabulary. Prose and a template line that lists several tokens are skipped.
 */
function readRecommendations(text) {
  const recommendations = [];
  for (const line of text.replace(/\r\n/g, '\n').split('\n')) {
    const match = line.match(RECOMMENDATION);
    if (match === null) {
      continue;
    }
    const value = match[1].replace(/[*`]/g, '').trim();
    const status = value.match(RECOMMENDATION_STATUS);
    if (status !== null) {
      recommendations.push({ status: status[1], raw: status[1] });
      continue;
    }
    const legacy = value.match(RECOMMENDATION_LEGACY);
    if (legacy !== null) {
      recommendations.push({ status: LEGACY_STATUS.get(legacy[1]), raw: legacy[1] });
    }
  }
  return recommendations;
}

/**
 * Reads the status from the final line of a full review. A skip status is not a full review,
 * so it returns null for one, as it does for a report with no exact status line last.
 *
 * @param {string} text - Review output text.
 * @returns {string | null} `APPROVED`, `REQUESTED_CHANGES`, `COMMENTED` or null.
 */
function readFinalStatus(text) {
  const lines = text.replace(/\r\n/g, '\n').replace(/\n+$/, '').split('\n');
  const match = lines[lines.length - 1].match(EXACT_STATUS);
  return match === null ? null : match[1];
}

/**
 * Checks each Rule sources line. The line is optional, so a report without one passes.
 *
 * @param {string[]} lines - Review output lines.
 * @returns {string[]} Failure messages, or an empty array when valid.
 */
function checkRuleSources(lines) {
  const ruleLines = lines.filter((line) => line.startsWith(RULE_SOURCES_PREFIX));
  if (ruleLines.length > 1) {
    return ['more than one "Rule sources:" line in the output'];
  }
  if (ruleLines.length === 0 || ruleLines[0] === RULE_SOURCES_EMPTY) {
    return [];
  }
  const line = ruleLines[0];
  // A documented template shows placeholders, not a report. A redacted private path such as
  // `<PRIVATE>` is still a report, so only the two template spellings are skipped.
  if (line.startsWith('Rule sources: [') || line.includes('<checklist file>')) {
    return [];
  }
  const match = line.match(RULE_SOURCES_LINE);
  if (match === null) {
    return [
      'Rule sources line does not name its five groups in order: Rule sources, Overrides, Refused, Ignored, Conflicts',
    ];
  }
  const failures = [];
  const [, sources, ...groupValues] = match;
  if (sources !== 'none' && sources.split(', ').some((entry) => entry.trim() === '')) {
    failures.push('Rule sources line lists an empty checklist file');
  }
  Object.entries(RULE_SOURCES_ENTRIES).forEach(([group, shape], index) => {
    const value = groupValues[index];
    if (value === 'none') {
      return;
    }
    for (const entry of value.split(shape.separator)) {
      if (!shape.entry.test(entry)) {
        failures.push(`Rule sources line has a malformed ${group} entry: "${entry}"`);
      }
    }
  });
  return failures;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. REVIEW OUTPUT CHECKER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Checks whether review output ends on the required status line.
 *
 * @param {string} text - Review output text.
 * @returns {string[]} Failure messages, or an empty array when valid.
 */
function checkReviewOutput(text) {
  let normalizedText = text.replace(/\r\n/g, '\n');
  if (normalizedText.trim() === '') {
    return ['review output is empty'];
  }

  if (normalizedText.endsWith('\n')) {
    normalizedText = normalizedText.slice(0, -1);
  }
  if (normalizedText.endsWith('\n')) {
    return ['blank line after the status line'];
  }

  const lines = normalizedText.split('\n');
  let lastStatusIndex = -1;
  for (let index = 0; index < lines.length; index += 1) {
    if (lines[index].startsWith('Review status:')) {
      lastStatusIndex = index;
    }
  }

  const resultBlockIndex = lines.lastIndexOf(RESULT_BLOCK_HEADER);
  if (resultBlockIndex > lastStatusIndex) {
    return ['AGENT_IO_RESULT block follows the status line'];
  }

  const finalLine = lines[lines.length - 1];
  if (!EXACT_STATUS.test(finalLine) && !COMMENTED_SKIP_STATUS.test(finalLine)) {
    return [`final line is not an exact status line: "${finalLine}"`];
  }

  if (COMMENTED_SKIP_STATUS.test(finalLine) && lines.length > 1) {
    return ['skip status must be the whole output'];
  }

  if (EXACT_STATUS.test(finalLine)) {
    const failures = [];
    let blankCount = 0;
    let precedingIndex = lines.length - 2;
    while (precedingIndex >= 0 && lines[precedingIndex].trim() === '') {
      blankCount += 1;
      precedingIndex -= 1;
    }
    if (blankCount === 0) {
      failures.push('no blank line above the status line');
    } else if (blankCount > 1) {
      failures.push('more than one blank line above the status line');
    }
    // Only the status line is machine-parsed, so extra spaces after the colon are accepted.
    if (precedingIndex < 0 || !/^Not checked: +\S/.test(lines[precedingIndex])) {
      failures.push('no "Not checked:" line above the status line');
    }
    const notCheckedCount = lines.filter((line) => line.startsWith('Not checked:')).length;
    if (notCheckedCount > 1) {
      failures.push('more than one "Not checked:" line in the output');
    }
    // A report whose summary and status line disagree hands automation and a human reader two different verdicts.
    const finalStatus = finalLine.match(EXACT_STATUS)[1];
    for (const line of lines) {
      const assessment = line.match(OVERALL_ASSESSMENT);
      if (assessment === null) {
        continue;
      }
      const value = assessment[1].replace(/[*`]/g, '').trim();
      if (ASSESSMENT_STATUSES.has(value) && value !== finalStatus) {
        failures.push(
          `Overall assessment "${value}" contradicts the final status line "Review status: ${finalStatus}"`
        );
      }
    }
    for (const recommendation of readRecommendations(normalizedText)) {
      if (recommendation.status !== finalStatus) {
        failures.push(
          `Recommendation "${recommendation.raw}" contradicts the final status line "Review status: ${finalStatus}"`
        );
      }
    }
    failures.push(...checkRuleSources(lines));
    return failures;
  }

  return [];
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. COMMAND-LINE INTERFACE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Reads checker input from one file argument or stdin and reports CLI input errors.
 *
 * @param {string} programName - The checker name shown in usage and option errors.
 * @param {string[]} [args=process.argv.slice(2)] - The arguments after the script name.
 * @returns {string | null} Input text, or null after setting exit code 2 for a CLI error.
 */
function readCliInput(programName, args = process.argv.slice(2)) {
  const offending = args.find((arg) => arg.startsWith('-')) ?? (args.length > 1 ? args[1] : null);
  const usage = 'usage: ' + programName + ' [file]';
  if (offending !== null) {
    console.error(programName + ': unknown option: ' + offending);
    console.error(usage);
    process.exitCode = 2;
    return null;
  }
  const inputPath = args.length > 0 ? args[0] : null;
  try {
    return inputPath === null ? fs.readFileSync(0, 'utf8') : fs.readFileSync(inputPath, 'utf8');
  } catch (error) {
    console.error('cannot read ' + (inputPath === null ? 'stdin' : inputPath) + ': ' + error.message);
    console.error(usage);
    process.exitCode = 2;
    return null;
  }
}

function runCli() {
  const text = readCliInput('check-review-final-line.js');
  if (text === null) {
    return;
  }

  const failures = checkReviewOutput(text);
  if (failures.length === 0) {
    console.log('OK: review output ends on the exact status line');
    return;
  }

  for (const failure of failures) {
    console.error(`FAIL: ${failure}`);
  }
  process.exitCode = 1;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

export { REVIEW_STATUS, checkReviewOutput, readCliInput, readFinalStatus, readRecommendations };

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(fs.realpathSync(process.argv[1])).href
) {
  runCli();
}

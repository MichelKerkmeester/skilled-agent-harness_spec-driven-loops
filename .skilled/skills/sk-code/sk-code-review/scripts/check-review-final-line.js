#!/usr/bin/env node
// ╔════════════════════════════════════════════════════════════════════════════╗
// ║ check-review-final-line - validates the final status line in review output ║
// ╚════════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const EXACT_STATUS = /^Review status: (APPROVED|REQUESTED_CHANGES|COMMENTED)$/;
const COMMENTED_SKIP_STATUS =
  /^Review status: COMMENTED \((no changes since last review at \S+|skipped: [^)]+)\)$/;
const RESULT_BLOCK_HEADER = 'AGENT_IO_RESULT v1';

// ─────────────────────────────────────────────────────────────────────────────
// 3. REVIEW OUTPUT CHECKER
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
    if (precedingIndex < 0 || !/^Not checked: \S/.test(lines[precedingIndex])) {
      failures.push('no "Not checked:" line above the status line');
    }
    const notCheckedCount = lines.filter((line) => line.startsWith('Not checked:')).length;
    if (notCheckedCount > 1) {
      failures.push('more than one "Not checked:" line in the output');
    }
    return failures;
  }

  return [];
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. COMMAND-LINE INTERFACE
// ─────────────────────────────────────────────────────────────────────────────

function runCli() {
  const inputPath = process.argv.length > 2 ? process.argv[2] : null;
  let text;

  try {
    text = inputPath === null ? fs.readFileSync(0, 'utf8') : fs.readFileSync(inputPath, 'utf8');
  } catch (error) {
    console.error(`cannot read ${inputPath === null ? 'stdin' : inputPath}: ${error.message}`);
    console.error('usage: check-review-final-line.js [file]');
    process.exitCode = 2;
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
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

export { checkReviewOutput };

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(fs.realpathSync(process.argv[1])).href
) {
  runCli();
}

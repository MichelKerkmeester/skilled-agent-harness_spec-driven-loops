#!/usr/bin/env node
// ╔═════════════════════════════════════════════════════════════════════════════════════╗
// ║ check-review-findings - checks finding numbering and the Case line in review output ║
// ╚═════════════════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const FINDINGS_HEADING = '## Findings';
// Two documented shapes: the SKILL.md template numbers list items, and the
// review-core.md schema puts the number in a level-three heading.
const NUMBERED_FINDING = /^(\d+)\. \S/;
const HEADING_FINDING = /^### (\d+) \[P[0-2]\] \S/;
const CASE_LINE = /^\s*- Case: \S/;

// ─────────────────────────────────────────────────────────────────────────────
// 3. FINDINGS CHECKER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Reads the numbered findings under the Findings heading, in document order.
 *
 * @param {string} text - Review output text.
 * @returns {{ number: number, hasCase: boolean }[]} One entry per numbered finding.
 */
function parseFindings(text) {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const headingIndex = lines.indexOf(FINDINGS_HEADING);
  if (headingIndex === -1) {
    return [];
  }

  const findings = [];
  for (let index = headingIndex + 1; index < lines.length; index += 1) {
    const line = lines[index];
    // Only a level-two heading closes the section. The severity subheadings are
    // level three, so they stay inside it and the numbering runs across them.
    if (line.startsWith('## ')) {
      break;
    }
    const numbered = NUMBERED_FINDING.exec(line) || HEADING_FINDING.exec(line);
    if (numbered) {
      findings.push({ number: Number(numbered[1]), hasCase: false });
    } else if (findings.length > 0 && CASE_LINE.test(line)) {
      findings[findings.length - 1].hasCase = true;
    }
  }
  return findings;
}

/**
 * Checks that findings are numbered once across the severity groups and that
 * each finding carries a Case line.
 *
 * @param {string} text - Review output text.
 * @returns {string[]} Failure messages, or an empty array when valid.
 */
function checkReviewFindings(text) {
  const failures = [];
  let expected = 1;
  for (const finding of parseFindings(text)) {
    if (finding.number !== expected) {
      failures.push(`finding numbers restart or skip: expected ${expected}, found ${finding.number}`);
    }
    expected = finding.number + 1;
    if (!finding.hasCase) {
      failures.push(`finding ${finding.number} has no Case: line`);
    }
  }
  return failures;
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
    console.error('usage: check-review-findings.js [file]');
    process.exitCode = 2;
    return;
  }

  const failures = checkReviewFindings(text);
  if (failures.length > 0) {
    for (const failure of failures) {
      console.error(`FAIL: ${failure}`);
    }
    process.exitCode = 1;
    return;
  }

  if (parseFindings(text).length === 0) {
    console.log('OK: no numbered findings to check');
    return;
  }
  console.log('OK: findings are numbered once and each carries a Case line');
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

export { checkReviewFindings };

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(fs.realpathSync(process.argv[1])).href
) {
  runCli();
}

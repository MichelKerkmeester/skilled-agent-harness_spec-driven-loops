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
import { readFinalStatus, readRecommendations } from './check-review-final-line.js';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const FINDINGS_HEADING = '## Findings';
// Two documented shapes: the SKILL.md template numbers list items, and the
// review-core.md schema puts the number in a level-three heading.
const NUMBERED_FINDING = /^(\d+)\. \S/;
const HEADING_FINDING = /^### (\d+) \[P([0-2])\] \S/;
// A severity group heading, such as `### P1 - High` or `### Blockers (P0)`, sets the
// severity of the numbered list items under it.
const SEVERITY_GROUP = /^###\s.*\bP([0-2])\b/;
const CASE_LINE = /^\s*- Case: \S/;
// A P0 blocks merge and a P1 must be fixed before merge, so only these two decide the verdict.
const BLOCKING_SEVERITIES = new Set(['P0', 'P1']);

// ─────────────────────────────────────────────────────────────────────────────
// 3. FINDINGS CHECKER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Reads the numbered findings under the Findings heading, in document order.
 *
 * @param {string} text - Review output text.
 * @returns {{ number: number, severity: string | null, hasCase: boolean }[]} One entry per
 *   numbered finding, with the severity its heading or group names, or null when none does.
 */
function parseFindings(text) {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const headingIndex = lines.indexOf(FINDINGS_HEADING);
  if (headingIndex === -1) {
    return [];
  }

  const findings = [];
  let groupSeverity = null;
  for (let index = headingIndex + 1; index < lines.length; index += 1) {
    const line = lines[index];
    // Only a level-two heading closes the section. The severity subheadings are
    // level three, so they stay inside it and the numbering runs across them.
    if (line.startsWith('## ')) {
      break;
    }
    const headed = HEADING_FINDING.exec(line);
    if (headed) {
      findings.push({ number: Number(headed[1]), severity: `P${headed[2]}`, hasCase: false });
      continue;
    }
    const group = SEVERITY_GROUP.exec(line);
    if (group) {
      groupSeverity = `P${group[1]}`;
      continue;
    }
    const numbered = NUMBERED_FINDING.exec(line);
    if (numbered) {
      findings.push({ number: Number(numbered[1]), severity: groupSeverity, hasCase: false });
    } else if (findings.length > 0 && CASE_LINE.test(line)) {
      findings[findings.length - 1].hasCase = true;
    }
  }
  return findings;
}

/**
 * Checks each verdict in the report against the findings: the Recommendation lines and the
 * final status line of a full review. Any P0 or P1 finding means changes are requested, and
 * changes are requested only for a P0 or P1 finding.
 *
 * @param {string} text - Review output text.
 * @param {{ number: number, severity: string | null }[]} findings - The parsed findings.
 * @returns {string[]} Failure messages, or an empty array when every verdict agrees.
 */
function checkVerdicts(text, findings) {
  // With no Findings section there is nothing a verdict can be compared with.
  if (!text.replace(/\r\n/g, '\n').split('\n').includes(FINDINGS_HEADING)) {
    return [];
  }
  const blocking = findings.filter((finding) => BLOCKING_SEVERITIES.has(finding.severity));
  // A finding outside any severity group has no known severity, so it may be the blocker.
  const severitiesKnown = findings.every((finding) => finding.severity !== null);
  const verdicts = readRecommendations(text).map((recommendation) => ({
    label: `Recommendation "${recommendation.raw}"`,
    status: recommendation.status,
  }));
  const finalStatus = readFinalStatus(text);
  if (finalStatus !== null) {
    verdicts.push({ label: `Review status "${finalStatus}"`, status: finalStatus });
  }
  const failures = [];
  for (const verdict of verdicts) {
    if (verdict.status !== 'REQUESTED_CHANGES' && blocking.length > 0) {
      const first = blocking[0];
      failures.push(`${verdict.label} contradicts ${first.severity} finding ${first.number}, which blocks approval`);
    } else if (verdict.status === 'REQUESTED_CHANGES' && blocking.length === 0 && severitiesKnown) {
      failures.push(`${verdict.label} requests changes with no P0 or P1 finding, and a P2 never blocks`);
    }
  }
  return failures;
}

/**
 * Checks that findings are numbered once across the severity groups, that each
 * finding carries a Case line, and that the report's verdicts agree with them.
 *
 * @param {string} text - Review output text.
 * @returns {string[]} Failure messages, or an empty array when valid.
 */
function checkReviewFindings(text) {
  const failures = [];
  const findings = parseFindings(text);
  let expected = 1;
  for (const finding of findings) {
    if (finding.number !== expected) {
      failures.push(`finding numbers restart or skip: expected ${expected}, found ${finding.number}`);
    }
    expected = finding.number + 1;
    if (!finding.hasCase) {
      failures.push(`finding ${finding.number} has no Case: line`);
    }
  }
  failures.push(...checkVerdicts(text, findings));
  return failures;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. COMMAND-LINE INTERFACE
// ─────────────────────────────────────────────────────────────────────────────

function runCli() {
  const args = process.argv.slice(2);
  const offending = args.find((arg) => arg.startsWith('-')) ?? (args.length > 1 ? args[1] : null);
  if (offending !== null) {
    console.error(`check-review-findings.js: unknown option: ${offending}`);
    console.error('usage: check-review-findings.js [file]');
    process.exitCode = 2;
    return;
  }
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

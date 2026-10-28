#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: sk-code Rule Overrides Linter
// ───────────────────────────────────────────────────────────────────
'use strict';

// A checklist file may carry a `## Rule overrides` section that drops or replaces a
// rule for the files the checklist covers. Quality and review both read that section,
// so one linter decides what a valid one looks like. It reads the hard floor from the
// JSON beside the contract reference rather than from its own copy, because a second
// copy of that list would drift and let a floor rule slip through one mode. A mode
// reads a section only through lintOverrides, so what the command line refuses is
// exactly what a mode refuses.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const CONTRACT_PATH = path.resolve(__dirname, '..', 'references', 'universal', 'rule-overrides.json');

const RULE_ID = /^[a-z][a-z0-9-]*\.[a-z0-9][a-z0-9-]*$/;
const FIXED_ENTRY = /^[a-z][a-z0-9-]*\.(?:\*|[a-z0-9][a-z0-9-]*)$/;
const RULE_CLASS = /^[a-z][a-z0-9-]*$/;
// Checklists that follow the numbered upper-case heading style write the same section
// as `## 7. RULE OVERRIDES`, so the number and the case are both accepted.
const SECTION_HEADING = /^##\s+(?:\d+\.\s+)?rule overrides\s*$/i;
const SECTION_END = /^#{1,2}\s/;
const FENCE = /^\s*(`{3,}|~{3,})/;
const SEPARATOR_CELL = /^:?-{3,}:?$/;
const REPLACE_ACTION = /^replace:\s*(.*)$/;

const EXIT_OK = 0;
const EXIT_REFUSED = 1;
const EXIT_USAGE = 2;

const USAGE_TEXT = [
  'Usage: check-rule-overrides.cjs <checklist.md> [<checklist.md>...]',
  '',
  'Checks the optional `## Rule overrides` section of each checklist file.',
  'Exit 0: every file has a valid section or none. Exit 1: a row is refused.',
  'Exit 2: usage error, an unreadable file or an unreadable contract file.',
].join('\n');

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function loadContract(contractPath = CONTRACT_PATH) {
  const contract = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
  if (!contract || !Array.isArray(contract.fixed) || contract.fixed.length === 0) {
    throw new Error(`${contractPath}: "fixed" must be a non-empty list`);
  }
  for (const entry of contract.fixed) {
    if (!entry || typeof entry.id !== 'string' || !FIXED_ENTRY.test(entry.id)) {
      throw new Error(`${contractPath}: fixed entry ${JSON.stringify(entry && entry.id)} is not <class>.<name> or <class>.*`);
    }
    if (typeof entry.rule !== 'string' || entry.rule.trim() === '') {
      throw new Error(`${contractPath}: fixed entry ${entry.id} needs a rule description`);
    }
  }
  const machineChecked = contract.machineCheckedClasses;
  if (!Array.isArray(machineChecked) || !machineChecked.every((name) => typeof name === 'string' && RULE_CLASS.test(name))) {
    throw new Error(`${contractPath}: "machineCheckedClasses" must be a list of rule classes`);
  }
  return { fixed: contract.fixed, machineChecked };
}

function ruleClassOf(id) {
  return id.slice(0, id.indexOf('.'));
}

function findFixed(id, fixed) {
  const ruleClass = ruleClassOf(id);
  return fixed.find((entry) => entry.id === id || entry.id === `${ruleClass}.*`) || null;
}

// Splits a table row on the pipes that are not escaped, so a replacement text can
// hold a literal `\|`.
function splitRow(line) {
  let body = line.trim();
  if (body.startsWith('|')) body = body.slice(1);
  if (body.endsWith('|') && !body.endsWith('\\|')) body = body.slice(0, -1);
  const cells = [];
  let current = '';
  for (let i = 0; i < body.length; i += 1) {
    if (body[i] === '\\' && body[i + 1] === '|') {
      current += '|';
      i += 1;
    } else if (body[i] === '|') {
      cells.push(current.trim());
      current = '';
    } else {
      current += body[i];
    }
  }
  cells.push(current.trim());
  return cells;
}

function stripTicks(cell) {
  const match = /^`([^`]*)`$/.exec(cell);
  return match ? match[1].trim() : cell;
}

function parseAction(cell) {
  const action = stripTicks(cell);
  if (action === 'none') return { action: 'none', text: null };
  const replace = REPLACE_ACTION.exec(action);
  if (replace) {
    const text = replace[1].trim();
    if (text === '') return { error: 'the replace action needs the rule text that takes its place' };
    return { action: 'replace', text };
  }
  return { error: `unknown action "${action}". Use none or replace: <text>` };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parses the grammar of the `## Rule overrides` section of a checklist's text. It
 * knows nothing of the floor, so it stays private and lintOverrides is the reading path.
 *
 * @param {string} text - The checklist file's content.
 * @returns {{found: boolean, rows: Array<Object>, errors: Array<{line: number, message: string}>}}
 *   Each row carries its 1-based line, id, action, replacement text and reason.
 */
function parseOverrides(text) {
  const lines = text.split(/\r?\n/);
  const rows = [];
  const errors = [];
  let found = false;
  let inSection = false;
  let fence = null;
  let tableState = 'none';

  lines.forEach((line, index) => {
    const lineNo = index + 1;
    const fenceMatch = FENCE.exec(line);
    if (fence) {
      if (fenceMatch && fenceMatch[1][0] === fence[0] && fenceMatch[1].length >= fence.length) fence = null;
      return;
    }
    if (fenceMatch) {
      fence = fenceMatch[1];
      return;
    }
    if (SECTION_HEADING.test(line)) {
      if (found) errors.push({ line: lineNo, message: 'a second Rule overrides section. Keep one per file' });
      found = true;
      inSection = true;
      tableState = 'none';
      return;
    }
    if (!inSection) return;
    if (SECTION_END.test(line)) {
      inSection = false;
      return;
    }
    if (!line.trim().startsWith('|')) return;

    const cells = splitRow(line);
    if (tableState === 'none') {
      if (stripTicks(cells[0]).toLowerCase() !== 'rule') {
        errors.push({ line: lineNo, message: 'the table header must read | Rule | Action | Reason |' });
      }
      tableState = 'header';
      return;
    }
    if (tableState === 'header') {
      tableState = 'rows';
      if (cells.every((cell) => SEPARATOR_CELL.test(cell))) return;
      errors.push({ line: lineNo, message: 'the header row must be followed by a | --- | separator row' });
    }
    if (cells.length < 2 || cells.length > 3) {
      errors.push({ line: lineNo, message: `a row has ${cells.length} cells. Write | rule id | action | reason |` });
      return;
    }
    const id = stripTicks(cells[0]);
    if (!RULE_ID.test(id)) {
      errors.push({ line: lineNo, message: `"${id}" is not a rule id. Write <class>.<name>, such as hygiene.task` });
      return;
    }
    const parsed = parseAction(cells[1]);
    if (parsed.error) {
      errors.push({ line: lineNo, message: `\`${id}\`: ${parsed.error}` });
      return;
    }
    rows.push({ line: lineNo, id, action: parsed.action, text: parsed.text, reason: cells[2] || null });
  });

  return { found, rows, errors };
}

/**
 * Reads and checks a checklist's override section. This is the only reading path: a
 * mode applies the returned rows only when the error list is empty.
 *
 * @param {string} text - The checklist file's content.
 * @param {{fixed: Array<{id: string, rule: string}>, machineChecked: Array<string>}} [contract]
 *   The hard floor and the machine-checked classes, read from the contract JSON by default.
 * @returns {{found: boolean, rows: Array<Object>, errors: Array<{line: number, message: string}>}}
 */
function lintOverrides(text, contract = loadContract()) {
  const result = parseOverrides(text);
  const seen = new Map();
  const accepted = [];
  for (const row of result.rows) {
    const floor = findFixed(row.id, contract.fixed);
    if (floor) {
      result.errors.push({ line: row.line, message: `\`${row.id}\` is on the hard floor (${floor.rule}) and cannot be overridden` });
      continue;
    }
    if (row.action === 'replace' && contract.machineChecked.includes(ruleClassOf(row.id))) {
      result.errors.push({ line: row.line, message: `\`${row.id}\` is checked by the runner, so it takes none but never replace:. Change the runner check through commentHygiene.disableRules` });
      continue;
    }
    if (seen.has(row.id)) {
      result.errors.push({ line: row.line, message: `\`${row.id}\` is already overridden at line ${seen.get(row.id)}. Name each rule once` });
      continue;
    }
    seen.set(row.id, row.line);
    accepted.push(row);
  }
  result.errors.sort((a, b) => a.line - b.line);
  return { found: result.found, rows: accepted, errors: result.errors };
}

function main(argv, out = process.stdout, err = process.stderr) {
  if (argv.includes('--help') || argv.includes('-h')) {
    out.write(`${USAGE_TEXT}\n`);
    return EXIT_OK;
  }
  if (argv.length === 0) {
    err.write(`${USAGE_TEXT}\n`);
    return EXIT_USAGE;
  }
  let contract;
  try {
    contract = loadContract();
  } catch (error) {
    err.write(`check-rule-overrides: cannot read the contract file: ${error.message}\n`);
    return EXIT_USAGE;
  }
  let exitCode = EXIT_OK;
  for (const file of argv) {
    let text;
    try {
      text = fs.readFileSync(file, 'utf8');
    } catch (error) {
      err.write(`check-rule-overrides: cannot read ${file}: ${error.message}\n`);
      return EXIT_USAGE;
    }
    const result = lintOverrides(text, contract);
    if (result.errors.length > 0) {
      for (const problem of result.errors) err.write(`${file}:${problem.line}: ${problem.message}\n`);
      out.write(`FAIL ${file}: ${result.errors.length} refused\n`);
      exitCode = EXIT_REFUSED;
    } else if (!result.found) {
      out.write(`OK ${file}: no Rule overrides section\n`);
    } else {
      out.write(`OK ${file}: ${result.rows.length} rule override(s)\n`);
    }
  }
  return exitCode;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

if (require.main === module) {
  process.exitCode = main(process.argv.slice(2));
}

module.exports = {
  CONTRACT_PATH,
  RULE_ID,
  USAGE_TEXT,
  lintOverrides,
  loadContract,
  main,
};

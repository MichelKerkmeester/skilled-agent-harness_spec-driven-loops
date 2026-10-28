// ───────────────────────────────────────────────────────────────────
// MODULE: sk-code Rule Id Registry
// ───────────────────────────────────────────────────────────────────
'use strict';

// The set of rule ids a `## Rule overrides` row may name, read from the documents that
// declare them, so no second list can drift from them.
//
// WHY THIS EXISTS: the shared contract lets a row drop or replace a rule by its id, and a
// mode must refuse a row whose id names no rule, or a typo silently changes nothing. The
// linter checks grammar, action and floor only, by design. Existence is the mode's check,
// and this module is the one place both modes and the doctor read it from.
//
// Sources, as section 3 of rule-overrides.md names them:
//   1. runner-contract.md section 5: the runner's own ids. Its `hygiene.<name>` row
//      defers to the comment-hygiene checker's pattern table for the names.
//   2. code-quality-standards.md sections 3 to 5: one `floor.*` id per row.
//   3. review-core.md section 8, The Floor and The Default Lens tables: `review.*` ids.
// A missing section or an empty table throws, because an empty registry would refuse
// every row and a partial one would refuse some without saying why. For the same reason a
// table body row whose first cell names no id throws with its file and line, as does a
// `hygiene.` row in section 5 that is not the `hygiene.<name>` template. The one row a
// first cell may hold without an id is a wildcard such as `syntax.*`, which names a class
// the runner's own rows already declare.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const HUB = path.resolve(__dirname, '..', '..', '..');
const RULE_ID = /`([a-z][a-z0-9-]*\.[a-z0-9][a-z0-9-]*)`/g;
const HYGIENE_TEMPLATE = '`hygiene.<name>`';
const SEPARATOR = /^\|(\s*:?-+:?\s*\|)+\s*$/;
const WILDCARDS = /^`[a-z][a-z0-9-]*\.\*`(\s*,\s*`[a-z][a-z0-9-]*\.\*`)*$/;

const cache = new Map();

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function sources(hubRoot) {
  return {
    runner: path.join(hubRoot, 'sk-code-quality', 'references', 'runner-contract.md'),
    standards: path.join(hubRoot, 'shared', 'references', 'universal', 'code-quality-standards.md'),
    review: path.join(hubRoot, 'sk-code-review', 'references', 'review-core.md'),
  };
}

// A block is {text, line, file}, where line is the file line its text starts on, so a
// row can be named by where it sits in the file.
function block(text, start, endPattern, parent) {
  const at = start.index + start[0].length;
  const rest = text.slice(at);
  const end = endPattern.exec(rest);
  return { text: end ? rest.slice(0, end.index) : rest, line: parent.line + text.slice(0, at).split('\n').length - 1, file: parent.file };
}

// The body of the numbered H2 section, up to the next H2.
function section(text, number, file) {
  const start = new RegExp(`^## ${number}\\. .*$`, 'm').exec(text);
  if (!start) throw new Error(`${file} has no section ${number}`);
  return block(text, start, /^## /m, { line: 1, file });
}

// The body of one H3 heading inside a section, up to the next H3.
function subsection(parent, heading) {
  const start = new RegExp(`^### ${heading}\\s*$`, 'm').exec(parent.text);
  if (!start) throw new Error(`${parent.file} has no "### ${heading}" heading`);
  return block(parent.text, start, /^### /m, parent);
}

// The first cell and file line of every body row of every table in a block. A table's
// first line is its header, and the separator under it is skipped.
function bodyRows(part) {
  const rows = [];
  const lines = part.text.split('\n');
  for (let index = 0; index < lines.length; index += 1) {
    if (!lines[index].startsWith('|') || (index > 0 && lines[index - 1].startsWith('|'))) continue;
    let row = SEPARATOR.test(lines[index + 1] || '') ? index + 2 : index + 1;
    for (; row < lines.length && lines[row].startsWith('|'); row += 1) {
      rows.push({ cell: lines[row].split('|')[1].trim(), line: part.line + row });
    }
  }
  return rows;
}

// The ids in the first cell of each table body row of a block, keeping only one class,
// and whether a row is the hygiene template. A row whose first cell holds no id and no
// wildcard throws, so a reworded or unquoted row can never shrink the registry.
function firstCellIds(part, ruleClass) {
  const ids = [];
  let template = false;
  for (const { cell, line } of bodyRows(part)) {
    if (cell === HYGIENE_TEMPLATE) {
      template = true;
      continue;
    }
    const found = [...cell.matchAll(RULE_ID)].map((match) => match[1]);
    if (found.length === 0 && /hygiene\./.test(cell)) {
      throw new Error(`${part.file}:${line} is a hygiene row that does not match the ${HYGIENE_TEMPLATE} template: ${cell}`);
    }
    if (found.length === 0 && !WILDCARDS.test(cell)) throw new Error(`${part.file}:${line} is a table row whose first cell names no rule id: ${cell}`);
    for (const id of found) if (!ruleClass || id.startsWith(`${ruleClass}.`)) ids.push(id);
  }
  return { ids, template };
}

function nonEmpty(ids, what) {
  if (ids.length === 0) throw new Error(`${what} declares no rule id`);
  return [...new Set(ids)];
}

// The checker's names come through the quality config loader, which already reads them
// for commentHygiene.disableRules, so the table has one reader.
function hygieneNames(hubRoot) {
  return [...require(path.join(hubRoot, 'sk-code-quality', 'scripts', 'lib', 'quality-config.cjs')).readHygieneRules()];
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Read every known rule id from the documents that declare them.
 *
 * @param {Object} [options] - hubRoot, the sk-code hub folder, for tests.
 * @returns {{ids: Set<string>, runner: string[], hygiene: string[], floor: string[], review: string[], has: Function}}
 * @throws {Error} When a source, its section or its table is missing or empty.
 */
function loadRegistry({ hubRoot = HUB } = {}) {
  const key = path.resolve(hubRoot);
  if (cache.has(key)) return cache.get(key);
  const files = sources(key);

  const runnerRows = firstCellIds(section(fs.readFileSync(files.runner, 'utf8'), 5, files.runner), null);
  const runner = nonEmpty(runnerRows.ids, `${files.runner} section 5`);
  const hygiene = runnerRows.template
    ? nonEmpty(hygieneNames(HUB), 'the comment-hygiene checker').map((name) => `hygiene.${name}`)
    : [];

  const standards = fs.readFileSync(files.standards, 'utf8');
  const floor = nonEmpty([3, 4, 5].flatMap((number) => firstCellIds(section(standards, number, files.standards), 'floor').ids),
    `${files.standards} sections 3 to 5`);

  const lens = section(fs.readFileSync(files.review, 'utf8'), 8, files.review);
  const review = nonEmpty(['The Floor', 'The Default Lens'].flatMap((heading) => firstCellIds(subsection(lens, heading), 'review').ids),
    `${files.review} section 8`);

  const ids = new Set([...runner, ...hygiene, ...floor, ...review]);
  const registry = Object.freeze({ ids, runner, hygiene, floor, review, has: (id) => ids.has(id) });
  cache.set(key, registry);
  return registry;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = { loadRegistry };

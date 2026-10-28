// ───────────────────────────────────────────────────────────────────
// MODULE: sk-code-quality Gate Rule Overrides
// ───────────────────────────────────────────────────────────────────
'use strict';

// A checklist may carry a rule-overrides section, and this is where those rows become the run's
// applied overrides and its conflicts. The section is read only through the shared linter, so an
// explanation refuses exactly what a mode refuses, and a row that names no known rule refuses
// its file, because a typo in an id would otherwise change nothing and say nothing.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');

const {
  OVERRIDE_LINTER_PATH, RULE_REGISTRY_PATH, isRegularFile,
} = require('./gate-core.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const OVERRIDE_REPAIR = 'fix or remove each override row the message names, then check the file with '
  + 'node .skilled/skills/sk-code/shared/scripts/check-rule-overrides.cjs <checklist.md>';

// ─────────────────────────────────────────────────────────────────────────────
// 3. READING
// ─────────────────────────────────────────────────────────────────────────────

// The override section is read only through the shared linter, so an explanation refuses
// exactly what a mode refuses. A section with any error is refused whole, because the
// contract applies a file's rows only when its error list is empty.
function overridesReader() {
  let lint = null;
  let failure = null;
  try {
    const linter = require(OVERRIDE_LINTER_PATH);
    const contract = linter.loadContract();
    lint = (text) => linter.lintOverrides(text, contract);
  } catch (error) {
    failure = `the rule-override contract could not be read: ${error.message}`;
  }
  return (file) => {
    if (!isRegularFile(file)) return null;
    if (failure) return { found: false, refused: true, rows: [], errors: [{ line: null, message: failure }] };
    let text;
    try {
      text = fs.readFileSync(file, 'utf8');
    } catch (error) {
      return { found: false, refused: true, rows: [], errors: [{ line: null, message: `cannot read the checklist: ${error.message}` }] };
    }
    const result = lint(text);
    return { found: result.found, refused: result.errors.length > 0, rows: result.rows, errors: result.errors };
  };
}

// A run reads the override section of each checklist it loads through the same reader an
// explanation uses. The contract applies a file's rows only when its error list is empty,
// so a refused section stops the run rather than leaving a judgment the agent cannot see
// was dropped. A row that names no known rule refuses its file the same way, because a
// typo in an id would otherwise change nothing and say nothing.
function runOverrides(checklists, seats, surfaces) {
  const readOverrides = overridesReader();
  let registry = null;
  let registryFault = null;
  try {
    registry = require(RULE_REGISTRY_PATH).loadRegistry();
  } catch (error) {
    registryFault = `the rule id registry could not be read: ${error.message}`;
  }
  const accepted = [];
  const errors = [];
  const refuse = (entry, reasons) => errors.push({ code: 'CONFIG_INVALID', repair: OVERRIDE_REPAIR,
    message: `${entry.file} has a refused ## Rule overrides section, so none of its rows apply: ${reasons.join('; ')}` });
  for (const entry of checklists) {
    const read = readOverrides(entry.path);
    if (read === null || read.rows.length === 0 && !read.refused) continue;
    if (read.refused) {
      refuse(entry, read.errors.map((row) => `${row.line === null ? '' : `line ${row.line}: `}${row.message}`));
      continue;
    }
    if (registryFault) {
      refuse(entry, [registryFault]);
      continue;
    }
    const unknown = read.rows.filter((row) => !registry.has(row.id));
    if (unknown.length > 0) {
      refuse(entry, unknown.map((row) => `line ${row.line}: \`${row.id}\` names no rule the runner, the universal standards or the review lens declares`));
      continue;
    }
    for (const row of read.rows) {
      accepted.push({ file: entry.file, line: row.line, id: row.id, action: row.action, text: row.text, reason: row.reason, files: [], entry });
    }
  }
  const conflicts = resolveOverridePrecedence(accepted, seats, surfaces);
  return { applied: accepted.map(({ entry, ...row }) => row), conflicts, errors };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. PRECEDENCE
// ─────────────────────────────────────────────────────────────────────────────

// The precedence level of one checklist for one file, from the seats that listed it: the
// repository checklist, then a specific surface, then the SKILLED fallback, then the rule
// as the mode ships it. A checklist several seats list takes the highest of them.
function overrideLevel(listedBy, rel, fallback) {
  let level = 5;
  for (const item of listedBy) {
    if (item.file !== rel) continue;
    const seatLevel = item.seat === 'repo-config' ? 2
      : item.seat === 'outside-skill' ? 3
        : item.seat === 'hub-surface' ? (item.owner && fallback.has(item.owner) ? 4 : 3)
          : 5;
    level = Math.min(level, seatLevel);
  }
  return level;
}

// For each file and each rule, the highest level that speaks wins. Rows at that level that
// give the same action and text agree and all apply. Rows that differ are a conflict: none
// of them applies, so the rule keeps its default, and the conflict is reported once per
// rule and pair of checklists with every file it covers.
function resolveOverridePrecedence(accepted, seats, surfaces) {
  const fallback = new Set(surfaces.filter((surface) => surface.role === 'fallback').map((surface) => String(surface.label).toUpperCase()));
  const perFile = new Map();
  for (const row of accepted) {
    for (const rel of row.entry.files) {
      const level = overrideLevel(seats.get(row.file) || [], rel, fallback);
      if (!perFile.has(rel)) perFile.set(rel, new Map());
      const byId = perFile.get(rel);
      if (!byId.has(row.id)) byId.set(row.id, []);
      byId.get(row.id).push({ row, level });
    }
  }
  const conflicts = new Map();
  for (const [rel, byId] of perFile) {
    for (const [id, candidates] of byId) {
      const top = Math.min(...candidates.map((item) => item.level));
      const winners = candidates.filter((item) => item.level === top).map((item) => item.row);
      const actions = new Set(winners.map((row) => `${row.action}\0${row.text}`));
      if (actions.size === 1) {
        for (const row of winners) row.files.push(rel);
        continue;
      }
      const between = [...new Set(winners.map((row) => row.file))];
      const key = `${id}\0${between.join('\0')}`;
      if (!conflicts.has(key)) conflicts.set(key, { id, files: between, scope: [] });
      conflicts.get(key).scope.push(rel);
    }
  }
  return [...conflicts.values()];
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = { overridesReader, runOverrides };

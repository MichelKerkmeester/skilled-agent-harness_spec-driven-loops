#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ multi-probe-scenarios — table-shaped scenario expansion (non-frozen)     ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * multi-probe-scenarios.cjs — post-load expansion for table-shaped scenarios.
 *
 * A scenario file normally carries one prompt behind a `**Exact prompt**` /
 * `**Realistic user prompt**` fenced block, or an inline `Prompt: ...` line —
 * the two shapes the FROZEN `load-playbook-scenarios.cjs` parses. Some scenario
 * files instead document a BATTERY of prompts as a markdown table (a "Probe
 * set" / "Prompt variants" section, or a battery of positive/negative controls)
 * because the scenario's whole point is to exercise several related prompts at
 * once. The frozen loader has no table-parsing branch for this shape, so it
 * correctly (per its own contract) extracts `prompt: null` for the scenario —
 * every downstream stage then dispatches an EMPTY-STRING prompt, and Lane C
 * scores a vacuous `defer`/`defer` "match" instead of testing any of the real
 * sub-prompts the file actually documents.
 *
 * This module is a non-frozen sibling that runs AFTER `loadPlaybookScenarios()`
 * returns and BEFORE any scenario reaches `dispatchScenario` / the frozen
 * evaluators: it re-reads a null-prompt scenario's own source file, looks for
 * a markdown table carrying an explicit `Prompt` / `Exact Prompt` column (any
 * short alphanumeric token in column 0 is treated as the probe id — "P1",
 * "V1", "N1", ... — the id VOCABULARY is never hardcoded to one skill), and
 * replaces the single vacuous parent scenario with one real scenario per
 * table row. A table that also carries an `Expected Mode` column contributes
 * real per-probe intent gold (`hasIntentGold`/`expectedIntent`), in exactly
 * the shape `evaluateRouteGold` (frozen) already knows how to consume — the
 * same shape a `expected_intent` frontmatter scalar produces for a
 * single-prompt scenario. No table found -> the scenario passes through
 * completely unchanged (still `prompt: null`), so a genuinely promptless
 * scenario (e.g. an infra/plugin scenario tested via literal bash commands,
 * not a routable natural-language request) is never force-fitted.
 *
 * This module never edits the frozen scorer trio, never invents gold that
 * is not literally present in the scenario's own authored table, and never
 * changes what any router computes — it only changes which (and how many)
 * scenario objects the existing, unmodified pipeline scores.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('fs');
const path = require('path');
const { resolvePlaybookDir } = require('./load-playbook-scenarios.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// A column header that carries the probe's real prompt text. Mirrors the
// vocabulary the frozen loader's own `parsePromptBlock` already recognizes
// for the single-prompt shape ("Exact prompt" / bare "Prompt"), extended to
// a table header cell instead of a `**Label**` marker.
const PROMPT_HEADER_RE = /^(exact\s+)?prompt$/i;

// An optional column header carrying per-row expected workflow-mode gold.
// Absent for a battery whose "expected" column names something else (e.g.
// SA-001's cross-skill "Expected Top-1"), which is deliberately NOT treated
// as workflow-mode gold — this module never invents a translation between
// vocabularies a scenario did not author itself.
const MODE_HEADER_RE = /^expected\s+(workflow\s+)?mode(\s+resolution)?$/i;

// A probe/variant id cell: 1-3 letters then 1-3 digits (P1, V4, N15, ...).
// Deliberately skill-agnostic — no hardcoded "P"/"V" prefix set — so a new
// battery using a different id letter is picked up without a code change.
const ID_CELL_RE = /^[A-Za-z]{1,3}\d{1,3}$/;

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function readFileSafe(p) {
  try { return fs.readFileSync(p, 'utf8'); } catch { return null; }
}

/**
 * Split one markdown table line into its trimmed cell values, or null when
 * the line is not a pipe-delimited table row.
 *
 * @param {string} line - Raw source line.
 * @returns {string[]|null} Trimmed cell values, or null.
 */
function splitTableRow(line) {
  const trimmed = String(line || '').trim();
  if (!trimmed.startsWith('|')) return null;
  return trimmed.split('|').slice(1, -1).map((c) => c.trim());
}

function isSeparatorRow(cells) {
  return cells.length > 0 && cells.every((c) => /^:?-{2,}:?$/.test(c));
}

// Extract a cell's real value: the first backtick-quoted span when present
// (a battery table's convention throughout this codebase — a prompt is
// always backtick-quoted, sometimes followed by a parenthetical annotation
// like "(golden set rr-iter2-001)" OUTSIDE the backticks), else the raw
// trimmed cell.
function stripCell(value) {
  const v = String(value || '').trim();
  const m = /`([^`]*)`/.exec(v);
  return m ? m[1].trim() : v;
}

/**
 * Scan a scenario file's raw text for every markdown table carrying an
 * explicit Prompt/Exact-Prompt column, and return one {id, prompt, mode} row
 * per data row whose first cell looks like a probe/variant id. A file with
 * several qualifying tables (e.g. a positive-controls + negative-controls
 * battery) contributes rows from every one of them.
 *
 * @param {string} text - Raw scenario markdown.
 * @returns {Array<{id:string, prompt:string, mode:(string|null)}>} Extracted probe rows, in document order.
 */
function extractProbeTableRows(text) {
  const lines = String(text || '').split('\n');
  const rows = [];
  let i = 0;
  while (i < lines.length) {
    const header = splitTableRow(lines[i]);
    const sep = header ? splitTableRow(lines[i + 1] || '') : null;
    if (header && header.length >= 2 && sep && sep.length === header.length && isSeparatorRow(sep)) {
      const promptIdx = header.findIndex((h) => PROMPT_HEADER_RE.test(h));
      if (promptIdx !== -1) {
        const modeIdx = header.findIndex((h) => MODE_HEADER_RE.test(h));
        let j = i + 2;
        while (j < lines.length) {
          const cells = splitTableRow(lines[j]);
          if (!cells || cells.length !== header.length) break;
          const id = stripCell(cells[0]);
          if (ID_CELL_RE.test(id)) {
            const prompt = stripCell(cells[promptIdx]);
            const mode = modeIdx !== -1 ? stripCell(cells[modeIdx]) : '';
            if (prompt) rows.push({ id, prompt, mode: mode || null });
          }
          j += 1;
        }
        i = j;
        continue;
      }
    }
    i += 1;
  }
  return rows;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Replace every null-prompt, table-shaped scenario in a loaded scenario list
 * with one real scenario per authored probe/variant row. A scenario that is
 * not null-prompt, is a browser scenario, or whose source file carries no
 * qualifying table passes through unchanged (same object, same position).
 *
 * @param {Object} args - Expansion inputs.
 * @param {Array<Object>} args.scenarios - Scenarios as returned by `loadPlaybookScenarios()`.
 * @param {string} [args.skillRoot] - Skill root dir (used to re-resolve the playbook dir).
 * @param {string} [args.playbookDir] - Explicit playbook dir override (same contract as the loader).
 * @returns {{scenarios:Array<Object>, stats:{scenariosExpanded:number, rowsAdded:number, expandedIds:string[]}}} Expanded list + stats.
 */
function expandMultiProbeScenarios({ scenarios, skillRoot, playbookDir } = {}) {
  const stats = { scenariosExpanded: 0, rowsAdded: 0, expandedIds: [] };
  const list = Array.isArray(scenarios) ? scenarios : [];
  if (!list.length) return { scenarios: list, stats };

  let dir = null;
  try {
    dir = resolvePlaybookDir(skillRoot, playbookDir);
  } catch {
    // Loader itself already handled (or threw on) an unresolvable playbook
    // root upstream; without a directory to re-read from, expansion is a
    // no-op rather than a second failure mode.
    return { scenarios: list, stats };
  }

  const out = [];
  for (const sc of list) {
    if (!sc || sc.prompt !== null || sc.classKind === 'browser' || !sc.source || !sc.source.featureFile) {
      out.push(sc);
      continue;
    }
    const text = readFileSafe(path.join(dir, sc.source.featureFile));
    const rows = text ? extractProbeTableRows(text) : [];
    if (!rows.length) {
      out.push(sc);
      continue;
    }
    stats.scenariosExpanded += 1;
    stats.expandedIds.push(sc.scenarioId);
    for (const row of rows) {
      stats.rowsAdded += 1;
      out.push({
        ...sc,
        scenarioId: `${sc.scenarioId}.${row.id}`,
        prompt: row.prompt,
        parseWarnings: [],
        ...(row.mode ? { hasIntentGold: true, expectedIntent: row.mode, expectedIntents: [row.mode] } : {}),
        source: { ...sc.source, parentScenarioId: sc.scenarioId, subProbeId: row.id },
      });
    }
  }
  return { scenarios: out, stats };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  expandMultiProbeScenarios,
  extractProbeTableRows,
  PROMPT_HEADER_RE,
  MODE_HEADER_RE,
  ID_CELL_RE,
};

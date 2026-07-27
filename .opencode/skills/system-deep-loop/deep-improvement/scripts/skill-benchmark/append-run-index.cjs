#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ append-run-index — keep the reports index in step with the folders       ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * append-run-index.cjs — append or refresh one row in a `benchmark/reports/`
 * index.
 *
 * Indexes drift because nothing writes them: a run creates a folder, and the
 * table listing folders is updated by hand or not at all. Running this from the
 * same code path that writes the report closes that gap — the index cannot fall
 * behind a run it is written by.
 *
 * The row is keyed by folder name, so re-running a benchmark into the same folder
 * refreshes its row instead of duplicating it, and the operation is idempotent.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('fs');
const path = require('path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const COLUMNS = ['Executed', 'Folder', 'Runtime', 'Result', 'Verdict', 'Source'];
const HEADER = `| ${COLUMNS.join(' | ')} |`;
const DIVIDER = `|${COLUMNS.map(() => '---').join('|')}|`;
const NOT_RECORDED = 'not recorded';

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Escape a value for a markdown table cell: a pipe would end the cell early and
 * a newline would end the row.
 *
 * @param {string} value - Raw cell text.
 * @returns {string} Cell-safe text.
 */
function cell(value) {
  const text = value === undefined || value === null || value === '' ? NOT_RECORDED : String(value);
  return text.replace(/\|/g, '\\|').replace(/\n+/g, ' ');
}

/**
 * Read the execution date back out of a folder name in the dated grammar. A
 * folder that predates the grammar has no date to report, and says so.
 *
 * @param {string} folderName - Run folder name.
 * @returns {string} ISO date, or a not-recorded marker.
 */
function dateFromFolder(folderName) {
  const match = /^(\d{4}-\d{2}-\d{2})--/.exec(folderName);
  return match ? match[1] : NOT_RECORDED;
}

/**
 * The default index body, used when a reports directory has no index yet.
 *
 * @param {string} skillId - Owning skill id.
 * @returns {string} Markdown document with an empty table.
 */
function emptyIndex(skillId) {
  return [
    '---',
    `title: "${skillId} Benchmark Reports"`,
    `description: "Index of curated benchmark run reports for ${skillId}, one row per run folder."`,
    'trigger_phrases:',
    `  - "${skillId} benchmark reports"`,
    `  - "${skillId} benchmark index"`,
    'importance_tier: "important"',
    'contextType: "general"',
    '---',
    '',
    `# ${skillId} Benchmark Reports`,
    '',
    '> Curated reports derived from completed benchmark runs, newest first. Raw execution evidence stays in the packet that produced it, named in each run\'s `source.md`.',
    '',
    '---',
    '',
    '## 1. OVERVIEW',
    '',
    'Each row below is one run folder. Rows are written by the benchmark harness at the moment it writes the report, so this table cannot fall behind the folders beside it.',
    '',
    '## 2. RUN INDEX',
    '',
    HEADER,
    DIVIDER,
    '',
    '## 3. STORAGE RULE',
    '',
    `Run folders are named \`<YYYY-MM-DD>--<subject>--<variant>\`, dated by execution. Keep curated summaries and machine-readable result tables here, and raw transcripts and copied artifacts in the source packet. A run whose result changes gets a new folder rather than overwriting a prior one.`,
    '',
  ].join('\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Compose the index row for one run, entirely from recorded values.
 *
 * @param {Object} params - Row inputs.
 * @param {string} params.folderName - Run folder name.
 * @param {Object} params.report - Parsed report object.
 * @param {string} [params.corpus] - Repo-relative corpus path.
 * @returns {string} One markdown table row.
 */
function buildRow({ folderName, report, corpus }) {
  const rows = Array.isArray(report.scenarioRows) ? report.scenarioRows : [];
  const tally = new Map();
  for (const row of rows) {
    const explicit = row.verdict == null ? null : String(row.verdict).toUpperCase();
    let verdict;
    if (explicit) verdict = explicit;
    else if (row.applicable === false) verdict = 'SKIP';
    else verdict = row.firstFailingStage == null ? 'PASS' : 'FAIL';
    tally.set(verdict, (tally.get(verdict) || 0) + 1);
  }
  const result = [...tally.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([verdict, count]) => `${count} ${verdict}`)
    .join(', ');

  const runtime = [report.executor, report.model, report.variant].filter(Boolean).join(' ')
    || report.traceMode;
  const verdictCell = report.aggregateScore != null
    ? `**${report.verdict}** ${report.aggregateScore}/100`
    : `**${report.verdict}**`;

  return `| ${[
    cell(dateFromFolder(folderName)),
    `[\`${folderName}/\`](./${folderName}/)`,
    cell(runtime),
    cell(result),
    cell(verdictCell),
    corpus ? `\`${corpus}\`` : NOT_RECORDED,
  ].join(' | ')} |`;
}

/**
 * Append or refresh this run's row in the reports index, creating the index when
 * the directory has none. Newest rows sort to the top.
 *
 * @param {Object} params - Update inputs.
 * @param {string} params.reportsDir - The `benchmark/reports/` directory.
 * @param {string} params.folderName - Run folder name inside it.
 * @param {string} params.skillId - Owning skill id, for a fresh index.
 * @param {Object} params.report - Parsed report object.
 * @param {string} [params.corpus] - Repo-relative corpus path.
 * @returns {{indexPath:string, created:boolean, replaced:boolean}} What changed.
 */
function appendRunIndex({ reportsDir, folderName, skillId, report, corpus }) {
  const indexPath = path.join(reportsDir, 'README.md');
  const created = !fs.existsSync(indexPath);
  let body = created ? emptyIndex(skillId) : fs.readFileSync(indexPath, 'utf8');

  const row = buildRow({ folderName, report, corpus });
  const lines = body.split('\n');
  const folderKey = `](./${folderName}/)`;

  const existing = lines.findIndex((line) => line.startsWith('|') && line.includes(folderKey));
  if (existing !== -1) {
    lines[existing] = row;
    fs.writeFileSync(indexPath, lines.join('\n'));
    return { indexPath, created, replaced: true };
  }

  // Insert directly beneath the divider so the newest run reads first. An index
  // whose table was removed or renamed gets one appended rather than being
  // silently skipped, so a run is never recorded nowhere.
  const divider = lines.findIndex((line) => line.replace(/\s/g, '') === DIVIDER);
  if (divider === -1) {
    lines.push('', HEADER, DIVIDER, row, '');
  } else {
    lines.splice(divider + 1, 0, row);
  }
  fs.writeFileSync(indexPath, lines.join('\n'));
  return { indexPath, created, replaced: false };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = { appendRunIndex, buildRow, emptyIndex, COLUMNS };

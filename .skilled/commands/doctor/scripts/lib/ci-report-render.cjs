// ───────────────────────────────────────────────────────────────────
// MODULE: CI Report Rendering
// ───────────────────────────────────────────────────────────────────
'use strict';

// The report document and its two renderings: the JSON `/doctor:ci report` hands to a
// machine and the table it prints for a person, both built from the same readings so the
// two never disagree. The not-checked list travels with the document, so a clean row is
// never read as a pass for a rule no parser checks.
//
// The table is fixed-width by column and the purpose is cut to one width, so a long
// sentence never widens the row past the terminal. A value is a state here, never a
// variable value.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const { REPO_ROOT } = require('./ci-profile.cjs');
const { variableState } = require('./ci-report-sources.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const PURPOSE_COLUMN_WIDTH = 90;

const NOT_CHECKED = ['path-parity', 'shell-strict-mode', 'matrix-guidance'];

// ─────────────────────────────────────────────────────────────────────────────
// 3. REPORT DOCUMENT
// ─────────────────────────────────────────────────────────────────────────────

function variableMap(variables, names) {
  const map = {};
  for (const name of names) map[name] = variableState(variables, name);
  return map;
}

function buildReport(variables, resolved, loaded, names, loadedProfile) {
  return {
    repoRoot: REPO_ROOT,
    profile: {
      source: loadedProfile.source,
      path: loadedProfile.display,
      ...(loadedProfile.ignored ? { ignored: loadedProfile.ignored } : {}),
    },
    workflowCount: loaded.rows.length,
    variables: variableMap(variables, names),
    newestNonRebuildSha: resolved.sha,
    newestNonRebuildReason: resolved.reason,
    notChecked: NOT_CHECKED,
    errors: loaded.errors,
    workflows: loaded.rows,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. TEXT TABLE
// ─────────────────────────────────────────────────────────────────────────────

function shorten(text, width) {
  if (!text) return '-';
  return text.length > width ? `${text.slice(0, width - 3).trimEnd()}...` : text;
}

function variableSummary(report, variables) {
  if (!variables.known) return `unknown (${variables.reason})`;
  const set = Object.entries(report.variables).filter(([, state]) => state !== 'unset');
  return set.length === 0 ? 'none' : set.map(([name, state]) => `${name}=${state}`).join(' ');
}

function renderTable(report, variables) {
  const jobCount = report.workflows.reduce((sum, row) => sum + row.jobs, 0);
  const { ignored } = report.profile;
  const lines = [
    'CI WORKFLOW REPORT',
    `workflows: ${report.workflowCount}  jobs: ${jobCount}`,
    `variables: ${variableSummary(report, variables)}`,
    `profile: ${report.profile.source}`
      + `${report.profile.path ? ` (${report.profile.path})` : ''}`
      + `${ignored ? `; ignored ${ignored.path}, written for ${ignored.repository}, this repository is ${ignored.current || 'unknown'}` : ''}`,
    `newest non-rebuild SHA: ${report.newestNonRebuildSha || 'none'} (${report.newestNonRebuildReason})`,
    '',
    '| Workflow | Switch | Jobs | Events | Filters | Drift flags | Purpose |',
    '|----------|--------|------|--------|---------|-------------|---------|',
  ];
  for (const row of report.workflows) {
    lines.push(
      `| \`${row.file}\` | ${row.switch} | ${row.jobs} | ${row.events.join(', ') || '-'} | `
        + `${row.pathFilterCount} | ${row.flags.join(', ') || 'none'} | `
        + `${shorten(row.purpose, PURPOSE_COLUMN_WIDTH)} |`,
    );
  }
  lines.push('', `not checked (the workflow standards packet owns these rules): ${report.notChecked.join(', ')}`);
  return lines;
}

function statusLine(report) {
  if (report.errors.length > 0) return `STATUS=FAIL errors=${report.errors.length}`;
  const count = (state) => report.workflows.filter((row) => row.switch === state).length;
  const counts = ['on', 'off', 'partial', 'missing', 'unknown']
    .map((state) => `${state}=${count(state)}`);
  return `STATUS=OK workflows=${report.workflowCount} ${counts.join(' ')}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  buildReport,
  renderTable,
  statusLine,
};

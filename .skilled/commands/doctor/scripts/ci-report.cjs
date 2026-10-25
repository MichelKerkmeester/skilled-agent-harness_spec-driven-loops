#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: CI Workflow Report
// ───────────────────────────────────────────────────────────────────
'use strict';

// Read-only inventory of .github/workflows: every workflow with its switch state,
// triggers, path filters, README purpose and drift flags, plus the newest commit on
// main that is not a trigger-index rebuild.
//
// A switch is read from each job's `if:` expression. The expression ships with the
// workflow, so a clone that carries the file carries the answer, and no group table
// or spec folder is a second copy that could drift. The repository variable values
// come from `gh variable list` and are reduced to a state. A value is never printed.
//
// The newest non-rebuild commit is found by commit message, not by workflow name.
// A rebuild commit also starts downstream runs, so dropping the rebuild workflow's
// runs would leave the rebuild commit's SHA in the list, and that SHA carries no
// statuses worth reading.
//
// Only rules a parser can check are flagged. The prose rules are listed in
// `notChecked`, so a clean row is never read as a pass for them.
//
// Usage: ci-report.cjs [--json] [--sha=<40 hex>] [--no-gh]
//   --json      print JSON only
//   --sha=SHA   skip the SHA resolution and report this commit
//   --no-gh     make no gh call: every variable reads unknown and no SHA is resolved
// Exit codes: 0 report printed, 1 a workflow failed to parse, 2 bad argument

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const YAML = require('yaml');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const REPO_ROOT = path.resolve(__dirname, '../../../..');
const WORKFLOWS = path.join(REPO_ROOT, '.github/workflows');
const README = path.join(WORKFLOWS, 'README.md');

const USAGE = 'Usage: node .skilled/commands/doctor/scripts/ci-report.cjs [--json] [--sha=<40 hex>] [--no-gh]';

const SWITCH_VARIABLES = [
  'SKILLED_CI',
  'SKILLED_CI_TESTS',
  'SKILLED_CI_REPORTS',
  'SKILLED_CI_REVIEW',
  'SKILLED_CI_FRESHNESS',
  'SKILLED_CI_MESSAGES',
];

// The master switch and every group variable share this prefix, so a new group
// needs no change here.
const SWITCH_PATTERN = /\bvars\.(SKILLED_CI(?:_[A-Z0-9]+)*)\b/g;
const MASTER_VARIABLE = 'SKILLED_CI';

// The auto-merge workflow acts only on Dependabot's own pull requests, so it carries
// no switch by design and reports on.
const EXEMPT_FILES = new Set(['dependabot-auto-merge.yml']);

const REBUILD_TRAILER = 'Trigger-Index-Rebuild: ci';
const RUN_LIMIT = 100;
const MAX_BUFFER = 16 * 1024 * 1024;
const PURPOSE_COLUMN_WIDTH = 90;

const NOT_CHECKED = ['path-parity', 'shell-strict-mode', 'matrix-guidance'];

const FLAG_ORDER = [
  'timeout-missing',
  'permissions-missing',
  'concurrency-missing',
  'switch-missing',
  'uses-unpinned',
  'readme-row-missing',
  'pull-request-target',
  'event-in-run',
];

const SHA_PATTERN = /^[0-9a-f]{40}$/;
const PINNED_USES = /@[0-9a-f]{40}$/;
const EVENT_IN_RUN = /\$\{\{\s*github\.event/;

// ─────────────────────────────────────────────────────────────────────────────
// 3. ARGUMENTS
// ─────────────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const options = { json: false, sha: null, noGh: false };
  for (const arg of argv) {
    if (arg === '--json') {
      options.json = true;
    } else if (arg === '--no-gh') {
      options.noGh = true;
    } else if (arg.startsWith('--sha=')) {
      const sha = arg.slice('--sha='.length);
      if (!SHA_PATTERN.test(sha)) throw new Error(`--sha needs 40 lowercase hex characters: ${arg}`);
      options.sha = sha;
    } else {
      throw new Error(`unknown argument: ${arg}`);
    }
  }
  return options;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. GH ACCESS
// ─────────────────────────────────────────────────────────────────────────────

function firstLine(text) {
  return String(text || '').split('\n').map((line) => line.trim()).find(Boolean) || '';
}

// Arguments go in as an array, never through a shell, so a value read from gh
// output cannot change the command that reads the next one.
function runGh(args) {
  const result = spawnSync('gh', args, { cwd: REPO_ROOT, encoding: 'utf8', maxBuffer: MAX_BUFFER });
  if (result.error) {
    return { ok: false, reason: result.error.code === 'ENOENT' ? 'gh is not installed' : result.error.message };
  }
  if (result.status !== 0) {
    return { ok: false, reason: firstLine(result.stderr) || `gh exited ${result.status}` };
  }
  return { ok: true, stdout: result.stdout };
}

function parseJsonList(text) {
  try {
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. VARIABLE STATES
// ─────────────────────────────────────────────────────────────────────────────

// Reads the repository variables only. The expression engine compares strings
// without regard to case, so OFF disables a job exactly as off does.
function readVariables(noGh) {
  if (noGh) return { known: false, states: new Map(), reason: 'gh disabled by --no-gh' };
  const listed = runGh(['variable', 'list', '--json', 'name,value']);
  if (!listed.ok) return { known: false, states: new Map(), reason: listed.reason };
  const rows = parseJsonList(listed.stdout);
  if (!rows) return { known: false, states: new Map(), reason: 'gh variable list printed no JSON list' };
  const states = new Map();
  for (const row of rows) {
    if (row && typeof row.name === 'string') {
      states.set(row.name, String(row.value).toLowerCase() === 'off' ? 'off' : 'other');
    }
  }
  return { known: true, states, reason: null };
}

function variableState(variables, name) {
  if (!variables.known) return 'unknown';
  return variables.states.get(name) || 'unset';
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. NEWEST NON-REBUILD COMMIT
// ─────────────────────────────────────────────────────────────────────────────

function isRebuildMessage(message) {
  const lines = String(message).split('\n').map((line) => line.trim()).filter(Boolean);
  return lines.length > 0 && lines[lines.length - 1] === REBUILD_TRAILER;
}

function newestFirstShas(runs) {
  const seen = new Set();
  const shas = [];
  const ordered = runs
    .filter((run) => run && SHA_PATTERN.test(String(run.headSha)))
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  for (const run of ordered) {
    if (!seen.has(run.headSha)) {
      seen.add(run.headSha);
      shas.push(run.headSha);
    }
  }
  return shas;
}

function resolveNewestNonRebuildSha(options) {
  if (options.sha) return { sha: options.sha, reason: 'given by --sha' };
  if (options.noGh) return { sha: null, reason: 'gh disabled by --no-gh' };

  const listed = runGh(['run', 'list', '--branch', 'main', '--limit', String(RUN_LIMIT), '--json', 'headSha,createdAt']);
  if (!listed.ok) return { sha: null, reason: `gh run list failed: ${listed.reason}` };
  const runs = parseJsonList(listed.stdout);
  if (!runs) return { sha: null, reason: 'gh run list printed no JSON list' };

  const excluded = [];
  for (const sha of newestFirstShas(runs)) {
    const read = runGh(['api', `repos/{owner}/{repo}/commits/${sha}`, '--jq', '.commit.message']);
    // A guess here would name a commit nobody checked, so a failed read stops the search.
    if (!read.ok) return { sha: null, reason: `gh api failed for ${sha}: ${read.reason}` };
    if (isRebuildMessage(read.stdout)) {
      excluded.push(sha);
      continue;
    }
    return { sha, reason: excluded.length > 0 ? `excluded rebuild SHAs: ${excluded.join(', ')}` : 'no rebuild commit above it' };
  }
  return { sha: null, reason: `no non-rebuild SHA in the last ${RUN_LIMIT} runs` };
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. README PURPOSES
// ─────────────────────────────────────────────────────────────────────────────

function firstSentence(text) {
  const match = text.match(/^(.*?\.)(?:\s|$)/);
  return match ? match[1] : text;
}

// The contents table is the only README table with a Workflow and a
// Responsibility column. Each row starts with the file name in backticks.
function readReadmePurposes() {
  const purposes = new Map();
  let text;
  try {
    text = fs.readFileSync(README, 'utf8');
  } catch {
    return purposes;
  }
  let inTable = false;
  for (const line of text.split('\n')) {
    if (/^\|\s*Workflow\s*\|\s*Responsibility\s*\|/.test(line)) {
      inTable = true;
      continue;
    }
    if (!inTable) continue;
    if (!line.startsWith('|')) break;
    const row = line.match(/^\|\s*`([^`]+)`\s*\|\s*(.*?)\s*\|\s*$/);
    if (row) purposes.set(row[1], firstSentence(row[2]));
  }
  return purposes;
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. WORKFLOW ANALYSIS
// ─────────────────────────────────────────────────────────────────────────────

function isMapping(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function eventsOf(doc) {
  const on = doc.on;
  if (typeof on === 'string') return [on];
  if (Array.isArray(on)) return on.map(String);
  if (isMapping(on)) return Object.keys(on);
  return [];
}

// Counts the entries of every paths and paths-ignore list across the triggers.
function pathFilterCount(doc) {
  if (!isMapping(doc.on)) return 0;
  let count = 0;
  for (const trigger of Object.values(doc.on)) {
    if (!isMapping(trigger)) continue;
    for (const key of ['paths', 'paths-ignore']) {
      if (Array.isArray(trigger[key])) count += trigger[key].length;
    }
  }
  return count;
}

// A job carries a switch when its `if:` string names the master or a group variable.
// The whole string is searched, so a switch ANDed onto another condition, a quoted
// `${{ }}` string and a folded block all read the same.
function analyzeJob(job, variables) {
  const condition = isMapping(job) && typeof job.if === 'string' ? job.if : '';
  const names = [...new Set([...condition.matchAll(SWITCH_PATTERN)].map((match) => match[1]))];
  if (names.length === 0) return { carriesSwitch: false, state: 'on', groups: [] };
  const states = names.map((name) => variableState(variables, name));
  let state = 'on';
  if (states.includes('off')) state = 'off';
  else if (states.includes('unknown')) state = 'unknown';
  return { carriesSwitch: true, state, groups: names.filter((name) => name !== MASTER_VARIABLE) };
}

function workflowSwitch(file, analyzed) {
  const switched = analyzed.filter((job) => job.carriesSwitch);
  if (switched.length === 0) return EXEMPT_FILES.has(file) ? 'on' : 'missing';
  const states = new Set(analyzed.map((job) => job.state));
  if (states.size === 1) return [...states][0];
  return states.has('unknown') ? 'unknown' : 'partial';
}

function collectUses(jobs) {
  const uses = [];
  for (const job of jobs) {
    if (!isMapping(job)) continue;
    if (typeof job.uses === 'string') uses.push(job.uses);
    for (const step of Array.isArray(job.steps) ? job.steps : []) {
      if (isMapping(step) && typeof step.uses === 'string') uses.push(step.uses);
    }
  }
  return uses;
}

function hasEventInRun(jobs) {
  return jobs.some((job) => isMapping(job) && Array.isArray(job.steps)
    && job.steps.some((step) => isMapping(step) && typeof step.run === 'string' && EVENT_IN_RUN.test(step.run)));
}

function analyzeWorkflow(file, doc, variables, purposes) {
  const jobs = isMapping(doc.jobs) ? Object.values(doc.jobs) : [];
  const analyzed = jobs.map((job) => analyzeJob(job, variables));
  const events = eventsOf(doc);
  const exempt = EXEMPT_FILES.has(file) && !analyzed.some((job) => job.carriesSwitch);

  const raised = new Set();
  if (!jobs.every((job) => isMapping(job) && job['timeout-minutes'] !== undefined)) raised.add('timeout-missing');
  if (!('permissions' in doc)) raised.add('permissions-missing');
  if (!('concurrency' in doc)) raised.add('concurrency-missing');
  if (!exempt && (jobs.length === 0 || analyzed.some((job) => !job.carriesSwitch))) raised.add('switch-missing');
  if (collectUses(jobs).some((uses) => !uses.startsWith('./') && !PINNED_USES.test(uses))) raised.add('uses-unpinned');
  if (!purposes.has(file)) raised.add('readme-row-missing');
  if (events.includes('pull_request_target')) raised.add('pull-request-target');
  if (hasEventInRun(jobs)) raised.add('event-in-run');

  return {
    file,
    purpose: purposes.get(file) || null,
    events,
    pathFilterCount: pathFilterCount(doc),
    jobs: jobs.length,
    switch: workflowSwitch(file, analyzed),
    groups: [...new Set(analyzed.flatMap((job) => job.groups))].sort(),
    timeout: !raised.has('timeout-missing'),
    permissions: 'permissions' in doc,
    concurrency: 'concurrency' in doc,
    flags: FLAG_ORDER.filter((flag) => raised.has(flag)),
  };
}

function loadWorkflows(variables, purposes) {
  const rows = [];
  const errors = [];
  const files = fs.existsSync(WORKFLOWS)
    ? fs.readdirSync(WORKFLOWS).filter((name) => name.endsWith('.yml')).sort()
    : [];
  for (const file of files) {
    let doc;
    try {
      doc = YAML.parse(fs.readFileSync(path.join(WORKFLOWS, file), 'utf8'));
    } catch (error) {
      errors.push({ file, message: firstLine(error.message) });
      continue;
    }
    if (!isMapping(doc)) {
      errors.push({ file, message: 'the file is not a YAML mapping' });
      continue;
    }
    rows.push(analyzeWorkflow(file, doc, variables, purposes));
  }
  return { rows, errors };
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. OUTPUT
// ─────────────────────────────────────────────────────────────────────────────

function variableMap(variables) {
  const map = {};
  for (const name of SWITCH_VARIABLES) map[name] = variableState(variables, name);
  return map;
}

function buildReport(variables, resolved, loaded) {
  return {
    repoRoot: REPO_ROOT,
    workflowCount: loaded.rows.length,
    variables: variableMap(variables),
    newestNonRebuildSha: resolved.sha,
    newestNonRebuildReason: resolved.reason,
    notChecked: NOT_CHECKED,
    errors: loaded.errors,
    workflows: loaded.rows,
  };
}

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
  const lines = [
    'CI WORKFLOW REPORT',
    `workflows: ${report.workflowCount}  jobs: ${jobCount}`,
    `variables: ${variableSummary(report, variables)}`,
    `newest non-rebuild SHA: ${report.newestNonRebuildSha || 'none'} (${report.newestNonRebuildReason})`,
    '',
    '| Workflow | Switch | Jobs | Events | Filters | Drift flags | Purpose |',
    '|----------|--------|------|--------|---------|-------------|---------|',
  ];
  for (const row of report.workflows) {
    lines.push(`| \`${row.file}\` | ${row.switch} | ${row.jobs} | ${row.events.join(', ') || '-'} | ${row.pathFilterCount} | ${row.flags.join(', ') || 'none'} | ${shorten(row.purpose, PURPOSE_COLUMN_WIDTH)} |`);
  }
  lines.push('', `not checked (the workflow standards packet owns these rules): ${report.notChecked.join(', ')}`);
  return lines;
}

function statusLine(report) {
  if (report.errors.length > 0) return `STATUS=FAIL errors=${report.errors.length}`;
  const count = (state) => report.workflows.filter((row) => row.switch === state).length;
  return `STATUS=OK workflows=${report.workflowCount} on=${count('on')} off=${count('off')} partial=${count('partial')} missing=${count('missing')} unknown=${count('unknown')}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. MAIN
// ─────────────────────────────────────────────────────────────────────────────

function main(argv) {
  let options;
  try {
    options = parseArgs(argv);
  } catch (error) {
    process.stderr.write(`ERROR: ${error.message}\n${USAGE}\n`);
    return 2;
  }

  const variables = readVariables(options.noGh);
  if (!variables.known && !options.noGh) {
    process.stderr.write(`note: variable states are unknown: ${variables.reason}\n`);
  }
  const resolved = resolveNewestNonRebuildSha(options);
  const loaded = loadWorkflows(variables, readReadmePurposes());
  const report = buildReport(variables, resolved, loaded);

  for (const failure of loaded.errors) {
    process.stderr.write(`ERROR: ${failure.file}: ${failure.message}\n`);
  }
  if (options.json) {
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  } else {
    process.stdout.write(`${[...renderTable(report, variables), statusLine(report)].join('\n')}\n`);
  }
  return loaded.errors.length > 0 ? 1 : 0;
}

process.exitCode = main(process.argv.slice(2));

#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: CI Workflow Report
// ───────────────────────────────────────────────────────────────────
'use strict';

// Read-only inventory of .github/workflows: every workflow with its switch state,
// triggers, path filters, README purpose and drift flags, plus the newest commit on
// the default branch that is not a trigger-index rebuild.
//
// A switch is read from each job's `if:` expression by its shape, `vars.NAME != 'off'`,
// so any repository's switch names are read and none is assumed. The expression ships
// with the workflow, so a clone that carries the file carries the answer. The
// repository variable values come from `gh variable list` and are reduced to a state.
// A value is never printed.
//
// Every repository convention comes from the CI profile (lib/ci-profile.cjs): which
// branch to read runs from, whether every job must carry a switch, which workflows are
// exempt, which README holds the purpose rows and which commit trailer marks a rebuild.
// With no profile none of those is checked, so a repository is never flagged for
// lacking this repository's conventions.
//
// The newest non-rebuild commit is found by commit message, not by workflow name.
// A rebuild commit carries `[skip ci]` and normally starts no run. If one ever starts
// a run anyway, its SHA would lead the run list with no statuses worth reading, so
// the search skips any commit whose message ends with the profile's rebuild trailer.
//
// Only rules a parser can check are flagged. The prose rules are listed in
// `notChecked`, so a clean row is never read as a pass for them.
//
// Usage: ci-report.cjs [--json] [--sha=<40 hex>] [--no-gh] [--profile <path>]
//   --json            print JSON only
//   --sha=SHA         skip the SHA resolution and report this commit
//   --no-gh           make no gh call: every variable reads unknown and no SHA is resolved
//   --profile <path>  read the CI profile from this file instead of discovering it
// Exit codes: 0 report printed, 1 a workflow failed to parse, 2 bad argument,
// 3 the CI profile is missing or invalid

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const YAML = require('yaml');

const { ProfileError, declaredSwitches, loadProfile } = require('./lib/ci-profile.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const REPO_ROOT = path.resolve(__dirname, '../../../..');
const WORKFLOWS = path.join(REPO_ROOT, '.github/workflows');

const USAGE = 'Usage: node .skilled/commands/doctor/scripts/ci-report.cjs [--json] [--sha=<40 hex>] [--no-gh] [--profile <path>]';

// A switch is a variable compared against off. The expression engine compares strings
// without regard to case, so OFF and "off" read the same as 'off'.
const SWITCH_SHAPE = /\bvars\.([A-Za-z_][A-Za-z0-9_]*)\s*!=\s*(['"])off\2/gi;
const FALLBACK_BRANCH = 'main';
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
  const options = { json: false, sha: null, noGh: false, profile: null };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--json') {
      options.json = true;
    } else if (arg === '--no-gh') {
      options.noGh = true;
    } else if (arg === '--profile' || arg.startsWith('--profile=')) {
      const value = arg === '--profile' ? argv[(index += 1)] : arg.slice('--profile='.length);
      if (!value) throw new Error('--profile needs a path');
      options.profile = value;
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

/**
 * The branch the repository integrates on: the profile's, else the one GitHub names as
 * the default, else main.
 *
 * @param {Object} profile - A normalized CI profile.
 * @returns {{branch:string, source:string}} source is profile, github or fallback.
 */
function resolveDefaultBranch(profile) {
  if (profile.defaultBranch) return { branch: profile.defaultBranch, source: 'profile' };
  const viewed = runGh(['repo', 'view', '--json', 'defaultBranchRef', '--jq', '.defaultBranchRef.name']);
  const name = viewed.ok ? firstLine(viewed.stdout) : '';
  return name ? { branch: name, source: 'github' } : { branch: FALLBACK_BRANCH, source: 'fallback' };
}

function isRebuildMessage(message, trailer) {
  const lines = String(message).split('\n').map((line) => line.trim()).filter(Boolean);
  return lines.length > 0 && lines[lines.length - 1] === trailer;
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

function resolveNewestNonRebuildSha(options, profile) {
  if (options.sha) return { sha: options.sha, reason: 'given by --sha' };
  if (options.noGh) return { sha: null, reason: 'gh disabled by --no-gh' };

  const { branch } = resolveDefaultBranch(profile);
  const listed = runGh(['run', 'list', '--branch', branch, '--limit', String(RUN_LIMIT), '--json', 'headSha,createdAt']);
  if (!listed.ok) return { sha: null, reason: `gh run list failed: ${listed.reason}` };
  const runs = parseJsonList(listed.stdout);
  if (!runs) return { sha: null, reason: 'gh run list printed no JSON list' };

  const shas = newestFirstShas(runs);
  // With no trailer to look for, no run can be a rebuild, so the newest run stands.
  if (!profile.rebuildTrailer) {
    return shas.length > 0
      ? { sha: shas[0], reason: 'the CI profile names no rebuild trailer' }
      : { sha: null, reason: `no run in the last ${RUN_LIMIT} runs` };
  }

  const excluded = [];
  for (const sha of shas) {
    const read = runGh(['api', `repos/{owner}/{repo}/commits/${sha}`, '--jq', '.commit.message']);
    // A guess here would name a commit nobody checked, so a failed read stops the search.
    if (!read.ok) return { sha: null, reason: `gh api failed for ${sha}: ${read.reason}` };
    if (isRebuildMessage(read.stdout, profile.rebuildTrailer)) {
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
// Responsibility column. Each row starts with the file name in backticks. A profile
// that names no README gets no purposes and no README check.
function readReadmePurposes(profile) {
  const purposes = new Map();
  if (!profile.workflowsReadme) return purposes;
  let text;
  try {
    text = fs.readFileSync(path.join(REPO_ROOT, profile.workflowsReadme.path), 'utf8');
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

/**
 * The switch variables a job's `if:` string compares against off. The whole string is
 * searched, so a switch ANDed onto another condition, a quoted `${{ }}` string and a
 * folded block all read the same.
 *
 * @param {*} job - One parsed job.
 * @returns {string[]} The variable names, in the order they appear.
 */
function switchNames(job) {
  const condition = isMapping(job) && typeof job.if === 'string' ? job.if : '';
  return [...new Set([...condition.matchAll(SWITCH_SHAPE)].map((match) => match[1]))];
}

function analyzeJob(job, variables, profile) {
  const names = switchNames(job);
  if (names.length === 0) return { carriesSwitch: false, state: 'on', groups: [] };
  const states = names.map((name) => variableState(variables, name));
  let state = 'on';
  if (states.includes('off')) state = 'off';
  else if (states.includes('unknown')) state = 'unknown';
  return { carriesSwitch: true, state, groups: names.filter((name) => name !== profile.switch.master) };
}

// A workflow with no switch is missing one only where the profile requires a switch on
// every job and does not exempt the file. Anywhere else nothing can skip it, so it is on.
function workflowSwitch(file, analyzed, profile) {
  const switched = analyzed.filter((job) => job.carriesSwitch);
  if (switched.length === 0) return profile.switch.required && !profile.switch.exempt.includes(file) ? 'missing' : 'on';
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

function analyzeWorkflow(file, doc, variables, purposes, profile) {
  const jobs = isMapping(doc.jobs) ? Object.values(doc.jobs) : [];
  const analyzed = jobs.map((job) => analyzeJob(job, variables, profile));
  const events = eventsOf(doc);
  const exempt = !profile.switch.required
    || (profile.switch.exempt.includes(file) && !analyzed.some((job) => job.carriesSwitch));

  const raised = new Set();
  if (!jobs.every((job) => isMapping(job) && job['timeout-minutes'] !== undefined)) raised.add('timeout-missing');
  if (!('permissions' in doc)) raised.add('permissions-missing');
  if (!('concurrency' in doc)) raised.add('concurrency-missing');
  if (!exempt && (jobs.length === 0 || analyzed.some((job) => !job.carriesSwitch))) raised.add('switch-missing');
  if (collectUses(jobs).some((uses) => !uses.startsWith('./') && !PINNED_USES.test(uses))) raised.add('uses-unpinned');
  if (profile.workflowsReadme && !purposes.has(file)) raised.add('readme-row-missing');
  if (events.includes('pull_request_target')) raised.add('pull-request-target');
  if (hasEventInRun(jobs)) raised.add('event-in-run');

  return {
    file,
    purpose: purposes.get(file) || null,
    events,
    pathFilterCount: pathFilterCount(doc),
    jobs: jobs.length,
    switch: workflowSwitch(file, analyzed, profile),
    groups: [...new Set(analyzed.flatMap((job) => job.groups))].sort(),
    timeout: !raised.has('timeout-missing'),
    permissions: 'permissions' in doc,
    concurrency: 'concurrency' in doc,
    flags: FLAG_ORDER.filter((flag) => raised.has(flag)),
  };
}

/**
 * Parse every workflow file once. A file that does not parse is named in errors and
 * every other file is still returned.
 *
 * @returns {{docs:Array<{file:string, doc:Object}>, errors:Array<{file:string, message:string}>}}
 */
function parseWorkflows() {
  const docs = [];
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
    docs.push({ file, doc });
  }
  return { docs, errors };
}

function loadWorkflows(parsed, variables, purposes, profile) {
  const rows = parsed.docs.map(({ file, doc }) => analyzeWorkflow(file, doc, variables, purposes, profile));
  return { rows, errors: parsed.errors };
}

/**
 * The switch variables to report: the profile's declared names in their written order,
 * then any other name the workflows compare against off, sorted.
 *
 * @param {Object} profile - A normalized CI profile.
 * @param {Array<{doc:Object}>} docs - The parsed workflows.
 * @returns {string[]} The names.
 */
function switchVariables(profile, docs) {
  const declared = declaredSwitches(profile);
  const found = new Set();
  for (const { doc } of docs) {
    for (const job of isMapping(doc.jobs) ? Object.values(doc.jobs) : []) {
      for (const name of switchNames(job)) found.add(name);
    }
  }
  return [...declared, ...[...found].filter((name) => !declared.includes(name)).sort()];
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. OUTPUT
// ─────────────────────────────────────────────────────────────────────────────

function variableMap(variables, names) {
  const map = {};
  for (const name of names) map[name] = variableState(variables, name);
  return map;
}

function buildReport(variables, resolved, loaded, names, loadedProfile) {
  return {
    repoRoot: REPO_ROOT,
    profile: { source: loadedProfile.source, path: loadedProfile.display },
    workflowCount: loaded.rows.length,
    variables: variableMap(variables, names),
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
    `profile: ${report.profile.source}${report.profile.path ? ` (${report.profile.path})` : ''}`,
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

  let loadedProfile;
  try {
    loadedProfile = loadProfile({ cliPath: options.profile, root: REPO_ROOT });
  } catch (error) {
    if (!(error instanceof ProfileError)) throw error;
    process.stderr.write(`ERROR: ${error.message}\n`);
    return 3;
  }
  if (loadedProfile.errors.length > 0) {
    for (const fault of loadedProfile.errors) process.stderr.write(`ERROR: CI profile ${loadedProfile.display}: ${fault.message}\n`);
    return 3;
  }
  const { profile } = loadedProfile;

  const variables = readVariables(options.noGh);
  if (!variables.known && !options.noGh) {
    process.stderr.write(`note: variable states are unknown: ${variables.reason}\n`);
  }
  const resolved = resolveNewestNonRebuildSha(options, profile);
  const parsed = parseWorkflows();
  const loaded = loadWorkflows(parsed, variables, readReadmePurposes(profile), profile);
  const report = buildReport(variables, resolved, loaded, switchVariables(profile, parsed.docs), loadedProfile);

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

// ─────────────────────────────────────────────────────────────────────────────
// 11. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

// The toggle plans against the same parse and the same switch reading, so both routes
// agree on which jobs a variable reaches.
module.exports = {
  REPO_ROOT,
  WORKFLOWS,
  isMapping,
  parseJsonList,
  parseWorkflows,
  readVariables,
  resolveDefaultBranch,
  runGh,
  switchNames,
  switchVariables,
  variableState,
};

if (require.main === module) process.exitCode = main(process.argv.slice(2));

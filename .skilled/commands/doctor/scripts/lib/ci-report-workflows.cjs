// ───────────────────────────────────────────────────────────────────
// MODULE: CI Report Workflow Analysis
// ───────────────────────────────────────────────────────────────────
'use strict';

// Everything about the workflow files themselves: the discovery of .github/workflows, the
// YAML parse, the switch state per job, the drift flags, the purpose column read from the
// workflows README, and the switch names the report lists.
//
// A switch is recognized by its shape, `vars.NAME != 'off'`, so any repository's switch
// names are read and none is assumed. Only the rules a parser can check are flagged; the
// prose rules are named in the report's not-checked list, so a clean row is never read as
// a pass for them. Every repository convention comes from the CI profile, so a repository
// that keeps other names is never flagged for lacking this one's.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');
const YAML = require('yaml');

const { REPO_ROOT, declaredSwitches, isPlainObject } = require('./ci-profile.cjs');
const { firstLine } = require('./ci-report-text.cjs');
const { variableState } = require('./ci-report-sources.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const WORKFLOWS = path.join(REPO_ROOT, '.github/workflows');

// A switch is a variable compared against off. The expression engine compares strings
// without regard to case, so OFF and "off" read the same as 'off'.
const SWITCH_SHAPE = /\bvars\.([A-Za-z_][A-Za-z0-9_]*)\s*!=\s*(['"])off\2/gi;
const PINNED_USES = /@[0-9a-f]{40}$/;
const EVENT_IN_RUN = /\$\{\{\s*github\.event/;

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

// ─────────────────────────────────────────────────────────────────────────────
// 3. README PURPOSES
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
// 4. SWITCH READING
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Test whether a parsed YAML value is a mapping.
 *
 * @param {*} value - The parsed value.
 * @returns {boolean} Whether the value is a non-array object.
 */
function isMapping(value) {
  return isPlainObject(value);
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

// ─────────────────────────────────────────────────────────────────────────────
// 5. WORKFLOW ANALYSIS
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
// 6. WORKFLOW FILES
// ─────────────────────────────────────────────────────────────────────────────

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
// 7. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  WORKFLOWS,
  isMapping,
  loadWorkflows,
  parseWorkflows,
  readReadmePurposes,
  switchNames,
  switchVariables,
};

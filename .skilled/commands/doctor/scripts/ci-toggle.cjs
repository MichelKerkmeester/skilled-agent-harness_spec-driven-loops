#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: CI Switch Toggle Plan
// ───────────────────────────────────────────────────────────────────
'use strict';

// Plans one CI switch change for /doctor:ci toggle and never makes it. The route runs
// the printed gh command itself, only after the operator's yes, so this script holds
// every refusal in code where a test can reach it and leaves the write to the route.
//
// A switch is any variable a workflow job compares against off. The names the toggle
// accepts are the profile's declared switches, or the names the workflows use when the
// profile declares none. Turning a switch off is refused when a job it skips holds a
// status context the live branch ruleset requires, because a skipped job reports
// Success and the requirement would stop blocking merges. When the ruleset cannot be
// read, the profile's neverOff list still refuses, and a "<NAME> must stay unset"
// sentence in the profile's workflows README refuses as a third source. A change to
// the state the variable already has is refused as a no-op. A change that switches off
// a workflow the profile protects is planned with a second named confirmation.
//
// Usage: ci-toggle.cjs --variable=<NAME> --state=<on|off> [--json] [--no-gh] [--profile <path>]
//   --json            print JSON only
//   --no-gh           make no gh call: the state and the ruleset read unknown
//   --profile <path>  read the CI profile from this file instead of discovering it
// Exit codes: 0 a plan or an unchanged result was printed, 1 the change is refused,
// 2 bad argument, 3 the CI profile is missing or invalid or a workflow failed to parse

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');

const report = require('./ci-report.cjs');
const { ProfileError, declaredSwitches, loadProfile } = require('./lib/ci-profile.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const USAGE = 'Usage: node .skilled/commands/doctor/scripts/ci-toggle.cjs --variable=<NAME> --state=<on|off> [--json] [--no-gh] [--profile <path>]';
const STATES = Object.freeze(['on', 'off']);

// ─────────────────────────────────────────────────────────────────────────────
// 3. ARGUMENTS
// ─────────────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const options = { variable: null, state: null, json: false, noGh: false, profile: null };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--json') options.json = true;
    else if (arg === '--no-gh') options.noGh = true;
    else if (arg.startsWith('--variable=')) options.variable = arg.slice('--variable='.length);
    else if (arg.startsWith('--state=')) options.state = arg.slice('--state='.length);
    else if (arg === '--profile' || arg.startsWith('--profile=')) {
      const value = arg === '--profile' ? argv[(index += 1)] : arg.slice('--profile='.length);
      if (!value) throw new Error('--profile needs a path');
      options.profile = value;
    } else throw new Error(`unknown argument: ${arg}`);
  }
  if (!options.variable) throw new Error('--variable=<NAME> is required');
  if (!STATES.includes(options.state)) throw new Error('--state must be on or off');
  return options;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. WHAT A VARIABLE REACHES
// ─────────────────────────────────────────────────────────────────────────────

// GitHub names a job's status context after the job's name, or its id when it has none.
function jobsOf(docs) {
  const jobs = [];
  for (const { file, doc } of docs) {
    if (!report.isMapping(doc.jobs)) continue;
    for (const [id, job] of Object.entries(doc.jobs)) {
      const name = report.isMapping(job) && typeof job.name === 'string' ? job.name : id;
      jobs.push({ file, context: name, switches: report.switchNames(job) });
    }
  }
  return jobs;
}

/**
 * The status contexts the live ruleset requires on a branch.
 *
 * @param {string} branch - The branch the ruleset protects.
 * @param {boolean} noGh - True to skip the call.
 * @returns {{readable:boolean, contexts:string[], reason:string|null}}
 */
function readRequiredContexts(branch, noGh) {
  if (noGh) return { readable: false, contexts: [], reason: 'gh disabled by --no-gh' };
  const read = report.runGh(['api', `repos/{owner}/{repo}/rules/branches/${branch}`]);
  if (!read.ok) return { readable: false, contexts: [], reason: read.reason };
  const rules = report.parseJsonList(read.stdout);
  if (!rules) return { readable: false, contexts: [], reason: 'the ruleset read printed no JSON list' };
  const contexts = rules
    .filter((rule) => rule && rule.type === 'required_status_checks')
    .flatMap((rule) => ((rule.parameters && rule.parameters.required_status_checks) || []).map((check) => check.context))
    .filter((context) => typeof context === 'string');
  return { readable: true, contexts: [...new Set(contexts)], reason: null };
}

function readmeText(profile) {
  if (!profile.workflowsReadme) return null;
  try {
    return fs.readFileSync(path.join(report.REPO_ROOT, profile.workflowsReadme.path), 'utf8');
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. REFUSALS
// ─────────────────────────────────────────────────────────────────────────────

function rulesetRefusal(variable, profile, required, jobs) {
  const held = jobs.filter((job) => required.contexts.includes(job.context) && job.switches.includes(variable));
  if (held.length === 0) return null;
  if (variable === profile.switch.master) {
    const files = [...new Set(held.map((job) => job.file))].join(', ');
    const which = required.contexts.length === 1 ? 'the only check the ruleset requires' : 'a check the ruleset requires';
    return { source: 'ruleset', message: `REFUSE: ${variable} must stay unset because it also skips ${files}, ${which}, and a skipped job reports Success` };
  }
  return { source: 'ruleset', message: `REFUSE: ${variable} must stay unset while the ruleset requires that context` };
}

// The master switch skips every job a group switch skips, so a README that keeps a
// group unset keeps the master unset too.
function readmeRefusal(variable, profile, text) {
  if (!text) return null;
  const said = (name) => text.includes(`${name} must stay unset`);
  if (said(variable) || (variable === profile.switch.master && profile.switch.groups.some(said))) {
    return { source: 'readme', message: `REFUSE: ${variable} must stay unset, as ${profile.workflowsReadme.path} says` };
  }
  return null;
}

/**
 * Every reason the requested change may not run, most authoritative source first.
 *
 * @param {Object} input - variable, state, allowlist, profile, required, jobs and readme.
 * @returns {Array<{source:string, message:string}>} The refusals, empty when allowed.
 */
function refusalsFor({ variable, state, allowlist, profile, required, jobs, readme }) {
  if (!allowlist.includes(variable)) return [{ source: 'allowlist', message: `REFUSE: ${variable} is not a documented switch` }];
  if (state !== 'off') return [];
  const refusals = [];
  const fromRuleset = required.readable ? rulesetRefusal(variable, profile, required, jobs) : null;
  if (fromRuleset) refusals.push(fromRuleset);
  // neverOff is the operator's own list, so it holds whether or not the ruleset reads.
  if (profile.neverOff.includes(variable)) {
    refusals.push({ source: 'neverOff', message: `REFUSE: ${variable} must stay unset because the CI profile lists it in neverOff` });
  }
  const fromReadme = readmeRefusal(variable, profile, readme);
  if (fromReadme) refusals.push(fromReadme);
  return refusals;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. PLAN
// ─────────────────────────────────────────────────────────────────────────────

function isUnchanged(state, current) {
  return (state === 'off' && current === 'off') || (state === 'on' && current === 'unset');
}

function secondConfirmation(variable, state, profile, covers) {
  if (state !== 'off') return null;
  const reached = profile.protected.filter((entry) => covers.includes(entry.file));
  if (reached.length === 0) return null;
  return {
    workflows: reached,
    prompt: `Type ${variable} to confirm a second time that these protected workflows stop running:`,
  };
}

function buildPlan(options, loadedProfile, parsed) {
  const { profile } = loadedProfile;
  const declared = declaredSwitches(profile);
  const allowlist = declared.length > 0 ? declared : report.switchVariables(profile, parsed.docs);
  const jobs = jobsOf(parsed.docs);
  const covers = [...new Set(jobs.filter((job) => job.switches.includes(options.variable)).map((job) => job.file))].sort();

  const variables = report.readVariables(options.noGh);
  const current = report.variableState(variables, options.variable);
  const branch = options.noGh ? { branch: profile.defaultBranch, source: profile.defaultBranch ? 'profile' : 'unknown' } : report.resolveDefaultBranch(profile);
  const required = readRequiredContexts(branch.branch, options.noGh || !branch.branch);

  const refusals = refusalsFor({ variable: options.variable, state: options.state, allowlist, profile, required, jobs, readme: readmeText(profile) });
  const noChange = refusals.length === 0 && isUnchanged(options.state, current);
  const command = options.state === 'off' ? `gh variable set ${options.variable} --body off` : `gh variable delete ${options.variable}`;
  const undo = options.state === 'off' ? `gh variable delete ${options.variable}` : `gh variable set ${options.variable} --body off`;

  let status = 'PLAN';
  if (refusals.length > 0) status = 'REFUSED';
  else if (noChange) status = 'NO_CHANGE';

  return {
    variable: options.variable,
    state: options.state,
    profile: { source: loadedProfile.source, path: loadedProfile.display },
    allowlist,
    allowlistSource: declared.length > 0 ? 'profile' : 'workflows',
    current,
    covers,
    requiredChecks: { branch: branch.branch, readable: required.readable, contexts: required.contexts, reason: required.reason },
    refusals,
    noChange,
    command: status === 'PLAN' ? command : null,
    undo: status === 'PLAN' ? undo : null,
    secondConfirmation: status === 'PLAN' ? secondConfirmation(options.variable, options.state, profile, covers) : null,
    status,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. OUTPUT
// ─────────────────────────────────────────────────────────────────────────────

const NOW_LABELS = { unset: 'on (unset)', off: 'off (set to off)', other: 'on (set to another value)', unknown: 'unknown (not readable)' };

function renderText(plan) {
  if (plan.status === 'REFUSED') return [plan.refusals[0].message, 'STATUS=FAIL ERROR="refused"'];
  if (plan.status === 'NO_CHANGE') {
    return ['DOCTOR TARGET UNCHANGED', 'Target: toggle', `Variable: ${plan.variable}`, `State: ${plan.state}, already as requested`, 'Changed: none', 'STATUS=OK'];
  }
  const lines = [
    'SWITCH CHANGE PLAN',
    `Variable: ${plan.variable}`,
    `Now: ${NOW_LABELS[plan.current]}`,
    `Change: ${plan.state}`,
    `Covers: ${plan.covers.join(', ') || 'no workflow'}`,
  ];
  // A plan with no refusal reads as cleared; when the ruleset was not read the
  // required-check source never ran, so the operator must see that before saying yes.
  if (plan.state === 'off' && !plan.requiredChecks.readable) {
    lines.push(`Required checks: not read (${plan.requiredChecks.reason}); the ruleset refusal was not applied`);
  }
  lines.push(`Command: ${plan.command}`, `Undo: ${plan.undo}`);
  if (plan.secondConfirmation) {
    lines.push('Protected workflows this switches off:');
    for (const entry of plan.secondConfirmation.workflows) lines.push(`- ${entry.file}: ${entry.role}`);
    lines.push(`Second confirmation: ${plan.secondConfirmation.prompt}`);
  }
  lines.push('STATUS=OK ACTION=plan');
  return lines;
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. MAIN
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
    loadedProfile = loadProfile({ cliPath: options.profile, root: report.REPO_ROOT });
  } catch (error) {
    if (!(error instanceof ProfileError)) throw error;
    process.stderr.write(`ERROR: ${error.message}\n`);
    return 3;
  }
  if (loadedProfile.errors.length > 0) {
    for (const fault of loadedProfile.errors) process.stderr.write(`ERROR: CI profile ${loadedProfile.display}: ${fault.message}\n`);
    return 3;
  }
  const parsed = report.parseWorkflows();
  // A variable's reach is read from the workflows, so a file that does not parse could
  // hide a protected job the change would skip.
  if (parsed.errors.length > 0) {
    for (const failure of parsed.errors) process.stderr.write(`ERROR: ${failure.file}: ${failure.message}\n`);
    return 3;
  }
  const plan = buildPlan(options, loadedProfile, parsed);
  if (options.json) process.stdout.write(`${JSON.stringify(plan, null, 2)}\n`);
  else process.stdout.write(`${renderText(plan).join('\n')}\n`);
  return plan.status === 'REFUSED' ? 1 : 0;
}

module.exports = { buildPlan, refusalsFor };

if (require.main === module) process.exitCode = main(process.argv.slice(2));

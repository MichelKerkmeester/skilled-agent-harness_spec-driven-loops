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
// The readings live beside this file, one concern per module: lib/ci-report-sources.cjs
// reads the variables and the newest non-rebuild commit, lib/ci-report-workflows.cjs
// parses and analyses the workflow files, lib/ci-report-render.cjs builds the document
// and the table, and lib/ci-report-text.cjs holds the one-line rule a gh failure and a
// parse error both need. This file stays the entry: the flags, the exit codes and every
// name the toggle reads from it.
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

const {
  ProfileError,
  REPO_ROOT,
  loadProfile,
  parseProfileFlag,
} = require('./lib/ci-profile.cjs');
const {
  SHA_PATTERN,
  parseJsonList,
  readVariables,
  resolveDefaultBranch,
  resolveNewestNonRebuildSha,
  runGh,
  variableState,
} = require('./lib/ci-report-sources.cjs');
const {
  WORKFLOWS,
  isMapping,
  loadWorkflows,
  parseWorkflows,
  readReadmePurposes,
  switchNames,
  switchVariables,
} = require('./lib/ci-report-workflows.cjs');
const { buildReport, renderTable, statusLine } = require('./lib/ci-report-render.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const USAGE = 'Usage: node .skilled/commands/doctor/scripts/ci-report.cjs [--json] [--sha=<40 hex>] [--no-gh] [--profile <path>]';

// ─────────────────────────────────────────────────────────────────────────────
// 3. ARGUMENTS
// ─────────────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const options = { json: false, sha: null, noGh: false, profile: null };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const profileFlag = parseProfileFlag(argv, index);
    if (arg === '--json') {
      options.json = true;
    } else if (arg === '--no-gh') {
      options.noGh = true;
    } else if (profileFlag) {
      options.profile = profileFlag.value;
      index = profileFlag.nextIndex;
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
// 4. MAIN
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
// 5. EXPORTS
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

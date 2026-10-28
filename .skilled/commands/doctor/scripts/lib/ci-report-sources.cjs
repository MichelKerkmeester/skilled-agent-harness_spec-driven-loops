// ───────────────────────────────────────────────────────────────────
// MODULE: CI Report Sources
// ───────────────────────────────────────────────────────────────────
'use strict';

// Everything the report reads from outside the workflow files: the repository variables
// through `gh variable list`, the branch the repository integrates on, and the newest
// commit on that branch that is not a trigger-index rebuild.
//
// The switch expression ships with the workflow, so only its state comes from here, and
// a variable value is reduced to a state and never printed. Arguments go in as an array,
// never through a shell, so a value read from gh output cannot change the command that
// reads the next one. A read that fails is reported as unknown with its reason: nothing
// here guesses a value, because a guess would name a variable or a commit nobody checked.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const { spawnSync } = require('node:child_process');

const { REPO_ROOT } = require('./ci-profile.cjs');
const { firstLine } = require('./ci-report-text.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const SHA_PATTERN = /^[0-9a-f]{40}$/;
const FALLBACK_BRANCH = 'main';
const RUN_LIMIT = 100;
const MAX_BUFFER = 16 * 1024 * 1024;

// ─────────────────────────────────────────────────────────────────────────────
// 3. GH ACCESS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Run a GitHub CLI read in the repository and normalize spawn failures.
 *
 * @param {string[]} args - Arguments passed to gh without a shell.
 * @returns {{ok:boolean, reason?:string, stdout?:string}} The command result.
 */
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

/**
 * Parse a JSON array from command output.
 *
 * @param {string} text - The command's standard output.
 * @returns {Array|null} The parsed list, or null when the output is invalid.
 */
function parseJsonList(text) {
  try {
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. VARIABLE STATES
// ─────────────────────────────────────────────────────────────────────────────

// Reads the repository variables only. The expression engine compares strings
// without regard to case, so OFF disables a job exactly as off does.
/**
 * Read repository variable states, or report them as unknown when gh is disabled.
 *
 * @param {boolean} noGh - Whether GitHub CLI access is disabled.
 * @returns {{known:boolean, states:Map, reason:string|null}} The variable states.
 */
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

/**
 * Return the state of one declared repository variable.
 *
 * @param {Object} variables - The result from readVariables.
 * @param {string} name - The variable name.
 * @returns {string} Its state: unknown, unset, off or other.
 */
function variableState(variables, name) {
  if (!variables.known) return 'unknown';
  return variables.states.get(name) || 'unset';
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. NEWEST NON-REBUILD COMMIT
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

/**
 * Find the newest commit that is not a trigger-index rebuild, by commit message rather
 * than by workflow name, and name why when no commit can be reported.
 *
 * @param {{sha:string|null, noGh:boolean}} options - The parsed arguments.
 * @param {Object} profile - A normalized CI profile.
 * @returns {{sha:string|null, reason:string}} The commit and the reason for it.
 */
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
// 6. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  SHA_PATTERN,
  parseJsonList,
  readVariables,
  resolveDefaultBranch,
  resolveNewestNonRebuildSha,
  runGh,
  variableState,
};

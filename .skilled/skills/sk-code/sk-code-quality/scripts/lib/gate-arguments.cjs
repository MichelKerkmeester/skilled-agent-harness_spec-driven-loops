// ───────────────────────────────────────────────────────────────────
// MODULE: sk-code-quality Gate Arguments
// ───────────────────────────────────────────────────────────────────
'use strict';

// The flag vocabulary a caller is offered: the usage text, the output forms it accepts, the help
// flags, and the check ids a run may name. An id stays raw here until the repository config is
// read, because the configured ids are known only once it has been, and an id nobody defines is
// refused rather than guessed, since a check nobody named is a check nobody meant.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const qualityConfig = require('./quality-config.cjs');

const { usage } = require('./gate-core.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const FORMATS = Object.freeze(['json', 'text', 'envelope']);

const USAGE_TEXT = [
  'Usage: quality-gate.cjs [scope] [options]',
  '',
  'Scope, choose one:',
  '  --worktree              the uncommitted change against HEAD, the default',
  '  --base REF              everything since the merge base of REF and HEAD',
  '  --files PATH...         exactly the named files, the only scope outside git',
  '  -- PATH...              the same as --files, for names that start with --',
  '  --explain PATH...       why each surface, checklist and check applies to each named file,',
  '                          run nothing; repeat the flag or list several paths after it',
  '',
  'Options:',
  '  --lines changed|file    report findings on changed lines only, or on the whole file',
  '  --no-run                list the spawned and configured checks as LISTED and start none',
  '  --only ID,...           run only these check ids, built-in or configured',
  '  --skip ID,...           leave these check ids out',
  '  --config PATH           read this repository config, relative to the working directory',
  '  --timeout SECONDS       the deadline for each spawned check, default 120',
  '  --format json|text|envelope   the output form, default json',
  '  -h, --help              print this help and exit 0',
  '',
  'Config discovery, the first source found wins:',
  '  1. --config PATH',
  '  2. git config skcode.qualityConfig from a config file, relative to the repository root',
  '     (a git -c or GIT_CONFIG_* value is ignored)',
  `  3. ${qualityConfig.CONFIG_CANDIDATES.join(' or ')} under the repository root`,
  '  4. none, so only the built-in checks run',
  '',
  'Exit codes:',
  '  0  NO_BLOCKER_FOUND  no blocker, and every required check produced evidence',
  '  1  BLOCKED           a blocking P0 finding, or a required P0 configured check failed',
  '  2  NOTHING_CHECKED   no check applied to any file in scope',
  '  3  ERROR             a usage or config error, or a check changed the workspace',
  '  4  UNVERIFIED        no blocker, but a required check produced no evidence',
].join('\n');
const HELP_FLAGS = new Set(['-h', '--help']);

// ─────────────────────────────────────────────────────────────────────────────
// 3. ARGUMENT PARSING
// ─────────────────────────────────────────────────────────────────────────────

// The ids a run may name are known only once the repository config is read, so the
// parser keeps the raw list and the context checks it against both sets.
function parseCheckIds(flag, value) {
  const ids = value.split(',').map((id) => id.trim()).filter(Boolean);
  if (ids.length === 0) throw usage(`${flag} needs at least one check id`);
  return { flag, ids: new Set(ids) };
}

function checkIdSet(request, known) {
  if (!request) return null;
  const unknown = [...request.ids].filter((id) => !known.includes(id));
  if (unknown.length > 0) throw usage(`${request.flag} needs check ids from: ${known.join(', ')} (unknown: ${unknown.join(', ')})`);
  return request.ids;
}

/**
 * Whether the arguments ask for help. Only an argument before -- counts, so a file
 * named -h can still be checked after the separator.
 *
 * @param {string[]} argv - The arguments after the program name.
 * @returns {boolean} True when -h or --help comes before any --.
 */
function wantsHelp(argv) {
  for (const arg of argv) {
    if (arg === '--') return false;
    if (HELP_FLAGS.has(arg)) return true;
  }
  return false;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  FORMATS, USAGE_TEXT, checkIdSet, parseCheckIds, wantsHelp,
};

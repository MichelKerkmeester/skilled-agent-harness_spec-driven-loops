// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Validation Off Switch                                                    ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// Someone who does not care whether their docs drift from the expected formats
// can switch every sk-doc validator off at once with SKDOC_SKIP_VALIDATION, set
// in the environment or saved in .skilled/hooks/hook-flags.env. The hooks'
// resolver owns that file and the precedence, and this module turns its answer
// into the one early exit every Node validator shares. validation_switch.py is
// the Python twin.

const path = require('path');

const { isFlagOn, configPath } = require(
  path.join(__dirname, '..', '..', '..', '..', 'hooks', 'shared', 'hook-flags.cjs'),
);


// ─────────────────────────────────────────────────────────────────────────────
// 1. CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────

const SWITCH = 'SKDOC_SKIP_VALIDATION';
// `valid` is the field the document validators report a pass in, so a caller
// reading their JSON counts a skip as no finding.
const SKIPPED_LINE = { skipped: true, valid: true, reason: `${SWITCH} is on` };


// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function wantsJson(argv) {
  return argv.some((arg, index) => arg === '--json'
    || arg === '--format=json'
    || (arg === '--format' && argv[index + 1] === 'json'));
}

/**
 * Where the switch was turned on, or null when validation should run.
 *
 * @returns {string|null} "the environment", the flags file path, or null.
 */
function skipSource() {
  if (!isFlagOn(SWITCH)) return null;
  return process.env[SWITCH] !== undefined ? 'the environment' : configPath();
}


// ─────────────────────────────────────────────────────────────────────────────
// 3. EARLY EXIT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * End the process before any check runs when the switch is on. A caller that
 * asked for JSON still gets a line it can parse, because an empty stdout reads
 * as a broken report.
 *
 * @param {string} tool - The validator's file name, for the notice.
 * @param {string[]} [argv] - Its arguments, to tell whether JSON was asked for.
 * @returns {void} Returns only when validation should run.
 */
function exitIfValidationOff(tool, argv = process.argv.slice(2)) {
  const source = skipSource();
  if (source === null) return;
  process.stderr.write(`${tool}: validation skipped, ${SWITCH} is on in ${source}\n`);
  if (wantsJson(argv)) {
    process.stdout.write(`${JSON.stringify(SKIPPED_LINE)}\n`);
  }
  process.exit(0);
}


// ─────────────────────────────────────────────────────────────────────────────
// 4. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  SWITCH,
  exitIfValidationOff,
  skipSource,
};

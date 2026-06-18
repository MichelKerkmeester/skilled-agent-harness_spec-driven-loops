#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ parse-args — shared CLI flag parser for deep-improvement scripts         ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * Single shared implementation of the flag dialect used by loop-host.cjs,
 * run-non-dev-ai-system.cjs and fixture-lint.cjs. One dialect, three call
 * sites:
 *
 *   --key=value   =-form: binds everything after '=' (including the empty
 *                 string), byte-identical to the original behavior.
 *   --key value   space-form: binds the next token when it does not start
 *                 with '--'.
 *   --key         bare flag: stays boolean true when no value token follows.
 *
 * Tokens that do not match `--lowercase-name[=...]` are skipped. Space-form
 * support matters because the Lane B command surface invokes loop-host with
 * space-separated args (--profile {p} --scorer 5dim --grader noop), so these
 * must bind to the following token rather than parse as booleans.
 *
 * Scope note: only the three scripts above share this dialect. Other lane
 * scripts (e.g. score-candidate.cjs key=value-only parsing) keep their own
 * parsers on purpose — no behavior-preserving superset exists across all of
 * them.
 */

/**
 * Parse CLI argv into a flag map, supporting =-form and space-form values.
 *
 * @param {string[]} argv - Argument vector (without node/script entries)
 * @returns {Object<string, string|boolean>} Parsed flags keyed by name
 */
function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const match = /^--([a-z][a-z0-9-]*)(?:=(.*))?$/.exec(argv[index]);
    if (!match) continue;
    const key = match[1];
    if (match[2] !== undefined) {
      args[key] = match[2];
      continue;
    }
    const next = argv[index + 1];
    if (next !== undefined && !next.startsWith('--')) {
      args[key] = next;
      index += 1;
    } else {
      args[key] = true;
    }
  }
  return args;
}

module.exports = { parseArgs };

#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ magicpath-utcp-exec — Drop unfilled placeholders, then run the CLI       ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// The CLI transport substitutes a literal `MISSING_ARG_<name>` token for any
// declared argument the caller left unset; it does not drop the flag. Passing
// that through is worse than an error, because a filter flag given a nonsense
// value returns an empty result that reads as a legitimate answer: a listing
// filtered by a team named MISSING_ARG_team looks exactly like a user with no
// projects. This wrapper removes those tokens before the CLI ever sees them.
//
// A missing REQUIRED positional cannot be repaired the same way - there is no
// flag to drop, and guessing would invent an argument - so it fails loudly.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const { spawnSync } = require('node:child_process');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const CLI = 'magicpath-ai';
const UNFILLED_PREFIX = 'MISSING_ARG_';
const FLAG_PATTERN = /^--?[a-zA-Z]/;

// ─────────────────────────────────────────────────────────────────────────────
// 3. ARGUMENT CLEANING
// ─────────────────────────────────────────────────────────────────────────────

function isUnfilled(token) {
  return typeof token === 'string' && token.startsWith(UNFILLED_PREFIX);
}

/**
 * Remove every unfilled placeholder, together with the flag introducing it.
 *
 * @param {string[]} argv - Arguments as the transport rendered them.
 * @returns {{args: string[], orphanedPositionals: string[]}} Cleaned arguments.
 */
function cleanArguments(argv) {
  const args = [];
  const orphanedPositionals = [];

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    // A flag whose value was never supplied: drop the pair.
    if (FLAG_PATTERN.test(token) && isUnfilled(argv[index + 1])) {
      index += 1;
      continue;
    }

    // An unfilled positional has no flag to drop, so it is reported instead.
    if (isUnfilled(token)) {
      orphanedPositionals.push(token.slice(UNFILLED_PREFIX.length));
      continue;
    }

    args.push(token);
  }

  return { args, orphanedPositionals };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CLI ENTRYPOINT
// ─────────────────────────────────────────────────────────────────────────────

function main(argv) {
  const { args, orphanedPositionals } = cleanArguments(argv);

  if (orphanedPositionals.length > 0) {
    // Emitted as JSON because every tool in this manual requests JSON, so a
    // caller parsing the result meets one shape whether it succeeded or not.
    process.stdout.write(`${JSON.stringify({
      error: `Missing required argument(s): ${orphanedPositionals.join(', ')}`,
      code: 'MISSING_REQUIRED_ARGUMENT',
      suggestion: 'Supply every argument the tool declares as required.',
    })}\n`);
    return 2;
  }

  const result = spawnSync(CLI, args, {
    encoding: 'utf8',
    stdio: ['ignore', 'inherit', 'inherit'],
  });

  if (result.error) {
    process.stdout.write(`${JSON.stringify({
      error: `Could not run ${CLI}: ${result.error.message}`,
      code: 'CLI_UNAVAILABLE',
      suggestion: `Install the MagicPath CLI and make sure ${CLI} is on PATH.`,
    })}\n`);
    return 127;
  }

  return typeof result.status === 'number' ? result.status : 1;
}

if (require.main === module) {
  process.exitCode = main(process.argv.slice(2));
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = { cleanArguments };

#!/usr/bin/env node

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Deep-Alignment — REMEDIATE Hook Point (gated, not implemented)           ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ Input:  --spec-folder P [--json]                                        ║
// ║ Output: one JSON status object on stdout.                                ║
// ║ Exit:   0=ok (hook entered, correctly did nothing), 3=input error.       ║
// ╚══════════════════════════════════════════════════════════════════════════╝
//
// This is the REMEDIATE state's HOOK POINT, not remediation logic. The gated-remediation
// invariant and SKILL.md Rule "NEVER: Run the gated remediation pass
// without an explicit, separate operator opt-in" both require remediation to
// stay a documented future extension until an operator explicitly approves
// building it -- this script exists so the state transition after REPORT is
// real and enterable (callable, testable, auditable) without performing any
// remediation action: no file writes, no git operations, no scoped-stage
// calls. A future phase that builds real remediation logic replaces this
// script's body, not its call site -- the loop-wiring contract (REPORT can
// optionally transition to REMEDIATE) is already correct today.

'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const path = require('node:path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function inputError(message) {
  const err = new Error(message);
  err.code = 'INPUT_VALIDATION';
  return err;
}

function classifyExitCode(err) {
  return err && typeof err === 'object' && err.code === 'INPUT_VALIDATION' ? 3 : 1;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Enter the REMEDIATE hook point. Always a no-op today -- this function's
 * entire contract is "prove the transition exists and is safe to call,"
 * never "fix anything." Never touches the filesystem or git.
 *
 * @param {string} specFolder
 * @returns {Object}
 */
function enterRemediateHook(specFolder) {
  return {
    status: 'not_implemented',
    state: 'REMEDIATE',
    specFolder: path.resolve(specFolder),
    message: 'REMEDIATE is operator-gated and intentionally unimplemented in this phase. '
      + 'See ADR-005 invariant 4 (gated remediation) and deep-alignment/SKILL.md Rule '
      + '"NEVER: Run the gated remediation pass without an explicit, separate operator opt-in". '
      + 'This call proves the hook point is enterable; it performs no remediation action.',
    safetyDiscipline: [
      'scoped staging only -- never git add -A',
      'worktree when the branch has diverged',
      'doc-only / skip-shared-files restraint when concurrent sessions are live',
    ],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CLI
// ─────────────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = { json: false };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--spec-folder') { args.specFolder = argv[i + 1]; i += 1; }
    else if (token === '--json') { args.json = true; }
    else if (token === '--help' || token === '-h') { args.help = true; }
    else if (token === '--confirm') { args.confirm = true; } // accepted, not yet actionable -- see module header
    else { throw inputError(`Unexpected argument: ${token}`); }
  }
  return args;
}

function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  if (args.help) {
    process.stdout.write('Usage: remediate-hook.cjs --spec-folder <path> [--confirm] [--json]\n');
    return 0;
  }
  if (!args.specFolder) throw inputError('--spec-folder is required');

  const result = enterRemediateHook(args.specFolder);
  if (args.json) {
    process.stdout.write(`${JSON.stringify(result)}\n`);
  } else {
    process.stdout.write(`${result.status}: ${result.message}\n`);
  }
  return 0;
}

if (require.main === module) {
  try {
    process.exit(main());
  } catch (err) {
    process.stderr.write(`${err instanceof Error ? err.message : String(err)}\n`);
    process.exit(classifyExitCode(err));
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = { enterRemediateHook, main };

#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: Spec-Kit Completion-State CLI Shim                           ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Claude/Bash parity front door over the runtime-neutral          ║
// ║          completion-state core. OpenCode fronts the same core with a    ║
// ║          registered `mk_speckit_completion` tool; Claude has no plugin   ║
// ║          tool-register surface, so this thin shim prints the identical  ║
// ║          merged JSON payload to stdout for a Bash-invoked caller. All    ║
// ║          resolution, exec, and fail-open logic lives in the core -- this ║
// ║          file only maps argv in and JSON out.                           ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const path = require('node:path');
const { computeCompletionState } = require('../skills/system-spec-kit/scripts/lib/completion-state.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. ARGUMENT PARSING
// ─────────────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const parsed = { specFolder: undefined, projectDir: undefined, strict: false, help: false };
  const positionals = [];

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === '--help' || token === '-h') {
      parsed.help = true;
    } else if (token === '--strict') {
      parsed.strict = true;
    } else if (token === '--project-dir') {
      parsed.projectDir = argv[index + 1];
      index += 1;
    } else {
      positionals.push(token);
    }
  }

  parsed.specFolder = positionals[0];
  return parsed;
}

function printUsage(stream) {
  stream.write([
    'Usage: speckit-completion.cjs <spec-folder> [--strict] [--project-dir <dir>]',
    '',
    'Prints one merged JSON payload:',
    '  {specFolder, level, filesPresent, checklist, placeholders, generatedAt}',
    '',
    'Options:',
    '  --strict             Treat P2 checklist items as required (see check-completion.sh --strict)',
    '  --project-dir <dir>  Resolve <spec-folder> and shell both scripts from this directory (default: cwd)',
    '  --help, -h            Show this help',
    '',
    'Set MK_SPECKIT_COMPLETION_DISABLED=1 to make this a full no-op (no filesystem probe, no script exec).',
    '',
  ].join('\n'));
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. MAIN
// ─────────────────────────────────────────────────────────────────────────────

function main(argv) {
  const args = parseArgs(argv);

  if (args.help) {
    printUsage(process.stdout);
    return 0;
  }

  if (!args.specFolder) {
    printUsage(process.stderr);
    return 1;
  }

  const projectDir = args.projectDir ? path.resolve(args.projectDir) : process.cwd();
  const payload = computeCompletionState({
    specFolder: args.specFolder,
    projectDir,
    strict: args.strict,
  });

  process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
  return 0;
}

if (require.main === module) {
  process.exitCode = main(process.argv.slice(2));
}

module.exports = { parseArgs, main };

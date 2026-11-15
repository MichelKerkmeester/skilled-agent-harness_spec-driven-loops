// ───────────────────────────────────────────────────────────────────
// MODULE: History Lookup Entry
// ───────────────────────────────────────────────────────────────────
// The printed lookup command runs this file. The compiled core stays in the
// spec-kit runtime, so the entry resolves it beside this checkout and turns a
// failure into the same refusal shape the CLI already prints.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const CORE_PATH = join(
  dirname(fileURLToPath(import.meta.url)),
  '../../../skills/system-spec-kit/runtime/dist/hooks/lib/history/cli.js',
);

// ─────────────────────────────────────────────────────────────────────────────
// 3. EXECUTION
// ─────────────────────────────────────────────────────────────────────────────

function refuse(code) {
  process.stdout.write(`${JSON.stringify({ ok: false, code })}\n`);
  process.exitCode = 2;
}

// A core that cannot load is a missing or broken build, which no change to the
// arguments fixes, so it gets its own code instead of the bad-arguments one.
let runHistoryLookupCli;
try {
  ({ runHistoryLookupCli } = await import(pathToFileURL(CORE_PATH).href));
} catch {
  runHistoryLookupCli = undefined;
}

if (typeof runHistoryLookupCli !== 'function') {
  refuse('core_unavailable');
} else {
  try {
    process.exitCode = await runHistoryLookupCli(process.argv.slice(2));
  } catch {
    refuse('operation_invalid');
  }
}

// ───────────────────────────────────────────────────────────────────
// MODULE: History Lookup Entry
// ───────────────────────────────────────────────────────────────────
// The printed lookup command runs this file. The compiled core stays in the
// spec-kit runtime, so the entry resolves it beside this checkout and turns an
// import failure into the same refusal shape the CLI already prints.

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

try {
  const { runHistoryLookupCli } = await import(pathToFileURL(CORE_PATH).href);
  process.exitCode = await runHistoryLookupCli(process.argv.slice(2));
} catch {
  process.stdout.write('{"ok":false,"code":"operation_invalid"}\n');
  process.exitCode = 2;
}

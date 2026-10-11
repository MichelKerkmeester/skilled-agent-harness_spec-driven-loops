// ───────────────────────────────────────────────────────────────
// MODULE: Shared unknown-option guard
// ───────────────────────────────────────────────────────────────
//
// A misspelled flag must fail before any work runs: silently ignoring it
// would run the default behavior and make the no-op look successful.

import { basename } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Exit 2 on the first argument outside a script's own option list.
 *
 * @param {string} scriptUrl - The calling module's import.meta.url.
 * @param {string[]} knownOptions - Every argument the caller accepts.
 */
export function rejectUnknownOptions(scriptUrl, knownOptions) {
  const scriptName = basename(fileURLToPath(scriptUrl));
  const known = new Set(knownOptions);
  for (const token of process.argv.slice(2)) {
    if (known.has(token)) continue;
    process.stderr.write(`${scriptName}: unknown option: ${token}\n`);
    process.stderr.write(`usage: ${scriptName} ${knownOptions.map((option) => `[${option}]`).join(' ')}\n`);
    process.exit(2);
  }
}

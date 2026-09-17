// ───────────────────────────────────────────────────────────────────
// MODULE: ESM Entry Helpers (runtime-only twin)
// ───────────────────────────────────────────────────────────────────
//
// A plain-JavaScript twin of the typed helper beside it, kept because the scripts that need this
// answer run straight from source with no build step. They are invoked by path, sometimes before
// anything has been compiled, so they cannot import the typed version or its build output. The
// two must agree; a test asserts they do.

import { realpathSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

/**
 * Return whether the given module URL is the process entrypoint.
 *
 * Both sides are canonicalized before comparison, because Node canonicalizes only one of them on
 * its own: a module's own URL resolves through every symlink, while the launch path stays exactly
 * as it was typed. Reaching a script through a linked directory therefore made a file differ from
 * itself, so the script concluded it was merely imported, skipped its work, and exited 0 with no
 * output. That reads as success, and the scripts affected here include ones invoked on every turn.
 *
 * Resolution failure falls back to the unresolved path rather than raising, because these callers
 * run inside hooks and audits where a wrong answer is safer than a thrown one.
 *
 * @param {string} importMetaUrl - Caller-provided `import.meta.url`
 * @returns {boolean} True when the caller is being executed directly by Node
 */
export function isMainModule(importMetaUrl) {
  const entrypoint = process.argv[1];
  if (!entrypoint) {
    return false;
  }

  const absolute = path.resolve(entrypoint);
  let canonical = absolute;
  try {
    canonical = realpathSync(absolute);
  } catch {
    // Falls through to the unresolved path below.
  }

  return importMetaUrl === pathToFileURL(canonical).href;
}

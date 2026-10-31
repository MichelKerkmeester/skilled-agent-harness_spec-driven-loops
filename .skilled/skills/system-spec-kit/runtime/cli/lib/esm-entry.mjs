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
import { fileURLToPath, pathToFileURL } from 'node:url';

/**
 * Return whether the given module URL is the process entrypoint.
 *
 * Both sides are canonicalized before comparison, because Node canonicalizes only one of them on
 * its own: a module's own URL resolves through every symlink, while the launch path stays exactly
 * as it was typed. Reaching a script through a linked directory therefore made a file differ from
 * itself, so the script concluded it was merely imported, skipped its work, and exited 0 with no
 * output. That reads as success, and the scripts affected here include ones invoked on every turn.
 *
 * Each side is resolved on its own. Under --preserve-symlinks-main Node keeps the linked spelling
 * in the module's own URL as well, so neither side can be assumed canonical already.
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

  const launch = canonicalPath(entrypoint);
  let modulePath;
  try {
    modulePath = fileURLToPath(importMetaUrl);
  } catch {
    // A URL that names no file cannot be the entrypoint file; compare it unresolved.
    return importMetaUrl === pathToFileURL(launch).href;
  }

  return launch === canonicalPath(modulePath);
}

function canonicalPath(filePath) {
  const absolute = path.resolve(filePath);
  try {
    return realpathSync(absolute);
  } catch {
    return absolute;
  }
}

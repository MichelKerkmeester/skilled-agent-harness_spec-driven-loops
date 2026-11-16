// ───────────────────────────────────────────────────────────────────
// MODULE: Payload Directory Helpers
// ───────────────────────────────────────────────────────────────────
// A hook payload names a working directory the hook did not choose. These two
// rules decide where a relative one points and whether a hook may write under
// it. They live here, inside the hooks tree, so an adapter can use them without
// depending on anything outside it; the Vibe repo-guards I/O module re-exports
// them, so every Vibe hook reads one rule.

import { statSync } from 'node:fs';
import { dirname, isAbsolute, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// shared -> hooks -> .skilled -> checkout root.
const CHECKOUT_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');

/**
 * The directory a relative path in the payload resolves against. A relative
 * cwd is resolved against the checkout, so the same payload names the same
 * tree on any machine, while a live absolute cwd names the session folder.
 * @param {unknown} cwd - The payload's working directory.
 * @returns {string} An absolute directory.
 */
export function sessionDirFor(cwd) {
  return typeof cwd === 'string' && cwd.trim() ? resolve(CHECKOUT_ROOT, cwd) : CHECKOUT_ROOT;
}

/**
 * Whether a payload directory may receive a write. Only an absolute path that
 * already exists as a directory qualifies, so a payload can never make a hook
 * create a directory tree wherever it names.
 * @param {unknown} candidate - The directory the payload names.
 * @returns {boolean} True for an existing absolute directory.
 */
export function existingDirectory(candidate) {
  if (typeof candidate !== 'string' || !candidate || !isAbsolute(candidate)) return false;
  try {
    return statSync(candidate).isDirectory();
  } catch {
    return false;
  }
}

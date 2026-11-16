// ───────────────────────────────────────────────────────────────────
// MODULE: CLI Entry Check
// ───────────────────────────────────────────────────────────────────
// A hook module both runs as a command and is imported by its tests, so it
// starts its main step only when it is the script node was asked to run. Node
// reports the entry module under its real path but leaves process.argv[1] as
// typed, so a hook reached through a symlink (a project that links the .skilled
// tree in, or a checkout opened through a linked folder) would never match a
// plain path comparison and would silently do nothing. Both sides are compared
// as real paths instead.

import { realpathSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

function realPath(filePath) {
  try {
    return realpathSync(filePath);
  } catch {
    return resolve(filePath);
  }
}

/**
 * Whether the calling module is the script node was started with.
 * @param {string} importMetaUrl - The caller's `import.meta.url`.
 * @param {string|undefined} [entryArg] - The script argument, `process.argv[1]` by default.
 * @returns {boolean} True when both name the same file once symlinks are resolved.
 */
export function isCliEntry(importMetaUrl, entryArg = process.argv[1]) {
  if (!entryArg) return false;
  return realPath(entryArg) === realPath(fileURLToPath(importMetaUrl));
}

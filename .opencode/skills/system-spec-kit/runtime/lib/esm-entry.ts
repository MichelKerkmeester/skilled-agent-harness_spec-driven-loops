// ───────────────────────────────────────────────────────────────────
// MODULE: ESM Entry Helpers
// ───────────────────────────────────────────────────────────────────
//
// A sibling of the CLI workspace's helper of the same name. The two are separate TypeScript
// projects and this one excludes the other's tree, so a file cannot be shared across the line by
// importing it; the composite build refuses. Duplicating fifteen lines is the cheaper of the two
// costs, and a test asserts the copies agree.

import { realpathSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

/**
 * Return whether the current module URL is the process entrypoint.
 *
 * Both sides are canonicalized before they are compared, because Node canonicalizes only one of
 * them on its own: a module's own URL resolves through every symlink, while the launch path stays
 * exactly as it was typed. Reaching a module through a linked directory therefore made a file
 * differ from itself, and the caller concluded it was merely imported: the work was skipped and
 * the process still exited 0, which is indistinguishable from having done it.
 *
 * Resolution failure falls back to the unresolved comparison rather than raising, because the
 * callers here are hooks and validators, where a conservative answer beats a thrown one.
 *
 * @param importMetaUrl - Caller-provided `import.meta.url`
 * @returns True when the caller is being executed directly by Node
 */
export function isMainModule(importMetaUrl: string): boolean {
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

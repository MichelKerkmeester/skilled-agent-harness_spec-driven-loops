// ───────────────────────────────────────────────────────────────────
// MODULE: ESM Entry Helpers
// ───────────────────────────────────────────────────────────────────
'use strict';

import { realpathSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
/**
 * Return whether the current module URL is the process entrypoint.
 *
 * Both sides are canonicalized before they are compared, because Node canonicalizes only one of
 * them on its own: a module's own URL resolves through every symlink, while the launch path stays
 * exactly as it was typed. Reaching a module through a linked directory therefore made a file
 * differ from itself, and the caller concluded it was merely imported: the work was skipped and
 * the process still exited 0, which is indistinguishable from having done it. That shape is
 * ordinary rather than exotic, since a worktree sharing a build directory and a temporary
 * directory under an aliased root both produce it.
 *
 * Resolution failure falls back to the unresolved comparison rather than raising. These callers
 * include hooks and validators, where returning the conservative answer is better than throwing.
 *
 * @param importMetaUrl - Caller-provided `import.meta.url`
 * @returns True when the caller is being executed directly by Node
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
    }
    catch {
        // Falls through to the unresolved path below.
    }
    return importMetaUrl === pathToFileURL(canonical).href;
}
/**
 * Resolve the containing directory for an ESM module URL.
 *
 * @param importMetaUrl - Caller-provided `import.meta.url`
 * @returns Absolute directory path for the caller module
 */
export function dirnameFromImportMeta(importMetaUrl) {
    return path.dirname(fileURLToPath(importMetaUrl));
}

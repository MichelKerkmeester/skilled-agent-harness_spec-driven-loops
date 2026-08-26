'use strict';

const path = require('node:path');

// ─────────────────────────────────────────────────────────────────────────────
// Process-boot helpers shared by every deep-loop .cjs entrypoint.
// ─────────────────────────────────────────────────────────────────────────────

// Child environment for the tsx re-exec that each entrypoint performs before
// running its TypeScript implementation.
//
// NODE_PRESERVE_SYMLINKS is stripped on purpose. When the tsx loader itself sits
// behind a filesystem path that contains a space (a checkout whose absolute path
// has a space, carrying its own node_modules), that flag keeps the spaced,
// symlink-unresolved path in Node's module resolver, and tsx then fails to
// resolve its own internals and its .js -> .ts remap. The first remapped import
// in the state layer (atomic-state's './loop-lock.js') dies with
// ERR_MODULE_NOT_FOUND, which reads like the locking code is broken when the real
// cause is the loader never initializing. The runtime never relies on preserved
// symlinks -- write containment resolves every path through fs.realpath, and the
// repo root comes from the working directory -- so dropping the flag for the
// TypeScript child is safe and removes the failure at its single source.
function tsxChildEnv(extra) {
  const env = { ...process.env, ...(extra || {}) };
  delete env.NODE_PRESERVE_SYMLINKS;
  return env;
}

// Repo root used for write-containment. Defaults to the working directory.
// DEEP_LOOP_REPO_ROOT lets an operator pin it explicitly -- e.g. to the canonical
// space-free checkout -- when the loop is launched from a mirror whose path the
// git-toplevel and realpath resolution would otherwise reject. An empty or
// whitespace-only value is ignored so a blank export cannot silently break scope.
function resolveContainmentRepoRoot(env, cwd) {
  const override = env && typeof env.DEEP_LOOP_REPO_ROOT === 'string'
    ? env.DEEP_LOOP_REPO_ROOT.trim()
    : '';
  return override ? path.resolve(override) : cwd;
}

module.exports = { tsxChildEnv, resolveContainmentRepoRoot };

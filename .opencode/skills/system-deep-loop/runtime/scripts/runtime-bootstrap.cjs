'use strict';

const path = require('node:path');
const fs = require('node:fs');

function realpathSafe(p) {
  try {
    return fs.realpathSync(p);
  } catch {
    return path.resolve(p);
  }
}

function isSubpath(childAbs, parentAbs) {
  const rel = path.relative(parentAbs, childAbs);
  return rel === '' || (!path.isAbsolute(rel) && !rel.startsWith('..'));
}

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

// Repo root used for write-containment. Precedence:
//   1. DEEP_LOOP_REPO_ROOT, when an operator pins it explicitly (a blank or
//      whitespace-only value is ignored so a stray export cannot break scope).
//   2. Auto-detection: when the artifact tree resolves (through symlinks) outside
//      the working directory's git worktree -- e.g. a checkout whose .opencode is
//      a symlink into a shared canonical checkout -- containment must run against
//      the worktree that PHYSICALLY holds the writes, or git cannot see them and
//      every artifact is (wrongly) rejected as unscopable. Only this otherwise-
//      broken case is redirected; when the artifact is inside cwd's worktree the
//      result is cwd, unchanged. gitToplevel is injected so this stays testable.
//   3. The working directory.
function resolveContainmentRepoRoot(env, cwd, opts) {
  const override = env && typeof env.DEEP_LOOP_REPO_ROOT === 'string'
    ? env.DEEP_LOOP_REPO_ROOT.trim()
    : '';
  if (override) return path.resolve(override);

  const artifactDir = opts && opts.artifactDir;
  const gitToplevel = opts && typeof opts.gitToplevel === 'function' ? opts.gitToplevel : null;
  if (artifactDir && gitToplevel) {
    const artifactReal = realpathSafe(artifactDir);
    const cwdTop = gitToplevel(cwd);
    if (cwdTop && !isSubpath(artifactReal, realpathSafe(cwdTop))) {
      const artifactTop = gitToplevel(artifactReal);
      if (artifactTop && isSubpath(artifactReal, realpathSafe(artifactTop))) {
        return artifactTop;
      }
    }
  }
  return cwd;
}

module.exports = { tsxChildEnv, resolveContainmentRepoRoot, realpathSafe, isSubpath };

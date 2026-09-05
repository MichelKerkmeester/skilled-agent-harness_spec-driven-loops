// ───────────────────────────────────────────────────────────────────
// MODULE: Path Containment
// ───────────────────────────────────────────────────────────────────

// One shared write-boundary primitive so every skill's containment check
// canonicalizes paths the same way. Moved here from the spec-kit CLI's
// path-utils; the CLI re-exports it so its existing callers keep their
// import path.

import fs from 'fs';
import path from 'path';

// ---------------------------------------------------------------
// 1. WRITE-BOUNDARY CONTAINMENT
// ---------------------------------------------------------------

/**
 * Resolve the longest existing prefix of a path through the filesystem and
 * append the missing tail lexically. A symlinked parent inside a root can
 * point a write outside it, so the existing part is canonicalized; segments
 * that do not exist yet cannot be links and are kept as written.
 */
export function canonicalizeExistingPrefix(inputPath: string): string {
  const missing: string[] = [];
  let current = path.resolve(inputPath);
  while (!fs.existsSync(current)) {
    const parent = path.dirname(current);
    if (parent === current) break;
    missing.unshift(path.basename(current));
    current = parent;
  }
  return path.resolve(fs.realpathSync(current), ...missing);
}

/** Whether `targetPath` canonically resolves to `rootDir` or somewhere below it. */
export function isPathInsideRoot(rootDir: string, targetPath: string): boolean {
  const relative = path.relative(canonicalizeExistingPrefix(rootDir), canonicalizeExistingPrefix(targetPath));
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

/**
 * Throw unless `targetPath` stays inside `rootDir`. Every write boundary
 * should go through this one check so a caller cannot weaken it locally.
 */
export function assertPathInsideRoot(rootDir: string, targetPath: string, label: string = 'path'): string {
  const resolved = path.resolve(rootDir, targetPath);
  if (!isPathInsideRoot(rootDir, resolved)) {
    throw new Error(`${label} must resolve inside ${rootDir}: ${targetPath}`);
  }
  return resolved;
}

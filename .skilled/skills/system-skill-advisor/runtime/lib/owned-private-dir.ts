// ───────────────────────────────────────────────────────────────────
// MODULE: Owned Private Directory
// ───────────────────────────────────────────────────────────────────

// 1. IMPORTS

import { lstatSync } from 'node:fs';

// 2. IMPLEMENTATION

/** Check that a path is a real, privately permissioned directory owned by this process user. */
export function isOwnedPrivateDir(path: string, forbiddenModeBits = 0o077): boolean {
  const stat = lstatSync(path);
  if (stat.isSymbolicLink() || !stat.isDirectory()) return false;
  if (typeof process.getuid === 'function' && stat.uid !== process.getuid()) return false;
  // Windows has no POSIX mode bits (ACLs govern access) and reports 0o40777 for every directory.
  if (process.platform === 'win32') return true;
  return (stat.mode & forbiddenModeBits) === 0;
}

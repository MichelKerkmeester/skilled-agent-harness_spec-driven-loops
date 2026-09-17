// ───────────────────────────────────────────────────────────────────
// MODULE: Workspace — package root
// ───────────────────────────────────────────────────────────────────
// The one walk that finds the system-spec-kit package root: the directory that
// holds the shared and runtime workspaces. `workspace/repo-root.mjs` finds the
// repository above it by sentinel and ships as source for scripts that run
// before a build; this module is compiled and serves every TypeScript caller,
// so the marker set and the walk exist once.

import fs from 'node:fs';
import path from 'node:path';

/** The directories every package root carries; a partial checkout is not a root. */
export const PACKAGE_ROOT_MARKERS: readonly string[] = ['shared', 'runtime', 'runtime/cli'];

export interface PackageRootOptions {
  /** Directories that must all exist under a candidate; defaults to the package markers. */
  readonly markers?: readonly string[];
  /** How many parents to inspect before giving up; defaults to the filesystem root. */
  readonly maxDepth?: number;
}

/**
 * Walk up from `startDir` to the nearest directory carrying every marker.
 * Returns null when the walk reaches the filesystem root or the depth cap.
 */
export function findPackageRoot(startDir: string, options: PackageRootOptions = {}): string | null {
  const markers = options.markers ?? PACKAGE_ROOT_MARKERS;
  const maxDepth = options.maxDepth ?? Number.POSITIVE_INFINITY;
  let current = path.resolve(startDir);
  for (let depth = 0; depth <= maxDepth; depth += 1) {
    if (markers.every((marker) => fs.existsSync(path.join(current, marker)))) {
      return current;
    }
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }
  return null;
}

/** The same walk for callers that cannot continue without a root. */
export function resolvePackageRoot(startDir: string, options: PackageRootOptions = {}): string {
  const root = findPackageRoot(startDir, options);
  if (root === null) {
    throw new Error(`Unable to resolve package root from: ${startDir}`);
  }
  return root;
}

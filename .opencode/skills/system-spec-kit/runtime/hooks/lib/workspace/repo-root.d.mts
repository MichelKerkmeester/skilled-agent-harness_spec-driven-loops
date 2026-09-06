// ───────────────────────────────────────────────────────────────────
// MODULE: Repository Root Resolution (type surface)
// ───────────────────────────────────────────────────────────────────
// Declarations for the build-free ESM resolver so TypeScript consumers can
// share the one root-resolution algorithm instead of carrying a private walk-up.

export const REPO_ROOT_SENTINEL: string;
export function hoistAboveOpencodeTree(dir: string): string | null;
export function findRepoRoot(start?: string, opts?: { maxDepth?: number; sentinel?: string }): string;

// ───────────────────────────────────────────────────────────────────
// MODULE: Repository Root Resolution (hooks re-export)
// ───────────────────────────────────────────────────────────────────
// The one root-resolution algorithm lives in the shared package so every
// package walks the same way; hooks stay build-free by importing it relatively.

export { REPO_ROOT_SENTINEL, hoistAboveOpencodeTree, findRepoRoot } from '../../../../shared/workspace/repo-root.mjs';

---
title: "Changelog: Migration Execution [032/003]"
description: "Chronological changelog for the specs-root relocation runbook execution — the atomic flip itself."
trigger_phrases:
  - "phase changelog"
  - "migration execution runbook"
  - "specs root atomic flip"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-08-07

> Spec folder: `specs/system-speckit/032-relocate-specs-folder/003-migration-execution` (Level 3)
> Parent packet: `specs/system-speckit/032-relocate-specs-folder`

### Summary

Executed the 11-step runbook phase 002 designed. The canonical spec-kit tree moved from `.opencode/specs/` to `specs/` at repo root; `.opencode/specs` is now a relative symlink (`.opencode/specs -> ../specs`). Landed the atomic flip plus the required `.gitignore` rebase in one commit (`606e55cb8a`, 49,891 renames), then propagated the direction change across the registry, CI, docs, and the Memory MCP index.

### Changed

- **The flip (step 4).** `specs/` real, `.opencode/specs` a symlink. Three pre-commit checks gated the commit: `git check-ignore -v` matched all four downstream project paths at their new location, `readlink .opencode/specs` printed `../specs`, `git status` showed no leaked project tree.
- **The wider fix (steps 5-8, 10).** Flipped the 12 originally-scoped call sites (7 registry resolvers, 5 `SPEC_KIT_SPECS_DIR` sites) plus CI and operator-facing docs. Step 10's inverted 15-test validation matrix surfaced **6 more production files** with the same hardcoded old-direction bug that were never on the original list — fixed in the same pass since a real correctness bug isn't optional just because it wasn't scoped.
- **Memory MCP index (step 9).** Deleted 10,459 stale `.opencode/specs/` alias rows in one transactional `DELETE`, confirmed via `PRAGMA integrity_check`/`PRAGMA foreign_key_check` and a 1:1 FTS5 cascade. Final: 0 stale rows, 5,733 canonical rows.

### Fixed

- A pre-existing 3,308-file dirty tree blocking step 1's clean-tree precondition, committed separately before the runbook could start.
- An ambiguous already-decommissioned `system-code-graph` packet deletion (2,814 files), resolved via an explicit operator decision rather than a guess.

### Verification

- `registryCoverageGaps()` returns empty; 553 tests across the affected context-server/indexing suites pass with 0 regressions.
- `spec-root-*` test suite: 54/55 pass (1 pre-existing, unrelated regex typo).
- Step 11 full sweep: `strict-pass-freshness.ts --roots specs` — 0 regressions, 0 new failures across 1,911 folders.

### Notes

A live concurrent session pushed real commits to this same branch mid-run; resolved via rebase with no data loss. Two later independent reviews (2026-08-08) found and fixed a genuine data-quality bug this step's own doc claims had missed: `check-no-spec-imports.cjs`'s durable no-spec-import guard only checked the legacy alias, and `memory-drift-marker.sh`'s `git diff-tree` pathspec matched only the symlink blob, never the real tree — see phase 005's changelog.

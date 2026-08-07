---
title: "Changelog: Applied Source & Doc Fixes [011-source-bug-and-misalignment-audit/002-applied-source-and-doc-fixes]"
description: "Chronological changelog for the Applied Source & Doc Fixes phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-15

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/011-source-bug-and-misalignment-audit/002-applied-source-and-doc-fixes` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/011-source-bug-and-misalignment-audit`

### Summary

31 of 38 audit findings fixed on the cg-remediation branch via cli-opencode gpt-5.5-fast --variant high in an isolated worktree. Typecheck clean; full suite shows zero regressions vs the pre-existing BUG-06 WIP baseline.

### Added

- None.

### Changed

- status.ts no longer writes the readiness marker; made read-only per ADR-003 (CG-001).
- feature_catalog tool count corrected from 11 to 8; mk-spec-memory dispatch note updated (CG-004).
- trustState reference enum and cross-link corrected (CG-011/030).
- index.ts MK_CODE_INDEX_ROOT_DIR doc comment corrected (CG-012).
- lib/README CodeGraphDatabase class description updated to reflect real functional surface (CG-019).
- diff/detect-changes pre/post-image attribution and comment accuracy improved (CG-021/022/023).
- Tool-count, group-count, version, and stale-reference doc fixes across eight findings (CG-024..031).
- parser-skip-list recordSuccess marked deprecated; B2 quarantine de-gated; parse metric label corrected (CG-032/033/034).
- playbook 023 stale apply-mode path corrected (CG-036).
- database_path_policy rationale corrected to note symlinks already share skill dir (CG-038).

### Fixed

- removeFile() edge and file delete wrapped in a single transaction (CG-003).
- web-tree-sitter Tree.delete() called in finally block to prevent WASM memory leak (CG-005).
- readiness-marker base dir resolved from canonical resolver instead of process.cwd() (CG-013).
- database_path_policy now cites real resolver paths core/config.ts and canonical-db-dir.ts (CG-014).
- shutdownCodeIndex re-entrancy guard added (CG-015).
- owner-lease reclaim uses CAS; refresh uses TOCTOU re-verify (CG-016/017).
- working-set-tracker serialize/deserialize round-trips symbols correctly (CG-018).
- replaceEdges per-file global orphan sweep removed (CG-020).
- scan getCurrentGitHead given a 5s timeout (CG-035).

### Verification

- npm run typecheck - PASS (0 errors)
- Full vitest suite - Failing set identical to B0 baseline (24 pre-existing WIP failures); zero new
- Tasks complete - 4 completed task item(s) recorded

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- Not merged. Lives on branch cg-remediation; operator merges when BUG-04/BUG-06 WIP settles.
- Baseline not green. The repo's own BUG-06 WIP fails 24 tests independently of this work.

---
title: "Implementation Summary: Applied Source & Doc Fixes [system-code-graph/007-code-graph-buildout/011-source-bug-and-misalignment-audit/002-applied-source-and-doc-fixes/implementation-summary]"
description: "31 of 38 audit findings fixed on the cg-remediation branch via cli-opencode gpt-5.5-fast --variant high in an isolated worktree. Typecheck clean; full suite shows zero regressions vs the pre-existing BUG-06 WIP baseline."
trigger_phrases:
  - "code graph remediation applied-source-and-doc-fixes"
  - "system-code-graph fix applied source & doc fixes"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/007-code-graph-buildout/011-source-bug-and-misalignment-audit/002-applied-source-and-doc-fixes"
    last_updated_at: "2026-05-29T08:30:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Landed 31 fixes on cg-remediation; verified typecheck + zero test regressions"
    next_safe_action: "Operator reviews and merges cg-remediation into main when BUG-06 WIP settles"
    blockers: []
    key_files:
      - "spec.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `002-applied-source-and-doc-fixes` |
| **Completed** | 2026-05-29 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

31 of 38 audit findings fixed on the cg-remediation branch via cli-opencode gpt-5.5-fast --variant high in an isolated worktree. Typecheck clean; full suite shows zero regressions vs the pre-existing BUG-06 WIP baseline.

### Findings

| Finding | Outcome / Reason |
|---------|------------------|
| CG-001 | status.ts no longer writes the readiness marker (read-only per ADR-003) |
| CG-003 | removeFile() edge+file delete wrapped in a single transaction |
| CG-005 | web-tree-sitter Tree.delete() in finally — WASM leak fixed |
| CG-004 | feature_catalog tool count 11->8; mk-spec-memory dispatch note corrected |
| CG-011/030 | trustState reference enum + 11->8 cross-link corrected |
| CG-012 | index.ts MK_CODE_INDEX_ROOT_DIR doc comment corrected |
| CG-013 | readiness-marker base dir resolved from canonical resolver, not process.cwd() |
| CG-014 | database_path_policy cites real resolver (core/config.ts + canonical-db-dir.ts) |
| CG-015 | shutdownCodeIndex re-entrancy guard |
| CG-016/017 | owner-lease reclaim CAS + refresh TOCTOU re-verify |
| CG-018 | working-set-tracker serialize/deserialize round-trips symbols |
| CG-019 | lib/README CodeGraphDatabase class -> real functional surface |
| CG-020 | replaceEdges per-file global orphan sweep removed |
| CG-021/022/023 | diff/detect-changes pre/post-image attribution + comment accuracy |
| CG-024..031 | tool-count (8 vs 11) + group-count + version + stale-ref doc fixes |
| CG-032/033/034 | parser-skip-list recordSuccess @deprecated; B2 quarantine de-gated; parse metric recovered label |
| CG-035 | scan getCurrentGitHead given a 5s timeout |
| CG-036 | playbook 023 stale apply-mode path corrected |
| CG-038 | database_path_policy rationale corrected (symlinks already share skill dir) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

`cli-opencode openai/gpt-5.5-fast --variant high` applied the edits across file-disjoint batches in an isolated worktree seeded with the operator's WIP. Each test delta was re-examined as a possible regression before keeping or reverting.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Deliver on branch, not main | The live tree has incomplete overlapping BUG-04/BUG-06 WIP |
| Revert over-broad fixes | Re-examination showed some fixes changed semantics the tests/recovery rely on |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm run typecheck` | PASS (0 errors) |
| Full vitest suite | Failing set identical to B0 baseline (24 pre-existing WIP failures); zero new |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not merged.** Lives on branch `cg-remediation`; operator merges when BUG-04/BUG-06 WIP settles.
2. **Baseline not green.** The repo's own BUG-06 WIP fails 24 tests independently of this work.
<!-- /ANCHOR:limitations -->

---
title: "Feature Specification: Applied Source & Doc Fixes [system-spec-kit/026-graph-and-context-optimization/004-code-graph/011-source-bug-and-misalignment-audit/002-applied-source-and-doc-fixes/feature-specification]"
description: "31 of 38 audit findings fixed on the cg-remediation branch via cli-opencode gpt-5.5-fast --variant high in an isolated worktree. Typecheck clean; full suite shows zero regressions vs the pre-existing BUG-06 WIP baseline."
trigger_phrases:
  - "code graph remediation applied-source-and-doc-fixes"
  - "system-code-graph fix applied source & doc fixes"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/004-code-graph/011-source-bug-and-misalignment-audit/002-applied-source-and-doc-fixes"
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
# Feature Specification: Applied Source & Doc Fixes

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-29 |
| **Branch** | `cg-remediation` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 011 audit recorded 37+1 findings in the system-code-graph MCP server. The clean, non-WIP-overlapping subset needed remediation without disturbing the operator's in-flight BUG-04/BUG-06 work.

### Purpose
Land the safe, verifiable fixes on a reviewable branch the operator can merge when their WIP settles.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The findings listed in §4, sourced from the parent audit `../review-report.md`.

### Out of Scope
- Merging into `main` (operator-gated; the live tree has active BUG-04/BUG-06 WIP).

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
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Changes scoped + verified | Typecheck clean; full suite shows zero regressions vs B0 baseline |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Each finding traceable to parent review-report | CG-IDs map to `../review-report.md` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Outcome recorded per finding (§4) with evidence on branch `cg-remediation`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | operator BUG-04/BUG-06 WIP | overlaps these files | branch isolation; merge when WIP settles |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

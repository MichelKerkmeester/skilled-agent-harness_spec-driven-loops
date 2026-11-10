---
title: "Tasks: Phase 3: agent-mirror-checker-relocation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "agent mirror checker relocation tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3: agent-mirror-checker-relocation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Capture gate baselines in the worktree (`scratchpad/baseline/summary.txt`)
- [x] T002 Write the work-unit brief (`scratch/brief-wu1.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 WU1: `git mv` the five files, fix depth and parser require, repoint callers, add the `bin/README.md` row (DeepSeek, `scratch/brief-wu1.md`)
- [x] T004 Check the diff against the allowed paths
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 `node .skilled/bin/check-agent-mirror-sync.cjs --all`
- [x] T006 bin vitest run, both moved suites
- [x] T007 `pre-commit.test.sh` and `broken-move-drill.sh`
- [x] T008 Old-path search prints nothing outside the packet
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Gates match or beat the baseline
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md — REQ-001 to REQ-003 in `spec.md`
- [x] CHK-002 [P0] Technical approach defined in plan.md — `plan.md` §1 and §3
- [x] CHK-003 [P1] Dependencies identified and available — Built `system-spec-kit/shared/dist` present; DevPass route answered
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks — `node --check` implied by the checker run; vitest transforms both suites without error
- [x] CHK-011 [P0] No console errors or warnings — Checker prints only its OK line
- [x] CHK-012 [P1] Error handling implemented — Unchanged error paths moved with the files; diff is path-only
- [x] CHK-013 [P1] Code follows project patterns — Matches `.skilled/bin/` neighbours; row added to `bin/README.md`
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met — `acceptance-criteria.md` AC-001 to AC-004 Met
- [x] CHK-021 [P0] Manual testing complete — Checker `--all`, hook suite and bin vitest run by the orchestrator
- [x] CHK-022 [P1] Edge cases tested — Fixture now symlinks `system-spec-kit/shared` so the copied lib resolves at its new depth
- [x] CHK-023 [P1] Error scenarios validated — Bin vitest regression found and fixed (leaf and activation manifests)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. — instance-only: one checker, one move
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. — Old-path `rg` outside `specs/` lists only generated files and the packet README
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. — Callers: two hooks, hook tests, CI, drill, five docs; all repointed
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. — N/A: no parser, path-safety or redaction logic changed
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. — N/A: no matrix
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. — N/A: no process-wide state read
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. — Snapshot `3c9e10ab1e` to tree `1731c459c`
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — No secrets in the diff
- [x] CHK-031 [P0] Input validation implemented — N/A: argument handling unchanged
- [x] CHK-032 [P1] Auth/authz working correctly — N/A: no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized — spec, plan, tasks and summary agree
- [x] CHK-041 [P1] Code comments adequate — Depth comment corrected at `.skilled/bin/check-agent-mirror-sync.cjs:26`
- [x] CHK-042 [P2] README updated (if applicable) — `bin/README.md` row added
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — Brief kept in `scratch/`
- [x] CHK-051 [P1] scratch/ cleaned before completion — `scratch/` holds only the brief, file lists and `.gitkeep`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-10
<!-- /ANCHOR:summary -->

---




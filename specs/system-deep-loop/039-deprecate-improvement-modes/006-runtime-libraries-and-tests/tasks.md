---
title: "Tasks: Phase 6: runtime-libraries-and-tests"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "runtime libraries and tests tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 6: runtime-libraries-and-tests

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

- [x] T001 Fix the file list (`scratch/files.txt`)
- [x] T002 Write the work-unit briefs (`scratch/brief-*.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 WU1: Delete nine library folders, one contract and twelve test files (`scratch/brief-wu1.md`)
- [x] T004 WU2: Fix fifteen library and script files until the typecheck is clean (`scratch/brief-wu2.md`)
- [x] T005 WU3: Fix the remaining tests and both plugin guard tests (`scratch/brief-wu3.md`)
- [x] T006 WU4: Fix four runtime docs (`scratch/brief-wu4.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Runtime typecheck exits 0
- [x] T008 Runtime suite matches or beats baseline
- [x] T009 Runtime validators match baseline
- [x] T010 Plugin guard tests pass
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Checks match or beat the baseline
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
- [x] CHK-002 [P0] Technical approach defined in plan.md — `plan.md` work units WU1 to WU4
- [x] CHK-003 [P1] Dependencies identified and available — Phase 005 complete; baseline in `010/scratch/baseline.md`
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks — Runtime typecheck exits 0
- [x] CHK-011 [P0] No console errors or warnings — Full runtime suite and plugin guards print no new warnings
- [x] CHK-012 [P1] Error handling implemented — N/A: removal only, no new error path
- [x] CHK-013 [P1] Code follows project patterns — Edits follow each file's existing patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met — AC-001 to AC-003 Met
- [x] CHK-021 [P0] Manual testing complete — Orchestrator reran typecheck, full runtime suite, validators and all 24 plugin guard tests
- [x] CHK-022 [P1] Edge cases tested — Census test keeps every row accounted for: manifest-owned or named as retired
- [x] CHK-023 [P1] Error scenarios validated — Mutant dropping one retired id fails the census test
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. — cross-consumer: retired lanes removed from libraries, scripts, tests and docs
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. — `rg` for the five lane names over runtime docs returns nothing outside changelog history
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. — Consumers covered: contract digests regenerated, projection-coverage and census tests synced
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. — N/A: no security, path or parser fix
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. — N/A: no matrix
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. — N/A: no process-wide state
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. — Snapshot `6bfe76e9e` to tree `d1d15bc28`
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — No secrets
- [x] CHK-031 [P0] Input validation implemented — N/A: no input handling changed
- [x] CHK-032 [P1] Auth/authz working correctly — N/A: no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized — spec, plan, tasks and summary agree
- [x] CHK-041 [P1] Code comments adequate — Census test comment states why retired ids stay listed
- [x] CHK-042 [P2] README updated (if applicable) — `tests/unit/README.md` rows for deleted tests dropped
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — Briefs and file list kept in `scratch/`
- [x] CHK-051 [P1] scratch/ cleaned before completion — `scratch/` holds only briefs and the file list
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




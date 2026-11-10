---
title: "Tasks: Phase 11: pre-existing-gate-failures"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "pre existing gate failures tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 11: pre-existing-gate-failures

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

- [x] T003 WU1: Sync five authored compiled-routing sources from the runtime copy (orchestrator, five file copies, no brief)
- [x] T004 WU2: Fix the Python scorer for P0-CHROME-002 and rr-iter3-156 (`scratch/brief-wu2.md`)
- [x] T005 WU3: Make the broken-move drill run on the already-moved tree (`scratch/brief-wu3.md`)
- [x] T006 WU4: Make the phrase linter fail open when its YAML dependency is missing, with a test (`scratch/brief-wu4.md`)
- [x] T007 WU5: Drive the hook-installer harness through the source-root sentinel (`scratch/brief-wu5.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Bin vitest passes
- [x] T009 Advisor vitest, pytests and regression pass
- [x] T010 Scorer-eval compare reports no regression
- [x] T011 Broken-move drill exits 0 on a scratch clone of the staged tree
- [x] T012 Every git-hook test script exits 0
- [x] T013 All 33 program gates match or beat the baseline
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

- [x] CHK-001 [P0] Requirements documented in spec.md — REQ-001 to REQ-006 in `spec.md`
- [x] CHK-002 [P0] Technical approach defined in plan.md — `plan.md` WU1 to WU5
- [x] CHK-003 [P1] Dependencies identified and available — Phase 010 gate logs are the baseline
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks — Runtime and advisor typechecks exit 0
- [x] CHK-011 [P0] No console errors or warnings — No new warnings across the 33 gates
- [x] CHK-012 [P1] Error handling implemented — Phrase linter now reaches its own fail-open guard
- [x] CHK-013 [P1] Code follows project patterns — Each fix follows its file's existing pattern
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met — AC-001 to AC-006 Met
- [x] CHK-021 [P0] Manual testing complete — Orchestrator re-ran every worker's proof
- [x] CHK-022 [P1] Edge cases tested — Drill both in place and on a staged-tree clone; harness with a broken-installer probe
- [x] CHK-023 [P1] Error scenarios validated — Fail-open test fails on the unfixed linter
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. — cross-consumer: authored vs runtime routing copies; instance-only: scorer terms, drill, linter, harness
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. — Every runtime routing file compared with its authored source (5 differed, all synced); the 3 other dependency-bound pre-commit gates read and found block-by-design
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. — Graph metadata change regenerated the skill graph; trigger index fresh; Hermes and freshness gates 0
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. — N/A: no security, path or parser fix
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. — 33 program gates plus 10 hook scripts listed with baseline and final
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. — Fail-open test clears NODE_PATH and SPECKIT_SKIP_PHRASE_LINT
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. — Tree `adc67b1af` to tree `f7d0871d5`
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — No secrets
- [x] CHK-031 [P0] Input validation implemented — N/A
- [x] CHK-032 [P1] Auth/authz working correctly — N/A
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized — spec, plan, tasks and summary agree
- [x] CHK-041 [P1] Code comments adequate — New comments keep their durable why, no ids
- [x] CHK-042 [P2] README updated (if applicable) — N/A: no README describes these internals
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — Briefs and file list in `scratch/`
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

**Verification Date**: 2026-10-11
<!-- /ANCHOR:summary -->

---




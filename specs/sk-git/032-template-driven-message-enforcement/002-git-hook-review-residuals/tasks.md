---
title: "Tasks: Phase 2: git-hook-review-residuals"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "git hook residual tasks"
  - "rules probe parity tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2: git-hook-review-residuals

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

- [x] T001 Re-read every residual finding in code; R4-P2-006 refuted (the drift test already covers all nine copies)
- [x] T002 Measure the V8 linear-time regex fallback and reproduce the validator hang (killed after 12 s)
- [x] T003 Baseline the route guard (exit 0) and the route tests (14 pre-existing failures)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Each unit is one DeepSeek dispatch; the diff and suites are checked before the next.

- [x] T004 R1 legacy pre-commit blocks a crashed checker (`.skilled/hooks/git/pre-commit`)
- [x] T005 R2 authored routing program dir defined once in the layout module (`.skilled/bin/lib/compiled-route-layout.cjs`)
- [x] T006 R3 rules probe follows the validator (`.skilled/scripts/git-hooks/lib/message-contract-gate.sh`)
- [x] T007 R4 linear-time regex fallback in both CLI entry points (`validate-message.mjs`, `git-message-gate.mjs`)
- [x] T008 R5 attribution-key drift test (`message-contract.test.mjs`)
- [x] T009 R6 parent acceptance criteria, feature catalog and CI gate map (docs)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run every hook suite and sk-git node test from the final state
- [x] T011 Run each new test against the old code and confirm it fails
- [x] T012 validate.sh --strict on this child and the parent
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Every new test fails on the phase 1 state
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Review**: `../001-git-hook-review-fixes/review/review-report.md`
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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `bash -n` on changed shell files and `node --check` on changed scripts (all parse)
- [x] CHK-011 [P0] No new output in a repository without the toolchain (pre-commit suite sections 43 and 46 still pass)
- [x] CHK-012 [P1] A crashed checker blocks rather than passing (pre-commit section 47)
- [x] CHK-013 [P1] The regex flag is set only in process entry points, never in the imported library
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met (acceptance-criteria.md, 7 of 7 Met)
- [x] CHK-021 [P0] Each new test fails on the old code (R1 and R3 measured by negative control, R2 by restoring the old line, R4 by the hang reproduction, R5 by a drifted key)
- [x] CHK-022 [P1] Edge cases tested (tab heading, word boundary, shadowing .sk-git, missing contractDir, moved program packet)
- [x] CHK-023 [P1] Route guard exits 0 and the route test failures are the same 14 as before
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding classes: R4-P2-001 instance-only, R4-P2-005 cross-consumer (hook, guard, sync), R5-P2-001 cross-consumer (shell probe and validator), R2-P2-002 class-of-bug (every contract regex), R4-P2-002 cross-consumer (stamper and validator), R3 instance-only.
- [x] CHK-FIX-002 [P0] Same-class producer inventory: `rg "015-router-unification-program" .skilled/bin .skilled/scripts` leaves only the layout module and a generated manifest's provenance field.
- [x] CHK-FIX-003 [P0] Consumer inventory: the probe is called by commit-msg and pre-push only; the regex flag covers both CLI processes the hooks and agent gates start.
- [x] CHK-FIX-004 [P0] The probe has adversarial tests for each way it disagreed with the validator.
- [x] CHK-FIX-005 [P1] Matrix axes: probe (config set or not, dir exists or not, template present or not, heading whitespace and word boundary).
- [x] CHK-FIX-006 [P1] Hostile input executed: a catastrophic contract pattern against a 35-character scope.
- [x] CHK-FIX-007 [P1] Evidence pinned to base `f8519088b9` plus phase 1; the commit SHA is recorded at commit time.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] A hostile contract template cannot hang a gate
- [x] CHK-032 [P1] No machine-wide hook names a spec packet path
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments carry no ephemeral ids
- [x] CHK-042 [P2] CI gate map matches the hooks
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in the session scratchpad only
- [x] CHK-051 [P1] scratch/ holds nothing but its placeholder
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-02
<!-- /ANCHOR:summary -->

---

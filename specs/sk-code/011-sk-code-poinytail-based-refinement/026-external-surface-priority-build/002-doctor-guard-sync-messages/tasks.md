---
title: "Tasks: Doctor guard and sync messages"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "doctor guard and sync messages tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Doctor guard and sync messages

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

- [x] T001 Create the worktree from origin/main; confirm the anchors `parent-skill-check.cjs:496`, `doctor-update-apply.yaml:160`, `compiled-route-guard.cjs:65-70` and `:164`, `compiled-route-sync.cjs:39`
- [x] T002 Build the base copy and three variants under the session scratchpad: both example packets deleted; no `specs/`; `specs/` without the 019 folder. Record each control. P9-1 deleted `sk-code-webflow/`, the packet its ledger row names; the control copy printed sync, guard and doctor exit 0
- [x] T003 Run the doctor tests, `run-all.sh` and `compiled-route-manifest.test.cjs` and record the baseline counts
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 3c line names the README adaptation block, with a test (T1) (`.skilled/commands/doctor/scripts/parent-skill-check.cjs`)
- [x] T005 The doctor's compiled-route repair string names the copy-back to the authored manifest, or a commit with hooks (`.skilled/commands/doctor/assets/doctor-update-apply.yaml`)
- [x] T006 The guard's authored-drift line names the runtime manifest and its authored twin and the copy, with a test (T2) (`.skilled/bin/compiled-route-guard.cjs`)
- [x] T007 Sync validates the authored root before `lstat` and stops with one line naming the folder to restore, with a test (T3) (`.skilled/bin/compiled-route-sync.cjs`)
- [x] T008 The guard reports a missing authored manifest as a named failure instead of passing, with a test (T4) (`.skilled/bin/compiled-route-guard.cjs`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run each copy check and record P9-1 to P9-6
- [x] T010 Run the three suites and record P9-7; record T1 to T4 with their before and after exits
- [x] T011 Run `/deep:review :auto` for 5 iterations; fix and record each confirmed finding as an RV row
- [x] T012 Fill the ledger, run `check-goal.cjs` and strict `validate.sh`, delete the copies
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Every criterion in `goal.md` rerun and passing
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Goal**: See `goal.md`
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

- [x] CHK-010 [P0] Changed scripts and YAML pass their lint or parse checks
- [x] CHK-011 [P0] No new console errors or warnings in the live gates
- [x] CHK-012 [P1] Error handling names the failure and the fix
- [x] CHK-013 [P1] Code follows project patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Every ledger row (P9-1 to P9-7 and T1 to T4) recorded with a backticked proof
- [x] CHK-022 [P1] Edge cases in `spec.md` checked
- [x] CHK-023 [P1] Copy runs stayed outside the worktree. Every copy path was checked with `pwd -P` against the scratchpad prefix.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. Guard consumers: CI `routing-registry-drift.yml:172`, pre-push and pre-commit (reads `HUBS` only), `typo-flags.test.cjs`; the bin README.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. Not applicable: no security, path-parsing or redaction fix; the new lines print repository-relative paths and never execute them.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. Pinned to `4b9bf840b0..015d7ea3d0`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Paths a script now reports are repository-relative and printed, never executed
- [x] CHK-032 [P1] Auth/authz working correctly: not applicable, no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments keep the durable why and no packet labels
- [x] CHK-042 [P2] README updated (if applicable): `.skilled/bin/README.md` updated (review finding R3-P2-001).
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. All copies and briefs lived in the session scratchpad, outside the repository.
- [x] CHK-051 [P1] scratch/ cleaned before completion: `scratch/` holds only `.gitkeep`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-13
<!-- /ANCHOR:summary -->

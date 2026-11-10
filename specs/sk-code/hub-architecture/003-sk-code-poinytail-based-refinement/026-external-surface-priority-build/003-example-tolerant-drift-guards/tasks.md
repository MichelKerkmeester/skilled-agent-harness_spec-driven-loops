---
title: "Tasks: Example-tolerant drift guards"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "example-tolerant drift guards tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Example-tolerant drift guards

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

- [x] T001 Create the worktree from origin/main; confirm the anchors `verify-router-sync.cjs:31-32`, `:124-131`, `:244-251` and `verify-doc-claims.cjs:42-44`, `:319`
- [x] T002 Record the live baseline: `run-all-drift-guards.sh` exit 0, and its per-check output
- [x] T003 Build the removal copy by the research recipe (F84) and record the wrapper's failures there: check 2 ENOENT, check 3 archived gold
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Filter `SURFACES` and `SURFACE_PACKETS` to packets present on disk, with a test (T1) (`verify-router-sync.cjs`)
- [x] T005 Skip archived route-gold destinations whose mode the leaf manifest no longer declares, with a test (T2) (`verify-router-sync.cjs`)
- [x] T006 Start the leg 1a prose scan at the first `## N. <NAME> MAP` heading instead of the literal Webflow heading, with a test (T3) (`verify-router-sync.cjs`)
- [x] T007 Derive the doc-claims surface count from the registry instead of assuming three, with a test (T4) (`verify-doc-claims.cjs`)
- [x] T008 Release the sk-code-skilled packet once: `SKILL.md` version and one changelog entry
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Rerun the live wrapper and record P10-1; run the copy checks and record P10-2 to P10-5
- [x] T010 Record T1 to T4 with their before and after exits
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
- [x] CHK-021 [P0] Every ledger row (P10-1 to P10-5 and T1 to T4) recorded with a backticked proof
- [x] CHK-022 [P1] Edge cases in `spec.md` checked
- [x] CHK-023 [P1] Copy runs stayed outside the worktree
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. Applies to the registry parse only: one unreadable-registry test; no path, delimiter or redaction surface changed.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. Not applicable: the guards read only their own location and the files under the hub.
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
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
- [x] CHK-042 [P2] README updated (if applicable)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] scratch/ cleaned before completion
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

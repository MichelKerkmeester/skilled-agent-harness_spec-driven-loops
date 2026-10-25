---
title: "Tasks: Phase 2: consume-locked-withdraw"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "consume locked withdraw tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2: consume-locked-withdraw

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

- [ ] T001 Confirm phase 001 is Complete (`../001-model-effort-atomic-replay/`)
- [ ] T002 Run the baseline test commands and save the output in `scratch/`
- [ ] T003 [P] Add failing tests "consume reports withdrawn for a record withdrawn before it" and "consume output has no withdrawn key for an armed record" (`.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs`)
- [ ] T004 [P] Add failing test "a withdraw between approval and consume declines with the runtime exit code", asserting no `handed-over` history line (`.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs`)
- [ ] T005 Run the new tests and record that they fail on the current code
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 Read, check and unlink the record inside one `withAppendLock` call; parse the note after the lock (`.skilled/hooks/session-relaunch/bin/session-relaunch.cjs`)
- [ ] T007 Add `withdrawn: true` to consume output only for a withdrawn record (`.skilled/hooks/session-relaunch/bin/session-relaunch.cjs`)
- [ ] T008 Add a `consumed_withdrawn` reader beside `consumed_note_state` (`.skilled/bin/skilled-loop`)
- [ ] T009 After `consume_record` on the approved path, print the withdrawn warning and exit with `runtime_exit` when withdrawn (`.skilled/bin/skilled-loop`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009a Before each `print_manual_command` after a consume on the approved path (about `:709`, `:715`, `:724`), check `consumed_withdrawn` and skip the claim command for a withdrawn record, reusing the previous-hop unclaimed-note warning block at about `:886-890` (`.skilled/bin/skilled-loop`)
- [ ] T010 Run the full test commands from `plan.md` and compare with the baseline
- [ ] T011 Confirm the exact-shape consume tests pass with unedited expectations
- [ ] T012 No live proof required; record that in `implementation-summary.md`
- [ ] T013 Update `acceptance-criteria.md` evidence and `implementation-summary.md`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Every row in `acceptance-criteria.md` is Met
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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks
- [ ] CHK-011 [P0] No console errors or warnings
- [ ] CHK-012 [P1] Error handling implemented
- [ ] CHK-013 [P1] Code follows project patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Manual testing complete
- [ ] CHK-022 [P1] Edge cases tested
- [ ] CHK-023 [P1] Error scenarios validated
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Input validation implemented
- [ ] CHK-032 [P1] Auth/authz working correctly
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Code comments adequate
- [ ] CHK-042 [P2] README updated (if applicable)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 16 | 0/16 |
| P1 Items | 14 | 0/14 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-10-25
<!-- /ANCHOR:summary -->

---




---
title: "Tasks: Phase 3: manual-claim-live-settings"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "manual claim live settings tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3: manual-claim-live-settings

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

- [ ] T001 Confirm phases 001 and 004 are Complete (`../001-model-effort-atomic-replay/`, `../004-manual-claim-goal-binding/`)
- [ ] T002 Record baseline pass and fail counts of both test commands in plan.md §5
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Write failing tests "manual command carries the live model and effort" (AC-001), "Cursor manual command carries the live Cursor model" (AC-002) and "manual command after a model-switching hop carries the current hop's model" (AC-005), and see them fail. Add "manual command keeps the launch model for an invalid live model" (AC-004) as a regression guard: it passes today and must pass before and after (`.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs`)
- [ ] T004 Add a helper that rebuilds the template and the conflict check from the consumed live model and effort with `model_is_valid`, phase 001's single effort-rule function and `shell_quote_argument`, inside a command substitution so the `launch_arguments` reset never reaches the current shell (`.skilled/bin/skilled-loop`)
- [ ] T005 Call the helper before every post-consume `print_manual_command`, at `:711`, `:717`, `:726`, `:746`, `:876` and `:889` (`.skilled/bin/skilled-loop`)
- [ ] T006 After the live settings block (about `:828`) and before `build_relaunch_arguments "$launch_prompt"` (about `:829`), rebuild the template from the current settings, re-export `SKILLED_LOOP_MANUAL_TEMPLATE` and recompute `manual_template_conflict`, so the next hop's in-session hop-cap command (`session-relaunch.cjs:516`) is current too (`.skilled/bin/skilled-loop`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Run both test commands; new tests pass, the AC-004 guard still passes, existing manual command tests pass unedited
- [ ] T008 No live proof required; note that in implementation-summary.md
- [ ] T009 Mark acceptance-criteria.md rows with evidence and update spec, plan and tasks
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Every acceptance-criteria.md row Met
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
| P0 Items | [X] | [ ]/[X] |
| P1 Items | [Y] | [ ]/[Y] |
| P2 Items | [Z] | [ ]/[Z] |

**Verification Date**: 2026-10-25
<!-- /ANCHOR:summary -->

---




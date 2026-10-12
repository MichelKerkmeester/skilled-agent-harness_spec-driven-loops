---
title: "Tasks: Playbook root and stale refs"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "playbook root and stale refs tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Playbook root and stale refs

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

- [x] T001 Measure the root warnings by running `backtickPathChecks` over every root file (scratch) Evidence: 70 warnings in 13 root files, plus the 1 scenario warning, on origin/main `b4d4e90192`
- [x] T002 Read each warning's target and decide its correction, successor, removal or Remaining row
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 RR-1: run `backtickPathChecks` on the root file in `validatePackage()`, add a root-file test case, bump sk-doc to 2.3.9.0 (`.skilled/skills/sk-doc/`)
- [ ] T004 RR-2.01 to RR-2.13: correct the 13 root files (`.skilled/skills/*/manual-testing-playbook/manual-testing-playbook.md`)
- [ ] T005 SR-1 to SR-6: the six stale references
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 Rerun the validator: exit 0, scenario count 1, root count equal to the Remaining rows
- [ ] T007 Run the five-iteration `/deep:review :auto` and fix confirmed P0 to P2 findings
- [ ] T008 Fill the ledger and Remaining table, then run the goal criteria, `check-goal.cjs` and strict `validate.sh`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks
- [ ] CHK-011 [P0] No warnings beyond the Remaining rows and the scenario row
- [ ] CHK-012 [P1] Error handling implemented: not applicable, the check is report-only
- [ ] CHK-013 [P1] Code follows project patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met (REQ-001 to REQ-005)
- [ ] CHK-021 [P0] Root count equals the Remaining rows, scenario count 1
- [ ] CHK-022 [P1] Edge cases checked: external project test module, missing prefix, deleted file with no successor, file checked for absence
- [ ] CHK-023 [P1] Each successor read and confirmed to cover the same subject
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

- [x] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Input validation implemented: not applicable to a report-only check
- [x] CHK-032 [P1] Auth/authz working correctly: not applicable, no auth surface
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
| P0 Items | 13 | 3/13 |
| P1 Items | 13 | 2/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-10-12
<!-- /ANCHOR:summary -->

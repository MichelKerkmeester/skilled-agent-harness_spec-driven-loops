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

- [x] T003 RR-1: run `backtickPathChecks` on the root file in `validatePackage()`, add a root-file test case, bump sk-doc to 2.3.9.0 (`.skilled/skills/sk-doc/`) Evidence: commit `0099d2c6d7`
- [x] T004 RR-2.01 to RR-2.13: correct the 13 root files (`.skilled/skills/*/manual-testing-playbook/manual-testing-playbook.md`) Evidence: commit `45d7fca7fd`, root warnings 70 to 1
- [x] T005 SR-1 to SR-6: the six stale references Evidence: commit `45d7fca7fd`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Rerun the validator: exit 0, scenario count 1, root count equal to the Remaining rows Evidence: exit 0, 1 root and 1 scenario line, 1 Remaining row
- [x] T007 Run the five-iteration `/deep:review :auto` and fix confirmed P0 to P2 findings Evidence: `review/review-report.md`, 0 P0, 0 P1, 5 P2: four fixed in `3c808f6d55` and the closeout, one rejected
- [x] T008 Fill the ledger and Remaining table, then run the goal criteria, `check-goal.cjs` and strict `validate.sh` Evidence: goal criteria 1 to 7 print what they claim; `check-goal.cjs` RESULT: PASSED; `validate.sh --strict` RESULT: PASSED
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
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

- [x] CHK-010 [P0] Code passes lint/format checks. Evidence: `node --check` on the validator and its test exits 0
- [x] CHK-011 [P0] No warnings beyond the Remaining rows and the scenario row. Evidence: 1 root and 1 scenario `BACKTICK_PATH_UNRESOLVED` line
- [x] CHK-012 [P1] Error handling implemented: not applicable, the check is report-only
- [x] CHK-013 [P1] Code follows project patterns. Evidence: the root call mirrors the scenario call one line below it
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met (REQ-001 to REQ-005). Evidence: `acceptance-criteria.md`, five rows Met
- [x] CHK-021 [P0] Root count equals the Remaining rows, scenario count 1
- [x] CHK-022 [P1] Edge cases checked: external project test module, missing prefix, deleted file with no successor, file checked for absence
- [x] CHK-023 [P1] Each successor read and confirmed to cover the same subject
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. Evidence: `review/review-report.md` section 2
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. Evidence: the full validator run is the inventory for the root class; each stale token was grepped repo-wide before its fix
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. Evidence: not applicable; the change adds no parsing rule, and the root case pins one resolving and one missing path
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. Evidence: not applicable, the validator reads no environment variables for this check
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. Evidence: commits named by SHA
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation implemented: not applicable to a report-only check
- [x] CHK-032 [P1] Auth/authz working correctly: not applicable, no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate
- [x] CHK-042 [P2] README updated (if applicable): not applicable
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
| P0 Items | 13 | 13/13 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-12
<!-- /ANCHOR:summary -->

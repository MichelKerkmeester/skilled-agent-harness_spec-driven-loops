---
title: "Tasks: Playbook path repair"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "playbook path repair tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Playbook path repair

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

- [x] T001 Capture the validator report and the per-package counts, and confirm they match the ledger or record the delta (scratch) Evidence: 258 warnings in 28 packages, matching the ledger
- [x] T002 Group each package's warnings by cause: wrong base, removed or renamed target, not a repo path
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [P] PP-02 to PP-08: the seven cli-external-orchestration packages, 135 warnings (`.skilled/skills/cli-external-orchestration/*/manual-testing-playbook/`) Evidence: commit `f30918f94b`, all seven packages print 0 except cli-cursor at 1 (RM-1)
- [x] T004 [P] PP-28: system-spec-kit, 30 warnings (`.skilled/skills/system-spec-kit/manual-testing-playbook/`) Evidence: commit `cd34e1fbbe`, 30 to 0
- [x] T005 [P] PP-13 to PP-16 and PP-23: sk-code and sk-vision packages Evidence: commit `3be9030128`
- [x] T006 [P] PP-01, PP-09 to PP-12, PP-17 to PP-22, PP-24 to PP-27: the remaining packages Evidence: commits `3be9030128` and `cd34e1fbbe`
- [x] T007 PP-V: add a narrow validator rule only if one clearly marked class is cheaper to mark than to rewrite, with its test, and bump sk-doc once Evidence: commit `82c90e85b7`, sk-doc 2.3.7.0
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Rerun the validator; the count equals the Remaining rows and the exit is 0 Evidence: exit 0, 1 warning, 1 Remaining row
- [x] T009 Run `cite-drift-scan.mjs` and re-anchor any citation an edit shifted Evidence: `cite-drift-gate.mjs --base f3b4e90c94`, which runs the scan over the changed docs, exits 0
- [x] T010 Fill the ledger and the Remaining table, then run `check-goal.cjs` and strict `validate.sh` Evidence: ledger and RM-1 in implementation-summary.md
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

- [x] CHK-010 [P0] Code passes lint/format checks (validator change only). Evidence: `node --check` exits 0
- [x] CHK-011 [P0] No console errors or warnings beyond the Remaining rows. Evidence: 1 `BACKTICK_PATH_UNRESOLVED` line, 1 Remaining row
- [x] CHK-012 [P1] Error handling implemented: not applicable unless the validator changes
- [x] CHK-013 [P1] Code follows project patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met (REQ-001 to REQ-005)
- [x] CHK-021 [P0] Validator count equals the Remaining rows
- [x] CHK-022 [P1] Edge cases checked: wrong base, archived packet, placeholder, external project path
- [x] CHK-023 [P1] Each successor read and confirmed to cover the same subject
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. Evidence: `review/review-report.md` section 2
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. Evidence: every corrected token was searched for in the root playbook files, and the stale ones in four roots were fixed
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. Evidence: the two rules are report-only skips; the tests pin the `.skilled/releases/` prefix boundary and a symlinked path against an unlinked one, and the outside-root case is recorded as rejected finding R4-P2-001
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. Evidence: not applicable, the validator reads no environment variables
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. Evidence: commits are named by SHA
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation implemented: not applicable to doc edits
- [x] CHK-032 [P1] Auth/authz working correctly: not applicable, no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate
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
| P0 Items | 13 | 13/13 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-12
<!-- /ANCHOR:summary -->

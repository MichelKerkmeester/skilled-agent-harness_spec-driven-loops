---
title: "Tasks: README freshness fixes"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "readme freshness fixes tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: README freshness fixes

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

- [x] T001 Rerun every research claim and record each count (scratch) Evidence: ledger rows F1 to F23 carry the command and its output
- [x] T002 Baseline the doctor on the five hubs and the doctor suite Evidence: 13c printed 3 FAIL and 2 WARN; the suite passed 98 of 98
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 F1 to F23: literal replacements through cli-devin Evidence: commits `6e8564ff92` and `0861a11c6f`
- [x] T004 Remove check 13c and replace its tests (`.skilled/commands/doctor/scripts/`) Evidence: commit `0e2b905e9f`
- [x] T005 Stop naming the retired check in the versioning standard Evidence: commit `3ec902274c`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Doctor suite, five hubs, byte-for-byte dispatch check Evidence: 97 of 97, no 13c line, 15 files match
- [x] T007 Run the five-iteration `/deep:review :auto` and fix confirmed P0 to P2 findings Evidence: `review/review-report.md`, 0 P0, 0 P1, 2 P2, both fixed
- [x] T008 Run the goal criteria, `check-goal.cjs` and strict `validate.sh` Evidence: goal log; `check-goal.cjs` RESULT: PASSED; `validate.sh --strict` RESULT: PASSED
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

- [x] CHK-010 [P0] Code passes lint/format checks. Evidence: `node --check` on `parent-skill-check.cjs` and its test exits 0
- [x] CHK-011 [P0] No new warnings. Evidence: the five hubs' doctor output differs from the baseline only by the removed 13c line and its count
- [x] CHK-012 [P1] Error handling implemented: not applicable, a check was removed
- [x] CHK-013 [P1] Code follows project patterns. Evidence: the new test uses the suite's `buildHub` and `runChecker` helpers like its neighbours
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met (REQ-001 to REQ-006). Evidence: `acceptance-criteria.md`, six rows Met
- [x] CHK-021 [P0] Doctor suite passes and the new test fails with 13c restored
- [x] CHK-022 [P1] Edge cases checked: a count inside an ASCII box keeps its width; a source that disagrees with itself drops the number
- [x] CHK-023 [P1] Each research claim rerun before its edit, with three proposals corrected (F11, F16, F13's extra lines)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: the README rows are `instance-only` with their repeats folded in; 13c is `cross-consumer` (check, tests, versioning doc)
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. Evidence: each stale number was grepped across its README, which found `:98`, `:125`, `:147`, `:785` and the git hooks `:20` and `:121`
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. Evidence: `grep -rn 'readme-version\|README_VERSION\|checkReadmeVersion' .skilled` found only the check and its test; `frontmatter-versioning.md:122` named the check in prose
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. Evidence: not applicable, no parser or path logic changed
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Evidence: 23 F rows, 4 DC rows, 3 RM rows
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. Evidence: not applicable, the removed check read no environment
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. Evidence: commits named by SHA
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation implemented: not applicable, a check was removed
- [x] CHK-032 [P1] Auth/authz working correctly: not applicable, no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate. Evidence: the section header names the checks that remain
- [x] CHK-042 [P2] README updated (if applicable): the phase is README updates
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] scratch/ cleaned before completion. Evidence: the review diff file was removed; only `.gitkeep` remains
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

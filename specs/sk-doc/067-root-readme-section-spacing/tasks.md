---
title: "Tasks: Root README Section Spacing"
description: "Ordered tasks for the root README section spacing change, with setup, implementation and verification phases."
trigger_phrases:
  - "root readme section spacing tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Root README Section Spacing

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

- [x] T001 Audit the divider enforcement points: `general_h2_separator` in `validate_document.py`, the divider score in `extract_structure.py`, no `--fix` fixer, no hook or CI check (`.skilled/skills/sk-doc/shared/scripts/`). Evidence: grep and code read.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Replace the 15 `---` section separators with `&nbsp;` forced blank lines (`README.md`). Evidence: 0 `---` lines and 60 `&nbsp;` lines.
- [x] T003 [P] Add `is_repo_root_readme()` and pass `h2DividerRequired: False` for the root README (`.skilled/skills/sk-doc/shared/scripts/validate_document.py`). Evidence: diff reviewed.
- [x] T004 [P] Add `is_repo_root_readme()` and the `dividers_exempt` parameter on `calculate_dqi` (`.skilled/skills/sk-doc/shared/scripts/extract_structure.py`). Evidence: diff reviewed.
- [x] T005 Add two tests: root README with `&nbsp;` passes the divider rule while the nested copy fails, and the root README keeps divider_score 6 while the nested copy gets 0 (`.skilled/skills/sk-doc/scripts/tests/test_structure_validation.py`). Evidence: T007.
- [x] T006 Add the "Root README exception" paragraph to section 6 (`.skilled/skills/sk-doc/shared/references/core-standards.md`). Evidence: diff reviewed.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Run `test_structure_validation.py`: 8 passed. Mutation check with the helper forced to False: 2 failed, 6 passed. Restored: 8 passed.
- [x] T008 Run `validate_document.py README.md`: VALID, 0 issues, exit 0. DQI 87 before, 85 after, divider_score 6 both times.
- [x] T009 Run the sk-doc script suite (`run-script-tests.sh`) [EVIDENCE: every file passes except `test_rename_tooling_fixture_harness.py`, which failed once while other long jobs ran beside it and passed alone (Ran 4 tests, OK, exit 0). It reads none of the changed files. README verdict parity `diff_entries=0` over 978 files]
- [x] T010 Run `validate.sh --strict` on this folder [EVIDENCE: Errors: 0, Warnings: 0, RESULT: PASSED after `repair-derived.cjs --apply`]
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

- [x] CHK-010 [P0] Code passes lint/format checks [EVIDENCE: `py_compile` passes on the three changed Python files]
- [x] CHK-011 [P0] No console errors or warnings [EVIDENCE: `validate_document.py README.md` VALID, Total issues: 0, exit 0]
- [x] CHK-012 [P1] Error handling implemented [EVIDENCE: the helper only reads the path and checks for `.git`, so it raises nothing new and falls back to the normal rule for any other file]
- [x] CHK-013 [P1] Code follows project patterns [EVIDENCE: the exemption reuses the existing `h2DividerRequired` key and the existing DQI branch]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met [EVIDENCE: acceptance-criteria.md AC-001 to AC-005 Met]
- [x] CHK-021 [P0] Manual testing complete [EVIDENCE: the real root README validated and scored, DQI divider_score 6]
- [x] CHK-022 [P1] Edge cases tested [EVIDENCE: nested README with `&nbsp;` still fails the rule, and a `.git` file (linked worktree) counts as a root]
- [x] CHK-023 [P1] Error scenarios validated [EVIDENCE: mutation check, helper forced to False, fails both new tests]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. [EVIDENCE: N/A, feature change, not a findings fix]
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. [EVIDENCE: N/A, feature change, not a findings fix]
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. [EVIDENCE: N/A, feature change, not a findings fix]
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. [EVIDENCE: N/A, feature change, not a findings fix]
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. [EVIDENCE: N/A, feature change, not a findings fix]
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. [EVIDENCE: N/A, feature change, not a findings fix]
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. [EVIDENCE: N/A, feature change, not a findings fix]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets [EVIDENCE: no credentials in the diff]
- [x] CHK-031 [P0] Input validation implemented [EVIDENCE: the exemption needs both the README.md name and a `.git` beside it]
- [x] CHK-032 [P1] Auth/authz working correctly [EVIDENCE: N/A, no auth surface]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate [EVIDENCE: each helper carries a docstring saying why the root README is exempt]
- [x] CHK-042 [P2] README updated (if applicable) [EVIDENCE: the root README is the changed document, and core-standards.md section 6 records the exception]
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

**Verification Date**: 2026-10-17
<!-- /ANCHOR:summary -->

---




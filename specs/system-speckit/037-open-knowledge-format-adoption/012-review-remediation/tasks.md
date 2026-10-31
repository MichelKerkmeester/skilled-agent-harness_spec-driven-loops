---
title: "Tasks: Phase 12: review-remediation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "050 review remediation tasks"
  - "review finding fixes"
  - "fail before pass after"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 12: review-remediation

<!-- SPECKIT_LEVEL: 1 -->

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

- [x] T001 Re-read each finding at its cited lines and confirm it holds (`../review/review-report.md` §3)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 [P] Require a real calendar day in `cutoffDate` (`.skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs`)
- [x] T003 [P] Drop a YAML inline comment from the scalar (`.skilled/skills/system-spec-kit/runtime/cli/rules/check-frontmatter-values-helper.cjs`)
- [x] T004 [P] The same rule in `validate_frontmatter_values` (`.skilled/skills/sk-doc/shared/scripts/validate_document.py`)
- [x] T005 [P] Drop the comment and fold case for the two shared-list fields (`.skilled/skills/system-skill-advisor/runtime/scripts/check-skill-doc-frontmatter.mjs`)
- [x] T006 [P] Leave line-feed paths out of the batch read (`.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 One new case per finding; each fails on the pre-fix source and passes on the fix (vitest 2 + 1 failures before, 0 after; Python 7/8 before, 8/8 after; census 63/64 before, 64/64 after)
- [x] T008 Existing suites for the touched files pass (`check-source-tags` + `check-frontmatter-values` 22/22, skill-doc checker 3/3, census 64/64)
- [x] T009 Skill-doc checker on the real tree is unchanged: `docs=101 violations=0` before and after, in `--shape` and `--coverage`
- [x] T010 Every sk-doc Python test suite passes (`.skilled/skills/sk-doc/scripts/tests/test_*.py`): 33 of 33. `test_rename_tooling_fixture_harness.py` failed once while phase docs were being written into the worktree it snapshots, and passed on a quiet rerun (4 tests OK, 952 s)
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
- **Review**: See `../review/review-report.md`
<!-- /ANCHOR:cross-refs -->

---

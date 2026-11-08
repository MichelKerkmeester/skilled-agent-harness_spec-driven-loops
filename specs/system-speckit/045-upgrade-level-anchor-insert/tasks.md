---
title: "Tasks: Insert Level 2 sections above the questions anchor on upgrade"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "upgrade level anchor insert tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Insert Level 2 sections above the questions anchor on upgrade

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`U` is `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-level.sh`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Reproduce the defect on a fresh Level 1 packet (`U`). Verify: the L2 headings print between `(questions anchor open)` and `## 10. OPEN QUESTIONS`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Split above the anchor in both heading branches (`U`). Verify: `bash -n U` exits 0.
- [x] T003 Add the anchor-position test (`runtime/cli/tests/upgrade-level-sections.vitest.ts`). Verify: it fails against the old script and passes against the new one.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T004 Rerun both suites and validate an upgraded packet. Verify: vitest 4 of 4, `test-upgrade-level.sh` 14 of 14, `validate.sh --strict` prints `RESULT: PASSED` with `ANCHORS_VALID` passing.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] An upgraded Level 1 packet passes strict validation
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Origin**: question 5 in `specs/system-skilled-doctor/001-skill-and-overlay-build/005-barter-parity/scratch/morning-decisions.md`
<!-- /ANCHOR:cross-refs -->

---

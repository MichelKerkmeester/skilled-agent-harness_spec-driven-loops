---
title: "Tasks: Phase 1: layout-tooling-and-pilot"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "layout tooling and pilot tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 1: layout-tooling-and-pilot

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Write the 11 scope lists and the pilot list (`../scratch/lists/`). Verify: the line counts add up to 1,576 with no path twice.
- [x] T002 Measure each list with the shape check (`check_changelog_shape.py`). Verify: a baseline count per rule is saved to `../scratch/baseline.txt`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Copy and adapt the driver with the fact lock (`../scratch/rewrite-driver.cjs`). Verify: `--dry-run` prints the writer as `opencode-go/hy4-flash-free#high`.
- [x] T004 Write the rewrite and fact-check briefs (`../scratch/brief-rewrite.md`, `../scratch/brief-verify.md`). Verify: the rewrite brief carries the template tiers and the compact model entry, and the fact-check brief lists what is not a problem.
- [x] T005 Run the pilot (`../scratch/lists/pilot.txt`). Verify: the state file records a result for all 20 files.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Recheck the pilot on disk (`../scratch/wave-verify.cjs`). Verify: it prints 0 failures.
- [x] T007 Validate the phase (`001-layout-tooling-and-pilot/`). Verify: `validate.sh --strict` prints `RESULT: PASSED`.
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

---
title: "Tasks: Add Hy4 Flash Free to the cli-opencode roster through the opencode-go provider at both thinking levels"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "hy4 flash free opencode roster tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Add Hy4 Flash Free to the cli-opencode roster through the opencode-go provider at both thinking levels

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

`R` is `.skilled/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md`. `M` is `opencode-go/hy4-flash-free`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the catalog entry for `M` (OpenCode 1). Verify: `opencode1 models opencode-go --verbose` shows variants `none` and `high`.
- [x] T002 Dispatch one turn per level (OpenCode 1). Verify: `opencode1 run -m M --variant none` and `--variant high` each print `OK` and exit 0.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add the `M` row and the Hy4 family name (`R`). Verify: `rg -n 'hy4-flash-free' R` prints the row.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T004 Check the row names both levels (`R`). Verify: the `rg` line holds `none` and `high`.
- [x] T005 Validate the packet. Verify: `validate.sh <packet> --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: both live dispatches printed `OK`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

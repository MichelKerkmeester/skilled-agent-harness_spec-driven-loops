---
title: "Tasks: Reword the status and push rows of the spec folder write recipe post-checks"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "fix write recipe post checks tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Reword the status and push rows of the spec folder write recipe post-checks

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

- [x] T001 Read section 4 and the Workspace bullet of Step 7 (`.skilled/skills/system-spec-kit/references/workflows/spec-folder-write-recipe.md`)
- [x] T002 Confirm `git status` still listed peer-owned paths after the previous commit
- [x] T003 [P] Search the skill, command and rule trees for other copies of the two old rows
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Reword the status row of section 4 (`.skilled/skills/system-spec-kit/references/workflows/spec-folder-write-recipe.md`)
- [x] T005 Reword the push row of section 4 (`.skilled/skills/system-spec-kit/references/workflows/spec-folder-write-recipe.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Confirm both old rows hit the recipe at `HEAD` and are gone from the working file
- [x] T007 Confirm the Workspace bullet the push row points at exists
- [x] T008 Confirm the two new rows hold no em dash and no semicolon
- [x] T009 Run `validate.sh --strict` on this packet and read `RESULT: PASSED`
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

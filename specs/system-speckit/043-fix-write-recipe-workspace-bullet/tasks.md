---
title: "Tasks: Reword the workspace bullet of the spec folder write recipe commit step"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Reword the workspace bullet of the spec folder write recipe commit step

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

- [x] T001 Read the workspace and remote push rules in sk-git (`.skilled/skills/sk-git/SKILL.md`)
- [x] T002 Read the remote allowlist file and its `main` note (`.skilled/skills/sk-git/scripts/remote-branch-allowlist.txt`)
- [x] T003 [P] Search the skill, command and rule trees for other copies of the old bullet
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Reword the workspace bullet of Step 7 (`.skilled/skills/system-spec-kit/references/workflows/spec-folder-write-recipe.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Confirm the old wording hits the recipe at `HEAD` and is gone from the working file
- [x] T006 Confirm both quoted headings and the allowlist sentence exist in `SKILL.md`
- [x] T007 Confirm the new bullet holds no em dash and no semicolon
- [x] T008 Run `validate.sh --strict` on this packet and read `RESULT: PASSED`
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

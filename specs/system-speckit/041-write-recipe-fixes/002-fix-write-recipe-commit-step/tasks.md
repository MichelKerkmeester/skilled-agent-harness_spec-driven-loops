---
title: "Tasks: Bring the commit step of the spec folder write recipe in line with the commit hook"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "fix write recipe commit step tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Bring the commit step of the spec folder write recipe in line with the commit hook

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

- [x] T001 Read the hook's scope, attribution and body rules (`.skilled/scripts/git-hooks/commit-msg`)
- [x] T002 Read the sk-git message contract (`.skilled/skills/sk-git/assets/commit-message-template.md`)
- [x] T003 Run the hook on four message files shaped the old and new ways and record the baseline
- [x] T004 [P] Search the skill, command and rule trees for other copies of the stale wording
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Rewrite the commit bullets of Step 7 (`.skilled/skills/system-spec-kit/references/workflows/spec-folder-write-recipe.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Rerun the hook on the message files and add the `Claude-Session:` and trailer-only cases
- [x] T007 Confirm the sk-git paths the recipe names exist, and that the priority list is in `SKILL.md`
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

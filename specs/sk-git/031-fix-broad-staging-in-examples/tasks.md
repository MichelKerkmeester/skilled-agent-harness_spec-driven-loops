---
title: "Tasks: Replace broad staging in sk-git examples with explicit paths"
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
# Tasks: Replace broad staging in sk-git examples with explicit paths

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

- [x] T001 Read the scoped-staging rule (`.skilled/skills/sk-git/references/commit-workflows.md`)
- [x] T002 [P] Search every doc root for every `git add -A`, `git add .` and directory staging, and classify each hit
- [x] T003 [P] Run `verify` on all three files to get the derived versions
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Replace `git add -A` in Example 5 with explicit paths and a staged-set check (`.skilled/skills/sk-git/references/finish-workflows.md`)
- [x] T005 Replace the directory staging line with explicit file paths (`.skilled/skills/sk-git/references/commit-workflows.md`)
- [x] T006 Qualify the directory option in the staging cheat sheet (`.skilled/skills/sk-git/references/shared-patterns.md`)
- [x] T007 Apply the derived versions, then set each build segment one higher for this commit (all three files)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Confirm each old line hits its file at `HEAD` and is gone from the working file
- [x] T009 Confirm the added lines hold no em dash and no semicolon
- [x] T010 Run `validate.sh --strict` on this packet and read `RESULT: PASSED`
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

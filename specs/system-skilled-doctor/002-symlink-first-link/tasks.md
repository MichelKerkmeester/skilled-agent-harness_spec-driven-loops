---
title: "Tasks: Link everything on the first symlink run and keep its relative links ignored"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "symlink first link tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Link everything on the first symlink run and keep its relative links ignored

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

`E` is `.skilled/commands/doctor/scripts/symlink-engine.cjs`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Reproduce on an empty project (`E`). Verify: the first run leaves `.claude` and `.opencode` `partial-merge` and git lists three relative links.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Count planned targets and ignore the links (`E`). Verify: `node --check E` exits 0.
- [x] T003 Add the first-link and second-plan tests (`tests/symlink-engine.test.cjs`). Verify: both fail against the old engine.
- [x] T004 Drop the workaround notes (`SETUP.md`). Verify: `validate_document.py SETUP.md` reports no blocking error.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Rerun the suite and one real link. Verify: doctor suite 1,071 of 1,071, `check` `linked-merge` everywhere and `git status` empty after one run.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] One link run on a new project links everything
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Origin**: found while testing `SETUP.md` in `specs/system-skilled-doctor/001-skill-and-overlay-build/006-setup-guide`
<!-- /ANCHOR:cross-refs -->

---

---
title: "Tasks: Provision private local commands in the form the primary checkout holds them"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "provision private command links tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Provision private local commands in the form the primary checkout holds them

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

`N` is `.skilled/skills/sk-git/scripts/worktree-naming.sh`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Compare the `local-*` entry forms in the primary and a provisioned worktree (`N`). Verify: the primary holds files, relative links and a folder while the worktree holds only absolute links.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Recreate each entry by form (`N`). Verify: `bash -n N` exits 0.
- [x] T003 Assert each form in the provisioning test and describe it in `SKILL.md` (`scripts/tests/worktree-naming.test.sh`, `SKILL.md`). Verify: the new assertions fail against the old function.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T004 Rerun the suite. Verify: `worktree-naming.test.sh` ends `PASS=174 FAIL=0`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] The provisioning suite ends `FAIL=0`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Origin**: question 6 in `specs/system-skilled-doctor/001-skill-and-overlay-build/005-barter-parity/scratch/morning-decisions.md`
<!-- /ANCHOR:cross-refs -->

---

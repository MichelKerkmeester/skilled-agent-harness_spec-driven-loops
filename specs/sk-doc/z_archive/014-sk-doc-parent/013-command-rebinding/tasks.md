---
title: "Tasks: Repoint the 7 /create command YAMLs + README.txt"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "sk-doc command rebinding tasks"
  - "sk-doc parent phase 013 tasks"
importance_tier: "normal"
contextType: "implementation"
---
> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Tasks: Repoint the 7 /create command YAMLs + README.txt

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [ ] T001 Confirm phases 005 through 012 landed their packet homes and shared paths (`../005-create-skill/` through `../012-doc-quality/`)
- [ ] T002 Confirm the phase 004 facade set is in place (`../004-shared-backbone/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Repoint the 7 auto.yaml/confirm.yaml pairs to the new child homes and shared paths (`.opencode/command/create/`)
- [ ] T004 Regenerate the commands/create/README.txt reference table (`.opencode/command/create/README.txt`)
- [ ] T005 Fix the folder_readme error-handler string (`.opencode/command/create/`)
- [ ] T006 Flip the self-hosting parent_skill_* template references in the same atomic change (`.opencode/skills/sk-doc/`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Run the per-command runtime smoke check for missing-path breaks (`.opencode/command/create/`)
- [ ] T008 Run `validate.sh` for this folder
- [ ] T009 Confirm the shared-backbone facades still resolve
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

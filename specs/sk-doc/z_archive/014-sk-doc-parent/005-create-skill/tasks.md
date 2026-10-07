---
title: "Tasks: Build create-skill packet (heaviest; + parent-skill mode)"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "sk-doc create skill packet tasks"
  - "sk-doc parent phase 005 tasks"
importance_tier: "normal"
contextType: "implementation"
---
> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Tasks: Build create-skill packet (heaviest; + parent-skill mode)

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

- [ ] T001 Confirm the phase 004 shared/ backbone and facades landed (`../004-shared-backbone/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 Create create-skill/ SKILL.md + README.md + changelog/ (`.opencode/skills/sk-doc/create-skill/`)
- [ ] T003 Land references/skill_creation + the skill_creation/ subtree with the parent-hub method docs (`.opencode/skills/sk-doc/create-skill/references/`)
- [ ] T004 Land assets/skill/* (5 skill templates + 5 parent_skill_* templates) + the absorbed command templates (`.opencode/skills/sk-doc/create-skill/assets/skill/`)
- [ ] T005 Land scripts/{init_skill,package_skill}.py + inward symlinks (`.opencode/skills/sk-doc/create-skill/scripts/`)
- [ ] T006 Establish the root facades scripts/{init_skill,package_skill}.py and references/skill_creation/ (`.opencode/skills/sk-doc/`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Confirm the sibling-hub method-doc citations resolve unchanged
- [ ] T008 Run `validate.sh` for this folder
- [ ] T009 Confirm create-skill-parent routes as a second workflowMode over the same packet
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

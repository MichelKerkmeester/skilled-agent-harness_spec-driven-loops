---
title: "Tasks: Build create-agent packet"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "sk-doc create agent packet tasks"
  - "sk-doc parent phase 007 tasks"
importance_tier: "normal"
contextType: "implementation"
---
> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Tasks: Build create-agent packet

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
- [ ] T002 Confirm the 001 merge ruling keeps create-agent standalone (`../001-research-and-canon/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Create create-agent/ SKILL.md + README.md + changelog/ (`.opencode/skills/sk-doc/create-agent/`)
- [ ] T004 Land references/agent_creation.md (`.opencode/skills/sk-doc/create-agent/references/`)
- [ ] T005 Land assets/agent_template.md + inward symlinks (`.opencode/skills/sk-doc/create-agent/assets/`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 Confirm the template facade resolves unchanged
- [ ] T007 Run `validate.sh` for this folder
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

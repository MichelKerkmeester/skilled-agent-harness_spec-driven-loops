---
title: "Tasks: Build create-readme packet (install-guide variant folded)"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "sk-doc create readme packet tasks"
  - "sk-doc parent phase 006 tasks"
importance_tier: "normal"
contextType: "implementation"
---
> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Tasks: Build create-readme packet (install-guide variant folded)

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

- [ ] T002 Create create-readme/ SKILL.md + README.md + changelog/ (`.opencode/skills/sk-doc/create-readme/`)
- [ ] T003 Land references/{readme_creation,install_guide_creation}.md (`.opencode/skills/sk-doc/create-readme/references/`)
- [ ] T004 Land assets/readme/* including install_guide_template (`.opencode/skills/sk-doc/create-readme/assets/readme/`)
- [ ] T005 Land scripts/audit_readmes.py + inward symlinks (`.opencode/skills/sk-doc/create-readme/scripts/`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 Confirm the audit script and asset facades resolve unchanged
- [ ] T007 Run `validate.sh` for this folder
- [ ] T008 Confirm install-guide remains a variant of the README-authoring lifecycle
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

---
title: "Tasks: Build doc-quality workflow packet (workflow-axis anchor)"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "sk-doc doc quality packet tasks"
  - "sk-doc parent phase 012 tasks"
importance_tier: "normal"
contextType: "implementation"
---
> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Tasks: Build doc-quality workflow packet (workflow-axis anchor)

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
- [ ] T002 Confirm the 001 global-reference home split (`../001-research-and-canon/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Create doc-quality/ SKILL.md + README.md + changelog/ (`.opencode/skills/sk-doc/doc-quality/`)
- [ ] T004 Extract the DQI scoring + HVR-application procedure from the monolith SKILL.md (`.opencode/skills/sk-doc/doc-quality/SKILL.md`)
- [ ] T005 Symlink the shared pipeline inward (`.opencode/skills/sk-doc/doc-quality/`)
- [ ] T006 Apply the global-references home-split decision (`.opencode/skills/sk-doc/shared/references/`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Confirm the cited shared scripts and references resolve unchanged
- [ ] T008 Run `validate.sh` for this folder
- [ ] T009 Confirm no unique scripts or templates were added to the packet
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

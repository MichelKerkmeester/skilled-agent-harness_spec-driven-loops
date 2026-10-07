---
title: "Tasks: Anchor System Enforcement [system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/014-anchor-enforcement/tasks]"
description: "Reconstructed task list for the memory anchor format enforcement, derived from spec.md and git history. Task-level state was not recorded in those sources."
trigger_phrases:
  - "anchor system enforcement tasks"
  - "anchor format verification tasks"
importance_tier: "important"
contextType: "planning"
---
> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Tasks: Anchor System Enforcement

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
## Phase 1: Command documentation

- [ ] T001 Add the mandatory anchor generation step to the save command (`save.md`)
- [ ] T002 Add `anchorId` to the MCP signatures and the anchor-aware detail view (`search.md`)

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Skill and template alignment

- [ ] T003 Correct the anchor format documentation in the memory skill (workflows-memory `SKILL.md`)
- [ ] T004 Convert all 16 anchor references to the UPPERCASE format (`context_template.md`)

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T005 Verify the template carries the UPPERCASE anchors: `grep -c "ANCHOR:" .opencode/memory/templates/context_template.md` returns 16
- [ ] T006 Verify no lowercase anchors remain: `grep -c "anchor:" .opencode/memory/templates/context_template.md` returns 0

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

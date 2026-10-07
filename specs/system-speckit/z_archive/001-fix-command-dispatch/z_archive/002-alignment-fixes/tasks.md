---
title: "Tasks: Memory Command Alignment Fixes [system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/002-alignment-fixes/tasks]"
description: "Reconstructed task list for the memory command alignment fixes, derived from spec.md and git history. Task-level state was not recorded in those sources."
trigger_phrases:
  - "memory command alignment tasks"
  - "memory command alignment verification"
importance_tier: "important"
contextType: "planning"
---
> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Tasks: Memory Command Alignment Fixes

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
## Phase 1: UI formatting alignment

- [ ] T001 Replace double-line box characters with single-line characters across the memory command files (`search.md`, `status.md`, `triggers.md`, `cleanup.md`)
- [ ] T002 Make the HOME SCREEN dashboard the default when `/memory:search` is called without arguments (`search.md`)
- [ ] T003 Update the routing diagram with the HOME SCREEN default (workflows-memory `SKILL.md`)

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: MCP enforcement alignment

- [ ] T004 Add an MCP ENFORCEMENT MATRIX section to each command file (`search.md`, `status.md`, `triggers.md`, `cleanup.md`)
- [ ] T005 Replace inline bash with the `memory_stats` MCP call (`status.md`)
- [ ] T006 Replace inline bash with the `memory_list` MCP call (`triggers.md`)
- [ ] T007 Record the MCP matrix for `cleanup.md` and retain bash only for complex logic (`cleanup.md`)

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Reference alignment and verification

- [ ] T008 Update `AGENTS.md` with the `memory_list` and `memory_stats` tool references (`AGENTS.md`)
- [ ] T009 Verify single-line box drawings across all aligned command files
- [ ] T010 Verify every command file carries an MCP ENFORCEMENT MATRIX section
- [ ] T011 Verify the HOME SCREEN default and the native MCP tool calls in `status.md` and `triggers.md`

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

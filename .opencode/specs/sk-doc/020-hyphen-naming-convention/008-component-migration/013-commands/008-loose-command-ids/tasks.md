---
title: "Tasks: loose command ID naming (020 phase 008/013/008)"
description: "Bounded tasks for classifying root command files, preserving public IDs, and closing approved path references."
trigger_phrases:
  - "loose command naming tasks"
  - "root command ID tasks"
  - "command path contract tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/013-commands/008-loose-command-ids"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/013-commands/008-loose-command-ids"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored loose command tasks"
    next_safe_action: "Verify the root command loader contract"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Tasks: Loose command ID naming

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| [ ] | Pending |
| [x] | Completed |
| [P] | Parallelizable |
| [B] | Blocked |

A disposition task cannot be marked complete from filename intuition; it needs loader or tool-contract evidence.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] TSK-001 [P0] Capture BASE and candidate listings for the root command files and the compliant `prompt-improve.md` control.
- [ ] TSK-002 [P0] Inventory every occurrence of `agent_router.md`, `goal_opencode.md`, `/agent_router`, and `/goal_opencode`, separating filesystem paths from public IDs.
- [ ] TSK-003 [P0] Verify the active command-loader rule that maps a filename to a command ID.
- [ ] TSK-004 [P0] Verify goal-plugin test and runtime assumptions for the physical `goal_opencode.md` path.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] TSK-005 [P0] Record exactly one disposition for `agent_router.md` and `goal_opencode.md` in the frozen map.
- [ ] TSK-006 [P1] If approved, move each non-tool-mandated file to its kebab-case target and preserve the exact public command ID.
- [ ] TSK-007 [P1] Update every approved physical path consumer, including README, install-guide, loader, and plugin-test references.
- [ ] TSK-008 [P0] Leave tool-mandated names, plugin tool names, command IDs, frontmatter fields, and historical/frozen evidence exact.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] TSK-009 [P0] Exercise root command discovery and exact invocation of each preserved command ID.
- [ ] TSK-010 [P0] Run the goal plugin capability/path tests and any command-reference checker relevant to root files.
- [ ] TSK-011 [P1] Search for active old physical paths, classify historical prose, and run collision checks on approved targets.
- [ ] TSK-012 [P1] Attach the disposition map, contract evidence, test output, and path-scoped diff for `010-commands-gate`.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked [x]
- [ ] No [B] blocked tasks remain
- [ ] Both candidate dispositions are evidence-backed
- [ ] All approved path consumers resolve and exact command IDs still work
- [ ] No unresolved loader or tool-contract question remains
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decision record**: See `decision-record.md`
- **Blocking verifier**: See `checklist.md`
- **Governing policy**: See `../../../001-convention-policy-and-scope/decision-record.md`
- **Commands rollup**: See `../010-commands-gate/checklist.md`
<!-- /ANCHOR:cross-refs -->

---
title: "Tasks: Router Consistency Hardening [template:examples/level_1/tasks.md]"
description: "Task ledger for qualifying bare MCP tool names across 7 routers and correcting the sk-doc command_template router standard."
trigger_phrases:
  - "router consistency hardening tasks"
  - "qualify allowed-tools tasks"
  - "command template accuracy tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/004-shared-infrastructure/002-command-presentation-workflow-separation/008-router-consistency-hardening"
    last_updated_at: "2026-06-12T14:15:00Z"
    last_updated_by: "orchestrator-session"
    recent_action: "Committed 0c6c2bf897; render re-test 4/4 PASS under --command"
    next_safe_action: "None; phase complete"
---
# Tasks: Router Consistency Hardening

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

- [x] T001 Confirm canonical form `mcp__<server>__<tool>` from #44 + `opencode.json` (`.opencode/commands/`, `opencode.json`)
- [x] T002 Inventory the 7 bare/mixed routers and their exact `allowed-tools` lines (`.opencode/commands/`)

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Qualify 4 deep routers' `allowed-tools` (`.opencode/commands/deep/{ask-ai-council,start-context-loop,start-research-loop,start-review-loop}.md`)
- [x] T004 Qualify 3 speckit routers' `allowed-tools` (`.opencode/commands/speckit/{complete,implement,plan}.md`)
- [x] T005 Correct `command_template.md` §11 — two router variants + `mcp__` rule (`.opencode/skills/sk-doc/assets/command_template.md`)

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Bare-name scan clean across all routers (`.opencode/commands/`)
- [x] T007 Reference integrity unchanged 24/24; body prose untouched (`.opencode/commands/`)
- [x] T008 `validate.sh --strict` on this folder passes

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Zero bare MCP names in any router `allowed-tools`.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Summary**: See `implementation-summary.md`

<!-- /ANCHOR:cross-refs -->

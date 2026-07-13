---
title: "Tasks: reconcile the deep-* agents to create-agent (bless-the-dialect)"
description: "Task list for sanctioning the deep-loop agent dialect in create-agent without rewriting the six agents."
trigger_phrases:
  - "deep agent create-agent reconciliation"
  - "bless the deep-loop agent dialect"
  - "create-agent sanctioned section vocabulary"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/064-deep-command-family-parity/003-deep-agent-family-reconciliation"
    last_updated_at: "2026-07-13T14:30:00Z"
    last_updated_by: "claude"
    recent_action: "All tasks complete; verification gates green"
    next_safe_action: "Roll up the 064 parent"
---
# Tasks: reconcile the deep-* agents to create-agent (bless-the-dialect)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Map the create-agent contract + the six-agent dialect + create-command's variant mechanism [30m] [Evidence: discovery report confirmed dialect vocabulary in `agent_template.md` and the `create-command` Step 11 variant model]

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Core Documents
- [x] T002 Add the SKILL.md §3 sanctioned-dialect subsection (`create-agent/SKILL.md`) [15m]
- [x] T003 Add the template §9 dialect entry (`agent_template.md`) [10m]
- [x] T004 Add the template §2 MCP-tool-scoped permission-key note (`agent_template.md`) [10m]

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Unit Tests
- [x] T005 Re-validate all six deep-* agents [3m] [Evidence: `validate_document.py --type agent` reported `6 pass / 0 fail`]

### Integration Tests
- [x] T006 Run the create-agent skill packaging check [3m] [Evidence: `package_skill.py --check` returned `PASS`, 4 warnings all pre-existing]

### Manual Verification
- [x] T007 Confirm the six agent files show no diff for this phase [2m] [Evidence: `git status` shows no `.opencode/agents` or `.claude/agents` file modified]

### Documentation
- [x] T008 Confirm the sanction mirrors create-command's variant mechanism [3m] [Evidence: named shape + `agent_template.md` §9 enumeration + real-file pointers, matching `command_router_template.md` §3]

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`. [Evidence: `tasks.md` phase sections contain the completed task set]
- [x] No `[B]` blocked tasks remaining. [Evidence: `tasks.md` contains 0 blocked task markers]
- [x] Six agents pass and are unchanged. [Evidence: `validate_document.py --type agent` 6/0 and no agent-file diff]
- [x] Checklist.md fully verified. [Evidence: `checklist.md` Verification Summary records all P0/P1/P2 verified]

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->

---
title: "Tasks: Phase 2: Hardening and Tests [system-spec-kit/028-mcp-to-cli-tool-transition/001-spec-memory-cli/002-hardening-and-tests/tasks]"
description: "Planned task breakdown for Hardening and Tests; rows expand at speckit:plan time."
trigger_phrases:
  - "cli hardening tests tasks"
  - "dual spawn vitest tasks"
  - "cli parity suite tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-mcp-to-cli-tool-transition/001-spec-memory-cli/002-hardening-and-tests"
    last_updated_at: "2026-06-06T12:50:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase scaffolded in planned state"
    next_safe_action: "Run speckit:plan on this phase to expand the plan before implementation"
    blockers: []
    key_files:
      - "tasks.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Phase 2: Hardening and Tests

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

- [ ] T000 Verify predecessor handoff criteria and run speckit:plan for this phase
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T001 D1 dual-simultaneous-spawn vitest incl. divergent SPECKIT_IPC_SOCKET_DIR case (mcp_server tests)
- [ ] T002 D2 dual-client MCP+CLI vitest against one daemon (mcp_server tests)
- [ ] T003 D7 lifecycle coverage: stdin null, disconnect, fatalShutdown, bridge close, lease cleanup (mcp_server tests)
- [ ] T004 All-37 parity suite extension generated from TOOL_DEFINITIONS (mcp_server tests)
- [ ] T005 D5 exit-69 recovery documentation in CLI help/docs
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T9xx Full vitest run green; process-table assertion shows zero orphaned daemons/launchers post-suite; parity count locked at 37.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] P0 requirements in spec.md verified with evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research authority**: `../000-spec-memory-cli-research/research/research.md` (deltas and measurements)
<!-- /ANCHOR:cross-refs -->

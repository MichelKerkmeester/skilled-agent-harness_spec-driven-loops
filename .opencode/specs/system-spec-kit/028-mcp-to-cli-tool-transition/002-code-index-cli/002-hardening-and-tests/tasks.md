---
title: "Tasks: Phase 2: Hardening and Tests [system-spec-kit/028-mcp-to-cli-tool-transition/002-code-index-cli/002-hardening-and-tests/tasks]"
description: "Planned task breakdown for Hardening and Tests; rows expand at speckit:plan time."
trigger_phrases:
  - "code-index hardening and tests tasks"
  - "002 002-hardening-and-tests tasks"
  - "code-index phase 2 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-mcp-to-cli-tool-transition/002-code-index-cli/002-hardening-and-tests"
    last_updated_at: "2026-06-06T15:05:00Z"
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

- [ ] T001 D8 dual-client test: MCP client + CLI client against one daemon/socket (CLI secondary via the reconnecting proxy; assert replay + protocol-drift fail-closed)
- [ ] T002 D9 dual-spawn + dead-socket-respawn test: simultaneous CLI starts and takeover preserve a single owner, no stale locks; mk-code-index launcher EXITS on SIGTERM; pin SPECKIT_DAEMON_REELECTION
- [ ] T003 Blocked-read regression suite: stale-readiness paths for query/context/detect-changes assert blocked rendering in all formats
- [ ] T004 All-8 parity suite generated from CODE_GRAPH_TOOL_SCHEMAS
- [ ] T005 Process-table teardown assertions: zero orphaned daemons/launchers post-suite
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T9xx All suites green; zero orphaned processes post-suite; parity locked at 8
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
- **Research authority**: `../000-code-index-cli-research/research/research.md`
<!-- /ANCHOR:cross-refs -->

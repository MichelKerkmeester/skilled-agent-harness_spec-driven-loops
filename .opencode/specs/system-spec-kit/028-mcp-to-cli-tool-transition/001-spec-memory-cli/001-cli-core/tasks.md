---
title: "Tasks: Phase 1: CLI Core [system-spec-kit/028-mcp-to-cli-tool-transition/001-spec-memory-cli/001-cli-core/tasks]"
description: "Planned task breakdown for CLI Core; rows expand at speckit:plan time."
trigger_phrases:
  - "spec-memory cli core tasks"
  - "cli subcommand codegen tasks"
  - "spec-memory shim tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-mcp-to-cli-tool-transition/001-spec-memory-cli/001-cli-core"
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
# Tasks: Phase 1: CLI Core

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

- [ ] T001 Generate subcommand manifest from TOOL_DEFINITIONS (mcp_server)
- [ ] T002 Implement CLI entrypoint with Zod argv boundary and --json escape hatch (mcp_server/spec-memory-cli.ts)
- [ ] T003 Implement connect-falls-back-to-spawn over the launcher; wire --session-id and --timeout-ms (mcp_server/spec-memory-cli.ts)
- [ ] T004 Implement exit-code contract incl. 75 retryable and 69 fail-closed (mcp_server/spec-memory-cli.ts)
- [ ] T005 Author shim with dist-freshness guard and short-socket-dir default (.opencode/bin/spec-memory.cjs)
- [ ] T006 Wire package bin + smoke-invoke all 37 subcommands against a live daemon
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T9xx Manual invocation matrix across the 37 subcommands; exit-code spot checks for retryable vs terminal classes; warm-path timing sample vs the ~50ms p95 baseline.
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

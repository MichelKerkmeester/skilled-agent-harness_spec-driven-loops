---
title: "Tasks: Phase 3: Runtime Integration [system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/003-runtime-integration/tasks]"
description: "Task breakdown for Runtime Integration; rows reconciled with shipped runtime evidence."
trigger_phrases:
  - "code-index runtime integration tasks"
  - "002 003-runtime-integration tasks"
  - "code-index phase 3 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/003-runtime-integration"
    last_updated_at: "2026-06-10T06:00:00Z"
    last_updated_by: "claude-fable-5"
    recent_action: "T9xx transport-down drill passed; CLI dual-client + warm-only green"
    next_safe_action: "Phase complete"
    blockers: []
    key_files:
      - "tasks.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Phase 3: Runtime Integration

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

- [x] T000 Verify predecessor handoff criteria and run speckit:plan for this phase
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T001 Allowlist entries per runtime for the code-index shim
- [x] T002 Hook pairing (Claude Code, Codex): the code-graph-serving session adapters (`system-spec-kit/mcp_server/hooks/claude/session-prime`, `hooks/codex/session-start`) gain a CLI-backed warm-only path with `--timeout-ms`, fail-open, engaged on MCP-transport-down
- [x] T003 OpenCode plugin: REPAIR the bridge via the CLI/IPC-backed transport (an import-only repair was tried in 026/008 and REVERTED — it arms a direct-DB dual-writer; the bridge must never initialize the memory DB in-process), then add CLI fallback
- [x] T004 Docs: transport-down fallback guidance + maintenance-command policy (scan/apply/verify never from prompt-time hooks)
- [x] T005 Dual-stack verification window with rollback notes (CLI is additive) — window open, observation ongoing by design
- [x] T006 Dual-failure drill: MCP transport stopped + code-index daemon socket absent/dead → hook warm-only path performs NO cold spawn, fails open within the runtime hook timeout, surfaces exit-75 retryable status
- [x] T007 Correct the stale code-index DB-path note in `.codex/config.toml` — COMPLETED EARLY in 026/008-runtime-defect-fixes
- [x] T008 Runtime-config inventory verification: live hook configs modified as scoped; MCP configs diff-verified unchanged
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T9xx Transport-down drill passes end-to-end in ≥2 runtimes; plugin functional; window observations recorded — PASS: code-index CLI dual-client green across 3 rounds (stress 434) + warm-only no-spawn 60/60 exit-75 (stress 435); mk-code-graph bridge CLI/IPC route verified; launcher delta 0; covered alongside the Claude+Codex hook drill (shared warm-only fallback contract)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] P0 requirements in spec.md verified with evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research authority**: `../000-code-index-cli-research/research/research.md`
<!-- /ANCHOR:cross-refs -->
